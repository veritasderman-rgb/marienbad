import { hash, verify } from '@node-rs/argon2'
import { createHash } from 'node:crypto'

/** OWASP doporučení pro argon2id (m=19 MiB, t=2, p=1). */
const ARGON2_OPTIONS = {
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS)
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  try {
    return await verify(passwordHash, password)
  } catch {
    return false
  }
}

export function validatePasswordPolicy(password: string): string | null {
  if (typeof password !== 'string' || password.length < 12) {
    return 'Heslo musí mít alespoň 12 znaků.'
  }
  if (password.length > 200) {
    return 'Heslo je příliš dlouhé.'
  }
  return null
}

/**
 * HaveIBeenPwned range API (k-anonymita: odchází jen prefix SHA-1 otisku).
 * Fail-open: výpadek HIBP nesmí zablokovat nastavení hesla — jen se zaloguje.
 */
export async function isPwnedPassword(password: string): Promise<boolean> {
  const sha1 = createHash('sha1').update(password, 'utf8').digest('hex').toUpperCase()
  const prefix = sha1.slice(0, 5)
  const suffix = sha1.slice(5)
  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' },
      signal: AbortSignal.timeout(4000),
    })
    if (!response.ok) throw new Error(`HIBP ${response.status}`)
    const body = await response.text()
    for (const line of body.split('\n')) {
      const [candidate, count] = line.trim().split(':')
      if (candidate === suffix && Number(count) > 0) return true
    }
    return false
  } catch (err) {
    console.warn('[portal/auth] HIBP kontrola selhala (fail-open):', err)
    return false
  }
}
