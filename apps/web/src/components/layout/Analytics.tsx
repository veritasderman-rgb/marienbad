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
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
      <Script id="ga4-scroll-tracking" strategy="afterInteractive">
        {`
          (function() {
            var thresholds = [25, 50, 75, 100];
            var fired = {};
            function getScrollPercent() {
              var h = document.documentElement;
              var b = document.body;
              var st = h.scrollTop || b.scrollTop;
              var sh = (h.scrollHeight || b.scrollHeight) - h.clientHeight;
              return sh > 0 ? Math.round((st / sh) * 100) : 0;
            }
            window.addEventListener('scroll', function() {
              var pct = getScrollPercent();
              for (var i = 0; i < thresholds.length; i++) {
                if (pct >= thresholds[i] && !fired[thresholds[i]]) {
                  fired[thresholds[i]] = true;
                  gtag('event', 'scroll_depth', {
                    event_category: 'engagement',
                    value: thresholds[i],
                  });
                }
              }
            }, { passive: true });
          })();
        `}
      </Script>
    </>
  )
}
