/**
 * Payload CMS data access layer
 *
 * Uses Payload's local API (no network hop) for server-side data fetching.
 * All functions include try/catch — returns null/empty when DB has no data yet.
 */

import { getPayloadClient } from './payload'

type Locale = 'de' | 'en' | 'ru' | 'cs'

// ---- Pages ----

export async function getPageBySlug(slug: string, locale: Locale) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      locale,
      depth: 3,
      limit: 1,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

export async function getPages(locale: Locale) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { status: { equals: 'published' } },
      locale,
      sort: 'title',
      limit: 50,
    })
    return result.docs
  } catch {
    return []
  }
}

// ---- Articles ----

export async function getArticles(locale: Locale, options?: {
  limit?: number
  page?: number
  category?: string
  parentPillar?: string
}) {
  try {
    const payload = await getPayloadClient()
    const where: Record<string, any> = { status: { equals: 'published' } }
    if (options?.category) where['category.slug'] = { equals: options.category }
    if (options?.parentPillar) where.parentPillar = { equals: options.parentPillar }

    const result = await payload.find({
      collection: 'articles',
      where,
      locale,
      sort: '-publishedAt',
      limit: options?.limit || 12,
      page: options?.page || 1,
      depth: 2,
    })
    return { docs: result.docs, totalPages: result.totalPages, totalDocs: result.totalDocs }
  } catch {
    return { docs: [], totalPages: 0, totalDocs: 0 }
  }
}

export async function getArticleBySlug(slug: string, locale: Locale) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
      locale,
      depth: 3,
      limit: 1,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

export async function getArticlesByPillar(pillarId: string, locale: Locale) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'articles',
      where: {
        parentPillar: { equals: pillarId },
        status: { equals: 'published' },
      },
      locale,
      sort: '-publishedAt',
      depth: 2,
    })
    return result.docs
  } catch {
    return []
  }
}

// ---- People Stories ----

export async function getPeopleStories(locale: Locale, options?: {
  archetype?: string
  limit?: number
}) {
  try {
    const payload = await getPayloadClient()
    const where: Record<string, any> = { status: { equals: 'published' } }
    if (options?.archetype) where.archetype = { equals: options.archetype }

    const result = await payload.find({
      collection: 'people-stories',
      where,
      locale,
      sort: '-publishedAt',
      limit: options?.limit || 50,
      depth: 2,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getStoryBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'people-stories',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

// ---- Events ----

export async function getUpcomingEvents(locale: Locale, limit = 10) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      where: {
        status: { not_equals: 'past' },
        startDate: { greater_than: new Date().toISOString() },
      },
      locale,
      sort: 'startDate',
      limit,
    })
    return result.docs
  } catch {
    return []
  }
}

// ---- Globals ----

export async function getNavigation(locale: Locale) {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'navigation', locale })
  } catch {
    return null
  }
}

export async function getFooterData(locale: Locale) {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'footer', locale })
  } catch {
    return null
  }
}

export async function getSiteSettings() {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'site-settings' })
  } catch {
    return null
  }
}
