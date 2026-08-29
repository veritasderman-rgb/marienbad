import type { Locale } from '@/i18n/config'
import { routes, locales } from '@/i18n/config'
import { hotelPhotos, type HotelPhoto } from '@/lib/hotelPhotos'

/**
 * Římské lázně v hotelu Ensana Nové Lázně — sdílený obsah pro stránky
 * /cs/rimske-lazne, /de/roemisches-bad, /en/roman-baths, /ru/rimskie-bani.
 *
 * Historická fakta pocházejí z výročního textu ke 130 letům Nových Lázní
 * (src/content/articles/en-130-years-nove-lazne) a z ensana_knowledge_base.json.
 * Nic se sem nedoplňuje „od oka" — co není v těchto zdrojích, na stránce není.
 *
 * Provozní doba spa recepce zatím chybí (v pasportech 2026 není), proto se
 * nikde neuvádí a návštěvník se objednává e-mailem nebo na recepci.
 */

/** Spa recepce Nových Lázní — objednávky procedur a návštěv Římských lázní. */
export const SPA_EMAIL = 'spa.nl@ensanahotels.com'

export const romanBathsUrls = Object.fromEntries(
  locales.map((l) => [l, `/${l}/${routes['roman-baths'][l]}`]),
) as Record<Locale, string>

/** Fotky Římských lázní z hotelové fotobanky (výběr podle názvu souboru). */
export function romanBathPhotos(): HotelPhoto[] {
  return hotelPhotos('nove-lazne').filter((p) => /roman/i.test(p.base))
}

export interface TimelineItem {
  year: string
  title: string
  text: string
}
export interface FactItem {
  label: string
  value: string
}
export interface RomanBathsUI {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  h1: string
  heroLead: string

  accessHeading: string
  accessLead: string
  accessStayTitle: string
  accessStayText: string
  accessVisitorTitle: string
  accessVisitorText: string
  accessWarning: string
  accessMailLabel: string
  accessStayNl: string
  accessStayCl: string
  accessHvezda: string

  historyHeading: string
  historyLead: string
  timeline: TimelineItem[]

  architectureHeading: string
  architectureLead: string
  facts: FactItem[]

  cabinsHeading: string
  cabinsLead: string
  cabinsRoyal: string
  cabinsImperial: string

  todayHeading: string
  todayLead: string
  todayItems: string[]
  waterNote: string

  galleryHeading: string
  galleryNote: string

  outpatientHeading: string
  outpatientText: string
  outpatientCta: string

  photoAlt: string
}

