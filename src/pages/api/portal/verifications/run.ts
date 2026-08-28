import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../lib/portal/audit'
import { env } from '../../../../lib/portal/env'
import { runAllVerifications, verifyPartner } from '../../../../lib/portal/verifications/run'

export const prerender = false

const WRITE_ROLES = ['owner', 'editor'] as const
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Prověrka na vyžádání (NAVRH 5.5): s `partner_id` jeden partner, bez něj
 * všichni. Bez HLIDAC_TOKEN se nic nevolá a vrací se 200 se `skipped` —
 * chybějící konfigurace není chyba požadavku.
 */
export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, [...WRITE_ROLES])
  if (actor instanceof Response) return actor

  let partnerId: string | null = null
  const rawBody = await context.request.text().catch(() => '')
  if (rawBody.trim() !== '') {
    let body: unknown
    try {
      body = JSON.parse(rawBody)
    } catch {
      return jsonError(400, 'bad_request')
    }
    const value = (body as { partner_id?: unknown } | null)?.partner_id
    if (value !== undefined && value !== null) {
      if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
        return jsonError(400, 'bad_request', { message: 'partner_id musí být UUID' })
      }
      partnerId = value
    }
  }

  if (!env('HLIDAC_TOKEN')) {
    return json({ ok: false, skipped: 'hlidac_not_configured' })
  }

  const { ip, userAgent } = requestMeta(context.request)

  if (partnerId) {
    const result = await verifyPartner(partnerId)
    await audit({
      actorId: actor.id,
      action: 'verify',
      entity: 'partner_verifications',
      entityId: partnerId,
      diff: result,
      ip,
      userAgent,
    })
    if ('error' in result) {
      return result.error === 'partner_not_found'
        ? jsonError(404, 'not_found')
        : json({ ok: false, error: result.error }, 502)
    }
    return json({ ok: true, result })
  }

  const summary = await runAllVerifications()
  await audit({
    actorId: actor.id,
    action: 'verify',
    entity: 'partner_verifications',
    entityId: null,
    diff: summary,
    ip,
    userAgent,
  })
  if ('skipped' in summary) return json({ ok: false, skipped: summary.skipped })
  return json({ ok: true, result: summary })
}
