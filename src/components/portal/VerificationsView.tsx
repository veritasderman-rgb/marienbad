import { useEffect, useMemo, useState } from 'react'
import { portalFetch } from './api'

/**
 * Přehled prověrek partnerů v rejstřících (NAVRH 5.5).
 *
 * Zahraniční partner se NIKDY nezobrazuje jako „v pořádku" — bez českého IČO
 * se lustrace přes Hlídač státu neprovádí, takže stav je „neověřeno", ne `ok`.
 * Falešné „v pořádku" je horší než přiznané „nevíme".
 */

type RiskLevel = 'ok' | 'watch' | 'alert' | null
type VerificationState = 'verified' | 'pending' | 'foreign' | 'no_ico'

interface VerificationRow {
  partner_id: string
  name: string
  ico: string | null
  country: string
  status: string
  risk_level: RiskLevel
  checked_at: string | null
  reasons: string[]
  source_url: string | null
  verification_state: VerificationState
}

interface VerificationCounts {
  verified: number
  alert: number
  watch: number
  pending: number
  foreign: number
  no_ico: number
}

interface VerificationsResponse {
  rows: VerificationRow[]
  counts: VerificationCounts
}

interface RunResponse {
  ok: boolean
  skipped?: string
  [key: string]: unknown
}

interface VerificationsViewProps {
  /** false pro roli analyst — skryje „Prověřit vše" a per-řádkové „Prověřit" */
  canWrite: boolean
}

type FilterKey = 'all' | 'alert' | 'watch' | 'pending' | 'foreign'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Vše' },
  { key: 'alert', label: 'Alert' },
  { key: 'watch', label: 'Watch' },
  { key: 'pending', label: 'Čeká' },
  { key: 'foreign', label: 'Zahraniční' },
]

const COUNT_CARDS: { key: keyof VerificationCounts; label: string; color: string }[] = [
  { key: 'alert', label: 'Alert', color: '#B3264F' },
  { key: 'watch', label: 'Watch', color: '#E8A400' },
  { key: 'verified', label: 'V pořádku', color: '#1E7A4F' },
  { key: 'pending', label: 'Čeká na prověrku', color: '#6E5BC4' },
  { key: 'foreign', label: 'Mimo dosah (zahraniční)', color: '#5F6B72' },
  { key: 'no_ico', label: 'Bez IČO', color: '#6E5BC4' },
]

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'medium' }).format(new Date(value))
}

interface StatusChip {
  label: string
  color: string
  background: string
}

function statusChip(row: VerificationRow): StatusChip {
  if (row.verification_state === 'foreign') {
    return { label: '— neověřeno (zahraniční)', color: '#5F6B72', background: 'rgba(95, 107, 114, 0.12)' }
  }
  if (row.verification_state === 'no_ico') {
    return { label: '● chybí IČO', color: '#6E5BC4', background: 'rgba(110, 91, 196, 0.14)' }
  }
  if (row.verification_state === 'pending') {
    return { label: '● čeká na prověrku', color: '#6E5BC4', background: 'rgba(110, 91, 196, 0.14)' }
  }
  // verification_state === 'verified'
  if (row.risk_level === 'alert') {
    return { label: '⚠ alert', color: '#B3264F', background: 'rgba(179, 38, 79, 0.12)' }
  }
  if (row.risk_level === 'watch') {
    return { label: '● watch', color: '#E8A400', background: 'rgba(232, 164, 0, 0.14)' }
  }
  if (row.risk_level === 'ok') {
    return { label: '✓ v pořádku', color: '#1E7A4F', background: 'rgba(30, 122, 79, 0.12)' }
  }
  // Fallback pro nekonzistentní data — nikdy nepředstírat „v pořádku".
  return { label: '● čeká na prověrku', color: '#6E5BC4', background: 'rgba(110, 91, 196, 0.14)' }
}

