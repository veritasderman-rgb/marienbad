import { routes, type Locale, type SectionKey } from './config'

/** Get the localized URL for a section */
export function localizedHref(locale: Locale, section: SectionKey): string {
  return `/${locale}/${routes[section][locale]}`
}

/** Get all alternate links for a section (for hreflang tags) */
export function getAlternateLinks(section: SectionKey | 'home'): { locale: Locale; href: string }[] {
  const locales: Locale[] = ['de', 'en', 'cs', 'ru']
  if (section === 'home') {
    return locales.map((l) => ({ locale: l, href: `/${l}` }))
  }
  return locales.map((l) => ({ locale: l, href: `/${l}/${routes[section][l]}` }))
}

/** Navigation items for a given locale */
export function getNavItems(locale: Locale) {
  const sectionKeys: { navKey: string; section: SectionKey }[] = [
    { navKey: 'nav.mineralSprings', section: 'mineral-springs' },
    { navKey: 'nav.thingsToDo', section: 'things-to-do' },
    { navKey: 'nav.accommodation', section: 'accommodation' },
    { navKey: 'nav.history', section: 'history' },
    { navKey: 'nav.practicalInfo', section: 'practical-info' },
    { navKey: 'nav.people', section: 'people' },
    { navKey: 'nav.magazine', section: 'magazine' },
    { navKey: 'nav.podcast', section: 'podcast' },
  ]

  return sectionKeys.map(({ navKey, section }) => ({
    navKey,
    href: `/${locale}/${routes[section][locale]}`,
  }))
}
