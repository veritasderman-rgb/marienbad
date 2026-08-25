/**
 * Lázeňská péče hrazená ze zdravotního pojištění — datový zdroj sekce
 * /cs/lazne-s-pojistovnou.
 *
 * Sekce je záměrně jen česky: týká se výhradně českého veřejného zdravotního
 * pojištění a návrhu na lázeňskou péči, který vystavuje český lékař.
 *
 * Zdroje faktů (nic zde není dopsáno „od stolu“):
 *  - Postup, platnosti návrhů, úhrady a rozdělení KLP/PLP: lazneml.cz
 *    („Jak získat lázeňský pobyt“, „Dotazy“), Léčebné lázně Mariánské Lázně a.s.
 *  - Ceníky doplatků 2026: oficiální PDF „Ceník komplexní lázeňské péče 2026“
 *    (změny platné od 15. 6. 2026) a „Ceník příspěvkové lázeňské péče 2026“.
 *  - Indikační kódy a rozsah hrazené péče: src/data/indications.ts
 *    (indikační seznam podle zákona č. 1/2015 Sb.) — zde se nekopírují, ale
 *    načítají, aby existoval jediný zdroj pravdy.
 *  - Léčebný obsah jednotlivých indikací: stránky lazneml.cz k jednotlivým
 *    skupinám onemocnění.
 *  - Turistická karta města: marianskelazne.cz, ceny platné od 1. 1. 2025.
 *  - Přeprava zavazadel: ceník Českých drah (spoluzavazadla) a Balík Do ruky
 *    České pošty.
 */

export const INSURANCE_BASE = '/cs/lazne-s-pojistovnou'

/* ------------------------------------------------------------------ *
 * Kontakty
 * ------------------------------------------------------------------ */

export const contacts = {
  infoPhone: '+420 354 655 504',
  infoPhoneHref: 'tel:+420354655504',
  reservationPhones: ['+420 354 635 082', '+420 354 662 138'],
  reservationPhoneHrefs: ['tel:+420354635082', 'tel:+420354662138'],
  email: 'rezervacezp@cz.ensanahotels.com',
  reservationUrl: 'https://lazneml.cz/rezervace-pobytu/',
  company: 'Léčebné lázně Mariánské Lázně a.s.',
  address: 'Masarykova 22, 353 01 Mariánské Lázně',
} as const

/* ------------------------------------------------------------------ *
 * Podstránky sekce
 * ------------------------------------------------------------------ */

export interface SubPage {
  slug: string
  navLabel: string
  title: string
  metaTitle: string
  metaDescription: string
  lead: string
  /** Klíč ikony v komponentě InsuranceNavCards.astro */
  icon: 'document' | 'compare' | 'price' | 'stethoscope' | 'suitcase' | 'hotel' | 'question'
  /** Snímek pod hlavičkou podstránky. Cesty vedou na fotky, které web už
   *  používá jinde — mají hotové WebP varianty v manifestu. Volitelný: přehled
   *  hotelů banner nemá, protože jeho snímek nese hned první karta v seznamu. */
  image?: string
  imageAlt?: string
}

export const subPages: SubPage[] = [
  {
    slug: 'jak-ziskat-navrh',
    navLabel: 'Jak získat návrh',
    title: 'Jak získat návrh na lázeňskou péči',
    metaTitle: 'Jak získat návrh na lázeňskou péči krok za krokem | Marienbad.com',
    metaDescription:
      'Který lékař vystavuje návrh na lázeňskou péči, co mu máte přinést, jak dlouho návrh platí a co dělat, když ho pojišťovna neschválí. Postup krok za krokem.',
    lead:
      'Návrh na lázeňskou péči nevystavují lázně, ale váš lékař. Tady je celý postup od první návštěvy ordinace až po pozvánku k nástupu — včetně toho, co si připravit a na co si dát pozor.',
    icon: 'document',
    image: '/images/content/articles/cs-rehabilitace-po-covidu/coverImage.jpg',
    imageAlt: 'Dvojice lázeňských hostů s porcelánovými pohárky před kolonádou',
  },
  {
    slug: 'komplexni-a-prispevkova-pece',
    navLabel: 'Komplexní vs. příspěvková',
    title: 'Komplexní a příspěvková lázeňská péče',
    metaTitle: 'Komplexní vs. příspěvková lázeňská péče — rozdíly a úhrady | Marienbad.com',
    metaDescription:
      'Co u komplexní (KLP) a příspěvkové (PLP) lázeňské péče hradí zdravotní pojišťovna a co si platíte sami, jak dlouhý je pobyt a kdy se čerpá. Přehledné srovnání.',
    lead:
      'Dva typy hrazené lázeňské péče se liší v jediné, ale zásadní věci — kolik za vás zaplatí pojišťovna. Následující srovnání ukazuje, co který typ zahrnuje a co znamená pro váš rozpočet i pro plánování volna.',
    icon: 'compare',
    image: '/images/hotels/hotels/5/images/0/image.jpg',
    imageAlt: 'Lázeňský hotel Vltava — žlutá fasáda s balkony nad lázeňskou částí města',
  },
  {
    slug: 'cenik-doplatku',
    navLabel: 'Ceník doplatků 2026',
    title: 'Ceník doplatků 2026',
    metaTitle: 'Ceník doplatků lázeňské péče 2026 — Mariánské Lázně | Marienbad.com',
    metaDescription:
      'Kompletní ceník doplatků komplexní i příspěvkové lázeňské péče 2026 podle hotelu, kategorie pokoje a sezóny. Včetně lázeňské taxy a dalších poplatků.',
    lead:
      'Ceny za osobu v Kč včetně DPH podle oficiálních ceníků Léčebných lázní Mariánské Lázně a.s. pro rok 2026. U komplexní péče jde o doplatek k tomu, co hradí pojišťovna; u příspěvkové péče o cenu ubytování a stravy, kterou hradíte celou.',
    icon: 'price',
    image: '/images/hotels/hotels/1/images/0/image.jpg',
    imageAlt: 'Lázeňský hotel Centrální Lázně s bílou historizující fasádou pod zalesněným svahem',
  },
  {
    slug: 'indikace',
    navLabel: 'Léčené diagnózy',
    title: 'Které diagnózy se v Mariánských Lázních léčí',
    metaTitle: 'Indikace lázeňské léčby v Mariánských Lázních — 9 skupin diagnóz | Marienbad.com',
    metaDescription:
      'Devět indikačních skupin léčených v Mariánských Lázních — od pohybového ústrojí přes ledviny a dýchací cesty po kožní nemoci. S indikačními kódy a délkou hrazeného pobytu.',
    lead:
      'Zda máte na lázně nárok, rozhoduje diagnóza a indikační seznam. Vyberte skupinu, která odpovídá vašemu onemocnění — u každé najdete, co se léčí, jakými procedurami a jak dlouhý pobyt pojišťovna hradí.',
    icon: 'stethoscope',
    image: '/images/content/articles/cs-lazenska-lecba-pruvodce/coverImage.jpg',
    imageAlt: 'Hostka v županu u nerezové vany napuštěné minerální vodou',
  },
  {
    slug: 'pobyt-a-prijezd',
    navLabel: 'Cesta a průběh pobytu',
    title: 'Cesta do lázní a průběh pobytu',
    metaTitle: 'Cesta do Mariánských Lázní a průběh lázeňského pobytu | Marienbad.com',
    metaDescription:
      'Jak se dostat do Mariánských Lázní vlakem, jak poslat zavazadlo napřed, čím se dopravit z nádraží a jak vypadá běžný den lázeňského pobytu. Praktický průvodce.',
    lead:
      'Cesta do lázní se dá zvládnout bez auta i bez těžkého kufru. Tady je vše, co potřebujete vědět od nákupu jízdenky po vstupní lékařskou prohlídku a běžný denní režim.',
    icon: 'suitcase',
    image: '/images/content/articles/cs-vlakem-do-mariansk-lazni/coverImage.jpg',
    imageAlt: 'Nástupiště železniční stanice Mariánské Lázně s podsvíceným názvem stanice',
  },
  {
    slug: 'hotely-a-vyhody',
    navLabel: 'Hotely a výhody',
    title: 'Lázeňské hotely a co k pobytu dostanete',
    metaTitle: 'Lázeňské hotely pro pobyt s pojišťovnou a výhody pobytu | Marienbad.com',
    metaDescription:
      'Ve kterých hotelech Ensana lze čerpat lázeňskou péči hrazenou pojišťovnou, kde je ubytování bez doplatku, a co pobyt nabízí navíc — Ensana Life, turistická karta i vybavení města.',
    lead:
      'Léčba i procedury probíhají většinou v budově, kde bydlíte, případně v budovách spojených koridorem — mezi léčbou a pokojem se tak zpravidla nechodí ven. Volba hotelu proto rozhoduje o pohodlí celého pobytu i o výši doplatku.',
    icon: 'hotel',
  },
  {
    slug: 'caste-dotazy',
    navLabel: 'Časté dotazy',
    title: 'Časté dotazy k lázeňské péči s pojišťovnou',
    metaTitle: 'Časté dotazy k lázeňské péči hrazené pojišťovnou | Marienbad.com',
    metaDescription:
      'Odpovědi na nejčastější otázky k lázeňskému pobytu přes zdravotní pojišťovnu — platnost návrhu, rezervace termínu, doplatky, doprovod i pracovní neschopnost.',
    lead:
      'Otázky, které dostáváme nejčastěji. Odpovědi vycházejí z informací Léčebných lázní Mariánské Lázně a.s. a z platné legislativy.',
    icon: 'question',
    image: '/images/library/colonnade/park-16a4873.jpg',
    imageAlt: 'Lázeňské parky v Mariánských Lázních s pavilonem a rozkvetlými záhony',
  },
]

