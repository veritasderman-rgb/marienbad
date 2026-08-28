/**
 * Sdílená CSV export utilita (audit N-03) — JEDINÁ cesta, kterou portál
 * vyrábí CSV. Hodnoty začínající =, +, -, @ (nebo TAB/CR) se prefixují
 * apostrofem, aby je Excel nevyhodnotil jako vzorec (DDE / =HYPERLINK…) —
 * název partnera přichází z importů a nedá se mu věřit.
 *
 * Formát pro české Excely: BOM + středník + CRLF.
 */

export interface CsvColumn {
  key: string
  label: string
}

const FORMULA_PREFIX = /^[=+\-@\t\r]/

export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  let text = String(value)
  if (FORMULA_PREFIX.test(text)) {
    text = `'${text}`
  }
  if (/[";\n\r]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function toCsv(rows: Record<string, unknown>[], columns: CsvColumn[]): string {
  const header = columns.map((c) => escapeCsvCell(c.label)).join(';')
  const lines = rows.map((row) => columns.map((c) => escapeCsvCell(row[c.key])).join(';'))
  return `\uFEFF${[header, ...lines].join('\r\n')}\r\n`
}

export function csvResponse(filename: string, csv: string): Response {
  const safeName = filename.replace(/[^A-Za-z0-9._-]/g, '_')
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeName}"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
