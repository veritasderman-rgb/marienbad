import type pg from 'pg'
import { q, withTx } from '../db'
import {
  CONSENT_BASES,
  isValidIco,
  normalizeEmail,
  normalizeWebsite,
  type ConsentBasis,
  type Validation,
} from '../crm/partners'
import { MAX_COLUMNS } from './csv'

/** Import už byl (souběžně) potvrzen — endpoint překládá na 409. */
export class ImportAlreadyCommittedError extends Error {
  constructor() {
    super('Import už byl potvrzen.')
  }
}

/**
 * Import partnerů z veletržního CSV (NAVRH sekce 5.4).
 *
 * Rozdělení odpovědnosti:
 *  - `suggestMapping`, `normalizeIco`, `mapRows` — čisté funkce nad daty
 *    (testované bez DB v tests/leads.test.ts),
 *  - `dedupRows` — dotazy do CRM (IČO → doména e-mailu → fuzzy podle názvu),
 *  - `commitImport` — zápis v JEDNÉ transakci včetně uzavření záznamu importu.
 *
 * Fuzzy shoda NIKDY nezakládá ani neslučuje sama od sebe: vrací kandidáty
 * k lidskému rozhodnutí a bez rozhodnutí se řádek přeskakuje.
 */

// ---------------------------------------------------------------------------
// Mapování sloupců
// ---------------------------------------------------------------------------

export const LEAD_FIELDS = [
  'name',
  'ico',
  'email',
  'first_name',
  'last_name',
  'phone',
  'position',
  'country',
  'city',
  'website',
  'note',
] as const

export type LeadField = (typeof LEAD_FIELDS)[number]

/** Pole → index sloupce v CSV. Chybějící klíč = sloupec není namapovaný. */
export type ColumnMapping = Partial<Record<LeadField, number>>

/** Heuristika názvů sloupců: přesná shoda má přednost před podřetězcem. */
const HEADER_HINTS: Record<LeadField, { exact: string[]; contains: string[] }> = {
  name: {
    exact: [
      'firma', 'nazev', 'nazevfirmy', 'nazevspolecnosti', 'obchodnijmeno', 'spolecnost',
      'company', 'companyname', 'organization', 'organisation', 'account', 'accountname',
      'firmenname', 'unternehmen', 'ck', 'agentura', 'name',
    ],
    contains: ['nazevfirmy', 'nazevspolecnosti', 'companyname', 'firmenname', 'unternehmen', 'spolecnost'],
  },
  ico: {
    exact: ['ico', 'ic', 'identifikacnicislo', 'companyid', 'companyno', 'registrationnumber', 'idnummer'],
    contains: ['ico', 'identifikacnicislo', 'registrationnumber'],
  },
  email: {
    exact: ['email', 'mail', 'emailadresa', 'emailaddress', 'eemail', 'mailadresse', 'epost'],
    contains: ['email', 'mailadresse', 'emailova'],
  },
  first_name: {
    exact: ['jmeno', 'krestnijmeno', 'firstname', 'givenname', 'vorname', 'kontaktjmeno'],
    contains: ['krestnijmeno', 'firstname', 'givenname', 'vorname'],
  },
  last_name: {
    exact: ['prijmeni', 'lastname', 'surname', 'familyname', 'nachname'],
    contains: ['prijmeni', 'lastname', 'surname', 'nachname'],
  },
  phone: {
    exact: ['telefon', 'tel', 'phone', 'mobil', 'mobile', 'telephone', 'phonenumber', 'telefonnicislo'],
    contains: ['telefon', 'phone', 'mobil'],
  },
  position: {
    exact: ['pozice', 'funkce', 'position', 'jobtitle', 'title', 'role', 'funktion'],
    contains: ['pozice', 'jobtitle', 'funktion'],
  },
  country: {
    exact: ['zeme', 'stat', 'country', 'land', 'countrycode', 'staat', 'kodzeme'],
    contains: ['country', 'zeme'],
  },
  city: {
    exact: ['mesto', 'obec', 'city', 'stadt', 'ort', 'town', 'sidlo'],
    contains: ['mesto', 'city', 'stadt'],
  },
  website: {
    exact: ['web', 'www', 'website', 'url', 'webovastranka', 'homepage', 'internet', 'webseite'],
    contains: ['website', 'webova', 'homepage', 'webseite'],
  },
  note: {
    exact: [
      'poznamka', 'poznamky', 'note', 'notes', 'comment', 'comments', 'bemerkung',
      'anmerkung', 'souhlas', 'consent', 'evidence',
    ],
    contains: ['poznamka', 'comment', 'bemerkung', 'anmerkung', 'souhlas', 'consent'],
  },
}

