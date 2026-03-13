import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marienbad.com'

type GenerateMetadataOptions = {
  title: string
  description: string
  locale: string
  path: string
  ogImage?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

export function generatePageMetadata({
  title,
  description,
  locale,
  path,
  ogImage,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
}: GenerateMetadataOptions): Metadata {
  const url = `${SITE_URL}/${locale}${path}`
  const image = ogImage || `${SITE_URL}/images/og-default.jpg`

  const ogLocaleMap: Record<string, string> = {
    de: 'de_DE',
    en: 'en_GB',
    ru: 'ru_RU',
    cs: 'cs_CZ',
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        de: `${SITE_URL}/de${path}`,
        en: `${SITE_URL}/en${path}`,
        ru: `${SITE_URL}/ru${path}`,
        cs: `${SITE_URL}/cs${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Marienbad.com',
      locale: ogLocaleMap[locale] || 'en_GB',
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && publishedTime
        ? {
            publishedTime,
            modifiedTime: modifiedTime || publishedTime,
            authors: author ? [author] : undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

/**
 * Generate JSON-LD structured data for LocalBusiness
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: 'Mariánské Lázně (Marienbad)',
    alternateName: 'Marienbad',
    description: 'Historic spa town in western Bohemia, Czech Republic. UNESCO World Heritage Site.',
    url: SITE_URL,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.9646,
      longitude: 12.7012,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mariánské Lázně',
      addressRegion: 'Karlovy Vary Region',
      addressCountry: 'CZ',
    },
    touristType: ['Spa Tourism', 'Cultural Tourism', 'Health Tourism'],
  }
}

/**
 * Generate JSON-LD for Article
 */
export function generateArticleSchema(article: {
  title: string
  description: string
  url: string
  imageUrl: string
  publishedTime: string
  modifiedTime?: string
  authorName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.imageUrl,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    publisher: {
      '@type': 'Organization',
      name: 'Marienbad.com',
      url: SITE_URL,
    },
    ...(article.authorName
      ? {
          author: {
            '@type': 'Person',
            name: article.authorName,
          },
        }
      : {}),
  }
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate Event schema
 */
export function generateEventSchema(event: {
  name: string
  description: string
  startDate: string
  endDate?: string
  location: string
  url: string
  imageUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mariánské Lázně',
        addressCountry: 'CZ',
      },
    },
    url: event.url,
    ...(event.imageUrl ? { image: event.imageUrl } : {}),
  }
}
