import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const title = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return { title: `${title} | Practical Info | Marienbad.com` }
}

export default async function PracticalInfoArticle({ params }: Props) {
  const { locale, slug } = await params
  const title = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <article>
      <header className="bg-primary-950 text-white py-16 md:py-20">
        <div className="container-narrow">
          <p className="text-accent-400 text-sm font-medium uppercase tracking-wider mb-4">Practical Info</p>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">{title}</h1>
        </div>
      </header>
      <div className="container-wide py-12 md:py-16">
        <div className="prose prose-stone prose-lg max-w-none">
          <p className="lead">Article content loaded from Payload CMS.</p>
        </div>
      </div>
    </article>
  )
}
