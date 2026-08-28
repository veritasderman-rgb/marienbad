import { describe, expect, it } from 'vitest'
import type { PortalRole } from '../src/lib/portal/auth/session'
import { maskContact, maskEmail, maskPhone, shouldMaskContacts } from '../src/lib/portal/crm/mask'

/** Fiktivní partneři — repozitář je veřejný, žádná reálná data. */
const CONTACT = {
  id: 'c1',
  partner_id: 'p1',
  first_name: 'Jana',
  last_name: 'Nováková',
  email: 'jana@ck-alfa.example',
  phone: '+420 601 234 456',
}

describe('shouldMaskContacts', () => {
  it('nemaskuje owner a editor, maskuje analyst a viewer', () => {
    expect(shouldMaskContacts('owner')).toBe(false)
    expect(shouldMaskContacts('editor')).toBe(false)
    expect(shouldMaskContacts('analyst')).toBe(true)
    expect(shouldMaskContacts('viewer')).toBe(true)
  })
})

describe('maskEmail', () => {
  it('nechá první znak lokální části a doménu', () => {
    expect(maskEmail('jana@ck-alfa.example')).toBe('j***@ck-alfa.example')
    expect(maskEmail('info@beta-reisen.example')).toBe('i***@beta-reisen.example')
  })

  it('neprozradí délku ani obsah u nevalidního tvaru', () => {
    expect(maskEmail('@ck-alfa.example')).toBe('•••')
    expect(maskEmail('bez-zavinace')).toBe('•••')
  })

  it('propouští null beze změny', () => {
    expect(maskEmail(null)).toBeNull()
  })

  it('nikdy neponechá celou lokální část', () => {
    const masked = maskEmail('objednavky@ck-alfa.example')
    expect(masked).not.toContain('objednavky')
    expect(masked?.startsWith('o')).toBe(true)
  })
})

describe('maskPhone', () => {
  it('nechá předvolbu a poslední tři číslice', () => {
    expect(maskPhone('+420 601 234 456')).toBe('+420•••456')
    expect(maskPhone('601234456')).toBe('601•••456')
  })

  it('krátká čísla maskuje celá', () => {
    expect(maskPhone('12345')).toBe('•••')
  })

  it('propouští null beze změny', () => {
    expect(maskPhone(null)).toBeNull()
  })
})

describe('maskContact', () => {
  it('owner a editor vidí nemaskované hodnoty', () => {
    for (const role of ['owner', 'editor'] as PortalRole[]) {
      const result = maskContact({ ...CONTACT }, role)
      expect(result.email).toBe(CONTACT.email)
      expect(result.phone).toBe(CONTACT.phone)
    }
  })

  it('analyst ani viewer nedostanou nemaskovanou hodnotu do JSON', () => {
    for (const role of ['analyst', 'viewer'] as PortalRole[]) {
      const result = maskContact({ ...CONTACT }, role)
      const payload = JSON.stringify(result)
      expect(payload).not.toContain('jana@ck-alfa.example')
      expect(payload).not.toContain('601 234')
      expect(payload).not.toContain('6012344')
      expect(result.email).toBe('j***@ck-alfa.example')
      expect(result.phone).toBe('+420•••456')
    }
  })

  it('ostatní pole zůstávají a vstup se nemění', () => {
    const input = { ...CONTACT }
    const result = maskContact(input, 'analyst')
    expect(result.first_name).toBe('Jana')
    expect(result.id).toBe('c1')
    expect(input.email).toBe(CONTACT.email)
  })

  it('null hodnoty přežijí maskování', () => {
    const result = maskContact({ ...CONTACT, email: null, phone: null }, 'analyst')
    expect(result.email).toBeNull()
    expect(result.phone).toBeNull()
  })
})
