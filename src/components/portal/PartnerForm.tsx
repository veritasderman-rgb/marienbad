import { useState } from 'react'
import type { FormEvent } from 'react'
import { portalFetch } from './api'

export type Segment = 'travel_agency' | 'tour_operator' | 'corporate' | 'insurer' | 'other'
export type Tier = 'A' | 'B' | 'C'
export type PartnerStatus = 'active' | 'prospect' | 'inactive'

export const SEGMENT_LABELS: Record<Segment, string> = {
  travel_agency: 'CK / cestovní kancelář',
  tour_operator: 'Touroperátor',
  corporate: 'Korporát',
  insurer: 'Pojišťovna',
  other: 'Ostatní',
}

export const SEGMENT_COLORS: Record<Segment, string> = {
  travel_agency: '#0E6EA8',
  tour_operator: '#9C1D5F',
  corporate: '#C05F2E',
  insurer: '#E8A400',
  other: '#8C949B',
}

export const STATUS_LABELS: Record<PartnerStatus, string> = {
  active: 'Aktivní',
  prospect: 'Prospekt',
  inactive: 'Neaktivní',
}

export const STATUS_BADGE_CLASS: Record<PartnerStatus, string> = {
  active: 'portal-badge-active',
  prospect: 'portal-badge-pending',
  inactive: 'portal-badge-inactive',
}

export const TIERS: Tier[] = ['A', 'B', 'C']
export const SEGMENTS: Segment[] = ['travel_agency', 'tour_operator', 'corporate', 'insurer', 'other']
export const STATUSES: PartnerStatus[] = ['active', 'prospect', 'inactive']

interface NewPartnerPayload {
  name: string
  legal_name?: string
  ico?: string
  dic?: string
  country: string
  city?: string
  website?: string
  segment: Segment
  tier?: Tier
  status: PartnerStatus
  languages?: string
  notes?: string
}

interface PartnerFormProps {
  onCancel: () => void
  onCreated: (id: string) => void
}

const inputClass =
  'w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]'
const labelClass = 'block text-sm font-medium text-[#1C2B33] mb-1.5'

export default function PartnerForm({ onCancel, onCreated }: PartnerFormProps) {
  const [name, setName] = useState('')
  const [legalName, setLegalName] = useState('')
  const [ico, setIco] = useState('')
  const [dic, setDic] = useState('')
  const [country, setCountry] = useState('CZ')
  const [city, setCity] = useState('')
  const [website, setWebsite] = useState('')
  const [segment, setSegment] = useState<Segment>('travel_agency')
  const [tier, setTier] = useState<Tier>('B')
  const [status, setStatus] = useState<PartnerStatus>('prospect')
  const [notes, setNotes] = useState('')

  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const payload: NewPartnerPayload = {
        name: name.trim(),
        country: country.trim(),
        segment,
        tier,
        status,
        ...(legalName.trim() ? { legal_name: legalName.trim() } : {}),
        ...(ico.trim() ? { ico: ico.trim() } : {}),
        ...(dic.trim() ? { dic: dic.trim() } : {}),
        ...(city.trim() ? { city: city.trim() } : {}),
        ...(website.trim() ? { website: website.trim() } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      }
      const res = await portalFetch<{ ok: boolean; id: string }>('/api/portal/partners', {
        method: 'POST',
        body: payload,
      })
      if (!res.ok) {
        if (res.status === 409 && (res.data as any)?.error === 'ico_exists') {
          setError('Partner s tímto IČO už existuje.')
        } else {
          setError((res.data as any)?.message || 'Partnera se nepodařilo založit.')
        }
        return
      }
      onCreated(res.data.id)
    } catch {
      setError('Spojení se serverem selhalo.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="portal-card p-6">
      <h2 className="mb-4 font-heading text-lg font-semibold text-[#004F71]">Nový partner</h2>
      {error && (
        <div role="alert" className="mb-3 rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="pf_name">Název *</label>
          <input id="pf_name" required value={name} onChange={(e) => setName(e.currentTarget.value)} className={inputClass} placeholder="např. CK Alfa a.s." />
        </div>
        <div>
          <label className={labelClass} htmlFor="pf_legal_name">Obchodní jméno</label>
          <input id="pf_legal_name" value={legalName} onChange={(e) => setLegalName(e.currentTarget.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="pf_ico">IČO</label>
          <input id="pf_ico" value={ico} onChange={(e) => setIco(e.currentTarget.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="pf_dic">DIČ</label>
          <input id="pf_dic" value={dic} onChange={(e) => setDic(e.currentTarget.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="pf_country">Země *</label>
          <input id="pf_country" required value={country} onChange={(e) => setCountry(e.currentTarget.value)} className={inputClass} placeholder="CZ" />
        </div>
        <div>
          <label className={labelClass} htmlFor="pf_city">Město</label>
          <input id="pf_city" value={city} onChange={(e) => setCity(e.currentTarget.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="pf_website">Web</label>
          <input id="pf_website" value={website} onChange={(e) => setWebsite(e.currentTarget.value)} className={inputClass} placeholder="https://…" />
        </div>
        <div>
          <label className={labelClass} htmlFor="pf_segment">Segment *</label>
          <select id="pf_segment" value={segment} onChange={(e) => setSegment(e.currentTarget.value as Segment)} className={inputClass}>
            {SEGMENTS.map((s) => (
              <option key={s} value={s}>{SEGMENT_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="pf_tier">Tier</label>
          <select id="pf_tier" value={tier} onChange={(e) => setTier(e.currentTarget.value as Tier)} className={inputClass}>
            {TIERS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="pf_status">Stav *</label>
          <select id="pf_status" value={status} onChange={(e) => setStatus(e.currentTarget.value as PartnerStatus)} className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="pf_notes">Poznámka</label>
          <textarea id="pf_notes" value={notes} onChange={(e) => setNotes(e.currentTarget.value)} className={inputClass} rows={3} />
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[#E8A400] px-5 py-2.5 font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? 'Ukládám…' : 'Vytvořit partnera'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="rounded-full border border-beige-400 px-5 py-2.5 font-semibold text-[#5F6B72] hover:bg-beige-200 disabled:opacity-60"
          >
            Zrušit
          </button>
        </div>
      </form>
    </div>
  )
}
