import type { Locale } from '@/i18n/config'

/**
 * Odkazy na web provozovatele.
 *
 * Cesta k destinaci je na ensanahotels.com jiná v každém jazyce a jazykové
 * segmenty se neshodují s našimi: němčina má „destinationen/tschechien",
 * ruština „napravleniya/cheshskaya-respublika", a obě používají tvar
 * „marienbad", ne „marianske-lazne". Skládat adresu z českého tvaru pro
 * všechny jazyky vede na 404 — dřív se to takhle dělalo v patičce a
 * rezervační odkaz byl rozbitý v němčině, angličtině i ruštině.
 *
 * Cesty odpovídají hodnotám `hreflang` na stránce destinace; při změně
 * je třeba je ověřit tamtéž, ne odhadovat.
 */
const DESTINATION_PATHS: Record<Locale, string> = {
  cs: 'cs/destinace/ceska-republika/marianske-lazne',
  de: 'de/destinationen/tschechien/marienbad',
  en: 'en/destinations/czech-republic/marianske-lazne',
  ru: 'ru/napravleniya/cheshskaya-respublika/marienbad',
}

/** Stránka destinace Mariánské Lázně na webu provozovatele, v jazyce hosta. */
export function ensanaDestinationUrl(locale: Locale, utm?: { medium: string; campaign: string }): string {
  const base = `https://ensanahotels.com/${DESTINATION_PATHS[locale]}`
  if (!utm) return base
  return `${base}?utm_source=marienbad&utm_medium=${utm.medium}&utm_campaign=${utm.campaign}`
}
