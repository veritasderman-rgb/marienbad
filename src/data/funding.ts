import type { Locale } from '@/i18n/config'
import { routes } from '@/i18n/config'

/**
 * Úhrada lázeňské léčby pro hosty ze zahraničí.
 *
 * Existuje jen pro de, en a ru. Český pacient má celou sekci `insurance-spa`,
 * kde je totéž podrobněji a podle českého indikačního seznamu.
 *
 * Obsah je právní, ne lékařský: odkazuje na konkrétní paragrafy a nařízení.
 * Každé tvrzení o nároku musí mít v `sources` odkaz na primární zdroj — text
 * zákona, nařízení nebo stránku instituce, která o nároku rozhoduje. Bez toho
 * se tvrzení nepíše; platí tu stejná přísnost jako u zdravotních tvrzení.
 */

export type FundingLocale = Extract<Locale, 'de' | 'en' | 'ru'>

export const fundingLocales: FundingLocale[] = ['de', 'en', 'ru']

export interface FundingSource {
  title: string
  url: string
  note?: string
}

/** Jedna cesta k úhradě: kdo ji může využít, co pokrývá, co pro ni musí udělat. */
export interface FundingRoute {
  /** Název cesty, např. „Ambulante Vorsorgeleistung nach § 23 SGB V“. */
  name: string
  /** Komu je určená. */
  who: string
  /** Co hradí a co ne. Konkrétně, bez slibů. */
  covers: string
  /** Kroky, které musí host udělat, v pořadí. */
  steps: string[]
  /** Právní opora — paragraf, nařízení nebo instituce. */
  basis: string
}

export interface FundingContent {
  navLabel: string
  title: string
  h1: string
  metaTitle: string
  metaDescription: string
  lead: string
  /** Krátká přímá odpověď hned pod nadpisem. Právě tuhle pasáž cituje AI. */
  shortAnswer: string
  routesHeading: string
  routes: FundingRoute[]
  /** Co si host platí sám vždy, bez ohledu na cestu. */
  selfPayHeading: string
  selfPayBody: string
  /** Věta, že konečné rozhodnutí je na plátci, ne na lázních. */
  disclaimer: string
  faqs: { question: string; answer: string }[]
  sources: FundingSource[]
  related: { label: string; href: string }[]
  /** Datum poslední revize právního obsahu (ISO). */
  reviewDate: string
}

export function fundingHref(locale: FundingLocale): string {
  return `/${locale}/${routes.funding[locale]}`
}

export function fundingAlternates(): Partial<Record<Locale, string>> {
  return Object.fromEntries(fundingLocales.map((l) => [l, fundingHref(l)]))
}

