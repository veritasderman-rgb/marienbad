# Kickoff prompt pro autonomní implementační běh

Session spusťte na modelu **Fable** (hlavní session orchestruje a deleguje na
Opus/Sonnet podle plánu). Do nové session vložte doslova tento prompt:

---

Implementuj partnerský portál `/portal` podle `docs/crm-portal/IMPLEMENTACNI_PLAN.md`.

1. Nejdřív si přečti celé `docs/crm-portal/`: `NAVRH.md`, `BEZPECNOSTNI_AUDIT.md`,
   `IMPLEMENTACNI_PLAN.md` a `STAV.md`. Plán je závazný — včetně hranic běhu
   (sekce 2), rozdělení práce mezi modely (sekce 4) a autonomního protokolu (sekce 11).
2. Jeď plně autonomně fáze 0–9 v pořadí. Neptej se mě na nic, co plán řeší;
   otázky a blokace zapisuj do `STAV.md` a pokračuj. Zastav se jen u destruktivní
   akce nebo skutečné změny rozsahu.
3. Rozdělení práce dodržuj důsledně: bezpečnostní jádro a review děláš sám (Fable),
   složitou logiku deleguj přes Agent tool s `model: "opus"`, objemovou práci
   (UI, testy, dokumentace) s `model: "sonnet"`. Výstupy subagentů před commitem
   revideuj podle plánu; soubory ze seznamu „jen Fable" nikdy necommituj bez
   vlastního řádkového review.
4. Po každé fázi: `pnpm build` + testy zelené, aktualizuj `STAV.md`, commit
   `feat(portal): fáze N — …`, push. Po fázi 0 založ jeden průběžný PR
   „Partnerský portál — implementace (fáze 0–9)" a dál ho udržuj (checklist fází
   v popisu). Repozitář je veřejný — žádná reálná obchodní čísla ani identifikátory
   účtů do kódu, commitů a PR.
5. Živé služby jen v mezích plánu: Neon (projekt EnsanaPortal, migrace nejdřív na
   branch `dev`), MailerLite pouze čtení ID skupin `B2B · *`, Hlídač státu pouze
   čtení na veřejně známých subjektech. Nikdy nic neodesílej, nezakládej kampaně,
   nesahej na B2C data, nevkládej žádná reálná data partnerů.
6. Skonči, až splníš Definici hotovo (plán, sekce 3) — stav „připraveno na přidávání
   dat". Do PR doplň vyplněnou tabulku „Zbývá člověku" (plán, sekce 8) a krátké
   shrnutí. Pak mi ohlaš hotovo.

---

**Poznámka pro vlastníka:** před spuštěním běhu nic dalšího dělat nemusíte — env
proměnné, R2 ani DNS session nepotřebuje (kód píše proti env kontraktu). Lidské
kroky přijdou na řadu až podle tabulky „Zbývá člověku" v závěru PR.
