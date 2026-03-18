import Markdoc from '@markdoc/markdoc'
import yaml from 'js-yaml'
import type { Locale } from '@/i18n/config'

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

export async function getPage(slug: string) {
  try {
    const yamlPath = `./pages/${slug}/index.yaml`
    const mdocPath = `./pages/${slug}/content.mdoc`

    const yamlRaw = yamlFiles[yamlPath]
    const mdocRaw = mdocFiles[mdocPath]

    if (!yamlRaw || !mdocRaw) return null

    const meta = yaml.load(yamlRaw as string) as Record<string, string>
    const ast = Markdoc.parse(mdocRaw as string)
    const content = Markdoc.transform(ast)

    return {
      title: meta.title ?? '',
      locale: meta.locale ?? '',
      section: meta.section ?? '',
      metaTitle: meta.metaTitle ?? '',
      metaDescription: meta.metaDescription ?? '',
      body: content,
    }
  } catch {
    return null
  }
}
