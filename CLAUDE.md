# Marienbad.com - Branding & Project Brief

## Project

**Marienbad.com** -- Official tourism portal for Marianske Lazne (Marienbad), the historic Czech spa town. The site serves as the primary digital gateway for visitors planning a spa holiday.

## Tech Stack

- **Framework:** Astro 5 (SSR mode, `output: 'server'`)
- **Styling:** Tailwind CSS 4 (via Vite plugin)
- **CMS:** Keystatic CMS (local + GitHub API mode)
- **UI Islands:** React 19 (`@astrojs/react`)
- **Hosting:** Vercel (region `fra1`)
- **Other:** MDX, Sitemap, GA4 analytics (consent-gated via ConsentBanner)

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

- **Primary family (headings + body):** Branding (Latinotype) -- weights 100-900 incl. italics
- Self-hosted WOFF2 files in `public/fonts/`, declared via `@font-face` in `src/styles/global.css` (no external requests); critical weights preloaded in `Base.astro`
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
| `PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID override (falls back to the built-in property; set to an empty string to disable GA4). |
| `PUBLIC_SEZNAM_WMT` | Seznam Webmaster site-verification code → `<meta name="seznam-wmt">` (omitted when unset). |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification code → `<meta name="google-site-verification">` (omitted when unset). |

Vercel Web Analytics (cookieless) is loaded from `/_vercel/insights/script.js` in production builds; it must be enabled in the Vercel project (Analytics → Enable), otherwise the script 404s silently.

## Design Principles

1. **Performance first** -- self-hosted fonts, minimal JS, server-rendered
2. **Accessibility** -- skip-to-content link, `prefers-reduced-motion` support, semantic HTML
3. **SEO** -- hreflang, canonical URLs, Schema.org structured data (TouristDestination, LodgingBusiness, FAQPage, BreadcrumbList)
4. **Privacy** -- GA4 analytics loaded only after user consent (ConsentBanner), no other third-party trackers
5. **Content-driven** -- CMS-managed content, Markdoc rendering, rich typography

## Workflow

- After each completed task or logical group of changes, **create a new PR** so content can be reviewed and merged into the main branch incrementally.
- Commit with clear, descriptive messages. Push to the designated feature branch.
- Always run `pnpm build` before committing to verify nothing is broken.

## Knowledge Base

Authoritative reference data from official Ensana marketing materials is stored in `data/ensana_knowledge_base.json`. Use this as the single source of truth for:
- Hotel details (stars, rooms, springs, restaurants, spa areas)
- Medical indications and contraindications
- Mineral spring names and properties
- Treatment descriptions
- Historical facts and dates

## Images

New images added under `public/images/` require running `pnpm images` to generate WebP siblings.

## Zdravotní tvrzení (redakční standard)

Platí pro všechny články kategorie `healing` a `health` a pro léčebné pilířové stránky. Podrobný plán a rešerše: `docs/content-audits/cs-medicinsky-audit-plan.md`. Databáze ověřených studií: `data/evidence/balneology_evidence.json` (čerpat z ní, ne z paměti).

**Tři kategorie tvrzení**

| Kategorie | Co lze napsat | Nutná opora |
|---|---|---|
| A. Oficiální indikace | že se nemoc v Mariánských Lázních léčí a hradí | kód indikačního seznamu (`src/data/indications.ts`) nebo léčebný program Ensana |
| B. Možný / obvyklý přínos | „používá se ke", „cílem je", „v některých studiích bylo pozorováno" | výslovné označení jako tradiční použití **nebo** přehledový zdroj z databáze; bez obojího přínos neuvádět |
| C. Prokázaný účinek | konkrétní výsledek s velikostí efektu | citace s DOI/URL, populace, délka sledování, hlavní omezení |

**Bez měřitelného výstupu nic.** Pokud pro proceduru nebo tvrzení neexistuje jasný, měřitelný a doložený výstup, odstavec o přínosu se nepíše vůbec: proceduru popsat (co je, jak probíhá, kdo o ní rozhoduje) a přínos vynechat. Negativní, neprůkazné nebo „zatím chybějící" důkazy do článků nepatří — web je PR portál; říká, co je doložené, a mlčí o tom, co doložené není. Takové studie se evidují v databázi se štítkem `upozorneni`, aby se dané tvrzení nepoužilo.

**Nikdy:** „prokazatelně" bez citace, „posiluje imunitu", „detox", „reset", „les léčí", „bez vedlejších účinků", „zpomaluje artrózu", instituce citovaná bez konkrétní publikace, číslo (%, mmHg, měsíce) bez zdroje.

**Vždy:** věta, že o zařazení do léčebného plánu rozhoduje lázeňský lékař; délka pobytu podle konkrétní položky indikačního seznamu (K 21/28, P 14/21), ne paušálně; u psychiky věta, že pobyt nenahrazuje psychoterapii ani psychiatrickou péči; interní data Ensana označit jako interní.

**Frontmatter:** `sources` (seznam `{title, url, note}`) a `medicalReviewDate` (ISO). Zdravotní článek bez `sources` vypíše varování při buildu. Sekce „Zdroje" se vykresluje automaticky (`src/components/ArticleSources.astro`). Stejná pole mají i léčebné pilířové stránky (`src/content/pages/*-co2-terapie`, `*-klimatoterapie`, `*-peloidni-terapie`), psané podle osnovy v plánu auditu §6.
