# Implementační plán: Partnerský portál `/portal`

**Účel dokumentu:** kompletní pracovní plán pro autonomní implementační běh Clauda.
Session, která dostane kickoff prompt (`KICKOFF_PROMPT.md`), jede podle tohoto plánu
bez dalších dotazů, dokud není splněná **Definice hotovo** (sekce 3) — tedy stav
„připraveno na přidávání dat".

**Závazné vstupy (v tomto pořadí priority):**

1. `docs/crm-portal/NAVRH.md` — co se staví (architektura, datový model, chování)
2. `docs/crm-portal/BEZPECNOSTNI_AUDIT.md` — nálezy N-01 až N-11; každý má v návrhu
   zapracovanou opravu a tento plán je mapuje na fáze (sekce 7)
3. tento plán — jak se to staví, kdo (který model) co dělá, v jakém pořadí
4. `CLAUDE.md` repozitáře — konvence projektu (build před commitem, PR workflow)

Při rozporu platí bezpečnostní audit > návrh > tento plán. Rozpor se zapisuje do
`STAV.md` (sekce Otevřené otázky), nezastavuje práci, pokud existuje bezpečná volba.

---

## 1. Cíl autonomního běhu

Postavit celý portál podle NAVRH.md, fáze 0–9, v jediném dlouhém běhu:

- kód, migrace, testy, dokumentace — vše v repozitáři,
- migrace aplikované na Neon (dev branch průběžně, produkční branch po zelené fázi),
- **žádná reálná data** — portál je na konci prázdný a čeká na prvotní import,
- **žádné odeslání čehokoliv** — kampaně, e-maily partnerům, zápisy do MailerLite skupin
  jsou mimo rozsah běhu.

## 2. Hranice běhu — co session NIKDY nedělá

1. **Žádná tajemství do gitu ani do výstupů.** Session credentials nevymýšlí, nečte
   z chatu a neukládá. Kód se píše proti env kontraktu (sekce 9); chybějící klíč
   znamená „dokončit kód + zapsat do STAV.md", ne blokaci ani improvizaci.
2. **Žádná reálná data partnerů do gitu.** Testovací fixtures jsou vždy fiktivní
   (CK Alfa a.s., Beta Reisen GmbH…). Výsledky případných živých dotazů (Hlídač státu,
   MailerLite) se do repozitáře nezapisují.
3. **MailerLite: pouze čtení.** Povolené je vyčíst ID existujících skupin `B2B · *`
   a polí `b2b_*` (potřeba pro allowlist konstantu). Zakázané: create/update/schedule
   kampaní, zápis odběratelů, jakýkoli dotyk B2C skupin a kvízu.
4. **Hlídač státu: pouze čtení**, výhradně pro ověření tvaru API na veřejně známých
   subjektech (např. Čedok, IČO 60192755) — ne pro lustraci reálných partnerů.
5. **Neon: jen projekt EnsanaPortal.** Migrace nejprve na branch `dev`; na produkční
   branch až po zelených testech fáze. Žádné `DROP` na produkční branchi bez migrace
   se zdůvodněním. Jiné Neon projekty jsou mimo dosah.
6. **Žádné odeslání e-mailu komukoliv mimo fiktivní adresy v testech.**
7. **Veřejný web se nemění** s výjimkou fáze 8 (nonce CSP) a technických souborů
   (`vercel.json`, `robots.txt`, sitemap filtry) — a i tam se chování veřejného webu
   ověřuje buildem a nesmí se rozbít.
8. Repozitář je **veřejný** — platí to i pro komentáře v kódu, commit messages a PR
   texty: žádná jmenovitá obchodní čísla, žádné identifikátory účtů.

## 3. Definice hotovo („připraveno na přidávání dat")

Běh končí, když platí všechno níže — a PR to dokládá:

- [ ] Fáze 0–9 implementované, `pnpm build` zelený, testy zelené.
- [ ] Migrace aplikované na Neon: produkční branch má kompletní prázdné schéma,
      branch `dev` totéž + fiktivní seed.
