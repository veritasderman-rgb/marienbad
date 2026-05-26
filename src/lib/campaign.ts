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
}

export interface CampaignData {
  popupEnabled: boolean
  jubilee: JubileeData
  summerSale: SummerSaleData
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
