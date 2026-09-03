import type { Locale } from '@/i18n/config'
import { routes } from '@/i18n/config'

/**
 * Obsah landing page pro firemní akce ve všech čtyřech jazycích.
 *
 * Stejná dvojice jako svatby (weddingsContent.ts + WeddingsPage.astro):
 * texty tady, rozvržení v komponentě. Fotky vybírá komponenta podle klíče
 * situace, aby data zůstala jazykově neutrální.
 *
 * Zdroje faktů (nic z toho není odhad):
 *  - kapacity a rozměry sálů: MICE brožura Ensana 2025, strana 24
 *    (tabulka „Konferenční uspořádání") — ne svatební katalog, ten má
 *    u Mramorového a Zrcadlového sálu jiná čísla
 *  - Casino, koridory, Wi-Fi, parkování, catering, platby: Manuál
 *    Společenského domu Casino pro partnery a vystavovatele
 *  - WellMeeting®, gastronomie, sport, vzdálenosti: MICE brožura
 *  - restaurace a lázeňské sály: data/ensana_knowledge_base.json
 *
 * Ceny na stránku nepatří — stejně jako u ambulantní léčby se řeší
 * nabídkou na míru. Platební a storno podmínky jsou jen v FAQ, bez částek.
 */

/** Sály a salonky s kapacitami podle uspořádání (MICE brožura, s. 24). */
export interface HallRow {
  key: string
  /** Skupina: casino | nove-lazne | pacifik | butterfly | hvezda */
  group: string
  area: string
  theatre: number | null
  classroom: number | null
  banquet: number | null
  ushape: number | null
  reception: number | null
  boardroom: number | null
  daylight: boolean
}

export const HALLS: HallRow[] = [
  { key: 'marble', group: 'casino', area: '376 m²', theatre: 450, classroom: 220, banquet: 250, ushape: 80, reception: 300, boardroom: 100, daylight: true },
  { key: 'mirror', group: 'casino', area: '300 m²', theatre: 160, classroom: 140, banquet: 160, ushape: 70, reception: 250, boardroom: 80, daylight: true },
  { key: 'red', group: 'casino', area: '190 m²', theatre: 130, classroom: 100, banquet: 130, ushape: 50, reception: 180, boardroom: 60, daylight: true },
  { key: 'pink', group: 'casino', area: '81 m²', theatre: 36, classroom: 17, banquet: null, ushape: 40, reception: null, boardroom: 20, daylight: true },
  { key: 'gallery1', group: 'casino', area: '128 m²', theatre: 100, classroom: 80, banquet: 100, ushape: 45, reception: 150, boardroom: 50, daylight: true },
  { key: 'gallery2', group: 'casino', area: '80 m²', theatre: 50, classroom: 30, banquet: 40, ushape: 20, reception: 40, boardroom: 30, daylight: true },
  { key: 'edward', group: 'nove-lazne', area: '81 m²', theatre: 50, classroom: 40, banquet: 36, ushape: 30, reception: 40, boardroom: 50, daylight: true },
  { key: 'green', group: 'nove-lazne', area: '32 m²', theatre: 40, classroom: 20, banquet: 24, ushape: 20, reception: null, boardroom: 25, daylight: true },
  { key: 'cook', group: 'pacifik', area: '80 m²', theatre: 50, classroom: 30, banquet: 30, ushape: 20, reception: 50, boardroom: 30, daylight: true },
  { key: 'bellevue', group: 'butterfly', area: '119 m²', theatre: 90, classroom: 70, banquet: 60, ushape: 50, reception: 100, boardroom: 50, daylight: true },
  { key: 'imperial', group: 'hvezda', area: '75 + 93 m²', theatre: 40, classroom: 20, banquet: 20, ushape: 20, reception: 80, boardroom: 20, daylight: true },
]

export interface CorporateSituation {
  /** christmas | conference | offsite | board */
  key: string
  title: string
  tagline: string
  body: string
  room: string
  size: string
  linkLabel: string
}

export interface CorporateContent {
  metaTitle: string
  metaDescription: string
  breadcrumb: string
  hero: { eyebrow: string; heading: string; lead: string; ctaPrimary: string; ctaSecondary: string }
  facts: { value: string; label: string; note: string }[]
  corridor: { heading: string; body: string }
  situations: {
    eyebrow: string
    heading: string
    lead: string
    roomLabel: string
    sizeLabel: string
    items: CorporateSituation[]
  }
  halls: {
    heading: string
    lead: string
    cols: { name: string; area: string; theatre: string; classroom: string; banquet: string; ushape: string; reception: string; boardroom: string }
    groups: Record<string, string>
    names: Record<string, string>
    note: string
    dash: string
  }
  gastronomy: { eyebrow: string; heading: string; lead: string; items: string[]; note: string; restaurants: string }
  day: { eyebrow: string; heading: string; lead: string; items: { time: string; title: string; text: string }[]; footnote: string }
  after: { heading: string; lead: string; items: { key: string; title: string; text: string; linkLabel: string }[] }
  travel: {
    heading: string
    lead: string
    distances: { place: string; km: string }[]
    parking: string
    wifi: string
  }
  benefits: { heading: string; body: string; cta: string }
  faq: { heading: string; lead: string; items: { q: string; a: string }[] }
  finalCta: { heading: string; body: string; cta: string; managerLabel: string; deptLabel: string }
  related: { heading: string; items: { title: string; note: string }[] }
  alts: Record<string, string>
}

/** Konferenční oddělení — společná schránka z MICE brožury a znalostní báze. */
export const CONFERENCE_MAIL = 'conference.cz@ensanahotels.com'
export const CONFERENCE_PHONE = '+420 354 655 505'
export const CONFERENCE_PHONE_HREF = '+420354655505'
/**
 * Conference manager. Na web patří kontaktem, ne jménem (zadání 1. 9. 2026),
 * proto se tu neobjevuje nikde jinde než v této konstantě.
 */
export const CONFERENCE_MANAGER_MAIL = 'nhrda@ensanahotels.com'

/** Předmět poptávky podle typu akce — ať se v jedné schránce pozná, o co jde. */
export function inquiryMailto(locale: Locale, subject: string): string {
  const params = new URLSearchParams({ cc: CONFERENCE_MANAGER_MAIL, subject })
  void locale
  return `mailto:${CONFERENCE_MAIL}?${params.toString()}`
}

/** Odkazy na hotové stránky, na které se z firemní stránky ukazuje. */
export function corporateLinks(locale: Locale) {
  const trips = `/${locale}/${routes['day-trips'][locale]}`
  const christmas: Record<Locale, string> = {
    cs: '/cs/vanoce-a-silvestr',
    de: '/de/weihnachten-und-silvester',
    en: '/en/christmas-and-new-year',
    ru: '/ru/rozhdestvo-i-novyj-god',
  }
  return {
    romanBaths: `/${locale}/${routes['roman-baths'][locale]}`,
    golf: `/${locale}/${routes.golf[locale]}`,
    trips,
    tripKladska: `${trips}/kladska`,
    tripTepla: `${trips}/tepla`,
    tripKynzvart: `${trips}/kynzvart`,
    tripLoket: `${trips}/loket`,
    tripBecov: `${trips}/becov`,
    accommodation: `/${locale}/${routes.accommodation[locale]}`,
    parking: `/${locale}/${routes.parking[locale]}`,
    christmas: christmas[locale],
    weddings: `/${locale}/${routes.weddings[locale]}`,
    hotel: (slug: string) => `/${locale}/hotel/${slug}`,
    outpatient: `/${locale}/${routes.outpatient[locale]}`,
  }
}

