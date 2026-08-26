# Fotobanka Mariánské Lázně — balík pro nahrání do repa `marienbad`

Vygenerováno 2026-08-26 ze složky `foto Marienbad` (archiv Ensana / Mariánské Lázně).

## Co to je

**218 fotek** projitých po jedné, otagovaných a popsaných, převedených do WebP
přesně podle konvence, kterou používá `scripts/optimize-images.mjs` v repu.

- **184** je označeno `publish: true` — připraveno k použití na webu
- **34** je `publish: false` — vodoznak, nízké rozlišení nebo zastaralý vzhled (viz níže)
- **2** soubory (`.dng` RAW) se nedaly zpracovat — viz `skipped-raw.json`

Hodnocení kvality: **61× hero** (nosné, full-bleed), **123× good**
(galerie, doplňkové), **34× weak** (archiv).

## Formát souborů — přesně podle repa

Pro každou fotku tři soubory ve `public/images/library/<kategorie>/`:

| soubor | co to je |
|---|---|
| `<slug>.jpg` | zdroj / fallback, delší strana max 1600 px, q85, progressive |
| `<slug>.webp` | q80, šířka max 1920 px (bez zvětšování) |
| `<slug>-800w.webp` | q80, šířka 800 px (jen když je originál širší) |

To je 1:1 to, co vyrobí `pnpm images` — stejné kvality, stejné šířky, stejné názvy.
Komponenta `<Pic>` z toho poskládá `srcset` bez jakýchkoli úprav.

Celkem: **218 jpg + 218 webp + 217 × 800w**,
dohromady 79 MB
(z toho jpg 48 MB, webp 31 MB).
Originály (1,7 GB) do repa nepatří — zůstávají v `foto Marienbad`.

## Kategorie

| složka | česky | fotek |
|---|---|---|
| `mineral-bath` | minerální koupele | 75 |
| `fitness` | fitness a pohyb | 48 |
| `treatments` | lázeňské procedury | 36 |
| `cuisine` | gastronomie | 21 |
| `hotels` | hotelové interiéry | 12 |
| `lifestyle` | lifestyle | 10 |
| `town` | město a architektura | 6 |
| `drinking-cure` | pitná kúra | 5 |
| `colonnade` | kolonáda | 2 |
| `springs` | prameny | 2 |
| `nature` | příroda | 1 |

## Jak to nahrát

```bash
cd cesta/k/marienbad

# 1) obrázky
cp -R "<tato slozka>/public/images/library/." public/images/library/

# 2) metadata + typovaný helper
cp "<tato slozka>/src/data/photo-library.json" src/data/
cp "<tato slozka>/src/lib/photoLibrary.ts"     src/lib/

# 3) přegenerovat manifest (sharp projede i nové soubory, výsledek je identický)
pnpm images

# 4) kontrola
pnpm build

git add public/images/library src/data/photo-library.json src/data/webp-manifest.json src/lib/photoLibrary.ts
git commit -m "feat(images): add tagged photo library (218 photos, cs/en/de alt + captions)"
```

Krok 3 je doporučený. Když nechceš pouštět `pnpm images`, přimerguj
`src/data/webp-manifest.additions.json` do `src/data/webp-manifest.json` —
obsahuje přesně stejné záznamy (`webp`, `w800`, `width`, `height`).

## Jak se to používá v kódu

```astro
---
import Pic from '@/components/Pic.astro'
import { findPhotos, byId, alt, caption } from '@/lib/photoLibrary'

const heroes = findPhotos({ category: 'colonnade', quality: 'hero', orientation: 'landscape' })
const bath   = byId('mineral-bath/champagne-tub-relax')
const locale = Astro.currentLocale ?? 'cs'
---

<Pic src={bath.path} alt={alt(bath, locale)} sizes="100vw" loading="eager" fetchpriority="high" />
<p class="caption">{caption(bath, locale)}</p>

{heroes.map((p) => <Pic src={p.path} alt={alt(p, locale)} sizes="(min-width: 1024px) 33vw, 100vw" />)}
```

`findPhotos()` vrací ve výchozím stavu jen `publish: true`. Filtrovat jde podle
kategorie, tagů, orientace, hodnocení kvality a přítomnosti lidí na fotce.

## Popisky a alt texty

Každá fotka má `alt` a `caption` ve třech jazycích (`cs`, `en`, `de`).
`alt` je věcný popis toho, co je vidět (pro čtečky a SEO), `caption` je jedna
redakční věta do galerie. Texty vznikly z prohlédnutí každé fotky zvlášť —
projdi si je před nasazením, hlavně u fotek, kde jde poznat konkrétní hotel
nebo pramen; záměrně jsem nikde nedoplňoval jména, která nejsou vidět.

## K ručnímu doladění

