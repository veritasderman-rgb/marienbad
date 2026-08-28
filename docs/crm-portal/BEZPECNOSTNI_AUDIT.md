# Bezpečnostní audit návrhu partnerského portálu

> **Poznámka ke kopii v gitu:** repozitář je veřejný — identifikátory účtů a jmenovité
> údaje o partnerech jsou v této kopii redigovány. Na nálezy ani opravy to nemá vliv.

**Auditovaný dokument:** NAVRH.md (verze se sekcí 6 — napojení dashboardu)
**Datum auditu:** 28. srpna 2026
**Metoda:** adversariální průchod — u každé vrstvy se ptám, co se stane, když selže,
a kudy by šel útok nebo únik dat. Kde to šlo, ověřoval jsem tvrzení na reálných
systémech (MailerLite účet, API Hlídače státu, data z PMS).

**Poctivá poznámka úvodem:** původní návrh jsem psal já. Tenhle audit je druhý průchod
s čerstvýma očima a záměrně hledá díry ve vlastní práci. Našel jich jedenáct — čtyři
stojí za opravu před stavbou, zbytek jsou zpevnění. Nic z nalezeného nebourá architekturu;
všechno se opravuje v rámci navržených fází.

---

## 1. Co je vyřešené dobře (potvrzuji po druhém průchodu)

| Oblast | Stav | Poznámka auditu |
|---|---|---|
| Hesla a účty | ✅ | bcrypt v Supabase Auth, registrace vypnutá, pozvánky, HIBP kontrola, povinné TOTP. Standard, který většina interních aplikací nemá. |
| Session | ✅ | `__Host-` cookie, HttpOnly, krátký access token, rotující refresh, absolutní expirace. |
| Oddělení strojových a prohlížečových cest | ✅ | Past s přesměrováním cronu i CSRF přes cookie je popsaná správně — tohle je místo, kde se to obvykle pokazí. |
| RLS + schéma `crm` mimo veřejné API | ✅ | Obrana funguje i při úniku anon klíče. `FORCE ROW LEVEL SECURITY` je správně — platí i pro vlastníka tabulky. |
| Role a maskování kontaktů | ✅ | `analyst`/`viewer` nevidí osobní údaje. Odpovídá zásadě minimalizace. |
| GDPR | ✅ | Právní tituly, evidence původu souhlasu, retence, výmaz, čl. 9 (politické vazby jednatelů se neukládají), fyzické osoby mezi plátci mimo CRM. Nadprůměrně poctivé. |
| Prověrka partnerů | ✅ | Pravidlo `as_Debtor` jsem dnes znovu ověřil na živém API: velká zdravá firma (test na známém českém subjektu) má v ISIR **185 řízení a všechna jako věřitel** — naivní počítání záznamů by na zdravé firmě spustilo poplach. Návrhové pravidlo obstálo. Párování na IČO s lidským potvrzením: ano — menší s.r.o. s atypickým názvem přes jméno nenajde ani Hlídač. |
| Izolace napojení na dashboard | ✅ | Jednosměrné tokeny, výčtová projekce polí, forecast/P&L vyloučeny, cache pro offline build. |
| Neindexovatelnost a žádná analytika v portálu | ✅ | robots, sitemap filtr, vlastní CSP blok, žádné GA4 uvnitř. |

---

## 2. Nálezy

Řazeno podle závažnosti. „Oprava" vždy říká, do které části návrhu patří.

### N-01 · VYSOKÁ · MailerLite nemá oprávnění po vrstvách — „token jen na koncept" na jeho straně neexistuje

Sekce 3.5 slibuje servisní token, který „umí jedině vytvořit koncept". **API klíče
MailerLite jsou ale celoúčtové** — každý klíč umí odeslat kampaň, číst odběratele
i mazat skupiny. Omezení „jen koncept" se tedy NEDÁ vynutit u MailerLite; dá se vynutit
jen v naší vrstvě.

