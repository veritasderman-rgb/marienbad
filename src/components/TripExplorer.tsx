import { useMemo, useState } from 'react'
import {
  dayTrips,
  tripCategoryOrder,
  tripDifficultyOrder,
  tripTagOrder,
  TRIP_ORIGIN,
  type DayTrip,
  type TripCategory,
  type TripDifficulty,
  type TripTag,
} from '@/data/dayTrips'

type Locale = 'de' | 'en' | 'cs' | 'ru'

interface Props {
  locale: Locale
}

interface UiStrings {
  categoryLabel: string
  categories: Record<TripCategory, string>
  difficultyLabel: string
  difficulties: Record<TripDifficulty, string>
  tagsLabel: string
  tags: Record<TripTag, string>
  all: string
  viewList: string
  viewMap: string
  results: (n: number) => string
  reset: string
  drive: string
  onFoot: string
  visit: string
  hoursUnit: string
  route: string
  mapLink: string
  website: string
  mapHint: string
  origin: string
  noResults: string
}

const ui: Record<Locale, UiStrings> = {
  de: {
    categoryLabel: 'Art des Ausflugs',
    categories: {
      castles: 'Burgen & Klöster',
      towns: 'Städte & Kurorte',
      nature: 'Natur',
      lookouts: 'Aussichtspunkte',
      experiences: 'Erlebnisse',
    },
    difficultyLabel: 'Anspruch',
    difficulties: { easy: 'leicht', moderate: 'mittel', demanding: 'anspruchsvoll' },
    tagsLabel: 'Geeignet für',
    tags: {
      noCar: 'Ohne Auto',
      stroller: 'Mit Kinderwagen',
      dog: 'Mit Hund',
      indoor: 'Auch bei Regen',
      winter: 'Auch im Winter',
      food: 'Einkehr möglich',
    },
    all: 'Alle',
    viewList: 'Liste',
    viewMap: 'Karte',
    results: (n) => `${n} ${n === 1 ? 'Ziel' : 'Ziele'}`,
    reset: 'Filter zurücksetzen',
    drive: 'mit dem Auto',
    onFoot: 'zu Fuß von der Kolonnade',
    visit: 'vor Ort',
    hoursUnit: 'Std.',
    route: 'Route',
    mapLink: 'Mapy.com',
    website: 'Webseite',
    mapHint: 'Tippen Sie auf einen Punkt, um Details anzuzeigen. Die Ringe zeigen die Entfernung von Marienbad.',
    origin: 'Marienbad',
    noResults: 'Kein Ziel entspricht den gewählten Filtern.',
  },
  en: {
    categoryLabel: 'Type of trip',
    categories: {
      castles: 'Castles & monasteries',
      towns: 'Towns & spas',
      nature: 'Nature',
      lookouts: 'Lookouts',
      experiences: 'Experiences',
    },
    difficultyLabel: 'Effort',
    difficulties: { easy: 'easy', moderate: 'moderate', demanding: 'demanding' },
    tagsLabel: 'Good for',
    tags: {
      noCar: 'No car needed',
      stroller: 'Stroller-friendly',
      dog: 'Dog-friendly',
      indoor: 'Rainy-day option',
      winter: 'Good in winter',
      food: 'Food available',
    },
    all: 'All',
    viewList: 'List',
    viewMap: 'Map',
    results: (n) => `${n} ${n === 1 ? 'destination' : 'destinations'}`,
    reset: 'Reset filters',
    drive: 'by car',
    onFoot: 'on foot from the colonnade',
    visit: 'on site',
    hoursUnit: 'h',
    route: 'Route',
    mapLink: 'Mapy.com',
    website: 'Website',
    mapHint: 'Tap a dot to see details. Rings show the distance from Marienbad.',
    origin: 'Marienbad',
    noResults: 'No destination matches the selected filters.',
  },
  cs: {
    categoryLabel: 'Typ výletu',
    categories: {
      castles: 'Hrady & kláštery',
      towns: 'Města & lázně',
      nature: 'Příroda',
      lookouts: 'Rozhledy',
      experiences: 'Zážitky',
    },
    difficultyLabel: 'Náročnost',
    difficulties: { easy: 'lehká', moderate: 'střední', demanding: 'náročná' },
    tagsLabel: 'Vhodné pro',
    tags: {
      noCar: 'Bez auta',
      stroller: 'S kočárkem',
      dog: 'Se psem',
      indoor: 'I za deště',
      winter: 'I v zimě',
      food: 'Občerstvení',
    },
    all: 'Vše',
    viewList: 'Seznam',
    viewMap: 'Mapa',
    results: (n) => `${n} ${n === 1 ? 'cíl' : n >= 2 && n <= 4 ? 'cíle' : 'cílů'}`,
    reset: 'Zrušit filtry',
    drive: 'autem',
    onFoot: 'pěšky od kolonády',
    visit: 'na místě',
    hoursUnit: 'h',
    route: 'Trasa',
    mapLink: 'Mapy.com',
    website: 'Web',
    mapHint: 'Klepnutím na bod zobrazíte detail. Kruhy značí vzdálenost od Mariánských Lázní.',
    origin: 'Mariánské Lázně',
    noResults: 'Zvoleným filtrům neodpovídá žádný cíl.',
  },
  ru: {
    categoryLabel: 'Тип поездки',
    categories: {
      castles: 'Замки и монастыри',
      towns: 'Города и курорты',
      nature: 'Природа',
      lookouts: 'Смотровые площадки',
      experiences: 'Впечатления',
    },
    difficultyLabel: 'Сложность',
    difficulties: { easy: 'лёгкая', moderate: 'средняя', demanding: 'сложная' },
    tagsLabel: 'Подходит',
    tags: {
      noCar: 'Без машины',
      stroller: 'С коляской',
      dog: 'С собакой',
      indoor: 'И в дождь',
      winter: 'И зимой',
      food: 'Есть кафе',
    },
    all: 'Все',
    viewList: 'Список',
    viewMap: 'Карта',
    results: (n) => {
      const mod10 = n % 10
      const mod100 = n % 100
      const word =
        mod10 === 1 && mod100 !== 11
          ? 'направление'
          : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
            ? 'направления'
            : 'направлений'
      return `${n} ${word}`
    },
    reset: 'Сбросить фильтры',
    drive: 'на машине',
    onFoot: 'пешком от колоннады',
    visit: 'на месте',
    hoursUnit: 'ч',
    route: 'Маршрут',
    mapLink: 'Mapy.com',
    website: 'Сайт',
    mapHint: 'Нажмите на точку, чтобы увидеть детали. Кольца показывают расстояние от Марианских Лазней.',
    origin: 'Марианские Лазни',
    noResults: 'Ни одно направление не соответствует выбранным фильтрам.',
  },
}

