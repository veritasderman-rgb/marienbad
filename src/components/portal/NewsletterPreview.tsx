import { useState } from 'react'

type PreviewMode = 'desktop' | 'mobile' | 'plain'

interface NewsletterPreviewProps {
  html: string
  plain: string | null
}

const MODES: { value: PreviewMode; label: string }[] = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobil' },
  { value: 'plain', label: 'Prostý text' },
]

const WIDTH_BY_MODE: Record<'desktop' | 'mobile', number> = {
  desktop: 650,
  mobile: 375,
}

/**
 * Bezpečnostní požadavek N-02: sandbox iframe musí zůstat prázdný string —
 * žádné allow-scripts, žádné allow-same-origin. Nesmí se změkčovat.
 */
export default function NewsletterPreview({ html, plain }: NewsletterPreviewProps) {
  const [mode, setMode] = useState<PreviewMode>('desktop')

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Šířka náhledu">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            aria-pressed={mode === m.value}
            className={
              'rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ' +
              (mode === m.value ? 'bg-[#004F71] text-white' : 'border border-beige-400 text-[#5F6B72] hover:bg-beige-100')
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'plain' ? (
        <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap rounded-lg border border-beige-400 bg-beige-100 p-4 text-sm text-[#1C2B33]">
          {plain || '(newsletter nemá verzi v prostém textu)'}
        </pre>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-beige-400 bg-beige-100 p-4">
          <iframe
            sandbox=""
            srcDoc={html}
            title="Náhled newsletteru"
            style={{ width: WIDTH_BY_MODE[mode], maxWidth: '100%', height: 600, border: 'none', background: '#fff' }}
            className="mx-auto block rounded-md shadow-sm"
          />
        </div>
      )}
    </div>
  )
}
