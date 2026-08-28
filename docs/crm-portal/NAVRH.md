# Návrh: Partnerský portál — CRM cestovních kanceláří a partnerů + newsletter

> **Poznámka ke kopii v gitu:** repozitář je veřejný, proto jsou v této kopii
> redigovány konkrétní obchodní údaje (obraty jmenovitých partnerů, identifikátory
> účtů a infrastruktury, jména fyzických osob) a nahrazeny zástupnými příklady.
> Na architekturu, datový model ani postup implementace nemá redakce žádný vliv.
> Plné znění drží vlastník mimo git.

**Stav:** návrh k odsouhlasení (nic zatím není naimplementováno) · prošlo bezpečnostním
auditem 28. 8. 2026 — nálezy a jejich zapracování viz `BEZPECNOSTNI_AUDIT.md`;
struktura skupin v MailerLite (5.7) už je založená
**Rozsah:** rozšíření stávajícího webu marienbad.com o neveřejnou aplikaci `/portal`
**Datum:** srpen 2026

---

## 1. Co to bude

Neveřejná část webu (`marienbad.com/portal`), do které se přihlásí jen pozvaní lidé.
Uvnitř je osm věcí:

| Modul | Co umí |
|---|---|
| **CRM partnerů** | Evidence CK, touroperátorů, korporátů a pojišťoven. Kontaktní osoby, historie komunikace, segmentace, vlastník vztahu. |
| **Newsletter** | Claude připraví návrh → člověk ho zkontroluje a schválí → odešle se přes MailerLite → přesná odeslaná verze se archivuje v databázi. |
| **Statistiky rozesílek** | Jednou měsíčně se automaticky stáhnou výsledky (doručeno, otevření, prokliky, odhlášení) a uloží se do historie. |
| **Výkonnost partnerů** | Nahrání měsíčního Excelu → validace → uložení do databáze. |
| **Srovnání období** | Automatické srovnání měsíc/měsíc, meziročně a klouzavých 12 měsíců — pro každého partnera i celkově. |
| **Import z veletrhu** | Nahrání CSV z veletrhu (ITB, Holiday World) → odstranění duplicit proti CRM → založení nových partnerů jako `prospect`. |
| **Dashboard výkonnosti** | Firemní přehled přes všechny partnery: KPI, trendy, rozpad podle segmentu a země, největší pohyby, koncentrace obratu. |
| **Ověření partnerů** | Automatická lustrace v Hlídači státu — insolvence, nespolehlivý plátce DPH, trestní rejstřík právnických osob. |

Vše za přihlášením, více uživatelských účtů s různými právy, hesla nikde v otevřené podobě.

---

## 2. Architektura

Žádná nová platforma. Portál je součástí stávajícího Astro projektu a využívá to, co už je
nasazené nebo připravené:

```
                         ┌──────────────────────────────────────┐
   Prohlížeč             │  marienbad.com  (Astro 5 SSR, Vercel │
   (uživatel portálu) ───┤  region fra1)                        │
                         │                                      │
                         │  /de /en /cs /ru  ← veřejný web      │
                         │  /keystatic       ← Keystatic CMS    │
                         │  /portal/*        ← NOVÉ, za heslem  │
                         │  /api/portal/*    ← NOVÉ, serverové  │
                         └───────┬──────────────────────┬───────┘
                                 │                      │
                    ┌────────────▼─────────┐   ┌────────▼──────────┐
                    │  Neon Postgres (EU,  │   │  MailerLite API   │
                    │  Frankfurt, free)    │   │  connect.mailer…  │
                    │  + vlastní auth      │   │  kampaně + statis.│
                    │    vrstva v Astro    │   └───────────────────┘
                    └──────────────────────┘   ┌───────────────────┐
                    ┌──────────────────────┐   │                   │
                    │  Cloudflare R2 (EU)  │   │                   │
                    │  soubory + zálohy DB │   │                   │
                    └──────────────────────┘   │                   │
                                               │  Hlídač státu API │
                                               │  insolvence, DPH, │
                                               │  trestní rejstřík │
                                               └───────────────────┘
                                 ▲
                    ┌────────────┴─────────┐
                    │  Vercel Cron         │
                    │  1× měsíčně          │
                    └──────────────────────┘

   Počítač marketingu                    ┌──────────────────────────────┐
   ┌──────────────────────┐              │  /api/portal/intake/…        │
   │ Statistický dashboard│──── push ───▶│    výkonnost partnerů z PMS  │
   │ LLML (Python engine) │              │  /api/portal/export/…        │
   │ PMS + forecast       │◀─── pull ────│    segment, tier, riziko     │
   └──────────────────────┘              └──────────────────────────────┘
              (viz sekce 6 — obojí strojovou cestou, bearer token)
```

**Proč Neon, a ne Supabase (změna proti první verzi návrhu):** původní návrh počítal
s existujícím projektem v Supabase, což by ale znamenalo tarif Pro (~25 USD/měs.) —
free tarif Supabase projekt po týdnu nečinnosti **uspí a probouzí se ručně z konzole**,
což je pro portál používaný párkrát měsíčně nepoužitelné. Neon řeší přesně tenhle
problém jinak: free plán (512 MB, region Frankfurt) se při nečinnosti uspává, ale
**probouzí se sám při prvním připojení** (studený start ~1 s, u portálu otevíraného
párkrát měsíčně nepostřehnutelný). CRM se stovkami partnerů a měsíčními statistikami
zabere jednotky MB — soubory jdou mimo databázi do Cloudflare R2 (free, 10 GB, EU).
Měsíční náklady varianty: **0 Kč**. A protože je to obyčejný Postgres, případný pozdější
přesun (na Supabase, VPS, kamkoli) je jeden `pg_dump` — nic nezamyká.

Co s Neonem odpadá a musí se postavit vlastní: **auth vrstva** (Supabase Auth byla
hotová služba). Detail v 3.1 — používají se prověřené knihovny, ne vlastní kryptografie,
a fáze 0 je o ~2 dny delší. Výměnou je jednodušší model hrozeb: databáze nemá vůbec
žádné veřejné API, sahá na ni jen server přes jeden connection string.

**Proč ne Keystatic:** Keystatic ukládá obsah jako soubory do gitu. Data o obchodních
výsledcích partnerů a kontaktní údaje v gitu být nesmí — jsou to citlivá data a git historie
se nedá smazat. CRM patří do databáze s řízeným přístupem.

### 2.1 Umístění portálu — a jedno upozornění

Doporučuji **stejnou aplikaci, cesta `/portal`**. Je to nejjednodušší na provoz i nasazení.

Poctivě ale k reziduálnímu riziku: portál pak sdílí origin s veřejným webem. Kdyby se na
veřejné stránce objevila XSS zranitelnost, útočník by z ní mohl volat `/api/portal/*` se
session přihlášeného uživatele. Současná CSP veřejného webu má u skriptů `'unsafe-inline'`
(kvůli GA4), což je pro tento scénář nejslabší místo.

**Proto je součástí návrhu (fáze 8) přechod veřejné CSP na nonce**, tj. odstranění
`'unsafe-inline'` u `script-src`. To se vyplatí udělat tak jako tak. Alternativa s ještě
tvrdší izolací je samostatná subdoména `portal.marienbad.com` jako oddělený Vercel projekt —
dražší na údržbu, uvádím ji jako možný pozdější krok, ne jako výchozí volbu.

### 2.2 Databáze — provozní instrukce (projekt už existuje)

Neon projekt byl založen 28. 8. 2026 a spojení je ověřené:

| | |
|---|---|
| Projekt | **EnsanaPortal**, organizace Ensana (ID projektu viz Neon konzole) |
| Region | `aws-eu-central-1` (Frankfurt) — v EU, jak vyžaduje 3.7 |
| PostgreSQL | 18.6 |
| Databáze / limit | `neondb` · 512 MB (free plán) |
| Endpoint | viz Neon konzole (identifikátory redigovány — veřejný repozitář) |

**Kam patří connection string — a kam nikdy:**

- **Produkce:** Vercel env proměnná `DATABASE_URL` (bez prefixu `PUBLIC_`).
- **Lokální vývoj:** `.env.local` (je v `.gitignore`).
- **Nikam jinam.** Ne do gitu, ne do tohoto dokumentu, ne do chatů a e-mailů. Connection
  string obsahuje heslo — je to tajemství jako každé jiné z 3.4.

**Dva endpointy, dva účely.** Aplikace se připojuje přes **pooler** (`…-pooler.c-6…`,
PgBouncer) — serverless funkce jinak vyčerpají spojení. Migrace a `pg_dump` jdou naopak
na **přímý** endpoint (stejná adresa bez `-pooler`), protože pooled spojení nepodporuje
všechny session příkazy. V connection stringu se drží `sslmode=require` i
`channel_binding=require`.

**Role.** `neondb_owner` slouží jen pro migrace a zálohy. Aplikace dostane vlastní roli
`portal_app` s minimálními právy (SELECT/INSERT/UPDATE na schéma `crm`, žádné DDL,
žádný BYPASSRLS) — vzniká v první migraci fáze 0 a je předpokladem, aby RLS z 3.3
fungovala jako skutečná druhá vrstva, ne jako divadlo.

> **Jednorázový úkol před spuštěním:** heslo, kterým byl projekt založen, prošlo při
> předávání chatem — před ostrým provozem se v konzoli Neonu resetuje
> (branch → Roles → Reset password) a nový string se vloží už jen do Vercelu
> a `.env.local`. Od té chvíle ho nikdy nikdo nemusí vidět celý.

