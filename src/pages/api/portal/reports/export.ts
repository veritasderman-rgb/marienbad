import type { APIRoute } from 'astro'
import { jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { csvResponse, toCsv, type CsvColumn } from '../../../../lib/portal/csv-export'
import { loadReport, REPORT_ROLES, type ReportRow } from './index'

export const prerender = false

/**
 * Stejné řádky jako `/api/portal/reports`, jen jako CSV pro Excel.
 * Vyrábí se výhradně přes sdílenou utilitu `toCsv`/`csvResponse` (audit N-03):
 * BOM, středník, CRLF a escapování buněk, které by Excel vzal jako vzorec.
 * Vedlejší důsledek téhož pravidla: záporná procenta začínají `-`, a tak
 * dostanou ochranný apostrof — Excel je zobrazí jako text.
 */

const COLUMNS: CsvColumn[] = [
  { key: 'partner', label: 'Partner' },
  { key: 'segment', label: 'Segment' },
  { key: 'tier', label: 'Tier' },
  { key: 'country', label: 'Země' },
  { key: 'revenue_eur', label: 'Obrat EUR' },
  { key: 'mom_pct', label: 'MoM %' },
  { key: 'yoy_pct', label: 'YoY %' },
  { key: 'revenue_r12', label: 'R12 EUR' },
  { key: 'r12_pct', label: 'R12 %' },
  { key: 'room_nights', label: 'Noci' },
]

/** České Excely čtou desetinnou čárku; oddělovač sloupců je středník, takže nekoliduje. */
function decimal(value: number | null, digits: number): string {
  if (value === null || !Number.isFinite(value)) return ''
  return value.toFixed(digits).replace('.', ',')
}

function toCsvRow(row: ReportRow): Record<string, unknown> {
  return {
    partner: row.partner_name,
    segment: row.segment,
    tier: row.tier ?? '',
    country: row.country,
    revenue_eur: decimal(row.revenue_eur, 2),
    mom_pct: decimal(row.mom_pct, 1),
    yoy_pct: decimal(row.yoy_pct, 1),
    revenue_r12: decimal(row.revenue_r12, 2),
    r12_pct: decimal(row.r12_pct, 1),
    room_nights: String(row.room_nights),
  }
}

export const GET: APIRoute = async (context) => {
  const user = requireUser(context, [...REPORT_ROLES])
  if (user instanceof Response) return user

  const report = await loadReport(context.url.searchParams.get('period'))
  if (report === 'invalid_period') return jsonError(400, 'invalid_period')
  if (report.period === null) return jsonError(404, 'no_data')

  const csv = toCsv(report.rows.map(toCsvRow), COLUMNS)
  return csvResponse(`report-${report.period}.csv`, csv)
}
