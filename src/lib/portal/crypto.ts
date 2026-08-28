import { createHash, createHmac, randomBytes, timingSafeEqual, createCipheriv, createDecipheriv } from 'node:crypto'
import { requireEnv } from './env'

/** Náhodný token s ≥ 32 bajty entropie, base64url (bez paddingu). */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url')
}

export function sha256hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

/**
 * Porovnání v konstantním čase i pro různě dlouhé vstupy — oba se nejdřív
 * zahashují na pevnou délku, takže se nikdy neporovnávají syrové hodnoty.
 */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a, 'utf8').digest()
  const hb = createHash('sha256').update(b, 'utf8').digest()
  return timingSafeEqual(ha, hb)
}

// ---------------------------------------------------------------------------
// Podepsané krátkodobé stavy (mezi heslem a TOTP) — HMAC, žádná vlastní krypto
// ---------------------------------------------------------------------------

type StatePurpose = 'mfa' | 'totp_setup'

interface StatePayload {
  p: StatePurpose
  uid: string
  exp: number // unix sekundy
}

function stateKey(): Buffer {
  return createHash('sha256').update(requireEnv('PORTAL_SESSION_SECRET')).digest()
}

export function signState(purpose: StatePurpose, userId: string, ttlSeconds = 300): string {
  const payload: StatePayload = { p: purpose, uid: userId, exp: Math.floor(Date.now() / 1000) + ttlSeconds }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const mac = createHmac('sha256', stateKey()).update(body).digest('base64url')
  return `${body}.${mac}`
}

export function verifyState(token: string, purpose: StatePurpose): { userId: string } | null {
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return null
  const body = token.slice(0, dot)
  const mac = token.slice(dot + 1)
  const expected = createHmac('sha256', stateKey()).update(body).digest('base64url')
  if (!safeEqual(mac, expected)) return null
  let payload: StatePayload
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  } catch {
    return null
  }
  if (payload.p !== purpose) return null
  if (!payload.uid || typeof payload.uid !== 'string') return null
  if (payload.exp < Math.floor(Date.now() / 1000)) return null
  return { userId: payload.uid }
}

// ---------------------------------------------------------------------------
// AES-256-GCM pro TOTP tajemství (klíč PORTAL_TOTP_KEY)
// ---------------------------------------------------------------------------

function totpKey(): Buffer {
  // Klíč se odvozuje hashem, takže env hodnota může být libovolný ≥32znakový řetězec
  return createHash('sha256').update(requireEnv('PORTAL_TOTP_KEY')).digest()
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', totpKey(), iv)
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('base64url')}.${ct.toString('base64url')}.${tag.toString('base64url')}`
}

export function decryptSecret(stored: string): string {
  const [iv, ct, tag] = stored.split('.')
  if (!iv || !ct || !tag) throw new Error('Poškozený šifrovaný záznam')
  const decipher = createDecipheriv('aes-256-gcm', totpKey(), Buffer.from(iv, 'base64url'))
  decipher.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(ct, 'base64url')), decipher.final()]).toString('utf8')
}
