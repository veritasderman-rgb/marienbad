# facts_history_unesco.json — jak používat

Jediný zdroj pravdy pro data, čísla, jména a superlativy v obsahu o historii Mariánských Lázní a zápisu UNESCO (stránky `cs-historie`, `cs-unesco`, články `cs-proc-marianske-lazne-unesco`, `cs-pruvodce-unesco-mesto` a jejich jazykové mutace). Stejný princip jako `data/evidence/balneology_evidence.json` pro zdravotní tvrzení.

1. **Pravidlo:** každé datum, číslo, jméno nebo superlativ („nejstarší“, „jediný“, „nejdelší“) v historickém/UNESCO textu musí mít v souboru záznam se `status` = `confirmed` nebo `corrected`. Použije se hodnota z pole `value`, ne z paměti.
2. `corrected` = web tvrdil něco jiného (`previous_value_on_site`); při přepisu nahradit hodnotou `value` ve všech jazycích a zkontrolovat i soubory uvedené v `note_cs` (např. `cs-kolonada`, `romanBaths.ts`).
3. `unverified` = tvrzení nemá primární ani oficiální zdroj. **Nepublikuje se.** Z textu je odstranit nebo přeformulovat bez čísla podle `note_cs`.
4. Nové tvrzení = nový záznam: `id`, `topic`, `claim_cs/en`, `value`, `status`, `source_title`, `source_url` (skutečně přečtený), `source_type`, `note_cs`. Sekundární zdroj (encyklopedie, média, hamelika.cz) sám o sobě na `confirmed` nestačí.
5. Priorita zdrojů: nominační dokumentace a rozhodnutí UNESCO (`primary`) → Lokální management plán, muml.cz, marianskelazne.cz, muzeum-ml.cz, npu.cz, golfml.cz, chopinfestival.cz, Ensana KB (`official`) → ostatní (`secondary`).
6. Terminologie: „Slavná lázeňská města Evropy“ / „The Great Spa Towns of Europe“; rozhodnutí **44 COM 8B.16**, statek 1613, komponenta 1613-005; „komponenta“ + „nárazníková zóna“ (ne „jádrová zóna“).
7. Klíčová chronologie: 1749 kříž u pramene · 1805–1807 první lázeňský dům (Nehr) · 1808 jméno · 1812 obec (Reitenberger) · 1817 Skalník začíná parky · 6. 11. 1818 veřejné lázně · 29. 5. 1865 město (znak 1. 6. 1866) · 1888–1889 kolonáda · 1896 Nové Lázně · 21. 8. 1905 golf · 30. 4. 1986 fontána · 24. 7. 2021 UNESCO · 2023 klimatické lázně.
8. Zdravotní formulace (např. „prokazatelně podporují léčbu“) tento soubor neřeší – platí redakční standard v `CLAUDE.md` a `data/evidence/`.
9. Konflikty se stávajícími daty jsou popsány v `note_cs` daného záznamu (kolonáda 119 m vs. 135 m, Nové Lázně 1892 vs. 1893, výška 630 vs. 578 m, „Pavel Mikula“ v `cs-kolonada`).
10. Při aktualizaci souboru změnit `meta.version` a přidat datum; záznamy nemazat, jen měnit `status` a doplňovat zdroje.
11. whc.unesco.org byl při tvorbě souboru nedostupný (HTTP 403); pokud bude dostupný, doplnit k UNESCO záznamům odkaz na https://whc.unesco.org/en/list/1613/ a https://whc.unesco.org/en/decisions/7935 jako `primary`.
