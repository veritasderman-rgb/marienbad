import type { APIRoute } from 'astro'
import { getQuizAlternatePaths } from '@/content/reader'
import type { Locale } from '@/i18n/config'

/**
 * QR-code campaign entry point: marienbad.com/ensanaleto
 * Redirects to the "Léto s Ensanou" quiz in the language mutation that best
 * matches the visitor's browser language (Accept-Language header).
 *
 * The printed QR code carries this single URL for all languages.
 * (marienbad.cz/ensanaleto can point here via a domain-level redirect.)
 */
const QUIZ_ID = 'ensana-leto'

/** Map a browser language tag to one of the site locales */
function matchLocale(lang: string): Locale | null {
  const primary = lang.toLowerCase().split('-')[0]
  switch (primary) {
    case 'de':
      return 'de'
    case 'cs':
    case 'sk': // Slovak speakers read Czech comfortably
      return 'cs'
    case 'ru':
    case 'uk':
    case 'be':
      return 'ru'
    case 'en':
      return 'en'
    default:
      return null
  }
}

function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return 'en'
  // Parse "cs-CZ,cs;q=0.9,en;q=0.8" into tags ordered by quality
  const tags = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const qParam = params.find((p) => p.trim().startsWith('q='))
      const q = qParam ? parseFloat(qParam.trim().slice(2)) : 1
      return { tag: tag.trim(), q: Number.isFinite(q) ? q : 0 }
    })
    .filter((t) => t.tag && t.q > 0)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of tags) {
    const locale = matchLocale(tag)
    if (locale) return locale
  }
  return 'en'
}

export const GET: APIRoute = ({ request }) => {
  const locale = negotiateLocale(request.headers.get('accept-language'))
  const paths = getQuizAlternatePaths(QUIZ_ID)
  const target = paths[locale] ?? paths.en ?? `/${locale}`
  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      // Language-dependent response — prevent CDN from caching one locale for everyone
      Vary: 'Accept-Language',
      'Cache-Control': 'no-store',
    },
  })
}
