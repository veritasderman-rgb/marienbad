import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { portalFetch } from './api'

type PortalRole = 'owner' | 'editor' | 'analyst' | 'viewer'

interface UserRow {
  id: string
  email: string
  display_name: string
  role: PortalRole
  is_active: boolean
  totp_enabled: boolean
  has_password: boolean
  last_login_at: string | null
  created_at: string
}

const ROLES: PortalRole[] = ['owner', 'editor', 'analyst', 'viewer']
const ROLE_LABELS: Record<PortalRole, string> = {
  owner: 'vlastník',
  editor: 'editor',
  analyst: 'analytik',
  viewer: 'divák',
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleString('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' })
}

function statusOf(user: UserRow): { label: string; className: string } {
  if (!user.has_password) return { label: 'čeká na pozvánku', className: 'portal-badge-pending' }
  if (!user.is_active) return { label: 'deaktivovaný', className: 'portal-badge-inactive' }
  return { label: 'aktivní', className: 'portal-badge-active' }
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserRow[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [rowError, setRowError] = useState<Record<string, string>>({})
  const [rowBusy, setRowBusy] = useState<Record<string, boolean>>({})

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<PortalRole>('viewer')
  const [invitePending, setInvitePending] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteNotice, setInviteNotice] = useState<string | null>(null)

  async function loadUsers() {
    setLoadError(null)
    const res = await portalFetch('/api/portal/admin/users', { method: 'GET' })
    if (!res.ok) {
      setLoadError('Seznam uživatelů se nepodařilo načíst.')
      return
    }
    setUsers(res.data.users ?? [])
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function handleInvite(e: FormEvent) {
    e.preventDefault()
    setInviteError(null)
    setInviteNotice(null)
    setInvitePending(true)
    try {
      const res = await portalFetch('/api/portal/admin/users', {
        method: 'POST',
        body: { email: inviteEmail, role: inviteRole },
      })
      if (!res.ok) {
        if (res.status === 409) {
          setInviteError((res.data as any)?.message || 'Uživatel s tímto e-mailem už existuje.')
        } else if (res.status === 400 && (res.data as any)?.error === 'invalid_email') {
          setInviteError('Zadejte platný e-mail.')
        } else {
          setInviteError('Pozvánku se nepodařilo odeslat.')
        }
        return
      }
      if (res.data.mailSent === false) {
        setInviteNotice('Účet založen, ale e-mail se neodeslal (mail není nakonfigurován) — pozvánku pošlete znovu později.')
      } else {
        setInviteNotice('Pozvánka odeslána.')
      }
      setInviteEmail('')
      setInviteRole('viewer')
      await loadUsers()
    } catch {
      setInviteError('Spojení se serverem selhalo.')
    } finally {
      setInvitePending(false)
    }
  }

  async function runAction(id: string, action: string, role?: PortalRole) {
    setRowError((prev) => ({ ...prev, [id]: '' }))
    setRowBusy((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await portalFetch('/api/portal/admin/users', {
        method: 'PATCH',
        body: { id, action, ...(role ? { role } : {}) },
      })
      if (!res.ok) {
        if (res.status === 409 && (res.data as any)?.error === 'last_owner') {
          setRowError((prev) => ({ ...prev, [id]: 'Poslední aktivní owner nejde deaktivovat/degradovat.' }))
        } else {
          setRowError((prev) => ({ ...prev, [id]: 'Akci se nepodařilo provést.' }))
        }
        return
      }
      if (action === 'resend_invite') {
        setRowError((prev) => ({
          ...prev,
          [id]: res.data.mailSent === false ? 'E-mail se neodeslal (mail není nakonfigurován).' : '',
        }))
      }
      await loadUsers()
    } catch {
      setRowError((prev) => ({ ...prev, [id]: 'Spojení se serverem selhalo.' }))
    } finally {
      setRowBusy((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="portal-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-[#004F71]">Pozvat nového uživatele</h2>
        {inviteError && (
          <div role="alert" className="mb-3 rounded-lg border border-[#B3264F]/30 bg-[#B3264F]/10 px-3.5 py-2.5 text-sm font-medium text-[#B3264F]">
            {inviteError}
          </div>
        )}
        {inviteNotice && (
          <div className="mb-3 rounded-lg border border-[#E8A400]/40 bg-[#E8A400]/10 px-3.5 py-2.5 text-sm font-medium text-[#8f6b00]">
            {inviteNotice}
          </div>
        )}
        <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="block text-sm font-medium text-[#1C2B33] mb-1.5" htmlFor="invite_email">E-mail</label>
            <input
              id="invite_email"
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.currentTarget.value)}
              className="w-full rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C2B33] mb-1.5" htmlFor="invite_role">Role</label>
            <select
              id="invite_role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.currentTarget.value as PortalRole)}
              className="rounded-lg border border-beige-400 bg-white px-3.5 py-2.5 text-[#1C2B33] focus:outline-none focus:ring-2 focus:ring-[#0E6EA8] focus:border-[#0E6EA8]"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>{ROLE_LABELS[role]}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={invitePending}
            className="rounded-full bg-[#E8A400] px-5 py-2.5 font-semibold text-[#1C2B33] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {invitePending ? 'Odesílám…' : 'Pozvat'}
          </button>
        </form>
      </div>

      <div className="portal-card overflow-x-auto p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-[#004F71]">Uživatelé</h2>
        {loadError && <p className="text-sm text-[#B3264F]">{loadError}</p>}
        {!loadError && users === null && <p className="text-sm text-[#5F6B72]">Načítám…</p>}
        {!loadError && users !== null && users.length === 0 && (
          <p className="text-sm text-[#5F6B72]">Zatím žádní uživatelé.</p>
        )}
        {!loadError && users !== null && users.length > 0 && (
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-beige-400 text-left text-[#5F6B72]">
                <th className="py-2 pr-3 font-medium">E-mail</th>
                <th className="py-2 pr-3 font-medium">Jméno</th>
                <th className="py-2 pr-3 font-medium">Role</th>
                <th className="py-2 pr-3 font-medium">Stav</th>
                <th className="py-2 pr-3 font-medium">Poslední přihlášení</th>
                <th className="py-2 pr-3 font-medium">Akce</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const status = statusOf(user)
                const busy = !!rowBusy[user.id]
                return (
                  <tr key={user.id} className="border-b border-beige-300 align-top">
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{user.email}</td>
                    <td className="py-2.5 pr-3 text-[#1C2B33]">{user.display_name || '—'}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`portal-badge portal-badge-${user.role}`}>{ROLE_LABELS[user.role]}</span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className={`portal-badge ${status.className}`}>{status.label}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-[#5F6B72]">{formatDate(user.last_login_at)}</td>
                    <td className="py-2.5 pr-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          disabled={busy}
                          value={user.role}
                          onChange={(e) => runAction(user.id, 'set_role', e.currentTarget.value as PortalRole)}
                          className="rounded border border-beige-400 bg-white px-2 py-1 text-xs disabled:opacity-60"
                          aria-label={`Změnit roli uživatele ${user.email}`}
                        >
                          {ROLES.map((role) => (
                            <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                          ))}
                        </select>
                        {user.is_active ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => runAction(user.id, 'deactivate')}
                            className="rounded-full border border-[#B3264F]/40 px-3 py-1 text-xs font-semibold text-[#B3264F] hover:bg-[#B3264F]/10 disabled:opacity-60"
                          >
                            Deaktivovat
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => runAction(user.id, 'activate')}
                            className="rounded-full border border-[#1E7A4F]/40 px-3 py-1 text-xs font-semibold text-[#1E7A4F] hover:bg-[#1E7A4F]/10 disabled:opacity-60"
                          >
                            Aktivovat
                          </button>
                        )}
                        {!user.has_password && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => runAction(user.id, 'resend_invite')}
                            className="rounded-full border border-[#0E6EA8]/40 px-3 py-1 text-xs font-semibold text-[#0E6EA8] hover:bg-[#0E6EA8]/10 disabled:opacity-60"
                          >
                            Poslat pozvánku znovu
                          </button>
                        )}
                      </div>
                      {rowError[user.id] && (
                        <p className="mt-1 text-xs font-medium text-[#B3264F]">{rowError[user.id]}</p>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
