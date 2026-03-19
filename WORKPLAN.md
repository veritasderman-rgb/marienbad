# MARIENBAD.COM — Kompletní plán práce pro Claude Code

**Stav k:** 18. 3. 2026
**Repo:** `veritasderman-rgb/marienbad` → branch `claude/plan-work-tasks-z9aPo`
**Stack:** Astro 5 + Tailwind 4 + Keystatic CMS + React 19 + Vercel (fra1)
**Deploy URL:** marienbad.vercel.app

## LEGENDA STAVŮ

- ✅ HOTOVO — implementováno, funguje
- ⚠️ ČÁSTEČNĚ — existuje základ, potřebuje dokončení/opravu
- ❌ CHYBÍ — dosud neimplementováno

---

## FÁZE 0 — INFRASTRUKTURA & KONFIGURACE

### 0.1 Repo & deploy

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 0.1.1 | GitHub repo veritasderman-rgb/marienbad | ✅ | Existuje |
| 0.1.2 | Vercel projekt napojený | ✅ | vercel.json nakonfigurován, region fra1 |
| 0.1.3 | Vlastní doména marienbad.com na Vercel | ❌ | Zatím jen marienbad.vercel.app — nutno přesměrovat DNS |
| 0.1.4 | SSL certifikát na produkční doméně | ❌ | Závisí na 0.1.3 |
| 0.1.5 | site v astro.config ukazuje na produkční URL | ⚠️ | Ukazuje na marienbad.vercel.app — změnit na marienbad.com až bude DNS |
| 0.1.6 | Environment variables na Vercel | ⚠️ | Keystatic GitHub token pro API mode, MailerLite API key |

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
| 0.2.8 | Output mode server (SSR) | ✅ | output: 'server' |
| 0.2.9 | Supabase napojení | ❌ | Původně plánováno pro PoC submissions — zatím nepotřeba |
| 0.2.10 | Plausible analytics | ✅ | Plausible script v Base.astro, podmíněný na PUBLIC_PLAUSIBLE_DOMAIN |
| 0.2.11 | CLAUDE.md branding brief | ✅ | Kompletní |

### 0.3 i18n

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 0.3.1 | Astro i18n konfigurace (DE default) | ✅ | 4 locales: de, en, cs, ru; prefix na všech |
| 0.3.2 | UI překlady (src/i18n/ui.ts) | ✅ | ~9KB, všechny 4 jazyky |
| 0.3.3 | Helper funkce (config.ts, utils.ts) | ✅ | localizedHref(), t() atd. |
| 0.3.4 | hreflang tagy | ✅ | Base.astro generuje hreflang pro všechny varianty + alternateUrls prop pro sub-stránky |
| 0.3.5 | Root / redirect na /de/ | ✅ | src/pages/index.astro existuje |

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
| 1.1.13 | Self-hosted fonty (@fontsource) | ✅ | @fontsource-variable/dm-sans + @fontsource/cormorant-garamond |