const cs: CorporateContent = {
  metaTitle: 'Firemní akce v Mariánských Lázních — konference, večírky, zasedání',
  metaDescription:
    'Sál z roku 1867 pro 450 lidí, sedm hotelů propojených krytým koridorem a lázně 200 metrů od jednací místnosti. Kapacity sálů, gastronomie, WellMeeting® a kontakt na konferenční oddělení.',
  breadcrumb: 'Firemní akce',
  hero: {
    eyebrow: 'Konference · večírky · zasedání',
    heading: 'Firemní akce v lázních, kde se nikam nejezdí',
    lead: 'Sedm hotelů, 900 pokojů, deset sálů a Římské lázně — všechno propojené krytým koridorem. Účastník od příjezdu do odjezdu nepotřebuje kabát ani taxík. Od zasedání představenstva pro dvacet lidí po kongres pro pět set.',
    ctaPrimary: 'Poptat termín',
    ctaSecondary: 'Kapacity sálů',
  },
  facts: [
    { value: '500', label: 'osob v Casinu', note: 'Mramorový sál z roku 1867' },
    { value: '900+', label: 'pokojů', note: 'sedm hotelů, jedna destinace' },
    { value: '10', label: 'sálů a salonků', note: 'od 20 do 450 míst' },
    { value: '160 km', label: 'z Prahy', note: 'Norimberk 170, Mnichov 280' },
  ],
  corridor: {
    heading: 'Z jednací místnosti do bazénu Římských lázní je to 200 metrů chodbou',
    body: 'Společenský dům Casino je krytým koridorem propojený s hotely Nové Lázně, Centrální Lázně a Hvězda. Sály, pokoje, restaurace, bazén i procedury jsou pod jednou střechou — a zbylé čtyři hotely stojí pár minut pěšky přes park. Když v listopadu prší, vaši lidé to nepoznají.',
  },
  situations: {
    eyebrow: 'Čtyři situace',
    heading: 'Co u nás pořádáte',
    lead: 'Každá akce chce jiný sál a jiný tón. Tady jsou čtyři, které se u nás dělají nejčastěji — a k nim prostor, který bychom vám doporučili jako první.',
    roomLabel: 'Doporučený prostor',
    sizeLabel: 'Velikost akce',
    items: [
      {
        key: 'christmas',
        title: 'Vánoční večírek',
        tagline: 'Pod křišťálovými lustry, s postelí o patro výš',
        body: 'Mramorový sál má fresky, lustry a parket, na kterém se tančí od roku 1867. Vaši lidé přespí v hotelu propojeném chodbou — nikdo neřeší taxíky ani kdo dnes nepije. Ráno je čeká snídaně a pro ty, kdo chtějí, bazén. Menší firmy mají Červený sál se stejnou atmosférou v komornějším měřítku.',
        room: 'Mramorový sál (250 u stolů / 300 raut) · Červený sál (130 / 180)',
        size: '60–300 osob',
        linkLabel: 'Vánoce v Mariánských Lázních',
      },
      {
        key: 'conference',
        title: 'Konference a kongres',
        tagline: 'Celé Casino, tři hotely pěšky suchou nohou',
        body: 'Plenárka v Mramorovém sále pro 450 lidí, paralelní sekce v Zrcadlovém a Červeném sále, workshopy v galeriích, partnerské stánky ve foyer. Konferenční Wi-Fi v celé budově, catering z hotelových kuchyní podávaný podle vašeho programu. Pro vystavovatele máme samostatný manuál se vším od nosnosti podlah po celní formality.',
        room: 'Společenský dům Casino — všech šest prostor',
        size: '100–500 osob',
        linkLabel: 'Kapacity sálů',
      },
      {
        key: 'offsite',
        title: 'Výjezdní zasedání',
        tagline: 'Dva dny, které tým nezapomene',
        body: 'Dopoledne práce v salonku s denním světlem, odpoledne golf na nejstarším hřišti v Česku, discgolf v lese nebo lukostřelba s instruktorem. Večer grilování nebo degustace, ráno nordic walking parkem kolem pramenů. Program WellMeeting® skládáme s vámi — pohyb a přestávky nejsou přílepek k jednání, ale jeho součást.',
        room: 'Salon Bellevue v Butterfly (90) · Galerie I v Casinu (100) · Salonek kapitána Cooka v Pacifiku (50)',
        size: '20–100 osob',
        linkLabel: 'Program dne',
      },
      {
        key: 'board',
        title: 'Zasedání představenstva',
        tagline: 'Malé, tiché a s výbornou kuchyní',
        body: 'Edwardova knihovna v pětihvězdičkových Nových Lázních: knihy po stěnách, denní světlo, koberec, u stolu padesát lidí a v klidu dvacet. Oběd v restauraci Royal o patro níž, po jednání Římské lázně z roku 1896 nebo minerální koupel v Královské kabině Edwarda VII. Pro nejužší okruh je vedle Zelený salonek pro dvacet lidí u jednoho stolu.',
        room: 'Edwardova knihovna (boardroom 50) · Zelený salonek (20)',
        size: '8–50 osob',
        linkLabel: 'Hotel Nové Lázně',
      },
    ],
  },
  halls: {
    heading: 'Kapacity sálů a salonků',
    lead: 'Jedenáct prostor v Casinu a čtyřech hotelech. Čísla jsou z konferenční brožury Ensana; konkrétní uspořádání, pódium a techniku potvrdí konferenční oddělení při rezervaci.',
    cols: { name: 'Prostor', area: 'Plocha', theatre: 'Divadlo', classroom: 'Škola', banquet: 'Banket', ushape: 'U-tabule', reception: 'Recepce', boardroom: 'Boardroom' },
    groups: {
      casino: 'Společenský dům Casino',
      'nove-lazne': 'Hotel Nové Lázně ★★★★★',
      pacifik: 'Hotel Pacifik ★★★★',
      butterfly: 'Hotel Butterfly ★★★★',
      hvezda: 'Hotel Hvězda ★★★★',
    },
    names: {
      marble: 'Mramorový sál',
      mirror: 'Zrcadlový sál',
      red: 'Červený sál',
      pink: 'Růžový salonek',
      gallery1: 'Galerie I',
      gallery2: 'Galerie II',
      edward: 'Edwardova knihovna',
      green: 'Zelený salonek',
      cook: 'Salonek kapitána Jamese Cooka',
      bellevue: 'Salon Bellevue',
      imperial: 'Café Imperial',
    },
    note: 'Všechny prostory mají denní světlo. Sály v Casinu mají parkety, salonky v hotelech koberec. Casino má navíc litinovou venkovní terasu (sezónně) a kavárnu ve foyer.',
    dash: '—',
  },
  gastronomy: {
    eyebrow: 'Gastronomie',
    heading: 'Sedm kuchyní, jeden tým',
    lead: 'Gala večeře pod lustry, raut ve foyer, coffee break na terase nebo grilování v parku. Menu skládáme podle vaší akce — od tříchodového oběda pro představenstvo po bufet pro pět set.',
    items: [
      'Gala večeře a bankety',
      'Recepce, rauty a koktejly',
      'Coffee breaky podle programu',
      'Live cooking a barman show',
      'Zážitkové degustace',
      'Venkovní grilování',
      'Beer & wine party',
    ],
    note: 'Jídlo a nápoje do sálů jdou z hotelových kuchyní — vlastní catering z hygienických důvodů není možný. Víno k akci lze objednat přímo z hotelu; u vlastního alkoholu se účtuje korkovné.',
    restaurants: 'Royal v Nových Lázních · Goethe v Centrálních Lázních · Franz Josef & Sissi a Café Imperial ve Hvězdě · Primavera v Pacifiku · La Fontaine v Butterfly · Regina ve Vltavě · Carlton ve Svobodě',
  },
  day: {
    eyebrow: 'WellMeeting®',
    heading: 'Den v lázních místo dne v konferenčním hotelu',
    lead: 'Pohyb, dobré jídlo a přestávky, které opravdu odpočinou. Takhle může vypadat jeden den vaší akce — každý bod si škrtnete nebo přidáte.',
    items: [
      { time: '7:30', title: 'Nordic walking parkem', text: 'Hole půjčíme, trasa vede kolem pramenů. Kdo raději běhá, má lesní okruhy za hotelem.' },
      { time: '9:00', title: 'Jednání', text: 'Denní světlo, konferenční Wi-Fi, technika podle zadání.' },
      { time: '11:00', title: 'Coffee break „s sebou"', text: 'Smoothie bar a fit bites — a patnáct minut na terase místo u stolu.' },
      { time: '13:00', title: 'Oběd', text: 'V hotelové restauraci propojené chodbou. Healthy Choice pro ty, kdo odpoledne chtějí myslet.' },
      { time: '15:30', title: 'Masáže v přestávce', text: 'Krátké masáže šíje přímo u sálu, nebo aqua training v bazénu.' },
      { time: '19:00', title: 'Večeře', text: 'Gala v Mramorovém sále, nebo grilování na terase, když počasí dovolí.' },
      { time: '21:00', title: 'Římské lázně', text: 'Bazén z roku 1896 pro hosty Nových Lázní a Centrálních Lázní — na zbytek večera bez telefonu.' },
    ],
    footnote: 'Do pokoje: výběr polštářů, fitness kit a „pyžamo" pro mobil — pro klidnější spánek před druhým dnem.',
  },
  after: {
    heading: 'Po jednání',
    lead: 'Tři věci, které účastníkům zůstanou v hlavě déle než prezentace.',
    items: [
      { key: 'spa', title: 'Římské lázně a Královská kabina', text: 'Bazén pod klenbami z roku 1896 a minerální koupel v kabině, kde se koupal Edward VII. Historie, kterou si lze odpoledne vyzkoušet.', linkLabel: 'O Římských lázních' },
      { key: 'golf', title: 'Golf na hřišti z roku 1905', text: 'Royal Golf Club založil britský král. Pro začátečníky je veřejná Chip & Putt devítka — bez zelené karty, ideální na teambuilding.', linkLabel: 'Golf v Mariánských Lázních' },
      { key: 'trips', title: 'Výlet pro celou skupinu', text: 'Kladská s rašeliništi, klášter Teplá, Metternichův zámek Kynžvart, hrad Loket nebo Bečov s relikviářem svatého Maura — vše do hodiny.', linkLabel: 'Tipy na výlety' },
    ],
  },
  travel: {
    heading: 'Jak k nám',
    lead: 'Mariánské Lázně leží na půl cesty mezi Prahou a Norimberkem. Pro tým z Bavorska je to blíž než do Mnichova.',
    distances: [
      { place: 'Letiště Karlovy Vary', km: '50 km' },
      { place: 'Praha', km: '160 km' },
      { place: 'Norimberk', km: '170 km' },
      { place: 'Mnichov', km: '280 km' },
      { place: 'Frankfurt', km: '410 km' },
      { place: 'Berlín · Vídeň', km: '420 km' },
    ],
    parking: 'Centrální parkoviště s cca 500 místy a parkovací dům s cca 300 místy, oba pár minut od Casina.',
    wifi: 'V celém Casinu je po dobu akce k dispozici konferenční Wi-Fi síť; každý stánek má zásuvku 230 V.',
  },
  benefits: {
    heading: 'Rekondiční pobyty jako zaměstnanecký benefit',
    body: 'Péče o pohodu zaměstnanců se vyplácí. Rekondiční pobyt v lázních — procedury, bazén, sauna, fitness — je benefit, který si lidé pamatují déle než poukázku. Pro firmy připravujeme zvýhodněné nabídky na míru.',
    cta: 'Poptat nabídku pro zaměstnance',
  },
  faq: {
    heading: 'Na co se ptají organizátoři',
    lead: 'Odpovědi na otázky, které přijdou v prvním e-mailu skoro vždycky.',
    items: [
      { q: 'Jak dlouho dopředu rezervovat?', a: 'Velké sály v Casinu na podzim a před Vánoci bývají obsazené i rok dopředu; salonky v hotelech se dají domluvit i v řádu týdnů. Napište nám termín a počet lidí — odpovíme s volnými variantami.' },
      { q: 'Vejdou se všichni účastníci do jednoho hotelu?', a: 'Do dvou set lidí ano — Hvězda má 238 pokojů, Centrální Lázně 144. Větší skupiny rozdělíme mezi hotely propojené koridorem, takže na akci jdou všichni suchou nohou.' },
      { q: 'Dají se sály propojit nebo rozdělit?', a: 'Casino nabízí šest prostor v jedné budově — plenárku, paralelní sekce i workshopy uděláte pod jednou střechou. Konkrétní kombinaci a časy pro přestavbu potvrdí konferenční oddělení.' },
      { q: 'Co partnerské stánky a vystavovatelé?', a: 'Pro vystavovatele máme samostatný manuál: schválení vizualizace stánku, doručení materiálu předem, elektřina, parketová podlaha bez kovových koleček. Pošleme ho s nabídkou.' },
      { q: 'Jak je to s technikou?', a: 'Základní projekci a ozvučení zajistíme; větší instalace (LED stěna, tlumočení, streaming) domluvíme s vámi nebo s vaším dodavatelem. Vyšší odběr elektřiny je potřeba nahlásit předem.' },
      { q: 'Můžeme si přivézt vlastní catering?', a: 'Ne — jídlo do sálů jde výhradně z hotelových kuchyní. Nealko a káva na vlastní stánek jsou v pořádku, u vlastního alkoholu se účtuje korkovné.' },
      { q: 'Jak probíhá platba?', a: 'Obvykle ve dvou splátkách: polovina do 20 dnů od potvrzení objednávky, polovina před akcí. Ceny jsou bez DPH, storno po potvrzení může být účtováno až do plné výše. Detaily jsou v nabídce.' },
    ],
  },
  finalCta: {
    heading: 'Napište nám termín a počet lidí',
    body: 'Ozve se vám náš Conference manager s návrhem sálů, ubytování a programu. Nezávazně a do dvou pracovních dnů.',
    cta: 'Poptat firemní akci',
    managerLabel: 'Conference manager',
    deptLabel: 'Konferenční oddělení',
  },
  related: {
    heading: 'Mohlo by vás zajímat',
    items: [
      { title: 'Svatba v Mariánských Lázních', note: 'Stejné sály, jiný den — obřad na kolonádě a hostina v Mramorovém sále.' },
      { title: 'Vánoce a Silvestr', note: 'Adventní město, silvestrovské gala a co dělat mezi svátky.' },
      { title: 'Ubytování', note: 'Sedm hotelů Ensana od tří do pěti hvězd.' },
    ],
  },
  alts: {
    hero: 'Mramorový sál Společenského domu Casino prostřený k banketu, freskový strop a křišťálové lustry',
    christmas: 'Slavnostní květinová výzdoba na stole v sále Casina',
    conference: 'Salon Bellevue v hotelu Butterfly připravený na jednání',
    offsite: 'Salonek kapitána Jamese Cooka v hotelu Pacifik',
    board: 'Edwardova knihovna v hotelu Nové Lázně — jednací stůl mezi knihovnami',
    boardGreen: 'Zelený salonek v hotelu Nové Lázně',
    boardLibrary: 'Knihovní vitríny a křesla v Edwardově knihovně hotelu Nové Lázně',
    gastro1: 'Krémová polévka nalévaná u stolu',
    gastro2: 'Flambování zeleniny na pánvi',
    gastro3: 'Dezert z hruškek v čokoládě',
    gastro4: 'Kavárna Café Imperial v hotelu Hvězda',
    day: 'Interiér litinové Hlavní kolonády',
    travel: 'Letecký pohled na lázeňskou čtvrť Mariánských Lázní',
    cta: 'Hlavní kolonáda Mariánských Lázní',
  },
}

