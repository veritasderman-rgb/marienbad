import { env, requireEnv } from '../env'
import { assertAllowedGroups, isAllowedGroupId } from './groups'

/**
 * MailerLite API klient portálu (audit N-01).
 *
 * Klíč MAILERLITE_API_KEY je celoúčtový — omezení „jen B2B" proto vynucuje
 * TENTO klient, ne MailerLite: každá operace se skupinami projde
 * assertAllowedGroups / isAllowedGroupId. Kampaň bez skupin (= všem
 * odběratelům) neexistuje jako cesta.
 */

const BASE = 'https://connect.mailerlite.com/api'

class MailerLiteError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(`MailerLite ${status}: ${message}`)
  }
}

async function mlFetch<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    method: init?.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${requireEnv('MAILERLITE_API_KEY')}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(20_000),
  })
  const text = await response.text()
  if (!response.ok) {
    throw new MailerLiteError(response.status, text.slice(0, 500))
  }
  return (text ? JSON.parse(text) : {}) as T
}

export interface CreateCampaignInput {
  name: string
  subject: string
  preheader?: string | null
  groupIds: string[]
  html: string
  plain?: string | null
}

/** Založí kampaň VÝHRADNĚ do allowlistovaných B2B skupin. Neodesílá. */
export async function createCampaign(input: CreateCampaignInput): Promise<{ id: string }> {
  assertAllowedGroups(input.groupIds)
  const fromEmail = env('NEWSLETTER_FROM_EMAIL') ?? 'newsletter@marienbad.com'
  const fromName = env('NEWSLETTER_FROM_NAME') ?? 'Marienbad – Ensana Health Spa Hotels'
  const payload = {
    name: input.name,
    type: 'regular',
    groups: input.groupIds,
    emails: [
      {
        subject: input.subject,
        preheader: input.preheader ?? undefined,
        from_name: fromName,
        from: fromEmail,
        content: input.html,
        ...(input.plain ? { plain_text: input.plain } : {}),
      },
    ],
  }
  const result = await mlFetch<{ data: { id: string } }>('/campaigns', { method: 'POST', body: payload })
  if (!result.data?.id) throw new Error('MailerLite nevrátil ID kampaně')
  return { id: String(result.data.id) }
}

/** Okamžité odeslání dříve založené kampaně. Volá se JEN po schválení ownerem. */
export async function scheduleCampaignInstant(campaignId: string): Promise<void> {
  await mlFetch(`/campaigns/${encodeURIComponent(campaignId)}/schedule`, {
    method: 'POST',
    body: { delivery: 'instant' },
  })
}

export interface CampaignStats {
  sent: number | null
  opens_count: number | null
  unique_opens_count: number | null
  open_rate: number | null
  clicks_count: number | null
  unique_clicks_count: number | null
  click_rate: number | null
  click_to_open_rate: number | null
  unsubscribes_count: number | null
  spam_count: number | null
  hard_bounces_count: number | null
  soft_bounces_count: number | null
}

interface RawCampaign {
  data?: {
    id: string
    status?: string
    stats?: Record<string, unknown>
  }
}

function num(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const n = typeof value === 'string' ? Number.parseFloat(value) : Number(value)
  return Number.isFinite(n) ? n : null
}

/** Statistiky kampaně (měsíční sběr — fáze 4). */
export async function getCampaignStats(
  campaignId: string,
): Promise<{ status: string | null; stats: CampaignStats } | null> {
  let raw: RawCampaign
  try {
    raw = await mlFetch<RawCampaign>(`/campaigns/${encodeURIComponent(campaignId)}`)
  } catch (err) {
    if (err instanceof MailerLiteError && err.status === 404) return null
    throw err
  }
  const s = raw.data?.stats ?? {}
  const rate = (v: unknown): number | null => {
    // rate chodí jako {float: 0.42, string: "42%"} nebo přímo číslo
    if (typeof v === 'object' && v !== null && 'float' in v) return num((v as { float: unknown }).float)
    return num(v)
  }
  return {
    status: raw.data?.status ?? null,
    stats: {
      sent: num(s.sent),
      opens_count: num(s.opens_count),
      unique_opens_count: num(s.unique_opens_count),
      open_rate: rate(s.open_rate),
      clicks_count: num(s.clicks_count),
      unique_clicks_count: num(s.unique_clicks_count),
      click_rate: rate(s.click_rate),
      click_to_open_rate: rate(s.click_to_open_rate),
      unsubscribes_count: num(s.unsubscribes_count),
      spam_count: num(s.spam_count),
      hard_bounces_count: num(s.hard_bounces_count),
      soft_bounces_count: num(s.soft_bounces_count),
    },
  }
}

/** Prokliky jednotlivých odkazů kampaně. */
export async function getCampaignLinks(
  campaignId: string,
): Promise<{ url: string; clicks_count: number | null }[]> {
  const raw = await mlFetch<{ data?: { url?: string; clicks_count?: unknown }[] }>(
    `/campaigns/${encodeURIComponent(campaignId)}/links`,
  )
  return (raw.data ?? [])
    .filter((l) => typeof l.url === 'string')
    .map((l) => ({ url: l.url as string, clicks_count: num(l.clicks_count) }))
}

// ---------------------------------------------------------------------------
// Odběratelé — jen pro sync B2B skupin (členství spravuje výhradně portál)
// ---------------------------------------------------------------------------

export interface UpsertSubscriberInput {
  email: string
  fields?: Record<string, string | number | null>
  /** Skupiny, do kterých MÁ patřit — všechny musí být na allowlistu. */
  groupIds: string[]
}

export async function upsertSubscriber(input: UpsertSubscriberInput): Promise<{ id: string }> {
  assertAllowedGroups(input.groupIds)
  const result = await mlFetch<{ data: { id: string } }>('/subscribers', {
    method: 'POST',
    body: { email: input.email, fields: input.fields, groups: input.groupIds },
  })
  if (!result.data?.id) throw new Error('MailerLite nevrátil ID odběratele')
  return { id: String(result.data.id) }
}

export interface SubscriberInfo {
  id: string
  email: string
  status: string
  groupIds: string[]
}

export async function getSubscriber(email: string): Promise<SubscriberInfo | null> {
  let raw: { data?: { id: string; email: string; status: string; groups?: { id: string }[] } }
  try {
    raw = await mlFetch(`/subscribers/${encodeURIComponent(email)}`)
  } catch (err) {
    if (err instanceof MailerLiteError && err.status === 404) return null
    throw err
  }
  if (!raw.data) return null
  return {
    id: String(raw.data.id),
    email: raw.data.email,
    status: raw.data.status,
    groupIds: (raw.data.groups ?? []).map((g) => String(g.id)),
  }
}

/** Odebrání z JEDNÉ allowlistované skupiny — B2C skupin se sync nikdy nedotkne. */
export async function unassignSubscriberFromGroup(subscriberId: string, groupId: string): Promise<void> {
  if (!isAllowedGroupId(groupId)) {
    throw new Error(`Skupina ${groupId} není B2B — sync na ni nesmí sahat.`)
  }
  await mlFetch(`/subscribers/${encodeURIComponent(subscriberId)}/groups/${encodeURIComponent(groupId)}`, {
    method: 'DELETE',
  })
}
