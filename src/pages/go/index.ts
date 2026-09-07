import type { APIRoute } from 'astro'
import { isLocale, negotiateLocale } from '@/i18n/negotiate'

export const prerender = false

/** /go bez klíče vede na úvodní stránku ve správném jazyce. */
export const GET: APIRoute = ({ request, url }) => {
  const forced = url.searchParams.get('lang')
  const locale = isLocale(forced) ? forced : negotiateLocale(request.headers.get('accept-language'))
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/${locale}`,
      Vary: 'Accept-Language',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