### 1.2 Globální komponenty

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 1.2.1 | Header (sticky, language switcher, nav, CTA) | ✅ | Header.astro |
| 1.2.2 | Footer (4-column, Ensana disclosure) | ✅ | Footer.astro |
| 1.2.3 | Base layout (meta tags, OG, fonts) | ✅ | Base.astro |
| 1.2.4 | HeroSection | ✅ | HeroSection.astro s badges |
| 1.2.5 | SectionCard | ✅ | SectionCard.astro s variants |
| 1.2.6 | WaveDivider | ✅ | WaveDivider.astro — 2 varianty |
| 1.2.7 | PillarPage template | ✅ | PillarPage.astro |
| 1.2.8 | CmsPillarPage (Keystatic-powered) | ✅ | CmsPillarPage.astro |
| 1.2.9 | MarkdocRenderer | ✅ | Pro CMS content rendering |
| 1.2.10 | Hotel Recommendation Box | ✅ | HotelRecommendationBox.astro — star ratings, badge, booking URL |
| 1.2.11 | Treatment Highlight Box | ✅ | TreatmentHighlightBox.astro — 4 healing element ikony |
| 1.2.12 | Booking CTA Bar (sticky mobile) | ✅ | BookingCtaBar.astro — scroll detection, locale-aware |
| 1.2.13 | Breadcrumbs komponenta | ✅ | Schema.org BreadcrumbList |
| 1.2.14 | Image component (s lazy loading) | ✅ | ResponsiveImage.astro + OptimizedImage.astro |
| 1.2.15 | SocialShare komponenta | ✅ | SocialShare.astro — Facebook, X, WhatsApp, Email, Copy link |
| 1.2.16 | RelatedArticles komponenta | ✅ | RelatedArticles.astro — filtr dle kategorie |
| 1.2.17 | StoryCard komponenta | ✅ | StoryCard.astro — portrait, quote, gradient fallback |
| 1.2.18 | ArticleGrid komponenta | ✅ | ArticleGrid.astro — responsive 3-col grid |
| 1.2.19 | DestinationMap (Leaflet) | ✅ | DestinationMap.astro — lazy-loaded, 4 marker kategorie |
| 1.2.20 | EventCalendar | ✅ | EventCalendar.astro — sezónní grouping, locale-aware |

---

## FÁZE 2 — HOMEPAGE (10 sekcí)

| # | Sekce | Stav | Poznámka |
|---|-------|------|----------|
| 2.1 | Hero (fullscreen, Ken Burns, badges) | ✅ | Gradient placeholder, badges z CMS |
| 2.2 | Quick Facts Strip (4 stat karty) | ✅ | 2×2 grid mobile, 4-col desktop |
| 2.3 | Four Healing Elements (indigo bg) | ✅ | Unikátní SVG ikony (water, earth, gas, climate) |
| 2.4 | Discover the Town (3 pillar karty) | ✅ | SectionCard komponenty |
| 2.5 | Where to Stay (2 hotel karty) | ✅ | Star ratings, feature tags, booking links |
| 2.6 | People of Colonnade (dark bg) | ✅ | Portrait placeholders, pull quotes |
| 2.7 | Seasonal Highlight (2-col) | ✅ | Image + text layout |
| 2.8 | Magazine Preview (3 article karty) | ✅ | Category, title, excerpt, date |
| 2.9 | Email Capture (gradient bg, form) | ✅ | Form napojen na /api/newsletter endpoint |
| 2.10 | Wave dividers mezi sekcemi | ✅ | 2× použito |

### 2.11 Homepage — co chybí/opravit

| # | Úkol | Stav |
|---|------|------|
| 2.11.1 | Nahradit placeholder gradienty reálnými fotkami | ❌ |
| 2.11.2 | Newsletter form → MailerLite API (potřeba API key) | ⚠️ | Endpoint existuje s graceful degradation, chybí MAILERLITE_API_KEY env var |
| 2.11.3 | Scroll reveal — JS IntersectionObserver | ✅ | Implementováno v Base.astro |
| 2.11.4 | Unikátní ikony pro 4 healing elements | ✅ | Custom SVG paths |
| 2.11.5 | Hotel booking linky s UTM parametry | ⚠️ | Linky existují, UTM TBD |
| 2.11.6 | Schema.org TouristDestination na homepage | ✅ | + LodgingBusiness pro 2 hotely |
| 2.11.7 | Dynamic OG image | ✅ | /api/og endpoint generuje SVG |

---

## FÁZE 3 — PILLAR PAGES (podstránky)

### 3.1 Stav obsahu

| Stránka | DE | EN | CS | RU |
|---------|----|----|----|----|
| Mineral Springs | ✅ | ✅ | ✅ | ✅ |
| Things to Do | ✅ | ✅ | ✅ | ✅ |
| History | ✅ | ✅ | ✅ | ✅ |
| Accommodation | ✅ | ✅ | ✅ | ✅ |
| Magazine | ✅ | ✅ | ✅ | ✅ |
| People | ✅ | ✅ | ✅ | ✅ |
| Practical Info | ✅ | ✅ | ✅ | ✅ |