- [ ] Seed skript (`pnpm portal:seed`) plní dev/preview fiktivními daty; na produkci
      založí pouze prvního `owner` uživatele přes pozvánkový tok.
- [ ] Bezpečnostní checklist (sekce 7) odškrtnutý, závěrečné bezpečnostní review
      celé větve proběhlo a nálezy jsou opravené.
- [ ] Dokumentace: provozní runbook (zálohy + vyzkoušený postup obnovy, rotace klíčů,
      měsíční rutina), env kontrakt, GDPR poznámky.
- [ ] `STAV.md` aktuální; tabulka „Zbývá člověku" (sekce 8) vyplněná v závěru PR.
- [ ] Nic z hranic běhu (sekce 2) nebylo porušeno.

**Vědomě mimo rozsah běhu (udělá člověk / navazující session):** prvotní import
seznamu partnerů, nahrání ukázkových PMS/veletržních souborů, první testovací
rozesílka, DNS (DKIM/DMARC), vložení env proměnných do Vercelu.

---

## 4. Rozdělení práce mezi modely

Hlavní session běží na **Fable** a deleguje přes Agent tool (`model: "opus"` /
`model: "sonnet"`). Zásada: **Fable dělá jen to nejdůležitější** — bezpečnostní jádro
a review; Opus složitou logiku; Sonnet objemovou práci. Fable nikdy nepředává
subagentům tajemství (žádná nejsou k dispozici — viz sekce 2, bod 1) a subagenti dostávají
odkazy na soubory, ne kopie celých dokumentů.

### Fable — orchestrace + bezpečnostní jádro (píše nebo řádkově revideuje)

| Oblast | Proč Fable |
|---|---|
| Orchestrace běhu, pořadí fází, commity, PR, STAV.md | drží kontext celého plánu |
| Fáze 0: auth vrstva (argon2id, pozvánky, reset, TOTP, HIBP, session + refresh rotace, limity pokusů) | jediná vlastní bezpečnostní vrstva projektu |
| `src/middleware.ts` — rozlišení prohlížečových a strojových cest | past popsaná v NAVRH 3.3 |
| Migrace: RLS + `FORCE`, role `portal_app`, nemazatelný audit log (N-09) | druhá obranná vrstva |
| Strojové tokeny: generování, konstantní porovnání, rate limit, alerty (N-05) | autentizační kód |
| Newsletter send path: sanitizace HTML, sandbox náhled, B2B allowlist, schválení owner, omezení test-sendu (N-01, N-02, N-07) | jediné místo, odkud portál něco odesílá ven |
| Sdílená CSV export utilita — specifikace a review (N-03) | injection vektor |
| Nonce CSP veřejného webu (fáze 8) | zásah do veřejného webu |
| Bezpečnostní review diffu **každé fáze** + závěrečné review celé větve | brána kvality |

**Soubory, které smí měnit jen Fable (nebo jiný model pouze s jeho řádkovým review):**
`src/middleware.ts`, `src/lib/portal/auth/**`, `db/migrations/**`,
`src/pages/api/portal/**` (všechny endpointy), sdílená export utilita,
`vercel.json`, CI workflow záloh.

### Opus — složitá logika a data

| Oblast |
|---|
| SQL: `v_performance_compare` + hotelová varianta + testy krajních případů (LAG přes chybějící měsíce, více hotelů) |
| Import Excelu: ExcelJS streaming, stropy na řádky/buňky (N-10), mapovací šablony, validace, upsert |
| Import z veletrhu: detekce kódování (Windows-1250) a oddělovače, dedup (IČO → doména → fuzzy k potvrzení), IČO s vedoucí nulou |
| Hlídač státu: klient, risk engine (`as_Debtor`, ne počet záznamů), měsíční přeověření, notifikace změn, filtrace polí čl. 9 z `raw` |
| Párování plátců: normalizace jmen, `partner_payer_map`, fronta k potvrzení, intake/export logika (fáze 9) |
| Cron joby: idempotence, dohledávání nezpracovaných období, DB zámek proti souběhu |
| MailerLite klient + noční sync skupin (logiku píše Opus, allowlist a send path revideuje Fable) |
| Zálohovací GitHub Action (pg_dump + age + R2) a dry-run obnovy |
| Agregační dotazy dashboardu výkonnosti |

