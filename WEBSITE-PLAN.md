# Marienbad.com — Plán fungování webu

## Aktuální stav

| Vrstva | Stav | Poznámka |
|--------|------|----------|
| Payload CMS schema | Hotovo | 8 kolekcí, 3 globály, lokalizace DE/EN/RU/CS |
| Admin panel (/admin) | Hotovo | Čeká na databázi |
| Frontend pages | Hotovo (placeholder) | 8 sekcí, SEO, JSON-LD, responsive |
| Payload ↔ Frontend | CHYBÍ | Všude `// TODO: Fetch from Payload CMS` |
| Databáze | CHYBÍ | Supabase ještě není propojená |
| Obsah | CHYBÍ | Žádné texty, obrázky, ani data |

## Co je potřeba udělat (v pořadí)

### Fáze 1: Infrastruktura (den 1)
1. Vytvořit Supabase projekt (Frankfurt region)
2. Nastavit env proměnné na Vercelu (viz SETUP-GUIDE.md)
3. Deploy → Payload vytvoří tabulky → vytvořit admin účet na /admin
4. Ověřit, že /admin funguje

### Fáze 2: Propojení frontendu s CMS (den 2-3)
Každá stránka potřebuje nahradit hardcoded data za Payload API volání:

| Stránka | Soubor | Co propojit |
|---------|--------|-------------|
| Homepage | `[locale]/page.tsx` | Hero, section cards, people carousel |
| Mineral Springs | `mineral-springs/page.tsx` | Pillar page content, TOC, FAQ, Ensana CTA |
| Mineral Springs článek | `mineral-springs/[slug]/page.tsx` | Article content, sidebar, related |
| Things to Do | `things-to-do/page.tsx` | Pillar page content, TOC, FAQ |
| Things to Do článek | `things-to-do/[slug]/page.tsx` | Article content |
| Accommodation | `accommodation/page.tsx` | Pillar page content |
| Accommodation článek | `accommodation/[slug]/page.tsx` | Article content |
| History | `history/page.tsx` | Pillar page content, FAQ |
| History článek | `history/[slug]/page.tsx` | Article content |
| Practical Info | `practical-info/page.tsx` | Pillar page content, FAQ |
| Practical Info článek | `practical-info/[slug]/page.tsx` | Article content |
| People | `people/page.tsx` | Story grid, archetype filter |
| People příběh | `people/[slug]/page.tsx` | Story detail |
| Magazine | `magazine/page.tsx` | Article listing |
| Magazine článek | `magazine/[slug]/page.tsx` | Article detail |
| Layout (Header) | `Header.tsx` | Navigation global |
| Layout (Footer) | `Footer.tsx` | Footer global |

**Pattern pro data fetching** (Payload 3 local API):
```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// Fetch pillar page
const page = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'mineral-springs' } },
  locale: params.locale,
})

// Fetch articles for a pillar
const articles = await payload.find({
  collection: 'articles',
  where: { parentPillar: { equals: pageId } },
  locale: params.locale,
  sort: '-publishedAt',
})
```

### Fáze 3: Obsah (den 3-7)
Vytvořit v /admin:
1. **6 pillar pages** s hero, TOC, FAQ, Ensana CTA (DE + EN minimálně)
2. **10-15 cluster článků** pod pillar pages
3. **8 kategorií** (viz SQL soubor)
4. **2 autory** (redakce + Ensana expert)
5. **5-10 People Stories** s fotkami
6. **Události** (aktuální sezóna)
7. **Navigaci, Footer, Site Settings**

### Fáze 4: SEO & Launch (den 7-10)
1. Sitemap generování z Payload dat
2. OG images pro každou stránku
3. Robots.txt finalizace
4. Google Search Console ověření
5. GA4 propojení
6. Vlastní doména (marienbad.com)

---

## Jak web funguje (architektura)

```
UŽIVATEL → Vercel CDN → Next.js (ISR) → Payload Local API → Supabase PostgreSQL
                                              ↓
                                        /admin panel
                                     (editor vytváří obsah)
```

### Tok dat:
1. **Editor** přidá/upraví obsah v `/admin` (Payload CMS)
2. **Payload** uloží do Supabase PostgreSQL
3. **Next.js** při požadavku čte přes Payload local API (bez network hop)
4. **ISR** (Incremental Static Regeneration) cache-uje stránky na Vercel CDN
5. **Uživatel** dostane rychlou cached stránku

### Lokalizace:
- URL: `/de/mineralquellen`, `/en/mineral-springs`, `/ru/...`, `/cs/...`
- Obsah: každé textové pole má 4 jazykové verze v DB
- Payload automaticky vrací správnou verzi podle `locale` parametru

### Ensana monetizace:
- CTA boxy na pillar pages a článcích (sidebar/inline/bottom)
- UTM tracking: `?utm_source=marienbad.com&utm_medium=referral&utm_campaign=...`
- Editovatelné z /admin — žádný hardcoded affiliate kód

### Media:
- Upload přes /admin → uloženo na Vercel (nebo S3 v budoucnu)
- 4 velikosti automaticky: thumbnail (400x300), card (768x512), hero (1920x1080), og (1200x630)
