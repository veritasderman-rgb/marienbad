import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import react from '@astrojs/react'
import keystatic from '@keystatic/astro'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://marienbad.vercel.app',
  output: 'server',
  adapter: vercel(),
  integrations: [react(), keystatic(), mdx(), sitemap()],
  image: {
    domains: ['marienbad.vercel.app', 'marienbad.com'],
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
