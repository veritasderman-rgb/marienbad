import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { EnsanaCTABox } from '@/components/ensana/EnsanaCTABox'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { getArticleBySlug } from '@/lib/api'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const article = await getArticleBySlug(slug, locale as any)
  if (article) {
    return { title: `${article.title} | Marienbad.com`, description: article.excerpt || '' }
  }
  const title = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return { title: `${title} | Marienbad.com` }
}

export default async function ClusterArticlePage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  const article = await getArticleBySlug(slug, locale as any)

  const title = article?.title || slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const pillarName = 'History & Culture'
  const pillarSlug = 'history'
  const excerpt = article?.excerpt || `${title} — ${pillarName} guide for Marienbad`

  const ensana = article?.ensanaCTA?.enabled ? article.ensanaCTA : null

  return (
    <article>
      <ArticleJsonLd
        title={title}
        description={excerpt}
        url={`/${pillarSlug}/${slug}`}
        publishedTime={article?.publishedAt || new Date().toISOString()}
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: pillarName, url: `/${locale}/${pillarSlug}` },
          { name: title, url: `/${locale}/${pillarSlug}/${slug}` },
        ]}
      />

      <header className="bg-primary-950 text-white py-16 md:py-20">
        <div className="container-narrow">
          <p className="text-accent-400 text-sm font-medium uppercase tracking-wider mb-4">
            {pillarName}
          </p>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          <div className="flex items-center gap-4 text-stone-400 text-sm">
            <span>{t('minRead', { minutes: 6 })}</span>
            {article?.publishedAt && (
              <>
                <span>|</span>
                <span>{t('lastUpdated', { date: new Date(article.publishedAt).toLocaleDateString() })}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="sticky top-16 md:top-20 z-40 h-1 bg-stone-200">
        <div className="h-full bg-primary-600 w-0" id="reading-progress" />
      </div>

      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {article?.content ? (
              <RichTextRenderer data={article.content} className="prose prose-stone prose-lg max-w-none" />
            ) : (
              <div className="prose prose-stone prose-lg max-w-none">
                <p className="lead">
                  This article content will be loaded from Payload CMS.
                </p>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-stone-200">
              <a
                href={`/${locale}/${pillarSlug}`}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                {t('backTo', { page: pillarName })}
              </a>
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-8">
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
