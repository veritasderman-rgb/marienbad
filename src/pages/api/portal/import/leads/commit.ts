import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../../lib/portal/audit'
import { q, qOne } from '../../../../../lib/portal/db'
import { isUuid, type ConsentBasis } from '../../../../../lib/portal/crm/partners'
import {
  commitImport,
  dedupRows,
  isConsentBasis,
  mapRows,
  parseDecisions,
  parseMapping,
} from '../../../../../lib/portal/imports/leads'

export const prerender = false

const WRITE_ROLES = ['owner', 'editor'] as const

interface ImportRow {
  id: string
  kind: string
  status: string
  staging: { headers?: unknown; rows?: unknown } | null
}

function isStringMatrix(value: unknown): value is string[][] {
  return (
    Array.isArray(value) &&
    value.every((row) => Array.isArray(row) && row.every((cell) => typeof cell === 'string'))
  )
}

/**
 * Kroky 2 a 3 průvodce importem (NAVRH 5.4).
 *
 * `dry_run: true` vrátí náhled („14 nových, 6 už v CRM, 3 řádky k rozhodnutí")
 * a uloží mapování do `imports.params`. `dry_run: false` zapíše partnery
 * a kontakty v jedné transakci a import uzavře.
 *
 * Fuzzy shody se bez explicitního rozhodnutí nikdy nezakládají ani neslučují.
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

  const optIn = input.opt_in === undefined ? true : input.opt_in
  if (typeof optIn !== 'boolean') return jsonError(400, 'invalid_opt_in')

  let consentBasis: ConsentBasis | null = null
  let optInSource: string | null = null
  if (optIn) {
    if (!isConsentBasis(input.consent_basis)) return jsonError(400, 'invalid_consent_basis')
    consentBasis = input.consent_basis
    const source = typeof input.opt_in_source === 'string' ? input.opt_in_source.trim() : ''
    if (!source || source.length > 200) return jsonError(400, 'invalid_opt_in_source')
    optInSource = source
  } else if (typeof input.opt_in_source === 'string' && input.opt_in_source.trim()) {
    const source = input.opt_in_source.trim()
    if (source.length > 200) return jsonError(400, 'invalid_opt_in_source')
    optInSource = source
  }

  const dryRun = input.dry_run === undefined ? false : input.dry_run
  if (typeof dryRun !== 'boolean') return jsonError(400, 'invalid_dry_run')

  const decisionsParsed = parseDecisions(input.decisions)
  if (!decisionsParsed.ok) return jsonError(400, 'bad_request', { message: decisionsParsed.message })

  const record = await qOne<ImportRow>(
    `SELECT id, kind, status, staging FROM crm.imports WHERE id = $1`,
    [importId],
  )
  if (!record) return jsonError(404, 'not_found')
  if (record.kind !== 'partners') return jsonError(409, 'wrong_kind')
  if (record.status !== 'uploaded') return jsonError(409, 'already_committed')

  const headers = record.staging?.headers
  const rows = record.staging?.rows
  if (!Array.isArray(headers) || !headers.every((h) => typeof h === 'string') || !isStringMatrix(rows)) {
    return jsonError(409, 'missing_staging')
  }

  const mappingParsed = parseMapping(input.mapping, headers)
  if (!mappingParsed.ok) return jsonError(400, 'bad_request', { message: mappingParsed.message })
  const mapping = mappingParsed.values

  const { records, errors } = mapRows(rows, mapping)
  const dedup = await dedupRows(records)

  const params = {
    mapping,
    opt_in: optIn,
    consent_basis: consentBasis,
    opt_in_source: optInSource,
  }

  if (dryRun) {
    await q(`UPDATE crm.imports SET params = $2 WHERE id = $1`, [importId, JSON.stringify(params)])
    const toDecide = dedup
      .filter((row) => row.match === 'fuzzy')
      .map((row) => ({
        row_index: row.row_index,
        record: row.record,
        candidates: row.candidates,
      }))
    return json({
      ok: true,
      preview: {
        new: dedup.filter((row) => row.match === 'new').length,
        existing: dedup.filter((row) => row.match === 'ico' || row.match === 'email_domain').length,
        to_decide: toDecide,
        errors,
      },
    })
  }

  const result = await commitImport(dedup, {
    importId,
    actorId: actor.id,
    optIn,
    consentBasis,
    optInSource,
    decisions: decisionsParsed.values,
    params,
    errors,
  })

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'import_commit',
    entity: 'imports',
    entityId: importId,
    diff: { kind: 'partners', opt_in: optIn, consent_basis: consentBasis, opt_in_source: optInSource, ...result },
    ip,
    userAgent,
  })

  return json({ ok: true, result })
}
