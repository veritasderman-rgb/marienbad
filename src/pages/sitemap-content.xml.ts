import type { APIRoute } from 'astro'
import { getAllArticles, getAllStories } from '@/content/reader'
import { routes, type Locale } from '@/i18n/config'

/**
 * Sitemap for CMS-driven content (magazine articles + People of Colonnade
 * stories). These routes are server-rendered, so @astrojs/sitemap cannot
 * enumerate them at build time — this endpoint reads them from Keystatic
 * content instead. Referenced from robots.txt alongside sitemap-index.xml.
 */
export const GET: APIRoute = async ({ site }) => {
  const siteUrl = (site?.toString() ?? 'https://marienbad.com').replace(/\/$/, '')

  const articles = await getAllArticles()
  const stories = await getAllStories()

  const entries: { loc: string; lastmod?: string }[] = []

  for (const article of articles) {
    const locale = article.locale as Locale
    const magazineSlug = routes.magazine[locale]
    if (!magazineSlug) continue
    const slug = article.slug.replace(/^[a-z]{2}-/, '')
    entries.push({
      loc: `${siteUrl}/${locale}/${magazineSlug}/${slug}`,
      lastmod: /^\d{4}-\d{2}-\d{2}/.test(article.date) ? article.date.slice(0, 10) : undefined,
    })
  }

  for (const story of stories) {
    const locale = story.locale as Locale
    const peopleSlug = routes.people[locale]
    if (!peopleSlug) continue
    entries.push({ loc: `${siteUrl}/${locale}/${peopleSlug}/${story.slug}` })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
