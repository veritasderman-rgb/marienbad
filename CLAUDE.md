# Marienbad.com - Branding & Project Brief

## Project

**Marienbad.com** -- Official tourism portal for Marianske Lazne (Marienbad), the historic Czech spa town. The site serves as the primary digital gateway for visitors planning a spa holiday.

## Tech Stack

- **Framework:** Astro 5 (SSR mode, `output: 'server'`)
- **Styling:** Tailwind CSS 4 (via Vite plugin)
- **CMS:** Keystatic CMS (local + GitHub API mode)
- **UI Islands:** React 19 (`@astrojs/react`)
- **Hosting:** Vercel (region `fra1`)
- **Other:** MDX, Sitemap, Plausible Analytics (cookie-free)

## Brand Colors (Ensana Palette)

| Token | Role |
|-------|------|
| `indigo` | Primary brand color, headings, dark backgrounds |
| `turquoise` | Accent, icons, highlights, links |
| `yellow` | CTA buttons, badges, attention |
| `aubergine` | Secondary dark, footer, contrast |
| `beige` | Warm backgrounds, soft sections |

Defined as Tailwind 4 `@theme` color scales in `src/styles/global.css`.

## Typography

- **Headings:** Cormorant Garamond (weights 400-700, italic variants) -- elegant serif evoking the spa town's heritage
- **Body:** DM Sans (variable) -- clean, modern, highly readable sans-serif
- Loaded via `@fontsource` (self-hosted, no external requests)
- Fluid type scale using `clamp()` values

## Tone of Voice

- **Warm and inviting** -- not clinical or sterile
- **Professional** -- trustworthy, authoritative on health/wellness topics
- **Evocative** -- paint a picture of the experience, appeal to senses
- **Respectful of tradition** -- acknowledge 200+ years of spa culture

## Target Audience

1. **Primary:** German-speaking spa tourists (DE/AT/CH) -- typically 50+, health-conscious, seeking traditional Kur treatments
2. **Secondary:** International visitors (EN), Czech domestic tourists (CS), Russian-speaking visitors (RU)

## Languages

| Code | Language | Status |
|------|----------|--------|
| `de` | German (default) | Full coverage |
| `en` | English | Full coverage |
| `cs` | Czech | Full coverage |
| `ru` | Russian | Full coverage |

URL structure: `/{locale}/{section-slug}` -- all locales use prefix routing.

## Key Commands

```bash
pnpm dev          # Start dev server (localhost:4321)
pnpm build        # Production build
pnpm preview      # Preview production build locally
pnpm keystatic    # Start Keystatic CMS admin UI
```

## Content Structure

```
src/content/
  pages/           # Pillar page content (Keystatic singletons per locale)
    mineral-springs/
    things-to-do/
    history/
    accommodation/
    magazine/
    people/
    practical-info/
  articles/        # Magazine/blog articles (Keystatic collection)
  stories/         # People of Colonnade stories (Keystatic collection)
```

### Page Hierarchy

- **Homepage** (`/de/`, `/en/`, `/cs/`, `/ru/`) -- 10-section landing page
- **Pillar Pages** -- 7 main content sections (mineral springs, things to do, history, accommodation, magazine, people, practical info)
- **Sub-pages** -- Detailed topic pages (CO2 therapy, golf, nature, UNESCO, FAQ, etc.)
- **Magazine** -- Blog articles with categories, tags, reading time
- **People of Colonnade** -- User stories / testimonials
- **CMS Admin** -- `/admin/` route (Keystatic)

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Base.astro` | `src/layouts/` | Root HTML layout, meta tags, fonts, analytics |
| `Header.astro` | `src/components/` | Sticky header, nav, language switcher |
| `Footer.astro` | `src/components/` | 4-column footer with Ensana disclosure |
| `HeroSection.astro` | `src/components/` | Fullscreen hero with Ken Burns + badges |
| `PillarPage.astro` | `src/components/` | Template for pillar content pages |
| `BookingCtaBar.astro` | `src/components/` | Sticky mobile booking CTA |

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `PUBLIC_PLAUSIBLE_DOMAIN` | Plausible Analytics domain (e.g., `marienbad.com`). If unset, analytics script is not loaded. |

## Design Principles

1. **Performance first** -- self-hosted fonts, minimal JS, server-rendered
2. **Accessibility** -- skip-to-content link, `prefers-reduced-motion` support, semantic HTML
3. **SEO** -- hreflang, canonical URLs, Schema.org structured data (TouristDestination, LodgingBusiness, FAQPage, BreadcrumbList)
4. **Privacy** -- cookie-free analytics (Plausible), no third-party trackers
5. **Content-driven** -- CMS-managed content, Markdoc rendering, rich typography

## Knowledge Base

Authoritative reference data from official Ensana marketing materials is stored in `data/ensana_knowledge_base.json`. Use this as the single source of truth for:
- Hotel details (stars, rooms, springs, restaurants, spa areas)
- Medical indications and contraindications
- Mineral spring names and properties
- Treatment descriptions
- Historical facts and dates
