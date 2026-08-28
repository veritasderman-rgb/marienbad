import type { APIRoute } from 'astro'
import { createHash, randomUUID } from 'node:crypto'
import { json, jsonError, requireUser } from '../../../../../lib/portal/auth/guard'
import { audit, requestMeta } from '../../../../../lib/portal/audit'
import { q } from '../../../../../lib/portal/db'
import {
  ExcelError,
  MAX_BYTES,
  parseXlsx,
  suggestMapping,
  toHeaderMapping,
} from '../../../../../lib/portal/imports/excel'
import { isStorageConfigured, putObject } from '../../../../../lib/portal/storage'

export const prerender = false

const WRITE_ROLES = ['owner', 'editor'] as const
const SAMPLE_ROWS = 10
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

/** Klíč v R2 sestavuje server — z názvu souboru zbude jen bezpečná část. */
function safeFilename(raw: string): string {
  const base = raw.split(/[\\/]/).pop() ?? 'import.xlsx'
  const cleaned = base.replace(/[^A-Za-z0-9._-]/g, '_').replace(/^\.+/, '')
  return cleaned.slice(0, 120) || 'import.xlsx'
}

/**
 * Krok 1 průvodce importem výkonnosti (NAVRH 5.3): nahrání .xlsx, načtení
 * prvního listu a návrh mapování sloupců. Nic se ještě nezapisuje — řádky se
 * odloží do `imports.staging`, protože serverless nemá sdílenou paměť mezi
 * kroky průvodce.
 *
 * Strop 5 MB platí na vstup; parser si navíc hlídá rozbalená data
 * (10 000 řádků / 50 sloupců, audit N-10 — zip bomba).
 */
export const POST: APIRoute = async (context) => {
  const actor = requireUser(context, [...WRITE_ROLES])
  if (actor instanceof Response) return actor

  const contentType = (context.request.headers.get('content-type') ?? '').toLowerCase()
  if (!contentType.startsWith('multipart/form-data')) {
    return jsonError(400, 'expected_multipart')
  }

  let form: FormData
  try {
    form = await context.request.formData()
  } catch {
    return jsonError(400, 'bad_request')
  }

  const file = form.get('file')
  if (!(file instanceof File)) return jsonError(400, 'missing_file')
  if (!/\.xlsx$/i.test(file.name || '')) return jsonError(400, 'expected_xlsx')
  if (file.size > MAX_BYTES) return jsonError(413, 'too_large')

  const bytes = new Uint8Array(await file.arrayBuffer())
  if (bytes.byteLength === 0) return jsonError(400, 'empty_file')
  if (bytes.byteLength > MAX_BYTES) return jsonError(413, 'too_large')

  let parsed
  try {
    parsed = await parseXlsx(bytes)
  } catch (err) {
    if (err instanceof ExcelError) {
      return jsonError(err.code === 'too_large' ? 413 : 400, err.code)
    }
    throw err
  }
  if (parsed.rows.length === 0) return jsonError(400, 'empty_file')

  const importId = randomUUID()
  const filename = safeFilename(file.name || 'import.xlsx')
  const sha256 = createHash('sha256').update(bytes).digest('hex')

  // Uchování zdrojového souboru je „best effort": bez R2 (nebo při jeho výpadku)
  // import pokračuje, jen se do odpovědi vrátí varování a storage_path zůstane NULL.
  let storagePath: string | null = null
  let storageWarning = false
  if (isStorageConfigured()) {
    const key = `imports/performance/${importId}/${filename}`
    try {
      await putObject(key, bytes, XLSX_MIME)
      storagePath = key
    } catch (err) {
      console.error('[portal/import] uložení zdrojového souboru do R2 selhalo:', err)
      storageWarning = true
    }
  } else {
    storageWarning = true
  }

  await q(
    `INSERT INTO crm.imports
       (id, kind, filename, sha256, storage_path, rows_total, status, staging, uploaded_by)
     VALUES ($1, 'performance', $2, $3, $4, $5, 'uploaded', $6, $7)`,
    [
      importId,
      filename,
      sha256,
      storagePath,
      parsed.rows.length,
      JSON.stringify({ headers: parsed.headers, rows: parsed.rows }),
      actor.id,
    ],
  )

  const { ip, userAgent } = requestMeta(context.request)
  await audit({
    actorId: actor.id,
    action: 'import_upload',
    entity: 'imports',
    entityId: importId,
    diff: {
      kind: 'performance',
      filename,
      sha256,
      rows_total: parsed.rows.length,
      columns: parsed.headers.length,
      storage_path: storagePath,
    },
    ip,
    userAgent,
  })

  return json({
    ok: true,
    import_id: importId,
    headers: parsed.headers,
    sample: parsed.rows.slice(0, SAMPLE_ROWS),
    // {název sloupce: pole} — v tomto tvaru se mapování posílá i zpět do commitu
    suggested_mapping: toHeaderMapping(parsed.headers, suggestMapping(parsed.headers)),
    rows_total: parsed.rows.length,
    storage_warning: storageWarning,
  })
}
