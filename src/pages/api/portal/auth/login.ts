import type { APIRoute } from 'astro'
import { qOne } from '../../../../lib/portal/db'
import { hashPassword, verifyPassword } from '../../../../lib/portal/auth/passwords'
import { signState, randomToken } from '../../../../lib/portal/crypto'
import { json, jsonError } from '../../../../lib/portal/auth/guard'
import { checkBackoff, recordAuthEvent, alertOnRepeatedFailures } from '../../../../lib/portal/auth/ratelimit'
import { requestMeta } from '../../../../lib/portal/audit'

export const prerender = false

// Skutečný argon2 otisk náhodné hodnoty pro vyrovnání času, když účet
// neexistuje — ověření proti němu trvá stejně dlouho jako proti pravému otisku
let dummyHashPromise: Promise<string> | null = null
function getDummyHash(): Promise<string> {
  dummyHashPromise ??= hashPassword(randomToken(24))
  return dummyHashPromise
}

export const POST: APIRoute = async (context) => {
  const { ip } = requestMeta(context.request)
  let body: { email?: string; password?: string }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const email = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')
  if (!email || !password) return jsonError(400, 'bad_request')

  const backoff = await checkBackoff('login_fail', email, ip)
  if (!backoff.allowed) {
    return jsonError(429, 'too_many_attempts', { retry_after: backoff.retryAfterSec })
  }

  const user = await qOne<{
    id: string
    password_hash: string | null
    totp_enabled: boolean
    is_active: boolean
  }>(`SELECT id, password_hash, totp_enabled, is_active FROM crm.portal_users WHERE email = $1`, [email])

  const hashToCheck = user?.password_hash ?? (await getDummyHash())
  const passwordOk = await verifyPassword(hashToCheck, password)

  if (!user || !user.is_active || !user.password_hash || !passwordOk) {
    await recordAuthEvent('login_fail', email, ip)
    await alertOnRepeatedFailures('login_fail', email, ip)
    return jsonError(401, 'invalid_credentials')
  }

  await recordAuthEvent('login_ok', email, ip)

  if (!user.totp_enabled) {
    // povinné TOTP: účet bez druhého faktoru se nejdřív musí dovybavit
    return json({ status: 'totp_setup', state: signState('totp_setup', user.id) })
  }
  return json({ status: 'totp', state: signState('mfa', user.id) })
}