Ověřeno prakticky: napojení MailerLite, přes které dnes vznikly B2B skupiny, má plná
práva včetně `create_campaign` a `schedule_campaign` — tedy přesně to, co 3.5 tvrdí,
že automat mít nebude.

**Oprava (3.5):**
- Celoúčtový klíč MailerLite žije **výhradně** ve Vercel env serverové části portálu.
  Claude ani žádný automat ho nikdy nedostane.
- Claudův „token jen na koncept" je token NAŠEHO endpointu
  `/api/portal/intake/newsletter-draft` — omezení vynucuje portál, ne MailerLite.
  (Architektura 5.1 to tak už kreslí; text 3.5 musí přestat naznačovat, že omezení
  poskytuje MailerLite.)
- Pro interaktivní MCP napojení (dnešní session) platí provozní pravidlo: používá se
  jen pod dohledem člověka v konverzaci, nikdy v naplánovaných/autonomních úlohách.
  MailerLite umí víc API klíčů — portál dostane vlastní, MCP klíč jde kdykoli
  revokovat samostatně.

### N-02 · VYSOKÁ · Náhled newsletteru je XSS vektor uvnitř portálu

Newsletter je HTML, které píše Claude a upravuje člověk. Portál ho zobrazuje v náhledu
(5.1, krok 2). Pokud se vykreslí přímo v DOM portálu, je to spuštění nedůvěryhodného
HTML v originu s přihlášenou session role `owner` — přesně proti tomu se celá sekce 3
brání. Stačí jeden `<img onerror>` v draftu (ať už z chyby generátoru, nebo od útočníka,
který získal intake token) a má session vlastníka.

**Oprava (5.1):**
- náhled výhradně v `<iframe sandbox srcdoc="…">` **bez** `allow-scripts` a
  `allow-same-origin` — HTML se vykreslí, skripty ne a iframe nevidí cookies;
- server před uložením draft sanitizuje (DOMPurify / sanitize-html, whitelist
  e-mailových tagů — skripty v e-mailu stejně nefungují, takže se nic neztrácí);
- testovací odeslání jde jen na doménu @ensanahotels.com / @marienbad.com.

### N-03 · STŘEDNÍ · CSV injection při exportu reportů

`/portal/reports` exportuje CSV. Název partnera je text z importu nebo z PMS — hodnota
začínající `=`, `+`, `-` nebo `@` se v Excelu vyhodnotí jako vzorec
(`=HYPERLINK(...)`, DDE). Partner se jménem začínajícím na `=` je exotický, ale import
z veletrhu bere CSV od kohokoli.

**Oprava (5.3, 7):** při exportu prefixovat rizikové buňky apostrofem a exportovat
s BOM + středníkem (české Excely). Jedna utilita, používaná všemi exporty.

### N-04 · STŘEDNÍ · Vercel Preview nasazení nejsou v modelu hrozeb

Každý PR vytváří veřejně dostupnou preview URL se stejným kódem portálu. Návrh odděluje
env proměnné produkce/preview, ale neříká, že preview URL je bez dalšího dostupná komukoli,
kdo ji uhodne nebo najde.

**Oprava (3.3):** zapnout **Vercel Deployment Protection** pro preview (na Pro tarifu
standard), preview používá výhradně oddělený Supabase projekt (ne produkční klíče,
ani anon), a `X-Robots-Tag` platí i tam.

### N-05 · STŘEDNÍ · Strojové cesty nemají rate limit ani pravidla pro tokeny

Brute force je ošetřený u přihlášení (Supabase), ale `/api/portal/intake/*` a
`/api/portal/export/*` chrání jen statický bearer token bez limitu pokusů.

**Oprava (3.3, 3.4):** tokeny generované, ≥ 32 bajtů náhody; porovnání v konstantním
čase; rate limit na IP (stačí jednoduchý in-memory/upstash limit); opakovaná 401 na
strojové cestě → stejný e-mail správci jako u neúspěšných přihlášení.

### N-06 · STŘEDNÍ · `risk_level` v souboru, který koluje mailem

