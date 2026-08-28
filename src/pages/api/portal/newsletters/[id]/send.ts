import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../../lib/portal/audit'
import { isUuid } from '../../../../../lib/portal/crm/partners'
import { q } from '../../../../../lib/portal/db'
import {
  getNewsletter,
  groupIdsFor,
  resolveRecipients,
  snapshotRecipients,
} from '../../../../../lib/portal/newsletter/data'
import { createCampaign, scheduleCampaignInstant } from '../../../../../lib/portal/newsletter/mailerlite'

export const prerender = false

/**
 * Odeslání schváleného newsletteru přes MailerLite — JEN role owner.
 *
 * Pojistky (NAVRH 3.5, 5.7 / audit N-01, N-07):
 *  - stav musí být 'approved' se záznamem approved_by/approved_at,
 *  - cílové skupiny vznikají výhradně z allowlistu B2B (groupIdsFor →
 *    createCampaign s assertAllowedGroups) — spotřebitelům z kvízu ani
 *    „všem odběratelům" kampaň fyzicky poslat nejde,
 *  - před odesláním se uloží snímek příjemců z CRM.
 *
 * Idempotence při výpadku: založení kampaně a odeslání jsou dva kroky;
 * campaign id se ukládá hned po založení, opakovaný pokus tedy nezaloží
 * druhou kampaň, jen doodešle.
 */
export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, ['owner'])
  if (actor instanceof Response) return actor
  const id = context.params.id
  if (!isUuid(id)) return jsonError(404, 'not_found')

  const newsletter = await getNewsletter(id)
  if (!newsletter) return jsonError(404, 'not_found')
  if (newsletter.status === 'sent') return jsonError(409, 'already_sent')
  if (newsletter.status !== 'approved' || !newsletter.approved_by || !newsletter.approved_at) {
    return jsonError(409, 'not_approved', { message: 'Odeslat lze jen schválený newsletter.' })
  }
  if (!newsletter.segment_definition) return jsonError(409, 'no_segment')

  const recipients = await resolveRecipients(newsletter.segment_definition)
  if (recipients.length === 0) {
    return jsonError(409, 'no_recipients', {
      message: 'Definici segmentu neodpovídají žádné kontakty s opt-in — není komu odeslat.',
    })
  }

  const groupIds = groupIdsFor(newsletter.segment_definition)

  let campaignId = newsletter.mailerlite_campaign_id
  if (!campaignId) {
    const campaign = await createCampaign({
      name: `B2B ${newsletter.slug}`,
      subject: newsletter.subject,
      preheader: newsletter.preheader,
      groupIds,
      html: newsletter.html_body,
      plain: newsletter.plain_body,
    })
    campaignId = campaign.id
    await q(`UPDATE crm.newsletters SET mailerlite_campaign_id = $2 WHERE id = $1`, [id, campaignId])
  }

  await snapshotRecipients(id, recipients)
  await scheduleCampaignInstant(campaignId)

  await q(
    `UPDATE crm.newsletters SET status = 'sent', sent_at = now(), recipients_count = $2 WHERE id = $1`,
    [id, recipients.length],
  )
  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'send',
    entity: 'newsletters',
    entityId: id,
    diff: { campaign_id: campaignId, recipients: recipients.length, groups: groupIds },
    ip,
    userAgent,
  })
  return json({ ok: true, campaign_id: campaignId, recipients: recipients.length })
}
