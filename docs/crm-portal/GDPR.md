# GDPR — partnerský portál

Podklad pro záznamy o činnostech zpracování (čl. 30 GDPR) a pro rozšíření veřejných
stránek o ochraně soukromí (`/cs/ochrana-soukromi`, `/en/privacy`) o agendu
partnerského portálu `/portal`.

Návaznost: `docs/crm-portal/NAVRH.md` 3.7 (osobní údaje a GDPR), 4 (datový model),
5.4 (import z veletrhu), 5.5 (ověření partnerů), 6.4 (export do dashboardu),
`src/lib/portal/verifications/hlidac.ts` (whitelist projekce dat z Hlídače státu).

> **Sekce 6:** tento dokument je **podklad**, ne hotové stanovisko. Právní revizi textu
> a rozhodnutí, co a kdy z toho publikovat na veřejných stránkách o ochraně soukromí,
> dělá vlastník produktu — Claude ani tento dokument tohle rozhodnutí nenahrazuje.

---

## 1. Záznamy o činnostech zpracování (čl. 30)

| # | Zpracování | Kategorie údajů | Právní titul | Retence | Poznámka |
|---|---|---|---|---|---|
| a | **CRM kontakty partnerů** (`partner_contacts`) — kontaktní osoby CK, touroperátorů, korporátů, pojišťoven | jméno, e-mail, telefon, pozice, historie komunikace (`interactions`) | oprávněný zájem (B2B vztah a obchodní sdělení) **nebo** souhlas **nebo** plnění smlouvy — konkrétní titul se eviduje u každého kontaktu zvlášť (`lawful_basis`, viz sekce 4) | komunikace (`interactions`) 5 let od posledního záznamu; samotný kontakt do výmazu na žádost nebo dokud partner trvá | pracovní kontaktní údaje fyzických osob u firemních partnerů — GDPR se na ně vztahuje, i když jde o B2B |
| b | **Newslettery** (`newsletters`, `newsletter_recipients`, `newsletter_stats`) | e-mail v okamžiku odeslání (`email_snapshot`), agregované statistiky (otevření, prokliky, odhlášení) | souhlas (explicitní přihlášení) **nebo** oprávněný zájem (existující B2B vztah) — podle zdroje kontaktu | snímek příjemců (`newsletter_recipients`) stejně jako komunikace — 5 let; agregované statistiky (`newsletter_stats`, `newsletter_link_stats`) **bez časového omezení** — jsou anonymní, vážou se na kampaň, ne na osobu | `email_snapshot` je záměrně kopie k okamžiku odeslání — pozdější změna nebo výmaz kontaktu neztratí historii, co bylo komu skutečně posláno |
| c | **Importy souborů** (`imports` + uložený soubor v R2) — Excel výkonnosti, CSV z veletrhu | podle obsahu souboru; u CSV z veletrhu jméno, e-mail, firma, telefon z vizitek/čtečky | plnění smlouvy (výkonnost) / souhlas nebo oprávněný zájem (kontakty z veletrhu, viz sekce 4 a NAVRH 5.4) | **24 měsíců** v R2, poté smazán; záznam o importu (`imports` řádek bez souboru) může zůstat déle jako provozní evidence | soubor je zdrojový doklad k tomu, co bylo naimportováno — ne primární úložiště kontaktu |
| d | **Audit log** (`audit_log`) — kdo, kdy, co, odkud | `actor_id`, `action`, `entity`, `entity_id`, `diff` (jsonb), `ip`, `user_agent`, `at` — **jen tento seznam polí**, nic navíc | oprávněný zájem — bezpečnost, prokazatelnost a vyšetřování incidentů (NAVRH 3.6, N-09) | **12 měsíců**, poté maže výhradně retenční job přes `SECURITY DEFINER` funkci; log je append-only i pro service roli (nejde smazat ani upravit mimo tento job) | `diff` může obsahovat osobní údaje nepřímo (např. změněné jméno kontaktu) — proto retence 12 měsíců, ne neomezeně |
| e | **Prověrky partnerů** (`partner_verifications`) — lustrace v Hlídači státu | firemní údaje: insolvence (jako dlužník/věřitel), stav plátce DPH, počet záznamů v trestním rejstříku právnických osob, pásmo zaměstnanců/obratu | oprávněný zájem — obchodní riziko (posouzení schopnosti partnera plnit smlouvu) | append-only historie, řídí se stejnou retencí jako ostatní partnerská data; `raw` (snímek odpovědi) podléhá whitelist projekci níže | **čl. 9 pole se neukládají** — viz sekce 5 a `src/lib/portal/verifications/hlidac.ts` |
| f | **Auth data uživatelů portálu** (`portal_users`, `user_tokens`, `portal_sessions`, `auth_events`) | e-mail, jméno, role, hash hesla (argon2id), šifrované TOTP tajemství, otisky (ne obsah) session/reset tokenů, IP a user-agent u přihlášení | plnění smlouvy / oprávněný zájem (provoz a bezpečnost portálu — zaměstnanci a smluvní partneři, kteří portál používají) | po dobu aktivního účtu; `auth_events` (neúspěšná přihlášení apod.) stejně jako audit log — bezpečnostní účel, ne trvalá evidence | hesla a TOTP tajemství se neukládají v čitelné podobě nikdy (argon2id / AES-256-GCM s `PORTAL_TOTP_KEY`) |

---

## 2. Zpracovatelé

