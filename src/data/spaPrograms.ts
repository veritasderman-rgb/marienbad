import type { Locale } from '@/i18n/config'
import { routes } from '@/i18n/config'

/**
 * Skladba léčebných pobytů a nadstandardní programy Nových Lázní.
 *
 * Proč to existuje: dotaz „kolik procedur denně“ a „co je v ceně“ patří
 * k nejčastějším a web na něj neodpovídal. Odpověď je přitom pevná a
 * ověřitelná — počet procedur na noc je součástí definice pobytu.
 *
 * Zdrojem je léčebná brožura provozovatele a jeho veřejné stránky
 * s nabídkami. Ceny se sem záměrně nepíšou: mění se podle sezóny a hotelu
 * a patří na rezervační web, ne sem.
 */

export interface StayType {
  /** Jak pobyt pojmenovat pro čtenáře, ne nutně obchodní název balíčku. */
  name: string
  /** Nejkratší délka, např. „ab 7 Nächten“. */
  length: string
  /** Počet procedur na noc. */
  treatments: string
  /** Co pobyt obsahuje, položka po položce. */
  includes: string[]
  /** Komu se hodí. */
  forWhom: string
}

export interface SuperiorProgram {
  name: string
  forWhom: string
  body: string
}

/** Fotografie u sekce. Alt musí být v jazyce stránky, ne převzatý. */
export interface Figure {
  src: string
  alt: string
}

export interface ProgramSource {
  title: string
  url: string
  note?: string
}

export interface ProgramsContent {
  navLabel: string
  title: string
  h1: string
  metaTitle: string
  metaDescription: string
  lead: string
  /** Co má každý léčebný pobyt společné. */
  commonHeading: string
  commonBody: string
  staysHeading: string
  stays: StayType[]
  /** Fotografie ke třem sekcím, které se dají ukázat: pobyty, procedury, Nové Lázně. */
  images?: { stays?: Figure; menu?: Figure; superior?: Figure }
  /**
   * Poznamka pod nadpisem prehledu. Nese upresneni, ze nejkratsi delka
   * pobytu se lisi podle domu — cisla v kartach plati pro obvyklou nabidku.
   */
  staysNote?: string
  /** Kdo určuje počet a skladbu procedur. */
  decidesHeading: string
  decidesBody: string
  /** Z čeho se procedury vybírají. */
  menuHeading: string
  menuGroups: { name: string; items: string }[]
  labHeading: string
  labBody: string
  superiorHeading: string
  superiorLead: string
  superior: SuperiorProgram[]
  disclaimer: string
  faqs: { question: string; answer: string }[]
  sources: ProgramSource[]
  related: { label: string; href: string }[]
  reviewDate: string
}

export function programmesHref(locale: Locale): string {
  return `/${locale}/${routes['spa-programmes'][locale]}`
}

export function programmesAlternates(): Record<Locale, string> {
  return Object.fromEntries(
    (['de', 'en', 'cs', 'ru'] as Locale[]).map((l) => [l, programmesHref(l)]),
  ) as Record<Locale, string>
}

const LAZNEML = 'https://lazneml.cz/komplexni-lazenska-pece/'
const ENSANA_OFFERS = 'https://ensanahotels.com/cs/destinace/ceska-republika/marianske-lazne'

