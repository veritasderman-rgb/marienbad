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
  accommodation: { de: 'unterkunft', en: 'accommodation', cs: 'ubytovani', ru: 'prozhivanie' },
  history: { de: 'geschichte', en: 'history', cs: 'historie', ru: 'istoriya' },
  'practical-info': { de: 'praktische-infos', en: 'practical-info', cs: 'prakticke-informace', ru: 'prakticheskaya-informaciya' },
  people: { de: 'menschen', en: 'people', cs: 'lide', ru: 'lyudi' },
  magazine: { de: 'magazin', en: 'magazine', cs: 'magazin', ru: 'zhurnal' },
  podcast: { cs: 'podcast' },
} as const satisfies Record<string, Partial<Record<Locale, string>>>

export type SectionKey = keyof typeof routes
