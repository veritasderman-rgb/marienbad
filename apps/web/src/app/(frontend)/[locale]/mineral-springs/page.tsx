import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { FAQAccordion } from '@/components/sections/FAQAccordion'
import { EnsanaCTABox } from '@/components/ensana/EnsanaCTABox'
import { FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { getPageBySlug, getArticlesByPillar } from '@/lib/api'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const page = await getPageBySlug('mineral-springs', locale as any)
  if (page) {
    return { title: page.title, description: page.hero?.subheadline || '' }
  }
  return {
    title: locale === 'de' ? 'Mineralquellen & Spa in Marienbad' : 'Mineral Springs & Spa in Marienbad',
    description: locale === 'de'
      ? 'Entdecken Sie die heilenden Mineralquellen von Marienbad.'
      : 'Discover the healing mineral springs of Marienbad.',
  }
}

const fallbackFaq = [
  { question: 'How many mineral springs are there in Marienbad?', answer: 'Marienbad has over 40 mineral springs, each with unique mineral composition and healing properties.' },
  { question: 'What health conditions can be treated?', answer: 'Marienbad spa treatments are traditionally used for digestive disorders, metabolic diseases, respiratory conditions, kidney and urinary tract issues, and musculoskeletal problems.' },
  { question: 'Do I need a prescription for spa treatments?', answer: "While some therapeutic spa treatments require a doctor's recommendation, many wellness treatments are available to all visitors." },
  { question: 'What are CO2 baths?', answer: 'CO2 (carbon dioxide) baths are a signature Marienbad treatment. Natural CO2 gas is dissolved in mineral water, improving blood circulation and promoting relaxation.' },
]

export default async function MineralSpringsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const page = await getPageBySlug('mineral-springs', locale as any)
  const relatedArticles = page?.id ? await getArticlesByPillar(String(page.id), locale as any) : []

  const faqItems = page?.faq?.length ? page.faq : fallbackFaq
  const toc = page?.tableOfContents?.length
    ? page.tableOfContents
    : [
        { label: 'Healing Waters Guide', anchor: 'healing-waters' },
        { label: 'Roman Baths', anchor: 'roman-baths' },
        { label: 'CO2 Baths & Science', anchor: 'co2-baths' },
        { label: 'Health Conditions', anchor: 'health-conditions' },
        { label: 'FAQ', anchor: 'faq' },
      ]

  const ensana = page?.ensanaCTA?.enabled ? page.ensanaCTA : null

  return (
    <>
      <FAQJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: page?.title || 'Mineral Springs', url: '/mineral-springs' },
        ]}
      />

      <HeroSection
        title={page?.hero?.headline || t('nav.mineralSprings')}
        subtitle={page?.hero?.subheadline || 'Über 40 Mineralquellen, eine Jahrhunderte alte Heiltradition und moderne Spa-Behandlungen'}
        ctaText={t('common.readMore')}
        ctaHref="/mineral-springs"
      />

      <div className="container-wide py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Table of Contents */}
            <nav className="bg-stone-50 rounded-xl p-6 mb-10">
              <h2 className="font-semibold text-stone-800 mb-3">{t('common.tableOfContents')}</h2>
              <ul className="space-y-2 text-sm">
                {toc.map((item: any) => (
                  <li key={item.anchor}>
                    <a href={`#${item.anchor}`} className="text-primary-600 hover:text-primary-800">{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Content: CMS rich text or fallback */}
            {page?.content ? (
              <div className="mb-12">
                <RichTextRenderer data={page.content} />
              </div>
            ) : (
              <>
                <section id="healing-waters" className="prose prose-stone max-w-none mb-12">
                  <h2>Healing Waters Guide</h2>
                  <p>Marienbad (Mariánské Lázně) is home to over 40 mineral springs, each with a unique chemical composition.</p>
                </section>
                <section id="roman-baths" className="prose prose-stone max-w-none mb-12">
                  <h2>Roman Baths</h2>
                  <p>The historic Roman Baths in Nové Lázně (New Spa) are among the most magnificent spa facilities in Central Europe.</p>
                </section>
                <section id="co2-baths" className="prose prose-stone max-w-none mb-12">
                  <h2>CO2 Baths &amp; The Science Behind Them</h2>
                  <p>Carbon dioxide baths are a signature treatment of Marienbad.</p>
                </section>
                <section id="health-conditions" className="prose prose-stone max-w-none mb-12">
                  <h2>Health Conditions</h2>
                  <p>Marienbad spa treatments address a range of health conditions.</p>
                </section>
              </>
            )}

            <section id="faq" className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-primary-900 mb-6">FAQ</h2>
              <FAQAccordion items={faqItems} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <EnsanaCTABox
              headline={ensana?.headline || 'Experience the healing springs'}
              text={ensana?.text || 'Ensana Nové Lázně features the only Royal Roman Bath open to hotel guests. Book directly for the best rate.'}
              url={ensana?.url || 'https://www.ensanahotels.com/nove-lazne'}
              campaign="mineral-springs-pillar"
              position="sidebar"
            />
            <div className="bg-stone-50 rounded-xl p-5">
              <h3 className="font-semibold text-stone-800 mb-4">{t('common.relatedArticles')}</h3>
              <ul className="space-y-3 text-sm">
                {relatedArticles.length > 0 ? (
                  relatedArticles.slice(0, 5).map((article: any) => (
                    <li key={article.slug}>
                      <a href={`/${locale}/mineral-springs/${article.slug}`} className="text-primary-600 hover:text-primary-800 font-medium">
                        {article.title}
                      </a>
                    </li>
                  ))
                ) : (
                  <>
                    <li><a href="#" className="text-primary-600 hover:text-primary-800 font-medium">Roman Baths: A Complete Guide</a></li>
                    <li><a href="#" className="text-primary-600 hover:text-primary-800 font-medium">CO2 Baths: Science &amp; Benefits</a></li>
                    <li><a href="#" className="text-primary-600 hover:text-primary-800 font-medium">Wellness vs. Medical Spa</a></li>
                  </>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
