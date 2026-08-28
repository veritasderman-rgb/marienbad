import { describe, expect, it } from 'vitest'
import { B2B_GROUPS, groupFor, isAllowedGroupId } from '../src/lib/portal/newsletter/groups'
import {
  B2B_GROUP_IDS,
  alertBody,
  audienceForStatus,
  b2bGroupsIn,
  describeError,
  emailDomain,
  emptyResult,
  isNotFoundError,
  isRateLimitError,
  planContact,
  planRemoval,
  scrubEmails,
  subscriberFields,
  targetGroupFor,
  type SyncCandidate,
  type SubscriberSnapshot,
} from '../src/lib/portal/newsletter/sync'

/**
 * Testuje se JEN čistá výpočetní část syncu — žádná DB, žádné volání
 * MailerLite. Fixtury jsou fiktivní firmy, repozitář je veřejný.
 */

const PARTNERI_DE = groupFor('partners', 'de').id
const PARTNERI_EN = groupFor('partners', 'en').id
const PARTNERI_CS = groupFor('partners', 'cs').id
const VIZITKY_DE = groupFor('leads', 'de').id
const VIZITKY_CS = groupFor('leads', 'cs').id
/** Skupina B2C kvízu — sync se jí nesmí ani dotknout (audit N-07). */
const KVIZ_B2C = '111111111111111111'

function candidate(overrides: Partial<SyncCandidate> = {}): SyncCandidate {
  return {
    contact_id: '3f1a2b4c-5d6e-4f70-8901-23456789abcd',
    email: 'anna@ck-alfa.example',
    partner_status: 'active',
    partner_segment: 'travel_agency',
    partner_tier: 'A',
    partner_languages: ['de'],
    partner_country: 'DE',
    acquisition_source: 'veletrh:ITB-2026',
    mailerlite_subscriber_id: null,
    ...overrides,
  }
}

function subscriber(overrides: Partial<SubscriberSnapshot> = {}): SubscriberSnapshot {
  return { id: 'sub-1', status: 'active', groupIds: [], ...overrides }
}

describe('cílová skupina kontaktu', () => {
  it('stav partnera určuje publikum: active → partneři, prospect → vizitky', () => {
    expect(audienceForStatus('active')).toBe('partners')
    expect(audienceForStatus('prospect')).toBe('leads')
  })

  it('inactive partner nepatří do žádné skupiny', () => {
    expect(audienceForStatus('inactive')).toBeNull()
    expect(targetGroupFor(candidate({ partner_status: 'inactive' }))).toBeNull()
  })

  it('povýšení vizitka → partner je jen změna statusu v CRM (NAVRH 5.7)', () => {
    const lead = candidate({ partner_status: 'prospect' })
    expect(targetGroupFor(lead)?.id).toBe(VIZITKY_DE)
    expect(targetGroupFor({ ...lead, partner_status: 'active' })?.id).toBe(PARTNERI_DE)
  })

  it('jazyk ≠ země: pole languages má přednost před zemí', () => {
    // Švýcarská CK s německou rozesílkou
    expect(targetGroupFor(candidate({ partner_languages: ['de'], partner_country: 'CH' }))?.id).toBe(PARTNERI_DE)
    // Česká firma, která si přeje anglicky
    expect(targetGroupFor(candidate({ partner_languages: ['en'], partner_country: 'CZ' }))?.id).toBe(PARTNERI_EN)
  })

  it('bez jazyka se odvodí ze země, jinak EN', () => {
    expect(targetGroupFor(candidate({ partner_languages: [], partner_country: 'CZ' }))?.id).toBe(PARTNERI_CS)
    expect(targetGroupFor(candidate({ partner_languages: [], partner_country: 'AT' }))?.id).toBe(PARTNERI_DE)
    expect(targetGroupFor(candidate({ partner_languages: [], partner_country: 'IL' }))?.id).toBe(PARTNERI_EN)
  })

  it('cílová skupina je vždy z allowlistu', () => {
    const group = targetGroupFor(candidate())
    expect(group).not.toBeNull()
    expect(isAllowedGroupId(group?.id ?? '')).toBe(true)
    expect(B2B_GROUP_IDS).toHaveLength(B2B_GROUPS.length)
  })
})

describe('pole odběratele', () => {
  it('partner dostane b2b_vztah=partner, prospekt vizitka', () => {
    expect(subscriberFields(candidate(), 'partners').b2b_vztah).toBe('partner')
    expect(subscriberFields(candidate({ partner_status: 'prospect' }), 'leads').b2b_vztah).toBe('vizitka')
  })

  it('chybějící tier a zdroj jsou prázdný řetězec, ne null', () => {
    const fields = subscriberFields(candidate({ partner_tier: null, acquisition_source: null }), 'partners')
    expect(fields.b2b_tier).toBe('')
    expect(fields.b2b_zdroj).toBe('')
    expect(fields.b2b_typ).toBe('travel_agency')
    expect(fields.b2b_crm_id).toBe('3f1a2b4c-5d6e-4f70-8901-23456789abcd')
  })
})

describe('filtr spravovaných skupin', () => {
  it('nechá jen B2B skupiny a odstraní duplicity', () => {
    expect(b2bGroupsIn([PARTNERI_DE, KVIZ_B2C, PARTNERI_DE])).toEqual([PARTNERI_DE])
  })

  it('skupiny B2C kvízu nikdy neprojdou', () => {
    expect(b2bGroupsIn([KVIZ_B2C])).toEqual([])
    expect(planRemoval([KVIZ_B2C, VIZITKY_CS])).toEqual([VIZITKY_CS])
  })
})

