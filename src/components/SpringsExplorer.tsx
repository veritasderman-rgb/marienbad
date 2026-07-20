import { useMemo, useState } from 'react'
import {
  springs,
  springIndicationOrder,
  springLocationOrder,
  type SpringIndication,
  type SpringLocation,
} from '@/data/springs'

type Locale = 'de' | 'en' | 'cs' | 'ru'

interface Props {
  locale: Locale
}

interface UiStrings {
  indicationLabel: string
  indications: Record<SpringIndication, string>
  locationLabel: string
  locations: Record<SpringLocation, string>
  all: string
  results: (n: number) => string
  reset: string
  gasBadge: string
  noResults: string
  disclaimer: string
}

const ui: Record<Locale, UiStrings> = {
  de: {
    indicationLabel: 'Wobei soll die Quelle helfen?',
    indications: {
      digestion: 'Verdauung',
      metabolism: 'Stoffwechsel',
      kidneys: 'Nieren & Harnwege',
      respiratory: 'Atemwege',
      blood: 'Blutbildung',
      bones: 'Knochen',
      heart: 'Herz & Kreislauf',
    },
    locationLabel: 'Wo entspringt sie?',
    locations: { colonnade: 'An der Kolonnade', town: 'Parks & Stadt', forest: 'Waldquellen' },
    all: 'Alle',
    results: (n) => `${n} ${n === 1 ? 'Quelle' : 'Quellen'}`,
    reset: 'Filter zurücksetzen',
    gasBadge: 'CO₂-Gas — nicht trinken',
    noResults: 'Keine Quelle entspricht den gewählten Filtern.',
    disclaimer:
      'Die Angaben ersetzen keine ärztliche Beratung — die passende Trinkkur stimmen Sie bitte mit Ihrem Kurarzt ab.',
  },
  en: {
    indicationLabel: 'What should the spring help with?',
    indications: {
      digestion: 'Digestion',
      metabolism: 'Metabolism',
      kidneys: 'Kidneys & urinary tract',
      respiratory: 'Respiratory tract',
      blood: 'Blood formation',
      bones: 'Bones',
      heart: 'Heart & circulation',
    },
    locationLabel: 'Where does it rise?',
    locations: { colonnade: 'By the colonnade', town: 'Parks & town', forest: 'Forest springs' },
    all: 'All',
    results: (n) => `${n} ${n === 1 ? 'spring' : 'springs'}`,
    reset: 'Reset filters',
    gasBadge: 'CO₂ gas — not for drinking',
    noResults: 'No spring matches the selected filters.',
    disclaimer:
      'This information is no substitute for medical advice — agree your drinking cure with your spa physician.',
  },
  cs: {
    indicationLabel: 'S čím má pramen pomoci?',
    indications: {
      digestion: 'Trávení',
      metabolism: 'Metabolismus',
      kidneys: 'Ledviny a močové cesty',
      respiratory: 'Dýchací cesty',
      blood: 'Krvetvorba',
      bones: 'Kosti',
      heart: 'Srdce a cévy',
    },
    locationLabel: 'Kde vyvěrá?',
    locations: { colonnade: 'U kolonády', town: 'Parky a město', forest: 'Lesní vývěry' },
    all: 'Vše',
    results: (n) => `${n} ${n === 1 ? 'pramen' : n >= 2 && n <= 4 ? 'prameny' : 'pramenů'}`,
    reset: 'Zrušit filtry',
    gasBadge: 'Plyn CO₂ — nepije se',
    noResults: 'Zvoleným filtrům neodpovídá žádný pramen.',
    disclaimer:
      'Informace nenahrazují lékařskou radu — vhodnou pitnou kúru vždy konzultujte s lázeňským lékařem.',
  },
  ru: {
    indicationLabel: 'При чём должен помочь источник?',
    indications: {
      digestion: 'Пищеварение',
      metabolism: 'Обмен веществ',
      kidneys: 'Почки и мочевые пути',
      respiratory: 'Дыхательные пути',
      blood: 'Кроветворение',
      bones: 'Кости',
      heart: 'Сердце и сосуды',
    },
    locationLabel: 'Где он бьёт?',
    locations: { colonnade: 'У колоннады', town: 'Парки и город', forest: 'Лесные источники' },
    all: 'Все',
    results: (n) => {
      const m10 = n % 10
      const m100 = n % 100
      const word =
        m10 === 1 && m100 !== 11
          ? 'источник'
          : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)
            ? 'источника'
            : 'источников'
      return `${n} ${word}`
    },
    reset: 'Сбросить фильтры',
    gasBadge: 'Газ CO₂ — не для питья',
    noResults: 'Ни один источник не соответствует выбранным фильтрам.',
    disclaimer:
      'Эта информация не заменяет консультацию врача — питьевой курс согласуйте с курортным доктором.',
  },
}

