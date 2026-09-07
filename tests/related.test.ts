import { describe, expect, it } from 'vitest'
import { pickRelated, relatedScore, tokens } from '../src/content/related'

const mk = (slug: string, category: string, keywords: string[], date = '2026-01-01', title = slug) => ({
  slug,
  title,
  category,
  date,
  keywords,
})

const drinking = mk('cs-pitna-kura', 'health', ['pitná kúra Mariánské Lázně', 'minerální prameny', 'Křížový pramen'], '2026-02-01', 'Pitná kúra: průvodce')
const springs = mk('cs-prameny', 'health', ['minerální prameny Mariánské Lázně', 'Rudolfův pramen'], '2025-11-01', 'Přehled pramenů')
const cure = mk('cs-kura', 'wellness', ['třítýdenní kúra', 'pitná kúra Mariánské Lázně', 'komplexní lázeňská léčba'], '2026-03-01', 'Klasická třítýdenní kúra')
const golf = mk('cs-golf', 'activities', ['golf Mariánské Lázně', 'Royal Golf Club'], '2026-04-01', 'Golf v Mariánských Lázních')
const mushrooms = mk('cs-houby', 'nature', ['houby Slavkovský les'], '2026-05-01', 'Houbaření ve Slavkovském lese')
const bavaria = mk('cs-bavorsko', 'activities', ['výlety do Bavorska'], '2026-06-01', 'Výlety do Bavorska')

describe('tokens', () => {
  it('normalizuje diakritiku a vyhodí obecná slova', () => {
    expect(tokens('Pitná kúra Mariánské Lázně')).toEqual(new Set(['pitna', 'kura']))
    expect(tokens('Trinkkur in Marienbad')).toEqual(new Set(['trinkkur']))
  })
})

describe('relatedScore', () => {
  it('stejná kategorie a sdílená klíčová slova dávají vyšší skóre než nic', () => {
    expect(relatedScore(drinking, springs)).toBeGreaterThan(relatedScore(drinking, golf))
    expect(relatedScore(drinking, golf)).toBe(0)
  })

  it('shodná celá fráze váží víc než jeden sdílený token', () => {
    expect(relatedScore(drinking, cure)).toBeGreaterThan(relatedScore(golf, bavaria))
  })
})

describe('pickRelated', () => {
  const all = [drinking, springs, cure, golf, mushrooms, bavaria]

  it('vrátí tematicky nejbližší články a vynechá aktuální', () => {
    const picked = pickRelated(all, drinking, 2).map((a) => a.slug)
    expect(picked).not.toContain('cs-pitna-kura')
    expect(picked).toEqual(expect.arrayContaining(['cs-prameny', 'cs-kura']))
  })

  it('bez tematické shody doplní nejnovější', () => {
    const lonely = mk('cs-x', 'history', ['Edward VII'], '2020-01-01')
    const picked = pickRelated([...all, lonely], lonely, 3).map((a) => a.slug)
    expect(picked).toEqual(['cs-bavorsko', 'cs-houby', 'cs-golf'])
  })

  it('u shodného skóre vyhrává novější článek a nikdy nevrátí duplicitu', () => {
    const picked = pickRelated(all, golf, 3)
    expect(picked[0].slug).toBe('cs-bavorsko')
    expect(new Set(picked.map((a) => a.slug)).size).toBe(picked.length)
  })
})
