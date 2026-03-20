import type { APIRoute } from 'astro'
import { getStories } from '@/content/reader'
import type { Locale } from '@/i18n/config'

const locales: Locale[] = ['de', 'en', 'cs', 'ru']

const peopleSlugs: Record<Locale, string> = {
  de: 'menschen',
  en: 'people',
  cs: 'lide',
  ru: 'lyudi',
}

export const GET: APIRoute = async () => {
  const allStories = (
    await Promise.all(locales.map((locale) => getStories(locale)))
  ).flat()

  // Sort alphabetically by name
  allStories.sort((a, b) => a.name.localeCompare(b.name))

  const items = allStories
    .map((story) => {
      const locale = story.locale as Locale
      const segment = peopleSlugs[locale] ?? 'people'
      const pageSlug = story.slug.replace(/^[a-z]{2}-/, '')
      return `
    <item>
      <title><![CDATA[${story.name}]]></title>
      <description><![CDATA[${story.quote}]]></description>
      <link>https://marienbad.com/${locale}/${segment}/${pageSlug}</link>
      <dc:language>${locale}</dc:language>
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>People of the Colonnade — Marienbad Stories</title>
    <description>Personal stories from visitors and locals of Mariánské Lázně</description>
    <link>https://marienbad.com</link>
    <atom:link href="https://marienbad.com/stories-feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(rss.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
