import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { SectionCard } from '@/components/sections/SectionCard'
import { PeopleCarousel } from '@/components/people/PeopleCarousel'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: `${t('siteName')} — ${t('tagline')}`,
    description: t('description'),
  }
}

export default function HomePage() {
  const t = useTranslations('home')
  const tNav = useTranslations('nav')

  const sections = [
    {
      title: t('sections.springs'),
      description: t('sections.springsDesc'),
      href: '/mineral-springs' as const,
      image: '/images/springs-placeholder.jpg',
      gradient: 'from-primary-600 to-primary-800',
    },
    {
      title: t('sections.thingsToDo'),
      description: t('sections.thingsToDoDesc'),
      href: '/things-to-do' as const,
      image: '/images/things-placeholder.jpg',
      gradient: 'from-accent-600 to-accent-800',
    },
    {
      title: t('sections.accommodation'),
      description: t('sections.accommodationDesc'),
      href: '/accommodation' as const,
      image: '/images/accommodation-placeholder.jpg',
      gradient: 'from-stone-600 to-stone-800',
    },
    {
      title: t('sections.history'),
      description: t('sections.historyDesc'),
      href: '/history' as const,
      image: '/images/history-placeholder.jpg',
      gradient: 'from-primary-700 to-primary-950',
    },
    {
      title: t('sections.people'),
      description: t('sections.peopleDesc'),
      href: '/people' as const,
      image: '/images/people-placeholder.jpg',
      gradient: 'from-accent-700 to-accent-950',
    },
  ]

  return (
    <>
      <HeroSection
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        ctaText={t('heroCta')}
        ctaHref="/mineral-springs"
      />

      {/* Section Cards Grid */}
      <section className="container-wide py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sections.map((section) => (
            <SectionCard
              key={section.href}
              title={section.title}
              description={section.description}
              href={section.href}
              gradient={section.gradient}
            />
          ))}
        </div>
      </section>

      {/* People of Colonnade Preview */}
      <section className="bg-primary-950 text-white py-16 md:py-24">
        <div className="container-wide">
          <PeopleCarousel />
        </div>
      </section>
    </>
  )
}
