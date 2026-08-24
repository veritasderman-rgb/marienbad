import { routes, type Locale, type SectionKey } from './config'

const localeMap: Record<Locale, string> = {
  de: 'de-DE',
  en: 'en-GB',
  cs: 'cs-CZ',
  ru: 'ru-RU',
}

/** Format a date string (ISO or Date) into a locale-appropriate long date */
export function formatDate(locale: Locale, date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(localeMap[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/** Get the localized URL for a section. Sections that exist in only some
 *  locales (e.g. the Czech-only insurance section) fall back to that locale's
 *  home page rather than emitting an `/xx/undefined` link. */
export function localizedHref(locale: Locale, section: SectionKey): string {
  const slug = (routes[section] as Partial<Record<Locale, string>>)[locale]
  return slug ? `/${locale}/${slug}` : `/${locale}`
}

/** Get all alternate links for a section (for hreflang tags) */
export function getAlternateLinks(section: SectionKey | 'home'): { locale: Locale; href: string }[] {
  const locales: Locale[] = ['de', 'en', 'cs', 'ru']
  if (section === 'home') {
    return locales.map((l) => ({ locale: l, href: `/${l}` }))
  }
  return locales
    .filter((l) => (routes[section] as Partial<Record<Locale, string>>)[l])
    .map((l) => ({ locale: l, href: `/${l}/${(routes[section] as Record<Locale, string>)[l]}` }))
}

/** Navigation item types */
export type NavLink = { type: 'link'; navKey: string; href: string }
export type NavDropdown = { type: 'dropdown'; navKey: string; children: NavLink[] }
export type NavItem = NavLink | NavDropdown

/** Flat navigation items for mobile menu */
export function getNavItemsFlat(locale: Locale) {
  const sectionKeys: { navKey: string; section: SectionKey }[] = [
    { navKey: 'nav.mineralSprings', section: 'mineral-springs' },
    // Sekce o péči hrazené pojišťovnou existuje jen česky.
    ...(locale === 'cs' ? [{ navKey: 'nav.insuranceSpa', section: 'insurance-spa' as SectionKey }] : []),
    { navKey: 'nav.thingsToDo', section: 'things-to-do' },
    { navKey: 'nav.dayTrips', section: 'day-trips' },
    { navKey: 'nav.accommodation', section: 'accommodation' },
    { navKey: 'nav.history', section: 'history' },
    { navKey: 'nav.practicalInfo', section: 'practical-info' },
    { navKey: 'nav.parking', section: 'parking' },
    { navKey: 'nav.magazine', section: 'magazine' },
  ]

  return sectionKeys.map(({ navKey, section }) => ({
    navKey,
    href: `/${locale}/${routes[section][locale]}`,
  }))
}

/** Structured navigation items for desktop (with dropdowns) */
export function getNavItems(locale: Locale): NavItem[] {
  const link = (navKey: string, section: SectionKey): NavLink => ({
    type: 'link',
    navKey,
    href: `/${locale}/${routes[section][locale]}`,
  })

  // Česká verze má navíc sekci o lázeňské péči hrazené pojišťovnou, takže se
  // z prostého odkazu stává rozbalovací nabídka. Ostatní jazyky ji nemají.
  const mineralSprings: NavItem =
    locale === 'cs'
      ? {
          type: 'dropdown',
          navKey: 'nav.mineralSprings',
          children: [
            link('nav.overview', 'mineral-springs'),
            link('nav.insuranceSpa', 'insurance-spa'),
            link('nav.indications', 'indications'),
          ],
        }
      : link('nav.mineralSprings', 'mineral-springs')

  return [
    mineralSprings,
    {
      type: 'dropdown',
      navKey: 'nav.thingsToDo',
      children: [
        link('nav.overview', 'things-to-do'),
        link('nav.dayTrips', 'day-trips'),
        link('nav.golf', 'golf'),
        link('nav.culture', 'culture'),
        link('nav.nature', 'nature'),
      ],
    },
    link('nav.accommodation', 'accommodation'),
    {
      type: 'dropdown',
      navKey: 'nav.aboutTown',
      children: [
        link('nav.history', 'history'),
        link('nav.practicalInfo', 'practical-info'),
        link('nav.parking', 'parking'),
      ],
    },
    link('nav.magazine', 'magazine'),
  ]
}
