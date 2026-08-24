import type { Locale } from '@/i18n/config'

/**
 * Indications and general contraindications for spa treatment at
 * Léčebné lázně Mariánské Lázně a.s., transcribed from the spa's own published
 * lists (Indikační seznam / Indikationsverzeichnis / list of indications).
 *
 * The Czech list is the statutory one (Act No. 1/2015 Coll.) and carries the
 * indication codes and the care types insurers cover; the German, English and
 * Russian lists are the spa's plain-language versions for self-payers and have
 * no codes. The contraindication lists genuinely differ between the language
 * editions — each locale reproduces its own source rather than a translation of
 * another, and `sourceNote` records which edition it came from.
 *
 * Obvious typos in the source PDFs were corrected (Bechtěrevova, ledviny,
 * "ambulantní péče"); no wording was otherwise changed, shortened or invented.
 */

export interface IndicationItem {
  /** Statutory code from the Czech Indikační seznam, e.g. "VII/7". Czech only. */
  code?: string
  text: string
  /** Stay types covered by Czech public insurance, e.g. "základní pobyt K 21, P 21". Czech only. */
  coverage?: string
}

export interface IndicationGroup {
  id: string
  title: string
  items: IndicationItem[]
}

export interface CareType {
  code: string
  label: string
}

export interface IndicationsContent {
  metaTitle: string
  metaDescription: string
  title: string
  intro: string
  breadcrumb: string
  indicationsTitle: string
  careTypesTitle?: string
  careTypes?: CareType[]
  groups: IndicationGroup[]
  contraindicationsTitle: string
  contraindicationsIntro: string
  contraindications: string[]
  disclaimerTitle: string
  disclaimer: string
  sourceNote: string
  ctaTitle: string
  ctaText: string
  ctaLabel: string
}