const de: CorporateContent = {
  metaTitle: 'Firmenevents in Marienbad — Konferenzen, Weihnachtsfeiern, Sitzungen',
  metaDescription:
    'Ein Saal von 1867 für 450 Gäste, sieben Hotels durch einen überdachten Korridor verbunden und das Kurbad 200 Meter vom Sitzungsraum. Saalkapazitäten, Gastronomie, WellMeeting® und Kontakt zur Konferenzabteilung.',
  breadcrumb: 'Firmenevents',
  hero: {
    eyebrow: 'Konferenzen · Feiern · Sitzungen',
    heading: 'Firmenevents im Kurort, in dem niemand fahren muss',
    lead: 'Sieben Hotels, 900 Zimmer, zehn Säle und das Römische Bad — alles durch einen überdachten Korridor verbunden. Ihre Teilnehmer brauchen von der Ankunft bis zur Abreise weder Mantel noch Taxi. Von der Vorstandssitzung für zwanzig bis zum Kongress für fünfhundert.',
    ctaPrimary: 'Termin anfragen',
    ctaSecondary: 'Saalkapazitäten',
  },
  facts: [
    { value: '500', label: 'Gäste im Casino', note: 'Marmorsaal von 1867' },
    { value: '900+', label: 'Zimmer', note: 'sieben Hotels, ein Ort' },
    { value: '10', label: 'Säle und Salons', note: 'von 20 bis 450 Plätzen' },
    { value: '170 km', label: 'von Nürnberg', note: 'München 280, Prag 160' },
  ],
  corridor: {
    heading: 'Vom Sitzungsraum ins Becken des Römischen Bades sind es 200 Meter Flur',
    body: 'Das Gesellschaftshaus Casino ist durch einen überdachten Korridor mit den Hotels Nové Lázně, Centrální Lázně und Hvězda verbunden. Säle, Zimmer, Restaurants, Pool und Anwendungen liegen unter einem Dach — die übrigen vier Hotels stehen wenige Gehminuten entfernt am Park. Wenn es im November regnet, merken Ihre Leute es nicht.',
  },
  situations: {
    eyebrow: 'Vier Anlässe',
    heading: 'Was Sie bei uns veranstalten',
    lead: 'Jede Veranstaltung braucht einen anderen Saal und einen anderen Ton. Hier sind die vier, die bei uns am häufigsten stattfinden — und der Raum, den wir Ihnen als Erstes empfehlen würden.',
    roomLabel: 'Empfohlener Raum',
    sizeLabel: 'Größe',
    items: [
      {
        key: 'christmas',
        title: 'Weihnachtsfeier',
        tagline: 'Unter Kristalllüstern, das Bett ein Stockwerk höher',
        body: 'Der Marmorsaal hat Fresken, Lüster und ein Parkett, auf dem seit 1867 getanzt wird. Ihre Leute übernachten im Hotel nebenan, verbunden durch den Korridor — niemand organisiert Taxis, niemand muss nüchtern bleiben. Am Morgen wartet das Frühstück und für alle, die möchten, der Pool. Kleinere Firmen finden im Roten Saal dieselbe Atmosphäre in intimerem Maßstab.',
        room: 'Marmorsaal (250 an Tischen / 300 Empfang) · Roter Saal (130 / 180)',
        size: '60–300 Personen',
        linkLabel: 'Weihnachten in Marienbad',
      },
      {
        key: 'conference',
        title: 'Konferenz und Kongress',
        tagline: 'Das ganze Casino, drei Hotels trockenen Fußes',
        body: 'Plenum im Marmorsaal für 450 Personen, parallele Sektionen im Spiegel- und im Roten Saal, Workshops in den Galerien, Partnerstände im Foyer. Konferenz-WLAN im ganzen Haus, Catering aus den Hotelküchen nach Ihrem Programm. Für Aussteller gibt es ein eigenes Handbuch — von der Bodenbelastung bis zu Zollformalitäten.',
        room: 'Gesellschaftshaus Casino — alle sechs Räume',
        size: '100–500 Personen',
        linkLabel: 'Saalkapazitäten',
      },
      {
        key: 'offsite',
        title: 'Klausurtagung',
        tagline: 'Zwei Tage, die das Team nicht vergisst',
        body: 'Vormittags Arbeit im Salon mit Tageslicht, nachmittags Golf auf dem ältesten Platz Tschechiens, Discgolf im Wald oder Bogenschießen mit Trainer. Abends Grillen oder eine Verkostung, morgens Nordic Walking durch den Park an den Quellen entlang. Das WellMeeting®-Programm stellen wir mit Ihnen zusammen — Bewegung und Pausen sind kein Anhängsel der Tagung, sondern Teil davon.',
        room: 'Salon Bellevue im Butterfly (90) · Galerie I im Casino (100) · Captain-Cook-Salon im Pacifik (50)',
        size: '20–100 Personen',
        linkLabel: 'Tagesprogramm',
      },
      {
        key: 'board',
        title: 'Vorstandssitzung',
        tagline: 'Klein, ruhig und mit ausgezeichneter Küche',
        body: 'Die Edward-Bibliothek im Fünf-Sterne-Hotel Nové Lázně: Bücher an den Wänden, Tageslicht, Teppich, am Tisch fünfzig Personen und in Ruhe zwanzig. Mittagessen im Restaurant Royal ein Stockwerk tiefer, nach der Sitzung das Römische Bad von 1896 oder ein Mineralbad in der Königskabine Edwards VII. Für den engsten Kreis liegt nebenan der Grüne Salon für zwanzig Personen an einem Tisch.',
        room: 'Edward-Bibliothek (Boardroom 50) · Grüner Salon (20)',
        size: '8–50 Personen',
        linkLabel: 'Hotel Nové Lázně',
      },
    ],
  },
  halls: {
    heading: 'Kapazitäten der Säle und Salons',
    lead: 'Elf Räume im Casino und in vier Hotels. Die Zahlen stammen aus der Konferenzbroschüre von Ensana; Bestuhlung, Bühne und Technik bestätigt die Konferenzabteilung bei der Reservierung.',
    cols: { name: 'Raum', area: 'Fläche', theatre: 'Theater', classroom: 'Parlament', banquet: 'Bankett', ushape: 'U-Form', reception: 'Empfang', boardroom: 'Boardroom' },
    groups: {
      casino: 'Gesellschaftshaus Casino',
      'nove-lazne': 'Hotel Nové Lázně ★★★★★',
      pacifik: 'Hotel Pacifik ★★★★',
      butterfly: 'Hotel Butterfly ★★★★',
      hvezda: 'Hotel Hvězda ★★★★',
    },
    names: {
      marble: 'Marmorsaal',
      mirror: 'Spiegelsaal',
      red: 'Roter Saal',
      pink: 'Rosa Salon',
      gallery1: 'Galerie I',
      gallery2: 'Galerie II',
      edward: 'Edward-Bibliothek',
      green: 'Grüner Salon',
      cook: 'Captain-James-Cook-Salon',
      bellevue: 'Salon Bellevue',
      imperial: 'Café Imperial',
    },
    note: 'Alle Räume haben Tageslicht. Die Säle im Casino haben Parkett, die Salons in den Hotels Teppich. Das Casino verfügt zusätzlich über eine gusseiserne Außenterrasse (saisonal) und ein Café im Foyer.',
    dash: '—',
  },
  gastronomy: {
    eyebrow: 'Gastronomie',
    heading: 'Sieben Küchen, ein Team',
    lead: 'Galadinner unter Lüstern, Empfang im Foyer, Kaffeepause auf der Terrasse oder Grillabend im Park. Das Menü stellen wir nach Ihrer Veranstaltung zusammen — vom Drei-Gänge-Mittagessen für den Vorstand bis zum Buffet für fünfhundert.',
    items: [
      'Galadinner und Bankette',
      'Empfänge, Buffets und Cocktails',
      'Kaffeepausen nach Programm',
      'Live Cooking und Barkeeper-Show',
      'Erlebnisverkostungen',
      'Grillen im Freien',
      'Beer & Wine Party',
    ],
    note: 'Speisen und Getränke in den Sälen kommen aus den Hotelküchen — eigenes Catering ist aus hygienischen Gründen nicht möglich. Wein zur Veranstaltung lässt sich direkt im Hotel bestellen; für mitgebrachten Alkohol wird Korkgeld berechnet.',
    restaurants: 'Royal im Nové Lázně · Goethe im Centrální Lázně · Franz Josef & Sissi und Café Imperial im Hvězda · Primavera im Pacifik · La Fontaine im Butterfly · Regina im Vltava · Carlton im Svoboda',
  },
  day: {
    eyebrow: 'WellMeeting®',
    heading: 'Ein Tag im Kurort statt eines Tages im Tagungshotel',
    lead: 'Bewegung, gutes Essen und Pausen, die wirklich erholen. So kann ein Tag Ihrer Veranstaltung aussehen — jeden Punkt streichen Sie oder ergänzen ihn.',
    items: [
      { time: '7:30', title: 'Nordic Walking durch den Park', text: 'Stöcke leihen wir, die Route führt an den Quellen entlang. Wer lieber läuft, hat die Waldrunden hinter dem Hotel.' },
      { time: '9:00', title: 'Tagung', text: 'Tageslicht, Konferenz-WLAN, Technik nach Ihren Vorgaben.' },
      { time: '11:00', title: 'Kaffeepause „to go"', text: 'Smoothie-Bar und Fit Bites — und fünfzehn Minuten auf der Terrasse statt am Tisch.' },
      { time: '13:00', title: 'Mittagessen', text: 'Im Hotelrestaurant, verbunden durch den Korridor. Healthy Choice für alle, die am Nachmittag noch denken wollen.' },
      { time: '15:30', title: 'Massagen in der Pause', text: 'Kurze Nackenmassagen direkt am Saal, oder Aqua-Training im Pool.' },
      { time: '19:00', title: 'Abendessen', text: 'Gala im Marmorsaal — oder Grillen auf der Terrasse, wenn das Wetter mitspielt.' },
      { time: '21:00', title: 'Römisches Bad', text: 'Das Becken von 1896 für Gäste der Hotels Nové Lázně und Centrální Lázně — den Rest des Abends ohne Telefon.' },
    ],
    footnote: 'Fürs Zimmer: Kissenauswahl, Fitness-Kit und ein „Pyjama" fürs Handy — für ruhigeren Schlaf vor dem zweiten Tag.',
  },
  after: {
    heading: 'Nach der Sitzung',
    lead: 'Drei Dinge, die den Teilnehmern länger im Kopf bleiben als die Präsentation.',
    items: [
      { key: 'spa', title: 'Römisches Bad und Königskabine', text: 'Das Becken unter den Gewölben von 1896 und ein Mineralbad in der Kabine, in der Edward VII. badete. Geschichte, die man am Nachmittag ausprobieren kann.', linkLabel: 'Über das Römische Bad' },
      { key: 'golf', title: 'Golf auf dem Platz von 1905', text: 'Den Royal Golf Club gründete der britische König. Für Anfänger gibt es die öffentliche Chip-&-Putt-Neun — ohne Platzreife, ideal fürs Teambuilding.', linkLabel: 'Golf in Marienbad' },
      { key: 'trips', title: 'Ausflug für die ganze Gruppe', text: 'Kladská mit seinen Hochmooren, das Kloster Tepl, Metternichs Schloss Königswart, die Burg Elbogen oder Petschau mit dem Reliquiar des heiligen Maurus — alles innerhalb einer Stunde.', linkLabel: 'Ausflugstipps' },
    ],
  },
  travel: {
    heading: 'Anreise',
    lead: 'Marienbad liegt auf halbem Weg zwischen Prag und Nürnberg. Für ein Team aus Bayern ist es näher als München.',
    distances: [
      { place: 'Flughafen Karlsbad', km: '50 km' },
      { place: 'Prag', km: '160 km' },
      { place: 'Nürnberg', km: '170 km' },
      { place: 'München', km: '280 km' },
      { place: 'Frankfurt', km: '410 km' },
      { place: 'Berlin · Wien', km: '420 km' },
    ],
    parking: 'Zentraler Parkplatz mit rund 500 Plätzen und Parkhaus mit rund 300 Plätzen, beide wenige Minuten vom Casino.',
    wifi: 'Im gesamten Casino steht für die Dauer der Veranstaltung ein Konferenz-WLAN zur Verfügung; jeder Stand hat eine 230-V-Steckdose.',
  },
  benefits: {
    heading: 'Kuraufenthalte als Mitarbeiter-Benefit',
    body: 'In das Wohlbefinden der Mitarbeiter zu investieren zahlt sich aus. Ein Regenerationsaufenthalt im Kurort — Anwendungen, Pool, Sauna, Fitness — ist ein Benefit, an den man sich länger erinnert als an einen Gutschein. Für Unternehmen erstellen wir vergünstigte Angebote nach Maß.',
    cta: 'Angebot für Mitarbeiter anfragen',
  },
  faq: {
    heading: 'Was Organisatoren fragen',
    lead: 'Antworten auf die Fragen, die fast immer in der ersten E-Mail stehen.',
    items: [
      { q: 'Wie lange im Voraus reservieren?', a: 'Die großen Säle im Casino sind im Herbst und vor Weihnachten oft ein Jahr im Voraus belegt; Salons in den Hotels lassen sich auch in Wochen vereinbaren. Schreiben Sie uns Termin und Personenzahl — wir antworten mit freien Varianten.' },
      { q: 'Passen alle Teilnehmer in ein Hotel?', a: 'Bis zweihundert Personen ja — das Hvězda hat 238 Zimmer, das Centrální Lázně 144. Größere Gruppen verteilen wir auf die durch den Korridor verbundenen Hotels, sodass alle trockenen Fußes zur Veranstaltung kommen.' },
      { q: 'Lassen sich Säle verbinden oder teilen?', a: 'Das Casino bietet sechs Räume in einem Gebäude — Plenum, parallele Sektionen und Workshops finden unter einem Dach statt. Die konkrete Kombination und Umbauzeiten bestätigt die Konferenzabteilung.' },
      { q: 'Wie ist das mit Partnerständen und Ausstellern?', a: 'Für Aussteller gibt es ein eigenes Handbuch: Freigabe der Standvisualisierung, Anlieferung im Voraus, Strom, Parkettboden ohne Metallrollen. Wir schicken es mit dem Angebot.' },
      { q: 'Und die Technik?', a: 'Basisprojektion und Beschallung stellen wir; größere Installationen (LED-Wand, Dolmetschen, Streaming) vereinbaren wir mit Ihnen oder Ihrem Dienstleister. Höherer Stromverbrauch ist vorab anzumelden.' },
      { q: 'Dürfen wir eigenes Catering mitbringen?', a: 'Nein — Speisen in den Sälen kommen ausschließlich aus den Hotelküchen. Alkoholfreie Getränke und Kaffee am eigenen Stand sind in Ordnung, für mitgebrachten Alkohol wird Korkgeld berechnet.' },
      { q: 'Wie läuft die Zahlung?', a: 'In der Regel in zwei Raten: die Hälfte innerhalb von 20 Tagen nach Auftragsbestätigung, die Hälfte vor der Veranstaltung. Preise verstehen sich ohne MwSt., eine Stornierung nach Bestätigung kann bis zur vollen Höhe berechnet werden. Details stehen im Angebot.' },
    ],
  },
  finalCta: {
    heading: 'Schreiben Sie uns Termin und Personenzahl',
    body: 'Unser Conference Manager meldet sich mit einem Vorschlag für Säle, Unterkunft und Programm. Unverbindlich und innerhalb von zwei Werktagen.',
    cta: 'Firmenevent anfragen',
    managerLabel: 'Conference Manager',
    deptLabel: 'Konferenzabteilung',
  },
  related: {
    heading: 'Das könnte Sie interessieren',
    items: [
      { title: 'Hochzeit in Marienbad', note: 'Dieselben Säle, ein anderer Tag — Trauung auf der Kolonnade und Festmahl im Marmorsaal.' },
      { title: 'Weihnachten und Silvester', note: 'Adventsstadt, Silvestergala und was man zwischen den Feiertagen unternimmt.' },
      { title: 'Unterkunft', note: 'Sieben Ensana-Hotels von drei bis fünf Sternen.' },
    ],
  },
  alts: {
    hero: 'Marmorsaal des Gesellschaftshauses Casino, zum Bankett gedeckt, Freskendecke und Kristalllüster',
    christmas: 'Festlicher Blumenschmuck auf einem Tisch im Saal des Casinos',
    conference: 'Salon Bellevue im Hotel Butterfly, vorbereitet für eine Tagung',
    offsite: 'Captain-James-Cook-Salon im Hotel Pacifik',
    board: 'Edward-Bibliothek im Hotel Nové Lázně — Konferenztisch zwischen Bücherwänden',
    boardGreen: 'Grüner Salon im Hotel Nové Lázně',
    boardLibrary: 'Bücherschränke und Sessel in der Edward-Bibliothek des Hotels Nové Lázně',
    gastro1: 'Cremesuppe, am Tisch eingegossen',
    gastro2: 'Flambiertes Gemüse in der Pfanne',
    gastro3: 'Dessert aus Birnen in Schokolade',
    gastro4: 'Café Imperial im Hotel Hvězda',
    day: 'Innenraum der gusseisernen Hauptkolonnade',
    travel: 'Luftaufnahme des Kurviertels von Marienbad',
    cta: 'Hauptkolonnade von Marienbad',
  },
}

