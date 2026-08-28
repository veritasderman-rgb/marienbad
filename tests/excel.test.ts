import ExcelJS from 'exceljs'
import { afterEach, describe, expect, it } from 'vitest'
import {
  cellToValue,
  ExcelError,
  fxRate,
  mapRows,
  MAX_COLUMNS,
  MAX_ROWS,
  normalizeCurrency,
  normalizeHotelSlug,
  parseDecisions,
  parseMapping,
  parseMonth,
  parseNumber,
  parseXlsx,
  resolveRows,
  suggestMapping,
  toEur,
  toHeaderMapping,
  type CellValue,
  type ColumnMapping,
  type MatchedRow,
  type PerformanceRecord,
} from '../src/lib/portal/imports/excel'

/**
 * Fixtury jsou fiktivní firmy a hotely — repozitář je veřejný.
 * Sešity se vyrábějí přímo tady přes ExcelJS do bufferu, žádný .xlsx
 * v gitu a žádná databáze.
 */

const ALFA = 'CK Alfa a.s.'
const BETA = 'Reisebüro Beta GmbH'
const ICO_ALFA = '00177041'
const ICO_BETA = '60192755'
const UUID_A = '3f1a2b4c-5d6e-4f70-8901-23456789abcd'
const UUID_B = '11111111-2222-4333-8444-555555555555'

interface SheetSpec {
  name: string
  rows: unknown[][]
}

async function buildXlsx(sheets: SheetSpec[]): Promise<Uint8Array> {
  const workbook = new ExcelJS.Workbook()
  for (const sheet of sheets) {
    const worksheet = workbook.addWorksheet(sheet.name)
    for (const row of sheet.rows) worksheet.addRow(row)
  }
  const buffer = await workbook.xlsx.writeBuffer()
  return new Uint8Array(buffer as unknown as ArrayBuffer)
}

const HEADERS = ['Partner', 'IČO', 'Období', 'Hotel', 'Tržby', 'Měna']

// ---------------------------------------------------------------------------
// parseXlsx
// ---------------------------------------------------------------------------

describe('parseXlsx', () => {
  it('načte hlavičku a řádky, prázdné řádky přeskočí', async () => {
    const bytes = await buildXlsx([
      {
        name: 'Data',
        rows: [
          HEADERS,
          [ALFA, ICO_ALFA, '2026-05', 'nove-lazne', 125000, 'CZK'],
          [null, null, null, null, null, null],
          [BETA, ICO_BETA, '2026-05', 'butterfly', 4800, 'EUR'],
        ],
      },
    ])

    const parsed = await parseXlsx(bytes)
    expect(parsed.headers).toEqual(HEADERS)
    expect(parsed.rows).toHaveLength(2)
    expect(parsed.rows[0]).toEqual([ALFA, ICO_ALFA, '2026-05', 'nove-lazne', 125000, 'CZK'])
    expect(parsed.rows[1]?.[0]).toBe(BETA)
  })

  it('čte JEN první list', async () => {
    const bytes = await buildXlsx([
      { name: 'Kveten', rows: [['Partner', 'Tržby'], [ALFA, 100]] },
      { name: 'Cerven', rows: [['Partner', 'Tržby'], [BETA, 200]] },
    ])

    const parsed = await parseXlsx(bytes)
    expect(parsed.rows).toHaveLength(1)
    expect(parsed.rows[0]?.[0]).toBe(ALFA)
  })

  it('u vzorce vezme uložený výsledek a nikdy nepočítá', async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Data')
    sheet.addRow(['Partner', 'Tržby'])
    sheet.addRow([ALFA, null])
    sheet.getCell('B2').value = { formula: 'SUM(C2:D2)', result: 1234.5 }
    sheet.addRow([BETA, null])
    // vzorec bez uloženého výsledku — nesmí nic dopočítávat
    sheet.getCell('B3').value = { formula: 'SUM(C3:D3)' } as ExcelJS.CellFormulaValue
    const bytes = new Uint8Array((await workbook.xlsx.writeBuffer()) as unknown as ArrayBuffer)

    const parsed = await parseXlsx(bytes)
    expect(parsed.rows[0]?.[1]).toBe(1234.5)
    expect(parsed.rows[1]?.[1]).toBeNull()
  })

  it('datum z Excelu serializuje do ISO, takže přežije staging', async () => {
    const bytes = await buildXlsx([
      { name: 'Data', rows: [['Partner', 'Období'], [ALFA, new Date(Date.UTC(2026, 4, 1))]] },
    ])
    const parsed = await parseXlsx(bytes)
    expect(String(parsed.rows[0]?.[1])).toMatch(/^2026-05-01T/)
    expect(parseMonth(parsed.rows[0]?.[1])).toBe('2026-05-01')
  })

  it('odmítne sešit přes strop sloupců', async () => {
    const header = Array.from({ length: MAX_COLUMNS + 1 }, (_, i) => `S${i}`)
    const bytes = await buildXlsx([{ name: 'Data', rows: [header, header.map(() => 1)] }])
    await expect(parseXlsx(bytes)).rejects.toMatchObject({ code: 'too_large' })
  })

  it('odmítne sešit přes strop řádků', async () => {
    const rows: unknown[][] = [['Partner']]
    for (let i = 0; i < MAX_ROWS + 1; i += 1) rows.push([`Partner ${i}`])
    const bytes = await buildXlsx([{ name: 'Data', rows }])
    await expect(parseXlsx(bytes)).rejects.toMatchObject({ code: 'too_large' })
  }, 60_000)

  it('odmítne prázdný a nečitelný vstup', async () => {
    await expect(parseXlsx(new Uint8Array(0))).rejects.toBeInstanceOf(ExcelError)
    await expect(parseXlsx(new Uint8Array([1, 2, 3, 4, 5]))).rejects.toMatchObject({
      code: 'invalid_xlsx',
    })
  })
})

