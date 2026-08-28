import { q, qOne, withTx } from '../db'

/**
 * Dotazová vrstva CRM (partneři, kontakty, interakce) + validace vstupů.
 *
 * Dvě pravidla, která tenhle soubor drží za API vrstvu:
 *  - do SQL jdou hodnoty výhradně jako parametry ($1, $2, …),
 *  - jména sloupců a směr řazení se nikdy neberou ze vstupu, jen z whitelistů
 *    níže (PARTNER_COLUMNS / CONTACT_COLUMNS / SORT_COLUMNS).
 */

// ---------------------------------------------------------------------------
// Výčty (odpovídají CHECK constraintům v db/migrations/0002_crm.sql)
// ---------------------------------------------------------------------------

export type PartnerSegment = 'travel_agency' | 'tour_operator' | 'corporate' | 'insurer' | 'other'
export type PartnerTier = 'A' | 'B' | 'C'
export type PartnerStatus = 'active' | 'prospect' | 'inactive'
export type InteractionType = 'call' | 'email' | 'meeting' | 'fair' | 'note' | 'other'
export type PartnerLanguage = 'de' | 'en' | 'cs'
export type LawfulBasis = 'legitimate_interest' | 'consent' | 'contract'
export type ConsentBasis = 'lead_scanner' | 'business_card' | 'explicit_signup' | 'unknown'

export const SEGMENTS = ['travel_agency', 'tour_operator', 'corporate', 'insurer', 'other'] as const
export const TIERS = ['A', 'B', 'C'] as const
export const STATUSES = ['active', 'prospect', 'inactive'] as const
export const INTERACTION_TYPES = ['call', 'email', 'meeting', 'fair', 'note', 'other'] as const
export const LANGUAGES = ['de', 'en', 'cs'] as const
export const LAWFUL_BASES = ['legitimate_interest', 'consent', 'contract'] as const
export const CONSENT_BASES = ['lead_scanner', 'business_card', 'explicit_signup', 'unknown'] as const

export const PARTNERS_PAGE_SIZE = 50
export const INTERACTIONS_LIMIT = 100

// ---------------------------------------------------------------------------
// Typy
// ---------------------------------------------------------------------------

export type UserRef = { id: string; display_name: string }

export type Partner = {
  id: string
  name: string
  legal_name: string | null
  ico: string | null
  dic: string | null
  country: string
  city: string | null
  website: string | null
  segment: PartnerSegment
  tier: PartnerTier | null
  status: PartnerStatus
  owner: UserRef | null
  acquisition_source: string | null
  acquired_at: string | null
  acquired_by: UserRef | null
  languages: string[]
  notes: string | null
  created_at: string
  updated_at: string
}

/** Kontakt se předává do maskContact — proto typový alias (index signature). */
export type PartnerContact = {
  id: string
  partner_id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  position: string | null
  is_primary: boolean
  newsletter_opt_in: boolean
  lawful_basis: LawfulBasis | null
  consent_basis: ConsentBasis | null
  opt_in_source: string | null
  opt_in_at: string | null
  opt_in_evidence: string | null
  unsubscribed_at: string | null
  anonymized_at: string | null
  created_at: string
  updated_at: string
}

export type Interaction = {
  id: string
  partner_id: string
  contact_id: string | null
  contact_name: string | null
  type: InteractionType
  occurred_at: string
  subject: string
  body: string | null
  created_by: string | null
  created_by_name: string | null
  created_at: string
}

export type PrimaryContactRef = {
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
}

export type PartnerListItem = {
  id: string
  name: string
  ico: string | null
  country: string
  city: string | null
  website: string | null
  segment: PartnerSegment
  tier: PartnerTier | null
  status: PartnerStatus
  owner: UserRef | null
  primary_contact: PrimaryContactRef | null
  contacts_count: number
  updated_at: string
}

export interface PartnerListFilter {
  q: string | null
  segment: PartnerSegment | null
  status: PartnerStatus | null
  tier: PartnerTier | null
  country: string | null
  page: number
  sort: 'name' | 'updated_at'
  dir: 'asc' | 'desc'
}

export type Validation<T> = { ok: true; values: T } | { ok: false; message: string }

/** Hodnoty připravené k zápisu: klíč = whitelistovaný sloupec. */
export type ColumnValues = Record<string, unknown>

