import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../lib/portal/audit'
import { maskContact } from '../../../../lib/portal/crm/mask'
import {
  PARTNERS_PAGE_SIZE,
  createPartner,
  listPartners,
  parsePartnerInput,
  parsePartnerListQuery,
} from '../../../../lib/portal/crm/partners'

export const prerender = false

const READ_ROLES = ['owner', 'editor', 'analyst'] as const
const WRITE_ROLES = ['owner', 'editor'] as const

export const GET: APIRoute = async (context) => {
  const user = requireUser(context, [...READ_ROLES])
  if (user instanceof Response) return user

  const parsed = parsePartnerListQuery(context.url.searchParams)
  if (!parsed.ok) return jsonError(400, 'bad_request', { message: parsed.message })

  const { items, total } = await listPartners(parsed.values)
  // maskování se dělá tady, ne v UI — nemaskovaný kontakt nesmí odejít v JSON
  const partners = items.map((item) => ({
    ...item,
    primary_contact: item.primary_contact ? maskContact(item.primary_contact, user.role) : null,
  }))
  return json({ partners, page: parsed.values.page, pageSize: PARTNERS_PAGE_SIZE, total })
}

export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, [...WRITE_ROLES])
  if (actor instanceof Response) return actor

  let body: unknown
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const parsed = parsePartnerInput(body, 'create')
  if (!parsed.ok) return jsonError(400, 'bad_request', { message: parsed.message })

  const result = await createPartner(parsed.values, actor.id)
  if ('error' in result) return jsonError(409, 'ico_exists')

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'create',
    entity: 'partners',
    entityId: result.id,
    diff: parsed.values,
    ip,
    userAgent,
  })
  return json({ ok: true, id: result.id })
}
