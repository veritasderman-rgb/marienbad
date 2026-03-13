import { getTranslations } from 'next-intl/server'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { getStoryBySlug } from '@/lib/api'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const story = await getStoryBySlug(slug)
  if (story) {
    return { title: `${story.headline} | Marienbad.com`, description: story.pullQuote }
  }
  return { title: 'Story | Marienbad.com' }
}

export default async function StoryDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const story = await getStoryBySlug(slug)

  const portraitUrl = story?.portrait?.url || story?.portrait?.sizes?.hero?.url

  return (
    <article className="min-h-screen">
      {/* Portrait Hero */}
      <section className="relative bg-primary-950">
        <div className="container-wide py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Portrait */}
            <div className="aspect-[3/4] max-w-md mx-auto md:mx-0 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-200 to-primary-400">
              {portraitUrl ? (
                <img
                  src={portraitUrl}
                  alt={story?.headline || slug}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl text-white/40 font-heading">
                    {story?.name?.[0] || '?'}
                  </span>
                </div>
              )}
            </div>

            {/* Story content */}
            <div className="text-white">
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                {story?.headline || `Story: ${slug}`}
              </h1>
              <blockquote className="text-xl md:text-2xl text-accent-300 italic leading-relaxed mb-8 border-l-4 border-accent-500 pl-6">
                &ldquo;{story?.pullQuote || 'Pull quote will appear here from CMS'}&rdquo;
              </blockquote>

              {story?.story ? (
                <RichTextRenderer
                  data={story.story}
                  className="prose prose-invert prose-stone max-w-none text-stone-300 leading-relaxed"
                />
              ) : (
                <div className="prose prose-invert prose-stone max-w-none text-stone-300 leading-relaxed">
                  <p>Story content will be loaded from Payload CMS.</p>
                </div>
              )}

              {story?.name && (
                <div className="mt-8 flex items-center gap-3 text-stone-400 text-sm">
                  <span>{story.name}</span>
                  {story.country && <><span>|</span><span>{story.country}</span></>}
                  {story.visitNumber && <><span>|</span><span>Visit #{story.visitNumber}</span></>}
                </div>
              )}
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
