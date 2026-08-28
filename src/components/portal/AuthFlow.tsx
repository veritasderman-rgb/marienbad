import { useState } from 'react'
import type { FormEvent } from 'react'
import { portalFetch } from './api'

type Mode = 'login' | 'invite'

interface Props {
  mode: Mode
  /** Pouze pro mode="invite" — token z URL /portal/invite/[token]. */
  inviteToken?: string
  /** Kam přesměrovat po dokončení přihlášení, pokud API redirect nevrátí. */
  fallbackRedirect?: string
}

type Step =
  | { kind: 'credentials' }
  | { kind: 'invite-form' }
  | { kind: 'totp'; state: string }
  | { kind: 'totp-setup-init'; state: string }
  | { kind: 'totp-setup-verify'; state: string; secret: string; qrDataUrl: string }
  | { kind: 'done'; redirect: string }

function errorMessage(status: number, data: any): string {
  const error = data?.error
  if (status === 401 && error === 'invalid_credentials') return 'Neplatný e-mail nebo heslo.'
  if (status === 401 && error === 'invalid_code') return 'Neplatný kód. Zkuste to znovu.'
  if (status === 401 && (error === 'state_expired' || error === 'invalid')) {
    return 'Relace vypršela, zkuste se přihlásit znovu.'
  }
  if (status === 429 && error === 'too_many_attempts') {
    const retry = Number(data?.retry_after ?? 0)
    return `Příliš mnoho pokusů, zkuste to za ${retry} s.`
  }
  if (status === 400 && error === 'invalid_token') return 'Odkaz je neplatný nebo vypršel.'
  if (status === 400 && (error === 'weak_password' || error === 'pwned_password')) {
    return data?.message || 'Heslo nesplňuje bezpečnostní požadavky.'
  }
  if (data?.message) return String(data.message)
  return 'Něco se nepovedlo, zkuste to prosím znovu.'
}

