import { useState } from 'react'
import { portalFetch } from './api'

/** Tlačítko „Odhlásit" v hlavičce portálu — samostatný ostrůvek, aby zbytek
 *  layoutu mohl zůstat čistě server-renderovaný (žádné inline skripty, CSP). */
export default function LogoutButton() {
  const [pending, setPending] = useState(false)

  async function handleLogout() {
    if (pending) return
    setPending(true)
    try {
      await portalFetch('/api/portal/auth/logout', { method: 'POST' })
    } finally {
      window.location.href = '/portal/login'
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="rounded-full border border-white/40 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
    >
      {pending ? 'Odhlašuji…' : 'Odhlásit'}
    </button>
  )
}
