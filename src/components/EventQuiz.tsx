import { useEffect, useMemo, useRef, useState } from 'react'

export interface EventQuizOption {
  id: string
  text: string
  correct?: boolean
}

export interface EventQuizQuestion {
  id: string
  type: 'single' | 'open'
  text: string
  options?: EventQuizOption[]
  explanation?: string
  placeholder?: string
  maxLength?: number
}

export interface EventQuizResultBand {
  minPercent: number
  title: string
  message: string
}

interface EventQuizProps {
  locale: 'de' | 'en' | 'cs' | 'ru'
  /** Canonical quiz id, identical across locales (sent to the API as source) */
  quizId: string
  intro: { badge: string; text: string; prize: string; drawNote: string; startLabel: string }
  questions: EventQuizQuestion[]
  results: EventQuizResultBand[]
  emailGate: { heading: string; text: string; consentLabel: string; successTitle: string; successText: string }
  privacyPath: string
  /** Optional link to the competition terms page */
  termsPath?: string
  translations: {
    progress: string
    confirm: string
    next: string
    back: string
    correct: string
    incorrect: string
    correctAnswerWas: string
    showResult: string
    scoreLabel: string
    firstName: string
    lastName: string
    email: string
    submit: string
    sending: string
    privacy: string
    errorRequired: string
    errorGeneric: string
    restart: string
    termsLink: string
  }
}

type Step = { screen: 'intro' } | { screen: 'question'; index: number } | { screen: 'result' }

