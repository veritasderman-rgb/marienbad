import { q, qOne, withTx } from '../db'
import { randomToken, sha256hex } from '../crypto'
import { sendMail } from '../mail'
import type { PortalRole } from './session'

const INVITE_DAYS = 7
const RESET_MINUTES = 60

export interface UserRow {
  id: string
  email: string
  display_name: string
  role: PortalRole
  is_active: boolean
  totp_enabled: boolean
  has_password: boolean
  last_login_at: string | null
  created_at: string
}

export async function listUsers(): Promise<UserRow[]> {
  return q<UserRow>(
    `SELECT id, email, display_name, role, is_active, totp_enabled,
            password_hash IS NOT NULL AS has_password, last_login_at, created_at
     FROM crm.portal_users ORDER BY created_at`,
  )
}

async function createToken(userId: string, kind: 'invite' | 'password_reset', ttl: string): Promise<string> {
  const raw = randomToken(32)
  await q(
    `INSERT INTO crm.user_tokens (user_id, kind, token_hash, expires_at)
     VALUES ($1, $2, $3, now() + $4::interval)`,
    [userId, kind, sha256hex(raw), ttl],
  )
  return raw
}

/**
 * Atomicky spotřebuje jednorázový token: podmíněný UPDATE `used_at` zaručuje,
 * že ze dvou souběžných požadavků se stejným odkazem uspěje právě jeden.
 */
export async function consumeToken(
  kind: 'invite' | 'password_reset',
  rawToken: string,
): Promise<{ userId: string; tokenId: string } | null> {
  const row = await qOne<{ id: string; user_id: string }>(
    `UPDATE crm.user_tokens t SET used_at = now()
     FROM crm.portal_users u
     WHERE u.id = t.user_id
       AND t.kind = $1 AND t.token_hash = $2
       AND t.used_at IS NULL AND t.expires_at > now() AND u.is_active
     RETURNING t.id, t.user_id`,
    [kind, sha256hex(rawToken)],
  )
  if (!row) return null
  return { userId: row.user_id, tokenId: row.id }
}

/** Náhled tokenu bez spotřebování (pro render stránky s formulářem). */
export async function peekToken(
  kind: 'invite' | 'password_reset',
  rawToken: string,
): Promise<{ userId: string; email: string } | null> {
  const row = await qOne<{ user_id: string; email: string }>(
    `SELECT t.user_id, u.email
     FROM crm.user_tokens t
     JOIN crm.portal_users u ON u.id = t.user_id
     WHERE t.kind = $1 AND t.token_hash = $2
       AND t.used_at IS NULL AND t.expires_at > now() AND u.is_active`,
    [kind, sha256hex(rawToken)],
  )
  return row ? { userId: row.user_id, email: row.email } : null
}

export async function inviteUser(
  email: string,
  role: PortalRole,
  invitedBy: string,
  origin: string,
): Promise<{ userId: string; mailSent: boolean } | { error: string }> {
  const existing = await qOne<{ id: string }>(`SELECT id FROM crm.portal_users WHERE email = $1`, [email])
  if (existing) return { error: 'Uživatel s tímto e-mailem už existuje.' }
  const row = await qOne<{ id: string }>(
    `INSERT INTO crm.portal_users (email, role, invited_by) VALUES ($1, $2, $3) RETURNING id`,
    [email, role, invitedBy],
  )
  if (!row) return { error: 'Uživatele se nepodařilo založit.' }
  const mailSent = await sendInviteMail(row.id, email, origin)
  return { userId: row.id, mailSent }
}

export async function sendInviteMail(userId: string, email: string, origin: string): Promise<boolean> {
  const raw = await createToken(userId, 'invite', `${INVITE_DAYS} days`)
  const link = `${origin}/portal/invite/${raw}`
  const result = await sendMail({
    to: email,
    subject: 'Pozvánka do partnerského portálu Marienbad',
    html:
      `<p>Byli jste pozváni do partnerského portálu marienbad.com.</p>` +
      `<p><a href="${link}">Nastavit heslo a aktivovat účet</a></p>` +
      `<p>Odkaz platí ${INVITE_DAYS} dní a lze ho použít jen jednou.</p>`,
    text: `Pozvánka do partnerského portálu: ${link} (platí ${INVITE_DAYS} dní)`,
  })
  return result.sent
}

/** Vždy tiché — neprozrazuje, jestli účet existuje. */
export async function requestPasswordReset(email: string, origin: string): Promise<void> {
  const user = await qOne<{ id: string }>(
    `SELECT id FROM crm.portal_users WHERE email = $1 AND is_active AND password_hash IS NOT NULL`,
    [email],
  )
  if (!user) return
  const raw = await createToken(user.id, 'password_reset', `${RESET_MINUTES} minutes`)
  const link = `${origin}/portal/reset/${raw}`
  await sendMail({
    to: email,
    subject: 'Obnova hesla — partnerský portál Marienbad',
    html:
      `<p>Někdo (nejspíš vy) požádal o obnovu hesla do partnerského portálu.</p>` +
      `<p><a href="${link}">Nastavit nové heslo</a> (platí ${RESET_MINUTES} minut, jednorázově)</p>` +
      `<p>Pokud jste o obnovu nežádali, tento e-mail ignorujte.</p>`,
    text: `Obnova hesla: ${link} (platí ${RESET_MINUTES} minut)`,
  })
}

export async function setPassword(userId: string, passwordHash: string): Promise<void> {
  await q(`UPDATE crm.portal_users SET password_hash = $2 WHERE id = $1`, [userId, passwordHash])
}

export async function setUserActive(userId: string, active: boolean): Promise<void> {
  await q(`UPDATE crm.portal_users SET is_active = $2 WHERE id = $1`, [userId, active])
}

/**
 * Deaktivace / degradace s pojistkou posledního ownera — v jedné transakci
 * se zámkem owner řádků (FOR UPDATE), aby dvě souběžné žádosti nemohly
 * portál připravit o posledního aktivního správce.
 */
export async function updateOwnerGuarded(
  userId: string,
  change: { action: 'deactivate' } | { action: 'set_role'; role: PortalRole },
): Promise<{ ok: true } | { error: 'last_owner' | 'not_found' }> {
  return withTx(async (client) => {
    const owners = await client.query(
      `SELECT id FROM crm.portal_users
       WHERE role = 'owner' AND is_active AND password_hash IS NOT NULL
       FOR UPDATE`,
    )
    const target = await client.query(`SELECT id, role FROM crm.portal_users WHERE id = $1 FOR UPDATE`, [userId])
    if (target.rows.length === 0) return { error: 'not_found' as const }
    const isActiveOwner = owners.rows.some((r) => r.id === userId)
    const removesOwner = change.action === 'deactivate' || change.role !== 'owner'
    if (isActiveOwner && removesOwner && owners.rows.length <= 1) {
      return { error: 'last_owner' as const }
    }
    if (change.action === 'deactivate') {
      await client.query(`UPDATE crm.portal_users SET is_active = false WHERE id = $1`, [userId])
    } else {
      await client.query(`UPDATE crm.portal_users SET role = $2 WHERE id = $1`, [userId, change.role])
    }
    return { ok: true as const }
  })
}
