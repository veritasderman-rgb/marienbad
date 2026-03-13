import { getTranslations } from 'next-intl/server'
import { StoryGrid } from '@/components/people/StoryGrid'
import { ShareYourStory } from '@/components/people/ShareYourStory'
import type { StoryData } from '@/components/people/StoryCard'
import { getPeopleStories } from '@/lib/api'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'people' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

const placeholderStories: StoryData[] = [
  { slug: 'helga-oesterreich-23-mal', name: 'Helga', country: 'Österreich', visitNumber: '23', headline: 'Helga, Österreich. Zum 23. Mal.', pullQuote: '23 Jahre. Jedes Jahr Oktober. Die Kolonnade ist mein zweites Zuhause.', archetype: 'loyal' },
  { slug: 'james-london-first-time', name: 'James', country: 'United Kingdom', visitNumber: '1', headline: 'James, London. First time.', pullQuote: 'I expected old. I found magic. The singing fountain at sunset changed everything.', archetype: 'first-visit' },
  { slug: 'tatyana-moscow-healing', name: 'Татьяна', country: 'Россия', headline: 'Татьяна, Москва. Каждый год.', pullQuote: 'Доктор сказал шесть месяцев. Четыре года назад. Я приезжаю каждый год.', archetype: 'healing' },
  { slug: 'ingrid-hamburg-erinnerung', name: 'Ingrid', country: 'Deutschland', visitNumber: '37', headline: 'Ingrid, Hamburg. Zum 37. Mal.', pullQuote: 'Mein Mann hat mich hierher zum ersten Mal mitgenommen. 1989 war das. Hier fühle ich ihn noch.', archetype: 'love' },
  { slug: 'marie-generace', name: 'Marie', country: 'Česká republika', headline: 'Marie, Praha. Tři generace.', pullQuote: 'Babička přivezla mámu. Máma přivezla mě. A já teď přivážím dceru.', archetype: 'generation' },
  { slug: 'yuki-tokyo-onsen', name: 'Yuki', country: 'Japan', headline: 'Yuki, Tokyo. First visit.', pullQuote: 'In Tokyo we have onsen. Nothing like this. The architecture, the silence, the water.', archetype: 'faraway' },
]

export default async function PeoplePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'people' })

  const cmsStories = await getPeopleStories(locale as any)
  const stories: StoryData[] = cmsStories.length > 0
    ? cmsStories.map((s: any) => ({
        slug: s.slug || s.id,
        name: s.name,
        country: s.country,
        visitNumber: s.visitNumber,
        headline: s.headline,
        pullQuote: s.pullQuote,
        portraitUrl: s.portrait?.url || s.portrait?.sizes?.card?.url,
        archetype: s.archetype,
      }))
    : placeholderStories

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary-950 text-white py-16 md:py-24">
        <div className="container-wide text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="container-wide py-12 md:py-16">
        <StoryGrid stories={stories} />
      </section>

      {/* Share Your Story */}
      <section className="container-narrow py-12 md:py-16">
        <ShareYourStory />
      </section>
    </div>
  )
}
