import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { portalFetch } from './api'
import NewsletterPreview from './NewsletterPreview'
import SegmentPicker from './SegmentPicker'
import type { SegmentDefinition } from './SegmentPicker'

export type NewsletterStatus = 'draft' | 'approved' | 'scheduled' | 'sent'
export type NewsletterLocale = 'de' | 'en' | 'cs'
type PortalRole = 'owner' | 'editor' | 'analyst' | 'viewer'

interface NewsletterRecord {
  id: string
  slug: string
  subject: string
  preheader: string | null
  locale: NewsletterLocale
  html_body: string
  plain_body: string | null
  segment_definition: SegmentDefinition | null
  status: NewsletterStatus
  mailerlite_campaign_id: string | null
  sent_at: string | null
  recipients_count: number | null
  created_via: 'portal' | 'intake'
  approved_at: string | null
  created_at: string
}

interface NewsletterStatRow {
  id: string
  fetched_at: string
  sent: number | null
  open_rate: number | null
  clicks_count: number | null
  unique_clicks_count: number | null
  click_rate: number | null
  click_to_open_rate: number | null
  unsubscribes_count: number | null
  spam_count: number | null
  hard_bounces_count: number | null
  soft_bounces_count: number | null
}

interface NewsletterDetailResponse {
  newsletter: NewsletterRecord
  recipient_count: number | null
  stats: NewsletterStatRow[]
}

interface CreateResponse {
  ok: boolean
  id: string
}

interface SendResponse {
  ok: boolean
  campaign_id: string
  recipients: number
}

interface ApiErrorData {
  error?: string
  message?: string
}

interface NewsletterEditorProps {
  /** Bez ID = formulář pro založení nového konceptu (new.astro). */
  newsletterId?: string
  role: PortalRole
}

const LOCALE_OPTIONS: { value: NewsletterLocale; label: string }[] = [
  { value: 'de', label: 'Němčina' },
  { value: 'en', label: 'Angličtina' },
  { value: 'cs', label: 'Čeština' },
]

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

const ERROR_MESSAGES: Record<string, string> = {
  bad_request: 'Neplatný požadavek.',
  not_found: 'Newsletter nebyl nalezen.',
  not_draft: 'Akci lze provést jen u konceptu.',
  no_segment: 'Před schválením vyberte publikum.',
  empty_body: 'Newsletter nemá obsah.',
  not_approved: 'Odeslat lze jen schválený newsletter.',
  already_sent: 'Newsletter už byl odeslán.',
  no_recipients: 'Definici segmentu neodpovídají žádné kontakty s opt-in — není komu odeslat.',
  internal_only: 'Testovací odeslání je možné jen na adresy @ensanahotels.com nebo @marienbad.com.',
  mail_not_configured: 'Odesílání e-mailů zatím není nakonfigurováno.',
  forbidden: 'Na tuto akci nemáte oprávnění.',
}

function errorMessage(data: unknown, fallback: string): string {
  const err = data as ApiErrorData | null
  if (err?.message) return err.message
  if (err?.error && ERROR_MESSAGES[err.error]) return ERROR_MESSAGES[err.error]
  return fallback
}

