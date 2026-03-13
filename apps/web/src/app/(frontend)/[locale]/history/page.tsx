import { getTranslations } from 'next-intl/server'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { getPageBySlug, getArticlesByPillar } from '@/lib/api'
import { HeroSection } from '@/components/sections/HeroSection'
import { FAQAccordion } from '@/components/sections/FAQAccordion'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const page = await getPageBySlug('history', locale as any)
  return {
    title: page?.hero?.headline ?? (locale === 'de' ? 'Geschichte & Kultur von Marienbad' : 'History & Culture of Marienbad'),
    description: 'Explore the rich history of Marienbad – from Goethe and Chopin to UNESCO heritage and stunning architecture.',
  }
}

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const page = await getPageBySlug('history', locale as any)

  const faqItems = page?.faq ?? [
    { question: 'Is Marienbad a UNESCO World Heritage Site?', answer: 'Yes, since 2021 Mariánské Lázně is part of the "Great Spa Towns of Europe" UNESCO World Heritage inscription.' },
    { question: 'Which famous people visited Marienbad?', answer: 'Notable visitors include Johann Wolfgang von Goethe, Frédéric Chopin, Franz Kafka, King Edward VII, Mark Twain, and Thomas Edison.' },
  ]

  const tocItems = page?.tableOfContents ?? [
    { id: 'famous-visitors', label: 'Famous Visitors' },
    { id: 'unesco', label: 'UNESCO Heritage' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'film', label: 'Marienbad in Film' },
  ]

  const relatedArticles = page?.relatedArticles ?? [
    { href: '#', title: "Goethe's Love Affair with Marienbad" },
    { href: '#', title: "King Edward VII's Private Cabin" },
    { href: '#', title: 'UNESCO Heritage: What It Means' },
  ]

  return (
    <>
      <HeroSection
        title={page?.hero?.headline ?? t('nav.history')}
        subtitle={page?.hero?.subheadline ?? "From Goethe's love letters to UNESCO heritage — centuries of culture, healing and elegance"}
        ctaText={t('common.readMore')}
        ctaHref="/history"
      />

      <div className="container-wide py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <nav className="bg-stone-50 rounded-xl p-6 mb-10">
              <h2 className="font-semibold text-stone-800 mb-3">{t('common.tableOfContents')}</h2>
              <ul className="space-y-2 text-sm">
                {tocItems.map((item: { id: string; label: string }) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-primary-600 hover:text-primary-800">{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {page?.content ? (
              <RichTextRenderer data={page.content} />
            ) : (
              <>
                <section id="famous-visitors" className="prose prose-stone max-w-none mb-12">
                  <h2>Famous Visitors</h2>
                  <p>Goethe, Chopin, Kafka, Edward VII — content from CMS.</p>
                </section>

                <section id="unesco" className="prose prose-stone max-w-none mb-12">
                  <h2>UNESCO World Heritage</h2>
                  <p>Great Spa Towns of Europe — content from CMS.</p>
                </section>

                <section id="architecture" className="prose prose-stone max-w-none mb-12">
                  <h2>Architecture</h2>
                  <p>Neo-baroque, Art Nouveau, Colonnade — content from CMS.</p>
                </section>

                <section id="film" className="prose prose-stone max-w-none mb-12">
                  <h2>Marienbad in Film</h2>
                  <p>Last Year at Marienbad (1961) — content from CMS.</p>
                </section>
              </>
            )}

            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-primary-900 mb-6">FAQ</h2>
              <FAQAccordion items={faqItems} />
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-stone-50 rounded-xl p-5">
              <h3 className="font-semibold text-stone-800 mb-4">{t('common.relatedArticles')}</h3>
              <ul className="space-y-3 text-sm">
                {relatedArticles.map((article: { href: string; title: string }, index: number) => (
                  <li key={index}>
                    <a href={article.href} className="text-primary-600 hover:text-primary-800 font-medium">{article.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
