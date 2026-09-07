import { routes, type Locale, type SectionKey } from '@/i18n/config'

/**
 * Jazykově neutrální zkratky /go/<klíč>.
 *
 * Každá adresa webu má jazyk pevně v cestě (/de/…, /cs/…), takže odkaz
 * vložený do hostovské aplikace (Duve), QR kódu nebo tištěného materiálu
 * zůstane v jednom jazyce. Zkratka /go/<klíč> naopak vybere jazyk podle
 * prohlížeče hosta stejně jako kořenová stránka a přesměruje na správnou
 * mutaci. Jeden odkaz na téma tedy obslouží všechny čtyři jazyky.
 *
 * Cíl je buď klíč sekce z routes (překlad slugu se bere odtud), nebo
 * explicitní cesta pro každý jazyk (články magazínu, sezónní a menší
 * stránky, které v routes nejsou). Klíče jsou anglické a krátké, host je
 * nikdy nevidí — jen na ně klikne.
 */

type LocalizedPaths = Record<Locale, string>

export type GoTarget =
  | { section: SectionKey }
  | { paths: LocalizedPaths }
  | { hotel: string }
  | { article: LocalizedPaths }
  | { season: true }

export const HOTEL_SLUGS = ['nove-lazne', 'centralni-lazne', 'hvezda', 'butterfly', 'pacifik', 'vltava', 'svoboda'] as const

export const GO_LINKS: Record<string, GoTarget> = {
  home: { paths: { cs: '', de: '', en: '', ru: '' } },
  'ensana-life': { section: 'ensana-life' },
  accommodation: { section: 'accommodation' },
  springs: { section: 'springs-overview' },
  'mineral-springs': { section: 'mineral-springs' },
  'drinking-cure': {
    article: {
      cs: 'pitna-kura-pruvodce',
      de: 'trinkkur-ratgeber',
      en: 'drinking-cure-guide',
      ru: 'pitevoj-kurs-putevoditel',
    },
  },
  cure: {
    article: {
      cs: 'klasicka-tritydenni-kura-marianske-lazne',
      de: 'klassische-kur-drei-wochen-marienbad',
      en: 'classic-three-week-cure-marienbad',
      ru: 'klassicheskiy-trekhnedelnyy-kurs-marianskie-lazne',
    },
  },
  'roman-baths': { section: 'roman-baths' },
  co2: { paths: { cs: 'co2-terapie', de: 'co2-therapie', en: 'co2-therapy', ru: 'co2-terapiya' } },
  peloid: { paths: { cs: 'peloidni-terapie', de: 'peloidtherapie', en: 'peloid-therapy', ru: 'peloidnaya-terapiya' } },
  'climate-therapy': { paths: { cs: 'klimatoterapie', de: 'klimatherapie', en: 'climate-therapy', ru: 'klimatoterapiya' } },
  outpatient: { section: 'outpatient' },
  indications: { section: 'indications' },
  colonnade: { paths: { cs: 'kolonada', de: 'kolonnade', en: 'colonnade', ru: 'kolonnada' } },
  'things-to-do': { section: 'things-to-do' },
  trips: { section: 'day-trips' },
  nature: { section: 'nature' },
  golf: { section: 'golf' },
  culture: { section: 'culture' },
  weddings: { section: 'weddings' },
  'corporate-events': { section: 'corporate-events' },
  info: { section: 'practical-info' },
  parking: { section: 'parking' },
  arrival: { paths: { cs: 'jak-se-dostat', de: 'anreise', en: 'getting-there', ru: 'kak-dobratsya' } },
  faq: { paths: { cs: 'faq', de: 'faq', en: 'faq', ru: 'faq' } },
  'best-time': { paths: { cs: 'nejlepsi-cas-navstevy', de: 'beste-reisezeit', en: 'best-time-to-visit', ru: 'luchshee-vremya' } },
  season: { season: true },
  unesco: { paths: { cs: 'unesco', de: 'unesco', en: 'unesco', ru: 'unesco' } },
  history: { section: 'history' },
  magazine: { section: 'magazine' },
  ...Object.fromEntries(HOTEL_SLUGS.map((slug) => [`hotel-${slug}`, { hotel: slug }])),
}

const SEASON_PAGES: Record<'spring' | 'summer' | 'autumn' | 'christmas', LocalizedPaths> = {
  spring: { cs: 'jaro', de: 'fruehling', en: 'spring', ru: 'vesna' },
  summer: { cs: 'leto', de: 'sommer', en: 'summer', ru: 'leto' },
  autumn: { cs: 'podzim', de: 'herbst', en: 'autumn', ru: 'osen' },
  christmas: {
    cs: 'vanoce-a-silvestr',
    de: 'weihnachten-und-silvester',
    en: 'christmas-and-new-year',
    ru: 'rozhdestvo-i-novyj-god',
  },
}

/**
 * Sezónní stránka podle měsíce: březen–květen jaro, červen–srpen léto,
 * září–listopad podzim, prosinec a leden Vánoce a Silvestr. Únor nemá
 * vlastní stránku, tak vede na „nejlepší čas návštěvy".
 */
export function seasonPath(locale: Locale, now: Date = new Date()): string {
  const month = now.getMonth() + 1
  if (month >= 3 && month <= 5) return SEASON_PAGES.spring[locale]
  if (month >= 6 && month <= 8) return SEASON_PAGES.summer[locale]
  if (month >= 9 && month <= 11) return SEASON_PAGES.autumn[locale]
  if (month === 12 || month === 1) return SEASON_PAGES.christmas[locale]
  return (GO_LINKS['best-time'] as { paths: LocalizedPaths }).paths[locale]
}

/** Cílová cesta (bez domény) pro klíč a jazyk; null pro neznámý klíč. */
export function resolveGoLink(key: string, locale: Locale, now: Date = new Date()): string | null {
  const target = GO_LINKS[key]
  if (!target) return null
  if ('section' in target) {
    const slug = (routes[target.section] as Partial<Record<Locale, string>>)[locale]
    return slug ? `/${locale}/${slug}` : `/${locale}`
  }
  if ('hotel' in target) return `/${locale}/hotel/${target.hotel}`
  if ('article' in target) return `/${locale}/${routes.magazine[locale]}/${target.article[locale]}`
  if ('season' in target) return `/${locale}/${seasonPath(locale, now)}`
  const path = target.paths[locale]
  return path ? `/${locale}/${path}` : `/${locale}`
}

export const GO_KEYS = Object.keys(GO_LINKS)