interface StoredState {
  step: Step
  answers: Record<string, string>
  /** Original quiz start time — must survive reloads so the server-side
   *  timing check doesn't mistake a restored session for a bot */
  startedAt?: number
  /** Shuffled option display order per question — kept stable across reloads */
  optionOrder?: Record<string, string[]>
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Draw a random option order for every question. Pure chance puts the correct
 *  answer on top in ~25% of questions, which players read as "the first answer
 *  is always right" — so cap correct-on-top at two questions in a row. */
function drawOptionOrders(questions: EventQuizQuestion[]): Record<string, string[]> {
  const order: Record<string, string[]> = {}
  let correctFirstStreak = 0
  for (const q of questions) {
    if (!q.options?.length) continue
    const ids = shuffle(q.options.map((o) => o.id))
    const correctId = q.options.find((o) => o.correct)?.id
    if (correctId) {
      if (ids[0] === correctId && correctFirstStreak >= 2 && ids.length > 1) {
        const j = 1 + Math.floor(Math.random() * (ids.length - 1))
        ;[ids[0], ids[j]] = [ids[j], ids[0]]
      }
      correctFirstStreak = ids[0] === correctId ? correctFirstStreak + 1 : 0
    }
    order[q.id] = ids
  }
  return order
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function EventQuiz({
  locale,
  quizId,
  intro,
  questions,
  results,
  emailGate,
  privacyPath,
  termsPath,
  translations: t,
}: EventQuizProps) {
  const storageKey = `event-quiz-${quizId}-${locale}`

  const [step, setStep] = useState<Step>({ screen: 'intro' })
  const [answers, setAnswers] = useState<Record<string, string>>({})
  // Random display order of options, drawn once per visitor. Only the intro
  // screen is server-rendered, so the client-side draw can't cause a
  // hydration mismatch.
  const [optionOrder, setOptionOrder] = useState<Record<string, string[]>>(() => drawOptionOrders(questions))
  /** Selected option before confirming (single questions) */
  const [selected, setSelected] = useState<string | null>(null)
  /** Whether the current single question has been confirmed (feedback visible) */
  const [confirmed, setConfirmed] = useState(false)
  const [openText, setOpenText] = useState('')

  // Email form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')
  const mountTs = useRef<number>(0)

  // Restore progress after reload (sessionStorage is unavailable during SSR)
  useEffect(() => {
    mountTs.current = Date.now()
    try {
      const raw = sessionStorage.getItem(storageKey)
      if (!raw) return
      const stored = JSON.parse(raw) as StoredState
      if (stored && stored.step && stored.answers) {
        if (typeof stored.startedAt === 'number' && stored.startedAt <= Date.now()) {
          mountTs.current = stored.startedAt
        }
        if (stored.optionOrder) setOptionOrder((prev) => ({ ...prev, ...stored.optionOrder }))
        setAnswers(stored.answers)
        setStep(stored.step)
        if (stored.step.screen === 'question') {
          const q = questions[stored.step.index]
          if (q?.type === 'open') setOpenText(stored.answers[q.id] ?? '')
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function persist(nextStep: Step, nextAnswers: Record<string, string>) {
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ step: nextStep, answers: nextAnswers, startedAt: mountTs.current, optionOrder }),
      )
    } catch {}
  }

  const scoredQuestions = useMemo(() => questions.filter((q) => q.type === 'single'), [questions])

  const score = useMemo(() => {
    let s = 0
    for (const q of scoredQuestions) {
      const correctOption = q.options?.find((o) => o.correct)
      if (correctOption && answers[q.id] === correctOption.id) s++
    }
    return s
  }, [answers, scoredQuestions])

  const resultBand = useMemo(() => {
    const percent = scoredQuestions.length > 0 ? (score / scoredQuestions.length) * 100 : 100
    const sorted = [...results].sort((a, b) => b.minPercent - a.minPercent)
    return sorted.find((b) => percent >= b.minPercent) ?? sorted[sorted.length - 1]
  }, [score, scoredQuestions, results])

  function interpolate(template: string, values: Record<string, string | number>) {
    return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''))
  }

  function goToQuestion(index: number, nextAnswers: Record<string, string> = answers) {
    if (index >= questions.length) {
      const nextStep: Step = { screen: 'result' }
      setStep(nextStep)
      persist(nextStep, nextAnswers)
      return
    }
    const q = questions[index]
    const prevAnswer = nextAnswers[q.id]
    setSelected(q.type === 'single' ? (prevAnswer ?? null) : null)
    setConfirmed(q.type === 'single' && prevAnswer !== undefined)
    setOpenText(q.type === 'open' ? (prevAnswer ?? '') : '')
    const nextStep: Step = { screen: 'question', index }
    setStep(nextStep)
    persist(nextStep, nextAnswers)
  }

  function confirmSingle(q: EventQuizQuestion) {
    if (!selected) return
    const nextAnswers = { ...answers, [q.id]: selected }
    setAnswers(nextAnswers)
    setConfirmed(true)
    persist(step, nextAnswers)
  }

  function nextFromOpen(q: EventQuizQuestion, index: number) {
    const trimmed = openText.trim().slice(0, q.maxLength ?? 500)
    const nextAnswers = { ...answers }
    if (trimmed) nextAnswers[q.id] = trimmed
    else delete nextAnswers[q.id]
    setAnswers(nextAnswers)
    goToQuestion(index + 1, nextAnswers)
  }

  function restart() {
    try {
      sessionStorage.removeItem(storageKey)
    } catch {}
    mountTs.current = Date.now()
    setAnswers({})
    setSelected(null)
    setConfirmed(false)
    setOpenText('')
    // Draw a fresh option order for the next run
    setOptionOrder(drawOptionOrders(questions))
    setStep({ screen: 'intro' })
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !EMAIL_RE.test(email) || !consent) {
      setFormError(t.errorRequired)
      setFormState('error')
      return
    }
    setFormState('sending')
    setFormError('')
    try {
      // Open answers travel along so they can be kept with the contact
      const openAnswers: Record<string, string> = {}
      for (const q of questions) {
        if (q.type === 'open' && answers[q.id]) openAnswers[q.id] = answers[q.id]
      }
      const res = await fetch('/api/quiz-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          consent,
          locale,
          quiz: quizId,
          score,
          scoreTotal: scoredQuestions.length,
          openAnswers,
          _ts: mountTs.current,
        }),
      })
      const data = (await res.json().catch(() => null)) as { success?: boolean } | null
      if (res.ok && data?.success) {
        setFormState('success')
        try {
          sessionStorage.removeItem(storageKey)
        } catch {}
      } else {
        setFormState('error')
        setFormError(t.errorGeneric)
      }
    } catch {
      setFormState('error')
      setFormError(t.errorGeneric)
    }
  }

  const cardClass = 'bg-white rounded-2xl shadow-lg border border-beige-200 p-6 sm:p-10'
  const ctaClass =
    'inline-block w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-bold py-3.5 px-8 rounded-full text-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
  const secondaryClass =
    'inline-block w-full sm:w-auto border border-beige-300 hover:border-turquoise-400 text-indigo-900 font-medium py-3.5 px-8 rounded-full text-center transition-colors'

  // ── Intro screen ──
  if (step.screen === 'intro') {
    return (
      <div className={cardClass}>
        <span className="inline-block px-3 py-1 bg-yellow-400 text-indigo-900 text-sm font-bold rounded-full mb-4">
          {intro.badge}
        </span>
        <p className="text-lg leading-relaxed mb-6">{intro.text}</p>
        <div className="bg-beige-50 border border-beige-200 rounded-xl p-5 mb-2">
          <p className="font-heading text-xl font-semibold text-indigo-900">{intro.prize}</p>
          <p className="text-sm text-beige-700 mt-1">{intro.drawNote}</p>
        </div>
        <p className="text-sm text-beige-600 mb-6">
          {termsPath && (
            <>
              <a href={termsPath} className="underline hover:text-turquoise-700">
                {t.termsLink}
              </a>
              {' · '}
            </>
          )}
          <a href={privacyPath} className="underline hover:text-turquoise-700">
            {t.privacy}
          </a>
        </p>
        <button type="button" className={ctaClass} onClick={() => goToQuestion(0)}>
          {intro.startLabel}
        </button>
      </div>
    )
  }

  // ── Question screens ──
  if (step.screen === 'question') {
    const index = step.index
    const q = questions[index]
    if (!q) return null
    const isLast = index === questions.length - 1
    const correctOption = q.options?.find((o) => o.correct)
    const answeredCorrectly = confirmed && selected === correctOption?.id

    // Show options in the visitor's shuffled order (fall back to authored order)
    const opts = q.options ?? []
    const byId = new Map(opts.map((o) => [o.id, o]))
    const ordered = (optionOrder[q.id] ?? []).map((id) => byId.get(id)).filter((o): o is EventQuizOption => !!o)
    const displayOptions = ordered.length === opts.length ? ordered : opts

    return (
      <div className={cardClass}>
        {/* Progress */}
        <div className="mb-6">
          <p className="text-sm font-medium text-beige-700 mb-2">
            {interpolate(t.progress, { current: index + 1, total: questions.length })}
          </p>
          <div className="h-1.5 bg-beige-200 rounded-full overflow-hidden" aria-hidden="true">
            <div
              className="h-full bg-turquoise-500 rounded-full transition-all motion-reduce:transition-none"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-indigo-900 mb-6">{q.text}</h2>

        {q.type === 'single' && (
          <div className="grid gap-3 mb-6">
            {displayOptions.map((o) => {
              let optionClass = 'border-beige-300 hover:border-turquoise-400'
              if (confirmed) {
                if (o.correct) optionClass = 'border-turquoise-600 bg-turquoise-50'
                else if (o.id === selected) optionClass = 'border-red-300 bg-red-50'
                else optionClass = 'border-beige-200 opacity-60'
              } else if (o.id === selected) {
                optionClass = 'border-indigo-700 bg-indigo-50'
              }
              return (
                <button
                  key={o.id}
                  type="button"
                  disabled={confirmed}
                  onClick={() => setSelected(o.id)}
                  aria-pressed={o.id === selected}
                  className={`w-full text-left border-2 rounded-xl px-4 py-3.5 min-h-[3rem] transition-colors motion-reduce:transition-none ${optionClass}`}
                >
                  {o.text}
                </button>
              )
            })}
          </div>
        )}

        {q.type === 'open' && (
          <textarea
            value={openText}
            onChange={(e) => setOpenText(e.target.value)}
            maxLength={q.maxLength ?? 500}
            rows={4}
            placeholder={q.placeholder}
            className="w-full border-2 border-beige-300 focus:border-turquoise-500 focus:outline-none rounded-xl px-4 py-3 mb-6 text-base"
          />
        )}

        {/* Feedback after confirming a single question */}
        {q.type === 'single' && confirmed && (
          <div
            className={`rounded-xl p-4 mb-6 ${answeredCorrectly ? 'bg-turquoise-50 border border-turquoise-200' : 'bg-beige-50 border border-beige-200'}`}
            role="status"
            aria-live="polite"
          >
            <p className="font-semibold text-indigo-900">
              {answeredCorrectly ? t.correct : `${t.incorrect} ${t.correctAnswerWas} ${correctOption?.text ?? ''}`}
            </p>
            {q.explanation && <p className="text-sm text-beige-800 mt-1">{q.explanation}</p>}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
          <button type="button" className={secondaryClass} onClick={() => goToQuestion(index - 1)} disabled={index === 0}>
            {t.back}
          </button>
          {q.type === 'single' && !confirmed && (
            <button type="button" className={ctaClass} disabled={!selected} onClick={() => confirmSingle(q)}>
              {t.confirm}
            </button>
          )}
          {q.type === 'single' && confirmed && (
            <button type="button" className={ctaClass} onClick={() => goToQuestion(index + 1)}>
              {isLast ? t.showResult : t.next}
            </button>
          )}
          {q.type === 'open' && (
            <button type="button" className={ctaClass} onClick={() => nextFromOpen(q, index)}>
              {isLast ? t.showResult : t.next}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Result + email gate ──
  return (
    <div className={cardClass}>
      <p className="text-sm font-medium text-beige-700 mb-1">
        {interpolate(t.scoreLabel, { score, total: scoredQuestions.length })}
      </p>
      <h2 className="font-heading text-3xl font-semibold text-indigo-900 mb-2">{resultBand?.title}</h2>
      <p className="text-lg leading-relaxed mb-8">{resultBand?.message}</p>

      {formState === 'success' ? (
        <div className="bg-turquoise-50 border border-turquoise-200 rounded-xl p-6" role="status">
          <h3 className="font-heading text-2xl font-semibold text-indigo-900 mb-2">{emailGate.successTitle}</h3>
          <p>{emailGate.successText}</p>
        </div>
      ) : (
        <div className="bg-beige-50 border border-beige-200 rounded-xl p-5 sm:p-6">
          <h3 className="font-heading text-2xl font-semibold text-indigo-900 mb-2">{emailGate.heading}</h3>
          <p className="mb-5">{emailGate.text}</p>
          <form onSubmit={submitEmail} noValidate>
            <div className="grid gap-3 sm:grid-cols-2 mb-3">
              <label className="block">
                <span className="text-sm font-medium text-indigo-900">{t.firstName}</span>
                <input
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full border-2 border-beige-300 focus:border-turquoise-500 focus:outline-none rounded-xl px-4 py-3"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-indigo-900">{t.lastName}</span>
                <input
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full border-2 border-beige-300 focus:border-turquoise-500 focus:outline-none rounded-xl px-4 py-3"
                />
              </label>
            </div>
            <label className="block mb-4">
              <span className="text-sm font-medium text-indigo-900">{t.email}</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border-2 border-beige-300 focus:border-turquoise-500 focus:outline-none rounded-xl px-4 py-3"
              />
            </label>
            <label className="flex items-start gap-3 mb-5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-turquoise-600"
              />
              <span className="text-sm text-beige-800">
                {emailGate.consentLabel}{' '}
                {termsPath && (
                  <>
                    <a href={termsPath} className="underline hover:text-turquoise-700" target="_blank" rel="noopener">
                      {t.termsLink}
                    </a>
                    {' · '}
                  </>
                )}
                <a href={privacyPath} className="underline hover:text-turquoise-700" target="_blank" rel="noopener">
                  {t.privacy}
                </a>
              </span>
            </label>
            {formState === 'error' && formError && (
              <p className="text-sm text-red-700 mb-4" role="alert">
                {formError}
              </p>
            )}
            <button type="submit" className={ctaClass} disabled={formState === 'sending'}>
              {formState === 'sending' ? t.sending : t.submit}
            </button>
          </form>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-beige-700">
        <button type="button" className="underline hover:text-turquoise-700" onClick={restart}>
          {t.restart}
        </button>
        <span aria-hidden="true">·</span>
        {termsPath && (
          <>
            <a href={termsPath} className="underline hover:text-turquoise-700">
              {t.termsLink}
            </a>
            <span aria-hidden="true">·</span>
          </>
        )}
        <a href={privacyPath} className="underline hover:text-turquoise-700">
          {t.privacy}
        </a>
      </div>
    </div>
  )
}
