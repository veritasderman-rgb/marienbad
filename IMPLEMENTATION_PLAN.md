# Marienbad.com — Kompletní implementační plán

## 1. Technologický stack

### Proč NE WordPress?
- Pomalé načítání (kritické pro SEO Core Web Vitals)
- Bezpečnostní rizika (pluginy, aktualizace)
- Omezené možnosti custom designu bez drahých šablon
- Složitá vícejazyčnost (Polylang = problémy)

### Zvolený stack

| Vrstva | Technologie | Důvod |
|--------|-------------|-------|
| **Frontend** | Next.js 15 (React, App Router) | SSG/ISR = bleskové načítání, SEO-first, mobilní optimalizace |
| **Styling** | Tailwind CSS 4 | Utility-first, mobile-first, žádný bloat |
| **CMS / Admin** | Payload CMS 3 (self-hosted) | Open-source headless CMS, vlastní editační rozhraní, REST + GraphQL API |
| **Databáze** | PostgreSQL | Robustní, spolehlivé, Payload nativní podpora |
| **Hosting** | Vercel (frontend) + Railway/VPS (CMS) | Edge CDN, automatické deploye, preview branches |
| **Obrázky** | Cloudinary / Vercel Image Optimization | WebP/AVIF automaticky, responsive images |
| **i18n** | next-intl + Payload lokalizace | 4 jazyky nativně, SEO-friendly URL (/de/, /en/, /ru/, /cs/) |
| **Email** | MailerLite API | Newsletter, email capture |
| **Analytika** | GA4 + Google Search Console | Měření výkonu |
| **Platební brána** | Stripe (připraveno pro fázi 2+) | Mezinárodní platby, snadná integrace |

### Proč Payload CMS?
- **Self-hosted** = plná kontrola, žádné měsíční poplatky za SaaS
- **Editační rozhraní** v češtině/angličtině pro redaktory
- **Lokalizace** nativně podporována (DE/EN/RU/CS)
- **Media library** = napojení na vaši databázi fotek
- **Rich text editor** = WYSIWYG pro redaktory, čistý output pro frontend
- **Verzování** obsahu, drafty, publikační workflow
- **Role & permissions** = admin, editor, autor
- **REST API + GraphQL** = flexibilní napojení

---

## 2. Architektura projektu

```
marienbad/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── [locale]/           # Jazykový routing
│   │   │   │   │   ├── page.tsx        # Homepage
│   │   │   │   │   ├── mineral-springs/
│   │   │   │   │   │   ├── page.tsx    # Pillar page
│   │   │   │   │   │   └── [slug]/     # Cluster články
│   │   │   │   │   ├── things-to-do/
│   │   │   │   │   ├── accommodation/
│   │   │   │   │   ├── history/
│   │   │   │   │   ├── practical-info/
│   │   │   │   │   ├── people/         # People of Colonnade
│   │   │   │   │   │   ├── page.tsx    # Archiv
│   │   │   │   │   │   └── [slug]/     # Jednotlivé příběhy
│   │   │   │   │   └── magazine/       # Blog
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/                 # Základní UI komponenty
│   │   │   │   ├── layout/            # Header, Footer, Navigation
│   │   │   │   ├── sections/          # Hero, CTA, FAQ, InfoBox
│   │   │   │   ├── people/            # PoC komponenty
│   │   │   │   └── ensana/            # Ensana CTA box, soft-sell
│   │   │   ├── lib/
│   │   │   │   ├── api.ts             # Payload API client
│   │   │   │   ├── i18n.ts            # Internationalization config
│   │   │   │   └── utils.ts
│   │   │   └── styles/
│   │   │       └── globals.css        # Tailwind base
│   │   ├── messages/                  # Překlady UI
│   │   │   ├── de.json
│   │   │   ├── en.json
│   │   │   ├── ru.json
│   │   │   └── cs.json
│   │   ├── public/
│   │   │   ├── fonts/
│   │   │   └── images/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── cms/                    # Payload CMS
│       ├── src/
│       │   ├── collections/
│       │   │   ├── Pages.ts           # Stránky (pillar pages)
│       │   │   ├── Articles.ts        # Cluster články + blog
│       │   │   ├── PeopleStories.ts   # People of Colonnade
│       │   │   ├── Media.ts           # Obrázky z databáze
│       │   │   ├── Authors.ts         # Autoři (lékaři, redaktoři)
│       │   │   ├── Categories.ts      # Kategorie obsahu
│       │   │   ├── Events.ts          # Kalendář akcí
│       │   │   ├── FAQ.ts             # FAQ pro schema markup
│       │   │   └── Users.ts           # Admin uživatelé
│       │   ├── globals/
│       │   │   ├── Navigation.ts      # Menu struktura
│       │   │   ├── Footer.ts
│       │   │   └── SiteSettings.ts    # Obecná nastavení
│       │   ├── blocks/                # Reusable content blocks
│       │   │   ├── HeroBlock.ts
│       │   │   ├── InfoBoxBlock.ts
│       │   │   ├── EnsanaCTABlock.ts
│       │   │   ├── FAQBlock.ts
│       │   │   ├── GalleryBlock.ts
│       │   │   └── MapBlock.ts
│       │   └── payload.config.ts
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   └── shared/                 # Sdílené typy a utility
│       ├── types/
│       └── constants/
│
├── turbo.json                  # Turborepo config
├── package.json                # Root workspace
├── docker-compose.yml          # Lokální dev (CMS + PostgreSQL)
└── README.md
```