const categoryDotColor: Record<TripCategory, string> = {
  castles: 'var(--color-indigo-600)',
  towns: 'var(--color-aubergine-500)',
  nature: 'var(--color-turquoise-700)',
  lookouts: 'var(--color-yellow-400)',
  experiences: 'var(--color-beige-600)',
}

const categoryBadgeClass: Record<TripCategory, string> = {
  castles: 'bg-indigo-50 text-indigo-800',
  towns: 'bg-aubergine-50 text-aubergine-700',
  nature: 'bg-turquoise-50 text-turquoise-900',
  lookouts: 'bg-yellow-50 text-yellow-700',
  experiences: 'bg-beige-100 text-beige-800',
}

const categoryIcon: Record<TripCategory, string> = {
  castles: 'M3 21h18M4 21V8l4-3v4h8V5l4 3v13M9 21v-4a3 3 0 016 0v4',
  towns: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  nature: 'M12 3v18m0-18L7 9h3l-4 6h4l-4 6h12l-4-6h4l-4-6h3l-5-6z',
  lookouts: 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  experiences: 'M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2 2-2 2M19 13l2 2-2 2M17 3l4 4M21 17l-4 4',
}

const KM_PER_DEG_LAT = 111.0
const KM_PER_DEG_LNG = 71.6 // 111.32 × cos(50°)

function project(trip: DayTrip): { x: number; y: number } {
  return {
    x: (trip.lng - TRIP_ORIGIN.lng) * KM_PER_DEG_LNG,
    y: (TRIP_ORIGIN.lat - trip.lat) * KM_PER_DEG_LAT,
  }
}

function formatHours(value: number, locale: Locale): string {
  const str = String(value)
  return locale === 'en' ? str : str.replace('.', ',')
}

