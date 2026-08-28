import { generateSecret, generateURI, verify } from 'otplib'
import { encryptSecret, decryptSecret } from '../crypto'

const ISSUER = 'Portál Marienbad'

export function generateTotpSecret(): string {
  return generateSecret()
}

export function totpKeyUri(email: string, secret: string): string {
  return generateURI({ issuer: ISSUER, label: email, secret })
}

export async function verifyTotpCode(secret: string, code: string): Promise<boolean> {
  if (!/^\d{6}$/.test(code)) return false
  // tolerance ±30 s (jeden krok) kvůli driftu hodin
  const result = await verify({ secret, token: code, epochTolerance: 30 })
  return result.valid
}

export { encryptSecret as encryptTotpSecret, decryptSecret as decryptTotpSecret }
