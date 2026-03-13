import { getTranslations } from 'next-intl/server'
import { EnsanaCTABox } from '@/components/ensana/EnsanaCTABox'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { getArticleBySlug } from '@/lib/api'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const article = await getArticleBySlug(slug, locale as any)
  if (article) {
    return { title: `${article.title} | Magazine | Marienbad.com`, description: article.excerpt || '' }
  }
  const title = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return { title: `${title} | Magazine | Marienbad.com` }
}

export default async function MagazineArticle({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const article = await getArticleBySlug(slug, locale as any)

  const title = article?.title || slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const ensana = article?.ensanaCTA?.enabled ? article.ensanaCTA : null

  return (
    <article>
      <header className="bg-primary-950 text-white py-16 md:py-20">
        <div className="container-narrow">
          <p className="text-accent-400 text-sm font-medium uppercase tracking-wider mb-4">Magazine</p>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          <div className="flex items-center gap-4 text-stone-400 text-sm">
            <span>{t('minRead', { minutes: 5 })}</span>
            {article?.publishedAt && (
              <>
                <span>|</span>
                <span>{t('lastUpdated', { date: new Date(article.publishedAt).toLocaleDateString() })}</span>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {article?.content ? (
              <RichTextRenderer data={article.content} className="prose prose-stone prose-lg max-w-none" />
            ) : (
              <div className="prose prose-stone prose-lg max-w-none">
                <p className="lead">Article content loaded from Payload CMS.</p>
              </div>
            )}
          </div>
          <aside className="lg:col-span-1">
            <EnsanaCTABox
              headline={ensana?.headline}
              text={ensana?.text}
              url={ensana?.url || 'https://www.ensanahotels.com/destinations/marianske-lazne'}
              campaign={slug}
              position="sidebar"
            />
          </aside>
        </div>
      </div>
    </article>
  )
}
