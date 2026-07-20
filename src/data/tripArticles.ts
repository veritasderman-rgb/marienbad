import type { Locale } from '@/i18n/config'

/**
 * Maps magazine listicle articles to the day-trip destinations they cover,
 * so trip detail pages can link to related reading. Slugs are the article
 * folder names without the locale prefix (URL: /{locale}/{magazine}/{slug}).
 */
export interface TripArticleGroup {
  tripIds: string[]
  slugs: Record<Locale, string>
  titles: Record<Locale, string>
}

export const tripArticleGroups: TripArticleGroup[] = [
  {
    tripIds: ['chodovar', 'becov', 'cheb', 'plzen', 'hamelika', 'farska-kyselka'],
    slugs: {
      cs: '5-vyletu-bez-auta',
      de: '5-ausfluege-ohne-auto',
      en: '5-day-trips-without-a-car',
      ru: '5-ekskursij-bez-mashiny',
    },
    titles: {
      cs: '5 výletů z Mariánských Lázní, na které nepotřebujete auto',
      de: '5 Ausflüge ab Marienbad, für die Sie kein Auto brauchen',
      en: '5 Day Trips from Marienbad You Can Do Without a Car',
      ru: '5 поездок из Марианских Лазней, для которых не нужна машина',
    },
  },
  {
    tripIds: ['loket', 'becov', 'kynzvart', 'gutstejn', 'primda', 'krasikov', 'andelska-hora'],
    slugs: {
      cs: '7-hradu-a-zricenin-v-okoli',
      de: '7-burgen-und-ruinen',
      en: '7-castles-and-ruins',
      ru: '7-zamkov-i-ruin',
    },
    titles: {
      cs: '7 hradů a zřícenin, které musíte vidět v okolí Mariánských Lázní',
      de: '7 Burgen und Ruinen, die Sie rund um Marienbad sehen müssen',
      en: '7 Castles and Ruins You Must See Around Marienbad',
      ru: '7 замков и руин, которые стоит увидеть рядом с Марианскими Лазнями',
    },
  },
  {
    tripIds: ['boheminium', 'barnau', 'svatosske-skaly', 'soos', 'kladska'],
    slugs: {
      cs: '5-vyletu-s-detmi-do-okoli',
      de: '5-ausfluege-mit-kindern',
      en: '5-family-day-trips',
      ru: '5-ekskursij-s-detmi',
    },
    titles: {
      cs: '5 výletů s dětmi do okolí Mariánských Lázní',
      de: '5 Ausflüge mit Kindern rund um Marienbad',
      en: '5 Family Day Trips Around Marienbad Kids Will Love',
      ru: '5 поездок с детьми из Марианских Лазней',
    },
  },
  {
    tripIds: ['chodovar', 'tepla', 'sibyllenbad', 'waldsassen', 'jachymov', 'plzen'],
    slugs: {
      cs: '6-tipu-na-destivy-den',
      de: '6-tipps-fuer-regentage',
      en: '6-rainy-day-trips',
      ru: '6-idej-na-dozhdlivyj-den',
    },
    titles: {
      cs: 'Prší? 6 výletů z Mariánských Lázní, kterým déšť nevadí',
      de: 'Regen? 6 Ausflüge ab Marienbad, denen das Wetter egal ist',
      en: "Raining? 6 Day Trips from Marienbad That Don't Mind the Weather",
      ru: 'Дождь? 6 поездок из Марианских Лазней, которым погода не помеха',
    },
  },
  {
    tripIds: ['soos', 'komorni-hurka', 'smradoch', 'podhorni-vrch', 'parkstein'],
    slugs: {
      cs: '5-mist-kde-spi-sopky',
      de: '5-orte-schlafender-vulkane',
      en: '5-sleeping-volcanoes',
      ru: '5-spyashchih-vulkanov',
    },
    titles: {
      cs: '5 míst v okolí Mariánských Lázní, kde spí sopky',
      de: '5 Orte rund um Marienbad, an denen Vulkane schlafen',
      en: '5 Places Around Marienbad Where Volcanoes Sleep',
      ru: '5 мест рядом с Марианскими Лазнями, где спят вулканы',
    },
  },
  {
    tripIds: ['kladruby', 'marianska-tynice', 'manetin', 'chlum-svate-mari', 'kappl', 'waldsassen'],
    slugs: {
      cs: '5-baroknich-pokladu',
      de: '5-barocke-schaetze',
      en: '5-baroque-treasures',
      ru: '5-sokrovishch-barokko',
    },
    titles: {
      cs: 'Za Santinim a barokem: 5 pokladů v okolí Mariánských Lázní',
      de: 'Auf Santinis Spuren: 5 barocke Schätze rund um Marienbad',
      en: "In Santini's Footsteps: 5 Baroque Treasures Around Marienbad",
      ru: 'По следам Сантини: 5 сокровищ барокко рядом с Марианскими Лазнями',
    },
  },
  {
    tripIds: ['waldsassen', 'kappl', 'sibyllenbad', 'barnau', 'parkstein', 'falkenberg'],
    slugs: {
      cs: '5-vyletu-do-bavorska',
      de: '5-ausfluege-nach-bayern',
      en: '5-trips-across-the-bavarian-border',
      ru: '5-poezdok-v-bavariyu',
    },
    titles: {
      cs: 'Přes hranici: 5 výletů z Mariánských Lázní do Bavorska',
      de: 'Über die Grenze: 5 Ausflüge von Marienbad nach Bayern',
      en: 'Across the Border: 5 Trips from Marienbad into Bavaria',
      ru: 'Через границу: 5 поездок из Марианских Лазней в Баварию',
    },
  },
]

export function articlesForTrip(tripId: string): TripArticleGroup[] {
  return tripArticleGroups.filter((group) => group.tripIds.includes(tripId))
}
