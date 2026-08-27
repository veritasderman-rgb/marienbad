# Návrh: Partnerský portál — CRM cestovních kanceláří a partnerů + newsletter

**Stav:** návrh k odsouhlasení (nic zatím není naimplementováno)
**Rozsah:** rozšíření stávajícího webu marienbad.com o neveřejnou aplikaci `/portal`
**Datum:** srpen 2026

---

## 1. Co to bude

Neveřejná část webu (`marienbad.com/portal`), do které se přihlásí jen pozvaní lidé.
Uvnitř je pět věcí:

| Modul | Co umí |
|---|---|
| **CRM partnerů** | Evidence CK, touroperátorů, korporátů a pojišťoven. Kontaktní osoby, historie komunikace, segmentace, vlastník vztahu. |
| **Newsletter** | Claude připraví návrh → člověk ho zkontroluje a schválí → odešle se přes MailerLite → přesná odeslaná verze se archivuje v databázi. |
| **Statistiky rozesílek** | Jednou měsíčně se automaticky stáhnou výsledky (doručeno, otevření, prokliky, odhlášení) a uloží se do historie. |
| **Výkonnost partnerů** | Nahrání měsíčního Excelu → validace → uložení do databáze. |
| **Srovnání období** | Automatické srovnání měsíc/měsíc, meziročně a klouzavých 12 měsíců — pro každého partnera i celkově. |

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
                    │  • Storage (Excely)  │   └───────────────────┘
                    └──────────────────────┘
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
         languages[], notes, created_at, updated_at)

partner_contacts(id, partner_id, first_name, last_name, email citext, phone, position,
                 is_primary, newsletter_opt_in, lawful_basis, opt_in_source, opt_in_at,
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

performance_imports(id, filename, sha256, storage_path, template_id,
                    rows_total, rows_ok, rows_failed, status, error_log jsonb,
                    uploaded_by, uploaded_at)

import_templates(id, name, column_mapping jsonb, created_by)
    -- namapování sloupců Excelu na metriky, aby se to nedělalo pokaždé znovu

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

## 6. Obrazovky

| Cesta | Obsah |
|---|---|
| `/portal` | Dashboard — KPI dlaždice, poslední rozesílka, top a nejvíc klesající partneři |
| `/portal/partners` | Seznam s filtry (segment, země, tier, vlastník), fulltext |
| `/portal/partners/[id]` | Karta partnera: kontakty, komunikace, graf výkonnosti, přijaté newslettery |
| `/portal/newsletters` | Archiv rozesílek + vývoj statistik v čase |
| `/portal/newsletters/new` | Návrh → náhled → test → schválení → odeslání |
| `/portal/import` | Průvodce nahráním Excelu |
| `/portal/reports` | Srovnání období, export do CSV |
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
| **2. Newsletter** | Koncept → schválení → odeslání, archiv, synchronizace segmentů, testovací odesílání | 3–4 dny |
| **3. Statistiky** | Cron, tabulky statistik, dashboard, měsíční souhrn e-mailem | 2 dny |
| **4. Excel + srovnání** | Průvodce importem, mapovací šablony, srovnávací view, reporty, export | 3–4 dny |
| **5. Zpevnění** | Nonce CSP na veřejném webu, gitleaks v CI, zkouška obnovy ze zálohy, bezpečnostní checklist, GDPR dokumentace | 2 dny |

**Celkem zhruba 15–19 dní práce.** Fáze 0–2 dávají použitelný celek (CRM + rozesílání),
fáze 3–4 přidávají analytiku. Po každé fázi samostatný PR.

---

## 8. Provozní náklady

| Položka | Poznámka |
|---|---|
| Supabase Pro | **Nutné.** Free tarif uspí projekt po týdnu nečinnosti — což je přesně náš případ (portál se používá párkrát měsíčně). Ostatně stávající projekt `marienbad` je uspaný právě proto. Pro tarif navíc přináší PITR zálohy a ochranu proti uniklým heslům. |
| MailerLite Advanced | Nutné pro vkládání vlastního HTML přes API. Cena podle počtu odběratelů — je potřeba ověřit aktuální tarif účtu. |
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

---

## 10. Co potřebuji rozhodnout

1. **Rozjet fázi 0?** Vyžaduje probuzení Supabase projektu a upgrade na Pro tarif.
2. **Jaký máme tarif MailerLite?** Pokud ne Advanced, HTML přes API nepůjde a je potřeba
   zvolit jinou cestu (šablony v MailerLite, nebo jiný odesílatel).
3. **Ukázka Excelu s výkonností** — jeden reálný soubor stačí; podle něj postavím mapování
   a validace tak, aby seděly na skutečná data.
4. **Kolik účtů a kdo v jaké roli.**
5. **Existující seznam partnerů** v jakékoli podobě (Excel, Google Sheet, kontakty),
   ze kterého se udělá prvotní import.