---

## 3. URL struktura & routing

### Jazykový routing
```
marienbad.com/                    → Redirect na /de/ (primární jazyk)
marienbad.com/de/                 → Německá homepage
marienbad.com/en/                 → Anglická homepage
marienbad.com/ru/                 → Ruská homepage (fáze 2)
marienbad.com/cs/                 → Česká homepage (fáze 2)
```

### Sitemap (odpovídá zadání)
```
/[locale]/                        → Homepage (Hero + rozcestník)
/[locale]/mineral-springs/        → Pillar: Minerální prameny & Spa
/[locale]/mineral-springs/[slug]  → Cluster články (Roman Baths, CO2 Baths...)
/[locale]/things-to-do/           → Pillar: Co dělat
/[locale]/things-to-do/[slug]     → Cluster články (Singing Fountain, Golf...)
/[locale]/accommodation/          → Pillar: Ubytování
/[locale]/accommodation/[slug]    → Cluster články (Luxury, Budget...)
/[locale]/history/                → Pillar: Historie & Kultura
/[locale]/history/[slug]          → Cluster články (UNESCO, Famous Visitors...)
/[locale]/practical-info/         → Info hub
/[locale]/practical-info/[slug]   → Sub-stránky (Getting Here, Weather...)
/[locale]/people/                 → People of Colonnade archiv
/[locale]/people/[slug]           → Jednotlivé příběhy
/[locale]/magazine/               → Blog listing
/[locale]/magazine/[slug]         → Blog články
```

### SEO URL příklady
```
/de/mineralquellen/roemische-baeder/
/en/mineral-springs/roman-baths/
/de/menschen/helga-oesterreich-23-mal/
/en/people/james-london-first-time/
```

---

## 4. Datové modely (Payload CMS collections)

### 4.1 Pages (Pillar stránky)
```typescript
{
  title: string (lokalizované)
  slug: string (lokalizované — /mineral-springs/ vs /mineralquellen/)
  type: 'pillar' | 'info-hub' | 'landing'
  seo: {
    metaTitle: string (lokalizované)
    metaDescription: string (lokalizované)
    ogImage: Media
    targetKeywords: string[] // pro interní tracking
  }
  hero: {
    headline: string (lokalizované)
    subheadline: string (lokalizované)
    backgroundImage: Media
    cta: { text: string, url: string }
  }
  content: RichText (lokalizované) // WYSIWYG editor
  blocks: Block[] // Modulární bloky (InfoBox, FAQ, Gallery, EnsanaCTA...)
  faqSchema: { question: string, answer: string }[] // FAQ structured data
  relatedArticles: Article[] // Cluster články pod pillarem
  ensanaCTA: {
    enabled: boolean
    headline: string
    text: string
    url: string // s UTM parametry
    position: 'sidebar' | 'inline' | 'bottom'
  }
  status: 'draft' | 'published'
  publishedAt: Date
}
```

