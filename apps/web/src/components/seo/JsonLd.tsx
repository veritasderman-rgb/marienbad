/**
 * JSON-LD Structured Data Components
 *
 * Renders schema.org structured data as <script type="application/ld+json">
 * for Google Rich Results.
 */

type JsonLdProps = {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ─── Pre-built schemas ───────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marienbad.com'

export function TouristDestinationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: 'Mariánské Lázně (Marienbad)',
        alternateName: ['Marienbad', 'Mariánské Lázně'],
        description:
          'Historic spa town in western Bohemia, Czech Republic. UNESCO World Heritage Site with over 40 mineral springs.',
        url: SITE_URL,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 49.9646,
          longitude: 12.7012,
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mariánské Lázně',
          postalCode: '353 01',
          addressRegion: 'Karlovy Vary Region',
          addressCountry: 'CZ',
        },
        touristType: ['Spa Tourism', 'Cultural Tourism', 'Health Tourism', 'Nature Tourism'],
        image: `${SITE_URL}/images/og-default.jpg`,
      }}
    />
  )
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Marienbad.com',
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        inLanguage: ['de', 'en'],
      }}
    />
  )
}

type ArticleJsonLdProps = {
  title: string
  description: string
  url: string
  imageUrl?: string
  publishedTime: string
  modifiedTime?: string
  authorName?: string
  locale: string
}

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  publishedTime,
  modifiedTime,
  authorName,
  locale,
}: ArticleJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url: `${SITE_URL}/${locale}${url}`,
        image: imageUrl || `${SITE_URL}/images/og-default.jpg`,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        publisher: {
          '@type': 'Organization',
          name: 'Marienbad.com',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/logo.png`,
          },
        },
        ...(authorName
          ? {
              author: {
                '@type': 'Person',
                name: authorName,
              },
            }
          : {}),
        inLanguage: locale === 'de' ? 'de-DE' : locale === 'cs' ? 'cs-CZ' : locale === 'ru' ? 'ru-RU' : 'en-GB',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/${locale}${url}`,
        },
      }}
    />
  )
}

type FAQJsonLdProps = {
  items: { question: string; answer: string }[]
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }}
    />
  )
}

type EventJsonLdProps = {
  name: string
  description: string
  startDate: string
  endDate?: string
  location: string
  url: string
  imageUrl?: string
  locale: string
}

export function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  location,
  url,
  imageUrl,
  locale,
}: EventJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Event',
        name,
        description,
        startDate,
        endDate: endDate || startDate,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: location,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Mariánské Lázně',
            addressCountry: 'CZ',
          },
        },
        organizer: {
          '@type': 'Organization',
          name: 'Marienbad.com',
          url: SITE_URL,
        },
        url: `${SITE_URL}/${locale}${url}`,
        ...(imageUrl ? { image: imageUrl } : {}),
        inLanguage: locale === 'de' ? 'de-DE' : 'en-GB',
      }}
    />
  )
}

type BreadcrumbJsonLdProps = {
  items: { name: string; url: string }[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        })),
      }}
    />
  )
}
