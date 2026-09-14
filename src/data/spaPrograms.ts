import type { Locale } from '@/i18n/config'
import { routes } from '@/i18n/config'

/**
 * Skladba léčebných pobytů a nadstandardní programy Nových Lázní.
 *
 * Proč to existuje: dotaz „kolik procedur denně“ a „co je v ceně“ patří
 * k nejčastějším a web na něj neodpovídal. Odpověď je přitom pevná a
 * ověřitelná — počet procedur na noc je součástí definice pobytu.
 *
 * Zdrojem je léčebná brožura provozovatele a jeho veřejné stránky
 * s nabídkami. Ceny se sem záměrně nepíšou: mění se podle sezóny a hotelu
 * a patří na rezervační web, ne sem.
 */

export interface StayType {
  /** Jak pobyt pojmenovat pro čtenáře, ne nutně obchodní název balíčku. */
  name: string
  /** Nejkratší délka, např. „ab 7 Nächten“. */
  length: string
  /** Počet procedur na noc. */
  treatments: string
  /** Co pobyt obsahuje, položka po položce. */
  includes: string[]
  /** Komu se hodí. */
  forWhom: string
}

export interface SuperiorProgram {
  name: string
  forWhom: string
  body: string
}

export interface ProgramSource {
  title: string
  url: string
  note?: string
}

export interface ProgramsContent {
  navLabel: string
  title: string
  h1: string
  metaTitle: string
  metaDescription: string
  lead: string
  /** Co má každý léčebný pobyt společné. */
  commonHeading: string
  commonBody: string
  staysHeading: string
  stays: StayType[]
  /** Kdo určuje počet a skladbu procedur. */
  decidesHeading: string
  decidesBody: string
  /** Z čeho se procedury vybírají. */
  menuHeading: string
  menuGroups: { name: string; items: string }[]
  labHeading: string
  labBody: string
  superiorHeading: string
  superiorLead: string
  superior: SuperiorProgram[]
  disclaimer: string
  faqs: { question: string; answer: string }[]
  sources: ProgramSource[]
  related: { label: string; href: string }[]
  reviewDate: string
}

export function programmesHref(locale: Locale): string {
  return `/${locale}/${routes['spa-programmes'][locale]}`
}

export function programmesAlternates(): Record<Locale, string> {
  return Object.fromEntries(
    (['de', 'en', 'cs', 'ru'] as Locale[]).map((l) => [l, programmesHref(l)]),
  ) as Record<Locale, string>
}

const LAZNEML = 'https://lazneml.cz/komplexni-lazenska-pece/'
const ENSANA_OFFERS = 'https://ensanahotels.com/cs/destinace/ceska-republika/marianske-lazne'

