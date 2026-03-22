# Plán: Přestavba stránky "Ubytování" na showcase Ensana Hotels

## Záměr

Přetvořit pillar page `/*/ubytovani|unterkunft|accommodation|prozhivanie` z obecného průvodce ubytováním (hotely + penziony + apartmány) na **exkluzivní showcase 8 hotelů Ensana Health Spa Hotels** v Mariánských Lázních. Veškeré CTA vedou na správné lokalizované URL na `ensanahotels.com`.

---

## Inventář Ensana hotelů (8 hotelů)

| # | Hotel | ★ | Rok | Styl | Klíčový USP |
|---|-------|---|-----|------|-------------|
| 1 | Nové Lázně | 5★ | 1896 | Neorenesance | Římské lázně — jediné ve střední Evropě |
| 2 | Centrální Lázně | 4★ | 1812 | Klasicismus | Nejstarší lázeňský dům, přímo u kolonády |
| 3 | Hvězda | 4★ | 1905 | Secese | Secesní klenot, propojení s Imperial spa |
| 4 | Pacifik | 4★ | 1906 | Neobaroko | Vlastní balneologie, výchozí bod pro výlety |
| 5 | Butterfly | 4★ | 2003 | Moderní | Jediný family-friendly, hlídání dětí |
| 6 | Splendid | 3★ | 1888 | Neoklasicismus | Přístup do spa Centrálních Lázní za 3★ cenu |
| 7 | Vltava | 3★ | 1900 | Secese | Vlastní léčebné centrum, propojení s Pacifikem |
| 8 | Svoboda | 3★ | 1890 | Neorenesance | Klidné místo u lesa, osobní atmosféra |

### Booking URL vzor (per locale)
```
DE: https://ensanahotels.com/de/hotels/{slug}
EN: https://ensanahotels.com/en/hotels/{slug}
CS: https://ensanahotels.com/cs/hotely/{slug}
RU: https://ensanahotels.com/ru/oteli/{slug}
```
(Výjimka: Vltava = `vltava-berounka` ve slug)

Všechny linky dostanou UTM: `?utm_source=marienbad&utm_medium={context}&utm_campaign=hotel-booking`

---

## Nová struktura stránky

### 1. Hero sekce (PillarPage — beze změn komponentu)
- **H1:** Lokalizovaný nadpis zaměřený na Ensana
  - CS: `Ensana lázeňské hotely v Mariánských Lázních`
  - DE: `Ensana Spa Hotels in Marienbad`
  - EN: `Ensana Spa Hotels in Marienbad`
  - RU: `Спа-отели Ensana в Марианских Лазнях`
- **Description:** Krátký evokativní intro text (1–2 věty)

### 2. Hotel tiles grid (vylepšený HotelTiles)
- Zůstává 3:4 portrait grid
- **TODO: Přidat fotky** (zatím bez — vyřeší se zvlášť, není součástí tohoto plánu)
- Pořadí: Nové Lázně → Centrální Lázně → Hvězda → Pacifik → Butterfly → Splendid → Vltava → Svoboda
- Klik → ensanahotels.com (správný locale + UTM)

### 3. Hlavní obsah (přepsaný Markdoc)

#### Sekce A: Úvod — "Proč Ensana" (1 odstavec)
- Síť Ensana, tradice, lékařský přístup, UNESCO město
- Interní link na `/*/historie` a `/*/mineralni-prameny`

#### Sekce B: Prémiové hotely (5★ + 4★)
Pro **každý** hotel (Nové Lázně, Centrální Lázně, Hvězda, Pacifik, Butterfly):
- **H3** s názvem hotelu
- 1–2 odstavce popisného textu (historický kontext + USP)
- Odrážkový seznam klíčových vlastností/procedur
- **Inline CTA** → booking link na ensanahotels.com
- Interní linky kde relevantní (CO2 terapie → `/*/co2-terapie`, prameny → `/*/mineralni-prameny`)

#### Sekce C: Komfortní hotely (3★)
Pro **každý** hotel (Splendid, Vltava, Svoboda):
- **H3** s názvem
- Kratší popis (1 odstavec)
- Value proposition (co získáte za 3★ cenu)
- Inline CTA

#### Sekce D: "Jak si vybrat správný hotel" — rozhodovací průvodce
- Tabulka / porovnání podle kategorie:
  - Luxusní léčba → Nové Lázně
  - Rodiny s dětmi → Butterfly
  - Nejlepší poloha → Centrální Lázně
  - Architektura → Hvězda
  - Klid a příroda → Svoboda
  - Nejlepší cena → Splendid / Vltava

