import type { B2BGroup, NewsletterAudience } from './groups'
import { B2B_GROUPS, groupFor, isAllowedGroupId, resolveLocale } from './groups'
import { q, qOne } from '../db'
import { audit } from '../audit'
import { sendAlert } from '../mail'
import { getSubscriber, unassignSubscriberFromGroup, upsertSubscriber } from './mailerlite'

/**
 * Noční sync CRM → MailerLite skupiny `B2B · *` (NAVRH 5.1 poslední odstavec, 5.7).
 *
 * Pravidla, ze kterých plyne celý soubor:
 *  - Členství ve skupinách `B2B · *` spravuje VÝHRADNĚ tento sync. Ruční přesun
 *    v MailerLite se přepíše, změny se dělají v CRM.
 *  - Účet je sdílený s B2C kvízem. Sync se skupin mimo allowlist ani nedotkne:
 *    cizí ID vyfiltruje `isAllowedGroupId` DŘÍV, než se zavolá API (mailerlite.ts
 *    to navíc vynucuje podruhé — dvě nezávislé pojistky, audit N-07).
 *  - Povýšení vizitka → partner řeší CRM: stačí změna `partners.status`
 *    (`active` → skupina Partneři, `prospect` → Vizitky, `inactive` → žádná).
 *  - GDPR: do logů, auditu ani do návratové hodnoty nesmí celý e-mail — jen
 *    doména. Audit log je append-only, špatný zápis už nejde vzít zpět.
 *
 * Soubor je rozdělený na čistou výpočetní část (nahoře, testuje ji
 * tests/sync.test.ts bez DB a bez HTTP) a IO část (dole).
 */

// ---------------------------------------------------------------------------
// Čistá výpočetní část — žádné DB ani HTTP volání
// ---------------------------------------------------------------------------

/** Řádek kandidáta z CRM (kontakt + jeho partner). */
export interface SyncCandidate {
  contact_id: string
  email: string
  partner_status: string
  partner_segment: string
  partner_tier: string | null
  partner_languages: string[]
  partner_country: string
  acquisition_source: string | null
  mailerlite_subscriber_id: string | null
}

/** Co o odběrateli ví MailerLite (výstup getSubscriber, zúžený na potřebné). */
export interface SubscriberSnapshot {
  id: string
  status: string
  groupIds: string[]
}

export type ContactPlan =
  /** MailerLite hlásí odhlášení — nepřidávat, propsat zpět do CRM. */
  | { kind: 'unsubscribed_back' }
  /** Kontakt nemá nárok na žádnou B2B skupinu — odebrat ze všech (subscribera nemazat). */
  | { kind: 'remove'; subscriberId: string | null; removeGroupIds: string[] }
  /** Kontakt patří do jedné cílové skupiny; případné další B2B skupiny odebrat. */
  | {
      kind: 'upsert'
      groupId: string
      fields: Record<string, string>
      removeGroupIds: string[]
    }

/** ID všech skupin, které sync spravuje. Nic jiného se nikdy nedotkne. */
export const B2B_GROUP_IDS: readonly string[] = B2B_GROUPS.map((g) => g.id)

/**
 * Publikum podle stavu partnera (NAVRH 5.7):
 * active → Partneři, prospect → Vizitky, inactive → žádná rozesílka.
 */
export function audienceForStatus(status: string): NewsletterAudience | null {
  if (status === 'active') return 'partners'
  if (status === 'prospect') return 'leads'
  return null
}

/** Cílová skupina kontaktu, nebo null (partner mimo rozesílku). */
export function targetGroupFor(candidate: SyncCandidate): B2BGroup | null {
  const audience = audienceForStatus(candidate.partner_status)
  if (!audience) return null
  return groupFor(audience, resolveLocale(candidate.partner_languages ?? [], candidate.partner_country ?? ''))
}

/** Z libovolného seznamu skupin nechá jen ty, které sync spravuje (bez duplicit). */
export function b2bGroupsIn(groupIds: readonly string[]): string[] {
  return [...new Set(groupIds)].filter((id) => isAllowedGroupId(id))
}

/** Vlastní pole odběratele (NAVRH 5.7: skupiny = hrubé publikum, pole = cílení). */
export function subscriberFields(
  candidate: SyncCandidate,
  audience: NewsletterAudience,
): Record<string, string> {
  return {
    b2b_vztah: audience === 'partners' ? 'partner' : 'vizitka',
    b2b_typ: candidate.partner_segment ?? '',
    b2b_tier: candidate.partner_tier ?? '',
    b2b_zdroj: candidate.acquisition_source ?? '',
    b2b_crm_id: candidate.contact_id,
  }
}

