# Zadání — svatební sekce marienbad.com

Cíl: **nejlepší svatební upoutávka na lokaci, jaká na český lázeňský web existuje.**
Ne „stránka o svatbách", ale vizuální argument, po kterém si pár řekne *tady*.

Dvě věci k vyrobení:

- **A — evergreen landing page** `/{locale}/…` ve 4 jazycích (de/en/cs/ru)
- **B — magazínový článek**, fotoesej, ve 4 jazycích

Plus **20 nových fotek** už připravených v `public/images/library/wedding/`
(popis, alt texty a varování v [`IMAGE-MANIFEST.md`](./IMAGE-MANIFEST.md)).

---

## 0. Co na webu už je a jak se to má propojit

Svatby na webu nejsou zelená louka — existují **čtyři články**, po jednom na jazyk:

| Složka | Locale | Slug v URL |
|---|---|---|
| `cs-svatba-v-laznich` | cs | `/cs/magazin/svatba-v-laznich` |
| `de-hochzeit-in-marienbad` | de | `/de/magazin/hochzeit-in-marienbad` |
| `en-wedding-in-marienbad` | en | `/en/magazine/wedding-in-marienbad` |
| `ru-svadba-v-marianskikh-laznyakh` | ru | `/ru/zhurnal/svadba-v-marianskikh-laznyakh` |

Všechny jsou `category: planning`, `articleType: guide`, 9 min, z 25. 3. 2026, a všechny
sdílejí `coverImage: /images/content/articles/cs-svatba-v-laznich/coverImage.jpg`.

**Rozdělení rolí, ať si to nekanibalizuje:**

- stávající čtyři články = **„jak to naplánovat"** (postup, kapacity, harmonogram) — zůstávají, jen dostanou odkaz na landing page a nový cover
- nová landing page = **„proč zrovna tady"** (konverzní, vizuální, evergreen, cíl = poptávka)
- nový článek = **„jak to tady vypadá"** (fotoesej po místech, cíl = long-tail SEO + zásoba fotek)

**Další existující obsah, na který se dá navázat:**

| Co | Kde | Jak využít |
|---|---|---|
| Zpívající fontána | `cs-zpivajici-fontana`, `ru-poyushchij-fontan` | odkaz ze sekce „Zpívající fontána na přání"; **chybí EN a DE** — doplnit |
| Historie kolonády | `cs-historie-kolonady`, `en-history-of-the-colonnade` | odkaz ze sekce „Hlavní kolonáda" |
| Jaro / kolonáda | `cs-jaro-…`, `en-spring-…` | odkaz ze sekce „Nejlepší roční období" |
| Pilíř Kolonáda | `routes.culture` sousedství, `/{locale}/kolonada` | breadcrumb rodič, vzájemný odkaz |
| Ubytování | `routes.accommodation` | „kde budou spát hosté" |
| Výlety (74 cílů) | `routes['day-trips']` | „co s hosty den před / den po" |
| Nejlepší čas návštěvy | `/{locale}/beste-reisezeit` ap. | sezónnost obřadu |
| UNESCO | `/{locale}/unesco` | argument prestiže lokace |

---

## A. Landing page

### A.1 Routing

Stránka je **evergreen, ne kampaň** → na rozdíl od `5-jahre-welterbe` / `aktiver-september`
ji přidej do `routes` v `src/i18n/config.ts`, aby se na ni dalo odkazovat přes
`localizedHref(locale, 'weddings')` a nemusel se slug map duplikovat v každém route souboru:

```ts
weddings: { de: 'hochzeit', en: 'weddings', cs: 'svatba', ru: 'svadba' },
```

Slugy schválně **krátké a jiné než u článků** (`hochzeit-in-marienbad` je článek,
`hochzeit` je landing) — nekanibalizuje se to a v SERPu je jasná hierarchie.

**Soubory k vytvoření:**

```
src/i18n/config.ts                      … + klíč `weddings` do routes
src/data/weddingsContent.ts             … Record<Locale, WeddingsContent> — všechny texty
src/components/WeddingsPage.astro       … Props: { locale: Locale }
src/pages/de/hochzeit.astro
src/pages/en/weddings.astro
src/pages/cs/svatba.astro
src/pages/ru/svadba.astro
```

