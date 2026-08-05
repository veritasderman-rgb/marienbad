/**
 * Archiv newsletterů pro cestovní kanceláře (Ensana News).
 *
 * Renderuje se na neveřejné stránce /introduce/newsletter-ck a jejích detailech.
 * Přidání dalšího čísla = jedna nová položka v poli `ckNewsletters` (nejnovější
 * první). Nic dalšího se upravovat nemusí — index, detailní stránky i vyhledávání
 * se generují z těchto dat.
 */

export const newsletterLangs = ['cs', 'en', 'de'] as const
export type NewsletterLang = (typeof newsletterLangs)[number]

export const newsletterLangNames: Record<NewsletterLang, string> = {
  cs: 'Čeština',
  en: 'English',
  de: 'Deutsch',
}

/** Odrážka v sekci — volitelně s poznámkou a příznakem novinky. */
export interface NewsletterBullet {
  label: string
  note?: string
  isNew?: boolean
}

export interface NewsletterSection {
  heading: string
  paragraphs?: string[]
  bullets?: NewsletterBullet[]
  /** Odkazy na konci sekce — v původním e-mailu tlačítka nebo doprovodné odkazy. */
  ctas?: { label: string; href: string }[]
}

/** Obsah jednoho čísla v jednom jazyce. */
export interface NewsletterContent {
  /** Předmět e-mailu / titulek čísla. */
  subject: string
  /** Označení období, např. „Srpen 2026". */
  period: string
  /** Krátké shrnutí pro archiv a vyhledávání. */
  summary: string
  /** Hlavní body čísla — zobrazují se v kartě i v hlavičce detailu. */
  highlights: string[]
  /** Štítky témat, podle kterých se dá v archivu hledat. */
  topics: string[]
  greeting: string
  lead: string
  sections: NewsletterSection[]
  closing: string
}

export interface NewsletterAttachment {
  label: Record<NewsletterLang, string>
}

export interface Newsletter {
  /** Použije se jako URL segment: /introduce/newsletter-ck/<slug> */
  slug: string
  /** ISO datum vydání — řadí archiv. */
  date: string
  attachments?: NewsletterAttachment[]
  sender: {
    name: string
    role: string
    company: string
    email: string
    web: string
  }
  content: Record<NewsletterLang, NewsletterContent>
}

const IRLVEKOVA = {
  name: 'Ing. Patricie Irlveková',
  role: 'Cluster Director of Sales and Marketing',
  company: 'Ensana Mariánské Lázně',
  email: 'pirlvekova@ensanahotels.com',
  web: 'https://www.ensanahotels.com',
}

const NEWS_LAZNEML = 'https://news.lazneml.cz'

