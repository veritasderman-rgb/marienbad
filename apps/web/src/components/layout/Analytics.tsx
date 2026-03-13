import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID

export function Analytics() {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}

/**
 * Track Ensana CTA clicks
 * Usage: onClick={() => trackEnsanaCTA('mineral-springs', 'sidebar')}
 */
export function trackEnsanaCTA(campaign: string, position: string) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as any).gtag('event', 'ensana_cta_click', {
      event_category: 'conversion',
      event_label: campaign,
      cta_position: position,
    })
  }
}

export function trackEnsanaCTAView(campaign: string, position: string) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as any).gtag('event', 'ensana_cta_view', {
      event_category: 'engagement',
      event_label: campaign,
      cta_position: position,
    })
  }
}
