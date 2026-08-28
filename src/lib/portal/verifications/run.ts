import { q, qOne } from '../db'
import { env } from '../env'
import { sendMail } from '../mail'
import {
  evaluateRisk,
  fetchVerificationSnapshot,
  type RiskLevel,
  type VerificationSnapshot,
} from './hlidac'

/**
 * Orchestrace prověrek partnerů v Hlídači státu (NAVRH 5.5).
 *
 * Klient (hlidac.ts) umí načíst a vyhodnotit jedno IČO; tenhle soubor to
 * navazuje na databázi, historii a upozornění:
 *
 * - každá kontrola zakládá NOVÝ řádek v crm.partner_verifications
 *   (append-only, aby byl vidět vývoj v čase),
 * - řádek nikdy nevznikne z prázdné odpovědi: když selžou všechny zdroje,
 *   neuloží se nic — falešné „ok" je horší než přiznané „nevíme",
 * - zhoršení stupně (a první kontrola končící `alert`) pošle e-mail
 *   vlastníkovi vztahu; zlepšení se jen tiše zaloguje.
 *
 * Běhy jsou SEKVENČNÍ: API Hlídače má rate limit (4 req/s) a klient sám
 * mezi voláními čeká, souběžné partnery by ho přetáhly.
 */

const ICO_PATTERN = /^[0-9]{8}$/

/** Prefixy chyb, které fetchVerificationSnapshot zakládá — jeden na zdroj. */
const SOURCE_ERROR_PREFIXES = ['insolvence:', 'dph:', 'rejstrik-trestu:', 'detail:'] as const

/** Selhaly úplně všechny zdroje? Pak se řádek nezakládá (žádné falešné „ok"). */
export function allSourcesFailed(errors: string[]): boolean {
  return SOURCE_ERROR_PREFIXES.every((prefix) => errors.some((e) => e.startsWith(prefix)))
}

const RISK_RANK: Record<RiskLevel, number> = { ok: 0, watch: 1, alert: 2 }

/**
 * Posílá se upozornění? Jen při zhoršení stupně (ok→watch, ok→watch→alert)
 * a při vůbec první kontrole, která skončí `alert`. První `watch` bez historie
 * se neposílá — je to výchozí zjištěný stav, ne změna.
 */
export function shouldNotify(prev: RiskLevel | null, next: RiskLevel): boolean {
  if (next === 'ok') return false
  if (prev === null) return next === 'alert'
  return RISK_RANK[next] > RISK_RANK[prev]
}

export interface NotificationInput {
  partnerName: string
  ico: string
  level: RiskLevel
  previousLevel: RiskLevel | null
  reasons: string[]
  sourceUrl: string
}

export interface NotificationMessage {
  subject: string
  html: string
  text: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const PORTAL_PATH = '/portal/verifications'
const ATTRIBUTION = 'Zdroj: Hlídač státu — hlidacstatu.cz'

/**
 * Text upozornění. Čistá funkce (žádné DB ani HTTP) — testovaná přímo.
 * Uvedení zdroje je povinné, licence Hlídače (texty.hlidacstatu.cz/licence/).
 */
export function notificationBody(input: NotificationInput): NotificationMessage {
  const subject = `[portál] Prověrka: ${input.partnerName} — ${input.level}`
  const change =
    input.previousLevel === null
      ? 'první kontrola'
      : `změna ${input.previousLevel} → ${input.level}`
  const reasons = input.reasons.length > 0 ? input.reasons : ['bez uvedeného důvodu']

  const text = [
    `Prověrka partnera ${input.partnerName} (IČO ${input.ico}) skončila stupněm ${input.level} (${change}).`,
    '',
    'Důvody:',
    ...reasons.map((r) => `- ${r}`),
    '',
    `Detail v portálu: ${PORTAL_PATH}`,
    `${ATTRIBUTION} (${input.sourceUrl})`,
  ].join('\n')

  const html =
    `<p>Prověrka partnera <b>${escapeHtml(input.partnerName)}</b> (IČO ${escapeHtml(input.ico)}) ` +
    `skončila stupněm <b>${input.level}</b> (${escapeHtml(change)}).</p>` +
    `<p>Důvody:</p><ul>${reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` +
    `<p>Detail v portálu: <a href="${PORTAL_PATH}">${PORTAL_PATH}</a></p>` +
    `<p>${ATTRIBUTION}: <a href="${escapeHtml(input.sourceUrl)}">${escapeHtml(input.sourceUrl)}</a></p>`

  return { subject, html, text }
}

export type VerificationState = 'verified' | 'pending' | 'foreign' | 'no_ico'

/**
 * Stav prověrky partnera. Zahraniční partner bez IČO nikdy nevypadá jako `ok`
 * — Hlídač pokrývá jen české subjekty (NAVRH 5.5), takže je `foreign`
 * („mimo dosah"), ne „v pořádku".
 */
export function verificationState(input: {
  ico: string | null
  country: string | null
  hasVerification: boolean
}): VerificationState {
  if (input.hasVerification) return 'verified'
  if (input.ico && ICO_PATTERN.test(input.ico)) return 'pending'
  if (input.country && input.country.trim().toUpperCase() !== 'CZ') return 'foreign'
  return 'no_ico'
}

// ---------------------------------------------------------------------------
// Prověrka jednoho partnera
// ---------------------------------------------------------------------------

export interface VerifySuccess {
  ok: true
  partner_id: string
  partner_name: string
  ico: string
  risk_level: RiskLevel
  previous_level: RiskLevel | null
  reasons: string[]
  notified: boolean
  verification_id: string
  errors: string[]
}

export type VerifyResult =
  | VerifySuccess
  | { skipped: 'no_ico' | 'hlidac_not_configured' }
  | { error: string }

interface PartnerRow {
  id: string
  name: string
  ico: string | null
  owner_user_id: string | null
}

async function previousLevel(partnerId: string): Promise<RiskLevel | null> {
  const row = await qOne<{ risk_level: RiskLevel }>(
    `SELECT risk_level FROM crm.partner_verifications
     WHERE partner_id = $1 ORDER BY checked_at DESC LIMIT 1`,
    [partnerId],
  )
  return row?.risk_level ?? null
}

async function recipientFor(ownerUserId: string | null): Promise<string | null> {
  if (ownerUserId) {
    const row = await qOne<{ email: string }>(
      `SELECT email FROM crm.portal_users WHERE id = $1 AND is_active`,
      [ownerUserId],
    )
    if (row?.email) return row.email
  }
  return env('PORTAL_ALERT_EMAIL') ?? null
}

export async function verifyPartner(partnerId: string): Promise<VerifyResult> {
  if (!env('HLIDAC_TOKEN')) return { skipped: 'hlidac_not_configured' }

  const partner = await qOne<PartnerRow>(
    `SELECT id, name, ico, owner_user_id FROM crm.partners WHERE id = $1`,
    [partnerId],
  )
  if (!partner) return { error: 'partner_not_found' }
  const ico = partner.ico?.trim() ?? ''
  if (!ICO_PATTERN.test(ico)) return { skipped: 'no_ico' }

  let snapshot: VerificationSnapshot
  try {
    snapshot = await fetchVerificationSnapshot(ico)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'hlidac_failed' }
  }
  // Všechny zdroje selhaly → řádek se nezakládá. Částečné chyby zůstávají
  // v raw.errors a kontrola pokračuje s tím, co se načíst povedlo.
  if (allSourcesFailed(snapshot.errors)) {
    return { error: `všechny zdroje selhaly: ${snapshot.errors.join('; ')}` }
  }

