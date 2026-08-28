import type { APIRoute } from 'astro'
import { consumeTokenAndSetPassword } from '../../../../lib/portal/auth/users'
import { hashPassword, validatePasswordPolicy, isPwnedPassword } from '../../../../lib/portal/auth/passwords'
import { revokeAllSessions } from '../../../../lib/portal/auth/session'
import { json, jsonError } from '../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../lib/portal/audit'

export const prerender = false

export const POST: APIRoute = async (context) => {
  let body: { token?: string; password?: string }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const token = String(body.token ?? '')
  const password = String(body.password ?? '')

  const policyError = validatePasswordPolicy(password)
  if (policyError) return jsonError(400, 'weak_password', { message: policyError })
  if (await isPwnedPassword(password)) {
    return jsonError(400, 'pwned_password', {
      message: 'Toto heslo se objevilo ve známých únicích dat — zvolte prosím jiné.',
    })
  }

  // token se spotřebuje a heslo nastaví v jedné transakci — selhání
  // uprostřed platný odkaz nespálí
  const consumed = await consumeTokenAndSetPassword('password_reset', token, await hashPassword(password))
  if (!consumed) return jsonError(400, 'invalid_token')

  await revokeAllSessions(consumed.userId)
  const { ip, userAgent } = requestMeta(context.request)
  await audit({ actorId: consumed.userId, action: 'password_reset', entity: 'portal_users', entityId: consumed.userId, ip, userAgent })
  return json({ ok: true })
}
