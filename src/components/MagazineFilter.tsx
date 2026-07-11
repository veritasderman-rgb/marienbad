import { useState } from 'react'
import type { Locale } from '@/i18n/config'

interface ArticleData {
  slug: string
  title: string
  category: string
  excerpt: string
  coverImage?: string
  /** Pre-computed WebP srcset from the server (see src/lib/imageOptim.ts) */
  coverWebpSrcset?: string
  coverWidth?: number
  coverHeight?: number
  readingTime: string
  date: string
}

/** Cover image with optional WebP <source>; picture uses display:contents so
 *  the img keeps sizing against the card container. */
function CoverImage({ article, className }: { article: ArticleData; className: string }) {
  const img = (
    <img
      src={article.coverImage}
      alt={article.title}
      width={article.coverWidth}
      height={article.coverHeight}
      className={className}
      loading="lazy"
      decoding="async"
    />
  )
  if (!article.coverWebpSrcset) return img
  return (
    <picture className="contents">
      <source
        type="image/webp"
        srcSet={article.coverWebpSrcset}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {img}
    </picture>
  )
}

interface Props {
  articles: ArticleData[]
  locale: Locale
  magazineSlug: string
  translations: {
    all: string
    readMore: string
    featured: string
  }
}

const categoryLabels: Record<string, Record<string, string>> = {
  health: { de: 'Gesundheit', en: 'Health', cs: 'Zdraví', ru: 'Здоровье' },
  healing: { de: 'Gesundheit', en: 'Health', cs: 'Zdraví', ru: 'Здоровье' },
  wellness: { de: 'Wellness', en: 'Wellness', cs: 'Wellness', ru: 'Велнес' },
  planning: { de: 'Planung', en: 'Planning', cs: 'Plánování', ru: 'Планирование' },
  culture: { de: 'Kultur', en: 'Culture', cs: 'Kultura', ru: 'Культура' },
  tip: { de: 'Tipp', en: 'Tip', cs: 'Tip', ru: 'Совет' },
  nature: { de: 'Natur', en: 'Nature', cs: 'Příroda', ru: 'Природа' },
  history: { de: 'Geschichte', en: 'History', cs: 'Historie', ru: 'История' },
  food: { de: 'Genuss', en: 'Food', cs: 'Jídlo', ru: 'Еда' },
  activities: { de: 'Aktivitäten', en: 'Activities', cs: 'Aktivity', ru: 'Активности' },
  springs: { de: 'Quellen', en: 'Springs', cs: 'Prameny', ru: 'Источники' },
  comparison: { de: 'Vergleich', en: 'Comparison', cs: 'Srovnání', ru: 'Сравнение' },
}

const categoryColors: Record<string, string> = {
  health: 'bg-turquoise-100 text-turquoise-800',
  healing: 'bg-turquoise-100 text-turquoise-800',
  wellness: 'bg-indigo-100 text-indigo-800',
  planning: 'bg-yellow-100 text-yellow-800',
  history: 'bg-aubergine-100 text-aubergine-800',
  food: 'bg-beige-200 text-beige-800',
  nature: 'bg-emerald-100 text-emerald-800',
  activities: 'bg-turquoise-100 text-turquoise-800',
  springs: 'bg-indigo-100 text-indigo-800',
  culture: 'bg-aubergine-100 text-aubergine-800',
  tip: 'bg-yellow-100 text-yellow-800',
  comparison: 'bg-beige-200 text-beige-800',
}

export default function MagazineFilter({ articles, locale, magazineSlug, translations: tr }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Get unique categories from articles (merge health+healing)
  const categories = Array.from(new Set(articles.map(a => a.category === 'healing' ? 'health' : a.category)))
    .filter(c => c)
    .sort()

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.category === activeCategory || (activeCategory === 'health' && a.category === 'healing') || (activeCategory === 'healing' && a.category === 'health'))

  const getLabel = (cat: string) => categoryLabels[cat]?.[locale] ?? cat
  const getColor = (cat: string) => categoryColors[cat] ?? 'bg-beige-100 text-beige-700'

  const buildHref = (slug: string) => {
    const articleSlug = slug.replace(/^[a-z]{2}-/, '')
    return `/${locale}/${magazineSlug}/${articleSlug}`
  }

  return (
    <>
      {/* Category Filter Bar */}
      <div className="bg-white border-b border-beige-200 py-4">
        <div className="container-wide">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              aria-pressed={activeCategory === 'all'}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-indigo-700 text-white'
                  : 'bg-beige-100 text-beige-700 hover:bg-beige-200'
              }`}
            >
              {tr.all}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-indigo-700 text-white'
                    : 'bg-beige-100 text-beige-700 hover:bg-beige-200'
                }`}
              >
                {getLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Article Grid */}
      <section className="container-wide py-10 md:py-14">
        {/* First 2 articles — large cards */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filtered.slice(0, 2).map((article) => (
              <a
                key={article.slug}
                href={buildHref(article.slug)}
                className="group bg-white rounded-2xl overflow-hidden shadow-card card-hover block"
              >
                {article.coverImage && (
                  <div className="h-56 md:h-64 relative overflow-hidden">
                    <CoverImage
                      article={article}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getColor(article.category)}`}>
                        {getLabel(article.category)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-indigo-700 mb-3 group-hover:text-turquoise-600 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-beige-700 text-sm leading-relaxed line-clamp-2 mb-5">{article.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-beige-100">
                    <span className="text-xs text-beige-500">{article.readingTime}</span>
                    <span className="inline-flex items-center gap-1 text-sm text-turquoise-600 font-semibold group-hover:text-turquoise-700">
                      {tr.readMore}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Remaining articles — 3-column grid */}
        {filtered.length > 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(2).map((article) => (
              <a
                key={article.slug}
                href={buildHref(article.slug)}
                className="group bg-white rounded-xl overflow-hidden shadow-card card-hover block"
              >
                {article.coverImage && (
                  <div className="h-44 relative overflow-hidden">
                    <CoverImage
                      article={article}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[0.6875rem] font-semibold ${getColor(article.category)}`}>
                        {getLabel(article.category)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-indigo-700 mb-2 group-hover:text-turquoise-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-beige-700 text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-beige-100">
                    <span className="text-xs text-beige-500">{article.readingTime}</span>
                    <span className="inline-flex items-center gap-1 text-sm text-turquoise-600 font-semibold group-hover:text-turquoise-700">
                      {tr.readMore}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-beige-500">
            <p className="text-lg">{locale === 'cs' ? 'Žádné články v této kategorii.' : locale === 'de' ? 'Keine Artikel in dieser Kategorie.' : locale === 'ru' ? 'Нет статей в этой категории.' : 'No articles in this category.'}</p>
          </div>
        )}
      </section>
    </>
  )
}
