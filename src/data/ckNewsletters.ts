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
  cta?: { label: string; href: string }
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

export const ckNewsletters: Newsletter[] = [
  {
    slug: '2026-08',
    date: '2026-08-01',
    attachments: [
      { label: { cs: 'Leták hotelu Butterfly — česky', en: 'Butterfly hotel leaflet — Czech', de: 'Hotelprospekt Butterfly — Tschechisch' } },
      { label: { cs: 'Leták hotelu Butterfly — anglicky', en: 'Butterfly hotel leaflet — English', de: 'Hotelprospekt Butterfly — Englisch' } },
      { label: { cs: 'Leták hotelu Butterfly — německy', en: 'Butterfly hotel leaflet — German', de: 'Hotelprospekt Butterfly — Deutsch' } },
    ],
    sender: IRLVEKOVA,
    content: {
      cs: {
        subject: 'Ensana News — Srpen 2026',
        period: 'Srpen 2026',
        summary:
          'Hotel Ensana Butterfly nově nabízí Tradiční a Intenzivní léčebný pobyt. Číslo shrnuje celé portfolio pobytů, léčebnou péči u Ferdinandova pramene, letáky hotelu ve třech jazycích a přehled srpnových a zářijových akcí ve městě.',
        highlights: [
          'Dvě novinky v Butterfly: Tradiční (3 procedury/noc) a Intenzivní (4 procedury/noc) lázeňský pobyt',
          'Lékař i zdravotní sestra přímo v hotelu, Ferdinandův pramen vyvěrá v budově',
          'Letáky hotelu Butterfly v CZ, EN a DE k volnému použití',
          'Kalendář akcí na srpen a září — Chopinův festival, FIBA 3x3, Dny evropského dědictví',
        ],
        topics: [
          'Butterfly',
          'Léčebné pobyty',
          'Ferdinandův pramen',
          'Letáky',
          'Kalendář akcí',
          'Chopinův festival',
          'Výlety',
          'Podklady pro CK',
        ],
        greeting: 'Vážení partneři,',
        lead:
          'v srpnovém vydání se zaměřujeme na hotel Ensana Butterfly — lázeňský hotel s vlastním Ferdinandovým pramenem přímo v centru Mariánských Lázní. Nově do jeho nabídky přidáváme Tradiční a Intenzivní léčebný pobyt. V příloze zároveň najdete tři letáky hotelu (CZ, EN, DE) připravené k použití při komunikaci s klienty. Přidáváme také přehled akcí, které Mariánské Lázně nabídnou v srpnu a září.',
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
          },
          {
            heading: 'Lázeňská a léčebná péče pod odborným dohledem',
            paragraphs: [
              'Hotel Ensana Butterfly spojuje komfortní pobyt s profesionální léčebnou péčí. Přímo v hotelu je k dispozici lékař i zdravotní sestra, takže Vaši klienti mají odbornou péči na dosah po celou dobu pobytu.',
              'Ferdinandův pramen vyvěrá přímo v hotelu a využívá se pro minerální koupele i pitnou kúru. Oproti ostatním minerálním vodám příznivě působí i na kožní obtíže.',
              'Indikace zahrnují nemoci ledvin a močových cest, pohybového aparátu, dýchacího, oběhového a trávicího systému, nemoci metabolické, onkologické, neurologické, štítné žlázy a kožní obtíže.',
              'Z dalších léčebných procedur je k dispozici také přírodní peloid — rašelina. K wellness zázemí patří bazén 12 × 6 m s vířivkou, sauna a fitness.',
            ],
          },
          {
            heading: 'Letáky ke stažení a sdílení',
            paragraphs: [
              'V příloze původního e-mailu najdete tři letáky hotelu Butterfly — v češtině, angličtině a němčině. Můžete je rovnou využít při komunikaci s klienty i ve vlastních prodejních materiálech.',
            ],
          },
          {
            heading: 'Co se děje v Mariánských Lázních v srpnu a září',
            paragraphs: [
              'Pobyt v Mariánských Lázních lze i na konci léta skvěle spojit s bohatým kulturním a sportovním programem přímo v centru města. V Mariánských Lázních se v červenci úspěšně odehrál charitativní golfový turnaj Royal Golf Clubu (16. 7.) a nabitý program pokračuje i dál. Vybrali jsme to nejzajímavější:',
              'Srpen',
            ],
            bullets: [
              { label: 'FIBA 3x3 Nations League U23', note: 'mezinárodní basketbalový turnaj, 2.–8. 8.' },
              { label: 'Billie Jean King Cup Juniors by Gainbridge', note: 'mezinárodní juniorský tenisový turnaj, TCF Schicht Mariánské Lázně, Anglická 744, 3.–5. 8.' },
              { label: 'Chopinův festival', note: '67. ročník, 14.–22. 8.' },
              { label: 'Festival vína na kolonádě', note: '22. 8.' },
              { label: 'Výstava klavírů C. Bechstein', note: '12.–22. 8., a kolonádní koncerty Západočeského symfonického orchestru' },
            ],
          },
          {
            heading: 'Září',
            bullets: [
              { label: 'Dny evropského dědictví', note: 'jedinečná možnost poznat město, 7.–20. 9.' },
              { label: 'Zpřístupnění Domu Chopin a Anglikánské kaple', note: '12. 9.' },
              { label: 'Závěrečný kolonádní koncert sezóny 2026', note: '12. 9.' },
              { label: 'Podzimní program Městského divadla', note: 'opereta, činohra i koncerty' },
            ],
            paragraphs: [
              'Vlastní program pořádaný našimi lázněmi — přednášky, koncerty a výstavy v našich hotelech — najdou Vaši hosté na news.lazneml.cz.',
            ],
          },
          {
            heading: 'Tipy na výlety pro Vaše hosty',
            paragraphs: [
              'Mariánské Lázně jsou skvělým výchozím bodem pro výlety po západních Čechách i za hranice. Na portálu marienbad.com najdou Vaši klienti přes 70 tipů na výlety — s filtry podle typu, náročnosti i vhodnosti (bez auta, s kočárkem, se psem, i za deště). Mezi nejoblíbenější patří Karlovy Vary, Plzeň, hrad Loket, naučná stezka Kladská a klášter Teplá.',
            ],
            cta: { label: 'Prohlédnout tipy na výlety', href: '/cs/vylety' },
          },
          {
            heading: 'Pro cestovní kanceláře: vše na jednom místě',
            paragraphs: [
              'Pro naše partnery jsme připravili jedno centrální místo s dalšími materiály: prezentace destinace i hotelů, informace o lázeňské péči a MICE, fotogalerii a videa a firemní údaje připravené ke zkopírování do Vašich systémů. Vše je zdarma k použití ve Vašem prodeji a marketingu.',
            ],
            cta: { label: 'Stáhnout fotky a katalogy', href: '/introduce' },
          },
        ],
        closing:
          'Rádi Vám ke všem novinkám poskytneme doplňující informace i podklady pro podporu prodeje. Těšíme se na další úspěšnou spolupráci.',
      },

      en: {
        subject: 'Ensana News — August 2026',
        period: 'August 2026',
        summary:
          'Ensana Butterfly adds the Traditional and Intensive spa treatment stays. The issue covers the full stay portfolio, the medical care around the Ferdinand Spring, hotel leaflets in three languages, and what is on in town in August and September.',
        highlights: [
          'Two new stays at Butterfly: Traditional (3 treatments/night) and Intensive (4 treatments/night)',
          'Doctor and nurse on site, with the Ferdinand Spring rising inside the hotel',
          'Butterfly hotel leaflets in CZ, EN and DE, free to use',
          'Events calendar for August and September — Chopin Festival, FIBA 3x3, European Heritage Days',
        ],
        topics: [
          'Butterfly',
          'Spa stays',
          'Ferdinand Spring',
          'Leaflets',
          'Events calendar',
          'Chopin Festival',
          'Day trips',
          'Trade materials',
        ],
        greeting: 'Dear partners,',
        lead:
          'this August issue focuses on Ensana Butterfly — a spa hotel with its own Ferdinand Spring right in the centre of Mariánské Lázně. We are adding the Traditional and Intensive spa treatment stays to its offer. The original e-mail also carried three hotel leaflets (CZ, EN, DE) ready for use in your client communication. We are also including an overview of what Mariánské Lázně has on in August and September.',
        sections: [
          {
            heading: 'New spa stays at Ensana Butterfly',
            paragraphs: [
              'We are adding the Traditional and Intensive spa treatment stays to the Ensana Butterfly offer. Every spa stay includes an initial medical examination, treatments drawing on natural resources, the healing water of the Ferdinand Spring, free use of the pool and sauna throughout the stay, and parking in the underground garage.',
              'The stay portfolio, all with treatments and either half board or full board:',
            ],
            bullets: [
              { label: 'Mini cure', note: 'from 2 nights, 1 treatment per person per night' },
              { label: 'Spa treatment stay', note: 'from 5 nights, 2 treatments per person per night' },
              { label: 'Traditional spa stay', note: 'from 5 nights, 3 treatments per person per night', isNew: true },
              { label: 'Intensive spa stay', note: 'from 6 nights, 4 treatments per person per night', isNew: true },
            ],
          },
          {
            heading: 'Spa and medical care under professional supervision',
            paragraphs: [
              'Ensana Butterfly combines a comfortable stay with professional medical care. A doctor and a nurse are available in the hotel itself, so your clients have expert care within reach for the whole stay.',
              'The Ferdinand Spring rises inside the hotel and is used for mineral baths and for the drinking cure. Compared with the other mineral waters it also has a beneficial effect on skin complaints.',
              'Indications cover diseases of the kidneys and urinary tract, the musculoskeletal, respiratory, circulatory and digestive systems, along with metabolic, oncological, neurological and thyroid conditions and skin complaints.',
              'Natural peloid — peat — is available among the other treatments. The wellness facilities include a 12 × 6 m pool with a whirlpool, a sauna and a fitness room.',
            ],
          },
          {
            heading: 'Leaflets to download and share',
            paragraphs: [
              'The original e-mail carried three Butterfly hotel leaflets — in Czech, English and German. You are welcome to use them directly in client communication and in your own sales materials.',
            ],
          },
          {
            heading: "What is on in Mariánské Lázně in August and September",
            paragraphs: [
              'Even at the end of summer, a stay in Mariánské Lázně combines beautifully with a full cultural and sporting programme right in the centre of town. The Royal Golf Club charity golf tournament took place successfully in July (16 July) and the busy programme continues. Our picks:',
              'August',
            ],
            bullets: [
              { label: 'FIBA 3x3 Nations League U23', note: 'international basketball tournament, 2–8 August' },
              { label: 'Billie Jean King Cup Juniors by Gainbridge', note: 'international junior tennis tournament, TCF Schicht Mariánské Lázně, Anglická 744, 3–5 August' },
              { label: 'Chopin Festival', note: '67th edition, 14–22 August' },
              { label: 'Wine Festival on the colonnade', note: '22 August' },
              { label: 'C. Bechstein piano exhibition', note: '12–22 August, alongside colonnade concerts by the West Bohemian Symphony Orchestra' },
            ],
          },
          {
            heading: 'September',
            bullets: [
              { label: 'European Heritage Days', note: 'a rare chance to get to know the town, 7–20 September' },
              { label: 'Chopin House and the Anglican Chapel open to visitors', note: '12 September' },
              { label: 'Closing colonnade concert of the 2026 season', note: '12 September' },
              { label: 'Autumn programme of the Municipal Theatre', note: 'operetta, drama and concerts' },
            ],
            paragraphs: [
              'The programme run by our own spa — talks, concerts and exhibitions in our hotels — is listed for your guests at news.lazneml.cz.',
            ],
          },
          {
            heading: 'Day-trip ideas for your guests',
            paragraphs: [
              'Mariánské Lázně is an excellent base for trips across West Bohemia and across the border. On marienbad.com your clients will find more than 70 day-trip ideas — filterable by type, difficulty and suitability (car-free, pushchair-friendly, dog-friendly, and rainy-day options). Among the most popular are Karlovy Vary, Plzeň, Loket Castle, the Kladská nature trail and the Teplá Monastery.',
            ],
            cta: { label: 'Browse the day trips', href: '/en/day-trips' },
          },
          {
            heading: 'For travel agencies: everything in one place',
            paragraphs: [
              'We have put together a single hub for our partners with further materials: destination and hotel presentations, information on spa care and MICE, a photo and video library, and company details ready to copy into your systems. All of it is free to use in your sales and marketing.',
            ],
            cta: { label: 'Download photos and catalogues', href: '/introduce' },
          },
        ],
        closing:
          'We are happy to provide further information and sales-support materials on any of these items. We look forward to continuing our successful cooperation.',
      },

      de: {
        subject: 'Ensana News — August 2026',
        period: 'August 2026',
        summary:
          'Das Ensana Butterfly nimmt den Traditionellen und den Intensiven Kuraufenthalt neu ins Angebot. Die Ausgabe fasst das gesamte Aufenthaltsportfolio, die ärztliche Betreuung an der Ferdinand-Quelle, die Hotelprospekte in drei Sprachen und die Veranstaltungen im August und September zusammen.',
        highlights: [
          'Zwei Neuheiten im Butterfly: Traditioneller (3 Anwendungen/Nacht) und Intensiver Kuraufenthalt (4 Anwendungen/Nacht)',
          'Arzt und Krankenschwester direkt im Haus, die Ferdinand-Quelle entspringt im Hotel',
          'Hotelprospekte Butterfly in CZ, EN und DE zur freien Verwendung',
          'Veranstaltungskalender für August und September — Chopin-Festival, FIBA 3x3, Tage des europäischen Kulturerbes',
        ],
        topics: [
          'Butterfly',
          'Kuraufenthalte',
          'Ferdinand-Quelle',
          'Prospekte',
          'Veranstaltungskalender',
          'Chopin-Festival',
          'Ausflüge',
          'Unterlagen für Reisebüros',
        ],
        greeting: 'Sehr geehrte Partner,',
        lead:
          'die Augustausgabe widmet sich dem Hotel Ensana Butterfly — einem Kurhotel mit eigener Ferdinand-Quelle mitten im Zentrum von Marienbad. Neu nehmen wir den Traditionellen und den Intensiven Kuraufenthalt in sein Angebot auf. Der ursprünglichen E-Mail lagen zudem drei Hotelprospekte (CZ, EN, DE) bei, die Sie direkt in der Kundenkommunikation einsetzen können. Ergänzend finden Sie eine Übersicht der Veranstaltungen, die Marienbad im August und September bietet.',
        sections: [
          {
            heading: 'Neue Kuraufenthalte im Ensana Butterfly',
            paragraphs: [
              'Neu nehmen wir den Traditionellen und den Intensiven Kuraufenthalt in das Angebot des Hotels Ensana Butterfly auf. Jeder Kuraufenthalt umfasst die ärztliche Eingangsuntersuchung, Anwendungen aus natürlichen Heilmitteln, das Heilwasser der Ferdinand-Quelle, die kostenfreie Nutzung von Schwimmbad und Sauna während des gesamten Aufenthalts sowie das Parken in der Tiefgarage.',
              'Übersicht der Aufenthalte mit Anwendungen (Halbpension oder Vollpension):',
            ],
            bullets: [
              { label: 'Minikur', note: 'ab 2 Nächten, 1 Anwendung pro Person und Nacht' },
              { label: 'Kuraufenthalt', note: 'ab 5 Nächten, 2 Anwendungen pro Person und Nacht' },
              { label: 'Traditioneller Kuraufenthalt', note: 'ab 5 Nächten, 3 Anwendungen pro Person und Nacht', isNew: true },
              { label: 'Intensiver Kuraufenthalt', note: 'ab 6 Nächten, 4 Anwendungen pro Person und Nacht', isNew: true },
            ],
          },
          {
            heading: 'Kur und Heilbehandlung unter fachlicher Aufsicht',
            paragraphs: [
              'Das Hotel Ensana Butterfly verbindet einen komfortablen Aufenthalt mit professioneller medizinischer Betreuung. Im Hotel stehen ein Arzt und eine Krankenschwester zur Verfügung, sodass Ihre Kunden während des gesamten Aufenthalts fachliche Betreuung in Reichweite haben.',
              'Die Ferdinand-Quelle entspringt direkt im Hotel und wird für Mineralbäder wie auch für die Trinkkur genutzt. Im Vergleich zu den übrigen Mineralwässern wirkt sie zusätzlich günstig auf Hautbeschwerden.',
              'Zu den Indikationen zählen Erkrankungen der Nieren und Harnwege, des Bewegungsapparats, der Atemwege, des Kreislaufs und des Verdauungssystems sowie Stoffwechsel-, onkologische, neurologische und Schilddrüsenerkrankungen und Hautbeschwerden.',
              'Als weiteres Heilmittel steht das natürliche Peloid — Moor — zur Verfügung. Zum Wellnessbereich gehören ein Schwimmbad von 12 × 6 m mit Whirlpool, eine Sauna und ein Fitnessraum.',
            ],
          },
          {
            heading: 'Prospekte zum Herunterladen und Weitergeben',
            paragraphs: [
              'Der ursprünglichen E-Mail lagen drei Prospekte des Hotels Butterfly bei — auf Tschechisch, Englisch und Deutsch. Sie können sie unmittelbar in der Kundenkommunikation und in Ihren eigenen Verkaufsunterlagen verwenden.',
            ],
          },
          {
            heading: 'Was in Marienbad im August und September los ist',
            paragraphs: [
              'Auch am Ende des Sommers lässt sich ein Aufenthalt in Marienbad hervorragend mit einem reichen Kultur- und Sportprogramm direkt im Stadtzentrum verbinden. Im Juli fand in Marienbad das Charity-Golfturnier des Royal Golf Clubs statt (16. 7.), und das dichte Programm geht weiter. Unsere Auswahl:',
              'August',
            ],
            bullets: [
              { label: 'FIBA 3x3 Nations League U23', note: 'internationales Basketballturnier, 2.–8. 8.' },
              { label: 'Billie Jean King Cup Juniors by Gainbridge', note: 'internationales Junioren-Tennisturnier, TCF Schicht Marienbad, Anglická 744, 3.–5. 8.' },
              { label: 'Chopin-Festival', note: '67. Jahrgang, 14.–22. 8.' },
              { label: 'Weinfest auf der Kolonnade', note: '22. 8.' },
              { label: 'Klavierausstellung C. Bechstein', note: '12.–22. 8., dazu Kolonnadenkonzerte des Westböhmischen Symphonieorchesters' },
            ],
          },
          {
            heading: 'September',
            bullets: [
              { label: 'Tage des europäischen Kulturerbes', note: 'eine einzigartige Gelegenheit, die Stadt kennenzulernen, 7.–20. 9.' },
              { label: 'Öffnung des Chopin-Hauses und der Anglikanischen Kapelle', note: '12. 9.' },
              { label: 'Abschlusskonzert der Kolonnadensaison 2026', note: '12. 9.' },
              { label: 'Herbstprogramm des Stadttheaters', note: 'Operette, Schauspiel und Konzerte' },
            ],
            paragraphs: [
              'Das von unserem Kurbetrieb selbst veranstaltete Programm — Vorträge, Konzerte und Ausstellungen in unseren Hotels — finden Ihre Gäste auf news.lazneml.cz.',
            ],
          },
          {
            heading: 'Ausflugstipps für Ihre Gäste',
            paragraphs: [
              'Marienbad ist ein hervorragender Ausgangspunkt für Ausflüge durch Westböhmen und über die Grenze. Auf dem Portal marienbad.com finden Ihre Kunden über 70 Ausflugstipps — mit Filtern nach Art, Schwierigkeit und Eignung (ohne Auto, mit Kinderwagen, mit Hund, auch bei Regen). Zu den beliebtesten zählen Karlsbad, Pilsen, die Burg Loket, der Lehrpfad Kladská und das Kloster Tepl.',
            ],
            cta: { label: 'Ausflugstipps ansehen', href: '/de/ausfluege' },
          },
          {
            heading: 'Für Reisebüros: alles an einem Ort',
            paragraphs: [
              'Für unsere Partner haben wir eine zentrale Stelle mit weiteren Unterlagen eingerichtet: Präsentationen der Destination und der Hotels, Informationen zu Kurbehandlung und MICE, eine Foto- und Videogalerie sowie Firmendaten, die sich direkt in Ihre Systeme kopieren lassen. Alles steht Ihnen für Vertrieb und Marketing kostenfrei zur Verfügung.',
            ],
            cta: { label: 'Fotos und Kataloge herunterladen', href: '/introduce' },
          },
        ],
        closing:
          'Zu allen Neuigkeiten stellen wir Ihnen gerne ergänzende Informationen und Unterlagen zur Verkaufsunterstützung bereit. Wir freuen uns auf die weitere erfolgreiche Zusammenarbeit.',
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
