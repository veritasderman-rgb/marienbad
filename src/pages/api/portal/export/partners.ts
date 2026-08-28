import type { APIRoute } from 'astro'
import { requireMachineToken, json } from '../../../../lib/portal/auth/guard'
import { q, qOne } from '../../../../lib/portal/db'
import { audit } from '../../../../lib/portal/audit'

export const prerender = false

/**
 * Export metadat partnerů pro statistický dashboard (NAVRH 6.4, audit N-06).
 *
 * DASHBOARD_EXPORT_TOKEN je čtecí a vrací VÝHRADNĚ výčtovou projekci níže —
 * ne řádek tabulky. Nikdy: kontaktní osoby, e-maily, telefony, historie
 * komunikace, poznámky, vlastník vztahu. Jmenovité hodnocení rizika se
 * NEPŘENÁŠÍ — dashboard je soubor kolující mailem; jde jen příznak
 * verified a AGREGÁT („X partnerů ve stavu alert, detail v portálu").
 */
export const GET: APIRoute = async (context) => {
  const denied = await requireMachineToken(context, 'DASHBOARD_EXPORT_TOKEN')
  if (denied) return denied

  // explicitní projekce polí — přidání sloupce sem musí být vědomé rozhodnutí
  const partners = await q<{
    partner_id: string
    name: string
    ico: string | null
    segment: string
    tier: string | null
    country: string
    status: string
    verified: boolean
  }>(
    `SELECT p.id AS partner_id, p.name, p.ico, p.segment, p.tier, p.country, p.status,
            EXISTS (SELECT 1 FROM crm.partner_verifications v WHERE v.partner_id = p.id) AS verified
     FROM crm.partners p
     ORDER BY p.name`,
  )

  // agregát rizika za poslední prověrku každého partnera (nikdy jmenovitě)
  const risk = await qOne<{ alert_partners: string; watch_partners: string; alert_revenue_r12: string | null }>(
    `WITH latest AS (
       SELECT DISTINCT ON (partner_id) partner_id, risk_level
       FROM crm.partner_verifications
       ORDER BY partner_id, checked_at DESC
     ), r12 AS (
       SELECT partner_id, revenue_r12
       FROM crm.v_performance_compare c
       WHERE period_month = (SELECT MAX(period_month) FROM crm.partner_performance)
     )
     SELECT
       count(*) FILTER (WHERE l.risk_level = 'alert') AS alert_partners,
       count(*) FILTER (WHERE l.risk_level = 'watch') AS watch_partners,
       COALESCE(SUM(r.revenue_r12) FILTER (WHERE l.risk_level = 'alert'), 0)::text AS alert_revenue_r12
     FROM latest l
     LEFT JOIN r12 r ON r.partner_id = l.partner_id`,
  )

  await audit({ actorId: null, action: 'export', entity: 'partners', diff: { count: partners.length } })
  return json({
    generated_at: new Date().toISOString(),
    partners,
    risk_summary: {
      alert_partners: Number(risk?.alert_partners ?? 0),
      watch_partners: Number(risk?.watch_partners ?? 0),
      alert_revenue_r12_eur: risk?.alert_revenue_r12 ? Number(risk.alert_revenue_r12) : 0,
      note: 'Jmenovité hodnocení rizika je jen v portálu (/portal/verifications).',
    },
  })
}
