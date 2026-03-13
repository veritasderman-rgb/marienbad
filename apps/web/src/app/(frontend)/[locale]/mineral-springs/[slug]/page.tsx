import { getTranslations } from 'next-intl/server'
import { EnsanaCTABox } from '@/components/ensana/EnsanaCTABox'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  // TODO: Fetch from Payload CMS
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  return { title: `${title} | Marienbad.com` }
}

export default async function ClusterArticlePage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'common' })

  // TODO: Fetch article from Payload CMS
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <article>
      <ArticleJsonLd
        title={title}
        description={`${title} — Mineral Springs & Spa guide for Marienbad`}
        url={`/mineral-springs/${slug}`}
        publishedTime="2026-03-10T00:00:00.000Z"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Mineral Springs', url: `/${locale}/mineral-springs` },
          { name: title, url: `/${locale}/mineral-springs/${slug}` },
        ]}
      />

      {/* Article header */}
      <header className="bg-primary-950 text-white py-16 md:py-20">
        <div className="container-narrow">
          <p className="text-accent-400 text-sm font-medium uppercase tracking-wider mb-4">
            Mineral Springs & Spa
          </p>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-stone-400 text-sm">
            <span>{t('minRead', { minutes: 6 })}</span>
            <span>|</span>
            <span>{t('lastUpdated', { date: '2026-03-10' })}</span>
          </div>
        </div>
      </header>

      {/* Reading progress bar placeholder */}
      <div className="sticky top-16 md:top-20 z-40 h-1 bg-stone-200">
        <div className="h-full bg-primary-600 w-0" id="reading-progress" />
      </div>

      {/* Article body */}
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="prose prose-stone prose-lg max-w-none">
              <p className="lead">
                This article content will be loaded from Payload CMS. Each cluster article
                is 800-1500 words with rich media, internal links, and a single Ensana CTA.
              </p>
              <h2>Section Heading</h2>
              <p>
                Article content managed through the CMS admin panel. Rich text editor
                supports images, embeds, and custom blocks.
              </p>
              <h2>Practical Information</h2>
              <p>Opening hours, prices, contact information — all from CMS.</p>
            </div>

            {/* Back to pillar */}
            <div className="mt-12 pt-8 border-t border-stone-200">
              <a
                href={`/${locale}/mineral-springs`}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                {t('backTo', { page: 'Mineral Springs' })}
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <EnsanaCTABox
              url="https://www.ensanahotels.com/nove-lazne"
              campaign={slug}
              position="sidebar"
            />
          </aside>
        </div>
      </div>
    </article>
  )
}
