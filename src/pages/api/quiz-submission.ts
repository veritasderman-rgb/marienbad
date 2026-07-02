import type { APIRoute } from 'astro'
import { getQuiz } from '@/content/reader'
import type { Locale } from '@/i18n/config'

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
const QUIZ_ID_RE = /^[a-z0-9-]{1,64}$/
const VALID_LOCALES = ['de', 'en', 'cs', 'ru'] as const

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
    const ips = xff.split(',').map(s => s.trim())
    return ips[ips.length - 1] || 'unknown'
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

// --- Rate limiting (in-memory, limited on serverless — consider Vercel KV for production) ---
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX = 5

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

  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
      { status: 429, headers },
    )
  }

  try {
    const body = await request.json()
    const { firstName, lastName, email, consent, locale, quiz, score, scoreTotal, openAnswers, website, _ts } = body as {
      firstName?: string
      lastName?: string
      email?: string
      consent?: boolean
      locale?: string
      quiz?: string
      score?: number
      scoreTotal?: number
      openAnswers?: Record<string, string>
      website?: string
      _ts?: number
    }

    // --- Honeypot check ---
    if (website) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers })
    }

    // --- Timing check (a quiz takes far longer than 10 seconds) ---
    if (!_ts || typeof _ts !== 'number' || Date.now() - _ts < 10000) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers })
    }

    if (!email || typeof email !== 'string' || email.length > 254 || !EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid email address.' }), { status: 400, headers })
    }
    if (
      !firstName || typeof firstName !== 'string' || firstName.trim().length === 0 || firstName.length > 100 ||
      !lastName || typeof lastName !== 'string' || lastName.trim().length === 0 || lastName.length > 100
    ) {
      return new Response(JSON.stringify({ success: false, error: 'Name is required.' }), { status: 400, headers })
    }
    if (consent !== true) {
      return new Response(JSON.stringify({ success: false, error: 'Consent is required.' }), { status: 400, headers })
    }

    const resolvedLocale: Locale =
      typeof locale === 'string' && (VALID_LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : 'de'

    // The quiz must actually exist for this locale — rejects made-up source values
    if (!quiz || typeof quiz !== 'string' || !QUIZ_ID_RE.test(quiz) || !getQuiz(quiz, resolvedLocale)) {
      return new Response(JSON.stringify({ success: false, error: 'Unknown quiz.' }), { status: 400, headers })
    }

    const env = (k: string) => import.meta.env[k] ?? process.env[k]
    const apiKey = env('MAILERLITE_API_KEY')

    // Locale groups (shared with the newsletter) + per-quiz group for easy segmentation
    const localeGroupMap: Record<string, string | undefined> = {
      de: env('MAILERLITE_GROUP_DE'),
      en: env('MAILERLITE_GROUP_EN'),
      cs: env('MAILERLITE_GROUP_CS'),
      ru: env('MAILERLITE_GROUP_RU'),
    }
    const quizGroupId =
      env(`MAILERLITE_GROUP_QUIZ_${quiz.toUpperCase().replace(/-/g, '_')}`) ?? env('MAILERLITE_GROUP_QUIZ')

    if (apiKey) {
      // Keep open answers with the contact (single text field, hard-truncated)
      const openAnswerText = openAnswers && typeof openAnswers === 'object'
        ? Object.values(openAnswers).filter((v) => typeof v === 'string').join(' | ').slice(0, 500)
        : ''

      const fields: Record<string, unknown> = {
        name: firstName.trim().slice(0, 100),
        last_name: lastName.trim().slice(0, 100),
        locale: resolvedLocale,
        quiz,
      }
      if (openAnswerText) fields.quiz_answer = openAnswerText
      if (typeof score === 'number' && typeof scoreTotal === 'number' && scoreTotal > 0) {
        fields.quiz_score = `${Math.max(0, Math.min(score, scoreTotal))}/${scoreTotal}`
      }

      const groups = [localeGroupMap[resolvedLocale], quizGroupId].filter(Boolean)
      const payload: Record<string, unknown> = { email, fields }
      if (groups.length) payload.groups = groups

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
        console.error('[quiz-submission] MailerLite error:', res.status, err)
        return new Response(
          JSON.stringify({ success: false, error: 'Subscription service error. Please try again later.' }),
          { status: 502, headers },
        )
      }
    } else {
      console.log(`[quiz-submission] No MAILERLITE_API_KEY configured. Dry run for quiz: ${quiz}, locale: ${resolvedLocale}`)
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers })
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid request body.' }), { status: 400, headers })
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
