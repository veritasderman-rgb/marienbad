import { describe, expect, it } from 'vitest'
import {
  evaluateRisk,
  isEndedInsolvency,
  projectInsolvency,
  type InsolvencyRecord,
} from '../src/lib/portal/verifications/hlidac'

function insolvency(partial: Partial<InsolvencyRecord>): InsolvencyRecord {
  return {
    file_number: 'INS 1/2026',
    state: null,
    state_description: null,
    started_on: null,
    last_changed_on: null,
    court: null,
    as_debtor: false,
    as_creditor: false,
    detail_url: null,
    ...partial,
  }
}

describe('risk engine (NAVRH 5.5)', () => {
  it('věřitel v mnoha řízeních = ok — riziko nese as_Debtor, ne počet', () => {
    const many = Array.from({ length: 185 }, () => insolvency({ as_creditor: true }))
    const result = evaluateRisk({ insolvencies: many, vat: null, criminal: null })
    expect(result.level).toBe('ok')
    expect(result.insolvency_as_debtor_count).toBe(0)
  })

  it('otevřená insolvence jako dlužník = alert', () => {
    const result = evaluateRisk({
      insolvencies: [insolvency({ as_debtor: true, state: 'ODDLUŽENÍ' })],
      vat: null,
      criminal: null,
    })
    expect(result.level).toBe('alert')
    expect(result.insolvency_as_debtor_open).toBe(true)
  })

  it('nejednoznačný stav u dlužníka se čte jako otevřený (bezpečná strana)', () => {
    const result = evaluateRisk({
      insolvencies: [insolvency({ as_debtor: true, state: null })],
      vat: null,
      criminal: null,
    })
    expect(result.level).toBe('alert')
  })

  it('pravomocně skončená insolvence dlužníka do 3 let = watch, starší = ok', () => {
    const recent = evaluateRisk({
      insolvencies: [
        insolvency({ as_debtor: true, state: 'SKONČENÁ', last_changed_on: new Date(Date.now() - 300 * 24 * 3600 * 1000).toISOString() }),
      ],
      vat: null,
      criminal: null,
    })
    expect(recent.level).toBe('watch')
    const old = evaluateRisk({
      insolvencies: [
        insolvency({ as_debtor: true, state: 'SKONČENÁ', last_changed_on: '2019-01-01T00:00:00Z' }),
      ],
      vat: null,
      criminal: null,
    })
    expect(old.level).toBe('ok')
  })

  it('nespolehlivý plátce DPH teď = alert, dříve = watch', () => {
    expect(
      evaluateRisk({ insolvencies: [], vat: { is_currently_unreliable: true, was_ever_listed: true }, criminal: null }).level,
    ).toBe('alert')
    expect(
      evaluateRisk({ insolvencies: [], vat: { is_currently_unreliable: false, was_ever_listed: true }, criminal: null }).level,
    ).toBe('watch')
  })

  it('záznam v trestním rejstříku = alert', () => {
    expect(
      evaluateRisk({ insolvencies: [], vat: null, criminal: { records_count: 1 } }).level,
    ).toBe('alert')
  })

  it('vše čisté = ok', () => {
    expect(
      evaluateRisk({
        insolvencies: [],
        vat: { is_currently_unreliable: false, was_ever_listed: false },
        criminal: { records_count: 0 },
      }).level,
    ).toBe('ok')
  })
})

describe('projekce insolvence — whitelist (čl. 9)', () => {
  it('kopíruje jen whitelistovaná pole; cokoli navíc se zahodí', () => {
    const projected = projectInsolvency({
      file_Number: 'INS 9859/2025',
      state: 'ODDLUŽENÍ',
      as_Debtor: false,
      as_Creditor: true,
      court: 'KS Ústí',
      political_Involvement: 'strana XY', // pole čl. 9 — NESMÍ projít
      debtors: [{ name: 'Jan Novák', birthDate: '1980-01-01' }],
    })
    expect(projected).not.toBeNull()
    expect(projected!.as_creditor).toBe(true)
    const json = JSON.stringify(projected)
    expect(json).not.toContain('political')
    expect(json).not.toContain('strana XY')
    expect(json).not.toContain('Novák')
    expect(json).not.toContain('birthDate')
  })

  it('isEndedInsolvency pozná skončené stavy', () => {
    expect(isEndedInsolvency('SKONČENÁ', null)).toBe(true)
    expect(isEndedInsolvency(null, 'Řízení pravomocně skončeno')).toBe(true)
    expect(isEndedInsolvency('ODDLUŽENÍ', 'Povoleno oddlužení')).toBe(false)
    expect(isEndedInsolvency(null, null)).toBe(false)
  })
})
