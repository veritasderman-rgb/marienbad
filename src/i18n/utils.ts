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

/** Navigation item types */
export type NavLink = { type: 'link'; navKey: string; href: string }
export type NavDropdown = { type: 'dropdown'; navKey: string; children: NavLink[] }
export type NavItem = NavLink | NavDropdown

/** Flat navigation items for mobile menu */
export function getNavItemsFlat(locale: Locale) {
  const sectionKeys: { navKey: string; section: SectionKey }[] = [
    { navKey: 'nav.mineralSprings', section: 'mineral-springs' },
    { navKey: 'nav.thingsToDo', section: 'things-to-do' },
    { navKey: 'nav.accommodation', section: 'accommodation' },
    { navKey: 'nav.history', section: 'history' },
    { navKey: 'nav.practicalInfo', section: 'practical-info' },
    { navKey: 'nav.people', section: 'people' },
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

  return [
    link('nav.mineralSprings', 'mineral-springs'),
    link('nav.thingsToDo', 'things-to-do'),
    link('nav.accommodation', 'accommodation'),
    {
      type: 'dropdown',
      navKey: 'nav.aboutTown',
      children: [
        link('nav.history', 'history'),
        link('nav.practicalInfo', 'practical-info'),
      ],
    },
    {
      type: 'dropdown',
      navKey: 'nav.stories',
      children: [
        link('nav.magazine', 'magazine'),
        link('nav.people', 'people'),
      ],
    },
  ]
}