function statusChipStyle(status: NewsletterStatus): { backgroundColor: string; color: string } {
  const color = STATUS_COLORS[status]
  return { backgroundColor: `${color}1F`, color }
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function formatRate(value: number | null): string {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(1)} %`
}

const inputClass =
  'w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]'
const labelClass = 'block text-sm font-medium text-[#1C2B33] mb-1.5'

/** Formulář pro založení nového konceptu — bez těla, to se doladí v detailu. */
function NewCreateForm() {
  const [subject, setSubject] = useState('')
  const [preheader, setPreheader] = useState('')
  const [locale, setLocale] = useState<NewsletterLocale>('de')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!subject.trim()) {
      setError('Vyplňte předmět.')
      return
    }
    setSubmitting(true)
    setError(null)
    const res = await portalFetch<CreateResponse>('/api/portal/newsletters', {
      method: 'POST',
      body: { subject: subject.trim(), preheader: preheader.trim() || undefined, locale },
    })
    setSubmitting(false)
    if (!res.ok) {
      setError(errorMessage(res.data, 'Koncept se nepodařilo založit.'))
      return
    }
    window.location.href = `/portal/newsletters/${res.data.id}`
  }

  return (
    <form onSubmit={handleSubmit} className="portal-card space-y-4 p-6">
      <div>
        <label className={labelClass} htmlFor="nl_subject">Předmět</label>
        <input
          id="nl_subject"
          value={subject}
          onChange={(e) => setSubject(e.currentTarget.value)}
          maxLength={300}
          required
          className={inputClass}
          placeholder="Novinky ze Mariánských Lázní"
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="nl_preheader">Preheader</label>
        <input
          id="nl_preheader"
          value={preheader}
          onChange={(e) => setPreheader(e.currentTarget.value)}
          maxLength={300}
          className={inputClass}
          placeholder="Krátký text zobrazený vedle předmětu ve schránce"
        />
      </div>
      <div className="max-w-xs">
        <label className={labelClass} htmlFor="nl_locale">Jazyk</label>
        <select
          id="nl_locale"
          value={locale}
          onChange={(e) => setLocale(e.currentTarget.value as NewsletterLocale)}
          className={inputClass}
        >
          {LOCALE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <a href="/portal/newsletters" className="rounded-full border border-[#0E6EA8]/40 px-5 py-2.5 text-sm font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10">
          Zrušit
        </a>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-[#E8A400] px-5 py-2.5 text-sm font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting && <span className="portal-spinner" aria-hidden="true" />}
          Vytvořit koncept
        </button>
      </div>
    </form>
  )
}

interface NewsletterDetailViewProps {
  newsletterId: string
  role: PortalRole
}

function NewsletterDetailView({ newsletterId, role }: NewsletterDetailViewProps) {
  const canEditText = role === 'owner' || role === 'editor'
  const canApprove = role === 'owner'
  const canSend = role === 'owner'

  const [data, setData] = useState<NewsletterDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Editace textu
  const [subject, setSubject] = useState('')
  const [preheader, setPreheader] = useState('')
  const [locale, setLocale] = useState<NewsletterLocale>('de')
  const [html, setHtml] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  // Testovací odeslání
  const [testTo, setTestTo] = useState('')
  const [testSending, setTestSending] = useState(false)
  const [testError, setTestError] = useState<string | null>(null)
  const [testNotice, setTestNotice] = useState<string | null>(null)

  // Schválení / odeslání
  const [approving, setApproving] = useState(false)
  const [approveError, setApproveError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sendNotice, setSendNotice] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    const res = await portalFetch<NewsletterDetailResponse>(`/api/portal/newsletters/${newsletterId}`, { method: 'GET' })
    if (res.status === 404) {
      setNotFound(true)
      setLoading(false)
      return
    }
    if (!res.ok) {
      setLoadError('Newsletter se nepodařilo načíst.')
      setLoading(false)
      return
    }
    setData(res.data)
    setSubject(res.data.newsletter.subject)
    setPreheader(res.data.newsletter.preheader ?? '')
    setLocale(res.data.newsletter.locale)
    setHtml(res.data.newsletter.html_body)
    setLoading(false)
  }, [newsletterId])

  useEffect(() => {
    load()
  }, [load])

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    setSaveNotice(null)
    const res = await portalFetch<{ ok: boolean }>(`/api/portal/newsletters/${newsletterId}`, {
      method: 'PATCH',
      body: { subject: subject.trim(), preheader: preheader.trim() || null, locale, html },
    })
    setSaving(false)
    if (!res.ok) {
      setSaveError(errorMessage(res.data, 'Uložení se nepodařilo.'))
      return
    }
    setSaveNotice('Uloženo.')
    await load()
  }

  async function handleTestSend() {
    setTestSending(true)
    setTestError(null)
    setTestNotice(null)
    const to = testTo.trim()
    const res = await portalFetch<{ ok: boolean }>(`/api/portal/newsletters/${newsletterId}/test-send`, {
      method: 'POST',
      body: { to },
    })
    setTestSending(false)
    if (!res.ok) {
      setTestError(errorMessage(res.data, 'Testovací odeslání se nepodařilo.'))
      return
    }
    setTestNotice(`Testovací e-mail odeslán na ${to}.`)
  }

  async function handleApprove() {
    if (!confirm('Opravdu chcete newsletter schválit? Text se po schválení zamkne.')) return
    setApproving(true)
    setApproveError(null)
    const res = await portalFetch<{ ok: boolean }>(`/api/portal/newsletters/${newsletterId}/approve`, { method: 'POST' })
    setApproving(false)
    if (!res.ok) {
      setApproveError(errorMessage(res.data, 'Schválení se nepodařilo.'))
      return
    }
    await load()
  }

  async function handleSend() {
    if (!confirm('Newsletter se odešle přes MailerLite do skupin B2B. Akce je nevratná.')) return
    setSending(true)
    setSendError(null)
    setSendNotice(null)
    const res = await portalFetch<SendResponse>(`/api/portal/newsletters/${newsletterId}/send`, { method: 'POST' })
    setSending(false)
    if (!res.ok) {
      setSendError(errorMessage(res.data, 'Odeslání se nepodařilo.'))
      return
    }
    setSendNotice(`Odesláno — kampaň ${res.data.campaign_id}, ${res.data.recipients} příjemců.`)
    await load()
  }

  if (loading) {
    return <p className="text-sm text-[#5F6B72]">Načítám…</p>
  }
  if (notFound) {
    return <p className="text-sm text-[#B3264F]">Newsletter nebyl nalezen.</p>
  }
  if (loadError || !data) {
    return <p className="text-sm text-[#B3264F]">{loadError ?? 'Newsletter se nepodařilo načíst.'}</p>
  }

  const { newsletter, recipient_count, stats } = data
  const isDraft = newsletter.status === 'draft'
  const isApproved = newsletter.status === 'approved'
  const isSent = newsletter.status === 'sent'
  const displayedRecipientCount = isSent ? newsletter.recipients_count : recipient_count
  const showEditForm = canEditText && isDraft

  return (
    <div className="space-y-6">
      <div className="portal-card space-y-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#004F71]">{newsletter.subject}</h1>
            <p className="mt-1 text-sm text-[#5F6B72]">{newsletter.slug}</p>
          </div>
          <span className="portal-badge" style={statusChipStyle(newsletter.status)}>
            {STATUS_LABELS[newsletter.status]}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-beige-300 pt-4 sm:grid-cols-4">
          <div>
            <dt className="portal-label">Vytvořeno</dt>
            <dd className="mt-1 text-sm text-[#1C2B33]">
              {formatDate(newsletter.created_at)}
              {newsletter.created_via === 'intake' && (
                <span
                  className="portal-badge ml-2"
                  style={{ backgroundColor: 'rgba(160,0,90,0.12)', color: '#A0005A' }}
                >
                  Claude
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="portal-label">Schváleno</dt>
            <dd className="mt-1 text-sm text-[#1C2B33]">{formatDate(newsletter.approved_at)}</dd>
          </div>
          <div>
            <dt className="portal-label">Odesláno</dt>
            <dd className="mt-1 text-sm text-[#1C2B33]">{formatDate(newsletter.sent_at)}</dd>
          </div>
          <div>
            <dt className="portal-label">Příjemců</dt>
            <dd className="mt-1 text-sm text-[#1C2B33]">{displayedRecipientCount ?? '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="portal-card space-y-4 p-6">
        <h2 className="font-heading text-lg font-semibold text-[#004F71]">Náhled</h2>
        <NewsletterPreview html={newsletter.html_body} plain={newsletter.plain_body} />
      </div>

      <div className="portal-card space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold text-[#004F71]">Text</h2>
          {!showEditForm && !isDraft && <p className="text-sm text-[#5F6B72]">Text je po schválení zamčený.</p>}
        </div>

        {showEditForm && (
          <div className="space-y-4">
            <div>
              <label className={labelClass} htmlFor="ed_subject">Předmět</label>
              <input
                id="ed_subject"
                value={subject}
                onChange={(e) => setSubject(e.currentTarget.value)}
                maxLength={300}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="ed_preheader">Preheader</label>
              <input
                id="ed_preheader"
                value={preheader}
                onChange={(e) => setPreheader(e.currentTarget.value)}
                maxLength={300}
                className={inputClass}
              />
            </div>
            <div className="max-w-xs">
              <label className={labelClass} htmlFor="ed_locale">Jazyk</label>
              <select
                id="ed_locale"
                value={locale}
                onChange={(e) => setLocale(e.currentTarget.value as NewsletterLocale)}
                className={inputClass}
              >
                {LOCALE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="ed_html">HTML</label>
              <textarea
                id="ed_html"
                value={html}
                onChange={(e) => setHtml(e.currentTarget.value)}
                rows={16}
                spellCheck={false}
                className={`${inputClass} font-mono text-xs leading-relaxed`}
              />
            </div>

            {saveError && (
              <div role="alert" className="rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
                {saveError}
              </div>
            )}
            {saveNotice && <p className="text-sm text-[#1E7A4F]">{saveNotice}</p>}

            <div className="flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-full bg-[#E8A400] px-5 py-2.5 text-sm font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {saving && <span className="portal-spinner" aria-hidden="true" />}
                Uložit
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="portal-card space-y-4 p-6">
        <h2 className="font-heading text-lg font-semibold text-[#004F71]">Publikum</h2>
        <SegmentPicker
          newsletterId={newsletterId}
          initialSegment={newsletter.segment_definition}
          canEdit={canEditText && isDraft}
          onSaved={() => load()}
        />
      </div>

      {canEditText && (
        <div className="portal-card space-y-3 p-6">
          <h2 className="font-heading text-lg font-semibold text-[#004F71]">Testovací odeslání</h2>
          <p className="text-sm text-[#5F6B72]">Jen na interní adresy @ensanahotels.com nebo @marienbad.com.</p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[260px] flex-1">
              <label className={labelClass} htmlFor="test_to">E-mail</label>
              <input
                id="test_to"
                type="email"
                value={testTo}
                onChange={(e) => setTestTo(e.currentTarget.value)}
                placeholder="jmeno@ensanahotels.com"
                className={inputClass}
              />
            </div>
            <button
              type="button"
              disabled={testSending || !testTo.trim()}
              onClick={handleTestSend}
              className="inline-flex items-center gap-2 rounded-full border border-[#0E6EA8]/40 px-5 py-2.5 text-sm font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10 disabled:opacity-60"
            >
              {testSending && <span className="portal-spinner" aria-hidden="true" />}
              Odeslat test
            </button>
          </div>
          {testError && <p className="text-sm text-[#B3264F]">{testError}</p>}
          {testNotice && <p className="text-sm text-[#1E7A4F]">{testNotice}</p>}
        </div>
      )}

      {canApprove && isDraft && (
        <div className="portal-card space-y-3 p-6">
          <h2 className="font-heading text-lg font-semibold text-[#004F71]">Schválení</h2>
          <p className="text-sm text-[#5F6B72]">Bez schválení nejde newsletter odeslat. Po schválení se text zamkne.</p>
          <button
            type="button"
            disabled={approving}
            onClick={handleApprove}
            className="inline-flex items-center gap-2 rounded-full bg-[#1E7A4F] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {approving && <span className="portal-spinner" aria-hidden="true" />}
            Schválit
          </button>
          {approveError && <p className="text-sm text-[#B3264F]">{approveError}</p>}
        </div>
      )}

      {canSend && isApproved && (
        <div className="portal-card space-y-3 border-2 border-[#E8A400]/50 p-6">
          <h2 className="font-heading text-lg font-semibold text-[#004F71]">Odeslání</h2>
          <p className="text-sm text-[#5F6B72]">Odešle se přes MailerLite do skupin B2B podle vybraného publika. Akce je nevratná.</p>
          <button
            type="button"
            disabled={sending}
            onClick={handleSend}
            className="inline-flex items-center gap-2 rounded-full bg-[#B3264F] px-6 py-3 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {sending && <span className="portal-spinner" aria-hidden="true" />}
            Odeslat {displayedRecipientCount ?? '0'} příjemcům
          </button>
          {sendError && <p className="text-sm text-[#B3264F]">{sendError}</p>}
          {sendNotice && <p className="text-sm text-[#1E7A4F]">{sendNotice}</p>}
        </div>
      )}

      {isSent && newsletter.mailerlite_campaign_id && (
        <div className="portal-card p-6 text-sm text-[#5F6B72]">
          Odesláno přes MailerLite — kampaň <span className="font-mono text-[#1C2B33]">{newsletter.mailerlite_campaign_id}</span>.
        </div>
      )}

      <div className="portal-card space-y-4 p-6">
        <h2 className="font-heading text-lg font-semibold text-[#004F71]">Statistiky</h2>
        {stats.length === 0 ? (
          <p className="text-sm text-[#5F6B72]">Statistiky se sbírají měsíčně (fáze 4).</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
                  <th className="py-2 pr-3 font-medium">Zjištěno</th>
                  <th className="py-2 pr-3 font-medium">Odesláno</th>
                  <th className="py-2 pr-3 font-medium">Otevření</th>
                  <th className="py-2 pr-3 font-medium">Prokliky</th>
                  <th className="py-2 pr-3 font-medium">CTOR</th>
                  <th className="py-2 pr-3 font-medium">Odhlášení</th>
                  <th className="py-2 pr-3 font-medium">Spam</th>
                  <th className="py-2 pr-3 font-medium">Bounce</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.id} className="border-b border-beige-300">
                    <td className="py-2.5 pr-3 whitespace-nowrap text-[#5F6B72]">{formatDate(s.fetched_at)}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{s.sent ?? '—'}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{formatRate(s.open_rate)}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{formatRate(s.click_rate)}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{formatRate(s.click_to_open_rate)}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{s.unsubscribes_count ?? '—'}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{s.spam_count ?? '—'}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{(s.hard_bounces_count ?? 0) + (s.soft_bounces_count ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default function NewsletterEditor({ newsletterId, role }: NewsletterEditorProps) {
  if (!newsletterId) {
    return <NewCreateForm />
  }
  return <NewsletterDetailView newsletterId={newsletterId} role={role} />
}
