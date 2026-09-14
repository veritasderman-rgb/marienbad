import type { Locale } from '@/i18n/config'
import { routes } from '@/i18n/config'

/**
 * Dvě informační stránky, které stojí na léčebné brožuře provozovatele:
 * rady pro průběh pobytu a stránka o lékařském týmu.
 *
 * Obě existují kvůli konkrétnosti. Rady obsahují věci, které jinde na webu
 * nejsou a které host potřebuje vědět dřív, než přijede (lázeňská reakce
 * třetí a čtvrtý den, proč se nežádá jiná teplota koupele, že Mariin
 * pramen není voda). Stránka o týmu je zase jediné místo, kde je doložené,
 * jakou kvalifikaci lékaři mají a jaký výzkum tu vznikl — bez toho nemá web
 * čím podepřít zdravotní obsah.
 */

export interface InfoSection {
  heading: string
  body?: string
  items?: string[]
  /** Číslovaný seznam místo odrážek. */
  numbered?: boolean
}

export interface InfoPerson {
  name: string
  role: string
}

export interface InfoContent {
  navLabel: string
  title: string
  h1: string
  metaTitle: string
  metaDescription: string
  lead: string
  sections: InfoSection[]
  people?: InfoPerson[]
  peopleHeading?: string
  peopleNote?: string
  note: string
  faqs: { question: string; answer: string }[]
  sources: { title: string; url: string; note?: string }[]
  related: { label: string; href: string }[]
  reviewDate: string
}

type InfoKey = 'spa-advice' | 'medical-team'

export function infoHref(key: InfoKey, locale: Locale): string {
  return `/${locale}/${routes[key][locale]}`
}

export function infoAlternates(key: InfoKey): Record<Locale, string> {
  return Object.fromEntries(
    (['de', 'en', 'cs', 'ru'] as Locale[]).map((l) => [l, infoHref(key, l)]),
  ) as Record<Locale, string>
}

const LAZNEML = 'https://lazneml.cz/'
const ILAB = 'https://www.i-lab.cz/en'
const NCT = 'https://clinicaltrials.gov/study/NCT07435844'

