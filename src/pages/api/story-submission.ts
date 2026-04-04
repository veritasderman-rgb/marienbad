import type { APIRoute } from 'astro'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_LOCALES = ['de', 'en', 'cs', 'ru']
const VALID_VISIT_PERIODS = ['recently', '1-5', '5-10', '10+']

const ALLOWED_ORIGINS = ['https://marienbad.com', 'https://www.marienbad.com', 'https://marienbad.vercel.app']
function getAllowedOrigin(url: string): string {
  const origin = new URL(url).origin
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
}

// --- Rate limiting (in-memory, limited on serverless — consider Vercel KV for production) ---
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 3

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []
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
    const { name, email, location, visitPeriod, story, photoConsent, locale, website, _ts } = body as {
      name?: string
      email?: string
      location?: string
      visitPeriod?: string
      story?: string
      photoConsent?: boolean
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

    // --- Validation ---
    const errors: string[] = []

    if (!name || name.trim().length === 0) {
      errors.push('Name is required.')
    }

    if (!email || !EMAIL_RE.test(email)) {
      errors.push('A valid email address is required.')
    }

    if (!location || location.trim().length === 0) {
      errors.push('Location is required.')
    }

    if (!visitPeriod || !VALID_VISIT_PERIODS.includes(visitPeriod)) {
      errors.push('A valid visit period is required.')
    }

    if (!story || story.trim().length < 50) {
      errors.push('Story must be at least 50 characters.')
    }

    if (story && story.trim().length > 2000) {
      errors.push('Story must not exceed 2000 characters.')
    }

    if (!locale || !VALID_LOCALES.includes(locale)) {
      errors.push('A valid locale is required.')
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: errors[0] }),
        { status: 400, headers },
      )
    }

    // TODO: Store submission in Supabase database.
    // For now, log the submission and return success.
    console.log(`[story-submission] New story received, locale: ${locale}, location: ${location}, visitPeriod: ${visitPeriod}, story length: ${story!.trim().length}`)

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
    },
  })
}
