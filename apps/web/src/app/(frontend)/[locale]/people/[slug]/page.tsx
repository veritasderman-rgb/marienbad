import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  // TODO: Fetch story from Payload CMS
  return {
    title: `Story | Marienbad.com`,
  }
}

export default async function StoryDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'common' })

  // TODO: Fetch from Payload CMS API
  // const story = await getStory(slug, locale)

  return (
    <article className="min-h-screen">
      {/* Portrait Hero */}
      <section className="relative bg-primary-950">
        <div className="container-wide py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Portrait placeholder */}
            <div className="aspect-[3/4] max-w-md mx-auto md:mx-0 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-200 to-primary-400">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl text-white/40 font-heading">?</span>
              </div>
            </div>

            {/* Story content */}
            <div className="text-white">
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                {/* story.headline */}
                Story: {slug}
              </h1>
              <blockquote className="text-xl md:text-2xl text-accent-300 italic leading-relaxed mb-8 border-l-4 border-accent-500 pl-6">
                {/* story.pullQuote */}
                &ldquo;Pull quote will appear here from CMS&rdquo;
              </blockquote>
              <div className="prose prose-invert prose-stone max-w-none text-stone-300 leading-relaxed">
                {/* story.content — rendered from CMS rich text */}
                <p>
                  Story content will be loaded from Payload CMS. Each story is 200-400 words
                  in the visitor&apos;s original language.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social sharing */}
      <section className="container-narrow py-8 flex items-center justify-center gap-4">
        <span className="text-sm text-stone-500">{t('shareArticle')}:</span>
        <div className="flex gap-2">
          {['Facebook', 'Twitter', 'WhatsApp'].map((platform) => (
            <button
              key={platform}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-sm font-medium transition-colors"
            >
              {platform}
            </button>
          ))}
        </div>
      </section>
    </article>
  )
}
