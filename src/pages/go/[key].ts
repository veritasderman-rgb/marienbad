import type { APIRoute } from 'astro'
import { GO_SOURCES, resolveGoLink } from '@/data/goLinks'
import { isLocale, negotiateLocale } from '@/i18n/negotiate'
import { utmToken, withUtm } from '@/lib/utm'

export const prerender = false

/**
 * /go/<klíč> — jazykově neutrální zkratka, viz src/data/goLinks.ts.
 *
 * Jazyk: ?lang=cs|de|en|ru má přednost (když chce Duve nebo tištěný QR kód
 * cílit na konkrétní mutaci), jinak Accept-Language jako na kořenové stránce.
 * Zdroj: ?src=duve|qr|print|… se propíše jako utm_source/utm_medium,
 * volitelné ?c=<kampaň> jako utm_campaign — jinak by tyhle návštěvy skončily
 * v GA4 jako „přímé". Neznámý klíč nekončí chybou, ale úvodní stránkou ve
 * správném jazyce — host s telefonem v ruce nemá co dělat s 404.
 *
 * Je to endpoint, ne stránka: vestavěné i18n Astra obaluje stránky bez
 * jazykového prefixu stavem 404 (viz middleware.ts u portálu), endpointů
 * se to netýká. 302 a Vary: Accept-Language, protože stejná adresa vede
 * pro různé hosty jinam a nesmí se cachovat napříč jazyky.
 */
export function goRedirect(key: string, request: Request, url: URL): Response {
  const forced = url.searchParams.get('lang')
  const locale = isLocale(forced) ? forced : negotiateLocale(request.headers.get('accept-language'))
  let target = resolveGoLink(key, locale) ?? `/${locale}`

  const src = utmToken(url.searchParams.get('src'))
  if (src && GO_SOURCES[src]) {
    target = withUtm(target, {
      source: src,
      medium: GO_SOURCES[src],
      campaign: utmToken(url.searchParams.get('c')) ?? undefined,
      content: key || undefined,
    })
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      Vary: 'Accept-Language',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}

export const GET: APIRoute = ({ params, request, url }) => goRedirect(params.key ?? '', request, url)
