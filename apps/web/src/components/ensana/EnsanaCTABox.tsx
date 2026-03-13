import { useTranslations } from 'next-intl'

type Props = {
  headline?: string
  text?: string
  url: string
  campaign: string
  position?: 'sidebar' | 'inline' | 'bottom'
}

function buildEnsanaUrl(url: string, campaign: string, position: string) {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}utm_source=marienbad.com&utm_medium=referral&utm_campaign=${encodeURIComponent(campaign)}&utm_content=${position}`
}

export function EnsanaCTABox({ headline, text, url, campaign, position = 'sidebar' }: Props) {
  const t = useTranslations('ensana')
  const trackedUrl = buildEnsanaUrl(url, campaign, position)

  const positionClasses = {
    sidebar: 'rounded-xl border border-accent-200 bg-accent-50 p-5',
    inline: 'rounded-xl border border-accent-200 bg-accent-50 p-6 my-8',
    bottom: 'rounded-xl bg-gradient-to-r from-primary-800 to-primary-900 text-white p-8 mt-12',
  }

  const isBottom = position === 'bottom'

  return (
    <aside className={positionClasses[position]} aria-label="Ensana recommendation">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-medium uppercase tracking-wider ${isBottom ? 'text-accent-300' : 'text-accent-600'}`}>
          {t('editorsChoice')}
        </span>
      </div>
      <h4 className={`font-heading text-lg font-bold mb-2 ${isBottom ? 'text-white' : 'text-stone-900'}`}>
        {headline || t('ctaTitle')}
      </h4>
      <p className={`text-sm leading-relaxed mb-4 ${isBottom ? 'text-stone-300' : 'text-stone-600'}`}>
        {text || t('ctaText')}
      </p>
      <a
        href={trackedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
          isBottom
            ? 'bg-accent-500 hover:bg-accent-400 text-white'
            : 'bg-accent-600 hover:bg-accent-500 text-white'
        }`}
      >
        {t('ctaButton')}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </aside>
  )
}
