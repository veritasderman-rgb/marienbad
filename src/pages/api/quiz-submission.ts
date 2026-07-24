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

/** Extract the client IP for rate limiting.
 *  On Vercel the platform sets `x-real-ip` to the true client IP, and
 *  `x-forwarded-for` is `<client>, <vercel-proxy…>` — the LEFTMOST entry is the
 *  original client, the rightmost is Vercel's own infrastructure (shared across
 *  every visitor). The previous code took the rightmost, which collapsed all
 *  visitors onto a handful of proxy IPs and rate-limited them collectively —
 *  real entrants were blocked with a 429 once any five submissions arrived. */
function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  return 'unknown'
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
    const { firstName, lastName, email, consentCompetition, consentNewsletter, locale, quiz, score, scoreTotal, openAnswers, hp, _ts } = body as {
      firstName?: string
      lastName?: string
      email?: string
      consentCompetition?: boolean
      consentNewsletter?: boolean
      locale?: string
      quiz?: string
      score?: number
      scoreTotal?: number
      openAnswers?: Record<string, string>
      hp?: string
      _ts?: number
    }

    // --- Honeypot check. The quiz form no longer renders a honeypot field —
    // browser autofill kept filling it (regardless of name or ignore hints)
    // and silently disqualified real entrants. Direct-POST bots that replay
    // an old payload with `hp` are still dropped here. ---
    if (hp) {
      console.log(`[quiz-submission] honeypot triggered — dropping silently (quiz: ${quiz}, locale: ${locale})`)
      return new Response(JSON.stringify({ success: true }), { status: 200, headers })
    }

    // --- Timing check (a quiz takes far longer than 10 seconds) ---
    if (!_ts || typeof _ts !== 'number' || Date.now() - _ts < 10000) {
      console.log(`[quiz-submission] timing check failed — dropping silently (quiz: ${quiz}, locale: ${locale}, _ts: ${_ts})`)
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
    // Taking part is required (acceptance of the rules); the newsletter is
    // a separate, optional opt-in. Entering must not require newsletter consent.
    if (consentCompetition !== true) {
      return new Response(JSON.stringify({ success: false, error: 'Competition consent is required.' }), { status: 400, headers })
    }
    const wantsNewsletter = consentNewsletter === true

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
      // Record marketing consent ONLY when it is granted. This endpoint upserts
      // by email, so writing 'no' would overwrite an existing subscriber's prior
      // opt-in and silently downgrade their consent. The quiz can only ADD
      // consent; withdrawal happens exclusively via the unsubscribe link.
      if (wantsNewsletter) fields.newsletter = 'yes'

      // Everyone who enters goes into the per-quiz group (used to run the draw).
      // The locale newsletter group is added ONLY with explicit newsletter consent —
      // marketing campaigns target the locale groups, never the quiz group. We never
      // remove groups here, so a returning subscriber keeps any prior newsletter opt-in.
      const groups = [quizGroupId]
      if (wantsNewsletter) groups.unshift(localeGroupMap[resolvedLocale])
      const groupIds = groups.filter(Boolean)
      const payload: Record<string, unknown> = { email, fields }
      if (groupIds.length) payload.groups = groupIds

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
      console.log(`[quiz-submission] No MAILERLITE_API_KEY configured. Dry run for quiz: ${quiz}, locale: ${resolvedLocale}, newsletter: ${wantsNewsletter}`)
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
