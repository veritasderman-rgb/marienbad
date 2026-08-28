import { useEffect, useState } from 'react'
import { portalFetch } from './api'

export type NewsletterAudience = 'partners' | 'leads'
export type NewsletterLocale = 'de' | 'en' | 'cs'

export interface SegmentDefinition {
  audience: NewsletterAudience
  locales: NewsletterLocale[]
}

interface SegmentPickerProps {
  newsletterId: string
  initialSegment: SegmentDefinition | null
  /** Editovatelné jen owner/editor u konceptu — jinak jen souhrn. */
  canEdit: boolean
  onSaved: (segment: SegmentDefinition) => void
}

interface PreviewCountResponse {
  count: number
}

interface PatchResponse {
  ok: boolean
}

interface PatchErrorData {
  error?: string
  message?: string
}

const AUDIENCE_OPTIONS: { value: NewsletterAudience; label: string }[] = [
  { value: 'partners', label: 'Stálí partneři' },
  { value: 'leads', label: 'Vizitky z veletrhu' },
]

const AUDIENCE_LABELS: Record<NewsletterAudience, string> = {
  partners: 'Stálí partneři',
  leads: 'Vizitky z veletrhu',
}

const LOCALE_OPTIONS: { value: NewsletterLocale; label: string }[] = [
  { value: 'de', label: 'DE' },
  { value: 'en', label: 'EN' },
  { value: 'cs', label: 'CS' },
]

const LOCALE_LABELS: Record<NewsletterLocale, string> = { de: 'DE', en: 'EN', cs: 'CS' }

/**
 * Výběr publika a jazyků rozesílky. Náhled počtu příjemců (preview-count)
 * i uložení segmentu (PATCH) vyžadují roli owner/editor — proto se u
 * analytika/po schválení zobrazí jen souhrn bez dotazů na API.
 */
export default function SegmentPicker({ newsletterId, initialSegment, canEdit, onSaved }: SegmentPickerProps) {
  const [audience, setAudience] = useState<NewsletterAudience | ''>(initialSegment?.audience ?? '')
  const [locales, setLocales] = useState<NewsletterLocale[]>(initialSegment?.locales ?? [])
  const [count, setCount] = useState<number | null>(null)
  const [counting, setCounting] = useState(false)
  const [countError, setCountError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  const isValid = audience !== '' && locales.length > 0
  const localesKey = locales.join(',')

  useEffect(() => {
    if (!canEdit || !isValid) {
      setCount(null)
      return
    }
    let cancelled = false
    setCounting(true)
    setCountError(null)
    portalFetch<PreviewCountResponse>('/api/portal/newsletters/preview-count', {
      method: 'POST',
      body: { segment: { audience, locales } },
    }).then((res) => {
      if (cancelled) return
      if (!res.ok) {
        setCountError('Počet příjemců se nepodařilo spočítat.')
      } else {
        setCount(res.data.count)
      }
      setCounting(false)
    })
    return () => {
      cancelled = true
    }
    // localesKey drží stabilní porovnání obsahu pole (ne reference)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEdit, audience, localesKey])

  if (!canEdit) {
    return (
      <div className="text-sm text-[#1C2B33]">
        {initialSegment ? (
          <span>
            <span className="font-semibold">{AUDIENCE_LABELS[initialSegment.audience]}</span>
            {' · '}
            {initialSegment.locales.map((l) => LOCALE_LABELS[l]).join(', ')}
          </span>
        ) : (
          <span className="text-[#5F6B72]">Publikum zatím nebylo vybráno.</span>
        )}
      </div>
    )
  }

  function toggleLocale(l: NewsletterLocale) {
    setLocales((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]))
  }

  async function saveSegment() {
    if (!isValid) return
    setSaving(true)
    setSaveError(null)
    setSaveNotice(null)
    const segment: SegmentDefinition = { audience, locales }
    const res = await portalFetch<PatchResponse>(`/api/portal/newsletters/${newsletterId}`, {
      method: 'PATCH',
      body: { segment },
    })
    setSaving(false)
    if (!res.ok) {
      const err = res.data as PatchErrorData | null
      setSaveError(err?.message ?? (err?.error === 'not_draft' ? 'Segment lze měnit jen u konceptu.' : 'Uložení segmentu se nepodařilo.'))
      return
    }
    setSaveNotice('Segment uložen.')
    onSaved(segment)
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="portal-label mb-2">Publikum</p>
        <div className="flex flex-wrap gap-4">
          {AUDIENCE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-[#1C2B33]">
              <input
                type="radio"
                name="segment_audience"
                checked={audience === opt.value}
                onChange={() => setAudience(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="portal-label mb-2">Jazyky</p>
        <div className="flex flex-wrap gap-4">
          {LOCALE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-[#1C2B33]">
              <input type="checkbox" checked={locales.includes(opt.value)} onChange={() => toggleLocale(opt.value)} />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="text-sm text-[#5F6B72]" role="status">
        {!isValid && 'Vyberte publikum a alespoň jeden jazyk.'}
        {isValid && counting && 'Počítám příjemce…'}
        {isValid && !counting && countError && <span className="text-[#B3264F]">{countError}</span>}
        {isValid && !counting && !countError && count !== null && (
          <span>
            Odpovídá <strong className="text-[#1C2B33]">{count}</strong> {count === 1 ? 'příjemci' : 'příjemcům'}.
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!isValid || saving}
          onClick={saveSegment}
          className="inline-flex items-center gap-2 rounded-full border border-[#0E6EA8]/40 px-5 py-2.5 text-sm font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10 disabled:opacity-60"
        >
          {saving && <span className="portal-spinner" aria-hidden="true" />}
          Uložit segment
        </button>
        {saveNotice && <span className="text-sm text-[#1E7A4F]">{saveNotice}</span>}
        {saveError && <span className="text-sm text-[#B3264F]">{saveError}</span>}
      </div>
    </div>
  )
}
