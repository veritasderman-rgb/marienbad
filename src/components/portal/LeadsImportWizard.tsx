import { useEffect, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { portalFetch, portalUpload } from './api'

type Step = 1 | 2 | 3 | 4

type TargetField =
  | 'company_name'
  | 'ico'
  | 'email'
  | 'first_name'
  | 'last_name'
  | 'phone'
  | 'position'
  | 'country'
  | 'city'
  | 'website'
  | 'notes'

type ConsentBasis = 'lead_scanner' | 'business_card' | 'explicit_signup'

const FIELD_OPTIONS: { value: TargetField | ''; label: string }[] = [
  { value: '', label: '— nepoužít —' },
  { value: 'company_name', label: 'Název firmy' },
  { value: 'ico', label: 'IČO' },
  { value: 'email', label: 'E-mail' },
  { value: 'first_name', label: 'Jméno' },
  { value: 'last_name', label: 'Příjmení' },
  { value: 'phone', label: 'Telefon' },
  { value: 'position', label: 'Pozice' },
  { value: 'country', label: 'Země' },
  { value: 'city', label: 'Město' },
  { value: 'website', label: 'Web' },
  { value: 'notes', label: 'Poznámka' },
]

const FIELD_VALUES: ReadonlySet<string> = new Set(
  FIELD_OPTIONS.map((f) => f.value).filter((v): v is TargetField => v !== ''),
)

const CONSENT_OPTIONS: { value: ConsentBasis; label: string }[] = [
  { value: 'lead_scanner', label: 'Čtečka leadů' },
  { value: 'business_card', label: 'Vizitka' },
  { value: 'explicit_signup', label: 'Výslovné přihlášení' },
]

const MAX_FILE_BYTES = 5 * 1024 * 1024

interface UploadDetected {
  encoding: string
  delimiter: string
}

interface UploadResponse {
  ok: boolean
  import_id: string
  headers: string[]
  sample: string[][]
  suggested_mapping?: Record<string, string>
  detected: UploadDetected
  rows_total: number
  storage_warning?: boolean
}

interface DryRunCandidate {
  id: string
  name: string
  ico: string | null
  similarity: number
}

interface DryRunRecord {
  name: string | null
  ico: string | null
  email: string | null
  first_name: string | null
  last_name: string | null
}

interface ToDecideRow {
  row_index: number
  record: DryRunRecord
  candidates: DryRunCandidate[]
}

interface DryRunErrorRow {
  row_index: number
  error: string
}

interface DryRunPreview {
  new: number
  existing: number
  to_decide: ToDecideRow[]
  errors: DryRunErrorRow[]
}

interface CommitDryRunResponse {
  ok: boolean
  preview: DryRunPreview
}

interface CommitResult {
  created_partners: number
  created_contacts: number
  duplicates: number
  skipped: number
  failed: number
}

interface CommitFinalResponse {
  ok: boolean
  result: CommitResult
}

interface ImportTemplate {
  id: string
  name: string
  column_mapping: Record<string, string>
}

interface TemplatesResponse {
  templates: ImportTemplate[]
}

const inputClass =
  'w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]'
const labelClass = 'block text-sm font-medium text-[#1C2B33] mb-1.5'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} kB`
  return `${(kb / 1024).toFixed(1)} MB`
}

/** Zkusí z libovolného tvaru mapy (podle indexu, podle názvu sloupce, nebo
 * obráceně {field: header}) vytáhnout cílové pole pro daný sloupec. Čte
 * tolerantně — backend kontrakt pro suggested_mapping/šablony se může lišit. */
function resolveField(headers: string[], index: number, source: Record<string, string> | undefined): TargetField | '' {
  if (!source) return ''
  const header = headers[index] ?? ''
  const headerLower = header.toLowerCase()

  const direct = source[String(index)] ?? source[header]
  if (direct && FIELD_VALUES.has(direct)) return direct as TargetField

  const byHeaderCi = Object.entries(source).find(([k]) => k.toLowerCase() === headerLower)
  if (byHeaderCi && FIELD_VALUES.has(byHeaderCi[1])) return byHeaderCi[1] as TargetField

  const byValueHeader = Object.entries(source).find(
    ([, v]) => v === header || v.toLowerCase() === headerLower,
  )
  if (byValueHeader && FIELD_VALUES.has(byValueHeader[0])) return byValueHeader[0] as TargetField

  const byValueIndex = Object.entries(source).find(([, v]) => v === String(index))
  if (byValueIndex && FIELD_VALUES.has(byValueIndex[0])) return byValueIndex[0] as TargetField

  return ''
}

function buildMappingPayload(headers: string[], mapping: string[]): Record<string, string> {
  const out: Record<string, string> = {}
  headers.forEach((h, i) => {
    const field = mapping[i]
    if (field) out[h] = field
  })
  return out
}

const STEP_LABELS: { step: Step; label: string }[] = [
  { step: 1, label: 'Nahrání' },
  { step: 2, label: 'Mapování' },
  { step: 3, label: 'Kontrola' },
  { step: 4, label: 'Hotovo' },
]

function Stepper({ current }: { current: Step }) {
  return (
    <ol className="portal-card flex flex-wrap items-center gap-2 p-4 text-sm">
      {STEP_LABELS.map(({ step, label }, idx) => {
        const done = step < current
        const active = step === current
        return (
          <li key={step} className="flex items-center gap-2">
            {idx > 0 && <span className="text-[#5F6B72]" aria-hidden="true">→</span>}
            <span
              className={
                'flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold ' +
                (active
                  ? 'bg-[#004F71] text-white'
                  : done
                    ? 'bg-[#1E7A4F]/10 text-[#1E7A4F]'
                    : 'bg-beige-200 text-[#5F6B72]')
              }
              aria-current={active ? 'step' : undefined}
            >
              <span
                className={
                  'flex h-5 w-5 items-center justify-center rounded-full text-xs ' +
                  (active ? 'bg-white/25 text-white' : done ? 'bg-[#1E7A4F]/20' : 'bg-white/60')
                }
                aria-hidden="true"
              >
                {done ? '✓' : step}
              </span>
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default function LeadsImportWizard() {
  const [step, setStep] = useState<Step>(1)

  // Krok 1 — nahrání
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null)

  // Krok 2 — mapování
  const [mapping, setMapping] = useState<string[]>([])
  const [templates, setTemplates] = useState<ImportTemplate[]>([])
  const [templateSelection, setTemplateSelection] = useState('')
  const [templateNotice, setTemplateNotice] = useState<string | null>(null)
  const [optIn, setOptIn] = useState(true)
  const [consentBasis, setConsentBasis] = useState<ConsentBasis>('lead_scanner')
  const [optInSource, setOptInSource] = useState('')
  const [mappingError, setMappingError] = useState<string | null>(null)
  const [reviewLoading, setReviewLoading] = useState(false)

  // Krok 3 — kontrola (dry run)
  const [preview, setPreview] = useState<DryRunPreview | null>(null)
  const [decisions, setDecisions] = useState<Record<number, string>>({})
  const [skipUndecided, setSkipUndecided] = useState(false)
  const [committing, setCommitting] = useState(false)
  const [commitError, setCommitError] = useState<string | null>(null)

  // Krok 4 — hotovo
  const [result, setResult] = useState<CommitResult | null>(null)

  useEffect(() => {
    if (step !== 2) return
    let cancelled = false
    portalFetch<TemplatesResponse>('/api/portal/import/leads/templates', { method: 'GET' }).then((res) => {
      if (cancelled) return
      if (res.ok) setTemplates(res.data.templates ?? [])
    })
    return () => {
      cancelled = true
    }
  }, [step])

  function validateFile(f: File): string | null {
    if (!f.name.toLowerCase().endsWith('.csv')) return 'Nahrajte soubor ve formátu CSV.'
    if (f.size > MAX_FILE_BYTES) return 'Soubor je větší než 5 MB.'
    return null
  }

  function pickFile(f: File) {
    const err = validateFile(f)
    if (err) {
      setFile(null)
      setFileError(err)
      return
    }
    setFileError(null)
    setFile(f)
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.currentTarget.files?.[0]
    if (f) pickFile(f)
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) pickFile(f)
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await portalUpload<UploadResponse>('/api/portal/import/leads/upload', formData)
      if (!res.ok) {
        setUploadError('Nahrání souboru se nepodařilo. Zkontrolujte formát a velikost.')
        return
      }
      setUploadResult(res.data)
      setMapping(res.data.headers.map((_, i) => resolveField(res.data.headers, i, res.data.suggested_mapping)))
      setStep(2)
    } catch {
      setUploadError('Spojení se serverem selhalo.')
    } finally {
      setUploading(false)
    }
  }

  function setColumnField(index: number, value: string) {
    setMapping((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function applyTemplate(templateId: string) {
    setTemplateSelection(templateId)
    if (!uploadResult || !templateId) return
    const template = templates.find((t) => t.id === templateId)
    if (!template) return
    setMapping(uploadResult.headers.map((_, i) => resolveField(uploadResult.headers, i, template.column_mapping)))
  }

  async function saveAsTemplate() {
    if (!uploadResult) return
    const name = window.prompt('Název šablony:')
    if (!name || !name.trim()) return
    setTemplateNotice(null)
    const res = await portalFetch<{ ok: boolean }>('/api/portal/import/leads/templates', {
      method: 'POST',
      body: { name: name.trim(), column_mapping: buildMappingPayload(uploadResult.headers, mapping) },
    })
    if (!res.ok) {
      setTemplateNotice('Šablonu se nepodařilo uložit.')
      return
    }
    setTemplateNotice('Šablona uložena.')
    const list = await portalFetch<TemplatesResponse>('/api/portal/import/leads/templates', { method: 'GET' })
    if (list.ok) setTemplates(list.data.templates ?? [])
  }

  async function goToReview() {
    if (!uploadResult) return
    setMappingError(null)
    if (mapping.every((f) => !f)) {
      setMappingError('Namapujte alespoň jeden sloupec.')
      return
    }
    if (optIn && (!consentBasis || optInSource.trim() === '')) {
      setMappingError('U zapnutého zařazení do newsletteru vyberte základ souhlasu a vyplňte akci/zdroj.')
      return
    }
    setReviewLoading(true)
    try {
      const res = await portalFetch<CommitDryRunResponse>('/api/portal/import/leads/commit', {
        method: 'POST',
        body: {
          import_id: uploadResult.import_id,
          mapping: buildMappingPayload(uploadResult.headers, mapping),
          opt_in: optIn,
          ...(optIn ? { consent_basis: consentBasis, opt_in_source: optInSource.trim() } : {}),
          dry_run: true,
        },
      })
      if (!res.ok) {
        setMappingError('Kontrolu se nepodařilo připravit. Zkuste to znovu.')
        return
      }
      setPreview(res.data.preview)
      setDecisions({})
      setSkipUndecided(false)
      setStep(3)
    } catch {
      setMappingError('Spojení se serverem selhalo.')
    } finally {
      setReviewLoading(false)
    }
  }

  function setDecision(rowIndex: number, value: string) {
    setDecisions((prev) => ({ ...prev, [rowIndex]: value }))
  }

  const undecidedCount = preview ? preview.to_decide.filter((r) => !decisions[r.row_index]).length : 0

  async function handleCommit() {
    if (!preview || !uploadResult) return
    setCommitting(true)
    setCommitError(null)
    try {
      const decisionsPayload: Record<string, string> = {}
      preview.to_decide.forEach((row) => {
        decisionsPayload[String(row.row_index)] = decisions[row.row_index] ?? 'skip'
      })
      const res = await portalFetch<CommitFinalResponse>('/api/portal/import/leads/commit', {
        method: 'POST',
        body: {
          import_id: uploadResult.import_id,
          mapping: buildMappingPayload(uploadResult.headers, mapping),
          opt_in: optIn,
          ...(optIn ? { consent_basis: consentBasis, opt_in_source: optInSource.trim() } : {}),
          dry_run: false,
          decisions: decisionsPayload,
        },
      })
      if (!res.ok) {
        setCommitError('Import se nepodařilo provést. Zkuste to znovu.')
        return
      }
      setResult(res.data.result)
      setStep(4)
    } catch {
      setCommitError('Spojení se serverem selhalo.')
    } finally {
      setCommitting(false)
    }
  }

  function resetWizard() {
    setStep(1)
    setFile(null)
    setDragOver(false)
    setFileError(null)
    setUploading(false)
    setUploadError(null)
    setUploadResult(null)
    setMapping([])
    setTemplates([])
    setTemplateSelection('')
    setTemplateNotice(null)
    setOptIn(true)
    setConsentBasis('lead_scanner')
    setOptInSource('')
    setMappingError(null)
    setPreview(null)
    setDecisions({})
    setSkipUndecided(false)
    setCommitting(false)
    setCommitError(null)
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <Stepper current={step} />

      {step === 1 && (
        <div className="portal-card space-y-4 p-6">
          <label
            htmlFor="csv_file"
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={
              'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ' +
              (dragOver ? 'border-[#0E6EA8] bg-[#0E6EA8]/5' : 'border-beige-400 bg-beige-100')
            }
          >
            <input id="csv_file" type="file" accept=".csv" className="sr-only" onChange={handleFileChange} />
            <span className="font-heading text-base font-semibold text-[#004F71]">
              Přetáhněte sem CSV soubor, nebo klikněte a vyberte
            </span>
            <span className="text-sm text-[#5F6B72]">Formát .csv, maximálně 5 MB</span>
          </label>

          {fileError && (
            <div role="alert" className="rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
              {fileError}
            </div>
          )}

          {file && !fileError && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-beige-400 bg-white px-4 py-3">
              <div className="text-sm text-[#1C2B33]">
                <span className="font-semibold">{file.name}</span>{' '}
                <span className="text-[#5F6B72]">({formatBytes(file.size)})</span>
              </div>
              <button
                type="button"
                disabled={uploading}
                onClick={handleUpload}
                className="rounded-full bg-[#E8A400] px-5 py-2.5 text-sm font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {uploading ? 'Nahrávám…' : 'Nahrát soubor'}
              </button>
            </div>
          )}

          {uploadError && (
            <div role="alert" className="rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
              {uploadError}
            </div>
          )}
        </div>
      )}

      {step >= 2 && uploadResult && (
        <div className="portal-card flex flex-wrap items-center gap-x-6 gap-y-1 p-4 text-sm text-[#5F6B72]">
          <span>
            Kódování: <strong className="text-[#1C2B33]">{uploadResult.detected.encoding}</strong> · Oddělovač:{' '}
            <strong className="text-[#1C2B33]">{uploadResult.detected.delimiter}</strong> · Řádků celkem:{' '}
            <strong className="text-[#1C2B33]">{uploadResult.rows_total}</strong>
          </span>
        </div>
      )}

      {step >= 2 && uploadResult?.storage_warning && (
        <div className="rounded-lg border border-[#E8A400]/40 bg-[#E8A400]/10 px-3.5 py-2.5 text-sm font-medium text-[#8f6b00]">
          Soubor se nepodařilo uložit do úložiště — import projde, ale originál nebude archivován.
        </div>
      )}

      {step === 2 && uploadResult && (
        <div className="space-y-6">
          <div className="portal-card space-y-4 p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-heading text-lg font-semibold text-[#004F71]">Mapování sloupců</h2>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className={labelClass} htmlFor="template_select">Načíst šablonu</label>
                  <select
                    id="template_select"
                    value={templateSelection}
                    onChange={(e) => applyTemplate(e.currentTarget.value)}
                    className={inputClass}
                  >
                    <option value="">— vyberte —</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={saveAsTemplate}
                  className="rounded-full border border-[#0E6EA8]/40 px-4 py-2.5 text-sm font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10"
                >
                  Uložit jako šablonu
                </button>
              </div>
            </div>

            {templateNotice && <p className="text-sm text-[#5F6B72]">{templateNotice}</p>}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
                    <th className="py-2 pr-3 font-medium">Sloupec CSV</th>
                    <th className="py-2 pr-3 font-medium">Ukázkové hodnoty</th>
                    <th className="py-2 pr-3 font-medium">Cílové pole</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadResult.headers.map((header, index) => (
                    <tr key={index} className="border-b border-beige-300 align-top">
                      <td className="py-2.5 pr-3 font-semibold text-[#1C2B33]">{header || `(sloupec ${index + 1})`}</td>
                      <td className="py-2.5 pr-3 text-[#5F6B72]">
                        {uploadResult.sample.slice(0, 3).map((row, r) => (
                          <div key={r}>{row[index] ?? ''}</div>
                        ))}
                      </td>
                      <td className="py-2.5 pr-3">
                        <select
                          value={mapping[index] ?? ''}
                          onChange={(e) => setColumnField(index, e.currentTarget.value)}
                          className={inputClass}
                          aria-label={`Cílové pole pro sloupec ${header || index + 1}`}
                        >
                          {FIELD_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="portal-card space-y-4 p-6">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={optIn}
                onChange={(e) => setOptIn(e.currentTarget.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>
                <span className="block font-heading text-base font-semibold text-[#004F71]">Zařadit do newsletteru</span>
                <span className="mt-1 block text-sm text-[#5F6B72]">
                  Vizitka podaná na B2B veletrhu je podaná právě proto, aby se firma ozvala, a čtečky leadů souhlas
                  obvykle sbírají už při skenu jmenovky — proto je přepínač ve výchozím stavu zapnutý. Vypněte ho u
                  dávky, u které se nedá určit původ (např. přeposlaný seznam odjinud).
                </span>
              </span>
            </label>

            {optIn && (
              <div className="flex flex-wrap items-end gap-3 pl-7">
                <div>
                  <label className={labelClass} htmlFor="consent_basis">Základ souhlasu</label>
                  <select
                    id="consent_basis"
                    value={consentBasis}
                    onChange={(e) => setConsentBasis(e.currentTarget.value as ConsentBasis)}
                    className={inputClass}
                  >
                    {CONSENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="min-w-[240px] flex-1">
                  <label className={labelClass} htmlFor="opt_in_source">Akce / zdroj</label>
                  <input
                    id="opt_in_source"
                    value={optInSource}
                    onChange={(e) => setOptInSource(e.currentTarget.value)}
                    placeholder="např. veletrh:ITB-2026"
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>

          {mappingError && (
            <div role="alert" className="rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
              {mappingError}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-full border border-[#0E6EA8]/40 px-5 py-2.5 text-sm font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10"
            >
              Zpět
            </button>
            <button
              type="button"
              disabled={reviewLoading}
              onClick={goToReview}
              className="rounded-full bg-[#E8A400] px-5 py-2.5 text-sm font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {reviewLoading ? 'Připravuji…' : 'Pokračovat na kontrolu'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && preview && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="portal-card p-5">
              <p className="portal-label">Nových</p>
              <p className="mt-1 text-2xl font-bold text-[#1E7A4F]">{preview.new}</p>
            </div>
            <div className="portal-card p-5">
              <p className="portal-label">Už v CRM</p>
              <p className="mt-1 text-2xl font-bold text-[#004F71]">{preview.existing}</p>
            </div>
            <div className="portal-card p-5">
              <p className="portal-label">K rozhodnutí</p>
              <p className="mt-1 text-2xl font-bold text-[#E8A400]">{preview.to_decide.length}</p>
            </div>
            <div className="portal-card p-5">
              <p className="portal-label">Chybných řádků</p>
              <p className="mt-1 text-2xl font-bold text-[#B3264F]">{preview.errors.length}</p>
            </div>
          </div>

          {preview.to_decide.length > 0 && (
            <div className="portal-card space-y-4 overflow-x-auto p-6">
              <h2 className="font-heading text-lg font-semibold text-[#004F71]">Řádky k rozhodnutí</h2>
              <table className="w-full min-w-[880px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
                    <th className="py-2 pr-3 font-medium">Řádek</th>
                    <th className="py-2 pr-3 font-medium">Záznam z CSV</th>
                    <th className="py-2 pr-3 font-medium">Rozhodnutí</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.to_decide.map((row) => (
                    <tr key={row.row_index} className="border-b border-beige-300 align-top">
                      <td className="py-2.5 pr-3 text-[#5F6B72]">{row.row_index}</td>
                      <td className="py-2.5 pr-3">
                        <div className="font-semibold text-[#1C2B33]">{row.record.name ?? '—'}</div>
                        <div className="text-xs text-[#5F6B72]">
                          IČO {row.record.ico ?? '—'} · {row.record.email ?? '—'}
                        </div>
                      </td>
                      <td className="py-2.5 pr-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`decision_${row.row_index}`}
                              checked={decisions[row.row_index] === 'create'}
                              onChange={() => setDecision(row.row_index, 'create')}
                            />
                            Založit nového
                          </label>
                          {row.candidates.map((c) => (
                            <label key={c.id} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`decision_${row.row_index}`}
                                checked={decisions[row.row_index] === `merge:${c.id}`}
                                onChange={() => setDecision(row.row_index, `merge:${c.id}`)}
                              />
                              Přiřadit k „{c.name}" (IČO {c.ico ?? '—'}, {Math.round(c.similarity)} % shoda)
                            </label>
                          ))}
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`decision_${row.row_index}`}
                              checked={decisions[row.row_index] === 'skip'}
                              onChange={() => setDecision(row.row_index, 'skip')}
                            />
                            Přeskočit
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {preview.errors.length > 0 && (
            <details className="portal-card p-6">
              <summary className="cursor-pointer font-heading text-lg font-semibold text-[#B3264F]">
                Chybové řádky ({preview.errors.length})
              </summary>
              <ul className="mt-3 space-y-1 text-sm text-[#1C2B33]">
                {preview.errors.map((e) => (
                  <li key={e.row_index}>
                    Řádek {e.row_index}: <span className="text-[#B3264F]">{e.error}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {undecidedCount > 0 && (
            <div className="portal-card p-6">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={skipUndecided}
                  onChange={(e) => setSkipUndecided(e.currentTarget.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span className="text-sm text-[#1C2B33]">
                  Nerozhodnuté řádky přeskočit ({undecidedCount}× zatím bez volby — bez zaškrtnutí nejde pokračovat).
                </span>
              </label>
            </div>
          )}

          {commitError && (
            <div role="alert" className="rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
              {commitError}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-full border border-[#0E6EA8]/40 px-5 py-2.5 text-sm font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10"
            >
              Upravit mapování
            </button>
            <button
              type="button"
              disabled={committing || (undecidedCount > 0 && !skipUndecided)}
              onClick={handleCommit}
              className="rounded-full bg-[#E8A400] px-5 py-2.5 text-sm font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {committing ? 'Provádím…' : 'Provést import'}
            </button>
          </div>
        </div>
      )}

      {step === 4 && result && (
        <div className="portal-card space-y-5 p-8">
          <h2 className="font-heading text-xl font-bold text-[#004F71]">Import dokončen</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <p className="portal-label">Založení partneři</p>
              <p className="mt-1 text-xl font-bold text-[#1E7A4F]">{result.created_partners}</p>
            </div>
            <div>
              <p className="portal-label">Založené kontakty</p>
              <p className="mt-1 text-xl font-bold text-[#1E7A4F]">{result.created_contacts}</p>
            </div>
            <div>
              <p className="portal-label">Duplicity</p>
              <p className="mt-1 text-xl font-bold text-[#004F71]">{result.duplicates}</p>
            </div>
            <div>
              <p className="portal-label">Přeskočeno</p>
              <p className="mt-1 text-xl font-bold text-[#5F6B72]">{result.skipped}</p>
            </div>
            <div>
              <p className="portal-label">Selhalo</p>
              <p className="mt-1 text-xl font-bold text-[#B3264F]">{result.failed}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/portal/partners"
              className="rounded-full bg-[#E8A400] px-5 py-2.5 text-sm font-semibold text-[#1C2B33] transition-opacity hover:opacity-90"
            >
              Zobrazit partnery
            </a>
            <button
              type="button"
              onClick={resetWizard}
              className="rounded-full border border-[#0E6EA8]/40 px-5 py-2.5 text-sm font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10"
            >
              Nový import
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
