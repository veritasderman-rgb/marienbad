import { getTranslations } from 'next-intl/server'
import { getArticles } from '@/lib/api'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'de' ? 'Magazin | Marienbad.com' : 'Magazine | Marienbad.com',
    description: 'Latest articles, seasonal guides and stories from Marienbad.',
  }
}

const placeholderArticles = [
  { slug: 'spring-in-marienbad', title: 'Spring in Marienbad: What to Expect', excerpt: 'As the snow melts and the parks come alive, spring is one of the best times to visit.', category: 'Seasonal', date: '2026-03-01', readTime: 5 },
  { slug: 'roman-baths-guide', title: 'The Complete Guide to Roman Baths', excerpt: 'Everything you need to know about experiencing the historic Roman Baths at Nové Lázně.', category: 'Spa & Wellness', date: '2026-02-15', readTime: 8 },
  { slug: 'chopin-festival-2026', title: 'Chopin Festival 2026: Program & Tips', excerpt: "The annual Chopin Festival returns to Marienbad. Here's what to look forward to.", category: 'Events', date: '2026-02-01', readTime: 4 },
]

export default async function MagazinePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const { docs: cmsArticles } = await getArticles(locale as any)

  const articles = cmsArticles.length > 0
    ? cmsArticles.map((a: any) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt || '',
        category: typeof a.category === 'object' ? a.category?.name : a.category || '',
        date: a.publishedAt || '',
        readTime: 5,
        imageUrl: a.featuredImage?.sizes?.card?.url || a.featuredImage?.url,
      }))
    : placeholderArticles

  return (
    <div>
      <section className="bg-primary-950 text-white py-16 md:py-20">
        <div className="container-wide">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {t('nav.magazine')}
          </h1>
          <p className="text-stone-400 text-lg max-w-2xl">
            Stories, guides and seasonal tips from Marienbad.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any) => (
            <a
              key={article.slug}
              href={`/${locale}/magazine/${article.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {article.imageUrl ? (
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-primary-200 to-primary-400" />
              )}

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  {article.category && (
                    <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                  )}
                  <span className="text-xs text-stone-400">
                    {t('common.minRead', { minutes: article.readTime })}
                  </span>
                </div>
                <h2 className="font-heading text-xl font-bold text-stone-900 group-hover:text-primary-700 transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