export function getSubPage(slug: string): SubPage {
  const page = subPages.find((p) => p.slug === slug)
  if (!page) throw new Error(`Neznámá podstránka sekce: ${slug}`)
  return page
}

/* ------------------------------------------------------------------ *
 * Zdravotní pojišťovny
 * ------------------------------------------------------------------ */

export interface Insurer {
  code: string
  short: string
  name: string
}

/**
 * Léčebné lázně Mariánské Lázně a.s. jsou smluvním partnerem všech sedmi
 * zdravotních pojišťoven působících v ČR. Kód 213 patří RBP — na webu lázní je
 * u něj překlep („313“), zde je uveden správný oficiální kód.
 */
export const insurers: Insurer[] = [
  { code: '111', short: 'VZP', name: 'Všeobecná zdravotní pojišťovna ČR' },
  { code: '201', short: 'VoZP', name: 'Vojenská zdravotní pojišťovna ČR' },
  { code: '205', short: 'ČPZP', name: 'Česká průmyslová zdravotní pojišťovna' },
  { code: '207', short: 'OZP', name: 'Oborová zdravotní pojišťovna' },
  { code: '209', short: 'ZPŠ', name: 'Zaměstnanecká pojišťovna Škoda' },
  { code: '211', short: 'ZP MV ČR', name: 'Zdravotní pojišťovna ministerstva vnitra ČR' },
  { code: '213', short: 'RBP', name: 'RBP, zdravotní pojišťovna' },
]

/* ------------------------------------------------------------------ *
 * Postup ve čtyřech krocích
 * ------------------------------------------------------------------ */

export interface ProcessStep {
  n: number
  title: string
  summary: string
  body: string[]
  tip?: string
}

export const processSteps: ProcessStep[] = [
  {
    n: 1,
    title: 'Vystavení návrhu na lázeňskou péči',
    summary: 'Návrh vypisuje praktický lékař nebo ambulantní specialista.',
    body: [
      'Návrh na lázeňskou péči hrazenou zdravotní pojišťovnou vystaví praktický lékař nebo ambulantní specialista — ortoped, urolog, neurolog a další — a to na základě doporučení odborného lékaře nebo ošetřujícího lékaře při hospitalizaci.',
      'Lékař zároveň navrhne typ lázeňské péče, tedy komplexní (KLP), nebo příspěvkovou (PLP), a vhodné lázeňské místo.',
    ],
    tip:
      'Pokud vaše onemocnění patří mezi indikace pro Mariánské Lázně, požádejte lékaře, aby už do návrhu uvedl společnost Léčebné lázně Mariánské Lázně a.s. Vyhnete se tím pozdějšímu přeřazování.',
  },
  {
    n: 2,
    title: 'Schválení návrhu zdravotní pojišťovnou',
    summary: 'O návrhu rozhoduje revizní lékař vaší pojišťovny.',
    body: [
      'Návrh na komplexní i příspěvkovou lázeňskou péči posoudí revizní lékař příslušné zdravotní pojišťovny.',
      'Schválený návrh na komplexní péči odešle pojišťovna přímo léčebné společnosti. Schválený návrh na příspěvkovou péči pošle na vaši adresu — s ním se pak sami objednáte.',
      'Návrh na komplexní péči platí 3 měsíce při stupni naléhavosti II a 1 měsíc při stupni naléhavosti I. Návrh na příspěvkovou péči platí 6 měsíců ode dne vystavení navrhujícím lékařem.',
    ],
    tip:
      'Léčebný pobyt je nutné nastoupit v době platnosti návrhu — stačí i poslední den platnosti, ale ne později. Platnost návrhu prodloužit nelze.',
  },
  {
    n: 3,
    title: 'Nástup a průběh léčebného pobytu',
    summary: 'Vyberete si hotel a termín, nebo počkáte na předvolání.',
    body: [
      'V rámci společnosti si vybíráte z lázeňských hotelů podle svých přání a možností. Termín nástupu, lázeňský hotel i typ ubytování si můžete dohodnout předem a nic z toho vám nezpoplatníme — ani výběr termínu, ani hotelu, ani kategorie pokoje. Na rezervační poplatek se vyplatí ptát všude, kam se hlásíte; u nás žádný není.',
      'Pokud termín předem zajištěný nemáte, budete k nástupu vyzváni podle aktuálních kapacitních možností. Nástupní termín je závazný a lze ho změnit jen ze závažných důvodů.',
      'Komplexní péče se čerpá v době pracovní neschopnosti; tu vystaví lázeňský lékař při vstupní lékařské prohlídce. Příspěvkovou péči čerpáte v době své dovolené.',
    ],
    tip:
      'Nastoupit lze kterýkoli den v týdnu — pobyt nezačíná jen v pondělí. Procedury probíhají většinou v budově, kde bydlíte, případně v budovách spojených koridorem.',
  },
  {
    n: 4,
    title: 'Když pojišťovna návrh neschválí',
    summary: 'Pobyt lze absolvovat i jako samoplátce.',
    body: [
      'Neschválí-li zdravotní pojišťovna komplexní ani příspěvkovou lázeňskou péči, můžete pobyt v lázních absolvovat jako samoplátce.',
      'Léčebné lázně Mariánské Lázně a.s. na to mají speciální nabídku samopláteckého pobytu — Lázeňská péče bez pojišťovny v hotelu Svoboda. Další možnosti najdete v nabídce hotelů Ensana.',
    ],
  },
]

/* ------------------------------------------------------------------ *
 * KLP vs. PLP
 * ------------------------------------------------------------------ */

export interface CareType {
  key: 'klp' | 'plp'
  abbr: string
  name: string
  tagline: string
  covered: string[]
  paidByClient: string[]
  length: string
  timing: string
  validity: string
  proposalDelivery: string
}

export const careTypes: CareType[] = [
  {
    key: 'klp',
    abbr: 'KLP',
    name: 'Komplexní lázeňská péče',
    tagline: 'Pojišťovna hradí vše podstatné — léčbu, ubytování i celodenní stravu.',
    covered: ['lázeňskou léčbu a všechny předepsané procedury', 'standardní ubytování', 'celodenní stravování'],
    paidByClient: [
      'doplatek za vyšší standard ubytování',
      'doplatek za jednolůžkový pokoj',
      'výběrovou stravu',
      'lázeňský poplatek 50 Kč za osobu a den',
    ],
    length: '21 nebo 28 dnů podle diagnózy a indikačního seznamu',
    timing: 'v době pracovní neschopnosti',
    validity: '3 měsíce při stupni naléhavosti II, 1 měsíc při stupni naléhavosti I',
    proposalDelivery: 'pojišťovna posílá schválený návrh přímo léčebné společnosti',
  },
  {
    key: 'plp',
    abbr: 'PLP',
    name: 'Příspěvková lázeňská péče',
    tagline: 'Pojišťovna hradí pouze lázeňskou léčbu, pobyt si platíte sami.',
    covered: ['lázeňskou léčbu a všechny předepsané procedury'],
    paidByClient: [
      'ubytování v registrovaném lázeňském zařízení',
      'stravování',
      'lázeňský poplatek 50 Kč za osobu a den',
    ],
    length: '21 dnů, v indikovaných případech 14 dnů',
    timing: 'v době vlastní dovolené',
    validity: '6 měsíců ode dne vystavení navrhujícím lékařem',
    proposalDelivery: 'pojišťovna posílá schválený návrh na adresu klienta',
  },
]

export interface ComparisonRow {
  label: string
  klp: string
  plp: string
}

export const careComparison: ComparisonRow[] = [
  { label: 'Co hradí zdravotní pojišťovna', klp: 'Lázeňskou léčbu, standardní ubytování i celodenní stravování', plp: 'Pouze lázeňskou léčbu' },
  { label: 'Co si hradíte sami', klp: 'Doplatek za vyšší standard ubytování, jednolůžkový pokoj a výběrovou stravu', plp: 'Ubytování a stravování v plné výši' },
  { label: 'Délka pobytu', klp: '21 nebo 28 dnů podle indikačního seznamu', plp: '21 dnů, v indikovaných případech 14 dnů' },
  { label: 'Kdy se pobyt čerpá', klp: 'V době pracovní neschopnosti', plp: 'V době vlastní dovolené' },
  { label: 'Platnost schváleného návrhu', klp: '3 měsíce (naléhavost II) nebo 1 měsíc (naléhavost I)', plp: '6 měsíců od vystavení lékařem' },
  { label: 'Kam pojišťovna pošle schválený návrh', klp: 'Přímo léčebné společnosti', plp: 'Na adresu klienta' },
  { label: 'Ubytování zcela bez doplatku', klp: 'Dependance Vítkov, Labe a Windsor — pokoj 1/2 Standard', plp: 'Není — ubytování hradí klient vždy' },
  { label: 'Lázeňský poplatek města', klp: '50 Kč za osobu a den', plp: '50 Kč za osobu a den' },
  { label: 'Stravování v ceníku', klp: 'Plná penze', plp: 'Polopenze (snídaně a večeře); oběd za doplatek' },
]

export const careLegalNote =
  'Lázeňskou léčbu definuje zákon výhradně jako péči lůžkovou a nelze ji zaměňovat za ambulantní rehabilitaci. I u příspěvkové péče proto musíte čerpat všechny její složky — léčbu, ubytování i stravování — v registrovaném lázeňském zařízení. Poskytnout příspěvkovou péči s ubytováním mimo lázeňský hotel podle platné legislativy nelze.'

/* ------------------------------------------------------------------ *
 * Ceníky doplatků 2026
 * ------------------------------------------------------------------ */

export interface PriceRow {
  /** Kategorie pokoje, např. „1/2 Komfort“. */
  room: string
  /** Devět hodnot: 3 sezóny × (1 den, kratší pobyt, delší pobyt). null = cena v ceníku neuvedena. */
  values: (number | null)[]
  /** Poznámka pod hvězdičkou, např. u pokojů dependancí. */
  footnote?: boolean
}

