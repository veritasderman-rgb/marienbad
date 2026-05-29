import { useState, useRef, type FormEvent } from 'react'

interface StorySubmissionFormProps {
  locale: 'de' | 'en' | 'cs' | 'ru'
  translations: {
    formTitle: string
    formSubtitle: string
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    emailHint: string
    locationLabel: string
    locationPlaceholder: string
    visitLabel: string
    visitRecently: string
    visit1to5: string
    visit5to10: string
    visit10plus: string
    storyLabel: string
    storyPlaceholder: string
    storyHint: string
    photoConsent: string
    privacyConsent: string
    submitButton: string
    submitting: string
    successTitle: string
    successMessage: string
    errorMessage: string
    required: string
    minChars: string
  }
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function StorySubmissionForm({ locale, translations }: StorySubmissionFormProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [storyText, setStoryText] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const tsRef = useRef(Date.now())

  const validate = (form: FormData): Record<string, string> => {
    const errors: Record<string, string> = {}
    const name = (form.get('name') as string)?.trim()
    const email = (form.get('email') as string)?.trim()
    const location = (form.get('location') as string)?.trim()
    const story = (form.get('story') as string)?.trim()
    const privacyConsent = form.get('privacyConsent')

    if (!name) errors.name = translations.required
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = translations.required
    if (!location) errors.location = translations.required
    if (!story || story.length < 50) errors.story = translations.minChars
    if (!privacyConsent) errors.privacyConsent = translations.required

    return errors
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    setFieldErrors({})

    const form = new FormData(e.currentTarget)
    const errors = validate(form)

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFormState('submitting')

    try {
      const res = await fetch('/api/story-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: (form.get('name') as string).trim(),
          email: (form.get('email') as string).trim(),
          location: (form.get('location') as string).trim(),
          visitPeriod: form.get('visitPeriod') as string,
          story: (form.get('story') as string).trim(),
          photoConsent: form.get('photoConsent') === 'on',
          locale,
          website: (form.get('website') as string) || '',
          _ts: tsRef.current,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setFormState('success')
      } else {
        setErrorMsg(data.error || translations.errorMessage)
        setFormState('error')
      }
    } catch {
      setErrorMsg(translations.errorMessage)
      setFormState('error')
    }
  }

  if (formState === 'success') {
    return (
      <div className="bg-beige-100 rounded-2xl p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-turquoise-100 text-turquoise-600 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl font-bold text-indigo-700 mb-3">{translations.successTitle}</h3>
        <p className="text-indigo-600 max-w-md mx-auto">{translations.successMessage}</p>
      </div>
    )
  }

  const inputBase =
    'w-full px-4 py-3 rounded-lg border border-beige-300 bg-white text-indigo-800 placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:border-turquoise-400 transition-colors'
  const labelBase = 'block text-sm font-semibold text-indigo-700 mb-1.5'
  const errorBase = 'text-red-600 text-xs mt-1'

  return (
    <div className="bg-beige-100 rounded-2xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto">
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-indigo-700 mb-2">
          {translations.formTitle}
        </h3>
        <p className="text-indigo-600 mb-8">{translations.formSubtitle}</p>

        {formState === 'error' && errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate data-ga-form="story">
          {/* Honeypot field — hidden from real users */}
          <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label htmlFor="story-name" className={labelBase}>
                {translations.nameLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="story-name"
                name="name"
                required
                placeholder={translations.namePlaceholder}
                className={inputBase}
              />
              {fieldErrors.name && <p className={errorBase}>{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="story-email" className={labelBase}>
                {translations.emailLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="story-email"
                name="email"
                required
                placeholder={translations.emailPlaceholder}
                className={inputBase}
              />
              <p className="text-indigo-400 text-xs mt-1">{translations.emailHint}</p>
              {fieldErrors.email && <p className={errorBase}>{fieldErrors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Location */}
            <div>
              <label htmlFor="story-location" className={labelBase}>
                {translations.locationLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="story-location"
                name="location"
                required
                placeholder={translations.locationPlaceholder}
                className={inputBase}
              />
              {fieldErrors.location && <p className={errorBase}>{fieldErrors.location}</p>}
            </div>

            {/* Visit period */}
            <div>
              <label htmlFor="story-visit" className={labelBase}>
                {translations.visitLabel}
              </label>
              <select
                id="story-visit"
                name="visitPeriod"
                defaultValue="recently"
                className={inputBase}
              >
                <option value="recently">{translations.visitRecently}</option>
                <option value="1-5">{translations.visit1to5}</option>
                <option value="5-10">{translations.visit5to10}</option>
                <option value="10+">{translations.visit10plus}</option>
              </select>
            </div>
          </div>

          {/* Story textarea */}
          <div className="mb-6">
            <label htmlFor="story-text" className={labelBase}>
              {translations.storyLabel} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="story-text"
              name="story"
              required
              minLength={50}
              maxLength={2000}
              rows={6}
              placeholder={translations.storyPlaceholder}
              className={`${inputBase} resize-y`}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-indigo-400 text-xs">{translations.storyHint}</p>
              <span className={`text-xs ${storyText.length < 50 ? 'text-red-500' : storyText.length > 1800 ? 'text-yellow-600' : 'text-indigo-400'}`}>
                {storyText.length} / 2000
              </span>
            </div>
            {fieldErrors.story && <p className={errorBase}>{fieldErrors.story}</p>}
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 mb-8">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="photoConsent"
                className="mt-1 h-4 w-4 rounded border-beige-300 text-turquoise-500 focus:ring-turquoise-400"
              />
              <span className="text-sm text-indigo-600">{translations.photoConsent}</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="privacyConsent"
                required
                className="mt-1 h-4 w-4 rounded border-beige-300 text-turquoise-500 focus:ring-turquoise-400"
              />
              <span className="text-sm text-indigo-600">
                {translations.privacyConsent} <span className="text-red-500">*</span>
              </span>
            </label>
            {fieldErrors.privacyConsent && <p className={errorBase}>{fieldErrors.privacyConsent}</p>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={formState === 'submitting'}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-yellow-400 text-indigo-800 font-semibold rounded-full hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {formState === 'submitting' ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {translations.submitting}
              </>
            ) : (
              translations.submitButton
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
