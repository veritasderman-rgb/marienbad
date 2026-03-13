import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/config'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marienbad.com'

// Static pages per locale
const staticPages = [
  '/',
  '/mineral-springs',
  '/things-to-do',
  '/accommodation',
  '/history',
  '/practical-info',
  '/people',
  '/magazine',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${page === '/' ? '' : page}`,
        lastModified: new Date(),
        changeFrequency: page === '/' ? 'daily' : 'weekly',
        priority: page === '/' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}${page === '/' ? '' : page}`])
          ),
        },
      })
    }
  }

  // TODO: Fetch dynamic pages from Payload CMS
  // const articles = await getArticles('en', { limit: 1000 })
  // for (const article of articles.docs) { ... }

  // TODO: Fetch people stories from Payload CMS
  // const stories = await getPeopleStories('en', { limit: 1000 })
  // for (const story of stories.docs) { ... }

  return entries
}
