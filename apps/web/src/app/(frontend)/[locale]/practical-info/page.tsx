import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { FAQAccordion } from '@/components/sections/FAQAccordion'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'de' ? 'Praktische Infos für Marienbad' : 'Practical Info for Marienbad',
    description: 'Everything you need to know before visiting Marienbad – getting here, weather, maps, events, and travel tips.',
  }
}

export default function PracticalInfoPage() {
  const t = useTranslations()

  return (
    <>
      <HeroSection
        title={t('nav.practicalInfo')}
        subtitle="Everything you need to plan your visit to Marienbad"
        ctaText={t('common.readMore')}
        ctaHref="/practical-info"
      />

      <div className="container-wide py-12 md:py-20">
        <div className="lg:col-span-2 prose prose-stone max-w-none">
          <h2>Getting Here</h2>
          <p>Content from CMS — by car, train, bus, from Prague/Munich/Nuremberg.</p>

          <h2>Weather & Best Time to Visit</h2>
          <p>Content from CMS — seasonal guide, packing tips.</p>

          <h2>Interactive Map</h2>
          <p>Map component placeholder — Leaflet/Mapbox integration.</p>

          <h2>Events Calendar</h2>
          <p>Events loaded from CMS — Chopin Festival, Singing Fountain season, etc.</p>

          <h2>FAQ</h2>
        </div>
        <div className="max-w-3xl mt-4">
          <FAQAccordion
            items={[
              { question: 'How do I get to Marienbad from Prague?', answer: 'Marienbad is approximately 170 km west of Prague. You can take a direct bus (2.5 hours), drive via D5 motorway (2 hours), or take a train with a change in Plzeň (3 hours).' },
              { question: 'What currency is used?', answer: 'Czech Koruna (CZK). Most hotels and restaurants accept credit cards. ATMs are widely available. Euros are sometimes accepted at tourist spots but at unfavorable rates.' },
              { question: 'Do I need a visa?', answer: 'Czech Republic is part of the EU Schengen zone. EU/EEA citizens need only an ID card. Citizens of many other countries (US, UK, Canada, Australia, Japan) can visit visa-free for up to 90 days.' },
              { question: 'Is Marienbad walkable?', answer: 'Yes, the town center is very walkable. Most attractions, springs, and the colonnade are within a 15-minute walk. The spa parks are perfect for strolling.' },
            ]}
          />
        </div>
      </div>
    </>
  )
}
