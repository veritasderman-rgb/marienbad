import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../../lib/portal/audit'
import { isUuid } from '../../../../../lib/portal/crm/partners'
import { q } from '../../../../../lib/portal/db'
import {
  getNewsletter,
  updateDraft,
  parseSegmentDefinition,
  resolveRecipients,
} from '../../../../../lib/portal/newsletter/data'

export const prerender = false

export const GET: APIRoute = async (context) => {
  const user = requireUser(context, ['owner', 'editor', 'analyst'])
  if (user instanceof Response) return user
  const id = context.params.id
  if (!isUuid(id)) return jsonError(404, 'not_found')
  const newsletter = await getNewsletter(id)
  if (!newsletter) return jsonError(404, 'not_found')

  // aktuální počet příjemců k definici segmentu (u odeslaných je směrodatný snímek)
  let recipientCount: number | null = null
  if (newsletter.segment_definition) {
    recipientCount = (await resolveRecipients(newsletter.segment_definition)).length
  }
  const stats = await q(
    `SELECT * FROM crm.newsletter_stats WHERE newsletter_id = $1 ORDER BY fetched_at DESC LIMIT 24`,
    [id],
  )
  return json({ newsletter, recipient_count: recipientCount, stats })
}

/** Úpravy jen u konceptu — po schválení je text zamčený. */
export const PATCH: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner', 'editor'])
  if (actor instanceof Response) return actor
  const id = context.params.id
  if (!isUuid(id)) return jsonError(404, 'not_found')

  let body: {
    subject?: unknown
    preheader?: unknown
    locale?: unknown
    html?: unknown
    plain?: unknown
    segment?: unknown
  }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }

  const fields: Parameters<typeof updateDraft>[1] = {}
  if (typeof body.subject === 'string' && body.subject.trim()) fields.subject = body.subject.trim().slice(0, 300)
  if (body.preheader !== undefined) {
    fields.preheader = typeof body.preheader === 'string' ? body.preheader.trim().slice(0, 300) : null
  }
  if (body.locale === 'de' || body.locale === 'en' || body.locale === 'cs') fields.locale = body.locale
  if (typeof body.html === 'string') {
    if (body.html.length > 1_000_000) return jsonError(400, 'bad_request', { message: 'HTML je příliš velké.' })
    fields.html = body.html
  }
  if (typeof body.plain === 'string') fields.plain = body.plain
  if (body.segment !== undefined) fields.segment = parseSegmentDefinition(body.segment)

  const result = await updateDraft(id, fields)
  if (result === 'not_found') return jsonError(404, 'not_found')
  if (result === 'not_draft') return jsonError(409, 'not_draft', { message: 'Upravit lze jen koncept.' })

  const { ip, userAgent } = requestMeta(context.request)
  await audit({ actorId: actor.id, action: 'update', entity: 'newsletters', entityId: id, diff: { fields: Object.keys(fields) }, ip, userAgent })
  return json({ ok: true })
}
