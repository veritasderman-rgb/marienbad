import type { Locale } from '@/i18n/config'
import { hotels } from '@/data/hotels'

/**
 * Obsah svatební landing page ve všech čtyřech jazycích.
 *
 * Texty drží tenhle soubor, ne komponenta — copy ve čtyřech jazycích by
 * z WeddingsPage.astro udělalo osmisetřádkové monstrum (vzorem je dvojice
 * ensanaLifeContent.ts + EnsanaLifePage.astro).
 *
 * Fakta o sálech pocházejí ze svatebního katalogu Ensana (docs/weddings/
 * ZADANI-svatby.md, §4). Kolonáda i Zpívající fontána stojí na pozemku
 * provozovatele, takže se obřad i mimořádná skladba domlouvají přímo — §D
 * zadání to uváděl jako neověřené, potvrzeno zadavatelem 27. 8. 2026.
 */

export interface WeddingVenue {
  key: string
  /** Soubor v /images/library/wedding/ bez přípony. */
  photo: string
  name: string
  line: string
  capacity: string
  setting: string
  season: string
  linkLabel: string
  /** Doplní komponenta podle jazyka — viz venueLinks. */
  linkHref?: string
}

export interface WeddingHall {
  name: string
  banquet: string
  reception: string
  character: string
}

export interface WeddingAct {
  key: string
  photo: string
  title: string
  items: string[]
  highlight?: boolean
}

export interface WeddingFaq {
  q: string
  a: string
}

export interface WeddingsContent {
  metaTitle: string
  metaDescription: string
  breadcrumb: string
  hero: {
    eyebrow: string
    heading: string
    lead: string
    ctaPrimary: string
    ctaSecondary: string
  }
  facts: { value: string; label: string; note: string }[]
  venues: {
    eyebrow: string
    heading: string
    lead: string
    items: WeddingVenue[]
    bandAlt: string
    capacityLabel: string
    settingLabel: string
    seasonLabel: string
  }
  halls: {
    heading: string
    lead: string
    colName: string
    colBanquet: string
    colReception: string
    colCharacter: string
    rows: WeddingHall[]
    note: string
  }
  acts: { eyebrow: string; heading: string; lead: string; items: WeddingAct[] }
  draws: {
    heading: string
    lead: string
    items: { title: string; body: string; linkLabel: string }[]
  }
  gallery: { heading: string; lead: string; photos: { photo: string; alt: string }[] }
  guests: {
    heading: string
    lead: string
    bullets: string[]
    cardTitle: string
    linkAccommodation: string
    linkTrips: string
  }
  when: { heading: string; p1: string; p2: string; linkLabel: string; alt: string }
  faq: { heading: string; lead: string; items: WeddingFaq[] }
  finalCta: {
    heading: string
    body: string
    cta: string
    ensanaLabel: string
    alt: string
  }
  related: { heading: string; items: { title: string; note: string }[] }
  /** Alt texty fotek, které nemají vlastní pole. Zdroj: docs/weddings/IMAGE-MANIFEST.md */
  alts: Record<string, string>
}

/**
 * Odkaz na Ensana Nové Lázně s UTM. Základ se bere z hotels.ts, kde jsou
 * lokalizované adresy udržované na jednom místě — cesty se mezi jazyky liší
 * (`/cs/hotely/`, `/de/hotels/`, `/ru/oteli/`) a natvrdo zapsaná anglická
 * by české, německé i ruské návštěvníky posílala na cizojazyčný web.
 */
const NOVE_LAZNE = hotels.find((h) => h.slug === 'nove-lazne')!

export function ensanaWeddingUrl(locale: Locale): string {
  return `${NOVE_LAZNE.bookingUrls[locale]}?utm_source=marienbad&utm_medium=landing&utm_campaign=wedding`
}

/** Kontakt pro poptávku — stejná adresa jako u ostatních konverzních stránek. */
export const WEDDING_MAIL = 'info@marienbad.com'

/**
 * Cíle odkazů u jednotlivých míst. Kde jazyková mutace článku chybí,
 * degraduje se na nejbližší pilířovou stránku v témže jazyce — nikdy se
 * neodkazuje do cizího jazyka (zadání §12).
 *
 * Chybí: článek o Zpívající fontáně v DE, historie kolonády v RU.
 */
export const venueLinks: Record<Locale, Record<string, string>> = {
  cs: {
    colonnade: '/cs/magazin/historie-kolonady',
    fountain: '/cs/magazin/zpivajici-fontana',
    park: '/cs/priroda',
    casino: '#saly',
    outdoor: '/cs/co-delat',
  },
  de: {
    colonnade: '/de/magazin/geschichte-der-kolonnade',
    fountain: '/de/kolonnade',
    park: '/de/natur',
    casino: '#saly',
    outdoor: '/de/aktivitaeten',
  },
  en: {
    colonnade: '/en/magazine/history-of-the-colonnade',
    fountain: '/en/magazine/singing-fountain',
    park: '/en/nature',
    casino: '#saly',
    outdoor: '/en/things-to-do',
  },
  ru: {
    colonnade: '/ru/kolonnada',
    fountain: '/ru/zhurnal/poyushchij-fontan',
    park: '/ru/priroda',
    casino: '#saly',
    outdoor: '/ru/chem-zanyatsya',
  },
}

/** Odkazy na související čtení — stejné pravidlo degradace jako výše. */
export const relatedLinks: Record<Locale, string[]> = {
  cs: ['/cs/magazin/svatba-v-laznich', '/cs/magazin/historie-kolonady', '/cs/magazin/zpivajici-fontana'],
  de: ['/de/magazin/hochzeit-in-marienbad', '/de/magazin/geschichte-der-kolonnade', '/de/kolonnade'],
  en: ['/en/magazine/wedding-in-marienbad', '/en/magazine/history-of-the-colonnade', '/en/magazine/singing-fountain'],
  ru: ['/ru/zhurnal/svadba-v-marianskikh-laznyakh', '/ru/kolonnada', '/ru/zhurnal/poyushchij-fontan'],
}

