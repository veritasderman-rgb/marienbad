import { describe, expect, it } from 'vitest'
import {
  buildPartnerListWhere,
  escapeLike,
  isUuid,
  isValidIco,
  normalizeEmail,
  normalizeWebsite,
  parseContactInput,
  parseInteractionInput,
  parsePartnerInput,
  parsePartnerListQuery,
} from '../src/lib/portal/crm/partners'

/** Fixtury jsou fiktivní firmy — repozitář je veřejný. */
const ALFA = 'CK Alfa a.s.'
const BETA = 'Beta Reisen GmbH'

const UUID = '3f1a2b4c-5d6e-4f70-8901-23456789abcd'

function values(result: ReturnType<typeof parsePartnerInput>): Record<string, unknown> {
  if (!result.ok) throw new Error(`očekáván úspěch, přišlo ${result.message}`)
  return result.values
}

describe('isValidIco', () => {
  it('přijme platná IČO včetně kontrolní číslice', () => {
    for (const ico of ['00177041', '60192755', '03104681']) {
      expect(isValidIco(ico)).toBe(true)
    }
  })

  it('odmítne špatnou kontrolní číslici', () => {
    expect(isValidIco('12345678')).toBe(false)
    expect(isValidIco('00177040')).toBe(false)
    expect(isValidIco('60192756')).toBe(false)
  })

  it('odmítne špatnou délku a nečíselné znaky', () => {
    expect(isValidIco('0017704')).toBe(false)
    expect(isValidIco('001770411')).toBe(false)
    expect(isValidIco('abcdefgh')).toBe(false)
    expect(isValidIco('')).toBe(false)
    expect(isValidIco(' 00177041')).toBe(false)
  })

  it('nespoléhá na typ vstupu za běhu', () => {
    expect(isValidIco(177041 as unknown as string)).toBe(false)
    expect(isValidIco(null as unknown as string)).toBe(false)
  })
})

describe('escapeLike', () => {
  it('escapuje zástupné znaky ILIKE', () => {
    expect(escapeLike('100%')).toBe('100\\%')
    expect(escapeLike('a_b')).toBe('a\\_b')
    expect(escapeLike('c:\\tmp')).toBe('c:\\\\tmp')
    expect(escapeLike(ALFA)).toBe(ALFA)
  })
})

describe('normalizeEmail / normalizeWebsite / isUuid', () => {
  it('e-mail se normalizuje na malá písmena', () => {
    expect(normalizeEmail('  Info@Beta-Reisen.example ')).toBe('info@beta-reisen.example')
    expect(normalizeEmail('bez-zavinace')).toBeNull()
    expect(normalizeEmail('a@b')).toBeNull()
  })

  it('web dostane schéma a odmítne jiné protokoly', () => {
    expect(normalizeWebsite('ck-alfa.example')).toBe('https://ck-alfa.example')
    expect(normalizeWebsite('http://ck-alfa.example/kontakt')).toBe('http://ck-alfa.example/kontakt')
    expect(normalizeWebsite('javascript:alert(1)')).toBeNull()
    expect(normalizeWebsite('localhost')).toBeNull()
  })

  it('isUuid pustí jen kanonický tvar', () => {
    expect(isUuid(UUID)).toBe(true)
    expect(isUuid('not-a-uuid')).toBe(false)
    expect(isUuid(undefined)).toBe(false)
  })
})