export default function AuthFlow({ mode, inviteToken, fallbackRedirect = '/portal' }: Props) {
  const [step, setStep] = useState<Step>(mode === 'invite' ? { kind: 'invite-form' } : { kind: 'credentials' })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function submitLogin(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const res = await portalFetch('/api/portal/auth/login', { body: { email, password } })
      if (!res.ok) {
        setError(errorMessage(res.status, res.data))
        return
      }
      if (res.data.status === 'totp') {
        setStep({ kind: 'totp', state: res.data.state })
      } else if (res.data.status === 'totp_setup') {
        setStep({ kind: 'totp-setup-init', state: res.data.state })
      } else {
        setError('Neočekávaná odpověď serveru.')
      }
    } catch {
      setError('Spojení se serverem selhalo. Zkuste to prosím znovu.')
    } finally {
      setPending(false)
    }
  }

  async function submitInvite(e: FormEvent) {
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
      const res = await portalFetch('/api/portal/auth/invite-accept', {
        body: { token: inviteToken, password, display_name: displayName },
      })
      if (!res.ok) {
        setError(errorMessage(res.status, res.data))
        return
      }
      if (res.data.status === 'totp_setup') {
        setStep({ kind: 'totp-setup-init', state: res.data.state })
      } else {
        setError('Neočekávaná odpověď serveru.')
      }
    } catch {
      setError('Spojení se serverem selhalo. Zkuste to prosím znovu.')
    } finally {
      setPending(false)
    }
  }

  async function submitTotp(e: FormEvent) {
    e.preventDefault()
    if (step.kind !== 'totp') return
    setError(null)
    setPending(true)
    try {
      const res = await portalFetch('/api/portal/auth/totp', { body: { state: step.state, code } })
      if (!res.ok) {
        setError(errorMessage(res.status, res.data))
        return
      }
      const redirect = res.data.redirect || fallbackRedirect
      setStep({ kind: 'done', redirect })
      window.location.href = redirect
    } catch {
      setError('Spojení se serverem selhalo. Zkuste to prosím znovu.')
    } finally {
      setPending(false)
    }
  }

  async function startTotpSetup(state: string) {
    setError(null)
    setPending(true)
    try {
      const res = await portalFetch('/api/portal/auth/totp-setup', { body: { state } })
      if (!res.ok) {
        setError(errorMessage(res.status, res.data))
        return
      }
      setStep({
        kind: 'totp-setup-verify',
        state: res.data.state,
        secret: res.data.secret,
        qrDataUrl: res.data.qrDataUrl,
      })
    } catch {
      setError('Spojení se serverem selhalo. Zkuste to prosím znovu.')
    } finally {
      setPending(false)
    }
  }

  async function submitTotpSetupVerify(e: FormEvent) {
    e.preventDefault()
    if (step.kind !== 'totp-setup-verify') return
    setError(null)
    setPending(true)
    try {
      const res = await portalFetch('/api/portal/auth/totp-setup', { body: { state: step.state, code } })
      if (!res.ok) {
        setError(errorMessage(res.status, res.data))
        return
      }
      const redirect = res.data.redirect || fallbackRedirect
      setStep({ kind: 'done', redirect })
      window.location.href = redirect
    } catch {
      setError('Spojení se serverem selhalo. Zkuste to prosím znovu.')
    } finally {
      setPending(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] placeholder:text-[#5F6B72]/70 focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]'
  const labelClass = 'block text-sm font-medium text-[#1C2B33] mb-1.5'
  const primaryBtnClass =
    'w-full rounded-full bg-[#E8A400] px-4 py-2.5 font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'

  return (
    <div>
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]"
        >
          {error}
        </div>
      )}

      {step.kind === 'credentials' && (
        <form onSubmit={submitLogin} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">Heslo</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={pending} className={primaryBtnClass}>
            {pending && <span className="portal-spinner" aria-hidden="true" />}
            Přihlásit se
          </button>
          <p className="text-center text-sm">
            <a href="/portal/forgot" className="text-[#0E6EA8] hover:underline">Zapomenuté heslo</a>
          </p>
        </form>
      )}

      {step.kind === 'invite-form' && (
        <form onSubmit={submitInvite} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="display_name">Jméno</label>
            <input
              id="display_name"
              type="text"
              autoComplete="name"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.currentTarget.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">Heslo (min. 12 znaků)</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="password_confirm">Potvrzení hesla</label>
            <input
              id="password_confirm"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={pending} className={primaryBtnClass}>
            {pending && <span className="portal-spinner" aria-hidden="true" />}
            Nastavit účet
          </button>
        </form>
      )}

      {step.kind === 'totp' && (
        <form onSubmit={submitTotp} className="space-y-4">
          <p className="text-sm text-[#5F6B72]">Zadejte 6místný kód z vaší autentizační aplikace.</p>
          <div>
            <label className={labelClass} htmlFor="code">Ověřovací kód</label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.currentTarget.value.replace(/\D/g, ''))}
              className={`${inputClass} text-center tracking-[0.4em] text-lg font-semibold`}
            />
          </div>
          <button type="submit" disabled={pending} className={primaryBtnClass}>
            {pending && <span className="portal-spinner" aria-hidden="true" />}
            Ověřit a přihlásit
          </button>
        </form>
      )}

      {step.kind === 'totp-setup-init' && (
        <div className="space-y-4 text-center">
          <p className="text-sm text-[#5F6B72]">
            Před prvním přihlášením je potřeba nastavit dvoufázové ověření (TOTP).
          </p>
          <button
            type="button"
            onClick={() => startTotpSetup(step.state)}
            disabled={pending}
            className={primaryBtnClass}
          >
            {pending && <span className="portal-spinner" aria-hidden="true" />}
            Nastavit dvoufázové ověření
          </button>
        </div>
      )}

      {step.kind === 'totp-setup-verify' && (
        <form onSubmit={submitTotpSetupVerify} className="space-y-4">
          <p className="text-sm text-[#5F6B72]">
            Naskenujte QR kód v aplikaci (Google Authenticator, Authy…) a zadejte vygenerovaný kód.
          </p>
          <div className="flex justify-center">
            <img
              src={step.qrDataUrl}
              alt="QR kód pro nastavení dvoufázového ověření"
              width={220}
              height={220}
              className="rounded-lg border border-beige-400"
            />
          </div>
          <div className="text-center">
            <p className="portal-label mb-1">Ruční klíč</p>
            <code className="break-all rounded bg-beige-200 px-2 py-1 text-xs text-[#1C2B33]">{step.secret}</code>
          </div>
          <div>
            <label className={labelClass} htmlFor="setup_code">Ověřovací kód</label>
            <input
              id="setup_code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.currentTarget.value.replace(/\D/g, ''))}
              className={`${inputClass} text-center tracking-[0.4em] text-lg font-semibold`}
            />
          </div>
          <button type="submit" disabled={pending} className={primaryBtnClass}>
            {pending && <span className="portal-spinner" aria-hidden="true" />}
            Dokončit nastavení
          </button>
        </form>
      )}

      {step.kind === 'done' && (
        <p className="text-center text-sm text-[#5F6B72]">Přesměrovávám…</p>
      )}
    </div>
  )
}
