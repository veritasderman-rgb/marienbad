import type { Locale } from './config'

const SUPPORTED: readonly Locale[] = ['de', 'en', 'cs', 'ru']

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (SUPPORTED as readonly string[]).includes(value)
}

/**
 * Vybere jazyk webu podle hlavičky Accept-Language: projde jazyky seřazené
 * podle váhy q a vezme první, jehož dvoupísmenný prefix umíme. Když nic
 * nesedí (nebo hlavička chybí), vrátí výchozí jazyk webu — němčinu, protože
 * německy mluvící hosté jsou hlavní publikum.
 *
 * Používá kořenová stránka (/) a jazykově neutrální zkratky (/go/…), aby obě
 * rozhodovaly stejně.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined, fallback: Locale = 'de'): Locale {
  if (!acceptLanguage) return fallback
  const langs = acceptLanguage
    .split(',')
    .map((part) => {
      // Gramatika hlavičky dovoluje mezery kolem středníku i rovnítka
      // ("en; q=0"), proto se parametry berou po rozdělení středníkem,
      // ne hledáním doslovného ";q=".
      const [lang, ...params] = part.split(';').map((s) => s.trim())
      const qParam = params.find((p) => /^q\s*=/i.test(p))
      const weight = qParam ? Number.parseFloat(qParam.split('=')[1]) : 1
      return { lang: lang.toLowerCase(), q: Number.isFinite(weight) ? weight : 0 }
    })
    .filter((entry) => entry.lang && entry.q > 0)
    .sort((a, b) => b.q - a.q)

  for (const { lang } of langs) {
    const prefix = lang.slice(0, 2)
    if (isLocale(prefix)) return prefix
  }
  return fallback
}
