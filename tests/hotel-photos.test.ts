import { describe, expect, it } from 'vitest'
import photos from '../src/data/hotel-photos.json'
import { hotelPhotos, heroPhoto, srcset, type HotelPhoto } from '../src/lib/hotelPhotos'

const photo = (w: number, h = 1000): HotelPhoto => ({
  id: 'x/other/x',
  category: 'other',
  base: '/images/hotels/x/other/x',
  w,
  h,
  orientation: w >= h ? 'landscape' : 'portrait',
})

describe('srcset fotobanky hotelů', () => {
  it('u široké fotky nabídne všechny tři varianty', () => {
    expect(srcset(photo(3500, 2333))).toBe(
      '/images/hotels/x/other/x-400.webp 400w, ' +
        '/images/hotels/x/other/x-800.webp 800w, ' +
        '/images/hotels/x/other/x-1600.webp 1600w',
    )
  })

  it('u fotky mezi 800 a 1600 px nechá největší soubor se skutečnou šířkou', () => {
    // Varianty se generují bez zvětšování: `-1600.webp` má u zdroje 1404 px
    // právě 1404 px. Dřív se stupeň zahodil a prohlížeč skončil na 800 px.
    const out = srcset(photo(1404, 936))
    expect(out).toContain('/images/hotels/x/other/x-1600.webp 1404w')
    expect(out).toContain('/images/hotels/x/other/x-800.webp 800w')
  })

  it('u úzké fotky nevypisuje tutéž šířku dvakrát', () => {
    // 600 px: soubory -800 i -1600 mají shodně 600 px, do srcsetu patří jen jeden.
    expect(srcset(photo(600, 900))).toBe(
      '/images/hotels/x/other/x-400.webp 400w, /images/hotels/x/other/x-800.webp 600w',
    )
  })

  it('žádná šířka v srcsetu se neopakuje a nikdy nepřesáhne zdroj', () => {
    for (const list of Object.values(photos as Record<string, HotelPhoto[]>)) {
      for (const p of list) {
        const widths = srcset(p)
          .split(', ')
          .map((part) => Number(part.split(' ')[1]!.replace('w', '')))
        expect(new Set(widths).size).toBe(widths.length)
        expect(Math.max(...widths)).toBeLessThanOrEqual(p.w)
      }
    }
  })
})

describe('výběr fotek', () => {
  it('každý hotel z hotels.ts má fotky i hero fotku', () => {
    for (const slug of ['nove-lazne', 'centralni-lazne', 'hvezda', 'pacifik', 'butterfly', 'vltava', 'svoboda']) {
      expect(hotelPhotos(slug).length, slug).toBeGreaterThan(0)
      expect(heroPhoto(slug), slug).toBeDefined()
    }
  })

  it('neznámý hotel vrací prázdný seznam, ne výjimku', () => {
    expect(hotelPhotos('neexistuje')).toEqual([])
    expect(heroPhoto('neexistuje')).toBeUndefined()
  })
})
