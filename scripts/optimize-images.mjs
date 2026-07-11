#!/usr/bin/env node
/**
 * Generate WebP variants for all JPG/PNG images under public/images.
 *
 * For each source image (unless an up-to-date variant already exists):
 *   <name>.webp       — quality 80, resized to max width 1920 (no enlargement)
 *   <name>-800w.webp  — quality 80, width 800 (only when the source is wider than 800px)
 *
 * Also rewrites src/data/webp-manifest.json mapping public URL paths
 * ("/images/...") to { webp, w800, width, height } where width/height are the
 * source image's intrinsic (orientation-corrected) dimensions. Consumed by
 * src/lib/imageOptim.ts at build time.
 *
 * Idempotent: re-runs only regenerate variants older than their source.
 *
 * Usage: node scripts/optimize-images.mjs  (or `pnpm images`)
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images')
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'webp-manifest.json')
const SOURCE_RE = /\.(jpe?g|png)$/i
const QUALITY = 80
const MAX_WIDTH = 1920
const SMALL_WIDTH = 800
const CONCURRENCY = 4

async function walk(dir) {
  const files = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(full)))
    else if (entry.isFile() && SOURCE_RE.test(entry.name)) files.push(full)
  }
  return files
}

async function mtimeOf(file) {
  try {
    return (await fs.stat(file)).mtimeMs
  } catch {
    return null
  }
}

async function processImage(file, manifest, counters) {
  const meta = await sharp(file).metadata()
  // EXIF orientations 5-8 rotate by 90°, swapping the rendered dimensions
  const swapped = (meta.orientation ?? 1) >= 5
  const width = swapped ? meta.height : meta.width
  const height = swapped ? meta.width : meta.height

  const base = file.replace(SOURCE_RE, '')
  const webpPath = `${base}.webp`
  const w800Path = `${base}-800w.webp`
  const hasW800 = width > SMALL_WIDTH
  const sourceMtime = await mtimeOf(file)

  const targets = [
    { out: webpPath, resizeWidth: MAX_WIDTH },
    ...(hasW800 ? [{ out: w800Path, resizeWidth: SMALL_WIDTH }] : []),
  ]

  for (const { out, resizeWidth } of targets) {
    const outMtime = await mtimeOf(out)
    if (outMtime !== null && outMtime >= sourceMtime) {
      counters.skipped++
      continue
    }
    // .rotate() applies EXIF orientation so the WebP matches the rendered image
    await sharp(file)
      .rotate()
      .resize({ width: resizeWidth, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out)
    counters.generated++
  }

  const urlPath = '/' + path.relative(PUBLIC_DIR, file).split(path.sep).join('/')
  manifest[urlPath] = { webp: true, w800: hasW800, width, height }
}

const files = await walk(IMAGES_DIR)
const manifest = {}
const counters = { generated: 0, skipped: 0 }
const queue = [...files]

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    let file
    while ((file = queue.shift()) !== undefined) {
      await processImage(file, manifest, counters)
    }
  }),
)

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)))
await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
await fs.writeFile(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + '\n')

console.log(
  `optimize-images: ${files.length} sources, ${counters.generated} webp generated, ${counters.skipped} up-to-date, manifest ${Object.keys(sorted).length} entries`,
)
