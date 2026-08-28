# Zálohy a obnova databáze partnerského portálu

Runbook k workflow [`.github/workflows/db-backup.yml`](../../.github/workflows/db-backup.yml).

Návaznost: `docs/crm-portal/NAVRH.md` 3.6 (zálohy) a 2.x (dva endpointy Neonu),
`docs/crm-portal/IMPLEMENTACNI_PLAN.md` 5 a 9 (env kontrakt).

> **Repozitář je veřejný.** V tomto adresáři ani nikde jinde v gitu není a nikdy nesmí být
> connection string, R2 klíč ani privátní age klíč. Všechny hodnoty žijí výhradně
> v GitHub Secrets a v offline trezoru vlastníka.

---

## 1. Co workflow dělá a kdy běží

Každý den v **02:17 UTC** (`cron: '17 2 * * *'`) proběhne v GitHub Actions:

1. **Kontrola secrets** — chybí-li kterýkoli ze šesti, běh skončí hned a se jmennou hláškou.
2. **Instalace nástrojů** — `postgresql-client-18` z oficiálního PGDG apt repa (Neon jede
   na PostgreSQL 18, `pg_dump` musí být stejné nebo vyšší major verze než server)
   a `age`.
3. **`pg_dump --format=custom`** celé databáze z **přímého** Neon endpointu.
   Workflow aktivně odmítne `DATABASE_URL_DIRECT`, které míří na pooler
   (`-pooler` v hostname) — přes PgBouncer by dump neprošel spolehlivě.
4. **Kontrola dumpu** — nesmí být menší než 4 kB a `pg_restore --list` ho musí přečíst
   (chytí useknutý nebo prázdný soubor dřív, než se nahraje).
5. **Šifrování** `age -r <veřejný klíč>`. Od tohoto okamžiku je záloha čitelná
   jen privátním klíčem vlastníka — GitHub ani Cloudflare ji rozšifrovat nedokážou.
   Nezašifrovaný dump se z runneru hned maže (`shred`).
6. **Nahrání do Cloudflare R2** a ověření, že velikost objektu v R2 odpovídá lokální.
7. **Retence** — smaže denní starší 30 dní a měsíční nad počet 12.

### Cesty v bucketu

| Kdy | Objekt |
|---|---|
| každý den | `backups/daily/portal-YYYY-MM-DD.dump.age` |
| 1. den v měsíci navíc | `backups/monthly/portal-YYYY-MM.dump.age` |

Měsíční kopie se řídí **datem běhu**, ne cronem — když se 1. dne spustí workflow ručně,
měsíční kopie vznikne také.

### Ruční spuštění

**Actions → DB backup (portal) → Run workflow.** Používá se pro první ostrý test po vložení
secrets a pro doběh po výpadku.

### Bezpečnostní zábradlí v workflow

- `set -x` je zakázané a nikde se nepoužívá — vypsalo by do veřejného logu heslo
  z connection stringu.
- Connection string se nikdy nepředává na příkazové řádce. Uvnitř jediného kroku se
  rozloží na standardní libpq proměnné (`PGHOST`, `PGPASSWORD`, …), které zůstávají
  jen v paměti daného procesu — nejdou do `$GITHUB_ENV` ani na disk.
- Záloha se **nikdy** neukládá jako GitHub artefakt; jde rovnou do R2.
- Privátní age klíč v workflow není. CI umí zálohu jen vytvořit, ne přečíst.
- Retence maže výhradně objekty, jejichž klíč **přesně** odpovídá vzoru
  `backups/daily/portal-YYYY-MM-DD.dump.age`, resp.
  `backups/monthly/portal-YYYY-MM.dump.age`. Cokoli jiného v bucketu (nahrané Excely,
  CSV z veletrhu, ručně pojmenované kopie) se vypíše do logu s poznámkou „NEMAŽU“
  a zůstane nedotčené.

---

## 2. GitHub Secrets

**Settings → Secrets and variables → Actions → New repository secret.**
Do gitu nepatří ani jedna hodnota.

| Secret | Co to je | Odkud |
|---|---|---|
| `DATABASE_URL_DIRECT` | **Přímý** Neon endpoint (adresa **bez** `-pooler`), včetně `sslmode=require&channel_binding=require` | Neon konzole → Connection Details, přepnout na *Direct connection* |
| `BACKUP_AGE_PUBLIC_KEY` | age **recipient**, řetězec `age1…`. Veřejná část, není to tajemství — jako secret je vedený jen kvůli přehlednosti | viz sekce 3 |
| `R2_ENDPOINT` | `https://<account-id>.eu.r2.cloudflarestorage.com` — **bez** názvu bucketu | Cloudflare → R2 → Manage API Tokens |
| `R2_ACCESS_KEY_ID` | Access Key ID R2 tokenu | tamtéž |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key R2 tokenu | tamtéž (zobrazí se jen jednou) |
| `R2_BUCKET` | Název bucketu se zálohami | Cloudflare → R2 |

