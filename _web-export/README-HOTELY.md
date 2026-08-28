# Hotelové podstránky pro marienbad.com — balík k nahrání do repa

Vygenerováno 28. 8. 2026 ze složky `MARIENBAD_MARKETING` (fotoarchiv + pasporty 2026).

Obsahuje dvě věci:

1. **Fotobanku** — 450 hotelových fotek + 122 fotek Mariánských Lázní, převedených do WebP.
2. **Kód** — hotelové podstránky `/{jazyk}/hotel/{slug}` v duchu resortceskyles.cz,
   s velkou galerií v booking stylu. Rezervace vede **výhradně** na
   `bookings.ensanahotels.com` (Exely, přes stávající `exelyBookingUrl`).

Otestováno proti aktuálnímu `main`: `pnpm build` projde, `pnpm test` 240/240 zelených.

---

## 1. Co je ve složce

```
_web-export/
├─ README-HOTELY.md                      ← tenhle soubor
├─ public/images/hotels/<slug>/<kategorie>/<foto>-{1600,800,400}.webp
├─ public/images/library/marianske-lazne/<kategorie>/<foto>-{1600,800}.webp
├─ src/data/hotel-photos.json            ← manifest hotelových fotek (generovaný)
├─ src/data/town-photos.json             ← manifest fotek města (generovaný)
├─ src/data/hotelDetails.ts              ← fakta z pasportů 2026
├─ src/data/hotelUi.ts                   ← všechny lokalizované popisky (cs/de/en/ru)
├─ src/lib/hotelPhotos.ts                ← přístup k hotelové fotobance
├─ src/lib/townPhotos.ts                 ← přístup k fotobance města
├─ src/components/HotelDetail.astro      ← celá hotelová podstránka
├─ src/components/HotelGallery.astro     ← mozaika + lightbox s filtrem kategorií
├─ src/components/HotelTiles.astro       ← UPRAVENO (dlaždice vedou na detail)
├─ src/pages/{de,en,cs,ru}/hotel/[slug].astro  ← PŘEPSÁNO
├─ _sheets/                              ← kontaktní archy, podle kterých se vybíraly fotky města
└─ _scripts/                             ← skripty, kterými se fotky převáděly
```

**Velikost:** hotelové fotky 92 MB, fotky města 43 MB. Dohromady ~135 MB —
počítej s tím, že repo o tolik naroste (fotky jsou v `public/`, Vercel je servíruje staticky).

### Fotobanka hotelů

| hotel | fotek |
|---|---|
| Nové Lázně, Centrální Lázně, Hvězda, Pacifik, Butterfly, Vltava, Svoboda | 60 každý |
| Maria Spa | 30 (zatím bez vlastní podstránky — není v `hotels.ts`) |

Kategorie: `highlights`, `exterior`, `rooms`, `interior`, `dining`, `pool`, `spa`, `mice`, `other`
(mapované ze složek archivu: Best of / Exterior / Rooms / Interior / Restaurant(s) /
Swimming pool / Treatments / MICE / Others).

Výběr: z každé kategorie se bere po jedné dokola v pořadí důležitosti, dokud není 60 fotek.
Vyřazeny fotky pod 900 × 600 px a duplicity (perceptuální hash, Hammingova vzdálenost ≤ 4).
K Novým Lázním jsou přibalené i fotky ze složky `RomanBaths`, k ostatním hotelům složka
`LazneML - fotky`.

Každá fotka existuje ve třech šířkách: **1600** (galerie, lightbox, hero), **800** (dlaždice),
**400** (náhledy). Jen WebP, bez JPG fallbacku — proto se nepoužívá komponenta `<Pic>`,
ale přímo `<img srcset>`; `pnpm images` tyhle soubory ignoruje a nemusí se pouštět.

### Fotobanka města

122 fotek z 248 ve složce „09 Marianske Lazne", vybíraných po jedné z kontaktních archů
(`_sheets/sheet-00..09.jpg`, čísla v rozích odpovídají pořadí souborů).
Vynechány duplicity, tmavé noční nedotažené snímky, zastaralé stock záběry a fotka s vodoznakem.

Kategorie (`colonnade`, `fountain`, `springs`, `nature`, `sport`, `town`) se odvozují z názvů
souborů — u fotek pojmenovaných `IMG_xxxx` padne všechno do `town`, i když jde třeba o park.
V `town-photos.json` je u každé fotky `source` s původním souborem, takže se dá dohledat.
Sezóna (`winter` / `christmas`) se také bere z názvu.

---

## 2. Jak to nahrát do repa

```bash
cd cesta/k/marienbad

# 1) fotky
cp -R "<tato slozka>/public/images/hotels/."   public/images/hotels/
cp -R "<tato slozka>/public/images/library/."  public/images/library/

# 2) data + kód
cp -R "<tato slozka>/src/." src/

# 3) kontrola
pnpm build && pnpm test

git add public/images/hotels public/images/library src
git commit -m "feat(hotels): hotel detail pages with full photo galleries"
```

