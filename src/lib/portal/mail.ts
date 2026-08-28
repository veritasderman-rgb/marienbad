import { env } from './env'

export interface MailMessage {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Transakční e-maily (pozvánky, resety, alerty) přes Resend REST API.
 * Adapter je záměrně jediné místo, které zná dodavatele — výměna za SMTP
 * nebo jiného poskytovatele se dotkne jen tohoto souboru.
 *
 * Bez RESEND_API_KEY se nic neodesílá — jen se zaloguje, že by se odeslalo.
 */
export async function sendMail(message: MailMessage): Promise<{ sent: boolean; error?: string }> {
  const apiKey = env('RESEND_API_KEY')
  const from = env('PORTAL_MAIL_FROM') ?? 'Portál Marienbad <portal@marienbad.com>'
  if (!apiKey) {
    console.warn(`[portal/mail] RESEND_API_KEY není nastaven — e-mail „${message.subject}" pro ${message.to} se neodeslal`)
    return { sent: false, error: 'mail_not_configured' }
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      console.error(`[portal/mail] odeslání selhalo (${response.status}): ${body.slice(0, 300)}`)
      return { sent: false, error: `resend_${response.status}` }
    }
    return { sent: true }
  } catch (err) {
    console.error('[portal/mail] odeslání selhalo:', err)
    return { sent: false, error: 'network' }
  }
}

/** Upozornění správci (neúspěšná přihlášení, spadlé joby). */
export async function sendAlert(subject: string, htmlBody: string): Promise<void> {
  const to = env('PORTAL_ALERT_EMAIL')
  if (!to) {
    console.warn(`[portal/mail] PORTAL_ALERT_EMAIL není nastaven — alert „${subject}" se neodeslal`)
    return
  }
  await sendMail({ to, subject: `[portál] ${subject}`, html: htmlBody })
}