> Drobnost z ověření: free plán má historii pro obnovu jen ~6 hodin zpět — denní zálohy
> z 3.6 tedy nejsou formalita, ale jediná skutečná záchrana. Zálohovací job je proto
> součástí fáze 0, ne „někdy potom".

---

## 3. Bezpečnostní model

Tohle je jádro zadání, proto podrobněji. Princip je **obrana do hloubky** — každá vrstva
předpokládá, že ta předchozí selhala.

### 3.1 Hesla a účty

**Heslo se nikde neukládá.** Ukládá se jen jeho jednosměrný otisk (argon2id s unikátní
solí — dnešní doporučený standard) v tabulce `portal_users`. Z otisku se heslo zpětně
nedá získat.

Auth je po odchodu ze Supabase **vlastní vrstva v Astro** — postavená z prověřených
knihoven (argon2 na otisky, `otplib` na TOTP), žádná vlastní kryptografie. Konkrétně:

- heslo **není** v repozitáři, v `.env`, ve Vercel proměnných, v Keystaticu ani v čitelné
  podobě v žádné tabulce;
- **ani správce portálu heslo nikoho nevidí** — reset se dělá jednorázovým odkazem na e-mail
  (podepsaný token s krátkou platností, jednorázové použití);
- registrace je **vypnutá**. Účet vzniká jen pozvánkou od správce; pozvaný si heslo nastaví sám;
- minimální délka 12 znaků + kontrola proti databázi uniklých hesel přes **HaveIBeenPwned
  range API** (k-anonymita: posílá se jen prefix otisku, nikdy heslo; API je zdarma);
- **dvoufázové ověření (TOTP) povinné pro všechny účty.** Aplikace typu Google Authenticator
  nebo 1Password. Samotné ukradené heslo pak k ničemu není. U dat o obchodní výkonnosti
  partnerů to považuji za nutnost, ne za nadstandard;
- omezení počtu pokusů o přihlášení implementované v aplikaci: exponenciální zpomalení
  po neúspěších na účet i IP, e-mail správci při opakování — stejná pravidla jako mají
  strojové cesty (3.3, bod 10).

**Session:** cookie s příznaky `HttpOnly` (JavaScript ji nepřečte), `Secure` (jen přes HTTPS),
`SameSite=Lax`, prefix `__Host-`. Krátkodobý access token (1 hodina) + rotující refresh token.
Automatické odhlášení po 8 hodinách nečinnosti, absolutní platnost 7 dní. Tlačítko
„Odhlásit na všech zařízeních".

### 3.2 Role a oprávnění

Čtyři role, evidované v tabulce `portal_users` navázané na účty:

| Role | Vidí | Smí |
|---|---|---|
| `owner` | vše | správa uživatelů, mazání, schvalování a odesílání newsletterů, audit log |
| `editor` | vše | editace partnerů, import Excelu, příprava newsletteru, **ne** odesílání |
| `analyst` | vše kromě kontaktních e-mailů a telefonů | jen čtení + export reportů |
| `viewer` | dashboard a reporty | jen čtení |

`analyst` a `viewer` vidí kontakty v maskované podobě (`j****@ck-example.cz`) — přístup
k osobním údajům dostane jen ten, kdo je k práci potřebuje.

### 3.3 Vrstvy ochrany

1. **Astro middleware** (`src/middleware.ts`) — rozlišuje dva druhy provozu:
   - **Prohlížečové cesty** — `/portal/*` a `/api/portal/*` mimo strojový výčet níže.
     Vyžadují platnou session; bez ní přesměrování na přihlášení, u API odpověď 401.
   - **Strojové cesty** — `/api/portal/cron/*` a `/api/portal/intake/*`. Ty se
     **nikdy nepřesměrovávají**. Ověřují se výhradně bearer tokenem a session cookie
     u nich middleware **ignoruje**.
2. **Kontrola v každém API endpointu zvlášť** — middleware se nikdy nebere jako jediná
   pojistka. Každá serverová funkce si znovu ověří identitu i roli (u strojových cest token).
3. **Row Level Security v Postgresu** — zapnutá a vynucená (`FORCE ROW LEVEL SECURITY`)
   na všech tabulkách jako obrana do hloubky: aplikace se připojuje pod rolí s minimálními
   právy a RLS drží výchozí stav „nic není vidět" i při chybě v dotazu.
4. **Databáze nemá žádné veřejné API.** Neon vystavuje jen Postgres protokol; jediný,
   kdo se připojuje, je server Astro aplikace přes connection string ve Vercel env.
   Neexistuje anon klíč, který by mohl uniknout — celá kategorie útoků z původního
   návrhu (únik veřejného klíče Supabase) tím odpadá.
5. **CSRF** — kontrola hlavičky `Origin` u všech zápisových požadavků + double-submit token.
   Strojové cesty jsou z něj vyňaté, protože je to čistě prohlížečový mechanismus — chrání
   je místo něj to, že cookie vůbec nepřijímají.
6. **Hlavičky pro `/portal/*`** ve `vercel.json`: vlastní blok s přísnější CSP
   (`default-src 'self'`, bez `unsafe-inline`, bez Google Analytics), `X-Robots-Tag: noindex,
   nofollow`, `Cache-Control: no-store`.
7. **Neindexovatelnost** — `Disallow: /portal/` v `robots.txt` a vyloučení z obou sitemap
   (`astro.config.mjs` filtr + `sitemap-content.xml.ts`).
8. **Žádná analytika uvnitř portálu** — GA4 ani Plausible se v portálu nenačítají. Jinak by
   se do Googlu dostávaly URL s názvy a ID partnerů.
9. **Preview nasazení** (audit N-04) — každý PR vytváří veřejnou preview URL se stejným
   kódem. Proto: Vercel Deployment Protection pro preview, preview běží proti oddělené
   **Neon branch** s anonymizovanými daty (branching je u Neonu vestavěný a zdarma —
   nikdy proti produkčnímu connection stringu) a `X-Robots-Tag` platí i tam.
10. **Strojové cesty mají vlastní brute-force ochranu** (audit N-05) — tokeny ≥ 32 bajtů
    náhody, porovnání v konstantním čase, rate limit na IP a e-mail správci při opakované
    401, stejně jako u neúspěšných přihlášení.

> **Proč to rozdělení není detail:** Vercel Cron **nenásleduje přesměrování** — kdyby
> middleware cron endpoint přesměroval na přihlášení, úloha by na odpovědi 3xx skončila jako
> „hotová" a nikdy by neproběhla. A naopak: strojová cesta, která by přijímala session cookie,
> by šla zneužít přes CSRF — přihlášeného uživatele by stačilo navést na cizí stránku, která
> job odpálí jeho jménem. Proto strojové cesty cookie ignorují a spoléhají jen na token.

### 3.4 Klíče a tajemství

- Všechny klíče jen jako **Vercel Environment Variables** (šifrované), oddělené pro produkci
  a preview. Nikdy s prefixem `PUBLIC_` — ten Astro posílá do prohlížeče.
- `DATABASE_URL` (Neon), `R2_*` klíče a auth tajemství (podpis session, TOTP šifrovací
  klíč) se používají **výhradně** v serverových souborech. Přidám build-time kontrolu,
  která shodí build, když se do klientského bundlu dostane jakákoli proměnná bez
  prefixu `PUBLIC_`.
- `.env.local` je už v `.gitignore`. Doplním do CI **gitleaks** — sken commitů na omylem
  přidané klíče.
- Postup rotace klíčů (co kde přenastavit) jako součást dokumentace.

### 3.5 Zvláštní režim pro Clauda

Claude smí newsletter **napsat, ne odeslat**.

Podstatný detail z auditu (N-01): **API klíče MailerLite jsou celoúčtové** — neexistuje
klíč „jen na koncept". Každý klíč umí odeslat kampaň i číst odběratele. Omezení proto
vynucuje **naše vrstva, ne MailerLite**:

- celoúčtový klíč MailerLite žije výhradně ve Vercel env serverové části portálu;
  Claude ani žádný automat ho nedostane;
- Claudův „token jen na koncept" je token endpointu
  `/api/portal/intake/newsletter-draft` — ten umí jediné: založit `draft`. Neumí
  odeslat, neumí číst kontakty, neumí sahat na výkonnostní data;
- odeslání vyžaduje přihlášeného člověka s rolí `owner`, který text viděl a klikl na
  schválení (záznam `approved_by` + `approved_at`). Automat nikdy nerozešle e-mail
  reálným partnerům sám;
- interaktivní MCP napojení MailerLite (Cowork) má z principu plná práva účtu — používá
  se proto jen pod dohledem člověka v konverzaci, nikdy v naplánovaných úlohách.
  MailerLite podporuje více API klíčů: portál má vlastní a klíč pro MCP jde kdykoli
  samostatně revokovat;
- náhled draftu v portálu se vykresluje v `<iframe sandbox srcdoc>` bez `allow-scripts`
  a `allow-same-origin` a server HTML před uložením sanitizuje (whitelist e-mailových
  tagů) — HTML newsletteru je nedůvěryhodný vstup jako každý jiný (audit N-02).
  Testovací odeslání jde jen na interní domény.

### 3.6 Audit a zálohy

- **Audit log** — každý zápis, každý export a každé odeslání: kdo, kdy, co, z jaké IP,
  jaká byla změna (jsonb diff). Uživatelé si ho nemohou mazat — a od auditu N-09 ani
  service role: `REVOKE UPDATE, DELETE` + trigger, který obě operace odmítá; mazat smí
  jen retenční job přes `SECURITY DEFINER` funkci s pevným stářím záznamu.
