/**
 * Sdílený fetch helper pro React ostrůvky partnerského portálu.
 *
 * CSRF token se čte z <meta name="csrf"> (nastaveno v PortalLayout.astro),
 * s fallbackem na cookie `__Host-portal_csrf` (double-submit, cookie není
 * HttpOnly — viz src/lib/portal/csrf.ts). Vždy posílá x-csrf-token a
 * credentials: 'same-origin', aby middleware mohl mutace ověřit.
 */

const CSRF_COOKIE = '__Host-portal_csrf'

export interface PortalFetchResult<T = any> {
  ok: boolean
  status: number
  data: T
}

function readCsrfFromMeta(): string | null {
  if (typeof document === 'undefined') return null
  const meta = document.querySelector('meta[name="csrf"]')
  const content = meta?.getAttribute('content')
  return content && content.length > 0 ? content : null
}

function readCsrfFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CSRF_COOKIE}=`))
  if (!match) return null
  const value = match.slice(CSRF_COOKIE.length + 1)
  return value ? decodeURIComponent(value) : null
}

function readCsrfToken(): string {
  return readCsrfFromMeta() ?? readCsrfFromCookie() ?? ''
}

export async function portalFetch<T = any>(
  path: string,
  options?: { method?: string; body?: unknown },
): Promise<PortalFetchResult<T>> {
  const method = options?.method ?? (options?.body !== undefined ? 'POST' : 'GET')

  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': readCsrfToken(),
    },
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  return { ok: response.ok, status: response.status, data: data as T }
}
