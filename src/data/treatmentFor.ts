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
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
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
            'Kontrollierte Studien speziell zur Kur nach einer Hüftoperation sind selten. Eine italienische Pilotstudie mit 12 Patienten nach Hüfttotalendoprothese fand nach zwei Wochen kombinierter trockener und wasserbasierter Rehabilitation im Kurbetrieb einen größeren Bewegungsumfang, einen höheren Harris Hip Score und eine bessere körperliche Lebensqualität; die Schmerzstärke änderte sich dabei nicht signifikant (Musumeci et al., 2018, Int J Biometeorol; sehr kleine, unkontrollierte Stichprobe). Eine breiter angelegte italienische Beobachtungsstudie mit 123 Patienten mit degenerativen und postoperativen Erkrankungen des Bewegungsapparats — nicht speziell nach Hüftoperation — fand nach zwölf Übungseinheiten im Thermalwasser über zwei Wochen bessere Werte für Schmerz, Stimmung und Lebensqualität (Maccarone et al., 2022, Int J Biometeorol; ohne Kontrollgruppe, kurzes Follow-up). Beide Studien zeigen kurzfristige Effekte einzelner Kurprogramme, keinen Vergleich mit ambulanter Reha und keinen Langzeitverlauf über die untersuchten Wochen hinaus.',
        },
        physicianNote:
          'Ob und wann eine Kur nach Ihrer Hüftoperation infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand des OP-Berichts und der Freigabe Ihres Operateurs. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
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
            'Controlled studies specifically on spa treatment after hip replacement are rare. An Italian pilot study of 12 patients after total hip replacement found, after two weeks of combined dry and water-based rehabilitation at a spa, a greater range of motion, a higher Harris Hip Score and better physical quality of life; pain intensity did not change significantly (Musumeci et al., 2018, Int J Biometeorol; a very small, uncontrolled sample). A broader Italian observational study of 123 patients with degenerative and post-operative musculoskeletal conditions — not specific to hip surgery — found better scores for pain, mood and quality of life after twelve exercise sessions in thermal water over two weeks (Maccarone et al., 2022, Int J Biometeorol; no control group, short follow-up). Both studies show short-term effects of individual spa programmes, no comparison with outpatient rehabilitation, and no long-term course beyond the weeks studied.',
        },
        physicianNote:
          'Whether and when a spa cure is right after your hip surgery is decided by the spa physician at the initial examination, based on the surgical report and your surgeon’s clearance. This page provides information and does not replace medical advice.',
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
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
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
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
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
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
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
      cs: 'Therapeutin legt eine warme Moorpackung auf den Rücken eines Kurgastes',
      ru: 'Therapeutin legt eine warme Moorpackung auf den Rücken eines Kurgastes',
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
          body: 'Für Morbus Bechterew liegt unter den entzündlich-rheumatischen Erkrankungen die beste Evidenz vor: In einer niederländischen Studie mit 120 Patienten verbesserte ein dreiwöchiger Kuraufenthalt mit Übungstherapie Funktion und Lebensqualität noch nach 40 Wochen gegenüber der Standardbehandlung (van Tubergen et al., 2002, Arthritis Rheum; offene Studie). Ein Cochrane-Review bestätigt, dass eine kombinierte Kur-Übungstherapie mit anschließender Gruppenphysiotherapie wirksamer ist als Physiotherapie allein, gestützt allerdings nur auf eine einzelne Vergleichsstudie (Dagfinrud et al., 2008, Cochrane Database Syst Rev). Für rheumatoide Arthritis selbst ist die Studienlage schwächer: Eine kleine türkische Crossover-Studie mit 50 Patienten unter laufender Basistherapie fand nach zwei Wochen Kur eine bis zu sechs Monate anhaltend bessere Krankheitsaktivität und Selbsteinschätzung (Karagülle M et al., 2018, Int J Biometeorol; einfach verblindet, kleine Stichprobe). Ein Cochrane-Review kommt insgesamt zu einem vorsichtigeren Schluss: Die vorliegenden Studien reichen nicht aus, um zu belegen, dass Balneotherapie bei rheumatoider Arthritis wirksamer ist als keine oder eine andere Behandlung (Verhagen AP et al., 2015, Eur J Phys Rehabil Med; unklares Verzerrungsrisiko in den Primärstudien). Ein narrativer Übersichtsartikel fasst zusammen: Die besten Ergebnisse zeigen sich bei axialem Befall wie Morbus Bechterew, bei rheumatoider Arthritis ist die Evidenz weniger überzeugend, die Anwendungen gelten aber als sicher (Cozzi F et al., 2018, Int J Biometeorol; niedrige Qualität der Primärstudien). Keine dieser Studien zeigt einen Einfluss auf den langfristigen Krankheitsverlauf, und keine ersetzt die Basistherapie mit DMARDs oder Biologika.',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer Befunde und in Abstimmung mit Ihrem Rheumatologen. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
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
        metaTitle: 'Spa treatment for rheumatoid arthritis in Marienbad | Marienbad.com',
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
          body: 'Among inflammatory rheumatic diseases, the best evidence is for ankylosing spondylitis: in a Dutch study of 120 patients, a three-week spa stay with exercise therapy improved function and quality of life, still evident at 40 weeks compared with standard treatment (van Tubergen et al., 2002, Arthritis Rheum; open-label study). A Cochrane review confirms that combined spa exercise therapy followed by group physiotherapy is more effective than physiotherapy alone, though this rests on only a single comparative study (Dagfinrud et al., 2008, Cochrane Database Syst Rev). For rheumatoid arthritis itself the evidence is weaker: a small Turkish crossover study of 50 patients on ongoing disease-modifying therapy found better disease activity and self-assessment lasting up to six months after a two-week cure (Karagülle M et al., 2018, Int J Biometeorol; single-blind, small sample). A Cochrane review reaches a more cautious overall conclusion: the available studies are not sufficient to show that balneotherapy is more effective than no treatment or another treatment in rheumatoid arthritis (Verhagen AP et al., 2015, Eur J Phys Rehabil Med; unclear risk of bias in the primary studies). A narrative review sums up: the best results appear with axial involvement such as ankylosing spondylitis, while the evidence for rheumatoid arthritis is less convincing, though the treatments are considered safe (Cozzi F et al., 2018, Int J Biometeorol; low quality of the primary studies). None of these studies shows an effect on the long-term course of the disease, and none replaces disease-modifying therapy with DMARDs or biologics.',
        },
        physicianNote: 'Whether and to what extent a spa cure is right for you is decided by the spa physician at the initial examination, based on your findings and in consultation with your rheumatologist. This page provides information and does not replace medical advice.',
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
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
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
      cs: 'Nahaufnahme einer Hand, die die Wasseroberfläche eines Mineralbads berührt',
      ru: 'Nahaufnahme einer Hand, die die Wasseroberfläche eines Mineralbads berührt',
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
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
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
      cs: 'Kurgast füllt einen Trinkkurbecher bei Tageslicht an einer Mineralquelle',
      ru: 'Kurgast füllt einen Trinkkurbecher bei Tageslicht an einer Mineralquelle',
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
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
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
      cs: 'Älterer Mann trinkt Mineralwasser aus einem Trinkkurbecher während der Trinkkur',
      ru: 'Älterer Mann trinkt Mineralwasser aus einem Trinkkurbecher während der Trinkkur',
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
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
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
      cs: 'Therapeutin führt eine manuelle Lymphdrainage an den Beinen einer Gästin durch',
      ru: 'Therapeutin führt eine manuelle Lymphdrainage an den Beinen einer Gästin durch',
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
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
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
      cs: 'Gast erhält im Profil eine Sauerstofftherapie über eine Atemmaske',
      ru: 'Gast erhält im Profil eine Sauerstofftherapie über eine Atemmaske',
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
          body: 'Eine systematische Übersicht über 27 Studien zur Inhalation von Mineralwässern beschreibt eine bessere Nasendurchgängigkeit und einen besseren mukoziliären Transport, weist aber auf die geringe Qualität und Heterogenität der Studien hin (Fontana et al., 2025, Int J Biometeorol). Eine weitere systematische Übersicht zu Asthma und COPD findet verbesserte Lungenfunktion bei Asthma, aber gemischte Ergebnisse bei COPD, bei insgesamt wenigen hochwertigen randomisierten Studien (Calzetta et al., 2024, J Clin Med). Für Training im Wasser bei COPD gelten die Belege laut einer narrativen Übersicht als stark, für Schwefelinhalationen wird eine bessere mukoziliäre Clearance beschrieben (Khaltaev et al., 2020, J Thorac Dis). Eine ungarische Vorher-Nachher-Studie ohne Kontrollgruppe an 678 Patienten mit Asthma oder COPD verzeichnete nach einem dreiwöchigen Programm mit täglicher Atemtherapie im Freien einen Anstieg des mittleren FEV1-Werts von 71,0 auf 77,7 % des Sollwerts; der Einfluss des Klimas lässt sich darin nicht von Training und Betreuung trennen (Müller et al., 2018, Eur J Integr Med). Angeleitetes Gehen selbst ist bei COPD in einer multizentrischen randomisierten Studie mit 143 Patienten belegt: Es verbesserte nach 8 bis 10 Wochen Lebensqualität und Gehausdauer gegenüber üblicher Versorgung — allerdings in einem ambulanten Programm, nicht in einem Kuraufenthalt (Wootton et al., 2014, Eur Respir J). Keine der Studien zeigt eine Veränderung des Krankheitsverlaufs von Asthma oder COPD selbst.',
        },
        physicianNote: 'Ob und in welchem Umfang eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer Lungenfunktionsbefunde. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
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
        metaTitle: 'Spa treatment for respiratory conditions Marienbad | Marienbad.com',
        metaDescription:
          'Spa treatment for asthma, COPD and chronic respiratory disease in Marienbad: inhalation from the Forest Spring, breathing therapy, climate therapy — who and how long.',
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
          body: 'A systematic review of 27 studies on inhaling mineral waters describes better nasal patency and mucociliary transport, but points to the low quality and heterogeneity of the studies (Fontana et al., 2025, Int J Biometeorol). A further systematic review on asthma and COPD finds improved lung function in asthma but mixed results in COPD, with overall few high-quality randomised trials (Calzetta et al., 2024, J Clin Med). For exercise in water in COPD, a narrative review describes the evidence as strong, and for sulphur inhalations it describes better mucociliary clearance (Khaltaev et al., 2020, J Thorac Dis). A Hungarian before-after study without a control group in 678 patients with asthma or COPD recorded, after a three-week programme with daily outdoor breathing therapy, a rise in mean FEV1 from 71.0% to 77.7% of predicted; the influence of the climate cannot be separated from training and supervision in it (Müller et al., 2018, Eur J Integr Med). Guided walking itself is documented in COPD by a multicentre randomised trial of 143 patients: it improved quality of life and walking endurance after 8 to 10 weeks compared with usual care — but in an outpatient programme, not a spa stay (Wootton et al., 2014, Eur Respir J). None of the studies shows a change in the course of asthma or COPD itself.',
        },
        physicianNote: 'Whether and to what extent a spa cure is right for you is decided by the spa physician at the initial examination, based on your lung function findings. This page provides information and does not replace medical advice.',
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
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
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
      cs: 'Kurgast trinkt bei Tageslicht Mineralwasser aus einem Trinkbecher an der Quelle',
      ru: 'Kurgast trinkt bei Tageslicht Mineralwasser aus einem Trinkbecher an der Quelle',
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
          body: 'Eine Übersicht über 49 systematische Reviews zur Kurmedizin bezeichnet die Evidenz für Trink- und Inhalationskuren insgesamt als „begrenzt, wenn auch interessant" — deutlich schwächer belegt als beim Bewegungsapparat (Antonelli et al., 2021, Int J Biometeorol). Für sulfat- und magnesiumreiches Mineralwasser bei funktioneller Verstopfung liegt eine doppelblinde randomisierte Studie mit 226 Teilnehmern vor: Nach 14 Tagen sprachen 50 % auf die Behandlung an gegenüber 29 % unter Kontrollwasser; es handelte sich um ein französisches Wasser anderer Zusammensetzung (Dupont et al., 2019, Nutrition). Eine placebokontrollierte Studie mit 106 Teilnehmern fand nach sechs Wochen mit einem halben Liter Sulfatwasser täglich mehr spontane Stuhlgänge und eine bessere Konsistenz, bei nur grenzwertig signifikantem primärem Endpunkt (Bothe et al., 2015, Eur J Nutr). Eine britische diätetische Leitlinie von 2025 nennt Wasser mit höherem Mineralgehalt deshalb als eine Option bei chronischer Verstopfung, mit niedriger bis mittlerer Evidenzsicherheit (Dimidi et al., 2025, J Hum Nutr Diet). Zur Gallenblase ist die Datenlage spärlicher: In einer kontrollierten Studie mit 40 Teilnehmern verkleinerte sich nach zwölf Tagen Trinken eines Sulfat-Hydrogencarbonat-Wassers das Nüchternvolumen der Gallenblase, bei häufigerem Stuhlgang; es war ein italienisches Wasser anderer Zusammensetzung und eine kleine Stichprobe (Corradini et al., 2012, World J Gastroenterol). Zu Crohnscher Krankheit, Colitis ulcerosa und chronischer Pankreatitis liegen keine vergleichbaren kontrollierten Studien zur Trinkkur vor; die Behandlung stützt sich hier auf die Erfahrung der Kurmedizin und die engmaschige ärztliche Begleitung.',
        },
        physicianNote: 'Ob und in welcher Form eine Kur für Sie infrage kommt, entscheidet der Kurarzt bei der Eingangsuntersuchung anhand Ihrer gastroenterologischen Befunde. Diese Seite informiert und ersetzt keine ärztliche Beratung.',
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
          'Spa treatment for digestive conditions in Marienbad: the drinking cure from the Cross Spring, a diet programme and the indication list — what is treated and duration.',
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
          body: 'A review of 49 systematic reviews on spa medicine describes the evidence for drinking and inhalation cures overall as "limited, though interesting" — markedly weaker than for the musculoskeletal system (Antonelli et al., 2021, Int J Biometeorol). For sulphate- and magnesium-rich mineral water in functional constipation, there is a double-blind randomised trial of 226 participants: after 14 days, 50% responded to treatment compared with 29% under control water; this was a French water of different composition (Dupont et al., 2019, Nutrition). A placebo-controlled trial of 106 participants found, after six weeks of half a litre of sulphate water daily, more spontaneous bowel movements and better consistency, with the primary endpoint only marginally significant (Bothe et al., 2015, Eur J Nutr). A 2025 British dietetic guideline therefore names water with a higher mineral content as one option for chronic constipation, with low to moderate certainty of evidence (Dimidi et al., 2025, J Hum Nutr Diet). Data on the gallbladder are sparser: in a controlled study of 40 participants, the fasting volume of the gallbladder shrank after twelve days of drinking a sulphate-bicarbonate water, alongside more frequent bowel movements; this was an Italian water of different composition and a small sample (Corradini et al., 2012, World J Gastroenterol). For Crohn’s disease, ulcerative colitis and chronic pancreatitis there are no comparable controlled studies of the drinking cure; treatment here rests on the experience of spa medicine and close medical supervision.',
        },
        physicianNote: 'Whether and in what form a spa cure is right for you is decided by the spa physician at the initial examination, based on your gastroenterological findings. This page provides information and does not replace medical advice.',
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
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
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
      cs: 'Ernährungsberaterin bespricht am Schreibtisch einen individuellen Speiseplan mit einer Kurgästin',
      ru: 'Ernährungsberaterin bespricht am Schreibtisch einen individuellen Speiseplan mit einer Kurgästin',
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
      en: {} as unknown as DiagnosisContent,
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
    },
  },
]
