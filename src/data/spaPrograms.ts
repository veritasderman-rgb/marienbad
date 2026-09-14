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
  en: {
    navLabel: 'Treatment Packages',
    title: 'Spa treatment packages in Marienbad: procedures, duration, content',
    h1: 'What spa packages exist and what they include',
    metaTitle: 'Spa packages in Marienbad — how many procedures?',
    metaDescription:
      'How many procedures per night, what is included in the package and what additional programmes exist — an overview of the spa packages in Marienbad.',
    lead:
      'The difference between the spa packages comes down mainly to one number: how many procedures per night are included in the price. That determines whether a stay is more of a relaxing break or a medically supervised treatment. Prices are deliberately left out here — they depend on the hotel, room category and season, and belong on the booking site.',
    commonHeading: 'What every treatment stay includes',
    commonBody:
      'A treatment stay includes accommodation with half board, the initial and final medical examination, the written final report, the prescribed procedures and the drinking cure at the mineral springs. The shorter relaxation stay is also available without a medical examination; in that case it is not a treatment stay but a wellness stay with individual procedures.',
    staysHeading: 'The packages compared',
    stays: [
      {
        name: 'Short relaxation stay',
        length: '2 to 6 nights',
        treatments: '1 procedure per night',
        includes: [
          'Accommodation with half board, i.e. breakfast and dinner',
          'One procedure per night, from a fixed selection',
          'No initial medical examination — which is why it is not a treatment stay',
        ],
        forWhom:
          'For a long weekend or a first impression of the spa town, without a medical programme.',
      },
      {
        name: 'Intensive spa stay',
        length: 'from 7 nights',
        treatments: '2 procedures per night',
        includes: [
          'Accommodation with half board',
          'Initial and final medical examination with a written final report',
          'Basic laboratory examination',
          'Drinking cure as prescribed by the physician',
        ],
        forWhom:
          'For guests who want a medically supervised cure, but with a manageable daily programme.',
      },
      {
        name: 'Traditional spa stay',
        length: 'from 7 nights',
        treatments: '3 procedures per night',
        includes: [
          'Accommodation with half board',
          'Initial and final medical examination with a written final report',
          'Basic laboratory examination',
          'Drinking cure as prescribed by the physician',
          'On-call medical and nursing service',
        ],
        forWhom:
          'The classic format of the Marienbad cure, the usual route for most indications.',
      },
      {
        name: 'Intensive treatment stay',
        length: 'from 7 nights',
        treatments: '4 procedures per night',
        includes: [
          'Accommodation with half board',
          'Initial and final medical examination with a written final report',
          'Basic laboratory examination',
          'Drinking cure as prescribed by the physician',
          'On-call medical and nursing service',
        ],
        forWhom:
          'For pronounced complaints and for rehabilitation after surgery, when the programme needs to be dense.',
      },
    ],
    decidesHeading: 'Who decides which procedures you get',
    decidesBody:
      'The package sets how many procedures per night are included — which ones they are is decided solely by the spa physician at the initial examination, based on the diagnosis and your current condition. You cannot put the programme together yourself, and that is the difference from a wellness stay. If a procedure does not agree with you, the plan is changed; tell your spa physician.',
    menuHeading: 'What the physician chooses from',
    menuGroups: [
      {
        name: 'Procedures using the natural healing resources',
        items:
          'Mineral baths, dry gas baths in Mariengas, gas injections, peat wraps (up to three per week), inhalations, time and exercise outdoors.',
      },
      {
        name: 'Therapeutic rehabilitation',
        items:
          'Individual or group exercise therapy, movement therapy in the swimming pool, physiotherapy.',
      },
      {
        name: 'Further procedures',
        items:
          'Massages (up to three per week), lymphatic drainage, electrotherapy, magnetic field therapy, laser, cryotherapy, ultrasound, paraffin wraps, oxygen therapy, Lavatherm.',
      },
    ],
    labHeading: 'What the basic laboratory examination covers',
    labBody:
      'A biochemical blood test covering blood sugar, cholesterol and other blood lipid values, liver values, kidney function and uric acid, plus a urine test. It is included in all stays of seven nights or more and serves the spa physician as the basis for the treatment plan.',
    superiorHeading: 'Programmes at the Nové Lázně house',
    superiorLead:
      'Beyond the spa packages, the Nové Lázně house offers four programmes that begin with a thorough diagnostic workup. All of them include the Medical Check-Up and build on it.',
    superior: [
      {
        name: 'Medical Check-Up',
        forWhom: 'For guests who first want to know where they stand.',
        body:
          'A diagnostic programme with a comprehensive assessment of your current state of health. The aim is to identify possible risks and early signs of disease. Based on the laboratory values, the instrumental examinations and a nutritional consultation, the medical team then draws up an individual treatment plan.',
      },
      {
        name: 'De-Stress',
        forWhom: 'For guests under sustained pressure.',
        body:
          'Includes the Medical Check-Up and adds an assessment of your current stress level and its effect on your health. The medical team then puts together an individual procedure plan; guidance on recognising and dealing with stress factors is included. A programme of this kind does not replace psychotherapy or psychiatric treatment.',
      },
      {
        name: 'Healthy Aging',
        forWhom: 'For guests focused on quality of life in later years.',
        body:
          'Includes the Medical Check-Up, followed by an individually assembled programme using the local natural healing resources. The focus is on habits that can be continued at home and on a sustainable balance between work and recovery.',
      },
      {
        name: 'Weight Loss',
        forWhom: 'For guests who are overweight, under medical supervision.',
        body:
          'Includes the Medical Check-Up and works on eating habits and lifestyle. The background is medical: excess weight and obesity place a strain on the musculoskeletal system and are among the risk factors for heart and circulation. The programme is accompanied by the medical team, based on the principles of a balanced diet and more exercise in daily life.',
      },
    ],
    disclaimer:
      'Which package suits your diagnosis and which procedures within it make sense is decided by the spa physician at the initial examination. This page describes the structure of the stays and does not replace medical advice. Prices, availability and the operator’s current package names are available from the operator.',
    faqs: [
      {
        question: 'How many procedures per day do you get in Marienbad?',
        answer:
          'That depends on the package booked: the short relaxation stay includes one procedure per night, the intensive spa stay two, the traditional spa stay three and the intensive treatment stay four. Which procedures these are in practice is decided by the spa physician after the initial examination.',
      },
      {
        question: 'What is included in a spa package?',
        answer:
          'For a treatment stay: accommodation with half board, the initial and final medical examination, the written final report, the basic laboratory examination, the prescribed procedures and the drinking cure at the mineral springs. From the traditional stay upwards, an on-call medical and nursing service is added. Travel and the local spa tax are paid separately by the guest.',
      },
      {
        question: 'What is the minimum length of a spa stay?',
        answer:
          'The treatment stays start at seven nights, because only from that point does a medically supervised series make sense; the recognised professional minimum for a balneotherapy course is at least ten procedures over at least ten days. Shorter stays of two to six nights are available as a relaxation format with one procedure per night, but without an initial medical examination.',
      },
      {
        question: 'Can I choose the procedures myself?',
        answer:
          'Not for a treatment stay: the number and combination are decided solely by the spa physician after the initial examination, and that is exactly what distinguishes a cure from a wellness stay. For the short relaxation stay, by contrast, you choose from a fixed list. If a prescribed procedure does not agree with you, tell your spa physician so the plan can be changed.',
      },
      {
        question: 'What is the difference between a spa cure and a wellness stay?',
        answer:
          'A spa cure requires a medical examination: the spa physician makes the diagnosis, prescribes an individual programme, follows its progress and records the outcome in writing. A wellness stay is a freely booked relaxation trip with procedures chosen to taste, without a medical indication and without medical supervision.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — comprehensive spa treatment',
        url: LAZNEML,
        note: 'Operator’s page on the scope of spa treatment. Czech-language text.',
      },
      {
        title: 'Ensana Health Spa Hotels — Marienbad, current packages and prices',
        url: ENSANA_OFFERS,
        note: 'Operator’s booking page with the current package names, the number of procedures per night and prices.',
      },
    ],
    related: [
      { label: 'Spa treatment by diagnosis', href: '/en/spa-treatment-for' },
      { label: 'Advice for spa guests', href: '/en/advice-for-spa-guests' },
      { label: 'Medical team', href: '/en/medical-team' },
      { label: 'Does health insurance cover a spa cure?', href: '/en/paying-for-spa-treatment' },
    ],
    reviewDate: '2026-09-14',
  },
}
