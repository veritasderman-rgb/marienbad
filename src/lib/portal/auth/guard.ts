import type { APIContext } from 'astro'
import type { PortalRole, PortalUser } from './session'
import { safeEqual } from '../crypto'
import { env, type ServerEnvName } from '../env'
import { recordAuthEvent, checkBackoff, alertOnRepeatedFailures } from './ratelimit'
import { requestMeta } from '../audit'

export function json(data: unknown, status = 200, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  })
}

export function jsonError(status: number, message: string, extra?: Record<string, unknown>): Response {
  return json({ error: message, ...extra }, status)
}

/**
 * Prohlížečové API: uživatele resolvuje middleware do locals.
 * Vrací uživatele, nebo rovnou hotovou 401/403 odpověď.
 */
export function requireUser(
  context: APIContext,
  roles?: PortalRole[],
): PortalUser | Response {
  const user = context.locals.portalUser
  if (!user) return jsonError(401, 'unauthenticated')
  if (roles && !roles.includes(user.role)) return jsonError(403, 'forbidden')
  return user
}

/** Role, které vidí nemaskované kontaktní údaje. */
export function canSeeContacts(role: PortalRole): boolean {
  return role === 'owner' || role === 'editor'
}

export function canEdit(role: PortalRole): boolean {
  return role === 'owner' || role === 'editor'
}

/**
 * Strojové cesty (cron / intake / export): výhradně bearer token z env,
 * porovnání v konstantním čase, rate limit + alert při opakovaných 401
 * (audit N-05). Session cookie tyto cesty ignorují už v middlewaru.
 */
export async function requireMachineToken(
  context: APIContext,
  tokenEnvName: ServerEnvName,
): Promise<Response | null> {
  const { ip } = requestMeta(context.request)
  const backoff = await checkBackoff('machine_401', tokenEnvName, ip)
  if (!backoff.allowed) {
    return jsonError(429, 'too_many_attempts', { retry_after: backoff.retryAfterSec })
  }
  const expected = env(tokenEnvName)
  const header = context.request.headers.get('authorization') ?? ''
  const provided = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!expected || !provided || !safeEqual(provided, expected)) {
    await recordAuthEvent('machine_401', tokenEnvName, ip)
    await alertOnRepeatedFailures('machine_401', tokenEnvName, ip)
    return jsonError(401, 'unauthorized')
  }
  return null
}
