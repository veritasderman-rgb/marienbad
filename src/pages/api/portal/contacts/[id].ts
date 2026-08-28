import type { APIContext, APIRoute } from 'astro'
import type { PortalUser } from '../../../../lib/portal/auth/session'
import { canEdit, json, jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../lib/portal/audit'
import {
  anonymizeContact,
  deleteContact,
  isUuid,
  parseContactInput,
  updateContact,
} from '../../../../lib/portal/crm/partners'

export const prerender = false

async function applyUpdate(
  context: APIContext,
  actor: PortalUser,
  id: string,
  body: unknown,
): Promise<Response> {
  const parsed = parseContactInput(body, 'patch')
  if (!parsed.ok) return jsonError(400, 'bad_request', { message: parsed.message })

  const result = await updateContact(id, parsed.values)
  if ('error' in result) return jsonError(404, 'not_found')

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'update',
    entity: 'partner_contacts',
    entityId: id,
    // diff jen o změněných polích; hodnoty kontaktu jsou osobní údaj, proto
    // se do logu zapisuje jen seznam dotčených polí
    diff: { partner_id: result.partnerId, fields: Object.keys(result.diff) },
    ip,
    userAgent,
  })
  return json({ ok: true })
}

export const PATCH: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner', 'editor'])
  if (actor instanceof Response) return actor

  const id = context.params.id
  if (!isUuid(id)) return jsonError(404, 'not_found')

  let body: unknown
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  return applyUpdate(context, actor, id, body)
}

/** POST slouží akcím nad kontaktem; bez `action` se chová jako PATCH. */
export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner', 'editor'])
  if (actor instanceof Response) return actor
  if (!canEdit(actor.role)) return jsonError(403, 'forbidden')

  const id = context.params.id
  if (!isUuid(id)) return jsonError(404, 'not_found')

  let body: unknown
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const action =
    typeof body === 'object' && body !== null && 'action' in body
      ? (body as { action?: unknown }).action
      : undefined

  if (action === undefined || action === null) return applyUpdate(context, actor, id, body)
  if (action !== 'anonymize') return jsonError(400, 'bad_request', { message: 'invalid_action' })

  const result = await anonymizeContact(id)
  if (!result) return jsonError(404, 'not_found')

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'anonymize',
    entity: 'partner_contacts',
    entityId: id,
    // vymazané hodnoty se do auditu ZÁMĚRNĚ nepíší (šlo by o obnovitelný záznam)
    diff: { partner_id: result.partner_id },
    ip,
    userAgent,
  })
  return json({ ok: true })
}

export const DELETE: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner'])
  if (actor instanceof Response) return actor

  const id = context.params.id
  if (!isUuid(id)) return jsonError(404, 'not_found')

  const removed = await deleteContact(id)
  if (!removed) return jsonError(404, 'not_found')

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'delete',
    entity: 'partner_contacts',
    entityId: id,
    diff: { partner_id: removed.partner_id },
    ip,
    userAgent,
  })
  return json({ ok: true })
}
