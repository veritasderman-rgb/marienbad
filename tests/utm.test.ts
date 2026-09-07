import { describe, expect, it } from 'vitest'
import { tagLinks, utmToken, withUtm } from '../src/lib/utm'

const NL = { source: 'newsletter', medium: 'email', campaign: 'zari-2026' }

describe('withUtm', () => {
  it('označí absolutní i relativní odkaz na vlastní web', () => {
    expect(withUtm('https://marienbad.com/cs/ensana-life', NL)).toBe(
      'https://marienbad.com/cs/ensana-life?utm_source=newsletter&utm_medium=email&utm_campaign=zari-2026',
    )
    expect(withUtm('/de/magazin/trinkkur-ratgeber#tipps', NL)).toBe(
      '/de/magazin/trinkkur-ratgeber?utm_source=newsletter&utm_medium=email&utm_campaign=zari-2026#tipps',
    )
    expect(withUtm('https://www.marienbad.cz/cs?x=1', NL)).toContain('x=1&utm_source=newsletter')
  })

  it('nesahá na cizí weby, mailto ani tel', () => {
    expect(withUtm('https://ensanahotels.com/cs/hotely/nove-lazne', NL)).toBe('https://ensanahotels.com/cs/hotely/nove-lazne')
    expect(withUtm('https://notmarienbad.com/x', NL)).toBe('https://notmarienbad.com/x')
    expect(withUtm('mailto:info@marienbad.com', NL)).toBe('mailto:info@marienbad.com')
    expect(withUtm('tel:+420354655505', NL)).toBe('tel:+420354655505')
  })

  it('ručně označený odkaz nechá být', () => {
    const manual = 'https://marienbad.com/cs?utm_source=fb&utm_medium=social'
    expect(withUtm(manual, NL)).toBe(manual)
  })

  it('nezhroutí se na rozbité URL', () => {
    expect(withUtm('http://[bad', NL)).toBe('http://[bad')
  })
})

describe('tagLinks', () => {
  it('označí jen odkazy na vlastní web a zachová &amp; kódování', () => {
    const html =
      '<p><a href="https://marienbad.com/cs/prehled-pramenu">prameny</a> ' +
      '<a href=\'https://marienbad.com/cs/kviz?a=1&amp;b=2\'>kvíz</a> ' +
      '<a href="https://ensanahotels.com/cs">rezervace</a> ' +
      '<a href="mailto:x@marienbad.com">mail</a></p>'
    const out = tagLinks(html, NL)
    expect(out).toContain('href="https://marienbad.com/cs/prehled-pramenu?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=zari-2026"')
    expect(out).toContain("href='https://marienbad.com/cs/kviz?a=1&amp;b=2&amp;utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=zari-2026'")
    expect(out).toContain('href="https://ensanahotels.com/cs"')
    expect(out).toContain('href="mailto:x@marienbad.com"')
    expect(out).not.toContain('&utm_')
  })

  it('je idempotentní', () => {
    const once = tagLinks('<a href="https://marienbad.com/cs">x</a>', NL)
    expect(tagLinks(once, NL)).toBe(once)
  })
})

describe('utmToken', () => {
  it('pustí jen bezpečné tokeny', () => {
    expect(utmToken('Duve')).toBe('duve')
    expect(utmToken('vanoce-2026_a')).toBe('vanoce-2026_a')
    expect(utmToken('<script>')).toBeNull()
    expect(utmToken('a b')).toBeNull()
    expect(utmToken('')).toBeNull()
    expect(utmToken(null)).toBeNull()
    expect(utmToken('x'.repeat(65))).toBeNull()
  })
})
