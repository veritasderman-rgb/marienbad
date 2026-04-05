# Backlog — Marienbad.com

## Hebrejská (RTL) a čínská/tchajwanská jazyková mutace

**Priorita:** Střední | **Odhad:** 14–20 hodin | **Status:** Naplánováno

### Kontext
- Izraelská klientela: průměr 10.6 nocí/pobyt (nejvyšší ze všech trhů)
- Tchajwan: +16% meziroční růst návštěvnosti
- Booking linky → EN ensanahotels.com (žádná HE/ZH verze reservačního systému)

### Fáze 1: Infrastruktura (2–3 h)
- [ ] Přidat `he` a `zh-TW` do `src/i18n/config.ts` (locales, localeNames, route slugy)
- [ ] Aktualizovat `astro.config.mjs` (i18n.locales, sitemap)
- [ ] Base.astro: `dir` atribut (`dir={locale === 'he' ? 'rtl' : 'ltr'}`)
- [ ] Base.astro: OG locale mapping (`he_IL`, `zh_TW`)
- [ ] Header.astro: booking CTA texty + language switcher

### Fáze 2: RTL refaktoring — jen hebrejština (3–4 h)
- [ ] global.css: CSS logical properties (~20 pravidel)
  - `border-left` → `border-inline-start`
  - `padding-left` → `padding-inline-start`
  - `margin-left` → `margin-inline-start`
- [ ] Tailwind třídy v komponentách (Header, Footer, Hero, PillarPage, TOC sidebar, ChatWidget, BookingPopup)
- [ ] Vizuální testování RTL na všech klíčových stránkách

### Fáze 3: Překlady UI (4–6 h, vyžaduje rodilého mluvčího)
- [ ] `src/i18n/ui.ts`: 122 klíčů × 2 jazyky
- [ ] `src/content/homepage/{he,zh-TW}.json`: hero, emotional block, quick facts, hotels, newsletter (~150 polí)
- [ ] `src/data/chatFaq.ts`: 20 klíčových témat × 2 jazyky
- [ ] `src/data/hotels.ts`: booking URL pro HE/ZH → EN ensanahotels.com

### Fáze 4: Stránky — osekaná verze (4–6 h)
- [ ] `src/pages/{he,zh-TW}/`: ~12 stránek per locale
  - Index (homepage)
  - 7 pillar pages (prameny, aktivity, ubytování, historie, praktické info, lidé, magazín)
  - FAQ, impressum, privacy
  - Magazín `[slug].astro`
- [ ] Content pages: 3 pillar pages plně přeložené (ubytování, prameny, historie), zbytek zkrácený
- [ ] Články: 5–10 vybraných per locale (průvodce pobytem, co dělat, UNESCO, wellness víkend)

### Fáze 5: Booking integrace (1 h)
- [ ] Všechny CTA → `ensanahotels.com/en/hotels/{slug}/offers`
- [ ] UTM: `utm_campaign=he-booking` / `zh-tw-booking`

### Technické poznámky
- Čínské fonty: system fallback (Noto Sans TC), neself-hostovat
- Tailwind 4 má nativní RTL support přes `dir="rtl"` + logical properties
- Keystatic: přidat locale options do `keystatic.config.tsx`

---

## Další nápady (nízká priorita)

- [ ] Scrollytelling na historii stránce (horizontální timeline)
- [ ] Video v hero sekci (ambient video kolonády/fontány)
- [ ] PDF export itineráře ("Stáhnout program")
- [ ] Webcam embed z kolonády (live stream)
- [ ] Denní/noční dynamický hero (mění se podle času v ML)
