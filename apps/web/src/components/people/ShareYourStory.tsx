'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function ShareYourStory() {
  const t = useTranslations('people')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // TODO: Connect to Payload CMS API or MailerLite
    console.log('Story submission:', Object.fromEntries(formData))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-primary-50 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-xl font-bold text-primary-900 mb-2">
          Thank you!
        </h3>
        <p className="text-stone-600">We&apos;ll be in touch soon.</p>
      </div>
    )
  }

  return (
    <div className="bg-stone-50 rounded-2xl p-6 md:p-8">
      <h3 className="font-heading text-2xl font-bold text-stone-900 mb-2">
        {t('shareYourStory')}
      </h3>
      <p className="text-stone-600 mb-6 text-sm">
        Have you visited Marienbad? We&apos;d love to hear your story.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-stone-700 mb-1">
              Country *
            </label>
            <input
              id="country"
              name="country"
              type="text"
              required
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label htmlFor="visits" className="block text-sm font-medium text-stone-700 mb-1">
            How many times have you visited?
          </label>
          <input
            id="visits"
            name="visits"
            type="text"
            placeholder="e.g., First time, 5th visit, Every year since 2001..."
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label htmlFor="story" className="block text-sm font-medium text-stone-700 mb-1">
            Your Story *
          </label>
          <textarea
            id="story"
            name="story"
            rows={5}
            required
            placeholder="What does Marienbad mean to you? Why do you come (back)?"
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 rounded border-stone-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="consent" className="text-xs text-stone-500">
            I agree that my story and photo may be published on marienbad.com and related social media channels.
          </label>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-primary-700 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          {t('shareYourStory')}
        </button>
      </form>
    </div>
  )
}
