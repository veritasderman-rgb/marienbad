export const locales = ['de', 'en', 'ru', 'cs'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'de'

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  ru: 'Русский',
  cs: 'Česky',
}

export const localeFlags: Record<Locale, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
  ru: '🇷🇺',
  cs: '🇨🇿',
}

// Only DE and EN for launch phase, RU and CS prepared for phase 2
export const activeLocales: Locale[] = ['de', 'en']
