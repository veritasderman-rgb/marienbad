# Stav implementace partnerského portálu

Jediný zdroj pravdy o postupu autonomního běhu. Aktualizuje ho implementační session
po každé fázi (viz `IMPLEMENTACNI_PLAN.md`, sekce 11).

## Fáze

- [x] Fáze 0 — Základ (auth, schéma, middleware, zálohy)
- [ ] Fáze 1 — CRM
- [ ] Fáze 2 — Import z veletrhu (CSV)
- [ ] Fáze 3 — Newsletter
- [ ] Fáze 4 — Statistiky rozesílek
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
| 2026-08-28 | 0 | Hotovo: migrace 0001 (crm schéma, portal_users, sessions, auth_events, append-only audit_log, role portal_app, RLS+FORCE) aplikovaná na Neon dev branch `dev` a ověřená negativními testy. Vlastní auth (argon2id, pozvánky, povinné TOTP přes otplib v13, HIBP fail-open, limity pokusů v DB, session `__Host-` cookie s hodinovou rotací tajemství), middleware (prohlížečové vs. strojové cesty, Origin+CSRF), admin UI, zálohovací workflow (pg_dump→age→R2, retence 30 d + 12 měs.), robots/sitemap/vercel.json hlavičky, check-client-bundle, seed skript, .env.example. 11 unit testů. Zapracovány 4 souběhové nálezy z Codex review (atomické tokeny, rotace session, TOTP limit, last-owner FOR UPDATE). |

### Poznámky k fázi 0

- `neondb_owner` má na Neonu atribut BYPASSRLS — RLS s FORCE reálně dopadá jen na
  `portal_app` (aplikační cestu); proti kompromitaci owner přístupu chrání
  append-only trigger na audit_logu (N-09). Zapsáno i v migraci 0001.
- Vercel Deployment Protection pro preview (N-04) nejde zapnout z kódu — úkol
  člověka; preview deploye pro `claude/**` větve jsou už ve vercel.json vypnuté.
- Session model: DB-backed session s hodinovou rotací tajemství naplňuje záměr
  „krátký access + rotující refresh" (NAVRH 3.1) a navíc umí okamžitou revokaci.
