import { describe, expect, it } from 'vitest'
import { normalizePayerName, validateIntakeRow, toEur } from '../src/lib/portal/payers'

describe('normalizace jmen plátců (NAVRH 6.2)', () => {
  it('odstraní diakritiku, velikost písmen a právní formy', () => {
    expect(normalizePayerName('CK Alfa a.s.')).toBe('ck alfa')
    expect(normalizePayerName('Beta Reisen GmbH')).toBe('beta reisen')
    expect(normalizePayerName('Gamma spol. s r.o.')).toBe('gamma')
    expect(normalizePayerName('Delta  Touristik GmbH & Co. KG')).toBe('delta touristik')
    expect(normalizePayerName('Hotely Mariánské Lázně, s.r.o.')).toBe('hotely marianske lazne')
  })

  it('různé zápisy téhož plátce mají stejný tvar', () => {
    expect(normalizePayerName('CK ALFA, a. s.')).toBe(normalizePayerName('ck Alfa a.s.'))
  })

  it('nesbíjí běžná slova', () => {
    expect(normalizePayerName('Astra Travel B.V.')).toBe('astra travel')
    expect(normalizePayerName('Booking.com B.V.')).toBe('booking com')
  })
})

describe('validace intake řádky', () => {
  it('platná řádka projde s výchozí měnou CZK', () => {
    const result = validateIntakeRow({ payer_name_raw: 'CK Alfa a.s.', hotel_slug: 'CL', revenue_amount: 123.456 }, 0)
    expect('ok' in result && result.ok.currency).toBe('CZK')
    expect('ok' in result && result.ok.revenue_amount).toBe(123.46)
  })

  it('odmítne chybějící jméno, hotel, nečíselný obrat a cizí měnu', () => {
    expect('err' in validateIntakeRow({ hotel_slug: 'CL', revenue_amount: 1 }, 0)).toBe(true)
    expect('err' in validateIntakeRow({ payer_name_raw: 'X', revenue_amount: 1 }, 0)).toBe(true)
    expect('err' in validateIntakeRow({ payer_name_raw: 'X', hotel_slug: 'CL', revenue_amount: 'abc' }, 0)).toBe(true)
    expect('err' in validateIntakeRow({ payer_name_raw: 'X', hotel_slug: 'CL', revenue_amount: 1, currency: 'USD' }, 0)).toBe(true)
  })
})

describe('přepočet měny (jen portál — NAVRH 6.3)', () => {
  it('EUR projde beze změny, CZK se dělí kurzem', () => {
    expect(toEur(100, 'EUR')).toEqual({ revenue_eur: 100, fx_rate: 1 })
    const czk = toEur(2500, 'CZK')
    expect(czk.fx_rate).toBeGreaterThan(0)
    expect(czk.revenue_eur).toBeCloseTo(2500 / czk.fx_rate, 1)
  })
})
