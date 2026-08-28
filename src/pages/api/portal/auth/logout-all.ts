import type { APIRoute } from 'astro'
import { revokeAllSessions, clearSessionCookie } from '../../../../lib/portal/auth/session'
import { json, requireUser } from '../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../lib/portal/audit'

export const prerender = false

export const POST: APIRoute = async (context) => {
  const user = requireUser(context)
  if (user instanceof Response) return user
  const revoked = await revokeAllSessions(user.id)
  clearSessionCookie(context.cookies)
  const { ip, userAgent } = requestMeta(context.request)
  await audit({ actorId: user.id, action: 'logout_all', entity: 'portal_users', entityId: user.id, diff: { revoked }, ip, userAgent })
  return json({ ok: true, revoked })
}
