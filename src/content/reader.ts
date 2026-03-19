import Markdoc from '@markdoc/markdoc'
import yaml from 'js-yaml'
import type { Locale } from '@/i18n/config'
import { markdocConfig } from '@/markdoc/config'

// Homepage JSON imports (bundled at build time)
import homepageDe from './homepage/de.json'
import homepageEn from './homepage/en.json'
import homepageCs from './homepage/cs.json'
import homepageRu from './homepage/ru.json'

// Settings JSON imports (bundled at build time)
import settingsDe from './settings/de.json'
import settingsEn from './settings/en.json'
import settingsCs from './settings/cs.json'
import settingsRu from './settings/ru.json'

const homepages: Record<Locale, typeof homepageDe> = {
  de: homepageDe,
  en: homepageEn,
  cs: homepageCs,
  ru: homepageRu,
}

const settings: Record<Locale, typeof settingsDe> = {
  de: settingsDe,
  en: settingsEn,
  cs: settingsCs,
  ru: settingsRu,
}

export async function getHomepage(locale: Locale) {
  const data = homepages[locale]
  if (!data) throw new Error(`Homepage content not found for locale: ${locale}`)
  return data
}

export async function getSettings(locale: Locale) {
  const data = settings[locale]
  if (!data) throw new Error(`Settings not found for locale: ${locale}`)
  return data
}

// Import all page YAML and Markdoc files using Vite's glob import
const yamlFiles = import.meta.glob('./pages/*/index.yaml', { query: '?raw', import: 'default', eager: true })
const mdocFiles = import.meta.glob('./pages/*/content.mdoc', { query: '?raw', import: 'default', eager: true })

// Import all article YAML and Markdoc files
const articleYamlFiles = import.meta.glob('./articles/*/index.yaml', { query: '?raw', import: 'default', eager: true })
const articleMdocFiles = import.meta.glob('./articles/*/content.mdoc', { query: '?raw', import: 'default', eager: true })

export async function getPage(slug: string) {
  try {
    const yamlPath = `./pages/${slug}/index.yaml`
    const mdocPath = `./pages/${slug}/content.mdoc`

    const yamlRaw = yamlFiles[yamlPath]
    const mdocRaw = mdocFiles[mdocPath]

    if (!yamlRaw || !mdocRaw) return null

    const meta = yaml.load(yamlRaw as string) as Record<string, string>
    const ast = Markdoc.parse(mdocRaw as string)
    const content = Markdoc.transform(ast, markdocConfig)

    return {
      title: meta.title ?? '',
      locale: meta.locale ?? '',
      section: meta.section ?? '',
      metaTitle: meta.metaTitle ?? '',
      metaDescription: meta.metaDescription ?? '',
      pullQuote: meta.pullQuote ?? '',
      body: content,
    }
  } catch {
    return null
  }
}

export interface Article {
  slug: string
  title: string
  locale: string
  category: string
  pullQuote?: string
  excerpt: string
  date: string
  readingTime: string
  coverImage?: string
  youtubeVideoId?: string
  youtubeTitle?: string
  youtubeDescription?: string
  body: any
}

export async function getArticles(locale: Locale): Promise<Article[]> {
  const articles: Article[] = []

  for (const [path, rawYaml] of Object.entries(articleYamlFiles)) {
    // path looks like ./articles/de-co2-baeder-wissenschaft/index.yaml
    const slug = path.replace('./articles/', '').replace('/index.yaml', '')
    const meta = yaml.load(rawYaml as string) as Record<string, string>

    if (meta.locale !== locale) continue

    const mdocPath = `./articles/${slug}/content.mdoc`
    const mdocRaw = articleMdocFiles[mdocPath]
    if (!mdocRaw) continue

    const ast = Markdoc.parse(mdocRaw as string)
    const content = Markdoc.transform(ast, markdocConfig)

    articles.push({
      slug,
      title: meta.title ?? '',
      locale: meta.locale ?? '',
      category: meta.category ?? '',
      pullQuote: meta.pullQuote ?? '',
      excerpt: meta.excerpt ?? '',
      date: meta.date ?? '',
      readingTime: meta.readingTime ?? '',
      coverImage: meta.coverImage ?? '',
      youtubeVideoId: meta.youtubeVideoId ?? '',
      youtubeTitle: meta.youtubeTitle ?? '',
      youtubeDescription: meta.youtubeDescription ?? '',
      body: content,
    })
  }

  // Sort by date descending
  articles.sort((a, b) => b.date.localeCompare(a.date))
  return articles
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const yamlPath = `./articles/${slug}/index.yaml`
    const mdocPath = `./articles/${slug}/content.mdoc`

    const yamlRaw = articleYamlFiles[yamlPath]
    const mdocRaw = articleMdocFiles[mdocPath]

    if (!yamlRaw || !mdocRaw) return null

    const meta = yaml.load(yamlRaw as string) as Record<string, string>
    const ast = Markdoc.parse(mdocRaw as string)
    const content = Markdoc.transform(ast, markdocConfig)

    return {
      slug,
      title: meta.title ?? '',
      locale: meta.locale ?? '',
      category: meta.category ?? '',
      pullQuote: meta.pullQuote ?? '',
      excerpt: meta.excerpt ?? '',
      date: meta.date ?? '',
      readingTime: meta.readingTime ?? '',
      coverImage: meta.coverImage ?? '',
      youtubeVideoId: meta.youtubeVideoId ?? '',
      youtubeTitle: meta.youtubeTitle ?? '',
      youtubeDescription: meta.youtubeDescription ?? '',
      body: content,
    }
  } catch {
    return null
  }
}

