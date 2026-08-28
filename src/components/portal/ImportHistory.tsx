import { useEffect, useState } from 'react'
import { portalFetch } from './api'

interface ImportRow {
  id: string
  filename: string
  rows_total: number
  rows_ok: number
  rows_failed: number
  rows_duplicate: number
  status: string
  uploaded_by_name: string | null
  uploaded_at: string
}

interface ImportListResponse {
  imports: ImportRow[]
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function statusPresentation(status: string): { label: string; className: string } {
  const s = status.toLowerCase()
  if (s.includes('fail') || s.includes('error') || s.includes('chyb')) {
    return { label: status, className: 'portal-badge-inactive' }
  }
  if (s.includes('process') || s.includes('pending') || s.includes('prob')) {
    return { label: status, className: 'portal-badge-pending' }
  }
  return { label: status, className: 'portal-badge-active' }
}

export default function ImportHistory() {
  const [imports, setImports] = useState<ImportRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    portalFetch<ImportListResponse>('/api/portal/import/list?kind=partners', { method: 'GET' }).then((res) => {
      if (cancelled) return
      if (!res.ok) {
        setError('Historii importů se nepodařilo načíst.')
        return
      }
      setImports(res.data.imports ?? [])
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="portal-card overflow-x-auto p-6">
      <h2 className="mb-4 font-heading text-lg font-semibold text-[#004F71]">Historie importů</h2>
      {error && <p className="text-sm font-medium text-[#B3264F]">{error}</p>}
      {!error && imports === null && <p className="text-sm text-[#5F6B72]">Načítám…</p>}
      {!error && imports !== null && imports.length === 0 && (
        <p className="text-sm text-[#5F6B72]">Zatím žádné importy.</p>
      )}
      {!error && imports !== null && imports.length > 0 && (
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
              <th className="py-2 pr-3 font-medium">Soubor</th>
              <th className="py-2 pr-3 font-medium">Nahráno</th>
              <th className="py-2 pr-3 font-medium">Kdo</th>
              <th className="py-2 pr-3 font-medium">Řádky OK</th>
              <th className="py-2 pr-3 font-medium">Chyby</th>
              <th className="py-2 pr-3 font-medium">Duplicity</th>
              <th className="py-2 pr-3 font-medium">Stav</th>
            </tr>
          </thead>
          <tbody>
            {imports.map((imp) => {
              const status = statusPresentation(imp.status)
              return (
                <tr key={imp.id} className="border-b border-beige-300 align-top">
                  <td className="py-2.5 pr-3 font-semibold text-[#1C2B33]">{imp.filename}</td>
                  <td className="py-2.5 pr-3 whitespace-nowrap text-[#5F6B72]">{formatDate(imp.uploaded_at)}</td>
                  <td className="py-2.5 pr-3 text-[#1C2B33]">{imp.uploaded_by_name ?? '—'}</td>
                  <td className="py-2.5 pr-3 text-[#1E7A4F]">{imp.rows_ok} / {imp.rows_total}</td>
                  <td className={`py-2.5 pr-3 ${imp.rows_failed > 0 ? 'font-semibold text-[#B3264F]' : 'text-[#5F6B72]'}`}>
                    {imp.rows_failed}
                  </td>
                  <td className="py-2.5 pr-3 text-[#5F6B72]">{imp.rows_duplicate}</td>
                  <td className="py-2.5 pr-3">
                    <span className={`portal-badge ${status.className}`}>{status.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
