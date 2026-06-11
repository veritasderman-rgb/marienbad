#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (picked up by Seznam.cz, Bing and Yandex).
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs <url> [<url> ...]   # submit specific URLs
 *   node scripts/indexnow-submit.mjs --sitemap           # submit all URLs from both sitemaps
 *
 * The key file public/<key>.txt must stay deployed at the site root —
 * IndexNow validates ownership against it on every submission.
 */

const HOST = 'marienbad.com'
const KEY = '4333962c8157b63b008a42154c2cf82d'
const ENDPOINT = 'https://api.indexnow.org/indexnow'

async function urlsFromSitemaps() {
  const sitemaps = [
    `https://${HOST}/sitemap-0.xml`,
    `https://${HOST}/sitemap-content.xml`,
  ]
  const urls = []
  for (const sitemap of sitemaps) {
    const res = await fetch(sitemap)
    if (!res.ok) {
      console.error(`Skipping ${sitemap}: HTTP ${res.status}`)
      continue
    }
    const xml = await res.text()
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.push(match[1])
    }
  }
  return urls
}

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: indexnow-submit.mjs <url> [...] | --sitemap')
  process.exit(1)
}

const urlList = args[0] === '--sitemap' ? await urlsFromSitemaps() : args

if (urlList.length === 0) {
  console.error('No URLs to submit.')
  process.exit(1)
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
})

console.log(`Submitted ${urlList.length} URL(s) → HTTP ${res.status} ${res.statusText}`)
if (!res.ok) process.exit(1)
