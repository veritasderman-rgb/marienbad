import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../../lib/portal/audit'
import { maskContact } from '../../../../../lib/portal/crm/mask'
import {
  deletePartner,
  getPartner,
  isUuid,
  listPartnerContacts,
  listPartnerInteractions,
  parsePartnerInput,
  updatePartner,
} from '../../../../../lib/portal/crm/partners'

export const prerender = false

const READ_ROLES = ['owner', 'editor', 'analyst'] as const
const WRITE_ROLES = ['owner', 'editor'] as const

export const GET: APIRoute = async (context) => {
  const user = requireUser(context, [...READ_ROLES])
  if (user instanceof Response) return user

  const id = context.params.id
  if (!isUuid(id)) return jsonError(404, 'not_found')

  const partner = await getPartner(id)
  if (!partner) return jsonError(404, 'not_found')

  const [contacts, interactions] = await Promise.all([
    listPartnerContacts(id),
    listPartnerInteractions(id),
  ])
  return json({
    partner,
    // maskování na serveru — analyst nesmí dostat nemaskovaný e-mail ani telefon
    contacts: contacts.map((contact) => maskContact(contact, user.role)),
    interactions,
  })
}

export const PATCH: APIRoute = async (context) => {
  const actor = requireUser(context, [...WRITE_ROLES])
  if (actor instanceof Response) return actor

  const id = context.params.id
  if (!isUuid(id)) return jsonError(404, 'not_found')

  let body: unknown
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const parsed = parsePartnerInput(body, 'patch')
  if (!parsed.ok) return jsonError(400, 'bad_request', { message: parsed.message })

  const result = await updatePartner(id, parsed.values)
  if ('error' in result) {
    return result.error === 'ico_exists' ? jsonError(409, 'ico_exists') : jsonError(404, 'not_found')
  }

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'update',
    entity: 'partners',
    entityId: id,
    diff: result.diff,
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

  const removed = await deletePartner(id)
  if (!removed) return jsonError(404, 'not_found')

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'delete',
    entity: 'partners',
    entityId: id,
    diff: { name: removed.name, ico: removed.ico },
    ip,
    userAgent,
  })
  return json({ ok: true })
}