Texty **do `src/data/weddingsContent.ts`**, ne inline do komponenty — vzorem je
`EnsanaLifePage.astro` + `src/data/ensanaLifeContent.ts`. Objem copy ve 4 jazycích
by z komponenty udělal 800řádkové monstrum (viz `ActiveSeptemberPage.astro`).

Route soubory podle vzoru `src/pages/de/5-jahre-welterbe.astro`:
`export const prerender = true`, `section="culture"`, plný `alternateUrls` map všech
čtyř locales, `ogImage="/images/library/wedding/casino-marble-hall-banquet.jpg"`
(jediná široká fotka sady — sedí na 1200×630).

**Nepřidávej** slug do `NOINDEXED_PATHS` v `astro.config.mjs` — tam patří jen časově
omezené výprodeje. Evergreen stránka na úrovni `/{locale}/{slug}` dostane od
sitemap serializeru `priority: 0.9, changefreq: 'weekly'`, což je přesně, co chceme.

### A.2 Struktura stránky

Pořadí je zvolené jako dramaturgie: **emoce → důkaz → místa → provoz → námitky → akce.**

---

**1. Hero — split, ne full-bleed**

Foto `main-colonnade-couple-dancing.jpg` (na výšku) vpravo přes celou výšku
sekce, vlevo béžový panel s textem. **Záměrně jiné než ostatní kampaňové stránky**,
které mají všechny stejný full-bleed hero s gradientem — a hlavně: 16 z 20 fotek je
na výšku, full-bleed by z nich udělal úzký proužek a natahoval je (viz manifest).

Obsah panelu: eyebrow pill („Svatba v Mariánských Lázních"), `h1`, jednověté lead,
dvě CTA — primární **„Nezávazně poptat termín"** (kotva na formulář / kontakt),
sekundární ghost **„Prohlédnout místa"** (kotva `#mista`).

`loading="eager"` + `fetchpriority="high"` na hero `<Pic>`.

**H1 návrhy** (sentence case dle CLAUDE.md, ne Title Case):

- cs: `Svatba v Mariánských Lázních`
- de: `Hochzeit in Marienbad`
- en: `Your wedding in Mariánské Lázně`
- ru: `Свадьба в Марианских Лазнях`

**Lead — tón „evocative" dle CLAUDE.md, žádné superlativy:**

- cs: *Litinová kolonáda, zpívající fontána, sály pod křišťálovými lustry a sedm hotelů v docházkové vzdálenosti. Celý váš den se odehraje na ploše, kterou přejdete pěšky za deset minut.*
- de: *Gusseiserne Kolonnade, singende Fontäne, Säle unter Kristalllüstern und sieben Hotels in Gehweite. Ihr ganzer Tag spielt sich auf einer Fläche ab, die Sie in zehn Minuten zu Fuß durchqueren.*
- en: *A cast-iron colonnade, a singing fountain, halls under crystal chandeliers, and seven hotels within walking distance. Your whole day happens in an area you can cross on foot in ten minutes.*
- ru: *Чугунная колоннада, поющий фонтан, залы под хрустальными люстрами и семь отелей в пешей доступности. Весь ваш день уместится на площади, которую можно пройти за десять минут.*

---

**2. Fakta v pásu — 4 čísla**

Idiom `FiveYearsWorldHeritage.astro` §2 (`grid grid-cols-2 lg:grid-cols-4 divide-x`,
bílé pozadí, `border-b border-beige-200`). Statická čísla, žádná animace.

| Číslo | Popisek | Poznámka pod |
|---|---|---|
| 120 m | litinové kolonády | z roku 1889 |
| 6 | historických sálů | Společenský dům Casino |
| 50–450 | hostů | podle sálu a uspořádání |
| 10 min | pěšky | obřad → hostina → postel |

⚠️ Čísla **ověřit** — viz §D, kapacity si dnes v různých materiálech odporují.

---

**3. `#mista` — Kde si řeknete ano**

Jádro stránky. Pět míst, každé jako **text + foto split** (idiom `FiveYearsWorldHeritage` §3,
`grid lg:grid-cols-[1fr_0.9fr]`), střídavě foto vlevo / vpravo. U každého:
název, jedna atmosférická věta, kapacita, vevnitř/venku, nejlepší sezóna, odkaz dál.

| # | Místo | Foto | Odkaz |
|---|---|---|---|
| 1 | Hlavní kolonáda | `main-colonnade-arcade-wide` | článek Historie kolonády |
| 2 | Zpívající fontána | `cross-spring-pavilion-bouquet` | článek Zpívající fontána |
| 3 | Pavilon Křížového pramene a lázeňský park | `cross-spring-pavilion-couple-walking` | pilíř Příroda |
| 4 | Společenský dům Casino — Mramorový sál | `casino-marble-hall-tables` | tabulka sálů níž |
| 5 | Obřad pod širým nebem | `outdoor-ceremony-first-kiss` | pilíř Co dělat |

Mezi 4 a 5 vlož **full-bleed pás** s `casino-marble-hall-banquet.jpg` (jediná
široká fotka sady) — vizuální nádech uprostřed dlouhé sekce.

---

**4. Tabulka sálů**

Šest řádků, sloupce Sál / Banket / Recepce / Charakter. Data z aktuálního
svatebního katalogu Ensana (Mramorový 300/450, Zrcadlový 100/180, Červený 130/180,
Růžový + Galerie 140/190, Edwardova knihovna 50/50).

Na mobilu **nedělat vodorovný scroll** — překlopit na karty (`md:table`, pod tím
`grid` karet), jinak to na telefonu nikdo nepřečte a svatební traffic je z 70 % mobil.

---

**5. Den ve třech aktech**

Idiom „3 karty na indigu" z `FiveYearsWorldHeritage` §4 (`section bg-indigo-700`,
radiální gradient, `grid md:grid-cols-3`, prostřední karta `highlight` = žlutá).

