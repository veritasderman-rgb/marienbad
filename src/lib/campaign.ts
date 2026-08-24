import type { Locale } from '@/i18n/config'
import campaignDe from '@/content/campaigns/de.json'
import campaignEn from '@/content/campaigns/en.json'
import campaignCs from '@/content/campaigns/cs.json'
import campaignRu from '@/content/campaigns/ru.json'

export interface JubileeData {
  teaserStart: string
  saleStart: string
  saleEnd: string
  eyebrow: string
  headline: string
  teaserText: string
  saleText: string
  discountLabel: string
  ctaLabel: string
  ctaUrl: string
  footnote: string
  image?: string | null
  imageAlt?: string
}

export interface SummerSaleData {
  teaserStart: string
  saleStart: string
  saleEnd: string
  stayPeriod: string
  eyebrow: string
  headline: string
  teaserText: string
  saleText: string
  discountLabel: string
  ctaLabel: string
  ctaUrl: string
  conditions: string[]
  footnote: string
  landingPageTitle: string
  landingPageDescription: string
  landingHeroEyebrow: string
  landingKeyInfoTitle: string
  landingConditionsTitle: string
  landingSalePeriodLabel: string
  landingStayPeriodLabel: string
  landingDiscountLabel: string
  image?: string | null
  imageAlt?: string
  popupImage?: string | null
  popupImageAlt?: string
}

export interface MedicalPromoProgramme {
  name: string
  description: string
}

export interface MedicalPromoLink {
  label: string
  href: string
}

export interface MedicalPromoData {
  /** Master gate for this campaign, independent of `popupEnabled`. While false the popup
   *  never fires and the landing page stays noindex whatever the dates below say, so the
   *  finished campaign can sit in the repo for review until HQ confirms it. */
  enabled: boolean
  teaserStart: string
  saleStart: string
  saleEnd: string
  stayPeriod: string
  eyebrow: string
  headline: string
  teaserText: string
  saleText: string
  discountLabel: string
  /** CTA during the sale window → Ensana promo landing page. */
  ctaLabel: string
  ctaUrl: string
  /** CTA during the teasing window → Ensana countdown page. */
  teaserCtaLabel: string
  teaserCtaUrl: string
  conditions: string[]
  footnote: string
  landingPageTitle: string
  landingPageDescription: string
  landingHeroEyebrow: string
  landingKeyInfoTitle: string
  landingConditionsTitle: string
  landingSalePeriodLabel: string
  landingStayPeriodLabel: string
  landingDiscountLabel: string
  programmesTitle: string
  programmesIntro: string
  programmes: MedicalPromoProgramme[]
  relatedTitle: string
  relatedLinks: MedicalPromoLink[]
  /** Shown on the landing page once the sale window has closed. */
  expiredNotice: string
  expiredCtaLabel: string
  expiredCtaUrl: string
  image?: string | null
  imageAlt?: string
  popupImage?: string | null
  popupImageAlt?: string
}

export interface CampaignData {
  popupEnabled: boolean
  jubilee: JubileeData
  summerSale: SummerSaleData
  medicalPromo: MedicalPromoData
}

const campaigns: Record<Locale, CampaignData> = {
  de: campaignDe as CampaignData,
  en: campaignEn as CampaignData,
  cs: campaignCs as CampaignData,
  ru: campaignRu as CampaignData,
}

export function getCampaign(locale: Locale): CampaignData {
  return campaigns[locale]
}

/**
 * Campaign windows are agreed in the destination's local time, so a bare
 * `YYYY-MM-DD` must be anchored there rather than in UTC (the Vercel server) or
 * in the visitor's zone (the browser). Otherwise the landing page and the popup
 * flip phases hours apart for the same visitor.
 */
export const CAMPAIGN_TIME_ZONE = 'Europe/Prague'

/** How far `timeZone` is ahead of UTC at the given instant, in milliseconds. */
function timeZoneOffsetMs(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs))
  const at = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value)
  // Some engines report midnight as hour 24 rather than 0.
  const asUtc = Date.UTC(at('year'), at('month') - 1, at('day'), at('hour') % 24, at('minute'), at('second'))
  // The formatted parts carry no milliseconds, so compare against the same
  // instant truncated to a whole second or the offset comes out short.
  return asUtc - (utcMs - ((utcMs % 1000) + 1000) % 1000)
}

/** The instant `YYYY-MM-DD` begins in the campaign time zone. */
export function campaignDayStart(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  const guess = Date.UTC(year, month - 1, day)
  return new Date(guess - timeZoneOffsetMs(guess, CAMPAIGN_TIME_ZONE))
}

/**
 * The last instant of `YYYY-MM-DD` in the campaign time zone — defined as the
 * moment before the next day begins, which stays correct across a DST change.
 */
export function campaignDayEnd(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10)
  return new Date(campaignDayStart(nextDay).getTime() - 1)
}

/**
 * Force `utm_medium` on an outbound campaign URL. The stored URL names the
 * destination (countdown page vs. promo page), which depends on the phase; the
 * medium names where the click came from, which depends on the placement. Both
 * surfaces link to the same destinations, so the medium is applied at render
 * time instead of duplicating every URL per placement.
 */
export function withUtmMedium(url: string, medium: 'popup' | 'website'): string {
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('utm_medium', medium)
    return parsed.toString()
  } catch {
    return url
  }
}
