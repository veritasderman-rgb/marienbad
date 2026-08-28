# Stav implementace partnerského portálu

Jediný zdroj pravdy o postupu autonomního běhu. Aktualizuje ho implementační session
po každé fázi (viz `IMPLEMENTACNI_PLAN.md`, sekce 11).

## Fáze

- [x] Fáze 0 — Základ (auth, schéma, middleware, zálohy)
- [x] Fáze 1 — CRM
- [x] Fáze 2 — Import z veletrhu (CSV)
- [x] Fáze 3 — Newsletter
- [x] Fáze 4 — Statistiky rozesílek
- [x] Fáze 5 — Import Excelu + srovnání období
- [x] Fáze 6 — Dashboard výkonnosti
- [x] Fáze 7 — Ověření partnerů (Hlídač státu)
- [x] Fáze 8 — Zpevnění
- [x] Fáze 9 — Napojení statistického dashboardu
- [x] Závěrečné bezpečnostní review celé větve
- [x] Definice hotovo splněna, tabulka „Zbývá člověku" v PR

## Otevřené otázky pro vlastníka

- Transakční e-maily: plán volí Resend jako výchozí (plán, sekce 5). Pokud chcete
  jiného dodavatele/SMTP, stačí říct — mění se jen adapter `mail.ts`.
- Kurz CZK→EUR pro výkonnost: env `PORTAL_FX_CZK_EUR` (default 25.0) — jedno
  číslo, jeden zdroj pravdy. Chcete-li měsíční kurz ČNB, jde doplnit později.
- Hlídač státu: portál potřebuje vlastní `HLIDAC_TOKEN` (registrace zdarma na
  hlidacstatu.cz). Endpoint insolvencí má dle swaggeru „komerční licenci" —
  audit ho měl přes MCP funkční; kdyby REST s free tokenem vracel 403, prověrky
  se přepnou do stavu „nenakonfigurováno" a nic jiného nerozbijí. Ověřit při
  vložení tokenu.
