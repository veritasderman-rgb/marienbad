/**
 * GA4 bootstrap (extrahováno z GoogleAnalytics.astro kvůli CSP bez
 * 'unsafe-inline' — fáze 8 portálu). Konfigurace přichází přes data
 * atributy vlastního <script> tagu; chování je beze změny.
 */
(function () {
  var el = document.currentScript;
  if (!el) return;
  var GA_MEASUREMENT_ID = el.dataset.gaId;
  var locale = el.dataset.locale || 'de';
  if (!GA_MEASUREMENT_ID) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  // Consent Mode v2 — everything denied until the visitor accepts
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  var gaLoaded = false;
  var consentGranted = false;
  function loadGA() {
    consentGranted = true;
    window['ga-disable-' + GA_MEASUREMENT_ID] = false;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    if (gaLoaded) return;
    gaLoaded = true;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      // Segment all reports by site language
      custom_map: { dimension1: 'locale' },
    });
    gtag('set', 'user_properties', { locale: locale });
    gtag('event', 'page_locale', { locale: locale });

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
  }

  // Withdrawal must take effect immediately, not on the next page load:
  // stop our event listeners, flip Consent Mode back to denied, disable
  // the loaded tag, and remove GA cookies (best effort across domains).
  function revokeGA() {
    consentGranted = false;
    gtag('consent', 'update', { analytics_storage: 'denied' });
    window['ga-disable-' + GA_MEASUREMENT_ID] = true;

    var expiry = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    var hostParts = location.hostname.split('.');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      document.cookie = name + expiry;
      for (var i = 0; i < hostParts.length - 1; i++) {
        document.cookie = name + expiry + '; domain=.' + hostParts.slice(i).join('.');
      }
    });
  }

  var stored = null;
  try { stored = localStorage.getItem('ml-consent'); } catch (e) { /* ignore */ }
  if (stored === 'granted') loadGA();
  document.addEventListener('ml:consent-granted', loadGA);
  document.addEventListener('ml:consent-denied', revokeGA);

  (function () {
    function findAnchor(el) {
      while (el && el !== document.body) {
        if (el.tagName === 'A' && el.href) return el;
        el = el.parentElement;
      }
      return null;
    }

    document.addEventListener('click', function (e) {
      // Without consent, do not even queue events into dataLayer — queued
      // hits would be replayed to gtag.js if the visitor accepts later.
      if (!consentGranted) return;
      var a = findAnchor(e.target);
      if (!a) return;

      var href = a.href;
      var url;
      try { url = new URL(href, window.location.href); } catch (err) { return; }

      // Booking intent: any link to ensanahotels.com
      if (/(^|\.)ensanahotels\.com$/.test(url.hostname)) {
        var params = url.searchParams;
        var pathParts = url.pathname.split('/').filter(Boolean);
        gtag('event', 'book_now', {
          link_url: href,
          link_domain: url.hostname,
          campaign: params.get('utm_campaign') || '(not set)',
          source: params.get('utm_source') || '(direct)',
          medium: params.get('utm_medium') || '(none)',
          // ensanahotels.com paths look like /{locale}/hotels/{hotel}/...
          hotel: pathParts[2] || '(not set)',
          locale: locale,
        });
      }

      // Campaign popup CTA → select_promotion
      var popup = a.closest('#campaign-popup-overlay');
      if (popup) {
        var card = a.closest('[data-card]');
        gtag('event', 'select_promotion', {
          promotion_name: card ? card.getAttribute('data-card') : 'campaign',
          link_url: href,
          locale: locale,
        });
      }
    }, true);

    // Newsletter / story form submissions → generate_lead
    document.addEventListener('submit', function (e) {
      if (!consentGranted) return;
      var form = e.target;
      if (!form || form.tagName !== 'FORM') return;
      var kind = form.getAttribute('data-ga-form');
      if (!kind) return;
      gtag('event', 'generate_lead', { form: kind, locale: locale });
    }, true);
  })();
})();
