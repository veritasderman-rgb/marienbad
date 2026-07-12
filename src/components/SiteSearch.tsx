import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface SearchEntry {
  title: string
  url: string
  excerpt: string
  type: 'article' | 'story' | 'page'
}

interface Translations {
  open: string
  placeholder: string
  noResults: string
  close: string
  typeArticle: string
  typeStory: string
  typePage: string
}

interface SiteSearchProps {
  locale: string
  translations: Translations
}

/** Case- and diacritics-insensitive normalization for matching. NFKD (not NFD)
 *  so compatibility characters decompose too — e.g. the subscript in "CO₂"
 *  becomes "2", letting the ASCII query "co2" match CO₂ therapy content. */
function normalize(s: string): string {
  return s.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

function scoreEntry(entry: SearchEntry, query: string): number {
  const title = normalize(entry.title)
  if (title.startsWith(query)) return 3
  if (title.includes(query)) return 2
  if (normalize(entry.excerpt).includes(query)) return 1
  return 0
}

export default function SiteSearch({ locale, translations }: SiteSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<SearchEntry[] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fetchStarted = useRef(false)

  // Fetch the index once, on first open
  useEffect(() => {
    if (!open || fetchStarted.current) return
    fetchStarted.current = true
    fetch(`/api/search-index?locale=${locale}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SearchEntry[]) => setIndex(Array.isArray(data) ? data : []))
      .catch(() => {
        setIndex([])
        fetchStarted.current = false
      })
  }, [open, locale])

  // Autofocus + body scroll lock while the overlay is open
  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const results = useMemo(() => {
    const q = normalize(query.trim())
    if (!q || !index) return []
    return index
      .map((entry) => ({ entry, score: scoreEntry(entry, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, 10)
      .map(({ entry }) => entry)
  }, [index, query])

  const typeLabels: Record<SearchEntry['type'], string> = {
    article: translations.typeArticle,
    story: translations.typeStory,
    page: translations.typePage,
  }

  const close = () => {
    setOpen(false)
    setQuery('')
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault()
      window.location.href = results[0].url
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={translations.open}
        className="p-2 text-white/80 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
        </svg>
      </button>

      {/* Portal to <body>: the sticky header uses backdrop-filter, which would
          otherwise turn it into the containing block for this fixed overlay */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[70] bg-indigo-900/90 backdrop-blur-sm overflow-y-auto p-4 pt-[10vh]"
          role="dialog"
          aria-modal="true"
          aria-label={translations.open}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div className="w-full max-w-2xl mx-auto bg-white rounded-xl border border-beige-300 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-beige-200">
              <svg className="w-5 h-5 shrink-0 text-turquoise-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={translations.placeholder}
                aria-label={translations.open}
                className="flex-1 text-base md:text-lg text-indigo-700 placeholder:text-beige-500 bg-transparent outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={close}
                aria-label={translations.close}
                className="p-1.5 text-beige-500 hover:text-indigo-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {query.trim() && (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length > 0 ? (
                  <ul className="flex flex-col gap-1">
                    {results.map((result) => (
                      <li key={result.url}>
                        <a
                          href={result.url}
                          className="group flex items-start justify-between gap-3 px-4 py-3 rounded-xl border border-transparent hover:border-turquoise-300 hover:bg-beige-100 transition-colors"
                        >
                          <span className="min-w-0">
                            <span className="block font-semibold text-indigo-700 group-hover:text-turquoise-700 transition-colors">
                              {result.title}
                            </span>
                            {result.excerpt && (
                              <span className="block text-sm text-beige-700 truncate">{result.excerpt}</span>
                            )}
                          </span>
                          <span className="shrink-0 mt-0.5 px-2 py-0.5 bg-turquoise-100 text-turquoise-700 text-xs font-medium rounded-full">
                            {typeLabels[result.type]}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  index !== null && (
                    <p className="px-4 py-8 text-center text-beige-600">{translations.noResults}</p>
                  )
                )}
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