  const risk = evaluateRisk({
    insolvencies: snapshot.insolvencies,
    vat: snapshot.vat,
    criminal: snapshot.criminal,
  })
  const prev = await previousLevel(partner.id)

  const raw = { ...snapshot, reasons: risk.reasons }
  const inserted = await qOne<{ id: string }>(
    `INSERT INTO crm.partner_verifications
       (partner_id, ico, insolvency_as_debtor_open, insolvency_as_debtor_count,
        vat_unreliable_now, vat_ever_listed, criminal_records_count,
        employees_band, turnover_band, vat_payer_status, risk_level, raw, source_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING id`,
    [
      partner.id,
      ico,
      risk.insolvency_as_debtor_open,
      risk.insolvency_as_debtor_count,
      snapshot.vat?.is_currently_unreliable ?? null,
      snapshot.vat?.was_ever_listed ?? null,
      snapshot.criminal?.records_count ?? null,
      snapshot.business?.employees_band ?? null,
      snapshot.business?.turnover_band ?? null,
      snapshot.business?.vat_payer_status ?? null,
      risk.level,
      JSON.stringify(raw),
      snapshot.source_url,
    ],
  )
  if (!inserted) return { error: 'insert_failed' }

  let notified = false
  if (shouldNotify(prev, risk.level)) {
    const to = await recipientFor(partner.owner_user_id)
    const message = notificationBody({
      partnerName: partner.name,
      ico,
      level: risk.level,
      previousLevel: prev,
      reasons: risk.reasons,
      sourceUrl: snapshot.source_url,
    })
    if (to) {
      const result = await sendMail({ to, subject: message.subject, html: message.html, text: message.text })
      notified = result.sent
    } else {
      console.warn(
        `[portal/verifications] není komu poslat upozornění (${partner.name}) — bez vlastníka a bez PORTAL_ALERT_EMAIL`,
      )
    }
  } else if (prev !== null && RISK_RANK[risk.level] < RISK_RANK[prev]) {
    // zlepšení se neposílá, ale je vidět v logu i v historii kontrol
    console.info(`[portal/verifications] ${partner.name}: zlepšení ${prev} → ${risk.level}`)
  }

  return {
    ok: true,
    partner_id: partner.id,
    partner_name: partner.name,
    ico,
    risk_level: risk.level,
    previous_level: prev,
    reasons: risk.reasons,
    notified,
    verification_id: inserted.id,
    errors: snapshot.errors,
  }
}

// ---------------------------------------------------------------------------
// Hromadný běh (měsíční cron, tlačítko „prověřit vše")
// ---------------------------------------------------------------------------

export interface RunAllSummary {
  checked: number
  alerts: number
  watches: number
  errors: string[]
}

export type RunAllResult = RunAllSummary | { skipped: 'hlidac_not_configured' }

export async function runAllVerifications(): Promise<RunAllResult> {
  if (!env('HLIDAC_TOKEN')) return { skipped: 'hlidac_not_configured' }

  const partners = await q<{ id: string; name: string }>(
    `SELECT id, name FROM crm.partners
     WHERE ico IS NOT NULL AND status <> 'inactive'
     ORDER BY name`,
  )

  const summary: RunAllSummary = { checked: 0, alerts: 0, watches: 0, errors: [] }
  for (const partner of partners) {
    // sekvenčně: klient Hlídače drží rate limit rozestupem mezi požadavky
    try {
      const result = await verifyPartner(partner.id)
      if ('ok' in result) {
        summary.checked += 1
        if (result.risk_level === 'alert') summary.alerts += 1
        if (result.risk_level === 'watch') summary.watches += 1
      } else if ('error' in result) {
        summary.errors.push(`${partner.name}: ${result.error}`)
      }
    } catch (err) {
      // jednotlivá chyba nesmí shodit celý běh
      summary.errors.push(`${partner.name}: ${err instanceof Error ? err.message : 'chyba'}`)
    }
  }
  return summary
}