### 3.2 Pillar page šablony

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 3.2.1 | DE routes (8 stránek) | ✅ | /de/mineralquellen atd. |
| 3.2.2 | EN routes (8 stránek) | ✅ | /en/mineral-springs atd. |
| 3.2.3 | CS routes | ✅ | /cs/mineralni-prameny atd. |
| 3.2.4 | RU routes | ✅ | /ru/mineralnye-istochniki atd. |
| 3.2.5 | Pillar page layout — sidebar TOC | ✅ | Sticky table of contents |
| 3.2.6 | In-content hotel recommendation boxy | ⚠️ | Komponenta existuje, integrace do pillar pages TBD |
| 3.2.7 | Related articles sekce dole | ✅ | RelatedArticles.astro |
| 3.2.8 | Social sharing tlačítka | ✅ | SocialShare.astro — 5 kanálů |
| 3.2.9 | SEO meta title/description | ✅ | V CMS datech pro každou stránku |

---

## FÁZE 4 — PEOPLE OF COLONNADE (PoC)

| # | Úkol | Stav | Poznámka |
|---|------|------|----------|
| 4.1 | PoC landing page (grid) | ✅ | Implementováno |
| 4.2 | PoC detail page | ✅ | Detail routes [slug] pro DE/EN/CS/RU |
| 4.3 | PoC TypeScript datový model | ✅ | Implementováno |
| 4.4 | PoC Keystatic kolekce | ✅ | Implementováno |
| 4.5 | PoC card komponenta | ✅ | StoryCard.astro |
| 4.6 | PoC submission formulář | ❌ | Potřebuje backend (Supabase?) |
| 4.7 | PoC filtrování dle jazyka/tagu | ❌ | React island s filtry |
| 4.8 | PoC RSS/JSON feed | ❌ |
| 4.9 | Reálné PoC příběhy (min. 3) | ✅ | 3 DE + 3 EN seed stories |

---

## FÁZE 5 — MAGAZÍN / BLOG

| # | Úkol | Stav |
|---|------|------|
| 5.1 | Magazine listing page (card grid) | ✅ | ArticleGrid.astro |
| 5.2 | Article detail page template | ✅ | Detail routes [slug] pro DE/EN/CS/RU |
| 5.3 | Keystatic kolekce pro články | ✅ | Implementováno |
| 5.4 | Kategorie systém | ✅ | Implementováno |
| 5.5 | Tag systém | ✅ | Implementováno |
| 5.6 | Reading time kalkulace | ✅ | Implementováno |
| 5.7 | Related articles algoritmus | ✅ | RelatedArticles.astro — filtr dle kategorie |
| 5.8 | Article Schema.org structured data | ❌ | Chybí ld+json Article markup na detail stránkách |
| 5.9 | RSS feed | ✅ | /rss.xml |
| 5.10 | Min. 3 seed články (DE + EN) | ✅ | 3 DE + 3 EN seed články |

---

## FÁZE 6 — SUB-STRÁNKY

