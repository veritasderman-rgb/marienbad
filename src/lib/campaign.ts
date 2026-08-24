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
