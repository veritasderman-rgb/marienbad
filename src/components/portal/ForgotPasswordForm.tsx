import { useState } from 'react'
import type { FormEvent } from 'react'
import { portalFetch } from './api'

/** Formulář žádosti o reset hesla — API vždy vrací {ok:true}, aby neprozrazovalo
 *  existenci účtu, takže po odeslání vždy zobrazíme stejnou zprávu. */
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const res = await portalFetch('/api/portal/auth/forgot', { body: { email } })
      if (res.status === 429) {
        const retry = Number((res.data as any)?.retry_after ?? 0)
        setError(`Příliš mnoho pokusů, zkuste to za ${retry} s.`)
        return
      }
      setSent(true)
    } catch {
      setError('Spojení se serverem selhalo. Zkuste to prosím znovu.')
    } finally {
      setPending(false)
    }
  }

  if (sent) {
    return (
      <p className="rounded-lg border border-[#1E7A4F]/30 bg-[#1E7A4F]/10 px-3.5 py-3 text-sm font-medium text-[#1E7A4F]">
        Pokud účet existuje, poslali jsme odkaz.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]"
        >
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-[#1C2B33] mb-1.5" htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          className="w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#E8A400] px-4 py-2.5 font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {pending && <span className="portal-spinner" aria-hidden="true" />}
        Odeslat odkaz
      </button>
    </form>
  )
}
