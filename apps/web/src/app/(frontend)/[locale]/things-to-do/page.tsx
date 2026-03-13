import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { FAQAccordion } from '@/components/sections/FAQAccordion'
import { EnsanaCTABox } from '@/components/ensana/EnsanaCTABox'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'de' ? 'Unternehmungen in Marienbad' : 'Things to Do in Marienbad',
    description: 'Discover the best activities, sights and experiences in Marienbad – from the Singing Fountain to the Royal Golf Club.',
  }
}

export default function ThingsToDoPage() {
  const t = useTranslations()

  return (
    <>
      <HeroSection
        title={t('nav.thingsToDo')}
        subtitle="From the iconic Singing Fountain to world-class golf — discover what makes Marienbad unforgettable"
        ctaText={t('common.readMore')}
        ctaHref="/things-to-do"
      />

      <div className="container-wide py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <nav className="bg-stone-50 rounded-xl p-6 mb-10">
              <h2 className="font-semibold text-stone-800 mb-3">{t('common.tableOfContents')}</h2>
              <ul className="space-y-2 text-sm">
                <li><a href="#singing-fountain" className="text-primary-600 hover:text-primary-800">Singing Fountain</a></li>
                <li><a href="#colonnade" className="text-primary-600 hover:text-primary-800">Colonnade Walk</a></li>
                <li><a href="#golf" className="text-primary-600 hover:text-primary-800">Royal Golf Club</a></li>
                <li><a href="#day-trips" className="text-primary-600 hover:text-primary-800">Day Trips</a></li>
                <li><a href="#seasonal" className="text-primary-600 hover:text-primary-800">Seasonal Activities</a></li>
              </ul>
            </nav>

            <section id="singing-fountain" className="prose prose-stone max-w-none mb-12">
              <h2>The Singing Fountain</h2>
              <p>Content will be loaded from Payload CMS. The Singing Fountain (Zpívající fontána) is one of Marienbad&apos;s most iconic attractions.</p>
            </section>

            <section id="colonnade" className="prose prose-stone max-w-none mb-12">
              <h2>Colonnade Walk</h2>
              <p>Content from CMS — the main colonnade and its history.</p>
            </section>

            <section id="golf" className="prose prose-stone max-w-none mb-12">
              <h2>Royal Golf Club</h2>
              <p>Content from CMS — oldest golf course in Czech Republic, founded 1905.</p>
            </section>

            <section id="day-trips" className="prose prose-stone max-w-none mb-12">
              <h2>Day Trips from Marienbad</h2>
              <p>Content from CMS — Karlovy Vary, Plzeň, Loket Castle, etc.</p>
            </section>

            <section id="seasonal" className="prose prose-stone max-w-none mb-12">
              <h2>Seasonal Activities</h2>
              <p>Content from CMS — what to do in spring, summer, autumn, winter.</p>
            </section>

            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-primary-900 mb-6">FAQ</h2>
              <FAQAccordion
                items={[
                  { question: 'When does the Singing Fountain perform?', answer: 'The fountain performs every odd hour from May to October, with special illuminated shows in the evening.' },
                  { question: 'Is Marienbad good for families?', answer: 'Absolutely. Parks, the miniature golf, swimming pools, and family-friendly restaurants make it great for families.' },
                  { question: 'Can I play golf in Marienbad?', answer: 'Yes, the Royal Golf Club Mariánské Lázně is the oldest golf course in Czech Republic, offering 18 holes in a stunning natural setting.' },
                ]}
              />
            </section>
          </div>

          <aside className="lg:col-span-1 space-y-8">
            <EnsanaCTABox
              headline="Your base for exploring"
              text="Ensana hotels are perfectly located for all of Marienbad's attractions. The terrace at Hotel Hvězda offers the best views of the Singing Fountain."
              url="https://www.ensanahotels.com/hvezda"
              campaign="things-to-do-pillar"
              position="sidebar"
            />
          </aside>
        </div>
      </div>
    </>
  )
}
