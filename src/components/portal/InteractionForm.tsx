import { useState } from 'react'
import type { FormEvent } from 'react'
import { portalFetch } from './api'
import type { ContactRow } from './ContactForm'

export type InteractionType = 'call' | 'email' | 'meeting' | 'fair' | 'note' | 'other'

export interface InteractionRow {
  id: string
  type: InteractionType
  occurred_at: string
  subject: string
  body: string | null
  contact_name: string | null
  created_by_name: string | null
}

export const INTERACTION_TYPES: InteractionType[] = ['call', 'email', 'meeting', 'fair', 'note', 'other']

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  call: 'Telefonát',
  email: 'E-mail',
  meeting: 'Schůzka',
  fair: 'Veletrh',
  note: 'Poznámka',
  other: 'Jiné',
}

export const INTERACTION_TYPE_ICONS: Record<InteractionType, string> = {
  call: '📞',
  email: '✉️',
  meeting: '🤝',
  fair: '🎪',
  note: '📝',
  other: '•',
}

interface InteractionFormProps {
  partnerId: string
  contacts: ContactRow[]
  onCancel: () => void
  onSaved: () => void
}

const inputClass =
  'w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]'
const labelClass = 'block text-sm font-medium text-[#1C2B33] mb-1.5'

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function InteractionForm({ partnerId, contacts, onCancel, onSaved }: InteractionFormProps) {
  const [type, setType] = useState<InteractionType>('call')
  const [occurredAt, setOccurredAt] = useState(() => toDatetimeLocal(new Date()))
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [contactId, setContactId] = useState('')

  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const res = await portalFetch(`/api/portal/partners/${partnerId}/interactions`, {
        method: 'POST',
        body: {
          type,
          subject: subject.trim(),
          body: body.trim() || undefined,
          occurred_at: occurredAt ? new Date(occurredAt).toISOString() : undefined,
          contact_id: contactId || undefined,
        },
      })
      if (!res.ok) {
        setError((res.data as any)?.message || 'Interakci se nepodařilo uložit.')
        return
      }
      setSubject('')
      setBody('')
      onSaved()
    } catch {
      setError('Spojení se serverem selhalo.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="portal-card p-5">
      <h3 className="mb-3 font-heading text-base font-semibold text-[#004F71]">Nový záznam komunikace</h3>
      {error && (
        <div role="alert" className="mb-3 rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="if_type">Typ</label>
          <select id="if_type" value={type} onChange={(e) => setType(e.currentTarget.value as InteractionType)} className={inputClass}>
            {INTERACTION_TYPES.map((t) => (
              <option key={t} value={t}>{INTERACTION_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="if_occurred_at">Datum a čas</label>
          <input
            id="if_occurred_at"
            type="datetime-local"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.currentTarget.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="if_subject">Předmět *</label>
          <input id="if_subject" required value={subject} onChange={(e) => setSubject(e.currentTarget.value)} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="if_body">Poznámka</label>
          <textarea id="if_body" value={body} onChange={(e) => setBody(e.currentTarget.value)} className={inputClass} rows={3} />
        </div>
        {contacts.length > 0 && (
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="if_contact">Kontakt</label>
            <select id="if_contact" value={contactId} onChange={(e) => setContactId(e.currentTarget.value)} className={inputClass}>
              <option value="">— nevázáno na kontakt —</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {[c.first_name, c.last_name].filter(Boolean).join(' ') || c.email || c.id}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[#E8A400] px-5 py-2.5 font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? 'Ukládám…' : 'Uložit záznam'}
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