export const funding: Partial<Record<FundingLocale, FundingContent>> = {
  de: {
    navLabel: 'Kur & Krankenkasse',
    title: 'Kur im Ausland: Wer zahlt?',
    h1: 'Zahlt die Krankenkasse eine Kur in Marienbad?',
    metaTitle: 'Kur im Ausland: Zahlt die Krankenkasse? — Marienbad.com',
    metaDescription:
      'Ambulante Vorsorgekur, Beihilfe, private Versicherung oder Selbstzahler: wer eine Kur in Marienbad bezahlt und unter welchen Voraussetzungen.',
    lead: 'Deutsche Gäste fragen sich zu Recht, ob und wie sich ein Kuraufenthalt in Marienbad bezahlen lässt. Die Antwort hängt davon ab, wie Sie versichert sind — hier finden Sie die maßgeblichen Wege mit ihrer rechtlichen Grundlage.',
    shortAnswer:
      'Ja, aber nicht automatisch: Die gesetzliche Krankenkasse erbringt ambulante Vorsorgeleistungen nach § 23 Abs. 2 SGB V in anerkannten Kurorten, wenn der Hausarzt die medizinische Notwendigkeit bescheinigt und die Kasse zustimmt. Bei einer Kur in einem anderen EU-Land wie Tschechien erfolgt die Zahlung in der Praxis meist über Kostenerstattung nach § 13 Abs. 4 SGB V, begrenzt auf die Kosten, die im Inland angefallen wären. Unterkunft, Verpflegung und Anreise zahlt der Gast auch bei Bewilligung selbst. Entscheiden kann darüber ausschließlich die zuständige Krankenkasse im Einzelfall — nicht die Kureinrichtung.',
    routesHeading: 'Wege zur Kostenbeteiligung',
    routes: [
      {
        name: 'Ambulante Vorsorgekur nach § 23 SGB V für gesetzlich Versicherte',
        who: 'Gesetzlich krankenversicherte Gäste, bei denen der Hausarzt oder Vertragsarzt eine ambulante Vorsorgekur für medizinisch notwendig hält, weil die Behandlung am Wohnort nicht ausreicht.',
        covers:
          'Pflichtleistung sind die ärztliche Behandlung sowie Heil- und Hilfsmittel während der Kur (§ 23 Abs. 1–3 SGB V); ein zusätzlicher Tageszuschuss zu weiteren Kurmittelkosten ist dagegen eine Ermessensleistung, die jede Kasse in ihrer Satzung selbst regelt. Unterkunft, Verpflegung und Anreise trägt der Gast bei der ambulanten Kur immer selbst. Findet die Kur außerhalb Deutschlands statt, läuft die Abrechnung in der Praxis über Kostenerstattung nach § 13 Abs. 4 SGB V — begrenzt auf die Vergütung, die im Inland als Sachleistung angefallen wäre. Eine vorherige Zustimmung der Kasse mit Vordruck S2 (Art. 20 VO (EG) Nr. 883/2004) ist für ambulante Kuren gesetzlich nicht zwingend; verpflichtend ist eine vorherige Zustimmung nach § 13 Abs. 5 SGB V nur bei stationären Krankenhausleistungen.',
        steps: [
          'Beim Hausarzt oder Vertragsarzt die medizinische Notwendigkeit der ambulanten Vorsorgekur feststellen und schriftlich bescheinigen lassen.',
          'Die Krankenkasse vor Reiseantritt über die geplante Kur informieren und den Antrag auf Kostenerstattung stellen (§ 13 Abs. 2 SGB V).',
          'Die Entscheidung der Kasse abwarten — sie muss regulär innerhalb von drei, bei Einholung eines Gutachtens innerhalb von fünf Wochen erfolgen (§ 13 Abs. 3a SGB V).',
          'Nach Bewilligung die Kur antreten und alle Rechnungen für ärztliche Behandlung und Kuranwendungen aufbewahren.',
          'Die Originalbelege nach der Rückkehr bei der Krankenkasse zur Erstattung einreichen.',
        ],
        basis: '§ 23 Abs. 1–3 und 5 SGB V; § 13 Abs. 2, 4 und 5 SGB V; Art. 20 VO (EG) Nr. 883/2004',
      },
      {
        name: 'Beihilfe für Beamtinnen, Beamte, Richterinnen und Richter',
        who: 'Beihilfeberechtigte Personen des Bundes oder eines Landes sowie ihre berücksichtigungsfähigen Angehörigen.',
        covers:
          'Ob und in welchem Umfang eine ambulante Kur beihilfefähig ist, regelt die jeweils zuständige Verordnung — beim Bund die Bundesbeihilfeverordnung (BBhV), in den Ländern die eigene Landes-Beihilfeverordnung mit eigenen Bedingungen. Nach der BBhV sind ärztlich geleitete ambulante Rehabilitationsmaßnahmen in einem anerkannten Heilbad oder Kurort beihilfefähig, wenn die Festsetzungsstelle die Beihilfefähigkeit vor Beginn der Maßnahme aufgrund einer ärztlichen Bescheinigung anerkannt hat; Behandlungen in einem EU-Mitgliedstaat werden dabei grundsätzlich wie im Inland entstandene Aufwendungen behandelt. Ob der konkrete Kurort anerkannt ist und welche Nachweise die eigene Festsetzungsstelle verlangt, muss vor Reiseantritt individuell geklärt werden.',
        steps: [
          'Vor jeder Buchung bei der eigenen Festsetzungsstelle (Beihilfestelle) klären, ob und unter welchen Voraussetzungen eine Kur im Ausland beihilfefähig ist.',
          'Eine ärztliche Bescheinigung über die medizinische Notwendigkeit der Maßnahme einholen.',
          'Den Antrag auf Anerkennung der Beihilfefähigkeit vor Reiseantritt stellen und die Entscheidung abwarten.',
          'Nach der Kur die Originalbelege bei der Festsetzungsstelle zur Abrechnung einreichen.',
        ],
        basis: '§ 35 Abs. 1 Satz 1 Nr. 1 und 4, § 36, § 11 BBhV (Bund); die jeweils geltende Landes-Beihilfeverordnung für Landesbeamtinnen und -beamte',
      },
      {
        name: 'Private Krankenversicherung (PKV)',
        who: 'Privat vollversicherte Gäste sowie Beihilfeberechtigte mit ergänzender privater Restkostenversicherung.',
        covers:
          'Die private Krankenversicherung leistet nicht nach dem SGB V, sondern ausschließlich im vertraglich vereinbarten Umfang der medizinisch notwendigen Heilbehandlung (§ 192 Abs. 1 VVG). Ob eine ambulante Kur erstattet wird, welche Leistungen und in welcher Höhe, hängt allein vom individuellen Tarif und den Versicherungsbedingungen ab — viele Tarife schließen Kurbehandlungen ausdrücklich aus oder verlangen eine vorherige Leistungszusage.',
        steps: [
          'Vor der Buchung den eigenen Versicherer nach den tariflichen Bedingungen für eine Kur im Ausland fragen.',
          'Nach Möglichkeit eine schriftliche Kostenzusage vor Reiseantritt einholen.',
          'Rechnungen und ärztliche Verordnung sammeln und nach der Kur zur Erstattung einreichen.',
        ],
        basis: '§ 192 Abs. 1 VVG in Verbindung mit dem individuellen Versicherungsvertrag',
      },
    ],
    selfPayHeading: 'Was der Gast in jedem Fall selbst zahlt',
    selfPayBody:
      'Unabhängig vom gewählten Weg zahlt jeder Gast Anreise, Unterkunft und Verpflegung während einer ambulanten Kur grundsätzlich selbst — keiner der genannten Kostenträger übernimmt diese Posten routinemäßig. Wer keinen der oben genannten Wege nutzen möchte oder kann, bucht das Kurpaket einfach direkt beim Kurhotel und bezahlt selbst: Das ist der einfachste und schnellste Weg, weil weder eine ärztliche Verordnung noch eine Genehmigung der Kasse, Beihilfestelle oder Versicherung nötig ist.',
    disclaimer:
      'Über den Anspruch auf Kostenübernahme entscheidet ausschließlich die zuständige Krankenkasse, Festsetzungsstelle oder Versicherung im Einzelfall — Marienbad.com und die Kureinrichtungen vor Ort können weder eine Genehmigung noch eine Erstattung zusagen. Klären Sie Anspruch und Umfang deshalb immer vor Reiseantritt direkt mit Ihrem Kostenträger.',
    faqs: [
      {
        question: 'Zahlt die Krankenkasse eine Kur im Ausland?',
        answer:
          'Ja, aber nicht automatisch: Die gesetzliche Krankenkasse erbringt ambulante Vorsorgeleistungen nach § 23 Abs. 2 SGB V in anerkannten Kurorten, wenn der Hausarzt die medizinische Notwendigkeit bestätigt und die Kasse zustimmt. Bei einer Kur in einem anderen EU-Land wie Tschechien erfolgt die Zahlung in der Regel über Kostenerstattung nach § 13 Abs. 4 SGB V, begrenzt auf die Kosten, die im Inland angefallen wären. Unterkunft und Verpflegung zahlt der Gast auch bei Bewilligung selbst.',
      },
      {
        question: 'Wie beantrage ich eine Kur?',
        answer:
          'Der erste Schritt ist immer der Hausarzt oder Vertragsarzt: Er stellt fest, ob eine ambulante Vorsorgekur medizinisch notwendig ist, und bescheinigt dies. Mit dieser Bescheinigung stellen Sie vor Reiseantritt einen Antrag bei Ihrer Krankenkasse, Beihilfestelle oder privaten Versicherung — je nachdem, wie Sie versichert sind. Die gesetzliche Krankenkasse muss über den Antrag regulär innerhalb von drei Wochen entscheiden, bei Einholung eines Gutachtens innerhalb von fünf Wochen (§ 13 Abs. 3a SGB V).',
      },
      {
        question: 'Wie oft steht mir eine Kur zu?',
        answer:
          'Für gesetzlich Versicherte gilt: Eine ambulante Vorsorgeleistung nach § 23 Abs. 2 SGB V kann grundsätzlich nicht vor Ablauf von drei Jahren seit einer vergleichbaren, öffentlich bezuschussten Maßnahme erneut bewilligt werden — außer sie ist aus dringenden medizinischen Gründen im Einzelfall früher erforderlich (§ 23 Abs. 5 SGB V). Für Beihilfeberechtigte und privat Versicherte gelten die Fristen der jeweiligen Beihilfeverordnung beziehungsweise des Versicherungstarifs.',
      },
      {
        question: 'Was kostet eine Kur ohne Zuschuss der Krankenkasse?',
        answer:
          'Ohne Kostenübernahme zahlt der Gast das komplette Kurpaket selbst — Unterkunft, Verpflegung, ärztliche Betreuung und die Anwendungen. Die Höhe hängt von der Aufenthaltsdauer, der Zimmerkategorie und dem gewählten Behandlungsprogramm ab. Aktuelle Beispielpreise für unterschiedlich lange Aufenthalte in Marienbad finden Sie im verlinkten Preisführer.',
      },
      {
        question: 'Was ist der Unterschied zwischen einer Kur und einem Wellnessurlaub?',
        answer:
          'Eine Kur setzt eine ärztlich festgestellte medizinische Notwendigkeit voraus: Ein Kurarzt erstellt einen individuellen Behandlungsplan, begleitet den Verlauf und dokumentiert das Ergebnis — nur so kann sich ein Kostenträger nach § 23 SGB V, einer Beihilfeverordnung oder einem PKV-Tarif überhaupt beteiligen. Ein Wellnessurlaub dagegen ist eine frei gebuchte Erholungsreise ohne medizinische Indikation, ärztliche Begleitung oder Anspruch auf Kostenübernahme durch einen Versicherer.',
      },
      {
        question: 'Wer verschreibt eine Kur?',
        answer:
          'Die ambulante Vorsorgekur verordnet der behandelnde Hausarzt oder Vertragsarzt, der die medizinische Notwendigkeit bescheinigt. Über die Bewilligung entscheidet anschließend die Krankenkasse, die dafür bei Bedarf eine gutachtliche Stellungnahme des Medizinischen Dienstes einholen kann (§ 13 Abs. 3a SGB V). Vor Ort in Marienbad übernimmt der Kurarzt die medizinische Leitung und legt das konkrete Behandlungsprogramm fest.',
      },
    ],
    sources: [
      {
        title: '§ 23 SGB V – Medizinische Vorsorgeleistungen',
        url: 'https://www.gesetze-im-internet.de/sgb_5/__23.html',
        note: 'Anspruch auf ambulante Vorsorgeleistungen (Vorsorgekur), Pflicht- und Ermessensleistungen, Wartefristen.',
      },
      {
        title: '§ 13 SGB V – Kostenerstattung',
        url: 'https://www.gesetze-im-internet.de/sgb_5/__13.html',
        note: 'Abs. 2–3a: Verfahren und Fristen; Abs. 4–5: Kostenerstattung bzw. vorherige Zustimmung bei Behandlung im EU-/EWR-Ausland.',
      },
      {
        title: 'Verordnung (EG) Nr. 883/2004 – Art. 20 (Reisen zum Zweck des Erhalts von Sachleistungen)',
        url: 'https://europa.eu/youreurope/citizens/health/planned-healthcare/right-to-treatment/index_de.htm',
        note: 'Offizielle EU-Bürgerinformation zum Verfahren der Vorabgenehmigung und zum Vordruck S2.',
      },
      {
        title: '§ 35 BBhV – Rehabilitationsmaßnahmen',
        url: 'https://www.gesetze-im-internet.de/bbhv/__35.html',
        note: 'Beihilfefähigkeit ambulanter Reha-/Kurmaßnahmen für Bundesbeamtinnen und -beamte (Bundesregelung als Beispiel).',
      },
      {
        title: '§ 36 BBhV – Voraussetzungen für Rehabilitationsmaßnahmen',
        url: 'https://www.gesetze-im-internet.de/bbhv/__36.html',
        note: 'Vorherige Anerkennung durch die Festsetzungsstelle auf Grundlage einer ärztlichen Bescheinigung.',
      },
      {
        title: '§ 11 BBhV – Aufwendungen im Ausland',
        url: 'https://www.gesetze-im-internet.de/bbhv/__11.html',
        note: 'Behandlung in einem EU-Mitgliedstaat wird wie eine Inlandsbehandlung behandelt.',
      },
      {
        title: '§ 192 VVG – Vertragstypische Leistungen des Versicherers',
        url: 'https://www.gesetze-im-internet.de/vvg_2008/__192.html',
        note: 'Private Krankenversicherung leistet nur im vertraglich vereinbarten Umfang.',
      },
    ],
    related: [
      { label: 'Ambulante Badekur in Tschechien: So zahlt Ihre Krankenkasse mit', href: '/de/magazin/ambulante-badekur-tschechien' },
      { label: 'Beihilfe, privat oder gesetzlich: Wer zahlt was bei einer Kur in Marienbad', href: '/de/magazin/kur-beihilfe-privat-gesetzlich' },
      { label: 'Was kostet eine Kurwoche in Marienbad — Preisführer 2026', href: '/de/magazin/kur-marienbad-kosten' },
    ],
    reviewDate: '2026-09-14',
  },
}
