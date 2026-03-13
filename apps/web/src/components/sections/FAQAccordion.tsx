'use client'

import { useState } from 'react'

type FAQItem = {
  question: string
  answer: string
}

type Props = {
  items: FAQItem[]
  schemaMarkup?: boolean
}

export function FAQAccordion({ items, schemaMarkup = true }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const schema = schemaMarkup
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null

  return (
    <div>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-stone-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-stone-800 pr-4">{item.question}</span>
              <svg
                className={`w-5 h-5 text-stone-400 shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5 text-stone-600 leading-relaxed text-sm border-t border-stone-100 pt-4">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
