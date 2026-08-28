import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../../lib/portal/audit'
import { isUuid } from '../../../../../lib/portal/crm/partners'
import { getNewsletter } from '../../../../../lib/portal/newsletter/data'
import { sendMail } from '../../../../../lib/portal/mail'

export const prerender = false

/** Testovací odeslání jde VÝHRADNĚ na interní domény (audit N-02). */
const INTERNAL_DOMAINS = /@(ensanahotels\.com|marienbad\.com)$/i

export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner', 'editor'])
  if (actor instanceof Response) return actor
  const id = context.params.id
  if (!isUuid(id)) return jsonError(404, 'not_found')

  let body: { to?: unknown }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const to = typeof body.to === 'string' ? body.to.trim().toLowerCase() : ''
  if (!INTERNAL_DOMAINS.test(to)) {
    return jsonError(400, 'internal_only', {
      message: 'Testovací odeslání je možné jen na adresy @ensanahotels.com nebo @marienbad.com.',
    })
  }

  const newsletter = await getNewsletter(id)
  if (!newsletter) return jsonError(404, 'not_found')

  const result = await sendMail({
    to,
    subject: `[TEST] ${newsletter.subject}`,
    html: newsletter.html_body,
    text: newsletter.plain_body ?? undefined,
  })
  const { ip, userAgent } = requestMeta(context.request)
  await audit({ actorId: actor.id, action: 'test_send', entity: 'newsletters', entityId: id, diff: { to, sent: result.sent }, ip, userAgent })
  if (!result.sent) {
    return jsonError(503, 'mail_not_configured', {
      message: 'Odesílání e-mailů zatím není nakonfigurováno (RESEND_API_KEY).',
    })
  }
  return json({ ok: true })
}
