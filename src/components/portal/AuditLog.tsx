import { useEffect, useState } from 'react'
import { portalFetch } from './api'

interface AuditEntry {
  id: string
  action: string
  entity: string
  entity_id: string | null
  diff: unknown
  ip: string | null
  at: string
  actor_email: string | null
}

interface AuditResponse {
  entries: AuditEntry[]
  page: number
  pageSize: number
  total: number
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('cs-CZ', { dateStyle: 'medium', timeStyle: 'medium' })
}

export default function AuditLog() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<AuditResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    portalFetch<AuditResponse>(`/api/portal/admin/audit?page=${page}`, { method: 'GET' }).then((res) => {
      if (cancelled) return
      if (!res.ok) {
        setError('Záznamy se nepodařilo načíst.')
      } else {
        setData(res.data)
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [page])

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  return (
    <div className="portal-card overflow-x-auto p-6">
      {error && <p className="text-sm text-[#B3264F]">{error}</p>}
      {loading && <p className="text-sm text-[#5F6B72]">Načítám…</p>}
      {!loading && !error && data && data.entries.length === 0 && (
        <p className="text-sm text-[#5F6B72]">Zatím žádné záznamy.</p>
      )}
      {!loading && !error && data && data.entries.length > 0 && (
        <>
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
                <th className="py-2 pr-3 font-medium">Čas</th>
                <th className="py-2 pr-3 font-medium">Kdo</th>
                <th className="py-2 pr-3 font-medium">Akce</th>
                <th className="py-2 pr-3 font-medium">Entita</th>
                <th className="py-2 pr-3 font-medium">IP</th>
                <th className="py-2 pr-3 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.map((entry) => (
                <tr key={entry.id} className="border-b border-beige-300 align-top">
                  <td className="py-2.5 pr-3 whitespace-nowrap text-[#5F6B72]">{formatDate(entry.at)}</td>
                  <td className="py-2.5 pr-3 text-[#1C2B33]">{entry.actor_email || '—'}</td>
                  <td className="py-2.5 pr-3 text-[#1C2B33]">{entry.action}</td>
                  <td className="py-2.5 pr-3 text-[#1C2B33]">
                    {entry.entity}
                    {entry.entity_id ? <span className="text-[#5F6B72]"> · {entry.entity_id}</span> : null}
                  </td>
                  <td className="py-2.5 pr-3 text-[#5F6B72]">{entry.ip || '—'}</td>
                  <td className="py-2.5 pr-3">
                    {entry.diff ? (
                      <details>
                        <summary className="cursor-pointer text-[#0E6EA8]">zobrazit</summary>
                        <pre className="mt-1 max-w-sm overflow-x-auto rounded bg-beige-200 p-2 text-xs">
                          {JSON.stringify(entry.diff, null, 2)}
                        </pre>
                      </details>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-[#5F6B72]">
              Strana {data.page} z {totalPages} · celkem {data.total} záznamů
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
  )
}