/** Malá písmena, bez diakritiky, bez oddělovačů — 'IČO' i 'E-mail' se potkají. */
export function normalizeHeader(header: string): string {
  return header
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function suggestMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {}
  const normalized = headers.map(normalizeHeader)

  const assign = (field: LeadField, index: number): void => {
    if (mapping[field] === undefined) mapping[field] = index
  }

  // 1. kolo — přesná shoda
  for (let i = 0; i < normalized.length && i < MAX_COLUMNS; i += 1) {
    const key = normalized[i]
    if (!key) continue
    for (const field of LEAD_FIELDS) {
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
    for (const field of LEAD_FIELDS) {
      if (mapping[field] !== undefined) continue
      if (HEADER_HINTS[field].contains.some((hint) => key.includes(hint))) {
        assign(field, i)
        break
      }
    }
  }

  return mapping
}

/** Průvodce importem pojmenovává dvě pole jinak — bereme obojí. */
const FIELD_ALIASES: Record<string, LeadField> = {
  company_name: 'name',
  company: 'name',
  notes: 'note',
}

export function resolveLeadField(value: unknown): LeadField | null {
  if (typeof value !== 'string') return null
  const key = value.trim()
  if ((LEAD_FIELDS as readonly string[]).includes(key)) return key as LeadField
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
  return entries.length > 0 && entries.every(([, value]) => resolveLeadField(value) !== null)
}

/**
 * Mapování sloupců ze vstupu API. Přijímá dva tvary — kanonický
 * `{pole: index sloupce}` (co vrací `suggestMapping`) i `{název sloupce: pole}`,
 * ve kterém mapování posílá průvodce importem. Výsledek je vždy kanonický.
 * Při dvojím obsazení téhož pole vyhrává první výskyt.
 */
export function parseMapping(input: unknown, headers: string[]): Validation<ColumnMapping> {
  const entries = mappingEntries(input)
  if (entries === null) return { ok: false, message: 'invalid_mapping' }
  if (entries.length > MAX_COLUMNS) return { ok: false, message: 'invalid_mapping' }

  const values: ColumnMapping = {}
  const assign = (field: LeadField, index: number): void => {
    if (values[field] === undefined) values[field] = index
  }

  if (isHeaderKeyed(entries)) {
    const byHeader = new Map<string, number>()
    headers.forEach((header, index) => {
      const key = normalizeHeader(header)
      if (key && !byHeader.has(key)) byHeader.set(key, index)
    })
    for (const [header, raw] of entries) {
      const field = resolveLeadField(raw)
      if (field === null) return { ok: false, message: 'invalid_mapping_field' }
      const index = /^[0-9]+$/.test(header) ? Number(header) : byHeader.get(normalizeHeader(header))
      if (index === undefined || !Number.isInteger(index) || index < 0 || index >= headers.length) {
        return { ok: false, message: 'unknown_column' }
      }
      assign(field, index)
    }
  } else {
    for (const [key, raw] of entries) {
      const field = resolveLeadField(key)
      if (field === null) return { ok: false, message: 'invalid_mapping_field' }
      const index = typeof raw === 'number' ? raw : Number(raw)
      if (!Number.isInteger(index) || index < 0 || index >= headers.length) {
        return { ok: false, message: 'invalid_mapping_index' }
      }
      assign(field, index)
    }
  }

  if (values.name === undefined && values.email === undefined) {
    return { ok: false, message: 'mapping_requires_name_or_email' }
  }
  return { ok: true, values }
}

/**
 * Mapování pro uložení do šablony: hlavičky konkrétního souboru tu nejsou,
 * takže se jen ověří tvar a vrátí normalizovaná kopie k uložení do jsonb.
 */
export function parseStoredMapping(input: unknown): Validation<Record<string, string | number>> {
  const entries = mappingEntries(input)
  if (entries === null) return { ok: false, message: 'invalid_mapping' }
  if (entries.length === 0 || entries.length > MAX_COLUMNS) return { ok: false, message: 'invalid_mapping' }

  const values: Record<string, string | number> = {}
  if (isHeaderKeyed(entries)) {
    for (const [header, raw] of entries) {
      const field = resolveLeadField(raw)
      if (field === null) return { ok: false, message: 'invalid_mapping_field' }
      if (!header || header.length > 300) return { ok: false, message: 'invalid_mapping' }
      values[header] = field
    }
  } else {
    for (const [key, raw] of entries) {
      const field = resolveLeadField(key)
      if (field === null) return { ok: false, message: 'invalid_mapping_field' }
      const index = typeof raw === 'number' ? raw : Number(raw)
      if (!Number.isInteger(index) || index < 0 || index >= MAX_COLUMNS) {
        return { ok: false, message: 'invalid_mapping_index' }
      }
      values[field] = index
    }
  }
  return { ok: true, values }
}

/**
 * Návrh mapování v tvaru `{název sloupce: pole}` — v něm ho průvodce
 * importem čte, posílá zpět i ukládá do šablon.
 */
export function toHeaderMapping(headers: string[], mapping: ColumnMapping): Record<string, LeadField> {
  const out: Record<string, LeadField> = {}
  for (const field of LEAD_FIELDS) {
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

/**
 * IČO z Excelu přišlo o vedoucí nuly (NAVRH 5.4) — doplní se zpět na osm míst.
 * Vrací jen IČO, které projde kontrolní číslicí, jinak null.
 */
export function normalizeIco(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null
  const digits = raw.replace(/[^0-9]/g, '')
  if (digits.length === 0 || digits.length > 8) return null
  const padded = digits.padStart(8, '0')
  return isValidIco(padded) ? padded : null
}

const COUNTRY_NAMES: Record<string, string> = {
  cesko: 'CZ', ceskarepublika: 'CZ', ceska: 'CZ', czechia: 'CZ', czechrepublic: 'CZ', tschechien: 'CZ',
  nemecko: 'DE', germany: 'DE', deutschland: 'DE',
  rakousko: 'AT', austria: 'AT', osterreich: 'AT',
  slovensko: 'SK', slovakia: 'SK', slowakei: 'SK',
  polsko: 'PL', poland: 'PL', polen: 'PL',
  svycarsko: 'CH', switzerland: 'CH', schweiz: 'CH',
  rusko: 'RU', russia: 'RU',
  izrael: 'IL', israel: 'IL',
}

export function normalizeCountry(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase()
  return COUNTRY_NAMES[normalizeHeader(trimmed)] ?? null
}

function normalizePhone(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  return /^[+()\d\s./-]{6,40}$/.test(trimmed) ? trimmed : null
}

function cut(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value
}

// ---------------------------------------------------------------------------
// Mapování řádků na záznamy
// ---------------------------------------------------------------------------

export interface LeadRecord {
  row_index: number
  name: string
  ico: string | null
  email: string | null
  first_name: string
  last_name: string
  phone: string | null
  position: string | null
  country: string | null
  city: string | null
  website: string | null
  note: string | null
}

export interface RowError {
  row_index: number
  error: string
}

export interface MappedRows {
  records: LeadRecord[]
  errors: RowError[]
}

/**
 * Řádky → typované záznamy. Chybný řádek se nezakládá a jde do `errors`
 * (propíše se do rows_failed a do error_logu importu).
 */
export function mapRows(rows: string[][], mapping: ColumnMapping): MappedRows {
  const records: LeadRecord[] = []
  const errors: RowError[] = []

  const cell = (row: string[], field: LeadField): string => {
    const index = mapping[field]
    if (index === undefined) return ''
    const value = row[index]
    return typeof value === 'string' ? value.trim() : ''
  }

  rows.forEach((row, rowIndex) => {
    const rawIco = cell(row, 'ico')
    const rawEmail = cell(row, 'email')
    const rawName = cell(row, 'name')

    const email = rawEmail ? normalizeEmail(rawEmail) : null
    if (rawEmail && email === null) {
      errors.push({ row_index: rowIndex, error: 'invalid_email' })
      return
    }

    let ico: string | null = null
    if (rawIco) {
      ico = normalizeIco(rawIco)
      if (ico === null) {
        errors.push({ row_index: rowIndex, error: 'invalid_ico' })
        return
      }
    }

    // Bez názvu firmy se použije doména e-mailu — jinak řádek nelze zařadit.
    const name = rawName || (email ? (email.split('@')[1] ?? '') : '')
    if (!name) {
      errors.push({ row_index: rowIndex, error: 'missing_name' })
      return
    }

    const rawWebsite = cell(row, 'website')
    records.push({
      row_index: rowIndex,
      name: cut(name, 300),
      ico,
      email,
      first_name: cut(cell(row, 'first_name'), 120),
      last_name: cut(cell(row, 'last_name'), 120),
      phone: normalizePhone(cell(row, 'phone')),
      position: cut(cell(row, 'position'), 160) || null,
      country: normalizeCountry(cell(row, 'country')),
      city: cut(cell(row, 'city'), 120) || null,
      website: rawWebsite ? normalizeWebsite(rawWebsite) : null,
      note: cut(cell(row, 'note'), 2000) || null,
    })
  })

  return { records, errors }
}

// ---------------------------------------------------------------------------
// Odstranění duplicit
// ---------------------------------------------------------------------------

/** Freemailové domény: shoda domény u nich nic neříká o firmě. */
export const GENERIC_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'seznam.cz',
  'outlook.com',
  'yahoo.com',
  'web.de',
  'gmx.de',
  'atlas.cz',
  'email.cz',
  'hotmail.com',
  'icloud.com',
  'centrum.cz',
  'volny.cz',
  'gmx.net',
  'gmx.at',
  'yahoo.de',
  'live.com',
])

export function emailDomain(email: string | null): string | null {
  if (!email) return null
  const at = email.lastIndexOf('@')
  if (at <= 0 || at === email.length - 1) return null
  return email.slice(at + 1).toLowerCase()
}

export function isGenericDomain(domain: string | null): boolean {
  return domain === null || GENERIC_EMAIL_DOMAINS.has(domain)
}

export type MatchKind = 'ico' | 'email_domain' | 'fuzzy' | 'new'

export interface PartnerCandidate {
  id: string
  name: string
  ico: string | null
  similarity: number
}

export interface DedupRow {
  row_index: number
  record: LeadRecord
  match: MatchKind
  /** Partner nalezený podle IČO nebo domény e-mailu. */
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
 * Pro každý záznam určí, zda partner v CRM už je:
 *   1. IČO — spolehlivá shoda,
 *   2. doména e-mailu (mimo freemaily) — shoda přes existující kontakt,
 *   3. fuzzy podle názvu (pg_trgm) — jen kandidáti k ručnímu potvrzení.
 */
export async function dedupRows(records: LeadRecord[]): Promise<DedupRow[]> {
  const result: DedupRow[] = records.map((record) => ({
    row_index: record.row_index,
    record,
    match: 'new' as MatchKind,
    partner_id: null,
    partner_name: null,
    candidates: [],
  }))
  if (result.length === 0) return result

  // --- 1. IČO ---------------------------------------------------------------
  const icos = [...new Set(records.map((r) => r.ico).filter((v): v is string => v !== null))]
  const byIco = new Map<string, { id: string; name: string }>()
  for (const part of chunk(icos, BATCH)) {
    const rows = await q<{ id: string; name: string; ico: string }>(
      `SELECT id, name, ico FROM crm.partners WHERE ico = ANY($1::text[])`,
      [part],
    )
    for (const row of rows) byIco.set(row.ico, { id: row.id, name: row.name })
  }

  // --- 2. doména e-mailu ----------------------------------------------------
  const pending = result.filter((row) => {
    const hit = row.record.ico ? byIco.get(row.record.ico) : undefined
    if (hit) {
      row.match = 'ico'
      row.partner_id = hit.id
      row.partner_name = hit.name
      return false
    }
    return true
  })

  const domains = [
    ...new Set(
      pending
        .map((row) => emailDomain(row.record.email))
        .filter((domain): domain is string => !isGenericDomain(domain)),
    ),
  ]
  const byDomain = new Map<string, { id: string; name: string }>()
  for (const part of chunk(domains, BATCH)) {
    const rows = await q<{ domain: string; id: string; name: string }>(
      `SELECT lower(split_part(c.email::text, '@', 2)) AS domain, p.id, p.name
         FROM crm.partner_contacts c
         JOIN crm.partners p ON p.id = c.partner_id
        WHERE c.email IS NOT NULL
          AND c.anonymized_at IS NULL
          AND lower(split_part(c.email::text, '@', 2)) = ANY($1::text[])
        ORDER BY c.created_at ASC`,
      [part],
    )
    for (const row of rows) {
      if (!byDomain.has(row.domain)) byDomain.set(row.domain, { id: row.id, name: row.name })
    }
  }

  // --- 3. fuzzy podle názvu -------------------------------------------------
  const fuzzy = pending.filter((row) => {
    const domain = emailDomain(row.record.email)
    const hit = isGenericDomain(domain) ? undefined : byDomain.get(domain as string)
    if (hit) {
      row.match = 'email_domain'
      row.partner_id = hit.id
      row.partner_name = hit.name
      return false
    }
    return true
  })

  for (const part of chunk(fuzzy, BATCH)) {
    const indexes = part.map((row) => row.row_index)
    const terms = part.map((row) => row.record.name)
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
// Commit
// ---------------------------------------------------------------------------

export type Decision =
  | { kind: 'create' }
  | { kind: 'skip' }
  | { kind: 'merge'; partner_id: string }

export type Decisions = Record<number, Decision>

export interface CommitOptions {
  importId: string
  actorId: string
  optIn: boolean
  consentBasis: ConsentBasis | null
  optInSource: string | null
  decisions: Decisions
  params: unknown
  errors: RowError[]
}

export interface CommitResult {
  created_partners: number
  created_contacts: number
  duplicates: number
  /** Přeskočené řádky celkem — včetně `undecided`. */
  skipped: number
  /** Chybné řádky z mapRows (rows_failed). */
  failed: number
  /** Fuzzy shody bez lidského rozhodnutí (rows_undecided v error_logu). */
  undecided: number
}

const DEFAULT_SOURCE = 'veletrh'

function hasContactData(record: LeadRecord): boolean {
  return Boolean(record.email || record.first_name || record.last_name || record.phone)
}

async function findPartnerByIco(client: pg.PoolClient, ico: string): Promise<string | null> {
  const found = await client.query<{ id: string }>(
    `SELECT id FROM crm.partners WHERE ico = $1`,
    [ico],
  )
  return found.rows[0]?.id ?? null
}

async function insertPartner(
  client: pg.PoolClient,
  record: LeadRecord,
  options: CommitOptions,
): Promise<string | null> {
  const inserted = await client.query<{ id: string }>(
    `INSERT INTO crm.partners
       (name, ico, country, city, website, segment, status, acquisition_source, acquired_by, acquired_at)
     VALUES ($1, $2, $3, $4, $5, 'travel_agency', 'prospect', $6, $7, CURRENT_DATE)
     ON CONFLICT (ico) WHERE ico IS NOT NULL DO NOTHING
     RETURNING id`,
    [
      record.name,
      record.ico,
      record.country ?? 'CZ',
      record.city,
      record.website,
      options.optInSource ?? DEFAULT_SOURCE,
      options.actorId,
    ],
  )
  return inserted.rows[0]?.id ?? null
}

async function contactExists(
  client: pg.PoolClient,
  partnerId: string,
  email: string,
): Promise<boolean> {
  const found = await client.query(
    `SELECT 1 FROM crm.partner_contacts WHERE partner_id = $1 AND email = $2 LIMIT 1`,
    [partnerId, email],
  )
  return found.rows.length > 0
}

async function insertContact(
  client: pg.PoolClient,
  partnerId: string,
  record: LeadRecord,
  options: CommitOptions,
  isPrimary: boolean,
): Promise<void> {
  await client.query(
    `INSERT INTO crm.partner_contacts
       (partner_id, first_name, last_name, email, phone, position, is_primary,
        newsletter_opt_in, lawful_basis, consent_basis, opt_in_source, opt_in_at, opt_in_evidence)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      partnerId,
      record.first_name,
      record.last_name,
      record.email,
      record.phone,
      record.position,
      isPrimary,
      options.optIn,
      options.optIn ? 'consent' : null,
      options.optIn ? options.consentBasis : null,
      options.optIn ? (options.optInSource ?? DEFAULT_SOURCE) : null,
      options.optIn ? new Date().toISOString().slice(0, 10) : null,
      options.optIn ? record.note : null,
    ],
  )
}

/**
 * Zápis importu — všechno v jedné transakci včetně uzavření záznamu importu.
 * Fuzzy řádky bez rozhodnutí se přeskočí a počítají se zvlášť (`undecided`),
 * do error_logu, ne mezi duplicity.
 */
export async function commitImport(
  dedup: DedupRow[],
  options: CommitOptions,
): Promise<CommitResult> {
  return withTx(async (client) => {
    // Claim importu hned na začátku transakce (Codex P2): podmíněný přechod
    // uploaded → committed pustí dál jen jeden ze souběžných/opakovaných
    // commitů — druhý skončí chybou místo duplicitních partnerů a kontaktů.
    const claimed = await client.query(
      `UPDATE crm.imports SET status = 'committed'
       WHERE id = $1 AND status = 'uploaded'
       RETURNING id`,
      [options.importId],
    )
    if (claimed.rows.length === 0) {
      throw new ImportAlreadyCommittedError()
    }
    let createdPartners = 0
    let createdContacts = 0
    let duplicates = 0
    let skipped = 0
    let undecided = 0
    let ok = 0
    const undecidedRows: number[] = []
    /** E-maily založené v tomto běhu — chrání před duplicitou uvnitř souboru. */
    const seenEmails = new Map<string, string>()

    for (const row of dedup) {
      const decision = options.decisions[row.row_index]
      const record = row.record

      if (decision?.kind === 'skip') {
        skipped += 1
        continue
      }

      let targetPartnerId: string | null = null
      let partnerIsNew = false

      if (decision?.kind === 'merge') {
        const exists = await client.query(`SELECT id FROM crm.partners WHERE id = $1`, [
          decision.partner_id,
        ])
        if (exists.rows.length === 0) {
          skipped += 1
          continue
        }
        targetPartnerId = decision.partner_id
      } else if ((row.match === 'ico' || row.match === 'email_domain') && decision?.kind !== 'create') {
        // rozhodnutí 'create' přebíjí shodu podle domény; u shody podle IČO
        // sáhne pojistka níž stejně po existujícím partnerovi (IČO je unikátní)
        targetPartnerId = row.partner_id
      } else if (row.match === 'fuzzy' && decision?.kind !== 'create') {
        // fuzzy nikdy nespojujeme automaticky
        undecided += 1
        skipped += 1
        undecidedRows.push(row.row_index)
        continue
      }

      if (targetPartnerId === null) {
        // založení nového partnera (i pro fuzzy s rozhodnutím 'create')
        if (record.ico) {
          const existing = await findPartnerByIco(client, record.ico)
          if (existing) targetPartnerId = existing
        }
        if (targetPartnerId === null) {
          const created = await insertPartner(client, record, options)
          if (created === null) {
            // souběžný zápis stejného IČO — použij existujícího partnera
            targetPartnerId = record.ico ? await findPartnerByIco(client, record.ico) : null
            if (targetPartnerId === null) {
              skipped += 1
              continue
            }
          } else {
            targetPartnerId = created
            partnerIsNew = true
            createdPartners += 1
          }
        }
      }

      if (!hasContactData(record)) {
        if (partnerIsNew) ok += 1
        else duplicates += 1
        continue
      }

      if (record.email) {
        const seenPartner = seenEmails.get(record.email)
        if (seenPartner === targetPartnerId) {
          duplicates += 1
          continue
        }
        if (await contactExists(client, targetPartnerId, record.email)) {
          duplicates += 1
          continue
        }
        seenEmails.set(record.email, targetPartnerId)
      }

      await insertContact(client, targetPartnerId, record, options, partnerIsNew)
      createdContacts += 1
      ok += 1
    }

    const failed = options.errors.length
    const errorLog = {
      rows_undecided: undecided,
      undecided_rows: undecidedRows,
      errors: options.errors,
    }

    await client.query(
      `UPDATE crm.imports
          SET rows_ok = $2, rows_failed = $3, rows_duplicate = $4,
              status = 'committed', params = $5, error_log = $6, staging = NULL
        WHERE id = $1`,
      [
        options.importId,
        ok,
        failed,
        duplicates,
        JSON.stringify(options.params ?? null),
        JSON.stringify(errorLog),
      ],
    )

    return {
      created_partners: createdPartners,
      created_contacts: createdContacts,
      duplicates,
      skipped,
      failed,
      undecided,
    }
  })
}

/** Validace `decisions` z těla požadavku: 'create' | 'skip' | 'merge:<uuid>'. */
export function parseDecisions(input: unknown): Validation<Decisions> {
  if (input === undefined || input === null) return { ok: true, values: {} }
  if (typeof input !== 'object' || Array.isArray(input)) return { ok: false, message: 'invalid_decisions' }
  const values: Decisions = {}
  for (const [key, raw] of Object.entries(input as Record<string, unknown>)) {
    const index = Number(key)
    if (!Number.isInteger(index) || index < 0) return { ok: false, message: 'invalid_decisions' }
    if (typeof raw !== 'string') return { ok: false, message: 'invalid_decisions' }
    if (raw === 'create') values[index] = { kind: 'create' }
    else if (raw === 'skip') values[index] = { kind: 'skip' }
    else if (raw.startsWith('merge:')) {
      const partnerId = raw.slice('merge:'.length)
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(partnerId)) {
        return { ok: false, message: 'invalid_decisions' }
      }
      values[index] = { kind: 'merge', partner_id: partnerId.toLowerCase() }
    } else return { ok: false, message: 'invalid_decisions' }
  }
  return { ok: true, values }
}

export function isConsentBasis(value: unknown): value is ConsentBasis {
  return typeof value === 'string' && (CONSENT_BASES as readonly string[]).includes(value)
}
