type Props = {
  title: string
  children: React.ReactNode
  variant?: 'info' | 'tip' | 'warning'
  icon?: React.ReactNode
}

const variants = {
  info: 'bg-primary-50 border-primary-200 text-primary-900',
  tip: 'bg-accent-50 border-accent-200 text-accent-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
}

const defaultIcons = {
  info: (
    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  tip: (
    <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
}

export function InfoBox({ title, children, variant = 'info', icon }: Props) {
  return (
    <div className={`rounded-xl border p-5 md:p-6 my-6 ${variants[variant]}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon || defaultIcons[variant]}</span>
        <div>
          <h4 className="font-semibold text-base mb-2">{title}</h4>
          <div className="text-sm leading-relaxed opacity-90">{children}</div>
        </div>
      </div>
    </div>
  )
}
