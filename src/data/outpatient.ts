import type { Locale } from '@/i18n/config'
import { routes, locales } from '@/i18n/config'
import { SPA_EMAIL } from '@/data/romanBaths'

/**
 * Ambulantní léčení — procedury pro hosty, kteří u nás nebydlí.
 * Stránky /cs/ambulantni-lecba, /de/ambulante-behandlung,
 * /en/outpatient-treatment, /ru/ambulatornoe-lechenie.
 *
 * Záměrně BEZ cen: ceník se mění a na webu by zastaral. Uvádí se jen seznam
 * procedur, aktuální ceník je na vyžádání na spa recepci.
 *
 * Provozní doba spa recepce v pasportech 2026 není, takže se zde neuvádí —
 * až ji budeme mít, doplní se do `receptionHours` a zobrazí se v kroku 1.
 */

export { SPA_EMAIL }

export const outpatientUrls = Object.fromEntries(
  locales.map((l) => [l, `/${l}/${routes.outpatient[l]}`]),
) as Record<Locale, string>

export interface Step {
  title: string
  text: string
}
export interface ProcedureGroup {
  title: string
  items: string[]
}
export interface OutpatientUI {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  h1: string
  heroLead: string

  stepsHeading: string
  stepsLead: string
  steps: Step[]
  /** Doplní se, až budeme mít potvrzenou provozní dobu spa recepce. */
  receptionHours?: string
  receptionHoursLabel: string

  bringHeading: string
  bringLead: string
  bringItems: string[]

  proceduresHeading: string
  proceduresLead: string
  groups: ProcedureGroup[]
  doctorOnlyHeading: string
  doctorOnlyText: string

  priceHeading: string
  priceText: string
  priceCta: string

  cautionHeading: string
  cautionText: string
  cautionCta: string

  romanHeading: string
  romanText: string
  romanCta: string
}

