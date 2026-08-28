/**
 * Fotobanka Mariánských Lázní (destinace) — WebP varianty vygenerované
 * z archivní složky „09 Marianske Lazne".
 *
 * Pro každou fotku existují dva soubory:
 *   `<base>-1600.webp`  hero / celoplošné použití
 *   `<base>-800.webp`   dlaždice a náhledy
 *
 * Zdroj dat: `src/data/town-photos.json` (generováno, needituje se ručně).
 * Kategorie jsou odvozené z názvů souborů v archivu — u fotek pojmenovaných
 * `IMG_xxxx` spadne fotka do `town`, i když jde třeba o park; před nasazením
 * na konkrétní stránku se vyplatí projít si výběr očima.
 */
import data from '@/data/town-photos.json'

export type TownCategory = 'colonnade' | 'fountain' | 'springs' | 'nature' | 'sport' | 'town'
export type Season = 'winter' | 'christmas' | null

export interface TownPhoto {
  id: string
  category: TownCategory
  base: string
  w: number
  h: number
  orientation: 'landscape' | 'portrait'
  season: Season
  /** Původní soubor v archivu MARIENBAD_MARKETING — pro dohledání originálu. */
  source: string
}

const photos = data as unknown as TownPhoto[]

export function townPhotos(filter?: {
  category?: TownCategory
  season?: Season
  orientation?: 'landscape' | 'portrait'
}): TownPhoto[] {
  return photos.filter(
    (p) =>
      (!filter?.category || p.category === filter.category) &&
      (filter?.season === undefined || p.season === filter.season) &&
      (!filter?.orientation || p.orientation === filter.orientation),
  )
}

export function townPhoto(id: string): TownPhoto | undefined {
  return photos.find((p) => p.id === id)
}

export function townSrcset(photo: TownPhoto): string {
  return [800, 1600]
    .filter((w) => w <= Math.max(photo.w, 800))
    .map((w) => `${photo.base}-${w}.webp ${w}w`)
    .join(', ')
}

export function townDisplaySize(photo: TownPhoto): { width: number; height: number } {
  const width = Math.min(photo.w, 1600)
  return { width, height: Math.round((photo.h * width) / photo.w) }
}
