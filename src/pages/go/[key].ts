import type { APIRoute } from 'astro'
import { resolveGoLink } from '@/data/goLinks'
import { isLocale, negotiateLocale } from '@/i18n/negotiate'

export const prerender = false

/**
 * /go/<klíč> — jazykově neutrální zkratka, viz src/data/goLinks.ts.
 *
 * Jazyk: ?lang=cs|de|en|ru má přednost (když chce Duve nebo tištěný QR kód
 * cílit na konkrétní mutaci), jinak Accept-Language jako na kořenové stránce.
 * Neznámý klíč nekončí chybou, ale úvodní stránkou ve správném jazyce —
 * host s telefonem v ruce nemá co dělat s 404.
 *
 * Je to endpoint, ne stránka: vestavěné i18n Astra obaluje stránky bez
 * jazykového prefixu stavem 404 (viz middleware.ts u portálu), endpointů
 * se to netýká. 302 a Vary: Accept-Language, protože stejná adresa vede
 * pro různé hosty jinam a nesmí se cachovat napříč jazyky.
 */
export const GET: APIRoute = ({ params, request, url }) => {
  const forced = url.searchParams.get('lang')
  const locale = isLocale(forced) ? forced : negotiateLocale(request.headers.get('accept-language'))
  const target = resolveGoLink(params.key ?? '', locale) ?? `/${locale}`
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