describe('plán změn pro jeden kontakt', () => {
  it('nový kontakt bez odběratele: jen zápis do cílové skupiny', () => {
    const plan = planContact(candidate(), null)
    expect(plan).toMatchObject({ kind: 'upsert', groupId: PARTNERI_DE, removeGroupIds: [] })
  })

  it('odhlášený v MailerLite se nepřidává, propíše se zpět do CRM', () => {
    const plan = planContact(candidate(), subscriber({ status: 'unsubscribed', groupIds: [PARTNERI_DE] }))
    expect(plan.kind).toBe('unsubscribed_back')
  })

  it('přesun mezi skupinami odebere starou a ponechá cílovou', () => {
    const promoted = candidate({ partner_status: 'active', mailerlite_subscriber_id: 'sub-1' })
    const plan = planContact(promoted, subscriber({ groupIds: [VIZITKY_DE] }))
    expect(plan).toMatchObject({ kind: 'upsert', groupId: PARTNERI_DE, removeGroupIds: [VIZITKY_DE] })
  })

  it('kontakt už ve správné skupině nemá co odebírat (idempotence)', () => {
    const plan = planContact(candidate(), subscriber({ groupIds: [PARTNERI_DE] }))
    expect(plan).toMatchObject({ kind: 'upsert', groupId: PARTNERI_DE, removeGroupIds: [] })
  })

  it('cizí (B2C) skupiny se do plánu odebrání nikdy nedostanou', () => {
    const plan = planContact(candidate(), subscriber({ groupIds: [PARTNERI_DE, KVIZ_B2C, VIZITKY_CS] }))
    expect(plan.kind).toBe('upsert')
    if (plan.kind !== 'upsert') return
    expect(plan.removeGroupIds).toEqual([VIZITKY_CS])
    expect(plan.removeGroupIds).not.toContain(KVIZ_B2C)
  })

  it('inactive partner: odebrat ze všech B2B skupin, subscribera nemazat', () => {
    const plan = planContact(
      candidate({ partner_status: 'inactive', mailerlite_subscriber_id: 'sub-1' }),
      subscriber({ groupIds: [PARTNERI_DE, KVIZ_B2C] }),
    )
    expect(plan).toMatchObject({ kind: 'remove', subscriberId: 'sub-1', removeGroupIds: [PARTNERI_DE] })
  })

  it('inactive partner bez odběratele v MailerLite: není co odebírat', () => {
    const plan = planContact(candidate({ partner_status: 'inactive' }), null)
    expect(plan).toMatchObject({ kind: 'remove', subscriberId: null, removeGroupIds: [] })
  })

  it('odhlášení má přednost i před odebráním z inactive partnera', () => {
    const plan = planContact(
      candidate({ partner_status: 'inactive' }),
      subscriber({ status: 'unsubscribed', groupIds: [PARTNERI_DE] }),
    )
    expect(plan.kind).toBe('unsubscribed_back')
  })

  it('opakovaný plán nad výsledkem prvního běhu už nic nemění', () => {
    const c = candidate()
    const first = planContact(c, null)
    expect(first.kind).toBe('upsert')
    if (first.kind !== 'upsert') return
    const second = planContact(c, subscriber({ groupIds: [first.groupId] }))
    expect(second).toEqual({ ...first })
  })
})

describe('GDPR v logu: nikdy celý e-mail', () => {
  it('emailDomain vrací jen doménu', () => {
    expect(emailDomain('Anna@CK-Alfa.example')).toBe('ck-alfa.example')
    expect(emailDomain(null)).toBeUndefined()
    expect(emailDomain('bez-zavinace')).toBeUndefined()
  })

  it('scrubEmails uřízne lokální část i uvnitř chybové hlášky API', () => {
    const scrubbed = scrubEmails('MailerLite 422: {"email":"anna@ck-alfa.example"} je duplicitní')
    expect(scrubbed).not.toContain('anna@')
    expect(scrubbed).toContain('…@ck-alfa.example')
  })

  it('describeError hlášku očistí a zkrátí', () => {
    const long = describeError(new Error(`x@ck-alfa.example ${'a'.repeat(500)}`))
    expect(long).not.toContain('x@')
    expect(long.length).toBeLessThanOrEqual(300)
  })

  it('alert obsahuje jen domény', () => {
    const result = emptyResult()
    result.errors.push({ email: 'ck-alfa.example', error: 'MailerLite 500' })
    const body = alertBody(result)
    expect(body).toContain('@ck-alfa.example')
    expect(body).not.toContain('anna@')
  })
})

describe('rozpoznání chyb MailerLite', () => {
  it('429 se pozná podle stavu i podle hlášky', () => {
    expect(isRateLimitError(Object.assign(new Error('x'), { status: 429 }))).toBe(true)
    expect(isRateLimitError(new Error('MailerLite 429: Too Many Attempts'))).toBe(true)
    expect(isRateLimitError(new Error('MailerLite 500: boom'))).toBe(false)
    expect(isRateLimitError(null)).toBe(false)
  })

  it('404 při odebrání ze skupiny znamená „už tam není"', () => {
    expect(isNotFoundError(new Error('MailerLite 404: Not Found'))).toBe(true)
    expect(isNotFoundError(new Error('MailerLite 422: invalid'))).toBe(false)
  })
})