const cs: WeddingsContent = {
  metaTitle: 'Svatba v Mariánských Lázních — místa, sály a termíny',
  metaDescription:
    'Obřad na kolonádě, hostina pod křišťálovými lustry a sedm hotelů pěšky. Místa, kapacity sálů a odpovědi na nejčastější otázky svatebčanů.',
  breadcrumb: 'Svatba',
  hero: {
    eyebrow: 'Svatba v Mariánských Lázních',
    heading: 'Svatba v Mariánských Lázních',
    lead: 'Litinová kolonáda, zpívající fontána, sály pod křišťálovými lustry a sedm hotelů v docházkové vzdálenosti. Celý váš den se odehraje na ploše, kterou přejdete pěšky za deset minut.',
    ctaPrimary: 'Nezávazně poptat termín',
    ctaSecondary: 'Prohlédnout místa',
  },
  facts: [
    { value: '120 m', label: 'litinové kolonády', note: 'z roku 1889' },
    { value: '5', label: 'historických sálů', note: 'Společenský dům Casino' },
    { value: '50–450', label: 'hostů', note: 'podle sálu a uspořádání' },
    { value: '10 min', label: 'pěšky', note: 'obřad → hostina → postel' },
  ],
  venues: {
    eyebrow: 'Místa',
    heading: 'Kde si řeknete ano',
    lead: 'Pět míst v docházkové vzdálenosti od sebe. Dvě pod střechou, tři pod širým nebem — a mezi tím parky, ve kterých se fotí cestou.',
    capacityLabel: 'Kapacita',
    settingLabel: 'Prostředí',
    seasonLabel: 'Nejlepší období',
    bandAlt: 'Mramorový sál Společenského domu připravený na svatební hostinu',
    items: [
      {
        key: 'colonnade',
        photo: 'main-colonnade-arcade-wide',
        name: 'Hlavní kolonáda',
        line: 'Sto dvacet metrů litinové krajky z roku 1889, malovaný strop a světlo, které mezi sloupy padá v pruzích. Nejfotografovanější místo ve městě — a ráno, než přijdou lázeňští hosté, také nejtišší.',
        capacity: 'podle uspořádání obřadu',
        setting: 'kryté, ale otevřené do parku',
        season: 'květen–září',
        linkLabel: 'Historie kolonády',
      },
      {
        key: 'fountain',
        photo: 'cross-spring-pavilion-bouquet',
        name: 'Zpívající fontána',
        line: 'Kruhová fontána před kolonádou hraje každou lichou hodinu. Po setmění k hudbě přibude nasvícení a z prostranství se stane hlediště — což je zážitek, který se dá naplánovat na přesný čas.',
        capacity: 'volné prostranství',
        setting: 'venku',
        season: 'duben–říjen',
        linkLabel: 'O Zpívající fontáně',
      },
      {
        key: 'park',
        photo: 'cross-spring-pavilion-couple-walking',
        name: 'Pavilon Křížového pramene a lázeňský park',
        line: 'Bílý pavilon s měděnou kupolí, trávník před ním a les hned za ním. Místo pro komorní obřad, po kterém se jde do hostiny pěšky přes park.',
        capacity: 'komorní obřad',
        setting: 'venku',
        season: 'květen–červen, září',
        linkLabel: 'Lázeňské parky a příroda',
      },
      {
        key: 'casino',
        photo: 'casino-marble-hall-tables',
        name: 'Společenský dům Casino — Mramorový sál',
        line: 'Freskový strop, křišťálové lustry a parkety, po kterých se tančí od roku 1900. Největší z historických sálů ve městě a jediný, kam se vejde svatba, kterou nemusíte krátit.',
        capacity: 'až 300 na banket, 450 na recepci',
        setting: 'uvnitř',
        season: 'celoročně',
        linkLabel: 'Přehled sálů',
      },
      {
        key: 'outdoor',
        photo: 'outdoor-ceremony-first-kiss',
        name: 'Obřad pod širým nebem',
        line: 'Když chcete obřad mimo město: louka, altán nebo okraj lesa ve Slavkovském lese, patnáct minut autem. Hosté si sednou do trávy a nad hlavami mají jen stromy.',
        capacity: 'podle místa',
        setting: 'venku',
        season: 'červen–září',
        linkLabel: 'Co dělat v okolí',
      },
    ],
  },
  halls: {
    heading: 'Sály Společenského domu',
    lead: 'Pět historických sálů pod jednou střechou. Banket znamená sezení u stolů, recepce stání s rautem — u téhož sálu se čísla liší skoro dvojnásobně.',
    colName: 'Sál',
    colBanquet: 'Banket',
    colReception: 'Recepce',
    colCharacter: 'Charakter',
    rows: [
      { name: 'Mramorový sál', banquet: '300', reception: '450', character: 'freskový strop, křišťálové lustry, parket' },
      { name: 'Zrcadlový sál', banquet: '100', reception: '180', character: 'zrcadlové stěny, komorní měřítko' },
      { name: 'Červený salonek', banquet: '130', reception: '180', character: 'teplé barvy, vhodný na hostinu' },
      { name: 'Růžový salonek s Galerií', banquet: '140', reception: '190', character: 'dva propojené prostory, dobré na raut' },
      { name: 'Edwardova knihovna', banquet: '50', reception: '50', character: 'knihovna, nejintimnější z pěti' },
    ],
    note: 'Čísla jsou ze svatebního katalogu Ensana. Konkrétní uspořádání, parket a místo pro kapelu potvrdí sál při rezervaci.',
  },
  acts: {
    eyebrow: 'Průběh',
    heading: 'Den ve třech aktech',
    lead: 'Svatba v lázních má tu výhodu, že hosté nikam nejezdí. Přijedou den předem a odjedou den po — a mezi tím se nemusí ani jednou sedat do auta.',
    items: [
      {
        key: 'eve',
        photo: 'banquet-chair-gold-sash',
        title: 'Předvečer',
        items: [
          'Příjezd hostů a ubytování v jednom ze sedmi hotelů',
          'Wellness pro nevěstu a družičky — minerální koupel nebo masáž',
          'Společná večeře v užším kruhu',
        ],
      },
      {
        key: 'day',
        photo: 'floral-arch-toast',
        title: 'Den D',
        highlight: true,
        items: [
          'Obřad na kolonádě, u pavilonu nebo v sále',
          'Vyjížďka kočárem parkem kolem pramenů',
          'Přípitek pod květinovým obloukem',
          'Hostina a první tanec na parketu Mramorového sálu',
        ],
      },
      {
        key: 'after',
        photo: 'couple-portrait-bouquet',
        title: 'Ráno po',
        items: [
          'Snídaně bez spěchu, hosté odjíždějí postupně',
          'Procházka ke kolonádě a pitná kúra na kocovinu',
          'Lázeňské líbánky — pár dní navíc ve stejném hotelu',
        ],
      },
    ],
  },
  draws: {
    heading: 'Dva tahy, které jinde nedostanete',
    lead: 'Věci, které nejsou na seznamu služeb, ale pamatují si je hosté.',
    items: [
      {
        title: 'Zpívající fontána na přání',
        body: 'Fontána hraje každou lichou hodinu z pevného repertoáru. Mimořádnou skladbu ve zvolený čas — a večer i s nasvícením — zajistíme: fontána stojí na našem pozemku, takže se to řeší přímo s námi, ne přes třetí stranu.',
        linkLabel: 'O Zpívající fontáně',
      },
      {
        title: 'Vyjížďka kočárem',
        body: 'Historický kočár od obřadu k hostině: lázeňským parkem kolem pramenů a podél kolonády. Trasa se dá zkrátit i protáhnout podle toho, kolik času mezi obřadem a hostinou zbývá.',
        linkLabel: 'Napsat nám',
      },
    ],
  },
  gallery: {
    heading: 'Detaily',
    lead: 'Prostírání, květiny, prsteny — věci, které na fotkách zůstanou i po letech.',
    photos: [
      { photo: 'banquet-place-setting-detail', alt: 'Detail prostírání se jmenovkou na svatební tabuli' },
      { photo: 'cross-spring-pavilion-couple', alt: 'Nevěsta a ženich u bílé kolonády Křížového pramene' },
      { photo: 'casino-hall-floral-centrepiece', alt: 'Vysoká květinová dekorace na svatební tabuli v historickém sále' },
      { photo: 'main-colonnade-fresco-portrait', alt: 'Portrét svatebního páru před freskou Hlavní kolonády' },
    ],
  },
  guests: {
    heading: 'Pro hosty',
    lead: 'Většina starostí kolem svatby je logistika. Tady jí ubývá tím, že je všechno vedle sebe.',
    bullets: [
      'Sedm lázeňských hotelů v docházkové vzdálenosti — od pětihvězdičkových po komfortní',
      'Wellness a bazény pro hosty, kteří přijedou dřív',
      'Program mezi obřadem a hostinou: kolonáda, parky, prameny',
      'Parkování u hotelů, obřadní místa pěšky',
      'Bezbariérový přístup do většiny sálů i na kolonádu',
    ],
    cardTitle: 'Kam dál',
    linkAccommodation: 'Kde budou spát hosté',
    linkTrips: 'Co s hosty den před a den po',
  },
  when: {
    heading: 'Kdy',
    p1: 'Květen a červen jsou tady nejzelenější — park rozkvete dřív, než začne hlavní sezóna, a fotky u pavilonu mají to světlo, kvůli kterému se sem fotografové vracejí. Září přinese barvy a teplé večery bez horka.',
    p2: 'Zimní svatba je jiný žánr: obřad i hostina se přesunou dovnitř, do sálů pod lustry, a kolonáda za oknem je zasněžená. Termínů je víc a ceny nižší.',
    linkLabel: 'Nejlepší čas návštěvy',
    alt: 'Nevěsta s dlouhým závojem u kolonády v Mariánských Lázních',
  },
  faq: {
    heading: 'Časté otázky',
    lead: 'Odpovědi na to, co se svatebčané ptají nejčastěji.',
    items: [
      {
        q: 'Jak dlouho dopředu rezervovat?',
        a: 'Na sobotu v květnu, červnu nebo září počítejte s rokem dopředu — to jsou nejžádanější termíny a Mramorový sál bývá obsazený nejdřív. Všední dny a zimní měsíce se dají domluvit i tři až čtyři měsíce předem. Ubytování pro hosty rezervujte současně se sálem, ne až potom.',
      },
      {
        q: 'Kolik hostů se vejde?',
        a: 'Od padesáti v Edwardově knihovně po tři sta na banketu v Mramorovém sále, případně čtyři sta padesát, pokud jde o stojící recepci. Přesná čísla u jednotlivých sálů najdete v tabulce výš — a počítejte s tím, že parket a místo pro kapelu kapacitu sníží.',
      },
      {
        q: 'Jde obřad na kolonádě?',
        a: 'Ano. Kolonáda stojí na našem pozemku, takže obřad na ní domlouváte přímo s námi — není potřeba shánět povolení jinde. Řešit se musí hlavně čas: přes den tudy procházejí lázeňští hosté, takže se obřad plánuje na ranní nebo podvečerní hodinu, kdy je promenáda klidná. Napište nám termín a domluvíme okno.',
      },
      {
        q: 'Kdo vyřídí matriku?',
        a: 'Matriční úřad v Mariánských Lázních. Doklady a lhůty se liší podle toho, jestli je někdo ze snoubenců cizinec — u cizinců je potřeba vysvědčení o právní způsobilosti k uzavření manželství a úřední překlad. Na svatbu ze zahraničí si na papírování nechte měsíce dva.',
      },
      {
        q: 'Můžeme mít civilní i církevní obřad?',
        a: 'Ano, obojí. Civilní obřad zajišťuje matrika a lze ho mít i mimo obřadní síň. Církevní obřad je věcí konkrétní farnosti — kde a za jakých podmínek se ve městě oddává, si ověřte přímo u ní, protože se to liší kostel od kostela.',
      },
      {
        q: 'Co když prší?',
        a: 'To je hlavní důvod, proč se venkovní obřad plánuje se záložním sálem. Sály Společenského domu i hotelové prostory se dají držet jako rezerva a rozhodnout se ráno v den obřadu. Květinovou výzdobu se vyplatí navrhnout tak, aby se dala přenést dovnitř.',
      },
      {
        q: 'Ubytujeme hosty na jednom místě?',
        a: 'Většinou ano. Sedm lázeňských hotelů stojí v docházkové vzdálenosti a větší svatby se běžně dělí mezi dva sousední domy — hosté to poznají jen podle toho, kterými dveřmi jdou spát. Blok pokojů rezervujte současně se sálem.',
      },
      {
        q: 'Dá se domluvit Zpívající fontána?',
        a: 'Ano. Fontána hraje z pevného repertoáru každou lichou hodinu a poslouchat ji může kdokoli zdarma. Mimořádnou skladbu v konkrétní čas zajistíme — fontána je na našem pozemku, takže se to domlouvá přímo s námi. Napište nám, kdy má váš obřad končit, a čas nastavíme podle toho.',
      },
    ],
  },
  finalCta: {
    heading: 'Řekněte nám o svém dni',
    body: 'Napište nám termín, počet hostů a jestli chcete obřad venku, nebo pod střechou. Ozveme se s tím, co je na daný den volné, kolik to bude stát a co je potřeba zařídit dřív než ostatní. Poptávka je nezávazná a rezervace termínu i pokojů je u nás zdarma.',
    cta: 'Napsat nám',
    ensanaLabel: 'Ubytování Ensana',
    alt: 'Novomanželé na schodech pod freskou na konci Hlavní kolonády',
  },
  related: {
    heading: 'Související čtení',
    items: [
      { title: 'Svatba v lázních', note: 'Jak ji naplánovat krok za krokem' },
      { title: 'Historie kolonády', note: 'Proč vypadá tak, jak vypadá' },
      { title: 'Zpívající fontána', note: 'Repertoár, časy a jak vznikla' },
    ],
  },
  alts: {
    hero: 'Novomanželé tančí pod klenbou Hlavní kolonády v Mariánských Lázních',
    colonnade: 'Pohled do arkády Hlavní kolonády se svatebním párem uprostřed',
    fountain: 'Svatební pár se svatební kyticí před sloupovím kolonády',
    park: 'Svatební pár před pavilonem Křížového pramene v lázeňském parku',
    casino: 'Svatební tabule v historickém sále s freskovým stropem',
    outdoor: 'První polibek novomanželů při obřadu pod širým nebem',
    eve: 'Detail potahu židle se zlatou mašlí ve svatebním sále',
    day: 'Novomanželé s přípitkem pod květinovým obloukem',
    after: 'Portrét novomanželů se svatební kyticí z bílých růží',
  },
}