R2 token má mít práva **Object Read & Write** omezená na tento jediný bucket — nic víc.
Bucket musí mít nastavenou **EU jurisdikci** (NAVRH 3.7: data neopouštějí EU).

---

## 3. Klíčový pár age

Šifrování je asymetrické. **Veřejný klíč** šifruje (ten smí být v CI), **privátní klíč**
dešifruje (ten v CI být nesmí — jinak by kompromitace GitHubu znamenala i únos dat).

### Vygenerování — jednorázově, na vlastním počítači, ne v CI

```bash
umask 077
age-keygen -o ~/marienbad-backup-key.txt
```

Výstup na terminál:

```
Public key: age1m036n4lanuucmfvyfsrz64qwnnujvcyrsw5f8puyjpdlxg78tfcqey3rfq
```

Soubor `marienbad-backup-key.txt` obsahuje obojí:

```
# created: 2026-08-28T10:10:15Z
# public key: age1m036n4lanuucmfvyfsrz64qwnnujvcyrsw5f8puyjpdlxg78tfcqey3rfq
AGE-SECRET-KEY-1……………                 ← PRIVÁTNÍ, nikdy nikam neposílat
```

Veřejný klíč jde ze souboru kdykoli dopočítat, není nutné si ho pamatovat:

```bash
age-keygen -y ~/marienbad-backup-key.txt
```

### Kam co patří

| Část | Kam | Kam NIKDY |
|---|---|---|
| Veřejná (`age1…`) | GitHub Secret `BACKUP_AGE_PUBLIC_KEY` | — |
| Privátní (`AGE-SECRET-KEY-…`) | Správce hesel vlastníka **a** offline kopie (vytištěná nebo na šifrovaném USB) mimo byt/kancelář | git, GitHub Secrets, Vercel, chat, e-mail, cloud disk |

> **Bez privátního klíče jsou všechny zálohy nenávratně nečitelné.** Šifrování nemá zadní
> vrátka. Proto dvě kopie na dvou místech — ztráta klíče je stejná ztráta dat jako
> smazání bucketu.

Workflow hlídá, že do `BACKUP_AGE_PUBLIC_KEY` někdo omylem nevložil privátní klíč:
hodnota začínající `AGE-SECRET-KEY-` běh okamžitě shodí.

---

## 4. Obnova ze zálohy — krok za krokem

> **Nikdy neobnovuj rovnou do produkce.** `pg_restore --clean` napřed *maže* existující
> objekty; při omylu nebo poškozeném dumpu přijdeš i o to, co v produkci ještě bylo.
> Obnovuj vždy do **nové Neon branche**, tam obsah ověř, a teprve pak branch povyš
> na produkční (Neon → branch → *Set as default*), případně data přenes cíleně.

Potřebuješ: `age`, `postgresql-client-18`, `aws` CLI a privátní klíč z trezoru.

### 4.1 Vytvoř cílovou Neon branch

Neon konzole → projekt portálu → **Branches → New branch**, pojmenuj třeba
`restore-test-2026-08-28`. Zkopíruj si její **přímý** connection string
(Connection Details → *Direct connection*, bez `-pooler`).

Branch vytvořená z produkce s sebou nese i role `neondb_owner` a `portal_app` — to je
důležité, protože dump obsahuje `GRANT`y a RLS politiky, které se na tyto role odkazují.

### 4.2 Najdi a stáhni zálohu z R2

```bash
export AWS_DEFAULT_REGION=auto
export AWS_EC2_METADATA_DISABLED=true
export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required
export AWS_ACCESS_KEY_ID=…            # R2 token, stačí read-only
export AWS_SECRET_ACCESS_KEY=…
export R2_ENDPOINT=https://<account-id>.eu.r2.cloudflarestorage.com
export R2_BUCKET=<bucket>

# co je k dispozici
aws s3 ls "s3://$R2_BUCKET/backups/daily/"   --endpoint-url "$R2_ENDPOINT"
aws s3 ls "s3://$R2_BUCKET/backups/monthly/" --endpoint-url "$R2_ENDPOINT"

# stažení konkrétního dne
aws s3 cp "s3://$R2_BUCKET/backups/daily/portal-2026-08-28.dump.age" . \
  --endpoint-url "$R2_ENDPOINT"
```

