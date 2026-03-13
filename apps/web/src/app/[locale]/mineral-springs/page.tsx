import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { FAQAccordion } from '@/components/sections/FAQAccordion'
import { EnsanaCTABox } from '@/components/ensana/EnsanaCTABox'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'de' ? 'Mineralquellen & Spa in Marienbad' : 'Mineral Springs & Spa in Marienbad',
    description:
      locale === 'de'
        ? 'Entdecken Sie die heilenden Mineralquellen von Marienbad. Über 40 Quellen, CO2-Bäder, Römische Bäder und moderne Spa-Behandlungen.'
        : 'Discover the healing mineral springs of Marienbad. Over 40 springs, CO2 baths, Roman baths and modern spa treatments.',
  }
}

export default function MineralSpringsPage() {
  const t = useTranslations()

  // TODO: Load from Payload CMS
  const faqItems = [
    {
      question: 'How many mineral springs are there in Marienbad?',
      answer: 'Marienbad has over 40 mineral springs, each with unique mineral composition and healing properties. The most famous include the Cross Spring (Kreuzquelle), Ferdinand Spring, and Forest Spring.',
    },
    {
      question: 'What health conditions can be treated?',
      answer: 'Marienbad spa treatments are traditionally used for digestive disorders, metabolic diseases, respiratory conditions, kidney and urinary tract issues, and musculoskeletal problems.',
    },
    {
      question: 'Do I need a prescription for spa treatments?',
      answer: 'While some therapeutic spa treatments require a doctor\'s recommendation, many wellness treatments, mineral baths, and spring drinking cures are available to all visitors.',
    },
    {
      question: 'What are CO2 baths?',
      answer: 'CO2 (carbon dioxide) baths are a signature Marienbad treatment. Natural CO2 gas is dissolved in mineral water, improving blood circulation, reducing blood pressure, and promoting relaxation.',
    },
  ]

  return (
    <>
      <HeroSection
        title={t('nav.mineralSprings')}
        subtitle={
          'Über 40 Mineralquellen, eine Jahrhunderte alte Heiltradition und moderne Spa-Behandlungen'
        }
        ctaText={t('common.readMore')}
        ctaHref="/mineral-springs"
      />

      <div className="container-wide py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Table of Contents */}
            <nav className="bg-stone-50 rounded-xl p-6 mb-10">
              <h2 className="font-semibold text-stone-800 mb-3">{t('common.tableOfContents')}</h2>
              <ul className="space-y-2 text-sm">
                <li><a href="#healing-waters" className="text-primary-600 hover:text-primary-800">Healing Waters Guide</a></li>
                <li><a href="#roman-baths" className="text-primary-600 hover:text-primary-800">Roman Baths</a></li>
                <li><a href="#co2-baths" className="text-primary-600 hover:text-primary-800">CO2 Baths & Science</a></li>
                <li><a href="#health-conditions" className="text-primary-600 hover:text-primary-800">Health Conditions</a></li>
                <li><a href="#faq" className="text-primary-600 hover:text-primary-800">FAQ</a></li>
              </ul>
            </nav>

            {/* Content sections — will be replaced by CMS rich text */}
            <section id="healing-waters" className="prose prose-stone max-w-none mb-12">
              <h2>Healing Waters Guide</h2>
              <p>
                Marienbad (Mariánské Lázně) is home to over 40 mineral springs, each with a unique
                chemical composition. The springs emerge from deep underground, enriched with minerals
                accumulated over thousands of years. This content will be managed through Payload CMS.
              </p>
            </section>

            <section id="roman-baths" className="prose prose-stone max-w-none mb-12">
              <h2>Roman Baths</h2>
              <p>
                The historic Roman Baths in Nové Lázně (New Spa) are among the most magnificent
                spa facilities in Central Europe. Content from CMS.
              </p>
            </section>

            <section id="co2-baths" className="prose prose-stone max-w-none mb-12">
              <h2>CO2 Baths & The Science Behind Them</h2>
              <p>
                Carbon dioxide baths are a signature treatment of Marienbad. Content from CMS.
              </p>
            </section>

            <section id="health-conditions" className="prose prose-stone max-w-none mb-12">
              <h2>Health Conditions</h2>
              <p>
                Marienbad spa treatments address a range of health conditions. Content from CMS.
              </p>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-primary-900 mb-6">FAQ</h2>
              <FAQAccordion items={faqItems} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <EnsanaCTABox
              headline="Experience the healing springs"
              text="Ensana Nové Lázně features the only Royal Roman Bath open to hotel guests. Book directly for the best rate."
              url="https://www.ensanahotels.com/nove-lazne"
              campaign="mineral-springs-pillar"
              position="sidebar"
            />

            {/* Related articles */}
            <div className="bg-stone-50 rounded-xl p-5">
              <h3 className="font-semibold text-stone-800 mb-4">{t('common.relatedArticles')}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800 font-medium">
                    Roman Baths: A Complete Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800 font-medium">
                    CO2 Baths: Science & Benefits
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800 font-medium">
                    Wellness vs. Medical Spa
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
