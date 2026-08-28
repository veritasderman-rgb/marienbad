import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../../lib/portal/audit'
import { createContact, isUuid, parseContactInput } from '../../../../../lib/portal/crm/partners'

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
  const parsed = parseContactInput(body, 'create')
  if (!parsed.ok) return jsonError(400, 'bad_request', { message: parsed.message })

  const result = await createContact(partnerId, parsed.values)
  if ('error' in result) return jsonError(404, 'not_found')

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'create',
    entity: 'partner_contacts',
    entityId: result.id,
    // do append-only logu nekopírujeme osobní údaje, jen kontext zápisu
    diff: { partner_id: partnerId, is_primary: parsed.values.is_primary === true },
    ip,
    userAgent,
  })
  return json({ ok: true, id: result.id })
}
