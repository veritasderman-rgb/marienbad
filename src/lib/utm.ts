/**
 * UTM značkování vlastních odkazů.
 *
 * Polovina návštěv v GA4 je „přímých", protože odkazy z newsletterů, hostovské
 * aplikace, QR kódů a sociálních sítí nenesou žádný zdroj. Tady je jedno místo,
 * které umí přidat utm_* parametry na odkaz vedoucí na marienbad.com /
 * marienbad.cz — a nikdy na cizí web (odkazy na ensanahotels.com mají vlastní
 * značkování v booking.ts).
 *
 * Používá se ze zkratek /go (zdroj z ?src=) a při odesílání newsletteru
 * z portálu (všechny odkazy na web dostanou newsletter/email/<slug>).
 */

export interface UtmParams {
  source: string
  medium: string
  campaign?: string
  content?: string
  term?: string
}

const OWN_HOST = /(^|\.)marienbad\.(com|cz)$/i
const BASE = 'https://marienbad.com'

/** Bezpečný token do URL parametru: malá písmena, číslice, pomlčka, podtržítko; jinak null. */
export function utmToken(value: string | null | undefined, max = 64): string | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  return /^[a-z0-9][a-z0-9_-]*$/.test(v) && v.length <= max ? v : null
}

/**
 * Přidá utm_* k odkazu na vlastní web. Cizí domény, mailto:, tel: a odkazy,
 * které už nějaké utm_* mají, vrací beze změny (ručně označený odkaz má
 * přednost). Relativní odkaz zůstane relativní.
 */
export function withUtm(href: string, utm: UtmParams): string {
  let url: URL
  try {
    url = new URL(href, BASE)
  } catch {
    return href
  }
  if (!/^https?:$/.test(url.protocol) || !OWN_HOST.test(url.hostname)) return href
  for (const key of url.searchParams.keys()) if (key.startsWith('utm_')) return href

  url.searchParams.set('utm_source', utm.source)
  url.searchParams.set('utm_medium', utm.medium)
  if (utm.campaign) url.searchParams.set('utm_campaign', utm.campaign)
  if (utm.content) url.searchParams.set('utm_content', utm.content)
  if (utm.term) url.searchParams.set('utm_term', utm.term)

  const relative = !/^https?:\/\//i.test(href)
  return relative ? `${url.pathname}${url.search}${url.hash}` : url.toString()
}

/**
 * Projde href atributy <a> v HTML a označí odkazy na vlastní web. Počítá
 * s tím, že sanitizace zapsala & jako &amp; — po úpravě ho zase zapíše.
 */
export function tagLinks(html: string, utm: UtmParams): string {
  return html.replace(/(<a\b[^>]*?\bhref=)(["'])([^"']*)\2/gi, (whole, prefix: string, quote: string, raw: string) => {
    const decoded = raw.replace(/&amp;/g, '&')
    const tagged = withUtm(decoded, utm)
    if (tagged === decoded) return whole
    return `${prefix}${quote}${tagged.replace(/&/g, '&amp;')}${quote}`
  })
}
