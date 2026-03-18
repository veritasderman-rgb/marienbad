import type { APIRoute } from 'astro'
import { getAllArticles } from '@/content/reader'

export const GET: APIRoute = async () => {
  const articles = await getAllArticles()

  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <link>https://marienbad.com/${article.locale}/${article.locale === 'de' ? 'magazin' : article.locale === 'cs' ? 'magazin' : article.locale === 'ru' ? 'zhurnal' : 'magazine'}/${article.slug.replace(/^[a-z]{2}-/, '')}</link>
      <category>${article.category}</category>
      <dc:language>${article.locale}</dc:language>
    </item>`
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Marienbad Magazine</title>
    <description>Stories, tips and insights from Mariánské Lázně</description>
    <link>https://marienbad.com</link>
    <atom:link href="https://marienbad.com/rss.xml" rel="self" type="application/rss+xml"/>
    <language>de</language>
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
