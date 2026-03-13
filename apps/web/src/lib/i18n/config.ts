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

export const activeLocales: Locale[] = ['de', 'en', 'ru', 'cs']
