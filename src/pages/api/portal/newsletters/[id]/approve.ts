import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../../lib/portal/audit'
import { isUuid } from '../../../../../lib/portal/crm/partners'
import { q, qOne } from '../../../../../lib/portal/db'

export const prerender = false

/**
 * Schválení newsletteru — JEN role owner (NAVRH 5.1 krok 3).
 * Bez záznamu approved_by + approved_at neexistuje cesta k odeslání.
 */
export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner'])
  if (actor instanceof Response) return actor
  const id = context.params.id
  if (!isUuid(id)) return jsonError(404, 'not_found')

  const current = await qOne<{ status: string; segment_definition: unknown; html_body: string }>(
    `SELECT status, segment_definition, html_body FROM crm.newsletters WHERE id = $1`,
    [id],
  )
  if (!current) return jsonError(404, 'not_found')
  if (current.status !== 'draft') return jsonError(409, 'not_draft', { message: 'Schválit lze jen koncept.' })
  if (!current.segment_definition) {
    return jsonError(409, 'no_segment', { message: 'Před schválením vyberte publikum a jazyky rozesílky.' })
  }
  if (!current.html_body || current.html_body.length < 50) {
    return jsonError(409, 'empty_body', { message: 'Newsletter nemá obsah.' })
  }

  // podmíněný UPDATE — souběžné schválení projde jen jednou
  const updated = await q<{ id: string }>(
    `UPDATE crm.newsletters
     SET status = 'approved', approved_by = $2, approved_at = now()
     WHERE id = $1 AND status = 'draft'
     RETURNING id`,
    [id, actor.id],
  )
  if (updated.length === 0) return jsonError(409, 'not_draft')

  const { ip, userAgent } = requestMeta(context.request)
  await audit({ actorId: actor.id, action: 'approve', entity: 'newsletters', entityId: id, ip, userAgent })
  return json({ ok: true })
}