export const spaAdvice: Partial<Record<Locale, InfoContent>> = {
  de: {
    navLabel: 'Hinweise für Kurgäste',
    title: 'Hinweise für Kurgäste in Marienbad',
    h1: 'Was Sie über den Ablauf Ihrer Kur wissen sollten',
    metaTitle: 'Hinweise für Kurgäste in Marienbad — was zu beachten ist',
    metaDescription:
      'Kurreaktion am dritten Tag, Badetemperatur, welche Quelle für wen: die Hinweise, die die Ärzte vor Ort jedem Kurgast mitgeben.',
    lead:
      'Das Folgende sind die Hinweise, die die Ärzte der Marienbader Kurhäuser ihren Gästen mitgeben. Vieles davon erfährt man sonst erst vor Ort — und manches, etwa die Kurreaktion am dritten Tag, erschreckt ohne Vorwarnung.',
    sections: [
      {
        heading: 'Was der Arzt entscheidet und was nicht',
        numbered: true,
        items: [
          'Welche Anwendungen für Sie geeignet sind, besprechen Sie immer mit Ihrem Arzt.',
          'Die Verordnung jeder Anwendung ist individuell und richtet sich nach der Erkrankung und Ihrem gesamten Gesundheitszustand. Das Behandlungsprogramm legt ausschließlich der behandelnde Arzt fest.',
          'Auch zur Trinkkur entscheidet der Arzt. Trinken Sie nie mehr Mineralwasser, als Ihnen verordnet wurde.',
          'Vertragen Sie eine Anwendung nicht, sagen Sie es Ihrem behandelnden Arzt — der Plan wird dann geändert.',
          'Ändern Sie die zu Hause verordneten Medikamente nicht ohne Zustimmung Ihres Arztes.',
        ],
      },
      {
        heading: 'Der Ablauf vor Ort',
        numbered: true,
        items: [
          'Ihr Behandlungsplan wird von einem Rechner geführt. Halten Sie die vereinbarten Zeiten ein; wenn das einmal nicht geht, wenden Sie sich an eine Schwester im Kurhaus.',
          'Probleme während des Aufenthalts klären Sie am besten sofort vor Ort mit den Verantwortlichen, nicht erst nach der Abreise.',
          'Oft am dritten und vierten Tag der Kur tritt die sogenannte Kurreaktion ein: Sie fühlen sich vorübergehend schlechter. Das ist bekannt und geht vorüber.',
        ],
      },
      {
        heading: 'Was Sie über die Anwendungen wissen sollten',
        numbered: true,
        items: [
          'Die Moorpackung ist für Menschen mit einer Herz-Kreislauf-Erkrankung eine erhebliche Belastung. Ob sie für Sie geeignet ist, entscheidet immer der Arzt.',
          'Bitten Sie nie um eine andere Temperatur des Mineralbads als die verordnete. Grundsätzlich gilt: Je kühler das Mineralbad, desto wirksamer ist es und desto mehr perlt es.',
          'Die Mineralbäder in Marienbad enthalten neben Kohlendioxid und Mineralsalzen auch Huminsäuren, einen wesentlichen Bestandteil des Moores.',
        ],
      },
      {
        heading: 'Was Sie über die Quellen wissen sollten',
        numbered: true,
        items: [
          'Die Rudolfsquelle ist für Gäste mit Phosphat-Nierensteinen nicht geeignet.',
          'Die Marienquelle ist keine Mineralwasserquelle. Aus ihr tritt natürliches Heilgas aus, das für trockene Gasbäder und Gasinjektionen verwendet wird.',
        ],
      },
    ],
    note:
      'Diese Hinweise ersetzen nicht das Gespräch mit Ihrem Kurarzt. Über Ihren Behandlungsplan entscheidet er bei der Eingangsuntersuchung und passt ihn während des Aufenthalts an.',
    faqs: [
      {
        question: 'Was ist die Kurreaktion?',
        answer:
          'Oft am dritten und vierten Tag der Kur fühlen sich Gäste vorübergehend schlechter — das nennen die Ärzte vor Ort die Kurreaktion. Sie ist bekannt, gehört zum Verlauf und geht vorüber. Wenn die Beschwerden stark sind oder länger anhalten, sagen Sie es Ihrem Kurarzt.',
      },
      {
        question: 'Warum darf ich die Temperatur des Mineralbads nicht ändern?',
        answer:
          'Weil die Temperatur Teil der Verordnung ist. Grundsätzlich gilt: Je kühler das Mineralbad, desto wirksamer ist es und desto mehr perlt es — ein wärmeres Bad fühlt sich angenehmer an, ist aber nicht dasselbe. Bitten Sie deshalb nie um eine andere Temperatur als die verordnete.',
      },
      {
        question: 'Darf ich so viel Mineralwasser trinken, wie ich möchte?',
        answer:
          'Nein. Menge, Quelle und Zeitpunkt legt der Kurarzt fest, und zwar für Sie persönlich: Die Marienbader Quellen unterscheiden sich chemisch erheblich, und was der einen Diagnose hilft, passt bei einer anderen nicht. Trinken Sie nie mehr, als verordnet ist.',
      },
      {
        question: 'Ist die Marienquelle zum Trinken geeignet?',
        answer:
          'Nein, sie ist überhaupt keine Mineralwasserquelle. Aus ihr tritt natürliches Heilgas aus, fast reines Kohlendioxid, das für trockene Gasbäder und für Gasinjektionen verwendet wird. Getrunken wird an den anderen Quellen des Ortes.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — Ensana Health Spa Hotels',
        url: LAZNEML,
        note: 'Hinweise und Informationen für Kurgäste aus der Behandlungsbroschüre des Betreibers.',
      },
    ],
    related: [
      { label: 'Kurpakete und Programme', href: '/de/kurpakete-und-programme' },
      { label: 'Ärzteteam', href: '/de/aerzteteam' },
      { label: 'Quellen im Überblick', href: '/de/quellen-uebersicht' },
      { label: 'Kur nach Diagnose', href: '/de/kur-bei' },
    ],
    reviewDate: '2026-09-14',
  },
}

