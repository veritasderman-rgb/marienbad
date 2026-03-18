# MARIENBAD.COM — Kompletní plán práce pro Claude Code

**Stav k:** 18. 3. 2026
**Repo:** `veritasderman-rgb/marienbad` → branch `claude/marienbad-website-plan-V22c5`
**Stack:** Astro 5 + Tailwind 4 + Keystatic CMS + React 19 + Vercel (fra1)
**Deploy URL:** marienbad.vercel.app

## LEGENDA STAVŮ

- ✅ HOTOVO — implementováno, funguje
- ⚠️ ČÁSTEČNĚ — existuje základ, potřebuje dokončení/opravu
- ❌ CHYBÍ — dosud neimplementováno
- 🔧 OPRAVIT — existuje ale je broken/nesprávné

---

## FÁZE 0 — INFRASTRUKTURA & KONFIGURACE

### 0.1 Repo & deploy

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 0.1.1 | GitHub repo veritasderman-rgb/marienbad | ✅ | Existuje, 22 commitů |
| 0.1.2 | Vercel projekt napojený | ✅ | vercel.json nakonfigurován, region fra1 |
| 0.1.3 | Vlastní doména marienbad.com na Vercel | ❌ | Zatím jen marienbad.vercel.app — nutno přesměrovat DNS |
| 0.1.4 | SSL certifikát na produkční doméně | ❌ | Dříve hlášen SELF_SIGNED_CERT_IN_CHAIN problém |
| 0.1.5 | site v astro.config ukazuje na produkční URL | 🔧 | Ukazuje na marienbad.vercel.app, změnit na https://marienbad.com |
| 0.1.6 | Environment variables na Vercel | ⚠️ | Keystatic může potřebovat GitHub token pro API mode |

### 0.2 Stack & dependencies

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 0.2.1 | Astro 5 (App Router) | ✅ | astro@^5.9.0 |
| 0.2.2 | Tailwind CSS 4 | ✅ | tailwindcss@^4.1.0 via Vite plugin |
| 0.2.3 | TypeScript strict mode | ✅ | tsconfig.json extends astro/tsconfigs/strict |
| 0.2.4 | React 19 integration | ✅ | @astrojs/react@^5.0.0 |
| 0.2.5 | Keystatic CMS | ✅ | @keystatic/astro@^5.0.6, /admin route existuje |
| 0.2.6 | Sitemap generátor | ✅ | @astrojs/sitemap |
| 0.2.7 | MDX support | ✅ | @astrojs/mdx |
| 0.2.8 | Output mode server (SSR) | ✅ | Změněno z static → hybrid → server |
| 0.2.9 | Supabase napojení | ❌ | Dříve plánováno pro PoC submissions, newsletter — dosud nepřipojeno |
| 0.2.10 | Plausible/Umami analytics | ❌ | Žádný analytics nástroj nenasazen |
| 0.2.11 | CLAUDE.md branding brief v repo root | ❌ | Vytvořen separátně, přidat do repo |

### 0.3 i18n

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 0.3.1 | Astro i18n konfigurace (DE default) | ✅ | 4 locales: de, en, cs, ru; prefix na všech |
| 0.3.2 | UI překlady (src/i18n/ui.ts) | ✅ | ~9KB, všechny 4 jazyky |
| 0.3.3 | Helper funkce (config.ts, utils.ts) | ✅ | localizedHref(), t() atd. |
| 0.3.4 | hreflang tagy | ⚠️ | Zkontrolovat zda Base.astro generuje hreflang pro všechny varianty |
| 0.3.5 | Root / redirect na /de/ | ⚠️ | src/pages/index.astro existuje — ověřit funkčnost |

---

## FÁZE 1 — DESIGN SYSTEM & GLOBÁLNÍ KOMPONENTY