| Akt | Obsah | Foto |
|---|---|---|
| Předvečer | příjezd hostů, wellness pro nevěstu a družičky, společná večeře | `banquet-chair-gold-sash` |
| Den D | obřad → vyjížďka kočárem → přípitek → hostina → první tanec | `floral-arch-toast` *(highlight)* |
| Ráno po | snídaně, procházka ke kolonádě, lázeňské líbánky | `couple-portrait-bouquet` |

---

**6. Dva tahy, které jinde nedostanete**

Dva feature boxy vedle sebe na indigu — **tohle je ta „upoutávka", diferenciátor.**
Ne odrážky mezi ostatními službami, ale vlastní blok:

- **Zpívající fontána na přání** — kruhová fontána hraje každou lichou hodinu; lze domluvit mimořádnou skladbu na míru ve zvolený čas, večer nasvícenou. Odkaz na článek o fontáně.
- **Vyjížďka kočárem** — historický kočár od obřadu k hostině lázeňským parkem kolem pramenů a kolonády.

⚠️ Obojí **ověřit u provozovatele** (§D) — než to slíbíme na indexované stránce.

---

**7. Galerie detailů**

Vodorovný scroll track (idiom `article-gallery-scroll` z `MarkdocRenderer`, nebo
`grid grid-cols-2 md:grid-cols-4 gap-4` jako `ActiveSeptemberPage` §4):
`banquet-place-setting-detail`, `wedding-rings-detail`, `casino-hall-floral-centrepiece`,
`main-colonnade-fresco-portrait`.

---

**8. Pro hosty**

Dvousloupec (idiom §5 `FiveYearsWorldHeritage`): vlevo tyrkysové odrážky (ubytování
v sedmi hotelech, wellness, program mezi obřadem a hostinou, parkování, bezbariérovost),
vpravo link card se dvěma `btn-ghost` odkazy na **Ubytování** a **74 výletů**.
Odkazy přes `` `/${locale}/${routes.accommodation[locale]}` ``, ne natvrdo.

---

**9. Kdy**

Krátký odstavec o sezónnosti (květen–červen a září: kvetoucí park / barvy;
zima: sály a lustry) + odkaz na *Nejlepší čas návštěvy*.
Foto `cross-spring-colonnade-veil` — vzdušné, dobře snese text vedle sebe.

---

**10. FAQ**

Osm otázek, ručně `<details class="group">` podle `src/pages/en/faq.astro:33`
(accordion komponenta v repu není) **+ ručně vypsané `FAQPage` JSON-LD** — `FaqSchema.astro`
čte `rawBody` z Markdocu a na `.astro` stránce ho nemá odkud vzít.

