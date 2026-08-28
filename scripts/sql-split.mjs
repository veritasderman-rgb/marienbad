#!/usr/bin/env node
// Rozdělí SQL soubor na jednotlivé statementy (respektuje $$ … $$ bloky a
// jednoduché uvozovky). Používá ho migrační runner i ruční aplikace přes
// Neon MCP, které neumí multi-statement dávky.
import { readFileSync } from 'node:fs'

export function splitSql(sql) {
  const statements = []
  let current = ''
  let i = 0
  let inSingle = false
  let dollarTag = null // např. "$$" nebo "$fn$"

  while (i < sql.length) {
    const ch = sql[i]
    if (dollarTag) {
      current += ch
      if (ch === '$' && sql.startsWith(dollarTag, i)) {
        current += sql.slice(i + 1, i + dollarTag.length)
        i += dollarTag.length
        dollarTag = null
        continue
      }
      i++
      continue
    }
    if (inSingle) {
      current += ch
      if (ch === "'") {
        if (sql[i + 1] === "'") { current += "'"; i += 2; continue }
        inSingle = false
      }
      i++
      continue
    }
    if (ch === "'") { inSingle = true; current += ch; i++; continue }
    if (ch === '$') {
      const m = sql.slice(i).match(/^\$[A-Za-z_]*\$/)
      if (m) { dollarTag = m[0]; current += m[0]; i += m[0].length; continue }
    }
    if (ch === '-' && sql[i + 1] === '-') {
      const nl = sql.indexOf('\n', i)
      i = nl === -1 ? sql.length : nl + 1
      current += '\n'
      continue
    }
    if (ch === ';') {
      const trimmed = current.trim()
      if (trimmed) statements.push(trimmed)
      current = ''
      i++
      continue
    }
    current += ch
    i++
  }
  const trimmed = current.trim()
  if (trimmed) statements.push(trimmed)
  return statements
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const file = process.argv[2]
  if (file) {
    const statements = splitSql(readFileSync(file, 'utf8'))
    process.stdout.write(JSON.stringify(statements, null, 1))
  }
}
