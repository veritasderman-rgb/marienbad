import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { portalFetch } from './api'
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
import ContactForm from './ContactForm'
import type { ContactRow } from './ContactForm'
import InteractionForm from './InteractionForm'
import { INTERACTION_TYPE_ICONS, INTERACTION_TYPE_LABELS } from './InteractionForm'
import type { InteractionRow } from './InteractionForm'

type PortalRole = 'owner' | 'editor' | 'analyst' | 'viewer'

interface OwnerRef {
  id: string
  display_name: string
}

interface PartnerRecord {
  id: string
  name: string
  legal_name?: string | null
  ico?: string | null
  dic?: string | null
  country: string
  city?: string | null
  website?: string | null
  segment: Segment
  tier?: Tier | null
  status: PartnerStatus
  languages?: string | null
  notes?: string | null
  owner?: OwnerRef | null
  updated_at?: string
}

interface PartnerDetailResponse {
  partner: PartnerRecord
  contacts: ContactRow[]
  interactions: InteractionRow[]
}

interface PartnerDetailProps {
  partnerId: string
  role: PortalRole
}

const inputClass =
  'w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]'
const labelClass = 'block text-sm font-medium text-[#1C2B33] mb-1.5'

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function segmentChipStyle(segment: Segment): { backgroundColor: string; color: string } {
  const color = SEGMENT_COLORS[segment]
  return { backgroundColor: `${color}1F`, color }
}

function contactDisplayName(c: ContactRow): string {
  return [c.first_name, c.last_name].filter(Boolean).join(' ') || '(bez jména)'
}