const de: WeddingsContent = {
  metaTitle: 'Hochzeit in Marienbad — Orte, Säle und Termine',
  metaDescription:
    'Trauung an der Kolonnade, Bankett unter Kristalllüstern, sieben Hotels in Gehweite. Orte, Saalkapazitäten und die häufigsten Fragen von Brautpaaren.',
  breadcrumb: 'Hochzeit',
  hero: {
    eyebrow: 'Hochzeit in Marienbad',
    heading: 'Hochzeit in Marienbad',
    lead: 'Gusseiserne Kolonnade, singende Fontäne, Säle unter Kristalllüstern und sieben Hotels in Gehweite. Ihr ganzer Tag spielt sich auf einer Fläche ab, die Sie in zehn Minuten zu Fuß durchqueren.',
    ctaPrimary: 'Unverbindlich anfragen',
    ctaSecondary: 'Orte ansehen',
  },
  facts: [
    { value: '120 m', label: 'gusseiserne Kolonnade', note: 'von 1889' },
    { value: '5', label: 'historische Säle', note: 'Gesellschaftshaus Casino' },
    { value: '50–450', label: 'Gäste', note: 'je nach Saal und Bestuhlung' },
    { value: '10 Min.', label: 'zu Fuß', note: 'Trauung → Bankett → Bett' },
  ],
  venues: {
    eyebrow: 'Orte',
    heading: 'Wo Sie Ja sagen',
    lead: 'Fünf Orte in Gehweite voneinander. Zwei unter Dach, drei unter freiem Himmel — und dazwischen Parks, in denen unterwegs fotografiert wird.',
    capacityLabel: 'Kapazität',
    settingLabel: 'Umgebung',
    seasonLabel: 'Beste Zeit',
    bandAlt: 'Der Marmorsaal des Gesellschaftshauses, eingedeckt für das Hochzeitsbankett',
    items: [
      {
        key: 'colonnade',
        photo: 'main-colonnade-arcade-wide',
        name: 'Hauptkolonnade',
        line: 'Hundertzwanzig Meter gusseiserne Spitze von 1889, eine bemalte Decke und Licht, das zwischen den Säulen in Streifen einfällt. Der meistfotografierte Ort der Stadt — und morgens, bevor die Kurgäste kommen, auch der stillste.',
        capacity: 'je nach Aufbau der Trauung',
        setting: 'überdacht, zum Park hin offen',
        season: 'Mai–September',
        linkLabel: 'Geschichte der Kolonnade',
      },
      {
        key: 'fountain',
        photo: 'cross-spring-pavilion-bouquet',
        name: 'Singende Fontäne',
        line: 'Die runde Fontäne vor der Kolonnade spielt zu jeder ungeraden Stunde. Nach Einbruch der Dunkelheit kommt Licht dazu, und aus dem Platz wird ein Zuschauerraum — ein Moment, den man auf die Minute planen kann.',
        capacity: 'freier Platz',
        setting: 'im Freien',
        season: 'April–Oktober',
        linkLabel: 'Zur Kolonnade',
      },
      {
        key: 'park',
        photo: 'cross-spring-pavilion-couple-walking',
        name: 'Kreuzquellen-Pavillon und Kurpark',
        line: 'Ein weißer Pavillon mit Kupferkuppel, davor Rasen, dahinter gleich der Wald. Ein Ort für die kleine Trauung, nach der man zu Fuß durch den Park zum Bankett geht.',
        capacity: 'kleine Trauung',
        setting: 'im Freien',
        season: 'Mai–Juni, September',
        linkLabel: 'Kurparks und Natur',
      },
      {
        key: 'casino',
        photo: 'casino-marble-hall-tables',
        name: 'Gesellschaftshaus Casino — Marmorsaal',
        line: 'Freskendecke, Kristalllüster und ein Parkett, auf dem seit 1900 getanzt wird. Der größte historische Saal der Stadt und der einzige, in den eine Hochzeit passt, die man nicht kürzen muss.',
        capacity: 'bis 300 Bankett, 450 Empfang',
        setting: 'drinnen',
        season: 'ganzjährig',
        linkLabel: 'Übersicht der Säle',
      },
      {
        key: 'outdoor',
        photo: 'outdoor-ceremony-first-kiss',
        name: 'Trauung unter freiem Himmel',
        line: 'Wenn die Trauung außerhalb der Stadt sein soll: Wiese, Pavillon oder Waldrand im Kaiserwald, eine Viertelstunde mit dem Auto. Die Gäste sitzen im Gras und über ihnen sind nur Bäume.',
        capacity: 'je nach Ort',
        setting: 'im Freien',
        season: 'Juni–September',
        linkLabel: 'Aktivitäten in der Umgebung',
      },
    ],
  },
  halls: {
    heading: 'Die Säle des Gesellschaftshauses',
    lead: 'Fünf historische Säle unter einem Dach. Bankett heißt Sitzen an Tischen, Empfang stehendes Buffet — beim selben Saal unterscheiden sich die Zahlen fast um das Doppelte.',
    colName: 'Saal',
    colBanquet: 'Bankett',
    colReception: 'Empfang',
    colCharacter: 'Charakter',
    rows: [
      { name: 'Marmorsaal', banquet: '300', reception: '450', character: 'Freskendecke, Kristalllüster, Parkett' },
      { name: 'Spiegelsaal', banquet: '100', reception: '180', character: 'Spiegelwände, kammermusikalisches Maß' },
      { name: 'Roter Salon', banquet: '130', reception: '180', character: 'warme Farben, gut fürs Bankett' },
      { name: 'Rosa Salon mit Galerie', banquet: '140', reception: '190', character: 'zwei verbundene Räume, gut fürs Buffet' },
      { name: 'Edward-Bibliothek', banquet: '50', reception: '50', character: 'Bibliothek, der intimste der fünf' },
    ],
    note: 'Die Zahlen stammen aus dem Hochzeitskatalog von Ensana. Die konkrete Bestuhlung, Tanzfläche und der Platz für die Band werden bei der Reservierung bestätigt.',
  },
  acts: {
    eyebrow: 'Ablauf',
    heading: 'Der Tag in drei Akten',
    lead: 'Eine Hochzeit im Kurort hat den Vorteil, dass die Gäste nirgendwohin fahren. Sie kommen einen Tag vorher und reisen einen Tag später ab — und dazwischen müssen sie sich kein einziges Mal ins Auto setzen.',
    items: [
      {
        key: 'eve',
        photo: 'banquet-chair-gold-sash',
        title: 'Der Vorabend',
        items: [
          'Ankunft der Gäste, Unterkunft in einem der sieben Hotels',
          'Wellness für Braut und Brautjungfern — Mineralbad oder Massage',
          'Gemeinsames Abendessen im kleinen Kreis',
        ],
      },
      {
        key: 'day',
        photo: 'floral-arch-toast',
        title: 'Der Tag',
        highlight: true,
        items: [
          'Trauung an der Kolonnade, am Pavillon oder im Saal',
          'Kutschfahrt durch den Kurpark an den Quellen vorbei',
          'Anstoßen unter dem Blumenbogen',
          'Bankett und der erste Tanz auf dem Parkett des Marmorsaals',
        ],
      },
      {
        key: 'after',
        photo: 'couple-portrait-bouquet',
        title: 'Der Morgen danach',
        items: [
          'Frühstück ohne Eile, die Gäste reisen nach und nach ab',
          'Spaziergang zur Kolonnade und Trinkkur gegen den Kater',
          'Kur-Flitterwochen — ein paar Tage länger im selben Hotel',
        ],
      },
    ],
  },
  draws: {
    heading: 'Zwei Dinge, die es anderswo nicht gibt',
    lead: 'Was nicht auf der Leistungsliste steht, aber den Gästen im Gedächtnis bleibt.',
    items: [
      {
        title: 'Die Singende Fontäne auf Wunsch',
        body: 'Die Fontäne spielt zu jeder ungeraden Stunde ein festes Repertoire. Ein Sonderstück zur gewünschten Zeit — abends auch beleuchtet — richten wir ein: Die Fontäne steht auf unserem Grund, das klären Sie also direkt mit uns und nicht über Dritte.',
        linkLabel: 'Zur Kolonnade',
      },
      {
        title: 'Die Kutschfahrt',
        body: 'Eine historische Kutsche von der Trauung zum Bankett: durch den Kurpark, an den Quellen und der Kolonnade entlang. Die Strecke lässt sich kürzen oder verlängern, je nachdem wie viel Zeit zwischen Trauung und Bankett bleibt.',
        linkLabel: 'Schreiben Sie uns',
      },
    ],
  },
  gallery: {
    heading: 'Details',
    lead: 'Gedeck, Blumen, Ringe — die Dinge, die auf den Bildern auch nach Jahren bleiben.',
    photos: [
      { photo: 'banquet-place-setting-detail', alt: 'Detail des Gedecks mit Namenskarte auf der Hochzeitstafel' },
      { photo: 'cross-spring-pavilion-couple', alt: 'Braut und Bräutigam an der weißen Kolonnade der Kreuzquelle' },
      { photo: 'casino-hall-floral-centrepiece', alt: 'Hohe Blumendekoration auf der Hochzeitstafel im historischen Saal' },
      { photo: 'main-colonnade-fresco-portrait', alt: 'Porträt des Brautpaars vor dem Fresko der Hauptkolonnade' },
    ],
  },
  guests: {
    heading: 'Für die Gäste',
    lead: 'Das meiste Kopfzerbrechen bei einer Hochzeit ist Logistik. Hier wird sie kleiner, weil alles nebeneinander liegt.',
    bullets: [
      'Sieben Kurhotels in Gehweite — vom Fünf-Sterne-Haus bis zum komfortablen Kurhaus',
      'Wellness und Pools für Gäste, die früher anreisen',
      'Programm zwischen Trauung und Bankett: Kolonnade, Parks, Quellen',
      'Parkplätze an den Hotels, die Trauungsorte zu Fuß erreichbar',
      'Barrierefreier Zugang zu den meisten Sälen und zur Kolonnade',
    ],
    cardTitle: 'Weiterlesen',
    linkAccommodation: 'Wo die Gäste schlafen',
    linkTrips: 'Was mit den Gästen davor und danach',
  },
  when: {
    heading: 'Wann',
    p1: 'Mai und Juni sind hier am grünsten — der Park blüht auf, bevor die Hauptsaison beginnt, und die Bilder am Pavillon bekommen jenes Licht, wegen dem Fotografen wiederkommen. Der September bringt Farben und warme Abende ohne Hitze.',
    p2: 'Eine Winterhochzeit ist ein anderes Genre: Trauung und Bankett ziehen nach drinnen, in die Säle unter die Lüster, und die Kolonnade vor dem Fenster liegt im Schnee. Es gibt mehr freie Termine und niedrigere Preise.',
    linkLabel: 'Beste Reisezeit',
    alt: 'Braut mit langem Schleier an der Kolonnade in Marienbad',
  },
  faq: {
    heading: 'Häufige Fragen',
    lead: 'Antworten auf das, was Brautpaare am häufigsten fragen.',
    items: [
      {
        q: 'Wie lange im Voraus reservieren?',
        a: 'Für einen Samstag im Mai, Juni oder September rechnen Sie mit einem Jahr Vorlauf — das sind die gefragtesten Termine, und der Marmorsaal ist zuerst vergeben. Wochentage und Wintermonate lassen sich auch drei bis vier Monate vorher vereinbaren. Die Zimmer für die Gäste reservieren Sie am besten gleichzeitig mit dem Saal, nicht erst danach.',
      },
      {
        q: 'Wie viele Gäste passen hinein?',
        a: 'Von fünfzig in der Edward-Bibliothek bis zu dreihundert beim Bankett im Marmorsaal, beziehungsweise vierhundertfünfzig beim stehenden Empfang. Die genauen Zahlen der einzelnen Säle stehen in der Tabelle oben — und rechnen Sie damit, dass Tanzfläche und Bandplatz die Kapazität verringern.',
      },
      {
        q: 'Ist eine Trauung an der Kolonnade möglich?',
        a: 'Ja. Die Kolonnade steht auf unserem Grund, die Trauung dort vereinbaren Sie also direkt mit uns — eine Genehmigung von anderer Stelle braucht es nicht. Zu klären ist vor allem die Uhrzeit: tagsüber gehen hier die Kurgäste entlang, deshalb wird die Trauung auf die Morgen- oder die frühe Abendstunde gelegt, wenn die Promenade ruhig ist. Schreiben Sie uns Ihren Termin, und wir halten ein Zeitfenster frei.',
      },
      {
        q: 'Wer erledigt das Standesamt?',
        a: 'Das Standesamt in Mariánské Lázně. Unterlagen und Fristen unterscheiden sich je nachdem, ob eine oder einer der Verlobten Ausländer ist — dann wird ein Ehefähigkeitszeugnis samt beglaubigter Übersetzung gebraucht. Für eine Hochzeit aus dem Ausland planen Sie für den Papierkram etwa zwei Monate ein.',
      },
      {
        q: 'Sind standesamtliche und kirchliche Trauung möglich?',
        a: 'Beides. Die standesamtliche Trauung übernimmt das Standesamt und sie ist auch außerhalb des Trauzimmers möglich. Die kirchliche Trauung ist Sache der jeweiligen Pfarrei — wo und unter welchen Bedingungen in der Stadt getraut wird, erfragen Sie am besten direkt dort, denn es unterscheidet sich von Kirche zu Kirche.',
      },
      {
        q: 'Und wenn es regnet?',
        a: 'Genau deshalb plant man eine Trauung im Freien immer mit einem Saal als Rückfall. Die Säle des Gesellschaftshauses und die Hotelräume lassen sich als Reserve halten, entschieden wird am Morgen des Trauungstages. Den Blumenschmuck sollte man so entwerfen, dass er sich nach drinnen tragen lässt.',
      },
      {
        q: 'Können alle Gäste am selben Ort wohnen?',
        a: 'Meistens ja. Sieben Kurhotels stehen in Gehweite, und größere Hochzeiten verteilen sich üblicherweise auf zwei benachbarte Häuser — die Gäste merken es nur daran, durch welche Tür sie schlafen gehen. Das Zimmerkontingent reservieren Sie gleichzeitig mit dem Saal.',
      },
      {
        q: 'Lässt sich die Singende Fontäne vereinbaren?',
        a: 'Ja. Die Fontäne spielt zu jeder ungeraden Stunde ein festes Repertoire, zuhören kann jeder kostenlos. Ein Sonderstück zu einer bestimmten Zeit richten wir ein — die Fontäne steht auf unserem Grund, das vereinbaren Sie also direkt mit uns. Schreiben Sie uns, wann Ihre Trauung enden soll, und wir legen die Zeit danach.',
      },
    ],
  },
  finalCta: {
    heading: 'Erzählen Sie uns von Ihrem Tag',
    body: 'Schreiben Sie uns den Termin, die Gästezahl und ob die Trauung draußen oder unter Dach sein soll. Wir melden uns mit dem, was an diesem Tag frei ist, was es kostet und was früher zu klären ist als der Rest. Die Anfrage ist unverbindlich, und die Reservierung von Termin und Zimmern ist bei uns kostenlos.',
    cta: 'Schreiben Sie uns',
    ensanaLabel: 'Unterkunft bei Ensana',
    alt: 'Brautpaar auf den Stufen unter dem Fresko am Ende der Hauptkolonnade',
  },
  related: {
    heading: 'Weiterlesen',
    items: [
      { title: 'Hochzeit in Marienbad', note: 'Wie man sie Schritt für Schritt plant' },
      { title: 'Geschichte der Kolonnade', note: 'Warum sie so aussieht, wie sie aussieht' },
      { title: 'Die Kolonnade', note: 'Quellen, Fontäne und was drumherum liegt' },
    ],
  },
  alts: {
    hero: 'Brautpaar tanzt unter dem Gewölbe der Hauptkolonnade in Marienbad',
    colonnade: 'Blick in die Arkade der Hauptkolonnade mit dem Brautpaar in der Mitte',
    fountain: 'Hochzeitspaar mit Brautstrauß vor der Säulenreihe der Kolonnade',
    park: 'Hochzeitspaar vor dem Pavillon der Kreuzquelle im Kurpark',
    casino: 'Hochzeitstafel im historischen Saal mit Freskendecke',
    outdoor: 'Der erste Kuss des Brautpaars bei der Trauung im Freien',
    eve: 'Detail einer Stuhlhusse mit goldener Schleife im Hochzeitssaal',
    day: 'Brautpaar stößt unter einem Blumenbogen an',
    after: 'Porträt des Brautpaars mit einem Strauß weißer Rosen',
  },
}

