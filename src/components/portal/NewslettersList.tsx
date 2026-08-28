import { useEffect, useState } from 'react'
import { portalFetch } from './api'

type NewsletterStatus = 'draft' | 'approved' | 'scheduled' | 'sent'
type NewsletterLocale = 'de' | 'en' | 'cs'

interface NewsletterListRow {
  id: string
  slug: string
  subject: string
  preheader: string | null
  locale: NewsletterLocale
  status: NewsletterStatus
  created_via: 'portal' | 'intake'
  sent_at: string | null
  recipients_count: number | null
  created_at: string
  approved_at: string | null
  created_by_name: string | null
  approved_by_name: string | null
}

interface NewslettersResponse {
  newsletters: NewsletterListRow[]
}

interface SyncResult {
  checked?: number
  upserted?: number
}

interface SyncResponse {
  ok: boolean
  result: SyncResult
}

interface NewslettersListProps {
  /** false pro roli analyst — skryje „Nový newsletter" a „Synchronizovat skupiny" */
  canWrite: boolean
}

const LOCALE_LABELS: Record<NewsletterLocale, string> = { de: 'DE', en: 'EN', cs: 'CS' }

const STATUS_LABELS: Record<NewsletterStatus, string> = {
  draft: 'Koncept',
  approved: 'Schváleno',
  scheduled: 'Naplánováno',
  sent: 'Odesláno',
}

const STATUS_COLORS: Record<NewsletterStatus, string> = {
  draft: '#5F6B72',
  approved: '#0E6EA8',
  scheduled: '#E8A400',
  sent: '#1E7A4F',
}

function statusChipStyle(status: NewsletterStatus): { backgroundColor: string; color: string } {
  const color = STATUS_COLORS[status]
  return { backgroundColor: `${color}1F`, color }
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export default function NewslettersList({ canWrite }: NewslettersListProps) {
  const [data, setData] = useState<NewsletterListRow[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncNotice, setSyncNotice] = useState<string | null>(null)

  function load() {
    setLoading(true)
    setError(null)
    portalFetch<NewslettersResponse>('/api/portal/newsletters', { method: 'GET' }).then((res) => {
      if (!res.ok) {
        setError('Seznam newsletterů se nepodařilo načíst.')
      } else {
        setData(res.data.newsletters ?? [])
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSync() {
    setSyncing(true)
    setSyncNotice(null)
    try {
      const res = await portalFetch<SyncResponse>('/api/portal/newsletters/sync', { method: 'POST' })
      if (res.status === 404) {
        // Endpoint synchronizace vzniká souběžně s tímto UI — chyba se zobrazuje decentně.
        setSyncNotice('Synchronizace skupin zatím není na serveru dostupná.')
      } else if (!res.ok) {
        setSyncNotice('Synchronizaci se nepodařilo provést. Zkuste to prosím později.')
      } else {
        const result = res.data?.result
        setSyncNotice(
          result
            ? `Synchronizováno — zkontrolováno ${result.checked ?? 0}, aktualizováno ${result.upserted ?? 0}.`
            : 'Synchronizace dokončena.',
        )
        load()
      }
    } catch {
      setSyncNotice('Spojení se serverem selhalo.')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#5F6B72]">Archiv rozesílek pro partnery a kontakty z veletrhů.</p>
        {canWrite && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-full border border-[#0E6EA8]/40 px-5 py-2.5 text-sm font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10 disabled:opacity-60"
            >
              {syncing && <span className="portal-spinner" aria-hidden="true" />}
              Synchronizovat skupiny
            </button>
            <a
              href="/portal/newsletters/new"
              className="rounded-full bg-[#E8A400] px-5 py-2.5 text-sm font-semibold text-[#1C2B33] transition-opacity hover:opacity-90"
            >
              Nový newsletter
            </a>
          </div>
        )}
      </div>

      {syncNotice && (
        <div role="status" className="rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-sm text-[#5F6B72]">
          {syncNotice}
        </div>
      )}

      <div className="portal-card overflow-x-auto p-6">
        {error && <p className="text-sm text-[#B3264F]">{error}</p>}
        {!error && loading && <p className="text-sm text-[#5F6B72]">Načítám…</p>}
        {!error && !loading && data && data.length === 0 && (
          <p className="text-sm text-[#5F6B72]">
            Zatím žádné rozesílky{canWrite ? ' — začněte tlačítkem „Nový newsletter" výše.' : '.'}
          </p>
        )}
        {!error && !loading && data && data.length > 0 && (
          // Pozn.: GET /api/portal/newsletters (dle kontraktu) nevrací segment_definition,
          // publikum se tedy zobrazuje až v detailu newsletteru, ne v tomto přehledu.
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
                <th className="py-2 pr-3 font-medium">Předmět</th>
                <th className="py-2 pr-3 font-medium">Jazyk</th>
                <th className="py-2 pr-3 font-medium">Stav</th>
                <th className="py-2 pr-3 font-medium">Vytvořil</th>
                <th className="py-2 pr-3 font-medium">Schválil</th>
                <th className="py-2 pr-3 font-medium">Odesláno</th>
                <th className="py-2 pr-3 font-medium">Příjemců</th>
              </tr>
            </thead>
            <tbody>
              {data.map((n) => (
                <tr key={n.id} className="border-b border-beige-300 align-top">
                  <td className="py-2.5 pr-3">
                    <a href={`/portal/newsletters/${n.id}`} className="font-semibold text-[#004F71] hover:underline">
                      {n.subject}
                    </a>
                    <div className="text-xs text-[#5F6B72]">{n.slug}</div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="portal-badge portal-badge-viewer">{LOCALE_LABELS[n.locale]}</span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="portal-badge" style={statusChipStyle(n.status)}>
                      {STATUS_LABELS[n.status]}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-[#1C2B33]">
                    {n.created_via === 'intake' ? (
                      <span className="portal-badge" style={{ backgroundColor: 'rgba(160,0,90,0.12)', color: '#A0005A' }}>
                        Claude
                      </span>
                    ) : (
                      n.created_by_name ?? '—'
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-[#1C2B33]">{n.approved_by_name ?? '—'}</td>
                  <td className="py-2.5 pr-3 whitespace-nowrap text-[#5F6B72]">{formatDate(n.sent_at)}</td>
                  <td className="py-2.5 pr-3 text-[#1C2B33]">{n.recipients_count ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
