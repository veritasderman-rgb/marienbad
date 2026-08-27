# Svatební fotobanka — image manifest

Sada `public/images/library/wedding/` — 20 fotografií, připraveno podle konvence
ostatních `library/*` sad (JPG max 1600 px na delší straně, q82 mozjpeg + WebP
sourozenci `.webp` a `-800w.webp`).

**Po nakopírování do repa spusť `pnpm images`** — přegeneruje `src/data/webp-manifest.json`,
bez toho `lookup()` v `src/lib/imageOptim.ts` sadu nenajde a `<Pic>` spadne zpět na holý `<img>`.

Použití vždy přes `<Pic>`:

```astro
<Pic
  src="/images/library/wedding/main-colonnade-couple-dancing.jpg"
  alt={c.alts.dancing}
  class="w-full h-full object-cover"
  sizes="(min-width: 1024px) 50vw, 100vw"
/>
```

---

## ⚠️ Než cokoli publikuješ

1. **Souhlas vyobrazených osob.** Na fotkách jsou dva konkrétní, identifikovatelné
   svatební páry a v `outdoor-ceremony-first-kiss` i svatební hosté. Pro použití na
   veřejném webu je potřeba písemný souhlas — postup máš už zavedený v
   `docs/stories/souhlas-pribehy-brief.md`, dá se použít stejná šablona.
2. **Licence a kredit fotografa.** Markdoc tag `figure` má atributy `credit` a `creditHref` —
   doplň je, jakmile bude jméno autora potvrzené. V manifestu níže je u každé fotky
   pole `credit:` schválně prázdné.
3. **Dva různé páry, dvě různá prostředí.** Trojice `outdoor-ceremony-first-kiss`,
   `garden-pavilion-couple` a `wedding-rings-detail` je z jiné svatby a z lesního
   prostředí, které není rozpoznatelně Mariánské Lázně. Nemíchat je do galerie
   s kolonádou v jednom bloku — mají vlastní sekci „obřad pod širým nebem".

---

## Skupina 1 — Hlavní kolonáda (5×)

### `main-colonnade-couple-dancing.jpg` — 1067×1600, portrait
Nevěsta a ženich tančí pod litinovou klenbou Hlavní kolonády. **Hlavní hero fotka.**
- **cs:** Novomanželé tančí pod klenbou Hlavní kolonády v Mariánských Lázních
- **de:** Brautpaar tanzt unter dem Gewölbe der Hauptkolonnade in Marienbad
- **en:** Newlyweds dancing beneath the arches of the Main Colonnade in Mariánské Lázně
- **ru:** Молодожёны танцуют под сводами Главной колоннады в Марианских Лазнях
- credit:

### `main-colonnade-couple-arcade.jpg` — 1067×1600, portrait
Pár v ose arkády, malovaný strop kolonády nad nimi, dlouhý závoj.
- **cs:** Svatební pár v arkádě Hlavní kolonády s malovaným stropem
- **de:** Hochzeitspaar in der Arkade der Hauptkolonnade mit bemalter Decke
- **en:** Wedding couple in the Main Colonnade arcade with its painted ceiling
- **ru:** Свадебная пара в аркаде Главной колоннады с расписным потолком
- credit:

### `main-colonnade-arcade-wide.jpg` — 1067×1600, portrait
Perspektiva celé arkády, pár uprostřed, vlečka na dlažbě. Dobré pro „místa" sekci.
- **cs:** Pohled do arkády Hlavní kolonády se svatebním párem uprostřed
- **de:** Blick in die Arkade der Hauptkolonnade mit dem Brautpaar in der Mitte
- **en:** View down the Main Colonnade arcade with the wedding couple at its centre
- **ru:** Вид вдоль аркады Главной колоннады со свадебной парой в центре
- credit:

### `main-colonnade-fresco-steps.jpg` — 1067×1600, portrait
Pár na schodech před nástropní freskou na konci kolonády, mezi litinovými sloupy
s vitrážemi. **Doporučeno na závěrečný CTA blok.**
- **cs:** Novomanželé na schodech pod freskou na konci Hlavní kolonády
- **de:** Brautpaar auf den Stufen unter dem Fresko am Ende der Hauptkolonnade
- **en:** Newlyweds on the steps beneath the fresco at the end of the Main Colonnade
- **ru:** Молодожёны на ступенях под фреской в конце Главной колоннады
- credit:

### `main-colonnade-fresco-portrait.jpg` — 1067×1600, portrait
Portrét páru na pozadí tmavé fresky. Nejtmavší snímek sady — používat jako detail,
ne jako pozadí pod bílý text.
- **cs:** Portrét svatebního páru před freskou Hlavní kolonády
- **de:** Porträt des Brautpaars vor dem Fresko der Hauptkolonnade
- **en:** Portrait of the wedding couple in front of the Main Colonnade fresco
- **ru:** Портрет свадебной пары на фоне фрески Главной колоннады
- credit:

---

## Skupina 2 — Pavilon Křížového pramene a okolí (5×)

