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

export interface ImageOptimResult {
  webpSrcset?: string
  width?: number
  height?: number
}

export function lookup(src: string): ImageOptimResult {
  const entry = entries[src]
  if (!entry?.webp) return {}
  const base = src.replace(/\.(jpe?g|png)$/i, '')
  // encodeURI: srcset entries must not contain raw spaces (e.g. "image (6).jpg")
  const webpSrcset = entry.w800
    ? `${encodeURI(base)}.webp 1920w, ${encodeURI(base)}-800w.webp 800w`
    : `${encodeURI(base)}.webp`
  return { webpSrcset, width: entry.width, height: entry.height }
}