/**
 * Rozhodnutí nad jedním kontaktem — jádro syncu, celé bez IO.
 * `subscriber` je stav z MailerLite (null = odběratel tam ještě není).
 */
export function planContact(candidate: SyncCandidate, subscriber: SubscriberSnapshot | null): ContactPlan {
  if (subscriber?.status === 'unsubscribed') return { kind: 'unsubscribed_back' }

  const current = b2bGroupsIn(subscriber?.groupIds ?? [])
  const target = targetGroupFor(candidate)

  if (!target) {
    return {
      kind: 'remove',
      subscriberId: subscriber?.id ?? candidate.mailerlite_subscriber_id ?? null,
      removeGroupIds: current,
    }
  }
  return {
    kind: 'upsert',
    groupId: target.id,
    fields: subscriberFields(candidate, target.audience),
    removeGroupIds: current.filter((id) => id !== target.id),
  }
}

/** Kontakt, který v CRM ztratil nárok, ale v MailerLite ještě někde je. */
export function planRemoval(currentGroupIds: readonly string[]): string[] {
  return b2bGroupsIn(currentGroupIds)
}

/** Doména e-mailu — jediná část adresy, která smí do logu a auditu (GDPR). */
export function emailDomain(email: string | null | undefined): string | undefined {
  if (!email) return undefined
  const at = email.lastIndexOf('@')
  if (at <= 0 || at === email.length - 1) return undefined
  return email.slice(at + 1).toLowerCase()
}

const EMAIL_IN_TEXT = /[^\s"'<>@,;:]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g

/** Chybová hláška z API může obsahovat adresu — lokální část se vždy uřízne. */
export function scrubEmails(text: string): string {
  return text.replace(EMAIL_IN_TEXT, (_match, domain: string) => `…@${domain}`)
}

/** MailerLite rate limit — jediný stav, u kterého má smysl volání zopakovat. */
export function isRateLimitError(err: unknown): boolean {
  if (typeof err === 'object' && err !== null && (err as { status?: unknown }).status === 429) return true
  return err instanceof Error && /MailerLite 429/.test(err.message)
}

/** 404 při odebírání ze skupiny = odběratel v ní už není → hotovo, ne chyba. */
export function isNotFoundError(err: unknown): boolean {
  if (typeof err === 'object' && err !== null && (err as { status?: unknown }).status === 404) return true
  return err instanceof Error && /MailerLite 404/.test(err.message)
}

export interface SyncError {
  /** JEN doména adresy — nikdy celý e-mail. */
  email?: string
  error: string
}

export interface SyncResult {
  checked: number
  upserted: number
  groups_fixed: number
  removed: number
  unsubscribed_back: number
  errors: SyncError[]
}

export function emptyResult(): SyncResult {
  return { checked: 0, upserted: 0, groups_fixed: 0, removed: 0, unsubscribed_back: 0, errors: [] }
}

/** Bezpečný text chyby do auditu: bez adres, useknutý. */
export function describeError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err)
  return scrubEmails(raw).slice(0, 300)
}

// ---------------------------------------------------------------------------
// IO část — databáze, MailerLite, zámky
// ---------------------------------------------------------------------------

export const SYNC_LOCK_NAME = 'mailerlite_sync'
export const SYNC_LOCK_MINUTES = 10
const RATE_LIMIT_PAUSE_MS = 2_000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Jeden pokus navíc při 429, pak chyba propadne volajícímu. */
async function withRateLimitRetry<T>(call: () => Promise<T>): Promise<T> {
  try {
    return await call()
  } catch (err) {
    if (!isRateLimitError(err)) throw err
    await sleep(RATE_LIMIT_PAUSE_MS)
    return call()
  }
}

/**
 * Zámek proti souběhu běhů. Atomicky: nový řádek, nebo převzetí propadlého
 * (pg advisory locky nepřežijí pooler — proto tabulka, viz 0004_newsletter.sql).
 * Vrací false, když zámek drží jiný běh.
 */
