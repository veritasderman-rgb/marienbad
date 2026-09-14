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
      en: {} as unknown as DiagnosisContent,
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
      en: {} as unknown as DiagnosisContent,
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
      en: {} as unknown as DiagnosisContent,
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
      en: {} as unknown as DiagnosisContent,
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
      en: 'Therapeutin legt eine warme Moorpackung auf den Rücken eines Kurgastes',
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
      en: {} as unknown as DiagnosisContent,
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
      en: 'Nahaufnahme einer Hand, die die Wasseroberfläche eines Mineralbads berührt',
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
      en: {} as unknown as DiagnosisContent,
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
      en: 'Kurgast füllt einen Trinkkurbecher bei Tageslicht an einer Mineralquelle',
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
      en: {} as unknown as DiagnosisContent,
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
      en: 'Älterer Mann trinkt Mineralwasser aus einem Trinkkurbecher während der Trinkkur',
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
      en: {} as unknown as DiagnosisContent,
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
      en: 'Therapeutin führt eine manuelle Lymphdrainage an den Beinen einer Gästin durch',
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
      en: {} as unknown as DiagnosisContent,
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
      en: 'Gast erhält im Profil eine Sauerstofftherapie über eine Atemmaske',
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
      en: {} as unknown as DiagnosisContent,
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
      en: 'Kurgast trinkt bei Tageslicht Mineralwasser aus einem Trinkbecher an der Quelle',
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
      en: {} as unknown as DiagnosisContent,
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
      en: 'Ernährungsberaterin bespricht am Schreibtisch einen individuellen Speiseplan mit einer Kurgästin',
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
