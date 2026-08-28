import type { APIRoute } from 'astro'
import { json, jsonError, requireUser } from '../../../../lib/portal/auth/guard'
import { q } from '../../../../lib/portal/db'

export const prerender = false

const READ_ROLES = ['owner', 'editor', 'analyst'] as const
const KINDS = ['partners', 'performance'] as const
const LIMIT = 100

/**
 * Historie importů. `staging` se ZÁMĚRNĚ nevrací — je to pracovní mezistav
 * s osobními údaji z nahraného souboru, do výpisu nepatří.
 */
export const GET: APIRoute = async (context) => {
  const user = requireUser(context, [...READ_ROLES])
  if (user instanceof Response) return user

  const kindParam = context.url.searchParams.get('kind')
  if (kindParam !== null && !(KINDS as readonly string[]).includes(kindParam)) {
    return jsonError(400, 'invalid_kind')
  }

  // 'performance' zahrnuje i importy natažené z PMS (kind 'performance_pms')
  const kinds =
    kindParam === null
      ? null
      : kindParam === 'performance'
        ? ['performance', 'performance_pms']
        : [kindParam]

  const imports = await q(
    `SELECT i.id, i.kind, i.filename, i.rows_total, i.rows_ok, i.rows_failed, i.rows_duplicate,
            i.status, i.storage_path, i.uploaded_at, u.display_name AS uploaded_by_name
       FROM crm.imports i
       LEFT JOIN crm.portal_users u ON u.id = i.uploaded_by
      WHERE ($1::text[] IS NULL OR i.kind = ANY($1::text[]))
      ORDER BY i.uploaded_at DESC
      LIMIT ${LIMIT}`,
    [kinds],
  )

  return json({ imports })
}
