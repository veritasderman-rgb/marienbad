import { beforeAll, describe, expect, it } from 'vitest'
import { generate } from 'otplib'

beforeAll(() => {
  process.env.PORTAL_SESSION_SECRET = 'test-session-secret-with-enough-entropy-123456'
  process.env.PORTAL_TOTP_KEY = 'test-totp-key-with-enough-entropy-abcdef0123'
})

describe('TOTP', () => {
  it('vygenerovaný kód projde, náhodný ne', async () => {
    const { generateTotpSecret, verifyTotpCode } = await import('../src/lib/portal/auth/totp')
    const secret = generateTotpSecret()
    const code = await generate({ secret })
    expect(await verifyTotpCode(secret, code)).toBe(true)
    expect(await verifyTotpCode(secret, '000000')).toBe(false)
  })

  it('odmítá vstupy, které nejsou 6 číslic', async () => {
    const { generateTotpSecret, verifyTotpCode } = await import('../src/lib/portal/auth/totp')
    const secret = generateTotpSecret()
    expect(await verifyTotpCode(secret, '12345')).toBe(false)
    expect(await verifyTotpCode(secret, 'abcdef')).toBe(false)
    expect(await verifyTotpCode(secret, '1234567')).toBe(false)
  })

  it('keyuri obsahuje e-mail a issuer', async () => {
    const { generateTotpSecret, totpKeyUri } = await import('../src/lib/portal/auth/totp')
    const uri = totpKeyUri('test@example.com', generateTotpSecret())
    expect(uri).toMatch(/^otpauth:\/\/totp\//)
    expect(uri).toContain('test%40example.com')
  })
})
