import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../../lib/portal/audit'
import { q, qOne } from '../../../../../lib/portal/db'
import { parseStoredMapping } from '../../../../../lib/portal/imports/leads'

export const prerender = false

const WRITE_ROLES = ['owner', 'editor'] as const
const KIND = 'partners'

/** Uložená mapování sloupců pro opakované importy z téhož zdroje. */
export const GET: APIRoute = async (context) => {
  const user = requireUser(context, [...WRITE_ROLES])
  if (user instanceof Response) return user

  const templates = await q(
    `SELECT t.id, t.name, t.column_mapping, t.created_at, u.display_name AS created_by_name
       FROM crm.import_templates t
       LEFT JOIN crm.portal_users u ON u.id = t.created_by
      WHERE t.kind = $1
      ORDER BY t.name ASC`,
    [KIND],
  )
  return json({ templates })
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
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return jsonError(400, 'bad_request')
  }
  const input = body as Record<string, unknown>

  const name = typeof input.name === 'string' ? input.name.trim() : ''
  if (!name || name.length > 120) return jsonError(400, 'invalid_name')

  const mapping = parseStoredMapping(input.column_mapping)
  if (!mapping.ok) return jsonError(400, 'bad_request', { message: mapping.message })

  // UNIQUE (kind, name) → uložení stejného jména mapování přepíše
  const row = await qOne<{ id: string }>(
    `INSERT INTO crm.import_templates (kind, name, column_mapping, created_by)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (kind, name) DO UPDATE SET column_mapping = EXCLUDED.column_mapping
     RETURNING id`,
    [KIND, name, JSON.stringify(mapping.values), actor.id],
  )
  if (!row) return jsonError(500, 'save_failed')

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'upsert',
    entity: 'import_templates',
    entityId: row.id,
    diff: { kind: KIND, name, column_mapping: mapping.values },
    ip,
    userAgent,
  })

  return json({ ok: true, id: row.id })
}