// ---------------------------------------------------------------------------
// Validace vstupů (čisté funkce — testované v tests/crm-validate.test.ts)
// ---------------------------------------------------------------------------

class InputError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Escapuje zástupné znaky pro ILIKE (vzor se posílá jako parametr). */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`)
}

/**
 * IČO: 8 číslic, poslední je kontrolní. Vážený součet prvních sedmi číslic
 * s vahami 8..2, zbytek po dělení 11; 0 → 1, 1 → 0, jinak 11 − zbytek.
 */
export function isValidIco(ico: string): boolean {
  if (typeof ico !== 'string' || !/^[0-9]{8}$/.test(ico)) return false
  let sum = 0
  for (let i = 0; i < 7; i += 1) sum += Number(ico[i]) * (8 - i)
  const rest = sum % 11
  const check = rest === 0 ? 1 : rest === 1 ? 0 : 11 - rest
  return check === Number(ico[7])
}

export function normalizeEmail(value: string): string | null {
  const email = value.trim().toLowerCase()
  if (!email || email.length > 320) return null
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null
}

/** Doplní chybějící schéma a odmítne cokoli jiného než http(s). */
export function normalizeWebsite(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 500) return null
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  if (!url.hostname.includes('.')) return null
  return candidate
}

/** null i prázdný řetězec znamenají „vyprázdnit"; undefined = pole neposláno. */
function textField(value: unknown, field: string, max: number): string | null {
  if (value === null) return null
  if (typeof value !== 'string') throw new InputError(`invalid_${field}`)
  const trimmed = value.trim()
  if (trimmed === '') return null
  if (trimmed.length > max) throw new InputError(`invalid_${field}`)
  return trimmed
}

function enumField<T extends string>(value: unknown, field: string, allowed: readonly T[]): T | null {
  if (value === null) return null
  if (typeof value !== 'string') throw new InputError(`invalid_${field}`)
  const trimmed = value.trim()
  if (trimmed === '') return null
  if (!(allowed as readonly string[]).includes(trimmed)) throw new InputError(`invalid_${field}`)
  return trimmed as T
}

function boolField(value: unknown, field: string): boolean {
  if (typeof value !== 'boolean') throw new InputError(`invalid_${field}`)
  return value
}

export function isUuid(value: string | undefined): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

function uuidField(value: unknown, field: string): string | null {
  if (value === null) return null
  if (typeof value !== 'string') throw new InputError(`invalid_${field}`)
  const trimmed = value.trim()
  if (trimmed === '') return null
  if (!isUuid(trimmed)) throw new InputError(`invalid_${field}`)
  return trimmed.toLowerCase()
}

/** Sloupce typu date: bere YYYY-MM-DD i celé ISO razítko (ořízne se na den). */
function dateField(value: unknown, field: string): string | null {
  const text = textField(value, field, 40)
  if (text === null) return null
  const match = /^(\d{4}-\d{2}-\d{2})(?:[T ].*)?$/.exec(text)
  if (!match || Number.isNaN(Date.parse(match[1]))) throw new InputError(`invalid_${field}`)
  return match[1]
}

function timestampField(value: unknown, field: string): string | null {
  const text = textField(value, field, 40)
  if (text === null) return null
  const parsed = Date.parse(text)
  if (Number.isNaN(parsed)) throw new InputError(`invalid_${field}`)
  return new Date(parsed).toISOString()
}

function icoField(value: unknown): string | null {
  const text = textField(value, 'ico', 8)
  if (text === null) return null
  if (!isValidIco(text)) throw new InputError('invalid_ico')
  return text
}

function countryField(value: unknown): string {
  const text = textField(value, 'country', 2)
  if (text === null) throw new InputError('invalid_country')
  const code = text.toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) throw new InputError('invalid_country')
  return code
}

function languagesField(value: unknown): string[] {
  if (value === null) return []
  if (!Array.isArray(value)) throw new InputError('invalid_languages')
  const out: string[] = []
  for (const item of value) {
    if (typeof item !== 'string') throw new InputError('invalid_languages')
    const lang = item.trim().toLowerCase()
    if (!(LANGUAGES as readonly string[]).includes(lang)) throw new InputError('invalid_languages')
    if (!out.includes(lang)) out.push(lang)
  }
  return out
}

function phoneField(value: unknown): string | null {
  const text = textField(value, 'phone', 40)
  if (text === null) return null
  if (!/^[+()\d\s./-]{6,40}$/.test(text)) throw new InputError('invalid_phone')
  return text
}

function wrap<T>(fn: () => T): Validation<T> {
  try {
    return { ok: true, values: fn() }
  } catch (err) {
    if (err instanceof InputError) return { ok: false, message: err.message }
    throw err
  }
}

/**
 * Vstup partnera. mode 'create' doplní povinná pole a výchozí hodnoty,
 * mode 'patch' vrací jen skutečně poslané sloupce. Neznámá pole se ignorují.
 */
export function parsePartnerInput(input: unknown, mode: 'create' | 'patch'): Validation<ColumnValues> {
  return wrap(() => {
    if (!isRecord(input)) throw new InputError('bad_request')
    const values: ColumnValues = {}
    const has = (key: string): boolean => Object.prototype.hasOwnProperty.call(input, key) && input[key] !== undefined

    if (has('name')) {
      const name = textField(input.name, 'name', 300)
      if (name === null) throw new InputError('invalid_name')
      values.name = name
    } else if (mode === 'create') {
      throw new InputError('invalid_name')
    }

    if (has('legal_name')) values.legal_name = textField(input.legal_name, 'legal_name', 300)
    if (has('ico')) values.ico = icoField(input.ico)
    if (has('dic')) values.dic = textField(input.dic, 'dic', 20)
    if (has('country')) values.country = countryField(input.country)
    else if (mode === 'create') values.country = 'CZ'
    if (has('city')) values.city = textField(input.city, 'city', 120)
    if (has('website')) {
      const raw = textField(input.website, 'website', 500)
      if (raw === null) values.website = null
      else {
        const website = normalizeWebsite(raw)
        if (website === null) throw new InputError('invalid_website')
        values.website = website
      }
    }
    if (has('segment')) {
      const segment = enumField(input.segment, 'segment', SEGMENTS)
      if (segment === null) throw new InputError('invalid_segment')
      values.segment = segment
    } else if (mode === 'create') values.segment = 'other'
    if (has('tier')) values.tier = enumField(input.tier, 'tier', TIERS)
    if (has('status')) {
      const status = enumField(input.status, 'status', STATUSES)
      if (status === null) throw new InputError('invalid_status')
      values.status = status
    } else if (mode === 'create') values.status = 'prospect'
    if (has('owner_user_id')) values.owner_user_id = uuidField(input.owner_user_id, 'owner_user_id')
    if (has('languages')) values.languages = languagesField(input.languages)
    else if (mode === 'create') values.languages = []
    if (has('notes')) values.notes = textField(input.notes, 'notes', 20_000)

    return values
  })
}

export function parseContactInput(input: unknown, mode: 'create' | 'patch'): Validation<ColumnValues> {
  return wrap(() => {
    if (!isRecord(input)) throw new InputError('bad_request')
    const values: ColumnValues = {}
    const has = (key: string): boolean => Object.prototype.hasOwnProperty.call(input, key) && input[key] !== undefined

    if (has('first_name')) values.first_name = textField(input.first_name, 'first_name', 120) ?? ''
    else if (mode === 'create') values.first_name = ''
    if (has('last_name')) values.last_name = textField(input.last_name, 'last_name', 120) ?? ''
    else if (mode === 'create') values.last_name = ''
    if (has('email')) {
      const raw = textField(input.email, 'email', 320)
      if (raw === null) values.email = null
      else {
        const email = normalizeEmail(raw)
        if (email === null) throw new InputError('invalid_email')
        values.email = email
      }
    }
    if (has('phone')) values.phone = phoneField(input.phone)
    if (has('position')) values.position = textField(input.position, 'position', 160)
    if (has('is_primary')) values.is_primary = boolField(input.is_primary, 'is_primary')
    if (has('newsletter_opt_in')) values.newsletter_opt_in = boolField(input.newsletter_opt_in, 'newsletter_opt_in')
    else if (mode === 'create') values.newsletter_opt_in = false
    if (has('lawful_basis')) values.lawful_basis = enumField(input.lawful_basis, 'lawful_basis', LAWFUL_BASES)
    if (has('consent_basis')) values.consent_basis = enumField(input.consent_basis, 'consent_basis', CONSENT_BASES)
    if (has('opt_in_source')) values.opt_in_source = textField(input.opt_in_source, 'opt_in_source', 200)
    if (has('opt_in_at')) values.opt_in_at = dateField(input.opt_in_at, 'opt_in_at')
    if (has('opt_in_evidence')) values.opt_in_evidence = textField(input.opt_in_evidence, 'opt_in_evidence', 2000)

    return values
  })
}

export function parseInteractionInput(input: unknown): Validation<ColumnValues> {
  return wrap(() => {
    if (!isRecord(input)) throw new InputError('bad_request')
    const values: ColumnValues = {}
    const type = enumField(input.type, 'type', INTERACTION_TYPES)
    if (type === null) throw new InputError('invalid_type')
    values.type = type
    const subject = textField(input.subject, 'subject', 300)
    if (subject === null) throw new InputError('invalid_subject')
    values.subject = subject
    values.occurred_at =
      input.occurred_at === undefined || input.occurred_at === null
        ? new Date().toISOString()
        : (timestampField(input.occurred_at, 'occurred_at') ?? new Date().toISOString())
    values.body = input.body === undefined ? null : textField(input.body, 'body', 20_000)
    values.contact_id = input.contact_id === undefined ? null : uuidField(input.contact_id, 'contact_id')
    return values
  })
}

/** Query string výpisu partnerů — validuje filtry i whitelist řazení. */
export function parsePartnerListQuery(params: URLSearchParams): Validation<PartnerListFilter> {
  return wrap(() => {
    const term = (params.get('q') ?? '').trim()
    const segment = enumField(params.get('segment'), 'segment', SEGMENTS)
    const status = enumField(params.get('status'), 'status', STATUSES)
    const tier = enumField(params.get('tier'), 'tier', TIERS)
    const countryRaw = (params.get('country') ?? '').trim()
    if (countryRaw && !/^[A-Za-z]{2}$/.test(countryRaw)) throw new InputError('invalid_country')
    const sortRaw = (params.get('sort') ?? 'updated_at').trim()
    if (sortRaw !== 'name' && sortRaw !== 'updated_at') throw new InputError('invalid_sort')
    const dirRaw = (params.get('dir') ?? 'desc').trim().toLowerCase()
    if (dirRaw !== 'asc' && dirRaw !== 'desc') throw new InputError('invalid_dir')
    const pageNum = Number(params.get('page') ?? 1)
    const page = Number.isFinite(pageNum) ? Math.max(1, Math.floor(pageNum)) : 1

    return {
      q: term === '' ? null : term.slice(0, 200),
      segment,
      status,
      tier,
      country: countryRaw === '' ? null : countryRaw.toUpperCase(),
      page,
      sort: sortRaw,
      dir: dirRaw,
    }
  })
}

/** Sestaví WHERE výpisu. Sloupce jsou konstanty, hodnoty jdou jako parametry. */
export function buildPartnerListWhere(filter: PartnerListFilter): { where: string; params: unknown[] } {
  const clauses: string[] = []
  const params: unknown[] = []

  if (filter.q) {
    params.push(`%${escapeLike(filter.q)}%`)
    const i = params.length
    const like = `(p.name ILIKE $${i} ESCAPE '\\' OR p.legal_name ILIKE $${i} ESCAPE '\\')`
    if (/^[0-9]{8}$/.test(filter.q)) {
      params.push(filter.q)
      clauses.push(`(${like} OR p.ico = $${params.length})`)
    } else {
      clauses.push(like)
    }
  }
  const exact: [string, string | null][] = [
    ['p.segment', filter.segment],
    ['p.status', filter.status],
    ['p.tier', filter.tier],
    ['p.country', filter.country],
  ]
  for (const [column, value] of exact) {
    if (value !== null) {
      params.push(value)
      clauses.push(`${column} = $${params.length}`)
    }
  }
  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
}

// ---------------------------------------------------------------------------
// Whitelist zapisovatelných sloupců
// ---------------------------------------------------------------------------

const PARTNER_COLUMNS = new Set([
  'name', 'legal_name', 'ico', 'dic', 'country', 'city', 'website',
  'segment', 'tier', 'status', 'owner_user_id', 'languages', 'notes',
])

const CONTACT_COLUMNS = new Set([
  'first_name', 'last_name', 'email', 'phone', 'position', 'is_primary',
  'newsletter_opt_in', 'lawful_basis', 'consent_basis', 'opt_in_source',
  'opt_in_at', 'opt_in_evidence',
])

/** date sloupce čteme jako text, aby diff porovnával stejný tvar jako vstup. */
function selectExpr(column: string): string {
  return column === 'opt_in_at' ? `${column}::text AS ${column}` : column
}

function assertColumns(values: ColumnValues, allowed: Set<string>): string[] {
  const columns = Object.keys(values)
  for (const column of columns) {
    if (!allowed.has(column)) throw new Error(`Nepovolený sloupec: ${column}`)
  }
  return columns
}

function sameValue(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) || Array.isArray(b)) return JSON.stringify(a) === JSON.stringify(b)
  return a === b
}

function isUniqueViolation(err: unknown): boolean {
  return isRecord(err) && err.code === '23505'
}

// ---------------------------------------------------------------------------
// Partneři
// ---------------------------------------------------------------------------

const OWNER_REF = (alias: string): string =>
  `CASE WHEN ${alias}.id IS NULL THEN NULL
        ELSE jsonb_build_object('id', ${alias}.id, 'display_name', ${alias}.display_name) END`

export async function listPartners(
  filter: PartnerListFilter,
): Promise<{ items: PartnerListItem[]; total: number }> {
  const { where, params } = buildPartnerListWhere(filter)
  const orderColumn = filter.sort === 'name' ? 'p.name' : 'p.updated_at'
  const orderDir = filter.dir === 'asc' ? 'ASC' : 'DESC'
  const offset = (filter.page - 1) * PARTNERS_PAGE_SIZE

  const items = await q<PartnerListItem>(
    `SELECT p.id, p.name, p.ico, p.country, p.city, p.website, p.segment, p.tier, p.status,
            p.updated_at,
            ${OWNER_REF('o')} AS owner,
            (SELECT count(*)::int FROM crm.partner_contacts c WHERE c.partner_id = p.id) AS contacts_count,
            CASE WHEN pc.id IS NULL THEN NULL
                 ELSE jsonb_build_object('first_name', pc.first_name, 'last_name', pc.last_name,
                                         'email', pc.email::text, 'phone', pc.phone) END AS primary_contact
     FROM crm.partners p
     LEFT JOIN crm.portal_users o ON o.id = p.owner_user_id
     LEFT JOIN LATERAL (
       SELECT c.id, c.first_name, c.last_name, c.email, c.phone
       FROM crm.partner_contacts c
       WHERE c.partner_id = p.id AND c.is_primary
       ORDER BY c.created_at
       LIMIT 1
     ) pc ON true
     ${where}
     ORDER BY ${orderColumn} ${orderDir}, p.id ASC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, PARTNERS_PAGE_SIZE, offset],
  )
  const total = await qOne<{ n: string }>(
    `SELECT count(*) AS n FROM crm.partners p ${where}`,
    params,
  )
  return { items, total: Number(total?.n ?? 0) }
}