- Jemné cílení newsletteru („CK, Německo, tier A+B") zatím segmentuje publikum
  × jazyk (skupiny). Filtry segment/tier vyžadují MailerLite segmenty přes API —
  námět na doplnění, v UI zatím není nabízeno.

## Deník běhu

| Datum | Fáze | Poznámka |
|---|---|---|
| 2026-08-28 | 9 + review | Fáze 9 dokončena: strojový intake výkonnosti z PMS (jen uzavřené měsíce, idempotence přes sha256 dávky, měnu přepočítává výhradně portál dle NAVRH 6.3), fronta mapování plátců `/portal/partners/mapping` (návrhy podobných jmen jen jako pomůcka — potvrzuje vždy člověk; po potvrzení se čekající PMS dávky přehrají idempotentním upsertem, žádný řádek se neztratí), výčtový export `GET /api/portal/export/partners` (explicitní projekce, nikdy kontakty ani jmenovité riziko — N-06). Závěrečné bezpečnostní review celé větve (security-review skill, finder Opus + false-positive filtr): **žádný nález nad prahem důvěryhodnosti**. Jediný kandidát (viewer vidí per-partnera obrat přes reporty/dashboard, důvěra 6/10) je zdokumentovaný záměr — NAVRH 3.2 dává vieweru „dashboard a reporty", NAVRH 5.6 výslovně: „maskují se jen kontaktní údaje, ne čísla". Pod prahem poznamenáno: retence `payer_name_raw` u řádků druhu fyzická osoba (řeší roční GDPR rutina v RUNBOOK.md) a `source_url` z Hlídače v UI prověrek (renderováno Reactem, doména Hlídače). Testovací přístup: owner účet pro vlastníka založen na **dev branchi** Neonu přes pozvánkový tok (žádné generované heslo — dle NAVRH 3.1 heslo nikdy nezná nikdo jiný než držitel účtu). Celkem 240 testů zelených, produkční Neon branch má kompletní schéma (7 migrací). |
| 2026-08-28 | — | Plán připraven, běh zatím nespuštěn. |
| 2026-08-28 | 5–8 | Fáze 5: ExcelJS import se stropy (N-10), reporty MoM/YoY/R12 + CSV export, průvodce UI. Fáze 6: dashboard výkonnosti (KPI, trend 24 měs. generovaný sérií, rozpady, largest movers YTD, koncentrace TOP 5, newsletter overlap jako souvislost). Fáze 7: prověrky — klient Hlídače s whitelist projekcí (čl. 9 se nemůže uložit), risk engine as_Debtor, orchestrace s notifikacemi při zhoršení, /portal/verifications s licencí, měsíční přeověření ve stejném cronu jako statistiky (Hobby strop 2 crony), prověrka při založení partnera. Fáze 8: CSP veřejného webu BEZ unsafe-inline (GA extrahována do /scripts/ga-init.js s data-atributy, 5 statických skriptů převedeno na bundlované), gitleaks CI, RUNBOOK.md (rutiny, rotace, incident, N-08/N-11), GDPR.md (čl. 30 podklad). Zapracovány 4 nálezy Codex z PR #280: single-flight zámek odeslání + rekonsiliace skupin před kampaní (P1), claim importu v transakci, podobnost v %. Pozn.: HLIDAC_TOKEN přidán do env kontraktu (REST API vyžaduje token — swagger tvrdí opak, ověřeno sondou 302). |
| 2026-08-28 | 3+4 | Fáze 3 dokončena: noční sync CRM→B2B skupiny (idempotentní, zámek v job_locks, GDPR scrubbing e-mailů z chyb, B2C skupin se nikdy nedotkne), ruční sync z UI, obrazovky newsletterů (archiv, editor, náhled výhradně v sandbox iframe bez skriptů, segment picker s živým počtem příjemců, schválení/odeslání jen owner). Fáze 4: měsíční cron statistik (append-only časová řada, idempotence na den, zámek, měsíční souhrn e-mailem — hlavní metrika prokliky a CTOR kvůli Apple MPP), crons ve vercel.json. Navíc: migrace 0005 (partner_performance + v_performance_compare ověřené na fixture v Postgresu), sdílená CSV export utilita (N-03), 4 opravy z Codex review PR #279 (atomické token+heslo v transakci, null místo undefined při mazání hodnot ve formulářích, právní titul u každého kontaktu). |
| 2026-08-28 | 2 | Hotovo: CSV parser (detekce UTF-8/Windows-1250, oddělovače, RFC4180, stropy 5 MB/5000 řádků), IČO s vedoucí nulou, dedup (IČO → doména e-mailu → fuzzy pg_trgm jen k lidskému potvrzení), dvoukrokový průvodce s dry-run náhledem, evidence souhlasu (consent_basis, opt_in_source povinné při opt-in), best-effort archiv originálu do R2, šablony mapování, historie importů. Fáze 3 (jádro, Fable): allowlist 6 B2B skupin ověřený čtením z MailerLite, sanitizace HTML, MailerLite klient s vynucením allowlistu, intake endpoint (NEWSLETTER_DRAFT_TOKEN umí jen koncept), schválení jen owner, odeslání jen owner + schváleno, test-send jen interní domény. Migrace 0003+0004 na dev branchi. |
| 2026-08-28 | 1 | Hotovo: dotazová vrstva CRM (whitelisty sloupců, validátor IČO mod 11, escapované ILIKE), endpointy partners/contacts/interactions s rolemi (viewer 403, mutace editor+, mazání owner), serverové maskování, GDPR anonymizace, obrazovky /portal/partners a detail partnera (filtry, řazení, kontakty, timeline komunikace), 46 nových unit testů (celkem 57). |
| 2026-08-28 | 0 | Hotovo: migrace 0001 (crm schéma, portal_users, sessions, auth_events, append-only audit_log, role portal_app, RLS+FORCE) aplikovaná na Neon dev branch `dev` a ověřená negativními testy. Vlastní auth (argon2id, pozvánky, povinné TOTP přes otplib v13, HIBP fail-open, limity pokusů v DB, session `__Host-` cookie s hodinovou rotací tajemství), middleware (prohlížečové vs. strojové cesty, Origin+CSRF), admin UI, zálohovací workflow (pg_dump→age→R2, retence 30 d + 12 měs.), robots/sitemap/vercel.json hlavičky, check-client-bundle, seed skript, .env.example. 11 unit testů. Zapracovány 4 souběhové nálezy z Codex review (atomické tokeny, rotace session, TOTP limit, last-owner FOR UPDATE). |

### Poznámky k fázi 1

- Do audit logu se u kontaktů zapisuje jen seznam změněných polí, ne hodnoty —
  osobní údaje v append-only logu by obcházely GDPR výmaz.
- Anonymizace kontaktu ponechává `mailerlite_subscriber_id`, jinak by ho sync
  fáze 3 nedokázal odhlásit v MailerLite.
- Duplicitní IČO se řeší odchycením unique violation (atomicky), ne pre-checkem.

### Poznámky k fázi 0

- `neondb_owner` má na Neonu atribut BYPASSRLS — RLS s FORCE reálně dopadá jen na
  `portal_app` (aplikační cestu); proti kompromitaci owner přístupu chrání
  append-only trigger na audit_logu (N-09). Zapsáno i v migraci 0001.
- Vercel Deployment Protection pro preview (N-04) nejde zapnout z kódu — úkol
  člověka; preview deploye pro `claude/**` větve jsou už ve vercel.json vypnuté.
- Session model: DB-backed session s hodinovou rotací tajemství naplňuje záměr
  „krátký access + rotující refresh" (NAVRH 3.1) a navíc umí okamžitou revokaci.
