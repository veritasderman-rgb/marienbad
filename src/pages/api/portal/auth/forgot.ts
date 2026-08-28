import type { APIRoute } from 'astro'
import { requestPasswordReset } from '../../../../lib/portal/auth/users'
import { json, jsonError } from '../../../../lib/portal/auth/guard'
import { checkBackoff, recordAuthEvent } from '../../../../lib/portal/auth/ratelimit'
import { requestMeta } from '../../../../lib/portal/audit'

export const prerender = false

/** Vždy vrací 200 — neprozrazuje, které účty existují. */
export const POST: APIRoute = async (context) => {
  const { ip } = requestMeta(context.request)
  const backoff = await checkBackoff('reset_request', null, ip)
  if (!backoff.allowed) return jsonError(429, 'too_many_attempts', { retry_after: backoff.retryAfterSec })
  let body: { email?: string }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const email = String(body.email ?? '').trim().toLowerCase()
  if (email) {
    await recordAuthEvent('reset_request', email, ip)
    await requestPasswordReset(email, context.url.origin)
  }
  return json({ ok: true })
}
