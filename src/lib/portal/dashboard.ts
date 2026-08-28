import { q, qOne } from './db'

/**
 * Dashboard výkonnosti firmy (NAVRH 5.6) — souhrn přes všechny partnery.
 *
 * Dvě pravidla, která tenhle soubor drží:
 *  - referenčním bodem je VŽDY poslední uzavřený měsíc s daty, nikdy `now()`;
 *    jinak by čísla klesala jen proto, že měsíc ještě nikdo nenahrál,
 *  - do SQL jdou hodnoty výhradně jako parametry ($1); období se navíc
 *    validuje regulárním výrazem, než se z něj udělá datum.
 *
 * Veškerá agregace je v SQL (crm.partner_performance + crm.v_performance_compare
 * + crm.partners); v TS zůstávají jen procenta a podíly — čisté funkce dole,
 * které testuje tests/dashboard.test.ts.
 */

// ---------------------------------------------------------------------------
// Čisté funkce — procenta a podíly (bez DB, testované)
// ---------------------------------------------------------------------------

/** Zaokrouhlení na jedno desetinné místo (procenta v UI). */
function round1(value: number): number {
  return Math.round(value * 10) / 10
}

/** Zaokrouhlení na haléře (peníze). */
function round2(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Procentní změna proti základu. `null` znamená „nedá se spočítat":
 * chybí základ (null/undefined), základ je nula (dělení nulou), nebo
 * některá z hodnot není konečné číslo. Nikdy nevrací Infinity ani NaN —
 * z „z nuly na tisíc" se nesmí stát „+∞ %" v grafu.
 */
export function pctChange(
  current: number | null | undefined,
  previous: number | null | undefined,
): number | null {
  if (current === null || current === undefined) return null
  if (previous === null || previous === undefined) return null
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null
  if (previous === 0) return null
  return round1(((current - previous) / previous) * 100)
}

/**
 * Podíl části na celku v procentech. Nulový nebo chybějící celek dává 0 —
 * v rozpadu je „0 %" srozumitelnější než prázdné místo a součet řádků
 * tím zůstane definovaný.
 */
export function share(part: number | null | undefined, total: number | null | undefined): number {
  if (part === null || part === undefined || !Number.isFinite(part)) return 0
  if (total === null || total === undefined || !Number.isFinite(total) || total === 0) return 0
  return round1((part / total) * 100)
}

/**
 * Ponechá `limit` největších položek a zbytek sloučí do jednoho řádku
 * pojmenovaného `restLabel`. Vstup se předpokládá seřazený sestupně
 * (řadí SQL); zbytkový řádek se přidá jen když je z čeho.
 */
export function topWithRest<T extends { revenue_eur: number }>(
  rows: T[],
  limit: number,
  makeRest: (revenueEur: number) => T,
): T[] {
  if (rows.length <= limit) return rows
  const head = rows.slice(0, limit)
  const restSum = rows.slice(limit).reduce((sum, row) => sum + row.revenue_eur, 0)
  if (restSum === 0) return head
  return [...head, makeRest(round2(restSum))]
}

// ---------------------------------------------------------------------------
// Typy odpovědi
// ---------------------------------------------------------------------------

export type DashboardKpi = {
  revenue_eur: number
  mom_pct: number | null
  yoy_pct: number | null
  revenue_r12: number | null
  r12_pct: number | null
  room_nights: number
  room_nights_yoy_pct: number | null
  partners_with_data: number
  top5_concentration_pct: number
}

export type TrendPoint = { month: string; revenue_eur: number; room_nights: number }

export type SegmentShare = { segment: string; revenue_eur: number; share_pct: number }
export type CountryShare = { country: string; revenue_eur: number; share_pct: number }
export type TierShare = { tier: string; revenue_eur: number; share_pct: number }
export type HotelShare = { hotel_slug: string; revenue_eur: number; share_pct: number }

export type Mover = {
  partner_id: string
  name: string
  ytd_eur: number
  prev_ytd_eur: number
  delta_eur: number
  pct: number | null
}

export type NewsletterOverlapSide = { partners: number; revenue_eur: number }

export type DashboardData = {
  period: string
  periods: string[]
  kpi: DashboardKpi
  trend: TrendPoint[]
  breakdown_segment: SegmentShare[]
  breakdown_country: CountryShare[]
  breakdown_tier: TierShare[]
  breakdown_hotel: HotelShare[]
  movers: { up: Mover[]; down: Mover[] }
  newsletter_overlap: { in_lists: NewsletterOverlapSide; not_in_lists: NewsletterOverlapSide }
}

export type DashboardEmpty = { empty: true; periods: [] }

export const COUNTRY_TOP_N = 8
export const COUNTRY_REST_LABEL = 'OSTATNÍ'
export const TIER_NONE_LABEL = 'bez tieru'
export const MOVERS_LIMIT = 10
export const TREND_MONTHS = 24

// ---------------------------------------------------------------------------
// Vstup
// ---------------------------------------------------------------------------

const PERIOD_RE = /^[0-9]{4}-(0[1-9]|1[0-2])$/

export function isValidPeriod(value: string): boolean {
  return PERIOD_RE.test(value)
}

/** 'YYYY-MM' → 'YYYY-MM-01'; volat až po isValidPeriod. */
function periodToDate(period: string): string {
  return `${period}-01`
}

// ---------------------------------------------------------------------------
// Dotazy
// ---------------------------------------------------------------------------

/** Dostupná období sestupně jako 'YYYY-MM'. Prázdné pole = žádná data. */
export async function listPeriods(): Promise<string[]> {
  const rows = await q<{ month: string }>(
    `SELECT to_char(period_month, 'YYYY-MM') AS month
       FROM crm.partner_performance
      GROUP BY period_month
      ORDER BY period_month DESC`,
  )
  return rows.map((row) => row.month)
}

type KpiRow = {
  revenue_eur: number
  revenue_prev_month: number | null
  revenue_yoy: number | null
  revenue_r12: number | null
  revenue_r12_prev: number | null
  room_nights: number
  room_nights_yoy: number | null
  partners_with_data: number
  top5_revenue_eur: number
  partners_revenue_eur: number
  /** null jen v teoretickém případě prázdné tabulky — pak se R12 nepočítá. */
  r12_window_complete: boolean | null
}

async function loadKpi(monthDate: string): Promise<DashboardKpi> {
  // Celofiremní čísla = součet řádků view za daný měsíc. View drží pro každého
  // partnera souvislou řadu měsíců (chybějící měsíc = nula), takže LAG i klouzavá
  // okna mají u všech partnerů stejný rozsah a součet přes partnery je poctivý.
  const row = await qOne<KpiRow>(
    `WITH agg AS (
       SELECT COALESCE(SUM(c.revenue_eur), 0)::float8         AS revenue_eur,
              SUM(c.revenue_prev_month)::float8               AS revenue_prev_month,
              SUM(c.revenue_same_month_last_year)::float8     AS revenue_yoy,
              SUM(c.revenue_r12)::float8                      AS revenue_r12,
              SUM(c.revenue_r12_prev)::float8                 AS revenue_r12_prev,
              COALESCE(SUM(c.room_nights), 0)::int            AS room_nights,
              SUM(c.room_nights_same_month_last_year)::int    AS room_nights_yoy,
              (COUNT(*) FILTER (WHERE c.revenue_eur <> 0))::int AS partners_with_data
         FROM crm.v_performance_compare c
        WHERE c.period_month = $1::date
     ),
     span AS (
       SELECT MIN(period_month) AS min_month FROM crm.partner_performance
     ),
     per_partner AS (
       SELECT partner_id, COALESCE(SUM(revenue_eur), 0) AS rev
         FROM crm.partner_performance
        WHERE period_month = $1::date
        GROUP BY partner_id
     ),
     top5 AS (
       SELECT COALESCE(SUM(rev), 0) AS rev
         FROM (SELECT rev FROM per_partner ORDER BY rev DESC LIMIT 5) t
     )
     SELECT agg.*,
            top5.rev::float8 AS top5_revenue_eur,
            (SELECT COALESCE(SUM(rev), 0) FROM per_partner)::float8 AS partners_revenue_eur,
            (span.min_month <= ($1::date - interval '23 months')) AS r12_window_complete
       FROM agg CROSS JOIN span CROSS JOIN top5`,
    [monthDate],
  )

  const kpi: KpiRow = row ?? {
    revenue_eur: 0,
    revenue_prev_month: null,
    revenue_yoy: null,
    revenue_r12: null,
    revenue_r12_prev: null,
    room_nights: 0,
    room_nights_yoy: null,
    partners_with_data: 0,
    top5_revenue_eur: 0,
    partners_revenue_eur: 0,
    r12_window_complete: false,
  }

  // R12 se srovnává jen s ÚPLNÝM předchozím oknem. Podmínku držíme globálně
  // (nejstarší měsíc dat ≤ period − 23 měsíců), ne per partner: view dopočítává
  // každému partnerovi celý rozsah nulami, takže r12_prev_months je v daném
  // měsíci u všech partnerů stejné — a požadovat r12_prev_months = 12 u každého
  // partnera zvlášť by navíc nesmyslně vypnulo metriku kvůli nově přibylým
  // partnerům, kteří před rokem legitimně měli nuly.
  const r12Pct = kpi.r12_window_complete ? pctChange(kpi.revenue_r12, kpi.revenue_r12_prev) : null

  return {
    revenue_eur: round2(kpi.revenue_eur),
    mom_pct: pctChange(kpi.revenue_eur, kpi.revenue_prev_month),
    yoy_pct: pctChange(kpi.revenue_eur, kpi.revenue_yoy),
    revenue_r12: kpi.revenue_r12 === null ? null : round2(kpi.revenue_r12),
    r12_pct: r12Pct,
    room_nights: kpi.room_nights,
    room_nights_yoy_pct: pctChange(kpi.room_nights, kpi.room_nights_yoy),
    partners_with_data: kpi.partners_with_data,
    top5_concentration_pct: share(kpi.top5_revenue_eur, kpi.partners_revenue_eur),
  }
}

async function loadTrend(monthDate: string): Promise<TrendPoint[]> {
  // Měsíce se generují, ne jen čtou: díra v datech má v grafu být nula,
  // ne přeskočený bod. Řada začíná nejdřív prvním měsícem s daty.
  const rows = await q<{ month: string; revenue_eur: number; room_nights: number }>(
    `WITH span AS (
       SELECT MIN(period_month) AS min_month FROM crm.partner_performance
     ),
     months AS (
       SELECT g.month::date AS period_month
         FROM span,
              generate_series(
                GREATEST(span.min_month, ($1::date - interval '${TREND_MONTHS - 1} months')::date),
                $1::date,
                interval '1 month'
              ) AS g(month)
     ),
     agg AS (
       SELECT period_month,
              SUM(revenue_eur) AS revenue_eur,
              SUM(room_nights) AS room_nights
         FROM crm.partner_performance
        WHERE period_month <= $1::date
        GROUP BY period_month
     )
     SELECT to_char(m.period_month, 'YYYY-MM')     AS month,
            COALESCE(a.revenue_eur, 0)::float8     AS revenue_eur,
            COALESCE(a.room_nights, 0)::int        AS room_nights
       FROM months m
       LEFT JOIN agg a ON a.period_month = m.period_month
      ORDER BY m.period_month`,
    [monthDate],
  )
  return rows.map((row) => ({
    month: row.month,
    revenue_eur: round2(row.revenue_eur),
    room_nights: row.room_nights,
  }))
}

type BreakdownRow = { key: string | null; revenue_eur: number }

/**
 * Rozpad za období podle jednoho klíče. Výraz pro klíč NIKDY nepochází ze
 * vstupu — volá se jen s konstantami níže.
 */
async function loadBreakdown(monthDate: string, keyExpr: string, from: string): Promise<BreakdownRow[]> {
  return q<BreakdownRow>(
    `SELECT ${keyExpr} AS key, COALESCE(SUM(pp.revenue_eur), 0)::float8 AS revenue_eur
       ${from}
      WHERE pp.period_month = $1::date
      GROUP BY 1
      ORDER BY 2 DESC NULLS LAST`,
    [monthDate],
  )
}

const FROM_WITH_PARTNERS =
  'FROM crm.partner_performance pp JOIN crm.partners p ON p.id = pp.partner_id'
const FROM_PERFORMANCE = 'FROM crm.partner_performance pp'

function totalOf(rows: BreakdownRow[]): number {
  return rows.reduce((sum, row) => sum + row.revenue_eur, 0)
}

const MOVERS_CTE = `
  WITH cur AS (
    SELECT partner_id, SUM(revenue_eur) AS ytd
      FROM crm.partner_performance
     WHERE period_month >= date_trunc('year', $1::date)::date
       AND period_month <= $1::date
     GROUP BY partner_id
  ),
  prev AS (
    SELECT partner_id, SUM(revenue_eur) AS ytd
      FROM crm.partner_performance
     WHERE period_month >= (date_trunc('year', $1::date) - interval '1 year')::date
       AND period_month <= ($1::date - interval '1 year')::date
     GROUP BY partner_id
  ),
  joined AS (
    SELECT COALESCE(cur.partner_id, prev.partner_id)  AS partner_id,
           COALESCE(cur.ytd, 0)::float8               AS ytd_eur,
           COALESCE(prev.ytd, 0)::float8              AS prev_ytd_eur,
           (COALESCE(cur.ytd, 0) - COALESCE(prev.ytd, 0))::float8 AS delta_eur
      FROM cur FULL JOIN prev ON prev.partner_id = cur.partner_id
  )
  SELECT j.partner_id, p.name, j.ytd_eur, j.prev_ytd_eur, j.delta_eur
    FROM joined j
    JOIN crm.partners p ON p.id = j.partner_id
   WHERE j.delta_eur <> 0
`

type MoverRow = {
  partner_id: string
  name: string
  ytd_eur: number
  prev_ytd_eur: number
  delta_eur: number
}

function toMover(row: MoverRow): Mover {
  return {
    partner_id: row.partner_id,
    name: row.name,
    ytd_eur: round2(row.ytd_eur),
    prev_ytd_eur: round2(row.prev_ytd_eur),
    delta_eur: round2(row.delta_eur),
    pct: pctChange(row.ytd_eur, row.prev_ytd_eur),
  }
}

/**
 * Deset partnerů nahoru a deset dolů: YTD (leden…period) proti stejnému oknu
 * loni. Řadí se podle |delta| — nahoře tedy delta DESC, dole delta ASC.
 * Směr řazení je konstanta v SQL, ne vstup.
 */
async function loadMovers(monthDate: string): Promise<{ up: Mover[]; down: Mover[] }> {
  const [up, down] = await Promise.all([
    q<MoverRow>(`${MOVERS_CTE} ORDER BY j.delta_eur DESC LIMIT ${MOVERS_LIMIT}`, [monthDate]),
    q<MoverRow>(`${MOVERS_CTE} ORDER BY j.delta_eur ASC LIMIT ${MOVERS_LIMIT}`, [monthDate]),
  ])
  return { up: up.map(toMover), down: down.map(toMover) }
}

/**
 * Průnik s rozesílkami. Je to SOUVISLOST, ne důkaz (NAVRH 5.6): že partner
 * v seznamu má vyšší obrat, neznamená, že za to může newsletter.
 * „V seznamech" = má aspoň jeden kontakt s newsletter_opt_in, který se
 * neodhlásil.
 */
async function loadNewsletterOverlap(
  monthDate: string,
): Promise<{ in_lists: NewsletterOverlapSide; not_in_lists: NewsletterOverlapSide }> {
  const rows = await q<{ in_lists: boolean; partners: number; revenue_eur: number }>(
    `WITH perf AS (
       SELECT partner_id, COALESCE(SUM(revenue_eur), 0) AS rev
         FROM crm.partner_performance
        WHERE period_month = $1::date
        GROUP BY partner_id
     ),
     flagged AS (
       SELECT perf.partner_id,
              perf.rev,
              EXISTS (
                SELECT 1 FROM crm.partner_contacts c
                 WHERE c.partner_id = perf.partner_id
                   AND c.newsletter_opt_in
                   AND c.unsubscribed_at IS NULL
              ) AS in_lists
         FROM perf
     )
     SELECT in_lists,
            COUNT(*)::int                 AS partners,
            COALESCE(SUM(rev), 0)::float8 AS revenue_eur
       FROM flagged
      GROUP BY in_lists`,
    [monthDate],
  )
  const empty: NewsletterOverlapSide = { partners: 0, revenue_eur: 0 }
  const side = (flag: boolean): NewsletterOverlapSide => {
    const row = rows.find((item) => item.in_lists === flag)
    if (!row) return { ...empty }
    return { partners: row.partners, revenue_eur: round2(row.revenue_eur ?? 0) }
  }
  return { in_lists: side(true), not_in_lists: side(false) }
}

// ---------------------------------------------------------------------------
// Sestavení dashboardu
// ---------------------------------------------------------------------------

export type DashboardResult =
  | { ok: true; data: DashboardData }
  | { ok: false; reason: 'empty'; periods: [] }
  | { ok: false; reason: 'unknown_period'; periods: string[] }

/**
 * @param requestedPeriod 'YYYY-MM', nebo null pro poslední měsíc s daty.
 *   Formát si ověřuje volající (isValidPeriod) — sem už chodí ověřený.
 */
export async function getDashboard(requestedPeriod: string | null): Promise<DashboardResult> {
  const periods = await listPeriods()
  if (periods.length === 0) return { ok: false, reason: 'empty', periods: [] }

  // Výchozí období = poslední měsíc s daty (NAVRH 5.6), ne aktuální měsíc.
  const period = requestedPeriod ?? periods[0]!
  if (!periods.includes(period)) return { ok: false, reason: 'unknown_period', periods }

  const monthDate = periodToDate(period)

  const [kpi, trend, segmentRows, countryRows, tierRows, hotelRows, movers, overlap] =
    await Promise.all([
      loadKpi(monthDate),
      loadTrend(monthDate),
      loadBreakdown(monthDate, 'p.segment', FROM_WITH_PARTNERS),
      loadBreakdown(monthDate, 'p.country', FROM_WITH_PARTNERS),
      loadBreakdown(monthDate, `COALESCE(p.tier, '${TIER_NONE_LABEL}')`, FROM_WITH_PARTNERS),
      loadBreakdown(monthDate, 'pp.hotel_slug', FROM_PERFORMANCE),
      loadMovers(monthDate),
      loadNewsletterOverlap(monthDate),
    ])

  const segmentTotal = totalOf(segmentRows)
  const countryTotal = totalOf(countryRows)
  const tierTotal = totalOf(tierRows)
  const hotelTotal = totalOf(hotelRows)

  // Země: top 8 a zbytek do jednoho řádku — dlouhý ocas jednorázových trhů
  // graf jen zašumí. Podíly se počítají z PŮVODNÍHO celku, aby dávaly 100 %.
  const countryFolded = topWithRest(
    countryRows.map((row) => ({
      country: row.key ?? COUNTRY_REST_LABEL,
      revenue_eur: round2(row.revenue_eur),
    })),
    COUNTRY_TOP_N,
    (revenueEur) => ({ country: COUNTRY_REST_LABEL, revenue_eur: revenueEur }),
  )

  return {
    ok: true,
    data: {
      period,
      periods,
      kpi,
      trend,
      breakdown_segment: segmentRows.map((row) => ({
        segment: row.key ?? 'other',
        revenue_eur: round2(row.revenue_eur),
        share_pct: share(row.revenue_eur, segmentTotal),
      })),
      breakdown_country: countryFolded.map((row) => ({
        ...row,
        share_pct: share(row.revenue_eur, countryTotal),
      })),
      breakdown_tier: tierRows.map((row) => ({
        tier: row.key ?? TIER_NONE_LABEL,
        revenue_eur: round2(row.revenue_eur),
        share_pct: share(row.revenue_eur, tierTotal),
      })),
      breakdown_hotel: hotelRows.map((row) => ({
        hotel_slug: row.key ?? '',
        revenue_eur: round2(row.revenue_eur),
        share_pct: share(row.revenue_eur, hotelTotal),
      })),
      movers,
      newsletter_overlap: overlap,
    },
  }
}
