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
  en: {
    navLabel: 'Paying for treatment',
    title: 'Paying for spa treatment in Marienbad',
    h1: 'Who pays for a spa cure in Marienbad?',
    metaTitle: 'Who pays for a spa cure in Marienbad? — Marienbad.com',
    metaDescription: 'EU cross-border rules, the NHS S2 route, Czech public insurance or paying yourself: who can have a spa cure in Marienbad covered, and how to apply.',
    lead: 'Whether anyone other than you pays for a spa cure in Marienbad depends entirely on where you are insured. Four routes exist in law, and each rests on a different rule. Below is what each one covers, who can use it and what it takes to apply.',
    shortAnswer: 'It depends on where you are insured, and for most international guests the honest answer is that they pay themselves. Patients insured in another EU or EEA country can claim a spa stay in Mariánské Lázně back under the Cross-Border Healthcare Directive (2011/24/EU), reimbursed up to what the same care would have cost at home, or have it covered as Czech state care if their insurer authorises it in advance on form S2 (Article 20 of Regulation (EC) No 883/2004). Patients insured in the Czech Republic receive spa care as a benefit of the public system under the Czech indication list. Residents of the United Kingdom can apply to NHS England under the Planned Treatment (S2) route, but it funds only care the NHS would routinely commission for that patient and cannot deliver within a medically acceptable time. In every route the guest pays for travel, accommodation and meals, and only the insurer decides — never the spa.',
    routesHeading: 'Routes to having the treatment paid for',
    routes: [
      {
        name: 'The Cross-Border Healthcare Directive, for patients insured in the EU or EEA',
        who: 'Guests covered by the statutory health insurance of another EU or EEA country who want abroad the same care they are entitled to at home.',
        covers: 'You pay the Czech provider yourself and claim the money back from your own insurer afterwards. Reimbursement is capped at what the same or equivalent treatment would have cost under your own public system, or at the Czech price if that is lower, so any difference stays with you. Prior authorisation is not required for everything, but a country may demand it for care involving an overnight stay, for highly specialised procedures or where expensive equipment is used — a spa stay always involves overnight accommodation, so this has to be settled before booking. Travel, accommodation and meals are the patient’s own cost. Only the National Contact Point for cross-border healthcare in the country where you are insured can tell you which of these conditions apply to you.',
        steps: [
          'Contact the National Contact Point for cross-border healthcare in the country where you are insured and ask whether a spa stay in the Czech Republic needs prior authorisation in your case.',
          'Ask your own doctor for a referral or medical documentation setting out why the treatment is needed.',
          'If authorisation is required, apply for it and wait for the decision before you book anything.',
          'Book the stay, pay the provider and keep every invoice together with the report from the spa physician.',
          'Submit the original documents to your insurer at home and claim reimbursement at your national rate.',
        ],
        basis: 'Directive 2011/24/EU on the application of patients’ rights in cross-border healthcare',
      },
      {
        name: 'Prior authorisation on form S2, for patients insured in the EU or EEA',
        who: 'Guests insured in another EU or EEA country whose insurer agrees in advance to fund planned treatment in the Czech Republic.',
        covers: 'With an authorised S2 you are treated as if you were insured in the Czech Republic: the Czech public system provides the authorised care on the same terms as for a Czech patient, and you pay only what a Czech patient would pay. The route works only where the provider delivers the care inside the Czech public health insurance system rather than as a private booking, and only for the treatment named in the authorisation. Your insurer must authorise it before you travel and may refuse. Travel, accommodation and meals are not covered.',
        steps: [
          'Ask your insurer at home whether it will issue an S2 for spa treatment in the Czech Republic, and on what medical grounds.',
          'Have your doctor document the diagnosis and the reason the treatment is needed.',
          'Confirm with the chosen spa facility that it can deliver the stay within the Czech public health insurance system and will accept an S2.',
          'Submit the application and wait for the written authorisation — travelling first forfeits the route.',
          'Take the authorised S2 with you and present it on arrival, before treatment begins.',
        ],
        basis: 'Article 20 of Regulation (EC) No 883/2004 on the coordination of social security systems (portable document S2)',
      },
      {
        name: 'The NHS Planned Treatment (S2) route, for residents of the United Kingdom',
        who: 'People ordinarily resident in England, registered with an NHS GP and entitled to NHS treatment. Wales, Scotland and Northern Ireland run their own equivalent arrangements through their own health departments.',
        covers: 'NHS England funds planned state healthcare in an EU country only where every criterion is met: approval obtained before travelling, care delivered inside the treating country’s state system rather than privately, treatment that would be routinely commissioned for that patient on the NHS, and confirmation that the NHS cannot provide the same or equivalent treatment within a medically acceptable timeframe. Written support from a clinician in the treating country and a declaration from the provider are both required. Travel, accommodation and translation costs are explicitly excluded. The separate EU Directive reimbursement route ended for the UK after Brexit and now covers only legacy cases from before 2021. A traditional spa cure meets this set of conditions only rarely, which is why most British guests come to Marienbad as self-paying visitors.',
        steps: [
          'Read the eligibility criteria on the NHS page for the Planned Treatment (S2 funding) route before making any arrangements.',
          'See your NHS GP about the condition and obtain the clinical assessment the application requires.',
          'Obtain written support from a clinician in the EU country stating the diagnosis, the need for treatment and the timeframe.',
          'Ask the intended provider to complete the Provider Declaration confirming the care is delivered through the Czech state system.',
          'Submit the S2 application to NHS England and wait for approval before you travel.',
        ],
        basis: 'NHS England, the Planned Treatment Scheme (S2 funding route)',
      },
      {
        name: 'Czech public health insurance, for guests insured in the Czech Republic',
        who: 'Anyone covered by Czech public health insurance, including citizens of other countries who live and work in the Czech Republic.',
        covers: 'Spa care is a benefit of the Czech public system rather than an extra. A physician proposes the stay, the insurer approves it, and a ministerial decree — the indication list — sets which diagnosis qualifies for which type and length of stay. Under comprehensive care the insurer pays for accommodation, meals, treatments and medical supervision and the stay lasts 21 or 28 days. Under contributory care the insurer pays for the treatments and medical supervision while the patient pays for accommodation and meals, and the stay lasts 14 or 21 days. Which applies is set by the item on the indication list, not by choice.',
        steps: [
          'See your GP or an outpatient specialist and ask for a proposal for spa treatment care.',
          'Ask the doctor to name Léčebné lázně Mariánské Lázně a.s. in the proposal.',
          'Wait for your insurer to approve the proposal and issue the stay.',
          'Arrive on the date given and see the spa physician, who sets the individual treatment plan.',
        ],
        basis: 'Decree No. 2/2015 Coll., the Czech indication list for spa treatment care',
      },
    ],
    selfPayHeading: 'What every guest pays for themselves',
    selfPayBody: 'None of the routes above pays for getting to Marienbad, for the hotel room or for meals during an outpatient cure; those remain the guest’s own cost even when an insurer approves the treatment itself. Booking a package directly with a spa hotel and paying for it is the simplest and by far the fastest option, because it needs no referral, no authorisation and no waiting for a decision — and it is how the large majority of international guests come. The medical side does not change: the spa physician examines you on arrival and sets the treatment plan either way.',
    disclaimer: 'Only your own insurer, health authority or National Contact Point can decide whether your treatment is covered and at what rate. Neither Marienbad.com nor the spa facilities can promise an approval or a reimbursement, and none of this page is legal advice. Settle the question with whoever is expected to pay before you travel, not afterwards.',
    faqs: [
      {
        question: 'Does health insurance pay for a spa cure in the Czech Republic?',
        answer: 'It depends on where you are insured. Patients insured in another EU or EEA country can claim the treatment back under the Cross-Border Healthcare Directive, up to what the same care would have cost at home, or have it covered as Czech state care if their insurer authorises it in advance on form S2. Patients insured in the Czech Republic receive spa care as a benefit of the public system under the Czech indication list. Everyone else books and pays directly. Travel, accommodation and meals are the guest’s own cost on every route, and the decision always rests with the insurer rather than with the spa.',
      },
      {
        question: 'Can I use my EHIC or GHIC for spa treatment in Marienbad?',
        answer: 'No. The European Health Insurance Card entitles you to medical treatment that cannot wait until you get home during a temporary stay in another EU country. A spa cure is planned treatment arranged in advance, which is a different category altogether: it runs either through the Cross-Border Healthcare Directive or through prior authorisation on form S2. Carry the card for anything unexpected that happens while you are here, but it will not pay for the cure itself.',
      },
      {
        question: 'Will the NHS pay for a spa cure abroad?',
        answer: 'Only through the Planned Treatment (S2) route, and only where every one of its criteria is met: approval before travel, care delivered within the treating country’s state system, treatment that would be routinely commissioned for that patient on the NHS, and NHS confirmation that it cannot provide the same or equivalent treatment within a medically acceptable timeframe. Travel and accommodation are excluded in any case. The EU Directive reimbursement route ended for the UK after Brexit apart from legacy cases. In practice a spa cure clears that bar only rarely, so British guests usually come as self-paying visitors.',
      },
      {
        question: 'How do I apply for a spa cure to be paid for?',
        answer: 'Start with a doctor, never with the booking. Whichever route applies, it begins with a physician documenting the diagnosis and why the treatment is needed. You then approach whoever would pay — your statutory insurer, your National Contact Point for cross-border healthcare, or NHS England for the S2 route — and apply before you travel. Booking and paying first usually forfeits the claim, because the routes that require prior authorisation cannot be applied retrospectively.',
      },
      {
        question: 'How much does a spa stay cost if I pay for it myself?',
        answer: 'A self-paid stay covers accommodation, meals, the medical consultation and the prescribed treatments in a single package price. What it comes to depends on the length of the stay, the hotel and room category, and the treatment programme chosen. Current example prices for stays of different lengths in Marienbad are set out in the price guide linked below.',
      },
      {
        question: 'What is the difference between a spa cure and a wellness break?',
        answer: 'A spa cure rests on a medical indication: a physician examines the patient, prescribes an individual programme of treatments, follows the course and records the result. That medical framework is what allows an insurer to contribute at all. A wellness break is a freely booked holiday with treatments chosen for pleasure, with no diagnosis, no medical supervision and no route to having it paid for by an insurer.',
      },
      {
        question: 'Who decides which treatments I get in Marienbad?',
        answer: 'The spa physician on site. Whatever your doctor at home has written and whoever is paying, the treatment plan is set here after an examination on arrival, and it takes your current condition and any contraindications into account. That applies to self-paying guests exactly as it does to those whose stay an insurer has approved.',
      },
    ],
    sources: [
      {
        title: 'Directive 2011/24/EU on the application of patients’ rights in cross-border healthcare',
        url: 'https://eur-lex.europa.eu/eli/dir/2011/24/oj',
        note: 'The reimbursement route: treatment abroad refunded up to the cost of the same care at home, with prior authorisation permitted for overnight and highly specialised care.',
      },
      {
        title: 'Regulation (EC) No 883/2004 on the coordination of social security systems',
        url: 'https://eur-lex.europa.eu/eli/reg/2004/883/oj',
        note: 'Article 20: planned treatment in another member state with prior authorisation, provided on portable document S2.',
      },
      {
        title: 'Your Europe — Organising planned medical treatment in another EU country',
        url: 'https://europa.eu/youreurope/citizens/health/planned-healthcare/right-to-treatment/index_en.htm',
        note: 'Official EU citizens’ information: which costs are reimbursed, when prior authorisation is needed, and that travel and accommodation are the patient’s own responsibility.',
      },
      {
        title: 'Your Europe — Health cover for temporary stays in another EU country',
        url: 'https://europa.eu/youreurope/citizens/health/unplanned-healthcare/temporary-stays/index_en.htm',
        note: 'Why the EHIC does not pay for a spa cure: it covers treatment that cannot wait until you return home, not planned treatment.',
      },
      {
        title: 'NHS — The Planned Treatment Scheme (S2 funding route)',
        url: 'https://www.nhs.uk/using-the-nhs/healthcare-abroad/going-abroad-for-treatment/planned-treatment-s2-funding-route/',
        note: 'The full eligibility criteria for UK residents, including prior approval, state healthcare only, routine NHS commissioning, undue delay, and the exclusion of travel and accommodation.',
      },
      {
        title: 'NHS — The EU Directive route',
        url: 'https://www.nhs.uk/using-the-nhs/healthcare-abroad/going-abroad-for-treatment/eu-directive-route/',
        note: 'Confirms the EU Directive reimbursement route has ended in the UK, with legacy arrangements only for treatment begun before 2021.',
      },
      {
        title: 'Health Insurance Bureau (Kancelář zdravotního pojištění) — Planned health care in the Czech Republic',
        url: 'https://kancelarzp.cz/en/planned-health-care-in-cz/',
        note: 'The Czech National Contact Point for cross-border healthcare: planned treatment with and without the insurer’s consent, and patients’ rights in the Czech Republic.',
      },
      {
        title: 'Decree No. 2/2015 Coll., on the indication list for spa treatment care',
        url: 'https://www.zakonyprolidi.cz/cs/2015-2',
        note: 'The Czech indication list: which diagnosis qualifies for comprehensive or contributory spa care and for how many days. Czech text.',
      },
    ],
    related: [
      {
        label: 'How to obtain a spa treatment voucher from your doctor — a guide for guests insured in the Czech Republic',
        href: '/en/magazine/spa-treatment-insurance-guide',
      },
      {
        label: 'How much does a spa week cost — 2026 price guide',
        href: '/en/magazine/spa-week-cost-marienbad',
      },
      {
        label: 'Outpatient spa treatment in Marienbad',
        href: '/en/outpatient-treatment',
      },
    ],
    reviewDate: '2026-09-14',
  },
  ru: {
    navLabel: 'Оплата лечения',
    title: 'Лечение на курорте в Чехии: кто платит?',
    h1: 'Кто оплачивает курортное лечение в Марианских Лазнях?',
    metaTitle: 'Оплата курортного лечения в Марианских Лазнях | Marienbad.com',
    metaDescription:
      'Что входит в курортный пакет, чем лечение отличается от wellness, координация в рамках ЕС по форме S2 — кто платит за лечение в Марианских Лазнях.',
    lead: 'Большинство гостей, приезжающих в Марианские Лазни из России и других стран без соглашения с чешскими лечебными учреждениями, оплачивают курортное лечение самостоятельно. Ниже — что входит в курортный пакет, чем лечебное пребывание отличается от wellness-отдыха и какая координация возможна, если вы застрахованы в стране Евросоюза.',
    shortAnswer:
      'Как правило, гость оплачивает курортное лечение в Марианских Лазнях сам: пакет бронируется и оплачивается напрямую в отеле, отдельно от него всегда оплачиваются курортный сбор и проезд. Если вы застрахованы в системе обязательного медицинского страхования страны ЕС или ЕЭП, для планового лечения возможна координация по Регламенту (ЕС) № 883/2004 — но только с предварительным согласием вашего страхового учреждения (форма S2 или аналогичный документ); без него оплата после поездки, как правило, невозможна. Размещение и питание гость в любом случае оплачивает сам. Решение о праве на оплату всегда принимает плательщик — страховое учреждение или страховая компания, — а не курортное заведение.',
    routesHeading: 'Пути участия в оплате',
    routes: [
      {
        name: 'Самостоятельная оплата курортного пакета',
        who: 'Большинство гостей из России и других стран, у которых нет действующего соглашения между их страховой компанией и чешским лечебным учреждением. Это самый быстрый и наиболее распространённый путь.',
        covers:
          'Курортный пакет отеля обычно включает первичный врачебный осмотр, назначенные врачом процедуры, размещение и полу- или полный пансион в одной цене. Отдельно от пакета гость всегда оплачивает курортный сбор (местный сбор за пребывание) и проезд до Чехии и обратно. От wellness-пребывания лечебный пакет отличает именно врачебная часть: первичный осмотр, индивидуальный план процедур, наблюдение курортного врача на протяжении пребывания и заключение по его окончании — без этого пребывание остаётся отдыхом, а не лечением.',
        steps: [
          'Выбрать отель и лечебную программу по своему диагнозу; при сомнениях уточнить у отеля или курортного врача, что именно входит в конкретный пакет.',
          'Забронировать пребывание напрямую в отеле — предварительное разрешение врача или страховой компании для этого не требуется.',
          'При заезде пройти первичный врачебный осмотр, который определяет окончательный список процедур.',
          'Оплатить пакет по счёту отеля; курортный сбор и любые дополнительные процедуры сверх пакета оплачиваются отдельно на месте.',
        ],
        basis: 'Договор с курортным отелем; курортный сбор — Закон № 565/1990 Сб., о местных сборах, в действующей редакции.',
      },
      {
        name: 'Координация в рамках ЕС для застрахованных в странах ЕС/ЕЭП (форма S2)',
        who: 'Гости, застрахованные в системе обязательного медицинского страхования страны ЕС или ЕЭП, которым лечащий врач по месту жительства назначил плановое лечение.',
        covers:
          'Регламент (ЕС) № 883/2004 позволяет пройти запланированное лечение в другой стране ЕС или ЕЭП, если компетентное учреждение по месту страхования заранее выдаёт согласие — форма S2 согласно статье 20 Регламента. При наличии такого согласия лечение оплачивается в объёме, который покрыло бы это учреждение по месту жительства, то есть по правилам своей страны, а не автоматически в полном объёме чешского лечебного пакета. Размещение, питание и проезд гость в любом случае оплачивает сам. Правило касается только государственного обязательного страхования конкретной страны ЕС или ЕЭП — не любого полиса, названного «европейским».',
        steps: [
          'Уточнить у своего компетентного учреждения (обычно это страховая компания или касса по месту жительства), покрывает ли она плановое лечение за рубежом и на каких условиях.',
          'Получить у лечащего врача направление с обоснованием медицинской необходимости лечения.',
          'Подать заявление на выдачу формы S2 (или равнозначного документа) до начала поездки и дождаться решения — без предварительного согласия оплата задним числом, как правило, невозможна.',
          'После получения согласия забронировать пребывание и пройти лечение по назначенному плану.',
          'Сохранить все документы и счета и передать их своему страховому учреждению для оформления оплаты по установленной им процедуре.',
        ],
        basis: 'Регламент (ЕС) № 883/2004, статья 20 — координация систем социального обеспечения.',
      },
      {
        name: 'Добровольное (частное) медицинское страхование',
        who: 'Гости с действующим полисом добровольного медицинского страхования, который прямо предусматривает оплату планового лечения за рубежом.',
        covers:
          'Страховая компания оплачивает только в объёме, прямо согласованном в договоре страхования, и только медицински необходимое лечение — не размещение и не питание. Многие туристические и частные полисы прямо исключают курортное лечение или требуют предварительного письменного согласия страховщика; это определяет исключительно текст конкретного договора, а не общее правило.',
        steps: [
          'До бронирования уточнить у своей страховой компании условия конкретного полиса в отношении планового лечения за рубежом.',
          'По возможности получить письменное согласие на оплату до начала поездки.',
          'Собрать врачебное направление, счета и документы о прохождении лечения и подать их страховщику после возвращения.',
        ],
        basis: 'Условия конкретного договора добровольного медицинского страхования.',
      },
    ],
    selfPayHeading: 'Что гость платит в любом случае',
    selfPayBody:
      'Независимо от выбранного пути, проезд гость оплачивает сам всегда, а размещение и питание — сам всегда, если только они прямо не входят в согласованный со страховым учреждением объём (что для координации по форме S2 не является типичным случаем). Курортный сбор, установленный чешским законом о местных сборах, также оплачивается на месте и не входит ни в одну из перечисленных схем участия в оплате. Тот, кто не хочет или не может использовать координацию через страховое учреждение, просто бронирует лечебный пакет напрямую в отеле и оплачивает его сам — это самый простой и быстрый способ, потому что не требует ни направления врача, ни согласия страховой компании.',
    disclaimer:
      'Решение о праве на оплату и о её объёме в каждом конкретном случае принимает исключительно компетентное страховое учреждение или страховая компания — Marienbad.com и лечебные заведения на месте не могут ни одобрить оплату, ни гарантировать возмещение. Поэтому право на оплату и её объём всегда уточняйте у своего плательщика до начала поездки.',
    faqs: [
      {
        question: 'Кто оплачивает курортное лечение в Чехии для гостя из России?',
        answer:
          'В большинстве случаев — сам гость: курортный пакет бронируется и оплачивается напрямую в отеле, без участия страховой компании. Пакет обычно включает первичный врачебный осмотр, назначенные врачом процедуры, размещение и питание; отдельно оплачиваются курортный сбор и проезд.',
      },
      {
        question: 'Чем лечебное пребывание отличается от wellness-отдыха?',
        answer:
          'Лечебное пребывание предполагает первичный врачебный осмотр, индивидуальный план процедур, наблюдение курортного врача на протяжении пребывания и итоговое заключение для домашнего врача. Wellness-отдых — это свободно забронированная поездка для отдыха без медицинского показания, врачебного сопровождения и без права на участие страховой компании в оплате.',
      },
      {
        question: 'Можно ли оформить оплату лечения через европейскую страховую компанию?',
        answer:
          'Да, если вы застрахованы в системе обязательного медицинского страхования страны ЕС или ЕЭП и получили от своего компетентного учреждения предварительное согласие на плановое лечение за рубежом — форма S2 согласно Регламенту (ЕС) № 883/2004, статья 20. Без этого предварительного согласия оплата задним числом, как правило, невозможна.',
      },
      {
        question: 'Что нужно оплатить самостоятельно в любом случае?',
        answer:
          'Проезд — всегда, а размещение и питание — почти всегда, если только они прямо не были включены в согласованный со страховым учреждением объём. Курортный сбор оплачивается на месте отдельно и не входит ни в одну из схем участия в оплате.',
      },
      {
        question: 'Кто решает, оплатит ли страховая компания лечение?',
        answer:
          'Решение всегда принимает компетентное страховое учреждение или страховая компания в конкретном случае — ни курортный отель, ни Marienbad.com не могут ни одобрить оплату, ни гарантировать возмещение. Условия и объём уточняйте у своего плательщика до бронирования.',
      },
    ],
    sources: [
      {
        title: 'Регламент (ЕС) № 883/2004 о координации систем социального обеспечения',
        url: 'https://eur-lex.europa.eu/eli/reg/2004/883/oj',
        note: 'Статья 20: плановое лечение в другом государстве-члене по предварительному согласию, оформляемому переносимым документом S2. Текст на официальных языках ЕС.',
      },
      {
        title: 'Your Europe — плановое лечение в другой стране ЕС',
        url: 'https://europa.eu/youreurope/citizens/health/planned-healthcare/right-to-treatment/index_en.htm',
        note: 'Официальная информация ЕС о процедуре предварительного согласия, о форме S2 и о том, что проезд и проживание остаются расходами пациента. Страница на английском языке.',
      },
      {
        title: 'Закон № 565/1990 Сб., о местных сборах, в действующей редакции',
        url: 'https://www.zakonyprolidi.cz/cs/1990-565',
        note: 'Правовая основа курортного сбора (сбора за пребывание), который гость оплачивает на месте отдельно от курортного пакета.',
      },
    ],
    related: [
      { label: 'Путёвка в санаторий: как устроен лечебный пакет', href: '/ru/zhurnal/putevka-v-sanatorij-guide' },
      { label: 'Сколько стоит лечение в Марианских Лазнях', href: '/ru/zhurnal/stoimost-lecheniya-marianske-lazne' },
      { label: 'Путеводитель по лечебным процедурам', href: '/ru/zhurnal/lechebnye-procedury-guide' },
    ],
    reviewDate: '2026-09-14',
  },
}
