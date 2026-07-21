import type { Locale } from '@/i18n/config'

/**
 * Extended content for the most-visited day-trip destinations: long
 * descriptions (paragraphs per locale) and photo galleries from Wikimedia
 * Commons. Destinations without an entry here simply render the short
 * description from dayTrips.ts.
 */

export interface GalleryImage {
  src: string
  author: string
  license: string
  licenseUrl?: string
  sourceUrl: string
}

export const tripLongDescriptions: Record<string, Record<Locale, string[]>> = {
  'kynzvart': {
    de: [
      "Seine klassizistische Gestalt erhielt das Schloss in den 1820er- und 1830er-Jahren durch den Wiener Architekten Pietro Nobile — im Auftrag von Kanzler Klemens von Metternich, dem mächtigsten Diplomaten des damaligen Europa. Metternich trug in Königswart Geschenke von Herrschern und Kuriositäten aus aller Welt zusammen: ägyptische Mumien, seltene Handschriften, Münzen und Naturalien, die bis heute eines der bemerkenswertesten Kuriositätenkabinette Europas bilden.",
      "Die Führungen durchqueren Repräsentationssäle und die Schlossbibliothek mit Zehntausenden Bänden; die Daguerreotypie-Sammlung gehört seit 2017 zum UNESCO-Weltdokumentenerbe. Der weitläufige englische Park mit Teichen und Alleen ist ganzjährig frei zugänglich — mit Kinderwagen oder Hund einer der schönsten ebenen Spaziergänge rund um Marienbad.",
    ],
    en: [
      "The chateau owes its neoclassical appearance to the Viennese architect Pietro Nobile, who rebuilt it in the 1820s and 1830s for Chancellor Klemens von Metternich, the most powerful diplomat of his age. Metternich filled Kynžvart with gifts from monarchs and curiosities from around the world: Egyptian mummies, rare manuscripts, coins and natural specimens that still form one of Europe's most remarkable cabinets of curiosities.",
      "Guided tours pass through state rooms and the chateau library of tens of thousands of volumes; the daguerreotype collection has been inscribed in UNESCO's Memory of the World register since 2017. The vast English park with its ponds and avenues is freely accessible all year — and with a stroller or a dog it makes one of the loveliest level walks near the spa.",
    ],
    cs: [
      "Dnešní klasicistní podobu dal zámku ve 20.–30. letech 19. století vídeňský architekt Pietro Nobile — na objednávku kancléře Klemense von Metternicha, nejmocnějšího diplomata tehdejší Evropy. Metternich na Kynžvart svážel dary panovníků i kuriozity z celého světa: egyptské mumie, vzácné rukopisy, mince a přírodniny, které dodnes tvoří jeden z nejpozoruhodnějších kabinetů kuriozit v Evropě.",
      "Prohlídkové okruhy vedou reprezentačními sály a zámeckou knihovnou s desítkami tisíc svazků; sbírka daguerrotypií je od roku 2017 zapsána v registru UNESCO Paměť světa. Rozlehlý anglický park s rybníky a alejemi je volně přístupný po celý rok — a s kočárkem či psem je to jedna z nejhezčích rovinatých procházek v okolí lázní.",
    ],
    ru: [
      "Классицистский облик замку придал в 1820–1830-х годах венский архитектор Пьетро Нобиле — по заказу канцлера Клеменса фон Меттерниха, самого влиятельного дипломата тогдашней Европы. Меттерних свозил в Кинжварт дары монархов и редкости со всего света: египетские мумии, редкие рукописи, монеты и природные диковины, которые и сегодня составляют один из самых замечательных кабинетов редкостей Европы.",
      "Экскурсии проходят через парадные залы и замковую библиотеку с десятками тысяч томов; коллекция дагеротипов с 2017 года внесена в реестр ЮНЕСКО «Память мира». Обширный английский парк с прудами и аллеями открыт свободно круглый год — с коляской или собакой это одна из красивейших ровных прогулок в окрестностях курорта.",
    ],
  },
  'becov': {
    de: [
      "Über dem Tepltal schichten sich acht Jahrhunderte Baugeschichte: die gotische Burg aus dem 14. Jahrhundert, die Renaissance-Pluhschen Häuser und das barocke Schloss der Familie Beaufort-Spontin. Ebendiese letzten Besitzer versteckten vor ihrer Flucht 1945 den Familienschatz unter dem Boden der Burgkapelle — das Reliquiar des heiligen Maurus, einen romanischen Schrein vom Anfang des 13. Jahrhunderts, geschmückt mit Gold, Filigran und Edelsteinen. Erst 1985 fanden ihn Kriminalisten bei einer legendären Suchaktion.",
      "Heute ist das Reliquiar in einer ständigen Ausstellung zu sehen — nach den Kronjuwelen das wertvollste Goldschmiedewerk des Landes. Zum Besuch gehören auch ein Bummel durchs Städtchen mit der Mariensäule und der botanische Garten unterhalb der Burg; der schönste Weg ab Marienbad aber führt mit der Bahn durch das tiefe, straßenlose Tal der Tepl.",
    ],
    en: [
      "Above the Teplá valley, eight centuries of building history stack up: a Gothic castle from the 14th century, the Renaissance Pluh houses and the baroque chateau of the Beaufort-Spontin family. It was these last owners who, before fleeing in 1945, hid the family treasure beneath the floor of the castle chapel — the Reliquary of St Maurus, a Romanesque shrine from the early 13th century adorned with gold, filigree and gems. Detectives found it only in 1985, in a legendary search operation.",
      "The reliquary is now displayed in a permanent exhibition — after the crown jewels, the country's most precious work of goldsmithing. A visit pairs well with a stroll through the little town and the botanical garden below the castle; the finest way from Marienbad, though, is the train, winding through the deep, roadless valley of the Teplá river.",
    ],
    cs: [
      "Nad údolím Teplé se vrství osm století stavební historie: gotický hrad ze 14. století, renesanční Pluhovské domy a barokní zámek rodu Beaufort-Spontin. Právě poslední majitelé před útěkem v roce 1945 ukryli pod podlahu hradní kaple rodinný poklad — relikviář svatého Maura, románskou schránku z počátku 13. století zdobenou zlatem, filigránem a drahokamy. Kriminalisté ji našli až v roce 1985 při legendární pátrací akci.",
      "Relikviář je dnes vystaven ve stálé expozici a vedle korunovačních klenotů jde o nejcennější zlatnickou památku země. K návštěvě patří i procházka městečkem s mariánským sloupem a botanická zahrada pod hradem; nejkrásnější cesta z Mariánských Lázní ale vede vlakem — trať se vine hlubokým údolím řeky Teplé lesy, kam silnice nevedou.",
    ],
    ru: [
      "Над долиной Теплы наслаиваются восемь веков строительной истории: готический замок XIV века, ренессансные Плуговские дома и барочный дворец рода Бофор-Спонтен. Именно последние владельцы перед бегством в 1945 году спрятали под полом замковой часовни фамильное сокровище — реликварий святого Мавра, романский ковчег начала XIII века, украшенный золотом, филигранью и самоцветами. Криминалисты нашли его лишь в 1985 году в ходе легендарной операции.",
      "Сегодня реликварий выставлен в постоянной экспозиции — после коронационных регалий это самое ценное ювелирное сокровище страны. К визиту стоит добавить прогулку по городку с марианской колонной и ботанический сад под замком; но красивейший путь из Марианских Лазней — поездом, по глубокой лесной долине реки Теплы, куда не ведёт ни одна дорога.",
    ],
  },
  'loket': {
    de: [
      "Die Burg wuchs im 12. Jahrhundert auf einem Granitfelsen und bewachte Handelsweg und Furt über die Eger — man nannte sie den „Schlüssel zum Königreich Böhmen“. Als Kind wurde hier kurzzeitig der spätere Kaiser Karl IV. festgehalten, der später als Herrscher zurückkehrte. Und 1823 feierte Goethe in Loket seinen 74. Geburtstag an der Seite der jungen Ulrike von Levetzow — der letzten großen Liebe seines Lebens.",
      "Heute zeigt die Burg Ausstellungen vom Porzellan bis zur Halsgerichtsbarkeit, und vom Turmumgang bietet sich der schönste Blick auf die Flussschleife. Unter den Mauern liegt das Amphitheater mit sommerlichen Opern und Konzerten, dazu ein Städtchen voller Bürgerhäuser — Filmemacher lieben es so sehr, dass es sogar im Bond-Film Casino Royale mitspielte. Zu Fuß lässt sich der Besuch mit einer Wanderung entlang der Eger zu den Hans-Heiling-Felsen verbinden.",
    ],
    en: [
      "The castle rose on a granite crag in the 12th century, guarding the trade route and the ford across the Ohře — it was called “the key to the Kingdom of Bohemia”. The future emperor Charles IV was briefly held here as a child, and returned later as sovereign. And in 1823 Goethe celebrated his 74th birthday in Loket at the side of young Ulrike von Levetzow — the last great love of his life.",
      "Today the castle offers exhibitions from porcelain to medieval justice, and the tower gallery gives the finest view of the river bend. Beneath the walls lies the amphitheatre with summer operas and concerts, and a town of burgher houses so photogenic that it even starred in the Bond film Casino Royale. Walkers can extend the visit along the Ohře to the Svatoš Rocks.",
    ],
    cs: [
      "Hrad vyrostl na žulové skále ve 12. století a střežil zemskou stezku i brod přes Ohři — říkalo se mu „klíč ku Království českému“. V dětství tu byl krátce držen pozdější císař Karel IV., který se sem pak vracel jako panovník. A v roce 1823 slavil v Lokti své 74. narozeniny Goethe po boku mladičké Ulriky von Levetzow — poslední velké lásky svého života.",
      "Dnes hrad nabízí expozice od porcelánu po hrdelní právo a z ochozu věže je nejhezčí pohled na meandr řeky. Pod hradbami leží amfiteátr, kde se v létě hrají opery a koncerty, a městečko plné měšťanských domů — filmaři si ho oblíbili natolik, že si tu zahrálo i v bondovce Casino Royale. Pěší to mohou spojit s procházkou podél Ohře ke Svatošským skalám.",
    ],
    ru: [
      "Замок вырос на гранитной скале в XII веке, охраняя торговый путь и брод через Огрже, — его называли «ключом к Чешскому королевству». В детстве здесь недолго держали будущего императора Карла IV, который позже возвращался сюда уже государем. А в 1823 году Гёте отметил в Локете 74-й день рождения рядом с юной Ульрикой фон Леветцов — последней большой любовью своей жизни.",
      "Сегодня замок предлагает экспозиции от фарфора до средневекового правосудия, а с галереи башни открывается лучший вид на излучину реки. Под стенами — амфитеатр с летними операми и концертами и городок мещанских домов, настолько фотогеничный, что он снялся даже в бондиане Casino Royale. Пешеходы могут продолжить путь вдоль Огрже к Сватошским скалам.",
    ],
  },
  'karlovy-vary': {
    de: [
      "Der Legende nach entdeckte Karl IV. die heißen Quellen selbst — bei einer Hirschjagd. Die Stadt, die er im 14. Jahrhundert um sie herum gründete, trägt bis heute seinen Namen. Das Herz des Bades ist der Sprudel: ein Geysir von über 70 °C heißem Mineralwasser, der bis zu zwölf Meter hoch schießt. Um ihn entfaltet sich die Promenade der Kolonnaden, deren schönste die Neorenaissance-Mühlbrunnkolonnade von Josef Zítek ist, dem Schöpfer des Prager Nationaltheaters.",
      "Zum klassischen Rundgang gehören die Seilbahnfahrt zum Aussichtsturm Diana, ein Glas Becherovka im Museum des Kräuterlikörs und der Blick auf das Grandhotel Pupp, Schauplatz des internationalen Filmfestivals. Gemeinsam mit Marienbad und Franzensbad zählt Karlsbad seit 2021 zum UNESCO-Welterbe der bedeutenden Kurstädte Europas.",
    ],
    en: [
      "Legend has it that Charles IV discovered the hot springs himself while hunting a stag — and the town he founded around them in the 14th century still bears his name. The heart of the spa is the Vřídlo: a geyser of mineral water at over 70 °C, shooting up to twelve metres high. Around it unfolds the promenade of colonnades, the finest being the neo-Renaissance Mill Colonnade by Josef Zítek, creator of Prague's National Theatre.",
      "The classic grand walk includes the funicular ride to the Diana lookout tower, a glass of Becherovka at the herbal liqueur's museum, and a look at the Grandhotel Pupp, home of the international film festival. Together with Mariánské Lázně and Františkovy Lázně, Karlovy Vary has been a UNESCO World Heritage Site since 2021 among the Great Spa Towns of Europe.",
    ],
    cs: [
      "Podle legendy objevil horké prameny sám Karel IV. při lovu jelena — a město, které kolem nich ve 14. století založil, nese jeho jméno dodnes. Srdcem lázní je Vřídlo: gejzír minerální vody o teplotě přes 70 °C, který tryská až do dvanáctimetrové výšky. Kolem něj se rozvíjí promenáda kolonád, z nichž nejkrásnější je novorenesanční Mlýnská kolonáda architekta Josefa Zítka, tvůrce pražského Národního divadla.",
      "Ke klasické „velké procházce“ patří výjezd lanovkou k rozhledně Diana, sklenka becherovky v muzeu tohoto bylinného likéru a pohled na hotel Pupp, dějiště mezinárodního filmového festivalu. Spolu s Mariánskými Lázněmi a Františkovými Lázněmi jsou Vary od roku 2021 součástí světového dědictví UNESCO jako slavná lázeňská města Evropy.",
    ],
    ru: [
      "По легенде, горячие источники открыл сам Карл IV во время охоты на оленя — и город, основанный им вокруг них в XIV веке, до сих пор носит его имя. Сердце курорта — Вржидло: гейзер минеральной воды температурой свыше 70 °C, бьющий на высоту до двенадцати метров. Вокруг него разворачивается променад колоннад, красивейшая из которых — неоренессансная Млынская колоннада Йозефа Зитека, создателя пражского Национального театра.",
      "К классической «большой прогулке» относятся подъём на фуникулёре к башне Диана, рюмка бехеровки в музее травяного ликёра и взгляд на гранд-отель «Пупп», где проходит международный кинофестиваль. Вместе с Марианскими и Франтишковыми Лазнями Карловы Вары с 2021 года входят в список Всемирного наследия ЮНЕСКО среди знаменитых курортных городов Европы.",
    ],
  },
  'cheb': {
    de: [
      "Die Egerer Burg ist die einzige Kaiserpfalz auf böhmischem Boden — entstanden unter Friedrich Barbarossa im 12. Jahrhundert, erhalten sind die seltene romanische Doppelkapelle und der Schwarze Turm aus dunklem Vulkangestein. Wenige Schritte entfernt steht das Stöckl, ein bizarrer Doppelblock von Fachwerk-Kaufmannshäusern, dessen Wurzeln ins 13. Jahrhundert reichen — das Wahrzeichen der Stadt.",
      "In die Geschichte Europas schrieb sich Eger am 25. Februar 1634 ein: In einem Haus am Marktplatz wurde Albrecht von Wallenstein ermordet, der Generalissimus der kaiserlichen Heere — heute erzählt das Museum am Tatort seine Geschichte. Dazu Galerien, das Retromuseum mit Design der sozialistischen Ära und das Egerufer; von Marienbad ist man mit dem Direktzug in einer halben Stunde hier.",
    ],
    en: [
      "Cheb Castle is the only imperial palatinate on Bohemian soil — begun under Frederick Barbarossa in the 12th century, it preserves a rare Romanesque double chapel and the Black Tower of dark volcanic stone. A few steps away stands the Špalíček, a bizarre double block of timbered merchant houses with roots in the 13th century — the town's emblem.",
      "Cheb entered European history on 25 February 1634: in a house on the square, Albrecht von Wallenstein, generalissimo of the imperial armies, was assassinated — today a museum on the very spot tells the story. Add galleries, the Retromuseum of socialist-era design and the Ohře riverside; from Marienbad the direct train takes half an hour.",
    ],
    cs: [
      "Chebský hrad je jedinou císařskou falcí na českém území — vznikl za Friedricha Barbarossy ve 12. století a dochovala se z něj vzácná románská dvojitá kaple i Černá věž z tmavého sopečného kamene. Pár kroků odtud stojí Špalíček, bizarní dvojblok hrázděných kupeckých domů, jehož kořeny sahají do 13. století a který se stal symbolem města.",
      "Do dějin Evropy se Cheb zapsal 25. února 1634: v domě na náměstí byl zavražděn Albrecht z Valdštejna, generalissimus císařských vojsk — dnes příběh vypráví muzeum přímo na místě činu. K tomu galerie, Retromuseum s designem socialistické éry a nábřeží Ohře; z Mariánských Lázní jste tu přímým vlakem za půl hodiny.",
    ],
    ru: [
      "Хебский замок — единственный императорский пфальц на чешской земле: он возник при Фридрихе Барбароссе в XII веке, и от него сохранились редкая романская двухъярусная капелла и Чёрная башня из тёмного вулканического камня. В нескольких шагах стоит «Шпаличек» — причудливый двойной блок фахверковых купеческих домов с корнями в XIII веке, символ города.",
      "В европейскую историю Хеб вошёл 25 февраля 1634 года: в доме на площади был убит Альбрехт фон Валленштейн, генералиссимус императорских войск, — сегодня музей на месте событий рассказывает эту историю. Добавьте галереи, Ретромузей с дизайном социалистической эпохи и набережную Огрже; из Марианских Лазней прямой поезд идёт полчаса.",
    ],
  },
  'kladska': {
    de: [
      "Die Ansiedlung Kladská ließ Fürst Schönburg-Waldenburg 1875 als Jagdsitz inmitten der tiefen Wälder des Kaiserwaldes errichten — die malerischen Blockbauten im alpinen Stil spiegeln sich bis heute im Kladská-Teich. Ringsum erstreckt sich das Nationale Naturreservat der Kladská-Moore, dessen Hochmoore zu den wertvollsten Mitteleuropas zählen.",
      "Der Rundweg auf hölzernen Bohlenstegen um den Teich misst knapp zwei Kilometer, ist eben, kinderwagentauglich und in jeder Jahreszeit schön — im Herbst färbt sich das Moor rot, im Winter überzieht es Raureif. Am Jagdschloss lässt sich einkehren, und Kladská ist zugleich idealer Ausgangspunkt für längere Wanderungen durch den Kaiserwald.",
    ],
    en: [
      "The Kladská settlement was built in 1875 by Prince Schönburg-Waldenburg as a hunting seat deep in the forests of the Slavkov Forest — its picturesque timber buildings in Alpine style are still mirrored in the Kladská pond. All around stretches the Kladská Peat Bogs national nature reserve, whose raised bogs rank among the most precious in Central Europe.",
      "The boardwalk circuit around the pond is just under two kilometres, level, stroller-friendly and lovely in every season — the bog turns red in autumn and frosts over in winter. There is a restaurant by the lodge, and Kladská also makes the ideal starting point for longer hikes through the Slavkov Forest.",
    ],
    cs: [
      "Osadu Kladská nechal roku 1875 vybudovat kníže Schönburg-Waldenburg jako lovecké sídlo uprostřed hlubokých lesů Slavkovského lesa — malebné roubené stavby v alpském stylu dodnes zrcadlí hladinu Kladského rybníka. Kolem se rozkládá národní přírodní rezervace Kladské rašeliny, jejíž vrchoviště patří k nejcennějším ve střední Evropě.",
      "Okruh po dřevěných povalových chodnících kolem rybníka měří necelé dva kilometry, je rovinatý, průchodný s kočárkem a krásný v každém ročním období — na podzim rašeliniště zčervená, v zimě ho přikryje jinovatka. U zámečku se dá poobědvat a Kladská je zároveň ideálním výchozím bodem pro delší túry Slavkovským lesem.",
    ],
    ru: [
      "Посёлок Кладска построил в 1875 году князь Шёнбург-Вальденбург как охотничью резиденцию среди глухих лесов Славковского леса — живописные бревенчатые постройки в альпийском стиле и сегодня отражаются в глади Кладского пруда. Вокруг простирается национальный заповедник Кладские торфяники, чьи верховые болота — среди ценнейших в Центральной Европе.",
      "Кольцо по деревянным настилам вокруг пруда — неполные два километра: ровное, проходимое с коляской и красивое в любое время года; осенью болото краснеет, зимой покрывается инеем. У замка можно пообедать, а сама Кладска — идеальная отправная точка для долгих походов по Славковскому лесу.",
    ],
  },
  'tepla': {
    de: [
      "Das Prämonstratenserkloster gründete 1193 der böhmische Edelmann Hroznata, der spätere Selige, dessen Gebeine bis heute in der Klosterkirche Mariä Verkündigung ruhen — einem romanisch-gotischen Bau, geweiht 1232. Ihr barockes Gesicht erhielt die Anlage um 1700 durch Christoph und Kilian Ignaz Dientzenhofer. Und es waren die Tepler Äbte, die auf Klostergrund Marienbad gründeten.",
      "Höhepunkt der Führung ist die Klosterbibliothek mit rund hunderttausend Bänden — die zweitgrößte Klosterbibliothek Böhmens, mit einem Saal, dessen Freskenschmuck den Atem raubt. Nach Jahrzehnten der Verwüstung, als in der Anlage eine Kaserne saß, kehrt das Kloster Schritt für Schritt ins Leben zurück: mit Park, Gasthaus, Klosterladen — und wieder einer lebendigen Ordensgemeinschaft.",
    ],
    en: [
      "The Premonstratensian monastery was founded in 1193 by the Bohemian nobleman Hroznata, later beatified, whose remains still rest in the abbey church of the Annunciation — a Romanesque-Gothic building consecrated in 1232. The complex received its baroque face around 1700 from Christoph and Kilian Ignaz Dientzenhofer. And it was the abbots of Teplá who founded Marienbad on monastery land.",
      "The highlight of the tour is the monastic library of some hundred thousand volumes — the second largest in Bohemia, with a hall whose frescoes take your breath away. After decades of devastation, when the complex housed army barracks, the monastery is slowly returning to life: with a park, an inn, a monastery shop — and once again a living religious community.",
    ],
    cs: [
      "Klášter premonstrátů založil roku 1193 český velmož Hroznata, pozdější blahoslavený, jehož ostatky dodnes spočívají v klášterním kostele Zvěstování Páně — románsko-gotické stavbě vysvěcené roku 1232. Barokní tvář dali konventu na přelomu 17. a 18. století Kryštof a Kilián Ignác Dientzenhoferové. A byli to právě tepelští opati, kdo na pozemcích kláštera založil Mariánské Lázně.",
      "Vrcholem prohlídky je klášterní knihovna s asi sto tisíci svazky — druhá největší klášterní knihovna v Čechách, se sálem, jehož fresková výzdoba bere dech. Po desetiletích devastace, kdy v areálu sídlila kasárna, se klášter postupně vrací k životu: patří k němu park, hostinec i klášterní obchod a žije tu znovu řeholní komunita.",
    ],
    ru: [
      "Премонстрантский монастырь основал в 1193 году чешский вельможа Грознота, позднее причисленный к блаженным; его мощи и сегодня покоятся в монастырском храме Благовещения — романо-готической постройке, освящённой в 1232 году. Барочный облик комплексу придали около 1700 года Кристоф и Килиан Игнац Динценхоферы. И именно тепельские аббаты основали на монастырских землях Марианские Лазни.",
      "Вершина экскурсии — монастырская библиотека, около ста тысяч томов: вторая по величине в Богемии, с залом, чьи фрески захватывают дух. После десятилетий разорения, когда в комплексе стояли казармы, монастырь шаг за шагом возвращается к жизни: с парком, трактиром, монастырской лавкой — и вновь живой монашеской общиной.",
    ],
  },
  'chodovar': {
    de: [
      "Bier wird in Chodová Planá nachweislich seit 1573 gebraut, und die Familienbrauerei Chodovar zählt heute zu den ältesten in Familienhand in Böhmen. Ihr Schatz liegt unter der Erde: ein Labyrinth in den Granit gehauener Keller, in denen das Bier bei konstanter Temperatur reift — zugänglich im Restaurant „Ve Skále“, das direkt in den historischen Kellerräumen eingerichtet wurde.",
      "Die Verkostung der hiesigen Lagerbiere lässt sich zur Anwendung steigern: Im Bierbad badet man in einem Sud aus Dunkelbier, Hefe und Hopfen, der der Haut guttut. Die Brauerei bietet Führungen mit Verkostung und ein eigenes stilvolles Hotel — und von Marienbad ist es nur eine Zugstation, sodass niemand fahren muss.",
    ],
    en: [
      "Beer has been brewed in Chodová Planá since at least 1573, and the family-run Chodovar brewery is today one of the oldest in family hands in Bohemia. Its treasure lies underground: a labyrinth of cellars hewn into the granite massif, where the beer matures at a constant temperature — open to visitors in the Ve Skále restaurant, built right into the historic cellar spaces.",
      "A tasting of the local lagers can be upgraded to a treatment: in the beer spa you soak in a brew of dark beer, yeast and hops that does the skin good. The brewery offers tours with tastings and its own stylish hotel — and from Marienbad it is a single train stop, so nobody has to worry about driving.",
    ],
    cs: [
      "Pivo se v Chodové Plané vaří prokazatelně od roku 1573 a rodinný pivovar Chodovar je dnes jedním z nejstarších v rukou jedné rodiny v Čechách. Jeho poklad leží pod zemí: labyrint sklepů vytesaných do žulového masivu, kde pivo zraje při stálé teplotě — a kam se návštěvník podívá v restauraci Ve Skále, vybudované přímo v historických sklepních prostorách.",
      "Ochutnávku zdejších ležáků lze povýšit na proceduru: v pivních lázních se koupe ve směsi tmavého piva, kvasnic a chmele, které pokožce svědčí. Pivovar nabízí exkurze s degustací i vlastní stylový hotel — a z Mariánských Lázní je to sem jediná zastávka vlakem, takže se nikdo nemusí starat, kdo bude řídit.",
    ],
    ru: [
      "Пиво в Ходовой Плане варят по документам с 1573 года, и семейная пивоварня «Ходовар» — одна из старейших в семейных руках в Богемии. Её сокровище — под землёй: лабиринт погребов, вырубленных в гранитном массиве, где пиво созревает при постоянной температуре; заглянуть туда можно в ресторане «Ве Скале», устроенном прямо в исторических подвалах.",
      "Дегустацию местных лагеров можно возвысить до процедуры: в пивных банях купаются в отваре тёмного пива, дрожжей и хмеля, полезном для кожи. Пивоварня предлагает экскурсии с дегустацией и собственный стильный отель — а из Марианских Лазней сюда всего одна остановка на поезде, так что за руль садиться никому не придётся.",
    ],
  },
  'boheminium': {
    de: [
      "Der Miniaturpark Boheminium entstand 1999, und seither sind hier über siebzig Modelle tschechischer Sehenswürdigkeiten im Maßstab 1:25 gewachsen — von Karlštejn über den Ještěd bis zum Prebischtor. Die Modelle entstehen in Hunderten Handarbeitsstunden und sind bis ins letzte Detail getreu: Fensterläden, Dachziegel, ja selbst die Miniaturbepflanzung.",
      "Der Park liegt in den Wäldern oberhalb der Stadt beim Hotel Krakonoš; man erreicht ihn auf einem angenehmen Spaziergang durch die Kurwälder oder mit dem Stadtbus, der den Park regelmäßig anfährt. Das Gelände ist ganzjährig geöffnet, mit Bistro und Kinderstationen — und dank befestigter Wege auch mit dem Kinderwagen bequem zu bewältigen.",
    ],
    en: [
      "The Boheminium miniature park opened in 1999 and has since grown to more than seventy models of Czech landmarks at 1:25 scale — from Karlštejn via Ještěd to the Pravčická Arch. Each model takes hundreds of hours of handwork and is faithful to the last detail: shutters, roof tiles, even the miniature greenery.",
      "The park lies in the woods above the town by the Krakonoš hotel; you reach it on a pleasant walk through the spa forests, or by the regular city bus that serves the park. The grounds are open year-round, with a bistro and children's stops — and thanks to the paved paths, it is easily managed with a stroller.",
    ],
    cs: [
      "Park miniatur Boheminium vznikl v roce 1999 a od té doby v něm vyrostlo přes sedmdesát modelů českých památek v měřítku 1:25 — od Karlštejna přes Ještěd po Pravčickou bránu. Modely vznikají ručně stovky hodin a jsou věrné do posledního detailu: okenic, tašek na střeše i miniaturní zeleně.",
      "Park leží v lesích nad městem u hotelu Krakonoš; dojdete sem příjemnou procházkou lázeňskými lesy, nebo dojedete autobusem MHD, který sem pravidelně zajíždí. Areál je otevřený celoročně, s bistrem a dětskými zastaveními — a protože jsou cesty zpevněné, zvládnete ho pohodlně i s kočárkem.",
    ],
    ru: [
      "Парк миниатюр «Богеминиум» открылся в 1999 году, и с тех пор в нём выросло более семидесяти моделей чешских памятников в масштабе 1:25 — от Карлштейна и Йештеда до Правчицких ворот. Каждая модель — сотни часов ручной работы, верной до последней детали: ставней, черепицы, даже миниатюрной зелени.",
      "Парк лежит в лесах над городом у отеля «Крконош»; сюда приятно дойти пешком через курортные леса или доехать на городском автобусе, который регулярно сюда заходит. Территория открыта круглый год, есть бистро и детские остановки — а благодаря мощёным дорожкам парк легко пройти и с коляской.",
    ],
  },
  'soos': {
    de: [
      "Das Reservat Soos schützt seit 1964 den Grund eines ausgetrockneten Sees in einer vom tertiären Vulkanismus geprägten Landschaft: ein salziges Mineralmoor mit einem Kieselgurschild, das in Mitteleuropa nicht seinesgleichen hat. Aus dem Boden blubbern Mofetten — Schlammvulkane, die Kohlendioxid zischen lassen — und die Erde überziehen bunte Mineralausblühungen, die hier gedeihen wie nirgendwo sonst.",
      "Der Lehrpfad auf Bohlenstegen misst rund 1,2 Kilometer und ist auch mit dem Kinderwagen begehbar; zum Areal gehört eine kleine Ausstellung über die Natur des Egerlandes mit Urzeitechsen-Modellen, die Kinder lieben. Der Ausflug lässt sich hervorragend mit Franzensbad oder der Burg Wildstein in Skalná verbinden, nur wenige Fahrminuten entfernt.",
    ],
    en: [
      "The Soos reserve has protected since 1964 the floor of a dried-up lake in a landscape shaped by Tertiary volcanism: a saline mineral peatland with a diatomite shield unlike anything else in Central Europe. Mofettes — mud volcanoes hissing with carbon dioxide — bubble up from the ground, and the earth is coated with colourful mineral crusts that thrive here like nowhere else.",
      "The boardwalk nature trail runs about 1.2 kilometres and can be managed with a stroller; the site includes a small exhibition on the nature of the Cheb region with models of prehistoric reptiles that children adore. The trip combines beautifully with Františkovy Lázně or Vildštejn Castle in Skalná, a few minutes' drive away.",
    ],
    cs: [
      "Rezervace SOOS chrání od roku 1964 dno vyschlého jezera v kraji poznamenaném třetihorním vulkanismem: slané minerální slatiniště s křemelinovým štítem, jaký nemá ve střední Evropě obdobu. Ze země probublávají mofety — bahenní sopky syčící oxidem uhličitým — a půdu pokrývají barevné výkvěty minerálů, kterým se tu daří jako nikde jinde.",
      "Naučná stezka po povalových chodnících měří asi 1,2 kilometru a projdete ji i s kočárkem; k areálu patří i malá expozice o přírodě Chebska s modely pravěkých ještěrů, které milují děti. Výlet se skvěle kombinuje s Františkovými Lázněmi nebo hradem Vildštejn ve Skalné, vzdáleným pár minut jízdy.",
    ],
    ru: [
      "Заповедник Соос с 1964 года охраняет дно высохшего озера в краю, отмеченном третичным вулканизмом: солёное минеральное болото с диатомитовым щитом, не имеющим аналогов в Центральной Европе. Из земли булькают мофеты — грязевые вулканчики, шипящие углекислым газом, — а почву покрывают цветные минеральные корки, каких больше нигде не увидишь.",
      "Учебная тропа по деревянным настилам — около 1,2 километра, пройти её можно и с коляской; на территории есть небольшая экспозиция о природе Хебского края с моделями доисторических ящеров, которые обожают дети. Поездка отлично сочетается с Франтишковыми Лазнями или замком Вильдштейн в Скальне — в нескольких минутах езды.",
    ],
  },
}