### 1.1 CSS / Design tokens

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 1.1.1 | Ensana barevná paleta (Tailwind 4 @theme) | ✅ | Kompletní: indigo, turquoise, yellow, aubergine, beige škály |
| 1.1.2 | CSS custom properties (semantic) | ✅ | --color-bg-primary, --color-link, --color-cta atd. |
| 1.1.3 | Typography (font-heading, font-body) | ✅ | Cormorant Garamond + DM Sans |
| 1.1.4 | Type scale (hero, h1-h4, body) | ✅ | Fluid clamp() hodnoty |
| 1.1.5 | Shadow tokens | ✅ | --shadow-card, --shadow-card-hover, --shadow-header |
| 1.1.6 | Button styles (.btn-primary, secondary, ghost) | ✅ | Pill CTA, rounded secondary, ghost |
| 1.1.7 | Card hover efekty | ✅ | .card-hover translateY + shadow |
| 1.1.8 | Scroll reveal animace | ✅ | .reveal + .visible |
| 1.1.9 | Ken Burns animace | ✅ | 15s infinite, na hero |
| 1.1.10 | prefers-reduced-motion | ✅ | Media query vypíná animace |
| 1.1.11 | Prose styly pro pillar pages | ✅ | .prose-marienbad h2-h4, p, a, blockquote, lists |
| 1.1.12 | Image placeholder systém | ✅ | .placeholder-image a .placeholder-image-light |
| 1.1.13 | Google Fonts loading | ⚠️ | Načítáno přes `<link>` — ideálně přejít na @fontsource |

### 1.2 Globální komponenty

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 1.2.1 | Header (sticky, language switcher, nav, CTA) | ✅ | Header.astro ~8.5KB |
| 1.2.2 | Footer (4-column, Ensana disclosure) | ✅ | Footer.astro ~6.5KB |
| 1.2.3 | Base layout (meta tags, OG, fonts) | ✅ | Base.astro ~3.5KB |
| 1.2.4 | HeroSection | ✅ | HeroSection.astro s badges |
| 1.2.5 | SectionCard | ✅ | SectionCard.astro s variants |
| 1.2.6 | WaveDivider | ✅ | WaveDivider.astro — 2 varianty |
| 1.2.7 | PillarPage template | ✅ | PillarPage.astro |
| 1.2.8 | CmsPillarPage (Keystatic-powered) | ✅ | CmsPillarPage.astro |
| 1.2.9 | MarkdocRenderer | ✅ | Pro CMS content rendering |
| 1.2.10 | Hotel Recommendation Box (inline component) | ❌ | Pro použití uvnitř článků |
| 1.2.11 | Treatment Highlight Box | ❌ | Indigo accent bar, icon, popis procedury |
| 1.2.12 | Booking CTA Bar (sticky mobile) | ❌ | Fixed bottom bar s "Jetzt buchen" |
| 1.2.13 | Breadcrumbs komponenta | ❌ | Pro SEO + navigaci na sub-stránkách |
| 1.2.14 | Image component (s lazy loading, LQIP) | ❌ | Wrapper kolem `<img>` s blur-up placeholderem |

---

## FÁZE 2 — HOMEPAGE (10 sekcí)

| # | Sekce | Stav | Poznámka |
|---|-------|------|----------|
| 2.1 | Hero (fullscreen, Ken Burns, badges) | ✅ | Gradient placeholder, badges z CMS |
| 2.2 | Quick Facts Strip (4 stat karty) | ✅ | 2×2 grid mobile, 4-col desktop |
| 2.3 | Four Healing Elements (indigo bg) | ✅ | Indigo-700 background, turquoise ikony |
| 2.4 | Discover the Town (3 pillar karty) | ✅ | SectionCard komponenty |
| 2.5 | Where to Stay (2 hotel karty) | ✅ | Star ratings, feature tags, booking links |
| 2.6 | People of Colonnade (dark bg) | ✅ | Portrait placeholders, pull quotes |
| 2.7 | Seasonal Highlight (2-col) | ✅ | Image + text layout |
| 2.8 | Magazine Preview (3 article karty) | ✅ | Category, title, excerpt, date |
| 2.9 | Email Capture (gradient bg, form) | ✅ | Form s client-side handler |
| 2.10 | Wave dividers mezi sekcemi | ✅ | 2× použito |

### 2.11 Homepage — co chybí/opravit

| # | Úkol | Stav |
|---|------|------|
| 2.11.1 | Nahradit placeholder gradienty reálnými fotkami | ❌ |
| 2.11.2 | Newsletter form napojit na MailerLite API | ❌ |
| 2.11.3 | Scroll reveal — JS Intersection Observer inicializace | ⚠️ |
| 2.11.4 | Unikátní ikony pro 4 healing elements | ❌ |
| 2.11.5 | Hotel booking linky s UTM parametry | ⚠️ |
| 2.11.6 | Schema.org TouristDestination na homepage | ❌ |
| 2.11.7 | Open Graph image pro social sharing | ❌ |