> Ověř popisky s místopisem, než půjdou ven — pavilon s měděnou kupolí a bílými
> kolonádními křídly je v manifestu vedený jako **Pavilon Křížového pramene**
> (stejně jako stávající `library/colonnade/cross-spring-pavilion-*`).

### `cross-spring-pavilion-couple-walking.jpg` — 1067×1600, portrait
Pár jde za ruce po trávníku, za nimi pavilon s kupolí a les. Nejlepší „lokace" záběr.
- **cs:** Svatební pár před pavilonem Křížového pramene v lázeňském parku
- **de:** Hochzeitspaar vor dem Pavillon der Kreuzquelle im Kurpark
- **en:** Wedding couple in front of the Cross Spring pavilion in the spa park
- **ru:** Свадебная пара перед павильоном Крестового источника в курортном парке
- credit:

### `cross-spring-pavilion-couple.jpg` — 1067×1600, portrait
Pár v objetí, bílá kolonáda na pozadí, dlouhá vlečka.
- **cs:** Nevěsta a ženich u bílé kolonády Křížového pramene
- **de:** Braut und Bräutigam an der weißen Kolonnade der Kreuzquelle
- **en:** Bride and groom by the white Cross Spring colonnade
- **ru:** Невеста и жених у белой колоннады Крестового источника
- credit:

### `cross-spring-pavilion-bouquet.jpg` — 1067×1600, portrait
Pár se svatební kyticí před sloupovím. **Doporučeno k sekci Zpívající fontána.**
- **cs:** Svatební pár se svatební kyticí před sloupovím kolonády
- **de:** Hochzeitspaar mit Brautstrauß vor der Säulenreihe der Kolonnade
- **en:** Wedding couple with the bridal bouquet before the colonnade columns
- **ru:** Свадебная пара со свадебным букетом у колоннады
- credit:

### `cross-spring-colonnade-columns.jpg` — 1067×1600, portrait
Detailnější portrét mezi bílými sloupy, měkké denní světlo.
- **cs:** Novomanželé mezi bílými sloupy lázeňské kolonády
- **de:** Brautpaar zwischen den weißen Säulen der Kurkolonnade
- **en:** Newlyweds among the white columns of the spa colonnade
- **ru:** Молодожёны среди белых колонн курортной колоннады
- credit:

### `cross-spring-colonnade-veil.jpg` — 1067×1600, portrait
Vlající dlouhý závoj, bílé sloupy. Vzdušný snímek, dobrý pod text.
- **cs:** Nevěsta s dlouhým závojem u kolonády v Mariánských Lázních
- **de:** Braut mit langem Schleier an der Kolonnade in Marienbad
- **en:** Bride with a long veil at the colonnade in Mariánské Lázně
- **ru:** Невеста с длинной фатой у колоннады в Марианских Лазнях
- credit:

---

## Skupina 3 — Společenský dům Casino / hostina (5×)

### `casino-marble-hall-banquet.jpg` — 1600×1067, **landscape**
Mramorový sál nachystaný na banket, křišťálové lustry, vysoké květinové aranže.
**Jediný široký záběr sálu — nenahraditelný pro hero nebo full-bleed pás.**
- **cs:** Mramorový sál Společenského domu připravený na svatební hostinu
- **de:** Der Marmorsaal des Gesellschaftshauses, eingedeckt für das Hochzeitsbankett
- **en:** The Marble Hall of the Casino social house set for a wedding banquet
- **ru:** Мраморный зал Общественного дома, накрытый для свадебного банкета
- credit:

### `casino-marble-hall-tables.jpg` — 1067×1600, portrait
Kulaté stoly, potahy židlí se zlatými mašlemi, parketová podlaha, freskový strop.
- **cs:** Svatební tabule v historickém sále s freskovým stropem
- **de:** Hochzeitstafel im historischen Saal mit Freskendecke
- **en:** Wedding tables in the historic hall with its frescoed ceiling
- **ru:** Свадебные столы в историческом зале с расписным потолком
- credit:

### `casino-hall-floral-centrepiece.jpg` — 1067×1600, portrait
Vysoká květinová dekorace nad prostřenou tabulí.
- **cs:** Vysoká květinová dekorace na svatební tabuli v historickém sále
- **de:** Hohe Blumendekoration auf der Hochzeitstafel im historischen Saal
- **en:** Tall floral centrepiece on the wedding table in the historic hall
- **ru:** Высокая цветочная композиция на свадебном столе в историческом зале
- credit:

### `banquet-place-setting-detail.jpg` — 1067×1600, portrait
Detail: složený ubrousek, jmenovka, sklo, příbory.
- **cs:** Detail prostírání se jmenovkou na svatební tabuli
- **de:** Detail des Gedecks mit Namenskarte auf der Hochzeitstafel
- **en:** Close-up of a place setting with name card at the wedding table
- **ru:** Деталь сервировки с именной карточкой на свадебном столе
- credit:

### `banquet-chair-gold-sash.jpg` — 1067×1600, portrait
Detail potahu židle se zlatou saténovou mašlí, parkety, rozostřený sál.
- **cs:** Detail potahu židle se zlatou mašlí ve svatebním sále
- **de:** Detail einer Stuhlhusse mit goldener Schleife im Hochzeitssaal
- **en:** Chair cover with a gold sash in the wedding hall
- **ru:** Чехол на стул с золотым бантом в свадебном зале
- credit:

