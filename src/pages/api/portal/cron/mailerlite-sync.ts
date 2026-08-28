import type { APIContext, APIRoute } from 'astro'
import { requireMachineToken, json, jsonError } from '../../../../lib/portal/auth/guard'
import { env } from '../../../../lib/portal/env'
import { runSyncWithLock } from '../../../../lib/portal/newsletter/sync'

export const prerender = false

/**
 * Noční sync CRM → skupiny `B2B · *` v MailerLite (NAVRH 5.1, 5.7).
 *
 * Vercel Cron (`vercel.json`, 0 3 * * * UTC) volá GET s hlavičkou
 * `Authorization: Bearer <CRON_SECRET>`; POST je tu pro ruční spuštění
 * přes curl. Session cookie tuto cestu ignoruje už v middlewaru — jediná
 * autentizace je strojový token.
 *
 * Souběh: Vercel negarantuje přesně jedno spuštění, proto zámek v
 * `crm.job_locks`. Druhý běh dostane 409 a skončí bez práce.
 * Běh je idempotentní — opakování konverguje ke stejnému stavu.
 */
async function handle(context: APIContext): Promise<Response> {
  const denied = await requireMachineToken(context, 'CRON_SECRET')
  if (denied) return denied

  // Env nemusí být nasazené (zejména v preview) — job to nesmí shodit.
  if (!env('MAILERLITE_API_KEY')) {
    return json({ ok: false, skipped: 'mailerlite_not_configured' })
  }

  const outcome = await runSyncWithLock(null)
  if (!outcome.ok) {
    if (outcome.reason === 'locked') return jsonError(409, 'locked')
    return jsonError(500, 'sync_failed', { message: outcome.error })
  }
  return json({ ok: true, ...outcome.result })
}

export const GET: APIRoute = handle
export const POST: APIRoute = handle
