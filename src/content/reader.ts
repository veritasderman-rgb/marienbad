import Markdoc from '@markdoc/markdoc'
import yaml from 'js-yaml'
import { routes, quizTermsSlugs, type Locale } from '@/i18n/config'
import { markdocConfig } from '@/markdoc/config'

// Homepage JSON imports (bundled at build time)
import homepageDe from './homepage/de.json'
import homepageEn from './homepage/en.json'
import homepageCs from './homepage/cs.json'
import homepageRu from './homepage/ru.json'
import itinerariesData from './itineraries/data.json'
import hotelGalleriesData from './hotel-galleries/data.json'

const homepages: Record<Locale, typeof homepageDe> = {
  de: homepageDe,
  en: homepageEn,
  cs: homepageCs,
  ru: homepageRu,
}

export async function getHomepage(locale: Locale) {
  const data = homepages[locale]
  if (!data) throw new Error(`Homepage content not found for locale: ${locale}`)
  return data
}

export function getItineraries() {
  return itinerariesData
}

export interface HotelGalleryImage {
  image: string | null
  alt: string
}

export interface HotelGallery {
  slug: string
  images: HotelGalleryImage[]
}

export function getHotelGalleries(): HotelGallery[] {
  return (hotelGalleriesData as any).hotels ?? []
}

export function getHotelGallery(slug: string): HotelGalleryImage[] {
  const gallery = getHotelGalleries().find((h) => h.slug === slug)
  return gallery?.images?.filter((img) => img.image) ?? []
}

/** Split YAML frontmatter from markdoc body in a single .mdoc file */
function splitFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }
  return {
    meta: (yaml.load(match[1]) as Record<string, string>) ?? {},
    body: match[2] ?? '',
  }
}

// Import all content as single index.mdoc files with YAML frontmatter
const pageMdocFiles = import.meta.glob('./pages/*/index.mdoc', { query: '?raw', import: 'default', eager: true })
const articleMdocFiles = import.meta.glob('./articles/*/index.mdoc', { query: '?raw', import: 'default', eager: true })
const storyMdocFiles = import.meta.glob('./stories/*/index.mdoc', { query: '?raw', import: 'default', eager: true })

export async function getPage(slug: string) {
  try {
    const mdocPath = `./pages/${slug}/index.mdoc`
    const raw = pageMdocFiles[mdocPath]
    if (!raw) return null

    const { meta, body: rawBody } = splitFrontmatter(raw as string)
    const ast = Markdoc.parse(rawBody)
    const content = Markdoc.transform(ast, { ...markdocConfig, variables: { locale: meta.locale ?? '' } })

    return {
      title: meta.title ?? '',
      locale: meta.locale ?? '',
      section: meta.section ?? '',
      metaTitle: meta.metaTitle ?? '',
      metaDescription: meta.metaDescription ?? '',
      pullQuote: meta.pullQuote ?? '',
      body: content,
      rawBody,
    }
  } catch {
    return null
  }
}