| # | Stránka | Stav | Rodičovská |
|---|---------|------|------------|
| 6.1 | /quellen-uebersicht/ — Springs overview | ✅ | DE/EN s TreatmentHighlightBox |
| 6.2 | /co2-therapie/ | ✅ | DE/EN s TreatmentHighlightBox |
| 6.3 | /peloidtherapie/ | ✅ | DE/EN |
| 6.4 | /klimatherapie/ | ✅ | DE/EN |
| 6.5 | /kolonnade/ — Singing Fountain | ✅ | DE/EN |
| 6.6 | /natur/ — Parks, Kladská | ✅ | DE/EN |
| 6.7 | /golf/ — Royal Golf Club | ✅ | DE/EN |
| 6.8 | /kultur/ — Culture, Chopin | ✅ | DE/EN s EventCalendar |
| 6.9 | /ausfluege/ — Day trips | ✅ | DE/EN |
| 6.10 | /beruehmte-gaeste/ — Famous visitors | ✅ | DE/EN |
| 6.11 | /architektur/ | ✅ | DE/EN |
| 6.12 | /unesco/ | ✅ | DE/EN |
| 6.13 | /hotel/{slug}/ | ✅ | DE/EN |
| 6.14 | /anreise/ — Getting there | ✅ | DE/EN s DestinationMap |
| 6.15 | /beste-reisezeit/ — Best time to visit | ✅ | DE/EN |
| 6.16 | /faq/ + FAQPage Schema | ✅ | DE/EN/CS/RU se Schema.org FAQPage |
| 6.17 | /datenschutz/ — Privacy | ✅ | DE/EN/CS/RU |
| 6.18 | /impressum/ — Imprint | ✅ | DE/EN/CS/RU |

---

## FÁZE 7 — SEO & PERFORMANCE

| # | Úkol | Stav |
|---|------|------|
| 7.1 | Meta titles & descriptions | ✅ | V CMS datech a stránkových komponentách |
| 7.2 | hreflang tagy | ✅ | Base.astro — všechny varianty + alternateUrls pro sub-stránky |
| 7.3 | Canonical URLs | ✅ | Base.astro — siteUrl + pathname |
| 7.4 | Open Graph tags | ✅ | og:title, og:description, og:type, og:url, og:site_name, og:image |
| 7.5 | Twitter Card tags | ✅ | twitter:card, twitter:title, twitter:description, twitter:image |
| 7.6 | Schema.org: TouristDestination | ✅ | Homepage.astro |
| 7.7 | Schema.org: LodgingBusiness | ✅ | Homepage.astro — 2 hotely |
| 7.8 | Schema.org: Article | ❌ | Chybí na article detail stránkách |
| 7.9 | Schema.org: FAQPage | ✅ | Na FAQ stránkách (DE/EN/CS/RU) |
| 7.10 | Schema.org: BreadcrumbList | ✅ | Breadcrumbs.astro |
| 7.11 | XML sitemap | ✅ | @astrojs/sitemap |
| 7.12 | robots.txt | ✅ | Existuje |
| 7.13 | Image optimization (Astro Image) | ❌ | Zatím placeholder gradienty — relevantní až s reálnými fotkami |
| 7.14 | Font optimization (@fontsource) | ✅ | Self-hosted via @fontsource packages |
| 7.15 | Lighthouse audit ≥ 95 | ❌ | Dosud neprovedeno |
| 7.16 | Cache headers | ✅ | Na OG endpoint + Vercel config |

---

## FÁZE 8 — INTERAKTIVNÍ FUNKCE

| # | Úkol | Stav |
|---|------|------|
| 8.1 | Newsletter signup → MailerLite API | ⚠️ | Endpoint existuje s rate limiting + honeypot, chybí API key na Vercel |
| 8.2 | Interactive destination map | ✅ | DestinationMap.astro — Leaflet, lazy-loaded, 4 kategorie markerů |
| 8.3 | Event calendar | ✅ | EventCalendar.astro — sezónní grouping |
| 8.4 | Treatment finder / quiz | ❌ | Interaktivní React island |
| 8.5 | Cookie-free analytics | ✅ | Plausible v Base.astro |
| 8.6 | Scroll reveal JS inicializace | ✅ | IntersectionObserver v Base.astro, respektuje prefers-reduced-motion |
| 8.7 | Header scroll behavior | ✅ | Implementováno |

---

## FÁZE 9 — OBSAH & FOTOGRAFIE

