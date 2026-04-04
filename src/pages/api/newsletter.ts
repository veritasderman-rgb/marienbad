import type { APIRoute } from 'astro'

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

const ALLOWED_ORIGINS = ['https://marienbad.com', 'https://www.marienbad.com', 'https://marienbad.vercel.app']
function getAllowedOrigin(url: string): string {
  try {
    const origin = new URL(url).origin
    if (ALLOWED_ORIGINS.includes(origin)) return origin
  } catch {}
  return ''
}

/** Extract client IP — on Vercel, use the rightmost non-private IP from x-forwarded-for */
function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    // Vercel appends the real client IP as the last entry
    const ips = xff.split(',').map(s => s.trim())
    return ips[ips.length - 1] || 'unknown'
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

// --- Rate limiting (in-memory, limited on serverless — consider Vercel KV for production) ---
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX = 3

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []
  // Remove entries outside the window
  const recent = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)
  rateLimitMap.set(ip, recent)
  if (recent.length >= RATE_LIMIT_MAX) return true
  recent.push(now)
  rateLimitMap.set(ip, recent)
  return false
}

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': getAllowedOrigin(request.url),
  }

  // --- Rate limiting by IP ---
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
      { status: 429, headers },
    )
  }

  try {
    const body = await request.json()
    const { email, locale, website, _ts } = body as {
      email?: string
      locale?: string
      website?: string
      _ts?: number
    }

    // --- Honeypot check ---
    if (website) {
      // Bot filled the honeypot field — return fake success
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers },
      )
    }

    // --- Timing check (required — bots skip this field) ---
    if (!_ts || typeof _ts !== 'number' || Date.now() - _ts < 5000) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers })
    }

    if (!email || typeof email !== 'string' || email.length > 254 || !EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address.' }),
        { status: 400, headers },
      )
    }

    const apiKey = process.env.MAILERLITE_API_KEY

    // Locale → MailerLite group ID mapping (env: MAILERLITE_GROUP_DE, _EN, _CS, _RU)
    const env = (k: string) => import.meta.env[k] ?? process.env[k]
    const localeGroupMap: Record<string, string | undefined> = {
      de: env('MAILERLITE_GROUP_DE'),
      en: env('MAILERLITE_GROUP_EN'),
      cs: env('MAILERLITE_GROUP_CS'),
      ru: env('MAILERLITE_GROUP_RU'),
    }

    const validLocales = ['de', 'en', 'cs', 'ru'] as const
    const resolvedLocale = typeof locale === 'string' && validLocales.includes(locale as any) ? locale : 'de'
    const groupId = localeGroupMap[resolvedLocale]

    if (apiKey) {
      const payload: Record<string, unknown> = {
        email,
        fields: { locale: resolvedLocale },
      }
      if (groupId) {
        payload.groups = [groupId]
      }

      const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.text()
        console.error('[newsletter] MailerLite error:', res.status, err)
        return new Response(
          JSON.stringify({ success: false, error: 'Subscription service error. Please try again later.' }),
          { status: 502, headers },
        )
      }
    } else {
      console.log(`[newsletter] No MAILERLITE_API_KEY configured. Dry run for locale: ${resolvedLocale}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers },
    )
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid request body.' }),
      { status: 400, headers },
    )
  }
}

/** Handle CORS preflight */
export const OPTIONS: APIRoute = ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': getAllowedOrigin(request.url),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}
