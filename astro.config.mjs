import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import react from '@astrojs/react'
import keystatic from '@keystatic/astro'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://marienbad.com',
  output: 'server',
  adapter: vercel(),
  integrations: [react(), keystatic(), mdx(), sitemap()],
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
