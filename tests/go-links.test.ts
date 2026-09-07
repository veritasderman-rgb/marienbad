import { describe, expect, it } from 'vitest'
import { GO_KEYS, GO_LINKS, HOTEL_SLUGS, resolveGoLink, seasonPath } from '../src/data/goLinks'
import { negotiateLocale } from '../src/i18n/negotiate'

const LOCALES = ['cs', 'de', 'en', 'ru'] as const

describe('negotiateLocale', () => {
  it('vezme jazyk s nejvyšší váhou, který web umí', () => {
    expect(negotiateLocale('fr-FR,fr;q=0.9,cs;q=0.8,en;q=0.7')).toBe('cs')
    expect(negotiateLocale('en-GB,en;q=0.9')).toBe('en')
    expect(negotiateLocale('ru-RU,ru;q=0.9,en-US;q=0.8')).toBe('ru')
  })

  it('bez použitelného jazyka vrátí němčinu', () => {
    expect(negotiateLocale(null)).toBe('de')
    expect(negotiateLocale('')).toBe('de')
    expect(negotiateLocale('fr-FR,it;q=0.8')).toBe('de')
  })

  it('ignoruje jazyky s nulovou váhou a nesmyslné q', () => {
    expect(negotiateLocale('cs;q=0,en;q=0.5')).toBe('en')
    expect(negotiateLocale('cs;q=abc,en;q=0.5')).toBe('en')
  })

  it('snese mezery kolem středníku a rovnítka (Codex, PR #307)', () => {
    expect(negotiateLocale('en; q=0, de;q=0.5')).toBe('de')
    expect(negotiateLocale('cs ; q = 0.9 , en ; q = 0.8')).toBe('cs')
    expect(negotiateLocale('en; q=0.3, de; q=0.9')).toBe('de')
  })
})

describe('resolveGoLink', () => {
  it('každý klíč vede do každého jazyka na cestu s jazykovým prefixem', () => {
    for (const key of GO_KEYS) {
      for (const locale of LOCALES) {
        const path = resolveGoLink(key, locale)
        expect(path, `${key}/${locale}`).toMatch(new RegExp(`^/${locale}(/|$)`))
      }
    }
  })

  it('překládá sekce přes routes', () => {
    expect(resolveGoLink('springs', 'cs')).toBe('/cs/prehled-pramenu')
    expect(resolveGoLink('springs', 'de')).toBe('/de/quellen-uebersicht')
    expect(resolveGoLink('info', 'en')).toBe('/en/practical-info')
    expect(resolveGoLink('parking', 'ru')).toBe('/ru/parkovka')
    expect(resolveGoLink('ensana-life', 'de')).toBe('/de/ensana-life')
  })

  it('články magazínu dostanou lokalizovaný prefix magazínu', () => {
    expect(resolveGoLink('drinking-cure', 'cs')).toBe('/cs/magazin/pitna-kura-pruvodce')
    expect(resolveGoLink('drinking-cure', 'en')).toBe('/en/magazine/drinking-cure-guide')
    expect(resolveGoLink('cure', 'ru')).toBe('/ru/zhurnal/klassicheskiy-trekhnedelnyy-kurs-marianskie-lazne')
  })

  it('hotelové zkratky existují pro všech sedm hotelů', () => {
    expect(HOTEL_SLUGS).toHaveLength(7)
    for (const slug of HOTEL_SLUGS) {
      expect(GO_LINKS[`hotel-${slug}`]).toBeDefined()
      expect(resolveGoLink(`hotel-${slug}`, 'en')).toBe(`/en/hotel/${slug}`)
    }
  })

  it('home vede na kořen jazyka a neznámý klíč na null', () => {
    expect(resolveGoLink('home', 'cs')).toBe('/cs')
    expect(resolveGoLink('neexistuje', 'cs')).toBeNull()
  })

  it('sezóna se řídí měsícem', () => {
    expect(seasonPath('cs', new Date('2026-04-10'))).toBe('jaro')
    expect(seasonPath('de', new Date('2026-07-01'))).toBe('sommer')
    expect(seasonPath('en', new Date('2026-10-15'))).toBe('autumn')
    expect(seasonPath('ru', new Date('2026-12-20'))).toBe('rozhdestvo-i-novyj-god')
    expect(seasonPath('cs', new Date('2027-01-05'))).toBe('vanoce-a-silvestr')
    expect(seasonPath('cs', new Date('2027-02-05'))).toBe('nejlepsi-cas-navstevy')
    expect(resolveGoLink('season', 'de', new Date('2026-09-07'))).toBe('/de/herbst')
  })
})
