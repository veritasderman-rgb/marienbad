# RUNBOOK — provoz partnerského portálu

Praktický provozní návod pro `/portal`. Cílová skupina: **netechnický správce**
(marketing/vedení) pro sekce 1–2 a 4–7; sekce 3 a incident (6) předpokládají někoho,
kdo umí otevřít Vercel/Neon/GitHub — v malém týmu to může být stejná osoba, jen
s jiným kloboukem.

Návaznost: `docs/crm-portal/NAVRH.md` 3.4 (klíče), 3.6 (audit a zálohy), 3.7 (GDPR),
`docs/crm-portal/BEZPECNOSTNI_AUDIT.md` (zejména N-08, N-09, N-11),
`docs/crm-portal/IMPLEMENTACNI_PLAN.md` sekce 8–9 (co zbývá vlastníkovi, env kontrakt),
`.env.example` (přesná jména proměnných), `scripts/backup/README.md` (zálohy a obnova
— tenhle dokument ho neopakuje, jen na něj odkazuje).

> Repozitář je veřejný. V tomto dokumentu (a nikde jinde v gitu) nejsou a nesmí být
> žádné skutečné hodnoty tajemství, connection stringy ani reálná obchodní data —
> jen jména proměnných a postupy.

---

## 1. Měsíční rutina (~1–2 hodiny)

Pořadí odpovídá `BEZPECNOSTNI_AUDIT.md` sekci 4. Nic z toho nevyžaduje technika.

1. **Build dashboardu s `--push-crm`.** Spustí se na počítači marketingu jako obvykle;
   přepínač navíc odešle výkonnost do portálu (NAVRH 6.3). Bez tohoto kroku má portál
   u výkonnosti starší měsíc — nespadne, jen zaostává.
2. **Potvrdit frontu mapování** na `/portal/partners/mapping`. Po prvním měsíci jde
   typicky o jednotky nespárovaných plátců (nový partner v PMS, nebo drobná odchylka
   v názvu). Dokud plátce ve frontě čeká, jeho obrat se nikam nezapočítává — fronta se
   proto projde vždy, ne jen když je „hodně nová".
3. **Zkontrolovat upozornění prověrek.** Změna stupně rizika (`ok → watch/alert`) chodí
   e-mailem sama vlastníkovi vztahu; tady se jen ověří, že se s příchozím e-mailem
   opravdu něco stalo (kontakt partnera, poznámka, případně eskalace) — ne že zůstal
   nepřečtený v přeplněné schránce.
4. **Newsletter.** Cyklus je vždy: **návrh** (Claude připraví text přes svůj omezený
   endpoint) → **test** (odeslání jen na interní adresu) → **schválení** (přihlášený
   `owner` text vidí a klikne na schválení — teprve tím vznikne `approved_by`/
   `approved_at`) → **odeslání**. Žádný krok se nepřeskakuje ani při spěchu — automat
   sám od sebe nikdy nerozešle e-mail reálným partnerům (NAVRH 3.5).
5. **Po veletrhu nahrát CSV** z čtečky vizitek (ITB, Holiday World apod.) přes
   `/portal/import`. Náhled ukáže rozpad nové/už v CRM/k rozhodnutí — projít i řádky
   „k rozhodnutí", ne jen potvrdit součet.

---

## 2. Čtvrtletní technická půlhodina

Dvě věci, jednou za čtvrtletí (leden/duben/červenec/říjen, první týden):

- **Zkouška obnovy zálohy.** Celý postup i checklist jsou v
  [`scripts/backup/README.md`](../../scripts/backup/README.md) sekce 5 — tenhle
  dokument ho neduplikuje. Bez vyzkoušené obnovy není záloha zálohou, jen soubor v R2.
- **Rotace klíčů a tokenů.** Postup a tabulka „co kde" jsou v sekci 3 níže.

---

## 3. Rotace klíčů a tokenů