export interface PriceGroup {
  hotel: string
  /** Slug hotelu v src/data/hotels.ts, pokud existuje samostatná stránka. */
  hotelSlug?: string
  rows: PriceRow[]
}

export interface PriceList {
  key: 'klp' | 'plp'
  title: string
  boardLabel: string
  /** Popisky sloupců uvnitř každé sezóny. */
  columns: [string, string, string]
  seasons: [string, string, string]
  intro: string
  groups: PriceGroup[]
  extras: string[]
  validityNote?: string
}

const SEASONS: [string, string, string] = [
  '1. 1. – 30. 4. 2026',
  '1. 5. – 31. 10. 2026',
  '1. 11. – 23. 12. 2026',
]

export const priceLists: PriceList[] = [
  {
    key: 'klp',
    title: 'Komplexní lázeňská péče',
    boardLabel: 'Ubytování s plnou penzí',
    columns: ['1 den', '21 dnů', '28 dnů'],
    seasons: SEASONS,
    intro:
      'Zdravotní pojišťovna hradí vše: lázeňskou léčbu, ubytování i celodenní stravování. Níže uvedené částky jsou doplatek za vyšší standard ubytování, jednolůžkový pokoj a výběrovou stravu — tedy to, co si připlácíte nad rámec úhrady pojišťovny.',
    validityNote: 'Změny v ceníku komplexní lázeňské péče jsou platné od 15. 6. 2026.',
    groups: [
      {
        hotel: 'Vltava',
        hotelSlug: 'vltava',
        rows: [
          { room: '1/2 Komfort', values: [300, 6300, 8400, 500, 10500, 14000, 400, 8400, 11200] },
          { room: '1/1 Komfort', values: [800, 16800, 22400, 1000, 21000, 28000, 900, 18900, 25200] },
          { room: '1/2 Komfort Plus', values: [400, 8400, 11200, 600, 12600, 16800, 500, 10500, 14000] },
          { room: '1/1 Komfort Plus', values: [900, 18900, 25200, 1100, 23100, 30800, 1000, 21000, 28000] },
        ],
      },
      {
        hotel: 'Dependance Vítkov',
        rows: [
          { room: '1/2 Standard', values: [0, 0, 0, 0, 0, 0, 0, 0, 0], footnote: true },
          { room: '1/1 Standard', values: [450, 9450, 12600, 650, 13650, 18200, 550, 11550, 15400] },
        ],
      },
      {
        hotel: 'Svoboda',
        hotelSlug: 'svoboda',
        rows: [
          { room: '1/2 Komfort', values: [550, 11550, 15400, 600, 12600, 16800, 550, 11550, 15400] },
          { room: '1/1 Komfort', values: [null, null, null, 1100, 23100, 30800, 1050, 22050, 29400] },
          { room: '1/2 Komfort Plus', values: [650, 13650, 18200, 850, 17850, 23800, 750, 15750, 21000] },
        ],
      },
      {
        hotel: 'Dependance Labe',
        rows: [
          { room: '1/2 Standard', values: [0, 0, 0, 0, 0, 0, 0, 0, 0], footnote: true },
          { room: '1/1 Standard', values: [600, 12600, 16800, 800, 16800, 22400, 700, 14700, 19600] },
        ],
      },
      {
        hotel: 'Pacifik',
        hotelSlug: 'pacifik',
        rows: [
          { room: '1/2 Superior', values: [650, 13650, 18200, 850, 17850, 23800, 750, 15750, 21000] },
          { room: '1/1 Superior', values: [1150, 24150, 32200, 1350, 28350, 37800, 1250, 26250, 35000] },
          { room: '1/2 Superior Plus', values: [750, 15750, 21000, 950, 19950, 26600, 850, 17850, 23800] },
          { room: '1/1 Superior Plus', values: [1250, 26250, 35000, 1450, 30450, 40600, 1350, 28350, 37800] },
        ],
      },
      {
        hotel: 'Dependance Windsor',
        rows: [{ room: '1/2 Standard', values: [0, 0, 0, 0, 0, 0, 0, 0, 0], footnote: true }],
      },
      {
        hotel: 'Centrální Lázně',
        hotelSlug: 'centralni-lazne',
        rows: [
          { room: '1/2 Superior', values: [650, 13650, 18200, 850, 17850, 23800, 750, 15750, 21000] },
          { room: '1/1 Superior', values: [1150, 24150, 32200, 1350, 28350, 37800, 1250, 26250, 35000] },
          { room: '1/2 Superior Plus', values: [750, 15750, 21000, 950, 19950, 26600, 850, 17850, 23800] },
          { room: '1/1 Superior Plus', values: [1250, 26250, 35000, 1450, 30450, 40600, 1350, 28350, 37800] },
        ],
      },
      {
        hotel: 'Maria Spa',
        rows: [
          { room: '1/2 Maria Superior', values: [1050, 22050, 29400, 1250, 26250, 35000, 1150, 24150, 32200] },
          { room: '1/2 Maria Superior de luxe', values: [1100, 23100, 30800, 1300, 27300, 36400, 1200, 25200, 33600] },
        ],
      },
      {
        hotel: 'Neapol',
        rows: [
          { room: '1/2 Superior', values: [650, 13650, 18200, 850, 17850, 23800, 750, 15750, 21000] },
          { room: '1/1 Superior', values: [1150, 24150, 32200, 1350, 28350, 37800, 1250, 26250, 35000] },
        ],
      },
      {
        hotel: 'Imperial',
        rows: [
          { room: '1/2 Superior Plus', values: [750, 15750, 21000, 950, 19950, 26600, 850, 17850, 23800] },
          { room: '1/1 Superior Plus', values: [1250, 26250, 35000, 1450, 30450, 40600, 1350, 28350, 37800] },
        ],
      },
      {
        hotel: 'Hvězda',
        hotelSlug: 'hvezda',
        rows: [
          { room: '1/2 Premium', values: [900, 18900, 25200, 1100, 23100, 30800, 1000, 21000, 28000] },
          { room: '1/1 Premium', values: [1400, 29400, 39200, 1600, 33600, 44800, 1500, 31500, 42000] },
        ],
      },
    ],
    extras: [
      'Dvoulůžkový pokoj k samostatnému použití — při vyčerpání kapacity jednolůžkových pokojů bude nabídnut dvoulůžkový pokoj s doplatkem za neobsazené lůžko. Doplatek se přičítá k ceně v tabulce: 880 Kč za osobu a noc (Hvězda, Centrální Lázně, Pacifik), 750 Kč za osobu a noc (Svoboda, Vltava).',
      'Rezervace konkrétního pokoje, poschodí nebo budovy: 130 Kč za osobu a noc.',
      'Změna fixní rezervace nebo storno: 1 000 Kč za osobu.',
      'Změna pokoje stejné kategorie během pobytu na vlastní žádost hosta: 600 Kč za osobu.',
      'Vstup do hotelového bazénu pro hosty dependancí Vítkov, Labe a Windsor na pokojích bez doplatku: 100 Kč / 1 hod. (Vltava), 150 Kč / 1 hod. (Svoboda), 250 Kč / 1 hod. (Hvězda, Pacifik).',
    ],
  },
  {
    key: 'plp',
    title: 'Příspěvková lázeňská péče',
    boardLabel: 'Ubytování s polopenzí (snídaně a večeře)',
    columns: ['1 den', '14 dnů', '21 dnů'],
    seasons: SEASONS,
    intro:
      'Zdravotní pojišťovna hradí pouze lázeňskou léčbu. Ubytování a stravování si hradíte sami — níže uvedené částky jsou tedy celou cenou pobytu, nikoli doplatkem. Délku příspěvkové péče stanovuje indikační seznam na 21 dnů, v indikovaných případech na 14 dnů.',
    groups: [
      {
        hotel: 'Vltava',
        hotelSlug: 'vltava',
        rows: [
          { room: '1/2 Komfort', values: [1250, 17500, 26250, 1530, 21420, 32130, 1340, 18760, 28140] },
          { room: '1/1 Komfort', values: [1600, 22400, 33600, 1880, 26320, 39480, 1690, 23660, 35490] },
          { room: '1/2 Komfort Plus', values: [1370, 19180, 28770, 1650, 23100, 34650, 1460, 20440, 30660] },
          { room: '1/1 Komfort Plus', values: [1720, 24080, 36120, 2000, 28000, 42000, 1810, 25340, 38010] },
        ],
      },
      {
        hotel: 'Dependance Vítkov',
        rows: [
          { room: '1/2 Standard', values: [1100, 15400, 23100, 1380, 19320, 28980, 1190, 16660, 24990], footnote: true },
          { room: '1/1 Standard', values: [1450, 20300, 30450, 1730, 24220, 36330, 1540, 21560, 32340] },
        ],
      },
      {
        hotel: 'Svoboda',
        hotelSlug: 'svoboda',
        rows: [
          { room: '1/2 Komfort', values: [1250, 17500, 26250, 1530, 21420, 32130, 1340, 18760, 28140] },
          { room: '1/2 Komfort Plus', values: [1370, 19180, 28770, 1650, 23100, 34650, 1460, 20440, 30660] },
        ],
      },
      {
        hotel: 'Dependance Labe',
        rows: [
          { room: '1/2 Standard', values: [1100, 15400, 23100, 1380, 19320, 28980, 1190, 16660, 24990], footnote: true },
          { room: '1/1 Standard', values: [1450, 20300, 30450, 1730, 24220, 36330, 1540, 21560, 32340] },
        ],
      },
      {
        hotel: 'Pacifik',
        hotelSlug: 'pacifik',
        rows: [
          { room: '1/2 Superior', values: [1310, 18340, 27510, 1590, 22260, 33390, 1490, 20860, 31290] },
          { room: '1/1 Superior', values: [1660, 23240, 34860, 1940, 27160, 40740, 1840, 25760, 38640] },
          { room: '1/2 Superior Plus', values: [1560, 21840, 32760, 1840, 25760, 38640, 1740, 24360, 36540] },
          { room: '1/1 Superior Plus', values: [1910, 26740, 40110, 2190, 30660, 45990, 2090, 29260, 43890] },
        ],
      },
      {
        hotel: 'Dependance Windsor',
        rows: [
          { room: '1/2 Standard', values: [1010, 14140, 21210, 1290, 18060, 27090, 1190, 16660, 24990], footnote: true },
        ],
      },
      {
        hotel: 'Centrální Lázně',
        hotelSlug: 'centralni-lazne',
        rows: [
          { room: '1/2 Superior', values: [1310, 18340, 27510, 1590, 22260, 33390, 1490, 20860, 31290] },
          { room: '1/1 Superior', values: [1660, 23240, 34860, 1940, 27160, 40740, 1840, 25760, 38640] },
          { room: '1/2 Superior Plus', values: [1630, 22820, 34230, 1910, 26740, 40110, 1810, 25340, 38010] },
          { room: '1/1 Superior Plus', values: [1980, 27720, 41580, 2260, 31640, 47460, 2160, 30240, 45360] },
        ],
      },
      {
        hotel: 'Maria Spa',
        rows: [
          { room: '1/2 Maria Superior', values: [2210, 30940, 46410, 2490, 34860, 52290, 2390, 33460, 50190] },
          { room: '1/2 Maria Superior de luxe', values: [2490, 34860, 52290, 2770, 38780, 58170, 2670, 37380, 56070] },
        ],
      },
      {
        hotel: 'Neapol',
        rows: [
          { room: '1/2 Superior', values: [1310, 18340, 27510, 1590, 22260, 33390, 1490, 20860, 31290] },
          { room: '1/1 Superior', values: [1660, 23240, 34860, 1940, 27160, 40740, 1840, 25760, 38640] },
        ],
      },
      {
        hotel: 'Imperial',
        rows: [
          { room: '1/2 Superior Plus', values: [1770, 24780, 37170, 2050, 28700, 43050, 1950, 27300, 40950] },
          { room: '1/1 Superior Plus', values: [2120, 29680, 44520, 2400, 33600, 50400, 2300, 32200, 48300] },
        ],
      },
      {
        hotel: 'Hvězda',
        hotelSlug: 'hvezda',
        rows: [
          { room: '1/2 Premium', values: [1940, 27160, 40740, 2220, 31080, 46620, 2120, 29680, 44520] },
          { room: '1/1 Premium', values: [2290, 32060, 48090, 2570, 35980, 53970, 2470, 34580, 51870] },
        ],
      },
    ],
    extras: [
      'Dvoulůžkový pokoj k samostatnému použití — při vyčerpání kapacity jednolůžkových pokojů bude nabídnut dvoulůžkový pokoj s doplatkem za neobsazené lůžko. Doplatek se přičítá k ceně v tabulce: 880 Kč za osobu a noc (Hvězda, Centrální Lázně, Pacifik), 750 Kč za osobu a noc (Svoboda, Vltava).',
      'Rezervace konkrétního pokoje, poschodí nebo budovy: 130 Kč za osobu a noc.',
      'Změna fixní rezervace nebo storno: 1 000 Kč za osobu.',
      'Změna pokoje stejné kategorie během pobytu na vlastní žádost hosta: 600 Kč za osobu.',
      'Plná penze — oběd je možné objednat za doplatek: 450 Kč za osobu a noc (Hvězda, Centrální Lázně, Pacifik), 400 Kč za osobu a noc (Svoboda, Vltava).',
    ],
  },
]

