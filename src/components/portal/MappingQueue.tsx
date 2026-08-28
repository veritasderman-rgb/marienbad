import { useEffect, useRef, useState } from 'react'
import { portalFetch } from './api'

/**
 * Fronta mapování plátců z PMS (NAVRH 6.2, mockup „Fronta mapování plátců" —
 * IMPLEMENTACNI_PLAN sekce 10).
 *
 * PMS zná plátce jménem, CRM eviduje partnera podle IČO — automatické párování
 * podle názvu se nedělá, protože špatně přiřazený plátce by tiše připsal cizí
 * obrat cizí firmě. Dokud řádek nepotvrdí člověk, jeho obrat se nikam
 * nezapočítává; po potvrzení se čekající dávky PMS přehrají zpětně.
 */

type Kind = 'partner' | 'aggregate' | 'direct' | 'insurer_internal' | 'natural_person' | 'ignore'

interface Candidate {
  id: string
  name: string
  ico: string | null
  similarity: number
}

interface PendingItem {
  id: string
  payer_name_raw: string
  payer_name_norm: string
  created_at: string
  candidates: Candidate[]
}

interface ConfirmedItem {
  id: string
  payer_name_raw: string
  kind: Kind
  confirmed_at: string
  partner_name: string | null
  confirmed_by_name: string | null
}

interface MappingResponse {
  pending: PendingItem[]
  confirmed: ConfirmedItem[]
  waiting_batches: number
}

interface ReprocessedSummary {
  batches: number
  matched: number
  still_unmatched: number
}

interface ConfirmResponse {
  ok: boolean
  reprocessed: ReprocessedSummary
}

interface PartnerHit {
  id: string
  name: string
  ico: string | null
}

interface PartnersSearchResponse {
  partners: PartnerHit[]
}

interface MappingQueueProps {
  /** false pro roli analyst — vidí frontu, ale nemůže potvrzovat. */
  canWrite: boolean
}

const KIND_OPTIONS: { value: Kind; label: string }[] = [
  { value: 'partner', label: 'Partner' },
  { value: 'aggregate', label: 'Součtový řádek PMS' },
  { value: 'direct', label: 'Přímí klienti' },
  { value: 'insurer_internal', label: 'Interní pojišťovna' },
  { value: 'natural_person', label: 'Fyzická osoba — nepatří automaticky do CRM' },
  { value: 'ignore', label: 'Ignorovat' },
]

const KIND_LABELS: Record<Kind, string> = {
  partner: 'Partner',
  aggregate: 'Součtový řádek PMS',
  direct: 'Přímí klienti',
  insurer_internal: 'Interní pojišťovna',
  natural_person: 'Fyzická osoba',
  ignore: 'Ignorováno',
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'medium' }).format(new Date(value))
}

function formatSimilarity(value: number): string {
  return `${Math.round(value * 100)} %`
}

function confirmErrorText(status: number, error: unknown): string {
  const code = typeof error === 'string' ? error : ''
  if (status === 404) return 'Vybraný partner nebyl mezitím nalezen.'
  if (status === 409) return 'Tento plátce už mezitím potvrdil někdo jiný.'
  if (code === 'partner_required') return 'Pro druh „Partner" vyberte konkrétního partnera.'
  if (code === 'invalid_kind') return 'Vyberte druh plátce.'
  return 'Potvrzení se nepodařilo uložit.'
}

interface PendingCardProps {
  item: PendingItem
  canWrite: boolean
  onConfirmed: (id: string) => void
}