export async function getPartner(id: string): Promise<Partner | null> {
  return qOne<Partner>(
    `SELECT p.id, p.name, p.legal_name, p.ico, p.dic, p.country, p.city, p.website,
            p.segment, p.tier, p.status, p.acquisition_source, p.acquired_at::text AS acquired_at,
            p.languages, p.notes, p.created_at, p.updated_at,
            ${OWNER_REF('o')} AS owner,
            ${OWNER_REF('a')} AS acquired_by
     FROM crm.partners p
     LEFT JOIN crm.portal_users o ON o.id = p.owner_user_id
     LEFT JOIN crm.portal_users a ON a.id = p.acquired_by
     WHERE p.id = $1`,
    [id],
  )
}

export async function createPartner(
  values: ColumnValues,
  actorId: string,
): Promise<{ id: string } | { error: 'ico_exists' }> {
  const columns = assertColumns(values, PARTNER_COLUMNS)
  const params = columns.map((c) => values[c])
  // acquisition_source / acquired_by / acquired_at nastavuje server, ne vstup
  const allColumns = [...columns, 'acquisition_source', 'acquired_by', 'acquired_at']
  const placeholders = [
    ...columns.map((_, i) => `$${i + 1}`),
    `'manual'`,
    `$${columns.length + 1}`,
    'CURRENT_DATE',
  ]
  try {
    const row = await qOne<{ id: string }>(
      `INSERT INTO crm.partners (${allColumns.join(', ')})
       VALUES (${placeholders.join(', ')})
       RETURNING id`,
      [...params, actorId],
    )
    if (!row) throw new Error('Partnera se nepodařilo založit')
    return { id: row.id }
  } catch (err) {
    if (isUniqueViolation(err)) return { error: 'ico_exists' }
    throw err
  }
}