describe('cellToValue', () => {
  it('rozbalí formátovaný text, odkaz i chybu', () => {
    expect(cellToValue({ richText: [{ text: 'CK ' }, { text: 'Alfa' }] })).toBe('CK Alfa')
    expect(cellToValue({ text: 'web', hyperlink: 'https://alfa.example' })).toBe('web')
    expect(cellToValue({ error: '#DIV/0!' })).toBeNull()
    expect(cellToValue('  ')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Čísla a období
// ---------------------------------------------------------------------------

describe('parseNumber', () => {
  it('zvládne české číslo s mezerami a desetinnou čárkou', () => {
    expect(parseNumber('1 234,56')).toBe(1234.56)
    expect(parseNumber('1 234,56')).toBe(1234.56)
    expect(parseNumber('1 234,56')).toBe(1234.56)
    expect(parseNumber(' 42 ')).toBe(42)
  })

  it('pozná desetinný oddělovač i když jsou v čísle obě značky', () => {
    expect(parseNumber('1.234,56')).toBe(1234.56)
    expect(parseNumber('1,234.56')).toBe(1234.56)
  })

  it('čísla nechá být, nesmysly zahodí', () => {
    expect(parseNumber(0)).toBe(0)
    expect(parseNumber(-125.25)).toBe(-125.25)
    expect(parseNumber(Number.NaN)).toBeNull()
    expect(parseNumber('')).toBeNull()
    expect(parseNumber('1 234 Kč')).toBeNull()
    expect(parseNumber('abc')).toBeNull()
    expect(parseNumber(null)).toBeNull()
  })
})

describe('parseMonth', () => {
  it('přijme datum z Excelu', () => {
    expect(parseMonth(new Date(Date.UTC(2026, 0, 31)))).toBe('2026-01-01')
    expect(parseMonth(new Date(Date.UTC(2025, 11, 1)))).toBe('2025-12-01')
  })

  it('přijme textové zápisy období', () => {
    expect(parseMonth('2026-05')).toBe('2026-05-01')
    expect(parseMonth('2026-5')).toBe('2026-05-01')
    expect(parseMonth('2026-05-17')).toBe('2026-05-01')
    expect(parseMonth('2026-05-01T00:00:00.000Z')).toBe('2026-05-01')
    expect(parseMonth('05/2026')).toBe('2026-05-01')
    expect(parseMonth('5/2026')).toBe('2026-05-01')
    expect(parseMonth('5.2026')).toBe('2026-05-01')
    expect(parseMonth('1.5.2026')).toBe('2026-05-01')
  })

  it('odmítne nesmysly a měsíce mimo rozsah', () => {
    expect(parseMonth('2026-13')).toBeNull()
    expect(parseMonth('kveten 2026')).toBeNull()
    expect(parseMonth('')).toBeNull()
    expect(parseMonth(42)).toBeNull()
    expect(parseMonth(null)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Mapování sloupců
// ---------------------------------------------------------------------------

describe('suggestMapping', () => {
  it('pozná české hlavičky', () => {
    const mapping = suggestMapping([
      'Název firmy', 'IČO partnera', 'Období', 'Hotel', 'Počet rezervací',
      'Počet nocí', 'Hosté', 'Storna', 'Tržby', 'Měna',
    ])
    expect(mapping).toEqual({
      partner_name: 0,
      partner_ico: 1,
      period_month: 2,
      hotel_slug: 3,
      bookings: 4,
      room_nights: 5,
      guests: 6,
      cancellations: 7,
      revenue_amount: 8,
      currency: 9,
    })
  })

  it('pozná anglické hlavičky', () => {
    const mapping = suggestMapping([
      'Partner name', 'Company ID', 'Month', 'Property', 'Bookings',
      'Room nights', 'Guests', 'Cancellations', 'Revenue', 'Currency',
    ])
    expect(mapping).toEqual({
      partner_name: 0,
      partner_ico: 1,
      period_month: 2,
      hotel_slug: 3,
      bookings: 4,
      room_nights: 5,
      guests: 6,
      cancellations: 7,
      revenue_amount: 8,
      currency: 9,
    })
  })

  it('neznámé sloupce nemapuje', () => {
    expect(suggestMapping(['Poznámka', 'Interní kód'])).toEqual({})
  })

  it('vrátí mapování v tvaru {sloupec: pole}', () => {
    const headers = ['Partner', 'Tržby']
    expect(toHeaderMapping(headers, suggestMapping(headers))).toEqual({
      Partner: 'partner_name',
      'Tržby': 'revenue_amount',
    })
  })
})

describe('parseMapping', () => {
  const headers = HEADERS

  it('přijme kanonický tvar {pole: index}', () => {
    const result = parseMapping({ partner_name: 0, revenue_amount: 4 }, headers)
    expect(result).toEqual({ ok: true, values: { partner_name: 0, revenue_amount: 4 } })
  })

  it('přijme tvar {sloupec: pole} i aliasy', () => {
    const result = parseMapping({ Partner: 'partner', 'Tržby': 'revenue' }, headers)
    expect(result).toEqual({ ok: true, values: { partner_name: 0, revenue_amount: 4 } })
  })

  it('trvá na partnerovi a na částce', () => {
    expect(parseMapping({ revenue_amount: 4 }, headers)).toEqual({
      ok: false,
      message: 'mapping_requires_partner',
    })
    expect(parseMapping({ partner_ico: 1 }, headers)).toEqual({
      ok: false,
      message: 'mapping_requires_revenue',
    })
  })

  it('odmítne neznámý sloupec i neznámé pole', () => {
    expect(parseMapping({ partner_name: 0, revenue_amount: 99 }, headers).ok).toBe(false)
    expect(parseMapping({ vymyslene_pole: 0 }, headers).ok).toBe(false)
    expect(parseMapping([], headers).ok).toBe(false)
  })
})

describe('normalizeHotelSlug a normalizeCurrency', () => {
  it('udělá ze jména hotelu slug', () => {
    expect(normalizeHotelSlug('Nové Lázně')).toBe('nove-lazne')
    expect(normalizeHotelSlug('  Hotel Butterfly  ')).toBe('hotel-butterfly')
    expect(normalizeHotelSlug('---')).toBeNull()
    expect(normalizeHotelSlug(null)).toBeNull()
  })

  it('srovná zápisy měny', () => {
    expect(normalizeCurrency('czk')).toBe('CZK')
    expect(normalizeCurrency('Kč')).toBe('CZK')
    expect(normalizeCurrency('€')).toBe('EUR')
    expect(normalizeCurrency('euro')).toBe('EUR')
    expect(normalizeCurrency('USD')).toBe('USD')
    expect(normalizeCurrency('koruna')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// mapRows
// ---------------------------------------------------------------------------

const FULL_MAPPING: ColumnMapping = {
  partner_name: 0,
  partner_ico: 1,
  period_month: 2,
  hotel_slug: 3,
  revenue_amount: 4,
  currency: 5,
}

describe('mapRows', () => {
  it('namapuje běžný řádek včetně čísel s čárkou', () => {
    const rows: CellValue[][] = [[ALFA, ICO_ALFA, '2026-05', 'Nové Lázně', '1 234,56', 'Kč']]
    const { records, errors } = mapRows(rows, FULL_MAPPING)
    expect(errors).toEqual([])
    expect(records[0]).toMatchObject({
      row_index: 0,
      partner_name: ALFA,
      partner_ico: ICO_ALFA,
      period_month: '2026-05-01',
      hotel_slug: 'nove-lazne',
      revenue_amount: 1234.56,
      currency: 'CZK',
    })
  })

  it('doplní IČO o vedoucí nuly, které sežral Excel', () => {
    const rows: CellValue[][] = [[null, 177041, '2026-05', 'butterfly', 100, 'CZK']]
    const { records } = mapRows(rows, FULL_MAPPING)
    expect(records[0]?.partner_ico).toBe(ICO_ALFA)
  })

  it('použije default_period a default_hotel, když sloupce nejsou', () => {
    const mapping: ColumnMapping = { partner_name: 0, revenue_amount: 4 }
    const rows: CellValue[][] = [[BETA, null, null, null, 4800, null]]
    const { records, errors } = mapRows(rows, mapping, {
      defaultPeriod: '2026-06-01',
      defaultHotel: 'butterfly',
    })
    expect(errors).toEqual([])
    expect(records[0]).toMatchObject({
      period_month: '2026-06-01',
      hotel_slug: 'butterfly',
      currency: 'CZK',
    })
  })

  it('bez období i bez defaultu je řádek chybný', () => {
    const rows: CellValue[][] = [[ALFA, null, null, 'butterfly', 100, 'CZK']]
    const { records, errors } = mapRows(rows, FULL_MAPPING)
    expect(records).toEqual([])
    expect(errors).toEqual([{ row_index: 0, error: 'missing_period' }])
  })

  it('posbírá chybné řádky a dobré nechá projít', () => {
    const rows: CellValue[][] = [
      [ALFA, ICO_ALFA, '2026-05', 'butterfly', 100, 'CZK'],
      [null, null, '2026-05', 'butterfly', 100, 'CZK'],
      [ALFA, '12345678', '2026-05', 'butterfly', 100, 'CZK'],
      [ALFA, null, 'kveten', 'butterfly', 100, 'CZK'],
      [ALFA, null, '2026-05', 'butterfly', null, 'CZK'],
      [ALFA, null, '2026-05', 'butterfly', 'nic', 'CZK'],
      [ALFA, null, '2026-05', 'butterfly', 100, 'koruna'],
    ]
    const { records, errors } = mapRows(rows, FULL_MAPPING)
    expect(records).toHaveLength(1)
    expect(errors.map((e) => e.error)).toEqual([
      'missing_partner',
      'invalid_ico',
      'invalid_period',
      'missing_revenue',
      'invalid_revenue',
      'invalid_currency',
    ])
  })

  it('nečitelnou metriku hlásí, prázdnou bere jako null', () => {
    const mapping: ColumnMapping = { ...FULL_MAPPING, room_nights: 6, guests: 7 }
    const rows: CellValue[][] = [
      [ALFA, null, '2026-05', 'butterfly', 100, 'CZK', '1 240', null],
      [ALFA, null, '2026-05', 'butterfly', 100, 'CZK', 'x', null],
    ]
    const { records, errors } = mapRows(rows, mapping)
    expect(records[0]).toMatchObject({ room_nights: 1240, guests: null })
    expect(errors).toEqual([{ row_index: 1, error: 'invalid_number' }])
  })
})

describe('celá cesta souborem', () => {
  it('parseXlsx → suggestMapping → parseMapping → mapRows dá zapsatelné řádky', async () => {
    const bytes = await buildXlsx([
      {
        name: 'Vykonnost',
        rows: [
          ['Název firmy', 'IČO', 'Období', 'Hotel', 'Počet nocí', 'Tržby', 'Měna'],
          [ALFA, 177041, new Date(Date.UTC(2026, 4, 1)), 'Nové Lázně', 1240, '1 250 000,50', 'Kč'],
          [BETA, ICO_BETA, '05/2026', 'Butterfly', 310, 4800, 'EUR'],
        ],
      },
    ])

    const parsed = await parseXlsx(bytes)
    const suggested = toHeaderMapping(parsed.headers, suggestMapping(parsed.headers))
    const mapping = parseMapping(suggested, parsed.headers)
    expect(mapping.ok).toBe(true)
    if (!mapping.ok) return

    const { records, errors } = mapRows(parsed.rows, mapping.values)
    expect(errors).toEqual([])
    expect(records).toHaveLength(2)
    expect(records[0]).toMatchObject({
      partner_name: ALFA,
      partner_ico: ICO_ALFA,
      period_month: '2026-05-01',
      hotel_slug: 'nove-lazne',
      room_nights: 1240,
      revenue_amount: 1250000.5,
      currency: 'CZK',
    })
    expect(records[1]).toMatchObject({
      partner_ico: ICO_BETA,
      period_month: '2026-05-01',
      hotel_slug: 'butterfly',
      revenue_amount: 4800,
      currency: 'EUR',
    })
  })
})

// ---------------------------------------------------------------------------
// Přepočet měny a rozhodnutí
// ---------------------------------------------------------------------------

describe('toEur a fxRate', () => {
  afterEach(() => {
    delete process.env.PORTAL_FX_CZK_EUR
  })

  it('EUR bere jak je, CZK dělí kurzem a zaokrouhlí na haléře', () => {
    expect(toEur(4800, 'EUR', 25)).toEqual({ fx_rate: null, revenue_eur: 4800 })
    expect(toEur(125000, 'CZK', 25)).toEqual({ fx_rate: 25, revenue_eur: 5000 })
    expect(toEur(1000, 'CZK', 24.7)).toEqual({ fx_rate: 24.7, revenue_eur: 40.49 })
  })

  it('jiná měna je chyba řádku', () => {
    expect(toEur(100, 'USD', 25)).toBe('unsupported_currency')
  })

  it('kurz bere z env, nesmysl odmítne', () => {
    expect(fxRate()).toBe(25)
    process.env.PORTAL_FX_CZK_EUR = '24.5'
    expect(fxRate()).toBe(24.5)
    process.env.PORTAL_FX_CZK_EUR = '0'
    expect(fxRate()).toBeNull()
    process.env.PORTAL_FX_CZK_EUR = 'nic'
    expect(fxRate()).toBeNull()
  })
})

describe('parseDecisions', () => {
  it('přijme skip a assign', () => {
    expect(parseDecisions({ 0: 'skip', 2: `assign:${UUID_A}` })).toEqual({
      ok: true,
      values: { 0: { kind: 'skip' }, 2: { kind: 'assign', partner_id: UUID_A } },
    })
    expect(parseDecisions(undefined)).toEqual({ ok: true, values: {} })
  })

  it('odmítne cizí tvary', () => {
    expect(parseDecisions({ 0: 'merge:x' }).ok).toBe(false)
    expect(parseDecisions({ 0: 'assign:neco' }).ok).toBe(false)
    expect(parseDecisions({ '-1': 'skip' }).ok).toBe(false)
    expect(parseDecisions(['skip']).ok).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// resolveRows
// ---------------------------------------------------------------------------

function record(index: number, over: Partial<PerformanceRecord> = {}): PerformanceRecord {
  return {
    row_index: index,
    partner_name: ALFA,
    partner_ico: null,
    period_month: '2026-05-01',
    hotel_slug: 'butterfly',
    bookings: null,
    room_nights: null,
    guests: null,
    cancellations: null,
    revenue_amount: 25000,
    currency: 'CZK',
    ...over,
  }
}

function matched(over: Partial<MatchedRow> & { record: PerformanceRecord }): MatchedRow {
  return {
    row_index: over.record.row_index,
    match: 'none',
    partner_id: null,
    partner_name: null,
    candidates: [],
    ...over,
  }
}

describe('resolveRows', () => {
  it('spárovaný řádek přepočítá a připraví k zápisu', () => {
    const result = resolveRows(
      [matched({ record: record(0), match: 'ico', partner_id: UUID_A, partner_name: ALFA })],
      {},
      25,
    )
    expect(result.ready).toHaveLength(1)
    expect(result.ready[0]).toMatchObject({
      partner_id: UUID_A,
      from_decision: false,
      fx_rate: 25,
      revenue_eur: 1000,
    })
    expect(result.months).toEqual(['2026-05'])
    expect(result.errors).toEqual([])
  })

  it('nespárovaný bez kandidátů padá do chyb, s kandidáty čeká na rozhodnutí', () => {
    const result = resolveRows(
      [
        matched({ record: record(0) }),
        matched({
          record: record(1, { partner_name: BETA }),
          match: 'fuzzy',
          candidates: [{ id: UUID_B, name: BETA, ico: ICO_BETA, similarity: 0.72 }],
        }),
      ],
      {},
      25,
    )
    expect(result.ready).toEqual([])
    expect(result.errors).toEqual([{ row_index: 0, error: 'unmatched_partner' }])
    expect(result.to_decide).toHaveLength(1)
    expect(result.to_decide[0]).toMatchObject({
      row_index: 1,
      partner_name: BETA,
      period_month: '2026-05-01',
      hotel_slug: 'butterfly',
      revenue_amount: 25000,
    })
  })

  it('rozhodnutí člověka přebíjí fuzzy — assign zapíše, skip přeskočí', () => {
    const rows = [
      matched({
        record: record(0),
        match: 'fuzzy',
        candidates: [{ id: UUID_B, name: ALFA, ico: null, similarity: 0.6 }],
      }),
      matched({ record: record(1), match: 'ico', partner_id: UUID_A }),
    ]
    const result = resolveRows(rows, { 0: { kind: 'assign', partner_id: UUID_B }, 1: { kind: 'skip' } }, 25)
    expect(result.to_decide).toEqual([])
    expect(result.skipped).toBe(1)
    expect(result.ready).toHaveLength(1)
    expect(result.ready[0]).toMatchObject({ partner_id: UUID_B, from_decision: true })
  })

  it('nepodporovanou měnu nezapíše a přidá k chybám z mapování', () => {
    const result = resolveRows(
      [matched({ record: record(3, { currency: 'USD' }), match: 'ico', partner_id: UUID_A })],
      {},
      25,
    )
    expect(result.ready).toEqual([])
    expect(result.errors).toEqual([{ row_index: 3, error: 'unsupported_currency' }])
  })

  it('vrátí seznam období v dávce a zachová chyby z mapRows', () => {
    const result = resolveRows(
      [
        matched({ record: record(0, { period_month: '2026-06-01' }), match: 'ico', partner_id: UUID_A }),
        matched({ record: record(1, { period_month: '2026-05-01' }), match: 'ico', partner_id: UUID_A }),
        matched({ record: record(2, { period_month: '2026-05-01' }), match: 'ico', partner_id: UUID_A }),
      ],
      {},
      25,
      [{ row_index: 9, error: 'invalid_revenue' }],
    )
    expect(result.months).toEqual(['2026-05', '2026-06'])
    expect(result.errors).toEqual([{ row_index: 9, error: 'invalid_revenue' }])
    expect(result.ready).toHaveLength(3)
  })
})