export const programmes: Partial<Record<Locale, ProgramsContent>> = {
  ru: {
    navLabel: 'Лечебные пакеты и программы',
    title: 'Лечебные пакеты в Марианских Лазнях: процедуры, срок, состав',
    h1: 'Какие есть лечебные пакеты и что в них входит',
    metaTitle: 'Лечебные пакеты в Марианских Лазнях — сколько процедур?',
    metaDescription: 'Сколько процедур в сутки, что входит в пакет и какие есть дополнительные программы — обзор лечебных пакетов в Марианских Лазнях.',
    lead: 'Различие между лечебными пакетами определяется прежде всего одной цифрой: сколько процедур за одну ночь размещения включено в стоимость. От этого зависит, идёт ли речь скорее об отдыхе или о лечении под руководством врача. Цены здесь намеренно не указаны — они зависят от отеля, категории номера и сезона и относятся к странице бронирования.',
    commonHeading: 'Что входит в любое лечебное пребывание',
    commonBody: 'В лечебное пребывание входят проживание с полупансионом, первичный и заключительный врачебный осмотр, письменное заключение, назначенные процедуры и питьевой курс у минеральных источников. Более короткое пребывание для отдыха возможно и без врачебного осмотра; тогда это не лечебное пребывание, а wellness-пребывание с отдельными процедурами.',
    images: {
      stays: { src: '/images/library/mineral-bath/co2-apparatus-tub.jpg', alt: 'Гость лежит в минеральной ванне в историческом зале, облицованном плиткой' },
      menu: { src: '/images/library/treatments/peat-wrap-back.jpg', alt: 'Торфяное обёртывание на верхней части спины лежащего гостя' },
      superior: { src: '/images/partners/roman-baths-hero.jpg', alt: 'Бассейн Римских бань в отеле Nové Lázně с мраморными колоннами и сводчатым потолком' },
    },
    staysHeading: 'Пакеты в сравнении',
    staysNote:
      'Указанные сроки относятся к обычному предложению мариансколазеньских домов. Минимальная продолжительность зависит от отеля и пакета: в отеле Ensana Butterfly лечебные пребывания начинаются уже от пяти ночей, а интенсивное лечебное пребывание — от шести. Актуальную границу для конкретного дома уточните у оператора.',
    stays: [
      {
        name: 'Короткое пребывание для отдыха',
        length: '2–6 ночей',
        treatments: '1 процедура за ночь',
        includes: [
          'Проживание с полупансионом, то есть завтраком и ужином',
          'Одна процедура за каждую ночь размещения, из фиксированного перечня',
          'Обычно без первичного врачебного осмотра, и тогда это не лечебное пребывание; в некоторых домах, например в отеле Butterfly, первичный осмотр входит в каждое пребывание',
        ],
        forWhom: 'Для длинных выходных или первого знакомства с курортом, без медицинской программы.',
      },
      {
        name: 'Интенсивное курортное пребывание',
        length: 'обычно от 7 ночей',
        treatments: '2 процедуры за ночь',
        includes: [
          'Проживание с полупансионом',
          'Первичный и заключительный врачебный осмотр с письменным заключением',
          'Базовое лабораторное обследование',
          'Питьевой курс по назначению врача',
        ],
        forWhom: 'Для гостей, которые хотят лечение под руководством врача, но с необременительной дневной программой.',
      },
      {
        name: 'Традиционное курортное пребывание',
        length: 'обычно от 7 ночей',
        treatments: '3 процедуры за ночь',
        includes: [
          'Проживание с полупансионом',
          'Первичный и заключительный врачебный осмотр с письменным заключением',
          'Базовое лабораторное обследование',
          'Питьевой курс по назначению врача',
          'Дежурная служба врача и медсестёр',
        ],
        forWhom: 'Классический формат лечения в Марианских Лазнях, привычный путь для большинства показаний.',
      },
      {
        name: 'Интенсивное лечебное пребывание',
        length: 'обычно от 7 ночей',
        treatments: '4 процедуры за ночь',
        includes: [
          'Проживание с полупансионом',
          'Первичный и заключительный врачебный осмотр с письменным заключением',
          'Базовое лабораторное обследование',
          'Питьевой курс по назначению врача',
          'Дежурная служба врача и медсестёр',
        ],
        forWhom: 'Для выраженных жалоб и для реабилитации после операций, когда программа должна быть плотной.',
      },
    ],
    decidesHeading: 'Кто определяет, какие процедуры вы получите',
    decidesBody: 'Пакет определяет, сколько процедур за ночь входит в программу — а какие именно это процедуры, решает исключительно курортный врач при первичном осмотре, на основании диагноза и вашего текущего состояния. Таким образом, вы не можете составить программу самостоятельно, и именно в этом отличие от wellness-пребывания. Если какая-то процедура вам не подходит, план меняют; в этом случае сообщите об этом своему курортному врачу.',
    menuHeading: 'Из чего выбирает врач',
    menuGroups: [
      {
        name: 'Процедуры на основе природных лечебных средств',
        items: 'Минеральные ванны, сухие газовые ванны в «газе Марии», газовые инъекции, торфяные обёртывания (до трёх в неделю), ингаляции, пребывание и движение на свежем воздухе.',
      },
      {
        name: 'Терапевтическая реабилитация',
        items: 'Индивидуальная или групповая лечебная физкультура, двигательная терапия в бассейне, физиотерапия.',
      },
      {
        name: 'Другие процедуры',
        items: 'Массаж (до трёх раз в неделю), лимфодренаж, электротерапия, магнитотерапия, лазер, криотерапия, ультразвук, парафиновые обёртывания, кислородная терапия, Lavatherm.',
      },
    ],
    labHeading: 'Что включает базовое лабораторное обследование',
    labBody: 'Биохимический анализ крови на глюкозу, холестерин и другие показатели жиров крови, показатели функции печени, функции почек и мочевую кислоту, а также анализ мочи. Оно входит в лечебные пребывания и служит курортному врачу основой для составления плана лечения.',
    superiorHeading: 'Программы в отеле Нове Лазне',
    superiorLead: 'Помимо лечебных пакетов, в отеле Нове Лазне действуют четыре программы, которые начинаются с подробной диагностики. Все они включают Medical Check-Up и строятся на его основе.',
    superior: [
      {
        name: 'Medical Check-Up',
        forWhom: 'Для гостей, которые сначала хотят узнать, в каком состоянии они находятся.',
        body: 'Диагностическая программа с комплексным обследованием текущего состояния здоровья. Её цель — выявить возможные риски и ранние признаки заболеваний. На основании лабораторных показателей, аппаратных исследований и консультации по питанию врачебная команда затем составляет индивидуальный план лечения.',
      },
      {
        name: 'De-Stress',
        forWhom: 'Для гостей, испытывающих длительную нагрузку.',
        body: 'Включает Medical Check-Up и дополняет его оценкой текущего уровня стресса и его влияния на здоровье. Затем врачебная команда составляет индивидуальный план процедур; к этому добавляется обучение тому, как распознавать факторы стресса и справляться с ними. Такая программа не заменяет психотерапию и психиатрическое лечение.',
      },
      {
        name: 'Healthy Aging',
        forWhom: 'Для гостей, для которых важно качество жизни в пожилом возрасте.',
        body: 'Включает Medical Check-Up, после которого следует индивидуально составленная программа с местными природными лечебными средствами. В центре внимания — привычки, которые можно продолжать дома, и устойчивое равновесие между работой и отдыхом.',
      },
      {
        name: 'Weight Loss',
        forWhom: 'Для гостей с избыточным весом, под врачебным наблюдением.',
        body: 'Включает Medical Check-Up и работает с пищевыми привычками и образом жизни. Основание для этого медицинское: избыточный вес и ожирение нагружают опорно-двигательный аппарат и относятся к факторам риска для сердца и системы кровообращения. Программу сопровождает врачебная команда, с принципами сбалансированного питания и большей физической активности в повседневной жизни.',
      },
    ],
    disclaimer: 'Какой пакет подходит вашему диагнозу и какие процедуры в нём целесообразны, решает курортный врач при первичном осмотре. Эта страница описывает структуру пребываний и не заменяет консультацию врача. Цены, наличие мест и актуальные названия пакетов вы найдёте у оператора.',
    faqs: [
      {
        question: 'Сколько процедур в день получают в Марианских Лазнях?',
        answer: 'Это зависит от забронированного пакета: короткое пребывание для отдыха включает одну процедуру за ночь размещения, интенсивное курортное пребывание — две, традиционное курортное пребывание — три, а интенсивное лечебное пребывание — четыре. Какие именно это процедуры, определяет курортный врач после первичного осмотра.',
      },
      {
        question: 'Что входит в лечебный пакет?',
        answer: 'В лечебное пребывание входят: проживание с полупансионом, первичный и заключительный врачебный осмотр, письменное заключение, базовое лабораторное обследование, назначенные процедуры и питьевой курс у минеральных источников. Начиная с традиционного пребывания добавляется дежурная служба врача и медсестёр. Проезд и курортный сбор гость оплачивает отдельно.',
      },
      {
        question: 'Какова минимальная продолжительность курортного пребывания?',
        answer: 'Минимальная продолжительность зависит от отеля и пакета. В обычном предложении мариансколазеньских домов лечебные пребывания начинаются от семи ночей, в отеле Ensana Butterfly — уже от пяти, а интенсивное лечебное пребывание от шести. У более длинной серии есть основание: профессиональным нижним порогом бальнеотерапии считаются не менее десяти процедур за не менее чем десять дней. Более короткие пребывания от двух ночей существуют как формат отдыха с одной процедурой за ночь.',
      },
      {
        question: 'Могу ли я сам выбирать процедуры?',
        answer: 'При лечебном пребывании — нет: количество и состав процедур определяет исключительно курортный врач после первичного осмотра, и именно это отличает лечение от wellness-пребывания. При коротком пребывании для отдыха вы, напротив, выбираете из фиксированного списка. Если назначенная процедура вам не подходит, сообщите об этом своему курортному врачу, чтобы план изменили.',
      },
      {
        question: 'В чём разница между лечением и wellness-пребыванием?',
        answer: 'Лечение предполагает врачебный осмотр: курортный врач ставит диагноз, назначает индивидуальную программу, наблюдает за её ходом и фиксирует результат в письменном виде. Wellness-пребывание — это свободно забронированная поездка для отдыха с процедурами по собственному вкусу, без медицинских показаний и без наблюдения врача.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — комплексное курортное лечение',
        url: 'https://lazneml.cz/komplexni-lazenska-pece/',
        note: 'Страница оператора об объёме курортного лечения. Текст на чешском языке.',
      },
      {
        title: 'Ensana Health Spa Hotels — Марианские Лазни, актуальные пакеты и цены',
        url: 'https://ensanahotels.com/cs/destinace/ceska-republika/marianske-lazne',
        note: 'Страница бронирования оператора с актуальными названиями пакетов, количеством процедур за ночь и ценами.',
      },
      {
        title: 'Отель Ensana Butterfly — предложение курортных пребываний',
        url: 'https://ensanahotels.com/cs/hotely/butterfly',
        note: 'Страница оператора об отеле, на которой основана более короткая минимальная продолжительность. Текст на чешском языке.',
      },
    ],
    related: [
      {
        label: 'Курортное лечение по диагнозу',
        href: '/ru/kurortnoe-lechenie',
      },
      {
        label: 'Советы курортным гостям',
        href: '/ru/sovety-kurortnym-gostyam',
      },
      {
        label: 'Врачебная команда',
        href: '/ru/vrachebnaya-komanda',
      },
      {
        label: 'Оплата лечения',
        href: '/ru/oplata-kurortnogo-lecheniya',
      },
    ],
    reviewDate: '2026-09-14',
  },
  cs: {
    navLabel: 'Léčebné pobyty a programy',
    title: 'Léčebné pobyty v Mariánských Lázních: procedury, délka, obsah',
    h1: 'Jaké léčebné pobyty existují a co je v nich zahrnuto',
    metaTitle: 'Léčebné pobyty v Mariánských Lázních – kolik procedur?',
    metaDescription: 'Kolik procedur na noc, co je v pobytu zahrnuto a jaké existují nadstandardní programy — léčebné pobyty v Mariánských Lázních v přehledu.',
    lead: 'Rozdíl mezi léčebnými pobyty je především v jednom čísle: kolik procedur na noc je v ceně zahrnuto. Od toho se odvíjí, jestli je pobyt spíš odpočinkový, nebo jde o léčbu vedenou lékařem. Ceny zde záměrně nejsou uvedeny — liší se podle domu, kategorie pokoje a sezóny a patří na rezervační stránku.',
    commonHeading: 'Co má společné každý léčebný pobyt',
    commonBody: 'K léčebnému pobytu patří ubytování s polopenzí, vstupní a výstupní lékařská prohlídka, písemná závěrečná zpráva, předepsané procedury a pitná kúra u minerálních pramenů. Kratší odpočinkový pobyt existuje i bez lékařské prohlídky; pak ale nejde o léčebný pobyt, ale o wellness pobyt s jednotlivými procedurami.',
    images: {
      stays: { src: '/images/library/mineral-bath/co2-apparatus-tub.jpg', alt: 'Host leží v minerální koupeli ve vaně v historické kachlíkové lázeňské místnosti' },
      menu: { src: '/images/library/treatments/peat-wrap-back.jpg', alt: 'Rašelinový zábal nanesený na horní část zad ležícího hosta' },
      superior: { src: '/images/partners/roman-baths-hero.jpg', alt: 'Bazén Římských lázní v hotelu Nové Lázně s mramorovými sloupy a klenutým stropem' },
    },
    staysHeading: 'Pobyty v přehledu',
    staysNote:
      'Uvedené délky platí pro obvyklou nabídku mariánskolázeňských domů. Nejkratší možná délka se ale liší podle hotelu a balíčku: v hotelu Ensana Butterfly začínají léčebné pobyty už od pěti nocí a intenzivní léčebný pobyt od šesti. Aktuální hranici pro konkrétní dům najdete u provozovatele.',
    stays: [
      {
        name: 'Krátký odpočinkový pobyt',
        length: '2 až 6 nocí',
        treatments: '1 procedura na noc',
        includes: [
          'Ubytování s polopenzí, tedy snídaní a večeří',
          'Jedna procedura na každou noc, z pevně stanovené nabídky',
          'Obvykle bez vstupní lékařské prohlídky, a pak nejde o léčebný pobyt; v některých domech, například v hotelu Butterfly, patří vstupní vyšetření ke každému pobytu',
        ],
        forWhom: 'Pro dlouhý víkend nebo první seznámení s lázeňským místem, bez léčebného programu.',
      },
      {
        name: 'Intenzivní lázeňský pobyt',
        length: 'obvykle od 7 nocí',
        treatments: '2 procedury na noc',
        includes: [
          'Ubytování s polopenzí',
          'Vstupní a výstupní lékařská prohlídka s písemnou závěrečnou zprávou',
          'Základní laboratorní vyšetření',
          'Pitná kúra podle lékařského předpisu',
        ],
        forWhom: 'Pro hosty, kteří chtějí kúru vedenou lékařem, ale s mírnějším denním programem.',
      },
      {
        name: 'Tradiční lázeňský pobyt',
        length: 'obvykle od 7 nocí',
        treatments: '3 procedury na noc',
        includes: [
          'Ubytování s polopenzí',
          'Vstupní a výstupní lékařská prohlídka s písemnou závěrečnou zprávou',
          'Základní laboratorní vyšetření',
          'Pitná kúra podle lékařského předpisu',
          'Lékařská a ošetřovatelská pohotovostní služba',
        ],
        forWhom: 'Klasická podoba mariánskolázeňské kúry, obvyklá cesta pro většinu indikací.',
      },
      {
        name: 'Intenzivní léčebný pobyt',
        length: 'obvykle od 7 nocí',
        treatments: '4 procedury na noc',
        includes: [
          'Ubytování s polopenzí',
          'Vstupní a výstupní lékařská prohlídka s písemnou závěrečnou zprávou',
          'Základní laboratorní vyšetření',
          'Pitná kúra podle lékařského předpisu',
          'Lékařská a ošetřovatelská pohotovostní služba',
        ],
        forWhom: 'Pro výrazné obtíže a pro rehabilitaci po operaci, když má být program hustý.',
      },
    ],
    decidesHeading: 'Kdo určuje, jaké procedury dostanete',
    decidesBody: 'Pobyt určuje, kolik procedur na noc je v ceně zahrnuto — které to konkrétně jsou, rozhoduje výhradně lázeňský lékař při vstupní prohlídce, podle diagnózy a vašeho aktuálního stavu. Program si tedy nemůžete složit sami, a to je rozdíl oproti wellness pobytu. Pokud vám některá procedura nevyhovuje, plán se změní; řekněte to svému lázeňskému lékaři.',
    menuHeading: 'Z čeho lékař vybírá',
    menuGroups: [
      {
        name: 'Procedury z přírodních léčivých zdrojů',
        items: 'Minerální koupele, suché plynové koupele v Mariině plynu, plynové injekce, slatinné zábaly (až tři týdně), inhalace, pobyt a pohyb v přírodě.',
      },
      {
        name: 'Léčebná rehabilitace',
        items: 'Individuální nebo skupinový léčebný tělocvik, pohybová terapie v bazénu, fyzioterapie.',
      },
      {
        name: 'Další procedury',
        items: 'Masáže (až tři týdně), lymfodrenáž, elektroterapie, magnetoterapie, laser, kryoterapie, ultrazvuk, parafínové zábaly, kyslíková terapie, Lavatherm.',
      },
    ],
    labHeading: 'Co obsahuje základní laboratorní vyšetření',
    labBody: 'Biochemické vyšetření krve se stanovením krevního cukru, cholesterolu a dalších krevních tuků, jaterních hodnot, funkce ledvin a kyseliny močové, k tomu vyšetření moči. Je součástí léčebných pobytů a slouží lázeňskému lékaři jako podklad pro léčebný plán.',
    superiorHeading: 'Programy v hotelu Nové Lázně',
    superiorLead: 'Nad rámec léčebných pobytů nabízí hotel Nové Lázně čtyři programy, které začínají podrobnou diagnostikou. Všechny obsahují Medical Check-Up a na něm dále staví.',
    superior: [
      {
        name: 'Medical Check-Up',
        forWhom: 'Pro hosty, kteří chtějí nejdřív zjistit, na čem jsou.',
        body: 'Diagnostický program s komplexním vyšetřením aktuálního zdravotního stavu. Cílem je odhalit možná rizika a raná znamení onemocnění. Na základě laboratorních hodnot, přístrojových vyšetření a nutričního poradenství pak lékařský tým sestaví individuální léčebný plán.',
      },
      {
        name: 'De-Stress',
        forWhom: 'Pro hosty pod dlouhotrvající zátěží.',
        body: 'Zahrnuje Medical Check-Up a doplňuje ho o posouzení aktuální úrovně stresu a jeho dopadu na zdraví. Lékařský tým na základě toho sestaví individuální plán procedur; k tomu patří i vedení k rozpoznávání stresových faktorů a ke zvládání zátěže. Takový program nenahrazuje psychoterapii ani psychiatrickou léčbu.',
      },
      {
        name: 'Healthy Aging',
        forWhom: 'Pro hosty, kterým jde o kvalitu života ve vyšším věku.',
        body: 'Zahrnuje Medical Check-Up, po kterém následuje individuálně sestavený program s místními přírodními léčivými zdroji. Důraz je na návycích, které lze udržet i doma, a na udržitelné rovnováze mezi prací a odpočinkem.',
      },
      {
        name: 'Weight Loss',
        forWhom: 'Pro hosty s nadváhou, pod lékařským dohledem.',
        body: 'Zahrnuje Medical Check-Up a pracuje na stravovacích návycích a životním stylu. Pozadí je medicínské: nadváha a obezita zatěžují pohybový aparát a patří k rizikovým faktorům srdce a oběhu. Program doprovází lékařský tým, se zásadami vyvážené stravy a více pohybu v běžném dni.',
      },
    ],
    disclaimer: 'Který pobyt se hodí k vaší diagnóze a jaké procedury v něm mají smysl, rozhoduje lázeňský lékař při vstupní prohlídce. Tato stránka popisuje strukturu pobytů a nenahrazuje lékařskou konzultaci. Ceny, dostupnost a aktuální názvy pobytů najdete u provozovatele.',
    faqs: [
      {
        question: 'Kolik procedur denně dostanete v Mariánských Lázních?',
        answer: 'Záleží na zvoleném pobytu: krátký odpočinkový pobyt obsahuje jednu proceduru na noc, intenzivní lázeňský pobyt dvě, tradiční lázeňský pobyt tři a intenzivní léčebný pobyt čtyři. Které procedury to konkrétně budou, určí lázeňský lékař po vstupní prohlídce.',
      },
      {
        question: 'Co je v léčebném pobytu zahrnuto?',
        answer: 'U léčebného pobytu: ubytování s polopenzí, vstupní a výstupní lékařská prohlídka, písemná závěrečná zpráva, základní laboratorní vyšetření, předepsané procedury a pitná kúra u minerálních pramenů. Od tradičního pobytu přibývá lékařská a ošetřovatelská pohotovostní služba. Cestu a lázeňský poplatek platí host samostatně.',
      },
      {
        question: 'Jak dlouho musí trvat léčebný pobyt minimálně?',
        answer: 'Nejkratší délka se liší podle hotelu a balíčku. V obvyklé nabídce mariánskolázeňských domů začínají léčebné pobyty na sedmi nocích, v hotelu Ensana Butterfly už na pěti a intenzivní léčebný pobyt na šesti. Delší série má svůj důvod: za odbornou spodní hranici balneoterapie se považuje nejméně deset procedur během nejméně deseti dnů. Kratší pobyty od dvou nocí existují jako odpočinkový formát s jednou procedurou na noc.',
      },
      {
        question: 'Můžu si procedury vybrat sám?',
        answer: 'U léčebného pobytu ne: počet a skladbu určuje výhradně lázeňský lékař po vstupní prohlídce, a právě to odlišuje kúru od wellness pobytu. U krátkého odpočinkového pobytu naopak vybíráte z pevného seznamu. Pokud vám předepsaná procedura nevyhovuje, řekněte to svému lázeňskému lékaři, aby se plán změnil.',
      },
      {
        question: 'Jaký je rozdíl mezi kúrou a wellness pobytem?',
        answer: 'Kúra předpokládá lékařskou prohlídku: lázeňský lékař stanoví diagnózu, předepíše individuální program, sleduje jeho průběh a výsledek písemně zaznamená. Wellness pobyt je volně zarezervovaná odpočinková cesta s procedurami podle vlastního vkusu, bez lékařské indikace a bez lékařského dohledu.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — komplexní lázeňská péče',
        url: 'https://lazneml.cz/komplexni-lazenska-pece/',
        note: 'Stránka provozovatele o rozsahu lázeňské léčby.',
      },
      {
        title: 'Ensana Health Spa Hotels — Mariánské Lázně, aktuální pobyty a ceny',
        url: 'https://ensanahotels.com/cs/destinace/ceska-republika/marianske-lazne',
        note: 'Rezervační stránka provozovatele s aktuálními názvy pobytů, počtem procedur na noc a cenami.',
      },
      {
        title: 'Hotel Ensana Butterfly — nabídka lázeňských pobytů',
        url: 'https://ensanahotels.com/cs/hotely/butterfly',
        note: 'Stránka provozovatele k hotelu, z níž vychází kratší nejmenší délka pobytu.',
      },
    ],
    related: [
      {
        label: 'Lázeňská léčba podle diagnózy',
        href: '/cs/lazenska-lecba',
      },
      {
        label: 'Rady pro lázeňské hosty',
        href: '/cs/rady-pro-lazenske-hosty',
      },
      {
        label: 'Lékařský tým',
        href: '/cs/lekarsky-tym',
      },
      {
        label: 'Lázně hrazené pojišťovnou',
        href: '/cs/lazne-s-pojistovnou',
      },
    ],
    reviewDate: '2026-09-14',
  },
  de: {
    navLabel: 'Kurpakete und Programme',
    title: 'Kurpakete in Marienbad: Anwendungen, Dauer, Inhalt',
    h1: 'Welche Kurpakete es gibt und was drin ist',
    metaTitle: 'Kurpakete in Marienbad — wie viele Anwendungen?',
    metaDescription:
      'Wie viele Anwendungen pro Nacht, was im Paket enthalten ist und welche Zusatzprogramme es gibt — die Kurpakete in Marienbad im Überblick.',
    lead:
      'Der Unterschied zwischen den Kurpaketen liegt vor allem in einer Zahl: wie viele Anwendungen pro Übernachtung im Preis enthalten sind. Daran hängt, ob ein Aufenthalt eher Erholung oder eine ärztlich geführte Behandlung ist. Preise stehen hier bewusst nicht — sie hängen von Haus, Zimmerkategorie und Saison ab und gehören auf die Buchungsseite.',
    commonHeading: 'Was jeder Behandlungsaufenthalt enthält',
    commonBody:
      'Zu einem Behandlungsaufenthalt gehören die Unterkunft mit Halbpension, die ärztliche Eingangs- und Abschlussuntersuchung, der schriftliche Abschlussbericht, die verordneten Anwendungen und die Trinkkur an den Mineralquellen. Den kürzeren Erholungsaufenthalt gibt es auch ohne ärztliche Untersuchung; dann ist es kein Behandlungsaufenthalt, sondern ein Wellnessaufenthalt mit einzelnen Anwendungen.',
    images: {
      stays: { src: '/images/library/mineral-bath/co2-apparatus-tub.jpg', alt: 'Ein Gast liegt im Mineralbad in einer Wanne in einem historischen, gekachelten Baderaum' },
      menu: { src: '/images/library/treatments/peat-wrap-back.jpg', alt: 'Eine Moorpackung auf dem oberen Rücken eines liegenden Gastes' },
      superior: { src: '/images/partners/roman-baths-hero.jpg', alt: 'Das Becken der Römischen Bäder im Haus Nové Lázně mit Marmorsäulen und Gewölbedecke' },
    },
    staysHeading: 'Die Pakete im Vergleich',
    staysNote:
      'Die genannten Dauern gelten für das übliche Angebot der Marienbader Häuser. Die Mindestdauer hängt jedoch vom Hotel und vom Paket ab: Im Hotel Ensana Butterfly beginnen die Behandlungsaufenthalte bereits ab fünf Nächten, der intensive Behandlungsaufenthalt ab sechs. Die aktuelle Untergrenze für ein bestimmtes Haus erfahren Sie beim Betreiber.',
    stays: [
      {
        name: 'Kurzaufenthalt zur Erholung',
        length: '2 bis 6 Nächte',
        treatments: '1 Anwendung pro Nacht',
        includes: [
          'Unterkunft mit Halbpension, also Frühstück und Abendessen',
          'Eine Anwendung je Übernachtung, aus einer festen Auswahl',
          'In der Regel ohne ärztliche Eingangsuntersuchung, und dann kein Behandlungsaufenthalt; in manchen Häusern, etwa im Hotel Butterfly, gehört die Eingangsuntersuchung zu jedem Aufenthalt',
        ],
        forWhom:
          'Für ein langes Wochenende oder einen ersten Eindruck vom Kurort, ohne medizinisches Programm.',
      },
      {
        name: 'Intensiver Kuraufenthalt',
        length: 'in der Regel ab 7 Nächten',
        treatments: '2 Anwendungen pro Nacht',
        includes: [
          'Unterkunft mit Halbpension',
          'Ärztliche Eingangs- und Abschlussuntersuchung mit schriftlichem Abschlussbericht',
          'Labor-Basisuntersuchung',
          'Trinkkur nach ärztlicher Verordnung',
        ],
        forWhom:
          'Für Gäste, die eine ärztlich geführte Kur wollen, aber mit überschaubarem Tagesprogramm.',
      },
      {
        name: 'Traditioneller Kuraufenthalt',
        length: 'in der Regel ab 7 Nächten',
        treatments: '3 Anwendungen pro Nacht',
        includes: [
          'Unterkunft mit Halbpension',
          'Ärztliche Eingangs- und Abschlussuntersuchung mit schriftlichem Abschlussbericht',
          'Labor-Basisuntersuchung',
          'Trinkkur nach ärztlicher Verordnung',
          'Ärztlicher und pflegerischer Bereitschaftsdienst',
        ],
        forWhom:
          'Das klassische Format der Marienbader Kur, für die meisten Indikationen der übliche Weg.',
      },
      {
        name: 'Intensiver Behandlungsaufenthalt',
        length: 'in der Regel ab 7 Nächten',
        treatments: '4 Anwendungen pro Nacht',
        includes: [
          'Unterkunft mit Halbpension',
          'Ärztliche Eingangs- und Abschlussuntersuchung mit schriftlichem Abschlussbericht',
          'Labor-Basisuntersuchung',
          'Trinkkur nach ärztlicher Verordnung',
          'Ärztlicher und pflegerischer Bereitschaftsdienst',
        ],
        forWhom:
          'Für ausgeprägte Beschwerden und für die Rehabilitation nach Operationen, wenn das Programm dicht sein soll.',
      },
    ],
    decidesHeading: 'Wer bestimmt, welche Anwendungen Sie bekommen',
    decidesBody:
      'Das Paket legt fest, wie viele Anwendungen pro Nacht enthalten sind — welche es sind, entscheidet ausschließlich der Kurarzt bei der Eingangsuntersuchung, auf Grundlage der Diagnose und Ihres aktuellen Zustands. Sie können sich das Programm also nicht selbst zusammenstellen, und das ist der Unterschied zu einem Wellnessaufenthalt. Verträgt man eine Anwendung nicht, wird der Plan geändert; sagen Sie es dann Ihrem Kurarzt.',
    menuHeading: 'Woraus der Arzt auswählt',
    menuGroups: [
      {
        name: 'Anwendungen aus den natürlichen Heilmitteln',
        items:
          'Mineralbäder, trockene Gasbäder im Mariengas, Gasinjektionen, Moorpackungen (bis zu drei pro Woche), Inhalationen, Aufenthalt und Bewegung im Freien.',
      },
      {
        name: 'Therapeutische Rehabilitation',
        items:
          'Einzel- oder Gruppenübungstherapie, Bewegungstherapie im Schwimmbecken, Physiotherapie.',
      },
      {
        name: 'Weitere Anwendungen',
        items:
          'Massagen (bis zu drei pro Woche), Lymphdrainage, Elektrotherapie, Magnetfeldtherapie, Laser, Kryotherapie, Ultraschall, Paraffinpackungen, Sauerstofftherapie, Lavatherm.',
      },
    ],
    labHeading: 'Was die Labor-Basisuntersuchung umfasst',
    labBody:
      'Eine biochemische Blutuntersuchung mit Blutzucker, Cholesterin und weiteren Blutfettwerten, Leberwerten, Nierenfunktion und Harnsäure, dazu eine Harnuntersuchung. Sie ist bei den Behandlungsaufenthalten enthalten und dient dem Kurarzt als Grundlage für den Behandlungsplan.',
    superiorHeading: 'Programme im Haus Nové Lázně',
    superiorLead:
      'Über die Kurpakete hinaus gibt es im Haus Nové Lázně vier Programme, die bei einer ausführlichen Diagnostik beginnen. Alle enthalten den Medical Check-Up und bauen darauf auf.',
    superior: [
      {
        name: 'Medical Check-Up',
        forWhom: 'Für Gäste, die zuerst wissen wollen, wo sie stehen.',
        body:
          'Ein Diagnostikprogramm mit einer umfassenden Untersuchung des aktuellen Gesundheitszustands. Ziel ist, mögliche Risiken und frühe Anzeichen von Erkrankungen zu erkennen. Auf Grundlage der Laborwerte, der apparativen Untersuchungen und einer Ernährungsberatung stellt das Ärzteteam anschließend einen individuellen Behandlungsplan auf.',
      },
      {
        name: 'De-Stress',
        forWhom: 'Für Gäste unter anhaltender Belastung.',
        body:
          'Enthält den Medical Check-Up und ergänzt ihn um eine Einschätzung des aktuellen Stressniveaus und seiner Auswirkungen auf die Gesundheit. Das Ärzteteam stellt daraufhin einen individuellen Anwendungsplan zusammen; dazu kommt die Anleitung, Stressfaktoren zu erkennen und mit ihnen umzugehen. Ein solches Programm ersetzt keine Psychotherapie und keine psychiatrische Behandlung.',
      },
      {
        name: 'Healthy Aging',
        forWhom: 'Für Gäste, denen es um Lebensqualität im Alter geht.',
        body:
          'Enthält den Medical Check-Up, auf den ein individuell zusammengestelltes Programm mit den örtlichen natürlichen Heilmitteln folgt. Im Vordergrund stehen Gewohnheiten, die sich zu Hause fortführen lassen, und ein tragfähiges Gleichgewicht zwischen Arbeit und Erholung.',
      },
      {
        name: 'Weight Loss',
        forWhom: 'Für Gäste mit Übergewicht, unter ärztlicher Begleitung.',
        body:
          'Enthält den Medical Check-Up und arbeitet an Ernährungsgewohnheiten und Lebensstil. Der Hintergrund ist medizinisch: Übergewicht und Adipositas belasten den Bewegungsapparat und gehören zu den Risikofaktoren für Herz und Kreislauf. Begleitet wird das Programm vom Ärzteteam, mit den Grundsätzen einer ausgewogenen Ernährung und mehr Bewegung im Alltag.',
      },
    ],
    disclaimer:
      'Welches Paket zu Ihrer Diagnose passt und welche Anwendungen darin sinnvoll sind, entscheidet der Kurarzt bei der Eingangsuntersuchung. Diese Seite beschreibt die Struktur der Aufenthalte und ersetzt keine ärztliche Beratung. Preise, Verfügbarkeit und die aktuellen Bezeichnungen der Pakete finden Sie beim Betreiber.',
    faqs: [
      {
        question: 'Wie viele Anwendungen pro Tag bekommt man in Marienbad?',
        answer:
          'Das hängt vom gebuchten Paket ab: Der Kurzaufenthalt zur Erholung enthält eine Anwendung pro Übernachtung, der intensive Kuraufenthalt zwei, der traditionelle Kuraufenthalt drei und der intensive Behandlungsaufenthalt vier. Welche Anwendungen es konkret sind, legt der Kurarzt nach der Eingangsuntersuchung fest.',
      },
      {
        question: 'Was ist im Kurpaket enthalten?',
        answer:
          'Bei einem Behandlungsaufenthalt: Unterkunft mit Halbpension, die ärztliche Eingangs- und Abschlussuntersuchung, der schriftliche Abschlussbericht, die Labor-Basisuntersuchung, die verordneten Anwendungen und die Trinkkur an den Mineralquellen. Ab dem traditionellen Aufenthalt kommt ein ärztlicher und pflegerischer Bereitschaftsdienst dazu. Anreise und Kurtaxe zahlt der Gast separat.',
      },
      {
        question: 'Wie lange muss ein Kuraufenthalt mindestens dauern?',
        answer:
          'Die Mindestdauer hängt vom Hotel und vom Paket ab. Im üblichen Angebot der Marienbader Häuser beginnen die Behandlungsaufenthalte bei sieben Nächten, im Hotel Ensana Butterfly bereits bei fünf und der intensive Behandlungsaufenthalt bei sechs. Die längere Serie hat ihren Grund: Als fachliche Untergrenze einer Balneotherapie gelten mindestens zehn Anwendungen über mindestens zehn Tage. Kürzere Aufenthalte ab zwei Nächten gibt es als Erholungsformat mit einer Anwendung pro Nacht.',
      },
      {
        question: 'Kann ich mir die Anwendungen selbst aussuchen?',
        answer:
          'Bei einem Behandlungsaufenthalt nicht: Zahl und Zusammenstellung bestimmt ausschließlich der Kurarzt nach der Eingangsuntersuchung, und genau das unterscheidet die Kur von einem Wellnessaufenthalt. Beim kurzen Erholungsaufenthalt wählen Sie dagegen aus einer festen Liste. Wenn Sie eine verordnete Anwendung nicht vertragen, sagen Sie es Ihrem Kurarzt, damit der Plan geändert wird.',
      },
      {
        question: 'Was ist der Unterschied zwischen einer Kur und einem Wellnessaufenthalt?',
        answer:
          'Eine Kur setzt eine ärztliche Untersuchung voraus: Der Kurarzt stellt die Diagnose, verordnet ein individuelles Programm, begleitet den Verlauf und hält das Ergebnis schriftlich fest. Ein Wellnessaufenthalt ist eine frei gebuchte Erholungsreise mit Anwendungen nach eigenem Geschmack, ohne medizinische Indikation und ohne ärztliche Begleitung.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — komplexe Kurbehandlung',
        url: LAZNEML,
        note: 'Seite des Betreibers zum Umfang der Kurbehandlung. Tschechischer Text.',
      },
      {
        title: 'Ensana Health Spa Hotels — Marienbad, aktuelle Pakete und Preise',
        url: ENSANA_OFFERS,
        note: 'Buchungsseite des Betreibers mit den aktuellen Bezeichnungen der Pakete, der Zahl der Anwendungen pro Nacht und den Preisen.',
      },
      {
        title: 'Hotel Ensana Butterfly — Angebot der Kuraufenthalte',
        url: 'https://ensanahotels.com/cs/hotely/butterfly',
        note: 'Seite des Betreibers zum Hotel, auf die sich die kürzere Mindestdauer stützt. Text auf Tschechisch.',
      },
    ],
    related: [
      { label: 'Kur nach Diagnose', href: '/de/kur-bei' },
      { label: 'Hinweise für Kurgäste', href: '/de/hinweise-fuer-kurgaeste' },
      { label: 'Ärzteteam', href: '/de/aerzteteam' },
      { label: 'Zahlt die Krankenkasse eine Kur?', href: '/de/kur-im-ausland-krankenkasse' },
    ],
    reviewDate: '2026-09-14',
  },
  en: {
    navLabel: 'Treatment Packages',
    title: 'Spa treatment packages in Marienbad: procedures, duration, content',
    h1: 'What spa packages exist and what they include',
    metaTitle: 'Spa packages in Marienbad — how many procedures?',
    metaDescription:
      'How many procedures per night, what is included in the package and what additional programmes exist — an overview of the spa packages in Marienbad.',
    lead:
      'The difference between the spa packages comes down mainly to one number: how many procedures per night are included in the price. That determines whether a stay is more of a relaxing break or a medically supervised treatment. Prices are deliberately left out here — they depend on the hotel, room category and season, and belong on the booking site.',
    commonHeading: 'What every treatment stay includes',
    commonBody:
      'A treatment stay includes accommodation with half board, the initial and final medical examination, the written final report, the prescribed procedures and the drinking cure at the mineral springs. The shorter relaxation stay is also available without a medical examination; in that case it is not a treatment stay but a wellness stay with individual procedures.',
    images: {
      stays: { src: '/images/library/mineral-bath/co2-apparatus-tub.jpg', alt: 'A guest lying in a mineral bath in a tub in a historic tiled bath room' },
      menu: { src: '/images/library/treatments/peat-wrap-back.jpg', alt: 'A peat wrap applied to the upper back of a guest lying down' },
      superior: { src: '/images/partners/roman-baths-hero.jpg', alt: 'The pool of the Roman Baths at the Nové Lázně house, with marble columns and a vaulted ceiling' },
    },
    staysHeading: 'The packages compared',
    staysNote:
      'The durations given apply to the usual offer of the Marienbad houses. The minimum length depends on the hotel and the package: at the Ensana Butterfly, treatment stays start from five nights and the intensive treatment stay from six. Ask the operator for the current minimum at a particular house.',
    stays: [
      {
        name: 'Short relaxation stay',
        length: '2 to 6 nights',
        treatments: '1 procedure per night',
        includes: [
          'Accommodation with half board, i.e. breakfast and dinner',
          'One procedure per night, from a fixed selection',
          'Usually no initial medical examination, and then it is not a treatment stay; at some houses, the Butterfly among them, the initial examination is part of every stay',
        ],
        forWhom:
          'For a long weekend or a first impression of the spa town, without a medical programme.',
      },
      {
        name: 'Intensive spa stay',
        length: 'usually from 7 nights',
        treatments: '2 procedures per night',
        includes: [
          'Accommodation with half board',
          'Initial and final medical examination with a written final report',
          'Basic laboratory examination',
          'Drinking cure as prescribed by the physician',
        ],
        forWhom:
          'For guests who want a medically supervised cure, but with a manageable daily programme.',
      },
      {
        name: 'Traditional spa stay',
        length: 'usually from 7 nights',
        treatments: '3 procedures per night',
        includes: [
          'Accommodation with half board',
          'Initial and final medical examination with a written final report',
          'Basic laboratory examination',
          'Drinking cure as prescribed by the physician',
          'On-call medical and nursing service',
        ],
        forWhom:
          'The classic format of the Marienbad cure, the usual route for most indications.',
      },
      {
        name: 'Intensive treatment stay',
        length: 'usually from 7 nights',
        treatments: '4 procedures per night',
        includes: [
          'Accommodation with half board',
          'Initial and final medical examination with a written final report',
          'Basic laboratory examination',
          'Drinking cure as prescribed by the physician',
          'On-call medical and nursing service',
        ],
        forWhom:
          'For pronounced complaints and for rehabilitation after surgery, when the programme needs to be dense.',
      },
    ],
    decidesHeading: 'Who decides which procedures you get',
    decidesBody:
      'The package sets how many procedures per night are included — which ones they are is decided solely by the spa physician at the initial examination, based on the diagnosis and your current condition. You cannot put the programme together yourself, and that is the difference from a wellness stay. If a procedure does not agree with you, the plan is changed; tell your spa physician.',
    menuHeading: 'What the physician chooses from',
    menuGroups: [
      {
        name: 'Procedures using the natural healing resources',
        items:
          'Mineral baths, dry gas baths in Mariengas, gas injections, peat wraps (up to three per week), inhalations, time and exercise outdoors.',
      },
      {
        name: 'Therapeutic rehabilitation',
        items:
          'Individual or group exercise therapy, movement therapy in the swimming pool, physiotherapy.',
      },
      {
        name: 'Further procedures',
        items:
          'Massages (up to three per week), lymphatic drainage, electrotherapy, magnetic field therapy, laser, cryotherapy, ultrasound, paraffin wraps, oxygen therapy, Lavatherm.',
      },
    ],
    labHeading: 'What the basic laboratory examination covers',
    labBody:
      'A biochemical blood test covering blood sugar, cholesterol and other blood lipid values, liver values, kidney function and uric acid, plus a urine test. It is included in the treatment stays and serves the spa physician as the basis for the treatment plan.',
    superiorHeading: 'Programmes at the Nové Lázně house',
    superiorLead:
      'Beyond the spa packages, the Nové Lázně house offers four programmes that begin with a thorough diagnostic workup. All of them include the Medical Check-Up and build on it.',
    superior: [
      {
        name: 'Medical Check-Up',
        forWhom: 'For guests who first want to know where they stand.',
        body:
          'A diagnostic programme with a comprehensive assessment of your current state of health. The aim is to identify possible risks and early signs of disease. Based on the laboratory values, the instrumental examinations and a nutritional consultation, the medical team then draws up an individual treatment plan.',
      },
      {
        name: 'De-Stress',
        forWhom: 'For guests under sustained pressure.',
        body:
          'Includes the Medical Check-Up and adds an assessment of your current stress level and its effect on your health. The medical team then puts together an individual procedure plan; guidance on recognising and dealing with stress factors is included. A programme of this kind does not replace psychotherapy or psychiatric treatment.',
      },
      {
        name: 'Healthy Aging',
        forWhom: 'For guests focused on quality of life in later years.',
        body:
          'Includes the Medical Check-Up, followed by an individually assembled programme using the local natural healing resources. The focus is on habits that can be continued at home and on a sustainable balance between work and recovery.',
      },
      {
        name: 'Weight Loss',
        forWhom: 'For guests who are overweight, under medical supervision.',
        body:
          'Includes the Medical Check-Up and works on eating habits and lifestyle. The background is medical: excess weight and obesity place a strain on the musculoskeletal system and are among the risk factors for heart and circulation. The programme is accompanied by the medical team, based on the principles of a balanced diet and more exercise in daily life.',
      },
    ],
    disclaimer:
      'Which package suits your diagnosis and which procedures within it make sense is decided by the spa physician at the initial examination. This page describes the structure of the stays and does not replace medical advice. Prices, availability and the operator’s current package names are available from the operator.',
    faqs: [
      {
        question: 'How many procedures per day do you get in Marienbad?',
        answer:
          'That depends on the package booked: the short relaxation stay includes one procedure per night, the intensive spa stay two, the traditional spa stay three and the intensive treatment stay four. Which procedures these are in practice is decided by the spa physician after the initial examination.',
      },
      {
        question: 'What is included in a spa package?',
        answer:
          'For a treatment stay: accommodation with half board, the initial and final medical examination, the written final report, the basic laboratory examination, the prescribed procedures and the drinking cure at the mineral springs. From the traditional stay upwards, an on-call medical and nursing service is added. Travel and the local spa tax are paid separately by the guest.',
      },
      {
        question: 'What is the minimum length of a spa stay?',
        answer:
          'The minimum length depends on the hotel and the package. In the usual offer of the Marienbad houses treatment stays start at seven nights, at the Ensana Butterfly from five and the intensive treatment stay from six. The longer series has its reason: the recognised professional minimum for a balneotherapy course is at least ten procedures over at least ten days. Shorter stays from two nights are available as a relaxation format with one procedure per night.',
      },
      {
        question: 'Can I choose the procedures myself?',
        answer:
          'Not for a treatment stay: the number and combination are decided solely by the spa physician after the initial examination, and that is exactly what distinguishes a cure from a wellness stay. For the short relaxation stay, by contrast, you choose from a fixed list. If a prescribed procedure does not agree with you, tell your spa physician so the plan can be changed.',
      },
      {
        question: 'What is the difference between a spa cure and a wellness stay?',
        answer:
          'A spa cure requires a medical examination: the spa physician makes the diagnosis, prescribes an individual programme, follows its progress and records the outcome in writing. A wellness stay is a freely booked relaxation trip with procedures chosen to taste, without a medical indication and without medical supervision.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — comprehensive spa treatment',
        url: LAZNEML,
        note: 'Operator’s page on the scope of spa treatment. Czech-language text.',
      },
      {
        title: 'Ensana Health Spa Hotels — Marienbad, current packages and prices',
        url: ENSANA_OFFERS,
        note: 'Operator’s booking page with the current package names, the number of procedures per night and prices.',
      },
      {
        title: 'Hotel Ensana Butterfly — spa stay offer',
        url: 'https://ensanahotels.com/cs/hotely/butterfly',
        note: "The operator's page for the hotel, the basis for the shorter minimum length. Text in Czech.",
      },
    ],
    related: [
      { label: 'Spa treatment by diagnosis', href: '/en/spa-treatment-for' },
      { label: 'Advice for spa guests', href: '/en/advice-for-spa-guests' },
      { label: 'Medical team', href: '/en/medical-team' },
      { label: 'Does health insurance cover a spa cure?', href: '/en/paying-for-spa-treatment' },
    ],
    reviewDate: '2026-09-14',
  },
}
