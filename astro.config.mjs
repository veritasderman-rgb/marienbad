import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import react from '@astrojs/react'
import keystatic from '@keystatic/astro'
import tailwindcss from '@tailwindcss/vite'

/** Noindexed campaign landing pages — kept out of the sitemap to match their robots meta */
const NOINDEXED_PATHS = ['sommer-sale-2026', 'summer-sale-2026', 'letni-sleva-2026', 'letnyaya-rasprodazha-2026']

export default defineConfig({
  site: 'https://marienbad.com',
  trailingSlash: 'never',
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    keystatic(),
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/keystatic') &&
        // root "/" only redirects by Accept-Language — not an indexable page
        new URL(page).pathname !== '/' &&
        !NOINDEXED_PATHS.some((p) => page.includes(`/${p}`)),
      serialize: (item) => {
        const url = item.url
        // Homepages — highest priority
        if (url.match(/\/[a-z]{2}\/?$/)) {
          return { ...item, changefreq: 'weekly', priority: 1.0 }
        }
        // Pillar pages (mineral-springs, accommodation, etc.)
        if (url.match(/\/[a-z]{2}\/[^/]+\/?$/) && !url.includes('/magazin') && !url.includes('/magazine') && !url.includes('/zhurnal')) {
          return { ...item, changefreq: 'weekly', priority: 0.9 }
        }
        // Magazine index
        if (url.match(/\/(magazin|magazine|zhurnal)\/?$/)) {
          return { ...item, changefreq: 'daily', priority: 0.8 }
        }
        // Individual articles
        if (url.match(/\/(magazin|magazine|zhurnal)\//)) {
          return { ...item, changefreq: 'monthly', priority: 0.7 }
        }
        // Everything else
        return { ...item, changefreq: 'monthly', priority: 0.5 }
      },
    }),
  ],
  image: {
    domains: ['marienbad.com', 'marienbad.vercel.app'],
  },
  security: {
    allowedDomains: [
      { hostname: '*.vercel.app', protocol: 'https' },
      { hostname: 'marienbad.com', protocol: 'https' },
      { hostname: '*.marienbad.com', protocol: 'https' },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'cs', 'ru'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
})
