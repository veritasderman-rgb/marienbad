import { useState, useMemo } from 'react'

interface StoryData {
  slug: string
  name: string
  location: string
  visitLabel: string
  quote: string
  lang: string
  locale: string
  portrait?: string
}

interface Translations {
  all: string
  byLanguage: string
  byLocation: string
  noResults: string
}

const PEOPLE_ROUTES: Record<string, string> = {
  de: 'menschen',
  en: 'people',
  cs: 'lide',
  ru: 'lyudi',
}

const LOCALE_LABELS: Record<string, string> = {
  de: 'DE',
  en: 'EN',
  cs: 'CS',
  ru: 'RU',
}

const GRADIENTS = [
  'linear-gradient(135deg, #1A1916 0%, #266782 100%)',
  'linear-gradient(135deg, #1A1916 0%, #004F71 100%)',
  'linear-gradient(135deg, #1A1916 0%, #3A8BA8 100%)',
]

function StoryCard({ story, index }: { story: StoryData; index: number }) {
  const peopleSlug = PEOPLE_ROUTES[story.locale] ?? 'people'
  const href = `/${story.locale}/${peopleSlug}/${story.slug}`
  const hasPortrait = story.portrait && story.portrait.trim().length > 0

  return (
    <a
      href={href}
      className="group bg-white/5 rounded-xl overflow-hidden block no-underline transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className="h-64 relative overflow-hidden"
        style={!hasPortrait ? { background: GRADIENTS[index % 3] } : undefined}
      >
        {hasPortrait ? (
          <img
            src={story.portrait}
            alt={story.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="text-white/60 text-sm absolute inset-0 flex items-center justify-center">
            Portrait — Foto
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
          <p
            className="font-heading text-base italic text-white/90 leading-snug mb-2"
            lang={story.lang || undefined}
          >
            &ldquo;{story.quote}&rdquo;
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm">{story.name}</span>
            <span className="text-white/50 text-sm">&middot; {story.location}</span>
            <span className="px-2 py-0.5 bg-turquoise-400/30 text-turquoise-300 text-xs rounded-full ml-auto">
              {story.visitLabel}
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}

interface StoryFilterProps {
  stories: StoryData[]
  translations: Translations
  currentLocale: string
}

export default function StoryFilter({ stories, translations, currentLocale }: StoryFilterProps) {
  const [activeLocale, setActiveLocale] = useState<string>('all')
  const [activeLocation, setActiveLocation] = useState<string>('all')

  // Get unique locales present in stories
  const availableLocales = useMemo(() => {
    const locales = [...new Set(stories.map((s) => s.locale))]
    locales.sort((a, b) => {
      const order = ['de', 'en', 'cs', 'ru']
      return order.indexOf(a) - order.indexOf(b)
    })
    return locales
  }, [stories])

  // Get unique locations from (filtered-by-locale) stories
  const availableLocations = useMemo(() => {
    const filtered = activeLocale === 'all' ? stories : stories.filter((s) => s.locale === activeLocale)
    const locations = [...new Set(filtered.map((s) => s.location))]
    locations.sort()
    return locations
  }, [stories, activeLocale])

  // Reset location filter when locale changes and the selected location is no longer available
  const effectiveLocation = availableLocations.includes(activeLocation) ? activeLocation : 'all'

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      if (activeLocale !== 'all' && story.locale !== activeLocale) return false
      if (effectiveLocation !== 'all' && story.location !== effectiveLocation) return false
      return true
    })
  }, [stories, activeLocale, effectiveLocation])

  const buttonBase =
    'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border'
  const buttonActive =
    'bg-indigo-700 text-white border-indigo-700'
  const buttonInactive =
    'bg-white text-indigo-700 border-beige-300 hover:bg-beige-100 hover:border-indigo-400'

  return (
    <div>
      {/* Language filter */}
      <div className="mb-4">
        <span className="text-sm font-medium text-indigo-600 mr-3">{translations.byLanguage}:</span>
        <div className="inline-flex flex-wrap gap-2 mt-1">
          <button
            className={`${buttonBase} ${activeLocale === 'all' ? buttonActive : buttonInactive}`}
            onClick={() => {
              setActiveLocale('all')
              setActiveLocation('all')
            }}
          >
            {translations.all}
          </button>
          {availableLocales.map((locale) => (
            <button
              key={locale}
              className={`${buttonBase} ${activeLocale === locale ? buttonActive : buttonInactive}`}
              onClick={() => {
                setActiveLocale(locale)
                setActiveLocation('all')
              }}
            >
              {LOCALE_LABELS[locale] ?? locale.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Location filter - only show if there are multiple locations */}
      {availableLocations.length > 1 && (
        <div className="mb-8">
          <span className="text-sm font-medium text-indigo-600 mr-3">{translations.byLocation}:</span>
          <div className="inline-flex flex-wrap gap-2 mt-1">
            <button
              className={`${buttonBase} ${effectiveLocation === 'all' ? buttonActive : buttonInactive}`}
              onClick={() => setActiveLocation('all')}
            >
              {translations.all}
            </button>
            {availableLocations.map((loc) => (
              <button
                key={loc}
                className={`${buttonBase} ${effectiveLocation === loc ? buttonActive : buttonInactive}`}
                onClick={() => setActiveLocation(loc)}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Story grid */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredStories.map((story, i) => (
            <StoryCard key={`${story.locale}-${story.slug}`} story={story} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-indigo-500 text-center py-12">{translations.noResults}</p>
      )}
    </div>
  )
}
