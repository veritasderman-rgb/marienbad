import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { env } from '../../../../lib/portal/env'
import { runSyncWithLock } from '../../../../lib/portal/newsletter/sync'

export const prerender = false

/**
 * Ruční spuštění syncu CRM → skupiny `B2B · *` z portálu (role owner/editor).
 *
 * Stejná logika i stejný zámek jako noční cron — když zrovna běží cron,
 * vrátí se 409 `locked` místo druhého souběžného běhu. Výsledek se vrací
 * v odpovědi, aby ho člověk viděl hned; chybové položky obsahují jen
 * doménu adresy (GDPR, viz sync.ts).
 */
export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner', 'editor'])
  if (actor instanceof Response) return actor

  if (!env('MAILERLITE_API_KEY')) {
    return json({ ok: false, skipped: 'mailerlite_not_configured' })
  }

  const outcome = await runSyncWithLock(actor.id)
  if (!outcome.ok) {
    if (outcome.reason === 'locked') {
      return jsonError(409, 'locked', { message: 'Sync už právě běží — zkuste to za chvíli.' })
    }
    return jsonError(500, 'sync_failed', { message: outcome.error })
  }
  return json({ ok: true, ...outcome.result })
}