### Sonnet — objemová práce (vždy s review Opuse nebo Fable před commitem)

| Oblast |
|---|
| Všechny obrazovky `/portal/*` — Astro stránky + React ostrůvky, formuláře, tabulky, SVG grafy (UI reference: sekce 10) |
| Maskování kontaktů v UI podle role (logiku maskování specifikuje Fable — maskuje se na serveru, ne v klientu) |
| Průvodci importem (kroky, náhled, chybové stavy) nad logikou od Opuse |
| E-mailové šablony (pozvánka, reset, upozornění, měsíční souhrn) |
| Testy CRUD a komponent, fixtures (fiktivní data) |
| Dokumentace: runbook, env kontrakt, GDPR texty |
| `robots.txt`, sitemap filtry, gitleaks CI, drobné konfigurace |

### 4.1 Pravidla delegace

- Jeden subagent = jeden ohraničený úkol s akceptačními kritérii; výstup se před
  commitem revideuje (Sonnet → Opus nebo Fable; Opus → Fable u dotyku s citlivými soubory).
- Subagenti nikdy nevolají živé služby zápisově; čtecí ověření (MailerLite ID skupin)
  dělá výhradně hlavní session.
- Paralelizovat lze jen úkoly bez společných souborů (typicky UI obrazovky různých modulů).

---

## 5. Technická rozhodnutí (předem, ať se běh nezasekává)

| Rozhodnutí | Volba | Poznámka |
|---|---|---|
| DB klient | `pg` (node-postgres) přes **pooler** endpoint | serverless; migrace a dump přes přímý endpoint |
| Migrace | čisté SQL v `db/migrations/NNN_nazev.sql` + malý runner `scripts/db-migrate.mjs` (tabulka `crm._migrations`) | žádné ORM; view a RLS jsou první třída |
| Hesla | `@node-rs/argon2` (argon2id) | prebuilt binárky fungují na Vercelu |
| TOTP | `otplib` | tajemství šifrovaná klíčem `PORTAL_TOTP_KEY` |
| HIBP | range API (k-anonymita), fail-open s logem | výpadek HIBP nesmí zablokovat přihlášení |
| Limity pokusů | tabulka v Postgresu (`auth_events`), ne in-memory | serverless instance nesdílí paměť |
| Sanitizace newsletteru | `sanitize-html` s whitelistem e-mailových tagů | před uložením draftu, ne až při zobrazení |
| Excel | `ExcelJS` streaming reader, strop řádků/buněk | nikdy balíček `xlsx` z npm (NAVRH 5.3) |
| R2 | `@aws-sdk/client-s3` proti R2 endpointu | presigned URL se nepoužívají — soubory jdou přes server |
| Transakční e-maily (pozvánky, reset, alerty) | **Resend** (free tarif, EU odesílání), env `RESEND_API_KEY`; abstrakce `src/lib/portal/mail.ts`, aby šel dodavatel vyměnit | MailerLite transakční maily neumí; pokud vlastník rozhodne jinak, mění se jen adapter — zapsat do STAV.md jako otevřená otázka |
| Testy | `vitest` (devDependency) | unit: utility, risk engine, parsery, maskování; integrační: SQL view na Neon `dev` branchi |
| UI | Czech-only, stávající paleta Ensana + font Branding | viz sekce 10 |
| Struktura kódu | `src/pages/portal/**`, `src/pages/api/portal/**`, `src/lib/portal/**`, `src/components/portal/**`, `db/migrations/**` | portál oddělený od veřejného webu, sdílí jen layout základ |

---

## 6. Fáze — úkoly, modely, akceptační kritéria

Pořadí je závazné: **0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9.** (Fáze 7 lze předsadit
jen na pokyn člověka.) Značky: [F] Fable, [O] Opus, [S] Sonnet.

### Fáze 0 — Základ (auth, schéma, middleware, zálohy)

