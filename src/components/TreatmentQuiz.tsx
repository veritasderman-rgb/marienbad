import { useState, useMemo } from 'react'
import { withUtm } from '@/utils/utm'

interface TreatmentQuizProps {
  locale: 'de' | 'en' | 'cs' | 'ru'
  hotels: Array<{
    slug: string
    name: string
    stars: number
    style: string
    bookingUrl: string
    tagline: string
    treatments: string[]
    features: string[]
  }>
  translations: {
    step1Title: string
    step2Title: string
    resultsTitle: string
    next: string
    back: string
    restart: string
    yourTreatments: string
    bookNow: string
    matchingTreatments: string
    budgetComfort: string
    budgetPremium: string
    budgetLuxury: string
    condMusculoskeletal: string
    condRespiratory: string
    condDigestive: string
    condCardiovascular: string
    condKidney: string
    condStress: string
    condSkin: string
    condRehab: string
    styleClassic: string
    styleModern: string
    styleMedical: string
    budgetLabel: string
    styleLabel: string
    noResults: string
    starsLabel: string
  }
}

type Condition =
  | 'musculoskeletal'
  | 'respiratory'
  | 'digestive'
  | 'cardiovascular'
  | 'kidney'
  | 'stress'
  | 'skin'
  | 'rehab'

type Budget = 'comfort' | 'premium' | 'luxury'
type Style = 'classic' | 'modern' | 'medical'

const CONDITION_TREATMENT_MAP: Record<Condition, string[]> = {
  musculoskeletal: [
    'massage', 'moorpackung', 'peat', 'peloid', 'physiother', 'underwater',
    'electro', 'magnet', 'unterwasser', 'rašelin', 'masáž', 'fyzioter',
    'массаж', 'торф', 'физиотер', 'подвод', 'paraffin', 'kryother', 'cryo',
    'ultraschall', 'ultrasound', 'движ', 'gymnastik', 'gymnast',
    'lymph', 'lymf', 'лимф', 'gasinjektion', 'gas inject', 'plynové injekce',
    'pneumopunktur', 'пневмопунктур',
  ],
  respiratory: [
    'inhalat', 'klima', 'climate', 'co2', 'kohlensäure', 'carbon dioxide',
    'sauerstoff', 'oxygen', 'pneumo', 'ингаляц', 'кислород',
    'salz', 'salt', 'soln', 'halo', 'солян',
  ],
  digestive: [
    'trink', 'drinking', 'mineral', 'pitná', 'питьев', 'минерал',
    'diät', 'diet', 'kúra', 'курс',
  ],
  cardiovascular: [
    'co2', 'kohlensäure', 'carbon dioxide', 'mineral', 'electro',
    'magnet', 'elektro', 'минерал', 'магнит', 'trocken', 'dry',
    'suchá', 'сухая', 'gasinjektion', 'gas inject', 'plynové injekce',
    'pneumopunktur', 'пневмопунктур',
  ],
  kidney: [
    'trink', 'drinking', 'mineral', 'pitná', 'питьев', 'минерал',
  ],
  stress: [
    'massage', 'aroma', 'hot stone', 'wellness', 'sauna', 'pool',
    'roman', 'römisch', 'masáž', 'массаж', 'релакс', 'relaxa',
    'lymph', 'lymf', 'лимф', 'salz', 'salt', 'soln', 'halo', 'солян',
  ],
  skin: [
    'moorpackung', 'peat', 'peloid', 'paraffin', 'mineral',
    'rašelin', 'торф', 'минерал', 'co2', 'gasinjektion', 'gas inject',
  ],
  rehab: [
    'physiother', 'aqua', 'gymnastik', 'gymnast', 'bewegung', 'exercise',
    'walking', 'geh', 'underwater', 'unterwasser', 'fyzioter', 'физиотер',
    'подвод', 'ходьб', 'nácvik', 'lymph', 'lymf', 'лимф',
  ],
}

/* ─── SVG Icons ─── */
const iconProps = { width: 28, height: 28, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, viewBox: '0 0 24 24' }

