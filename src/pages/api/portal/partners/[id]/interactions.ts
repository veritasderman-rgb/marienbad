import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../../lib/portal/audit'
import { createInteraction, isUuid, parseInteractionInput } from '../../../../../lib/portal/crm/partners'

export const prerender = false

export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner', 'editor'])
  if (actor instanceof Response) return actor

  const partnerId = context.params.id
  if (!isUuid(partnerId)) return jsonError(404, 'not_found')

  let body: unknown
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const parsed = parseInteractionInput(body)
  if (!parsed.ok) return jsonError(400, 'bad_request', { message: parsed.message })

  const result = await createInteraction(partnerId, parsed.values, actor.id)
  if ('error' in result) {
    return result.error === 'not_found'
      ? jsonError(404, 'not_found')
      : jsonError(400, 'bad_request', { message: 'invalid_contact' })
  }

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'create',
    entity: 'interactions',
    entityId: result.id,
    diff: {
      partner_id: partnerId,
      type: parsed.values.type,
      occurred_at: parsed.values.occurred_at,
      contact_id: parsed.values.contact_id ?? null,
    },
    ip,
    userAgent,
  })
  return json({ ok: true, id: result.id })
}
