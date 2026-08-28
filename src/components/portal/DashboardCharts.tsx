/**
 * Grafové podkomponenty pro DashboardView (fáze 6, IMPLEMENTACNI_PLAN.md #10).
 *
 * Čisté SVG/divy bez knihoven — každý graf má tabulkovou alternativu přes
 * <details> pro přístupnost. Barvy a rozvržení dle UI reference sekce 10.
 */
import type { Segment } from './PartnerForm'
import { SEGMENT_LABELS } from './PartnerForm'

// ─── Sdílené formátovače ───────────────────────────────────────────────

export const moneyFormatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export const numberFormatter = new Intl.NumberFormat('cs-CZ')

const thousandsSignedFormatter = new Intl.NumberFormat('cs-CZ', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  signDisplay: 'exceptZero',
})

const pctSignedFormatter = new Intl.NumberFormat('cs-CZ', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  signDisplay: 'exceptZero',
})

const pctFormatter = new Intl.NumberFormat('cs-CZ', {
  maximumFractionDigits: 1,
})

export function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return moneyFormatter.format(value)
}

export function formatNights(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return numberFormatter.format(value)
}

/** '+12,3 tis. €' / '−4,0 tis. €' — pro delty ve „Největších pohybech". */
export function formatDeltaThousands(value: number): string {
  return `${thousandsSignedFormatter.format(value / 1000)} tis. €`
}

/** '+4,2 %' se znaménkem — pro delty. */
export function formatPctSigned(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${pctSignedFormatter.format(value)} %`
}

/** '4,2 %' bez znaménka — pro podíly. */
export function formatPct(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${pctFormatter.format(value)} %`
}

export function formatPeriodLabel(period: string): string {
  const date = new Date(`${period}-01T00:00:00`)
  if (Number.isNaN(date.getTime())) return period
  return new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(date)
}

function formatShortMonthLabel(period: string): string {
  const date = new Date(`${period}-01T00:00:00`)
  if (Number.isNaN(date.getTime())) return period
  const month = new Intl.DateTimeFormat('cs-CZ', { month: 'short' }).format(date).replace('.', '')
  const year = new Intl.DateTimeFormat('cs-CZ', { year: '2-digit' }).format(date)
  return `${month} ${year}`
}

// ─── Delta badge (▲/▼) pro KPI dlaždice ────────────────────────────────

export function DeltaBadge({ value, label }: { value: number | null | undefined; label: string }) {
  if (value === null || value === undefined) {
    return (
      <span className="text-[#5F6B72]">
        {label} <span>—</span>
      </span>
    )
  }
  const positive = value >= 0
  return (
    <span className="text-[#5F6B72]">
      {label}{' '}
      <span className={'font-semibold ' + (positive ? 'text-[#1E7A4F]' : 'text-[#B3264F]')}>
        {positive ? '▲' : '▼'} {pctFormatter.format(Math.abs(value))} %
      </span>
    </span>
  )
}

// ─── „Největší pohyby meziročně" — divergentní bary od nulové osy ─────

export interface Mover {
  partner_id: string
  name: string
  ytd_eur: number
  prev_ytd_eur: number
  delta_eur: number
  pct: number | null
}

