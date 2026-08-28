import { q } from './db'

export interface AuditEntry {
  actorId: string | null
  action: string
  entity: string
  entityId?: string | null
  diff?: unknown
  ip?: string | null
  userAgent?: string | null
}

/** Zápis do append-only audit logu. Selhání auditu nesmí shodit operaci — loguje se. */
export async function audit(entry: AuditEntry): Promise<void> {
  try {
    await q(
      `INSERT INTO crm.audit_log (actor_id, action, entity, entity_id, diff, ip, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        entry.actorId,
        entry.action,
        entry.entity,
        entry.entityId ?? null,
        entry.diff === undefined ? null : JSON.stringify(entry.diff),
        entry.ip ?? null,
        entry.userAgent ?? null,
      ],
    )
  } catch (err) {
    console.error('[portal/audit] zápis do audit logu selhal:', err)
  }
}

export function requestMeta(request: Request): { ip: string | null; userAgent: string | null } {
  const forwarded = request.headers.get('x-forwarded-for')
  return {
    ip: forwarded ? forwarded.split(',')[0].trim() : null,
    userAgent: request.headers.get('user-agent'),
  }
}