Otázky: Jak dlouho dopředu rezervovat? · Kolik hostů se vejde? · Jde obřad na
kolonádě? · Kdo vyřídí matriku? · Můžeme mít civilní i církevní obřad? · Co když
prší? · Ubytujeme hosty na jednom místě? · Dá se domluvit Zpívající fontána?

FAQ je zároveň **nejlepší long-tail SEO plocha celé stránky** — psát celé věty, ne hesla.

---

**11. Závěrečné CTA přes fotku**

Idiom §6 `FiveYearsWorldHeritage` (`bg-aubergine-900`, `<Pic alt="">` na pozadí,
gradient `from-aubergine-950/95 …`). Foto `main-colonnade-fresco-steps`.
Nadpis „Řekněte nám o svém dni", jeden odstavec, jedno primární CTA na kontakt
+ `relatedEnsanaLink` s UTM (`utm_source=marienbad&utm_medium=landing&utm_campaign=wedding`).

---

**12. Související čtení**

Tři karty: příslušný jazykový svatební článek, Historie kolonády, Zpívající fontána.
Kde jazyková mutace chybí (EN/DE fontána), degradovat na existující — **ne** odkazovat
do jiného jazyka.

### A.3 SEO

`Base.astro` řeší hreflang, canonical, OG a site-wide JSON-LD. Stránka si sama doplní:

- `<Breadcrumbs>` (emituje `BreadcrumbList`) — rodič *Kultura* nebo *Co dělat*
- ruční `<script type="application/ld+json">` se `Service` (nebo `Offer`) + `FAQPage`
- `title` do 60 znaků, `description` do 155

**Primární klíčová slova** (navazují na už zavedená z článků):

| Locale | Primární | Sekundární |
|---|---|---|
| cs | svatba Mariánské Lázně | svatba na kolonádě, svatba v lázních, svatební hostina Mariánské Lázně |
| de | Hochzeit Marienbad | heiraten im Kurort, Trauung Kolonnade, Hochzeitslocation Tschechien |
| en | wedding in Mariánské Lázně | spa town wedding, colonnade wedding venue, destination wedding Czech Republic |
| ru | свадьба Марианские Лазни | свадьба на колоннаде, свадебная церемония в курорте |

### A.4 Měření

GA4 (consent-gated) eventy na: klik primární CTA v heru, klik CTA v patě,
otevření FAQ položky, klik na Ensana odkaz s UTM, dosažení sekce `#mista`.
Bez toho se nedá říct, jestli „nejlepší upoutávka" funguje.

---

## B. Magazínový článek — fotoesej

