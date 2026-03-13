/**
 * Payload CMS API client
 *
 * Fetches content from the Payload CMS REST API.
 * Used by Next.js pages via SSG/ISR for optimal performance.
 */

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

type FetchOptions = {
  locale?: string
  depth?: number
  limit?: number
  page?: number
  where?: Record<string, any>
  sort?: string
}

async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { locale = 'de', depth = 2, limit, page, where, sort } = options

  const params = new URLSearchParams({
    locale,
    depth: String(depth),
  })

  if (limit) params.set('limit', String(limit))
  if (page) params.set('page', String(page))
  if (sort) params.set('sort', sort)

  if (where) {
    for (const [key, value] of Object.entries(where)) {
      if (typeof value === 'object') {
        for (const [op, val] of Object.entries(value)) {
          params.set(`where[${key}][${op}]`, String(val))
        }
      } else {
        params.set(`where[${key}][equals]`, String(value))
      }
    }
  }

  const url = `${CMS_URL}/api/${endpoint}?${params}`

  const res = await fetch(url, {
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText} for ${url}`)
  }

  return res.json()
}

// ---- Pages ----

export async function getPages(locale: string) {
  return fetchAPI<{ docs: any[] }>('pages', {
    locale,
    where: { status: 'published' },
    sort: 'title',
  })
}

export async function getPageBySlug(slug: string, locale: string) {
  const result = await fetchAPI<{ docs: any[] }>('pages', {
    locale,
    where: { slug: { equals: slug } },
    depth: 3,
  })
  return result.docs[0] || null
}

// ---- Articles ----

export async function getArticles(locale: string, options?: { limit?: number; page?: number; category?: string }) {
  return fetchAPI<{ docs: any[]; totalPages: number; totalDocs: number }>('articles', {
    locale,
    where: {
      status: 'published',
      ...(options?.category ? { 'category.slug': { equals: options.category } } : {}),
    },
    sort: '-publishedAt',
    limit: options?.limit || 12,
    page: options?.page || 1,
  })
}

export async function getArticleBySlug(slug: string, locale: string) {
  const result = await fetchAPI<{ docs: any[] }>('articles', {
    locale,
    where: { slug: { equals: slug } },
    depth: 3,
  })
  return result.docs[0] || null
}

export async function getArticlesByPillar(pillarId: string, locale: string) {
  return fetchAPI<{ docs: any[] }>('articles', {
    locale,
    where: {
      parentPillar: { equals: pillarId },
      status: 'published',
    },
    sort: '-publishedAt',
  })
}

// ---- People Stories ----

export async function getPeopleStories(locale: string, options?: { archetype?: string; limit?: number }) {
  return fetchAPI<{ docs: any[]; totalDocs: number }>('people-stories', {
    locale,
    where: {
      status: 'published',
      ...(options?.archetype ? { archetype: { equals: options.archetype } } : {}),
    },
    sort: '-publishedAt',
    limit: options?.limit || 50,
  })
}

export async function getStoryBySlug(slug: string) {
  // Stories are NOT localized in content (original language preserved)
  const result = await fetchAPI<{ docs: any[] }>('people-stories', {
    where: { slug: { equals: slug } },
    depth: 2,
  })
  return result.docs[0] || null
}

// ---- Events ----

export async function getUpcomingEvents(locale: string, limit = 10) {
  return fetchAPI<{ docs: any[] }>('events', {
    locale,
    where: {
      status: { not_equals: 'past' },
      startDate: { greater_than: new Date().toISOString() },
    },
    sort: 'startDate',
    limit,
  })
}

// ---- Globals ----

export async function getNavigation(locale: string) {
  return fetchAPI<any>('globals/navigation', { locale })
}

export async function getFooter(locale: string) {
  return fetchAPI<any>('globals/footer', { locale })
}

export async function getSiteSettings() {
  return fetchAPI<any>('globals/site-settings')
}

// ---- Newsletter ----

export async function subscribeToNewsletter(email: string) {
  const res = await fetch(`${CMS_URL}/api/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  return res.json()
}
