export function withUtm(url: string, source: string = 'marienbad', medium: string = 'website', campaign: string = 'hotel-booking'): string {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`
}
