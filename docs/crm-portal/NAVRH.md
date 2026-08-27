# Návrh: Partnerský portál — CRM cestovních kanceláří a partnerů + newsletter

**Stav:** návrh k odsouhlasení (nic zatím není naimplementováno)
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
                    │  Supabase (EU)       │   │  MailerLite API   │
                    │  • Postgres + RLS    │   │  connect.mailer…  │
                    │  • Auth (účty, 2FA)  │   │  kampaně + statis.│
                    │  • Storage (soubory) │   └───────────────────┘
                    └──────────────────────┘   ┌───────────────────┐
                                               │  Hlídač státu API │
                                               │  insolvence, DPH, │
                                               │  trestní rejstřík │
                                               └───────────────────┘
                                 ▲
                    ┌────────────┴─────────┐
                    │  Vercel Cron         │
                    │  1× měsíčně          │
                    └──────────────────────┘
```

**Proč Supabase:** projekt `marienbad` v Supabase **už existuje** (region `eu-west-1`, Postgres 17),
jen je uspaný. `.env.example` s ním počítá. Není důvod zavádět jinou databázi.

**Proč ne Keystatic:** Keystatic ukládá obsah jako soubory do gitu. Data o obchodních
výsledcích partnerů a kontaktní údaje v gitu být nesmí — jsou to citlivá data a git historie
se nedá smazat. CRM patří do databáze s řízeným přístupem.

### 2.1 Umístění portálu — a jedno upozornění

Doporučuji **stejnou aplikaci, cesta `/portal`**. Je to nejjednodušší na provoz i nasazení.

Poctivě ale k reziduálnímu riziku: portál pak sdílí origin s veřejným webem. Kdyby se na
veřejné stránce objevila XSS zranitelnost, útočník by z ní mohl volat `/api/portal/*` se
session přihlášeného uživatele. Současná CSP veřejného webu má u skriptů `'unsafe-inline'`
(kvůli GA4), což je pro tento scénář nejslabší místo.

**Proto je součástí návrhu (fáze 5) přechod veřejné CSP na nonce**, tj. odstranění
`'unsafe-inline'` u `script-src`. To se vyplatí udělat tak jako tak. Alternativa s ještě
tvrdší izolací je samostatná subdoména `portal.marienbad.com` jako oddělený Vercel projekt —
dražší na údržbu, uvádím ji jako možný pozdější krok, ne jako výchozí volbu.

---

## 3. Bezpečnostní model

Tohle je jádro zadání, proto podrobněji. Princip je **obrana do hloubky** — každá vrstva
předpokládá, že ta předchozí selhala.

### 3.1 Hesla a účty

**Heslo se nikde neukládá.** Ukládá se jen jeho jednosměrný otisk (bcrypt s unikátní solí
pro každého uživatele) v Supabase Auth. Z otisku se heslo zpětně nedá získat.

Konkrétně to znamená:

- heslo **není** v repozitáři, v `.env`, ve Vercel proměnných, v Keystaticu ani v žádné tabulce;
- **ani správce portálu heslo nikoho nevidí** — reset se dělá jednorázovým odkazem na e-mail;
- registrace je **vypnutá**. Účet vzniká jen pozvánkou od správce; pozvaný si heslo nastaví sám;
- minimální délka 12 znaků + kontrola proti databázi uniklých hesel (HaveIBeenPwned, funkce
  Supabase Auth) — zabrání použití hesla, které už někde uniklo;
- **dvoufázové ověření (TOTP) povinné pro všechny účty.** Aplikace typu Google Authenticator
  nebo 1Password. Samotné ukradené heslo pak k ničemu není. U dat o obchodní výkonnosti
  partnerů to považuji za nutnost, ne za nadstandard;
- omezení počtu pokusů o přihlášení (brute-force ochrana je vestavěná v Supabase Auth).

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
   na všech tabulkách, výchozí stav „nic není vidět". I kdyby unikl anon klíč, data se nedají
   přečíst.
4. **CRM tabulky nejsou vystavené přes veřejné API Supabase** — jsou ve schématu `crm`,
   které není v `exposed_schemas`. Do databáze sahá jen server Astro aplikace.
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

> **Proč to rozdělení není detail:** Vercel Cron **nenásleduje přesměrování** — kdyby
> middleware cron endpoint přesměroval na přihlášení, úloha by na odpovědi 3xx skončila jako
> „hotová" a nikdy by neproběhla. A naopak: strojová cesta, která by přijímala session cookie,
> by šla zneužít přes CSRF — přihlášeného uživatele by stačilo navést na cizí stránku, která
> job odpálí jeho jménem. Proto strojové cesty cookie ignorují a spoléhají jen na token.

### 3.4 Klíče a tajemství

- Všechny klíče jen jako **Vercel Environment Variables** (šifrované), oddělené pro produkci
  a preview. Nikdy s prefixem `PUBLIC_` — ten Astro posílá do prohlížeče.
- `SUPABASE_SERVICE_ROLE_KEY` se používá **výhradně** v serverových souborech. Přidám
  build-time kontrolu, která shodí build, když se do klientského bundlu dostane jakákoli
  proměnná bez prefixu `PUBLIC_`.
- `.env.local` je už v `.gitignore`. Doplním do CI **gitleaks** — sken commitů na omylem
  přidané klíče.
- Postup rotace klíčů (co kde přenastavit) jako součást dokumentace.

### 3.5 Zvláštní režim pro Clauda

Claude smí newsletter **napsat, ne odeslat**.

Technicky: Claude posílá návrh přes servisní token s jediným oprávněním „vytvoř koncept".
Token neumí odeslat kampaň, neumí číst kontakty, neumí sahat na výkonnostní data.
Odeslání vyžaduje přihlášeného člověka s rolí `owner`, který text viděl a klikl na schválení
(záznam `approved_by` + `approved_at`). Automat nikdy nerozešle e-mail reálným partnerům sám.

### 3.6 Audit a zálohy

- **Audit log** — každý zápis, každý export a každé odeslání: kdo, kdy, co, z jaké IP,
  jaká byla změna (jsonb diff). Uživatelé si ho nemohou mazat.
- **Zálohy** — denní zálohy Supabase, na tarifu Pro navíc Point-in-Time Recovery.
  Součástí dokumentace bude **vyzkoušený** postup obnovy, ne jen odkaz na tlačítko.
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
- zpracovatelské smlouvy: MailerLite (Litva, EU) i Supabase (region EU-West, Irsko) —
  data neopouštějí EU, což je pro DE/AT/CH klientelu podstatné;
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

> **Pozor na tarif:** vkládání vlastního HTML do kampaně přes API vyžaduje u MailerLite
> tarif **Advanced**. Před stavbou je potřeba ověřit, jaký tarif máme.

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
s limitem velikosti a času, bez vyhodnocování vzorců.

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

---

## 6. Obrazovky

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
| `/portal/admin/users` | Pozvánky, role, deaktivace *(jen owner)* |
| `/portal/admin/audit` | Audit log *(jen owner)* |

Postavené jako Astro stránky s React ostrůvky jen tam, kde je potřeba interaktivita
(tabulky, průvodce importem, grafy) — stejný přístup jako zbytek webu. Vizuálně stávající
paleta Ensana a font Branding, aby to nepůsobilo jako cizí nástroj.

---

## 7. Postup implementace

| Fáze | Obsah | Odhad |
|---|---|---|
| **0. Základ** | Probuzení Supabase, migrace schématu + RLS, Auth s 2FA, middleware, správa uživatelů, audit log | 2–3 dny |
| **1. CRM** | Partneři, kontakty, komunikace, vyhledávání, prvotní import seznamu partnerů | 3–4 dny |
| **2. Import z veletrhu** | CSV průvodce, detekce kódování a oddělovače, odstranění duplicit, evidence původu souhlasu | 2–3 dny |
| **3. Newsletter** | Koncept → schválení → odeslání, archiv, synchronizace segmentů, testovací odesílání | 3–4 dny |
| **4. Statistiky rozesílek** | Cron, tabulky statistik, měsíční souhrn e-mailem | 2 dny |
| **5. Excel + srovnání** | Průvodce importem, mapovací šablony, srovnávací view, reporty, export | 3–4 dny |
| **6. Dashboard výkonnosti** | KPI, trendy, rozpady, největší pohyby, koncentrace obratu | 2–3 dny |
| **7. Ověření partnerů** | Napojení na Hlídače státu, párování na IČO, vyhodnocení rizika, měsíční přeověření, upozornění | 2–3 dny |
| **8. Zpevnění** | Nonce CSP na veřejném webu, gitleaks v CI, zkouška obnovy ze zálohy, bezpečnostní checklist, GDPR dokumentace | 2 dny |

**Celkem zhruba 21–27 dní práce.** Fáze 0–3 dávají použitelný celek (CRM, veletržní
kontakty, rozesílání), fáze 4–6 přidávají analytiku, fáze 7 prověrku partnerů. Po každé
fázi samostatný PR.

Fáze 7 je jediná, která nezávisí na ničem jiném než na fázi 1 — pokud je prověrka partnerů
naléhavější než rozesílky, dá se předsadit.

---

## 8. Provozní náklady

| Položka | Poznámka |
|---|---|
| Supabase Pro | **Nutné.** Free tarif uspí projekt po týdnu nečinnosti — což je přesně náš případ (portál se používá párkrát měsíčně). Ostatně stávající projekt `marienbad` je uspaný právě proto. Pro tarif navíc přináší PITR zálohy a ochranu proti uniklým heslům. |
| MailerLite Advanced | Nutné pro vkládání vlastního HTML přes API. Cena podle počtu odběratelů — je potřeba ověřit aktuální tarif účtu. |
| Hlídač státu | API je veřejné a pro tento objem dotazů bezplatné. Váže se na něj uvedení zdroje a [podmínky užití](https://texty.hlidacstatu.cz/licence/). |
| Vercel | Cron 1× měsíčně zvládne i současný tarif. Na Hobby se ale úlohy spouští s přesností na hodinu a max. 1× denně; Pro dává minutovou přesnost. |

---

## 9. Rizika a co s nimi

| Riziko | Opatření |
|---|---|
| Únik dat o výkonnosti partnerů | RLS, role, maskování kontaktů, audit log, 2FA, data mimo git |
| XSS na veřejném webu → přístup k portálu | Fáze 5: nonce CSP; kratší session; případně později subdoména |
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

---

## 10. Náměty na další rozšíření

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

## 11. Co potřebuji rozhodnout

1. **Rozjet fázi 0?** Vyžaduje probuzení Supabase projektu a upgrade na Pro tarif.
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