| # | Úkol | Stav |
|---|------|------|
| 9.1 | Hero fotografie | ❌ | Placeholder gradienty |
| 9.2 | Hotel fotografie | ❌ | Placeholder gradienty |
| 9.3 | Treatment fotografie | ❌ | Placeholder gradienty |
| 9.4 | PoC portréty | ❌ | Placeholder gradienty |
| 9.5 | Seasonal fotografie | ❌ | Placeholder gradienty |
| 9.6 | OG image template | ✅ | Dynamický SVG via /api/og endpoint |
| 9.7 | Favicon + app icons | ⚠️ | Ověřit kompletnost (favicon.ico, apple-touch-icon, manifest) |
| 9.8 | Custom ikony pro healing elements | ✅ | 4 unikátní SVG paths (water, earth, gas, climate) |
| 9.9 | DE seed články (min. 3) | ✅ | CO₂-Bäder, Goethe, Spaziergänge |
| 9.10 | EN seed články (min. 3) | ✅ | CO₂ Baths, Goethe's Footsteps, Best Walks |

---

## ZBÝVAJÍCÍ PRÁCE — PRIORITIZOVÁNO

### P1 — Před spuštěním (blocking)

| # | Úkol | Effort |
|---|------|--------|
| 0.1.3 | DNS doména marienbad.com → Vercel | Manuální (mimo kód) |
| 0.1.4 | SSL certifikát | Automatický po DNS |
| 0.1.5 | Změnit site URL na marienbad.com | 1 řádek v astro.config |
| 0.1.6 | Env vars na Vercel (MailerLite key) | Manuální (Vercel dashboard) |

### P2 — SEO & kvalita

| # | Úkol | Effort |
|---|------|--------|
| 5.8 / 7.8 | Schema.org Article markup na article detail pages | Střední |
| 7.15 | Lighthouse audit + opravy | Střední |
| 2.11.5 | UTM parametry na hotel booking links | Malý |

### P3 — Nice to have funkce

| # | Úkol | Effort |
|---|------|--------|
| 4.6 | PoC submission formulář | Velký (potřebuje backend) |
| 4.7 | PoC filtrování dle jazyka/tagu | Střední |
| 4.8 | PoC RSS/JSON feed | Malý |
| 8.4 | Treatment finder / quiz | Velký |
| 3.2.6 | Hotel recommendation boxy integrovat do pillar pages | Malý |

### P4 — Obsah (mimo Claude Code)

| # | Úkol |
|---|------|
| 9.1-9.5 | Reálné fotografie (hero, hotely, treatments, portréty, seasonal) |
| 7.13 | Image optimization (relevantní až s fotkami) |

---

## FÁZE 10 — OBSAHOVÝ PLÁN (SEO ČLÁNKY)

### 10.0 CMS infrastruktura

| # | Úkol | Stav |
|---|------|------|
| 10.0.1 | Keystatic: rozšířené kategorie (healing, springs, activities, planning, comparison, wellness) | ✅ |
| 10.0.2 | Keystatic: SEO pole (primaryKeyword, secondaryKeywords, metaDescription, relatedEnsanaLink) | ✅ |
| 10.0.3 | Keystatic: articleType pole (pillar, cluster, guide, comparison, faq) | ✅ |
| 10.0.4 | Cover image zobrazení na article detail stránkách (DE/EN/CS/RU) | ✅ |

### 10.1 KLASTR A — Léčba a zdravotní indikace

Každý článek existuje ve 4 jazykových verzích: CS, DE, EN, RU.

| # | Článek | Typ | CS | DE | EN | RU |
|---|--------|-----|----|----|----|----|
| A1 | Lázeňská léčba — kompletní průvodce | Pillar | ✅ | ✅ | ✅ | ✅ |
| A2 | Plynové injekce CO2 — unikátní léčba | Cluster | ✅ | ✅ | ✅ | ✅ |
| A3 | Pitná kúra — průvodce prameny | Cluster | ✅ | ✅ | ✅ | ✅ |
| A4 | Rehabilitace po covidu v lázních | Cluster | ✅ | ✅ | ✅ | ✅ |
| A5 | Léčba pohybového aparátu bahnem a minerální vodou | Cluster | ❌ | ❌ | ❌ | ❌ |
| A6 | Léčba ledvin a močových cest | Cluster | ❌ | ❌ | ❌ | ❌ |

