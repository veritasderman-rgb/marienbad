/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** Přihlášený uživatel portálu (resolvuje middleware, jen prohlížečové cesty). */
    portalUser?: import('./lib/portal/auth/session').PortalUser
    portalSessionId?: string
    /** CSRF token pro fetch hlavičku x-csrf-token (double-submit). */
    portalCsrf?: string
    /** true = strojová cesta (cron/intake/export) — session ani CSRF se neřeší. */
    portalMachine?: boolean
  }
}
