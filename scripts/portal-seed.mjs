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
    // fiktivní partneři + kontakty + výkonnost, ať mají dashboard a reporty co ukázat
    await client.query(`
      WITH p AS (
        INSERT INTO crm.partners (name, ico, segment, tier, status, country, city, languages, acquisition_source)
        VALUES
          ('CK Alfa a.s.',        NULL, 'travel_agency', 'A', 'active',   'CZ', 'Praha',  '{cs}', 'manual'),
          ('Beta Reisen GmbH',    NULL, 'tour_operator', 'A', 'active',   'DE', 'Berlín', '{de}', 'manual'),
          ('Gamma Tours s.r.o.',  NULL, 'travel_agency', 'B', 'active',   'CZ', 'Brno',   '{cs}', 'manual'),
          ('Delta Insurance',     NULL, 'insurer',       'B', 'active',   'CZ', 'Praha',  '{cs}', 'manual'),
          ('Epsilon Trade GmbH',  NULL, 'corporate',     'C', 'prospect', 'AT', 'Vídeň',  '{de}', 'veletrh:DEMO-2026')
        ON CONFLICT DO NOTHING
        RETURNING id, name
      ), c AS (
        INSERT INTO crm.partner_contacts (partner_id, first_name, last_name, email, newsletter_opt_in, lawful_basis, consent_basis, opt_in_source, opt_in_at)
        SELECT id, 'Demo', 'Kontakt', lower(replace(name, ' ', '.')) || '@example.com', true, 'consent', 'explicit_signup', 'demo-seed', CURRENT_DATE
        FROM p
      )
      INSERT INTO crm.partner_performance (partner_id, period_month, hotel_slug, revenue_eur, revenue_amount, currency, room_nights)
      SELECT p.id,
             (date_trunc('month', CURRENT_DATE) - (m.n || ' months')::interval)::date,
             h.slug,
             round((2000 + random() * 8000)::numeric, 2),
             round((50000 + random() * 200000)::numeric, 2),
             'CZK',
             (50 + random() * 300)::int
      FROM p
      CROSS JOIN generate_series(1, 18) AS m(n)
      CROSS JOIN (VALUES ('NL'), ('CL')) AS h(slug)
      ON CONFLICT DO NOTHING
    `)
    console.log('Demo uživatelé a fiktivní partneři s výkonností založeni (přihlášení přes pozvánkový tok).')
  }
} finally {
  await client.end()
}