### 4.2 Articles (Cluster články + blog)
```typescript
{
  title: string (lokalizované)
  slug: string (lokalizované)
  type: 'cluster' | 'seasonal' | 'expert' | 'listicle' | 'guide'
  parentPillar: Page // Vztah na pillar stránku
  category: Category
  author: Author
  seo: { /* stejné jako Pages */ }
  excerpt: string (lokalizované)
  featuredImage: Media
  content: RichText (lokalizované)
  blocks: Block[]
  wordCount: number // automaticky počítáno
  ensanaCTA: { /* max 1 na článek, stejné jako Pages */ }
  tags: string[]
  status: 'draft' | 'review' | 'published'
  publishedAt: Date
}
```

### 4.3 PeopleStories (People of Colonnade)
```typescript
{
  // Odpovídá přesně specifikaci PoC
  name: string // Křestní jméno
  country: string (lokalizované) // Země
  visitNumber: string // "23. Mal" / "First time"
  headline: string // "Helga, Österreich. Zum 23. Mal."
  pullQuote: string // Hook věta
  story: RichText // 200-400 slov, originální jazyk
  originalLanguage: 'de' | 'en' | 'ru' | 'cs' | 'other'
  archetype: 'loyal' | 'first-visit' | 'healing' | 'love' | 'generation' | 'cultural' | 'local' | 'faraway'
  portrait: Media // Portrétní fotografie
  ensanaMention: boolean // Host sám zmínil Ensana?
  ensanaContext: string // Co přesně zmínil (pouze pokud true)
  consentSigned: boolean // Release formulář podepsán
  consentDocument: Media // Scan souhlasu
  socialMedia: {
    instagram: { posted: boolean, postUrl: string }
    facebook: { posted: boolean, postUrl: string }
  }
  status: 'draft' | 'published'
  publishedAt: Date
  featuredInNewsletter: boolean
}
```

### 4.4 Events (Kalendář akcí)
```typescript
{
  title: string (lokalizované)
  slug: string
  description: RichText (lokalizované)
  startDate: Date
  endDate: Date
  location: string
  image: Media
  isEnsanaEvent: boolean
  ensanaLink: string // s UTM
  category: 'culture' | 'sport' | 'wellness' | 'festival' | 'other'
  status: 'upcoming' | 'ongoing' | 'past'
}
```

---

## 5. Komponenty frontend

### 5.1 Layout komponenty
| Komponenta | Popis |
|------------|-------|
| `Header` | Logo, navigace, language switcher, mobile hamburger |
| `Footer` | Kontakt, sociální sítě, newsletter signup, Ensana link |
| `MobileNav` | Full-screen overlay menu, swipe gestures |
| `LanguageSwitcher` | Dropdown DE/EN/RU/CS s vlajkami |
| `Breadcrumbs` | SEO breadcrumbs s schema markup |

### 5.2 Content komponenty
| Komponenta | Popis |
|------------|-------|
| `HeroSection` | Full-width hero s obrázkem, headline, CTA |
| `PillarPageLayout` | TOC sidebar, sekce s H2, sticky nav |
| `ArticleLayout` | Blog/cluster layout s reading progress |
| `InfoBox` | Highlighted box s praktickými informacemi |
| `FAQAccordion` | Accordion s FAQ schema markup |
| `ImageGallery` | Lightbox galerie, lazy loading |
| `InteractiveMap` | Mapa s body zájmu (Leaflet/Mapbox) |
| `EventsCalendar` | Kalendář akcí s filtrováním |
| `SearchBar` | Full-text vyhledávání (Payload search plugin) |

### 5.3 Ensana komponenty
| Komponenta | Popis |
|------------|-------|
| `EnsanaCTABox` | Max 1 na článek, sidebar nebo inline, UTM tracking |
| `AccommodationCard` | Karta hotelu s fotkou, cenou, odkazem |
| `BookingTeaser` | Jemný teaser "Nejlepší cena při přímé rezervaci" |

