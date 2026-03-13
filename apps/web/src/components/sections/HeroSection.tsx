import { Link } from '@/lib/i18n/navigation'

type Props = {
  title: string
  subtitle: string
  ctaText: string
  ctaHref: string
  backgroundImage?: string
}

export function HeroSection({ title, subtitle, ctaText, ctaHref, backgroundImage }: Props) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        {/* Decorative overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-primary-950/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <Link
          href={ctaHref as any}
          className="inline-flex items-center gap-2 px-8 py-4 bg-accent-600 hover:bg-accent-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-accent-600/25 text-lg"
        >
          {ctaText}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