- [F] Migrace 001+: schéma `crm`, `portal_users`, `audit_log` (append-only, N-09),
  role `portal_app` s minimálními právy, RLS + `FORCE ROW LEVEL SECURITY` všude.
- [F] Auth: pozvánkový tok (registrace vypnutá), argon2id, HIBP, min. 12 znaků,
  povinné TOTP s nastavením při prvním přihlášení, reset jednorázovým odkazem,
  session `__Host-` cookie (HttpOnly, Secure, SameSite=Lax), access 1 h + rotující
  refresh, neaktivita 8 h, absolutně 7 dní, „odhlásit všude", limity pokusů + alert.
- [F] `src/middleware.ts`: prohlížečové vs. strojové cesty (`/api/portal/cron/*`,
  `/api/portal/intake/*`, `/api/portal/export/*` — nikdy redirect, cookie ignorují),
  CSRF (Origin + double-submit) pro zápisové prohlížečové cesty.
- [F] Build-time kontrola, že do klientského bundlu neteče žádná ne-`PUBLIC_` proměnná.
- [S] Obrazovky: přihlášení, TOTP, přijetí pozvánky, `/portal/admin/users`, `/portal/admin/audit`.
- [S] `vercel.json` blok pro `/portal/*` (přísná CSP, `X-Robots-Tag`, `no-store`),
  `robots.txt` Disallow, vyloučení z obou sitemap.
- [O] GitHub Action: denní šifrovaný pg_dump → R2 (kód + workflow; ostrý běh čeká na
  R2 klíče), skript obnovy + runbook.
- Akceptace: pozvánka→heslo→TOTP→přihlášení funguje na dev DB; strojová cesta
  s cookie bez tokenu vrací 401 a nikdy 3xx; RLS ověřená negativním testem pod
  `portal_app`; audit log nejde UPDATE/DELETE ani ownerem tabulky.

### Fáze 1 — CRM

- [O] Migrace `partners`, `partner_contacts`, `interactions` + dotazová vrstva
  (filtry, fulltext, řazení), serverové maskování kontaktů pro `analyst`/`viewer`.
- [S] `/portal/partners` (seznam + filtry), `/portal/partners/[id]` (karta: kontakty,
  komunikace, místo pro graf výkonnosti), formuláře, anonymizační tlačítko (GDPR výmaz).
- Akceptace: CRUD krytý testy; `analyst` nikdy nedostane nemaskovaný e-mail ani
  v API odpovědi (test na JSON, ne jen na UI).

### Fáze 2 — Import z veletrhu (CSV)

- [O] Parser (kódování, oddělovač, desetinná čárka, IČO s nulou), dedup pipeline,
  evidence `consent_basis`/`opt_in_*`, tabulky `imports`, `import_templates`.
