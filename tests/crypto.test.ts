import { beforeAll, describe, expect, it } from 'vitest'

beforeAll(() => {
  process.env.PORTAL_SESSION_SECRET = 'test-session-secret-with-enough-entropy-123456'
  process.env.PORTAL_TOTP_KEY = 'test-totp-key-with-enough-entropy-abcdef0123'
})

describe('crypto', () => {
  it('randomToken má dostatečnou entropii a je base64url', async () => {
    const { randomToken } = await import('../src/lib/portal/crypto')
    const token = randomToken(32)
    expect(token.length).toBeGreaterThanOrEqual(43) // 32 B → 43 znaků base64url
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(randomToken(32)).not.toBe(token)
  })

  it('safeEqual porovnává v konstantním čase i různé délky', async () => {
    const { safeEqual } = await import('../src/lib/portal/crypto')
    expect(safeEqual('abc', 'abc')).toBe(true)
    expect(safeEqual('abc', 'abd')).toBe(false)
    expect(safeEqual('abc', 'abcdef')).toBe(false)
    expect(safeEqual('', '')).toBe(true)
  })

  it('podepsaný state projde jen se správným účelem a do expirace', async () => {
    const { signState, verifyState } = await import('../src/lib/portal/crypto')
    const token = signState('mfa', 'user-123', 60)
    expect(verifyState(token, 'mfa')).toEqual({ userId: 'user-123' })
    expect(verifyState(token, 'totp_setup')).toBeNull()
    expect(verifyState(token + 'x', 'mfa')).toBeNull()
    const expired = signState('mfa', 'user-123', -10)
    expect(verifyState(expired, 'mfa')).toBeNull()
  })

  it('state s pozměněným payloadem neprojde', async () => {
    const { signState, verifyState } = await import('../src/lib/portal/crypto')
    const token = signState('mfa', 'user-123', 60)
    const [body, mac] = [token.slice(0, token.lastIndexOf('.')), token.slice(token.lastIndexOf('.') + 1)]
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    payload.uid = 'user-999'
    const forged = `${Buffer.from(JSON.stringify(payload)).toString('base64url')}.${mac}`
    expect(verifyState(forged, 'mfa')).toBeNull()
  })

  it('šifrování TOTP tajemství je vratné a autentizované', async () => {
    const { encryptSecret, decryptSecret } = await import('../src/lib/portal/crypto')
    const secret = 'JBSWY3DPEHPK3PXP'
    const stored = encryptSecret(secret)
    expect(stored).not.toContain(secret)
    expect(decryptSecret(stored)).toBe(secret)
    const [iv, ct, tag] = stored.split('.')
    const tampered = `${iv}.${ct.slice(0, -2)}AA.${tag}`
    expect(() => decryptSecret(tampered)).toThrow()
  })
})
