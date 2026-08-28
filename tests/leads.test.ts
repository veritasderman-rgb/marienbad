import { describe, expect, it } from 'vitest'
import {
  emailDomain,
  isConsentBasis,
  isGenericDomain,
  mapRows,
  normalizeCountry,
  normalizeHeader,
  normalizeIco,
  parseDecisions,
  parseMapping,
  parseStoredMapping,
  suggestMapping,
  toHeaderMapping,
  type ColumnMapping,
} from '../src/lib/portal/imports/leads'

/** Fixtury jsou fiktivní firmy — repozitář je veřejný. */
const ALFA = 'CK Alfa a.s.'
const ALFA_EMAIL = 'info@ck-alfa.example'
const UUID = '3f1a2b4c-5d6e-4f70-8901-23456789abcd'

describe('normalizeIco', () => {
  it('doplní vedoucí nuly, které sežral Excel', () => {
    expect(normalizeIco('177041')).toBe('00177041')
    expect(normalizeIco('177041')).toBe('00177041')
  })

  it('přijme už správně zapsané IČO', () => {
    expect(normalizeIco('00177041')).toBe('00177041')
    expect(normalizeIco('60192755')).toBe('60192755')
  })

  it('odmítne IČO se špatnou kontrolní číslicí', () => {
    expect(normalizeIco('12345678')).toBeNull()
    expect(normalizeIco('00177040')).toBeNull()
  })

  it('odstraní mezery a oddělovače, delší vstup odmítne', () => {
    expect(normalizeIco(' 001 770 41 ')).toBe('00177041')
    expect(normalizeIco('CZ00177041')).toBe('00177041')
    expect(normalizeIco('123456789')).toBeNull()
  })

  it('prázdný a neřetězcový vstup vrací null', () => {
    expect(normalizeIco('')).toBeNull()
    expect(normalizeIco('   ')).toBeNull()
    expect(normalizeIco(null)).toBeNull()
    expect(normalizeIco(undefined)).toBeNull()
    expect(normalizeIco(177041 as unknown as string)).toBeNull()
  })
})

describe('normalizeHeader', () => {
  it('srovná diakritiku, velikost písmen i oddělovače', () => {
    expect(normalizeHeader('IČO')).toBe('ico')
    expect(normalizeHeader('E-mail')).toBe('email')
    expect(normalizeHeader(' První jméno ')).toBe('prvnijmeno')
  })
})

describe('suggestMapping', () => {
  it('namapuje českou hlavičku „Firma;IČO;E-mail"', () => {
    expect(suggestMapping(['Firma', 'IČO', 'E-mail'])).toEqual({ name: 0, ico: 1, email: 2 })
  })

  it('namapuje anglickou hlavičku „Company,Email,First name"', () => {
    expect(suggestMapping(['Company', 'Email', 'First name'])).toEqual({
      name: 0,
      email: 1,
      first_name: 2,
    })
  })

  it('namapuje německou hlavičku', () => {
    const mapping = suggestMapping(['Firmenname', 'Vorname', 'Nachname', 'E-Mail', 'Telefon', 'Land'])
    expect(mapping).toEqual({ name: 0, first_name: 1, last_name: 2, email: 3, phone: 4, country: 5 })
  })

  it('rozliší jméno kontaktu a příjmení od názvu firmy', () => {
    const mapping = suggestMapping(['Název firmy', 'Jméno', 'Příjmení', 'Pozice', 'Město', 'Web', 'Poznámka'])
    expect(mapping).toEqual({
      name: 0,
      first_name: 1,
      last_name: 2,
      position: 3,
      city: 4,
      website: 5,
      note: 6,
    })
  })

  it('neznámé sloupce nechá nenamapované', () => {
    expect(suggestMapping(['xyz', 'abc'])).toEqual({})
  })
})

