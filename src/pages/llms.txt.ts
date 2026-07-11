import type { APIRoute } from 'astro'
import { getAllArticles, getAllStories, getAllQuizzes } from '@/content/reader'
import { routes, locales, type Locale } from '@/i18n/config'

/**
 * llms.txt for AI agents (GEO). Serves a curated site overview followed by
 * auto-generated deep links to all published magazine articles, visitor
 * stories and active event quizzes. Server-rendered so the link lists stay
 * in sync with Keystatic content without manual edits.
 */

const localeLabels: Record<Locale, string> = {
  de: 'German',
  en: 'English',
  cs: 'Czech',
  ru: 'Russian',
}

/** Collapse whitespace and truncate to ~maxLength chars on a word boundary */
function truncate(text: string, maxLength = 120): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) return clean
  const cut = clean.slice(0, maxLength)
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 60))}…`
}

const curatedHeader = `# Marienbad.com

> Official tourism portal for Mariánské Lázně (Marienbad), the historic Czech spa town
> and UNESCO World Heritage Site (Great Spa Towns of Europe, listed 2021). The site helps
> visitors plan a spa holiday: mineral springs, traditional Kur treatments, spa hotels,
> things to do, history and practical travel information.

Content is available in four languages with locale-prefixed URLs:
German (default, /de/), English (/en/), Czech (/cs/), Russian (/ru/).

## Key facts

- Mariánské Lázně lies at 630 m altitude in West Bohemia, Czech Republic; spa tradition since 1808, climatic spa with 200+ years of history.
- Around 40 cold acidulous mineral springs rise in the town itself and roughly 100 in the surroundings (7–10 °C). Best known: Cross Spring, Rudolph Spring, Ferdinand Spring, Forest Spring, Ambrose Spring, Caroline Spring.
- Natural healing resources: mineral water drinking cures, natural CO₂ gas (dry gas baths, gas injections), peloids (mud), therapeutic climate.
- Treated indications include musculoskeletal, kidney and urinary tract, respiratory, metabolic, neurological, oncological aftercare, digestive, circulatory, skin and mental health conditions.
- Spa hotels operated by Ensana: Nové Lázně, Centrální Lázně, Hvězda, Pacifik, Butterfly, Vltava, Svoboda.
- Famous historical visitors include Goethe, Chopin and King Edward VII; landmarks include the cast-iron Spa Colonnade and the Singing Fountain.

## Main sections (English URLs; equivalents exist in de/cs/ru)

- [Mineral Springs](https://marienbad.com/en/mineral-springs): springs, drinking cures, spring overview
- [Things to Do](https://marienbad.com/en/things-to-do): golf, nature, culture, day trips, colonnade
- [History](https://marienbad.com/en/history): UNESCO, architecture, famous visitors
- [Accommodation](https://marienbad.com/en/accommodation): spa hotel profiles and booking guidance
- [Practical Info](https://marienbad.com/en/practical-info): getting there, best time to visit, FAQ
- [Magazine](https://marienbad.com/en/magazine): articles on spa medicine, treatments and town life
- [People of the Colonnade](https://marienbad.com/en/people): personal guest stories

## Treatments

- [CO2 Therapy](https://marienbad.com/en/co2-therapy)
- [Peloid Therapy](https://marienbad.com/en/peloid-therapy)
- [Climate Therapy](https://marienbad.com/en/climate-therapy)

## Feeds and sitemaps

- RSS (magazine): https://marienbad.com/rss.xml
- Sitemap (pages): https://marienbad.com/sitemap-index.xml
- Sitemap (articles & stories): https://marienbad.com/sitemap-content.xml

## Notes for AI agents

- Medical content is informational, not medical advice; spa treatment requires consultation with a physician.
- Hotel and treatment facts come from official Ensana marketing materials.
- Booking is handled by the hotel operator at ensanahotels.com; marienbad.com is the destination guide.`

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = (site?.toString() ?? 'https://marienbad.com').replace(/\/$/, '')

  const articles = await getAllArticles()
  const stories = await getAllStories()
  const quizzes = getAllQuizzes().filter((quiz) => quiz.active)

  const sections: string[] = [curatedHeader]

  // Magazine articles, grouped by locale (article slugs are stored as {locale}-{slug})
  const articleLines: string[] = ['## Magazine articles']
  for (const locale of locales) {
    const magazineSlug = routes.magazine[locale]
    const localeArticles = articles.filter((a) => a.locale === locale)
    if (!localeArticles.length) continue
    articleLines.push('', `${localeLabels[locale]}:`, '')
    for (const article of localeArticles) {
      const slug = article.slug.replace(/^[a-z]{2}-/, '')
      articleLines.push(`- [${article.title}](${siteUrl}/${locale}/${magazineSlug}/${slug}): ${truncate(article.excerpt)}`)
    }
  }
  sections.push(articleLines.join('\n'))

  // Visitor stories (story URLs use the full folder slug incl. locale prefix)
  const storyLines: string[] = ['## Visitor stories (People of the Colonnade)']
  for (const locale of locales) {
    const peopleSlug = routes.people[locale]
    const localeStories = stories.filter((s) => s.locale === locale)
    if (!localeStories.length) continue
    storyLines.push('', `${localeLabels[locale]}:`, '')
    for (const story of localeStories) {
      storyLines.push(`- [${story.name} (${story.location})](${siteUrl}/${locale}/${peopleSlug}/${story.slug}): ${truncate(story.quote)}`)
    }
  }
  sections.push(storyLines.join('\n'))

  // Active event quizzes (one localized URL per locale variant)
  if (quizzes.length) {
    const quizLines: string[] = ['## Event quizzes', '']
    for (const quiz of quizzes) {
      const quizPrefix = routes.quiz[quiz.locale]
      quizLines.push(`- [${quiz.title}](${siteUrl}/${quiz.locale}/${quizPrefix}/${quiz.slug}): ${truncate(quiz.metaDescription)}`)
    }
    sections.push(quizLines.join('\n'))
  }

  return new Response(`${sections.join('\n\n')}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