export const priceRoomLegend = '1/1 — jednolůžkový pokoj, 1/2 — jedno lůžko ve dvoulůžkovém pokoji, druhé oddělené lůžko bude obsazeno dalším hostem.'

export const priceFootnote = 'Pokoje dependancí Vítkov, Labe a Windsor — vstup do hotelového bazénu je u těchto pokojů zpoplatněn zvlášť.'

export const priceDisclaimer = [
  'Ceny jsou v Kč včetně DPH. Změna cen vyhrazena. Ceny ostatních kategorií sdělí lázně na vyžádání.',
  'Kapacita pokojů v lázeňských hotelech je omezená — umístění vašeho návrhu se řeší podle aktuální volné kapacity.',
  'Na uvedené ceny a doplatky nelze uplatnit slevu v rámci věrnostního programu Ensana Life.',
  'Lázně si vyhrazují právo provádět změny podle platných legislativních změn. Závazné jsou vždy aktuální ceníky Léčebných lázní Mariánské Lázně a.s.',
]

export const spaTax = {
  amount: '50 Kč za osobu a den',
  text:
    'V cenách není zahrnut lázeňský poplatek, který se platí při příjezdu v lázeňském hotelu. Jeho výše se řídí aktuální vyhláškou města Mariánské Lázně.',
  exemptions:
    'Od placení lázeňského poplatku jsou osvobozeny osoby mladší 18 let, osoby nevidomé, držitelé průkazu ZTP/P a jejich průvodci.',
}

/* ------------------------------------------------------------------ *
 * Indikace — devět skupin
 * ------------------------------------------------------------------ */

export interface IndicationPage {
  slug: string
  /** id skupiny v src/data/indications.ts — zdroj indikačních kódů. */
  groupId: string
  /** Římská číslice indikační skupiny podle indikačního seznamu. */
  roman: string
  navLabel: string
  title: string
  metaTitle: string
  metaDescription: string
  lead: string
  /** Krátké shrnutí pro dlaždici na rozcestníku. */
  teaser: string
  treats: string[]
  goals: string[]
  procedures: { name: string; detail: string }[]
  /** Volitelný odstavec o pramenech nebo místních specifikách. */
  local?: { heading: string; body: string }
  /** Snímek k této indikaci — vždy procedura nebo prostředí, které se u ní
   *  skutečně používá, ne ilustrace bez vztahu k textu. */
  image: string
  imageAlt: string
  imageCaption: string
}

