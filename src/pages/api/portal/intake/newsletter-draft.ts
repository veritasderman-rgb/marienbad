import type { APIRoute } from 'astro'
import { requireMachineToken, json, jsonError } from '../../../../lib/portal/auth/guard'
import { audit } from '../../../../lib/portal/audit'
import { createDraft, parseSegmentDefinition } from '../../../../lib/portal/newsletter/data'

export const prerender = false

/**
 * Strojová cesta pro Claudův návrh newsletteru (NAVRH 3.5, audit N-01).
 *
 * Token NEWSLETTER_DRAFT_TOKEN umí JEDINÉ: založit koncept. Neumí odeslat,
 * neumí číst kontakty, neumí sahat na výkonnostní data. Odeslání vyžaduje
 * přihlášeného člověka s rolí owner, který text viděl a klikl na schválení.
 * Session cookie tato cesta ignoruje (middleware) — jen bearer token.
 */
export const POST: APIRoute = async (context) => {
  const denied = await requireMachineToken(context, 'NEWSLETTER_DRAFT_TOKEN')
  if (denied) return denied

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

  const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 300) : ''
  const html = typeof body.html === 'string' ? body.html : ''
  const locale = body.locale === 'de' || body.locale === 'en' || body.locale === 'cs' ? body.locale : null
  if (!subject || !html || !locale) {
    return jsonError(400, 'bad_request', { message: 'Povinná pole: subject, html, locale (de|en|cs).' })
  }
  if (html.length > 1_000_000) return jsonError(400, 'bad_request', { message: 'HTML je příliš velké.' })

  const draft = await createDraft({
    subject,
    preheader: typeof body.preheader === 'string' ? body.preheader.trim().slice(0, 300) : null,
    locale,
    html, // sanitizace proběhne v createDraft
    plain: typeof body.plain === 'string' ? body.plain : null,
    segment: parseSegmentDefinition(body.segment),
    createdBy: null,
    createdVia: 'intake',
  })
  await audit({ actorId: null, action: 'create', entity: 'newsletters', entityId: draft.id, diff: { via: 'intake', subject } })
  return json({ ok: true, id: draft.id, slug: draft.slug, portal_url: `/portal/newsletters/${draft.id}` })
}
