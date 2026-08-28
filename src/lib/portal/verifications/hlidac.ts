import { env } from '../env'

/**
 * Klient datového API Hlídače státu pro prověrku partnerů (NAVRH 5.5).
 *
 * Dvě zásady, které tenhle soubor drží:
 *
 * 1. GDPR čl. 9 (audit, NAVRH 5.5): do výsledku se z odpovědí KOPÍRUJE jen
 *    whitelist polí níže — projekce, ne blacklist. Pole jako
 *    `political_Involvement` u jednatelů se tak nemohou dostat do `raw`
 *    ani omylem, ať API vrátí cokoliv. Ověřujeme firmu, ne lidi.
 * 2. Riziko nese `as_Debtor`, ne počet záznamů — velká zdravá CK bývá
 *    věřitelem v cizích insolvencích (ověřeno na reálných datech).
 *
 * Licence: každý výsledek nese source_url a copyright; UI zobrazuje odkaz
 * na kartu subjektu (podmínky užití: texty.hlidacstatu.cz/licence/).
 * Rate limit API: max 4 požadavky/s — klient volá sekvenčně s rozestupem.
 */

const BASE = 'https://api.hlidacstatu.cz/api/v2'
const REQUEST_GAP_MS = 300

export class HlidacError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(`Hlídač státu ${status}: ${message}`)
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function hlidacFetch(path: string): Promise<unknown> {
  const token = env('HLIDAC_TOKEN')
  if (!token) throw new HlidacError(0, 'HLIDAC_TOKEN není nastaven')
  const response = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Token ${token}`, Accept: 'application/json' },
    redirect: 'manual', // bez tokenu API přesměrovává na login — to je chyba, ne odpověď
    signal: AbortSignal.timeout(15_000),
  })
  if (response.status >= 300 && response.status < 400) {
    throw new HlidacError(response.status, 'přesměrování — neplatný nebo chybějící token')
  }
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new HlidacError(response.status, body.slice(0, 300))
  }
  return response.json()
}

// ---------------------------------------------------------------------------
// Whitelist projekce odpovědí (čl. 9 — nic jiného se nikdy neukládá)
// ---------------------------------------------------------------------------

export interface InsolvencyRecord {
  file_number: string | null
  state: string | null
  state_description: string | null
  started_on: string | null
  last_changed_on: string | null
  court: string | null
  as_debtor: boolean
  as_creditor: boolean
  detail_url: string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function str(value: unknown): string | null {
  return typeof value === 'string' && value !== '' ? value : null
}

function bool(value: unknown): boolean {
  return value === true
}

/** Projekce jednoho insolvenčního řízení — JEN tato pole, nic víc. */
export function projectInsolvency(item: unknown): InsolvencyRecord | null {
  if (!isRecord(item)) return null
  return {
    file_number: str(item.file_Number ?? item.fileNumber),
    state: str(item.state),
    state_description: str(item.state_Description ?? item.stateDescription),
    started_on: str(item.started_On ?? item.startedOn),
    last_changed_on: str(item.last_Changed_On ?? item.lastChangedOn),
    court: str(item.court),
    as_debtor: bool(item.as_Debtor ?? item.asDebtor),
    as_creditor: bool(item.as_Creditor ?? item.asCreditor),
    detail_url: str(item.detail_Url ?? item.detailUrl),
  }
}

export interface VatStatus {
  is_currently_unreliable: boolean
  was_ever_listed: boolean
}

export interface CriminalStatus {
  records_count: number
}

export interface BusinessInfo {
  employees_band: string | null
  turnover_band: string | null
  vat_payer_status: string | null
}

export interface VerificationSnapshot {
  ico: string
  insolvencies: InsolvencyRecord[]
  vat: VatStatus | null
  criminal: CriminalStatus | null
  business: BusinessInfo | null
  source_url: string
  errors: string[]
}

// ---------------------------------------------------------------------------
// Načtení všech zdrojů pro jedno IČO (sekvenčně kvůli rate limitu)
// ---------------------------------------------------------------------------

const MAX_INSOLVENCY_PAGES = 10

export async function fetchVerificationSnapshot(ico: string): Promise<VerificationSnapshot> {
  const errors: string[] = []
  const snapshot: VerificationSnapshot = {
    ico,
    insolvencies: [],
    vat: null,
    criminal: null,
    business: null,
    source_url: `https://www.hlidacstatu.cz/subjekt/${ico}`,
    errors,
  }

  try {
    for (let page = 1; page <= MAX_INSOLVENCY_PAGES; page += 1) {
      const raw = await hlidacFetch(
        `/insolvence/hledat?dotaz=${encodeURIComponent(`ico:${ico}`)}&strana=${page}`,
      )
      const items = isRecord(raw)
        ? ((raw.records ?? raw.results ?? raw.rizeni ?? []) as unknown[])
        : []
      for (const item of items) {
        const projected = projectInsolvency(item)
        if (projected) snapshot.insolvencies.push(projected)
      }
      const totalPages = isRecord(raw) ? Number(raw.total_Pages ?? raw.totalPages ?? 1) : 1
      if (page >= totalPages || items.length === 0) break
      await sleep(REQUEST_GAP_MS)
    }
  } catch (err) {
    errors.push(`insolvence: ${err instanceof Error ? err.message : 'chyba'}`)
  }

  await sleep(REQUEST_GAP_MS)
  try {
    const raw = await hlidacFetch(`/firmy/nespolehlivyplatce/${encodeURIComponent(ico)}`)
    if (isRecord(raw)) {
      snapshot.vat = {
        is_currently_unreliable: bool(raw.is_Currently_Unreliable ?? raw.isCurrentlyUnreliable ?? raw.nespolehlivyPlatce),
        was_ever_listed: bool(raw.was_Ever_Listed ?? raw.wasEverListed),
      }
    }
  } catch (err) {
    errors.push(`dph: ${err instanceof Error ? err.message : 'chyba'}`)
  }

  await sleep(REQUEST_GAP_MS)
  try {
    const raw = await hlidacFetch(`/firmy/rejstriktrestu/${encodeURIComponent(ico)}`)
    if (isRecord(raw)) {
      const list = (raw.records ?? raw.zaznamy ?? []) as unknown[]
      snapshot.criminal = { records_count: Array.isArray(list) ? list.length : 0 }
    }
  } catch (err) {
    errors.push(`rejstrik-trestu: ${err instanceof Error ? err.message : 'chyba'}`)
  }

  await sleep(REQUEST_GAP_MS)
  try {
    const raw = await hlidacFetch(`/firmy/GetDetailInfo?icos=${encodeURIComponent(ico)}`)
    const detail = Array.isArray(raw) ? raw[0] : raw
    if (isRecord(detail)) {
      snapshot.business = {
        employees_band: str(detail.employees_Band ?? detail.pocetZamestnancuBand ?? detail.employees),
        turnover_band: str(detail.turnover_Band ?? detail.obratBand ?? detail.turnover),
        vat_payer_status: str(detail.vat_Payer_Status ?? detail.platceDph),
      }
      const sourceUrl = str(detail.source_Url ?? detail.sourceUrl)
      if (sourceUrl) snapshot.source_url = sourceUrl
    }
  } catch (err) {
    errors.push(`detail: ${err instanceof Error ? err.message : 'chyba'}`)
  }

  return snapshot
}