---

## Skupina 4 — Detaily a portréty (2×)

### `couple-portrait-bouquet.jpg` — 1067×1600, portrait
Blízký portrét páru s kyticí z bílých růží a eukalyptu.
- **cs:** Portrét novomanželů se svatební kyticí z bílých růží
- **de:** Porträt des Brautpaars mit einem Strauß weißer Rosen
- **en:** Portrait of the newlyweds with a bouquet of white roses
- **ru:** Портрет молодожёнов с букетом белых роз
- credit:

### `floral-arch-toast.jpg` — 1067×1600, portrait
Pár s přípitkem pod bohatým květinovým obloukem, zlaté zrcadlo v pozadí.
**Doporučeno na zadní CTA / „přípitek".**
- **cs:** Novomanželé s přípitkem pod květinovým obloukem
- **de:** Brautpaar stößt unter einem Blumenbogen an
- **en:** Newlyweds raising a toast beneath a floral arch
- **ru:** Молодожёны поднимают бокалы под цветочной аркой
- credit:

---

## Skupina 5 — Obřad pod širým nebem (3×) — jiný pár, jiná lokace

### `outdoor-ceremony-first-kiss.jpg` — 1600×1067, **landscape**
První polibek při obřadu venku, svatebčané kolem, podzimní les.
- **cs:** První polibek novomanželů při obřadu pod širým nebem
- **de:** Der erste Kuss des Brautpaars bei der Trauung im Freien
- **en:** The couple's first kiss at an outdoor ceremony
- **ru:** Первый поцелуй молодожёнов на церемонии под открытым небом
- credit:

### `garden-pavilion-couple.jpg` — 1600×1067, **landscape**
Pár v dřevěném altánu, zeleň kolem.
- **cs:** Svatební pár v zahradním altánu
- **de:** Hochzeitspaar im Gartenpavillon
- **en:** Wedding couple in a garden pavilion
- **ru:** Свадебная пара в садовой беседке
- credit:

### `wedding-rings-detail.jpg` — 1600×1067, **landscape**
Detail rukou s právě nasazenými snubními prsteny, krajka rukávu.
- **cs:** Detail rukou novomanželů se snubními prsteny
- **de:** Detail der Hände des Brautpaars mit den Eheringen
- **en:** Close-up of the newlyweds' hands with their wedding rings
- **ru:** Крупный план рук молодожёнов с обручальными кольцами
- credit:

---

## Rychlá tabulka

| Soubor | Rozměr | Orientace | Primární použití |
|---|---|---|---|
| `main-colonnade-couple-dancing` | 1067×1600 | portrait | Hero (split) |
| `main-colonnade-couple-arcade` | 1067×1600 | portrait | Místa — Hlavní kolonáda |
| `main-colonnade-arcade-wide` | 1067×1600 | portrait | Místa — Hlavní kolonáda |
| `main-colonnade-fresco-steps` | 1067×1600 | portrait | Závěrečné CTA |
| `main-colonnade-fresco-portrait` | 1067×1600 | portrait | Galerie detailů |
| `cross-spring-pavilion-couple-walking` | 1067×1600 | portrait | Místa — pavilon |
| `cross-spring-pavilion-couple` | 1067×1600 | portrait | Článek |
| `cross-spring-pavilion-bouquet` | 1067×1600 | portrait | Zpívající fontána |
| `cross-spring-colonnade-columns` | 1067×1600 | portrait | Článek |
| `cross-spring-colonnade-veil` | 1067×1600 | portrait | Článek / vzdušný blok |
| `casino-marble-hall-banquet` | 1600×1067 | **landscape** | Full-bleed pás / OG image |
| `casino-marble-hall-tables` | 1067×1600 | portrait | Místa — Casino |
| `casino-hall-floral-centrepiece` | 1067×1600 | portrait | Galerie detailů |
| `banquet-place-setting-detail` | 1067×1600 | portrait | Galerie detailů |
| `banquet-chair-gold-sash` | 1067×1600 | portrait | Timeline — den D |
| `couple-portrait-bouquet` | 1067×1600 | portrait | Timeline — ráno po |
| `floral-arch-toast` | 1067×1600 | portrait | Timeline / přípitek |
| `outdoor-ceremony-first-kiss` | 1600×1067 | **landscape** | Obřad pod širým nebem |
| `garden-pavilion-couple` | 1600×1067 | **landscape** | Obřad pod širým nebem |
| `wedding-rings-detail` | 1600×1067 | **landscape** | Galerie detailů |

**Pozor na orientaci:** 16 z 20 fotek je na výšku. Full-bleed hero přes celou šířku
(`min-h-[75vh]`, `object-cover`) z nich udělá úzký výřez a na 1920 px je bude
natahovat. Proto je v zadání hero navržený jako **split** (foto na výšku vpravo,
text vlevo) — a kde je potřeba široký záběr, sáhni po `casino-marble-hall-banquet`
nebo po stávajících `library/colonnade/*`.