export async function acquireJobLock(name: string, minutes = SYNC_LOCK_MINUTES): Promise<boolean> {
  const row = await qOne<{ name: string }>(
    `INSERT INTO crm.job_locks AS jl (name, locked_at, expires_at)
     VALUES ($1, now(), now() + ($2::int * interval '1 minute'))
     ON CONFLICT (name) DO UPDATE
       SET locked_at = now(), expires_at = now() + ($2::int * interval '1 minute')
       WHERE jl.expires_at < now()
     RETURNING jl.name`,
    [name, minutes],
  )
  return row !== null
}

/** Uvolnění zámku — volá se i při chybě (try/finally v endpointech). */
export async function releaseJobLock(name: string): Promise<void> {
  try {
    await q(`DELETE FROM crm.job_locks WHERE name = $1`, [name])
  } catch (err) {
    // Zámek stejně vyprší sám; neúspěch nesmí přebít původní chybu běhu.
    console.error('[portal/sync] uvolnění zámku selhalo:', describeError(err))
  }
}

/**
 * Kandidáti: kontakty s platným opt-in a e-mailem, včetně partnerů ve stavu
 * `inactive` — ty sync odebere ze skupin (targetGroupFor vrátí null).
 */
async function loadCandidates(): Promise<SyncCandidate[]> {
  return q<SyncCandidate>(
    `SELECT c.id                       AS contact_id,
            c.email::text              AS email,
            c.mailerlite_subscriber_id AS mailerlite_subscriber_id,
            p.status                   AS partner_status,
            p.segment                  AS partner_segment,
            p.tier                     AS partner_tier,
            p.languages                AS partner_languages,
            p.country                  AS partner_country,
            p.acquisition_source       AS acquisition_source
     FROM crm.partner_contacts c
     JOIN crm.partners p ON p.id = c.partner_id
     WHERE c.newsletter_opt_in
       AND c.unsubscribed_at IS NULL
       AND c.anonymized_at IS NULL
       AND c.email IS NOT NULL
     ORDER BY c.created_at`,
  )
}

interface RemovalRow {
  contact_id: string
  email: string | null
  mailerlite_subscriber_id: string
}

/**
 * Kontakty, které nárok ztratily (odvolaný opt-in, odhlášení, anonymizace,
 * chybějící e-mail) a v MailerLite mají odběratele. Partneři ve stavu
 * `inactive` sem nepatří — ty řeší hlavní smyčka, aby se nezpracovaly dvakrát.
 * Anonymizovaný kontakt si `mailerlite_subscriber_id` schválně nechává, jinak
 * by ho sync neuměl ze skupin odebrat (STAV.md).
 */
async function loadRemovals(): Promise<RemovalRow[]> {
  return q<RemovalRow>(
    `SELECT c.id                       AS contact_id,
            c.email::text              AS email,
            c.mailerlite_subscriber_id AS mailerlite_subscriber_id
     FROM crm.partner_contacts c
     WHERE c.mailerlite_subscriber_id IS NOT NULL
       AND (c.newsletter_opt_in = false
            OR c.unsubscribed_at IS NOT NULL
            OR c.anonymized_at IS NOT NULL
            OR c.email IS NULL)`,
  )
}

/**
 * Odebrání ze skupiny; „už tam není" (404) je také úspěch — jen se nezapočítá.
 * Vrací true, když se opravdu něco odebralo.
 */
async function unassignTolerant(subscriberId: string, groupId: string): Promise<boolean> {
  try {
    await withRateLimitRetry(() => unassignSubscriberFromGroup(subscriberId, groupId))
    return true
  } catch (err) {
    if (!isNotFoundError(err)) throw err
    return false
  }
}

async function markUnsubscribedInCrm(contactId: string): Promise<boolean> {
  const row = await qOne<{ id: string }>(
    `UPDATE crm.partner_contacts
     SET unsubscribed_at = now()
     WHERE id = $1 AND unsubscribed_at IS NULL
     RETURNING id`,
    [contactId],
  )
  return row !== null
}

/**
 * Celý běh syncu. Jednotlivé chyby běh neshodí — zapíší se do `errors`
 * (jen doména adresy) a pokračuje se dalším kontaktem. Opakované spuštění
 * konverguje ke stejnému stavu.
 */
