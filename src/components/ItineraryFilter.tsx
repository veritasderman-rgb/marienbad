import { useState } from 'react'

type Locale = 'de' | 'en' | 'cs' | 'ru'
type Category = 'families' | 'couples' | 'solo' | 'wellness'

interface Props {
  locale: Locale
  translations: {
    title: string
    subtitle: string
    families: string
    couples: string
    solo: string
    wellness: string
    hotelLabel: string
    activitiesLabel: string
    treatmentLabel: string
    detailsLink: string
  }
}

interface Recommendation {
  icon: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  type: 'hotel' | 'activity' | 'treatment'
  href: string | Record<Locale, string>
}

const recommendations: Record<Category, Recommendation[]> = {
  families: [
    {
      icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01',
      title: {
        de: 'Hotel Butterfly',
        en: 'Butterfly Hotel',
        cs: 'Hotel Butterfly',
        ru: 'Отель Butterfly',
      },
      description: {
        de: 'Familienfreundliches 4★-Hotel mit Kinderpool und Spielbereich.',
        en: 'Family-friendly 4★ hotel with kids\' pool and play area.',
        cs: 'Rodinný 4★ hotel s dětským bazénem a hernou.',
        ru: 'Семейный отель 4★ с детским бассейном и игровой зоной.',
      },
      type: 'hotel',
      href: {
        de: 'https://ensanahotels.com/de/hotels/butterfly?utm_source=marienbad&utm_medium=itinerary&utm_campaign=families',
        en: 'https://ensanahotels.com/en/hotels/butterfly?utm_source=marienbad&utm_medium=itinerary&utm_campaign=families',
        cs: 'https://ensanahotels.com/cs/hotely/butterfly?utm_source=marienbad&utm_medium=itinerary&utm_campaign=families',
        ru: 'https://ensanahotels.com/ru/oteli/butterfly?utm_source=marienbad&utm_medium=itinerary&utm_campaign=families',
      },
    },
    {
      icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      title: {
        de: 'Kinderspielecke',
        en: 'Children\'s Play Corner',
        cs: 'Dětský koutek',
        ru: 'Детский игровой уголок',
      },
      description: {
        de: 'Betreuter Spielbereich im Hotel Butterfly — dem einzigen Ensana-Hotel mit Kinderecke.',
        en: 'Supervised play area at Hotel Butterfly — the only Ensana hotel with a kids\' corner.',
        cs: 'Hlídaný hrací koutek v Hotelu Butterfly — jediném Ensana hotelu s dětským koutkem.',
        ru: 'Игровая зона в отеле Butterfly — единственном отеле Ensana с детским уголком.',
      },
      type: 'activity',
      href: {
        de: 'https://ensanahotels.com/de/hotels/butterfly?utm_source=marienbad&utm_medium=itinerary&utm_campaign=families-kids',
        en: 'https://ensanahotels.com/en/hotels/butterfly?utm_source=marienbad&utm_medium=itinerary&utm_campaign=families-kids',
        cs: 'https://ensanahotels.com/cs/hotely/butterfly?utm_source=marienbad&utm_medium=itinerary&utm_campaign=families-kids',
        ru: 'https://ensanahotels.com/ru/oteli/butterfly?utm_source=marienbad&utm_medium=itinerary&utm_campaign=families-kids',
      },
    },
    {
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
      title: {
        de: 'Boheminium Miniaturpark',
        en: 'Boheminium Miniature Park',
        cs: 'Boheminium miniatur',
        ru: 'Парк миниатюр Богеминиум',
      },
      description: {
        de: 'Tschechische Wahrzeichen im Miniaturformat — Spaß für die ganze Familie.',
        en: 'Czech landmarks in miniature — fun for the whole family.',
        cs: 'České památky v miniatuře — zábava pro celou rodinu.',
        ru: 'Чешские достопримечательности в миниатюре — развлечение для всей семьи.',
      },
      type: 'activity',
      href: {
        de: '/de/natur',
        en: '/en/nature',
        cs: '/cs/priroda',
        ru: '/ru/priroda',
      },
    },
  ],
  couples: [
    {
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      title: {
        de: 'Nové Lázně Römisches Bad',
        en: 'Nové Lázně Roman Baths',
        cs: 'Římské lázně Nové Lázně',
        ru: 'Римские бани Нове Лазне',
      },
      description: {
        de: 'Historisches Königliches Bad mit privatem Paarbereich im 5★-Spa.',
        en: 'Historic Royal Bath with private couples\' area in the 5★ spa.',
        cs: 'Historické Královské lázně se soukromou sekcí pro páry v 5★ spa.',
        ru: 'Исторические Королевские бани с приватной зоной для пар в 5★ спа.',
      },
      type: 'hotel',
      href: {
        de: 'https://ensanahotels.com/de/hotels/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=couples',
        en: 'https://ensanahotels.com/en/hotels/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=couples',
        cs: 'https://ensanahotels.com/cs/hotely/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=couples',
        ru: 'https://ensanahotels.com/ru/oteli/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=couples',
      },
    },
    {
      icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z',
      title: {
        de: 'Singende Fontäne am Abend',
        en: 'Singing Fountain Evening',
        cs: 'Zpívající fontána večer',
        ru: 'Поющий фонтан вечером',
      },
      description: {
        de: 'Romantische Wasser- und Lichtshow bei der Kolonnade — täglich im Sommer.',
        en: 'Romantic water and light show at the Colonnade — daily in summer.',
        cs: 'Romantická vodní a světelná show u Kolonády — denně v létě.',
        ru: 'Романтическое водно-световое шоу у Колоннады — ежедневно летом.',
      },
      type: 'activity',
      href: {
        de: '/de/kolonnade',
        en: '/en/colonnade',
        cs: '/cs/kolonada',
        ru: '/ru/kolonnada',
      },
    },
    {
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z',
      title: {
        de: 'Candle-Light-Dinner',
        en: 'Candlelit Dinner',
        cs: 'Večeře při svíčkách',
        ru: 'Ужин при свечах',
      },
      description: {
        de: 'Romantisches Abendessen im historischen Ambiente der Kurhäuser.',
        en: 'Romantic dinner in the historic ambiance of the spa houses.',
        cs: 'Romantická večeře v historickém prostředí lázeňských domů.',
        ru: 'Романтический ужин в исторической атмосфере курортных домов.',
      },
      type: 'treatment',
      href: {
        de: 'https://ensanahotels.com/de/hotels/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=couples-dining',
        en: 'https://ensanahotels.com/en/hotels/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=couples-dining',
        cs: 'https://ensanahotels.com/cs/hotely/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=couples-dining',
        ru: 'https://ensanahotels.com/ru/oteli/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=couples-dining',
      },
    },
  ],
  solo: [
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: {
        de: 'Wandern im Slavkov-Wald',
        en: 'Hiking in Slavkov Forest',
        cs: 'Turistika ve Slavkovském lese',
        ru: 'Пешие прогулки в Славковском лесу',
      },
      description: {
        de: 'Über 100 km markierte Wege durch das Naturschutzgebiet.',
        en: 'Over 100 km of marked trails through the nature reserve.',
        cs: 'Přes 100 km značených tras přírodní rezervací.',
        ru: 'Более 100 км размеченных троп по природному заповеднику.',
      },
      type: 'activity',
      href: {
        de: '/de/natur',
        en: '/en/nature',
        cs: '/cs/priroda',
        ru: '/ru/priroda',
      },
    },
    {
      icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      title: {
        de: 'CO₂-Therapie',
        en: 'CO₂ Therapy',
        cs: 'CO₂ terapie',
        ru: 'CO₂-терапия',
      },
      description: {
        de: 'Natürliche Kohlensäurebäder zur Stärkung des Kreislaufs.',
        en: 'Natural carbon dioxide baths to boost circulation.',
        cs: 'Přírodní uhličité koupele pro posílení krevního oběhu.',
        ru: 'Природные углекислые ванны для улучшения кровообращения.',
      },
      type: 'treatment',
      href: {
        de: '/de/co2-therapie',
        en: '/en/co2-therapy',
        cs: '/cs/co2-terapie',
        ru: '/ru/co2-terapiya',
      },
    },
    {
      icon: 'M12 2v6M12 8c0 0-3 2-3 5a3 3 0 006 0c0-3-3-5-3-5zM8 20c0-2.2 1.8-4 4-4s4 1.8 4 4M6 22h12',
      title: {
        de: 'Mineralquellen-Trinkkur',
        en: 'Mineral Spring Drinking Cure',
        cs: 'Pitná kúra z minerálních pramenů',
        ru: 'Питьевой курс минеральных источников',
      },
      description: {
        de: 'Individuelle Kur an den Heilquellen der Kolonnade.',
        en: 'Individual cure at the healing springs of the Colonnade.',
        cs: 'Individuální kúra u léčivých pramenů Kolonády.',
        ru: 'Индивидуальный курс у целебных источников Колоннады.',
      },
      type: 'treatment',
      href: {
        de: '/de/mineralquellen',
        en: '/en/mineral-springs',
        cs: '/cs/mineralni-prameny',
        ru: '/ru/mineralnye-istochniki',
      },
    },
  ],
  wellness: [
    {
      icon: 'M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2 2-2 2M19 13l2 2-2 2M17 3l4 4M21 17l-4 4',
      title: {
        de: 'Nové Lázně 5★',
        en: 'Nové Lázně 5★',
        cs: 'Nové Lázně 5★',
        ru: 'Нове Лазне 5★',
      },
      description: {
        de: 'Das Flaggschiff-Spa mit historischem Königlichem Bad und modernem Wellness.',
        en: 'The flagship spa with historic Royal Bath and modern wellness.',
        cs: 'Vlajková loď s historickými Královskými lázněmi a moderním wellness.',
        ru: 'Флагманский спа с историческими Королевскими банями и современным велнесом.',
      },
      type: 'hotel',
      href: {
        de: 'https://ensanahotels.com/de/hotels/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=wellness',
        en: 'https://ensanahotels.com/en/hotels/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=wellness',
        cs: 'https://ensanahotels.com/cs/hotely/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=wellness',
        ru: 'https://ensanahotels.com/ru/oteli/nove-lazne?utm_source=marienbad&utm_medium=itinerary&utm_campaign=wellness',
      },
    },
    {
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      title: {
        de: 'Moorpackungen & CO₂-Bäder',
        en: 'Peat Wraps & CO₂ Baths',
        cs: 'Rašelinové zábaly a CO₂ koupele',
        ru: 'Торфяные обёртывания и CO₂-ванны',
      },
      description: {
        de: 'Klassische Kurbehandlungen aus natürlichen Heilmitteln der Region.',
        en: 'Classic spa treatments using natural healing resources of the region.',
        cs: 'Klasické lázeňské procedury z přírodních léčivých zdrojů regionu.',
        ru: 'Классические курортные процедуры из природных лечебных ресурсов региона.',
      },
      type: 'treatment',
      href: {
        de: '/de/peloidtherapie',
        en: '/en/peloid-therapy',
        cs: '/cs/peloidni-terapie',
        ru: '/ru/peloidnaya-terapiya',
      },
    },
    {
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      title: {
        de: 'Royal Golf Club',
        en: 'Royal Golf Club',
        cs: 'Royal Golf Club',
        ru: 'Королевский гольф-клуб',
      },
      description: {
        de: 'Einer der ältesten Golfplätze Europas, gegründet 1905.',
        en: 'One of the oldest golf courses in Europe, founded in 1905.',
        cs: 'Jedno z nejstarších golfových hřišť v Evropě, založené v roce 1905.',
        ru: 'Одно из старейших гольф-полей Европы, основанное в 1905 году.',
      },
      type: 'activity',
      href: {
        de: '/de/golf',
        en: '/en/golf',
        cs: '/cs/golf',
        ru: '/ru/golf',
      },
    },
  ],
}