describe('parsePartnerInput — create', () => {
  it('doplní výchozí hodnoty a ořeže jméno', () => {
    const parsed = values(parsePartnerInput({ name: `  ${ALFA}  ` }, 'create'))
    expect(parsed).toEqual({
      name: ALFA,
      country: 'CZ',
      segment: 'other',
      status: 'prospect',
      languages: [],
    })
  })

  it('vyžaduje jméno', () => {
    expect(parsePartnerInput({}, 'create')).toEqual({ ok: false, message: 'invalid_name' })
    expect(parsePartnerInput({ name: '   ' }, 'create')).toEqual({ ok: false, message: 'invalid_name' })
    expect(parsePartnerInput({ name: 'x'.repeat(301) }, 'create')).toEqual({ ok: false, message: 'invalid_name' })
    expect(parsePartnerInput({ name: 42 }, 'create')).toEqual({ ok: false, message: 'invalid_name' })
  })

  it('odmítne cokoli, co není objekt', () => {
    expect(parsePartnerInput(null, 'create')).toEqual({ ok: false, message: 'bad_request' })
    expect(parsePartnerInput([{ name: ALFA }], 'create')).toEqual({ ok: false, message: 'bad_request' })
    expect(parsePartnerInput('name=alfa', 'create')).toEqual({ ok: false, message: 'bad_request' })
  })

  it('ignoruje neznámá pole', () => {
    const parsed = values(parsePartnerInput({ name: ALFA, id: 'x', created_at: 'y', role: 'owner' }, 'create'))
    expect(Object.keys(parsed).sort()).toEqual(['country', 'languages', 'name', 'segment', 'status'])
  })

  it('validuje výčty, ISO-2 zemi a jazyky', () => {
    const parsed = values(
      parsePartnerInput(
        {
          name: BETA,
          country: 'de',
          segment: 'tour_operator',
          tier: 'A',
          status: 'active',
          languages: ['de', 'DE', 'en'],
          owner_user_id: UUID,
        },
        'create',
      ),
    )
    expect(parsed.country).toBe('DE')
    expect(parsed.segment).toBe('tour_operator')
    expect(parsed.languages).toEqual(['de', 'en'])
    expect(parsed.owner_user_id).toBe(UUID)

    expect(parsePartnerInput({ name: ALFA, segment: 'hotel' }, 'create')).toEqual({ ok: false, message: 'invalid_segment' })
    expect(parsePartnerInput({ name: ALFA, status: 'deleted' }, 'create')).toEqual({ ok: false, message: 'invalid_status' })
    expect(parsePartnerInput({ name: ALFA, tier: 'D' }, 'create')).toEqual({ ok: false, message: 'invalid_tier' })
    expect(parsePartnerInput({ name: ALFA, country: 'CZE' }, 'create')).toEqual({ ok: false, message: 'invalid_country' })
    expect(parsePartnerInput({ name: ALFA, languages: ['sk'] }, 'create')).toEqual({ ok: false, message: 'invalid_languages' })
    expect(parsePartnerInput({ name: ALFA, owner_user_id: 'abc' }, 'create')).toEqual({ ok: false, message: 'invalid_owner_user_id' })
  })

  it('IČO prochází validací kontrolní číslice', () => {
    expect(values(parsePartnerInput({ name: ALFA, ico: '00177041' }, 'create')).ico).toBe('00177041')
    expect(values(parsePartnerInput({ name: ALFA, ico: '' }, 'create')).ico).toBeNull()
    expect(parsePartnerInput({ name: ALFA, ico: '12345678' }, 'create')).toEqual({ ok: false, message: 'invalid_ico' })
  })

  it('web se normalizuje, nesmysl se odmítne', () => {
    expect(values(parsePartnerInput({ name: ALFA, website: 'ck-alfa.example' }, 'create')).website).toBe(
      'https://ck-alfa.example',
    )
    expect(parsePartnerInput({ name: ALFA, website: 'javascript:alert(1)' }, 'create')).toEqual({
      ok: false,
      message: 'invalid_website',
    })
  })
})

