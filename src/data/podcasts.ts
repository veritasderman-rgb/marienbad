export interface PodcastEpisode {
  id: string
  videoId: string
  title: Record<string, string>
  description: Record<string, string>
  date: string
  duration?: string
  thumbnail?: string
}

/**
 * Podcast episodes — editable here or via Keystatic CMS.
 * Thumbnails auto-generated from YouTube video ID if not provided.
 */
export const episodes: PodcastEpisode[] = [
  {
    id: 'ep01',
    videoId: 'mEQ4qVAXlS0',
    title: {
      cs: 'Podcast z Mariánských Lázní — Epizoda 1',
      de: 'Podcast aus Marienbad — Folge 1',
      en: 'Marienbad Podcast — Episode 1',
      ru: 'Подкаст из Марианских Лазне — Выпуск 1',
    },
    description: {
      cs: 'Úvodní díl podcastu z Mariánských Lázní — seznamte se s naším průvodcem po lázeňském městě.',
      de: 'Die erste Folge unseres Marienbad-Podcasts — lernen Sie unseren Kurort-Führer kennen.',
      en: 'The first episode of our Marienbad Podcast — meet our spa town guide.',
      ru: 'Первый выпуск подкаста из Марианских Лазне — знакомство с нашим гидом по курортному городу.',
    },
    date: '2025-01-15',
  },
  {
    id: 'ep02',
    videoId: '7_k0WkPIuIM',
    title: {
      cs: 'Podcast z Mariánských Lázní — Epizoda 2',
      de: 'Podcast aus Marienbad — Folge 2',
      en: 'Marienbad Podcast — Episode 2',
      ru: 'Подкаст из Марианских Лазне — Выпуск 2',
    },
    description: {
      cs: 'Procházka po kolonádě a ochutnávka minerálních pramenů — každý má jiné složení a jedinečnou chuť.',
      de: 'Die nächste Folge unseres Marienbad-Podcasts.',
      en: 'The next episode of our Marienbad Podcast.',
      ru: 'Следующий выпуск подкаста из Марианских Лазне.',
    },
    date: '2025-02-01',
  },
  {
    id: 'ep03',
    videoId: 'L6WZgdnuSJg',
    title: {
      cs: 'Podcast z Mariánských Lázní — Epizoda 3',
      de: 'Podcast aus Marienbad — Folge 3',
      en: 'Marienbad Podcast — Episode 3',
      ru: 'Подкаст из Марианских Лазне — Выпуск 3',
    },
    description: {
      cs: 'Rozhovor s lázeňským lékařem o tom, jak minerální vody pomáhají při léčbě trávicího ústrojí a pohybového aparátu.',
      de: 'Die nächste Folge unseres Marienbad-Podcasts.',
      en: 'The next episode of our Marienbad Podcast.',
      ru: 'Следующий выпуск подкаста из Марианских Лазне.',
    },
    date: '2025-02-15',
  },
  {
    id: 'ep04',
    videoId: 'kG4xwUoGS0o',
    title: {
      cs: 'Podcast z Mariánských Lázní — Epizoda 4',
      de: 'Podcast aus Marienbad — Folge 4',
      en: 'Marienbad Podcast — Episode 4',
      ru: 'Подкаст из Марианских Лазне — Выпуск 4',
    },
    description: {
      cs: 'Historie Mariánských Lázní od prvních zmínek o léčivých pramenech až po rozmach lázeňského města v 19. století.',
      de: 'Die nächste Folge unseres Marienbad-Podcasts.',
      en: 'The next episode of our Marienbad Podcast.',
      ru: 'Следующий выпуск подкаста из Марианских Лазне.',
    },
    date: '2025-03-01',
  },
  {
    id: 'ep05',
    videoId: '8_3PHpk-WjI',
    title: {
      cs: 'Podcast z Mariánských Lázní — Epizoda 5',
      de: 'Podcast aus Marienbad — Folge 5',
      en: 'Marienbad Podcast — Episode 5',
      ru: 'Подкаст из Марианских Лазне — Выпуск 5',
    },
    description: {
      cs: 'Tipy na nejkrásnější procházky okolím — od Slavkovského lesa přes Kladskou až po vyhlídky nad městem.',
      de: 'Die nächste Folge unseres Marienbad-Podcasts.',
      en: 'The next episode of our Marienbad Podcast.',
      ru: 'Следующий выпуск подкаста из Марианских Лазне.',
    },
    date: '2025-03-15',
  },
  {
    id: 'ep06',
    videoId: '2ZWJ7IfS-Ts',
    title: {
      cs: 'Podcast z Mariánských Lázní — Epizoda 6',
      de: 'Podcast aus Marienbad — Folge 6',
      en: 'Marienbad Podcast — Episode 6',
      ru: 'Подкаст из Марианских Лазне — Выпуск 6',
    },
    description: {
      cs: 'Zpívající fontána, Chopin festival a kulturní léto — co vás čeká v hlavní sezóně v Mariánských Lázních.',
      de: 'Die nächste Folge unseres Marienbad-Podcasts.',
      en: 'The next episode of our Marienbad Podcast.',
      ru: 'Следующий выпуск подкаста из Марианских Лазне.',
    },
    date: '2025-04-01',
  },
  {
    id: 'ep07',
    videoId: 'SMaFfdC9mW4',
    title: {
      cs: 'Podcast z Mariánských Lázní — Epizoda 7',
      de: 'Podcast aus Marienbad — Folge 7',
      en: 'Marienbad Podcast — Episode 7',
      ru: 'Подкаст из Марианских Лазне — Выпуск 7',
    },
    description: {
      cs: 'Golf v Mariánských Lázních — nejstarší golfové hřiště v České republice a jeho královská historie od dob Edwarda VII.',
      de: 'Die nächste Folge unseres Marienbad-Podcasts.',
      en: 'The next episode of our Marienbad Podcast.',
      ru: 'Следующий выпуск подкаста из Марианских Лазне.',
    },
    date: '2025-04-15',
  },
  {
    id: 'ep08',
    videoId: 'XIc2Fcb8Q9Q',
    title: {
      cs: 'Podcast z Mariánských Lázní — Epizoda 8',
      de: 'Podcast aus Marienbad — Folge 8',
      en: 'Marienbad Podcast — Episode 8',
      ru: 'Подкаст из Марианских Лазне — Выпуск 8',
    },
    description: {
      cs: 'Jak probíhá tradiční třítýdenní lázeňská kúra a proč se hosté z celého světa vracejí rok co rok.',
      de: 'Die nächste Folge unseres Marienbad-Podcasts.',
      en: 'The next episode of our Marienbad Podcast.',
      ru: 'Следующий выпуск подкаста из Марианских Лазне.',
    },
    date: '2025-05-01',
  },
  {
    id: 'ep09',
    videoId: 'HEWSWlbqP7Y',
    title: {
      cs: 'Podcast z Mariánských Lázní — Epizoda 9',
      de: 'Podcast aus Marienbad — Folge 9',
      en: 'Marienbad Podcast — Episode 9',
      ru: 'Подкаст из Марианских Лазне — Выпуск 9',
    },
    description: {
      cs: 'CO₂ koupele a rašelinové zábaly — věda za nejúčinnějšími lázeňskými procedurami v Mariánských Lázních.',
      de: 'Die nächste Folge unseres Marienbad-Podcasts.',
      en: 'The next episode of our Marienbad Podcast.',
      ru: 'Следующий выпуск подкаста из Марианских Лазне.',
    },
    date: '2025-05-15',
  },
  {
    id: 'ep10',
    videoId: '_wbfxy0F0gs',
    title: {
      cs: 'Podcast z Mariánských Lázní — Epizoda 10',
      de: 'Podcast aus Marienbad — Folge 10',
      en: 'Marienbad Podcast — Episode 10',
      ru: 'Подкаст из Марианских Лазне — Выпуск 10',
    },
    description: {
      cs: 'Mariánské Lázně jako město UNESCO — co zápis na seznam světového dědictví znamená pro budoucnost města.',
      de: 'Die nächste Folge unseres Marienbad-Podcasts.',
      en: 'The next episode of our Marienbad Podcast.',
      ru: 'Следующий выпуск подкаста из Марианских Лазне.',
    },
    date: '2025-06-01',
  },
  {
    id: 'ep11',
    videoId: '1SGSNioTZ0M',
    title: {
      cs: 'Podcast z Mariánských Lázní — Epizoda 11',
      de: 'Podcast aus Marienbad — Folge 11',
      en: 'Marienbad Podcast — Episode 11',
      ru: 'Подкаст из Марианских Лазне — Выпуск 11',
    },
    description: {
      cs: 'Podzim v Mariánských Lázních — zlaté barvy Slavkovského lesa, houbaření a atmosféra města mimo hlavní sezónu.',
      de: 'Die nächste Folge unseres Marienbad-Podcasts.',
      en: 'The next episode of our Marienbad Podcast.',
      ru: 'Следующий выпуск подкаста из Марианских Лазне.',
    },
    date: '2025-06-15',
  },
]

export function getEpisodes() {
  return [...episodes].sort((a, b) => a.date.localeCompare(b.date))
}

export function getThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}
