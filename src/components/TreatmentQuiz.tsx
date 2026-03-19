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
  ],
  respiratory: [
    'inhalat', 'klima', 'climate', 'co2', 'kohlensäure', 'carbon dioxide',
    'sauerstoff', 'oxygen', 'pneumo', 'ингаляц', 'кислород',
  ],
  digestive: [
    'trink', 'drinking', 'mineral', 'pitná', 'питьев', 'минерал',
    'diät', 'diet', 'kúra', 'курс',
  ],
  cardiovascular: [
    'co2', 'kohlensäure', 'carbon dioxide', 'mineral', 'electro',
    'magnet', 'elektro', 'минерал', 'магнит',
  ],
  kidney: [
    'trink', 'drinking', 'mineral', 'pitná', 'питьев', 'минерал',
  ],
  stress: [
    'massage', 'aroma', 'hot stone', 'wellness', 'sauna', 'pool',
    'roman', 'römisch', 'masáž', 'массаж', 'релакс', 'relaxa',
  ],
  skin: [
    'moorpackung', 'peat', 'peloid', 'paraffin', 'mineral',
    'rašelin', 'торф', 'минерал',
  ],
  rehab: [
    'physiother', 'aqua', 'gymnastik', 'gymnast', 'bewegung', 'exercise',
    'walking', 'geh', 'underwater', 'unterwasser', 'fyzioter', 'физиотер',
    'подвод', 'ходьб', 'nácvik',
  ],
}

const CONDITION_ICONS: Record<Condition, string> = {
  musculoskeletal: '\u{1F9B4}',
  respiratory: '\u{1FAC1}',
  digestive: '\u{1F34E}',
  cardiovascular: '\u{2764}\u{FE0F}',
  kidney: '\u{1F4A7}',
  stress: '\u{1F9D8}',
  skin: '\u{2728}',
  rehab: '\u{1F3CB}\u{FE0F}',
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
        const starDiff = Math.abs(hotel.stars - targetStars)
        const score = matching.length * 10 - starDiff * 5

        return { hotel, matching, score }
      })
      .filter((r) => r.matching.length > 0)
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
    return Array.from({ length: count }, () => '\u2605').join('')
  }

  const btnBase =
    'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-2'
  const btnActive = 'bg-indigo-700 text-white border-indigo-700 shadow-md'
  const btnInactive =
    'bg-white text-indigo-700 border-beige-300 hover:border-indigo-400 hover:bg-beige-50'

  return (
    <div className="bg-beige-50 rounded-2xl p-6 md:p-10 mt-12 mb-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                s === step
                  ? 'bg-turquoise-400 text-white'
                  : s < step
                    ? 'bg-indigo-700 text-white'
                    : 'bg-beige-200 text-indigo-400'
              }`}
            >
              {s < step ? '\u2713' : s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-0.5 transition-colors duration-300 ${
                  s < step ? 'bg-indigo-700' : 'bg-beige-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Conditions */}
      {step === 1 && (
        <div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-indigo-700 text-center mb-6">
            {tr.step1Title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {conditions.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleCondition(key)}
                className={`${btnBase} text-center flex flex-col items-center gap-1.5 py-4 ${
                  selectedConditions.includes(key) ? btnActive : btnInactive
                }`}
              >
                <span className="text-xl" role="img" aria-hidden="true">
                  {CONDITION_ICONS[key]}
                </span>
                <span className="leading-tight">{label}</span>
              </button>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => canProceedStep1 && setStep(2)}
              disabled={!canProceedStep1}
              className={`px-8 py-3 rounded-full font-semibold text-base transition-all duration-200 ${
                canProceedStep1
                  ? 'bg-yellow-400 text-indigo-800 hover:bg-yellow-300 shadow-md hover:shadow-lg cursor-pointer'
                  : 'bg-beige-200 text-indigo-300 cursor-not-allowed'
              }`}
            >
              {tr.next} &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Preferences */}
      {step === 2 && (
        <div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-indigo-700 text-center mb-8">
            {tr.step2Title}
          </h3>

          {/* Budget */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-indigo-600 mb-3">
              {tr.budgetLabel}
            </p>
            <div className="flex flex-wrap gap-3">
              {budgetOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setBudget(key)}
                  className={`${btnBase} ${budget === key ? btnActive : btnInactive}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-indigo-600 mb-3">
              {tr.styleLabel}
            </p>
            <div className="flex flex-wrap gap-3">
              {styleOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStyle(key)}
                  className={`${btnBase} ${style === key ? btnActive : btnInactive}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-full font-semibold text-sm text-indigo-600 border-2 border-indigo-200 hover:border-indigo-400 transition-colors"
            >
              &larr; {tr.back}
            </button>
            <button
              onClick={() => canProceedStep2 && setStep(3)}
              disabled={!canProceedStep2}
              className={`px-8 py-3 rounded-full font-semibold text-base transition-all duration-200 ${
                canProceedStep2
                  ? 'bg-yellow-400 text-indigo-800 hover:bg-yellow-300 shadow-md hover:shadow-lg cursor-pointer'
                  : 'bg-beige-200 text-indigo-300 cursor-not-allowed'
              }`}
            >
              {tr.next} &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-indigo-700 text-center mb-8">
            {tr.resultsTitle}
          </h3>

          {results.length > 0 ? (
            <div className="space-y-6 mb-10">
              {results.map(({ hotel, matching }) => (
                <div
                  key={hotel.slug}
                  className="bg-white rounded-xl p-6 shadow-sm border border-beige-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-heading text-xl font-bold text-indigo-700">
                        {hotel.name}
                      </h4>
                      <p className="text-yellow-500 text-sm mt-1">
                        {starDisplay(hotel.stars)}{' '}
                        <span className="text-indigo-400 ml-1">
                          {hotel.stars} {tr.starsLabel}
                        </span>
                      </p>
                      <p className="text-indigo-500 text-sm mt-1 italic">
                        {hotel.tagline}
                      </p>
                    </div>
                    <a
                      href={withUtm(hotel.bookingUrl, 'marienbad', 'quiz', 'treatment-finder')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-indigo-800 font-semibold rounded-full hover:bg-yellow-300 transition-colors shadow-sm whitespace-nowrap no-underline text-sm"
                    >
                      {tr.bookNow} &rarr;
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
            <p className="text-indigo-500 text-center py-8">{tr.noResults}</p>
          )}

          {/* Recommended treatments */}
          {recommendedTreatments.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-beige-200 mb-8">
              <h4 className="font-heading text-lg font-bold text-indigo-700 mb-4">
                {tr.yourTreatments}
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendedTreatments.slice(0, 15).map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-beige-100 text-indigo-600 text-sm rounded-full"
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
              className="px-6 py-3 rounded-full font-semibold text-sm text-indigo-600 border-2 border-indigo-200 hover:border-indigo-400 transition-colors"
            >
              &larr; {tr.back}
            </button>
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-full font-semibold text-sm bg-indigo-700 text-white hover:bg-indigo-600 transition-colors"
            >
              {tr.restart}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