describe('parsePartnerInput — patch', () => {
  it('vrací jen poslaná pole a nedoplňuje výchozí hodnoty', () => {
    const parsed = values(parsePartnerInput({ city: 'Mariánské Lázně' }, 'patch'))
    expect(parsed).toEqual({ city: 'Mariánské Lázně' })
  })

  it('prázdný objekt je platný (žádná změna)', () => {
    expect(values(parsePartnerInput({}, 'patch'))).toEqual({})
  })

  it('null i prázdný řetězec pole vyprázdní', () => {
    expect(values(parsePartnerInput({ notes: null, dic: '' }, 'patch'))).toEqual({ notes: null, dic: null })
  })

  it('jméno poslané v patchi nesmí být prázdné', () => {
    expect(parsePartnerInput({ name: '' }, 'patch')).toEqual({ ok: false, message: 'invalid_name' })
  })
})

describe('parseContactInput', () => {
  it('create doplní prázdná jména a newsletter false', () => {
    const parsed = parseContactInput({}, 'create')
    expect(parsed.ok && parsed.values).toEqual({
      first_name: '',
      last_name: '',
      newsletter_opt_in: false,
    })
  })

  it('normalizuje e-mail a hlídá telefon', () => {
    const parsed = parseContactInput({ email: ' Info@CK-Alfa.example ', phone: '+420 601 234 456' }, 'patch')
    expect(parsed.ok && parsed.values.email).toBe('info@ck-alfa.example')
    expect(parseContactInput({ email: 'nesmysl' }, 'patch')).toEqual({ ok: false, message: 'invalid_email' })
    expect(parseContactInput({ phone: 'zavolejte mi' }, 'patch')).toEqual({ ok: false, message: 'invalid_phone' })
  })

  it('validuje právní základ, souhlas a datum', () => {
    const parsed = parseContactInput(
      { lawful_basis: 'consent', consent_basis: 'business_card', opt_in_at: '2026-03-04', is_primary: true },
      'patch',
    )
    expect(parsed.ok && parsed.values.opt_in_at).toBe('2026-03-04')
    // formulář posílá celé ISO razítko — pro date sloupec se ořízne na den
    const fromIso = parseContactInput({ opt_in_at: '2026-03-04T09:12:33.000Z' }, 'patch')
    expect(fromIso.ok && fromIso.values.opt_in_at).toBe('2026-03-04')
    expect(parsed.ok && parsed.values.is_primary).toBe(true)
    expect(parseContactInput({ lawful_basis: 'protoze' }, 'patch')).toEqual({ ok: false, message: 'invalid_lawful_basis' })
    expect(parseContactInput({ consent_basis: 'nevim' }, 'patch')).toEqual({ ok: false, message: 'invalid_consent_basis' })
    expect(parseContactInput({ opt_in_at: '4. 3. 2026' }, 'patch')).toEqual({ ok: false, message: 'invalid_opt_in_at' })
    expect(parseContactInput({ is_primary: 'ano' }, 'patch')).toEqual({ ok: false, message: 'invalid_is_primary' })
  })

  it('ignoruje neznámá i needitovatelná pole', () => {
    const parsed = parseContactInput({ id: UUID, partner_id: UUID, anonymized_at: 'x', position: 'sales' }, 'patch')
    expect(parsed.ok && parsed.values).toEqual({ position: 'sales' })
  })
})

describe('parseInteractionInput', () => {
  it('vyžaduje typ a předmět, doplní occurred_at', () => {
    const parsed = parseInteractionInput({ type: 'call', subject: 'Nabídka pro jaro 2027' })
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.values.type).toBe('call')
    expect(parsed.values.contact_id).toBeNull()
    expect(typeof parsed.values.occurred_at).toBe('string')
    expect(Number.isNaN(Date.parse(String(parsed.values.occurred_at)))).toBe(false)
  })

  it('normalizuje occurred_at na ISO', () => {
    const parsed = parseInteractionInput({
      type: 'meeting',
      subject: 'Schůzka na veletrhu',
      occurred_at: '2026-03-04T10:00:00.000Z',
    })
    expect(parsed.ok && parsed.values.occurred_at).toBe('2026-03-04T10:00:00.000Z')
  })

  it('odmítne neznámý typ, prázdný předmět a špatné datum', () => {
    expect(parseInteractionInput({ type: 'sms', subject: 'x' })).toEqual({ ok: false, message: 'invalid_type' })
    expect(parseInteractionInput({ type: 'note', subject: '  ' })).toEqual({ ok: false, message: 'invalid_subject' })
    expect(parseInteractionInput({ type: 'note', subject: 'x', occurred_at: 'včera' })).toEqual({
      ok: false,
      message: 'invalid_occurred_at',
    })
    expect(parseInteractionInput({ type: 'note', subject: 'x', contact_id: '1' })).toEqual({
      ok: false,
      message: 'invalid_contact_id',
    })
  })
})

