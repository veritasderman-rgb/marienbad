#!/usr/bin/env node
// Seed portálu.
//
//   --owner <email>   založí prvního owner uživatele a vypíše pozvánkový odkaz
//                     (bootstrap na produkci; odkaz platí 7 dní, jednorázově)
//   --demo            fiktivní data pro dev/preview branch (nikdy na produkci!)
//
// Použití: DATABASE_URL_DIRECT=… node scripts/portal-seed.mjs --owner jmeno@firma.cz
import { createHash, randomBytes } from 'node:crypto'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL
if (!connectionString) {
  console.error('Chybí DATABASE_URL_DIRECT nebo DATABASE_URL.')
  process.exit(1)
}

const args = process.argv.slice(2)
const ownerIdx = args.indexOf('--owner')
const ownerEmail = ownerIdx >= 0 ? args[ownerIdx + 1] : null
const demo = args.includes('--demo')

if (!ownerEmail && !demo) {
  console.error('Zadejte --owner <email> nebo --demo.')
  process.exit(1)
}

const client = new pg.Client({ connectionString })
await client.connect()

try {
  if (ownerEmail) {
    const existing = await client.query('SELECT id FROM crm.portal_users WHERE email = $1', [ownerEmail])
    let userId
    if (existing.rows.length > 0) {
      userId = existing.rows[0].id
      console.log(`Uživatel ${ownerEmail} už existuje — generuji novou pozvánku.`)
    } else {
      const inserted = await client.query(
        `INSERT INTO crm.portal_users (email, role) VALUES ($1, 'owner') RETURNING id`,
        [ownerEmail],
      )
      userId = inserted.rows[0].id
    }
    const rawToken = randomBytes(32).toString('base64url')
    const tokenHash = createHash('sha256').update(rawToken, 'utf8').digest('hex')
    await client.query(
      `INSERT INTO crm.user_tokens (user_id, kind, token_hash, expires_at)
       VALUES ($1, 'invite', $2, now() + interval '7 days')`,
      [userId, tokenHash],
    )
    console.log('\nPozvánkový odkaz (platí 7 dní, použijte jednou a nikam ho neukládejte):')
    console.log(`  https://marienbad.com/portal/invite/${rawToken}\n`)
  }

  if (demo) {
    // Pojistka: demo data nikdy do databáze, kde už jsou skuteční uživatelé
    // mimo seznam fiktivních domén.
    const realUsers = await client.query(
      `SELECT count(*) AS n FROM crm.portal_users WHERE email NOT LIKE '%@example.com'`,
    )
    if (Number(realUsers.rows[0].n) > 0) {
      console.error('V databázi jsou skuteční uživatelé — demo seed patří jen na dev/preview branch.')
      process.exit(1)
    }
    await client.query(
      `INSERT INTO crm.portal_users (email, role, display_name)
       VALUES
         ('owner@example.com',   'owner',   'Demo Owner'),
         ('editor@example.com',  'editor',  'Demo Editor'),
         ('analyst@example.com', 'analyst', 'Demo Analyst'),
         ('viewer@example.com',  'viewer',  'Demo Viewer')
       ON CONFLICT (email) DO NOTHING`,
    )
    console.log('Demo uživatelé založeni (bez hesel — přihlášení přes pozvánkový tok).')
  }
} finally {
  await client.end()
}
