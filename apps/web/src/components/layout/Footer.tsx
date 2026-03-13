'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary-950 text-stone-300">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="lg:col-span-1">
            <h3 className="font-heading text-xl font-bold text-white mb-3">
              Marienbad<span className="text-accent-400">.com</span>
            </h3>
            <p className="text-sm leading-relaxed text-stone-400">
              {t('aboutText')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2.5">
              {[
                { label: tNav('mineralSprings'), href: '/mineral-springs' as const },
                { label: tNav('thingsToDo'), href: '/things-to-do' as const },
                { label: tNav('accommodation'), href: '/accommodation' as const },
                { label: tNav('history'), href: '/history' as const },
                { label: tNav('practicalInfo'), href: '/practical-info' as const },
                { label: tNav('people'), href: '/people' as const },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-accent-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-4">{t('newsletter')}</h4>
            <p className="text-sm text-stone-400 mb-4">{t('newsletterText')}</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                className="flex-1 px-4 py-2.5 bg-primary-900 border border-primary-800 rounded-lg text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-accent-600 hover:bg-accent-500 text-white font-medium rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-primary-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-500">
            {t('copyright', { year })}
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
              {t('privacy')}
            </a>
            <a href="/imprint" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
              {t('imprint')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
