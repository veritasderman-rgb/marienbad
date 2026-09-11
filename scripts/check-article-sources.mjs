#!/usr/bin/env node
// Build-time kontrola zdravotních tvrzení (CLAUDE.md → „Zdravotní tvrzení").
// Projde src/content/articles/*/index.mdoc a src/content/pages/*/index.mdoc a ověří frontmatter:
//  - `sources` je pole objektů {title, url?, note?}; každá položka má neprázdný title (chyba)
//  - `medicalReviewDate` má tvar YYYY-MM-DD (chyba)
//  - článek kategorie healing/health bez `sources` → varování (souhrn), s STRICT_ARTICLE_SOURCES=1 chyba
// Běží před `astro build`, protože web je v SSR režimu a stránky článků se při buildu nerenderují.
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import yaml from 'js-yaml'

const ROOTS = ['src/content/articles', 'src/content/pages']
const HEALTH_CATEGORIES = new Set(['healing', 'health'])
const STRICT = process.env.STRICT_ARTICLE_SOURCES === '1'

function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return null
  try {
    return yaml.load(m[1]) ?? {}
  } catch (err) {
    return { __yamlError: String(err.message ?? err) }
  }
}

const errors = []
const missing = []
let checked = 0
let withSources = 0

for (const [ROOT, slug] of ROOTS.flatMap((r) => readdirSync(r).sort().map((s) => [r, s]))) {
  const file = join(ROOT, slug, 'index.mdoc')
  if (!existsSync(file)) continue
  const meta = splitFrontmatter(readFileSync(file, 'utf8'))
  if (!meta) continue
  checked++
  if (meta.__yamlError) {
    errors.push(`${slug}: frontmatter YAML nelze načíst (${meta.__yamlError})`)
    continue
  }
  const sources = meta.sources
  if (sources !== undefined) {
    if (!Array.isArray(sources)) {
      errors.push(`${slug}: \`sources\` musí být seznam`)
    } else {
      sources.forEach((s, i) => {
        const title = typeof s === 'string' ? s : s && typeof s === 'object' ? s.title : undefined
        if (typeof title !== 'string' || !title.trim()) errors.push(`${slug}: sources[${i}] nemá \`title\``)
        if (s && typeof s === 'object' && s.url !== undefined && typeof s.url !== 'string') errors.push(`${slug}: sources[${i}].url musí být text`)
      })
      if (sources.length) withSources++
    }
  }
  if (meta.medicalReviewDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(String(meta.medicalReviewDate))) {
    errors.push(`${slug}: medicalReviewDate "${meta.medicalReviewDate}" není ve tvaru YYYY-MM-DD`)
  }
  if (HEALTH_CATEGORIES.has(meta.category) && (!Array.isArray(sources) || sources.length === 0)) {
    missing.push(slug)
  }
}

console.log(`check-article-sources: ${checked} článků a stránek, ${withSources} se zdroji`)
if (missing.length) {
  const level = STRICT ? 'CHYBA' : 'varování'
  console.log(`check-article-sources: ${level} — ${missing.length} zdravotních článků bez \`sources\` (viz CLAUDE.md → Zdravotní tvrzení):`)
  for (const slug of missing) console.log(`  - ${slug}`)
}
for (const e of errors) console.error(`check-article-sources: CHYBA — ${e}`)

if (errors.length || (STRICT && missing.length)) {
  process.exit(1)
}
