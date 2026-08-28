import type { APIRoute } from 'astro'
import { json, requireUser } from '../../../../lib/portal/auth/guard'
import { q } from '../../../../lib/portal/db'
import { verificationState, type VerificationState } from '../../../../lib/portal/verifications/run'
import type { RiskLevel } from '../../../../lib/portal/verifications/hlidac'

export const prerender = false

const READ_ROLES = ['owner', 'editor', 'analyst'] as const

interface Row {
  partner_id: string
  name: string
  ico: string | null
  country: string | null
  status: string
  risk_level: RiskLevel | null
  checked_at: string | null
  raw: unknown
  source_url: string | null
}

function reasonsFrom(raw: unknown): string[] {
  if (typeof raw !== 'object' || raw === null) return []
  const value = (raw as { reasons?: unknown }).reasons
  if (!Array.isArray(value)) return []
  return value.filter((r): r is string => typeof r === 'string')
}

/**
 * Přehled prověrek (NAVRH 5.5). Čte se z cache v databázi — API Hlídače se
 * při zobrazení stránky nikdy nevolá.
 *
 * Stav se nikdy nepřepisuje na „ok" tam, kde nevíme: partner bez českého IČO
 * je `foreign` (mimo dosah Hlídače), případně `no_ico` (český partner, kterému
 * je potřeba IČO přiřadit ručně). Neaktivní partneři se nezobrazují — stejný
 * rozsah jako u hromadného běhu.
 */
export const GET: APIRoute = async (context) => {
  const user = requireUser(context, [...READ_ROLES])
  if (user instanceof Response) return user

  const rows = await q<Row>(
    `SELECT p.id AS partner_id, p.name, p.ico, p.country, p.status,
            v.risk_level, v.checked_at, v.raw, v.source_url
     FROM crm.partners p
     LEFT JOIN LATERAL (
       SELECT risk_level, checked_at, raw, source_url
       FROM crm.partner_verifications pv
       WHERE pv.partner_id = p.id
       ORDER BY pv.checked_at DESC
       LIMIT 1
     ) v ON true
     WHERE p.status <> 'inactive'
     ORDER BY
       CASE v.risk_level WHEN 'alert' THEN 0 WHEN 'watch' THEN 1 ELSE 2 END,
       p.name`,
  )

  const counts = { verified: 0, alert: 0, watch: 0, pending: 0, foreign: 0, no_ico: 0 }
  const result = rows.map((row) => {
    const state: VerificationState = verificationState({
      ico: row.ico,
      country: row.country,
      hasVerification: row.risk_level !== null,
    })
    counts[state] += 1
    if (row.risk_level === 'alert') counts.alert += 1
    if (row.risk_level === 'watch') counts.watch += 1
    return {
      partner_id: row.partner_id,
      name: row.name,
      ico: row.ico,
      country: row.country,
      status: row.status,
      risk_level: row.risk_level,
      checked_at: row.checked_at,
      reasons: reasonsFrom(row.raw),
      source_url: row.source_url,
      verification_state: state,
    }
  })

  return json({ rows: result, counts })
}