export const programmes: Partial<Record<Locale, ProgramsContent>> = {
  de: {
    navLabel: 'Kurpakete und Programme',
    title: 'Kurpakete in Marienbad: Anwendungen, Dauer, Inhalt',
    h1: 'Welche Kurpakete es gibt und was drin ist',
    metaTitle: 'Kurpakete in Marienbad — wie viele Anwendungen?',
    metaDescription:
      'Wie viele Anwendungen pro Nacht, was im Paket enthalten ist und welche Zusatzprogramme es gibt — die Kurpakete in Marienbad im Überblick.',
    lead:
      'Der Unterschied zwischen den Kurpaketen liegt vor allem in einer Zahl: wie viele Anwendungen pro Übernachtung im Preis enthalten sind. Daran hängt, ob ein Aufenthalt eher Erholung oder eine ärztlich geführte Behandlung ist. Preise stehen hier bewusst nicht — sie hängen von Haus, Zimmerkategorie und Saison ab und gehören auf die Buchungsseite.',
    commonHeading: 'Was jeder Behandlungsaufenthalt enthält',
    commonBody:
      'Zu einem Behandlungsaufenthalt gehören die Unterkunft mit Halbpension, die ärztliche Eingangs- und Abschlussuntersuchung, der schriftliche Abschlussbericht, die verordneten Anwendungen und die Trinkkur an den Mineralquellen. Den kürzeren Erholungsaufenthalt gibt es auch ohne ärztliche Untersuchung; dann ist es kein Behandlungsaufenthalt, sondern ein Wellnessaufenthalt mit einzelnen Anwendungen.',
    staysHeading: 'Die Pakete im Vergleich',
    stays: [
      {
        name: 'Kurzaufenthalt zur Erholung',
        length: '2 bis 6 Nächte',
        treatments: '1 Anwendung pro Nacht',
        includes: [
          'Unterkunft mit Halbpension, also Frühstück und Abendessen',
          'Eine Anwendung je Übernachtung, aus einer festen Auswahl',
          'Keine ärztliche Eingangsuntersuchung — deshalb kein Behandlungsaufenthalt',
        ],
        forWhom:
          'Für ein langes Wochenende oder einen ersten Eindruck vom Kurort, ohne medizinisches Programm.',
      },
      {
        name: 'Intensiver Kuraufenthalt',
        length: 'ab 7 Nächten',
        treatments: '2 Anwendungen pro Nacht',
        includes: [
          'Unterkunft mit Halbpension',
          'Ärztliche Eingangs- und Abschlussuntersuchung mit schriftlichem Abschlussbericht',
          'Labor-Basisuntersuchung',
          'Trinkkur nach ärztlicher Verordnung',
        ],
        forWhom:
          'Für Gäste, die eine ärztlich geführte Kur wollen, aber mit überschaubarem Tagesprogramm.',
      },
      {
        name: 'Traditioneller Kuraufenthalt',
        length: 'ab 7 Nächten',
        treatments: '3 Anwendungen pro Nacht',
        includes: [
          'Unterkunft mit Halbpension',
          'Ärztliche Eingangs- und Abschlussuntersuchung mit schriftlichem Abschlussbericht',
          'Labor-Basisuntersuchung',
          'Trinkkur nach ärztlicher Verordnung',
          'Ärztlicher und pflegerischer Bereitschaftsdienst',
        ],
        forWhom:
          'Das klassische Format der Marienbader Kur, für die meisten Indikationen der übliche Weg.',
      },
      {
        name: 'Intensiver Behandlungsaufenthalt',
        length: 'ab 7 Nächten',
        treatments: '4 Anwendungen pro Nacht',
        includes: [
          'Unterkunft mit Halbpension',
          'Ärztliche Eingangs- und Abschlussuntersuchung mit schriftlichem Abschlussbericht',
          'Labor-Basisuntersuchung',
          'Trinkkur nach ärztlicher Verordnung',
          'Ärztlicher und pflegerischer Bereitschaftsdienst',
        ],
        forWhom:
          'Für ausgeprägte Beschwerden und für die Rehabilitation nach Operationen, wenn das Programm dicht sein soll.',
      },
    ],
    decidesHeading: 'Wer bestimmt, welche Anwendungen Sie bekommen',
    decidesBody:
      'Das Paket legt fest, wie viele Anwendungen pro Nacht enthalten sind — welche es sind, entscheidet ausschließlich der Kurarzt bei der Eingangsuntersuchung, auf Grundlage der Diagnose und Ihres aktuellen Zustands. Sie können sich das Programm also nicht selbst zusammenstellen, und das ist der Unterschied zu einem Wellnessaufenthalt. Verträgt man eine Anwendung nicht, wird der Plan geändert; sagen Sie es dann Ihrem Kurarzt.',
    menuHeading: 'Woraus der Arzt auswählt',
    menuGroups: [
      {
        name: 'Anwendungen aus den natürlichen Heilmitteln',
        items:
          'Mineralbäder, trockene Gasbäder im Mariengas, Gasinjektionen, Moorpackungen (bis zu drei pro Woche), Inhalationen, Aufenthalt und Bewegung im Freien.',
      },
      {
        name: 'Therapeutische Rehabilitation',
        items:
          'Einzel- oder Gruppenübungstherapie, Bewegungstherapie im Schwimmbecken, Physiotherapie.',
      },
      {
        name: 'Weitere Anwendungen',
        items:
          'Massagen (bis zu drei pro Woche), Lymphdrainage, Elektrotherapie, Magnetfeldtherapie, Laser, Kryotherapie, Ultraschall, Paraffinpackungen, Sauerstofftherapie, Lavatherm.',
      },
    ],
    labHeading: 'Was die Labor-Basisuntersuchung umfasst',
    labBody:
      'Eine biochemische Blutuntersuchung mit Blutzucker, Cholesterin und weiteren Blutfettwerten, Leberwerten, Nierenfunktion und Harnsäure, dazu eine Harnuntersuchung. Sie ist bei allen Aufenthalten ab sieben Nächten enthalten und dient dem Kurarzt als Grundlage für den Behandlungsplan.',
    superiorHeading: 'Programme im Haus Nové Lázně',
    superiorLead:
      'Über die Kurpakete hinaus gibt es im Haus Nové Lázně vier Programme, die bei einer ausführlichen Diagnostik beginnen. Alle enthalten den Medical Check-Up und bauen darauf auf.',
    superior: [
      {
        name: 'Medical Check-Up',
        forWhom: 'Für Gäste, die zuerst wissen wollen, wo sie stehen.',
        body:
          'Ein Diagnostikprogramm mit einer umfassenden Untersuchung des aktuellen Gesundheitszustands. Ziel ist, mögliche Risiken und frühe Anzeichen von Erkrankungen zu erkennen. Auf Grundlage der Laborwerte, der apparativen Untersuchungen und einer Ernährungsberatung stellt das Ärzteteam anschließend einen individuellen Behandlungsplan auf.',
      },
      {
        name: 'De-Stress',
        forWhom: 'Für Gäste unter anhaltender Belastung.',
        body:
          'Enthält den Medical Check-Up und ergänzt ihn um eine Einschätzung des aktuellen Stressniveaus und seiner Auswirkungen auf die Gesundheit. Das Ärzteteam stellt daraufhin einen individuellen Anwendungsplan zusammen; dazu kommt die Anleitung, Stressfaktoren zu erkennen und mit ihnen umzugehen. Ein solches Programm ersetzt keine Psychotherapie und keine psychiatrische Behandlung.',
      },
      {
        name: 'Healthy Aging',
        forWhom: 'Für Gäste, denen es um Lebensqualität im Alter geht.',
        body:
          'Enthält den Medical Check-Up, auf den ein individuell zusammengestelltes Programm mit den örtlichen natürlichen Heilmitteln folgt. Im Vordergrund stehen Gewohnheiten, die sich zu Hause fortführen lassen, und ein tragfähiges Gleichgewicht zwischen Arbeit und Erholung.',
      },
      {
        name: 'Weight Loss',
        forWhom: 'Für Gäste mit Übergewicht, unter ärztlicher Begleitung.',
        body:
          'Enthält den Medical Check-Up und arbeitet an Ernährungsgewohnheiten und Lebensstil. Der Hintergrund ist medizinisch: Übergewicht und Adipositas belasten den Bewegungsapparat und gehören zu den Risikofaktoren für Herz und Kreislauf. Begleitet wird das Programm vom Ärzteteam, mit den Grundsätzen einer ausgewogenen Ernährung und mehr Bewegung im Alltag.',
      },
    ],
    disclaimer:
      'Welches Paket zu Ihrer Diagnose passt und welche Anwendungen darin sinnvoll sind, entscheidet der Kurarzt bei der Eingangsuntersuchung. Diese Seite beschreibt die Struktur der Aufenthalte und ersetzt keine ärztliche Beratung. Preise, Verfügbarkeit und die aktuellen Bezeichnungen der Pakete finden Sie beim Betreiber.',
    faqs: [
      {
        question: 'Wie viele Anwendungen pro Tag bekommt man in Marienbad?',
        answer:
          'Das hängt vom gebuchten Paket ab: Der Kurzaufenthalt zur Erholung enthält eine Anwendung pro Übernachtung, der intensive Kuraufenthalt zwei, der traditionelle Kuraufenthalt drei und der intensive Behandlungsaufenthalt vier. Welche Anwendungen es konkret sind, legt der Kurarzt nach der Eingangsuntersuchung fest.',
      },
      {
        question: 'Was ist im Kurpaket enthalten?',
        answer:
          'Bei einem Behandlungsaufenthalt: Unterkunft mit Halbpension, die ärztliche Eingangs- und Abschlussuntersuchung, der schriftliche Abschlussbericht, die Labor-Basisuntersuchung, die verordneten Anwendungen und die Trinkkur an den Mineralquellen. Ab dem traditionellen Aufenthalt kommt ein ärztlicher und pflegerischer Bereitschaftsdienst dazu. Anreise und Kurtaxe zahlt der Gast separat.',
      },
      {
        question: 'Wie lange muss ein Kuraufenthalt mindestens dauern?',
        answer:
          'Die Behandlungsaufenthalte beginnen bei sieben Nächten, weil erst dann eine ärztlich geführte Serie sinnvoll ist; als fachliche Untergrenze einer Balneotherapie gelten mindestens zehn Anwendungen über mindestens zehn Tage. Kürzere Aufenthalte von zwei bis sechs Nächten gibt es als Erholungsformat mit einer Anwendung pro Nacht, aber ohne ärztliche Eingangsuntersuchung.',
      },
      {
        question: 'Kann ich mir die Anwendungen selbst aussuchen?',
        answer:
          'Bei einem Behandlungsaufenthalt nicht: Zahl und Zusammenstellung bestimmt ausschließlich der Kurarzt nach der Eingangsuntersuchung, und genau das unterscheidet die Kur von einem Wellnessaufenthalt. Beim kurzen Erholungsaufenthalt wählen Sie dagegen aus einer festen Liste. Wenn Sie eine verordnete Anwendung nicht vertragen, sagen Sie es Ihrem Kurarzt, damit der Plan geändert wird.',
      },
      {
        question: 'Was ist der Unterschied zwischen einer Kur und einem Wellnessaufenthalt?',
        answer:
          'Eine Kur setzt eine ärztliche Untersuchung voraus: Der Kurarzt stellt die Diagnose, verordnet ein individuelles Programm, begleitet den Verlauf und hält das Ergebnis schriftlich fest. Ein Wellnessaufenthalt ist eine frei gebuchte Erholungsreise mit Anwendungen nach eigenem Geschmack, ohne medizinische Indikation und ohne ärztliche Begleitung.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — komplexe Kurbehandlung',
        url: LAZNEML,
        note: 'Seite des Betreibers zum Umfang der Kurbehandlung. Tschechischer Text.',
      },
      {
        title: 'Ensana Health Spa Hotels — Marienbad, aktuelle Pakete und Preise',
        url: ENSANA_OFFERS,
        note: 'Buchungsseite des Betreibers mit den aktuellen Bezeichnungen der Pakete, der Zahl der Anwendungen pro Nacht und den Preisen.',
      },
    ],
    related: [
      { label: 'Kur nach Diagnose', href: '/de/kur-bei' },
      { label: 'Hinweise für Kurgäste', href: '/de/hinweise-fuer-kurgaeste' },
      { label: 'Ärzteteam', href: '/de/aerzteteam' },
      { label: 'Zahlt die Krankenkasse eine Kur?', href: '/de/kur-im-ausland-krankenkasse' },
    ],
    reviewDate: '2026-09-14',
  },
}
