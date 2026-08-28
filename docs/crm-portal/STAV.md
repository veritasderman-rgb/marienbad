# Stav implementace partnerského portálu

Jediný zdroj pravdy o postupu autonomního běhu. Aktualizuje ho implementační session
po každé fázi (viz `IMPLEMENTACNI_PLAN.md`, sekce 11).

## Fáze

- [x] Fáze 0 — Základ (auth, schéma, middleware, zálohy)
- [x] Fáze 1 — CRM
- [x] Fáze 2 — Import z veletrhu (CSV)
- [x] Fáze 3 — Newsletter
- [x] Fáze 4 — Statistiky rozesílek
- [ ] Fáze 5 — Import Excelu + srovnání období
- [ ] Fáze 6 — Dashboard výkonnosti
- [ ] Fáze 7 — Ověření partnerů (Hlídač státu)
- [ ] Fáze 8 — Zpevnění
- [ ] Fáze 9 — Napojení statistického dashboardu
- [ ] Závěrečné bezpečnostní review celé větve
- [ ] Definice hotovo splněna, tabulka „Zbývá člověku" v PR

## Otevřené otázky pro vlastníka

*(zatím žádné — plní implementační session)*

- Transakční e-maily: plán volí Resend jako výchozí (plán, sekce 5). Pokud chcete
  jiného dodavatele/SMTP, stačí říct — mění se jen adapter `mail.ts`.

## Deník běhu

| Datum | Fáze | Poznámka |
|---|---|---|
| 2026-08-28 | — | Plán připraven, běh zatím nespuštěn. |
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