| Zpracovatel | Role | Co drží | Jurisdikce / DPA |
|---|---|---|---|
| **MailerLite** | rozesílka newsletterů, evidence odběratelů a skupin | e-mail, jméno (volitelně), custom pole (`b2b_vztah`, `b2b_typ`, `b2b_tier`, `b2b_zdroj`, `b2b_crm_id`), historie doručení/otevření/prokliků kampaní | Litva, EU — standardní DPA poskytovatele |
| **Neon** | hostovaná databáze Postgres (schéma `crm`) | veškerá strukturovaná data portálu — partneři, kontakty, newslettery, importy, prověrky, auth | region **Frankfurt**, standardní DPA |
| **Cloudflare R2** | objektové úložiště — zdrojové soubory importů, šifrované denní zálohy databáze | nahrané Excely/CSV (24 měsíců), zálohy `pg_dump` šifrované `age` (30 dní + 12 měsíčních) | bucket s nastavenou **EU jurisdikcí** — data neopouštějí EU |
| **Resend** | transakční e-maily portálu (pozvánky, reset hesla, alerty správci) | e-mailová adresa příjemce, obsah transakčního e-mailu | **DPA doplnit po založení účtu** — k dnešnímu dni nepodepsáno, blokuje ostrý provoz transakčních e-mailů |
| **Vercel** | hosting a běh aplikace (SSR, cron joby) | zpracovává vše, co portál během requestu — provozní logy, žádné trvalé úložiště osobních údajů mimo Neon/R2 | region **fra1** (Frankfurt) |

---

## 3. Práva subjektů údajů

- **Výmaz.** Tlačítko u kontaktu v CRM **anonymizuje** záznam (jméno, e-mail, telefon,
  poznámky se přepíší/smažou) — agregované statistiky (počty otevření, prokliků na
  úrovni kampaně) zůstávají, protože se váží na kampaň, ne na osobu.
  `mailerlite_subscriber_id` se u anonymizovaného kontaktu **schválně ponechává** —
  jinak by nešlo doručit odhlášení zpět z MailerLite do CRM a hrozilo by opětovné
  oslovení stejné osoby z jiného seznamu (NAVRH 3.7).
- **Přístup a oprava.** Přes CRM v portálu — kontakt vidí a opravuje osoba s příslušnou
  rolí (`owner`/`editor`); u žádosti přímo od subjektu údajů zprostředkuje vlastník
  vztahu (`owner_user_id` u partnera).
- **Lhůty.** Standardní lhůta GDPR **1 měsíc** od doručení žádosti (prodloužitelná o
  další 2 měsíce u složitých případů, s informováním žadatele o důvodu prodloužení).
  Žádost se eviduje jako interakce u partnera/kontaktu, aby byla doložitelná lhůta i
  vyřízení.

---

## 4. Původ souhlasu

U každého kontaktu (`partner_contacts`) se eviduje čtveřice polí, která dokládá **jak**
a **kdy** vztah/souhlas vznikl (NAVRH 5.4):

| Pole | Co nese |
|---|---|
| `consent_basis` | typ zdroje: `lead_scanner` (sken vizitky na veletrhu) / `business_card` / `explicit_signup` / `unknown` |
| `opt_in_source` | konkrétní akce nebo kanál, např. `veletrh:ITB-2026`, `import:2026-03`, `manual` |
| `opt_in_at` | datum, kdy vztah/souhlas vznikl |
| `opt_in_evidence` | doklad — text souhlasu ze čtečky vizitek, poznámka obchodníka, případně odkaz na formulář |

U kontaktů z veletrhu je `newsletter_opt_in` ve výchozím stavu **zapnuto** — vizitka
podaná na B2B veletrhu je podaná právě proto, aby se firma ozvala, a čtečky leadů
souhlas obvykle sbírají už při skenu jmenovky. Jediná výjimka je dávka, u které se
nedá určit původ (např. přeposlaný seznam odjinud) — tam zůstává vypnuto, protože tam
nikdo nic nepodal. Odhlašovací odkaz je v každé rozesílce a odhlášení v MailerLite se
automaticky propisuje zpět do CRM.

---

## 5. Co se záměrně neukládá

- **`political_Involvement` a další pole čl. 9 (zvláštní kategorie údajů).** Odpověď
  Hlídače státu u jednatelů a společníků obsahuje vazbu na politiku — podle GDPR čl. 9
  jde o politické názory. Do CRM se **nepřenáší** a hodnocení rizika partnera se o ně
  neopírá. Vynuceno technicky: `src/lib/portal/verifications/hlidac.ts` kopíruje z
  odpovědi API **whitelist** polí (projekce, ne blacklist) — pole mimo tento seznam se
  nemohou dostat do uloženého snímku ani omylem, ať API vrátí cokoli. Ověřuje se firma,
  ne lidé.
- **Fyzické osoby mezi plátci mimo CRM.** Napojení na statistický dashboard
  (`partner_payer_map`) rozlišuje plátce druhem `kind`; hodnota `natural_person`
  označuje plátce, který je fyzická osoba **bez vazby na partnera v CRM** — takový
  záznam se páruje jen na tento příznak, nikdy se pro něj nezakládá kontakt ani
  partner. Osobní údaje fyzických osob mimo B2B vztah do CRM touto cestou neputují.
- **Osobní údaje v audit logu — jen jako seznam polí.** Audit log (sekce 1d) ukládá
  strukturovaná metadata akce (`actor_id`, `action`, `entity`, `entity_id`, `diff`,
  `ip`, `user_agent`, `at`); dokument tady záměrně vyjmenovává **jen názvy polí**, ne
  jejich obsah — obsah `diff` se liší záznam od záznamu a může nepřímo obsahovat
  osobní údaje měněného kontaktu, proto se s ním zachází se stejnou citlivostí jako se
  samotným CRM a platí naň stejná retence (12 měsíců).
