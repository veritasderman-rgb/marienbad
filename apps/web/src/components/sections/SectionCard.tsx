import { Link } from '@/lib/i18n/navigation'

type Props = {
  title: string
  description: string
  href: string
  gradient?: string
}

export function SectionCard({ title, description, href, gradient = 'from-primary-600 to-primary-800' }: Props) {
  return (
    <Link
      href={href as any}
      className="group relative rounded-2xl overflow-hidden aspect-[4/3] flex flex-col justify-end p-6 md:p-8 transition-transform hover:scale-[1.02]"
    >
      {/* Gradient background (replaced by image when available) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-accent-300 transition-colors">
          {title}
        </h3>
        <p className="text-sm md:text-base text-stone-300 leading-relaxed line-clamp-2">
          {description}
        </p>
        <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-accent-300 group-hover:gap-2 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
