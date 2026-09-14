import type { Locale } from '@/i18n/config'
import { routes } from '@/i18n/config'

/**
 * Úhrada lázeňské léčby pro hosty ze zahraničí.
 *
 * Existuje jen pro de, en a ru. Český pacient má celou sekci `insurance-spa`,
 * kde je totéž podrobněji a podle českého indikačního seznamu.
 *
 * Obsah je právní, ne lékařský: odkazuje na konkrétní paragrafy a nařízení.
 * Každé tvrzení o nároku musí mít v `sources` odkaz na primární zdroj — text
 * zákona, nařízení nebo stránku instituce, která o nároku rozhoduje. Bez toho
 * se tvrzení nepíše; platí tu stejná přísnost jako u zdravotních tvrzení.
 */

export type FundingLocale = Extract<Locale, 'de' | 'en' | 'ru'>

export const fundingLocales: FundingLocale[] = ['de', 'en', 'ru']

export interface FundingSource {
  title: string
  url: string
  note?: string
}

/** Jedna cesta k úhradě: kdo ji může využít, co pokrývá, co pro ni musí udělat. */
export interface FundingRoute {
  /** Název cesty, např. „Ambulante Vorsorgeleistung nach § 23 SGB V“. */
  name: string
  /** Komu je určená. */
  who: string
  /** Co hradí a co ne. Konkrétně, bez slibů. */
  covers: string
  /** Kroky, které musí host udělat, v pořadí. */
  steps: string[]
  /** Právní opora — paragraf, nařízení nebo instituce. */
  basis: string
}

export interface FundingContent {
  navLabel: string
  title: string
  h1: string
  metaTitle: string
  metaDescription: string
  lead: string
  /** Krátká přímá odpověď hned pod nadpisem. Právě tuhle pasáž cituje AI. */
  shortAnswer: string
  routesHeading: string
  routes: FundingRoute[]
  /** Co si host platí sám vždy, bez ohledu na cestu. */
  selfPayHeading: string
  selfPayBody: string
  /** Věta, že konečné rozhodnutí je na plátci, ne na lázních. */
  disclaimer: string
  faqs: { question: string; answer: string }[]
  sources: FundingSource[]
  related: { label: string; href: string }[]
  /** Datum poslední revize právního obsahu (ISO). */
  reviewDate: string
}

export function fundingHref(locale: FundingLocale): string {
  return `/${locale}/${routes.funding[locale]}`
}

export function fundingAlternates(): Partial<Record<Locale, string>> {
  return Object.fromEntries(fundingLocales.map((l) => [l, fundingHref(l)]))
}

export const funding: Partial<Record<FundingLocale, FundingContent>> = {}
