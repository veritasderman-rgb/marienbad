import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../lib/portal/audit'
import { deleteInteraction, isUuid } from '../../../../lib/portal/crm/partners'

export const prerender = false

export const DELETE: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner'])
  if (actor instanceof Response) return actor

  const id = context.params.id
  if (!isUuid(id)) return jsonError(404, 'not_found')

  const removed = await deleteInteraction(id)
  if (!removed) return jsonError(404, 'not_found')

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'delete',
    entity: 'interactions',
    entityId: id,
    diff: { partner_id: removed.partner_id, type: removed.type },
    ip,
    userAgent,
  })
  return json({ ok: true })
}
