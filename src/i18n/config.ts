export const locales = ['de', 'en', 'cs', 'ru'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'de'

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  cs: 'Čeština',
  ru: 'Русский',
}

/** Canonical section key → localized slug per locale */
export const routes = {
  'mineral-springs': { de: 'mineralquellen', en: 'mineral-springs', cs: 'mineralni-prameny', ru: 'mineralnye-istochniki' },
  'things-to-do': { de: 'aktivitaeten', en: 'things-to-do', cs: 'co-delat', ru: 'chem-zanyatsya' },
  'day-trips': { de: 'ausfluege', en: 'day-trips', cs: 'vylety', ru: 'ekskursii' },
  golf: { de: 'golf', en: 'golf', cs: 'golf', ru: 'golf' },
  culture: { de: 'kultur', en: 'culture', cs: 'kultura', ru: 'kultura' },
  nature: { de: 'natur', en: 'nature', cs: 'priroda', ru: 'priroda' },
  accommodation: { de: 'unterkunft', en: 'accommodation', cs: 'ubytovani', ru: 'prozhivanie' },
  history: { de: 'geschichte', en: 'history', cs: 'historie', ru: 'istoriya' },
  'practical-info': { de: 'praktische-infos', en: 'practical-info', cs: 'prakticke-informace', ru: 'prakticheskaya-informaciya' },
  people: { de: 'menschen', en: 'people', cs: 'lide', ru: 'lyudi' },
  magazine: { de: 'magazin', en: 'magazine', cs: 'magazin', ru: 'zhurnal' },
  podcast: { cs: 'podcast' },
  quiz: { de: 'quiz', en: 'quiz', cs: 'kviz', ru: 'viktorina' },
} as const satisfies Record<string, Partial<Record<Locale, string>>>

export type SectionKey = keyof typeof routes

/** Localized URL suffix of the quiz competition-terms page: /{locale}/{quiz}/{slug}/{termsSlug} */
export const quizTermsSlugs: Record<Locale, string> = {
  de: 'teilnahmebedingungen',
  en: 'terms',
  cs: 'pravidla',
  ru: 'pravila',
}

/** Localized privacy policy page per locale (used by footer and consent forms) */
export const privacyPaths: Record<Locale, string> = {
  de: '/de/datenschutz',
  en: '/en/privacy',
  cs: '/cs/ochrana-soukromi',
  ru: '/ru/politika-konfidencialnosti',
}