### 10.2 KLASTR B — Lázeňský pobyt (praktické info)

| # | Článek | Typ | CS | DE | EN | RU |
|---|--------|-----|----|----|----|----|
| B1 | Jak získat lázeňský poukaz od lékaře (2026) | Guide | ✅ | ✅ | ✅ | ✅ |
| B2 | Kolik stojí týden v lázních — cenový průvodce 2026 | Guide | ✅ | ✅ | ✅ | ✅ |

### 10.3 KLASTR C — Destinace a kultura

| # | Článek | Typ | CS | DE | EN | RU |
|---|--------|-----|----|----|----|----|
| C1 | Mariánské Lázně — kompletní průvodce UNESCO městem | Pillar | ✅ | ✅ | ✅ | ✅ |
| C2 | Mariánské Lázně vs. Karlovy Vary — který kurort? | Comparison | ✅ | ✅ | ✅ | ✅ |
| C3 | Zpívající fontána — program, historie, info | Guide | ✅ | ✅ | ✅ | ✅ |

### 10.4 KLASTR D — Wellness a relaxace

| # | Článek | Typ | CS | DE | EN | RU |
|---|--------|-----|----|----|----|----|
| D1 | Wellness víkend pro dva v Mariánských Lázních | Guide | ✅ | ✅ | ✅ | ✅ |
| D2 | Burnout prevence — proč lázeňský pobyt pomáhá | Cluster | ✅ | ✅ | ✅ | ✅ |
| D3 | Lázeňský pobyt pro seniory — kompletní průvodce | Guide | ✅ | ✅ | ✅ | ✅ |

### 10.5 Publikační vlny

Každý článek se publikuje ve všech 4 jazycích najednou (CS, DE, EN, RU).

**Vlna 1 (duben–květen 2026) — Nejvyšší priorita**

| # | Článek | Důvod priority |
|---|--------|----------------|
| A1 | Lázeňská léčba — kompletní průvodce (×4 jazyky) | Hlavní pillar pro organic traffic |
| C2 | ML vs. Karlovy Vary (×4 jazyky) | Vysoký search volume ve všech jazycích |
| B1 | Lázeňský poukaz od lékaře (×4 jazyky) | Vysoký intent — konverzní |
| B2 | Cenový průvodce lázně (×4 jazyky) | Konverzní — srovnání s DE/AT/CH cenami |

**Vlna 2 (červen–červenec 2026)**

| # | Článek |
|---|--------|
| A3 | Pitná kúra — průvodce prameny (×4) |
| A2 | Plynové injekce CO2 (×4) |
| D1 | Wellness víkend pro dva (×4) |
| C1 | Kompletní průvodce UNESCO městem (×4) |

**Vlna 3 (srpen–září 2026)**

| # | Článek |
|---|--------|
| A4 | Post-covid rehabilitace (×4) |
| D2 | Burnout prevence (×4) |
| D3 | Lázeňský pobyt pro seniory (×4) |
| C3 | Zpívající fontána (×4) |

**Vlna 4 (říjen+ 2026)**

| # | Článek |
|---|--------|
| A5 | Pohybový aparát (×4) |
| A6 | Ledviny a močové cesty (×4) |

### 10.6 SEO pravidla pro články

