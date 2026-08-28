import { useEffect, useMemo, useState } from 'react'
import { portalFetch } from './api'
import PartnerForm from './PartnerForm'
import {
  SEGMENT_COLORS,
  SEGMENT_LABELS,
  SEGMENTS,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  STATUSES,
  TIERS,
} from './PartnerForm'
import type { PartnerStatus, Segment, Tier } from './PartnerForm'

interface OwnerRef {
  id: string
  display_name: string
}

interface PrimaryContactRef {
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
}

interface PartnerRow {
  id: string
  name: string
  ico: string | null
  country: string
  city: string | null
  website: string | null
  segment: Segment
  tier: Tier | null
  status: PartnerStatus
  owner: OwnerRef | null
  primary_contact: PrimaryContactRef | null
  contacts_count: number
  updated_at: string
}

interface PartnersResponse {
  partners: PartnerRow[]
  page: number
  pageSize: number
  total: number
}

type SortField = 'name' | 'updated_at'
type SortDir = 'asc' | 'desc'

interface PartnersListProps {
  /** false pro roli analyst — skryje tlačítka pro zápis */
  canWrite: boolean
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'medium' }).format(new Date(value))
}

function segmentChipStyle(segment: Segment): { backgroundColor: string; color: string } {
  const color = SEGMENT_COLORS[segment]
  return { backgroundColor: `${color}1F`, color }
}

function contactLabel(contact: PrimaryContactRef | null): string {
  if (!contact) return '—'
  const name = [contact.first_name, contact.last_name].filter(Boolean).join(' ')
  return name || contact.email || contact.phone || '—'
}

