import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'
import type { Locale } from '@/i18n/config'

export const reader = createReader(process.cwd(), keystaticConfig)

export async function getHomepage(locale: Locale) {
  const key = `homepage-${locale}` as const
  const data = await reader.singletons[key].read()
  if (!data) throw new Error(`Homepage content not found for locale: ${locale}`)
  return data
}

export async function getSettings(locale: Locale) {
  const key = `settings-${locale}` as const
  const data = await reader.singletons[key].read()
  if (!data) throw new Error(`Settings not found for locale: ${locale}`)
  return data
}

export async function getPage(slug: string) {
  const page = await reader.collections.pages.read(slug, {
    resolveLinkedFiles: true,
  })
  return page
}