- **Poměr obsahu:** 70% nezávislý destinační obsah / 30% přirozené napojení na Ensana
- **Primary keyword:** v H1, prvním odstavci, alespoň jednom H2, meta description, URL slug
- **Interní odkazy:** min. 3 na jiné stránky marienbad.com
- **Ensana odkazy:** 1–2 kontextové (nikdy reklamní), formou "Pitná kúra z Lesního pramene je dostupná přímo v lobby Centrálních Lázní"
- **Zakázáno:** "Rezervujte si!", "Neváhejte!", urgency marketing, prodejní fráze
- **Tón:** zkušený lokální průvodce — důvěryhodný, vřelý, bez klišé
- **Délky:** Pillar 2000-3000 slov, Cluster 1200-1800, Guide 1500-2500, Comparison 1500-2000, FAQ 800-1200
- **Každý článek:** vždy ve všech 4 jazycích (CS, DE, EN, RU) — ne překlad, ale lokalizace s relevantními reáliemi (DE verze: vzdálenosti z DE měst, Krankenkasse; CS: pojišťovna, poukaz; EN: international traveler perspective; RU: vizum, doprava z RU/BY)

### 10.7 Statistiky obsahového plánu

| Klastr | Články | × 4 jazyky = verze |
|--------|--------|---------------------|
| A — Léčba | 6 | 24 |
| B — Praktické | 2 | 8 |
| C — Destinace | 3 | 12 |
| D — Wellness | 3 | 12 |
| **CELKEM** | **14 článků** | **56 jazykových verzí** |

---

## SOUHRNNÉ STATISTIKY

| Kategorie | ✅ | ⚠️ | ❌ |
|-----------|----|----|-----|
| Infrastruktura (Fáze 0) | 13 | 2 | 2 |
| Design system (Fáze 1) | 27 | 0 | 0 |
| Homepage (Fáze 2) | 15 | 2 | 1 |
| Pillar pages (Fáze 3) | 12 | 1 | 0 |
| People of Colonnade (Fáze 4) | 6 | 0 | 3 |
| Magazín (Fáze 5) | 9 | 0 | 1 |
| Sub-stránky (Fáze 6) | 18 | 0 | 0 |
| SEO (Fáze 7) | 13 | 0 | 2 |
| Interaktivní (Fáze 8) | 5 | 1 | 1 |
| Obsah & foto (Fáze 9) | 4 | 1 | 5 |
| Obsahový plán (Fáze 10) | 52 | 0 | 8 |
| **CELKEM** | **174** | **7** | **23** |

**Celkový pokrok: ~85% hotovo (174/204 — updated 19.3.2026)**

---

## CHANGELOG

### 19. 3. 2026 — Session 6 (branch claude/plan-work-tasks-z9aPo)

#### Wave 3 články (16 jazykových verzí)
- ✅ A4: Rehabilitace po covidu v lázních (CS/DE/EN/RU) — cluster, healing
- ✅ D2: Burnout prevence — proč lázeňský pobyt pomáhá (CS/DE/EN/RU) — cluster, wellness
- ✅ D3: Lázeňský pobyt pro seniory — kompletní průvodce (CS/DE/EN/RU) — guide, wellness
- ✅ C3: Zpívající fontána — program, historie, info (CS/DE/EN/RU) — guide, activities

#### Newsletter vylepšení
- ✅ MailerLite skupiny podle locale (DE/EN/CS/RU) — env vars MAILERLITE_GROUP_*

#### Stav obsahového plánu
- Vlna 1 (A1, B1, B2, C2): ✅ kompletní — 16/16 verzí
- Vlna 2 (A3, A2, D1, C1): ✅ kompletní — 16/16 verzí
- Vlna 3 (A4, D2, D3, C3): ✅ kompletní — 16/16 verzí
- Vlna 4 (A5, A6): ❌ čeká
- Celkem hotovo: 48/56 jazykových verzí (86%)

### 19. 3. 2026 — Session 5 (branch claude/plan-work-tasks-z9aPo)

#### Wave 2 články (16 jazykových verzí)
- ✅ A3: Pitná kúra — průvodce prameny (CS/DE/EN/RU) — cluster, springs
- ✅ A2: Plynové injekce CO2 — unikátní léčba (CS/DE/EN/RU) — cluster, healing
- ✅ D1: Wellness víkend pro dva (CS/DE/EN/RU) — guide, wellness
- ✅ C1: Kompletní průvodce UNESCO městem (CS/DE/EN/RU) — pillar, activities

