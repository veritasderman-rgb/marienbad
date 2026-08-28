import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { q } from '../../../../lib/portal/db'
import { audit, requestMeta } from '../../../../lib/portal/audit'
import { createDraft, parseSegmentDefinition } from '../../../../lib/portal/newsletter/data'

export const prerender = false

export const GET: APIRoute = async (context) => {
  const user = requireUser(context, ['owner', 'editor', 'analyst'])
  if (user instanceof Response) return user
  const newsletters = await q(
    `SELECT n.id, n.slug, n.subject, n.preheader, n.locale, n.status, n.created_via,
            n.sent_at, n.recipients_count, n.created_at, n.approved_at,
            u.display_name AS created_by_name, a.display_name AS approved_by_name
     FROM crm.newsletters n
     LEFT JOIN crm.portal_users u ON u.id = n.created_by
     LEFT JOIN crm.portal_users a ON a.id = n.approved_by
     ORDER BY n.created_at DESC
     LIMIT 200`,
  )
  return json({ newsletters })
}

export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner', 'editor'])
  if (actor instanceof Response) return actor
  let body: { subject?: unknown; preheader?: unknown; locale?: unknown; html?: unknown; segment?: unknown }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 300) : ''
  const locale = body.locale === 'de' || body.locale === 'en' || body.locale === 'cs' ? body.locale : null
  const html = typeof body.html === 'string' ? body.html : '<html><body><p></p></body></html>'
  if (!subject || !locale) return jsonError(400, 'bad_request', { message: 'Povinná pole: subject, locale.' })

  const draft = await createDraft({
    subject,
    preheader: typeof body.preheader === 'string' ? body.preheader.trim().slice(0, 300) : null,
    locale,
    html,
    segment: parseSegmentDefinition(body.segment),
    createdBy: actor.id,
    createdVia: 'portal',
  })
  const { ip, userAgent } = requestMeta(context.request)
  await audit({ actorId: actor.id, action: 'create', entity: 'newsletters', entityId: draft.id, diff: { subject }, ip, userAgent })
  return json({ ok: true, id: draft.id })
}
