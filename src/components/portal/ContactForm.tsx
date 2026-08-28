import { useState } from 'react'
import type { FormEvent } from 'react'
import { portalFetch } from './api'

export interface ContactRow {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  position: string | null
  is_primary: boolean
  newsletter_opt_in: boolean
  unsubscribed_at: string | null
  anonymized_at: string | null
}

interface ContactFormProps {
  partnerId: string
  /** Vyplněno = editace existujícího kontaktu, jinak nový kontakt. */
  contact?: ContactRow
  onCancel: () => void
  onSaved: () => void
}

const inputClass =
  'w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]'
const labelClass = 'block text-sm font-medium text-[#1C2B33] mb-1.5'

export default function ContactForm({ partnerId, contact, onCancel, onSaved }: ContactFormProps) {
  const isEdit = !!contact
  const [firstName, setFirstName] = useState(contact?.first_name ?? '')
  const [lastName, setLastName] = useState(contact?.last_name ?? '')
  const [email, setEmail] = useState(contact?.email ?? '')
  const [phone, setPhone] = useState(contact?.phone ?? '')
  const [position, setPosition] = useState(contact?.position ?? '')
  const [isPrimary, setIsPrimary] = useState(contact?.is_primary ?? false)
  const [newsletterOptIn, setNewsletterOptIn] = useState(contact?.newsletter_opt_in ?? false)

  const [consentBasis, setConsentBasis] = useState('')
  const [optInSource, setOptInSource] = useState('')
  const [optInEvidence, setOptInEvidence] = useState('')

  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const basePayload = {
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        position: position.trim() || undefined,
        is_primary: isPrimary,
        newsletter_opt_in: newsletterOptIn,
      }

      if (isEdit) {
        const res = await portalFetch(`/api/portal/contacts/${contact!.id}`, {
          method: 'PATCH',
          body: basePayload,
        })
        if (!res.ok) {
          setError((res.data as any)?.message || 'Kontakt se nepodařilo uložit.')
          return
        }
      } else {
        const payload = {
          ...basePayload,
          ...(newsletterOptIn
            ? {
                lawful_basis: 'consent',
                consent_basis: consentBasis.trim() || undefined,
                opt_in_source: optInSource.trim() || undefined,
                opt_in_at: new Date().toISOString(),
                opt_in_evidence: optInEvidence.trim() || undefined,
              }
            : {}),
        }
        const res = await portalFetch(`/api/portal/partners/${partnerId}/contacts`, {
          method: 'POST',
          body: payload,
        })
        if (!res.ok) {
          setError((res.data as any)?.message || 'Kontakt se nepodařilo přidat.')
          return
        }
      }
      onSaved()
    } catch {
      setError('Spojení se serverem selhalo.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="portal-card p-5">
      <h3 className="mb-3 font-heading text-base font-semibold text-[#004F71]">
        {isEdit ? 'Upravit kontakt' : 'Nový kontakt'}
      </h3>
      {error && (
        <div role="alert" className="mb-3 rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="cf_first_name">Jméno</label>
          <input id="cf_first_name" value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="cf_last_name">Příjmení</label>
          <input id="cf_last_name" value={lastName} onChange={(e) => setLastName(e.currentTarget.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="cf_email">E-mail</label>
          <input id="cf_email" type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="cf_phone">Telefon</label>
          <input id="cf_phone" value={phone} onChange={(e) => setPhone(e.currentTarget.value)} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="cf_position">Pozice</label>
          <input id="cf_position" value={position} onChange={(e) => setPosition(e.currentTarget.value)} className={inputClass} />
        </div>
        <div className="flex items-center gap-2">
          <input id="cf_primary" type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.currentTarget.checked)} />
          <label htmlFor="cf_primary" className="text-sm text-[#1C2B33]">Hlavní kontakt</label>
        </div>
        <div className="flex items-center gap-2">
          <input id="cf_newsletter" type="checkbox" checked={newsletterOptIn} onChange={(e) => setNewsletterOptIn(e.currentTarget.checked)} />
          <label htmlFor="cf_newsletter" className="text-sm text-[#1C2B33]">Souhlas s newsletterem</label>
        </div>

        {!isEdit && newsletterOptIn && (
          <div className="sm:col-span-2 rounded-lg border border-beige-400 bg-beige-100 p-3">
            <p className="portal-label mb-2">Doklad souhlasu (GDPR)</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="cf_consent_basis">Základ souhlasu</label>
                <select id="cf_consent_basis" value={consentBasis} onChange={(e) => setConsentBasis(e.currentTarget.value)} className={inputClass}>
                  <option value="">— vyberte —</option>
                  <option value="lead_scanner">Čtečka leadů (souhlas u skenu)</option>
                  <option value="business_card">Vizitka</option>
                  <option value="explicit_signup">Výslovné přihlášení</option>
                  <option value="unknown">Neznámý / neurčitelný</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="cf_opt_in_source">Zdroj souhlasu</label>
                <input id="cf_opt_in_source" value={optInSource} onChange={(e) => setOptInSource(e.currentTarget.value)} className={inputClass} placeholder="např. CRM import" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="cf_opt_in_evidence">Poznámka k dokladu</label>
                <input id="cf_opt_in_evidence" value={optInEvidence} onChange={(e) => setOptInEvidence(e.currentTarget.value)} className={inputClass} />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[#E8A400] px-5 py-2.5 font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? 'Ukládám…' : 'Uložit'}
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
