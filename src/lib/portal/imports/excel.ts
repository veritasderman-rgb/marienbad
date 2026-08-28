import ExcelJS from 'exceljs'
import type pg from 'pg'
import { q, withTx } from '../db'
import { env } from '../env'
import { isUuid, type Validation } from '../crm/partners'
import { normalizeHeader, normalizeIco } from './leads'

/**
 * Import měsíční výkonnosti partnerů z Excelu (NAVRH sekce 5.3).
 *
 * Rozdělení odpovědnosti je stejné jako u veletržního CSV importu
 * (`imports/leads.ts`), aby se průvodce choval předvídatelně:
 *  - `parseXlsx`, `parseNumber`, `parseMonth`, `suggestMapping`, `parseMapping`,
 *    `mapRows`, `resolveRows` — čisté funkce nad daty (testované bez DB
 *    v tests/excel.test.ts),
 *  - `matchPartners` — dotazy do CRM (IČO → přesný název → fuzzy pg_trgm),
 *  - `commitPerformance` — upsert v JEDNÉ transakci včetně uzavření importu.
 *
 * Fuzzy shoda NIKDY nepřiřadí partnera sama od sebe: vrací kandidáty
 * k lidskému rozhodnutí a bez rozhodnutí se řádek nezapíše.
 *
 * Tvrdé stropy (audit N-10, „zip bomba"): XLSX je zip a 5MB soubor se umí
 * rozbalit do gigabajtů. Proto: 5 MB vstupu (kontroluje endpoint), čte se
 * JEN první list, nejvýše 10 000 datových řádků a 50 sloupců. Vzorce se
 * NIKDY nevyhodnocují — bere se jen cached výsledek uložený v souboru.
 */

// ---------------------------------------------------------------------------
// Stropy a chyby
// ---------------------------------------------------------------------------

export const MAX_BYTES = 5 * 1024 * 1024
/** Maximum DATOVÝCH řádků (bez řádku hlavičky). */
export const MAX_ROWS = 10_000
export const MAX_COLUMNS = 50

/** Chyba s kódem, který se propisuje do odpovědi API (`too_large`, …). */
export class ExcelError extends Error {
  readonly code: string

  constructor(code: string) {
    super(code)
    this.name = 'ExcelError'
    this.code = code
  }
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

/** Hodnota buňky po převodu do tvaru, který přežije uložení do jsonb stagingu. */
export type CellValue = string | number | null

export interface ParsedXlsx {
  headers: string[]
  rows: CellValue[][]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/**
 * Buňka → skalární hodnota. Datum se serializuje do ISO (staging je jsonb,
 * Date by se stejně převedl na řetězec — tak ať je převod na jednom místě).
 * Vzorec: bere se `result` uložený v souboru, nikdy se nepočítá.
 */
export function cellToValue(value: unknown): CellValue {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
  }
  if (value instanceof Date) {
    const time = value.getTime()
    return Number.isFinite(time) ? value.toISOString() : null
  }
  if (isRecord(value)) {
    // vzorec (i sdílený) — jen cached výsledek, žádné vyhodnocování
    if ('formula' in value || 'sharedFormula' in value) {
      return 'result' in value ? cellToValue(value.result) : null
    }
    // formátovaný text
    if (Array.isArray(value.richText)) {
      const text = value.richText
        .map((part) => (isRecord(part) && typeof part.text === 'string' ? part.text : ''))
        .join('')
        .trim()
      return text === '' ? null : text
    }
    // hypertextový odkaz — zajímá nás popisek, ne cíl
    if (typeof value.text === 'string' && typeof value.hyperlink === 'string') {
      const text = value.text.trim()
      return text === '' ? null : text
    }
    // #N/A, #DIV/0! …
    if (typeof value.error === 'string') return null
  }
  return null
}

/**
 * Načtení .xlsx do hlaviček a řádků. Čte se výhradně první list; prázdné
 * řádky se přeskakují, takže index řádku v `rows` je zároveň `row_index`,
 * kterým průvodce adresuje rozhodnutí u nespárovaných partnerů.
 */
export async function parseXlsx(bytes: Uint8Array): Promise<ParsedXlsx> {
  if (bytes.byteLength === 0) throw new ExcelError('empty_file')
  if (bytes.byteLength > MAX_BYTES) throw new ExcelError('too_large')

  const workbook = new ExcelJS.Workbook()
  try {
    // ExcelJS typuje vstup jako svůj vlastní `Buffer`; JSZip pod ním čte
    // Uint8Array bez problému, takže se jen srovná typ.
    await workbook.xlsx.load(bytes as unknown as Parameters<typeof workbook.xlsx.load>[0])
  } catch {
    throw new ExcelError('invalid_xlsx')
  }

  const sheet = workbook.worksheets[0]
  if (!sheet) throw new ExcelError('empty_file')

  const columnCount = sheet.columnCount
  const rowCount = sheet.rowCount
  if (columnCount <= 0 || rowCount <= 0) throw new ExcelError('empty_file')
  if (columnCount > MAX_COLUMNS) throw new ExcelError('too_large')
  // rowCount zahrnuje řádek hlavičky
  if (rowCount - 1 > MAX_ROWS) throw new ExcelError('too_large')

  const headerRow = sheet.getRow(1)
  const headers: string[] = []
  for (let c = 1; c <= columnCount; c += 1) {
    const value = cellToValue(headerRow.getCell(c).value)
    headers.push(value === null ? '' : String(value))
  }
  if (headers.every((header) => header === '')) throw new ExcelError('empty_file')

  const rows: CellValue[][] = []
  for (let r = 2; r <= rowCount; r += 1) {
    const row = sheet.getRow(r)
    const cells: CellValue[] = []
    let hasValue = false
    for (let c = 1; c <= columnCount; c += 1) {
      const value = cellToValue(row.getCell(c).value)
      if (value !== null) hasValue = true
      cells.push(value)
    }
    if (hasValue) rows.push(cells)
  }

  return { headers, rows }
}

// ---------------------------------------------------------------------------
// Čísla a období
// ---------------------------------------------------------------------------

/** Mezery, které Excel a české účetní sestavy používají jako oddělovač tisíců. */
const SPACES = /[\s\u00a0\u202f\u2009]/g

/**
 * Číslo z buňky. Zvládá české zápisy typu `1 234,56` i `1 234.56`;
 * když jsou v hodnotě obě oddělovací značky, desetinná je ta poslední
 * (`1.234,56` i `1,234.56` dají 1234.56).
 */
export function parseNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null

