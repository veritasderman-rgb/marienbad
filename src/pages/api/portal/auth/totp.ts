import type { APIRoute } from 'astro'
import { qOne } from '../../../../lib/portal/db'
import { verifyState } from '../../../../lib/portal/crypto'
import { verifyTotpCode, decryptTotpSecret } from '../../../../lib/portal/auth/totp'
import { createSession, setSessionCookie } from '../../../../lib/portal/auth/session'
import { json, jsonError } from '../../../../lib/portal/auth/guard'
import { checkBackoff, recordAuthEvent, alertOnRepeatedFailures } from '../../../../lib/portal/auth/ratelimit'
import { requestMeta, audit } from '../../../../lib/portal/audit'

export const prerender = false

/** Druhý krok přihlášení: ověření TOTP kódu a založení session. */
export const POST: APIRoute = async (context) => {
  const { ip, userAgent } = requestMeta(context.request)
  let body: { state?: string; code?: string }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const state = verifyState(String(body.state ?? ''), 'mfa')
  if (!state) return jsonError(401, 'state_expired')

  const user = await qOne<{ id: string; email: string; totp_secret_enc: string | null; is_active: boolean }>(
    `SELECT id, email, totp_secret_enc, is_active FROM crm.portal_users WHERE id = $1`,
    [state.userId],
  )
  if (!user || !user.is_active || !user.totp_secret_enc) return jsonError(401, 'invalid')

  // limit se počítá na e-mail — stejný identifikátor, pod jakým se neúspěchy zapisují
  const backoff = await checkBackoff('totp_fail', user.email, ip)
  if (!backoff.allowed) return jsonError(429, 'too_many_attempts', { retry_after: backoff.retryAfterSec })

  const secret = decryptTotpSecret(user.totp_secret_enc)
  if (!(await verifyTotpCode(secret, String(body.code ?? '')))) {
    await recordAuthEvent('totp_fail', user.email, ip)
    await alertOnRepeatedFailures('totp_fail', user.email, ip)
    return jsonError(401, 'invalid_code')
  }

  const cookieValue = await createSession(user.id, ip, userAgent)
  setSessionCookie(context.cookies, cookieValue)
  await audit({ actorId: user.id, action: 'login', entity: 'portal_users', entityId: user.id, ip, userAgent })
  return json({ ok: true, redirect: '/portal' })
}
