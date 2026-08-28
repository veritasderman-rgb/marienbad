import { defineMiddleware } from 'astro:middleware'
import { SESSION_COOKIE, validateSessionCookie, setSessionCookie } from './lib/portal/auth/session'
import { ensureCsrfCookie, validateCsrf, validateOrigin } from './lib/portal/csrf'

/**
 * Brána portálu. Rozlišuje dva druhy provozu (NAVRH 3.3):
 *
 * - STROJOVÉ cesty (cron, intake, export): nikdy se nepřesměrovávají, session
 *   cookie se u nich ignoruje (CSRF se jich netýká) — autentizaci bearer
 *   tokenem si dělá každý endpoint sám přes requireMachineToken.
 * - PROHLÍŽEČOVÉ cesty: platná session, jinak redirect na přihlášení
 *   (u API 401). Mutace vyžadují Origin + double-submit CSRF hlavičku.
 *
 * Middleware je první vrstva — každý endpoint si identitu a roli ověřuje
 * znovu sám (guard.ts). Hlavičky (noindex, no-store, přísná CSP) se nastavují
 * zde, aby platily i mimo Vercel (dev server); vercel.json je nastavuje too.
 */

const MACHINE_PREFIXES = ['/api/portal/cron/', '/api/portal/intake/', '/api/portal/export/']

const PUBLIC_PAGE_PREFIXES = [
  '/portal/login',
  '/portal/forgot',
  '/portal/invite/',
  '/portal/reset/',
  '/portal/setup-totp',
  '/portal/totp',
]

const PUBLIC_API_PREFIX = '/api/portal/auth/'

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function isPortalPath(path: string): boolean {
  return path === '/portal' || path.startsWith('/portal/') || path.startsWith('/api/portal/')
}

function isPublicBrowserPath(path: string): boolean {
  if (path.startsWith(PUBLIC_API_PREFIX)) return true
  return PUBLIC_PAGE_PREFIXES.some((p) => path === p || path.startsWith(p))
}

const PORTAL_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname
  if (!isPortalPath(path)) return next()

  const isApi = path.startsWith('/api/portal/')

  // --- strojové cesty: žádné cookies, žádné přesměrování -------------------
  if (MACHINE_PREFIXES.some((p) => path.startsWith(p))) {
    context.locals.portalMachine = true
    const response = await next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    response.headers.set('Cache-Control', 'no-store')
    return response
  }

  // --- prohlížečové cesty ---------------------------------------------------
  if (MUTATING_METHODS.has(context.request.method)) {
    if (!validateOrigin(context.request, context.url.origin)) {
      return new Response(JSON.stringify({ error: 'bad_origin' }), { status: 403 })
    }
    if (!validateCsrf(context.request, context.cookies)) {
      return new Response(JSON.stringify({ error: 'csrf' }), { status: 403 })
    }
  }

  const session = await validateSessionCookie(context.cookies.get(SESSION_COOKIE)?.value)
  if (session) {
    context.locals.portalUser = session.user
    context.locals.portalSessionId = session.sessionId
    if (session.refreshedCookieValue) setSessionCookie(context.cookies, session.refreshedCookieValue)
  }

  if (!session && !isPublicBrowserPath(path)) {
    if (isApi) {
      return new Response(JSON.stringify({ error: 'unauthenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      })
    }
    const nextParam = encodeURIComponent(path + context.url.search)
    return context.redirect(`/portal/login?next=${nextParam}`, 302)
  }

  // admin sekce jen pro owner (endpointy si roli kontrolují znovu samy)
  if ((path.startsWith('/portal/admin') || path.startsWith('/api/portal/admin')) && session?.user.role !== 'owner') {
    if (isApi) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 })
    return context.redirect('/portal', 302)
  }

  // CSRF token pro stránky (fetch ho posílá v hlavičce)
  if (!isApi) {
    context.locals.portalCsrf = ensureCsrfCookie(context.cookies)
  }

  const response = await next()
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  response.headers.set('Cache-Control', 'no-store')
  if (!isApi) response.headers.set('Content-Security-Policy', PORTAL_CSP)
  response.headers.set('Referrer-Policy', 'same-origin')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  return response
})
