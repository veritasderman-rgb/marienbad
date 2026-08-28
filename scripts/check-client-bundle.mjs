#!/usr/bin/env node
// Build-time pojistka (NAVRH 3.4): shodí build, pokud se do klientského
// bundlu dostane jméno kterékoli serverové env proměnné portálu nebo
// něco, co vypadá jako connection string / API klíč.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const FORBIDDEN = [
  'DATABASE_URL',
  'PORTAL_SESSION_SECRET',
  'PORTAL_TOTP_KEY',
  'CRON_SECRET',
  'MAILERLITE_API_KEY',
  'NEWSLETTER_DRAFT_TOKEN',
  'DASHBOARD_INTAKE_TOKEN',
  'DASHBOARD_EXPORT_TOKEN',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'RESEND_API_KEY',
  'postgresql://',
  'postgres://',
]

const CLIENT_DIRS = ['dist/client', '.vercel/output/static'].filter((d) => existsSync(d))

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) yield* walk(full)
    else if (/\.(js|mjs|css|html|json|txt)$/.test(entry)) yield full
  }
}

let failures = 0
for (const dir of CLIENT_DIRS) {
  for (const file of walk(dir)) {
    const content = readFileSync(file, 'utf8')
    for (const needle of FORBIDDEN) {
      if (content.includes(needle)) {
        console.error(`LEAK: „${needle}" nalezeno v klientském souboru ${file}`)
        failures++
      }
    }
  }
}

if (failures > 0) {
  console.error(`\nBuild zastaven: ${failures} nálezů serverových tajemství v klientském bundlu.`)
  process.exit(1)
}
console.log('check-client-bundle: klientský bundle bez serverových tajemství ✓')