function PendingCard({ item, canWrite, onConfirmed }: PendingCardProps) {
  const [kind, setKind] = useState<Kind | ''>('')
  const [partnerChoice, setPartnerChoice] = useState<string>('') // candidate.id, nebo 'search'
  const [manualPartner, setManualPartner] = useState<PartnerHit | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<PartnerHit[]>([])
  const [searching, setSearching] = useState(false)

  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<ReprocessedSummary | null>(null)

  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (removeTimer.current) clearTimeout(removeTimer.current)
    }
  }, [])

  useEffect(() => {
    if (partnerChoice !== 'search' || searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }
    let cancelled = false
    setSearching(true)
    const handle = setTimeout(async () => {
      const res = await portalFetch<PartnersSearchResponse>(
        `/api/portal/partners?q=${encodeURIComponent(searchQuery.trim())}`,
        { method: 'GET' },
      )
      if (cancelled) return
      setSearchResults(res.ok ? res.data.partners : [])
      setSearching(false)
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(handle)
    }
  }, [partnerChoice, searchQuery])

  const selectedPartner: PartnerHit | null =
    partnerChoice === 'search'
      ? manualPartner
      : (item.candidates.find((c) => c.id === partnerChoice) ?? null)

  const canConfirm =
    canWrite &&
    !confirming &&
    !summary &&
    kind !== '' &&
    (kind !== 'partner' || selectedPartner !== null)

  async function confirm() {
    if (!kind) return
    if (!canWrite || confirming || summary) return
    if (kind === 'partner' && !selectedPartner) return
    setConfirming(true)
    setError(null)
    const res = await portalFetch<ConfirmResponse>('/api/portal/partners/mapping', {
      method: 'POST',
      body: {
        id: item.id,
        kind,
        partner_id: kind === 'partner' ? selectedPartner?.id : undefined,
      },
    })
    setConfirming(false)
    if (!res.ok || !res.data?.ok) {
      const errCode = (res.data as { error?: string } | null)?.error
      setError(confirmErrorText(res.status, errCode))
      if (res.status === 409) {
        // mezitím potvrzeno jinde — z fronty stejně zmizí
        removeTimer.current = setTimeout(() => onConfirmed(item.id), 1500)
      }
      return
    }
    setSummary(res.data.reprocessed)
    removeTimer.current = setTimeout(() => onConfirmed(item.id), 2500)
  }

  return (
    <div
      className="portal-card p-5"
      style={{ borderLeft: '4px solid #E8A400', backgroundColor: 'rgba(232, 164, 0, 0.04)' }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-heading text-base font-bold text-[#1C2B33]">{item.payer_name_raw}</p>
        <span className="text-xs text-[#5F6B72]">přišlo {formatDate(item.created_at)}</span>
      </div>

      {summary ? (
        <p className="mt-3 text-sm font-medium text-[#1E7A4F]" role="status">
          Doplněno {summary.matched} {summary.matched === 1 ? 'řádek' : 'řádků'} výkonnosti;{' '}
          {summary.still_unmatched} stále čeká.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-2">
            {KIND_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-start gap-2 text-sm text-[#1C2B33]">
                <input
                  type="radio"
                  name={`kind_${item.id}`}
                  className="mt-0.5"
                  checked={kind === opt.value}
                  disabled={!canWrite}
                  onChange={() => setKind(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          {kind === 'natural_person' && (
            <p className="rounded-md bg-[#5F6B72]/10 px-3 py-2 text-xs text-[#5F6B72]">
              Jméno fyzické osoby jsou osobní údaje — do CRM jen vědomým rozhodnutím s právním titulem.
            </p>
          )}

          {kind === 'partner' && (
            <div className="space-y-3 rounded-md border border-[#E8A400]/30 bg-white p-3">
              {item.candidates.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {item.candidates.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm text-[#1C2B33]">
                      <input
                        type="radio"
                        name={`partner_${item.id}`}
                        checked={partnerChoice === c.id}
                        disabled={!canWrite}
                        onChange={() => setPartnerChoice(c.id)}
                      />
                      <span>
                        <span className="font-semibold">{c.name}</span>{' '}
                        <span className="text-[#5F6B72]">
                          ({c.ico ?? 'bez IČO'} · shoda {formatSimilarity(c.similarity)})
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <label className="flex items-center gap-2 text-sm text-[#1C2B33]">
                <input
                  type="radio"
                  name={`partner_${item.id}`}
                  checked={partnerChoice === 'search'}
                  disabled={!canWrite}
                  onChange={() => setPartnerChoice('search')}
                />
                <span>Vyhledat partnera ručně</span>
              </label>
              {partnerChoice === 'search' && (
                <div className="pl-6">
                  <input
                    type="text"
                    value={searchQuery}
                    disabled={!canWrite}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setManualPartner(null)
                    }}
                    placeholder="Název partnera…"
                    className="w-full max-w-xs rounded-md border border-[#5F6B72]/30 px-3 py-1.5 text-sm text-[#1C2B33]"
                  />
                  {searching && <p className="mt-1 text-xs text-[#5F6B72]">Hledám…</p>}
                  {!searching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                    <p className="mt-1 text-xs text-[#5F6B72]">Žádný partner neodpovídá hledání.</p>
                  )}
                  {!searching && searchResults.length > 0 && !manualPartner && (
                    <ul className="mt-1 max-w-xs divide-y divide-beige-300 rounded-md border border-[#5F6B72]/20">
                      {searchResults.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setManualPartner(p)
                              setSearchQuery(p.name)
                              setSearchResults([])
                            }}
                            className="block w-full px-3 py-1.5 text-left text-sm text-[#1C2B33] hover:bg-[#0E6EA8]/10"
                          >
                            <span className="font-semibold">{p.name}</span>{' '}
                            <span className="text-[#5F6B72]">({p.ico ?? 'bez IČO'})</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {manualPartner && (
                    <p className="mt-1 text-xs font-medium text-[#1E7A4F]">
                      Vybráno: {manualPartner.name} ({manualPartner.ico ?? 'bez IČO'})
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {error && <p className="text-sm font-medium text-[#B3264F]">{error}</p>}

          <button
            type="button"
            disabled={!canConfirm}
            onClick={confirm}
            title={!canWrite ? 'Potvrzování mapování vyžaduje roli owner nebo editor.' : undefined}
            className="inline-flex items-center gap-2 rounded-full bg-[#E8A400] px-5 py-2 text-sm font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {confirming && <span className="portal-spinner" aria-hidden="true" />}
            Potvrdit
          </button>
        </div>
      )}
    </div>
  )
}

export default function MappingQueue({ canWrite }: MappingQueueProps) {
  const [data, setData] = useState<MappingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setError(null)
    const res = await portalFetch<MappingResponse>('/api/portal/partners/mapping', { method: 'GET' })
    if (!res.ok) {
      setError('Frontu mapování se nepodařilo načíst.')
      setLoading(false)
      return
    }
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function handleConfirmed(id: string) {
    setData((prev) => (prev ? { ...prev, pending: prev.pending.filter((p) => p.id !== id) } : prev))
    // dotáhne aktuální „potvrzená mapování", počet čekajících dávek i případné
    // nové položky fronty (mimo aktuálně zobrazovanou kartu se stačí nedotknout)
    void load()
  }

  if (loading) {
    return <p className="text-sm text-[#5F6B72]">Načítám…</p>
  }

  if (error || !data) {
    return <p className="text-sm text-[#B3264F]">{error ?? 'Frontu mapování se nepodařilo načíst.'}</p>
  }

  return (
    <div className="space-y-8">
      {data.waiting_batches > 0 && (
        <div
          className="portal-card p-4 text-sm font-medium text-[#1C2B33]"
          style={{ borderLeft: '4px solid #E8A400' }}
          role="status"
        >
          {data.waiting_batches} {data.waiting_batches === 1 ? 'dávka' : data.waiting_batches < 5 ? 'dávky' : 'dávek'} z
          PMS čeká na doplnění nespárovaných plátců.
        </div>
      )}

      <section className="space-y-3">
        <h2 className="portal-label">Čeká na přiřazení</h2>
        {data.pending.length === 0 ? (
          <p className="portal-card p-5 text-sm text-[#1C2B33]">Žádný plátce nečeká — vše je spárované. ✓</p>
        ) : (
          <div className="space-y-4">
            {data.pending.map((item) => (
              <PendingCard key={item.id} item={item} canWrite={canWrite} onConfirmed={handleConfirmed} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="portal-label">Potvrzená mapování</h2>
        <div className="portal-card overflow-x-auto p-6">
          {data.confirmed.length === 0 ? (
            <p className="text-sm text-[#5F6B72]">Zatím žádná potvrzená mapování.</p>
          ) : (
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
                  <th className="py-2 pr-3 font-medium">Plátce</th>
                  <th className="py-2 pr-3 font-medium">Druh</th>
                  <th className="py-2 pr-3 font-medium">Partner</th>
                  <th className="py-2 pr-3 font-medium">Kdo</th>
                  <th className="py-2 pr-3 font-medium">Kdy</th>
                </tr>
              </thead>
              <tbody>
                {data.confirmed.map((row) => (
                  <tr key={row.id} className="border-b border-beige-300">
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{row.payer_name_raw}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{KIND_LABELS[row.kind]}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{row.partner_name ?? '—'}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{row.confirmed_by_name ?? '—'}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-[#5F6B72]">{formatDate(row.confirmed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-xs text-[#5F6B72]">
          Přemapování potvrzeného záznamu je vědomá operace mimo frontu.
        </p>
      </section>
    </div>
  )
}
