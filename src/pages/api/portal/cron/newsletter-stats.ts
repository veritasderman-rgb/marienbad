import type { APIRoute } from 'astro'
import { requireMachineToken, json } from '../../../../lib/portal/auth/guard'
import { q, qOne } from '../../../../lib/portal/db'
import { env } from '../../../../lib/portal/env'
import { audit } from '../../../../lib/portal/audit'
import { sendAlert, sendMail } from '../../../../lib/portal/mail'
import { getCampaignStats, getCampaignLinks } from '../../../../lib/portal/newsletter/mailerlite'
import { runAllVerifications } from '../../../../lib/portal/verifications/run'

export const prerender = false

/**
 * Měsíční sběr statistik rozesílek (NAVRH 5.2, fáze 4).
 *
 * Append-only: každý běh přidá NOVÝ řádek do newsletter_stats pro každou
 * odeslanou kampaň (≤ 12 měsíců zpět) — vzniká časová řada. Vercel
 * negarantuje přesně jedno spuštění: job je idempotentní v tom smyslu, že
 * zameškaný měsíc se sám zahojí příštím během (bere se aktuální stav, ne
 * delta) a souběh brání zámek v crm.job_locks.
 */

const LOCK_NAME = 'newsletter-stats'
const LOCK_MINUTES = 10

async function acquireLock(): Promise<boolean> {
  const row = await qOne<{ name: string }>(
    `INSERT INTO crm.job_locks (name, locked_at, expires_at)
     VALUES ($1, now(), now() + interval '${LOCK_MINUTES} minutes')
     ON CONFLICT (name) DO UPDATE
       SET locked_at = now(), expires_at = now() + interval '${LOCK_MINUTES} minutes'
       WHERE crm.job_locks.expires_at < now()
     RETURNING name`,
    [LOCK_NAME],
  )
  return row !== null
}

async function releaseLock(): Promise<void> {
  await q(`DELETE FROM crm.job_locks WHERE name = $1`, [LOCK_NAME])
}

