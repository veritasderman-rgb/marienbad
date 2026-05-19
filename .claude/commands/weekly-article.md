Napiš 1 nový článek pro web marienbad.com ve všech 4 jazykových mutacích (DE, EN, CS, RU).

## KROK 1 – VÝBĚR TÉMATU

Načti tyto zdroje a vyber jedno téma vhodné pro aktuální týden:
- https://www.marianskelazne.cz/akce/ — aktuální akce ve městě
- https://www.kvregion.cz — destinační novinky Karlovarského kraje
- https://www.visitwestbohemia.cz — West Bohemia tourism

**Prioritní kritérium:** téma MUSÍ být zajímavé pro hotelové hosty Ensana (lázeňští turisté 50+, zdravotně orientovaní, přijíždějí zejm. z DE/AT/CH, pobyt 1–3 týdny). NEPSAT pro obyvatele města.

Vhodné typy témat:
- Konkrétní pramen, procházka, vyhlídka nebo lokace v okolí
- Sezónní aktivita odpovídající aktuálnímu ročnímu období
- Méně známá zajímavost z přírody nebo historie
- Wellness / zdravotní benefit spojený s destinací
- Kulturní akce, která hosty může zaujmout během pobytu

Před výběrem projdi existující slugy v `src/content/articles/` — nevybírej téma, které už pokrytý článek existuje.

## KROK 2 – NAPIŠ ČLÁNEK

- `articleType: cluster` (1 200–1 800 slov v DE verzi)
- `status: draft` (čeká na fotku — nepublikovat)
- `category`: dle obsahu — jedna z: `healing`, `springs`, `activities`, `culture`, `planning`, `nature`, `wellness`, `comparison`, `health`, `history`, `tip`, `food`
- `coverImage: ""` (prázdný string — fotku doplníš ručně v Keystatic)

Piš všechny 4 mutace jako plnohodnotné lokalizované texty — ne přímý překlad, ale text přizpůsobený kultuře čtenáře:
- **DE:** primární verze, nejdelší, nejdetailnější — cílová skupina: němečtí a rakouští lázeňští hosté
- **EN:** mezinárodní hosté
- **CS:** čeští hosté
- **RU:** rusky mluvící hosté (použij cyrilici)

Slug konvence: `{locale}-{slug-v-jazyce-mutace}` — např. `de-fruehling-im-stadtpark`, `cs-jaro-v-mestskem-parku`

## KROK 3 – VYTVOŘ SOUBORY

Pro každou mutaci vytvoř: `src/content/articles/{locale}-{slug}/index.mdoc`

Povinný frontmatter:

```yaml
title:
status: draft
locale:
coverImage: ""
category:
articleType: cluster
excerpt:          # 2–3 věty
pullQuote:        # 1 věta, citovatelná
date:             # dnešní datum YYYY-MM-DD
readingTime:      # odhadni minuty
primaryKeyword:
secondaryKeywords:
metaDescription:
relatedEnsanaLink: https://ensanahotels.com/{locale}/destinace/ceska-republika/marianske-lazne
```

**Styl:** teplý, evokativní, profesionální. Piš jako zkušený průvodce — konkrétní, smyslový, bez generických frází typu "nádherné město" nebo "úžasné zážitky". Primárně vychvaluj destinaci z pohledu toho, co host zažije a proč to stojí za návštěvu.

## KROK 4 – OVĚŘENÍ

Po vytvoření souborů spusť `pnpm build`. Pokud build selže, oprav chybu před ukončením.

Po úspěšném buildu commituj a pushni na aktuální branch a vytvoř PR.
