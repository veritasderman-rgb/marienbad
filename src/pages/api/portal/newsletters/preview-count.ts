import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { parseSegmentDefinition, resolveRecipients } from '../../../../lib/portal/newsletter/data'

export const prerender = false

/** Přesný počet příjemců pro zvolený segment (NAVRH 5.1 krok 2). */
export const POST: APIRoute = async (context) => {
  const user = requireUser(context, ['owner', 'editor'])
  if (user instanceof Response) return user
  let body: { segment?: unknown }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const segment = parseSegmentDefinition(body.segment)
  if (!segment) return jsonError(400, 'bad_request', { message: 'Neplatná definice segmentu.' })
  const recipients = await resolveRecipients(segment)
  return json({ count: recipients.length })
}