export type UpdateResult =
  | { ok: true; diff: Record<string, [unknown, unknown]> }
  | { error: 'not_found' | 'ico_exists' }

export async function updatePartner(id: string, values: ColumnValues): Promise<UpdateResult> {
  const columns = assertColumns(values, PARTNER_COLUMNS)
  try {
    return await withTx(async (client) => {
      const current = await client.query(
        `SELECT ${['id', ...columns].map(selectExpr).join(', ')}
         FROM crm.partners WHERE id = $1 FOR UPDATE`,
        [id],
      )
      const before = current.rows[0]
      if (!before) return { error: 'not_found' as const }

      const diff: Record<string, [unknown, unknown]> = {}
      const changed = columns.filter((c) => !sameValue(before[c], values[c]))
      for (const column of changed) diff[column] = [before[column], values[column]]
      if (changed.length > 0) {
        await client.query(
          `UPDATE crm.partners SET ${changed.map((c, i) => `${c} = $${i + 2}`).join(', ')} WHERE id = $1`,
          [id, ...changed.map((c) => values[c])],
        )
      }
      return { ok: true as const, diff }
    })
  } catch (err) {
    if (isUniqueViolation(err)) return { error: 'ico_exists' }
    throw err
  }
}

export async function deletePartner(id: string): Promise<{ name: string; ico: string | null } | null> {
  return qOne<{ name: string; ico: string | null }>(
    `DELETE FROM crm.partners WHERE id = $1 RETURNING name, ico`,
    [id],
  )
}