> Proměnné `AWS_*_CHECKSUM_*` nejsou kosmetika: AWS CLI v2 od verze 2.23 posílá
> CRC32 checksumy, které R2 neumí, a přenos bez nich skončí chybou.

### 4.3 Dešifruj

```bash
umask 077
age -d -i ~/marienbad-backup-key.txt -o portal.dump portal-2026-08-28.dump.age
```

Kontrola, že je to opravdu čitelný archiv (vypíše obsah, nic nemění):

```bash
pg_restore --list portal.dump | head -30
```

### 4.4 Obnov do branche

```bash
export RESTORE_URL='postgresql://neondb_owner:…@ep-….eu-central-1.aws.neon.tech/neondb?sslmode=require'

pg_restore --clean --if-exists --no-owner \
  --dbname "$RESTORE_URL" \
  portal.dump
```

Poznámky, které ušetří půl hodiny hádání:

- **`--clean --if-exists`** je nutné, když do branche obnovuješ opakovaně. Do úplně
  čerstvé prázdné databáze vypíše `--clean` neškodné hlášky „does not exist, skipping“.
- **`--no-owner`** doporučuji, když obnovuješ do jiného Neon projektu, kde se role
  jmenuje jinak. Do branche téhož projektu ho můžeš vynechat.
- **Role `portal_app`.** Když cílová databáze tuto roli nemá (obnova do zbrusu nového
  projektu), selžou `GRANT` a `CREATE POLICY` příkazy. Buď ji předem založ
  (`CREATE ROLE portal_app LOGIN;` a heslo nastav v Neon konzoli — nikdy v SQL,
  viz `db/migrations/0001_base.sql`), nebo přidej `--no-privileges` a práva doplň
  spuštěním migrací.
- **Append-only audit log neblokuje obnovu.** Trigger `audit_log_immutable` odmítá jen
  `UPDATE` a `DELETE`; `pg_restore` plní tabulku přes `COPY`, takže projde. Kdyby se
  přesto ozval, restore skončí s chybou — a to je dobrá zpráva, znamená to, že ochrana
  z auditu N-09 funguje.
- **Nenulový exit kód sám o sobě nemusí znamenat katastrofu.** `pg_restore` vrací
  chybu i za varování o vlastnictví objektů. Rozhodující je ověření v 4.5, ne exit kód.
- Chceš-li obnovu bez mezisouboru na disku, jde to i rourou
  (`age -d -i key.txt záloha.age | pg_restore --clean --if-exists -d "$RESTORE_URL"`),
  ale přijdeš o `pg_restore --list` a o paralelní režim `-j` — ten potřebuje soubor,
  ve kterém se dá skákat. Pro rutinní obnovu zůstaň u souboru.

### 4.5 Ověř obsah — tohle je vlastní test, ne formalita

```bash
psql "$RESTORE_URL" -f - <<'SQL'
\echo '--- počty řádků klíčových tabulek ---'
SELECT 'portal_users'    AS tabulka, count(*) FROM crm.portal_users
UNION ALL SELECT 'user_tokens',      count(*) FROM crm.user_tokens
UNION ALL SELECT 'portal_sessions',  count(*) FROM crm.portal_sessions
UNION ALL SELECT 'auth_events',      count(*) FROM crm.auth_events
UNION ALL SELECT 'audit_log',        count(*) FROM crm.audit_log
ORDER BY 1;

\echo '--- stáří dat: nejnovější záznam v audit logu ---'
SELECT max(at) AS posledni_audit, now() - max(at) AS stari FROM crm.audit_log;

\echo '--- RLS musí být zapnutá i vynucená všude (5x t | t) ---'
SELECT relname, relrowsecurity, relforcerowsecurity
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'crm' AND c.relkind = 'r'
ORDER BY relname;

\echo '--- politiky a append-only trigger přežily obnovu ---'
SELECT count(*) AS pocet_politik FROM pg_policies WHERE schemaname = 'crm';
SELECT tgname FROM pg_trigger
WHERE tgrelid = 'crm.audit_log'::regclass AND NOT tgisinternal;
SQL
```

Co musí sedět:

- počty řádků odpovídají produkci (u `portal_users` znáš číslo zpaměti; u ostatních
  porovnej se stejným dotazem proti produkční databázi),
- `max(at)` v `audit_log` je nejvýš o den starší než čas zálohy — to je **doložené RPO**,
- všech pět tabulek má `relrowsecurity = t` **i** `relforcerowsecurity = t`,
- `pg_policies` vrací nenulový počet a trigger `audit_log_immutable` existuje.

