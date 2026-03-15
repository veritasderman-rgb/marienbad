import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'

// Collections
import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { Articles } from './collections/Articles'
import { PeopleStories } from './collections/PeopleStories'
import { Media } from './collections/Media'
import { Authors } from './collections/Authors'
import { Categories } from './collections/Categories'
import { Events } from './collections/Events'

// Globals
import { Navigation } from './globals/Navigation'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '| Marienbad.com CMS',
    },
  },

  editor: lexicalEditor(),

  collections: [
    Users,
    Pages,
    Articles,
    PeopleStories,
    Media,
    Authors,
    Categories,
    Events,
  ],

  globals: [
    Navigation,
    Footer,
    SiteSettings,
  ],

  localization: {
    locales: [
      { label: 'Deutsch', code: 'de' },
      { label: 'English', code: 'en' },
      { label: 'Русский', code: 'ru' },
      { label: 'Česky', code: 'cs' },
    ],
    defaultLocale: 'de',
    fallback: true,
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      ...(process.env.DATABASE_URL ? { ssl: { rejectUnauthorized: false } } : {}),
    },
  }),

  plugins: [
    seoPlugin({
      collections: ['pages', 'articles', 'people-stories'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }: any) => `${doc?.title} | Marienbad.com`,
      generateDescription: ({ doc }: any) => doc?.excerpt || '',
    }),
  ],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  upload: {
    limits: {
      fileSize: 10000000, // 10MB
    },
  },

  cors: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ],
  csrf: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ],

  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-PRODUCTION',
})