### 5.4 People of Colonnade komponenty
| Komponenta | Popis |
|------------|-------|
| `StoryCard` | Portrét + pull quote + jméno/země |
| `StoryGrid` | Masonry grid příběhů s filtrováním dle archetypu |
| `StoryDetail` | Full-page příběh: velký portrét + text |
| `ShareYourStory` | UGC formulář pro návštěvníky |
| `StoryCarousel` | Horizontální carousel pro homepage |

---

## 6. SEO & Performance

### 6.1 Technical SEO
- **SSG (Static Site Generation)** = stránky předgenerované, TTFB < 100ms
- **ISR (Incremental Static Regeneration)** = CMS update → stránka se obnoví za 60s
- **Structured Data**: FAQ schema, Article schema, LocalBusiness schema, Event schema, BreadcrumbList
- **Hreflang tags**: Automatické na základě locale
- **XML Sitemap**: Automaticky generovaný z Payload dat
- **robots.txt**: Správně nakonfigurovaný
- **Canonical URLs**: Automatické
- **Open Graph + Twitter Cards**: Na každé stránce

### 6.2 Core Web Vitals cíle
| Metrika | Cíl | Jak |
|---------|-----|-----|
| LCP | < 2.5s | SSG + CDN + optimalizované obrázky |
| FID/INP | < 100ms | Minimální JS, žádný bloat |
| CLS | < 0.1 | Definované rozměry obrázků, font preloading |

### 6.3 Image pipeline
1. Redaktor nahraje fotku do Payload CMS
2. Payload automaticky generuje varianty (thumbnail, medium, large, og)
3. Frontend servuje přes `<Image>` s WebP/AVIF, responsive srcset
4. Lazy loading na všech obrázcích pod foldem

---

## 7. Editační rozhraní (Payload CMS Admin)

### 7.1 Dashboard
- Přehled publikovaného obsahu
- Rychlé statistiky (počet článků, příběhů, stránek per jazyk)
- Draft články čekající na review
- Poslední aktivita

### 7.2 Funkce pro redaktory
- **WYSIWYG editor** s preview
- **Live preview** — vidět stránku jak bude vypadat před publikací
- **Drag & drop bloky** — skládání stránky z komponent (Hero, InfoBox, FAQ, Gallery...)
- **Media library** — nahrávání, řazení, tagging fotek
- **Bulk operations** — hromadné publikování/archivace
- **Lokalizace** — přepínání mezi jazyky v editoru, vidět co je přeloženo a co ne
- **SEO panel** — meta title, description, keywords, OG preview přímo v editoru
- **Publikační workflow** — Draft → Review → Published
- **Verzování** — historie změn, rollback
- **Scheduled publishing** — naplánovat publikaci na konkrétní datum

### 7.3 Role
| Role | Práva |
|------|-------|
| **Admin** | Vše, správa uživatelů, nastavení |
| **Editor** | Vytváření, editace, publikování obsahu |
| **Autor** | Vytváření draftů, odeslání ke review |
| **PoC Fotograf** | Pouze People of Colonnade — nahrávání příběhů a fotek |

---

## 8. Implementační fáze

### FÁZE 1: Technický základ (Týden 1–2)

#### Týden 1: Project setup & infrastruktura (10–12h)
- [ ] Inicializace monorepo (Turborepo + pnpm)
- [ ] Next.js 15 setup s App Router
- [ ] Tailwind CSS 4 konfigurace
- [ ] Payload CMS 3 setup s PostgreSQL
- [ ] Docker Compose pro lokální dev (CMS + DB)
- [ ] next-intl konfigurace (DE/EN, připraveno pro RU/CS)
- [ ] Základní typové definice (shared package)
- [ ] ESLint + Prettier konfigurace
- [ ] Git workflow (main → develop → feature branches)

#### Týden 2: CMS datové modely & admin (10–12h)
- [ ] Payload collections: Pages, Articles, PeopleStories, Media, Authors, Categories, Events, FAQ, Users
- [ ] Payload globals: Navigation, Footer, SiteSettings
- [ ] Payload blocks: Hero, InfoBox, EnsanaCTA, FAQ, Gallery, Map
- [ ] Lokalizace na všech polích (DE/EN)
- [ ] Media upload + image resize pipeline
- [ ] Admin roles & permissions
- [ ] Seed data — testovací obsah pro vývoj

