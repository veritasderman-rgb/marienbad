import type { AstroCookies } from 'astro'
import { randomToken, safeEqual } from './crypto'

export const CSRF_COOKIE = '__Host-portal_csrf'
export const CSRF_HEADER = 'x-csrf-token'

/**
 * Double-submit token: hodnota v cookie (čitelná JS, ne HttpOnly) musí sedět
 * s hlavičkou x-csrf-token. Mutující prohlížečové požadavky jdou vždy přes
 * fetch s touto hlavičkou — klasické form posty portál nepoužívá, aby
 * middleware nemusel číst tělo požadavku.
 */
export function ensureCsrfCookie(cookies: AstroCookies): string {
  const existing = cookies.get(CSRF_COOKIE)?.value
  if (existing && existing.length >= 32) return existing
  const token = randomToken(32)
  cookies.set(CSRF_COOKIE, token, {
    path: '/',
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 8 * 3600,
  })
  return token
}

export function validateCsrf(request: Request, cookies: AstroCookies): boolean {
  const cookieToken = cookies.get(CSRF_COOKIE)?.value
  const headerToken = request.headers.get(CSRF_HEADER)
  if (!cookieToken || !headerToken) return false
  return safeEqual(cookieToken, headerToken)
}

export function validateOrigin(request: Request, expectedOrigin: string): boolean {
  const origin = request.headers.get('origin')
  if (origin) return origin === expectedOrigin
  // Bez Origin hlavičky (starší klienti, some GET) — mutace bez Origin nepouštíme
  return false
}