**Proč nový článek, když čtyři existují:** ty čtyři jsou textové průvodce plánováním.
Tenhle je **vizuální procházka po místech** — jiný search intent („jak to tam vypadá",
„svatba kolonáda foto"), jiný formát, žádná kanibalizace. A hlavně: unese zbývající
fotky, které se na landing page nevešly.

### B.1 Frontmatter

Složky `src/content/articles/{locale}-{slug}/index.mdoc`:

| Locale | Složka | Titulek |
|---|---|---|
| cs | `cs-kudy-chodi-nevesty` | Kudy chodí nevěsty — fotoprůvodce svatebními místy Mariánských Lázní |
| de | `de-wo-brautpaare-gehen` | Wo Brautpaare gehen — ein Bildführer durch Marienbads Hochzeitsorte |
| en | `en-where-brides-walk` | Where brides walk — a photo guide to wedding locations in Mariánské Lázně |
| ru | `ru-gde-khodyat-nevesty` | Где ходят невесты — фотогид по свадебным местам Марианских Лазней |

```yaml
status: published
locale: cs
coverImage: /images/library/wedding/main-colonnade-couple-arcade.jpg
category: planning
articleType: guide
readingTime: 6 min
pullQuote: "Celý svatební den se tu vejde do deseti minut chůze."
relatedEnsanaLink: https://ensanahotels.com/cs/hotely/nove-lazne?utm_source=marienbad&utm_medium=article&utm_campaign=wedding-photo-guide
```

`date` nastav na den publikace, ne 25. 3. 2026 (to je datum staré čtveřice).

### B.2 Osnova, ~1200 slov

1. **Úvod** (~120 slov) — jedna scéna, ne shrnutí. Odkaz na landing page hned v prvním odstavci.
2. **Hlavní kolonáda** — `{% figure width="wide" %}` `main-colonnade-arcade-wide`, pak `{% gallery columns=2 %}` s `main-colonnade-couple-arcade` + `main-colonnade-couple-dancing`. Odkaz na Historie kolonády.
3. **Zpívající fontána** — `{% figure %}` `cross-spring-pavilion-bouquet`, `{% pullquote %}` o hraní každou lichou hodinu, odkaz na článek o fontáně.
4. **Pavilon Křížového pramene a park** — `{% gallery columns=3 %}`: `cross-spring-pavilion-couple-walking`, `cross-spring-pavilion-couple`, `cross-spring-colonnade-columns`. *(Tady se spotřebují dvě fotky, které landing page nepoužívá.)*
5. **Konec kolonády — freska** — `{% figure %}` `main-colonnade-fresco-steps`, druhá `main-colonnade-fresco-portrait`.
6. **Uvnitř: Mramorový sál** — `{% figure width="full" %}` `casino-marble-hall-banquet`, `{% gallery columns=3 %}` detaily.
7. **Venku a v zeleni** — `garden-pavilion-couple`, `outdoor-ceremony-first-kiss`, `wedding-rings-detail`. Popisky **nesmí** tvrdit, že jde o Mariánské Lázně (jiná lokace — viz manifest).
8. **`{% stat-counter columns=3 %}`** — 120 / 6 / 7, stejná čísla jako na landing page.
9. **Závěr + `{% book-cta %}`** a odkaz na landing page.

Používej `{% figure %}` s `caption` **a `credit`** — kredit fotografa je povinný, jakmile bude jméno.

### B.3 Lokalizace

Ne překlad, ale kulturní adaptace (stejně jako u ostatních článků):
DE zdůrazní tradici a Kur-kontext, EN destination wedding a dostupnost,
RU prestiž a UNESCO, CS praktičnost a dojezd.

---

## C. Co je potřeba dodělat mimo tyto dva kusy

- [ ] `pnpm images` po nakopírování sady (jinak `webp-manifest.json` sadu nezná)
- [ ] Nový `coverImage` pro stávající čtyři články — dnes sdílejí jeden soubor; nabízí se `main-colonnade-couple-dancing` (cs), `casino-marble-hall-banquet` (de), `cross-spring-pavilion-couple-walking` (en), `floral-arch-toast` (ru)
- [ ] Do všech čtyř článků odkaz na novou landing page
- [ ] Zpívající fontána **chybí v EN a DE** — doplnit, jinak z landing page vede odkaz do prázdna
- [ ] Odkaz na svatby do navigace (`getNavItems`) nebo aspoň do patičky a do pilíře Kultura
- [ ] `pnpm build` před commitem

---

## D. ⚠️ Ověřit před publikací

**Tohle nejsou detaily — jsou to sliby na indexované stránce.**

1. **Kapacity si odporují.** `de-hochzeit-in-marienbad` uvádí Casino „150+", Nové Lázně 80,
   Hvězda 60 a Hlavní kolonádu „bis zu 150 Gäste". Svatební katalog Ensana uvádí pro
   Společenský dům Mramorový sál 300 banket / 450 recepce. Buď jsou to jiné prostory,
   nebo je jedno z čísel staré. **Sjednotit napříč landing page, tabulkou i všemi čtyřmi články.**

2. **Kdo vlastně kolonádu a fontánu pronajímá.** Stránka bude tvrdit, že se tam dá mít
   obřad a že „umíme zajistit" mimořádnou skladbu Zpívající fontány. Ověřit u města /
   provozovatele, jestli to jde, za jakých podmínek a kdo to reálně objedná — a podle
   toho formulaci zmírnit nebo doplnit postup. Dokud to není potvrzené, psát
   „lze domluvit", ne „zajistíme".

3. **Souhlasy vyobrazených osob a licence fotografa** — viz manifest, sekce nahoře.

4. **Místopis fotek** — pavilon s měděnou kupolí je v pojmenování souborů vedený jako
   Pavilon Křížového pramene (konzistentně se stávající sadou `library/colonnade/`).
   Když to sedí, popisky projdou; když ne, přejmenovat soubory dřív, než se na ně
   začne odkazovat z kódu.

5. **Anglikánský kostel a kostel Nanebevzetí Panny Marie** — ověřit, že se v nich
   dnes skutečně oddává a za jakých podmínek, než je stránka vyjmenuje jako místa obřadu.
