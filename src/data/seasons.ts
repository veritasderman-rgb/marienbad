import type { Locale } from '@/i18n/config'

/**
 * Seasonal landing pages ("Christmas & New Year in Marienbad", ...): content
 * for the prerendered /{locale}/{slug} season routes. Targets recurring
 * seasonal search demand (Weihnachten/Silvester, Fruehling, Sommer, Herbst).
 * articleRefs index into tripArticleGroups (src/data/tripArticles.ts).
 */

export interface SeasonSection {
  heading: Record<Locale, string>
  body: Record<Locale, string>
}

export interface Season {
  id: string
  slugs: Record<Locale, string>
  title: Record<Locale, string>
  metaDescription: Record<Locale, string>
  intro: Record<Locale, string[]>
  sections: SeasonSection[]
  tips: Record<Locale, string[]>
  /** Indexes into tripArticleGroups for the "further reading" block */
  articleRefs: number[]
}

export const seasons: Season[] = [
  {
    id: 'christmas',
    slugs: {
      de: "weihnachten-und-silvester",
      en: "christmas-and-new-year",
      cs: "vanoce-a-silvestr",
      ru: "rozhdestvo-i-novyj-god",
    },
    title: {
      de: "Weihnachten & Silvester in Marienbad",
      en: "Christmas & New Year in Marienbad",
      cs: "Vánoce a Silvestr v Mariánských Lázních",
      ru: "Рождество и Новый год в Марианских Лазнях",
    },
    metaDescription: {
      de: "Advent, Weihnachten und Silvester in Marienbad: beleuchtete Kolonnade, festliche Kurhotels, Galaabende und Winterausflüge. Tipps und Planung.",
      en: "Advent, Christmas and New Year's Eve in Marienbad: the illuminated colonnade, festive spa hotels, gala evenings and winter day trips. Tips and planning.",
      cs: "Advent, Vánoce a Silvestr v Mariánských Lázních: rozsvícená kolonáda, sváteční lázeňské hotely, galavečery a zimní výlety. Tipy a plánování.",
      ru: "Адвент, Рождество и Новый год в Марианских Лазнях: подсвеченная колоннада, праздничные отели, гала-вечера и зимние экскурсии. Советы и планирование.",
    },
    intro: {
      de: [
        "Wenn sich der erste Schnee auf die Jugendstilfassaden legt und die Kolonnade im Lichterglanz erstrahlt, zeigt Marienbad sein vielleicht schönstes Gesicht. Der Kurort wird still, festlich und intim — ein Gegenentwurf zum vorweihnachtlichen Trubel zu Hause.",
        "Die Feiertage in Marienbad verbinden, was sonst schwer zusammengeht: besinnliche Adventsatmosphäre, festliche Galaabende — und dazwischen Zeit für Bäder, Massagen und Spaziergänge durch verschneite Kurwälder.",
      ],
      en: [
        "When the first snow settles on the Art Nouveau façades and the colonnade glows with lights, Marienbad shows perhaps its loveliest face. The spa town turns quiet, festive and intimate — the very opposite of the pre-Christmas rush at home.",
        "The holidays in Marienbad combine what rarely goes together: a contemplative Advent mood, festive gala evenings — and in between, time for baths, massages and walks through snowy spa forests.",
      ],
      cs: [
        "Když na secesní fasády padne první sníh a kolonáda se rozzáří světly, ukazují Mariánské Lázně snad svou nejkrásnější tvář. Město ztichne, zeslavnostní a zútulní — pravý opak předvánočního shonu doma.",
        "Svátky v Mariánských Lázních spojují, co jinak jde dohromady jen těžko: rozjímavý advent, slavnostní galavečery — a mezi tím čas na koupele, masáže a procházky zasněženými lázeňskými lesy.",
      ],
      ru: [
        "Когда первый снег ложится на фасады в стиле модерн, а колоннада загорается огнями, Марианские Лазни показывают, пожалуй, самое красивое своё лицо. Курорт становится тихим, праздничным и уютным — полная противоположность предновогодней суете дома.",
        "Праздники в Марианских Лазнях соединяют то, что редко сочетается: созерцательный адвент, торжественные гала-вечера — а между ними время для ванн, массажей и прогулок по заснеженным курортным лесам.",
      ],
    },
    sections: [
      {
        heading: {
          de: "Adventszauber an der Kolonnade",
          en: "Advent magic by the colonnade",
          cs: "Adventní kouzlo u kolonády",
          ru: "Волшебство адвента у колоннады",
        },
        body: {
          de: "Im Advent gehören die Promenade und der Platz vor der Kolonnade den Lichtern, dem Duft von Glühwein und den Klängen der Weihnachtskonzerte. Die Kurparks tragen Raureif statt Blumenbeete, und die berühmte gusseiserne Kolonnade wirkt im Winterlicht noch feierlicher als sonst. Wer mag, verbindet den Bummel mit einem Becher warmer Quellwasser-Trinkkur — die Pavillons sind auch im Winter zugänglich.",
          en: "In Advent the promenade and the square before the colonnade belong to the lights, the scent of mulled wine and the sound of Christmas concerts. The spa parks wear hoarfrost instead of flowerbeds, and the famous cast-iron colonnade looks even more ceremonial in winter light. If you like, combine your stroll with a warm cup from the drinking cure — the pavilions stay open in winter too.",
          cs: "V adventu patří promenáda a prostranství před kolonádou světlům, vůni svařeného vína a tónům vánočních koncertů. Lázeňské parky nosí místo záhonů jinovatku a slavná litinová kolonáda působí v zimním světle ještě slavnostněji než jindy. Procházku lze spojit s pohárkem teplé pitné kúry — pavilony pramenů jsou přístupné i v zimě.",
          ru: "В адвент променад и площадь перед колоннадой принадлежат огням, аромату глинтвейна и звукам рождественских концертов. Курортные парки носят иней вместо клумб, а знаменитая чугунная колоннада в зимнем свете выглядит ещё торжественнее. Прогулку можно совместить с тёплым стаканчиком питьевого курса — павильоны источников открыты и зимой.",
        },
      },
      {
        heading: {
          de: "Festtage im Kurhotel",
          en: "The holidays at a spa hotel",
          cs: "Svátky v lázeňském hotelu",
          ru: "Праздники в курортном отеле",
        },
        body: {
          de: "Die Kurhotels verwandeln die Feiertage in ein Gesamterlebnis: festlich geschmückte Säle, Weihnachtsmenüs, Silvester-Galaabende mit Musik und Tanz — und tagsüber das volle Kur- und Wellnessprogramm. Gerade zwischen den Jahren ist eine kurze Kur ideal: Die Anwendungen laufen weiter, während draußen der Winter die Kulisse liefert. Silvesteraufenthalte gehören zu den gefragtesten Terminen des Jahres.",
          en: "The spa hotels turn the holidays into a complete experience: festively decorated halls, Christmas menus, New Year's Eve galas with music and dancing — and the full spa and wellness programme by day. The days between the years are ideal for a short cure: treatments continue while winter provides the scenery outside. New Year's stays rank among the most sought-after dates of the year.",
          cs: "Lázeňské hotely proměňují svátky v ucelený zážitek: slavnostně vyzdobené sály, vánoční menu, silvestrovské galavečery s hudbou a tancem — a přes den plný lázeňský a wellness program. Právě období mezi svátky je ideální pro krátkou kúru: procedury běží dál a zima venku dodává kulisu. Silvestrovské pobyty patří k nejžádanějším termínům roku.",
          ru: "Курортные отели превращают праздники в цельное переживание: торжественно украшенные залы, рождественские меню, новогодние гала-вечера с музыкой и танцами — а днём полная лечебная и велнес-программа. Дни между праздниками идеальны для короткого курса: процедуры продолжаются, а зима за окном создаёт декорации. Новогодние заезды — одни из самых востребованных дат года.",
        },
      },
      {
        heading: {
          de: "Winterausflüge",
          en: "Winter day trips",
          cs: "Zimní výlety",
          ru: "Зимние экскурсии",
        },
        body: {
          de: "Auch im Winter lohnt der Blick über den Stadtrand: die Weihnachtsmärkte in Karlsbad und Eger, das Bierbad in Chodová Planá, die Thermen des Sibyllenbads hinter der Grenze oder der bereifte Moorsteg von Kladská. In unserem Ausflugskatalog filtern Sie mit einem Klick nach Zielen, die „auch im Winter“ funktionieren.",
          en: "Winter is no reason to stay inside town: the Christmas markets of Karlovy Vary and Cheb, the beer spa in Chodová Planá, the Sibyllenbad thermal baths across the border, or the frosted boardwalk of Kladská. In our day-trips catalogue, one click filters the destinations that work “in winter” too.",
          cs: "Ani v zimě se nevyplatí zůstat jen ve městě: vánoční trhy v Karlových Varech a Chebu, pivní lázně v Chodové Plané, termály Sibyllenbad za hranicí nebo ojíněný povalový chodník na Kladské. V našem katalogu výletů si jedním klikem vyfiltrujete cíle, které fungují „i v zimě“.",
          ru: "И зимой стоит выбраться за пределы города: рождественские ярмарки в Карловых Варах и Хебе, пивные бани в Ходовой Плане, термы Зибилленбад за границей или заиндевевший настил Кладской. В нашем каталоге экскурсий одним кликом фильтруются цели, работающие «и зимой».",
        },
      },
    ],
    tips: {
      de: [
        "Silvester früh buchen — die Gala-Termine sind meist Monate im Voraus vergeben.",
        "Feste Schuhe mit gutem Profil mitnehmen: Die Promenaden werden geräumt, die Waldwege tragen Schnee.",
        "Öffnungszeiten von Burgen und Museen zwischen den Jahren vorab prüfen — viele Ziele fahren Winterprogramm.",
      ],
      en: [
        "Book New Year's Eve early — gala dates are usually taken months ahead.",
        "Bring sturdy shoes with good tread: promenades are cleared, but forest paths carry snow.",
        "Check castle and museum opening hours between the holidays — many destinations run a winter schedule.",
      ],
      cs: [
        "Silvestra rezervujte s předstihem — galavečery bývají obsazené měsíce dopředu.",
        "Přibalte pevné boty s dobrou podrážkou: promenády se uklízejí, lesní cesty ale nesou sníh.",
        "Otevírací doby hradů a muzeí mezi svátky si ověřte předem — řada cílů jede zimní režim.",
      ],
      ru: [
        "Бронируйте Новый год заранее — гала-вечера обычно разобраны за месяцы.",
        "Возьмите крепкую обувь с хорошей подошвой: променады чистят, но лесные дороги под снегом.",
        "Проверьте часы работы замков и музеев между праздниками — многие цели работают по зимнему графику.",
      ],
    },
    articleRefs: [3, 0],
  },
  {
    id: 'spring',
    slugs: {
      de: "fruehling",
      en: "spring",
      cs: "jaro",
      ru: "vesna",
    },
    title: {
      de: "Frühling in Marienbad",
      en: "Spring in Marienbad",
      cs: "Jaro v Mariánských Lázních",
      ru: "Весна в Марианских Лазнях",
    },
    metaDescription: {
      de: "Frühling in Marienbad: Saisoneröffnung im Mai, Singende Fontäne, blühende Kurparks und die ideale Zeit für eine Frühjahrskur. Tipps und Planung.",
      en: "Spring in Marienbad: the May season opening, the Singing Fountain, blossoming spa parks and the ideal time for a spring cure. Tips and planning.",
      cs: "Jaro v Mariánských Lázních: květnové zahájení sezóny, Zpívající fontána, rozkvetlé parky a ideální čas na jarní kúru. Tipy a plánování.",
      ru: "Весна в Марианских Лазнях: майское открытие сезона, Поющий фонтан, цветущие парки и идеальное время для весеннего курса. Советы и планирование.",
    },
    intro: {
      de: [
        "Kein Monat verwandelt Marienbad so sehr wie der Mai: Die Parks explodieren in Grün, Rhododendren und Azaleen blühen, die Singende Fontäne nimmt ihr Spiel wieder auf — und die feierliche Saisoneröffnung mit der Weihe der Quellen läutet das Kurjahr ein.",
        "Der Frühling ist zugleich die klügste Zeit für eine Kur: mildes Wetter für Terrainspaziergänge, wache Natur — und deutlich mehr Ruhe als im Hochsommer.",
      ],
      en: [
        "No month transforms Marienbad like May: the parks explode into green, rhododendrons and azaleas bloom, the Singing Fountain resumes its performances — and the ceremonial season opening with the blessing of the springs rings in the spa year.",
        "Spring is also the smartest time for a cure: mild weather for terrain walks, nature wide awake — and far more calm than in high summer.",
      ],
      cs: [
        "Žádný měsíc neproměňuje Mariánské Lázně tolik jako květen: parky vybuchnou do zelena, kvetou rododendrony a azalky, Zpívající fontána znovu spouští svá představení — a slavnostní zahájení sezóny se svěcením pramenů otevírá lázeňský rok.",
        "Jaro je zároveň nejchytřejší čas na kúru: mírné počasí pro terénní procházky, probuzená příroda — a výrazně větší klid než ve vrcholném létě.",
      ],
      ru: [
        "Ни один месяц не преображает Марианские Лазни так, как май: парки взрываются зеленью, цветут рододендроны и азалии, Поющий фонтан возобновляет свои представления — а торжественное открытие сезона с освящением источников открывает курортный год.",
        "Весна — к тому же самое разумное время для курса: мягкая погода для терренкура, проснувшаяся природа — и куда больше покоя, чем в разгар лета.",
      ],
    },
    sections: [
      {
        heading: {
          de: "Saisoneröffnung und Singende Fontäne",
          en: "Season opening and the Singing Fountain",
          cs: "Zahájení sezóny a Zpívající fontána",
          ru: "Открытие сезона и Поющий фонтан",
        },
        body: {
          de: "Das Eröffnungswochenende im Mai gehört zu den schönsten Terminen des Jahres: Die Quellen werden gesegnet, auf der Promenade spielt Musik, die Stadt feiert. Von Mai bis Oktober zeigt dann die Singende Fontäne mehrmals täglich ihr Wasserspiel zu klassischer Musik — abends mit Beleuchtung besonders eindrucksvoll.",
          en: "The opening weekend in May is one of the loveliest dates of the year: the springs are blessed, music plays on the promenade, the town celebrates. From May to October the Singing Fountain then performs its water show to classical music several times a day — especially striking in the evening illumination.",
          cs: "Zahajovací víkend v květnu patří k nejhezčím termínům roku: světí se prameny, na promenádě hraje hudba, město slaví. Od května do října pak Zpívající fontána několikrát denně předvádí vodní představení za doprovodu klasické hudby — večer s osvětlením je zážitek největší.",
          ru: "Майские выходные открытия сезона — одни из красивейших дат года: освящаются источники, на променаде играет музыка, город празднует. С мая по октябрь Поющий фонтан несколько раз в день показывает водное представление под классическую музыку — вечером, с подсветкой, оно особенно впечатляет.",
        },
      },
      {
        heading: {
          de: "Die Frühjahrskur",
          en: "The spring cure",
          cs: "Jarní kúra",
          ru: "Весенний курс",
        },
        body: {
          de: "Nach dem Winter sehnt sich der Körper nach Bewegung und Regeneration — genau dafür ist die Frühjahrskur gemacht: Trinkkur an den Quellen, Mineralbäder, CO₂-Anwendungen und Terrainwege durch erwachende Wälder. Das submontane Reizklima in 630 Metern Höhe wirkt im Frühling besonders belebend.",
          en: "After winter the body craves movement and regeneration — exactly what the spring cure is made for: the drinking cure at the springs, mineral baths, CO₂ treatments and terrain paths through awakening forests. The submontane climate at 630 metres is especially invigorating in spring.",
          cs: "Po zimě se tělo dožaduje pohybu a regenerace — a přesně k tomu je jarní kúra: pitná kúra u pramenů, minerální koupele, CO₂ procedury a terénní stezky probouzejícím se lesem. Podhorské klima v 630 metrech působí na jaře obzvlášť povzbudivě.",
          ru: "После зимы тело просит движения и восстановления — именно для этого весенний курс: питьевой курс у источников, минеральные ванны, CO₂-процедуры и терренкуры по просыпающемуся лесу. Предгорный климат на высоте 630 метров весной особенно бодрит.",
        },
      },
      {
        heading: {
          de: "Ausflüge: Die Burgen öffnen",
          en: "Day trips: the castles open",
          cs: "Výlety: hrady otevírají",
          ru: "Экскурсии: замки открываются",
        },
        body: {
          de: "Mit dem Frühjahr beginnt die Besichtigungssaison: Königswart, Petschau und Loket öffnen ihre Tore, auf Kladská spiegelt sich frisches Grün, und die Aussichtstürme belohnen mit klarer Fernsicht. Unser Ausflugskatalog mit 48 Zielen hilft bei der Auswahl — vom Spaziergang bis zur Tagestour.",
          en: "Spring opens the sightseeing season: Kynžvart, Bečov and Loket unlock their gates, fresh green mirrors in the Kladská pond, and the lookout towers reward you with crystal visibility. Our catalogue of 48 destinations helps you choose — from a stroll to a full-day tour.",
          cs: "S jarem začíná návštěvnická sezóna: Kynžvart, Bečov i Loket otevírají brány, na Kladské se zrcadlí čerstvá zeleň a rozhledny odměňují průzračnými výhledy. S výběrem pomůže náš katalog 48 výletních cílů — od procházky po celodenní túru.",
          ru: "С весной начинается экскурсионный сезон: Кинжварт, Бечов и Локет открывают ворота, в Кладском пруду отражается свежая зелень, а смотровые башни награждают прозрачными далями. Выбрать поможет наш каталог 48 направлений — от прогулки до поездки на весь день.",
        },
      },
    ],
    tips: {
      de: [
        "Zur Saisoneröffnung im Mai früh buchen — das Festwochenende ist gut besucht.",
        "Zwiebellook einpacken: Frühlingstage im Kurwald können frisch beginnen und warm enden.",
        "Die Fontäne spielt von Mai bis Oktober — Spielzeiten vor Ort oder im Hotel erfragen.",
      ],
      en: [
        "Book early for the May season opening — the festival weekend fills up.",
        "Pack layers: spring days in the spa forest can start crisp and end warm.",
        "The Fountain plays from May to October — ask for showtimes locally or at your hotel.",
      ],
      cs: [
        "Na květnové zahájení sezóny rezervujte včas — slavnostní víkend bývá plný.",
        "Přibalte vrstvy: jarní dny v lázeňských lesích začínají svěže a končí teple.",
        "Fontána hraje od května do října — časy představení zjistíte na místě nebo v hotelu.",
      ],
      ru: [
        "На майское открытие сезона бронируйте заранее — праздничные выходные заполняются.",
        "Одевайтесь слоями: весенний день в курортном лесу начинается свежо, а заканчивается тепло.",
        "Фонтан играет с мая по октябрь — время представлений узнайте на месте или в отеле.",
      ],
    },
    articleRefs: [1, 0],
  },
  {
    id: 'summer',
    slugs: {
      de: "sommer",
      en: "summer",
      cs: "leto",
      ru: "leto",
    },
    title: {
      de: "Sommer in Marienbad",
      en: "Summer in Marienbad",
      cs: "Léto v Mariánských Lázních",
      ru: "Лето в Марианских Лазнях",
    },
    metaDescription: {
      de: "Sommer in Marienbad: Kolonnadenkonzerte, Chopin-Festival, Golf, Ausflüge für die ganze Familie und Abende auf der Promenade. Tipps und Planung.",
      en: "Summer in Marienbad: colonnade concerts, the Chopin Festival, golf, family day trips and evenings on the promenade. Tips and planning.",
      cs: "Léto v Mariánských Lázních: kolonádní koncerty, Chopinův festival, golf, rodinné výlety a večery na promenádě. Tipy a plánování.",
      ru: "Лето в Марианских Лазнях: концерты у колоннады, фестиваль Шопена, гольф, семейные экскурсии и вечера на променаде. Советы и планирование.",
    },
    intro: {
      de: [
        "Im Sommer lebt Marienbad auf der Promenade: Morgens klingen Becher an den Quellen, tagsüber spielen Orchester an der Kolonnade, abends flanieren die Gäste im goldenen Licht der Jugendstilhotels. Es ist die Jahreszeit, in der der Kurort seiner Belle-Époque-Seele am nächsten kommt.",
        "Zugleich ist der Sommer die beste Zeit für alles, was draußen stattfindet: Golf auf dem königlichen Platz, Wanderungen durch den Kaiserwald — und 48 Ausflugsziele in Reichweite.",
      ],
      en: [
        "In summer Marienbad lives on the promenade: cups clink at the springs in the morning, orchestras play by the colonnade at noon, and in the evening guests stroll in the golden light of the Art Nouveau hotels. It is the season when the town comes closest to its Belle Époque soul.",
        "Summer is also the best time for everything outdoors: golf on the royal course, hikes through the Slavkov Forest — and 48 day-trip destinations within reach.",
      ],
      cs: [
        "V létě žijí Mariánské Lázně na promenádě: ráno cinkají pohárky u pramenů, přes den hrají orchestry u kolonády, večer se hosté procházejí ve zlatém světle secesních hotelů. Je to období, kdy má město ke své duši belle époque nejblíž.",
        "Léto je zároveň nejlepší čas na všechno venku: golf na královském hřišti, túry Slavkovským lesem — a 48 výletních cílů na dosah.",
      ],
      ru: [
        "Летом Марианские Лазни живут на променаде: утром звенят бокальчики у источников, днём у колоннады играют оркестры, вечером гости прогуливаются в золотом свете отелей модерна. Это время, когда город ближе всего к своей душе belle époque.",
        "Лето — лучшее время и для всего, что происходит на воздухе: гольф на королевском поле, походы по Славковскому лесу — и 48 направлений для экскурсий под рукой.",
      ],
    },
    sections: [
      {
        heading: {
          de: "Ein Kultursommer wie zu Kaiserzeiten",
          en: "A cultural summer as in imperial times",
          cs: "Kulturní léto jako za císaře",
          ru: "Культурное лето как при императоре",
        },
        body: {
          de: "Der Sommer ist Festivalzeit: Im August ehrt das Chopin-Festival den berühmtesten musikalischen Kurgast der Stadt, an der Kolonnade spielen Kurorchester, und in Loket verwandelt sich das Amphitheater unter der Burg in eine Open-Air-Bühne. Wer Filmglanz sucht, fährt im Juli zum Festival nach Karlsbad.",
          en: "Summer is festival season: in August the Chopin Festival honours the town's most famous musical guest, spa orchestras play by the colonnade, and in Loket the amphitheatre beneath the castle becomes an open-air stage. For film-festival glamour, drive to Karlovy Vary in July.",
          cs: "Léto je časem festivalů: v srpnu Chopinův festival vzdává hold nejslavnějšímu hudebnímu hostu města, u kolonády hrají lázeňské orchestry a v Lokti se amfiteátr pod hradem mění v open-air scénu. Za filmovým leskem se v červenci jezdí do Karlových Varů.",
          ru: "Лето — время фестивалей: в августе фестиваль Шопена чествует самого знаменитого музыкального гостя города, у колоннады играют курортные оркестры, а в Локете амфитеатр под замком превращается в сцену под открытым небом. За блеском кино в июле едут в Карловы Вары.",
        },
      },
      {
        heading: {
          de: "Kur und Aktivität im Gleichgewicht",
          en: "Cure and activity in balance",
          cs: "Kúra a pohyb v rovnováze",
          ru: "Лечение и активность в балансе",
        },
        body: {
          de: "Der Sommerrhythmus ergibt sich von selbst: morgens Trinkkur und Anwendungen, nachmittags Bewegung — Golf auf dem Platz von 1905, Nordic Walking auf den Terrainwegen oder eine Runde durch die schattigen Kurwälder, die selbst an heißen Tagen angenehm kühl bleiben. Den Abend gehört der Promenade und den Konzerten.",
          en: "The summer rhythm sets itself: drinking cure and treatments in the morning, activity in the afternoon — golf on the 1905 course, Nordic walking on the terrain paths, or a loop through the shady spa forests that stay pleasantly cool even on hot days. The evening belongs to the promenade and the concerts.",
          cs: "Letní rytmus se nastaví sám: dopoledne pitná kúra a procedury, odpoledne pohyb — golf na hřišti z roku 1905, nordic walking po terénních stezkách nebo okruh stinnými lázeňskými lesy, které zůstávají příjemně chladné i v horkých dnech. Večer patří promenádě a koncertům.",
          ru: "Летний ритм складывается сам собой: утром питьевой курс и процедуры, после обеда движение — гольф на поле 1905 года, скандинавская ходьба по терренкурам или круг по тенистым курортным лесам, которые остаются приятно прохладными даже в жару. Вечер принадлежит променаду и концертам.",
        },
      },
      {
        heading: {
          de: "Sommerausflüge für die ganze Familie",
          en: "Summer day trips for the whole family",
          cs: "Letní výlety pro celou rodinu",
          ru: "Летние поездки для всей семьи",
        },
        body: {
          de: "Jetzt zeigt sich die Umgebung von ihrer besten Seite: Miniaturen im Boheminium-Park, Mittelalter zum Anfassen im Geschichtspark Bärnau, die versteinerte Hochzeit der Hans-Heiling-Felsen oder eine Bahnfahrt durchs Tepltal nach Petschau. Alle 48 Ziele — filterbar nach „mit Kindern“, „ohne Auto“ oder „mit Einkehr“ — finden Sie im Ausflugskatalog.",
          en: "This is when the surroundings shine: miniatures at Boheminium Park, hands-on Middle Ages at the Bärnau history park, the petrified wedding of the Svatoš Rocks, or a train ride through the Teplá valley to Bečov. All 48 destinations — filterable by “with kids”, “no car” or “food available” — are in the day-trips catalogue.",
          cs: "Teď se okolí ukazuje v nejlepším světle: miniatury v parku Boheminium, středověk na dosah ve skanzenu Bärnau, zkamenělá svatba Svatošských skal nebo jízda vlakem údolím Teplé do Bečova. Všech 48 cílů — s filtry „s dětmi“, „bez auta“ či „s občerstvením“ — najdete v katalogu výletů.",
          ru: "Сейчас окрестности показывают себя с лучшей стороны: миниатюры в парке «Богеминиум», Средневековье на ощупь в парке Бэрнау, окаменевшая свадьба Сватошских скал или поездка на поезде по долине Теплы в Бечов. Все 48 направлений — с фильтрами «с детьми», «без машины», «есть кафе» — в каталоге экскурсий.",
        },
      },
    ],
    tips: {
      de: [
        "Hochsaison: Unterkunft und beliebte Anwendungstermine möglichst früh sichern.",
        "Die Quellen schmecken morgens am besten — und die Pavillons sind vor 9 Uhr herrlich leer.",
        "Für Ausflüge in die Natur frühe Stunden wählen; die Mittagshitze verbringt man besser im Wald oder am Wasser.",
      ],
      en: [
        "High season: secure accommodation and popular treatment slots early.",
        "The springs taste best in the morning — and the pavilions are blissfully empty before 9 a.m.",
        "Choose early hours for nature trips; midday heat is better spent in the forest or by the water.",
      ],
      cs: [
        "Vrchol sezóny: ubytování i oblíbené termíny procedur si zajistěte co nejdřív.",
        "Prameny chutnají nejlépe ráno — a pavilony jsou před devátou příjemně prázdné.",
        "Na výlety do přírody volte časné hodiny; polední horko je lepší strávit v lese nebo u vody.",
      ],
      ru: [
        "Высокий сезон: жильё и популярное время процедур бронируйте как можно раньше.",
        "Источники вкуснее всего утром — а павильоны до девяти приятно пусты.",
        "Для природных вылазок выбирайте ранние часы; полуденную жару лучше пережидать в лесу или у воды.",
      ],
    },
    articleRefs: [2, 4],
  },
  {
    id: 'autumn',
    slugs: {
      de: "herbst",
      en: "autumn",
      cs: "podzim",
      ru: "osen",
    },
    title: {
      de: "Herbst in Marienbad",
      en: "Autumn in Marienbad",
      cs: "Podzim v Mariánských Lázních",
      ru: "Осень в Марианских Лазнях",
    },
    metaDescription: {
      de: "Goldener Herbst in Marienbad: bunte Kurwälder, ruhige Kurzeit, Wellness und Ausflüge bei jedem Wetter. Warum der Herbst die klügste Reisezeit ist.",
      en: "Golden autumn in Marienbad: colourful spa forests, the calmest time for a cure, wellness and day trips in any weather. Why autumn is the smartest season.",
      cs: "Zlatý podzim v Mariánských Lázních: barevné lázeňské lesy, nejklidnější čas na kúru, wellness a výlety za každého počasí. Proč je podzim nejchytřejší termín.",
      ru: "Золотая осень в Марианских Лазнях: разноцветные курортные леса, самое спокойное время для курса, велнес и экскурсии в любую погоду.",
    },
    intro: {
      de: [
        "Wenn sich die Kurwälder golden und kupferrot färben, beginnt die Jahreszeit der Kenner: Der Herbst ist Marienbads stillste und vielleicht ehrlichste Saison — die Kolonnade gehört wieder den Kurgästen, die Wege den Spaziergängern, die Abende dem Buch und der Sauna.",
        "Praktisch gedacht: Im Herbst sind Termine leichter zu bekommen, die Hotels ruhiger, und das Reizklima in 630 Metern Höhe entfaltet bei klarer Herbstluft seine volle Wirkung — Marienbad trägt seit 2023 offiziell den Titel eines klimatischen Kurorts.",
      ],
      en: [
        "When the spa forests turn gold and copper, the connoisseurs' season begins: autumn is Marienbad's quietest and perhaps most honest time — the colonnade belongs to the spa guests again, the paths to the walkers, the evenings to a book and the sauna.",
        "Practically speaking: appointments are easier to get in autumn, the hotels are calmer, and the stimulating climate at 630 metres unfolds its full effect in clear autumn air — since 2023 Marienbad officially holds the title of a climatic spa.",
      ],
      cs: [
        "Když se lázeňské lesy zbarví do zlata a mědi, začíná období znalců: podzim je nejtišší a možná nejupřímnější sezónou Mariánských Lázní — kolonáda zase patří lázeňským hostům, cesty chodcům a večery knize a sauně.",
        "Prakticky vzato: na podzim se snáz shánějí termíny, hotely jsou klidnější a dráždivé podhorské klima v 630 metrech se v čistém podzimním vzduchu projeví naplno — Mariánské Lázně nesou od roku 2023 oficiální statut klimatických lázní.",
      ],
      ru: [
        "Когда курортные леса окрашиваются в золото и медь, начинается сезон знатоков: осень — самое тихое и, пожалуй, самое честное время Марианских Лазней. Колоннада снова принадлежит гостям курорта, дорожки — пешеходам, вечера — книге и сауне.",
        "Практическая сторона: осенью легче получить нужные даты, отели спокойнее, а стимулирующий предгорный климат на высоте 630 метров в чистом осеннем воздухе раскрывается в полную силу — с 2023 года Марианские Лазни официально носят статус климатического курорта.",
      ],
    },
    sections: [
      {
        heading: {
          de: "Die Farben des Kaiserwaldes",
          en: "The colours of the Slavkov Forest",
          cs: "Barvy Slavkovského lesa",
          ru: "Краски Славковского леса",
        },
        body: {
          de: "Der Oktober verwandelt die Umgebung in ein Gemälde: Die Moorwiesen von Kladská färben sich tiefrot, die Buchen am Hamelika-Hügel leuchten, und von Podhornberg oder der Krásno-Warte reicht der Blick durch glasklare Luft bis zum Erzgebirge. Es ist die beste Zeit des Jahres für Fotografen — und für lange, langsame Spaziergänge.",
          en: "October turns the surroundings into a painting: the bog meadows of Kladská go deep red, the beeches on Hamelika hill glow, and from Podhorní hill or the Krásno tower the view carries through glass-clear air to the Ore Mountains. It is the year's best time for photographers — and for long, slow walks.",
          cs: "Říjen promění okolí v obraz: rašelinné louky na Kladské zčervenají, buky na Hamelice se rozzáří a z Podhorního vrchu či rozhledny Krásno dohlédnete průzračným vzduchem až ke Krušným horám. Je to nejlepší čas roku pro fotografy — a pro dlouhé, pomalé procházky.",
          ru: "Октябрь превращает окрестности в картину: болотные луга Кладской краснеют, буки на Гамелике светятся, а с Подгорни-врха или башни Красно сквозь прозрачный воздух видно до самых Рудных гор. Лучшее время года для фотографов — и для долгих, неспешных прогулок.",
        },
      },
      {
        heading: {
          de: "Herbstkur: Die stille Hochsaison der Gesundheit",
          en: "The autumn cure: health's quiet high season",
          cs: "Podzimní kúra: tichá hlavní sezóna zdraví",
          ru: "Осенний курс: тихий высокий сезон здоровья",
        },
        body: {
          de: "Kurärzte schätzen den Herbst: Der Körper ist nach dem Sommer belastbar, das Immunsystem lässt sich vor dem Winter gezielt stärken — mit Trinkkur, Mineral- und CO₂-Bädern, Moorpackungen und Saunagängen. Wer eine längere Kur plant, findet jetzt die beste Verfügbarkeit und die ruhigste Atmosphäre des Jahres.",
          en: "Spa physicians value autumn: the body is resilient after summer, and the immune system can be strengthened before winter — with the drinking cure, mineral and CO₂ baths, peat packs and sauna rounds. If you are planning a longer cure, availability is best now and the atmosphere the calmest of the year.",
          cs: "Lázeňští lékaři mají podzim v oblibě: tělo je po létě odolné a imunitu lze před zimou cíleně posílit — pitnou kúrou, minerálními a uhličitými koupelemi, slatinnými zábaly a saunou. Kdo plánuje delší kúru, najde teď nejlepší dostupnost termínů a nejklidnější atmosféru roku.",
          ru: "Курортные врачи любят осень: организм после лета вынослив, а иммунитет можно целенаправленно укрепить перед зимой — питьевым курсом, минеральными и углекислыми ваннами, грязевыми обёртываниями и сауной. Кто планирует длительный курс, найдёт сейчас лучшую доступность дат и самую спокойную атмосферу года.",
        },
      },
      {
        heading: {
          de: "Ausflüge bei jedem Wetter",
          en: "Day trips in any weather",
          cs: "Výlety za každého počasí",
          ru: "Экскурсии в любую погоду",
        },
        body: {
          de: "Ein grauer Tag ist im Herbst kein Hindernis: Die Klosterbibliotheken von Tepl und Waldsassen, das Bierbad von Chodová Planá, die Münze von Joachimsthal oder die Thermen des Sibyllenbads funktionieren bei jedem Wetter. Im Ausflugskatalog genügt der Filter „auch bei Regen“ — und der Nachmittag ist gerettet.",
          en: "A grey day is no obstacle in autumn: the monastic libraries of Teplá and Waldsassen, the beer spa of Chodová Planá, the mint of Jáchymov or the Sibyllenbad thermal baths work in any weather. In the day-trips catalogue, the “rainy-day option” filter saves the afternoon.",
          cs: "Šedivý den není na podzim překážkou: klášterní knihovny v Teplé a Waldsassenu, pivní lázně v Chodové Plané, jáchymovská mincovna nebo termály Sibyllenbad fungují za každého počasí. V katalogu výletů stačí filtr „i za deště“ — a odpoledne je zachráněné.",
          ru: "Серый день осенью не помеха: монастырские библиотеки Теплы и Вальдзассена, пивные бани Ходовой Планы, монетный двор Яхимова или термы Зибилленбад работают в любую погоду. В каталоге экскурсий достаточно фильтра «и в дождь» — и день спасён.",
        },
      },
    ],
    tips: {
      de: [
        "Die buntesten Wälder erleben Sie meist Anfang bis Mitte Oktober.",
        "In 630 Metern Höhe ist der Herbst frischer als im Tiefland — eine warme Schicht extra einpacken.",
        "Ideal-Rhythmus: Anwendungen am Vormittag, Ausflug oder Spaziergang am Nachmittag, Sauna am Abend.",
      ],
      en: [
        "The forests are usually at their most colourful in early to mid-October.",
        "At 630 metres, autumn is crisper than in the lowlands — pack one warm layer extra.",
        "The ideal rhythm: treatments in the morning, a trip or walk in the afternoon, sauna in the evening.",
      ],
      cs: [
        "Nejbarevnější lesy zastihnete zpravidla začátkem až v polovině října.",
        "V 630 metrech je podzim svěžejší než v nížině — přibalte jednu teplou vrstvu navíc.",
        "Ideální rytmus: dopoledne procedury, odpoledne výlet či procházka, večer sauna.",
      ],
      ru: [
        "Самые красочные леса — обычно в начале-середине октября.",
        "На высоте 630 метров осень свежее, чем в низине, — возьмите один тёплый слой про запас.",
        "Идеальный ритм: утром процедуры, после обеда экскурсия или прогулка, вечером сауна.",
      ],
    },
    articleRefs: [3, 5],
  },
]
