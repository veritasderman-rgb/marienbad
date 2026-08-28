# Stav implementace partnerského portálu

Jediný zdroj pravdy o postupu autonomního běhu. Aktualizuje ho implementační session
po každé fázi (viz `IMPLEMENTACNI_PLAN.md`, sekce 11).

## Fáze

- [ ] Fáze 0 — Základ (auth, schéma, middleware, zálohy)
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