// ---------------------------------------------------------------------------
// Kontakty
// ---------------------------------------------------------------------------

const CONTACT_SELECT = `SELECT c.id, c.partner_id, c.first_name, c.last_name, c.email::text AS email, c.phone,
       c.position, c.is_primary, c.newsletter_opt_in, c.lawful_basis, c.consent_basis,
       c.opt_in_source, c.opt_in_at::text AS opt_in_at, c.opt_in_evidence,
       c.unsubscribed_at, c.anonymized_at, c.created_at, c.updated_at
  FROM crm.partner_contacts c`

export async function listPartnerContacts(partnerId: string): Promise<PartnerContact[]> {
  return q<PartnerContact>(
    `${CONTACT_SELECT} WHERE c.partner_id = $1 ORDER BY c.is_primary DESC, c.created_at`,
    [partnerId],
  )
}

/** is_primary = true shodí příznak ostatním kontaktům partnera (v transakci). */
export async function createContact(
  partnerId: string,
  values: ColumnValues,
): Promise<{ id: string } | { error: 'not_found' }> {
  const columns = assertColumns(values, CONTACT_COLUMNS)
  return withTx(async (client) => {
    const partner = await client.query(`SELECT id FROM crm.partners WHERE id = $1 FOR UPDATE`, [partnerId])
    if (partner.rows.length === 0) return { error: 'not_found' as const }
    if (values.is_primary === true) {
      await client.query(
        `UPDATE crm.partner_contacts SET is_primary = false WHERE partner_id = $1 AND is_primary`,
        [partnerId],
      )
    }
    const allColumns = ['partner_id', ...columns]
    const placeholders = allColumns.map((_, i) => `$${i + 1}`)
    const inserted = await client.query(
      `INSERT INTO crm.partner_contacts (${allColumns.join(', ')})
       VALUES (${placeholders.join(', ')}) RETURNING id`,
      [partnerId, ...columns.map((c) => values[c])],
    )
    return { id: String(inserted.rows[0].id) }
  })
}

