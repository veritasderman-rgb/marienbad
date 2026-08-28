import { describe, expect, it } from 'vitest'
import { isValidPeriod, pctChange, share, topWithRest } from '../src/lib/portal/dashboard'

describe('pctChange (MoM / YoY / R12)', () => {
  it('počítá růst i pokles', () => {
    expect(pctChange(120, 100)).toBe(20)
    expect(pctChange(80, 100)).toBe(-20)
    expect(pctChange(100, 100)).toBe(0)
  })

  it('zaokrouhluje na jedno desetinné místo', () => {
    expect(pctChange(1234, 1000)).toBe(23.4)
    expect(pctChange(1, 3)).toBe(-66.7)
  })

  it('vrací null, když chybí základ — z nuly nesmí vzniknout nekonečno', () => {
    expect(pctChange(1000, 0)).toBeNull()
    expect(pctChange(1000, null)).toBeNull()
    expect(pctChange(1000, undefined)).toBeNull()
    expect(pctChange(0, 0)).toBeNull()
  })

  it('vrací null, když chybí aktuální hodnota', () => {
    expect(pctChange(null, 100)).toBeNull()
    expect(pctChange(undefined, 100)).toBeNull()
  })

  it('nikdy nevrací NaN ani Infinity', () => {
    expect(pctChange(Number.NaN, 100)).toBeNull()
    expect(pctChange(100, Number.NaN)).toBeNull()
    expect(pctChange(Number.POSITIVE_INFINITY, 100)).toBeNull()
  })

  it('nula proti kladnému základu je −100 %', () => {
    expect(pctChange(0, 250)).toBe(-100)
  })
})

describe('share (podíly v rozpadu)', () => {
  it('počítá podíl v procentech', () => {
    expect(share(25, 100)).toBe(25)
    expect(share(1, 3)).toBe(33.3)
  })

  it('nulový nebo chybějící celek dává 0, ne dělení nulou', () => {
    expect(share(10, 0)).toBe(0)
    expect(share(10, null)).toBe(0)
    expect(share(0, 0)).toBe(0)
  })

  it('chybějící část dává 0', () => {
    expect(share(null, 100)).toBe(0)
    expect(share(undefined, 100)).toBe(0)
    expect(share(Number.NaN, 100)).toBe(0)
  })

  it('součet podílů rozpadu dá zhruba 100 %', () => {
    const parts = [500, 300, 150, 50]
    const total = parts.reduce((a, b) => a + b, 0)
    const sum = parts.reduce((acc, part) => acc + share(part, total), 0)
    expect(sum).toBeCloseTo(100, 5)
  })

  it('koncentrace top 5 je podíl na celku', () => {
    expect(share(700, 1000)).toBe(70)
  })
})

describe('topWithRest (top N + OSTATNÍ)', () => {
  const rest = (revenue_eur: number) => ({ country: 'OSTATNÍ', revenue_eur })

  it('kratší seznam nechá být', () => {
    const rows = [
      { country: 'DE', revenue_eur: 10 },
      { country: 'CZ', revenue_eur: 5 },
    ]
    expect(topWithRest(rows, 8, rest)).toEqual(rows)
  })

  it('zbytek sloučí do jednoho řádku', () => {
    const rows = [
      { country: 'DE', revenue_eur: 100 },
      { country: 'AT', revenue_eur: 50 },
      { country: 'CZ', revenue_eur: 30 },
      { country: 'RU', revenue_eur: 20 },
    ]
    expect(topWithRest(rows, 2, rest)).toEqual([
      { country: 'DE', revenue_eur: 100 },
      { country: 'AT', revenue_eur: 50 },
      { country: 'OSTATNÍ', revenue_eur: 50 },
    ])
  })

  it('nepřidává prázdný zbytkový řádek', () => {
    const rows = [
      { country: 'DE', revenue_eur: 100 },
      { country: 'AT', revenue_eur: 0 },
    ]
    expect(topWithRest(rows, 1, rest)).toEqual([{ country: 'DE', revenue_eur: 100 }])
  })

  it('zbytek zaokrouhluje na haléře', () => {
    const rows = [
      { country: 'DE', revenue_eur: 100 },
      { country: 'AT', revenue_eur: 0.005 },
      { country: 'CZ', revenue_eur: 0.005 },
    ]
    expect(topWithRest(rows, 1, rest)).toEqual([
      { country: 'DE', revenue_eur: 100 },
      { country: 'OSTATNÍ', revenue_eur: 0.01 },
    ])
  })
})

describe('isValidPeriod', () => {
  it('přijímá jen YYYY-MM s platným měsícem', () => {
    expect(isValidPeriod('2026-01')).toBe(true)
    expect(isValidPeriod('2026-12')).toBe(true)
  })

  it('odmítá nesmysly a pokusy o vsunutí SQL', () => {
    expect(isValidPeriod('2026-13')).toBe(false)
    expect(isValidPeriod('2026-00')).toBe(false)
    expect(isValidPeriod('2026-1')).toBe(false)
    expect(isValidPeriod('2026-01-01')).toBe(false)
    expect(isValidPeriod("2026-01'; DROP TABLE crm.partners; --")).toBe(false)
    expect(isValidPeriod('')).toBe(false)
  })
})