### FÁZE 2: Frontend základy (Týden 3–4)

#### Týden 3: Layout & navigace (10–12h)
- [ ] Design system — barvy, typografie, spacing (Tailwind theme)
- [ ] Header s responsive navigací a language switcher
- [ ] Footer s newsletter signup
- [ ] Mobile navigation (hamburger, overlay)
- [ ] Breadcrumbs s schema markup
- [ ] Homepage wireframe → implementace
- [ ] Hero section komponenta
- [ ] Homepage rozcestník (karty na pillar stránky)

#### Týden 4: Šablony stránek (10–12h)
- [ ] Pillar page šablona (TOC, H2 sekce, sidebar, FAQ)
- [ ] Cluster article šablona (blog layout, reading progress)
- [ ] InfoBox komponenta
- [ ] FAQ Accordion s schema markup
- [ ] EnsanaCTA box komponenta (max 1 per článek, UTM parametry)
- [ ] Image gallery s lightbox
- [ ] Responsive testy (mobile/tablet/desktop)
- [ ] Dark mode základ (volitelné)

### FÁZE 3: Obsah & People of Colonnade (Týden 5–7)

#### Týden 5: People of Colonnade (10–12h)
- [ ] Story card komponenta
- [ ] Story grid (masonry, filtrování dle archetypu)
- [ ] Story detail stránka
- [ ] Share Your Story formulář (UGC)
- [ ] /people/ archiv stránka
- [ ] Consent management (release formulář upload v CMS)
- [ ] Social sharing buttons

#### Týden 6: Pillar stránky obsah (12–16h)
- [ ] Vložit obsah: Mineral Springs (DE/EN) — text + fotky + FAQ
- [ ] Vložit obsah: Things to Do (DE/EN)
- [ ] Vložit obsah: Accommodation (DE/EN) — s Ensana soft-sell
- [ ] Vložit obsah: History & Culture (DE/EN)
- [ ] Vložit obsah: Practical Info (DE/EN)
- [ ] Interní prolinkování mezi pillary

#### Týden 7: Cluster články (12–16h)
- [ ] Napsat/vložit 8–10 cluster článků (dle specifikace)
  - Roman Baths, CO2 Baths, Healing Waters
  - Singing Fountain, Colonnade Walk, Royal Golf
  - Luxury Hotels, Budget Guide
  - Famous Visitors, UNESCO Heritage
- [ ] Interní prolinkování cluster → pillar
- [ ] Ensana CTA boxy na relevantních článcích

### FÁZE 4: SEO, Analytics & Polish (Týden 8–9)

#### Týden 8: SEO & Analytics (8–10h)
- [ ] GA4 implementace (gtag.js, custom events)
- [ ] Google Search Console verifikace
- [ ] XML Sitemap generování (next-sitemap)
- [ ] robots.txt
- [ ] Hreflang tags na všech stránkách
- [ ] Structured data: Article, FAQ, LocalBusiness, Event, BreadcrumbList
- [ ] Open Graph + Twitter Card meta tagy
- [ ] Email capture (MailerLite API integrace)
- [ ] Newsletter signup formulář

#### Týden 9: Optimalizace & QA (8–10h)
- [ ] Performance audit (Lighthouse, PageSpeed Insights)
- [ ] Core Web Vitals optimalizace
- [ ] Cross-browser testování
- [ ] Mobile responsivity finální kontrola
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] 404 stránka
- [ ] Error handling
- [ ] Security headers

### FÁZE 5: Launch (Týden 10)

#### Týden 10: Deploy & Launch (6–8h)
- [ ] Production deploy (Vercel + CMS hosting)
- [ ] DNS konfigurace marienbad.com
- [ ] SSL certifikát
- [ ] CDN nastavení
- [ ] Final QA na produkci
- [ ] UTM parametry na všech Ensana odkazech
- [ ] Redirect pravidla (pokud existuje starý web)
- [ ] Launch monitoring setup
- [ ] LAUNCH!

---

## 9. Post-launch plán

