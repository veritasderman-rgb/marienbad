import type { APIRoute } from 'astro'
import { q } from '../../../../lib/portal/db'
import { consumeToken, setPassword } from '../../../../lib/portal/auth/users'
import { hashPassword, validatePasswordPolicy, isPwnedPassword } from '../../../../lib/portal/auth/passwords'
import { signState } from '../../../../lib/portal/crypto'
import { json, jsonError } from '../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../lib/portal/audit'

export const prerender = false

/**
 * Přijetí pozvánky: nastavení hesla. Účet je použitelný až po povinném
 * TOTP setupu, na který odpověď rovnou předává podepsaný state.
 */
export const POST: APIRoute = async (context) => {
  let body: { token?: string; password?: string; display_name?: string }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const token = String(body.token ?? '')
  const password = String(body.password ?? '')
  const displayName = String(body.display_name ?? '').trim().slice(0, 120)

  const policyError = validatePasswordPolicy(password)
  if (policyError) return jsonError(400, 'weak_password', { message: policyError })
  if (await isPwnedPassword(password)) {
    return jsonError(400, 'pwned_password', {
      message: 'Toto heslo se objevilo ve známých únicích dat — zvolte prosím jiné.',
    })
  }

  const consumed = await consumeToken('invite', token)
  if (!consumed) return jsonError(400, 'invalid_token')

  await setPassword(consumed.userId, await hashPassword(password))
  if (displayName) {
    await q(`UPDATE crm.portal_users SET display_name = $2 WHERE id = $1`, [consumed.userId, displayName])
  }
  const { ip, userAgent } = requestMeta(context.request)
  await audit({ actorId: consumed.userId, action: 'invite_accepted', entity: 'portal_users', entityId: consumed.userId, ip, userAgent })
  return json({ status: 'totp_setup', state: signState('totp_setup', consumed.userId) })
}