export const ui: Record<Locale, OutpatientUI> = {
  cs: {
    metaTitle: 'Ambulantní léčení v Mariánských Lázních — procedury bez pobytu | Ensana',
    metaDescription:
      'Lázeňské procedury i pro hosty, kteří u nás nebydlí. Objednání k lékaři přes spa recepci, přehled procedur, co si vzít s sebou. Aktuální ceník na vyžádání.',
    eyebrow: 'Ensana Mariánské Lázně',
    h1: 'Ambulantní léčení',
    heroLead:
      'Na lázeňskou proceduru nemusíte být ubytovaní. Vybrané koupele, zábaly, masáže i fyzikální terapii nabízíme ambulantně — vždy až po vstupní konzultaci s lázeňským lékařem, který posoudí, co je pro vás vhodné.',

    stepsHeading: 'Jak se objednat',
    stepsLead: 'Tři kroky, první z nich vyřídíte e-mailem nebo osobně na spa recepci.',
    steps: [
      {
        title: 'Objednejte se k lékaři přes spa recepci',
        text: 'Termín vstupní konzultace domluvíte na spa recepci — osobně nebo e-mailem. Napište prosím, o jaké procedury máte zájem a ve kterých dnech se vám to hodí.',
      },
      {
        title: 'Vstupní lékařská konzultace',
        text: 'Lázeňský lékař posoudí váš zdravotní stav, vyloučí kontraindikace a sestaví plán procedur na míru. Bez této konzultace proceduru neposkytujeme — je to podmínka bezpečné lázeňské léčby, ne formalita.',
      },
      {
        title: 'Absolvujte procedury',
        text: 'Podle domluveného harmonogramu docházíte na jednotlivé procedury do lázeňského oddělení. Rozvrh se sestavuje podle volné kapacity provozu.',
      },
    ],
    receptionHoursLabel: 'Provozní doba spa recepce',

    bringHeading: 'Co si vzít s sebou',
    bringLead: 'Na vstupní konzultaci i na samotné procedury.',
    bringItems: [
      'Doklad totožnosti',
      'Lékařské zprávy a výpis ze zdravotní dokumentace, pokud je máte',
      'Seznam pravidelně užívaných léků',
      'Plavky a přezůvky k vodním procedurám',
      'Ručník nebo župan',
    ],

    proceduresHeading: 'Přehled procedur',
    proceduresLead:
      'Konkrétní skladbu procedur vždy určuje lékař podle vaší diagnózy. Ne všechny procedury jsou dostupné ve všech hotelech resortu.',
    groups: [
      {
        title: 'Koupele a vodoléčba',
        items: [
          'Minerální koupele s přírodní pramenitou vodou',
          'CO₂ koupele (uhličité koupele)',
          'Suchá plynová koupel CO₂',
          'Plynové injekce (pneumopunktura)',
          'Podvodní masáže',
        ],
      },
      {
        title: 'Peloidy a zábaly',
        items: ['Rašelinové zábaly a přírodní slatinné obklady', 'Parafínové zábaly na klouby'],
      },
      {
        title: 'Masáže',
        items: ['Klasické masáže', 'Lymfodrenáž'],
      },
      {
        title: 'Fyzikální terapie',
        items: ['Elektroléčba', 'Magnetoterapie', 'Kryoterapie', 'Oxygenoterapie'],
      },
      {
        title: 'Dýchací cesty a pitná kúra',
        items: ['Inhalační terapie', 'Pitná kúra s lékařskou konzultací'],
      },
      {
        title: 'Pohyb a rehabilitace',
        items: ['Fyzioterapie a léčebný tělocvik'],
      },
    ],

    doctorOnlyHeading: 'Procedury pouze s lékařem',
    doctorOnlyText:
      'Část procedur je vázaná na lékaře a bez jeho indikace a dohledu je poskytnout nelze — patří mezi ně například plynové injekce (pneumopunktura) nebo slatinný zábal. Není to formalita: jde o zákroky, u kterých lékař posuzuje zdravotní stav a možná rizika. Přesné informace, které procedury to jsou a za jakých podmínek je lze absolvovat, vám poskytne spa recepce.',

    priceHeading: 'Ceník',
    priceText:
      'Aktuální ceník ambulantních procedur poskytneme na vyžádání — na webu ho záměrně neuvádíme, aby vám neukázal zastaralé ceny. Napište si o něj na spa recepci.',
    priceCta: 'Vyžádat ceník',

    cautionHeading: 'Kontraindikace',
    cautionText:
      'Lázeňská léčba není vhodná pro každého. Přehled indikací i stavů, u kterých léčbu poskytnout nelze, najdete na samostatné stránce; konečné slovo má vždy lékař při vstupní konzultaci.',
    cautionCta: 'Indikace a kontraindikace',

    romanHeading: 'Římské lázně',
    romanText:
      'Historický sál z roku 1896 je součástí hotelu Nové Lázně. Návštěva zvenčí je možná jen po předchozí rezervaci a podle volné kapacity.',
    romanCta: 'Více o Římských lázních',
  },

  de: {
    metaTitle: 'Ambulante Behandlung in Marienbad — Anwendungen ohne Aufenthalt | Ensana',
    metaDescription:
      'Kuranwendungen auch für Gäste, die nicht bei uns wohnen. Terminvereinbarung beim Arzt über die Spa-Rezeption, Überblick der Anwendungen, was mitzubringen ist. Aktuelle Preisliste auf Anfrage.',
    eyebrow: 'Ensana Marienbad',
    h1: 'Ambulante Behandlung',
    heroLead:
      'Für eine Kuranwendung müssen Sie nicht bei uns übernachten. Ausgewählte Bäder, Packungen, Massagen und physikalische Therapie bieten wir ambulant an — stets nach einer Erstkonsultation beim Kurarzt, der beurteilt, was für Sie geeignet ist.',

    stepsHeading: 'So vereinbaren Sie einen Termin',
    stepsLead: 'Drei Schritte; den ersten erledigen Sie per E-Mail oder persönlich an der Spa-Rezeption.',
    steps: [
      {
        title: 'Termin beim Arzt über die Spa-Rezeption',
        text: 'Den Termin für die Erstkonsultation vereinbaren Sie an der Spa-Rezeption — persönlich oder per E-Mail. Schreiben Sie uns bitte, welche Anwendungen Sie interessieren und welche Tage Ihnen passen.',
      },
      {
        title: 'Ärztliche Erstkonsultation',
        text: 'Der Kurarzt beurteilt Ihren Gesundheitszustand, schließt Kontraindikationen aus und stellt einen individuellen Anwendungsplan zusammen. Ohne diese Konsultation führen wir keine Anwendung durch — das ist Voraussetzung einer sicheren Kurbehandlung, keine Formalität.',
      },
      {
        title: 'Anwendungen wahrnehmen',
        text: 'Nach dem vereinbarten Zeitplan kommen Sie zu den einzelnen Anwendungen in die Kurabteilung. Der Plan richtet sich nach der freien Kapazität des Betriebs.',
      },
    ],
    receptionHoursLabel: 'Öffnungszeiten der Spa-Rezeption',

    bringHeading: 'Was Sie mitbringen sollten',
    bringLead: 'Zur Erstkonsultation und zu den Anwendungen selbst.',
    bringItems: [
      'Ausweisdokument',
      'Arztberichte und Auszug aus der Krankenakte, sofern vorhanden',
      'Liste der regelmäßig eingenommenen Medikamente',
      'Badebekleidung und Hausschuhe für die Wasseranwendungen',
      'Handtuch oder Bademantel',
    ],

    proceduresHeading: 'Überblick der Anwendungen',
    proceduresLead:
      'Die konkrete Zusammenstellung legt immer der Arzt anhand Ihrer Diagnose fest. Nicht alle Anwendungen sind in allen Hotels des Resorts verfügbar.',
    groups: [
      {
        title: 'Bäder und Hydrotherapie',
        items: [
          'Mineralbäder mit natürlichem Quellwasser',
          'CO₂-Bäder (Kohlensäurebäder)',
          'Trockenes CO₂-Gasbad',
          'Gasinjektionen (Pneumopunktur)',
          'Unterwassermassagen',
        ],
      },
      {
        title: 'Peloide und Packungen',
        items: ['Moorpackungen und Naturmoorumschläge', 'Paraffinwickel für Gelenke'],
      },
      {
        title: 'Massagen',
        items: ['Klassische Massagen', 'Lymphdrainage'],
      },
      {
        title: 'Physikalische Therapie',
        items: ['Elektrotherapie', 'Magnetfeldtherapie', 'Kryotherapie', 'Sauerstofftherapie'],
      },
      {
        title: 'Atemwege und Trinkkur',
        items: ['Inhalationstherapie', 'Trinkkur mit ärztlicher Beratung'],
      },
      {
        title: 'Bewegung und Rehabilitation',
        items: ['Physiotherapie und Bewegungstherapie'],
      },
    ],

    doctorOnlyHeading: 'Anwendungen nur mit ärztlicher Indikation',
    doctorOnlyText:
      'Ein Teil der Anwendungen ist an den Arzt gebunden und kann ohne seine Indikation und Aufsicht nicht durchgeführt werden — dazu gehören etwa Gasinjektionen (Pneumopunktur) oder der Moorumschlag. Das ist keine Formalität: Bei diesen Eingriffen beurteilt der Arzt Ihren Gesundheitszustand und mögliche Risiken. Welche Anwendungen das genau sind und unter welchen Bedingungen sie möglich sind, erfahren Sie an der Spa-Rezeption.',

    priceHeading: 'Preisliste',
    priceText:
      'Die aktuelle Preisliste der ambulanten Anwendungen senden wir Ihnen auf Anfrage — auf der Website führen wir sie bewusst nicht auf, damit Sie keine veralteten Preise sehen. Fordern Sie sie an der Spa-Rezeption an.',
    priceCta: 'Preisliste anfordern',

    cautionHeading: 'Kontraindikationen',
    cautionText:
      'Eine Kurbehandlung ist nicht für jeden geeignet. Den Überblick über Indikationen und über Zustände, bei denen eine Behandlung nicht möglich ist, finden Sie auf einer eigenen Seite; das letzte Wort hat immer der Arzt bei der Erstkonsultation.',
    cautionCta: 'Indikationen und Kontraindikationen',

    romanHeading: 'Römisches Bad',
    romanText:
      'Der historische Saal von 1896 gehört zum Hotel Nové Lázně. Ein Besuch von außerhalb ist nur nach vorheriger Reservierung und nach freier Kapazität möglich.',
    romanCta: 'Mehr über das Römische Bad',
  },

  en: {
    metaTitle: 'Outpatient treatment in Marienbad — spa treatments without a stay | Ensana',
    metaDescription:
      'Spa treatments for visitors not staying with us. Doctor’s appointment through the spa reception, overview of treatments, what to bring. Current price list on request.',
    eyebrow: 'Ensana Marienbad',
    h1: 'Outpatient treatment',
    heroLead:
      'You do not have to be a hotel guest to receive a spa treatment. Selected baths, wraps, massages and physical therapy are available on an outpatient basis — always after an initial consultation with a spa physician who assesses what is suitable for you.',

    stepsHeading: 'How to book',
    stepsLead: 'Three steps; the first one you handle by e-mail or in person at the spa reception.',
    steps: [
      {
        title: 'Book a doctor’s appointment through the spa reception',
        text: 'Arrange the initial consultation at the spa reception — in person or by e-mail. Please tell us which treatments you are interested in and which days suit you.',
      },
      {
        title: 'Initial medical consultation',
        text: 'The spa physician assesses your health, rules out contraindications and puts together a treatment plan tailored to you. We do not provide treatments without this consultation — it is a condition of safe spa therapy, not a formality.',
      },
      {
        title: 'Attend the treatments',
        text: 'You come to the spa department for the individual treatments according to the agreed schedule, which is set around the available capacity of the department.',
      },
    ],
    receptionHoursLabel: 'Spa reception opening hours',

    bringHeading: 'What to bring',
    bringLead: 'For the initial consultation and for the treatments themselves.',
    bringItems: [
      'Identity document',
      'Medical reports and an extract from your medical records, if you have them',
      'A list of medication you take regularly',
      'Swimwear and slippers for the water treatments',
      'A towel or bathrobe',
    ],

    proceduresHeading: 'Overview of treatments',
    proceduresLead:
      'The exact combination is always determined by the physician based on your diagnosis. Not all treatments are available in every hotel of the resort.',
    groups: [
      {
        title: 'Baths and hydrotherapy',
        items: [
          'Mineral baths with natural spring water',
          'CO₂ baths (carbon dioxide baths)',
          'Dry CO₂ gas bath',
          'Gas injections (pneumopuncture)',
          'Underwater massages',
        ],
      },
      {
        title: 'Peloids and wraps',
        items: ['Peat wraps and natural peat compresses', 'Paraffin wraps for joints'],
      },
      {
        title: 'Massages',
        items: ['Classic massages', 'Lymphatic drainage'],
      },
      {
        title: 'Physical therapy',
        items: ['Electrotherapy', 'Magnetic field therapy', 'Cryotherapy', 'Oxygen therapy'],
      },
      {
        title: 'Respiratory care and drinking cure',
        items: ['Inhalation therapy', 'Drinking cure with medical consultation'],
      },
      {
        title: 'Movement and rehabilitation',
        items: ['Physiotherapy and exercise therapy'],
      },
    ],

    doctorOnlyHeading: 'Treatments available only with a physician',
    doctorOnlyText:
      'Some treatments are tied to a physician and cannot be provided without their indication and supervision — gas injections (pneumopuncture) or the peat compress, for example. This is not a formality: these are procedures where the physician assesses your health and the possible risks. The spa reception will tell you exactly which treatments these are and under what conditions they can be given.',

    priceHeading: 'Price list',
    priceText:
      'We provide the current outpatient price list on request — we deliberately do not publish it here so that it never shows you outdated prices. Ask for it at the spa reception.',
    priceCta: 'Request the price list',

    cautionHeading: 'Contraindications',
    cautionText:
      'Spa therapy is not suitable for everyone. An overview of indications and of the conditions where treatment cannot be provided is on a separate page; the final word always rests with the physician at the initial consultation.',
    cautionCta: 'Indications and contraindications',

    romanHeading: 'The Roman Baths',
    romanText:
      'The historical hall of 1896 is part of the Nové Lázně hotel. A visit from outside is possible only by prior reservation and subject to available capacity.',
    romanCta: 'More about the Roman Baths',
  },

  ru: {
    metaTitle: 'Амбулаторное лечение в Марианских Лазнях — процедуры без проживания | Ensana',
    metaDescription:
      'Курортные процедуры и для гостей, которые не проживают у нас. Запись к врачу через спа-ресепшн, обзор процедур, что взять с собой. Актуальный прейскурант по запросу.',
    eyebrow: 'Ensana Марианские Лазне',
    h1: 'Амбулаторное лечение',
    heroLead:
      'Чтобы пройти курортную процедуру, не обязательно жить в отеле. Отдельные ванны, обёртывания, массажи и физиотерапию мы предлагаем амбулаторно — всегда после первичной консультации курортного врача, который оценит, что вам подходит.',

    stepsHeading: 'Как записаться',
    stepsLead: 'Три шага; первый вы решаете по электронной почте или лично на спа-ресепшн.',
    steps: [
      {
        title: 'Запишитесь к врачу через спа-ресепшн',
        text: 'Время первичной консультации согласуйте на спа-ресепшн — лично или по электронной почте. Напишите, пожалуйста, какие процедуры вас интересуют и какие дни вам удобны.',
      },
      {
        title: 'Первичная консультация врача',
        text: 'Курортный врач оценит состояние вашего здоровья, исключит противопоказания и составит индивидуальный план процедур. Без этой консультации процедуру мы не проводим — это условие безопасного курортного лечения, а не формальность.',
      },
      {
        title: 'Пройдите процедуры',
        text: 'По согласованному графику вы приходите на отдельные процедуры в курортное отделение. График составляется исходя из свободной загрузки отделения.',
      },
    ],
    receptionHoursLabel: 'Часы работы спа-ресепшн',

    bringHeading: 'Что взять с собой',
    bringLead: 'На первичную консультацию и на сами процедуры.',
    bringItems: [
      'Документ, удостоверяющий личность',
      'Медицинские заключения и выписку из медицинской карты, если они у вас есть',
      'Список регулярно принимаемых лекарств',
      'Купальные принадлежности и сменную обувь для водных процедур',
      'Полотенце или халат',
    ],

    proceduresHeading: 'Обзор процедур',
    proceduresLead:
      'Конкретный состав процедур всегда определяет врач по вашему диагнозу. Не все процедуры доступны во всех отелях курорта.',
    groups: [
      {
        title: 'Ванны и водолечение',
        items: [
          'Минеральные ванны с природной родниковой водой',
          'Углекислые ванны (CO₂)',
          'Сухая углекислая газовая ванна',
          'Газовые инъекции (пневмопунктура)',
          'Подводный массаж',
        ],
      },
      {
        title: 'Пелоиды и обёртывания',
        items: ['Торфяные обёртывания и природные грязевые компрессы', 'Парафиновые обёртывания для суставов'],
      },
      {
        title: 'Массажи',
        items: ['Классический массаж', 'Лимфодренаж'],
      },
      {
        title: 'Физиотерапия',
        items: ['Электролечение', 'Магнитотерапия', 'Криотерапия', 'Оксигенотерапия'],
      },
      {
        title: 'Дыхательные пути и питьевой курс',
        items: ['Ингаляционная терапия', 'Питьевой курс с консультацией врача'],
      },
      {
        title: 'Движение и реабилитация',
        items: ['Физиотерапия и лечебная гимнастика'],
      },
    ],

    doctorOnlyHeading: 'Процедуры только по назначению врача',
    doctorOnlyText:
      'Часть процедур привязана к врачу, и без его назначения и наблюдения их провести нельзя — к ним относятся, например, газовые инъекции (пневмопунктура) или грязевое обёртывание. Это не формальность: при таких процедурах врач оценивает состояние здоровья и возможные риски. Точную информацию о том, какие это процедуры и на каких условиях они возможны, вам даст спа-ресепшн.',

    priceHeading: 'Прейскурант',
    priceText:
      'Актуальный прейскурант амбулаторных процедур предоставим по запросу — на сайте мы его сознательно не публикуем, чтобы вы не увидели устаревшие цены. Запросите его на спа-ресепшн.',
    priceCta: 'Запросить прейскурант',

    cautionHeading: 'Противопоказания',
    cautionText:
      'Курортное лечение подходит не каждому. Обзор показаний и состояний, при которых лечение невозможно, есть на отдельной странице; последнее слово всегда за врачом на первичной консультации.',
    cautionCta: 'Показания и противопоказания',

    romanHeading: 'Римские бани',
    romanText:
      'Исторический зал 1896 года — часть отеля Nové Lázně. Посещение со стороны возможно только по предварительному бронированию и при наличии свободных мест.',
    romanCta: 'Подробнее о Римских банях',
  },
}
