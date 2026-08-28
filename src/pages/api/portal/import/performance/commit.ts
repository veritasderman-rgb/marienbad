import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../../lib/portal/audit'
import { q, qOne } from '../../../../../lib/portal/db'
import { isUuid } from '../../../../../lib/portal/crm/partners'
import {
  commitPerformance,
  fxRate,
  mapRows,
  matchPartners,
  normalizeHotelSlug,
  parseDecisions,
  parseMapping,
  parseMonth,
  resolveRows,
  type CellValue,
} from '../../../../../lib/portal/imports/excel'

export const prerender = false

const WRITE_ROLES = ['owner', 'editor'] as const

interface ImportRow {
  id: string
  kind: string
  status: string
  staging: { headers?: unknown; rows?: unknown } | null
}

function isCellMatrix(value: unknown): value is CellValue[][] {
  return (
    Array.isArray(value) &&
    value.every(
      (row) =>
        Array.isArray(row) &&
        row.every(
          (cell) => cell === null || typeof cell === 'string' || typeof cell === 'number',
        ),
    )
  )
}

/**
 * Kroky 2 a 3 průvodce importem výkonnosti (NAVRH 5.3).
 *
 * `dry_run: true` vrátí náhled („naimportuje se 142 řádků, 3 mají chybu,
 * 2 partneři neznámí") a uloží mapování do `imports.params`. `dry_run: false`
 * zapíše řádky v jedné transakci a import uzavře.
 *
 * Import je opakovatelný: stejný měsíc se přepíše — klíč upsertu je
 * `(partner_id, period_month, hotel_slug)`.
 *
 * Partner, kterého se nepodařilo spárovat, se bez lidského rozhodnutí NIKDY
 * nezapíše; fuzzy kandidáti se vracejí k potvrzení (`assign:<uuid>` / `skip`).
 */
export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, [...WRITE_ROLES])
  if (actor instanceof Response) return actor

  let body: unknown
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return jsonError(400, 'bad_request')
  }
  const input = body as Record<string, unknown>

  const importId = typeof input.import_id === 'string' ? input.import_id.trim() : ''
  if (!isUuid(importId)) return jsonError(400, 'invalid_import_id')

  const dryRun = input.dry_run === undefined ? false : input.dry_run
  if (typeof dryRun !== 'boolean') return jsonError(400, 'invalid_dry_run')

  // Období a hotel smí chybět v souboru — pak je musí doplnit člověk.
  let defaultPeriod: string | null = null
  if (input.default_period !== undefined && input.default_period !== null && input.default_period !== '') {
    if (typeof input.default_period !== 'string') return jsonError(400, 'invalid_default_period')
    defaultPeriod = parseMonth(input.default_period.trim())
    if (defaultPeriod === null) return jsonError(400, 'invalid_default_period')
  }

  let defaultHotel: string | null = null
  if (input.default_hotel !== undefined && input.default_hotel !== null && input.default_hotel !== '') {
    if (typeof input.default_hotel !== 'string') return jsonError(400, 'invalid_default_hotel')
    defaultHotel = normalizeHotelSlug(input.default_hotel)
    if (defaultHotel === null) return jsonError(400, 'invalid_default_hotel')
  }

  const decisionsParsed = parseDecisions(input.decisions)
  if (!decisionsParsed.ok) return jsonError(400, 'bad_request', { message: decisionsParsed.message })

  const record = await qOne<ImportRow>(
    `SELECT id, kind, status, staging FROM crm.imports WHERE id = $1`,
    [importId],
  )
  if (!record) return jsonError(404, 'not_found')
  if (record.kind !== 'performance') return jsonError(409, 'wrong_kind')
  if (record.status !== 'uploaded') return jsonError(409, 'already_committed')

  const headers = record.staging?.headers
  const rows = record.staging?.rows
  if (!Array.isArray(headers) || !headers.every((h) => typeof h === 'string') || !isCellMatrix(rows)) {
    return jsonError(409, 'missing_staging')
  }

  const mappingParsed = parseMapping(input.mapping, headers)
  if (!mappingParsed.ok) return jsonError(400, 'bad_request', { message: mappingParsed.message })
  const mapping = mappingParsed.values

  if (mapping.period_month === undefined && defaultPeriod === null) {
    return jsonError(400, 'bad_request', { message: 'period_required' })
  }
  if (mapping.hotel_slug === undefined && defaultHotel === null) {
    return jsonError(400, 'bad_request', { message: 'hotel_required' })
  }

  const fx = fxRate()
  if (fx === null) return jsonError(500, 'invalid_fx_rate')

  const { records, errors } = mapRows(rows, mapping, { defaultPeriod, defaultHotel })
  const matched = await matchPartners(records)
  const resolved = resolveRows(matched, decisionsParsed.values, fx, errors)

  const params = {
    mapping,
    default_period: defaultPeriod,
    default_hotel: defaultHotel,
    fx_rate: fx,
  }

  if (dryRun) {
    await q(`UPDATE crm.imports SET params = $2 WHERE id = $1`, [importId, JSON.stringify(params)])
    return json({
      ok: true,
      preview: {
        ready: resolved.ready.length,
        skipped: resolved.skipped,
        to_decide: resolved.to_decide,
        errors: resolved.errors,
        months: resolved.months,
      },
    })
  }

  const result = await commitPerformance(resolved.ready, {
    importId,
    undecided: resolved.to_decide.map((row) => row.row_index),
    skipped: resolved.skipped,
    errors: resolved.errors,
    params,
  })

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'import_commit',
    entity: 'imports',
    entityId: importId,
    diff: {
      kind: 'performance',
      months: resolved.months,
      default_period: defaultPeriod,
      default_hotel: defaultHotel,
      fx_rate: fx,
      ...result,
    },
    ip,
    userAgent,
  })

  return json({ ok: true, result })
}