describe('parseMapping', () => {
  const HEADERS = ['Firma', 'IČO', 'E-mail']

  it('přijme kanonický tvar {pole: index}', () => {
    const result = parseMapping({ name: 0, email: 2 }, HEADERS)
    expect(result.ok && result.values).toEqual({ name: 0, email: 2 })
  })

  it('přijme tvar {název sloupce: pole}, který posílá průvodce', () => {
    const result = parseMapping({ Firma: 'name', 'IČO': 'ico', 'E-mail': 'email' }, HEADERS)
    expect(result.ok && result.values).toEqual({ name: 0, ico: 1, email: 2 })
  })

  it('bere i jiná pojmenování polí z průvodce (company_name, notes)', () => {
    const result = parseMapping({ Firma: 'company_name', 'E-mail': 'email' }, HEADERS)
    expect(result.ok && result.values).toEqual({ name: 0, email: 2 })
    const stored = parseMapping({ company_name: 0, notes: 1 }, HEADERS)
    expect(stored.ok && stored.values).toEqual({ name: 0, note: 1 })
  })

  it('odmítne neznámé pole, neznámý sloupec a index mimo rozsah', () => {
    expect(parseMapping({ neznamy: 0 }, HEADERS)).toEqual({ ok: false, message: 'invalid_mapping_field' })
    expect(parseMapping({ 'Neexistuje': 'name' }, HEADERS)).toEqual({ ok: false, message: 'unknown_column' })
    expect(parseMapping({ name: 5 }, HEADERS)).toEqual({ ok: false, message: 'invalid_mapping_index' })
    expect(parseMapping({ name: -1 }, HEADERS)).toEqual({ ok: false, message: 'invalid_mapping_index' })
    expect(parseMapping({ name: 1.5 }, HEADERS)).toEqual({ ok: false, message: 'invalid_mapping_index' })
  })

  it('vyžaduje aspoň název firmy nebo e-mail', () => {
    expect(parseMapping({ phone: 0 }, HEADERS)).toEqual({
      ok: false,
      message: 'mapping_requires_name_or_email',
    })
  })

  it('odmítne nesmyslný tvar', () => {
    expect(parseMapping(null, HEADERS).ok).toBe(false)
    expect(parseMapping([0, 1], HEADERS).ok).toBe(false)
    expect(parseMapping('name', HEADERS).ok).toBe(false)
  })
})

describe('parseStoredMapping / toHeaderMapping', () => {
  it('uloží mapování z průvodce beze změny tvaru', () => {
    const result = parseStoredMapping({ Firma: 'name', 'E-mail': 'email' })
    expect(result.ok && result.values).toEqual({ Firma: 'name', 'E-mail': 'email' })
  })

  it('kanonický tvar uloží s aliasy převedenými na cílová pole', () => {
    const result = parseStoredMapping({ company_name: 0, notes: 1 })
    expect(result.ok && result.values).toEqual({ name: 0, note: 1 })
  })

  it('odmítne prázdné a nesmyslné mapování', () => {
    expect(parseStoredMapping({}).ok).toBe(false)
    // název sloupce může být cokoli, ale cílové pole musí existovat
    expect(parseStoredMapping({ Firma: 'nezname_pole' }).ok).toBe(false)
    expect(parseStoredMapping({ neznamy: 3 }).ok).toBe(false)
    expect(parseStoredMapping(null).ok).toBe(false)
  })

  it('návrh mapování se vrací v tvaru, který jde poslat rovnou zpět', () => {
    const headers = ['Firma', 'IČO', 'E-mail']
    const suggested = toHeaderMapping(headers, suggestMapping(headers))
    expect(suggested).toEqual({ Firma: 'name', 'IČO': 'ico', 'E-mail': 'email' })
    const back = parseMapping(suggested, headers)
    expect(back.ok && back.values).toEqual({ name: 0, ico: 1, email: 2 })
  })
})

describe('normalizeCountry', () => {
  it('přijme kód i běžné názvy zemí', () => {
    expect(normalizeCountry('cz')).toBe('CZ')
    expect(normalizeCountry('Česko')).toBe('CZ')
    expect(normalizeCountry('Deutschland')).toBe('DE')
    expect(normalizeCountry('Austria')).toBe('AT')
  })

  it('u neznámé hodnoty vrátí null', () => {
    expect(normalizeCountry('Neznámo')).toBeNull()
    expect(normalizeCountry('')).toBeNull()
    expect(normalizeCountry(null)).toBeNull()
  })
})