function IconMusculoskeletal() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 2v6m0 8v6M8 8a4 4 0 0 1 8 0M8 16a4 4 0 0 0 8 0" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function IconRespiratory() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M6.5 12C4 12 2 14 2 16.5S4 21 6.5 21c1.5 0 3.5-1 5.5-3" />
      <path d="M17.5 12c2.5 0 4.5 2 4.5 4.5S20 21 17.5 21c-1.5 0-3.5-1-5.5-3" />
      <path d="M12 3v15" />
      <path d="M8 6.5C9.5 5 10.5 3 12 3c1.5 0 2.5 2 4 3.5" />
    </svg>
  )
}

function IconDigestive() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 2c-1 0-3 1-3 4v3c0 2 1.5 3 3 3s3-1 3-3V6c0-3-2-4-3-4Z" />
      <path d="M9 12v2c0 3 1 5 1 7a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1c0-2 1-4 1-7v-2" />
    </svg>
  )
}

function IconCardiovascular() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 0 1 12 6.006a5 5 0 0 1 7.5 6.566Z" />
      <path d="M7 12h3l1-2 2 4 1-2h3" strokeWidth={1.8} />
    </svg>
  )
}

function IconKidney() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 6V2m0 0L9 4m3-2 3 2" />
      <path d="M7 8a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2l-1 1v4a2 2 0 0 1-2 2h-1v3h-2v-3H10a2 2 0 0 1-2-2v-4L7 10V8Z" />
    </svg>
  )
}

function IconStress() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <circle cx="12" cy="7" r="3" />
      <path d="M12 14c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4Z" />
      <path d="M8 3.5C6 2 4 3 4 5s2.5 3 4 2" />
      <path d="M16 3.5c2-1.5 4-.5 4 1.5s-2.5 3-4 2" />
    </svg>
  )
}

function IconSkin() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
      <path d="M8 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
      <path d="M8.5 14c1 1.5 2.5 2 3.5 2s2.5-.5 3.5-2" />
    </svg>
  )
}

function IconRehab() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 8v4m0 0-3 5m3-5 3 5" />
      <path d="M7 12h10" />
      <path d="M5 19h4m6 0h4" />
    </svg>
  )
}

function IconStar({ filled }: { filled: boolean }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={1.5}
    >
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5L20 7" />
    </svg>
  )
}

const CONDITION_ICONS: Record<Condition, () => JSX.Element> = {
  musculoskeletal: IconMusculoskeletal,
  respiratory: IconRespiratory,
  digestive: IconDigestive,
  cardiovascular: IconCardiovascular,
  kidney: IconKidney,
  stress: IconStress,
  skin: IconSkin,
  rehab: IconRehab,
}

function matchesTreatments(treatment: string, keywords: string[]): boolean {
  const lower = treatment.toLowerCase()
  return keywords.some((kw) => lower.includes(kw))
}

function getMatchingTreatments(
  treatments: string[],
  conditions: Condition[]
): string[] {
  const allKeywords = conditions.flatMap((c) => CONDITION_TREATMENT_MAP[c])
  return treatments.filter((t) => matchesTreatments(t, allKeywords))
}

function starsForBudget(budget: Budget): number {
  switch (budget) {
    case 'comfort':
      return 3
    case 'premium':
      return 4
    case 'luxury':
      return 5
  }
}