/** Strip markdown links and bold markers so FAQ schema/UI text stays plain */
function cleanFaqText(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Extract FAQ Q&A pairs from raw Markdoc content for FAQPage schema.
 *  Questions are either `### Heading` lines (pillar pages) or standalone
 *  `**bold**` lines (magazine articles) inside the FAQ section. */
export function extractFaqs(rawBody: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []
  const lines = rawBody.split('\n')
  let inFaqSection = false
  let currentQuestion = ''
  let currentAnswer: string[] = []

  for (const line of lines) {
    // Detect FAQ section heading (## level)
    if (/^##\s+.*(FAQ|[Čč]asto|[Hh]äufig|[Ff]requently|[Чч]асто)/i.test(line)) {
      inFaqSection = true
      continue
    }
    // If we hit another ## heading, stop collecting
    if (inFaqSection && /^##\s+/.test(line) && !/^###/.test(line)) {
      if (currentQuestion && currentAnswer.length) {
        faqs.push({ question: currentQuestion, answer: currentAnswer.join(' ').trim() })
      }
      inFaqSection = false
      continue
    }
    if (!inFaqSection) continue

    // A horizontal rule ends the FAQ section (used before closing disclaimers)
    if (/^-{3,}\s*$/.test(line)) {
      if (currentQuestion && currentAnswer.length) {
        faqs.push({ question: currentQuestion, answer: cleanFaqText(currentAnswer.join(' ')) })
      }
      inFaqSection = false
      currentQuestion = ''
      currentAnswer = []
      continue
    }

    // `### Heading` or a standalone `**bold**` line is a question
    if (/^###\s+/.test(line) || /^\*\*[^*]+\*\*\s*$/.test(line.trim())) {
      if (currentQuestion && currentAnswer.length) {
        faqs.push({ question: currentQuestion, answer: cleanFaqText(currentAnswer.join(' ')) })
      }
      currentQuestion = cleanFaqText(line.replace(/^###\s+/, ''))
      currentAnswer = []
    } else if (line.trim() && currentQuestion) {
      currentAnswer.push(line.trim())
    }
  }
  // Don't forget the last one
  if (currentQuestion && currentAnswer.length) {
    faqs.push({ question: currentQuestion, answer: cleanFaqText(currentAnswer.join(' ')) })
  }
  return faqs
}

export interface Article {
  slug: string
  title: string
  locale: string
  category: string
  status: 'draft' | 'published'
  pullQuote?: string
  excerpt: string
  date: string
  readingTime: string
  coverImage?: string
  youtubeVideoId?: string
  youtubeTitle?: string
  youtubeDescription?: string
  body: any
  rawBody: string
}

/** Validate required article fields; logs warnings for missing data */
function validateArticleMeta(slug: string, meta: Record<string, string>): string[] {
  const warnings: string[] = []
  if (!meta.title) warnings.push(`Article "${slug}": missing title`)
  if (!meta.locale) warnings.push(`Article "${slug}": missing locale`)
  if (!meta.excerpt) warnings.push(`Article "${slug}": missing excerpt`)
  if (!meta.date) warnings.push(`Article "${slug}": missing date`)
  if (!meta.category) warnings.push(`Article "${slug}": missing category`)
  if (meta.date && !/^\d{4}-\d{2}-\d{2}/.test(meta.date)) {
    warnings.push(`Article "${slug}": invalid date format "${meta.date}" (expected YYYY-MM-DD)`)
  }
  return warnings
}

/** Validate required story fields; logs warnings for missing data */
function validateStoryMeta(slug: string, meta: Record<string, string>): string[] {
  const warnings: string[] = []
  if (!meta.title) warnings.push(`Story "${slug}": missing title`)
  if (!meta.locale) warnings.push(`Story "${slug}": missing locale`)
  if (!meta.name) warnings.push(`Story "${slug}": missing person name`)
  if (!meta.quote) warnings.push(`Story "${slug}": missing quote`)
  return warnings
}

function parseArticle(slug: string, raw: string): Article | null {
  const { meta, body: rawBody } = splitFrontmatter(raw)
  if (!rawBody) return null

  const ast = Markdoc.parse(rawBody)
  const content = Markdoc.transform(ast, { ...markdocConfig, variables: { locale: meta.locale ?? '' } })

  return {
    slug,
    title: meta.title ?? '',
    locale: meta.locale ?? '',
    category: meta.category ?? '',
    status: (meta.status as 'draft' | 'published') ?? 'published',
    pullQuote: meta.pullQuote ?? '',
    excerpt: meta.excerpt ?? '',
    date: meta.date ?? '',
    readingTime: meta.readingTime ?? '',
    coverImage: meta.coverImage ?? '',
    youtubeVideoId: meta.youtubeVideoId ?? '',
    youtubeTitle: meta.youtubeTitle ?? '',
    youtubeDescription: meta.youtubeDescription ?? '',
    body: content,
    rawBody,
  }
}

export async function getArticles(locale: Locale): Promise<Article[]> {
  const articles: Article[] = []

  for (const [path, raw] of Object.entries(articleMdocFiles)) {
    const slug = path.replace('./articles/', '').replace('/index.mdoc', '')
    const { meta } = splitFrontmatter(raw as string)

    if (meta.locale !== locale) continue
    if (meta.status === 'draft') continue

    const warnings = validateArticleMeta(slug, meta)
    if (warnings.length) console.warn('[content]', warnings.join('; '))

    const article = parseArticle(slug, raw as string)
    if (article) articles.push(article)
  }

  articles.sort((a, b) => b.date.localeCompare(a.date))
  return articles
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const mdocPath = `./articles/${slug}/index.mdoc`
    const raw = articleMdocFiles[mdocPath]
    if (!raw) return null

    const { meta } = splitFrontmatter(raw as string)
    const warnings = validateArticleMeta(slug, meta)
    if (warnings.length) console.warn('[content]', warnings.join('; '))

    return parseArticle(slug, raw as string)
  } catch {
    return null
  }
}

export interface Story {
  slug: string
  title: string
  locale: string
  status: 'draft' | 'published'
  name: string
  location: string
  visitLabel: string
  quote: string
  lang: string
  portrait?: string
  body: any
}

function parseStory(slug: string, raw: string): Story | null {
  const { meta, body: rawBody } = splitFrontmatter(raw)
  if (!rawBody) return null

  const ast = Markdoc.parse(rawBody)
  const content = Markdoc.transform(ast, { ...markdocConfig, variables: { locale: meta.locale ?? '' } })

  return {
    slug,
    title: meta.title ?? '',
    locale: meta.locale ?? '',
    status: (meta.status as 'draft' | 'published') ?? 'published',
    name: meta.name ?? '',
    location: meta.location ?? '',
    visitLabel: meta.visitLabel ?? '',
    quote: meta.quote ?? '',
    lang: meta.lang ?? '',
    portrait: meta.portrait ?? '',
    body: content,
  }
}

export async function getStories(locale: Locale): Promise<Story[]> {
  const stories: Story[] = []

  for (const [path, raw] of Object.entries(storyMdocFiles)) {
    const slug = path.replace('./stories/', '').replace('/index.mdoc', '')
    const { meta } = splitFrontmatter(raw as string)

    if (meta.locale !== locale) continue
    if (meta.status === 'draft') continue

    const warnings = validateStoryMeta(slug, meta)
    if (warnings.length) console.warn('[content]', warnings.join('; '))

    const story = parseStory(slug, raw as string)
    if (story) stories.push(story)
  }

  return stories
}

export async function getAllStories(): Promise<Story[]> {
  const stories: Story[] = []

  for (const [path, raw] of Object.entries(storyMdocFiles)) {
    const slug = path.replace('./stories/', '').replace('/index.mdoc', '')
    const { meta } = splitFrontmatter(raw as string)

    if (meta.status === 'draft') continue

    const story = parseStory(slug, raw as string)
    if (story) stories.push(story)
  }

  return stories
}

export async function getStory(slug: string): Promise<Story | null> {
  try {
    const mdocPath = `./stories/${slug}/index.mdoc`
    const raw = storyMdocFiles[mdocPath]
    if (!raw) return null

    const { meta } = splitFrontmatter(raw as string)
    const warnings = validateStoryMeta(slug, meta)
    if (warnings.length) console.warn('[content]', warnings.join('; '))

    return parseStory(slug, raw as string)
  } catch {
    return null
  }
}

export async function getAllArticles(): Promise<Article[]> {
  const articles: Article[] = []

  for (const [path, raw] of Object.entries(articleMdocFiles)) {
    const slug = path.replace('./articles/', '').replace('/index.mdoc', '')
    const { meta } = splitFrontmatter(raw as string)

    if (meta.status === 'draft') continue

    const article = parseArticle(slug, raw as string)
    if (article) articles.push(article)
  }

  articles.sort((a, b) => b.date.localeCompare(a.date))
  return articles
}

// ---------------------------------------------------------------------------
// Quizzes (event competitions) — src/content/quizzes/<quizId>/<locale>.json
// ---------------------------------------------------------------------------

export interface QuizOption {
  id: string
  text: string
  correct?: boolean
}

export interface QuizQuestion {
  id: string
  type: 'single' | 'open'
  text: string
  options?: QuizOption[]
  explanation?: string
  placeholder?: string
  maxLength?: number
}

export interface QuizResultBand {
  minPercent: number
  title: string
  message: string
}

export interface Quiz {
  /** Canonical quiz id (folder name), identical across locales */
  quizId: string
  locale: Locale
  /** Localized URL slug */
  slug: string
  title: string
  metaDescription: string
  active: boolean
  intro: { badge: string; text: string; prize: string; drawNote: string; startLabel: string }
  questions: QuizQuestion[]
  results: QuizResultBand[]
  /** Competition terms page content (page is not rendered when absent) */
  terms?: { heading: string; body: string }
  emailGate: { heading: string; text: string; consentLabel: string; successTitle: string; successText: string }
}

const quizFiles = import.meta.glob('./quizzes/*/*.json', { eager: true })

function parseQuizPath(path: string): { quizId: string; locale: Locale } | null {
  const m = path.match(/^\.\/quizzes\/([^/]+)\/(de|en|cs|ru)\.json$/)
  if (!m) return null
  return { quizId: m[1], locale: m[2] as Locale }
}

function toQuiz(path: string, mod: unknown): Quiz | null {
  const parsed = parseQuizPath(path)
  if (!parsed) return null
  const data = (mod as { default?: Record<string, unknown> }).default ?? mod
  return { quizId: parsed.quizId, locale: parsed.locale, ...(data as Omit<Quiz, 'quizId' | 'locale'>) }
}

/** All quiz locale variants (one Quiz per existing locale file) */
export function getAllQuizzes(): Quiz[] {
  const quizzes: Quiz[] = []
  for (const [path, mod] of Object.entries(quizFiles)) {
    const quiz = toQuiz(path, mod)
    if (quiz) quizzes.push(quiz)
  }
  return quizzes
}

/** Find a quiz by its localized slug for the given locale */
export function getQuizBySlug(locale: Locale, slug: string): Quiz | null {
  for (const [path, mod] of Object.entries(quizFiles)) {
    const quiz = toQuiz(path, mod)
    if (quiz && quiz.locale === locale && quiz.slug === slug) return quiz
  }
  return null
}

/** Find a quiz by canonical id and locale */
export function getQuiz(quizId: string, locale: Locale): Quiz | null {
  for (const [path, mod] of Object.entries(quizFiles)) {
    const quiz = toQuiz(path, mod)
    if (quiz && quiz.locale === locale && quiz.quizId === quizId) return quiz
  }
  return null
}

/** Locale → localized URL path for all existing locale variants of a quiz
 *  (for hreflang alternateUrls and the language switcher) */
export function getQuizAlternatePaths(quizId: string): Partial<Record<Locale, string>> {
  const alternates: Partial<Record<Locale, string>> = {}
  for (const [path, mod] of Object.entries(quizFiles)) {
    const quiz = toQuiz(path, mod)
    if (!quiz || quiz.quizId !== quizId || !quiz.active) continue
    const prefix = routes.quiz[quiz.locale]
    alternates[quiz.locale] = `/${quiz.locale}/${prefix}/${quiz.slug}`
  }
  return alternates
}

/** Locale → localized URL path of the competition-terms page, for locales
 *  where the quiz exists, is active, and has terms content */
export function getQuizTermsAlternatePaths(quizId: string): Partial<Record<Locale, string>> {
  const alternates: Partial<Record<Locale, string>> = {}
  for (const [path, mod] of Object.entries(quizFiles)) {
    const quiz = toQuiz(path, mod)
    if (!quiz || quiz.quizId !== quizId || !quiz.active || !quiz.terms?.body) continue
    const prefix = routes.quiz[quiz.locale]
    alternates[quiz.locale] = `/${quiz.locale}/${prefix}/${quiz.slug}/${quizTermsSlugs[quiz.locale]}`
  }
  return alternates
}
