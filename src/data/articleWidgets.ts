import type { Locale } from '@/i18n/config'
import type { SpringIndication, SpringLocation } from '@/data/springs'

/**
 * Texty tří redakčních vsuvek pro články magazínu, které se vkládají Markdoc
 * tagy {% cure-path %}, {% spring-cards %} a {% indication-picker %}
 * (schéma v src/markdoc/config.ts, HTML v MarkdocRenderer.astro).
 *
 * Jazyk si tagy berou z frontmatteru článku (Markdoc proměnná `locale`),
 * redaktor ho tedy nikde nevyplňuje. Data pramenů a indikací nejsou tady —
 * čtou se ze springs.ts a indications.ts, aby existovala jen jednou.
 *
 * Zásada u pitné kúry (viz článek o trávicím ústrojí): žádný fixní objem,
 * žádný počet pohárků za den. Diagram popisuje postup, ne dávku.
 */

export interface CurePathStep {
  icon: 'spring' | 'temperature' | 'interval' | 'walk'
  label: string
  text: string
}

export interface CurePathContent {
  caption: string
  title: string
  steps: CurePathStep[]
  note: string
}

export const curePath: Record<Locale, CurePathContent> = {
  cs: {
    caption: 'Jak vypadá jeden pohárek pitné kúry',
    title: 'Cesta pohárku',
    steps: [
      {
        icon: 'spring',
        label: 'Pramen',
        text: 'Pohárek se plní přímo u výtoku. Který pramen a v jakém pořadí, určuje lékařský předpis.',
      },
      {
        icon: 'temperature',
        label: 'Teplota',
        text: 'Voda vyvěrá studená, 7 až 10 °C po celý rok. Jestli se pije tak, jak teče, nebo temperovaná, je součást předpisu.',
      },
      {
        icon: 'interval',
        label: 'Odstup před jídlem',
        text: 'Pije se nalačno, v předepsaném odstupu před jídlem, pomalu a po malých doušcích.',
      },
      {
        icon: 'walk',
        label: 'Chůze',
        text: 'Mezi doušky se jde, ne sedí. Pomalá procházka po kolonádě je součást procedury, ne přestávka.',
      },
    ],
    note: 'Objem, počet pohárků za den i výběr pramene stanoví lázeňský lékař po vstupní prohlídce. Paušální dávka neexistuje.',
  },
  de: {
    caption: 'So sieht ein Becher Trinkkur aus',
    title: 'Der Weg des Bechers',
    steps: [
      {
        icon: 'spring',
        label: 'Quelle',
        text: 'Der Becher wird direkt am Auslauf gefüllt. Welche Quelle und in welcher Reihenfolge, legt die ärztliche Verordnung fest.',
      },
      {
        icon: 'temperature',
        label: 'Temperatur',
        text: 'Das Wasser tritt das ganze Jahr über kalt aus, 7 bis 10 °C. Ob es so getrunken wird, wie es fließt, oder temperiert, ist Teil der Verordnung.',
      },
      {
        icon: 'interval',
        label: 'Abstand zur Mahlzeit',
        text: 'Getrunken wird nüchtern, im verordneten Abstand vor dem Essen, langsam und in kleinen Schlucken.',
      },
      {
        icon: 'walk',
        label: 'Gehen',
        text: 'Zwischen den Schlucken wird gegangen, nicht gesessen. Der langsame Spaziergang über die Kolonnade ist Teil der Anwendung, keine Pause.',
      },
    ],
    note: 'Menge, Zahl der Becher pro Tag und Wahl der Quelle legt der Kurarzt nach der Eingangsuntersuchung fest. Eine pauschale Dosis gibt es nicht.',
  },
  en: {
    caption: 'What one cup of the drinking cure looks like',
    title: 'The journey of a cup',
    steps: [
      {
        icon: 'spring',
        label: 'Spring',
        text: 'The cup is filled straight from the outlet. Which spring, and in what order, is set by the medical prescription.',
      },
      {
        icon: 'temperature',
        label: 'Temperature',
        text: 'The water emerges cold all year round, 7 to 10 °C. Whether it is drunk as it flows or gently warmed is part of the prescription.',
      },
      {
        icon: 'interval',
        label: 'Interval before meals',
        text: 'It is drunk on an empty stomach, at the prescribed interval before a meal, slowly and in small sips.',
      },
      {
        icon: 'walk',
        label: 'Walking',
        text: 'Between sips you walk rather than sit. A slow stroll along the colonnade is part of the procedure, not a break.',
      },
    ],
    note: 'Volume, number of cups per day and choice of spring are set by the spa physician after the initial examination. There is no standard dose.',
  },
  ru: {
    caption: 'Как выглядит один стаканчик питьевого курса',
    title: 'Путь стаканчика',
    steps: [
      {
        icon: 'spring',
        label: 'Источник',
        text: 'Стаканчик наполняют прямо у бювета. Какой источник и в каком порядке — определяет врачебное назначение.',
      },
      {
        icon: 'temperature',
        label: 'Температура',
        text: 'Вода выходит холодной круглый год, 7–10 °C. Пить её как есть или подогретой — часть назначения.',
      },
      {
        icon: 'interval',
        label: 'Интервал до еды',
        text: 'Пьют натощак, в предписанном интервале до еды, медленно и маленькими глотками.',
      },
      {
        icon: 'walk',
        label: 'Ходьба',
        text: 'Между глотками ходят, а не сидят. Медленная прогулка по колоннаде — часть процедуры, а не перерыв.',
      },
    ],
    note: 'Объём, число стаканчиков в день и выбор источника определяет курортный врач после первичного осмотра. Стандартной дозы не существует.',
  },
}

