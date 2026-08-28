import { describe, expect, it } from 'vitest'
import {
  CsvError,
  MAX_COLUMNS,
  MAX_ROWS,
  decodeCsv,
  detectDelimiter,
  parseCsv,
  parseRecords,
} from '../src/lib/portal/imports/csv'

/** Fixtury jsou fiktivní firmy — repozitář je veřejný. */
const ALFA = 'CK Alfa a.s.'
const ALFA_EMAIL = 'info@ck-alfa.example'

function utf8(text: string): Uint8Array {
  return new Uint8Array(Buffer.from(text, 'utf8'))
}

function withBom(text: string): Uint8Array {
  return new Uint8Array(Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(text, 'utf8')]))
}

/** Bajty ve Windows-1250 — přesně to, co vypadne z českého Excelu. */
function cp1250(...parts: (string | number)[]): Uint8Array {
  const bytes: number[] = []
  for (const part of parts) {
    if (typeof part === 'number') bytes.push(part)
    else for (const ch of part) bytes.push(ch.charCodeAt(0))
  }
  return new Uint8Array(bytes)
}

const CH_c = 0xe8 // č
const CH_C = 0xc8 // Č
const CH_z = 0x9e // ž
const CH_a = 0xe1 // á
const CH_e = 0xec // ě
const CH_r = 0xf8 // ř
const CH_i = 0xed // í

describe('decodeCsv', () => {
  it('podle BOM zvolí utf-8 a BOM zahodí', () => {
    const { text, encoding } = decodeCsv(withBom('Firma;IČO\n'))
    expect(encoding).toBe('utf-8')
    expect(text).toBe('Firma;IČO\n')
  })

  it('bez BOM přečte platné utf-8 s diakritikou', () => {
    const { text, encoding } = decodeCsv(utf8('Název;IČO\nCK Alfa a.s.;00177041\n'))
    expect(encoding).toBe('utf-8')
    expect(text).toContain('Název')
  })

  it('při neplatném utf-8 přepne na windows-1250', () => {
    const bytes = cp1250('N', CH_a, 'zev;I', CH_C, 'O\n')
    const { text, encoding } = decodeCsv(bytes)
    expect(encoding).toBe('windows-1250')
    expect(text).toBe('Název;IČO\n')
  })

  it('dekóduje typické české znaky z windows-1250', () => {
    const bytes = cp1250('Zden', CH_e, 'k Ho', CH_r, CH_i, 'k, ', CH_z, 'lut', CH_c, 'k')
    expect(decodeCsv(bytes).text).toBe('Zdeněk Hořík, žlutčk')
  })

  it('čistě ASCII soubor bere jako utf-8', () => {
    expect(decodeCsv(utf8('Company,Email\n')).encoding).toBe('utf-8')
  })
})

describe('detectDelimiter', () => {
  it('pozná středník v českém exportu', () => {
    expect(detectDelimiter('Firma;IČO;E-mail\nCK Alfa a.s.;00177041;info@ck-alfa.example\n')).toBe(';')
  })

  it('pozná čárku', () => {
    expect(detectDelimiter('Company,Email,First name\nCK Alfa a.s.,info@ck-alfa.example,Jan\n')).toBe(',')
  })

  it('pozná tabulátor', () => {
    expect(detectDelimiter('Company\tEmail\nCK Alfa a.s.\tinfo@ck-alfa.example\n')).toBe('\t')
  })

  it('ignoruje oddělovače uvnitř uvozovek', () => {
    // v uvozovkách je pět čárek, mimo ně dva středníky
    const text = 'Firma;Poznamka;Email\n"Alfa, Beta, Gama, Delta, Epsilon";x;y\n'
    expect(detectDelimiter(text)).toBe(';')
  })

  it('u jediného sloupce padne na čárku', () => {
    expect(detectDelimiter('Email\ninfo@ck-alfa.example\n')).toBe(',')
  })
})

