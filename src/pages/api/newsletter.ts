import type { APIRoute } from 'astro'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': new URL(request.url).origin,
  }

  try {
    const body = await request.json()
    const { email, locale } = body as { email?: string; locale?: string }

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
