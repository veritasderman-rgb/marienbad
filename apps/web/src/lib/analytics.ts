/**
 * GA4 Analytics — event tracking utilities
 *
 * Usage:
 *   import { trackEvent, trackPageView, trackEnsanaCTA } from '@/lib/analytics'
 *   trackEvent('newsletter_signup', { method: 'footer_form' })
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

type GtagEvent = {
  event_category?: string
  event_label?: string
  value?: number
  [key: string]: unknown
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

// ─── Core ────────────────────────────────────────────────────
export function trackEvent(eventName: string, params?: GtagEvent) {
  gtag('event', eventName, params)
}

export function trackPageView(url: string, title?: string) {
  gtag('event', 'page_view', {
    page_location: url,
    page_title: title,
  })
}

// ─── Ensana CTA ──────────────────────────────────────────────
export function trackEnsanaCTAClick(campaign: string, position: string) {
  trackEvent('ensana_cta_click', {
    event_category: 'conversion',
    event_label: campaign,
    cta_position: position,
  })
}

export function trackEnsanaCTAView(campaign: string, position: string) {
  trackEvent('ensana_cta_view', {
    event_category: 'engagement',
    event_label: campaign,
    cta_position: position,
  })
}

// ─── Content Engagement ──────────────────────────────────────
export function trackArticleRead(slug: string, readPercent: number) {
  trackEvent('article_read', {
    event_category: 'engagement',
    event_label: slug,
    value: readPercent,
  })
}

export function trackScrollDepth(depth: 25 | 50 | 75 | 100) {
  trackEvent('scroll_depth', {
    event_category: 'engagement',
    value: depth,
  })
}

export function trackFAQExpand(question: string) {
  trackEvent('faq_expand', {
    event_category: 'engagement',
    event_label: question,
  })
}

// ─── Newsletter ──────────────────────────────────────────────
export function trackNewsletterSignup(location: string) {
  trackEvent('newsletter_signup', {
    event_category: 'conversion',
    event_label: location,
  })
}

// ─── People of Colonnade ────────────────────────────────────
export function trackStoryView(storyName: string, archetype: string) {
  trackEvent('story_view', {
    event_category: 'engagement',
    event_label: storyName,
    story_archetype: archetype,
  })
}

export function trackStoryShare(storyName: string, method: string) {
  trackEvent('story_share', {
    event_category: 'engagement',
    event_label: storyName,
    share_method: method,
  })
}

// ─── Navigation ──────────────────────────────────────────────
export function trackLanguageSwitch(from: string, to: string) {
  trackEvent('language_switch', {
    event_category: 'navigation',
    event_label: `${from} → ${to}`,
  })
}

export function trackInternalLink(from: string, to: string) {
  trackEvent('internal_link_click', {
    event_category: 'navigation',
    event_label: to,
    link_source: from,
  })
}

// ─── Search ──────────────────────────────────────────────────
export function trackSearch(query: string, resultCount: number) {
  trackEvent('search', {
    event_category: 'engagement',
    search_term: query,
    value: resultCount,
  })
}
