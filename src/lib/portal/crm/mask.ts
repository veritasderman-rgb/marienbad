import type { PortalRole } from '../auth/session'

/**
 * Maskování kontaktních údajů pro role analyst a viewer (NAVRH 3.2).
 * Maskuje se VŽDY na serveru — do odpovědi API pro tyto role nesmí
 * nemaskovaná hodnota vůbec odejít (testuje se na JSON, ne na UI).
 */

export function shouldMaskContacts(role: PortalRole): boolean {
  return role !== 'owner' && role !== 'editor'
}

/** j****@ck-example.cz — první znak lokální části zůstává, doména celá. */
export function maskEmail(email: string | null): string | null {
  if (!email) return email
  const at = email.indexOf('@')
  if (at <= 0) return '•••'
  return `${email[0]}${'*'.repeat(Math.max(3, at - 1))}@${email.slice(at + 1)}`
}

/** +420•••456 — předvolba a poslední tři číslice. */
export function maskPhone(phone: string | null): string | null {
  if (!phone) return phone
  const digits = phone.replace(/[^\d+]/g, '')
  if (digits.length < 6) return '•••'
  const prefix = digits.startsWith('+') ? digits.slice(0, 4) : digits.slice(0, 3)
  return `${prefix}•••${digits.slice(-3)}`
}

export interface MaskableContact {
  email: string | null
  phone: string | null
  [key: string]: unknown
}

export function maskContact<T extends MaskableContact>(contact: T, role: PortalRole): T {
  if (!shouldMaskContacts(role)) return contact
  return { ...contact, email: maskEmail(contact.email), phone: maskPhone(contact.phone) }
}