export const ui: Record<Locale, RomanBathsUI> = {
  cs: {
    metaTitle: 'Římské lázně v Mariánských Lázních — historie a návštěva | Nové Lázně',
    metaDescription:
      'Římské lázně z roku 1896 v hotelu Ensana Nové Lázně: 21 sloupů ze salcburského mramoru, královská kabina Edwarda VII. a jak se do nich dostanete.',
    eyebrow: 'Ensana Nové Lázně · od roku 1896',
    h1: 'Římské lázně',
    heroLead:
      'Prosklený strop, dvacet jedna sloupů z tmavě rudého mramoru a zlacené lví hlavy nad hladinou. Římské lázně nejsou kulisa — koupete se v památce, která slouží svému účelu nepřetržitě od roku 1896.',

    accessHeading: 'Jak se do Římských lázní dostanete',
    accessLead:
      'Římské lázně jsou součástí pětihvězdičkového hotelu Nové Lázně, ne veřejným bazénem na vstupné. Právě proto v nich nikdy nepotkáte dav.',
    accessStayTitle: 'Nejjistější cesta — ubytujte se',
    accessStayText:
      'Hosté hotelů Ensana Nové Lázně a Ensana Centrální Lázně mají do Římských lázní přístup v rámci pobytu. Je to zdaleka nejpohodlnější a nejspolehlivější způsob, jak si je užít bez ohlížení na kapacitu.',
    accessVisitorTitle: 'Návštěva zvenčí',
    accessVisitorText:
      'Vstup je možný i pro hosty, kteří u nás nebydlí — vždy však výhradně po předchozí rezervaci a podle aktuální volné kapacity. Termín si domluvte předem e-mailem na spa recepci.',
    accessWarning:
      'Bez předchozí rezervace vstup není možný. Kapacita se řídí provozem lázeňského oddělení a hostům na pobytu, proto ji nelze zaručit dopředu ani přislíbit na konkrétní hodinu.',
    accessMailLabel: 'Rezervace a dotazy',
    accessHvezda:
      'Hosté hotelu Ensana Hvězda mají přístup do bazénu v Římských lázních při pobytu delším než tři noci.',
    accessStayNl: 'Ubytování v Nových Lázních',
    accessStayCl: 'Ubytování v Centrálních Lázních',

    historyHeading: 'Co nám přináší historie',
    historyLead:
      'Nové Lázně vyrostly z prostého faktu: město přestalo stačit vlastnímu úspěchu. To, co dnes obdivujeme jako architektonický skvost, byla především odpověď na nedostatek kabin.',
    timeline: [
      {
        year: '1872',
        title: 'Přijíždí první vlak',
        text: 'Železnice otevřela Mariánské Lázně Evropě a počty hostů prudce vzrostly. Dosavadní kapacity přestaly stačit a velká přestavba se stala nutností.',
      },
      {
        year: 'před 1890',
        title: 'Staré Nové Lázně a „ocelové koupele"',
        text: 'Původní budova měla 42 kabin, mezi nimi i ty pro takzvané ocelové koupele (Stahlbäder). Tak se v 19. století říkalo koupeli v Ambrožově prameni — voda byla tak bohatá na železo, že obarvila vanu do rezava a slibovala pacientům „ocelové zdraví".',
      },
      {
        year: '1892–1896',
        title: 'Stavba, která nesměla rušit sezonu',
        text: 'Podnět dal opat Alfred Clemens: rozhodl o stavbě, zajistil financování a dal projektu jasnou vizi. Stavělo se čtyři roky a vždy jen v zimě, mimo hlavní sezonu, aby lázeňský provoz nestál. Po Schafferově přestavbě se počet kabin zdvojnásobil.',
      },
      {
        year: '1. června 1896',
        title: 'Slavnostní otevření',
        text: 'Budovu navrhl rodák z Mariánských Lázní Josef Schaffer. Inspiraci našel na cestách po Itálii — v Benátkách, Boloni a Florencii; prvky italské renesance daly stavbě její nadčasový charakter. Iniciály opata A. C. a A. T. (Abbas Teplensis) jsou dodnes vytesané ve štítu budovy.',
      },
    ],

    architectureHeading: 'Sál, který se nepřestal používat',
    architectureLead:
      'Prosklený strop zaplavuje interiér měkkým denním světlem, které se odráží od hladin bazénů a podtrhuje monumentalitu celého sálu. Římské lázně patří k nejcennějším a nejlépe dochovaným příkladům evropské lázeňské architektury konce 19. století.',
    facts: [
      { label: 'Sloupy', value: '21 sloupů z tmavě rudého salcburského mramoru' },
      { label: 'Hlavice', value: 'Bílý carrarský kámen' },
      { label: 'Chrliče', value: 'Zlacené, ve tvaru lvích hlav' },
      { label: 'Obklady', value: 'Barevné majolikové dlaždice' },
      { label: 'Bazény', value: 'Dva původní, třetí s protiproudem z moderní rekonstrukce' },
      { label: 'Světlo', value: 'Prosklený strop, denní světlo po celé délce sálu' },
    ],

    cabinsHeading: 'Královské kabiny',
    cabinsLead:
      'Nové Lázně se brzy staly cílem evropské aristokracie. Součástí komplexu jsou dvě soukromé koupelové kabiny, které dodnes slouží speciální balneoterapii.',
    cabinsRoyal:
      'Královská kabina patřila britskému králi Edwardu VII., který Mariánské Lázně navštívil celkem devětkrát; jeho uhličité koupele se staly symbolem prestiže zdejší léčby. Kabina si dochovala původní vybavení — měděný parní kotel, historická kamna, luxusní majolikové obklady a obrazy ptáků na stěnách. Dveře do lodžie zdobí původní malovaná skla z proslulé tyrolské dílny Geyling, která se na slunci rozzáří všemi barvami. Pobyt v kabině měl evokovat zahradní pavilon uprostřed přírody.',
    cabinsImperial: 'Císařská kabina nese jméno Františka Josefa I.',

    todayHeading: 'Co k Římským lázním patří dnes',
    todayLead: 'K historickému sálu přiléhá moderní wellness zázemí.',
    todayItems: ['Sauna 80 °C', 'Sanarium 50 °C', 'Parní lázeň', 'Kneippova terapie'],
    waterNote:
      'V bazénech je běžná voda, jen šetrněji chlorovaná než v běžném plaveckém bazénu. Minerální voda je vyhrazená pro vanové koupele — ty se s Římskými lázněmi krásně doplňují: nejdřív koupel jako procedura, pak odpočinek pod mramorovou klenbou.',

    galleryHeading: 'Fotogalerie',
    galleryNote: 'Klikněte pro zvětšení.',

    outpatientHeading: 'Chcete jen proceduru, ne pobyt?',
    outpatientText:
      'Vybrané procedury nabízíme i ambulantně, po objednání k lékaři přes spa recepci.',
    outpatientCta: 'Ambulantní léčení',

    photoAlt: 'Římské lázně — Ensana Nové Lázně, Mariánské Lázně',
  },

  de: {
    metaTitle: 'Römisches Bad in Marienbad — Geschichte und Besuch | Nové Lázně',
    metaDescription:
      'Das Römische Bad von 1896 im Hotel Ensana Nové Lázně: 21 Säulen aus Salzburger Marmor, die Königskabine Edwards VII. und wie Sie hineinkommen.',
    eyebrow: 'Ensana Nové Lázně · seit 1896',
    h1: 'Römisches Bad',
    heroLead:
      'Eine gläserne Decke, einundzwanzig Säulen aus dunkelrotem Marmor und vergoldete Löwenköpfe über dem Wasser. Das Römische Bad ist keine Kulisse — Sie baden in einem Denkmal, das seit 1896 ununterbrochen seinem Zweck dient.',

    accessHeading: 'So kommen Sie ins Römische Bad',
    accessLead:
      'Das Römische Bad gehört zum Fünf-Sterne-Hotel Nové Lázně und ist kein öffentliches Bad mit Tageskasse. Genau deshalb treffen Sie dort nie eine Menschenmenge an.',
    accessStayTitle: 'Der sicherste Weg — übernachten Sie',
    accessStayText:
      'Gäste der Hotels Ensana Nové Lázně und Ensana Centrální Lázně haben im Rahmen ihres Aufenthalts Zugang zum Römischen Bad. Das ist mit Abstand die bequemste und verlässlichste Art, es ohne Rücksicht auf die Kapazität zu genießen.',
    accessVisitorTitle: 'Besuch von außerhalb',
    accessVisitorText:
      'Der Eintritt ist auch für Gäste möglich, die nicht bei uns wohnen — jedoch ausschließlich nach vorheriger Reservierung und nach aktuell freier Kapazität. Vereinbaren Sie Ihren Termin vorab per E-Mail an der Spa-Rezeption.',
    accessWarning:
      'Ohne vorherige Reservierung ist der Eintritt nicht möglich. Die Kapazität richtet sich nach dem Betrieb der Kurabteilung und nach den Hausgästen und kann daher weder im Voraus garantiert noch für eine bestimmte Uhrzeit zugesagt werden.',
    accessMailLabel: 'Reservierung und Fragen',
    accessHvezda:
      'Gäste des Hotels Ensana Hvězda haben ab einem Aufenthalt von mehr als drei Nächten Zugang zum Becken im Römischen Bad.',
    accessStayNl: 'Aufenthalt im Nové Lázně',
    accessStayCl: 'Aufenthalt im Centrální Lázně',

    historyHeading: 'Was uns die Geschichte erzählt',
    historyLead:
      'Das Neubad entstand aus einer schlichten Tatsache: Die Stadt wurde ihrem eigenen Erfolg nicht mehr gerecht. Was wir heute als architektonisches Kleinod bewundern, war vor allem eine Antwort auf fehlende Kabinen.',
    timeline: [
      {
        year: '1872',
        title: 'Der erste Zug trifft ein',
        text: 'Die Eisenbahn öffnete Marienbad nach Europa, die Gästezahlen stiegen sprunghaft. Die bestehenden Kapazitäten reichten nicht mehr aus, ein großer Umbau wurde unumgänglich.',
      },
      {
        year: 'vor 1890',
        title: 'Das alte Neubad und die „Stahlbäder"',
        text: 'Der ursprüngliche Bau hatte 42 Kabinen, darunter jene für die sogenannten Stahlbäder. So nannte man im 19. Jahrhundert ein Bad in der Ambrosiusquelle — das Wasser war so eisenhaltig, dass es die Wanne rostrot färbte und den Patienten „stählerne Gesundheit" versprach.',
      },
      {
        year: '1892–1896',
        title: 'Ein Bau, der die Saison nicht stören durfte',
        text: 'Den Anstoß gab Abt Alfred Clemens: Er entschied über den Bau, sicherte die Finanzierung und gab dem Projekt eine klare Vision. Gebaut wurde vier Jahre lang und stets nur im Winter, außerhalb der Hauptsaison, damit der Kurbetrieb weiterlief. Nach Schaffers Umbau verdoppelte sich die Zahl der Kabinen.',
      },
      {
        year: '1. Juni 1896',
        title: 'Feierliche Eröffnung',
        text: 'Entworfen hat das Gebäude der in Marienbad geborene Josef Schaffer. Seine Inspiration fand er auf Reisen durch Italien — in Venedig, Bologna und Florenz; Elemente der italienischen Renaissance gaben dem Bau seinen zeitlosen Charakter. Die Initialen des Abtes A. C. und A. T. (Abbas Teplensis) sind bis heute in den Giebel gemeißelt.',
      },
    ],

    architectureHeading: 'Ein Saal, der nie außer Betrieb ging',
    architectureLead:
      'Die gläserne Decke flutet den Innenraum mit weichem Tageslicht, das sich auf den Wasserflächen spiegelt und die Monumentalität des Saales unterstreicht. Das Römische Bad zählt zu den wertvollsten und am besten erhaltenen Beispielen europäischer Kurarchitektur des späten 19. Jahrhunderts.',
    facts: [
      { label: 'Säulen', value: '21 Säulen aus dunkelrotem Salzburger Marmor' },
      { label: 'Kapitelle', value: 'Weißer Carrara-Stein' },
      { label: 'Wasserspeier', value: 'Vergoldet, in Form von Löwenköpfen' },
      { label: 'Fliesen', value: 'Farbige Majolika' },
      { label: 'Becken', value: 'Zwei originale, ein drittes mit Gegenstromanlage aus der modernen Sanierung' },
      { label: 'Licht', value: 'Gläserne Decke, Tageslicht über die gesamte Saallänge' },
    ],

    cabinsHeading: 'Die königlichen Kabinen',
    cabinsLead:
      'Das Neubad wurde rasch zum Ziel des europäischen Adels. Zum Komplex gehören zwei private Badekabinen, die bis heute der besonderen Balneotherapie dienen.',
    cabinsRoyal:
      'Die Königskabine gehörte dem britischen König Edward VII., der Marienbad insgesamt neunmal besuchte; seine Kohlensäurebäder wurden zum Symbol für das Prestige der hiesigen Behandlungen. Die Kabine hat ihre originale Ausstattung bewahrt — einen kupfernen Dampfkessel, einen historischen Ofen, luxuriöse Majolikafliesen und Vogelbilder an den Wänden. Die Türen zur Loggia zieren originale bemalte Gläser aus der berühmten Tiroler Werkstatt Geyling, die im Sonnenlicht in allen Farben schimmern. Der Aufenthalt in der Kabine sollte an einen Gartenpavillon inmitten der Natur erinnern.',
    cabinsImperial: 'Die Kaiserkabine trägt den Namen Franz Josephs I.',

    todayHeading: 'Was heute dazugehört',
    todayLead: 'An den historischen Saal schließt ein modernes Wellnessangebot an.',
    todayItems: ['Sauna 80 °C', 'Sanarium 50 °C', 'Dampfbad', 'Kneipp-Therapie'],
    waterNote:
      'In den Becken ist gewöhnliches Wasser, nur schonender gechlort als in einem normalen Schwimmbad. Das Mineralwasser bleibt den Wannenbädern vorbehalten — beides ergänzt sich wunderbar: zuerst das Bad als Anwendung, dann die Ruhe unter dem Marmorgewölbe.',

    galleryHeading: 'Fotogalerie',
    galleryNote: 'Zum Vergrößern anklicken.',

    outpatientHeading: 'Nur eine Anwendung, kein Aufenthalt?',
    outpatientText:
      'Ausgewählte Anwendungen bieten wir auch ambulant an — nach Terminvereinbarung beim Arzt über die Spa-Rezeption.',
    outpatientCta: 'Ambulante Behandlung',

    photoAlt: 'Römisches Bad — Ensana Nové Lázně, Marienbad',
  },

  en: {
    metaTitle: 'The Roman Baths in Marienbad — history and how to visit | Nové Lázně',
    metaDescription:
      'The 1896 Roman Baths at the Ensana Nové Lázně hotel: 21 Salzburg marble columns, Edward VII’s Royal Cabin, and how to get in.',
    eyebrow: 'Ensana Nové Lázně · since 1896',
    h1: 'The Roman Baths',
    heroLead:
      'A glazed ceiling, twenty-one columns of dark-red marble and gilded lion heads above the water. The Roman Baths are not a stage set — you bathe in a monument that has served its purpose without interruption since 1896.',

    accessHeading: 'How to get into the Roman Baths',
    accessLead:
      'The Roman Baths belong to the five-star Nové Lázně hotel; they are not a public pay-per-entry pool. That is precisely why you will never meet a crowd there.',
    accessStayTitle: 'The surest way — stay with us',
    accessStayText:
      'Guests of the Ensana Nové Lázně and Ensana Centrální Lázně hotels have access to the Roman Baths as part of their stay. By far the most comfortable and reliable way to enjoy them without worrying about capacity.',
    accessVisitorTitle: 'Visiting from outside',
    accessVisitorText:
      'Entry is possible for visitors not staying with us as well — but strictly by prior reservation and subject to currently available capacity. Arrange your slot in advance by e-mail with the spa reception.',
    accessWarning:
      'Without a prior reservation entry is not possible. Capacity follows the operation of the spa department and the needs of resident guests, so it cannot be guaranteed in advance or promised for a specific hour.',
    accessMailLabel: 'Reservations and enquiries',
    accessHvezda:
      'Guests of the Ensana Hvězda hotel have access to the pool in the Roman Baths with a stay of more than three nights.',
    accessStayNl: 'Stay at Nové Lázně',
    accessStayCl: 'Stay at Centrální Lázně',

    historyHeading: 'What the history tells us',
    historyLead:
      'The New Baths grew out of a plain fact: the town could no longer keep up with its own success. What we admire today as an architectural gem was, above all, an answer to a shortage of cabins.',
    timeline: [
      {
        year: '1872',
        title: 'The first train arrives',
        text: 'The railway opened Marienbad to Europe and visitor numbers surged. Existing capacities were no longer sufficient and a major reconstruction became necessary.',
      },
      {
        year: 'before 1890',
        title: 'The old New Baths and the "steel baths"',
        text: 'The original building had 42 cabins, among them those for the so-called steel baths (Stahlbäder). That was the popular 19th-century term for a bath in the Ambrose Spring — the water was so rich in iron that it stained the tub rust-red and promised patients "steely health".',
      },
      {
        year: '1892–1896',
        title: 'A build that was not allowed to disturb the season',
        text: 'The impetus came from Abbot Alfred Clemens, who decided on the construction, secured the financing and gave the project a clear vision. Construction took four years and always took place in winter, outside the main season, so as not to disrupt spa operations. After Schaffer’s alterations the number of cabins doubled.',
      },
      {
        year: '1 June 1896',
        title: 'The ceremonial opening',
        text: 'The building was designed by Marienbad-born Josef Schaffer. He found his inspiration travelling through Italy — in Venice, Bologna and Florence; elements of the Italian Renaissance gave the building its timeless character. The abbot’s initials A. C. and A. T. (Abbas Teplensis) are carved into the pediment to this day.',
      },
    ],

    architectureHeading: 'A hall that never went out of use',
    architectureLead:
      'The glazed ceiling floods the interior with soft daylight that reflects off the surfaces of the pools and underscores the monumentality of the hall. The Roman Baths rank among the most valuable and best-preserved examples of late-19th-century European spa architecture.',
    facts: [
      { label: 'Columns', value: '21 columns of dark-red Salzburg marble' },
      { label: 'Capitals', value: 'White Carrara stone' },
      { label: 'Spouts', value: 'Gilded, shaped as lion heads' },
      { label: 'Tiling', value: 'Coloured majolica' },
      { label: 'Pools', value: 'Two original, a third with a counter-current from the modern restoration' },
      { label: 'Light', value: 'Glazed ceiling, daylight along the full length of the hall' },
    ],

    cabinsHeading: 'The royal cabins',
    cabinsLead:
      'The New Baths soon became a destination for European aristocracy. The complex holds two private bathing cabins, still used today for special balneotherapy.',
    cabinsRoyal:
      'The Royal Cabin belonged to the British King Edward VII, who visited Marienbad nine times in total; his carbonic baths became a symbol of the prestige of the local treatments. The cabin has preserved its original fittings — a copper steam boiler, a historical heater, luxurious majolica tiles and paintings of birds on the walls. The doors to the loggia are adorned with original painted glass panels from the famous Tyrolean Geyling workshop, which shimmer in all colours in the sunlight. A stay in the cabin was meant to evoke a garden pavilion amidst nature.',
    cabinsImperial: 'The Imperial Cabin carries the name of Franz Joseph I.',

    todayHeading: 'What belongs to the Roman Baths today',
    todayLead: 'A modern wellness area adjoins the historical hall.',
    todayItems: ['Sauna 80 °C', 'Sanarium 50 °C', 'Steam bath', 'Kneipp therapy'],
    waterNote:
      'The pools hold ordinary water, simply more gently chlorinated than a standard swimming pool. Mineral water is reserved for the tub baths — and the two combine beautifully: first the bath as a treatment, then rest beneath the marble vault.',

    galleryHeading: 'Photo gallery',
    galleryNote: 'Click to enlarge.',

    outpatientHeading: 'Only a treatment, not a stay?',
    outpatientText:
      'Selected treatments are also available on an outpatient basis, after booking a doctor’s appointment through the spa reception.',
    outpatientCta: 'Outpatient treatment',

    photoAlt: 'The Roman Baths — Ensana Nové Lázně, Marienbad',
  },

  ru: {
    metaTitle: 'Римские бани в Марианских Лазнях — история и посещение | Nové Lázně',
    metaDescription:
      'Римские бани 1896 года в отеле Ensana Nové Lázně: 21 колонна из зальцбургского мрамора, королевская кабина Эдуарда VII и как туда попасть.',
    eyebrow: 'Ensana Nové Lázně · с 1896 года',
    h1: 'Римские бани',
    heroLead:
      'Стеклянный потолок, двадцать одна колонна из тёмно-красного мрамора и позолоченные львиные головы над водой. Римские бани — не декорация: вы купаетесь в памятнике, который служит своему назначению непрерывно с 1896 года.',

    accessHeading: 'Как попасть в Римские бани',
    accessLead:
      'Римские бани — часть пятизвёздочного отеля Nové Lázně, а не общественный бассейн с продажей билетов. Именно поэтому здесь никогда не бывает толпы.',
    accessStayTitle: 'Самый надёжный путь — остановиться у нас',
    accessStayText:
      'Гости отелей Ensana Nové Lázně и Ensana Centrální Lázně получают доступ в Римские бани в рамках проживания. Это самый удобный и надёжный способ насладиться ими, не оглядываясь на загруженность.',
    accessVisitorTitle: 'Посещение со стороны',
    accessVisitorText:
      'Вход возможен и для гостей, которые не проживают у нас, — но исключительно по предварительному бронированию и при наличии свободных мест. Время согласуйте заранее по электронной почте со спа-ресепшн.',
    accessWarning:
      'Без предварительного бронирования вход невозможен. Загруженность зависит от работы курортного отделения и от гостей отеля, поэтому её нельзя гарантировать заранее или обещать на конкретный час.',
    accessMailLabel: 'Бронирование и вопросы',
    accessHvezda:
      'Гости отеля Ensana Hvězda получают доступ в бассейн Римских бань при проживании более трёх ночей.',
    accessStayNl: 'Проживание в Nové Lázně',
    accessStayCl: 'Проживание в Centrální Lázně',

    historyHeading: 'Что рассказывает история',
    historyLead:
      'Новые купальни выросли из простого факта: город перестал справляться с собственным успехом. То, чем мы сегодня любуемся как архитектурной жемчужиной, было прежде всего ответом на нехватку кабин.',
    timeline: [
      {
        year: '1872',
        title: 'Приходит первый поезд',
        text: 'Железная дорога открыла Марианские Лазне Европе, и число гостей резко выросло. Прежних мощностей стало не хватать, крупная перестройка сделалась необходимостью.',
      },
      {
        year: 'до 1890',
        title: 'Старые Новые купальни и «стальные ванны»',
        text: 'В первоначальном здании было 42 кабины, среди них и кабины для так называемых стальных ванн (Stahlbäder). Так в XIX веке называли ванну из источника Амброжа — вода была настолько богата железом, что окрашивала ванну в ржавый цвет и обещала пациентам «стальное здоровье».',
      },
      {
        year: '1892–1896',
        title: 'Стройка, которой нельзя было мешать сезону',
        text: 'Инициатива исходила от аббата Альфреда Клеменса: он принял решение о строительстве, обеспечил финансирование и задал проекту ясное видение. Строили четыре года и всегда только зимой, вне основного сезона, чтобы курортная работа не останавливалась. После перестройки Шаффера число кабин удвоилось.',
      },
      {
        year: '1 июня 1896',
        title: 'Торжественное открытие',
        text: 'Здание спроектировал уроженец Марианских Лазней Йозеф Шаффер. Вдохновение он нашёл в путешествиях по Италии — в Венеции, Болонье и Флоренции; элементы итальянского Ренессанса придали зданию вневременной характер. Инициалы аббата A. C. и A. T. (Abbas Teplensis) до сих пор высечены на фронтоне.',
      },
    ],

    architectureHeading: 'Зал, который не переставал работать',
    architectureLead:
      'Стеклянный потолок заливает интерьер мягким дневным светом, который отражается от поверхности бассейнов и подчёркивает монументальность зала. Римские бани принадлежат к самым ценным и лучше всего сохранившимся образцам европейской курортной архитектуры конца XIX века.',
    facts: [
      { label: 'Колонны', value: '21 колонна из тёмно-красного зальцбургского мрамора' },
      { label: 'Капители', value: 'Белый каррарский камень' },
      { label: 'Водостоки', value: 'Позолоченные, в форме львиных голов' },
      { label: 'Облицовка', value: 'Цветная майолика' },
      { label: 'Бассейны', value: 'Два исторических, третий с противотоком из современной реконструкции' },
      { label: 'Свет', value: 'Стеклянный потолок, дневной свет по всей длине зала' },
    ],

    cabinsHeading: 'Королевские кабины',
    cabinsLead:
      'Новые купальни быстро стали целью европейской аристократии. В составе комплекса — две частные банные кабины, которые и сегодня служат особой бальнеотерапии.',
    cabinsRoyal:
      'Королевская кабина принадлежала британскому королю Эдуарду VII, посетившему Марианские Лазне в общей сложности девять раз; его углекислые ванны стали символом престижа местного лечения. Кабина сохранила первоначальное оснащение — медный паровой котёл, историческую печь, роскошную майоликовую облицовку и картины с птицами на стенах. Двери в лоджию украшены оригинальными расписными стёклами знаменитой тирольской мастерской Geyling, которые на солнце переливаются всеми цветами. Пребывание в кабине должно было напоминать садовый павильон посреди природы.',
    cabinsImperial: 'Императорская кабина носит имя Франца Иосифа I.',

    todayHeading: 'Что относится к Римским баням сегодня',
    todayLead: 'К историческому залу примыкает современная велнес-зона.',
    todayItems: ['Сауна 80 °C', 'Санариум 50 °C', 'Паровая баня', 'Терапия Кнейпа'],
    waterNote:
      'В бассейнах обычная вода, только хлорируется мягче, чем в обычном плавательном бассейне. Минеральная вода остаётся для ванн — и одно прекрасно дополняет другое: сначала ванна как процедура, затем отдых под мраморным сводом.',

    galleryHeading: 'Фотогалерея',
    galleryNote: 'Нажмите, чтобы увеличить.',

    outpatientHeading: 'Нужна только процедура, а не проживание?',
    outpatientText:
      'Отдельные процедуры мы предлагаем и амбулаторно — после записи к врачу через спа-ресепшн.',
    outpatientCta: 'Амбулаторное лечение',

    photoAlt: 'Римские бани — Ensana Nové Lázně, Марианские Лазне',
  },
}
