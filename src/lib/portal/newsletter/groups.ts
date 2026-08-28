/**
 * Tvrdý allowlist MailerLite skupin (audit N-07, NAVRH 5.7).
 *
 * Účet je sdílený s B2C kvízem — odesílací cesta portálu proto FYZICKY neumí
 * poslat kampaň mimo tyto skupiny (kontrola na ID, ne na název). Nikdy se
 * neposílá „všem odběratelům". ID ověřena čtením přes MailerLite API
 * 28. 8. 2026; ID skupin nejsou tajemství, jen adresy.
 *
 * Členství ve skupinách spravuje výhradně noční sync z CRM. Ruční zásah
 * v MailerLite se při dalším syncu přepíše.
 */

export type NewsletterAudience = 'partners' | 'leads'
export type NewsletterLocale = 'de' | 'en' | 'cs'

export interface B2BGroup {
  id: string
  name: string
  audience: NewsletterAudience
  locale: NewsletterLocale
}

export const B2B_GROUPS: readonly B2BGroup[] = [
  { id: '197033946652869789', name: 'B2B · Partneři · DE', audience: 'partners', locale: 'de' },
  { id: '197033948698642001', name: 'B2B · Partneři · EN', audience: 'partners', locale: 'en' },
  { id: '197033950789502463', name: 'B2B · Partneři · CS', audience: 'partners', locale: 'cs' },
  { id: '197033953154041613', name: 'B2B · Vizitky · DE',  audience: 'leads',    locale: 'de' },
  { id: '197033955515434005', name: 'B2B · Vizitky · EN',  audience: 'leads',    locale: 'en' },
  { id: '197033957769872542', name: 'B2B · Vizitky · CS',  audience: 'leads',    locale: 'cs' },
] as const

const ALLOWED_IDS: ReadonlySet<string> = new Set(B2B_GROUPS.map((g) => g.id))

export function isAllowedGroupId(id: string): boolean {
  return ALLOWED_IDS.has(id)
}

/** Vyhodí, pokud JAKÉKOLI ID není na allowlistu — kampaň se nesmí založit. */
export function assertAllowedGroups(ids: readonly string[]): void {
  if (ids.length === 0) {
    throw new Error('Kampaň bez explicitních skupin (= všem odběratelům) je zakázaná.')
  }
  for (const id of ids) {
    if (!ALLOWED_IDS.has(id)) {
      throw new Error(`Skupina ${id} není na allowlistu B2B skupin — odeslání zamítnuto.`)
    }
  }
}

export function groupFor(audience: NewsletterAudience, locale: NewsletterLocale): B2BGroup {
  const group = B2B_GROUPS.find((g) => g.audience === audience && g.locale === locale)
  if (!group) throw new Error(`Neznámá kombinace publika a jazyka: ${audience}/${locale}`)
  return group
}

/**
 * Jazyk rozesílky kontaktu: primárně languages[] partnera, jinak odvození
 * ze země (DE/AT/CH → de, CZ/SK → cs, jinak en) — NAVRH 5.7: jazyk ≠ země,
 * pole jazyka má přednost.
 */
export function resolveLocale(partnerLanguages: string[], country: string): NewsletterLocale {
  const first = partnerLanguages.find((l) => l === 'de' || l === 'en' || l === 'cs')
  if (first) return first as NewsletterLocale
  if (country === 'DE' || country === 'AT' || country === 'CH') return 'de'
  if (country === 'CZ' || country === 'SK') return 'cs'
  return 'en'
}
