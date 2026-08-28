import type { AstroCookies } from 'astro'
import { q, qOne } from '../db'
import { randomToken, sha256hex, safeEqual } from '../crypto'

export const SESSION_COOKIE = '__Host-portal_session'

const IDLE_TIMEOUT_HOURS = 8
const ABSOLUTE_DAYS = 7
const ROTATE_AFTER_MINUTES = 60 // „krátkodobý access token": tajemství se rotuje po hodině
const ROTATION_GRACE_SECONDS = 60 // souběžné požadavky během rotace
const TOUCH_THROTTLE_MINUTES = 5

export type PortalRole = 'owner' | 'editor' | 'analyst' | 'viewer'

export interface PortalUser {
  id: string
  email: string
  display_name: string
  role: PortalRole
  is_active: boolean
  totp_enabled: boolean
}

interface SessionRow {
  id: string
  user_id: string
  token_hash: string
  prev_token_hash: string | null
  rotated_at: string
  last_seen_at: string
  absolute_expires_at: string
  revoked_at: string | null
  email: string
  display_name: string
  role: PortalRole
  is_active: boolean
  totp_enabled: boolean
}

export interface ValidSession {
  user: PortalUser
  sessionId: string
  /** Nová hodnota cookie, pokud proběhla rotace tajemství. */
  refreshedCookieValue?: string
}

export async function createSession(
  userId: string,
  ip: string | null,
  userAgent: string | null,
): Promise<string> {
  const secret = randomToken(32)
  const row = await qOne<{ id: string }>(
    `INSERT INTO crm.portal_sessions (user_id, token_hash, absolute_expires_at, ip, user_agent)
     VALUES ($1, $2, now() + interval '${ABSOLUTE_DAYS} days', $3, $4)
     RETURNING id`,
    [userId, sha256hex(secret), ip, userAgent],
  )
  if (!row) throw new Error('Session se nepodařilo založit')
  await q(`UPDATE crm.portal_users SET last_login_at = now() WHERE id = $1`, [userId])
  return `${row.id}.${secret}`
}

export async function validateSessionCookie(cookieValue: string | undefined): Promise<ValidSession | null> {
  if (!cookieValue) return null
  const dot = cookieValue.indexOf('.')
  if (dot <= 0) return null
  const sessionId = cookieValue.slice(0, dot)
  const secret = cookieValue.slice(dot + 1)
  if (!/^[0-9a-f-]{36}$/.test(sessionId) || !secret) return null

  const row = await qOne<SessionRow>(
    `SELECT s.id, s.user_id, s.token_hash, s.prev_token_hash, s.rotated_at,
            s.last_seen_at, s.absolute_expires_at, s.revoked_at,
            u.email, u.display_name, u.role, u.is_active, u.totp_enabled
     FROM crm.portal_sessions s
     JOIN crm.portal_users u ON u.id = s.user_id
     WHERE s.id = $1`,
    [sessionId],
  )
  if (!row || row.revoked_at || !row.is_active) return null
  const now = Date.now()
  if (new Date(row.absolute_expires_at).getTime() < now) return null
  if (now - new Date(row.last_seen_at).getTime() > IDLE_TIMEOUT_HOURS * 3600_000) {
    await revokeSession(sessionId)
    return null
  }

  const secretHash = sha256hex(secret)
  const matchesCurrent = safeEqual(secretHash, row.token_hash)
  const withinGrace = now - new Date(row.rotated_at).getTime() < ROTATION_GRACE_SECONDS * 1000
  const matchesPrev = !!row.prev_token_hash && withinGrace && safeEqual(secretHash, row.prev_token_hash)
  if (!matchesCurrent && !matchesPrev) return null

  const user: PortalUser = {
    id: row.user_id,
    email: row.email,
    display_name: row.display_name,
    role: row.role,
    is_active: row.is_active,
    totp_enabled: row.totp_enabled,
  }

  let refreshedCookieValue: string | undefined
  const rotationDue =
    matchesCurrent && now - new Date(row.rotated_at).getTime() > ROTATE_AFTER_MINUTES * 60_000
  if (rotationDue) {
    // Rotace podmíněná otiskem, který jsme četli: ze dvou souběžných požadavků
    // rotuje jen jeden a jen ten pošle prohlížeči novou cookie — jinak by
    // druhý zápis zneplatnil tajemství vydané prvním.
    const newSecret = randomToken(32)
    const updated = await q<{ id: string }>(
      `UPDATE crm.portal_sessions
       SET prev_token_hash = token_hash, token_hash = $2, rotated_at = now(), last_seen_at = now()
       WHERE id = $1 AND token_hash = $3 AND revoked_at IS NULL
       RETURNING id`,
      [sessionId, sha256hex(newSecret), row.token_hash],
    )
    if (updated.length === 1) {
      refreshedCookieValue = `${sessionId}.${newSecret}`
    }
  } else if (now - new Date(row.last_seen_at).getTime() > TOUCH_THROTTLE_MINUTES * 60_000) {
    await q(`UPDATE crm.portal_sessions SET last_seen_at = now() WHERE id = $1`, [sessionId])
  }

  return { user, sessionId, refreshedCookieValue }
}

export async function revokeSession(sessionId: string): Promise<void> {
  await q(`UPDATE crm.portal_sessions SET revoked_at = now() WHERE id = $1 AND revoked_at IS NULL`, [sessionId])
}

export async function revokeAllSessions(userId: string): Promise<number> {
  const rows = await q<{ id: string }>(
    `UPDATE crm.portal_sessions SET revoked_at = now()
     WHERE user_id = $1 AND revoked_at IS NULL RETURNING id`,
    [userId],
  )
  return rows.length
}

export function setSessionCookie(cookies: AstroCookies, value: string): void {
  cookies.set(SESSION_COOKIE, value, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: ABSOLUTE_DAYS * 24 * 3600,
  })
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' })
}
