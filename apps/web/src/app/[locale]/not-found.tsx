import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('common')

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="font-heading text-6xl font-bold text-primary-800 mb-4">404</h1>
        <p className="text-xl text-stone-600 mb-8">{t('notFound')}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          {t('backTo', { page: 'Home' })}
        </Link>
      </div>
    </div>
  )
}