| soubor | kvalita | důvod |
|---|---|---|
| `/images/library/cuisine/chocolate-dessert-berries-lowres.jpg` | weak | duplicate of P092 at lower resolution (2000x1333); visible photographer watermark logo mak |
| `/images/library/cuisine/chocolate-poached-pears-lowres.jpg` | weak | duplicate of P093 at lower resolution (2000x1333); visible photographer watermark logo mak |
| `/images/library/cuisine/chopping-green-onions-lowres.jpg` | weak | duplicate of P095 at lower resolution (2000x1333); visible photographer watermark logo mak |
| `/images/library/cuisine/flambe-vegetable-pan-lowres.jpg` | weak | duplicate of P091 at lower resolution (2000x1333); visible photographer watermark logo mak |
| `/images/library/cuisine/green-salad-tomatoes-basil-lowres.jpg` | weak | duplicate of P098 at lower resolution (2000x1333); visible photographer watermark logo mak |
| `/images/library/cuisine/purple-microgreens-macro-lowres.jpg` | weak | duplicate of P094 at lower resolution (2000x1333); visible photographer watermark logo mak |
| `/images/library/cuisine/salad-macro-closeup-lowres.jpg` | weak | duplicate of P099 at lower resolution (2000x1333); visible photographer watermark logo mak |
| `/images/library/cuisine/soup-pour-tableside-lowres.jpg` | weak | duplicate of P096 at lower resolution (2000x1333); visible photographer watermark logo mak |
| `/images/library/cuisine/yellow-pasta-nest-lowres.jpg` | weak | duplicate of P097 at lower resolution (2000x1333); visible photographer watermark logo mak |
| `/images/library/fitness/golfer-bunker-shot.jpg` | weak | Very low resolution (975x548 px), generic stock-photo look. |
| `/images/library/hotels/hotel-lounge-bar-seating.jpg` | weak | Dated 1990s/2000s furnishings and styling. |
| `/images/library/lifestyle/couple-ballroom-dance.jpg` | weak | Staged, hazy generic stock photograph; not tied to any identifiable Marienbad interior. |
| `/images/library/lifestyle/family-sunset-field.jpg` | weak | Generic backlit stock photograph, no connection to a specific location; low resolution (15 |
| `/images/library/lifestyle/woman-dandelion-field.jpg` | weak | Generic stock photograph, no connection to a specific spa or treatment; low resolution (12 |
| `/images/library/mineral-bath/brass-valve-murky-bath.jpg` | weak | Dim, murky water color, soft focus, dated overall look. |
| `/images/library/mineral-bath/empty-hydrotherapy-tub-room.jpg` | weak | Establishing shot within the underwater-massage set (P177-P186). |
| `/images/library/mineral-bath/empty-soaking-tub.jpg` | weak | Dated interior styling, no visible branding confirming the Neapol name. |
| `/images/library/mineral-bath/small-marble-tub-candles.jpg` | weak | Very low native resolution (502x788), unusable for large web display |
| `/images/library/mineral-bath/therapist-sponge-treatment-vintage.jpg` | weak | Dated, unnatural yellow-green color grading; stock-photo look. |
| `/images/library/treatments/aqua-therapy-noodles.jpg` | weak | Dated swimwear and hairstyling suggest an older stock photo; not clearly shot on-site. |
| `/images/library/treatments/aqua-therapy-weights.jpg` | weak | Dated styling similar to P162, likely from the same older photo set. |
| `/images/library/treatments/classic-back-massage.jpg` | weak | Dated stock-photo styling and soft-focus retouching; awkward tight crop. |
| `/images/library/treatments/electrotherapy-back-pads.jpg` | weak | Dated table and lighting. |
| `/images/library/treatments/empty-treatment-room.jpg` | weak | Dated interior; part of a set of empty procedure rooms (P172-P176). |
| `/images/library/treatments/exercise-ball-stretch.jpg` | weak | Generic dated stock photo on a plain studio backdrop, does not reflect the property. |
| `/images/library/treatments/magnetotherapy-treatment-room.jpg` | weak | Dated equipment and cabling; part of a set of empty procedure rooms (P172-P176). |
| `/images/library/treatments/massage-hands-closeup.jpg` | weak | Dated stock-photo styling, very close generic crop with little context; low resolution. |
| `/images/library/treatments/obesity-consultation-desk-repeat.jpg` | weak | near-identical to P089 — same setting, pose and magazines, likely a consecutive burst fram |
| `/images/library/treatments/parafango-back-wrap.jpg` | weak | Dated wood-panel interior and flat lighting typical of an older photo set. |
| `/images/library/treatments/peat-mud-wrap.jpg` | weak | Content is thematically on-brand for the region&#x27;s peat treatments, but resolution is low ( |
| `/images/library/treatments/seated-stretch-stock.jpg` | weak | Generic dated stock photo; colourful gym styling does not match the property and is unlike |
| `/images/library/treatments/traditional-massage-treatment.jpg` | weak | Generic spa stock photograph, no identifiable location; low resolution (1280x853). |
| `/images/library/treatments/treatment-room-equipment.jpg` | weak | Dated interior; part of a set of empty procedure rooms (P172-P176). |
| `/images/library/treatments/ultrasound-treatment-room.jpg` | weak | Dated equipment; part of a set of empty procedure rooms (P172-P176). |

## Ostatní soubory v balíku

- `photo-library.csv` — celá knihovna v tabulce (otevři v Excelu, projdi popisky)
- `gallery.html` — vizuální náhled celé knihovny, otevři v prohlížeči
- `tags-all.json` — surový výstup tagování (`P001`–`P220`)
- `skipped-raw.json` — dvě RAW fotky, které je potřeba vyexportovat z RAW ručně