export const tripGalleries: Record<string, GalleryImage[]> = {
  'kynzvart': [
    {
      src: "/images/trips/gallery/kynzvart-1.jpg",
      author: "Vlach Pavel",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Z%C3%A1mek_Kyn%C5%BEvart_(2).jpg",
    },
    {
      src: "/images/trips/gallery/kynzvart-2.jpg",
      author: "VitVit",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Z%C3%A1mek_Kyn%C5%BEvart_dv%C5%AFr_a_k%C5%99%C3%ADdlo.jpg",
    },
  ],
  'becov': [
    {
      src: "/images/trips/gallery/becov-1.jpg",
      author: "Draceane",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Relikvi%C3%A1%C5%99_svat%C3%A9ho_Maura_2015.jpg",
    },
    {
      src: "/images/trips/gallery/becov-2.jpg",
      author: "VitVit",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Be%C4%8Dov_n%C3%A1m%C4%9Bst%C3%AD_mari%C3%A1nsk%C3%BD_sloup_2.jpg",
    },
  ],
  'loket': [
    {
      src: "/images/trips/gallery/loket-1.jpg",
      author: "Андрей Романенко",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Oh%C5%99e_in_Loket,_with_Loket_Castle.jpg",
    },
    {
      src: "/images/trips/gallery/loket-2.jpg",
      author: "TnoXX",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Loket_Castle_and_amphitheatre.jpg",
    },
  ],
  'karlovy-vary': [
    {
      src: "/images/trips/gallery/karlovy-vary-1.jpg",
      author: "Lubor Ferenc",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Karlovy_Vary_Ml%C3%BDnsk%C3%A1_kolon%C3%A1da_kv%C4%9Bten_2022_(1).jpg",
    },
    {
      src: "/images/trips/gallery/karlovy-vary-2.jpg",
      author: "Zorka Sojka",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Karlovy_Vary_Hygie_V%C5%99%C3%ADdeln%C3%AD_kolon%C3%A1da_3.jpg",
    },
  ],
  'cheb': [
    {
      src: "/images/trips/gallery/cheb-1.jpg",
      author: "Isiwal",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Cheb_Eger_Egerer_St%C3%B6ckl_%C5%A0pal%C3%AD%C4%8Dek-0212.jpg",
    },
    {
      src: "/images/trips/gallery/cheb-2.jpg",
      author: "Lubor Ferenc",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Chebsk%C3%BD_hrad_%C4%8Cern%C3%A1_v%C4%9B%C5%BE_%C4%8Dervenec_2023_(2).jpg",
    },
  ],
  'kladska': [
    {
      src: "/images/trips/gallery/kladska-1.jpg",
      author: "Czeva",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kladsk%C3%A1,_Loveck%C3%BD_z%C3%A1me%C4%8Dek_Kladsk%C3%A1_01.jpg",
    },
    {
      src: "/images/trips/gallery/kladska-2.jpg",
      author: "Czeva",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:NS_Kladsk%C3%A9_ra%C5%A1eliny,_boardwalk_01.jpg",
    },
  ],
  'tepla': [
    {
      src: "/images/trips/gallery/tepla-1.jpg",
      author: "VitVit",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kl%C3%A1%C5%A1ter_Tepl%C3%A1_kostel_3.jpg",
    },
    {
      src: "/images/trips/gallery/tepla-2.jpg",
      author: "VitVit",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kl%C3%A1%C5%A1ter_Tepl%C3%A1_celek_4.jpg",
    },
  ],
  'chodovar': [
    {
      src: "/images/trips/gallery/chodovar-1.jpg",
      author: "Lubor Ferenc",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Chodov%C3%A1_Plan%C3%A1_pivovar_kv%C4%9Bten_2019.jpg",
    },
    {
      src: "/images/trips/gallery/chodovar-2.jpg",
      author: "Aktron",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Chodov%C3%A1_Plan%C3%A1,_pivovar_II.jpg",
    },
  ],
  'boheminium': [
    {
      src: "/images/trips/gallery/boheminium-1.jpg",
      author: "Luciechalupna",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Boheminium_park_-_Hlubok%C3%A1_nad_Vltavou.jpg",
    },
    {
      src: "/images/trips/gallery/boheminium-2.jpg",
      author: "Petrkares",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Leti%C5%A1t%C4%9B_Mari%C3%A1nsk%C3%A9_L%C3%A1zn%C4%9B_-_park_Boheminium.jpg",
    },
  ],
  'soos': [
    {
      src: "/images/trips/gallery/soos-1.jpg",
      author: "Lubor Ferenc",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:SOOS_mofeta_(2).jpg",
    },
    {
      src: "/images/trips/gallery/soos-2.jpg",
      author: "Lubor Ferenc",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Soos_nau%C4%8Dn%C3%A1_stezka_b%C5%99ezen_2024_(9).jpg",
    },
  ],
}