function reasonsText(row: VerificationRow): string {
  if (row.verification_state === 'foreign') return 'mimo dosah Hlídače státu'
  if (row.verification_state === 'no_ico') return 'IČO nedohledáno — doplňte na kartě partnera'
  return row.reasons.length > 0 ? row.reasons.join(' · ') : '—'
}

export default function VerificationsView({ canWrite }: VerificationsViewProps) {
  const [data, setData] = useState<VerificationsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filter, setFilter] = useState<FilterKey>('all')

  const [running, setRunning] = useState(false)
  const [runNotice, setRunNotice] = useState<{ kind: 'warning' | 'error'; text: string } | null>(null)

  const [rowBusy, setRowBusy] = useState<Record<string, boolean>>({})
  const [rowError, setRowError] = useState<Record<string, string>>({})

  async function load() {
    setLoading(true)
    setError(null)
    const res = await portalFetch<VerificationsResponse>('/api/portal/verifications', { method: 'GET' })
    if (!res.ok) {
      setError('Přehled prověrek se nepodařilo načíst.')
      setLoading(false)
      return
    }
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function runAll() {
    setRunning(true)
    setRunNotice(null)
    try {
      const res = await portalFetch<RunResponse>('/api/portal/verifications/run', { method: 'POST', body: {} })
      if (res.data?.skipped === 'hlidac_not_configured') {
        setRunNotice({
          kind: 'warning',
          text: 'Prověrky zatím nejsou nakonfigurované — chybí HLIDAC_TOKEN (viz runbook).',
        })
      } else if (!res.ok || res.data?.ok === false) {
        setRunNotice({ kind: 'error', text: 'Prověrku se nepodařilo spustit.' })
      } else {
        await load()
      }
    } catch {
      setRunNotice({ kind: 'error', text: 'Spojení se serverem selhalo.' })
    } finally {
      setRunning(false)
    }
  }

  async function runOne(partnerId: string) {
    setRowBusy((m) => ({ ...m, [partnerId]: true }))
    setRowError((m) => {
      const next = { ...m }
      delete next[partnerId]
      return next
    })
    try {
      const res = await portalFetch<RunResponse>('/api/portal/verifications/run', {
        method: 'POST',
        body: { partner_id: partnerId },
      })
      if (res.data?.skipped === 'hlidac_not_configured') {
        setRunNotice({
          kind: 'warning',
          text: 'Prověrky zatím nejsou nakonfigurované — chybí HLIDAC_TOKEN (viz runbook).',
        })
      } else if (!res.ok || res.data?.ok === false) {
        setRowError((m) => ({ ...m, [partnerId]: 'Prověrku se nepodařilo spustit.' }))
      } else {
        await load()
      }
    } catch {
      setRowError((m) => ({ ...m, [partnerId]: 'Spojení se serverem selhalo.' }))
    } finally {
      setRowBusy((m) => ({ ...m, [partnerId]: false }))
    }
  }

  const filteredRows = useMemo(() => {
    const rows = data?.rows ?? []
    switch (filter) {
      case 'alert':
        return rows.filter((r) => r.risk_level === 'alert')
      case 'watch':
        return rows.filter((r) => r.risk_level === 'watch')
      case 'pending':
        return rows.filter((r) => r.verification_state === 'pending')
      case 'foreign':
        return rows.filter((r) => r.verification_state === 'foreign')
      default:
        return rows
    }
  }, [data, filter])

  const counts: VerificationCounts = data?.counts ?? {
    verified: 0,
    alert: 0,
    watch: 0,
    pending: 0,
    foreign: 0,
    no_ico: 0,
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {COUNT_CARDS.map((card) => (
          <div key={card.key} className="portal-card flex flex-col gap-1.5 p-5">
            <span className="portal-label">{card.label}</span>
            <span className="font-heading text-2xl font-bold" style={{ color: card.color }}>
              {counts[card.key]}
            </span>
          </div>
        ))}
      </div>

      {canWrite && (
        <div className="portal-card flex flex-wrap items-center gap-3 p-5">
          <button
            type="button"
            disabled={running}
            onClick={runAll}
            className="rounded-full bg-[#E8A400] px-5 py-2.5 font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {running ? (
              <span className="inline-flex items-center gap-2">
                <span className="portal-spinner" aria-hidden="true" /> Probíhá prověřování…
              </span>
            ) : (
              'Prověřit vše'
            )}
          </button>
          {runNotice && (
            <p
              className="text-sm font-medium"
              style={{ color: runNotice.kind === 'warning' ? '#E8A400' : '#B3264F' }}
              role="status"
            >
              {runNotice.text}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={
              filter === f.key
                ? 'rounded-full bg-[#004F71] px-4 py-1.5 text-xs font-semibold text-white'
                : 'rounded-full border border-[#0E6EA8]/40 px-4 py-1.5 text-xs font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10'
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="portal-card overflow-x-auto p-6">
        {error && <p className="text-sm text-[#B3264F]">{error}</p>}
        {!error && loading && <p className="text-sm text-[#5F6B72]">Načítám…</p>}
        {!error && !loading && filteredRows.length === 0 && (
          <p className="text-sm text-[#5F6B72]">Žádní partneři neodpovídají zvolenému filtru.</p>
        )}
        {!error && !loading && filteredRows.length > 0 && (
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
                <th className="py-2 pr-3 font-medium">Partner</th>
                <th className="py-2 pr-3 font-medium">IČO</th>
                <th className="py-2 pr-3 font-medium">Země</th>
                <th className="py-2 pr-3 font-medium">Stav</th>
                <th className="py-2 pr-3 font-medium">Poznámka</th>
                <th className="py-2 pr-3 font-medium">Prověřeno</th>
                <th className="py-2 pr-3 font-medium">Akce</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const chip = statusChip(row)
                const canRunRow =
                  canWrite && (row.verification_state === 'verified' || row.verification_state === 'pending')
                const busy = rowBusy[row.partner_id] === true
                return (
                  <tr key={row.partner_id} className="border-b border-beige-300 align-top">
                    <td className="py-2.5 pr-3">
                      <a
                        href={`/portal/partners/${row.partner_id}`}
                        className="font-semibold text-[#004F71] hover:underline"
                      >
                        {row.name}
                      </a>
                    </td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{row.ico ?? '—'}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{row.country}</td>
                    <td className="py-2.5 pr-3">
                      <span className="portal-badge" style={{ backgroundColor: chip.background, color: chip.color }}>
                        {chip.label}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 max-w-[320px] text-[#1C2B33]">
                      {reasonsText(row)}
                      {rowError[row.partner_id] && (
                        <div className="mt-1 text-xs font-medium text-[#B3264F]">{rowError[row.partner_id]}</div>
                      )}
                    </td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-[#5F6B72]">{formatDate(row.checked_at)}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {canRunRow && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => runOne(row.partner_id)}
                            className="rounded-full border border-[#0E6EA8]/40 px-3 py-1 text-xs font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10 disabled:opacity-60"
                          >
                            {busy ? 'Prověřuji…' : 'Prověřit'}
                          </button>
                        )}
                        {row.source_url && (
                          <a
                            href={row.source_url}
                            target="_blank"
                            rel="noopener"
                            className="text-xs font-semibold text-[#0E6EA8] hover:underline"
                          >
                            detail ↗
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-[#5F6B72]">
        Zdroj dat:{' '}
        <a
          href="https://www.hlidacstatu.cz"
          target="_blank"
          rel="noopener"
          className="font-semibold text-[#0E6EA8] hover:underline"
        >
          Hlídač státu — hlidacstatu.cz
        </a>{' '}
        · Podmínky užití:{' '}
        <a
          href="https://texty.hlidacstatu.cz/licence/"
          target="_blank"
          rel="noopener"
          className="font-semibold text-[#0E6EA8] hover:underline"
        >
          texty.hlidacstatu.cz/licence/
        </a>
      </p>
    </div>
  )
}
