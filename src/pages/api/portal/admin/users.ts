import type { APIRoute } from 'astro'
import {
  listUsers,
  inviteUser,
  sendInviteMail,
  setUserActive,
  updateOwnerGuarded,
} from '../../../../lib/portal/auth/users'
import { qOne } from '../../../../lib/portal/db'
import { revokeAllSessions, type PortalRole } from '../../../../lib/portal/auth/session'
import { json, jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../lib/portal/audit'

export const prerender = false

const ROLES: PortalRole[] = ['owner', 'editor', 'analyst', 'viewer']

export const GET: APIRoute = async (context) => {
  const user = requireUser(context, ['owner'])
  if (user instanceof Response) return user
  return json({ users: await listUsers() })
}

/** Pozvání nového uživatele (registrace je vypnutá — účty vznikají jen tudy). */
export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner'])
  if (actor instanceof Response) return actor
  let body: { email?: string; role?: string }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const email = String(body.email ?? '').trim().toLowerCase()
  const role = String(body.role ?? '') as PortalRole
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError(400, 'invalid_email')
  if (!ROLES.includes(role)) return jsonError(400, 'invalid_role')

  const result = await inviteUser(email, role, actor.id, context.url.origin)
  if ('error' in result) return jsonError(409, 'conflict', { message: result.error })
  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'invite_created',
    entity: 'portal_users',
    entityId: result.userId,
    diff: { email, role, mail_sent: result.mailSent },
    ip,
    userAgent,
  })
  return json({ ok: true, userId: result.userId, mailSent: result.mailSent })
}

export const PATCH: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner'])
  if (actor instanceof Response) return actor
  let body: { id?: string; action?: string; role?: string }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const id = String(body.id ?? '')
  const target = await qOne<{ id: string; email: string; role: PortalRole; is_active: boolean }>(
    `SELECT id, email, role, is_active FROM crm.portal_users WHERE id = $1`,
    [id],
  )
  if (!target) return jsonError(404, 'not_found')
  const { ip, userAgent } = requestMeta(context.request)

  switch (body.action) {
    case 'deactivate': {
      // pojistka proti zamčení běží transakčně se zámkem owner řádků
      const result = await updateOwnerGuarded(id, { action: 'deactivate' })
      if ('error' in result) {
        return result.error === 'last_owner' ? jsonError(409, 'last_owner') : jsonError(404, 'not_found')
      }
      const revoked = await revokeAllSessions(id)
      await audit({ actorId: actor.id, action: 'user_deactivated', entity: 'portal_users', entityId: id, diff: { revoked }, ip, userAgent })
      return json({ ok: true })
    }
    case 'activate': {
      await setUserActive(id, true)
      await audit({ actorId: actor.id, action: 'user_activated', entity: 'portal_users', entityId: id, ip, userAgent })
      return json({ ok: true })
    }
    case 'set_role': {
      const role = String(body.role ?? '') as PortalRole
      if (!ROLES.includes(role)) return jsonError(400, 'invalid_role')
      const result = await updateOwnerGuarded(id, { action: 'set_role', role })
      if ('error' in result) {
        return result.error === 'last_owner' ? jsonError(409, 'last_owner') : jsonError(404, 'not_found')
      }
      await audit({ actorId: actor.id, action: 'role_changed', entity: 'portal_users', entityId: id, diff: { from: target.role, to: role }, ip, userAgent })
      return json({ ok: true })
    }
    case 'resend_invite': {
      const sent = await sendInviteMail(id, target.email, context.url.origin)
      await audit({ actorId: actor.id, action: 'invite_resent', entity: 'portal_users', entityId: id, diff: { mail_sent: sent }, ip, userAgent })
      return json({ ok: true, mailSent: sent })
    }
    default:
      return jsonError(400, 'invalid_action')
  }
}