- **Zálohy** — denní `pg_dump` přes GitHub Actions (zdarma), šifrovaný (age) a uložený
  do Cloudflare R2 s retencí 30 dní + 12 měsíčních. Poctivá poznámka: proti Point-in-Time
  Recovery z placeného Supabase je to krok zpět — nejhorší ztráta je den práce (RPO 24 h).
  U nástroje, kde se data mění pár dnů v měsíci, je to přijatelná výměna za 0 Kč; kdyby
  přestala být, upgrade Neonu PITR doplní. Součástí dokumentace bude **vyzkoušený**
  postup obnovy, ne jen odkaz na tlačítko — a zkouška obnovy z dumpu je čtvrtletní rutina.
- **Upozornění** — e-mail správci při neúspěšném běhu měsíčního jobu a při opakovaně
  neúspěšném přihlášení.

### 3.7 Osobní údaje a GDPR

Kontakty na lidi v CK jsou osobní údaje (byť pracovní), takže:

- u každého kontaktu se eviduje **právní titul** (oprávněný zájem u B2B sdělení / souhlas /
  plnění smlouvy), **zdroj** a **datum** jeho získání;
- odhlášení z newsletteru v MailerLite se **automaticky propíše zpět do CRM** — jinak by
  se stalo, že někoho odhlášeného znovu oslovíme z jiného seznamu;
- **retenční politika:** komunikace 5 let, agregované statistiky bez omezení, nahrané Excely
  24 měsíců, audit log 12 měsíců. Mazání běží automaticky;
- **výmaz na žádost** — tlačítko, které kontakt anonymizuje a zachová jen agregáty;
- **kontakty z veletrhu** se zařazují do rozesílek rovnou; eviduje se u nich `consent_basis`,
  akce, datum a doklad o tom, jak souhlas vznikl, viz 5.4;
- **údaje zvláštní kategorie se neukládají** — odpověď Hlídače státu obsahuje u jednatelů
  vazbu na politiku, což jsou podle čl. 9 politické názory. Do CRM se nepřenášejí, viz 5.5;
- zpracovatelské smlouvy: MailerLite (Litva, EU), Neon (databáze v regionu Frankfurt,
  standardní DPA) a Cloudflare R2 s nastavenou **EU jurisdikcí** úložiště — data
  neopouštějí EU, což je pro DE/AT/CH klientelu podstatné;
- doplnění záznamů o činnostech zpracování a rozšíření stávajících stránek o ochraně
  soukromí o tuto agendu.

---

## 4. Datový model

Schéma `crm` v Postgresu. Zjednodušeně (bez všech sloupců):

```sql
-- Kdo má přístup do portálu
portal_users(id → auth.users, role, display_name, is_active, last_login_at)

-- Partneři
partners(id, name, legal_name, ico, dic, country, city, website,
         segment,            -- travel_agency | tour_operator | corporate | insurer | other
         tier,               -- A | B | C
         status,             -- active | prospect | inactive
         owner_user_id,      -- kdo vztah spravuje
         acquisition_source, -- napr. 'veletrh:ITB-2026' | 'import:2026-03' | 'manual'
         acquired_at, acquired_by,
         languages[], notes, created_at, updated_at)

partner_contacts(id, partner_id, first_name, last_name, email citext, phone, position,
                 is_primary, newsletter_opt_in, lawful_basis,
                 consent_basis,   -- lead_scanner | business_card | explicit_signup | unknown
                 opt_in_source, opt_in_at, opt_in_evidence,
                 unsubscribed_at, mailerlite_subscriber_id)

interactions(id, partner_id, contact_id, type, occurred_at, subject, body, created_by)

-- Newsletter
newsletters(id, slug, subject, preheader, locale, html_body, plain_body,
            segment_definition jsonb, status,           -- draft | approved | scheduled | sent
            mailerlite_campaign_id, sent_at, recipients_count,
            created_by, approved_by, approved_at)

newsletter_recipients(newsletter_id, partner_id, contact_id, email_snapshot)
    -- snímek k okamžiku odeslání; kontakt se může později změnit

newsletter_stats(id, newsletter_id, fetched_at,
                 sent, opens_count, unique_opens_count, open_rate,
                 clicks_count, unique_clicks_count, click_rate, click_to_open_rate,
                 unsubscribes_count, spam_count, hard_bounces_count, soft_bounces_count)
    -- append-only: každý měsíční sběr = nový řádek, historie zůstává

newsletter_link_stats(newsletter_id, url, clicks_count, fetched_at)

-- Výkonnost partnerů z Excelu
partner_performance(id, partner_id, period_month date, hotel_slug,
                    bookings, room_nights, guests, cancellations,
                    revenue_amount numeric(14,2), currency, fx_rate, revenue_eur,
                    extra jsonb, import_id, created_at)
    UNIQUE (partner_id, period_month, hotel_slug)

imports(id, kind,               -- 'performance' (Excel) | 'partners' (CSV z veletrhu)
        filename, sha256, storage_path, template_id, encoding, delimiter,
        rows_total, rows_ok, rows_failed, rows_duplicate, status, error_log jsonb,
        uploaded_by, uploaded_at)
    -- jedna tabulka pro oba importy: sdílí validaci, audit i retenci souboru

import_templates(id, kind, name, column_mapping jsonb, created_by)
    -- namapování sloupců na pole, aby se to nedělalo pokaždé znovu

-- Ověření partnera v Hlídači státu
partner_verifications(id, partner_id, ico, checked_at, source,   -- zatím jen 'hlidac_statu'
                      insolvency_as_debtor_open  bool,
                      insolvency_as_debtor_count int,
                      vat_unreliable_now bool, vat_ever_listed bool,
                      criminal_records_count int,
                      employees_band, turnover_band, vat_payer_status,
                      risk_level,      -- ok | watch | alert
                      raw jsonb,       -- snímek odpovědi, ať jde doložit, na čem se rozhodovalo
                      created_at)
    -- append-only jako newsletter_stats: každá kontrola = nový řádek, historie zůstává

-- Napojení na statistický dashboard (viz 6.2)
partner_payer_map(id, partner_id, payer_name_raw, payer_name_norm,
                  kind,   -- partner | aggregate | direct | insurer_internal
                          -- | natural_person | ignore
                  confirmed_by, confirmed_at)
    UNIQUE (payer_name_norm)
    -- partner_id NULL = plátce vědomě není partner; párování potvrzuje člověk

audit_log(id, actor_id, action, entity, entity_id, diff jsonb, ip, user_agent, at)
```

### 4.1 Srovnání období

Jedno databázové view spočítá všechna tři srovnání najednou:

```sql
CREATE VIEW crm.v_performance_compare AS
WITH monthly AS (
  -- Jeden řádek na partnera a měsíc. Nutný krok: partner_performance má klíč
  -- (partner_id, period_month, hotel_slug), takže partner vykazovaný přes několik
  -- hotelů má na jeden měsíc několik řádků.
  SELECT partner_id,
         period_month,
         SUM(revenue_eur) AS revenue_eur,
         SUM(room_nights) AS room_nights
  FROM crm.partner_performance
  GROUP BY partner_id, period_month
),
series AS (
  -- Souvislá řada měsíců pro každého partnera; měsíc bez dat = nula, ne chybějící řádek.
  SELECT p.partner_id,
         g.month::date              AS period_month,
         COALESCE(m.revenue_eur, 0) AS revenue_eur,
         COALESCE(m.room_nights, 0) AS room_nights
  FROM (SELECT DISTINCT partner_id FROM monthly) p
  CROSS JOIN generate_series(
               (SELECT MIN(period_month) FROM monthly),
               -- Poslední naimportovaný měsíc, NE dnešek: jinak by se měsíce, které ještě
               -- nikdo nenahrál, dopočítaly jako nula a R12 by klesalo jen proto, že data
               -- chybí.
               (SELECT MAX(period_month) FROM monthly),
               interval '1 month'
             ) AS g(month)
  LEFT JOIN monthly m
         ON m.partner_id   = p.partner_id
        AND m.period_month = g.month::date
)
SELECT
  partner_id,
  period_month,
  revenue_eur,
  room_nights,

  -- předchozí měsíc
  LAG(revenue_eur, 1) OVER w                              AS revenue_prev_month,

  -- stejný měsíc loni
  LAG(revenue_eur, 12) OVER w                             AS revenue_same_month_last_year,

  -- klouzavých 12 měsíců vs. předchozích 12
  SUM(revenue_eur) OVER (w ROWS BETWEEN 11 PRECEDING AND CURRENT ROW)   AS revenue_r12,
  SUM(revenue_eur) OVER (w ROWS BETWEEN 23 PRECEDING AND 12 PRECEDING)  AS revenue_r12_prev
FROM series
WINDOW w AS (PARTITION BY partner_id ORDER BY period_month);
```

Rozpad po hotelech řeší souběžné view se stejnou stavbou, jen agregované a partitionované
podle `(partner_id, hotel_slug)`.

Procentní změny se počítají nad tímto view. Definice, aby v tom nebyl zmatek:

- **MoM** — měsíc M proti M−1
- **YoY** — měsíc M proti M−12 (podstatné u lázní, kde je silná sezónnost)
- **R12** — součet M−11…M proti součtu M−23…M−12 (vyhlazuje sezónnost)

Dva kroky před oknem — agregace na jeden řádek na partnera a měsíc a dopočet chybějících
měsíců jako nuly — nejsou kosmetika. `LAG` posouvá o **řádky, ne o měsíce**: bez nich by
`LAG(…, 1)` u partnera vykazovaného přes několik hotelů sáhl na jiný hotel v témže měsíci
a `LAG(…, 12)` na dvanáctý řádek zpět místo na loňský měsíc. Srovnání by nespadlo — tiše by
ukazovalo špatná čísla, což je horší.

