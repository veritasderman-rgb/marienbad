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

/** Fotografie u sekce. Alt musí být v jazyce stránky, ne převzatý. */
export interface Figure {
  src: string
  alt: string
}

export interface InfoSection {
  heading: string
  /** Fotografie pod textem sekce. */
  image?: Figure
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
  ru: {
    navLabel: 'Советы курортным гостям',
    title: 'Советы курортным гостям в Марианских Лазнях',
    h1: 'Что вам следует знать о том, как проходит лечение',
    metaTitle: 'Советы курортным гостям в Марианских Лазнях — что важно знать',
    metaDescription: 'Курортная реакция на третий день, температура ванны, какой источник для кого — советы, которые врачи на месте дают каждому курортному гостю.',
    lead: 'Ниже приведены советы, которые врачи курортных отелей Марианских Лазней дают своим гостям. О многом из этого иначе узнают только на месте — а некоторые вещи, например курортную реакцию на третий день, без предупреждения могут напугать.',
    sections: [
      {
        heading: 'Что решает врач, а что нет',
        numbered: true,
        items: [
          'Какие процедуры вам подходят, всегда обсуждайте со своим врачом.',
          'Назначение каждой процедуры индивидуально и зависит от заболевания и вашего общего состояния здоровья. Программу лечения определяет исключительно лечащий врач.',
          'О питьевом курсе также решает врач. Никогда не пейте больше минеральной воды, чем вам предписано.',
          'Если какая-то процедура вам не подходит, сообщите об этом своему лечащему врачу — тогда план будет изменён.',
          'Не меняйте назначенные вам дома лекарства без согласия своего врача.',
        ],
      },
      {
        heading: 'Как всё происходит на месте',
        numbered: true,
        items: [
          'Соблюдайте согласованное время. Если вы знаете, что не сможете прийти на процедуру, обратитесь на нашу спа-рецепцию.',
          'Проблемы, возникшие во время пребывания, лучше всего решать сразу на месте с ответственными лицами, а не только после отъезда.',
          'Часто на третий и четвёртый день лечения наступает так называемая курортная реакция: вы временно чувствуете себя хуже. Это известное явление, и оно проходит.',
        ],
      },
      {
        heading: 'Что вам следует знать о процедурах',
        image: { src: '/images/library/treatments/poolside-peat-wrap.jpg', alt: 'Женщина с полотенцем-тюрбаном улыбается, отдыхая у бассейна, на спине тёмное торфяное обёртывание.' },
        numbered: true,
        items: [
          'Торфяное обёртывание представляет значительную нагрузку для людей с сердечно-сосудистыми заболеваниями. Подходит ли оно вам, всегда решает врач.',
          'Никогда не просите об иной температуре минеральной ванны, кроме назначенной. Действует общее правило: чем прохладнее минеральная ванна, тем она эффективнее и тем сильнее в ней выделяются пузырьки газа.',
          'Минеральная ванна — это ванна с природной минеральной водой, в которой растворены углекислый газ и минеральные соли. Торф в её состав не входит; торфяной экстракт добавляют в ванну только тогда, когда его назначает врач.',
          'Рефлекторный массаж — ощутимое вмешательство в организм и может вызвать серьёзные побочные явления: одышку, боль в животе, падение артериального давления или внезапную усталость. Поэтому его назначает исключительно врач после оценки вашего текущего состояния здоровья.',
        ],
      },
      {
        heading: 'Что вам следует знать об источниках',
        image: { src: '/images/library/drinking-cure/elderly-man-drinking-cure.jpg', alt: 'Пожилой мужчина пьёт минеральную воду из чугунной колонки источника в парке' },
        numbered: true,
        items: [
          'Источник Рудольфа не подходит гостям с фосфатными почечными камнями.',
          'Источник Марии не является источником минеральной воды. Из него выходит природный лечебный газ, который используется для сухих газовых ванн и газовых инъекций.',
        ],
      },
    ],
    note: 'Эти советы не заменяют беседу с вашим курортным врачом. Он принимает решение о вашем плане лечения при первичном осмотре и корректирует его в течение пребывания.',
    faqs: [
      {
        question: 'Что такое курортная реакция?',
        answer: 'Часто на третий и четвёртый день лечения гости временно чувствуют себя хуже — врачи на месте называют это курортной реакцией. Это известное явление, оно относится к обычному течению лечения и проходит. Если недомогание сильное или продолжается дольше, сообщите об этом своему курортному врачу.',
      },
      {
        question: 'Почему мне нельзя менять температуру минеральной ванны?',
        answer: 'Потому что температура — часть врачебного назначения. Действует общее правило: чем прохладнее минеральная ванна, тем она эффективнее и тем сильнее в ней выделяются пузырьки газа — более тёплая ванна ощущается приятнее, но это не то же самое. Поэтому никогда не просите об иной температуре, кроме назначенной.',
      },
      {
        question: 'Можно ли мне пить столько минеральной воды, сколько я хочу?',
        answer: 'Нет. Количество, источник и время определяет курортный врач, причём индивидуально для вас: источники Марианских Лазней существенно различаются по химическому составу, и то, что помогает при одном диагнозе, не подходит при другом. Никогда не пейте больше, чем предписано.',
      },
      {
        question: 'Подходит ли источник Марии для питья?',
        answer: 'Нет, это вообще не источник минеральной воды. Из него выходит природный лечебный газ, почти чистый углекислый газ, который используется для сухих газовых ванн и газовых инъекций. Пьют воду из других источников курорта.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — Ensana Health Spa Hotels',
        url: 'https://lazneml.cz/',
        note: 'Советы и информация для курортных гостей из лечебной брошюры оператора.',
      },
    ],
    related: [
      {
        label: 'Лечебные пакеты и программы',
        href: '/ru/lechebnye-pakety-i-programmy',
      },
      {
        label: 'Врачебная команда',
        href: '/ru/vrachebnaya-komanda',
      },
      {
        label: 'Обзор источников',
        href: '/ru/obzor-istochnikov',
      },
      {
        label: 'Курортное лечение по диагнозу',
        href: '/ru/kurortnoe-lechenie',
      },
    ],
    reviewDate: '2026-09-14',
  },
  cs: {
    navLabel: 'Rady pro lázeňské hosty',
    title: 'Rady pro lázeňské hosty v Mariánských Lázních',
    h1: 'Co byste měli vědět o průběhu své kúry',
    metaTitle: 'Rady pro lázeňské hosty v Mariánských Lázních',
    metaDescription: 'Lázeňská reakce třetí den, teplota koupele, který pramen pro koho: rady, které místní lékaři dávají každému lázeňskému hostu.',
    lead: 'Následující rady dávají svým hostům lékaři mariánskolázeňských lázeňských domů. Řadu z nich se jinak dozvíte až na místě — a některé, například lázeňská reakce třetí den, bez varování vystraší.',
    sections: [
      {
        heading: 'Co rozhoduje lékař a co ne',
        numbered: true,
        items: [
          'O tom, jaké procedury jsou pro vás vhodné, mluvte vždy se svým lékařem.',
          'Předpis každé procedury je individuální a řídí se onemocněním i vaším celkovým zdravotním stavem. Léčebný program určuje výhradně ošetřující lékař.',
          'I o pitné kúře rozhoduje lékař. Nepijte nikdy více minerální vody, než vám bylo předepsáno.',
          'Pokud vám některá procedura nevyhovuje, řekněte to svému ošetřujícímu lékaři — plán se pak změní.',
          'Neměňte doma předepsané léky bez souhlasu svého lékaře.',
        ],
      },
      {
        heading: 'Jak probíhá pobyt na místě',
        numbered: true,
        items: [
          'Dodržujte sjednané časy. Pokud víte, že proceduru nebudete moci absolvovat, obraťte se na naši spa recepci.',
          'Problémy během pobytu je nejlepší vyřešit hned na místě s odpovědnými pracovníky, ne až po odjezdu.',
          'Často třetí a čtvrtý den kúry přichází takzvaná lázeňská reakce: dočasně se cítíte hůř. Je to známý jev a odezní.',
        ],
      },
      {
        heading: 'Co byste měli vědět o procedurách',
        image: { src: '/images/library/treatments/poolside-peat-wrap.jpg', alt: 'Žena s ručníkovým turbanem odpočívá s úsměvem u bazénu, na zádech má tmavý rašelinový zábal.' },
        numbered: true,
        items: [
          'Slatinný zábal je pro lidi s onemocněním srdce a oběhu značnou zátěží. Zda je pro vás vhodný, rozhoduje vždy lékař.',
          'Nikdy neproste o jinou teplotu minerální koupele, než jaká je předepsaná. Platí zásada: čím chladnější minerální koupel, tím účinnější je a tím víc perlí.',
          'Minerální koupel je koupel v přírodní minerální vodě s rozpuštěným oxidem uhličitým a minerálními solemi. Slatina její součástí není; slatinný extrakt se do koupele přidává jen tehdy, když ho lékař předepíše.',
          'Reflexní masáž je citelný zásah do organismu a může vyvolat závažné průvodní jevy — dušnost, bolest břicha, pokles krevního tlaku nebo náhlou únavu. Předepisuje ji proto výhradně lékař po posouzení vašeho aktuálního zdravotního stavu.',
        ],
      },
      {
        heading: 'Co byste měli vědět o pramenech',
        image: { src: '/images/library/drinking-cure/elderly-man-drinking-cure.jpg', alt: 'Starší muž pije minerální vodu z litinového stojanu pramene v parku' },
        numbered: true,
        items: [
          'Rudolfův pramen není vhodný pro hosty s fosfátovými ledvinovými kameny.',
          'Mariin pramen není minerální voda k pití. Vystupuje z něj přírodní léčivý plyn, který se používá pro suché plynové koupele a plynové injekce.',
        ],
      },
    ],
    note: 'Tyto rady nenahrazují rozhovor s vaším lázeňským lékařem. O vašem léčebném plánu rozhoduje při vstupní prohlídce a v průběhu pobytu ho upravuje.',
    faqs: [
      {
        question: 'Co je lázeňská reakce?',
        answer: 'Často třetí a čtvrtý den kúry se hosté cítí dočasně hůř — místní lékaři tomu říkají lázeňská reakce. Je to známý jev, patří k průběhu a odezní. Pokud jsou potíže silné nebo trvají déle, řekněte to svému lázeňskému lékaři.',
      },
      {
        question: 'Proč nesmím měnit teplotu minerální koupele?',
        answer: 'Protože teplota je součástí předpisu. Platí zásada: čím chladnější minerální koupel, tím účinnější je a tím víc perlí — teplejší koupel je příjemnější, ale není totéž. Proto nikdy neproste o jinou teplotu, než jaká je předepsaná.',
      },
      {
        question: 'Můžu pít tolik minerální vody, kolik chci?',
        answer: 'Ne. Množství, pramen i čas určuje lázeňský lékař, a to individuálně pro vás: mariánskolázeňské prameny se chemicky výrazně liší a co pomáhá jedné diagnóze, nesedí u jiné. Nepijte nikdy víc, než je předepsáno.',
      },
      {
        question: 'Je Mariin pramen vhodný k pití?',
        answer: 'Ne, není to vůbec pramen minerální vody. Vystupuje z něj přírodní léčivý plyn, téměř čistý oxid uhličitý, který se používá pro suché plynové koupele a pro plynové injekce. Pije se u ostatních pramenů města.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — Ensana Health Spa Hotels',
        url: 'https://lazneml.cz/',
        note: 'Rady a informace pro lázeňské hosty z léčebné brožury provozovatele.',
      },
    ],
    related: [
      {
        label: 'Léčebné pobyty a programy',
        href: '/cs/lecebne-pobyty-a-programy',
      },
      {
        label: 'Lékařský tým',
        href: '/cs/lekarsky-tym',
      },
      {
        label: 'Přehled pramenů',
        href: '/cs/prehled-pramenu',
      },
      {
        label: 'Lázeňská léčba podle diagnózy',
        href: '/cs/lazenska-lecba',
      },
    ],
    reviewDate: '2026-09-14',
  },
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
          'Halten Sie die vereinbarten Zeiten ein. Wenn Sie wissen, dass Sie eine Anwendung nicht wahrnehmen können, wenden Sie sich an unsere Spa-Rezeption.',
          'Probleme während des Aufenthalts klären Sie am besten sofort vor Ort mit den Verantwortlichen, nicht erst nach der Abreise.',
          'Oft am dritten und vierten Tag der Kur tritt die sogenannte Kurreaktion ein: Sie fühlen sich vorübergehend schlechter. Das ist bekannt und geht vorüber.',
        ],
      },
      {
        heading: 'Was Sie über die Anwendungen wissen sollten',
        image: { src: '/images/library/treatments/poolside-peat-wrap.jpg', alt: 'Frau mit Handtuchturban entspannt lächelnd am Beckenrand, mit dunkler Moorpackung auf dem Rücken.' },
        numbered: true,
        items: [
          'Die Moorpackung ist für Menschen mit einer Herz-Kreislauf-Erkrankung eine erhebliche Belastung. Ob sie für Sie geeignet ist, entscheidet immer der Arzt.',
          'Bitten Sie nie um eine andere Temperatur des Mineralbads als die verordnete. Grundsätzlich gilt: Je kühler das Mineralbad, desto wirksamer ist es und desto mehr perlt es.',
          'Das Mineralbad ist ein Bad in natürlichem Mineralwasser mit gelöstem Kohlendioxid und Mineralsalzen. Moor gehört nicht dazu; ein Moorextrakt wird dem Bad nur dann zugesetzt, wenn der Arzt ihn verordnet.',
          'Die Reflexmassage ist ein spürbarer Eingriff in den Körper und kann ernste Begleiterscheinungen auslösen — Atemnot, Bauchschmerzen, einen Blutdruckabfall oder plötzliche Müdigkeit. Sie wird deshalb ausschließlich vom Arzt verordnet, nach Beurteilung Ihres aktuellen Gesundheitszustands.',
        ],
      },
      {
        heading: 'Was Sie über die Quellen wissen sollten',
        image: { src: '/images/library/drinking-cure/elderly-man-drinking-cure.jpg', alt: 'Ein älterer Mann trinkt Mineralwasser an einem gusseisernen Quellständer im Park' },
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
          'Keep to the agreed times. If you know that you will not be able to attend a treatment, please contact our spa reception.',
          'It is best to resolve any problems during your stay on the spot with the staff responsible, not only after you have left.',
          'Often on the third and fourth day of the cure, the so-called spa reaction sets in: you feel temporarily worse. This is well known and passes.',
        ],
      },
      {
        heading: 'What you should know about the procedures',
        image: { src: '/images/library/treatments/poolside-peat-wrap.jpg', alt: 'Woman with a towel turban relaxing poolside, smiling, with a dark peat mud wrap on her back.' },
        numbered: true,
        items: [
          'A peat wrap is a considerable strain for people with a cardiovascular condition. Whether it is suitable for you is always decided by the physician.',
          'Never ask for a different temperature of the mineral bath than the one prescribed. As a rule: the cooler the mineral bath, the more effective it is and the more it fizzes.',
          'A mineral bath is a bath in natural mineral water with dissolved carbon dioxide and mineral salts. Peat is not part of it; a peat extract is added to the bath only when the physician prescribes it.',
          'Reflex massage is a perceptible intervention in the body and can bring on serious effects — shortness of breath, abdominal pain, a drop in blood pressure or sudden fatigue. It is therefore prescribed by the physician alone, after an assessment of your current state of health.',
        ],
      },
      {
        heading: 'What you should know about the springs',
        image: { src: '/images/library/drinking-cure/elderly-man-drinking-cure.jpg', alt: 'An older man drinking mineral water from a cast-iron spring stand in the park' },
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
  ru: {
    navLabel: 'Врачебная команда',
    title: 'Врачебная команда курортных отелей Марианских Лазней',
    h1: 'Кто ведёт лечение в Марианских Лазнях',
    metaTitle: 'Врачебная команда в Марианских Лазнях: квалификация и наука',
    metaDescription: 'Какие врачи-специалисты ведут лечение в Марианских Лазнях, как проходят первичный и заключительный осмотр и какие исследования здесь проводились.',
    lead: 'Лечение хорошо ровно настолько, насколько хорош врач, составляющий план. Эта страница рассказывает, кто ведёт лечение в Марианских Лазнях, какие специальности представлены в отелях и какая здесь проводилась научная работа.',
    sections: [
      {
        heading: 'Как проходит врачебное сопровождение',
        image: { src: '/images/library/treatments/nutrition-consultation-desk.jpg', alt: 'Медицинский работник в белом халате разбирает с гостем запись за столом в кабинете' },
        body: 'При заезде каждый гость встречается с курортным врачом. На основании подробного первичного осмотра он ставит диагноз и составляет индивидуальный план лечения с назначенными процедурами. Во время пребывания медицинская команда наблюдает за эффектом и при необходимости корректирует план. По завершении проводится ещё один осмотр, на котором вы получаете подробное резюме результатов и рекомендации для дома.',
      },
      {
        heading: 'Какие специальности представлены в отелях',
        items: [
          'Врачи курортных отелей — это специалисты по внутренним болезням.',
          'У большинства из них есть вторая специализация, преимущественно по физической и реабилитационной медицине — дисциплине, которая раньше называлась физиатрией, бальнеологией и лечебной реабилитацией.',
          'Среди других специальностей в команде — в том числе диабетология и онкология.',
          'Весь средний медицинский персонал имеет среднее специальное или высшее образование по сестринской профессии; все старшие медсёстры имеют высшее образование, дающее право на профессиональную деятельность и в странах ЕС.',
          'Во всех отелях оператора есть дежурная служба врача и медсестёр.',
        ],
      },
      {
        heading: 'Лабораторная диагностика на месте',
        body: 'Курортные отели предлагают широкий спектр лабораторной диагностики — от оформления назначения через забор крови непосредственно в отеле до обсуждения результатов с последующей рекомендацией. При пребываниях от семи ночей базовое лабораторное обследование входит в программу.',
      },
      {
        heading: 'Исследования, которые здесь проводились',
        items: [
          'За исследование влияния курортной реабилитации на физическую работоспособность, одышку, оксиметрию и спирометрию при жалобах после COVID-19 курортные отели Марианских Лазней получили в 2021 году Innovation Award от European Spas Association в категории Medical Spa Scientific Research.',
          'Расширенное наблюдение для пациенток после онкологического лечения было включено в стандартную программу по итогам проекта OnkoFit-Spa, который был создан совместно с 1. lékařská fakulta Univerzity Karlovy, Institut lázeňství a balneologie, v.v.i. и Чешским союзом лечебных курортов.',
          'С 2026 года совместно с Institut lázeňství a balneologie, v.v.i. проводится первое клиническое исследование такого формата за тридцать лет; оно касается урологических и нефрологических диагнозов и обследует более ста пациентов до и после курортного пребывания. Научный руководитель — prim. MUDr. Ladislav Špišák, CSc.; результатов пока нет.',
        ],
      },
    ],
    peopleHeading: 'Во главе команды',
    people: [
      {
        name: 'MUDr. Markéta Hovorková, Ph.D.',
        role: 'Главный врач Ensana Health Spa Hotels Mariánské Lázně',
      },
      {
        name: 'MUDr. Pavel Knára',
        role: 'Главный врач в отставке отеля Нове Лазне',
      },
    ],
    peopleNote: 'Какой врач будет наблюдать вас во время пребывания, зависит от отеля, в котором вы проживаете, и от вашего диагноза.',
    note: 'Эта страница описывает квалификацию команды и исследования учреждения. Она не является врачебной консультацией; о вашем плане лечения решает курортный врач при первичном осмотре.',
    faqs: [
      {
        question: 'Какую специализацию имеют курортные врачи в Марианских Лазнях?',
        answer: 'Это специалисты по внутренним болезням, и у большинства из них есть вторая специализация, преимущественно по физической и реабилитационной медицине. Также представлены другие специальности, такие как диабетология и онкология. Все старшие медсёстры имеют высшее образование, дающее право на профессиональную деятельность и в странах ЕС.',
      },
      {
        question: 'Увижу ли я вообще врача во время лечения?',
        answer: 'Да, как минимум два раза: при первичном осмотре в день заезда, из которого следует план лечения, и при заключительном осмотре, на котором вы получаете письменное резюме и рекомендации для дома. Между ними команда наблюдает за ходом лечения и корректирует план. Кроме того, во всех отелях есть дежурная служба врача и медсестёр.',
      },
      {
        question: 'Проводились ли в Марианских Лазнях научные исследования?',
        answer: 'Да. Исследование курортной реабилитации после COVID-19 получило в 2021 году Innovation Award от European Spas Association в категории Medical Spa Scientific Research. По итогам проекта OnkoFit-Spa с 1. lékařská fakulta Univerzity Karlovy расширенное наблюдение после онкологического лечения было включено в стандартную программу. С 2026 года проводится первое клиническое исследование такого формата за тридцать лет, посвящённое урологическим и нефрологическим диагнозам.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — Ensana Health Spa Hotels',
        url: 'https://lazneml.cz/',
        note: 'Сведения о квалификации врачебной и сестринской команды, о порядке первичного и заключительного осмотра и о лабораторной диагностике — из лечебной брошюры оператора.',
      },
      {
        title: 'Institut lázeňství a balneologie, v.v.i.',
        url: 'https://www.i-lab.cz/en',
        note: 'Научно-исследовательское учреждение Карловарского края, основанное в 2019 году; проекты и текущие исследования курортной медицины.',
      },
      {
        title: 'Клиническое исследование объективных эффектов комплексного курортного лечения при урологических и нефрологических диагнозах (NCT07435844)',
        url: 'https://clinicaltrials.gov/study/NCT07435844',
        note: 'Текущее исследование с участием более ста пациентов, начало в 2026 году; результатов пока нет.',
      },
    ],
    related: [
      {
        label: 'Лечебные пакеты и программы',
        href: '/ru/lechebnye-pakety-i-programmy',
      },
      {
        label: 'Советы курортным гостям',
        href: '/ru/sovety-kurortnym-gostyam',
      },
      {
        label: 'Курортное лечение по диагнозу',
        href: '/ru/kurortnoe-lechenie',
      },
      {
        label: 'Показания и противопоказания',
        href: '/ru/pokazaniya-i-protivopokazaniya',
      },
    ],
    reviewDate: '2026-09-14',
  },
  cs: {
    navLabel: 'Lékařský tým',
    title: 'Lékařský tým mariánskolázeňských lázeňských domů',
    h1: 'Kdo vede léčbu v Mariánských Lázních',
    metaTitle: 'Lékařský tým v Mariánských Lázních — kvalifikace a výzkum',
    metaDescription: 'Jací lékaři vedou kúru v Mariánských Lázních, jak probíhá vstupní a výstupní prohlídka a jaké studie zde vznikly.',
    lead: 'Kúra je jen tak dobrá, jak dobrý je lékař nebo lékařka, kteří sestaví plán. Tato stránka říká, kdo to v Mariánských Lázních je, jaké obory jsou v lázních zastoupené a jaký výzkum tu vznikl.',
    sections: [
      {
        heading: 'Jak probíhá lékařská péče',
        image: { src: '/images/library/treatments/nutrition-consultation-desk.jpg', alt: 'Zdravotnice v bílém plášti probírá s hostem záznam u stolu v ordinaci' },
        body: 'Při příjezdu se každý host setká s lázeňským lékařem. Na základě podrobné vstupní prohlídky stanoví diagnózu a individuální léčebný plán s předepsanými procedurami. V průběhu pobytu lékařský tým sleduje účinek a plán v případě potřeby upravuje. Na závěr následuje další vyšetření, při kterém dostanete podrobné shrnutí výsledků a doporučení pro domácí péči.',
      },
      {
        heading: 'Jaké obory jsou v lázních zastoupené',
        items: [
          'Lékařky a lékaři lázeňských domů jsou specialisté v oboru vnitřní lékařství.',
          'Většina z nich má druhou specializaci, převážně v oboru fyzikální medicína a rehabilitace — oboru, který se dříve jmenoval fyziatrie, balneologie a léčebná rehabilitace.',
          'Dalšími obory zastoupenými v týmu jsou mimo jiné diabetologie a onkologie.',
          'Všechny sestry mají odborné nebo vysokoškolské vzdělání v ošetřovatelství; všechny vrchní sestry mají vysokoškolský titul, který opravňuje k výkonu povolání i v EU.',
          'Ve všech domech provozovatele je k dispozici lékařská a ošetřovatelská pohotovostní služba.',
        ],
      },
      {
        heading: 'Laboratorní diagnostika v lázních',
        body: 'Lázeňské domy nabízejí široké spektrum laboratorní diagnostiky — od vystavení žádanky přes odběr krve přímo v daném domě až po rozbor výsledků s následným doporučením. U pobytů od sedmi nocí je základní laboratorní vyšetření součástí programu.',
      },
      {
        heading: 'Výzkum, který zde vznikl',
        items: [
          'Za studii o vlivu lázeňské rehabilitace na fyzickou zdatnost, dušnost, oxymetrii a spirometrii u potíží po covidu-19 získaly mariánskolázeňské lázeňské domy v roce 2021 Innovation Award Evropského svazu lázní v kategorii Medical Spa Scientific Research.',
          'Z projektu OnkoFit-Spa, který vznikl společně s 1. lékařskou fakultou Univerzity Karlovy, Institutem lázeňství a balneologie a Svazem léčebných lázní České republiky, se rozšířená následná péče o pacientky po onkologické léčbě stala součástí standardního programu.',
          'Od roku 2026 běží společně s Institutem lázeňství a balneologie první klinická studie tohoto formátu za třicet let; týká se urologických a nefrologických diagnóz a vyšetřuje více než sto pacientů před lázeňským pobytem a po něm. Odborným garantem je prim. MUDr. Ladislav Špišák, CSc.; výsledky zatím nejsou k dispozici.',
        ],
      },
    ],
    peopleHeading: 'V čele týmu',
    people: [
      {
        name: 'MUDr. Markéta Hovorková, Ph.D.',
        role: 'hlavní lékařka Ensana Health Spa Hotels Mariánské Lázně',
      },
      {
        name: 'MUDr. Pavel Knára',
        role: 'emeritní primář hotelu Nové Lázně',
      },
    ],
    peopleNote: 'Který lékař vás bude po dobu pobytu doprovázet, se řídí domem, kde jste ubytováni, a vaší diagnózou.',
    note: 'Tato stránka popisuje kvalifikaci týmu a výzkum zařízení. Není lékařskou konzultací; o vašem léčebném plánu rozhoduje lázeňský lékař při vstupní prohlídce.',
    faqs: [
      {
        question: 'Jakou specializaci mají lázeňští lékaři v Mariánských Lázních?',
        answer: 'Jsou to specialisté v oboru vnitřní lékařství a většina z nich má druhou specializaci, převážně v oboru fyzikální medicína a rehabilitace. V týmu jsou zastoupeny i další obory, například diabetologie a onkologie. Všechny vrchní sestry mají vysokoškolský titul, který opravňuje k výkonu povolání i v EU.',
      },
      {
        question: 'Uvidím během kúry vůbec lékaře?',
        answer: 'Ano, minimálně dvakrát: při vstupní prohlídce v den příjezdu, ze které vychází léčebný plán, a při výstupní prohlídce, kde dostanete písemné shrnutí a doporučení pro domácí péči. Mezi tím lékařský tým sleduje průběh a plán upravuje. Ve všech domech je navíc k dispozici lékařská a ošetřovatelská pohotovostní služba.',
      },
      {
        question: 'Probíhal v Mariánských Lázních vědecký výzkum?',
        answer: 'Ano. Studie o lázeňské rehabilitaci po covidu-19 získala v roce 2021 Innovation Award Evropského svazu lázní v kategorii Medical Spa Scientific Research. Z projektu OnkoFit-Spa s 1. lékařskou fakultou Univerzity Karlovy se rozšířená následná péče po onkologické léčbě stala součástí standardního programu. Od roku 2026 běží první klinická studie tohoto formátu za třicet let, zaměřená na urologické a nefrologické diagnózy.',
      },
    ],
    sources: [
      {
        title: 'Léčebné lázně Mariánské Lázně — Ensana Health Spa Hotels',
        url: 'https://lazneml.cz/',
        note: 'Údaje o kvalifikaci lékařského a ošetřovatelského týmu, o průběhu vstupní a výstupní prohlídky a o laboratorní diagnostice z léčebné brožury provozovatele.',
      },
      {
        title: 'Institut lázeňství a balneologie, v.v.i.',
        url: 'https://www.i-lab.cz/en',
        note: 'Výzkumná instituce Karlovarského kraje, založená v roce 2019; projekty a probíhající studie lázeňské medicíny.',
      },
      {
        title: 'Klinická studie objektivních účinků komplexní lázeňské péče u urologických a nefrologických diagnóz (NCT07435844)',
        url: 'https://clinicaltrials.gov/study/NCT07435844',
        note: 'Probíhající studie s více než sto pacienty, zahájena 2026; výsledky zatím nejsou k dispozici.',
      },
    ],
    related: [
      {
        label: 'Léčebné pobyty a programy',
        href: '/cs/lecebne-pobyty-a-programy',
      },
      {
        label: 'Rady pro lázeňské hosty',
        href: '/cs/rady-pro-lazenske-hosty',
      },
      {
        label: 'Lázeňská léčba podle diagnózy',
        href: '/cs/lazenska-lecba',
      },
      {
        label: 'Indikace a kontraindikace',
        href: '/cs/indikace-a-kontraindikace',
      },
    ],
    reviewDate: '2026-09-14',
  },
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
        image: { src: '/images/library/treatments/nutrition-consultation-desk.jpg', alt: 'Eine Fachkraft im weißen Kittel bespricht mit einem Gast den Befund am Schreibtisch' },
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
        image: { src: '/images/library/treatments/nutrition-consultation-desk.jpg', alt: 'A clinician in a white coat going through a record with a guest at a consulting-room desk' },
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