const categoryIcons: Record<Category, string> = {
  families: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  couples: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  solo: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  wellness: 'M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2 2-2 2M19 13l2 2-2 2M17 3l4 4M21 17l-4 4',
}

const typeIcons: Record<'hotel' | 'activity' | 'treatment', string> = {
  hotel: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  activity: 'M13 10V3L4 14h7v7l9-11h-7z',
  treatment: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
}

export default function ItineraryFilter({ locale, translations }: Props) {
  const [active, setActive] = useState<Category>('families')
  const [fading, setFading] = useState(false)

  const categories: Category[] = ['families', 'couples', 'solo', 'wellness']
  const categoryLabels: Record<Category, string> = {
    families: translations.families,
    couples: translations.couples,
    solo: translations.solo,
    wellness: translations.wellness,
  }

  const typeLabelMap: Record<'hotel' | 'activity' | 'treatment', string> = {
    hotel: translations.hotelLabel,
    activity: translations.activitiesLabel,
    treatment: translations.treatmentLabel,
  }

  function switchCategory(cat: Category) {
    if (cat === active) return
    setFading(true)
    setTimeout(() => {
      setActive(cat)
      setFading(false)
    }, 200)
  }

  const items = recommendations[active]

  function resolveHref(href: string | Record<Locale, string>): string {
    if (typeof href === 'string') return href
    return href[locale]
  }

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => switchCategory(cat)}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
              transition-all duration-200 cursor-pointer
              ${
                active === cat
                  ? 'bg-indigo-700 text-white shadow-lg'
                  : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
              }
            `}
            aria-pressed={active === cat}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[cat]} />
            </svg>
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Recommendation cards */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-200 ${
          fading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {items.map((item, i) => (
          <div
            key={`${active}-${i}`}
            className="bg-white rounded-xl shadow-card p-6 flex flex-col card-hover"
          >
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-turquoise-50 text-turquoise-800 text-xs font-medium rounded-full">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={typeIcons[item.type]} />
                </svg>
                {typeLabelMap[item.type]}
              </span>
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
            </div>

            {/* Content */}
            <h3 className="font-bold text-lg text-indigo-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {item.title[locale]}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
              {item.description[locale]}
            </p>

            {/* Link */}
            {resolveHref(item.href) ? (
              <a
                href={resolveHref(item.href)}
                {...(resolveHref(item.href).startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex items-center gap-1.5 text-turquoise-700 hover:text-turquoise-900 text-sm font-semibold transition-colors"
              >
                {translations.detailsLink}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-turquoise-700 text-sm font-semibold">
                {translations.detailsLink}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
