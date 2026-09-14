import type { Locale } from '@/i18n/config'
import { routes } from '@/i18n/config'

/**
 * Léčba podle diagnózy — stránky na úrovni dotazu, ne indikační skupiny.
 *
 * Proč to existuje vedle `/cs/lazne-s-pojistovnou/indikace/*`: ta sekce
 * odpovídá na „co hradí česká pojišťovna“ na úrovni skupiny (kódy, K/P, délka).
 * Tyhle stránky odpovídají na „mám tuhle diagnózu, kam a co mě čeká“ na úrovni
 * konkrétního zákroku nebo nemoci, ve všech čtyřech jazycích. Obě sady se
 * navzájem odkazují, takže se ve vyhledávání nepřebíjejí.
 *
 * Zdroj tvrzení: `data/evidence/balneology_evidence.json` a indikační seznam
 * v `src/data/indications.ts`. Redakční pravidla: CLAUDE.md → „Zdravotní
 * tvrzení“. Bez měřitelného doloženého výstupu se přínos nepíše.
 */

/** Jedna otázka a odpověď. Znění otázky drží formulaci, jakou lidé skutečně píší. */
export interface DiagnosisFaq {
  question: string
  answer: string
}

/** Citovaný zdroj — stejný tvar jako `sources` u článků, vykresluje ArticleSources. */
export interface DiagnosisSource {
  title: string
  url: string
  note?: string
}

/** Jazyková část stránky. Vše, co se překládá. */
export interface DiagnosisContent {
  /** Slug v této jazykové verzi, bez lomítek. */
  slug: string
  navLabel: string
  title: string
  h1: string
  metaTitle: string
  metaDescription: string
  /** Dvě až tři věty pod nadpisem: co to je a proč zrovna Mariánské Lázně. */
  lead: string
  /** Krátké shrnutí pro dlaždici na rozcestníku. */
  teaser: string
  /** Co se u této diagnózy léčí — konkrétní stavy, ne obecné kategorie. */
  treats: string[]
  /** Komu stránka není určená: akutní stavy, kontraindikace. */
  notFor: string[]
  /** Jak pobyt probíhá. Nadpis a odstavec na krok. */
  course: { heading: string; body: string }[]
  /** Procedury s vysvětlením, proč se u této diagnózy používají. */
  procedures: { name: string; detail: string }[]
  /** Délka a načasování pobytu — vždy podle konkrétní položky seznamu. */
  stay: { heading: string; body: string }
  /** Co doložený výzkum říká. Nepovinné: bez doloženého výstupu se sekce vynechá. */
  evidence?: { heading: string; body: string }
  /**
   * Klinická zkušenost a probíhající výzkum. Používá se tam, kde k dané
   * diagnóze kontrolovaná studie lázeňské léčby zatím není: popíše se, co
   * se tu tradičně podává a co se právě zkoumá, místo konstatování, že
   * důkaz chybí.
   */
  ongoing?: { heading: string; body: string }
  /** Věta o tom, že o zařazení rozhoduje lázeňský lékař. Povinná. */
  physicianNote: string
  faqs: DiagnosisFaq[]
  sources: DiagnosisSource[]
  /** Odkazy na související články v téže jazykové verzi: [label, href]. */
  related: { label: string; href: string }[]
}

export interface Diagnosis {
  /** Stabilní klíč napříč jazyky. */
  id: string
  /** id skupiny v `src/data/indications.ts` — váže stránku na indikační seznam. */
  groupId: string
  /** Římská číslice indikační skupiny. */
  roman: string
  /** Kódy položek seznamu, které se této diagnózy týkají (např. VII/1, VII/9). */
  codes: string[]
  /** Anglický název stavu pro schema.org `MedicalCondition`. */
  conditionName: string
  /** Kód MKN-10, pokud je jednoznačný. Do schématu jako `code`. */
  icd10?: string
  image: string
  imageAlt: Record<Locale, string>
  /** Datum poslední odborné revize zdravotních tvrzení (ISO). */
  medicalReviewDate: string
  content: Record<Locale, DiagnosisContent>
}

/** Základ URL sekce v dané jazykové verzi. */
export function treatmentBase(locale: Locale): string {
  const slug = routes['treatment-for'][locale]
  return `/${locale}/${slug}`
}

/** Plná cesta ke stránce diagnózy v dané jazykové verzi. */
export function diagnosisHref(locale: Locale, d: Diagnosis): string {
  return `${treatmentBase(locale)}/${d.content[locale].slug}`
}

/** Mapa locale → URL pro hreflang. Všechny čtyři jazyky mají ekvivalent. */
export function diagnosisAlternates(d: Diagnosis): Record<Locale, string> {
  return {
    de: diagnosisHref('de', d),
    en: diagnosisHref('en', d),
    cs: diagnosisHref('cs', d),
    ru: diagnosisHref('ru', d),
  }
}

export const diagnoses: Diagnosis[] = [
  {
    id: 'osteoarthritis',
    groupId: 'musculoskeletal',
    roman: 'VII',
    codes: ['VII/7', 'VII/8'],
    conditionName: 'Osteoarthritis',
    icd10: 'M15-M19',
    image: '/images/library/treatments/electrode-pad-hip.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Therapeutin befestigt eine Elektrode am Hüftgelenk vor der Elektrotherapie',
      en: 'A therapist attaching an electrode to the hip before electrotherapy',
      cs: 'Terapeutka upevňuje elektrodu na kyčelní kloub před elektroléčbou',
      ru: 'Терапевт закрепляет электрод на тазобедренном суставе перед электролечением',
    },
    content: {
      de: {
        slug: 'arthrose',
        navLabel: 'Arthrose',
        title: 'Kur bei Arthrose in Marienbad',
        h1: 'Kur bei Arthrose',
        metaTitle: 'Kur bei Arthrose in Marienbad — Ablauf und Dauer | Marienbad.com',
        metaDescription:
          'Arthrose in Knie, Hüfte und Händen: welche Anwendungen die Marienbader Kur einsetzt, wie lange ein Aufenthalt dauert und wann eine Kur nicht infrage kommt.',
        lead:
          'Arthrose ist die häufigste Diagnose, mit der Gäste nach Marienbad kommen. Die Behandlung stützt sich auf Kohlensäurebäder aus örtlichem Mineralwasser, Moorpackungen und tägliche Physiotherapie — eine Kombination, die eine ambulante Reha in diesem Umfang nicht leisten kann.',
        teaser: 'Knie, Hüfte und Hände: Kohlensäurebäder, Moor und tägliche Physiotherapie über zwei bis drei Wochen.',
        treats: [
          'Gonarthrose und Koxarthrose, also Arthrose in Knie und Hüfte, unter laufender orthopädischer Betreuung',
          'Arthrose in anderen Gelenken und Arthropathien, etwa in Schulter, Hand oder Sprunggelenk',
          'Schmerzsyndrome an Sehnen, Sehnenscheiden, Schleimbeuteln und Muskelansätzen, die Arthrosebeschwerden begleiten',
          'Chronische Rückenbeschwerden funktionellen Ursprungs, die häufig gemeinsam mit Gelenkarthrose auftreten',
        ],
        notFor: [
          'Akuter Schub mit deutlicher Schwellung, Überwärmung und Ergussbildung — hier wird zunächst ambulant behandelt',
          'Frische Verletzung oder Operation ohne abgeschlossene Wundheilung und ohne fachärztliche Freigabe',
          'Akute Infektionskrankheiten, aktive Tumorerkrankung, Herzinsuffizienz im Stadium NYHA IV',
          'Schwangerschaft sowie Unfähigkeit zur Selbstversorgung ohne Begleitperson',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body:
              'Der Kurarzt sichtet Befunde und Medikation, untersucht die betroffenen Gelenke und stellt den Behandlungsplan zusammen. Bringen Sie aktuelle Röntgen- oder MRT-Befunde und eine Medikamentenliste mit; ohne sie fällt der Plan zwangsläufig vorsichtiger aus.',
          },
          {
            heading: 'Zwei bis drei Anwendungen täglich',
            body:
              'Der Vormittag gehört den passiven Anwendungen — Bad, Moorpackung, Elektrotherapie —, der Nachmittag der Bewegung. Nach jeder Wärmeanwendung folgt eine Nachruhe im Liegen; sie ist Teil der Behandlung, nicht eine Pause davon.',
          },
          {
            heading: 'Bewegung als zweite Säule',
            body:
              'Einzel- und Gruppentherapie, Übungen im Wasser und dosiertes Gehen auf den Kurwegen. Die Belastung wird schrittweise gesteigert, weil der Effekt aus der Wiederholung kommt, nicht aus der Intensität einer einzelnen Einheit.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body:
              'Einmal pro Woche prüft der Arzt den Verlauf und passt den Plan an. Zum Abschluss erhalten Sie einen Bericht für Ihren behandelnden Arzt und ein Übungsprogramm für zu Hause — der Teil der Kur, der am längsten wirkt.',
          },
        ],
        procedures: [
          { name: 'Kohlensäurebad', detail: 'Im natürlichen Mineralwasser. Über die Haut aufgenommenes CO₂ erweitert die kleinen Gefäße und steigert die Hautdurchblutung.' },
          { name: 'Trockenes Gasbad', detail: 'Im Mariengas mit 99,7 % CO₂, ohne Kreislaufbelastung durch Wasser — geeignet, wenn ein Wannenbad zu anstrengend wäre.' },
          { name: 'Moorpackung', detail: 'Wärmetherapie um 40 °C. Moor gibt die Wärme langsam ab, weshalb sie bei gleicher Temperatur besser vertragen wird als Wasser.' },
          { name: 'Unterwassermassage', detail: 'Druckstrahlmassage im warmen Becken, vor allem für die gelenknahe Muskulatur.' },
          { name: 'Bewegungstherapie im Wasser', detail: 'Der Auftrieb nimmt Last vom Gelenk, sodass Bewegungsumfang trainiert werden kann, der an Land schmerzt.' },
          { name: 'Physikalische Therapie', detail: 'Elektrotherapie, Magnetfeld, Laser und Ultraschall, jeweils nach Beschwerdebild und in Serie verordnet.' },
          { name: 'Gasinjektionen', detail: 'Subkutane CO₂-Anwendung in Gelenknähe. Sie beruht auf langer Kurpraxis; kontrollierte Studien dazu fehlen.' },
          { name: 'Einzelphysiotherapie', detail: 'Täglich, mit Anleitung für das Heimprogramm nach der Abreise.' },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body:
            'Bei Kox- und Gonarthrose (Position VII/7 der tschechischen Indikationsliste) trägt die tschechische Krankenkasse 21 Tage komplexe oder 21 Tage Zuschuss-Kurbehandlung, Wiederholungsaufenthalte 21 oder 14 Tage; bei Arthrose anderer Gelenke (VII/8) sind es 21 Tage. Selbstzahler wählen meist zwei bis drei Wochen nach Absprache mit dem Kurarzt. Kürzer als zwei Wochen ergibt wenig Sinn: die Fachliteratur bezeichnet 2–3 Wochen mit 10–21 Anwendungen als Norm der Balneotherapie. Für die Jahreszeit gibt es keine medizinische Vorgabe — im Spätsommer und Herbst ist der Kurbetrieb ruhiger und Termine lassen sich leichter legen.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body:
            'Arthrose ist das am besten untersuchte Gebiet der Kurmedizin. In einer randomisierten Studie mit 145 Patienten lag die Gelenkfunktion sechs Monate nach einer dreiwöchigen Kur um 11,7 WOMAC-Punkte über der üblichen Versorgung, und auch Schmerz und Steifigkeit blieben besser (Forestier et al., 2025, Int J Biometeorol; die Studie war nicht verblindet und lief in einem Land). Eine Metaanalyse über 734 Patienten fand Verbesserungen bei Schmerz, Steifigkeit und Funktion über zwei bis zwölf Monate, weist aber auf sehr uneinheitliche Studien hin (Matsumoto et al., 2017, Clin Rheumatol). Für Moor liegt eine randomisierte Studie mit 80 Patienten vor: nach zwei Wochen Packungen und Bädern hielten geringerer Schmerz und niedrigerer Medikamentenverbrauch neun Monate an, während die Kontrollgruppe unverändert blieb (Fioravanti et al., 2010, Am J Phys Med Rehabil). Eine Übersicht von 2025 fasst zusammen, was daraus folgt und was nicht: die Kur verbessert Schmerz, Steifigkeit und Leistungsfähigkeit länger als übliche Rehabilitation, aber kein Verfahren ändert den Verlauf der Arthrose selbst.',
        },
        physicianNote:
          'Ob und in welchem Umfang eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer Befunde. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        faqs: [
          {
            question: 'Welche Kurorte helfen bei Arthrose?',
            answer:
              'In Marienbad ist Arthrose die häufigste Behandlungsdiagnose. Der Ort verfügt über drei natürliche Heilmittel, die bei Arthrose eingesetzt werden: kohlensäurehaltiges Mineralwasser für Bäder, natürliches CO₂-Gas für Trockenbäder und Gasinjektionen sowie Moor für Wärmepackungen. Studien zur Balneotherapie bei Kniearthrose zeigen Verbesserungen von Schmerz und Funktion, die über das Kurende hinaus anhalten.',
          },
          {
            question: 'Wie lange sollte eine Kur bei Arthrose dauern, damit sie wirkt?',
            answer:
              'Die Fachliteratur nennt zwei bis drei Wochen mit 10 bis 21 Anwendungen als Norm; unter zehn Anwendungen in zehn Tagen spricht man nicht mehr von Balneotherapie. Die Studie mit dem längsten dokumentierten Effekt bei Arthrose arbeitete mit drei Wochen. Ein Wochenendaufenthalt ist Erholung, keine Kur.',
          },
          {
            question: 'Hilft eine Kur bei Arthrose dauerhaft?',
            answer:
              'Sie lindert Beschwerden über Monate, heilt die Arthrose aber nicht. In kontrollierten Studien hielten Schmerzlinderung und bessere Gelenkfunktion je nach Untersuchung drei bis neun Monate an, teils bei geringerem Schmerzmittelverbrauch. Den Knorpelverlust selbst hält kein bekanntes Verfahren auf, weshalb die Kur bei vielen Indikationen wiederholt wird.',
          },
          {
            question: 'Was kostet eine Kur bei Arthrose ohne Krankenkasse?',
            answer:
              'Der Preis richtet sich nach Hotel, Zimmerkategorie, Verpflegung und Anzahl der Anwendungen, nicht nach der Diagnose. Kurpakete der Marienbader Häuser enthalten Eingangsuntersuchung, ärztlich verordnete Anwendungen, Halb- oder Vollpension und Unterkunft in einem Preis. Eine aktuelle Aufstellung steht im Ratgeber zu den Kurkosten.',
          },
          {
            question: 'Kann ich mit einem künstlichen Gelenk zur Kur?',
            answer:
              'Ja, Zustände nach Gelenkersatz sind eine eigene Position der Indikationsliste und werden in Marienbad regelmäßig behandelt. Voraussetzung ist eine abgeschlossene Wundheilung und die Freigabe des Operateurs. Details stehen auf der Seite zur Kur nach einer Hüftoperation.',
          },
        ],
        sources: [
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe VII — Krankheiten des Bewegungsapparats',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Positionen VII/7 (Kox- und Gonarthrose) und VII/8 (Arthrose anderer Lokalisationen) mit Versorgungsart und Dauer des erstatteten Aufenthalts.',
          },
          {
            title: 'Forestier R et al. 2025, Int J Biometeorol — randomisierte Studie, 145 Patienten mit Kniearthrose, 6 Monate',
            url: 'https://consensus.app/papers/details/ec2bd40091555fb8918ed883777a3427/',
            note: 'Dreiwöchige Kur gegenüber üblicher Versorgung: nach 6 Monaten 11,7 WOMAC-Punkte bessere Funktion. Nicht verblindet, ein Land.',
          },
          {
            title: 'Matsumoto H et al. 2017, Clin Rheumatol — Metaanalyse, 734 Patienten',
            url: 'https://consensus.app/papers/details/7633beab80a1540daf33f7876b289d50/',
            note: 'Balneotherapie verbessert Schmerz, Steifigkeit und Funktion über 2 bis 12 Monate. Heterogenität 88–93 %, geringe Qualität der Primärstudien.',
          },
          {
            title: 'Fioravanti A et al. 2010, Am J Phys Med Rehabil — randomisierte Studie, 80 Patienten mit Kniearthrose',
            url: 'https://consensus.app/papers/details/117ceeafb8b45fcb8ed8113fbdbc701c/',
            note: 'Zwei Wochen Moorpackungen und Bäder: geringerer Schmerz und Medikamentenverbrauch über 9 Monate. Einfach verblindet, ein Zentrum.',
          },
          {
            title: 'Montvydaitė-Kreivaitienė O et al. 2025, Int J Biometeorol — systematische Übersicht',
            url: 'https://consensus.app/papers/details/1c3b89a927ee5550b463873139004fd6/',
            note: 'Bessere Langzeitergebnisse als übliche Rehabilitation; zugleich der Hinweis, dass kein Verfahren den Krankheitsverlauf ändert. Überwiegend Kniearthrose.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — Leserbrief zur Dauer der Kurbehandlung',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Norm der Kurbehandlung 2–3 Wochen mit 10–21 Anwendungen. Expertenmeinung, keine Studie.',
          },
        ],
        related: [
          { label: 'Moortherapie', href: '/de/peloidtherapie' },
          { label: 'CO₂-Therapie', href: '/de/co2-therapie' },
          { label: 'Bewegungsapparat: Moor und Mineralwasser', href: '/de/magazin/bewegungsapparat-moor-mineralwasser' },
          { label: 'Was eine Kur in Marienbad kostet', href: '/de/magazin/kur-marienbad-kosten' },
        ],
      },
      en: {
        slug: 'osteoarthritis',
        navLabel: 'Osteoarthritis',
        title: 'Spa treatment for osteoarthritis in Marienbad',
        h1: 'Spa treatment for osteoarthritis',
        metaTitle: 'Spa treatment for osteoarthritis in Marienbad | Marienbad.com',
        metaDescription:
          'Osteoarthritis of the knee, hip and hands: which treatments the Marienbad cure uses, how long a stay lasts, and when a spa cure is not the right choice.',
        lead:
          'Osteoarthritis is the most common diagnosis that brings guests to Mariánské Lázně (Marienbad). Treatment draws on carbon dioxide baths made with local mineral water, peat packs and daily physiotherapy — a combination that outpatient rehabilitation cannot match at this scale.',
        teaser: 'Knee, hip and hands: carbon dioxide baths, peat and daily physiotherapy over two to three weeks.',
        treats: [
          'Gonarthrosis and coxarthrosis — osteoarthritis of the knee and hip — under ongoing orthopaedic care',
          'Osteoarthritis in other joints and arthropathies, for example in the shoulder, hand or ankle',
          'Pain syndromes of tendons, tendon sheaths, bursae and muscle attachments that accompany osteoarthritis',
          'Chronic back complaints of functional origin, which often occur alongside joint osteoarthritis',
        ],
        notFor: [
          'An acute flare with marked swelling, warmth and joint effusion — this is treated on an outpatient basis first',
          'A recent injury or operation without completed wound healing and without specialist clearance',
          'Acute infectious disease, active cancer, or heart failure at NYHA stage IV',
          'Pregnancy, or an inability to manage personal care without a companion',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body:
              'The spa physician reviews your findings and medication, examines the affected joints and puts together the treatment plan. Bring recent X-ray or MRI reports and a list of your medication; without them the plan is necessarily more cautious.',
          },
          {
            heading: 'Two to three treatments daily',
            body:
              'Mornings belong to passive treatments — bath, peat pack, electrotherapy — and afternoons to movement. A rest period lying down follows every heat treatment; it is part of the therapy, not a break from it.',
          },
          {
            heading: 'Movement as the second pillar',
            body:
              'Individual and group therapy, exercises in water and measured walking on the spa paths. The load is increased step by step, because the effect comes from repetition, not from the intensity of a single session.',
          },
          {
            heading: 'Weekly check-up and final report',
            body:
              'Once a week the physician reviews your progress and adjusts the plan. At the end you receive a report for your own doctor and a home exercise programme — the part of the cure that lasts longest.',
          },
        ],
        procedures: [
          { name: 'Carbon dioxide bath', detail: 'In natural mineral water. CO₂ absorbed through the skin widens the small vessels and increases skin blood flow.' },
          { name: 'Dry gas bath', detail: 'In Maria’s gas, 99.7% CO₂, with no circulatory strain from water — suitable when a tub bath would be too demanding.' },
          { name: 'Peat pack', detail: 'Heat therapy at around 40 °C. Peat releases heat slowly, so it is better tolerated at the same temperature than water.' },
          { name: 'Underwater massage', detail: 'Pressure-jet massage in a warm pool, mainly for the muscles around the joint.' },
          { name: 'Exercise therapy in water', detail: 'Buoyancy takes load off the joint, so a range of movement can be trained that would hurt on dry land.' },
          { name: 'Physical therapy', detail: 'Electrotherapy, magnetic field therapy, laser and ultrasound, prescribed as a course according to the complaint.' },
          { name: 'Gas injections', detail: 'Subcutaneous CO₂ treatment near the joint. It rests on long spa practice; controlled trials are lacking.' },
          { name: 'Individual physiotherapy', detail: 'Daily, with guidance for the home programme after departure.' },
        ],
        stay: {
          heading: 'How long, and when',
          body:
            'For coxarthrosis and gonarthrosis (position VII/7 of the Czech indication list), stays covered by Czech public health insurance run to 21 days of comprehensive or 21 days of contributory spa care, with repeat stays of 21 or 14 days; for osteoarthritis in other joints (VII/8) it is 21 days. Self-paying guests usually choose two to three weeks in consultation with the spa physician. Shorter than two weeks makes little sense: the literature describes 2–3 weeks with 10–21 treatments as the norm for balneotherapy. There is no medical rule for the season — late summer and autumn are quieter at the spa and appointments are easier to arrange.',
        },
        evidence: {
          heading: 'What the studies show',
          body:
            'Osteoarthritis is the best-studied field of spa medicine. In a randomised trial of 145 patients, joint function six months after a three-week cure was 11.7 WOMAC points better than with usual care, and pain and stiffness also stayed improved (Forestier et al., 2025, Int J Biometeorol; the study was unblinded and ran in a single country). A meta-analysis covering 734 patients found improvements in pain, stiffness and function over two to twelve months, but points to very inconsistent studies (Matsumoto et al., 2017, Clin Rheumatol). For peat there is a randomised trial of 80 patients: after two weeks of packs and baths, lower pain and reduced medication use lasted nine months, while the control group stayed unchanged (Fioravanti et al., 2010, Am J Phys Med Rehabil). A 2025 review sums up what follows from this and what does not: the cure improves pain, stiffness and function for longer than usual rehabilitation, but no procedure changes the course of the osteoarthritis itself.',
        },
        physicianNote:
          'Whether and to what extent a spa cure is right for you is decided by the spa physician at the initial examination, based on your findings. This page provides information and does not replace medical advice.',
        faqs: [
          {
            question: 'Which spa resorts help with arthritis?',
            answer:
              'In Marienbad, osteoarthritis is the most common treatment diagnosis. The town has three natural remedies used for osteoarthritis: carbon-dioxide-rich mineral water for baths, natural CO₂ gas for dry baths and gas injections, and peat for heat packs. Studies on balneotherapy for knee osteoarthritis show improvements in pain and function that last beyond the end of the cure.',
          },
          {
            question: 'How long should a spa cure last to be effective?',
            answer:
              'The literature names two to three weeks with 10 to 21 treatments as the norm; under ten treatments in ten days is no longer considered balneotherapy. The study with the longest documented effect for osteoarthritis used three weeks. A weekend stay is recreation, not a cure.',
          },
          {
            question: 'Does a spa cure help with osteoarthritis for good?',
            answer:
              'It eases symptoms for months but does not cure the osteoarthritis. In controlled studies, pain relief and better joint function lasted three to nine months depending on the study, in some cases with lower use of pain medication. No known procedure halts the cartilage loss itself, which is why the cure is repeated for many indications.',
          },
          {
            question: 'What does a spa cure for osteoarthritis cost without health insurance?',
            answer:
              'The price depends on the hotel, room category, meals and number of treatments, not on the diagnosis. Cure packages at Marienbad’s hotels bundle the initial examination, medically prescribed treatments, half or full board, and accommodation into one price. A current overview is in our guide to spa costs.',
          },
          {
            question: 'Can I go for a spa cure with an artificial joint?',
            answer:
              'Yes, conditions after joint replacement are a separate position on the indication list and are regularly treated in Marienbad. The requirement is completed wound healing and clearance from the surgeon. Details are on the page about spa treatment after a hip replacement.',
          },
        ],
        sources: [
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group VII — diseases of the musculoskeletal system',
            url: '/en/indications-and-contraindications',
            note: 'Positions VII/7 (coxarthrosis and gonarthrosis) and VII/8 (osteoarthritis at other sites), with type of care and length of the covered stay.',
          },
          {
            title: 'Forestier R et al. 2025, Int J Biometeorol — randomised trial, 145 patients with knee osteoarthritis, 6 months',
            url: 'https://consensus.app/papers/details/ec2bd40091555fb8918ed883777a3427/',
            note: 'Three-week cure vs. usual care: 11.7 WOMAC points better function after 6 months. Unblinded, one country.',
          },
          {
            title: 'Matsumoto H et al. 2017, Clin Rheumatol — meta-analysis, 734 patients',
            url: 'https://consensus.app/papers/details/7633beab80a1540daf33f7876b289d50/',
            note: 'Balneotherapy improves pain, stiffness and function over 2 to 12 months. Heterogeneity 88–93%, low quality of the primary studies.',
          },
          {
            title: 'Fioravanti A et al. 2010, Am J Phys Med Rehabil — randomised trial, 80 patients with knee osteoarthritis',
            url: 'https://consensus.app/papers/details/117ceeafb8b45fcb8ed8113fbdbc701c/',
            note: 'Two weeks of peat packs and baths: lower pain and medication use over 9 months. Single-blind, one centre.',
          },
          {
            title: 'Montvydaitė-Kreivaitienė O et al. 2025, Int J Biometeorol — systematic review',
            url: 'https://consensus.app/papers/details/1c3b89a927ee5550b463873139004fd6/',
            note: 'Better long-term outcomes than usual rehabilitation; also notes that no procedure changes the disease course. Mostly knee osteoarthritis.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — letter to the editor on the length of spa treatment',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Norm for spa treatment is 2–3 weeks with 10–21 treatments. Expert opinion, not a study.',
          },
        ],
        related: [
          { label: 'Peat therapy', href: '/en/peloid-therapy' },
          { label: 'CO₂ therapy', href: '/en/co2-therapy' },
          { label: 'Musculoskeletal treatment: peat and mineral water', href: '/en/magazine/musculoskeletal-treatment-peat-mineral' },
          { label: 'What a spa cure in Marienbad costs', href: '/en/magazine/spa-week-cost-marienbad' },
        ],
      },
      cs: {
        slug: 'artroza',
        navLabel: 'Artróza',
        title: 'Lázeňská léčba artrózy v Mariánských Lázních',
        h1: 'Lázeňská léčba artrózy',
        metaTitle: 'Léčba artrózy v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Artróza kolene, kyčle a rukou: jaké procedury lázeňská léčba v Mariánských Lázních nabízí, jak dlouho pobyt trvá a kdy lázně nepřipadají v úvahu.',
        lead: 'Artróza je nejčastější diagnóza, se kterou hosté do Mariánských Lázní přijíždějí. Léčba stojí na uhličitých koupelích z místní minerální vody, slatinných zábalech a denní fyzioterapii — kombinaci, kterou ambulantní rehabilitace v tomto rozsahu nenabídne.',
        teaser: 'Koleno, kyčel a ruce: uhličité koupele, slatina a denní fyzioterapie po dva až tři týdny.',
        treats: [
          'Gonartróza a koxartróza, tedy artróza kolene a kyčle, pod průběžným ortopedickým dohledem',
          'Artróza dalších kloubů a artropatie, například ramene, ruky nebo hlezna',
          'Bolestivé syndromy šlach, šlachových pochev, tíhových váčků a úponů svalů, které artrózu doprovázejí',
          'Chronické bolesti zad funkčního původu, které se s kloubní artrózou často pojí',
        ],
        notFor: [
          'Akutní ataka s výrazným otokem, přehřátím a výpotkem — ta se řeší nejprve ambulantně',
          'Čerstvý úraz nebo operace bez zhojené rány a bez souhlasu ošetřujícího lékaře',
          'Akutní infekční onemocnění, aktivní nádorové onemocnění, srdeční selhání ve stadiu NYHA IV',
          'Těhotenství a neschopnost sebeobsluhy bez doprovodu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde nálezy a medikaci, vyšetří postižené klouby a sestaví léčebný plán. Vezměte si s sebou aktuální rentgenové nebo MR nálezy a seznam léků; bez nich vyjde plán nutně opatrněji.',
          },
          {
            heading: 'Dvě až tři procedury denně',
            body: 'Dopoledne patří pasivním procedurám — koupel, slatinný zábal, elektroléčba —, odpoledne pohybu. Po každé tepelné proceduře následuje klid vleže; je součástí léčby, ne přestávkou od ní.',
          },
          {
            heading: 'Pohyb jako druhý pilíř',
            body: 'Individuální i skupinová terapie, cvičení ve vodě a dávkovaná chůze po kolonádě. Zátěž se zvyšuje postupně, protože účinek přichází z opakování, ne z intenzity jedné jednotky.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Jednou týdně lékař zkontroluje průběh a upraví plán. Na závěr dostanete zprávu pro svého ošetřujícího lékaře a cvičební program domů — tu část kúry, která působí nejdéle.',
          },
        ],
        procedures: [
          {
            name: 'Uhličitá koupel',
            detail: 'V přírodní minerální vodě. CO₂ vstřebané kůží rozšiřuje drobné cévy a zvyšuje prokrvení kůže.',
          },
          {
            name: 'Suchá plynová koupel',
            detail: 'V Mariině plynu s 99,7 % CO₂, bez oběhové zátěže vodou — vhodná, když by vanová koupel byla příliš namáhavá.',
          },
          {
            name: 'Slatinný zábal',
            detail: 'Termoterapie kolem 40 °C. Slatina odevzdává teplo pomalu, proto se při stejné teplotě snáší lépe než voda.',
          },
          {
            name: 'Podvodní masáž',
            detail: 'Tlaková vodní masáž v teplém bazénu, cílená hlavně na svalstvo kolem kloubu.',
          },
          {
            name: 'Pohybová terapie ve vodě',
            detail: 'Vztlak snímá zátěž z kloubu, takže lze trénovat rozsah pohybu, který na suchu bolí.',
          },
          {
            name: 'Fyzikální terapie',
            detail: 'Elektroléčba, magnetoterapie, laser a ultrazvuk, podle nálezu a v sérii.',
          },
          {
            name: 'Plynové injekce',
            detail: 'Podkožní aplikace CO₂ v okolí kloubu. Opírá se o dlouhou lázeňskou praxi; kontrolované studie k ní chybí.',
          },
          {
            name: 'Individuální fyzioterapie',
            detail: 'Denně, s nácvikem domácího cvičebního programu po odjezdu.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'U kox- a gonartrózy jde o položku VII/7 indikačního seznamu, u artrózy dalších kloubů o VII/8; obě hradí zdravotní pojišťovna po dobu, kterou konkrétně rozepisuje stránka Co hradí pojišťovna u pohybového ústrojí. Samoplátci volí obvykle dva až tři týdny po dohodě s lázeňským lékařem. Kratší pobyt než dva týdny nedává velký smysl: odborná literatura označuje 2–3 týdny s 10–21 procedurami za normu balneoterapie. Pro roční období neexistuje lékařský předpis — v pozdním létě a na podzim bývá v lázních klidněji a termíny se snáz domlouvají.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'Artróza je nejlépe prozkoumanou oblastí lázeňské medicíny. V randomizované studii se 145 pacienty byla funkce kloubu šest měsíců po třítýdenní lázeňské léčbě o 11,7 bodu WOMAC lepší než při obvyklé péči, lepší zůstala i bolest a ztuhlost (Forestier a kol., 2025, Int J Biometeorol; studie nebyla zaslepená a probíhala v jedné zemi). Metaanalýza 734 pacientů zjistila zlepšení bolesti, ztuhlosti a funkce v období dvou až dvanácti měsíců, ale upozorňuje na velmi nejednotné studie (Matsumoto a kol., 2017, Clin Rheumatol). Pro slatinu existuje randomizovaná studie s 80 pacienty: po dvou týdnech zábalů a koupelí přetrvávala nižší bolest a nižší spotřeba léků devět měsíců, zatímco kontrolní skupina se nezměnila (Fioravanti a kol., 2010, Am J Phys Med Rehabil). Přehled z roku 2025 shrnuje, co z toho plyne a co ne: lázeňská léčba zlepšuje bolest, ztuhlost a výkonnost déle než běžná rehabilitace, ale žádný postup nemění průběh artrózy samotné.',
        },
        physicianNote: 'O tom, zda a v jakém rozsahu pro vás lázeňská léčba připadá v úvahu, rozhoduje lázeňský lékař při vstupní prohlídce podle vašich nálezů. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        faqs: [
          {
            question: 'Které lázně pomáhají při artróze?',
            answer: 'V Mariánských Lázních je artróza nejčastější léčenou diagnózou. Místo má tři přírodní léčivé zdroje využívané u artrózy: uhličitou minerální vodu pro koupele, přírodní CO₂ plyn pro suché koupele a plynové injekce a slatinu pro teplé zábaly. Studie balneoterapie u artrózy kolene ukazují zlepšení bolesti a funkce, které přetrvává i po skončení pobytu.',
          },
          {
            question: 'Jak dlouho má lázeňský pobyt při artróze trvat, aby zabral?',
            answer: 'Odborná literatura uvádí jako normu dva až tři týdny s 10 až 21 procedurami; pod deset procedur za deset dní se už o balneoterapii nemluví. Studie s nejdéle zdokumentovaným účinkem u artrózy pracovala se třemi týdny. Víkendový pobyt je odpočinek, ne léčebná kúra.',
          },
          {
            question: 'Pomáhá lázeňský pobyt při artróze trvale?',
            answer: 'Zmírňuje potíže na měsíce, artrózu ale nevyléčí. V kontrolovaných studiích přetrvávala úleva od bolesti a lepší funkce kloubu podle konkrétního výzkumu tři až devět měsíců, někdy i při nižší spotřebě léků proti bolesti. Úbytek chrupavky samotný nezastaví žádný známý postup, proto se lázeňská léčba u řady indikací opakuje.',
          },
          {
            question: 'Kolik stojí lázeňský pobyt při artróze bez pojišťovny?',
            answer: 'Cena se řídí hotelem, kategorií pokoje, stravou a počtem procedur, ne diagnózou. Lázeňské balíčky mariánskolázeňských domů zahrnují vstupní prohlídku, lékařem předepsané procedury, polopenzi nebo plnou penzi a ubytování v jedné ceně. Aktuální přehled najdete v rádci k cenám lázeňského pobytu.',
          },
          {
            question: 'Mohu s umělým kloubem jet do lázní?',
            answer: 'Ano, stavy po náhradě kloubu jsou samostatnou položkou indikačního seznamu a v Mariánských Lázních se běžně léčí. Podmínkou je zhojená rána a souhlas operatéra. Podrobnosti jsou na stránce o lázeňské léčbě po operaci kyčle.',
          },
        ],
        sources: [
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina VII — nemoci pohybového ústrojí',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Položky VII/7 (kox- a gonartróza) a VII/8 (artróza jiné lokalizace) s typem péče a délkou hrazeného pobytu.',
          },
          {
            title: 'Forestier R a kol. 2025, Int J Biometeorol — randomizovaná studie, 145 pacientů s artrózou kolene, 6 měsíců',
            url: 'https://consensus.app/papers/details/ec2bd40091555fb8918ed883777a3427/',
            note: 'Třítýdenní lázeňská léčba oproti obvyklé péči: po 6 měsících o 11,7 bodu WOMAC lepší funkce. Nezaslepená, jedna země.',
          },
          {
            title: 'Matsumoto H a kol. 2017, Clin Rheumatol — metaanalýza, 734 pacientů',
            url: 'https://consensus.app/papers/details/7633beab80a1540daf33f7876b289d50/',
            note: 'Balneoterapie zlepšuje bolest, ztuhlost a funkci po dobu 2 až 12 měsíců. Heterogenita 88–93 %, nízká kvalita primárních studií.',
          },
          {
            title: 'Fioravanti A a kol. 2010, Am J Phys Med Rehabil — randomizovaná studie, 80 pacientů s artrózou kolene',
            url: 'https://consensus.app/papers/details/117ceeafb8b45fcb8ed8113fbdbc701c/',
            note: 'Dva týdny slatinných zábalů a koupelí: nižší bolest a spotřeba léků přetrvávaly 9 měsíců. Jednoduše zaslepená, jedno centrum.',
          },
          {
            title: 'Montvydaitė-Kreivaitienė O a kol. 2025, Int J Biometeorol — systematický přehled',
            url: 'https://consensus.app/papers/details/1c3b89a927ee5550b463873139004fd6/',
            note: 'Lepší dlouhodobé výsledky než obvyklá rehabilitace; zároveň upozornění, že žádný postup nemění průběh nemoci. Většinou artróza kolene.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — dopis redakci k délce lázeňské léčby',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Norma lázeňské léčby je 2–3 týdny s 10–21 procedurami. Odborný názor, ne studie.',
          },
        ],
        related: [
          {
            label: 'Peloidní terapie',
            href: '/cs/peloidni-terapie',
          },
          {
            label: 'CO₂ terapie',
            href: '/cs/co2-terapie',
          },
          {
            label: 'Léčba pohybového aparátu slatinou a minerální vodou',
            href: '/cs/magazin/lecba-pohyboveho-aparatu',
          },
          {
            label: 'Kolik stojí lázeňský pobyt',
            href: '/cs/magazin/cena-lazenskeho-pobytu',
          },
          {
            label: 'Co hradí pojišťovna u pohybového ústrojí',
            href: '/cs/lazne-s-pojistovnou/indikace/pohybove-ustroji',
          },
        ],
      },
      ru: {
        slug: 'artroz',
        navLabel: 'Артроз',
        title: 'Курортное лечение артроза в Марианских Лазнях',
        h1: 'Курортное лечение артроза',
        metaTitle: 'Лечение артроза в Марианских Лазнях | Marienbad.com',
        metaDescription: 'Артроз коленного, тазобедренного суставов и кистей: какие процедуры применяются в Марианских Лазнях, сколько длится пребывание и когда лечение не показано.',
        lead: 'Артроз — самый частый диагноз, с которым гости приезжают в Марианские Лазни. Лечение опирается на углекислые ванны из местной минеральной воды, торфяные обёртывания и ежедневную физиотерапию — сочетание, которое амбулаторная реабилитация в таком объёме обеспечить не может.',
        teaser: 'Колено, тазобедренный сустав и кисти: углекислые ванны, торф и ежедневная физиотерапия в течение двух-трёх недель.',
        treats: [
          'Гонартроз и коксартроз, то есть артроз коленного и тазобедренного суставов, под постоянным ортопедическим наблюдением',
          'Артроз других суставов и артропатии, например плечевого, лучезапястного или голеностопного сустава',
          'Болевые синдромы сухожилий, сухожильных влагалищ, синовиальных сумок и мест прикрепления мышц, сопровождающие артроз',
          'Хронические боли в спине функционального происхождения, которые часто сопутствуют артрозу суставов',
        ],
        notFor: [
          'Острое обострение с выраженным отёком, повышением местной температуры и выпотом в суставе — в этом случае сначала показано амбулаторное лечение',
          'Свежая травма или операция без завершённого заживления раны и без разрешения профильного врача',
          'Острые инфекционные заболевания, активное онкологическое заболевание, сердечная недостаточность стадии NYHA IV',
          'Беременность, а также неспособность к самообслуживанию без сопровождающего лица',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает заключения и принимаемые препараты, осматривает поражённые суставы и составляет план лечения. Возьмите с собой актуальные снимки рентгена или МРТ и список лекарств — без них план неизбежно будет более осторожным.',
          },
          {
            heading: 'Две-три процедуры в день',
            body: 'Первая половина дня отведена пассивным процедурам — ванне, торфяному обёртыванию, электротерапии, — вторая половина дня посвящена движению. После каждой тепловой процедуры следует отдых лёжа; это часть лечения, а не пауза в нём.',
          },
          {
            heading: 'Движение как вторая опора',
            body: 'Индивидуальная и групповая терапия, упражнения в воде и дозированная ходьба по курортным маршрутам. Нагрузка увеличивается постепенно, потому что эффект даёт повторение, а не интенсивность одного занятия.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Раз в неделю врач проверяет динамику и корректирует план. По окончании пребывания вы получаете заключение для лечащего врача дома и программу упражнений на дом — ту часть курса, которая действует дольше всего.',
          },
        ],
        procedures: [
          {
            name: 'Углекислая ванна',
            detail: 'В природной минеральной воде. Проникающий через кожу CO₂ расширяет мелкие сосуды и усиливает кровоснабжение кожи.',
          },
          {
            name: 'Сухая газовая ванна',
            detail: 'В марианском газе с содержанием CO₂ 99,7 %, без нагрузки на кровообращение, которую даёт вода, — вариант, если ванна в воде была бы слишком утомительной.',
          },
          {
            name: 'Торфяное обёртывание',
            detail: 'Тепловая процедура около 40 °C. Торф отдаёт тепло медленно, поэтому переносится лучше воды той же температуры.',
          },
          {
            name: 'Подводный душ-массаж',
            detail: 'Массаж направленной струёй воды в тёплом бассейне, прежде всего для мышц вокруг сустава.',
          },
          {
            name: 'Двигательная терапия в воде',
            detail: 'Выталкивающая сила воды снимает нагрузку с сустава, поэтому можно тренировать объём движений, который на суше вызывает боль.',
          },
          {
            name: 'Физиотерапия',
            detail: 'Электротерапия, магнитотерапия, лазер и ультразвук — назначаются по показаниям и курсом.',
          },
          {
            name: 'Газовые инъекции',
            detail: 'Подкожное введение CO₂ вблизи сустава. Метод опирается на многолетнюю курортную практику; контролируемых исследований по нему нет.',
          },
          {
            name: 'Индивидуальная физиотерапия',
            detail: 'Ежедневно, с инструктажем для домашней программы после отъезда.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'При коксартрозе и гонартрозе (позиция VII/7 чешского индикационного списка) для пребываний, оплачиваемых чешской страховой, предусмотрено 21 день комплексного или 21 день долевого курортного лечения, повторные пребывания — 21 или 14 дней; при артрозе других суставов (VII/8) — 21 день. Гости, оплачивающие лечение самостоятельно, обычно выбирают две-три недели по согласованию с курортным врачом. Меньше двух недель практически бессмысленно: специальная литература называет 2–3 недели с 10–21 процедурой нормой бальнеотерапии. Для времени года медицинских рекомендаций нет — в конце лета и осенью курорт спокойнее и записаться проще.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'Артроз — наиболее изученная область курортной медицины. В рандомизированном исследовании с 145 пациентами функция сустава через шесть месяцев после трёхнедельного курортного лечения оказалась на 11,7 балла по шкале WOMAC выше, чем при обычном лечении, а боль и скованность также сохранялись лучше (Forestier et al., 2025, Int J Biometeorol; исследование неослеплённое, проводилось в одной стране). Метаанализ на 734 пациентах обнаружил улучшение боли, скованности и функции в период от двух до двенадцати месяцев, но указывает на очень неоднородные исследования (Matsumoto et al., 2017, Clin Rheumatol). По торфу есть рандомизированное исследование на 80 пациентах: после двух недель обёртываний и ванн меньшая боль и меньшее потребление лекарств сохранялись девять месяцев, тогда как в контрольной группе изменений не было (Fioravanti et al., 2010, Am J Phys Med Rehabil). Обзор 2025 года подводит итог тому, что из этого следует, а что нет: курортное лечение улучшает боль, скованность и работоспособность дольше, чем обычная реабилитация, но ни один метод не меняет течение самого артроза.',
        },
        physicianNote: 'Показано ли вам курортное лечение и в каком объёме, решает курортный врач при первичном осмотре на основании ваших заключений. Эта страница носит информационный характер и не заменяет консультацию врача.',
        faqs: [
          {
            question: 'Куда ехать лечить артроз?',
            answer: 'В Марианских Лазнях артроз — самый частый диагноз для лечения. Курорт располагает тремя природными лечебными ресурсами, применяемыми при артрозе: углекислой минеральной водой для ванн, природным газом CO₂ для сухих ванн и газовых инъекций, а также торфом для тепловых обёртываний. Исследования бальнеотерапии при артрозе коленного сустава показывают улучшение боли и функции, сохраняющееся после окончания курса.',
          },
          {
            question: 'Сколько по времени должно длиться лечение артроза, чтобы был эффект?',
            answer: 'Специальная литература называет нормой две-три недели с 10–21 процедурой; менее десяти процедур за десять дней уже не считается бальнеотерапией. Исследование с самым длительным зафиксированным эффектом при артрозе проводилось при трёхнедельном курсе. Пребывание на выходные — это отдых, а не лечение.',
          },
          {
            question: 'Помогает ли лечение при артрозе надолго?',
            answer: 'Оно облегчает симптомы на месяцы, но не излечивает артроз. В контролируемых исследованиях облегчение боли и улучшение функции сустава сохранялись, в зависимости от исследования, от трёх до девяти месяцев, иногда при меньшем потреблении обезболивающих. Саму потерю хряща ни один известный метод не останавливает, поэтому при многих показаниях курс повторяют.',
          },
          {
            question: 'Сколько стоит лечение артроза без страховки?',
            answer: 'Цена зависит от отеля, категории номера, питания и количества процедур, а не от диагноза. Курортные пакеты отелей в Марианских Лазнях включают первичный осмотр, назначенные врачом процедуры, полу- или полный пансион и проживание в одной цене. Актуальный обзор цен приведён в путеводителе по стоимости лечения.',
          },
          {
            question: 'Можно ли поехать на лечение с искусственным суставом?',
            answer: 'Да, состояния после замены сустава — отдельная позиция индикационного списка, и в Марианских Лазнях их лечат регулярно. Условие — завершённое заживление раны и разрешение оперировавшего врача. Подробности — на странице о лечении после операции на тазобедренном суставе.',
          },
        ],
        sources: [
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа VII — заболевания опорно-двигательного аппарата',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Позиции VII/7 (коксартроз и гонартроз) и VII/8 (артроз других локализаций) с видом и длительностью оплачиваемого пребывания.',
          },
          {
            title: 'Forestier R et al. 2025, Int J Biometeorol — рандомизированное исследование, 145 пациентов с артрозом коленного сустава, 6 месяцев',
            url: 'https://consensus.app/papers/details/ec2bd40091555fb8918ed883777a3427/',
            note: 'Трёхнедельное курортное лечение против обычного лечения: через 6 месяцев функция лучше на 11,7 балла по шкале WOMAC. Неослеплённое, одна страна.',
          },
          {
            title: 'Matsumoto H et al. 2017, Clin Rheumatol — метаанализ, 734 пациента',
            url: 'https://consensus.app/papers/details/7633beab80a1540daf33f7876b289d50/',
            note: 'Бальнеотерапия улучшает боль, скованность и функцию в период 2–12 месяцев. Неоднородность 88–93 %, низкое качество первичных исследований.',
          },
          {
            title: 'Fioravanti A et al. 2010, Am J Phys Med Rehabil — рандомизированное исследование, 80 пациентов с артрозом коленного сустава',
            url: 'https://consensus.app/papers/details/117ceeafb8b45fcb8ed8113fbdbc701c/',
            note: 'Две недели торфяных обёртываний и ванн: меньшая боль и потребление лекарств на протяжении 9 месяцев. Одинарное ослепление, один центр.',
          },
          {
            title: 'Montvydaitė-Kreivaitienė O et al. 2025, Int J Biometeorol — систематический обзор',
            url: 'https://consensus.app/papers/details/1c3b89a927ee5550b463873139004fd6/',
            note: 'Лучшие долгосрочные результаты, чем при обычной реабилитации; одновременно указание, что ни один метод не меняет течение болезни. Преимущественно артроз коленного сустава.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — письмо в редакцию о длительности курортного лечения',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Норма курортного лечения — 2–3 недели с 10–21 процедурой. Мнение экспертов, не исследование.',
          },
        ],
        related: [
          {
            label: 'Торфолечение',
            href: '/ru/peloidnaya-terapiya',
          },
          {
            label: 'CO₂-терапия',
            href: '/ru/co2-terapiya',
          },
          {
            label: 'Опорно-двигательный аппарат: торф и минеральная вода',
            href: '/ru/zhurnal/lechenie-oporno-dvigatelnogo-apparata',
          },
          {
            label: 'Сколько стоит лечение в Марианских Лазнях',
            href: '/ru/zhurnal/stoimost-lecheniya-marianske-lazne',
          },
        ],
      },
    },
  },
  {
    id: 'hip-replacement',
    groupId: 'musculoskeletal',
    roman: 'VII',
    codes: ['VII/10'],
    conditionName: 'Hip replacement recovery',
    icd10: 'Z96.64',
    image: '/images/library/treatments/aqua-therapy-weights.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Patientin trainiert mit Wassergewichten im Bewegungsbecken während der Reha nach einer Hüftoperation',
      en: 'A patient exercising with water weights in the therapy pool during rehabilitation after hip surgery',
      cs: 'Pacientka cvičí s vodními činkami v rehabilitačním bazénu po operaci kyčle',
      ru: 'Пациентка тренируется с водными гантелями в реабилитационном бассейне после операции на тазобедренном суставе',
    },
    content: {
      de: {
        slug: 'nach-hueftoperation',
        navLabel: 'Nach Hüftoperation',
        title: 'Kur nach einer Hüftoperation in Marienbad',
        h1: 'Kur nach der Hüftoperation',
        metaTitle: 'Kur nach Hüftoperation in Marienbad — Reha, Dauer | Marienbad.com',
        metaDescription:
          'Reha nach einer Hüftoperation in Marienbad: welche Anwendungen die Kur nach Hüft-TEP einsetzt, wie lange sie dauert und wann sie zu früh kommt.',
        lead:
          'Nach einer Hüfttotalendoprothese oder einem anderen Hüftgelenkersatz übernimmt die Kur dort, wo die ambulante Physiotherapie an Grenzen stößt: mit täglichen, ärztlich verordneten Anwendungen über mehrere Wochen. Marienbad kombiniert dafür trockene Physiotherapie mit Bewegungstherapie im warmen Wasser, das den frisch operierten Hüften Auftrieb statt Gewicht gibt.',
        teaser: 'Gangschule, Wasserübungen und Einzelphysiotherapie nach der Hüft-TEP — in enger Abstimmung mit dem Operateur.',
        treats: [
          'Zustand nach Hüfttotalendoprothese (Hüft-TEP) nach abgeschlossener Wundheilung',
          'Zustand nach anderem Hüftgelenkersatz, etwa nach einer Kurzschaftprothese',
          'Muskuläre Dysbalancen und Gangunsicherheit in der Nachbehandlungsphase',
          'Bewegungseinschränkungen der operierten Hüfte, wenn die ambulante Reha allein nicht ausreicht',
        ],
        notFor: [
          'Frische Wunde ohne abgeschlossene Wundheilung oder mit Anzeichen einer Infektion am Operationsgebiet',
          'Tiefe Beinvenenthrombose, die weniger als drei Monate zurückliegt',
          'Fehlende Freigabe des Operateurs zur Vollbelastung oder unklarer Belastungsplan',
          'Akute Erkrankungen und Zustände mit erhöhtem Destabilisierungsrisiko, etwa unbehandelte Herzinsuffizienz',
          'Schwangerschaft sowie Unfähigkeit zur Selbstversorgung ohne Begleitperson',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body:
              'Der Kurarzt sichtet den OP-Bericht, den Prothesentyp und die Freigabe des Operateurs zur Belastung, prüft die Wunde und den Bewegungsumfang und stellt danach den Anwendungsplan zusammen. Bringen Sie den Entlassungsbrief der Klinik mit; ohne ihn fällt der Plan vorsichtiger aus.',
          },
          {
            heading: 'Trockene und wasserbasierte Anwendungen im Wechsel',
            body:
              'Elektrotherapie zur Reaktivierung der Gesäß- und Beinmuskulatur, Lymphdrainage gegen die postoperative Schwellung und Bewegungstherapie im warmen Becken, wo der Auftrieb Last von der Hüfte nimmt. Ob und wann ein Vollbad wie das Kohlensäurebad infrage kommt, entscheidet der Kurarzt je nach Wundstatus.',
          },
          {
            heading: 'Gangschule und Belastungsaufbau',
            body:
              'Einzelphysiotherapie mit Gangkorrektur, Abtraining der Gehhilfen und gezieltem Muskelaufbau rund um das Gelenk. Die Belastung steigt schrittweise, nach dem Freigabeplan des Operateurs, nicht nach einem starren Kalender.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body:
              'Einmal pro Woche prüft der Arzt Beweglichkeit und Kraft und passt den Plan an. Zum Abschluss erhalten Sie einen Bericht für Ihren Orthopäden und ein Übungsprogramm für zu Hause.',
          },
        ],
        procedures: [
          { name: 'Einzelphysiotherapie', detail: 'Täglich, mit gezieltem Aufbau der Gesäß- und Oberschenkelmuskulatur, die nach dem Zugang zur Hüfte oft geschwächt ist.' },
          { name: 'Bewegungstherapie im Wasser', detail: 'Der Auftrieb nimmt Last vom frisch operierten Gelenk, sodass Beweglichkeit trainiert werden kann, die an Land noch schmerzt.' },
          { name: 'Gangschule', detail: 'Korrektur des Gangbilds und schrittweises Abtraining von Gehstützen, unter Anleitung der Physiotherapie.' },
          { name: 'Lymphdrainage', detail: 'Manuelle Behandlung gegen die Schwellung, die nach der Operation im Bereich der Hüfte und des Oberschenkels häufig ist.' },
          { name: 'Elektrotherapie', detail: 'Reizstrom zur Reaktivierung der Gesäßmuskulatur, die durch den OP-Zugang vorübergehend gehemmt sein kann.' },
          { name: 'Unterwassermassage', detail: 'Druckstrahlmassage im warmen Becken für die Muskulatur rund um das operierte Gelenk.' },
          { name: 'Trockenes Gasbad', detail: 'Im Mariengas mit 99,7 % CO₂, ohne Wasserimmersion — eine Option, solange ein Vollbad wegen der Wunde noch nicht infrage kommt.' },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body:
            'Bei Zuständen nach orthopädischen Operationen mit Gelenkersatz (Position VII/10 der tschechischen Indikationsliste) trägt die tschechische Krankenkasse eine 28-tägige komplexe Kurbehandlung; eine gesonderte Wiederholungs- oder Zuschussposition sieht die Liste dafür nicht vor. Selbstzahler richten die Dauer nach der Freigabe des Operateurs und dem tatsächlichen Reha-Bedarf; als fachliche Untergrenze für eine Balneotherapie gelten mindestens 10 Anwendungen über mindestens 10 Tage. Der Termin wird meist im Anschluss an die stationäre Reha oder in Abstimmung mit dem Hausarzt geplant, unabhängig von der Jahreszeit.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body:
            'Eine italienische Pilotstudie mit 12 Patienten nach Hüfttotalendoprothese fand nach zwei Wochen kombinierter trockener und wasserbasierter Rehabilitation im Kurbetrieb einen größeren Bewegungsumfang, einen höheren Harris Hip Score und eine bessere körperliche Lebensqualität; die Schmerzstärke änderte sich dabei nicht signifikant (Musumeci et al., 2018, Int J Biometeorol; sehr kleine, unkontrollierte Stichprobe). Eine breiter angelegte italienische Beobachtungsstudie mit 123 Patienten mit degenerativen und postoperativen Erkrankungen des Bewegungsapparats — nicht speziell nach Hüftoperation — fand nach zwölf Übungseinheiten im Thermalwasser über zwei Wochen bessere Werte für Schmerz, Stimmung und Lebensqualität (Maccarone et al., 2022, Int J Biometeorol; ohne Kontrollgruppe, kurzes Follow-up). Beide Studien zeigen kurzfristige Effekte einzelner Kurprogramme, keinen Vergleich mit ambulanter Reha und keinen Langzeitverlauf über die untersuchten Wochen hinaus.',
        },
        physicianNote:
          'Ob und wann eine Kur nach Ihrer Hüftoperation infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand des OP-Berichts und der Freigabe Ihres Operateurs. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        ongoing: {
          heading: 'Erfahrung und laufende Forschung',
          body: 'Die Nachbehandlung nach einem Hüftgelenkersatz gehört in Marienbad seit Jahrzehnten zum Kernprogramm; die Kurärzte verordnen sie nach Operationsbericht, Freigabe des Operateurs und klinischer Erfahrung. Wie es dem einzelnen Gast dabei ergeht, bleibt nicht ungeprüft: Jeder Behandlungsaufenthalt beginnt mit einer Eingangs- und endet mit einer Abschlussuntersuchung samt schriftlichem Abschlussbericht, sodass der Verlauf dokumentiert ist und der Kurarzt den Plan unterwegs anpassen kann. Für die Kurmedizin als Fach entsteht derzeit erstmals seit Langem systematische Evidenz. Das Institut lázeňství a balneologie, v.v.i., die 2019 vom Karlsbader Kreis gegründete Forschungseinrichtung für Kurwesen und Balneologie, führt seit 2026 gemeinsam mit den Léčebné lázně Mariánské Lázně die erste klinische Studie dieses Formats seit dreißig Jahren durch. Sie betrifft urologische und nephrologische Diagnosen, nicht die auf dieser Seite beschriebene: Mehr als hundert Patienten werden vor und nach dem Kuraufenthalt auf Gesundheitszustand und Lebensqualität untersucht, fachlicher Garant ist prim. MUDr. Ladislav Špišák, CSc.; Ergebnisse liegen noch nicht vor. Die Studie läuft im Projekt Zentrum für Kurforschung (2024 bis 2027), das aus dem Operationellen Programm Gerechter Übergang finanziert wird und mit der Tschechischen Technischen Universität, der Westböhmischen Universität und der Akademie der Wissenschaften der Tschechischen Republik zusammenarbeitet. Was dabei herauskommen kann, zeigt die frühere Zusammenarbeit desselben Instituts mit den Marienbader Kurhäusern: Die gemeinsame Studie zur Kurrehabilitation nach COVID-19 erhielt 2021 den Innovation Award der European Spas Association in der Kategorie Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Wohin zur Kur nach einer Hüftoperation?',
            answer:
              'Zustände nach orthopädischen Operationen mit Gelenkersatz sind eine eigene Position der tschechischen Indikationsliste (VII/10), und Marienbad behandelt sie regelmäßig — mit Einzelphysiotherapie, Bewegungstherapie im Wasser und Gangschule unter täglicher ärztlicher Kontrolle. Welches Haus und welches Programm passen, hängt vom Prothesentyp und vom aktuellen Reha-Stand ab.',
          },
          {
            question: 'Wie lange nach einer Hüft-TEP kann ich zur Kur?',
            answer:
              'Es gibt kein festes Kalenderdatum — entscheidend sind die abgeschlossene Wundheilung und die Freigabe Ihres Operateurs zur Belastung. Die Kur kann direkt im Anschluss an den Krankenhausaufenthalt als Anschlussheilbehandlung beginnen oder erst nach der ambulanten Nachsorge; das legt der Kurarzt bei der Eingangsuntersuchung anhand Ihres OP-Berichts fest.',
          },
          {
            question: 'Welche Anwendungen bekomme ich nach einem Hüftgelenkersatz?',
            answer:
              'Üblich ist eine Kombination aus trockener Einzelphysiotherapie und Bewegungstherapie im warmen Wasser, ergänzt um Lymphdrainage gegen die Schwellung und Elektrotherapie für die Gesäßmuskulatur. In einer italienischen Pilotstudie mit 12 Patienten verbesserte genau diese Kombination über zwei Wochen den Bewegungsumfang und den Harris Hip Score.',
          },
          {
            question: 'Was übernimmt die Krankenkasse nach einer Hüftoperation?',
            answer:
              'Für Zustände nach Gelenkersatz sieht die tschechische Indikationsliste eine 28-tägige komplexe Kurbehandlung vor (Position VII/10), die die Krankenkasse für tschechisch Versicherte trägt. Selbstzahler wählen Dauer und Umfang frei, in Abstimmung mit dem Kurarzt.',
          },
          {
            question: 'Kann ich mit Arthrose im anderen Hüftgelenk trotzdem zur Kur?',
            answer:
              'Ja — Koxarthrose ist eine eigene, häufig behandelte Indikation in Marienbad und wird bei Bedarf im selben Aufenthalt mitbehandelt. Details dazu stehen auf der Seite zur Kur bei Arthrose.',
          },
        ],
        sources: [
          {
            title: 'Klinische Studie zu den objektiven Wirkungen der komplexen Kurbehandlung bei urologischen und nephrologischen Diagnosen (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Laufende Studie des Instituts lázeňství a balneologie mit den Léčebné lázně Mariánské Lázně, mehr als hundert Patienten, Beginn 2026. Sie betrifft urologische und nephrologische Diagnosen; Ergebnisse liegen noch nicht vor.',
          },
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe VII — Position VII/10',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Zustände nach orthopädischen Operationen mit Gelenkersatz: 28 Tage komplexe Kurbehandlung, keine gesonderte Wiederholungsposition.',
          },
          {
            title: 'Musumeci A et al. 2018, Int J Biometeorol — Pilotstudie, 12 Patienten nach Hüft-TEP',
            url: 'https://consensus.app/papers/details/eb2b91377a9d514e93540cf8fb6c915e/',
            note: 'Zwei Wochen kombinierte trockene und wasserbasierte Kur-Reha: besserer Bewegungsumfang und Harris Hip Score, Schmerz ohne signifikante Änderung. Sehr klein, unkontrolliert.',
          },
          {
            title: 'Maccarone MC et al. 2022, Int J Biometeorol — Beobachtungsstudie, 123 Patienten',
            url: 'https://consensus.app/papers/details/6ef7b07cc1c0596595210db7e97ae760/',
            note: 'Degenerative und postoperative Erkrankungen des Bewegungsapparats, nicht hüftspezifisch. Übungen im Thermalwasser verbesserten Schmerz, Stimmung und Lebensqualität. Ohne Kontrollgruppe.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — Leserbrief zur Dauer der Kurbehandlung',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Fachliche Untergrenze: mindestens 10 Anwendungen über mindestens 10 Tage. Expertenmeinung, keine Studie.',
          },
        ],
        related: [
          { label: 'Kur bei Arthrose', href: '/de/kur-bei/arthrose' },
          { label: 'Bewegung im Kurort', href: '/de/magazin/bewegung-im-kurort' },
          { label: 'Kuraufenthalt für Senioren', href: '/de/magazin/kuraufenthalt-senioren' },
          { label: 'Indikationen und Kontraindikationen', href: '/de/indikationen-und-kontraindikationen' },
        ],
      },
      en: {
        slug: 'after-hip-replacement',
        navLabel: 'After hip replacement',
        title: 'Spa treatment after hip replacement in Marienbad',
        h1: 'Spa treatment after hip replacement',
        metaTitle: 'Spa treatment after hip replacement in Marienbad | Marienbad.com',
        metaDescription:
          'Rehabilitation after hip surgery in Marienbad: which treatments the cure uses after a hip replacement, how long it lasts, and when it comes too soon.',
        lead:
          'After a total hip replacement or another form of hip joint replacement, the spa cure takes over where outpatient physiotherapy reaches its limits: with daily, medically prescribed treatments over several weeks. Marienbad combines dry physiotherapy with exercise therapy in warm water, which gives freshly operated hips buoyancy instead of weight.',
        teaser: 'Gait training, water exercises and individual physiotherapy after hip replacement — closely coordinated with your surgeon.',
        treats: [
          'Condition after total hip replacement, once wound healing is complete',
          'Condition after another form of hip joint replacement, for example a short-stem prosthesis',
          'Muscular imbalance and gait insecurity in the aftercare phase',
          'Restricted movement of the operated hip when outpatient rehabilitation alone is not enough',
        ],
        notFor: [
          'A fresh wound without completed healing, or signs of infection at the surgical site',
          'Deep vein thrombosis of the leg less than three months ago',
          'No clearance from the surgeon for full weight-bearing, or an unclear loading plan',
          'Acute illnesses and conditions with a raised risk of destabilisation, for example untreated heart failure',
          'Pregnancy, or an inability to manage personal care without a companion',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body:
              'The spa physician reviews the surgical report, the type of prosthesis and the surgeon’s clearance for weight-bearing, checks the wound and range of motion, and then puts together the treatment plan. Bring your hospital discharge letter; without it the plan is more cautious.',
          },
          {
            heading: 'Dry and water-based treatments in alternation',
            body:
              'Electrotherapy to reactivate the gluteal and leg muscles, lymphatic drainage against post-operative swelling, and exercise therapy in a warm pool, where buoyancy takes load off the hip. Whether and when a full bath such as the carbon dioxide bath is an option is decided by the spa physician based on the state of the wound.',
          },
          {
            heading: 'Gait training and building up load',
            body:
              'Individual physiotherapy with gait correction, weaning off walking aids, and targeted muscle building around the joint. Load increases step by step, following the surgeon’s clearance plan, not a fixed calendar.',
          },
          {
            heading: 'Weekly check-up and final report',
            body:
              'Once a week the physician checks mobility and strength and adjusts the plan. At the end you receive a report for your orthopaedic surgeon and a home exercise programme.',
          },
        ],
        procedures: [
          { name: 'Individual physiotherapy', detail: 'Daily, with targeted building of the gluteal and thigh muscles, which are often weakened after the surgical approach to the hip.' },
          { name: 'Exercise therapy in water', detail: 'Buoyancy takes load off the freshly operated joint, so mobility can be trained that would still hurt on dry land.' },
          { name: 'Gait training', detail: 'Correcting the gait pattern and gradually weaning off walking sticks, guided by physiotherapy.' },
          { name: 'Lymphatic drainage', detail: 'Manual treatment against the swelling that is common around the hip and thigh after surgery.' },
          { name: 'Electrotherapy', detail: 'Stimulation current to reactivate the gluteal muscles, which can be temporarily inhibited by the surgical approach.' },
          { name: 'Underwater massage', detail: 'Pressure-jet massage in a warm pool for the muscles around the operated joint.' },
          { name: 'Dry gas bath', detail: 'In Maria’s gas, 99.7% CO₂, with no water immersion — an option while a full bath is not yet suitable because of the wound.' },
        ],
        stay: {
          heading: 'How long, and when',
          body:
            'For conditions after orthopaedic operations with joint replacement (position VII/10 of the Czech indication list), stays covered by Czech public health insurance run to 28 days of comprehensive spa care; the list does not provide a separate repeat or contributory position for this. Self-paying guests set the length according to the surgeon’s clearance and their actual rehabilitation needs; the professional minimum for balneotherapy is at least 10 treatments over at least 10 days. The stay is usually planned to follow directly after inpatient rehabilitation or in consultation with the family doctor, regardless of season.',
        },
        evidence: {
          heading: 'What the studies show',
          body:
            'An Italian pilot study of 12 patients after total hip replacement found, after two weeks of combined dry and water-based rehabilitation at a spa, a greater range of motion, a higher Harris Hip Score and better physical quality of life; pain intensity did not change significantly (Musumeci et al., 2018, Int J Biometeorol; a very small, uncontrolled sample). A broader Italian observational study of 123 patients with degenerative and post-operative musculoskeletal conditions — not specific to hip surgery — found better scores for pain, mood and quality of life after twelve exercise sessions in thermal water over two weeks (Maccarone et al., 2022, Int J Biometeorol; no control group, short follow-up). Both studies show short-term effects of individual spa programmes, no comparison with outpatient rehabilitation, and no long-term course beyond the weeks studied.',
        },
        physicianNote:
          'Whether and when a spa cure is right after your hip surgery is decided by the spa physician at the initial examination, based on the surgical report and your surgeon’s clearance. This page provides information and does not replace medical advice.',
        ongoing: {
          heading: 'Experience and research under way',
          body: 'Aftercare following a hip replacement has been part of the core programme in Marienbad for decades; the spa physicians prescribe it according to the operation report, the surgeon’s clearance and clinical experience. How the individual guest fares is not left unchecked: every treatment stay begins with an initial and ends with a final medical examination and a written final report, so the course is documented and the spa physician can adjust the plan along the way. Systematic evidence for spa medicine as a field is being built for the first time in a long while. The Institute of Spa Medicine and Balneology (Institut lázeňství a balneologie, v.v.i.), founded by the Karlovy Vary Region in 2019, has been running the first clinical study of this format in thirty years since 2026, together with Léčebné lázně Mariánské Lázně. It covers urological and nephrological diagnoses rather than the one described on this page: more than a hundred patients are examined before and after the spa stay for health status and quality of life, with prim. MUDr. Ladislav Špišák, CSc. as professional guarantor, and results are not yet available. The study runs within the Spa Research Centre project (2024 to 2027), funded by the Just Transition Operational Programme and working with the Czech Technical University, the University of West Bohemia and the Czech Academy of Sciences. What such work can produce is shown by the same institute’s earlier collaboration with the Marienbad spa houses: their joint study of spa rehabilitation after COVID-19 received the European Spas Association Innovation Award in 2021 in the Medical Spa Scientific Research category.',
        },
        faqs: [
          {
            question: 'Where should I go for spa treatment after a hip replacement?',
            answer:
              'Conditions after orthopaedic operations with joint replacement are a separate position on the Czech indication list (VII/10), and Marienbad treats them regularly — with individual physiotherapy, exercise therapy in water and gait training under daily medical supervision. Which hotel and which programme suit you depend on the type of prosthesis and your current stage of rehabilitation.',
          },
          {
            question: 'How long after a hip replacement can I go for a spa cure?',
            answer:
              'There is no fixed calendar date — what matters is completed wound healing and your surgeon’s clearance for weight-bearing. The cure can begin directly after the hospital stay as follow-up rehabilitation, or only after outpatient aftercare; the spa physician decides this at the initial examination based on your surgical report.',
          },
          {
            question: 'What treatments will I get after a hip joint replacement?',
            answer:
              'The usual approach combines dry individual physiotherapy with exercise therapy in warm water, supplemented by lymphatic drainage against swelling and electrotherapy for the gluteal muscles. In an Italian pilot study of 12 patients, exactly this combination improved range of motion and the Harris Hip Score over two weeks.',
          },
          {
            question: 'Does health insurance cover spa treatment after a hip operation?',
            answer:
              'For conditions after joint replacement, the Czech indication list provides for 28 days of comprehensive spa care (position VII/10), covered by Czech public health insurance for those insured in the Czech Republic. Self-paying guests choose the length and scope freely, in consultation with the spa physician.',
          },
          {
            question: 'Can I still go for a spa cure with osteoarthritis in the other hip?',
            answer:
              'Yes — coxarthrosis is a separate, commonly treated indication in Marienbad and is treated alongside your hip replacement recovery within the same stay if needed. Details are on the page about spa treatment for osteoarthritis.',
          },
        ],
        sources: [
          {
            title: 'Clinical study of the objective effects of comprehensive spa care in kidney and urological conditions (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Ongoing study by the Institute of Spa Medicine and Balneology with Léčebné lázně Mariánské Lázně, more than a hundred patients, started 2026. It covers urological and nephrological diagnoses; results are not yet available.',
          },
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group VII — position VII/10',
            url: '/en/indications-and-contraindications',
            note: 'Conditions after orthopaedic operations with joint replacement: 28 days of comprehensive spa care, no separate repeat position.',
          },
          {
            title: 'Musumeci A et al. 2018, Int J Biometeorol — pilot study, 12 patients after total hip replacement',
            url: 'https://consensus.app/papers/details/eb2b91377a9d514e93540cf8fb6c915e/',
            note: 'Two weeks of combined dry and water-based spa rehabilitation: better range of motion and Harris Hip Score, pain unchanged with no significant difference. Very small, uncontrolled.',
          },
          {
            title: 'Maccarone MC et al. 2022, Int J Biometeorol — observational study, 123 patients',
            url: 'https://consensus.app/papers/details/6ef7b07cc1c0596595210db7e97ae760/',
            note: 'Degenerative and post-operative musculoskeletal conditions, not hip-specific. Exercises in thermal water improved pain, mood and quality of life. No control group.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — letter to the editor on the length of spa treatment',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Professional minimum: at least 10 treatments over at least 10 days. Expert opinion, not a study.',
          },
        ],
        related: [
          { label: 'Spa treatment for osteoarthritis', href: '/en/spa-treatment-for/osteoarthritis' },
          { label: 'Movement at the spa', href: '/en/magazine/movement-spa-extends-life' },
          { label: 'A spa stay for seniors', href: '/en/magazine/spa-stay-for-seniors' },
          { label: 'Indications and contraindications', href: '/en/indications-and-contraindications' },
        ],
      },
      cs: {
        slug: 'po-operaci-kycle',
        navLabel: 'Po operaci kyčle',
        title: 'Lázeňská léčba po operaci kyčle v Mariánských Lázních',
        h1: 'Lázeňská léčba po operaci kyčle',
        metaTitle: 'Lázně po operaci kyčle — Mariánské Lázně | Marienbad.com',
        metaDescription: 'Rehabilitace po operaci kyčle v Mariánských Lázních: jaké procedury lázeňská léčba po TEP kyčle nabízí, jak dlouho trvá a kdy je ještě brzy.',
        lead: 'Po totální endoprotéze kyčle nebo jiné náhradě kyčelního kloubu navazuje lázeňská léčba tam, kde ambulantní fyzioterapie naráží na hranice — denními, lékařem předepsanými procedurami po několik týdnů. Mariánské Lázně kombinují suchou fyzioterapii s pohybovou terapií v teplé vodě, která čerstvě operované kyčli dává vztlak místo zátěže.',
        teaser: 'Nácvik chůze, cvičení ve vodě a individuální fyzioterapie po TEP kyčle — v úzké návaznosti na operatéra.',
        treats: [
          'Stav po totální endoprotéze kyčle (TEP kyčle) po zhojené ráně',
          'Stav po jiné náhradě kyčelního kloubu, například po krátkodříkové protéze',
          'Svalové dysbalance a nejistota při chůzi v období doléčení',
          'Omezená hybnost operované kyčle, když ambulantní rehabilitace sama nestačí',
        ],
        notFor: [
          'Čerstvá rána bez zhojení nebo se známkami infekce v místě operace',
          'Hluboká žilní trombóza dolní končetiny, kterou prodělal pacient před méně než třemi měsíci',
          'Chybějící souhlas operatéra s plnou zátěží nebo nejasný plán zátěže',
          'Akutní onemocnění a stavy se zvýšeným rizikem destabilizace, například neléčené srdeční selhání',
          'Těhotenství a neschopnost sebeobsluhy bez doprovodu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde operační zprávu, typ protézy a souhlas operatéra se zátěží, zkontroluje ránu a rozsah pohybu a poté sestaví plán procedur. Vezměte si propouštěcí zprávu z nemocnice; bez ní vyjde plán opatrněji.',
          },
          {
            heading: 'Suché a vodní procedury ve střídání',
            body: 'Elektroléčba pro reaktivaci hýžďového a stehenního svalstva, lymfodrenáž proti pooperačnímu otoku a pohybová terapie v teplém bazénu, kde vztlak snímá zátěž z kyčle. Zda a kdy přijde v úvahu i celková koupel, například uhličitá, rozhodne lázeňský lékař podle stavu rány.',
          },
          {
            heading: 'Nácvik chůze a postupné zatěžování',
            body: 'Individuální fyzioterapie s korekcí chůze, odvykáním berlí a cíleným posilováním svalstva kolem kloubu. Zátěž stoupá postupně, podle plánu operatéra, ne podle pevného kalendáře.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Jednou týdně lékař zkontroluje pohyblivost a sílu a upraví plán. Na závěr dostanete zprávu pro svého ortopeda a cvičební program domů.',
          },
        ],
        procedures: [
          {
            name: 'Individuální fyzioterapie',
            detail: 'Denně, s cíleným posilováním hýžďového a stehenního svalstva, které po přístupu ke kyčli často oslabí.',
          },
          {
            name: 'Pohybová terapie ve vodě',
            detail: 'Vztlak snímá zátěž z čerstvě operovaného kloubu, takže lze trénovat hybnost, která na suchu ještě bolí.',
          },
          {
            name: 'Nácvik chůze',
            detail: 'Korekce chůzového vzorce a postupné odvykání berlí, pod vedením fyzioterapeuta.',
          },
          {
            name: 'Lymfodrenáž',
            detail: 'Manuální ošetření otoku, který bývá po operaci v oblasti kyčle a stehna častý.',
          },
          {
            name: 'Elektroléčba',
            detail: 'Dráždivý proud k reaktivaci hýžďového svalstva, které může být operačním přístupem dočasně utlumené.',
          },
          {
            name: 'Podvodní masáž',
            detail: 'Tlaková vodní masáž v teplém bazénu pro svalstvo kolem operovaného kloubu.',
          },
          {
            name: 'Suchá plynová koupel',
            detail: 'V Mariině plynu s 99,7 % CO₂, bez ponoření do vody — možnost, dokud celková koupel kvůli ráně ještě nepřipadá v úvahu.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Stavy po ortopedických operacích s náhradou kloubu spadají pod položku VII/10 indikačního seznamu; přesnou délku hrazeného pobytu i podmínky najdete na stránce Co hradí pojišťovna u pohybového ústrojí. Samoplátci volí délku podle souhlasu operatéra a skutečné potřeby rehabilitace; jako odborné minimum pro balneoterapii platí alespoň 10 procedur během alespoň 10 dní. Termín se obvykle plánuje hned po ústavní rehabilitaci nebo po dohodě s praktickým lékařem, nezávisle na ročním období.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'Italská pilotní studie s 12 pacienty po totální endoprotéze kyčle zjistila po dvou týdnech kombinované suché a vodní rehabilitace v lázeňském provozu větší rozsah pohybu, vyšší Harris Hip Score a lepší tělesnou kvalitu života; intenzita bolesti se přitom významně nezměnila (Musumeci a kol., 2018, Int J Biometeorol; velmi malý, nekontrolovaný vzorek). Rozsáhlejší italská observační studie se 123 pacienty s degenerativními a pooperačními onemocněními pohybového aparátu — nikoli speciálně po operaci kyčle — zjistila po dvanácti cvičebních jednotkách v termální vodě během dvou týdnů lepší hodnoty bolesti, nálady a kvality života (Maccarone a kol., 2022, Int J Biometeorol; bez kontrolní skupiny, krátké sledování). Obě studie ukazují krátkodobé účinky jednotlivých lázeňských programů, žádné srovnání s ambulantní rehabilitací a žádný dlouhodobý průběh nad rámec sledovaných týdnů.',
        },
        physicianNote: 'O tom, zda a kdy pro vás po operaci kyčle připadá v úvahu lázeňská léčba, rozhoduje lázeňský lékař při vstupní prohlídce podle operační zprávy a souhlasu vašeho operatéra. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        ongoing: {
          heading: 'Zkušenost a probíhající výzkum',
          body: 'Doléčení po náhradě kyčelního kloubu patří v Mariánských Lázních po desetiletí k jádru programu; lázeňští lékaři je předepisují podle operační zprávy, souhlasu operatéra a klinické zkušenosti. Jak na tom jednotlivý host je, se nenechává bez kontroly: každý léčebný pobyt začíná vstupní a končí výstupní lékařskou prohlídkou a závěrečnou zprávou, takže je průběh doložený a lázeňský lékař může plán během pobytu upravit. Pro lázeňskou medicínu jako obor vzniká poprvé po dlouhé době systematická evidence. Institut lázeňství a balneologie, v.v.i., který Karlovarský kraj založil v roce 2019, vede od roku 2026 spolu s Léčebnými lázněmi Mariánské Lázně první klinickou studii tohoto formátu po třiceti letech. Týká se urologických a nefrologických diagnóz, ne té popsané na této stránce: více než sto pacientů se vyšetřuje před lázeňskou léčbou a po ní na ukazatele zdravotního stavu a kvality života, odborným garantem je prim. MUDr. Ladislav Špišák, CSc., a výsledky zatím nejsou k dispozici. Studie běží v projektu Centrum lázeňského výzkumu (2024 až 2027), financovaném z Operačního programu Spravedlivá transformace a spolupracujícím s ČVUT, Západočeskou univerzitou a Akademií věd ČR. Co z takové práce může vzejít, ukazuje dřívější spolupráce téhož institutu s mariánskolázeňskými lázeňskými domy: jejich společná studie lázeňské rehabilitace po covidu-19 získala v roce 2021 Innovation Award Evropského svazu lázní v kategorii Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Kam na lázně po operaci kyčle?',
            answer: 'Stavy po ortopedických operacích s náhradou kloubu tvoří samostatnou položku indikačního seznamu (VII/10) a Mariánské Lázně je pravidelně léčí — individuální fyzioterapií, pohybovou terapií ve vodě a nácvikem chůze pod denní lékařskou kontrolou. Který dům a program se hodí, závisí na typu protézy a aktuálním stavu rehabilitace.',
          },
          {
            question: 'Jak dlouho po TEP kyčle mohu jet do lázní?',
            answer: 'Neexistuje pevné kalendářní datum — rozhoduje zhojená rána a souhlas operatéra se zátěží. Lázeňská léčba může začít hned po pobytu v nemocnici jako navazující rehabilitace, nebo až po ambulantní doléčovací péči; to určí lázeňský lékař při vstupní prohlídce podle vaší operační zprávy.',
          },
          {
            question: 'Jaké procedury dostanu po náhradě kyčelního kloubu?',
            answer: 'Obvyklá je kombinace suché individuální fyzioterapie a pohybové terapie v teplé vodě, doplněná lymfodrenáží proti otoku a elektroléčbou pro hýžďové svalstvo. V italské pilotní studii s 12 pacienty právě tato kombinace za dva týdny zlepšila rozsah pohybu a Harris Hip Score.',
          },
          {
            question: 'Co po operaci kyčle hradí pojišťovna?',
            answer: 'Pro stavy po náhradě kloubu je to položka VII/10 indikačního seznamu; přesnou délku a podmínky komplexní i příspěvkové péče najdete na stránce Co hradí pojišťovna u pohybového ústrojí. Samoplátci volí délku i rozsah volně, po dohodě s lázeňským lékařem.',
          },
          {
            question: 'Mohu jet do lázní i s artrózou druhé kyčle?',
            answer: 'Ano — koxartróza je samostatná, často léčená indikace v Mariánských Lázních a při potřebě se doléčí v rámci stejného pobytu. Podrobnosti najdete na stránce o léčbě artrózy.',
          },
        ],
        sources: [
          {
            title: 'Klinická studie objektivních účinků komplexní lázeňské péče u urologických a nefrologických diagnóz (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Probíhající studie Institutu lázeňství a balneologie s Léčebnými lázněmi Mariánské Lázně, více než sto pacientů, zahájena 2026. Týká se urologických a nefrologických diagnóz; výsledky zatím nejsou k dispozici.',
          },
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina VII — položka VII/10',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Stavy po ortopedických operacích s náhradou kloubu: délka a typ hrazené péče.',
          },
          {
            title: 'Musumeci A a kol. 2018, Int J Biometeorol — pilotní studie, 12 pacientů po TEP kyčle',
            url: 'https://consensus.app/papers/details/eb2b91377a9d514e93540cf8fb6c915e/',
            note: 'Dva týdny kombinované suché a vodní lázeňské rehabilitace: lepší rozsah pohybu a Harris Hip Score, bolest bez významné změny. Velmi malá, nekontrolovaná.',
          },
          {
            title: 'Maccarone MC a kol. 2022, Int J Biometeorol — observační studie, 123 pacientů',
            url: 'https://consensus.app/papers/details/6ef7b07cc1c0596595210db7e97ae760/',
            note: 'Degenerativní a pooperační onemocnění pohybového aparátu, nikoli specificky kyčel. Cvičení v termální vodě zlepšilo bolest, náladu a kvalitu života. Bez kontrolní skupiny.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — dopis redakci k délce lázeňské léčby',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Odborné minimum: alespoň 10 procedur během alespoň 10 dní. Odborný názor, ne studie.',
          },
        ],
        related: [
          {
            label: 'Lázeňská léčba artrózy',
            href: '/cs/lazenska-lecba/artroza',
          },
          {
            label: 'Pohyb v lázních prodlužuje život',
            href: '/cs/magazin/pohyb-v-laznich-prodluzuje-zivot',
          },
          {
            label: 'Lázeňský pobyt pro seniory',
            href: '/cs/magazin/lazensky-pobyt-pro-seniory',
          },
          {
            label: 'Co hradí pojišťovna u pohybového ústrojí',
            href: '/cs/lazne-s-pojistovnou/indikace/pohybove-ustroji',
          },
        ],
      },
      ru: {
        slug: 'posle-operacii-tazobedrennogo-sustava',
        navLabel: 'После операции на тазобедренном суставе',
        title: 'Курортное лечение после операции на тазобедренном суставе в Марианских Лазнях',
        h1: 'Курортное лечение после операции на тазобедренном суставе',
        metaTitle: 'После операции на бедре — Марианские Лазни | Marienbad.com',
        metaDescription: 'Реабилитация после операции на тазобедренном суставе в Марианских Лазнях: какие процедуры применяются после эндопротезирования, сроки и когда рано ехать.',
        lead: 'После тотального эндопротезирования тазобедренного сустава или другой операции на нём курортное лечение продолжает работу там, где амбулаторная физиотерапия достигает предела: ежедневные, назначенные врачом процедуры на протяжении нескольких недель. В Марианских Лазнях для этого сочетают физиотерапию на суше с двигательной терапией в тёплой воде, которая даёт свежепрооперированному суставу опору вместо нагрузки.',
        teaser: 'Обучение ходьбе, упражнения в воде и индивидуальная физиотерапия после эндопротезирования тазобедренного сустава — в тесном согласовании с оперировавшим врачом.',
        treats: [
          'Состояние после тотального эндопротезирования тазобедренного сустава после завершённого заживления раны',
          'Состояние после другой замены тазобедренного сустава, например после установки протеза с укороченной ножкой',
          'Мышечный дисбаланс и неуверенность при ходьбе в период последующего лечения',
          'Ограничение подвижности прооперированного тазобедренного сустава, если одной амбулаторной реабилитации недостаточно',
        ],
        notFor: [
          'Свежая рана без завершённого заживления или с признаками инфекции в области операции',
          'Тромбоз глубоких вен ноги давностью менее трёх месяцев',
          'Отсутствие разрешения оперировавшего врача на полную нагрузку или неясный план нагрузки',
          'Острые заболевания и состояния с повышенным риском дестабилизации, например нелеченая сердечная недостаточность',
          'Беременность, а также неспособность к самообслуживанию без сопровождающего лица',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает выписку из операции, тип протеза и разрешение оперировавшего врача на нагрузку, проверяет рану и объём движений, после чего составляет план процедур. Возьмите с собой выписной эпикриз клиники; без него план будет более осторожным.',
          },
          {
            heading: 'Чередование процедур на суше и в воде',
            body: 'Электротерапия для реактивации мышц ягодиц и ноги, лимфодренаж против послеоперационного отёка и двигательная терапия в тёплом бассейне, где выталкивающая сила воды снимает нагрузку с сустава. Показана ли и когда полная ванна вроде углекислой, решает курортный врач в зависимости от состояния раны.',
          },
          {
            heading: 'Обучение ходьбе и постепенное наращивание нагрузки',
            body: 'Индивидуальная физиотерапия с коррекцией походки, отвыканием от ходунков и целенаправленным укреплением мышц вокруг сустава. Нагрузка растёт постепенно, по плану оперировавшего врача, а не по жёсткому календарю.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Раз в неделю врач проверяет подвижность и силу и корректирует план. По окончании вы получаете заключение для вашего ортопеда и программу упражнений на дом.',
          },
        ],
        procedures: [
          {
            name: 'Индивидуальная физиотерапия',
            detail: 'Ежедневно, с целенаправленным укреплением мышц ягодиц и бедра, которые часто ослаблены после хирургического доступа к суставу.',
          },
          {
            name: 'Двигательная терапия в воде',
            detail: 'Выталкивающая сила воды снимает нагрузку со свежепрооперированного сустава, поэтому можно тренировать подвижность, которая на суше ещё вызывает боль.',
          },
          {
            name: 'Обучение ходьбе',
            detail: 'Коррекция походки и постепенное отвыкание от костылей под руководством физиотерапевта.',
          },
          {
            name: 'Лимфодренаж',
            detail: 'Ручная процедура против отёка, который часто возникает после операции в области тазобедренного сустава и бедра.',
          },
          {
            name: 'Электротерапия',
            detail: 'Импульсные токи для реактивации ягодичных мышц, которые могут быть временно заторможены из-за хирургического доступа.',
          },
          {
            name: 'Подводный душ-массаж',
            detail: 'Массаж направленной струёй воды в тёплом бассейне для мышц вокруг прооперированного сустава.',
          },
          {
            name: 'Сухая газовая ванна',
            detail: 'В марианском газе с содержанием CO₂ 99,7 %, без погружения в воду — вариант, пока полная ванна из-за раны ещё не показана.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'При состояниях после ортопедических операций с заменой сустава (позиция VII/10 чешского индикационного списка) для пребываний, оплачиваемых чешской страховой, предусмотрено 28-дневное комплексное курортное лечение; отдельной позиции для повторного или долевого пребывания список для этого случая не предусматривает. Гости, оплачивающие лечение самостоятельно, определяют длительность по разрешению оперировавшего врача и реальной потребности в реабилитации; профессиональным минимумом бальнеотерапии считается не менее 10 процедур за не менее чем 10 дней. Дата поездки обычно планируется вслед за стационарной реабилитацией или по согласованию с лечащим врачом, независимо от времени года.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'Итальянское пилотное исследование с 12 пациентами после тотального эндопротезирования тазобедренного сустава обнаружило после двух недель сочетанной реабилитации на суше и в воде в условиях курорта больший объём движений, более высокий показатель Harris Hip Score и лучшее физическое качество жизни; интенсивность боли при этом значимо не изменилась (Musumeci et al., 2018, Int J Biometeorol; очень маленькая, неконтролируемая выборка). Более широкое итальянское наблюдательное исследование со 123 пациентами с дегенеративными и послеоперационными заболеваниями опорно-двигательного аппарата — не только после операции на тазобедренном суставе — обнаружило после двенадцати занятий в термальной воде за две недели более высокие показатели боли, настроения и качества жизни (Maccarone et al., 2022, Int J Biometeorol; без контрольной группы, короткое наблюдение). Оба исследования показывают краткосрочный эффект отдельных курортных программ, не сравнение с амбулаторной реабилитацией и не долгосрочное течение за пределами изученных недель.',
        },
        physicianNote: 'Показано ли и когда вам курортное лечение после операции на тазобедренном суставе, решает курортный врач при первичном осмотре на основании выписки из операции и разрешения оперировавшего врача. Эта страница носит информационный характер и не заменяет консультацию врача.',
        ongoing: {
          heading: 'Опыт и текущие исследования',
          body: 'Долечивание после эндопротезирования тазобедренного сустава десятилетиями входит в основную программу Марианских Лазней; курортные врачи назначают его по выписке об операции, разрешению оперировавшего врача и клиническому опыту. Как идут дела у конкретного гостя, не остаётся без проверки: каждое лечебное пребывание начинается с первичного и заканчивается выходным врачебным осмотром и письменным заключением, поэтому течение задокументировано, а курортный врач может по ходу скорректировать план. Для курортной медицины как отрасли впервые за долгое время создаётся систематическая доказательная база. Институт курортного дела и бальнеологии (Institut lázeňství a balneologie, v.v.i.), основанный Карловарским краем в 2019 году, с 2026 года вместе с «Léčebné lázně Mariánské Lázně» проводит первое клиническое исследование такого формата за тридцать лет. Оно касается урологических и нефрологических диагнозов, а не того, который описан на этой странице: более ста пациентов обследуют до курортного лечения и после него по показателям состояния здоровья и качества жизни, научный гарант — prim. MUDr. Ladislav Špišák, CSc., результатов пока нет. Исследование идёт в рамках проекта «Центр курортных исследований» (2024–2027), финансируемого Операционной программой справедливой трансформации, с участием Чешского технического университета, Западночешского университета и Академии наук Чехии. Что даёт такая работа, показывает более раннее сотрудничество того же института с курортными домами Марианских Лазней: их совместное исследование курортной реабилитации после COVID-19 получило в 2021 году Innovation Award Европейского союза курортов в категории Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Куда ехать на реабилитацию после операции на тазобедренном суставе?',
            answer: 'Состояния после ортопедических операций с заменой сустава — отдельная позиция чешского индикационного списка (VII/10), и в Марианских Лазнях их лечат регулярно: индивидуальной физиотерапией, двигательной терапией в воде и обучением ходьбе под ежедневным врачебным контролем. Какой отель и какая программа подойдут, зависит от типа протеза и текущего этапа восстановления.',
          },
          {
            question: 'Через сколько времени после эндопротезирования тазобедренного сустава можно ехать на лечение?',
            answer: 'Точной даты по календарю нет — решающее значение имеют завершённое заживление раны и разрешение оперировавшего врача на нагрузку. Лечение может начаться сразу после выписки из стационара как продолжающая реабилитация или уже после амбулаторного наблюдения; это определяет курортный врач при первичном осмотре на основании выписки из операции.',
          },
          {
            question: 'Какие процедуры назначают после замены тазобедренного сустава?',
            answer: 'Обычно это сочетание индивидуальной физиотерапии на суше и двигательной терапии в тёплой воде, дополненное лимфодренажем против отёка и электротерапией для ягодичных мышц. В итальянском пилотном исследовании с 12 пациентами именно эта комбинация за две недели улучшила объём движений и показатель Harris Hip Score.',
          },
          {
            question: 'Что покрывает страховая после операции на тазобедренном суставе?',
            answer: 'Для состояний после замены сустава чешский индикационный список предусматривает 28-дневное комплексное курортное лечение (позиция VII/10), которое для застрахованных в Чехии оплачивает страховая. Гости, оплачивающие лечение самостоятельно, выбирают длительность и объём свободно, по согласованию с курортным врачом.',
          },
          {
            question: 'Можно ли ехать на лечение при артрозе второго тазобедренного сустава?',
            answer: 'Да — коксартроз является отдельным, часто встречающимся показанием в Марианских Лазнях и при необходимости лечится в рамках того же пребывания. Подробности — на странице о лечении артроза.',
          },
        ],
        sources: [
          {
            title: 'Клиническое исследование объективных эффектов комплексного курортного лечения при урологических и нефрологических диагнозах (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Продолжающееся исследование Института курортного дела и бальнеологии вместе с «Léčebné lázně Mariánské Lázně», более ста пациентов, начато в 2026 году. Касается урологических и нефрологических диагнозов; результатов пока нет.',
          },
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа VII — позиция VII/10',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Состояния после ортопедических операций с заменой сустава: 28 дней комплексного курортного лечения, отдельной позиции для повторного пребывания нет.',
          },
          {
            title: 'Musumeci A et al. 2018, Int J Biometeorol — пилотное исследование, 12 пациентов после эндопротезирования тазобедренного сустава',
            url: 'https://consensus.app/papers/details/eb2b91377a9d514e93540cf8fb6c915e/',
            note: 'Две недели сочетанной курортной реабилитации на суше и в воде: лучше объём движений и показатель Harris Hip Score, боль без значимого изменения. Очень маленькая, неконтролируемая выборка.',
          },
          {
            title: 'Maccarone MC et al. 2022, Int J Biometeorol — наблюдательное исследование, 123 пациента',
            url: 'https://consensus.app/papers/details/6ef7b07cc1c0596595210db7e97ae760/',
            note: 'Дегенеративные и послеоперационные заболевания опорно-двигательного аппарата, не только после операции на тазобедренном суставе. Упражнения в термальной воде улучшили боль, настроение и качество жизни. Без контрольной группы.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — письмо в редакцию о длительности курортного лечения',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Профессиональный минимум: не менее 10 процедур за не менее чем 10 дней. Мнение экспертов, не исследование.',
          },
        ],
        related: [
          {
            label: 'Лечение артроза',
            href: '/ru/kurortnoe-lechenie/artroz',
          },
          {
            label: 'Движение на курорте',
            href: '/ru/zhurnal/dvizhenie-v-kurorte',
          },
          {
            label: 'Курортный отдых для пожилых',
            href: '/ru/zhurnal/kurortnyj-otdykh-dlya-pozhilykh',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'knee-replacement',
    groupId: 'musculoskeletal',
    roman: 'VII',
    codes: ['VII/10', 'VII/11'],
    conditionName: 'Knee replacement recovery',
    icd10: 'Z96.65',
    image: '/images/library/treatments/exercise-ball-stretch.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Patientin dehnt sich mit einem Gymnastikball während der Bewegungstherapie nach einer Knieoperation',
      en: 'A patient stretching with an exercise ball during movement therapy after knee surgery',
      cs: 'Pacientka se protahuje s gymnastickým míčem během pohybové terapie po operaci kolene',
      ru: 'Пациентка растягивается с гимнастическим мячом во время двигательной терапии после операции на колене',
    },
    content: {
      de: {
        slug: 'nach-knieoperation',
        navLabel: 'Nach Knieoperation',
        title: 'Kur nach einer Knieoperation in Marienbad',
        h1: 'Kur nach der Knieoperation',
        metaTitle: 'Kur nach Knieoperation in Marienbad — Reha, Dauer | Marienbad.com',
        metaDescription:
          'Reha nach einer Knieoperation in Marienbad: Anwendungen nach Knie-TEP oder Meniskus-OP, Dauer und wann eine Kur infrage kommt.',
        lead:
          'Nach einer Knietotalendoprothese oder einer anderen Knieoperation braucht das Gelenk vor allem eines: regelmäßiges, angeleitetes Training der Beugung und der Oberschenkelmuskulatur. Die Kur in Marienbad bündelt dafür tägliche Einzelphysiotherapie mit Bewegungstherapie im warmen Wasser, wo der Auftrieb das frisch operierte Knie entlastet.',
        teaser: 'Beugetraining, Gangschule und Wasserübungen nach Knie-TEP oder Meniskusoperation — täglich, unter ärztlicher Kontrolle.',
        treats: [
          'Zustand nach Knietotalendoprothese (Knie-TEP) nach abgeschlossener Wundheilung',
          'Zustand nach unikondylärer oder anderer Teilprothese des Kniegelenks',
          'Zustände nach Meniskusoperationen und anderen Knieoperationen, wenn die ambulante oder stationäre Reha nicht ausreichend war',
          'Muskuläre Dysbalancen im Quadrizeps und Gangunsicherheit nach der Operation',
        ],
        notFor: [
          'Frische Wunde ohne abgeschlossene Wundheilung oder mit Anzeichen einer Infektion',
          'Tiefe Beinvenenthrombose, die weniger als drei Monate zurückliegt',
          'Fehlende Freigabe des Operateurs zur Vollbelastung',
          'Akuter Gelenkerguss oder akute Entzündung im operierten Knie',
          'Schwangerschaft sowie Unfähigkeit zur Selbstversorgung ohne Begleitperson',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body:
              'Der Kurarzt sichtet den OP-Bericht, den Beugewinkel und die Freigabe des Operateurs zur Belastung und stellt danach den Anwendungsplan zusammen. Bringen Sie den Entlassungsbrief der Klinik mit; ohne ihn fällt der Plan vorsichtiger aus.',
          },
          {
            heading: 'Bewegung im warmen Wasser und an Land im Wechsel',
            body:
              'Bewegungstherapie im Becken, wo der Auftrieb das Knie beim Üben der Beugung entlastet, ergänzt durch Lymphdrainage gegen die Schwellung und Elektrotherapie für den Quadrizeps. Ein Vollbad wie das Kohlensäurebad kommt erst infrage, wenn die Wunde es zulässt.',
          },
          {
            heading: 'Gangschule und Kräftigung des Quadrizeps',
            body:
              'Einzelphysiotherapie mit Abtraining der Gehhilfen, Treppentraining und gezieltem Muskelaufbau rund um das Kniegelenk. Die Belastung steigt schrittweise, nach dem Freigabeplan des Operateurs.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body:
              'Einmal pro Woche prüft der Arzt Beugewinkel und Kraft und passt den Plan an. Zum Abschluss erhalten Sie einen Bericht für Ihren Orthopäden und ein Übungsprogramm für zu Hause.',
          },
        ],
        procedures: [
          { name: 'Einzelphysiotherapie', detail: 'Täglich, mit gezieltem Beugetraining und Aufbau des Quadrizeps, der nach einer Knieoperation rasch an Kraft verliert.' },
          { name: 'Bewegungstherapie im Wasser', detail: 'Der Auftrieb nimmt Last vom frisch operierten Knie, sodass Beugung geübt werden kann, die an Land noch schmerzt.' },
          { name: 'Gangschule', detail: 'Korrektur des Gangbilds, Treppentraining und schrittweises Abtraining von Gehstützen.' },
          { name: 'Lymphdrainage', detail: 'Manuelle Behandlung gegen die Schwellung, die nach Knieoperationen besonders ausgeprägt sein kann.' },
          { name: 'Elektrotherapie', detail: 'Reizstrom zur Reaktivierung des Quadrizeps, der durch die Operation gehemmt sein kann.' },
          { name: 'Unterwassermassage', detail: 'Druckstrahlmassage im warmen Becken für die Muskulatur rund um das operierte Gelenk.' },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body:
            'Bei Knieendoprothesen (Position VII/10 der tschechischen Indikationsliste) übernimmt die Krankenkasse 28 Tage komplexe Kurbehandlung. Bei anderen Zuständen nach Knieoperationen, etwa nach Meniskuseingriffen, sofern die ambulante oder stationäre Reha nicht ausreichend war (Position VII/11), sind es ebenfalls 28 Tage, bei Wiederholung 28 Tage oder mit Zuschuss 21 beziehungsweise 14 Tage. Selbstzahler stimmen die Dauer mit dem Kurarzt und dem Operateur ab; als fachliche Untergrenze für eine Balneotherapie gelten mindestens 10 Anwendungen über mindestens 10 Tage.',
        },
        physicianNote:
          'Ob und wann eine Kur nach Ihrer Knieoperation infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand des OP-Berichts und der Freigabe Ihres Operateurs. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        ongoing: {
          heading: 'Erfahrung und laufende Forschung',
          body: 'Die Nachbehandlung nach einem Kniegelenkersatz gehört in Marienbad seit Jahrzehnten zum Kernprogramm; die Kurärzte verordnen Beugetraining, Gangschule und Übungen im Wasser auf Grundlage des Operationsberichts und ihrer klinischen Erfahrung mit diesem Verlauf. Wie es dem einzelnen Gast dabei ergeht, bleibt nicht ungeprüft: Jeder Behandlungsaufenthalt beginnt mit einer Eingangs- und endet mit einer Abschlussuntersuchung samt schriftlichem Abschlussbericht, sodass der Verlauf dokumentiert ist und der Kurarzt den Plan unterwegs anpassen kann. Für die Kurmedizin als Fach entsteht derzeit erstmals seit Langem systematische Evidenz. Das Institut lázeňství a balneologie, v.v.i., die 2019 vom Karlsbader Kreis gegründete Forschungseinrichtung für Kurwesen und Balneologie, führt seit 2026 gemeinsam mit den Léčebné lázně Mariánské Lázně die erste klinische Studie dieses Formats seit dreißig Jahren durch. Sie betrifft urologische und nephrologische Diagnosen, nicht die auf dieser Seite beschriebene: Mehr als hundert Patienten werden vor und nach dem Kuraufenthalt auf Gesundheitszustand und Lebensqualität untersucht, fachlicher Garant ist prim. MUDr. Ladislav Špišák, CSc.; Ergebnisse liegen noch nicht vor. Die Studie läuft im Projekt Zentrum für Kurforschung (2024 bis 2027), das aus dem Operationellen Programm Gerechter Übergang finanziert wird und mit der Tschechischen Technischen Universität, der Westböhmischen Universität und der Akademie der Wissenschaften der Tschechischen Republik zusammenarbeitet. Was dabei herauskommen kann, zeigt die frühere Zusammenarbeit desselben Instituts mit den Marienbader Kurhäusern: Die gemeinsame Studie zur Kurrehabilitation nach COVID-19 erhielt 2021 den Innovation Award der European Spas Association in der Kategorie Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Welche Kur ist nach einer Knieoperation die richtige?',
            answer:
              'Für Zustände nach Knie-TEP oder anderen Knieoperationen sieht die tschechische Indikationsliste eigene Positionen vor (VII/10 und VII/11), und Marienbad behandelt sie mit täglicher Einzelphysiotherapie, Bewegungstherapie im Wasser und Gangschule. Welches Programm passt, hängt vom Eingriff und vom aktuellen Beugewinkel ab und wird bei der Eingangsuntersuchung festgelegt.',
          },
          {
            question: 'Wie lange dauert die Rehabilitation nach einer Knie-TEP?',
            answer:
              'Es gibt keine pauschale Dauer — sie hängt vom Heilungsverlauf, dem Prothesentyp und der Beweglichkeit beim Antritt der Kur ab. Die tschechische Indikationsliste sieht für Zustände nach Gelenkersatz einen 28-tägigen komplexen Kuraufenthalt vor (Position VII/10); wie viele Anwendungen und Übungseinheiten Sie darin erhalten, legt der Kurarzt individuell fest.',
          },
          {
            question: 'Kann ich nach einer Meniskusoperation zur Kur?',
            answer:
              'Ja, sofern die ambulante oder stationäre Rehabilitation allein nicht ausreichend war — das ist die Voraussetzung für Position VII/11 der Indikationsliste, die Zustände nach Meniskus- und anderen Knieoperationen abdeckt. Der überweisende Arzt stellt dafür den Kurantrag; der Kurarzt entscheidet über den konkreten Anwendungsplan.',
          },
          {
            question: 'Was zahlt die Krankenkasse nach einer Knieoperation?',
            answer:
              'Für Knieendoprothesen sind es 28 Tage komplexe Kurbehandlung (Position VII/10); für andere Knieoperationen ohne ausreichenden Reha-Erfolg ebenfalls 28 Tage, bei Wiederholung 28 oder mit Zuschuss 21 bzw. 14 Tage (Position VII/11). Selbstzahler wählen Dauer und Umfang frei, in Abstimmung mit dem Kurarzt.',
          },
        ],
        sources: [
          {
            title: 'Klinische Studie zu den objektiven Wirkungen der komplexen Kurbehandlung bei urologischen und nephrologischen Diagnosen (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Laufende Studie des Instituts lázeňství a balneologie mit den Léčebné lázně Mariánské Lázně, mehr als hundert Patienten, Beginn 2026. Sie betrifft urologische und nephrologische Diagnosen; Ergebnisse liegen noch nicht vor.',
          },
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe VII — Positionen VII/10 und VII/11',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'VII/10: Zustände nach Gelenkersatz, 28 Tage. VII/11: Zustände nach Verletzungen/Operationen inkl. Knieoperationen, wenn ambulante oder stationäre Reha nicht ausreichend war, 28 Tage, Wiederholung 28 oder P 21 (P 14).',
          },
          {
            title: 'Maraver F et al. 2020, Int J Biometeorol — Leserbrief zur Dauer der Balneotherapie',
            url: 'https://doi.org/10.1007/s00484-020-02041-5',
            note: 'Fachliche Untergrenze: mindestens 10 Anwendungen über mindestens 10 Tage; ein Wochenendaufenthalt ist keine Balneotherapie. Expertenmeinung, keine Studie.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — Leserbrief zur Dauer der Kurbehandlung',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Norm der Kurbehandlung 2–3 Wochen mit 10–21 Anwendungen. Expertenmeinung, keine Studie.',
          },
          {
            title: 'Maccarone MC et al. 2022, Int J Biometeorol — Beobachtungsstudie, 123 Patienten',
            url: 'https://consensus.app/papers/details/6ef7b07cc1c0596595210db7e97ae760/',
            note: 'Degenerative und postoperative Erkrankungen des Bewegungsapparats, nicht knie- oder operationsspezifisch. Übungen im Thermalwasser verbesserten Schmerz, Stimmung und Lebensqualität. Ohne Kontrollgruppe, allgemeine Orientierung.',
          },
        ],
        related: [
          { label: 'Kur bei Arthrose', href: '/de/kur-bei/arthrose' },
          { label: 'Bewegung im Kurort', href: '/de/magazin/bewegung-im-kurort' },
          { label: 'Kuraufenthalt für Senioren', href: '/de/magazin/kuraufenthalt-senioren' },
          { label: 'Indikationen und Kontraindikationen', href: '/de/indikationen-und-kontraindikationen' },
        ],
      },
      en: {
        slug: 'after-knee-replacement',
        navLabel: 'After knee replacement',
        title: 'Spa treatment after knee replacement in Marienbad',
        h1: 'Spa treatment after knee replacement',
        metaTitle: 'Spa treatment after knee replacement in Marienbad | Marienbad.com',
        metaDescription:
          'Rehabilitation after knee surgery in Marienbad: treatments after knee replacement or meniscus surgery, duration, and when a spa cure is appropriate.',
        lead:
          'After a total knee replacement or another knee operation, the joint needs one thing above all: regular, guided training of flexion and the thigh muscles. Marienbad’s spa cure bundles daily individual physiotherapy with exercise therapy in warm water, where buoyancy relieves the freshly operated knee.',
        teaser: 'Flexion training, gait training and water exercises after knee replacement or meniscus surgery — daily, under medical supervision.',
        treats: [
          'Condition after total knee replacement, once wound healing is complete',
          'Condition after unicondylar or other partial knee replacement',
          'Conditions after meniscus surgery and other knee operations, when outpatient or inpatient rehabilitation was not sufficient',
          'Muscular imbalance in the quadriceps and gait insecurity after surgery',
        ],
        notFor: [
          'A fresh wound without completed healing, or signs of infection',
          'Deep vein thrombosis of the leg less than three months ago',
          'No clearance from the surgeon for full weight-bearing',
          'Acute joint effusion or acute inflammation in the operated knee',
          'Pregnancy, or an inability to manage personal care without a companion',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body:
              'The spa physician reviews the surgical report, the angle of flexion and the surgeon’s clearance for weight-bearing, then puts together the treatment plan. Bring your hospital discharge letter; without it the plan is more cautious.',
          },
          {
            heading: 'Movement in warm water and on land in alternation',
            body:
              'Exercise therapy in the pool, where buoyancy relieves the knee while practising flexion, supplemented by lymphatic drainage against swelling and electrotherapy for the quadriceps. A full bath such as the carbon dioxide bath is only an option once the wound allows it.',
          },
          {
            heading: 'Gait training and strengthening the quadriceps',
            body:
              'Individual physiotherapy with weaning off walking aids, stair training and targeted muscle building around the knee joint. Load increases step by step, following the surgeon’s clearance plan.',
          },
          {
            heading: 'Weekly check-up and final report',
            body:
              'Once a week the physician checks the angle of flexion and strength and adjusts the plan. At the end you receive a report for your orthopaedic surgeon and a home exercise programme.',
          },
        ],
        procedures: [
          { name: 'Individual physiotherapy', detail: 'Daily, with targeted flexion training and building of the quadriceps, which loses strength quickly after knee surgery.' },
          { name: 'Exercise therapy in water', detail: 'Buoyancy takes load off the freshly operated knee, so flexion can be practised that would still hurt on dry land.' },
          { name: 'Gait training', detail: 'Correcting the gait pattern, stair training and gradually weaning off walking sticks.' },
          { name: 'Lymphatic drainage', detail: 'Manual treatment against the swelling that can be especially pronounced after knee operations.' },
          { name: 'Electrotherapy', detail: 'Stimulation current to reactivate the quadriceps, which can be inhibited by the operation.' },
          { name: 'Underwater massage', detail: 'Pressure-jet massage in a warm pool for the muscles around the operated joint.' },
        ],
        stay: {
          heading: 'How long, and when',
          body:
            'For knee replacements (position VII/10 of the Czech indication list), Czech public health insurance covers 28 days of comprehensive spa care. For other conditions after knee operations, such as meniscus procedures, where outpatient or inpatient rehabilitation was not sufficient (position VII/11), it is likewise 28 days, with 28 days on repeat or 21 or 14 days with contributory care. Self-paying guests coordinate the length with the spa physician and the surgeon; the professional minimum for balneotherapy is at least 10 treatments over at least 10 days.',
        },
        physicianNote:
          'Whether and when a spa cure is right after your knee surgery is decided by the spa physician at the initial examination, based on the surgical report and your surgeon’s clearance. This page provides information and does not replace medical advice.',
        ongoing: {
          heading: 'Experience and research under way',
          body: 'Aftercare following a knee replacement has been part of the core programme in Marienbad for decades; the spa physicians prescribe flexion training, gait school and exercises in water on the basis of the operation report and their clinical experience with this course. How the individual guest fares is not left unchecked: every treatment stay begins with an initial and ends with a final medical examination and a written final report, so the course is documented and the spa physician can adjust the plan along the way. Systematic evidence for spa medicine as a field is being built for the first time in a long while. The Institute of Spa Medicine and Balneology (Institut lázeňství a balneologie, v.v.i.), founded by the Karlovy Vary Region in 2019, has been running the first clinical study of this format in thirty years since 2026, together with Léčebné lázně Mariánské Lázně. It covers urological and nephrological diagnoses rather than the one described on this page: more than a hundred patients are examined before and after the spa stay for health status and quality of life, with prim. MUDr. Ladislav Špišák, CSc. as professional guarantor, and results are not yet available. The study runs within the Spa Research Centre project (2024 to 2027), funded by the Just Transition Operational Programme and working with the Czech Technical University, the University of West Bohemia and the Czech Academy of Sciences. What such work can produce is shown by the same institute’s earlier collaboration with the Marienbad spa houses: their joint study of spa rehabilitation after COVID-19 received the European Spas Association Innovation Award in 2021 in the Medical Spa Scientific Research category.',
        },
        faqs: [
          {
            question: 'What is the right spa cure after a knee operation?',
            answer:
              'For conditions after knee replacement or other knee operations, the Czech indication list provides separate positions (VII/10 and VII/11), and Marienbad treats them with daily individual physiotherapy, exercise therapy in water and gait training. Which programme fits depends on the procedure and your current angle of flexion, and is set at the initial examination.',
          },
          {
            question: 'How long does rehabilitation after a knee replacement take?',
            answer:
              'There is no standard length — it depends on how healing progresses, the type of prosthesis and your mobility when starting the cure. The Czech indication list provides for a 28-day comprehensive stay for conditions after joint replacement (position VII/10); how many treatments and exercise sessions you receive within it is set individually by the spa physician.',
          },
          {
            question: 'Can I go for a spa cure after meniscus surgery?',
            answer:
              'Yes, provided that outpatient or inpatient rehabilitation alone was not sufficient — that is the requirement for position VII/11 of the indication list, which covers conditions after meniscus and other knee operations. Your referring doctor submits the application; the spa physician decides on the specific treatment plan.',
          },
          {
            question: 'Does health insurance cover spa treatment after a knee operation?',
            answer:
              'For knee replacements it is 28 days of comprehensive spa care (position VII/10); for other knee operations without sufficient rehabilitation success it is also 28 days, or 28 on repeat, or 21 or 14 days with contributory care (position VII/11). Self-paying guests choose the length and scope freely, in consultation with the spa physician.',
          },
        ],
        sources: [
          {
            title: 'Clinical study of the objective effects of comprehensive spa care in kidney and urological conditions (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Ongoing study by the Institute of Spa Medicine and Balneology with Léčebné lázně Mariánské Lázně, more than a hundred patients, started 2026. It covers urological and nephrological diagnoses; results are not yet available.',
          },
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group VII — positions VII/10 and VII/11',
            url: '/en/indications-and-contraindications',
            note: 'VII/10: conditions after joint replacement, 28 days. VII/11: conditions after injuries/operations including knee operations, when outpatient or inpatient rehabilitation was not sufficient, 28 days, repeat 28 or contributory 21 (14) days.',
          },
          {
            title: 'Maraver F et al. 2020, Int J Biometeorol — letter to the editor on the length of balneotherapy',
            url: 'https://doi.org/10.1007/s00484-020-02041-5',
            note: 'Professional minimum: at least 10 treatments over at least 10 days; a weekend stay is not balneotherapy. Expert opinion, not a study.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — letter to the editor on the length of spa treatment',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Norm for spa treatment is 2–3 weeks with 10–21 treatments. Expert opinion, not a study.',
          },
          {
            title: 'Maccarone MC et al. 2022, Int J Biometeorol — observational study, 123 patients',
            url: 'https://consensus.app/papers/details/6ef7b07cc1c0596595210db7e97ae760/',
            note: 'Degenerative and post-operative musculoskeletal conditions, not knee- or operation-specific. Exercises in thermal water improved pain, mood and quality of life. No control group, general orientation only.',
          },
        ],
        related: [
          { label: 'Spa treatment for osteoarthritis', href: '/en/spa-treatment-for/osteoarthritis' },
          { label: 'Movement at the spa', href: '/en/magazine/movement-spa-extends-life' },
          { label: 'A spa stay for seniors', href: '/en/magazine/spa-stay-for-seniors' },
          { label: 'Indications and contraindications', href: '/en/indications-and-contraindications' },
        ],
      },
      cs: {
        slug: 'po-operaci-kolene',
        navLabel: 'Po operaci kolene',
        title: 'Lázeňská léčba po operaci kolene v Mariánských Lázních',
        h1: 'Lázeňská léčba po operaci kolene',
        metaTitle: 'Léčba po operaci kolene v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Rehabilitace po operaci kolene v Mariánských Lázních: procedury po TEP kolene nebo operaci menisku, délka pobytu a kdy lázně připadají v úvahu.',
        lead: 'Po totální endoprotéze kolene nebo jiné operaci kolene potřebuje kloub především jedno: pravidelný, vedený trénink ohybu a stehenního svalstva. Lázeňská léčba v Mariánských Lázních spojuje denní individuální fyzioterapii s pohybovou terapií v teplé vodě, kde vztlak čerstvě operované koleno odlehčuje.',
        teaser: 'Nácvik ohybu, chůze a cvičení ve vodě po TEP kolene nebo operaci menisku — denně, pod lékařskou kontrolou.',
        treats: [
          'Stav po totální endoprotéze kolene (TEP kolene) po zhojené ráně',
          'Stav po unikondylární nebo jiné částečné náhradě kolenního kloubu',
          'Stavy po operacích menisku a dalších operacích kolene, když ambulantní nebo ústavní rehabilitace nebyla dostatečná',
          'Svalové dysbalance kvadricepsu a nejistota při chůzi po operaci',
        ],
        notFor: [
          'Čerstvá rána bez zhojení nebo se známkami infekce',
          'Hluboká žilní trombóza dolní končetiny, kterou pacient prodělal před méně než třemi měsíci',
          'Chybějící souhlas operatéra s plnou zátěží',
          'Akutní kloubní výpotek nebo akutní zánět v operovaném koleni',
          'Těhotenství a neschopnost sebeobsluhy bez doprovodu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde operační zprávu, úhel ohybu a souhlas operatéra se zátěží a poté sestaví plán procedur. Vezměte si propouštěcí zprávu z nemocnice; bez ní vyjde plán opatrněji.',
          },
          {
            heading: 'Pohyb v teplé vodě a na suchu ve střídání',
            body: 'Pohybová terapie v bazénu, kde vztlak koleno při nácviku ohybu odlehčuje, doplněná lymfodrenáží proti otoku a elektroléčbou pro kvadriceps. Celková koupel, například uhličitá, přichází v úvahu, až to stav rány dovolí.',
          },
          {
            heading: 'Nácvik chůze a posilování kvadricepsu',
            body: 'Individuální fyzioterapie s odvykáním berlí, nácvikem chůze do schodů a cíleným posilováním svalstva kolem kolenního kloubu. Zátěž stoupá postupně, podle plánu operatéra.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Jednou týdně lékař zkontroluje úhel ohybu a sílu a upraví plán. Na závěr dostanete zprávu pro svého ortopeda a cvičební program domů.',
          },
        ],
        procedures: [
          {
            name: 'Individuální fyzioterapie',
            detail: 'Denně, s cíleným nácvikem ohybu a posilováním kvadricepsu, který po operaci kolene rychle ztrácí sílu.',
          },
          {
            name: 'Pohybová terapie ve vodě',
            detail: 'Vztlak snímá zátěž z čerstvě operovaného kolene, takže lze cvičit ohyb, který na suchu ještě bolí.',
          },
          {
            name: 'Nácvik chůze',
            detail: 'Korekce chůzového vzorce, nácvik chůze do schodů a postupné odvykání berlí.',
          },
          {
            name: 'Lymfodrenáž',
            detail: 'Manuální ošetření otoku, který bývá po operacích kolene zvlášť výrazný.',
          },
          {
            name: 'Elektroléčba',
            detail: 'Dráždivý proud k reaktivaci kvadricepsu, který může být operací utlumený.',
          },
          {
            name: 'Podvodní masáž',
            detail: 'Tlaková vodní masáž v teplém bazénu pro svalstvo kolem operovaného kloubu.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Endoprotézy kolene spadají pod položku VII/10 indikačního seznamu, jiné stavy po operaci kolene, například po operaci menisku, kdy ambulantní nebo ústavní rehabilitace nestačila, pod položku VII/11; přesnou délku i podmínky obou najdete na stránce Co hradí pojišťovna u pohybového ústrojí. Samoplátci délku ladí s lázeňským lékařem a operatérem; jako odborné minimum pro balneoterapii platí alespoň 10 procedur během alespoň 10 dní.',
        },
        physicianNote: 'O tom, zda a kdy pro vás po operaci kolene připadá v úvahu lázeňská léčba, rozhoduje lázeňský lékař při vstupní prohlídce podle operační zprávy a souhlasu vašeho operatéra. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        ongoing: {
          heading: 'Zkušenost a probíhající výzkum',
          body: 'Doléčení po náhradě kolenního kloubu patří v Mariánských Lázních po desetiletí k jádru programu; lázeňští lékaři předepisují nácvik ohýbání, chůze a cvičení ve vodě podle operační zprávy a klinické zkušenosti s tímto průběhem. Jak na tom jednotlivý host je, se nenechává bez kontroly: každý léčebný pobyt začíná vstupní a končí výstupní lékařskou prohlídkou a závěrečnou zprávou, takže je průběh doložený a lázeňský lékař může plán během pobytu upravit. Pro lázeňskou medicínu jako obor vzniká poprvé po dlouhé době systematická evidence. Institut lázeňství a balneologie, v.v.i., který Karlovarský kraj založil v roce 2019, vede od roku 2026 spolu s Léčebnými lázněmi Mariánské Lázně první klinickou studii tohoto formátu po třiceti letech. Týká se urologických a nefrologických diagnóz, ne té popsané na této stránce: více než sto pacientů se vyšetřuje před lázeňskou léčbou a po ní na ukazatele zdravotního stavu a kvality života, odborným garantem je prim. MUDr. Ladislav Špišák, CSc., a výsledky zatím nejsou k dispozici. Studie běží v projektu Centrum lázeňského výzkumu (2024 až 2027), financovaném z Operačního programu Spravedlivá transformace a spolupracujícím s ČVUT, Západočeskou univerzitou a Akademií věd ČR. Co z takové práce může vzejít, ukazuje dřívější spolupráce téhož institutu s mariánskolázeňskými lázeňskými domy: jejich společná studie lázeňské rehabilitace po covidu-19 získala v roce 2021 Innovation Award Evropského svazu lázní v kategorii Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Které lázně jsou nejlepší po operaci kolene?',
            answer: 'Pro stavy po TEP kolene nebo jiných operacích kolene vede indikační seznam samostatné položky (VII/10 a VII/11) a Mariánské Lázně je léčí denní individuální fyzioterapií, pohybovou terapií ve vodě a nácvikem chůze. Který program se hodí, závisí na zákroku a aktuálním úhlu ohybu a určí se při vstupní prohlídce.',
          },
          {
            question: 'Jak dlouho trvá rehabilitace po TEP kolene?',
            answer: 'Paušální délka neexistuje — závisí na průběhu hojení, typu protézy a hybnosti při nástupu. Indikační seznam u stavů po náhradě kloubu počítá s pobytem podle položky VII/10; kolik procedur a cvičebních jednotek v něm dostanete, určí lázeňský lékař individuálně.',
          },
          {
            question: 'Mohu jet do lázní po operaci menisku?',
            answer: 'Ano, pokud ambulantní nebo ústavní rehabilitace sama nestačila — to je podmínka položky VII/11 indikačního seznamu, která pokrývá stavy po operaci menisku a dalších operacích kolene. Návrh na lázeňskou péči vystavuje odesílající lékař; o konkrétním plánu procedur pak rozhoduje lázeňský lékař.',
          },
          {
            question: 'Co po operaci kolene hradí pojišťovna?',
            answer: 'U endoprotézy kolene i u jiných operací kolene bez dostatečného úspěchu rehabilitace jde o položky VII/10 a VII/11 indikačního seznamu; přesnou délku a podmínky najdete na stránce Co hradí pojišťovna u pohybového ústrojí. Samoplátci volí délku i rozsah volně, po dohodě s lázeňským lékařem.',
          },
        ],
        sources: [
          {
            title: 'Klinická studie objektivních účinků komplexní lázeňské péče u urologických a nefrologických diagnóz (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Probíhající studie Institutu lázeňství a balneologie s Léčebnými lázněmi Mariánské Lázně, více než sto pacientů, zahájena 2026. Týká se urologických a nefrologických diagnóz; výsledky zatím nejsou k dispozici.',
          },
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina VII — položky VII/10 a VII/11',
            url: '/cs/indikace-a-kontraindikace',
            note: 'VII/10: stavy po náhradě kloubu. VII/11: stavy po úrazech/operacích včetně operací kolene, pokud ambulantní nebo ústavní rehabilitace nestačila.',
          },
          {
            title: 'Maraver F a kol. 2020, Int J Biometeorol — dopis redakci k délce balneoterapie',
            url: 'https://doi.org/10.1007/s00484-020-02041-5',
            note: 'Odborné minimum: alespoň 10 procedur během alespoň 10 dní; víkendový pobyt není balneoterapie. Odborný názor, ne studie.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — dopis redakci k délce lázeňské léčby',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Norma lázeňské léčby 2–3 týdny s 10–21 procedurami. Odborný názor, ne studie.',
          },
          {
            title: 'Maccarone MC a kol. 2022, Int J Biometeorol — observační studie, 123 pacientů',
            url: 'https://consensus.app/papers/details/6ef7b07cc1c0596595210db7e97ae760/',
            note: 'Degenerativní a pooperační onemocnění pohybového aparátu, nikoli specificky koleno nebo konkrétní operace. Cvičení v termální vodě zlepšilo bolest, náladu a kvalitu života. Bez kontrolní skupiny, obecná orientace.',
          },
        ],
        related: [
          {
            label: 'Lázeňská léčba artrózy',
            href: '/cs/lazenska-lecba/artroza',
          },
          {
            label: 'Pohyb v lázních prodlužuje život',
            href: '/cs/magazin/pohyb-v-laznich-prodluzuje-zivot',
          },
          {
            label: 'Lázeňský pobyt pro seniory',
            href: '/cs/magazin/lazensky-pobyt-pro-seniory',
          },
          {
            label: 'Co hradí pojišťovna u pohybového ústrojí',
            href: '/cs/lazne-s-pojistovnou/indikace/pohybove-ustroji',
          },
        ],
      },
      ru: {
        slug: 'posle-operacii-kolennogo-sustava',
        navLabel: 'После операции на коленном суставе',
        title: 'Курортное лечение после операции на коленном суставе в Марианских Лазнях',
        h1: 'Курортное лечение после операции на коленном суставе',
        metaTitle: 'После операции на колене — Марианские Лазни | Marienbad.com',
        metaDescription: 'Реабилитация после операции на колене в Марианских Лазнях: процедуры после эндопротезирования или операции на мениске, сроки и когда лечение показано.',
        lead: 'После тотального эндопротезирования коленного сустава или другой операции на колене суставу прежде всего нужно одно: регулярная, направляемая тренировка сгибания и мышц бедра. Для этого курортное лечение в Марианских Лазнях объединяет ежедневную индивидуальную физиотерапию с двигательной терапией в тёплой воде, где выталкивающая сила снимает нагрузку со свежепрооперированного колена.',
        teaser: 'Тренировка сгибания, обучение ходьбе и упражнения в воде после эндопротезирования колена или операции на мениске — ежедневно, под врачебным контролем.',
        treats: [
          'Состояние после тотального эндопротезирования коленного сустава после завершённого заживления раны',
          'Состояние после однополюсного или другого частичного протезирования коленного сустава',
          'Состояния после операций на мениске и других операций на колене, если амбулаторная или стационарная реабилитация была недостаточной',
          'Мышечный дисбаланс четырёхглавой мышцы бедра и неуверенность при ходьбе после операции',
        ],
        notFor: [
          'Свежая рана без завершённого заживления или с признаками инфекции',
          'Тромбоз глубоких вен ноги давностью менее трёх месяцев',
          'Отсутствие разрешения оперировавшего врача на полную нагрузку',
          'Острый выпот в суставе или острое воспаление в прооперированном колене',
          'Беременность, а также неспособность к самообслуживанию без сопровождающего лица',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает выписку из операции, угол сгибания и разрешение оперировавшего врача на нагрузку, после чего составляет план процедур. Возьмите с собой выписной эпикриз клиники; без него план будет более осторожным.',
          },
          {
            heading: 'Чередование движения в тёплой воде и на суше',
            body: 'Двигательная терапия в бассейне, где выталкивающая сила снимает нагрузку с колена при тренировке сгибания, дополняется лимфодренажем против отёка и электротерапией для четырёхглавой мышцы. Полная ванна вроде углекислой становится возможной только тогда, когда это допускает состояние раны.',
          },
          {
            heading: 'Обучение ходьбе и укрепление четырёхглавой мышцы',
            body: 'Индивидуальная физиотерапия с отвыканием от ходунков, тренировкой ходьбы по лестнице и целенаправленным укреплением мышц вокруг коленного сустава. Нагрузка растёт постепенно, по плану оперировавшего врача.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Раз в неделю врач проверяет угол сгибания и силу и корректирует план. По окончании вы получаете заключение для вашего ортопеда и программу упражнений на дом.',
          },
        ],
        procedures: [
          {
            name: 'Индивидуальная физиотерапия',
            detail: 'Ежедневно, с целенаправленной тренировкой сгибания и укреплением четырёхглавой мышцы, которая после операции на колене быстро теряет силу.',
          },
          {
            name: 'Двигательная терапия в воде',
            detail: 'Выталкивающая сила воды снимает нагрузку со свежепрооперированного колена, поэтому можно отрабатывать сгибание, которое на суше ещё вызывает боль.',
          },
          {
            name: 'Обучение ходьбе',
            detail: 'Коррекция походки, тренировка ходьбы по лестнице и постепенное отвыкание от костылей.',
          },
          {
            name: 'Лимфодренаж',
            detail: 'Ручная процедура против отёка, который после операций на колене может быть особенно выраженным.',
          },
          {
            name: 'Электротерапия',
            detail: 'Импульсные токи для реактивации четырёхглавой мышцы, которая может быть заторможена из-за операции.',
          },
          {
            name: 'Подводный душ-массаж',
            detail: 'Массаж направленной струёй воды в тёплом бассейне для мышц вокруг прооперированного сустава.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'При эндопротезировании колена (позиция VII/10 чешского индикационного списка) для пребываний, оплачиваемых чешской страховой, предусмотрено 28 дней комплексного курортного лечения. При других состояниях после операций на колене, например после вмешательств на мениске, если амбулаторная или стационарная реабилитация была недостаточной (позиция VII/11), также предусмотрено 28 дней, при повторном пребывании — 28 дней или, с долевым финансированием, 21 либо 14 дней. Гости, оплачивающие лечение самостоятельно, согласуют длительность с курортным врачом и оперировавшим врачом; профессиональным минимумом бальнеотерапии считается не менее 10 процедур за не менее чем 10 дней.',
        },
        physicianNote: 'Показано ли и когда вам курортное лечение после операции на колене, решает курортный врач при первичном осмотре на основании выписки из операции и разрешения оперировавшего врача. Эта страница носит информационный характер и не заменяет консультацию врача.',
        ongoing: {
          heading: 'Опыт и текущие исследования',
          body: 'Долечивание после эндопротезирования колена десятилетиями входит в основную программу Марианских Лазней; курортные врачи назначают тренировку сгибания, обучение ходьбе и упражнения в воде на основании выписки об операции и клинического опыта. Как идут дела у конкретного гостя, не остаётся без проверки: каждое лечебное пребывание начинается с первичного и заканчивается выходным врачебным осмотром и письменным заключением, поэтому течение задокументировано, а курортный врач может по ходу скорректировать план. Для курортной медицины как отрасли впервые за долгое время создаётся систематическая доказательная база. Институт курортного дела и бальнеологии (Institut lázeňství a balneologie, v.v.i.), основанный Карловарским краем в 2019 году, с 2026 года вместе с «Léčebné lázně Mariánské Lázně» проводит первое клиническое исследование такого формата за тридцать лет. Оно касается урологических и нефрологических диагнозов, а не того, который описан на этой странице: более ста пациентов обследуют до курортного лечения и после него по показателям состояния здоровья и качества жизни, научный гарант — prim. MUDr. Ladislav Špišák, CSc., результатов пока нет. Исследование идёт в рамках проекта «Центр курортных исследований» (2024–2027), финансируемого Операционной программой справедливой трансформации, с участием Чешского технического университета, Западночешского университета и Академии наук Чехии. Что даёт такая работа, показывает более раннее сотрудничество того же института с курортными домами Марианских Лазней: их совместное исследование курортной реабилитации после COVID-19 получило в 2021 году Innovation Award Европейского союза курортов в категории Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Какое лечение подходит после операции на колене?',
            answer: 'Для состояний после эндопротезирования колена или других операций на колене чешский индикационный список предусматривает отдельные позиции (VII/10 и VII/11), и в Марианских Лазнях их лечат ежедневной индивидуальной физиотерапией, двигательной терапией в воде и обучением ходьбе. Какая программа подойдёт, зависит от вмешательства и текущего угла сгибания и определяется при первичном осмотре.',
          },
          {
            question: 'Сколько длится реабилитация после эндопротезирования колена?',
            answer: 'Единого срока нет — он зависит от хода заживления, типа протеза и подвижности на момент начала лечения. Чешский индикационный список предусматривает для состояний после замены сустава 28-дневное комплексное пребывание (позиция VII/10); сколько процедур и занятий вы получите в его рамках, курортный врач определяет индивидуально.',
          },
          {
            question: 'Можно ли ехать на лечение после операции на мениске?',
            answer: 'Да, если одной амбулаторной или стационарной реабилитации было недостаточно — это условие для позиции VII/11 индикационного списка, которая охватывает состояния после операций на мениске и других операций на колене. Направляющий врач оформляет для этого заявку на лечение; курортный врач решает о конкретном плане процедур.',
          },
          {
            question: 'Что оплачивает страховая после операции на колене?',
            answer: 'Для эндопротезирования колена это 28 дней комплексного курортного лечения (позиция VII/10); для других операций на колене без достаточного эффекта реабилитации — также 28 дней, при повторном пребывании 28 или с долевым финансированием 21 либо 14 дней (позиция VII/11). Гости, оплачивающие лечение самостоятельно, выбирают длительность и объём свободно, по согласованию с курортным врачом.',
          },
        ],
        sources: [
          {
            title: 'Клиническое исследование объективных эффектов комплексного курортного лечения при урологических и нефрологических диагнозах (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Продолжающееся исследование Института курортного дела и бальнеологии вместе с «Léčebné lázně Mariánské Lázně», более ста пациентов, начато в 2026 году. Касается урологических и нефрологических диагнозов; результатов пока нет.',
          },
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа VII — позиции VII/10 и VII/11',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'VII/10: состояния после замены сустава, 28 дней. VII/11: состояния после травм/операций, включая операции на колене, если амбулаторная или стационарная реабилитация была недостаточной, 28 дней, повторно 28 или с долевым финансированием 21 (14).',
          },
          {
            title: 'Maraver F et al. 2020, Int J Biometeorol — письмо в редакцию о длительности бальнеотерапии',
            url: 'https://doi.org/10.1007/s00484-020-02041-5',
            note: 'Профессиональный минимум: не менее 10 процедур за не менее чем 10 дней; пребывание на выходные бальнеотерапией не считается. Мнение экспертов, не исследование.',
          },
          {
            title: 'Karagülle MZ, Karagülle M 2021, Int J Biometeorol — письмо в редакцию о длительности курортного лечения',
            url: 'https://consensus.app/papers/details/14ac08e16e2d5bbb804b6330ab17303b/',
            note: 'Норма курортного лечения — 2–3 недели с 10–21 процедурой. Мнение экспертов, не исследование.',
          },
          {
            title: 'Maccarone MC et al. 2022, Int J Biometeorol — наблюдательное исследование, 123 пациента',
            url: 'https://consensus.app/papers/details/6ef7b07cc1c0596595210db7e97ae760/',
            note: 'Дегенеративные и послеоперационные заболевания опорно-двигательного аппарата, не только после колена или конкретной операции. Упражнения в термальной воде улучшили боль, настроение и качество жизни. Без контрольной группы, общая ориентация.',
          },
        ],
        related: [
          {
            label: 'Лечение артроза',
            href: '/ru/kurortnoe-lechenie/artroz',
          },
          {
            label: 'Движение на курорте',
            href: '/ru/zhurnal/dvizhenie-v-kurorte',
          },
          {
            label: 'Курортный отдых для пожилых',
            href: '/ru/zhurnal/kurortnyj-otdykh-dlya-pozhilykh',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'spine',
    groupId: 'musculoskeletal',
    roman: 'VII',
    codes: ['VII/9', 'VII/11'],
    conditionName: 'Chronic back pain',
    icd10: 'M54',
    image: '/images/library/treatments/electrotherapy-back-pads.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Elektroden werden für eine Elektrotherapie auf dem Rücken angebracht',
      en: 'Electrode pads being applied to the back for electrotherapy',
      cs: 'Na záda se přikládají elektrody pro elektroléčbu',
      ru: 'На спину накладывают электроды для электротерапии',
    },
    content: {
      de: {
        slug: 'wirbelsaeule',
        navLabel: 'Wirbelsäule und Rückenschmerzen',
        title: 'Kur bei Wirbelsäulenbeschwerden in Marienbad',
        h1: 'Kur bei Wirbelsäule und Rückenschmerzen',
        metaTitle: 'Kur bei Wirbelsäulenbeschwerden in Marienbad | Marienbad.com',
        metaDescription:
          'Kur bei Wirbelsäulenbeschwerden in Marienbad: Anwendungen bei chronischen Rückenschmerzen, nach Bandscheiben-OP, Dauer und was Studien zur Wirkung zeigen.',
        lead:
          'Chronische Rückenschmerzen und Zustände nach Wirbelsäulenoperationen gehören zu den häufigsten Gründen für eine Kur in Marienbad. Die Behandlung kombiniert Wärme aus Moorpackungen, Elektrotherapie und tägliche Rückenschule — eine Intensität, die eine wöchentliche ambulante Physiotherapiesitzung nicht erreicht.',
        teaser: 'Moorpackungen, Elektrotherapie und Rückenschule bei chronischen Rückenschmerzen und nach Bandscheibenoperationen.',
        treats: [
          'Chronisches vertebragenes algisches Syndrom funktionellen Ursprungs in laufender ambulanter Behandlung',
          'Arthrose der Wirbelsäule (Spondylarthrose) mit begleitenden Rückenschmerzen',
          'Zustände nach Bandscheibenoperationen und nach Eingriffen wegen Spinalkanalstenose, wenn die ambulante oder stationäre Reha nicht ausreichend war',
          'Muskulär bedingte Verspannungen und Blockierungen der Hals-, Brust- und Lendenwirbelsäule',
          'Muskuläre Dysbalancen und Bewegungseinschränkungen nach Wirbelsäulenoperationen',
        ],
        notFor: [
          'Akute Radikulopathie mit fortschreitendem neurologischem Ausfall oder Kaudasyndrom — hier ist eine notfallmäßige Abklärung nötig, keine Kur',
          'Frische Wunde ohne abgeschlossene Wundheilung nach einer Wirbelsäulenoperation',
          'Instabile Wirbelsäulenverhältnisse ohne fachärztliche Freigabe',
          'Akute Infektionskrankheiten, aktive Tumorerkrankung oder eine frische, unbehandelte Wirbelfraktur',
          'Schwangerschaft sowie Unfähigkeit zur Selbstversorgung ohne Begleitperson',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body:
              'Der Kurarzt sichtet Bildgebung, gegebenenfalls den OP-Bericht, und führt eine neurologische Basisuntersuchung durch, bevor er den Anwendungsplan festlegt. Bringen Sie aktuelle Röntgen- oder MRT-Befunde mit; ohne sie fällt der Plan vorsichtiger aus.',
          },
          {
            heading: 'Wärme und Elektrotherapie am Vormittag',
            body:
              'Moorpackung und Elektrotherapie lockern die verspannte Rückenmuskulatur, danach folgt eine Nachruhe im Liegen. Der Nachmittag gehört der Bewegung — Einzeltherapie, Rückenschule oder Übungen im Wasser.',
          },
          {
            heading: 'Rückenschule und gezielte Kräftigung',
            body:
              'Übungen zur Stabilisierung der Rumpfmuskulatur, angeleitet in Einzel- oder Gruppentherapie, ergänzt durch Bewegungstherapie im Wasser, wo der Auftrieb die Wirbelsäule entlastet. Die Belastung wird schrittweise gesteigert.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body:
              'Einmal pro Woche prüft der Arzt den Verlauf und passt den Plan an. Zum Abschluss erhalten Sie einen Bericht für Ihren behandelnden Arzt und ein Übungsprogramm für zu Hause.',
          },
        ],
        procedures: [
          { name: 'Moorpackung', detail: 'Wärmetherapie um 40 °C für die verspannte Rückenmuskulatur; Moor gibt die Wärme langsam ab und wird dadurch besser vertragen als Wasser.' },
          { name: 'Elektrotherapie', detail: 'Reizstrom zur Schmerzlinderung und Muskelentspannung bei chronischem vertebragenem Schmerzsyndrom.' },
          { name: 'Einzelphysiotherapie / Rückenschule', detail: 'Gezielte Übungen zur Stabilisierung der Rumpfmuskulatur, angepasst an Befund und gegebenenfalls an die OP-Vorgeschichte.' },
          { name: 'Bewegungstherapie im Wasser', detail: 'Der Auftrieb nimmt Last von der Wirbelsäule, sodass Bewegungsumfang trainiert werden kann, der an Land schmerzt.' },
          { name: 'Unterwassermassage', detail: 'Druckstrahlmassage im warmen Becken, gezielt für die paravertebrale Muskulatur.' },
          { name: 'Klassische Massage', detail: 'Manuelle Lockerung verspannter Muskelpartien entlang der Wirbelsäule.' },
          { name: 'Magnetfeldtherapie', detail: 'Ergänzende physikalische Therapie, je nach Beschwerdebild und in Serie verordnet.' },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body:
            'Beim chronischen vertebragenen Schmerzsyndrom funktionellen Ursprungs (Position VII/9) trägt die tschechische Krankenkasse 21 Tage komplexe oder Zuschuss-Kurbehandlung, Wiederholungsaufenthalte mit Zuschuss 21 oder 14 Tage. Bei Zuständen nach Bandscheibenoperationen oder Eingriffen wegen Spinalkanalstenose, wenn die ambulante oder stationäre Reha nicht ausreichend war (Position VII/11), sind es 28 Tage komplexe Behandlung, bei Wiederholung ebenfalls 28 Tage oder mit Zuschuss 21 beziehungsweise 14 Tage. Selbstzahler wählen die Dauer meist in Absprache mit dem Kurarzt; als fachliche Untergrenze gelten mindestens 10 Anwendungen über mindestens 10 Tage, üblich sind 2 bis 3 Wochen.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body:
            'Bei Rückenschmerzen gehört die Kurmedizin zu den am längsten untersuchten Ansätzen. Eine polnische kontrollierte Studie mit 302 Patienten mit Wirbelsäulenarthrose verglich Kur, ambulante Reha und keine Behandlung: Nur in der Kur-Gruppe hielten Verbesserungen von Schmerz, Funktion und Zufriedenheit sechs Monate an (Zwolińska et al., 2022, Sci Rep; nicht randomisiert). In einer französischen RCT mit 102 Patienten mit chronischen Rückenschmerzen verbesserte eine dreiwöchige Kur die Beweglichkeit der Wirbelsäule und senkte Schmerzstärke und Medikamentenverbrauch; nach neun Monaten hielten die Schmerzlinderung und der geringere Medikamentenverbrauch an, die Funktion lag jedoch wieder auf dem Ausgangsniveau (Guillemin et al., 1994, Br J Rheumatol; ältere, nicht verblindete Studie). Eine weitere französische RCT mit 224 Patienten fand nach drei Wochen und erneut nach drei Monaten eine bessere körperliche und psychische Lebensqualität sowie weniger Angst, Depression und Schmerz (Constant et al., 1998, Med Care; offene Studie). Eine türkische RCT mit 60 Patienten zeigte nach zwei Wochen Balneotherapie anhaltende Verbesserungen von Schmerz und Funktion nach drei und sechs Monaten; zusätzliches Bewegungstraining brachte keinen weiteren Unterschied (Takinaci et al., 2019, Eur J Integr Med; kleine Stichprobe). Diese Studien betreffen chronische, funktionelle oder degenerative Rückenbeschwerden — sie sagen nichts über die Zeit unmittelbar nach einer akuten Bandscheibenoperation aus, und bei begleitenden psychischen Beschwerden ersetzt ein Kuraufenthalt keine Psychotherapie oder psychiatrische Behandlung.',
        },
        physicianNote:
          'Ob und in welcher Form eine Kur bei Ihren Rückenbeschwerden infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer Befunde und gegebenenfalls des OP-Berichts. Diese Seite informiert und ersetzt keine ärztliche oder psychotherapeutische Beratung.',
        faqs: [
          {
            question: 'Welche Kurorte eignen sich bei Wirbelsäulenbeschwerden?',
            answer:
              'Marienbad behandelt das chronische vertebragene Schmerzsyndrom als eigene Position der Indikationsliste (VII/9) und kombiniert dafür Moorpackungen, Elektrotherapie und tägliche Rückenschule. Eine polnische Vergleichsstudie mit 302 Patienten mit Wirbelsäulenarthrose fand, dass nur bei Kurgästen die Verbesserung von Schmerz und Funktion nach sechs Monaten noch anhielt, nicht in der ambulant behandelten oder unbehandelten Gruppe.',
          },
          {
            question: 'Wohin zur Kur nach einer Bandscheibenoperation?',
            answer:
              'Zustände nach Bandscheibenoperationen und nach Eingriffen wegen Spinalkanalstenose sind eine eigene Position der Indikationsliste (VII/11), sofern die ambulante oder stationäre Reha allein nicht ausreichend war. Marienbad behandelt diese Fälle mit Elektrotherapie, Wärmeanwendungen und angeleiteter Rückenschule; den genauen Zeitpunkt und Umfang legt der Kurarzt anhand des OP-Berichts fest.',
          },
          {
            question: 'Hilft eine Kur bei chronischen Rückenschmerzen?',
            answer:
              'Kontrollierte Studien zeigen nach einer dreiwöchigen Kur eine bessere Beweglichkeit, weniger Schmerz und einen geringeren Medikamentenverbrauch, teils noch nach neun Monaten nachweisbar. Die zugrunde liegende Ursache der Rückenschmerzen behebt die Kur damit nicht, und bei einer Studie war die Funktion nach neun Monaten wieder auf dem Ausgangsniveau.',
          },
          {
            question: 'Wie lange sollte eine Kur bei Rückenschmerzen dauern?',
            answer:
              'Als fachliche Norm gelten 2 bis 3 Wochen mit 10 bis 21 Anwendungen; unter 10 Anwendungen in 10 Tagen gilt eine Behandlung fachlich nicht als Balneotherapie. Die Studie mit dem am längsten dokumentierten Effekt bei Rückenschmerzen arbeitete mit drei Wochen.',
          },
          {
            question: 'Kann ich mit akutem Bandscheibenvorfall zur Kur?',
            answer:
              'Bei einer akuten Radikulopathie mit fortschreitendem neurologischem Ausfall oder einem Kaudasyndrom ist eine notfallmäßige fachärztliche Abklärung nötig, keine Kur. Erst nach Stabilisierung oder gegebenenfalls nach einer Operation und Freigabe durch den behandelnden Arzt kommt ein Kuraufenthalt infrage.',
          },
        ],
        sources: [
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe VII — Positionen VII/9 und VII/11',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'VII/9: chronisches vertebragenes Schmerzsyndrom, 21 Tage. VII/11: Zustände nach Bandscheiben-OP und Spinalkanalstenose, wenn ambulante/stationäre Reha nicht ausreichend war, 28 Tage.',
          },
          {
            title: 'Zwolińska J et al. 2022, Sci Rep — kontrollierte Studie, 302 Patienten mit Wirbelsäulenarthrose',
            url: 'https://consensus.app/papers/details/1c6d434bfbb75ea188230cef75f69ac8/',
            note: 'Kur vs. ambulante Reha vs. keine Behandlung: Nur in der Kur-Gruppe hielten Verbesserungen von Schmerz, Funktion und Zufriedenheit nach 6 Monaten an. Nicht randomisiert.',
          },
          {
            title: 'Guillemin F et al. 1994, Br J Rheumatol — RCT, 102 Patienten mit chronischer Rückenschmerzen',
            url: 'https://consensus.app/papers/details/ae6044021e235aad9e5bb9e81e6e18c1/',
            note: 'Dreiwöchige Kur: bessere Beweglichkeit, weniger Schmerz und Medikamentenverbrauch; nach 9 Monaten Schmerzlinderung erhalten, Funktion zurück auf Ausgangsniveau. Älter, nicht verblindet.',
          },
          {
            title: 'Constant F et al. 1998, Med Care — RCT, 224 Patienten mit chronischer Rückenschmerzen',
            url: 'https://consensus.app/papers/details/29e095b728a756f88e07eebd015a311c/',
            note: 'Bessere körperliche und psychische Lebensqualität, weniger Angst, Depression und Schmerz nach 3 Wochen und 3 Monaten. Offene Studie.',
          },
          {
            title: 'Takinaci Z et al. 2019, Eur J Integr Med — RCT, 60 Patienten mit chronischer Rückenschmerzen',
            url: 'https://consensus.app/papers/details/08504c1e2ef354679262cc9364550b10/',
            note: 'Zwei Wochen Balneotherapie: anhaltende Verbesserung von Schmerz und Funktion nach 3 und 6 Monaten. Kleiner Stichprobenumfang.',
          },
          {
            title: 'Maraver F et al. 2020, Int J Biometeorol — Leserbrief zur Dauer der Balneotherapie',
            url: 'https://doi.org/10.1007/s00484-020-02041-5',
            note: 'Fachliche Untergrenze: mindestens 10 Anwendungen über mindestens 10 Tage; Norm sind 2–3 Wochen. Expertenmeinung, keine Studie.',
          },
        ],
        related: [
          { label: 'Moortherapie', href: '/de/peloidtherapie' },
          { label: 'Kur bei Arthrose', href: '/de/kur-bei/arthrose' },
          { label: 'Bewegungsapparat: Moor und Mineralwasser', href: '/de/magazin/bewegungsapparat-moor-mineralwasser' },
          { label: 'Indikationen und Kontraindikationen', href: '/de/indikationen-und-kontraindikationen' },
        ],
      },
      en: {
        slug: 'spine-and-back-pain',
        navLabel: 'Spine and back pain',
        title: 'Spa treatment for spine and back pain in Marienbad',
        h1: 'Spa treatment for the spine and back pain',
        metaTitle: 'Spa treatment for back pain in Marienbad | Marienbad.com',
        metaDescription:
          'Spa treatment for spine complaints in Marienbad: treatments for chronic back pain, after disc surgery, duration, and what studies show on effect.',
        lead:
          'Chronic back pain and conditions after spinal surgery are among the most common reasons for a spa cure in Marienbad. Treatment combines heat from peat packs, electrotherapy and daily back school — an intensity that a weekly outpatient physiotherapy session cannot reach.',
        teaser: 'Peat packs, electrotherapy and back school for chronic back pain and after disc surgery.',
        treats: [
          'Chronic vertebrogenic pain syndrome of functional origin, under ongoing outpatient care',
          'Osteoarthritis of the spine (spondylarthrosis) with accompanying back pain',
          'Conditions after disc surgery and after procedures for spinal canal stenosis, when outpatient or inpatient rehabilitation was not sufficient',
          'Muscle-related tension and blocking of the cervical, thoracic and lumbar spine',
          'Muscular imbalance and restricted movement after spinal surgery',
        ],
        notFor: [
          'Acute radiculopathy with progressive neurological deficit or cauda equina syndrome — this needs emergency assessment, not a spa cure',
          'A fresh wound without completed healing after spinal surgery',
          'Unstable spinal conditions without specialist clearance',
          'Acute infectious disease, active cancer, or a recent, untreated vertebral fracture',
          'Pregnancy, or an inability to manage personal care without a companion',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body:
              'The spa physician reviews imaging, and the surgical report where relevant, and carries out a basic neurological examination before setting the treatment plan. Bring recent X-ray or MRI reports; without them the plan is more cautious.',
          },
          {
            heading: 'Heat and electrotherapy in the morning',
            body:
              'Peat pack and electrotherapy loosen tense back muscles, followed by a rest period lying down. The afternoon belongs to movement — individual therapy, back school or exercises in water.',
          },
          {
            heading: 'Back school and targeted strengthening',
            body:
              'Exercises to stabilise the core muscles, guided in individual or group therapy, supplemented by exercise therapy in water, where buoyancy relieves the spine. The load is increased step by step.',
          },
          {
            heading: 'Weekly check-up and final report',
            body:
              'Once a week the physician reviews your progress and adjusts the plan. At the end you receive a report for your own doctor and a home exercise programme.',
          },
        ],
        procedures: [
          { name: 'Peat pack', detail: 'Heat therapy at around 40 °C for tense back muscles; peat releases heat slowly and is therefore better tolerated than water.' },
          { name: 'Electrotherapy', detail: 'Stimulation current for pain relief and muscle relaxation in chronic vertebrogenic pain syndrome.' },
          { name: 'Individual physiotherapy / back school', detail: 'Targeted exercises to stabilise the core muscles, adapted to findings and, where relevant, surgical history.' },
          { name: 'Exercise therapy in water', detail: 'Buoyancy takes load off the spine, so a range of movement can be trained that would hurt on dry land.' },
          { name: 'Underwater massage', detail: 'Pressure-jet massage in a warm pool, targeted at the paravertebral muscles.' },
          { name: 'Classic massage', detail: 'Manual loosening of tense muscle areas along the spine.' },
          { name: 'Magnetic field therapy', detail: 'Supplementary physical therapy, prescribed as a course according to the complaint.' },
        ],
        stay: {
          heading: 'How long, and when',
          body:
            'For chronic vertebrogenic pain syndrome of functional origin (position VII/9), stays covered by Czech public health insurance run to 21 days of comprehensive or contributory spa care, with repeat stays of 21 or 14 days of contributory care. For conditions after disc surgery or procedures for spinal canal stenosis, when outpatient or inpatient rehabilitation was not sufficient (position VII/11), it is 28 days of comprehensive care, with 28 days on repeat or 21 or 14 days of contributory care. Self-paying guests usually choose the length in consultation with the spa physician; the professional minimum is at least 10 treatments over at least 10 days, with 2 to 3 weeks the usual length.',
        },
        evidence: {
          heading: 'What the studies show',
          body:
            'For back pain, spa medicine is among the longest-studied approaches. A Polish controlled study of 302 patients with spinal osteoarthritis compared a spa cure, outpatient rehabilitation and no treatment: only in the spa-cure group did improvements in pain, function and satisfaction last six months (Zwolińska et al., 2022, Sci Rep; not randomised). In a French RCT of 102 patients with chronic back pain, a three-week cure improved spinal mobility and reduced pain intensity and medication use; after nine months, the pain relief and lower medication use persisted, but function had returned to baseline (Guillemin et al., 1994, Br J Rheumatol; an older, unblinded study). A further French RCT of 224 patients found better physical and mental quality of life and less anxiety, depression and pain after three weeks and again after three months (Constant et al., 1998, Med Care; open-label study). A Turkish RCT of 60 patients showed lasting improvements in pain and function after two weeks of balneotherapy, still present at three and six months; additional exercise training made no further difference (Takinaci et al., 2019, Eur J Integr Med; small sample). These studies concern chronic, functional or degenerative back complaints — they say nothing about the period immediately after acute disc surgery, and for accompanying psychological complaints a spa stay does not replace psychotherapy or psychiatric treatment.',
        },
        physicianNote:
          'Whether and in what form a spa cure is right for your back complaints is decided by the spa physician at the initial examination, based on your findings and, where relevant, the surgical report. This page provides information and does not replace medical or psychotherapeutic advice.',
        faqs: [
          {
            question: 'Which spa resorts are suitable for spine complaints?',
            answer:
              'Marienbad treats chronic vertebrogenic pain syndrome as a separate position on the indication list (VII/9) and combines peat packs, electrotherapy and daily back school for it. A Polish comparative study of 302 patients with spinal osteoarthritis found that only spa-cure guests still had improved pain and function after six months, unlike the outpatient-treated or untreated groups.',
          },
          {
            question: 'Where should I go for spa treatment after disc surgery?',
            answer:
              'Conditions after disc surgery and after procedures for spinal canal stenosis are a separate position on the indication list (VII/11), provided that outpatient or inpatient rehabilitation alone was not sufficient. Marienbad treats these cases with electrotherapy, heat treatments and guided back school; the spa physician sets the exact timing and scope based on the surgical report.',
          },
          {
            question: 'Does a spa cure help with chronic back pain?',
            answer:
              'Controlled studies show better mobility, less pain and lower medication use after a three-week cure, in some cases still measurable after nine months. The cure does not remove the underlying cause of the back pain, and in one study function had returned to baseline after nine months.',
          },
          {
            question: 'How long should a spa cure for back pain last?',
            answer:
              'The professional norm is 2 to 3 weeks with 10 to 21 treatments; under 10 treatments in 10 days a treatment is not considered balneotherapy in professional terms. The study with the longest documented effect for back pain used three weeks.',
          },
          {
            question: 'Can I go for a spa cure with an acute slipped disc?',
            answer:
              'With acute radiculopathy showing progressive neurological deficit or cauda equina syndrome, emergency specialist assessment is needed, not a spa cure. Only after stabilisation, or where relevant after surgery and clearance from the treating doctor, does a spa stay become an option.',
          },
        ],
        sources: [
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group VII — positions VII/9 and VII/11',
            url: '/en/indications-and-contraindications',
            note: 'VII/9: chronic vertebrogenic pain syndrome, 21 days. VII/11: conditions after disc surgery and spinal canal stenosis, when outpatient/inpatient rehabilitation was not sufficient, 28 days.',
          },
          {
            title: 'Zwolińska J et al. 2022, Sci Rep — controlled study, 302 patients with spinal osteoarthritis',
            url: 'https://consensus.app/papers/details/1c6d434bfbb75ea188230cef75f69ac8/',
            note: 'Spa cure vs. outpatient rehabilitation vs. no treatment: only the spa-cure group had lasting improvements in pain, function and satisfaction after 6 months. Not randomised.',
          },
          {
            title: 'Guillemin F et al. 1994, Br J Rheumatol — RCT, 102 patients with chronic back pain',
            url: 'https://consensus.app/papers/details/ae6044021e235aad9e5bb9e81e6e18c1/',
            note: 'Three-week cure: better mobility, less pain and medication use; after 9 months pain relief retained, function back to baseline. Older, unblinded.',
          },
          {
            title: 'Constant F et al. 1998, Med Care — RCT, 224 patients with chronic back pain',
            url: 'https://consensus.app/papers/details/29e095b728a756f88e07eebd015a311c/',
            note: 'Better physical and mental quality of life, less anxiety, depression and pain after 3 weeks and 3 months. Open-label study.',
          },
          {
            title: 'Takinaci Z et al. 2019, Eur J Integr Med — RCT, 60 patients with chronic back pain',
            url: 'https://consensus.app/papers/details/08504c1e2ef354679262cc9364550b10/',
            note: 'Two weeks of balneotherapy: lasting improvement of pain and function after 3 and 6 months. Small sample size.',
          },
          {
            title: 'Maraver F et al. 2020, Int J Biometeorol — letter to the editor on the length of balneotherapy',
            url: 'https://doi.org/10.1007/s00484-020-02041-5',
            note: 'Professional minimum: at least 10 treatments over at least 10 days; the norm is 2–3 weeks. Expert opinion, not a study.',
          },
        ],
        related: [
          { label: 'Peat therapy', href: '/en/peloid-therapy' },
          { label: 'Spa treatment for osteoarthritis', href: '/en/spa-treatment-for/osteoarthritis' },
          { label: 'Musculoskeletal treatment: peat and mineral water', href: '/en/magazine/musculoskeletal-treatment-peat-mineral' },
          { label: 'Indications and contraindications', href: '/en/indications-and-contraindications' },
        ],
      },
      cs: {
        slug: 'pater-a-bolesti-zad',
        navLabel: 'Páteř a bolesti zad',
        title: 'Lázeňská léčba páteře a bolestí zad v Mariánských Lázních',
        h1: 'Lázeňská léčba páteře a bolestí zad',
        metaTitle: 'Léčba páteře a bolestí zad v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Léčba páteře v Mariánských Lázních: procedury při chronických bolestech zad, po operaci ploténky, délka pobytu a co ukazují studie o účinku.',
        lead: 'Chronické bolesti zad a stavy po operacích páteře patří k nejčastějším důvodům lázeňského pobytu v Mariánských Lázních. Léčba kombinuje teplo ze slatinných zábalů, elektroléčbu a denní školu zad — intenzitu, kterou týdenní ambulantní fyzioterapie nedosáhne.',
        teaser: 'Slatinné zábaly, elektroléčba a škola zad při chronických bolestech zad a po operacích ploténky.',
        treats: [
          'Chronický vertebrogenní algický syndrom funkčního původu v průběžné ambulantní léčbě',
          'Artróza páteře (spondylartróza) s doprovodnými bolestmi zad',
          'Stavy po operacích meziobratlové ploténky a po zákrocích pro spinální stenózu, když ambulantní nebo ústavní rehabilitace nebyla dostatečná',
          'Svalově podmíněné napětí a blokády krční, hrudní a bederní páteře',
          'Svalové dysbalance a omezená hybnost po operacích páteře',
        ],
        notFor: [
          'Akutní radikulopatie s postupujícím neurologickým výpadkem nebo kaudálním syndromem — zde je nutné akutní vyšetření, ne lázeňský pobyt',
          'Čerstvá rána bez zhojení po operaci páteře',
          'Nestabilní poměry na páteři bez souhlasu odborného lékaře',
          'Akutní infekční onemocnění, aktivní nádorové onemocnění nebo čerstvá neléčená zlomenina obratle',
          'Těhotenství a neschopnost sebeobsluhy bez doprovodu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde zobrazovací vyšetření, případně operační zprávu, a provede základní neurologické vyšetření, než stanoví plán procedur. Vezměte si aktuální rentgenové nebo MR nálezy; bez nich vyjde plán opatrněji.',
          },
          {
            heading: 'Teplo a elektroléčba dopoledne',
            body: 'Slatinný zábal a elektroléčba uvolní napjaté zádové svalstvo, poté následuje klid vleže. Odpoledne patří pohybu — individuální terapii, škole zad nebo cvičení ve vodě.',
          },
          {
            heading: 'Škola zad a cílené posilování',
            body: 'Cvičení na stabilizaci trupového svalstva, vedená individuálně nebo ve skupině, doplněná pohybovou terapií ve vodě, kde vztlak páteř odlehčuje. Zátěž se zvyšuje postupně.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Jednou týdně lékař zkontroluje průběh a upraví plán. Na závěr dostanete zprávu pro svého ošetřujícího lékaře a cvičební program domů.',
          },
        ],
        procedures: [
          {
            name: 'Slatinný zábal',
            detail: 'Termoterapie kolem 40 °C pro napjaté zádové svalstvo; slatina odevzdává teplo pomalu, proto se snáší lépe než voda.',
          },
          {
            name: 'Elektroléčba',
            detail: 'Dráždivý proud ke zmírnění bolesti a uvolnění svalů při chronickém vertebrogenním bolestivém syndromu.',
          },
          {
            name: 'Individuální fyzioterapie / škola zad',
            detail: 'Cílená cvičení na stabilizaci trupového svalstva, přizpůsobená nálezu a případně operační anamnéze.',
          },
          {
            name: 'Pohybová terapie ve vodě',
            detail: 'Vztlak snímá zátěž z páteře, takže lze trénovat rozsah pohybu, který na suchu bolí.',
          },
          {
            name: 'Podvodní masáž',
            detail: 'Tlaková vodní masáž v teplém bazénu, cílená na svalstvo podél páteře.',
          },
          {
            name: 'Klasická masáž',
            detail: 'Manuální uvolnění napjatých svalových partií podél páteře.',
          },
          {
            name: 'Magnetoterapie',
            detail: 'Doplňková fyzikální terapie podle nálezu a v sérii.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Chronický vertebrogenní bolestivý syndrom funkčního původu je položka VII/9, stavy po operacích ploténky nebo pro spinální stenózu při nedostatečné rehabilitaci položka VII/11 indikačního seznamu; přesnou délku obou najdete na stránce Co hradí pojišťovna u pohybového ústrojí. Samoplátci volí délku většinou po dohodě s lázeňským lékařem; jako odborné minimum platí alespoň 10 procedur během alespoň 10 dní, obvyklé jsou 2 až 3 týdny.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'U bolestí zad patří lázeňská medicína k nejdéle zkoumaným přístupům. Polská kontrolovaná studie s 302 pacienty se spondylartrózou srovnala lázeňskou léčbu, ambulantní rehabilitaci a žádnou léčbu: zlepšení bolesti, funkce a spokojenosti přetrvalo po šesti měsících jen ve skupině s lázeňskou léčbou (Zwolińska a kol., 2022, Sci Rep; nerandomizovaná). Francouzská RCT se 102 pacienty s chronickými bolestmi zad zjistila, že třítýdenní lázeňský pobyt zlepšil pohyblivost páteře a snížil intenzitu bolesti i spotřebu léků; po devíti měsících přetrvávala úleva od bolesti a nižší spotřeba léků, funkce se však vrátila na výchozí úroveň (Guillemin a kol., 1994, Br J Rheumatol; starší, nezaslepená studie). Další francouzská RCT s 224 pacienty zjistila po třech týdnech a znovu po třech měsících lepší tělesnou i psychickou kvalitu života a méně úzkosti, deprese a bolesti (Constant a kol., 1998, Med Care; otevřená studie). Turecká RCT s 60 pacienty ukázala po dvou týdnech balneoterapie přetrvávající zlepšení bolesti a funkce po třech a šesti měsících; doplňkový pohybový trénink nepřinesl další rozdíl (Takinaci a kol., 2019, Eur J Integr Med; malý vzorek). Tyto studie se týkají chronických, funkčních nebo degenerativních bolestí zad — nic neříkají o období bezprostředně po akutní operaci ploténky, a při doprovodných psychických potížích lázeňský pobyt nenahrazuje psychoterapii ani psychiatrickou péči.',
        },
        physicianNote: 'O tom, zda a v jaké formě pro vás při potížích se zády připadá v úvahu lázeňská léčba, rozhoduje lázeňský lékař při vstupní prohlídce podle vašich nálezů a případně operační zprávy. Tato stránka informuje a nenahrazuje lékařskou ani psychoterapeutickou konzultaci.',
        faqs: [
          {
            question: 'Které lázně jsou vhodné při bolestech páteře?',
            answer: 'Mariánské Lázně vedou chronický vertebrogenní bolestivý syndrom jako samostatnou položku indikačního seznamu (VII/9) a kombinují pro něj slatinné zábaly, elektroléčbu a denní školu zad. Polská srovnávací studie s 302 pacienty se spondylartrózou zjistila, že jen u lázeňských hostů zlepšení bolesti a funkce přetrvalo po šesti měsících, ne u ambulantně léčené nebo neléčené skupiny.',
          },
          {
            question: 'Kam na lázně po operaci ploténky?',
            answer: 'Stavy po operacích ploténky a po zákrocích pro spinální stenózu jsou samostatnou položkou indikačního seznamu (VII/11), pokud ambulantní nebo ústavní rehabilitace sama nestačila. Mariánské Lázně tyto případy léčí elektroléčbou, tepelnými procedurami a vedenou školou zad; přesný termín a rozsah určí lázeňský lékař podle operační zprávy.',
          },
          {
            question: 'Pomáhá lázeňský pobyt při chronických bolestech zad?',
            answer: 'Kontrolované studie ukazují po třítýdenním pobytu lepší pohyblivost, méně bolesti a nižší spotřebu léků, u některých ještě po devíti měsících. Základní příčinu bolestí zad tím lázeňská léčba neodstraní, a v jedné studii se funkce po devíti měsících vrátila na výchozí úroveň.',
          },
          {
            question: 'Jak dlouho by měl lázeňský pobyt při bolestech zad trvat?',
            answer: 'Jako odborná norma platí 2 až 3 týdny s 10 až 21 procedurami; pod 10 procedur za 10 dní se léčba odborně nepovažuje za balneoterapii. Studie s nejdéle zdokumentovaným účinkem u bolestí zad pracovala se třemi týdny.',
          },
          {
            question: 'Mohu jet do lázní s akutním výhřezem ploténky?',
            answer: 'Při akutní radikulopatii s postupujícím neurologickým výpadkem nebo kaudálním syndromem je nutné akutní odborné vyšetření, ne lázeňský pobyt. Až po stabilizaci, případně po operaci a souhlasu ošetřujícího lékaře, přichází lázeňský pobyt v úvahu.',
          },
        ],
        sources: [
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina VII — položky VII/9 a VII/11',
            url: '/cs/indikace-a-kontraindikace',
            note: 'VII/9: chronický vertebrogenní bolestivý syndrom. VII/11: stavy po operaci ploténky a spinální stenóze, pokud ambulantní/ústavní rehabilitace nestačila.',
          },
          {
            title: 'Zwolińska J a kol. 2022, Sci Rep — kontrolovaná studie, 302 pacientů se spondylartrózou',
            url: 'https://consensus.app/papers/details/1c6d434bfbb75ea188230cef75f69ac8/',
            note: 'Lázeňská léčba vs. ambulantní rehabilitace vs. žádná léčba: jen u lázeňské skupiny přetrvalo zlepšení bolesti, funkce a spokojenosti po 6 měsících. Nerandomizovaná.',
          },
          {
            title: 'Guillemin F a kol. 1994, Br J Rheumatol — RCT, 102 pacientů s chronickými bolestmi zad',
            url: 'https://consensus.app/papers/details/ae6044021e235aad9e5bb9e81e6e18c1/',
            note: 'Třítýdenní lázeňská léčba: lepší pohyblivost, méně bolesti a spotřeby léků; po 9 měsících úleva od bolesti zůstala, funkce zpět na výchozí úrovni. Starší, nezaslepená.',
          },
          {
            title: 'Constant F a kol. 1998, Med Care — RCT, 224 pacientů s chronickými bolestmi zad',
            url: 'https://consensus.app/papers/details/29e095b728a756f88e07eebd015a311c/',
            note: 'Lepší tělesná i psychická kvalita života, méně úzkosti, deprese a bolesti po 3 týdnech a 3 měsících. Otevřená studie.',
          },
          {
            title: 'Takinaci Z a kol. 2019, Eur J Integr Med — RCT, 60 pacientů s chronickými bolestmi zad',
            url: 'https://consensus.app/papers/details/08504c1e2ef354679262cc9364550b10/',
            note: 'Dva týdny balneoterapie: přetrvávající zlepšení bolesti a funkce po 3 a 6 měsících. Malý vzorek.',
          },
          {
            title: 'Maraver F a kol. 2020, Int J Biometeorol — dopis redakci k délce balneoterapie',
            url: 'https://doi.org/10.1007/s00484-020-02041-5',
            note: 'Odborné minimum: alespoň 10 procedur během alespoň 10 dní; norma jsou 2–3 týdny. Odborný názor, ne studie.',
          },
        ],
        related: [
          {
            label: 'Peloidní terapie',
            href: '/cs/peloidni-terapie',
          },
          {
            label: 'Lázeňská léčba artrózy',
            href: '/cs/lazenska-lecba/artroza',
          },
          {
            label: 'Léčba pohybového aparátu slatinou a minerální vodou',
            href: '/cs/magazin/lecba-pohyboveho-aparatu',
          },
          {
            label: 'Co hradí pojišťovna u pohybového ústrojí',
            href: '/cs/lazne-s-pojistovnou/indikace/pohybove-ustroji',
          },
        ],
      },
      ru: {
        slug: 'pozvonochnik-i-boli-v-spine',
        navLabel: 'Позвоночник и боли в спине',
        title: 'Курортное лечение заболеваний позвоночника в Марианских Лазнях',
        h1: 'Курортное лечение позвоночника и болей в спине',
        metaTitle: 'Лечение позвоночника в Марианских Лазнях | Marienbad.com',
        metaDescription: 'Курортное лечение позвоночника в Марианских Лазнях: процедуры при хронических болях в спине, после операции на диске, сроки и данные исследований.',
        lead: 'Хронические боли в спине и состояния после операций на позвоночнике — одна из самых частых причин обращения за курортным лечением в Марианских Лазнях. Лечение сочетает тепло торфяных обёртываний, электротерапию и ежедневную школу спины — интенсивность, которую еженедельный амбулаторный сеанс физиотерапии обеспечить не может.',
        teaser: 'Торфяные обёртывания, электротерапия и школа спины при хронических болях в спине и после операций на межпозвоночных дисках.',
        treats: [
          'Хронический вертеброгенный болевой синдром функционального происхождения, находящийся в постоянном амбулаторном лечении',
          'Артроз позвоночника (спондилоартроз) с сопутствующими болями в спине',
          'Состояния после операций на межпозвоночных дисках и после вмешательств по поводу стеноза позвоночного канала, если амбулаторная или стационарная реабилитация была недостаточной',
          'Мышечно обусловленные напряжения и блокады шейного, грудного и поясничного отделов позвоночника',
          'Мышечный дисбаланс и ограничение подвижности после операций на позвоночнике',
        ],
        notFor: [
          'Острая радикулопатия с нарастающим неврологическим дефицитом или синдромом конского хвоста — здесь необходима экстренная диагностика, а не курортное лечение',
          'Свежая рана без завершённого заживления после операции на позвоночнике',
          'Нестабильность позвоночника без разрешения профильного врача',
          'Острые инфекционные заболевания, активное онкологическое заболевание или свежий, нелеченый перелом позвонка',
          'Беременность, а также неспособность к самообслуживанию без сопровождающего лица',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает данные визуализации, при необходимости выписку из операции, и проводит базовый неврологический осмотр, прежде чем определить план процедур. Возьмите с собой актуальные снимки рентгена или МРТ; без них план будет более осторожным.',
          },
          {
            heading: 'Тепло и электротерапия в первой половине дня',
            body: 'Торфяное обёртывание и электротерапия расслабляют напряжённые мышцы спины, после чего следует отдых лёжа. Вторая половина дня отведена движению — индивидуальной терапии, школе спины или упражнениям в воде.',
          },
          {
            heading: 'Школа спины и целенаправленное укрепление',
            body: 'Упражнения на стабилизацию мышц туловища, под руководством в индивидуальной или групповой форме, дополненные двигательной терапией в воде, где выталкивающая сила снимает нагрузку с позвоночника. Нагрузка увеличивается постепенно.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Раз в неделю врач проверяет динамику и корректирует план. По окончании вы получаете заключение для лечащего врача дома и программу упражнений на дом.',
          },
        ],
        procedures: [
          {
            name: 'Торфяное обёртывание',
            detail: 'Тепловая процедура около 40 °C для напряжённых мышц спины; торф отдаёт тепло медленно и потому переносится лучше воды.',
          },
          {
            name: 'Электротерапия',
            detail: 'Импульсные токи для облегчения боли и расслабления мышц при хроническом вертеброгенном болевом синдроме.',
          },
          {
            name: 'Индивидуальная физиотерапия / школа спины',
            detail: 'Целенаправленные упражнения на стабилизацию мышц туловища, подобранные по данным осмотра и, при необходимости, по истории операции.',
          },
          {
            name: 'Двигательная терапия в воде',
            detail: 'Выталкивающая сила воды снимает нагрузку с позвоночника, поэтому можно тренировать объём движений, который на суше вызывает боль.',
          },
          {
            name: 'Подводный душ-массаж',
            detail: 'Массаж направленной струёй воды в тёплом бассейне, прицельно для околопозвоночных мышц.',
          },
          {
            name: 'Классический массаж',
            detail: 'Ручное расслабление напряжённых участков мышц вдоль позвоночника.',
          },
          {
            name: 'Магнитотерапия',
            detail: 'Дополнительная физиотерапия, назначаемая по показаниям и курсом.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'При хроническом вертеброгенном болевом синдроме функционального происхождения (позиция VII/9) для пребываний, оплачиваемых чешской страховой, предусмотрено 21 день комплексного или долевого курортного лечения, повторные пребывания с долевым финансированием — 21 или 14 дней. При состояниях после операций на межпозвоночных дисках или вмешательств по поводу стеноза позвоночного канала, если амбулаторная или стационарная реабилитация была недостаточной (позиция VII/11), предусмотрено 28 дней комплексного лечения, при повторном пребывании также 28 дней или с долевым финансированием 21 либо 14 дней. Гости, оплачивающие лечение самостоятельно, обычно выбирают срок по согласованию с курортным врачом; профессиональным минимумом считается не менее 10 процедур за не менее чем 10 дней, обычно это 2–3 недели.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'При болях в спине курортная медицина относится к наиболее давно изучаемым подходам. Польское контролируемое исследование с 302 пациентами с артрозом позвоночника сравнило курортное лечение, амбулаторную реабилитацию и отсутствие лечения: только в группе курортного лечения улучшение боли, функции и удовлетворённости сохранялось через шесть месяцев (Zwolińska et al., 2022, Sci Rep; нерандомизированное). Во французском РКИ со 102 пациентами с хроническими болями в спине трёхнедельное курортное лечение улучшило подвижность позвоночника и снизило интенсивность боли и потребление лекарств; через девять месяцев облегчение боли и меньшее потребление лекарств сохранялись, а функция вернулась к исходному уровню (Guillemin et al., 1994, Br J Rheumatol; более старое, неослеплённое исследование). Ещё одно французское РКИ с 224 пациентами обнаружило после трёх недель и повторно через три месяца лучшее физическое и психическое качество жизни, а также меньше тревоги, депрессии и боли (Constant et al., 1998, Med Care; открытое исследование). Турецкое РКИ с 60 пациентами показало после двух недель бальнеотерапии сохраняющееся улучшение боли и функции через три и шесть месяцев; дополнительные тренировки движения не дали дополнительной разницы (Takinaci et al., 2019, Eur J Integr Med; маленькая выборка). Эти исследования касаются хронических, функциональных или дегенеративных болей в спине — они ничего не говорят о периоде сразу после острой операции на межпозвоночном диске, а при сопутствующих психических жалобах курортное пребывание не заменяет психотерапию или психиатрическую помощь.',
        },
        physicianNote: 'Показано ли и в какой форме вам курортное лечение при болях в спине, решает курортный врач при первичном осмотре на основании ваших заключений и, при необходимости, выписки из операции. Эта страница носит информационный характер и не заменяет консультацию врача или психотерапевта.',
        faqs: [
          {
            question: 'Какой курорт подходит при заболеваниях позвоночника?',
            answer: 'В Марианских Лазнях хронический вертеброгенный болевой синдром выделен как отдельная позиция индикационного списка (VII/9), и для его лечения сочетают торфяные обёртывания, электротерапию и ежедневную школу спины. Польское сравнительное исследование с 302 пациентами с артрозом позвоночника обнаружило, что только у гостей курортного лечения улучшение боли и функции сохранялось через шесть месяцев, а в группах амбулаторного лечения или без лечения — нет.',
          },
          {
            question: 'Куда ехать на лечение после операции на межпозвоночном диске?',
            answer: 'Состояния после операций на межпозвоночных дисках и после вмешательств по поводу стеноза позвоночного канала — отдельная позиция индикационного списка (VII/11), если одной амбулаторной или стационарной реабилитации было недостаточно. В Марианских Лазнях такие случаи лечат электротерапией, тепловыми процедурами и направляемой школой спины; точный момент и объём определяет курортный врач на основании выписки из операции.',
          },
          {
            question: 'Помогает ли курортное лечение при хронических болях в спине?',
            answer: 'Контролируемые исследования показывают после трёхнедельного лечения лучшую подвижность, меньше боли и меньшее потребление лекарств, иногда сохраняющиеся ещё через девять месяцев. Саму причину болей в спине лечение при этом не устраняет, а в одном исследовании функция через девять месяцев вернулась к исходному уровню.',
          },
          {
            question: 'Сколько по времени должно длиться лечение при болях в спине?',
            answer: 'Профессиональной нормой считаются 2–3 недели с 10–21 процедурой; менее 10 процедур за 10 дней с профессиональной точки зрения бальнеотерапией не считается. Исследование с самым длительным зафиксированным эффектом при болях в спине проводилось при трёхнедельном курсе.',
          },
          {
            question: 'Можно ли ехать на лечение с острой грыжей межпозвоночного диска?',
            answer: 'При острой радикулопатии с нарастающим неврологическим дефицитом или синдромом конского хвоста необходима экстренная диагностика у профильного врача, а не курортное лечение. Только после стабилизации или, при необходимости, после операции и разрешения лечащего врача курортное пребывание становится возможным.',
          },
        ],
        sources: [
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа VII — позиции VII/9 и VII/11',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'VII/9: хронический вертеброгенный болевой синдром, 21 день. VII/11: состояния после операции на межпозвоночном диске и стеноза позвоночного канала, если амбулаторная/стационарная реабилитация была недостаточной, 28 дней.',
          },
          {
            title: 'Zwolińska J et al. 2022, Sci Rep — контролируемое исследование, 302 пациента с артрозом позвоночника',
            url: 'https://consensus.app/papers/details/1c6d434bfbb75ea188230cef75f69ac8/',
            note: 'Курортное лечение против амбулаторной реабилитации против отсутствия лечения: только в группе курортного лечения улучшение боли, функции и удовлетворённости сохранялось через 6 месяцев. Нерандомизированное.',
          },
          {
            title: 'Guillemin F et al. 1994, Br J Rheumatol — РКИ, 102 пациента с хронической болью в спине',
            url: 'https://consensus.app/papers/details/ae6044021e235aad9e5bb9e81e6e18c1/',
            note: 'Трёхнедельное курортное лечение: лучше подвижность, меньше боли и потребления лекарств; через 9 месяцев облегчение боли сохранено, функция вернулась к исходному уровню. Старое, неослеплённое.',
          },
          {
            title: 'Constant F et al. 1998, Med Care — РКИ, 224 пациента с хронической болью в спине',
            url: 'https://consensus.app/papers/details/29e095b728a756f88e07eebd015a311c/',
            note: 'Лучше физическое и психическое качество жизни, меньше тревоги, депрессии и боли через 3 недели и 3 месяца. Открытое исследование.',
          },
          {
            title: 'Takinaci Z et al. 2019, Eur J Integr Med — РКИ, 60 пациентов с хронической болью в спине',
            url: 'https://consensus.app/papers/details/08504c1e2ef354679262cc9364550b10/',
            note: 'Две недели бальнеотерапии: сохраняющееся улучшение боли и функции через 3 и 6 месяцев. Маленький объём выборки.',
          },
          {
            title: 'Maraver F et al. 2020, Int J Biometeorol — письмо в редакцию о длительности бальнеотерапии',
            url: 'https://doi.org/10.1007/s00484-020-02041-5',
            note: 'Профессиональный минимум: не менее 10 процедур за не менее чем 10 дней; норма — 2–3 недели. Мнение экспертов, не исследование.',
          },
        ],
        related: [
          {
            label: 'Торфолечение',
            href: '/ru/peloidnaya-terapiya',
          },
          {
            label: 'Лечение артроза',
            href: '/ru/kurortnoe-lechenie/artroz',
          },
          {
            label: 'Опорно-двигательный аппарат: торф и минеральная вода',
            href: '/ru/zhurnal/lechenie-oporno-dvigatelnogo-apparata',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'rheumatoid-arthritis',
    groupId: 'musculoskeletal',
    roman: 'VII',
    codes: [
      'VII/1',
      'VII/2',
      'VII/3',
    ],
    conditionName: 'Rheumatoid arthritis',
    icd10: 'M05-M06',
    image: '/images/library/treatments/peat-wrap-back.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Therapeutin legt eine warme Moorpackung auf den Rücken eines Kurgastes',
      en: 'A therapist applies a warm peat pack to a spa guest’s back',
      cs: 'Terapeutka pokládá teplý slatinný zábal na záda lázeňského hosta',
      ru: 'Терапевт накладывает тёплое торфяное обёртывание на спину пациента курорта',
    },
    content: {
      de: {
        slug: 'rheuma',
        navLabel: 'Rheuma',
        title: 'Kur bei Rheuma in Marienbad',
        h1: 'Kur bei rheumatoider Arthritis und Rheuma',
        metaTitle: 'Kur bei Rheuma in Marienbad — Dauer und Wirkung | Marienbad.com',
        metaDescription: 'Rheumatoide Arthritis und Morbus Bechterew: welche Anwendungen die Marienbader Kur bei Rheuma einsetzt, wie lange sie dauert und was Studien zeigen.',
        lead: 'Rheumatoide Arthritis ist eine chronisch-entzündliche Gelenkerkrankung, die neben der medikamentösen Basistherapie eine begleitende Rehabilitation braucht. Marienbad führt Rheuma seit der tschechischen Indikationsliste als eigene Gruppe und kombiniert dafür ärztlich verordnete Bewegungstherapie, Physiotherapie und — in stabilen Krankheitsphasen — Wärme- und Bäderanwendungen.',
        teaser: 'Rheumatoide Arthritis, Morbus Bechterew und verwandte Formen: Bewegungstherapie im Wasser, Physiotherapie und Wärmeanwendungen in ruhigen Krankheitsphasen.',
        treats: [
          'Rheumatoide Arthritis Grad I bis IV einschließlich juveniler Form, in laufender fachärztlicher Betreuung',
          'Ankylosierende Spondylitis (Morbus Bechterew) in laufender ambulanter Behandlung',
          'Andere seronegative Spondylarthritiden wie Psoriasis-Arthritis, Reiter-Syndrom und enteropathische oder reaktive Arthritis, in laufender ambulanter Behandlung',
          'Sekundäre Arthritiden in laufender ambulanter Behandlung',
        ],
        notFor: [
          'Akuter Schub mit deutlicher Gelenkschwellung, Überwärmung, Fieber oder stark erhöhten Entzündungswerten',
          'Frisch begonnene oder instabil eingestellte Basistherapie (DMARD, Biologika) ohne Rücksprache mit dem behandelnden Rheumatologen',
          'Akute Infektionskrankheiten, aktive Tumorerkrankung, Herzinsuffizienz im Stadium NYHA IV',
          'Schwangerschaft sowie Unfähigkeit zur Selbstversorgung ohne Begleitperson',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt sichtet Krankheitsverlauf, aktuelle Basistherapie und letzte Laborwerte und stellt fest, ob sich die Erkrankung in einer für die Kur geeigneten, ruhigen Phase befindet. Bringen Sie den aktuellen Rheumatologenbericht und eine vollständige Medikamentenliste mit, insbesondere zu Biologika.',
          },
          {
            heading: 'Zwei bis drei Anwendungen täglich',
            body: 'Der Vormittag gehört überwiegend passiven Anwendungen wie Elektrotherapie oder — außerhalb akuter Schübe — Wärmepackungen, der Nachmittag der angeleiteten Bewegung. Nach jeder Wärmeanwendung folgt eine Nachruhe im Liegen.',
          },
          {
            heading: 'Bewegung als zweite Säule',
            body: 'Bewegungsbad, Einzel- und Gruppentherapie sowie Ergotherapie für die kleinen Handgelenke stehen im Zentrum. Im warmen Wasser lässt sich Bewegungsumfang trainieren, der an Land wegen der Gelenkbelastung schmerzt.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body: 'Der Kurarzt prüft den Verlauf, achtet auf neu auftretende Entzündungszeichen und passt den Plan an. Zum Abschluss erhalten Sie einen Bericht für Ihren Rheumatologen und ein Übungsprogramm für zu Hause.',
          },
        ],
        procedures: [
          {
            name: 'Individuelle Physiotherapie',
            detail: 'Täglich, mit dem Ziel, die Gelenkbeweglichkeit zu erhalten, ohne die entzündeten Strukturen zu überlasten.',
          },
          {
            name: 'Bewegungstherapie im Wasser',
            detail: 'Der Auftrieb nimmt Last von den Gelenken, sodass Bewegungsumfang trainiert werden kann, der bei rheumatoider Arthritis an Land oft zu schmerzhaft ist.',
          },
          {
            name: 'Ergotherapie und Handfunktionstraining',
            detail: 'Rheumatoide Arthritis betrifft häufig zuerst die kleinen Hand- und Fingergelenke; Ergotherapie übt Gelenkschutztechniken und den Umgang mit Hilfsmitteln.',
          },
          {
            name: 'Elektrotherapie',
            detail: 'Zur Schmerzlinderung in der gelenknahen Muskulatur, nach Beschwerdebild verordnet.',
          },
          {
            name: 'Magnetfeldtherapie',
            detail: 'Bei Schmerz und Steifigkeit als ergänzende physikalische Anwendung eingesetzt.',
          },
          {
            name: 'Moorpackung',
            detail: 'Traditionelle Wärmeanwendung, die außerhalb akuter Schübe zur Muskelentspannung eingesetzt wird; die Studienlage dafür ist bei rheumatoider Arthritis schwächer als bei Morbus Bechterew, bei floriden Gelenkentzündungen wird sie ausgesetzt.',
          },
          {
            name: 'Kohlensäurebad',
            detail: 'Warmes Mineralwasserbad in stabilen Krankheitsphasen, zur Entspannung der umgebenden Muskulatur.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Bei rheumatoider Arthritis (Position VII/1), Morbus Bechterew (VII/2) und anderen seronegativen Spondylarthritiden (VII/3) trägt die tschechische Krankenkasse jeweils 28 Tage komplexe oder 21 Tage Zuschuss-Kurbehandlung, Wiederholungsaufenthalte 28 oder 21 Tage (bei Zuschuss auch 14 Tage). Selbstzahler wählen meist zwei bis drei Wochen nach Absprache mit dem Kurarzt und dem behandelnden Rheumatologen. Für die Jahreszeit gibt es keine medizinische Vorgabe; wichtiger ist, dass die Erkrankung zum Zeitpunkt der Anreise ruhig verläuft.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body: 'Für Morbus Bechterew liegt unter den entzündlich-rheumatischen Erkrankungen die beste Evidenz vor: In einer niederländischen Studie mit 120 Patienten verbesserte ein dreiwöchiger Kuraufenthalt mit Übungstherapie Funktion und Lebensqualität noch nach 40 Wochen gegenüber der Standardbehandlung (van Tubergen et al., 2002, Arthritis Rheum; offene Studie). Ein Cochrane-Review bestätigt, dass eine kombinierte Kur-Übungstherapie mit anschließender Gruppenphysiotherapie wirksamer ist als Physiotherapie allein, gestützt allerdings nur auf eine einzelne Vergleichsstudie (Dagfinrud et al., 2008, Cochrane Database Syst Rev). Für die rheumatoide Arthritis selbst liegt eine kleine türkische Crossover-Studie mit 50 Patienten unter laufender Basistherapie fand nach zwei Wochen Kur eine bis zu sechs Monate anhaltend bessere Krankheitsaktivität und Selbsteinschätzung (Karagülle M et al., 2018, Int J Biometeorol; einfach verblindet, kleine Stichprobe). Ein narrativer Übersichtsartikel fasst zusammen, dass sich die besten Ergebnisse bei axialem Befall wie Morbus Bechterew zeigen und die Anwendungen als sicher gelten (Cozzi F et al., 2018, Int J Biometeorol; niedrige Qualität der Primärstudien). Keine dieser Studien zeigt einen Einfluss auf den langfristigen Krankheitsverlauf, und keine ersetzt die Basistherapie mit DMARDs oder Biologika.',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer Befunde und in Abstimmung mit Ihrem Rheumatologen. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        ongoing: {
          heading: 'Erfahrung und laufende Forschung',
          body: 'Bewegungstherapie im Wasser, Moor und Kohlensäurebäder werden in Marienbad bei entzündlich-rheumatischen Erkrankungen seit langem verordnet, immer begleitend zur laufenden Basistherapie. Wie es dem einzelnen Gast dabei ergeht, bleibt nicht ungeprüft: Jeder Behandlungsaufenthalt beginnt mit einer Eingangs- und endet mit einer Abschlussuntersuchung samt schriftlichem Abschlussbericht, sodass der Verlauf dokumentiert ist und der Kurarzt den Plan unterwegs anpassen kann. Für die Kurmedizin als Fach entsteht derzeit erstmals seit Langem systematische Evidenz. Das Institut lázeňství a balneologie, v.v.i., die 2019 vom Karlsbader Kreis gegründete Forschungseinrichtung für Kurwesen und Balneologie, führt seit 2026 gemeinsam mit den Léčebné lázně Mariánské Lázně die erste klinische Studie dieses Formats seit dreißig Jahren durch. Sie betrifft urologische und nephrologische Diagnosen, nicht die auf dieser Seite beschriebene: Mehr als hundert Patienten werden vor und nach dem Kuraufenthalt auf Gesundheitszustand und Lebensqualität untersucht, fachlicher Garant ist prim. MUDr. Ladislav Špišák, CSc.; Ergebnisse liegen noch nicht vor. Die Studie läuft im Projekt Zentrum für Kurforschung (2024 bis 2027), das aus dem Operationellen Programm Gerechter Übergang finanziert wird und mit der Tschechischen Technischen Universität, der Westböhmischen Universität und der Akademie der Wissenschaften der Tschechischen Republik zusammenarbeitet. Was dabei herauskommen kann, zeigt die frühere Zusammenarbeit desselben Instituts mit den Marienbader Kurhäusern: Die gemeinsame Studie zur Kurrehabilitation nach COVID-19 erhielt 2021 den Innovation Award der European Spas Association in der Kategorie Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Wohin zur Kur bei Rheuma?',
            answer: 'Marienbad führt Rheuma als eigene Gruppe der tschechischen Indikationsliste (Gruppe VII) und behandelt rheumatoide Arthritis, Morbus Bechterew und verwandte Formen unter ärztlicher Aufsicht. Der Ort bietet dafür Bewegungstherapie im warmen Mineralwasser, Physiotherapie, Ergotherapie und — in ruhigen Krankheitsphasen — Wärmeanwendungen wie Moorpackungen. Voraussetzung ist eine laufende fachärztliche Betreuung und eine stabile Krankheitsphase ohne akuten Schub.',
          },
          {
            question: 'Welche Kurorte sind bei rheumatoider Arthritis geeignet?',
            answer: 'Geeignet sind Kurorte mit orthopädisch-rheumatologischer Betreuung, die rheumatoide Arthritis als offizielle Indikation führen. Marienbad erfüllt das über Position VII/1 der Indikationsliste und kombiniert Bewegungstherapie mit physikalischer Therapie. Die Basistherapie mit DMARDs oder Biologika wird während des Aufenthalts fortgeführt, nicht ersetzt.',
          },
          {
            question: 'Hilft Moor bei Rheuma?',
            answer: 'Moorpackungen werden bei Rheuma traditionell zur Muskelentspannung außerhalb akuter Schübe eingesetzt. Ein narrativer Übersichtsartikel zu entzündlich-rheumatischen Erkrankungen beschreibt die Evidenz für rheumatoide Arthritis als weniger überzeugend als für Morbus Bechterew, stuft die Anwendung aber als sicher ein. Bei geschwollenen, überwärmten Gelenken während eines Schubs wird Wärme grundsätzlich ausgesetzt.',
          },
          {
            question: 'Wie lange dauert eine Kur bei Rheuma?',
            answer: 'Nach der tschechischen Indikationsliste sind es bei rheumatoider Arthritis, Morbus Bechterew und verwandten Formen 28 Tage komplexe oder 21 Tage Zuschuss-Kurbehandlung, bei Wiederholungsaufenthalten auch 14 Tage. Selbstzahler wählen meist zwei bis drei Wochen.',
          },
          {
            question: 'Kann ich mit Biologika oder Basistherapie zur Kur fahren?',
            answer: 'Ja, sofern die Erkrankung stabil eingestellt ist und keine akute Schubphase besteht. Der Kurarzt bespricht die laufende Medikation bei der Eingangsuntersuchung und passt die Anwendungen daran an; Unterbrechungen der Basistherapie sind ohne Rücksprache mit dem behandelnden Rheumatologen nicht vorgesehen.',
          },
        ],
        sources: [
          {
            title: 'Klinische Studie zu den objektiven Wirkungen der komplexen Kurbehandlung bei urologischen und nephrologischen Diagnosen (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Laufende Studie des Instituts lázeňství a balneologie mit den Léčebné lázně Mariánské Lázně, mehr als hundert Patienten, Beginn 2026. Sie betrifft urologische und nephrologische Diagnosen; Ergebnisse liegen noch nicht vor.',
          },
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe VII — Krankheiten des Bewegungsapparats',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Positionen VII/1 (rheumatoide Arthritis), VII/2 (Morbus Bechterew) und VII/3 (andere seronegative Spondylarthritiden) mit Versorgungsart und Dauer des erstatteten Aufenthalts.',
          },
          {
            title: 'Karagülle M et al. 2018, Int J Biometeorol — Crossover-RCT, 50 Patienten mit rheumatoider Arthritis',
            url: 'https://consensus.app/papers/details/3a546f1db0215be397a42844e0a18000/',
            note: 'Zwei Wochen Kur zusätzlich zur Basistherapie: bessere Krankheitsaktivität und Selbsteinschätzung bis 6 Monate. Einfach verblindet, kleine Stichprobe.',
          },
          {
            title: 'Verhagen AP et al. 2015, Eur J Phys Rehabil Med — Cochrane-Review, 579 Patienten',
            url: 'https://pubmed.ncbi.nlm.nih.gov/26158921/',
            note: 'Evidenz reicht nicht aus, um Balneotherapie bei rheumatoider Arthritis als wirksamer als keine oder andere Behandlung zu belegen. Unklares Verzerrungsrisiko.',
          },
          {
            title: 'Cozzi F et al. 2018, Int J Biometeorol — narrativer Übersichtsartikel',
            url: 'https://consensus.app/papers/details/33fbc3c63859578092b804c4f0e12e10/',
            note: 'Beste Ergebnisse bei axialem Befall (Morbus Bechterew), weniger überzeugend bei rheumatoider Arthritis; als sicher eingestuft. Narrativ, niedrige Qualität der Primärstudien.',
          },
          {
            title: 'van Tubergen A et al. 2002, Arthritis Rheum — RCT, 120 Patienten mit ankylosierender Spondylitis',
            url: 'https://consensus.app/papers/details/0e1611a811bd5155a8737b08699663d0/',
            note: 'Dreiwöchige Kur mit Übungstherapie: bessere Funktion und Lebensqualität nach 40 Wochen gegenüber Standardbehandlung. Offene Studie.',
          },
          {
            title: 'Dagfinrud H et al. 2008, Cochrane Database Syst Rev — Cochrane-Review, 763 Patienten mit ankylosierender Spondylitis',
            url: 'https://consensus.app/papers/details/aeb377bc7dbc5e52bb1266865ef5ec15/',
            note: 'Kur-Übungstherapie mit anschließender Gruppenphysiotherapie wirksamer als Physiotherapie allein. Stützt sich nur auf eine Vergleichsstudie.',
          },
        ],
        related: [
          {
            label: 'Peloidtherapie',
            href: '/de/peloidtherapie',
          },
          {
            label: 'Moortherapie — der Naturschatz Marienbads',
            href: '/de/magazin/moortherapie-marienbad',
          },
          {
            label: 'Bewegungsapparat: Moor und Mineralwasser',
            href: '/de/magazin/bewegungsapparat-moor-mineralwasser',
          },
          {
            label: 'Indikationen und Kontraindikationen',
            href: '/de/indikationen-und-kontraindikationen',
          },
        ],
      },
      en: {
        slug: 'rheumatoid-arthritis',
        navLabel: 'Rheumatoid arthritis',
        title: 'Spa treatment for rheumatoid arthritis in Marienbad',
        h1: 'Spa treatment for rheumatoid arthritis and other rheumatic disease',
        metaTitle: 'Spa treatment for rheumatoid arthritis | Marienbad.com',
        metaDescription:
          'Rheumatoid arthritis and ankylosing spondylitis: which treatments the Marienbad cure uses for rheumatic disease, how long it lasts, and what studies show.',
        lead:
          'Rheumatoid arthritis is a chronic inflammatory joint disease that needs supporting rehabilitation alongside disease-modifying drug therapy. Marienbad has listed rheumatic disease as its own group under the Czech indication list, combining medically prescribed exercise therapy, physiotherapy and — in stable phases of the disease — heat and bathing treatments.',
        teaser: 'Rheumatoid arthritis, ankylosing spondylitis and related forms: exercise therapy in water, physiotherapy and heat treatments during calm phases of the disease.',
        treats: [
          'Rheumatoid arthritis grade I to IV, including the juvenile form, under ongoing specialist care',
          'Ankylosing spondylitis under ongoing outpatient care',
          'Other seronegative spondylarthritides such as psoriatic arthritis, reactive arthritis (Reiter’s syndrome) and enteropathic arthritis, under ongoing outpatient care',
          'Secondary arthritis under ongoing outpatient care',
        ],
        notFor: [
          'An acute flare with marked joint swelling, warmth, fever or sharply raised inflammatory markers',
          'Recently started or unstably controlled disease-modifying therapy (DMARDs, biologics) without consulting the treating rheumatologist',
          'Acute infectious disease, active cancer, or heart failure at NYHA stage IV',
          'Pregnancy, or an inability to manage personal care without a companion',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: 'The spa physician reviews the course of the disease, current disease-modifying therapy and the latest lab results, and assesses whether the disease is in a calm phase suitable for the cure. Bring your current rheumatologist’s report and a complete list of your medication, particularly any biologics.',
          },
          {
            heading: 'Two to three treatments daily',
            body: 'Mornings are mostly passive treatments such as electrotherapy or — outside acute flares — heat packs, and afternoons belong to guided movement. A rest period lying down follows every heat treatment.',
          },
          {
            heading: 'Movement as the second pillar',
            body: 'Exercise pool, individual and group therapy, and occupational therapy for the small hand joints are central. In warm water, a range of movement can be trained that hurts on dry land because of joint load.',
          },
          {
            heading: 'Weekly check-up and final report',
            body: 'The spa physician reviews progress, watches for newly appearing signs of inflammation and adjusts the plan. At the end you receive a report for your rheumatologist and a home exercise programme.',
          },
        ],
        procedures: [
          {
            name: 'Individual physiotherapy',
            detail: 'Daily, with the aim of maintaining joint mobility without overloading the inflamed structures.',
          },
          {
            name: 'Exercise therapy in water',
            detail: 'Buoyancy takes load off the joints, so a range of movement can be trained that is often too painful on dry land in rheumatoid arthritis.',
          },
          {
            name: 'Occupational therapy and hand function training',
            detail: 'Rheumatoid arthritis often affects the small hand and finger joints first; occupational therapy practises joint-protection techniques and the use of aids.',
          },
          {
            name: 'Electrotherapy',
            detail: 'For pain relief in the muscles around the joint, prescribed according to the complaint.',
          },
          {
            name: 'Magnetic field therapy',
            detail: 'Used as a supplementary physical treatment for pain and stiffness.',
          },
          {
            name: 'Peat pack',
            detail: 'A traditional heat treatment used for muscle relaxation outside acute flares; the evidence for it is weaker in rheumatoid arthritis than in ankylosing spondylitis, and it is suspended during active joint inflammation.',
          },
          {
            name: 'Carbon dioxide bath',
            detail: 'A warm mineral-water bath during stable phases of the disease, to relax the surrounding muscles.',
          },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'For rheumatoid arthritis (position VII/1), ankylosing spondylitis (VII/2) and other seronegative spondylarthritides (VII/3), stays covered by Czech public health insurance run to 28 days of comprehensive or 21 days of contributory spa care, with repeat stays of 28 or 21 days (or 14 days with contributory care). Self-paying guests usually choose two to three weeks in consultation with the spa physician and the treating rheumatologist. There is no medical rule for the season; what matters more is that the disease is calm at the time of arrival.',
        },
        evidence: {
          heading: 'What the studies show',
          body: 'Among inflammatory rheumatic diseases, the best evidence is for ankylosing spondylitis: in a Dutch study of 120 patients, a three-week spa stay with exercise therapy improved function and quality of life, still evident at 40 weeks compared with standard treatment (van Tubergen et al., 2002, Arthritis Rheum; open-label study). A Cochrane review confirms that combined spa exercise therapy followed by group physiotherapy is more effective than physiotherapy alone, though this rests on only a single comparative study (Dagfinrud et al., 2008, Cochrane Database Syst Rev). For rheumatoid arthritis itself, a small Turkish crossover study of 50 patients on ongoing disease-modifying therapy found better disease activity and self-assessment lasting up to six months after a two-week cure (Karagülle M et al., 2018, Int J Biometeorol; single-blind, small sample). A narrative review sums up that the best results appear with axial involvement such as ankylosing spondylitis and that the treatments are considered safe (Cozzi F et al., 2018, Int J Biometeorol; low quality of the primary studies). None of these studies shows an effect on the long-term course of the disease, and none replaces disease-modifying therapy with DMARDs or biologics.',
        },
        physicianNote: 'Whether and to what extent a spa cure is right for you is decided by the spa physician at the initial examination, based on your findings and in consultation with your rheumatologist. This page provides information and does not replace medical advice.',
        ongoing: {
          heading: 'Experience and research under way',
          body: 'Exercise therapy in water, peat and carbonated baths have long been prescribed in Marienbad for inflammatory rheumatic disease, always alongside ongoing disease-modifying therapy. How the individual guest fares is not left unchecked: every treatment stay begins with an initial and ends with a final medical examination and a written final report, so the course is documented and the spa physician can adjust the plan along the way. Systematic evidence for spa medicine as a field is being built for the first time in a long while. The Institute of Spa Medicine and Balneology (Institut lázeňství a balneologie, v.v.i.), founded by the Karlovy Vary Region in 2019, has been running the first clinical study of this format in thirty years since 2026, together with Léčebné lázně Mariánské Lázně. It covers urological and nephrological diagnoses rather than the one described on this page: more than a hundred patients are examined before and after the spa stay for health status and quality of life, with prim. MUDr. Ladislav Špišák, CSc. as professional guarantor, and results are not yet available. The study runs within the Spa Research Centre project (2024 to 2027), funded by the Just Transition Operational Programme and working with the Czech Technical University, the University of West Bohemia and the Czech Academy of Sciences. What such work can produce is shown by the same institute’s earlier collaboration with the Marienbad spa houses: their joint study of spa rehabilitation after COVID-19 received the European Spas Association Innovation Award in 2021 in the Medical Spa Scientific Research category.',
        },
        faqs: [
          {
            question: 'Where should I go for spa treatment for rheumatic disease?',
            answer: 'Marienbad lists rheumatic disease as its own group on the Czech indication list (Group VII) and treats rheumatoid arthritis, ankylosing spondylitis and related forms under medical supervision. The town offers exercise therapy in warm mineral water, physiotherapy, occupational therapy and — during calm phases of the disease — heat treatments such as peat packs. The requirement is ongoing specialist care and a stable phase of the disease without an acute flare.',
          },
          {
            question: 'Which spa resorts help with arthritis?',
            answer: 'Suitable resorts are those with orthopaedic-rheumatological care that list rheumatoid arthritis as an official indication. Marienbad meets this through position VII/1 of the indication list and combines exercise therapy with physical therapy. Disease-modifying therapy with DMARDs or biologics continues during the stay; it is not replaced by it.',
          },
          {
            question: 'Does peat help with rheumatic disease?',
            answer: 'Peat packs are traditionally used in rheumatic disease for muscle relaxation outside acute flares. A narrative review of inflammatory rheumatic disease describes the evidence for rheumatoid arthritis as less convincing than for ankylosing spondylitis, but rates the treatment as safe. Heat is generally avoided on swollen, warm joints during a flare.',
          },
          {
            question: 'How long does a spa cure for rheumatic disease last?',
            answer: 'Under the Czech indication list, rheumatoid arthritis, ankylosing spondylitis and related forms run to 28 days of comprehensive or 21 days of contributory spa care, with 14 days also possible on repeat stays. Self-paying guests usually choose two to three weeks.',
          },
          {
            question: 'Can I go for a spa cure while on biologics or disease-modifying therapy?',
            answer: 'Yes, provided the disease is stably controlled and there is no acute flare. The spa physician discusses your current medication at the initial examination and adapts the treatments to it; interrupting disease-modifying therapy without consulting your treating rheumatologist is not part of the plan.',
          },
        ],
        sources: [
          {
            title: 'Clinical study of the objective effects of comprehensive spa care in kidney and urological conditions (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Ongoing study by the Institute of Spa Medicine and Balneology with Léčebné lázně Mariánské Lázně, more than a hundred patients, started 2026. It covers urological and nephrological diagnoses; results are not yet available.',
          },
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group VII — diseases of the musculoskeletal system',
            url: '/en/indications-and-contraindications',
            note: 'Positions VII/1 (rheumatoid arthritis), VII/2 (ankylosing spondylitis) and VII/3 (other seronegative spondylarthritides), with type of care and length of the covered stay.',
          },
          {
            title: 'Karagülle M et al. 2018, Int J Biometeorol — crossover RCT, 50 patients with rheumatoid arthritis',
            url: 'https://consensus.app/papers/details/3a546f1db0215be397a42844e0a18000/',
            note: 'Two-week cure alongside disease-modifying therapy: better disease activity and self-assessment up to 6 months. Single-blind, small sample.',
          },
          {
            title: 'Verhagen AP et al. 2015, Eur J Phys Rehabil Med — Cochrane review, 579 patients',
            url: 'https://pubmed.ncbi.nlm.nih.gov/26158921/',
            note: 'Evidence is not sufficient to show balneotherapy is more effective than no treatment or another treatment in rheumatoid arthritis. Unclear risk of bias.',
          },
          {
            title: 'Cozzi F et al. 2018, Int J Biometeorol — narrative review',
            url: 'https://consensus.app/papers/details/33fbc3c63859578092b804c4f0e12e10/',
            note: 'Best results with axial involvement (ankylosing spondylitis), less convincing for rheumatoid arthritis; rated as safe. Narrative, low quality of primary studies.',
          },
          {
            title: 'van Tubergen A et al. 2002, Arthritis Rheum — RCT, 120 patients with ankylosing spondylitis',
            url: 'https://consensus.app/papers/details/0e1611a811bd5155a8737b08699663d0/',
            note: 'Three-week cure with exercise therapy: better function and quality of life at 40 weeks compared with standard treatment. Open-label study.',
          },
          {
            title: 'Dagfinrud H et al. 2008, Cochrane Database Syst Rev — Cochrane review, 763 patients with ankylosing spondylitis',
            url: 'https://consensus.app/papers/details/aeb377bc7dbc5e52bb1266865ef5ec15/',
            note: 'Spa exercise therapy followed by group physiotherapy more effective than physiotherapy alone. Rests on only one comparative study.',
          },
        ],
        related: [
          {
            label: 'Peat therapy',
            href: '/en/peloid-therapy',
          },
          {
            label: 'Peat therapy — Marienbad’s natural treasure',
            href: '/en/magazine/peat-mud-therapy-marienbad',
          },
          {
            label: 'Musculoskeletal treatment: peat and mineral water',
            href: '/en/magazine/musculoskeletal-treatment-peat-mineral',
          },
          {
            label: 'Indications and contraindications',
            href: '/en/indications-and-contraindications',
          },
        ],
      },
      cs: {
        slug: 'revmatoidni-artritida',
        navLabel: 'Revma',
        title: 'Lázeňská léčba revmatu v Mariánských Lázních',
        h1: 'Lázeňská léčba revmatoidní artritidy a revmatu',
        metaTitle: 'Léčba revmatu v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Revmatoidní artritida a Bechtěrevova nemoc: jaké procedury lázeňská léčba v Mariánských Lázních při revmatu nabízí, jak dlouho trvá a co ukazují studie.',
        lead: 'Revmatoidní artritida je chronické zánětlivé kloubní onemocnění, které vedle základní medikamentózní léčby potřebuje doprovodnou rehabilitaci. Mariánské Lázně vedou revma jako samostatnou skupinu indikačního seznamu a kombinují pro ni lékařem předepsanou pohybovou terapii, fyzioterapii a — ve stabilních fázích nemoci — tepelné a koupelové procedury.',
        teaser: 'Revmatoidní artritida, Bechtěrevova nemoc a příbuzné formy: pohybová terapie ve vodě, fyzioterapie a tepelné procedury v klidných fázích nemoci.',
        treats: [
          'Revmatoidní artritida stupně I až IV včetně juvenilní formy, v průběžné odborné péči',
          'Ankylozující spondylitida (Bechtěrevova nemoc) v průběžné ambulantní léčbě',
          'Další seronegativní spondylartritidy jako psoriatická artritida, Reiterův syndrom a enteropatická nebo reaktivní artritida, v průběžné ambulantní léčbě',
          'Sekundární artritidy v průběžné ambulantní léčbě',
        ],
        notFor: [
          'Akutní ataka s výrazným otokem kloubu, přehřátím, horečkou nebo silně zvýšenými zánětlivými parametry',
          'Nedávno zahájená nebo nestabilně nastavená základní léčba (DMARD, biologika) bez konzultace s ošetřujícím revmatologem',
          'Akutní infekční onemocnění, aktivní nádorové onemocnění, srdeční selhání ve stadiu NYHA IV',
          'Těhotenství a neschopnost sebeobsluhy bez doprovodu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde průběh nemoci, aktuální základní léčbu a poslední laboratorní výsledky a zjistí, zda se onemocnění nachází v klidné fázi vhodné pro lázeňský pobyt. Vezměte si aktuální zprávu revmatologa a úplný seznam léků, zejména biologik.',
          },
          {
            heading: 'Dvě až tři procedury denně',
            body: 'Dopoledne patří převážně pasivním procedurám jako elektroléčba nebo — mimo akutní ataky — tepelné zábaly, odpoledne vedenému pohybu. Po každé tepelné proceduře následuje klid vleže.',
          },
          {
            heading: 'Pohyb jako druhý pilíř',
            body: 'V centru je pohybový bazén, individuální a skupinová terapie i ergoterapie pro drobné klouby rukou. V teplé vodě lze trénovat rozsah pohybu, který na suchu kvůli zátěži kloubu bolí.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Lázeňský lékař kontroluje průběh, sleduje nově vzniklé známky zánětu a upravuje plán. Na závěr dostanete zprávu pro svého revmatologa a cvičební program domů.',
          },
        ],
        procedures: [
          {
            name: 'Individuální fyzioterapie',
            detail: 'Denně, s cílem udržet pohyblivost kloubu, aniž by se přetěžovaly zanícené struktury.',
          },
          {
            name: 'Pohybová terapie ve vodě',
            detail: 'Vztlak snímá zátěž z kloubů, takže lze trénovat rozsah pohybu, který u revmatoidní artritidy na suchu bývá příliš bolestivý.',
          },
          {
            name: 'Ergoterapie a trénink funkce ruky',
            detail: 'Revmatoidní artritida často postihuje nejprve drobné klouby ruky a prstů; ergoterapie nacvičuje techniky šetrné ke kloubům a práci s pomůckami.',
          },
          {
            name: 'Elektroléčba',
            detail: 'Ke zmírnění bolesti ve svalstvu kolem kloubu, předepisovaná podle nálezu.',
          },
          {
            name: 'Magnetoterapie',
            detail: 'Doplňková fyzikální procedura při bolesti a ztuhlosti.',
          },
          {
            name: 'Slatinný zábal',
            detail: 'Tradiční tepelná procedura používaná mimo akutní ataky k uvolnění svalů; u revmatoidní artritidy je studijní podklad slabší než u Bechtěrevovy nemoci, při akutním zánětu kloubu se vysazuje.',
          },
          {
            name: 'Uhličitá koupel',
            detail: 'Teplá minerální koupel ve stabilních fázích nemoci, k uvolnění okolního svalstva.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Revmatoidní artritida (položka VII/1), Bechtěrevova nemoc (VII/2) a další seronegativní spondylartritidy (VII/3) mají hrazenou délku pobytu podle indikačního seznamu; přesný rozpis najdete na stránce Co hradí pojišťovna u pohybového ústrojí. Samoplátci volí obvykle dva až tři týdny po dohodě s lázeňským lékařem a ošetřujícím revmatologem. Pro roční období neexistuje lékařský předpis; důležitější je, aby nemoc při nástupu probíhala klidně.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'Pro Bechtěrevovu nemoc existuje mezi zánětlivě-revmatickými onemocněními nejlepší evidence: v nizozemské studii se 120 pacienty zlepšil třítýdenní lázeňský pobyt s cvičební terapií funkci a kvalitu života ještě po 40 týdnech oproti standardní léčbě (van Tubergen a kol., 2002, Arthritis Rheum; otevřená studie). Cochranův přehled potvrzuje, že kombinovaná lázeňská cvičební terapie s navazující skupinovou fyzioterapií je účinnější než samotná fyzioterapie, opírá se ale jen o jednu srovnávací studii (Dagfinrud a kol., 2008, Cochrane Database Syst Rev). U samotné revmatoidní artritidy zjistila malá turecká zkřížená studie s 50 pacienty na průběžné základní léčbě po dvou týdnech lázeňské léčby až šest měsíců přetrvávající lepší aktivitu nemoci a sebehodnocení (Karagülle M a kol., 2018, Int J Biometeorol; jednoduše zaslepená, malý vzorek). Narativní přehledový článek shrnuje, že nejlepší výsledky se ukazují u axiálního postižení, jako je Bechtěrevova nemoc, a že se procedury považují za bezpečné (Cozzi F a kol., 2018, Int J Biometeorol; nízká kvalita primárních studií). Žádná z těchto studií neukazuje vliv na dlouhodobý průběh nemoci a žádná nenahrazuje základní léčbu DMARDy nebo biologiky.',
        },
        physicianNote: 'O tom, zda a v jakém rozsahu pro vás lázeňská léčba připadá v úvahu, rozhoduje lázeňský lékař při vstupní prohlídce podle vašich nálezů a v součinnosti s vaším revmatologem. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        ongoing: {
          heading: 'Zkušenost a probíhající výzkum',
          body: 'Pohybová terapie ve vodě, slatina a uhličité koupele se v Mariánských Lázních u zánětlivých revmatických onemocnění předepisují dlouho, vždy souběžně s probíhající základní léčbou. Jak na tom jednotlivý host je, se nenechává bez kontroly: každý léčebný pobyt začíná vstupní a končí výstupní lékařskou prohlídkou a závěrečnou zprávou, takže je průběh doložený a lázeňský lékař může plán během pobytu upravit. Pro lázeňskou medicínu jako obor vzniká poprvé po dlouhé době systematická evidence. Institut lázeňství a balneologie, v.v.i., který Karlovarský kraj založil v roce 2019, vede od roku 2026 spolu s Léčebnými lázněmi Mariánské Lázně první klinickou studii tohoto formátu po třiceti letech. Týká se urologických a nefrologických diagnóz, ne té popsané na této stránce: více než sto pacientů se vyšetřuje před lázeňskou léčbou a po ní na ukazatele zdravotního stavu a kvality života, odborným garantem je prim. MUDr. Ladislav Špišák, CSc., a výsledky zatím nejsou k dispozici. Studie běží v projektu Centrum lázeňského výzkumu (2024 až 2027), financovaném z Operačního programu Spravedlivá transformace a spolupracujícím s ČVUT, Západočeskou univerzitou a Akademií věd ČR. Co z takové práce může vzejít, ukazuje dřívější spolupráce téhož institutu s mariánskolázeňskými lázeňskými domy: jejich společná studie lázeňské rehabilitace po covidu-19 získala v roce 2021 Innovation Award Evropského svazu lázní v kategorii Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Kam na lázně při revmatu?',
            answer: 'Mariánské Lázně vedou revma jako samostatnou skupinu indikačního seznamu (skupina VII) a léčí revmatoidní artritidu, Bechtěrevovu nemoc i příbuzné formy pod lékařským dohledem. Místo nabízí pohybovou terapii v teplé minerální vodě, fyzioterapii, ergoterapii a — v klidných fázích nemoci — tepelné procedury jako slatinné zábaly. Podmínkou je průběžná odborná péče a stabilní fáze nemoci bez akutní ataky.',
          },
          {
            question: 'Které lázně jsou vhodné při revmatoidní artritidě?',
            answer: 'Vhodné jsou lázně s ortopedicko-revmatologickou péčí, které vedou revmatoidní artritidu jako oficiální indikaci. Mariánské Lázně to splňují přes položku VII/1 indikačního seznamu a kombinují pohybovou terapii s fyzikální terapií. Základní léčba DMARDy nebo biologiky během pobytu pokračuje, nenahrazuje se.',
          },
          {
            question: 'Pomáhá slatina při revmatu?',
            answer: 'Slatinné zábaly se u revmatu tradičně používají k uvolnění svalů mimo akutní ataky. Narativní přehledový článek k zánětlivě-revmatickým onemocněním popisuje evidenci pro revmatoidní artritidu jako méně přesvědčivou než pro Bechtěrevovu nemoc, proceduru ale hodnotí jako bezpečnou. Při oteklých, přehřátých kloubech během ataky se teplo zásadně vysazuje.',
          },
          {
            question: 'Jak dlouho trvá lázeňský pobyt při revmatu?',
            answer: 'Podle indikačního seznamu jde u revmatoidní artritidy, Bechtěrevovy nemoci a příbuzných forem o délku pobytu, kterou konkrétně rozepisuje stránka Co hradí pojišťovna u pohybového ústrojí. Samoplátci volí obvykle dva až tři týdny.',
          },
          {
            question: 'Mohu jet do lázní s biologiky nebo základní léčbou?',
            answer: 'Ano, pokud je nemoc stabilně nastavená a nejde o akutní ataku. Lázeňský lékař probere aktuální medikaci při vstupní prohlídce a přizpůsobí jí procedury; přerušení základní léčby bez konzultace s ošetřujícím revmatologem se nepředpokládá.',
          },
        ],
        sources: [
          {
            title: 'Klinická studie objektivních účinků komplexní lázeňské péče u urologických a nefrologických diagnóz (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Probíhající studie Institutu lázeňství a balneologie s Léčebnými lázněmi Mariánské Lázně, více než sto pacientů, zahájena 2026. Týká se urologických a nefrologických diagnóz; výsledky zatím nejsou k dispozici.',
          },
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina VII — nemoci pohybového ústrojí',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Položky VII/1 (revmatoidní artritida), VII/2 (Bechtěrevova nemoc) a VII/3 (další seronegativní spondylartritidy) s typem péče a délkou hrazeného pobytu.',
          },
          {
            title: 'Karagülle M a kol. 2018, Int J Biometeorol — zkřížená RCT, 50 pacientů s revmatoidní artritidou',
            url: 'https://consensus.app/papers/details/3a546f1db0215be397a42844e0a18000/',
            note: 'Dva týdny lázeňské léčby navíc k základní léčbě: lepší aktivita nemoci a sebehodnocení do 6 měsíců. Jednoduše zaslepená, malý vzorek.',
          },
          {
            title: 'Verhagen AP a kol. 2015, Eur J Phys Rehabil Med — Cochranův přehled, 579 pacientů',
            url: 'https://pubmed.ncbi.nlm.nih.gov/26158921/',
            note: 'Evidence nestačí k prokázání, že je balneoterapie u revmatoidní artritidy účinnější než žádná nebo jiná léčba. Nejasné riziko zkreslení.',
          },
          {
            title: 'Cozzi F a kol. 2018, Int J Biometeorol — narativní přehledový článek',
            url: 'https://consensus.app/papers/details/33fbc3c63859578092b804c4f0e12e10/',
            note: 'Nejlepší výsledky u axiálního postižení (Bechtěrevova nemoc), méně přesvědčivé u revmatoidní artritidy; hodnoceno jako bezpečné. Narativní, nízká kvalita primárních studií.',
          },
          {
            title: 'van Tubergen A a kol. 2002, Arthritis Rheum — RCT, 120 pacientů s ankylozující spondylitidou',
            url: 'https://consensus.app/papers/details/0e1611a811bd5155a8737b08699663d0/',
            note: 'Třítýdenní lázeňský pobyt s cvičební terapií: lepší funkce a kvalita života po 40 týdnech oproti standardní léčbě. Otevřená studie.',
          },
          {
            title: 'Dagfinrud H a kol. 2008, Cochrane Database Syst Rev — Cochranův přehled, 763 pacientů s ankylozující spondylitidou',
            url: 'https://consensus.app/papers/details/aeb377bc7dbc5e52bb1266865ef5ec15/',
            note: 'Lázeňská cvičební terapie s navazující skupinovou fyzioterapií účinnější než samotná fyzioterapie. Opírá se jen o jednu srovnávací studii.',
          },
        ],
        related: [
          {
            label: 'Peloidní terapie',
            href: '/cs/peloidni-terapie',
          },
          {
            label: 'Léčba rašelinou v Mariánských Lázních',
            href: '/cs/magazin/lecba-raselinou-marianske-lazne',
          },
          {
            label: 'Léčba pohybového aparátu slatinou a minerální vodou',
            href: '/cs/magazin/lecba-pohyboveho-aparatu',
          },
          {
            label: 'Co hradí pojišťovna u pohybového ústrojí',
            href: '/cs/lazne-s-pojistovnou/indikace/pohybove-ustroji',
          },
        ],
      },
      ru: {
        slug: 'revmatoidnyj-artrit',
        navLabel: 'Ревматизм',
        title: 'Курортное лечение ревматизма в Марианских Лазнях',
        h1: 'Курортное лечение ревматоидного артрита и ревматизма',
        metaTitle: 'Лечение ревматизма в Марианских Лазнях | Marienbad.com',
        metaDescription: 'Ревматоидный артрит и болезнь Бехтерева: какие процедуры применяются в Марианских Лазнях при ревматизме, сколько длится лечение и что показывают исследования.',
        lead: 'Ревматоидный артрит — хроническое воспалительное заболевание суставов, при котором наряду с медикаментозной базисной терапией нужна сопутствующая реабилитация. В Марианских Лазнях ревматизм выделен в чешском индикационном списке как отдельная группа; для его лечения сочетают назначенную врачом двигательную терапию, физиотерапию и — в стабильные периоды болезни — тепловые и водные процедуры.',
        teaser: 'Ревматоидный артрит, болезнь Бехтерева и родственные формы: двигательная терапия в воде, физиотерапия и тепловые процедуры в спокойные периоды заболевания.',
        treats: [
          'Ревматоидный артрит I–IV степени, включая ювенильную форму, под постоянным наблюдением профильного врача',
          'Анкилозирующий спондилит (болезнь Бехтерева) в постоянном амбулаторном лечении',
          'Другие серонегативные спондилоартриты, такие как псориатический артрит, синдром Рейтера, энтеропатический и реактивный артрит, в постоянном амбулаторном лечении',
          'Вторичные артриты в постоянном амбулаторном лечении',
        ],
        notFor: [
          'Острое обострение с выраженным отёком сустава, повышением местной температуры, лихорадкой или сильно повышенными показателями воспаления',
          'Недавно начатая или нестабильно подобранная базисная терапия (БПВП, биологические препараты) без согласования с лечащим ревматологом',
          'Острые инфекционные заболевания, активное онкологическое заболевание, сердечная недостаточность стадии NYHA IV',
          'Беременность, а также неспособность к самообслуживанию без сопровождающего лица',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает течение болезни, текущую базисную терапию и последние лабораторные показатели и определяет, находится ли заболевание в стабильной фазе, подходящей для курортного лечения. Возьмите с собой актуальное заключение ревматолога и полный список лекарств, особенно биологических препаратов.',
          },
          {
            heading: 'Две-три процедуры в день',
            body: 'Первая половина дня отведена преимущественно пассивным процедурам, таким как электротерапия или — вне острых обострений — тепловые обёртывания, вторая половина дня — направляемому движению. После каждой тепловой процедуры следует отдых лёжа.',
          },
          {
            heading: 'Движение как вторая опора',
            body: 'В центре внимания — лечебный бассейн, индивидуальная и групповая терапия, а также эрготерапия для мелких суставов кисти. В тёплой воде можно тренировать объём движений, который на суше болезненен из-за нагрузки на суставы.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Курортный врач проверяет динамику, следит за появлением новых признаков воспаления и корректирует план. По окончании вы получаете заключение для вашего ревматолога и программу упражнений на дом.',
          },
        ],
        procedures: [
          {
            name: 'Индивидуальная физиотерапия',
            detail: 'Ежедневно, с целью сохранить подвижность суставов, не перегружая воспалённые структуры.',
          },
          {
            name: 'Двигательная терапия в воде',
            detail: 'Выталкивающая сила воды снимает нагрузку с суставов, поэтому можно тренировать объём движений, который при ревматоидном артрите на суше часто слишком болезнен.',
          },
          {
            name: 'Эрготерапия и тренировка функции кисти',
            detail: 'Ревматоидный артрит часто в первую очередь поражает мелкие суставы кисти и пальцев; эрготерапия обучает приёмам защиты суставов и работе со вспомогательными средствами.',
          },
          {
            name: 'Электротерапия',
            detail: 'Для облегчения боли в мышцах вокруг суставов, назначается по показаниям.',
          },
          {
            name: 'Магнитотерапия',
            detail: 'Применяется как дополнительная физиотерапевтическая процедура при боли и скованности.',
          },
          {
            name: 'Торфяное обёртывание',
            detail: 'Традиционная тепловая процедура для расслабления мышц вне острых обострений; данные исследований по ней при ревматоидном артрите слабее, чем при болезни Бехтерева, при активном воспалении суставов её приостанавливают.',
          },
          {
            name: 'Углекислая ванна',
            detail: 'Тёплая ванна в минеральной воде в стабильные периоды заболевания, для расслабления окружающих мышц.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'При ревматоидном артрите (позиция VII/1), болезни Бехтерева (VII/2) и других серонегативных спондилоартритах (VII/3) для пребываний, оплачиваемых чешской страховой, предусмотрено по 28 дней комплексного или 21 день долевого курортного лечения, повторные пребывания — 28 или 21 день (при долевом финансировании также 14 дней). Гости, оплачивающие лечение самостоятельно, обычно выбирают две-три недели по согласованию с курортным врачом и лечащим ревматологом. Для времени года медицинских рекомендаций нет; важнее, чтобы на момент заезда заболевание протекало спокойно.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'Среди воспалительно-ревматических заболеваний лучше всего доказательная база представлена для болезни Бехтерева: в нидерландском исследовании со 120 пациентами трёхнедельное курортное лечение с двигательной терапией улучшило функцию и качество жизни ещё через 40 недель по сравнению со стандартным лечением (van Tubergen et al., 2002, Arthritis Rheum; открытое исследование). Кокрейновский обзор подтверждает, что сочетание курортной и двигательной терапии с последующей групповой физиотерапией эффективнее одной физиотерапии, хотя опирается лишь на одно сравнительное исследование (Dagfinrud et al., 2008, Cochrane Database Syst Rev). При самом ревматоидном артрите небольшое турецкое перекрёстное исследование с 50 пациентами на фоне базисной терапии обнаружило после двух недель лечения улучшение активности болезни и самооценки, сохранявшееся до шести месяцев (Karagülle M et al., 2018, Int J Biometeorol; одинарное ослепление, маленькая выборка). Нарративный обзор подводит итог: лучшие результаты наблюдаются при осевом поражении, как при болезни Бехтерева, а сами процедуры считаются безопасными (Cozzi F et al., 2018, Int J Biometeorol; низкое качество первичных исследований). Ни одно из этих исследований не показывает влияния на долгосрочное течение болезни, и ни одно не заменяет базисную терапию БПВП или биологическими препаратами.',
        },
        physicianNote: 'Показано ли вам курортное лечение и в каком объёме, решает курортный врач при первичном осмотре на основании ваших заключений и по согласованию с вашим ревматологом. Эта страница носит информационный характер и не заменяет консультацию врача.',
        ongoing: {
          heading: 'Опыт и текущие исследования',
          body: 'Двигательная терапия в воде, торф и углекислые ванны назначаются в Марианских Лазнях при воспалительных ревматических заболеваниях давно, всегда параллельно с продолжающейся базисной терапией. Как идут дела у конкретного гостя, не остаётся без проверки: каждое лечебное пребывание начинается с первичного и заканчивается выходным врачебным осмотром и письменным заключением, поэтому течение задокументировано, а курортный врач может по ходу скорректировать план. Для курортной медицины как отрасли впервые за долгое время создаётся систематическая доказательная база. Институт курортного дела и бальнеологии (Institut lázeňství a balneologie, v.v.i.), основанный Карловарским краем в 2019 году, с 2026 года вместе с «Léčebné lázně Mariánské Lázně» проводит первое клиническое исследование такого формата за тридцать лет. Оно касается урологических и нефрологических диагнозов, а не того, который описан на этой странице: более ста пациентов обследуют до курортного лечения и после него по показателям состояния здоровья и качества жизни, научный гарант — prim. MUDr. Ladislav Špišák, CSc., результатов пока нет. Исследование идёт в рамках проекта «Центр курортных исследований» (2024–2027), финансируемого Операционной программой справедливой трансформации, с участием Чешского технического университета, Западночешского университета и Академии наук Чехии. Что даёт такая работа, показывает более раннее сотрудничество того же института с курортными домами Марианских Лазней: их совместное исследование курортной реабилитации после COVID-19 получило в 2021 году Innovation Award Европейского союза курортов в категории Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Куда ехать лечить ревматизм?',
            answer: 'В Марианских Лазнях ревматизм выделен как отдельная группа чешского индикационного списка (группа VII), и здесь под врачебным наблюдением лечат ревматоидный артрит, болезнь Бехтерева и родственные формы. Курорт предлагает для этого двигательную терапию в тёплой минеральной воде, физиотерапию, эрготерапию и — в спокойные периоды болезни — тепловые процедуры вроде торфяных обёртываний. Условие — постоянное наблюдение профильного врача и стабильная фаза болезни без острого обострения.',
          },
          {
            question: 'Какие курорты подходят при ревматоидном артрите?',
            answer: 'Подходят курорты с ортопедо-ревматологическим наблюдением, где ревматоидный артрит указан как официальное показание. Марианские Лазни отвечают этому через позицию VII/1 индикационного списка и сочетают двигательную терапию с физиотерапией. Базисная терапия БПВП или биологическими препаратами во время пребывания продолжается, а не заменяется.',
          },
          {
            question: 'Помогает ли торф при ревматизме?',
            answer: 'Торфяные обёртывания при ревматизме традиционно применяются для расслабления мышц вне острых обострений. Нарративный обзор по воспалительно-ревматическим заболеваниям описывает доказательства для ревматоидного артрита как менее убедительные, чем для болезни Бехтерева, но оценивает процедуру как безопасную. При отёчных, горячих суставах во время обострения тепло, как правило, не применяют.',
          },
          {
            question: 'Сколько длится курортное лечение при ревматизме?',
            answer: 'По чешскому индикационному списку при ревматоидном артрите, болезни Бехтерева и родственных формах это 28 дней комплексного или 21 день долевого курортного лечения, при повторных пребываниях также 14 дней. Гости, оплачивающие лечение самостоятельно, обычно выбирают две-три недели.',
          },
          {
            question: 'Можно ли ехать на лечение, принимая биологические препараты или базисную терапию?',
            answer: 'Да, если заболевание стабильно и нет острого обострения. Курортный врач обсуждает текущую медикаментозную терапию при первичном осмотре и подстраивает под неё процедуры; прерывание базисной терапии без согласования с лечащим ревматологом не предусмотрено.',
          },
        ],
        sources: [
          {
            title: 'Клиническое исследование объективных эффектов комплексного курортного лечения при урологических и нефрологических диагнозах (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Продолжающееся исследование Института курортного дела и бальнеологии вместе с «Léčebné lázně Mariánské Lázně», более ста пациентов, начато в 2026 году. Касается урологических и нефрологических диагнозов; результатов пока нет.',
          },
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа VII — заболевания опорно-двигательного аппарата',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Позиции VII/1 (ревматоидный артрит), VII/2 (болезнь Бехтерева) и VII/3 (другие серонегативные спондилоартриты) с видом и длительностью оплачиваемого пребывания.',
          },
          {
            title: 'Karagülle M et al. 2018, Int J Biometeorol — перекрёстное РКИ, 50 пациентов с ревматоидным артритом',
            url: 'https://consensus.app/papers/details/3a546f1db0215be397a42844e0a18000/',
            note: 'Две недели лечения дополнительно к базисной терапии: лучше активность болезни и самооценка до 6 месяцев. Одинарное ослепление, маленькая выборка.',
          },
          {
            title: 'Verhagen AP et al. 2015, Eur J Phys Rehabil Med — Кокрейновский обзор, 579 пациентов',
            url: 'https://pubmed.ncbi.nlm.nih.gov/26158921/',
            note: 'Доказательств недостаточно, чтобы подтвердить, что бальнеотерапия при ревматоидном артрите эффективнее отсутствия лечения или другого лечения. Неясный риск систематической ошибки.',
          },
          {
            title: 'Cozzi F et al. 2018, Int J Biometeorol — нарративный обзор',
            url: 'https://consensus.app/papers/details/33fbc3c63859578092b804c4f0e12e10/',
            note: 'Лучшие результаты при осевом поражении (болезнь Бехтерева), менее убедительные при ревматоидном артрите; оценка как безопасной процедуры. Нарративный обзор, низкое качество первичных исследований.',
          },
          {
            title: 'van Tubergen A et al. 2002, Arthritis Rheum — РКИ, 120 пациентов с анкилозирующим спондилитом',
            url: 'https://consensus.app/papers/details/0e1611a811bd5155a8737b08699663d0/',
            note: 'Трёхнедельное курортное лечение с двигательной терапией: лучше функция и качество жизни через 40 недель по сравнению со стандартным лечением. Открытое исследование.',
          },
          {
            title: 'Dagfinrud H et al. 2008, Cochrane Database Syst Rev — Кокрейновский обзор, 763 пациента с анкилозирующим спондилитом',
            url: 'https://consensus.app/papers/details/aeb377bc7dbc5e52bb1266865ef5ec15/',
            note: 'Курортная и двигательная терапия с последующей групповой физиотерапией эффективнее одной физиотерапии. Опирается только на одно сравнительное исследование.',
          },
        ],
        related: [
          {
            label: 'Торфолечение',
            href: '/ru/peloidnaya-terapiya',
          },
          {
            label: 'Торфяная терапия — природное сокровище Марианских Лазней',
            href: '/ru/zhurnal/torfyanaya-terapiya-marianskie-lazne',
          },
          {
            label: 'Опорно-двигательный аппарат: торф и минеральная вода',
            href: '/ru/zhurnal/lechenie-oporno-dvigatelnogo-apparata',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'psoriasis',
    groupId: 'skin',
    roman: 'X',
    codes: [
      'X/2',
    ],
    conditionName: 'Psoriasis',
    icd10: 'L40',
    image: '/images/library/mineral-bath/mineral-bath-hand-water-detail.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Nahaufnahme einer Hand, die die Wasseroberfläche eines Mineralbads berührt',
      en: 'Close-up of a hand touching the water surface of a mineral bath',
      cs: 'Detail ruky dotýkající se hladiny minerální koupele',
      ru: 'Крупный план руки, касающейся поверхности воды в минеральной ванне',
    },
    content: {
      de: {
        slug: 'psoriasis',
        navLabel: 'Psoriasis',
        title: 'Kur bei Psoriasis in Marienbad',
        h1: 'Kur bei Psoriasis',
        metaTitle: 'Kur bei Psoriasis in Marienbad — Bäder und Dauer | Marienbad.com',
        metaDescription: 'Psoriasis vulgaris in Marienbad: welche Mineralbäder, Fototherapie und Klimatherapie die Kur einsetzt, wie lange sie dauert und was Studien zu Bädern zeigen.',
        lead: 'Psoriasis ist eine chronisch-entzündliche Hauterkrankung mit schuppenden Plaques, die in Schüben verläuft. Marienbad führt die generalisierte Psoriasis vulgaris als eigene Position der tschechischen Indikationsliste und kombiniert dafür Mineralbäder, dermatologisch verordnete Fototherapie und die milde Klimatherapie des Kurorts.',
        teaser: 'Generalisierte Psoriasis vulgaris: Mineralbäder, Fototherapie und Klimatherapie im Kurwald unter dermatologischer Betreuung.',
        treats: [
          'Generalisierte Psoriasis vulgaris in mittelschwerer bis schwerer Ausprägung',
          'Artropatische Psoriasis (Psoriasis-Arthritis) mit Gelenkbeteiligung',
          'Chronisch-stabile Verlaufsformen ohne floride Superinfektion der Haut',
          'Begleitender Juckreiz und Hautspannungsgefühl bei ausgedehntem Plaque-Befall',
        ],
        notFor: [
          'Akuter, großflächiger Schub mit nässender oder superinfizierter Haut',
          'Floride bakterielle oder virale Hautinfektionen',
          'Akute Infektionskrankheiten, unkontrollierte Herzinsuffizienz, aktive Tumorerkrankung',
          'Schwangerschaft sowie Unfähigkeit zur Selbstversorgung ohne Begleitperson',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt beurteilt den Hautbefund, die aktuelle systemische oder topische Therapie und legt fest, ob Bäder und Fototherapie infrage kommen. Bringen Sie aktuelle dermatologische Befunde und eine Medikamentenliste mit.',
          },
          {
            heading: 'Zwei bis drei Anwendungen täglich',
            body: 'Mineralbäder und gegebenenfalls Fototherapie stehen im Zentrum, jeweils nach Hauttyp und Ausdehnung dosiert. Nach jedem Bad folgt eine Hautpflege mit rückfettenden Präparaten, um die Haut nicht auszutrocknen.',
          },
          {
            heading: 'Bewegung und Klimatherapie',
            body: 'Geführte Spaziergänge im Kurwald ergänzen die Bäder. Die klimatische Wirkung ist milder als an maritimen Kurorten oder am Toten Meer, wird aber als angenehmer Teil des Tagesablaufs geschätzt.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body: 'Der Kurarzt prüft den Hautbefund und passt Bäder oder Fototherapie an. Zum Abschluss erhalten Sie einen Bericht für Ihren Dermatologen und Empfehlungen für die Hautpflege zu Hause.',
          },
        ],
        procedures: [
          {
            name: 'Mineralbad',
            detail: 'Bad in mild mineralisiertem oder kohlensäurehaltigem Wasser; traditionell zur Erweichung der Schuppenauflagerungen und Beruhigung der Haut eingesetzt.',
          },
          {
            name: 'Fototherapie (UV-B)',
            detail: 'Dermatologisch verordnet und nach Hauttyp dosiert, für ausgedehnteren Plaque-Befall.',
          },
          {
            name: 'Klimatherapie im Kurwald',
            detail: 'Geführte Spaziergänge in klarer Waldluft; der Effekt ist milder als bei maritimer oder Toter-Meer-Klimatherapie, wird aber als unterstützender Teil des Programms genutzt.',
          },
          {
            name: 'Hautpflegeberatung nach dem Bad',
            detail: 'Rückfettende Pflege beugt der Austrocknung vor, die nach Mineralbädern auftreten und Plaques verschlimmern kann.',
          },
          {
            name: 'Physiotherapie',
            detail: 'Bei begleitender Psoriasis-Arthritis zur Erhaltung der Gelenkbeweglichkeit.',
          },
          {
            name: 'Entspannungsverfahren',
            detail: 'Ergänzender Bestandteil des Kurprogramms bei einer Erkrankung, die häufig in Schüben verläuft.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Bei generalisierter und artropatischer Psoriasis vulgaris (Position X/2) trägt die tschechische Krankenkasse 28 Tage komplexe oder 21 Tage Zuschuss-Kurbehandlung, Wiederholungsaufenthalte 28 oder 21 Tage (bei Zuschuss auch 14 Tage). Selbstzahler orientieren sich an drei Wochen, der Dauer der dokumentierten Rehabilitationsprogramme. Für die Jahreszeit gibt es keine medizinische Vorgabe; bei geplanter Fototherapie sprechen manche Gäste den Sonnenschutz für die übrige Reisezeit zusätzlich mit dem Hautarzt ab.',
        },
        evidence: {
          heading: 'Was die Studien zu Bädern bei Psoriasis zeigen',
          body: 'Ein systematischer Übersichtsartikel zu 22 Studien über Hydro-, Spa- und Balneotherapie bei Psoriasis und atopischer Dermatitis beschreibt in den meisten Studien eine Besserung von PASI-Wert und Hautentzündung, bei schwankender Studienqualität (Moini Jazani A et al., 2022, Int J Dermatol). In einer unkontrollierten ungarischen Beobachtungsstudie mit 80 Patienten sank der PASI-Wert im Mittel von 7,15 auf 2,62 nach einer dreiwöchigen Rehabilitation mit Balneotherapie, begleitet von einem Rückgang des CRP-Werts; ohne Kontrollgruppe lässt sich der Anteil des natürlichen Krankheitsverlaufs daran nicht abgrenzen (Péter I et al., 2017, In Vivo). Ein weiterer systematischer Übersichtsartikel zu Bädern in thermalem Mineralwasser fand in allen eingeschlossenen Studien zu Psoriasis eine Besserung der Symptome, bei geringer Studienzahl und -qualität (Protano C et al., 2024, Int J Biometeorol). Wichtig zur Einordnung: Marienbad liegt im Landesinneren mit gemäßigtem Klima und ist kein Klimakurort vom Typ Totes Meer oder Adria, wo die Klimatherapie eigenständig untersucht wurde. Keine der zitierten Studien zeigt eine Heilung der Psoriasis; die Anwendungen lindern Hautsymptome und ersetzen keine systemische Therapie.',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung gemeinsam mit Ihrem Hautbefund und Ihrer laufenden dermatologischen Behandlung. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        faqs: [
          {
            question: 'Welches Heilbad hilft bei Psoriasis?',
            answer: 'Marienbad führt die generalisierte und artropatische Psoriasis vulgaris als offizielle Indikation (Position X/2) und kombiniert dafür Mineralbäder, dermatologisch verordnete Fototherapie und Klimatherapie im Kurwald. Systematische Übersichtsarbeiten zu Bädern in Mineral- und Thermalwasser beschreiben bei den meisten untersuchten Studien eine Besserung der Hautsymptome.',
          },
          {
            question: 'Welcher Kurort eignet sich bei Hautproblemen?',
            answer: 'Geeignet ist ein Kurort mit dermatologischer Betreuung, der Psoriasis oder Ekzem als offizielle Indikation führt und Bäder, Fototherapie und gegebenenfalls Klimatherapie anbietet. Marienbad erfüllt das über Position X/2 der tschechischen Indikationsliste.',
          },
          {
            question: 'Wie lange dauert eine Kur bei Psoriasis?',
            answer: 'Nach der tschechischen Indikationsliste sind es bei Position X/2 bis zu 28 Tage komplexe oder 21 Tage Zuschuss-Kurbehandlung. Die dokumentierte dreiwöchige Rehabilitation mit Balneotherapie in einer ungarischen Studie zeigte einen deutlichen Rückgang des PASI-Werts, allerdings ohne Kontrollgruppe.',
          },
          {
            question: 'Ist Marienbad wie das Tote Meer für die Haut?',
            answer: 'Nein. Marienbad ist ein Kurort im böhmischen Landesinneren mit gemäßigtem Klima, kein maritimer Klimakurort. Die dort eingesetzte Fototherapie und Klimatherapie beruht auf dermatologisch dosierter UV-B-Bestrahlung und Waldluft, nicht auf einem dem Toten Meer vergleichbaren Höhenklima oder Salzgehalt.',
          },
          {
            question: 'Was passiert bei einem akuten Psoriasis-Schub während der Kur?',
            answer: 'Bei großflächiger, nässender oder superinfizierter Haut werden Bäder und Fototherapie ausgesetzt, bis sich der Hautzustand stabilisiert hat. Der Kurarzt passt das Programm entsprechend an; ein akuter, ausgedehnter Schub gilt als vorübergehende Kontraindikation.',
          },
        ],
        sources: [
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe X — Hautkrankheiten',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Position X/2 (generalisierte und artropatische Psoriasis vulgaris) mit Versorgungsart und Dauer des erstatteten Aufenthalts.',
          },
          {
            title: 'Moini Jazani A et al. 2022, Int J Dermatol — systematischer Übersichtsartikel, 22 Studien',
            url: 'https://consensus.app/papers/details/17694155c34a597d9d2d05c671207037/',
            note: 'Die meisten Studien zu Hydro-, Spa- und Balneotherapie bei Psoriasis und atopischer Dermatitis beschreiben eine Besserung von PASI-Wert und Hautentzündung. Studienqualität schwankt.',
          },
          {
            title: 'Péter I et al. 2017, In Vivo — Beobachtungsstudie ohne Kontrollgruppe, 80 Patienten',
            url: 'https://consensus.app/papers/details/c3145bd954875e3bbf05c5bfdc39ba1a/',
            note: 'PASI sank im Mittel von 7,15 auf 2,62 nach dreiwöchiger Rehabilitation mit Balneotherapie, CRP ging zurück. Ohne Kontrollgruppe.',
          },
          {
            title: 'Protano C et al. 2024, Int J Biometeorol — systematischer Übersichtsartikel',
            url: 'https://doi.org/10.1007/s00484-024-02649-x',
            note: 'Alle eingeschlossenen Studien zu Psoriasis beschreiben eine Besserung der Symptome nach Bädern in thermalem Mineralwasser. Wenige Studien, niedrige Qualität.',
          },
        ],
        related: [
          {
            label: 'Kurbehandlung von Hauterkrankungen',
            href: '/de/magazin/hauterkrankungen-kur',
          },
          {
            label: 'Klimatherapie',
            href: '/de/klimatherapie',
          },
          {
            label: 'Mineralquellen im Überblick',
            href: '/de/mineralquellen',
          },
          {
            label: 'Indikationen und Kontraindikationen',
            href: '/de/indikationen-und-kontraindikationen',
          },
        ],
      },
      en: {
        slug: 'psoriasis',
        navLabel: 'Psoriasis',
        title: 'Spa treatment for psoriasis in Marienbad',
        h1: 'Spa treatment for psoriasis',
        metaTitle: 'Spa treatment for psoriasis in Marienbad | Marienbad.com',
        metaDescription:
          'Psoriasis vulgaris in Marienbad: the mineral baths, phototherapy and climate therapy the cure uses, how long it lasts, and what studies on bathing show.',
        lead:
          'Psoriasis is a chronic inflammatory skin disease with scaling plaques that runs in flares. Marienbad lists generalised psoriasis vulgaris as its own position on the Czech indication list, combining mineral baths, dermatologist-prescribed phototherapy and the mild climate therapy of the spa town.',
        teaser: 'Generalised psoriasis vulgaris: mineral baths, phototherapy and climate therapy in the spa forest under dermatological supervision.',
        treats: [
          'Generalised psoriasis vulgaris of moderate to severe extent',
          'Arthropathic psoriasis (psoriatic arthritis) with joint involvement',
          'Chronic-stable forms without active skin superinfection',
          'Accompanying itching and skin tightness with extensive plaque involvement',
        ],
        notFor: [
          'An acute, extensive flare with weeping or superinfected skin',
          'Active bacterial or viral skin infections',
          'Acute infectious disease, uncontrolled heart failure, active cancer',
          'Pregnancy, or an inability to manage personal care without a companion',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: 'The spa physician assesses the skin findings and your current systemic or topical therapy, and decides whether baths and phototherapy are suitable. Bring recent dermatological findings and a list of your medication.',
          },
          {
            heading: 'Two to three treatments daily',
            body: 'Mineral baths and, where suitable, phototherapy are central, dosed according to skin type and extent. Every bath is followed by skincare with re-fatting products, so the skin does not dry out.',
          },
          {
            heading: 'Movement and climate therapy',
            body: 'Guided walks in the spa forest supplement the baths. The climatic effect is milder than at maritime spa resorts or the Dead Sea, but is valued as a pleasant part of the daily routine.',
          },
          {
            heading: 'Weekly check-up and final report',
            body: 'The spa physician reviews the skin findings and adjusts baths or phototherapy. At the end you receive a report for your dermatologist and recommendations for skincare at home.',
          },
        ],
        procedures: [
          {
            name: 'Mineral bath',
            detail: 'A bath in mildly mineralised or carbonated water, traditionally used to soften scaling and soothe the skin.',
          },
          {
            name: 'Phototherapy (UV-B)',
            detail: 'Prescribed by a dermatologist and dosed by skin type, for more extensive plaque involvement.',
          },
          {
            name: 'Climate therapy in the spa forest',
            detail: 'Guided walks in clear forest air; the effect is milder than maritime or Dead Sea climate therapy, but is used as a supporting part of the programme.',
          },
          {
            name: 'Post-bath skincare advice',
            detail: 'Re-fatting care prevents the dryness that can follow mineral baths and worsen plaques.',
          },
          {
            name: 'Physiotherapy',
            detail: 'For accompanying psoriatic arthritis, to maintain joint mobility.',
          },
          {
            name: 'Relaxation techniques',
            detail: 'A supplementary part of the spa programme for a condition that often runs in flares.',
          },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'For generalised and arthropathic psoriasis vulgaris (position X/2), stays covered by Czech public health insurance run to 28 days of comprehensive or 21 days of contributory spa care, with repeat stays of 28 or 21 days (or 14 days with contributory care). Self-paying guests generally use three weeks, the length of the documented rehabilitation programmes. There is no medical rule for the season; when phototherapy is planned, some guests also discuss sun protection for the rest of their trip with their dermatologist.',
        },
        evidence: {
          heading: 'What the studies on bathing for psoriasis show',
          body: 'A systematic review of 22 studies on hydro-, spa and balneotherapy for psoriasis and atopic dermatitis describes an improvement in PASI score and skin inflammation in most studies, though study quality varied (Moini Jazani A et al., 2022, Int J Dermatol). In an uncontrolled Hungarian observational study of 80 patients, the PASI score fell on average from 7.15 to 2.62 after a three-week rehabilitation with balneotherapy, accompanied by a fall in CRP; without a control group, the share due to the natural course of the disease cannot be separated out (Péter I et al., 2017, In Vivo). A further systematic review of bathing in thermal mineral water found symptom improvement in every included study on psoriasis, though the number and quality of studies were low (Protano C et al., 2024, Int J Biometeorol). Important for context: Marienbad is an inland spa town with a temperate climate and not a climate resort of the Dead Sea or Adriatic type, where climate therapy has been studied in its own right. None of the studies cited shows a cure for psoriasis; the treatments ease skin symptoms and do not replace systemic therapy.',
        },
        physicianNote: 'Whether and to what extent a spa cure is right for you is decided by the spa physician at the initial examination together with your skin findings and your ongoing dermatological treatment. This page provides information and does not replace medical advice.',
        faqs: [
          {
            question: 'Which spa town helps with psoriasis?',
            answer: 'Marienbad lists generalised and arthropathic psoriasis vulgaris as an official indication (position X/2) and combines mineral baths, dermatologist-prescribed phototherapy and climate therapy in the spa forest for it. Systematic reviews of bathing in mineral and thermal water describe an improvement in skin symptoms in most of the studies examined.',
          },
          {
            question: 'Which spa resort is suitable for skin problems?',
            answer: 'A suitable resort has dermatological care, lists psoriasis or eczema as an official indication, and offers baths, phototherapy and, where relevant, climate therapy. Marienbad meets this through position X/2 of the Czech indication list.',
          },
          {
            question: 'How long does a spa cure for psoriasis last?',
            answer: 'Under the Czech indication list, position X/2 runs to up to 28 days of comprehensive or 21 days of contributory spa care. The documented three-week rehabilitation with balneotherapy in a Hungarian study showed a marked fall in PASI score, though without a control group.',
          },
          {
            question: 'Is Marienbad like the Dead Sea for the skin?',
            answer: 'No. Marienbad is an inland Bohemian spa town with a temperate climate, not a maritime climate resort. The phototherapy and climate therapy used there rest on dermatologist-dosed UV-B exposure and forest air, not on an altitude climate or salt content comparable to the Dead Sea.',
          },
          {
            question: 'What happens during an acute psoriasis flare at the spa?',
            answer: 'With extensive, weeping or superinfected skin, baths and phototherapy are suspended until the skin has stabilised. The spa physician adjusts the programme accordingly; an acute, extensive flare counts as a temporary contraindication.',
          },
        ],
        sources: [
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group X — skin diseases',
            url: '/en/indications-and-contraindications',
            note: 'Position X/2 (generalised and arthropathic psoriasis vulgaris), with type of care and length of the covered stay.',
          },
          {
            title: 'Moini Jazani A et al. 2022, Int J Dermatol — systematic review, 22 studies',
            url: 'https://consensus.app/papers/details/17694155c34a597d9d2d05c671207037/',
            note: 'Most studies on hydro-, spa and balneotherapy for psoriasis and atopic dermatitis describe an improvement in PASI score and skin inflammation. Study quality varied.',
          },
          {
            title: 'Péter I et al. 2017, In Vivo — observational study without control group, 80 patients',
            url: 'https://consensus.app/papers/details/c3145bd954875e3bbf05c5bfdc39ba1a/',
            note: 'PASI fell on average from 7.15 to 2.62 after three weeks of rehabilitation with balneotherapy, CRP fell too. No control group.',
          },
          {
            title: 'Protano C et al. 2024, Int J Biometeorol — systematic review',
            url: 'https://doi.org/10.1007/s00484-024-02649-x',
            note: 'All included studies on psoriasis describe symptom improvement after bathing in thermal mineral water. Few studies, low quality.',
          },
        ],
        related: [
          {
            label: 'Spa treatment for skin conditions',
            href: '/en/magazine/skin-conditions-spa-treatment',
          },
          {
            label: 'Climate therapy',
            href: '/en/climate-therapy',
          },
          {
            label: 'Mineral springs overview',
            href: '/en/mineral-springs',
          },
          {
            label: 'Indications and contraindications',
            href: '/en/indications-and-contraindications',
          },
        ],
      },
      cs: {
        slug: 'lupenka',
        navLabel: 'Lupénka',
        title: 'Lázeňská léčba lupénky v Mariánských Lázních',
        h1: 'Lázeňská léčba lupénky',
        metaTitle: 'Léčba lupénky v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Psoriasis vulgaris v Mariánských Lázních: minerální koupele, fototerapie a klimatoterapie. Co lázeňská léčba nabízí, jak dlouho trvá a co ukazují studie.',
        lead: 'Lupénka je chronické zánětlivé kožní onemocnění se šupinatými ložisky, které probíhá v atakách. Mariánské Lázně vedou generalizovanou psoriasis vulgaris jako samostatnou položku indikačního seznamu a kombinují pro ni minerální koupele, dermatologem předepsanou fototerapii a mírnou klimatoterapii lázeňského města.',
        teaser: 'Generalizovaná psoriasis vulgaris: minerální koupele, fototerapie a klimatoterapie v lázeňském lese pod dermatologickým dohledem.',
        treats: [
          'Generalizovaná psoriasis vulgaris střední až těžké tíže',
          'Artropatická psoriáza (psoriatická artritida) s postižením kloubů',
          'Chronicky stabilní formy bez akutní superinfekce kůže',
          'Doprovodné svědění a pocit napětí kůže při rozsáhlém postižení ložisky',
        ],
        notFor: [
          'Akutní, rozsáhlá ataka s mokvající nebo superinfikovanou kůží',
          'Akutní bakteriální nebo virové kožní infekce',
          'Akutní infekční onemocnění, nekontrolované srdeční selhání, aktivní nádorové onemocnění',
          'Těhotenství a neschopnost sebeobsluhy bez doprovodu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař posoudí kožní nález, aktuální systémovou nebo lokální léčbu a rozhodne, zda koupele a fototerapie připadají v úvahu. Vezměte si aktuální dermatologické nálezy a seznam léků.',
          },
          {
            heading: 'Dvě až tři procedury denně',
            body: 'V centru jsou minerální koupele a případně fototerapie, dávkované podle typu pleti a rozsahu postižení. Po každé koupeli následuje péče o pleť tučnějším přípravkem, aby se kůže nevysušovala.',
          },
          {
            heading: 'Pohyb a klimatoterapie',
            body: 'Vedené procházky v lázeňském lese koupele doplňují. Klimatický účinek je mírnější než u přímořských lázní nebo Mrtvého moře, přesto se cení jako příjemná součást denního programu.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Lázeňský lékař kontroluje kožní nález a upravuje koupele nebo fototerapii. Na závěr dostanete zprávu pro svého dermatologa a doporučení pro péči o pleť doma.',
          },
        ],
        procedures: [
          {
            name: 'Minerální koupel',
            detail: 'Koupel v mírně mineralizované nebo uhličité vodě; tradičně používaná ke změkčení šupin a zklidnění kůže.',
          },
          {
            name: 'Fototerapie (UV-B)',
            detail: 'Předepsaná dermatologem a dávkovaná podle typu pleti, pro rozsáhlejší postižení ložisky.',
          },
          {
            name: 'Klimatoterapie v lázeňském lese',
            detail: 'Vedené procházky v čistém lesním vzduchu; účinek je mírnější než u přímořské klimatoterapie nebo u Mrtvého moře, ale slouží jako podpůrná součást programu.',
          },
          {
            name: 'Péče o pleť po koupeli',
            detail: 'Tučnější péče předchází vysušení, které se po minerálních koupelích může objevit a ložiska zhoršit.',
          },
          {
            name: 'Fyzioterapie',
            detail: 'Při doprovodné psoriatické artritidě k udržení kloubní pohyblivosti.',
          },
          {
            name: 'Relaxační techniky',
            detail: 'Doplňková součást programu při onemocnění, které často probíhá v atakách.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Generalizovaná a artropatická psoriasis vulgaris je položka X/2 indikačního seznamu; přesnou délku hrazeného pobytu najdete na stránce Co hradí pojišťovna u kožních onemocnění. Samoplátci se orientují na tři týdny, což je délka dokumentovaných rehabilitačních programů. Pro roční období neexistuje lékařský předpis; při plánované fototerapii si někteří hosté navíc s kožním lékařem domluví ochranu před sluncem na zbytek cesty.',
        },
        evidence: {
          heading: 'Co ukazují studie o koupelích při lupénce',
          body: 'Systematický přehledový článek o 22 studiích hydroterapie, lázeňské a balneoterapie při psoriáze a atopické dermatitidě popisuje ve většině studií zlepšení hodnoty PASI a kožního zánětu, při kolísavé kvalitě studií (Moini Jazani A a kol., 2022, Int J Dermatol). V nekontrolované maďarské observační studii se 80 pacienty klesla hodnota PASI v průměru ze 7,15 na 2,62 po třítýdenní rehabilitaci s balneoterapií, doprovázené poklesem hodnoty CRP; bez kontrolní skupiny se podíl přirozeného průběhu nemoci na tom nedá odlišit (Péter I a kol., 2017, In Vivo). Další systematický přehledový článek o koupelích v termální minerální vodě zjistil ve všech zahrnutých studiích k psoriáze zlepšení příznaků, při nízkém počtu a kvalitě studií (Protano C a kol., 2024, Int J Biometeorol). Pro zařazení je důležité: Mariánské Lázně leží ve vnitrozemí s mírným klimatem a nejsou klimatickými lázněmi typu Mrtvé moře nebo Jadran, kde byla klimatoterapie zkoumána samostatně. Žádná z citovaných studií neukazuje vyléčení lupénky; procedury zmírňují kožní příznaky a nenahrazují systémovou léčbu.',
        },
        physicianNote: 'O tom, zda a v jakém rozsahu pro vás lázeňská léčba připadá v úvahu, rozhoduje lázeňský lékař při vstupní prohlídce společně s vaším kožním nálezem a probíhající dermatologickou léčbou. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        faqs: [
          {
            question: 'Které lázně léčí psoriázu?',
            answer: 'Mariánské Lázně vedou generalizovanou a artropatickou psoriasis vulgaris jako oficiální indikaci (položka X/2) a kombinují pro ni minerální koupele, dermatologem předepsanou fototerapii a klimatoterapii v lázeňském lese. Systematické přehledové články o koupelích v minerální a termální vodě popisují u většiny zkoumaných studií zlepšení kožních příznaků.',
          },
          {
            question: 'Které lázně jsou vhodné při kožních problémech?',
            answer: 'Vhodné jsou lázně s dermatologickou péčí, které vedou psoriázu nebo ekzém jako oficiální indikaci a nabízejí koupele, fototerapii a případně klimatoterapii. Mariánské Lázně to splňují přes položku X/2 indikačního seznamu.',
          },
          {
            question: 'Jak dlouho trvá lázeňský pobyt při lupénce?',
            answer: 'Podle indikačního seznamu jde u položky X/2 o délku pobytu, kterou konkrétně rozepisuje stránka Co hradí pojišťovna u kožních onemocnění. Dokumentovaná třítýdenní rehabilitace s balneoterapií v maďarské studii ukázala výrazný pokles hodnoty PASI, ovšem bez kontrolní skupiny.',
          },
          {
            question: 'Jsou Mariánské Lázně jako Mrtvé moře pro pokožku?',
            answer: 'Ne. Mariánské Lázně jsou lázeňské město v českém vnitrozemí s mírným klimatem, ne přímořské klimatické lázně. Zdejší fototerapie a klimatoterapie stojí na dermatologicky dávkovaném UV-B záření a lesním vzduchu, ne na výškovém klimatu nebo slanosti srovnatelné s Mrtvým mořem.',
          },
          {
            question: 'Co se děje při akutní atace lupénky během pobytu?',
            answer: 'Při rozsáhlé, mokvající nebo superinfikované kůži se koupele a fototerapie vysazují, dokud se stav kůže nestabilizuje. Lázeňský lékař program odpovídajícím způsobem upraví; akutní rozsáhlá ataka se považuje za dočasnou kontraindikaci.',
          },
        ],
        sources: [
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina X — kožní nemoci',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Položka X/2 (generalizovaná a artropatická psoriasis vulgaris) s typem péče a délkou hrazeného pobytu.',
          },
          {
            title: 'Moini Jazani A a kol. 2022, Int J Dermatol — systematický přehledový článek, 22 studií',
            url: 'https://consensus.app/papers/details/17694155c34a597d9d2d05c671207037/',
            note: 'Většina studií hydroterapie, lázeňské a balneoterapie při psoriáze a atopické dermatitidě popisuje zlepšení hodnoty PASI a kožního zánětu. Kvalita studií kolísá.',
          },
          {
            title: 'Péter I a kol. 2017, In Vivo — observační studie bez kontrolní skupiny, 80 pacientů',
            url: 'https://consensus.app/papers/details/c3145bd954875e3bbf05c5bfdc39ba1a/',
            note: 'PASI klesla v průměru ze 7,15 na 2,62 po třítýdenní rehabilitaci s balneoterapií, CRP klesl. Bez kontrolní skupiny.',
          },
          {
            title: 'Protano C a kol. 2024, Int J Biometeorol — systematický přehledový článek',
            url: 'https://doi.org/10.1007/s00484-024-02649-x',
            note: 'Všechny zahrnuté studie k psoriáze popisují zlepšení příznaků po koupelích v termální minerální vodě. Málo studií, nízká kvalita.',
          },
        ],
        related: [
          {
            label: 'Lázeňská léčba kožních onemocnění',
            href: '/cs/magazin/lazenska-lecba-koznich-onemocneni',
          },
          {
            label: 'Klimatoterapie',
            href: '/cs/klimatoterapie',
          },
          {
            label: 'Přehled minerálních pramenů',
            href: '/cs/mineralni-prameny',
          },
          {
            label: 'Co hradí pojišťovna u kožních onemocnění',
            href: '/cs/lazne-s-pojistovnou/indikace/kozni-onemocneni',
          },
        ],
      },
      ru: {
        slug: 'psoriaz',
        navLabel: 'Псориаз',
        title: 'Курортное лечение псориаза в Марианских Лазнях',
        h1: 'Курортное лечение псориаза',
        metaTitle: 'Лечение псориаза в Марианских Лазнях | Marienbad.com',
        metaDescription: 'Псориаз в Марианских Лазнях: минеральные ванны, фототерапия и климатотерапия, сколько длится лечение и что показывают исследования ванн.',
        lead: 'Псориаз — хроническое воспалительное заболевание кожи с шелушащимися бляшками, протекающее обострениями. В Марианских Лазнях генерализованный псориаз обыкновенный выделен как отдельная позиция чешского индикационного списка; для его лечения сочетают минеральные ванны, назначенную дерматологом фототерапию и мягкую климатотерапию курорта.',
        teaser: 'Генерализованный псориаз обыкновенный: минеральные ванны, фототерапия и климатотерапия в курортном лесу под наблюдением дерматолога.',
        treats: [
          'Генерализованный псориаз обыкновенный средней и тяжёлой степени',
          'Артропатический псориаз (псориатический артрит) с поражением суставов',
          'Хронически стабильные формы течения без активной суперинфекции кожи',
          'Сопутствующий зуд и ощущение стянутости кожи при обширном поражении бляшками',
        ],
        notFor: [
          'Острое, обширное обострение с мокнущей или суперинфицированной кожей',
          'Активные бактериальные или вирусные инфекции кожи',
          'Острые инфекционные заболевания, неконтролируемая сердечная недостаточность, активное онкологическое заболевание',
          'Беременность, а также неспособность к самообслуживанию без сопровождающего лица',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач оценивает состояние кожи, текущую системную или местную терапию и определяет, показаны ли ванны и фототерапия. Возьмите с собой актуальные дерматологические заключения и список лекарств.',
          },
          {
            heading: 'Две-три процедуры в день',
            body: 'В центре внимания — минеральные ванны и, при необходимости, фототерапия, дозируемые по типу кожи и площади поражения. После каждой ванны следует уход за кожей с жирными средствами, чтобы не пересушить её.',
          },
          {
            heading: 'Движение и климатотерапия',
            body: 'Ванны дополняются направляемыми прогулками в курортном лесу. Климатическое воздействие мягче, чем на морских курортах или у Мёртвого моря, но ценится как приятная часть распорядка дня.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Курортный врач проверяет состояние кожи и корректирует ванны или фототерапию. По окончании вы получаете заключение для вашего дерматолога и рекомендации по уходу за кожей дома.',
          },
        ],
        procedures: [
          {
            name: 'Минеральная ванна',
            detail: 'Ванна в слабоминерализованной или углекислой воде; традиционно применяется для размягчения чешуйчатых наслоений и успокоения кожи.',
          },
          {
            name: 'Фототерапия (УФ-B)',
            detail: 'Назначается дерматологом и дозируется по типу кожи, для более обширного поражения бляшками.',
          },
          {
            name: 'Климатотерапия в курортном лесу',
            detail: 'Направляемые прогулки на чистом лесном воздухе; эффект мягче, чем при морской климатотерапии или климатотерапии у Мёртвого моря, но используется как поддерживающая часть программы.',
          },
          {
            name: 'Консультация по уходу за кожей после ванны',
            detail: 'Жирный уход предотвращает пересушивание, которое может возникнуть после минеральных ванн и усугубить бляшки.',
          },
          {
            name: 'Физиотерапия',
            detail: 'При сопутствующем псориатическом артрите — для сохранения подвижности суставов.',
          },
          {
            name: 'Техники релаксации',
            detail: 'Дополнительная часть курортной программы при заболевании, которое часто протекает обострениями.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'При генерализованном и артропатическом псориазе обыкновенном (позиция X/2) для пребываний, оплачиваемых чешской страховой, предусмотрено 28 дней комплексного или 21 день долевого курортного лечения, повторные пребывания — 28 или 21 день (при долевом финансировании также 14 дней). Гости, оплачивающие лечение самостоятельно, ориентируются на три недели — длительность документированных программ реабилитации. Для времени года медицинских рекомендаций нет; при планируемой фототерапии некоторые гости дополнительно согласуют с дерматологом защиту от солнца на остальное время поездки.',
        },
        evidence: {
          heading: 'Что показывают исследования о ваннах при псориазе',
          body: 'Систематический обзор 22 исследований гидро-, спа- и бальнеотерапии при псориазе и атопическом дерматите описывает в большинстве исследований улучшение показателя PASI и воспаления кожи, при неоднородном качестве исследований (Moini Jazani A et al., 2022, Int J Dermatol). В неконтролируемом венгерском наблюдательном исследовании с 80 пациентами показатель PASI в среднем снизился с 7,15 до 2,62 после трёхнедельной реабилитации с бальнеотерапией, что сопровождалось снижением уровня СРБ; без контрольной группы отделить долю естественного течения болезни от этого невозможно (Péter I et al., 2017, In Vivo). Ещё один систематический обзор ванн в термальной минеральной воде обнаружил во всех включённых исследованиях по псориазу улучшение симптомов, при небольшом числе и невысоком качестве исследований (Protano C et al., 2024, Int J Biometeorol). Важно для понимания: Марианские Лазни расположены в глубине материковой Чехии, в умеренном климате, и не являются климатическим курортом типа Мёртвого моря или Адриатики, где климатотерапия изучалась отдельно. Ни одно из цитируемых исследований не показывает излечения псориаза; процедуры облегчают кожные симптомы и не заменяют системную терапию.',
        },
        physicianNote: 'Показано ли вам курортное лечение и в каком объёме, решает курортный врач при первичном осмотре совместно с оценкой состояния кожи и вашего текущего дерматологического лечения. Эта страница носит информационный характер и не заменяет консультацию врача.',
        faqs: [
          {
            question: 'Какой курорт помогает при псориазе?',
            answer: 'В Марианских Лазнях генерализованный и артропатический псориаз обыкновенный указан как официальное показание (позиция X/2); для его лечения сочетают минеральные ванны, назначенную дерматологом фототерапию и климатотерапию в курортном лесу. Систематические обзоры ванн в минеральной и термальной воде описывают улучшение кожных симптомов в большинстве изученных исследований.',
          },
          {
            question: 'Какой курорт подходит при проблемах с кожей?',
            answer: 'Подходит курорт с дерматологическим наблюдением, где псориаз или экзема указаны как официальное показание и предлагаются ванны, фототерапия и, при необходимости, климатотерапия. Марианские Лазни отвечают этому через позицию X/2 чешского индикационного списка.',
          },
          {
            question: 'Сколько длится курортное лечение при псориазе?',
            answer: 'По чешскому индикационному списку для позиции X/2 предусмотрено до 28 дней комплексного или 21 день долевого курортного лечения. Документированная трёхнедельная реабилитация с бальнеотерапией в венгерском исследовании показала заметное снижение показателя PASI, однако без контрольной группы.',
          },
          {
            question: 'Марианские Лазни — это как Мёртвое море для кожи?',
            answer: 'Нет. Марианские Лазни — курорт в глубине Чехии с умеренным климатом, не морской климатический курорт. Применяемые здесь фототерапия и климатотерапия основаны на дозированном дерматологом УФ-B облучении и лесном воздухе, а не на высотном климате или солёности, сопоставимых с Мёртвым морем.',
          },
          {
            question: 'Что происходит при остром обострении псориаза во время лечения?',
            answer: 'При обширной, мокнущей или суперинфицированной коже ванны и фототерапию приостанавливают до стабилизации состояния кожи. Курортный врач соответствующим образом корректирует программу; острое, обширное обострение считается временным противопоказанием.',
          },
        ],
        sources: [
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа X — заболевания кожи',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Позиция X/2 (генерализованный и артропатический псориаз обыкновенный) с видом и длительностью оплачиваемого пребывания.',
          },
          {
            title: 'Moini Jazani A et al. 2022, Int J Dermatol — систематический обзор, 22 исследования',
            url: 'https://consensus.app/papers/details/17694155c34a597d9d2d05c671207037/',
            note: 'Большинство исследований гидро-, спа- и бальнеотерапии при псориазе и атопическом дерматите описывают улучшение показателя PASI и воспаления кожи. Качество исследований неоднородно.',
          },
          {
            title: 'Péter I et al. 2017, In Vivo — наблюдательное исследование без контрольной группы, 80 пациентов',
            url: 'https://consensus.app/papers/details/c3145bd954875e3bbf05c5bfdc39ba1a/',
            note: 'PASI снизился в среднем с 7,15 до 2,62 после трёхнедельной реабилитации с бальнеотерапией, СРБ снизился. Без контрольной группы.',
          },
          {
            title: 'Protano C et al. 2024, Int J Biometeorol — систематический обзор',
            url: 'https://doi.org/10.1007/s00484-024-02649-x',
            note: 'Все включённые исследования по псориазу описывают улучшение симптомов после ванн в термальной минеральной воде. Мало исследований, невысокое качество.',
          },
        ],
        related: [
          {
            label: 'Курортное лечение заболеваний кожи',
            href: '/ru/zhurnal/lechenie-kozhnykh-zabolevanij',
          },
          {
            label: 'Климатотерапия',
            href: '/ru/klimatoterapiya',
          },
          {
            label: 'Минеральные источники — обзор',
            href: '/ru/mineralnye-istochniki',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'kidney-stones',
    groupId: 'urinary',
    roman: 'VIII',
    codes: [
      'VIII/2',
      'VIII/3',
    ],
    conditionName: 'Kidney stones',
    icd10: 'N20',
    image: '/images/library/drinking-cure/spa-cup-daylight-spring.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Kurgast füllt einen Trinkkurbecher bei Tageslicht an einer Mineralquelle',
      en: 'A spa guest fills a drinking-cure cup in daylight at a mineral spring',
      cs: 'Lázeňský host plní pitný pohárek za denního světla u pramene',
      ru: 'Гость курорта наполняет питьевой курортный бокальчик у минерального источника при дневном свете',
    },
    content: {
      de: {
        slug: 'nierensteine',
        navLabel: 'Nierensteine',
        title: 'Kur bei Nierensteinen in Marienbad',
        h1: 'Kur bei Nierensteinen',
        metaTitle: 'Kur bei Nierensteinen in Marienbad — Trinkkur | Marienbad.com',
        metaDescription: 'Nierensteine und Nephrolithiasis in Marienbad: wie die Trinkkur aus den Mineralquellen abläuft, wie lange ein Aufenthalt dauert und was Studien zeigen.',
        lead: 'Nierensteine gehören zu den ältesten Behandlungsanlässen Marienbads: Die hydrogenkarbonatreichen Mineralquellen des Ortes werden seit dem 19. Jahrhundert für die Trinkkur genutzt. Die tschechische Indikationsliste führt die Nephrolithiasis ohne Harnstauung als eigene Position, ergänzt um die Nachbehandlung nach Eingriffen an Niere und Harnwegen.',
        teaser: 'Nephrolithiasis ohne Harnstauung: strukturierte Trinkkur aus den Mineralquellen, ärztlich begleitet, mit Nachsorge nach Steinzertrümmerung.',
        treats: [
          'Nierensteine (Nephrolithiasis) ohne aktuelle Harnstauung, insbesondere Kalziumoxalat-Steine',
          'Nephrokalzinose',
          'Nachbehandlung nach Steinzertrümmerung (ESWL) oder anderen Eingriffen an Niere und Harnwegen',
          'Vorbeugung erneuter Steinbildung durch ärztlich angeleitete Trinkmengensteigerung',
        ],
        notFor: [
          'Akute Harnstauung, Kolik oder Verschluss der Harnwege — hier ist eine urologische Akutbehandlung nötig, keine Kur',
          'Floride Harnwegsinfektion mit Fieber',
          'Ungeklärte Blutung aus den Harnwegen',
          'Allgemeine Kontraindikationen: unkontrollierte Herzinsuffizienz, aktive Tumorerkrankung, Schwangerschaft',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt sichtet Bildgebung, Steinanalyse (falls vorhanden) und Nierenfunktion und legt einen individuellen Trinkplan fest. Bringen Sie aktuelle Ultraschall- oder CT-Befunde sowie, wenn bekannt, die Zusammensetzung des Steins mit.',
          },
          {
            heading: 'Trinkkur nach festem Zeitplan',
            body: 'Mineralwasser aus den zugewiesenen Quellen wird zu festen Tageszeiten in ansteigender Menge getrunken. Ziel ist eine ausreichende Urinmenge über den Tag, nicht eine feste Trinkmenge — der Kurarzt passt die Menge individuell an.',
          },
          {
            heading: 'Ergänzende Bewegung',
            body: 'Spaziergänge auf den Kurwegen und dosierte Bewegung unterstützen den allgemeinen Stoffwechsel und die Flüssigkeitsverteilung über den Tag.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body: 'Der Kurarzt kontrolliert Urinwerte und passt den Trinkplan an. Zum Abschluss erhalten Sie einen Bericht für Ihren Urologen und einen Trinkplan für zu Hause.',
          },
        ],
        procedures: [
          {
            name: 'Trinkkur an den Mineralquellen',
            detail: 'Hydrogenkarbonatreiches Mineralwasser erhöht Harnmenge, Urin-pH und Zitratausscheidung und senkt so die Übersättigung, aus der sich Kalziumoxalatsteine bilden.',
          },
          {
            name: 'Individuelle Trinkmengenanpassung',
            detail: 'Der Kurarzt legt Menge und Zeitpunkte nach Steinart, Nierenfunktion und Begleiterkrankungen fest.',
          },
          {
            name: 'Ernährungsberatung',
            detail: 'Zu Salz-, Eiweiß- und Oxalataufnahme, als Baustein der Rezidivprophylaxe neben der Trinkkur.',
          },
          {
            name: 'Bewegungstherapie',
            detail: 'Spaziergänge und dosierte Bewegung als allgemeiner Bestandteil des Kurprogramms, ohne eigenen direkten Nachweis für die Steinbildung.',
          },
          {
            name: 'Regelmäßige Urinkontrolle',
            detail: 'pH-Wert und weitere Urinparameter werden während des Aufenthalts wiederholt geprüft, um den Trinkplan anzupassen.',
          },
          {
            name: 'Nachsorge nach Litotrypsie',
            detail: 'Die Trinkkur unterstützt das Ausspülen von Steinfragmenten nach extrakorporaler Stoßwellenlithotripsie (ESWL).',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Bei Nephrolithiasis ohne Harnstauung (Position VIII/2) trägt die tschechische Krankenkasse 21 Tage komplexe oder Zuschuss-Kurbehandlung, Wiederholungsaufenthalte 21 oder 14 Tage Zuschuss; nach Eingriffen an Niere und Harnwegen einschließlich Nachsorge nach Litotrypsie (VIII/3) sind es ebenfalls 21 Tage. Selbstzahler wählen meist zwei bis drei Wochen. Die Trinkkur lässt sich das ganze Jahr über durchführen, eine bevorzugte Jahreszeit gibt es medizinisch nicht.',
        },
        evidence: {
          heading: 'Was die Forschung zur Trinkkur bei Nierensteinen zeigt',
          body: 'Der Mechanismus ist gut untersucht: In einer Crossover-Studie an gesunden Männern erhöhte Wasser mit 1715 mg Hydrogenkarbonat pro Liter den Urin-pH und die Zitratausscheidung und senkte Oxalat sowie die Übersättigung für Kalziumoxalat und Harnsäure, vergleichbar mit Kaliumcitrat (Kessler T, Hesse A, 2000, Br J Nutr; gesunde Probanden, keine Patienten). Eine doppelblinde Crossover-Studie mit 34 Patienten mit wiederkehrenden Kalziumoxalatsteinen fand unter 1,5 l Wasser mit 2673 mg Hydrogenkarbonat pro Liter einen Urin-pH von 6,73, höhere Zitrat- und Magnesiumwerte sowie eine geringere Kalziumoxalat-Übersättigung, bei gleichzeitig höherem Risiko für Phosphatsteine; auch normales Wasser senkte die Übersättigung, allein durch die Trinkmenge (Karagülle O et al., 2007, World J Urol; nur 3 Tage, kleine Stichprobe). Eine 12-wöchige RCT mit 51 Patienten fand unter hydrogenkarbonatreichem Wasser höhere Urinmenge, Magnesium, pH und Zitrat gegenüber normalem Wasser, während sich Oxalat und der Tiseliu-Index nicht unterschieden (Lu Y et al., 2022, Int Urol Nephrol; offene Studie). Die europäische Leitlinie zur Rezidivprophylaxe nennt ausreichende Flüssigkeitszufuhr neben Kalzium- und Kochsalzsteuerung als Basis der Vorbeugung (Skolarikos A et al., 2024, Eur Urol). Ein Übersichtsartikel beschreibt die Trinkkur oligomineralischer Wässer mit dem Ziel von mindestens 2,5 l Urin täglich als Baustein der Prävention bei entsprechend veranlagten Patienten sowie zum Ausspülen von Fragmenten nach Litotrypsie (Mennuni G et al., 2015, Clin Ter; narrativ). In Marienbad selbst läuft seit 2026 erstmals seit 30 Jahren eine klinische Studie zu den objektiven Effekten der Kurbehandlung bei urologischen und nephrologischen Diagnosen mit über 100 begleiteten Patienten; Ergebnisse liegen noch nicht vor (Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně, 2026, ClinicalTrials.gov NCT07435844). Keine dieser Studien zeigt, dass die Trinkkur bestehende Steine auflöst oder eine notwendige Steinzertrümmerung ersetzt; ihr belegter Effekt betrifft die Urinzusammensetzung und die Vorbeugung neuer Steine.',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer Bildgebung und Nierenfunktion. Diese Seite informiert und ersetzt keine urologische Beratung.',
        faqs: [
          {
            question: 'Welche Kur hilft bei Nierensteinen?',
            answer: 'Marienbad führt Nephrolithiasis ohne Harnstauung als offizielle Indikation (Position VIII/2) und setzt dafür eine strukturierte Trinkkur aus den hydrogenkarbonatreichen Mineralquellen ein. Kontrollierte Studien zeigen, dass solches Wasser den Urin-pH und die Zitratausscheidung erhöht und die Übersättigung für Kalziumoxalat senkt.',
          },
          {
            question: 'Hilft eine Kur in Marienbad bei Nierensteinen?',
            answer: 'Die allgemeine Wirkung hydrogenkarbonatreicher Mineralwässer auf die Urinzusammensetzung ist durch mehrere kontrollierte Studien belegt. Speziell für Marienbad läuft seit 2026 erstmals seit 30 Jahren eine eigene klinische Studie zu urologischen und nephrologischen Diagnosen; ihre Ergebnisse liegen noch nicht vor.',
          },
          {
            question: 'Wie viel Mineralwasser trinkt man bei einer Trinkkur?',
            answer: 'Es gibt keine feste Literzahl für alle Gäste: Der Kurarzt legt die Trinkmenge individuell fest, mit dem Ziel einer ausreichenden Urinmenge über den Tag. Ein Übersichtsartikel zur Nierensteinprävention nennt als Orientierung mindestens 2,5 l Urin täglich.',
          },
          {
            question: 'Kann ich mit Nierensteinen ohne Symptome zur Kur fahren?',
            answer: 'Ja, das ist der typische Fall für Position VIII/2: Nephrolithiasis ohne aktuelle Harnstauung. Liegt eine akute Kolik, ein Harnwegsverschluss oder eine fieberhafte Infektion vor, ist zunächst eine urologische Akutbehandlung nötig, keine Kur.',
          },
          {
            question: 'Ersetzt die Trinkkur eine Steinzertrümmerung (ESWL)?',
            answer: 'Nein. Die Trinkkur ergänzt die urologische Behandlung, etwa zur Nachsorge nach einer Litotripsie und zum Ausspülen von Fragmenten, ersetzt aber keinen notwendigen Eingriff bei größeren oder stauenden Steinen.',
          },
        ],
        sources: [
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe VIII — Krankheiten des Harnsystems',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Positionen VIII/2 (Nephrolithiasis ohne Harnstauung, Nephrokalzinose) und VIII/3 (Zustände nach Operationen an Niere und Harnwegen) mit Versorgungsart und Dauer.',
          },
          {
            title: 'Kessler T, Hesse A 2000, Br J Nutr — Crossover-Studie, gesunde Männer',
            url: 'https://consensus.app/papers/details/2d5a08f705975e588e5670b41859518c/',
            note: 'Hydrogenkarbonatreiches Wasser erhöhte Urin-pH und Zitrat, senkte Oxalat und Übersättigung für Kalziumoxalat und Harnsäure. Gesunde Probanden, keine Patienten.',
          },
          {
            title: 'Karagülle O et al. 2007, World J Urol — doppelblinde Crossover-Studie, 34 Patienten',
            url: 'https://consensus.app/papers/details/382178a2b7565f0da7a6bc61a1723e47/',
            note: 'Höhere Zitrat- und Magnesiumwerte, geringere Kalziumoxalat-Übersättigung, höheres Phosphatstein-Risiko. Nur 3 Tage, kleine Stichprobe.',
          },
          {
            title: 'Lu Y et al. 2022, Int Urol Nephrol — RCT, 51 Patienten mit Kalziumoxalatsteinen',
            url: 'https://consensus.app/papers/details/d78c43250ece58558ba0b8db3d517d7d/',
            note: '12 Wochen: höhere Urinmenge, Magnesium, pH und Zitrat gegenüber normalem Wasser. Offene Studie.',
          },
          {
            title: 'Skolarikos A et al. 2024, Eur Urol — EAU-Leitlinienupdate',
            url: 'https://consensus.app/papers/details/e104f08c54a75b18b24c5090e527a34a/',
            note: 'Ausreichende Flüssigkeitszufuhr und Kalziumzufuhr, weniger Salz und Eiweiß als Basis der Rezidivprophylaxe.',
          },
          {
            title: 'Mennuni G et al. 2015, Clin Ter — Übersichtsartikel zur Trinkkur bei Nephrolithiasis',
            url: 'https://consensus.app/papers/details/3d02fb18ab44591e89ef2e5a3b728141/',
            note: 'Trinkkur oligomineralischer Wässer mit Ziel ≥2,5 l Urin täglich als Vorbeugung und zur Nachsorge nach Litotrypsie. Narrativ.',
          },
          {
            title: 'Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně 2026, ClinicalTrials.gov (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Laufende klinische Studie zur Kurbehandlung bei urologischen und nephrologischen Diagnosen in Marienbad, über 100 Patienten. Ergebnisse noch nicht verfügbar.',
          },
        ],
        related: [
          {
            label: 'Nieren und Harnwege: Trinkkur und Kurbehandlung',
            href: '/de/magazin/nieren-harnwege-behandlung',
          },
          {
            label: 'Trinkkur — Ratgeber zu den Quellen',
            href: '/de/magazin/trinkkur-ratgeber',
          },
          {
            label: 'Mineralquellen im Überblick',
            href: '/de/mineralquellen',
          },
          {
            label: 'Indikationen und Kontraindikationen',
            href: '/de/indikationen-und-kontraindikationen',
          },
        ],
      },
      en: {
        slug: 'kidney-stones',
        navLabel: 'Kidney stones',
        title: 'Spa treatment for kidney stones in Marienbad',
        h1: 'Spa treatment for kidney stones',
        metaTitle: 'Spa treatment for kidney stones in Marienbad | Marienbad.com',
        metaDescription:
          'Kidney stones and nephrolithiasis in Marienbad: how the drinking cure from the mineral springs works, how long a stay lasts, and what studies show.',
        lead:
          'Kidney stones are one of the oldest reasons for treatment in Marienbad: the town’s bicarbonate-rich mineral springs have been used for the drinking cure since the 19th century. The Czech indication list lists nephrolithiasis without urinary obstruction as its own position, alongside aftercare following procedures on the kidneys and urinary tract.',
        teaser: 'Nephrolithiasis without urinary obstruction: a structured drinking cure from the mineral springs, medically supervised, with aftercare following stone fragmentation.',
        treats: [
          'Kidney stones (nephrolithiasis) without current urinary obstruction, especially calcium oxalate stones',
          'Nephrocalcinosis',
          'Aftercare following stone fragmentation (ESWL) or other procedures on the kidneys and urinary tract',
          'Prevention of new stone formation through medically guided increases in fluid intake',
        ],
        notFor: [
          'Acute urinary obstruction, colic or blockage of the urinary tract — this needs acute urological treatment, not a spa cure',
          'An active urinary tract infection with fever',
          'Unexplained bleeding from the urinary tract',
          'General contraindications: uncontrolled heart failure, active cancer, pregnancy',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: 'The spa physician reviews imaging, stone analysis (if available) and kidney function, and sets an individual drinking plan. Bring recent ultrasound or CT reports, and the stone’s composition if known.',
          },
          {
            heading: 'Drinking cure on a fixed schedule',
            body: 'Mineral water from the assigned springs is drunk at set times of day in gradually increasing amounts. The goal is sufficient urine volume over the day, not a fixed amount to drink — the spa physician adjusts the amount individually.',
          },
          {
            heading: 'Supplementary movement',
            body: 'Walks on the spa paths and measured exercise support general metabolism and fluid distribution through the day.',
          },
          {
            heading: 'Weekly check-up and final report',
            body: 'The spa physician checks urine values and adjusts the drinking plan. At the end you receive a report for your urologist and a drinking plan for home.',
          },
        ],
        procedures: [
          {
            name: 'Drinking cure at the mineral springs',
            detail: 'Bicarbonate-rich mineral water increases urine volume, urinary pH and citrate excretion, lowering the supersaturation from which calcium oxalate stones form.',
          },
          {
            name: 'Individual adjustment of drinking amount',
            detail: 'The spa physician sets the amount and timing according to the type of stone, kidney function and other conditions.',
          },
          {
            name: 'Nutrition counselling',
            detail: 'On salt, protein and oxalate intake, as part of preventing recurrence alongside the drinking cure.',
          },
          {
            name: 'Exercise therapy',
            detail: 'Walks and measured exercise as a general part of the spa programme, without direct evidence of their own for stone formation.',
          },
          {
            name: 'Regular urine checks',
            detail: 'pH and other urine values are checked repeatedly during the stay to adjust the drinking plan.',
          },
          {
            name: 'Aftercare following lithotripsy',
            detail: 'The drinking cure supports flushing out stone fragments after extracorporeal shock wave lithotripsy (ESWL).',
          },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'For nephrolithiasis without urinary obstruction (position VIII/2), stays covered by Czech public health insurance run to 21 days of comprehensive or contributory spa care, with repeat stays of 21 or 14 days of contributory care; following procedures on the kidneys and urinary tract, including aftercare after lithotripsy (VIII/3), it is likewise 21 days. Self-paying guests usually choose two to three weeks. The drinking cure can be done all year round; there is no medically preferred season.',
        },
        evidence: {
          heading: 'What the research on the drinking cure for kidney stones shows',
          body: 'The mechanism is well studied: in a crossover study in healthy men, water containing 1,715 mg of bicarbonate per litre raised urinary pH and citrate excretion and lowered oxalate and the supersaturation for calcium oxalate and uric acid, comparable to potassium citrate (Kessler T, Hesse A, 2000, Br J Nutr; healthy volunteers, not patients). A double-blind crossover study of 34 patients with recurrent calcium oxalate stones found, under 1.5 l of water with 2,673 mg of bicarbonate per litre, a urinary pH of 6.73, higher citrate and magnesium levels and lower calcium oxalate supersaturation, alongside a higher risk of phosphate stones; even ordinary water lowered supersaturation, purely through the amount drunk (Karagülle O et al., 2007, World J Urol; only 3 days, small sample). A 12-week RCT of 51 patients found higher urine volume, magnesium, pH and citrate under bicarbonate-rich water compared with normal water, while oxalate and the Tiselius index did not differ (Lu Y et al., 2022, Int Urol Nephrol; open-label study). The European guideline on preventing recurrence names adequate fluid intake, alongside managing calcium and salt intake, as the basis of prevention (Skolarikos A et al., 2024, Eur Urol). A review describes the drinking cure with low-mineral waters, aiming for at least 2.5 l of urine daily, as a component of prevention in predisposed patients and for flushing out fragments after lithotripsy (Mennuni G et al., 2015, Clin Ter; narrative). In Marienbad itself, a clinical study on the objective effects of spa treatment for urological and nephrological diagnoses has been running since 2026 — the first in 30 years — following more than 100 patients; results are not yet available (Institute of Spa Treatment and Balneology & Léčebné lázně Mariánské Lázně, 2026, ClinicalTrials.gov NCT07435844). None of these studies shows that the drinking cure dissolves existing stones or replaces a necessary stone fragmentation procedure; its documented effect concerns urine composition and the prevention of new stones.',
        },
        physicianNote: 'Whether and to what extent a spa cure is right for you is decided by the spa physician at the initial examination, based on your imaging and kidney function. This page provides information and does not replace urological advice.',
        faqs: [
          {
            question: 'Which spa cure helps with kidney stones?',
            answer: 'Marienbad lists nephrolithiasis without urinary obstruction as an official indication (position VIII/2) and uses a structured drinking cure from the bicarbonate-rich mineral springs for it. Controlled studies show that such water raises urinary pH and citrate excretion and lowers supersaturation for calcium oxalate.',
          },
          {
            question: 'Does a spa cure in Marienbad help with kidney stones?',
            answer: 'The general effect of bicarbonate-rich mineral water on urine composition is supported by several controlled studies. Specifically for Marienbad, a dedicated clinical study on urological and nephrological diagnoses has been running since 2026, the first in 30 years; its results are not yet available.',
          },
          {
            question: 'How much mineral water do you drink during a drinking cure?',
            answer: 'There is no fixed litre amount for every guest: the spa physician sets the drinking amount individually, aiming for sufficient urine volume over the day. A review on kidney stone prevention names at least 2.5 l of urine daily as a benchmark.',
          },
          {
            question: 'Can I go for a spa cure with kidney stones and no symptoms?',
            answer: 'Yes, that is the typical case for position VIII/2: nephrolithiasis without current urinary obstruction. If there is acute colic, a urinary tract blockage or a feverish infection, acute urological treatment is needed first, not a spa cure.',
          },
          {
            question: 'Does the drinking cure replace stone fragmentation (ESWL)?',
            answer: 'No. The drinking cure supplements urological treatment, for example as aftercare following lithotripsy and to flush out fragments, but does not replace a necessary procedure for larger or obstructing stones.',
          },
        ],
        sources: [
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group VIII — diseases of the urinary system',
            url: '/en/indications-and-contraindications',
            note: 'Positions VIII/2 (nephrolithiasis without urinary obstruction, nephrocalcinosis) and VIII/3 (conditions after operations on the kidneys and urinary tract), with type of care and length.',
          },
          {
            title: 'Kessler T, Hesse A 2000, Br J Nutr — crossover study, healthy men',
            url: 'https://consensus.app/papers/details/2d5a08f705975e588e5670b41859518c/',
            note: 'Bicarbonate-rich water raised urinary pH and citrate, lowered oxalate and supersaturation for calcium oxalate and uric acid. Healthy volunteers, not patients.',
          },
          {
            title: 'Karagülle O et al. 2007, World J Urol — double-blind crossover study, 34 patients',
            url: 'https://consensus.app/papers/details/382178a2b7565f0da7a6bc61a1723e47/',
            note: 'Higher citrate and magnesium levels, lower calcium oxalate supersaturation, higher phosphate stone risk. Only 3 days, small sample.',
          },
          {
            title: 'Lu Y et al. 2022, Int Urol Nephrol — RCT, 51 patients with calcium oxalate stones',
            url: 'https://consensus.app/papers/details/d78c43250ece58558ba0b8db3d517d7d/',
            note: '12 weeks: higher urine volume, magnesium, pH and citrate compared with normal water. Open-label study.',
          },
          {
            title: 'Skolarikos A et al. 2024, Eur Urol — EAU guideline update',
            url: 'https://consensus.app/papers/details/e104f08c54a75b18b24c5090e527a34a/',
            note: 'Adequate fluid intake and calcium intake, less salt and protein, as the basis of preventing recurrence.',
          },
          {
            title: 'Mennuni G et al. 2015, Clin Ter — review on the drinking cure for nephrolithiasis',
            url: 'https://consensus.app/papers/details/3d02fb18ab44591e89ef2e5a3b728141/',
            note: 'Drinking cure with low-mineral waters, aiming for ≥2.5 l of urine daily, as prevention and for aftercare following lithotripsy. Narrative.',
          },
          {
            title: 'Institute of Spa Treatment and Balneology & Léčebné lázně Mariánské Lázně 2026, ClinicalTrials.gov (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Ongoing clinical study on spa treatment for urological and nephrological diagnoses in Marienbad, over 100 patients. Results not yet available.',
          },
        ],
        related: [
          {
            label: 'Kidney and urinary treatment',
            href: '/en/magazine/kidney-urinary-treatment',
          },
          {
            label: 'Drinking cure — a guide to the springs',
            href: '/en/magazine/drinking-cure-guide',
          },
          {
            label: 'Mineral springs overview',
            href: '/en/mineral-springs',
          },
          {
            label: 'Indications and contraindications',
            href: '/en/indications-and-contraindications',
          },
        ],
      },
      cs: {
        slug: 'ledvinove-kameny',
        navLabel: 'Ledvinové kameny',
        title: 'Lázeňská léčba ledvinových kamenů v Mariánských Lázních',
        h1: 'Lázeňská léčba ledvinových kamenů',
        metaTitle: 'Léčba ledvinových kamenů — Mariánské Lázně | Marienbad.com',
        metaDescription: 'Ledvinové kameny a nefrolitiáza v Mariánských Lázních: jak probíhá pitná kúra z minerálních pramenů, jak dlouho pobyt trvá a co ukazují studie.',
        lead: 'Ledvinové kameny patří k nejstarším léčebným důvodům, kvůli kterým se do Mariánských Lázní jezdí: hydrogenuhličitanem bohaté minerální prameny místa se k pitné kúře využívají už od 19. století. Indikační seznam vede nefrolitiázu bez městnání moči jako samostatnou položku, doplněnou o doléčení po zákrocích na ledvinách a močových cestách.',
        teaser: 'Nefrolitiáza bez městnání moči: strukturovaná pitná kúra z minerálních pramenů, pod lékařským dohledem, s doléčením po drcení kamenů.',
        treats: [
          'Ledvinové kameny (nefrolitiáza) bez aktuálního městnání moči, zejména kalciumoxalátové kameny',
          'Nefrokalcinóza',
          'Doléčení po drcení kamenů (litotrypsi) nebo jiných zákrocích na ledvinách a močových cestách',
          'Prevence nové tvorby kamenů díky lékařem vedenému zvýšení příjmu tekutin',
        ],
        notFor: [
          'Akutní městnání moči, kolika nebo uzávěr močových cest — zde je potřeba akutní urologická léčba, ne lázeňský pobyt',
          'Akutní infekce močových cest s horečkou',
          'Nevyjasněné krvácení z močových cest',
          'Obecné kontraindikace: nekontrolované srdeční selhání, aktivní nádorové onemocnění, těhotenství',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde zobrazovací vyšetření, rozbor kamene (je-li k dispozici) a funkci ledvin a stanoví individuální pitný plán. Vezměte si aktuální ultrazvukový nebo CT nález a případně informaci o složení kamene.',
          },
          {
            heading: 'Pitná kúra podle pevného rozvrhu',
            body: 'Minerální voda z přidělených pramenů se pije v pevných denních dobách a v postupně rostoucím množství. Cílem je dostatečné množství moči během dne, ne pevné množství tekutin — lázeňský lékař množství individuálně upravuje.',
          },
          {
            heading: 'Doplňkový pohyb',
            body: 'Procházky po kolonádě a dávkovaný pohyb podporují celkový metabolismus a rozložení tekutin během dne.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Lázeňský lékař kontroluje hodnoty moči a upravuje pitný plán. Na závěr dostanete zprávu pro svého urologa a pitný plán domů.',
          },
        ],
        procedures: [
          {
            name: 'Pitná kúra u minerálních pramenů',
            detail: 'Hydrogenuhličitanem bohatá minerální voda zvyšuje množství moči, pH moči i vylučování citrátu a snižuje tak přesycení, ze kterého vznikají kalciumoxalátové kameny.',
          },
          {
            name: 'Individuální úprava pitného množství',
            detail: 'Lázeňský lékař stanoví množství a časování podle typu kamene, funkce ledvin a přidružených onemocnění.',
          },
          {
            name: 'Nutriční poradenství',
            detail: 'K příjmu soli, bílkovin a oxalátů, jako součást prevence recidivy vedle pitné kúry.',
          },
          {
            name: 'Pohybová terapie',
            detail: 'Procházky a dávkovaný pohyb jako obecná součást lázeňského programu, bez vlastního přímého důkazu pro tvorbu kamenů.',
          },
          {
            name: 'Pravidelná kontrola moči',
            detail: 'Hodnota pH a další parametry moči se během pobytu opakovaně kontrolují, aby se pitný plán mohl upravovat.',
          },
          {
            name: 'Doléčení po litotrypsi',
            detail: 'Pitná kúra podporuje vyplavení úlomků kamene po mimotělní litotrypsi rázovou vlnou (ESWL).',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Nefrolitiáza bez městnání moči je položka VIII/2, doléčení po zákrocích na ledvinách a močových cestách položka VIII/3 indikačního seznamu; přesnou délku hrazeného pobytu najdete na stránce Co hradí pojišťovna u ledvin a močových cest. Samoplátci volí obvykle dva až tři týdny. Pitnou kúru lze absolvovat celoročně, preferované roční období z lékařského hlediska neexistuje.',
        },
        evidence: {
          heading: 'Co ukazuje výzkum pitné kúry při ledvinových kamenech',
          body: 'Mechanismus je dobře prozkoumaný: ve zkřížené studii u zdravých mužů zvýšila voda s 1715 mg hydrogenuhličitanu na litr pH moči a vylučování citrátu a snížila oxalát i přesycení pro kalciumoxalát a kyselinu močovou, srovnatelně s citrátem draselným (Kessler T, Hesse A, 2000, Br J Nutr; zdraví dobrovolníci, ne pacienti). Dvojitě zaslepená zkřížená studie s 34 pacienty s opakovanými kalciumoxalátovými kameny zjistila při 1,5 l vody s 2673 mg hydrogenuhličitanu na litr pH moči 6,73, vyšší hodnoty citrátu a hořčíku a nižší přesycení kalciumoxalátem, zároveň však vyšší riziko fosfátových kamenů; přesycení snížila i obyčejná voda, jen díky množství vypité tekutiny (Karagülle O a kol., 2007, World J Urol; jen 3 dny, malý vzorek). Dvanáctitýdenní RCT s 51 pacienty zjistila u hydrogenuhličitanem bohaté vody vyšší množství moči, hořčíku, pH a citrátu oproti obyčejné vodě, zatímco oxalát a Tiseliův index se nelišily (Lu Y a kol., 2022, Int Urol Nephrol; otevřená studie). Evropská doporučení pro prevenci recidivy uvádějí dostatečný příjem tekutin vedle regulace vápníku a kuchyňské soli jako základ prevence (Skolarikos A a kol., 2024, Eur Urol). Přehledový článek popisuje pitnou kúru oligomineralních vod s cílem alespoň 2,5 l moči denně jako součást prevence u k tomu náchylných pacientů i k vyplavení úlomků po litotrypsi (Mennuni G a kol., 2015, Clin Ter; narativní). V Mariánských Lázních samotných probíhá od roku 2026 poprvé po 30 letech klinická studie k objektivním účinkům lázeňské léčby u urologických a nefrologických diagnóz, zapojeno je přes 100 sledovaných pacientů; výsledky zatím nejsou k dispozici (Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně, 2026, ClinicalTrials.gov NCT07435844). Žádná z těchto studií neukazuje, že by pitná kúra rozpouštěla existující kameny nebo nahrazovala nutné drcení kamene; její doložený účinek se týká složení moči a prevence nových kamenů.',
        },
        physicianNote: 'O tom, zda a v jakém rozsahu pro vás lázeňská léčba připadá v úvahu, rozhoduje lázeňský lékař při vstupní prohlídce podle vašeho zobrazovacího vyšetření a funkce ledvin. Tato stránka informuje a nenahrazuje urologickou konzultaci.',
        faqs: [
          {
            question: 'Jsou Mariánské Lázně vhodné na ledvinové kameny?',
            answer: 'Mariánské Lázně vedou nefrolitiázu bez městnání moči jako oficiální indikaci (položka VIII/2) a nasazují pro ni strukturovanou pitnou kúru z hydrogenuhličitanem bohatých minerálních pramenů. Kontrolované studie ukazují, že taková voda zvyšuje pH moči a vylučování citrátu a snižuje přesycení pro kalciumoxalát.',
          },
          {
            question: 'Pomůže lázeňský pobyt v Mariánských Lázních při ledvinových kamenech?',
            answer: 'Obecný účinek hydrogenuhličitanem bohatých minerálních vod na složení moči je doložen několika kontrolovanými studiemi. Přímo pro Mariánské Lázně probíhá od roku 2026 poprvé po 30 letech vlastní klinická studie k urologickým a nefrologickým diagnózám; její výsledky zatím nejsou k dispozici.',
          },
          {
            question: 'Kolik minerální vody se pije při pitné kúře?',
            answer: 'Pevné množství pro všechny hosty neexistuje: lázeňský lékař stanoví množství individuálně, s cílem dostatečného množství moči během dne. Přehledový článek k prevenci ledvinových kamenů uvádí jako orientaci alespoň 2,5 l moči denně.',
          },
          {
            question: 'Mohu jet do lázní s ledvinovými kameny bez příznaků?',
            answer: 'Ano, to je typický případ pro položku VIII/2: nefrolitiáza bez aktuálního městnání moči. Při akutní kolice, uzávěru močových cest nebo horečnaté infekci je nutná nejprve akutní urologická léčba, ne lázeňský pobyt.',
          },
          {
            question: 'Nahrazuje pitná kúra drcení kamene (ESWL)?',
            answer: 'Ne. Pitná kúra doplňuje urologickou léčbu, například jako doléčení po litotrypsi a k vyplavení úlomků, nenahrazuje ale nutný zákrok u větších nebo městnajících kamenů.',
          },
        ],
        sources: [
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina VIII — nemoci močového systému',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Položky VIII/2 (nefrolitiáza bez městnání moči, nefrokalcinóza) a VIII/3 (stavy po operacích ledvin a močových cest) s typem péče a délkou.',
          },
          {
            title: 'Kessler T, Hesse A 2000, Br J Nutr — zkřížená studie, zdraví muži',
            url: 'https://consensus.app/papers/details/2d5a08f705975e588e5670b41859518c/',
            note: 'Hydrogenuhličitanem bohatá voda zvýšila pH moči a citrát, snížila oxalát a přesycení pro kalciumoxalát a kyselinu močovou. Zdraví dobrovolníci, ne pacienti.',
          },
          {
            title: 'Karagülle O a kol. 2007, World J Urol — dvojitě zaslepená zkřížená studie, 34 pacientů',
            url: 'https://consensus.app/papers/details/382178a2b7565f0da7a6bc61a1723e47/',
            note: 'Vyšší hodnoty citrátu a hořčíku, nižší přesycení kalciumoxalátem, vyšší riziko fosfátových kamenů. Jen 3 dny, malý vzorek.',
          },
          {
            title: 'Lu Y a kol. 2022, Int Urol Nephrol — RCT, 51 pacientů s kalciumoxalátovými kameny',
            url: 'https://consensus.app/papers/details/d78c43250ece58558ba0b8db3d517d7d/',
            note: '12 týdnů: vyšší množství moči, hořčíku, pH a citrátu oproti obyčejné vodě. Otevřená studie.',
          },
          {
            title: 'Skolarikos A a kol. 2024, Eur Urol — aktualizace doporučení EAU',
            url: 'https://consensus.app/papers/details/e104f08c54a75b18b24c5090e527a34a/',
            note: 'Dostatečný příjem tekutin a vápníku, méně soli a bílkovin jako základ prevence recidivy.',
          },
          {
            title: 'Mennuni G a kol. 2015, Clin Ter — přehledový článek k pitné kúře při nefrolitiáze',
            url: 'https://consensus.app/papers/details/3d02fb18ab44591e89ef2e5a3b728141/',
            note: 'Pitná kúra oligomineralních vod s cílem ≥2,5 l moči denně jako prevence a doléčení po litotrypsi. Narativní.',
          },
          {
            title: 'Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně 2026, ClinicalTrials.gov (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Probíhající klinická studie k lázeňské léčbě urologických a nefrologických diagnóz v Mariánských Lázních, přes 100 pacientů. Výsledky zatím nejsou k dispozici.',
          },
        ],
        related: [
          {
            label: 'Léčba ledvin a močových cest',
            href: '/cs/magazin/lecba-ledvin-mocovych-cest',
          },
          {
            label: 'Průvodce pitnou kúrou',
            href: '/cs/magazin/pitna-kura-pruvodce',
          },
          {
            label: 'Přehled minerálních pramenů',
            href: '/cs/mineralni-prameny',
          },
          {
            label: 'Co hradí pojišťovna u ledvin a močových cest',
            href: '/cs/lazne-s-pojistovnou/indikace/ledviny-a-mocove-cesty',
          },
        ],
      },
      ru: {
        slug: 'kamni-v-pochkah',
        navLabel: 'Камни в почках',
        title: 'Курортное лечение при камнях в почках в Марианских Лазнях',
        h1: 'Курортное лечение при камнях в почках',
        metaTitle: 'Лечение камней в почках — Марианские Лазни | Marienbad.com',
        metaDescription: 'Камни в почках в Марианских Лазнях: как проходит питьевой курс из минеральных источников, сколько длится пребывание и что показывают исследования.',
        lead: 'Камни в почках — один из старейших поводов для лечения в Марианских Лазнях: богатые гидрокарбонатами минеральные источники курорта используются для питьевого курса ещё с XIX века. Чешский индикационный список выделяет нефролитиаз без задержки мочи как отдельную позицию, дополненную последующим лечением после вмешательств на почках и мочевых путях.',
        teaser: 'Нефролитиаз без задержки мочи: структурированный питьевой курс из минеральных источников под врачебным наблюдением, с последующим лечением после дробления камней.',
        treats: [
          'Камни в почках (нефролитиаз) без текущей задержки мочи, в первую очередь кальций-оксалатные камни',
          'Нефрокальциноз',
          'Последующее лечение после дробления камней (ДУВЛ) или других вмешательств на почках и мочевых путях',
          'Профилактика повторного камнеобразования путём назначенного врачом увеличения объёма выпиваемой жидкости',
        ],
        notFor: [
          'Острая задержка мочи, колика или закупорка мочевых путей — здесь необходима экстренная урологическая помощь, а не курортное лечение',
          'Активная инфекция мочевых путей с лихорадкой',
          'Невыясненное кровотечение из мочевых путей',
          'Общие противопоказания: неконтролируемая сердечная недостаточность, активное онкологическое заболевание, беременность',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает данные визуализации, анализ состава камня (если он есть) и функцию почек и составляет индивидуальный план питьевого курса. Возьмите с собой актуальные результаты УЗИ или КТ, а также, если известен, состав камня.',
          },
          {
            heading: 'Питьевой курс по фиксированному расписанию',
            body: 'Минеральная вода из назначенных источников пьётся в определённое время дня, в постепенно увеличивающемся количестве. Цель — достаточный объём мочи за день, а не фиксированное количество выпитого; количество индивидуально подбирает курортный врач.',
          },
          {
            heading: 'Дополнительное движение',
            body: 'Прогулки по курортным маршрутам и дозированное движение поддерживают общий обмен веществ и распределение жидкости в течение дня.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Курортный врач контролирует показатели мочи и корректирует план питья. По окончании вы получаете заключение для вашего уролога и план питья на дом.',
          },
        ],
        procedures: [
          {
            name: 'Питьевой курс у минеральных источников',
            detail: 'Богатая гидрокарбонатами минеральная вода повышает объём мочи, pH мочи и выведение цитрата и тем самым снижает перенасыщение, из-за которого образуются кальций-оксалатные камни.',
          },
          {
            name: 'Индивидуальная корректировка объёма питья',
            detail: 'Курортный врач определяет количество и время приёма по типу камня, функции почек и сопутствующим заболеваниям.',
          },
          {
            name: 'Консультация по питанию',
            detail: 'По потреблению соли, белка и оксалатов — как элемент профилактики рецидива наряду с питьевым курсом.',
          },
          {
            name: 'Двигательная терапия',
            detail: 'Прогулки и дозированное движение как общая часть курортной программы, без отдельного прямого доказательства влияния на камнеобразование.',
          },
          {
            name: 'Регулярный контроль мочи',
            detail: 'pH и другие показатели мочи повторно проверяются в течение пребывания для корректировки плана питья.',
          },
          {
            name: 'Последующее лечение после литотрипсии',
            detail: 'Питьевой курс помогает вымыванию фрагментов камней после экстракорпоральной ударно-волновой литотрипсии (ДУВЛ).',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'При нефролитиазе без задержки мочи (позиция VIII/2) для пребываний, оплачиваемых чешской страховой, предусмотрено 21 день комплексного или долевого курортного лечения, повторные пребывания — 21 или 14 дней с долевым финансированием; после вмешательств на почках и мочевых путях, включая последующее лечение после литотрипсии (VIII/3), также предусмотрено 21 день. Гости, оплачивающие лечение самостоятельно, обычно выбирают две-три недели. Питьевой курс можно проводить круглый год, предпочтительного с медицинской точки зрения времени года не существует.',
        },
        evidence: {
          heading: 'Что показывают исследования о питьевом курсе при камнях в почках',
          body: 'Механизм действия хорошо изучен: в перекрёстном исследовании на здоровых мужчинах вода с содержанием гидрокарбоната 1715 мг на литр повысила pH мочи и выведение цитрата и снизила оксалат, а также перенасыщение по кальцию-оксалату и мочевой кислоте, сопоставимо с цитратом калия (Kessler T, Hesse A, 2000, Br J Nutr; здоровые добровольцы, не пациенты). Двойное слепое перекрёстное исследование с 34 пациентами с рецидивирующими кальций-оксалатными камнями обнаружило при 1,5 л воды с содержанием гидрокарбоната 2673 мг на литр pH мочи 6,73, более высокие уровни цитрата и магния и меньшее перенасыщение по кальцию-оксалату, при одновременно более высоком риске фосфатных камней; обычная вода тоже снижала перенасыщение, только за счёт объёма выпитого (Karagülle O et al., 2007, World J Urol; всего 3 дня, маленькая выборка). 12-недельное РКИ с 51 пациентом обнаружило при богатой гидрокарбонатом воде более высокий объём мочи, магний, pH и цитрат по сравнению с обычной водой, тогда как оксалат и индекс Тизелиуса не различались (Lu Y et al., 2022, Int Urol Nephrol; открытое исследование). Европейское клиническое руководство по профилактике рецидива называет достаточное потребление жидкости наряду с контролем кальция и поваренной соли основой профилактики (Skolarikos A et al., 2024, Eur Urol). Обзорная статья описывает питьевой курс олигоминеральных вод с целью не менее 2,5 л мочи в сутки как элемент профилактики у предрасположенных пациентов и для вымывания фрагментов после литотрипсии (Mennuni G et al., 2015, Clin Ter; нарративный обзор). В самих Марианских Лазнях с 2026 года впервые за 30 лет проводится клиническое исследование объективных эффектов курортного лечения при урологических и нефрологических диагнозах, охватывающее более 100 наблюдаемых пациентов; результаты пока не опубликованы (Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně, 2026, ClinicalTrials.gov NCT07435844). Ни одно из этих исследований не показывает, что питьевой курс растворяет уже имеющиеся камни или заменяет необходимое дробление камня; доказанный эффект касается состава мочи и профилактики новых камней.',
        },
        physicianNote: 'Показано ли вам курортное лечение и в каком объёме, решает курортный врач при первичном осмотре на основании данных визуализации и функции почек. Эта страница носит информационный характер и не заменяет консультацию уролога.',
        faqs: [
          {
            question: 'Какое курортное лечение помогает при камнях в почках?',
            answer: 'В Марианских Лазнях нефролитиаз без задержки мочи указан как официальное показание (позиция VIII/2), для его лечения применяется структурированный питьевой курс из богатых гидрокарбонатами минеральных источников. Контролируемые исследования показывают, что такая вода повышает pH мочи и выведение цитрата и снижает перенасыщение по кальцию-оксалату.',
          },
          {
            question: 'Помогает ли лечение в Марианских Лазнях при камнях в почках?',
            answer: 'Общее действие богатых гидрокарбонатами минеральных вод на состав мочи подтверждено несколькими контролируемыми исследованиями. Именно для Марианских Лазней с 2026 года впервые за 30 лет проводится собственное клиническое исследование по урологическим и нефрологическим диагнозам; его результаты пока не опубликованы.',
          },
          {
            question: 'Сколько минеральной воды пьют во время питьевого курса?',
            answer: 'Единого количества литров для всех гостей нет: курортный врач определяет объём питья индивидуально, с целью достаточного объёма мочи за день. Обзорная статья по профилактике камней в почках называет ориентиром не менее 2,5 л мочи в сутки.',
          },
          {
            question: 'Можно ли ехать на лечение с камнями в почках без симптомов?',
            answer: 'Да, это типичный случай для позиции VIII/2: нефролитиаз без текущей задержки мочи. При острой колике, закупорке мочевых путей или лихорадочной инфекции сначала необходима экстренная урологическая помощь, а не курортное лечение.',
          },
          {
            question: 'Заменяет ли питьевой курс дробление камня (ДУВЛ)?',
            answer: 'Нет. Питьевой курс дополняет урологическое лечение, например для последующего наблюдения после литотрипсии и вымывания фрагментов, но не заменяет необходимое вмешательство при крупных или закупоривающих камнях.',
          },
        ],
        sources: [
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа VIII — заболевания мочевыделительной системы',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Позиции VIII/2 (нефролитиаз без задержки мочи, нефрокальциноз) и VIII/3 (состояния после операций на почках и мочевых путях) с видом и длительностью.',
          },
          {
            title: 'Kessler T, Hesse A 2000, Br J Nutr — перекрёстное исследование, здоровые мужчины',
            url: 'https://consensus.app/papers/details/2d5a08f705975e588e5670b41859518c/',
            note: 'Вода, богатая гидрокарбонатом, повысила pH мочи и цитрат, снизила оксалат и перенасыщение по кальцию-оксалату и мочевой кислоте. Здоровые добровольцы, не пациенты.',
          },
          {
            title: 'Karagülle O et al. 2007, World J Urol — двойное слепое перекрёстное исследование, 34 пациента',
            url: 'https://consensus.app/papers/details/382178a2b7565f0da7a6bc61a1723e47/',
            note: 'Более высокие уровни цитрата и магния, меньшее перенасыщение по кальцию-оксалату, более высокий риск фосфатных камней. Всего 3 дня, маленькая выборка.',
          },
          {
            title: 'Lu Y et al. 2022, Int Urol Nephrol — РКИ, 51 пациент с кальций-оксалатными камнями',
            url: 'https://consensus.app/papers/details/d78c43250ece58558ba0b8db3d517d7d/',
            note: '12 недель: более высокий объём мочи, магний, pH и цитрат по сравнению с обычной водой. Открытое исследование.',
          },
          {
            title: 'Skolarikos A et al. 2024, Eur Urol — обновление клинического руководства EAU',
            url: 'https://consensus.app/papers/details/e104f08c54a75b18b24c5090e527a34a/',
            note: 'Достаточное потребление жидкости и кальция, меньше соли и белка как основа профилактики рецидива.',
          },
          {
            title: 'Mennuni G et al. 2015, Clin Ter — обзорная статья о питьевом курсе при нефролитиазе',
            url: 'https://consensus.app/papers/details/3d02fb18ab44591e89ef2e5a3b728141/',
            note: 'Питьевой курс олигоминеральных вод с целью ≥2,5 л мочи в сутки как профилактика и для последующего наблюдения после литотрипсии. Нарративный обзор.',
          },
          {
            title: 'Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně 2026, ClinicalTrials.gov (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Проводимое клиническое исследование курортного лечения при урологических и нефрологических диагнозах в Марианских Лазнях, более 100 пациентов. Результаты пока не опубликованы.',
          },
        ],
        related: [
          {
            label: 'Почки и мочевые пути: питьевой курс и курортное лечение',
            href: '/ru/zhurnal/lechenie-pochek-mochevykh-putej',
          },
          {
            label: 'Путеводитель по питьевому курсу',
            href: '/ru/zhurnal/pitevoj-kurs-putevoditel',
          },
          {
            label: 'Минеральные источники — обзор',
            href: '/ru/mineralnye-istochniki',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'urological',
    groupId: 'urinary',
    roman: 'VIII',
    codes: [
      'VIII/1',
      'VIII/3',
      'VIII/4',
    ],
    conditionName: 'Urological disorders',
    image: '/images/library/drinking-cure/elderly-man-drinking-cure.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Älterer Mann trinkt Mineralwasser aus einem Trinkkurbecher während der Trinkkur',
      en: 'An elderly man drinks mineral water from a drinking-cure cup during the drinking cure',
      cs: 'Starší muž pije minerální vodu z pitného pohárku během pitné kúry',
      ru: 'Пожилой мужчина пьёт минеральную воду из питьевого курортного бокальчика во время питьевого курса',
    },
    content: {
      de: {
        slug: 'urologische-beschwerden',
        navLabel: 'Urologische Beschwerden',
        title: 'Kur bei urologischen Beschwerden in Marienbad',
        h1: 'Kur bei urologischen Beschwerden',
        metaTitle: 'Kur bei urologischen Beschwerden Marienbad | Marienbad.com',
        metaDescription: 'Chronische Harnwegsentzündungen, Zustände nach Prostataoperation und chronische Prostatitis: Behandlung, Trinkkur und Dauer der Kur in Marienbad.',
        lead: 'Unter urologischen Beschwerden führt die tschechische Indikationsliste unter anderem chronische, therapieresistente Nieren- und Harnwegsentzündungen, Zustände nach Operationen an Niere und Harnwegen sowie chronische Prostatitis. Marienbad behandelt diese Gruppe seit dem 19. Jahrhundert vor allem über die Trinkkur aus den ortseigenen Mineralquellen, ergänzt um urologisch verordnete physikalische Therapie.',
        teaser: 'Chronische Harnwegsentzündungen, Zustände nach Prostataoperation und chronische Prostatitis: Trinkkur, Beckenbodentherapie und urologische Verlaufskontrolle.',
        treats: [
          'Rezidivierende und chronische, nicht-tuberkulöse Nieren- und Harnwegsentzündungen, die auf Antibiotika nicht ausreichend ansprechen, in laufender urologischer Betreuung seit mindestens 12 Monaten',
          'Zystische Nierenerkrankungen',
          'Zustände nach Operationen an Niere und Harnwegen, einschließlich endovesikaler Eingriffe und komplizierter Prostatektomie',
          'Chronische Prostatitis oder Prostatovesikulitis, die auf medikamentöse Therapie und Antibiotika nicht ausreichend anspricht, in laufender urologischer Betreuung seit mindestens 12 Monaten',
        ],
        notFor: [
          'Akute Harnwegsinfektion mit Fieber oder floride bakterielle Entzündung',
          'Frische Operation ohne abgeschlossene Wundheilung und ohne fachärztliche Freigabe',
          'Ungeklärte Makrohämaturie oder Verdacht auf einen Tumor der Harnwege',
          'Allgemeine Kontraindikationen: unkontrollierte Herzinsuffizienz, aktive Tumorerkrankung, Schwangerschaft',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt sichtet die urologische Vorgeschichte, frühere Kulturen und Antibiotikatherapien sowie gegebenenfalls den Operationsbericht und stellt den Behandlungsplan zusammen. Bringen Sie den aktuellen Bericht Ihres Urologen mit.',
          },
          {
            heading: 'Trinkkur und tägliche Anwendungen',
            body: 'Die Trinkkur aus den zugewiesenen Quellen bildet die Grundlage, ergänzt um urologisch verordnete physikalische Therapie und, nach Prostataoperation, Beckenbodentherapie.',
          },
          {
            heading: 'Bewegung als zweite Säule',
            body: 'Spaziergänge auf den Kurwegen und gezielte Beckenbodenübungen unterstützen die Kontinenz nach operativen Eingriffen und den allgemeinen Kreislauf.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body: 'Der Kurarzt kontrolliert Urinbefunde und passt das Programm an. Zum Abschluss erhalten Sie einen Bericht für Ihren Urologen und Empfehlungen für zu Hause.',
          },
        ],
        procedures: [
          {
            name: 'Trinkkur an den Mineralquellen',
            detail: 'Regelmäßiges Trinken zur Erhöhung der Harnmenge; traditionell bei chronischen Nieren- und Harnwegsentzündungen eingesetzt.',
          },
          {
            name: 'Beckenbodentherapie',
            detail: 'Gezieltes Training nach Prostataoperation zur Unterstützung der Kontinenz.',
          },
          {
            name: 'Physikalische Wärmeanwendungen im Beckenbereich',
            detail: 'Milde Anwendungen, traditionell bei chronischen Beschwerden im Beckenbereich eingesetzt.',
          },
          {
            name: 'Regelmäßige urologische Kontrolle',
            detail: 'Urin- und Laborwerte werden während des Aufenthalts wiederholt geprüft.',
          },
          {
            name: 'Bewegungstherapie auf den Kurwegen',
            detail: 'Allgemeine Bewegung als Bestandteil des Kurprogramms, unterstützt Kreislauf und Flüssigkeitsverteilung über den Tag.',
          },
          {
            name: 'Ernährungsberatung',
            detail: 'Ergänzt die Trinkkur bei chronischen Harnwegsbeschwerden.',
          },
          {
            name: 'Entspannungsverfahren',
            detail: 'Ergänzender Bestandteil des Programms bei chronisch-rezidivierenden Beschwerden.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Bei chronischen Nieren- und Harnwegsentzündungen (Position VIII/1) trägt die tschechische Krankenkasse 21 Tage komplexe oder Zuschuss-Kurbehandlung, Wiederholungsaufenthalte 21 oder 14 Tage Zuschuss; nach Operationen an Niere und Harnwegen (VIII/3) sind es 21 Tage; bei chronischer Prostatitis (VIII/4) 21 Tage Zuschuss-Kurbehandlung, Wiederholungsaufenthalte 21 oder 14 Tage. Selbstzahler wählen meist zwei bis drei Wochen. Für die Jahreszeit gibt es keine medizinische Vorgabe.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body: 'Für chronische Pyelonephritis liegen zwei kontrollierte russische Studien vor: Bei 48 Patienten in der latenten Phase ging unter einer ergänzenden Trinkkur von bis zu 2 l Mineralwasser täglich bei 91 % der Wassergruppe die klinische Symptomatik zurück, mit durchgängig sterilen Urinkulturen (Nejmark AI et al., 2020, Urol Vedomosti; kleine, nicht verblindete Studie). Eine ältere Studie mit 95 Patienten in der aktiven Phase fand unter Antibiotika plus hydrogenkarbonathaltigem Wasser sterilen Urin bei 88,6 % und 25,6 % weniger Rückfälle über zwei Jahre gegenüber Antibiotika allein (Neimark AI et al., 2004, Vopr Kurortol; ältere, nicht randomisierte Studie). Für die chronische Prostatitis fasst ein Cochrane-Review zusammen, dass Akupunktur und Stoßwellentherapie mit mittlerer bis hoher Ergebnissicherheit helfen und Bewegungsprogramme mit niedriger Sicherheit — eine Kurbehandlung als Ganzes wurde darin nicht untersucht (Franco JVA et al., 2019, BJU Int). Eine kleine koreanische Pilotstudie mit 16 Personen mit chronischem Beckenschmerzsyndrom fand nach fünf Tagen Balneotherapie eine Linderung von Schmerz und Harnsymptomen sowie einen Rückgang der Entzündungsmarker IL-1 und TNF-α (Min K et al., 2020, J Obstet Gynaecol; sehr kleine Stichprobe, ohne Kontrollgruppe). In Marienbad selbst läuft seit 2026 erstmals seit 30 Jahren eine klinische Studie zu den objektiven Effekten der Kurbehandlung bei urologischen und nephrologischen Diagnosen mit über 100 begleiteten Patienten; Ergebnisse liegen noch nicht vor (Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně, 2026, ClinicalTrials.gov NCT07435844). Keine dieser Studien zeigt, dass die Kur eine floride Infektion oder eine strukturelle urologische Erkrankung heilt; sie ergänzt die urologische Behandlung, ersetzt sie aber nicht.',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer urologischen Vorgeschichte. Diese Seite informiert und ersetzt keine urologische Beratung.',
        faqs: [
          {
            question: 'Welche Kurorte sind für urologische Beschwerden geeignet?',
            answer: 'Geeignet sind Kurorte, die chronische Harnwegsentzündungen, Zustände nach urologischen Operationen oder chronische Prostatitis als offizielle Indikation führen und urologische Betreuung während des Aufenthalts anbieten. Marienbad erfüllt das über die Positionen VIII/1, VIII/3 und VIII/4 der tschechischen Indikationsliste und stützt sich dabei auf die Trinkkur aus den ortseigenen Mineralquellen.',
          },
          {
            question: 'Wie verläuft die Rehabilitation nach einer Prostataoperation?',
            answer: 'Voraussetzung ist eine abgeschlossene Wundheilung und die Freigabe des Operateurs. Der Kurarzt sichtet den Operationsbericht, danach folgen Beckenbodentherapie zur Unterstützung der Kontinenz, die Trinkkur und dosierte Bewegung, mit wöchentlicher Kontrolle und einem Abschlussbericht für den Urologen.',
          },
          {
            question: 'Sind Marienbads Quellen bei Harnwegsinfekten geeignet?',
            answer: 'Bei akuten, fieberhaften Infekten ist zunächst eine antibiotische Akutbehandlung nötig, keine Kur. Für rezidivierende oder chronische, antibiotikaresistente Nieren- und Harnwegsentzündungen in laufender urologischer Betreuung führt Marienbad eine eigene Indikation (VIII/1); kontrollierte russische Studien beschreiben unter ergänzender Trinkkur einen Rückgang klinischer Beschwerden und sterile Urinkulturen bei einem Großteil der behandelten Patienten.',
          },
          {
            question: 'Wie lange dauert eine Kur bei chronischer Prostatitis?',
            answer: 'Nach der tschechischen Indikationsliste sind es bei Position VIII/4 21 Tage Zuschuss-Kurbehandlung, bei Wiederholungsaufenthalten auch 14 Tage. Voraussetzung ist eine mindestens zwölfmonatige urologische Betreuung ohne ausreichendes Ansprechen auf Medikamente und Antibiotika.',
          },
          {
            question: 'Was ist bei einer akuten Blasenentzündung zu tun?',
            answer: 'Eine akute Blasen- oder Harnwegsentzündung mit Fieber wird nicht in der Kur behandelt, sondern zunächst urologisch oder hausärztlich mit Antibiotika. Erst chronische, wiederkehrende oder therapieresistente Verläufe in laufender urologischer Betreuung sind eine Indikation für die Kur.',
          },
        ],
        sources: [
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe VIII — Krankheiten des Harnsystems',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Positionen VIII/1 (chronische Nieren- und Harnwegsentzündungen), VIII/3 (Zustände nach urologischen Operationen) und VIII/4 (chronische Prostatitis) mit Versorgungsart und Dauer.',
          },
          {
            title: 'Nejmark AI et al. 2020, Urol Vedomosti — kontrollierte Studie, 48 Patienten mit chronischer Pyelonephritis',
            url: 'https://consensus.app/papers/details/454b649ed6a757d58534c939e4796fe8/',
            note: 'Ergänzende Trinkkur: Rückgang klinischer Symptomatik bei 91 %, durchgängig sterile Urinkulturen. Kleine, nicht verblindete Studie.',
          },
          {
            title: 'Neimark AI et al. 2004, Vopr Kurortol — kontrollierte Studie, 95 Patienten mit chronischer Pyelonephritis',
            url: 'https://consensus.app/papers/details/a54c04d759fa5caca9519c669fdd6099/',
            note: 'Antibiotika plus hydrogenkarbonathaltiges Wasser: sterile Urinkultur bei 88,6 %, 25,6 % weniger Rückfälle über 2 Jahre. Ältere, nicht randomisierte Studie.',
          },
          {
            title: 'Franco JVA et al. 2019, BJU Int — Cochrane-Review, 38 Studien zur chronischen Prostatitis',
            url: 'https://doi.org/10.1111/bju.14492',
            note: 'Akupunktur und Stoßwellentherapie mit mittlerer bis hoher Evidenzsicherheit hilfreich; Kurbehandlung als Ganzes nicht untersucht.',
          },
          {
            title: 'Min K et al. 2020, J Obstet Gynaecol — Pilotstudie, 16 Personen mit chronischem Beckenschmerzsyndrom',
            url: 'https://doi.org/10.1080/01443615.2019.1631771',
            note: '5 Tage Balneotherapie: Linderung von Schmerz und Harnsymptomen, Rückgang von IL-1 und TNF-α. Sehr kleine Stichprobe, ohne Kontrollgruppe.',
          },
          {
            title: 'Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně 2026, ClinicalTrials.gov (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Laufende klinische Studie zur Kurbehandlung bei urologischen und nephrologischen Diagnosen in Marienbad, über 100 Patienten. Ergebnisse noch nicht verfügbar.',
          },
        ],
        related: [
          {
            label: 'Nieren und Harnwege: Trinkkur und Kurbehandlung',
            href: '/de/magazin/nieren-harnwege-behandlung',
          },
          {
            label: 'Trinkkur — Ratgeber zu den Quellen',
            href: '/de/magazin/trinkkur-ratgeber',
          },
          {
            label: 'Ambulante Behandlung',
            href: '/de/ambulante-behandlung',
          },
          {
            label: 'Indikationen und Kontraindikationen',
            href: '/de/indikationen-und-kontraindikationen',
          },
        ],
      },
      en: {
        slug: 'urological-conditions',
        navLabel: 'Urological conditions',
        title: 'Spa treatment for urological conditions in Marienbad',
        h1: 'Spa treatment for urological conditions',
        metaTitle: 'Spa treatment for urological conditions Marienbad | Marienbad.com',
        metaDescription:
          'Chronic urinary tract infections, conditions after prostate surgery and chronic prostatitis: treatment, drinking cure and length of stay in Marienbad.',
        lead:
          'Among urological conditions, the Czech indication list lists chronic, treatment-resistant kidney and urinary tract infections, conditions after operations on the kidneys and urinary tract, and chronic prostatitis, among others. Marienbad has treated this group since the 19th century mainly through the drinking cure from its own mineral springs, supplemented by urologically prescribed physical therapy.',
        teaser: 'Chronic urinary tract infections, conditions after prostate surgery and chronic prostatitis: drinking cure, pelvic floor therapy and urological monitoring.',
        treats: [
          'Recurrent and chronic, non-tuberculous kidney and urinary tract infections that do not respond sufficiently to antibiotics, under ongoing urological care for at least 12 months',
          'Cystic kidney disease',
          'Conditions after operations on the kidneys and urinary tract, including endovesical procedures and complicated prostatectomy',
          'Chronic prostatitis or prostatovesiculitis that does not respond sufficiently to drug therapy and antibiotics, under ongoing urological care for at least 12 months',
        ],
        notFor: [
          'An acute urinary tract infection with fever or active bacterial inflammation',
          'A recent operation without completed wound healing and without specialist clearance',
          'Unexplained macroscopic haematuria, or suspicion of a tumour of the urinary tract',
          'General contraindications: uncontrolled heart failure, active cancer, pregnancy',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: 'The spa physician reviews your urological history, previous cultures and antibiotic courses, and the surgical report where relevant, and puts together the treatment plan. Bring your urologist’s current report.',
          },
          {
            heading: 'Drinking cure and daily treatments',
            body: 'The drinking cure from the assigned springs forms the basis, supplemented by urologically prescribed physical therapy and, after prostate surgery, pelvic floor therapy.',
          },
          {
            heading: 'Movement as the second pillar',
            body: 'Walks on the spa paths and targeted pelvic floor exercises support continence after surgical procedures and general circulation.',
          },
          {
            heading: 'Weekly check-up and final report',
            body: 'The spa physician checks urine findings and adjusts the programme. At the end you receive a report for your urologist and recommendations for home.',
          },
        ],
        procedures: [
          {
            name: 'Drinking cure at the mineral springs',
            detail: 'Regular drinking to increase urine volume; traditionally used for chronic kidney and urinary tract infections.',
          },
          {
            name: 'Pelvic floor therapy',
            detail: 'Targeted training after prostate surgery to support continence.',
          },
          {
            name: 'Physical heat treatments in the pelvic area',
            detail: 'Mild treatments, traditionally used for chronic complaints in the pelvic area.',
          },
          {
            name: 'Regular urological monitoring',
            detail: 'Urine and lab values are checked repeatedly during the stay.',
          },
          {
            name: 'Exercise therapy on the spa paths',
            detail: 'General movement as part of the spa programme, supporting circulation and fluid distribution through the day.',
          },
          {
            name: 'Nutrition counselling',
            detail: 'Supplements the drinking cure for chronic urinary tract complaints.',
          },
          {
            name: 'Relaxation techniques',
            detail: 'A supplementary part of the programme for chronic, recurrent complaints.',
          },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'For chronic kidney and urinary tract infections (position VIII/1), stays covered by Czech public health insurance run to 21 days of comprehensive or contributory spa care, with repeat stays of 21 or 14 days of contributory care; following operations on the kidneys and urinary tract (VIII/3), it is 21 days; for chronic prostatitis (VIII/4), 21 days of contributory spa care, with repeat stays of 21 or 14 days. Self-paying guests usually choose two to three weeks. There is no medical rule for the season.',
        },
        evidence: {
          heading: 'What the studies show',
          body: 'For chronic pyelonephritis there are two controlled Russian studies: in 48 patients in the latent phase, a supplementary drinking cure of up to 2 l of mineral water daily reduced clinical symptoms in 91% of the water group, with consistently sterile urine cultures (Nejmark AI et al., 2020, Urol Vedomosti; small, unblinded study). An older study of 95 patients in the active phase found, under antibiotics plus bicarbonate-containing water, sterile urine in 88.6% and 25.6% fewer relapses over two years compared with antibiotics alone (Neimark AI et al., 2004, Vopr Kurortol; older, non-randomised study). For chronic prostatitis, a Cochrane review sums up that acupuncture and shock wave therapy help with moderate to high certainty of evidence, and exercise programmes with low certainty — a spa cure as a whole was not studied in it (Franco JVA et al., 2019, BJU Int). A small Korean pilot study of 16 people with chronic pelvic pain syndrome found, after five days of balneotherapy, relief of pain and urinary symptoms and a fall in the inflammatory markers IL-1 and TNF-α (Min K et al., 2020, J Obstet Gynaecol; a very small sample, no control group). In Marienbad itself, a clinical study on the objective effects of spa treatment for urological and nephrological diagnoses has been running since 2026 — the first in 30 years — following more than 100 patients; results are not yet available (Institute of Spa Treatment and Balneology & Léčebné lázně Mariánské Lázně, 2026, ClinicalTrials.gov NCT07435844). None of these studies shows that the cure heals an active infection or a structural urological disease; it supplements urological treatment but does not replace it.',
        },
        physicianNote: 'Whether and to what extent a spa cure is right for you is decided by the spa physician at the initial examination, based on your urological history. This page provides information and does not replace urological advice.',
        faqs: [
          {
            question: 'Which spa resorts are suitable for urological conditions?',
            answer: 'Suitable resorts list chronic urinary tract infections, conditions after urological operations or chronic prostatitis as official indications and offer urological care during the stay. Marienbad meets this through positions VIII/1, VIII/3 and VIII/4 of the Czech indication list, drawing on the drinking cure from its own mineral springs.',
          },
          {
            question: 'How does rehabilitation after prostate surgery work?',
            answer: 'The requirement is completed wound healing and clearance from the surgeon. The spa physician reviews the surgical report, followed by pelvic floor therapy to support continence, the drinking cure and measured exercise, with a weekly check-up and a final report for the urologist.',
          },
          {
            question: 'Are Marienbad’s springs suitable for urinary tract infections?',
            answer: 'For acute, feverish infections, acute antibiotic treatment is needed first, not a spa cure. For recurrent or chronic, antibiotic-resistant kidney and urinary tract infections under ongoing urological care, Marienbad lists its own indication (VIII/1); controlled Russian studies describe a fall in clinical complaints and sterile urine cultures in most treated patients under a supplementary drinking cure.',
          },
          {
            question: 'How long does a spa cure for chronic prostatitis last?',
            answer: 'Under the Czech indication list, position VIII/4 runs to 21 days of contributory spa care, with 14 days also possible on repeat stays. The requirement is at least twelve months of urological care without a sufficient response to medication and antibiotics.',
          },
          {
            question: 'What should be done for an acute bladder infection?',
            answer: 'An acute bladder or urinary tract infection with fever is not treated at the spa but first urologically or by a family doctor with antibiotics. Only chronic, recurrent or treatment-resistant courses under ongoing urological care are an indication for the spa cure.',
          },
        ],
        sources: [
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group VIII — diseases of the urinary system',
            url: '/en/indications-and-contraindications',
            note: 'Positions VIII/1 (chronic kidney and urinary tract infections), VIII/3 (conditions after urological operations) and VIII/4 (chronic prostatitis), with type of care and length.',
          },
          {
            title: 'Nejmark AI et al. 2020, Urol Vedomosti — controlled study, 48 patients with chronic pyelonephritis',
            url: 'https://consensus.app/papers/details/454b649ed6a757d58534c939e4796fe8/',
            note: 'Supplementary drinking cure: reduction in clinical symptoms in 91%, consistently sterile urine cultures. Small, unblinded study.',
          },
          {
            title: 'Neimark AI et al. 2004, Vopr Kurortol — controlled study, 95 patients with chronic pyelonephritis',
            url: 'https://consensus.app/papers/details/a54c04d759fa5caca9519c669fdd6099/',
            note: 'Antibiotics plus bicarbonate-containing water: sterile urine culture in 88.6%, 25.6% fewer relapses over 2 years. Older, non-randomised study.',
          },
          {
            title: 'Franco JVA et al. 2019, BJU Int — Cochrane review, 38 studies on chronic prostatitis',
            url: 'https://doi.org/10.1111/bju.14492',
            note: 'Acupuncture and shock wave therapy helpful with moderate to high certainty of evidence; spa treatment as a whole not studied.',
          },
          {
            title: 'Min K et al. 2020, J Obstet Gynaecol — pilot study, 16 people with chronic pelvic pain syndrome',
            url: 'https://doi.org/10.1080/01443615.2019.1631771',
            note: '5 days of balneotherapy: relief of pain and urinary symptoms, fall in IL-1 and TNF-α. Very small sample, no control group.',
          },
          {
            title: 'Institute of Spa Treatment and Balneology & Léčebné lázně Mariánské Lázně 2026, ClinicalTrials.gov (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Ongoing clinical study on spa treatment for urological and nephrological diagnoses in Marienbad, over 100 patients. Results not yet available.',
          },
        ],
        related: [
          {
            label: 'Kidney and urinary treatment',
            href: '/en/magazine/kidney-urinary-treatment',
          },
          {
            label: 'Drinking cure — a guide to the springs',
            href: '/en/magazine/drinking-cure-guide',
          },
          {
            label: 'Outpatient treatment',
            href: '/en/outpatient-treatment',
          },
          {
            label: 'Indications and contraindications',
            href: '/en/indications-and-contraindications',
          },
        ],
      },
      cs: {
        slug: 'urologicke-potize',
        navLabel: 'Urologické potíže',
        title: 'Lázeňská léčba urologických potíží v Mariánských Lázních',
        h1: 'Lázeňská léčba urologických potíží',
        metaTitle: 'Léčba urologických potíží v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Chronické záněty močových cest, stavy po operaci prostaty a chronická prostatitida: léčba, pitná kúra a délka pobytu v Mariánských Lázních.',
        lead: 'Mezi urologické potíže patří podle indikačního seznamu mimo jiné chronické, na léčbu obtížně reagující záněty ledvin a močových cest, stavy po operacích ledvin a močových cest a chronická prostatitida. Mariánské Lázně tuto skupinu léčí od 19. století především pitnou kúrou z místních minerálních pramenů, doplněnou o urologem předepsanou fyzikální terapii.',
        teaser: 'Chronické záněty močových cest, stavy po operaci prostaty a chronická prostatitida: pitná kúra, terapie pánevního dna a urologická kontrola průběhu.',
        treats: [
          'Opakující se a chronické, netuberkulózní záněty ledvin a močových cest, které dostatečně nereagují na antibiotika, v průběžné urologické péči alespoň 12 měsíců',
          'Cystická onemocnění ledvin',
          'Stavy po operacích ledvin a močových cest, včetně endovezikálních zákroků a komplikované prostatektomie',
          'Chronická prostatitida nebo prostatovezikulitida, která dostatečně nereaguje na medikamentózní léčbu a antibiotika, v průběžné urologické péči alespoň 12 měsíců',
        ],
        notFor: [
          'Akutní infekce močových cest s horečkou nebo aktivní bakteriální zánět',
          'Čerstvá operace bez zhojené rány a bez souhlasu odborného lékaře',
          'Nevyjasněná makrohematurie nebo podezření na nádor močových cest',
          'Obecné kontraindikace: nekontrolované srdeční selhání, aktivní nádorové onemocnění, těhotenství',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde urologickou anamnézu, dřívější kultivace a antibiotickou léčbu, případně operační zprávu, a sestaví léčebný plán. Vezměte si aktuální zprávu svého urologa.',
          },
          {
            heading: 'Pitná kúra a denní procedury',
            body: 'Základ tvoří pitná kúra z přidělených pramenů, doplněná urologem předepsanou fyzikální terapií a po operaci prostaty terapií pánevního dna.',
          },
          {
            heading: 'Pohyb jako druhý pilíř',
            body: 'Procházky po kolonádě a cílená cvičení pánevního dna podporují kontinenci po operačních zákrocích a celkový krevní oběh.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Lázeňský lékař kontroluje nálezy moči a upravuje program. Na závěr dostanete zprávu pro svého urologa a doporučení domů.',
          },
        ],
        procedures: [
          {
            name: 'Pitná kúra u minerálních pramenů',
            detail: 'Pravidelné pití ke zvýšení množství moči; tradičně používané u chronických zánětů ledvin a močových cest.',
          },
          {
            name: 'Terapie pánevního dna',
            detail: 'Cílený trénink po operaci prostaty na podporu kontinence.',
          },
          {
            name: 'Fyzikální tepelné procedury v oblasti pánve',
            detail: 'Mírné procedury, tradičně používané u chronických potíží v oblasti pánve.',
          },
          {
            name: 'Pravidelná urologická kontrola',
            detail: 'Hodnoty moči a další laboratorní parametry se během pobytu opakovaně kontrolují.',
          },
          {
            name: 'Pohybová terapie na kolonádě',
            detail: 'Obecný pohyb jako součást lázeňského programu, podporuje krevní oběh a rozložení tekutin během dne.',
          },
          {
            name: 'Nutriční poradenství',
            detail: 'Doplňuje pitnou kúru u chronických potíží s močovými cestami.',
          },
          {
            name: 'Relaxační techniky',
            detail: 'Doplňková součást programu u chronicky recidivujících potíží.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Chronické záněty ledvin a močových cest (položka VIII/1), stavy po operacích ledvin a močových cest (VIII/3) i chronická prostatitida (VIII/4) mají hrazenou délku pobytu podle indikačního seznamu; přesný rozpis najdete na stránce Co hradí pojišťovna u ledvin a močových cest. Samoplátci volí obvykle dva až tři týdny. Pro roční období neexistuje lékařský předpis.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'K chronické pyelonefritidě existují dvě kontrolované ruské studie: u 48 pacientů v latentní fázi ustoupily při doplňkové pitné kúře do 2 l minerální vody denně klinické příznaky u 91 % skupiny s vodou, s trvale sterilními kulturami moči (Nejmark AI a kol., 2020, Urol Vedomosti; malá, nezaslepená studie). Starší studie s 95 pacienty v aktivní fázi zjistila při antibiotikách plus hydrogenuhličitanové vodě sterilní moč u 88,6 % a o 25,6 % méně recidiv za dva roky oproti samotným antibiotikům (Neimark AI a kol., 2004, Vopr Kurortol; starší, nerandomizovaná studie). K chronické prostatitidě shrnuje Cochranův přehled, že akupunktura a rázová vlna pomáhají se střední až vysokou jistotou výsledků a pohybové programy s nízkou jistotou — lázeňská léčba jako celek v něm zkoumána nebyla (Franco JVA a kol., 2019, BJU Int). Malá korejská pilotní studie s 16 osobami s chronickým syndromem pánevní bolesti zjistila po pěti dnech balneoterapie zmírnění bolesti a močových příznaků a pokles zánětlivých markerů IL-1 a TNF-α (Min K a kol., 2020, J Obstet Gynaecol; velmi malý vzorek, bez kontrolní skupiny). V Mariánských Lázních samotných probíhá od roku 2026 poprvé po 30 letech klinická studie k objektivním účinkům lázeňské léčby u urologických a nefrologických diagnóz, zapojeno je přes 100 sledovaných pacientů; výsledky zatím nejsou k dispozici (Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně, 2026, ClinicalTrials.gov NCT07435844). Žádná z těchto studií neukazuje, že lázeňská léčba vyléčí akutní infekci nebo strukturální urologické onemocnění; doplňuje urologickou léčbu, nenahrazuje ji.',
        },
        physicianNote: 'O tom, zda a v jakém rozsahu pro vás lázeňská léčba připadá v úvahu, rozhoduje lázeňský lékař při vstupní prohlídce podle vaší urologické anamnézy. Tato stránka informuje a nenahrazuje urologickou konzultaci.',
        faqs: [
          {
            question: 'Kam na lázně s urologickými potížemi?',
            answer: 'Vhodné jsou lázně, které vedou chronické záněty močových cest, stavy po urologických operacích nebo chronickou prostatitidu jako oficiální indikaci a nabízejí během pobytu urologickou péči. Mariánské Lázně to splňují přes položky VIII/1, VIII/3 a VIII/4 indikačního seznamu a opírají se přitom o pitnou kúru z místních minerálních pramenů.',
          },
          {
            question: 'Jak probíhá rehabilitace po operaci prostaty?',
            answer: 'Podmínkou je zhojená rána a souhlas operatéra. Lázeňský lékař projde operační zprávu, poté následuje terapie pánevního dna na podporu kontinence, pitná kúra a dávkovaný pohyb, s týdenní kontrolou a závěrečnou zprávou pro urologa.',
          },
          {
            question: 'Jsou mariánskolázeňské prameny vhodné při zánětech močových cest?',
            answer: 'Při akutních, horečnatých infekcích je nejprve nutná akutní antibiotická léčba, ne lázeňský pobyt. Pro opakující se nebo chronické, na antibiotika obtížně reagující záněty ledvin a močových cest v průběžné urologické péči vedou Mariánské Lázně samostatnou indikaci (VIII/1); kontrolované ruské studie popisují při doplňkové pitné kúře ústup klinických potíží a sterilní kultury moči u velké části léčených pacientů.',
          },
          {
            question: 'Jak dlouho trvá lázeňský pobyt při chronické prostatitidě?',
            answer: 'Podle indikačního seznamu jde u položky VIII/4 o délku pobytu, kterou konkrétně rozepisuje stránka Co hradí pojišťovna u ledvin a močových cest. Podmínkou je alespoň dvanáctiměsíční urologická péče bez dostatečné odezvy na léky a antibiotika.',
          },
          {
            question: 'Co dělat při akutním zánětu močového měchýře?',
            answer: 'Akutní zánět močového měchýře nebo močových cest s horečkou se v lázních neléčí, nejprve je nutná urologická nebo praktická léčba antibiotiky. Až chronické, opakující se nebo na léčbu obtížně reagující průběhy v průběžné urologické péči jsou indikací pro lázeňský pobyt.',
          },
        ],
        sources: [
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina VIII — nemoci močového systému',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Položky VIII/1 (chronické záněty ledvin a močových cest), VIII/3 (stavy po urologických operacích) a VIII/4 (chronická prostatitida) s typem péče a délkou.',
          },
          {
            title: 'Nejmark AI a kol. 2020, Urol Vedomosti — kontrolovaná studie, 48 pacientů s chronickou pyelonefritidou',
            url: 'https://consensus.app/papers/details/454b649ed6a757d58534c939e4796fe8/',
            note: 'Doplňková pitná kúra: ústup klinických příznaků u 91 %, trvale sterilní kultury moči. Malá, nezaslepená studie.',
          },
          {
            title: 'Neimark AI a kol. 2004, Vopr Kurortol — kontrolovaná studie, 95 pacientů s chronickou pyelonefritidou',
            url: 'https://consensus.app/papers/details/a54c04d759fa5caca9519c669fdd6099/',
            note: 'Antibiotika plus hydrogenuhličitanová voda: sterilní moč u 88,6 %, o 25,6 % méně recidiv za 2 roky. Starší, nerandomizovaná studie.',
          },
          {
            title: 'Franco JVA a kol. 2019, BJU Int — Cochranův přehled, 38 studií k chronické prostatitidě',
            url: 'https://doi.org/10.1111/bju.14492',
            note: 'Akupunktura a rázová vlna se střední až vysokou jistotou důkazů pomáhají; lázeňská léčba jako celek nezkoumána.',
          },
          {
            title: 'Min K a kol. 2020, J Obstet Gynaecol — pilotní studie, 16 osob s chronickým syndromem pánevní bolesti',
            url: 'https://doi.org/10.1080/01443615.2019.1631771',
            note: '5 dní balneoterapie: zmírnění bolesti a močových příznaků, pokles IL-1 a TNF-α. Velmi malý vzorek, bez kontrolní skupiny.',
          },
          {
            title: 'Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně 2026, ClinicalTrials.gov (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Probíhající klinická studie k lázeňské léčbě urologických a nefrologických diagnóz v Mariánských Lázních, přes 100 pacientů. Výsledky zatím nejsou k dispozici.',
          },
        ],
        related: [
          {
            label: 'Léčba ledvin a močových cest',
            href: '/cs/magazin/lecba-ledvin-mocovych-cest',
          },
          {
            label: 'Průvodce pitnou kúrou',
            href: '/cs/magazin/pitna-kura-pruvodce',
          },
          {
            label: 'Ambulantní léčba',
            href: '/cs/ambulantni-lecba',
          },
          {
            label: 'Co hradí pojišťovna u ledvin a močových cest',
            href: '/cs/lazne-s-pojistovnou/indikace/ledviny-a-mocove-cesty',
          },
        ],
      },
      ru: {
        slug: 'urologicheskie-zabolevaniya',
        navLabel: 'Урологические заболевания',
        title: 'Курортное лечение урологических заболеваний в Марианских Лазнях',
        h1: 'Курортное лечение урологических заболеваний',
        metaTitle: 'Урологические заболевания — Марианские Лазни | Marienbad.com',
        metaDescription: 'Хронические воспаления мочевых путей, состояния после операции на простате и хронический простатит: лечение, питьевой курс и сроки в Марианских Лазнях.',
        lead: 'Среди урологических заболеваний чешский индикационный список выделяет, в частности, хронические, резистентные к терапии воспаления почек и мочевых путей, состояния после операций на почках и мочевых путях, а также хронический простатит. В Марианских Лазнях эту группу лечат с XIX века прежде всего питьевым курсом из собственных минеральных источников, дополненным назначенной урологом физиотерапией.',
        teaser: 'Хронические воспаления мочевых путей, состояния после операции на простате и хронический простатит: питьевой курс, терапия тазового дна и урологический контроль динамики.',
        treats: [
          'Рецидивирующие и хронические, нетуберкулёзные воспаления почек и мочевых путей, недостаточно отвечающие на антибиотики, при постоянном урологическом наблюдении не менее 12 месяцев',
          'Кистозные заболевания почек',
          'Состояния после операций на почках и мочевых путях, включая эндовезикальные вмешательства и осложнённую простатэктомию',
          'Хронический простатит или простатовезикулит, недостаточно отвечающий на медикаментозную терапию и антибиотики, при постоянном урологическом наблюдении не менее 12 месяцев',
        ],
        notFor: [
          'Острая инфекция мочевых путей с лихорадкой или активное бактериальное воспаление',
          'Свежая операция без завершённого заживления раны и без разрешения профильного врача',
          'Невыясненная макрогематурия или подозрение на опухоль мочевых путей',
          'Общие противопоказания: неконтролируемая сердечная недостаточность, активное онкологическое заболевание, беременность',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает урологический анамнез, предыдущие посевы и курсы антибиотиков, а также, при необходимости, выписку из операции, и составляет план лечения. Возьмите с собой актуальное заключение вашего уролога.',
          },
          {
            heading: 'Питьевой курс и ежедневные процедуры',
            body: 'Основу составляет питьевой курс из назначенных источников, дополненный назначенной урологом физиотерапией и, после операции на простате, терапией тазового дна.',
          },
          {
            heading: 'Движение как вторая опора',
            body: 'Прогулки по курортным маршрутам и целенаправленные упражнения для тазового дна поддерживают удержание мочи после операционных вмешательств и общее кровообращение.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Курортный врач контролирует показатели мочи и корректирует программу. По окончании вы получаете заключение для вашего уролога и рекомендации на дом.',
          },
        ],
        procedures: [
          {
            name: 'Питьевой курс у минеральных источников',
            detail: 'Регулярное питьё для увеличения объёма мочи; традиционно применяется при хронических воспалениях почек и мочевых путей.',
          },
          {
            name: 'Терапия тазового дна',
            detail: 'Целенаправленная тренировка после операции на простате для поддержки удержания мочи.',
          },
          {
            name: 'Физиотерапевтические тепловые процедуры в области таза',
            detail: 'Мягкие процедуры, традиционно применяемые при хронических жалобах в области таза.',
          },
          {
            name: 'Регулярный урологический контроль',
            detail: 'Показатели мочи и другие лабораторные значения повторно проверяются в течение пребывания.',
          },
          {
            name: 'Двигательная терапия на курортных маршрутах',
            detail: 'Общее движение как часть курортной программы, поддерживает кровообращение и распределение жидкости в течение дня.',
          },
          {
            name: 'Консультация по питанию',
            detail: 'Дополняет питьевой курс при хронических жалобах со стороны мочевых путей.',
          },
          {
            name: 'Техники релаксации',
            detail: 'Дополнительная часть программы при хронически рецидивирующих жалобах.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'При хронических воспалениях почек и мочевых путей (позиция VIII/1) для пребываний, оплачиваемых чешской страховой, предусмотрено 21 день комплексного или долевого курортного лечения, повторные пребывания — 21 или 14 дней с долевым финансированием; после операций на почках и мочевых путях (VIII/3) — также 21 день; при хроническом простатите (VIII/4) — 21 день долевого курортного лечения, повторные пребывания — 21 или 14 дней. Гости, оплачивающие лечение самостоятельно, обычно выбирают две-три недели. Для времени года медицинских рекомендаций нет.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'По хроническому пиелонефриту имеются два контролируемых российских исследования: у 48 пациентов в латентной фазе на фоне дополнительного питьевого курса объёмом до 2 л минеральной воды в день у 91 % группы, пившей воду, клиническая симптоматика отступила, а посевы мочи стабильно оставались стерильными (Нейманов А.И. и соавт., 2020, Урологические ведомости; небольшое, неослеплённое исследование). Более старое исследование с 95 пациентами в активной фазе обнаружило на фоне антибиотиков и гидрокарбонатной воды стерильную мочу у 88,6 % и на 25,6 % меньше рецидивов за два года по сравнению с одними антибиотиками (Неймарк А.И. и соавт., 2004, Вопросы курортологии; более старое, нерандомизированное исследование). По хроническому простатиту Кокрейновский обзор подводит итог: акупунктура и ударно-волновая терапия помогают с умеренной или высокой достоверностью результатов, а программы движения — с низкой достоверностью; курортное лечение в целом там не изучалось (Franco JVA et al., 2019, BJU Int). Небольшое корейское пилотное исследование с 16 пациентами с синдромом хронической тазовой боли обнаружило после пяти дней бальнеотерапии облегчение боли и симптомов со стороны мочевых путей, а также снижение маркеров воспаления IL-1 и TNF-α (Min K et al., 2020, J Obstet Gynaecol; очень маленькая выборка, без контрольной группы). В самих Марианских Лазнях с 2026 года впервые за 30 лет проводится клиническое исследование объективных эффектов курортного лечения при урологических и нефрологических диагнозах, охватывающее более 100 наблюдаемых пациентов; результаты пока не опубликованы (Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně, 2026, ClinicalTrials.gov NCT07435844). Ни одно из этих исследований не показывает, что курортное лечение излечивает активную инфекцию или структурное урологическое заболевание; оно дополняет урологическое лечение, но не заменяет его.',
        },
        physicianNote: 'Показано ли вам курортное лечение и в каком объёме, решает курортный врач при первичном осмотре на основании вашего урологического анамнеза. Эта страница носит информационный характер и не заменяет консультацию уролога.',
        faqs: [
          {
            question: 'Какие курорты подходят при урологических заболеваниях?',
            answer: 'Подходят курорты, где хронические воспаления мочевых путей, состояния после урологических операций или хронический простатит указаны как официальное показание и предлагается урологическое наблюдение во время пребывания. Марианские Лазни отвечают этому через позиции VIII/1, VIII/3 и VIII/4 чешского индикационного списка и опираются на питьевой курс из собственных минеральных источников.',
          },
          {
            question: 'Как проходит реабилитация после операции на простате?',
            answer: 'Условие — завершённое заживление раны и разрешение оперировавшего врача. Курортный врач изучает выписку из операции, после чего следует терапия тазового дна для поддержки удержания мочи, питьевой курс и дозированное движение, с еженедельным контролем и итоговым заключением для уролога.',
          },
          {
            question: 'Подходят ли источники Марианских Лазней при воспалениях мочевых путей?',
            answer: 'При острых, лихорадочных инфекциях сначала необходимо антибактериальное лечение, а не курортное. Для рецидивирующих или хронических, устойчивых к антибиотикам воспалений почек и мочевых путей при постоянном урологическом наблюдении в Марианских Лазнях выделено отдельное показание (VIII/1); контролируемые российские исследования описывают на фоне дополнительного питьевого курса снижение клинических жалоб и стерильные посевы мочи у большинства пролеченных пациентов.',
          },
          {
            question: 'Сколько длится курортное лечение при хроническом простатите?',
            answer: 'По чешскому индикационному списку для позиции VIII/4 предусмотрено 21 день долевого курортного лечения, при повторных пребываниях также 14 дней. Условие — не менее двенадцати месяцев урологического наблюдения без достаточного ответа на медикаменты и антибиотики.',
          },
          {
            question: 'Что делать при остром цистите?',
            answer: 'Острое воспаление мочевого пузыря или мочевых путей с лихорадкой не лечат курортным методом, а сначала — урологически или у терапевта, антибиотиками. Показанием для курортного лечения являются только хронические, рецидивирующие или устойчивые к терапии формы при постоянном урологическом наблюдении.',
          },
        ],
        sources: [
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа VIII — заболевания мочевыделительной системы',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Позиции VIII/1 (хронические воспаления почек и мочевых путей), VIII/3 (состояния после урологических операций) и VIII/4 (хронический простатит) с видом и длительностью.',
          },
          {
            title: 'Нейманов А.И. и соавт. 2020, Урологические ведомости — контролируемое исследование, 48 пациентов с хроническим пиелонефритом',
            url: 'https://consensus.app/papers/details/454b649ed6a757d58534c939e4796fe8/',
            note: 'Дополнительный питьевой курс: снижение клинической симптоматики у 91 %, стабильно стерильные посевы мочи. Небольшое, неослеплённое исследование.',
          },
          {
            title: 'Неймарк А.И. и соавт. 2004, Вопросы курортологии — контролируемое исследование, 95 пациентов с хроническим пиелонефритом',
            url: 'https://consensus.app/papers/details/a54c04d759fa5caca9519c669fdd6099/',
            note: 'Антибиотики плюс гидрокарбонатная вода: стерильная моча у 88,6 %, на 25,6 % меньше рецидивов за 2 года. Более старое, нерандомизированное исследование.',
          },
          {
            title: 'Franco JVA et al. 2019, BJU Int — Кокрейновский обзор, 38 исследований по хроническому простатиту',
            url: 'https://doi.org/10.1111/bju.14492',
            note: 'Акупунктура и ударно-волновая терапия полезны с умеренной или высокой достоверностью доказательств; курортное лечение в целом не изучалось.',
          },
          {
            title: 'Min K et al. 2020, J Obstet Gynaecol — пилотное исследование, 16 человек с синдромом хронической тазовой боли',
            url: 'https://doi.org/10.1080/01443615.2019.1631771',
            note: '5 дней бальнеотерапии: облегчение боли и симптомов со стороны мочевых путей, снижение IL-1 и TNF-α. Очень маленькая выборка, без контрольной группы.',
          },
          {
            title: 'Institut lázeňství a balneologie & Léčebné lázně Mariánské Lázně 2026, ClinicalTrials.gov (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Проводимое клиническое исследование курортного лечения при урологических и нефрологических диагнозах в Марианских Лазнях, более 100 пациентов. Результаты пока не опубликованы.',
          },
        ],
        related: [
          {
            label: 'Почки и мочевые пути: питьевой курс и курортное лечение',
            href: '/ru/zhurnal/lechenie-pochek-mochevykh-putej',
          },
          {
            label: 'Путеводитель по питьевому курсу',
            href: '/ru/zhurnal/pitevoj-kurs-putevoditel',
          },
          {
            label: 'Амбулаторное лечение',
            href: '/ru/ambulatornoe-lechenie',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'oncology-aftercare',
    groupId: 'oncology',
    roman: 'I',
    codes: [
      'I/1',
    ],
    conditionName: 'Cancer rehabilitation',
    image: '/images/library/treatments/lymphatic-drainage-legs.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Therapeutin führt eine manuelle Lymphdrainage an den Beinen einer Gästin durch',
      en: 'A therapist performs manual lymphatic drainage on a guest’s legs',
      cs: 'Terapeutka provádí manuální lymfodrenáž na nohou lázeňské hostky',
      ru: 'Терапевт выполняет ручной лимфодренаж ног пациентки',
    },
    content: {
      de: {
        slug: 'nach-krebsbehandlung',
        navLabel: 'Nach einer Krebsbehandlung',
        title: 'Kur nach einer Krebsbehandlung in Marienbad',
        h1: 'Kur nach einer Krebsbehandlung',
        metaTitle: 'Kur nach einer Krebsbehandlung in Marienbad | Marienbad.com',
        metaDescription: 'Erholung nach der Krebstherapie in Marienbad: ärztlich geführtes Kurprogramm für Kondition, Ernährung und Alltag — Voraussetzungen, Ablauf und Dauer.',
        lead: 'Für Gäste, die eine Krebsbehandlung abgeschlossen haben, bietet Marienbad ein ärztlich geführtes Kurprogramm zur Regeneration von Kondition, Ernährung und seelischem Gleichgewicht. Voraussetzung ist eine abgeschlossene komplexe Krebstherapie ohne Anzeichen eines Rückfalls — die Kur tritt nicht an die Stelle der onkologischen Nachsorge.',
        teaser: 'Regeneration nach Chemo- oder Strahlentherapie: Mineralbäder, Ernährungsberatung und psychische Unterstützung unter ärztlicher Aufsicht, ab sieben Nächten.',
        treats: [
          'Onkologische Fälle nach abgeschlossener komplexer Krebsbehandlung ohne Anzeichen eines Rückfalls (Position I/1 der Indikationsliste)',
          'Anhaltende Erschöpfung und Verlust der körperlichen Kondition nach Chemotherapie oder Strahlentherapie',
          'Lymphödem nach Operation oder Bestrahlung',
          'Schmerzen des Bewegungsapparats oder des Nervensystems infolge der Behandlung',
          'Psychische Erschöpfung und der Bedarf an begleiteter Regeneration in der Remissionsphase',
        ],
        notFor: [
          'Laufende onkologische Behandlung oder eine Krebserkrankung mit klinisch feststellbaren Anzeichen des Andauerns oder Fortschreitens der Krankheit',
          'Akute Infektionskrankheiten und Zustände, bei denen eine Destabilisierung des Gesundheitszustands zu erwarten ist',
          'Ausgeprägte Kachexie, die eine intensive Rehabilitation unmöglich macht',
          'Schwangerschaft sowie Unfähigkeit zur Selbstversorgung ohne Begleitperson',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Ein Facharzt beurteilt Ihren aktuellen Gesundheitszustand, sichtet die Unterlagen zur abgeschlossenen Krebsbehandlung und legt die Ziele der Rekonvaleszenz fest. Bringen Sie den Abschlussbericht der onkologischen Behandlung und eine aktuelle Medikamentenliste mit — ohne sie fällt der Plan vorsichtiger aus.',
          },
          {
            heading: 'Bis zu drei Anwendungen täglich',
            body: 'Mineralbäder, trockene Gasbäder und Physiotherapie am Vormittag, danach Ruhe im Liegen. Die Belastung wird an Ihre individuelle Kondition angepasst, nicht an einen festen Plan.',
          },
          {
            heading: 'Ernährung und psychische Unterstützung',
            body: 'Eine Analyse der Körperzusammensetzung und ein individueller Speiseplan helfen, Nährstoffe aufzufüllen. Entspannungstechniken, Atemübungen und Gespräche unterstützen den Umgang mit Stress und Schlafproblemen — der Aufenthalt ersetzt dabei weder Psychotherapie noch psychiatrische Behandlung.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body: 'Der Arzt prüft wöchentlich den Verlauf, kontrolliert Laborwerte wie Glukose, Cholesterin sowie Leber- und Nierenfunktion und passt den Plan an. Zum Abschluss erhalten Sie einen Bericht für Ihren behandelnden Onkologen.',
          },
        ],
        procedures: [
          {
            name: 'Kohlensäurebad',
            detail: 'Mineralwasserbad mit natürlicher Kohlensäure zur Entspannung nach der belastenden Therapie; über die Haut aufgenommenes CO₂ steigert die Hautdurchblutung.',
          },
          {
            name: 'Trockenes Gasbad',
            detail: 'CO₂-Gasbad im Mariengas ohne Kreislaufbelastung durch Wasser — geeignet, wenn ein Vollbad noch zu anstrengend ist.',
          },
          {
            name: 'Manuelle Lymphdrainage',
            detail: 'Gezielt bei Lymphödem nach Operation oder Bestrahlung, meist an Armen oder Beinen.',
          },
          {
            name: 'Einzelphysiotherapie',
            detail: 'Schrittweiser Wiederaufbau von Kraft und Beweglichkeit, angepasst an die individuelle Belastbarkeit nach der Therapie.',
          },
          {
            name: 'Übungen im Wasser',
            detail: 'Der Auftrieb entlastet Gelenke und Muskulatur, sodass Bewegung trainiert werden kann, die an Land noch zu anstrengend wäre.',
          },
          {
            name: 'Ernährungsberatung mit Körperzusammensetzungsanalyse',
            detail: 'Individueller Speiseplan zum Auffüllen von Nährstoffen und Aufbau gesunder Essgewohnheiten nach der Behandlungszeit.',
          },
          {
            name: 'Bluttests',
            detail: 'Kontrolle von Glukose, Cholesterin, Leber- und Nierenwerten während des Aufenthalts.',
          },
          {
            name: 'Entspannungstechniken und Atemübungen',
            detail: 'Unterstützen den Umgang mit Stress und die Schlafqualität; sie ersetzen keine Psychotherapie oder psychiatrische Behandlung.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Bei onkologischen Fällen nach abgeschlossener Behandlung ohne Anzeichen eines Rückfalls (Position I/1) trägt die tschechische Krankenkasse einen Grundaufenthalt von 21 Tagen komplexer Kurbehandlung; ein Wiederholungsaufenthalt dauert ebenfalls 21 Tage. Selbstzahler können das postonkologische Programm der Ensana-Hotels ab sieben Nächten buchen, für eine spürbare Umstellung von Ernährung und Bewegung empfiehlt sich jedoch ein längerer Aufenthalt. Der Zeitpunkt richtet sich nach dem Abschluss der onkologischen Behandlung und der Freigabe durch den behandelnden Onkologen, nicht nach der Jahreszeit.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body: 'Die Belege betreffen Erschöpfung, Rückkehr in den Alltag und Lebensqualität — nicht den Verlauf der Krebserkrankung selbst. In einer französischen randomisierten Studie mit 181 Frauen in Remission eines Mammakarzinoms erhöhte ein dreiwöchiges Kurprogramm mit Ernährungsberatung die Rückkehr zu beruflichen und familiären Aktivitäten nach 12 Monaten (Mourgues et al., 2014, Eur J Oncol Nurs; offene Studie ohne Verblindung). Eine österreichische Beobachtung von 149 Frauen nach Brustoperation beschrieb nach dreiwöchiger Rehabilitation mit Kohlensäurebädern und Peloiden eine bessere Lebensqualität, am deutlichsten bei der Erschöpfung (Strauss-Blasche et al., 2005, Cancer Nurs; ohne Kontrollgruppe). Die stärksten Belege betreffen betreutes Training selbst: Eine Metaanalyse randomisierter Studien zeigt weniger Erschöpfung und bessere Lebensqualität nach Brust- und Prostatakrebs (Cano-Uceda et al., 2025, Appl Sci), eine weitere speziell für Training im Wasser nach Brustkrebs (Wang et al., 2022, PLoS ONE). Das hauseigene Beobachtungsprogramm OnkoFit-Spa, das Ensana gemeinsam mit der 1. Medizinischen Fakultät der Karls-Universität betreibt, ist eine interne Verlaufsbeobachtung von Ensana und kein Beleg für die Wirksamkeit einzelner Anwendungen. Keinen Einfluss auf das Immunsystem oder den Verlauf der Krebserkrankung untersucht eine dieser Studien.',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer onkologischen Unterlagen. Diese Seite informiert und ersetzt keine ärztliche oder onkologische Beratung.',
        faqs: [
          {
            question: 'Gibt es Hotels für Krebspatienten zur Erholung?',
            answer: 'Ja. Ensana betreibt in Marienbad mit den Hotels Nové Lázně und Hvězda ein spezialisiertes postonkologisches Programm für Gäste nach abgeschlossener Krebsbehandlung. Es kombiniert Mineralbäder, Physiotherapie, Ernährungsberatung und psychische Unterstützung unter ärztlicher Aufsicht, buchbar ab einer Mindestdauer von sieben Nächten.',
          },
          {
            question: 'Welche Kurorte sind für onkologische Patienten nach der Behandlung geeignet?',
            answer: 'Geeignet sind Kurorte mit einem ärztlich geführten postonkologischen Programm, nicht jeder Wellnessaufenthalt. In Marienbad ist die Grundlage die offizielle Indikation I/1 — onkologische Fälle nach abgeschlossener komplexer Behandlung ohne Anzeichen eines Rückfalls —, ergänzt um ein spezialisiertes Hotelprogramm mit Eingangsuntersuchung und wöchentlicher ärztlicher Kontrolle.',
          },
          {
            question: 'Wann nach der Krebstherapie kann ich zur Kur?',
            answer: 'Voraussetzung ist eine abgeschlossene komplexe Krebsbehandlung ohne klinisch feststellbare Anzeichen eines Rückfalls. Den genauen Zeitpunkt legt Ihr behandelnder Onkologe fest; er hängt vom Therapieverlauf und Ihrem aktuellen Gesundheitszustand ab, nicht von einer festen Wartezeit.',
          },
          {
            question: 'Was umfasst das postonkologische Kurprogramm in Marienbad?',
            answer: 'Nach der ärztlichen Eingangsuntersuchung umfasst es in der Regel bis zu drei tägliche Anwendungen — etwa Mineralbäder, trockene Gasbäder, Einzelphysiotherapie oder Übungen im Wasser —, dazu Ernährungsberatung mit Bluttests sowie Entspannungstechniken. Der genaue Plan richtet sich nach Ihrem Zustand und wird wöchentlich angepasst.',
          },
          {
            question: 'Ersetzt die Kur die onkologische Nachsorge?',
            answer: 'Nein. Die Kur ist eine ergänzende Regenerationsphase nach abgeschlossener Behandlung, keine onkologische Nachsorge und keine Krebstherapie. Regelmäßige Kontrolluntersuchungen bei Ihrem behandelnden Onkologen bleiben davon unabhängig notwendig.',
          },
        ],
        sources: [
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe I — Onkologische Krankheiten',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Position I/1: onkologische Fälle nach abgeschlossener komplexer Behandlung ohne Anzeichen eines Rückfalls. Grundaufenthalt K 21, Wiederholungsaufenthalt K 21, P 21 (P 14).',
          },
          {
            title: 'Mourgues C et al. 2014, Eur J Oncol Nurs — randomisierte Studie PACThe, 181 Frauen in Remission eines Mammakarzinoms',
            url: 'https://consensus.app/papers/details/198633cfa0215c57ae77164ff322c1c7/',
            note: 'Kurprogramm mit Ernährungsberatung gegenüber Ernährungsberatung allein: höhere Rückkehr zu beruflichen und familiären Aktivitäten nach 12 Monaten. Offene Studie ohne Verblindung.',
          },
          {
            title: 'Strauss-Blasche G et al. 2005, Cancer Nurs — 149 Frauen nach Brustoperation, österreichische Kurrehabilitation',
            url: 'https://consensus.app/papers/details/a05ea52de8d85748bc6c07d9c5ae805a/',
            note: 'Dreiwöchige Rehabilitation mit CO₂-Bädern und Peloiden: bessere Lebensqualität, am dauerhaftesten bei der Erschöpfung. Vorher-Nachher-Studie ohne Kontrollgruppe.',
          },
          {
            title: 'Cano-Uceda A et al. 2025, Appl Sci — Metaanalyse von 19 randomisierten Studien zu überwachtem Training',
            url: 'https://consensus.app/papers/details/e08c50ee291d557789f5692e153034b4/',
            note: 'Betreutes Training senkt die Erschöpfung nach Brust- und Prostatakrebs gegenüber üblicher Versorgung. Risiko für Verzerrung in vielen Studien unklar.',
          },
          {
            title: 'Wang J et al. 2022, PLoS ONE — Metaanalyse zu Training im Wasser nach Brustkrebs',
            url: 'https://consensus.app/papers/details/fd7851ada1675ae3894bc22fdf8153d8/',
            note: 'Training im Wasser verringert die Erschöpfung und verbessert die Lebensqualität gegenüber üblicher Versorgung. Nur 5 randomisierte Studien eingeschlossen.',
          },
        ],
        related: [
          {
            label: 'Postonkologisches Kurprogramm',
            href: '/de/magazin/postonkologisches-kurprogramm',
          },
          {
            label: 'Mineralquellen',
            href: '/de/mineralquellen',
          },
          {
            label: 'CO₂-Therapie',
            href: '/de/co2-therapie',
          },
        ],
      },
      en: {
        slug: 'after-cancer-treatment',
        navLabel: 'After cancer treatment',
        title: 'Spa treatment after cancer treatment in Marienbad',
        h1: 'Spa treatment after cancer treatment',
        metaTitle: 'Spa treatment after cancer treatment in Marienbad | Marienbad.com',
        metaDescription:
          'Recovery after cancer therapy in Marienbad: a medically led spa programme for fitness, nutrition and daily life — requirements, course and duration.',
        lead:
          'For guests who have completed cancer treatment, Marienbad offers a medically led spa programme to help rebuild fitness, nutrition and mental balance. The requirement is completed comprehensive cancer therapy with no sign of relapse — the cure does not replace oncological follow-up care.',
        teaser: 'Recovery after chemotherapy or radiotherapy: mineral baths, nutrition counselling and psychological support under medical supervision, from seven nights.',
        treats: [
          'Oncological cases after completed comprehensive cancer treatment with no sign of relapse (position I/1 of the indication list)',
          'Persistent fatigue and loss of physical fitness after chemotherapy or radiotherapy',
          'Lymphoedema after surgery or radiation',
          'Musculoskeletal or nervous-system pain resulting from treatment',
          'Psychological exhaustion and the need for guided recovery in the remission phase',
        ],
        notFor: [
          'Ongoing oncological treatment, or cancer with clinically detectable signs of persisting or progressing disease',
          'Acute infectious disease and conditions where destabilisation of health is to be expected',
          'Marked cachexia that makes intensive rehabilitation impossible',
          'Pregnancy, or an inability to manage personal care without a companion',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: 'A specialist assesses your current state of health, reviews the documentation of your completed cancer treatment and sets the goals for recovery. Bring the final report of your oncological treatment and a current list of your medication — without them the plan is more cautious.',
          },
          {
            heading: 'Up to three treatments daily',
            body: 'Mineral baths, dry gas baths and physiotherapy in the morning, followed by rest lying down. The load is adjusted to your individual fitness, not to a fixed plan.',
          },
          {
            heading: 'Nutrition and psychological support',
            body: 'An analysis of body composition and an individual meal plan help replenish nutrients. Relaxation techniques, breathing exercises and conversations support coping with stress and sleep problems — the stay does not replace psychotherapy or psychiatric treatment.',
          },
          {
            heading: 'Weekly check-up and final report',
            body: 'The physician reviews your progress weekly, checks lab values such as glucose, cholesterol and liver and kidney function, and adjusts the plan. At the end you receive a report for your treating oncologist.',
          },
        ],
        procedures: [
          {
            name: 'Carbon dioxide bath',
            detail: 'A mineral-water bath with natural carbon dioxide for relaxation after demanding therapy; CO₂ absorbed through the skin increases skin blood flow.',
          },
          {
            name: 'Dry gas bath',
            detail: 'A CO₂ gas bath in Maria’s gas with no circulatory strain from water — suitable when a full bath is still too demanding.',
          },
          {
            name: 'Manual lymphatic drainage',
            detail: 'Targeted for lymphoedema after surgery or radiation, usually on the arms or legs.',
          },
          {
            name: 'Individual physiotherapy',
            detail: 'A gradual rebuild of strength and mobility, matched to your individual capacity after treatment.',
          },
          {
            name: 'Exercises in water',
            detail: 'Buoyancy relieves joints and muscles, so movement can be trained that would still be too demanding on dry land.',
          },
          {
            name: 'Nutrition counselling with body composition analysis',
            detail: 'An individual meal plan to replenish nutrients and build healthy eating habits after treatment.',
          },
          {
            name: 'Blood tests',
            detail: 'Checking glucose, cholesterol, and liver and kidney values during the stay.',
          },
          {
            name: 'Relaxation techniques and breathing exercises',
            detail: 'Support coping with stress and sleep quality; they do not replace psychotherapy or psychiatric treatment.',
          },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'For oncological cases after completed treatment with no sign of relapse (position I/1), stays covered by Czech public health insurance run to a base stay of 21 days of comprehensive spa care; a repeat stay also lasts 21 days. Self-paying guests can book the post-oncology programme at Ensana hotels from seven nights, though a longer stay is recommended for a noticeable change in nutrition and activity. The timing depends on completing oncological treatment and clearance from the treating oncologist, not on the season.',
        },
        evidence: {
          heading: 'What the studies show',
          body: 'The evidence concerns fatigue, return to daily life and quality of life — not the course of the cancer itself. In a French randomised trial of 181 women in remission from breast cancer, a three-week spa programme with nutrition counselling increased the return to occupational and family activities after 12 months (Mourgues et al., 2014, Eur J Oncol Nurs; open-label study without blinding). An Austrian observational study of 149 women after breast surgery described better quality of life after three weeks of rehabilitation with carbon dioxide baths and peloids, most markedly for fatigue (Strauss-Blasche et al., 2005, Cancer Nurs; no control group). The strongest evidence concerns supervised exercise itself: a meta-analysis of randomised trials shows less fatigue and better quality of life after breast and prostate cancer (Cano-Uceda et al., 2025, Appl Sci), and a further one specifically for exercise in water after breast cancer (Wang et al., 2022, PLoS ONE). The in-house OnkoFit-Spa observational programme, run by Ensana together with the 1st Faculty of Medicine of Charles University, is an internal Ensana outcome observation and not evidence for the effectiveness of individual treatments. None of these studies examines any effect on the immune system or the course of the cancer.',
        },
        physicianNote: 'Whether and to what extent a spa cure is right for you is decided by the spa physician at the initial examination, based on your oncological documentation. This page provides information and does not replace medical or oncological advice.',
        faqs: [
          {
            question: 'Are there hotels for cancer patients to recover?',
            answer: 'Yes. In Marienbad, Ensana runs a specialised post-oncology programme at the Nové Lázně and Hvězda hotels for guests after completed cancer treatment. It combines mineral baths, physiotherapy, nutrition counselling and psychological support under medical supervision, bookable from a minimum stay of seven nights.',
          },
          {
            question: 'Which spa resorts are suitable for oncology patients after treatment?',
            answer: 'Suitable resorts have a medically led post-oncology programme, not just any wellness stay. In Marienbad the basis is the official indication I/1 — oncological cases after completed comprehensive treatment with no sign of relapse — supplemented by a specialised hotel programme with an initial examination and weekly medical check-ups.',
          },
          {
            question: 'When after cancer therapy can I go for a spa cure?',
            answer: 'The requirement is completed comprehensive cancer treatment with no clinically detectable sign of relapse. Your treating oncologist sets the exact timing; it depends on the course of therapy and your current state of health, not a fixed waiting period.',
          },
          {
            question: 'What does the post-oncology spa programme in Marienbad include?',
            answer: 'After the initial medical examination it usually includes up to three daily treatments — such as mineral baths, dry gas baths, individual physiotherapy or exercises in water — plus nutrition counselling with blood tests and relaxation techniques. The exact plan depends on your condition and is adjusted weekly.',
          },
          {
            question: 'Does the spa cure replace oncological follow-up care?',
            answer: 'No. The cure is a supplementary recovery phase after completed treatment, not oncological follow-up care and not cancer therapy. Regular check-ups with your treating oncologist remain necessary regardless.',
          },
        ],
        sources: [
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group I — oncological disease',
            url: '/en/indications-and-contraindications',
            note: 'Position I/1: oncological cases after completed comprehensive treatment with no sign of relapse. Base stay K 21, repeat stay K 21, P 21 (P 14).',
          },
          {
            title: 'Mourgues C et al. 2014, Eur J Oncol Nurs — PACThe randomised trial, 181 women in remission from breast cancer',
            url: 'https://consensus.app/papers/details/198633cfa0215c57ae77164ff322c1c7/',
            note: 'Spa programme with nutrition counselling vs. nutrition counselling alone: higher return to occupational and family activities after 12 months. Open-label study without blinding.',
          },
          {
            title: 'Strauss-Blasche G et al. 2005, Cancer Nurs — 149 women after breast surgery, Austrian spa rehabilitation',
            url: 'https://consensus.app/papers/details/a05ea52de8d85748bc6c07d9c5ae805a/',
            note: 'Three-week rehabilitation with CO₂ baths and peloids: better quality of life, most lasting for fatigue. Before-after study without control group.',
          },
          {
            title: 'Cano-Uceda A et al. 2025, Appl Sci — meta-analysis of 19 randomised trials on supervised exercise',
            url: 'https://consensus.app/papers/details/e08c50ee291d557789f5692e153034b4/',
            note: 'Supervised exercise lowers fatigue after breast and prostate cancer compared with usual care. Risk of bias unclear in many studies.',
          },
          {
            title: 'Wang J et al. 2022, PLoS ONE — meta-analysis on exercise in water after breast cancer',
            url: 'https://consensus.app/papers/details/fd7851ada1675ae3894bc22fdf8153d8/',
            note: 'Exercise in water reduces fatigue and improves quality of life compared with usual care. Only 5 randomised trials included.',
          },
        ],
        related: [
          {
            label: 'Post-oncology spa programme',
            href: '/en/magazine/post-oncology-spa-programme',
          },
          {
            label: 'Mineral springs',
            href: '/en/mineral-springs',
          },
          {
            label: 'CO₂ therapy',
            href: '/en/co2-therapy',
          },
        ],
      },
      cs: {
        slug: 'po-onkologicke-lecbe',
        navLabel: 'Po onkologické léčbě',
        title: 'Lázeňská léčba po onkologické léčbě v Mariánských Lázních',
        h1: 'Lázeňská léčba po onkologické léčbě',
        metaTitle: 'Lázně po onkologické léčbě v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Rekondice po onkologické léčbě v Mariánských Lázních: lékařem vedený lázeňský program pro kondici, stravu a psychiku — podmínky, průběh a délka.',
        lead: 'Pro hosty, kteří dokončili onkologickou léčbu, nabízejí Mariánské Lázně lékařem vedený lázeňský program pro obnovu kondice, stravy a psychické rovnováhy. Podmínkou je ukončená komplexní onkologická léčba bez známek recidivy — lázeňský pobyt nenahrazuje onkologickou dispenzarizaci.',
        teaser: 'Rekondice po chemoterapii nebo ozařování: minerální koupele, nutriční poradenství a psychická podpora pod lékařským dohledem, od sedmi nocí.',
        treats: [
          'Onkologické případy po ukončené komplexní protinádorové léčbě bez známek recidivy (položka I/1 indikačního seznamu)',
          'Přetrvávající únava a ztráta tělesné kondice po chemoterapii nebo radioterapii',
          'Lymfedém po operaci nebo ozařování',
          'Bolesti pohybového aparátu nebo nervového systému v důsledku léčby',
          'Psychické vyčerpání a potřeba doprovázené rekondice v období remise',
        ],
        notFor: [
          'Probíhající onkologická léčba nebo nádorové onemocnění s klinicky zjistitelnými známkami trvání či progrese nemoci',
          'Akutní infekční onemocnění a stavy, u kterých lze očekávat destabilizaci zdravotního stavu',
          'Výrazná kachexie, která znemožňuje intenzivní rehabilitaci',
          'Těhotenství a neschopnost sebeobsluhy bez doprovodu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Odborný lékař posoudí váš aktuální zdravotní stav, projde podklady k ukončené onkologické léčbě a stanoví cíle rekonvalescence. Vezměte si závěrečnou zprávu z onkologické léčby a aktuální seznam léků — bez nich vyjde plán opatrněji.',
          },
          {
            heading: 'Až tři procedury denně',
            body: 'Dopoledne minerální koupele, suché plynové koupele a fyzioterapie, poté klid vleže. Zátěž se přizpůsobuje vaší individuální kondici, ne pevnému plánu.',
          },
          {
            heading: 'Strava a psychická podpora',
            body: 'Analýza tělesného složení a individuální jídelníček pomáhají doplnit živiny. Relaxační techniky, dechová cvičení a rozhovory podporují zvládání stresu a potíží se spánkem — pobyt přitom nenahrazuje psychoterapii ani psychiatrickou léčbu.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Lékař týdně kontroluje průběh, sleduje laboratorní hodnoty jako glukózu, cholesterol a funkci jater a ledvin a upravuje plán. Na závěr dostanete zprávu pro svého ošetřujícího onkologa.',
          },
        ],
        procedures: [
          {
            name: 'Uhličitá koupel',
            detail: 'Minerální koupel s přírodním CO₂ k uvolnění po náročné léčbě; CO₂ vstřebané kůží zvyšuje prokrvení kůže.',
          },
          {
            name: 'Suchá plynová koupel',
            detail: 'CO₂ koupel v Mariině plynu bez oběhové zátěže vodou — vhodná, dokud je celková koupel ještě příliš namáhavá.',
          },
          {
            name: 'Manuální lymfodrenáž',
            detail: 'Cíleně při lymfedému po operaci nebo ozařování, nejčastěji na pažích nebo nohou.',
          },
          {
            name: 'Individuální fyzioterapie',
            detail: 'Postupné obnovování síly a pohyblivosti, přizpůsobené individuální zátěžové kapacitě po léčbě.',
          },
          {
            name: 'Cvičení ve vodě',
            detail: 'Vztlak odlehčuje klouby a svalstvo, takže lze trénovat pohyb, který na suchu ještě příliš zatěžuje.',
          },
          {
            name: 'Nutriční poradenství s analýzou tělesného složení',
            detail: 'Individuální jídelníček k doplnění živin a vybudování zdravých stravovacích návyků po období léčby.',
          },
          {
            name: 'Krevní testy',
            detail: 'Kontrola glukózy, cholesterolu a hodnot jater a ledvin během pobytu.',
          },
          {
            name: 'Relaxační techniky a dechová cvičení',
            detail: 'Podporují zvládání stresu a kvalitu spánku; nenahrazují psychoterapii ani psychiatrickou léčbu.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Onkologické případy po ukončené léčbě bez známek recidivy jsou položka I/1 indikačního seznamu; přesnou délku hrazeného pobytu najdete na stránce Co hradí pojišťovna u onkologických onemocnění. Samoplátci mohou postonkologický program hotelů Ensana rezervovat od sedmi nocí, pro citelnou změnu stravy a pohybu se však doporučuje delší pobyt. Termín se řídí ukončením onkologické léčby a souhlasem ošetřujícího onkologa, ne ročním obdobím.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'Doklady se týkají únavy, návratu do běžného života a kvality života — ne průběhu samotného nádorového onemocnění. Francouzská randomizovaná studie se 181 ženami v remisi karcinomu prsu zjistila, že třítýdenní lázeňský program s nutričním poradenstvím zvýšil návrat k pracovním a rodinným aktivitám po 12 měsících (Mourgues a kol., 2014, Eur J Oncol Nurs; otevřená studie bez zaslepení). Rakouské pozorování 149 žen po operaci prsu popsalo po třítýdenní rehabilitaci s uhličitými koupelemi a peloidy lepší kvalitu života, nejvýrazněji u únavy (Strauss-Blasche a kol., 2005, Cancer Nurs; bez kontrolní skupiny). Nejsilnější doklady se týkají samotného vedeného tréninku: metaanalýza randomizovaných studií ukazuje méně únavy a lepší kvalitu života po karcinomu prsu a prostaty (Cano-Uceda a kol., 2025, Appl Sci), další speciálně pro trénink ve vodě po karcinomu prsu (Wang a kol., 2022, PLoS ONE). Vlastní observační program Ensany OnkoFit-Spa, který provozuje společně s 1. lékařskou fakultou Univerzity Karlovy, je interní sledování průběhu Ensany a ne doklad účinnosti jednotlivých procedur. Vliv na imunitní systém nebo průběh nádorového onemocnění žádná z těchto studií nezkoumá.',
        },
        physicianNote: 'O tom, zda a v jakém rozsahu pro vás lázeňská léčba připadá v úvahu, rozhoduje lázeňský lékař při vstupní prohlídce podle vašich onkologických podkladů. Tato stránka informuje a nenahrazuje lékařskou ani onkologickou konzultaci.',
        faqs: [
          {
            question: 'Jsou v Mariánských Lázních hotely pro onkologické pacienty na zotavení?',
            answer: 'Ano. Ensana provozuje v Mariánských Lázních v hotelech Nové Lázně a Hvězda specializovaný postonkologický program pro hosty po ukončené onkologické léčbě. Kombinuje minerální koupele, fyzioterapii, nutriční poradenství a psychickou podporu pod lékařským dohledem, rezervovatelný od minimální délky sedmi nocí.',
          },
          {
            question: 'Které lázně jsou vhodné pro onkologické pacienty po léčbě?',
            answer: 'Vhodné jsou lázně s lékařem vedeným postonkologickým programem, ne každý wellness pobyt. V Mariánských Lázních je základem oficiální indikace I/1 — onkologické případy po ukončené komplexní léčbě bez známek recidivy —, doplněná specializovaným hotelovým programem se vstupní prohlídkou a týdenní lékařskou kontrolou.',
          },
          {
            question: 'Jak dlouho po onkologické léčbě mohu jet do lázní?',
            answer: 'Podmínkou je ukončená komplexní onkologická léčba bez klinicky zjistitelných známek recidivy. Přesný termín stanoví váš ošetřující onkolog; závisí na průběhu léčby a vašem aktuálním zdravotním stavu, ne na pevné čekací době.',
          },
          {
            question: 'Co zahrnuje postonkologický lázeňský program v Mariánských Lázních?',
            answer: 'Po vstupní lékařské prohlídce obvykle zahrnuje až tři denní procedury — například minerální koupele, suché plynové koupele, individuální fyzioterapii nebo cvičení ve vodě —, k tomu nutriční poradenství s krevními testy a relaxační techniky. Přesný plán se řídí vaším stavem a týdně se upravuje.',
          },
          {
            question: 'Nahrazuje lázeňský pobyt onkologickou dispenzarizaci?',
            answer: 'Ne. Lázeňský pobyt je doplňková rekonvalescenční fáze po ukončené léčbě, ne onkologická dispenzarizace ani protinádorová léčba. Pravidelné kontroly u ošetřujícího onkologa zůstávají nadále nutné, nezávisle na pobytu.',
          },
        ],
        sources: [
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina I — onkologická onemocnění',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Položka I/1: onkologické případy po ukončené komplexní léčbě bez známek recidivy, s typem péče a délkou hrazeného pobytu.',
          },
          {
            title: 'Mourgues C a kol. 2014, Eur J Oncol Nurs — randomizovaná studie PACThe, 181 žen v remisi karcinomu prsu',
            url: 'https://consensus.app/papers/details/198633cfa0215c57ae77164ff322c1c7/',
            note: 'Lázeňský program s nutričním poradenstvím oproti samotnému poradenství: vyšší návrat k pracovním a rodinným aktivitám po 12 měsících. Otevřená studie bez zaslepení.',
          },
          {
            title: 'Strauss-Blasche G a kol. 2005, Cancer Nurs — 149 žen po operaci prsu, rakouská lázeňská rehabilitace',
            url: 'https://consensus.app/papers/details/a05ea52de8d85748bc6c07d9c5ae805a/',
            note: 'Třítýdenní rehabilitace s CO₂ koupelemi a peloidy: lepší kvalita života, nejtrvaleji u únavy. Studie před-po bez kontrolní skupiny.',
          },
          {
            title: 'Cano-Uceda A a kol. 2025, Appl Sci — metaanalýza 19 randomizovaných studií k vedenému tréninku',
            url: 'https://consensus.app/papers/details/e08c50ee291d557789f5692e153034b4/',
            note: 'Vedený trénink snižuje únavu po karcinomu prsu a prostaty oproti obvyklé péči. Riziko zkreslení v mnoha studiích nejasné.',
          },
          {
            title: 'Wang J a kol. 2022, PLoS ONE — metaanalýza k tréninku ve vodě po karcinomu prsu',
            url: 'https://consensus.app/papers/details/fd7851ada1675ae3894bc22fdf8153d8/',
            note: 'Trénink ve vodě snižuje únavu a zlepšuje kvalitu života oproti obvyklé péči. Zahrnuto jen 5 randomizovaných studií.',
          },
        ],
        related: [
          {
            label: 'Postonkologický lázeňský program',
            href: '/cs/magazin/postonkologicky-lazensky-program',
          },
          {
            label: 'Přehled minerálních pramenů',
            href: '/cs/mineralni-prameny',
          },
          {
            label: 'CO₂ terapie',
            href: '/cs/co2-terapie',
          },
          {
            label: 'Co hradí pojišťovna u onkologických onemocnění',
            href: '/cs/lazne-s-pojistovnou/indikace/onkologicka-onemocneni',
          },
        ],
      },
      ru: {
        slug: 'posle-lecheniya-onkologii',
        navLabel: 'После лечения онкологии',
        title: 'Курортное лечение после лечения онкологии в Марианских Лазнях',
        h1: 'Курортное лечение после лечения онкологии',
        metaTitle: 'После лечения онкологии — Марианские Лазни | Marienbad.com',
        metaDescription: 'Восстановление после онкологического лечения в Марианских Лазнях: программа под наблюдением врача для физической формы и питания — условия, ход, сроки.',
        lead: 'Для гостей, завершивших лечение онкологического заболевания, в Марианских Лазнях предлагается курортная программа под наблюдением врача для восстановления физической формы, питания и душевного равновесия. Условие — завершённое комплексное лечение онкологического заболевания без признаков рецидива; лечение не заменяет онкологическое наблюдение.',
        teaser: 'Восстановление после химио- или лучевой терапии: минеральные ванны, консультации по питанию и психологическая поддержка под наблюдением врача, от семи ночей.',
        treats: [
          'Онкологические случаи после завершённого комплексного лечения без признаков рецидива (позиция I/1 индикационного списка)',
          'Сохраняющаяся утомляемость и утрата физической формы после химиотерапии или лучевой терапии',
          'Лимфедема после операции или облучения',
          'Боли опорно-двигательного аппарата или нервной системы вследствие лечения',
          'Психическое истощение и потребность в сопровождаемом восстановлении в фазе ремиссии',
        ],
        notFor: [
          'Текущее онкологическое лечение или онкологическое заболевание с клинически выявляемыми признаками сохранения или прогрессирования болезни',
          'Острые инфекционные заболевания и состояния, при которых ожидается дестабилизация состояния здоровья',
          'Выраженная кахексия, делающая интенсивную реабилитацию невозможной',
          'Беременность, а также неспособность к самообслуживанию без сопровождающего лица',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Профильный врач оценивает ваше текущее состояние здоровья, изучает документы о завершённом онкологическом лечении и определяет цели восстановления. Возьмите с собой итоговое заключение онкологического лечения и актуальный список лекарств — без них план будет более осторожным.',
          },
          {
            heading: 'До трёх процедур в день',
            body: 'Минеральные ванны, сухие газовые ванны и физиотерапия в первой половине дня, затем отдых лёжа. Нагрузка подбирается по вашей индивидуальной физической форме, а не по жёсткому плану.',
          },
          {
            heading: 'Питание и психологическая поддержка',
            body: 'Анализ состава тела и индивидуальный план питания помогают восполнить питательные вещества. Техники релаксации, дыхательные упражнения и беседы помогают справляться со стрессом и проблемами сна — при этом пребывание не заменяет ни психотерапию, ни психиатрическое лечение.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Врач еженедельно проверяет динамику, контролирует лабораторные показатели, такие как глюкоза, холестерин, функция печени и почек, и корректирует план. По окончании вы получаете заключение для вашего лечащего онколога.',
          },
        ],
        procedures: [
          {
            name: 'Углекислая ванна',
            detail: 'Ванна в минеральной воде с природной углекислотой для расслабления после тяжёлой терапии; проникающий через кожу CO₂ усиливает кровоснабжение кожи.',
          },
          {
            name: 'Сухая газовая ванна',
            detail: 'Газовая ванна CO₂ в марианском газе без нагрузки на кровообращение от воды — вариант, если полная ванна пока слишком утомительна.',
          },
          {
            name: 'Ручной лимфодренаж',
            detail: 'Целенаправленно при лимфедеме после операции или облучения, чаще всего на руках или ногах.',
          },
          {
            name: 'Индивидуальная физиотерапия',
            detail: 'Постепенное восстановление силы и подвижности, адаптированное к индивидуальной переносимости нагрузки после лечения.',
          },
          {
            name: 'Упражнения в воде',
            detail: 'Выталкивающая сила воды снимает нагрузку с суставов и мышц, поэтому можно тренировать движения, которые на суше пока были бы слишком утомительными.',
          },
          {
            name: 'Консультация по питанию с анализом состава тела',
            detail: 'Индивидуальный план питания для восполнения питательных веществ и формирования здоровых пищевых привычек после лечения.',
          },
          {
            name: 'Анализы крови',
            detail: 'Контроль глюкозы, холестерина, показателей печени и почек в течение пребывания.',
          },
          {
            name: 'Техники релаксации и дыхательные упражнения',
            detail: 'Помогают справляться со стрессом и улучшают качество сна; они не заменяют психотерапию или психиатрическое лечение.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'При онкологических случаях после завершённого лечения без признаков рецидива (позиция I/1) для пребываний, оплачиваемых чешской страховой, предусмотрено базовое пребывание длительностью 21 день комплексного курортного лечения; повторное пребывание также длится 21 день. Гости, оплачивающие лечение самостоятельно, могут забронировать постонкологическую программу отелей Ensana от семи ночей, однако для заметной перестройки питания и движения рекомендуется более длительное пребывание. Время поездки определяется завершением онкологического лечения и разрешением лечащего онколога, а не временем года.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'Доказательства касаются утомляемости, возвращения к повседневной жизни и качества жизни — не течения самого онкологического заболевания. Во французском рандомизированном исследовании со 181 женщиной в ремиссии рака молочной железы трёхнедельная курортная программа с консультациями по питанию повысила возвращение к профессиональной и семейной деятельности через 12 месяцев (Mourgues et al., 2014, Eur J Oncol Nurs; открытое исследование без ослепления). Австрийское наблюдение за 149 женщинами после операции на молочной железе описало после трёхнедельной реабилитации с углекислыми ваннами и пелоидами лучшее качество жизни, наиболее заметно в отношении утомляемости (Strauss-Blasche et al., 2005, Cancer Nurs; без контрольной группы). Самые весомые доказательства касаются самих контролируемых тренировок: метаанализ рандомизированных исследований показывает меньшую утомляемость и лучшее качество жизни после рака молочной железы и предстательной железы (Cano-Uceda et al., 2025, Appl Sci), ещё один — специально для тренировок в воде после рака молочной железы (Wang et al., 2022, PLoS ONE). Собственная наблюдательная программа OnkoFit-Spa, которую Ensana проводит совместно с 1-м медицинским факультетом Карлова университета, — это внутреннее наблюдение Ensana за динамикой, а не доказательство эффективности отдельных процедур. Ни одно из этих исследований не изучает влияние на иммунную систему или течение онкологического заболевания.',
        },
        physicianNote: 'Показано ли вам курортное лечение и в каком объёме, решает курортный врач при первичном осмотре на основании ваших онкологических документов. Эта страница носит информационный характер и не заменяет консультацию врача или онколога.',
        faqs: [
          {
            question: 'Есть ли отели для восстановления онкологических пациентов?',
            answer: 'Да. Ensana предлагает в Марианских Лазнях в отелях Nové Lázně и Hvězda специализированную постонкологическую программу для гостей после завершённого лечения онкологического заболевания. Она сочетает минеральные ванны, физиотерапию, консультации по питанию и психологическую поддержку под наблюдением врача, доступна от минимальной длительности семь ночей.',
          },
          {
            question: 'Какие курорты подходят онкологическим пациентам после лечения?',
            answer: 'Подходят курорты с курортной программой под наблюдением врача, специально для периода после онкологического лечения, а не любой wellness-отдых. В Марианских Лазнях основа — официальное показание I/1: онкологические случаи после завершённого комплексного лечения без признаков рецидива, дополненное специализированной программой отеля с первичным осмотром и еженедельным врачебным контролем.',
          },
          {
            question: 'Через сколько времени после онкологической терапии можно ехать на лечение?',
            answer: 'Условие — завершённое комплексное лечение онкологического заболевания без клинически выявляемых признаков рецидива. Точный срок определяет ваш лечащий онколог; он зависит от хода терапии и вашего текущего состояния здоровья, а не от фиксированного периода ожидания.',
          },
          {
            question: 'Что включает постонкологическая курортная программа в Марианских Лазнях?',
            answer: 'После первичного врачебного осмотра она обычно включает до трёх процедур в день — например, минеральные ванны, сухие газовые ванны, индивидуальную физиотерапию или упражнения в воде, — а также консультации по питанию с анализами крови и техники релаксации. Точный план зависит от вашего состояния и корректируется еженедельно.',
          },
          {
            question: 'Заменяет ли курортное лечение онкологическое наблюдение?',
            answer: 'Нет. Курортное лечение — это дополнительная фаза восстановления после завершённого лечения, а не онкологическое наблюдение и не онкотерапия. Регулярные контрольные обследования у вашего лечащего онколога остаются независимо от этого необходимыми.',
          },
        ],
        sources: [
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа I — онкологические заболевания',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Позиция I/1: онкологические случаи после завершённого комплексного лечения без признаков рецидива. Базовое пребывание K 21, повторное пребывание K 21, P 21 (P 14).',
          },
          {
            title: 'Mourgues C et al. 2014, Eur J Oncol Nurs — рандомизированное исследование PACThe, 181 женщина в ремиссии рака молочной железы',
            url: 'https://consensus.app/papers/details/198633cfa0215c57ae77164ff322c1c7/',
            note: 'Курортная программа с консультациями по питанию против одних консультаций по питанию: выше возвращение к профессиональной и семейной деятельности через 12 месяцев. Открытое исследование без ослепления.',
          },
          {
            title: 'Strauss-Blasche G et al. 2005, Cancer Nurs — 149 женщин после операции на молочной железе, австрийская курортная реабилитация',
            url: 'https://consensus.app/papers/details/a05ea52de8d85748bc6c07d9c5ae805a/',
            note: 'Трёхнедельная реабилитация с CO₂-ваннами и пелоидами: лучше качество жизни, наиболее устойчиво в отношении утомляемости. Исследование «до-после» без контрольной группы.',
          },
          {
            title: 'Cano-Uceda A et al. 2025, Appl Sci — метаанализ 19 рандомизированных исследований контролируемых тренировок',
            url: 'https://consensus.app/papers/details/e08c50ee291d557789f5692e153034b4/',
            note: 'Контролируемые тренировки снижают утомляемость после рака молочной и предстательной железы по сравнению с обычным лечением. Риск систематической ошибки во многих исследованиях неясен.',
          },
          {
            title: 'Wang J et al. 2022, PLoS ONE — метаанализ тренировок в воде после рака молочной железы',
            url: 'https://consensus.app/papers/details/fd7851ada1675ae3894bc22fdf8153d8/',
            note: 'Тренировки в воде снижают утомляемость и улучшают качество жизни по сравнению с обычным лечением. Включено только 5 рандомизированных исследований.',
          },
        ],
        related: [
          {
            label: 'Постонкологическая курортная программа',
            href: '/ru/zhurnal/postonkologicheskaya-kurortnaya-programma',
          },
          {
            label: 'Минеральные источники',
            href: '/ru/mineralnye-istochniki',
          },
          {
            label: 'CO₂-терапия',
            href: '/ru/co2-terapiya',
          },
        ],
      },
    },
  },
  {
    id: 'respiratory',
    groupId: 'respiratory',
    roman: 'V',
    codes: [
      'V/4',
      'V/5',
      'V/6',
    ],
    conditionName: 'Chronic respiratory disease',
    image: '/images/library/treatments/oxygen-therapy-profile.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Gast erhält im Profil eine Sauerstofftherapie über eine Atemmaske',
      en: 'A guest receives oxygen therapy through a breathing mask, seen in profile',
      cs: 'Host v profilu podstupuje oxygenoterapii přes dýchací masku',
      ru: 'Гостю курорта в профиль проводят кислородную терапию через дыхательную маску',
    },
    content: {
      de: {
        slug: 'atemwegserkrankungen',
        navLabel: 'Atemwege',
        title: 'Kur bei Atemwegserkrankungen in Marienbad',
        h1: 'Kur bei Atemwegserkrankungen',
        metaTitle: 'Kur bei Atemwegserkrankungen in Marienbad | Marienbad.com',
        metaDescription: 'Kur bei Asthma, COPD und chronischen Atemwegserkrankungen in Marienbad: Inhalation aus dem Waldquell, Atemtherapie, Klimatherapie — für wen und wie lange.',
        lead: 'Chronische Atemwegserkrankungen wie Asthma, COPD oder rezidivierende Bronchitis bilden in Marienbad eine eigene Indikationsgruppe. Die Kur stützt sich auf Inhalationen aus dem kohlensäurereichen Waldquell, Atemtherapie und ein seit 2023 amtlich anerkanntes heilklimatisches Klima in rund 630 Metern Höhe.',
        teaser: 'Asthma, COPD und chronische Bronchitis: Inhalation aus dem Waldquell, Atemtherapie und Klimatherapie in rund 630 Metern Höhe, über zwei bis vier Wochen.',
        treats: [
          'Bronchialasthma und chronische obstruktive Lungenkrankheit (COPD) (Position V/5 der Indikationsliste)',
          'Bronchiektasen sowie rezidivierende Entzündungen der unteren Atemwege, auch als anerkannte Berufskrankheit (V/4)',
          'Interstitielle Lungenfibrose jeder Ätiologie in ständiger Behandlung (V/6)',
          'Allergische Rhinitis und chronische Entzündungen der oberen Atemwege',
          'Zustände nach durchgemachten Lungenentzündungen, einschließlich Folgen von COVID-19',
        ],
        notFor: [
          'Akute Infektionskrankheiten der Atemwege und eine akute Verschlechterung (Exazerbation) im floriden Stadium',
          'Aktive Tumorerkrankung mit klinisch feststellbaren Anzeichen des Andauerns oder Fortschreitens der Krankheit',
          'Nicht kompensierte Herzinsuffizienz oder ausgeprägte Kreislaufschwäche',
          'Schwangerschaft sowie Unfähigkeit zur Selbstversorgung ohne Begleitperson',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt sichtet Lungenfunktionsbefunde und Medikation und stellt den Behandlungsplan zusammen. Bringen Sie aktuelle Befunde von Pneumologe oder Hausarzt sowie eine Medikamentenliste mit.',
          },
          {
            heading: 'Zwei bis drei Anwendungen täglich',
            body: 'Vormittags Inhalation aus dem Waldquell und Atemtherapie, ergänzt um Kohlensäurebäder oder Gasinjektionen nach ärztlicher Verordnung. Nach jeder Anwendung folgt Ruhe im Liegen.',
          },
          {
            heading: 'Klimatherapie und Terrainkur',
            body: 'Geführte Gehstrecken auf dem historischen Promenadennetz im submontanen Klima, in Tempo und Steigung an die Kondition angepasst. Das Gehen an frischer Luft ist Teil der Behandlung, kein Freizeitprogramm.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body: 'Der Arzt prüft wöchentlich Atemwegsbefund und -funktion und passt Inhalationen und Übungen an. Zum Abschluss erhalten Sie einen Bericht für Ihren behandelnden Arzt und ein Atemübungsprogramm für zu Hause.',
          },
        ],
        procedures: [
          {
            name: 'Mineralwasser-Inhalation aus dem Waldquell',
            detail: 'Fein vernebeltes Wasser befeuchtet die Schleimhäute und wird traditionell zur Schleimlösung eingesetzt; meist zwei Anwendungen täglich.',
          },
          {
            name: 'Atemtherapie',
            detail: 'Einzeln und in der Gruppe mit Physiotherapeuten: verlängerte Ausatmung, Zwerchfellatmung, Hustentechnik — der Teil der Kur, den man dauerhaft mitnimmt.',
          },
          {
            name: 'Kohlensäurebad',
            detail: 'Über die Haut aufgenommenes CO₂ erweitert die kleinen Gefäße und steigert die Hautdurchblutung; bei Atemwegsdiagnosen eine ergänzende Anwendung.',
          },
          {
            name: 'Trockenes Gasbad und Gasinjektionen',
            detail: 'CO₂ aus dem örtlichen Mariengas ohne Kreislaufbelastung durch Wasser, wenn ein Vollbad zu anstrengend wäre.',
          },
          {
            name: 'Klimatherapie und Terrainkur',
            detail: 'Geführtes Gehen im heilklimatisch anerkannten Talkessel; angeleitetes Gehen ist bei COPD als Training zur Verbesserung von Lebensqualität und Gehausdauer untersucht.',
          },
          {
            name: 'Trinkkur',
            detail: 'Ergänzend je nach Diagnose; welche Quelle, Menge und welcher Zeitpunkt gelten, legt der Arzt individuell fest.',
          },
          {
            name: 'Ergänzende Anwendungen',
            detail: 'Massagen, Salzgrotte oder Entspannungstechniken je nach Befund, bei Atemnot und Anspannung.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Bei Asthma und COPD (Position V/5) trägt die tschechische Krankenkasse 28 Tage komplexe oder 21 Tage Zuschuss-Kurbehandlung; bei Bronchiektasen und rezidivierenden Entzündungen der unteren Atemwege (V/4) sind es 21 Tage mit Wiederholungsmöglichkeit, bei interstitieller Lungenfibrose (V/6) 28 Tage komplexe oder 21 Tage Zuschuss-Kurbehandlung. Selbstzahler wählen meist zwei bis drei Wochen nach Absprache mit dem Kurarzt. Für die Jahreszeit gibt es keine medizinische Vorgabe, doch der Herbst gilt wegen zurückgehender Pollenbelastung und als Vorbereitung auf die Heizperiode als besonders geeignet.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body: 'Eine systematische Übersicht über 27 Studien zur Inhalation von Mineralwässern beschreibt eine bessere Nasendurchgängigkeit und einen besseren mukoziliären Transport, weist aber auf die geringe Qualität und Heterogenität der Studien hin (Fontana et al., 2025, Int J Biometeorol). Eine weitere systematische Übersicht zu Asthma und COPD findet eine verbesserte Lungenfunktion bei Asthma (Calzetta et al., 2024, J Clin Med; die Zahl hochwertiger randomisierter Studien ist begrenzt). Für Training im Wasser bei COPD gelten die Belege laut einer narrativen Übersicht als stark, für Schwefelinhalationen wird eine bessere mukoziliäre Clearance beschrieben (Khaltaev et al., 2020, J Thorac Dis). Eine ungarische Vorher-Nachher-Studie ohne Kontrollgruppe an 678 Patienten mit Asthma oder COPD verzeichnete nach einem dreiwöchigen Programm mit täglicher Atemtherapie im Freien einen Anstieg des mittleren FEV1-Werts von 71,0 auf 77,7 % des Sollwerts; der Einfluss des Klimas lässt sich darin nicht von Training und Betreuung trennen (Müller et al., 2018, Eur J Integr Med). Angeleitetes Gehen selbst ist bei COPD in einer multizentrischen randomisierten Studie mit 143 Patienten belegt: Es verbesserte nach 8 bis 10 Wochen Lebensqualität und Gehausdauer gegenüber üblicher Versorgung — allerdings in einem ambulanten Programm, nicht in einem Kuraufenthalt (Wootton et al., 2014, Eur Respir J). Keine der Studien zeigt eine Veränderung des Krankheitsverlaufs von Asthma oder COPD selbst.',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer Lungenfunktionsbefunde. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        ongoing: {
          heading: 'Erfahrung und laufende Forschung',
          body: 'Inhalationen aus der Waldquelle, Atemtherapie und Klimatherapie gehören in Marienbad seit Generationen zum Programm bei Atemwegserkrankungen; seit 2023 ist der Ort durch Entscheidung des Gesundheitsministeriums als Klimakurort anerkannt. Wie es dem einzelnen Gast dabei ergeht, bleibt nicht ungeprüft: Jeder Behandlungsaufenthalt beginnt mit einer Eingangs- und endet mit einer Abschlussuntersuchung samt schriftlichem Abschlussbericht, sodass der Verlauf dokumentiert ist und der Kurarzt den Plan unterwegs anpassen kann. Für die Kurmedizin als Fach entsteht derzeit erstmals seit Langem systematische Evidenz. Das Institut lázeňství a balneologie, v.v.i., die 2019 vom Karlsbader Kreis gegründete Forschungseinrichtung für Kurwesen und Balneologie, führt seit 2026 gemeinsam mit den Léčebné lázně Mariánské Lázně die erste klinische Studie dieses Formats seit dreißig Jahren durch. Sie betrifft urologische und nephrologische Diagnosen, nicht die auf dieser Seite beschriebene: Mehr als hundert Patienten werden vor und nach dem Kuraufenthalt auf Gesundheitszustand und Lebensqualität untersucht, fachlicher Garant ist prim. MUDr. Ladislav Špišák, CSc.; Ergebnisse liegen noch nicht vor. Die Studie läuft im Projekt Zentrum für Kurforschung (2024 bis 2027), das aus dem Operationellen Programm Gerechter Übergang finanziert wird und mit der Tschechischen Technischen Universität, der Westböhmischen Universität und der Akademie der Wissenschaften der Tschechischen Republik zusammenarbeitet. Was dabei herauskommen kann, zeigt die frühere Zusammenarbeit desselben Instituts mit den Marienbader Kurhäusern: Die gemeinsame Studie zur Kurrehabilitation nach COVID-19 erhielt 2021 den Innovation Award der European Spas Association in der Kategorie Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Wohin zur Kur bei Atemwegserkrankungen?',
            answer: 'Marienbad ist als Kurort für die offizielle Indikationsgruppe V — netuberkulöse Krankheiten der Atemorgane — gelistet. Grundlage sind der kohlensäure- und hydrogencarbonatreiche Waldquell zur Inhalation, natürliches Kohlendioxid für Gasbäder und ein seit 2023 amtlich anerkanntes heilklimatisches Klima in rund 630 Metern Höhe.',
          },
          {
            question: 'Hilft eine Kur bei Asthma oder COPD?',
            answer: 'Asthma und COPD (Position V/5) sind eine erstattete Indikation. Eine systematische Übersicht beschreibt bei Asthma verbesserte Lungenfunktion, bei COPD gemischte Ergebnisse, bei insgesamt wenigen hochwertigen Studien; angeleitetes Gehen ist als Training bei COPD in einer randomisierten Studie belegt. Die Kur ersetzt keine verordneten Medikamente.',
          },
          {
            question: 'Was bringt die Inhalation von Mineralwasser?',
            answer: 'Fein vernebeltes Wasser aus dem Waldquell befeuchtet die Schleimhäute und wird traditionell zur Schleimlösung eingesetzt. Eine systematische Übersicht über 27 Studien beschreibt danach eine bessere Nasendurchgängigkeit und einen besseren mukoziliären Transport, weist aber auf die geringe Qualität der zugrunde liegenden Studien hin.',
          },
          {
            question: 'Warum eignet sich der Herbst besonders für diese Kur?',
            answer: 'Die Pollenbelastung geht im Herbst deutlich zurück, während die Heizperiode beginnt, die die oberen Atemwege zusätzlich austrocknet. Zwei bis drei Wochen in feuchter, kühler Waldluft mit täglicher Inhalation gelten deshalb als gute Vorbereitung auf den Winter.',
          },
          {
            question: 'Wie lange dauert eine Kur bei Atemwegserkrankungen?',
            answer: 'Bei Asthma und COPD trägt die tschechische Krankenkasse 28 Tage komplexe oder 21 Tage Zuschuss-Kurbehandlung, bei Bronchiektasen 21 Tage. Selbstzahler wählen meist zwei bis drei Wochen; die erste spürbare Erleichterung stellt sich in der Regel im Verlauf der ersten Woche ein.',
          },
        ],
        sources: [
          {
            title: 'Klinische Studie zu den objektiven Wirkungen der komplexen Kurbehandlung bei urologischen und nephrologischen Diagnosen (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Laufende Studie des Instituts lázeňství a balneologie mit den Léčebné lázně Mariánské Lázně, mehr als hundert Patienten, Beginn 2026. Sie betrifft urologische und nephrologische Diagnosen; Ergebnisse liegen noch nicht vor.',
          },
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe V — Netuberkulöse Krankheiten der Atemorgane',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Positionen V/4–V/6 mit Versorgungsart und Dauer (z. B. V/5 Asthma/COPD: K 28 oder P 21; V/4 Bronchiektasen: K 21).',
          },
          {
            title: 'Offizielles Tourismusportal der Stadt Mariánské Lázně — Waldquelle (Lesní pramen)',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/lesni-pramen/',
            note: 'Wasseranalyse (freies CO₂ 2 960 mg/l, Hydrogencarbonat 1 352 mg/l, Natrium 549 mg/l); traditionelle Nutzung zur Inhalation und Trinkkur.',
          },
          {
            title: 'Fontana M et al. 2025, Int J Biometeorol — systematische Übersicht über 27 Studien zur Inhalation von Mineralwässern',
            url: 'https://consensus.app/papers/details/e377f688a5f85f3c9e6c9373d675eb8e/',
            note: 'Bessere Nasendurchgängigkeit, mukoziliärer Transport und einige Lungenparameter. Geringe Qualität und Heterogenität der Studien.',
          },
          {
            title: 'Calzetta L et al. 2024, J Clin Med — systematische Übersicht zur Balneotherapie bei Asthma und COPD',
            url: 'https://consensus.app/papers/details/a501a68157c55ab987f90c1b05309fbe/',
            note: 'Verbesserte Lungenfunktion bei Asthma, gemischte Ergebnisse bei COPD; wenige hochwertige randomisierte Studien.',
          },
          {
            title: 'Khaltaev N et al. 2020, J Thorac Dis — narrative Übersicht zur Balneotherapie bei chronischen Atemwegserkrankungen',
            url: 'https://consensus.app/papers/details/ef1fb47a66af5341be76a01e6fde2ba4/',
            note: 'Training im Wasser bei COPD hat starke Belege; Schwefelinhalationen verbessern die mukoziliäre Clearance. Narrative Übersicht.',
          },
          {
            title: 'Müller A et al. 2018, Eur J Integr Med — Vorher-nachher-Studie, 678 Patienten mit Asthma und COPD, dreiwöchiges Klimaprogramm',
            url: 'https://doi.org/10.1016/j.eujim.2018.04.007',
            note: 'FEV1 stieg von 71,0 auf 77,7 % des Sollwerts. Ohne Kontrollgruppe; Einfluss des Klimas nicht von Training und Betreuung trennbar.',
          },
          {
            title: 'Wootton SL et al. 2014, Eur Respir J — multizentrische randomisierte Studie, 143 Patienten mit COPD',
            url: 'https://doi.org/10.1183/09031936.00078014',
            note: 'Angeleitetes Gehen 2–3× wöchentlich über 8–10 Wochen verbesserte Lebensqualität und Gehausdauer. Ambulantes Programm, kein Kuraufenthalt.',
          },
        ],
        related: [
          {
            label: 'Kur bei Atemwegserkrankungen — der Herbst-Wegweiser',
            href: '/de/magazin/kur-bei-atemwegserkrankungen',
          },
          {
            label: 'Klimatherapie',
            href: '/de/klimatherapie',
          },
          {
            label: 'Waldquelle im Porträt',
            href: '/de/quellen-uebersicht/lesni',
          },
          {
            label: 'Reha nach COVID',
            href: '/de/magazin/reha-nach-covid',
          },
        ],
      },
      en: {
        slug: 'respiratory-conditions',
        navLabel: 'Respiratory conditions',
        title: 'Spa treatment for respiratory conditions in Marienbad',
        h1: 'Spa treatment for respiratory conditions',
        metaTitle: 'Spa treatment for asthma and COPD in Marienbad | Marienbad.com',
        metaDescription:
          'Spa treatment for asthma, COPD and chronic respiratory disease in Marienbad: inhalation, breathing therapy, climate therapy — who it suits and how long.',
        lead:
          'Chronic respiratory conditions such as asthma, COPD or recurrent bronchitis form their own indication group in Marienbad. The cure draws on inhalations from the carbon-dioxide-rich Forest Spring, breathing therapy and a climate officially recognised as therapeutic since 2023, at around 630 metres of altitude.',
        teaser: 'Asthma, COPD and chronic bronchitis: inhalation from the Forest Spring, breathing therapy and climate therapy at around 630 metres, over two to four weeks.',
        treats: [
          'Bronchial asthma and chronic obstructive pulmonary disease (COPD) (position V/5 of the indication list)',
          'Bronchiectasis and recurrent inflammation of the lower respiratory tract, including as a recognised occupational disease (V/4)',
          'Interstitial lung fibrosis of any cause under ongoing treatment (V/6)',
          'Allergic rhinitis and chronic inflammation of the upper respiratory tract',
          'Conditions after pneumonia, including the after-effects of COVID-19',
        ],
        notFor: [
          'Acute infectious respiratory disease and an acute worsening (exacerbation) in an active stage',
          'Active cancer with clinically detectable signs of persisting or progressing disease',
          'Uncompensated heart failure or marked circulatory weakness',
          'Pregnancy, or an inability to manage personal care without a companion',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: 'The spa physician reviews lung function findings and medication and puts together the treatment plan. Bring recent findings from your pulmonologist or family doctor, plus a list of your medication.',
          },
          {
            heading: 'Two to three treatments daily',
            body: 'Mornings bring inhalation from the Forest Spring and breathing therapy, supplemented by carbon dioxide baths or gas injections as prescribed. Rest lying down follows every treatment.',
          },
          {
            heading: 'Climate therapy and terrain cure',
            body: 'Guided walks on the historical network of promenades in the submontane climate, with pace and gradient matched to your fitness. Walking in fresh air is part of the treatment, not a leisure activity.',
          },
          {
            heading: 'Weekly check-up and final report',
            body: 'The physician checks your respiratory findings and function weekly and adjusts inhalations and exercises. At the end you receive a report for your own doctor and a home breathing exercise programme.',
          },
        ],
        procedures: [
          {
            name: 'Mineral-water inhalation from the Forest Spring',
            detail: 'Finely misted water moistens the mucous membranes and is traditionally used to loosen phlegm; usually two treatments daily.',
          },
          {
            name: 'Breathing therapy',
            detail: 'Individually and in groups with physiotherapists: prolonged exhalation, diaphragmatic breathing, coughing technique — the part of the cure you carry on using for good.',
          },
          {
            name: 'Carbon dioxide bath',
            detail: 'CO₂ absorbed through the skin widens the small vessels and increases skin blood flow; a supplementary treatment for respiratory diagnoses.',
          },
          {
            name: 'Dry gas bath and gas injections',
            detail: 'CO₂ from the local Maria’s gas with no circulatory strain from water, for when a full bath would be too demanding.',
          },
          {
            name: 'Climate therapy and terrain cure',
            detail: 'Guided walking in the officially recognised therapeutic valley basin; guided walking has been studied in COPD as training that improves quality of life and walking endurance.',
          },
          {
            name: 'Drinking cure',
            detail: 'A supplement depending on diagnosis; which spring, amount and timing apply is set individually by the doctor.',
          },
          {
            name: 'Supplementary treatments',
            detail: 'Massage, a salt cave or relaxation techniques depending on findings, for breathlessness and tension.',
          },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'For asthma and COPD (position V/5), stays covered by Czech public health insurance run to 28 days of comprehensive or 21 days of contributory spa care; for bronchiectasis and recurrent inflammation of the lower respiratory tract (V/4) it is 21 days with the option to repeat, and for interstitial lung fibrosis (V/6) 28 days of comprehensive or 21 days of contributory spa care. Self-paying guests usually choose two to three weeks in consultation with the spa physician. There is no medical rule for the season, though autumn is considered especially suitable because of falling pollen levels and as preparation for the heating season.',
        },
        evidence: {
          heading: 'What the studies show',
          body: 'A systematic review of 27 studies on inhaling mineral waters describes better nasal patency and mucociliary transport, but points to the low quality and heterogeneity of the studies (Fontana et al., 2025, Int J Biometeorol). A further systematic review on asthma and COPD finds improved lung function in asthma (Calzetta et al., 2024, J Clin Med; the number of high-quality randomised trials is limited). For exercise in water in COPD, a narrative review describes the evidence as strong, and for sulphur inhalations it describes better mucociliary clearance (Khaltaev et al., 2020, J Thorac Dis). A Hungarian before-after study without a control group in 678 patients with asthma or COPD recorded, after a three-week programme with daily outdoor breathing therapy, a rise in mean FEV1 from 71.0% to 77.7% of predicted; the influence of the climate cannot be separated from training and supervision in it (Müller et al., 2018, Eur J Integr Med). Guided walking itself is documented in COPD by a multicentre randomised trial of 143 patients: it improved quality of life and walking endurance after 8 to 10 weeks compared with usual care — but in an outpatient programme, not a spa stay (Wootton et al., 2014, Eur Respir J). None of the studies shows a change in the course of asthma or COPD itself.',
        },
        physicianNote: 'Whether and to what extent a spa cure is right for you is decided by the spa physician at the initial examination, based on your lung function findings. This page provides information and does not replace medical advice.',
        ongoing: {
          heading: 'Experience and research under way',
          body: 'Inhalations from the Forest Spring, breathing therapy and climate therapy have been part of the programme for respiratory conditions in Marienbad for generations; since 2023 the town has been recognised as a climatic spa by decision of the Ministry of Health. How the individual guest fares is not left unchecked: every treatment stay begins with an initial and ends with a final medical examination and a written final report, so the course is documented and the spa physician can adjust the plan along the way. Systematic evidence for spa medicine as a field is being built for the first time in a long while. The Institute of Spa Medicine and Balneology (Institut lázeňství a balneologie, v.v.i.), founded by the Karlovy Vary Region in 2019, has been running the first clinical study of this format in thirty years since 2026, together with Léčebné lázně Mariánské Lázně. It covers urological and nephrological diagnoses rather than the one described on this page: more than a hundred patients are examined before and after the spa stay for health status and quality of life, with prim. MUDr. Ladislav Špišák, CSc. as professional guarantor, and results are not yet available. The study runs within the Spa Research Centre project (2024 to 2027), funded by the Just Transition Operational Programme and working with the Czech Technical University, the University of West Bohemia and the Czech Academy of Sciences. What such work can produce is shown by the same institute’s earlier collaboration with the Marienbad spa houses: their joint study of spa rehabilitation after COVID-19 received the European Spas Association Innovation Award in 2021 in the Medical Spa Scientific Research category.',
        },
        faqs: [
          {
            question: 'Where should I go for spa treatment for respiratory conditions?',
            answer: 'Marienbad is listed as a spa town for the official indication group V — non-tuberculous diseases of the respiratory organs. The basis is the carbon-dioxide- and bicarbonate-rich Forest Spring for inhalation, natural carbon dioxide for gas baths, and a climate officially recognised as therapeutic since 2023, at around 630 metres of altitude.',
          },
          {
            question: 'Does a spa cure help with asthma or COPD?',
            answer: 'Asthma and COPD (position V/5) is a covered indication. A systematic review describes improved lung function in asthma and mixed results in COPD, with overall few high-quality studies; guided walking is documented as training in COPD by a randomised trial. The cure does not replace prescribed medication.',
          },
          {
            question: 'What does inhaling mineral water achieve?',
            answer: 'Finely misted water from the Forest Spring moistens the mucous membranes and is traditionally used to loosen phlegm. A systematic review of 27 studies describes better nasal patency and mucociliary transport afterwards, but points to the low quality of the underlying studies.',
          },
          {
            question: 'Why is autumn especially suitable for this cure?',
            answer: 'Pollen levels fall markedly in autumn, while the heating season begins, which further dries out the upper respiratory tract. Two to three weeks in moist, cool forest air with daily inhalation are therefore considered good preparation for winter.',
          },
          {
            question: 'How long does a spa cure for respiratory conditions last?',
            answer: 'For asthma and COPD, stays covered by Czech public health insurance run to 28 days of comprehensive or 21 days of contributory spa care, and 21 days for bronchiectasis. Self-paying guests usually choose two to three weeks; the first noticeable relief typically comes during the first week.',
          },
        ],
        sources: [
          {
            title: 'Clinical study of the objective effects of comprehensive spa care in kidney and urological conditions (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Ongoing study by the Institute of Spa Medicine and Balneology with Léčebné lázně Mariánské Lázně, more than a hundred patients, started 2026. It covers urological and nephrological diagnoses; results are not yet available.',
          },
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group V — non-tuberculous diseases of the respiratory organs',
            url: '/en/indications-and-contraindications',
            note: 'Positions V/4–V/6 with type of care and length (e.g. V/5 asthma/COPD: K 28 or P 21; V/4 bronchiectasis: K 21).',
          },
          {
            title: 'Official tourism portal of the town of Mariánské Lázně — Forest Spring (Lesní pramen)',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/lesni-pramen/',
            note: 'Water analysis (free CO₂ 2,960 mg/l, bicarbonate 1,352 mg/l, sodium 549 mg/l); traditional use for inhalation and the drinking cure.',
          },
          {
            title: 'Fontana M et al. 2025, Int J Biometeorol — systematic review of 27 studies on inhaling mineral waters',
            url: 'https://consensus.app/papers/details/e377f688a5f85f3c9e6c9373d675eb8e/',
            note: 'Better nasal patency, mucociliary transport and some lung parameters. Low quality and heterogeneity of the studies.',
          },
          {
            title: 'Calzetta L et al. 2024, J Clin Med — systematic review on balneotherapy in asthma and COPD',
            url: 'https://consensus.app/papers/details/a501a68157c55ab987f90c1b05309fbe/',
            note: 'Improved lung function in asthma, mixed results in COPD; few high-quality randomised trials.',
          },
          {
            title: 'Khaltaev N et al. 2020, J Thorac Dis — narrative review on balneotherapy in chronic respiratory disease',
            url: 'https://consensus.app/papers/details/ef1fb47a66af5341be76a01e6fde2ba4/',
            note: 'Exercise in water in COPD has strong evidence; sulphur inhalations improve mucociliary clearance. Narrative review.',
          },
          {
            title: 'Müller A et al. 2018, Eur J Integr Med — before-after study, 678 patients with asthma and COPD, three-week climate programme',
            url: 'https://doi.org/10.1016/j.eujim.2018.04.007',
            note: 'FEV1 rose from 71.0% to 77.7% of predicted. No control group; influence of climate not separable from training and supervision.',
          },
          {
            title: 'Wootton SL et al. 2014, Eur Respir J — multicentre randomised trial, 143 patients with COPD',
            url: 'https://doi.org/10.1183/09031936.00078014',
            note: 'Guided walking 2–3 times weekly over 8–10 weeks improved quality of life and walking endurance. Outpatient programme, not a spa stay.',
          },
        ],
        related: [
          {
            label: 'Spa treatment for respiratory conditions — the autumn guide',
            href: '/en/magazine/spa-treatment-respiratory-tract',
          },
          {
            label: 'Climate therapy',
            href: '/en/climate-therapy',
          },
          {
            label: 'The Forest Spring in profile',
            href: '/en/springs-overview/lesni',
          },
          {
            label: 'Rehabilitation after COVID',
            href: '/en/magazine/post-covid-rehabilitation',
          },
        ],
      },
      cs: {
        slug: 'dychaci-cesty',
        navLabel: 'Dýchací cesty',
        title: 'Lázeňská léčba dýchacích cest v Mariánských Lázních',
        h1: 'Lázeňská léčba dýchacích cest',
        metaTitle: 'Léčba dýchacích cest v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Astma, CHOPN a chronické potíže dýchacích cest v Mariánských Lázních: inhalace z Lesního pramene, dechová terapie a klimatoterapie — pro koho a jak dlouho.',
        lead: 'Chronická onemocnění dýchacích cest jako astma, CHOPN nebo opakovaná bronchitida tvoří v Mariánských Lázních samostatnou indikační skupinu. Léčba se opírá o inhalace z uhličitého Lesního pramene, dechovou terapii a od roku 2023 úředně uznané klimatické podmínky v nadmořské výšce kolem 630 metrů.',
        teaser: 'Astma, CHOPN a chronická bronchitida: inhalace z Lesního pramene, dechová terapie a klimatoterapie v nadmořské výšce kolem 630 metrů, po dva až čtyři týdny.',
        treats: [
          'Bronchiální astma a chronická obstrukční plicní nemoc (CHOPN) (položka V/5 indikačního seznamu)',
          'Bronchiektázie a opakované záněty dolních cest dýchacích, i jako uznaná nemoc z povolání (V/4)',
          'Intersticiální plicní fibróza jakékoli etiologie v trvalé léčbě (V/6)',
          'Alergická rýma a chronické záněty horních cest dýchacích',
          'Stavy po prodělaných zápalech plic, včetně následků covidu-19',
        ],
        notFor: [
          'Akutní infekční onemocnění dýchacích cest a akutní zhoršení (exacerbace) v aktivním stadiu',
          'Aktivní nádorové onemocnění s klinicky zjistitelnými známkami trvání nebo progrese nemoci',
          'Nekompenzované srdeční selhání nebo výrazná oběhová slabost',
          'Těhotenství a neschopnost sebeobsluhy bez doprovodu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde nálezy plicních funkcí a medikaci a sestaví léčebný plán. Vezměte si aktuální nálezy od pneumologa nebo praktického lékaře a seznam léků.',
          },
          {
            heading: 'Dvě až tři procedury denně',
            body: 'Dopoledne inhalace z Lesního pramene a dechová terapie, doplněné uhličitými koupelemi nebo plynovými injekcemi podle ordinace lékaře. Po každé proceduře následuje klid vleže.',
          },
          {
            heading: 'Klimatoterapie a terénní léčba',
            body: 'Vedené procházky po historické síti kolonád v podhorském klimatu, s tempem a stoupáním přizpůsobenými kondici. Chůze na čerstvém vzduchu je součástí léčby, ne volnočasový program.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Lékař týdně kontroluje nález a funkci dýchacích cest a upravuje inhalace i cvičení. Na závěr dostanete zprávu pro svého ošetřujícího lékaře a program dechových cvičení domů.',
          },
        ],
        procedures: [
          {
            name: 'Inhalace minerální vody z Lesního pramene',
            detail: 'Jemně rozprášená voda zvlhčuje sliznice a tradičně se používá k uvolnění hlenu; obvykle dvě procedury denně.',
          },
          {
            name: 'Dechová terapie',
            detail: 'Individuálně i skupinově s fyzioterapeuty: prodloužený výdech, brániční dýchání, technika kašle — část kúry, kterou si člověk odnáší natrvalo.',
          },
          {
            name: 'Uhličitá koupel',
            detail: 'CO₂ vstřebané kůží rozšiřuje drobné cévy a zvyšuje prokrvení kůže; u diagnóz dýchacích cest jde o doplňkovou proceduru.',
          },
          {
            name: 'Suchá plynová koupel a plynové injekce',
            detail: 'CO₂ z místního Mariina plynu bez oběhové zátěže vodou, když by celková koupel byla příliš namáhavá.',
          },
          {
            name: 'Klimatoterapie a terénní léčba',
            detail: 'Vedená chůze v klimaticky uznané kotlině; vedená chůze je u CHOPN zkoumaná jako trénink zlepšující kvalitu života a vytrvalost při chůzi.',
          },
          {
            name: 'Pitná kúra',
            detail: 'Doplňkově podle diagnózy; který pramen, množství a čas určuje lékař individuálně.',
          },
          {
            name: 'Doplňkové procedury',
            detail: 'Masáže, solná jeskyně nebo relaxační techniky podle nálezu, při dušnosti a napětí.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Astma a CHOPN (položka V/5), bronchiektázie a opakované záněty dolních cest dýchacích (V/4) i intersticiální plicní fibróza (V/6) mají hrazenou délku pobytu podle indikačního seznamu; přesný rozpis najdete na stránce Co hradí pojišťovna u dýchacích cest. Samoplátci volí obvykle dva až tři týdny po dohodě s lázeňským lékařem. Pro roční období neexistuje lékařský předpis, přesto se podzim díky ustupující pylové zátěži a jako příprava na topnou sezonu považuje za zvlášť vhodný.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'Systematický přehled 27 studií k inhalaci minerálních vod popisuje lepší průchodnost nosu a mukociliární transport, upozorňuje ale na nízkou kvalitu a nejednotnost studií (Fontana a kol., 2025, Int J Biometeorol). Další systematický přehled k astmatu a CHOPN nachází u astmatu zlepšenou plicní funkci (Calzetta a kol., 2024, J Clin Med; počet kvalitních randomizovaných studií je omezený). Pro trénink ve vodě u CHOPN se podle narativního přehledu považují doklady za silné, u sirných inhalací se popisuje lepší mukociliární clearance (Khaltaev a kol., 2020, J Thorac Dis). Maďarská studie před-po bez kontrolní skupiny u 678 pacientů s astmatem nebo CHOPN zaznamenala po třítýdenním programu s denní dechovou terapií venku vzestup průměrné hodnoty FEV1 ze 71,0 na 77,7 % náležité hodnoty; vliv klimatu se v ní nedá oddělit od tréninku a péče (Müller a kol., 2018, Eur J Integr Med). Vedená chůze samotná je u CHOPN doložená multicentrickou randomizovanou studií se 143 pacienty: po 8 až 10 týdnech zlepšila kvalitu života a vytrvalost při chůzi oproti obvyklé péči — šlo ale o ambulantní program, ne o lázeňský pobyt (Wootton a kol., 2014, Eur Respir J). Žádná ze studií neukazuje změnu průběhu astmatu nebo CHOPN samotného.',
        },
        physicianNote: 'O tom, zda a v jakém rozsahu pro vás lázeňská léčba připadá v úvahu, rozhoduje lázeňský lékař při vstupní prohlídce podle nálezů vašich plicních funkcí. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        ongoing: {
          heading: 'Zkušenost a probíhající výzkum',
          body: 'Inhalace z Lesního pramene, dechová terapie a klimatoterapie patří v Mariánských Lázních k programu u onemocnění dýchacích cest po generace; od roku 2023 je město rozhodnutím ministerstva zdravotnictví uznáno jako klimatické lázně. Jak na tom jednotlivý host je, se nenechává bez kontroly: každý léčebný pobyt začíná vstupní a končí výstupní lékařskou prohlídkou a závěrečnou zprávou, takže je průběh doložený a lázeňský lékař může plán během pobytu upravit. Pro lázeňskou medicínu jako obor vzniká poprvé po dlouhé době systematická evidence. Institut lázeňství a balneologie, v.v.i., který Karlovarský kraj založil v roce 2019, vede od roku 2026 spolu s Léčebnými lázněmi Mariánské Lázně první klinickou studii tohoto formátu po třiceti letech. Týká se urologických a nefrologických diagnóz, ne té popsané na této stránce: více než sto pacientů se vyšetřuje před lázeňskou léčbou a po ní na ukazatele zdravotního stavu a kvality života, odborným garantem je prim. MUDr. Ladislav Špišák, CSc., a výsledky zatím nejsou k dispozici. Studie běží v projektu Centrum lázeňského výzkumu (2024 až 2027), financovaném z Operačního programu Spravedlivá transformace a spolupracujícím s ČVUT, Západočeskou univerzitou a Akademií věd ČR. Co z takové práce může vzejít, ukazuje dřívější spolupráce téhož institutu s mariánskolázeňskými lázeňskými domy: jejich společná studie lázeňské rehabilitace po covidu-19 získala v roce 2021 Innovation Award Evropského svazu lázní v kategorii Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Co léčí Mariánské Lázně u dýchacích cest?',
            answer: 'Mariánské Lázně jsou vedeny jako lázeňské místo pro oficiální indikační skupinu V — netuberkulózní nemoci dýchacích orgánů. Základem je uhličitý a hydrogenuhličitanem bohatý Lesní pramen pro inhalace, přírodní oxid uhličitý pro plynové koupele a od roku 2023 úředně uznané klimatické podmínky v nadmořské výšce kolem 630 metrů.',
          },
          {
            question: 'Pomůže lázeňský pobyt při astmatu nebo CHOPN?',
            answer: 'Astma a CHOPN (položka V/5) jsou hrazenou indikací. Systematický přehled popisuje u astmatu zlepšenou plicní funkci, u CHOPN smíšené výsledky, při celkově málo kvalitních studiích; vedená chůze je jako trénink u CHOPN doložená randomizovanou studií. Lázeňská léčba nenahrazuje předepsané léky.',
          },
          {
            question: 'Co přináší inhalace minerální vody?',
            answer: 'Jemně rozprášená voda z Lesního pramene zvlhčuje sliznice a tradičně se používá k uvolnění hlenu. Systematický přehled 27 studií popisuje po ní lepší průchodnost nosu a mukociliární transport, upozorňuje ale na nízkou kvalitu podkladových studií.',
          },
          {
            question: 'Proč se pro tuto kúru zvlášť hodí podzim?',
            answer: 'Na podzim výrazně klesá pylová zátěž, zatímco začíná topná sezona, která navíc vysušuje horní cesty dýchací. Dva až tři týdny ve vlhkém, chladném lesním vzduchu s denní inhalací se proto považují za dobrou přípravu na zimu.',
          },
          {
            question: 'Jak dlouho trvá lázeňský pobyt při potížích s dýcháním?',
            answer: 'Podle indikačního seznamu se délka liší podle konkrétní položky; přesný rozpis najdete na stránce Co hradí pojišťovna u dýchacích cest. Samoplátci volí obvykle dva až tři týdny; první citelná úleva se obvykle dostaví v průběhu prvního týdne.',
          },
        ],
        sources: [
          {
            title: 'Klinická studie objektivních účinků komplexní lázeňské péče u urologických a nefrologických diagnóz (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Probíhající studie Institutu lázeňství a balneologie s Léčebnými lázněmi Mariánské Lázně, více než sto pacientů, zahájena 2026. Týká se urologických a nefrologických diagnóz; výsledky zatím nejsou k dispozici.',
          },
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina V — netuberkulózní nemoci dýchacích orgánů',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Položky V/4–V/6 s typem péče a délkou (např. V/5 astma/CHOPN, V/4 bronchiektázie).',
          },
          {
            title: 'Oficiální turistický portál města Mariánské Lázně — Lesní pramen',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/lesni-pramen/',
            note: 'Rozbor vody (volný CO₂ 2 960 mg/l, hydrogenuhličitan 1 352 mg/l, sodík 549 mg/l); tradiční využití k inhalacím a pitné kúře.',
          },
          {
            title: 'Fontana M a kol. 2025, Int J Biometeorol — systematický přehled 27 studií k inhalaci minerálních vod',
            url: 'https://consensus.app/papers/details/e377f688a5f85f3c9e6c9373d675eb8e/',
            note: 'Lepší průchodnost nosu, mukociliární transport a některé plicní parametry. Nízká kvalita a nejednotnost studií.',
          },
          {
            title: 'Calzetta L a kol. 2024, J Clin Med — systematický přehled k balneoterapii u astmatu a CHOPN',
            url: 'https://consensus.app/papers/details/a501a68157c55ab987f90c1b05309fbe/',
            note: 'Zlepšená plicní funkce u astmatu, smíšené výsledky u CHOPN; málo kvalitních randomizovaných studií.',
          },
          {
            title: 'Khaltaev N a kol. 2020, J Thorac Dis — narativní přehled k balneoterapii u chronických nemocí dýchacích cest',
            url: 'https://consensus.app/papers/details/ef1fb47a66af5341be76a01e6fde2ba4/',
            note: 'Trénink ve vodě u CHOPN má silné doklady; sirné inhalace zlepšují mukociliární clearance. Narativní přehled.',
          },
          {
            title: 'Müller A a kol. 2018, Eur J Integr Med — studie před-po, 678 pacientů s astmatem a CHOPN, třítýdenní klimatický program',
            url: 'https://doi.org/10.1016/j.eujim.2018.04.007',
            note: 'FEV1 vzrostl ze 71,0 na 77,7 % náležité hodnoty. Bez kontrolní skupiny; vliv klimatu neoddělitelný od tréninku a péče.',
          },
          {
            title: 'Wootton SL a kol. 2014, Eur Respir J — multicentrická randomizovaná studie, 143 pacientů s CHOPN',
            url: 'https://doi.org/10.1183/09031936.00078014',
            note: 'Vedená chůze 2–3× týdně po 8–10 týdnů zlepšila kvalitu života a vytrvalost při chůzi. Ambulantní program, ne lázeňský pobyt.',
          },
        ],
        related: [
          {
            label: 'Lázeňská léčba dýchacích cest — podzimní kúra',
            href: '/cs/magazin/lazenska-lecba-dychacich-cest',
          },
          {
            label: 'Klimatoterapie',
            href: '/cs/klimatoterapie',
          },
          {
            label: 'Lesní pramen v profilu',
            href: '/cs/prehled-pramenu/lesni',
          },
          {
            label: 'Rehabilitace po covidu',
            href: '/cs/magazin/rehabilitace-po-covidu',
          },
          {
            label: 'Co hradí pojišťovna u dýchacích cest',
            href: '/cs/lazne-s-pojistovnou/indikace/dychaci-ustroji',
          },
        ],
      },
      ru: {
        slug: 'dykhatelnye-puti',
        navLabel: 'Дыхательные пути',
        title: 'Курортное лечение заболеваний дыхательных путей в Марианских Лазнях',
        h1: 'Курортное лечение заболеваний дыхательных путей',
        metaTitle: 'Лечение дыхательных путей — Марианские Лазни | Marienbad.com',
        metaDescription: 'Лечение астмы и ХОБЛ в Марианских Лазнях: ингаляции, дыхательная гимнастика и климатотерапия — для кого и сколько длится.',
        lead: 'Хронические заболевания дыхательных путей, такие как астма, ХОБЛ или рецидивирующий бронхит, образуют в Марианских Лазнях отдельную группу показаний. Лечение опирается на ингаляции из богатого углекислотой Лесного источника, дыхательную гимнастику и официально признанный с 2023 года лечебный климат на высоте около 630 метров.',
        teaser: 'Астма, ХОБЛ и хронический бронхит: ингаляции из Лесного источника, дыхательная гимнастика и климатотерапия на высоте около 630 метров, в течение двух-четырёх недель.',
        treats: [
          'Бронхиальная астма и хроническая обструктивная болезнь лёгких (ХОБЛ) (позиция V/5 индикационного списка)',
          'Бронхоэктазы и рецидивирующие воспаления нижних дыхательных путей, в том числе как признанное профессиональное заболевание (V/4)',
          'Интерстициальный лёгочный фиброз любой этиологии при постоянном лечении (V/6)',
          'Аллергический ринит и хронические воспаления верхних дыхательных путей',
          'Состояния после перенесённых пневмоний, включая последствия COVID-19',
        ],
        notFor: [
          'Острые инфекционные заболевания дыхательных путей и острое обострение (экзацербация) в активной фазе',
          'Активное онкологическое заболевание с клинически выявляемыми признаками сохранения или прогрессирования болезни',
          'Некомпенсированная сердечная недостаточность или выраженная недостаточность кровообращения',
          'Беременность, а также неспособность к самообслуживанию без сопровождающего лица',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает результаты исследования функции лёгких и принимаемые препараты и составляет план лечения. Возьмите с собой актуальные заключения пульмонолога или терапевта, а также список лекарств.',
          },
          {
            heading: 'Две-три процедуры в день',
            body: 'В первой половине дня — ингаляции из Лесного источника и дыхательная гимнастика, дополненные углекислыми ваннами или газовыми инъекциями по назначению врача. После каждой процедуры следует отдых лёжа.',
          },
          {
            heading: 'Климатотерапия и терренкур',
            body: 'Направляемые маршруты ходьбы по историческим прогулочным дорожкам в предгорном климате, темп и подъём подбираются по физической форме. Прогулки на свежем воздухе — часть лечения, а не программа досуга.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Врач еженедельно проверяет состояние и функцию дыхательных путей и корректирует ингаляции и упражнения. По окончании вы получаете заключение для вашего лечащего врача и программу дыхательных упражнений на дом.',
          },
        ],
        procedures: [
          {
            name: 'Ингаляция минеральной водой из Лесного источника',
            detail: 'Мелкораспылённая вода увлажняет слизистые оболочки и традиционно применяется для разжижения слизи; обычно две процедуры в день.',
          },
          {
            name: 'Дыхательная гимнастика',
            detail: 'Индивидуально и в группе с физиотерапевтами: удлинённый выдох, диафрагмальное дыхание, техника кашля — та часть лечения, которую пациент забирает с собой надолго.',
          },
          {
            name: 'Углекислая ванна',
            detail: 'Проникающий через кожу CO₂ расширяет мелкие сосуды и усиливает кровоснабжение кожи; при заболеваниях дыхательных путей — дополнительная процедура.',
          },
          {
            name: 'Сухая газовая ванна и газовые инъекции',
            detail: 'CO₂ из местного марианского газа, без нагрузки на кровообращение от воды, когда полная ванна была бы слишком утомительной.',
          },
          {
            name: 'Климатотерапия и терренкур',
            detail: 'Направляемая ходьба в котловине с официально признанным лечебным климатом; при ХОБЛ направляемая ходьба изучена как тренировка для улучшения качества жизни и выносливости при ходьбе.',
          },
          {
            name: 'Питьевой курс',
            detail: 'Дополнительно, по диагнозу; какой источник, количество и время приёма — определяет врач индивидуально.',
          },
          {
            name: 'Дополнительные процедуры',
            detail: 'Массаж, соляная пещера или техники релаксации по показаниям, при одышке и напряжении.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'При астме и ХОБЛ (позиция V/5) для пребываний, оплачиваемых чешской страховой, предусмотрено 28 дней комплексного или 21 день долевого курортного лечения; при бронхоэктазах и рецидивирующих воспалениях нижних дыхательных путей (V/4) — 21 день с возможностью повторения, при интерстициальном лёгочном фиброзе (V/6) — 28 дней комплексного или 21 день долевого курортного лечения. Гости, оплачивающие лечение самостоятельно, обычно выбирают две-три недели по согласованию с курортным врачом. Для времени года медицинских рекомендаций нет, однако осень считается особенно подходящей из-за снижения нагрузки пыльцой и как подготовка к отопительному сезону.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'Систематический обзор 27 исследований ингаляций минеральных вод описывает лучшую проходимость носа и мукоцилиарный транспорт, но указывает на невысокое качество и неоднородность исследований (Fontana et al., 2025, Int J Biometeorol). Ещё один систематический обзор по астме и ХОБЛ находит улучшенную функцию лёгких при астме (Calzetta et al., 2024, J Clin Med; число качественных рандомизированных исследований ограничено). Для тренировок в воде при ХОБЛ доказательства, согласно нарративному обзору, считаются весомыми, для серных ингаляций описан лучший мукоцилиарный клиренс (Khaltaev et al., 2020, J Thorac Dis). Венгерское исследование «до-после» без контрольной группы на 678 пациентах с астмой или ХОБЛ зафиксировало после трёхнедельной программы с ежедневной дыхательной гимнастикой на открытом воздухе рост среднего показателя ОФВ1 с 71,0 до 77,7 % от должного; влияние климата отделить от тренировок и наблюдения в этом исследовании нельзя (Müller et al., 2018, Eur J Integr Med). Само направляемое хождение при ХОБЛ доказано в многоцентровом рандомизированном исследовании со 143 пациентами: оно улучшило через 8–10 недель качество жизни и выносливость при ходьбе по сравнению с обычным лечением — однако в рамках амбулаторной программы, а не курортного пребывания (Wootton et al., 2014, Eur Respir J). Ни одно из исследований не показывает изменения течения самой болезни — астмы или ХОБЛ.',
        },
        physicianNote: 'Показано ли вам курортное лечение и в каком объёме, решает курортный врач при первичном осмотре на основании результатов исследования функции лёгких. Эта страница носит информационный характер и не заменяет консультацию врача.',
        ongoing: {
          heading: 'Опыт и текущие исследования',
          body: 'Ингаляции из Лесного источника, дыхательная терапия и климатотерапия входят в программу при заболеваниях дыхательных путей в Марианских Лазнях уже поколения; с 2023 года город решением министерства здравоохранения признан климатическим курортом. Как идут дела у конкретного гостя, не остаётся без проверки: каждое лечебное пребывание начинается с первичного и заканчивается выходным врачебным осмотром и письменным заключением, поэтому течение задокументировано, а курортный врач может по ходу скорректировать план. Для курортной медицины как отрасли впервые за долгое время создаётся систематическая доказательная база. Институт курортного дела и бальнеологии (Institut lázeňství a balneologie, v.v.i.), основанный Карловарским краем в 2019 году, с 2026 года вместе с «Léčebné lázně Mariánské Lázně» проводит первое клиническое исследование такого формата за тридцать лет. Оно касается урологических и нефрологических диагнозов, а не того, который описан на этой странице: более ста пациентов обследуют до курортного лечения и после него по показателям состояния здоровья и качества жизни, научный гарант — prim. MUDr. Ladislav Špišák, CSc., результатов пока нет. Исследование идёт в рамках проекта «Центр курортных исследований» (2024–2027), финансируемого Операционной программой справедливой трансформации, с участием Чешского технического университета, Западночешского университета и Академии наук Чехии. Что даёт такая работа, показывает более раннее сотрудничество того же института с курортными домами Марианских Лазней: их совместное исследование курортной реабилитации после COVID-19 получило в 2021 году Innovation Award Европейского союза курортов в категории Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Куда ехать лечить заболевания дыхательных путей?',
            answer: 'Марианские Лазни указаны как курорт для официальной группы показаний V — нетуберкулёзные заболевания органов дыхания. Основа — богатый углекислотой и гидрокарбонатами Лесной источник для ингаляций, природный углекислый газ для газовых ванн и официально признанный с 2023 года лечебный климат на высоте около 630 метров.',
          },
          {
            question: 'Помогает ли курортное лечение при астме или ХОБЛ?',
            answer: 'Астма и ХОБЛ (позиция V/5) — оплачиваемое показание. Систематический обзор описывает при астме улучшенную функцию лёгких, при ХОБЛ — смешанные результаты, при в целом небольшом числе качественных исследований; направляемая ходьба как тренировка при ХОБЛ доказана в рандомизированном исследовании. Лечение не заменяет назначенные лекарства.',
          },
          {
            question: 'Что даёт ингаляция минеральной водой?',
            answer: 'Мелкораспылённая вода из Лесного источника увлажняет слизистые оболочки и традиционно применяется для разжижения слизи. Систематический обзор 27 исследований описывает после этого лучшую проходимость носа и мукоцилиарный транспорт, но указывает на невысокое качество лежащих в основе исследований.',
          },
          {
            question: 'Почему осень особенно подходит для этого лечения?',
            answer: 'Осенью заметно снижается нагрузка пыльцой, тогда как начинается отопительный сезон, который дополнительно пересушивает верхние дыхательные пути. Две-три недели во влажном, прохладном лесном воздухе с ежедневной ингаляцией поэтому считаются хорошей подготовкой к зиме.',
          },
          {
            question: 'Сколько длится курортное лечение при заболеваниях дыхательных путей?',
            answer: 'При астме и ХОБЛ для пребываний, оплачиваемых чешской страховой, предусмотрено 28 дней комплексного или 21 день долевого курортного лечения, при бронхоэктазах — 21 день. Гости, оплачивающие лечение самостоятельно, обычно выбирают две-три недели; первое заметное облегчение обычно наступает в течение первой недели.',
          },
        ],
        sources: [
          {
            title: 'Клиническое исследование объективных эффектов комплексного курортного лечения при урологических и нефрологических диагнозах (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Продолжающееся исследование Института курортного дела и бальнеологии вместе с «Léčebné lázně Mariánské Lázně», более ста пациентов, начато в 2026 году. Касается урологических и нефрологических диагнозов; результатов пока нет.',
          },
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа V — нетуберкулёзные заболевания органов дыхания',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Позиции V/4–V/6 с видом и длительностью лечения (например, V/5 астма/ХОБЛ: K 28 или P 21; V/4 бронхоэктазы: K 21).',
          },
          {
            title: 'Официальный туристический портал города Марианске-Лазне — Лесной источник (Lesní pramen)',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/lesni-pramen/',
            note: 'Анализ воды (свободный CO₂ 2960 мг/л, гидрокарбонат 1352 мг/л, натрий 549 мг/л); традиционное применение для ингаляций и питьевого курса.',
          },
          {
            title: 'Fontana M et al. 2025, Int J Biometeorol — систематический обзор 27 исследований ингаляций минеральных вод',
            url: 'https://consensus.app/papers/details/e377f688a5f85f3c9e6c9373d675eb8e/',
            note: 'Лучшая проходимость носа, мукоцилиарный транспорт и некоторые лёгочные показатели. Невысокое качество и неоднородность исследований.',
          },
          {
            title: 'Calzetta L et al. 2024, J Clin Med — систематический обзор бальнеотерапии при астме и ХОБЛ',
            url: 'https://consensus.app/papers/details/a501a68157c55ab987f90c1b05309fbe/',
            note: 'Улучшенная функция лёгких при астме, смешанные результаты при ХОБЛ; мало качественных рандомизированных исследований.',
          },
          {
            title: 'Khaltaev N et al. 2020, J Thorac Dis — нарративный обзор бальнеотерапии при хронических заболеваниях дыхательных путей',
            url: 'https://consensus.app/papers/details/ef1fb47a66af5341be76a01e6fde2ba4/',
            note: 'Тренировки в воде при ХОБЛ имеют весомые доказательства; серные ингаляции улучшают мукоцилиарный клиренс. Нарративный обзор.',
          },
          {
            title: 'Müller A et al. 2018, Eur J Integr Med — исследование «до-после», 678 пациентов с астмой и ХОБЛ, трёхнедельная климатическая программа',
            url: 'https://doi.org/10.1016/j.eujim.2018.04.007',
            note: 'ОФВ1 вырос с 71,0 до 77,7 % от должного. Без контрольной группы; влияние климата неотделимо от тренировок и наблюдения.',
          },
          {
            title: 'Wootton SL et al. 2014, Eur Respir J — многоцентровое рандомизированное исследование, 143 пациента с ХОБЛ',
            url: 'https://doi.org/10.1183/09031936.00078014',
            note: 'Направляемая ходьба 2–3 раза в неделю в течение 8–10 недель улучшила качество жизни и выносливость при ходьбе. Амбулаторная программа, не курортное пребывание.',
          },
        ],
        related: [
          {
            label: 'Курортное лечение дыхательных путей осенью',
            href: '/ru/zhurnal/sanatornoe-lechenie-dykhatelnykh-putej',
          },
          {
            label: 'Климатотерапия',
            href: '/ru/klimatoterapiya',
          },
          {
            label: 'Лесной источник — портрет',
            href: '/ru/obzor-istochnikov/lesni',
          },
          {
            label: 'Реабилитация после COVID',
            href: '/ru/zhurnal/reabilitatsiya-posle-kovida',
          },
        ],
      },
    },
  },
  {
    id: 'digestive',
    groupId: 'digestive',
    roman: 'III',
    codes: [
      'III/1',
      'III/3',
      'III/4',
      'III/8',
    ],
    conditionName: 'Digestive disorders',
    image: '/images/library/drinking-cure/spa-cup-daylight-spring.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Kurgast trinkt bei Tageslicht Mineralwasser aus einem Trinkbecher an der Quelle',
      en: 'A spa guest drinks mineral water from a drinking cup at the spring in daylight',
      cs: 'Lázeňský host pije za denního světla minerální vodu z pohárku u pramene',
      ru: 'Гость курорта при дневном свете пьёт минеральную воду из питьевого бокальчика у источника',
    },
    content: {
      de: {
        slug: 'verdauung',
        navLabel: 'Verdauung',
        title: 'Kur bei Verdauungsbeschwerden in Marienbad',
        h1: 'Kur bei Verdauungsbeschwerden',
        metaTitle: 'Kur bei Verdauungsbeschwerden in Marienbad | Marienbad.com',
        metaDescription: 'Kur bei Verdauungsbeschwerden in Marienbad: Trinkkur aus dem Kreuzbrunnen, Diätprogramm und Indikationsliste — was behandelt wird und wie lange sie dauert.',
        lead: 'Marienbad wurde durch ein Wasser berühmt, das schon vor dem ersten Kurhotel für seine Wirkung auf die Verdauung bekannt war. Die Kur bei Verdauungsbeschwerden stützt sich auf die Trinkkur aus sulfathaltigen Quellen wie dem Kreuzbrunnen, ein individuelles Diätprogramm und ärztliche Begleitung über mehrere Wochen.',
        teaser: 'Chronische Magen-Darm-Beschwerden, Gallenblasenleiden und chronische Pankreatitis: Trinkkur aus dem Kreuzbrunnen, Diätprogramm und tägliche ärztliche Begleitung.',
        treats: [
          'Chronische und rezidivierende Erkrankungen von Magen und Darm mit anhaltenden Beschwerden trotz Standardtherapie (Position III/1)',
          'Crohnsche Krankheit und Colitis ulcerosa (III/3)',
          'Chronische Erkrankungen von Gallenblase und Gallentrakt mit Steinleiden sowie funktionelle Störungen des Gallentrakts (III/4)',
          'Nachgewiesene chronische Pankreatitis sowie Zustände nach akuter Pankreatitis (III/8)',
          'Zustände nach Operationen von Magen, Zwölffingerdarm oder Darm mit endoskopisch gesicherter postoperativer Symptomatik',
        ],
        notFor: [
          'Akute Magen-Darm-Erkrankungen, akute Infektionen oder eine floride Verschlechterung ohne vorherige fachärztliche Abklärung',
          'Fehlende endoskopische oder gastroenterologische Befunde zur Sicherung der Diagnose, vor allem bei postoperativen Zuständen',
          'Akute Infektionskrankheiten, aktive Tumorerkrankung mit Anzeichen des Fortschreitens, ausgeprägte Kachexie',
          'Schwangerschaft sowie Unfähigkeit zur Selbstversorgung ohne Begleitperson',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt sichtet gastroenterologische Befunde, bei postoperativen Zuständen auch endoskopische Berichte, und legt Quelle, Menge und Zeitpunkt der Trinkkur individuell fest. Bringen Sie aktuelle Befunde mit — ohne sie kann kein verbindlicher Plan entstehen.',
          },
          {
            heading: 'Trinkkur und Anwendungen am Vormittag',
            body: 'Der Tag beginnt vor dem Frühstück an der Quelle mit Becher und langsamem Gang; danach folgen Mineralbäder, trockene Kohlensäurebäder oder durchblutungsfördernde Verfahren nach Verordnung. Nach jeder Anwendung folgt Ruhe im Liegen.',
          },
          {
            heading: 'Diät und Bewegung am Nachmittag',
            body: 'Die Kurküche kocht nach dem verordneten Diätsystem; der Nachmittag gehört leichter Bewegung, meist Gehen in den Kurwäldern, die die Verdauung unterstützt.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body: 'Einmal wöchentlich passt der Arzt Trinkplan und Diät an. Zum Abschluss erhalten Sie einen Bericht für Ihren behandelnden Arzt und Empfehlungen für die Ernährung zu Hause.',
          },
        ],
        procedures: [
          {
            name: 'Trinkkur aus dem Kreuzbrunnen',
            detail: 'Sulfat-hydrogenkarbonat-natriumhaltiges Wasser mit mild abführender Wirkung; Menge, Temperatur und Zeitpunkt vor der Mahlzeit legt der Arzt individuell fest.',
          },
          {
            name: 'Trinkkur aus dem Ferdinandsbrunnen',
            detail: 'Der Zusammensetzung des Kreuzbrunnens nah, bei Stoffwechsel- und Verdauungsindikationen eingesetzt.',
          },
          {
            name: 'Diätprogramm der Kurküche',
            detail: 'Individuell zusammengestellter Speiseplan nach Diagnose, etwa bei Gallensteinleiden oder nach einer Magenoperation.',
          },
          {
            name: 'Trockenes Kohlensäurebad',
            detail: 'Aus dem örtlichen Mariengas mit 99,7 % CO₂; unterstützt Entspannung und Durchblutung als Teil des Tagesplans.',
          },
          {
            name: 'Physikalische Therapie',
            detail: 'Elektro- oder Magnettherapie, bei manchen Diagnosen ergänzend zur Trinkkur und Diät verordnet.',
          },
          {
            name: 'Bewegung im Gehen',
            detail: 'Langsames Gehen zwischen den Trinkschlucken und am Nachmittag unterstützt die Passage und ist die empfohlene leichte Aktivität bei Verdauungsdiagnosen.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Die Dauer richtet sich nach der Position der Indikationsliste: bei chronischen Magen-Darm-Erkrankungen (III/1) 21 Tage Zuschuss-Kurbehandlung, bei Crohnscher Krankheit und Colitis ulcerosa (III/3) 21 Tage komplexe oder Zuschuss-Kurbehandlung, bei chronischen Gallenblasen- und Gallenwegsleiden (III/4) 21 Tage Zuschuss-Kurbehandlung und bei chronischer Pankreatitis (III/8) 21 Tage komplexe oder Zuschuss-Kurbehandlung. Selbstzahler wählen meist zwei bis drei Wochen nach Absprache mit dem Kurarzt. Spätsommer und Herbst gelten als günstig, weil sich Ferienreisen und unregelmäßige Mahlzeiten dann meist schon bemerkbar gemacht haben und die Stadt nach der Hauptsaison ruhiger ist.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body: 'Für sulfat- und magnesiumreiches Mineralwasser bei funktioneller Verstopfung liegt eine doppelblinde randomisierte Studie mit 226 Teilnehmern vor: Nach 14 Tagen sprachen 50 % auf die Behandlung an gegenüber 29 % unter Kontrollwasser; es handelte sich um ein französisches Wasser anderer Zusammensetzung (Dupont et al., 2019, Nutrition). Eine placebokontrollierte Studie mit 106 Teilnehmern fand nach sechs Wochen mit einem halben Liter Sulfatwasser täglich mehr spontane Stuhlgänge und eine bessere Konsistenz, bei nur grenzwertig signifikantem primärem Endpunkt (Bothe et al., 2015, Eur J Nutr). Eine britische diätetische Leitlinie von 2025 nennt Wasser mit höherem Mineralgehalt deshalb als eine Option bei chronischer Verstopfung, mit niedriger bis mittlerer Evidenzsicherheit (Dimidi et al., 2025, J Hum Nutr Diet). Zur Gallenblase ist die Datenlage spärlicher: In einer kontrollierten Studie mit 40 Teilnehmern verkleinerte sich nach zwölf Tagen Trinken eines Sulfat-Hydrogencarbonat-Wassers das Nüchternvolumen der Gallenblase, bei häufigerem Stuhlgang; es war ein italienisches Wasser anderer Zusammensetzung und eine kleine Stichprobe (Corradini et al., 2012, World J Gastroenterol). Zu Crohnscher Krankheit, Colitis ulcerosa und chronischer Pankreatitis liegen keine vergleichbaren kontrollierten Studien zur Trinkkur vor; die Behandlung stützt sich hier auf die Erfahrung der Kurmedizin und die engmaschige ärztliche Begleitung.',
        },
        physicianNote: 'Ob und in welcher Form eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer gastroenterologischen Befunde. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        ongoing: {
          heading: 'Erfahrung und laufende Forschung',
          body: 'Die Trinkkur an der Kreuzquelle bei Verdauungsbeschwerden ist der älteste Anlass, aus dem Gäste nach Marienbad kommen; Menge, Quelle und Zeitpunkt legt bis heute der Kurarzt einzeln fest. Wie es dem einzelnen Gast dabei ergeht, bleibt nicht ungeprüft: Jeder Behandlungsaufenthalt beginnt mit einer Eingangs- und endet mit einer Abschlussuntersuchung samt schriftlichem Abschlussbericht, sodass der Verlauf dokumentiert ist und der Kurarzt den Plan unterwegs anpassen kann. Für die Kurmedizin als Fach entsteht derzeit erstmals seit Langem systematische Evidenz. Das Institut lázeňství a balneologie, v.v.i., die 2019 vom Karlsbader Kreis gegründete Forschungseinrichtung für Kurwesen und Balneologie, führt seit 2026 gemeinsam mit den Léčebné lázně Mariánské Lázně die erste klinische Studie dieses Formats seit dreißig Jahren durch. Sie betrifft urologische und nephrologische Diagnosen, nicht die auf dieser Seite beschriebene: Mehr als hundert Patienten werden vor und nach dem Kuraufenthalt auf Gesundheitszustand und Lebensqualität untersucht, fachlicher Garant ist prim. MUDr. Ladislav Špišák, CSc.; Ergebnisse liegen noch nicht vor. Die Studie läuft im Projekt Zentrum für Kurforschung (2024 bis 2027), das aus dem Operationellen Programm Gerechter Übergang finanziert wird und mit der Tschechischen Technischen Universität, der Westböhmischen Universität und der Akademie der Wissenschaften der Tschechischen Republik zusammenarbeitet. Was dabei herauskommen kann, zeigt die frühere Zusammenarbeit desselben Instituts mit den Marienbader Kurhäusern: Die gemeinsame Studie zur Kurrehabilitation nach COVID-19 erhielt 2021 den Innovation Award der European Spas Association in der Kategorie Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Wofür ist Marienbad als Kurort bekannt?',
            answer: 'Marienbad ist historisch vor allem für seine Wirkung auf Verdauung und Stoffwechsel bekannt. Über vierzig kalte Mineralquellen treten im Stadtgebiet zutage; der sulfat-hydrogenkarbonat-natriumhaltige Kreuzbrunnen mit einer Gesamtmineralisation von 9 845 mg/l gilt als das Aushängeschild für Verdauungsindikationen.',
          },
          {
            question: 'Welche Kur hilft bei Verdauungsbeschwerden?',
            answer: 'Die tschechische Indikationsliste führt Verdauungserkrankungen als eigene Gruppe III, unter anderem chronische Magen-Darm-Beschwerden (III/1), Crohnsche Krankheit und Colitis ulcerosa (III/3) sowie chronische Gallenblasen- und Gallenwegsleiden (III/4). Die Behandlung kombiniert eine ärztlich verordnete Trinkkur mit einem individuellen Diätprogramm.',
          },
          {
            question: 'Wie wirkt der Kreuzbrunnen auf die Verdauung?',
            answer: 'Der Kreuzbrunnen enthält 3 130 mg/l Sulfat und 2 700 mg/l Natrium — die Verbindung, die umgangssprachlich Glaubersalz heißt und mild abführend wirkt. In einer kontrollierten Studie mit einem vergleichbaren Sulfat-Hydrogencarbonat-Wasser verkleinerte sich nach zwölf Tagen das Nüchternvolumen der Gallenblase, bei häufigerem Stuhlgang. Menge und Zeitpunkt legt stets der Kurarzt fest.',
          },
          {
            question: 'Wie lange dauert eine Kur bei Verdauungsbeschwerden?',
            answer: 'Nach der Indikationsliste sind es je nach Diagnose meist 21 Tage, bei Wiederholungsaufenthalten teils 14 Tage Zuschuss-Kurbehandlung. Selbstzahler wählen meist zwei bis drei Wochen — kürzere Aufenthalte wirken eher rekonvaleszent.',
          },
          {
            question: 'Kann ich mit einer Gallenblasenerkrankung zur Kur kommen?',
            answer: 'Ja, chronische Erkrankungen von Gallenblase und Gallentrakt sind eine eigene Position der Indikationsliste (III/4). Voraussetzung ist ein aktueller gastroenterologischer Befund; die Eignung beurteilt der Kurarzt bei der Eingangsuntersuchung.',
          },
        ],
        sources: [
          {
            title: 'Klinische Studie zu den objektiven Wirkungen der komplexen Kurbehandlung bei urologischen und nephrologischen Diagnosen (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Laufende Studie des Instituts lázeňství a balneologie mit den Léčebné lázně Mariánské Lázně, mehr als hundert Patienten, Beginn 2026. Sie betrifft urologische und nephrologische Diagnosen; Ergebnisse liegen noch nicht vor.',
          },
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe III — Krankheiten des Verdauungssystems',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Positionen III/1, III/3, III/4 und III/8 mit Versorgungsart und Dauer (K oder P 21 Tage, je nach Diagnose).',
          },
          {
            title: 'Offizielles Tourismusportal der Stadt Mariánské Lázně — Kreuzbrunnen (Křížový pramen)',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/krizovy-pramen/',
            note: 'Wasseranalyse (Mineralisation 9 845 mg/l, Sulfat 3 130 mg/l, Natrium 2 700 mg/l, freies CO₂ 2 305 mg/l); Öffnungszeit des Pavillons 6–18 Uhr.',
          },
          {
            title: 'Antonelli M et al. 2021, Int J Biometeorol — Übersicht über 49 systematische Reviews zur Kurmedizin',
            url: 'https://doi.org/10.1007/s00484-021-02133-w',
            note: 'Am besten belegter Nutzen bei ausgewählten muskuloskelettalen Beschwerden; für Inhalations- und Trinkkuren Belege „begrenzter, wenn auch interessant".',
          },
          {
            title: 'Dupont C et al. 2019, Nutrition — doppelblinde randomisierte Studie, 226 Patienten mit funktioneller Obstipation',
            url: 'https://doi.org/10.1016/j.nut.2019.02.018',
            note: 'Sulfat-Magnesium-Wasser: Ansprechen nach 14 Tagen bei 50 % vs. 29 % unter Kontrollwasser. Vom Hersteller finanziert; französisches Wasser anderer Zusammensetzung.',
          },
          {
            title: 'Bothe G et al. 2015, Eur J Nutr — doppelblinde placebokontrollierte randomisierte Studie, 106 Teilnehmer mit funktioneller Obstipation',
            url: 'https://doi.org/10.1007/s00394-015-1094-8',
            note: '500 ml Sulfatwasser täglich über 6 Wochen erhöhte spontane Stuhlgänge und verbesserte die Konsistenz. Primärer Endpunkt nur grenzwertig signifikant.',
          },
          {
            title: 'Dimidi E et al. 2025, J Hum Nutr Diet — britische diätetische Leitlinie (GRADE) zur chronischen Obstipation',
            url: 'https://doi.org/10.1111/jhn.70133',
            note: 'Wasser mit höherem Mineralgehalt unter den Optionen bei chronischer Obstipation genannt. Evidenzsicherheit niedrig bis mittel.',
          },
          {
            title: 'Corradini SG et al. 2012, World J Gastroenterol — kontrollierte Studie, 40 Teilnehmer',
            url: 'https://consensus.app/papers/details/11a1a41b579854e591a67d137a568bda/',
            note: '12 Tage Sulfat-Hydrogencarbonat-Wasser: kleineres Nüchternvolumen der Gallenblase, häufigerer Stuhlgang. Kleine Stichprobe, italienisches Wasser anderer Zusammensetzung.',
          },
        ],
        related: [
          {
            label: 'Kur bei Erkrankungen des Verdauungstrakts',
            href: '/de/magazin/kur-verdauung-marienbad',
          },
          {
            label: 'Trinkkur-Ratgeber',
            href: '/de/magazin/trinkkur-ratgeber',
          },
          {
            label: 'Kreuzbrunnen im Porträt',
            href: '/de/quellen-uebersicht/krizovy',
          },
        ],
      },
      en: {
        slug: 'digestive-conditions',
        navLabel: 'Digestive conditions',
        title: 'Spa treatment for digestive conditions in Marienbad',
        h1: 'Spa treatment for digestive conditions',
        metaTitle: 'Spa treatment for digestive conditions Marienbad | Marienbad.com',
        metaDescription:
          'Spa treatment for digestive conditions in Marienbad: the drinking cure from the Cross Spring and a diet programme — what is treated and how long a stay lasts.',
        lead:
          'Marienbad became famous for a water known for its effect on digestion even before the town’s first spa hotel existed. Treatment for digestive conditions draws on the drinking cure from sulphate-rich springs such as the Cross Spring, an individual diet programme and medical supervision over several weeks.',
        teaser: 'Chronic stomach and bowel complaints, gallbladder disease and chronic pancreatitis: drinking cure from the Cross Spring, diet programme and daily medical supervision.',
        treats: [
          'Chronic and recurrent diseases of the stomach and bowel with persistent complaints despite standard therapy (position III/1)',
          'Crohn’s disease and ulcerative colitis (III/3)',
          'Chronic disease of the gallbladder and biliary tract with gallstone disease, and functional disorders of the biliary tract (III/4)',
          'Confirmed chronic pancreatitis and conditions after acute pancreatitis (III/8)',
          'Conditions after operations on the stomach, duodenum or bowel with post-operative symptoms confirmed by endoscopy',
        ],
        notFor: [
          'Acute gastrointestinal disease, acute infections, or an active worsening without prior specialist assessment',
          'Missing endoscopic or gastroenterological findings to confirm the diagnosis, especially for post-operative conditions',
          'Acute infectious disease, active cancer with signs of progression, marked cachexia',
          'Pregnancy, or an inability to manage personal care without a companion',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: 'The spa physician reviews gastroenterological findings — and endoscopy reports for post-operative conditions — and sets the spring, amount and timing of the drinking cure individually. Bring recent findings; without them no firm plan can be made.',
          },
          {
            heading: 'Drinking cure and treatments in the morning',
            body: 'The day begins before breakfast at the spring with the cup and a slow walk; mineral baths, dry carbon dioxide baths or circulation-boosting procedures follow as prescribed. Rest lying down follows every treatment.',
          },
          {
            heading: 'Diet and movement in the afternoon',
            body: 'The spa kitchen cooks to the prescribed diet system; the afternoon belongs to light movement, usually walking in the spa forests, which supports digestion.',
          },
          {
            heading: 'Weekly check-up and final report',
            body: 'Once a week the physician adjusts the drinking plan and diet. At the end you receive a report for your own doctor and recommendations for eating at home.',
          },
        ],
        procedures: [
          {
            name: 'Drinking cure from the Cross Spring',
            detail: 'Sulphate-bicarbonate-sodium water with a mild laxative effect; amount, temperature and timing before meals are set individually by the physician.',
          },
          {
            name: 'Drinking cure from the Ferdinand Spring',
            detail: 'Close in composition to the Cross Spring, used for the same digestive and metabolic indications.',
          },
          {
            name: 'Spa-kitchen diet programme',
            detail: 'An individually assembled meal plan by diagnosis, for example gallstone disease or after stomach surgery.',
          },
          {
            name: 'Dry carbon dioxide bath',
            detail: 'From the local Maria’s gas at 99.7% CO₂; supports relaxation and circulation as part of the daily plan.',
          },
          {
            name: 'Physical therapy',
            detail: 'Electrotherapy or magnetic field therapy, prescribed as a supplement to the drinking cure and diet for some diagnoses.',
          },
          {
            name: 'Walking',
            detail: 'Slow walking between sips at the spring and in the afternoon supports transit and is the recommended light activity for digestive diagnoses.',
          },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'The length depends on the position of the indication list: for chronic stomach and bowel disease (III/1), 21 days of contributory spa care; for Crohn’s disease and ulcerative colitis (III/3), 21 days of comprehensive or contributory spa care; for chronic gallbladder and biliary tract disease (III/4), 21 days of contributory spa care; and for chronic pancreatitis (III/8), 21 days of comprehensive or contributory spa care — all covered by Czech public health insurance. Self-paying guests usually choose two to three weeks in consultation with the spa physician. Late summer and autumn are considered favourable, because holiday travel and irregular meals have usually made themselves felt by then, and the town is quieter after the main season.',
        },
        evidence: {
          heading: 'What the studies show',
          body: 'For sulphate- and magnesium-rich mineral water in functional constipation, there is a double-blind randomised trial of 226 participants: after 14 days, 50% responded to treatment compared with 29% under control water; this was a French water of different composition (Dupont et al., 2019, Nutrition). A placebo-controlled trial of 106 participants found, after six weeks of half a litre of sulphate water daily, more spontaneous bowel movements and better consistency, with the primary endpoint only marginally significant (Bothe et al., 2015, Eur J Nutr). A 2025 British dietetic guideline therefore names water with a higher mineral content as one option for chronic constipation, with low to moderate certainty of evidence (Dimidi et al., 2025, J Hum Nutr Diet). Data on the gallbladder are sparser: in a controlled study of 40 participants, the fasting volume of the gallbladder shrank after twelve days of drinking a sulphate-bicarbonate water, alongside more frequent bowel movements; this was an Italian water of different composition and a small sample (Corradini et al., 2012, World J Gastroenterol). For Crohn’s disease, ulcerative colitis and chronic pancreatitis there are no comparable controlled studies of the drinking cure; treatment here rests on the experience of spa medicine and close medical supervision.',
        },
        physicianNote: 'Whether and in what form a spa cure is right for you is decided by the spa physician at the initial examination, based on your gastroenterological findings. This page provides information and does not replace medical advice.',
        ongoing: {
          heading: 'Experience and research under way',
          body: 'The drinking cure at the Cross Spring for digestive complaints is the oldest reason guests come to Marienbad; to this day the spa physician sets the amount, the spring and the timing individually. How the individual guest fares is not left unchecked: every treatment stay begins with an initial and ends with a final medical examination and a written final report, so the course is documented and the spa physician can adjust the plan along the way. Systematic evidence for spa medicine as a field is being built for the first time in a long while. The Institute of Spa Medicine and Balneology (Institut lázeňství a balneologie, v.v.i.), founded by the Karlovy Vary Region in 2019, has been running the first clinical study of this format in thirty years since 2026, together with Léčebné lázně Mariánské Lázně. It covers urological and nephrological diagnoses rather than the one described on this page: more than a hundred patients are examined before and after the spa stay for health status and quality of life, with prim. MUDr. Ladislav Špišák, CSc. as professional guarantor, and results are not yet available. The study runs within the Spa Research Centre project (2024 to 2027), funded by the Just Transition Operational Programme and working with the Czech Technical University, the University of West Bohemia and the Czech Academy of Sciences. What such work can produce is shown by the same institute’s earlier collaboration with the Marienbad spa houses: their joint study of spa rehabilitation after COVID-19 received the European Spas Association Innovation Award in 2021 in the Medical Spa Scientific Research category.',
        },
        faqs: [
          {
            question: 'What is Marienbad known for as a spa town?',
            answer: 'Marienbad has historically been known above all for its effect on digestion and metabolism. Over forty cold mineral springs rise within the town; the sulphate-bicarbonate-sodium Cross Spring, with a total mineral content of 9,845 mg/l, is the flagship for digestive indications.',
          },
          {
            question: 'Which spa cure helps with digestive complaints?',
            answer: 'The Czech indication list lists digestive diseases as a separate group III, including chronic stomach and bowel complaints (III/1), Crohn’s disease and ulcerative colitis (III/3), and chronic gallbladder and biliary tract disease (III/4). Treatment combines a medically prescribed drinking cure with an individual diet programme.',
          },
          {
            question: 'How does the Cross Spring work on digestion?',
            answer: 'The Cross Spring contains 3,130 mg/l of sulphate and 2,700 mg/l of sodium — the compound colloquially known as Glauber’s salt, which has a mild laxative effect. In a controlled study with a comparable sulphate-bicarbonate water, the fasting volume of the gallbladder shrank after twelve days, alongside more frequent bowel movements. The amount and timing are always set by the spa physician.',
          },
          {
            question: 'How long does a spa cure for digestive complaints last?',
            answer: 'Under the indication list it is usually 21 days depending on diagnosis, with 14 days of contributory spa care sometimes possible on repeat stays. Self-paying guests usually choose two to three weeks — shorter stays tend to work more as convalescence.',
          },
          {
            question: 'Can I come for a spa cure with gallbladder disease?',
            answer: 'Yes, chronic disease of the gallbladder and biliary tract is a separate position on the indication list (III/4). The requirement is a recent gastroenterological finding; suitability is assessed by the spa physician at the initial examination.',
          },
        ],
        sources: [
          {
            title: 'Clinical study of the objective effects of comprehensive spa care in kidney and urological conditions (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Ongoing study by the Institute of Spa Medicine and Balneology with Léčebné lázně Mariánské Lázně, more than a hundred patients, started 2026. It covers urological and nephrological diagnoses; results are not yet available.',
          },
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group III — diseases of the digestive system',
            url: '/en/indications-and-contraindications',
            note: 'Positions III/1, III/3, III/4 and III/8, with type of care and length (K or P 21 days, depending on diagnosis).',
          },
          {
            title: 'Official tourism portal of the town of Mariánské Lázně — Cross Spring (Křížový pramen)',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/krizovy-pramen/',
            note: 'Water analysis (mineral content 9,845 mg/l, sulphate 3,130 mg/l, sodium 2,700 mg/l, free CO₂ 2,305 mg/l); pavilion opening hours 6am–6pm.',
          },
          {
            title: 'Antonelli M et al. 2021, Int J Biometeorol — review of 49 systematic reviews on spa medicine',
            url: 'https://doi.org/10.1007/s00484-021-02133-w',
            note: 'Best-supported benefit for selected musculoskeletal complaints; for inhalation and drinking cures, evidence "limited, though interesting".',
          },
          {
            title: 'Dupont C et al. 2019, Nutrition — double-blind randomised trial, 226 patients with functional constipation',
            url: 'https://doi.org/10.1016/j.nut.2019.02.018',
            note: 'Sulphate-magnesium water: response after 14 days in 50% vs. 29% under control water. Manufacturer-funded; French water of different composition.',
          },
          {
            title: 'Bothe G et al. 2015, Eur J Nutr — double-blind placebo-controlled randomised trial, 106 participants with functional constipation',
            url: 'https://doi.org/10.1007/s00394-015-1094-8',
            note: '500 ml of sulphate water daily over 6 weeks increased spontaneous bowel movements and improved consistency. Primary endpoint only marginally significant.',
          },
          {
            title: 'Dimidi E et al. 2025, J Hum Nutr Diet — British dietetic guideline (GRADE) on chronic constipation',
            url: 'https://doi.org/10.1111/jhn.70133',
            note: 'Water with higher mineral content listed among the options for chronic constipation. Certainty of evidence low to moderate.',
          },
          {
            title: 'Corradini SG et al. 2012, World J Gastroenterol — controlled study, 40 participants',
            url: 'https://consensus.app/papers/details/11a1a41b579854e591a67d137a568bda/',
            note: '12 days of sulphate-bicarbonate water: smaller fasting gallbladder volume, more frequent bowel movements. Small sample, Italian water of different composition.',
          },
        ],
        related: [
          {
            label: 'Spa treatment for digestive disorders',
            href: '/en/magazine/digestive-disorders-spa-treatment',
          },
          {
            label: 'Drinking cure guide',
            href: '/en/magazine/drinking-cure-guide',
          },
          {
            label: 'The Cross Spring in profile',
            href: '/en/springs-overview/krizovy',
          },
        ],
      },
      cs: {
        slug: 'travici-potize',
        navLabel: 'Trávicí potíže',
        title: 'Lázeňská léčba trávicích potíží v Mariánských Lázních',
        h1: 'Lázeňská léčba trávicích potíží',
        metaTitle: 'Léčba trávicích potíží v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Lázeňská léčba trávicích potíží v Mariánských Lázních: pitná kúra z Křížového pramene, dietní program a indikační seznam — co se léčí a jak dlouho pobyt trvá.',
        lead: 'Mariánské Lázně proslavila voda, jejíž účinek na trávení byl známý už dřív než první lázeňský hotel. Léčba trávicích potíží se opírá o pitnou kúru ze sulfátových pramenů, jako je Křížový pramen, individuální dietní program a lékařské doprovázení po dobu několika týdnů.',
        teaser: 'Chronické potíže žaludku a střev, onemocnění žlučníku a chronická pankreatitida: pitná kúra z Křížového pramene, dietní program a denní lékařské doprovázení.',
        treats: [
          'Chronická a opakující se onemocnění žaludku a střev s přetrvávajícími potížemi navzdory standardní léčbě (položka III/1)',
          'Crohnova nemoc a ulcerózní kolitida (III/3)',
          'Chronická onemocnění žlučníku a žlučových cest se žlučovými kameny a funkční poruchy žlučových cest (III/4)',
          'Prokázaná chronická pankreatitida a stavy po akutní pankreatitidě (III/8)',
          'Stavy po operacích žaludku, dvanáctníku nebo střev s endoskopicky potvrzenou pooperační symptomatikou',
        ],
        notFor: [
          'Akutní onemocnění žaludku a střev, akutní infekce nebo aktivní zhoršení bez předchozího odborného vyšetření',
          'Chybějící endoskopické nebo gastroenterologické nálezy k potvrzení diagnózy, zejména u pooperačních stavů',
          'Akutní infekční onemocnění, aktivní nádorové onemocnění se známkami progrese, výrazná kachexie',
          'Těhotenství a neschopnost sebeobsluhy bez doprovodu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde gastroenterologické nálezy, u pooperačních stavů i endoskopické zprávy, a individuálně stanoví pramen, množství a čas pitné kúry. Vezměte si aktuální nálezy — bez nich nemůže vzniknout závazný plán.',
          },
          {
            heading: 'Pitná kúra a procedury dopoledne',
            body: 'Den začíná před snídaní u pramene s pohárkem a pomalou chůzí; následují minerální koupele, suché uhličité koupele nebo procedury podporující prokrvení podle ordinace. Po každé proceduře následuje klid vleže.',
          },
          {
            heading: 'Dieta a pohyb odpoledne',
            body: 'Lázeňská kuchyně vaří podle předepsaného dietního systému; odpoledne patří lehkému pohybu, nejčastěji chůzi v lázeňských lesích, která trávení podporuje.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Jednou týdně lékař upraví pitný plán a dietu. Na závěr dostanete zprávu pro svého ošetřujícího lékaře a doporučení pro stravu doma.',
          },
        ],
        procedures: [
          {
            name: 'Pitná kúra z Křížového pramene',
            detail: 'Voda se síranem, hydrogenuhličitanem a sodíkem s mírně projímavým účinkem; množství, teplotu a čas před jídlem stanoví lékař individuálně.',
          },
          {
            name: 'Pitná kúra z Ferdinandova pramene',
            detail: 'Blízké složení Křížovému prameni, používané u metabolických a trávicích indikací.',
          },
          {
            name: 'Dietní program lázeňské kuchyně',
            detail: 'Individuálně sestavený jídelníček podle diagnózy, například u žlučových kamenů nebo po operaci žaludku.',
          },
          {
            name: 'Suchá uhličitá koupel',
            detail: 'Z místního Mariina plynu s 99,7 % CO₂; podporuje uvolnění a prokrvení jako součást denního plánu.',
          },
          {
            name: 'Fyzikální terapie',
            detail: 'Elektroterapie nebo magnetoterapie, u některých diagnóz doplňkově k pitné kúře a dietě.',
          },
          {
            name: 'Pohyb chůzí',
            detail: 'Pomalá chůze mezi doušky i odpoledne podporuje pasáž a je doporučovanou lehkou aktivitou u trávicích diagnóz.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Délka pobytu se řídí konkrétní položkou indikačního seznamu (III/1, III/3, III/4, III/8); přesný rozpis podle diagnózy najdete na stránce Co hradí pojišťovna u trávicího ústrojí. Samoplátci volí obvykle dva až tři týdny po dohodě s lázeňským lékařem. Pozdní léto a podzim se považují za výhodné, protože se do té doby obvykle projeví dopady prázdninových cest a nepravidelného stravování a ve městě bývá po hlavní sezoně klidněji.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'Pro sulfátem a hořčíkem bohatou minerální vodu u funkční zácpy existuje dvojitě zaslepená randomizovaná studie s 226 účastníky: po 14 dnech reagovalo na léčbu 50 % oproti 29 % u kontrolní vody; šlo o francouzskou vodu jiného složení (Dupont a kol., 2019, Nutrition). Placebem kontrolovaná studie se 106 účastníky zjistila po šesti týdnech půl litru sulfátové vody denně více spontánních stolic a lepší konzistenci, při jen hraničně významném primárním cíli (Bothe a kol., 2015, Eur J Nutr). Britské dietetické doporučení z roku 2025 proto uvádí vodu s vyšším obsahem minerálů jako jednu z možností u chronické zácpy, s nízkou až střední jistotou evidence (Dimidi a kol., 2025, J Hum Nutr Diet). K žlučníku je podkladů méně: v kontrolované studii se 40 účastníky se po dvanácti dnech pití síran-hydrogenuhličitanové vody zmenšil nalačno objem žlučníku, při častější stolici; šlo o italskou vodu jiného složení a malý vzorek (Corradini a kol., 2012, World J Gastroenterol). Ke Crohnově nemoci, ulcerózní kolitidě a chronické pankreatitidě srovnatelné kontrolované studie k pitné kúře nejsou k dispozici; léčba se zde opírá o zkušenost lázeňské medicíny a úzké lékařské doprovázení.',
        },
        physicianNote: 'O tom, zda a v jaké formě pro vás lázeňská léčba připadá v úvahu, rozhoduje lázeňský lékař při vstupní prohlídce podle vašich gastroenterologických nálezů. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        ongoing: {
          heading: 'Zkušenost a probíhající výzkum',
          body: 'Pitná kúra u Křížového pramene při trávicích potížích je nejstarší důvod, proč hosté do Mariánských Lázní jezdí; množství, pramen i načasování dodnes určuje lázeňský lékař jednotlivě. Jak na tom jednotlivý host je, se nenechává bez kontroly: každý léčebný pobyt začíná vstupní a končí výstupní lékařskou prohlídkou a závěrečnou zprávou, takže je průběh doložený a lázeňský lékař může plán během pobytu upravit. Pro lázeňskou medicínu jako obor vzniká poprvé po dlouhé době systematická evidence. Institut lázeňství a balneologie, v.v.i., který Karlovarský kraj založil v roce 2019, vede od roku 2026 spolu s Léčebnými lázněmi Mariánské Lázně první klinickou studii tohoto formátu po třiceti letech. Týká se urologických a nefrologických diagnóz, ne té popsané na této stránce: více než sto pacientů se vyšetřuje před lázeňskou léčbou a po ní na ukazatele zdravotního stavu a kvality života, odborným garantem je prim. MUDr. Ladislav Špišák, CSc., a výsledky zatím nejsou k dispozici. Studie běží v projektu Centrum lázeňského výzkumu (2024 až 2027), financovaném z Operačního programu Spravedlivá transformace a spolupracujícím s ČVUT, Západočeskou univerzitou a Akademií věd ČR. Co z takové práce může vzejít, ukazuje dřívější spolupráce téhož institutu s mariánskolázeňskými lázeňskými domy: jejich společná studie lázeňské rehabilitace po covidu-19 získala v roce 2021 Innovation Award Evropského svazu lázní v kategorii Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Co léčí Mariánské Lázně u trávení?',
            answer: 'Mariánské Lázně jsou historicky proslulé především účinkem na trávení a metabolismus. Ve městě vyvěrá přes čtyřicet studených minerálních pramenů; síran-hydrogenuhličitan-sodný Křížový pramen s celkovou mineralizací 9 845 mg/l platí za vlajkovou loď pro trávicí indikace.',
          },
          {
            question: 'Která lázeňská léčba pomáhá při trávicích potížích?',
            answer: 'Indikační seznam vede onemocnění trávicího ústrojí jako samostatnou skupinu III, mimo jiné chronické potíže žaludku a střev (III/1), Crohnovu nemoc a ulcerózní kolitidu (III/3) i chronická onemocnění žlučníku a žlučových cest (III/4). Léčba kombinuje lékařem předepsanou pitnou kúru s individuálním dietním programem.',
          },
          {
            question: 'Jak působí Křížový pramen na trávení?',
            answer: 'Křížový pramen obsahuje 3 130 mg/l síranu a 2 700 mg/l sodíku — sloučeninu, které se lidově říká Glauberova sůl a která mírně projímá. V kontrolované studii se srovnatelnou síran-hydrogenuhličitanovou vodou se po dvanácti dnech zmenšil nalačno objem žlučníku, při častější stolici. Množství a čas vždy určuje lázeňský lékař.',
          },
          {
            question: 'Jak dlouho trvá lázeňský pobyt při trávicích potížích?',
            answer: 'Podle indikačního seznamu jde nejčastěji o dva až tři týdny podle konkrétní diagnózy; přesný rozpis najdete na stránce Co hradí pojišťovna u trávicího ústrojí. Samoplátci volí obvykle dva až tři týdny — kratší pobyty působí spíše rekonvalescenčně.',
          },
          {
            question: 'Mohu jet do lázní s onemocněním žlučníku?',
            answer: 'Ano, chronická onemocnění žlučníku a žlučových cest jsou samostatnou položkou indikačního seznamu (III/4). Podmínkou je aktuální gastroenterologický nález; vhodnost posoudí lázeňský lékař při vstupní prohlídce.',
          },
        ],
        sources: [
          {
            title: 'Klinická studie objektivních účinků komplexní lázeňské péče u urologických a nefrologických diagnóz (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Probíhající studie Institutu lázeňství a balneologie s Léčebnými lázněmi Mariánské Lázně, více než sto pacientů, zahájena 2026. Týká se urologických a nefrologických diagnóz; výsledky zatím nejsou k dispozici.',
          },
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina III — nemoci trávicího ústrojí',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Položky III/1, III/3, III/4 a III/8 s typem péče a délkou podle diagnózy.',
          },
          {
            title: 'Oficiální turistický portál města Mariánské Lázně — Křížový pramen',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/krizovy-pramen/',
            note: 'Rozbor vody (mineralizace 9 845 mg/l, síran 3 130 mg/l, sodík 2 700 mg/l, volný CO₂ 2 305 mg/l); otevírací doba pavilonu 6–18 hodin.',
          },
          {
            title: 'Antonelli M a kol. 2021, Int J Biometeorol — přehled 49 systematických recenzí lázeňské medicíny',
            url: 'https://doi.org/10.1007/s00484-021-02133-w',
            note: 'Nejlépe doložený přínos u vybraných potíží pohybového aparátu; pro pitné a inhalační kúry evidence „omezenější, byť zajímavá".',
          },
          {
            title: 'Dupont C a kol. 2019, Nutrition — dvojitě zaslepená randomizovaná studie, 226 pacientů s funkční zácpou',
            url: 'https://doi.org/10.1016/j.nut.2019.02.018',
            note: 'Síran-hořčíková voda: odezva po 14 dnech u 50 % vs. 29 % u kontrolní vody. Financováno výrobcem; francouzská voda jiného složení.',
          },
          {
            title: 'Bothe G a kol. 2015, Eur J Nutr — dvojitě zaslepená placebem kontrolovaná randomizovaná studie, 106 účastníků s funkční zácpou',
            url: 'https://doi.org/10.1007/s00394-015-1094-8',
            note: '500 ml sulfátové vody denně po 6 týdnů zvýšilo počet spontánních stolic a zlepšilo konzistenci. Primární cíl jen hraničně významný.',
          },
          {
            title: 'Dimidi E a kol. 2025, J Hum Nutr Diet — britské dietetické doporučení (GRADE) k chronické zácpě',
            url: 'https://doi.org/10.1111/jhn.70133',
            note: 'Voda s vyšším obsahem minerálů uvedena mezi možnostmi u chronické zácpy. Jistota evidence nízká až střední.',
          },
          {
            title: 'Corradini SG a kol. 2012, World J Gastroenterol — kontrolovaná studie, 40 účastníků',
            url: 'https://consensus.app/papers/details/11a1a41b579854e591a67d137a568bda/',
            note: '12 dní síran-hydrogenuhličitanové vody: menší objem žlučníku nalačno, častější stolice. Malý vzorek, italská voda jiného složení.',
          },
        ],
        related: [
          {
            label: 'Když trávení nefunguje — lázeňská léčba trávicího ústrojí',
            href: '/cs/magazin/lazenska-lecba-traviciho-ustroji',
          },
          {
            label: 'Průvodce pitnou kúrou',
            href: '/cs/magazin/pitna-kura-pruvodce',
          },
          {
            label: 'Křížový pramen v profilu',
            href: '/cs/prehled-pramenu/krizovy',
          },
          {
            label: 'Co hradí pojišťovna u trávicího ústrojí',
            href: '/cs/lazne-s-pojistovnou/indikace/travici-ustroji',
          },
        ],
      },
      ru: {
        slug: 'pishchevarenie',
        navLabel: 'Пищеварение',
        title: 'Курортное лечение заболеваний пищеварения в Марианских Лазнях',
        h1: 'Курортное лечение заболеваний пищеварения',
        metaTitle: 'Лечение пищеварения — Марианские Лазни | Marienbad.com',
        metaDescription: 'Курортное лечение пищеварения в Марианских Лазнях: питьевой курс из Крестового источника, диета и индикационный список — что лечат и сколько длится.',
        lead: 'Марианские Лазни прославились водой, известной своим действием на пищеварение ещё до появления первого курортного отеля. Лечение заболеваний пищеварения опирается на питьевой курс из сульфатных источников, таких как Крестовый источник, индивидуальную диетическую программу и врачебное сопровождение на протяжении нескольких недель.',
        teaser: 'Хронические заболевания желудочно-кишечного тракта, заболевания жёлчного пузыря и хронический панкреатит: питьевой курс из Крестового источника, диетическая программа и ежедневное врачебное сопровождение.',
        treats: [
          'Хронические и рецидивирующие заболевания желудка и кишечника с сохраняющимися жалобами несмотря на стандартную терапию (позиция III/1)',
          'Болезнь Крона и язвенный колит (III/3)',
          'Хронические заболевания жёлчного пузыря и жёлчных путей с камнеобразованием, а также функциональные нарушения жёлчных путей (III/4)',
          'Подтверждённый хронический панкреатит, а также состояния после острого панкреатита (III/8)',
          'Состояния после операций на желудке, двенадцатиперстной кишке или кишечнике с эндоскопически подтверждённой послеоперационной симптоматикой',
        ],
        notFor: [
          'Острые заболевания желудочно-кишечного тракта, острые инфекции или активное обострение без предварительного обследования профильным врачом',
          'Отсутствие эндоскопических или гастроэнтерологических заключений для подтверждения диагноза, прежде всего при послеоперационных состояниях',
          'Острые инфекционные заболевания, активное онкологическое заболевание с признаками прогрессирования, выраженная кахексия',
          'Беременность, а также неспособность к самообслуживанию без сопровождающего лица',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает гастроэнтерологические заключения, при послеоперационных состояниях — также эндоскопические заключения, и индивидуально определяет источник, объём и время питьевого курса. Возьмите с собой актуальные заключения — без них надёжный план составить невозможно.',
          },
          {
            heading: 'Питьевой курс и процедуры в первой половине дня',
            body: 'День начинается до завтрака у источника с бокальчиком и неспешной ходьбой; затем следуют минеральные ванны, сухие углекислые ванны или процедуры для улучшения кровообращения по назначению. После каждой процедуры следует отдых лёжа.',
          },
          {
            heading: 'Диета и движение во второй половине дня',
            body: 'Курортная кухня готовит по назначенной диетической системе; вторая половина дня отведена лёгкому движению, чаще всего прогулкам в курортных лесах, которые поддерживают пищеварение.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Раз в неделю врач корректирует план питья и диету. По окончании вы получаете заключение для вашего лечащего врача и рекомендации по питанию на дом.',
          },
        ],
        procedures: [
          {
            name: 'Питьевой курс из Крестового источника',
            detail: 'Сульфатно-гидрокарбонатно-натриевая вода с мягким послабляющим действием; количество, температуру и время приёма перед едой индивидуально определяет врач.',
          },
          {
            name: 'Питьевой курс из источника Фердинанда',
            detail: 'Близок по составу к Крестовому источнику, применяется при показаниях со стороны обмена веществ и пищеварения.',
          },
          {
            name: 'Диетическая программа курортной кухни',
            detail: 'Индивидуально составленный план питания по диагнозу, например при желчнокаменной болезни или после операции на желудке.',
          },
          {
            name: 'Сухая углекислая ванна',
            detail: 'Из местного марианского газа с содержанием CO₂ 99,7 %; поддерживает расслабление и кровообращение как часть распорядка дня.',
          },
          {
            name: 'Физиотерапия',
            detail: 'Электро- или магнитотерапия, при некоторых диагнозах назначается дополнительно к питьевому курсу и диете.',
          },
          {
            name: 'Движение ходьбой',
            detail: 'Неспешная ходьба между глотками воды и во второй половине дня поддерживает пассаж и является рекомендуемой лёгкой активностью при заболеваниях пищеварения.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'Длительность зависит от позиции индикационного списка: при хронических заболеваниях желудочно-кишечного тракта (III/1) для пребываний, оплачиваемых чешской страховой, предусмотрено 21 день долевого курортного лечения, при болезни Крона и язвенном колите (III/3) — 21 день комплексного или долевого лечения, при хронических заболеваниях жёлчного пузыря и жёлчных путей (III/4) — 21 день долевого лечения, при хроническом панкреатите (III/8) — 21 день комплексного или долевого лечения. Гости, оплачивающие лечение самостоятельно, обычно выбирают две-три недели по согласованию с курортным врачом. Конец лета и осень считаются благоприятным временем, потому что к этому моменту обычно уже дают о себе знать отпускные поездки и нерегулярное питание, а город после высокого сезона спокойнее.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'По сульфатной и магниевой минеральной воде при функциональном запоре есть двойное слепое рандомизированное исследование с 226 участниками: через 14 дней ответили на лечение 50 % против 29 % на контрольной воде; речь шла о французской воде другого состава (Dupont et al., 2019, Nutrition). Плацебо-контролируемое исследование со 106 участниками обнаружило после шести недель приёма половины литра сульфатной воды в день больше самостоятельных дефекаций и лучшую консистенцию стула, при лишь пограничной значимости первичной конечной точки (Bothe et al., 2015, Eur J Nutr). Британское диетическое клиническое руководство 2025 года поэтому называет воду с более высоким содержанием минералов одним из вариантов при хроническом запоре, с низкой или средней достоверностью доказательств (Dimidi et al., 2025, J Hum Nutr Diet). По жёлчному пузырю данных меньше: в контролируемом исследовании с 40 участниками после двенадцати дней приёма сульфатно-гидрокарбонатной воды натощаковый объём жёлчного пузыря уменьшился, при более частом стуле; это была итальянская вода другого состава и небольшая выборка (Corradini et al., 2012, World J Gastroenterol). По болезни Крона, язвенному колиту и хроническому панкреатиту сопоставимых контролируемых исследований питьевого курса нет; лечение здесь опирается на опыт курортной медицины и тесное врачебное сопровождение.',
        },
        physicianNote: 'Показано ли вам курортное лечение и в какой форме, решает курортный врач при первичном осмотре на основании ваших гастроэнтерологических заключений. Эта страница носит информационный характер и не заменяет консультацию врача.',
        ongoing: {
          heading: 'Опыт и текущие исследования',
          body: 'Питьевое лечение у Крестового источника при расстройствах пищеварения — самая давняя причина, по которой гости приезжают в Марианские Лазни; количество, источник и время приёма по сей день курортный врач определяет индивидуально. Как идут дела у конкретного гостя, не остаётся без проверки: каждое лечебное пребывание начинается с первичного и заканчивается выходным врачебным осмотром и письменным заключением, поэтому течение задокументировано, а курортный врач может по ходу скорректировать план. Для курортной медицины как отрасли впервые за долгое время создаётся систематическая доказательная база. Институт курортного дела и бальнеологии (Institut lázeňství a balneologie, v.v.i.), основанный Карловарским краем в 2019 году, с 2026 года вместе с «Léčebné lázně Mariánské Lázně» проводит первое клиническое исследование такого формата за тридцать лет. Оно касается урологических и нефрологических диагнозов, а не того, который описан на этой странице: более ста пациентов обследуют до курортного лечения и после него по показателям состояния здоровья и качества жизни, научный гарант — prim. MUDr. Ladislav Špišák, CSc., результатов пока нет. Исследование идёт в рамках проекта «Центр курортных исследований» (2024–2027), финансируемого Операционной программой справедливой трансформации, с участием Чешского технического университета, Западночешского университета и Академии наук Чехии. Что даёт такая работа, показывает более раннее сотрудничество того же института с курортными домами Марианских Лазней: их совместное исследование курортной реабилитации после COVID-19 получило в 2021 году Innovation Award Европейского союза курортов в категории Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Чем известны Марианские Лазни как курорт?',
            answer: 'Марианские Лазни исторически известны прежде всего своим действием на пищеварение и обмен веществ. В черте города выходит на поверхность более сорока холодных минеральных источников; сульфатно-гидрокарбонатно-натриевый Крестовый источник с общей минерализацией 9845 мг/л считается визитной карточкой при показаниях со стороны пищеварения.',
          },
          {
            question: 'Какое курортное лечение помогает при заболеваниях пищеварения?',
            answer: 'Чешский индикационный список выделяет заболевания пищеварения как отдельную группу III, в том числе хронические заболевания желудочно-кишечного тракта (III/1), болезнь Крона и язвенный колит (III/3), а также хронические заболевания жёлчного пузыря и жёлчных путей (III/4). Лечение сочетает назначенный врачом питьевой курс с индивидуальной диетической программой.',
          },
          {
            question: 'Как Крестовый источник действует на пищеварение?',
            answer: 'Крестовый источник содержит 3130 мг/л сульфата и 2700 мг/л натрия — соединение, известное в быту как глауберова соль, обладающее мягким послабляющим действием. В контролируемом исследовании со сходной сульфатно-гидрокарбонатной водой натощаковый объём жёлчного пузыря через двенадцать дней уменьшился, при более частом стуле. Количество и время приёма всегда определяет курортный врач.',
          },
          {
            question: 'Сколько длится курортное лечение при заболеваниях пищеварения?',
            answer: 'По индикационному списку в зависимости от диагноза это обычно 21 день, при повторных пребываниях иногда 14 дней долевого курортного лечения. Гости, оплачивающие лечение самостоятельно, обычно выбирают две-три недели — более короткие пребывания действуют скорее восстанавливающе.',
          },
          {
            question: 'Можно ли приехать на лечение с заболеванием жёлчного пузыря?',
            answer: 'Да, хронические заболевания жёлчного пузыря и жёлчных путей — отдельная позиция индикационного списка (III/4). Условие — актуальное гастроэнтерологическое заключение; пригодность оценивает курортный врач при первичном осмотре.',
          },
        ],
        sources: [
          {
            title: 'Клиническое исследование объективных эффектов комплексного курортного лечения при урологических и нефрологических диагнозах (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Продолжающееся исследование Института курортного дела и бальнеологии вместе с «Léčebné lázně Mariánské Lázně», более ста пациентов, начато в 2026 году. Касается урологических и нефрологических диагнозов; результатов пока нет.',
          },
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа III — заболевания пищеварительной системы',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Позиции III/1, III/3, III/4 и III/8 с видом и длительностью лечения (K или P 21 день, в зависимости от диагноза).',
          },
          {
            title: 'Официальный туристический портал города Марианске-Лазне — Крестовый источник (Křížový pramen)',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/krizovy-pramen/',
            note: 'Анализ воды (минерализация 9845 мг/л, сульфат 3130 мг/л, натрий 2700 мг/л, свободный CO₂ 2305 мг/л); время работы павильона 6–18 часов.',
          },
          {
            title: 'Antonelli M et al. 2021, Int J Biometeorol — обзор 49 систематических обзоров по курортной медицине',
            url: 'https://doi.org/10.1007/s00484-021-02133-w',
            note: 'Лучше всего доказана польза при отдельных заболеваниях опорно-двигательного аппарата; для питьевого и ингаляционного лечения доказательства «ограниченные, хотя и интересные».',
          },
          {
            title: 'Dupont C et al. 2019, Nutrition — двойное слепое рандомизированное исследование, 226 пациентов с функциональным запором',
            url: 'https://doi.org/10.1016/j.nut.2019.02.018',
            note: 'Сульфатно-магниевая вода: ответ на лечение через 14 дней у 50 % против 29 % на контрольной воде. Финансировано производителем; французская вода другого состава.',
          },
          {
            title: 'Bothe G et al. 2015, Eur J Nutr — двойное слепое плацебо-контролируемое рандомизированное исследование, 106 участников с функциональным запором',
            url: 'https://doi.org/10.1007/s00394-015-1094-8',
            note: '500 мл сульфатной воды в день в течение 6 недель увеличили число самостоятельных дефекаций и улучшили консистенцию. Первичная конечная точка лишь пограничной значимости.',
          },
          {
            title: 'Dimidi E et al. 2025, J Hum Nutr Diet — британское диетическое клиническое руководство (GRADE) по хроническому запору',
            url: 'https://doi.org/10.1111/jhn.70133',
            note: 'Вода с более высоким содержанием минералов названа среди вариантов при хроническом запоре. Достоверность доказательств от низкой до средней.',
          },
          {
            title: 'Corradini SG et al. 2012, World J Gastroenterol — контролируемое исследование, 40 участников',
            url: 'https://consensus.app/papers/details/11a1a41b579854e591a67d137a568bda/',
            note: '12 дней сульфатно-гидрокарбонатной воды: меньший натощаковый объём жёлчного пузыря, более частый стул. Небольшая выборка, итальянская вода другого состава.',
          },
        ],
        related: [
          {
            label: 'Лечение заболеваний пищеварительного тракта',
            href: '/ru/zhurnal/lechenie-organov-pishchevareniya',
          },
          {
            label: 'Путеводитель по питьевому курсу',
            href: '/ru/zhurnal/pitevoj-kurs-putevoditel',
          },
          {
            label: 'Крестовый источник — портрет',
            href: '/ru/obzor-istochnikov/krizovy',
          },
        ],
      },
    },
  },
  {
    id: 'metabolic',
    groupId: 'metabolic',
    roman: 'IV',
    codes: [
      'IV/1',
    ],
    conditionName: 'Metabolic disorders',
    icd10: 'E11',
    image: '/images/library/treatments/nutrition-consultation-desk.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Ernährungsberaterin bespricht am Schreibtisch einen individuellen Speiseplan mit einer Kurgästin',
      en: 'A nutrition counsellor discusses an individual meal plan with a spa guest at her desk',
      cs: 'Nutriční poradkyně probírá u stolu individuální jídelníček s lázeňskou hostkou',
      ru: 'Диетолог обсуждает за столом индивидуальный план питания с пациенткой курорта',
    },
    content: {
      de: {
        slug: 'stoffwechsel-und-diabetes',
        navLabel: 'Stoffwechsel und Diabetes',
        title: 'Kur bei Stoffwechselstörungen und Diabetes in Marienbad',
        h1: 'Kur bei Stoffwechselstörungen und Diabetes',
        metaTitle: 'Kur bei Diabetes und Stoffwechsel in Marienbad | Marienbad.com',
        metaDescription: 'Kur bei Diabetes und Stoffwechselstörungen in Marienbad: Trinkkur aus dem Kreuzbrunnen, Bewegung und Diätprogramm — erstattete Indikation und Ablauf.',
        lead: 'Diabetes mellitus ist die einzige von der tschechischen Krankenkasse erstattete Indikation der Stoffwechselgruppe; Übergewicht und Gicht werden in Marienbad traditionell mitbehandelt, sind aber keine eigene erstattete Position. Die Kur kombiniert eine ärztlich verordnete Trinkkur aus sulfathaltigen Quellen mit Bewegung und einem Diätprogramm.',
        teaser: 'Diabetes mellitus, Übergewicht und Gicht: Trinkkur aus Kreuzbrunnen und Ferdinandsbrunnen, tägliche Bewegung und Diätprogramm über ein bis drei Wochen.',
        treats: [
          'Diabetes mellitus und dessen Folgekomplikationen (Position IV/1 der Indikationsliste — die einzige erstattete Position dieser Gruppe)',
          'Übergewicht und Adipositas in Verbindung mit Stoffwechselstörungen, traditionell behandelt, jedoch ohne eigene erstattete Position',
          'Gicht, ebenfalls ohne eigene erstattete Position, traditionell im Rahmen der Trinkkur mitbehandelt',
          'Beginnender Typ-2-Diabetes und Verdauungsbeschwerden in Verbindung mit dem Stoffwechsel',
        ],
        notFor: [
          'Instabiler oder dekompensierter Diabetes mellitus (außer bei Kindern und Jugendlichen)',
          'Ausgeprägte Kachexie oder ein Body-Mass-Index unter 16,5',
          'Akute Infektionskrankheiten sowie schwere Herz- oder Niereninsuffizienz ohne fachärztliche Freigabe',
          'Schwangerschaft sowie Unfähigkeit zur Selbstversorgung ohne Begleitperson',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt sichtet Blutzuckerwerte, Medikation und Begleiterkrankungen und legt Trinkkur, Diät und Bewegungspensum individuell fest. Bringen Sie aktuelle Laborwerte und eine Medikamentenliste mit.',
          },
          {
            heading: 'Trinkkur nach ärztlichem Plan',
            body: 'Getrunken wird an der Quelle, langsam und in kleinen Schlucken vor den Mahlzeiten. Bei den Sulfatquellen setzt eine abführende Wirkung bereits bei etwa einem Dreiviertelliter täglich ein — mehr ist kein Vorteil, sondern ein Risiko.',
          },
          {
            heading: 'Bewegung an der Kolonnade und im Kaiserwald',
            body: 'Geführtes Gehen auf dem Promenadennetz, angepasst an Kondition und Diagnose; rund achttausend Schritte täglich gelten als realistisches Wellnessziel, nicht als ärztliche Verordnung.',
          },
          {
            heading: 'Wöchentliche Kontrolle und Abschlussbericht',
            body: 'Einmal wöchentlich prüft der Arzt Blutzucker- und Gewichtsverlauf und passt Trinkkur, Diät und Bewegungspensum an. Zum Abschluss erhalten Sie einen Bericht für Ihren behandelnden Arzt.',
          },
        ],
        procedures: [
          {
            name: 'Trinkkur aus dem Kreuzbrunnen',
            detail: 'Sulfat- und natriumreiches Wasser, traditionell bei Übergewicht, Gicht und Diabetes eingesetzt; Menge und Temperatur legt der Arzt individuell fest.',
          },
          {
            name: 'Trinkkur aus dem Ferdinandsbrunnen',
            detail: 'Der Zusammensetzung des Kreuzbrunnens nah, bei denselben Stoffwechselindikationen eingesetzt.',
          },
          {
            name: 'Diätprogramm der Kurküche',
            detail: 'Individuell auf Diabetes oder Übergewicht abgestimmter Speiseplan, drei Wochen lang von der Kurküche zubereitet.',
          },
          {
            name: 'Geführtes Gehen (Terrainkur)',
            detail: 'Strecken mit festgelegtem Tempo und Höhenprofil auf dem historischen Promenadennetz, angepasst an die Kondition.',
          },
          {
            name: 'Körperzusammensetzungsanalyse',
            detail: 'Erfasst Ausgangswerte für Gewicht und Ernährungsberatung zu Beginn des Aufenthalts.',
          },
          {
            name: 'Bluttests',
            detail: 'Kontrolle von Blutzucker, Cholesterin und weiteren Stoffwechselwerten während des Aufenthalts.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Bei Diabetes mellitus (Position IV/1) trägt die tschechische Krankenkasse einen Grundaufenthalt von 21 Tagen komplexer oder Zuschuss-Kurbehandlung; ein Wiederholungsaufenthalt dauert 21 oder 14 Tage. Selbstzahler wählen meist ein bis drei Wochen nach Absprache mit dem Kurarzt; kürzere Aufenthalte wirken eher regenerativ, die klassische Dreiwochenkur gibt dem Stoffwechsel mehr Zeit zur Umstellung. Für die Jahreszeit gibt es keine medizinische Vorgabe.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body: 'Eine Übersicht über 22 Studien zur Balneotherapie bei Diabetes und Adipositas verbindet Bäder sowie das Trinken sulfat- und hydrogencarbonathaltiger Wässer mit einem Rückgang von Blutzucker und Gewicht, doch nur drei dieser Studien hatten mehr als hundert Teilnehmer (Maeda et al., 2026, Int J Biometeorol). In einer offenen Pilotstudie mit 50 übergewichtigen Männern, darunter 21 mit Typ-2-Diabetes, deutete sich nach drei Wochen Diät kombiniert mit Bädern und Peloiden ein Rückgang von Gewicht, Blutfetten und Blutzucker an; ein Kontrollarm fehlte, sodass sich der Diäteffekt nicht von der Kur trennen lässt (Fioravanti et al., 2015, Int J Biometeorol). Die tragfähigste Stütze betrifft den Rahmen der Kur selbst: In einer französischen randomisierten Studie mit 257 Teilnehmern sank der Body-Mass-Index nach einem dreiwöchigen Kurprogramm binnen eines Jahres um 1,91 Punkte gegenüber 0,20 bei üblicher Versorgung, ausgewertet nur bei Teilnehmern, die das Programm abschlossen (Hanh et al., 2012, Evid Based Complement Alternat Med). In einer kontrollierten, nicht randomisierten Studie mit 340 Patienten hielt den Gewichtsverlust nach elf Monaten nur, wer zur Kur zusätzlich eine Schulung erhalten hatte (Schnebelen-Berthier et al., 2019, Obes Res Clin Pract). Die Trinkkur allein senkte in einer kontrollierten Studie mit 40 Teilnehmern zwar den Stuhlgang häufiger, das Körpergewicht blieb dabei nach zwölf Tagen unverändert; ihr Beitrag liegt also in der Regulierung der Verdauung, nicht im Gewicht selbst (Corradini et al., 2012, World J Gastroenterol).',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer Blutzuckerwerte und Begleiterkrankungen. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        faqs: [
          {
            question: 'Welche Kur hilft bei Diabetes?',
            answer: 'Diabetes mellitus (Position IV/1) ist die einzige von der tschechischen Krankenkasse erstattete Indikation der Stoffwechselgruppe. Die Kur kombiniert eine ärztlich verordnete Trinkkur aus dem Kreuzbrunnen, tägliche Bewegung und ein Diätprogramm; sie ersetzt keine Diabetesmedikation.',
          },
          {
            question: 'Kann man im Kurort abnehmen?',
            answer: 'Adipositas ist keine eigene erstattete Position, wird in Marienbad aber traditionell im Rahmen einer Selbstzahlerkur behandelt. In einer randomisierten Studie mit 257 Teilnehmern sank der Body-Mass-Index nach einem dreiwöchigen Kurprogramm binnen eines Jahres stärker als bei üblicher Versorgung; entscheidend war dabei das gesamte Regime aus Bewegung, Diät und Regelmäßigkeit, nicht eine einzelne Anwendung.',
          },
          {
            question: 'Welche Quelle in Marienbad hilft beim Stoffwechsel?',
            answer: 'Traditionell werden der Kreuzbrunnen und der Ferdinandsbrunnen bei Stoffwechselbeschwerden eingesetzt, beide sulfat- und natriumreich. Der Kreuzbrunnen enthält 3 130 mg/l Sulfat und 2 700 mg/l Natrium; die abführende Wirkung setzt bereits bei etwa einem Dreiviertelliter täglich ein. Menge und Temperatur bestimmt stets der Kurarzt.',
          },
          {
            question: 'Wie lange dauert eine Kur bei Diabetes?',
            answer: 'Bei Diabetes mellitus trägt die tschechische Krankenkasse 21 Tage Grundaufenthalt, ein Wiederholungsaufenthalt dauert 21 oder 14 Tage. Selbstzahler wählen meist ein bis drei Wochen nach Absprache mit dem Kurarzt.',
          },
          {
            question: 'Sind Übergewicht und Gicht eigene Kurindikationen?',
            answer: 'Nein. In der tschechischen Indikationsliste bildet nur Diabetes mellitus (IV/1) eine eigene erstattete Position der Stoffwechselgruppe. Übergewicht und Gicht werden in Marienbad traditionell mitbehandelt, meist im Rahmen einer Selbstzahlerkur oder als Teil der Behandlung von Verdauungs- und Stoffwechseldiagnosen.',
          },
        ],
        sources: [
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe IV — Krankheiten aufgrund von Stoffwechsel- und Hormondrüsenstörungen',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Diabetes mellitus (IV/1) ist die einzige erstattete Position: Grundaufenthalt K 21 / P 21, Wiederholung P 21 (P 14). Adipositas und Gicht sind keine eigene Position.',
          },
          {
            title: 'Offizielles Tourismusportal der Stadt Mariánské Lázně — Kreuzbrunnen (Křížový pramen)',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/krizovy-pramen/',
            note: 'Wasseranalyse (Sulfat 3 130 mg/l, Natrium 2 700 mg/l, Mineralisation 9 845 mg/l); traditionelle Anwendung bei Übergewicht, Gicht und Diabetes.',
          },
          {
            title: 'Maeda T et al. 2026, Int J Biometeorol — Übersicht über 22 Studien zur Balneotherapie bei Diabetes und Adipositas',
            url: 'https://consensus.app/papers/details/4f3bc4fade0e5c85a19be59f75baf233/',
            note: 'Bäder, Sauna und das Trinken sulfat- und hydrogencarbonathaltiger Wässer mit einem Rückgang von Blutzucker und Gewicht verbunden. Nur 3 Studien mit über 100 Teilnehmern.',
          },
          {
            title: 'Fioravanti A et al. 2015, Int J Biometeorol — offene Pilotstudie, 50 übergewichtige Männer, davon 21 mit Typ-2-Diabetes',
            url: 'https://consensus.app/papers/details/d07d15078653551e9b6c616717e39656/',
            note: '3 Wochen Diät mit Bädern und Peloiden: Rückgang von Gewicht, Blutfetten und Blutzucker. Ohne Kontrollgruppe, Diäteffekt nicht trennbar.',
          },
          {
            title: 'Hanh T et al. 2012, Evid Based Complement Alternat Med — randomisierte Studie (Zelen-Design), 257 Teilnehmer mit Adipositas',
            url: 'https://consensus.app/papers/details/7dbe44960ff55b5eb0b27cd970c93926/',
            note: 'Dreiwöchiges Kurprogramm: nach einem Jahr BMI-Rückgang um 1,91 gegenüber 0,20 bei üblicher Versorgung. Analyse nur bei Teilnehmern, die das Programm abschlossen.',
          },
          {
            title: 'Schnebelen-Berthier C et al. 2019, Obes Res Clin Pract — kontrollierte Studie, 340 Patienten',
            url: 'https://consensus.app/papers/details/ce94b07d6802580283fee76ae74a0cf6/',
            note: 'Kur mit Schulung vs. Kur allein: Gewichtsverlust nach 11 Monaten nur in der Gruppe mit Schulung erhalten. Nicht randomisiert.',
          },
          {
            title: 'Corradini SG et al. 2012, World J Gastroenterol — kontrollierte Studie, 40 Teilnehmer',
            url: 'https://consensus.app/papers/details/11a1a41b579854e591a67d137a568bda/',
            note: '12 Tage Sulfat-Hydrogencarbonat-Wasser: häufigerer Stuhlgang, Gewicht unverändert. Kleine Stichprobe, italienisches Wasser anderer Zusammensetzung.',
          },
        ],
        related: [
          {
            label: 'Gewichtsmanagement im Kurort',
            href: '/de/magazin/gewichtsmanagement-im-kurort-wie-die-kur-den-stoffwechsel-reguliert',
          },
          {
            label: 'Trinkkur-Ratgeber',
            href: '/de/magazin/trinkkur-ratgeber',
          },
          {
            label: 'Ferdinandsbrunnen im Porträt',
            href: '/de/quellen-uebersicht/ferdinanduv',
          },
          {
            label: 'Bewegung im Kurort',
            href: '/de/magazin/bewegung-im-kurort',
          },
        ],
      },
      en: {
        slug: 'metabolism-and-diabetes',
        navLabel: 'Metabolism and diabetes',
        title: 'Spa treatment for metabolic disorders and diabetes in Marienbad',
        h1: 'Spa treatment for metabolic disorders and diabetes',
        metaTitle: 'Spa treatment for diabetes in Marienbad | Marienbad.com',
        metaDescription:
          'Spa treatment for diabetes and metabolic disorders in Marienbad: drinking cure, movement and diet programme — covered indication and course.',
        lead:
          'Diabetes mellitus is the only indication in the metabolic group covered by Czech public health insurance; being overweight and gout are traditionally also treated in Marienbad, but are not a separate covered position. The cure combines a medically prescribed drinking cure from sulphate-rich springs with movement and a diet programme.',
        teaser: 'Diabetes mellitus, being overweight and gout: drinking cure from the Cross Spring and Ferdinand Spring, daily movement and a diet programme over one to three weeks.',
        treats: [
          'Diabetes mellitus and its complications (position IV/1 of the indication list — the only covered position in this group)',
          'Being overweight and obesity linked with metabolic disorders, traditionally treated but without a separate covered position',
          'Gout, likewise without a separate covered position, traditionally treated alongside the drinking cure',
          'Early-stage type 2 diabetes and digestive complaints linked with metabolism',
        ],
        notFor: [
          'Unstable or decompensated diabetes mellitus (except in children and adolescents)',
          'Marked cachexia, or a body mass index under 16.5',
          'Acute infectious disease and severe heart or kidney failure without specialist clearance',
          'Pregnancy, or an inability to manage personal care without a companion',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: 'The spa physician reviews blood sugar values, medication and other conditions, and sets the drinking cure, diet and amount of exercise individually. Bring recent lab results and a list of your medication.',
          },
          {
            heading: 'Drinking cure on a medical plan',
            body: 'Drinking takes place at the spring, slowly and in small sips before meals. With the sulphate springs, a laxative effect starts at around three-quarters of a litre daily — more is not a benefit but a risk.',
          },
          {
            heading: 'Movement at the colonnade and in Slavkov Forest',
            body: 'Guided walking on the network of promenades, matched to fitness and diagnosis; around eight thousand steps daily is considered a realistic wellness goal, not a medical prescription.',
          },
          {
            heading: 'Weekly check-up and final report',
            body: 'Once a week the physician checks blood sugar and weight and adjusts the drinking cure, diet and amount of exercise. At the end you receive a report for your own doctor.',
          },
        ],
        procedures: [
          {
            name: 'Drinking cure from the Cross Spring',
            detail: 'Sulphate- and sodium-rich water, traditionally used for being overweight, gout and diabetes; amount and temperature are set individually by the physician.',
          },
          {
            name: 'Drinking cure from the Ferdinand Spring',
            detail: 'Close in composition to the Cross Spring, used for the same metabolic indications.',
          },
          {
            name: 'Spa-kitchen diet programme',
            detail: 'A meal plan tailored to diabetes or being overweight, prepared by the spa kitchen over three weeks.',
          },
          {
            name: 'Guided walking (terrain cure)',
            detail: 'Routes with a set pace and elevation profile on the historical network of promenades, matched to fitness.',
          },
          {
            name: 'Body composition analysis',
            detail: 'Records baseline values for weight and nutrition counselling at the start of the stay.',
          },
          {
            name: 'Blood tests',
            detail: 'Checking blood sugar, cholesterol and other metabolic values during the stay.',
          },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'For diabetes mellitus (position IV/1), stays covered by Czech public health insurance run to a base stay of 21 days of comprehensive or contributory spa care; a repeat stay lasts 21 or 14 days. Self-paying guests usually choose one to three weeks in consultation with the spa physician; shorter stays work more as recovery, while the classic three-week cure gives the metabolism more time to adjust. There is no medical rule for the season.',
        },
        evidence: {
          heading: 'What the studies show',
          body: 'A review of 22 studies on balneotherapy in diabetes and obesity links baths and drinking sulphate- and bicarbonate-containing waters with a fall in blood sugar and weight, though only three of these studies had more than a hundred participants (Maeda et al., 2026, Int J Biometeorol). In an open pilot study of 50 overweight men, including 21 with type 2 diabetes, three weeks of diet combined with baths and peloids suggested a fall in weight, blood fats and blood sugar; there was no control arm, so the effect of the diet cannot be separated from the cure (Fioravanti et al., 2015, Int J Biometeorol). The most solid support concerns the framework of the cure itself: in a French randomised trial of 257 participants, body mass index fell by 1.91 points within a year after a three-week spa programme, compared with 0.20 under usual care, analysed only among participants who completed the programme (Hanh et al., 2012, Evid Based Complement Alternat Med). In a controlled, non-randomised study of 340 patients, weight loss was maintained after eleven months only among those who received training alongside the cure (Schnebelen-Berthier et al., 2019, Obes Res Clin Pract). The drinking cure alone, in a controlled study of 40 participants, produced more frequent bowel movements, but body weight remained unchanged after twelve days; its contribution therefore lies in regulating digestion, not in weight itself (Corradini et al., 2012, World J Gastroenterol).',
        },
        physicianNote: 'Whether and to what extent a spa cure is right for you is decided by the spa physician at the initial examination, based on your blood sugar values and other conditions. This page provides information and does not replace medical advice.',
        faqs: [
          {
            question: 'Which spa cure helps with diabetes?',
            answer: 'Diabetes mellitus (position IV/1) is the only indication in the metabolic group covered by Czech public health insurance. The cure combines a medically prescribed drinking cure from the Cross Spring, daily movement and a diet programme; it does not replace diabetes medication.',
          },
          {
            question: 'Can you lose weight at a spa town?',
            answer: 'Obesity is not a separate covered position, but is traditionally treated in Marienbad as part of a self-paying cure. In a randomised trial of 257 participants, body mass index fell more within a year after a three-week spa programme than with usual care; what mattered was the whole regime of exercise, diet and routine, not a single treatment.',
          },
          {
            question: 'Which spring in Marienbad helps with metabolism?',
            answer: 'The Cross Spring and Ferdinand Spring are traditionally used for metabolic complaints, both rich in sulphate and sodium. The Cross Spring contains 3,130 mg/l of sulphate and 2,700 mg/l of sodium; the laxative effect starts at around three-quarters of a litre daily. The amount and temperature are always set by the spa physician.',
          },
          {
            question: 'How long does a spa cure for diabetes last?',
            answer: 'For diabetes mellitus, stays covered by Czech public health insurance run to a base stay of 21 days; a repeat stay lasts 21 or 14 days. Self-paying guests usually choose one to three weeks in consultation with the spa physician.',
          },
          {
            question: 'Are being overweight and gout separate spa indications?',
            answer: 'No. Under the Czech indication list, only diabetes mellitus (IV/1) forms a separate covered position in the metabolic group. Being overweight and gout are traditionally treated alongside it in Marienbad, usually as part of a self-paying cure or as part of treating digestive and metabolic diagnoses.',
          },
        ],
        sources: [
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group IV — diseases due to metabolic and endocrine disorders',
            url: '/en/indications-and-contraindications',
            note: 'Diabetes mellitus (IV/1) is the only covered position: base stay K 21 / P 21, repeat P 21 (P 14). Obesity and gout are not a separate position.',
          },
          {
            title: 'Official tourism portal of the town of Mariánské Lázně — Cross Spring (Křížový pramen)',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/krizovy-pramen/',
            note: 'Water analysis (sulphate 3,130 mg/l, sodium 2,700 mg/l, mineral content 9,845 mg/l); traditional use for being overweight, gout and diabetes.',
          },
          {
            title: 'Maeda T et al. 2026, Int J Biometeorol — review of 22 studies on balneotherapy in diabetes and obesity',
            url: 'https://consensus.app/papers/details/4f3bc4fade0e5c85a19be59f75baf233/',
            note: 'Baths, sauna and drinking sulphate- and bicarbonate-containing waters linked with a fall in blood sugar and weight. Only 3 studies with over 100 participants.',
          },
          {
            title: 'Fioravanti A et al. 2015, Int J Biometeorol — open pilot study, 50 overweight men, 21 with type 2 diabetes',
            url: 'https://consensus.app/papers/details/d07d15078653551e9b6c616717e39656/',
            note: '3 weeks of diet with baths and peloids: fall in weight, blood fats and blood sugar. No control group, effect of diet not separable.',
          },
          {
            title: 'Hanh T et al. 2012, Evid Based Complement Alternat Med — randomised trial (Zelen design), 257 participants with obesity',
            url: 'https://consensus.app/papers/details/7dbe44960ff55b5eb0b27cd970c93926/',
            note: 'Three-week spa programme: after a year, BMI fell by 1.91 compared with 0.20 under usual care. Analysis only among participants who completed the programme.',
          },
          {
            title: 'Schnebelen-Berthier C et al. 2019, Obes Res Clin Pract — controlled study, 340 patients',
            url: 'https://consensus.app/papers/details/ce94b07d6802580283fee76ae74a0cf6/',
            note: 'Cure with training vs. cure alone: weight loss after 11 months maintained only in the group that also received training. Not randomised.',
          },
          {
            title: 'Corradini SG et al. 2012, World J Gastroenterol — controlled study, 40 participants',
            url: 'https://consensus.app/papers/details/11a1a41b579854e591a67d137a568bda/',
            note: '12 days of sulphate-bicarbonate water: more frequent bowel movements, weight unchanged. Small sample, Italian water of different composition.',
          },
        ],
        related: [
          {
            label: 'Weight management at the spa',
            href: '/en/magazine/weight-management-at-the-spa-how-the-cure-regulates-your-metabolism',
          },
          {
            label: 'Drinking cure guide',
            href: '/en/magazine/drinking-cure-guide',
          },
          {
            label: 'The Ferdinand Spring in profile',
            href: '/en/springs-overview/ferdinanduv',
          },
          {
            label: 'Movement at the spa',
            href: '/en/magazine/movement-spa-extends-life',
          },
        ],
      },
      cs: {
        slug: 'metabolismus-a-diabetes',
        navLabel: 'Metabolismus a diabetes',
        title: 'Lázeňská léčba poruch metabolismu a diabetu v Mariánských Lázních',
        h1: 'Lázeňská léčba poruch metabolismu a diabetu',
        metaTitle: 'Léčba diabetu a metabolismu v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Lázeňská léčba diabetu a poruch metabolismu v Mariánských Lázních: pitná kúra z Křížového pramene, pohyb a dietní program — hrazená indikace a průběh.',
        lead: 'Diabetes mellitus je jedinou indikací metabolické skupiny hrazenou českou zdravotní pojišťovnou; nadváha a dna se v Mariánských Lázních tradičně léčí také, samostatnou hrazenou položkou ale nejsou. Léčba kombinuje lékařem předepsanou pitnou kúru ze sulfátových pramenů s pohybem a dietním programem.',
        teaser: 'Diabetes mellitus, nadváha a dna: pitná kúra z Křížového a Ferdinandova pramene, denní pohyb a dietní program po jeden až tři týdny.',
        treats: [
          'Diabetes mellitus a jeho následné komplikace (položka IV/1 indikačního seznamu — jediná hrazená položka této skupiny)',
          'Nadváha a obezita ve spojení s poruchami metabolismu, tradičně léčené, avšak bez vlastní hrazené položky',
          'Dna, rovněž bez vlastní hrazené položky, tradičně doléčovaná v rámci pitné kúry',
          'Počínající diabetes 2. typu a trávicí potíže spojené s metabolismem',
        ],
        notFor: [
          'Nestabilní nebo dekompenzovaný diabetes mellitus (kromě dětí a dospívajících)',
          'Výrazná kachexie nebo body mass index pod 16,5',
          'Akutní infekční onemocnění a těžké srdeční nebo ledvinové selhání bez souhlasu odborného lékaře',
          'Těhotenství a neschopnost sebeobsluhy bez doprovodu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde hodnoty glykemie, medikaci a přidružená onemocnění a individuálně stanoví pitnou kúru, dietu a rozsah pohybu. Vezměte si aktuální laboratorní výsledky a seznam léků.',
          },
          {
            heading: 'Pitná kúra podle lékařského plánu',
            body: 'Pije se u pramene, pomalu a po malých doušcích před jídlem. U sulfátových pramenů se projímavý účinek objevuje už kolem tří čtvrtin litru denně — více není výhoda, ale riziko.',
          },
          {
            heading: 'Pohyb na kolonádě a v Císařském lese',
            body: 'Vedená chůze po síti kolonád, přizpůsobená kondici a diagnóze; kolem osmi tisíc kroků denně platí za realistický wellness cíl, ne za lékařský předpis.',
          },
          {
            heading: 'Týdenní kontrola a závěrečná zpráva',
            body: 'Jednou týdně lékař zkontroluje průběh glykemie a hmotnosti a upraví pitnou kúru, dietu i rozsah pohybu. Na závěr dostanete zprávu pro svého ošetřujícího lékaře.',
          },
        ],
        procedures: [
          {
            name: 'Pitná kúra z Křížového pramene',
            detail: 'Voda bohatá na síran a sodík, tradičně používaná u nadváhy, dny a diabetu; množství a teplotu stanoví lékař individuálně.',
          },
          {
            name: 'Pitná kúra z Ferdinandova pramene',
            detail: 'Blízké složení Křížovému prameni, používané u stejných metabolických indikací.',
          },
          {
            name: 'Dietní program lázeňské kuchyně',
            detail: 'Individuálně sestavený jídelníček na míru diabetu nebo nadváze, po tři týdny připravovaný lázeňskou kuchyní.',
          },
          {
            name: 'Vedená chůze (terénní léčba)',
            detail: 'Trasy s pevně daným tempem a výškovým profilem po historické síti kolonád, přizpůsobené kondici.',
          },
          {
            name: 'Analýza tělesného složení',
            detail: 'Zaznamenává výchozí hodnoty hmotnosti a slouží nutričnímu poradenství na začátku pobytu.',
          },
          {
            name: 'Krevní testy',
            detail: 'Kontrola glykemie, cholesterolu a dalších metabolických hodnot během pobytu.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Diabetes mellitus (položka IV/1) je jedinou hrazenou položkou této skupiny; přesnou délku pobytu najdete na stránce Co hradí pojišťovna u metabolismu a štítné žlázy. Samoplátci volí obvykle jeden až tři týdny po dohodě s lázeňským lékařem; kratší pobyty působí spíše regeneračně, klasická třítýdenní kúra dává metabolismu více času na změnu režimu. Pro roční období neexistuje lékařský předpis.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'Přehled 22 studií balneoterapie u diabetu a obezity spojuje koupele i pití síranem a hydrogenuhličitanem bohatých vod s poklesem glykemie a hmotnosti, ale jen tři z těchto studií měly více než sto účastníků (Maeda a kol., 2026, Int J Biometeorol). V otevřené pilotní studii s 50 muži s nadváhou, z toho 21 s diabetem 2. typu, se po třech týdnech diety v kombinaci s koupelemi a peloidy naznačil pokles hmotnosti, krevních tuků a glykemie; chyběla kontrolní skupina, takže se účinek diety nedá od lázeňské léčby oddělit (Fioravanti a kol., 2015, Int J Biometeorol). Nejpevnější oporu má rámec lázeňského pobytu samotný: francouzská randomizovaná studie s 257 účastníky zjistila po třítýdenním lázeňském programu pokles body mass indexu během jednoho roku o 1,91 bodu oproti 0,20 při obvyklé péči, vyhodnocený jen u účastníků, kteří program dokončili (Hanh a kol., 2012, Evid Based Complement Alternat Med). V kontrolované, nerandomizované studii s 340 pacienty se úbytek hmotnosti po jedenácti měsících udržel jen u těch, kdo k lázeňské léčbě dostali navíc edukaci (Schnebelen-Berthier a kol., 2019, Obes Res Clin Pract). Samotná pitná kúra sice v kontrolované studii se 40 účastníky vedla k častější stolici, tělesná hmotnost se však po dvanácti dnech nezměnila; její přínos tedy leží v regulaci trávení, ne v hmotnosti samotné (Corradini a kol., 2012, World J Gastroenterol).',
        },
        physicianNote: 'O tom, zda a v jakém rozsahu pro vás lázeňská léčba připadá v úvahu, rozhoduje lázeňský lékař při vstupní prohlídce podle vašich hodnot glykemie a přidružených onemocnění. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        faqs: [
          {
            question: 'Co léčí Mariánské Lázně u diabetu?',
            answer: 'Diabetes mellitus (položka IV/1) je jedinou indikací metabolické skupiny hrazenou českou zdravotní pojišťovnou. Léčba kombinuje lékařem předepsanou pitnou kúru z Křížového pramene, denní pohyb a dietní program; nenahrazuje léčbu diabetu léky.',
          },
          {
            question: 'Dá se v lázních zhubnout?',
            answer: 'Obezita není samostatnou hrazenou položkou, v Mariánských Lázních se ale tradičně léčí v rámci samoplátecké kúry. V randomizované studii s 257 účastníky klesl po třítýdenním lázeňském programu body mass index během jednoho roku výrazněji než při obvyklé péči; rozhodující byl přitom celý režim pohybu, diety a pravidelnosti, ne jedna procedura.',
          },
          {
            question: 'Který pramen v Mariánských Lázních pomáhá metabolismu?',
            answer: 'Tradičně se u metabolických potíží používá Křížový a Ferdinandův pramen, oba bohaté na síran a sodík. Křížový pramen obsahuje 3 130 mg/l síranu a 2 700 mg/l sodíku; projímavý účinek se objevuje už kolem tří čtvrtin litru denně. Množství a teplotu vždy určuje lázeňský lékař.',
          },
          {
            question: 'Jak dlouho trvá lázeňský pobyt při diabetu?',
            answer: 'U diabetu mellitu jde o délku pobytu, kterou konkrétně uvádí stránka Co hradí pojišťovna u metabolismu a štítné žlázy. Samoplátci volí obvykle jeden až tři týdny po dohodě s lázeňským lékařem.',
          },
          {
            question: 'Jsou nadváha a dna samostatné lázeňské indikace?',
            answer: 'Ne. V indikačním seznamu tvoří samostatnou hrazenou položku metabolické skupiny jen diabetes mellitus (IV/1). Nadváha a dna se v Mariánských Lázních tradičně doléčují, nejčastěji v rámci samoplátecké kúry nebo jako součást léčby trávicích a metabolických diagnóz.',
          },
        ],
        sources: [
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina IV — nemoci z poruchy látkové výměny a žláz s vnitřní sekrecí',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Diabetes mellitus (IV/1) je jedinou hrazenou položkou. Obezita a dna nejsou samostatnou položkou.',
          },
          {
            title: 'Oficiální turistický portál města Mariánské Lázně — Křížový pramen',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/krizovy-pramen/',
            note: 'Rozbor vody (síran 3 130 mg/l, sodík 2 700 mg/l, mineralizace 9 845 mg/l); tradiční použití u nadváhy, dny a diabetu.',
          },
          {
            title: 'Maeda T a kol. 2026, Int J Biometeorol — přehled 22 studií balneoterapie u diabetu a obezity',
            url: 'https://consensus.app/papers/details/4f3bc4fade0e5c85a19be59f75baf233/',
            note: 'Koupele, sauna a pití síranem a hydrogenuhličitanem bohatých vod spojeny s poklesem glykemie a hmotnosti. Jen 3 studie s více než 100 účastníky.',
          },
          {
            title: 'Fioravanti A a kol. 2015, Int J Biometeorol — otevřená pilotní studie, 50 mužů s nadváhou, z toho 21 s diabetem 2. typu',
            url: 'https://consensus.app/papers/details/d07d15078653551e9b6c616717e39656/',
            note: '3 týdny diety s koupelemi a peloidy: pokles hmotnosti, krevních tuků a glykemie. Bez kontrolní skupiny, účinek diety neoddělitelný.',
          },
          {
            title: 'Hanh T a kol. 2012, Evid Based Complement Alternat Med — randomizovaná studie (Zelenův design), 257 účastníků s obezitou',
            url: 'https://consensus.app/papers/details/7dbe44960ff55b5eb0b27cd970c93926/',
            note: 'Třítýdenní lázeňský program: po roce pokles BMI o 1,91 oproti 0,20 při obvyklé péči. Analýza jen u účastníků, kteří program dokončili.',
          },
          {
            title: 'Schnebelen-Berthier C a kol. 2019, Obes Res Clin Pract — kontrolovaná studie, 340 pacientů',
            url: 'https://consensus.app/papers/details/ce94b07d6802580283fee76ae74a0cf6/',
            note: 'Lázeňská léčba s edukací vs. samotná lázeňská léčba: úbytek hmotnosti po 11 měsících se udržel jen ve skupině s edukací. Nerandomizovaná.',
          },
          {
            title: 'Corradini SG a kol. 2012, World J Gastroenterol — kontrolovaná studie, 40 účastníků',
            url: 'https://consensus.app/papers/details/11a1a41b579854e591a67d137a568bda/',
            note: '12 dní síran-hydrogenuhličitanové vody: častější stolice, hmotnost beze změny. Malý vzorek, italská voda jiného složení.',
          },
        ],
        related: [
          {
            label: 'Hubnutí a metabolická léčba v lázních',
            href: '/cs/magazin/hubnuti-a-metabolicka-lecba-v-laznich-jak-funguje-lazenska-kura-na-vahu',
          },
          {
            label: 'Průvodce pitnou kúrou',
            href: '/cs/magazin/pitna-kura-pruvodce',
          },
          {
            label: 'Ferdinandův pramen v profilu',
            href: '/cs/prehled-pramenu/ferdinanduv',
          },
          {
            label: 'Pohyb v lázních prodlužuje život',
            href: '/cs/magazin/pohyb-v-laznich-prodluzuje-zivot',
          },
          {
            label: 'Co hradí pojišťovna u metabolismu a štítné žlázy',
            href: '/cs/lazne-s-pojistovnou/indikace/metabolismus-a-stitna-zlaza',
          },
        ],
      },
      ru: {
        slug: 'obmen-veshchestv-i-diabet',
        navLabel: 'Обмен веществ и диабет',
        title: 'Курортное лечение нарушений обмена веществ и диабета в Марианских Лазнях',
        h1: 'Курортное лечение нарушений обмена веществ и диабета',
        metaTitle: 'Лечение диабета — Марианские Лазни | Marienbad.com',
        metaDescription: 'Лечение диабета и обмена веществ в Марианских Лазнях: питьевой курс, движение и диета — оплачиваемое показание и ход лечения.',
        lead: 'Сахарный диабет — единственное показание группы обмена веществ, оплачиваемое чешской страховой; избыточный вес и подагра традиционно тоже лечат в Марианских Лазнях, но отдельной оплачиваемой позиции для них нет. Лечение сочетает назначенный врачом питьевой курс из сульфатных источников с движением и диетической программой.',
        teaser: 'Сахарный диабет, избыточный вес и подагра: питьевой курс из Крестового источника и источника Фердинанда, ежедневное движение и диетическая программа в течение одной-трёх недель.',
        treats: [
          'Сахарный диабет и его осложнения (позиция IV/1 индикационного списка — единственная оплачиваемая позиция этой группы)',
          'Избыточный вес и ожирение в сочетании с нарушениями обмена веществ, традиционно лечится, но без отдельной оплачиваемой позиции',
          'Подагра, также без отдельной оплачиваемой позиции, традиционно лечится в рамках питьевого курса',
          'Начинающийся диабет 2 типа и заболевания пищеварения, связанные с обменом веществ',
        ],
        notFor: [
          'Нестабильный или декомпенсированный сахарный диабет (кроме детей и подростков)',
          'Выраженная кахексия или индекс массы тела ниже 16,5',
          'Острые инфекционные заболевания, а также тяжёлая сердечная или почечная недостаточность без разрешения профильного врача',
          'Беременность, а также неспособность к самообслуживанию без сопровождающего лица',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает уровень сахара в крови, принимаемые препараты и сопутствующие заболевания и индивидуально определяет питьевой курс, диету и объём движения. Возьмите с собой актуальные лабораторные показатели и список лекарств.',
          },
          {
            heading: 'Питьевой курс по врачебному плану',
            body: 'Пьют у источника, медленно и маленькими глотками перед едой. У сульфатных источников послабляющий эффект начинается уже примерно при трёх четвертях литра в день — больше не значит лучше, это уже риск.',
          },
          {
            heading: 'Движение по колоннаде и в Кайзервальде',
            body: 'Направляемая ходьба по прогулочной сети, подобранная по физической форме и диагнозу; около восьми тысяч шагов в день считаются реалистичной wellness-целью, а не врачебным предписанием.',
          },
          {
            heading: 'Еженедельный контроль и итоговое заключение',
            body: 'Раз в неделю врач проверяет динамику сахара в крови и веса и корректирует питьевой курс, диету и объём движения. По окончании вы получаете заключение для вашего лечащего врача.',
          },
        ],
        procedures: [
          {
            name: 'Питьевой курс из Крестового источника',
            detail: 'Богатая сульфатом и натрием вода, традиционно применяется при избыточном весе, подагре и диабете; количество и температуру индивидуально определяет врач.',
          },
          {
            name: 'Питьевой курс из источника Фердинанда',
            detail: 'Близок по составу к Крестовому источнику, применяется при тех же показаниях со стороны обмена веществ.',
          },
          {
            name: 'Диетическая программа курортной кухни',
            detail: 'Индивидуально подобранный по диабету или избыточному весу план питания, готовится курортной кухней в течение трёх недель.',
          },
          {
            name: 'Направляемая ходьба (терренкур)',
            detail: 'Маршруты с определённым темпом и профилем высоты по историческим прогулочным дорожкам, адаптированные под физическую форму.',
          },
          {
            name: 'Анализ состава тела',
            detail: 'Фиксирует исходные показатели веса для консультации по питанию в начале пребывания.',
          },
          {
            name: 'Анализы крови',
            detail: 'Контроль сахара в крови, холестерина и других показателей обмена веществ в течение пребывания.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'При сахарном диабете (позиция IV/1) для пребываний, оплачиваемых чешской страховой, предусмотрено базовое пребывание длительностью 21 день комплексного или долевого курортного лечения; повторное пребывание длится 21 или 14 дней. Гости, оплачивающие лечение самостоятельно, обычно выбирают одну-три недели по согласованию с курортным врачом; более короткие пребывания действуют скорее восстанавливающе, классический трёхнедельный курс даёт обмену веществ больше времени на перестройку. Для времени года медицинских рекомендаций нет.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'Обзор 22 исследований бальнеотерапии при диабете и ожирении связывает ванны и приём сульфатных и гидрокарбонатных вод со снижением сахара в крови и веса, однако только три из этих исследований охватывали более ста участников (Maeda et al., 2026, Int J Biometeorol). В открытом пилотном исследовании с 50 мужчинами с избыточным весом, из которых 21 — с диабетом 2 типа, после трёх недель диеты в сочетании с ваннами и пелоидами наметилось снижение веса, липидов крови и сахара в крови; контрольной группы не было, поэтому эффект диеты от эффекта лечения отделить нельзя (Fioravanti et al., 2015, Int J Biometeorol). Самое надёжное подтверждение касается самого формата курортного лечения: во французском рандомизированном исследовании с 257 участниками индекс массы тела через год после трёхнедельной курортной программы снизился на 1,91 пункта против 0,20 при обычном лечении, анализ проводился только среди участников, завершивших программу (Hanh et al., 2012, Evid Based Complement Alternat Med). В контролируемом, нерандомизированном исследовании с 340 пациентами снижение веса через одиннадцать месяцев сохранилось только у тех, кто дополнительно к лечению прошёл обучение (Schnebelen-Berthier et al., 2019, Obes Res Clin Pract). Сам по себе питьевой курс в контролируемом исследовании с 40 участниками действительно увеличивал частоту стула, однако масса тела через двенадцать дней оставалась неизменной; его вклад заключается, таким образом, в регуляции пищеварения, а не в самом весе (Corradini et al., 2012, World J Gastroenterol).',
        },
        physicianNote: 'Показано ли вам курортное лечение и в каком объёме, решает курортный врач при первичном осмотре на основании ваших показателей сахара в крови и сопутствующих заболеваний. Эта страница носит информационный характер и не заменяет консультацию врача.',
        faqs: [
          {
            question: 'Какое курортное лечение помогает при диабете?',
            answer: 'Сахарный диабет (позиция IV/1) — единственное показание группы обмена веществ, оплачиваемое чешской страховой. Лечение сочетает назначенный врачом питьевой курс из Крестового источника, ежедневное движение и диетическую программу; оно не заменяет медикаментозную терапию диабета.',
          },
          {
            question: 'Можно ли похудеть на курорте?',
            answer: 'Ожирение не является отдельной оплачиваемой позицией, но в Марианских Лазнях традиционно лечится в рамках лечения для гостей, оплачивающих его самостоятельно. В рандомизированном исследовании с 257 участниками индекс массы тела через год после трёхнедельной курортной программы снизился сильнее, чем при обычном лечении; решающим было при этом сочетание движения, диеты и регулярности, а не отдельная процедура.',
          },
          {
            question: 'Какой источник в Марианских Лазнях помогает при обмене веществ?',
            answer: 'Традиционно при нарушениях обмена веществ применяют Крестовый источник и источник Фердинанда, оба богаты сульфатом и натрием. Крестовый источник содержит 3130 мг/л сульфата и 2700 мг/л натрия; послабляющий эффект начинается уже примерно при трёх четвертях литра в день. Количество и температуру всегда определяет курортный врач.',
          },
          {
            question: 'Сколько длится курортное лечение при диабете?',
            answer: 'При сахарном диабете для пребываний, оплачиваемых чешской страховой, предусмотрено 21 день базового пребывания, повторное пребывание длится 21 или 14 дней. Гости, оплачивающие лечение самостоятельно, обычно выбирают одну-три недели по согласованию с курортным врачом.',
          },
          {
            question: 'Являются ли избыточный вес и подагра отдельными показаниями для лечения?',
            answer: 'Нет. В чешском индикационном списке только сахарный диабет (IV/1) образует отдельную оплачиваемую позицию группы обмена веществ. Избыточный вес и подагра в Марианских Лазнях традиционно лечат дополнительно, обычно в рамках лечения для гостей, оплачивающих его самостоятельно, или как часть лечения диагнозов пищеварения и обмена веществ.',
          },
        ],
        sources: [
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа IV — заболевания вследствие нарушений обмена веществ и желёз внутренней секреции',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Сахарный диабет (IV/1) — единственная оплачиваемая позиция: базовое пребывание K 21 / P 21, повторное P 21 (P 14). Ожирение и подагра отдельной позиции не образуют.',
          },
          {
            title: 'Официальный туристический портал города Марианске-Лазне — Крестовый источник (Křížový pramen)',
            url: 'https://www.marianskelazne.cz/o-meste/prameny/krizovy-pramen/',
            note: 'Анализ воды (сульфат 3130 мг/л, натрий 2700 мг/л, минерализация 9845 мг/л); традиционное применение при избыточном весе, подагре и диабете.',
          },
          {
            title: 'Maeda T et al. 2026, Int J Biometeorol — обзор 22 исследований бальнеотерапии при диабете и ожирении',
            url: 'https://consensus.app/papers/details/4f3bc4fade0e5c85a19be59f75baf233/',
            note: 'Ванны, сауна и приём сульфатных и гидрокарбонатных вод связаны со снижением сахара в крови и веса. Только 3 исследования с более чем 100 участниками.',
          },
          {
            title: 'Fioravanti A et al. 2015, Int J Biometeorol — открытое пилотное исследование, 50 мужчин с избыточным весом, из них 21 с диабетом 2 типа',
            url: 'https://consensus.app/papers/details/d07d15078653551e9b6c616717e39656/',
            note: '3 недели диеты с ваннами и пелоидами: снижение веса, липидов крови и сахара в крови. Без контрольной группы, эффект диеты неотделим.',
          },
          {
            title: 'Hanh T et al. 2012, Evid Based Complement Alternat Med — рандомизированное исследование (дизайн Зелена), 257 участников с ожирением',
            url: 'https://consensus.app/papers/details/7dbe44960ff55b5eb0b27cd970c93926/',
            note: 'Трёхнедельная курортная программа: через год снижение ИМТ на 1,91 против 0,20 при обычном лечении. Анализ только среди участников, завершивших программу.',
          },
          {
            title: 'Schnebelen-Berthier C et al. 2019, Obes Res Clin Pract — контролируемое исследование, 340 пациентов',
            url: 'https://consensus.app/papers/details/ce94b07d6802580283fee76ae74a0cf6/',
            note: 'Лечение с обучением против лечения без обучения: снижение веса через 11 месяцев сохранилось только в группе с обучением. Нерандомизированное.',
          },
          {
            title: 'Corradini SG et al. 2012, World J Gastroenterol — контролируемое исследование, 40 участников',
            url: 'https://consensus.app/papers/details/11a1a41b579854e591a67d137a568bda/',
            note: '12 дней сульфатно-гидрокарбонатной воды: более частый стул, вес неизменен. Небольшая выборка, итальянская вода другого состава.',
          },
        ],
        related: [
          {
            label: 'Управление весом на курорте',
            href: '/ru/zhurnal/lechenie-vesa-na-kurorte-kak-kurs-lecheniya-reguliruet-obmen-veshchestv',
          },
          {
            label: 'Путеводитель по питьевому курсу',
            href: '/ru/zhurnal/pitevoj-kurs-putevoditel',
          },
          {
            label: 'Источник Фердинанда — портрет',
            href: '/ru/obzor-istochnikov/ferdinanduv',
          },
          {
            label: 'Движение на курорте',
            href: '/ru/zhurnal/dvizhenie-v-kurorte',
          },
        ],
      },
    },
  },
  {
    id: 'parkinsons',
    groupId: 'nervous',
    roman: 'VI',
    codes: [
      'VI/11',
    ],
    conditionName: 'Parkinson disease',
    icd10: 'G20',
    image: '/images/library/treatments/aqua-therapy-noodles.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Kurgäste üben mit Schwimmnudeln im warmen Becken Gleichgewicht und Beweglichkeit',
      en: 'Spa guests practising balance and mobility with pool noodles in the warm pool',
      cs: 'Lázeňští hosté cvičí s plaveckými nudlemi v teplém bazénu rovnováhu a pohyblivost',
      ru: 'Гости лечения тренируют равновесие и подвижность с плавательными палками в тёплом бассейне',
    },
    content: {
      de: {
        slug: 'parkinson',
        navLabel: 'Parkinson-Krankheit',
        title: 'Kur bei Parkinson in Marienbad',
        h1: 'Kur bei der Parkinson-Krankheit',
        metaTitle: 'Kur bei Parkinson in Marienbad — Ablauf und Dauer',
        metaDescription: 'Kur bei der Parkinson-Krankheit in Marienbad: Gang- und Gleichgewichtstraining, Bewegungstherapie im Wasser, Kohlensäurebäder — Ablauf und Dauer.',
        lead: 'Die Parkinson-Krankheit steht als eigene Position auf der tschechischen Indikationsliste, und Marienbad behandelt sie als Rehabilitationsaufenthalt: mit täglichem Gang- und Gleichgewichtstraining, Bewegungstherapie im warmen Wasser und Anwendungen aus den örtlichen Heilmitteln. Die Kur ergänzt die neurologische Behandlung, sie tritt nicht an ihre Stelle.',
        teaser: 'Gang- und Gleichgewichtstraining, Übungen im Wasser und Kohlensäurebäder — als Ergänzung zur neurologischen Behandlung.',
        treats: [
          'Parkinson-Krankheit in einem Stadium, in dem selbstständiges Gehen und die eigene Versorgung noch möglich sind',
          'Gangunsicherheit, verkürzte Schrittlänge und Starthemmung im Alltag',
          'Gleichgewichtsstörungen mit erhöhtem Sturzrisiko',
          'Muskelsteifigkeit und schmerzhafte Verspannungen des Rumpfes und der Schultern',
          'Nachlassende körperliche Belastbarkeit und Rückzug aus der Bewegung',
        ],
        notFor: [
          'Unfähigkeit, ohne fremde Hilfe zu gehen und die täglichen Verrichtungen selbst zu erledigen — die Indikationsliste setzt beides voraus',
          'Fortgeschrittene Demenz oder ausgeprägte Verwirrtheit, die ein Üben nach Anleitung unmöglich macht',
          'Akute Erkrankung, unbehandelte Herzinsuffizienz oder frische Verletzung',
          'Epilepsie sowie Abhängigkeit von Alkohol oder anderen Suchtmitteln',
          'Schwangerschaft',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt geht den neurologischen Befund und die aktuelle Medikation durch, prüft Gangbild, Gleichgewicht und Belastbarkeit und stellt danach den Anwendungsplan zusammen. Bringen Sie den letzten Bericht Ihres Neurologen und eine vollständige Medikamentenliste mit — die Einnahmezeiten bestimmen, wann die Übungseinheiten sinnvoll liegen.',
          },
          {
            heading: 'Erste Woche: Rhythmus finden',
            body: 'Die Anwendungen werden um die Wirkzeiten der Medikation herum gelegt, damit die Bewegungstherapie in die beweglichen Phasen fällt. Gang- und Gleichgewichtsübungen beginnen mit einfachen Abläufen; im Wasser sind Schritte und Drehungen leichter, weil der Auftrieb das Sturzrisiko nimmt.',
          },
          {
            heading: 'Zweite Woche: Belastung steigern',
            body: 'Schrittlänge, Tempowechsel und Richtungswechsel kommen dazu, ebenso das Üben an Alltagssituationen: Aufstehen, Umdrehen, Durchgehen durch eine Tür. Balneologische Anwendungen wie Kohlensäurebäder und Massagen lockern die begleitende Muskelsteifigkeit.',
          },
          {
            heading: 'Abschlussuntersuchung und Plan für zu Hause',
            body: 'Zum Abschluss werden Gangbild und Gleichgewicht erneut beurteilt und schriftlich festgehalten. Sie erhalten ein Übungsprogramm für zu Hause; ohne regelmäßiges Weiterüben hält das Erreichte nicht an.',
          },
        ],
        procedures: [
          {
            name: 'Einzelphysiotherapie',
            detail: 'Täglich, mit Schwerpunkt auf Gangbild, Schrittlänge, Aufrichtung und dem sicheren Umdrehen.',
          },
          {
            name: 'Gleichgewichts- und Gangschule',
            detail: 'Übungen an Standsicherheit, Gewichtsverlagerung und Richtungswechseln, um das Sturzrisiko im Alltag zu senken.',
          },
          {
            name: 'Bewegungstherapie im Becken',
            detail: 'Der Auftrieb des warmen Wassers erlaubt Bewegungsumfänge, die an Land zu unsicher wären, und nimmt die Angst vor dem Sturz.',
          },
          {
            name: 'Gruppenübungen',
            detail: 'Geleitete Einheiten mit Gästen ähnlicher Diagnose, mit Atemtechnik und Übungen für Haltung und Beweglichkeit.',
          },
          {
            name: 'Kohlensäurebad im Mineralwasser',
            detail: 'Bad bei rund 34 °C; das aus dem Wasser aufgenommene Kohlendioxid fördert die Hautdurchblutung und wird zur Entspannung verordnet.',
          },
          {
            name: 'Trockenes Gasbad im Mariengas',
            detail: 'Anwendung des natürlichen Kohlendioxids aus der Marienquelle in einem abgedichteten Beutel, ohne Wasser und ohne Kreislaufbelastung durch Wärme.',
          },
          {
            name: 'Klassische und Reflexmassage',
            detail: 'Gegen die begleitende Muskelsteifigkeit von Rumpf, Nacken und Schultergürtel; die Reflexmassage verordnet ausschließlich der Arzt.',
          },
          {
            name: 'Klimatherapie und geführte Spaziergänge',
            detail: 'Gehen im Gelände unter Anleitung, mit steigender Wegstrecke entsprechend der aktuellen Belastbarkeit.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Die Parkinson-Krankheit ist eine eigene Position der tschechischen Indikationsliste (VI/11). Für Aufenthalte, die eine tschechische Krankenkasse trägt, sind 21 Tage komplexe Kurbehandlung vorgesehen, und für den Wiederholungsaufenthalt ebenfalls 21 Tage komplexe Behandlung; eine Zuschussposition sieht die Liste hier nicht vor. Selbstzahler stimmen die Dauer mit dem Kurarzt ab; als fachliche Untergrenze einer Balneotherapie gelten mindestens 10 Anwendungen über mindestens 10 Tage. Für die Jahreszeit gibt es keine medizinische Vorgabe — im Spätsommer und Herbst ist der Kurort ruhiger und die Wege sind sicherer begehbar als bei Glätte.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body: 'In einer randomisierten Crossover-Studie mit 31 Patienten mit Parkinson-Krankheit verbesserte eine dreiwöchige Kurbehandlung vier Wochen nach der Kur die Lebensqualität (PDQ-39 und SF-36), Teil IV der UPDRS-Skala und das psychische Wohlbefinden (GHQ-28); in der 20. Woche war der Unterschied nicht mehr nachweisbar, der Effekt ist also kurzfristig belegt (Brefel-Courbon et al., 2003, Mov Disord; kleines Kollektiv). Ein Scoping Review zur Kurrehabilitation bei neurodegenerativen Erkrankungen fasst drei Studien zur Parkinson-Krankheit zusammen, die Verbesserungen von Motorik, Gleichgewicht, Lebensqualität und psychischem Wohlbefinden beschreiben (Maccarone et al., 2022, Int J Biometeorol; nur drei Studien, begrenzte Literatur). Keine dieser Studien zeigt einen Einfluss auf das Fortschreiten der Erkrankung, und keine ersetzt die neurologische Behandlung oder die Medikation.',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur bei Ihrer Parkinson-Krankheit infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand des neurologischen Befunds und Ihrer Medikation. Ein Kuraufenthalt ergänzt die neurologische Behandlung und ersetzt weder sie noch die verordneten Medikamente. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        faqs: [
          {
            question: 'Wird eine Kur bei Parkinson bezahlt?',
            answer: 'Die Parkinson-Krankheit steht als Position VI/11 auf der tschechischen Indikationsliste: Für Versicherte einer tschechischen Krankenkasse sind 21 Tage komplexe Kurbehandlung vorgesehen, beim Wiederholungsaufenthalt ebenfalls 21 Tage. Gäste mit einer Versicherung außerhalb Tschechiens klären die Kostenübernahme vorab mit ihrem eigenen Kostenträger; wer selbst zahlt, bucht den Aufenthalt direkt beim Kurhotel.',
          },
          {
            question: 'Was bringt eine Kur bei Parkinson?',
            answer: 'Das Ziel ist die Beweglichkeit im Alltag: sicheres Gehen, Gleichgewicht, Schrittlänge und Umdrehen, dazu die Lockerung der begleitenden Muskelsteifigkeit. Eine randomisierte Crossover-Studie mit 31 Patienten fand vier Wochen nach einer dreiwöchigen Kur eine bessere Lebensqualität und ein besseres psychisches Wohlbefinden, in der 20. Woche war der Unterschied nicht mehr nachweisbar. Auf das Fortschreiten der Erkrankung wirkt die Kur nach den vorliegenden Studien nicht.',
          },
          {
            question: 'Ab welchem Stadium ist eine Kur nicht mehr sinnvoll?',
            answer: 'Die Indikationsliste setzt voraus, dass der Gast selbstständig gehen und die täglichen Verrichtungen ohne fremde Hilfe erledigen kann. Wer darauf angewiesen ist, gepflegt zu werden, oder wegen fortgeschrittener Demenz nicht nach Anleitung üben kann, wird nicht aufgenommen. Die Entscheidung trifft der Kurarzt im Einzelfall bei der Eingangsuntersuchung.',
          },
          {
            question: 'Muss ich meine Medikamente während der Kur absetzen?',
            answer: 'Nein, und Sie sollten Ihre zu Hause verordnete Medikation ohne Zustimmung Ihres Arztes auch nicht verändern. Bei Parkinson bestimmen die Einnahmezeiten sogar den Ablauf: Die Anwendungen werden so gelegt, dass die Bewegungstherapie in die beweglichen Phasen fällt. Bringen Sie deshalb eine vollständige Medikamentenliste mit Uhrzeiten mit.',
          },
          {
            question: 'Kann eine Begleitperson mitkommen?',
            answer: 'Ja, eine Begleitperson kann im selben Haus untergebracht werden. Sie ersetzt allerdings nicht die Voraussetzung der Indikationsliste, dass der Kurgast selbst gehen und sich selbst versorgen kann; eine Kur ist keine Pflegeleistung.',
          },
        ],
        sources: [
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe VI — Position VI/11',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Parkinson-Krankheit: 21 Tage komplexe Kurbehandlung als Grundaufenthalt, 21 Tage komplexe Behandlung beim Wiederholungsaufenthalt; keine Zuschussposition.',
          },
          {
            title: 'Verordnung Nr. 2/2015 Slg. über die fachlichen Kriterien der kurmedizinischen Rehabilitationspflege — Gruppe VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Vollständiger Wortlaut der Indikationsliste für Nervenkrankheiten samt allgemeiner Kontraindikationen. Tschechischer Text.',
          },
          {
            title: 'Brefel-Courbon C et al. 2003, Mov Disord — randomisierte Crossover-Studie, 31 Patienten mit Parkinson-Krankheit',
            url: 'https://consensus.app/papers/details/a9e96b9dd21d545fbb2795b2537ed0d6/',
            note: 'Dreiwöchige Kurbehandlung verbesserte vier Wochen danach Lebensqualität, Teil IV der UPDRS und psychisches Wohlbefinden; in der 20. Woche kein Unterschied mehr. Kleines Kollektiv.',
          },
          {
            title: 'Maccarone MC et al. 2022, Int J Biometeorol — Scoping Review zur Kurrehabilitation bei neurodegenerativen Erkrankungen',
            url: 'https://consensus.app/papers/details/6e6a5d578d1c52f9b0e1411ea6617dce/',
            note: 'Drei Studien zur Parkinson-Krankheit beschreiben bessere Motorik, Gleichgewicht und Lebensqualität nach Kurrehabilitation; die Literatur ist bisher begrenzt.',
          },
        ],
        related: [
          {
            label: 'Tag des Gehirns und Nervensystems',
            href: '/de/magazin/gehirn-nervensystem',
          },
          {
            label: 'Kur bei Polyneuropathie',
            href: '/de/kur-bei/polyneuropathie',
          },
          {
            label: 'Bewegung im Kurort',
            href: '/de/magazin/bewegung-im-kurort',
          },
          {
            label: 'Indikationen und Kontraindikationen',
            href: '/de/indikationen-und-kontraindikationen',
          },
        ],
      },
      en: {
        slug: 'parkinsons-disease',
        navLabel: "Parkinson's disease",
        title: "Spa treatment for Parkinson's disease in Marienbad",
        h1: "Spa treatment for Parkinson's disease",
        metaTitle: "Spa treatment for Parkinson's in Marienbad — course and duration",
        metaDescription: "Spa treatment for Parkinson's disease in Marienbad: gait and balance training, exercise therapy in water, carbon dioxide baths — course and duration.",
        lead: "Parkinson's disease has its own position on the Czech indication list, and Marienbad treats it as a rehabilitation stay: with daily gait and balance training, exercise therapy in warm water and treatments drawn from the local natural remedies. The cure supplements neurological treatment; it does not take its place.",
        teaser: 'Gait and balance training, exercises in water and carbon dioxide baths — as a supplement to neurological treatment.',
        treats: [
          "Parkinson's disease at a stage where independent walking and self-care are still possible",
          'Unsteady gait, shortened stride length and start hesitation in everyday life',
          'Balance disorders with an increased risk of falls',
          'Muscle stiffness and painful tension in the trunk and shoulders',
          'Declining physical stamina and withdrawal from movement',
        ],
        notFor: [
          'Inability to walk without assistance and to manage daily activities unaided — the indication list requires both',
          'Advanced dementia or marked confusion that makes guided exercise impossible',
          'Acute illness, untreated heart failure or a recent injury',
          'Epilepsy, and dependence on alcohol or other addictive substances',
          'Pregnancy',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: "The spa physician reviews your neurological findings and current medication, checks your gait, balance and stamina, and then puts together the treatment plan. Bring your neurologist's latest report and a complete list of your medication — the times you take it determine when the exercise sessions make sense.",
          },
          {
            heading: 'First week: finding a rhythm',
            body: 'Treatments are scheduled around when the medication is working, so that exercise therapy falls within the mobile phases. Gait and balance exercises start with simple movements; in water, steps and turns are easier, because buoyancy removes the risk of falling.',
          },
          {
            heading: 'Second week: increasing the load',
            body: 'Stride length, changes of pace and changes of direction are added, along with practising everyday situations: standing up, turning around, walking through a doorway. Balneological treatments such as carbon dioxide baths and massage loosen the accompanying muscle stiffness.',
          },
          {
            heading: 'Final examination and a plan for home',
            body: 'At the end, gait and balance are assessed again and recorded in writing. You receive a home exercise programme; without regularly continuing it, the gains do not last.',
          },
        ],
        procedures: [
          { name: 'Individual physiotherapy', detail: 'Daily, focused on gait, stride length, posture and turning safely.' },
          { name: 'Balance and gait training', detail: 'Exercises in standing stability, weight shifting and changes of direction, to lower the risk of falls in everyday life.' },
          { name: 'Exercise therapy in the pool', detail: 'The buoyancy of the warm water allows a range of movement that would feel too unsteady on dry land, and takes away the fear of falling.' },
          { name: 'Group exercise', detail: 'Guided sessions with guests of similar diagnosis, including breathing technique and exercises for posture and mobility.' },
          { name: 'Carbon dioxide bath in mineral water', detail: 'A bath at around 34°C; the carbon dioxide absorbed from the water promotes skin blood flow and is prescribed for relaxation.' },
          { name: 'Dry gas bath in Mariengas', detail: 'Application of the natural carbon dioxide from the Marien Spring in a sealed bag, without water and without the circulatory strain of heat.' },
          { name: 'Classic and reflex massage', detail: 'For the accompanying muscle stiffness of the trunk, neck and shoulder girdle; reflex massage is prescribed only by the physician.' },
          { name: 'Climate therapy and guided walks', detail: 'Walking outdoors under guidance, with the distance increasing according to current stamina.' },
        ],
        stay: {
          heading: 'How long, and when',
          body: "Parkinson's disease has its own position on the Czech indication list (VI/11). For stays covered by Czech public health insurance, 21 days of comprehensive spa care are provided for, and the repeat stay is likewise 21 days of comprehensive care; the list does not provide a contributory-care position here. Self-paying guests agree the length with the spa physician; the professional minimum for balneotherapy is at least 10 treatments over at least 10 days. There is no medical requirement for the season — in late summer and autumn the spa town is quieter and the paths are safer to walk than when they are icy.",
        },
        evidence: {
          heading: 'What the studies show',
          body: "In a randomised crossover study of 31 patients with Parkinson's disease, a three-week spa treatment improved quality of life (PDQ-39 and SF-36), part IV of the UPDRS scale and psychological well-being (GHQ-28) four weeks after the cure; by week 20 the difference was no longer detectable, so the effect is only established short-term (Brefel-Courbon et al., 2003, Mov Disord; small cohort). A scoping review of spa rehabilitation in neurodegenerative disease summarises three studies on Parkinson's disease describing improvements in motor function, balance, quality of life and psychological well-being (Maccarone et al., 2022, Int J Biometeorol; only three studies, limited literature). None of these studies shows an effect on disease progression, and none replaces neurological treatment or medication.",
        },
        physicianNote: "Whether and to what extent a spa cure is appropriate for your Parkinson's disease is decided by the spa physician at the initial examination, based on your neurological findings and your medication. A spa stay supplements neurological treatment and replaces neither it nor your prescribed medication. This page provides information and does not replace medical advice.",
        faqs: [
          {
            question: "Is a spa cure for Parkinson's disease covered?",
            answer: "Parkinson's disease is position VI/11 on the Czech indication list: for people insured with a Czech health fund, 21 days of comprehensive spa care are provided for, and 21 days again for a repeat stay. Guests insured outside the Czech Republic should clarify cost coverage with their own insurer in advance; those paying themselves book the stay directly with the spa hotel.",
          },
          {
            question: "What can a spa cure do for Parkinson's disease?",
            answer: 'The goal is mobility in daily life: walking safely, balance, stride length and turning, together with loosening the accompanying muscle stiffness. A randomised crossover study of 31 patients found better quality of life and better psychological well-being four weeks after a three-week cure; by week 20 the difference was no longer detectable. According to the available studies, the cure has no effect on disease progression.',
          },
          {
            question: 'From what stage does a spa cure no longer make sense?',
            answer: 'The indication list requires that the guest can walk independently and manage daily activities without assistance. Anyone who depends on being cared for, or who cannot follow guided exercise because of advanced dementia, is not admitted. The spa physician decides on a case-by-case basis at the initial examination.',
          },
          {
            question: 'Do I have to stop my medication during the cure?',
            answer: "No, and you should not change medication prescribed for you at home without your doctor's agreement. With Parkinson's disease, the timing of your doses even shapes the schedule: treatments are arranged so that exercise therapy falls within the mobile phases. So bring a complete list of your medication with the times you take it.",
          },
          {
            question: 'Can a companion come along?',
            answer: "Yes, a companion can be accommodated in the same hotel. This does not, however, replace the indication list's requirement that the guest can walk and manage self-care independently; a spa cure is not a nursing service.",
          },
        ],
        sources: [
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group VI — position VI/11',
            url: '/en/indications-and-contraindications',
            note: "Parkinson's disease: 21 days of comprehensive spa care as the initial stay, 21 days of comprehensive care for a repeat stay; no contributory-care position.",
          },
          {
            title: 'Decree No. 2/2015 Coll. on the professional criteria for spa medical rehabilitation care — Group VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Full text of the indication list for nervous system diseases, including general contraindications. Czech-language text.',
          },
          {
            title: "Brefel-Courbon C et al. 2003, Mov Disord — randomised crossover study, 31 patients with Parkinson's disease",
            url: 'https://consensus.app/papers/details/a9e96b9dd21d545fbb2795b2537ed0d6/',
            note: 'A three-week spa treatment improved quality of life, UPDRS part IV and psychological well-being four weeks later; no difference remained at week 20. Small cohort.',
          },
          {
            title: 'Maccarone MC et al. 2022, Int J Biometeorol — scoping review of spa rehabilitation in neurodegenerative disease',
            url: 'https://consensus.app/papers/details/6e6a5d578d1c52f9b0e1411ea6617dce/',
            note: "Three studies on Parkinson's disease describe better motor function, balance and quality of life after spa rehabilitation; the literature remains limited.",
          },
        ],
        related: [
          { label: 'Brain and Nervous System Day', href: '/en/magazine/brain-nervous-system' },
          { label: 'Spa treatment for polyneuropathy', href: '/en/spa-treatment-for/polyneuropathy' },
          { label: 'Movement at the spa', href: '/en/magazine/movement-spa-extends-life' },
          { label: 'Indications and contraindications', href: '/en/indications-and-contraindications' },
        ],
      },
      cs: {
        slug: 'parkinsonova-nemoc',
        navLabel: 'Parkinsonova nemoc',
        title: 'Lázeňská léčba Parkinsonovy nemoci v Mariánských Lázních',
        h1: 'Lázeňská léčba Parkinsonovy nemoci',
        metaTitle: 'Léčba Parkinsonovy nemoci v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Lázeňská léčba Parkinsonovy nemoci v Mariánských Lázních: trénink chůze a rovnováhy, pohyb ve vodě, uhličité koupele — průběh a délka pobytu.',
        lead: 'Parkinsonova nemoc je samostatnou položkou českého indikačního seznamu, a Mariánské Lázně ji léčí jako rehabilitační pobyt: s denním tréninkem chůze a rovnováhy, pohybovou terapií v teplé vodě a procedurami z místních léčivých zdrojů. Lázeňský pobyt doplňuje neurologickou léčbu, nenahrazuje ji.',
        teaser: 'Trénink chůze a rovnováhy, cvičení ve vodě a uhličité koupele — jako doplněk k neurologické léčbě.',
        treats: [
          'Parkinsonova nemoc ve stadiu, kdy je ještě možná samostatná chůze a sebeobsluha',
          'Nejistota při chůzi, zkrácená délka kroku a potíže se zahájením chůze v běžném dni',
          'Poruchy rovnováhy se zvýšeným rizikem pádu',
          'Svalová ztuhlost a bolestivé napětí trupu a ramen',
          'Ubývající fyzická zátěžová kapacita a ústup od pohybu',
        ],
        notFor: [
          'Neschopnost chodit bez cizí pomoci a zajistit si běžné denní úkony sama/sám — obojí indikační seznam vyžaduje',
          'Pokročilá demence nebo výrazná zmatenost, která znemožňuje cvičení podle instrukcí',
          'Akutní onemocnění, neléčené srdeční selhání nebo čerstvé zranění',
          'Epilepsie a závislost na alkoholu či jiných návykových látkách',
          'Těhotenství',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde neurologický nález a aktuální medikaci, vyšetří chůzi, rovnováhu a zátěžovou kapacitu a poté sestaví plán procedur. Vezměte si poslední zprávu svého neurologa a úplný seznam léků — časy jejich užívání určují, kdy má smysl zařadit cvičební jednotky.',
          },
          {
            heading: 'První týden: hledání rytmu',
            body: 'Procedury se plánují podle doby účinku medikace, aby pohybová terapie připadla na fáze s dobrou hybností. Trénink chůze a rovnováhy začíná jednoduchými postupy; ve vodě jsou kroky a otáčení snazší, protože vztlak snižuje riziko pádu.',
          },
          {
            heading: 'Druhý týden: zvyšování zátěže',
            body: 'Přibývá práce na délce kroku, změnách tempa a směru i trénink běžných situací: vstávání, otáčení, průchod dveřmi. Balneologické procedury jako uhličité koupele a masáže uvolňují doprovodnou svalovou ztuhlost.',
          },
          {
            heading: 'Závěrečná prohlídka a plán pro doma',
            body: 'Na závěr se znovu posoudí a písemně zaznamená chůze a rovnováha. Dostanete cvičební program pro doma; bez pravidelného pokračování se dosažený stav neudrží.',
          },
        ],
        procedures: [
          {
            name: 'Individuální fyzioterapie',
            detail: 'Denně, se zaměřením na chůzi, délku kroku, vzpřímené držení těla a bezpečné otáčení.',
          },
          {
            name: 'Škola rovnováhy a chůze',
            detail: 'Cvičení na stabilitu ve stoji, přenášení váhy a změny směru, aby se v běžném dni snížilo riziko pádu.',
          },
          {
            name: 'Pohybová terapie v bazénu',
            detail: 'Vztlak teplé vody umožňuje rozsah pohybu, který by na suchu byl příliš nejistý, a snižuje strach z pádu.',
          },
          {
            name: 'Skupinové cvičení',
            detail: 'Vedené jednotky s hosty s podobnou diagnózou, s dechovou technikou a cvičením na držení těla a pohyblivost.',
          },
          {
            name: 'Uhličitá koupel z minerální vody',
            detail: 'Koupel při zhruba 34 °C; oxid uhličitý přijímaný z vody podporuje prokrvení kůže a předepisuje se k uvolnění.',
          },
          {
            name: 'Suchá plynová koupel v Mariině plynu',
            detail: 'Aplikace přírodního oxidu uhličitého z Mariina pramene v uzavřeném vaku, bez vody a bez zátěže oběhu teplem.',
          },
          {
            name: 'Klasická a reflexní masáž',
            detail: 'Proti doprovodné svalové ztuhlosti trupu, krku a ramenního pletence; reflexní masáž předepisuje výhradně lékař.',
          },
          {
            name: 'Klimatoterapie a vedené procházky',
            detail: 'Chůze v terénu pod vedením, s postupně narůstající vzdáleností podle aktuální zátěžové kapacity.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Parkinsonova nemoc je samostatná položka VI/11 českého indikačního seznamu; přesnou délku hrazeného pobytu najdete na stránce Co hradí pojišťovna u neurologických onemocnění. Samoplátci volí délku po dohodě s lázeňským lékařem; jako odborné minimum balneoterapie platí alespoň 10 procedur během alespoň 10 dní. Pro roční období neexistuje lékařský předpis — v pozdním létě a na podzim bývá lázeňské město klidnější a cesty bezpečnější k chůzi než za náledí.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'V randomizované crossover studii s 31 pacienty s Parkinsonovou nemocí zlepšila třítýdenní lázeňská léčba čtyři týdny po pobytu kvalitu života (PDQ-39 a SF-36), část IV škály UPDRS a psychickou pohodu (GHQ-28); ve 20. týdnu už rozdíl patrný nebyl, efekt je tedy doložen jen krátkodobě (Brefel-Courbon a kol., 2003, Mov Disord; malý soubor). Scoping review k lázeňské rehabilitaci u neurodegenerativních onemocnění shrnuje tři studie k Parkinsonově nemoci, které popisují zlepšení motoriky, rovnováhy, kvality života a psychické pohody (Maccarone a kol., 2022, Int J Biometeorol; jen tři studie, omezená literatura). Žádná z těchto studií neprokazuje vliv na postup nemoci a žádná nenahrazuje neurologickou léčbu ani medikaci.',
        },
        physicianNote: 'O tom, zda a v jakém rozsahu pro vás při Parkinsonově nemoci připadá v úvahu lázeňský pobyt, rozhoduje lázeňský lékař při vstupní prohlídce podle neurologického nálezu a vaší medikace. Lázeňský pobyt doplňuje neurologickou léčbu a nenahrazuje ji ani předepsané léky. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        faqs: [
          {
            question: 'Hradí pojišťovna lázně při Parkinsonově nemoci?',
            answer: 'Parkinsonova nemoc je položka VI/11 českého indikačního seznamu; přesnou délku hrazeného pobytu i podmínky najdete na stránce Co hradí pojišťovna u neurologických onemocnění. Hosté s pojištěním mimo Česko si úhradu ověřují předem u vlastní pojišťovny; kdo si pobyt hradí sám, rezervuje ho přímo u lázeňského hotelu.',
          },
          {
            question: 'Co lázeňský pobyt při Parkinsonově nemoci přinese?',
            answer: 'Cílem je pohyblivost v běžném dni: jistá chůze, rovnováha, délka kroku a otáčení, k tomu uvolnění doprovodné svalové ztuhlosti. Randomizovaná crossover studie s 31 pacienty zjistila čtyři týdny po třítýdenním pobytu lepší kvalitu života a lepší psychickou pohodu, ve 20. týdnu už rozdíl patrný nebyl. Na postup nemoci podle dostupných studií lázeňský pobyt nepůsobí.',
          },
          {
            question: 'Od jakého stadia už lázeňský pobyt nemá smysl?',
            answer: 'Indikační seznam předpokládá, že host je schopen samostatné chůze a zvládá běžné denní úkony bez cizí pomoci. Kdo je odkázán na péči nebo se pro pokročilou demenci nemůže cvičit podle instrukcí, není přijat. O tom v jednotlivém případě rozhoduje lázeňský lékař při vstupní prohlídce.',
          },
          {
            question: 'Musím během pobytu vysadit léky?',
            answer: 'Ne, a svou doma předepsanou medikaci byste neměli měnit bez souhlasu svého lékaře ani během pobytu. U Parkinsonovy nemoci časy užívání léků dokonce určují průběh dne: procedury se plánují tak, aby pohybová terapie připadla na fáze s dobrou hybností. Vezměte si proto úplný seznam léků s časy užívání.',
          },
          {
            question: 'Může jet doprovázející osoba se mnou?',
            answer: 'Ano, doprovázející osoba může být ubytována ve stejném domě. Nenahrazuje to však podmínku indikačního seznamu, že host musí být schopen samostatné chůze a sebeobsluhy; lázeňský pobyt není pečovatelská služba.',
          },
        ],
        sources: [
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina VI — položka VI/11',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Parkinsonova nemoc, s typem péče a délkou pobytu.',
          },
          {
            title: 'Vyhláška č. 2/2015 Sb. o odborných kritériích lázeňské léčebně rehabilitační péče — skupina VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Úplné znění indikačního seznamu pro nemoci nervové včetně kontraindikací.',
          },
          {
            title: 'Brefel-Courbon C a kol. 2003, Mov Disord — randomizovaná crossover studie, 31 pacientů s Parkinsonovou nemocí',
            url: 'https://consensus.app/papers/details/a9e96b9dd21d545fbb2795b2537ed0d6/',
            note: 'Třítýdenní lázeňská léčba zlepšila čtyři týdny po pobytu kvalitu života, část IV UPDRS a psychickou pohodu; ve 20. týdnu už rozdíl patrný nebyl. Malý soubor.',
          },
          {
            title: 'Maccarone MC a kol. 2022, Int J Biometeorol — scoping review k lázeňské rehabilitaci u neurodegenerativních onemocnění',
            url: 'https://consensus.app/papers/details/6e6a5d578d1c52f9b0e1411ea6617dce/',
            note: 'Tři studie k Parkinsonově nemoci popisují lepší motoriku, rovnováhu a kvalitu života po lázeňské rehabilitaci; literatura je zatím omezená.',
          },
        ],
        related: [
          {
            label: 'Den mozku a nervového systému',
            href: '/cs/magazin/den-mozku-nervovy-system',
          },
          {
            label: 'Lázeňská léčba polyneuropatie',
            href: '/cs/lazenska-lecba/polyneuropatie',
          },
          {
            label: 'Pohyb v lázních prodlužuje život',
            href: '/cs/magazin/pohyb-v-laznich-prodluzuje-zivot',
          },
          {
            label: 'Co hradí pojišťovna u neurologických onemocnění',
            href: '/cs/lazne-s-pojistovnou/indikace/neurologicka-onemocneni',
          },
        ],
      },
      ru: {
        slug: 'bolezn-parkinsona',
        navLabel: 'Болезнь Паркинсона',
        title: 'Курортное лечение болезни Паркинсона в Марианских Лазнях',
        h1: 'Курортное лечение при болезни Паркинсона',
        metaTitle: 'Лечение болезни Паркинсона — Марианские Лазни | Marienbad.com',
        metaDescription: 'Курортное лечение болезни Паркинсона в Марианских Лазнях: тренировка ходьбы и равновесия, лечебная физкультура в воде, углекислые ванны — ход лечения и сроки.',
        lead: 'Болезнь Паркинсона выделена в отдельную позицию чешского индикационного списка, и в Марианских Лазнях её лечат как реабилитационное пребывание: с ежедневной тренировкой ходьбы и равновесия, двигательной терапией в тёплой воде и процедурами из местных лечебных средств. Курортное лечение дополняет неврологическую терапию, а не заменяет её.',
        teaser: 'Тренировка ходьбы и равновесия, упражнения в воде и углекислые ванны — как дополнение к неврологическому лечению.',
        treats: [
          'Болезнь Паркинсона на стадии, когда самостоятельная ходьба и самообслуживание ещё возможны',
          'Неустойчивость при ходьбе, укороченная длина шага и заторможенность при начале движения в повседневной жизни',
          'Нарушения равновесия с повышенным риском падений',
          'Мышечная скованность и болезненное напряжение туловища и плеч',
          'Снижение физической выносливости и отказ от движения',
        ],
        notFor: [
          'Невозможность ходить без посторонней помощи и самостоятельно выполнять повседневные действия — индикационный список требует и того, и другого',
          'Выраженная деменция или спутанность сознания, делающая занятия по инструкции невозможными',
          'Острое заболевание, нелеченая сердечная недостаточность или свежая травма',
          'Эпилепсия, а также зависимость от алкоголя или других психоактивных веществ',
          'Беременность',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает неврологическое заключение и текущую медикацию, проверяет походку, равновесие и выносливость и только после этого составляет план процедур. Возьмите с собой последнее заключение вашего невролога и полный список лекарств — время их приёма определяет, когда имеет смысл проводить занятия.',
          },
          {
            heading: 'Первая неделя: найти ритм',
            body: 'Процедуры выстраивают вокруг времени действия лекарств, чтобы двигательная терапия приходилась на фазы наибольшей подвижности. Упражнения на ходьбу и равновесие начинаются с простых последовательностей; в воде шаги и повороты даются легче, потому что выталкивающая сила снимает риск падения.',
          },
          {
            heading: 'Вторая неделя: увеличение нагрузки',
            body: 'К этому добавляются длина шага, смена темпа и смена направления, а также тренировка повседневных ситуаций: подъём со стула, разворот, проход через дверь. Бальнеологические процедуры, такие как углекислые ванны и массаж, снимают сопутствующую мышечную скованность.',
          },
          {
            heading: 'Заключительное обследование и план на дом',
            body: 'В завершение походка и равновесие оцениваются повторно и фиксируются письменно. Вы получаете программу упражнений на дом; без регулярных занятий достигнутый результат не сохраняется.',
          },
        ],
        procedures: [
          {
            name: 'Индивидуальная физиотерапия',
            detail: 'Ежедневно, с акцентом на походку, длину шага, выпрямление осанки и безопасный разворот.',
          },
          {
            name: 'Школа равновесия и ходьбы',
            detail: 'Упражнения на устойчивость, перенос веса тела и смену направления движения, чтобы снизить риск падений в повседневной жизни.',
          },
          {
            name: 'Двигательная терапия в бассейне',
            detail: 'Выталкивающая сила тёплой воды позволяет выполнять движения, которые на суше были бы слишком небезопасны, и снимает страх падения.',
          },
          {
            name: 'Групповые занятия',
            detail: 'Занятия под руководством инструктора с гостями со схожим диагнозом, включающие дыхательную технику и упражнения на осанку и подвижность.',
          },
          {
            name: 'Углекислая ванна в минеральной воде',
            detail: 'Ванна при температуре около 34 °C; углекислый газ, проникающий через кожу из воды, улучшает кровоснабжение кожи и назначается для расслабления.',
          },
          {
            name: 'Сухая газовая ванна в марианском газе',
            detail: 'Применение природного углекислого газа источника Марии в герметичном мешке — без воды и без нагрузки на кровообращение от тепла.',
          },
          {
            name: 'Классический и рефлекторный массаж',
            detail: 'Против сопутствующей мышечной скованности туловища, шеи и плечевого пояса; рефлекторный массаж назначает исключительно врач.',
          },
          {
            name: 'Климатотерапия и прогулки под руководством инструктора',
            detail: 'Ходьба по местности под руководством инструктора, с постепенно увеличивающейся дистанцией в соответствии с текущей выносливостью.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'Болезнь Паркинсона выделена в отдельную позицию чешского индикационного списка (VI/11). Для пребываний, оплачиваемых чешской страховой, предусмотрено 21 день комплексного курортного лечения, а для повторного пребывания — также 21 день комплексного лечения; долевой позиции список здесь не предусматривает. Гости, оплачивающие лечение самостоятельно, согласуют срок с курортным врачом; профессиональным минимумом бальнеотерапии считается не менее 10 процедур за не менее чем 10 дней. Для времени года медицинских рекомендаций нет — в конце лета и осенью курорт спокойнее, а дороги безопаснее для ходьбы, чем при обледенении.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'В рандомизированном перекрёстном исследовании с 31 пациентом с болезнью Паркинсона трёхнедельное курортное лечение через четыре недели после его завершения улучшило качество жизни (по шкалам PDQ-39 и SF-36), часть IV шкалы UPDRS и психическое самочувствие (по GHQ-28); к 20-й неделе разница уже не была обнаружима, то есть эффект подтверждён только в краткосрочной перспективе (Brefel-Courbon et al., 2003, Mov Disord; небольшая выборка). Скопинг-обзор по курортной реабилитации при нейродегенеративных заболеваниях обобщает три исследования по болезни Паркинсона, которые описывают улучшение моторики, равновесия, качества жизни и психического самочувствия (Maccarone et al., 2022, Int J Biometeorol; только три исследования, ограниченная литература). Ни одно из этих исследований не показывает влияния на прогрессирование заболевания, и ни одно не заменяет неврологическое лечение или медикаментозную терапию.',
        },
        physicianNote: 'Возможно ли и в каком объёме курортное лечение при вашей болезни Паркинсона, решает курортный врач при первичном осмотре на основании неврологического заключения и вашей медикации. Курортное пребывание дополняет неврологическое лечение и не заменяет ни его, ни назначенные лекарства. Эта страница носит информационный характер и не заменяет консультацию врача.',
        faqs: [
          {
            question: 'Оплачивается ли курортное лечение при болезни Паркинсона?',
            answer: 'Болезнь Паркинсона стоит как позиция VI/11 чешского индикационного списка: для застрахованных в чешской страховой компании предусмотрено 21 день комплексного курортного лечения, при повторном пребывании — также 21 день. Гости со страховкой за пределами Чехии заранее уточняют возможность возмещения у своего страховщика; те, кто оплачивает лечение самостоятельно, бронируют пребывание напрямую в курортном отеле.',
          },
          {
            question: 'Что даёт курортное лечение при болезни Паркинсона?',
            answer: 'Цель — подвижность в повседневной жизни: безопасная ходьба, равновесие, длина шага и разворот, а также снятие сопутствующей мышечной скованности. Рандомизированное перекрёстное исследование с 31 пациентом обнаружило через четыре недели после трёхнедельного курортного лечения улучшение качества жизни и психического самочувствия, к 20-й неделе разница уже не была обнаружима. На прогрессирование заболевания курортное лечение, согласно имеющимся исследованиям, не влияет.',
          },
          {
            question: 'С какой стадии курортное лечение уже не имеет смысла?',
            answer: 'Индикационный список требует, чтобы гость мог самостоятельно ходить и выполнять повседневные действия без посторонней помощи. Тем, кто нуждается в постоянном уходе или из-за выраженной деменции не может заниматься по инструкции, лечение не назначается. Решение в каждом отдельном случае принимает курортный врач при первичном осмотре.',
          },
          {
            question: 'Нужно ли отменять лекарства во время курортного лечения?',
            answer: 'Нет, и вам не следует менять назначенную дома медикацию без согласия вашего врача. При болезни Паркинсона время приёма лекарств даже определяет ход лечения: процедуры выстраивают так, чтобы двигательная терапия приходилась на фазы наибольшей подвижности. Поэтому возьмите с собой полный список лекарств с указанием времени приёма.',
          },
          {
            question: 'Может ли приехать сопровождающее лицо?',
            answer: 'Да, сопровождающее лицо может быть размещено в том же отеле. Однако это не заменяет требование индикационного списка о том, что гость должен сам ходить и обслуживать себя; курортное лечение не является услугой по уходу.',
          },
        ],
        sources: [
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа VI — позиция VI/11',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Болезнь Паркинсона: 21 день комплексного курортного лечения как базовое пребывание, 21 день комплексного лечения при повторном пребывании; долевой позиции нет.',
          },
          {
            title: 'Постановление № 2/2015 Сб. о профессиональных критериях курортной реабилитационной помощи — группа VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Полный текст индикационного списка для нервных заболеваний, включая общие противопоказания. Текст на чешском языке.',
          },
          {
            title: 'Brefel-Courbon C et al. 2003, Mov Disord — рандомизированное перекрёстное исследование, 31 пациент с болезнью Паркинсона',
            url: 'https://consensus.app/papers/details/a9e96b9dd21d545fbb2795b2537ed0d6/',
            note: 'Трёхнедельное курортное лечение через четыре недели после завершения улучшило качество жизни, часть IV шкалы UPDRS и психическое самочувствие; к 20-й неделе разницы уже не было. Небольшая выборка.',
          },
          {
            title: 'Maccarone MC et al. 2022, Int J Biometeorol — скопинг-обзор по курортной реабилитации при нейродегенеративных заболеваниях',
            url: 'https://consensus.app/papers/details/6e6a5d578d1c52f9b0e1411ea6617dce/',
            note: 'Три исследования по болезни Паркинсона описывают улучшение моторики, равновесия и качества жизни после курортной реабилитации; литература пока ограничена.',
          },
        ],
        related: [
          {
            label: 'День мозга и нервной системы',
            href: '/ru/zhurnal/den-mozga-nervnaya-sistema',
          },
          {
            label: 'Курортное лечение полинейропатии',
            href: '/ru/kurortnoe-lechenie/polinejropatiya',
          },
          {
            label: 'Движение на курорте',
            href: '/ru/zhurnal/dvizhenie-v-kurorte',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'nerve-root',
    groupId: 'nervous',
    roman: 'VI',
    codes: [
      'VI/3',
    ],
    conditionName: 'Radiculopathy',
    icd10: 'M54.1',
    image: '/images/library/treatments/co2-therapy-back-probe.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Ärztin setzt entlang der Wirbelsäule eine Gasinjektion mit natürlichem Kohlendioxid',
      en: 'A doctor giving a gas injection of natural carbon dioxide alongside the spine',
      cs: 'Lékařka podává podél páteře plynovou injekci s přírodním oxidem uhličitým',
      ru: 'Врач делает инъекцию природного углекислого газа вдоль позвоночника',
    },
    content: {
      de: {
        slug: 'nervenwurzel-und-ischias',
        navLabel: 'Ischias und Nervenwurzel',
        title: 'Kur bei Ischias und Nervenwurzelreizung in Marienbad',
        h1: 'Kur bei Ischias und gereizter Nervenwurzel',
        metaTitle: 'Kur bei Ischias in Marienbad — Anwendungen und Dauer',
        metaDescription: 'Kur bei Ischias und Nervenwurzelreizung in Marienbad: Gasinjektionen, Moorpackungen, Elektrotherapie und Rückenschule — Ablauf und Dauer.',
        lead: 'Wenn der Schmerz nicht im Rücken bleibt, sondern ins Bein oder in den Arm zieht, und Taubheit, Kribbeln oder Kraftverlust dazukommen, liegt das an der Nervenwurzel. Die tschechische Indikationsliste führt solche Wurzelsyndrome unter den Nervenkrankheiten — in einer eigenen Gruppe, getrennt vom gewöhnlichen Rückenschmerz.',
        teaser: 'Wurzelsyndrome mit Reiz- und Ausfallerscheinungen: Gasinjektionen, Moor, Elektrotherapie und tägliche Physiotherapie.',
        treats: [
          'Wurzelsyndrom mit Reiz- und Ausfallerscheinungen, lumbal wie zervikal',
          'Ischiasschmerz, der vom Kreuz über das Gesäß ins Bein zieht',
          'Zervikobrachiales Syndrom mit Ausstrahlung in Schulter, Arm und Hand',
          'Taubheit, Kribbeln oder Kraftverlust im Versorgungsgebiet der betroffenen Wurzel',
          'Schonhaltung und muskuläre Verspannung, die sich um den Wurzelschmerz herum aufgebaut haben',
        ],
        notFor: [
          'Akutes Kaudasyndrom, fortschreitende Lähmung oder Blasen- und Mastdarmstörung — das gehört sofort in die Klinik, nicht in die Kur',
          'Unabgeklärter Wurzelschmerz ohne neurologischen Befund und ohne Bildgebung',
          'Frische Operationswunde ohne abgeschlossene Wundheilung',
          'Akute Erkrankungen, Schwangerschaft sowie Unfähigkeit zur selbstständigen Versorgung',
          'Epilepsie sowie Abhängigkeit von Alkohol oder anderen Suchtmitteln',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt prüft den neurologischen Befund, die Reflexe, die Kraft und das Gefühl im betroffenen Bein oder Arm und sichtet die mitgebrachte Bildgebung. Erst danach steht fest, welche Anwendungen infrage kommen; ohne den Befund Ihres Neurologen oder Orthopäden fällt der Plan vorsichtiger aus.',
          },
          {
            heading: 'Erste Woche: Schmerz und Verspannung lösen',
            body: 'Zunächst geht es um die Entlastung: Moorpackungen und Elektrotherapie gegen die muskuläre Verspannung, Gasinjektionen entlang der betroffenen Segmente, dazu Physiotherapie ohne Belastung der gereizten Wurzel.',
          },
          {
            heading: 'Zweite Woche: Beweglichkeit und Ansteuerung',
            body: 'Mit nachlassendem Schmerz kommen Mobilisation, Rückenschule und gezieltes Training der abgeschwächten Muskulatur dazu. Im Wasser lassen sich Bewegungen üben, die an Land noch schmerzen.',
          },
          {
            heading: 'Abschlussuntersuchung und Plan für zu Hause',
            body: 'Der Befund wird erneut erhoben und schriftlich festgehalten. Sie erhalten ein Übungsprogramm und Hinweise zur Haltung bei der Arbeit; ohne das bleibt die Entlastung nicht bestehen.',
          },
        ],
        procedures: [
          {
            name: 'Gasinjektionen mit Mariengas',
            detail: 'Unter die Haut gesetzte Injektionen des natürlichen Kohlendioxids entlang der Wirbelsäule; sie werden in Marienbad seit langem bei Beschwerden der Wirbelsäule und der Gelenke eingesetzt und ausschließlich vom Arzt verordnet.',
          },
          {
            name: 'Moorpackung',
            detail: 'Wärmeintensive Anwendung bei bis zu 40 °C auf die verspannte Region; sie ist eine Belastung für Kreislauf und Herz und wird nur nach ärztlicher Entscheidung verordnet.',
          },
          {
            name: 'Elektrotherapie',
            detail: 'Diadynamische und Interferenzströme zur Schmerzlinderung und Lösung der begleitenden Muskelverspannung.',
          },
          {
            name: 'Einzelphysiotherapie',
            detail: 'Täglich, mit Mobilisation, Entlastungsstellungen und gezieltem Aufbau der abgeschwächten Muskulatur.',
          },
          {
            name: 'Rückenschule in der Gruppe',
            detail: 'Übungen für Haltung, Beckenstellung und die Stabilisierung der Lendenwirbelsäule, dazu die richtige Atemtechnik.',
          },
          {
            name: 'Bewegungstherapie im Becken',
            detail: 'Der Auftrieb nimmt Last von der Wirbelsäule, sodass Bewegungsumfänge geübt werden können, die an Land noch schmerzen.',
          },
          {
            name: 'Kohlensäurebad im Mineralwasser',
            detail: 'Bad bei rund 34 °C aus dem örtlichen Mineralwasser; es fördert die Hautdurchblutung und wird zur Lockerung verordnet.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Wurzelsyndrome mit Reiz- und Ausfallerscheinungen stehen als Position VI/3 unter den Nervenkrankheiten. Für Aufenthalte, die eine tschechische Krankenkasse trägt, sind 21 Tage komplexe Kurbehandlung als Grundaufenthalt vorgesehen; beim Wiederholungsaufenthalt sind es 21 Tage als Zuschussbehandlung, in bestimmten Fällen 14. Geht es dagegen um chronischen Rückenschmerz ohne Wurzelbeteiligung oder um den Zustand nach einer Bandscheibenoperation, greifen die Positionen VII/9 und VII/11 aus der Gruppe der Bewegungsorgane — dafür ist die Seite zu Wirbelsäulenbeschwerden zuständig. Selbstzahler stimmen die Dauer mit dem Kurarzt ab; als fachliche Untergrenze gelten mindestens 10 Anwendungen über mindestens 10 Tage.',
        },
        physicianNote: 'Ob und in welcher Form eine Kur bei Ihrem Wurzelsyndrom infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand des neurologischen Befunds und der Bildgebung. Eine fortschreitende Lähmung oder eine Blasen- und Mastdarmstörung ist ein Notfall und gehört umgehend in ärztliche Behandlung, nicht in eine Kurplanung. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        ongoing: {
          heading: 'Erfahrung und laufende Forschung',
          body: 'Gasinjektionen mit Mariengas, Moorpackungen und tägliche Physiotherapie werden in Marienbad bei Wurzelsyndromen seit langem eingesetzt; der Kurarzt stellt sie nach dem neurologischen Befund und aus klinischer Erfahrung zusammen. Wie es dem einzelnen Gast dabei ergeht, bleibt nicht ungeprüft: Jeder Behandlungsaufenthalt beginnt mit einer Eingangs- und endet mit einer Abschlussuntersuchung samt schriftlichem Abschlussbericht, sodass der Verlauf dokumentiert ist und der Kurarzt den Plan unterwegs anpassen kann. Für die Kurmedizin als Fach entsteht derzeit erstmals seit Langem systematische Evidenz. Das Institut lázeňství a balneologie, v.v.i., die 2019 vom Karlsbader Kreis gegründete Forschungseinrichtung für Kurwesen und Balneologie, führt seit 2026 gemeinsam mit den Léčebné lázně Mariánské Lázně die erste klinische Studie dieses Formats seit dreißig Jahren durch. Sie betrifft urologische und nephrologische Diagnosen, nicht die auf dieser Seite beschriebene: Mehr als hundert Patienten werden vor und nach dem Kuraufenthalt auf Gesundheitszustand und Lebensqualität untersucht, fachlicher Garant ist prim. MUDr. Ladislav Špišák, CSc.; Ergebnisse liegen noch nicht vor. Die Studie läuft im Projekt Zentrum für Kurforschung (2024 bis 2027), das aus dem Operationellen Programm Gerechter Übergang finanziert wird und mit der Tschechischen Technischen Universität, der Westböhmischen Universität und der Akademie der Wissenschaften der Tschechischen Republik zusammenarbeitet. Was dabei herauskommen kann, zeigt die frühere Zusammenarbeit desselben Instituts mit den Marienbader Kurhäusern: Die gemeinsame Studie zur Kurrehabilitation nach COVID-19 erhielt 2021 den Innovation Award der European Spas Association in der Kategorie Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Hilft eine Kur bei Ischias?',
            answer: 'Wurzelsyndrome mit Reiz- und Ausfallerscheinungen sind eine eigene Position der tschechischen Indikationsliste (VI/3), und Marienbad behandelt sie regelmäßig: mit Gasinjektionen, Moorpackungen, Elektrotherapie und täglicher Physiotherapie unter ärztlicher Kontrolle. Ziel sind weniger Schmerz, mehr Beweglichkeit und die Ansteuerung der abgeschwächten Muskulatur. Über die Zusammenstellung entscheidet der Kurarzt nach der Eingangsuntersuchung.',
          },
          {
            question: 'Was ist der Unterschied zur Kur bei Wirbelsäulenbeschwerden?',
            answer: 'Die Zuordnung richtet sich nach dem Befund. Ist die Nervenwurzel beteiligt — Schmerz zieht ins Bein oder in den Arm, dazu Taubheit, Kribbeln oder Kraftverlust —, gilt Position VI/3 aus der Gruppe der Nervenkrankheiten. Chronischer Rückenschmerz funktionellen Ursprungs ohne Wurzelbeteiligung und der Zustand nach einer Bandscheibenoperation fallen dagegen unter VII/9 und VII/11 bei den Bewegungsorganen. Welche Position zutrifft, entscheidet der Arzt.',
          },
          {
            question: 'Wann darf ich nach einer Bandscheibenoperation zur Kur?',
            answer: 'Erst wenn die Wunde verheilt ist und der Operateur die Belastung freigegeben hat. Der Zustand nach einer Operation an den Bandscheiben läuft dann über Position VII/11 bei den Bewegungsorganen, nicht über VI/3. Bringen Sie den Operationsbericht und die Freigabe mit — ohne sie fällt der Anwendungsplan deutlich vorsichtiger aus.',
          },
          {
            question: 'Sind Gasinjektionen schmerzhaft?',
            answer: 'Es sind Injektionen unter die Haut, also ein kurzer Einstich; das Gas verteilt sich anschließend im Gewebe und kann für kurze Zeit ein Spannungsgefühl machen. Sie werden ausschließlich vom Arzt verordnet und in Marienbad mit dem natürlichen Kohlendioxid der Marienquelle gesetzt. Wenn Sie eine Anwendung nicht vertragen, sagen Sie es Ihrem Kurarzt, damit der Plan geändert wird.',
          },
          {
            question: 'Wie lange dauert eine Kur bei einem Wurzelsyndrom?',
            answer: 'Für Versicherte einer tschechischen Krankenkasse sieht Position VI/3 einen Grundaufenthalt von 21 Tagen komplexer Kurbehandlung vor; der Wiederholungsaufenthalt läuft über 21 Tage als Zuschussbehandlung, in bestimmten Fällen über 14. Selbstzahler wählen die Dauer nach Absprache mit dem Kurarzt, wobei mindestens 10 Anwendungen über mindestens 10 Tage als fachliche Untergrenze gelten.',
          },
        ],
        sources: [
          {
            title: 'Klinische Studie zu den objektiven Wirkungen der komplexen Kurbehandlung bei urologischen und nephrologischen Diagnosen (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Laufende Studie des Instituts lázeňství a balneologie mit den Léčebné lázně Mariánské Lázně, mehr als hundert Patienten, Beginn 2026. Sie betrifft urologische und nephrologische Diagnosen; Ergebnisse liegen noch nicht vor.',
          },
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe VI — Position VI/3',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Wurzelsyndrome mit Reiz- und Ausfallerscheinungen: Grundaufenthalt 21 Tage komplexe Kurbehandlung, Wiederholungsaufenthalt 21 Tage Zuschussbehandlung (in bestimmten Fällen 14).',
          },
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe VII — Positionen VII/9 und VII/11',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Abgrenzung: chronischer vertebragener Schmerz funktionellen Ursprungs und Zustände nach Bandscheibenoperationen laufen über die Bewegungsorgane, nicht über die Nervenkrankheiten.',
          },
          {
            title: 'Verordnung Nr. 2/2015 Slg. über die fachlichen Kriterien der kurmedizinischen Rehabilitationspflege — Gruppe VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Vollständiger Wortlaut der Indikationsliste für Nervenkrankheiten samt Kontraindikationen und geforderter Eingangsuntersuchungen. Tschechischer Text.',
          },
        ],
        related: [
          {
            label: 'Kur bei Wirbelsäulenbeschwerden',
            href: '/de/kur-bei/wirbelsaeule',
          },
          {
            label: 'Gasinjektionen mit Mariengas',
            href: '/de/magazin/gas-injektionen-co2',
          },
          {
            label: 'CO2-Therapie in Marienbad',
            href: '/de/co2-therapie',
          },
          {
            label: 'Indikationen und Kontraindikationen',
            href: '/de/indikationen-und-kontraindikationen',
          },
        ],
      },
      en: {
        slug: 'sciatica-and-nerve-root',
        navLabel: 'Sciatica and nerve root',
        title: 'Spa treatment for sciatica and nerve root irritation in Marienbad',
        h1: 'Spa treatment for sciatica and an irritated nerve root',
        metaTitle: 'Spa treatment for sciatica in Marienbad — treatments, duration',
        metaDescription: 'Spa treatment for sciatica and nerve root irritation in Marienbad: gas injections, peat packs, electrotherapy and back school — course and duration.',
        lead: 'When the pain does not stay in the back but travels into the leg or arm, and numbness, tingling or loss of strength appear as well, the cause lies in the nerve root. The Czech indication list places such root syndromes among the nervous system diseases — in a separate group, distinct from ordinary back pain.',
        teaser: 'Root syndromes with irritative and deficit symptoms: gas injections, peat, electrotherapy and daily physiotherapy.',
        treats: [
          'Root syndrome with irritative and deficit symptoms, both lumbar and cervical',
          'Sciatic pain that travels from the lower back through the buttock into the leg',
          'Cervicobrachial syndrome radiating into the shoulder, arm and hand',
          'Numbness, tingling or loss of strength in the area supplied by the affected nerve root',
          'Protective posture and muscular tension that have built up around the root pain',
        ],
        notFor: [
          'Acute cauda equina syndrome, progressive paralysis, or bladder and bowel dysfunction — this needs immediate hospital care, not a spa cure',
          'Unassessed root pain without a neurological work-up and without imaging',
          'A fresh surgical wound without completed healing',
          'Acute illness, pregnancy, or an inability to manage personal care independently',
          'Epilepsy, and dependence on alcohol or other addictive substances',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: 'The spa physician checks the neurological findings, reflexes, strength and sensation in the affected leg or arm, and reviews any imaging you bring. Only then is it clear which treatments are appropriate; without the findings from your neurologist or orthopaedist, the plan is more cautious.',
          },
          {
            heading: 'First week: relieving pain and tension',
            body: 'The first priority is relief: peat packs and electrotherapy against the muscular tension, gas injections along the affected segments, plus physiotherapy that avoids loading the irritated nerve root.',
          },
          {
            heading: 'Second week: mobility and muscle control',
            body: 'As the pain eases, mobilisation, back school and targeted training of the weakened muscles are added. In water, movements can be practised that would still hurt on dry land.',
          },
          {
            heading: 'Final examination and a plan for home',
            body: 'The findings are assessed again and recorded in writing. You receive an exercise programme and advice on posture at work; without it, the relief does not last.',
          },
        ],
        procedures: [
          { name: 'Gas injections with Mariengas', detail: 'Injections of natural carbon dioxide placed under the skin along the spine; they have long been used in Marienbad for complaints of the spine and joints, and are prescribed only by the physician.' },
          { name: 'Peat pack', detail: 'A heat-intensive application at up to 40°C on the tense area; it places a strain on the circulation and heart and is prescribed only after an individual medical decision.' },
          { name: 'Electrotherapy', detail: 'Diadynamic and interferential currents for pain relief and to loosen the accompanying muscle tension.' },
          { name: 'Individual physiotherapy', detail: 'Daily, with mobilisation, relieving positions and targeted strengthening of the weakened muscles.' },
          { name: 'Group back school', detail: 'Exercises for posture, pelvic position and stabilising the lumbar spine, together with correct breathing technique.' },
          { name: 'Exercise therapy in the pool', detail: 'Buoyancy takes the load off the spine, so ranges of movement can be practised that would still hurt on dry land.' },
          { name: 'Carbon dioxide bath in mineral water', detail: 'A bath at around 34°C in the local mineral water; it promotes skin blood flow and is prescribed to relax tense muscles.' },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'Root syndromes with irritative and deficit symptoms are position VI/3 among the nervous system diseases. For stays covered by Czech public health insurance, 21 days of comprehensive spa care are provided for as the initial stay; a repeat stay runs to 21 days of contributory care, in certain cases 14. Where the issue is instead chronic back pain without nerve-root involvement, or the condition after disc surgery, positions VII/9 and VII/11 from the musculoskeletal group apply — that is covered by the page on spine and back pain. Self-paying guests agree the length with the spa physician; the professional minimum is at least 10 treatments over at least 10 days.',
        },
        physicianNote: 'Whether and in what form a spa cure is appropriate for your root syndrome is decided by the spa physician at the initial examination, based on the neurological findings and imaging. Progressive paralysis or bladder and bowel dysfunction is an emergency and requires immediate medical treatment, not spa planning. This page provides information and does not replace medical advice.',
        ongoing: {
          heading: 'Experience and research under way',
          body: 'Gas injections with Maria’s gas, peat wraps and daily physiotherapy have long been used in Marienbad for root syndromes; the spa physician puts them together according to the neurological findings and from clinical experience. How the individual guest fares is not left unchecked: every treatment stay begins with an initial and ends with a final medical examination and a written final report, so the course is documented and the spa physician can adjust the plan along the way. Systematic evidence for spa medicine as a field is being built for the first time in a long while. The Institute of Spa Medicine and Balneology (Institut lázeňství a balneologie, v.v.i.), founded by the Karlovy Vary Region in 2019, has been running the first clinical study of this format in thirty years since 2026, together with Léčebné lázně Mariánské Lázně. It covers urological and nephrological diagnoses rather than the one described on this page: more than a hundred patients are examined before and after the spa stay for health status and quality of life, with prim. MUDr. Ladislav Špišák, CSc. as professional guarantor, and results are not yet available. The study runs within the Spa Research Centre project (2024 to 2027), funded by the Just Transition Operational Programme and working with the Czech Technical University, the University of West Bohemia and the Czech Academy of Sciences. What such work can produce is shown by the same institute’s earlier collaboration with the Marienbad spa houses: their joint study of spa rehabilitation after COVID-19 received the European Spas Association Innovation Award in 2021 in the Medical Spa Scientific Research category.',
        },
        faqs: [
          {
            question: 'Does a spa cure help with sciatica?',
            answer: 'Root syndromes with irritative and deficit symptoms are a separate position on the Czech indication list (VI/3), and Marienbad treats them regularly: with gas injections, peat packs, electrotherapy and daily physiotherapy under medical supervision. The goals are less pain, more mobility and better control of the weakened muscles. The spa physician decides on the combination after the initial examination.',
          },
          {
            question: 'What is the difference from spa treatment for spine and back pain?',
            answer: 'The classification depends on the findings. If the nerve root is involved — pain travelling into the leg or arm, together with numbness, tingling or loss of strength — position VI/3 from the nervous system group applies. Chronic back pain of functional origin without nerve-root involvement, and the condition after disc surgery, instead fall under VII/9 and VII/11 in the musculoskeletal group. The physician decides which position applies.',
          },
          {
            question: 'When can I go for a spa cure after disc surgery?',
            answer: 'Only once the wound has healed and the surgeon has cleared you for exertion. The condition after disc surgery is then covered under position VII/11 in the musculoskeletal group, not under VI/3. Bring the surgical report and the clearance with you — without them, the treatment plan is markedly more cautious.',
          },
          {
            question: 'Are gas injections painful?',
            answer: 'They are injections under the skin, so a brief prick; the gas then spreads through the tissue and can produce a feeling of tension for a short time. They are prescribed only by the physician and given in Marienbad with the natural carbon dioxide of the Marien Spring. If you do not tolerate a treatment well, tell your spa physician so the plan can be changed.',
          },
          {
            question: 'How long does a spa cure for a root syndrome last?',
            answer: 'For people insured with a Czech health fund, position VI/3 provides for an initial stay of 21 days of comprehensive spa care; a repeat stay runs to 21 days of contributory care, in certain cases 14. Self-paying guests choose the length in consultation with the spa physician, with at least 10 treatments over at least 10 days as the professional minimum.',
          },
        ],
        sources: [
          {
            title: 'Clinical study of the objective effects of comprehensive spa care in kidney and urological conditions (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Ongoing study by the Institute of Spa Medicine and Balneology with Léčebné lázně Mariánské Lázně, more than a hundred patients, started 2026. It covers urological and nephrological diagnoses; results are not yet available.',
          },
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group VI — position VI/3',
            url: '/en/indications-and-contraindications',
            note: 'Root syndromes with irritative and deficit symptoms: initial stay 21 days of comprehensive spa care, repeat stay 21 days of contributory care (14 in certain cases).',
          },
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group VII — positions VII/9 and VII/11',
            url: '/en/indications-and-contraindications',
            note: 'Boundary: chronic vertebrogenic pain of functional origin and conditions after disc surgery are covered under the musculoskeletal group, not the nervous system group.',
          },
          {
            title: 'Decree No. 2/2015 Coll. on the professional criteria for spa medical rehabilitation care — Group VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Full text of the indication list for nervous system diseases, including contraindications and required initial examinations. Czech-language text.',
          },
        ],
        related: [
          { label: 'Spa treatment for spine and back pain', href: '/en/spa-treatment-for/spine-and-back-pain' },
          { label: 'CO₂ gas injections', href: '/en/magazine/co2-gas-injections' },
          { label: 'CO₂ therapy', href: '/en/co2-therapy' },
          { label: 'Indications and contraindications', href: '/en/indications-and-contraindications' },
        ],
      },
      cs: {
        slug: 'ischias-a-korenovy-syndrom',
        navLabel: 'Ischias a kořenový syndrom',
        title: 'Lázeňská léčba ischiasu a kořenového syndromu v Mariánských Lázních',
        h1: 'Lázeňská léčba ischiasu a dráždění nervového kořene',
        metaTitle: 'Léčba ischiasu v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Lázeňská léčba ischiasu a kořenového syndromu v Mariánských Lázních: plynové injekce, slatinné zábaly, elektroléčba a škola zad — průběh a délka pobytu.',
        lead: 'Když bolest nezůstává v zádech, ale táhne do nohy nebo do ruky, a přidá se necitlivost, brnění nebo ubývání síly, jde o nervový kořen. Český indikační seznam vede takové kořenové syndromy mezi nemocemi nervovými — v samostatné skupině, odděleně od běžné bolesti zad.',
        teaser: 'Kořenový syndrom s iritačně-zánikovými projevy: plynové injekce, slatina, elektroléčba a denní fyzioterapie.',
        treats: [
          'Kořenový syndrom s iritačně-zánikovými projevy, lumbální i cervikální',
          'Ischiatická bolest táhnoucí od kříže přes hýždě do nohy',
          'Cervikobrachiální syndrom s vyzařováním do ramene, paže a ruky',
          'Necitlivost, brnění nebo ubývání síly v oblasti postiženého kořene',
          'Úlevové držení těla a svalové napětí, které se kolem kořenové bolesti vytvořilo',
        ],
        notFor: [
          'Akutní syndrom kaudy, postupující ochrnutí nebo porucha funkce močového měchýře a konečníku — to patří okamžitě do nemocnice, ne do lázní',
          'Nevyjasněná kořenová bolest bez neurologického nálezu a bez zobrazovacího vyšetření',
          'Čerstvá operační rána bez zhojení',
          'Akutní onemocnění, těhotenství a neschopnost sebeobsluhy',
          'Epilepsie a závislost na alkoholu či jiných návykových látkách',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař vyšetří neurologický nález, reflexy, sílu a citlivost postižené nohy nebo paže a prohlédne přinesené zobrazovací vyšetření. Až poté je jasné, které procedury přicházejí v úvahu; bez nálezu vašeho neurologa nebo ortopeda vyjde plán opatrněji.',
          },
          {
            heading: 'První týden: uvolnění bolesti a napětí',
            body: 'Nejprve jde o odlehčení: slatinné zábaly a elektroléčba proti svalovému napětí, plynové injekce podél postižených segmentů, k tomu fyzioterapie bez zatížení drážděného kořene.',
          },
          {
            heading: 'Druhý týden: pohyblivost a nácvik',
            body: 'S ustupující bolestí přibývá mobilizace, škola zad a cílený trénink ochabnutého svalstva. Ve vodě lze cvičit pohyby, které na suchu ještě bolí.',
          },
          {
            heading: 'Závěrečná prohlídka a plán pro doma',
            body: 'Nález se znovu vyšetří a písemně zaznamená. Dostanete cvičební program a pokyny k držení těla při práci; bez toho se odlehčení neudrží.',
          },
        ],
        procedures: [
          {
            name: 'Plynové injekce Mariiným plynem',
            detail: 'Injekce přírodního oxidu uhličitého podávané podkožně podél páteře; v Mariánských Lázních se dlouho používají u potíží páteře a kloubů a předepisuje je výhradně lékař.',
          },
          {
            name: 'Slatinný zábal',
            detail: 'Tepelně náročná procedura při teplotě až 40 °C na napjatou oblast; je zátěží pro oběh a srdce a předepisuje se jen po individuálním rozhodnutí lékaře.',
          },
          {
            name: 'Elektroléčba',
            detail: 'Diadynamické a interferenční proudy ke zmírnění bolesti a uvolnění doprovodného svalového napětí.',
          },
          {
            name: 'Individuální fyzioterapie',
            detail: 'Denně, s mobilizací, úlevovými polohami a cíleným posilováním ochablého svalstva.',
          },
          {
            name: 'Škola zad ve skupině',
            detail: 'Cvičení na držení těla, postavení pánve a stabilizaci bederní páteře, k tomu správná dechová technika.',
          },
          {
            name: 'Pohybová terapie v bazénu',
            detail: 'Vztlak snímá zátěž z páteře, takže lze trénovat rozsah pohybu, který na suchu ještě bolí.',
          },
          {
            name: 'Uhličitá koupel z minerální vody',
            detail: 'Koupel při zhruba 34 °C z místní minerální vody; podporuje prokrvení kůže a předepisuje se k uvolnění.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Kořenové syndromy s iritačně-zánikovými projevy jsou položka VI/3 mezi nemocemi nervovými; přesnou délku hrazeného pobytu najdete na stránce Co hradí pojišťovna u neurologických onemocnění. Pokud jde naopak o chronickou bolest zad bez postižení kořene nebo o stav po operaci meziobratlové ploténky, patří případ pod položky VII/9 a VII/11 ze skupiny pohybového ústrojí — tomu odpovídá stránka o potížích s páteří. Samoplátci volí délku po dohodě s lázeňským lékařem; jako odborné minimum platí alespoň 10 procedur během alespoň 10 dní.',
        },
        physicianNote: 'O tom, zda a v jaké formě pro vás při kořenovém syndromu připadá v úvahu lázeňský pobyt, rozhoduje lázeňský lékař při vstupní prohlídce podle neurologického nálezu a zobrazovacího vyšetření. Postupující ochrnutí nebo porucha funkce močového měchýře a konečníku je akutní stav a patří neprodleně do lékařské péče, ne do plánování lázní. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        ongoing: {
          heading: 'Zkušenost a probíhající výzkum',
          body: 'Plynové injekce s Mariiným plynem, slatinné zábaly a denní fyzioterapie se v Mariánských Lázních u kořenových syndromů používají dlouho; lázeňský lékař je sestavuje podle neurologického nálezu a z klinické zkušenosti. Jak na tom jednotlivý host je, se nenechává bez kontroly: každý léčebný pobyt začíná vstupní a končí výstupní lékařskou prohlídkou a závěrečnou zprávou, takže je průběh doložený a lázeňský lékař může plán během pobytu upravit. Pro lázeňskou medicínu jako obor vzniká poprvé po dlouhé době systematická evidence. Institut lázeňství a balneologie, v.v.i., který Karlovarský kraj založil v roce 2019, vede od roku 2026 spolu s Léčebnými lázněmi Mariánské Lázně první klinickou studii tohoto formátu po třiceti letech. Týká se urologických a nefrologických diagnóz, ne té popsané na této stránce: více než sto pacientů se vyšetřuje před lázeňskou léčbou a po ní na ukazatele zdravotního stavu a kvality života, odborným garantem je prim. MUDr. Ladislav Špišák, CSc., a výsledky zatím nejsou k dispozici. Studie běží v projektu Centrum lázeňského výzkumu (2024 až 2027), financovaném z Operačního programu Spravedlivá transformace a spolupracujícím s ČVUT, Západočeskou univerzitou a Akademií věd ČR. Co z takové práce může vzejít, ukazuje dřívější spolupráce téhož institutu s mariánskolázeňskými lázeňskými domy: jejich společná studie lázeňské rehabilitace po covidu-19 získala v roce 2021 Innovation Award Evropského svazu lázní v kategorii Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Pomůže lázeňský pobyt při ischiasu?',
            answer: 'Kořenové syndromy s iritačně-zánikovými projevy jsou samostatná položka českého indikačního seznamu (VI/3) a Mariánské Lázně je léčí běžně: plynovými injekcemi, slatinnými zábaly, elektroléčbou a denní fyzioterapií pod lékařským dohledem. Cílem je méně bolesti, více pohyblivosti a nácvik ochablého svalstva. O složení procedur rozhoduje lázeňský lékař po vstupní prohlídce.',
          },
          {
            question: 'Jaký je rozdíl oproti lázeňské léčbě páteře?',
            answer: 'Zařazení se řídí nálezem. Je-li postižen nervový kořen — bolest táhne do nohy nebo do paže, k tomu necitlivost, brnění nebo ubývání síly —, platí položka VI/3 ze skupiny nemocí nervových. Chronická bolest zad funkčního původu bez postižení kořene a stav po operaci meziobratlové ploténky naopak spadají pod VII/9 a VII/11 u pohybového ústrojí. Kterou položka platí, rozhoduje lékař.',
          },
          {
            question: 'Kdy mohu jet do lázní po operaci ploténky?',
            answer: 'Až se rána zhojí a operatér povolí zátěž. Stav po operaci meziobratlové ploténky pak jde přes položku VII/11 u pohybového ústrojí, ne přes VI/3. Vezměte si operační zprávu a povolení k zátěži; bez nich vyjde plán procedur výrazně opatrněji.',
          },
          {
            question: 'Jsou plynové injekce bolestivé?',
            answer: 'Jde o podkožní injekce, tedy krátký vpich; plyn se poté v tkáni rozptýlí a na krátkou chvíli může vyvolat pocit napětí. Předepisuje je výhradně lékař a v Mariánských Lázních se podávají přírodním oxidem uhličitým z Mariina pramene. Pokud proceduru nesnášíte, řekněte to svému lázeňskému lékaři, aby plán upravil.',
          },
          {
            question: 'Jak dlouho trvá lázeňský pobyt při kořenovém syndromu?',
            answer: 'Přesnou délku hrazeného pobytu u položky VI/3 najdete na stránce Co hradí pojišťovna u neurologických onemocnění. Samoplátci volí délku po dohodě s lázeňským lékařem, jako odborné minimum platí alespoň 10 procedur během alespoň 10 dní.',
          },
        ],
        sources: [
          {
            title: 'Klinická studie objektivních účinků komplexní lázeňské péče u urologických a nefrologických diagnóz (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Probíhající studie Institutu lázeňství a balneologie s Léčebnými lázněmi Mariánské Lázně, více než sto pacientů, zahájena 2026. Týká se urologických a nefrologických diagnóz; výsledky zatím nejsou k dispozici.',
          },
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina VI — položka VI/3',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Kořenové syndromy s iritačně-zánikovými projevy, s typem péče a délkou pobytu.',
          },
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina VII — položky VII/9 a VII/11',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Hranice: chronická vertebrogenní bolest funkčního původu a stavy po operacích meziobratlové ploténky spadají pod pohybové ústrojí, ne pod nemoci nervové.',
          },
          {
            title: 'Vyhláška č. 2/2015 Sb. o odborných kritériích lázeňské léčebně rehabilitační péče — skupina VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Úplné znění indikačního seznamu pro nemoci nervové včetně kontraindikací a požadovaných vstupních vyšetření.',
          },
        ],
        related: [
          {
            label: 'Lázeňská léčba páteře a bolestí zad',
            href: '/cs/lazenska-lecba/pater-a-bolesti-zad',
          },
          {
            label: 'Plynové injekce CO₂',
            href: '/cs/magazin/plynove-injekce-co2',
          },
          {
            label: 'CO2 terapie v Mariánských Lázních',
            href: '/cs/co2-terapie',
          },
          {
            label: 'Co hradí pojišťovna u neurologických onemocnění',
            href: '/cs/lazne-s-pojistovnou/indikace/neurologicka-onemocneni',
          },
        ],
      },
      ru: {
        slug: 'ishias-i-koreshkovyj-sindrom',
        navLabel: 'Ишиас и корешковый синдром',
        title: 'Курортное лечение ишиаса и раздражения нервного корешка в Марианских Лазнях',
        h1: 'Курортное лечение ишиаса и раздражённого нервного корешка',
        metaTitle: 'Лечение ишиаса в Марианских Лазнях — процедуры и сроки',
        metaDescription: 'Лечение ишиаса и раздражения нервного корешка в Марианских Лазнях: газовые инъекции, торфяные обёртывания, электротерапия и школа спины — ход лечения и сроки.',
        lead: 'Если боль не остаётся в спине, а тянет в ногу или руку, а к ней добавляются онемение, покалывание или потеря силы, причина — в нервном корешке. Чешский индикационный список относит такие корешковые синдромы к нервным заболеваниям — в отдельную группу, отделённую от обычной боли в спине.',
        teaser: 'Корешковые синдромы с раздражением и признаками выпадения функции: газовые инъекции, торф, электротерапия и ежедневная физиотерапия.',
        treats: [
          'Корешковый синдром с раздражением и признаками выпадения функции, как поясничный, так и шейный',
          'Боль при ишиасе, распространяющаяся от крестца через ягодицу в ногу',
          'Цервикобрахиальный синдром с распространением боли в плечо, руку и кисть',
          'Онемение, покалывание или потеря силы в зоне иннервации поражённого корешка',
          'Вынужденная поза и мышечное напряжение, сформировавшиеся вокруг корешковой боли',
        ],
        notFor: [
          'Острый синдром конского хвоста, прогрессирующий паралич или нарушение функции мочевого пузыря и кишечника — это требует немедленной госпитализации, а не курортного лечения',
          'Неуточнённая корешковая боль без неврологического заключения и без данных визуализации',
          'Свежая операционная рана без завершённого заживления',
          'Острые заболевания, беременность, а также неспособность к самостоятельному самообслуживанию',
          'Эпилепсия, а также зависимость от алкоголя или других психоактивных веществ',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач проверяет неврологическое состояние, рефлексы, силу и чувствительность поражённой ноги или руки и изучает принесённые снимки. Только после этого становится ясно, какие процедуры возможны; без заключения вашего невролога или ортопеда план будет более осторожным.',
          },
          {
            heading: 'Первая неделя: снятие боли и напряжения',
            body: 'Сначала речь идёт о разгрузке: торфяные обёртывания и электротерапия против мышечного напряжения, газовые инъекции вдоль поражённых сегментов, а также физиотерапия без нагрузки на раздражённый корешок.',
          },
          {
            heading: 'Вторая неделя: подвижность и восстановление контроля',
            body: 'По мере уменьшения боли добавляются мобилизация, школа спины и целенаправленная тренировка ослабленной мускулатуры. В воде можно тренировать движения, которые на суше пока вызывают боль.',
          },
          {
            heading: 'Заключительное обследование и план на дом',
            body: 'Состояние оценивается повторно и фиксируется письменно. Вы получаете программу упражнений и рекомендации по осанке во время работы; без этого достигнутая разгрузка не сохранится.',
          },
        ],
        procedures: [
          {
            name: 'Газовые инъекции с марианским газом',
            detail: 'Подкожные инъекции природного углекислого газа вдоль позвоночника; в Марианских Лазнях их давно применяют при заболеваниях позвоночника и суставов, назначает их исключительно врач.',
          },
          {
            name: 'Торфяное обёртывание',
            detail: 'Интенсивная тепловая процедура при температуре до 40 °C на напряжённую область; она создаёт нагрузку на кровообращение и сердце и назначается только по решению врача.',
          },
          {
            name: 'Электротерапия',
            detail: 'Диадинамические и интерференционные токи для облегчения боли и снятия сопутствующего мышечного напряжения.',
          },
          {
            name: 'Индивидуальная физиотерапия',
            detail: 'Ежедневно, включает мобилизацию, разгрузочные положения и целенаправленное укрепление ослабленной мускулатуры.',
          },
          {
            name: 'Школа спины в группе',
            detail: 'Упражнения на осанку, положение таза и стабилизацию поясничного отдела позвоночника, а также правильная техника дыхания.',
          },
          {
            name: 'Двигательная терапия в бассейне',
            detail: 'Выталкивающая сила снимает нагрузку с позвоночника, поэтому можно тренировать объём движений, который на суше пока вызывает боль.',
          },
          {
            name: 'Углекислая ванна в минеральной воде',
            detail: 'Ванна при температуре около 34 °C из местной минеральной воды; она улучшает кровоснабжение кожи и назначается для расслабления.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'Корешковые синдромы с раздражением и признаками выпадения функции относятся к нервным заболеваниям как позиция VI/3. Для пребываний, оплачиваемых чешской страховой, в качестве базового пребывания предусмотрено 21 день комплексного курортного лечения; при повторном пребывании — 21 день долевого лечения, в отдельных случаях 14. Если же речь идёт о хронической боли в спине без вовлечения корешка или о состоянии после операции на межпозвоночном диске, применяются позиции VII/9 и VII/11 из группы заболеваний опорно-двигательного аппарата — для этого предназначена страница о заболеваниях позвоночника. Гости, оплачивающие лечение самостоятельно, согласуют срок с курортным врачом; профессиональным минимумом считается не менее 10 процедур за не менее чем 10 дней.',
        },
        physicianNote: 'Возможно ли и в какой форме курортное лечение при вашем корешковом синдроме, решает курортный врач при первичном осмотре на основании неврологического заключения и данных визуализации. Прогрессирующий паралич или нарушение функции мочевого пузыря и кишечника — это неотложное состояние, требующее немедленного обращения к врачу, а не планирования курортного лечения. Эта страница носит информационный характер и не заменяет консультацию врача.',
        ongoing: {
          heading: 'Опыт и текущие исследования',
          body: 'Газовые инъекции Марииным газом, торфяные обёртывания и ежедневная физиотерапия применяются в Марианских Лазнях при корешковых синдромах давно; курортный врач подбирает их по неврологическому заключению и из клинического опыта. Как идут дела у конкретного гостя, не остаётся без проверки: каждое лечебное пребывание начинается с первичного и заканчивается выходным врачебным осмотром и письменным заключением, поэтому течение задокументировано, а курортный врач может по ходу скорректировать план. Для курортной медицины как отрасли впервые за долгое время создаётся систематическая доказательная база. Институт курортного дела и бальнеологии (Institut lázeňství a balneologie, v.v.i.), основанный Карловарским краем в 2019 году, с 2026 года вместе с «Léčebné lázně Mariánské Lázně» проводит первое клиническое исследование такого формата за тридцать лет. Оно касается урологических и нефрологических диагнозов, а не того, который описан на этой странице: более ста пациентов обследуют до курортного лечения и после него по показателям состояния здоровья и качества жизни, научный гарант — prim. MUDr. Ladislav Špišák, CSc., результатов пока нет. Исследование идёт в рамках проекта «Центр курортных исследований» (2024–2027), финансируемого Операционной программой справедливой трансформации, с участием Чешского технического университета, Западночешского университета и Академии наук Чехии. Что даёт такая работа, показывает более раннее сотрудничество того же института с курортными домами Марианских Лазней: их совместное исследование курортной реабилитации после COVID-19 получило в 2021 году Innovation Award Европейского союза курортов в категории Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Помогает ли курортное лечение при ишиасе?',
            answer: 'Корешковые синдромы с раздражением и признаками выпадения функции выделены в отдельную позицию чешского индикационного списка (VI/3), и в Марианских Лазнях их регулярно лечат: газовыми инъекциями, торфяными обёртываниями, электротерапией и ежедневной физиотерапией под врачебным контролем. Цель — уменьшение боли, увеличение подвижности и восстановление контроля над ослабленной мускулатурой. Состав лечения определяет курортный врач после первичного осмотра.',
          },
          {
            question: 'В чём разница с курортным лечением заболеваний позвоночника?',
            answer: 'Отнесение к той или иной позиции зависит от заключения. Если поражён нервный корешок — боль тянет в ногу или руку, к ней добавляются онемение, покалывание или потеря силы, — применяется позиция VI/3 из группы нервных заболеваний. Хроническая боль в спине функционального происхождения без вовлечения корешка и состояние после операции на межпозвоночном диске, напротив, относятся к позициям VII/9 и VII/11 из группы заболеваний опорно-двигательного аппарата. Какая позиция применима, определяет врач.',
          },
          {
            question: 'Когда можно ехать на курортное лечение после операции на межпозвоночном диске?',
            answer: 'Только после того, как рана заживёт и оперировавший врач разрешит нагрузку. Состояние после операции на межпозвоночных дисках относится к позиции VII/11 из группы заболеваний опорно-двигательного аппарата, а не к VI/3. Возьмите с собой выписку из операции и разрешение врача — без них план процедур будет значительно более осторожным.',
          },
          {
            question: 'Болезненны ли газовые инъекции?',
            answer: 'Это подкожные инъекции, то есть короткий укол; затем газ распределяется в тканях и может на короткое время вызывать чувство распирания. Их назначает исключительно врач, а в Марианских Лазнях используют природный углекислый газ источника Марии. Если процедура плохо переносится, сообщите об этом курортному врачу, чтобы план был изменён.',
          },
          {
            question: 'Сколько длится курортное лечение при корешковом синдроме?',
            answer: 'Для застрахованных в чешской страховой компании позиция VI/3 предусматривает базовое пребывание длительностью 21 день комплексного курортного лечения; повторное пребывание проходит как 21 день долевого лечения, в отдельных случаях 14. Гости, оплачивающие лечение самостоятельно, выбирают срок по согласованию с курортным врачом, при этом профессиональным минимумом считается не менее 10 процедур за не менее чем 10 дней.',
          },
        ],
        sources: [
          {
            title: 'Клиническое исследование объективных эффектов комплексного курортного лечения при урологических и нефрологических диагнозах (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Продолжающееся исследование Института курортного дела и бальнеологии вместе с «Léčebné lázně Mariánské Lázně», более ста пациентов, начато в 2026 году. Касается урологических и нефрологических диагнозов; результатов пока нет.',
          },
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа VI — позиция VI/3',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Корешковые синдромы с раздражением и признаками выпадения функции: базовое пребывание — 21 день комплексного курортного лечения, повторное пребывание — 21 день долевого лечения (в отдельных случаях 14).',
          },
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа VII — позиции VII/9 и VII/11',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Разграничение: хроническая вертеброгенная боль функционального происхождения и состояния после операций на межпозвоночных дисках относятся к заболеваниям опорно-двигательного аппарата, а не к нервным заболеваниям.',
          },
          {
            title: 'Постановление № 2/2015 Сб. о профессиональных критериях курортной реабилитационной помощи — группа VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Полный текст индикационного списка для нервных заболеваний, включая противопоказания и требуемые первичные обследования. Текст на чешском языке.',
          },
        ],
        related: [
          {
            label: 'Курортное лечение позвоночника',
            href: '/ru/kurortnoe-lechenie/pozvonochnik-i-boli-v-spine',
          },
          {
            label: 'Газовые инъекции CO₂',
            href: '/ru/zhurnal/gazovye-inektsii-co2',
          },
          {
            label: 'CO2-терапия в Марианских Лазнях',
            href: '/ru/co2-terapiya',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'polyneuropathy',
    groupId: 'nervous',
    roman: 'VI',
    codes: [
      'VI/2',
    ],
    conditionName: 'Polyneuropathy',
    icd10: 'G62',
    image: '/images/library/treatments/massage-hands-closeup.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Therapeutin massiert die Hand einer Kurgästin, Nahaufnahme der Griffe an Fingern und Handfläche',
      en: 'A therapist massaging a spa guest’s hand, close-up of the grips on fingers and palm',
      cs: 'Terapeutka masíruje ruku lázeňské hostky, detailní záběr na hmaty na prstech a dlani',
      ru: 'Терапевт массирует руку гостьи, крупный план приёмов на пальцах и ладони',
    },
    content: {
      de: {
        slug: 'polyneuropathie',
        navLabel: 'Polyneuropathie',
        title: 'Kur bei Polyneuropathie in Marienbad',
        h1: 'Kur bei Polyneuropathie',
        metaTitle: 'Kur bei Polyneuropathie in Marienbad — Ablauf, Dauer',
        metaDescription: 'Kur bei Polyneuropathie mit Lähmungserscheinungen in Marienbad: Gangschule, Übungen im Wasser, Kohlensäurebäder — Ablauf, Dauer und Grenzen.',
        lead: 'Wenn die Nerven in Füßen und Händen nicht mehr richtig melden und die Kraft nachlässt, wird jeder Schritt zur Konzentrationsaufgabe. Die tschechische Indikationsliste führt die Polyneuropathie mit paretischen Erscheinungen unter den Nervenkrankheiten. In Marienbad geht es dabei um das, was sich üben lässt: Gang, Standsicherheit und Kraft.',
        teaser: 'Polyneuropathie mit Lähmungserscheinungen: Gangschule, Standsicherheit, Übungen im Wasser und Kohlensäurebäder.',
        treats: [
          'Polyneuropathie mit paretischen Erscheinungen, also mit nachweisbarem Kraftverlust',
          'Diabetische Polyneuropathie bei eingestelltem Diabetes',
          'Polyneuropathie nach einer Chemotherapie, wenn die onkologische Behandlung abgeschlossen ist',
          'Unsicherer Gang und Standunsicherheit durch fehlende Rückmeldung aus den Füßen',
          'Muskelabbau und nachlassende Belastbarkeit durch Schonung',
        ],
        notFor: [
          'Polyneuropathie ohne Lähmungserscheinungen — die Position der Indikationsliste setzt paretische Erscheinungen voraus',
          'Unabgeklärte Nervenstörung ohne neurologischen Befund',
          'Nicht abgeheilte Wunden oder Geschwüre an den Füßen, etwa beim diabetischen Fußsyndrom',
          'Laufende onkologische Behandlung; nach Abschluss ist eine Kur möglich',
          'Akute Erkrankungen, Schwangerschaft, Epilepsie sowie Unfähigkeit zur selbstständigen Versorgung',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt erhebt den neurologischen Befund, prüft Kraft, Gefühl und Reflexe und sieht sich die Füße an — offene Stellen oder Druckschäden entscheiden mit darüber, welche Anwendungen möglich sind. Bringen Sie den Befund Ihres Neurologen und, bei Diabetes, die aktuellen Laborwerte mit.',
          },
          {
            heading: 'Erste Woche: sicher stehen',
            body: 'Der Schwerpunkt liegt auf Standsicherheit und Gangbild. Geübt wird mit Blickkontrolle und an unterschiedlichen Untergründen, weil die Rückmeldung aus den Füßen fehlt und über Augen und Hüfte ersetzt werden muss.',
          },
          {
            heading: 'Zweite Woche: Kraft und Ausdauer',
            body: 'Gezielter Aufbau der abgeschwächten Muskulatur, Gehstrecken im Gelände und Übungen im Wasser, wo der Auftrieb Bewegungen erlaubt, die an Land unsicher wären. Bei begleitenden Verspannungen kommen Massagen dazu.',
          },
          {
            heading: 'Abschlussuntersuchung und Plan für zu Hause',
            body: 'Kraft, Gang und Standsicherheit werden erneut beurteilt und festgehalten. Sie erhalten ein Übungsprogramm sowie Hinweise zur täglichen Fußkontrolle, die bei fehlendem Gefühl über kleine Verletzungen hinwegtäuscht.',
          },
        ],
        procedures: [
          {
            name: 'Einzelphysiotherapie',
            detail: 'Täglich, mit Aufbau der abgeschwächten Muskulatur und Übung des sicheren Abrollens beim Gehen.',
          },
          {
            name: 'Gang- und Gleichgewichtsschule',
            detail: 'Standsicherheit auf wechselndem Untergrund und Gehen mit Blickkontrolle, um die fehlende Rückmeldung aus den Füßen auszugleichen.',
          },
          {
            name: 'Bewegungstherapie im Becken',
            detail: 'Im warmen Wasser lassen sich Kraft und Gang ohne Sturzangst üben, weil der Auftrieb das Körpergewicht trägt.',
          },
          {
            name: 'Kohlensäurebad im Mineralwasser',
            detail: 'Bad bei rund 34 °C; das aus dem Mineralwasser aufgenommene Kohlendioxid fördert die Hautdurchblutung.',
          },
          {
            name: 'Trockenes Gasbad im Mariengas',
            detail: 'Das natürliche Kohlendioxid der Marienquelle wird ohne Wasser und ohne Wärmebelastung angewandt — geeignet, wenn warme Bäder nicht infrage kommen.',
          },
          {
            name: 'Klassische Massage',
            detail: 'Gegen die begleitenden Verspannungen, die aus Schonhaltung und unsicherem Gang entstehen.',
          },
          {
            name: 'Klimatherapie und geführte Spaziergänge',
            detail: 'Gehstrecken im Gelände unter Anleitung, mit vorsichtig steigender Länge entsprechend der Belastbarkeit.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Die Polyneuropathie mit paretischen Erscheinungen steht als Position VI/2 auf der tschechischen Indikationsliste. Für Aufenthalte, die eine tschechische Krankenkasse trägt, sind als Grundaufenthalt 28 Tage komplexe Kurbehandlung oder 21 Tage Zuschussbehandlung vorgesehen; beim Wiederholungsaufenthalt sind es 28 Tage komplexe oder 21 Tage Zuschussbehandlung, in bestimmten Fällen 14. Selbstzahler stimmen die Dauer mit dem Kurarzt ab; als fachliche Untergrenze gelten mindestens 10 Anwendungen über mindestens 10 Tage. Eine Jahreszeit ist medizinisch nicht vorgegeben, bei fehlendem Gefühl in den Füßen sind schnee- und eisfreie Wege allerdings sicherer.',
        },
        physicianNote: 'Ob eine Kur bei Ihrer Polyneuropathie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand des neurologischen Befunds und des Zustands Ihrer Füße. Der Aufenthalt ergänzt die Behandlung der Grunderkrankung — etwa die Einstellung eines Diabetes — und ersetzt sie nicht. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        ongoing: {
          heading: 'Erfahrung und laufende Forschung',
          body: 'Bei der Polyneuropathie zielt die Kur auf das, was sich trainieren lässt: Gangbild, Standsicherheit und Kraft. Diese Bausteine werden in Marienbad seit langem verordnet, zusammengestellt nach dem neurologischen Befund und aus klinischer Erfahrung. Wie es dem einzelnen Gast dabei ergeht, bleibt nicht ungeprüft: Jeder Behandlungsaufenthalt beginnt mit einer Eingangs- und endet mit einer Abschlussuntersuchung samt schriftlichem Abschlussbericht, sodass der Verlauf dokumentiert ist und der Kurarzt den Plan unterwegs anpassen kann. Für die Kurmedizin als Fach entsteht derzeit erstmals seit Langem systematische Evidenz. Das Institut lázeňství a balneologie, v.v.i., die 2019 vom Karlsbader Kreis gegründete Forschungseinrichtung für Kurwesen und Balneologie, führt seit 2026 gemeinsam mit den Léčebné lázně Mariánské Lázně die erste klinische Studie dieses Formats seit dreißig Jahren durch. Sie betrifft urologische und nephrologische Diagnosen, nicht die auf dieser Seite beschriebene: Mehr als hundert Patienten werden vor und nach dem Kuraufenthalt auf Gesundheitszustand und Lebensqualität untersucht, fachlicher Garant ist prim. MUDr. Ladislav Špišák, CSc.; Ergebnisse liegen noch nicht vor. Die Studie läuft im Projekt Zentrum für Kurforschung (2024 bis 2027), das aus dem Operationellen Programm Gerechter Übergang finanziert wird und mit der Tschechischen Technischen Universität, der Westböhmischen Universität und der Akademie der Wissenschaften der Tschechischen Republik zusammenarbeitet. Was dabei herauskommen kann, zeigt die frühere Zusammenarbeit desselben Instituts mit den Marienbader Kurhäusern: Die gemeinsame Studie zur Kurrehabilitation nach COVID-19 erhielt 2021 den Innovation Award der European Spas Association in der Kategorie Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Wird eine Kur bei Polyneuropathie bezahlt?',
            answer: 'Die tschechische Indikationsliste führt die Polyneuropathie mit paretischen Erscheinungen als Position VI/2: Für Versicherte einer tschechischen Krankenkasse sind als Grundaufenthalt 28 Tage komplexe Kurbehandlung oder 21 Tage Zuschussbehandlung vorgesehen. Entscheidend ist der Zusatz „mit paretischen Erscheinungen" — es muss ein Kraftverlust dokumentiert sein. Gäste mit einer Versicherung außerhalb Tschechiens klären die Kostenübernahme vorab mit ihrem eigenen Kostenträger.',
          },
          {
            question: 'Was wird bei Polyneuropathie in der Kur gemacht?',
            answer: 'Der Schwerpunkt liegt auf dem, was sich trainieren lässt: Gangbild, Standsicherheit und Kraft in den betroffenen Muskeln. Dazu kommen Bewegungstherapie im warmen Wasser, Kohlensäurebäder oder trockene Gasbäder aus den örtlichen Heilmitteln, Massagen gegen die begleitenden Verspannungen und geführte Gehstrecken im Gelände. Den Plan stellt der Kurarzt nach der Eingangsuntersuchung zusammen.',
          },
          {
            question: 'Hilft die Kur bei einer Polyneuropathie nach Chemotherapie?',
            answer: 'Eine Kur ist möglich, sobald die onkologische Behandlung abgeschlossen ist und Sie sich in Remission befinden; während einer laufenden Tumorbehandlung ist sie ausgeschlossen. Behandelt wird dann dasselbe wie bei anderen Formen: Gang, Standsicherheit und Kraft. Für die Nachsorge nach einer Krebsbehandlung insgesamt gibt es in Marienbad ein eigenes Programm.',
          },
          {
            question: 'Was muss ich bei Diabetes beachten?',
            answer: 'Bringen Sie aktuelle Laborwerte und Ihre Medikation mit; der Kurarzt richtet den Plan danach aus. Wichtig ist die tägliche Kontrolle der Füße: Wo das Gefühl fehlt, bleiben Druckstellen und kleine Verletzungen unbemerkt. Offene Stellen am Fuß schließen eine Reihe von Anwendungen aus, deshalb werden die Füße bei der Eingangsuntersuchung angesehen.',
          },
          {
            question: 'Werden die Nerven durch die Kur wieder gesund?',
            answer: 'Nein. Für einen solchen Effekt gibt es bei der Polyneuropathie keine belastbaren Belege, und diese Seite behauptet ihn deshalb nicht. Was sich in der Kur ändern lässt, ist der Umgang mit den Folgen: Gangsicherheit, Kraft in den betroffenen Muskeln und Belastbarkeit im Alltag. Die Behandlung der Grunderkrankung läuft unverändert weiter.',
          },
        ],
        sources: [
          {
            title: 'Klinische Studie zu den objektiven Wirkungen der komplexen Kurbehandlung bei urologischen und nephrologischen Diagnosen (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Laufende Studie des Instituts lázeňství a balneologie mit den Léčebné lázně Mariánské Lázně, mehr als hundert Patienten, Beginn 2026. Sie betrifft urologische und nephrologische Diagnosen; Ergebnisse liegen noch nicht vor.',
          },
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe VI — Position VI/2',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Polyneuropathie mit paretischen Erscheinungen: Grundaufenthalt 28 Tage komplexe oder 21 Tage Zuschussbehandlung; Wiederholungsaufenthalt 28 Tage komplexe oder 21 Tage Zuschussbehandlung (in bestimmten Fällen 14).',
          },
          {
            title: 'Verordnung Nr. 2/2015 Slg. über die fachlichen Kriterien der kurmedizinischen Rehabilitationspflege — Gruppe VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Vollständiger Wortlaut der Indikationsliste für Nervenkrankheiten samt Kontraindikationen und geforderter Eingangsuntersuchungen. Tschechischer Text.',
          },
        ],
        related: [
          {
            label: 'Kur bei Stoffwechsel und Diabetes',
            href: '/de/kur-bei/stoffwechsel-und-diabetes',
          },
          {
            label: 'Kur nach einer Krebsbehandlung',
            href: '/de/kur-bei/nach-krebsbehandlung',
          },
          {
            label: 'Tag des Gehirns und Nervensystems',
            href: '/de/magazin/gehirn-nervensystem',
          },
          {
            label: 'Indikationen und Kontraindikationen',
            href: '/de/indikationen-und-kontraindikationen',
          },
        ],
      },
      en: {
        slug: 'polyneuropathy',
        navLabel: 'Polyneuropathy',
        title: 'Spa treatment for polyneuropathy in Marienbad',
        h1: 'Spa treatment for polyneuropathy',
        metaTitle: 'Spa treatment for polyneuropathy in Marienbad — course, duration',
        metaDescription: 'Spa treatment for polyneuropathy with paretic symptoms in Marienbad: gait training, exercises in water, carbon dioxide baths — course, duration and limits.',
        lead: 'When the nerves in the feet and hands no longer send accurate signals and strength declines, every step becomes a task requiring concentration. The Czech indication list places polyneuropathy with paretic symptoms among the nervous system diseases. In Marienbad, the focus is on what can be trained: gait, standing stability and strength.',
        teaser: 'Polyneuropathy with paretic symptoms: gait training, standing stability, exercises in water and carbon dioxide baths.',
        treats: [
          'Polyneuropathy with paretic symptoms, that is, with a demonstrable loss of strength',
          'Diabetic polyneuropathy where diabetes is well controlled',
          'Polyneuropathy after chemotherapy, once oncological treatment has been completed',
          'Unsteady gait and standing instability caused by a lack of feedback from the feet',
          'Muscle wasting and declining stamina from protective inactivity',
        ],
        notFor: [
          'Polyneuropathy without paretic symptoms — the position on the indication list requires paretic symptoms',
          'Unassessed nerve disorder without a neurological work-up',
          'Unhealed wounds or ulcers on the feet, for example in diabetic foot syndrome',
          'Ongoing oncological treatment; a spa cure is possible once it is completed',
          'Acute illness, pregnancy, epilepsy, and an inability to manage personal care independently',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: "The spa physician takes the neurological findings, checks strength, sensation and reflexes, and examines the feet — open areas or pressure damage also determine which treatments are possible. Bring your neurologist's findings and, if you have diabetes, your current lab results.",
          },
          {
            heading: 'First week: standing safely',
            body: 'The focus is on standing stability and gait. Practice takes place with visual control and on different surfaces, because the feedback from the feet is missing and has to be replaced through the eyes and hips.',
          },
          {
            heading: 'Second week: strength and endurance',
            body: 'Targeted strengthening of the weakened muscles, walking distances outdoors, and exercises in water, where buoyancy allows movements that would feel unsteady on dry land. Massage is added for any accompanying tension.',
          },
          {
            heading: 'Final examination and a plan for home',
            body: 'Strength, gait and standing stability are assessed again and recorded. You receive an exercise programme along with guidance on daily foot checks, since a lack of sensation can hide small injuries.',
          },
        ],
        procedures: [
          { name: 'Individual physiotherapy', detail: 'Daily, building up the weakened muscles and practising a safe rolling motion of the foot when walking.' },
          { name: 'Gait and balance training', detail: 'Standing stability on varying surfaces and walking with visual control, to compensate for the missing feedback from the feet.' },
          { name: 'Exercise therapy in the pool', detail: "In warm water, strength and gait can be practised without fear of falling, because buoyancy supports the body's weight." },
          { name: 'Carbon dioxide bath in mineral water', detail: 'A bath at around 34°C; the carbon dioxide absorbed from the mineral water promotes skin blood flow.' },
          { name: 'Dry gas bath in Mariengas', detail: 'The natural carbon dioxide of the Marien Spring is applied without water and without the strain of heat — suitable when warm baths are not an option.' },
          { name: 'Classic massage', detail: 'For the accompanying tension that develops from protective posture and unsteady gait.' },
          { name: 'Climate therapy and guided walks', detail: 'Walking distances outdoors under guidance, with length increasing cautiously according to stamina.' },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'Polyneuropathy with paretic symptoms is position VI/2 on the Czech indication list. For stays covered by Czech public health insurance, the initial stay provides for 28 days of comprehensive spa care or 21 days of contributory care; a repeat stay runs to 28 days of comprehensive or 21 days of contributory care, 14 in certain cases. Self-paying guests agree the length with the spa physician; the professional minimum is at least 10 treatments over at least 10 days. There is no medical requirement for the season, though where sensation in the feet is impaired, paths free of snow and ice are safer.',
        },
        physicianNote: 'Whether a spa cure is appropriate for your polyneuropathy is decided by the spa physician at the initial examination, based on the neurological findings and the condition of your feet. The stay supplements treatment of the underlying condition — such as diabetes management — and does not replace it. This page provides information and does not replace medical advice.',
        ongoing: {
          heading: 'Experience and research under way',
          body: 'With polyneuropathy the cure aims at what can be trained: gait, standing stability and strength. These building blocks have long been prescribed in Marienbad, put together according to the neurological findings and from clinical experience. How the individual guest fares is not left unchecked: every treatment stay begins with an initial and ends with a final medical examination and a written final report, so the course is documented and the spa physician can adjust the plan along the way. Systematic evidence for spa medicine as a field is being built for the first time in a long while. The Institute of Spa Medicine and Balneology (Institut lázeňství a balneologie, v.v.i.), founded by the Karlovy Vary Region in 2019, has been running the first clinical study of this format in thirty years since 2026, together with Léčebné lázně Mariánské Lázně. It covers urological and nephrological diagnoses rather than the one described on this page: more than a hundred patients are examined before and after the spa stay for health status and quality of life, with prim. MUDr. Ladislav Špišák, CSc. as professional guarantor, and results are not yet available. The study runs within the Spa Research Centre project (2024 to 2027), funded by the Just Transition Operational Programme and working with the Czech Technical University, the University of West Bohemia and the Czech Academy of Sciences. What such work can produce is shown by the same institute’s earlier collaboration with the Marienbad spa houses: their joint study of spa rehabilitation after COVID-19 received the European Spas Association Innovation Award in 2021 in the Medical Spa Scientific Research category.',
        },
        faqs: [
          {
            question: 'Is a spa cure for polyneuropathy covered?',
            answer: "The Czech indication list lists polyneuropathy with paretic symptoms as position VI/2: for people insured with a Czech health fund, the initial stay provides for 28 days of comprehensive spa care or 21 days of contributory care. The key qualifier is 'with paretic symptoms' — a loss of strength must be documented. Guests insured outside the Czech Republic should clarify cost coverage with their own insurer in advance.",
          },
          {
            question: 'What does spa treatment for polyneuropathy involve?',
            answer: 'The focus is on what can be trained: gait, standing stability and strength in the affected muscles. In addition there is exercise therapy in warm water, carbon dioxide baths or dry gas baths from the local natural remedies, massage against the accompanying tension, and guided walking outdoors. The spa physician puts the plan together after the initial examination.',
          },
          {
            question: 'Does the cure help with polyneuropathy after chemotherapy?',
            answer: 'A spa cure is possible once oncological treatment is complete and you are in remission; it is excluded during ongoing cancer treatment. The same things are then treated as in other forms: gait, standing stability and strength. For aftercare following cancer treatment as a whole, Marienbad has a dedicated programme.',
          },
          {
            question: 'What do I need to know if I have diabetes?',
            answer: 'Bring your current lab results and your medication; the spa physician bases the plan on them. Daily foot checks matter: where sensation is missing, pressure spots and small injuries can go unnoticed. Open areas on the foot rule out a number of treatments, which is why the feet are examined at the initial examination.',
          },
          {
            question: 'Does the cure heal the nerves?',
            answer: 'No. There is no robust evidence for such an effect in polyneuropathy, so this page makes no such claim. What the cure can change is how you cope with the consequences: gait stability, strength in the affected muscles and stamina in everyday life. Treatment of the underlying condition continues unchanged.',
          },
        ],
        sources: [
          {
            title: 'Clinical study of the objective effects of comprehensive spa care in kidney and urological conditions (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Ongoing study by the Institute of Spa Medicine and Balneology with Léčebné lázně Mariánské Lázně, more than a hundred patients, started 2026. It covers urological and nephrological diagnoses; results are not yet available.',
          },
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group VI — position VI/2',
            url: '/en/indications-and-contraindications',
            note: 'Polyneuropathy with paretic symptoms: initial stay 28 days of comprehensive or 21 days of contributory care; repeat stay 28 days of comprehensive or 21 days of contributory care (14 in certain cases).',
          },
          {
            title: 'Decree No. 2/2015 Coll. on the professional criteria for spa medical rehabilitation care — Group VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Full text of the indication list for nervous system diseases, including contraindications and required initial examinations. Czech-language text.',
          },
        ],
        related: [
          { label: 'Spa treatment for metabolism and diabetes', href: '/en/spa-treatment-for/metabolism-and-diabetes' },
          { label: 'Spa treatment after cancer treatment', href: '/en/spa-treatment-for/after-cancer-treatment' },
          { label: 'Brain and Nervous System Day', href: '/en/magazine/brain-nervous-system' },
          { label: 'Indications and contraindications', href: '/en/indications-and-contraindications' },
        ],
      },
      cs: {
        slug: 'polyneuropatie',
        navLabel: 'Polyneuropatie',
        title: 'Lázeňská léčba polyneuropatie v Mariánských Lázních',
        h1: 'Lázeňská léčba polyneuropatie',
        metaTitle: 'Léčba polyneuropatie v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Lázeňská léčba polyneuropatie s parézou v Mariánských Lázních: škola chůze, cvičení ve vodě, uhličité koupele — průběh, délka a hranice léčby.',
        lead: 'Když nervy v chodidlech a rukou už nehlásí správně a síla ubývá, stává se každý krok úkolem na soustředění. Český indikační seznam vede polyneuropatii s parézou mezi nemocemi nervovými. V Mariánských Lázních jde o to, co se dá cvičit: chůzi, stabilitu ve stoji a síl.',
        teaser: 'Polyneuropatie s parézou: škola chůze, stabilita ve stoji, cvičení ve vodě a uhličité koupele.',
        treats: [
          'Polyneuropatie s parézou, tedy s prokázaným ubýváním síly',
          'Diabetická polyneuropatie u kompenzovaného diabetu',
          'Polyneuropatie po chemoterapii, je-li onkologická léčba ukončena',
          'Nejistá chůze a nestabilita ve stoji z chybějící zpětné vazby z chodidel',
          'Svalový úbytek a ubývající zátěžová kapacita z ochranného šetření',
        ],
        notFor: [
          'Polyneuropatie bez parézy — položka indikačního seznamu předpokládá parézu',
          'Nevyjasněná porucha nervů bez neurologického nálezu',
          'Nezhojené rány nebo vředy na chodidlech, například u syndromu diabetické nohy',
          'Probíhající onkologická léčba; po jejím ukončení je lázeňský pobyt možný',
          'Akutní onemocnění, těhotenství, epilepsie a neschopnost sebeobsluhy',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař zjistí neurologický nález, vyšetří síl, citlivost a reflexy a podívá se na chodidla — otevřená místa nebo otlaky spolurozhodují o tom, které procedury jsou možné. Vezměte si nález svého neurologa a při diabetu i aktuální laboratorní hodnoty.',
          },
          {
            heading: 'První týden: jistě stát',
            body: 'Důraz je na stabilitě ve stoji a chůzi. Cvičí se s kontrolou pohledem a na různém povrchu, protože chybí zpětná vazba z chodidel a musí se nahradit očima a kyčlí.',
          },
          {
            heading: 'Druhý týden: síla a vytrvalost',
            body: 'Cílené posilování ochablého svalstva, chůze v terénu a cvičení ve vodě, kde vztlak umožňuje pohyby, které by na suchu byly nejisté. Při doprovodném napětí přibývají masáže.',
          },
          {
            heading: 'Závěrečná prohlídka a plán pro doma',
            body: 'Síla, chůze a stabilita se znovu posoudí a zaznamenají. Dostanete cvičební program a pokyny k denní kontrole chodidel, kde chybějící citlivost zastírá drobná zranění.',
          },
        ],
        procedures: [
          {
            name: 'Individuální fyzioterapie',
            detail: 'Denně, s posilováním ochablého svalstva a nácvikem jistého odvíjení chodidla při chůzi.',
          },
          {
            name: 'Škola chůze a rovnováhy',
            detail: 'Stabilita ve stoji na proměnlivém povrchu a chůze s kontrolou pohledem, aby se vyrovnala chybějící zpětná vazba z chodidel.',
          },
          {
            name: 'Pohybová terapie v bazénu',
            detail: 'V teplé vodě lze cvičit síl a chůzi bez strachu z pádu, protože vztlak nese váhu těla.',
          },
          {
            name: 'Uhličitá koupel z minerální vody',
            detail: 'Koupel při zhruba 34 °C; oxid uhličitý přijímaný z minerální vody podporuje prokrvení kůže.',
          },
          {
            name: 'Suchá plynová koupel v Mariině plynu',
            detail: 'Přírodní oxid uhličitý z Mariina pramene se používá bez vody a bez zátěže teplem — vhodné tam, kde teplé koupele nepřipadají v úvahu.',
          },
          {
            name: 'Klasická masáž',
            detail: 'Proti doprovodnému napětí, které vzniká z úlevového držení těla a nejisté chůze.',
          },
          {
            name: 'Klimatoterapie a vedené procházky',
            detail: 'Chůze v terénu pod vedením, s opatrně narůstající délkou podle zátěžové kapacity.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Polyneuropatie s parézou je položka VI/2 českého indikačního seznamu; přesnou délku hrazeného pobytu najdete na stránce Co hradí pojišťovna u neurologických onemocnění. Samoplátci volí délku po dohodě s lázeňským lékařem; jako odborné minimum platí alespoň 10 procedur během alespoň 10 dní. Roční období nemá lékařský předpis, při chybějící citlivosti v chodidlech jsou ale cesty bez sněhu a ledu bezpečnější.',
        },
        physicianNote: 'O tom, zda pro vás při polyneuropatii připadá v úvahu lázeňský pobyt, rozhoduje lázeňský lékař při vstupní prohlídce podle neurologického nálezu a stavu vašich chodidel. Pobyt doplňuje léčbu základního onemocnění — například kompenzaci diabetu — a nenahrazuje ji. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        ongoing: {
          heading: 'Zkušenost a probíhající výzkum',
          body: 'U polyneuropatie míří léčba na to, co se dá trénovat: chůzi, stabilitu ve stoje a sílu. Tyto stavební kameny se v Mariánských Lázních předepisují dlouho, sestavené podle neurologického nálezu a z klinické zkušenosti. Jak na tom jednotlivý host je, se nenechává bez kontroly: každý léčebný pobyt začíná vstupní a končí výstupní lékařskou prohlídkou a závěrečnou zprávou, takže je průběh doložený a lázeňský lékař může plán během pobytu upravit. Pro lázeňskou medicínu jako obor vzniká poprvé po dlouhé době systematická evidence. Institut lázeňství a balneologie, v.v.i., který Karlovarský kraj založil v roce 2019, vede od roku 2026 spolu s Léčebnými lázněmi Mariánské Lázně první klinickou studii tohoto formátu po třiceti letech. Týká se urologických a nefrologických diagnóz, ne té popsané na této stránce: více než sto pacientů se vyšetřuje před lázeňskou léčbou a po ní na ukazatele zdravotního stavu a kvality života, odborným garantem je prim. MUDr. Ladislav Špišák, CSc., a výsledky zatím nejsou k dispozici. Studie běží v projektu Centrum lázeňského výzkumu (2024 až 2027), financovaném z Operačního programu Spravedlivá transformace a spolupracujícím s ČVUT, Západočeskou univerzitou a Akademií věd ČR. Co z takové práce může vzejít, ukazuje dřívější spolupráce téhož institutu s mariánskolázeňskými lázeňskými domy: jejich společná studie lázeňské rehabilitace po covidu-19 získala v roce 2021 Innovation Award Evropského svazu lázní v kategorii Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Hradí pojišťovna lázně při polyneuropatii?',
            answer: 'Český indikační seznam vede polyneuropatii s parézou jako položku VI/2; přesné podmínky a délku hrazeného pobytu najdete na stránce Co hradí pojišťovna u neurologických onemocnění. Rozhodující je dodatek „s parézou“ — musí být dokumentováno ubývání síly. Hosté s pojištěním mimo Česko si úhradu ověřují předem u vlastní pojišťovny.',
          },
          {
            question: 'Co se u polyneuropatie v lázních dělá?',
            answer: 'Důraz je na tom, co se dá trénovat: chůzi, stabilitu ve stoji a síl v postižených svalech. K tomu přistupuje pohybová terapie v teplé vodě, uhličité nebo suché plynové koupele z místních léčivých zdrojů, masáže proti doprovodnému napětí a vedené procházky v terénu. Plán sestavuje lázeňský lékař po vstupní prohlídce.',
          },
          {
            question: 'Pomůže lázeňský pobyt při polyneuropatii po chemoterapii?',
            answer: 'Lázeňský pobyt je možný, jakmile je onkologická léčba ukončena a jste v remisi; při probíhající léčbě nádoru je vyloučen. Léčí se pak totéž jako u jiných forem: chůze, stabilita a síl. Pro následnou péči po onkologické léčbě celkově existuje v Mariánských Lázních samostatný program.',
          },
          {
            question: 'Na co musím dát pozor při diabetu?',
            answer: 'Vezměte si aktuální laboratorní hodnoty a svou medikaci; lázeňský lékař podle nich upraví plán. Důležitá je denní kontrola chodidel: kde chybí citlivost, zůstávají otlaky a drobná zranění nepovšimnuta. Otevřená místa na chodidle vylučují řadu procedur, proto se chodidla prohlížejí už při vstupní prohlídce.',
          },
          {
            question: 'Vyléčí lázeňský pobyt nervy?',
            answer: 'Ne. Pro takový účinek u polyneuropatie neexistují průkazné důkazy, a tato stránka ho proto neuvádí. Co se v lázních dá změnit, je zvládání důsledků: jistota chůze, síl v postižených svalech a zátěžová kapacita v běžném dni. Léčba základního onemocnění pokračuje beze změny.',
          },
        ],
        sources: [
          {
            title: 'Klinická studie objektivních účinků komplexní lázeňské péče u urologických a nefrologických diagnóz (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Probíhající studie Institutu lázeňství a balneologie s Léčebnými lázněmi Mariánské Lázně, více než sto pacientů, zahájena 2026. Týká se urologických a nefrologických diagnóz; výsledky zatím nejsou k dispozici.',
          },
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina VI — položka VI/2',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Polyneuropatie s paretickými projevy, s typem péče a délkou pobytu.',
          },
          {
            title: 'Vyhláška č. 2/2015 Sb. o odborných kritériích lázeňské léčebně rehabilitační péče — skupina VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Úplné znění indikačního seznamu pro nemoci nervové včetně kontraindikací a požadovaných vstupních vyšetření.',
          },
        ],
        related: [
          {
            label: 'Lázeňská léčba metabolismu a diabetu',
            href: '/cs/lazenska-lecba/metabolismus-a-diabetes',
          },
          {
            label: 'Lázeňská léčba po onkologické léčbě',
            href: '/cs/lazenska-lecba/po-onkologicke-lecbe',
          },
          {
            label: 'Den mozku a nervového systému',
            href: '/cs/magazin/den-mozku-nervovy-system',
          },
          {
            label: 'Co hradí pojišťovna u neurologických onemocnění',
            href: '/cs/lazne-s-pojistovnou/indikace/neurologicka-onemocneni',
          },
        ],
      },
      ru: {
        slug: 'polinejropatiya',
        navLabel: 'Полинейропатия',
        title: 'Курортное лечение полинейропатии в Марианских Лазнях',
        h1: 'Курортное лечение полинейропатии',
        metaTitle: 'Лечение полинейропатии в Марианских Лазнях — ход, сроки',
        metaDescription: 'Курортное лечение полинейропатии с парезами в Марианских Лазнях: школа ходьбы, упражнения в воде, углекислые ванны — ход лечения, сроки и ограничения.',
        lead: 'Когда нервы в стопах и кистях перестают правильно передавать сигналы и сила мышц снижается, каждый шаг превращается в задачу, требующую сосредоточенности. Чешский индикационный список относит полинейропатию с парезами к нервным заболеваниям. В Марианских Лазнях лечение направлено на то, что можно тренировать: ходьбу, устойчивость и силу.',
        teaser: 'Полинейропатия с парезами: школа ходьбы, устойчивость, упражнения в воде и углекислые ванны.',
        treats: [
          'Полинейропатия с парезами, то есть с доказанной потерей силы',
          'Диабетическая полинейропатия при компенсированном диабете',
          'Полинейропатия после химиотерапии, если онкологическое лечение завершено',
          'Неуверенная походка и неустойчивость стояния из-за отсутствия обратной связи от стоп',
          'Атрофия мышц и снижение выносливости из-за щадящего режима',
        ],
        notFor: [
          'Полинейропатия без парезов — позиция индикационного списка требует наличия парезов',
          'Неуточнённое нарушение нервной системы без неврологического заключения',
          'Незаживающие раны или язвы на стопах, например при синдроме диабетической стопы',
          'Текущее онкологическое лечение; после его завершения курортное лечение возможно',
          'Острые заболевания, беременность, эпилепсия, а также неспособность к самостоятельному самообслуживанию',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач фиксирует неврологическое состояние, проверяет силу, чувствительность и рефлексы, а также осматривает стопы — открытые повреждения или потёртости влияют на то, какие процедуры возможны. Возьмите с собой заключение вашего невролога и, при диабете, актуальные лабораторные показатели.',
          },
          {
            heading: 'Первая неделя: устойчивое стояние',
            body: 'Основное внимание уделяется устойчивости и походке. Тренировки проводят с визуальным контролем и на разных поверхностях, поскольку обратная связь от стоп отсутствует и должна замещаться зрением и работой тазобедренного сустава.',
          },
          {
            heading: 'Вторая неделя: сила и выносливость',
            body: 'Целенаправленное укрепление ослабленной мускулатуры, прогулки по местности и упражнения в воде, где выталкивающая сила позволяет выполнять движения, которые на суше были бы небезопасны. При сопутствующем напряжении добавляется массаж.',
          },
          {
            heading: 'Заключительное обследование и план на дом',
            body: 'Сила, походка и устойчивость оцениваются повторно и фиксируются. Вы получаете программу упражнений, а также рекомендации по ежедневному осмотру стоп, поскольку при отсутствии чувствительности мелкие повреждения легко остаются незамеченными.',
          },
        ],
        procedures: [
          {
            name: 'Индивидуальная физиотерапия',
            detail: 'Ежедневно, включает укрепление ослабленной мускулатуры и тренировку безопасного переката стопы при ходьбе.',
          },
          {
            name: 'Школа ходьбы и равновесия',
            detail: 'Устойчивость на разных поверхностях и ходьба с визуальным контролем, чтобы компенсировать отсутствие обратной связи от стоп.',
          },
          {
            name: 'Двигательная терапия в бассейне',
            detail: 'В тёплой воде можно тренировать силу и походку без страха падения, поскольку выталкивающая сила держит вес тела.',
          },
          {
            name: 'Углекислая ванна в минеральной воде',
            detail: 'Ванна при температуре около 34 °C; углекислый газ, проникающий из минеральной воды, улучшает кровоснабжение кожи.',
          },
          {
            name: 'Сухая газовая ванна в марианском газе',
            detail: 'Природный углекислый газ источника Марии применяется без воды и без тепловой нагрузки — подходит, когда тёплые ванны невозможны.',
          },
          {
            name: 'Классический массаж',
            detail: 'Против сопутствующего напряжения, возникающего из-за вынужденной позы и неуверенной походки.',
          },
          {
            name: 'Климатотерапия и прогулки под руководством инструктора',
            detail: 'Прогулки по местности под руководством инструктора, с постепенно и осторожно увеличивающейся дистанцией в соответствии с выносливостью.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'Полинейропатия с парезами относится к позиции VI/2 чешского индикационного списка. Для пребываний, оплачиваемых чешской страховой, в качестве базового пребывания предусмотрено 28 дней комплексного курортного лечения или 21 день долевого лечения; при повторном пребывании — 28 дней комплексного или 21 день долевого лечения, в отдельных случаях 14. Гости, оплачивающие лечение самостоятельно, согласуют срок с курортным врачом; профессиональным минимумом считается не менее 10 процедур за не менее чем 10 дней. Время года медицинскими показаниями не определено, однако при отсутствии чувствительности в стопах дороги без снега и льда безопаснее.',
        },
        physicianNote: 'Возможно ли курортное лечение при вашей полинейропатии, решает курортный врач при первичном осмотре на основании неврологического заключения и состояния ваших стоп. Пребывание дополняет лечение основного заболевания — например, коррекцию диабета — и не заменяет его. Эта страница носит информационный характер и не заменяет консультацию врача.',
        ongoing: {
          heading: 'Опыт и текущие исследования',
          body: 'При полинейропатии лечение нацелено на то, что поддаётся тренировке: походку, устойчивость в положении стоя и силу. Эти составляющие назначают в Марианских Лазнях давно, подбирая их по неврологическому заключению и из клинического опыта. Как идут дела у конкретного гостя, не остаётся без проверки: каждое лечебное пребывание начинается с первичного и заканчивается выходным врачебным осмотром и письменным заключением, поэтому течение задокументировано, а курортный врач может по ходу скорректировать план. Для курортной медицины как отрасли впервые за долгое время создаётся систематическая доказательная база. Институт курортного дела и бальнеологии (Institut lázeňství a balneologie, v.v.i.), основанный Карловарским краем в 2019 году, с 2026 года вместе с «Léčebné lázně Mariánské Lázně» проводит первое клиническое исследование такого формата за тридцать лет. Оно касается урологических и нефрологических диагнозов, а не того, который описан на этой странице: более ста пациентов обследуют до курортного лечения и после него по показателям состояния здоровья и качества жизни, научный гарант — prim. MUDr. Ladislav Špišák, CSc., результатов пока нет. Исследование идёт в рамках проекта «Центр курортных исследований» (2024–2027), финансируемого Операционной программой справедливой трансформации, с участием Чешского технического университета, Западночешского университета и Академии наук Чехии. Что даёт такая работа, показывает более раннее сотрудничество того же института с курортными домами Марианских Лазней: их совместное исследование курортной реабилитации после COVID-19 получило в 2021 году Innovation Award Европейского союза курортов в категории Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Оплачивается ли курортное лечение при полинейропатии?',
            answer: 'Чешский индикационный список относит полинейропатию с парезами к позиции VI/2: для застрахованных в чешской страховой компании в качестве базового пребывания предусмотрено 28 дней комплексного курортного лечения или 21 день долевого лечения. Решающее значение имеет уточнение «с парезами» — потеря силы должна быть документирована. Гости со страховкой за пределами Чехии заранее уточняют возможность возмещения у своего страховщика.',
          },
          {
            question: 'Что делают при полинейропатии во время курортного лечения?',
            answer: 'Основное внимание уделяется тому, что можно тренировать: походке, устойчивости и силе поражённых мышц. К этому добавляются двигательная терапия в тёплой воде, углекислые или сухие газовые ванны из местных лечебных средств, массаж против сопутствующего напряжения и прогулки по местности под руководством инструктора. План составляет курортный врач после первичного осмотра.',
          },
          {
            question: 'Помогает ли курортное лечение при полинейропатии после химиотерапии?',
            answer: 'Курортное лечение возможно, как только онкологическое лечение завершено и вы находитесь в ремиссии; во время текущего лечения опухоли оно исключено. Лечение направлено на то же, что и при других формах: ходьбу, устойчивость и силу. Для восстановления после лечения онкологического заболевания в целом в Марианских Лазнях есть отдельная программа.',
          },
          {
            question: 'Что нужно учитывать при диабете?',
            answer: 'Возьмите с собой актуальные лабораторные показатели и список принимаемых препаратов; курортный врач ориентирует план на них. Важен ежедневный осмотр стоп: там, где отсутствует чувствительность, потёртости и мелкие повреждения остаются незамеченными. Открытые повреждения на стопе исключают ряд процедур, поэтому стопы осматривают уже при первичном осмотре.',
          },
          {
            question: 'Восстанавливаются ли нервы благодаря курортному лечению?',
            answer: 'Нет. Для такого эффекта при полинейропатии нет надёжных доказательств, и эта страница поэтому его не утверждает. То, что можно изменить во время курортного лечения, — это то, как справляться с последствиями: уверенность при ходьбе, сила поражённых мышц и выносливость в повседневной жизни. Лечение основного заболевания при этом продолжается без изменений.',
          },
        ],
        sources: [
          {
            title: 'Клиническое исследование объективных эффектов комплексного курортного лечения при урологических и нефрологических диагнозах (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Продолжающееся исследование Института курортного дела и бальнеологии вместе с «Léčebné lázně Mariánské Lázně», более ста пациентов, начато в 2026 году. Касается урологических и нефрологических диагнозов; результатов пока нет.',
          },
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа VI — позиция VI/2',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Полинейропатия с парезами: базовое пребывание — 28 дней комплексного лечения или 21 день долевого лечения; повторное пребывание — 28 дней комплексного или 21 день долевого лечения (в отдельных случаях 14).',
          },
          {
            title: 'Постановление № 2/2015 Сб. о профессиональных критериях курортной реабилитационной помощи — группа VI',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Полный текст индикационного списка для нервных заболеваний, включая противопоказания и требуемые первичные обследования. Текст на чешском языке.',
          },
        ],
        related: [
          {
            label: 'Курортное лечение обмена веществ и диабета',
            href: '/ru/kurortnoe-lechenie/obmen-veshchestv-i-diabet',
          },
          {
            label: 'Курортное лечение после лечения онкологии',
            href: '/ru/kurortnoe-lechenie/posle-lecheniya-onkologii',
          },
          {
            label: 'День мозга и нервной системы',
            href: '/ru/zhurnal/den-mozga-nervnaya-sistema',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'hypertension',
    groupId: 'circulatory',
    roman: 'II',
    codes: [
      'II/3',
    ],
    conditionName: 'Hypertension',
    icd10: 'I10',
    image: '/images/library/treatments/co2-pool-relaxation.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Kurgast liegt entspannt im warmen Kohlensäurebecken aus örtlichem Mineralwasser',
      en: 'A spa guest lying relaxed in the warm carbonated pool of local mineral water',
      cs: 'Lázeňský host odpočívá v teplém uhličitém bazénu z místní minerální vody',
      ru: 'Гость лечения расслабленно лежит в тёплом углекислом бассейне из местной минеральной воды',
    },
    content: {
      de: {
        slug: 'bluthochdruck',
        navLabel: 'Bluthochdruck',
        title: 'Kur bei Bluthochdruck in Marienbad',
        h1: 'Kur bei Bluthochdruck',
        metaTitle: 'Kur bei Bluthochdruck in Marienbad — Ablauf und Dauer',
        metaDescription: 'Kur bei Bluthochdruck in Marienbad: Kohlensäurebäder, Terrainkur und Ernährungsberatung — was die Studien zeigen, wie lange die Kur dauert.',
        lead: 'Bluthochdruck im zweiten und dritten Grad steht auf der tschechischen Indikationsliste, und Marienbad behandelt ihn mit dem, was hier aus dem Boden kommt: Kohlensäurebädern aus dem örtlichen Mineralwasser und trockenen Gasbädern im Mariengas, dazu Bewegung im Gelände und Ernährungsberatung. Die Kur ergänzt die blutdrucksenkende Medikation, sie ersetzt sie nicht.',
        teaser: 'Kohlensäurebäder, trockene Gasbäder, Terrainkur und Ernährungsberatung — als Ergänzung zur blutdrucksenkenden Behandlung.',
        treats: [
          'Hypertonie im zweiten und dritten Grad unter laufender ärztlicher Behandlung',
          'Bluthochdruck mit begleitendem Übergewicht oder Bewegungsmangel',
          'Bluthochdruck mit erhöhten Blutfettwerten oder gestörtem Zuckerstoffwechsel',
          'Nachlassende körperliche Belastbarkeit, die den Blutdruck mit unterhält',
          'Der Wunsch, Ernährung und Bewegung unter ärztlicher Aufsicht umzustellen',
        ],
        notFor: [
          'AV-Block zweiten bis dritten Grades, Herzinsuffizienz im Stadium NYHA IV und aktive Endokarditis — die Indikationsliste schließt sie für die ganze Gruppe aus',
          'Unbehandelter oder nicht eingestellter Bluthochdruck ohne ärztliche Kontrolle',
          'Schwere Herzerkrankung sowie akute Infektionskrankheiten',
          'Moorpackungen: sie belasten den Kreislauf stark und werden bei Herz-Kreislauf-Erkrankungen nur nach ärztlicher Einzelentscheidung verordnet',
          'Die Kreuzquelle: ihr hoher Natriumgehalt macht sie für Menschen mit Bluthochdruck ungeeignet',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt misst den Blutdruck, geht die Medikation durch und sichtet die mitgebrachten Befunde. Zur Gruppe der Kreislaufkrankheiten verlangt die Indikationsliste bestimmte Eingangsuntersuchungen und Nikotinabstinenz. Bringen Sie aktuelle Werte, am besten aus der häuslichen Selbstmessung, und eine vollständige Medikamentenliste mit.',
          },
          {
            heading: 'Erste Woche: Kreislauf an die Belastung gewöhnen',
            body: 'Die Anwendungen beginnen mit Kohlensäurebädern bei rund 34 °C und kurzen Gehstrecken im Gelände. Der Blutdruck wird regelmäßig kontrolliert, und die Trinkkur wird abgestimmt — nicht jede Quelle im Ort passt bei Bluthochdruck.',
          },
          {
            heading: 'Zweite Woche: Belastung steigern',
            body: 'Die Gehstrecken werden länger und steiler, Gruppenübungen und Bewegungstherapie im Wasser kommen dazu. Parallel läuft die Ernährungsberatung; bei Übergewicht ist die Gewichtsabnahme der Hebel, der auf den Blutdruck wirkt.',
          },
          {
            heading: 'Abschlussuntersuchung und Plan für zu Hause',
            body: 'Der Blutdruckverlauf über den Aufenthalt wird ausgewertet und schriftlich festgehalten; den Bericht nehmen Sie für Ihren behandelnden Arzt mit. Ob und wie die Medikation angepasst wird, entscheidet ausschließlich er, nicht der Kurort.',
          },
        ],
        procedures: [
          {
            name: 'Kohlensäurebad im Mineralwasser',
            detail: 'Bad im örtlichen Mineralwasser bei rund 34 °C; das über die Haut aufgenommene Kohlendioxid ist der Wirkstoff, die niedrige Temperatur hält die Kreislaufbelastung gering.',
          },
          {
            name: 'Trockenes Gasbad im Mariengas',
            detail: 'Anwendung des natürlichen Kohlendioxids der Marienquelle in einem abgedichteten Beutel — ohne Wasser und ohne Wärmebelastung, deshalb bei Herz-Kreislauf-Diagnosen häufig die erste Wahl.',
          },
          {
            name: 'Terrainkur und Klimatherapie',
            detail: 'Geführtes Gehen auf abgestuften Wegen im Kurwald, mit schrittweise steigender Belastung in 630 Metern Höhe.',
          },
          {
            name: 'Gruppenübungen für Herz-Kreislauf-Gäste',
            detail: 'Geleitete Einheiten mit Ausdauer-, Beweglichkeits- und Atemanteilen, zusammengestellt für Gäste mit ähnlicher Diagnose.',
          },
          {
            name: 'Bewegungstherapie im Becken',
            detail: 'Übungen im warmen Wasser, die die Gelenke schonen und dennoch Ausdauer aufbauen.',
          },
          {
            name: 'Ernährungsberatung',
            detail: 'Einzelgespräche zu Salz, Gewicht und Blutfetten, begleitet von der Kurdiät während des Aufenthalts.',
          },
          {
            name: 'Trinkkur nach ärztlicher Verordnung',
            detail: 'Welche Quelle und welche Menge, legt der Arzt fest. Die Kreuzquelle ist wegen ihres hohen Natriumgehalts bei Bluthochdruck nicht geeignet.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Die hypertone Krankheit im zweiten bis dritten Grad steht als Position II/3 auf der tschechischen Indikationsliste. Für Aufenthalte, die eine tschechische Krankenkasse trägt, sind als Grundaufenthalt 28 Tage komplexe Kurbehandlung oder 21 Tage Zuschussbehandlung vorgesehen; der Wiederholungsaufenthalt läuft über 21 Tage Zuschussbehandlung, in bestimmten Fällen über 14. Selbstzahler stimmen die Dauer mit dem Kurarzt ab; als fachliche Untergrenze gelten mindestens 10 Anwendungen über mindestens 10 Tage. Zur Jahreszeit gibt es eine begründete Überlegung: Der Tagesblutdruck ist im Winter höher als im Sommer, vor allem durch Kälte, und in der kalten Jahreszeit treten mehr kardiovaskuläre Ereignisse auf — ein Aufenthalt im Herbst liegt damit vor der Belastungsspitze.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body: 'Eine Übersichtsarbeit zum Baden in natürlichem thermalem Mineralwasser bei Bluthochdruck kommt zu dem Ergebnis, dass die Bäder — allein, ergänzend zu Medikamenten oder in Kombination mit weiteren Maßnahmen — keine unerwünschten Wirkungen hatten und den Blutdruck in den meisten eingeschlossenen Studien günstig beeinflussten (Yuan et al., 2019, Int J Biometeorol; sehr unterschiedliche Interventionen, methodisch schwächere Studien, keine Metaanalyse). Eine Mini-Übersicht beschreibt für verschiedene Formen der Hydro- und Balneotherapie eine blutdrucksenkende Wirkung als Ergänzung zur Behandlung und nennt als Mechanismen Wärme, Herzfrequenzregulation und Barorezeptoren; die Autoren fordern weitere klinische Studien (Moini Jazani et al., 2023; Mini-Review ohne systematische Methodik). In einer Vorher-nachher-Studie mit 35 Patienten sank der über 24 Stunden gemessene Blutdruck nach drei Wochen Balneotherapie mit Kohlensäurebädern und Peloiden bei Personen mit mittleren und hohen Ausgangswerten, bei niedrigen Ausgangswerten änderte er sich nicht (Ekmekcioglu et al., 2000, Altern Ther Health Med; ohne Kontrollgruppe). Zur Sicherheit liegt eine randomisierte Studie vor: 15 Bäder bei 38 °C führten bei Patientinnen und Patienten mit Bluthochdruck und Übergewicht zu keinen ungünstigen Veränderungen der Stoffwechsel- und Entzündungswerte, eine Balneotherapie ist bei diesen Diagnosen also nicht kontraindiziert (Oláh et al., 2011; beobachtet wurden Laborwerte, keine klinischen Endpunkte). Keine dieser Studien zeigt, dass eine Kur blutdrucksenkende Medikamente ersetzen kann.',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur bei Ihrem Bluthochdruck infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer Werte und Befunde. Über Ihre Medikation entscheidet ausschließlich Ihr behandelnder Arzt; ändern Sie sie nicht ohne seine Zustimmung. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        faqs: [
          {
            question: 'Senkt eine Kur den Blutdruck?',
            answer: 'Die vorliegenden Studien deuten darauf hin, dass Bäder in Mineralwasser den Blutdruck als Ergänzung zur Behandlung günstig beeinflussen können. In einer Vorher-nachher-Studie mit 35 Patienten sank der 24-Stunden-Blutdruck nach drei Wochen Balneotherapie bei Personen mit erhöhten Ausgangswerten, bei niedrigen Werten blieb er unverändert; diese Studie hatte keine Kontrollgruppe. Eine Übersichtsarbeit fand in den meisten eingeschlossenen Studien eine günstige Wirkung ohne unerwünschte Effekte, weist aber auf die schwächere Methodik hin. Blutdrucksenkende Medikamente ersetzt die Kur nach diesen Daten nicht.',
          },
          {
            question: 'Wird eine Kur bei Bluthochdruck bezahlt?',
            answer: 'Die hypertone Krankheit im zweiten bis dritten Grad ist Position II/3 der tschechischen Indikationsliste: Für Versicherte einer tschechischen Krankenkasse sind als Grundaufenthalt 28 Tage komplexe Kurbehandlung oder 21 Tage Zuschussbehandlung vorgesehen, der Wiederholungsaufenthalt läuft über 21 oder 14 Tage Zuschussbehandlung. Gäste mit einer Versicherung außerhalb Tschechiens klären die Kostenübernahme vorab mit ihrem eigenen Kostenträger.',
          },
          {
            question: 'Welche Quelle darf ich bei Bluthochdruck trinken?',
            answer: 'Das legt der Kurarzt fest, und die Menge ebenso; trinken Sie nie mehr, als verordnet ist. Eine Einschränkung ist bekannt: Die Kreuzquelle enthält viel Natrium und ist für Menschen mit Bluthochdruck sowie für Herzpatienten nicht geeignet. Die Quellen im Ort unterscheiden sich chemisch erheblich, deshalb wird die Trinkkur immer einzeln verordnet.',
          },
          {
            question: 'Sind Moorpackungen bei Bluthochdruck erlaubt?',
            answer: 'Nur nach ärztlicher Einzelentscheidung. Die Moorpackung ist eine wärmeintensive Anwendung bei bis zu 40 °C und damit eine deutliche Belastung für Herz und Kreislauf; bei Herz-Kreislauf-Erkrankungen und im höheren Alter ist Vorsicht geboten. Wo eine Anwendung mit Kohlendioxid sinnvoll ist, wird stattdessen oft das trockene Gasbad gewählt, das ohne Wärmebelastung auskommt.',
          },
          {
            question: 'Muss ich meine Blutdruckmittel während der Kur absetzen?',
            answer: 'Nein. Ändern Sie Ihre zu Hause verordnete Medikation nicht ohne Zustimmung Ihres Arztes. Der Kurarzt kontrolliert den Blutdruck während des Aufenthalts und hält den Verlauf im Abschlussbericht fest; ob daraus eine Anpassung folgt, entscheidet Ihr behandelnder Arzt zu Hause.',
          },
        ],
        sources: [
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe II — Position II/3',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Hypertone Krankheit II. bis III. Grades: Grundaufenthalt 28 Tage komplexe oder 21 Tage Zuschussbehandlung; Wiederholungsaufenthalt 21 Tage Zuschussbehandlung (in bestimmten Fällen 14).',
          },
          {
            title: 'Verordnung Nr. 2/2015 Slg. über die fachlichen Kriterien der kurmedizinischen Rehabilitationspflege — Gruppe II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Vollständiger Wortlaut der Indikationsliste für Kreislaufkrankheiten samt Kontraindikationen (AV-Block II. bis III. Grades, NYHA IV, aktive Endokarditis), geforderter Nikotinabstinenz und Eingangsuntersuchungen. Tschechischer Text.',
          },
          {
            title: 'Yuan H et al. 2019, Int J Biometeorol — Übersicht zum Baden in natürlichem thermalem Mineralwasser bei Hypertonie',
            url: 'https://doi.org/10.1007/s00484-019-01780-4',
            note: 'Bäder allein, als Ergänzung zu Medikamenten und in Kombination mit weiteren Maßnahmen hatten keine unerwünschten Wirkungen und beeinflussten den Blutdruck in den meisten Studien günstig. Heterogene Interventionen, keine Metaanalyse.',
          },
          {
            title: 'Moini Jazani A et al. 2023, Int J Biometeorol — Mini-Übersicht zur Wirkung von Hydro-, Balneo- und Kurtherapie auf den Blutdruck',
            url: 'https://doi.org/10.1007/s00484-023-02512-5',
            note: 'Verschiedene Formen können als ergänzende Behandlung den Blutdruck senken; genannte Mechanismen sind Wärme, Herzfrequenzregulation und Barorezeptoren. Mini-Review ohne systematische Methodik.',
          },
          {
            title: 'Ekmekcioglu C et al. 2000, Altern Ther Health Med — Vorher-nachher-Studie, 35 Patienten, 24-Stunden-Blutdruckmessung',
            url: 'https://consensus.app/papers/details/39ccd0edaff45a03b6103309fbe833bc/',
            note: 'Nach 3 Wochen Balneotherapie mit CO₂-Bädern und Peloiden sank der 24-Stunden-Blutdruck bei mittleren und hohen Ausgangswerten; bei niedrigen unverändert. Ohne Kontrollgruppe.',
          },
          {
            title: 'Oláh M et al. 2011 — randomisierte Studie zu Balneotherapie bei Hypertonie und Adipositas (15 Bäder, 38 °C)',
            url: 'https://consensus.app/papers/details/56a643895d4a59608b3486b000ee0c38/',
            note: '15 Bäder bei 38 °C führten zu keinen ungünstigen Veränderungen der Stoffwechsel- und Entzündungsparameter; Balneotherapie ist bei diesen Diagnosen nicht kontraindiziert. Beobachtet wurden Laborwerte, keine klinischen Endpunkte.',
          },
          {
            title: 'Narita K, Hoshide S, Kario K 2021, Hypertens Res — Übersicht zur saisonalen Schwankung des Blutdrucks',
            url: 'https://doi.org/10.1038/s41440-021-00732-z',
            note: 'Der Tagesblutdruck ist im Winter höher als im Sommer, vor allem durch Kälte; der winterliche Anstieg hängt mit mehr kardiovaskulären Ereignissen zusammen. Betrifft nicht die Kurbehandlung.',
          },
          {
            title: 'Pagourelias ED et al. 2011, Int J Biometeorol — Übersicht zur CO₂-Balneotherapie bei Herz-Kreislauf-Erkrankungen',
            url: 'https://consensus.app/papers/details/cffd890e39e252b5bf9e66f5a36c8ff6/',
            note: 'Drei Haupteffekte: Abfall der Körpertemperatur, stärkere Hautdurchblutung, Wärmegefühl; die Autoren fordern methodisch bessere Studien.',
          },
        ],
        related: [
          {
            label: 'Herz und Gefäße vor dem Winter',
            href: '/de/magazin/kur-herz-kreislauf-marienbad',
          },
          {
            label: 'Kur bei koronarer Herzkrankheit',
            href: '/de/kur-bei/koronare-herzkrankheit',
          },
          {
            label: 'Kohlensäurebäder — was die Forschung zeigt',
            href: '/de/magazin/co2-baeder-wissenschaft',
          },
          {
            label: 'Indikationen und Kontraindikationen',
            href: '/de/indikationen-und-kontraindikationen',
          },
        ],
      },
      en: {
        slug: 'high-blood-pressure',
        navLabel: 'High blood pressure',
        title: 'Spa treatment for high blood pressure in Marienbad',
        h1: 'Spa treatment for high blood pressure',
        metaTitle: 'Spa treatment for high blood pressure in Marienbad — duration',
        metaDescription: 'Spa treatment for high blood pressure in Marienbad: carbon dioxide baths, terrain cure and nutrition counselling — what studies show, how long the cure lasts.',
        lead: 'Grade two and three hypertension is on the Czech indication list, and Marienbad treats it with what comes from the ground here: carbon dioxide baths from the local mineral water and dry gas baths in Mariengas, together with outdoor exercise and nutrition counselling. The cure supplements blood-pressure-lowering medication; it does not replace it.',
        teaser: 'Carbon dioxide baths, dry gas baths, terrain cure and nutrition counselling — as a supplement to blood-pressure-lowering treatment.',
        treats: [
          'Grade two and three hypertension under ongoing medical treatment',
          'High blood pressure with accompanying overweight or lack of exercise',
          'High blood pressure with elevated blood lipids or disturbed glucose metabolism',
          'Declining physical stamina that helps sustain the high blood pressure',
          'The wish to change diet and exercise habits under medical supervision',
        ],
        notFor: [
          'Second- to third-degree AV block, heart failure at NYHA class IV and active endocarditis — the indication list excludes these for the whole group',
          'Untreated or poorly controlled high blood pressure without medical supervision',
          'Severe heart disease, and acute infectious disease',
          'Peat packs: they place a strong strain on the circulation and are prescribed for cardiovascular disease only after an individual medical decision',
          'The Cross Spring: its high sodium content makes it unsuitable for people with high blood pressure',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: 'The spa physician measures your blood pressure, reviews your medication and reviews any findings you bring. For the circulatory disease group, the indication list requires certain initial examinations and nicotine abstinence. Bring current readings, ideally from your own measurements at home, and a complete list of your medication.',
          },
          {
            heading: 'First week: accustoming the circulation to exertion',
            body: 'Treatment begins with carbon dioxide baths at around 34°C and short outdoor walks. Blood pressure is checked regularly, and the drinking cure is tailored individually — not every spring in town is suitable for high blood pressure.',
          },
          {
            heading: 'Second week: increasing exertion',
            body: 'The walking distances become longer and steeper, and group exercise and exercise therapy in water are added. Nutrition counselling runs in parallel; where there is overweight, weight loss is the lever that acts on blood pressure.',
          },
          {
            heading: 'Final examination and a plan for home',
            body: 'How your blood pressure has changed over the stay is evaluated and recorded in writing; you take the report home for your own doctor. Whether and how medication is adjusted is decided solely by them, not by the spa town.',
          },
        ],
        procedures: [
          { name: 'Carbon dioxide bath in mineral water', detail: 'A bath in the local mineral water at around 34°C; the carbon dioxide absorbed through the skin is the active agent, and the low temperature keeps the strain on the circulation small.' },
          { name: 'Dry gas bath in Mariengas', detail: 'Application of the natural carbon dioxide from the Marien Spring in a sealed bag — without water and without the strain of heat, which is why it is often the first choice for cardiovascular diagnoses.' },
          { name: 'Terrain cure and climate therapy', detail: 'Guided walking on graded paths in the spa forest, with gradually increasing exertion at an altitude of 630 metres.' },
          { name: 'Group exercise for cardiovascular guests', detail: 'Guided sessions with endurance, mobility and breathing components, put together for guests with a similar diagnosis.' },
          { name: 'Exercise therapy in the pool', detail: 'Exercises in warm water that spare the joints while still building endurance.' },
          { name: 'Nutrition counselling', detail: 'Individual sessions on salt, weight and blood lipids, accompanied by the spa diet during the stay.' },
          { name: 'Drinking cure on medical prescription', detail: 'Which spring and what amount is set by the physician. The Cross Spring is not suitable for high blood pressure because of its high sodium content.' },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'Grade two to three hypertensive disease is position II/3 on the Czech indication list. For stays covered by Czech public health insurance, the initial stay provides for 28 days of comprehensive spa care or 21 days of contributory care; a repeat stay runs to 21 days of contributory care, in certain cases 14. Self-paying guests agree the length with the spa physician; the professional minimum is at least 10 treatments over at least 10 days. There is a reasoned consideration for timing the season: daytime blood pressure is higher in winter than in summer, mainly because of cold, and more cardiovascular events occur in the cold season — a stay in autumn therefore comes before that peak in strain.',
        },
        evidence: {
          heading: 'What the studies show',
          body: 'A review of bathing in natural thermal mineral water for high blood pressure concluded that the baths — alone, as a supplement to medication, or combined with other measures — had no adverse effects and had a favourable influence on blood pressure in most of the included studies (Yuan et al., 2019, Int J Biometeorol; very heterogeneous interventions, methodologically weaker studies, no meta-analysis). A mini-review describes a blood-pressure-lowering effect for various forms of hydro- and balneotherapy as a supplement to treatment, and names heat, heart-rate regulation and baroreceptors as mechanisms; the authors call for further clinical studies (Moini Jazani et al., 2023; mini-review without systematic methodology). In a before-and-after study of 35 patients, 24-hour blood pressure fell after three weeks of balneotherapy with carbon dioxide baths and peloids in people with medium and high baseline values, while it did not change in those with low baseline values (Ekmekcioglu et al., 2000, Altern Ther Health Med; no control group). On safety, a randomised study is available: 15 baths at 38°C produced no unfavourable changes in metabolic and inflammatory markers in patients with high blood pressure and overweight, so balneotherapy is not contraindicated for these diagnoses (Oláh et al., 2011; laboratory values were observed, not clinical endpoints). None of these studies shows that a spa cure can replace blood-pressure-lowering medication.',
        },
        physicianNote: 'Whether and to what extent a spa cure is appropriate for your high blood pressure is decided by the spa physician at the initial examination, based on your readings and findings. Your own doctor alone decides on your medication; do not change it without their agreement. This page provides information and does not replace medical advice.',
        faqs: [
          {
            question: 'Does a spa cure lower blood pressure?',
            answer: 'The available studies suggest that baths in mineral water can favourably influence blood pressure as a supplement to treatment. In a before-and-after study of 35 patients, 24-hour blood pressure fell after three weeks of balneotherapy in people with raised baseline values, while it remained unchanged at low values; this study had no control group. A review found a favourable effect without adverse effects in most of the included studies, but points out the weaker methodology. According to this data, the cure does not replace blood-pressure-lowering medication.',
          },
          {
            question: 'Is a spa cure for high blood pressure covered?',
            answer: 'Grade two to three hypertensive disease is position II/3 of the Czech indication list: for people insured with a Czech health fund, the initial stay provides for 28 days of comprehensive spa care or 21 days of contributory care, and a repeat stay runs to 21 or 14 days of contributory care. Guests insured outside the Czech Republic should clarify cost coverage with their own insurer in advance.',
          },
          {
            question: 'Which spring may I drink from with high blood pressure?',
            answer: 'That is set by the spa physician, as is the amount; never drink more than prescribed. One restriction is known: the Cross Spring contains a great deal of sodium and is not suitable for people with high blood pressure or for heart patients. The springs in town differ considerably in chemistry, which is why the drinking cure is always prescribed individually.',
          },
          {
            question: 'Are peat packs allowed with high blood pressure?',
            answer: 'Only after an individual medical decision. The peat pack is a heat-intensive application at up to 40°C and therefore places a clear strain on the heart and circulation; caution is needed with cardiovascular disease and at an older age. Where a treatment with carbon dioxide makes sense, the dry gas bath is often chosen instead, since it involves no strain from heat.',
          },
          {
            question: 'Do I have to stop my blood pressure medication during the cure?',
            answer: "No. Do not change medication prescribed for you at home without your doctor's agreement. The spa physician monitors your blood pressure during the stay and records the course in the final report; whether that leads to an adjustment is decided by your own doctor at home.",
          },
        ],
        sources: [
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group II — position II/3',
            url: '/en/indications-and-contraindications',
            note: 'Hypertensive disease, grade II to III: initial stay 28 days of comprehensive or 21 days of contributory care; repeat stay 21 days of contributory care (14 in certain cases).',
          },
          {
            title: 'Decree No. 2/2015 Coll. on the professional criteria for spa medical rehabilitation care — Group II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Full text of the indication list for circulatory diseases, including contraindications (second- to third-degree AV block, NYHA IV, active endocarditis), required nicotine abstinence and initial examinations. Czech-language text.',
          },
          {
            title: 'Yuan H et al. 2019, Int J Biometeorol — review of bathing in natural thermal mineral water for hypertension',
            url: 'https://doi.org/10.1007/s00484-019-01780-4',
            note: 'Baths alone, as a supplement to medication, and combined with other measures had no adverse effects and had a favourable influence on blood pressure in most studies. Heterogeneous interventions, no meta-analysis.',
          },
          {
            title: 'Moini Jazani A et al. 2023, Int J Biometeorol — mini-review of the effect of hydrotherapy, balneotherapy and spa therapy on blood pressure',
            url: 'https://doi.org/10.1007/s00484-023-02512-5',
            note: 'Various forms can lower blood pressure as a supplementary treatment; the mechanisms named are heat, heart-rate regulation and baroreceptors. Mini-review without systematic methodology.',
          },
          {
            title: 'Ekmekcioglu C et al. 2000, Altern Ther Health Med — before-and-after study, 35 patients, 24-hour blood pressure measurement',
            url: 'https://consensus.app/papers/details/39ccd0edaff45a03b6103309fbe833bc/',
            note: 'After 3 weeks of balneotherapy with CO₂ baths and peloids, 24-hour blood pressure fell at medium and high baseline values; unchanged at low values. No control group.',
          },
          {
            title: 'Oláh M et al. 2011 — randomised study of balneotherapy in hypertension and obesity (15 baths, 38°C)',
            url: 'https://consensus.app/papers/details/56a643895d4a59608b3486b000ee0c38/',
            note: 'No unfavourable changes in metabolic and inflammatory parameters after 15 baths at 38°C; balneotherapy is not contraindicated for these diagnoses. Laboratory values were observed, not clinical endpoints.',
          },
          {
            title: 'Narita K, Hoshide S, Kario K 2021, Hypertens Res — review of the seasonal variation of blood pressure',
            url: 'https://doi.org/10.1038/s41440-021-00732-z',
            note: 'Daytime blood pressure is higher in winter than in summer, mainly because of cold; the winter rise is associated with more cardiovascular events. Does not concern spa treatment.',
          },
          {
            title: 'Pagourelias ED et al. 2011, Int J Biometeorol — review of CO₂ balneotherapy in cardiovascular disease',
            url: 'https://consensus.app/papers/details/cffd890e39e252b5bf9e66f5a36c8ff6/',
            note: 'Three main effects: a drop in body temperature, stronger skin blood flow, a feeling of warmth; the authors call for methodologically stronger studies.',
          },
        ],
        related: [
          { label: 'Heart and circulation before winter', href: '/en/magazine/cardiovascular-spa-cure-marianske-lazne' },
          { label: 'Spa treatment for coronary heart disease', href: '/en/spa-treatment-for/coronary-heart-disease' },
          { label: 'Carbon dioxide baths — what the research shows', href: '/en/magazine/co2-baths-science' },
          { label: 'Indications and contraindications', href: '/en/indications-and-contraindications' },
        ],
      },
      cs: {
        slug: 'vysoky-krevni-tlak',
        navLabel: 'Vysoký krevní tlak',
        title: 'Lázeňská léčba vysokého krevního tlaku v Mariánských Lázních',
        h1: 'Lázeňská léčba vysokého krevního tlaku',
        metaTitle: 'Léčba vysokého krevního tlaku v lázních | Marienbad.com',
        metaDescription: 'Lázeňská léčba vysokého tlaku v Mariánských Lázních: uhličité koupele, terénní léčba chůzí a dietní poradenství — co ukazují studie, délka pobytu.',
        lead: 'Hypertenze druhého a třetího stupně je položkou českého indikačního seznamu, a Mariánské Lázně ji léčí tím, co tu vyvěrá ze země: uhličitými koupelemi z místní minerální vody a suchými plynovými koupelemi v Mariině plynu, k tomu pohybem v terénu a dietním poradenstvím. Lázeňský pobyt doplňuje léčbu snižující krevní tlak, nenahrazuje ji.',
        teaser: 'Uhličité koupele, suché plynové koupele, terénní léčba a dietní poradenství — jako doplněk k léčbě snižující krevní tlak.',
        treats: [
          'Hypertenze druhého a třetího stupně v probíhající lékařské léčbě',
          'Vysoký krevní tlak s doprovodnou nadváhou nebo nedostatkem pohybu',
          'Vysoký krevní tlak se zvýšenými krevními tuky nebo poruchou metabolismu cukrů',
          'Ubývající fyzická zátěžová kapacita, která krevní tlak spoluudržuje',
          'Přání upravit stravu a pohyb pod lékařským dohledem',
        ],
        notFor: [
          'AV blok druhého až třetího stupně, srdeční selhání ve stadiu NYHA IV a aktivní endokarditida — indikační seznam je vylučuje pro celou skupinu',
          'Neléčený nebo nekompenzovaný vysoký krevní tlak bez lékařské kontroly',
          'Závažné srdeční onemocnění a akutní infekční onemocnění',
          'Slatinné zábaly: silně zatěžují oběh a u nemocí srdce a cév se předepisují jen po individuálním rozhodnutí lékaře',
          'Křížový pramen: jeho vysoký obsah sodíku ho dělá nevhodným pro lidi s vysokým krevním tlakem',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař změří krevní tlak, projde medikaci a přinesené nálezy. Pro skupinu nemocí oběhového ústrojí indikační seznam vyžaduje určitá vstupní vyšetření a abstinenci od nikotinu. Vezměte si aktuální hodnoty, nejlépe z domácího měření, a úplný seznam léků.',
          },
          {
            heading: 'První týden: navyknutí oběhu na zátěž',
            body: 'Procedury začínají uhličitými koupelemi při zhruba 34 °C a krátkými procházkami v terénu. Krevní tlak se pravidelně kontroluje a pitná kúra se sladí — ne každý pramen v lázních se hodí u vysokého krevního tlaku.',
          },
          {
            heading: 'Druhý týden: zvyšování zátěže',
            body: 'Procházky se prodlužují a jsou náročnější, přibývají skupinová cvičení a pohybová terapie ve vodě. Souběžně probíhá dietní poradenství; při nadváze je hubnutí páka, která na krevní tlak nejvíc působí.',
          },
          {
            heading: 'Závěrečná prohlídka a plán pro doma',
            body: 'Vývoj krevního tlaku za dobu pobytu se zhodnotí a písemně zaznamená; zprávu si berete pro svého ošetřujícího lékaře. O případné úpravě medikace rozhoduje výhradně on, ne lázně.',
          },
        ],
        procedures: [
          {
            name: 'Uhličitá koupel z minerální vody',
            detail: 'Koupel v místní minerální vodě při zhruba 34 °C; účinnou látkou je oxid uhličitý přijímaný kůží, nízká teplota drží zátěž oběhu nízkou.',
          },
          {
            name: 'Suchá plynová koupel v Mariině plynu',
            detail: 'Aplikace přírodního oxidu uhličitého z Mariina pramene v uzavřeném vaku — bez vody a bez zátěže teplem, proto u diagnóz srdce a cév často první volba.',
          },
          {
            name: 'Terénní léčba a klimatoterapie',
            detail: 'Vedená chůze po odstupňovaných cestách v lázeňském lese, s postupně narůstající zátěží v 630 metrech nad mořem.',
          },
          {
            name: 'Skupinové cvičení pro hosty s onemocněním srdce a cév',
            detail: 'Vedené jednotky s vytrvalostní, pohyblivostní a dechovou složkou, sestavené pro hosty s podobnou diagnózou.',
          },
          {
            name: 'Pohybová terapie v bazénu',
            detail: 'Cvičení v teplé vodě, která šetří klouby a přitom budují vytrvalost.',
          },
          {
            name: 'Dietní poradenství',
            detail: 'Individuální konzultace k soli, váze a krevním tukům, doplněné lázeňskou dietou po dobu pobytu.',
          },
          {
            name: 'Pitná kúra podle ordinace lékaře',
            detail: 'Který pramen a v jakém množství určuje lékař. Křížový pramen se pro vysoký obsah sodíku u vysokého krevního tlaku nehodí.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Hypertenzní nemoc druhého až třetího stupně je položka II/3 českého indikačního seznamu; přesnou délku hrazeného pobytu najdete na stránce Co hradí pojišťovna u oběhového ústrojí. Samoplátci volí délku po dohodě s lázeňským lékařem; jako odborné minimum platí alespoň 10 procedur během alespoň 10 dní. K ročnímu období existuje odůvodněná úvaha: denní krevní tlak je v zimě vyšší než v létě, především vlivem chladu, a v chladném období nastává víc kardiovaskulárních příhod — pobyt na podzim tak předchází zátěžový vrchol.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'Přehledová práce ke koupelím v přírodní termální minerální vodě u vysokého krevního tlaku dochází k závěru, že koupele — samotné, jako doplněk k lékům nebo v kombinaci s dalšími opatřeními — nemaly nežádoucí účinky a ve většině zahrnutých studií krevní tlak ovlivnily příznivě (Yuan a kol., 2019, Int J Biometeorol; velmi rozdílné intervence, metodicky slabší studie, žádná metaanalýza). Mini-přehled popisuje u různých forem hydro- a balneoterapie snižující účinek na krevní tlak jako doplněk k léčbě a jako mechanismy uvádí teplo, regulaci srdeční frekvence a baroreceptory; autoři žádají další klinické studie (Moini Jazani a kol., 2023; mini-review bez systematické metodiky). Ve studii typu před–po s 35 pacienty klesl po třech týdnech balneoterapie s uhličitými koupelemi a peloidy 24hodinový krevní tlak u osob se středními a vysokými výchozími hodnotami, u nízkých výchozích hodnot se nezměnil (Ekmekcioglu a kol., 2000, Altern Ther Health Med; bez kontrolní skupiny). K bezpečnosti existuje randomizovaná studie: 15 koupelí při 38 °C nevedlo u pacientů s vysokým krevním tlakem a nadváhou k nepříznivým změnám metabolických a zánětlivých hodnot, balneoterapie tedy u těchto diagnóz není kontraindikovaná (Oláh a kol., 2011; sledovány byly laboratorní hodnoty, ne klinické cílové parametry). Žádná z těchto studií neprokazuje, že by lázeňský pobyt mohl nahradit léky snižující krevní tlak.',
        },
        physicianNote: 'O tom, zda a v jakém rozsahu pro vás při vysokém krevním tlaku připadá v úvahu lázeňský pobyt, rozhoduje lázeňský lékař při vstupní prohlídce podle vašich hodnot a nálezů. O vaší medikaci rozhoduje výhradně váš ošetřující lékař; neměňte ji bez jeho souhlasu. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        faqs: [
          {
            question: 'Snižuje lázeňský pobyt krevní tlak?',
            answer: 'Dostupné studie naznačují, že koupele v minerální vodě mohou jako doplněk k léčbě příznivě ovlivnit krevní tlak. Ve studii typu před–po s 35 pacienty klesl po třech týdnech balneoterapie 24hodinový krevní tlak u osob se zvýšenými výchozími hodnotami, u nízkých hodnot zůstal beze změny; tato studie neměla kontrolní skupinu. Přehledová práce zjistila ve většině zahrnutých studií příznivý účinek bez nežádoucích projevů, upozorňuje ale na slabší metodiku. Léky snižující krevní tlak podle těchto dat lázeňský pobyt nenahrazuje.',
          },
          {
            question: 'Hradí pojišťovna lázně při vysokém krevním tlaku?',
            answer: 'Hypertenzní nemoc druhého až třetího stupně je položka II/3 českého indikačního seznamu; přesnou délku hrazeného pobytu najdete na stránce Co hradí pojišťovna u oběhového ústrojí. Hosté s pojištěním mimo Česko si úhradu ověřují předem u vlastní pojišťovny.',
          },
          {
            question: 'Který pramen mohu pít při vysokém krevním tlaku?',
            answer: 'To určuje lázeňský lékař, stejně jako množství; nepijte nikdy víc, než je předepsáno. Jedno omezení je známé: Křížový pramen obsahuje hodně sodíku a pro lidi s vysokým krevním tlakem i pro srdeční pacienty se nehodí. Prameny v lázních se chemicky výrazně liší, proto se pitná kúra vždy předepisuje individuálně.',
          },
          {
            question: 'Jsou slatinné zábaly při vysokém krevním tlaku dovolené?',
            answer: 'Jen po individuálním rozhodnutí lékaře. Slatinný zábal je tepelně náročná procedura při teplotě až 40 °C a představuje výraznou zátěž pro srdce a oběh; u nemocí srdce a cév a ve vyšším věku je na místě opatrnost. Kde má smysl procedura s oxidem uhličitým, volí se často místo toho suchá plynová koupel, která se zátěží teplem nepracuje.',
          },
          {
            question: 'Musím během pobytu vysadit léky na tlak?',
            answer: 'Ne. Svou doma předepsanou medikaci neměňte bez souhlasu svého lékaře. Lázeňský lékař krevní tlak během pobytu kontroluje a vývoj zaznamená do závěrečné zprávy; zda z toho vyplyne úprava, rozhoduje váš ošetřující lékař doma.',
          },
        ],
        sources: [
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina II — položka II/3',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Hypertenzní nemoc II. až III. stupně, s typem péče a délkou pobytu.',
          },
          {
            title: 'Vyhláška č. 2/2015 Sb. o odborných kritériích lázeňské léčebně rehabilitační péče — skupina II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Úplné znění indikačního seznamu pro nemoci oběhového ústrojí včetně kontraindikací (AV blok II. až III. stupně, NYHA IV, aktivní endokarditida), požadované abstinence od nikotinu a vstupních vyšetření.',
          },
          {
            title: 'Yuan H a kol. 2019, Int J Biometeorol — přehled ke koupelím v přírodní termální minerální vodě u hypertenze',
            url: 'https://doi.org/10.1007/s00484-019-01780-4',
            note: 'Koupele samotné, jako doplněk k lékům i v kombinaci s dalšími opatřeními nemaly nežádoucí účinky a ve většině studií ovlivnily krevní tlak příznivě. Heterogenní intervence, žádná metaanalýza.',
          },
          {
            title: 'Moini Jazani A a kol. 2023, Int J Biometeorol — mini-přehled k účinku hydro-, balneo- a lázeňské terapie na krevní tlak',
            url: 'https://doi.org/10.1007/s00484-023-02512-5',
            note: 'Různé formy mohou jako doplňková léčba snižovat krevní tlak; jako mechanismy jsou uváděny teplo, regulace srdeční frekvence a baroreceptory. Mini-review bez systematické metodiky.',
          },
          {
            title: 'Ekmekcioglu C a kol. 2000, Altern Ther Health Med — studie typu před–po, 35 pacientů, 24hodinové měření krevního tlaku',
            url: 'https://consensus.app/papers/details/39ccd0edaff45a03b6103309fbe833bc/',
            note: 'Po 3 týdnech balneoterapie s CO₂ koupelemi a peloidy klesl 24hodinový krevní tlak u středních a vysokých výchozích hodnot; u nízkých beze změny. Bez kontrolní skupiny.',
          },
          {
            title: 'Oláh M a kol. 2011 — randomizovaná studie k balneoterapii u hypertenze a obezity (15 koupelí, 38 °C)',
            url: 'https://consensus.app/papers/details/56a643895d4a59608b3486b000ee0c38/',
            note: '15 koupelí při 38 °C nevedlo k nepříznivým změnám metabolických a zánětlivých parametrů; balneoterapie u těchto diagnóz není kontraindikovaná. Sledovány laboratorní hodnoty, ne klinické cílové parametry.',
          },
          {
            title: 'Narita K, Hoshide S, Kario K 2021, Hypertens Res — přehled k sezónnímu kolísání krevního tlaku',
            url: 'https://doi.org/10.1038/s41440-021-00732-z',
            note: 'Denní krevní tlak je v zimě vyšší než v létě, především vlivem chladu; zimní nárůst souvisí s víc kardiovaskulárními příhodami. Netýká se lázeňské léčby.',
          },
          {
            title: 'Pagourelias ED a kol. 2011, Int J Biometeorol — přehled k CO₂ balneoterapii u nemocí srdce a cév',
            url: 'https://consensus.app/papers/details/cffd890e39e252b5bf9e66f5a36c8ff6/',
            note: 'Tři hlavní účinky: pokles tělesné teploty, silnější prokrvení kůže, pocit tepla; autoři žádají metodicky lepší studie.',
          },
        ],
        related: [
          {
            label: 'Srdce a cévy před zimou',
            href: '/cs/magazin/lazenska-lecba-obehoveho-ustroji',
          },
          {
            label: 'Lázeňská léčba ischemické choroby srdeční',
            href: '/cs/lazenska-lecba/ischemicka-choroba-srdecni',
          },
          {
            label: 'CO₂ koupele: Co říká věda',
            href: '/cs/magazin/co2-koupele-veda',
          },
          {
            label: 'Co hradí pojišťovna u oběhového ústrojí',
            href: '/cs/lazne-s-pojistovnou/indikace/obehove-ustroji',
          },
        ],
      },
      ru: {
        slug: 'gipertoniya',
        navLabel: 'Гипертония',
        title: 'Курортное лечение гипертонии в Марианских Лазнях',
        h1: 'Курортное лечение гипертонии',
        metaTitle: 'Лечение гипертонии в Марианских Лазнях — ход и сроки',
        metaDescription: 'Курортное лечение гипертонии в Марианских Лазнях: углекислые ванны, терренкур и консультации по питанию — что показывают исследования, сколько длится лечение.',
        lead: 'Гипертония второй и третьей степени включена в чешский индикационный список, и в Марианских Лазнях её лечат тем, что даёт здешняя земля: углекислыми ваннами из местной минеральной воды и сухими газовыми ваннами в марианском газе, а также движением на местности и консультациями по питанию. Курортное лечение дополняет гипотензивную медикацию, а не заменяет её.',
        teaser: 'Углекислые ванны, сухие газовые ванны, терренкур и консультации по питанию — как дополнение к гипотензивному лечению.',
        treats: [
          'Гипертония второй и третьей степени при текущем врачебном наблюдении',
          'Гипертония с сопутствующим избыточным весом или недостатком движения',
          'Гипертония с повышенными показателями липидов крови или нарушением углеводного обмена',
          'Снижение физической выносливости, поддерживающее повышенное давление',
          'Желание изменить питание и двигательную активность под врачебным наблюдением',
        ],
        notFor: [
          'АВ-блокада второй-третьей степени, сердечная недостаточность стадии NYHA IV и активный эндокардит — индикационный список исключает их для всей группы',
          'Нелеченая или неконтролируемая гипертония без врачебного контроля',
          'Тяжёлое заболевание сердца, а также острые инфекционные заболевания',
          'Торфяные обёртывания: они создают значительную нагрузку на кровообращение и при сердечно-сосудистых заболеваниях назначаются только по индивидуальному решению врача',
          'Крестовый источник: высокое содержание натрия делает его неподходящим для людей с гипертонией',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач измеряет давление, изучает медикацию и принесённые заключения. Для группы заболеваний системы кровообращения индикационный список требует определённых первичных обследований и отказа от курения. Возьмите с собой актуальные показатели, желательно из домашних самостоятельных измерений, и полный список лекарств.',
          },
          {
            heading: 'Первая неделя: адаптация кровообращения к нагрузке',
            body: 'Процедуры начинаются с углекислых ванн при температуре около 34 °C и коротких прогулок по местности. Давление регулярно контролируют, а питьевой курс подбирают индивидуально — не каждый источник в городе подходит при гипертонии.',
          },
          {
            heading: 'Вторая неделя: увеличение нагрузки',
            body: 'Прогулки становятся длиннее и с более выраженным подъёмом, добавляются групповые занятия и двигательная терапия в воде. Параллельно проходят консультации по питанию; при избыточном весе снижение массы тела — тот рычаг, который влияет на давление.',
          },
          {
            heading: 'Заключительное обследование и план на дом',
            body: 'Динамика давления за время пребывания анализируется и фиксируется письменно; заключение вы забираете для своего лечащего врача. Будет ли и как скорректирована медикация, решает исключительно он, а не курорт.',
          },
        ],
        procedures: [
          {
            name: 'Углекислая ванна в минеральной воде',
            detail: 'Ванна в местной минеральной воде при температуре около 34 °C; действующее вещество — углекислый газ, проникающий через кожу, а низкая температура удерживает нагрузку на кровообращение на низком уровне.',
          },
          {
            name: 'Сухая газовая ванна в марианском газе',
            detail: 'Применение природного углекислого газа источника Марии в герметичном мешке — без воды и без тепловой нагрузки, поэтому при сердечно-сосудистых диагнозах часто становится первым выбором.',
          },
          {
            name: 'Терренкур и климатотерапия',
            detail: 'Ходьба под руководством инструктора по размеченным маршрутам курортного леса с постепенно возрастающей нагрузкой на высоте 630 метров.',
          },
          {
            name: 'Групповые занятия для гостей с сердечно-сосудистыми заболеваниями',
            detail: 'Занятия под руководством инструктора с элементами на выносливость, подвижность и дыхание, составленные для гостей со схожим диагнозом.',
          },
          {
            name: 'Двигательная терапия в бассейне',
            detail: 'Упражнения в тёплой воде, которые щадят суставы и при этом развивают выносливость.',
          },
          {
            name: 'Консультация по питанию',
            detail: 'Индивидуальные беседы о соли, весе и липидах крови, сопровождаемые курортной диетой во время пребывания.',
          },
          {
            name: 'Питьевой курс по врачебному назначению',
            detail: 'Какой источник и в каком количестве, определяет врач. Крестовый источник из-за высокого содержания натрия не подходит при гипертонии.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'Гипертоническая болезнь второй-третьей степени относится к позиции II/3 чешского индикационного списка. Для пребываний, оплачиваемых чешской страховой, в качестве базового пребывания предусмотрено 28 дней комплексного курортного лечения или 21 день долевого лечения; повторное пребывание проходит как 21 день долевого лечения, в отдельных случаях 14. Гости, оплачивающие лечение самостоятельно, согласуют срок с курортным врачом; профессиональным минимумом считается не менее 10 процедур за не менее чем 10 дней. Относительно времени года есть обоснованное соображение: суточное давление зимой выше, чем летом, в первую очередь из-за холода, а в холодное время года чаще происходят сердечно-сосудистые события — пребывание осенью, таким образом, приходится на период перед пиком нагрузки.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'Обзорная работа о купании в природной термальной минеральной воде при гипертонии приходит к выводу, что ванны — отдельно, в дополнение к лекарствам или в сочетании с другими мерами — не вызывали нежелательных эффектов и в большинстве включённых исследований благоприятно влияли на давление (Yuan et al., 2019, Int J Biometeorol; очень разнородные вмешательства, методически более слабые исследования, без метаанализа). Мини-обзор описывает для разных форм гидро- и бальнеотерапии гипотензивный эффект как дополнение к лечению и называет в качестве механизмов тепло, регуляцию частоты сердечных сокращений и барорецепторы; авторы призывают к дальнейшим клиническим исследованиям (Moini Jazani et al., 2023; мини-обзор без систематической методологии). В исследовании «до и после» с 35 пациентами измеренное за 24 часа давление снизилось после трёх недель бальнеотерапии с углекислыми ваннами и пелоидами у лиц с средними и высокими исходными значениями, при низких исходных значениях оно не изменилось (Ekmekcioglu et al., 2000, Altern Ther Health Med; без контрольной группы). Относительно безопасности есть рандомизированное исследование: 15 ванн при 38 °C не привели у пациентов с гипертонией и избыточным весом к неблагоприятным изменениям показателей обмена веществ и воспаления, то есть бальнеотерапия при этих диагнозах не противопоказана (Oláh et al., 2011; наблюдались лабораторные показатели, а не клинические конечные точки). Ни одно из этих исследований не показывает, что курортное лечение может заменить гипотензивные препараты.',
        },
        physicianNote: 'Возможно ли и в каком объёме курортное лечение при вашей гипертонии, решает курортный врач при первичном осмотре на основании ваших показателей и заключений. О вашей медикации решает исключительно ваш лечащий врач; не меняйте её без его согласия. Эта страница носит информационный характер и не заменяет консультацию врача.',
        faqs: [
          {
            question: 'Снижает ли курортное лечение давление?',
            answer: 'Имеющиеся исследования указывают на то, что ванны в минеральной воде могут благоприятно влиять на давление как дополнение к лечению. В исследовании «до и после» с 35 пациентами суточное давление снизилось после трёх недель бальнеотерапии у лиц с повышенными исходными значениями, при низких значениях оно осталось неизменным; это исследование не имело контрольной группы. Обзорная работа обнаружила в большинстве включённых исследований благоприятный эффект без нежелательных явлений, но указывает на более слабую методологию. Гипотензивные препараты, согласно этим данным, курортное лечение не заменяет.',
          },
          {
            question: 'Оплачивается ли курортное лечение при гипертонии?',
            answer: 'Гипертоническая болезнь второй-третьей степени — это позиция II/3 чешского индикационного списка: для застрахованных в чешской страховой компании в качестве базового пребывания предусмотрено 28 дней комплексного курортного лечения или 21 день долевого лечения, повторное пребывание проходит как 21 или 14 дней долевого лечения. Гости со страховкой за пределами Чехии заранее уточняют возможность возмещения у своего страховщика.',
          },
          {
            question: 'Какой источник можно пить при гипертонии?',
            answer: 'Это определяет курортный врач, а также количество; никогда не пейте больше назначенного. Известно одно ограничение: Крестовый источник содержит много натрия и не подходит людям с гипертонией, а также пациентам с заболеваниями сердца. Источники города существенно различаются по химическому составу, поэтому питьевой курс всегда назначают индивидуально.',
          },
          {
            question: 'Разрешены ли торфяные обёртывания при гипертонии?',
            answer: 'Только по индивидуальному решению врача. Торфяное обёртывание — это интенсивная тепловая процедура при температуре до 40 °C и, соответственно, значительная нагрузка на сердце и кровообращение; при сердечно-сосудистых заболеваниях и в пожилом возрасте требуется осторожность. Там, где целесообразна процедура с углекислым газом, вместо этого часто выбирают сухую газовую ванну, которая обходится без тепловой нагрузки.',
          },
          {
            question: 'Нужно ли отменять гипотензивные препараты во время курортного лечения?',
            answer: 'Нет. Не меняйте назначенную дома медикацию без согласия вашего врача. Курортный врач контролирует давление во время пребывания и фиксирует динамику в итоговом заключении; последует ли из этого корректировка, решает ваш лечащий врач дома.',
          },
        ],
        sources: [
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа II — позиция II/3',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Гипертоническая болезнь II-III степени: базовое пребывание — 28 дней комплексного лечения или 21 день долевого лечения; повторное пребывание — 21 день долевого лечения (в отдельных случаях 14).',
          },
          {
            title: 'Постановление № 2/2015 Сб. о профессиональных критериях курортной реабилитационной помощи — группа II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Полный текст индикационного списка для заболеваний системы кровообращения, включая противопоказания (АВ-блокада II-III степени, NYHA IV, активный эндокардит), требуемый отказ от курения и первичные обследования. Текст на чешском языке.',
          },
          {
            title: 'Yuan H et al. 2019, Int J Biometeorol — обзор по купанию в природной термальной минеральной воде при гипертонии',
            url: 'https://doi.org/10.1007/s00484-019-01780-4',
            note: 'Ванны отдельно, как дополнение к лекарствам и в комбинации с другими мерами не вызывали нежелательных эффектов и в большинстве исследований благоприятно влияли на давление. Разнородные вмешательства, без метаанализа.',
          },
          {
            title: 'Moini Jazani A et al. 2023, Int J Biometeorol — мини-обзор о влиянии гидро-, бальнео- и курортной терапии на давление',
            url: 'https://doi.org/10.1007/s00484-023-02512-5',
            note: 'Разные формы могут в качестве дополнительного лечения снижать давление; названные механизмы — тепло, регуляция частоты сердечных сокращений и барорецепторы. Мини-обзор без систематической методологии.',
          },
          {
            title: 'Ekmekcioglu C et al. 2000, Altern Ther Health Med — исследование «до и после», 35 пациентов, суточное измерение давления',
            url: 'https://consensus.app/papers/details/39ccd0edaff45a03b6103309fbe833bc/',
            note: 'После 3 недель бальнеотерапии с CO₂-ваннами и пелоидами суточное давление снизилось при средних и высоких исходных значениях; при низких — без изменений. Без контрольной группы.',
          },
          {
            title: 'Oláh M et al. 2011 — рандомизированное исследование бальнеотерапии при гипертонии и ожирении (15 ванн, 38 °C)',
            url: 'https://consensus.app/papers/details/56a643895d4a59608b3486b000ee0c38/',
            note: '15 ванн при 38 °C не привели к неблагоприятным изменениям показателей обмена веществ и воспаления; бальнеотерапия при этих диагнозах не противопоказана. Наблюдались лабораторные показатели, а не клинические конечные точки.',
          },
          {
            title: 'Narita K, Hoshide S, Kario K 2021, Hypertens Res — обзор о сезонных колебаниях давления',
            url: 'https://doi.org/10.1038/s41440-021-00732-z',
            note: 'Суточное давление зимой выше, чем летом, в первую очередь из-за холода; зимнее повышение связано с большим числом сердечно-сосудистых событий. Не относится к курортному лечению.',
          },
          {
            title: 'Pagourelias ED et al. 2011, Int J Biometeorol — обзор по CO₂-бальнеотерапии при сердечно-сосудистых заболеваниях',
            url: 'https://consensus.app/papers/details/cffd890e39e252b5bf9e66f5a36c8ff6/',
            note: 'Три основных эффекта: снижение температуры тела, усиление кровоснабжения кожи, ощущение тепла; авторы призывают к методически более качественным исследованиям.',
          },
        ],
        related: [
          {
            label: 'Сердце и сосуды перед зимой',
            href: '/ru/zhurnal/kurortnoe-lechenie-serdca-i-sosudov',
          },
          {
            label: 'Курортное лечение ишемической болезни сердца',
            href: '/ru/kurortnoe-lechenie/ishemicheskaya-bolezn-serdca',
          },
          {
            label: 'Углекислые ванны — что показывает наука',
            href: '/ru/zhurnal/co2-vanny-nauka',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'ischaemic-heart',
    groupId: 'circulatory',
    roman: 'II',
    codes: [
      'II/1',
      'II/2',
    ],
    conditionName: 'Ischaemic heart disease',
    icd10: 'I25',
    image: '/images/library/treatments/co2-gas-wrap-relax.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Kurgast liegt im abgedichteten Beutel eines trockenen Gasbads mit natürlichem Kohlendioxid',
      en: 'A spa guest lying in the sealed bag of a dry gas bath with natural carbon dioxide',
      cs: 'Lázeňský host leží v uzavřeném vaku suché plynové koupele s přírodním oxidem uhličitým',
      ru: 'Гость лечения лежит в герметичном мешке для сухой газовой ванны с природным углекислым газом',
    },
    content: {
      de: {
        slug: 'koronare-herzkrankheit',
        navLabel: 'Koronare Herzkrankheit',
        title: 'Kur bei koronarer Herzkrankheit in Marienbad',
        h1: 'Kur bei koronarer Herzkrankheit und nach Herzinfarkt',
        metaTitle: 'Kur bei koronarer Herzkrankheit in Marienbad — Dauer',
        metaDescription: 'Kur bei koronarer Herzkrankheit und nach Herzinfarkt in Marienbad: trockene Gasbäder, Terrainkur, Übungen — Ablauf, Dauer und Grenzen.',
        lead: 'Die symptomatische koronare Herzkrankheit und der Zustand nach einem Herzinfarkt stehen als eigene Positionen auf der tschechischen Indikationsliste. In Marienbad läuft die Behandlung über dosierte Bewegung im Gelände, Gruppenübungen für Herzgäste und die örtlichen Anwendungen mit Kohlendioxid — immer unter ärztlicher Kontrolle und immer als Ergänzung zur kardiologischen Behandlung.',
        teaser: 'Trockene Gasbäder, Terrainkur und Übungen für Herzgäste — als Ergänzung zur kardiologischen Behandlung, nach Freigabe des Kardiologen.',
        treats: [
          'Symptomatische koronare Herzkrankheit in stabilem, kardiologisch geführtem Zustand',
          'Zustand nach Herzinfarkt, nach Abschluss der akuten Behandlung und mit Freigabe des Kardiologen',
          'Nachlassende Belastbarkeit und Unsicherheit beim Wiederaufnehmen von Bewegung',
          'Begleitende Risikofaktoren wie Übergewicht, erhöhte Blutfette, Bluthochdruck oder Bewegungsmangel',
          'Zustand nach Eingriffen am Gefäßsystem außerhalb des Herzens und nach perkutaner Angioplastie',
        ],
        notFor: [
          'Instabile Angina pectoris sowie frischer Herzinfarkt ohne abgeschlossene Akutbehandlung',
          'Herzinsuffizienz im Stadium NYHA IV, AV-Block zweiten bis dritten Grades und aktive Endokarditis — die Indikationsliste schließt sie für die ganze Gruppe aus',
          'Schwere Herzerkrankung, die in der allgemeinen Kontraindikationsliste des Kurorts steht',
          'Fehlende Freigabe des Kardiologen oder fehlende Eingangsuntersuchungen, die die Indikationsliste für die Gruppe II verlangt',
          'Fortgesetztes Rauchen: die Indikationsliste verlangt für die Kreislaufgruppe Nikotinabstinenz',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt sichtet Ihre kardiologischen Befunde und die Medikation, misst Blutdruck und Puls und beurteilt die Belastbarkeit. Bringen Sie die Freigabe Ihres Kardiologen sowie die Untersuchungen mit, die die Indikationsliste für die Gruppe der Kreislaufkrankheiten fordert; ohne sie kann der Plan nicht vollständig aufgestellt werden.',
          },
          {
            heading: 'Erste Woche: Belastung vorsichtig anlegen',
            body: 'Begonnen wird mit kurzen, flachen Gehstrecken und Gruppenübungen mit niedriger Intensität. Aus den örtlichen Heilmitteln kommt meist das trockene Gasbad zum Einsatz, weil es ohne Wärmebelastung für den Kreislauf auskommt.',
          },
          {
            heading: 'Zweite Woche: Ausdauer aufbauen',
            body: 'Die Wege werden länger und die Steigungen größer, immer in abgestuften Etappen und mit Kontrolle von Puls und Blutdruck. Parallel läuft die Ernährungsberatung zu Blutfetten, Salz und Gewicht.',
          },
          {
            heading: 'Abschlussuntersuchung und Plan für zu Hause',
            body: 'Belastbarkeit und Verlauf werden beurteilt und schriftlich festgehalten; den Bericht nehmen Sie für Ihren Kardiologen mit. Sie erhalten ein Bewegungsprogramm für zu Hause — der Nutzen hängt daran, dass es fortgeführt wird.',
          },
        ],
        procedures: [
          {
            name: 'Trockenes Gasbad im Mariengas',
            detail: 'Das natürliche Kohlendioxid der Marienquelle wird in einem abgedichteten Beutel angewandt, ohne Wasser und ohne Wärmebelastung — deshalb bei Herzdiagnosen häufig die erste Wahl.',
          },
          {
            name: 'Gasinjektionen mit Mariengas',
            detail: 'Unter die Haut gesetzte Injektionen des natürlichen Kohlendioxids; sie gehören in Marienbad zum Programm bei ischämischer Herzkrankheit und werden ausschließlich vom Arzt verordnet.',
          },
          {
            name: 'Kohlensäurebad im Mineralwasser',
            detail: 'Bad bei rund 34 °C; die niedrige Temperatur hält die Kreislaufbelastung gering, während das Kohlendioxid über die Haut aufgenommen wird.',
          },
          {
            name: 'Terrainkur und Klimatherapie',
            detail: 'Geführtes Gehen auf abgestuften Wegen mit schrittweise steigender Belastung, in 630 Metern Höhe und unter ärztlicher Kontrolle.',
          },
          {
            name: 'Gruppenübungen für Herzgäste',
            detail: 'Geleitete Einheiten, die eigens für kardiologische Diagnosen zusammengestellt sind, mit Atem-, Ausdauer- und Beweglichkeitsanteilen.',
          },
          {
            name: 'Bewegungstherapie im Becken',
            detail: 'Übungen im warmen Wasser, die Gelenke schonen und die Belastung gut dosieren lassen.',
          },
          {
            name: 'Ernährungsberatung',
            detail: 'Einzelgespräche zu Blutfetten, Salz und Gewicht, begleitet von der Kurdiät während des Aufenthalts.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Die tschechische Indikationsliste unterscheidet hier zwei Positionen. Die symptomatische ischämische Herzkrankheit (II/1) sieht als Grundaufenthalt 21 Tage Zuschussbehandlung vor, der Wiederholungsaufenthalt läuft ebenfalls über 21 Tage Zuschussbehandlung, in bestimmten Fällen über 14. Für den Zustand nach einem Herzinfarkt (II/2) sind 28 Tage komplexe Kurbehandlung vorgesehen; eine gesonderte Wiederholungsposition gibt es dafür nicht. Selbstzahler stimmen die Dauer mit dem Kurarzt und dem Kardiologen ab. Der Zeitpunkt richtet sich nach dem kardiologischen Verlauf, nicht nach der Jahreszeit.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body: 'Am besten belegt ist der Bewegungsanteil der Kur, nicht das Bad. Ein Cochrane-Review zur bewegungsbasierten kardiologischen Rehabilitation bei koronarer Herzkrankheit fand innerhalb von zwölf Monaten ein geringeres Risiko für einen Herzinfarkt (RR 0,72) und für Krankenhausaufenthalte (RR 0,58), wahrscheinlich auch eine leicht niedrigere Gesamtsterblichkeit, langfristig eine niedrigere kardiovaskuläre Sterblichkeit sowie eine etwas bessere Lebensqualität (Dibben et al., 2021, Cochrane Database Syst Rev). Wichtig für die Einordnung: Untersucht wurden ambulante und klinische Rehabilitationsprogramme, nicht Kuraufenthalte, weniger als 15 Prozent der Teilnehmenden waren Frauen, und die Berichtsqualität der Einzelstudien schwankt. Für die Anwendungen mit Kohlendioxid selbst beschreibt eine Übersichtsarbeit drei Haupteffekte — Abfall der Körpertemperatur, stärkere Hautdurchblutung und Wärmegefühl — und fordert methodisch bessere Studien (Pagourelias et al., 2011, Int J Biometeorol). Keine dieser Arbeiten zeigt, dass eine Kur die kardiologische Behandlung oder ihre Medikamente ersetzen kann.',
        },
        physicianNote: 'Ob und wann eine Kur bei Ihrer Herzerkrankung infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand der kardiologischen Befunde und der Freigabe Ihres Kardiologen. Der Aufenthalt ergänzt die kardiologische Behandlung und ersetzt weder sie noch Ihre Medikamente; ändern Sie diese nicht ohne Zustimmung Ihres Arztes. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        ongoing: {
          heading: 'Erfahrung und laufende Forschung',
          body: 'Trockene Gasbäder, Gasinjektionen und die geführte Terrainkur gehören in Marienbad seit langem zum Programm für Herzgäste; der Kurarzt dosiert die Belastung nach dem kardiologischen Befund und aus klinischer Erfahrung. Wie es dem einzelnen Gast dabei ergeht, bleibt nicht ungeprüft: Jeder Behandlungsaufenthalt beginnt mit einer Eingangs- und endet mit einer Abschlussuntersuchung samt schriftlichem Abschlussbericht, sodass der Verlauf dokumentiert ist und der Kurarzt den Plan unterwegs anpassen kann. Für die Kurmedizin als Fach entsteht derzeit erstmals seit Langem systematische Evidenz. Das Institut lázeňství a balneologie, v.v.i., die 2019 vom Karlsbader Kreis gegründete Forschungseinrichtung für Kurwesen und Balneologie, führt seit 2026 gemeinsam mit den Léčebné lázně Mariánské Lázně die erste klinische Studie dieses Formats seit dreißig Jahren durch. Sie betrifft urologische und nephrologische Diagnosen, nicht die auf dieser Seite beschriebene: Mehr als hundert Patienten werden vor und nach dem Kuraufenthalt auf Gesundheitszustand und Lebensqualität untersucht, fachlicher Garant ist prim. MUDr. Ladislav Špišák, CSc.; Ergebnisse liegen noch nicht vor. Die Studie läuft im Projekt Zentrum für Kurforschung (2024 bis 2027), das aus dem Operationellen Programm Gerechter Übergang finanziert wird und mit der Tschechischen Technischen Universität, der Westböhmischen Universität und der Akademie der Wissenschaften der Tschechischen Republik zusammenarbeitet. Was dabei herauskommen kann, zeigt die frühere Zusammenarbeit desselben Instituts mit den Marienbader Kurhäusern: Die gemeinsame Studie zur Kurrehabilitation nach COVID-19 erhielt 2021 den Innovation Award der European Spas Association in der Kategorie Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Darf ich nach einem Herzinfarkt zur Kur?',
            answer: 'Ja, nach Abschluss der Akutbehandlung und mit Freigabe des Kardiologen. Der Zustand nach einem Herzinfarkt ist Position II/2 der tschechischen Indikationsliste und sieht 28 Tage komplexe Kurbehandlung vor. Ausgeschlossen sind instabile Verläufe sowie die Zustände, die die Indikationsliste für die ganze Kreislaufgruppe ausschließt: AV-Block zweiten bis dritten Grades, Herzinsuffizienz im Stadium NYHA IV und aktive Endokarditis.',
          },
          {
            question: 'Was bringt eine Kur bei koronarer Herzkrankheit?',
            answer: 'Der Teil mit der besten Evidenz ist die dosierte Bewegung. Ein Cochrane-Review zur bewegungsbasierten kardiologischen Rehabilitation fand innerhalb von zwölf Monaten weniger Herzinfarkte und weniger Krankenhausaufenthalte sowie langfristig eine niedrigere kardiovaskuläre Sterblichkeit — allerdings in ambulanten und klinischen Programmen, nicht in Kuraufenthalten. In Marienbad kommen die geführte Terrainkur, Gruppenübungen für Herzgäste und die Anwendungen mit Kohlendioxid zusammen, unter täglicher ärztlicher Kontrolle.',
          },
          {
            question: 'Muss ich für die Kur mit dem Rauchen aufhören?',
            answer: 'Für Aufenthalte, die über die tschechische Indikationsliste laufen, ja: Für die Gruppe der Kreislaufkrankheiten ist Nikotinabstinenz eine Voraussetzung, die in der Verordnung selbst steht. Unabhängig davon ist das Rauchen der Risikofaktor, der den Nutzen eines Kuraufenthalts bei dieser Diagnose am stärksten begrenzt.',
          },
          {
            question: 'Welche Anwendung ist bei Herzerkrankungen die schonendste?',
            answer: 'Meist das trockene Gasbad im Mariengas. Es wirkt über das Kohlendioxid, das durch die Haut aufgenommen wird, kommt aber ohne Wasser und ohne Wärmebelastung aus. Moorpackungen sind dagegen eine wärmeintensive Anwendung und für Menschen mit Herz-Kreislauf-Erkrankungen eine deutliche Belastung; über ihre Eignung entscheidet immer der Arzt.',
          },
          {
            question: 'Welche Unterlagen soll ich mitbringen?',
            answer: 'Die Freigabe und den aktuellen Befund Ihres Kardiologen, eine vollständige Medikamentenliste und die Untersuchungen, die die Indikationsliste für die Gruppe der Kreislaufkrankheiten verlangt. Je vollständiger die Unterlagen, desto genauer kann der Kurarzt die Belastung dosieren; fehlen sie, fällt der Plan vorsichtiger aus.',
          },
        ],
        sources: [
          {
            title: 'Klinische Studie zu den objektiven Wirkungen der komplexen Kurbehandlung bei urologischen und nephrologischen Diagnosen (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Laufende Studie des Instituts lázeňství a balneologie mit den Léčebné lázně Mariánské Lázně, mehr als hundert Patienten, Beginn 2026. Sie betrifft urologische und nephrologische Diagnosen; Ergebnisse liegen noch nicht vor.',
          },
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe II — Positionen II/1 und II/2',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Symptomatische ischämische Herzkrankheit: Grundaufenthalt 21 Tage Zuschussbehandlung, Wiederholungsaufenthalt 21 (in bestimmten Fällen 14) Tage. Zustand nach Herzinfarkt: 28 Tage komplexe Kurbehandlung ohne gesonderte Wiederholungsposition.',
          },
          {
            title: 'Verordnung Nr. 2/2015 Slg. über die fachlichen Kriterien der kurmedizinischen Rehabilitationspflege — Gruppe II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Vollständiger Wortlaut der Indikationsliste für Kreislaufkrankheiten samt Kontraindikationen (AV-Block II. bis III. Grades, NYHA IV, aktive Endokarditis), geforderter Nikotinabstinenz und Eingangsuntersuchungen. Tschechischer Text.',
          },
          {
            title: 'Dibben G et al. 2021, Cochrane Database Syst Rev — Review zur bewegungsbasierten kardiologischen Rehabilitation bei koronarer Herzkrankheit',
            url: 'https://doi.org/10.1002/14651858.CD001800.pub4',
            note: 'Innerhalb von 12 Monaten weniger Herzinfarkte (RR 0,72) und Krankenhausaufenthalte (RR 0,58), langfristig niedrigere kardiovaskuläre Sterblichkeit. Ambulante und klinische Programme, nicht Kurbehandlung; unter 15 % Frauen.',
          },
          {
            title: 'Pagourelias ED et al. 2011, Int J Biometeorol — Übersicht zur CO₂-Balneotherapie bei Herz-Kreislauf-Erkrankungen',
            url: 'https://consensus.app/papers/details/cffd890e39e252b5bf9e66f5a36c8ff6/',
            note: 'Drei Haupteffekte: Abfall der Körpertemperatur, stärkere Hautdurchblutung, Wärmegefühl; die Autoren fordern methodisch bessere Studien.',
          },
          {
            title: 'Resch KL, Just U 1994, Wien Med Wochenschr — Übersicht zu Möglichkeiten und Grenzen der CO₂-Balneotherapie',
            url: 'https://consensus.app/papers/details/624f01a417885d7f9c0caf162686c4cc/',
            note: 'Kontrollierte Belege nur für periphere arterielle Verschlusskrankheit, trophische Ulzera, Mikroangiopathien und leichte Hypertonie. Ältere Übersicht.',
          },
        ],
        related: [
          {
            label: 'Herz und Gefäße vor dem Winter',
            href: '/de/magazin/kur-herz-kreislauf-marienbad',
          },
          {
            label: 'Kur bei Bluthochdruck',
            href: '/de/kur-bei/bluthochdruck',
          },
          {
            label: 'Gasinjektionen mit Mariengas',
            href: '/de/magazin/gas-injektionen-co2',
          },
          {
            label: 'Indikationen und Kontraindikationen',
            href: '/de/indikationen-und-kontraindikationen',
          },
        ],
      },
      en: {
        slug: 'coronary-heart-disease',
        navLabel: 'Coronary heart disease',
        title: 'Spa treatment for coronary heart disease in Marienbad',
        h1: 'Spa treatment for coronary heart disease and after a heart attack',
        metaTitle: 'Spa treatment for coronary heart disease in Marienbad — duration',
        metaDescription: 'Spa treatment for coronary heart disease and after a heart attack in Marienbad: dry gas baths, terrain cure, exercise — course, duration and limits.',
        lead: 'Symptomatic coronary heart disease and the condition after a heart attack are separate positions on the Czech indication list. In Marienbad, treatment runs through measured outdoor exercise, group sessions for cardiac guests and the local carbon dioxide treatments — always under medical supervision and always as a supplement to cardiological treatment.',
        teaser: 'Dry gas baths, terrain cure and exercise for cardiac guests — as a supplement to cardiological treatment, after clearance from the cardiologist.',
        treats: [
          'Symptomatic coronary heart disease in a stable condition under cardiological care',
          'Condition after a heart attack, once acute treatment is complete and with clearance from the cardiologist',
          'Declining stamina and uncertainty about resuming exercise',
          'Accompanying risk factors such as overweight, elevated blood lipids, high blood pressure or lack of exercise',
          'Condition after procedures on the vascular system outside the heart, and after percutaneous angioplasty',
        ],
        notFor: [
          'Unstable angina pectoris, and a recent heart attack without completed acute treatment',
          'Heart failure at NYHA class IV, second- to third-degree AV block and active endocarditis — the indication list excludes these for the whole group',
          "Severe heart disease listed on the spa town's general contraindication list",
          'Missing clearance from the cardiologist, or missing initial examinations required by the indication list for group II',
          'Continued smoking: the indication list requires nicotine abstinence for the circulatory group',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: "The spa physician reviews your cardiological findings and medication, measures blood pressure and pulse, and assesses your stamina. Bring your cardiologist's clearance and the examinations required by the indication list for the circulatory disease group; without them the plan cannot be drawn up in full.",
          },
          {
            heading: 'First week: building up exertion cautiously',
            body: 'Treatment begins with short, level walks and low-intensity group exercise. Of the local natural remedies, the dry gas bath is used most, because it involves no strain on the circulation from heat.',
          },
          {
            heading: 'Second week: building endurance',
            body: 'The walks become longer and the climbs steeper, always in graded stages and with monitoring of pulse and blood pressure. Nutrition counselling on blood lipids, salt and weight runs in parallel.',
          },
          {
            heading: 'Final examination and a plan for home',
            body: 'Your stamina and progress are assessed and recorded in writing; you take the report home for your cardiologist. You receive an exercise programme for home — the benefit depends on continuing it.',
          },
        ],
        procedures: [
          { name: 'Dry gas bath in Mariengas', detail: 'The natural carbon dioxide from the Marien Spring is applied in a sealed bag, without water and without the strain of heat — which is why it is often the first choice for heart diagnoses.' },
          { name: 'Gas injections with Mariengas', detail: 'Injections of natural carbon dioxide placed under the skin; in Marienbad they are part of the programme for ischaemic heart disease and are prescribed only by the physician.' },
          { name: 'Carbon dioxide bath in mineral water', detail: 'A bath at around 34°C; the low temperature keeps the strain on the circulation small while the carbon dioxide is absorbed through the skin.' },
          { name: 'Terrain cure and climate therapy', detail: 'Guided walking on graded paths with gradually increasing exertion, at an altitude of 630 metres and under medical supervision.' },
          { name: 'Group exercise for cardiac guests', detail: 'Guided sessions put together specifically for cardiological diagnoses, with breathing, endurance and mobility components.' },
          { name: 'Exercise therapy in the pool', detail: 'Exercises in warm water that spare the joints and allow the exertion to be dosed precisely.' },
          { name: 'Nutrition counselling', detail: 'Individual sessions on blood lipids, salt and weight, accompanied by the spa diet during the stay.' },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'The Czech indication list distinguishes two positions here. Symptomatic ischaemic heart disease (II/1) provides for an initial stay of 21 days of contributory care, and a repeat stay likewise runs to 21 days of contributory care, in certain cases 14. For the condition after a heart attack (II/2), 28 days of comprehensive spa care are provided for; there is no separate repeat-stay position for it. Self-paying guests agree the length with the spa physician and the cardiologist. Timing follows the cardiological course, not the season.',
        },
        evidence: {
          heading: 'What the studies show',
          body: 'The exercise component of the cure is best supported, not the bathing. A Cochrane review of exercise-based cardiac rehabilitation in coronary heart disease found, within twelve months, a lower risk of heart attack (RR 0.72) and of hospital admission (RR 0.58), probably also a slightly lower all-cause mortality, and in the longer term lower cardiovascular mortality and somewhat better quality of life (Dibben et al., 2021, Cochrane Database Syst Rev). Important for context: what was studied were outpatient and clinical rehabilitation programmes, not spa stays; fewer than 15 percent of participants were women, and the reporting quality of the individual studies varies. For the carbon dioxide treatments themselves, a review describes three main effects — a drop in body temperature, stronger skin blood flow and a feeling of warmth — and calls for methodologically stronger studies (Pagourelias et al., 2011, Int J Biometeorol). None of these papers shows that a spa cure can replace cardiological treatment or its medication.',
        },
        physicianNote: "Whether and when a spa cure is appropriate for your heart condition is decided by the spa physician at the initial examination, based on the cardiological findings and your cardiologist's clearance. The stay supplements cardiological treatment and replaces neither it nor your medication; do not change your medication without your doctor's agreement. This page provides information and does not replace medical advice.",
        ongoing: {
          heading: 'Experience and research under way',
          body: 'Dry gas baths, gas injections and the guided terrain cure have long been part of the programme for cardiac guests in Marienbad; the spa physician doses the load according to the cardiological findings and from clinical experience. How the individual guest fares is not left unchecked: every treatment stay begins with an initial and ends with a final medical examination and a written final report, so the course is documented and the spa physician can adjust the plan along the way. Systematic evidence for spa medicine as a field is being built for the first time in a long while. The Institute of Spa Medicine and Balneology (Institut lázeňství a balneologie, v.v.i.), founded by the Karlovy Vary Region in 2019, has been running the first clinical study of this format in thirty years since 2026, together with Léčebné lázně Mariánské Lázně. It covers urological and nephrological diagnoses rather than the one described on this page: more than a hundred patients are examined before and after the spa stay for health status and quality of life, with prim. MUDr. Ladislav Špišák, CSc. as professional guarantor, and results are not yet available. The study runs within the Spa Research Centre project (2024 to 2027), funded by the Just Transition Operational Programme and working with the Czech Technical University, the University of West Bohemia and the Czech Academy of Sciences. What such work can produce is shown by the same institute’s earlier collaboration with the Marienbad spa houses: their joint study of spa rehabilitation after COVID-19 received the European Spas Association Innovation Award in 2021 in the Medical Spa Scientific Research category.',
        },
        faqs: [
          {
            question: 'May I go for a spa cure after a heart attack?',
            answer: 'Yes, once acute treatment is complete and with clearance from the cardiologist. The condition after a heart attack is position II/2 of the Czech indication list and provides for 28 days of comprehensive spa care. Excluded are unstable courses, as well as the conditions the indication list excludes for the whole circulatory group: second- to third-degree AV block, heart failure at NYHA class IV, and active endocarditis.',
          },
          {
            question: 'What can a spa cure do for coronary heart disease?',
            answer: 'The part with the best evidence is measured exercise. A Cochrane review of exercise-based cardiac rehabilitation found, within twelve months, fewer heart attacks and fewer hospital admissions, and in the longer term lower cardiovascular mortality — though in outpatient and clinical programmes, not in spa stays. In Marienbad, the guided terrain cure, group exercise for cardiac guests and the carbon dioxide treatments come together, under daily medical supervision.',
          },
          {
            question: 'Do I have to stop smoking for the cure?',
            answer: 'For stays run through the Czech indication list, yes: nicotine abstinence is a requirement for the circulatory disease group, set out in the decree itself. Independently of that, smoking is the risk factor that most limits the benefit of a spa stay for this diagnosis.',
          },
          {
            question: 'Which treatment is gentlest for heart disease?',
            answer: 'Usually the dry gas bath in Mariengas. It works through the carbon dioxide absorbed through the skin, but involves no water and no strain from heat. Peat packs, by contrast, are a heat-intensive treatment and a clear strain for people with cardiovascular disease; the physician always decides on their suitability.',
          },
          {
            question: 'What documents should I bring?',
            answer: 'The clearance and current findings from your cardiologist, a complete list of your medication, and the examinations required by the indication list for the circulatory disease group. The more complete the documents, the more precisely the spa physician can dose the exertion; without them, the plan is more cautious.',
          },
        ],
        sources: [
          {
            title: 'Clinical study of the objective effects of comprehensive spa care in kidney and urological conditions (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Ongoing study by the Institute of Spa Medicine and Balneology with Léčebné lázně Mariánské Lázně, more than a hundred patients, started 2026. It covers urological and nephrological diagnoses; results are not yet available.',
          },
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group II — positions II/1 and II/2',
            url: '/en/indications-and-contraindications',
            note: 'Symptomatic ischaemic heart disease: initial stay 21 days of contributory care, repeat stay 21 days (14 in certain cases). Condition after a heart attack: 28 days of comprehensive spa care, with no separate repeat-stay position.',
          },
          {
            title: 'Decree No. 2/2015 Coll. on the professional criteria for spa medical rehabilitation care — Group II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Full text of the indication list for circulatory diseases, including contraindications (second- to third-degree AV block, NYHA IV, active endocarditis), required nicotine abstinence and initial examinations. Czech-language text.',
          },
          {
            title: 'Dibben G et al. 2021, Cochrane Database Syst Rev — review of exercise-based cardiac rehabilitation in coronary heart disease',
            url: 'https://doi.org/10.1002/14651858.CD001800.pub4',
            note: 'Within 12 months, fewer heart attacks (RR 0.72) and hospital admissions (RR 0.58), and lower cardiovascular mortality in the longer term. Outpatient and clinical programmes, not spa treatment; under 15% women.',
          },
          {
            title: 'Pagourelias ED et al. 2011, Int J Biometeorol — review of CO₂ balneotherapy in cardiovascular disease',
            url: 'https://consensus.app/papers/details/cffd890e39e252b5bf9e66f5a36c8ff6/',
            note: 'Three main effects: a drop in body temperature, stronger skin blood flow, a feeling of warmth; the authors call for methodologically stronger studies.',
          },
          {
            title: 'Resch KL, Just U 1994, Wien Med Wochenschr — review of the possibilities and limits of CO₂ balneotherapy',
            url: 'https://consensus.app/papers/details/624f01a417885d7f9c0caf162686c4cc/',
            note: 'Controlled evidence only for peripheral arterial disease, trophic ulcers, microangiopathies and mild hypertension. Older review.',
          },
        ],
        related: [
          { label: 'Heart and circulation before winter', href: '/en/magazine/cardiovascular-spa-cure-marianske-lazne' },
          { label: 'Spa treatment for high blood pressure', href: '/en/spa-treatment-for/high-blood-pressure' },
          { label: 'CO₂ gas injections', href: '/en/magazine/co2-gas-injections' },
          { label: 'Indications and contraindications', href: '/en/indications-and-contraindications' },
        ],
      },
      cs: {
        slug: 'ischemicka-choroba-srdecni',
        navLabel: 'Ischemická choroba srdeční',
        title: 'Lázeňská léčba ischemické choroby srdeční v Mariánských Lázních',
        h1: 'Lázeňská léčba ischemické choroby srdeční a po infarktu',
        metaTitle: 'Léčba ischemické choroby srdeční | Marienbad.com',
        metaDescription: 'Lázeňská léčba ischemické choroby srdeční a po infarktu v Mariánských Lázních: suché plynové koupele, terénní léčba a cvičení — průběh a délka pobytu.',
        lead: 'Symptomatická ischemická choroba srdeční a stav po infarktu myokardu jsou samostatné položky českého indikačního seznamu. V Mariánských Lázních probíhá léčba přes dávkovaný pohyb v terénu, skupinová cvičení pro srdeční hosty a místní procedury s oxidem uhličitým — vždy pod lékařskou kontrolou a vždy jako doplněk ke kardiologické léčbě.',
        teaser: 'Suché plynové koupele, terénní léčba a cvičení pro srdeční hosty — jako doplněk ke kardiologické léčbě, po souhlasu kardiologa.',
        treats: [
          'Symptomatická ischemická choroba srdeční ve stabilizovaném stavu pod kardiologickým vedením',
          'Stav po infarktu myokardu, po ukončení akutní léčby a se souhlasem kardiologa',
          'Ubývající zátěžová kapacita a nejistota při návratu k pohybu',
          'Doprovodné rizikové faktory jako nadváha, zvýšené krevní tuky, vysoký krevní tlak nebo nedostatek pohybu',
          'Stav po zákrocích na cévním systému mimo srdce a po perkutánní angioplastice',
        ],
        notFor: [
          'Nestabilní angina pectoris a čerstvý infarkt myokardu bez ukončené akutní léčby',
          'Srdeční selhání ve stadiu NYHA IV, AV blok druhého až třetího stupně a aktivní endokarditida — indikační seznam je vylučuje pro celou skupinu',
          'Závažné srdeční onemocnění uvedené na obecném seznamu kontraindikací lázeňského místa',
          'Chybějící souhlas kardiologa nebo chybějící vstupní vyšetření, která indikační seznam pro skupinu II vyžaduje',
          'Pokračující kouření: indikační seznam pro skupinu oběhového ústrojí vyžaduje abstinenci od nikotinu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař projde vaše kardiologické nálezy a medikaci, změří krevní tlak a puls a zhodnotí zátěžovou kapacitu. Vezměte si souhlas svého kardiologa a vyšetření, která indikační seznam pro skupinu nemocí oběhového ústrojí požaduje; bez nich nelze plán sestavit v plném rozsahu.',
          },
          {
            heading: 'První týden: opatrné nastavení zátěže',
            body: 'Začíná se krátkými, rovnými procházkami a skupinovým cvičením nízké intenzity. Z místních léčivých zdrojů se nejčastěji používá suchá plynová koupel, protože nezatěžuje oběh teplem.',
          },
          {
            heading: 'Druhý týden: budování vytrvalosti',
            body: 'Cesty se prodlužují a stoupání přibývá, vždy v odstupňovaných etapách a s kontrolou pulsu a krevního tlaku. Souběžně probíhá dietní poradenství ke krevním tukům, soli a váze.',
          },
          {
            heading: 'Závěrečná prohlídka a plán pro doma',
            body: 'Zátěžová kapacita a vývoj se zhodnotí a písemně zaznamenají; zprávu si berete pro svého kardiologa. Dostanete pohybový program pro doma — přínos závisí na tom, že v něm budete pokračovat.',
          },
        ],
        procedures: [
          {
            name: 'Suchá plynová koupel v Mariině plynu',
            detail: 'Přírodní oxid uhličitý z Mariina pramene se používá v uzavřeném vaku, bez vody a bez zátěže teplem — proto u srdečních diagnóz často první volba.',
          },
          {
            name: 'Plynové injekce Mariiným plynem',
            detail: 'Injekce přírodního oxidu uhličitého podávané podkožně; v Mariánských Lázních patří k programu při ischemické chorobě srdeční a předepisuje je výhradně lékař.',
          },
          {
            name: 'Uhličitá koupel z minerální vody',
            detail: 'Koupel při zhruba 34 °C; nízká teplota drží zátěž oběhu nízkou, oxid uhličitý se přitom přijímá kůží.',
          },
          {
            name: 'Terénní léčba a klimatoterapie',
            detail: 'Vedená chůze po odstupňovaných cestách s postupně narůstající zátěží, v 630 metrech nad mořem a pod lékařskou kontrolou.',
          },
          {
            name: 'Skupinové cvičení pro srdeční hosty',
            detail: 'Vedené jednotky sestavené přímo pro kardiologické diagnózy, s dechovou, vytrvalostní a pohyblivostní složkou.',
          },
          {
            name: 'Pohybová terapie v bazénu',
            detail: 'Cvičení v teplé vodě, které šetří klouby a dobře umožňuje dávkovat zátěž.',
          },
          {
            name: 'Dietní poradenství',
            detail: 'Individuální konzultace ke krevním tukům, soli a váze, doplněné lázeňskou dietou po dobu pobytu.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'Český indikační seznam tu rozlišuje dvě položky. Symptomatická ischemická choroba srdeční (II/1) a stav po infarktu myokardu (II/2) mají hrazenou délku pobytu podle konkrétní položky; přesný rozpis najdete na stránce Co hradí pojišťovna u oběhového ústrojí. Samoplátci volí délku po dohodě s lázeňským lékařem a kardiologem. Termín se řídí kardiologickým vývojem, ne ročním obdobím.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'Nejlépe doložená je pohybová složka lázeňského pobytu, ne koupel. Cochranský přehled k pohybové kardiologické rehabilitaci u ischemické choroby srdeční zjistil během dvanácti měsíců nižší riziko infarktu myokardu (RR 0,72) a hospitalizace (RR 0,58), pravděpodobně i o něco nižší celkovou úmrtnost, z dlouhodobého hlediska nižší kardiovaskulární úmrtnost a o něco lepší kvalitu života (Dibben a kol., 2021, Cochrane Database Syst Rev). Pro zařazení je důležité: zkoumány byly ambulantní a klinické rehabilitační programy, ne lázeňské pobyty, méně než 15 procent účastníků byly ženy a kvalita zpracování jednotlivých studií kolísá. Pro samotné procedury s oxidem uhličitým popisuje přehledová práce tři hlavní účinky — pokles tělesné teploty, silnější prokrvení kůže a pocit tepla — a žádá metodicky lepší studie (Pagourelias a kol., 2011, Int J Biometeorol). Žádná z těchto prací neprokazuje, že by lázeňský pobyt mohl nahradit kardiologickou léčbu nebo její léky.',
        },
        physicianNote: 'O tom, zda a kdy pro vás při srdečním onemocnění připadá v úvahu lázeňský pobyt, rozhoduje lázeňský lékař při vstupní prohlídce podle kardiologických nálezů a souhlasu vašeho kardiologa. Pobyt doplňuje kardiologickou léčbu a nenahrazuje ji ani vaše léky; neměňte je bez souhlasu svého lékaře. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        ongoing: {
          heading: 'Zkušenost a probíhající výzkum',
          body: 'Suché plynové koupele, plynové injekce a řízená terénní kúra patří v Mariánských Lázních k programu pro srdeční hosty dlouho; lázeňský lékař dávkuje zátěž podle kardiologického nálezu a z klinické zkušenosti. Jak na tom jednotlivý host je, se nenechává bez kontroly: každý léčebný pobyt začíná vstupní a končí výstupní lékařskou prohlídkou a závěrečnou zprávou, takže je průběh doložený a lázeňský lékař může plán během pobytu upravit. Pro lázeňskou medicínu jako obor vzniká poprvé po dlouhé době systematická evidence. Institut lázeňství a balneologie, v.v.i., který Karlovarský kraj založil v roce 2019, vede od roku 2026 spolu s Léčebnými lázněmi Mariánské Lázně první klinickou studii tohoto formátu po třiceti letech. Týká se urologických a nefrologických diagnóz, ne té popsané na této stránce: více než sto pacientů se vyšetřuje před lázeňskou léčbou a po ní na ukazatele zdravotního stavu a kvality života, odborným garantem je prim. MUDr. Ladislav Špišák, CSc., a výsledky zatím nejsou k dispozici. Studie běží v projektu Centrum lázeňského výzkumu (2024 až 2027), financovaném z Operačního programu Spravedlivá transformace a spolupracujícím s ČVUT, Západočeskou univerzitou a Akademií věd ČR. Co z takové práce může vzejít, ukazuje dřívější spolupráce téhož institutu s mariánskolázeňskými lázeňskými domy: jejich společná studie lázeňské rehabilitace po covidu-19 získala v roce 2021 Innovation Award Evropského svazu lázní v kategorii Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Mohu jet do lázní po infarktu?',
            answer: 'Ano, po ukončení akutní léčby a se souhlasem kardiologa. Stav po infarktu myokardu je položka II/2 českého indikačního seznamu; přesnou délku hrazeného pobytu najdete na stránce Co hradí pojišťovna u oběhového ústrojí. Vyloučeny jsou nestabilní stavy a stavy, které indikační seznam vylučuje pro celou skupinu oběhového ústrojí: AV blok druhého až třetího stupně, srdeční selhání ve stadiu NYHA IV a aktivní endokarditida.',
          },
          {
            question: 'Co přinese lázeňský pobyt při ischemické chorobě srdeční?',
            answer: 'Nejlépe doloženou částí je dávkovaný pohyb. Cochranský přehled k pohybové kardiologické rehabilitaci zjistil během dvanácti měsíců méně infarktů a méně hospitalizací a z dlouhodobého hlediska nižší kardiovaskulární úmrtnost — ovšem v ambulantních a klinických programech, ne v lázeňských pobytech. V Mariánských Lázních se spojuje vedená terénní léčba, skupinová cvičení pro srdeční hosty a procedury s oxidem uhličitým, pod denní lékařskou kontrolou.',
          },
          {
            question: 'Musím pro lázně přestat kouřit?',
            answer: 'Pro pobyty hrazené přes český indikační seznam ano: pro skupinu nemocí oběhového ústrojí je abstinence od nikotinu podmínkou, která je přímo ve vyhlášce. Nezávisle na tom je kouření rizikový faktor, který přínos lázeňského pobytu u této diagnózy omezuje nejvíc.',
          },
          {
            question: 'Která procedura je při srdečních onemocněních nejšetrnější?',
            answer: 'Nejčastěji suchá plynová koupel v Mariině plynu. Působí přes oxid uhličitý přijímaný kůží, ale bez vody a bez zátěže teplem. Slatinné zábaly jsou naopak tepelně náročná procedura a pro lidi s nemocemi srdce a cév výrazná zátěž; o jejich vhodnosti vždy rozhoduje lékař.',
          },
          {
            question: 'Jaké dokumenty si mám vzít?',
            answer: 'Souhlas a aktuální nález svého kardiologa, úplný seznam léků a vyšetření, která indikační seznam pro skupinu nemocí oběhového ústrojí požaduje. Čím úplnější jsou podklady, tím přesněji může lázeňský lékař dávkovat zátěž; když chybí, vyjde plán opatrněji.',
          },
        ],
        sources: [
          {
            title: 'Klinická studie objektivních účinků komplexní lázeňské péče u urologických a nefrologických diagnóz (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Probíhající studie Institutu lázeňství a balneologie s Léčebnými lázněmi Mariánské Lázně, více než sto pacientů, zahájena 2026. Týká se urologických a nefrologických diagnóz; výsledky zatím nejsou k dispozici.',
          },
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina II — položky II/1 a II/2',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Symptomatická ischemická choroba srdeční a stav po infarktu myokardu, s typem péče a délkou pobytu.',
          },
          {
            title: 'Vyhláška č. 2/2015 Sb. o odborných kritériích lázeňské léčebně rehabilitační péče — skupina II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Úplné znění indikačního seznamu pro nemoci oběhového ústrojí včetně kontraindikací (AV blok II. až III. stupně, NYHA IV, aktivní endokarditida), požadované abstinence od nikotinu a vstupních vyšetření.',
          },
          {
            title: 'Dibben G a kol. 2021, Cochrane Database Syst Rev — přehled k pohybové kardiologické rehabilitaci u ischemické choroby srdeční',
            url: 'https://doi.org/10.1002/14651858.CD001800.pub4',
            note: 'Během 12 měsíců méně infarktů (RR 0,72) a hospitalizací (RR 0,58), z dlouhodobého hlediska nižší kardiovaskulární úmrtnost. Ambulantní a klinické programy, ne lázeňská léčba; méně než 15 % žen.',
          },
          {
            title: 'Pagourelias ED a kol. 2011, Int J Biometeorol — přehled k CO₂ balneoterapii u nemocí srdce a cév',
            url: 'https://consensus.app/papers/details/cffd890e39e252b5bf9e66f5a36c8ff6/',
            note: 'Tři hlavní účinky: pokles tělesné teploty, silnější prokrvení kůže, pocit tepla; autoři žádají metodicky lepší studie.',
          },
          {
            title: 'Resch KL, Just U 1994, Wien Med Wochenschr — přehled k možnostem a hranicím CO₂ balneoterapie',
            url: 'https://consensus.app/papers/details/624f01a417885d7f9c0caf162686c4cc/',
            note: 'Kontrolované důkazy jen pro periferní tepennou uzávěrovou nemoc, trofické vředy, mikroangiopatie a mírnou hypertenzi. Starší přehled.',
          },
        ],
        related: [
          {
            label: 'Srdce a cévy před zimou',
            href: '/cs/magazin/lazenska-lecba-obehoveho-ustroji',
          },
          {
            label: 'Lázeňská léčba vysokého krevního tlaku',
            href: '/cs/lazenska-lecba/vysoky-krevni-tlak',
          },
          {
            label: 'Plynové injekce CO₂',
            href: '/cs/magazin/plynove-injekce-co2',
          },
          {
            label: 'Co hradí pojišťovna u oběhového ústrojí',
            href: '/cs/lazne-s-pojistovnou/indikace/obehove-ustroji',
          },
        ],
      },
      ru: {
        slug: 'ishemicheskaya-bolezn-serdca',
        navLabel: 'Ишемическая болезнь сердца',
        title: 'Курортное лечение ишемической болезни сердца в Марианских Лазнях',
        h1: 'Курортное лечение ишемической болезни сердца и после инфаркта миокарда',
        metaTitle: 'Лечение ишемической болезни сердца — Марианские Лазни',
        metaDescription: 'Лечение ишемической болезни сердца и после инфаркта в Марианских Лазнях: сухие газовые ванны, терренкур, упражнения — ход лечения, сроки, ограничения.',
        lead: 'Симптоматическая ишемическая болезнь сердца и состояние после инфаркта миокарда выделены в отдельные позиции чешского индикационного списка. В Марианских Лазнях лечение строится на дозированном движении по местности, групповых занятиях для гостей с заболеваниями сердца и местных процедурах с углекислым газом — всегда под врачебным контролем и всегда как дополнение к кардиологическому лечению.',
        teaser: 'Сухие газовые ванны, терренкур и упражнения для гостей с заболеваниями сердца — как дополнение к кардиологическому лечению, после разрешения кардиолога.',
        treats: [
          'Симптоматическая ишемическая болезнь сердца в стабильном состоянии под кардиологическим наблюдением',
          'Состояние после инфаркта миокарда, после завершения острого лечения и с разрешения кардиолога',
          'Снижение выносливости и неуверенность при возвращении к физической активности',
          'Сопутствующие факторы риска, такие как избыточный вес, повышенные липиды крови, гипертония или недостаток движения',
          'Состояние после вмешательств на сосудистой системе за пределами сердца и после чрескожной ангиопластики',
        ],
        notFor: [
          'Нестабильная стенокардия, а также свежий инфаркт миокарда без завершённого острого лечения',
          'Сердечная недостаточность стадии NYHA IV, АВ-блокада второй-третьей степени и активный эндокардит — индикационный список исключает их для всей группы',
          'Тяжёлое заболевание сердца, входящее в общий список противопоказаний курорта',
          'Отсутствие разрешения кардиолога или отсутствие первичных обследований, которые индикационный список требует для группы II',
          'Продолжение курения: индикационный список требует для группы заболеваний системы кровообращения отказа от курения',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач изучает ваши кардиологические заключения и медикацию, измеряет давление и пульс и оценивает выносливость. Возьмите с собой разрешение вашего кардиолога, а также обследования, которые индикационный список требует для группы заболеваний системы кровообращения; без них план не может быть составлен полностью.',
          },
          {
            heading: 'Первая неделя: осторожное начало нагрузки',
            body: 'Начинают с коротких, ровных прогулок и групповых занятий низкой интенсивности. Из местных лечебных средств чаще всего применяют сухую газовую ванну, поскольку она обходится без тепловой нагрузки на кровообращение.',
          },
          {
            heading: 'Вторая неделя: развитие выносливости',
            body: 'Маршруты становятся длиннее, а подъёмы — более выраженными, всегда в постепенных этапах и с контролем пульса и давления. Параллельно проходят консультации по питанию о липидах крови, соли и весе.',
          },
          {
            heading: 'Заключительное обследование и план на дом',
            body: 'Выносливость и динамика оцениваются и фиксируются письменно; заключение вы забираете для своего кардиолога. Вы получаете программу физической активности на дом — польза от неё зависит от того, что вы будете её продолжать.',
          },
        ],
        procedures: [
          {
            name: 'Сухая газовая ванна в марианском газе',
            detail: 'Природный углекислый газ источника Марии применяется в герметичном мешке, без воды и без тепловой нагрузки — поэтому при заболеваниях сердца часто становится первым выбором.',
          },
          {
            name: 'Газовые инъекции с марианским газом',
            detail: 'Подкожные инъекции природного углекислого газа; в Марианских Лазнях они входят в программу лечения ишемической болезни сердца и назначаются исключительно врачом.',
          },
          {
            name: 'Углекислая ванна в минеральной воде',
            detail: 'Ванна при температуре около 34 °C; низкая температура удерживает нагрузку на кровообращение на низком уровне, в то время как углекислый газ проникает через кожу.',
          },
          {
            name: 'Терренкур и климатотерапия',
            detail: 'Ходьба под руководством инструктора по размеченным маршрутам с постепенно возрастающей нагрузкой, на высоте 630 метров и под врачебным контролем.',
          },
          {
            name: 'Групповые занятия для гостей с заболеваниями сердца',
            detail: 'Занятия под руководством инструктора, составленные специально для кардиологических диагнозов, с элементами на дыхание, выносливость и подвижность.',
          },
          {
            name: 'Двигательная терапия в бассейне',
            detail: 'Упражнения в тёплой воде, которые щадят суставы и позволяют хорошо дозировать нагрузку.',
          },
          {
            name: 'Консультация по питанию',
            detail: 'Индивидуальные беседы о липидах крови, соли и весе, сопровождаемые курортной диетой во время пребывания.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'Чешский индикационный список различает здесь две позиции. Симптоматическая ишемическая болезнь сердца (II/1) предусматривает в качестве базового пребывания 21 день долевого лечения, повторное пребывание также проходит как 21 день долевого лечения, в отдельных случаях 14. Для состояния после инфаркта миокарда (II/2) предусмотрено 28 дней комплексного курортного лечения; отдельной позиции для повторного пребывания для этого случая нет. Гости, оплачивающие лечение самостоятельно, согласуют срок с курортным врачом и кардиологом. Время поездки определяется кардиологической динамикой, а не временем года.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'Лучше всего доказана двигательная составляющая курортного лечения, а не ванны. Кокрейновский обзор по кардиологической реабилитации на основе физической активности при ишемической болезни сердца обнаружил в течение двенадцати месяцев более низкий риск инфаркта миокарда (ОР 0,72) и госпитализаций (ОР 0,58), вероятно также немного более низкую общую смертность, в долгосрочной перспективе — более низкую сердечно-сосудистую смертность, а также несколько более высокое качество жизни (Dibben et al., 2021, Cochrane Database Syst Rev). Важно для понимания: изучались амбулаторные и клинические программы реабилитации, а не курортные пребывания, менее 15 процентов участников были женщинами, а качество отчётности отдельных исследований варьируется. Для самих процедур с углекислым газом обзорная работа описывает три основных эффекта — снижение температуры тела, усиление кровоснабжения кожи и ощущение тепла — и призывает к методически более качественным исследованиям (Pagourelias et al., 2011, Int J Biometeorol). Ни одна из этих работ не показывает, что курортное лечение может заменить кардиологическое лечение или его препараты.',
        },
        physicianNote: 'Возможно ли и когда курортное лечение при вашем заболевании сердца, решает курортный врач при первичном осмотре на основании кардиологических заключений и разрешения вашего кардиолога. Пребывание дополняет кардиологическое лечение и не заменяет ни его, ни ваши препараты; не меняйте их без согласия вашего врача. Эта страница носит информационный характер и не заменяет консультацию врача.',
        ongoing: {
          heading: 'Опыт и текущие исследования',
          body: 'Сухие газовые ванны, газовые инъекции и терренкур под наблюдением давно входят в программу для кардиологических гостей Марианских Лазней; курортный врач дозирует нагрузку по кардиологическому заключению и из клинического опыта. Как идут дела у конкретного гостя, не остаётся без проверки: каждое лечебное пребывание начинается с первичного и заканчивается выходным врачебным осмотром и письменным заключением, поэтому течение задокументировано, а курортный врач может по ходу скорректировать план. Для курортной медицины как отрасли впервые за долгое время создаётся систематическая доказательная база. Институт курортного дела и бальнеологии (Institut lázeňství a balneologie, v.v.i.), основанный Карловарским краем в 2019 году, с 2026 года вместе с «Léčebné lázně Mariánské Lázně» проводит первое клиническое исследование такого формата за тридцать лет. Оно касается урологических и нефрологических диагнозов, а не того, который описан на этой странице: более ста пациентов обследуют до курортного лечения и после него по показателям состояния здоровья и качества жизни, научный гарант — prim. MUDr. Ladislav Špišák, CSc., результатов пока нет. Исследование идёт в рамках проекта «Центр курортных исследований» (2024–2027), финансируемого Операционной программой справедливой трансформации, с участием Чешского технического университета, Западночешского университета и Академии наук Чехии. Что даёт такая работа, показывает более раннее сотрудничество того же института с курортными домами Марианских Лазней: их совместное исследование курортной реабилитации после COVID-19 получило в 2021 году Innovation Award Европейского союза курортов в категории Medical Spa Scientific Research.',
        },
        faqs: [
          {
            question: 'Можно ли ехать на курортное лечение после инфаркта миокарда?',
            answer: 'Да, после завершения острого лечения и с разрешения кардиолога. Состояние после инфаркта миокарда — это позиция II/2 чешского индикационного списка, которая предусматривает 28 дней комплексного курортного лечения. Исключены нестабильные состояния, а также состояния, которые индикационный список исключает для всей группы заболеваний системы кровообращения: АВ-блокада второй-третьей степени, сердечная недостаточность стадии NYHA IV и активный эндокардит.',
          },
          {
            question: 'Что даёт курортное лечение при ишемической болезни сердца?',
            answer: 'Часть с наилучшей доказательной базой — дозированное движение. Кокрейновский обзор по кардиологической реабилитации на основе физической активности обнаружил в течение двенадцати месяцев меньше инфарктов и госпитализаций, а также в долгосрочной перспективе более низкую сердечно-сосудистую смертность — однако в амбулаторных и клинических программах, а не в курортных пребываниях. В Марианских Лазнях сочетаются терренкур под руководством инструктора, групповые занятия для гостей с заболеваниями сердца и процедуры с углекислым газом, под ежедневным врачебным контролем.',
          },
          {
            question: 'Нужно ли бросить курить перед курортным лечением?',
            answer: 'Для пребываний, проходящих через чешский индикационный список, да: для группы заболеваний системы кровообращения отказ от курения — это требование, закреплённое в самом постановлении. Независимо от этого курение — тот фактор риска, который сильнее всего ограничивает пользу курортного пребывания при этом диагнозе.',
          },
          {
            question: 'Какая процедура наиболее щадящая при заболеваниях сердца?',
            answer: 'Чаще всего сухая газовая ванна в марианском газе. Она действует через углекислый газ, проникающий через кожу, но обходится без воды и без тепловой нагрузки. Торфяные обёртывания, напротив, являются интенсивной тепловой процедурой и создают значительную нагрузку для людей с сердечно-сосудистыми заболеваниями; об их допустимости всегда решает врач.',
          },
          {
            question: 'Какие документы нужно взять с собой?',
            answer: 'Разрешение и актуальное заключение вашего кардиолога, полный список лекарств и обследования, которые индикационный список требует для группы заболеваний системы кровообращения. Чем полнее документы, тем точнее курортный врач может дозировать нагрузку; при их отсутствии план будет более осторожным.',
          },
        ],
        sources: [
          {
            title: 'Клиническое исследование объективных эффектов комплексного курортного лечения при урологических и нефрологических диагнозах (NCT07435844)',
            url: 'https://clinicaltrials.gov/study/NCT07435844',
            note: 'Продолжающееся исследование Института курортного дела и бальнеологии вместе с «Léčebné lázně Mariánské Lázně», более ста пациентов, начато в 2026 году. Касается урологических и нефрологических диагнозов; результатов пока нет.',
          },
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа II — позиции II/1 и II/2',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Симптоматическая ишемическая болезнь сердца: базовое пребывание — 21 день долевого лечения, повторное пребывание — 21 (в отдельных случаях 14) день. Состояние после инфаркта миокарда: 28 дней комплексного курортного лечения без отдельной позиции для повторного пребывания.',
          },
          {
            title: 'Постановление № 2/2015 Сб. о профессиональных критериях курортной реабилитационной помощи — группа II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Полный текст индикационного списка для заболеваний системы кровообращения, включая противопоказания (АВ-блокада II-III степени, NYHA IV, активный эндокардит), требуемый отказ от курения и первичные обследования. Текст на чешском языке.',
          },
          {
            title: 'Dibben G et al. 2021, Cochrane Database Syst Rev — обзор по кардиологической реабилитации на основе физической активности при ишемической болезни сердца',
            url: 'https://doi.org/10.1002/14651858.CD001800.pub4',
            note: 'В течение 12 месяцев меньше инфарктов миокарда (ОР 0,72) и госпитализаций (ОР 0,58), в долгосрочной перспективе более низкая сердечно-сосудистая смертность. Амбулаторные и клинические программы, а не курортное лечение; менее 15 % женщин.',
          },
          {
            title: 'Pagourelias ED et al. 2011, Int J Biometeorol — обзор по CO₂-бальнеотерапии при сердечно-сосудистых заболеваниях',
            url: 'https://consensus.app/papers/details/cffd890e39e252b5bf9e66f5a36c8ff6/',
            note: 'Три основных эффекта: снижение температуры тела, усиление кровоснабжения кожи, ощущение тепла; авторы призывают к методически более качественным исследованиям.',
          },
          {
            title: 'Resch KL, Just U 1994, Wien Med Wochenschr — обзор о возможностях и границах CO₂-бальнеотерапии',
            url: 'https://consensus.app/papers/details/624f01a417885d7f9c0caf162686c4cc/',
            note: 'Контролируемые доказательства только для периферической артериальной окклюзионной болезни, трофических язв, микроангиопатий и лёгкой гипертонии. Более старый обзор.',
          },
        ],
        related: [
          {
            label: 'Сердце и сосуды перед зимой',
            href: '/ru/zhurnal/kurortnoe-lechenie-serdca-i-sosudov',
          },
          {
            label: 'Курортное лечение гипертонии',
            href: '/ru/kurortnoe-lechenie/gipertoniya',
          },
          {
            label: 'Газовые инъекции CO₂',
            href: '/ru/zhurnal/gazovye-inektsii-co2',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
  {
    id: 'peripheral-arterial',
    groupId: 'circulatory',
    roman: 'II',
    codes: [
      'II/4',
      'II/5',
      'II/8',
    ],
    conditionName: 'Peripheral arterial disease',
    icd10: 'I70.2',
    image: '/images/library/treatments/co2-pool-lounge.jpg',
    medicalReviewDate: '2026-09-14',
    imageAlt: {
      de: 'Kurgäste sitzen am Rand des warmen Kohlensäurebeckens und halten die Beine im Wasser',
      en: 'Spa guests sitting at the edge of the warm carbonated pool with their legs in the water',
      cs: 'Lázeňští hosté sedí na okraji teplého uhličitého bazénu a nohy mají ponořené ve vodě',
      ru: 'Гости лечения сидят на краю тёплого углекислого бассейна и держат ноги в воде',
    },
    content: {
      de: {
        slug: 'durchblutungsstoerungen-der-beine',
        navLabel: 'Durchblutung der Beine',
        title: 'Kur bei Durchblutungsstörungen der Beine in Marienbad',
        h1: 'Kur bei Durchblutungsstörungen der Beine',
        metaTitle: 'Kur bei Durchblutungsstörungen der Beine — Marienbad',
        metaDescription: 'Schaufensterkrankheit, Zustand nach Thrombose, Lymphödem: Kohlensäurebäder, Gehtraining und Lymphdrainage in Marienbad — Ablauf und Dauer.',
        lead: 'Wenn die Wade nach zweihundert Metern brennt und man stehen bleiben muss, um weitergehen zu können, heißt das Schaufensterkrankheit. Die tschechische Indikationsliste führt Arterienerkrankungen der Gliedmaßen, Zustände nach Thrombosen und das chronische Lymphödem in der Gruppe der Kreislaufkrankheiten — und Marienbad behandelt sie mit Kohlensäurebädern und geführtem Gehtraining.',
        teaser: 'Schaufensterkrankheit, Zustand nach Thrombose und chronisches Lymphödem: Kohlensäurebäder, Gehtraining und Lymphdrainage.',
        treats: [
          'Arterienerkrankung der Gliedmaßen auf atherosklerotischer Grundlage im Stadium II b, also mit Schaufensterkrankheit',
          'Arterienerkrankung der Gliedmaßen auf entzündlicher Grundlage',
          'Funktionelle Störungen der peripheren Gefäße',
          'Zustand nach einer Thrombose, wenn die akute Phase abgeschlossen ist',
          'Chronisches Lymphödem der Beine',
          'Zustand nach rekonstruktiven und revaskularisierenden Operationen am Gefäßsystem außerhalb von Herz und Brustaorta sowie nach perkutaner Angioplastie',
        ],
        notFor: [
          'Kritische Extremitätenischämie mit Ruheschmerz oder drohendem Gewebeuntergang — das gehört in die Gefäßchirurgie, nicht in die Kur',
          'Frische tiefe Beinvenenthrombose in der akuten Phase',
          'Nicht abgeheilte Wunden und Geschwüre am Bein',
          'Herzinsuffizienz im Stadium NYHA IV, AV-Block zweiten bis dritten Grades und aktive Endokarditis',
          'Fortgesetztes Rauchen: die Indikationsliste verlangt für die Kreislaufgruppe Nikotinabstinenz',
        ],
        course: [
          {
            heading: 'Eingangsuntersuchung am Anreisetag',
            body: 'Der Kurarzt erhebt den Gefäßbefund, prüft Pulse, Hautzustand und Umfänge der Beine und fragt die schmerzfreie Gehstrecke ab — sie ist der Maßstab, an dem sich der Verlauf messen lässt. Bringen Sie den Befund Ihres Angiologen oder Gefäßchirurgen mit.',
          },
          {
            heading: 'Erste Woche: Durchblutung und Gehstrecke',
            body: 'Kohlensäurebäder und trockene Gasbäder kommen täglich zum Einsatz, dazu geführtes Gehtraining auf flachen Wegen bis knapp unter die Schmerzgrenze — das ist die Belastung, auf die es beim Gehtraining ankommt.',
          },
          {
            heading: 'Zweite Woche: Strecke verlängern',
            body: 'Die Gehstrecken werden länger, Steigungen kommen dazu. Beim Lymphödem stehen stattdessen manuelle Lymphdrainage und apparative Drainage im Vordergrund, ergänzt um Übungen, die den Rückfluss unterstützen.',
          },
          {
            heading: 'Abschlussuntersuchung und Plan für zu Hause',
            body: 'Die schmerzfreie Gehstrecke wird erneut gemessen und mit dem Ausgangswert verglichen; der Befund geht in den Abschlussbericht. Sie erhalten ein Gehprogramm für zu Hause — ohne regelmäßiges Weitergehen bildet sich der Gewinn zurück.',
          },
        ],
        procedures: [
          {
            name: 'Kohlensäurebad im Mineralwasser',
            detail: 'Bad im örtlichen Mineralwasser bei rund 34 °C; das über die Haut aufgenommene Kohlendioxid ist bei Durchblutungsstörungen der Gliedmaßen die zentrale Anwendung.',
          },
          {
            name: 'Trockenes Gasbad im Mariengas',
            detail: 'Anwendung des natürlichen Kohlendioxids der Marienquelle ohne Wasser und ohne Wärmebelastung — geeignet auch dort, wo warme Bäder nicht infrage kommen.',
          },
          {
            name: 'Geführtes Gehtraining und Terrainkur',
            detail: 'Abgestufte Wege im Kurwald, mit Gehen bis knapp unter die Schmerzgrenze und anschließender Pause, in schrittweise längeren Etappen.',
          },
          {
            name: 'Manuelle Lymphdrainage',
            detail: 'Beim chronischen Lymphödem: Griffe, die den Abfluss der Lymphflüssigkeit aus den Beinen unterstützen.',
          },
          {
            name: 'Apparative Lymphdrainage',
            detail: 'Geräte wie Lymfoven und Lymfopress ergänzen die manuelle Behandlung des Lymphödems.',
          },
          {
            name: 'Gruppenübungen und Bewegungstherapie im Becken',
            detail: 'Übungen für Ausdauer und Wadenmuskulatur, im Wasser mit geringerer Gelenkbelastung.',
          },
          {
            name: 'Ernährungsberatung',
            detail: 'Einzelgespräche zu Blutfetten, Gewicht und Zuckerstoffwechsel, also zu den Risikofaktoren, die dem Gefäßbefund zugrunde liegen.',
          },
        ],
        stay: {
          heading: 'Wie lange und wann',
          body: 'Drei Positionen der tschechischen Indikationsliste kommen hier infrage. Arterienerkrankungen der Gliedmaßen auf atherosklerotischer Grundlage im Stadium II b oder auf entzündlicher Grundlage (II/4) sehen als Grundaufenthalt 21 Tage komplexe oder 21 Tage Zuschussbehandlung vor, der Wiederholungsaufenthalt ebenso, in bestimmten Fällen 14 Tage Zuschussbehandlung. Funktionelle Störungen der peripheren Gefäße, Zustände nach Thrombosen und das chronische Lymphödem (II/5) laufen über 21 Tage komplexe oder Zuschussbehandlung, der Wiederholungsaufenthalt über 21 oder 14 Tage Zuschussbehandlung. Zustände nach Gefäßoperationen und nach perkutaner Angioplastie (II/8) sehen 21 Tage komplexe oder Zuschussbehandlung vor. Selbstzahler stimmen die Dauer mit dem Kurarzt ab; als fachliche Untergrenze gelten mindestens 10 Anwendungen über mindestens 10 Tage.',
        },
        evidence: {
          heading: 'Was die Studien zeigen',
          body: 'Für Durchblutungsstörungen der Beine ist die Studienlage bei den Anwendungen mit Kohlendioxid vergleichsweise am besten. In einer randomisierten Studie erhöhten Fußbäder in kohlensäurehaltigem Wasser (1000 mg CO₂ je Kilogramm, 33 °C, 30 Minuten, fünfmal wöchentlich über vier Wochen) den arteriellen Spitzenfluss, den Gewebesauerstoff und die schmerzfreie Gehstrecke, während gewöhnliches Wasser die Werte nicht veränderte (Hartmann et al., 1997, Angiology; kleines Kollektiv, künstlich angereichertes Wasser, Effektgröße im Abstract nicht angegeben). Eine Cross-over-Studie derselben Arbeitsgruppe mit 18 Patienten fand beim Eintauchen der Füße in Kohlensäurewasser einen Anstieg des laserdopplergemessenen Hautflusses und des Gewebesauerstoffs, in gewöhnlichem Wasser nicht (Hartmann et al., 1997, Angiology; einmaliges Bad, Surrogatparameter). Nach zwanzigminütiger Einwirkung von Kur-Kohlendioxidgas auf die Haut stiegen der Fluss in der Oberschenkelarterie, der Druck an der hinteren Schienbeinarterie und der Gewebesauerstoff des Fußes, während Wasserdampf gleicher Temperatur wirkungslos blieb (Savin et al., 1995, Angiology; sehr kleines Kollektiv, einmalige Anwendung). Für den Bewegungsanteil liegt hohe Evidenz vor: Ein Cochrane-Review zu Gehtraining bei Schaufensterkrankheit fand gegenüber üblicher Versorgung eine um durchschnittlich 82 Meter längere schmerzfreie und um 120 Meter längere maximale Gehstrecke, mit einem Effekt bis zu zwei Jahren (Lane et al., 2017, Cochrane Database Syst Rev; ambulante Übungsprogramme, nicht Kurbehandlung, die meisten Einzelstudien klein). Eine ältere Übersicht ordnet ein, dass kontrollierte Belege zur CO₂-Balneotherapie gerade für die periphere arterielle Verschlusskrankheit, trophische Ulzera und Mikroangiopathien vorliegen (Resch und Just, 1994, Wien Med Wochenschr). Keine dieser Arbeiten zeigt, dass die Kur eine Gefäßoperation oder die gefäßmedizinische Behandlung ersetzt.',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur bei Ihrem Gefäßbefund infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand des angiologischen Befunds. Ruheschmerz, eine nicht heilende Wunde am Bein oder ein plötzlich kalt und blass werdendes Bein sind Notfälle und gehören umgehend in ärztliche Behandlung, nicht in eine Kurplanung. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
        faqs: [
          {
            question: 'Hilft eine Kur bei Schaufensterkrankheit?',
            answer: 'Zwei Bausteine der Kur sind untersucht. Für Gehtraining liegt hohe Evidenz vor: Ein Cochrane-Review fand gegenüber üblicher Versorgung eine im Mittel um 82 Meter längere schmerzfreie und um 120 Meter längere maximale Gehstrecke, mit Wirkung bis zu zwei Jahren — allerdings in ambulanten Programmen, nicht in Kuraufenthalten. Für Fußbäder in kohlensäurehaltigem Wasser zeigte eine randomisierte Studie einen Anstieg von arteriellem Spitzenfluss, Gewebesauerstoff und schmerzfreier Gehstrecke, während gewöhnliches Wasser wirkungslos blieb; das Kollektiv war klein. In Marienbad kommen beide Bausteine zusammen.',
          },
          {
            question: 'Wird eine Kur bei Durchblutungsstörungen bezahlt?',
            answer: 'Für Versicherte einer tschechischen Krankenkasse kommen drei Positionen infrage: Arterienerkrankungen der Gliedmaßen im Stadium II b oder auf entzündlicher Grundlage (II/4), funktionelle Störungen peripherer Gefäße, Zustände nach Thrombosen und chronisches Lymphödem (II/5) sowie Zustände nach Gefäßoperationen und nach Angioplastie (II/8). Vorgesehen sind jeweils 21 Tage komplexe oder Zuschussbehandlung. Gäste mit einer Versicherung außerhalb Tschechiens klären die Kostenübernahme vorab mit ihrem eigenen Kostenträger.',
          },
          {
            question: 'Darf ich nach einer Thrombose zur Kur?',
            answer: 'Nach Abschluss der akuten Phase ja; der Zustand nach einer Thrombose steht als Teil der Position II/5 auf der Indikationsliste. In der akuten Phase ist eine Kur ausgeschlossen. Wie lange der Abstand sein muss und welche Anwendungen möglich sind, entscheidet der Kurarzt anhand des Befunds Ihres behandelnden Arztes — bringen Sie ihn deshalb mit.',
          },
          {
            question: 'Was wird beim Lymphödem gemacht?',
            answer: 'Im Vordergrund stehen die manuelle Lymphdrainage und die apparative Drainage mit Geräten wie Lymfoven und Lymfopress, ergänzt um Übungen, die den Rückfluss unterstützen. Das chronische Lymphödem ist Teil der Position II/5 der Indikationsliste. Nicht abgeheilte Wunden am Bein schließen eine Reihe von Anwendungen aus, deshalb werden die Beine bei der Eingangsuntersuchung angesehen.',
          },
          {
            question: 'Muss ich für die Kur mit dem Rauchen aufhören?',
            answer: 'Für Aufenthalte über die tschechische Indikationsliste ja — Nikotinabstinenz ist für die Gruppe der Kreislaufkrankheiten eine Voraussetzung, die in der Verordnung selbst steht. Bei Arterienerkrankungen der Beine ist das Rauchen zudem der Faktor, der den Verlauf am stärksten bestimmt.',
          },
        ],
        sources: [
          {
            title: 'Indikationsliste für die Kurbehandlung (Verordnung Nr. 2/2015 Slg.), Gruppe II — Positionen II/4, II/5 und II/8',
            url: '/de/indikationen-und-kontraindikationen',
            note: 'Arterienerkrankungen der Gliedmaßen (II/4), funktionelle Störungen peripherer Gefäße, Zustände nach Thrombosen und chronisches Lymphödem (II/5) sowie Zustände nach Gefäßoperationen und perkutaner Angioplastie (II/8): jeweils 21 Tage komplexe oder Zuschussbehandlung.',
          },
          {
            title: 'Verordnung Nr. 2/2015 Slg. über die fachlichen Kriterien der kurmedizinischen Rehabilitationspflege — Gruppe II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Vollständiger Wortlaut der Indikationsliste für Kreislaufkrankheiten samt Kontraindikationen (AV-Block II. bis III. Grades, NYHA IV, aktive Endokarditis), geforderter Nikotinabstinenz und Eingangsuntersuchungen. Tschechischer Text.',
          },
          {
            title: 'Hartmann BR et al. 1997, Angiology — randomisierte Studie zu wiederholten Kohlensäure-Fußbädern bei Claudicatio intermittens',
            url: 'https://doi.org/10.1177/000331979704801104',
            note: 'Fußbäder in Kohlensäurewasser erhöhten arteriellen Spitzenfluss, Gewebesauerstoff und schmerzfreie Gehstrecke; gewöhnliches Wasser nicht. Kleines Kollektiv, künstlich angereichertes Wasser, Effektgröße im Abstract nicht angegeben.',
          },
          {
            title: 'Hartmann BR et al. 1997, Angiology — Cross-over-Studie, 18 Patienten mit peripherer arterieller Verschlusskrankheit',
            url: 'https://doi.org/10.1177/000331979704800406',
            note: 'In Kohlensäurewasser stiegen Hautdurchblutung und Gewebesauerstoff, in gewöhnlichem Wasser nicht. Einmaliges Bad, Surrogatparameter.',
          },
          {
            title: 'Savin E et al. 1995, Angiology — Studie zu transkutanem CO₂ bei peripherer arterieller Verschlusskrankheit im Stadium II',
            url: 'https://doi.org/10.1177/000331979504600904',
            note: 'Nach 20 Minuten Einwirkung von Kur-CO₂-Gas stiegen femoraler Fluss, Druck an der A. tibialis posterior und Gewebesauerstoff des Fußes; Wasserdampf gleicher Temperatur blieb wirkungslos. Sehr kleines Kollektiv, einmalige Anwendung.',
          },
          {
            title: 'Lane R et al. 2017, Cochrane Database Syst Rev — Review zu Gehtraining bei Claudicatio intermittens',
            url: 'https://doi.org/10.1002/14651858.CD000990.pub4',
            note: 'Übungsprogramme verlängerten die schmerzfreie Gehstrecke um durchschnittlich 82 m und die maximale um 120 m gegenüber üblicher Versorgung, mit Effekt bis zu 2 Jahren. Ambulante Programme, nicht Kurbehandlung.',
          },
          {
            title: 'Resch KL, Just U 1994, Wien Med Wochenschr — Übersicht zu Möglichkeiten und Grenzen der CO₂-Balneotherapie',
            url: 'https://consensus.app/papers/details/624f01a417885d7f9c0caf162686c4cc/',
            note: 'Kontrollierte Belege nur für periphere arterielle Verschlusskrankheit, trophische Ulzera, Mikroangiopathien und leichte Hypertonie. Ältere Übersicht.',
          },
        ],
        related: [
          {
            label: 'Herz und Gefäße vor dem Winter',
            href: '/de/magazin/kur-herz-kreislauf-marienbad',
          },
          {
            label: 'Kohlensäurebäder — was die Forschung zeigt',
            href: '/de/magazin/co2-baeder-wissenschaft',
          },
          {
            label: 'Kur nach einer Krebsbehandlung',
            href: '/de/kur-bei/nach-krebsbehandlung',
          },
          {
            label: 'Indikationen und Kontraindikationen',
            href: '/de/indikationen-und-kontraindikationen',
          },
        ],
      },
      en: {
        slug: 'leg-circulation-problems',
        navLabel: 'Leg circulation',
        title: 'Spa treatment for poor leg circulation in Marienbad',
        h1: 'Spa treatment for poor leg circulation',
        metaTitle: 'Spa treatment for poor leg circulation — Marienbad',
        metaDescription: 'Intermittent claudication, condition after thrombosis, lymphoedema: carbon dioxide baths, walking training and lymphatic drainage — course and duration.',
        lead: 'When the calf starts burning after two hundred metres and you have to stop to be able to walk on, that is intermittent claudication. The Czech indication list places arterial disease of the limbs, conditions after thrombosis and chronic lymphoedema in the circulatory disease group — and Marienbad treats them with carbon dioxide baths and guided walking training.',
        teaser: 'Intermittent claudication, condition after thrombosis and chronic lymphoedema: carbon dioxide baths, walking training and lymphatic drainage.',
        treats: [
          'Arterial disease of the limbs of atherosclerotic origin at stage IIb, that is, with intermittent claudication',
          'Arterial disease of the limbs of inflammatory origin',
          'Functional disorders of the peripheral vessels',
          'Condition after a thrombosis, once the acute phase is over',
          'Chronic lymphoedema of the legs',
          'Condition after reconstructive and revascularising surgery on the vascular system outside the heart and thoracic aorta, and after percutaneous angioplasty',
        ],
        notFor: [
          'Critical limb ischaemia with pain at rest or impending tissue loss — this belongs in vascular surgery, not a spa cure',
          'A recent deep leg vein thrombosis in its acute phase',
          'Unhealed wounds and ulcers on the leg',
          'Heart failure at NYHA class IV, second- to third-degree AV block and active endocarditis',
          'Continued smoking: the indication list requires nicotine abstinence for the circulatory group',
        ],
        course: [
          {
            heading: 'Initial examination on arrival day',
            body: 'The spa physician takes the vascular findings, checks pulses, skin condition and leg circumference, and asks about the pain-free walking distance — it is the yardstick against which progress can be measured. Bring the findings from your angiologist or vascular surgeon.',
          },
          {
            heading: 'First week: circulation and walking distance',
            body: 'Carbon dioxide baths and dry gas baths are used daily, together with guided walking training on level paths up to just below the pain threshold — that is the level of exertion that matters for walking training.',
          },
          {
            heading: 'Second week: extending the distance',
            body: 'Walking distances become longer, and gradients are added. For lymphoedema, manual lymphatic drainage and machine-assisted drainage take priority instead, supplemented by exercises that support the return flow.',
          },
          {
            heading: 'Final examination and a plan for home',
            body: 'The pain-free walking distance is measured again and compared with the starting value; the finding goes into the final report. You receive a walking programme for home — without continuing regularly, the gain is lost again.',
          },
        ],
        procedures: [
          { name: 'Carbon dioxide bath in mineral water', detail: 'A bath in the local mineral water at around 34°C; the carbon dioxide absorbed through the skin is the central treatment for circulatory problems in the limbs.' },
          { name: 'Dry gas bath in Mariengas', detail: 'Application of the natural carbon dioxide from the Marien Spring without water and without the strain of heat — suitable also where warm baths are not an option.' },
          { name: 'Guided walking training and terrain cure', detail: 'Graded paths in the spa forest, walking up to just below the pain threshold followed by a rest, in gradually longer stages.' },
          { name: 'Manual lymphatic drainage', detail: 'For chronic lymphoedema: hand techniques that support the drainage of lymph fluid from the legs.' },
          { name: 'Machine-assisted lymphatic drainage', detail: 'Devices such as Lymfoven and Lymfopress supplement the manual treatment of lymphoedema.' },
          { name: 'Group exercise and exercise therapy in the pool', detail: 'Exercises for endurance and calf muscles, in water with less strain on the joints.' },
          { name: 'Nutrition counselling', detail: 'Individual sessions on blood lipids, weight and glucose metabolism, that is, on the risk factors underlying the vascular findings.' },
        ],
        stay: {
          heading: 'How long, and when',
          body: 'Three positions on the Czech indication list apply here. Arterial disease of the limbs of atherosclerotic origin at stage IIb, or of inflammatory origin (II/4), provides for an initial stay of 21 days of comprehensive or 21 days of contributory care, with the repeat stay the same, in certain cases 14 days of contributory care. Functional disorders of the peripheral vessels, conditions after thrombosis and chronic lymphoedema (II/5) run to 21 days of comprehensive or contributory care, with a repeat stay of 21 or 14 days of contributory care. Conditions after vascular surgery and after percutaneous angioplasty (II/8) provide for 21 days of comprehensive or contributory care. Self-paying guests agree the length with the spa physician; the professional minimum is at least 10 treatments over at least 10 days.',
        },
        evidence: {
          heading: 'What the studies show',
          body: 'For circulatory problems in the legs, the evidence base for carbon dioxide treatments is comparatively the strongest. In a randomised study, foot baths in carbonated water (1000 mg CO₂ per kilogram, 33°C, 30 minutes, five times weekly over four weeks) increased peak arterial flow, tissue oxygen and the pain-free walking distance, while plain water did not change these values (Hartmann et al., 1997, Angiology; small cohort, artificially carbonated water, effect size not given in the abstract). A crossover study by the same research group with 18 patients found that immersing the feet in carbonated water increased laser-Doppler skin flow and tissue oxygen, while plain water did not (Hartmann et al., 1997, Angiology; single bath, surrogate parameters). After twenty minutes of exposing the skin to spa carbon dioxide gas, flow in the femoral artery, pressure at the posterior tibial artery and tissue oxygen in the foot increased, while water vapour of the same temperature had no effect (Savin et al., 1995, Angiology; very small cohort, single application). For the exercise component, strong evidence exists: a Cochrane review of walking training for intermittent claudication found, compared with usual care, a pain-free walking distance longer by an average of 82 metres and a maximum walking distance longer by 120 metres, with an effect lasting up to two years (Lane et al., 2017, Cochrane Database Syst Rev; outpatient exercise programmes, not spa treatment, most individual studies small). An older review notes that controlled evidence for CO₂ balneotherapy exists specifically for peripheral arterial disease, trophic ulcers and microangiopathies (Resch and Just, 1994, Wien Med Wochenschr). None of these papers shows that the cure replaces vascular surgery or vascular medical treatment.',
        },
        physicianNote: 'Whether and to what extent a spa cure is appropriate for your vascular findings is decided by the spa physician at the initial examination, based on the angiological findings. Pain at rest, a non-healing wound on the leg, or a leg that suddenly turns cold and pale, are emergencies and require immediate medical treatment, not spa planning. This page provides information and does not replace medical advice.',
        faqs: [
          {
            question: 'Does a spa cure help with intermittent claudication?',
            answer: 'Two components of the cure have been studied. For walking training, strong evidence exists: a Cochrane review found, compared with usual care, a pain-free walking distance longer on average by 82 metres and a maximum walking distance longer by 120 metres, with an effect lasting up to two years — though in outpatient programmes, not in spa stays. For foot baths in carbonated water, a randomised study showed an increase in peak arterial flow, tissue oxygen and pain-free walking distance, while plain water had no effect; the cohort was small. In Marienbad, both components come together.',
          },
          {
            question: 'Is a spa cure for circulatory problems covered?',
            answer: 'For people insured with a Czech health fund, three positions apply: arterial disease of the limbs at stage IIb or of inflammatory origin (II/4), functional disorders of the peripheral vessels, conditions after thrombosis and chronic lymphoedema (II/5), and conditions after vascular surgery and after angioplasty (II/8). Each provides for 21 days of comprehensive or contributory care. Guests insured outside the Czech Republic should clarify cost coverage with their own insurer in advance.',
          },
          {
            question: 'May I go for a spa cure after a thrombosis?',
            answer: "Once the acute phase is over, yes; the condition after a thrombosis is part of position II/5 on the indication list. A spa cure is excluded during the acute phase. How much time must pass and which treatments are possible is decided by the spa physician based on your own doctor's findings — so bring them with you.",
          },
          {
            question: 'What is done for lymphoedema?',
            answer: 'The focus is on manual lymphatic drainage and machine-assisted drainage with devices such as Lymfoven and Lymfopress, supplemented by exercises that support the return flow. Chronic lymphoedema is part of position II/5 of the indication list. Unhealed wounds on the leg rule out a number of treatments, which is why the legs are examined at the initial examination.',
          },
          {
            question: 'Do I have to stop smoking for the cure?',
            answer: 'For stays run through the Czech indication list, yes — nicotine abstinence is a requirement for the circulatory disease group, set out in the decree itself. For arterial disease of the legs, smoking is also the factor that most strongly determines the course.',
          },
        ],
        sources: [
          {
            title: 'Czech indication list for spa treatment (Decree No. 2/2015 Coll.), Group II — positions II/4, II/5 and II/8',
            url: '/en/indications-and-contraindications',
            note: 'Arterial disease of the limbs (II/4), functional disorders of the peripheral vessels, conditions after thrombosis and chronic lymphoedema (II/5), and conditions after vascular surgery and percutaneous angioplasty (II/8): each 21 days of comprehensive or contributory care.',
          },
          {
            title: 'Decree No. 2/2015 Coll. on the professional criteria for spa medical rehabilitation care — Group II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Full text of the indication list for circulatory diseases, including contraindications (second- to third-degree AV block, NYHA IV, active endocarditis), required nicotine abstinence and initial examinations. Czech-language text.',
          },
          {
            title: 'Hartmann BR et al. 1997, Angiology — randomised study of repeated carbon dioxide foot baths in intermittent claudication',
            url: 'https://doi.org/10.1177/000331979704801104',
            note: 'Foot baths in carbonated water increased peak arterial flow, tissue oxygen and pain-free walking distance; plain water did not. Small cohort, artificially carbonated water, effect size not given in the abstract.',
          },
          {
            title: 'Hartmann BR et al. 1997, Angiology — crossover study, 18 patients with peripheral arterial disease',
            url: 'https://doi.org/10.1177/000331979704800406',
            note: 'In carbonated water, skin blood flow and tissue oxygen increased; not in plain water. Single bath, surrogate parameters.',
          },
          {
            title: 'Savin E et al. 1995, Angiology — study of transcutaneous CO₂ in stage II peripheral arterial disease',
            url: 'https://doi.org/10.1177/000331979504600904',
            note: 'After 20 minutes of exposure to spa CO₂ gas, femoral flow, pressure at the posterior tibial artery and tissue oxygen in the foot increased; water vapour of the same temperature had no effect. Very small cohort, single application.',
          },
          {
            title: 'Lane R et al. 2017, Cochrane Database Syst Rev — review of walking training in intermittent claudication',
            url: 'https://doi.org/10.1002/14651858.CD000990.pub4',
            note: 'Exercise programmes lengthened the pain-free walking distance by an average of 82 m and the maximum by 120 m compared with usual care, with an effect lasting up to 2 years. Outpatient programmes, not spa treatment.',
          },
          {
            title: 'Resch KL, Just U 1994, Wien Med Wochenschr — review of the possibilities and limits of CO₂ balneotherapy',
            url: 'https://consensus.app/papers/details/624f01a417885d7f9c0caf162686c4cc/',
            note: 'Controlled evidence only for peripheral arterial disease, trophic ulcers, microangiopathies and mild hypertension. Older review.',
          },
        ],
        related: [
          { label: 'Heart and circulation before winter', href: '/en/magazine/cardiovascular-spa-cure-marianske-lazne' },
          { label: 'Carbon dioxide baths — what the research shows', href: '/en/magazine/co2-baths-science' },
          { label: 'Spa treatment after cancer treatment', href: '/en/spa-treatment-for/after-cancer-treatment' },
          { label: 'Indications and contraindications', href: '/en/indications-and-contraindications' },
        ],
      },
      cs: {
        slug: 'prokrveni-nohou',
        navLabel: 'Prokrvení nohou',
        title: 'Lázeňská léčba poruch prokrvení nohou v Mariánských Lázních',
        h1: 'Lázeňská léčba poruch prokrvení nohou',
        metaTitle: 'Léčba prokrvení nohou v Mariánských Lázních | Marienbad.com',
        metaDescription: 'Klaudikace, stav po trombóze, lymfedém: uhličité koupele, trénink chůze a lymfodrenáž v Mariánských Lázních — co se léčí, jak probíhá a jak dlouho pobyt trvá.',
        lead: 'Když lýtko po dvou stech metrech začne pálit a musíte se zastavit, abyste mohli pokračovat, jde o klaudikaci — takzvanou nemoc výkladních skříní. Český indikační seznam vede onemocnění tepen končetin, stavy po trombózách a chronický lymfatický edém ve skupině nemocí oběhového ústrojí — a Mariánské Lázně je léčí uhličitými koupelemi a vedeným tréninkem chůze.',
        teaser: 'Klaudikace, stav po trombóze a chronický lymfatický edém: uhličité koupele, trénink chůze a lymfodrenáž.',
        treats: [
          'Onemocnění tepen končetin na aterosklerotickém podkladě ve stadiu II b, tedy s klaudikací',
          'Onemocnění tepen končetin na zánětlivém podkladě',
          'Funkční poruchy periferních cév',
          'Stav po trombóze, je-li akutní fáze ukončena',
          'Chronický lymfatický edém nohou',
          'Stav po rekonstrukčních a revaskularizačních operacích na cévním systému mimo srdce a hrudní aortu a po perkutánní angioplastice',
        ],
        notFor: [
          'Kritická ischemie končetiny s klidovou bolestí nebo hrozícím odumíráním tkáně — to patří do cévní chirurgie, ne do lázní',
          'Čerstvá hluboká žilní trombóza v akutní fázi',
          'Nezhojené rány a vředy na noze',
          'Srdeční selhání ve stadiu NYHA IV, AV blok druhého až třetího stupně a aktivní endokarditida',
          'Pokračující kouření: indikační seznam vyžaduje pro skupinu oběhového ústrojí abstinenci od nikotinu',
        ],
        course: [
          {
            heading: 'Vstupní prohlídka v den příjezdu',
            body: 'Lázeňský lékař zjistí cévní nález, vyšetří pulsy, stav kůže a obvody nohou a zjistí bezbolestnou vzdálenost chůze — ta je měřítkem, podle kterého se posuzuje vývoj. Vezměte si nález svého angiologa nebo cévního chirurga.',
          },
          {
            heading: 'První týden: prokrvení a vzdálenost chůze',
            body: 'Denně se používají uhličité koupele a suché plynové koupele, k tomu vedený trénink chůze po rovných cestách až téměř k hranici bolesti — to je zátěž, na které tréninku chůze záleží.',
          },
          {
            heading: 'Druhý týden: prodlužování vzdálenosti',
            body: 'Vzdálenost chůze se prodlužuje, přibývá stoupání. U lymfedému stojí naopak v popředí manuální lymfodrenáž a přístrojová drenáž, doplněné cvičením, které podporuje odtok.',
          },
          {
            heading: 'Závěrečná prohlídka a plán pro doma',
            body: 'Bezbolestná vzdálenost chůze se znovu změří a porovná s výchozí hodnotou; nález se zapíše do závěrečné zprávy. Dostanete program chůze pro doma — bez pravidelného pokračování se dosažený přínos vrátí zpět.',
          },
        ],
        procedures: [
          {
            name: 'Uhličitá koupel z minerální vody',
            detail: 'Koupel v místní minerální vodě při zhruba 34 °C; oxid uhličitý přijímaný kůží je u poruch prokrvení končetin hlavní procedurou.',
          },
          {
            name: 'Suchá plynová koupel v Mariině plynu',
            detail: 'Aplikace přírodního oxidu uhličitého z Mariina pramene bez vody a bez zátěže teplem — vhodná i tam, kde teplé koupele nepřipadají v úvahu.',
          },
          {
            name: 'Vedený trénink chůze a terénní léčba',
            detail: 'Odstupňované cesty v lázeňském lese, s chůzí až téměř k hranici bolesti a následnou pauzou, v postupně delších úsecích.',
          },
          {
            name: 'Manuální lymfodrenáž',
            detail: 'U chronického lymfatického edému: hmaty, které podporují odtok lymfy z nohou.',
          },
          {
            name: 'Přístrojová lymfodrenáž',
            detail: 'Přístroje jako Lymfoven a Lymfopress doplňují manuální léčbu lymfedému.',
          },
          {
            name: 'Skupinové cvičení a pohybová terapie v bazénu',
            detail: 'Cvičení na vytrvalost a lýtkové svalstvo, ve vodě s menší zátěží kloubů.',
          },
          {
            name: 'Dietní poradenství',
            detail: 'Individuální konzultace ke krevním tukům, váze a metabolismu cukrů, tedy k rizikovým faktorům, které stojí za cévním nálezem.',
          },
        ],
        stay: {
          heading: 'Jak dlouho a kdy',
          body: 'V úvahu přicházejí tři položky českého indikačního seznamu — onemocnění tepen končetin na aterosklerotickém podkladě ve stadiu II b nebo na zánětlivém podkladě (II/4), funkční poruchy periferních cév, stavy po trombózách a chronický lymfatický edém (II/5) a stavy po cévních operacích a po perkutánní angioplastice (II/8); přesnou délku hrazeného pobytu u každé z nich najdete na stránce Co hradí pojišťovna u oběhového ústrojí. Samoplátci volí délku po dohodě s lázeňským lékařem; jako odborné minimum platí alespoň 10 procedur během alespoň 10 dní.',
        },
        evidence: {
          heading: 'Co ukazují studie',
          body: 'U poruch prokrvení nohou je u procedur s oxidem uhličitým studijní podklad relativně nejlepší. V randomizované studii zvýšily koupele nohou v uhličité vodě (1000 mg CO₂ na kilogram, 33 °C, 30 minut, pětkrát týdně po dobu čtyř týdnů) arteriální špičkový průtok, tkáňový kyslík a bezbolestnou vzdálenost chůze, zatímco běžná voda hodnoty nezměnila (Hartmann a kol., 1997, Angiology; malý soubor, uměle sycená voda, velikost účinku v abstraktu neuvedena). Cross-over studie téže pracovní skupiny s 18 pacienty zjistila při ponoření nohou do uhličité vody nárůst laserdopplerem měřeného kožního průtoku a tkáňového kyslíku, v běžné vodě ne (Hartmann a kol., 1997, Angiology; jednorázová koupel, náhradní parametry). Po dvacetiminutovém působení lázeňského oxidu uhličitého na kůži stoupl průtok ve stehenní artérii, tlak na zadní tibiální artérii a tkáňový kyslík v noze, zatímco vodní pára stejné teploty zůstala bez účinku (Savin a kol., 1995, Angiology; velmi malý soubor, jednorázová aplikace). Pro pohybovou složku existuje vysoká úroveň důkazů: Cochranský přehled k tréninku chůze u klaudikace zjistil oproti běžné péči o průměrně 82 metrů delší bezbolestnou a o 120 metrů delší maximální vzdálenost chůze, s účinkem až do dvou let (Lane a kol., 2017, Cochrane Database Syst Rev; ambulantní cvičební programy, ne lázeňská léčba, většina jednotlivých studií malá). Starší přehled uvádí, že kontrolované důkazy k CO₂ balneoterapii existují právě pro periferní tepennou uzávěrovou nemoc, trofické vředy a mikroangiopatie (Resch a Just, 1994, Wien Med Wochenschr). Žádná z těchto prací neprokazuje, že by lázeňský pobyt mohl nahradit cévní operaci nebo cévní léčbu.',
        },
        physicianNote: 'O tom, zda a v jakém rozsahu pro vás při vašem cévním nálezu připadá v úvahu lázeňský pobyt, rozhoduje lázeňský lékař při vstupní prohlídce podle angiologického nálezu. Klidová bolest, nehojící se rána na noze nebo náhle chladnoucí a blednoucí noha jsou akutní stavy a patří neprodleně do lékařské péče, ne do plánování lázní. Tato stránka informuje a nenahrazuje lékařskou konzultaci.',
        faqs: [
          {
            question: 'Pomůže lázeňský pobyt při klaudikaci?',
            answer: 'Zkoumány jsou dvě součásti lázeňského pobytu. Pro trénink chůze existuje vysoká úroveň důkazů: Cochranský přehled zjistil oproti běžné péči v průměru o 82 metrů delší bezbolestnou a o 120 metrů delší maximální vzdálenost chůze, s účinkem až do dvou let — šlo však o ambulantní programy, ne o lázeňské pobyty. Pro koupele nohou v uhličité vodě zjistila randomizovaná studie nárůst arteriálního špičkového průtoku, tkáňového kyslíku a bezbolestné vzdálenosti chůze, zatímco běžná voda zůstala bez účinku; soubor byl malý. V Mariánských Lázních se obě součásti spojují.',
          },
          {
            question: 'Hradí pojišťovna lázně při poruchách prokrvení?',
            answer: 'U pojištěnců české zdravotní pojišťovny přicházejí v úvahu tři položky: onemocnění tepen končetin ve stadiu II b nebo na zánětlivém podkladě (II/4), funkční poruchy periferních cév, stavy po trombózách a chronický lymfatický edém (II/5) a stavy po cévních operacích a po angioplastice (II/8); přesnou délku hrazeného pobytu u každé z nich najdete na stránce Co hradí pojišťovna u oběhového ústrojí. Hosté s pojištěním mimo Česko si úhradu ověřují předem u vlastní pojišťovny.',
          },
          {
            question: 'Mohu jet do lázní po trombóze?',
            answer: 'Po ukončení akutní fáze ano; stav po trombóze je součástí položky II/5 indikačního seznamu. V akutní fázi je lázeňský pobyt vyloučen. Jak dlouhý odstup je potřeba a které procedury jsou možné, rozhoduje lázeňský lékař podle nálezu vašeho ošetřujícího lékaře — vezměte si ho proto s sebou.',
          },
          {
            question: 'Co se dělá při lymfedému?',
            answer: 'V popředí stojí manuální lymfodrenáž a přístrojová drenáž pomocí přístrojů jako Lymfoven a Lymfopress, doplněné cvičením, které podporuje odtok. Chronický lymfatický edém je součástí položky II/5 indikačního seznamu. Nezhojené rány na noze vylučují řadu procedur, proto se nohy prohlížejí už při vstupní prohlídce.',
          },
          {
            question: 'Musím pro lázně přestat kouřit?',
            answer: 'Pro pobyty přes český indikační seznam ano — abstinence od nikotinu je pro skupinu nemocí oběhového ústrojí podmínkou, která je přímo ve vyhlášce. U onemocnění tepen nohou je navíc kouření faktor, který nejvíc určuje další vývoj.',
          },
        ],
        sources: [
          {
            title: 'Indikační seznam lázeňské péče (vyhláška č. 2/2015 Sb.), skupina II — položky II/4, II/5 a II/8',
            url: '/cs/indikace-a-kontraindikace',
            note: 'Onemocnění tepen končetin (II/4), funkční poruchy periferních cév, stavy po trombózách a chronický lymfatický edém (II/5) a stavy po cévních operacích a perkutánní angioplastice (II/8), s typem péče a délkou pobytu.',
          },
          {
            title: 'Vyhláška č. 2/2015 Sb. o odborných kritériích lázeňské léčebně rehabilitační péče — skupina II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Úplné znění indikačního seznamu pro nemoci oběhového ústrojí včetně kontraindikací (AV blok II. až III. stupně, NYHA IV, aktivní endokarditida), požadované abstinence od nikotinu a vstupních vyšetření.',
          },
          {
            title: 'Hartmann BR a kol. 1997, Angiology — randomizovaná studie k opakovaným uhličitým koupelím nohou u klaudikace',
            url: 'https://doi.org/10.1177/000331979704801104',
            note: 'Koupele nohou v uhličité vodě zvýšily arteriální špičkový průtok, tkáňový kyslík a bezbolestnou vzdálenost chůze; běžná voda ne. Malý soubor, uměle sycená voda, velikost účinku v abstraktu neuvedena.',
          },
          {
            title: 'Hartmann BR a kol. 1997, Angiology — cross-over studie, 18 pacientů s periferní tepennou uzávěrovou nemocí',
            url: 'https://doi.org/10.1177/000331979704800406',
            note: 'V uhličité vodě stoupl kožní průtok a tkáňový kyslík, v běžné vodě ne. Jednorázová koupel, náhradní parametry.',
          },
          {
            title: 'Savin E a kol. 1995, Angiology — studie k transkutánnímu CO₂ u periferní tepenné uzávěrové nemoci ve stadiu II',
            url: 'https://doi.org/10.1177/000331979504600904',
            note: 'Po 20 minutách působení lázeňského CO₂ plynu stoupl femorální průtok, tlak na a. tibialis posterior a tkáňový kyslík nohy; vodní pára stejné teploty zůstala bez účinku. Velmi malý soubor, jednorázová aplikace.',
          },
          {
            title: 'Lane R a kol. 2017, Cochrane Database Syst Rev — přehled k tréninku chůze u klaudikace',
            url: 'https://doi.org/10.1002/14651858.CD000990.pub4',
            note: 'Cvičební programy prodloužily bezbolestnou vzdálenost chůze v průměru o 82 m a maximální o 120 m oproti běžné péči, s účinkem až do 2 let. Ambulantní programy, ne lázeňská léčba.',
          },
          {
            title: 'Resch KL, Just U 1994, Wien Med Wochenschr — přehled k možnostem a hranicím CO₂ balneoterapie',
            url: 'https://consensus.app/papers/details/624f01a417885d7f9c0caf162686c4cc/',
            note: 'Kontrolované důkazy jen pro periferní tepennou uzávěrovou nemoc, trofické vředy a mikroangiopatie a mírnou hypertenzi. Starší přehled.',
          },
        ],
        related: [
          {
            label: 'Srdce a cévy před zimou',
            href: '/cs/magazin/lazenska-lecba-obehoveho-ustroji',
          },
          {
            label: 'CO₂ koupele: Co říká věda',
            href: '/cs/magazin/co2-koupele-veda',
          },
          {
            label: 'Lázeňská léčba po onkologické léčbě',
            href: '/cs/lazenska-lecba/po-onkologicke-lecbe',
          },
          {
            label: 'Co hradí pojišťovna u oběhového ústrojí',
            href: '/cs/lazne-s-pojistovnou/indikace/obehove-ustroji',
          },
        ],
      },
      ru: {
        slug: 'krovoobrashchenie-nog',
        navLabel: 'Кровообращение ног',
        title: 'Курортное лечение нарушений кровообращения ног в Марианских Лазнях',
        h1: 'Курортное лечение нарушений кровообращения ног',
        metaTitle: 'Лечение нарушений кровообращения ног — Марианские Лазни',
        metaDescription: 'Перемежающаяся хромота, состояние после тромбоза, лимфедема: углекислые ванны, тренировка ходьбы и лимфодренаж в Марианских Лазнях — ход лечения и сроки.',
        lead: 'Когда икра начинает жечь уже через двести метров и приходится останавливаться, чтобы продолжить путь, это называется перемежающейся хромотой. Чешский индикационный список относит заболевания артерий конечностей, состояния после тромбозов и хроническую лимфедему к группе заболеваний системы кровообращения — и в Марианских Лазнях их лечат углекислыми ваннами и тренировкой ходьбы под руководством инструктора.',
        teaser: 'Перемежающаяся хромота, состояние после тромбоза и хроническая лимфедема: углекислые ванны, тренировка ходьбы и лимфодренаж.',
        treats: [
          'Заболевание артерий конечностей атеросклеротического происхождения на стадии II b, то есть с перемежающейся хромотой',
          'Заболевание артерий конечностей воспалительного происхождения',
          'Функциональные нарушения периферических сосудов',
          'Состояние после тромбоза, если острая фаза завершена',
          'Хроническая лимфедема ног',
          'Состояние после реконструктивных и реваскуляризирующих операций на сосудистой системе за пределами сердца и грудной аорты, а также после чрескожной ангиопластики',
        ],
        notFor: [
          'Критическая ишемия конечности с болью в покое или угрозой гибели тканей — это относится к сосудистой хирургии, а не к курортному лечению',
          'Свежий тромбоз глубоких вен ноги в острой фазе',
          'Незаживающие раны и язвы на ноге',
          'Сердечная недостаточность стадии NYHA IV, АВ-блокада второй-третьей степени и активный эндокардит',
          'Продолжение курения: индикационный список требует для группы заболеваний системы кровообращения отказа от курения',
        ],
        course: [
          {
            heading: 'Первичный осмотр в день заезда',
            body: 'Курортный врач фиксирует сосудистое состояние, проверяет пульсацию, состояние кожи и объём ног и уточняет безболевую дистанцию ходьбы — именно она служит мерой, по которой оценивают динамику. Возьмите с собой заключение вашего ангиолога или сосудистого хирурга.',
          },
          {
            heading: 'Первая неделя: кровообращение и дистанция ходьбы',
            body: 'Углекислые и сухие газовые ванны применяют ежедневно, а также тренировку ходьбы под руководством инструктора по ровным дорожкам почти до порога боли — именно такая нагрузка важна при тренировке ходьбы.',
          },
          {
            heading: 'Вторая неделя: увеличение дистанции',
            body: 'Дистанции ходьбы увеличиваются, добавляются подъёмы. При лимфедеме, напротив, на первый план выходят ручной лимфодренаж и аппаратный дренаж, дополненные упражнениями, поддерживающими отток лимфы.',
          },
          {
            heading: 'Заключительное обследование и план на дом',
            body: 'Безболевая дистанция ходьбы измеряется повторно и сравнивается с исходным значением; результат включается в итоговое заключение. Вы получаете программу ходьбы на дом — без регулярных занятий достигнутый результат теряется.',
          },
        ],
        procedures: [
          {
            name: 'Углекислая ванна в минеральной воде',
            detail: 'Ванна в местной минеральной воде при температуре около 34 °C; углекислый газ, проникающий через кожу, — центральная процедура при нарушениях кровообращения конечностей.',
          },
          {
            name: 'Сухая газовая ванна в марианском газе',
            detail: 'Применение природного углекислого газа источника Марии без воды и без тепловой нагрузки — подходит и там, где тёплые ванны невозможны.',
          },
          {
            name: 'Тренировка ходьбы под руководством инструктора и терренкур',
            detail: 'Размеченные маршруты в курортном лесу: ходьба почти до порога боли с последующей паузой, этапы постепенно увеличиваются.',
          },
          {
            name: 'Ручной лимфодренаж',
            detail: 'При хронической лимфедеме: приёмы, поддерживающие отток лимфатической жидкости из ног.',
          },
          {
            name: 'Аппаратный лимфодренаж',
            detail: 'Аппараты, такие как Lymfoven и Lymfopress, дополняют ручное лечение лимфедемы.',
          },
          {
            name: 'Групповые занятия и двигательная терапия в бассейне',
            detail: 'Упражнения на выносливость и икроножные мышцы, в воде с меньшей нагрузкой на суставы.',
          },
          {
            name: 'Консультация по питанию',
            detail: 'Индивидуальные беседы о липидах крови, весе и углеводном обмене, то есть о факторах риска, лежащих в основе сосудистого заболевания.',
          },
        ],
        stay: {
          heading: 'Сколько длится и когда ехать',
          body: 'Здесь применимы три позиции чешского индикационного списка. Заболевания артерий конечностей атеросклеротического происхождения на стадии II b или воспалительного происхождения (II/4) предусматривают в качестве базового пребывания 21 день комплексного или 21 день долевого лечения, повторное пребывание проходит так же, в отдельных случаях — 14 дней долевого лечения. Функциональные нарушения периферических сосудов, состояния после тромбозов и хроническая лимфедема (II/5) проходят как 21 день комплексного или долевого лечения, повторное пребывание — 21 или 14 дней долевого лечения. Состояния после сосудистых операций и после чрескожной ангиопластики (II/8) предусматривают 21 день комплексного или долевого лечения. Гости, оплачивающие лечение самостоятельно, согласуют срок с курортным врачом; профессиональным минимумом считается не менее 10 процедур за не менее чем 10 дней.',
        },
        evidence: {
          heading: 'Что показывают исследования',
          body: 'Для нарушений кровообращения ног доказательная база по процедурам с углекислым газом сравнительно наиболее полная. В рандомизированном исследовании ножные ванны в воде с углекислым газом (1000 мг CO₂ на килограмм, 33 °C, 30 минут, пять раз в неделю на протяжении четырёх недель) увеличили пиковый артериальный кровоток, тканевой кислород и безболевую дистанцию ходьбы, тогда как обычная вода показатели не изменила (Hartmann et al., 1997, Angiology; небольшая выборка, искусственно обогащённая вода, размер эффекта в резюме не указан). Кросс-оверное исследование той же исследовательской группы с 18 пациентами обнаружило при погружении стоп в воду с углекислым газом повышение измеренного лазерным допплером кожного кровотока и тканевого кислорода, в обычной воде — нет (Hartmann et al., 1997, Angiology; однократная ванна, суррогатные параметры). После двадцатиминутного воздействия курортного углекислого газа на кожу возросли кровоток в бедренной артерии, давление в задней большеберцовой артерии и тканевой кислород стопы, тогда как водяной пар той же температуры оказался безрезультатным (Savin et al., 1995, Angiology; очень небольшая выборка, однократная процедура). Для двигательной составляющей доказательная база высокая: Кокрейновский обзор по тренировке ходьбы при перемежающейся хромоте обнаружил по сравнению с обычным лечением в среднем на 82 метра большую безболевую и на 120 метров большую максимальную дистанцию ходьбы, с эффектом до двух лет (Lane et al., 2017, Cochrane Database Syst Rev; амбулаторные программы упражнений, а не курортное лечение, большинство отдельных исследований небольшие). Более старый обзор указывает, что контролируемые доказательства по CO₂-бальнеотерапии имеются именно для периферической артериальной окклюзионной болезни, трофических язв и микроангиопатий (Resch и Just, 1994, Wien Med Wochenschr). Ни одна из этих работ не показывает, что курортное лечение заменяет сосудистую операцию или сосудистое медицинское лечение.',
        },
        physicianNote: 'Возможно ли и в каком объёме курортное лечение при вашем сосудистом заболевании, решает курортный врач при первичном осмотре на основании ангиологического заключения. Боль в покое, незаживающая рана на ноге или внезапно похолодевшая и побледневшая нога — это неотложные состояния, требующие немедленного обращения к врачу, а не планирования курортного лечения. Эта страница носит информационный характер и не заменяет консультацию врача.',
        faqs: [
          {
            question: 'Помогает ли курортное лечение при перемежающейся хромоте?',
            answer: 'Изучены два компонента курортного лечения. Для тренировки ходьбы доказательная база высокая: Кокрейновский обзор обнаружил по сравнению с обычным лечением в среднем на 82 метра большую безболевую и на 120 метров большую максимальную дистанцию ходьбы, с эффектом до двух лет — однако в амбулаторных программах, а не в курортных пребываниях. Для ножных ванн в воде с углекислым газом рандомизированное исследование показало увеличение пикового артериального кровотока, тканевого кислорода и безболевой дистанции ходьбы, тогда как обычная вода оказалась безрезультатной; выборка была небольшой. В Марианских Лазнях оба компонента сочетаются.',
          },
          {
            question: 'Оплачивается ли курортное лечение при нарушениях кровообращения?',
            answer: 'Для застрахованных в чешской страховой компании применимы три позиции: заболевания артерий конечностей на стадии II b или воспалительного происхождения (II/4), функциональные нарушения периферических сосудов, состояния после тромбозов и хроническая лимфедема (II/5), а также состояния после сосудистых операций и после ангиопластики (II/8). В каждом случае предусмотрено 21 день комплексного или долевого лечения. Гости со страховкой за пределами Чехии заранее уточняют возможность возмещения у своего страховщика.',
          },
          {
            question: 'Можно ли ехать на курортное лечение после тромбоза?',
            answer: 'После завершения острой фазы — да; состояние после тромбоза входит в позицию II/5 индикационного списка. В острой фазе курортное лечение исключено. Какой должен быть интервал и какие процедуры возможны, решает курортный врач на основании заключения вашего лечащего врача — поэтому возьмите его с собой.',
          },
          {
            question: 'Что делают при лимфедеме?',
            answer: 'На первый план выходят ручной лимфодренаж и аппаратный дренаж с помощью таких аппаратов, как Lymfoven и Lymfopress, дополненные упражнениями, поддерживающими отток лимфы. Хроническая лимфедема входит в позицию II/5 индикационного списка. Незаживающие раны на ноге исключают ряд процедур, поэтому ноги осматривают уже при первичном осмотре.',
          },
          {
            question: 'Нужно ли бросить курить перед курортным лечением?',
            answer: 'Для пребываний через чешский индикационный список — да: отказ от курения для группы заболеваний системы кровообращения — это требование, закреплённое в самом постановлении. При заболеваниях артерий ног курение к тому же тот фактор, который сильнее всего определяет течение болезни.',
          },
        ],
        sources: [
          {
            title: 'Индикационный список для курортного лечения (Постановление № 2/2015 Сб.), группа II — позиции II/4, II/5 и II/8',
            url: '/ru/pokazaniya-i-protivopokazaniya',
            note: 'Заболевания артерий конечностей (II/4), функциональные нарушения периферических сосудов, состояния после тромбозов и хроническая лимфедема (II/5), а также состояния после сосудистых операций и чрескожной ангиопластики (II/8): в каждом случае 21 день комплексного или долевого лечения.',
          },
          {
            title: 'Постановление № 2/2015 Сб. о профессиональных критериях курортной реабилитационной помощи — группа II',
            url: 'https://www.zakonyprolidi.cz/cs/2015-2',
            note: 'Полный текст индикационного списка для заболеваний системы кровообращения, включая противопоказания (АВ-блокада II-III степени, NYHA IV, активный эндокардит), требуемый отказ от курения и первичные обследования. Текст на чешском языке.',
          },
          {
            title: 'Hartmann BR et al. 1997, Angiology — рандомизированное исследование повторных углекислых ножных ванн при перемежающейся хромоте',
            url: 'https://doi.org/10.1177/000331979704801104',
            note: 'Ножные ванны в воде с углекислым газом увеличили пиковый артериальный кровоток, тканевой кислород и безболевую дистанцию ходьбы; обычная вода — нет. Небольшая выборка, искусственно обогащённая вода, размер эффекта в резюме не указан.',
          },
          {
            title: 'Hartmann BR et al. 1997, Angiology — кросс-оверное исследование, 18 пациентов с периферической артериальной окклюзионной болезнью',
            url: 'https://doi.org/10.1177/000331979704800406',
            note: 'В воде с углекислым газом повысились кожный кровоток и тканевой кислород, в обычной воде — нет. Однократная ванна, суррогатные параметры.',
          },
          {
            title: 'Savin E et al. 1995, Angiology — исследование транскутанного CO₂ при периферической артериальной окклюзионной болезни на стадии II',
            url: 'https://doi.org/10.1177/000331979504600904',
            note: 'После 20 минут воздействия курортного CO₂-газа возросли кровоток в бедренной артерии, давление в задней большеберцовой артерии и тканевой кислород стопы; водяной пар той же температуры оказался безрезультатным. Очень небольшая выборка, однократная процедура.',
          },
          {
            title: 'Lane R et al. 2017, Cochrane Database Syst Rev — обзор по тренировке ходьбы при перемежающейся хромоте',
            url: 'https://doi.org/10.1002/14651858.CD000990.pub4',
            note: 'Программы упражнений увеличили безболевую дистанцию ходьбы в среднем на 82 м и максимальную на 120 м по сравнению с обычным лечением, с эффектом до 2 лет. Амбулаторные программы, а не курортное лечение.',
          },
          {
            title: 'Resch KL, Just U 1994, Wien Med Wochenschr — обзор о возможностях и границах CO₂-бальнеотерапии',
            url: 'https://consensus.app/papers/details/624f01a417885d7f9c0caf162686c4cc/',
            note: 'Контролируемые доказательства только для периферической артериальной окклюзионной болезни, трофических язв, микроангиопатий и лёгкой гипертонии. Более старый обзор.',
          },
        ],
        related: [
          {
            label: 'Сердце и сосуды перед зимой',
            href: '/ru/zhurnal/kurortnoe-lechenie-serdca-i-sosudov',
          },
          {
            label: 'Углекислые ванны — что показывает наука',
            href: '/ru/zhurnal/co2-vanny-nauka',
          },
          {
            label: 'Курортное лечение после лечения онкологии',
            href: '/ru/kurortnoe-lechenie/posle-lecheniya-onkologii',
          },
          {
            label: 'Показания и противопоказания',
            href: '/ru/pokazaniya-i-protivopokazaniya',
          },
        ],
      },
    },
  },
]