// Import all story YAML and Markdoc files
const storyYamlFiles = import.meta.glob('./stories/*/index.yaml', { query: '?raw', import: 'default', eager: true })
const storyMdocFiles = import.meta.glob('./stories/*/content.mdoc', { query: '?raw', import: 'default', eager: true })

export interface Story {
  slug: string
  title: string
  locale: string
  name: string
  location: string
  visitLabel: string
  quote: string
  lang: string
  portrait?: string
  body: any
}

export async function getStories(locale: Locale): Promise<Story[]> {
  const stories: Story[] = []

  for (const [path, rawYaml] of Object.entries(storyYamlFiles)) {
    const slug = path.replace('./stories/', '').replace('/index.yaml', '')
    const meta = yaml.load(rawYaml as string) as Record<string, string>

    if (meta.locale !== locale) continue

    const mdocPath = `./stories/${slug}/content.mdoc`
    const mdocRaw = storyMdocFiles[mdocPath]
    if (!mdocRaw) continue

    const ast = Markdoc.parse(mdocRaw as string)
    const content = Markdoc.transform(ast, markdocConfig)

    stories.push({
      slug,
      title: meta.title ?? '',
      locale: meta.locale ?? '',
      name: meta.name ?? '',
      location: meta.location ?? '',
      visitLabel: meta.visitLabel ?? '',
      quote: meta.quote ?? '',
      lang: meta.lang ?? '',
      portrait: meta.portrait ?? '',
      body: content,
    })
  }

  return stories
}

export async function getAllStories(): Promise<Story[]> {
  const stories: Story[] = []

  for (const [path, rawYaml] of Object.entries(storyYamlFiles)) {
    const slug = path.replace('./stories/', '').replace('/index.yaml', '')
    const meta = yaml.load(rawYaml as string) as Record<string, string>

    const mdocPath = `./stories/${slug}/content.mdoc`
    const mdocRaw = storyMdocFiles[mdocPath]
    if (!mdocRaw) continue

    const ast = Markdoc.parse(mdocRaw as string)
    const content = Markdoc.transform(ast, markdocConfig)

    stories.push({
      slug,
      title: meta.title ?? '',
      locale: meta.locale ?? '',
      name: meta.name ?? '',
      location: meta.location ?? '',
      visitLabel: meta.visitLabel ?? '',
      quote: meta.quote ?? '',
      lang: meta.lang ?? '',
      portrait: meta.portrait ?? '',
      body: content,
    })
  }

  return stories
}

export async function getStory(slug: string): Promise<Story | null> {
  try {
    const yamlPath = `./stories/${slug}/index.yaml`
    const mdocPath = `./stories/${slug}/content.mdoc`

    const yamlRaw = storyYamlFiles[yamlPath]
    const mdocRaw = storyMdocFiles[mdocPath]

    if (!yamlRaw || !mdocRaw) return null

    const meta = yaml.load(yamlRaw as string) as Record<string, string>
    const ast = Markdoc.parse(mdocRaw as string)
    const content = Markdoc.transform(ast, markdocConfig)

    return {
      slug,
      title: meta.title ?? '',
      locale: meta.locale ?? '',
      name: meta.name ?? '',
      location: meta.location ?? '',
      visitLabel: meta.visitLabel ?? '',
      quote: meta.quote ?? '',
      lang: meta.lang ?? '',
      portrait: meta.portrait ?? '',
      body: content,
    }
  } catch {
    return null
  }
}

export async function getAllArticles(): Promise<Article[]> {
  const articles: Article[] = []

  for (const [path, rawYaml] of Object.entries(articleYamlFiles)) {
    const slug = path.replace('./articles/', '').replace('/index.yaml', '')
    const meta = yaml.load(rawYaml as string) as Record<string, string>

    const mdocPath = `./articles/${slug}/content.mdoc`
    const mdocRaw = articleMdocFiles[mdocPath]
    if (!mdocRaw) continue

    const ast = Markdoc.parse(mdocRaw as string)
    const content = Markdoc.transform(ast, markdocConfig)

    articles.push({
      slug,
      title: meta.title ?? '',
      locale: meta.locale ?? '',
      category: meta.category ?? '',
      pullQuote: meta.pullQuote ?? '',
      excerpt: meta.excerpt ?? '',
      date: meta.date ?? '',
      readingTime: meta.readingTime ?? '',
      coverImage: meta.coverImage ?? '',
      youtubeVideoId: meta.youtubeVideoId ?? '',
      youtubeTitle: meta.youtubeTitle ?? '',
      youtubeDescription: meta.youtubeDescription ?? '',
      body: content,
    })
  }

  articles.sort((a, b) => b.date.localeCompare(a.date))
  return articles
}
