/**
 * Centrální přístup k serverovým env proměnným portálu.
 * Nikdy sem nepatří nic s prefixem PUBLIC_ — a naopak: nic odtud nesmí
 * do klientského kódu (hlídá scripts/check-client-bundle.mjs).
 */

const SERVER_ENV_NAMES = [
  'DATABASE_URL',
  'DATABASE_URL_DIRECT',
  'PORTAL_SESSION_SECRET',
  'PORTAL_TOTP_KEY',
  'CRON_SECRET',
  'MAILERLITE_API_KEY',
  'NEWSLETTER_DRAFT_TOKEN',
  'DASHBOARD_INTAKE_TOKEN',
  'DASHBOARD_EXPORT_TOKEN',
  'R2_ENDPOINT',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET',
  'RESEND_API_KEY',
  'PORTAL_MAIL_FROM',
  'PORTAL_ALERT_EMAIL',
  'NEWSLETTER_FROM_EMAIL',
  'NEWSLETTER_FROM_NAME',
  'PORTAL_FX_CZK_EUR',
  'HLIDAC_TOKEN',
] as const

export type ServerEnvName = (typeof SERVER_ENV_NAMES)[number]

export function env(name: ServerEnvName): string | undefined {
  const value = process.env[name]
  return value === '' ? undefined : value
}

export function requireEnv(name: ServerEnvName): string {
  const value = env(name)
  if (!value) {
    throw new Error(`Chybí env proměnná ${name} (viz docs/crm-portal/IMPLEMENTACNI_PLAN.md, sekce 9)`)
  }
  return value
}