---

## FÁZE 3 — PILLAR PAGES (podstránky)

### 3.1 Stav obsahu

| Stránka | DE | EN | CS | RU |
|---------|----|----|----|----|
| Mineral Springs | ✅ 14KB | ✅ 13KB | ✅ 14KB | ✅ 20KB |
| Things to Do | ✅ 12KB | ✅ 13KB | ✅ 12KB | ✅ 17KB |
| History | ✅ 11KB | ✅ 13KB | ✅ 11KB | ✅ 18KB |
| Accommodation | ✅ 13KB | ✅ 12KB | ✅ 13KB | ✅ 18KB |
| Magazine | ✅ 10KB | ✅ 12KB | ✅ | ✅ |
| People | ✅ 11KB | ✅ 13KB | ✅ | ✅ |
| Practical Info | ✅ 12KB | ✅ 13KB | ✅ | ✅ |

### 3.2 Pillar page šablony

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 3.2.1 | DE routes (8 stránek) | ✅ | /de/mineralquellen atd. |
| 3.2.2 | EN routes (8 stránek) | ✅ | /en/mineral-springs atd. |
| 3.2.3 | CS routes | ✅ | /cs/mineralni-prameny atd. |
| 3.2.4 | RU routes | ✅ | /ru/mineralnye-istochniki atd. |
| 3.2.5 | Pillar page layout — sidebar TOC | ❌ | Sticky table of contents |
| 3.2.6 | In-content hotel recommendation boxy | ❌ | Kontextové CTA boxy |
| 3.2.7 | Related articles sekce dole | ❌ | "Další čtení" s 2-3 kartami |
| 3.2.8 | Social sharing tlačítka | ❌ |
| 3.2.9 | SEO meta title/description | ⚠️ | Ověřit v CMS datech |

---

## FÁZE 4 — PEOPLE OF COLONNADE (PoC)

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 4.1 | PoC landing page (masonry grid, filtry) | ❌ | Existuje jen placeholder |
| 4.2 | PoC detail page | ❌ |
| 4.3 | PoC TypeScript datový model | ❌ |
| 4.4 | PoC Keystatic kolekce | ❌ |
| 4.5 | PoC card komponenta | ⚠️ | Inline v Homepage.astro, ne reusable |
| 4.6 | PoC submission formulář | ❌ |
| 4.7 | PoC filtrování dle jazyka/tagu | ❌ |
| 4.8 | PoC RSS/JSON feed | ❌ |
| 4.9 | Reálné PoC příběhy (min. 3) | ❌ |

---

## FÁZE 5 — MAGAZÍN / BLOG

| # | Úkol | Stav |
|---|------|------|
| 5.1 | Magazine listing page (card grid, pagination) | ❌ |
| 5.2 | Article detail page template | ❌ |
| 5.3 | Keystatic kolekce pro články | ❌ |
| 5.4 | Kategorie systém | ❌ |
| 5.5 | Tag systém | ❌ |
| 5.6 | Reading time kalkulace | ❌ |
| 5.7 | Related articles algoritmus | ❌ |
| 5.8 | Article Schema.org structured data | ❌ |
| 5.9 | RSS feed | ❌ |
| 5.10 | Min. 3 seed články (DE + EN) | ❌ |

---

## FÁZE 6 — SUB-STRÁNKY

| # | Stránka | Stav | Rodičovská |
|---|---------|------|------------|
| 6.1 | /mineralquellen/ — detail 40+ springs | ❌ | Heilquellen |
| 6.2 | /co2-therapie/ | ❌ | Heilquellen |
| 6.3 | /peloidtherapie/ | ❌ | Heilquellen |
| 6.4 | /klimatherapie/ | ❌ | Heilquellen |
| 6.5 | /kolonnade/ — Singing Fountain | ❌ | Erleben |
| 6.6 | /natur/ — Parks, Kladská | ❌ | Erleben |
| 6.7 | /golf/ — Royal Golf Club | ❌ | Erleben |
| 6.8 | /kultur/ — Culture, Chopin | ❌ | Erleben |
| 6.9 | /ausfluege/ — Day trips | ❌ | Erleben |
| 6.10 | /beruehmte-gaeste/ — Famous visitors | ❌ | Geschichte |
| 6.11 | /architektur/ | ❌ | Geschichte |
| 6.12 | /unesco/ | ❌ | Geschichte |
| 6.13 | /hotel/{slug}/ | ❌ | Unterkunft |
| 6.14 | /anreise/ — Getting there | ❌ | Praktische Infos |
| 6.15 | /beste-reisezeit/ | ❌ | Praktische Infos |
| 6.16 | /faq/ + FAQPage Schema | ❌ | Praktische Infos |

