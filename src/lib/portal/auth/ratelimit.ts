import { q, qOne } from '../db'
import { sendAlert } from '../mail'

export type AuthEventKind =
  | 'login_fail'
  | 'login_ok'
  | 'totp_fail'
  | 'machine_401'
  | 'reset_request'
  | 'invite_fail'
  | 'alert_sent'

const WINDOW_MINUTES = 15
const FREE_ATTEMPTS = 5
const ALERT_THRESHOLD = 10

export async function recordAuthEvent(
  kind: AuthEventKind,
  identifier: string | null,
  ip: string | null,
  meta?: unknown,
): Promise<void> {
  await q(
    `INSERT INTO crm.auth_events (kind, identifier, ip, meta) VALUES ($1, $2, $3, $4)`,
    [kind, identifier, ip, meta === undefined ? null : JSON.stringify(meta)],
  ).catch((err) => console.error('[portal/auth] zápis auth events selhal:', err))
}

/**
 * Exponenciální zpomalení po neúspěších — na identifikátor (e-mail / jméno
 * tokenu) i na IP. Do FREE_ATTEMPTS pokusů v okně volno; pak se vyžaduje
 * rostoucí odstup od posledního neúspěchu (2^n s, strop 30 minut).
 */
export async function checkBackoff(
  failKind: AuthEventKind,
  identifier: string | null,
  ip: string | null,
): Promise<{ allowed: boolean; retryAfterSec: number }> {
  const row = await qOne<{ fails: string; last_at: string | null }>(
    `SELECT count(*) AS fails, max(at) AS last_at
     FROM crm.auth_events
     WHERE kind = $1
       AND at > now() - ($2 || ' minutes')::interval
       AND ((identifier IS NOT NULL AND identifier = $3) OR (ip IS NOT NULL AND ip = $4))`,
    [failKind, String(WINDOW_MINUTES), identifier, ip],
  )
  const fails = Number(row?.fails ?? 0)
  if (fails < FREE_ATTEMPTS || !row?.last_at) return { allowed: true, retryAfterSec: 0 }
  const requiredDelaySec = Math.min(2 ** (fails - FREE_ATTEMPTS + 1), 1800)
  const elapsedSec = (Date.now() - new Date(row.last_at).getTime()) / 1000
  if (elapsedSec >= requiredDelaySec) return { allowed: true, retryAfterSec: 0 }
  return { allowed: false, retryAfterSec: Math.ceil(requiredDelaySec - elapsedSec) }
}

/** Po opakovaných neúspěších pošle alert správci — max. jednou za hodinu na identifikátor. */
export async function alertOnRepeatedFailures(
  failKind: AuthEventKind,
  identifier: string | null,
  ip: string | null,
): Promise<void> {
  const row = await qOne<{ fails: string }>(
    `SELECT count(*) AS fails FROM crm.auth_events
     WHERE kind = $1 AND at > now() - interval '1 hour'
       AND ((identifier IS NOT NULL AND identifier = $2) OR (ip IS NOT NULL AND ip = $3))`,
    [failKind, identifier, ip],
  )
  if (Number(row?.fails ?? 0) < ALERT_THRESHOLD) return
  const already = await qOne(
    `SELECT 1 FROM crm.auth_events
     WHERE kind = 'alert_sent' AND identifier = $1 AND at > now() - interval '1 hour'`,
    [identifier ?? ip ?? 'unknown'],
  )
  if (already) return
  await recordAuthEvent('alert_sent', identifier ?? ip ?? 'unknown', ip)
  await sendAlert(
    `Opakované neúspěšné pokusy (${failKind})`,
    `<p>Identifikátor: <b>${identifier ?? '—'}</b><br>IP: <b>${ip ?? '—'}</b><br>` +
      `Za poslední hodinu ≥ ${ALERT_THRESHOLD} neúspěchů. Zkontrolujte audit log portálu.</p>`,
  )
}
