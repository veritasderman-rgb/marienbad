import type { APIRoute } from 'astro'
import { locales, routes, type Locale, type SectionKey } from '@/i18n/config'
import { t } from '@/i18n/ui'
import { getArticles, getStories, getPagesIndex } from '@/content/reader'

interface SearchEntry {
  title: string
  url: string
  excerpt: string
  type: 'article' | 'story' | 'page'
}

/** Slugs that actually have a route file in src/pages/{locale}/{slug}.astro
 *  (generated from the filesystem — CMS pages not listed here are skipped) */
const PAGE_ROUTE_SLUGS: Record<Locale, readonly string[]> = {
  de: ['aktivitaeten', 'anreise', 'architektur', 'ausfluege', 'beruehmte-gaeste', 'beste-reisezeit', 'co2-therapie', 'datenschutz', 'faq', 'geschichte', 'golf', 'impressum', 'klimatherapie', 'kolonnade', 'kultur', 'magazin', 'menschen', 'mineralquellen', 'natur', 'neue-baeder-130-jahre', 'peloidtherapie', 'praktische-infos', 'quellen-uebersicht', 'sommer-sale-2026', 'unesco', 'unterkunft'],
  en: ['accommodation', 'architecture', 'best-time-to-visit', 'climate-therapy', 'co2-therapy', 'colonnade', 'culture', 'day-trips', 'famous-visitors', 'faq', 'getting-there', 'golf', 'history', 'imprint', 'magazine', 'mineral-springs', 'nature', 'neue-baeder-130-years', 'peloid-therapy', 'people', 'practical-info', 'privacy', 'springs-overview', 'summer-sale-2026', 'things-to-do', 'unesco'],
  cs: ['architektura', 'co-delat', 'co2-terapie', 'faq', 'golf', 'historie', 'impressum', 'jak-se-dostat', 'klimatoterapie', 'kolonada', 'kultura', 'letni-sleva-2026', 'lide', 'magazin', 'mineralni-prameny', 'nejlepsi-cas-navstevy', 'nove-lazne-130-let', 'ochrana-soukromi', 'peloidni-terapie', 'podcast', 'prakticke-informace', 'prehled-pramenu', 'priroda', 'slavni-navstevnici', 'ubytovani', 'unesco', 'vylety'],
  ru: ['arkhitektura', 'chem-zanyatsya', 'co2-terapiya', 'ekskursii', 'faq', 'golf', 'impressum', 'istoriya', 'kak-dobratsya', 'klimatoterapiya', 'kolonnada', 'kultura', 'letnyaya-rasprodazha-2026', 'luchshee-vremya', 'lyudi', 'mineralnye-istochniki', 'novye-lazni-130-let', 'obzor-istochnikov', 'peloidnaya-terapiya', 'politika-konfidencialnosti', 'prakticheskaya-informaciya', 'priroda', 'prozhivanie', 'unesco', 'zhurnal', 'znamenitye-gosti'],
}

/** Main section index pages → nav label key in ui.ts */
const SECTION_NAV_KEYS: Partial<Record<SectionKey, string>> = {
  'mineral-springs': 'nav.mineralSprings',
  'things-to-do': 'nav.thingsToDo',
  accommodation: 'nav.accommodation',
  history: 'nav.history',
  'practical-info': 'nav.practicalInfo',
  people: 'nav.people',
  magazine: 'nav.magazine',
  podcast: 'nav.podcast',
}

function stripLocalePrefix(slug: string, locale: Locale): string {
  return slug.startsWith(`${locale}-`) ? slug.slice(locale.length + 1) : slug
}

export const GET: APIRoute = async ({ url }) => {
  const localeParam = url.searchParams.get('locale') ?? 'de'
  if (!(locales as readonly string[]).includes(localeParam)) {
    return new Response(JSON.stringify({ error: 'Invalid locale' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const locale = localeParam as Locale

  const entries = new Map<string, SearchEntry>()
  const add = (entry: SearchEntry) => {
    if (!entries.has(entry.url)) entries.set(entry.url, entry)
  }

  // (a) Magazine articles
  const articles = await getArticles(locale)
  for (const article of articles) {
    add({
      title: article.title,
      url: `/${locale}/${routes.magazine[locale]}/${stripLocalePrefix(article.slug, locale)}`,
      excerpt: article.excerpt,
      type: 'article',
    })
  }

  // (b) People of the Colonnade stories (URLs keep the full slug incl. locale prefix)
  const stories = await getStories(locale)
  for (const story of stories) {
    add({
      title: story.name || story.title,
      url: `/${locale}/${routes.people[locale]}/${story.slug}`,
      excerpt: story.quote,
      type: 'story',
    })
  }

  // (c) CMS pages — only those with a matching route file
  const routableSlugs = new Set<string>(PAGE_ROUTE_SLUGS[locale])
  for (const page of getPagesIndex(locale)) {
    if (!routableSlugs.has(page.slug)) continue
    if (!page.title) continue
    add({
      title: page.title,
      url: `/${locale}/${page.slug}`,
      excerpt: page.metaDescription,
      type: 'page',
    })
  }

  // (d) Main section index pages (skipped when already covered by a CMS page)
  for (const [section, navKey] of Object.entries(SECTION_NAV_KEYS)) {
    const sectionSlug = (routes[section as SectionKey] as Partial<Record<Locale, string>>)[locale]
    if (!sectionSlug) continue
    add({
      title: t(locale, navKey as any),
      url: `/${locale}/${sectionSlug}`,
      excerpt: '',
      type: 'page',
    })
  }

  return new Response(JSON.stringify([...entries.values()]), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
