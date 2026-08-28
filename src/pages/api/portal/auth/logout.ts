import type { APIRoute } from 'astro'
import { revokeSession, clearSessionCookie } from '../../../../lib/portal/auth/session'
import { json } from '../../../../lib/portal/auth/guard'

export const prerender = false

export const POST: APIRoute = async (context) => {
  if (context.locals.portalSessionId) {
    await revokeSession(context.locals.portalSessionId)
  }
  clearSessionCookie(context.cookies)
  return json({ ok: true })
}