export interface SpringCardsContent {
  /** Výchozí titulek, když tag nemá `title`; {indication} se nahradí štítkem níže. */
  titleTemplate: string
  indicationLabels: Record<SpringIndication, string>
  locationLabels: Record<SpringLocation, string>
  detailLink: string
  overviewLink: string
  note: string
}

export const springCards: Record<Locale, SpringCardsContent> = {
  cs: {
    titleTemplate: 'Prameny pro {indication}',
    indicationLabels: {
      digestion: 'trávení',
      metabolism: 'metabolismus',
      kidneys: 'ledviny a močové cesty',
      respiratory: 'dýchací cesty',
      blood: 'krvetvorbu',
      bones: 'kosti a klouby',
      heart: 'srdce a cévy',
    },
    locationLabels: { colonnade: 'kolonáda', town: 've městě', forest: 'v lesích' },
    detailLink: 'Detail pramene',
    overviewLink: 'Přehled všech pramenů',
    note: 'Který pramen a kolik, určí lázeňský lékař.',
  },
  de: {
    titleTemplate: 'Quellen bei {indication}',
    indicationLabels: {
      digestion: 'Verdauungsbeschwerden',
      metabolism: 'Stoffwechselerkrankungen',
      kidneys: 'Nieren- und Harnwegserkrankungen',
      respiratory: 'Atemwegserkrankungen',
      blood: 'Blutbildungsstörungen',
      bones: 'Erkrankungen von Knochen und Gelenken',
      heart: 'Herz- und Gefäßerkrankungen',
    },
    locationLabels: { colonnade: 'Kolonnade', town: 'in der Stadt', forest: 'im Wald' },
    detailLink: 'Zur Quelle',
    overviewLink: 'Alle Quellen im Überblick',
    note: 'Welche Quelle und wie viel, bestimmt der Kurarzt.',
  },
  en: {
    titleTemplate: 'Springs for {indication}',
    indicationLabels: {
      digestion: 'digestive complaints',
      metabolism: 'metabolic disorders',
      kidneys: 'kidney and urinary tract disorders',
      respiratory: 'respiratory complaints',
      blood: 'blood formation disorders',
      bones: 'bone and joint conditions',
      heart: 'heart and circulatory conditions',
    },
    locationLabels: { colonnade: 'colonnade', town: 'in town', forest: 'in the forest' },
    detailLink: 'About this spring',
    overviewLink: 'All springs at a glance',
    note: 'Which spring and how much is for the spa physician to decide.',
  },
  ru: {
    titleTemplate: 'Источники при {indication}',
    indicationLabels: {
      digestion: 'заболеваниях пищеварения',
      metabolism: 'нарушениях обмена веществ',
      kidneys: 'заболеваниях почек и мочевыводящих путей',
      respiratory: 'заболеваниях дыхательных путей',
      blood: 'нарушениях кроветворения',
      bones: 'заболеваниях костей и суставов',
      heart: 'заболеваниях сердца и сосудов',
    },
    locationLabels: { colonnade: 'колоннада', town: 'в городе', forest: 'в лесу' },
    detailLink: 'Об источнике',
    overviewLink: 'Обзор всех источников',
    note: 'Какой источник и сколько — решает курортный врач.',
  },
}

export interface IndicationPickerContent {
  title: string
  selectLabel: string
  placeholder: string
  basicStay: string
  repeatStay: string
  legend: string
  note: string
  fullListLink: string
}

export const indicationPicker: Record<Locale, IndicationPickerContent> = {
  cs: {
    title: 'Najděte svou diagnózu v indikačním seznamu',
    selectLabel: 'Diagnóza',
    placeholder: 'Zobrazit všechny položky skupiny',
    basicStay: 'Základní pobyt',
    repeatStay: 'Opakovaný pobyt',
    legend:
      'K = komplexní péče (pojišťovna hradí léčení, ubytování i stravu), P = příspěvková péče (pojišťovna hradí jen léčení). Číslo udává počet dní.',
    note: 'Nárok posuzuje váš ošetřující lékař a pojišťovna na základě návrhu na lázeňskou péči, ne lázně.',
    fullListLink: 'Celý indikační seznam a kontraindikace',
  },
  de: {
    title: 'Diagnosen dieser Indikationsgruppe',
    selectLabel: 'Diagnose',
    placeholder: 'Alle Positionen anzeigen',
    basicStay: 'Grundaufenthalt',
    repeatStay: 'Wiederholungsaufenthalt',
    legend: '',
    note: 'Ob eine Kur infrage kommt, klärt Ihr Arzt; die Kostenfrage läuft über Krankenkasse, Beihilfe oder als Selbstzahler.',
    fullListLink: 'Vollständige Indikationsliste und Kontraindikationen',
  },
  en: {
    title: 'Diagnoses in this indication group',
    selectLabel: 'Diagnosis',
    placeholder: 'Show all items',
    basicStay: 'Basic stay',
    repeatStay: 'Repeat stay',
    legend: '',
    note: 'Whether a stay is appropriate is for your doctor to judge; most international guests arrange the stay privately.',
    fullListLink: 'Full list of indications and contraindications',
  },
  ru: {
    title: 'Диагнозы этой группы показаний',
    selectLabel: 'Диагноз',
    placeholder: 'Показать все позиции',
    basicStay: 'Базовый курс',
    repeatStay: 'Повторный курс',
    legend: '',
    note: 'Подходит ли лечение, решает ваш лечащий врач; большинство иностранных гостей приезжают по частной путёвке.',
    fullListLink: 'Полный перечень показаний и противопоказаний',
  },
}