---

## 5. Jak to funguje v praxi

### 5.1 Newsletter: od nápadu k archivu

```
1. Claude připraví návrh
   → čte podklady: segment partnerů, novinky z Keystaticu, kampaňový kalendář
   → vygeneruje předmět, preheader a HTML
   → POST /api/portal/intake/newsletter-draft (servisní token: JEN vytvoření konceptu)
   → uloží se jako newsletters.status = 'draft'

2. Člověk v portálu
   → náhled desktop / mobil / prostý text
   → úpravy textu
   → výběr segmentu (např. „CK, Německo, tier A+B")  → vidí přesný počet příjemců
   → testovací odeslání na interní adresy

3. Schválení  (jen role owner)
   → zapíše se approved_by + approved_at
   → bez tohoto kroku tlačítko „Odeslat" neexistuje

4. Odeslání přes MailerLite
   POST /api/campaigns                       → vytvoří kampaň (type: regular)
   POST /api/campaigns/{id}/schedule         → delivery: instant | scheduled

5. Archiv
   → uloží se přesné odeslané HTML, předmět, mailerlite_campaign_id
   → uloží se snímek příjemců (kdo přesně to dostal, i kdyby se kontakt později změnil)
```

> **Tarif — vyřešeno testem 28. 8. 2026:** účet běží na plánu Comfort500 (500–1000
> odběratelů, 10 000 e-mailů/měsíc) a založení konceptu kampaně s vlastním HTML přes API
> **prošlo** (kampaň typu `builder_html`, ověřeno na neškodném draftu do prázdné B2B
> skupiny, hned smazáno). Fáze 3 tedy není blokovaná. Zbytková nejistota: některé limity
> se projeví až při odeslání — definitivně potvrdí první testovací rozesílka na interní
> adresy, což je tak jako tak povinný krok schvalovacího procesu.

Segmenty se drží synchronizované: noční job posílá do MailerLite skupiny jen ty kontakty,
které mají v CRM `newsletter_opt_in = true`, a zpátky si tahá odhlášení.

### 5.2 Měsíční sběr statistik

Vercel Cron ve `vercel.json`:

```json
"crons": [
  { "path": "/api/portal/cron/newsletter-stats", "schedule": "0 4 1 * *" },
  { "path": "/api/portal/cron/mailerlite-sync",  "schedule": "0 3 * * *" }
]
```

Cron běží vždy v **UTC** a volá endpoint metodou GET. Zabezpečení: Vercel k požadavku
přidá hlavičku `Authorization: Bearer <CRON_SECRET>`, endpoint ji porovná s proměnnou
prostředí a jinak vrátí 401.

Job pro každou odeslanou kampaň zavolá `GET /api/campaigns/{id}` a z objektu `stats`
uloží **nový řádek** do `newsletter_stats` — tím vzniká časová řada (jak otevřenost roste
v čase), místo aby se přepisovala jedna hodnota.

Job je navržený jako **idempotentní**: Vercel negarantuje přesně jedno spuštění (běh může
vypadnout i proběhnout dvakrát), takže se dohledávají všechna nezpracovaná období, ne jen
„ten poslední měsíc". Zámek v databázi brání souběhu dvou běhů.

> **Interpretační poznámka:** Apple Mail Privacy Protection přednačítá obrázky, takže
> míra otevření je u příjemců s Apple Mailem nadhodnocená. V reportech proto dávám jako
> hlavní metriku **unikátní prokliky** a **CTOR**, otevřenost jako doplňkovou.

### 5.3 Import Excelu

```
Nahrání .xlsx  →  Kontrola (typ, max 5 MB)  →  Uložení do privátního úložiště
      ↓
Mapování sloupců  ──  poprvé ručně, pak se nabídne uložená šablona
      ↓
Validace  ──  neznámý partner? → našeptá podobná jména z CRM k ručnímu přiřazení
          ──  čísla, měna, období, duplicity
      ↓
Náhled  ──  „Naimportuje se 142 řádků, 3 řádky mají chybu, 2 partneři neznámí"
      ↓
Potvrzení  →  zápis v jedné transakci + řádek v audit logu
```

Import je **opakovatelný**: stejný měsíc se přepíše (upsert podle
`partner_id + period_month + hotel_slug`) a každý pokus zanechá záznam v `performance_imports`.
Původní soubor zůstává v privátním úložišti 24 měsíců, aby se dal import zpětně dohledat.

**K parsování Excelu:** doporučuji knihovnu **ExcelJS**. Balíček `xlsx` (SheetJS) publikovaný
na npm je zaseknutý na staré verzi, na kterou se vztahují bezpečnostní advisories —
udržovaná verze se distribuuje jen přes vlastní CDN. Parsování běží v serverové funkci
s limitem velikosti a času, bez vyhodnocování vzorců. Limit platí i na **rozbalená**
data (XLSX je zip a 5MB soubor se umí rozbalit do gigabajtů — audit N-10): streaming
čtení s tvrdým stropem řádků.

**K exportům CSV** (audit N-03): hodnoty začínající `=`, `+`, `-` nebo `@` se prefixují
apostrofem, aby je Excel nevyhodnotil jako vzorec — název partnera přichází z importů
a nedá se mu věřit. Jedna sdílená utilita pro všechny exporty, s BOM a středníkem.

---

### 5.4 Import partnerů z veletrhu (CSV)

Z veletrhu (ITB Berlin, Holiday World) se vozí vizitky a exporty ze čtečky leadů. Formát
je pokaždé jiný, data bývají neúplná a část kontaktů už v CRM je.

```
Nahrání CSV  →  Detekce kódování a oddělovače  →  Mapování sloupců
     ↓
Odstranění duplicit  ──  1. podle IČO (spolehlivé)
                     ──  2. podle domény e-mailu
                     ──  3. fuzzy podle názvu → k ručnímu potvrzení, nikdy automaticky
     ↓
Náhled  ──  „14 nových, 6 už v CRM, 3 řádky k rozhodnutí"
     ↓
Založení jako status = 'prospect', acquisition_source = 'veletrh:ITB-2026'
```

**Na čem to v Česku obvykle padá** a s čím proto import počítá:

- oddělovač `;`, ne čárka (české Excely),
- kódování Windows-1250, ne UTF-8,
- desetinná čárka,
- **IČO s vedoucí nulou** — Excel ho zkonvertuje na číslo a nulu sežere. Načítá se jako
  text a doplňuje se zpět na osm míst.

**Zařazení do newsletteru: zapnuto.** Kontakty z veletrhu se zakládají s
`newsletter_opt_in = true`. Vizitka podaná na B2B veletrhu je podaná právě proto, aby se
firma ozvala, a čtečky leadů souhlas obvykle sbírají už při skenu jmenovky.

V průvodci importem je to přepínač, jehož výchozí poloha je **zapnuto** — dá se pro
konkrétní dávku vypnout, když víte, že sběr proběhl jinak.

Co u toho portál eviduje, protože v případě dotazu se prokazuje **jak** kontakt vznikl:

| Pole | Co nese |
|---|---|
| `consent_basis` | `lead_scanner` (souhlas u skenu) / `business_card` / `explicit_signup` |
| `opt_in_source` | konkrétní akce, např. `veletrh:ITB-2026` |
| `opt_in_at` | datum akce |
| `opt_in_evidence` | co přesně bylo zachyceno — text souhlasu ze čtečky, poznámka od obchodníka |

> Jediná výjimka z výchozího zapnuto: dávka, u které se nedá určit původ — třeba
> přeposlaný seznam odjinud. Tam zůstává `false`, protože tam nikdo nic nepodal.
> U vlastního veletržního sběru se newsletter zapíná rovnou.

Odhlašovací odkaz je v každé rozesílce a odhlášení se propisuje zpět do CRM (viz 5.1).

Import sdílí veškerou mechaniku s importem výkonnosti — stejná tabulka `imports`, stejná
validace s náhledem, stejný audit i uchování zdrojového souboru.

---

### 5.5 Ověření partnerů v Hlídači státu