function routeUrl(trip: DayTrip): string {
  return `https://www.google.com/maps/dir/?api=1&origin=Mari%C3%A1nsk%C3%A9%20L%C3%A1zn%C4%9B&destination=${trip.lat},${trip.lng}`
}

function mapyUrl(trip: DayTrip): string {
  return `https://mapy.com/turisticka?q=${encodeURIComponent(trip.name.cs)}`
}

function TripMeta({ trip, locale, t }: { trip: DayTrip; locale: Locale; t: UiStrings }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
      <span className="inline-flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-turquoise-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {trip.driveMin === 0 ? t.onFoot : `~${trip.driveMin} min ${t.drive}`}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-turquoise-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {formatHours(trip.visitHoursMin, locale)}–{formatHours(trip.visitHoursMax, locale)} {t.hoursUnit} {t.visit}
      </span>
      <span className="inline-flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              i <= tripDifficultyOrder.indexOf(trip.difficulty) ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          />
        ))}
        <span className="ml-0.5">{t.difficulties[trip.difficulty]}</span>
      </span>
    </div>
  )
}

function TripLinks({ trip, t }: { trip: DayTrip; t: UiStrings }) {
  const linkClass =
    'inline-flex items-center gap-1 text-turquoise-700 hover:text-turquoise-900 text-sm font-semibold transition-colors'
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      <a href={routeUrl(trip)} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {t.route}
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
      <a href={mapyUrl(trip)} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {t.mapLink}
      </a>
      {trip.website && (
        <a href={trip.website} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {t.website}
        </a>
      )}
    </div>
  )
}