export default function PartnerDetail({ partnerId, role }: PartnerDetailProps) {
  const canWrite = role === 'owner' || role === 'editor'
  const canDelete = role === 'owner'

  const [data, setData] = useState<PartnerDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [forbidden, setForbidden] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editingPartner, setEditingPartner] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editPending, setEditPending] = useState(false)
  const [form, setForm] = useState<Partial<PartnerRecord>>({})

  const [addingContact, setAddingContact] = useState(false)
  const [editingContactId, setEditingContactId] = useState<string | null>(null)
  const [addingInteraction, setAddingInteraction] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setNotFound(false)
    setForbidden(false)
    setError(null)
    const res = await portalFetch<PartnerDetailResponse>(`/api/portal/partners/${partnerId}`, { method: 'GET' })
    if (!res.ok) {
      if (res.status === 404) setNotFound(true)
      else if (res.status === 403) setForbidden(true)
      else setError('Detail partnera se nepodařilo načíst.')
      setLoading(false)
      return
    }
    setData(res.data)
    setForm(res.data.partner)
    setLoading(false)
  }, [partnerId])

  useEffect(() => {
    load()
  }, [load])

  async function handleSavePartner(e: FormEvent) {
    e.preventDefault()
    if (!data) return
    setEditError(null)
    setEditPending(true)
    try {
      const res = await portalFetch(`/api/portal/partners/${partnerId}`, {
        method: 'PATCH',
        // vyprázdněná pole jako null — undefined by JSON.stringify zahodil
        // a PATCH by starou hodnotu tiše ponechal
        body: {
          name: form.name,
          legal_name: form.legal_name || null,
          ico: form.ico || null,
          dic: form.dic || null,
          country: form.country,
          city: form.city || null,
          website: form.website || null,
          segment: form.segment,
          tier: form.tier || null,
          status: form.status,
          notes: form.notes || null,
        },
      })
      if (!res.ok) {
        if (res.status === 409 && (res.data as any)?.error === 'ico_exists') {
          setEditError('Partner s tímto IČO už existuje.')
        } else {
          setEditError((res.data as any)?.message || 'Změny se nepodařilo uložit.')
        }
        return
      }
      setEditingPartner(false)
      await load()
    } catch {
      setEditError('Spojení se serverem selhalo.')
    } finally {
      setEditPending(false)
    }
  }

  async function handleDeletePartner() {
    if (!confirm('Opravdu chcete partnera nevratně smazat?')) return
    setActionError(null)
    const res = await portalFetch(`/api/portal/partners/${partnerId}`, { method: 'DELETE' })
    if (!res.ok) {
      setActionError('Partnera se nepodařilo smazat.')
      return
    }
    window.location.href = '/portal/partners'
  }

  async function handleAnonymizeContact(contactId: string) {
    if (!confirm('Kontakt bude nevratně anonymizován, agregáty zůstanou.')) return
    setActionError(null)
    const res = await portalFetch(`/api/portal/contacts/${contactId}`, { method: 'POST', body: { action: 'anonymize' } })
    if (!res.ok) {
      setActionError('Kontakt se nepodařilo anonymizovat.')
      return
    }
    await load()
  }

  async function handleDeleteContact(contactId: string) {
    if (!confirm('Opravdu chcete kontakt nevratně smazat?')) return
    setActionError(null)
    const res = await portalFetch(`/api/portal/contacts/${contactId}`, { method: 'DELETE' })
    if (!res.ok) {
      setActionError('Kontakt se nepodařilo smazat.')
      return
    }
    await load()
  }

  async function handleDeleteInteraction(interactionId: string) {
    if (!confirm('Opravdu chcete záznam komunikace nevratně smazat?')) return
    setActionError(null)
    const res = await portalFetch(`/api/portal/interactions/${interactionId}`, { method: 'DELETE' })
    if (!res.ok) {
      setActionError('Záznam se nepodařilo smazat.')
      return
    }
    await load()
  }

  if (loading) {
    return <div className="portal-card p-6 text-sm text-[#5F6B72]">Načítám…</div>
  }

  if (notFound) {
    return (
      <div className="portal-card p-6">
        <p className="text-sm text-[#B3264F]">Partner nebyl nalezen.</p>
        <a href="/portal/partners" className="mt-2 inline-block text-sm font-semibold text-[#0E6EA8] hover:underline">
          ← Zpět na seznam partnerů
        </a>
      </div>
    )
  }

  if (forbidden) {
    return (
      <div className="portal-card p-6">
        <p className="text-sm text-[#B3264F]">Na tuto akci nemáte oprávnění.</p>
        <a href="/portal/partners" className="mt-2 inline-block text-sm font-semibold text-[#0E6EA8] hover:underline">
          ← Zpět na seznam partnerů
        </a>
      </div>
    )
  }

  if (error || !data) {
    return <div className="portal-card p-6 text-sm text-[#B3264F]">{error ?? 'Nastala chyba.'}</div>
  }

  const { partner, contacts, interactions } = data

  return (
    <div className="space-y-6">
      <div className="portal-card p-6">
        {!editingPartner ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-[#004F71]">{partner.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="portal-badge" style={segmentChipStyle(partner.segment)}>
                    {SEGMENT_LABELS[partner.segment]}
                  </span>
                  {partner.tier && <span className="portal-badge portal-badge-viewer">Tier {partner.tier}</span>}
                  <span className={`portal-badge ${STATUS_BADGE_CLASS[partner.status]}`}>{STATUS_LABELS[partner.status]}</span>
                </div>
              </div>
              {canWrite && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForm(partner)
                      setEditingPartner(true)
                    }}
                    className="rounded-full border border-[#0E6EA8]/40 px-4 py-2 text-sm font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10"
                  >
                    Upravit
                  </button>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={handleDeletePartner}
                      className="rounded-full border border-[#B3264F]/40 px-4 py-2 text-sm font-semibold text-[#B3264F] hover:bg-[#B3264F]/10"
                    >
                      Smazat
                    </button>
                  )}
                </div>
              )}
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-[#5F6B72]">IČO</dt>
                <dd className="text-[#1C2B33]">{partner.ico || '—'}</dd>
              </div>
              <div>
                <dt className="text-[#5F6B72]">DIČ</dt>
                <dd className="text-[#1C2B33]">{partner.dic || '—'}</dd>
              </div>
              <div>
                <dt className="text-[#5F6B72]">Web</dt>
                <dd className="text-[#1C2B33]">
                  {partner.website ? (
                    <a href={partner.website} target="_blank" rel="noreferrer" className="text-[#0E6EA8] hover:underline">
                      {partner.website}
                    </a>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[#5F6B72]">Město / Země</dt>
                <dd className="text-[#1C2B33]">
                  {partner.city ? `${partner.city}, ` : ''}
                  {partner.country}
                </dd>
              </div>
              <div>
                <dt className="text-[#5F6B72]">Vlastník vztahu</dt>
                <dd className="text-[#1C2B33]">{partner.owner?.display_name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-[#5F6B72]">Poslední změna</dt>
                <dd className="text-[#1C2B33]">{formatDate(partner.updated_at)}</dd>
              </div>
            </dl>
            {partner.notes && (
              <p className="mt-4 rounded-lg bg-beige-100 p-3 text-sm text-[#1C2B33]">{partner.notes}</p>
            )}
          </>
        ) : (
          <form onSubmit={handleSavePartner} className="space-y-4">
            <h2 className="font-heading text-lg font-semibold text-[#004F71]">Upravit partnera</h2>
            {editError && (
              <div role="alert" className="rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
                {editError}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="ed_name">Název *</label>
                <input id="ed_name" required value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.currentTarget.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="ed_legal_name">Obchodní jméno</label>
                <input id="ed_legal_name" value={form.legal_name ?? ''} onChange={(e) => setForm((f) => ({ ...f, legal_name: e.currentTarget.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="ed_ico">IČO</label>
                <input id="ed_ico" value={form.ico ?? ''} onChange={(e) => setForm((f) => ({ ...f, ico: e.currentTarget.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="ed_dic">DIČ</label>
                <input id="ed_dic" value={form.dic ?? ''} onChange={(e) => setForm((f) => ({ ...f, dic: e.currentTarget.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="ed_country">Země *</label>
                <input id="ed_country" required value={form.country ?? ''} onChange={(e) => setForm((f) => ({ ...f, country: e.currentTarget.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="ed_city">Město</label>
                <input id="ed_city" value={form.city ?? ''} onChange={(e) => setForm((f) => ({ ...f, city: e.currentTarget.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="ed_website">Web</label>
                <input id="ed_website" value={form.website ?? ''} onChange={(e) => setForm((f) => ({ ...f, website: e.currentTarget.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="ed_segment">Segment *</label>
                <select id="ed_segment" value={form.segment ?? 'other'} onChange={(e) => setForm((f) => ({ ...f, segment: e.currentTarget.value as Segment }))} className={inputClass}>
                  {SEGMENTS.map((s) => (
                    <option key={s} value={s}>{SEGMENT_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="ed_tier">Tier</label>
                <select id="ed_tier" value={form.tier ?? ''} onChange={(e) => setForm((f) => ({ ...f, tier: (e.currentTarget.value || undefined) as Tier | undefined }))} className={inputClass}>
                  <option value="">—</option>
                  {TIERS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="ed_status">Stav *</label>
                <select id="ed_status" value={form.status ?? 'prospect'} onChange={(e) => setForm((f) => ({ ...f, status: e.currentTarget.value as PartnerStatus }))} className={inputClass}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="ed_notes">Poznámka</label>
                <textarea id="ed_notes" value={form.notes ?? ''} onChange={(e) => setForm((f) => ({ ...f, notes: e.currentTarget.value }))} className={inputClass} rows={3} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={editPending} className="rounded-full bg-[#E8A400] px-5 py-2.5 font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60">
                {editPending ? 'Ukládám…' : 'Uložit změny'}
              </button>
              <button type="button" onClick={() => setEditingPartner(false)} disabled={editPending} className="rounded-full border border-beige-400 px-5 py-2.5 font-semibold text-[#5F6B72] hover:bg-beige-200 disabled:opacity-60">
                Zrušit
              </button>
            </div>
          </form>
        )}
      </div>

      {actionError && (
        <div role="alert" className="rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
          {actionError}
        </div>
      )}

      {/* Kontakty */}
      <div className="portal-card p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-[#004F71]">Kontakty</h2>
          {canWrite && !addingContact && (
            <button
              type="button"
              onClick={() => {
                setEditingContactId(null)
                setAddingContact(true)
              }}
              className="rounded-full bg-[#E8A400] px-4 py-2 text-sm font-semibold text-[#1C2B33] transition-opacity hover:opacity-90"
            >
              Přidat kontakt
            </button>
          )}
        </div>

        {addingContact && (
          <div className="mb-4">
            <ContactForm
              partnerId={partnerId}
              onCancel={() => setAddingContact(false)}
              onSaved={() => {
                setAddingContact(false)
                load()
              }}
            />
          </div>
        )}

        {contacts.length === 0 && !addingContact && (
          <p className="text-sm text-[#5F6B72]">Zatím žádné kontakty.</p>
        )}

        <div className="space-y-3">
          {contacts.map((c) =>
            editingContactId === c.id ? (
              <ContactForm
                key={c.id}
                partnerId={partnerId}
                contact={c}
                onCancel={() => setEditingContactId(null)}
                onSaved={() => {
                  setEditingContactId(null)
                  load()
                }}
              />
            ) : (
              <div key={c.id} className="rounded-lg border border-beige-300 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#1C2B33]">
                      {contactDisplayName(c)}
                      {c.position ? <span className="font-normal text-[#5F6B72]"> · {c.position}</span> : null}
                    </p>
                    <p className="mt-1 text-sm text-[#5F6B72]">
                      {c.email || '—'}
                      {c.phone ? ` · ${c.phone}` : ''}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.is_primary && <span className="portal-badge portal-badge-owner">hlavní</span>}
                      {c.anonymized_at ? (
                        <span className="portal-badge portal-badge-inactive">anonymizován</span>
                      ) : (
                        <span className={`portal-badge ${c.newsletter_opt_in ? 'portal-badge-active' : 'portal-badge-viewer'}`}>
                          newsletter {c.newsletter_opt_in ? '✓' : '✗'}
                        </span>
                      )}
                      {c.unsubscribed_at && !c.anonymized_at && (
                        <span className="portal-badge portal-badge-pending">odhlášen</span>
                      )}
                    </div>
                  </div>
                  {canWrite && !c.anonymized_at && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAddingContact(false)
                          setEditingContactId(c.id)
                        }}
                        className="rounded-full border border-[#0E6EA8]/40 px-3 py-1 text-xs font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10"
                      >
                        Upravit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAnonymizeContact(c.id)}
                        className="rounded-full border border-[#E8A400]/50 px-3 py-1 text-xs font-semibold text-[#8f6b00] hover:bg-[#E8A400]/10"
                      >
                        Anonymizovat
                      </button>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteContact(c.id)}
                          className="rounded-full border border-[#B3264F]/40 px-3 py-1 text-xs font-semibold text-[#B3264F] hover:bg-[#B3264F]/10"
                        >
                          Smazat
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Historie komunikace */}
      <div className="portal-card p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-[#004F71]">Historie komunikace</h2>
          {canWrite && !addingInteraction && (
            <button
              type="button"
              onClick={() => setAddingInteraction(true)}
              className="rounded-full bg-[#E8A400] px-4 py-2 text-sm font-semibold text-[#1C2B33] transition-opacity hover:opacity-90"
            >
              Přidat záznam
            </button>
          )}
        </div>

        {addingInteraction && (
          <div className="mb-4">
            <InteractionForm
              partnerId={partnerId}
              contacts={contacts}
              onCancel={() => setAddingInteraction(false)}
              onSaved={() => {
                setAddingInteraction(false)
                load()
              }}
            />
          </div>
        )}

        {interactions.length === 0 ? (
          <p className="text-sm text-[#5F6B72]">Zatím žádné záznamy komunikace.</p>
        ) : (
          <ol className="space-y-3 border-l-2 border-beige-400 pl-4">
            {interactions.map((it) => (
              <li key={it.id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.45rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs"
                  style={{ boxShadow: '0 0 0 2px #E5DCC9' }}
                >
                  {INTERACTION_TYPE_ICONS[it.type]}
                </span>
                <div className="rounded-lg border border-beige-300 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="portal-badge portal-badge-editor">{INTERACTION_TYPE_LABELS[it.type]}</span>
                      <span className="text-sm font-semibold text-[#1C2B33]">{it.subject}</span>
                    </div>
                    <span className="text-xs text-[#5F6B72]">{formatDate(it.occurred_at)}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#5F6B72]">
                    {it.contact_name ? `Kontakt: ${it.contact_name} · ` : ''}
                    {it.created_by_name ? `Zapsal(a): ${it.created_by_name}` : null}
                  </p>
                  {it.body && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-[#0E6EA8]">zobrazit text</summary>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-[#1C2B33]">{it.body}</p>
                    </details>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeleteInteraction(it.id)}
                      className="mt-2 rounded-full border border-[#B3264F]/40 px-3 py-1 text-xs font-semibold text-[#B3264F] hover:bg-[#B3264F]/10"
                    >
                      Smazat
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Výkonnost */}
      <div className="portal-card p-6">
        <h2 className="font-heading text-lg font-semibold text-[#004F71]">Výkonnost</h2>
        <p className="mt-2 text-sm text-[#5F6B72]">Graf výkonnosti partnera doplní fáze 5/6.</p>
      </div>
    </div>
  )
}