const en: CorporateContent = {
  metaTitle: 'Corporate Events in Mariánské Lázně — Conferences, Parties, Board Meetings',
  metaDescription:
    'A ballroom from 1867 for 450 guests, seven hotels linked by a covered corridor and a spa 200 metres from the meeting room. Hall capacities, catering, WellMeeting® and a direct line to the conference team.',
  breadcrumb: 'Corporate events',
  hero: {
    eyebrow: 'Conferences · parties · board meetings',
    heading: 'Corporate events in a spa town where nobody needs a car',
    lead: 'Seven hotels, 900 rooms, ten halls and the Roman Baths — all joined by a covered corridor. From arrival to departure, your people need neither a coat nor a taxi. From a board meeting for twenty to a congress for five hundred.',
    ctaPrimary: 'Request a date',
    ctaSecondary: 'Hall capacities',
  },
  facts: [
    { value: '500', label: 'guests in the Casino', note: 'Marble Hall from 1867' },
    { value: '900+', label: 'rooms', note: 'seven hotels, one destination' },
    { value: '10', label: 'halls and lounges', note: 'from 20 to 450 seats' },
    { value: '160 km', label: 'from Prague', note: 'Nuremberg 170, Munich 280' },
  ],
  corridor: {
    heading: 'From the meeting room to the pool of the Roman Baths is 200 metres of corridor',
    body: 'The Casino Conference Centre is linked by a covered corridor to the hotels Nové Lázně, Centrální Lázně and Hvězda. Halls, rooms, restaurants, pool and treatments sit under one roof — and the other four hotels are a few minutes on foot across the park. If it rains in November, your people will not notice.',
  },
  situations: {
    eyebrow: 'Four occasions',
    heading: 'What you can host here',
    lead: 'Every event wants a different hall and a different tone. Here are the four we host most often — and the room we would recommend first for each.',
    roomLabel: 'Recommended room',
    sizeLabel: 'Event size',
    items: [
      {
        key: 'christmas',
        title: 'Christmas party',
        tagline: 'Under crystal chandeliers, with a bed one floor up',
        body: 'The Marble Hall has frescoes, chandeliers and a parquet floor people have danced on since 1867. Your team sleeps in the hotel next door, joined by the corridor — nobody organises taxis, nobody has to stay sober. Breakfast in the morning, and the pool for those who want it. Smaller companies get the same atmosphere at a more intimate scale in the Red Hall.',
        room: 'Marble Hall (250 seated / 300 reception) · Red Hall (130 / 180)',
        size: '60–300 people',
        linkLabel: 'Christmas in Mariánské Lázně',
      },
      {
        key: 'conference',
        title: 'Conference and congress',
        tagline: 'The whole Casino, three hotels without stepping outside',
        body: 'Plenary in the Marble Hall for 450, parallel sessions in the Mirror and Red Halls, workshops in the galleries, partner stands in the foyer. Conference Wi-Fi throughout the building and catering from the hotel kitchens served to your programme. Exhibitors get a dedicated manual covering everything from floor loads to customs paperwork.',
        room: 'Casino Conference Centre — all six spaces',
        size: '100–500 people',
        linkLabel: 'Hall capacities',
      },
      {
        key: 'offsite',
        title: 'Off-site meeting',
        tagline: 'Two days the team will not forget',
        body: 'Work in a daylit lounge in the morning; in the afternoon, golf on the oldest course in the country, disc golf in the forest or archery with an instructor. A barbecue or tasting in the evening, Nordic walking past the springs at dawn. We build the WellMeeting® programme with you — movement and breaks are part of the meeting, not an add-on.',
        room: 'Salon Bellevue at the Butterfly (90) · Gallery I at the Casino (100) · Captain Cook Lounge at the Pacifik (50)',
        size: '20–100 people',
        linkLabel: 'A day here',
      },
      {
        key: 'board',
        title: 'Board meeting',
        tagline: 'Small, quiet and with an excellent kitchen',
        body: "Edward's Library in the five-star Nové Lázně: books along the walls, daylight, carpet, fifty around the table and twenty in comfort. Lunch at the Royal restaurant one floor down; after the meeting, the Roman Baths of 1896 or a mineral bath in the Royal Cabin of Edward VII. For the innermost circle there is the Green Lounge next door — twenty people at a single table.",
        room: "Edward's Library (boardroom 50) · Green Lounge (20)",
        size: '8–50 people',
        linkLabel: 'Hotel Nové Lázně',
      },
    ],
  },
  halls: {
    heading: 'Hall and lounge capacities',
    lead: 'Eleven spaces across the Casino and four hotels. Figures are from the Ensana conference brochure; layout, stage and equipment are confirmed by the conference team on booking.',
    cols: { name: 'Room', area: 'Area', theatre: 'Theatre', classroom: 'Classroom', banquet: 'Banquet', ushape: 'U-shape', reception: 'Reception', boardroom: 'Boardroom' },
    groups: {
      casino: 'Casino Conference Centre',
      'nove-lazne': 'Hotel Nové Lázně ★★★★★',
      pacifik: 'Hotel Pacifik ★★★★',
      butterfly: 'Hotel Butterfly ★★★★',
      hvezda: 'Hotel Hvězda ★★★★',
    },
    names: {
      marble: 'Marble Hall',
      mirror: 'Mirror Hall',
      red: 'Red Hall',
      pink: 'Pink Lounge',
      gallery1: 'Gallery I',
      gallery2: 'Gallery II',
      edward: "Edward's Library",
      green: 'Green Lounge',
      cook: "Captain James Cook's Lounge",
      bellevue: 'Salon Bellevue',
      imperial: 'Café Imperial',
    },
    note: 'All rooms have daylight. The Casino halls have parquet floors, the hotel lounges carpet. The Casino also has a cast-iron outdoor terrace (seasonal) and a café in the foyer.',
    dash: '—',
  },
  gastronomy: {
    eyebrow: 'Catering',
    heading: 'Seven kitchens, one team',
    lead: 'A gala dinner under the chandeliers, a reception in the foyer, a coffee break on the terrace or a barbecue in the park. We build the menu around your event — from a three-course board lunch to a buffet for five hundred.',
    items: [
      'Gala dinners and banquets',
      'Receptions, buffets and cocktails',
      'Coffee breaks to your programme',
      'Live cooking and barman show',
      'Tasting experiences',
      'Outdoor barbecue',
      'Beer & wine party',
    ],
    note: 'Food and drink in the halls come from the hotel kitchens — outside catering is not possible for hygiene reasons. Wine for the event can be ordered directly from the hotel; corkage applies to alcohol you bring.',
    restaurants: 'Royal at Nové Lázně · Goethe at Centrální Lázně · Franz Josef & Sissi and Café Imperial at Hvězda · Primavera at Pacifik · La Fontaine at Butterfly · Regina at Vltava · Carlton at Svoboda',
  },
  day: {
    eyebrow: 'WellMeeting®',
    heading: 'A day in a spa town instead of a day in a conference hotel',
    lead: 'Movement, good food and breaks that actually restore. This is what one day of your event could look like — strike out or add any line.',
    items: [
      { time: '7:30', title: 'Nordic walking through the park', text: 'We lend the poles; the route passes the springs. Runners have the forest loops behind the hotel.' },
      { time: '9:00', title: 'Meeting', text: 'Daylight, conference Wi-Fi, equipment to your brief.' },
      { time: '11:00', title: 'Coffee break to go', text: 'Smoothie bar and fit bites — and fifteen minutes on the terrace instead of at the table.' },
      { time: '13:00', title: 'Lunch', text: 'In the hotel restaurant along the corridor. Healthy Choice for anyone who wants to think in the afternoon.' },
      { time: '15:30', title: 'Massages in the break', text: 'Short neck massages right by the hall, or aqua training in the pool.' },
      { time: '19:00', title: 'Dinner', text: 'A gala in the Marble Hall — or a barbecue on the terrace when the weather allows.' },
      { time: '21:00', title: 'Roman Baths', text: 'The 1896 pool for guests of Nové Lázně and Centrální Lázně — the rest of the evening without a phone.' },
    ],
    footnote: 'In the room: pillow menu, a fitness kit and a “pyjama” for the phone — for a quieter night before day two.',
  },
  after: {
    heading: 'After the meeting',
    lead: 'Three things participants will remember longer than the slides.',
    items: [
      { key: 'spa', title: 'Roman Baths and the Royal Cabin', text: 'The pool beneath the vaults of 1896 and a mineral bath in the cabin where Edward VII bathed. History you can try out in an afternoon.', linkLabel: 'About the Roman Baths' },
      { key: 'golf', title: 'Golf on a course from 1905', text: 'The Royal Golf Club was founded by the British king. Beginners have the public Chip & Putt nine — no handicap needed, ideal for team building.', linkLabel: 'Golf in Mariánské Lázně' },
      { key: 'trips', title: 'A trip for the whole group', text: 'Kladská and its peat bogs, Teplá monastery, Metternich’s château at Kynžvart, Loket castle or Bečov with the reliquary of St Maurus — all within an hour.', linkLabel: 'Day-trip ideas' },
    ],
  },
  travel: {
    heading: 'Getting here',
    lead: 'Mariánské Lázně sits halfway between Prague and Nuremberg. For a team from Bavaria it is closer than Munich.',
    distances: [
      { place: 'Karlovy Vary airport', km: '50 km' },
      { place: 'Prague', km: '160 km' },
      { place: 'Nuremberg', km: '170 km' },
      { place: 'Munich', km: '280 km' },
      { place: 'Frankfurt', km: '410 km' },
      { place: 'Berlin · Vienna', km: '420 km' },
    ],
    parking: 'A central car park with around 500 spaces and a multi-storey with around 300, both a few minutes from the Casino.',
    wifi: 'Conference Wi-Fi covers the whole Casino for the duration of the event; every stand has a 230 V socket.',
  },
  benefits: {
    heading: 'Spa stays as an employee benefit',
    body: 'Investing in employee wellbeing pays off. A recuperation stay in a spa town — treatments, pool, sauna, fitness — is a benefit people remember longer than a voucher. We prepare tailored offers for companies at preferential rates.',
    cta: 'Request an offer for your staff',
  },
  faq: {
    heading: 'What organisers ask',
    lead: 'Answers to the questions that appear in almost every first e-mail.',
    items: [
      { q: 'How far ahead should we book?', a: 'The large Casino halls are often taken a year ahead in autumn and before Christmas; hotel lounges can be arranged within weeks. Send us a date and headcount — we reply with the options that are free.' },
      { q: 'Will everyone fit into one hotel?', a: 'Up to two hundred people, yes — the Hvězda has 238 rooms, the Centrální Lázně 144. Larger groups are split between the hotels on the corridor, so everyone reaches the event without going outside.' },
      { q: 'Can halls be combined or divided?', a: 'The Casino offers six spaces in one building — plenary, parallel sessions and workshops all happen under one roof. The exact combination and turnaround times are confirmed by the conference team.' },
      { q: 'What about partner stands and exhibitors?', a: 'Exhibitors get a dedicated manual: stand visual for approval, advance delivery of materials, power, and a parquet floor that rules out metal castors. We send it with the offer.' },
      { q: 'What about AV equipment?', a: 'Basic projection and sound are provided; larger installations (LED wall, interpreting, streaming) are arranged with you or your supplier. Higher power draw must be announced in advance.' },
      { q: 'Can we bring our own catering?', a: 'No — food in the halls comes exclusively from the hotel kitchens. Soft drinks and coffee on your own stand are fine; corkage applies to alcohol you bring.' },
      { q: 'How does payment work?', a: 'Usually in two instalments: half within 20 days of confirming the order, half before the event. Prices exclude VAT; cancellation after confirmation may be charged up to the full amount. Details are in the offer.' },
    ],
  },
  finalCta: {
    heading: 'Send us a date and a headcount',
    body: 'Our Conference Manager will come back with a proposal for halls, accommodation and programme. No obligation, within two working days.',
    cta: 'Request a corporate event',
    managerLabel: 'Conference Manager',
    deptLabel: 'Conference department',
  },
  related: {
    heading: 'You might also like',
    items: [
      { title: 'Weddings in Mariánské Lázně', note: 'The same halls, a different day — a ceremony on the colonnade and a banquet in the Marble Hall.' },
      { title: 'Christmas and New Year', note: 'An Advent town, a New Year’s gala and what to do between the holidays.' },
      { title: 'Accommodation', note: 'Seven Ensana hotels from three to five stars.' },
    ],
  },
  alts: {
    hero: 'Marble Hall of the Casino Conference Centre laid for a banquet, frescoed ceiling and crystal chandeliers',
    christmas: 'Festive floral centrepiece on a table in the Casino hall',
    conference: 'Salon Bellevue at Hotel Butterfly set up for a meeting',
    offsite: "Captain James Cook's Lounge at Hotel Pacifik",
    board: "Edward's Library at Hotel Nové Lázně — a conference table between bookshelves",
    boardGreen: 'Green Lounge at Hotel Nové Lázně',
    boardLibrary: "Bookcases and armchairs in Edward's Library at Hotel Nové Lázně",
    gastro1: 'Cream soup poured at the table',
    gastro2: 'Vegetables flambéed in a pan',
    gastro3: 'Pears in chocolate for dessert',
    gastro4: 'Café Imperial at Hotel Hvězda',
    day: 'Interior of the cast-iron Main Colonnade',
    travel: 'Aerial view of the spa quarter of Mariánské Lázně',
    cta: 'Main Colonnade of Mariánské Lázně',
  },
}

