import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { portalFetch } from './api'
import {
  DeltaBadge,
  MiniBarBreakdown,
  MoversChart,
  SegmentStackedBar,
  TopPartnersChart,
  TrendChart,
  formatMoney,
  formatPct,
  formatPeriodLabel,
  hotelLabel,
  numberFormatter,
  topNWithOther,
} from './DashboardCharts'
import type { Mover, SegmentShare, TrendPoint } from './DashboardCharts'

interface DashboardKpi {
  revenue_eur: number
  mom_pct: number | null
  yoy_pct: number | null
  revenue_r12: number
  r12_pct: number | null
  room_nights: number
  room_nights_yoy_pct: number | null
  partners_with_data: number
  top5_concentration_pct: number | null
}

interface NewsletterOverlapBucket {
  partners: number
  revenue_eur: number
}

interface DashboardResponse {
  empty?: boolean
  period: string
  periods: string[]
  kpi?: DashboardKpi
  trend?: TrendPoint[]
  breakdown_segment?: SegmentShare[]
  breakdown_country?: { country: string; revenue_eur: number; share_pct: number }[]
  breakdown_tier?: { tier: string; revenue_eur: number; share_pct: number }[]
  breakdown_hotel?: { hotel_slug: string; revenue_eur: number; share_pct: number }[]
  movers?: { up: Mover[]; down: Mover[] }
  newsletter_overlap?: {
    in_lists: NewsletterOverlapBucket
    not_in_lists: NewsletterOverlapBucket
  }
}

const TOP_PARTNERS_LIMIT = 10
const TOP_COUNTRIES_LIMIT = 8

