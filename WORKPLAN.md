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
| **CELKEM** | **122** | **7** | **15** |

**Celkový pokrok: ~85% hotovo (122/144 — updated 18.3.2026)**

---

## CHANGELOG

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
