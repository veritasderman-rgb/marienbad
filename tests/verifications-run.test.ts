import { describe, expect, it } from 'vitest'
import {
  allSourcesFailed,
  notificationBody,
  shouldNotify,
  verificationState,
} from '../src/lib/portal/verifications/run'

describe('rozhodnutí o upozornění (NAVRH 5.5)', () => {
  it('zhoršení stupně upozorňuje', () => {
    expect(shouldNotify('ok', 'watch')).toBe(true)
    expect(shouldNotify('ok', 'alert')).toBe(true)
    expect(shouldNotify('watch', 'alert')).toBe(true)
  })

  it('zlepšení ani setrvalý stav neupozorňuje', () => {
    expect(shouldNotify('alert', 'ok')).toBe(false)
    expect(shouldNotify('alert', 'watch')).toBe(false)
    expect(shouldNotify('watch', 'ok')).toBe(false)
    expect(shouldNotify('alert', 'alert')).toBe(false)
    expect(shouldNotify('watch', 'watch')).toBe(false)
    expect(shouldNotify('ok', 'ok')).toBe(false)
  })

  it('první kontrola upozorní jen při alertu', () => {
    expect(shouldNotify(null, 'alert')).toBe(true)
    expect(shouldNotify(null, 'watch')).toBe(false)
    expect(shouldNotify(null, 'ok')).toBe(false)
  })
})

describe('text upozornění', () => {
  const input = {
    partnerName: 'CK Alfa a.s.',
    ico: '12345678',
    level: 'alert' as const,
    previousLevel: 'ok' as const,
    reasons: ['otevřená insolvence jako dlužník (1)'],
    sourceUrl: 'https://www.hlidacstatu.cz/subjekt/12345678',
  }

  it('předmět nese jméno partnera a stupeň', () => {
    expect(notificationBody(input).subject).toBe('[portál] Prověrka: CK Alfa a.s. — alert')
    expect(notificationBody({ ...input, level: 'watch', previousLevel: 'ok' }).subject).toBe(
      '[portál] Prověrka: CK Alfa a.s. — watch',
    )
  })

  it('tělo obsahuje důvody, odkaz do portálu a uvedení zdroje', () => {
    const message = notificationBody(input)
    for (const body of [message.text, message.html]) {
      expect(body).toContain('otevřená insolvence jako dlužník (1)')
      expect(body).toContain('/portal/verifications')
      expect(body).toContain('Zdroj: Hlídač státu — hlidacstatu.cz')
      expect(body).toContain('12345678')
    }
  })

  it('rozlišuje první kontrolu a změnu stupně', () => {
    expect(notificationBody(input).text).toContain('ok → alert')
    expect(notificationBody({ ...input, previousLevel: null }).text).toContain('první kontrola')
  })

  it('escapuje jméno partnera v HTML', () => {
    const message = notificationBody({ ...input, partnerName: 'Alfa & <script>Beta</script>' })
    expect(message.html).not.toContain('<script>')
    expect(message.html).toContain('Alfa &amp; &lt;script&gt;')
  })
})

describe('stav prověrky partnera', () => {
  it('partner s kontrolou je verified', () => {
    expect(verificationState({ ico: '12345678', country: 'CZ', hasVerification: true })).toBe('verified')
  })

  it('IČO bez kontroly čeká na prověrku', () => {
    expect(verificationState({ ico: '12345678', country: 'CZ', hasVerification: false })).toBe('pending')
  })

  it('zahraniční partner bez IČO je mimo dosah, nikdy ne ok', () => {
    expect(verificationState({ ico: null, country: 'DE', hasVerification: false })).toBe('foreign')
    expect(verificationState({ ico: '', country: 'at', hasVerification: false })).toBe('foreign')
  })

  it('český partner bez IČO se má přiřadit ručně', () => {
    expect(verificationState({ ico: null, country: 'CZ', hasVerification: false })).toBe('no_ico')
    expect(verificationState({ ico: '123', country: null, hasVerification: false })).toBe('no_ico')
  })
})

describe('rozpoznání úplného selhání zdrojů', () => {
  it('všechny čtyři zdroje selhaly', () => {
    expect(
      allSourcesFailed([
        'insolvence: Hlídač státu 500: x',
        'dph: Hlídač státu 500: x',
        'rejstrik-trestu: Hlídač státu 500: x',
        'detail: Hlídač státu 500: x',
      ]),
    ).toBe(true)
  })

  it('částečné selhání nebo čistý běh není úplné selhání', () => {
    expect(allSourcesFailed([])).toBe(false)
    expect(allSourcesFailed(['dph: Hlídač státu 404: x'])).toBe(false)
    expect(
      allSourcesFailed(['insolvence: chyba', 'dph: chyba', 'rejstrik-trestu: chyba']),
    ).toBe(false)
  })
})
