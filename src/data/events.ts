import type { Locale } from '@/i18n/config'

/**
 * Opakující se akce pro kalendář na stránkách kultury.
 *
 * Texty existují ve všech čtyřech jazycích webu. `icon` je SVG path
 * (viewBox 0 0 24 24, stroke) — vykresluje ho EventCalendar ve stylu
 * ostatních ikon webu, žádná emoji.
 */
export interface MarienbadEvent {
  id: string
  name: Record<Locale, string>
  period: Record<Locale, string>
  months: number[] // 1-12
  category: string
  description: Record<Locale, string>
  /** SVG path data (24×24, stroke) */
  icon: string
  /**
   * Jednorázová akce s pevným termínem (ISO datum). Kalendář ji po skončení
   * přestane zobrazovat a v JSON-LD dostane startDate/endDate místo ročního
   * opakování. Bez tohoto pole je akce každoroční.
   */
  oneOff?: { startDate: string; endDate: string }
}

export const events: MarienbadEvent[] = [
  {
    id: 'fasank',
    name: {
      de: 'Fašank / Karneval',
      en: 'Fašank / Carnival',
      cs: 'Fašank / masopust',
      ru: 'Фашанк / Масленица',
    },
    period: {
      de: 'Februar',
      en: 'February',
      cs: 'Únor',
      ru: 'Февраль',
    },
    months: [2],
    category: 'tradition',
    description: {
      de: 'Traditioneller tschechischer Karneval mit Umzügen, Masken und Volksmusik — ein farbenfrohes Spektakel.',
      en: 'Traditional Czech carnival with parades, masks and folk music — a colourful spectacle.',
      cs: 'Tradiční český masopust s průvody, maskami a lidovou muzikou — barevná podívaná pro celé město.',
      ru: 'Традиционный чешский карнавал с шествиями, масками и народной музыкой — красочное зрелище.',
    },
    // divadelní maska
    icon: 'M5 5c2.3.8 4.7 1.2 7 1.2S16.7 5.8 19 5v7c0 4.4-3.1 8-7 8s-7-3.6-7-8V5zM8.5 11h.01M15.5 11h.01M9 15.5c.8.9 1.8 1.4 3 1.4s2.2-.5 3-1.4',
  },
  {
    id: 'golf-season',
    name: {
      de: 'Golfsaison',
      en: 'Golf Season',
      cs: 'Golfová sezona',
      ru: 'Гольф-сезон',
    },
    period: {
      de: 'April – Oktober',
      en: 'April – October',
      cs: 'Duben – říjen',
      ru: 'Апрель – октябрь',
    },
    months: [4, 5, 6, 7, 8, 9, 10],
    category: 'sport',
    description: {
      de: 'Der Royal Golf Club Marienbad, gegründet 1905, zählt zu den ältesten Golfplätzen Mitteleuropas.',
      en: 'The Royal Golf Club Marienbad, founded in 1905, is one of the oldest golf courses in Central Europe.',
      cs: 'Royal Golf Club Mariánské Lázně, založený roku 1905, patří k nejstarším golfovým hřištím střední Evropy.',
      ru: 'Royal Golf Club Марианске Лазне, основанный в 1905 году, — одно из старейших полей для гольфа в Центральной Европе.',
    },
    // praporek na jamce
    icon: 'M8 21c0-1.7 4-1.7 4-1.7s4 0 4 1.7M12 19.3V4M12 4l6 2.5L12 9',
  },
  {
    id: 'spa-opening',
    name: {
      de: 'Eröffnung der Kursaison',
      en: 'Spa Season Opening',
      cs: 'Zahájení lázeňské sezony',
      ru: 'Открытие курортного сезона',
    },
    period: {
      de: 'Mai',
      en: 'May',
      cs: 'Květen',
      ru: 'Май',
    },
    months: [5],
    category: 'spa',
    description: {
      de: 'Feierliche Eröffnung der Kursaison mit Konzerten, Zeremonien und dem ersten Schluck aus den Quellen.',
      en: 'Ceremonial opening of the spa season with concerts, ceremonies and the first sip from the springs.',
      cs: 'Slavnostní zahájení lázeňské sezony s koncerty, ceremoniemi a prvním douškem z pramenů.',
      ru: 'Торжественное открытие курортного сезона с концертами, церемониями и первым глотком из источников.',
    },
    // kapka pramene
    icon: 'M12 21.5c-3.04 0-5.5-2.09-5.5-6 0-3.91 5.5-11 5.5-11s5.5 7.09 5.5 11c0 3.91-2.46 6-5.5 6z',
  },
  {
    id: 'singing-fountain',
    name: {
      de: 'Singende Fontäne',
      en: 'Singing Fountain Season',
      cs: 'Zpívající fontána',
      ru: 'Поющий фонтан',
    },
    period: {
      de: 'Mai – Oktober, jede ungerade Stunde',
      en: 'May – October, every odd hour',
      cs: 'Květen – říjen, každou lichou hodinu',
      ru: 'Май – октябрь, каждый нечётный час',
    },
    months: [5, 6, 7, 8, 9, 10],
    category: 'attraction',
    description: {
      de: 'Wasser tanzt zu Musik vor der Hauptkolonnade — abends mit spektakulärer Beleuchtung.',
      en: 'Water dances to music in front of the Main Colonnade — with spectacular lighting in the evenings.',
      cs: 'Voda tančí na hudbu před Hlavní kolonádou — večer se spektakulárním osvětlením.',
      ru: 'Вода танцует под музыку перед Главной колоннадой — вечером с эффектной подсветкой.',
    },
    // fontána: střik a mísa
    icon: 'M12 4v4M8 5.5c.5 1.5 2 2.5 4 2.5s3.5-1 4-2.5M4 13h16M6 13c0 3.5 2.7 6 6 6s6-2.5 6-6',
  },
  {
    id: 'forest-walks',
    name: {
      de: 'Waldwanderprogramm',
      en: 'Forest Walks Programme',
      cs: 'Komentované lesní vycházky',
      ru: 'Лесные прогулки с гидом',
    },
    period: {
      de: 'Juni – September',
      en: 'June – September',
      cs: 'Červen – září',
      ru: 'Июнь – сентябрь',
    },
    months: [6, 7, 8, 9],
    category: 'nature',
    description: {
      de: 'Geführte Wanderungen durch die Wälder des Kaiserwaldes mit Naturkundlern und Historikern.',
      en: 'Guided walks through the Slavkov Forest with naturalists and historians.',
      cs: 'Vycházky Slavkovským lesem s přírodovědci a historiky.',
      ru: 'Прогулки по Славковскому лесу с натуралистами и историками.',
    },
    // jehličnan
    icon: 'M12 3L7 10h2.5L5.5 16H10v5h4v-5h4.5L14.5 10H17L12 3z',
  },
  {
    id: 'chopin-festival',
    name: {
      de: 'Internationales Chopin-Festival',
      en: 'International Chopin Festival',
      cs: 'Mezinárodní Chopinův festival',
      ru: 'Международный фестиваль Шопена',
    },
    period: {
      de: 'August',
      en: 'August',
      cs: 'Srpen',
      ru: 'Август',
    },
    months: [8],
    category: 'music',
    description: {
      de: 'Seit 1960 das kulturelle Highlight — Weltklasse-Pianisten in den atmosphärischsten Sälen der Stadt.',
      en: "The cultural highlight since 1960 — world-class pianists in the town's most atmospheric venues.",
      cs: 'Kulturní vrchol sezony už od roku 1960 — světoví klavíristé v nejatmosféričtějších sálech města.',
      ru: 'Кульминация культурного сезона с 1960 года — пианисты мирового уровня в самых атмосферных залах города.',
    },
    // klaviatura
    icon: 'M4 7h16a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1zM8 7v6M12 7v6M16 7v6',
  },
  {
    id: 'film-festival',
    name: {
      de: 'Marienbader Filmfestival',
      en: 'Marienbad Film Festival',
      cs: 'Marienbad Film Festival',
      ru: 'Кинофестиваль Marienbad Film Festival',
    },
    period: {
      de: 'August / September',
      en: 'August / September',
      cs: 'Srpen / září',
      ru: 'Август / сентябрь',
    },
    months: [8, 9],
    category: 'film',
    description: {
      de: 'Filmvorführungen an einzigartigen Orten — inspiriert von „Letztes Jahr in Marienbad".',
      en: 'Film screenings at unique locations — inspired by "Last Year at Marienbad".',
      cs: 'Filmové projekce na neobvyklých místech — inspirované snímkem „Loni v Marienbadu".',
      ru: 'Кинопоказы в необычных местах — по мотивам фильма «В прошлом году в Мариенбаде».',
    },
    // filmová klapka
    icon: 'M4 9h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9zM4 9l1.5-4h3L7 9M11.5 9l1.5-4h3l-1.5 4M16 9l1.5-4H20l-1 4',
  },
  {
    id: 'unesco-5-years',
    name: {
      de: '5 Jahre Welterbe — UNESCO-Jubiläum',
      en: '5 Years World-Class — UNESCO anniversary',
      cs: '5 let světoví — výročí UNESCO',
      ru: '5 лет всемирного наследия — юбилей ЮНЕСКО',
    },
    period: {
      de: '11.–13. September 2026',
      en: '11–13 September 2026',
      cs: '11.–13. září 2026',
      ru: '11–13 сентября 2026',
    },
    months: [9],
    category: 'tradition',
    description: {
      de: 'Die Bedeutenden Kurstädte Europas feiern 5 Jahre auf der UNESCO-Liste — Marienbad eröffnet die Feierlichkeiten mit dem Heritage Forum und einem Festabend.',
      en: 'The Great Spa Towns of Europe celebrate 5 years on the UNESCO list — Mariánské Lázně opens the festivities with the Heritage Forum and a gala evening.',
      cs: 'Slavná lázeňská města Evropy slaví 5 let na seznamu UNESCO — Mariánské Lázně oslavy zahajují konferencí Heritage Forum a slavnostním večerem.',
      ru: 'Знаменитые курортные города Европы отмечают 5 лет в списке ЮНЕСКО — Марианске Лазне открывают торжества конференцией Heritage Forum и праздничным вечером.',
    },
    // antický portikus
    icon: 'M4 21h16M5 21v-9M9.5 21v-9M14.5 21v-9M19 21v-9M3 12h18M12 3l9 5H3l9-5z',
    oneOff: { startDate: '2026-09-11', endDate: '2026-09-13' },
  },
  {
    id: 'christmas-markets',
    name: {
      de: 'Weihnachtsmärkte',
      en: 'Christmas Markets',
      cs: 'Adventní trhy',
      ru: 'Рождественские ярмарки',
    },
    period: {
      de: 'Dezember',
      en: 'December',
      cs: 'Prosinec',
      ru: 'Декабрь',
    },
    months: [12],
    category: 'tradition',
    description: {
      de: 'Glühwein, Kunsthandwerk und festliche Stimmung vor der beleuchteten Kolonnade.',
      en: 'Mulled wine, handicrafts and festive cheer in front of the illuminated Colonnade.',
      cs: 'Svařák, řemeslné výrobky a sváteční atmosféra před osvětlenou kolonádou.',
      ru: 'Глинтвейн, изделия ремесленников и праздничное настроение перед подсвеченной колоннадой.',
    },
    // vánoční stromek s hvězdou
    icon: 'M12 4l4.5 5.5h-2.8L17.5 15h-4v3h-3v-3h-4l3.8-5.5H7.5L12 4zM11 21h2',
  },
]