const ru: CorporateContent = {
  metaTitle: 'Корпоративные мероприятия в Марианских Лазнях — конференции, вечеринки, заседания',
  metaDescription:
    'Зал 1867 года на 450 гостей, семь отелей, соединённых крытым коридором, и курорт в 200 метрах от переговорной. Вместимость залов, гастрономия, WellMeeting® и контакт конференц-отдела.',
  breadcrumb: 'Корпоративные мероприятия',
  hero: {
    eyebrow: 'Конференции · вечеринки · заседания',
    heading: 'Корпоративные мероприятия на курорте, где никуда не нужно ехать',
    lead: 'Семь отелей, 900 номеров, десять залов и Римские бани — всё соединено крытым коридором. Вашим участникам от приезда до отъезда не понадобятся ни пальто, ни такси. От заседания правления на двадцать человек до конгресса на пятьсот.',
    ctaPrimary: 'Запросить дату',
    ctaSecondary: 'Вместимость залов',
  },
  facts: [
    { value: '500', label: 'гостей в Казино', note: 'Мраморный зал 1867 года' },
    { value: '900+', label: 'номеров', note: 'семь отелей, одно место' },
    { value: '10', label: 'залов и салонов', note: 'от 20 до 450 мест' },
    { value: '160 км', label: 'от Праги', note: 'Нюрнберг 170, Мюнхен 280' },
  ],
  corridor: {
    heading: 'От переговорной до бассейна Римских бань — 200 метров по коридору',
    body: 'Общественный дом Казино соединён крытым коридором с отелями Nové Lázně, Centrální Lázně и Hvězda. Залы, номера, рестораны, бассейн и процедуры — под одной крышей, а остальные четыре отеля стоят в нескольких минутах ходьбы через парк. Если в ноябре идёт дождь, ваши люди этого не заметят.',
  },
  situations: {
    eyebrow: 'Четыре формата',
    heading: 'Что можно провести у нас',
    lead: 'Каждому мероприятию нужен свой зал и свой тон. Вот четыре формата, которые проходят у нас чаще всего, — и пространство, которое мы посоветовали бы первым.',
    roomLabel: 'Рекомендуемый зал',
    sizeLabel: 'Размер',
    items: [
      {
        key: 'christmas',
        title: 'Новогодний корпоратив',
        tagline: 'Под хрустальными люстрами, номер этажом выше',
        body: 'В Мраморном зале — фрески, люстры и паркет, на котором танцуют с 1867 года. Ваша команда ночует в отеле по соседству, соединённом коридором: никто не заказывает такси и никому не нужно оставаться трезвым. Утром — завтрак и, для желающих, бассейн. Небольшим компаниям та же атмосфера в камерном масштабе — в Красном зале.',
        room: 'Мраморный зал (250 за столами / 300 фуршет) · Красный зал (130 / 180)',
        size: '60–300 человек',
        linkLabel: 'Рождество в Марианских Лазнях',
      },
      {
        key: 'conference',
        title: 'Конференция и конгресс',
        tagline: 'Всё Казино и три отеля, не выходя на улицу',
        body: 'Пленарное заседание в Мраморном зале на 450 человек, параллельные секции в Зеркальном и Красном залах, воркшопы в галереях, стенды партнёров в фойе. Конференц-Wi-Fi во всём здании, кейтеринг из отельных кухонь по вашей программе. Для экспонентов есть отдельное руководство — от нагрузки на пол до таможенных формальностей.',
        room: 'Общественный дом Казино — все шесть пространств',
        size: '100–500 человек',
        linkLabel: 'Вместимость залов',
      },
      {
        key: 'offsite',
        title: 'Выездная сессия',
        tagline: 'Два дня, которые команда не забудет',
        body: 'Утром — работа в салоне с дневным светом, днём — гольф на старейшем поле Чехии, диск-гольф в лесу или стрельба из лука с инструктором. Вечером — гриль или дегустация, на рассвете — скандинавская ходьба по парку вдоль источников. Программу WellMeeting® мы составляем вместе с вами: движение и паузы — часть встречи, а не приложение к ней.',
        room: 'Салон Bellevue в Butterfly (90) · Галерея I в Казино (100) · Салон капитана Кука в Pacifik (50)',
        size: '20–100 человек',
        linkLabel: 'Программа дня',
      },
      {
        key: 'board',
        title: 'Заседание правления',
        tagline: 'Камерно, тихо и с отличной кухней',
        body: 'Библиотека Эдуарда в пятизвёздочном отеле Nové Lázně: книги вдоль стен, дневной свет, ковёр, за столом — пятьдесят человек, с комфортом — двадцать. Обед в ресторане Royal этажом ниже, после заседания — Римские бани 1896 года или минеральная ванна в Королевской кабине Эдуарда VII. Для самого узкого круга рядом есть Зелёный салон — двадцать человек за одним столом.',
        room: 'Библиотека Эдуарда (boardroom 50) · Зелёный салон (20)',
        size: '8–50 человек',
        linkLabel: 'Отель Nové Lázně',
      },
    ],
  },
  halls: {
    heading: 'Вместимость залов и салонов',
    lead: 'Одиннадцать пространств в Казино и четырёх отелях. Цифры — из конференц-брошюры Ensana; рассадку, сцену и технику подтверждает конференц-отдел при бронировании.',
    cols: { name: 'Зал', area: 'Площадь', theatre: 'Театр', classroom: 'Класс', banquet: 'Банкет', ushape: 'U-стол', reception: 'Фуршет', boardroom: 'Boardroom' },
    groups: {
      casino: 'Общественный дом Казино',
      'nove-lazne': 'Отель Nové Lázně ★★★★★',
      pacifik: 'Отель Pacifik ★★★★',
      butterfly: 'Отель Butterfly ★★★★',
      hvezda: 'Отель Hvězda ★★★★',
    },
    names: {
      marble: 'Мраморный зал',
      mirror: 'Зеркальный зал',
      red: 'Красный зал',
      pink: 'Розовый салон',
      gallery1: 'Галерея I',
      gallery2: 'Галерея II',
      edward: 'Библиотека Эдуарда',
      green: 'Зелёный салон',
      cook: 'Салон капитана Джеймса Кука',
      bellevue: 'Салон Bellevue',
      imperial: 'Café Imperial',
    },
    note: 'Во всех залах есть дневной свет. В залах Казино — паркет, в салонах отелей — ковёр. У Казино есть также чугунная открытая терраса (сезонно) и кафе в фойе.',
    dash: '—',
  },
  gastronomy: {
    eyebrow: 'Гастрономия',
    heading: 'Семь кухонь, одна команда',
    lead: 'Гала-ужин под люстрами, фуршет в фойе, кофе-брейк на террасе или гриль в парке. Меню мы составляем под ваше мероприятие — от обеда из трёх блюд для правления до буфета на пятьсот человек.',
    items: [
      'Гала-ужины и банкеты',
      'Приёмы, фуршеты и коктейли',
      'Кофе-брейки по программе',
      'Live cooking и шоу бармена',
      'Дегустации',
      'Гриль на открытом воздухе',
      'Beer & wine party',
    ],
    note: 'Еда и напитки в залах — из отельных кухонь; собственный кейтеринг по гигиеническим правилам невозможен. Вино к мероприятию можно заказать в отеле; за принесённый алкоголь взимается пробковый сбор.',
    restaurants: 'Royal в Nové Lázně · Goethe в Centrální Lázně · Franz Josef & Sissi и Café Imperial в Hvězda · Primavera в Pacifik · La Fontaine в Butterfly · Regina во Vltava · Carlton в Svoboda',
  },
  day: {
    eyebrow: 'WellMeeting®',
    heading: 'День на курорте вместо дня в конференц-отеле',
    lead: 'Движение, хорошая еда и паузы, которые действительно восстанавливают. Так может выглядеть один день вашего мероприятия — любой пункт можно вычеркнуть или добавить.',
    items: [
      { time: '7:30', title: 'Скандинавская ходьба по парку', text: 'Палки дадим, маршрут проходит вдоль источников. Кто предпочитает бег — лесные круги за отелем.' },
      { time: '9:00', title: 'Заседание', text: 'Дневной свет, конференц-Wi-Fi, техника по вашему заданию.' },
      { time: '11:00', title: 'Кофе-брейк «с собой»', text: 'Смузи-бар и fit bites — и пятнадцать минут на террасе вместо стола.' },
      { time: '13:00', title: 'Обед', text: 'В ресторане отеля, соединённого коридором. Healthy Choice для тех, кто хочет думать и после обеда.' },
      { time: '15:30', title: 'Массаж в перерыве', text: 'Короткий массаж шеи прямо у зала или аква-тренировка в бассейне.' },
      { time: '19:00', title: 'Ужин', text: 'Гала в Мраморном зале — или гриль на террасе, если позволит погода.' },
      { time: '21:00', title: 'Римские бани', text: 'Бассейн 1896 года для гостей отелей Nové Lázně и Centrální Lázně — остаток вечера без телефона.' },
    ],
    footnote: 'В номере: меню подушек, фитнес-набор и «пижама» для телефона — ради спокойного сна перед вторым днём.',
  },
  after: {
    heading: 'После заседания',
    lead: 'Три вещи, которые участники запомнят дольше, чем презентацию.',
    items: [
      { key: 'spa', title: 'Римские бани и Королевская кабина', text: 'Бассейн под сводами 1896 года и минеральная ванна в кабине, где купался Эдуард VII. История, которую можно попробовать за один вечер.', linkLabel: 'О Римских банях' },
      { key: 'golf', title: 'Гольф на поле 1905 года', text: 'Royal Golf Club основал британский король. Для новичков — общедоступная девятка Chip & Putt без «зелёной карты», идеально для тимбилдинга.', linkLabel: 'Гольф в Марианских Лазнях' },
      { key: 'trips', title: 'Экскурсия для всей группы', text: 'Кладска с торфяниками, монастырь Тепла, замок Меттерниха в Кинжварте, крепость Локет или Бечов с реликварием святого Мавра — всё в пределах часа.', linkLabel: 'Идеи для экскурсий' },
    ],
  },
  travel: {
    heading: 'Как добраться',
    lead: 'Марианские Лазни лежат на полпути между Прагой и Нюрнбергом. Для команды из Баварии это ближе, чем Мюнхен.',
    distances: [
      { place: 'Аэропорт Карловы Вары', km: '50 км' },
      { place: 'Прага', km: '160 км' },
      { place: 'Нюрнберг', km: '170 км' },
      { place: 'Мюнхен', km: '280 км' },
      { place: 'Франкфурт', km: '410 км' },
      { place: 'Берлин · Вена', km: '420 км' },
    ],
    parking: 'Центральная парковка примерно на 500 мест и паркинг примерно на 300 мест — оба в нескольких минутах от Казино.',
    wifi: 'На время мероприятия во всём Казино работает конференц-Wi-Fi; у каждого стенда есть розетка 230 В.',
  },
  benefits: {
    heading: 'Оздоровительные заезды как бонус для сотрудников',
    body: 'Забота о благополучии сотрудников окупается. Восстановительный заезд на курорт — процедуры, бассейн, сауна, фитнес — это бонус, который запоминается дольше, чем подарочный сертификат. Для компаний мы готовим индивидуальные предложения на льготных условиях.',
    cta: 'Запросить предложение для сотрудников',
  },
  faq: {
    heading: 'О чём спрашивают организаторы',
    lead: 'Ответы на вопросы, которые почти всегда есть в первом письме.',
    items: [
      { q: 'За сколько бронировать?', a: 'Большие залы Казино осенью и перед Рождеством часто заняты за год вперёд; салоны в отелях можно согласовать и за несколько недель. Напишите нам дату и число участников — мы ответим свободными вариантами.' },
      { q: 'Поместятся ли все участники в один отель?', a: 'До двухсот человек — да: в Hvězda 238 номеров, в Centrální Lázně 144. Более крупные группы мы распределяем между отелями, соединёнными коридором, так что на мероприятие все приходят, не выходя на улицу.' },
      { q: 'Можно ли объединять или делить залы?', a: 'В Казино шесть пространств в одном здании — пленарное заседание, параллельные секции и воркшопы проходят под одной крышей. Конкретную комбинацию и время перестановки подтвердит конференц-отдел.' },
      { q: 'Что со стендами партнёров и экспонентами?', a: 'Для экспонентов есть отдельное руководство: согласование визуализации стенда, доставка материалов заранее, электричество, паркет без металлических колёсиков. Мы отправим его вместе с предложением.' },
      { q: 'Как с техникой?', a: 'Базовую проекцию и звук мы обеспечиваем; более крупные инсталляции (LED-стена, синхронный перевод, стриминг) согласуем с вами или вашим подрядчиком. О повышенном потреблении электроэнергии нужно сообщить заранее.' },
      { q: 'Можно привезти свой кейтеринг?', a: 'Нет — еда в залах поступает исключительно из отельных кухонь. Безалкогольные напитки и кофе на собственном стенде допустимы; за принесённый алкоголь взимается пробковый сбор.' },
      { q: 'Как проходит оплата?', a: 'Обычно двумя частями: половина в течение 20 дней после подтверждения заказа, половина — до мероприятия. Цены указаны без НДС; отмена после подтверждения может быть выставлена к оплате вплоть до полной суммы. Подробности — в предложении.' },
    ],
  },
  finalCta: {
    heading: 'Напишите нам дату и число участников',
    body: 'Наш Conference Manager ответит предложением по залам, размещению и программе. Без обязательств, в течение двух рабочих дней.',
    cta: 'Запросить мероприятие',
    managerLabel: 'Conference Manager',
    deptLabel: 'Конференц-отдел',
  },
  related: {
    heading: 'Возможно, вам будет интересно',
    items: [
      { title: 'Свадьба в Марианских Лазнях', note: 'Те же залы, другой день — церемония на колоннаде и банкет в Мраморном зале.' },
      { title: 'Рождество и Новый год', note: 'Адвент в городе, новогодний гала-вечер и чем заняться между праздниками.' },
      { title: 'Проживание', note: 'Семь отелей Ensana от трёх до пяти звёзд.' },
    ],
  },
  alts: {
    hero: 'Мраморный зал Общественного дома Казино, накрытый к банкету: потолок с фресками и хрустальные люстры',
    christmas: 'Праздничная цветочная композиция на столе в зале Казино',
    conference: 'Салон Bellevue в отеле Butterfly, подготовленный к заседанию',
    offsite: 'Салон капитана Джеймса Кука в отеле Pacifik',
    board: 'Библиотека Эдуарда в отеле Nové Lázně — стол для переговоров между книжными шкафами',
    boardGreen: 'Зелёный салон в отеле Nové Lázně',
    boardLibrary: 'Книжные шкафы и кресла в Библиотеке Эдуарда отеля Nové Lázně',
    gastro1: 'Крем-суп, наливаемый у стола',
    gastro2: 'Фламбирование овощей на сковороде',
    gastro3: 'Груши в шоколаде на десерт',
    gastro4: 'Café Imperial в отеле Hvězda',
    day: 'Интерьер чугунной Главной колоннады',
    travel: 'Вид с воздуха на курортный квартал Марианских Лазней',
    cta: 'Главная колоннада Марианских Лазней',
  },
}

export const corporateEventsContent: Record<Locale, CorporateContent> = { cs, de, en, ru }
