/**
 * Typed access to the tagged photo library under public/images/library.
 *
 * The JSON is generated from the raw photo archive; every entry has a
 * repo-relative `path` (the .jpg fallback) plus alt text and a caption in
 * cs / en / de. Serve the images through <Pic src={img.path} alt={...} /> so
 * the pre-generated WebP variants from `pnpm images` are used.
 */
import data from '@/data/photo-library.json'

export type PhotoCategory =
  | 'town' | 'nature' | 'colonnade' | 'springs' | 'treatments' | 'mineral-bath'
  | 'drinking-cure' | 'cuisine' | 'fitness' | 'hotels' | 'lifestyle' | 'misc'

export type PhotoLocale = 'cs' | 'en' | 'de'

export interface LibraryPhoto {
  /** `<category>/<slug>`, unique across the library */
  id: string
  /** public path of the JPG fallback, e.g. /images/library/colonnade/main-colonnade.jpg */
  path: string
  category: PhotoCategory
  slug: string
  width: number
  height: number
  orientation: 'landscape' | 'portrait' | 'square'
  people: boolean
  /** editorial rating: hero = full-bleed capable, good = gallery, weak = archive only */
  quality: 'hero' | 'good' | 'weak'
  /** false for weak, watermarked or otherwise not web-ready shots */
  publish: boolean
  tags: string[]
  alt: Record<PhotoLocale, string>
  caption: Record<PhotoLocale, string>
  source: { file: string; width: number; height: number }
  note: string
}

const photos = (data as { images: LibraryPhoto[] }).images

/** Every entry, including the ones flagged `publish: false`. */
export const allPhotos: LibraryPhoto[] = photos

/** Web-ready entries only — the default for anything user-facing. */
export const publishedPhotos: LibraryPhoto[] = photos.filter((p) => p.publish)

export function byId(id: string): LibraryPhoto | undefined {
  return photos.find((p) => p.id === id)
}

export function byPath(path: string): LibraryPhoto | undefined {
  return photos.find((p) => p.path === path)
}

export interface PhotoQuery {
  category?: PhotoCategory | PhotoCategory[]
  /** all listed tags must be present */
  tags?: string[]
  orientation?: LibraryPhoto['orientation']
  quality?: LibraryPhoto['quality'] | LibraryPhoto['quality'][]
  people?: boolean
  /** include entries flagged publish: false (default false) */
  includeUnpublished?: boolean
  limit?: number
}

export function findPhotos(q: PhotoQuery = {}): LibraryPhoto[] {
  const cats = q.category ? (Array.isArray(q.category) ? q.category : [q.category]) : null
  const quals = q.quality ? (Array.isArray(q.quality) ? q.quality : [q.quality]) : null
  const out = (q.includeUnpublished ? photos : publishedPhotos).filter((p) => {
    if (cats && !cats.includes(p.category)) return false
    if (quals && !quals.includes(p.quality)) return false
    if (q.orientation && p.orientation !== q.orientation) return false
    if (q.people !== undefined && p.people !== q.people) return false
    if (q.tags && !q.tags.every((t) => p.tags.includes(t))) return false
    return true
  })
  return q.limit ? out.slice(0, q.limit) : out
}

/** Alt text for a locale, falling back to English then Czech. */
export function alt(p: LibraryPhoto, locale: string): string {
  const l = (locale.slice(0, 2) as PhotoLocale)
  return p.alt[l] ?? p.alt.en ?? p.alt.cs
}

/** Caption for a locale, falling back to English then Czech. */
export function caption(p: LibraryPhoto, locale: string): string {
  const l = (locale.slice(0, 2) as PhotoLocale)
  return p.caption[l] ?? p.caption.en ?? p.caption.cs
}