### Fáze 2 rozšíření (Měsíc 2–4)
- [ ] Ruština (RU) — překlady + obsah
- [ ] Čeština (CS) — překlady + obsah
- [ ] Events kalendář s Ensana akcemi
- [ ] Interactive map (Leaflet/Mapbox)
- [ ] Pokročilé vyhledávání (full-text search)
- [ ] People of Colonnade — pokračující sběr příběhů
- [ ] Instagram/Facebook integrace (auto-posting)
- [ ] Newsletter automatizace

### Fáze 3 (Měsíc 5–8)
- [ ] Platební brána (Stripe) — dárkové poukazy, zážitky
- [ ] Uživatelské účty (oblíbené, itineráře)
- [ ] Podcast player (PoC audio verze)
- [ ] Video integrace (Reels, YouTube)
- [ ] Progressive Web App (PWA) — offline přístup
- [ ] A/B testing (Ensana CTA varianty)

### Fáze 4 (Měsíc 9–12)
- [ ] Rozšíření na další Ensana destinace
- [ ] AI-powered personalizace obsahu
- [ ] Chatbot pro turistické informace
- [ ] Partnerství CzechTourism integrace
- [ ] Kniha People of Colonnade (50–80 příběhů)

---

## 10. Ensana integrace — technické detaily

### UTM tracking
Všechny odkazy na ensanahotels.com budou mít formát:
```
https://www.ensanahotels.com/[hotel]?utm_source=marienbad.com&utm_medium=referral&utm_campaign=[page-slug]&utm_content=[cta-position]
```

### CTA pravidla (vynuceno v CMS)
- Max **1 Ensana CTA box** na článek (validace v Payload)
- CTA pozice: `sidebar` | `inline` | `bottom`
- Žádný hard sell text (editor guidelines v CMS)
- Na stránce Accommodation vždy zmínit i ne-Ensana hotely

### Conversion tracking
- GA4 custom events: `ensana_cta_click`, `ensana_cta_view`
- UTM parametry pro attribution v Ensana analytics
- Heatmap tracking (Hotjar/Clarity — volitelné)

---

## 11. Bezpečnost

- [ ] HTTPS everywhere (Vercel automaticky)
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] Payload CMS — rate limiting na admin login
- [ ] Input sanitizace na všech formulářích
- [ ] CSRF ochrana
- [ ] Regular dependency updates (Dependabot)
- [ ] Backup strategie (PostgreSQL daily backup)
- [ ] GDPR compliance — cookie consent, privacy policy

---

## 12. Rozpočet — odhad provozních nákladů

| Položka | Měsíčně | Ročně |
|---------|---------|-------|
| Vercel Pro (hosting frontend) | 500 Kč | 6 000 Kč |
| VPS/Railway (CMS + DB) | 400–800 Kč | 5 000–10 000 Kč |
| Cloudinary (obrázky, free tier stačí dlouho) | 0–300 Kč | 0–3 600 Kč |
| Doména marienbad.com | — | (již vlastněno) |
| MailerLite (free do 1000 subscribers) | 0 Kč | 0 Kč |
| **Celkem infrastruktura** | **~1 000–1 500 Kč** | **~11 000–20 000 Kč** |

*Poznámka: Toto jsou čistě provozní náklady infrastruktury. Nevčítá se práce na obsahu, fotografování PoC, atd.*

---

## 13. Metriky úspěchu (KPIs)

### SEO (6 měsíců po launch)
- Organic traffic: 5 000+ sessions/měsíc
- Top 10 pozice pro "marienbad spa", "marienbad things to do", "marienbad history"
- 50+ indexed pages
- Domain Authority: 20+

### Engagement
- Avg. time on page: > 3 min (pillar pages)
- Bounce rate: < 50%
- Pages per session: > 2.5
- Newsletter subscribers: 500+ (6 měsíců)

### Ensana conversion
- CTR na Ensana CTA: > 3%
- Referral traffic na ensanahotels.com: trackováno přes UTM
- Attribution booking value: trackováno Ensana stranou

### People of Colonnade
- 50+ příběhů (6 měsíců)
- Social shares per story: > 10
- Instagram engagement rate: > 5%
