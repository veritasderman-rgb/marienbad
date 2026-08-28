import { describe, expect, it } from 'vitest'
import { escapeCsvCell, toCsv } from '../src/lib/portal/csv-export'

describe('CSV export (N-03)', () => {
  it('prefixuje rizikové buňky apostrofem', () => {
    expect(escapeCsvCell('=1+1')).toBe("'=1+1")
    expect(escapeCsvCell('+420123')).toBe("'+420123")
    expect(escapeCsvCell('-5')).toBe("'-5")
    expect(escapeCsvCell('@SUM(A1)')).toBe("'@SUM(A1)")
    expect(escapeCsvCell('=HYPERLINK("https://evil.example")')).toContain("'=HYPERLINK")
  })

  it('běžné hodnoty nechává být', () => {
    expect(escapeCsvCell('CK Alfa a.s.')).toBe('CK Alfa a.s.')
    expect(escapeCsvCell(123.45)).toBe('123.45')
    expect(escapeCsvCell(null)).toBe('')
  })

  it('uvozuje hodnoty se středníkem, uvozovkami a novým řádkem', () => {
    expect(escapeCsvCell('a;b')).toBe('"a;b"')
    expect(escapeCsvCell('řekl "ano"')).toBe('"řekl ""ano"""')
    expect(escapeCsvCell('a\nb')).toBe('"a\nb"')
  })

  it('výstup má BOM, středníky a CRLF', () => {
    const csv = toCsv(
      [{ name: 'CK Alfa a.s.', revenue: '=999' }],
      [
        { key: 'name', label: 'Partner' },
        { key: 'revenue', label: 'Obrat' },
      ],
    )
    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(csv).toContain('Partner;Obrat')
    expect(csv).toContain("CK Alfa a.s.;'=999")
    expect(csv).toContain('\r\n')
  })
})
