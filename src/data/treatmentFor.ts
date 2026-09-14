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
        metaTitle: 'Kur bei Arthrose in Marienbad — Anwendungen, Dauer, Wirkung | Marienbad.com',
        metaDescription:
          'Arthrose in Knie, Hüfte und Händen: welche Anwendungen die Marienbader Kur einsetzt, wie lange ein Aufenthalt dauert, was Studien zeigen und wann eine Kur nicht infrage kommt.',
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
      en: {} as unknown as DiagnosisContent,
      cs: {} as unknown as DiagnosisContent,
      ru: {} as unknown as DiagnosisContent,
    },
  },
]