async function collect(): Promise<{ collected: number; errors: string[] }> {
  const campaigns = await q<{ id: string; subject: string; mailerlite_campaign_id: string }>(
    `SELECT id, subject, mailerlite_campaign_id
     FROM crm.newsletters
     WHERE status = 'sent' AND mailerlite_campaign_id IS NOT NULL
       AND sent_at > now() - interval '12 months'
     ORDER BY sent_at`,
  )
  let collected = 0
  const errors: string[] = []
  for (const campaign of campaigns) {
    try {
      // idempotence: druhé spuštění v týž den nezakládá duplicitní snímek
      const today = await qOne(
        `SELECT 1 FROM crm.newsletter_stats WHERE newsletter_id = $1 AND fetched_at::date = CURRENT_DATE`,
        [campaign.id],
      )
      if (today) continue
      const result = await getCampaignStats(campaign.mailerlite_campaign_id)
      if (!result) {
        errors.push(`kampaň ${campaign.mailerlite_campaign_id}: v MailerLite neexistuje`)
        continue
      }
      const s = result.stats
      await q(
        `INSERT INTO crm.newsletter_stats
           (newsletter_id, sent, opens_count, unique_opens_count, open_rate,
            clicks_count, unique_clicks_count, click_rate, click_to_open_rate,
            unsubscribes_count, spam_count, hard_bounces_count, soft_bounces_count)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          campaign.id, s.sent, s.opens_count, s.unique_opens_count, s.open_rate,
          s.clicks_count, s.unique_clicks_count, s.click_rate, s.click_to_open_rate,
          s.unsubscribes_count, s.spam_count, s.hard_bounces_count, s.soft_bounces_count,
        ],
      )
      const links = await getCampaignLinks(campaign.mailerlite_campaign_id)
      for (const link of links) {
        await q(
          `INSERT INTO crm.newsletter_link_stats (newsletter_id, url, clicks_count) VALUES ($1, $2, $3)`,
          [campaign.id, link.url.slice(0, 2000), link.clicks_count],
        )
      }
      collected += 1
    } catch (err) {
      errors.push(`kampaň ${campaign.mailerlite_campaign_id}: ${err instanceof Error ? err.message : 'chyba'}`)
    }
  }
  return { collected, errors }
}

/** Měsíční souhrn správci — hlavní metrika prokliky a CTOR, otevřenost jen doplňkově (Apple MPP). */
async function sendMonthlySummary(): Promise<void> {
  const to = env('PORTAL_ALERT_EMAIL')
  if (!to) return
  const rows = await q<{
    subject: string
    sent_at: string
    recipients_count: number | null
    unique_clicks_count: number | null
    click_to_open_rate: string | null
    unique_opens_count: number | null
    unsubscribes_count: number | null
  }>(
    `SELECT n.subject, n.sent_at, n.recipients_count,
            s.unique_clicks_count, s.click_to_open_rate, s.unique_opens_count, s.unsubscribes_count
     FROM crm.newsletters n
     LEFT JOIN LATERAL (
       SELECT * FROM crm.newsletter_stats st
       WHERE st.newsletter_id = n.id ORDER BY st.fetched_at DESC LIMIT 1
     ) s ON true
     WHERE n.status = 'sent' AND n.sent_at > now() - interval '3 months'
     ORDER BY n.sent_at DESC`,
  )
  if (rows.length === 0) return
  const table = rows
    .map(
      (r) =>
        `<tr><td>${r.subject}</td><td>${new Date(r.sent_at).toLocaleDateString('cs-CZ')}</td>` +
        `<td>${r.recipients_count ?? '—'}</td><td><b>${r.unique_clicks_count ?? '—'}</b></td>` +
        `<td><b>${r.click_to_open_rate ?? '—'}</b></td><td>${r.unique_opens_count ?? '—'}</td>` +
        `<td>${r.unsubscribes_count ?? '—'}</td></tr>`,
    )
    .join('')
  await sendMail({
    to,
    subject: '[portál] Měsíční souhrn newsletterů',
    html:
      `<p>Statistiky rozesílek za poslední 3 měsíce (hlavní metrika: unikátní prokliky a CTOR — ` +
      `otevřenost je kvůli Apple Mail Privacy Protection nadhodnocená):</p>` +
      `<table border="1" cellpadding="6" cellspacing="0">` +
      `<tr><th>Předmět</th><th>Odesláno</th><th>Příjemců</th><th>Unikátní prokliky</th>` +
      `<th>CTOR</th><th>Unikátní otevření</th><th>Odhlášení</th></tr>${table}</table>` +
      `<p>Detail v portálu: /portal/newsletters</p>`,
  })
}

async function run(): Promise<Response> {
  if (!env('MAILERLITE_API_KEY')) {
    return json({ ok: false, skipped: 'mailerlite_not_configured' })
  }
  if (!(await acquireLock())) {
    return json({ error: 'locked' }, 409)
  }
  try {
    const { collected, errors } = await collect()
    await sendMonthlySummary()
    // měsíční přeověření partnerů v Hlídači státu (NAVRH 5.5) — stejný cron
    // jako statistiky; Hobby tarif Vercelu má strop 2 cron jobů
    const verifications = await runAllVerifications().catch((err) => ({
      error: err instanceof Error ? err.message : 'chyba',
    }))
    await audit({ actorId: null, action: 'newsletter_stats', entity: 'newsletters', diff: { collected, errors: errors.length, verifications } })
    if (errors.length > 0) {
      await sendAlert('Sběr statistik rozesílek — chyby', `<p>${errors.join('<br>')}</p>`)
    }
    if ('errors' in verifications && verifications.errors.length > 0) {
      await sendAlert('Prověrky partnerů — chyby', `<p>${verifications.errors.join('<br>')}</p>`)
    }
    return json({ ok: true, collected, errors, verifications })
  } catch (err) {
    await sendAlert('Sběr statistik rozesílek SELHAL', `<p>${err instanceof Error ? err.message : 'chyba'}</p>`)
    throw err
  } finally {
    await releaseLock()
  }
}

export const GET: APIRoute = async (context) => {
  const denied = await requireMachineToken(context, 'CRON_SECRET')
  if (denied) return denied
  return run()
}

export const POST: APIRoute = async (context) => {
  const denied = await requireMachineToken(context, 'CRON_SECRET')
  if (denied) return denied
  return run()
}