describe('parsePartnerListQuery', () => {
  it('výchozí hodnoty', () => {
    const parsed = parsePartnerListQuery(new URLSearchParams())
    expect(parsed.ok && parsed.values).toEqual({
      q: null,
      segment: null,
      status: null,
      tier: null,
      country: null,
      page: 1,
      sort: 'updated_at',
      dir: 'desc',
    })
  })

  it('řazení jen z whitelistu', () => {
    expect(parsePartnerListQuery(new URLSearchParams('sort=name&dir=asc'))).toMatchObject({ ok: true })
    expect(parsePartnerListQuery(new URLSearchParams('sort=notes'))).toEqual({ ok: false, message: 'invalid_sort' })
    expect(parsePartnerListQuery(new URLSearchParams('sort=name;DROP'))).toEqual({ ok: false, message: 'invalid_sort' })
    expect(parsePartnerListQuery(new URLSearchParams('dir=asc--'))).toEqual({ ok: false, message: 'invalid_dir' })
  })

  it('stránka nikdy neklesne pod 1', () => {
    for (const query of ['page=0', 'page=-3', 'page=abc']) {
      const parsed = parsePartnerListQuery(new URLSearchParams(query))
      expect(parsed.ok && parsed.values.page).toBe(1)
    }
    expect(parsePartnerListQuery(new URLSearchParams('page=3.7'))).toMatchObject({ ok: true, values: { page: 3 } })
  })

  it('validuje filtry výčtů a zemi', () => {
    expect(parsePartnerListQuery(new URLSearchParams('segment=hotel'))).toEqual({ ok: false, message: 'invalid_segment' })
    expect(parsePartnerListQuery(new URLSearchParams('country=cz'))).toMatchObject({ values: { country: 'CZ' } })
    expect(parsePartnerListQuery(new URLSearchParams('country=czech'))).toEqual({ ok: false, message: 'invalid_country' })
  })
})

describe('buildPartnerListWhere', () => {
  const base = {
    q: null,
    segment: null,
    status: null,
    tier: null,
    country: null,
    page: 1,
    sort: 'updated_at',
    dir: 'desc',
  } as const

  it('bez filtrů nevrací WHERE', () => {
    expect(buildPartnerListWhere({ ...base })).toEqual({ where: '', params: [] })
  })

  it('hledání jde jako parametr a escapuje zástupné znaky', () => {
    const { where, params } = buildPartnerListWhere({ ...base, q: '100%_alfa' })
    expect(where).toContain('ILIKE $1')
    expect(where).toContain('p.legal_name')
    expect(params).toEqual(['%100\\%\\_alfa%'])
  })

  it('osmiciferný dotaz hledá i přesné IČO', () => {
    const { where, params } = buildPartnerListWhere({ ...base, q: '00177041' })
    expect(where).toContain('p.ico = $2')
    expect(params).toEqual(['%00177041%', '00177041'])
  })

  it('do SQL se nikdy nedostane hodnota filtru', () => {
    const { where, params } = buildPartnerListWhere({
      ...base,
      segment: 'corporate',
      status: 'active',
      tier: 'B',
      country: 'DE',
    })
    expect(where).toBe('WHERE p.segment = $1 AND p.status = $2 AND p.tier = $3 AND p.country = $4')
    expect(params).toEqual(['corporate', 'active', 'B', 'DE'])
  })
})