export type ContactUpdateResult =
  | { ok: true; partnerId: string; diff: Record<string, [unknown, unknown]> }
  | { error: 'not_found' }

export async function updateContact(id: string, values: ColumnValues): Promise<ContactUpdateResult> {
  const columns = assertColumns(values, CONTACT_COLUMNS)
  return withTx(async (client) => {
    const current = await client.query(
      `SELECT ${['id', 'partner_id', ...columns].map(selectExpr).join(', ')}
       FROM crm.partner_contacts WHERE id = $1 FOR UPDATE`,
      [id],
    )
    const before = current.rows[0]
    if (!before) return { error: 'not_found' as const }
    const partnerId = String(before.partner_id)

    const diff: Record<string, [unknown, unknown]> = {}
    const changed = columns.filter((c) => !sameValue(before[c], values[c]))
    for (const column of changed) diff[column] = [before[column], values[column]]
    if (changed.includes('is_primary') && values.is_primary === true) {
      await client.query(
        `UPDATE crm.partner_contacts SET is_primary = false WHERE partner_id = $1 AND is_primary AND id <> $2`,
        [partnerId, id],
      )
    }
    if (changed.length > 0) {
      await client.query(
        `UPDATE crm.partner_contacts SET ${changed.map((c, i) => `${c} = $${i + 2}`).join(', ')} WHERE id = $1`,
        [id, ...changed.map((c) => values[c])],
      )
    }
    return { ok: true as const, partnerId, diff }
  })
}

