import { useState } from 'react'

type Locale = 'de' | 'en' | 'cs' | 'ru'
type Category = 'families' | 'couples' | 'solo' | 'wellness'

interface Props {
  locale: Locale
  translations: {
    title: string
    subtitle: string
    families: string
    couples: string
    solo: string
    wellness: string
    hotelLabel: string
    activitiesLabel: string
    treatmentLabel: string
    tripLabel: string
    articleLabel: string
    detailsLink: string
  }
  cmsData?: {
    categories: Array<{
      key: string
      items: Array<{
        icon: string
        image: string | null
        type: 'hotel' | 'activity' | 'treatment' | 'trip' | 'article'
        titleDe: string
        titleEn: string
        titleCs: string
        titleRu: string
        descriptionDe: string
        descriptionEn: string
        descriptionCs: string
        descriptionRu: string
        hrefDe: string
        hrefEn: string
        hrefCs: string
        hrefRu: string
      }>
    }>
  }
}

const categoryIcons: Record<Category, string> = {
  families: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  couples: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  solo: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  wellness: 'M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2 2-2 2M19 13l2 2-2 2M17 3l4 4M21 17l-4 4',
}

const typeIcons: Record<'hotel' | 'activity' | 'treatment' | 'trip' | 'article', string> = {
  hotel: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  activity: 'M13 10V3L4 14h7v7l9-11h-7z',
  treatment: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  trip: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  article: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m-9 4h6m-6 4h6m4-8v10a2 2 0 01-2 2h-1a2 2 0 01-2-2V7a2 2 0 012-2h1a2 2 0 012 2z',
}

const titleKey: Record<Locale, 'titleDe' | 'titleEn' | 'titleCs' | 'titleRu'> = {
  de: 'titleDe', en: 'titleEn', cs: 'titleCs', ru: 'titleRu',
}
const descKey: Record<Locale, 'descriptionDe' | 'descriptionEn' | 'descriptionCs' | 'descriptionRu'> = {
  de: 'descriptionDe', en: 'descriptionEn', cs: 'descriptionCs', ru: 'descriptionRu',
}
const hrefKey: Record<Locale, 'hrefDe' | 'hrefEn' | 'hrefCs' | 'hrefRu'> = {
  de: 'hrefDe', en: 'hrefEn', cs: 'hrefCs', ru: 'hrefRu',
}

export default function ItineraryFilter({ locale, translations, cmsData }: Props) {
  const [active, setActive] = useState<Category>('families')
  const [fading, setFading] = useState(false)

  const categories: Category[] = ['families', 'couples', 'solo', 'wellness']
  const categoryLabels: Record<Category, string> = {
    families: translations.families,
    couples: translations.couples,
    solo: translations.solo,
    wellness: translations.wellness,
  }

  const typeLabelMap: Record<'hotel' | 'activity' | 'treatment' | 'trip' | 'article', string> = {
    hotel: translations.hotelLabel,
    activity: translations.activitiesLabel,
    treatment: translations.treatmentLabel,
    trip: translations.tripLabel,
    article: translations.articleLabel,
  }

  function switchCategory(cat: Category) {
    if (cat === active) return
    setFading(true)
    setTimeout(() => {
      setActive(cat)
      setFading(false)
    }, 200)
  }

  const cmsCategory = cmsData?.categories.find((c) => c.key === active)
  const items = cmsCategory?.items || []

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => switchCategory(cat)}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
              transition-all duration-200 cursor-pointer
              ${
                active === cat
                  ? 'bg-indigo-700 text-white shadow-lg'
                  : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
              }
            `}
            aria-pressed={active === cat}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[cat]} />
            </svg>
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Recommendation cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-200 ${
          fading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {items.map((item, i) => {
          const href = item[hrefKey[locale]]
          const hasImage = !!item.image

          return (
            <div
              key={`${active}-${i}`}
              className="bg-white rounded-xl shadow-card overflow-hidden flex flex-col card-hover"
            >
              {/* Photo or icon header */}
              {hasImage ? (
                <div className="h-40 relative overflow-hidden">
                  <img
                    src={item.image!}
                    alt={item[titleKey[locale]]}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-turquoise-50/90 text-turquoise-800 text-xs font-medium rounded-full backdrop-blur-sm">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={typeIcons[item.type]} />
                      </svg>
                      {typeLabelMap[item.type]}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6 pb-0">
                  {/* Type badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-turquoise-50 text-turquoise-800 text-xs font-medium rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={typeIcons[item.type]} />
                      </svg>
                      {typeLabelMap[item.type]}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className={`flex flex-col flex-1 ${hasImage ? 'p-6' : 'px-6 pb-6'}`}>
                <h3 className="font-bold text-lg text-indigo-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item[titleKey[locale]]}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
                  {item[descKey[locale]]}
                </p>

                {/* Link */}
                {href ? (
                  <a
                    href={href}
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="inline-flex items-center gap-1.5 text-turquoise-700 hover:text-turquoise-900 text-sm font-semibold transition-colors"
                  >
                    {translations.detailsLink}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-turquoise-700 text-sm font-semibold">
                    {translations.detailsLink}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
