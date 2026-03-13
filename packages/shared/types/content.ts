export type Locale = 'de' | 'en' | 'ru' | 'cs'

export type PageType = 'pillar' | 'info-hub' | 'landing'

export type ArticleType = 'cluster' | 'seasonal' | 'expert' | 'listicle'

export type StoryArchetype =
  | 'loyal'
  | 'first-visit'
  | 'healing'
  | 'love'
  | 'generation'
  | 'cultural'
  | 'local'
  | 'faraway'

export type EventCategory = 'culture' | 'sport' | 'wellness' | 'festival' | 'other'

export type PublicationStatus = 'draft' | 'review' | 'published'

export type EnsanaCTAPosition = 'sidebar' | 'inline' | 'bottom'

export interface SEOData {
  metaTitle: string
  metaDescription: string
  ogImage?: string
  targetKeywords?: string[]
}

export interface EnsanaCTA {
  enabled: boolean
  headline?: string
  text?: string
  url: string
  position: EnsanaCTAPosition
}

export interface FAQItem {
  question: string
  answer: string
}