export function MoversChart({ up, down }: { up: Mover[]; down: Mover[] }) {
  const items = [...up, ...down]

  if (items.length === 0) {
    return <p className="text-sm text-[#5F6B72]">Zatím žádná data o meziročních pohybech.</p>
  }

  const maxAbs = Math.max(1, ...items.map((m) => Math.abs(m.delta_eur)))

  return (
    <div>
      <div className="space-y-2.5">
        {items.map((m) => {
          const positive = m.delta_eur >= 0
          const widthPct = Math.min(100, (Math.abs(m.delta_eur) / maxAbs) * 100)
          return (
            <div key={m.partner_id} className="text-sm">
              <div className="mb-0.5 flex items-baseline justify-between gap-2">
                <a
                  href={`/portal/partners/${m.partner_id}`}
                  className="truncate font-medium text-[#004F71] hover:underline"
                >
                  {m.name}
                </a>
                <span
                  className={
                    'shrink-0 font-semibold whitespace-nowrap ' +
                    (positive ? 'text-[#1E7A4F]' : 'text-[#B3264F]')
                  }
                >
                  {formatDeltaThousands(m.delta_eur)} · {formatPctSigned(m.pct)}
                </span>
              </div>
              <div className="grid grid-cols-2 items-center gap-0">
                <div className="flex h-2.5 justify-end border-r border-beige-400 pr-px">
                  {!positive && (
                    <div
                      className="h-2.5 rounded-l bg-[#B3264F]"
                      style={{ width: `${widthPct}%` }}
                    />
                  )}
                </div>
                <div className="flex h-2.5 justify-start pl-px">
                  {positive && (
                    <div
                      className="h-2.5 rounded-r bg-[#1E7A4F]"
                      style={{ width: `${widthPct}%` }}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-[#5F6B72]">
        YTD vs stejné období loni · seznam „komu zavolat"
      </p>
    </div>
  )
}

// ─── „TOP partneři" — horizontální bary ────────────────────────────────

export function TopPartnersChart({ partners }: { partners: Mover[] }) {
  if (partners.length === 0) {
    return <p className="text-sm text-[#5F6B72]">Zatím žádná data o výkonnosti partnerů.</p>
  }
  const max = Math.max(1, ...partners.map((p) => p.ytd_eur))

  return (
    <div>
      <div className="space-y-2">
        {partners.map((p) => {
          const widthPct = Math.max(2, (p.ytd_eur / max) * 100)
          const labelInside = widthPct >= 38
          return (
            <div key={p.partner_id} className="text-sm">
              <a
                href={`/portal/partners/${p.partner_id}`}
                className="mb-0.5 block truncate font-medium text-[#004F71] hover:underline"
              >
                {p.name}
              </a>
              <div className="flex h-5 items-center rounded bg-beige-300">
                <div
                  className="flex h-5 items-center rounded bg-[#0E6EA8]"
                  style={{ width: `${widthPct}%` }}
                >
                  {labelInside && (
                    <span className="px-2 text-xs font-semibold whitespace-nowrap text-white">
                      {formatMoney(p.ytd_eur)}
                    </span>
                  )}
                </div>
                {!labelInside && (
                  <span className="px-2 text-xs font-semibold whitespace-nowrap text-[#1C2B33]">
                    {formatMoney(p.ytd_eur)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-[#5F6B72]">YTD obrat</p>

      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-semibold text-[#0E6EA8]">
          Zobrazit jako tabulku
        </summary>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
              <th className="py-1.5 pr-3 font-medium">Partner</th>
              <th className="py-1.5 pr-3 font-medium">YTD obrat</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.partner_id} className="border-b border-beige-300">
                <td className="py-1.5 pr-3">
                  <a href={`/portal/partners/${p.partner_id}`} className="text-[#004F71] hover:underline">
                    {p.name}
                  </a>
                </td>
                <td className="py-1.5 pr-3 whitespace-nowrap text-[#1C2B33]">{formatMoney(p.ytd_eur)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}

// ─── „Struktura tržeb podle segmentu" — 100% skládaný pruh ─────────────

export const DASHBOARD_SEGMENT_COLORS: Record<Segment, string> = {
  travel_agency: '#0E6EA8',
  tour_operator: '#4FB3D9',
  insurer: '#E8A400',
  corporate: '#C05F2E',
  other: '#8C949B',
}

export interface SegmentShare {
  segment: string
  revenue_eur: number
  share_pct: number
}

function segmentLabel(segment: string): string {
  return SEGMENT_LABELS[segment as Segment] ?? segment
}

function segmentColor(segment: string): string {
  return DASHBOARD_SEGMENT_COLORS[segment as Segment] ?? '#8C949B'
}

export function SegmentStackedBar({ items }: { items: SegmentShare[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-[#5F6B72]">Zatím žádná data o struktuře tržeb.</p>
  }

  return (
    <div>
      <div className="flex h-[34px] w-full overflow-hidden rounded-md" role="img" aria-label="Struktura tržeb podle typu plátce">
        {items.map((item) => (
          <div
            key={item.segment}
            className="flex h-full items-center justify-center first:rounded-l-md last:rounded-r-md"
            style={{ width: `${item.share_pct}%`, backgroundColor: segmentColor(item.segment) }}
            title={`${segmentLabel(item.segment)}: ${formatPct(item.share_pct)}`}
          >
            {item.share_pct >= 8 && (
              <span className="text-xs font-semibold text-white">{formatPct(item.share_pct)}</span>
            )}
          </div>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {items.map((item) => (
          <li key={item.segment} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: segmentColor(item.segment) }}
            />
            <span className="text-[#1C2B33]">{segmentLabel(item.segment)}</span>
            <span className="font-semibold text-[#004F71]">{formatPct(item.share_pct)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Mini horizontální bary (rozpad podle země / hotelu) ───────────────

export interface MiniBarItem {
  key: string
  label: string
  revenue_eur: number
}

const OTHER_COUNTRY_LABEL = 'Ostatní'

/** Top N položek podle obratu, zbytek sloučen do „Ostatní". */
export function topNWithOther(items: { key: string; label: string; revenue_eur: number }[], n: number): MiniBarItem[] {
  const sorted = [...items].sort((a, b) => b.revenue_eur - a.revenue_eur)
  if (sorted.length <= n) return sorted
  const top = sorted.slice(0, n)
  const restSum = sorted.slice(n).reduce((sum, item) => sum + item.revenue_eur, 0)
  return [...top, { key: '__other__', label: OTHER_COUNTRY_LABEL, revenue_eur: restSum }]
}

export function MiniBarBreakdown({ items, color }: { items: MiniBarItem[]; color: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-[#5F6B72]">Zatím žádná data.</p>
  }
  const max = Math.max(1, ...items.map((i) => i.revenue_eur))

  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.key} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-2 text-sm">
          <span className="truncate text-[#1C2B33]">{item.label}</span>
          <div className="h-2.5 rounded bg-beige-300">
            <div
              className="h-2.5 rounded"
              style={{ width: `${Math.max(2, (item.revenue_eur / max) * 100)}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-xs whitespace-nowrap text-[#5F6B72]">{formatMoney(item.revenue_eur)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── „Trend 24 měsíců" — SVG sloupcový graf obratu ─────────────────────

export interface TrendPoint {
  month: string
  revenue_eur: number
  room_nights: number
}

export function TrendChart({ points }: { points: TrendPoint[] }) {
  if (points.length === 0) {
    return <p className="text-sm text-[#5F6B72]">Zatím žádná data trendu.</p>
  }

  const width = 960
  const height = 180
  const bottomAxis = 22
  const plotHeight = height - bottomAxis
  const gap = 4
  const barWidth = width / points.length - gap
  const max = Math.max(1, ...points.map((p) => p.revenue_eur))

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Trend obratu za posledních 24 měsíců"
        className="h-[180px] w-full"
      >
        {points.map((p, i) => {
          const barHeight = Math.max(1, (p.revenue_eur / max) * (plotHeight - 8))
          const x = i * (barWidth + gap)
          const y = plotHeight - barHeight
          const [monthPart] = p.month.split('-').slice(1)
          const showLabel = monthPart === '01' || i % 6 === 0
          return (
            <g key={p.month}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill="#0E6EA8" rx={1.5}>
                <title>
                  {`${formatPeriodLabel(p.month)}: obrat ${formatMoney(p.revenue_eur)} · ${formatNights(p.room_nights)} nocí`}
                </title>
              </rect>
              {showLabel && (
                <text
                  x={x + barWidth / 2}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#5F6B72"
                >
                  {formatShortMonthLabel(p.month)}
                </text>
              )}
            </g>
          )
        })}
        <line x1={0} y1={plotHeight} x2={width} y2={plotHeight} stroke="#E4D9C4" strokeWidth={1} />
      </svg>

      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-semibold text-[#0E6EA8]">
          Zobrazit jako tabulku
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
                <th className="py-1.5 pr-3 font-medium">Měsíc</th>
                <th className="py-1.5 pr-3 font-medium">Obrat</th>
                <th className="py-1.5 pr-3 font-medium">Room nights</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.month} className="border-b border-beige-300">
                  <td className="py-1.5 pr-3 text-[#1C2B33]">{formatPeriodLabel(p.month)}</td>
                  <td className="py-1.5 pr-3 whitespace-nowrap text-[#1C2B33]">{formatMoney(p.revenue_eur)}</td>
                  <td className="py-1.5 pr-3 text-[#1C2B33]">{formatNights(p.room_nights)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

// ─── Názvy hotelů (fallback z humanizovaného slugu) ────────────────────

const HOTEL_LABELS: Record<string, string> = {
  'nove-lazne': 'Nové Lázně',
  'centralni-lazne': 'Centrální Lázně',
  hvezda: 'Hvězda',
  pacifik: 'Pacifik',
  butterfly: 'Butterfly',
  vltava: 'Vltava',
  svoboda: 'Svoboda',
}

export function hotelLabel(slug: string): string {
  if (HOTEL_LABELS[slug]) return HOTEL_LABELS[slug]
  return slug
    .split('-')
    .map((part) => (part.length > 0 ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ')
}