export const indications: Record<Locale, IndicationsContent> = {
  cs: {
    metaTitle: 'Indikace a kontraindikace lázeňské léčby — Mariánské Lázně — Marienbad.com',
    metaDescription:
      'Přehled diagnóz, které se v Mariánských Lázních léčí, včetně indikačních kódů a typů hrazené péče, a obecné kontraindikace lázeňské léčebně rehabilitační péče.',
    title: 'Indikace a kontraindikace lázeňské léčby',
    intro:
      'Mariánskolázeňská kúra není wellness pobyt — je to léčba pod lékařským dohledem, opřená o přírodní léčivé zdroje. Následující přehled shrnuje, které diagnózy se tu léčí a za jakých okolností lázeňskou péči naopak nelze poskytnout.',
    breadcrumb: 'Indikace a kontraindikace',
    indicationsTitle: 'Léčené diagnózy',
    careTypesTitle: 'Typy hrazené péče',
    careTypes: [
      {
        code: 'K — Komplexní péče',
        label: '21 nebo 28 dní pobytu, u některých indikací s možným prodloužením. Zdravotní pojišťovna hradí léčení, ubytování i stravu.',
      },
      {
        code: 'P — Příspěvková péče',
        label: '14 nebo 21 dní pobytu. Pojišťovna hradí pouze léčení, hotelové ubytování si pojištěnec doplácí sám.',
      },
    ],
    groups: [
      {
        id: 'oncology',
        title: 'I. Nemoci onkologické',
        items: [
          {
            code: 'I/1',
            text: 'Onkologické případy po ukončení komplexní protinádorové léčby, bez jakýchkoliv známek recidivy',
            coverage: 'základní pobyt K 21, opakovaný pobyt K 21, P 21 (P 14)',
          },
        ],
      },
      {
        id: 'circulatory',
        title: 'II. Nemoci oběhového ústrojí',
        items: [
          { code: 'II/1', text: 'Symptomatická ischemická choroba srdeční', coverage: 'základní pobyt P 21, opakovaný pobyt P 21 (P 14)' },
          { code: 'II/2', text: 'Stav po infarktu myokardu', coverage: 'základní pobyt K 28' },
          { code: 'II/3', text: 'Hypertenzní nemoc II. až III. stupně', coverage: 'základní pobyt K 28, P 21, opakovaný pobyt P 21 (P 14)' },
          {
            code: 'II/4',
            text: 'Onemocnění tepen končetin na podkladě aterosklerotickém II b nebo zánětlivém',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt K 21, P 21 (P 14)',
          },
          {
            code: 'II/5',
            text: 'Funkční poruchy periferních cév a stavy po trombózách; chronický lymfatický edém',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt P 21 (P 14)',
          },
          {
            code: 'II/8',
            text: 'Stavy po rekonstrukčních a revaskularizačních operacích na cévním systému mimo srdce a hrudní aorty; stavy po perkutánní transluminární angioplastice',
            coverage: 'základní pobyt K 21, P 21',
          },
        ],
      },
      {
        id: 'digestive',
        title: 'III. Nemoci trávicího ústrojí',
        items: [
          {
            code: 'III/1',
            text: 'Chronické a recidivující onemocnění žaludku a střev s maldigestivními příznaky přetrvávajícími při standardní farmakoterapii; stavy po těžkých střevních infekcích, parazitózách a mykotických onemocněních',
            coverage: 'základní pobyt P 21, opakovaný pobyt P 21 (P 14)',
          },
          {
            code: 'III/2',
            text: 'Stavy po operaci žaludku, dvanáctníku, jícnu a střev s postresekční symptomatologií endoskopicky ověřenou',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt P 21 (P 14)',
          },
          {
            code: 'III/3',
            text: 'Crohnova nemoc; colitis ulcerosa',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt K 21, P 21 (P 14)',
          },
          {
            code: 'III/4',
            text: 'Chronická onemocnění žlučníku a žlučového traktu s lithiázou, pokud je operace kontraindikovaná; sklerotizující cholangoitis; funkční poruchy žlučového traktu',
            coverage: 'základní pobyt P 21, opakovaný pobyt P 21 (P 14)',
          },
          {
            code: 'III/5',
            text: 'Stavy po komplikovaných operacích žlučníku a žlučového traktu, po zákrocích pro stenózu a lithiázu žlučových cest — pooperační pankreatitidocholangoitis, ikterus, instrumentace žlučových cest, endoskopická retrográdní cholangiopankreatografie (ERCP); stavy po dissoluci kamenů a extrakorporální litotrypsii',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt P 21 (P 14)',
          },
          {
            code: 'III/6',
            text: 'Stavy po akutní hepatitis jakékoliv etiologie a toxickém jaterním poškození (lékovém i vlivem práce); chronická hepatitis s přetrváváním pozitivity markerů; asociovaná autoimunní hepatitis; primární biliární cirhóza',
            coverage: 'základní pobyt K 21, opakovaný pobyt K 21, P 21 (P 14)',
          },
          {
            code: 'III/7',
            text: 'Stavy po resekčních výkonech a transplantacích jater nebo operacích a transplantacích pankreatu',
            coverage: 'základní pobyt K 21, opakovaný pobyt P 21/14',
          },
          {
            code: 'III/8',
            text: 'Stavy po akutní pankreatitis nebo po exacerbaci chronické pankreatitis; prokázaná chronická pankreatitis',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt P 21 (P 14)',
          },
        ],
      },
      {
        id: 'metabolic',
        title: 'IV. Nemoci z poruchy výměny látkové a žláz s vnitřní sekrecí',
        items: [
          { code: 'IV/1', text: 'Diabetes mellitus a následné komplikace', coverage: 'základní pobyt K 21, P 21, opakovaný pobyt P 21 (P 14)' },
          {
            code: 'IV/2',
            text: 'Stavy po totální thyreoidektomii; hypothyreóza při obtížně probíhající lékové substituci',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt P 21 (P 14)',
          },
          {
            code: 'IV/3',
            text: 'Stavy po operacích hyperfunkčního benigního adenomu hypofýzy a nadledvin při přítomnosti sekundárních symptomů onemocnění (zejména artropatie a myopatie)',
            coverage: 'základní pobyt K 21',
          },
        ],
      },
      {
        id: 'respiratory',
        title: 'V. Netuberkulózní nemoci dýchacího ústrojí',
        items: [
          {
            code: 'V/1',
            text: 'Stavy po operaci horních a dolních cest dýchacích, netýká se stavů po operacích tonsil, adenoidních vegetací a nosní přepážky; stavy po transplantaci plic',
            coverage: 'základní pobyt K 28, K 21',
          },
          {
            code: 'V/2',
            text: 'Poškození hrtanu a hlasivek v důsledku hlasového přetížení; stavy po fonochirurgické léčbě',
            coverage: 'základní pobyt K 21, opakovaný pobyt P 21 (P 14)',
          },
          { code: 'V/3', text: 'Stavy po komplikovaném zánětu plic', coverage: 'základní pobyt K 21' },
          {
            code: 'V/4',
            text: 'Bronchiektazie; recidivující záněty dolních cest dýchacích a chronické záněty dýchacího ústrojí jako nemoc z povolání podle jiného právního předpisu, který stanoví seznam nemocí z povolání',
            coverage: 'základní pobyt K 21, opakovaný pobyt K 21',
          },
          {
            code: 'V/5',
            text: 'Astma bronchiale; chronická obstrukční plicní nemoc',
            coverage: 'základní pobyt K 28, P 21, opakovaný pobyt K 28, P 21 (P 14)',
          },
          {
            code: 'V/6',
            text: 'Intersticiální plicní fibrózy jakékoliv etiologie v soustavném léčení',
            coverage: 'základní pobyt K 28, P 21, opakovaný pobyt K 21, P 21 (P 14)',
          },
          {
            code: 'V/7',
            text: 'Následky toxických účinků plynů, dýmů, leptavých par a dráždivých prachů na horní a dolní cesty dýchací',
            coverage: 'základní pobyt K 28, opakovaný pobyt K 21',
          },
        ],
      },
      {
        id: 'nervous',
        title: 'VI. Nemoci nervové',
        items: [
          { code: 'VI/2', text: 'Polyneuropatie s paretickými projevy', coverage: 'základní pobyt K 28, P 21, opakovaný pobyt K 28, P 21 (P 14)' },
          { code: 'VI/3', text: 'Kořenové syndromy s iritačně-zánikovým syndromem', coverage: 'základní pobyt K 21, opakovaný pobyt P 21 (P 14)' },
          {
            code: 'VI/6',
            text: 'Stavy po poraněních a operacích mozku, míchy a periferního nervstva s poruchami hybnosti se známkami obnovující se funkce',
            coverage: 'základní pobyt K 28, opakovaný pobyt K 28, P 21 (P 14)',
          },
          { code: 'VI/8', text: 'Nervosvalová onemocnění primární, sekundární a degenerativní', coverage: 'základní pobyt K 28, opakovaný pobyt K 28' },
          { code: 'VI/9', text: 'Syringomyelie s paretickými projevy', coverage: 'základní pobyt K 21, opakovaný pobyt K 21, P 21 (P 14)' },
          { code: 'VI/11', text: 'Parkinsonova choroba', coverage: 'základní pobyt K 21, opakovaný pobyt K 21' },
        ],
      },
      {
        id: 'musculoskeletal',
        title: 'VII. Nemoci pohybového ústrojí',
        items: [
          {
            code: 'VII/1',
            text: 'Revmatoidní artritis I. až IV. stupně včetně juvenilní artritis, soustavně léčená v rámci ambulantní péče',
            coverage: 'základní pobyt K 28, P 21, opakovaný pobyt K 28, P 21 (P 14)',
          },
          {
            code: 'VII/2',
            text: 'Ankylozující spondylitis (Bechtěrevova nemoc) soustavně léčená v rámci ambulantní péče',
            coverage: 'základní pobyt K 28, P 21, opakovaný pobyt K 28, P 21 (P 14)',
          },
          {
            code: 'VII/3',
            text: 'Ostatní séronegativní spondartritis soustavně léčená v rámci ambulantní péče (psoriatická artritis, Reiterův syndrom, enteropatická artritis, reaktivní-parainfekční); sekundární artritis soustavně léčená v rámci ambulantní péče',
            coverage: 'základní pobyt K 28, P 21, opakovaný pobyt K 28, P 21 (P 14)',
          },
          {
            code: 'VII/4',
            text: 'Mimokloubní revmatismus soustavně léčený v rámci ambulantní péče; difúzní onemocnění pojiva soustavně léčené v rámci ambulantní péče (systémový lupus erythematodes, sklerodermie, polymyositis, dermatomyositis, Sjögrenův syndrom a ostatní překryvné syndromy)',
            coverage: 'základní pobyt K 28, opakovaný pobyt K 28, P 21 (P 14)',
          },
          {
            code: 'VII/5',
            text: 'Osteoporóza s komplikacemi, pokud soustavná ambulantní rehabilitační péče delší než 3 měsíce není efektivní nebo v návaznosti na hospitalizaci pro komplikaci osteoporózy; kostní změny, které jsou následkem práce ve stlačeném vzduchu jako nemoc z povolání podle jiného právního předpisu, který stanoví seznam nemocí z povolání',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt K 21',
          },
          {
            code: 'VII/6',
            text: 'Bolestivé syndromy šlach, šlachových pochev, burz, úponů svalů, kosterních svalů nebo kloubů (včetně onemocnění způsobeného účinkem vibrací a dlouhodobého, nadměrného, jednostranného přetěžování jako nemoci z povolání podle jiného právního předpisu, který stanoví seznam nemocí z povolání)',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt K 21, P 21 (P 14)',
          },
          {
            code: 'VII/7',
            text: 'Koxartróza, gonartróza v soustavné ambulantní péči ortopeda a rehabilitačního lékaře',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt K 21, P 21 (P 14)',
          },
          { code: 'VII/8', text: 'Artrózy v ostatních lokalizacích; artropatie', coverage: 'základní pobyt K 21, opakovaný pobyt K 21, P 21 (P 14)' },
          {
            code: 'VII/9',
            text: 'Chronický vertebrogenní algický syndrom funkčního původu v soustavné ambulantní rehabilitační péči',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt P 21 (P 14)',
          },
          { code: 'VII/10', text: 'Stavy po ortopedických operacích s použitím kloubní náhrady', coverage: 'základní pobyt K 28' },
          {
            code: 'VII/11',
            text: 'Stavy po úrazech pohybového ústrojí a po ortopedických operacích včetně stavů po operacích meziobratlových plotének a stenóz kanálu páteřního, pokud není soustavná ambulantní nebo lůžková rehabilitační péče efektivní',
            coverage: 'základní pobyt K 28, opakovaný pobyt K 28, P 21 (P 14)',
          },
          {
            code: 'VII/12',
            text: 'Stavy po amputacích dolní končetiny, stupeň aktivity 1 až 4, kdy je pojištěnec vybavený protézou',
            coverage: 'základní pobyt K 21',
          },
        ],
      },
      {
        id: 'urinary',
        title: 'VIII. Nemoci močového ústrojí',
        items: [
          {
            code: 'VIII/1',
            text: 'Recidivující a chronické netuberkulózní záněty ledvin a močových cest rezistentní na léčbu antibiotiky (ATB) a jinou farmakologickou léčbu, v soustavné péči urologa minimálně 12 měsíců; cystické onemocnění ledvin',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt P 21 (P 14)',
          },
          {
            code: 'VIII/2',
            text: 'Nefrolitiáza bez městnání v močových cestách; nefrokalcinóza',
            coverage: 'základní pobyt K 21, P 21, opakovaný pobyt P 21 (P 14)',
          },
          {
            code: 'VIII/3',
            text: 'Stavy po operacích ledvin a močových cest včetně operací endovezikálních a stavů po komplikované prostatektomii a nefrolitotrypsii, doléčení po litotrypsii extrakorporálními rázovými vlnami (LERV)',
            coverage: 'základní pobyt K 21, P 21',
          },
          {
            code: 'VIII/4',
            text: 'Chronická prostatitis nebo chronická prostatovesikulitis rezistentní na farmakologickou léčbu a léčbu antibiotiky (ATB), v soustavné péči urologa minimálně 12 měsíců',
            coverage: 'základní pobyt P 21, opakovaný pobyt P 21 (P 14)',
          },
          {
            code: 'VIII/5',
            text: 'Stavy po transplantaci ledviny při stabilizované funkci štěpu (transplantované ledviny); dárce štěpu (ledviny)',
            coverage: 'základní pobyt K 21, opakovaný pobyt P 21 (P 14)',
          },
        ],
      },
      {
        id: 'skin',
        title: 'X. Nemoci kožní',
        items: [
          { code: 'X/1', text: 'Atopický ekzém', coverage: 'základní pobyt K 21, P 21, opakovaný pobyt K 21, P 21 (P 14)' },
          {
            code: 'X/2',
            text: 'Generalizovaná a artropatická psoriasis vulgaris',
            coverage: 'základní pobyt K 28, P 21, opakovaný pobyt K 28, P 21 (P 14)',
          },
        ],
      },
    ],
    contraindicationsTitle: 'Obecné kontraindikace lázeňské léčebně rehabilitační péče',
    contraindicationsIntro:
      'I při indikované diagnóze nelze lázeňskou péči poskytnout, pokud je přítomna některá z následujících okolností. O konečném posouzení vždy rozhoduje lékař.',
    contraindications: [
      'Infekční nemoci přenosné z člověka na člověka a bacilonosičství; je-li některá nemoc indikovaná pro lázeňskou léčebně rehabilitační péči sdružena s TBC dýchacího ústrojí nebo jinou formou TBC, je léčba možná jen po řádném ukončení léčby antituberkulotiky a po kladném vyjádření pneumologa.',
      'Všechny nemoci v akutním stádiu a stavy, při kterých lze důvodně očekávat destabilizaci zdravotního stavu.',
      'Klinické známky oběhového selhání (netýká se indikační skupiny II); maligní arytmie a trvalá hypertenze nad 120 mm Hg diastolického tlaku.',
      'Stavy po hluboké trombóze do 3 měsíců po odeznění nemoci, stavy po povrchové tromboflebitis do 6 týdnů po odeznění nemoci.',
      'Opakující se profuzní krvácení jakékoli etiologie v posledních 12 měsících; léčba je možná jen po kladném vyjádření hematologa a transfuziologa.',
      'Kachexie různé etiologie znemožňující intenzivní rehabilitaci (Body Mass Index méně než 16,5).',
      'Zhoubné nádory během léčby a po ní s klinicky zjistitelnými známkami aktivity nemoci; kontraindikovány nejsou případy, kdy není prokazatelných známek progrese nebo je progrese pomalá a dlouhodobá a charakter nádorového onemocnění není překážkou pro doporučenou lázeňskou péči souběžného jiného onemocnění; dlouhodobá hormonální protinádorová terapie není kontraindikací.',
      'Nekompenzovaná epilepsie; u pojištěnce s epilepsií může být léčba poskytnuta na základě kladného vyjádření neurologa, který ho má v dispenzární péči; pro indikační skupinu VI není epilepsie kontraindikací.',
      'Aktivní ataky nebo fáze psychóz a duševní poruchy s asociálními projevy nebo sníženou možností komunikace nebo neschopností dodržovat léčebný postup a vnitřní řád zdravotnického zařízení, transitorní stavy zmatenosti, demence.',
      'Závislost na alkoholu a závislost na návykových látkách; netýká se lázeňské péče, která bezprostředně navazuje na hospitalizaci po operaci a je nedílnou součástí pooperační péče.',
      'Závislost na nikotinu u pojištěnců s indikacemi skupiny II, III/1, III/2, IV a V; netýká se lázeňské péče, která bezprostředně navazuje na hospitalizaci pro danou nemoc a je nedílnou součástí pooperační péče.',
      'Inkontinence moče II. a III. stupně a inkontinence stolice.',
      'Těhotenství.',
    ],
    disclaimerTitle: 'Než se rozhodnete',
    disclaimer:
      'Tento přehled má informativní charakter a nenahrazuje lékařskou konzultaci. O vhodnosti lázeňské léčby, jejím rozsahu a délce rozhoduje vždy lékař — u péče hrazené z veřejného zdravotního pojištění na základě návrhu ošetřujícího lékaře a schválení zdravotní pojišťovnou. Pokud si pobyt hradíte sami, poradí vám lékaři lázeňských hotelů při vstupní prohlídce.',
    sourceNote:
      'Zdroj: Indikační seznam Léčebných lázní Mariánské Lázně a.s. pro lázeňskou péči o dospělé podle zákona č. 1/2015 Sb., ve znění platném pro rok 2026.',
    ctaTitle: 'Nevíte, který pobyt je pro vás vhodný?',
    ctaText:
      'Léčebné programy se liší podle diagnózy i délky pobytu. Přehled hotelů Ensana v Mariánských Lázních a jejich zaměření vám pomůže zúžit výběr — konečné doporučení pak dostanete od lázeňského lékaře.',
    ctaLabel: 'Přehled hotelů a ubytování',
  },

  de: {
    metaTitle: 'Indikationen und Kontraindikationen der Kurbehandlung — Marienbad — Marienbad.com',
    metaDescription:
      'Übersicht der Krankheiten, die in Marienbad behandelt werden, und die allgemeinen Kontraindikationen einer Kurbehandlung — nach dem Indikationsverzeichnis des Kurbetriebs.',
    title: 'Indikationen und Kontraindikationen der Kurbehandlung',
    intro:
      'Die Marienbader Kur ist kein Wellnessaufenthalt, sondern eine ärztlich begleitete Behandlung auf Grundlage natürlicher Heilmittel. Die folgende Übersicht zeigt, welche Krankheiten hier behandelt werden und unter welchen Umständen eine Kurbehandlung nicht möglich ist.',
    breadcrumb: 'Indikationen und Kontraindikationen',
    indicationsTitle: 'Behandelte Krankheiten',
    groups: [
      {
        id: 'oncology',
        title: 'Onkologische Krankheiten',
        items: [{ text: 'Onkologische Fälle nach Beendigung einer komplexen Behandlung, ohne irgendwelche Anzeichen eines Rückfalls' }],
      },
      {
        id: 'circulatory',
        title: 'Krankheiten des Kreislaufsystems',
        items: [
          { text: 'Symptomatische ischämische Herzleiden' },
          { text: 'Zustand nach einem Myokardinfarkt' },
          { text: 'Hypertoniekrankheiten II. bis III. Grads' },
          { text: 'Erkrankungen der Adern von den Extremitäten bedingt durch Atherosklerose oder eine Entzündung' },
          { text: 'Funktionsstörungen der peripheren Gefäße und Zustände nach Thrombosen, frühestens 3 Monate nach Abklingen des akuten Stadiums' },
          { text: 'Chronisches Lymphödem' },
          { text: 'Zustände nach rekonstruktiven und Revaskularisationsoperationen am Gefäßsystem außer dem Herz' },
          { text: 'Zustände nach einer perkutanen transluminalen Angioplastie' },
        ],
      },
      {
        id: 'digestive',
        title: 'Krankheiten des Verdauungssystems',
        items: [
          { text: 'Chronische und rezidive Erkrankungen des Magens und des Darms mit Maldigestionsanzeichen, die bei einer standardmäßigen Pharmakotherapie anhaltend sind' },
          { text: 'Zustände nach schweren Darminfektionen, Parasitosen und mykotische Erkrankungen' },
          { text: 'Zustände nach Operationen des Magens, des Zwölffingerdarms, der Speiseröhre und des Darms mit postresektiver, endoskopisch nachgewiesener Symptomatologie' },
          { text: 'Crohnsche Krankheit' },
          { text: 'Colitis ulcerosa' },
          { text: 'Chronische Erkrankungen der Gallenblase und des Gallentrakts mit Lithiasis, sofern es sich um eine kontraindizierte Operation handelt' },
          { text: 'Sklerosierende Cholangitis' },
          { text: 'Funktionsstörungen des Gallentrakts' },
          { text: 'Zustände nach komplizierten Operationen der Gallenblase und des Gallentrakts, nach Eingriffen an den Gallenwegen aufgrund von Lithiasis und Stenosis (Pankreatitis, Cholangitis, Ikterus, Instrumentation an den Gallenwegen, ERCP)' },
          { text: 'Zustände nach Dissolution von Steinen und extrakorporaler Lithotripsie' },
          { text: 'Zustände nach akuter Hepatitis beliebiger Ätiologie und nach toxischer Leberschädigung (durch Medikamente sowie auch arbeitsbedingt)' },
          { text: 'Chronische Hepatitis mit anhaltendem Markerpositivum' },
          { text: 'Assoziierte autoimmune Hepatitis' },
          { text: 'Primäre biliäre Zirrhose' },
          { text: 'Zustände nach resektiven Operationen und Lebertransplantationen oder Operationen und Pankreastransplantationen' },
          { text: 'Zustände nach akuter Pankreatitis oder nach Exazerbation der chronischen Pankreatitis' },
          { text: 'Nachgewiesene chronische Pankreatitis' },
        ],
      },
      {
        id: 'metabolic',
        title: 'Krankheiten aufgrund von Stoffwechsel- und Hormondrüsenstörungen',
        items: [{ text: 'Diabetes mellitus' }],
      },
      {
        id: 'respiratory',
        title: 'Nichttuberkulöse Krankheiten der Atemorgane',
        items: [
          { text: 'Zustände nach Operation der oberen und unteren Atemwege; bezieht sich nicht auf Zustände nach der Operation der Tonsillen, der adenoiden Vegetationen und der Nasenscheidewand' },
          { text: 'Zustände nach Lungentransplantationen' },
          { text: 'Schäden am Kehlkopf sowie der Stimmbänder infolge einer Überlastung der Stimme' },
          { text: 'Zustände nach phonochirurgischen Behandlungen' },
          { text: 'Zustände nach komplizierten Lungenentzündungen' },
          { text: 'Bronchiektasen' },
          { text: 'Rezidive Entzündungen der unteren Atemwege und chronische Entzündungen der Atemorgane als Berufskrankheit entsprechend einer anderen Rechtsvorschrift' },
          { text: 'Bronchialasthma' },
          { text: 'Chronische obstruktive Lungenkrankheiten' },
          { text: 'Interstitielle Lungenfibrose beliebiger Ätiologie in ständiger Behandlung' },
          { text: 'Folgen von toxischen Einwirkungen von Gasen, Rauch, ätzenden Dämpfen und Reizstaub auf die oberen und unteren Atemwege' },
        ],
      },
      {
        id: 'nervous',
        title: 'Nervenkrankheiten',
        items: [
          { text: 'Polyneuropathie mit paretischen Erscheinungen' },
          { text: 'Wurzelsyndrom mit Irritations-Ausfallsyndrom' },
          { text: 'Zustände nach Verletzungen und Operationen des Gehirns, des Rückenmarks und des peripheren Nervensystems mit Bewegungsstörungen mit Anzeichen, dass die Funktion wiederhergestellt wird' },
          { text: 'Nervenmuskelerkrankungen — primäre, sekundäre und degenerative Erkrankungen' },
          { text: 'Syringomyelie mit paretischen Erscheinungen' },
          { text: 'Parkinsonkrankheit' },
        ],
      },
      {
        id: 'musculoskeletal',
        title: 'Krankheiten des Bewegungsapparats',
        items: [
          { text: 'Rheumatoide Arthritis I. bis IV. Grads, einschließlich juveniler Arthritis, mit ständig ambulanter Behandlung' },
          { text: 'Ankylosierende Spondylitis (Bechterew-Krankheit) mit ständig ambulanter Behandlung' },
          { text: 'Sonstige seronegative Spondarthritis mit ständig ambulanter Behandlung (psoriatische Arthritis, Reiter-Syndrom, enteropathische Arthritis, reaktive-parainfektiöse Arthritis)' },
          { text: 'Sekundäre Arthritis mit ständig ambulanter Behandlung' },
          { text: 'Rheumatismus außer Gelenkrheumatismus mit ständig ambulanter Behandlung' },
          { text: 'Diffusionserkrankungen verbunden mit ständig ambulanter Behandlung (systemischer Lupus erythematodes, Sklerodermie, Polymyositis, Dermatomyositis, Sjögren-Syndrom und sonstige überlagernde Syndrome)' },
          { text: 'Osteoporose mit Komplikationen, sofern die ständige ambulante Behandlung zur Rehabilitation von länger als 3 Monaten nicht effektiv war' },
          { text: 'Knochenveränderungen infolge von Arbeitstätigkeiten in Druckluft als Berufskrankheit entsprechend einer anderen Rechtsvorschrift' },
          { text: 'Schmerzhafte Symptome der Sehnen, der Sehnenscheiden, der Schleimbeutel, der Muskelansätze, der Skelettmuskeln oder der Gelenke (einschließlich von Erkrankungen durch Vibrationen sowie durch langfristige, überdurchschnittliche, einseitige Belastung als Berufskrankheit entsprechend einer anderen Rechtsvorschrift)' },
          { text: 'Koxarthrose, Gonarthrose mit ständig ambulanter Behandlung bei einem Orthopäden und Arzt für Rehabilitation' },
          { text: 'Arthrose an anderen Stellen, Arthropathie' },
          { text: 'Chronisches vertebragenes algisches Syndrom von funktionellem Ursprung mit ständig ambulanter Behandlung' },
          { text: 'Zustände nach orthopädischen Operationen mit Gelenkersatz' },
          { text: 'Zustände nach Unfällen des Bewegungsapparats und nach orthopädischen Operationen, einschließlich der Zustände nach Operationen der Bandscheiben und einer Verengung des Wirbelsäulenkanals, sofern eine ambulante oder stationäre Rehabilitation nicht effektiv ist' },
          { text: 'Zustände nach Amputationen der unteren Gliedmaßen, Aktivitätsgrad 1 bis 4, wo der Versicherte eine Prothese erhält' },
        ],
      },
      {
        id: 'urinary',
        title: 'Krankheiten des Harnsystems',
        items: [
          { text: 'Rezidive und chronische nichttuberkulöse Entzündungen der Nieren und Harnwege, die gegen eine ATB-Behandlung sowie andere pharmakologische Behandlung resistent sind, mit ständiger Behandlung bei einem Urologen von mindestens 12 Monaten' },
          { text: 'Zystische Erkrankungen der Nieren' },
          { text: 'Nephrolithiasis ohne Stauung in den Harnwegen' },
          { text: 'Nephrokalzinose' },
          { text: 'Zustände nach Operationen der Nieren und Harnwege, einschließlich endovesikaler Operationen sowie von Zuständen nach komplizierter Prostatektomie und Nephrolithotripsie, Behandlung nach LERV (nicht invasive Behandlung von Harnsteinen durch Stoßwellen außerhalb des Körpers)' },
          { text: 'Chronische Prostatitis oder chronische Prostatovesikulitis, die resistent gegen eine pharmakologische Behandlung sowie eine ATB-Behandlung ist, mit ständiger Behandlung bei einem Urologen von mindestens 12 Monaten' },
          { text: 'Zustände nach Nierentransplantationen bei stabilisierter Funktion des Transplantats (der transplantierten Niere)' },
          { text: 'Organspender (einer Niere)' },
        ],
      },
      {
        id: 'skin',
        title: 'Hautkrankheiten',
        items: [{ text: 'Atopisches Ekzem' }, { text: 'Generalisierte und arthropathische Psoriasis vulgaris' }],
      },
    ],
    contraindicationsTitle: 'Allgemeine Kontraindikationen einer Kurbehandlung',
    contraindicationsIntro:
      'Auch bei einer indizierten Diagnose ist eine Kurbehandlung nicht möglich, wenn einer der folgenden Umstände vorliegt. Die endgültige Beurteilung trifft immer ein Arzt.',
    contraindications: [
      'Infektionskrankheiten, die von Mensch zu Mensch übertragen werden, und Bakterienübertragung, vor allem Bauchtyphus und Paratyphus. Ist eine für die Kurbehandlung indizierte Krankheit mit TBC der Atmungsorgane oder einer anderen Form von TBC verbunden, kann die Kurbehandlung erst nach dem ordentlichen Beenden der Behandlung mit Antituberkulotika genehmigt werden.',
      'Alle Krankheiten im akuten Stadium.',
      'Klinische Anzeichen von Kreislaufschwäche, maligne Arrhythmie.',
      'Zustände nach tiefer Thrombose bis 3 Monate nach dem Abklingen der Beschwerden, Zustände nach einer Oberflächenthrombose bis 6 Wochen nach dem Abklingen der Beschwerden.',
      'Instabiler Diabetes mellitus (mit Ausnahme von Kindern und Jugendlichen) und dekompensierter Diabetes mellitus.',
      'Häufig wiederkehrende profuse Blutungen aller Typen.',
      'Alle Typen von Kachexie.',
      'Bösartige Tumore während und nach der Behandlung mit klinisch feststellbaren Anzeichen des Andauerns der Krankheit.',
      'Epilepsie, bis auf Fälle, bei denen es in den letzten 3 Jahren zu keinem Anfall kam und bei denen das EEG keine epileptischen Graphoelemente registriert hat. Dauern die pathologischen Veränderungen im EEG-Bericht an, kann die Heilbehandlung aufgrund einer positiven Erklärung des betreuenden Neurologen beantragt werden.',
      'Aktive Anfälle oder Phasen von Psychosen und geistigen Störungen mit asozialen Erscheinungsformen oder Kommunikationsschwächen, transitorische Verwirrungszustände.',
      'Alkoholabhängigkeit, Suchtmittelabhängigkeit.',
      'Kranke Personen, die auf die Hilfe einer anderen Person bei der Selbstversorgung angewiesen sind (mit Ausnahme von blinden Personen). Die Aufnahme ist ggf. nach vorheriger Absprache mit dem leitenden Arzt der Kuranstalt möglich.',
      'Harn- und Darminkontinenz, Enuresis nocturna.',
      'Rauchen bei Jugendlichen und bei Kranken.',
      'Schwangerschaft.',
      'Nicht heilende Hautdefekte aller Ursprünge.',
      'Hypertonie über 16 kPa des diastolischen Drucks (120 mm Hg).',
    ],
    disclaimerTitle: 'Bevor Sie sich entscheiden',
    disclaimer:
      'Diese Übersicht dient der Information und ersetzt keine ärztliche Beratung. Über die Eignung, den Umfang und die Dauer einer Kurbehandlung entscheidet immer ein Arzt. Bei einem selbst gezahlten Aufenthalt beraten Sie die Ärzte der Kurhotels bei der Eingangsuntersuchung.',
    sourceNote: 'Quelle: Indikationsverzeichnis Marienbad der Léčebné lázně Mariánské Lázně a.s., Ausgabe 2025.',
    ctaTitle: 'Sie sind unsicher, welcher Aufenthalt zu Ihnen passt?',
    ctaText:
      'Die Kurprogramme unterscheiden sich nach Diagnose und Aufenthaltsdauer. Die Übersicht der Ensana Hotels in Marienbad und ihrer Schwerpunkte hilft bei der Vorauswahl — die endgültige Empfehlung gibt Ihnen der Kurarzt.',
    ctaLabel: 'Hotels und Unterkunft ansehen',
  },

  en: {
    metaTitle: 'Indications and contraindications for spa treatment — Marienbad — Marienbad.com',
    metaDescription:
      'The conditions treated at the Marienbad spa and the general contraindications for spa treatment, from the spa’s own list of indications.',
    title: 'Indications and contraindications for spa treatment',
    intro:
      'The Marienbad cure is not a wellness break but a medically supervised course of treatment built on natural healing resources. The overview below sets out which conditions are treated here and the circumstances under which spa treatment cannot be given.',
    breadcrumb: 'Indications and contraindications',
    indicationsTitle: 'Conditions treated',
    groups: [
      {
        id: 'oncology',
        title: 'Oncological diseases',
        items: [{ text: 'Oncology cases after the finished complete care, without any signs of relapse' }],
      },
      {
        id: 'circulatory',
        title: 'Illnesses of the circulatory system',
        items: [
          { text: 'Symptomatic ischaemic heart disease' },
          { text: 'Condition after myocardial infarction' },
          { text: 'Hypertension of II. up to III. level' },
          { text: 'Disease of limb arteries based on atherosclerosis II b or inflammation' },
          { text: 'Dysfunction of peripheral blood vessels and conditions after thrombosis, at the earliest three months after the acute state subsides' },
          { text: 'Chronic lymphatic oedema' },
          { text: 'Conditions after reconstructive and bypass surgery of the circulatory system except the heart' },
          { text: 'Conditions after percutaneous transluminal angioplasty' },
        ],
      },
      {
        id: 'digestive',
        title: 'Digestive system illnesses',
        items: [
          { text: 'Chronic and recurring illnesses of the stomach and intestines with maldigestion symptoms persisting during standard pharmacotherapy' },
          { text: 'Conditions after heavy intestinal infections, parasitosis and mycotic diseases' },
          { text: 'Conditions after stomach, duodenum, oesophagus and intestine surgery with post-resection symptomatology proved by endoscopy' },
          { text: 'Crohn’s disease' },
          { text: 'Ulcerative colitis' },
          { text: 'Chronic diseases of the gall bladder and biliary tract with lithiasis, when surgery is contraindicated' },
          { text: 'Sclerosing cholangitis' },
          { text: 'Functional disorders of the biliary tract' },
          { text: 'Conditions after complicated surgery of the gall bladder and biliary tract, after operations for stenosis and lithiasis of the biliary tract (post-surgical pancreatitis and cholangitis, jaundice, instrumentation of the biliary tract, ERCP)' },
          { text: 'Conditions after dissolving stones and extracorporeal lithotripsy' },
          { text: 'Conditions after acute hepatitis of any aetiology' },
          { text: 'Chronic hepatitis with persisting positive markers' },
          { text: 'Associated auto-immune hepatitis' },
          { text: 'Primary biliary cirrhosis' },
          { text: 'Conditions after resection operations and liver or pancreas transplantation' },
          { text: 'Conditions after acute pancreatitis or after exacerbation of chronic pancreatitis' },
          { text: 'Proved chronic pancreatitis' },
        ],
      },
      {
        id: 'metabolic',
        title: 'Metabolic disorders',
        items: [{ text: 'Diabetes mellitus' }],
      },
      {
        id: 'respiratory',
        title: 'Non-tuberculous diseases of the respiratory system',
        items: [
          { text: 'Conditions after surgery of the upper and lower respiratory tract, not concerning conditions after surgery of tonsils, adenoid vegetations and the nasal septum' },
          { text: 'Conditions after lung transplantation' },
          { text: 'Damage of the larynx and vocal cords due to vocal overload' },
          { text: 'Conditions after phonosurgery treatment' },
          { text: 'Conditions after complicated pneumonia' },
          { text: 'Bronchiectasis' },
          { text: 'Recurring inflammations of the lower respiratory tract and chronic inflammations of the respiratory system as an occupational illness according to separate legal enactments' },
          { text: 'Asthma bronchiale' },
          { text: 'Chronic obstructive pulmonary disease' },
          { text: 'Interstitial lung fibrosis of any aetiology under systematic care' },
          { text: 'Consequences of toxic gases, smoke, corrosive vapours and irritant dusts to the upper and lower respiratory tract' },
        ],
      },
      {
        id: 'nervous',
        title: 'Nervous system diseases',
        items: [
          { text: 'Polyneuropathy with paretic symptoms' },
          { text: 'Root syndromes with irritation-destructive syndrome' },
          { text: 'Conditions after injuries and illnesses of the brain, spinal cord and peripheral nerves with movement disorders showing signs of regeneration' },
          { text: 'Neuro-muscular diseases — primary, secondary and degenerative' },
          { text: 'Syringomyelia with paretic symptoms' },
          { text: 'Parkinson’s disease' },
        ],
      },
      {
        id: 'musculoskeletal',
        title: 'Locomotive system disorders',
        items: [
          { text: 'Rheumatoid arthritis I. to IV. stage including juvenile arthritis, systematically treated within ambulant care' },
          { text: 'Ankylosing spondylitis (Bekhterev’s disease) systematically treated within ambulant care' },
          { text: 'Other seronegative spondarthritis systematically treated within ambulant care (psoriatic arthritis, Reiter’s syndrome)' },
          { text: 'Secondary arthritis systematically treated within ambulant care' },
          { text: 'Abarticular rheumatism, systematically treated within ambulant care' },
          { text: 'Diffuse disease of connective tissue treated within ambulant care (systemic lupus erythematosus, scleroderma, polymyositis, dermatomyositis, Sjögren’s syndrome and other overlap syndromes)' },
          { text: 'Osteoporosis with complications, when systematic ambulant rehabilitation longer than 3 months is ineffective' },
          { text: 'Bone changes which are the consequence of working in pressurised air as an occupational illness according to separate legal enactments' },
          { text: 'Painful syndromes of tendons, tendinous sheaths, bursae, muscle sinews, skeletal muscles or joints (including illnesses caused by vibrations and long-term, excessive, one-sided overloading as an occupational illness according to separate legal enactments)' },
          { text: 'Coxarthrosis, gonarthrosis in systematic ambulant care of an orthopaedist and rehabilitation doctor' },
          { text: 'Arthrosis in other locations, arthropathy' },
          { text: 'Chronic vertebrogenic algic syndrome of functional origin in systematic ambulant rehabilitation care' },
          { text: 'Conditions after orthopaedic surgery with the use of joint replacement' },
          { text: 'Conditions after injuries to the locomotive system and after orthopaedic surgery, including conditions after intervertebral disc surgery and stenosis of the spinal channel, when systematic ambulant or in-patient rehabilitation care is ineffective' },
          { text: 'Conditions after amputation of a lower limb, degree of activity 1 to 4, where the patient has a prosthetic limb' },
        ],
      },
      {
        id: 'urinary',
        title: 'Kidney and urinary tract diseases',
        items: [
          { text: 'Recurring and chronic non-tubercular inflammations of the kidney and urinary tract resistant to antibiotic and other pharmacological treatment, in systematic care of a urologist for at least 12 months' },
          { text: 'Cystic kidney disease' },
          { text: 'Nephrolithiasis without congestion in the urinary tract' },
          { text: 'Nephrocalcinosis' },
          { text: 'Conditions after kidney and urinary tract surgery including endovesical surgery and conditions after complicated prostatectomy and nephrolithotripsy, after-treatment following extracorporeal shock wave lithotripsy' },
          { text: 'Chronic prostatitis or chronic prostatovesiculitis resistant to pharmacological and antibiotic treatment, in systematic care of a urologist for at least 12 months' },
          { text: 'Conditions after kidney transplantation with stabilised function of the graft' },
          { text: 'Donor of the graft (kidney)' },
        ],
      },
      {
        id: 'skin',
        title: 'Skin diseases',
        items: [{ text: 'Atopic eczema' }, { text: 'Generalised and arthropathic psoriasis vulgaris' }],
      },
    ],
    contraindicationsTitle: 'General contraindications for spa treatment',
    contraindicationsIntro:
      'Even with an indicated diagnosis, spa treatment cannot be given if any of the following applies. A doctor always makes the final assessment.',
    contraindications: [
      'Infectious diseases transmitted from one person to another and the carrying of bacillus, especially typhoid and paratyphoid. When a disease indicated for spa treatment is associated with tuberculosis of the respiratory system or another form of tuberculosis, spa treatment may be allowed only after the anti-tuberculosis treatment has been completed.',
      'All diseases in the acute stage.',
      'Clinical signs of circulatory failure, malignant arrhythmias.',
      'Conditions after deep thrombosis within 3 months of remission of the disease; superficial thrombophlebitis within 6 weeks of remission.',
      'Labile diabetes mellitus (except children and adolescents) and decompensated diabetes mellitus.',
      'Recurrent or profuse bleeding of all kinds.',
      'Cachexia of any kind.',
      'Malignant tumours during and after treatment with clinically detectable signs of continued illness.',
      'Epilepsy, except in cases where there have been no attacks in the last 3 years and the EEG does not record epileptic graphoelements. If pathological changes in the EEG recording persist, spa treatment can be offered only with the consent of the neurologist providing the patient’s care.',
      'Active attacks or phases of psychosis and mental disorders with antisocial symptoms or reduced communication capability, or transient states of confusion.',
      'Alcohol dependence or dependence on addictive substances.',
      'Patients dependent on the help of another person for self-care (except for the blind). Admission (usually with a companion) is possible only after prior arrangement with the head physician of the spa.',
      'Incontinence of urine and stool, enuresis nocturna.',
      'Smoking by adolescents and patients.',
      'Pregnancy.',
      'Non-healing skin defects of any origin.',
      'Hypertension above 16 kPa of diastolic pressure (120 mm Hg).',
    ],
    disclaimerTitle: 'Before you decide',
    disclaimer:
      'This overview is for information only and does not replace medical advice. A doctor always decides whether spa treatment is suitable, and in what form and length. If you are paying for the stay yourself, the spa hotel doctors will advise you at the initial examination.',
    sourceNote: 'Source: list of indications for Mariánské Lázně, Léčebné lázně Mariánské Lázně a.s., 2025 edition.',
    ctaTitle: 'Not sure which stay suits you?',
    ctaText:
      'Treatment programmes differ by diagnosis and by length of stay. The overview of the Ensana hotels in Marienbad and what each focuses on will narrow the choice — the final recommendation comes from the spa doctor.',
    ctaLabel: 'See hotels and accommodation',
  },

  ru: {
    metaTitle: 'Показания и противопоказания к курортному лечению — Марианске-Лазне — Marienbad.com',
    metaDescription:
      'Перечень заболеваний, которые лечат в Марианске-Лазне, и общие противопоказания к курортному лечению — по справочнику курорта.',
    title: 'Показания и противопоказания к курортному лечению',
    intro:
      'Марианское курортное лечение — не wellness-отдых, а курс терапии под наблюдением врача, основанный на природных лечебных ресурсах. Ниже приведён перечень заболеваний, которые здесь лечат, и обстоятельства, при которых курортное лечение невозможно.',
    breadcrumb: 'Показания и противопоказания',
    indicationsTitle: 'Какие заболевания лечат',
    groups: [
      {
        id: 'oncology',
        title: 'После-онкологические заболевания',
        items: [{ text: 'Состояния после перенесённых онкологических заболеваний в ремиссии' }],
      },
      {
        id: 'circulatory',
        title: 'Сердечно-сосудистые заболевания',
        items: [
          { text: 'Симптоматическая ишемическая болезнь сердца (ИБС)' },
          { text: 'Состояние после инфаркта миокарда' },
          { text: 'Гипертоническая болезнь сердца 2-й и 3-й степени' },
          { text: 'Атеросклеротические заболевания сосудов конечностей 2 Б на воспалительной основе' },
          { text: 'Функциональные нарушения периферических сосудов, состояния после тромбозов' },
          { text: 'Хроническая лимфатическая недостаточность' },
          { text: 'Состояния после реконструкции и реваскуляризации сосудов помимо сердца и грудной аорты' },
          { text: 'Состояния после чрескожной транслюминальной ангиопластики' },
        ],
      },
      {
        id: 'digestive',
        title: 'Желудочно-кишечные заболевания',
        items: [
          { text: 'Хронические и рецидивирующие заболевания желудочно-кишечного тракта' },
          { text: 'Состояния после тяжёлых кишечных инфекций, грибковых и паразитарных заболеваний' },
          { text: 'Состояния после операций на желудочно-кишечном тракте, после эндоскопического контроля' },
          { text: 'Болезнь Крона' },
          { text: 'Язвенный колит' },
          { text: 'Хронические заболевания жёлчного пузыря и желчнокаменная болезнь (в случае противопоказанной операции)' },
          { text: 'Склерозирующий холангит' },
          { text: 'Функциональные нарушения жёлчного пузыря и желчевыводящих путей' },
          { text: 'Состояния после сложных операций на жёлчном пузыре и при стенозе и желчнокаменной болезни (послеоперационный панкреатит, холангит, иктерус и т. д.)' },
          { text: 'Состояния после диссолюции камней и экстракорпоральной литотрипсии' },
          { text: 'Состояния после острого гепатита любой этиологии и токсическом повреждении печени (лекарственном и в качестве профессионального заболевания)' },
          { text: 'Хронический гепатит со стойкими позитивными маркерами' },
          { text: 'Ассоциированный аутоиммунный гепатит' },
          { text: 'Первичный билиарный цирроз' },
          { text: 'Состояния после резекций и пересадки печени или поджелудочной железы' },
          { text: 'Состояния после острого панкреатита или обострения хронического панкреатита' },
          { text: 'Хронический панкреатит' },
        ],
      },
      {
        id: 'metabolic',
        title: 'Заболевания обмена веществ и желёз внутренней секреции',
        items: [{ text: 'Сахарный диабет и последующие осложнения' }],
      },
      {
        id: 'respiratory',
        title: 'Заболевания дыхательных путей (кроме туберкулёза)',
        items: [
          { text: 'Состояния после операций верхних и нижних дыхательных путей; не касается состояний после тонзиллэктомии, аденоидэктомии и операций носовой перегородки' },
          { text: 'Состояние после операции пересадки лёгких' },
          { text: 'Повреждения гортани и голосовых связок вследствие голосовой нагрузки' },
          { text: 'Состояния после фонохирургического лечения' },
          { text: 'Состояния после осложнённого воспаления лёгких' },
          { text: 'Бронхоэктазы' },
          { text: 'Рецидивирующие воспаления нижних дыхательных путей и хронические профессиональные заболевания' },
          { text: 'Бронхиальная астма' },
          { text: 'Хронический обструктивный бронхит' },
          { text: 'Интерстициальные лёгочные фиброзы различной этиологии в постоянном лечении' },
          { text: 'Последствия токсического влияния газов, дыма, едких паров и раздражающей пыли на лёгкие и бронхи' },
        ],
      },
      {
        id: 'nervous',
        title: 'Заболевания нервной системы',
        items: [
          { text: 'Полинейропатия с паретическими проявлениями' },
          { text: 'Корешковые синдромы' },
          { text: 'Состояния после травм и операций на головном, спинном мозге и на периферической нервной системе с двигательными нарушениями и признаками восстановления функций' },
          { text: 'Первичные, вторичные и дегенеративные нервно-мышечные заболевания' },
          { text: 'Сирингомиелия с паретическими проявлениями' },
          { text: 'Болезнь Паркинсона' },
        ],
      },
      {
        id: 'musculoskeletal',
        title: 'Заболевания опорно-двигательного аппарата',
        items: [
          { text: 'Ревматоидный артрит 1–4 стадии, включая ювенильный артрит, в постоянном лечении' },
          { text: 'Анкилозирующий спондилит (болезнь Бехтерева)' },
          { text: 'Остальные серонегативные спондилоартриты' },
          { text: 'Вторичные артриты' },
          { text: 'Внесуставной ревматизм' },
          { text: 'Диффузные заболевания соединительной ткани' },
          { text: 'Остеопороз с осложнениями' },
          { text: 'Заболевания, связанные с вредным производством, и изменения костной ткани' },
          { text: 'Заболевания связок, бурситы, тендовагиниты, включая профессиональные заболевания' },
          { text: 'Гонартроз, коксартроз' },
          { text: 'Артропатии и остальные артрозы' },
          { text: 'Хронический вертеброгенный синдром — остеохондроз' },
          { text: 'Состояния после ортопедических операций и протезирования суставов' },
          { text: 'Состояния после травм и ортопедических операций, включая операции на позвоночнике' },
          { text: 'Состояния после ампутаций нижних конечностей, степень активности 1–4, когда пациент имеет протез' },
        ],
      },
      {
        id: 'urinary',
        title: 'Заболевания мочевыделительной системы',
        items: [
          { text: 'Рецидивирующие и хронические нетуберкулёзные воспаления почек и мочевыводящих путей, резистентные к антибиотикам и другому фармакологическому лечению' },
          { text: 'Кистозные заболевания почек' },
          { text: 'Мочекаменная болезнь без признаков задержки мочи' },
          { text: 'Нефрокальциноз' },
          { text: 'Состояния после операций на почках и мочевыводящих путях, включая простатэктомию и нефролитотрипсию' },
          { text: 'Хронический простатит и хронический простатовезикулит, резистентный к лечению антибиотиками' },
          { text: 'Состояния после пересадки почек в стабильном состоянии' },
          { text: 'Доноры почек' },
        ],
      },
      {
        id: 'skin',
        title: 'Кожные заболевания',
        items: [{ text: 'Атопическая экзема' }, { text: 'Генерализованный и артропатический псориаз вульгарис' }],
      },
    ],
    contraindicationsTitle: 'Общие противопоказания к курортному лечению',
    contraindicationsIntro:
      'Даже при показанном диагнозе курортное лечение невозможно, если присутствует одно из следующих обстоятельств. Окончательное решение всегда принимает врач.',
    contraindications: [
      'Инфекционные заболевания, передаваемые от человека к человеку, и бациллоносительство. При заболеваниях, связанных с туберкулёзом дыхательных путей или иной формой туберкулёза, курортное лечение разрешено только после окончания полного курса лечения противотуберкулёзными препаратами и с разрешения пульмонолога.',
      'Все заболевания в острой стадии.',
      'Клинические признаки нарушения системы кровообращения (за исключением 2-й группы) и опасные для жизни виды аритмии сердца.',
      'Состояние после глубокого венозного тромбоза (менее 3 месяцев после излечения заболевания), состояние после поверхностного тромбофлебита (менее 6 недель после излечения заболевания).',
      'Повторяющееся профузное кровотечение всех типов в течение 12 месяцев. Лечение разрешено только с разрешения гематолога.',
      'Кахексия всех типов (Body Mass Index ниже 16,5).',
      'Злокачественные опухоли во время и после лечения с клиническими признаками дальнейшего продолжения болезни. Длительная гормональная противоопухолевая терапия противопоказанием не является.',
      'Эпилепсия, за исключением случаев без приступов в течение последних 3 лет и с результатами ЭЭГ без эпилептических графоэлементов. При сохранении в ЭЭГ патологических изменений курортное лечение может быть предложено только на основании согласия невролога, наблюдающего пациента.',
      'Активные приступы или фазы психоза и душевных заболеваний, сопровождающиеся асоциальными проявлениями, сниженной возможностью коммуникации или невозможностью следовать процедуре лечения, транзиторные состояния растерянности и деменция.',
      'Хронический алкоголизм и наркомания.',
      'Зависимость от никотина при лечении заболеваний групп II, III/1, III/2, IV и V.',
      'Недержание мочи 2-й и 3-й степени и анальное недержание, enuresis nocturna.',
      'Беременность.',
    ],
    disclaimerTitle: 'Прежде чем решить',
    disclaimer:
      'Этот обзор носит информационный характер и не заменяет консультацию врача. О целесообразности курортного лечения, его объёме и длительности всегда решает врач. Если вы оплачиваете пребывание самостоятельно, вас проконсультируют врачи курортных отелей при первичном осмотре.',
    sourceNote: 'Источник: справочник заболеваний, которые лечат в Марианских Лазнях, Léčebné lázně Mariánské Lázně a.s., издание 2025 года.',
    ctaTitle: 'Не знаете, какое пребывание вам подходит?',
    ctaText:
      'Лечебные программы различаются по диагнозу и длительности пребывания. Обзор отелей Ensana в Марианске-Лазне и их специализации поможет сузить выбор — окончательную рекомендацию даст курортный врач.',
    ctaLabel: 'Отели и проживание',
  },
}

export function getIndications(locale: Locale): IndicationsContent {
  return indications[locale]
}