Jména proměnných jsou závazná podle `.env.example` a
`IMPLEMENTACNI_PLAN.md` sekce 9. Po každé rotaci: vložit novou hodnotu na **všechna**
místa, kde se proměnná používá (viz sloupec „Kam vložit"), a teprve pak starou hodnotu
zneplatnit na zdroji — jinak vznikne okno, kdy nefunguje ani stará, ani nová.

| Proměnná | Kde se točí (vygenerovat/změnit) | Kam vložit novou hodnotu |
|---|---|---|
| `DATABASE_URL` / `DATABASE_URL_DIRECT` (heslo role Neonu) | Neon konzole → *Branches → Roles → Reset password* | Vercel env (produkce **i** preview) — pooler string do `DATABASE_URL`, přímý do `DATABASE_URL_DIRECT`; a `DATABASE_URL_DIRECT` navíc do GitHub Secret pro zálohovací workflow (viz `scripts/backup/README.md` sekce 6 — reset hesla zneplatní obojí najednou) |
| `PORTAL_SESSION_SECRET` | vygenerovat (`openssl rand -base64 32`) | Vercel env (produkce i preview). **Pozor:** změna okamžitě invaliduje *všechny* existující session cookies — každý přihlášený uživatel se musí znovu přihlásit. Rotovat mimo špičku, ideálně s předchozím oznámením uživatelům portálu |
| `MAILERLITE_API_KEY` | MailerLite → *Integrations → API* (vlastní klíč portálu, **ne** klíč MCP napojení — ty se revokují samostatně, NAVRH 3.5) | Vercel env |
| `NEWSLETTER_DRAFT_TOKEN` | vygenerovat (≥ 32 B náhody) | Vercel env; a kdekoli se token používá při zakládání konceptu (intake volání) |
| `DASHBOARD_INTAKE_TOKEN` / `DASHBOARD_EXPORT_TOKEN` | vygenerovat (≥ 32 B náhody, oba samostatně) | Vercel env **a** `.env` engine dashboardu na počítači marketingu (mimo git, N-11 — viz níže) |
| R2 klíče (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`) | Cloudflare → R2 → *Manage API Tokens* | **Dvě oddělená místa:** Vercel env (aplikace — upload importů) **a** GitHub Secrets (zálohovací workflow) — postup a bezpečné pořadí (nový token → ověřit zelený běh → teprve pak zrušit starý) je v `scripts/backup/README.md` sekci 6. Nezapomenout ani jedno z obou míst |
| `RESEND_API_KEY` | Resend → *API Keys* | Vercel env |
| `HLIDAC_TOKEN` | hlidacstatu.cz → účet vývojáře (oddělený od tokenu MCP napojení, revokuje se samostatně) | Vercel env |

### N-11: tokeny na počítači marketingu

`DASHBOARD_INTAKE_TOKEN` a `DASHBOARD_EXPORT_TOKEN` musí existovat i mimo Vercel —
engine statistického dashboardu běží lokálně na počítači marketingu (NAVRH 6.7) a bez
nich by `--push-crm` a čtení projekce partnerů nefungovaly. To je vědomé, pojmenované
riziko z bezpečnostního auditu (N-11), ne přehlédnutí. Podmínky, za kterých je
přijatelné:

- oba tokeny žijí výhradně v `.env` daného počítače, **mimo git** (repozitář enginu má
  `.env` v `.gitignore` — při každém novém klonu/počítači to zkontrolovat ručně),
- lokální cache `crm/partners.json` neobsahuje nic nad výčet polí z NAVRH 6.4 (žádné
  kontakty, e-maily, poznámky, jmenovité riziko — jen `partner_id`, název, IČO,
  segment, tier, země, status, agregát prověrky),
- **postup při ztrátě nebo krádeži notebooku** (udělat hned, v tomto pořadí):
  1. rotovat `DASHBOARD_INTAKE_TOKEN` **a** `DASHBOARD_EXPORT_TOKEN` podle tabulky výše
     (staré hodnoty tím okamžitě přestanou fungovat i v cizích rukou),
  2. zkontrolovat audit log portálu (`/portal/admin/audit`) na neobvyklé volání
     `/api/portal/intake/performance` nebo `/api/portal/export/partners` v období
     kolem ztráty,
  3. pokud existuje podezření, že cache `crm/partners.json` unikla, informovat partnery,
     kterých se to týká, jen pokud jde nad rámec veřejně dostupných údajů (IČO a
     segment samy o sobě nejsou citlivé — kombinace s jinými nastřádanými daty může
     být, posoudit případ od případu),
  4. založit nový počítač/účet s novými tokeny, starý nechat trvale odpojený.

---

## 4. Doručitelnost newsletteru (N-08)

Než jde první B2B rozesílka ven, tři věci musí být hotové — bez nich skončí velká část
pošty na německé firemní domény ve spamu, nebo v horším případě umožní spoofing domény
`marienbad.com`:

1. **Ověřit doménu v MailerLite** (Domains/Sender Authentication) a doplnit DKIM
   záznamy, které MailerLite vygeneruje, do DNS domény.
2. **Nastavit DMARC** na doméně minimálně `p=quarantine` (ne jen `p=none`) s `rua`
   reportingem na adresu, kterou má někdo skutečně sledovat — DMARC bez reportingu je
   jen zápis v DNS, ne kontrola.
3. **Zvážit odesílací subdoménu `news.marienbad.com`** — izoluje reputaci B2B
   newsletteru od transakční pošty hotelu a od B2C kvízu (souvisí s N-07: sdílený
   MailerLite účet).

Zároveň ověřit, že `NEWSLETTER_FROM_EMAIL` (`.env.example`) skutečně odpovídá doméně,
která prošla kroky 1–2 — odesílání ze zatím neověřené adresy DKIM/DMARC obejde.

---

## 5. Alerty — kdy chodí a co s nimi

Portál posílá e-mail na `PORTAL_ALERT_EMAIL` automaticky v těchto případech:

| Kdy | Co znamená | Co udělat |
|---|---|---|
| Opakovaná neúspěšná přihlášení nebo neúspěšné pokusy o tokenový endpoint (≥ práh za hodinu, ze stejné identity nebo IP) | Buď někdo zapomněl heslo víckrát za sebou, nebo probíhá pokus o uhodnutí hesla/tokenu | Zkontrolovat `/portal/admin/audit` a IP v alertu; při skutečném útoku zvážit dočasné zablokování daného uživatele/IP a rotaci dotčeného tajemství (sekce 3) |
| Spadlý cron job (měsíční sběr statistik rozesílek, prověrky) | Job doběhl s chybou — nejčastěji vypršelý MailerLite/Hlídač státu token nebo výpadek jejich API | Otevřít Vercel logy daného cronu, ověřit platnost `MAILERLITE_API_KEY`/`HLIDAC_TOKEN`, spustit ručně přes endpoint, pokud existuje |
| Chyba synchronizace s MailerLite (`Sync MailerLite spadl` / `Sync MailerLite: N chyb`) | Část kontaktů se nepropsala do skupin, nebo API MailerLite dočasně nedostupné | Podívat se do detailu alertu (obsahuje seznam chyb), zkusit sync znovu; pokud chyby souvisí s konkrétními kontakty, opravit data u nich |
| Změna rizika partnera (`ok → watch/alert` nebo naopak) | Nová insolvence jako dlužník, nespolehlivý plátce DPH, nebo záznam v trestním rejstříku (NAVRH 5.5) — případně že se stav zlepšil | Otevřít kartu partnera, přečíst detail s odkazem na hlidacstatu.cz, rozhodnout o dalším kroku (kontakt, pozastavení spolupráce, informování vedení) |

Alert bez `PORTAL_ALERT_EMAIL` nastaveného se jen zaloguje do konzole Vercelu a nikam
neodejde — při prvním nasazení proto zkontrolovat, že proměnná je vyplněná.

---

## 6. Incident: podezření na únik klíče

Postup, v tomto pořadí — rychlost je důležitější než dokonalá diagnóza:

1. **Revokace.** Zneplatnit podezřelou hodnotu co nejdřív na zdroji (Neon/MailerLite/
   Cloudflare/Resend/hlidacstatu.cz podle toho, co uniklo) — i za cenu krátkého výpadku.
   Nefunkční portál je levnější problém než únik dat.
2. **Rotace.** Podle tabulky v sekci 3 vygenerovat a vložit novou hodnotu na všechna
   místa, kam patří.
3. **Audit log.** Projít `/portal/admin/audit` za období, kdy mohl klíč být venku —
   hledat neobvyklé exporty, hromadné čtení kontaktů, odeslané kampaně, které nikdo
   neschválil. Audit log je append-only (NAVRH 3.6, N-09) — nejde ho smazat ani
   service klíčem, takže stopa tam bude, i kdyby útočník chtěl uklidit.
4. **Neon a Vercel logy.** Zkontrolovat Neon (neobvyklé dotazy, nová připojení mimo
   očekávaný region) a Vercel Runtime Logs (neobvyklé volání serverových endpointů,
   zejména `/api/portal/intake/*` a `/api/portal/export/*` — to jsou strojové cesty
   bez lidského přihlášení, tedy nejpravděpodobnější cíl zneužitého tokenu).
5. Pokud šlo o klíč omylem commitnutý do gitu (proto gitleaks v CI —
   `.github/workflows/gitleaks.yml`): i po smazání souboru zůstává hodnota v historii
   repozitáře, dokud se historie nepřepíše nebo repozitář nezmigruje. Rotace v kroku 2
   je tedy povinná, ne volitelná — smazání commitu samo klíč neinvaliduje.
6. Zapsat incident (co uniklo, kdy se zjistilo, kdy bylo rotováno) do
   `docs/crm-portal/STAV.md` — stejně jako čtvrtletní zkoušky obnovy.

---

## 7. Kdy portál „neběží"

- **Neon studený start ~1 s je normální.** Neon Free uspává neaktivní databázi;
  první request po delší pauze počká necelou vteřinu, než se probere. To není chyba
  a nevyžaduje žádný zásah.
- **500 na `/portal/*` nebo `/api/portal/*`** — v tomto pořadí zkontrolovat:
  1. **Vercel Deployment/Runtime Logs** daného requestu — konkrétní chyba je skoro
     vždy tam.
  2. **Env proměnné ve Vercelu** — nejčastější příčina po jakékoli rotaci nebo novém
     nasazení je proměnná vyplněná jen pro produkci a chybějící pro preview (nebo
     naopak), případně překlep ve jméně (jména jsou závazná, `.env.example` a
     `IMPLEMENTACNI_PLAN.md` sekce 9).
  3. **Neon branch** — ověřit v Neon konzoli, že produkční branch existuje, není
     smazaná a role `portal_app` má platné heslo odpovídající `DATABASE_URL`.
  4. Pokud selhává jen konkrétní modul (newsletter, import, prověrky), zkontrolovat
     příslušný externí token (`MAILERLITE_API_KEY`, `HLIDAC_TOKEN`, `RESEND_API_KEY`)
     — 401/403 od externího API se v logu projeví jinak než chyba databáze.