Kdyby se sloupce nebo tabulky změnily pozdějšími migracemi, dotaz uprav — seznam výše
odpovídá `db/migrations/0001_base.sql`.

### 4.6 Úklid

```bash
shred -u portal.dump                   # nezašifrovaný dump nenechávej ležet
rm -f portal-2026-08-28.dump.age
```

A v Neon konzoli **smaž testovací branch**, ať nežere kvótu free plánu.

---

## 5. Čtvrtletní zkouška obnovy

NAVRH 3.6 to říká natvrdo: součástí dokumentace je *vyzkoušený* postup, a zkouška obnovy
je čtvrtletní rutina. Záloha, ze které se nikdy nezkoušelo obnovit, není záloha.

**Termíny:** leden, duben, červenec, říjen — vždy v prvním týdnu. Zapiš do kalendáře.

Checklist (projít celý, ne jen odškrtat):

- [ ] V R2 sedí počty: `backups/daily/` má ~30 objektů, `backups/monthly/` nejvýš 12.
- [ ] Nejnovější denní záloha má dnešní nebo včerejší datum.
- [ ] Privátní age klíč je čitelný z **obou** míst (správce hesel i offline kopie).
- [ ] Stažení a dešifrování náhodně vybrané zálohy proběhlo (sekce 4.2–4.3).
- [ ] `pg_restore --list` vypsal rozumný obsah.
- [ ] Obnova do nové Neon branche doběhla (sekce 4.4).
- [ ] Ověřovací dotazy z 4.5 souhlasí — počty řádků, RLS, politiky, trigger.
- [ ] Vyzkoušeno i **přihlášení do portálu** proti obnovené branchi (auth tabulky jsou
      k ničemu, když se přes ně nedá projít).
- [ ] Testovací branch smazána, lokální soubory uklizeny.
- [ ] Změřen a zapsán **čas celé obnovy** — to je reálné RTO, dobré vědět předem.
- [ ] Zkouška zapsána do `docs/crm-portal/STAV.md`: datum, kdo, doba obnovy, nálezy.

Když cokoli z toho neprojde, je to incident — řeš hned, ne „až bude čas“.

---

## 6. Rotace tajemství

Vše se mění na jediném místě: **Settings → Secrets and variables → Actions**, klik na
secret → *Update*. Workflow se nemění, po rotaci ho jen spusť ručně a ověř, že projde.

### R2 klíče (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`)

Doporučeně jednou ročně a **vždy okamžitě** při podezření na únik.

1. Cloudflare → R2 → **Manage API Tokens** → vytvoř *nový* token (Object Read & Write,
   omezený na bucket se zálohami).
2. Aktualizuj oba GitHub Secrets.
3. **Actions → Run workflow** a počkej na zelený běh — teprve tím je ověřeno, že nový
   token funguje.
4. Teprve pak starý token v Cloudflare zruš. (Pořadí je důležité: kdo zruší dřív,
   zůstane den bez zálohy.)

### `DATABASE_URL_DIRECT`

Mění se po resetu hesla role v Neonu (Neon → Branches → *Roles* → *Reset password*),
což je podle NAVRH 2.x jednorázový úkol i před ostrým spuštěním.

1. Reset hesla v Neon konzoli, zkopíruj nový **přímý** connection string.
2. Aktualizuj GitHub Secret `DATABASE_URL_DIRECT`.
3. Nezapomeň, že aplikace používá **jiný** string (pooler, `DATABASE_URL`) a ten se mění
   ve **Vercelu**, ne tady. Reset hesla role zneplatní obojí — aktualizuj oba, jinak
   spadne buď záloha, nebo web.
4. Ruční běh workflow na ověření.

### Klíčový pár age

Rotace je nákladná — starší zálohy zůstanou zašifrované **starým** klíčem, takže ten
musíš dál držet po celou dobu jejich retence (až 12 měsíců u měsíčních).

1. Vygeneruj nový pár (sekce 3), starý soubor **nemaž**, přejmenuj na
   `marienbad-backup-key-2026.txt` a nech v trezoru.
2. Aktualizuj `BACKUP_AGE_PUBLIC_KEY` novým `age1…`.
3. Ruční běh workflow.
4. Ověř, že nová záloha jde dešifrovat **novým** klíčem, a poznamenej si datum přechodu —
   podle něj poznáš, který klíč na kterou zálohu.
5. Starý privátní klíč zahoď až poté, co poslední záloha jím zašifrovaná vypadne z retence.

---

## 7. RPO 24 h — co to znamená