Sekce 6.4 posílá `risk_level` do statistického dashboardu — HTML souboru přeposílaného
mimo řízený přístup portálu. „Firma X — insolvence" ve volně kolujícím souboru je
(a) únik důvěrného hodnocení, (b) při chybě párování potenciálně nepravdivé tvrzení
o třetí osobě s právním rizikem.

**Oprava (6.4):** export nese jen `verified: ano/ne` a **agregát** („2 partneři ve
stavu alert, 41,3 mil. Kč obratu — detail v portálu"). Jmenovité hodnocení rizika
zůstává výhradně za přihlášením v portálu.

### N-07 · STŘEDNÍ · Sdílený MailerLite účet: B2C kvíz + B2B partneři

Zjištění z dnešní prohlídky účtu: žije v něm **762 odběratelů, z toho 759 spotřebitelů
z kvízu „Léto s Ensanou"**. Návrh počítal s čistým B2B účtem. Důsledky:

- **riziko záměny publika** — kampaň omylem poslaná na skupinu kvízu je B2B obsah
  sedmi stovkám spotřebitelů; opačným směrem je to únik obchodního sdělení;
- **sdílená reputace odesílatele** — spam stížnosti z B2C rozesílek srazí doručitelnost
  B2B newsletterů a naopak;
- **fakturace** — počet odběratelů se sčítá přes oba světy.

**Oprava (nová 5.7):** tvrdý allowlist skupin v kódu portálu — odesílací endpoint
fyzicky neumí poslat mimo skupiny s prefixem `B2B · ` (kontrola na ID, ne na název);
nikdy „všem odběratelům"; oddělená odesílací subdoména (viz N-08). Dlouhodobě zvážit
druhý účet MailerLite pro B2B — rozhodnutí, ne nutnost.

### N-08 · NÍZKÁ · Doručitelnost a spoofing: SPF/DKIM/DMARC nejsou v návrhu

B2B newslettery na německé firemní adresy bez správného DKIM skončí ve spamu; chybějící
DMARC zároveň usnadňuje spoofing domény marienbad.com vůči partnerům.

**Oprava (5.1):** před první rozesílkou ověřit doménu v MailerLite (DKIM záznamy),
DMARC minimálně `p=quarantine` s reportingem; zvážit odesílací subdoménu
`news.marienbad.com`, která izoluje reputaci od transakční pošty hotelu.

### N-09 · NÍZKÁ · Audit log jde smazat service klíčem

„Uživatelé si ho nemohou mazat" řeší RLS, ale service role RLS obchází — únik service
klíče znamená i možnost zahladit stopy.

**Oprava (3.6):** `REVOKE UPDATE, DELETE` na `audit_log` pro všechny role + BEFORE
trigger, který obě operace odmítne. Mazat smí jen retenční job přes `SECURITY DEFINER`
funkci s pevným stářím záznamu.

### N-10 · NÍZKÁ · Zip-bomba v importu XLSX

ExcelJS s limitem velikosti souboru je v návrhu; XLSX je ale zip a 5MB soubor se umí
rozbalit do gigabajtů.

**Oprava (5.3):** limit i na rozbalená data (max. buněk/řádků, časový limit funkce už
je) — ExcelJS streaming reader s tvrdým stropem řádků.

### N-11 · INFO · Lokální stroj marketingu jako držitel tokenů

`DASHBOARD_INTAKE_TOKEN` a `DASHBOARD_EXPORT_TOKEN` žijí na notebooku (6.7), stejně
jako cache `crm/partners.json` s IČO a segmenty partnerů. To je přijatelné riziko
(bez nich napojení nefunguje), ale musí být pojmenované: tokeny v `.env` mimo git
(už je v `.gitignore`), postup revokace v dokumentaci, a cache neobsahuje nic nad
výčet polí z 6.4.

---

## 3. Odpověď na otázku „je tam vyřešeno vše?"

**Architektura ano, čtyři věci se musí dopsat před stavbou:** skutečný model oprávnění
MailerLite (N-01), sandbox náhledu newsletteru (N-02), ochrana preview nasazení (N-04)
a pravidla pro sdílený účet s B2C kvízem (N-07). Nic z toho nemění datový model ani
fáze — všechno jsou úpravy textu návrhu a pár hodin práce navíc ve fázích 0, 3 a 8.
Opravy jsou zapracované v NAVRH.md v této revizi.

Zbylé nálezy (N-03, N-05, N-06, N-08 až N-11) jsou zpevnění, která se vejdou do
existujících fází bez vlivu na odhad.

## 4. Složitost implementace a obsluhy

**Stavba:** 23–30 člověko-dní podle fází v návrhu, z toho bezpečnostní opravy z auditu
+1 den. Kód píšu já — Astro endpointy, SQL migrace, RLS politiky, UI. Na straně Ensany
zbývá to, co vyžaduje přístupy vlastníka: probudit Supabase a přepnout na Pro (~15 min),
vložit env proměnné do Vercelu (~15 min), DNS záznamy pro DKIM/DMARC (~15 min u správce
domény), potvrdit tarif MailerLite. Kalendářně jsou fáze 0–3 otázka dnů, ne týdnů —
úzkým hrdlem jsou schválení a přístupy, ne psaní kódu.

**Obsluha po spuštění (měsíční rutina, ~1–2 hodiny):**
1. spustit build dashboardu s `--push-crm` (výkonnost odteče sama),
2. potvrdit nové nespárované plátce ve frontě mapování (po prvním měsíci jednotky),
3. zkontrolovat upozornění prověrky (změny `alert`/`watch` chodí samy e-mailem),
4. newsletter: zkontrolovat Claudův návrh, test, schválit, odeslat,
5. po veletrhu nahrát CSV vizitek.

Nic z toho nevyžaduje technického člověka; technická údržba (rotace klíčů, zkouška
obnovy zálohy) je čtvrtletní půlhodina.

## 5. Stav MailerLite po dnešku

Napojení funguje (ID účtu a vlastník v interních poznámkách — veřejný repozitář). Založeno a zpětně ověřeno:
6 skupin `B2B · {Partneři|Vizitky} · {DE|EN|CS}` a 5 polí (`b2b_vztah`, `b2b_typ`,
`b2b_tier`, `b2b_zdroj`, `b2b_crm_id`). Skupiny jsou prázdné — plnit je bude až
synchronizace z CRM (fáze 3), ručně se do nich nesahá. Detail struktury a pravidla
synchronizace: NAVRH.md, nová sekce 5.7.

**Nedořešeno a blokuje fázi 3:** tarif účtu — vkládání vlastního HTML kampaně přes API
vyžaduje Advanced; z API se tarif nedá vyčíst, je potřeba se podívat do fakturace účtu.

---

## Dodatek (28. 8. 2026, po auditu): změna platformy Supabase → Neon + vlastní auth

Z nákladových důvodů se návrh přesunul ze Supabase Pro na Neon Free + Cloudflare R2
(0 Kč/měs., detail v NAVRH.md sekce 2). Dopad na nálezy auditu:

- **N-01 až N-08, N-10, N-11 platí beze změny** — netýkaly se Supabase.
- **N-09 (audit log)**: řešení (REVOKE + trigger + SECURITY DEFINER) je čistý Postgres,
  na Neonu funguje stejně.
- **N-04 (preview)**: místo odděleného Supabase projektu oddělená Neon branch
  s anonymizovanými daty — stejná ochrana, jednodušší provoz.
- **Nová plocha, kterou Supabase varianta neměla:** vlastní auth vrstva. Zmírnění je
  v NAVRH.md 3.1 (argon2id, otplib, HIBP range API, limity pokusů, žádná vlastní
  kryptografie) a v rizicích. Zároveň jedna plocha **zmizela**: databáze už nemá žádné
  veřejné API ani anon klíč — kategorie úniku veřejného klíče odpadá celá.
- **Zálohy**: místo PITR denní šifrovaný pg_dump do R2 — RPO se zhoršilo na 24 h,
  což je u dat měněných párkrát měsíčně přijatelné a v návrhu přiznané.
