import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { locales } from '@/lib/i18n/config'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '@/styles/globals.css'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: {
      default: `${t('siteName')} — ${t('tagline')}`,
      template: `%s | ${t('siteName')}`,
    },
    description: t('description'),
    metadataBase: new URL('https://marienbad.com'),
    alternates: {
      canonical: `https://marienbad.com/${locale}`,
      languages: {
        de: 'https://marienbad.com/de',
        en: 'https://marienbad.com/en',
        ru: 'https://marienbad.com/ru',
        cs: 'https://marienbad.com/cs',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'de' ? 'de_DE' : locale === 'cs' ? 'cs_CZ' : locale === 'ru' ? 'ru_RU' : 'en_GB',
      siteName: t('siteName'),
    },
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900 antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
