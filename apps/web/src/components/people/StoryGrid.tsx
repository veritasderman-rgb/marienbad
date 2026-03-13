'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { StoryCard, type StoryData } from './StoryCard'

type Props = {
  stories: StoryData[]
}

const archetypeKeys = [
  'loyal',
  'firstVisit',
  'healing',
  'love',
  'generation',
  'cultural',
  'local',
  'faraway',
] as const

const archetypeFilterMap: Record<string, string> = {
  loyal: 'loyal',
  firstVisit: 'first-visit',
  healing: 'healing',
  love: 'love',
  generation: 'generation',
  cultural: 'cultural',
  local: 'local',
  faraway: 'faraway',
}

export function StoryGrid({ stories }: Props) {
  const t = useTranslations('people')
  const [filter, setFilter] = useState<string | null>(null)

  const filtered = filter
    ? stories.filter((s) => s.archetype === filter)
    : stories

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !filter
              ? 'bg-primary-700 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {t('allStories')}
        </button>
        {archetypeKeys.map((key) => (
          <button
            key={key}
            onClick={() => setFilter(archetypeFilterMap[key])}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === archetypeFilterMap[key]
                ? 'bg-primary-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t(`archetypes.${key}`)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((story) => (
          <StoryCard key={story.slug} story={story} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-stone-500 py-12">
          No stories found for this filter.
        </p>
      )}
    </div>
  )
}
