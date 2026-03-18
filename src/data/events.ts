export interface MarienbadEvent {
  id: string
  name: {
    de: string
    en: string
  }
  period: {
    de: string
    en: string
  }
  months: number[] // 1-12
  category: string
  description: {
    de: string
    en: string
  }
  icon: string
}

export const events: MarienbadEvent[] = [
  {
    id: 'fasank',
    name: {
      de: 'Fašank / Karneval',
      en: 'Fašank / Carnival',
    },
    period: {
      de: 'Februar',
      en: 'February',
    },
    months: [2],
    category: 'tradition',
    description: {
      de: 'Traditioneller tschechischer Karneval mit Umzügen, Masken und Volksmusik — ein farbenfrohes Spektakel.',
      en: 'Traditional Czech carnival with parades, masks and folk music — a colourful spectacle.',
    },
    icon: '🎭',
  },
  {
    id: 'golf-season',
    name: {
      de: 'Golfsaison',
      en: 'Golf Season',
    },
    period: {
      de: 'April – Oktober',
      en: 'April – October',
    },
    months: [4, 5, 6, 7, 8, 9, 10],
    category: 'sport',
    description: {
      de: 'Der Royal Golf Club Marienbad, gegründet 1905, zählt zu den ältesten Golfplätzen Mitteleuropas.',
      en: 'The Royal Golf Club Marienbad, founded in 1905, is one of the oldest golf courses in Central Europe.',
    },
    icon: '⛳',
  },
  {
    id: 'spa-opening',
    name: {
      de: 'Eröffnung der Kursaison',
      en: 'Spa Season Opening',
    },
    period: {
      de: 'Mai',
      en: 'May',
    },
    months: [5],
    category: 'spa',
    description: {
      de: 'Feierliche Eröffnung der Kursaison mit Konzerten, Zeremonien und dem ersten Schluck aus den Quellen.',
      en: 'Ceremonial opening of the spa season with concerts, ceremonies and the first sip from the springs.',
    },
    icon: '🎪',
  },
  {
    id: 'singing-fountain',
    name: {
      de: 'Singende Fontäne',
      en: 'Singing Fountain Season',
    },
    period: {
      de: 'Mai – Oktober, jede ungerade Stunde',
      en: 'May – October, every odd hour',
    },
    months: [5, 6, 7, 8, 9, 10],
    category: 'attraction',
    description: {
      de: 'Wasser tanzt zu Musik vor der Hauptkolonnade — abends mit spektakulärer Beleuchtung.',
      en: 'Water dances to music in front of the Main Colonnade — with spectacular lighting in the evenings.',
    },
    icon: '⛲',
  },
  {
    id: 'forest-walks',
    name: {
      de: 'Waldwanderprogramm',
      en: 'Forest Walks Programme',
    },
    period: {
      de: 'Juni – September',
      en: 'June – September',
    },
    months: [6, 7, 8, 9],
    category: 'nature',
    description: {
      de: 'Geführte Wanderungen durch die Wälder des Kaiserwaldes mit Naturkundlern und Historikern.',
      en: 'Guided walks through the Slavkov Forest with naturalists and historians.',
    },
    icon: '🌲',
  },
  {
    id: 'chopin-festival',
    name: {
      de: 'Internationales Chopin-Festival',
      en: 'International Chopin Festival',
    },
    period: {
      de: 'August',
      en: 'August',
    },
    months: [8],
    category: 'music',
    description: {
      de: 'Seit 1960 das kulturelle Highlight — Weltklasse-Pianisten in den atmosphärischsten Sälen der Stadt.',
      en: 'The cultural highlight since 1960 — world-class pianists in the town\'s most atmospheric venues.',
    },
    icon: '🎹',
  },
  {
    id: 'film-festival',
    name: {
      de: 'Marienbader Filmfestival',
      en: 'Marienbad Film Festival',
    },
    period: {
      de: 'August / September',
      en: 'August / September',
    },
    months: [8, 9],
    category: 'film',
    description: {
      de: 'Filmvorführungen an einzigartigen Orten — inspiriert von „Letztes Jahr in Marienbad".',
      en: 'Film screenings at unique locations — inspired by "Last Year at Marienbad".',
    },
    icon: '🎬',
  },
  {
    id: 'christmas-markets',
    name: {
      de: 'Weihnachtsmärkte',
      en: 'Christmas Markets',
    },
    period: {
      de: 'Dezember',
      en: 'December',
    },
    months: [12],
    category: 'tradition',
    description: {
      de: 'Glühwein, Kunsthandwerk und festliche Stimmung vor der beleuchteten Kolonnade.',
      en: 'Mulled wine, handicrafts and festive cheer in front of the illuminated Colonnade.',
    },
    icon: '🎄',
  },
]
