/**
 * Build-time lookup of pre-generated WebP variants for images in public/images.
 *
 * The manifest is produced by `pnpm images` (scripts/optimize-images.mjs).
 * Paths not in the manifest (e.g. new CMS uploads that haven't been optimized
 * yet) return {} so callers fall back to a plain <img> — never emit a <source>
 * pointing to a file that may not exist.
 */
import manifest from '@/data/webp-manifest.json'

interface ManifestEntry {
  webp: boolean
  w800: boolean
  width: number
  height: number
}

const entries = manifest as Record<string, ManifestEntry>

/** Musí odpovídat MAX_WIDTH ve scripts/optimize-images.mjs. */
const MAX_VARIANT_WIDTH = 1920

export interface ImageOptimResult {
  webpSrcset?: string
  width?: number
  height?: number
}

export function lookup(src: string): ImageOptimResult {
  const entry = entries[src]
  if (!entry?.webp) return {}
  const base = src.replace(/\.(jpe?g|png)$/i, '')
  // Šířka plné varianty: optimizer zmenšuje na max 1920 a nikdy nezvětšuje,
  // takže je to min(zdroj, 1920). Napsat sem natvrdo 1920 by prohlížeči lhalo
  // o hustotě — u portrétů (1067 px) by si tohoto kandidáta vybral pro
  // dvojnásobný displej a pak ho roztáhl, takže by fotka byla měkčí, než
  // kdyby dostal originál.
  const fullWidth = Math.min(entry.width, MAX_VARIANT_WIDTH)
  // encodeURI: srcset entries must not contain raw spaces (e.g. "image (6).jpg")
  const webpSrcset = entry.w800
    ? `${encodeURI(base)}.webp ${fullWidth}w, ${encodeURI(base)}-800w.webp 800w`
    : `${encodeURI(base)}.webp`
  return { webpSrcset, width: entry.width, height: entry.height }
}
