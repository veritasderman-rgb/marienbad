import type { APIRoute } from 'astro'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// --- Rate limiting (in-memory) ---
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
    'Access-Control-Allow-Origin': new URL(request.url).origin,
  }

  // --- Rate limiting by IP ---
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

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

    // --- Timing check ---
    if (_ts) {
      const elapsed = Date.now() - _ts
      if (elapsed < 3000) {
        // Submitted too fast (likely a bot) — return fake success
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers },
        )
      }
    }

    if (!email || !EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address.' }),
        { status: 400, headers },
      )
    }

    const apiKey = import.meta.env.MAILERLITE_API_KEY ?? process.env.MAILERLITE_API_KEY

    if (apiKey) {
      // Forward to MailerLite API
      const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          fields: { locale: locale || 'de' },
        }),
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
      // Graceful degradation for dev / missing key
      console.log(`[newsletter] No MAILERLITE_API_KEY set. Would subscribe: ${email} (locale: ${locale || 'de'})`)
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
      'Access-Control-Allow-Origin': new URL(request.url).origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
