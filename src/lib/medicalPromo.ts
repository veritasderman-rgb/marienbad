import type { MedicalPromoData } from '@/lib/campaign'
import type { Locale } from '@/i18n/config'

/** Landing page paths per locale — also the hreflang map for all four pages. */
export const medicalPromoAlternateUrls: Record<Locale, string> = {
  de: '/de/kur-programme-sale-2026',
  en: '/en/medical-promo-2026',
  cs: '/cs/lecebne-programy-sleva-2026',
  ru: '/ru/medical-promo-2026',
}

/**
 * The page is public from the start of the teasing window onwards — that phase is
 * meant to be found. Until then, and for as long as the campaign has not been
 * switched on, it stays out of the index so the finished pages can be reviewed
 * without leaking an unconfirmed offer into search results.
 */
export function medicalPromoNoindex(data: MedicalPromoData, now: Date = new Date()): boolean {
  if (!data.enabled) return true
  return now < new Date(data.teaserStart)
}
