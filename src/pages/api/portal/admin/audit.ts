import type { APIRoute } from 'astro'
import { q, qOne } from '../../../../lib/portal/db'
import { json, requireUser } from '../../../../lib/portal/auth/guard'

export const prerender = false

const PAGE_SIZE = 50

export const GET: APIRoute = async (context) => {
  const user = requireUser(context, ['owner'])
  if (user instanceof Response) return user
  const page = Math.max(1, Number(context.url.searchParams.get('page') ?? 1) || 1)
  const entity = context.url.searchParams.get('entity')
  const params: unknown[] = []
  let where = ''
  if (entity) {
    params.push(entity)
    where = `WHERE a.entity = $${params.length}`
  }
  params.push(PAGE_SIZE, (page - 1) * PAGE_SIZE)
  const rows = await q(
    `SELECT a.id, a.action, a.entity, a.entity_id, a.diff, a.ip, a.at,
            u.email AS actor_email
     FROM crm.audit_log a
     LEFT JOIN crm.portal_users u ON u.id = a.actor_id
     ${where}
     ORDER BY a.at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  )
  const total = await qOne<{ n: string }>(
    `SELECT count(*) AS n FROM crm.audit_log a ${where}`,
    entity ? [entity] : [],
  )
  return json({ entries: rows, page, pageSize: PAGE_SIZE, total: Number(total?.n ?? 0) })
}
