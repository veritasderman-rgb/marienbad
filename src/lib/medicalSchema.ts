import type { Locale } from '@/i18n/config'

/**
 * Schema.org pro zdravotní obsah.
 *
 * Proč to existuje: AI asistenti čerpají odpovědi na dotazy typu „kam na lázně
 * s artrózou“ z typů `MedicalWebPage`, `MedicalCondition` a `MedicalTherapy`.
 * Dosud web emitoval jen `TouristDestination` a `LodgingBusiness`, tedy typy
 * turistické, ne zdravotní.
 *
 * `reviewedBy` se emituje jen tehdy, když je znám jmenovitý lékař. Bez jména
 * by šlo o prázdné tvrzení o odbornosti, proto se pole vynechá a zůstane jen
 * `lastReviewed`.
 */

const SITE = (import.meta.env.SITE ?? 'https://marienbad.com').replace(/\/$/, '')

export const inLanguage: Record<Locale, string> = {
  de: 'de-DE',
  en: 'en-GB',
  cs: 'cs-CZ',
  ru: 'ru-RU',
}

/** Jmenovitý odborný garant. Vyplní se, až Ensana nominuje lékaře. */
export interface MedicalReviewer {
  /** Jméno včetně titulů, jak je lékař uvádí. */
  name: string
  /** Např. „balneolog“, „Fachärztin für Physikalische Medizin“. */
  jobTitle?: string
  /** Odbornost pro `medicalSpecialty`, anglicky podle schema.org. */
  specialty?: string
  /** Profilová stránka na webu, pokud existuje. */
  url?: string
}

export interface MedicalPageInput {
  locale: Locale
  /** Absolutní cesta stránky včetně jazykového prefixu, bez domény. */
  path: string
  name: string
  description: string
  /** Anglický název stavu — drží se jednotný napříč jazyky kvůli propojení entit. */
  conditionName: string
  icd10?: string
  /** Názvy procedur v jazyce stránky. */
  therapies?: string[]
  /** ISO datum poslední odborné revize. */
  lastReviewed: string
  reviewer?: MedicalReviewer
}

function physician(reviewer: MedicalReviewer): Record<string, unknown> {
  return {
    '@type': 'Physician',
    name: reviewer.name,
    ...(reviewer.jobTitle ? { jobTitle: reviewer.jobTitle } : {}),
    ...(reviewer.specialty ? { medicalSpecialty: reviewer.specialty } : {}),
    ...(reviewer.url ? { url: `${SITE}${reviewer.url}` } : {}),
  }
}

/**
 * `MedicalWebPage` pro stránku o jedné diagnóze. Vrací pole, aby se dalo rovnou
 * předat do `schema` propu v Base.astro.
 */
export function medicalWebPage(input: MedicalPageInput): Record<string, unknown>[] {
  const condition: Record<string, unknown> = {
    '@type': 'MedicalCondition',
    name: input.conditionName,
    ...(input.icd10 ? { code: { '@type': 'MedicalCode', code: input.icd10, codingSystem: 'ICD-10' } } : {}),
    ...(input.therapies?.length
      ? {
          possibleTreatment: input.therapies.map((name) => ({
            '@type': 'MedicalTherapy',
            name,
          })),
        }
      : {}),
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      '@id': `${SITE}${input.path}#medical`,
      url: `${SITE}${input.path}`,
      name: input.name,
      description: input.description,
      inLanguage: inLanguage[input.locale],
      // Stránka popisuje léčbu a možnosti, ne diagnostiku ani dávkování.
      medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
      lastReviewed: input.lastReviewed,
      about: condition,
      ...(input.reviewer ? { reviewedBy: physician(input.reviewer) } : {}),
      isPartOf: { '@id': `${SITE}/#website` },
    },
  ]
}

/** `MedicalTherapy` pro pilířové stránky procedur (CO₂, peloidy, klimatoterapie). */
export function medicalTherapyPage(input: {
  locale: Locale
  path: string
  name: string
  description: string
  /** Anglické názvy stavů, na které se procedura používá. */
  indications: string[]
  lastReviewed?: string
  reviewer?: MedicalReviewer
}): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      '@id': `${SITE}${input.path}#medical`,
      url: `${SITE}${input.path}`,
      name: input.name,
      description: input.description,
      inLanguage: inLanguage[input.locale],
      medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
      ...(input.lastReviewed ? { lastReviewed: input.lastReviewed } : {}),
      ...(input.reviewer ? { reviewedBy: physician(input.reviewer) } : {}),
      about: {
        '@type': 'MedicalTherapy',
        name: input.name,
        indication: input.indications.map((name) => ({ '@type': 'MedicalIndication', name })),
      },
    },
  ]
}