---

## FÁZE 7 — SEO & PERFORMANCE

| # | Úkol | Stav |
|---|------|------|
| 7.1 | Meta titles & descriptions | ⚠️ |
| 7.2 | hreflang tagy | ⚠️ |
| 7.3 | Canonical URLs | ⚠️ |
| 7.4 | Open Graph tags | ⚠️ |
| 7.5 | Twitter Card tags | ❌ |
| 7.6 | Schema.org: TouristDestination | ❌ |
| 7.7 | Schema.org: LodgingBusiness | ❌ |
| 7.8 | Schema.org: Article | ❌ |
| 7.9 | Schema.org: FAQPage | ❌ |
| 7.10 | Schema.org: BreadcrumbList | ❌ |
| 7.11 | XML sitemap | ✅ |
| 7.12 | robots.txt | ✅ |
| 7.13 | Image optimization | ❌ |
| 7.14 | Font optimization (@fontsource) | ❌ |
| 7.15 | Lighthouse audit ≥ 95 | ❌ |
| 7.16 | Cache headers | ✅ |

---

## FÁZE 8 — INTERAKTIVNÍ FUNKCE

| # | Úkol | Stav |
|---|------|------|
| 8.1 | Newsletter signup → MailerLite API | ❌ |
| 8.2 | Interactive destination map | ❌ |
| 8.3 | Event calendar | ❌ |
| 8.4 | Treatment finder / quiz | ❌ |
| 8.5 | Cookie-free analytics | ❌ |
| 8.6 | Scroll reveal JS inicializace | ⚠️ |
| 8.7 | Header scroll behavior | ⚠️ |

---

## FÁZE 9 — OBSAH & FOTOGRAFIE

| # | Úkol | Stav |
|---|------|------|
| 9.1 | Hero fotografie | ❌ |
| 9.2 | Hotel fotografie | ❌ |
| 9.3 | Treatment fotografie | ❌ |
| 9.4 | PoC portréty | ❌ |
| 9.5 | Seasonal fotografie | ❌ |
| 9.6 | OG image template | ❌ |
| 9.7 | Favicon + app icons | ⚠️ |
| 9.8 | Custom ikony pro healing elements | ❌ |
| 9.9 | DE seed články (min. 3) | ❌ |
| 9.10 | EN seed články (min. 3) | ❌ |

---

## DOPORUČENÉ POŘADÍ PRÁCE

### Sprint 1 — Opravy & infrastruktura
- 0.1.5 Opravit site URL v astro.config
- 0.2.11 Přidat CLAUDE.md
- 1.1.13 @fontsource pro fonty
- 0.3.4 Ověřit/doplnit hreflang
- 0.3.5 Ověřit root redirect
- 2.11.3 IntersectionObserver JS
- 2.11.5 UTM parametry
- 7.2-7.4 hreflang, Canonical, OG tags

### Sprint 2 — Chybějící komponenty
- 1.2.10 Hotel Recommendation Box
- 1.2.11 Treatment Highlight Box
- 1.2.12 Booking CTA Bar
- 1.2.13 Breadcrumbs
- 1.2.14 Image component
- 2.11.4 Custom healing element ikony

### Sprint 3 — SEO & structured data
- 7.5-7.10 Schema.org
- 7.14 Font optimization
- 9.7 Favicon audit
- 2.11.6 TouristDestination
- 2.11.7 OG image

### Sprint 4 — Magazín systém
- 5.1-5.9 Kompletní magazine/blog systém

### Sprint 5 — People of Colonnade
- 4.1-4.8 PoC systém komplet

