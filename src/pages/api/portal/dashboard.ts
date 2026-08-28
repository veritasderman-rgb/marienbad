import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../lib/portal/auth/guard'
import { getDashboard, isValidPeriod } from '../../../lib/portal/dashboard'

export const prerender = false

/**
 * GET /api/portal/dashboard?period=YYYY-MM — dashboard výkonnosti firmy (NAVRH 5.6).
 *
 * Role: VŠECHNY včetně `viewer` — dashboard je jediná sekce, kterou viewer vidí,
 * a agregáty se nemaskují (maskují se jen kontaktní údaje, ne čísla).
 * Bez `period` se bere poslední měsíc s daty, ne aktuální měsíc.
 */
export const GET: APIRoute = async (context) => {
  const user = requireUser(context)
  if (user instanceof Response) return user

  const raw = context.url.searchParams.get('period')
  const period = raw === null || raw === '' ? null : raw
  if (period !== null && !isValidPeriod(period)) {
    return jsonError(400, 'bad_request', { message: 'period musí být ve tvaru YYYY-MM' })
  }

  const result = await getDashboard(period)
  if (result.ok) return json(result.data)

  // Žádná data v celé tabulce: UI si s tím poradí a nabídne import.
  if (result.reason === 'empty') return json({ empty: true, periods: [] })

  // Období existuje syntakticky, ale nemá data — nuly by lhaly, tak radši
  // 400 a seznam období, ze kterých si UI může vybrat.
  return jsonError(400, 'unknown_period', { periods: result.periods })
}