export const indicationPages: IndicationPage[] = [
  {
    slug: 'pohybove-ustroji',
    image: '/images/content/articles/cs-lecba-raselinou-marianske-lazne/coverImage.jpg',
    imageAlt: 'Slatinný zábal nanesený na zádech ležícího klienta',
    imageCaption: 'Slatinné zábaly s teplotou až 40 °C tlumí bolest a zánět — jedna z hlavních procedur této skupiny.',
    groupId: 'musculoskeletal',
    roman: 'VII',
    navLabel: 'Pohybové ústrojí',
    title: 'Nemoci pohybového ústrojí',
    metaTitle: 'Lázeňská léčba pohybového ústrojí v Mariánských Lázních | Marienbad.com',
    metaDescription:
      'Artrózy, bolesti zad, stavy po kloubních náhradách a operacích páteře — co lázeňská léčba v Mariánských Lázních obnáší, jaké procedury se používají a jak dlouhý pobyt pojišťovna hradí.',
    lead:
      'Nejpočetnější indikační skupina. Léčba stojí na uhličitých koupelích z místních minerálních vod, slatině a intenzivní fyzioterapii — kombinaci, kterou ambulantní rehabilitace v tomto rozsahu nabídnout nedokáže.',
    teaser: 'Artrózy, bolesti zad a krční páteře, stavy po kloubních náhradách a operacích páteře.',
    treats: [
      'Chronické bolesti zad a krční páteře',
      'Artrózy a artritidy velkých i malých kloubů — kyčel, koleno, rameno, klouby rukou',
      'Stavy po kloubních náhradách velkých kloubů a po operacích páteře',
    ],
    goals: [
      'Zlepšení pohyblivosti a svalové síly',
      'Uvolnění zkrácených svalů',
      'Úprava deformit páteře a pánve',
      'Nácvik správné chůze',
    ],
    procedures: [
      { name: 'Vodní uhličité koupele', detail: 'Z přírodních minerálních vod — prohřívají, prokrvují a uvolňují svalové napětí.' },
      { name: 'Suché uhličité koupele', detail: 'V Mariině plynu s obsahem 99,7 % CO₂, bez zátěže oběhu vodou.' },
      { name: 'Plynové injekce', detail: 'Podkožní aplikace oxidu uhličitého s analgetickým účinkem.' },
      { name: 'Slatinné zábaly', detail: 'Termoterapie s teplotou až 40 °C, tlumí bolest a zánět.' },
      { name: 'Kryoterapie', detail: 'Léčba chladem u akutně dráždivých kloubních potíží.' },
      { name: 'Individuální a skupinové cvičení', detail: 'Pod vedením fyzioterapeutů, denně po celou dobu pobytu.' },
      { name: 'Fyzikální léčba', detail: 'Elektroléčba, laserová terapie, magnetoterapie a ultrazvuk.' },
    ],
  },
  {
    slug: 'ledviny-a-mocove-cesty',
    image: '/images/content/articles/cs-postonkologicky-lazensky-program/coverImage.jpg',
    imageAlt: 'Dvojice s lázeňskými pohárky u pavilonu Rudolfova pramene',
    imageCaption: 'Rudolfův pramen s vysokým obsahem vápníku a hořčíku — jeden ze čtyř pramenů, které lékař u této indikace předepisuje.',
    groupId: 'urinary',
    roman: 'VIII',
    navLabel: 'Ledviny a močové cesty',
    title: 'Nemoci ledvin a močových cest',
    metaTitle: 'Lázeňská léčba ledvin a močových cest v Mariánských Lázních | Marienbad.com',
    metaDescription:
      'Ledvinné kameny, opakované záněty močových cest, chronická prostatitida a stavy po urologických operacích — léčba pitnou kúrou z místních pramenů a hrazený rozsah pobytu.',
    lead:
      'Urologická indikace patří k historickému jádru mariánskolázeňské kúry. Léčba se opírá o pitnou kúru ze čtyř pramenů s odlišným složením — lékař vybírá ten, který odpovídá typu kamene nebo zánětu.',
    teaser: 'Ledvinné kameny, opakované záněty močových cest, prostatitida, stavy po operacích i transplantaci.',
    treats: [
      'Všechny druhy ledvinných kamenů',
      'Pyelonefritidy — záněty ledvinné pánvičky',
      'Záněty močového měchýře',
      'Záněty prostaty',
      'Stavy po operacích ledvin a močových cest',
      'Pacienti po transplantaci ledviny i dárci štěpu',
    ],
    goals: [
      'Zlepšení funkce ledvin, močového měchýře a dalších částí močového ústrojí',
      'Zmírnění bolesti',
      'Prevence recidiv',
      'Podpora regenerace po operacích',
    ],
    procedures: [
      { name: 'Pitná kúra', detail: 'Individuálně předepsané prameny, dávkování a načasování v průběhu dne.' },
      { name: 'Zvýšení diurézy', detail: 'Vodní i suché uhličité koupele podporují průtok ledvinami.' },
      { name: 'Termoterapie', detail: 'Prohřívací procedury tlumící bolest a spasmy močových cest.' },
      { name: 'Pelvi Power', detail: 'Přístroj pro diagnostiku a léčbu poruch pánevního dna.' },
    ],
    local: {
      heading: 'Čtyři prameny, čtyři různé úlohy',
      body:
        'Rudolfův pramen s vysokým obsahem vápníku a hořčíku, Karolinin pramen, Lesní pramen s vysokým obsahem bikarbonátů a Ambrožův pramen, který se uplatňuje u kamenů kalcium-fosfátových. Který z nich a v jakém množství budete pít, určí lázeňský lékař při vstupní prohlídce podle rozboru vašeho onemocnění.',
    },
  },
  {
    slug: 'dychaci-ustroji',
    image: '/images/content/pages/cs-klimatoterapie/featuredImage.jpg',
    imageAlt: 'Lesní cesta ve Slavkovském lese prosvícená sluncem',
    imageCaption: 'Klimatoterapie není doplněk — poloha města v 630 m n. m. a čisté lesní ovzduší jsou součástí léčebného plánu.',
    groupId: 'respiratory',
    roman: 'V',
    navLabel: 'Dýchací ústrojí',
    title: 'Netuberkulózní nemoci dýchacího ústrojí',
    metaTitle: 'Lázeňská léčba dýchacích cest v Mariánských Lázních | Marienbad.com',
    metaDescription:
      'Astma, chronická bronchitida, CHOPN, plicní fibrózy a stavy po operacích dýchacích cest — klimatoterapie v 630 m n. m., inhalace a pitná kúra Lesním pramenem.',
    lead:
      'Poloha města v 630 metrech nad mořem není u dýchacích potíží kosmetický detail — je součástí léčby. K ní se přidávají denní inhalace, dechová cvičení a pitná kúra s mukolytickým efektem.',
    teaser: 'Astma, chronické bronchitidy, CHOPN, plicní fibrózy, stavy po operacích dýchacích cest.',
    treats: [
      'Chronické bronchitidy',
      'Astma bronchiale',
      'Plicní fibrózy a stavy po zánětech plic',
      'Stavy po operacích horních i dolních dýchacích cest',
    ],
    goals: [
      'Zlepšení ventilační funkce dýchacích cest',
      'Obnovení správné mechaniky dýchání',
      'Obnovení průchodnosti dýchacích cest',
      'Zlepšení celkové odolnosti organismu',
      'Odstranění škodlivin ze zevního prostředí',
    ],
    procedures: [
      { name: 'Klimatoterapie', detail: 'Nadmořská výška 630 m znamená intenzivnější UV záření, nižší barometrický tlak a vyšší obsah ozonu.' },
      { name: 'Pitná kúra', detail: 'Lesní pramen — alkalicko-slaná minerální voda s mukolytickým efektem.' },
      { name: 'Inhalace', detail: 'Denně, ultrazvukovými inhalátory s velikostí částic 1–10 mikronů.' },
      { name: 'Dechová cvičení', detail: 'Relaxační a korekční cviky pod vedením fyzioterapeuta.' },
      { name: 'Minerální koupele', detail: 'Uhličité koupele z přírodních pramenů.' },
      { name: 'Doplňkové procedury', detail: 'Masáže, termoterapie, elektroléčba, vodoléčba a oxygenoterapie.' },
    ],
  },
  {
    slug: 'onkologicka-onemocneni',
    image: '/images/content/articles/cs-rehabilitace-po-covidu/coverImage.jpg',
    imageAlt: 'Dvojice lázeňských hostů s porcelánovými pohárky před kolonádou',
    imageCaption: 'Cílem je rekondice a návrat do běžného života — pitná kúra, pohyb a klid patří k programu stejně jako procedury.',
    groupId: 'oncology',
    roman: 'I',
    navLabel: 'Onkologická onemocnění',
    title: 'Nemoci onkologické',
    metaTitle: 'Lázeňská léčba po onkologické léčbě v Mariánských Lázních | Marienbad.com',
    metaDescription:
      'Rekondiční lázeňský pobyt po ukončené protinádorové léčbě a v remisi — detoxikace, lymfodrenáže, uhličité koupele a psychická rekondice. Rozsah hrazený pojišťovnou.',
    lead:
      'Lázeňská péče v této skupině je určena klientům s již prodělanou onkologickou léčbou a těm v remisi. Cílem není léčit nádor, ale zkrátit dobu návratu do běžného pracovního a společenského života.',
    teaser: 'Rekondice po ukončené protinádorové léčbě a v remisi — únava, otoky, psychická zátěž.',
    treats: [
      'Stavy po ukončené komplexní protinádorové léčbě bez známek recidivy',
      'Pocity únavy, vyčerpanosti a posttraumatické syndromy',
      'Bolest a komplikace vyplývající ze základní léčby',
      'Psychické dopady onkologického onemocnění',
    ],
    goals: [
      'Detoxikace organismu',
      'Posílení fyzické i psychické kondice',
      'Zmírnění bolesti a únavy',
      'Zkrácení doby návratu do pracovního a společenského života',
    ],
    procedures: [
      { name: 'Minerální uhličité koupele', detail: 'Podporují prokrvení a celkovou regeneraci.' },
      { name: 'Suché uhličité koupele', detail: 'V Mariině plynu, šetrné k oběhovému systému.' },
      { name: 'Plynové injekce', detail: 'Podkožní aplikace CO₂.' },
      { name: 'Manuální lymfodrenáž', detail: 'Doplněná přístrojovou drenáží Lymfoven a Lymfopress.' },
      { name: 'Klimatoterapie a dietoterapie', detail: 'Řízený pobyt venku a individuálně sestavená strava.' },
      { name: 'Rehabilitační program', detail: 'Pohybová aktivita, masáže a hydroterapie.' },
    ],
  },
  {
    slug: 'kozni-onemocneni',
    image: '/images/content/articles/cs-lazenska-lecba-koznich-onemocneni/coverImage.jpg',
    imageAlt: 'Klientka ponořená v minerální koupeli při svíčkách',
    imageCaption: 'Minerální koupele snižují zánět a podráždění, hydratují pokožku a obnovují kožní bariéru.',
    groupId: 'skin',
    roman: 'X',
    navLabel: 'Kožní onemocnění',
    title: 'Nemoci kožní',
    metaTitle: 'Lázeňská léčba lupénky a atopického ekzému v Mariánských Lázních | Marienbad.com',
    metaDescription:
      'Atopický ekzém a psoriáza — minerální koupele, peloidní zábaly, fototerapie 311 nm a čisté klima. Co se léčí a jak dlouhý pobyt hradí zdravotní pojišťovna.',
    lead:
      'Kožní onemocnění postihují největší orgán lidského těla a nezpůsobují jen fyzický diskomfort — svědění, bolest a zánět — ale i stres a sníženou sebeúctu. Lázeňská léčba míří na obojí.',
    teaser: 'Atopický ekzém a generalizovaná či artropatická psoriáza.',
    treats: ['Atopický ekzém', 'Generalizovaná a artropatická psoriasis vulgaris (lupénka)'],
    goals: [
      'Zmírnění příznaků a podpora hojení',
      'Snížení svědění a zánětlivých procesů',
      'Dlouhodobé zlepšení stavu pokožky',
    ],
    procedures: [
      { name: 'Minerální koupele', detail: 'Snižují zánět a podráždění, hydratují pokožku a obnovují kožní bariéru.' },
      { name: 'Suché uhličité koupele', detail: 'Zlepšují prokrvení kůže a stimulují obnovu buněk.' },
      { name: 'Peloidní zábaly', detail: 'Mají stahující a antibakteriální účinek.' },
      { name: 'Klimatoterapie', detail: 'Čisté ovzduší s nízkou prašností a nízkým obsahem alergenů, zároveň redukuje psychické napětí.' },
      { name: 'Fototerapie', detail: 'Červené a UV světlo 311 nm včetně fototerapeutického hřebene — působí protizánětlivě a redukuje svědění.' },
    ],
  },
  {
    slug: 'travici-ustroji',
    image: '/images/content/articles/cs-pitna-kura-pruvodce/coverImage.jpg',
    imageAlt: 'Hostka pije z lázeňského pohárku u Zpívající fontány',
    imageCaption: 'Pitná kúra s přesným dávkováním a načasováním je u této skupiny základem léčby.',
    groupId: 'digestive',
    roman: 'III',
    navLabel: 'Trávicí ústrojí',
    title: 'Nemoci trávicího ústrojí',
    metaTitle: 'Lázeňská léčba trávicího ústrojí v Mariánských Lázních | Marienbad.com',
    metaDescription:
      'Onemocnění žaludku, střev, žlučníku a slinivky, Crohnova nemoc i stavy po operacích — pitná kúra, dietní program a balneoterapie. Rozsah hrazený pojišťovnou.',
    lead:
      'Onemocnění trávicího ústrojí patří mezi časté zdravotní potíže, které mohou dlouhodobě ovlivňovat kvalitu života. Lázeňský pobyt je vhodný jak pro chronické stavy, tak po akutních onemocněních a operacích.',
    teaser: 'Žaludek a střeva, žlučník, slinivka, Crohnova nemoc a stavy po operacích trávicího traktu.',
    treats: [
      'Onemocnění žaludku a dvanáctníku',
      'Choroby žlučníku a žlučových cest',
      'Onemocnění slinivky břišní',
      'Chronická onemocnění střev',
      'Funkční poruchy trávicího traktu',
    ],
    goals: [
      'Zklidnění trávicího traktu',
      'Podpora trávení a metabolismu',
      'Zmírnění bolestí a nepříjemných obtíží',
      'Úprava stravovacích návyků',
      'Celková regenerace organismu',
    ],
    procedures: [
      { name: 'Pitná kúra', detail: 'Minerální vody podle doporučení lékaře, s přesným dávkováním a načasováním.' },
      { name: 'Dietní program', detail: 'Individuálně sestavený jídelníček po celou dobu pobytu.' },
      { name: 'Minerální koupele', detail: 'Uhličité koupele z přírodních pramenů.' },
      { name: 'Suché uhličité koupele', detail: 'V Mariině plynu.' },
      { name: 'Fyzikální terapie', detail: 'Elektroterapie a magnetoterapie.' },
      { name: 'Pohybová aktivita', detail: 'Lehký, řízený pohybový režim.' },
    ],
  },
  {
    slug: 'neurologicka-onemocneni',
    image: '/images/content/articles/cs-hubnuti-a-metabolicka-lecba-v-laznich-jak-funguje-lazenska-kura-na-vahu/coverImage.jpg',
    imageAlt: 'Fyzioterapeut vede klientku při cvičení na páteř v rehabilitační tělocvičně',
    imageCaption: 'Individuální fyzioterapie v intenzitě, jaké se v ambulantním režimu nedosáhne — práce na koordinaci, stabilitě a hybnosti.',
    groupId: 'nervous',
    roman: 'VI',
    navLabel: 'Neurologická onemocnění',
    title: 'Nemoci nervové',
    metaTitle: 'Lázeňská léčba neurologických onemocnění v Mariánských Lázních | Marienbad.com',
    metaDescription:
      'Parkinsonova nemoc, kořenové syndromy, polyneuropatie a stavy po poranění mozku či míchy — rehabilitace, balneoterapie a fyzikální terapie s hrazeným pobytem 21–28 dnů.',
    lead:
      'Neurologická onemocnění patří mezi závažné diagnózy, které mohou významně ovlivňovat pohybové schopnosti, soběstačnost i kvalitu života. Lázeňský pobyt dává prostor pro rehabilitaci v intenzitě, jaké se v ambulantním režimu nedosáhne.',
    teaser: 'Parkinsonova nemoc, kořenové syndromy, polyneuropatie, stavy po poraněních mozku a míchy.',
    treats: [
      'Parkinsonova nemoc',
      'Kořenové iritační syndromy — vertebrogenní obtíže',
      'Neurologické poruchy spojené s bolestí páteře',
      'Poruchy periferního prokrvení',
      'Funkční poruchy nervosvalového aparátu',
    ],
    goals: [
      'Zlepšení koordinace a stability pohybu',
      'Snížení svalového napětí a bolestí',
      'Zlepšení hybnosti a flexibility',
      'Podpora soběstačnosti v běžných denních činnostech',
    ],
    procedures: [
      { name: 'Rehabilitace a fyzioterapie', detail: 'Individuální práce na koordinaci, léčebná tělesná výchova, nácvik pohybových stereotypů a cvičení rovnováhy.' },
      { name: 'Balneoterapie', detail: 'Relaxační koupele, suché uhličité koupele a procedury podporující prokrvení.' },
      { name: 'Fyzikální terapie', detail: 'Elektroterapie, magnetoterapie, laserová terapie a další metody zmírňující bolest.' },
    ],
  },
  {
    slug: 'obehove-ustroji',
    image: '/images/content/articles/cs-co2-koupele-veda/coverImage.jpg',
    imageAlt: 'Klientka v nerezové vaně s minerální uhličitou koupelí',
    imageCaption: 'Uhličité koupele z místních pramenů zlepšují prokrvení a snižují krevní tlak — jádro léčby této indikace.',
    groupId: 'circulatory',
    roman: 'II',
    navLabel: 'Oběhové ústrojí',
    title: 'Nemoci oběhového ústrojí',
    metaTitle: 'Lázeňská léčba srdce a cév v Mariánských Lázních | Marienbad.com',
    metaDescription:
      'Hypertenze, stavy po infarktu, ischemická choroba srdeční a žilní nedostatečnost — uhličité koupele, kardiorehabilitace a fyzikální terapie. Hrazený pobyt až 28 dnů.',
    lead:
      'Onemocnění oběhového systému patří mezi nejčastější civilizační choroby současnosti. Uhličité koupele z mariánskolázeňských pramenů patří k nejlépe doloženým balneologickým postupům právě u této skupiny.',
    teaser: 'Hypertenze, stavy po infarktu, ischemická choroba srdeční, žilní nedostatečnost.',
    treats: [
      'Vysoký krevní tlak (hypertenze)',
      'Stavy po infarktu myokardu',
      'Ischemická choroba srdeční',
      'Poruchy periferního prokrvení',
      'Chronická žilní nedostatečnost',
    ],
    goals: [
      'Zlepšení prokrvení tkání a orgánů',
      'Snížení krevního tlaku',
      'Podpora srdeční činnosti',
      'Zvýšení fyzické kondice a odolnosti',
    ],
    procedures: [
      { name: 'Uhličité koupele', detail: 'Zlepšují prokrvení a snižují krevní tlak — jádro léčby této indikace.' },
      { name: 'Suché uhličité a perličkové koupele', detail: 'Šetrná alternativa bez hydrostatické zátěže.' },
      { name: 'Kardiorehabilitace', detail: 'Zdravotní cvičení a chůze pod odborným dohledem.' },
      { name: 'Fyzikální terapie', detail: 'Magnetoterapie, elektroterapie a oxygenoterapie.' },
    ],
  },
  {
    slug: 'metabolismus-a-stitna-zlaza',
    image: '/images/content/articles/cs-lecba-pohyboveho-aparatu/coverImage.jpg',
    imageAlt: 'Skupina hostů při nordic walkingu v lázeňském parku',
    imageCaption: 'Řízený pohybový režim a klimatoterapie podporují metabolismus i celkovou kondici.',
    groupId: 'metabolic',
    roman: 'IV',
    navLabel: 'Metabolismus a žlázy',
    title: 'Nemoci z poruchy výměny látkové a žláz s vnitřní sekrecí',
    metaTitle: 'Lázeňská léčba diabetu a po operaci štítné žlázy | Marienbad.com',
    metaDescription:
      'Diabetes mellitus a jeho komplikace, stavy po operaci štítné žlázy a hypotyreóza — fyzioterapie, elektroléčba, vodoléčba a klimatoterapie s pobytem hrazeným pojišťovnou.',
    lead:
      'Skupina spojuje diabetes a jeho komplikace se stavy po operacích žláz s vnitřní sekrecí. U pacientů po tyreoidektomii se léčba soustředí na přetrvávající funkční obtíže v oblasti krční páteře, šíje a svalového aparátu.',
    teaser: 'Diabetes mellitus a jeho komplikace, stavy po operaci štítné žlázy, hypotyreóza.',
    treats: [
      'Diabetes mellitus a následné komplikace',
      'Pooperační stavy po operaci štítné žlázy',
      'Funkční poruchy krční páteře a šíje',
      'Svalové obtíže a omezení hybnosti',
      'Poruchy dechového stereotypu',
      'Psychická a celková únava',
    ],
    goals: [
      'Zlepšení hybnosti krční páteře a šíje',
      'Uvolnění napětí a snížení bolestivosti',
      'Obnova fyzické a psychické kondice',
      'Regenerace organismu a podpora metabolismu',
    ],
    procedures: [
      { name: 'Individuální fyzioterapie', detail: 'Cílená cvičení podle konkrétního funkčního nálezu.' },
      { name: 'Skupinová léčebná tělesná výchova', detail: 'Denní cvičební jednotky pod vedením fyzioterapeuta.' },
      { name: 'Klasické částečné masáže', detail: 'Zejména v oblasti šíje a krční páteře.' },
      { name: 'Elektroléčba', detail: 'TENS a interferenční proudy.' },
      { name: 'Vodoléčebné procedury', detail: 'Koupele a hydroterapie.' },
      { name: 'Klimatoterapie a řízený pohybový režim', detail: 'Pobyt venku jako součást léčebného plánu.' },
    ],
  },
]

