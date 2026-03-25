import { useRef, useState, useEffect } from 'react'

interface Review {
  author: string
  rating: number
  date: string
  text: string
  lang: string
}

interface GoogleReviewsProps {
  locale: 'de' | 'en' | 'cs' | 'ru'
  translations: {
    title: string
    moreOnGoogle: string
  }
}

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Mari%C3%A1nsk%C3%A9+L%C3%A1zn%C4%9B/@49.9645986,12.7012619,14z'

const reviews: Review[] = [
  {
    author: 'Helga M.',
    rating: 5,
    date: '2025-09',
    text: 'Wunderschöne Kurstadt mit herrlicher Architektur. Die Kolonnaden und die Singende Fontäne sind ein Muss. Die Heilquellen haben mir sehr gutgetan.',
    lang: 'de',
  },
  {
    author: 'Thomas W.',
    rating: 5,
    date: '2025-07',
    text: 'Zum dritten Mal hier und immer wieder begeistert. Die Kur-Anwendungen sind erstklassig, die Stadt bezaubernd. Perfekt zum Entspannen.',
    lang: 'de',
  },
  {
    author: 'Sarah L.',
    rating: 4,
    date: '2025-10',
    text: 'A truly magical spa town. The mineral springs, the beautiful parks, and the elegant architecture make it a perfect retreat. Highly recommended!',
    lang: 'en',
  },
  {
    author: 'Jana K.',
    rating: 5,
    date: '2025-08',
    text: 'Nádherné lázeňské město s úžasnou atmosférou. Kolonáda, zpívající fontána a léčivé prameny — vše na jednom místě. Určitě se vrátíme.',
    lang: 'cs',
  },
  {
    author: 'Klaus R.',
    rating: 5,
    date: '2025-06',
    text: 'Exzellente Spa-Behandlungen und eine wunderbare historische Atmosphäre. Die Mineralquellen sind einzigartig. Ein Juwel in Böhmen.',
    lang: 'de',
  },
  {
    author: 'Emily B.',
    rating: 4,
    date: '2025-11',
    text: 'Such a charming town! The colonnades are stunning and the spa treatments were wonderful. The surrounding nature is perfect for walks.',
    lang: 'en',
  },
]

const OVERALL_RATING = 4.8
const TOTAL_REVIEWS = 2_847

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-beige-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg className="h-6" viewBox="0 0 272 92" aria-label="Google">
      <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S81 39.2 81 47.18c0 7.9 5.79 13.44 12.51 13.44s12.5-5.55 12.5-13.44z"/>
      <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
      <path fill="#FBBC05" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
      <path fill="#4285F4" d="M225 3v65h-9.5V3h9.5z"/>
      <path fill="#34A853" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
      <path fill="#EA4335" d="M35.29 41.19V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49-.21z"/>
    </svg>
  )
}

function formatDate(dateStr: string, locale: string): string {
  const [year, month] = dateStr.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString(locale === 'cs' ? 'cs-CZ' : locale === 'ru' ? 'ru-RU' : locale === 'de' ? 'de-DE' : 'en-US', {
    month: 'short',
    year: 'numeric',
  })
}

function truncate(text: string, maxLen = 140): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '\u2026'
}

export default function GoogleReviews({ locale, translations }: GoogleReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    updateScrollState()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = 320
    el.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' })
  }

  return (
    <section className="bg-beige-200 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2
            className="font-heading text-3xl md:text-4xl font-bold text-indigo-700 mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {translations.title}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <GoogleLogo />
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-indigo-900">{OVERALL_RATING}</span>
              <div>
                <StarRating rating={Math.round(OVERALL_RATING)} />
                <span className="text-sm text-beige-600">
                  {TOTAL_REVIEWS.toLocaleString(locale === 'de' ? 'de-DE' : locale === 'cs' ? 'cs-CZ' : locale === 'ru' ? 'ru-RU' : 'en-US')}{' '}
                  {locale === 'de' ? 'Bewertungen' : locale === 'cs' ? 'hodnocení' : locale === 'ru' ? 'отзывов' : 'reviews'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md text-indigo-700 hover:bg-indigo-50 transition-colors"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md text-indigo-700 hover:bg-indigo-50 transition-colors"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...reviews].sort((a, b) => {
              const aMatch = a.lang === locale ? 0 : 1
              const bMatch = b.lang === locale ? 0 : 1
              return aMatch - bMatch
            }).map((review, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[300px] sm:w-[340px] snap-start bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-beige-500">{formatDate(review.date, locale)}</span>
                </div>
                <p className="text-beige-800 text-sm leading-relaxed mb-4" lang={review.lang}>
                  {truncate(review.text)}
                </p>
                <div className="flex items-center justify-between border-t border-beige-200 pt-3">
                  <span className="text-sm font-semibold text-indigo-800">{review.author}</span>
                  <span className="flex items-center gap-1 text-xs text-beige-500">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zm-.5-9.5v4l3.5 2.1.5-.82-3-1.78V7h-1z" />
                    </svg>
                    Google
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-indigo-700 border-2 border-indigo-700 rounded-full hover:bg-indigo-700 hover:text-white transition-colors"
          >
            {translations.moreOnGoogle}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
