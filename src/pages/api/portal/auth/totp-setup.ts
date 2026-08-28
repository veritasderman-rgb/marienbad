import type { APIRoute } from 'astro'
import QRCode from 'qrcode'
import { qOne, q } from '../../../../lib/portal/db'
import { verifyState, signState } from '../../../../lib/portal/crypto'
import {
  generateTotpSecret,
  totpKeyUri,
  verifyTotpCode,
  encryptTotpSecret,
  decryptTotpSecret,
} from '../../../../lib/portal/auth/totp'
import { createSession, setSessionCookie } from '../../../../lib/portal/auth/session'
import { json, jsonError } from '../../../../lib/portal/auth/guard'
import { requestMeta, audit } from '../../../../lib/portal/audit'
import { checkBackoff, recordAuthEvent } from '../../../../lib/portal/auth/ratelimit'

export const prerender = false

/**
 * Prvotní nastavení TOTP (povinné pro všechny účty).
 * POST {state}          → vygeneruje a uloží tajemství, vrátí QR + klíč
 * POST {state, code}    → ověří kód, zapne TOTP, založí session
 */
export const POST: APIRoute = async (context) => {
  const { ip, userAgent } = requestMeta(context.request)
  let body: { state?: string; code?: string }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const state = verifyState(String(body.state ?? ''), 'totp_setup')
  if (!state) return jsonError(401, 'state_expired')

  const user = await qOne<{ id: string; email: string; totp_enabled: boolean; totp_secret_enc: string | null; is_active: boolean }>(
    `SELECT id, email, totp_enabled, totp_secret_enc, is_active FROM crm.portal_users WHERE id = $1`,
    [state.userId],
  )
  if (!user || !user.is_active) return jsonError(401, 'invalid')
  if (user.totp_enabled) return jsonError(409, 'totp_already_enabled')

  if (!body.code) {
    const secret = generateTotpSecret()
    await q(`UPDATE crm.portal_users SET totp_secret_enc = $2 WHERE id = $1`, [user.id, encryptTotpSecret(secret)])
    const uri = totpKeyUri(user.email, secret)
    const qrDataUrl = await QRCode.toDataURL(uri, { margin: 1, width: 220 })
    // nový state s čerstvou platností pro krok ověření kódu
    return json({ secret, uri, qrDataUrl, state: signState('totp_setup', user.id, 600) })
  }

  const backoff = await checkBackoff('totp_fail', user.email, ip)
  if (!backoff.allowed) return jsonError(429, 'too_many_attempts', { retry_after: backoff.retryAfterSec })
  if (!user.totp_secret_enc) return jsonError(400, 'setup_not_started')
  const secret = decryptTotpSecret(user.totp_secret_enc)
  if (!(await verifyTotpCode(secret, String(body.code)))) {
    await recordAuthEvent('totp_fail', user.email, ip)
    return jsonError(401, 'invalid_code')
  }

  await q(`UPDATE crm.portal_users SET totp_enabled = true WHERE id = $1`, [user.id])
  const cookieValue = await createSession(user.id, ip, userAgent)
  setSessionCookie(context.cookies, cookieValue)
  await audit({ actorId: user.id, action: 'totp_enabled', entity: 'portal_users', entityId: user.id, ip, userAgent })
  return json({ ok: true, redirect: '/portal' })
}