const en: WeddingsContent = {
  metaTitle: 'Your wedding in Mariánské Lázně — venues, halls, dates',
  metaDescription:
    'A ceremony at the colonnade, a banquet under crystal chandeliers, seven hotels on foot. Venues, hall capacities and the questions couples ask most.',
  breadcrumb: 'Weddings',
  hero: {
    eyebrow: 'Weddings in Mariánské Lázně',
    heading: 'Your wedding in Mariánské Lázně',
    lead: 'A cast-iron colonnade, a singing fountain, halls under crystal chandeliers, and seven hotels within walking distance. Your whole day happens in an area you can cross on foot in ten minutes.',
    ctaPrimary: 'Ask about a date',
    ctaSecondary: 'See the venues',
  },
  facts: [
    { value: '120 m', label: 'of cast-iron colonnade', note: 'built in 1889' },
    { value: '5', label: 'historic halls', note: 'the Casino social house' },
    { value: '50–450', label: 'guests', note: 'depending on hall and layout' },
    { value: '10 min', label: 'on foot', note: 'ceremony → banquet → bed' },
  ],
  venues: {
    eyebrow: 'Venues',
    heading: 'Where you say yes',
    lead: 'Five venues within walking distance of each other. Two under a roof, three in the open — and parks in between, where the photographs happen on the way.',
    capacityLabel: 'Capacity',
    settingLabel: 'Setting',
    seasonLabel: 'Best season',
    bandAlt: 'The Marble Hall of the Casino social house set for a wedding banquet',
    items: [
      {
        key: 'colonnade',
        photo: 'main-colonnade-arcade-wide',
        name: 'The Main Colonnade',
        line: 'A hundred and twenty metres of cast-iron lace from 1889, a painted ceiling, and light that falls between the columns in stripes. The most photographed place in town — and in the morning, before the spa guests arrive, the quietest.',
        capacity: 'depends on the ceremony layout',
        setting: 'covered, open to the park',
        season: 'May–September',
        linkLabel: 'History of the colonnade',
      },
      {
        key: 'fountain',
        photo: 'cross-spring-pavilion-bouquet',
        name: 'The Singing Fountain',
        line: 'The circular fountain in front of the colonnade plays on every odd hour. After dark the lights join in and the square turns into an auditorium — a moment you can plan down to the minute.',
        capacity: 'open square',
        setting: 'outdoors',
        season: 'April–October',
        linkLabel: 'About the Singing Fountain',
      },
      {
        key: 'park',
        photo: 'cross-spring-pavilion-couple-walking',
        name: 'The Cross Spring pavilion and the spa park',
        line: 'A white pavilion with a copper dome, lawn in front of it and forest immediately behind. A place for a small ceremony, after which you walk through the park to the banquet.',
        capacity: 'small ceremony',
        setting: 'outdoors',
        season: 'May–June, September',
        linkLabel: 'Spa parks and nature',
      },
      {
        key: 'casino',
        photo: 'casino-marble-hall-tables',
        name: 'The Casino social house — Marble Hall',
        line: 'A frescoed ceiling, crystal chandeliers and a parquet floor that has been danced on since 1900. The largest historic hall in town, and the only one that fits a wedding you do not have to trim.',
        capacity: 'up to 300 seated, 450 standing',
        setting: 'indoors',
        season: 'all year',
        linkLabel: 'The halls in full',
      },
      {
        key: 'outdoor',
        photo: 'outdoor-ceremony-first-kiss',
        name: 'An open-air ceremony',
        line: 'When you want the ceremony out of town: a meadow, a pavilion or the edge of the forest in the Slavkov Forest, fifteen minutes by car. Guests sit on the grass with nothing but trees overhead.',
        capacity: 'depends on the site',
        setting: 'outdoors',
        season: 'June–September',
        linkLabel: 'Things to do nearby',
      },
    ],
  },
  halls: {
    heading: 'The halls of the Casino social house',
    lead: 'Five historic halls under one roof. Banquet means seated at tables, reception means standing with a buffet — for the same hall the two numbers differ by almost half.',
    colName: 'Hall',
    colBanquet: 'Banquet',
    colReception: 'Reception',
    colCharacter: 'Character',
    rows: [
      { name: 'Marble Hall', banquet: '300', reception: '450', character: 'frescoed ceiling, crystal chandeliers, parquet' },
      { name: 'Mirror Hall', banquet: '100', reception: '180', character: 'mirrored walls, chamber scale' },
      { name: 'Red Salon', banquet: '130', reception: '180', character: 'warm colours, good for a banquet' },
      { name: 'Pink Salon with Gallery', banquet: '140', reception: '190', character: 'two connected rooms, good for a buffet' },
      { name: "Edward's Library", banquet: '50', reception: '50', character: 'a library, the most intimate of the five' },
    ],
    note: 'The figures come from the Ensana wedding catalogue. The exact layout, dance floor and space for the band are confirmed by the venue when you book.',
  },
  acts: {
    eyebrow: 'The day',
    heading: 'The day in three acts',
    lead: 'A wedding in a spa town has one advantage: the guests do not travel. They arrive the day before and leave the day after — and in between they never once get into a car.',
    items: [
      {
        key: 'eve',
        photo: 'banquet-chair-gold-sash',
        title: 'The evening before',
        items: [
          'Guests arrive and settle into one of the seven hotels',
          'Spa time for the bride and bridesmaids — a mineral bath or a massage',
          'Dinner together in a smaller circle',
        ],
      },
      {
        key: 'day',
        photo: 'floral-arch-toast',
        title: 'The day itself',
        highlight: true,
        items: [
          'The ceremony at the colonnade, the pavilion or in a hall',
          'A carriage ride through the park past the springs',
          'A toast beneath the floral arch',
          'The banquet and the first dance on the Marble Hall parquet',
        ],
      },
      {
        key: 'after',
        photo: 'couple-portrait-bouquet',
        title: 'The morning after',
        items: [
          'Breakfast without hurry, guests leaving as they wake',
          'A walk to the colonnade and a drinking cure for the hangover',
          'A spa honeymoon — a few more days in the same hotel',
        ],
      },
    ],
  },
  draws: {
    heading: 'Two things you will not get elsewhere',
    lead: 'Not on any list of services, but the things guests remember.',
    items: [
      {
        title: 'The Singing Fountain on request',
        body: 'The fountain plays a fixed repertoire on every odd hour. A special piece at a time of your choosing — lit, if it is after dark — we arrange ourselves: the fountain stands on our land, so it is settled directly with us rather than through a third party.',
        linkLabel: 'About the Singing Fountain',
      },
      {
        title: 'The carriage ride',
        body: 'A historic carriage from the ceremony to the banquet: through the spa park, past the springs and along the colonnade. The route can be shortened or stretched depending on how much time you have between the two.',
        linkLabel: 'Write to us',
      },
    ],
  },
  gallery: {
    heading: 'Details',
    lead: 'The place settings, the flowers, the rings — the things that stay in the photographs years later.',
    photos: [
      { photo: 'banquet-place-setting-detail', alt: 'Close-up of a place setting with name card at the wedding table' },
      { photo: 'cross-spring-pavilion-couple', alt: 'Bride and groom by the white Cross Spring colonnade' },
      { photo: 'casino-hall-floral-centrepiece', alt: 'Tall floral centrepiece on the wedding table in the historic hall' },
      { photo: 'main-colonnade-fresco-portrait', alt: 'Portrait of the wedding couple in front of the Main Colonnade fresco' },
    ],
  },
  guests: {
    heading: 'For your guests',
    lead: 'Most of the worry around a wedding is logistics. Here there is less of it, because everything is next door to everything else.',
    bullets: [
      'Seven spa hotels within walking distance — from five-star to comfortable',
      'Spa and pools for guests who arrive early',
      'Something to do between ceremony and banquet: the colonnade, the parks, the springs',
      'Parking at the hotels, the ceremony venues on foot',
      'Step-free access to most halls and to the colonnade',
    ],
    cardTitle: 'Where next',
    linkAccommodation: 'Where your guests will sleep',
    linkTrips: 'What to do with them either side of the day',
  },
  when: {
    heading: 'When',
    p1: 'May and June are the greenest here — the park comes out before the high season starts, and the light at the pavilion is the reason photographers keep coming back. September brings colour and warm evenings without the heat.',
    p2: 'A winter wedding is a different genre: ceremony and banquet move indoors, into the halls beneath the chandeliers, with the colonnade under snow outside the window. There are more dates free and the prices are lower.',
    linkLabel: 'Best time to visit',
    alt: 'Bride with a long veil at the colonnade in Mariánské Lázně',
  },
  faq: {
    heading: 'Frequently asked questions',
    lead: 'Answers to what couples ask us most often.',
    items: [
      {
        q: 'How far in advance should we book?',
        a: 'For a Saturday in May, June or September, count on a year — those are the dates everyone wants, and the Marble Hall goes first. Weekdays and winter months can often be arranged three to four months ahead. Book the rooms for your guests at the same time as the hall, not afterwards.',
      },
      {
        q: 'How many guests fit?',
        a: "From fifty in Edward's Library to three hundred seated in the Marble Hall, or four hundred and fifty for a standing reception. Exact figures for each hall are in the table above — and bear in mind that a dance floor and space for the band reduce the count.",
      },
      {
        q: 'Can the ceremony be on the colonnade?',
        a: 'Yes. The colonnade stands on our land, so a ceremony there is arranged directly with us — no permission from anyone else is needed. What does need settling is the hour: spa guests walk through during the day, so ceremonies are placed in the morning or the early evening, when the promenade is quiet. Send us your date and we will hold a window.',
      },
      {
        q: 'Who handles the paperwork?',
        a: 'The registry office in Mariánské Lázně. Documents and deadlines differ depending on whether either of you is a foreign national — if so, a certificate of legal capacity to marry with a certified translation is required. For a wedding organised from abroad, allow roughly two months for the paperwork.',
      },
      {
        q: 'Can we have both a civil and a religious ceremony?',
        a: 'Yes, both. The civil ceremony is handled by the registry office and can be held outside the register room. A religious ceremony is a matter for the individual parish — where and on what terms marriages are performed in town is best confirmed with them directly, as it differs from church to church.',
      },
      {
        q: 'What if it rains?',
        a: 'That is exactly why an outdoor ceremony is planned with a hall in reserve. The Casino halls and hotel rooms can be held as a fallback, with the decision made on the morning itself. It pays to design the flowers so they can be carried indoors.',
      },
      {
        q: 'Can all our guests stay in one place?',
        a: 'Usually, yes. Seven spa hotels stand within walking distance, and larger weddings routinely split across two neighbouring houses — guests notice only by which door they go to bed through. Reserve the block of rooms at the same time as the hall.',
      },
      {
        q: 'Can the Singing Fountain be arranged?',
        a: 'Yes. The fountain plays a fixed repertoire on every odd hour and anyone can listen for free. A special piece at a specific time we arrange ourselves — the fountain is on our land, so it is settled directly with us. Tell us when your ceremony is due to end and we will set the time around it.',
      },
    ],
  },
  finalCta: {
    heading: 'Tell us about your day',
    body: 'Send us the date, the number of guests, and whether you want the ceremony outdoors or under a roof. We will come back with what is free that day, what it costs, and what needs settling earlier than the rest. The enquiry commits you to nothing, and reserving a date and rooms with us is free.',
    cta: 'Write to us',
    ensanaLabel: 'Ensana accommodation',
    alt: 'Newlyweds on the steps beneath the fresco at the end of the Main Colonnade',
  },
  related: {
    heading: 'Related reading',
    items: [
      { title: 'A wedding in the spa town', note: 'How to plan it, step by step' },
      { title: 'History of the colonnade', note: 'Why it looks the way it does' },
      { title: 'The Singing Fountain', note: 'The repertoire, the times, and how it came about' },
    ],
  },
  alts: {
    hero: 'Newlyweds dancing beneath the arches of the Main Colonnade in Mariánské Lázně',
    colonnade: 'View down the Main Colonnade arcade with the wedding couple at its centre',
    fountain: 'Wedding couple with the bridal bouquet before the colonnade columns',
    park: 'Wedding couple in front of the Cross Spring pavilion in the spa park',
    casino: 'Wedding tables in the historic hall with its frescoed ceiling',
    outdoor: "The couple's first kiss at an outdoor ceremony",
    eve: 'Chair cover with a gold sash in the wedding hall',
    day: 'Newlyweds raising a toast beneath a floral arch',
    after: 'Portrait of the newlyweds with a bouquet of white roses',
  },
}

