import { Link } from '@/lib/i18n/navigation'

export type StoryData = {
  slug: string
  name: string
  country: string
  visitNumber?: string
  headline: string
  pullQuote: string
  portraitUrl?: string
  archetype: string
}

type Props = {
  story: StoryData
}

const archetypeColors: Record<string, string> = {
  loyal: 'bg-primary-100 text-primary-700',
  'first-visit': 'bg-accent-100 text-accent-700',
  healing: 'bg-emerald-100 text-emerald-700',
  love: 'bg-rose-100 text-rose-700',
  generation: 'bg-violet-100 text-violet-700',
  cultural: 'bg-amber-100 text-amber-700',
  local: 'bg-sky-100 text-sky-700',
  faraway: 'bg-indigo-100 text-indigo-700',
}

export function StoryCard({ story }: Props) {
  return (
    <Link
      href={`/people/${story.slug}` as any}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Portrait */}
      <div className="aspect-[3/4] bg-stone-200 relative overflow-hidden">
        {story.portraitUrl ? (
          <img
            src={story.portraitUrl}
            alt={story.headline}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
            <span className="text-6xl text-white/60 font-heading">{story.name[0]}</span>
          </div>
        )}
        {/* Archetype badge */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium ${archetypeColors[story.archetype] || 'bg-stone-100 text-stone-600'}`}>
          {story.archetype}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading text-lg font-bold text-stone-900 mb-1">
          {story.headline}
        </h3>
        <blockquote className="text-sm text-stone-600 italic leading-relaxed line-clamp-3">
          &ldquo;{story.pullQuote}&rdquo;
        </blockquote>
      </div>
    </Link>
  )
}
