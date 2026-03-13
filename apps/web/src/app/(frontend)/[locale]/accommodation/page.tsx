import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { EnsanaCTABox } from '@/components/ensana/EnsanaCTABox'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'de' ? 'Unterkunft in Marienbad' : 'Where to Stay in Marienbad',
    description: 'Find the best hotels and accommodation in Marienbad – from luxury spa hotels to budget-friendly options.',
  }
}

export default function AccommodationPage() {
  const t = useTranslations()

  return (
    <>
      <HeroSection
        title={t('nav.accommodation')}
        subtitle="From historic spa palaces to cozy guesthouses — find your perfect stay"
        ctaText={t('common.readMore')}
        ctaHref="/accommodation"
      />

      <div className="container-wide py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="prose prose-stone max-w-none">
              <h2>Luxury Spa Hotels</h2>
              <p>
                Marienbad is home to some of the most magnificent spa hotels in Europe.
                Content from CMS — includes Ensana and non-Ensana hotels for objectivity.
              </p>

              <h2>Mid-Range Hotels</h2>
              <p>Content from CMS — comfortable hotels with good spa facilities.</p>

              <h2>Budget-Friendly Options</h2>
              <p>Content from CMS — pensions, apartments, and affordable stays.</p>

              <h2>Booking Tips</h2>
              <p>Content from CMS — best time to book, direct booking advantages, seasonal pricing.</p>
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-8">
            <EnsanaCTABox
              headline="Editor's Pick: Ensana Hotels"
              text="Three historic spa hotels in the heart of Marienbad. Direct booking guarantees the best available rate."
              url="https://www.ensanahotels.com/destinations/marianske-lazne"
              campaign="accommodation-pillar"
              position="sidebar"
            />
          </aside>
        </div>
      </div>
    </>
  )
}