// ---------------------------------------------------------------------------
// Vyhodnocení rizika (čisté funkce — testované)
// ---------------------------------------------------------------------------

/** Stavy, které čteme jako pravomocně skončené řízení. */
const ENDED_STATE_PATTERN = /SKON[CČ]|ZASTAV|ODMÍTN|ODMITN|PRAVOMOC|VY[ŘR]ÍZEN|VYRIZEN/i

export function isEndedInsolvency(state: string | null, stateDescription: string | null): boolean {
  const text = `${state ?? ''} ${stateDescription ?? ''}`
  return ENDED_STATE_PATTERN.test(text)
}

export type RiskLevel = 'ok' | 'watch' | 'alert'

export interface RiskInputs {
  insolvencies: InsolvencyRecord[]
  vat: VatStatus | null
  criminal: CriminalStatus | null
  now?: Date
}

export interface RiskResult {
  level: RiskLevel
  insolvency_as_debtor_open: boolean
  insolvency_as_debtor_count: number
  reasons: string[]
}

/**
 * alert: otevřená insolvence JAKO DLUŽNÍK, aktuálně nespolehlivý plátce DPH,
 *        nebo záznam v trestním rejstříku právnických osob
 * watch: pravomocně skončená insolvence jako dlužník za poslední 3 roky,
 *        nebo dřívější zápis mezi nespolehlivé plátce
 * ok:    vše ostatní — včetně libovolného počtu řízení, kde je partner věřitelem
 *
 * Nejednoznačný stav řízení (nelze určit skončení) se u dlužníka čte jako
 * otevřené — falešný poplach je levnější než přehlédnutá insolvence.
 */
export function evaluateRisk(inputs: RiskInputs): RiskResult {
  const now = inputs.now ?? new Date()
  const asDebtor = inputs.insolvencies.filter((i) => i.as_debtor)
  const openAsDebtor = asDebtor.filter((i) => !isEndedInsolvency(i.state, i.state_description))
  const threeYearsAgo = new Date(now.getTime() - 3 * 365 * 24 * 3600 * 1000)
  const recentEndedAsDebtor = asDebtor.filter((i) => {
    if (!isEndedInsolvency(i.state, i.state_description)) return false
    const changed = i.last_changed_on ? new Date(i.last_changed_on) : null
    return changed !== null && changed > threeYearsAgo
  })

  const reasons: string[] = []
  let level: RiskLevel = 'ok'

  if (inputs.criminal && inputs.criminal.records_count > 0) {
    level = 'alert'
    reasons.push(`${inputs.criminal.records_count} záznamů v trestním rejstříku právnických osob`)
  }
  if (inputs.vat?.is_currently_unreliable) {
    level = 'alert'
    reasons.push('aktuálně nespolehlivý plátce DPH')
  }
  if (openAsDebtor.length > 0) {
    level = 'alert'
    reasons.push(`otevřená insolvence jako dlužník (${openAsDebtor.length})`)
  }
  if (level !== 'alert') {
    if (recentEndedAsDebtor.length > 0) {
      level = 'watch'
      reasons.push('skončená insolvence jako dlužník za poslední 3 roky')
    }
    if (inputs.vat?.was_ever_listed) {
      level = 'watch'
      reasons.push('dříve zapsán mezi nespolehlivé plátce DPH')
    }
  }

  return {
    level,
    insolvency_as_debtor_open: openAsDebtor.length > 0,
    insolvency_as_debtor_count: asDebtor.length,
    reasons,
  }
}