U cestovních kanceláří je úpadek reálné a opakující se riziko. Portál proto partnery
lustruje proti veřejným rejstříkům přes API [Hlídače státu](https://www.hlidacstatu.cz).

**Co se kontroluje:**

| Zdroj | Co se z něj bere |
|---|---|
| Insolvenční rejstřík (ISIR) | řízení, kde partner vystupuje **jako dlužník**, a jejich stav |
| Registr nespolehlivých plátců DPH | zda je nespolehlivý nyní a zda kdy zapsaný byl |
| Rejstřík trestů právnických osob | počet záznamů |
| Základní údaje | počet zaměstnanců, pásmo obratu, plátcovství DPH |

**Vyhodnocení rizika:**

| Stupeň | Kdy |
|---|---|
| `alert` | otevřená insolvence **jako dlužník**, nebo aktuálně nespolehlivý plátce DPH, nebo záznam v trestním rejstříku |
| `watch` | pravomocně skončená insolvence jako dlužník za poslední tři roky, nebo dřívější zápis mezi nespolehlivé plátce |
| `ok` | vše ostatní |

> **Proč `as_Debtor` a ne počet záznamů.** Ověřoval jsem to na reálných datech: Čedok
> (IČO 60192755) má v ISIR osm insolvenčních řízení. U všech je ale `as_Debtor: false`
> a `as_Creditor: true` — Čedok je věřitelem v cizích insolvencích, což je u velké CK
> úplně běžné. Implementace, která by jen spočítala záznamy, by na zdravé firmě spustila
> poplach. Riziko nese `as_Debtor`, ne počet.

**Párování na IČO, ne na jméno.** Vyhledávání podle názvu je nespolehlivé — „Čedok" se
najde, „EXIM TOURS" nevrátí nic. IČO je proto klíč; našeptávání podle jména slouží jen
jako pomůcka a **spojení IČO s partnerem vždy potvrzuje člověk**. Přiřadit partnerovi
cizí IČO by znamenalo hodnotit riziko úplně jiné firmy.

**Kdy to běží:** při založení partnera (včetně importu z veletrhu), na vyžádání tlačítkem
a jednou měsíčně stejným cronem jako statistiky rozesílek. Každá kontrola zakládá nový
řádek, takže je vidět vývoj. Změna stupně rizika pošle upozornění vlastníkovi vztahu —
„partner X se nově objevil v insolvenci jako dlužník" je informace, která má dorazit hned.

> **Co se záměrně neukládá.** Odpověď obsahuje u jednatelů a společníků pole
> `political_Involvement` (vazba na politiku, případně politická strana). To jsou podle
> GDPR čl. 9 údaje zvláštní kategorie — politické názory. Do CRM se **neukládají** a
> hodnocení rizika partnera se o ně neopírá. Ověřujeme firmu, ne lidi.

**Licence.** Každá odpověď nese `source_Url` a `copyright`. U ověření se proto zobrazuje
uvedení zdroje s odkazem na kartu subjektu na hlidacstatu.cz a dodržují se
[podmínky užití](https://texty.hlidacstatu.cz/licence/). Výsledky se cachují v databázi;
API se nevolá při každém zobrazení stránky.

> **Omezení, které je potřeba říct nahlas:** Hlídač státu pokrývá **jen české subjekty**.
> Vzhledem k tomu, že hlavní trh jsou německy mluvící země, bude velká část partnerů
> německých a rakouských a tahle kontrola se jich netýká. Pro ně je potřeba buď obdoba
> (Handelsregister, Insolvenzbekanntmachungen), nebo se smířit s ruční prověrkou. Zatím to
> návrh řeší tak, že partner bez českého IČO má stav `neověřeno` — ne `ok`. Falešné
> „v pořádku" je horší než přiznané „nevíme".

---

### 5.6 Dashboard výkonnosti firmy

Souhrn přes všechny partnery — na rozdíl od karty partnera, která ukazuje jednoho.
Referenčním bodem je vždy **poslední uzavřený měsíc s daty**, ne dnešek.

- **KPI řádek** — obraty, room nights, rezervace, průměrná délka pobytu, storna;
  u každého MoM, YoY a R12 ze srovnávacího view.
- **Trend** — 24 měsíců obratu a room nights.
- **Rozpad** — podle segmentu (CK / touroperátor / korporát / pojišťovna), země, hotelu a tieru.
- **Největší pohyby** — deset partnerů nahoru a deset dolů meziročně. Tohle je ta část,
  ze které plyne, komu zavolat.
- **Koncentrace obratu** — jaký podíl dělá top 5 partnerů. U lázní závislých na několika
  velkých CK je to riziková metrika, ne zajímavost.
- **Průnik s rozesílkami** — jak si vedou partneři, kteří newsletter otevírají, proti těm,
  kteří ne. Uvedeno jako souvislost, ne jako důkaz, že za to může newsletter.

Filtry: období, segment, země, hotel. Vše se počítá na serveru nad
`v_performance_compare`; grafy jsou lehké SVG bez knihoven navíc. Role `analyst` a
`viewer` vidí agregáty normálně — maskují se jen kontaktní údaje, ne čísla.

### 5.7 Skupiny a pole v MailerLite — založeno a ověřeno

Struktura vychází z požadavku odlišit **stálé partnery od úplně nových kontaktů
z veletrhu**, obojí dělené podle jazyka rozesílky. Dne 28. 8. 2026 založena přes API
a ověřena zpětným čtením:

| Skupina | Kdo v ní je | Plní ji |
|---|---|---|
| `B2B · Partneři · DE` | stálí partneři, německá rozesílka | sync z CRM |
| `B2B · Partneři · EN` | stálí partneři, anglická rozesílka | sync z CRM |
| `B2B · Partneři · CS` | české CK a korporáty | sync z CRM |
| `B2B · Vizitky · DE` | noví z veletrhu (ITB…), německy | import vizitek |
| `B2B · Vizitky · EN` | noví z veletrhu, anglicky | import vizitek |
| `B2B · Vizitky · CS` | noví z veletrhu (Holiday World), česky | import vizitek |

K tomu pole `b2b_vztah`, `b2b_typ` (ck / touroperátor / korporát / pojišťovna),
`b2b_tier`, `b2b_zdroj` (např. `veletrh:ITB-2026`) a `b2b_crm_id` (vazba na CRM,
podle ní se párují odhlášení a statistiky).

**Pravidla, bez kterých se to rozpadne:**

- **Skupiny = hrubé publikum, pole = jemné cílení.** „CK v Německu, tier A+B" není
  sedmá skupina, ale segment nad poli `b2b_typ` + `b2b_tier` uvnitř `B2B · Partneři · DE`.
  Kombinatorika typ × jazyk × tier ve skupinách by znamenala desítky skupin a ruční
  přesuny — přesně to, co nechceme.
- **Jazyk ≠ země.** Švýcarská CK patří do DE rozesílky, izraelská do EN. Proto skupinu
  určuje pole jazyka, země je zvlášť.
- **Členství ve skupinách `B2B · *` spravuje výhradně portál** (noční sync podle CRM).
  Ruční přesun v MailerLite se při dalším syncu přepíše — změny se dělají v CRM.
- **Povýšení vizitka → partner dělá CRM, ne MailerLite:** když se z prospekta stane
  aktivní partner (první výkon v PMS, podpis smlouvy), sync ho sám přesune
  z `Vizitky` do `Partneři`. Opačný směr nikdy automaticky.
- **Účet je sdílený s B2C** (audit N-07): žije v něm kvíz „Léto s Ensanou" — 759
  spotřebitelů, plus jazykové skupiny webu. Odesílací endpoint portálu má proto
  **tvrdý allowlist ID skupin s prefixem `B2B · `** — fyzicky neumí poslat kampaň
  spotřebitelům, ani „všem odběratelům". A obráceně: B2C rozesílky se do B2B skupin
  nedostanou, protože ty plní jen sync.
- **Doručitelnost** (audit N-08): před první rozesílkou ověřit doménu (DKIM), nastavit
  DMARC a zvážit odesílací subdoménu `news.marienbad.com` — reputace odesílatele je
  jinak sdílená s B2C kvízem.

---

---

## 6. Napojení na statistický dashboard LLML

Vedle portálu už existuje **statistický dashboard LLML** — Python engine, který každý měsíc
parsuje exporty z PMS, forecast a cluster report a vyrábí z nich jeden samostatný HTML soubor.
Ty dva systémy se potkávají přesně v jednom bodě: **plátci v PMS jsou z velké části titíž
partneři, které má evidovat CRM.**

> Pozor na názvosloví, protože se to plete: **„dashboard výkonnosti firmy"** (5.6) je obrazovka
> uvnitř portálu. **„Statistický dashboard LLML"** je ten samostatný soubor, o kterém je tahle
> sekce. Níže se druhému říká zkráceně *dashboard*, prvnímu *portál*.

### 6.1 Co má která strana a co jí chybí

| | Statistický dashboard | Partnerský portál |
|---|---|---|
| **Zdroj dat** | PMS exporty, forecast, cluster report | ruční zadání, Excel od partnerů |
| **Ví** | kolik kdo přivezl peněz, nocí a hostů — po měsících a po hotelech | kdo to je, s kým se jedná, co je ve smlouvě, jak je na tom firma finančně |
| **Neví** | kdo ten plátce vlastně je a jestli s ním někdo mluví | kolik reálně přivezl, dokud to někdo ručně nenahraje |
| **Aktualizace** | měsíčně, automaticky z exportů | měsíčně, ručně |

Konkrétně: dashboard už dnes drží za červen 2026 rozpad na plátce s přesností na hotel —
u největších CK jde o jednotky milionů Kč měsíčně rozložené do několika domů (konkrétní
čísla záměrně mimo git). To je přesně obsah tabulky `partner_performance` s klíčem
`(partner_id, period_month, hotel_slug)`. Ověřeno, že součet přes hotely sedí na celek.

> **Důsledek pro původní návrh:** ruční import Excelu (5.3) je u partnerů, kteří jdou přes
> PMS, zbytečná práce navíc — a navíc práce, která zavádí druhý zdroj pravdy. Ponechal bych
> ho, ale jako **záložní cestu** pro partnery, kteří v PMS nefigurují jako plátce (viz 6.8).

### 6.2 Klíč celého napojení: spárovat plátce na partnera

PMS zná plátce **jménem** („CK Alfa a.s."), CRM eviduje partnera podle **IČO**.
Je to úplně stejný problém jako u prověrky v Hlídači státu (5.5) a řeším ho stejně:
**mapovací tabulka, kterou potvrzuje člověk.** Automatické párování podle názvu ne — jméno
plátce se mezi exporty píše různě a špatně přiřazený plátce by tiše připsal cizí obrat
cizí firmě.

```sql
crm.partner_payer_map(
  id,
  partner_id        → crm.partners,        -- NULL = plátce vědomě není partner
  payer_name_raw    text,                  -- přesně jak to píše PMS
  payer_name_norm   text,                  -- bez diakritiky, malá písmena, bez s.r.o./GmbH
  kind,             -- partner | aggregate | direct | insurer_internal | natural_person | ignore
  confirmed_by, confirmed_at,
  UNIQUE (payer_name_norm)
)
```

Ne každý řádek v PMS je partner a tohle rozlišení musí být explicitní, ne odvozené:

| Plátce v PMS | `kind` | Proč |
|---|---|---|
| CK Alfa a.s., Beta Reisen GmbH *(příklady)* | `partner` | klasická CK / touroperátor → do CRM |
| korporátní klient | `partner` | korporát, segment `corporate` |
| zdravotní pojišťovna | `partner` | pojišťovna, segment `insurer` |
| Direct clients | `direct` | přímé rezervace, žádná protistrana |
| Zbytek | `aggregate` | součtový řádek exportu, **ne firma** |
| Jan Příklad *(fyzická osoba)* | `natural_person` | fyzická osoba — do CRM jen po rozhodnutí, viz níže |
| Booking.com BV, GDS kanály | `partner` | distribuční kanál, segment `other` |

> **Fyzické osoby.** Mezi plátci jsou i jména konkrétních lidí. Firemní údaje partnera jsou
> data právnické osoby, ale jméno fyzické osoby jsou osobní údaje se vším, co k tomu podle
> GDPR patří. Výchozí nastavení je proto **nepřenášet je** — v mapování dostanou
> `kind = 'natural_person'`, jejich obrat se do CRM nepropíše a v dashboardu zůstanou tak
> jako dnes. Pokud by se z někoho měl stát evidovaný partner, je to vědomé rozhodnutí
> s právním titulem, ne vedlejší efekt synchronizace.

Nespárovaný plátce **nikdy nezapadne**: objeví se v portálu v seznamu „čeká na přiřazení"
s návrhem podobných jmen z CRM. Dokud ho někdo nepotvrdí, jeho obrat se nikam nezapočítá —
raději chybějící řádek než řádek u špatné firmy.

### 6.3 Směr 1: dashboard → portál (výkonnost)

Engine po sestavení pošle rozpad na plátce do portálu. Používá **strojovou cestu** přesně
podle pravidel v 3.3 — bearer token, žádná session cookie, žádné přesměrování:

```
python3 build.py --push-crm
      ↓
POST /api/portal/intake/performance          Authorization: Bearer <DASHBOARD_INTAKE_TOKEN>
{
  "period_month": "2026-06",
  "source": "pms",
  "sha256": "…",                             -- otisk dávky, kvůli idempotenci
  "rows": [
    { "payer_name_raw": "CK Alfa a.s.", "hotel_slug": "CL",
      "revenue_amount": 1234567, "currency": "CZK",
      "room_nights": 420, "guests": 55 },
    …
  ]
}
      ↓
Portál:  spáruje přes partner_payer_map  →  upsert do partner_performance
         nespárované  →  fronta „čeká na přiřazení"
         záznam do imports (kind = 'performance_pms')  +  audit_log
```

Čtyři věci, na kterých to stojí:

- **Idempotence.** Klíč `(partner_id, period_month, hotel_slug)` je unikátní, zápis je upsert.
  Když se build spustí třikrát, výsledek je stejný jako po prvním. `sha256` dávky navíc
  umožní poznat, že přišla beze změny, a nezakládat zbytečný řádek v `imports`.
- **Měnu přepočítává portál, ne dashboard.** Posílá se CZK jako `revenue_amount` a portál
  si dopočítá `revenue_eur` svým kurzem. Jinak by vznikly dva kurzy a dvě různá čísla
  pro totéž.
- **Audit zadarmo.** Push zapisuje do stejné tabulky `imports` jako ruční nahrání Excelu,
  takže je v jednom místě vidět, co přišlo odkud.
- **Jen uzavřené měsíce.** Posílá se měsíční perioda (`M-2026-06`), ne YTD. YTD by při
  každém běhu přepisovalo celý rok.

> **Omezení, které je potřeba říct dopředu:** PMS exporty obsahují vždy jen aktuální měsíc
> a YTD. Dashboard tedy neumí naplnit historii zpětně — měsíční řada v CRM začne tím měsícem,
> kdy se napojení zapne, a poroste dopředu. Historii za starší období by šlo doplnit jedině
> z archivu starých exportů, pokud existuje. Do té doby se meziroční srovnání v portálu
> (5.6, R12) opírá o to, co se nahraje ručně.

### 6.4 Směr 2: portál → dashboard (kontext k číslům)

Opačným směrem teče to, co dashboard neví — kdo ten plátce je. Stejným mechanismem, jen
čtecím tokenem:

```
build.py  →  GET /api/portal/export/partners     Authorization: Bearer <DASHBOARD_EXPORT_TOKEN>
          →  uloží do crm/partners.json (lokální cache)
          →  engine ji přimíchá do data.json
```

Cache je tam schválně: build musí projít i bez sítě, stejně jako dnes funguje
`reviews/external_scores.json`. Když portál neodpovídá, engine použije poslední známý stav
a napíše varování — nespadne.

**Co se přenáší:** `partner_id`, název, IČO, `segment`, `tier`, `country`, `status`,
datum konce smlouvy, obsluhované trhy — a z prověrky jen **agregát** („2 partneři ve
stavu alert, 41,3 mil. Kč obratu, detail v portálu") plus příznak `verified` ano/ne.
Jmenovité hodnocení rizika se do dashboardu **nepřenáší** (audit N-06): dashboard je
soubor kolující mailem a „firma X — insolvence" v něm je únik důvěrného hodnocení,
při chybě párování navíc nepravdivé tvrzení o třetí osobě.

**Co se nepřenáší nikdy:** kontaktní osoby, e-maily, telefony, historie komunikace, poznámky.
Důvod je praktický — dashboard je HTML soubor, který koluje mailem po vedení. Jméno
a telefon obchodníka z CK v něm nemá co dělat. Vlastník vztahu (`owner_user_id`) se
přenáší jen jako iniciály, nebo vůbec.

### 6.5 Co z toho vznikne — věci, které dnes neumí ani jeden systém

Tohle je vlastní důvod, proč to spojovat. Žádná z těch pěti věcí nejde spočítat v jednom
systému samostatně:

1. **Riziková koncentrace obratu.** Dashboard ví, že největší CK dělá přes 10 % pololetních
   tržeb. Portál ví, jestli je ta firma v insolvenci nebo nespolehlivý plátce DPH. Teprve
   spolu dají větu *„11 % tržeb visí na partnerovi, který se tento měsíc objevil v ISIR jako
   dlužník"* — a to je informace, po které se jedná hned, ne na příští poradě.
2. **Smlouva vážená objemem.** Upozornění na končící smlouvu (11, „Smlouvy a provize") je
   samo o sobě jen datum. S obratem partnera z dashboardu se z něj stane priorita: propadlá
   smlouva u partnera za 50 mil. Kč ročně a u partnera za 300 tis. Kč nejsou stejná událost.
3. **Trh × partner.** Dashboard drží rozpad `plátce × teritorium` — víme, kolik který
   plátce přiváží z kterého trhu. Portál drží, na jaké trhy partner *tvrdí*, že prodává.
   Rozdíl mezi tím je obchodní téma: buď partner obsluhuje trh, o kterém se neví, nebo
   neobsluhuje ten, kvůli kterému se s ním podepisovalo.
4. **Newsletter proti reálnému obratu.** Průnik rozesílek a výkonnosti (5.6) je v původním
   návrhu postavený na Excelu od partnera. S PMS daty je postavený na tom, co se opravdu
   prodalo — a to je rozdíl mezi ukazatelem a dojmem.
5. **Segment a tier jako filtr nad tržbami.** Dashboard dnes umí filtrovat plátce jen podle
   toho, co je v PMS. Se segmentem a tierem z CRM jde říct, jak si vede *kategorie* partnerů,
   ne jen jednotliví plátci — třeba jestli tier A roste rychleji než tier B.

První dvě bych postavil hned, zbytek podle chuti.

### 6.6 Hranice: co přes rozhraní neprojde

Dashboard obsahuje forecast, rozpočet, EBITDA a celou výsledovku. Je označený jako důvěrný
a čte ho úzký okruh lidí. Portál má naproti tomu čtyři role včetně `viewer` a do budoucna
se u něj uvažuje o materiálech sdílených s partnery (11, „Mediatéka").

**Proto přes rozhraní neprojde ani jedním směrem:** forecast, rozpočet, OTB, obsazenost
hotelů, ATDR, výsledovka, EBITDA, mzdové náklady, cluster report.

Přenáší se výhradně **realizovaný obrat připadající na konkrétního partnera** — tedy číslo,
které ten partner sám zná, protože ty pobyty prodal. Token pro zápis (`DASHBOARD_INTAKE_TOKEN`)
umí jedinou věc: založit dávku výkonnosti. Neumí číst kontakty, neumí sahat na newsletter,
neumí číst nic zpátky. Token pro čtení (`DASHBOARD_EXPORT_TOKEN`) je oddělený a vrací jen
výčet polí z 6.4 — ne řádek tabulky, ale explicitní projekci.

> **Doplnit do 3.3:** middleware musí mezi strojové cesty přidat i `/api/portal/export/*`.
> Bez toho by ji poslal na přihlašovací stránku a `build.py` by místo JSON dostal HTML —
> stejná past, jaká je u cronu popsaná v 3.3, jen z druhé strany.

### 6.7 Provozní realita

Engine dnes běží **lokálně na počítači marketingu**, ne na serveru. Push do CRM se tedy
stane, když někdo spustí build — typicky jednou měsíčně po příchodu nových exportů. To je
pro měsíční data dostačující a nevidím důvod to na začátku komplikovat.

Když by se ukázalo, že to chce automaticky, jsou dvě cesty: přesunout engine na server
a pouštět ho cronem, nebo nechat portál jednou měsíčně připomenout, že data ještě nepřišla.
Druhá je levnější a řeší reálný problém (zapomenutí), ne domnělý.

Jednosměrná závislost je záměr: **portál na dashboardu nezávisí.** Když se push nespustí,
portál funguje dál, jen má u výkonnosti starší měsíc. A obráceně — když je portál nedostupný,
dashboard se postaví z cache. Ani jeden systém nedokáže shodit ten druhý.

### 6.8 Co to mění v původním návrhu

| Místo | Změna |
|---|---|
| 3.3 Vrstvy ochrany | mezi strojové cesty přibude `/api/portal/export/*` |
| 3.4 Klíče | dva nové tokeny: `DASHBOARD_INTAKE_TOKEN` (zápis výkonnosti), `DASHBOARD_EXPORT_TOKEN` (čtení metadat) |
| 4 Datový model | nová tabulka `partner_payer_map`; `imports.kind` rozšířeno o `performance_pms` |
| 5.3 Import Excelu | zůstává, ale jako **záložní cesta** pro partnery mimo PMS — ne jako hlavní způsob |
| 5.6 Dashboard výkonnosti | data pocházejí z PMS, ne z ručního nahrání; přibude pohled „riziko × obrat" |
| 7 Obrazovky | nová `/portal/partners/mapping` — fronta nespárovaných plátců |

Tabulka `partner_performance`, srovnávací view `v_performance_compare` ani nic dalšího
z datového modelu se **nemění** — push plní přesně tu strukturu, která je navržená.

---

## 7. Obrazovky

| Cesta | Obsah |
|---|---|
| `/portal` | Dashboard — KPI dlaždice, poslední rozesílka, top a nejvíc klesající partneři |
| `/portal/partners` | Seznam s filtry (segment, země, tier, vlastník), fulltext |
| `/portal/partners/[id]` | Karta partnera: kontakty, komunikace, graf výkonnosti, přijaté newslettery |
| `/portal/newsletters` | Archiv rozesílek + vývoj statistik v čase |
| `/portal/newsletters/new` | Návrh → náhled → test → schválení → odeslání |
| `/portal/import` | Průvodce nahráním Excelu s výkonností |
| `/portal/import/leads` | Průvodce nahráním CSV z veletrhu |
| `/portal/dashboard` | Dashboard výkonnosti firmy — KPI, trendy, rozpady, koncentrace |
| `/portal/reports` | Srovnání období, export do CSV |
| `/portal/verifications` | Přehled ověření: co je `alert`, co `watch`, co neověřené |
| `/portal/partners/mapping` | Fronta nespárovaných plátců z PMS — návrh podobných jmen, potvrzení člověkem *(viz 6.2)* |
| `/portal/admin/users` | Pozvánky, role, deaktivace *(jen owner)* |
| `/portal/admin/audit` | Audit log *(jen owner)* |

Postavené jako Astro stránky s React ostrůvky jen tam, kde je potřeba interaktivita
(tabulky, průvodce importem, grafy) — stejný přístup jako zbytek webu. Vizuálně stávající
paleta Ensana a font Branding, aby to nepůsobilo jako cizí nástroj.

---

## 8. Postup implementace

| Fáze | Obsah | Odhad |
|---|---|---|
| **0. Základ** | Neon projekt + R2 bucket, migrace schématu + RLS, vlastní auth (pozvánky, argon2id, TOTP, HIBP, limity pokusů), middleware, správa uživatelů, audit log, zálohovací job | 4–5 dní |
| **1. CRM** | Partneři, kontakty, komunikace, vyhledávání, prvotní import seznamu partnerů | 3–4 dny |
| **2. Import z veletrhu** | CSV průvodce, detekce kódování a oddělovače, odstranění duplicit, evidence původu souhlasu | 2–3 dny |
| **3. Newsletter** | Koncept → schválení → odeslání, archiv, synchronizace segmentů, testovací odesílání | 3–4 dny |
| **4. Statistiky rozesílek** | Cron, tabulky statistik, měsíční souhrn e-mailem | 2 dny |
| **5. Excel + srovnání** | Průvodce importem, mapovací šablony, srovnávací view, reporty, export | 3–4 dny |
| **6. Dashboard výkonnosti** | KPI, trendy, rozpady, největší pohyby, koncentrace obratu | 2–3 dny |
| **7. Ověření partnerů** | Napojení na Hlídače státu, párování na IČO, vyhodnocení rizika, měsíční přeověření, upozornění | 2–3 dny |
| **8. Zpevnění** | Nonce CSP na veřejném webu, gitleaks v CI, zkouška obnovy ze zálohy, bezpečnostní checklist, GDPR dokumentace | 2 dny |
| **9. Napojení dashboardu** | Mapování plátců na partnery s frontou k potvrzení, push výkonnosti z PMS, export metadat do dashboardu, pohled „riziko × obrat" | 2–3 dny |

**Celkem zhruba 25–32 dní práce** (fáze 0 je proti první verzi o ~2 dny delší — vlastní
auth místo hotové služby; to je cena za 0 Kč měsíčně). Fáze 0–3 dávají použitelný celek (CRM, veletržní
kontakty, rozesílání), fáze 4–6 přidávají analytiku, fáze 7 prověrku partnerů, fáze 9
napojení na statistický dashboard. Po každé fázi samostatný PR.

Fáze 7 je jediná, která nezávisí na ničem jiném než na fázi 1 — pokud je prověrka partnerů
naléhavější než rozesílky, dá se předsadit.

Fáze 9 potřebuje fázi 1 (partneři existují) a dává největší smysl **po fázi 7**, protože
teprve s prověrkou vzniká kombinace „riziko × obrat", kvůli které se to celé vyplatí
(viz 6.5). Kdyby se ukázalo, že ruční nahrávání Excelů je otravnější než cokoli jiného,
dá se předsadit před fáze 4–6 — pak ale bez rizikové části.

---

## 9. Provozní náklady

| Položka | Poznámka |
|---|---|
| Neon Free | **0 Kč.** 512 MB (CRM zabere jednotky MB), region Frankfurt, uspává se a sám se budí při připojení — na rozdíl od free Supabase, který se probouzí ručně. Strop free plánu hlídá měsíční job; při přerůstání je upgrade (~19 USD) nebo přesun jinam otázka jednoho pg_dump. |
| Cloudflare R2 | **0 Kč** do 10 GB. Nahrané Excely/CSV (retence 24 měs.) + šifrované zálohy DB. EU jurisdikce. |
| GitHub Actions | **0 Kč** (denní záloha = pár minut z 2000 free minut měsíčně). |
| MailerLite (Comfort500) | Stávající plán: 500–1000 odběratelů, 10 000 e-mailů/měsíc. Vlastní HTML přes API na něm prošlo testem, upgrade na Advanced není potřeba. **Hlídat strop odběratelů:** dnes 762 (z toho 759 z B2C kvízu) — partnerské kontakty se vejdou, ale limit 1000 je blízko; po sezóně vyčistit neaktivní kvízové kontakty, jinak plán o řád podraží. 10 000 e-mailů/měsíc je pro B2B víc než dost, strop ale sdílí i B2C rozesílky. |
| Hlídač státu | API je veřejné a pro tento objem dotazů bezplatné. Váže se na něj uvedení zdroje a [podmínky užití](https://texty.hlidacstatu.cz/licence/). |
| Vercel | Cron 1× měsíčně zvládne i současný tarif. Na Hobby se ale úlohy spouští s přesností na hodinu a max. 1× denně; Pro dává minutovou přesnost. |

---

## 10. Rizika a co s nimi

| Riziko | Opatření |
|---|---|
| Únik dat o výkonnosti partnerů | RLS, role, maskování kontaktů, audit log, 2FA, data mimo git |
| XSS na veřejném webu → přístup k portálu | Fáze 8: nonce CSP; kratší session; případně později subdoména |
| Omylem rozeslaný newsletter | Povinné schválení člověkem, servisní token bez práva odeslat, povinný test send |
| Nekonzistentní Excel od partnerů | Mapovací šablony, validace s náhledem, opakovatelný import, uchování zdrojového souboru |
| Výpadek měsíčního jobu | Idempotence, dohledávání nezpracovaných období, upozornění e-mailem |
| Nadhodnocená otevřenost (Apple MPP) | Hlavní metrika = unikátní prokliky a CTOR |
| Odchod člověka z týmu | Deaktivace účtu, odhlášení všech relací, záznam v audit logu |
| Falešný poplach u prověrky partnera | Riziko nese `as_Debtor`, ne počet insolvenčních záznamů; věřitel v cizí insolvenci je stav `ok` |
| Prověrka přiřazená špatné firmě | Párování na IČO, nikdy automaticky podle názvu; spojení potvrzuje člověk |
| Zahraniční partner vypadá jako prověřený | Bez českého IČO se stav ukazuje jako `neověřeno`, nikdy jako `ok` |
| Dotaz, odkud kontakt je | U každého kontaktu `consent_basis`, akce, datum a doklad o vzniku souhlasu — původ jde doložit |
| Dávka neznámého původu | Přepínač v importu; u dávky bez určitelného původu zůstává `newsletter_opt_in = false` |
| Obrat připsaný špatnému partnerovi | Párování plátce na partnera potvrzuje člověk; nespárovaný plátce se nezapočítá nikam, dokud se nepotvrdí (6.2) |
| Únik forecastu a výsledovky přes portál | Přes rozhraní teče jen realizovaný obrat partnera; forecast, rozpočet, EBITDA a P&L jsou z přenosu vyloučené, tokeny mají jednosměrný rozsah (6.6) |
| Osobní údaje fyzických osob mezi plátci | Plátce typu fyzická osoba se do CRM nepřenáší (`kind = 'natural_person'`), zařazení je vždy vědomé rozhodnutí (6.2) |
| Výpadek jednoho systému shodí druhý | Závislost je jednosměrná: portál na dashboardu nezávisí, dashboard staví z lokální cache (6.7) |
| Free tarif změní podmínky nebo přestane stačit | Vše je obyčejný Postgres + S3-kompatibilní úložiště — přesun kamkoli je pg_dump + rclone; zálohy v R2 jsou zároveň průběžný export |
| Chyba ve vlastní auth vrstvě | Žádná vlastní kryptografie — argon2, otplib, HIBP range API; přihlašování má stejné limity a alerty jako strojové cesty; auth kód je nejmenší možný a krytý testy |
| Dvojí zdroj pravdy o výkonnosti | Ruční import Excelu zůstává jen pro partnery mimo PMS; u ostatních je zdrojem PMS a měnu přepočítává jen portál (6.3, 6.8) |
| Škodlivé HTML v náhledu newsletteru | Sandbox iframe bez skriptů + serverová sanitizace před uložením (3.5, audit N-02) |
| Plná práva API klíče MailerLite | Klíč jen ve Vercel env; Claudův přístup jen přes vlastní intake endpoint; MCP klíč oddělený a revokovatelný (3.5, audit N-01) |
| B2B kampaň omylem spotřebitelům z kvízu | Tvrdý allowlist ID skupin `B2B · ` v odesílacím endpointu; nikdy „všem odběratelům" (5.7, audit N-07) |
| Vzorec v exportovaném CSV | Prefix rizikových buněk apostrofem ve sdílené export utilitě (5.3, audit N-03) |
| Veřejně dostupná preview URL portálu | Vercel Deployment Protection + oddělená Neon branch s anonymizovanými daty pro preview (3.3, audit N-04) |

---

## 11. Náměty na další rozšíření

**Tohle není součást odsouhlaseného rozsahu** — je to zásobník, ze kterého se dá vybírat,
až základ pojede. Seřazeno podle poměru užitku a práce.

### Co bych stavěl první

**Smlouvy, provize a hlídání expirace** · ~2 dny
Ke každému partnerovi smlouva: výše provize, platnost od–do, sjednané allotmenty, storno
podmínky, PDF v privátním úložišti. K tomu **upozornění 90, 60 a 30 dní před koncem
platnosti**. Tiše propadlá smlouva s velkou CK je drahá chyba a stane se právě proto, že
ji nikdo nehlídá. Ze všech námětů má tenhle nejlepší poměr užitku k práci.

**Úkoly a „další kontakt"** · ~1,5 dne
Úkol s termínem a odpovědným člověkem přímo na kartě partnera, plus pole „příště se ozvat
do". Na dashboardu pak seznam „po termínu" a „tento týden". Bez tohohle je CRM databáze,
ne nástroj — obchodní vztah se rozpadá tichem, ne konfliktem.

**Hlídka propadů výkonu** · ~1 den
Pravidlo nad daty, která už portál má: „partner spadl meziročně o víc než 30 % ve třech
měsících po sobě" → upozornění vlastníkovi vztahu. Dashboard ukazuje, co se stalo;
tohle řekne, kdo má zvednout telefon. Navazuje přímo na srovnávací view.

### Co dává smysl hned potom

**Fam tripy a jejich návratnost** · ~2 dny
Evidence poznávacích cest pro pracovníky CK: kdo byl pozvaný, kdo přijel, do kterého
hotelu. A protože portál má měsíční výkonnost partnerů, jde **změřit, jestli se to
vrátilo** — srovnání šesti měsíců před cestou a po ní. Většina hotelů tohle dělá poslepu.

**Trhy, které partner obsluhuje** · ~0,5 dne
Značka u partnera, na jaké trhy prodává (DE / AT / CH / IL / TW / …). Podle vlastního
backlogu webu má izraelská klientela nejdelší pobyty ze všech trhů (průměr 10,6 noci)
a Tchaj-wan roste meziročně o 16 %. Bez téhle značky se nedá zjistit, kteří partneři ty
trhy vlastně obsluhují — a tedy koho posílit.

**Rychlý záznam na stánku** · ~2 dny
Mobilní stránka portálu: vyfotit vizitku, OCR předvyplní jméno, firmu a e-mail, obchodník
doplní poznámku a uloží jako `prospect`. Doplněk k dávkovému CSV importu — část kontaktů
na veletrhu vzniká mimo čtečku jmenovek a do večera se na ně zapomene.

**Sledovaný odkaz na partnera** · ~1,5 dne
Každý partner dostane vlastní krátký odkaz (`marienbad.com/p/{kod}`), který přesměruje na
rezervační engine s `utm_source=partner-{kod}`. Web už UTM na booking odkazy skládá
(`src/utils/utm.ts`, cíl `bookings.ensanahotels.com`), takže jde hlavně o evidenci a
přesměrování. Přínos: **aktivita partnera je vidět průběžně**, ne až s měsíčním Excelem.

### Užitečné doplňky

**Mediatéka a press kity** · ~2 dny
Ceníky, factsheety hotelů, fotky, loga a prezentace ve čtyřech jazycích. Partner dostane
odkaz s omezenou platností a v CRM je vidět, co si stáhl. Odpadne posílání příloh mailem
a je zřejmé, kdo s materiály opravdu pracuje.

**Shrnutí ze schůzek** · ~1 den
Po jednání se nadiktuje poznámka, Claude z ní udělá strukturovaný zápis do historie
komunikace — s čím se počítá, co je domluvené, co je úkol. Úkoly se rovnou nabídnou
k založení. Zápisy ze schůzek jsou to první, co se v CRM přestane dělat.

**Reklamace vázané na partnera** · ~1,5 dne
Stížnost hosta se přiřadí k partnerovi, který pobyt prodal. Dvojí užitek: podklad pro
jednání s partnerem a vidět, jestli se problémy kupí u jednoho zdroje.

**Vícejazyčné šablony e-mailů** · ~1 den
Nejen newsletter, ale i běžná korespondence — potvrzení podmínek, výročí smlouvy, pozvánka
na fam trip — v DE / EN / CS / RU, předvyplněné údaji partnera.

### Co bych naopak nedělal

- **Fakturace a vyúčtování provizí.** Patří do účetnictví, ne do CRM. Duplicitní evidence
  peněz je zdroj sporů.
- **Sledování konkurence u partnera.** Data se nedají spolehlivě získat a odhady by se
  v CRM rychle tvářily jako fakta.

---

## 12. Co potřebuji rozhodnout

1. ~~Rozjet fázi 0?~~ — **fakticky rozhodnuto**: Neon projekt EnsanaPortal už stojí
   (Frankfurt, ověřeno 28. 8., viz 2.2). Zbývá R2 bucket u Cloudflare a reset hesla
   podle 2.2. Uspaný projekt `marienbad` v Supabase se nechá být, případně smazat.
2. **Jaký máme tarif MailerLite?** Pokud ne Advanced, HTML přes API nepůjde a je potřeba
   zvolit jinou cestu (šablony v MailerLite, nebo jiný odesílatel).
3. **Ukázka Excelu s výkonností** — jeden reálný soubor stačí; podle něj postavím mapování
   a validace tak, aby seděly na skutečná data.
4. **Kolik účtů a kdo v jaké roli.**
5. **Existující seznam partnerů** v jakékoli podobě (Excel, Google Sheet, kontakty),
   ze kterého se udělá prvotní import.
6. **Ukázka CSV z veletrhu** — ideálně export ze čtečky leadů z posledního ročníku.
7. **Zahraniční partneři:** má se pro německé a rakouské CK řešit obdoba prověrky
   (Handelsregister), nebo stačí, že se ukážou jako neověřené a prověří se ručně?
8. **Dashboard výkonnosti firmy** je v návrhu pojatý jako souhrn přes všechny partnery.
   Kdybyste tím mysleli spíš detail jedné partnerské firmy, ten už je na kartě partnera —
   dejte vědět, jestli to takhle sedí.
9. **Napojit statistický dashboard (fáze 9)?** Pokud ano, odpadne ruční nahrávání Excelu
   u partnerů, kteří jdou přes PMS, a vznikne pohled „riziko × obrat".
10. **Archiv starších PMS exportů** — existuje? Určuje, jestli půjde naplnit historii
    výkonnosti zpětně, nebo měsíční řada začne až od zapnutí napojení (6.3).
11. **Plátci, kteří jsou fyzické osoby** — mají se evidovat jako partneři s vlastním
    právním titulem, nebo je nechat mimo CRM? Výchozí návrh je nechat je mimo (6.2).
12. ~~Tarif MailerLite~~ — **vyřešeno**: Comfort500 (500–1000 odběratelů, 10 000
    e-mailů/měsíc); vlastní HTML přes API ověřeno testovacím konceptem 28. 8. 2026.
    Zbývá jen hlídat strop 1000 odběratelů (dnes 762, viz sekce 9).
13. **Druhý účet MailerLite pro B2B?** Sdílení účtu s kvízem řeší allowlist a oddělená
    subdoména (5.7); čistší, ale dražší je oddělený účet. Není nutné rozhodnout hned.
