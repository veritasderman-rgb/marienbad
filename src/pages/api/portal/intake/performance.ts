import type { APIRoute } from 'astro'
import { requireMachineToken, json, jsonError } from '../../../../lib/portal/auth/guard'
import { audit } from '../../../../lib/portal/audit'
import { q, qOne } from '../../../../lib/portal/db'
import {
  validateIntakeRow,
  processPerformanceRows,
  type IntakeRow,
  type IntakeRowError,
} from '../../../../lib/portal/payers'

export const prerender = false

const MAX_ROWS = 5000

/**
 * Push výkonnosti ze statistického dashboardu LLML (NAVRH 6.3).
 *
 * Strojová cesta: DASHBOARD_INTAKE_TOKEN umí jedinou věc — založit dávku
 * výkonnosti. Nečte kontakty, nesahá na newsletter, nevrací data zpět.
 * Session cookie tato cesta ignoruje (middleware).
 *
 * Idempotence: sha256 dávky — stejná dávka podruhé jen odpoví duplicate,
 * upsert klíč (partner_id, period_month, hotel_slug) přepisuje. Posílají se
 * VÝHRADNĚ uzavřené měsíce (period_month), nikdy YTD. Měnu přepočítává
 * portál svým kurzem (NAVRH 6.3). Nespárovaný plátce jde do fronty
 * mapování a jeho obrat se nezapočítá, dokud ho člověk nepotvrdí.
 */
export const POST: APIRoute = async (context) => {
  const denied = await requireMachineToken(context, 'DASHBOARD_INTAKE_TOKEN')
  if (denied) return denied

  let body: { period_month?: unknown; source?: unknown; sha256?: unknown; rows?: unknown }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }

  const periodRaw = typeof body.period_month === 'string' ? body.period_month.trim() : ''
  const periodMatch = /^(\d{4})-(\d{2})(?:-01)?$/.exec(periodRaw)
  if (!periodMatch) return jsonError(400, 'invalid_period', { message: 'period_month musí být YYYY-MM (uzavřený měsíc, ne YTD).' })
  const periodMonth = `${periodMatch[1]}-${periodMatch[2]}-01`
  // jen uzavřené měsíce — aktuální ani budoucí měsíc se nepřijímá
  const currentMonth = new Date().toISOString().slice(0, 7)
  if (`${periodMatch[1]}-${periodMatch[2]}` >= currentMonth) {
    return jsonError(400, 'period_not_closed', { message: 'Posílají se jen uzavřené měsíce.' })
  }

  const sha256 = typeof body.sha256 === 'string' && /^[0-9a-f]{64}$/i.test(body.sha256) ? body.sha256.toLowerCase() : null
  if (!Array.isArray(body.rows) || body.rows.length === 0) return jsonError(400, 'empty_rows')
  if (body.rows.length > MAX_ROWS) return jsonError(413, 'too_many_rows')

  // idempotence celé dávky: stejný otisk už zpracované dávky se nezakládá znovu
  if (sha256) {
    const existing = await qOne<{ id: string }>(
      `SELECT id FROM crm.imports WHERE kind = 'performance_pms' AND sha256 = $1 AND status = 'committed'`,
      [sha256],
    )
    if (existing) return json({ ok: true, duplicate: true, import_id: existing.id })
  }

  const rows: IntakeRow[] = []
  const errors: IntakeRowError[] = []
  for (const [index, raw] of (body.rows as unknown[]).entries()) {
    const validated = validateIntakeRow(raw, index)
    if ('ok' in validated) rows.push(validated.ok)
    else errors.push(validated.err)
  }
  if (rows.length === 0) return jsonError(400, 'no_valid_rows', { errors })

  const importRow = await qOne<{ id: string }>(
    `INSERT INTO crm.imports (kind, sha256, rows_total, status, staging, params)
     VALUES ('performance_pms', $1, $2, 'committed', $3, $4)
     RETURNING id`,
    [sha256, rows.length, JSON.stringify(rows), JSON.stringify({ period_month: periodMonth, source: body.source ?? 'pms' })],
  )
  if (!importRow) return jsonError(500, 'import_failed')

  const result = await processPerformanceRows(rows, periodMonth, importRow.id)

  // staging zůstává, dokud čekají nespárované řádky — po potvrzení mapování
  // se dávka přehraje (žádný řádek se neztratí); plně spárovaná dávka se čistí
  await q(
    `UPDATE crm.imports SET rows_ok = $2, rows_failed = $3, rows_duplicate = 0,
       error_log = $4, staging = CASE WHEN $5::int > 0 THEN staging ELSE NULL END
     WHERE id = $1`,
    [importRow.id, result.matched, errors.length, JSON.stringify({ errors, unmatched: result.unmatched, skipped: result.skipped }), result.unmatched],
  )
  await audit({
    actorId: null,
    action: 'intake_performance',
    entity: 'imports',
    entityId: importRow.id,
    diff: { period_month: periodMonth, rows: rows.length, ...result, errors: errors.length },
  })
  return json({
    ok: true,
    import_id: importRow.id,
    matched: result.matched,
    unmatched: result.unmatched,
    skipped: result.skipped,
    errors,
  })
}