#### Stav obsahového plánu
- Vlna 1 (A1, B1, B2, C2): ✅ kompletní — 16/16 verzí
- Vlna 2 (A3, A2, D1, C1): ✅ kompletní — 16/16 verzí
- Vlna 3 (A4, D2, D3, C3): ✅ kompletní — 16/16 verzí
- Vlna 4 (A5, A6): ❌ čeká
- Celkem hotovo: 48/56 jazykových verzí (86%)

### 19. 3. 2026 — Session 4 (branch claude/plan-work-tasks-z9aPo)

#### UX opravy
- ✅ Header: poloprůhledné pozadí hned od načtení (ne jen po scrollu) — jazyk lze přepnout okamžitě
- ✅ Quick Facts: unikátní SVG ikony (pramen, UNESCO chrám, termální lázeň, golf)
- ✅ People of Colonnade: bg-beige-950 → bg-aubergine-900 (brandová barva)
- ✅ Booking URLs: locale-aware ensanahotels.com/{locale}/destinace/... s UTM

#### CMS rozšíření
- ✅ Keystatic: nové kategorie (healing, springs, activities, planning, comparison, wellness)
- ✅ Keystatic: SEO pole (primaryKeyword, secondaryKeywords, metaDescription, relatedEnsanaLink)
- ✅ Keystatic: articleType (pillar/cluster/guide/comparison/faq)
- ✅ Cover image zobrazení na article detail stránkách (všechny 4 locale)

#### Obsahový plán
- ✅ Fáze 10 přidána: 14 článků × 4 jazyky = 56 jazykových verzí, 4 publikační vlny
- ✅ 4 klastry: A (Léčba, 6 článků), B (Praktické, 2), C (Destinace, 3), D (Wellness, 3)
- ✅ Každý článek vždy ve všech 4 jazycích (CS, DE, EN, RU) — lokalizace, ne překlad
- ✅ Sloučeny původní klastry E (DACH) a F (EN) do hlavních klastrů — obsah D2 (Burnout) a D3 (Seniory) přesunut z E4/E5

### 18. 3. 2026 — Session 3 (branch claude/plan-work-tasks-z9aPo)

#### Implementováno
- ✅ hreflang alternateUrls pro 30+ sub-stránek (DE/EN páry + 4-locale stránky)
- ✅ Security headers middleware (X-Frame-Options, CSP, HSTS atd.)
- ✅ Footer opraven — Ensana disclosure, kontaktní údaje, právní odkazy
- ✅ DestinationMap integrován do things-to-do a getting-there stránek
- ✅ EventCalendar integrován do culture stránek
- ✅ Newsletter API endpoint s rate limiting, honeypot, bot detection

#### Aktualizace WORKPLAN
- Kompletní reaudit všech položek — stavy aktualizovány dle skutečného stavu kódu
- Pokrok zvýšen z 63% na 85%
- Přidány nové položky (1.2.15-1.2.20, 6.17-6.18) reflektující implementované komponenty
- Přepracovaná sekce "Zbývající práce" s prioritizací

### 18. 3. 2026 — Session 2

- ✅ Plausible Analytics přidán do Base.astro
- ✅ CLAUDE.md branding brief vytvořen

### 18. 3. 2026 — Session 1

- ✅ reader.ts přepsán na přímé importy (opravuje ISE na Vercel)
- ✅ Fonty přesunuty na @fontsource
- ✅ Healing element ikony nahrazeny unikátními SVG
- ✅ HotelRecommendationBox, TreatmentHighlightBox, BookingCtaBar, ResponsiveImage vytvořeny
- ✅ 30+ nových stránek (FAQ, UNESCO, CO₂, Golf, Natur, Anreise, atd.)
- ✅ 6 seed článků + 6 seed stories
- ✅ Schema.org TouristDestination, LodgingBusiness, FAQPage, BreadcrumbList

> Tento dokument aktualizovat po každém sprintu.