export const ckNewsletters: Newsletter[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // Srpen 2026 — Ensana Butterfly
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: '2026-08',
    date: '2026-08-01',
    attachments: [
      { label: { cs: 'Leták hotelu Butterfly — česky', en: 'Butterfly hotel flyer — Czech', de: 'Hotelflyer Butterfly — Tschechisch' } },
      { label: { cs: 'Leták hotelu Butterfly — anglicky', en: 'Butterfly hotel flyer — English', de: 'Hotelflyer Butterfly — Englisch' } },
      { label: { cs: 'Leták hotelu Butterfly — německy', en: 'Butterfly hotel flyer — German', de: 'Hotelflyer Butterfly — Deutsch' } },
    ],
    sender: IRLVEKOVA,
    content: {
      cs: {
        subject: 'Ensana News – Srpen 2026',
        period: 'Srpen 2026',
        summary:
          'Hotel Ensana Butterfly nově nabízí Tradiční a Intenzivní léčebný pobyt. Číslo shrnuje celé portfolio pobytů, léčebnou péči u Ferdinandova pramene, letáky hotelu ve třech jazycích a přehled srpnových a zářijových akcí ve městě.',
        highlights: [
          'Dvě novinky v Butterfly: Tradiční (3 procedury/noc) a Intenzivní (4 procedury/noc) lázeňský pobyt',
          'Lékař i zdravotní sestra přímo v hotelu, Ferdinandův pramen vyvěrá v budově',
          'Letáky hotelu Butterfly v CZ, EN a DE k volnému použití',
          'Kalendář akcí na srpen a září — Chopinův festival, FIBA 3x3, Dny evropského dědictví',
        ],
        topics: ['Butterfly', 'Léčebné pobyty', 'Ferdinandův pramen', 'Letáky', 'Kalendář akcí', 'Chopinův festival', 'Výlety', 'Podklady pro CK'],
        greeting: 'Vážení partneři,',
        lead:
          'v srpnovém vydání se zaměřujeme na hotel Ensana Butterfly – lázeňský hotel s vlastním Ferdinandovým pramenem přímo v centru Mariánských Lázní. Nově do jeho nabídky přidáváme Tradiční a Intenzivní léčebný pobyt. V příloze zároveň najdete tři letáky hotelu (CZ, EN, DE) připravené k použití při komunikaci s klienty. Přidáváme také přehled akcí, které Mariánské Lázně nabídnou v srpnu a září.',
        sections: [
          {
            heading: 'Nové lázeňské pobyty v Ensana Butterfly',
            paragraphs: [
              'Do nabídky hotelu Ensana Butterfly nově přidáváme Tradiční a Intenzivní léčebný pobyt. Každý lázeňský pobyt zahrnuje vstupní vyšetření lékařem, procedury z přírodních zdrojů, léčivou vodu Ferdinandova pramene, bazén a saunu během pobytu bezplatně a parkování v podzemní garáži.',
              'Přehled pobytů s procedurami (polopenze nebo plná penze):',
            ],
            bullets: [
              { label: 'Minikúra', note: 'od 2 nocí, 1 procedura na osobu a noc' },
              { label: 'Lázeňský léčebný pobyt', note: 'od 5 nocí, 2 procedury na osobu a noc' },
              { label: 'Tradiční lázeňský pobyt', note: 'od 5 nocí, 3 procedury na osobu a noc', isNew: true },
              { label: 'Intenzivní lázeňský pobyt', note: 'od 6 nocí, 4 procedury na osobu a noc', isNew: true },
            ],
            ctas: [{ label: 'Hotel Ensana Butterfly', href: 'https://ensanahotels.com/cs/hotely/butterfly' }],
          },
          {
            heading: 'Lázeňská a léčebná péče pod odborným dohledem',
            paragraphs: [
              'Hotel Ensana Butterfly spojuje komfortní pobyt s profesionální léčebnou péčí. Přímo v hotelu je k dispozici lékař i zdravotní sestra, takže Vaši klienti mají odbornou péči na dosah po celou dobu pobytu.',
              'Ferdinandův pramen vyvěrá přímo v hotelu a využívá se pro minerální koupele i pitnou kúru. Oproti ostatním minerálním vodám příznivě působí i na kožní obtíže.',
              'Indikace zahrnují nemoci ledvin a močových cest, pohybového aparátu, dýchacího, oběhového a trávicího systému, nemoci metabolické, onkologické, neurologické, štítné žlázy a kožní obtíže.',
              'Z dalších léčebných procedur je k dispozici také přírodní peloid – rašelina. K wellness zázemí patří bazén 12 × 6 m s vířivkou, sauna a fitness.',
            ],
          },
          {
            heading: 'Letáky ke stažení a sdílení',
            paragraphs: [
              'V příloze tohoto e-mailu najdete tři letáky hotelu Butterfly – v češtině, angličtině a němčině. Můžete je rovnou využít při komunikaci s klienty i ve vlastních prodejních materiálech.',
            ],
          },
          {
            heading: 'Co se děje v Mariánských Lázních v srpnu a září',
            paragraphs: [
              'Pobyt v Mariánských Lázních lze i na konci léta skvěle spojit s bohatým kulturním a sportovním programem přímo v centru města. V Mariánských Lázních se v červenci úspěšně odehrál charitativní golfový turnaj Royal Golf Clubu (16. 7.) a nabitý program pokračuje i dál. Vybrali jsme to nejzajímavější:',
              'Srpen',
            ],
            bullets: [
              { label: 'FIBA 3x3 Nations League U23', note: 'mezinárodní basketbalový turnaj (2.–8. 8.)' },
              { label: 'Billie Jean King Cup Juniors by Gainbridge', note: 'mezinárodní juniorský tenisový turnaj, TCF Schicht Mariánské Lázně, Anglická 744 (3.–5. 8.)' },
              { label: 'Chopinův festival', note: '67. ročník (14.–22. 8.)' },
              { label: 'Festival vína na kolonádě', note: '22. 8.' },
              { label: 'Výstava klavírů C. Bechstein', note: '12.–22. 8., a kolonádní koncerty Západočeského symfonického orchestru' },
            ],
          },
          {
            heading: 'Září',
            bullets: [
              { label: 'Dny evropského dědictví', note: 'jedinečná možnost poznat město (7.–20. 9.)' },
              { label: 'Zpřístupnění Domu Chopin a Anglikánské kaple', note: '12. 9.' },
              { label: 'Závěrečný kolonádní koncert sezóny 2026', note: '12. 9.' },
              { label: 'Podzimní program Městského divadla', note: 'opereta, činohra i koncerty' },
            ],
            paragraphs: [
              'Vlastní program pořádaný našimi lázněmi – přednášky, koncerty a výstavy v našich hotelech – najdou Vaši hosté na news.lazneml.cz.',
            ],
            ctas: [{ label: 'news.lazneml.cz', href: NEWS_LAZNEML }],
          },
          {
            heading: 'Tipy na výlety pro Vaše hosty',
            paragraphs: [
              'Mariánské Lázně jsou skvělým výchozím bodem pro výlety po západních Čechách i za hranice. Na portálu marienbad.com najdou Vaši klienti přes 70 tipů na výlety – s filtry podle typu, náročnosti i vhodnosti (bez auta, s kočárkem, se psem, i za deště). Mezi nejoblíbenější patří Karlovy Vary, Plzeň, hrad Loket, naučná stezka Kladská a klášter Teplá.',
            ],
            ctas: [{ label: 'Prohlédnout tipy na výlety', href: '/cs/vylety' }],
          },
          {
            heading: 'Pro cestovní kanceláře: vše na jednom místě',
            paragraphs: [
              'Pro naše partnery jsme připravili jedno centrální místo s dalšími materiály: prezentace destinace i hotelů, informace o lázeňské péči a MICE, fotogalerii a videa a firemní údaje připravené ke zkopírování do Vašich systémů. Vše je zdarma k použití ve Vašem prodeji a marketingu.',
            ],
            ctas: [{ label: 'Stáhnout fotky a katalogy', href: '/introduce' }],
          },
        ],
        closing:
          'Rádi Vám ke všem novinkám poskytneme doplňující informace i podklady pro podporu prodeje. Těšíme se na další úspěšnou spolupráci.',
      },

      en: {
        subject: 'Ensana News – August 2026',
        period: 'August 2026',
        summary:
          'The Ensana Butterfly hotel newly offers the Traditional and Intensive Spa Stay. The issue covers the full stay portfolio, the medical care around the Ferdinand Spring, hotel flyers in three languages and an overview of events in town in August and September.',
        highlights: [
          'Two new stays at Butterfly: Traditional (3 treatments/night) and Intensive (4 treatments/night)',
          'A doctor and a nurse on site, with the Ferdinand Spring rising inside the hotel',
          'Butterfly hotel flyers in CZ, EN and DE, free to use',
          'Events calendar for August and September — Chopin Festival, FIBA 3x3, European Heritage Days',
        ],
        topics: ['Butterfly', 'Spa stays', 'Ferdinand Spring', 'Flyers', 'Events calendar', 'Chopin Festival', 'Excursions', 'Trade materials'],
        greeting: 'Dear Partners,',
        lead:
          'in our August issue we focus on the Ensana Butterfly hotel – a spa hotel with its own Ferdinand Spring right in the centre of Mariánské Lázně. We are newly adding the Traditional and Intensive Spa Stay to its portfolio. Attached you will also find three hotel flyers (CZ, EN, DE) ready to use in your communication with clients. We are also including an overview of events that Mariánské Lázně will offer in August and September.',
        sections: [
          {
            heading: 'New spa stays at Ensana Butterfly',
            paragraphs: [
              'We are newly adding the Traditional and Intensive Spa Stay to the portfolio of the Ensana Butterfly hotel. Every spa stay includes an initial medical examination, treatments based on natural resources, the healing water of the Ferdinand Spring, free use of the pool and sauna during the stay, and parking in the underground garage.',
              'Overview of stays with treatments (half or full board):',
            ],
            bullets: [
              { label: 'Healthy in Mariánské Lázně', note: 'from 2 nights, 1 treatment per person per night' },
              { label: 'Essential Spa Stay', note: 'from 5 nights, 2 treatments per person per night' },
              { label: 'Traditional Spa Stay', note: 'from 5 nights, 3 treatments per person per night', isNew: true },
              { label: 'Intensive Spa Stay', note: 'from 6 nights, 4 treatments per person per night', isNew: true },
            ],
            ctas: [{ label: 'Ensana Butterfly hotel', href: 'https://ensanahotels.com/en/hotels/butterfly' }],
          },
          {
            heading: 'Spa and medical care under professional supervision',
            paragraphs: [
              'The Ensana Butterfly hotel combines a comfortable stay with professional medical care. A doctor and a nurse are available on site in the hotel, so your clients have expert care within reach throughout their stay.',
              'The Ferdinand Spring rises inside the hotel and is used for the mineral baths as well as the drinking cure. Compared with other mineral waters, it also has a beneficial effect on skin conditions.',
              'Indications include kidney and urinary tract diseases, musculoskeletal, respiratory, circulatory and digestive system diseases, metabolic, oncological, neurological and thyroid diseases and skin conditions.',
              'Among the other treatments, a natural peloid – peat – is also available. The wellness facilities include a 12 × 6 m pool with a whirlpool, a sauna and a fitness room.',
            ],
          },
          {
            heading: 'Flyers to download and share',
            paragraphs: [
              'Attached to this e-mail you will find three flyers for the Butterfly hotel – in Czech, English and German. You are welcome to use them directly in your communication with clients as well as in your own sales materials.',
            ],
          },
          {
            heading: 'What is happening in Mariánské Lázně in August and September',
            paragraphs: [
              "Even at the end of summer, a stay in Mariánské Lázně can be perfectly combined with a rich cultural and sporting programme right in the town centre. In July, the Royal Golf Club's charity golf tournament was successfully held here (16 July) and the busy programme continues. We have selected the most interesting highlights:",
              'August',
            ],
            bullets: [
              { label: 'FIBA 3x3 Nations League U23', note: 'international basketball tournament (2–8 August)' },
              { label: 'Billie Jean King Cup Juniors by Gainbridge', note: 'international junior tennis tournament, TCF Schicht Mariánské Lázně, Anglická 744 (3–5 August)' },
              { label: 'Chopin Festival', note: '67th edition (14–22 August)' },
              { label: 'Wine Festival on the colonnade', note: '22 August' },
              { label: 'C. Bechstein piano exhibition', note: '12–22 August, and colonnade concerts by the West Bohemian Symphony Orchestra' },
            ],
          },
          {
            heading: 'September',
            bullets: [
              { label: 'European Heritage Days', note: 'a unique opportunity to discover the town (7–20 September)' },
              { label: 'Chopin House and the Anglican Chapel open to visitors', note: '12 September' },
              { label: 'Closing colonnade concert of the 2026 season', note: '12 September' },
              { label: 'Autumn programme of the Municipal Theatre', note: 'operetta, drama and concerts' },
            ],
            paragraphs: [
              'Your guests will find the programme organised by our spa – lectures, concerts and exhibitions in our hotels – at news.lazneml.cz.',
            ],
            ctas: [{ label: 'news.lazneml.cz', href: NEWS_LAZNEML }],
          },
          {
            heading: 'Excursion tips for your guests',
            paragraphs: [
              'Mariánské Lázně is an excellent starting point for excursions around West Bohemia and across the border. On the marienbad.com portal your clients will find more than 70 excursion tips – with filters by type, difficulty and suitability (without a car, with a pushchair, with a dog, and even in the rain). Among the most popular are Karlovy Vary, Plzeň, Loket Castle, the Kladská nature trail and Teplá Monastery.',
            ],
            ctas: [{ label: 'Browse the excursion tips', href: '/en/day-trips' }],
          },
          {
            heading: 'For travel agencies: everything in one place',
            paragraphs: [
              'For our partners we have prepared a single central place with further materials: presentations of the destination and the hotels, information on spa care and MICE, a photo gallery and videos, and company details ready to be copied into your systems. Everything is free to use in your sales and marketing.',
            ],
            ctas: [{ label: 'Download photos and catalogues', href: '/introduce' }],
          },
        ],
        closing:
          'We will be glad to provide you with additional information and sales-support materials for all our news. We look forward to our continued successful cooperation.',
      },

      de: {
        subject: 'Ensana News – August 2026',
        period: 'August 2026',
        summary:
          'Das Hotel Ensana Butterfly nimmt die Traditionelle und die Intensive Kur neu ins Angebot auf. Die Ausgabe fasst das gesamte Aufenthaltsportfolio, die Heilbehandlung an der Ferdinandquelle, die Hotelflyer in drei Sprachen sowie die Veranstaltungen im August und September zusammen.',
        highlights: [
          'Zwei Neuheiten im Butterfly: Traditioneller Kuraufenthalt (3 Behandlungen/Nacht) und Komplexe Heilkur Intensiv (4 Behandlungen/Nacht)',
          'Arzt und Krankenschwester direkt im Haus, die Ferdinandquelle entspringt im Hotel',
          'Hotelflyer Butterfly in CZ, EN und DE zur freien Verwendung',
          'Veranstaltungskalender für August und September — Chopin-Festival, FIBA 3x3, Tage des europäischen Kulturerbes',
        ],
        topics: ['Butterfly', 'Kuraufenthalte', 'Ferdinandquelle', 'Flyer', 'Veranstaltungskalender', 'Chopin-Festival', 'Ausflüge', 'Unterlagen für Reisebüros'],
        greeting: 'Sehr geehrte Partner,',
        lead:
          'in der Augustausgabe widmen wir uns dem Hotel Ensana Butterfly – einem Kurhotel mit eigener Ferdinandquelle direkt im Zentrum von Marienbad. Neu nehmen wir die Traditionelle und die Intensive Kur in sein Angebot auf. Im Anhang finden Sie außerdem drei Hotelflyer (CZ, EN, DE), die Sie in der Kommunikation mit Ihren Kunden verwenden können. Ergänzend geben wir Ihnen einen Überblick über die Veranstaltungen, die Marienbad im August und September bietet.',
        sections: [
          {
            heading: 'Neue Kuraufenthalte im Ensana Butterfly',
            paragraphs: [
              'Neu nehmen wir die Traditionelle und die Intensive Kur in das Angebot des Hotels Ensana Butterfly auf. Jeder Kuraufenthalt umfasst eine ärztliche Eingangsuntersuchung, Behandlungen aus natürlichen Heilmitteln, das Heilwasser der Ferdinandquelle, Pool und Sauna während des Aufenthalts inklusive sowie das Parken in der Tiefgarage.',
              'Übersicht der Aufenthalte mit Behandlungen (Halb- oder Vollpension):',
            ],
            bullets: [
              { label: 'Minikur', note: 'ab 2 Nächten, 1 Behandlung pro Person und Nacht' },
              { label: 'Entspannungskur', note: 'ab 5 Nächten, 2 Behandlungen pro Person und Nacht' },
              { label: 'Traditioneller Kuraufenthalt', note: 'ab 5 Nächten, 3 Behandlungen pro Person und Nacht', isNew: true },
              { label: 'Komplexe Heilkur Intensiv', note: 'ab 6 Nächten, 4 Behandlungen pro Person und Nacht', isNew: true },
            ],
            ctas: [{ label: 'Hotel Ensana Butterfly', href: 'https://ensanahotels.com/de/hotels/butterfly' }],
          },
          {
            heading: 'Kur- und Heilbehandlung unter fachärztlicher Aufsicht',
            paragraphs: [
              'Das Hotel Ensana Butterfly verbindet einen komfortablen Aufenthalt mit professioneller Heilbehandlung. Direkt im Haus stehen ein Arzt und eine Krankenschwester zur Verfügung, sodass Ihre Kunden während des gesamten Aufenthalts fachkundig betreut sind.',
              'Die Ferdinandquelle entspringt direkt im Hotel und wird für die Mineralbäder sowie die Trinkkur genutzt. Im Vergleich zu anderen Mineralwässern wirkt sie zusätzlich positiv bei Hautbeschwerden.',
              'Zu den Indikationen zählen Nieren- und Harnwegserkrankungen, Erkrankungen des Bewegungsapparats, der Atemwege, des Kreislaufs und der Verdauung, Stoffwechsel-, onkologische, neurologische und Schilddrüsenerkrankungen sowie Hautbeschwerden.',
              'Von den weiteren Heilbehandlungen steht außerdem ein natürliches Peloid – Torf – zur Verfügung. Zum Wellnessbereich gehören ein Pool von 12 × 6 m mit Whirlpool, eine Sauna und ein Fitnessraum.',
            ],
          },
          {
            heading: 'Flyer zum Herunterladen und Teilen',
            paragraphs: [
              'Im Anhang dieser E-Mail finden Sie drei Flyer des Hotels Butterfly – auf Tschechisch, Englisch und Deutsch. Sie können sie direkt in der Kommunikation mit Ihren Kunden sowie in Ihren eigenen Verkaufsunterlagen verwenden.',
            ],
          },
          {
            heading: 'Was im August und September in Marienbad los ist',
            paragraphs: [
              'Auch am Ende des Sommers lässt sich ein Kuraufenthalt in Marienbad hervorragend mit einem reichhaltigen Kultur- und Sportprogramm direkt im Stadtzentrum verbinden. Im Juli fand hier das Charity-Golfturnier des Royal Golf Clubs erfolgreich statt (16. 7.), und das dichte Programm geht weiter. Wir haben die Highlights für Sie ausgewählt:',
              'August',
            ],
            bullets: [
              { label: 'FIBA 3x3 Nations League U23', note: 'internationales Basketballturnier (2.–8. August)' },
              { label: 'Billie Jean King Cup Juniors by Gainbridge', note: 'internationales Juniorentennisturnier, TCF Schicht Mariánské Lázně, Anglická 744 (3.–5. August)' },
              { label: 'Chopin-Festival', note: '67. Jahrgang (14.–22. August)' },
              { label: 'Weinfestival auf der Kolonnade', note: '22. August' },
              { label: 'Klavierausstellung C. Bechstein', note: '12.–22. August, und Kolonnadenkonzerte des Westböhmischen Symphonieorchesters' },
            ],
          },
          {
            heading: 'September',
            bullets: [
              { label: 'Tage des europäischen Kulturerbes', note: 'eine einzigartige Gelegenheit, die Stadt zu entdecken (7.–20. September)' },
              { label: 'Öffnung des Chopin-Hauses und der Anglikanischen Kapelle', note: '12. September' },
              { label: 'Abschlusskonzert der Kolonnadensaison 2026', note: '12. September' },
              { label: 'Herbstprogramm des Stadttheaters', note: 'Operette, Schauspiel und Konzerte' },
            ],
            paragraphs: [
              'Das von unserem Kurbetrieb organisierte Programm – Vorträge, Konzerte und Ausstellungen in unseren Hotels – finden Ihre Gäste auf news.lazneml.cz.',
            ],
            ctas: [{ label: 'news.lazneml.cz', href: NEWS_LAZNEML }],
          },
          {
            heading: 'Ausflugstipps für Ihre Gäste',
            paragraphs: [
              'Marienbad ist ein hervorragender Ausgangspunkt für Ausflüge durch Westböhmen und über die Grenze. Auf dem Portal marienbad.com finden Ihre Kunden über 70 Ausflugstipps – mit Filtern nach Art, Schwierigkeitsgrad und Eignung (ohne Auto, mit Kinderwagen, mit Hund, auch bei Regen). Zu den beliebtesten zählen Karlsbad, Pilsen, die Burg Loket, der Lehrpfad Kladská und das Kloster Teplá.',
            ],
            ctas: [{ label: 'Ausflugstipps ansehen', href: '/de/ausfluege' }],
          },
          {
            heading: 'Für Reisebüros: alles an einem Ort',
            paragraphs: [
              'Für unsere Partner haben wir einen zentralen Ort mit weiteren Materialien vorbereitet: Präsentationen der Destination und der Hotels, Informationen zur Kurbehandlung und zu MICE, eine Fotogalerie und Videos sowie Firmenangaben, die Sie direkt in Ihre Systeme übernehmen können. Alles steht Ihnen für Vertrieb und Marketing kostenfrei zur Verfügung.',
            ],
            ctas: [{ label: 'Fotos und Kataloge herunterladen', href: '/introduce' }],
          },
        ],
        closing:
          'Gerne stellen wir Ihnen zu allen Neuigkeiten weitere Informationen sowie Unterlagen zur Verkaufsunterstützung zur Verfügung. Wir freuen uns auf die weitere erfolgreiche Zusammenarbeit.',
      },
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Červenec 2026 — 130 let Nových Lázní, nové terapie, letní program
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: '2026-07',
    date: '2026-07-01',
    sender: IRLVEKOVA,
    content: {
      cs: {
        subject: 'Ensana News z Mariánských Lázní – Léto 2026',
        period: 'Červenec 2026',
        summary:
          'Jubilejní pobyty ke 130 letům Nových Lázní (prodáno přes 100), tři nově zařazené terapie — lesní terapie, EM BODY a lokální kryoterapie — a výběr z letního kulturního a sportovního programu města.',
        highlights: [
          'Jubilejní pobyty ke 130. výročí Nových Lázní — 2 noci od 5 500 Kč, 6 nocí od 4 875 Kč',
          'Nová lesní terapie ve Slavkovském lese, nabízená dvakrát týdně',
          'EM BODY (HIFEM™) — 30 minut ≈ 20 000 svalových kontrakcí',
          'Lokální kryoterapie na bolest, záněty a regeneraci',
          'Letní program: Craft Beer Festival, Chopinův festival, FIBA 3x3 Nations League U23',
        ],
        topics: ['Nové Lázně', '130. výročí', 'Jubilejní pobyty', 'Lesní terapie', 'EM BODY', 'Kryoterapie', 'Letní program', 'FIBA 3x3'],
        greeting: 'Vážení partneři,',
        lead:
          'přinášíme Vám letní přehled novinek z Ensana Mariánské Lázně. Nejprve si připomínáme 130. výročí našeho vlajkového hotelu Nové Lázně, o jehož jubilejní pobyty je mimořádný zájem. Dále Vám představujeme několik nově zařazených přístrojových i přírodních terapií, které Vašim klientům přinášejí rychlé, komfortní a viditelné výsledky. Na závěr přidáváme tipy na to nejlepší z letního kulturního a sportovního programu ve městě.',
        sections: [
          {
            heading: '130 let hotelu Nové Lázně (1896–2026)',
            paragraphs: [
              'Náš pětihvězdičkový hotel Ensana Nové Lázně letos slaví 130 let. Připomeňte svým klientům tento výjimečný příběh – od římských lázní z roku 1896 přes soukromou kabinu krále Eduarda VII. až po největší historicky autentický lázeňský komplex v Čechách o rozloze 5 900 m².',
              'Krátké video (Reels) je připravené i pro sociální sítě – budeme rádi, když ho nasdílíte na svých kanálech a připomenete tak jubileum svým klientům.',
              'Jubilejní pobyty k 130. výročí:',
            ],
            bullets: [
              { label: 'Jubilejní pobyt – 2 noci', note: 'od 5 500 Kč / pokoj / noc / osoba' },
              { label: 'Jubilejní pobyt – 6 nocí', note: 'od 4 875 Kč / pokoj / noc / osoba' },
            ],
            ctas: [
              { label: 'Krátké video k 130. výročí (Reels pro sociální sítě)', href: 'https://www.youtube.com/shorts/ykGkF96dKJQ' },
              { label: 'Výpravné video o historii hotelu', href: 'https://www.youtube.com/watch?v=BSaYi_TO7GE' },
              { label: 'Prozkoumat jubilejní pobyty', href: 'https://ensanahotels.com/cs/hotely/nove-lazne/130-let-hotelu-nove-lazne' },
            ],
          },
          {
            heading: 'Lesní terapie',
            paragraphs: [
              'Mariánské Lázně jsou obklopeny chráněnou krajinnou oblastí Slavkovský les – a právě toto přírodní bohatství je základem naší nové lesní terapie. Řízený pobyt v lese (v zahraničí známý jako „forest bathing“ či shinrin-jóku) pomáhá snižovat stres, zklidňuje nervovou soustavu, podporuje imunitu a zlepšuje kvalitu spánku.',
              'Jde o šetrnou a dostupnou aktivitu, která přirozeně doplňuje lázeňské i wellness pobyty a osloví klienty hledající regeneraci a duševní pohodu v přírodě.',
              'Lesní terapii nabízíme dvakrát týdně. Aktuální přehled termínů získají Vaši hosté na našich recepcích nebo na stránkách news.lazneml.cz.',
            ],
          },
          {
            heading: 'EM BODY – tvarování těla',
            paragraphs: [
              'EM BODY je neinvazivní a bezbolestné řešení pro zpevnění svalů a tvarování postavy. Díky technologii HIFEM™ vyvolá během jediného ošetření tisíce supramaximálních svalových kontrakcí, jakých nelze dosáhnout běžným cvičením. Svaly jsou nuceny přestavět svou vnitřní strukturu, což vede ke zvýšení jejich síly, tonusu i objemu.',
              'Jedno 30minutové ošetření představuje přibližně 20 000 svalových kontrakcí – tedy zhruba ekvivalent tří týdnů v posilovně.',
              'Ošetření je rychlé, komfortní a nevyžaduje žádnou dobu rekonvalescence. Vhodné je pro klienty, kteří chtějí posílit svaly, tonizovat pokožku, zlepšit držení těla či podpořit redukci hmotnosti.',
              'Tato procedura je součástí vybraných balíčků (například Weight Loss) a zároveň si ji Vaši klienti mohou dokoupit na spa recepcích našich hotelů.',
            ],
          },
          {
            heading: 'Lokální kryoterapie',
            paragraphs: [
              'Lokální kryoterapie využívá cíleného působení extrémního chladu na vybranou část těla. Krátká, ale intenzivní aplikace pomáhá tlumit bolest, snižovat záněty a otoky a urychluje regeneraci svalů a kloubů.',
              'Ocení ji zejména klienti s pohybovými obtížemi, aktivní sportovci a všichni, kdo hledají rychlou úlevu a účinnou podporu léčebných procedur.',
              'Proceduru si Vaši klienti mohou dokoupit na spa recepcích našich hotelů.',
            ],
          },
          {
            heading: 'Mariánské Lázně žijí v létě kulturou a sportem',
            paragraphs: [
              'Mariánské Lázně nabídnou přes léto několik set kulturních a sportovních akcí. Připomeňte svým klientům, že lázeňský pobyt u nás lze skvěle spojit s bohatým programem přímo v centru města. Vybrali jsme to nejlepší:',
            ],
            bullets: [
              { label: 'Festivaly', note: 'Craft Beer Festival (18. 7.), Chopinův festival – 67. ročník (14.–22. 8.) a Festival vína (22. 8.)' },
              { label: 'Koncerty', note: 'Kolonádní koncerty Západočeského symfonického orchestru po celé léto a Letní koncert Rádia Blaník (24. 7.)' },
              { label: 'Výstavy', note: 'Antonio Canova na zámku Kynžvart a fotografie Mira Švolíka v Domě Chopin' },
              { label: 'Divadlo a rodina', note: 'letní program Městského divadla a pohádková dopoledne Kapsa plná pohádek pro děti' },
              { label: 'Sport', note: 'S-RACE – překážkový závod (12. 7.) a sraz historických vozidel (4. 7.)' },
            ],
            ctas: [
              { label: 'Nations League U23 (FIBA 3x3, 2.–8. 8. 2026)', href: 'https://3x3.cz.basketball/reprezentace/vsechny' },
              { label: 'news.lazneml.cz', href: NEWS_LAZNEML },
            ],
          },
        ],
        closing:
          'Vrcholem sportovního léta bude prestižní mezinárodní turnaj Nations League U23 pod hlavičkou FIBA 3x3, který budou Mariánské Lázně hostit ve dnech 2.–8. srpna 2026. Rádi Vám ke všem novinkám poskytneme doplňující informace i podklady pro podporu prodeje. Těšíme se na další úspěšnou spolupráci.',
      },

      en: {
        subject: 'Ensana News from Mariánské Lázně – Summer 2026',
        period: 'July 2026',
        summary:
          'Anniversary stays for 130 years of Nové Lázně (over 100 already sold), three newly added therapies — forest therapy, EM BODY and local cryotherapy — and a pick of the town’s summer cultural and sporting programme.',
        highlights: [
          'Anniversary stays for the 130th anniversary of Nové Lázně — 2 nights from €217, 6 nights from €195',
          'New forest therapy in the Slavkovský les, offered twice a week',
          'EM BODY (HIFEM™) — 30 minutes ≈ 20,000 muscle contractions',
          'Local cryotherapy for pain, inflammation and recovery',
          'Summer programme: Craft Beer Festival, Chopin Festival, FIBA 3x3 Nations League U23',
        ],
        topics: ['Nové Lázně', '130th anniversary', 'Anniversary stays', 'Forest therapy', 'EM BODY', 'Cryotherapy', 'Summer programme', 'FIBA 3x3'],
        greeting: 'Dear Partners,',
        lead:
          'we bring you a summer round-up of news from Ensana Mariánské Lázně. First, we mark the 130th anniversary of our flagship hotel Nové Lázně, whose anniversary stays are attracting exceptional interest. We then introduce several newly added device-based and natural therapies that deliver fast, comfortable and visible results for your clients. Finally, we share tips on the best of the town’s summer cultural and sporting programme.',
        sections: [
          {
            heading: 'The 130th Anniversary of the Nové Lázně Hotel (1896–2026)',
            paragraphs: [
              'Our five-star Ensana Nové Lázně hotel celebrates 130 years this year. Remind your clients of this remarkable story – from the Roman baths of 1896 and the private cabin of King Edward VII to the largest historically authentic spa complex in Bohemia, covering 5,900 m².',
              'The short video (Reels) is also ready for social media – we would be glad if you shared it on your channels and reminded your clients of the anniversary.',
              'Anniversary stays for the 130th anniversary:',
            ],
            bullets: [
              { label: 'Anniversary stay – 2 nights', note: 'from €217 / room / night / person' },
              { label: 'Anniversary stay – 6 nights', note: 'from €195 / room / night / person' },
            ],
            ctas: [
              { label: 'Short video for the 130th anniversary (Reels for social media)', href: 'https://www.youtube.com/shorts/ykGkF96dKJQ' },
              { label: "Feature-length video on the hotel's history", href: 'https://www.youtube.com/watch?v=BSaYi_TO7GE' },
              { label: 'Explore the anniversary stays', href: 'https://ensanahotels.com/en/hotels/nove-lazne/130-years-hotel-nove-lazne' },
            ],
          },
          {
            heading: 'Forest Therapy',
            paragraphs: [
              'Mariánské Lázně is surrounded by the protected landscape area of Slavkovský les – and this natural wealth is the foundation of our new forest therapy. A guided stay in the forest (known internationally as “forest bathing” or shinrin-yoku) helps reduce stress, calms the nervous system, supports immunity and improves sleep quality.',
              'It is a gentle and accessible activity that naturally complements spa and wellness stays and appeals to clients seeking regeneration and mental well-being in nature.',
              'We offer forest therapy twice a week. Your guests can find the current schedule at our receptions or at news.lazneml.cz.',
            ],
          },
          {
            heading: 'EM BODY – Body Shaping',
            paragraphs: [
              'EM BODY is a non-invasive and painless solution for strengthening muscles and shaping the figure. Using HIFEM™ technology, a single treatment triggers thousands of supramaximal muscle contractions that cannot be achieved through ordinary exercise. The muscles are forced to rebuild their internal structure, increasing their strength, tone and volume.',
              'A single 30-minute treatment delivers approximately 20,000 muscle contractions – roughly the equivalent of three weeks in the gym.',
              'The treatment is quick, comfortable and requires no recovery time. It is suitable for clients who want to strengthen muscles, tone the skin, improve posture or support weight reduction.',
              'This procedure is part of selected packages (for example Weight Loss) and can also be purchased separately by your clients at the spa receptions of our hotels.',
            ],
          },
          {
            heading: 'Local Cryotherapy',
            paragraphs: [
              'Local cryotherapy uses the targeted application of extreme cold to a selected part of the body. A short but intense application helps relieve pain, reduce inflammation and swelling, and speeds up the recovery of muscles and joints.',
              'It is particularly appreciated by clients with mobility difficulties, active athletes and anyone seeking fast relief and effective support for their spa treatments.',
              'Your clients can purchase this procedure separately at the spa receptions of our hotels.',
            ],
          },
          {
            heading: 'Mariánské Lázně Comes Alive with Culture and Sport in Summer',
            paragraphs: [
              'Over the summer, Mariánské Lázně offers several hundred cultural and sporting events. Remind your clients that a spa stay with us can be perfectly combined with a rich programme right in the town centre. We have selected the best:',
            ],
            bullets: [
              { label: 'Festivals', note: 'Craft Beer Festival (18 July), Chopin Festival – 67th edition (14–22 August) and the Wine Festival (22 August)' },
              { label: 'Concerts', note: 'Colonnade concerts by the West Bohemian Symphony Orchestra throughout the summer and the Rádio Blaník Summer Concert (24 July)' },
              { label: 'Exhibitions', note: 'Antonio Canova at Kynžvart Château and photographs by Miro Švolík at Chopin House' },
              { label: 'Theatre and family', note: 'the summer programme of the Municipal Theatre and “Kapsa plná pohádek” fairy-tale mornings for children' },
              { label: 'Sport', note: 'S-RACE obstacle race (12 July) and a vintage car meet (4 July)' },
            ],
            ctas: [
              { label: 'Nations League U23 (FIBA 3x3, 2–8 August 2026)', href: 'https://3x3.cz.basketball/reprezentace/vsechny' },
              { label: 'news.lazneml.cz', href: NEWS_LAZNEML },
            ],
          },
        ],
        closing:
          'The highlight of the sporting summer will be the prestigious international Nations League U23 tournament under FIBA 3x3, which Mariánské Lázně will host on 2–8 August 2026. We will be glad to provide you with additional information and sales-support materials for all our news. We look forward to our continued successful cooperation.',
      },

      de: {
        subject: 'Ensana News aus Marienbad – Sommer 2026',
        period: 'Juli 2026',
        summary:
          'Jubiläumsaufenthalte zum 130-jährigen Bestehen des Nové Lázně (über 100 bereits verkauft), drei neu aufgenommene Therapien — Waldtherapie, EM BODY und lokale Kryotherapie — sowie eine Auswahl aus dem sommerlichen Kultur- und Sportprogramm der Stadt.',
        highlights: [
          'Jubiläumsaufenthalte zum 130-jährigen Jubiläum des Nové Lázně — 2 Nächte ab 217 €, 6 Nächte ab 195 €',
          'Neue Waldtherapie im Kaiserwald, zweimal wöchentlich angeboten',
          'EM BODY (HIFEM™) — 30 Minuten ≈ 20 000 Muskelkontraktionen',
          'Lokale Kryotherapie gegen Schmerzen, Entzündungen und für die Regeneration',
          'Sommerprogramm: Craft Beer Festival, Chopin-Festival, FIBA 3x3 Nations League U23',
        ],
        topics: ['Nové Lázně', '130-jähriges Jubiläum', 'Jubiläumsaufenthalte', 'Waldtherapie', 'EM BODY', 'Kryotherapie', 'Sommerprogramm', 'FIBA 3x3'],
        greeting: 'Sehr geehrte Partner,',
        lead:
          'wir präsentieren Ihnen einen sommerlichen Überblick über die Neuigkeiten von Ensana Marienbad. Zunächst feiern wir das 130-jährige Jubiläum unseres Flaggschiffhotels Nové Lázně, dessen Jubiläumsaufenthalte auf außergewöhnlich großes Interesse stoßen. Anschließend stellen wir Ihnen mehrere neu aufgenommene apparative und natürliche Therapien vor, die Ihren Kunden schnelle, komfortable und sichtbare Ergebnisse ermöglichen. Zum Abschluss geben wir Ihnen Tipps zu den Highlights des sommerlichen Kultur- und Sportprogramms der Stadt.',
        sections: [
          {
            heading: '130 Jahre Hotel Nové Lázně (1896–2026)',
            paragraphs: [
              'Unser Fünf-Sterne-Hotel Ensana Nové Lázně feiert in diesem Jahr sein 130-jähriges Bestehen. Erinnern Sie Ihre Kunden an diese außergewöhnliche Geschichte: von den römischen Bädern aus dem Jahr 1896 über die private Kabine von König Eduard VII. bis hin zum größten historisch authentischen Kurkomplex Böhmens mit einer Fläche von 5.900 m².',
              'Das kurze Video ist auch für soziale Netzwerke vorbereitet. Wir freuen uns, wenn Sie es auf Ihren Kanälen teilen und Ihre Kunden auf das Jubiläum aufmerksam machen.',
              'Jubiläumsaufenthalte zum 130-jährigen Jubiläum:',
            ],
            bullets: [
              { label: 'Jubiläumsaufenthalt – 2 Nächte', note: 'ab 217 € pro Person/Nacht' },
              { label: 'Jubiläumsaufenthalt – 6 Nächte', note: 'ab 195 € pro Person/Nacht' },
            ],
            ctas: [
              { label: 'Kurzes Video zum 130-jährigen Jubiläum', href: 'https://www.youtube.com/shorts/ykGkF96dKJQ' },
              { label: 'Ausführliches Video zur Geschichte des Hotels', href: 'https://www.youtube.com/watch?v=BSaYi_TO7GE' },
              { label: 'Jubiläumsaufenthalte entdecken', href: 'https://ensanahotels.com/de/hotels/nove-lazne/130-jahre-hotel-nove-lazne' },
            ],
          },
          {
            heading: 'Waldtherapie',
            paragraphs: [
              'Marienbad ist vom Naturschutzgebiet Slavkovský les, dem Kaiserwald, umgeben. Dieser Naturreichtum bildet die Grundlage unserer neuen Waldtherapie. Ein geführter Aufenthalt im Wald, international auch als „Forest Bathing“ bzw. „Shinrin-Yoku“ bekannt, hilft dabei, Stress abzubauen, das Nervensystem zu beruhigen, das Immunsystem zu stärken und die Schlafqualität zu verbessern.',
              'Es handelt sich um eine sanfte und leicht zugängliche Aktivität, die Kur- und Wellnessaufenthalte auf natürliche Weise ergänzt. Sie spricht besonders Kunden an, die Erholung und mentales Wohlbefinden in der Natur suchen.',
              'Die Waldtherapie bieten wir zweimal wöchentlich an. Den aktuellen Terminüberblick erhalten Ihre Gäste an unseren Rezeptionen oder auf news.lazneml.cz.',
            ],
          },
          {
            heading: 'EM BODY – Körperformung',
            paragraphs: [
              'EM BODY ist eine nicht-invasive und schmerzfreie Lösung zur Muskelstärkung und Körperformung. Dank der HIFEM™-Technologie werden bei einer einzigen Behandlung Tausende supramaximaler Muskelkontraktionen ausgelöst, die durch herkömmliches Training nicht erreichbar sind. Die Muskeln werden angeregt, ihre innere Struktur umzubauen, was zu einer Steigerung von Kraft, Tonus und Volumen beitragen kann.',
              'Eine einzige 30-minütige Behandlung entspricht etwa 20.000 Muskelkontraktionen – also ungefähr dem Äquivalent von drei Wochen Training im Fitnessstudio.',
              'Die Behandlung ist schnell, komfortabel und erfordert keine Erholungszeit. Sie eignet sich für Kunden, die ihre Muskeln stärken, die Haut straffen, die Körperhaltung verbessern oder die Gewichtsreduktion unterstützen möchten.',
              'Diese Behandlung ist Bestandteil ausgewählter Pakete, zum Beispiel Weight Loss, und kann von Ihren Kunden zusätzlich an den Spa-Rezeptionen unserer Hotels gebucht werden.',
            ],
          },
          {
            heading: 'Lokale Kryotherapie',
            paragraphs: [
              'Die lokale Kryotherapie nutzt die gezielte Einwirkung extremer Kälte auf einen ausgewählten Körperbereich. Eine kurze, aber intensive Anwendung hilft, Schmerzen zu lindern, Entzündungen und Schwellungen zu reduzieren und die Regeneration von Muskeln und Gelenken zu beschleunigen.',
              'Besonders geschätzt wird sie von Kunden mit Bewegungsbeschwerden, aktiven Sportlern sowie allen, die schnelle Linderung und eine wirksame Unterstützung ihrer Heilbehandlungen suchen.',
              'Ihre Kunden können diese Behandlung zusätzlich an den Spa-Rezeptionen unserer Hotels buchen.',
            ],
          },
          {
            heading: 'Marienbad lebt im Sommer von Kultur und Sport',
            paragraphs: [
              'Marienbad bietet im Sommer mehrere Hundert Kultur- und Sportveranstaltungen. Erinnern Sie Ihre Kunden daran, dass sich ein Kuraufenthalt bei uns hervorragend mit einem abwechslungsreichen Programm direkt im Stadtzentrum verbinden lässt. Wir haben die Highlights für Sie ausgewählt:',
            ],
            bullets: [
              { label: 'Festivals', note: 'Craft Beer Festival (18. Juli), Chopin-Festival – 67. Jahrgang (14.–22. August) und Weinfestival (22. August)' },
              { label: 'Konzerte', note: 'Kolonnadenkonzerte des Westböhmischen Symphonieorchesters den ganzen Sommer über sowie das Sommerkonzert von Rádio Blaník (24. Juli)' },
              { label: 'Ausstellungen', note: 'Antonio Canova auf Schloss Kynžvart und Fotografien von Miro Švolík im Chopin-Haus' },
              { label: 'Theater und Familie', note: 'Sommerprogramm des Stadttheaters und Märchenvormittage „Kapsa plná pohádek“ für Kinder' },
              { label: 'Sport', note: 'S-RACE – Hindernislauf (12. Juli) und Oldtimertreffen (4. Juli)' },
            ],
            ctas: [
              { label: 'Nations League U23 (FIBA 3x3, 2.–8. August 2026)', href: 'https://3x3.cz.basketball/reprezentace/vsechny' },
              { label: 'news.lazneml.cz', href: NEWS_LAZNEML },
            ],
          },
        ],
        closing:
          'Der Höhepunkt des Sportsommers ist das prestigeträchtige internationale Turnier Nations League U23 unter der Schirmherrschaft von FIBA 3x3, das vom 2. bis 8. August 2026 in Marienbad ausgetragen wird. Gerne stellen wir Ihnen zu allen Neuigkeiten weitere Informationen sowie Unterlagen zur Verkaufsunterstützung zur Verfügung. Wir freuen uns auf die weitere erfolgreiche Zusammenarbeit.',
      },
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Červen 2026 — výročí Nových Lázní, Butterfly, festivaly, golf, rodiny
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: '2026-06',
    date: '2026-06-01',
    sender: IRLVEKOVA,
    content: {
      cs: {
        subject: 'Léto 2026 – výročí Nových Lázní, festivaly a rozvíjení nabídky',
        period: 'Červen 2026',
        summary:
          '130 let od přestavby Nových Lázní, rozšíření léčebné nabídky hotelu Butterfly o Tradiční a Intenzivní pobyt, festivaly Knižní a Jazzové lázně na kolonádě, golf v nejstarším českém klubu a tipy pro rodiny s dětmi.',
        highlights: [
          '130 let Nových Lázní — 1. 6. 1896–2026, Římské lázně a kabiny Edwarda VII. i Františka Josefa I.',
          'Butterfly rozšiřuje nabídku o Tradiční a Intenzivní léčebný pobyt',
          'Knižní lázně (18.–21. 6.) a Jazzové lázně (19.–24. 6.) přímo na Hlavní kolonádě',
          'Royal Golf Club — nejstarší hřiště v ČR, greenfee i Golfpass na 3 hřiště',
          'Tipy pro rodiny: Boheminium, Zrcadlový labyrint, Prelát, dančí obora',
        ],
        topics: ['Nové Lázně', '130. výročí', 'Butterfly', 'Knižní lázně', 'Jazzové lázně', 'Golf', 'Royal Golf Club', 'Rodiny s dětmi', 'Letní kapacity'],
        greeting: 'Vážení partneři,',
        lead:
          'začátek léta v Mariánských Lázních přináší hned několik důležitých novinek a událostí – od významného výročí přes rozšíření léčebných programů až po dva oblíbené kulturní festivaly přímo na naší kolonádě. Rádi bychom Vám je shrnuli v jednom newsletteru, abyste měli ucelený přehled pro nabídku Vašim klientům.',
        sections: [
          {
            heading: '130 let Nových Lázní (1. 6. 1896 – 2026)',
            paragraphs: [
              'Dne 1. června 2026 si připomínáme přesně 130 let od velkorysé přestavby Nových Lázní – jedné z nejimpozantnějších lázeňských staveb ve střední Evropě. Honosná budova se čtyřmi věžemi byla od počátku navržena pro vznešenou klientelu – léčili se zde mimo jiné anglický král Edward VII. nebo rakouský císař František Josef I.',
              'Toto výročí dnes slaví pětihvězdičkový Ensana Nové Lázně hotel, který společně s hotely Centrální Lázně, Maria Spa a Hvězda tvoří unikátní lázeňský komplex propojený krytými koridory. Hosté zde najdou Římské lázně z roku 1896 se dvěma původními bazény, Královskou kabinu Edwarda VII. a Císařskou kabinu Františka Josefa I. – autentický prostor, kde se historie potkává s moderní balneologickou péčí.',
              '130 let prestiže, tradice a královské atmosféry – silný příběh, který Vaši klienti ocení.',
            ],
            ctas: [{ label: 'Více o výročí 130 let Nových Lázní', href: 'https://ensanahotels.com/cs/hotely/nove-lazne/130-let-hotelu-nove-lazne' }],
          },
          {
            heading: 'Hotel Ensana Butterfly – léčení úspěšně rozběhnuto, rozšiřujeme nabídku',
            paragraphs: [
              'Navazujeme na dubnové oznámení o výrazně rozšířené léčebné a balneo nabídce hotelu Ensana Butterfly. Rádi Vám oznamujeme, že nové programy se úspěšně rozběhly, kapacity jsou plně využívány a první ohlasy klientů jsou velmi pozitivní.',
              'Na tomto základě nyní nabídku rozšiřujeme o dva nové typy léčebných pobytů:',
            ],
            bullets: [
              { label: 'Tradiční léčebný pobyt', note: 'komplexní lázeňská léčba pod lékařským dohledem, ideální pro klienty hledající plnohodnotnou léčbu', isNew: true },
              { label: 'Intenzivní léčebný pobyt', note: 'zvýšený počet procedur denně pro maximální léčebný efekt v kratším čase', isNew: true },
            ],
          },
          {
            heading: 'Knižní a Jazzové lázně 18.–24. 6. 2026',
            paragraphs: [
              'Mariánské Lázně v červnu žijí kulturou. Hlavní kolonáda – tedy bezprostřední sousedství našich hotelů – bude dějištěm hned dvou významných festivalů:',
            ],
            bullets: [
              { label: 'Knižní lázně (18.–21. 6. 2026)', note: 'již 7. ročník setkání malých nakladatelů a čtenářů s autorskými čteními, diskusemi, koncerty a programem zaměřeným na knižní kulturu a duševní zdraví. Ensana je hrdým hlavním partnerem festivalu.' },
              { label: 'Jazzové lázně (19.–24. 6. 2026)', note: 'jubilejní 25. ročník jednoho z nejstarších českých jazzových festivalů – šest dní hudby přímo v centru lázeňské zóny.' },
            ],
          },
          {
            heading: 'Golf v Mariánských Lázních – nejstarší hřiště v Česku',
            paragraphs: [
              'Mariánské Lázně jsou nejen lázeňským klenotem, ale také splněným snem golfistů. Royal Golf Club Mariánské Lázně, který v roce 1905 osobně otevřel již zmiňovaný anglický král Edward VII., je nejstarším golfovým hřištěm v České republice a jediným klubem v kontinentální Evropě s titulem „Royal“ – udělila jej v roce 2003 královna Alžběta II.',
              'V dosahu hostů našich hotelů je několik dalších kvalitních hřišť:',
            ],
            bullets: [
              { label: 'Cihelny Astoria Golf Club', note: '18jamkové mistrovské hřiště od designéra Garyho Playera' },
              { label: 'Golf Resort Františkovy Lázně', note: 'v srdci přírodní rezervace na řece Ohře' },
              { label: 'Sokolov Golf Club', note: '18jamkové hřiště, 22 km od Mariánských Lázní' },
            ],
            ctas: [{ label: 'Přehled golfových klubů včetně podcastu s prezidentem Royal Golf Clubu', href: 'https://ensanahotels.com/cs/destinace/ceska-republika/marianske-lazne/golf' }],
          },
          {
            heading: 'Letní dovolená s dětmi v Mariánských Lázních je ideální!',
            paragraphs: [
              'Mariánské Lázně jsou ideální destinací i pro rodiny s dětmi – pro malé i velké zde najdete pestrý program založený na přírodě, pohybu i objevování:',
            ],
            bullets: [
              { label: 'Park Boheminium', note: 'miniatury slavných českých staveb dostupné kabinkovou lanovkou' },
              { label: 'Zrcadlový labyrint', note: 'oblíbená atrakce s nezapomenutelným zážitkem pro děti' },
              { label: 'Přírodní park Prelát', note: 'ideální místo pro společné rodinné vycházky' },
              { label: 'Dančí obora', note: 'setkání se zvěří zblízka' },
              { label: 'Veřejné 9jamkové hřiště', note: 'golf i footgolf na jednom místě' },
              { label: 'Příroda v okolí', note: 'rozlehlé lázeňské parky, výlety do Slavkovského lesa, cyklotrasy a koupání' },
            ],
            ctas: [{ label: 'Video: Rodinný pobyt v Mariánských Lázních', href: 'https://www.youtube.com/watch?v=5tjAcYVIXrM' }],
          },
          {
            heading: 'Rezervujte si termín na letní dovolenou u nás co nejdříve',
            paragraphs: [
              'Letní sezóna patří k nejvyhledávanějším termínům roku. Kapacity v hlavní sezóně jsou již dnes výrazně omezené, zejména v termínech kolem prodloužených víkendů:',
            ],
            bullets: [
              { label: 'Fronleichnam', note: 'čt 4. 6. 2026 (německé spolkové země)' },
              { label: 'Cyril a Metoděj / Jan Hus', note: 'ne–po 5.–6. 7. 2026 (ČR)' },
              { label: 'Summer Bank Holiday', note: 'po 31. 8. 2026 (UK)' },
            ],
          },
        ],
        closing:
          'Doporučujeme Vašim klientům rezervovat co nejdříve. Rádi Vám poskytneme aktuální stav obsazenosti, prodejní podklady i podporu při kalkulacích. Těšíme se na další úspěšnou spolupráci.',
      },

      en: {
        subject: 'Summer 2026 – the Nové Lázně anniversary, festivals and an expanded offering',
        period: 'June 2026',
        summary:
          '130 years since the reconstruction of Nové Lázně, the Butterfly hotel expands its treatment offering with the Traditional and Intensive Spa Treatment, the Book Spa and Jazz Spa festivals on the colonnade, golf at the oldest Czech club, and tips for families with children.',
        highlights: [
          '130 years of Nové Lázně — 1 June 1896–2026, the Roman Baths and the cabins of Edward VII and Franz Joseph I',
          'Butterfly expands its offering with the Traditional and Intensive Spa Treatment',
          'Knižní lázně (18–21 June) and Jazzové lázně (19–24 June) right on the Main Colonnade',
          'Royal Golf Club — the oldest course in the country, green fee or a Golf Pass for 3 courses',
          'Family tips: Boheminium, Mirror Maze, Prelát Nature Park, Deer Park',
        ],
        topics: ['Nové Lázně', '130th anniversary', 'Butterfly', 'Book Spa Festival', 'Jazz Spa Festival', 'Golf', 'Royal Golf Club', 'Families with children', 'Summer capacity'],
        greeting: 'Dear partners,',
        lead:
          'the start of summer in Mariánské Lázně (Marienbad) brings several important updates and events – from a significant anniversary, through the expansion of our treatment programmes, to two popular cultural festivals right on our colonnade. We have brought them together in a single newsletter so that you have a complete overview for your clients.',
        sections: [
          {
            heading: '130 years of Nové Lázně (1 June 1896 – 2026)',
            paragraphs: [
              'On 1 June 2026 we mark exactly 130 years since the grand reconstruction of Nové Lázně – one of the most impressive spa buildings in Central Europe. The magnificent building with its four towers was designed from the outset for distinguished guests; among those who took the cure here were the English King Edward VII and the Austrian Emperor Franz Joseph I.',
              'This anniversary is celebrated today by the five-star Ensana Nové Lázně hotel, which together with the Centrální Lázně, Maria Spa and Hvězda hotels forms a unique spa complex connected by covered corridors. Guests will find the Roman Baths dating from 1896 with their two original pools, the Royal Cabin of Edward VII and the Imperial Cabin of Franz Joseph I – an authentic setting where history meets modern balneological care.',
              '130 years of prestige, tradition and royal atmosphere – a powerful story your clients will appreciate.',
            ],
            ctas: [{ label: 'More about the 130th anniversary of Nové Lázně', href: 'https://ensanahotels.com/cs/hotely/nove-lazne/130-let-hotelu-nove-lazne' }],
          },
          {
            heading: 'Hotel Ensana Butterfly – treatments successfully launched, expanding the offering',
            paragraphs: [
              'Following up on our April announcement of the significantly expanded medical and balneotherapy offering at the Ensana Butterfly hotel, we are pleased to report that the new programmes have got off to a successful start, capacity is being fully used and the first client feedback is very positive.',
              'Building on this, we are now expanding the offering with two new types of spa treatment:',
            ],
            bullets: [
              { label: 'Traditional Spa Treatment', note: 'comprehensive spa therapy under medical supervision, ideal for clients seeking a full course of treatment', isNew: true },
              { label: 'Intensive Spa Treatment', note: 'an increased number of procedures per day for maximum therapeutic effect in a shorter time', isNew: true },
            ],
          },
          {
            heading: 'Knižní and Jazzové lázně festivals, 18–24 June 2026',
            paragraphs: [
              'In June, Mariánské Lázně comes alive with culture. The Main Colonnade – right next to our hotels – will host two major festivals:',
            ],
            bullets: [
              { label: 'Knižní lázně (Book Spa Festival, 18–21 June 2026)', note: 'the 7th edition of this gathering of small publishers and readers, with author readings, discussions, concerts and a programme focused on book culture and mental wellbeing. Ensana is a proud main partner of the festival.' },
              { label: 'Jazzové lázně (Jazz Spa Festival, 19–24 June 2026)', note: 'the 25th anniversary edition of one of the oldest Czech jazz festivals – six days of music right in the heart of the spa district.' },
            ],
          },
          {
            heading: 'Golf in Mariánské Lázně – the oldest course in the Czech Republic',
            paragraphs: [
              'Mariánské Lázně is not only a spa gem but also a golfer’s dream. The Royal Golf Club Mariánské Lázně, opened in person in 1905 by the aforementioned English King Edward VII, is the oldest golf course in the Czech Republic and the only club in continental Europe to hold the “Royal” title – granted by Queen Elizabeth II in 2003.',
              'Within easy reach of our hotel guests are several other quality courses:',
            ],
            bullets: [
              { label: 'Cihelny Astoria Golf Club', note: 'an 18-hole championship course designed by Gary Player' },
              { label: 'Golf Resort Františkovy Lázně', note: 'in the heart of a nature reserve on the Ohře River' },
              { label: 'Sokolov Golf Club', note: 'an 18-hole course, 22 km from Mariánské Lázně' },
            ],
            ctas: [{ label: 'Overview of golf clubs, including a podcast with the Royal Golf Club president', href: 'https://ensanahotels.com/cs/destinace/ceska-republika/marianske-lazne/golf' }],
          },
          {
            heading: 'A summer holiday with children in Mariánské Lázně is ideal!',
            paragraphs: [
              'Mariánské Lázně is an ideal destination for families with children too – there is a varied programme for young and old alike, built around nature, activity and discovery:',
            ],
            bullets: [
              { label: 'Park Boheminium', note: 'miniatures of famous Czech buildings, reached by cable car' },
              { label: 'Mirror Maze', note: 'a popular attraction offering an unforgettable experience for children' },
              { label: 'Prelát Nature Park', note: 'an ideal spot for family walks together' },
              { label: 'Deer Park', note: 'meet wildlife up close' },
              { label: 'Public 9-hole course', note: 'golf and footgolf in one place' },
              { label: 'Nature nearby', note: 'extensive spa parks, trips to the Slavkov Forest, cycling routes and swimming' },
            ],
            ctas: [{ label: 'Video: A family stay in Mariánské Lázně', href: 'https://www.youtube.com/watch?v=5tjAcYVIXrM' }],
          },
          {
            heading: 'Book your summer holiday dates with us as early as possible',
            paragraphs: [
              'The summer season is one of the most sought-after times of the year. Capacity in the high season is already significantly limited, especially around the long weekends and school holidays:',
            ],
            bullets: [
              { label: 'Summer Bank Holiday (Scotland)', note: 'Mon 3 Aug 2026' },
              { label: 'Summer Bank Holiday (England, Wales & NI)', note: 'Mon 31 Aug 2026' },
              { label: 'UK school summer holidays', note: 'approx. mid-July to early September' },
            ],
          },
        ],
        closing:
          'We recommend that your clients book as early as possible. We are happy to provide current availability, sales materials and support with quotations. We look forward to our continued successful cooperation.',
      },

      de: {
        subject: 'Sommer 2026 – Jubiläum des Nové Lázně, Festivals und ein erweitertes Angebot',
        period: 'Juni 2026',
        summary:
          '130 Jahre seit dem Umbau des Nové Lázně, das Hotel Butterfly erweitert sein Heilangebot um den Traditionellen und den Intensiven Kuraufenthalt, die Festivals Knižní und Jazzové lázně auf der Kolonnade, Golf im ältesten tschechischen Club sowie Tipps für Familien mit Kindern.',
        highlights: [
          '130 Jahre Nové Lázně — 1. 6. 1896–2026, Römische Bäder und die Kabinen Eduards VII. und Franz Josephs I.',
          'Butterfly erweitert das Angebot um den Traditionellen und den Intensiven Kuraufenthalt',
          'Knižní lázně (18.–21. 6.) und Jazzové lázně (19.–24. 6.) direkt auf der Hauptkolonnade',
          'Royal Golf Club — ältester Platz Tschechiens, Greenfee oder Golfpass für 3 Plätze',
          'Familientipps: Boheminium, Spiegellabyrinth, Naturpark Prelát, Damwildgehege',
        ],
        topics: ['Nové Lázně', '130-jähriges Jubiläum', 'Butterfly', 'Knižní lázně', 'Jazzové lázně', 'Golf', 'Royal Golf Club', 'Familien mit Kindern', 'Sommerkapazitäten'],
        greeting: 'Sehr geehrte Partner,',
        lead:
          'der Sommeranfang in Marienbad bringt gleich mehrere wichtige Neuigkeiten und Ereignisse – von einem bedeutenden Jubiläum über die Erweiterung unserer Heilprogramme bis hin zu zwei beliebten Kulturfestivals direkt auf unserer Kolonnade. Wir haben sie in einem Newsletter zusammengefasst, damit Sie einen vollständigen Überblick für Ihre Kunden haben.',
        sections: [
          {
            heading: '130 Jahre Nové Lázně (1. 6. 1896 – 2026)',
            paragraphs: [
              'Am 1. Juni 2026 jährt sich der großzügige Umbau des Nové Lázně – eines der eindrucksvollsten Kurgebäude Mitteleuropas – zum genau 130. Mal. Das prächtige Gebäude mit seinen vier Türmen war von Anfang an für vornehme Gäste konzipiert; hier kurten unter anderem der englische König Eduard VII. und der österreichische Kaiser Franz Joseph I.',
              'Dieses Jubiläum feiert heute das Fünf-Sterne-Hotel Ensana Nové Lázně, das gemeinsam mit den Hotels Centrální Lázně, Maria Spa und Hvězda einen einzigartigen, durch überdachte Korridore verbundenen Kurkomplex bildet. Gäste finden hier die Römischen Bäder von 1896 mit zwei originalen Becken, die Königskabine Eduards VII. und die Kaiserkabine Franz Josephs I. – ein authentischer Raum, in dem Geschichte auf moderne balneologische Betreuung trifft.',
              '130 Jahre Prestige, Tradition und königliche Atmosphäre – eine starke Geschichte, die Ihre Kunden zu schätzen wissen.',
            ],
            ctas: [{ label: 'Mehr zum 130-jährigen Jubiläum des Nové Lázně', href: 'https://ensanahotels.com/cs/hotely/nove-lazne/130-let-hotelu-nove-lazne' }],
          },
          {
            heading: 'Hotel Ensana Butterfly – Heilbehandlungen erfolgreich gestartet, wir erweitern das Angebot',
            paragraphs: [
              'Wir knüpfen an unsere Ankündigung vom April über das deutlich erweiterte Heil- und Balneoangebot des Hotels Ensana Butterfly an. Gerne teilen wir Ihnen mit, dass die neuen Programme erfolgreich angelaufen sind, die Kapazitäten voll ausgelastet werden und die ersten Kundenrückmeldungen sehr positiv ausfallen.',
              'Auf dieser Grundlage erweitern wir das Angebot nun um zwei neue Arten von Kuraufenthalten:',
            ],
            bullets: [
              { label: 'Traditioneller Kuraufenthalt', note: 'umfassende Kurbehandlung unter ärztlicher Aufsicht, ideal für Kunden, die eine vollwertige Therapie suchen', isNew: true },
              { label: 'Intensiver Kuraufenthalt', note: 'erhöhte Anzahl an Anwendungen pro Tag für maximale Heilwirkung in kürzerer Zeit', isNew: true },
            ],
          },
          {
            heading: 'Knižní und Jazzové lázně, 18.–24. 6. 2026',
            paragraphs: [
              'Im Juni lebt Marienbad von der Kultur. Die Hauptkolonnade – also die unmittelbare Nachbarschaft unserer Hotels – wird Schauplatz gleich zweier bedeutender Festivals:',
            ],
            bullets: [
              { label: 'Knižní lázně (Bücher-Kurbad, 18.–21. 6. 2026)', note: 'bereits der 7. Jahrgang dieses Treffens kleiner Verlage und Leser mit Autorenlesungen, Diskussionen, Konzerten und einem Programm rund um Buchkultur und seelische Gesundheit. Ensana ist stolzer Hauptpartner des Festivals.' },
              { label: 'Jazzové lázně (Jazz-Kurbad, 19.–24. 6. 2026)', note: 'der 25. Jubiläumsjahrgang eines der ältesten tschechischen Jazzfestivals – sechs Tage Musik mitten im Herzen der Kurzone.' },
            ],
          },
          {
            heading: 'Golf in Marienbad – der älteste Platz Tschechiens',
            paragraphs: [
              'Marienbad ist nicht nur ein Kurjuwel, sondern auch ein wahr gewordener Traum für Golfer. Der Royal Golf Club Mariánské Lázně, den der bereits erwähnte englische König Eduard VII. im Jahr 1905 persönlich eröffnete, ist der älteste Golfplatz Tschechiens und der einzige Club in Kontinentaleuropa mit dem Titel „Royal“ – verliehen 2003 von Königin Elisabeth II.',
              'In Reichweite unserer Hotelgäste liegen mehrere weitere hochwertige Plätze:',
            ],
            bullets: [
              { label: 'Cihelny Astoria Golf Club', note: '18-Loch-Meisterschaftsplatz des Designers Gary Player' },
              { label: 'Golf Resort Františkovy Lázně', note: 'im Herzen eines Naturschutzgebiets an der Eger' },
              { label: 'Sokolov Golf Club', note: '18-Loch-Platz, 22 km von Marienbad entfernt' },
            ],
            ctas: [{ label: 'Übersicht der Golfclubs inklusive Podcast mit dem Präsidenten des Royal Golf Clubs', href: 'https://ensanahotels.com/cs/destinace/ceska-republika/marianske-lazne/golf' }],
          },
          {
            heading: 'Sommerurlaub mit Kindern in Marienbad ist ideal!',
            paragraphs: [
              'Marienbad ist auch für Familien mit Kindern ein ideales Reiseziel – für Klein und Groß gibt es ein abwechslungsreiches Programm rund um Natur, Bewegung und Entdecken:',
            ],
            bullets: [
              { label: 'Park Boheminium', note: 'Miniaturen berühmter tschechischer Bauwerke, erreichbar mit der Kabinenseilbahn' },
              { label: 'Spiegellabyrinth', note: 'beliebte Attraktion mit einem unvergesslichen Erlebnis für Kinder' },
              { label: 'Naturpark Prelát', note: 'idealer Ort für gemeinsame Familienspaziergänge' },
              { label: 'Damwildgehege', note: 'Begegnung mit Wildtieren aus nächster Nähe' },
              { label: 'Öffentlicher 9-Loch-Platz', note: 'Golf und Fußgolf an einem Ort' },
              { label: 'Natur in der Umgebung', note: 'weitläufige Kurparks, Ausflüge in den Kaiserwald, Radwege und Badegelegenheiten' },
            ],
            ctas: [{ label: 'Video: Ein Familienaufenthalt in Marienbad', href: 'https://www.youtube.com/watch?v=5tjAcYVIXrM' }],
          },
          {
            heading: 'Buchen Sie Ihren Sommerurlaub bei uns so früh wie möglich',
            paragraphs: [
              'Die Sommersaison gehört zu den gefragtesten Zeiten des Jahres. Die Kapazitäten in der Hauptsaison sind bereits jetzt deutlich begrenzt, insbesondere rund um die langen Wochenenden und Ferien:',
            ],
            bullets: [
              { label: 'Fronleichnam', note: 'Do 4. 6. 2026 (in mehreren Bundesländern)' },
              { label: 'Mariä Himmelfahrt', note: 'Sa 15. 8. 2026 (Saarland und Teile Bayerns)' },
              { label: 'Sommerferien', note: 'ca. Ende Juni bis Mitte September (je nach Bundesland)' },
            ],
          },
        ],
        closing:
          'Wir empfehlen Ihren Kunden, so früh wie möglich zu buchen. Gerne stellen wir Ihnen die aktuelle Verfügbarkeit, Verkaufsunterlagen und Unterstützung bei Kalkulationen zur Verfügung. Wir freuen uns auf die weitere erfolgreiche Zusammenarbeit.',
      },
    },
  },
]

/** Adresa archivu v daném jazyce (čeština má vlastní vstupní bod bez segmentu). */
export function archiveUrl(lang: NewsletterLang): string {
  return lang === 'cs' ? '/introduce/newsletter-ck' : `/introduce/newsletter-ck/${lang}`
}

/** Adresa konkrétního čísla v daném jazyce. */
export function issueUrl(lang: NewsletterLang, slug: string): string {
  return `/introduce/newsletter-ck/${lang}/${slug}`
}

/**
 * Mapy pro `Base`.
 *
 * `alternates` jsou skutečné jazykové verze téže stránky (hreflang). Ruština
 * verzi nemá, proto v nich chybí — hreflang nesmí ukazovat na neekvivalentní
 * stránku. `switcher` navíc ruštinu směruje na anglickou verzi, aby přepínač
 * jazyků v hlavičce návštěvníka nevyhodil z newsletteru na homepage.
 */
export const newsletterArchiveAlternates = {
  cs: archiveUrl('cs'),
  en: archiveUrl('en'),
  de: archiveUrl('de'),
}

export const newsletterArchiveSwitcher = {
  ...newsletterArchiveAlternates,
  ru: archiveUrl('en'),
}

export function issueAlternates(slug: string) {
  return {
    cs: issueUrl('cs', slug),
    en: issueUrl('en', slug),
    de: issueUrl('de', slug),
  }
}

export function issueSwitcher(slug: string) {
  return { ...issueAlternates(slug), ru: issueUrl('en', slug) }
}

/** Archiv seřazený od nejnovějšího čísla. */
export const newslettersByDate = [...ckNewsletters].sort((a, b) => b.date.localeCompare(a.date))

export function getNewsletter(slug: string): Newsletter | undefined {
  return ckNewsletters.find((n) => n.slug === slug)
}

/**
 * Text, ve kterém hledá filtr v archivu — titulek, shrnutí, hlavní body, štítky
 * i nadpisy sekcí ze všech jazykových verzí, aby CK našla číslo bez ohledu na to,
 * jakým jazykem hledá.
 */
export function searchIndexFor(n: Newsletter): string {
  return newsletterLangs
    .flatMap((lang) => {
      const c = n.content[lang]
      return [c.subject, c.period, c.summary, ...c.highlights, ...c.topics, ...c.sections.map((s) => s.heading)]
    })
    .join(' ')
    .toLowerCase()
}