#### Sekce E: Tipy pro rezervaci (zkrácené)
- Sezona, délka pobytu, přímá rezervace, balíčky
- Odstranit zmínky o penzionech a apartmánech

#### Sekce F: FAQ (zachovat kde existuje, rozšířit)
- CS: Upravit existujících 3 FAQ
- DE/EN/RU: Přidat FAQ sekci (3–5 otázek)
- Otázky orientované na Ensana: "Jaké léčebné procedury nabízejí?", "Který hotel je nejlepší pro rodiny?", "Jak dlouhý pobyt se doporučuje?"

### 4. Pull quote
- Nový citát zaměřený na Ensana/léčebnou tradici

---

## Změny meta tagů (per locale)

### CS
```yaml
title: "Ensana lázeňské hotely v Mariánských Lázních"
metaTitle: "Ensana lázeňské hotely v Mariánských Lázních — Spa & Kúra | Marienbad.com"
metaDescription: "8 Ensana hotelů v Mariánských Lázních — od 5hvězdičkových Nových Lázní s Římskými lázněmi po útulné 3hvězdičkové domy s vlastním léčebným centrem."
```

### DE
```yaml
title: "Ensana Spa Hotels in Marienbad"
metaTitle: "Ensana Spa Hotels in Marienbad — Kur & Wellness | Marienbad.com"
metaDescription: "8 Ensana Kurhotels in Marienbad — vom legendären 5-Sterne-Haus Nové Lázně mit Römischem Bad bis zu gemütlichen 3-Sterne-Häusern mit eigenem Kurzentrum."
```

### EN
```yaml
title: "Ensana Spa Hotels in Marienbad"
metaTitle: "Ensana Spa Hotels in Marienbad — Spa Treatments & Wellness | Marienbad.com"
metaDescription: "8 Ensana spa hotels in Mariánské Lázně — from the legendary 5-star Nové Lázně with Roman Bath to cozy 3-star hotels with their own treatment centres."
```

### RU
```yaml
title: "Спа-отели Ensana в Марианских Лазнях"
metaTitle: "Спа-отели Ensana в Марианских Лазнях — Лечение & Wellness | Marienbad.com"
metaDescription: "8 отелей Ensana в Марианских Лазнях — от легендарных 5-звёздочных Новых Лазней с Римскими банями до уютных 3-звёздочных домов с собственным лечебным центром."
```

---

## Soubory k úpravě

| Soubor | Akce |
|--------|------|
| `src/content/pages/cs-ubytovani/index.mdoc` | Přepsat obsah (frontmatter + body) |
| `src/content/pages/de-unterkunft/index.mdoc` | Přepsat obsah |
| `src/content/pages/en-accommodation/index.mdoc` | Přepsat obsah |
| `src/content/pages/ru-prozhivanie/index.mdoc` | Přepsat obsah |
| `src/components/HotelTiles.astro` | Přidat Splendid do `hotelOrder` (aktuálně jen 7, data obsahuje 8) |
| `src/data/hotels.ts` | Ověřit všechny booking URLs, případně přidat `rel="sponsored"` |
| `src/pages/cs/ubytovani.astro` | Beze změn (layout OK) |
| `src/pages/de/unterkunft.astro` | Beze změn |
| `src/pages/en/accommodation.astro` | Beze změn |
| `src/pages/ru/prozhivanie.astro` | Beze změn |

### Soubory BEZ změn
- `PillarPage.astro` — template zůstává
- `HotelRecommendationBox.astro` — nebude potřeba (hotely budou v obsahu přímo)
- `BookingCtaBar.astro` — zůstává (mobilní sticky CTA)
- `Base.astro` — layout OK, meta se řídí frontmatterem

---

## Pořadí implementace

1. **Krok 1:** Opravit `HotelTiles` — přidat `splendid` do `hotelOrder` (8 hotelů)
2. **Krok 2:** Přepsat CS obsah (`cs-ubytovani/index.mdoc`) — vzorová verze
3. **Krok 3:** Přepsat DE obsah (`de-unterkunft/index.mdoc`)
4. **Krok 4:** Přepsat EN obsah (`en-accommodation/index.mdoc`)
5. **Krok 5:** Přepsat RU obsah (`ru-prozhivanie/index.mdoc`)
6. **Krok 6:** Build + verify
7. **Krok 7:** Commit + push

---

## Co NENÍ součástí tohoto plánu (follow-up)
- Fotky hotelů v tiles (vyžaduje asset pipeline)
- Hotelové detail stránky pro CS/RU
- LodgingBusiness schema markup
- Cenové indikátory ("od X €/noc")
- `rel="sponsored"` na external booking links
