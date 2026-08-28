import { q, qOne } from './db'
import { env } from './env'

/**
 * Párování plátců z PMS na partnery (NAVRH 6.2) a zpracování dávky
 * výkonnosti z intake. Párování potvrzuje VÝHRADNĚ člověk — automat jen
 * hledá přesnou shodu v už potvrzené mapovací tabulce; nespárovaný plátce
 * jde do fronty a jeho obrat se nikam nezapočítá.
 */

/** Normalizace jména plátce: bez diakritiky, malá písmena, bez právních forem. */
export function normalizePayerName(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(s\.?\s?r\.?\s?o\.?|spol\.?\s+s\s+r\.?\s?o\.?|a\.?\s?s\.?|gmbh\s*&\s*co\.?\s*kg|gmbh|k\.?\s?s\.?|v\.?\s?o\.?\s?s\.?|b\.?\s?v\.?|n\.?\s?v\.?|ag|se|z\.?\s?s\.?|o\.?\s?p\.?\s?s\.?|ltd\.?|inc\.?|llc)\b/gi, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export interface IntakeRow {
  payer_name_raw: string
  hotel_slug: string
  revenue_amount: number
  currency?: string
  room_nights?: number
  guests?: number
  bookings?: number
  cancellations?: number
}

export interface IntakeRowError {
  index: number
  error: string
}

/** Validace jedné řádky dávky — čistá funkce (testovaná). */
export function validateIntakeRow(row: unknown, index: number): { ok: IntakeRow } | { err: IntakeRowError } {
  if (typeof row !== 'object' || row === null) return { err: { index, error: 'bad_row' } }
  const r = row as Record<string, unknown>
  const name = typeof r.payer_name_raw === 'string' ? r.payer_name_raw.trim() : ''
  if (!name || name.length > 300) return { err: { index, error: 'invalid_payer_name' } }
  const hotel = typeof r.hotel_slug === 'string' ? r.hotel_slug.trim().slice(0, 40) : ''
  if (!hotel) return { err: { index, error: 'invalid_hotel_slug' } }
  const revenue = Number(r.revenue_amount)
  if (!Number.isFinite(revenue)) return { err: { index, error: 'invalid_revenue' } }
  const currency = typeof r.currency === 'string' && r.currency.trim() ? r.currency.trim().toUpperCase() : 'CZK'
  if (currency !== 'CZK' && currency !== 'EUR') return { err: { index, error: 'unsupported_currency' } }
  const optInt = (v: unknown): number | undefined => {
    if (v === undefined || v === null) return undefined
    const n = Number(v)
    return Number.isFinite(n) ? Math.round(n) : undefined
  }
  return {
    ok: {
      payer_name_raw: name,
      hotel_slug: hotel,
      revenue_amount: Math.round(revenue * 100) / 100,
      currency,
      room_nights: optInt(r.room_nights),
      guests: optInt(r.guests),
      bookings: optInt(r.bookings),
      cancellations: optInt(r.cancellations),
    },
  }
}

function fxCzkEur(): number {
  const fx = Number(env('PORTAL_FX_CZK_EUR') ?? '25')
  return Number.isFinite(fx) && fx > 0 ? fx : 25
}

/** Přepočet měny dělá VÝHRADNĚ portál (NAVRH 6.3) — jeden kurz, jedno číslo. */
export function toEur(amount: number, currency: string): { revenue_eur: number; fx_rate: number } {
  if (currency === 'EUR') return { revenue_eur: amount, fx_rate: 1 }
  const fx = fxCzkEur()
  return { revenue_eur: Math.round((amount / fx) * 100) / 100, fx_rate: fx }
}

export interface ProcessResult {
  matched: number
  skipped: number   // potvrzené ne-partner druhy (aggregate/direct/…)
  unmatched: number // ve frontě čeká na přiřazení
  errors: IntakeRowError[]
}

/**
 * Zpracuje dávku: spárované řádky upsertne do partner_performance,
 * nespárovaná jména založí do fronty mapování. Idempotentní — klíč
 * (partner_id, period_month, hotel_slug) přepisuje.
 */
export async function processPerformanceRows(
  rows: IntakeRow[],
  periodMonth: string, // 'YYYY-MM-01'
  importId: string | null,
): Promise<ProcessResult> {
  const result: ProcessResult = { matched: 0, skipped: 0, unmatched: 0, errors: [] }

  // mapování se čte jednou pro celou dávku
  const norms = [...new Set(rows.map((r) => normalizePayerName(r.payer_name_raw)))]
  const mapRows = await q<{ payer_name_norm: string; partner_id: string | null; kind: string | null; confirmed: boolean }>(
    `SELECT payer_name_norm, partner_id, kind, confirmed_at IS NOT NULL AS confirmed
     FROM crm.partner_payer_map WHERE payer_name_norm = ANY($1)`,
    [norms],
  )
  const mapping = new Map(mapRows.map((m) => [m.payer_name_norm, m]))

  for (const [index, row] of rows.entries()) {
    const norm = normalizePayerName(row.payer_name_raw)
    if (!norm) {
      result.errors.push({ index, error: 'empty_payer_name' })
      continue
    }
    const entry = mapping.get(norm)
    if (!entry || !entry.confirmed) {
      if (!entry) {
        await q(
          `INSERT INTO crm.partner_payer_map (payer_name_raw, payer_name_norm)
           VALUES ($1, $2) ON CONFLICT (payer_name_norm) DO NOTHING`,
          [row.payer_name_raw, norm],
        )
        mapping.set(norm, { payer_name_norm: norm, partner_id: null, kind: null, confirmed: false })
      }
      result.unmatched += 1
      continue
    }
    if (entry.kind !== 'partner' || !entry.partner_id) {
      // vědomé rozhodnutí: aggregate / direct / natural_person / ignore …
      result.skipped += 1
      continue
    }
    const { revenue_eur, fx_rate } = toEur(row.revenue_amount, row.currency ?? 'CZK')
    await q(
      `INSERT INTO crm.partner_performance
         (partner_id, period_month, hotel_slug, bookings, room_nights, guests, cancellations,
          revenue_amount, currency, fx_rate, revenue_eur, import_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (partner_id, period_month, hotel_slug) DO UPDATE SET
         bookings = EXCLUDED.bookings, room_nights = EXCLUDED.room_nights,
         guests = EXCLUDED.guests, cancellations = EXCLUDED.cancellations,
         revenue_amount = EXCLUDED.revenue_amount, currency = EXCLUDED.currency,
         fx_rate = EXCLUDED.fx_rate, revenue_eur = EXCLUDED.revenue_eur,
         import_id = EXCLUDED.import_id`,
      [
        entry.partner_id, periodMonth, row.hotel_slug,
        row.bookings ?? null, row.room_nights ?? null, row.guests ?? null, row.cancellations ?? null,
        row.revenue_amount, row.currency ?? 'CZK', fx_rate, revenue_eur, importId,
      ],
    )
    result.matched += 1
  }
  return result
}

/** Návrhy podobných jmen pro frontu mapování (pomůcka — potvrzuje člověk). */
export async function suggestPartnersForPayer(norm: string): Promise<
  { id: string; name: string; ico: string | null; similarity: number }[]
> {
  return q(
    `SELECT id, name, ico, similarity(name, $1)::float AS similarity
     FROM crm.partners
     WHERE similarity(name, $1) > 0.3
     ORDER BY similarity DESC, name
     LIMIT 5`,
    [norm],
  )
}

/** Dávky performance_pms se staging daty — pro přehrání po potvrzení mapování. */
export async function listPendingPmsBatches(): Promise<{ id: string; period: string }[]> {
  const rows = await q<{ id: string; period: string | null }>(
    `SELECT id, params->>'period_month' AS period
     FROM crm.imports
     WHERE kind = 'performance_pms' AND staging IS NOT NULL
     ORDER BY uploaded_at`,
  )
  return rows.filter((r): r is { id: string; period: string } => !!r.period)
}

export async function getBatchStaging(importId: string): Promise<IntakeRow[] | null> {
  const row = await qOne<{ staging: unknown }>(`SELECT staging FROM crm.imports WHERE id = $1`, [importId])
  if (!row || !Array.isArray(row.staging)) return null
  const rows: IntakeRow[] = []
  for (const [index, item] of (row.staging as unknown[]).entries()) {
    const validated = validateIntakeRow(item, index)
    if ('ok' in validated) rows.push(validated.ok)
  }
  return rows
}
