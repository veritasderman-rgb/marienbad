import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword, validatePasswordPolicy } from '../src/lib/portal/auth/passwords'

describe('hesla', () => {
  it('politika: minimálně 12 znaků', () => {
    expect(validatePasswordPolicy('kratke')).toBeTruthy()
    expect(validatePasswordPolicy('a'.repeat(11))).toBeTruthy()
    expect(validatePasswordPolicy('dvanact-znaku!')).toBeNull()
    expect(validatePasswordPolicy('x'.repeat(201))).toBeTruthy()
  })

  it('argon2id otisk ověří správné heslo a odmítne špatné', async () => {
    const hash = await hashPassword('spravne-heslo-123')
    expect(hash).toContain('$argon2id$')
    expect(await verifyPassword(hash, 'spravne-heslo-123')).toBe(true)
    expect(await verifyPassword(hash, 'spatne-heslo-123')).toBe(false)
    expect(await verifyPassword('rozbity-otisk', 'cokoliv')).toBe(false)
  })

  it('dva otisky téhož hesla se liší (unikátní sůl)', async () => {
    const [a, b] = await Promise.all([hashPassword('stejne-heslo-abc'), hashPassword('stejne-heslo-abc')])
    expect(a).not.toBe(b)
  })
})
