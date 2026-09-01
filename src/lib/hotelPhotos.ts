/**
 * Fotobanka hotelů — přístup k WebP variantám vygenerovaným z archivu
 * `MARIENBAD_MARKETING`. Původní importní složka `_web-export/` (README,
 * převodní skripty, soupis fotek) byla po nasazení smazána, protože všechny
 * fotky i manifesty už bajt po bajtu žijí v `public/images/` a `src/data/`.
 * Kdyby bylo potřeba postup zopakovat u nové dávky fotek, celá složka je
 * v historii gitu — přidaly ji commity `0aaa745` a `3336ae3`.
 *
 * Pro každou fotku existují tři soubory:
 *   `<base>-1600.webp`  galerie / lightbox / hero
 *   `<base>-800.webp`   běžné dlaždice
 *   `<base>-400.webp`   náhledy v mřížce
 *
 * Zdroj dat: `src/data/hotel-photos.json` (generováno skriptem, needituje se ručně).
 */
import data from '@/data/hotel-photos.json'

export const PHOTO_CATEGORIES = [
  'highlights',
  'exterior',
  'rooms',
  'interior',
  'dining',
  'pool',
  'spa',
  'mice',
  'other',
] as const

export type PhotoCategory = (typeof PHOTO_CATEGORIES)[number]

export interface HotelPhoto {
  id: string
  category: PhotoCategory
  /** Cesta bez přípony a bez šířky, např. `/images/hotels/butterfly/rooms/dbl-superior` */
  base: string
  /** Rozměry zdrojové fotky (pro poměr stran) */
  w: number
  h: number
  orientation: 'landscape' | 'portrait'
}

const byHotel = data as unknown as Record<string, HotelPhoto[]>

/** Největší vygenerovaná varianta. Musí odpovídat SIZES v konverzním skriptu. */
const MAX_WIDTH = 1600

export function hotelPhotos(slug: string): HotelPhoto[] {
  return byHotel[slug] ?? []
}

export function hasPhotos(slug: string): boolean {
  return (byHotel[slug]?.length ?? 0) > 0
}

/** Fotky jedné kategorie, případně omezené na `limit` kusů. */
export function photosOf(slug: string, category: PhotoCategory, limit?: number): HotelPhoto[] {
  const list = hotelPhotos(slug).filter((p) => p.category === category)
  return typeof limit === 'number' ? list.slice(0, limit) : list
}

/**
 * Fotky z první kategorie, která něco má — v pořadí podle `preferred`.
 * Používá se tam, kde sekce potřebuje ilustraci, ale ne každý hotel má
 * v archivu stejné složky.
 */
export function firstAvailable(slug: string, preferred: PhotoCategory[], limit: number): HotelPhoto[] {
  for (const cat of preferred) {
    const list = photosOf(slug, cat, limit)
    if (list.length > 0) return list
  }
  return []
}

/** Kategorie, které mají u daného hotelu alespoň jednu fotku (v pořadí PHOTO_CATEGORIES). */
export function categoriesOf(slug: string): PhotoCategory[] {
  const present = new Set(hotelPhotos(slug).map((p) => p.category))
  return PHOTO_CATEGORIES.filter((c) => present.has(c))
}

/** Hero fotka: nejlepší dostupná krajinná fotka (highlights → exterior → interior). */
export function heroPhoto(slug: string): HotelPhoto | undefined {
  const pool = hotelPhotos(slug)
  const preferred: PhotoCategory[] = ['highlights', 'exterior', 'interior', 'rooms']
  for (const cat of preferred) {
    const found = pool.find((p) => p.category === cat && p.orientation === 'landscape')
    if (found) return found
  }
  return pool[0]
}

export function srcset(photo: HotelPhoto): string {
  // Varianty se generují bez zvětšování, takže u fotky užší než 1600 px má
  // soubor `-1600.webp` jen šířku originálu. Deskriptor proto musí být
  // skutečná šířka souboru — kdyby se stupeň jen zahodil (dřívější chování),
  // prohlížeč by se u takové fotky zastavil na 800 px a galerie by byla měkká.
  const widths = new Set<number>()
  const out: string[] = []
  for (const step of [400, 800, MAX_WIDTH]) {
    const real = Math.min(step, photo.w)
    if (widths.has(real)) continue
    widths.add(real)
    out.push(`${photo.base}-${step}.webp ${real}w`)
  }
  return out.join(', ')
}

/** Rozměry největší varianty — do width/height atributů, aby stránka neposkakovala. */
export function displaySize(photo: HotelPhoto): { width: number; height: number } {
  const width = Math.min(photo.w, MAX_WIDTH)
  return { width, height: Math.round((photo.h * width) / photo.w) }
}

export function largest(photo: HotelPhoto): string {
  return `${photo.base}-${Math.min(photo.w, MAX_WIDTH) > 800 ? 1600 : 800}.webp`
}