export async function deleteContact(id: string): Promise<{ partner_id: string } | null> {
  return qOne<{ partner_id: string }>(
    `DELETE FROM crm.partner_contacts WHERE id = $1 RETURNING partner_id`,
    [id],
  )
}

/**
 * GDPR výmaz: osobní pole se vyprázdní, agregáty a vazby zůstávají.
 * mailerlite_subscriber_id se ZÁMĚRNĚ ponechává — bez něj by nešlo kontakt
 * později odhlásit v MailerLite synchronizaci.
 */
export async function anonymizeContact(id: string): Promise<{ partner_id: string } | null> {
  return qOne<{ partner_id: string }>(
    `UPDATE crm.partner_contacts
     SET first_name = '', last_name = '', email = NULL, phone = NULL, position = NULL,
         opt_in_evidence = NULL, newsletter_opt_in = false, anonymized_at = now()
     WHERE id = $1
     RETURNING partner_id`,
    [id],
  )
}

// ---------------------------------------------------------------------------
// Interakce
// ---------------------------------------------------------------------------

export async function listPartnerInteractions(
  partnerId: string,
  limit = INTERACTIONS_LIMIT,
): Promise<Interaction[]> {
  return q<Interaction>(
    `SELECT i.id, i.partner_id, i.contact_id, i.type, i.occurred_at, i.subject, i.body,
            i.created_at, i.created_by,
            nullif(btrim(concat_ws(' ', c.first_name, c.last_name)), '') AS contact_name,
            u.display_name AS created_by_name
     FROM crm.interactions i
     LEFT JOIN crm.partner_contacts c ON c.id = i.contact_id
     LEFT JOIN crm.portal_users u ON u.id = i.created_by
     WHERE i.partner_id = $1
     ORDER BY i.occurred_at DESC, i.id DESC
     LIMIT $2`,
    [partnerId, limit],
  )
}

export async function createInteraction(
  partnerId: string,
  values: ColumnValues,
  actorId: string,
): Promise<{ id: string } | { error: 'not_found' | 'invalid_contact' }> {
  return withTx(async (client) => {
    const partner = await client.query(`SELECT id FROM crm.partners WHERE id = $1`, [partnerId])
    if (partner.rows.length === 0) return { error: 'not_found' as const }
    const contactId = values.contact_id === undefined ? null : (values.contact_id as string | null)
    if (contactId) {
      // kontakt musí patřit témuž partnerovi
      const contact = await client.query(
        `SELECT id FROM crm.partner_contacts WHERE id = $1 AND partner_id = $2`,
        [contactId, partnerId],
      )
      if (contact.rows.length === 0) return { error: 'invalid_contact' as const }
    }
    const inserted = await client.query(
      `INSERT INTO crm.interactions (partner_id, contact_id, type, occurred_at, subject, body, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [partnerId, contactId, values.type, values.occurred_at, values.subject, values.body ?? null, actorId],
    )
    return { id: String(inserted.rows[0].id) }
  })
}

export async function deleteInteraction(
  id: string,
): Promise<{ partner_id: string; type: string } | null> {
  return qOne<{ partner_id: string; type: string }>(
    `DELETE FROM crm.interactions WHERE id = $1 RETURNING partner_id, type`,
    [id],
  )
}
