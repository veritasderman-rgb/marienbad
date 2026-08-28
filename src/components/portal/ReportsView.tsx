import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { portalFetch } from './api'
import { SEGMENT_COLORS, SEGMENT_LABELS } from './PartnerForm'
import type { Segment, Tier } from './PartnerForm'

interface ReportRow {
  partner_id: string
  partner_name: string
  segment: Segment
  tier: Tier | null
  country: string
  revenue_eur: number | null
  revenue_prev_month: number | null
  mom_pct: number | null
  revenue_same_month_last_year: number | null
  yoy_pct: number | null
  revenue_r12: number | null
  revenue_r12_prev: number | null
  r12_pct: number | null
  room_nights: number | null
}

interface ReportsResponse {
  period: string
  periods: string[]
  rows: ReportRow[]
}

type SortField = 'revenue_eur' | 'mom_pct' | 'yoy_pct'
type SortDir = 'asc' | 'desc'

const moneyFormatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const nightsFormatter = new Intl.NumberFormat('cs-CZ')

function formatMoney(value: number | null): string {
  if (value === null) return '—'
  return moneyFormatter.format(value)
}

function formatPeriodLabel(period: string): string {
  const date = new Date(`${period}-01T00:00:00`)
  if (Number.isNaN(date.getTime())) return period
  return new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(date)
}

function segmentChipStyle(segment: Segment): { backgroundColor: string; color: string } {
  const color = SEGMENT_COLORS[segment]
  return { backgroundColor: `${color}1F`, color }
}

function PctCell({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-[#5F6B72]">—</span>
  }
  const positive = value >= 0
  return (
    <span className={'font-semibold ' + (positive ? 'text-[#1E7A4F]' : 'text-[#B3264F]')}>
      {positive ? '▲' : '▼'} {Math.abs(value).toFixed(1)} %
    </span>
  )
}

export default function ReportsView() {
  const [period, setPeriod] = useState('')
  const [periods, setPeriods] = useState<string[]>([])
  const [rows, setRows] = useState<ReportRow[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  async function loadReports(explicitPeriod?: string) {
    setLoading(true)
    setError(null)
    const qs = explicitPeriod ? `?period=${encodeURIComponent(explicitPeriod)}` : ''
    try {
      const res = await portalFetch<ReportsResponse>(`/api/portal/reports${qs}`, { method: 'GET' })
      if (!res.ok) {
        setError('Reporty se nepodařilo načíst.')
        setLoading(false)
        return
      }
      setPeriods(res.data.periods ?? [])
      setPeriod(res.data.period ?? '')
      setRows(res.data.rows ?? [])
    } catch {
      setError('Spojení se serverem selhalo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handlePeriodChange(e: ChangeEvent<HTMLSelectElement>) {
    const p = e.currentTarget.value
    loadReports(p)
  }

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  function sortIndicator(field: SortField): string {
    if (sortField !== field) return ''
    return sortDir === 'asc' ? ' ▲' : ' ▼'
  }

  const sortedRows = useMemo(() => {
    if (!rows) return null
    if (!sortField) return rows
    const withValue = rows.filter((r) => r[sortField] !== null)
    const withoutValue = rows.filter((r) => r[sortField] === null)
    withValue.sort((a, b) => {
      const av = a[sortField] as number
      const bv = b[sortField] as number
      return sortDir === 'asc' ? av - bv : bv - av
    })
    return [...withValue, ...withoutValue]
  }, [rows, sortField, sortDir])

  return (
    <div className="space-y-6">
      <div className="portal-card flex flex-wrap items-end justify-between gap-3 p-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]" htmlFor="rv_period">Období</label>
          <select
            id="rv_period"
            value={period}
            onChange={handlePeriodChange}
            disabled={periods.length === 0}
            className="rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
          >
            {periods.length === 0 && <option value="">—</option>}
            {periods.map((p) => (
              <option key={p} value={p}>{formatPeriodLabel(p)}</option>
            ))}
          </select>
        </div>
        <a
          href={period ? `/api/portal/reports/export?period=${encodeURIComponent(period)}` : undefined}
          aria-disabled={!period}
          className={
            'rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity ' +
            (period
              ? 'bg-[#E8A400] text-[#1C2B33] hover:opacity-90'
              : 'pointer-events-none bg-beige-300 text-[#5F6B72]')
          }
        >
          Export CSV
        </a>
      </div>

      <div className="portal-card overflow-x-auto p-6">
        {error && <p className="text-sm font-medium text-[#B3264F]">{error}</p>}
        {!error && loading && <p className="text-sm text-[#5F6B72]">Načítám…</p>}
        {!error && !loading && sortedRows !== null && sortedRows.length === 0 && (
          <p className="text-sm text-[#5F6B72]">
            Zatím žádná data výkonnosti — nahrajte Excel v Importu, nebo počkejte na napojení PMS (fáze 9).
          </p>
        )}
        {!error && !loading && sortedRows !== null && sortedRows.length > 0 && (
          <>
            <table className="w-full min-w-[980px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
                  <th className="py-2 pr-3 font-medium">Partner</th>
                  <th className="py-2 pr-3 font-medium">Segment</th>
                  <th className="py-2 pr-3 font-medium">Tier</th>
                  <th className="py-2 pr-3 font-medium">
                    <button type="button" onClick={() => toggleSort('revenue_eur')} className="hover:text-[#004F71]">
                      Obrat{sortIndicator('revenue_eur')}
                    </button>
                  </th>
                  <th className="py-2 pr-3 font-medium">
                    <button type="button" onClick={() => toggleSort('mom_pct')} className="hover:text-[#004F71]">
                      MoM %{sortIndicator('mom_pct')}
                    </button>
                  </th>
                  <th className="py-2 pr-3 font-medium">
                    <button type="button" onClick={() => toggleSort('yoy_pct')} className="hover:text-[#004F71]">
                      YoY %{sortIndicator('yoy_pct')}
                    </button>
                  </th>
                  <th className="py-2 pr-3 font-medium">R12</th>
                  <th className="py-2 pr-3 font-medium">R12 %</th>
                  <th className="py-2 pr-3 font-medium">Noci</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => (
                  <tr key={row.partner_id} className="border-b border-beige-300 align-top">
                    <td className="py-2.5 pr-3">
                      <a href={`/portal/partners/${row.partner_id}`} className="font-semibold text-[#004F71] hover:underline">
                        {row.partner_name}
                      </a>
                      <div className="text-xs text-[#5F6B72]">{row.country}</div>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="portal-badge" style={segmentChipStyle(row.segment)}>
                        {SEGMENT_LABELS[row.segment]}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{row.tier ?? '—'}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap font-semibold text-[#1C2B33]">
                      {formatMoney(row.revenue_eur)}
                    </td>
                    <td className="py-2.5 pr-3 whitespace-nowrap"><PctCell value={row.mom_pct} /></td>
                    <td className="py-2.5 pr-3 whitespace-nowrap"><PctCell value={row.yoy_pct} /></td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-[#1C2B33]">{formatMoney(row.revenue_r12)}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap"><PctCell value={row.r12_pct} /></td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">
                      {row.room_nights === null ? '—' : nightsFormatter.format(row.room_nights)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-4 text-xs text-[#5F6B72]">
              MoM = proti minulému měsíci · YoY = proti stejnému měsíci loni · R12 = klouzavých 12 měsíců proti
              předchozím 12
            </p>
          </>
        )}
      </div>
    </div>
  )
}