`pnpm images` **není potřeba** — WebP varianty jsou hotové a nejdou přes `webp-manifest.json`.

---

## 3. Co se změnilo v kódu

**Nové podstránky `/{jazyk}/hotel/{slug}`** (dosud jen strohý text v `PillarPage`):

1. celoplošný hero s fotkou, hvězdičkami, taglinem a CTA na rezervaci,
2. lepivá navigace po sekcích,
3. přehled + boční karta s fakty (pokoje, lůžka, rok, sloh, check-in, adresa, kontakt),
4. **galerie v booking stylu** — mozaika 1 + 4 fotky, tlačítko „Zobrazit všech N fotek",
   celoobrazovkový lightbox s filtrem podle kategorií, náhledovým pruhem, klávesami ← → Esc,
5. pokoje a apartmá — pruh fotek + karty kategorií s výměrou a vybavením,
6. wellness a bazén, léčba a procedury (pramen, počet kabin, indikace, seznam procedur),
7. gastronomie, konference, praktické informace (parkování, mazlíčci, Wi-Fi, lázeňský poplatek),
8. rezervační blok a přehled ostatních hotelů.

Fotky ve všech sekcích jsou proklikávací do lightboxu.

**`HotelTiles.astro`** (sekce Ubytování): dlaždice nově vedou na detail hotelu, žlutá
„Zjistit dostupnost" zůstává jako samostatný odkaz do rezervačního systému. Mozaika dlaždic
bere fotky z nové fotobanky (dříve 5 fotek z Keystatic galerie; ta zůstává jako fallback).

**Schema.org**: `LodgingBusiness` je doplněné o `image` (8 fotek), `numberOfRooms`,
`checkinTime`/`checkoutTime`, `email`, `telephone`. OG obrázek stránky = hero fotka hotelu.

---

## 4. Odkud jsou fakta

`src/data/hotelDetails.ts` vychází z **EN pasportů 2026** (`MARIENBAD_MARKETING/passport`),
Vltava z `EN Passport VLT 01_2026.docx`. Data jsou schválně jazykově neutrální (čísla, vlastní
jména, enum klíče), překlady jsou všechny v `hotelUi.ts` — když se změní pasport, mění se
jenom čísla, ne texty.

Na co jsem narazil a co je potřeba potvrdit:

- **Butterfly — pramen.** Pasport uvádí v USP „Ferdinand Spring", ale v Medical department
  „Forest Spring". V datech je `spring: 'ferdinand'`; sjednotit s pasportem, letákem
  i webem ensanahotels.com.
- **Maria Spa** nemá v `hotels.ts` vlastní záznam, takže nemá ani podstránku — 30 fotek
  je připravených v `public/images/hotels/maria-spa/`. Pokojové kategorie Maria Spa jsou
  zatím vedené pod Centrálními lázněmi (jak to má pasport).
- **Hvězda** — počty pokojů po kategoriích jsem u Imperialu a Skalníku sloučil
  (`DBL Superior Plus` 12 + 16 atd.), ať tabulka není nečitelná.
- Telefony a e-maily jsou z pasportů; Vltava e-mail ani telefon v pasportu nemá,
  takže je bez kontaktu.
- Ceny parkování a lázeňský poplatek jsou stav 2026 — při aktualizaci pasportu upravit
  v `hotelDetails.ts`.

---

## 5. Když bude potřeba fotky předělat

Skripty jsou v `_scripts/` (běžely na tvém stroji, Python + Pillow):

- `plan.py` / `plan_one.py` — projde archiv, vybere fotky (limit na hotel, dedup) → `plan.json`
- `conv.py` — z `plan.json` vyrobí WebP varianty (běží po dávkách, dá se pouštět opakovaně)
- `sheets.py` — vyrobí kontaktní archy pro ruční výběr
- `town.py` — převede vybrané fotky města podle seznamu indexů `PICKS`

Limit 60 fotek na hotel je konstanta `CAP` v `plan.py`, šířky a kvalita `SIZES` v `conv.py`.
Když přibudou nové fotky z chystaného focení, stačí je hodit do archivu a pustit
`plan_one.py` + `conv.py` znovu — hotové soubory se přeskakují.

---

## 6. Co ještě zbývá

- Projít popisky fotek: `alt` texty jsou teď generické („Ensana Butterfly — Pokoje").
  Pro SEO by stálo za to je u hero fotek a top 10 fotek každého hotelu napsat ručně
  (do `hotel-photos.json` by se přidalo pole `alt` po jazycích).
- Fotky u restaurací se přiřazují podle pořadí, ne podle konkrétního podniku —
  vizuálně to sedí, ale záměrně tam není tvrzení, že daná fotka je právě ta restaurace.
- Fotobanka města zatím nikde na webu není použitá, čeká připravená v repu.