describe('parseRecords', () => {
  it('zvládne uvozovky, escapované uvozovky a oddělovač v buňce', () => {
    const records = parseRecords('a;b\n"x;y";"on ""řekl"" ano"\n', ';')
    expect(records).toEqual([
      ['a', 'b'],
      ['x;y', 'on "řekl" ano'],
    ])
  })

  it('zvládne nový řádek uvnitř buňky', () => {
    const records = parseRecords('a;b\n"prvni\ndruhy";x\n', ';')
    expect(records).toEqual([
      ['a', 'b'],
      ['prvni\ndruhy', 'x'],
    ])
  })

  it('bere CRLF i LF a zahodí prázdný poslední řádek', () => {
    expect(parseRecords('a;b\r\n1;2\r\n', ';')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ])
    expect(parseRecords('a;b\n1;2\n\n', ';')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ])
  })

  it('zachová prázdné buňky', () => {
    expect(parseRecords('a;b;c\n1;;3', ';')).toEqual([
      ['a', 'b', 'c'],
      ['1', '', '3'],
    ])
  })

  it('odmítne příliš mnoho sloupců', () => {
    const wide = Array.from({ length: MAX_COLUMNS + 1 }, (_, i) => `c${i}`).join(';')
    expect(() => parseRecords(wide, ';')).toThrow(CsvError)
    expect(() => parseRecords(wide, ';')).toThrow('too_large')
  })

  it('odmítne příliš mnoho řádků', () => {
    const many = ['h', ...Array.from({ length: MAX_ROWS + 1 }, (_, i) => String(i))].join('\n')
    expect(() => parseRecords(many, ';')).toThrow('too_large')
  })
})

describe('parseCsv', () => {
  it('rozparsuje český export se středníkem a diakritikou', () => {
    const parsed = parseCsv(utf8(`Firma;IČO;E-mail\n${ALFA};00177041;${ALFA_EMAIL}\n`))
    expect(parsed.encoding).toBe('utf-8')
    expect(parsed.delimiter).toBe(';')
    expect(parsed.headers).toEqual(['Firma', 'IČO', 'E-mail'])
    expect(parsed.rows).toEqual([[ALFA, '00177041', ALFA_EMAIL]])
  })

  it('rozparsuje anglický export s čárkou', () => {
    const parsed = parseCsv(utf8(`Company,Email,First name\r\n${ALFA},${ALFA_EMAIL},Jan\r\n`))
    expect(parsed.delimiter).toBe(',')
    expect(parsed.headers).toEqual(['Company', 'Email', 'First name'])
    expect(parsed.rows).toEqual([[ALFA, ALFA_EMAIL, 'Jan']])
  })

  it('rozparsuje soubor ve windows-1250', () => {
    const bytes = cp1250(
      'N', CH_a, 'zev;I', CH_C, 'O\n',
      'CK Alfa a.s.;00177041\n',
      'Cestovka Slune', CH_c, 'nice;60192755\n',
    )
    const parsed = parseCsv(bytes)
    expect(parsed.encoding).toBe('windows-1250')
    expect(parsed.delimiter).toBe(';')
    expect(parsed.headers).toEqual(['Název', 'IČO'])
    expect(parsed.rows).toEqual([
      ['CK Alfa a.s.', '00177041'],
      ['Cestovka Slunečnice', '60192755'],
    ])
  })

  it('zahodí BOM z hlavičky prvního sloupce', () => {
    const parsed = parseCsv(withBom('Firma;IČO\nCK Alfa a.s.;00177041\n'))
    expect(parsed.headers[0]).toBe('Firma')
  })

  it('u prázdného vstupu vrátí prázdnou hlavičku', () => {
    const parsed = parseCsv(new Uint8Array())
    expect(parsed.headers).toEqual([])
    expect(parsed.rows).toEqual([])
  })

  it('odmítne vstup nad 5 MB', () => {
    const big = new Uint8Array(5 * 1024 * 1024 + 1)
    expect(() => parseCsv(big)).toThrow('too_large')
  })
})