**RPO (Recovery Point Objective) je 24 hodin.** V nejhorším případě — havárie těsně před
půlnocí UTC — se ztratí práce celého jednoho dne, protože poslední záloha je z 02:17
téhož dne.

Je to vědomá výměna, ne opomenutí (NAVRH 3.6): proti Point-in-Time Recovery z placeného
tarifu je to krok zpět, ale u nástroje, kde se data mění pár dnů v měsíci, je den práce
přijatelná ztráta za 0 Kč.

Dvě věci, které je k tomu potřeba vědět:

- **Free plán Neonu drží historii jen ~6 hodin zpět.** Tyhle zálohy tedy nejsou druhá
  vrstva nad Neonem — pro cokoli staršího než 6 hodin jsou **jediná** záchrana.
- **Před rizikovou operací** (migrace schématu, hromadný import, čištění dat) spusť
  workflow ručně. Záloha stará pět minut je lepší než záloha stará dvacet hodin.

Pokud RPO 24 h přestane stačit, jsou ve hře tři možnosti v tomto pořadí ceny:
druhý běh workflow během dne (např. i v 14:17 UTC, stačí přidat řádek do `cron`),
zkrácení intervalu, nebo upgrade Neonu na tarif s PITR.

---

## 8. Když workflow spadne

GitHub pošle vlastníkovi repozitáře e-mail automaticky; workflow navíc do **Summary**
vypíše shrnutí s nejčastějšími příčinami.

| Krok, který zčervenal | Nejpravděpodobnější příčina |
|---|---|
| Kontrola nastavených secrets | chybí nebo je prázdný některý ze šesti secrets |
| pg_dump | vypršelé heslo Neonu, uspaná/smazaná branch, nebo `DATABASE_URL_DIRECT` míří na pooler |
| Nahrání do R2 | odvolané R2 klíče, špatný `R2_ENDPOINT` (má být bez názvu bucketu) nebo `R2_BUCKET`, vyčerpaná kapacita |
| Retence | tytéž R2 příčiny — záloha sama je v takovém případě už nahraná a v pořádku |

Po opravě vždy **Run workflow** ručně, ať den nezůstane bez zálohy. Když workflow selže
dvakrát po sobě, ověř podle sekce 4, že poslední záloha v R2 opravdu jde obnovit —
tichá řada selhání je přesně ten scénář, kdy se na nefunkční zálohy přijde pozdě.

---

## 9. Přerůstání free plánů

### Cloudflare R2 — 10 GB zdarma

V bucketu je nejvýš 42 záloh (30 denních + 12 měsíčních). Strop 10 GB tedy odpovídá
zhruba **240 MB na jednu zálohu** — a to ještě sdíleně s nahranými Excely a CSV,
které podle NAVRH 5.3 leží ve stejném bucketu.

Kolik reálně zabíráš:

```bash
aws s3 ls "s3://$R2_BUCKET/backups/" --recursive --summarize \
  --endpoint-url "$R2_ENDPOINT" | tail -3
```

Když se blížíš stropu, v tomto pořadí:

1. Ověř, že retence opravdu maže — v logu posledního běhu musí být „smazáno“, ne jen
   „ponecháno“. Nejčastější příčina růstu je retence, která kvůli chybějícím právům
   R2 tokenu tiše nic nemaže (workflow v takovém případě zčervená — nepřehlédni to).
2. Zkrať denní retenci v `.github/workflows/db-backup.yml` (`DAILY_RETENTION_DAYS`).
   30 → 14 uspoří skoro polovinu a RPO to nezmění.
3. Přesuň staré Excely/CSV do samostatného bucketu, ať zálohy nesoutěží s přílohami.
4. Teprve pak placený R2 (řádově jednotky dolarů měsíčně za desítky GB).

**Nikdy** nešetři na měsíčních zálohách — dvanáct kopií po 12 měsíců je celá dlouhá paměť
systému a zabírají zlomek toho, co denní.

### GitHub Actions

Dokud je repozitář **veřejný**, minuty na standardních runnerech se nefakturují —
poznámka o „2000 free minutách“ v NAVRH 9 platí až pro privátní repozitář. Kdyby se repo
někdy privatizovalo, denní běh (jednotky minut) je z toho rozpočtu stále zanedbatelný.

Skutečné omezení je jiné: **naplánovaná workflow se v neaktivním repozitáři po 60 dnech
bez commitu automaticky vypnou.** U repozitáře, kde se aktivně pracuje, to nehrozí;
kdyby portál na dva měsíce zamrzl, zkontroluj v Actions, že workflow není *disabled*.
Čtvrtletní zkouška z sekce 5 to odhalí.
