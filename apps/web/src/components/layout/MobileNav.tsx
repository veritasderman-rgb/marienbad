'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

type NavItem = {
  label: string
  href: string
}

type Props = {
  open: boolean
  onClose: () => void
  items: NavItem[]
}

export function MobileNav({ open, onClose, items }: Props) {
  const t = useTranslations('nav')

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <span className="font-heading text-xl font-bold text-primary-800">
            Marienbad<span className="text-accent-500">.com</span>
          </span>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-700 rounded-lg"
            aria-label={t('close')}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href as any}
              onClick={onClose}
              className="block px-4 py-3 text-lg font-medium text-stone-700 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
