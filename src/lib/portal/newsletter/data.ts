import { q, qOne } from '../db'
import { sanitizeNewsletterHtml, htmlToPlainText } from './sanitize'
import { groupFor, type NewsletterAudience, type NewsletterLocale } from './groups'

/**
 * Datová vrstva newsletterů. HTML se sanitizuje VŽDY při zápisu (N-02) —
 * do databáze nikdy nejde nesanitizovaný vstup, ať přišel z portálu nebo
 * z intake endpointu.
 */

export interface SegmentDefinition {
  audience: NewsletterAudience
  locales: NewsletterLocale[]
}

export interface NewsletterRow {
  id: string
  slug: string
  subject: string
  preheader: string | null
  locale: string
  html_body: string
  plain_body: string | null
  segment_definition: SegmentDefinition | null
  status: 'draft' | 'approved' | 'scheduled' | 'sent'
  mailerlite_campaign_id: string | null
  sent_at: string | null
  recipients_count: number | null
  created_by: string | null
  created_via: 'portal' | 'intake'
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

const AUDIENCES: NewsletterAudience[] = ['partners', 'leads']
const LOCALES: NewsletterLocale[] = ['de', 'en', 'cs']

export function parseSegmentDefinition(input: unknown): SegmentDefinition | null {
  if (typeof input !== 'object' || input === null) return null
  const raw = input as { audience?: unknown; locales?: unknown }
  const audience = AUDIENCES.includes(raw.audience as NewsletterAudience)
    ? (raw.audience as NewsletterAudience)
    : null
  if (!audience || !Array.isArray(raw.locales)) return null
  const locales = raw.locales.filter((l): l is NewsletterLocale => LOCALES.includes(l as NewsletterLocale))
  if (locales.length === 0) return null
  return { audience, locales: [...new Set(locales)] }
}

/** Cílové MailerLite skupiny — vždy přes allowlist (groupFor jinou nezná). */
export function groupIdsFor(def: SegmentDefinition): string[] {
  return def.locales.map((locale) => groupFor(def.audience, locale).id)
}

function slugify(subject: string): string {
  const base = subject
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${new Date().toISOString().slice(0, 10)}-${base || 'newsletter'}`
}

export interface CreateDraftInput {
  subject: string
  preheader?: string | null
  locale: NewsletterLocale
  html: string
  plain?: string | null
  segment?: SegmentDefinition | null
  createdBy: string | null
  createdVia: 'portal' | 'intake'
}

export async function createDraft(input: CreateDraftInput): Promise<{ id: string; slug: string }> {
  const html = sanitizeNewsletterHtml(input.html)
  const plain = input.plain?.trim() || htmlToPlainText(html)
  let slug = slugify(input.subject)
  for (let attempt = 0; ; attempt += 1) {
    try {
      const row = await qOne<{ id: string }>(
        `INSERT INTO crm.newsletters
           (slug, subject, preheader, locale, html_body, plain_body, segment_definition, created_by, created_via)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [
          slug,
          input.subject,
          input.preheader ?? null,
          input.locale,
          html,
          plain,
          input.segment ? JSON.stringify(input.segment) : null,
          input.createdBy,
          input.createdVia,
        ],
      )
      if (!row) throw new Error('Koncept se nepodařilo založit')
      return { id: row.id, slug }
    } catch (err) {
      const isUnique = typeof err === 'object' && err !== null && (err as { code?: string }).code === '23505'
      if (!isUnique || attempt >= 3) throw err
      slug = `${slugify(input.subject)}-${attempt + 2}`
    }
  }
}

export async function getNewsletter(id: string): Promise<NewsletterRow | null> {
  return qOne<NewsletterRow>(`SELECT * FROM crm.newsletters WHERE id = $1`, [id])
}

/** Úprava jen u konceptu; HTML se při každém uložení znovu sanitizuje. */
export async function updateDraft(
  id: string,
  fields: { subject?: string; preheader?: string | null; locale?: NewsletterLocale; html?: string; plain?: string | null; segment?: SegmentDefinition | null },
): Promise<'ok' | 'not_found' | 'not_draft'> {
  const current = await qOne<{ status: string }>(`SELECT status FROM crm.newsletters WHERE id = $1`, [id])
  if (!current) return 'not_found'
  if (current.status !== 'draft') return 'not_draft'

  const sets: string[] = []
  const params: unknown[] = [id]
  const push = (column: string, value: unknown): void => {
    params.push(value)
    sets.push(`${column} = $${params.length}`)
  }
  if (fields.subject !== undefined) push('subject', fields.subject)
  if (fields.preheader !== undefined) push('preheader', fields.preheader)
  if (fields.locale !== undefined) push('locale', fields.locale)
  if (fields.html !== undefined) {
    const html = sanitizeNewsletterHtml(fields.html)
    push('html_body', html)
    push('plain_body', fields.plain?.trim() || htmlToPlainText(html))
  } else if (fields.plain !== undefined) {
    push('plain_body', fields.plain)
  }
  if (fields.segment !== undefined) push('segment_definition', fields.segment ? JSON.stringify(fields.segment) : null)
  if (sets.length === 0) return 'ok'
  await q(`UPDATE crm.newsletters SET ${sets.join(', ')} WHERE id = $1 AND status = 'draft'`, params)
  return 'ok'
}

export interface RecipientRow {
  partner_id: string
  contact_id: string
  email: string
}

/**
 * Příjemci podle definice segmentu — počítá se z CRM (náhled počtu i snímek
 * při odeslání): opt-in, neodhlášený, neanonymizovaný kontakt s e-mailem,
 * partner ve stavu odpovídajícím publiku a s jazykem rozesílky v seznamu.
 * Jazyk se řídí stejným pravidlem jako sync (languages[] → země).
 */
export async function resolveRecipients(def: SegmentDefinition): Promise<RecipientRow[]> {
  const statuses = def.audience === 'partners' ? ['active'] : ['prospect']
  return q<RecipientRow>(
    `SELECT p.id AS partner_id, c.id AS contact_id, c.email::text AS email
     FROM crm.partner_contacts c
     JOIN crm.partners p ON p.id = c.partner_id
     WHERE c.newsletter_opt_in
       AND c.unsubscribed_at IS NULL
       AND c.anonymized_at IS NULL
       AND c.email IS NOT NULL
       AND p.status = ANY($1)
       AND (
         COALESCE(
           (SELECT l FROM unnest(p.languages) AS l WHERE l IN ('de','en','cs') LIMIT 1),
           CASE WHEN p.country IN ('DE','AT','CH') THEN 'de'
                WHEN p.country IN ('CZ','SK') THEN 'cs'
                ELSE 'en' END
         ) = ANY($2)
       )`,
    [statuses, def.locales],
  )
}

export async function snapshotRecipients(newsletterId: string, recipients: RecipientRow[]): Promise<void> {
  for (let i = 0; i < recipients.length; i += 500) {
    const chunk = recipients.slice(i, i + 500)
    const values: string[] = []
    const params: unknown[] = [newsletterId]
    for (const r of chunk) {
      params.push(r.partner_id, r.contact_id, r.email)
      values.push(`($1, $${params.length - 2}, $${params.length - 1}, $${params.length})`)
    }
    await q(
      `INSERT INTO crm.newsletter_recipients (newsletter_id, partner_id, contact_id, email_snapshot)
       VALUES ${values.join(', ')}
       ON CONFLICT DO NOTHING`,
      params,
    )
  }
}