- [S] Průvodce `/portal/import/leads` s náhledem a přepínačem opt-in (default zapnuto,
  výjimka „neurčitelný původ" dle NAVRH 5.4).
- Akceptace: testy na Windows-1250 vzorku, `;` oddělovači a IČO `00123456`; duplicitní
  kontakt se nezaloží dvakrát; fuzzy shoda vždy končí u člověka.

### Fáze 3 — Newsletter

- [O] Stavový stroj draft→approved→scheduled→sent, archiv + snímek příjemců,
  MailerLite klient, noční sync skupin (`newsletter_opt_in` → skupiny, odhlášení zpět).
- [F] Sanitizace při uložení, náhled výhradně `<iframe sandbox srcdoc>` bez
  `allow-scripts`/`allow-same-origin`, **allowlist ID skupin `B2B · `** (kontrola na ID,
  načtená čtecím ověřením — sekce 2, bod 3), test-send jen na `@ensanahotels.com`/`@marienbad.com`,
  odeslání jen role `owner` po záznamu `approved_by/at`, intake endpoint
  `newsletter-draft` s vlastním tokenem, který umí jen založit draft.
- [S] `/portal/newsletters`, `/portal/newsletters/new` (náhled desktop/mobil/plain,
  výběr segmentu s počtem příjemců).
- Akceptace: pokus o odeslání mimo allowlist skončí chybou v testu; draft s
  `<img onerror>` se uloží vyčištěný a náhled nespustí skript; bez schválení
  neexistuje cesta k odeslání (test na API, ne jen chybějící tlačítko). Živá kampaň
  se nezakládá — MailerLite volání kryjí mock testy.

### Fáze 4 — Statistiky rozesílek

- [O] `crons` ve `vercel.json`, endpoint s `CRON_SECRET`, idempotentní sběr do
  append-only `newsletter_stats` + `newsletter_link_stats`, DB zámek, dohledání
  zameškaných období, e-mail souhrn (šablona [S]).
- Akceptace: dvojí běh nezaloží duplicitní řádky; výpadek období se doběhne.

### Fáze 5 — Import Excelu + srovnání období

- [O] `/portal/import` průvodce logika, ExcelJS streaming s tvrdými stropy (N-10),
  mapovací šablony, upsert dle `(partner_id, period_month, hotel_slug)`,
  `v_performance_compare` + hotelová varianta, SQL testy (partner přes více hotelů,
  díra v řadě měsíců, R12 na kraji řady).
- [F] Sdílená export utilita: prefix `'` pro `=`,`+`,`-`,`@`, BOM, středník (N-03).
- [S] `/portal/reports` (MoM/YoY/R12, CSV export), UI průvodce.
- Akceptace: view vrací správné hodnoty na fixture s dírami; export buňky `=1+1`
  začíná apostrofem; soubor 5 MB s milionem řádků import odmítne stropem.

### Fáze 6 — Dashboard výkonnosti

- [O] Agregace nad view: KPI, trend 24 měsíců, rozpady (segment/země/hotel/tier),
  největší pohyby, koncentrace TOP 5, průnik s rozesílkami.
- [S] `/portal/dashboard` dle UI reference (sekce 10) — lehké SVG, bez grafových knihoven.
- Akceptace: referenční bod = poslední uzavřený měsíc s daty; prázdná DB ukáže
  prázdné stavy, ne chybu.

### Fáze 7 — Ověření partnerů (Hlídač státu)

- [O] Klient + risk engine (`alert`/`watch`/`ok` dle NAVRH 5.5, rozhoduje `as_Debtor`),
  párování jen přes potvrzené IČO, append-only `partner_verifications`, měsíční
  přeověření v cronu, notifikace při změně stupně, atribuce zdroje + licence.
- [F] Review: do `raw` se ukládá **filtrovaný** snímek bez polí čl. 9
  (`political_Involvement` a příbuzná) — filtr je v kódu, ne dohoda.
- [S] `/portal/verifications`; zahraniční partner = `neověřeno`, nikdy `ok`.
- Akceptace: fixture „věřitel v 185 řízeních" vyhodnotí `ok`; fixture s otevřenou
  insolvencí jako dlužník `alert`; v uloženém `raw` není žádné pole čl. 9 (test).

### Fáze 8 — Zpevnění

- [F] Nonce CSP na veřejném webu (odstranit `unsafe-inline` u `script-src`, GA4 přes
  nonce) — ověřit buildem a manuálním smoke testem klíčových stránek.
- [S] gitleaks v CI, bezpečnostní checklist do dokumentace, GDPR: záznamy o činnostech,
  rozšíření privacy stránek (texty připraví, publikaci rozhodne člověk).
- [O] Dry-run obnovy zálohy na Neon branch + zapsaný, vyzkoušený postup.
- Akceptace: veřejný web funguje s nonce CSP (konzole bez CSP chyb na homepage,
  pillar page, kvízu); CI padá na nastrčený testovací „klíč".

### Fáze 9 — Napojení statistického dashboardu

- [O] `partner_payer_map` + normalizace, `POST /api/portal/intake/performance`
  (idempotence přes sha256 + upsert), fronta nespárovaných, `GET /api/portal/export/partners`
  s **výčtovou projekcí** polí (NAVRH 6.4) a agregátem rizika (N-06 — nikdy jmenovité
  `risk_level`).
- [F] Oba tokeny, jednosměrnost rozsahu, review projekce.
- [S] `/portal/partners/mapping` (fronta, návrhy podobných jmen, potvrzení).
- Akceptace: trojí push téže dávky = jeden výsledek; nespárovaný plátce se nikam
  nezapočítá; export neobsahuje `risk_level`, kontakty ani poznámky (test na JSON).

---

## 7. Bezpečnostní brána — mapování auditu na fáze

Fable po každé fázi projde příslušné řádky; před koncem běhu musí být vše ✔.

| Nález | Oprava ověřená v fázi |
|---|---|
| N-01 klíč MailerLite jen server-side, draft token = náš endpoint | 3 |
| N-02 sanitizace + sandbox náhled | 3 |
| N-03 CSV injection — sdílená utilita | 5 (používá i 1, 6, 9) |
| N-04 preview: Deployment Protection + Neon branch s anonymizovanými daty | 0 (konfigurace + dokumentace) |
| N-05 strojové tokeny: náhoda ≥ 32 B, konstantní čas, rate limit, alert | 0, 9 |
| N-06 export bez jmenovitého rizika | 9 |
| N-07 tvrdý allowlist B2B skupin | 3 |
| N-08 DKIM/DMARC — připravená dokumentace + kontrola v runbooku (DNS dělá člověk) | 8 |
| N-09 nemazatelný audit log | 0 |
| N-10 zip-bomba — stropy na rozbalená data | 5 |
| N-11 tokeny na stroji marketingu — postup revokace v runbooku | 8, 9 |

Závěrem běhu: kompletní bezpečnostní review celé větve (skill `security-review`,
je-li k dispozici, jinak ruční průchod checklistem) a oprava nálezů před finálním pushem.

---

## 8. Zbývá člověku (session to na konci vyplní do PR)

| # | Úkol | Kdy | Odhad |
|---|---|---|---|
| 1 | Reset hesla Neon role (prošlo chatem — NAVRH 2.2) a vložení `DATABASE_URL` + `DATABASE_URL_DIRECT` do Vercelu a `.env.local` | před nasazením | 15 min |
| 2 | Založit R2 bucket (EU jurisdikce) + klíče do Vercelu a GitHub Secrets (zálohy) | před nasazením | 15 min |
| 3 | Vygenerovat a vložit ostatní env proměnné dle kontraktu (sekce 9) | před nasazením | 15 min |
| 4 | Zapnout Vercel Deployment Protection pro preview | před prvním PR preview | 5 min |
| 5 | Rozhodnout transakční e-mail (default Resend) a založit účet/klíč | před pozvánkami | 15 min |
| 6 | DNS: DKIM pro MailerLite, DMARC `p=quarantine`, zvážit `news.marienbad.com` | před první rozesílkou | 15 min |
| 7 | Pozvat prvního `owner` uživatele, projít přihlášení + TOTP | po nasazení | 10 min |
| 8 | Dodat data: seznam partnerů, ukázka PMS Excelu, ukázka CSV z veletrhu | fáze „přidávání dat" | — |

## 9. Env kontrakt (jména jsou závazná; hodnoty nikdy do gitu)

| Proměnná | Účel | Odkud |
|---|---|---|
| `DATABASE_URL` | Neon pooler, běh aplikace (`sslmode=require&channel_binding=require`) | Neon konzole |
| `DATABASE_URL_DIRECT` | přímý endpoint — migrace, pg_dump | Neon konzole |
| `PORTAL_SESSION_SECRET` | podpis session tokenů (≥ 32 B náhody) | vygenerovat |
| `PORTAL_TOTP_KEY` | šifrování TOTP tajemství | vygenerovat |
| `CRON_SECRET` | Vercel Cron → cron endpointy | vygenerovat |
| `MAILERLITE_API_KEY` | vlastní klíč portálu (ne MCP klíč) | MailerLite |
| `NEWSLETTER_DRAFT_TOKEN` | intake konceptů (Claude) — umí jen založit draft | vygenerovat |
| `DASHBOARD_INTAKE_TOKEN` | push výkonnosti z PMS enginu | vygenerovat |
| `DASHBOARD_EXPORT_TOKEN` | čtení projekce partnerů enginem | vygenerovat |
| `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | soubory + zálohy | Cloudflare |
| `RESEND_API_KEY` | transakční e-maily | Resend |
| `PORTAL_ALERT_EMAIL` | adresa správce pro alerty | vlastník |

Nic z toho nikdy s prefixem `PUBLIC_`. Session vygeneruje `.env.example` s prázdnými
hodnotami a popisem.

## 10. UI reference (náhrada mockupu, který kvůli reálným datům není v gitu)

Vlastník drží interaktivní mockup `/portal/dashboard` mimo git. Pro stavbu UI platí:

- **Layout:** tmavě modrý header (brand + horizontální nav: Partneři · Newslettery ·
  Import · Dashboard · Reporty · Ověření + uživatel/role/odhlásit), pod ním bílý pruh
  filtrů (Období · Segment · Hotel), obsah na béžovém pozadí v bílých kartách
  se zaoblením ~10 px a jemným stínem, max šířka ~1440 px.
- **Dashboard:** řádek 5 KPI dlaždic (hodnota + delta se ▲/▼), dvousloupcová sekce
  „Největší pohyby" (divergentní bary od nulové osy, zelená/červená) a „TOP plátci"
  (horizontální bary + rozbalovací tabulka), 100% skládaný pruh „Struktura tržeb podle
  typu plátce" s legendou, tabulka „Riziko × obrat" (chip stavu: ✓ v pořádku / ● čeká
  na IČO / — neověřeno zahraniční / alert), karty skupin MailerLite, karta „Fronta
  mapování plátců" se žlutým zvýrazněním.
- **Barvy:** pozadí `#F5EEE1`, primární `#004F71`, text `#1C2B33`, sekundární text
  `#5F6B72`, pozitivní `#1E7A4F`, negativní `#B3264F`, výstraha `#E8A400`, akcenty
  `#0E6EA8`/`#4FB3D9`/`#8AD8ED`, segmentové chipy: CK `#0E6EA8`, pojišťovna `#E8A400`,
  distribuce `#9C1D5F`, OTA `#4FB3D9`, korporát `#C05F2E`, přímí `#129C6C`, ostatní `#8C949B`.
- **Typografie:** font Branding jako zbytek webu (mockup měl Verdanu jen jako zástupce);
  drobné popisky verzálkami s prostrkáním, čísla tučně v primární barvě.
- Grafy = čisté SVG s `data-tip` tooltipy, žádné grafové knihovny; tabulková alternativa
  ke každému grafu (přístupnost).

## 11. Autonomní protokol běhu

1. **Větev a PR:** vše na designated branch session; jeden průběžný PR
   „Partnerský portál — implementace (fáze 0–9)" založený po fázi 0, popis PR drží
   živý checklist fází. Commit na konec každé fáze (i dílčí commity uvnitř velkých
   fází): `feat(portal): fáze N — <co>`. Vlastník může mergovat kdykoli; session
   pokračuje na téže větvi.
2. **Před každým commitem:** `pnpm build` + testy zelené (CLAUDE.md).
3. **Po každé fázi:** aktualizovat `docs/crm-portal/STAV.md` (checkbox, poznámky,
   otevřené otázky), provést bezpečnostní minireview fáze (sekce 7), push.
4. **Blokace:** chybějící klíč/služba nezastavuje běh — kód se dokončí proti env
   kontraktu, ověří se mockem/testem a věc se zapíše do STAV.md. Otázky na člověka
   se hromadí tamtéž; session se ptá jen u destruktivních akcí nebo změny rozsahu.
5. **Kontext:** při dlouhém běhu je STAV.md jediný zdroj pravdy o postupu — po
   kompresi kontextu se session řídí jím a tímto plánem, ne pamětí.
6. **Konec běhu:** splnit Definici hotovo (sekce 3), doplnit do PR tabulku „Zbývá
   člověku" a krátké shrnutí pro vlastníka.
