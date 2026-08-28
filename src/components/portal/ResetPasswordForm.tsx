import { useState } from 'react'
import type { FormEvent } from 'react'
import { portalFetch } from './api'

interface Props {
  token: string
}

function errorMessage(status: number, data: any): string {
  const error = data?.error
  if (status === 400 && error === 'invalid_token') return 'Odkaz je neplatný nebo vypršel.'
  if (status === 400 && (error === 'weak_password' || error === 'pwned_password')) {
    return data?.message || 'Heslo nesplňuje bezpečnostní požadavky.'
  }
  if (status === 429 && error === 'too_many_attempts') {
    const retry = Number(data?.retry_after ?? 0)
    return `Příliš mnoho pokusů, zkuste to za ${retry} s.`
  }
  return 'Něco se nepovedlo, zkuste to prosím znovu.'
}

export default function ResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 12) {
      setError('Heslo musí mít alespoň 12 znaků.')
      return
    }
    if (password !== passwordConfirm) {
      setError('Hesla se neshodují.')
      return
    }
    setPending(true)
    try {
      const res = await portalFetch('/api/portal/auth/reset', { body: { token, password } })
      if (!res.ok) {
        setError(errorMessage(res.status, res.data))
        return
      }
      setDone(true)
    } catch {
      setError('Spojení se serverem selhalo. Zkuste to prosím znovu.')
    } finally {
      setPending(false)
    }
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-lg border border-[#1E7A4F]/30 bg-[#1E7A4F]/10 px-3.5 py-3 text-sm font-medium text-[#1E7A4F]">
          Heslo nastaveno
        </p>
        <a
          href="/portal/login"
          className="inline-block rounded-full bg-[#E8A400] px-5 py-2.5 font-semibold text-[#1C2B33] transition-opacity hover:opacity-90"
        >
          Přejít na přihlášení
        </a>
      </div>
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
        <label className="block text-sm font-medium text-[#1C2B33] mb-1.5" htmlFor="password">Nové heslo (min. 12 znaků)</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          className="w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1C2B33] mb-1.5" htmlFor="password_confirm">Potvrzení hesla</label>
        <input
          id="password_confirm"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
          className="w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#E8A400] px-4 py-2.5 font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {pending && <span className="portal-spinner" aria-hidden="true" />}
        Nastavit heslo
      </button>
    </form>
  )
}
