'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

type CarouselStory = {
  name: string
  country: string
  pullQuote: string
  archetype: string
}

const placeholderStories: CarouselStory[] = [
  {
    name: 'Helga',
    country: 'Österreich',
    pullQuote: '23 Jahre. Jedes Jahr Oktober. Die Kolonnade ist mein zweites Zuhause.',
    archetype: 'loyal',
  },
  {
    name: 'James',
    country: 'London',
    pullQuote: 'I expected old. I found magic. The singing fountain at sunset changed everything.',
    archetype: 'first-visit',
  },
  {
    name: 'Татьяна',
    country: 'Москва',
    pullQuote: 'Доктор сказал шесть месяцев. Четыре года назад. Я приезжаю каждый год.',
    archetype: 'healing',
  },
]

type Props = {
  stories?: CarouselStory[]
}

export function PeopleCarousel({ stories }: Props) {
  const t = useTranslations('people')
  const displayStories = stories && stories.length > 0 ? stories : placeholderStories

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
          {t('title')}
        </h2>
        <p className="text-stone-400 text-lg max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Stories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {displayStories.map((story) => (
          <div key={story.name} className="bg-primary-900/50 rounded-2xl p-6 md:p-8">
            <blockquote className="text-lg text-stone-300 italic leading-relaxed mb-6">
              &ldquo;{story.pullQuote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-600/30 flex items-center justify-center">
                <span className="text-accent-300 font-heading text-lg font-bold">
                  {story.name[0]}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white">{story.name}</p>
                <p className="text-sm text-stone-400">{story.country}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/people"
          className="inline-flex items-center gap-2 px-6 py-3 border border-stone-600 text-stone-300 hover:bg-primary-800 hover:text-white rounded-xl transition-colors font-medium"
        >
          {t('allStories')}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