export function getIndicationPage(slug: string): IndicationPage {
  const page = indicationPages.find((p) => p.slug === slug)
  if (!page) throw new Error(`Neznámá indikace: ${slug}`)
  return page
}

/* ------------------------------------------------------------------ *
 * Hotely, ve kterých lze čerpat péči hrazenou pojišťovnou
 * ------------------------------------------------------------------ */

export interface InsuranceHotel {
  /** Slug v src/data/hotels.ts, pokud má hotel na webu vlastní stránku. */
  hotelSlug?: string
  /** Exteriér hotelu z jeho vlastní galerie (src/content/hotel-galleries). */
  image: string
  imageAlt: string
  name: string
  stars: number
  rooms: string
  roomCategories: string[]
  dependance?: { name: string; rooms: string; note: string }[]
  note: string
}

export const insuranceHotels: InsuranceHotel[] = [
  {
    hotelSlug: 'hvezda',
    image: '/images/hotels/hotels/2/images/0/image.jpg',
    imageAlt: 'Lázeňské hotely Hvězda a Imperial nad parkem s růžovými záhony',
    name: 'Hvězda – Imperial',
    stars: 4,
    rooms: '237 pokojů ve třech propojených budovách — Hvězda, Imperial a Neapol',
    roomCategories: ['1/2 a 1/1 Superior (Neapol)', '1/2 a 1/1 Superior Plus (Imperial)', '1/2 a 1/1 Premium (Hvězda)'],
    note: 'Největší hotelový bazén ve městě se dvěma saunami, vířivkou, parní lázní a solnou jeskyní.',
  },
  {
    hotelSlug: 'centralni-lazne',
    image: '/images/hotels/hotels/1/images/0/image.jpg',
    imageAlt: 'Lázeňský hotel Centrální Lázně s bílou historizující fasádou pod zalesněným svahem',
    name: 'Centrální Lázně – Maria Spa',
    stars: 4,
    rooms: '108 pokojů',
    roomCategories: ['1/2 a 1/1 Superior', '1/2 a 1/1 Superior Plus', '1/2 Maria Superior', '1/2 Maria Superior de luxe'],
    note: 'Stojí na místě původního lázeňského domu z roku 1812 a je zdrojem Mariina plynu pro suché uhličité koupele.',
  },
  {
    hotelSlug: 'pacifik',
    image: '/images/hotels/hotels/3/images/0/image.jpg',
    imageAlt: 'Nasvícená fasáda Grandhotelu Pacifik na Hlavní třídě za soumraku',
    name: 'Pacifik',
    stars: 4,
    rooms: '96 pokojů',
    roomCategories: ['1/2 a 1/1 Superior', '1/2 a 1/1 Superior Plus'],
    dependance: [{ name: 'Dependance Windsor', rooms: 'pokoje 1/2 Standard', note: 'U komplexní péče bez doplatku.' }],
    note: 'Historická budova na Hlavní třídě v bezprostřední blízkosti Zpívající fontány.',
  },
  {
    hotelSlug: 'vltava',
    image: '/images/hotels/hotels/5/images/0/image.jpg',
    imageAlt: 'Lázeňský hotel Vltava — žlutá fasáda s balkony nad lázeňskou částí města',
    name: 'Vltava',
    stars: 3,
    rooms: '80 pokojů ve dvou propojených budovách — Vltava a Berounka',
    roomCategories: ['1/2 a 1/1 Komfort', '1/2 a 1/1 Komfort Plus'],
    dependance: [{ name: 'Dependance Vítkov', rooms: '28 pokojů', note: 'Pokoj 1/2 Standard je u komplexní péče bez doplatku.' }],
    note: 'Nejdostupnější varianta doplatku u komplexní péče.',
  },
  {
    hotelSlug: 'svoboda',
    image: '/images/hotels/hotels/6/images/0/image.jpg',
    imageAlt: 'Propojené budovy lázeňského hotelu Svoboda s hotelem Margareta uprostřed',
    name: 'Svoboda',
    stars: 3,
    rooms: '99 pokojů ve třech propojených budovách — Svoboda, Margareta a Palladio',
    roomCategories: ['1/2 a 1/1 Komfort', '1/2 Komfort Plus'],
    dependance: [{ name: 'Dependance Labe', rooms: '37 pokojů Standard', note: 'Pokoj 1/2 Standard je u komplexní péče bez doplatku.' }],
    note: 'Zde probíhá i samoplátecký program Lázeňská péče bez pojišťovny.',
  },
]

