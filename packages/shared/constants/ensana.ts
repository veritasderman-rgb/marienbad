export const ENSANA_BASE_URL = 'https://www.ensanahotels.com'

export const ENSANA_HOTELS = {
  noveLazne: {
    name: 'Ensana Nové Lázně',
    slug: 'nove-lazne',
    url: `${ENSANA_BASE_URL}/nove-lazne`,
  },
  hvezda: {
    name: 'Ensana Hvězda',
    slug: 'hvezda',
    url: `${ENSANA_BASE_URL}/hvezda`,
  },
  centralni: {
    name: 'Ensana Centrální Lázně',
    slug: 'centralni-lazne',
    url: `${ENSANA_BASE_URL}/centralni-lazne`,
  },
} as const

export const UTM_DEFAULTS = {
  source: 'marienbad.com',
  medium: 'referral',
} as const

export function buildEnsanaUrl(
  hotelUrl: string,
  campaign: string,
  content?: string
): string {
  const params = new URLSearchParams({
    utm_source: UTM_DEFAULTS.source,
    utm_medium: UTM_DEFAULTS.medium,
    utm_campaign: campaign,
  })
  if (content) params.set('utm_content', content)
  const separator = hotelUrl.includes('?') ? '&' : '?'
  return `${hotelUrl}${separator}${params.toString()}`
}