const ru: WeddingsContent = {
  metaTitle: 'Свадьба в Марианских Лазнях — места, залы, даты',
  metaDescription:
    'Церемония у колоннады, банкет под хрустальными люстрами и семь отелей в пешей доступности. Места, вместимость залов и ответы на частые вопросы.',
  breadcrumb: 'Свадьба',
  hero: {
    eyebrow: 'Свадьба в Марианских Лазнях',
    heading: 'Свадьба в Марианских Лазнях',
    lead: 'Чугунная колоннада, поющий фонтан, залы под хрустальными люстрами и семь отелей в пешей доступности. Весь ваш день уместится на площади, которую можно пройти за десять минут.',
    ctaPrimary: 'Узнать о дате',
    ctaSecondary: 'Посмотреть места',
  },
  facts: [
    { value: '120 м', label: 'чугунной колоннады', note: '1889 год' },
    { value: '5', label: 'исторических залов', note: 'Общественный дом Casino' },
    { value: '50–450', label: 'гостей', note: 'в зависимости от зала и рассадки' },
    { value: '10 мин', label: 'пешком', note: 'церемония → банкет → отель' },
  ],
  venues: {
    eyebrow: 'Места',
    heading: 'Где вы скажете «да»',
    lead: 'Пять мест в пешей доступности друг от друга. Два под крышей, три под открытым небом — а между ними парки, где снимают по дороге.',
    capacityLabel: 'Вместимость',
    settingLabel: 'Где',
    seasonLabel: 'Лучшее время',
    bandAlt: 'Мраморный зал Общественного дома, накрытый для свадебного банкета',
    items: [
      {
        key: 'colonnade',
        photo: 'main-colonnade-arcade-wide',
        name: 'Главная колоннада',
        line: 'Сто двадцать метров чугунного кружева 1889 года, расписной потолок и свет, падающий между колоннами полосами. Самое фотографируемое место города — и по утрам, пока не пришли курортные гости, самое тихое.',
        capacity: 'зависит от формата церемонии',
        setting: 'под крышей, открыто в парк',
        season: 'май–сентябрь',
        linkLabel: 'История колоннады',
      },
      {
        key: 'fountain',
        photo: 'cross-spring-pavilion-bouquet',
        name: 'Поющий фонтан',
        line: 'Круглый фонтан перед колоннадой играет каждый нечётный час. После темноты к музыке добавляется подсветка, и площадь превращается в зрительный зал — момент, который можно спланировать с точностью до минуты.',
        capacity: 'открытая площадь',
        setting: 'на улице',
        season: 'апрель–октябрь',
        linkLabel: 'О Поющем фонтане',
      },
      {
        key: 'park',
        photo: 'cross-spring-pavilion-couple-walking',
        name: 'Павильон Крестового источника и курортный парк',
        line: 'Белый павильон с медным куполом, газон перед ним и лес сразу за ним. Место для камерной церемонии, после которой к банкету идут пешком через парк.',
        capacity: 'камерная церемония',
        setting: 'на улице',
        season: 'май–июнь, сентябрь',
        linkLabel: 'Курортные парки и природа',
      },
      {
        key: 'casino',
        photo: 'casino-marble-hall-tables',
        name: 'Общественный дом Casino — Мраморный зал',
        line: 'Расписной потолок, хрустальные люстры и паркет, по которому танцуют с 1900 года. Самый большой исторический зал города и единственный, куда помещается свадьба, которую не нужно сокращать.',
        capacity: 'до 300 на банкет, 450 на фуршет',
        setting: 'внутри',
        season: 'круглый год',
        linkLabel: 'Все залы',
      },
      {
        key: 'outdoor',
        photo: 'outdoor-ceremony-first-kiss',
        name: 'Церемония под открытым небом',
        line: 'Если церемония должна быть за городом: луг, беседка или опушка в Славковском лесу, пятнадцать минут на машине. Гости сидят на траве, а над ними — только деревья.',
        capacity: 'зависит от места',
        setting: 'на улице',
        season: 'июнь–сентябрь',
        linkLabel: 'Чем заняться поблизости',
      },
    ],
  },
  halls: {
    heading: 'Залы Общественного дома',
    lead: 'Пять исторических залов под одной крышей. Банкет — это рассадка за столами, фуршет — стоя; для одного и того же зала цифры отличаются почти в полтора раза.',
    colName: 'Зал',
    colBanquet: 'Банкет',
    colReception: 'Фуршет',
    colCharacter: 'Характер',
    rows: [
      { name: 'Мраморный зал', banquet: '300', reception: '450', character: 'расписной потолок, хрустальные люстры, паркет' },
      { name: 'Зеркальный зал', banquet: '100', reception: '180', character: 'зеркальные стены, камерный масштаб' },
      { name: 'Красный салон', banquet: '130', reception: '180', character: 'тёплые тона, хорош для банкета' },
      { name: 'Розовый салон с Галереей', banquet: '140', reception: '190', character: 'два связанных зала, хорошо для фуршета' },
      { name: 'Библиотека Эдуарда', banquet: '50', reception: '50', character: 'библиотека, самый камерный из пяти' },
    ],
    note: 'Цифры взяты из свадебного каталога Ensana. Конкретную рассадку, танцпол и место для музыкантов зал подтверждает при бронировании.',
  },
  acts: {
    eyebrow: 'Как проходит день',
    heading: 'День в трёх актах',
    lead: 'У свадьбы на курорте есть одно преимущество: гости никуда не едут. Они приезжают накануне и уезжают на следующий день — а между этим ни разу не садятся в машину.',
    items: [
      {
        key: 'eve',
        photo: 'banquet-chair-gold-sash',
        title: 'Накануне',
        items: [
          'Приезд гостей и заселение в один из семи отелей',
          'Спа для невесты и подружек — минеральная ванна или массаж',
          'Общий ужин в узком кругу',
        ],
      },
      {
        key: 'day',
        photo: 'floral-arch-toast',
        title: 'Сам день',
        highlight: true,
        items: [
          'Церемония у колоннады, у павильона или в зале',
          'Прогулка в экипаже по парку мимо источников',
          'Тост под цветочной аркой',
          'Банкет и первый танец на паркете Мраморного зала',
        ],
      },
      {
        key: 'after',
        photo: 'couple-portrait-bouquet',
        title: 'Утро после',
        items: [
          'Завтрак без спешки, гости разъезжаются постепенно',
          'Прогулка к колоннаде и питьевой курс от похмелья',
          'Курортный медовый месяц — ещё несколько дней в том же отеле',
        ],
      },
    ],
  },
  draws: {
    heading: 'Две вещи, которых больше нигде нет',
    lead: 'Их нет в списке услуг, но именно их запоминают гости.',
    items: [
      {
        title: 'Поющий фонтан по заказу',
        body: 'Фонтан играет постоянный репертуар каждый нечётный час. Особую композицию в выбранное время — вечером ещё и с подсветкой — организуем мы сами: фонтан стоит на нашей земле, так что это решается напрямую с нами, а не через третью сторону.',
        linkLabel: 'О Поющем фонтане',
      },
      {
        title: 'Прогулка в экипаже',
        body: 'Исторический экипаж от церемонии к банкету: по курортному парку, мимо источников и вдоль колоннады. Маршрут можно сократить или растянуть — смотря сколько времени остаётся между церемонией и банкетом.',
        linkLabel: 'Написать нам',
      },
    ],
  },
  gallery: {
    heading: 'Детали',
    lead: 'Сервировка, цветы, кольца — то, что останется на снимках и через годы.',
    photos: [
      { photo: 'banquet-place-setting-detail', alt: 'Деталь сервировки с именной карточкой на свадебном столе' },
      { photo: 'cross-spring-pavilion-couple', alt: 'Невеста и жених у белой колоннады Крестового источника' },
      { photo: 'casino-hall-floral-centrepiece', alt: 'Высокая цветочная композиция на свадебном столе в историческом зале' },
      { photo: 'main-colonnade-fresco-portrait', alt: 'Портрет свадебной пары на фоне фрески Главной колоннады' },
    ],
  },
  guests: {
    heading: 'Для гостей',
    lead: 'Большая часть хлопот на свадьбе — это логистика. Здесь её меньше, потому что всё стоит рядом.',
    bullets: [
      'Семь курортных отелей в пешей доступности — от пятизвёздочных до комфортных',
      'Спа и бассейны для тех, кто приедет раньше',
      'Чем занять гостей между церемонией и банкетом: колоннада, парки, источники',
      'Парковка у отелей, до мест церемонии пешком',
      'Безбарьерный доступ в большинство залов и на колоннаду',
    ],
    cardTitle: 'Читать дальше',
    linkAccommodation: 'Где будут жить гости',
    linkTrips: 'Чем занять гостей до и после',
  },
  when: {
    heading: 'Когда',
    p1: 'Май и июнь здесь самые зелёные — парк оживает раньше, чем начинается высокий сезон, а свет у павильона именно тот, ради которого фотографы возвращаются. Сентябрь приносит краски и тёплые вечера без жары.',
    p2: 'Зимняя свадьба — другой жанр: церемония и банкет уходят внутрь, в залы под люстрами, а за окном заснеженная колоннада. Свободных дат больше, а цены ниже.',
    linkLabel: 'Лучшее время для поездки',
    alt: 'Невеста с длинной фатой у колоннады в Марианских Лазнях',
  },
  faq: {
    heading: 'Частые вопросы',
    lead: 'Ответы на то, о чём спрашивают чаще всего.',
    items: [
      {
        q: 'За сколько нужно бронировать?',
        a: 'На субботу в мае, июне или сентябре закладывайте год — это самые востребованные даты, и Мраморный зал занимают первым. Будни и зимние месяцы обычно удаётся договорить за три-четыре месяца. Номера для гостей бронируйте одновременно с залом, а не после.',
      },
      {
        q: 'Сколько гостей помещается?',
        a: 'От пятидесяти в Библиотеке Эдуарда до трёхсот на банкете в Мраморном зале — или четырёхсот пятидесяти, если это фуршет стоя. Точные цифры по каждому залу есть в таблице выше, и учтите, что танцпол и место для музыкантов уменьшают вместимость.',
      },
      {
        q: 'Возможна ли церемония на колоннаде?',
        a: 'Да. Колоннада стоит на нашей земле, поэтому церемонию вы согласуете напрямую с нами — разрешение со стороны не требуется. Решать нужно прежде всего время: днём здесь ходят курортные гости, поэтому церемонию ставят на утро или ранний вечер, когда променада спокойна. Напишите дату — и мы забронируем окно.',
      },
      {
        q: 'Кто занимается документами?',
        a: 'ЗАГС Марианских Лазней. Документы и сроки зависят от того, является ли кто-то из пары иностранцем, — тогда нужна справка о брачной правоспособности с заверенным переводом. Если свадьбу организуют из-за границы, на бумаги закладывайте месяца два.',
      },
      {
        q: 'Можно ли и гражданскую, и церковную церемонию?',
        a: 'Да, и то и другое. Гражданскую проводит ЗАГС, и её можно провести не только в зале регистрации. Церковная — дело конкретного прихода: где и на каких условиях венчают в городе, лучше уточнять напрямую там, потому что от храма к храму это отличается.',
      },
      {
        q: 'А если пойдёт дождь?',
        a: 'Именно поэтому церемонию на улице планируют с залом в запасе. Залы Общественного дома и помещения отелей можно держать как резерв и решить утром в день церемонии. Цветочное оформление стоит продумать так, чтобы его можно было перенести внутрь.',
      },
      {
        q: 'Смогут ли все гости жить в одном месте?',
        a: 'Чаще всего да. Семь курортных отелей стоят в пешей доступности, а большие свадьбы обычно делят между двумя соседними домами — гости замечают это только по тому, в какую дверь идут спать. Блок номеров бронируйте одновременно с залом.',
      },
      {
        q: 'Можно ли договориться о Поющем фонтане?',
        a: 'Да. Фонтан играет постоянный репертуар каждый нечётный час, и слушать его может кто угодно бесплатно. Особую композицию в конкретное время организуем мы — фонтан на нашей земле, так что это согласуется напрямую с нами. Напишите, когда должна закончиться церемония, и мы подстроим время.',
      },
    ],
  },
  finalCta: {
    heading: 'Расскажите нам о своём дне',
    body: 'Напишите дату, число гостей и то, хотите ли вы церемонию на улице или под крышей. Мы ответим, что свободно в этот день, сколько это стоит и что нужно решить раньше остального. Запрос ни к чему не обязывает, а бронирование даты и номеров у нас бесплатное.',
    cta: 'Написать нам',
    ensanaLabel: 'Проживание Ensana',
    alt: 'Молодожёны на ступенях под фреской в конце Главной колоннады',
  },
  related: {
    heading: 'Читайте также',
    items: [
      { title: 'Свадьба в Марианских Лазнях', note: 'Как спланировать её шаг за шагом' },
      { title: 'Колоннада', note: 'Источники, фонтан и всё вокруг' },
      { title: 'Поющий фонтан', note: 'Репертуар, расписание и как он появился' },
    ],
  },
  alts: {
    hero: 'Молодожёны танцуют под сводами Главной колоннады в Марианских Лазнях',
    colonnade: 'Вид вдоль аркады Главной колоннады со свадебной парой в центре',
    fountain: 'Свадебная пара со свадебным букетом у колоннады',
    park: 'Свадебная пара перед павильоном Крестового источника в курортном парке',
    casino: 'Свадебные столы в историческом зале с расписным потолком',
    outdoor: 'Первый поцелуй молодожёнов на церемонии под открытым небом',
    eve: 'Чехол на стул с золотым бантом в свадебном зале',
    day: 'Молодожёны поднимают бокалы под цветочной аркой',
    after: 'Портрет молодожёнов с букетом белых роз',
  },
}

export const weddingsContent: Record<Locale, WeddingsContent> = { cs, de, en, ru }
