import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { q, qOne } from '../../../../lib/portal/db'
import { parseMonth, toMonthLabel } from '../../../../lib/portal/imports/excel'

export const prerender = false

/**
 * Srovnání období (NAVRH 4.1) — MoM, YoY a klouzavých 12 měsíců nad
 * `crm.v_performance_compare`. Čtou i role bez práva zápisu: report je
 * agregovaná obchodní statistika, ne kontaktní údaje.
 */
export const REPORT_ROLES = ['owner', 'editor', 'analyst', 'viewer'] as const

/** Kolik měsíců zpět nabídnout v přepínači období. */
const PERIODS_LIMIT = 120
/** Pojistka proti neomezené odpovědi — partnerů jsou stovky, ne statisíce. */
const ROWS_LIMIT = 2000

export interface ReportRow {
  partner_id: string
  partner_name: string
  segment: string
  tier: string | null
  country: string
  revenue_eur: number
  revenue_prev_month: number | null
  mom_pct: number | null
  revenue_same_month_last_year: number | null
  yoy_pct: number | null
  revenue_r12: number | null
  revenue_r12_prev: number | null
  r12_pct: number | null
  room_nights: number
}

export interface Report {
  /** `YYYY-MM`; null, když v databázi ještě žádná výkonnost není. */
  period: string | null
  periods: string[]
  rows: ReportRow[]
}

interface RawRow {
  partner_id: string
  partner_name: string
  segment: string
  tier: string | null
  country: string
  revenue_eur: string | null
  revenue_prev_month: string | null
  revenue_same_month_last_year: string | null
  revenue_r12: string | null
  revenue_r12_prev: string | null
  r12_prev_months: string | null
  room_nights: string | null
}

/** numeric/bigint chodí z pg jako řetězec — jedno místo na převod. */
function num(value: string | null): number | null {
  if (value === null) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * Procentní změna. Nulová nebo chybějící srovnávací základna nedává procenta —
 * dělení nulou by udělalo z nového partnera „+∞ %".
 */
export function pct(current: number | null, previous: number | null): number | null {
  if (previous === null || previous === 0) return null
  const cur = current ?? 0
  return Math.round(((cur - previous) / previous) * 1000) / 10
}

const ROWS_SQL = `
  SELECT v.partner_id,
         p.name    AS partner_name,
         p.segment,
         p.tier,
         p.country,
         v.revenue_eur,
         v.revenue_prev_month,
         v.revenue_same_month_last_year,
         v.revenue_r12,
         v.revenue_r12_prev,
         v.r12_prev_months,
         v.room_nights
    FROM crm.v_performance_compare v
    JOIN crm.partners p ON p.id = v.partner_id
   WHERE v.period_month = $1::date
   ORDER BY v.revenue_eur DESC NULLS LAST, p.name ASC
   LIMIT ${ROWS_LIMIT}
`

/**
 * Načte report pro jedno období. `periodParam` je `YYYY-MM`; bez něj se bere
 * poslední měsíc, ve kterém jsou data. Vrací `'invalid_period'`, když je
 * parametr nečitelný — endpoint z toho udělá 400.
 */
export async function loadReport(periodParam: string | null): Promise<Report | 'invalid_period'> {
  const periods = (
    await q<{ period: string }>(
      `SELECT DISTINCT to_char(period_month, 'YYYY-MM') AS period
         FROM crm.partner_performance
        ORDER BY 1 DESC
        LIMIT ${PERIODS_LIMIT}`,
    )
  ).map((row) => row.period)

  let periodMonth: string | null = null
  if (periodParam !== null && periodParam !== '') {
    periodMonth = parseMonth(periodParam.trim())
    if (periodMonth === null) return 'invalid_period'
  } else {
    const latest = await qOne<{ period_month: string }>(
      `SELECT to_char(max(period_month), 'YYYY-MM-DD') AS period_month FROM crm.partner_performance`,
    )
    periodMonth = latest?.period_month ?? null
  }

  if (periodMonth === null) return { period: null, periods, rows: [] }

  const raw = await q<RawRow>(ROWS_SQL, [periodMonth])
  const rows: ReportRow[] = raw.map((row) => {
    const revenue = num(row.revenue_eur) ?? 0
    const prevMonth = num(row.revenue_prev_month)
    const lastYear = num(row.revenue_same_month_last_year)
    const r12 = num(row.revenue_r12)
    const r12Prev = num(row.revenue_r12_prev)
    // Neúplné okno předchozích 12 měsíců by dalo nesmyslné procento —
    // R12 se srovnává jen proti plným dvanácti měsícům.
    const r12Complete = Number(row.r12_prev_months ?? 0) === 12
    return {
      partner_id: row.partner_id,
      partner_name: row.partner_name,
      segment: row.segment,
      tier: row.tier,
      country: row.country,
      revenue_eur: revenue,
      revenue_prev_month: prevMonth,
      mom_pct: pct(revenue, prevMonth),
      revenue_same_month_last_year: lastYear,
      yoy_pct: pct(revenue, lastYear),
      revenue_r12: r12,
      revenue_r12_prev: r12Prev,
      r12_pct: r12Complete ? pct(r12, r12Prev) : null,
      room_nights: num(row.room_nights) ?? 0,
    }
  })

  return { period: toMonthLabel(periodMonth), periods, rows }
}

export const GET: APIRoute = async (context) => {
  const user = requireUser(context, [...REPORT_ROLES])
  if (user instanceof Response) return user

  const report = await loadReport(context.url.searchParams.get('period'))
  if (report === 'invalid_period') return jsonError(400, 'invalid_period')

  return json(report)
}
