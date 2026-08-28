#!/usr/bin/env node
// Migrační runner: aplikuje db/migrations/*.sql v abecedním pořadí,
// každou v transakci, evidence v crm._migrations.
//
// Použití:  DATABASE_URL_DIRECT=postgres://… node scripts/db-migrate.mjs
// Vždy přes PŘÍMÝ endpoint Neonu (bez -pooler) — pooled spojení nepodporuje
// všechny session příkazy.
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'db', 'migrations')

const connectionString = process.env.DATABASE_URL_DIRECT
if (!connectionString) {
  console.error('Chybí DATABASE_URL_DIRECT (přímý endpoint Neonu).')
  process.exit(1)
}
if (connectionString.includes('-pooler.')) {
  console.error('DATABASE_URL_DIRECT ukazuje na pooler — migrace potřebují přímý endpoint.')
  process.exit(1)
}

const client = new pg.Client({ connectionString })
await client.connect()

try {
  await client.query('CREATE SCHEMA IF NOT EXISTS crm')
  await client.query(
    'CREATE TABLE IF NOT EXISTS crm._migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())',
  )
  const applied = new Set(
    (await client.query('SELECT name FROM crm._migrations')).rows.map((r) => r.name),
  )
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort()
  let count = 0
  for (const file of files) {
    if (applied.has(file)) continue
    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8')
    console.log(`Aplikuji ${file}…`)
    await client.query('BEGIN')
    try {
      await client.query(sql)
      await client.query('INSERT INTO crm._migrations (name) VALUES ($1)', [file])
      await client.query('COMMIT')
      count++
    } catch (err) {
      await client.query('ROLLBACK')
      console.error(`Migrace ${file} selhala:`, err.message)
      process.exit(1)
    }
  }
  console.log(count ? `Hotovo — aplikováno ${count} migrací.` : 'Vše aktuální, nic k aplikaci.')
} finally {
  await client.end()
}