  let text = value.replace(SPACES, '')
  if (text === '') return null

  const lastComma = text.lastIndexOf(',')
  const lastDot = text.lastIndexOf('.')
  if (lastComma >= 0 && lastDot >= 0) {
    const decimal = lastComma > lastDot ? ',' : '.'
    const thousands = decimal === ',' ? '.' : ','
    text = text.split(thousands).join('')
    text = text.replace(decimal, '.')
  } else if (lastComma >= 0) {
    text = text.replace(',', '.')
  }

  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(text)) return null
  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed : null
}

function monthKey(year: number, month: number): string | null {
  if (!Number.isInteger(year) || !Number.isInteger(month)) return null
  if (year < 1900 || year > 2999 || month < 1 || month > 12) return null
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-01`
}

/**
 * Období → první den měsíce (`YYYY-MM-01`), jak ho chce
 * `partner_performance.period_month`. Přijímá datum z Excelu (i po serializaci
 * do ISO) a textové zápisy `YYYY-MM`, `YYYY-MM-DD`, `MM/YYYY`, `M.YYYY`
 * a `D.M.YYYY`.
 */
export function parseMonth(value: unknown): string | null {
  if (value instanceof Date) {
    const time = value.getTime()
    if (!Number.isFinite(time)) return null
    // ExcelJS vrací datum v UTC — čteme ho stejně, jinak by se u záporných
    // posunů měsíc utrhl o jeden zpět
    return monthKey(value.getUTCFullYear(), value.getUTCMonth() + 1)
  }
  if (typeof value !== 'string') return null

  const text = value.trim()
  if (text === '') return null

  // 2026-05, 2026-05-01, 2026-05-01T00:00:00.000Z
  const iso = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?(?:[T ].*)?$/.exec(text)
  if (iso) return monthKey(Number(iso[1]), Number(iso[2]))

  // 05/2026, 5/2026
  const slash = /^(\d{1,2})\/(\d{4})$/.exec(text)
  if (slash) return monthKey(Number(slash[2]), Number(slash[1]))

  // 1.1.2026 — český zápis data, měsíc je prostřední složka
  const czDate = /^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/.exec(text)
  if (czDate) return monthKey(Number(czDate[3]), Number(czDate[2]))

  // 5.2026, 05.2026
  const dot = /^(\d{1,2})\.\s*(\d{4})$/.exec(text)
  if (dot) return monthKey(Number(dot[2]), Number(dot[1]))

  return null
}

/** `YYYY-MM-01` → `YYYY-MM` pro odpovědi API. */
export function toMonthLabel(periodMonth: string): string {
  return periodMonth.slice(0, 7)
}

// ---------------------------------------------------------------------------
// Mapování sloupců
// ---------------------------------------------------------------------------

export const PERFORMANCE_FIELDS = [
  'partner_name',
  'partner_ico',
  'period_month',
  'hotel_slug',
  'bookings',
  'room_nights',
  'guests',
  'cancellations',
  'revenue_amount',
  'currency',
] as const

export type PerformanceField = (typeof PERFORMANCE_FIELDS)[number]

/** Pole → index sloupce v listu. Chybějící klíč = sloupec není namapovaný. */
export type ColumnMapping = Partial<Record<PerformanceField, number>>

const HEADER_HINTS: Record<PerformanceField, { exact: string[]; contains: string[] }> = {
  partner_name: {
    exact: [
      'partner', 'nazevpartnera', 'jmenopartnera', 'firma', 'nazev', 'nazevfirmy',
      'nazevspolecnosti', 'spolecnost', 'platce', 'nazevplatce', 'klient', 'odberatel',
      'company', 'companyname', 'partnername', 'account', 'accountname', 'agency',
      'agentura', 'ck', 'name', 'kunde', 'firmenname',
    ],
    contains: ['partner', 'platce', 'nazevfirmy', 'companyname', 'firmenname', 'agentura'],
  },
  partner_ico: {
    exact: [
      'ico', 'ic', 'icopartnera', 'partnerico', 'icofirmy', 'identifikacnicislo',
      'companyid', 'companyno', 'registrationnumber', 'idnummer',
    ],
    contains: ['ico', 'identifikacnicislo', 'registrationnumber'],
  },
  period_month: {
    exact: [
      'obdobi', 'ucetniobdobi', 'mesic', 'rokmesic', 'mesicrok', 'datum',
      'period', 'periodmonth', 'month', 'yearmonth', 'date', 'monat', 'zeitraum',
    ],
    contains: ['obdobi', 'mesic', 'month', 'period', 'monat', 'zeitraum'],
  },
  hotel_slug: {
    exact: [
      'hotel', 'hotelslug', 'hotelcode', 'kodhotelu', 'nazevhotelu', 'ubytovani',
      'objekt', 'dum', 'property', 'propertycode', 'unit',
    ],
    contains: ['hotel', 'property', 'objekt'],
  },
  bookings: {
    exact: [
      'rezervace', 'pocetrezervaci', 'rezervaci', 'objednavky', 'pocetobjednavek',
      'bookings', 'bookingcount', 'reservations', 'buchungen',
    ],
    contains: ['rezervac', 'booking', 'reservation', 'buchung', 'objednav'],
  },
  room_nights: {
    exact: [
      'noci', 'pocetnoci', 'noclehy', 'prenocovani', 'lozkodny', 'lozkoden',
      'roomnights', 'nights', 'bednights', 'ubernachtungen', 'uebernachtungen',
    ],
    contains: ['roomnight', 'bednight', 'nights', 'noci', 'nocleh', 'prenocov', 'ubernacht', 'uebernacht'],
  },
  guests: {
    exact: [
      'hoste', 'pocethostu', 'hostu', 'osoby', 'pocetosob', 'klienti', 'pax',
      'guests', 'guestcount', 'persons', 'gaste', 'gaeste',
    ],
    contains: ['host', 'guest', 'osob', 'pax', 'gaste', 'gaeste'],
  },
  cancellations: {
    exact: [
      'storna', 'storno', 'pocetstoren', 'zruseni', 'zrusene',
      'cancellations', 'cancelled', 'canceled', 'stornierungen',
    ],
    contains: ['storn', 'cancel', 'zrus'],
  },
  revenue_amount: {
    exact: [
      'trzby', 'trzba', 'obrat', 'castka', 'hodnota', 'celkem', 'sumacelkem',
      'revenue', 'amount', 'turnover', 'sales', 'value', 'umsatz', 'betrag',
    ],
    contains: ['trzb', 'obrat', 'revenue', 'turnover', 'umsatz', 'castka', 'amount'],
  },
  currency: {
    exact: ['mena', 'kodmeny', 'currency', 'currencycode', 'ccy', 'wahrung', 'waehrung'],
    contains: ['mena', 'currency', 'wahrung', 'waehrung'],
  },
}

/**
 * Pořadí pro kolo podřetězců. Obecné pojmy jdou až nakonec, jinak by
 * „IČO partnera" spadlo pod název partnera a „počet nocí" pod hosty.
 */
const CONTAINS_ORDER: PerformanceField[] = [
  'partner_ico',
  'period_month',
  'hotel_slug',
  'room_nights',
  'cancellations',
  'bookings',
  'currency',
  'revenue_amount',
  'guests',
  'partner_name',
]

export function suggestMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {}
  const normalized = headers.map(normalizeHeader)

  const assign = (field: PerformanceField, index: number): void => {
    if (mapping[field] === undefined) mapping[field] = index
  }

  // 1. kolo — přesná shoda
  for (let i = 0; i < normalized.length && i < MAX_COLUMNS; i += 1) {
    const key = normalized[i]
    if (!key) continue
    for (const field of PERFORMANCE_FIELDS) {
      if (HEADER_HINTS[field].exact.includes(key)) {
        assign(field, i)
        break
      }
    }
  }

  // 2. kolo — podřetězec (jen pro pole, která zatím nemají sloupec)
  for (let i = 0; i < normalized.length && i < MAX_COLUMNS; i += 1) {
    const key = normalized[i]
    if (!key) continue
    if (Object.values(mapping).includes(i)) continue
    for (const field of CONTAINS_ORDER) {
      if (mapping[field] !== undefined) continue
      if (HEADER_HINTS[field].contains.some((hint) => key.includes(hint))) {
        assign(field, i)
        break
      }
    }
  }

  return mapping
}

const FIELD_ALIASES: Record<string, PerformanceField> = {
  partner: 'partner_name',
  name: 'partner_name',
  ico: 'partner_ico',
  period: 'period_month',
  month: 'period_month',
  hotel: 'hotel_slug',
  revenue: 'revenue_amount',
  nights: 'room_nights',
}

export function resolvePerformanceField(value: unknown): PerformanceField | null {
  if (typeof value !== 'string') return null
  const key = value.trim()
  if ((PERFORMANCE_FIELDS as readonly string[]).includes(key)) return key as PerformanceField
  return FIELD_ALIASES[key] ?? null
}

function mappingEntries(input: unknown): [string, unknown][] | null {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return null
  return Object.entries(input as Record<string, unknown>).filter(
    ([, value]) => value !== null && value !== undefined && value !== '',
  )
}

/** Tvar {název sloupce: pole} pozná podle toho, že hodnoty jsou názvy polí. */
function isHeaderKeyed(entries: [string, unknown][]): boolean {
  return entries.length > 0 && entries.every(([, value]) => resolvePerformanceField(value) !== null)
}

/**
 * Mapování sloupců ze vstupu API. Stejně jako u veletržního importu přijímá
 * kanonický tvar `{pole: index sloupce}` i `{název sloupce: pole}`, ve kterém
 * mapování posílá průvodce. Výsledek je vždy kanonický.
 *
 * Povinné je jen to, co nelze doplnit z těla požadavku: partner (IČO nebo
 * název) a částka. Období a hotel smí přijít z `default_period` /
 * `default_hotel`, proto se hlídají až v `mapRows`.
 */
export function parseMapping(input: unknown, headers: string[]): Validation<ColumnMapping> {
  const entries = mappingEntries(input)
  if (entries === null) return { ok: false, message: 'invalid_mapping' }
  if (entries.length > MAX_COLUMNS) return { ok: false, message: 'invalid_mapping' }

  const values: ColumnMapping = {}
  const assign = (field: PerformanceField, index: number): void => {
    if (values[field] === undefined) values[field] = index
  }

  if (isHeaderKeyed(entries)) {
    const byHeader = new Map<string, number>()
    headers.forEach((header, index) => {
      const key = normalizeHeader(header)
      if (key && !byHeader.has(key)) byHeader.set(key, index)
    })
    for (const [header, raw] of entries) {
      const field = resolvePerformanceField(raw)
      if (field === null) return { ok: false, message: 'invalid_mapping_field' }
      const index = /^[0-9]+$/.test(header) ? Number(header) : byHeader.get(normalizeHeader(header))
      if (index === undefined || !Number.isInteger(index) || index < 0 || index >= headers.length) {
        return { ok: false, message: 'unknown_column' }
      }
      assign(field, index)
    }
  } else {
    for (const [key, raw] of entries) {
      const field = resolvePerformanceField(key)
      if (field === null) return { ok: false, message: 'invalid_mapping_field' }
      const index = typeof raw === 'number' ? raw : Number(raw)
      if (!Number.isInteger(index) || index < 0 || index >= headers.length) {
        return { ok: false, message: 'invalid_mapping_index' }
      }
      assign(field, index)
    }
  }

  if (values.partner_name === undefined && values.partner_ico === undefined) {
    return { ok: false, message: 'mapping_requires_partner' }
  }
  if (values.revenue_amount === undefined) {
    return { ok: false, message: 'mapping_requires_revenue' }
  }
  return { ok: true, values }
}

/** Návrh mapování v tvaru `{název sloupce: pole}` — v něm ho průvodce čte i posílá zpět. */
export function toHeaderMapping(
  headers: string[],
  mapping: ColumnMapping,
): Record<string, PerformanceField> {
  const out: Record<string, PerformanceField> = {}
  for (const field of PERFORMANCE_FIELDS) {
    const index = mapping[field]
    if (index === undefined) continue
    const header = headers[index]
    if (typeof header === 'string' && header !== '' && out[header] === undefined) out[header] = field
  }
  return out
}

// ---------------------------------------------------------------------------
// Normalizace hodnot
// ---------------------------------------------------------------------------

/** Hotel jako slug: bez diakritiky, malá písmena, oddělovač `-`. */
export function normalizeHotelSlug(raw: unknown): string | null {
  if (typeof raw === 'number') return String(raw)
  if (typeof raw !== 'string') return null
  const slug = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (!slug) return null
  return slug.slice(0, 120)
}

const CURRENCY_ALIASES: Record<string, string> = {
  KC: 'CZK',
  KČ: 'CZK',
  CK: 'CZK',
  KCS: 'CZK',
  '€': 'EUR',
  EURO: 'EUR',
  EUR: 'EUR',
  CZK: 'CZK',
}

/** Měna na třípísmenný kód. Neznámý tvar vrátí null → řádek jde do chyb. */
export function normalizeCurrency(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const text = raw.replace(SPACES, '').toUpperCase()
  if (text === '') return null
  const alias = CURRENCY_ALIASES[text]
  if (alias) return alias
  return /^[A-Z]{3}$/.test(text) ? text : null
}

// ---------------------------------------------------------------------------
// Mapování řádků na záznamy
// ---------------------------------------------------------------------------

export interface PerformanceRecord {
  row_index: number
  partner_name: string | null
  partner_ico: string | null
  period_month: string
  hotel_slug: string
  bookings: number | null
  room_nights: number | null
  guests: number | null
  cancellations: number | null
  revenue_amount: number
  currency: string
}

export interface RowError {
  row_index: number
  error: string
}

export interface MappedRows {
  records: PerformanceRecord[]
  errors: RowError[]
}

export interface MapOptions {
  /** `YYYY-MM-01`, když soubor nemá sloupec s obdobím. */
  defaultPeriod?: string | null
  /** slug hotelu, když soubor nemá sloupec s hotelem. */
  defaultHotel?: string | null
}

const DEFAULT_CURRENCY = 'CZK'

/**
 * Řádky → typované záznamy. Chybný řádek se nezapisuje a jde do `errors`
 * (propíše se do rows_failed a do error_logu importu).
 */
export function mapRows(
  rows: CellValue[][],
  mapping: ColumnMapping,
  options: MapOptions = {},
): MappedRows {
  const records: PerformanceRecord[] = []
  const errors: RowError[] = []
  const defaultPeriod = options.defaultPeriod ?? null
  const defaultHotel = options.defaultHotel ?? null

  const cell = (row: CellValue[], field: PerformanceField): CellValue => {
    const index = mapping[field]
    if (index === undefined) return null
    return row[index] ?? null
  }

  /** Celočíselné metriky: prázdno = null, nečitelná hodnota = chyba. */
  const count = (row: CellValue[], field: PerformanceField): number | null | 'error' => {
    const raw = cell(row, field)
    if (raw === null) return null
    const value = parseNumber(raw)
    if (value === null) return 'error'
    return Math.round(value)
  }

  rows.forEach((row, rowIndex) => {
    const rawIco = cell(row, 'partner_ico')
    let ico: string | null = null
    if (rawIco !== null) {
      ico = normalizeIco(typeof rawIco === 'number' ? String(rawIco) : rawIco)
      if (ico === null) {
        errors.push({ row_index: rowIndex, error: 'invalid_ico' })
        return
      }
    }

    const rawName = cell(row, 'partner_name')
    const name = rawName === null ? null : String(rawName).trim().slice(0, 300) || null

    if (ico === null && name === null) {
      errors.push({ row_index: rowIndex, error: 'missing_partner' })
      return
    }

    const rawPeriod = cell(row, 'period_month')
    const period = rawPeriod === null ? defaultPeriod : parseMonth(rawPeriod)
    if (period === null) {
      errors.push({ row_index: rowIndex, error: rawPeriod === null ? 'missing_period' : 'invalid_period' })
      return
    }

    const rawHotel = cell(row, 'hotel_slug')
    const hotel = rawHotel === null ? defaultHotel : normalizeHotelSlug(rawHotel)
    if (hotel === null || hotel === '') {
      errors.push({ row_index: rowIndex, error: rawHotel === null ? 'missing_hotel' : 'invalid_hotel' })
      return
    }

    const rawRevenue = cell(row, 'revenue_amount')
    if (rawRevenue === null) {
      errors.push({ row_index: rowIndex, error: 'missing_revenue' })
      return
    }
    const revenue = parseNumber(rawRevenue)
    if (revenue === null) {
      errors.push({ row_index: rowIndex, error: 'invalid_revenue' })
      return
    }

    const rawCurrency = cell(row, 'currency')
    const currency = rawCurrency === null ? DEFAULT_CURRENCY : normalizeCurrency(rawCurrency)
    if (currency === null) {
      errors.push({ row_index: rowIndex, error: 'invalid_currency' })
      return
    }

    const bookings = count(row, 'bookings')
    const roomNights = count(row, 'room_nights')
    const guests = count(row, 'guests')
    const cancellations = count(row, 'cancellations')
    if (
      bookings === 'error' ||
      roomNights === 'error' ||
      guests === 'error' ||
      cancellations === 'error'
    ) {
      errors.push({ row_index: rowIndex, error: 'invalid_number' })
      return
    }

    records.push({
      row_index: rowIndex,
      partner_name: name,
      partner_ico: ico,
      period_month: period,
      hotel_slug: hotel,
      bookings,
      room_nights: roomNights,
      guests,
      cancellations,
      revenue_amount: revenue,
      currency,
    })
  })

  return { records, errors }
}

// ---------------------------------------------------------------------------
// Párování partnera
// ---------------------------------------------------------------------------

export type MatchKind = 'ico' | 'name' | 'fuzzy' | 'none'

export interface PartnerCandidate {
  id: string
  name: string
  ico: string | null
  similarity: number
}

export interface MatchedRow {
  row_index: number
  record: PerformanceRecord
  match: MatchKind
  partner_id: string | null
  partner_name: string | null
  /** Kandidáti u fuzzy shody — vždy k lidskému rozhodnutí. */
  candidates: PartnerCandidate[]
}

const FUZZY_THRESHOLD = 0.45
const FUZZY_LIMIT = 3
const BATCH = 200

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

/**
 * Pro každý záznam najde partnera v CRM:
 *   1. IČO — spolehlivá shoda,
 *   2. přesný název (case-insensitive) proti `name` i `legal_name`,
 *   3. fuzzy podle názvu (pg_trgm) — jen kandidáti k ručnímu potvrzení.
 */
export async function matchPartners(records: PerformanceRecord[]): Promise<MatchedRow[]> {
  const result: MatchedRow[] = records.map((record) => ({
    row_index: record.row_index,
    record,
    match: 'none' as MatchKind,
    partner_id: null,
    partner_name: null,
    candidates: [],
  }))
  if (result.length === 0) return result

  // --- 1. IČO ---------------------------------------------------------------
  const icos = [...new Set(records.map((r) => r.partner_ico).filter((v): v is string => v !== null))]
  const byIco = new Map<string, { id: string; name: string }>()
  for (const part of chunk(icos, BATCH)) {
    const rows = await q<{ id: string; name: string; ico: string }>(
      `SELECT id, name, ico FROM crm.partners WHERE ico = ANY($1::text[])`,
      [part],
    )
    for (const row of rows) byIco.set(row.ico, { id: row.id, name: row.name })
  }

  const pending = result.filter((row) => {
    const hit = row.record.partner_ico ? byIco.get(row.record.partner_ico) : undefined
    if (hit) {
      row.match = 'ico'
      row.partner_id = hit.id
      row.partner_name = hit.name
      return false
    }
    return true
  })

  // --- 2. přesný název ------------------------------------------------------
  const named = pending.filter((row) => row.record.partner_name !== null)
  const byName = new Map<string, { id: string; name: string }>()
  const nameTerms = [...new Set(named.map((row) => row.record.partner_name as string))]
  for (const part of chunk(nameTerms, BATCH)) {
    const rows = await q<{ term: string; id: string; name: string }>(
      `SELECT n.term, c.id, c.name
         FROM unnest($1::text[]) AS n(term)
         JOIN LATERAL (
           SELECT p.id, p.name
             FROM crm.partners p
            WHERE lower(p.name) = lower(n.term) OR lower(p.legal_name) = lower(n.term)
            ORDER BY (lower(p.name) = lower(n.term)) DESC, p.name ASC
            LIMIT 1
         ) c ON true`,
      [part],
    )
    for (const row of rows) {
      if (!byName.has(row.term.toLowerCase())) byName.set(row.term.toLowerCase(), { id: row.id, name: row.name })
    }
  }

  // --- 3. fuzzy podle názvu -------------------------------------------------
  const fuzzy = pending.filter((row) => {
    const term = row.record.partner_name
    const hit = term === null ? undefined : byName.get(term.toLowerCase())
    if (hit) {
      row.match = 'name'
      row.partner_id = hit.id
      row.partner_name = hit.name
      return false
    }
    return term !== null
  })

  for (const part of chunk(fuzzy, BATCH)) {
    const indexes = part.map((row) => row.row_index)
    const terms = part.map((row) => row.record.partner_name as string)
    const rows = await q<{
      idx: number
      id: string
      name: string
      ico: string | null
      similarity: number
    }>(
      `SELECT n.idx, c.id, c.name, c.ico, c.similarity
         FROM unnest($1::int[], $2::text[]) AS n(idx, term)
         JOIN LATERAL (
           SELECT p.id, p.name, p.ico, similarity(p.name, n.term) AS similarity
             FROM crm.partners p
            WHERE similarity(p.name, n.term) > $3::real
            ORDER BY similarity(p.name, n.term) DESC, p.name ASC
            LIMIT ${FUZZY_LIMIT}
         ) c ON true`,
      [indexes, terms, FUZZY_THRESHOLD],
    )
    const grouped = new Map<number, PartnerCandidate[]>()
    for (const row of rows) {
      const list = grouped.get(row.idx) ?? []
      list.push({ id: row.id, name: row.name, ico: row.ico, similarity: Number(row.similarity) })
      grouped.set(row.idx, list)
    }
    for (const row of part) {
      const candidates = grouped.get(row.row_index)
      if (candidates && candidates.length > 0) {
        row.match = 'fuzzy'
        row.candidates = candidates.sort((a, b) => b.similarity - a.similarity).slice(0, FUZZY_LIMIT)
      }
    }
  }

  return result
}

// ---------------------------------------------------------------------------
// Rozhodnutí, přepočet měny, náhled
// ---------------------------------------------------------------------------

export type Decision = { kind: 'skip' } | { kind: 'assign'; partner_id: string }

export type Decisions = Record<number, Decision>

/** Validace `decisions` z těla požadavku: 'skip' | 'assign:<uuid>'. */
export function parseDecisions(input: unknown): Validation<Decisions> {
  if (input === undefined || input === null) return { ok: true, values: {} }
  if (typeof input !== 'object' || Array.isArray(input)) return { ok: false, message: 'invalid_decisions' }
  const values: Decisions = {}
  for (const [key, raw] of Object.entries(input as Record<string, unknown>)) {
    const index = Number(key)
    if (!Number.isInteger(index) || index < 0) return { ok: false, message: 'invalid_decisions' }
    if (typeof raw !== 'string') return { ok: false, message: 'invalid_decisions' }
    if (raw === 'skip') values[index] = { kind: 'skip' }
    else if (raw.startsWith('assign:')) {
      const partnerId = raw.slice('assign:'.length).trim().toLowerCase()
      if (!isUuid(partnerId)) return { ok: false, message: 'invalid_decisions' }
      values[index] = { kind: 'assign', partner_id: partnerId }
    } else return { ok: false, message: 'invalid_decisions' }
  }
  return { ok: true, values }
}

const DEFAULT_FX_CZK_EUR = '25'

/**
 * Kurz CZK→EUR z env. Vrací null, když je hodnota nastavená nesmyslně —
 * volající pak import odmítne, místo aby tiše zapsal špatná eura.
 */
export function fxRate(): number | null {
  const fx = Number(env('PORTAL_FX_CZK_EUR') ?? DEFAULT_FX_CZK_EUR)
  return Number.isFinite(fx) && fx > 0 ? fx : null
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

export interface Converted {
  fx_rate: number | null
  revenue_eur: number | null
}

/**
 * Přepočet na eura. EUR se bere jak je (fx_rate zůstává NULL — žádný kurz se
 * nepoužil), CZK se dělí kurzem z env. Cokoli jiného je chyba řádku.
 */
export function toEur(amount: number, currency: string, fx: number): Converted | 'unsupported_currency' {
  if (currency === 'EUR') return { fx_rate: null, revenue_eur: round2(amount) }
  if (currency === 'CZK') return { fx_rate: fx, revenue_eur: round2(amount / fx) }
  return 'unsupported_currency'
}

export interface ResolvedRow {
  row_index: number
  partner_id: string
  /** Partner přiřazený člověkem — před zápisem se ověří, že opravdu existuje. */
  from_decision: boolean
  record: PerformanceRecord
  fx_rate: number | null
  revenue_eur: number | null
}

export interface DecideRow {
  row_index: number
  partner_name: string | null
  partner_ico: string | null
  period_month: string
  hotel_slug: string
  revenue_amount: number
  candidates: PartnerCandidate[]
}

export interface ResolveResult {
  ready: ResolvedRow[]
  to_decide: DecideRow[]
  errors: RowError[]
  /** Období v dávce (`YYYY-MM`), vzestupně — pro hlášku „přepíše se 2026-05". */
  months: string[]
  skipped: number
}

/**
 * Spojí párování s lidskými rozhodnutími a přepočtem měny.
 *
 * Řádek, který se nepodařilo spárovat a nemá rozhodnutí, se NIKDY nezapíše:
 * buď čeká na rozhodnutí (`to_decide`, když jsou kandidáti), nebo padá do
 * `errors` s důvodem `unmatched_partner`.
 */
export function resolveRows(
  matched: MatchedRow[],
  decisions: Decisions,
  fx: number,
  previousErrors: RowError[] = [],
): ResolveResult {
  const ready: ResolvedRow[] = []
  const toDecide: DecideRow[] = []
  const errors: RowError[] = [...previousErrors]
  const months = new Set<string>()
  let skipped = 0

  for (const row of matched) {
    const record = row.record
    months.add(toMonthLabel(record.period_month))

    const decision = decisions[row.row_index]
    if (decision?.kind === 'skip') {
      skipped += 1
      continue
    }

    let partnerId: string | null = null
    let fromDecision = false
    if (decision?.kind === 'assign') {
      partnerId = decision.partner_id
      fromDecision = true
    } else if (row.partner_id !== null) {
      partnerId = row.partner_id
    }

    if (partnerId === null) {
      if (row.candidates.length > 0) {
        toDecide.push({
          row_index: row.row_index,
          partner_name: record.partner_name,
          partner_ico: record.partner_ico,
          period_month: record.period_month,
          hotel_slug: record.hotel_slug,
          revenue_amount: record.revenue_amount,
          candidates: row.candidates,
        })
      } else {
        errors.push({ row_index: row.row_index, error: 'unmatched_partner' })
      }
      continue
    }

    const converted = toEur(record.revenue_amount, record.currency, fx)
    if (converted === 'unsupported_currency') {
      errors.push({ row_index: row.row_index, error: 'unsupported_currency' })
      continue
    }

    ready.push({
      row_index: row.row_index,
      partner_id: partnerId,
      from_decision: fromDecision,
      record,
      fx_rate: converted.fx_rate,
      revenue_eur: converted.revenue_eur,
    })
  }

  return {
    ready,
    to_decide: toDecide,
    errors,
    months: [...months].sort(),
    skipped,
  }
}

// ---------------------------------------------------------------------------
// Commit
// ---------------------------------------------------------------------------

export interface CommitOptions {
  importId: string
  /** Řádky čekající na rozhodnutí — při ostrém zápisu se počítají jako selhané. */
  undecided: number[]
  skipped: number
  errors: RowError[]
  params: unknown
}

export interface CommitResult {
  upserted: number
  skipped: number
  failed: number
}

const UPSERT_SQL = `
  INSERT INTO crm.partner_performance
    (partner_id, period_month, hotel_slug, bookings, room_nights, guests, cancellations,
     revenue_amount, currency, fx_rate, revenue_eur, import_id)
  VALUES ($1, $2::date, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  ON CONFLICT (partner_id, period_month, hotel_slug) DO UPDATE SET
    bookings       = EXCLUDED.bookings,
    room_nights    = EXCLUDED.room_nights,
    guests         = EXCLUDED.guests,
    cancellations  = EXCLUDED.cancellations,
    revenue_amount = EXCLUDED.revenue_amount,
    currency       = EXCLUDED.currency,
    fx_rate        = EXCLUDED.fx_rate,
    revenue_eur    = EXCLUDED.revenue_eur,
    import_id      = EXCLUDED.import_id
`

async function existingPartnerIds(client: pg.PoolClient, ids: string[]): Promise<Set<string>> {
  if (ids.length === 0) return new Set()
  const found = await client.query<{ id: string }>(
    `SELECT id FROM crm.partners WHERE id = ANY($1::uuid[])`,
    [ids],
  )
  return new Set(found.rows.map((row) => row.id))
}

/**
 * Zápis importu — upsert všech řádků a uzavření záznamu importu v JEDNÉ
 * transakci. Import je opakovatelný: stejný měsíc se přepíše (NAVRH 5.3),
 * klíč je `(partner_id, period_month, hotel_slug)`.
 */
export async function commitPerformance(
  ready: ResolvedRow[],
  options: CommitOptions,
): Promise<CommitResult> {
  return withTx(async (client) => {
    const assigned = [...new Set(ready.filter((row) => row.from_decision).map((row) => row.partner_id))]
    const known = await existingPartnerIds(client, assigned)

    let upserted = 0
    let skipped = options.skipped
    const unknownPartner: number[] = []

    for (const row of ready) {
      if (row.from_decision && !known.has(row.partner_id)) {
        unknownPartner.push(row.row_index)
        skipped += 1
        continue
      }
      const record = row.record
      await client.query(UPSERT_SQL, [
        row.partner_id,
        record.period_month,
        record.hotel_slug,
        record.bookings,
        record.room_nights,
        record.guests,
        record.cancellations,
        record.revenue_amount,
        record.currency,
        row.fx_rate,
        row.revenue_eur,
        options.importId,
      ])
      upserted += 1
    }

    const failed = options.errors.length + options.undecided.length
    const errorLog = {
      errors: options.errors,
      undecided_rows: options.undecided,
      unknown_partner_rows: unknownPartner,
    }

    await client.query(
      `UPDATE crm.imports
          SET rows_ok = $2, rows_failed = $3, rows_duplicate = 0,
              status = 'committed', params = $4, error_log = $5, staging = NULL
        WHERE id = $1`,
      [
        options.importId,
        upserted,
        failed,
        JSON.stringify(options.params ?? null),
        JSON.stringify(errorLog),
      ],
    )

    return { upserted, skipped, failed }
  })
}