function KpiTile({
  label,
  value,
  valueColor,
  children,
}: {
  label: string
  value: string
  valueColor?: string
  children?: ReactNode
}) {
  return (
    <div className="portal-card flex flex-col gap-1.5 p-5">
      <span className="portal-label">{label}</span>
      <span className="font-heading text-2xl font-bold" style={{ color: valueColor ?? '#004F71' }}>
        {value}
      </span>
      {children && <span className="text-xs">{children}</span>}
    </div>
  )
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="portal-card p-6">
      <h2 className="font-heading text-lg font-semibold text-[#004F71]">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-[#5F6B72]">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

function concentrationColor(pct: number | null | undefined): string {
  if (pct === null || pct === undefined) return '#004F71'
  if (pct >= 50) return '#B3264F'
  if (pct >= 35) return '#E8A400'
  return '#004F71'
}

export default function DashboardView() {
  const [period, setPeriod] = useState('')
  const [periods, setPeriods] = useState<string[]>([])
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadDashboard(explicitPeriod?: string) {
    setLoading(true)
    setError(null)
    const qs = explicitPeriod ? `?period=${encodeURIComponent(explicitPeriod)}` : ''
    try {
      const res = await portalFetch<DashboardResponse>(`/api/portal/dashboard${qs}`, { method: 'GET' })
      if (!res.ok) {
        setError('Dashboard se nepodařilo načíst.')
        setLoading(false)
        return
      }
      setData(res.data)
      setPeriods(res.data.periods ?? [])
      setPeriod(res.data.period ?? '')
    } catch {
      setError('Spojení se serverem selhalo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handlePeriodChange(e: ChangeEvent<HTMLSelectElement>) {
    loadDashboard(e.currentTarget.value)
  }

  const topPartners = useMemo(() => {
    if (!data?.movers) return []
    const combined = [...data.movers.up, ...data.movers.down]
    return [...combined].sort((a, b) => b.ytd_eur - a.ytd_eur).slice(0, TOP_PARTNERS_LIMIT)
  }, [data])

  const countryItems = useMemo(() => {
    if (!data?.breakdown_country) return []
    return topNWithOther(
      data.breakdown_country.map((c) => ({ key: c.country, label: c.country, revenue_eur: c.revenue_eur })),
      TOP_COUNTRIES_LIMIT,
    )
  }, [data])

  const hotelItems = useMemo(() => {
    if (!data?.breakdown_hotel) return []
    return [...data.breakdown_hotel]
      .sort((a, b) => b.revenue_eur - a.revenue_eur)
      .map((h) => ({ key: h.hotel_slug, label: hotelLabel(h.hotel_slug), revenue_eur: h.revenue_eur }))
  }, [data])

  const isEmpty = !loading && !error && (data?.empty === true || periods.length === 0)

  return (
    <div className="space-y-6">
      <div className="portal-card flex flex-wrap items-end justify-between gap-3 p-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]" htmlFor="dv_period">
            Období
          </label>
          <select
            id="dv_period"
            value={period}
            onChange={handlePeriodChange}
            disabled={periods.length === 0}
            className="rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
          >
            {periods.length === 0 && <option value="">—</option>}
            {periods.map((p) => (
              <option key={p} value={p}>
                {formatPeriodLabel(p)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="portal-card p-6">
          <p className="text-sm font-medium text-[#B3264F]">{error}</p>
        </div>
      )}

      {!error && loading && (
        <div className="portal-card p-6">
          <p className="text-sm text-[#5F6B72]">Načítám…</p>
        </div>
      )}

      {isEmpty && (
        <div className="portal-card flex flex-col items-start gap-3 p-8">
          <h2 className="font-heading text-lg font-semibold text-[#004F71]">Zatím žádná data výkonnosti</h2>
          <p className="max-w-xl text-sm text-[#5F6B72]">
            Dashboard se naplní, jakmile se nahraje první měsíc výkonnosti — buď ručně přes Excel import, nebo po
            napojení statistického dashboardu LLML (fáze 9).
          </p>
          <a
            href="/portal/import"
            className="rounded-full bg-[#E8A400] px-5 py-2.5 text-sm font-semibold text-[#1C2B33] transition-opacity hover:opacity-90"
          >
            Přejít na import
          </a>
        </div>
      )}

      {!error && !loading && !isEmpty && data?.kpi && (
        <>
          {/* 2. KPI dlaždice */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <KpiTile label={`Obrat · ${formatPeriodLabel(period)}`} value={formatMoney(data.kpi.revenue_eur)}>
              <span className="flex flex-wrap gap-x-3 gap-y-0.5">
                <DeltaBadge value={data.kpi.mom_pct} label="MoM" />
                <DeltaBadge value={data.kpi.yoy_pct} label="YoY" />
              </span>
            </KpiTile>
            <KpiTile label="Obrat R12" value={formatMoney(data.kpi.revenue_r12)}>
              <DeltaBadge value={data.kpi.r12_pct} label="R12" />
            </KpiTile>
            <KpiTile label="Room nights" value={numberFormatter.format(data.kpi.room_nights)}>
              <DeltaBadge value={data.kpi.room_nights_yoy_pct} label="YoY" />
            </KpiTile>
            <KpiTile label="Partneři s výkonem" value={numberFormatter.format(data.kpi.partners_with_data)}>
              <span className="text-[#5F6B72]">v tomto období</span>
            </KpiTile>
            <KpiTile
              label="Koncentrace TOP 5"
              value={formatPct(data.kpi.top5_concentration_pct)}
              valueColor={concentrationColor(data.kpi.top5_concentration_pct)}
            >
              <span className="text-[#5F6B72]">podíl obratu 5 největších partnerů</span>
            </KpiTile>
          </div>

          {/* 3. Pohyby + TOP partneři */}
          <div className="grid grid-cols-1 gap-6 min-[1100px]:grid-cols-2">
            <SectionCard title="Největší pohyby meziročně">
              <MoversChart up={data.movers?.up ?? []} down={data.movers?.down ?? []} />
            </SectionCard>
            <SectionCard title="TOP partneři">
              <TopPartnersChart partners={topPartners} />
            </SectionCard>
          </div>

          {/* 4. Struktura tržeb */}
          <SectionCard title="Struktura tržeb podle segmentu">
            <SegmentStackedBar items={data.breakdown_segment ?? []} />
            <div className="mt-6 grid grid-cols-1 gap-6 min-[1100px]:grid-cols-2">
              <div>
                <h3 className="portal-label mb-2">Podle země</h3>
                <MiniBarBreakdown items={countryItems} color="#0E6EA8" />
              </div>
              <div>
                <h3 className="portal-label mb-2">Podle hotelu</h3>
                <MiniBarBreakdown items={hotelItems} color="#4FB3D9" />
              </div>
            </div>
          </SectionCard>

          {/* 5. Trend */}
          <SectionCard title="Trend 24 měsíců" subtitle="Obrat po měsících">
            <TrendChart points={data.trend ?? []} />
          </SectionCard>

          {/* 6. Newsletter × výkonnost */}
          <SectionCard title="Newsletter × výkonnost">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-beige-400 p-4">
                <span className="portal-label">Partneři v rozesílkách</span>
                <div className="mt-2 font-heading text-xl font-bold text-[#004F71]">
                  {numberFormatter.format(data.newsletter_overlap?.in_lists.partners ?? 0)} partnerů
                </div>
                <div className="text-sm text-[#5F6B72]">
                  {formatMoney(data.newsletter_overlap?.in_lists.revenue_eur ?? 0)} obratu
                </div>
              </div>
              <div className="rounded-lg border border-beige-400 p-4">
                <span className="portal-label">Mimo rozesílky</span>
                <div className="mt-2 font-heading text-xl font-bold text-[#004F71]">
                  {numberFormatter.format(data.newsletter_overlap?.not_in_lists.partners ?? 0)} partnerů
                </div>
                <div className="text-sm text-[#5F6B72]">
                  {formatMoney(data.newsletter_overlap?.not_in_lists.revenue_eur ?? 0)} obratu
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#5F6B72]">Souvislost, ne důkaz vlivu newsletteru.</p>
          </SectionCard>
        </>
      )}
    </div>
  )
}