export default function TripExplorer({ locale }: Props) {
  const t = ui[locale]
  const [category, setCategory] = useState<TripCategory | 'all'>('all')
  const [difficulty, setDifficulty] = useState<TripDifficulty | 'all'>('all')
  const [activeTags, setActiveTags] = useState<TripTag[]>([])
  const [view, setView] = useState<'list' | 'map'>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return dayTrips
      .filter((trip) => category === 'all' || trip.category === category)
      .filter((trip) => difficulty === 'all' || trip.difficulty === difficulty)
      .filter((trip) => activeTags.every((tag) => trip.tags.includes(tag)))
      .sort((a, b) => a.driveMin - b.driveMin || a.visitHoursMin - b.visitHoursMin)
  }, [category, difficulty, activeTags])

  const hasFilters = category !== 'all' || difficulty !== 'all' || activeTags.length > 0
  const selected = filtered.find((trip) => trip.id === selectedId) ?? null

  function toggleTag(tag: TripTag) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))
  }

  function resetFilters() {
    setCategory('all')
    setDifficulty('all')
    setActiveTags([])
  }

  const chipBase =
    'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer'
  const chipActive = 'bg-indigo-700 text-white shadow-md'
  const chipIdle = 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'

  return (
    <div>
      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t.categoryLabel}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('all')}
              aria-pressed={category === 'all'}
              className={`${chipBase} ${category === 'all' ? chipActive : chipIdle}`}
            >
              {t.all}
            </button>
            {tripCategoryOrder.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={`${chipBase} ${category === cat ? chipActive : chipIdle}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcon[cat]} />
                </svg>
                {t.categories[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t.difficultyLabel}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDifficulty('all')}
                aria-pressed={difficulty === 'all'}
                className={`${chipBase} ${difficulty === 'all' ? chipActive : chipIdle}`}
              >
                {t.all}
              </button>
              {tripDifficultyOrder.map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  aria-pressed={difficulty === level}
                  className={`${chipBase} ${difficulty === level ? chipActive : chipIdle}`}
                >
                  {t.difficulties[level]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t.tagsLabel}</p>
            <div className="flex flex-wrap gap-2">
              {tripTagOrder.map((tag) => {
                const active = activeTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    aria-pressed={active}
                    className={`${chipBase} ${active ? 'bg-turquoise-700 text-white shadow-md' : 'bg-white text-turquoise-800 border border-turquoise-200 hover:bg-turquoise-50'}`}
                  >
                    {active && (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {t.tags[tag]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results bar + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-t border-beige-200 pt-4">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="font-semibold text-indigo-800">{t.results(filtered.length)}</span>
          {hasFilters && (
            <button onClick={resetFilters} className="underline hover:text-indigo-700 transition-colors cursor-pointer">
              {t.reset}
            </button>
          )}
        </div>
        <div className="inline-flex rounded-full border border-indigo-200 overflow-hidden" role="group">
          {(['list', 'map'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setView(mode)}
              aria-pressed={view === mode}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                view === mode ? 'bg-indigo-700 text-white' : 'bg-white text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    mode === 'list'
                      ? 'M4 6h16M4 10h16M4 14h16M4 18h16'
                      : 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
                  }
                />
              </svg>
              {mode === 'list' ? t.viewList : t.viewMap}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <p className="text-center text-gray-500 py-12">{t.noResults}</p>}

      {/* List view */}
      {view === 'list' && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((trip) => (
            <article key={trip.id} className="bg-white rounded-xl shadow-card p-6 flex flex-col card-hover">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${categoryBadgeClass[trip.category]}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcon[trip.category]} />
                  </svg>
                  {t.categories[trip.category]}
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-indigo-900 mb-2">{trip.name[locale]}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{trip.description[locale]}</p>
              <div className="mb-3">
                <TripMeta trip={trip} locale={locale} t={t} />
              </div>
              {trip.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {trip.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-beige-50 text-beige-800 text-[11px] font-medium rounded-full border border-beige-200">
                      {t.tags[tag]}
                    </span>
                  ))}
                </div>
              )}
              <TripLinks trip={trip} t={t} />
            </article>
          ))}
        </div>
      )}

      {/* Map view — schematic distance map, no external tiles */}
      {view === 'map' && filtered.length > 0 && (
        <div>
          <div className="bg-white rounded-xl shadow-card p-4 md:p-6">
            <svg
              viewBox="-40 -36 80 74"
              role="img"
              aria-label={t.mapHint}
              className="w-full max-w-3xl mx-auto block"
            >
              {/* Distance rings */}
              {[10, 20, 30].map((r) => (
                <g key={r}>
                  <circle cx="0" cy="0" r={r} fill="none" stroke="var(--color-beige-200)" strokeWidth="0.3" strokeDasharray="1.2 1" />
                  <text x="0" y={-r - 1} textAnchor="middle" fontSize="2.2" fill="var(--color-beige-500)">
                    {r} km
                  </text>
                </g>
              ))}

              {/* Origin: Mariánské Lázně */}
              <g>
                <circle cx="0" cy="0" r="1.6" fill="var(--color-yellow-400)" stroke="white" strokeWidth="0.4" />
                <text x="0" y="3.6" textAnchor="middle" fontSize="2.4" fontWeight="700" fill="var(--color-indigo-800)">
                  {t.origin}
                </text>
              </g>

              {/* Destination dots */}
              {filtered.map((trip) => {
                const { x, y } = project(trip)
                const isSelected = trip.id === selectedId
                return (
                  <g
                    key={trip.id}
                    role="button"
                    tabIndex={0}
                    aria-label={trip.name[locale]}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(isSelected ? null : trip.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedId(isSelected ? null : trip.id)
                      }
                    }}
                    className="cursor-pointer focus:outline-none"
                  >
                    <title>{trip.name[locale]}</title>
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 2.4 : 1.7}
                      fill={categoryDotColor[trip.category]}
                      stroke={isSelected ? 'var(--color-indigo-900)' : 'white'}
                      strokeWidth={isSelected ? 0.5 : 0.35}
                    />
                    {isSelected && (
                      <text x={x} y={y - 3.2} textAnchor="middle" fontSize="2.4" fontWeight="700" fill="var(--color-indigo-900)">
                        {trip.name[locale]}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-4 text-xs text-gray-500">
              {tripCategoryOrder.map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: categoryDotColor[cat] }} />
                  {t.categories[cat]}
                </span>
              ))}
            </div>
            <p className="text-xs text-beige-500 text-center mt-2">{t.mapHint}</p>
          </div>

          {/* Selected destination detail */}
          {selected && (
            <div className="mt-4 bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${categoryBadgeClass[selected.category]}`}
                >
                  {t.categories[selected.category]}
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-indigo-900 mb-2">{selected.name[locale]}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{selected.description[locale]}</p>
              <div className="mb-3">
                <TripMeta trip={selected} locale={locale} t={t} />
              </div>
              <TripLinks trip={selected} t={t} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