export default function PartnersList({ canWrite }: PartnersListProps) {
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [segment, setSegment] = useState<Segment | ''>('')
  const [status, setStatus] = useState<PartnerStatus | ''>('')
  const [tier, setTier] = useState<Tier | ''>('')
  const [country, setCountry] = useState('')

  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortField>('name')
  const [dir, setDir] = useState<SortDir>('asc')

  const [data, setData] = useState<PartnersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)

  // Debounce fulltextu (300 ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300)
    return () => clearTimeout(t)
  }, [q])

  // Reset stránky při změně filtrů
  useEffect(() => {
    setPage(1)
  }, [debouncedQ, segment, status, tier, country])

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (debouncedQ) params.set('q', debouncedQ)
    if (segment) params.set('segment', segment)
    if (status) params.set('status', status)
    if (tier) params.set('tier', tier)
    if (country) params.set('country', country)
    params.set('page', String(page))
    params.set('sort', sort)
    params.set('dir', dir)
    return params.toString()
  }, [debouncedQ, segment, status, tier, country, page, sort, dir])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    portalFetch<PartnersResponse>(`/api/portal/partners?${queryString}`, { method: 'GET' }).then((res) => {
      if (cancelled) return
      if (!res.ok) {
        setError('Seznam partnerů se nepodařilo načíst.')
      } else {
        setData(res.data)
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [queryString])

  function toggleSort(field: SortField) {
    if (sort === field) {
      setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(field)
      setDir('asc')
    }
  }

  function sortIndicator(field: SortField): string {
    if (sort !== field) return ''
    return dir === 'asc' ? ' ▲' : ' ▼'
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  return (
    <div className="space-y-6">
      <div className="portal-card flex flex-wrap items-end gap-3 p-5">
        <div className="min-w-[220px] flex-1">
          <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]" htmlFor="pl_q">Hledat</label>
          <input
            id="pl_q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            placeholder="Název, IČO, kontakt…"
            className="w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]" htmlFor="pl_segment">Segment</label>
          <select
            id="pl_segment"
            value={segment}
            onChange={(e) => setSegment(e.currentTarget.value as Segment | '')}
            className="rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
          >
            <option value="">Všechny</option>
            {SEGMENTS.map((s) => (
              <option key={s} value={s}>{SEGMENT_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]" htmlFor="pl_status">Stav</label>
          <select
            id="pl_status"
            value={status}
            onChange={(e) => setStatus(e.currentTarget.value as PartnerStatus | '')}
            className="rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
          >
            <option value="">Všechny</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]" htmlFor="pl_tier">Tier</label>
          <select
            id="pl_tier"
            value={tier}
            onChange={(e) => setTier(e.currentTarget.value as Tier | '')}
            className="rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
          >
            <option value="">Všechny</option>
            {TIERS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[140px]">
          <label className="mb-1.5 block text-sm font-medium text-[#1C2B33]" htmlFor="pl_country">Země</label>
          <input
            id="pl_country"
            value={country}
            onChange={(e) => setCountry(e.currentTarget.value)}
            placeholder="CZ, DE…"
            className="w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
          />
        </div>
        {canWrite && (
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="ml-auto rounded-full bg-[#E8A400] px-5 py-2.5 font-semibold text-[#1C2B33] transition-opacity hover:opacity-90"
          >
            {showForm ? 'Zavřít formulář' : 'Nový partner'}
          </button>
        )}
      </div>

      {canWrite && showForm && (
        <PartnerForm
          onCancel={() => setShowForm(false)}
          onCreated={(id) => {
            window.location.href = `/portal/partners/${id}`
          }}
        />
      )}

      <div className="portal-card overflow-x-auto p-6">
        {error && <p className="text-sm text-[#B3264F]">{error}</p>}
        {!error && loading && <p className="text-sm text-[#5F6B72]">Načítám…</p>}
        {!error && !loading && data && data.partners.length === 0 && (
          <p className="text-sm text-[#5F6B72]">
            Zatím žádní partneři — začněte prvním importem nebo je založte ručně.
          </p>
        )}
        {!error && !loading && data && data.partners.length > 0 && (
          <>
            <table className="w-full min-w-[960px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
                  <th className="py-2 pr-3 font-medium">
                    <button type="button" onClick={() => toggleSort('name')} className="hover:text-[#004F71]">
                      Název{sortIndicator('name')}
                    </button>
                  </th>
                  <th className="py-2 pr-3 font-medium">Segment</th>
                  <th className="py-2 pr-3 font-medium">Tier</th>
                  <th className="py-2 pr-3 font-medium">Stav</th>
                  <th className="py-2 pr-3 font-medium">Země / Město</th>
                  <th className="py-2 pr-3 font-medium">Vlastník vztahu</th>
                  <th className="py-2 pr-3 font-medium">Hlavní kontakt</th>
                  <th className="py-2 pr-3 font-medium">
                    <button type="button" onClick={() => toggleSort('updated_at')} className="hover:text-[#004F71]">
                      Poslední změna{sortIndicator('updated_at')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.partners.map((partner) => (
                  <tr key={partner.id} className="border-b border-beige-300 align-top">
                    <td className="py-2.5 pr-3">
                      <a href={`/portal/partners/${partner.id}`} className="font-semibold text-[#004F71] hover:underline">
                        {partner.name}
                      </a>
                      {partner.ico && <div className="text-xs text-[#5F6B72]">{partner.ico}</div>}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="portal-badge" style={segmentChipStyle(partner.segment)}>
                        {SEGMENT_LABELS[partner.segment]}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{partner.tier ?? '—'}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`portal-badge ${STATUS_BADGE_CLASS[partner.status]}`}>
                        {STATUS_LABELS[partner.status]}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">
                      {partner.country}
                      {partner.city ? ` / ${partner.city}` : ''}
                    </td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{partner.owner?.display_name ?? '—'}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{contactLabel(partner.primary_contact)}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-[#5F6B72]">{formatDate(partner.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-[#5F6B72]">
                Strana {data.page} z {totalPages} · celkem {data.total} partnerů
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-full border border-[#0E6EA8]/40 px-3 py-1.5 text-xs font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10 disabled:opacity-40"
                >
                  Předchozí
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border border-[#0E6EA8]/40 px-3 py-1.5 text-xs font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10 disabled:opacity-40"
                >
                  Další
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
