/**
 * CSV parser pro importy (NAVRH sekce 5.4).
 *
 * Počítá s tím, na čem to v Česku obvykle padá:
 *  - oddělovač `;` místo čárky (české Excely) — detekuje se z obsahu,
 *  - kódování Windows-1250 místo UTF-8 — detekuje se z bajtů,
 *  - CRLF i LF, uvozovky a nové řádky uvnitř buněk (RFC 4180).
 *
 * Tvrdé stropy (audit N-10): 5 MB vstupu, 5000 datových řádků, 100 sloupců.
 * Překročení kteréhokoli z nich skončí chybou `too_large` — parser se nikdy
 * nepokouší zpracovat neomezeně velký vstup.
 *
 * Čistý modul bez DB a bez env — testuje se v tests/csv.test.ts.
 */

export const MAX_BYTES = 5 * 1024 * 1024
export const MAX_ROWS = 5000
export const MAX_COLUMNS = 100

export type CsvEncoding = 'utf-8' | 'windows-1250'
export type CsvDelimiter = ';' | ',' | '\t'

export interface ParsedCsv {
  encoding: CsvEncoding
  delimiter: CsvDelimiter
  headers: string[]
  rows: string[][]
}

/** Chyba s kódem, který se propisuje do odpovědi API (`too_large`, …). */
export class CsvError extends Error {
  readonly code: string

  constructor(code: string) {
    super(code)
    this.name = 'CsvError'
    this.code = code
  }
}

const BOM = [0xef, 0xbb, 0xbf]

/**
 * Kódování: BOM rozhoduje. Bez BOM se zkusí striktní UTF-8; když neprojde
 * (nebo projde, ale nese znaky, které se v UTF-8 CSV nevyskytují — náhradní
 * znak U+FFFD nebo řídicí znaky C1), bere se Windows-1250.
 */
export function decodeCsv(bytes: Uint8Array): { text: string; encoding: CsvEncoding } {
  const hasBom = bytes.length >= 3 && BOM.every((b, i) => bytes[i] === b)
  const body = hasBom ? bytes.subarray(3) : bytes

  if (hasBom) {
    return { text: new TextDecoder('utf-8').decode(body), encoding: 'utf-8' }
  }

  let utf8: string | null = null
  try {
    utf8 = new TextDecoder('utf-8', { fatal: true }).decode(body)
  } catch {
    utf8 = null
  }
  if (utf8 !== null && !hasCp1250Artifacts(utf8)) {
    return { text: utf8, encoding: 'utf-8' }
  }
  return { text: new TextDecoder('windows-1250').decode(body), encoding: 'windows-1250' }
}

/** Náhradní znak nebo C1 řídicí znaky = dekódovalo se špatným kódováním. */
function hasCp1250Artifacts(text: string): boolean {
  return /[\uFFFD\u0080-\u009F]/.test(text)
}

/**
 * Oddělovač: spočítá kandidáty v prvních řádcích mimo uvozovky.
 * Při rovnosti (i nula výskytů) vyhrává pořadí `;` → `,` → tab.
 */
export function detectDelimiter(text: string): CsvDelimiter {
  const counts: Record<CsvDelimiter, number> = { ';': 0, ',': 0, '\t': 0 }
  const scanLimit = Math.min(text.length, 64 * 1024)
  let inQuotes = false
  let lines = 0

  for (let i = 0; i < scanLimit && lines < 10; i += 1) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') i += 1
        else inQuotes = false
      }
      continue
    }
    if (ch === '"') {
      inQuotes = true
      continue
    }
    if (ch === '\n') {
      lines += 1
      continue
    }
    if (ch === ';' || ch === ',' || ch === '\t') counts[ch] += 1
  }

  const order: CsvDelimiter[] = [';', ',', '\t']
  let best: CsvDelimiter = ','
  let bestCount = 0
  for (const candidate of order) {
    if (counts[candidate] > bestCount) {
      best = candidate
      bestCount = counts[candidate]
    }
  }
  return bestCount === 0 ? ',' : best
}

/**
 * RFC 4180: uvozovky uvozují celé pole, `""` je escapovaná uvozovka,
 * uvnitř uvozovek smí být oddělovač i konec řádku. Úplně prázdné řádky
 * (jediné prázdné pole) se zahazují — typicky konec souboru.
 */
export function parseRecords(text: string, delimiter: string): string[][] {
  const records: string[][] = []
  let record: string[] = []
  let field = ''
  let inQuotes = false
  let dirty = false // řádek obsahuje aspoň nějaký znak nebo oddělovač

  const endField = (): void => {
    record.push(field)
    field = ''
    if (record.length > MAX_COLUMNS) throw new CsvError('too_large')
  }

  const endRecord = (): void => {
    endField()
    if (dirty || record.length > 1 || record[0] !== '') {
      records.push(record)
      // header + MAX_ROWS datových řádků
      if (records.length > MAX_ROWS + 1) throw new CsvError('too_large')
    }
    record = []
    dirty = false
  }

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]
    // NUL by neprošel do jsonb (staging) — zahazuje se v obou stavech
    if (ch === '\u0000') continue

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
      continue
    }

    if (ch === '"' && field === '') {
      inQuotes = true
      dirty = true
      continue
    }
    if (ch === delimiter) {
      dirty = true
      endField()
      continue
    }
    if (ch === '\r') {
      if (text[i + 1] === '\n') i += 1
      endRecord()
      continue
    }
    if (ch === '\n') {
      endRecord()
      continue
    }
    field += ch
    dirty = true
  }

  if (dirty || field !== '' || record.length > 0) endRecord()
  return records
}

export function parseCsv(bytes: Uint8Array): ParsedCsv {
  if (bytes.byteLength > MAX_BYTES) throw new CsvError('too_large')

  const { text, encoding } = decodeCsv(bytes)
  const delimiter = detectDelimiter(text)
  const records = parseRecords(text, delimiter)

  const headers = (records[0] ?? []).map((h) => h.trim())
  const rows = records.slice(1)
  if (rows.length > MAX_ROWS) throw new CsvError('too_large')

  return { encoding, delimiter, headers, rows }
}
