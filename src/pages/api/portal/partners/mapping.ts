import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../lib/portal/audit'
import { q, qOne } from '../../../../lib/portal/db'
import { isUuid } from '../../../../lib/portal/crm/partners'
import {
  suggestPartnersForPayer,
  listPendingPmsBatches,
  getBatchStaging,
  processPerformanceRows,
} from '../../../../lib/portal/payers'

export const prerender = false

const KINDS = ['partner', 'aggregate', 'direct', 'insurer_internal', 'natural_person', 'ignore'] as const

/**
 * Fronta mapování plátců z PMS (NAVRH 6.2, obrazovka /portal/partners/mapping).
 * Nespárovaný plátce se nikam nezapočítává, dokud ho člověk nepotvrdí; po
 * potvrzení se čekající dávky přehrají — žádný řádek se neztratí.
 */
export const GET: APIRoute = async (context) => {
  const user = requireUser(context, ['owner', 'editor', 'analyst'])
  if (user instanceof Response) return user

  const pending = await q<{ id: string; payer_name_raw: string; payer_name_norm: string; created_at: string }>(
    `SELECT id, payer_name_raw, payer_name_norm, created_at
     FROM crm.partner_payer_map
     WHERE confirmed_at IS NULL
     ORDER BY created_at
     LIMIT 100`,
  )
  const rows = []
  for (const item of pending) {
    rows.push({ ...item, candidates: await suggestPartnersForPayer(item.payer_name_norm) })
  }
  const confirmed = await q(
    `SELECT m.id, m.payer_name_raw, m.kind, m.confirmed_at, p.name AS partner_name,
            u.display_name AS confirmed_by_name
     FROM crm.partner_payer_map m
     LEFT JOIN crm.partners p ON p.id = m.partner_id
     LEFT JOIN crm.portal_users u ON u.id = m.confirmed_by
     WHERE m.confirmed_at IS NOT NULL
     ORDER BY m.confirmed_at DESC
     LIMIT 200`,
  )
  const batches = await listPendingPmsBatches()
  return json({ pending: rows, confirmed, waiting_batches: batches.length })
}

/** Potvrzení mapování + přehrání čekajících dávek (obrat se doplní zpětně). */
export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner', 'editor'])
  if (actor instanceof Response) return actor

  let body: { id?: unknown; kind?: unknown; partner_id?: unknown }
  try {
    body = await context.request.json()
  } catch {
    return jsonError(400, 'bad_request')
  }
  const id = typeof body.id === 'string' ? body.id : ''
  if (!isUuid(id)) return jsonError(400, 'invalid_id')
  const kind = KINDS.includes(body.kind as (typeof KINDS)[number]) ? (body.kind as string) : null
  if (!kind) return jsonError(400, 'invalid_kind')
  let partnerId: string | null = null
  if (kind === 'partner') {
    partnerId = typeof body.partner_id === 'string' ? body.partner_id : ''
    if (!isUuid(partnerId)) return jsonError(400, 'partner_required', { message: 'Druh „partner" vyžaduje výběr partnera.' })
    const partner = await qOne(`SELECT id FROM crm.partners WHERE id = $1`, [partnerId])
    if (!partner) return jsonError(404, 'partner_not_found')
  }

  // potvrzení je jednorázové — přemapování potvrzeného řádku je vědomá
  // (zatím ruční) operace, ne klik ve frontě
  const updated = await qOne<{ payer_name_raw: string }>(
    `UPDATE crm.partner_payer_map
     SET kind = $2, partner_id = $3, confirmed_by = $4, confirmed_at = now()
     WHERE id = $1 AND confirmed_at IS NULL
     RETURNING payer_name_raw`,
    [id, kind, partnerId, actor.id],
  )
  if (!updated) return jsonError(409, 'already_confirmed')

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'payer_mapped',
    entity: 'partner_payer_map',
    entityId: id,
    diff: { payer: updated.payer_name_raw, kind, partner_id: partnerId },
    ip,
    userAgent,
  })

  // přehrání čekajících PMS dávek — upsert je idempotentní; dávka se čistí,
  // až když v ní nezbývá nic nespárovaného
  const reprocessed = { batches: 0, matched: 0, still_unmatched: 0 }
  for (const batch of await listPendingPmsBatches()) {
    const rows = await getBatchStaging(batch.id)
    if (!rows || rows.length === 0) continue
    const result = await processPerformanceRows(rows, batch.period, batch.id)
    reprocessed.batches += 1
    reprocessed.matched += result.matched
    reprocessed.still_unmatched += result.unmatched
    await q(
      `UPDATE crm.imports SET rows_ok = $2,
         staging = CASE WHEN $3::int > 0 THEN staging ELSE NULL END
       WHERE id = $1`,
      [batch.id, result.matched, result.unmatched],
    )
  }
  return json({ ok: true, reprocessed })
}
