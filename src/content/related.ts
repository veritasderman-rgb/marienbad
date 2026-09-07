/**
 * Výběr souvisejících článků pro blok „Další články" pod textem.
 *
 * Dosud se braly první tři články ze seznamu, tedy na každé stránce tytéž
 * a bez vztahu k tématu. Interní prolinkování má vést čtenáře dál po
 * stejném tématu (pitná kúra → prameny → třítýdenní kúra), ne na náhodný
 * výlet. Skóre: stejná kategorie, sdílená klíčová slova z frontmatteru
 * (primaryKeyword + secondaryKeywords), překryv slov v titulku; při shodě
 * rozhoduje novější datum. Bez závislosti na Markdocu, aby šlo testovat.
 */

export interface RelatedCandidate {
  slug: string
  title: string
  category: string
  date: string
  keywords: string[]
}

/** Slova, která nic neříkají o tématu a jsou skoro v každém článku. */
const STOP = new Set([
  // cs
  'a', 'i', 'v', 've', 'na', 'do', 'z', 'ze', 'se', 'si', 'je', 'jak', 'pro', 'od', 'po', 'při', 'co', 'kde', 'kdy',
  'marianske', 'mariánské', 'lazne', 'lázně', 'lazni', 'lázní', 'laznich', 'lázních', 'lazenska', 'lázeňská', 'lazensky',
  'lázeňský', 'lazenske', 'lázeňské', 'lazensky', 'ensana', 'hotel', 'hotely', 'let', 'tipy', 'pruvodce', 'průvodce',
  // de
  'der', 'die', 'das', 'und', 'in', 'im', 'mit', 'für', 'fur', 'von', 'zu', 'zum', 'zur', 'auf', 'aus', 'ein', 'eine',
  'marienbad', 'kur', 'kurort', 'wie', 'was', 'ist', 'sie', 'ihre', 'ihr',
  // en
  'the', 'of', 'to', 'for', 'with', 'from', 'at', 'by', 'an', 'is', 'are', 'your', 'you', 'how', 'what', 'spa', 'guide',
  'czech', 'republic',
  // ru
  'и', 'в', 'на', 'с', 'из', 'для', 'по', 'от', 'до', 'как', 'что', 'где', 'марианские', 'лазне', 'лазни', 'курорт',
  'курорта', 'санаторий', 'отель',
])

/** Klíčové slovo → množina významových tokenů (bez diakritiky, bez stop slov, min. 3 znaky). */
export function tokens(text: string): Set<string> {
  const out = new Set<string>()
  const norm = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  for (const w of norm.split(/[^\p{L}\p{N}]+/u)) {
    if (w.length < 3 || STOP.has(w)) continue
    out.add(w)
  }
  return out
}

function overlap(a: Set<string>, b: Set<string>): number {
  let n = 0
  for (const w of a) if (b.has(w)) n++
  return n
}

export function relatedScore(current: RelatedCandidate, other: RelatedCandidate): number {
  let score = 0
  if (current.category && current.category === other.category) score += 3
  const kwA = tokens(current.keywords.join(' '))
  const kwB = tokens(other.keywords.join(' '))
  // celé klíčové fráze shodné → silný signál; sdílené tokeny → slabší
  const phrasesA = new Set(current.keywords.map((k) => k.trim().toLowerCase()).filter(Boolean))
  for (const k of other.keywords) if (phrasesA.has(k.trim().toLowerCase())) score += 4
  score += Math.min(overlap(kwA, kwB), 6)
  score += Math.min(overlap(tokens(current.title), tokens(other.title)), 3)
  return score
}

/**
 * Vrátí až `n` nejpříbuznějších článků (bez toho aktuálního). Když nic
 * tematicky nesedí (skóre 0), doplní se nejnovějšími — blok nemá zůstat
 * prázdný a nové články si tak zaslouží odkazy odevšad.
 */
export function pickRelated<T extends RelatedCandidate>(all: T[], current: RelatedCandidate, n = 3): T[] {
  const byDate = (a: T, b: T) => (b.date || '').localeCompare(a.date || '')
  const others = all.filter((a) => a.slug !== current.slug)
  const scored = others
    .map((a) => ({ a, s: relatedScore(current, a) }))
    .sort((x, y) => y.s - x.s || byDate(x.a, y.a))
  const picked = scored.filter((x) => x.s > 0).slice(0, n).map((x) => x.a)
  if (picked.length < n) {
    for (const a of [...others].sort(byDate)) {
      if (picked.length >= n) break
      if (!picked.includes(a)) picked.push(a)
    }
  }
  return picked
}
