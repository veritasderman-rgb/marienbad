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
  en: {
    navLabel: 'Advice for Spa Guests',
    title: 'Advice for spa guests in Marienbad',
    h1: 'What you should know about how your cure works',
    metaTitle: 'Advice for spa guests in Marienbad — what to know',
    metaDescription:
      'Spa reaction on the third day, bath temperature, which spring is for whom: the advice the local physicians give every spa guest.',
    lead:
      'The following is the advice the physicians of the Marienbad spa houses give their guests. Much of it otherwise only comes up once you are there — and some of it, such as the spa reaction on the third day, is unsettling without warning.',
    sections: [
      {
        heading: 'What the physician decides and what they don’t',
        numbered: true,
        items: [
          'Always discuss with your physician which procedures are suitable for you.',
          'The prescription for each procedure is individual and depends on the condition being treated and your overall state of health. The treatment programme is set solely by the treating physician.',
          'The drinking cure, too, is decided by the physician. Never drink more mineral water than has been prescribed for you.',
          'If a procedure does not agree with you, tell your treating physician — the plan will then be changed.',
          'Do not change medication prescribed at home without your physician’s consent.',
        ],
      },
      {
        heading: 'How things run on site',
        numbered: true,
        items: [
          'Your treatment plan is managed by a computer system. Keep to the agreed times; if that is not possible on a given occasion, speak to a nurse at the spa house.',
          'It is best to resolve any problems during your stay on the spot with the staff responsible, not only after you have left.',
          'Often on the third and fourth day of the cure, the so-called spa reaction sets in: you feel temporarily worse. This is well known and passes.',
        ],
      },
      {
        heading: 'What you should know about the procedures',
        numbered: true,
        items: [
          'A peat wrap is a considerable strain for people with a cardiovascular condition. Whether it is suitable for you is always decided by the physician.',
          'Never ask for a different temperature of the mineral bath than the one prescribed. As a rule: the cooler the mineral bath, the more effective it is and the more it fizzes.',
          'The mineral baths in Marienbad contain, besides carbon dioxide and mineral salts, humic acids, a key component of the peat.',
        ],
      },
      {
        heading: 'What you should know about the springs',
        numbered: true,
        items: [
          'The Rudolf Spring is not suitable for guests with phosphate kidney stones.',
          'The Marie Spring is not a mineral water spring. It releases a natural healing gas, used for dry gas baths and gas injections.',
        ],
      },
    ],
    note:
      'This advice does not replace a conversation with your spa physician. They decide on your treatment plan at the initial examination and adjust it during your stay.',
    faqs: [
      {
        question: 'What is the spa reaction?',
        answer:
          'Often on the third and fourth day of the cure, guests feel temporarily worse — the physicians on site call this the spa reaction. It is well known, part of the usual course, and passes. If the symptoms are severe or last longer, tell your spa physician.',
      },
      {
        question: 'Why am I not allowed to change the temperature of the mineral bath?',
        answer:
          'Because the temperature is part of the prescription. As a rule: the cooler the mineral bath, the more effective it is and the more it fizzes — a warmer bath feels more pleasant, but it is not the same thing. So never ask for a different temperature than the one prescribed.',
      },
      {
        question: 'Am I allowed to drink as much mineral water as I like?',
        answer:
          'No. The amount, the spring and the timing are set by the spa physician, personally for you: the Marienbad springs differ considerably in their chemistry, and what helps one diagnosis does not suit another. Never drink more than has been prescribed.',
      },
      {
        question: 'Is the Marie Spring suitable for drinking?',
        answer:
          'No, it is not a mineral water spring at all. It releases a natural healing gas, almost pure carbon dioxide, used for dry gas baths and for gas injections. Drinking takes place at the town’s other springs.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — Ensana Health Spa Hotels',
        url: LAZNEML,
        note: 'Advice and information for spa guests from the operator’s treatment brochure.',
      },
    ],
    related: [
      { label: 'Treatment packages', href: '/en/treatment-packages' },
      { label: 'Medical team', href: '/en/medical-team' },
      { label: 'Springs overview', href: '/en/springs-overview' },
      { label: 'Spa treatment by diagnosis', href: '/en/spa-treatment-for' },
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
  en: {
    navLabel: 'Medical Team',
    title: 'The medical team of the Marienbad spa houses',
    h1: 'Who leads the treatment in Marienbad',
    metaTitle: 'Medical team in Marienbad — qualifications and research',
    metaDescription:
      'Which specialist physicians lead the cure in Marienbad, how the initial and final examinations work, and which studies have been carried out here.',
    lead:
      'A cure is only as good as the physician who draws up the plan. This page sets out who that is in Marienbad, which specialisms are represented on site, and what research has been carried out here.',
    sections: [
      {
        heading: 'How medical supervision works',
        body:
          'On arrival, every guest meets the spa physician. Based on a thorough initial examination, they make the diagnosis and draw up the individual treatment plan with the prescribed procedures. During the stay, the medical team monitors the effect and adjusts the plan as needed. At the end, a further examination follows, at which you receive a detailed summary of the results and recommendations for home.',
      },
      {
        heading: 'Which specialisms are represented on site',
        items: [
          'The physicians at the spa houses are specialists in internal medicine.',
          'Most hold a second specialist qualification, predominantly in physical and rehabilitation medicine — the field formerly known as physiatry, balneology and medical rehabilitation.',
          'Further specialisms on the team include diabetology and oncology, among others.',
          'All nursing staff have a vocational or higher-education qualification in nursing; all senior nurses hold a higher-education degree that also entitles them to practise within the EU.',
          'All of the operator’s houses have an on-call medical and nursing service.',
        ],
      },
      {
        heading: 'Laboratory diagnostics on site',
        body:
          'The spa houses offer a broad range of laboratory diagnostics, from issuing the request through the blood draw at the relevant house to discussing the findings and the recommendation that follows. For stays of seven nights or more, a basic laboratory examination is part of the programme.',
      },
      {
        heading: 'Research carried out here',
        items: [
          'For the study on the effects of spa rehabilitation on physical performance, breathlessness, oximetry and spirometry in patients with complaints after COVID-19, the Marienbad spa houses received the 2021 Innovation Award of the European Spas Association in the Medical Spa Scientific Research category.',
          'From the OnkoFit-Spa project, carried out together with the 1st Faculty of Medicine of Charles University, the Institut lázeňství a balneologie and the Czech spa association, extended follow-up care for patients after oncological treatment was adopted into the standard programme.',
          'Since 2026, together with the Institut lázeňství a balneologie, the first clinical study of this kind in thirty years has been under way; it concerns urological and nephrological diagnoses and examines more than a hundred patients before and after the spa stay. The scientific guarantor is prim. MUDr. Ladislav Špišák, CSc.; results are not yet available.',
        ],
      },
    ],
    peopleHeading: 'At the head of the team',
    people: [
      { name: 'MUDr. Markéta Hovorková, Ph.D.', role: 'Chief Physician of Ensana Health Spa Hotels Mariánské Lázně' },
      { name: 'MUDr. Pavel Knára', role: 'Chief Physician emeritus of the Nové Lázně house' },
    ],
    peopleNote:
      'Which physician looks after you during your stay depends on the house you are staying in and on your diagnosis.',
    note:
      'This page describes the qualifications of the team and the institution’s research. It is not medical advice; your treatment plan is decided by the spa physician at the initial examination.',
    faqs: [
      {
        question: 'What specialism do the spa physicians in Marienbad have?',
        answer:
          'They are specialists in internal medicine, and most hold a second specialist qualification, predominantly in physical and rehabilitation medicine. Further specialisms represented include diabetology and oncology. All senior nurses hold a higher-education degree that also entitles them to practise within the EU.',
      },
      {
        question: 'Do I actually see a physician during the cure?',
        answer:
          'Yes, at least twice: at the initial examination on the day of arrival, from which the treatment plan follows, and at the final examination, at which you receive a written summary and recommendations for home. In between, the team monitors progress and adjusts the plan. All houses also have an on-call medical and nursing service.',
      },
      {
        question: 'Has scientific research been carried out in Marienbad?',
        answer:
          'Yes. The study on spa rehabilitation after COVID-19 received the 2021 Innovation Award of the European Spas Association in the Medical Spa Scientific Research category. From the OnkoFit-Spa project with the 1st Faculty of Medicine of Charles University, extended follow-up care after oncological treatment was adopted into the standard programme. Since 2026, the first clinical study of this kind in thirty years has been under way, on urological and nephrological diagnoses.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — Ensana Health Spa Hotels',
        url: LAZNEML,
        note: 'Details on the qualifications of the medical and nursing team, on the process of the initial and final examinations, and on laboratory diagnostics, from the operator’s treatment brochure.',
      },
      {
        title: 'Institut lázeňství a balneologie, v.v.i.',
        url: ILAB,
        note: 'Research institute of the Karlovy Vary region, founded in 2019; projects and ongoing studies in spa medicine.',
      },
      {
        title: 'Clinical study on the objective effects of comprehensive spa treatment for urological and nephrological diagnoses (NCT07435844)',
        url: NCT,
        note: 'Ongoing study with more than a hundred patients, starting in 2026; results are not yet available.',
      },
    ],
    related: [
      { label: 'Treatment packages', href: '/en/treatment-packages' },
      { label: 'Advice for spa guests', href: '/en/advice-for-spa-guests' },
      { label: 'Spa treatment by diagnosis', href: '/en/spa-treatment-for' },
      { label: 'Indications and contraindications', href: '/en/indications-and-contraindications' },
    ],
    reviewDate: '2026-09-14',
  },
}
