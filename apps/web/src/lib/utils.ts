import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Build Ensana URL with UTM parameters
 */
export function buildEnsanaUrl(
  url: string,
  campaign: string,
  content?: string
): string {
  const baseUrl = url.includes('?') ? url + '&' : url + '?'
  const params = new URLSearchParams({
    utm_source: 'marienbad.com',
    utm_medium: 'referral',
    utm_campaign: campaign,
    ...(content ? { utm_content: content } : {}),
  })
  return baseUrl + params.toString()
}

/**
 * Estimate reading time for an article
 */
export function estimateReadTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

/**
 * Format date based on locale
 */
export function formatDate(date: string | Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}