const locationBadgeClass: Record<SpringLocation, string> = {
  colonnade: 'bg-indigo-50 text-indigo-800',
  town: 'bg-turquoise-50 text-turquoise-900',
  forest: 'bg-beige-100 text-beige-800',
}

export default function SpringsExplorer({ locale }: Props) {
  const t = ui[locale]
  const [indication, setIndication] = useState<SpringIndication | 'all'>('all')
  const [location, setLocation] = useState<SpringLocation | 'all'>('all')

  const filtered = useMemo(
    () =>
      springs
        .filter((spring) => indication === 'all' || spring.indications.includes(indication))
        .filter((spring) => location === 'all' || spring.location === location),
    [indication, location]
  )

  const hasFilters = indication !== 'all' || location !== 'all'

  const chipBase =
    'inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer'
  const chipActive = 'bg-indigo-700 text-white shadow-md'
  const chipIdle = 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'

  return (
    <div>
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t.indicationLabel}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIndication('all')}
              aria-pressed={indication === 'all'}
              className={`${chipBase} ${indication === 'all' ? chipActive : chipIdle}`}
            >
              {t.all}
            </button>
            {springIndicationOrder.map((key) => (
              <button
                key={key}
                onClick={() => setIndication(key)}
                aria-pressed={indication === key}
                className={`${chipBase} ${indication === key ? chipActive : chipIdle}`}
              >
                {t.indications[key]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{t.locationLabel}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLocation('all')}
              aria-pressed={location === 'all'}
              className={`${chipBase} ${location === 'all' ? chipActive : chipIdle}`}
            >
              {t.all}
            </button>
            {springLocationOrder.map((key) => (
              <button
                key={key}
                onClick={() => setLocation(key)}
                aria-pressed={location === key}
                className={`${chipBase} ${location === key ? chipActive : chipIdle}`}
              >
                {t.locations[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-500 border-t border-beige-200 pt-4 mb-6">
        <span className="font-semibold text-indigo-800">{t.results(filtered.length)}</span>
        {hasFilters && (
          <button
            onClick={() => {
              setIndication('all')
              setLocation('all')
            }}
            className="underline hover:text-indigo-700 transition-colors cursor-pointer"
          >
            {t.reset}
          </button>
        )}
      </div>

      {filtered.length === 0 && <p className="text-center text-gray-500 py-10">{t.noResults}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((spring) => (
          <article key={spring.id} className="bg-white rounded-xl shadow-card p-6 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${locationBadgeClass[spring.location]}`}
              >
                {t.locations[spring.location]}
              </span>
              {spring.type === 'gas' && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                  {t.gasBadge}
                </span>
              )}
            </div>
            <h3 className="font-heading font-bold text-lg text-indigo-900 mb-1">{spring.name[locale]}</h3>
            <p className="text-sm font-medium text-turquoise-800 mb-3">{spring.character[locale]}</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{spring.description[locale]}</p>
            <div className="flex flex-wrap gap-1.5">
              {spring.indications.map((key) => (
                <span
                  key={key}
                  className="px-2 py-0.5 bg-beige-50 text-beige-800 text-[11px] font-medium rounded-full border border-beige-200"
                >
                  {t.indications[key]}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs text-beige-600 mt-8">{t.disclaimer}</p>
    </div>
  )
}