export async function runMailerLiteSync(): Promise<SyncResult> {
  const result = emptyResult()

  for (const candidate of await loadCandidates()) {
    result.checked += 1
    const domain = emailDomain(candidate.email)
    try {
      const target = targetGroupFor(candidate)
      // Partner mimo rozesílku, který v MailerLite nikdy nebyl → není co řešit.
      if (!target && !candidate.mailerlite_subscriber_id) continue

      const found = await withRateLimitRetry(() => getSubscriber(candidate.email))
      const snapshot: SubscriberSnapshot | null = found
        ? { id: found.id, status: found.status, groupIds: found.groupIds }
        : null
      const plan = planContact(candidate, snapshot)

      if (plan.kind === 'unsubscribed_back') {
        if (await markUnsubscribedInCrm(candidate.contact_id)) result.unsubscribed_back += 1
        continue
      }

      if (plan.kind === 'remove') {
        if (!plan.subscriberId) continue
        let removedAny = false
        for (const groupId of plan.removeGroupIds) {
          if (await unassignTolerant(plan.subscriberId, groupId)) removedAny = true
        }
        if (removedAny) result.removed += 1
        continue
      }

      const { id: subscriberId } = await withRateLimitRetry(() =>
        upsertSubscriber({ email: candidate.email, fields: plan.fields, groupIds: [plan.groupId] }),
      )
      result.upserted += 1
      if (subscriberId !== candidate.mailerlite_subscriber_id) {
        await q(`UPDATE crm.partner_contacts SET mailerlite_subscriber_id = $2 WHERE id = $1`, [
          candidate.contact_id,
          subscriberId,
        ])
      }
      for (const groupId of plan.removeGroupIds) {
        if (await unassignTolerant(subscriberId, groupId)) result.groups_fixed += 1
      }
    } catch (err) {
      result.errors.push({ email: domain, error: describeError(err) })
    }
  }

  for (const row of await loadRemovals()) {
    result.checked += 1
    const domain = emailDomain(row.email)
    try {
      // Anonymizovaný kontakt už e-mail nemá — MailerLite umí načíst odběratele
      // i podle jeho ID. Když ani to neprojde, projdou se všechny B2B skupiny
      // naslepo („není členem" vrací 404 a bere se jako hotovo).
      const lookup = row.email ?? row.mailerlite_subscriber_id
      const found = await withRateLimitRetry(() => getSubscriber(lookup))
      const groupIds = found ? planRemoval(found.groupIds) : [...B2B_GROUP_IDS]
      if (found && groupIds.length === 0) continue

      let removedAny = false
      for (const groupId of groupIds) {
        if (await unassignTolerant(row.mailerlite_subscriber_id, groupId)) removedAny = true
      }
      if (removedAny) result.removed += 1
    } catch (err) {
      result.errors.push({ email: domain, error: describeError(err) })
    }
  }

  return result
}

/** Shrnutí běhu do e-mailového alertu — opět bez celých adres. */
export function alertBody(result: SyncResult): string {
  const lines = result.errors
    .slice(0, 20)
    .map((e) => `<li>${e.email ? `@${e.email}` : 'bez adresy'}: ${e.error}</li>`)
    .join('')
  return (
    `<p>Sync CRM → MailerLite doběhl s chybami.</p>` +
    `<p>Zkontrolováno ${result.checked}, zapsáno ${result.upserted}, opraveno skupin ` +
    `${result.groups_fixed}, odebráno ${result.removed}, odhlášení zpět do CRM ` +
    `${result.unsubscribed_back}, chyb ${result.errors.length}.</p>` +
    `<ul>${lines}</ul>`
  )
}

/** Sdílené tělo cron i ručního spuštění — zámek, běh, audit, alert. */
export async function runSyncWithLock(actorId: string | null): Promise<
  { ok: true; result: SyncResult } | { ok: false; reason: 'locked' | 'failed'; error?: string }
> {
  if (!(await acquireJobLock(SYNC_LOCK_NAME))) return { ok: false, reason: 'locked' }
  try {
    const result = await runMailerLiteSync()
    await audit({
      actorId,
      action: 'mailerlite_sync',
      entity: 'newsletter_sync',
      entityId: null,
      diff: result,
    })
    if (result.errors.length > 0) {
      await sendAlert(`Sync MailerLite: ${result.errors.length} chyb`, alertBody(result))
    }
    return { ok: true, result }
  } catch (err) {
    const message = describeError(err)
    await audit({
      actorId,
      action: 'mailerlite_sync',
      entity: 'newsletter_sync',
      entityId: null,
      diff: { failed: true, error: message },
    })
    await sendAlert('Sync MailerLite spadl', `<p>Běh skončil chybou: ${message}</p>`)
    return { ok: false, reason: 'failed', error: message }
  } finally {
    await releaseJobLock(SYNC_LOCK_NAME)
  }
}
