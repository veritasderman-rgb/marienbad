'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileNav } from './MobileNav'

const navItems = [
  { key: 'mineralSprings', href: '/mineral-springs' as const },
  { key: 'thingsToDo', href: '/things-to-do' as const },
  { key: 'accommodation', href: '/accommodation' as const },
  { key: 'history', href: '/history' as const },
  { key: 'practicalInfo', href: '/practical-info' as const },
  { key: 'people', href: '/people' as const },
  { key: 'magazine', href: '/magazine' as const },
] as const

export function Header() {
  const t = useTranslations('nav')
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-heading text-xl md:text-2xl font-bold text-primary-800">
              Marienbad
            </span>
            <span className="text-accent-500 text-lg">.com</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-stone-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg"
              aria-label={t('menu')}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={navItems.map((item) => ({
          label: t(item.key),
          href: item.href,
        }))}
      />
    </header>
  )
}