describe('mapRows', () => {
  const mapping: ColumnMapping = { name: 0, ico: 1, email: 2, phone: 3, country: 4, note: 5 }

  it('namapuje platný řádek a doplní vedoucí nulu v IČO', () => {
    const { records, errors } = mapRows(
      [[ALFA, '177041', ALFA_EMAIL, '+420 353 000 111', 'Česko', 'sken jmenovky ITB']],
      mapping,
    )
    expect(errors).toEqual([])
    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      row_index: 0,
      name: ALFA,
      ico: '00177041',
      email: ALFA_EMAIL,
      phone: '+420 353 000 111',
      country: 'CZ',
      note: 'sken jmenovky ITB',
    })
  })

  it('nahlásí neplatné IČO, neplatný e-mail a chybějící název', () => {
    const { records, errors } = mapRows(
      [
        [ALFA, '12345678', ALFA_EMAIL, '', '', ''],
        [ALFA, '', 'tohle-neni-email', '', '', ''],
        ['', '', '', '', '', ''],
      ],
      mapping,
    )
    expect(records).toEqual([])
    expect(errors).toEqual([
      { row_index: 0, error: 'invalid_ico' },
      { row_index: 1, error: 'invalid_email' },
      { row_index: 2, error: 'missing_name' },
    ])
  })

  it('bez názvu firmy použije doménu e-mailu', () => {
    const { records, errors } = mapRows([['', '', ALFA_EMAIL, '', '', '']], mapping)
    expect(errors).toEqual([])
    expect(records[0].name).toBe('ck-alfa.example')
  })

  it('nesmyslný telefon zahodí, řádek nechá projít', () => {
    const { records, errors } = mapRows([[ALFA, '', '', 'volejte kdykoliv', '', '']], mapping)
    expect(errors).toEqual([])
    expect(records[0].phone).toBeNull()
  })

  it('chybějící sloupce v mapování jsou prázdné, ne chyba', () => {
    const { records, errors } = mapRows([[ALFA]], { name: 0 })
    expect(errors).toEqual([])
    expect(records[0]).toMatchObject({ ico: null, email: null, first_name: '', country: null })
  })

  it('indexy řádků odpovídají pořadí v CSV i při chybách', () => {
    const { records, errors } = mapRows(
      [
        [ALFA, '', ALFA_EMAIL, '', '', ''],
        ['', '', '', '', '', ''],
        ['CK Beta s.r.o.', '', 'obchod@ck-beta.example', '', '', ''],
      ],
      mapping,
    )
    expect(records.map((r) => r.row_index)).toEqual([0, 2])
    expect(errors.map((e) => e.row_index)).toEqual([1])
  })
})

describe('emailDomain / isGenericDomain', () => {
  it('vytáhne doménu', () => {
    expect(emailDomain(ALFA_EMAIL)).toBe('ck-alfa.example')
    expect(emailDomain('Jan.Novak@CK-Alfa.example'.toLowerCase())).toBe('ck-alfa.example')
    expect(emailDomain(null)).toBeNull()
    expect(emailDomain('bez-zavinace')).toBeNull()
  })

  it('freemailové domény se pro shodu nepoužívají', () => {
    for (const domain of ['gmail.com', 'seznam.cz', 'outlook.com', 'yahoo.com', 'web.de', 'gmx.de', 'atlas.cz', 'email.cz']) {
      expect(isGenericDomain(domain)).toBe(true)
    }
    expect(isGenericDomain('ck-alfa.example')).toBe(false)
    expect(isGenericDomain(null)).toBe(true)
  })
})

describe('parseDecisions', () => {
  it('přijme create, skip i merge s uuid', () => {
    const result = parseDecisions({ 0: 'create', 1: 'skip', 2: `merge:${UUID}` })
    expect(result.ok && result.values).toEqual({
      0: { kind: 'create' },
      1: { kind: 'skip' },
      2: { kind: 'merge', partner_id: UUID },
    })
  })

  it('chybějící rozhodnutí je prázdná mapa', () => {
    expect(parseDecisions(undefined)).toEqual({ ok: true, values: {} })
    expect(parseDecisions(null)).toEqual({ ok: true, values: {} })
  })

  it('odmítne neznámé rozhodnutí a merge bez platného uuid', () => {
    expect(parseDecisions({ 0: 'delete' }).ok).toBe(false)
    expect(parseDecisions({ 0: 'merge:neco' }).ok).toBe(false)
    expect(parseDecisions({ '-1': 'skip' }).ok).toBe(false)
    expect(parseDecisions({ 0: 5 }).ok).toBe(false)
    expect(parseDecisions([1, 2]).ok).toBe(false)
  })
})

describe('isConsentBasis', () => {
  it('pustí jen hodnoty z CHECK constraintu', () => {
    expect(isConsentBasis('lead_scanner')).toBe(true)
    expect(isConsentBasis('business_card')).toBe(true)
    expect(isConsentBasis('explicit_signup')).toBe(true)
    expect(isConsentBasis('unknown')).toBe(true)
    expect(isConsentBasis('vymyslene')).toBe(false)
    expect(isConsentBasis(null)).toBe(false)
  })
})