### Sprint 6 — Sub-stránky
- 6.13 Hotel detail pages (highest priority)
- 6.1 Springs detail
- 6.2 CO₂ therapy
- 6.14 Anreise + map
- 6.16 FAQ + Schema

### Sprint 7 — Interaktivní funkce
- 8.1 MailerLite API
- 8.5 Analytics
- 8.2 Destination map
- 8.3 Event calendar

### Sprint 8 — Obsah & fotografie (mimo Claude Code)

### Sprint 9 — DNS & go-live
- 0.1.3 DNS přesměrování
- 0.1.4 SSL
- 7.15 Lighthouse audit

---

## SOUHRNNÉ STATISTIKY

| Kategorie | ✅ | ⚠️ | ❌ | 🔧 |
|-----------|----|----|----|----|
| Infrastruktura (Fáze 0) | 9 | 3 | 4 | 1 |
| Design system (Fáze 1) | 21 | 1 | 5 | 0 |
| Homepage (Fáze 2) | 10 | 2 | 5 | 0 |
| Pillar pages (Fáze 3) | 6 | 3 | 4 | 0 |
| People of Colonnade (Fáze 4) | 0 | 1 | 8 | 0 |
| Magazín (Fáze 5) | 0 | 0 | 10 | 0 |
| Sub-stránky (Fáze 6) | 0 | 0 | 16 | 0 |
| SEO (Fáze 7) | 3 | 4 | 9 | 0 |
| Interaktivní (Fáze 8) | 0 | 2 | 5 | 0 |
| Obsah & foto (Fáze 9) | 0 | 1 | 9 | 0 |
| **CELKEM** | **49** | **17** | **75** | **1** |

**Celkový pokrok: ~60% hotovo (updated 18.3.2026)**

## PROVEDENÉ ZMĚNY (18. 3. 2026)

### Opraveno
- ✅ reader.ts přepsán z Keystatic createReader na přímé importy (opravuje Internal Server Error na Vercel)
- ✅ admin/index.astro přepsán na Astro.redirect()
- ✅ site URL změněna na marienbad.com
- ✅ hreflang opraveny pro lokalizované slug cesty
- ✅ Fonty přesunuty z Google CDN na @fontsource (lepší performance)
- ✅ Healing element ikony nahrazeny unikátními SVG (water, earth, gas, climate)

### Nové komponenty
- ✅ HotelRecommendationBox.astro
- ✅ TreatmentHighlightBox.astro
- ✅ BookingCtaBar.astro (sticky mobile CTA)
- ✅ ResponsiveImage.astro
- ✅ StoryCard.astro
- ✅ ArticleGrid.astro

### Nové stránky (30+ nových stránek)
- ✅ FAQ (DE/EN/CS/RU) se Schema.org FAQPage
- ✅ UNESCO (DE/EN)
- ✅ CO₂-Therapie (DE/EN) s TreatmentHighlightBox
- ✅ Golf (DE/EN)
- ✅ Natur/Nature (DE/EN)
- ✅ Anreise/Getting-there (DE/EN)
- ✅ Berühmte Gäste/Famous Visitors (DE/EN)
- ✅ Kultur/Culture (DE/EN)
- ✅ Magazín detail routes [slug] (DE/EN/CS/RU)
- ✅ PoC detail routes [slug] (DE/EN/CS/RU)
- ✅ RSS feed (/rss.xml)

### Nový obsah
- ✅ 3 DE seed články (CO₂-Bäder, Goethe, Spaziergänge)
- ✅ 3 EN seed články (CO₂ Baths, Goethe's Footsteps, Best Walks)
- ✅ 3 DE seed stories (Ingrid Hamburg, Thomas Wien, Dr. Novák)
- ✅ 3 EN seed stories (James London, Sarah & James UK, Pavel Prague)
- ✅ CS obsah dokončen (magazín, lidé, praktické info)
- ✅ RU obsah dokončen (журнал, люди, практическая информация)

### SEO
- ✅ Schema.org TouristDestination na homepage
- ✅ Schema.org LodgingBusiness pro Ensana hotely
- ✅ Schema.org FAQPage na FAQ stránkách
- ✅ Schema.org BreadcrumbList na pillar pages
- ✅ Twitter Card tags
- ✅ section prop pro správné hreflang na všech stránkách

> Tento dokument aktualizovat po každém sprintu.