export default function TreatmentQuiz({
  locale,
  hotels,
  translations: tr,
}: TreatmentQuizProps) {
  const [step, setStep] = useState(1)
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([])
  const [budget, setBudget] = useState<Budget | null>(null)
  const [style, setStyle] = useState<Style | null>(null)

  const conditions: { key: Condition; label: string }[] = [
    { key: 'musculoskeletal', label: tr.condMusculoskeletal },
    { key: 'respiratory', label: tr.condRespiratory },
    { key: 'digestive', label: tr.condDigestive },
    { key: 'cardiovascular', label: tr.condCardiovascular },
    { key: 'kidney', label: tr.condKidney },
    { key: 'stress', label: tr.condStress },
    { key: 'skin', label: tr.condSkin },
    { key: 'rehab', label: tr.condRehab },
  ]

  const budgetOptions: { key: Budget; label: string }[] = [
    { key: 'comfort', label: tr.budgetComfort },
    { key: 'premium', label: tr.budgetPremium },
    { key: 'luxury', label: tr.budgetLuxury },
  ]

  const styleOptions: { key: Style; label: string }[] = [
    { key: 'classic', label: tr.styleClassic },
    { key: 'modern', label: tr.styleModern },
    { key: 'medical', label: tr.styleMedical },
  ]

  const toggleCondition = (key: Condition) => {
    setSelectedConditions((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    )
  }

  const results = useMemo(() => {
    if (step < 3) return []

    const targetStars = budget ? starsForBudget(budget) : 4

    return hotels
      .map((hotel) => {
        const matching = getMatchingTreatments(
          hotel.treatments,
          selectedConditions
        )
        const score = matching.length * 10

        return { hotel, matching, score }
      })
      .filter((r) => {
        if (r.matching.length === 0) return false
        // Strict star-rating filter: only show hotels matching the selected tier
        // Exception: Luxury (5★) always includes Centrální Lázně (4★)
        if (r.hotel.stars === targetStars) return true
        if (targetStars === 5 && r.hotel.slug === 'centralni-lazne') return true
        return false
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [step, hotels, selectedConditions, budget])

  const recommendedTreatments = useMemo(() => {
    if (step < 3 || selectedConditions.length === 0) return []
    const allKeywords = selectedConditions.flatMap(
      (c) => CONDITION_TREATMENT_MAP[c]
    )
    const allTreatments = hotels.flatMap((h) => h.treatments)
    const unique = [...new Set(allTreatments)]
    return unique.filter((t) => matchesTreatments(t, allKeywords))
  }, [step, hotels, selectedConditions])

  const canProceedStep1 = selectedConditions.length > 0
  const canProceedStep2 = budget !== null

  const handleRestart = () => {
    setStep(1)
    setSelectedConditions([])
    setBudget(null)
    setStyle(null)
  }

  const starDisplay = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < count ? 'text-yellow-400' : 'text-beige-300'}>
        <IconStar filled={i < count} />
      </span>
    ))
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-beige-50 to-turquoise-50 rounded-2xl mt-12 mb-8 shadow-sm border border-beige-200/60">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%"><defs><pattern id="quizGrid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0v32" fill="none" stroke="currentColor" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#quizGrid)" className="text-indigo-900"/></svg>
      </div>

      <div className="relative p-6 md:p-10">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  s === step
                    ? 'bg-turquoise-500 text-white shadow-lg shadow-turquoise-500/30 ring-4 ring-turquoise-200'
                    : s < step
                      ? 'bg-indigo-700 text-white'
                      : 'bg-white text-indigo-300 border-2 border-beige-300'
                }`}
              >
                {s < step ? <IconCheck /> : s}
              </div>
              {s < 3 && (
                <div className="w-16 md:w-24 h-0.5 mx-1">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      s < step ? 'bg-indigo-700' : 'bg-beige-300'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Conditions */}
        {step === 1 && (
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-indigo-700 text-center mb-2">
              {tr.step1Title}
            </h3>
            <div className="w-12 h-1 bg-turquoise-400 rounded-full mx-auto mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
              {conditions.map(({ key, label }) => {
                const Icon = CONDITION_ICONS[key]
                const isActive = selectedConditions.includes(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggleCondition(key)}
                    className={`group relative text-center flex flex-col items-center gap-2.5 py-5 px-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 ${
                      isActive
                        ? 'bg-indigo-700 text-white border-indigo-700 shadow-lg shadow-indigo-700/20'
                        : 'bg-white text-indigo-600 border-beige-200 hover:border-turquoise-300 hover:shadow-md'
                    }`}
                  >
                    <span className={`transition-colors duration-200 ${isActive ? 'text-turquoise-300' : 'text-turquoise-500 group-hover:text-turquoise-600'}`}>
                      <Icon />
                    </span>
                    <span className="leading-tight">{label}</span>
                    {isActive && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-turquoise-400 rounded-full flex items-center justify-center">
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="text-center">
              <button
                onClick={() => canProceedStep1 && setStep(2)}
                disabled={!canProceedStep1}
                className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                  canProceedStep1
                    ? 'bg-yellow-400 text-indigo-800 hover:bg-yellow-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-beige-200 text-indigo-300 cursor-not-allowed'
                }`}
              >
                {tr.next}
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-indigo-700 text-center mb-2">
              {tr.step2Title}
            </h3>
            <div className="w-12 h-1 bg-turquoise-400 rounded-full mx-auto mb-8" />

            {/* Budget */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">
                {tr.budgetLabel}
              </p>
              <div className="flex flex-wrap gap-3">
                {budgetOptions.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setBudget(key)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 ${
                      budget === key
                        ? 'bg-indigo-700 text-white border-indigo-700 shadow-md'
                        : 'bg-white text-indigo-600 border-beige-200 hover:border-turquoise-300 hover:shadow-sm'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="mb-10">
              <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">
                {tr.styleLabel}
              </p>
              <div className="flex flex-wrap gap-3">
                {styleOptions.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setStyle(key)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:ring-offset-2 ${
                      style === key
                        ? 'bg-indigo-700 text-white border-indigo-700 shadow-md'
                        : 'bg-white text-indigo-600 border-beige-200 hover:border-turquoise-300 hover:shadow-sm'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-indigo-600 border-2 border-indigo-200 hover:border-indigo-400 transition-all hover:bg-white/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m6 6-6-6 6-6"/></svg>
                {tr.back}
              </button>
              <button
                onClick={() => canProceedStep2 && setStep(3)}
                disabled={!canProceedStep2}
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                  canProceedStep2
                    ? 'bg-yellow-400 text-indigo-800 hover:bg-yellow-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-beige-200 text-indigo-300 cursor-not-allowed'
                }`}
              >
                {tr.next}
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-indigo-700 text-center mb-2">
              {tr.resultsTitle}
            </h3>
            <div className="w-12 h-1 bg-turquoise-400 rounded-full mx-auto mb-8" />

            {results.length > 0 ? (
              <div className="space-y-5 mb-10">
                {results.map(({ hotel, matching }, idx) => (
                  <div
                    key={hotel.slug}
                    className={`bg-white rounded-xl p-6 border transition-shadow hover:shadow-md ${
                      idx === 0 ? 'border-turquoise-300 shadow-sm ring-1 ring-turquoise-100' : 'border-beige-200 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-heading text-xl font-bold text-indigo-700">
                            {hotel.name}
                          </h4>
                          {idx === 0 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-turquoise-50 text-turquoise-700 text-xs font-semibold rounded-full border border-turquoise-200">
                              <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/></svg>
                              #1
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="flex items-center gap-0.5">{starDisplay(hotel.stars)}</span>
                          <span className="text-indigo-400 text-xs ml-1">
                            {hotel.stars} {tr.starsLabel}
                          </span>
                        </div>
                        <p className="text-indigo-500 text-sm mt-2 italic">
                          {hotel.tagline}
                        </p>
                      </div>
                      <a
                        href={withUtm(hotel.bookingUrl, 'marienbad', 'quiz', 'treatment-finder')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-indigo-800 font-semibold rounded-full hover:bg-yellow-300 transition-all hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap no-underline text-sm"
                      >
                        {tr.bookNow}
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
                      </a>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-turquoise-600 uppercase tracking-wide mb-2">
                        {tr.matchingTreatments}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {matching.map((t, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-turquoise-50 text-turquoise-700 text-xs rounded-full border border-turquoise-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-beige-400 mb-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <p className="text-indigo-500">{tr.noResults}</p>
              </div>
            )}

            {/* Recommended treatments */}
            {recommendedTreatments.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-beige-200 mb-8 shadow-sm">
                <h4 className="font-heading text-lg font-bold text-indigo-700 mb-4 flex items-center gap-2">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="text-turquoise-500"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                  {tr.yourTreatments}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recommendedTreatments.slice(0, 15).map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-beige-100 text-indigo-600 text-sm rounded-full border border-beige-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-indigo-600 border-2 border-indigo-200 hover:border-indigo-400 transition-all hover:bg-white/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m6 6-6-6 6-6"/></svg>
                {tr.back}
              </button>
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-indigo-700 text-white hover:bg-indigo-600 transition-all shadow-sm hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
                {tr.restart}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