export const medicalTeam: Partial<Record<Locale, InfoContent>> = {
  de: {
    navLabel: 'Ärzteteam',
    title: 'Das Ärzteteam der Marienbader Kurhäuser',
    h1: 'Wer die Behandlung in Marienbad führt',
    metaTitle: 'Ärzteteam in Marienbad — Qualifikation und Forschung',
    metaDescription:
      'Welche Fachärzte die Kur in Marienbad führen, wie Eingangs- und Abschlussuntersuchung ablaufen und welche Studien hier entstanden sind.',
    lead:
      'Eine Kur ist nur so gut wie die Ärztin oder der Arzt, die den Plan aufstellen. Diese Seite sagt, wer das in Marienbad ist, welche Fachrichtungen im Haus vertreten sind und welche Forschung hier entstanden ist.',
    sections: [
      {
        heading: 'Wie die ärztliche Begleitung abläuft',
        body:
          'Bei der Ankunft trifft jeder Gast den Kurarzt. Auf Grundlage einer ausführlichen Eingangsuntersuchung stellt er die Diagnose und den individuellen Behandlungsplan mit den verordneten Anwendungen auf. Während des Aufenthalts verfolgt das medizinische Team die Wirkung und passt den Plan bei Bedarf an. Zum Abschluss folgt eine weitere Untersuchung, bei der Sie eine ausführliche Zusammenfassung der Ergebnisse und Empfehlungen für zu Hause erhalten.',
      },
      {
        heading: 'Welche Fachrichtungen im Haus sind',
        items: [
          'Die Ärztinnen und Ärzte der Kurhäuser sind Fachärzte für Innere Medizin.',
          'Die meisten haben eine zweite Facharztqualifikation, überwiegend in Physikalischer und Rehabilitativer Medizin — dem Fach, das früher Physiatrie, Balneologie und Heilrehabilitation hieß.',
          'Weitere Fachrichtungen im Team sind unter anderem Diabetologie und Onkologie.',
          'Alle Pflegekräfte haben eine Fachschul- oder Hochschulausbildung im Pflegeberuf; alle leitenden Schwestern haben einen Hochschulabschluss, der auch in der EU zur Berufsausübung berechtigt.',
          'In allen Häusern des Betreibers gibt es einen ärztlichen und pflegerischen Bereitschaftsdienst.',
        ],
      },
      {
        heading: 'Labordiagnostik im Haus',
        body:
          'Die Kurhäuser bieten ein breites Spektrum an Labordiagnostik, vom Ausstellen der Anforderung über die Blutabnahme im jeweiligen Haus bis zur Befundbesprechung mit der sich anschließenden Empfehlung. Bei Aufenthalten ab sieben Nächten ist eine Labor-Basisuntersuchung Bestandteil des Programms.',
      },
      {
        heading: 'Forschung, die hier entstanden ist',
        items: [
          'Für die Studie zu den Wirkungen der Kurrehabilitation auf körperliche Leistungsfähigkeit, Atemnot, Oxymetrie und Spirometrie bei Beschwerden nach COVID-19 erhielten die Marienbader Kurhäuser 2021 den Innovation Award der European Spas Association in der Kategorie Medical Spa Scientific Research.',
          'Aus dem Projekt OnkoFit-Spa, das gemeinsam mit der 1. Medizinischen Fakultät der Karls-Universität, dem Institut lázeňství a balneologie und dem tschechischen Heilbäderverband entstand, wurde die erweiterte Nachsorge für Patientinnen nach onkologischer Behandlung in das Standardprogramm übernommen.',
          'Seit 2026 läuft gemeinsam mit dem Institut lázeňství a balneologie die erste klinische Studie dieses Formats seit dreißig Jahren; sie betrifft urologische und nephrologische Diagnosen und untersucht mehr als hundert Patienten vor und nach dem Kuraufenthalt. Fachlicher Garant ist prim. MUDr. Ladislav Špišák, CSc.; Ergebnisse liegen noch nicht vor.',
        ],
      },
    ],
    peopleHeading: 'An der Spitze des Teams',
    people: [
      { name: 'MUDr. Markéta Hovorková, Ph.D.', role: 'Chefärztin der Ensana Health Spa Hotels Mariánské Lázně' },
      { name: 'MUDr. Pavel Knára', role: 'Chefarzt em. des Hauses Nové Lázně' },
    ],
    peopleNote:
      'Welcher Arzt Sie während Ihres Aufenthalts betreut, richtet sich nach dem Haus, in dem Sie wohnen, und nach Ihrer Diagnose.',
    note:
      'Diese Seite beschreibt die Qualifikation des Teams und die Forschung der Einrichtung. Sie ist keine ärztliche Beratung; über Ihren Behandlungsplan entscheidet der Kurarzt bei der Eingangsuntersuchung.',
    faqs: [
      {
        question: 'Welche Fachrichtung haben die Kurärzte in Marienbad?',
        answer:
          'Sie sind Fachärzte für Innere Medizin, und die meisten haben eine zweite Facharztqualifikation, überwiegend in Physikalischer und Rehabilitativer Medizin. Vertreten sind außerdem weitere Fachrichtungen wie Diabetologie und Onkologie. Alle leitenden Schwestern haben einen Hochschulabschluss, der auch in der EU zur Berufsausübung berechtigt.',
      },
      {
        question: 'Sehe ich während der Kur überhaupt einen Arzt?',
        answer:
          'Ja, mindestens zweimal: bei der Eingangsuntersuchung am Anreisetag, aus der der Behandlungsplan hervorgeht, und bei der Abschlussuntersuchung, bei der Sie eine schriftliche Zusammenfassung und Empfehlungen für zu Hause erhalten. Dazwischen verfolgt das Team den Verlauf und passt den Plan an. In allen Häusern gibt es außerdem einen ärztlichen und pflegerischen Bereitschaftsdienst.',
      },
      {
        question: 'Wurde in Marienbad wissenschaftlich geforscht?',
        answer:
          'Ja. Die Studie zur Kurrehabilitation nach COVID-19 erhielt 2021 den Innovation Award der European Spas Association in der Kategorie Medical Spa Scientific Research. Aus dem Projekt OnkoFit-Spa mit der 1. Medizinischen Fakultät der Karls-Universität wurde die erweiterte Nachsorge nach onkologischer Behandlung ins Standardprogramm übernommen. Seit 2026 läuft die erste klinische Studie dieses Formats seit dreißig Jahren, zu urologischen und nephrologischen Diagnosen.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — Ensana Health Spa Hotels',
        url: LAZNEML,
        note: 'Angaben zur Qualifikation des ärztlichen und pflegerischen Teams, zum Ablauf von Eingangs- und Abschlussuntersuchung und zur Labordiagnostik aus der Behandlungsbroschüre des Betreibers.',
      },
      {
        title: 'Institut lázeňství a balneologie, v.v.i.',
        url: ILAB,
        note: 'Forschungseinrichtung des Karlsbader Kreises, gegründet 2019; Projekte und laufende Studien der Kurmedizin.',
      },
      {
        title: 'Klinische Studie zu den objektiven Wirkungen der komplexen Kurbehandlung bei urologischen und nephrologischen Diagnosen (NCT07435844)',
        url: NCT,
        note: 'Laufende Studie mit mehr als hundert Patienten, Beginn 2026; Ergebnisse liegen noch nicht vor.',
      },
    ],
    related: [
      { label: 'Kurpakete und Programme', href: '/de/kurpakete-und-programme' },
      { label: 'Hinweise für Kurgäste', href: '/de/hinweise-fuer-kurgaeste' },
      { label: 'Kur nach Diagnose', href: '/de/kur-bei' },
      { label: 'Indikationen und Kontraindikationen', href: '/de/indikationen-und-kontraindikationen' },
    ],
    reviewDate: '2026-09-14',
  },
}