export const hotelsIntro =
  'Léčba i procedury probíhají většinou v budově, kde bydlíte, případně v budovách spojených koridorem — ven se za nimi tak zpravidla nechodí. Umístění se řeší podle aktuální volné kapacity, termín i hotel si ale můžete dohodnout předem — a rezervaci vám nezpoplatníme.'

/**
 * Pozor na rozpor mezi dvěma zdroji: ceník 2026 má nulový doplatek jen
 * u pokojů 1/2 Standard v dependancích, zatímco odpovědi na dotazy na
 * lazneml.cz uvádějí mezi ubytováním bez doplatku i hotely Vltava a Svoboda
 * (jejich kategorie Komfort a Komfort Plus ale doplatek v ceníku mají).
 * Text proto odděluje doložený údaj z ceníku od tvrzení lázní.
 */
export const hotelsFreeNote =
  'Ceník komplexní péče pro rok 2026 uvádí nulový doplatek u pokojů 1/2 Standard v dependancích Vítkov, Labe a Windsor — ubytování tam nestojí nic v žádné ze tří sezón. Lázně mezi ubytováním bez doplatku uvádějí i hotely Vltava a Svoboda; ceník pro ně ale obsahuje pouze kategorie Komfort a Komfort Plus, které doplatek mají, proto si konkrétní kategorii bez doplatku ověřte při rezervaci.'

/* ------------------------------------------------------------------ *
 * Cesta, zavazadla, doprava po městě
 * ------------------------------------------------------------------ */

export interface TravelBlock {
  heading: string
  body: string
  bullets?: string[]
  note?: string
}

export const travelBlocks: TravelBlock[] = [
  {
    heading: 'Vlakem až do lázní',
    body:
      'Mariánské Lázně leží na trati Plzeň – Cheb a mají vlastní železniční stanici. Pro třítýdenní pobyt je vlak obvykle pohodlnější než auto — nemusíte celou dobu řešit parkování a cestu zvládnete i s omezenou hybností.',
    bullets: [
      'Z Prahy přibližně 3 hodiny — z hlavního nádraží jede denně několik expresů přímo do Mariánských Lázní přes Plzeň, bez přestupu.',
      'Z Plzně přibližně 1,5 hodiny přímým spojem.',
      'Z Karlových Varů přibližně 1 hodina.',
      'Z Chebu 25 minut, s návazností na mezinárodní vlaky z Německa.',
      'Jízdenku koupíte u pokladny, v e-shopu Českých drah, v aplikaci Můj vlak, u průvodčího i v automatu.',
    ],
    note:
      'Pokud jste držitelem průkazu ZTP nebo ZTP/P, ověřte si u dopravce podmínky slevy a bezplatné přepravy průvodce — u třítýdenního pobytu jde o citelnou úsporu.',
  },
  {
    heading: 'Těžký kufr nemusíte nést',
    body:
      'Na třítýdenní kúru se balí jinak než na víkend. Zavazadlo se dá poslat napřed nebo přepravit odděleně, takže s sebou ve vlaku vezete jen příruční tašku.',
    bullets: [
      'Balík Do ruky České pošty doručí zásilku až do 31,5 kg na adresu hotelu, obvykle do dvou pracovních dnů. Zásilku adresujte na své jméno a název hotelu a předem o ní recepci informujte.',
      'Ve vlaku si můžete vzít velké zavazadlo jako spoluzavazadlo — 40 Kč do 150 km, 60 Kč nad 150 km. Ruční zavazadlo do rozměrů 90 × 60 × 40 cm je zdarma.',
      'Kurýrní služby doručující do druhého dne (PPL, DPD, Zásilkovna) fungují stejně — rozhoduje jen to, zda hotel zásilku přijme a uschová.',
    ],
    note:
      'Odesílejte tak, aby zásilka dorazila den až dva před vaším příjezdem — s větším předstihem ji hotel obvykle nepřevezme, po vašem nástupu byste naopak zůstali bez věcí. Recepce vám ji předá při příjezdu nebo ji nechá donést na pokoj.',
  },
  {
    heading: 'Z nádraží do hotelu',
    body:
      'Vlakové nádraží leží asi dva kilometry od lázeňského centra, takže poslední úsek cesty je potřeba dojet — pěšky to s kufrem není příjemné, zvlášť do kopce.',
    bullets: [
      'Hosté hotelů Ensana mohou využít transfer přímo z perónu — stačí sdělit číslo vlaku při rezervaci nebo předem e-mailem.',
      'Trolejbusová linka č. 5 spojuje nádraží s centrem a kolonádou. Ráno jezdí po 15–20 minutách, odpoledne a večer po 20 minutách.',
      'Taxi stojí přímo před výpravní budovou; jízda do lázeňské části trvá pár minut.',
      'Hotelová recepce zajistí taxi i transfer z letiště v Praze nebo Mnichově — stačí se ozvat předem.',
    ],
  },
  {
    heading: 'Autem a parkování',
    body:
      'Pokud přijedete autem, počítejte s tím, že lázeňská část města má regulované parkování a hotelová parkoviště mají omezenou kapacitu. Místo si rezervujte společně s pobytem.',
    note: 'Podrobný přehled parkovišť, zón a cen najdete na samostatné stránce o parkování v Mariánských Lázních.',
  },
]

export interface StayStep {
  heading: string
  body: string
}

