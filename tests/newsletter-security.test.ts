import { describe, expect, it } from 'vitest'
import { sanitizeNewsletterHtml, htmlToPlainText } from '../src/lib/portal/newsletter/sanitize'
import { assertAllowedGroups, isAllowedGroupId, groupFor, resolveLocale, B2B_GROUPS } from '../src/lib/portal/newsletter/groups'

describe('sanitizace newsletteru (N-02)', () => {
  it('odstraní skripty a event handlery', () => {
    const dirty = `<html><body><p>Ahoj</p><script>alert(1)</script><img src="https://example.com/a.png" onerror="alert(2)"></body></html>`
    const clean = sanitizeNewsletterHtml(dirty)
    expect(clean).not.toContain('<script')
    expect(clean).not.toContain('onerror')
    expect(clean).toContain('<p>Ahoj</p>')
    expect(clean).toContain('img src="https://example.com/a.png"')
  })

  it('odstraní javascript: odkazy, https a mailto ponechá', () => {
    const dirty = `<a href="javascript:alert(1)">x</a><a href="https://marienbad.com">ok</a><a href="mailto:a@b.cz">m</a>`
    const clean = sanitizeNewsletterHtml(dirty)
    expect(clean).not.toContain('javascript:')
    expect(clean).toContain('https://marienbad.com')
    expect(clean).toContain('mailto:a@b.cz')
  })

  it('ponechá e-mailové tabulky a styly', () => {
    const email = `<table width="600" bgcolor="#ffffff"><tr><td style="padding:10px">Obsah</td></tr></table><style>.a{color:red}</style>`
    const clean = sanitizeNewsletterHtml(email)
    expect(clean).toContain('<table')
    expect(clean).toContain('style="padding:10px"')
    expect(clean).toContain('<style>')
  })

  it('odstraní iframe/object/form', () => {
    const dirty = `<iframe src="https://evil.example"></iframe><object data="x"></object><form action="/x"><input></form>`
    const clean = sanitizeNewsletterHtml(dirty)
    expect(clean).not.toContain('<iframe')
    expect(clean).not.toContain('<object')
    expect(clean).not.toContain('<form')
  })

  it('plain text fallback zbaví HTML', () => {
    expect(htmlToPlainText('<p>Řádek 1</p><p>Řádek 2 &amp; půl</p>')).toContain('Řádek 1')
    expect(htmlToPlainText('<p>a</p>')).not.toContain('<')
  })
})

describe('allowlist B2B skupin (N-07)', () => {
  it('zná přesně 6 skupin — partneři a vizitky × de/en/cs', () => {
    expect(B2B_GROUPS).toHaveLength(6)
    expect(B2B_GROUPS.every((g) => g.name.startsWith('B2B · '))).toBe(true)
  })

  it('propustí jen allowlistovaná ID', () => {
    expect(() => assertAllowedGroups([B2B_GROUPS[0].id])).not.toThrow()
    expect(() => assertAllowedGroups([B2B_GROUPS[0].id, '999999'])).toThrow()
    expect(isAllowedGroupId('123')).toBe(false)
  })

  it('kampaň bez skupin (= všem odběratelům) je zakázaná', () => {
    expect(() => assertAllowedGroups([])).toThrow()
  })

  it('groupFor najde správnou kombinaci', () => {
    expect(groupFor('partners', 'de').name).toBe('B2B · Partneři · DE')
    expect(groupFor('leads', 'cs').name).toBe('B2B · Vizitky · CS')
  })

  it('resolveLocale: jazyk má přednost před zemí', () => {
    expect(resolveLocale(['en'], 'DE')).toBe('en')
    expect(resolveLocale([], 'CH')).toBe('de')
    expect(resolveLocale([], 'CZ')).toBe('cs')
    expect(resolveLocale([], 'IL')).toBe('en')
  })
})