export const staySteps: StayStep[] = [
  {
    heading: 'Příjezd a ubytování',
    body:
      'Nastoupit můžete kterýkoli den v týdnu — pobyt nezačíná jen v pondělí. Při příjezdu se platí lázeňský poplatek 50 Kč za osobu a den a případný doplatek za ubytování podle ceníku.',
  },
  {
    heading: 'Vstupní lékařská prohlídka',
    body:
      'Hned v úvodu pobytu vás vyšetří lázeňský lékař. Sestaví individuální léčebný plán, předepíše konkrétní procedury a u komplexní péče vystaví pracovní neschopnost.',
  },
  {
    heading: 'Denní režim',
    body:
      'Procedury se rozloží do celého dne a probíhají většinou v budově, kde bydlíte, případně v budovách spojených koridorem. Mezi nimi zbývá čas na pitnou kúru na kolonádě, procházky v lázeňských lesích a kulturní program města.',
  },
  {
    heading: 'Kontrolní a výstupní vyšetření',
    body:
      'V průběhu pobytu lékař léčebný plán podle vývoje upravuje. Na závěr proběhne výstupní vyšetření a doporučení pro další péči doma.',
  },
]

export const packingList = [
  'Průkaz pojištěnce a občanský průkaz',
  'Schválený návrh na lázeňskou péči, pokud jste ho dostali poštou (u příspěvkové péče)',
  'Seznam užívaných léků a zásobu na celou dobu pobytu',
  'Lékařské zprávy k léčené diagnóze, zejména recentní nálezy',
  'Sportovní obuv a oblečení na cvičení, plavky, župan a přezůvky',
  'Lázeňský pohárek na pitnou kúru — dá se koupit i na místě',
  'Společenské oblečení na koncert nebo večeři, pokud plánujete kulturní program',
]

/* ------------------------------------------------------------------ *
 * Výhody pobytu
 * ------------------------------------------------------------------ */

export interface Benefit {
  title: string
  body: string
  linkLabel?: string
  href?: string
  external?: boolean
}

export const benefits: Benefit[] = [
  {
    title: 'Věrnostní program Ensana Life',
    body:
      'Členství je zdarma, bez expirace a přináší slevu až 20 % na ubytování, wellness, lázně, restauraci i kavárnu. Na ceny a doplatky uvedené v ceníku lázeňské péče hrazené pojišťovnou slevu uplatnit nelze — vyplatí se ale na doprovod, na navazující samoplátecké pobyty a na služby, které si během pobytu doobjednáte.',
    linkLabel: 'Přehled úrovní a výhod',
    href: '/cs/ensana-life',
  },
  {
    title: 'Turistická karta Mariánské Lázně',
    body:
      'Karta města nabízí volný vstup do více než 60 míst, slevy až 50 % na dalších více než 20 službách a po celou dobu platnosti slouží jako bezplatná jízdenka městské dopravy. Prodává se na dva, čtyři nebo sedm dní a koupíte ji v turistickém informačním centru na Hlavní třídě 47.',
    linkLabel: 'Praktické informace o městě',
    href: '/cs/prakticke-informace',
  },
  {
    title: 'Prameny a kolonáda zdarma',
    body:
      'Pitná kúra na kolonádě nic nestojí — prameny jsou volně přístupné a jsou součástí léčebného plánu, nikoli placenou nadstavbou. Ke Zpívající fontáně, Kolonádě Maxima Gorkého i k Rudolfovu a Ferdinandovu prameni to máte z lázeňských hotelů pár minut pěšky.',
    linkLabel: 'Průvodce prameny',
    href: '/cs/prehled-pramenu',
  },
  {
    title: 'Léčba přímo v hotelu',
    body:
      'Procedury probíhají většinou v budově, kde bydlíte, případně v budovách spojených koridorem — ven se za nimi nechodí. Výjimkou bývá procedura s unikátním vybavením, které má jen jeden z lázeňských domů. U třítýdenního pobytu s omezenou hybností je to zásadní rozdíl v pohodlí i v bezpečí.',
  },
  {
    title: 'Bazény, sauny a wellness',
    body:
      'Bazén nepatří jen ke čtyřhvězdičkovým hotelům — vlastní ho i tříhvězdičkové Vltava a Svoboda. Největší je ve Hvězdě: 18 × 8 m, k tomu vířivka, sauny a solná jeskyně. Hosté dependancí ubytovaní na pokojích bez doplatku mohou bazén využívat za hodinovou sazbu podle ceníku: 100 Kč/hod. ve Vltavě, 150 Kč/hod. ve Svobodě a 250 Kč/hod. ve Hvězdě a Pacifiku. Vybavení konkrétního hotelu najdete v jeho detailu.',
    linkLabel: 'Přehled hotelů a ubytování',
    href: '/cs/ubytovani',
  },
  {
    title: 'Co dělat mezi procedurami',
    body:
      'Lázeňské lesy s 70 kilometry značených cest, golfové hřiště z roku 1905, Zpívající fontána, koncerty, výlety do Chebu, Lokte nebo do Slavkovského lesa. Tři týdny jsou dost dlouhá doba na to, aby program mimo procedury dával smysl.',
    linkLabel: 'Tipy na výlety a program',
    href: '/cs/co-delat',
  },
]

/* ------------------------------------------------------------------ *
 * Co si připravit k lékaři
 * ------------------------------------------------------------------ */

export const doctorChecklist = [
  'Přehled své diagnózy a dosavadní léčby — propouštěcí zprávy, nálezy odborných lékařů, výsledky vyšetření.',
  'Doporučení odborného lékaře, pokud ho už máte; návrh se vystavuje právě na jeho základě.',
  'Informaci, že chcete do Mariánských Lázní a konkrétně do společnosti Léčebné lázně Mariánské Lázně a.s.',
  'Představu o tom, zda můžete čerpat pobyt v pracovní neschopnosti (komplexní péče), nebo v dovolené (příspěvková péče).',
  'Seznam trvale užívaných léků.',
]

export const reservationChecklist = [
  'Jméno, příjmení, datum narození a kontaktní údaje včetně adresy',
  'Zdravotní pojišťovnu a číslo pojištěnce',
  'Typ schválené péče a délku pobytu — 21 nebo 28 dnů u komplexní, 21 nebo 14 dnů u příspěvkové',
  'Preferovaný lázeňský hotel a kategorii pokoje',
  'Preferovaný termín nástupu a náhradní termín',
  'Způsob úhrady doplatku',
]

/* ------------------------------------------------------------------ *
 * Časté dotazy
 * ------------------------------------------------------------------ */

export interface Faq {
  q: string
  a: string
}

export const faqs: Faq[] = [
  {
    q: 'Je možné překročit platnost návrhu na lázeňskou péči?',
    a: 'Není. Léčebný pobyt je nutné nastoupit v době platnosti návrhu, tedy nejpozději poslední den platnosti.',
  },
  {
    q: 'Můžu si dohodnout termín pobytu, hotel a typ ubytování předem?',
    a: 'Ano, a nic si za to neúčtujeme — rezervace termínu, hotelu ani kategorie pokoje u nás nestojí nic. Rezervační poplatek přitom není v cestovním ruchu neobvyklý, proto se na něj ptejte i tam, kde si pobyt srovnáváte.',
  },
  {
    q: 'Ve kterém hotelu je při komplexní lázeňské péči ubytování bez doplatku?',
    a: 'Lázně uvádějí hotely Vltava a Svoboda a dependance Labe, Windsor a Vítkov. V ceníku pro rok 2026 mají nulový doplatek pokoje 1/2 Standard v dependancích; u hotelů Vltava a Svoboda ceník obsahuje jen kategorie Komfort a Komfort Plus, které doplatek mají — konkrétní kategorii bez doplatku si proto ověřte při rezervaci.',
  },
  {
    q: 'Za co se u komplexní péče účtuje doplatek?',
    a: 'Za nadstandardní ubytování a za stravování formou bufetu při snídani a večeři — vždy, a u některých hotelů i při obědě.',
  },
  {
    q: 'Kdo vystavuje pracovní neschopnost při komplexní lázeňské péči?',
    a: 'Lázeňský lékař při vstupní lékařské prohlídce.',
  },
  {
    q: 'Lze příspěvkovou péči čerpat s ubytováním mimo lázeňské hotely?',
    a: 'Nelze. Podle platné legislativy ji nelze poskytovat bez ubytování v registrovaném zdravotnickém zařízení, tedy v lázeňském hotelu.',
  },
  {
    q: 'Dochází se na procedury mimo hotel? Jak daleko?',
    a: 'Většinou ne. Procedury bývají v hotelu, kde jste ubytováni — podle hotelu buď přímo ve vaší budově, nebo v budově spojené koridorem, takže se nechodí ven. Výjimkou je procedura s unikátním vybavením, které má jen jeden z lázeňských domů; na tu se dochází.',
  },
  {
    q: 'Je možné ubytování společně s doprovodem bez účasti pojišťovny?',
    a: 'Ano. U doprovodu jde o takzvaný samoplátecký pobyt, cena se řídí objednanými službami a platným ceníkem pro samoplátce.',
  },
  {
    q: 'Musím nastoupit v určitý den v týdnu, například jen v pondělí?',
    a: 'Nemusíte. Termín nástupu může být stanovený nebo domluvený na kterýkoli den v týdnu.',
  },
  {
    q: 'Co když pojišťovna návrh neschválí?',
    a: 'Pobyt můžete absolvovat jako samoplátce. Léčebné lázně Mariánské Lázně a.s. na to mají nabídku Lázeňská péče bez pojišťovny v hotelu Svoboda; další možnosti nabízí síť hotelů Ensana.',
  },
  {
    q: 'Kolik činí lázeňský poplatek a kdo ho neplatí?',
    a: 'Lázeňský poplatek je 50 Kč za osobu a den a platí se při příjezdu v hotelu. Osvobozeny jsou osoby mladší 18 let, osoby nevidomé, držitelé průkazu ZTP/P a jejich průvodci.',
  },
  {
    q: 'Můžu na doplatky uplatnit slevu z věrnostního programu Ensana Life?',
    a: 'Nemůžete. Na ceny a doplatky uvedené v ceníku lázeňské péče hrazené pojišťovnou slevu v rámci programu Ensana Life uplatnit nelze.',
  },
]
