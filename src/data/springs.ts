import type { Locale } from '@/i18n/config'

/**
 * Mineral springs of Mariánské Lázně for the interactive springs explorer.
 * Indications follow data/ensana_knowledge_base.json (the single source of
 * truth); descriptions are informative, not medical advice — the explorer UI
 * carries a "consult your spa physician" note.
 */

export type SpringIndication =
  | 'digestion'
  | 'metabolism'
  | 'kidneys'
  | 'respiratory'
  | 'blood'
  | 'bones'
  | 'heart'
export type SpringLocation = 'colonnade' | 'town' | 'forest'
export type SpringType = 'drinking' | 'gas'

export interface Spring {
  id: string
  location: SpringLocation
  type: SpringType
  indications: SpringIndication[]
  name: Record<Locale, string>
  /** One-line mineral character, e.g. "sulphate acidulous water with Glauber's salt" */
  character: Record<Locale, string>
  description: Record<Locale, string>
  /** Extra paragraph for the spring detail page */
  detail: Record<Locale, string>
}

export const springs: Spring[] = [
  {
    id: 'krizovy',
    detail: {
      de: "Die Einheimischen kannten die Quelle seit jeher, doch berühmt machte sie erst der Tepler Klosterarzt Josef Johann Nehr, der Ende des 18. Jahrhunderts ihre Heilwirkung nachwies und die ersten Kurbauten durchsetzte. Das Kreuz, das der Quelle den Namen gab, steht hier seit 1749. Getrunken wird meist morgens vor dem Frühstück, langsam und in kleinen Schlucken — die genaue Dosierung bestimmt der Kurarzt.",
      en: "Locals had known the spring for ages, but it was the Teplá monastery physician Josef Johann Nehr who proved its healing effects in the late 18th century and pushed through the first spa buildings. The cross that gave the spring its name has stood here since 1749. It is usually drunk in the morning before breakfast, slowly and in small sips — your spa physician sets the exact dose.",
      cs: "Pramen znali místní odedávna, ale slávu mu přinesl až tepelský klášterní lékař Josef Jan Nehr, který u něj koncem 18. století prokázal léčivé účinky a prosadil první lázeňské stavby. Kříž, který dal prameni jméno, tu stojí od roku 1749. Pije se zpravidla ráno před snídaní, pomalu a po doušcích — přesné dávkování určí lázeňský lékař.",
      ru: "Местные знали источник издавна, но славу ему принёс монастырский врач из Теплы Йозеф Ян Нер, доказавший в конце XVIII века его целебное действие и добившийся первых курортных построек. Крест, давший источнику имя, стоит здесь с 1749 года. Пьют его обычно утром до завтрака, медленно и маленькими глотками — точную дозировку определит курортный врач.",
    },
    location: 'colonnade',
    type: 'drinking',
    indications: ['digestion', 'metabolism'],
    name: {
      de: 'Kreuzbrunnen (Křížový pramen)',
      en: 'Cross Spring (Křížový pramen)',
      cs: 'Křížový pramen',
      ru: 'Крестовый источник (Кржижовы прамен)',
    },
    character: {
      de: 'Säuerling mit Glaubersalz',
      en: 'Acidulous water with Glauber’s salt',
      cs: 'Kyselka s Glauberovou solí',
      ru: 'Кислая вода с глауберовой солью',
    },
    description: {
      de: 'Der berühmteste Brunnen Marienbads, mit dem die Geschichte des Kurorts begann. Sein charakteristisch bitterer Geschmack stammt vom Glaubersalz; getrunken wird er traditionell bei Verdauungs- und Stoffwechselbeschwerden. Der klassizistische Pavillon an der Kolonnade ist der zeremonielle Mittelpunkt jeder Trinkkur.',
      en: 'Marienbad’s most famous spring, where the spa’s history began. Its distinctive bitter taste comes from Glauber’s salt; it is traditionally drunk for digestive and metabolic complaints. The neoclassical pavilion by the colonnade is the ceremonial heart of every drinking cure.',
      cs: 'Nejslavnější mariánskolázeňský pramen, u kterého začala historie lázní. Charakteristickou nahořklou chuť mu dává Glauberova sůl; tradičně se pije při potížích trávení a metabolismu. Klasicistní pavilon u kolonády je obřadním středobodem každé pitné kúry.',
      ru: 'Самый знаменитый источник Марианских Лазней, с которого началась история курорта. Характерный горьковатый вкус ему придаёт глауберова соль; традиционно его пьют при расстройствах пищеварения и обмена веществ. Классицистский павильон у колоннады — церемониальный центр всякого питьевого курса.',
    },
  },
  {
    id: 'ferdinanduv',
    detail: {
      de: "Ihren Namen trägt sie nach Ferdinand I., unter dessen Herrschaft man hier im 16. Jahrhundert Salz zu gewinnen versuchte. Das Wasser hat die höchste Mineralisierung aller Marienbader Quellen; zum Pavillon von 1827 führt ein angenehmer Spaziergang durch den Auschowitzer Park, unterwegs lässt sich auch die Antoniusquelle kosten.",
      en: "It is named after Ferdinand I, under whose reign salt extraction was attempted here in the 16th century. The water has the highest mineral content of all Marienbad springs; a pleasant walk through the Úšovice park leads to the 1827 pavilion, with the Anthony Spring worth a taste on the way.",
      cs: "Jméno nese po Ferdinandovi I., za jehož vlády se tu v 16. století pokoušeli těžit sůl. Voda má nejvyšší mineralizaci ze všech mariánskolázeňských pramenů; k pavilonu z roku 1827 vede příjemná procházka Úšovickým parkem a cestou lze ochutnat i Antonínův pramen.",
      ru: "Имя источник носит в честь Фердинанда I, при котором здесь в XVI веке пытались добывать соль. Вода имеет самую высокую минерализацию среди всех источников Марианских Лазней; к павильону 1827 года ведёт приятная прогулка через Ушовицкий парк, а по пути можно попробовать источник Антонина.",
    },
    location: 'town',
    type: 'drinking',
    indications: ['digestion', 'metabolism'],
    name: {
      de: 'Ferdinandsbrunnen (Ferdinandův pramen)',
      en: 'Ferdinand Spring (Ferdinandův pramen)',
      cs: 'Ferdinandův pramen',
      ru: 'Источник Фердинанда (Фердинандув прамен)',
    },
    character: {
      de: 'Kräftiger Glaubersalz-Säuerling',
      en: 'Strong Glauber-salt acidulous water',
      cs: 'Silná glaubersolná kyselka',
      ru: 'Крепкая вода с глауберовой солью',
    },
    description: {
      de: 'Die älteste schriftlich belegte Quelle Marienbads — schon im 16. Jahrhundert versuchte man hier, Salz zu sieden. Ihre Wirkung ähnelt dem Kreuzbrunnen, der Geschmack ist noch kräftiger. Der hübsche Pavillon steht im unteren Stadtteil Úšovice und ist ein lohnendes Spazierziel.',
      en: 'The oldest spring in written records — salt-boiling was attempted here as early as the 16th century. Its effects resemble the Cross Spring, with an even stronger taste. The pretty pavilion stands in the lower Úšovice district and makes a rewarding walk.',
      cs: 'Nejstarší písemně doložený pramen Mariánských Lázní — už v 16. století se tu zkoušela vařit sůl. Účinky se podobají Křížovému prameni, chuť je ještě výraznější. Půvabný pavilon stojí v dolní části města v Úšovicích a je vděčným cílem procházky.',
      ru: 'Старейший письменно засвидетельствованный источник — ещё в XVI веке здесь пытались выпаривать соль. Действие сходно с Крестовым источником, вкус ещё выразительнее. Красивый павильон стоит в нижней части города, в Ушовицах, и служит отличной целью прогулки.',
    },
  },
  {
    id: 'rudolfuv',
    detail: {
      de: "Benannt ist sie nach Kronprinz Rudolf. Das Verhältnis von Kalzium und Magnesium in ihrem Wasser gilt als außergewöhnlich günstig, weshalb sie bei Osteoporose-Trinkkuren eingesetzt wird — auch Kindern wird sie verschrieben. An ihrem Pavillon in Úšovice entspringt sie bis heute, ihr Wasser fließt zudem in den Kreuzbrunnen-Pavillon an der Kolonnade.",
      en: "It is named after Crown Prince Rudolph. The calcium-to-magnesium ratio of its water is considered exceptionally favourable, which is why it features in drinking cures for osteoporosis — it is prescribed to children too. It still rises at its pavilion in Úšovice, and its water also flows to the Cross Spring pavilion by the colonnade.",
      cs: "Pojmenován je po korunním princi Rudolfovi. Poměr vápníku a hořčíku v jeho vodě je považován za mimořádně příznivý, proto bývá součástí pitných kúr při osteoporóze; předepisuje se i dětem. U pavilonu v Úšovicích pramení dodnes a jeho voda teče také do pavilonu Křížového pramene u kolonády.",
      ru: "Назван в честь кронпринца Рудольфа. Соотношение кальция и магния в его воде считается исключительно благоприятным, поэтому он входит в питьевые курсы при остеопорозе — его назначают и детям. Источник по сей день бьёт у павильона в Ушовицах, а его вода подаётся и в павильон Крестового источника у колоннады.",
    },
    location: 'colonnade',
    type: 'drinking',
    indications: ['kidneys', 'bones'],
    name: {
      de: 'Rudolfsquelle (Rudolfův pramen)',
      en: 'Rudolph Spring (Rudolfův pramen)',
      cs: 'Rudolfův pramen',
      ru: 'Источник Рудольфа (Рудольфув прамен)',
    },
    character: {
      de: 'Kalzium- und magnesiumreicher Säuerling',
      en: 'Calcium- and magnesium-rich acidulous water',
      cs: 'Kyselka bohatá na vápník a hořčík',
      ru: 'Вода, богатая кальцием и магнием',
    },
    description: {
      de: 'Die klassische „Nierenquelle“ Marienbads: Ihr hoher Kalziumgehalt macht sie zur traditionellen Wahl bei Erkrankungen der Nieren und Harnwege sowie unterstützend bei Osteoporose. Die Quelle entspringt in Úšovice; kosten können Sie sie bequem im Pavillon an der Kolonnade.',
      en: 'Marienbad’s classic “kidney spring”: its high calcium content makes it the traditional choice for kidney and urinary tract disorders, and as support for osteoporosis. The spring rises in Úšovice; you can taste it conveniently at the colonnade pavilion.',
      cs: 'Klasický „ledvinový“ pramen Mariánských Lázní: díky vysokému obsahu vápníku je tradiční volbou při onemocněních ledvin a močových cest a jako podpora při osteoporóze. Pramen vyvěrá v Úšovicích; pohodlně jej ochutnáte v pavilonu u kolonády.',
      ru: 'Классический «почечный» источник Марианских Лазней: благодаря высокому содержанию кальция он традиционно рекомендуется при болезнях почек и мочевых путей и как поддержка при остеопорозе. Источник бьёт в Ушовицах; удобнее всего попробовать его в павильоне у колоннады.',
    },
  },
  {
    id: 'karolinin',
    detail: {
      de: "Ursprünglich hieß sie Neue Quelle; den Namen der Prinzessin Karoline Auguste erhielt sie 1817. Der hohe Magnesiumanteil macht sie zur klassischen Wahl bei Nierensteinen — und ihr ist die klassizistische Karolinenbrunnen-Kolonnade gewidmet, eines der meistfotografierten Bauwerke der Stadt.",
      en: "Originally called the New Spring, it received Princess Caroline Augusta's name in 1817. Its high magnesium share makes it the classic choice for kidney stones — and it lends its name to the neoclassical Caroline Spring colonnade, one of the town's most photographed structures.",
      cs: "Původně se jmenoval Nový pramen; jméno princezny Karolíny Augusty dostal roku 1817. Vysoký podíl hořčíku z něj dělá klasickou volbu při ledvinových kamenech — a právě jemu je zasvěcena klasicistní kolonáda Karolinina pramene, jedna z nejfotografovanějších staveb města.",
      ru: "Первоначально он назывался Новым источником; имя принцессы Каролины Августы получил в 1817 году. Высокая доля магния делает его классическим выбором при почечных камнях — именно ему посвящена классицистская колоннада источника Каролины, одно из самых фотографируемых сооружений города.",
    },
    location: 'colonnade',
    type: 'drinking',
    indications: ['kidneys'],
    name: {
      de: 'Karolinenquelle (Karolinin pramen)',
      en: 'Caroline Spring (Karolinin pramen)',
      cs: 'Karolinin pramen',
      ru: 'Источник Каролины (Каролинин прамен)',
    },
    character: {
      de: 'Magnesiumreicher Säuerling',
      en: 'Magnesium-rich acidulous water',
      cs: 'Kyselka s vysokým obsahem hořčíku',
      ru: 'Вода с высоким содержанием магния',
    },
    description: {
      de: 'Benannt nach Prinzessin Karoline Auguste, verdankt die Quelle ihren Ruf dem außergewöhnlich hohen Magnesiumgehalt — traditionell empfohlen bei Nierensteinen. Ihr Pavillon gehört zum Ensemble rund um die Kolonnade, wenige Schritte von der Singenden Fontäne.',
      en: 'Named after Princess Caroline Augusta, the spring owes its reputation to an exceptionally high magnesium content — traditionally recommended for kidney stones. Its pavilion belongs to the colonnade ensemble, steps from the Singing Fountain.',
      cs: 'Pramen pojmenovaný po princezně Karolíně Augustě vděčí za svou pověst mimořádně vysokému obsahu hořčíku — tradičně se doporučuje při ledvinových kamenech. Jeho pavilon patří k souboru staveb kolem kolonády, pár kroků od Zpívající fontány.',
      ru: 'Источник, названный в честь принцессы Каролины Августы, обязан репутацией исключительно высокому содержанию магния — его традиционно рекомендуют при почечных камнях. Павильон входит в ансамбль колоннады, в нескольких шагах от Поющего фонтана.',
    },
  },
  {
    id: 'lesni',
    detail: {
      de: "Sie entspringt am Rand des Kurviertels am Třebízský-Bach, und ihr Empire-Pavillon von 1869 gehört zu den anmutigsten des Kurorts. Dank der milden alkalischen Zusammensetzung eignet sie sich auch zum Inhalieren und Gurgeln; der morgendliche Weg zur Waldquelle mit dem Becher in der Hand ist für viele Gäste ein tägliches Ritual.",
      en: "It rises at the edge of the spa quarter by the Třebízský brook, and its Empire-style pavilion of 1869 is among the most graceful in the spa. Thanks to its mild alkaline composition it also suits inhalation and gargling; the morning walk to the Forest Spring, cup in hand, is a daily ritual for many guests.",
      cs: "Vyvěrá na okraji lázeňské čtvrti u Třebízského potoka a jeho empírový pavilon z roku 1869 patří k nejpůvabnějším v lázních. Díky jemnému alkalickému složení se hodí i k inhalacím a kloktání; ranní cesta k Lesnímu prameni s pohárkem v ruce je pro mnoho hostů denním rituálem.",
      ru: "Он бьёт на краю курортного квартала у Тршебизского ручья, а его ампирный павильон 1869 года — один из самых изящных на курорте. Благодаря мягкому щелочному составу вода подходит и для ингаляций и полосканий; утренняя дорога к Лесному источнику с бокальчиком в руке — ежедневный ритуал многих гостей.",
    },
    location: 'town',
    type: 'drinking',
    indications: ['respiratory', 'digestion'],
    name: {
      de: 'Waldquelle (Lesní pramen)',
      en: 'Forest Spring (Lesní pramen)',
      cs: 'Lesní pramen',
      ru: 'Лесной источник (Лесни прамен)',
    },
    character: {
      de: 'Milder alkalischer Säuerling',
      en: 'Mild alkaline acidulous water',
      cs: 'Jemná alkalická kyselka',
      ru: 'Мягкая щелочная вода',
    },
    description: {
      de: 'Die mildeste der großen Trinkquellen, traditionell genutzt bei Erkrankungen der oberen Atemwege — auch zum Inhalieren und Gurgeln — sowie bei Magenbeschwerden. Ihr eleganter Pavillon am nördlichen Rand des Kurviertels ist ein beliebtes Ziel des Morgenspaziergangs.',
      en: 'The mildest of the great drinking springs, traditionally used for upper respiratory complaints — including inhalation and gargling — and for stomach troubles. Its elegant pavilion at the northern edge of the spa quarter is a favourite goal of the morning walk.',
      cs: 'Nejjemnější z velkých pitných pramenů, tradičně užívaný při onemocněních horních cest dýchacích — i k inhalacím a kloktání — a při žaludečních potížích. Elegantní pavilon na severním okraji lázeňské čtvrti je oblíbeným cílem ranní procházky.',
      ru: 'Самый мягкий из больших питьевых источников, традиционно применяемый при заболеваниях верхних дыхательных путей — в том числе для ингаляций и полосканий — и при желудочных недомоганиях. Его элегантный павильон на северном краю курортного квартала — любимая цель утренней прогулки.',
    },
  },
  {
    id: 'ambrozuv',
    detail: {
      de: "Die drei Austritte der Ambrosiusquelle finden Sie im Park unterhalb der Kolonnade, unweit des Zentralbads. Ihr höherer Eisengehalt trug ihr den Ruf einer Quelle gegen Blutarmut ein; im 19. Jahrhundert nannte man sie wegen der angeblichen Wirkung auf Schönheit und Frische auch Liebesquelle.",
      en: "The three outlets of the Ambrose Spring are found in the park below the colonnade, near the Central Baths. Its elevated iron content earned it a reputation against anaemia; in the 19th century it was also called the spring of love for its supposed effects on beauty and freshness.",
      cs: "Tři vývěry Ambrožova pramene najdete v parku pod Kolonádou, kousek od Centrálních lázní. Vyšší obsah železa mu vysloužil pověst pramene proti chudokrevnosti; v 19. století se mu pro údajné účinky na krásu a svěžest říkalo také pramen lásky.",
      ru: "Три выхода источника Амброжа находятся в парке под колоннадой, недалеко от Центральных лазней. Повышенное содержание железа принесло ему славу источника против малокровия; в XIX веке за приписываемое действие на красоту и свежесть его называли также источником любви.",
    },
    location: 'town',
    type: 'drinking',
    indications: ['blood', 'kidneys'],
    name: {
      de: 'Ambrosiusquelle (Ambrožův pramen)',
      en: 'Ambrose Spring (Ambrožův pramen)',
      cs: 'Ambrožův pramen',
      ru: 'Источник Амброжа (Амброжув прамен)',
    },
    character: {
      de: 'Eisenhaltiger Säuerling',
      en: 'Iron-rich acidulous water',
      cs: 'Železnatá kyselka',
      ru: 'Железистая вода',
    },
    description: {
      de: 'Wegen seines Eisengehalts wurde er einst als „Quelle der Liebe“ gerühmt — empfohlen bei Blutarmut, außerdem traditionell bei Beschwerden der Harnwege. Die Quelle finden Sie im Kurpark unterhalb des Goetheplatzes; Goethe selbst rastete gern in ihrer Nähe.',
      en: 'Thanks to its iron content it was once celebrated as the “spring of love” — recommended for anaemia and traditionally for urinary complaints. You will find it in the spa park below Goethe Square; Goethe himself liked to rest nearby.',
      cs: 'Pro obsah železa býval oslavován jako „pramen lásky“ — doporučuje se při chudokrevnosti a tradičně i při potížích močových cest. Najdete ho v lázeňském parku pod Goethovým náměstím; sám Goethe u něj rád odpočíval.',
      ru: 'За содержание железа его когда-то славили как «источник любви» — он рекомендуется при малокровии и, по традиции, при недугах мочевых путей. Найдёте его в курортном парке под площадью Гёте; сам Гёте любил отдыхать поблизости.',
    },
  },
  {
    id: 'marii',
    detail: {
      de: "Der schweflige Geruch dieses Gasaustritts gab dem Ort einst den Namen „Stinkende Wiese“, ehe man ihn nach einem Marienbild umbenannte — genutzt wurde er schon vor der Gründung des Kurorts. Das Gas wird heute gefasst und im benachbarten Kurhaus Maria Spa in trockenen CO₂-Bädern und Gasinjektionen angewendet — jener Behandlung, die Marienbad berühmt gemacht hat. Der Austritt liegt hinter dem Zentralbad; baden lässt sich darin freilich nicht.",
      en: "The sulphurous smell of this gas vent once earned the place the name \"Stinking Meadow\", before it was renamed after an image of the Virgin Mary — and it was in use even before the spa town was founded. The gas is now captured and applied at the neighbouring Maria Spa in dry CO₂ baths and gas injections — the treatment that made Marienbad famous. The vent lies behind the Central Baths; you cannot bathe in it, of course.",
      cs: "Právě sirný zápach tohoto vývěru plynu dal místu jméno „Smrdutá louka“, než je přejmenovali podle obrázku Panny Marie — využíval se přitom ještě před založením lázní. Plyn se dnes jímá a v sousedním lázeňském domě Maria Spa aplikuje v suchých uhličitých koupelích a plynových injekcích — proceduře, kterou Mariánské Lázně proslavily. Vývěr najdete za Centrálními lázněmi, koupat se v něm ovšem nelze.",
      ru: "Именно серный запах этого газового выхода когда-то дал месту название «Вонючий луг», пока его не переименовали в честь образа Девы Марии — а использовали его ещё до основания курорта. Сегодня газ улавливают и применяют в соседнем курортном доме Maria Spa в сухих углекислых ваннах и газовых инъекциях — процедуре, прославившей Марианские Лазни. Выход находится за Центральными лазнями; купаться в нём, разумеется, нельзя.",
    },
    location: 'town',
    type: 'gas',
    indications: ['heart'],
    name: {
      de: 'Marienquelle (Mariin pramen)',
      en: 'Maria Spring (Mariin pramen)',
      cs: 'Mariin pramen',
      ru: 'Источник Марии (Мариин прамен)',
    },
    character: {
      de: 'Natürliches CO₂-Gas (99,7 %)',
      en: 'Natural CO₂ gas (99.7%)',
      cs: 'Přírodní plyn CO₂ (99,7 %)',
      ru: 'Природный газ CO₂ (99,7 %)',
    },
    description: {
      de: 'Keine Quelle im klassischen Sinn: Aus der Tiefe tritt hier kein Wasser aus, sondern fast reines Kohlendioxid (99,7 %) — das „Mariengas“, das sich nur sekundär im seichten Grundwasser löst. Eben dieser Gasaustritt gab der Stadt ihren Namen. In Trockenbädern und Gasinjektionen fördert das Gas die Durchblutung und entlastet Herz und Gefäße; die Anwendung gibt es exklusiv in den Kurhäusern.',
      en: 'Not a spring in the classic sense: what rises from the depths here is not water but almost pure carbon dioxide (99.7%) — “Maria’s gas”, which only secondarily dissolves into the shallow groundwater. It was this gas vent that gave the town its name. Used in dry baths and gas injections, the gas boosts circulation and eases the heart and blood vessels; the treatment is exclusive to the spa houses.',
      cs: 'Nejde o pramen v klasickém slova smyslu: z hlubin tu nevyvěrá voda, ale téměř čistý oxid uhličitý (99,7 %) — „Mariin plyn“, který se jen druhotně rozpouští v mělké podzemní vodě. Právě tento vývěr plynu dal městu jméno. V suchých koupelích a plynových injekcích plyn podporuje prokrvení a odlehčuje srdci a cévám; procedura je výsadou zdejších lázeňských domů.',
      ru: 'Это не источник в классическом смысле слова: из глубин здесь выходит не вода, а почти чистый углекислый газ (99,7 %) — «газ Марии», который лишь вторично растворяется в неглубоких грунтовых водах. Именно этот газовый выход дал городу имя. В сухих ваннах и газовых инъекциях газ улучшает кровообращение и разгружает сердце и сосуды; процедура — привилегия местных курортных домов.',
    },
  },
  {
    id: 'farska',
    detail: {
      de: "Zur Quelle führt der blau markierte Wanderweg durch den Wald Richtung Prameny; der unbeschwerliche Weg von der Kolonnade dauert knapp eine Stunde. Wer die Runde verlängern möchte, wandert weiter zum Reservat Smraďoch — beides passt in einen Vormittag.",
      en: "A blue-marked trail leads to the spring through the forest towards Prameny; the easy walk from the colonnade takes just under an hour. To extend the loop, continue to the Smraďoch reserve — both fit comfortably into one morning.",
      cs: "K prameni vede modrá turistická značka lesem směrem na Prameny; nenáročná cesta od kolonády zabere necelou hodinu. Kdo chce okruh prodloužit, může pokračovat k rezervaci Smraďoch — obojí se vejde do jednoho dopoledne.",
      ru: "К источнику ведёт синяя туристическая маркировка через лес в сторону Прамен; лёгкая дорога от колоннады занимает неполный час. Кто хочет продлить маршрут, может продолжить путь к заповеднику Смрадёх — и то и другое умещается в одно утро.",
    },
    location: 'forest',
    type: 'drinking',
    indications: ['blood'],
    name: {
      de: 'Pfarrsäuerling (Farská kyselka)',
      en: 'Farská Kyselka Spring',
      cs: 'Farská kyselka',
      ru: 'Фарска-киселка',
    },
    character: {
      de: 'Eisenhaltiger Waldsäuerling',
      en: 'Iron-rich forest spring',
      cs: 'Železnatá lesní kyselka',
      ru: 'Железистый лесной источник',
    },
    description: {
      de: 'Ein frei sprudelnder Säuerling in den Wäldern nördlich der Stadt und das klassische Ziel des Kurspaziergangs. Das eisenhaltige Wasser hinterlässt am Auslauf seinen typischen rostroten Belag — ein Becher an Ort und Stelle gehört zum Erlebnis.',
      en: 'A freely bubbling spring in the forests north of town and the classic goal of the spa walk. The iron-rich water leaves its typical rust-red deposit at the outlet — a cup on the spot is part of the experience.',
      cs: 'Volně vyvěrající kyselka v lesích severně od města a klasický cíl lázeňské vycházky. Železnatá voda zanechává u výtoku typický rezavý povlak — pohárek přímo na místě k zážitku patří.',
      ru: 'Свободно бьющий источник в лесах к северу от города и классическая цель курортной прогулки. Железистая вода оставляет у стока типичный ржавый налёт — стаканчик прямо на месте входит в программу.',
    },
  },
  {
    id: 'balbinuv',
    detail: {
      de: "Der Austritt liegt im Naturdenkmal des Quellgebiets am Balbín-Teich zwischen dem Viertel Hleďsebe und den Wäldern nördlich der Stadt. Die umliegenden Moorwiesen gehören zu den letzten Standorten des seltenen Sonnentaus — die Quelle verdient daher einen stillen, rücksichtsvollen Besuch.",
      en: "The outlet lies in the protected spring area by the little Balbín pond, between the Hleďsebe quarter and the forests north of the town. The surrounding boggy meadows are among the last habitats of the rare sundew — so the spring deserves a quiet, considerate visit.",
      cs: "Vývěr leží v přírodní památce Prameniště u Balbínova rybníčku mezi čtvrtí Hleďsebe a lesy severně od města. Okolní rašelinné loučky patří k posledním místům, kde roste vzácná rosnatka — pramen si proto zaslouží tichou, ohleduplnou návštěvu.",
      ru: "Выход находится в охраняемом родниковом урочище у Бальбинова пруда, между кварталом Гледьсебе и лесами к северу от города. Окрестные болотистые лужайки — одно из последних мест произрастания редкой росянки, поэтому источник заслуживает тихого, бережного визита.",
    },
    location: 'forest',
    type: 'drinking',
    indications: ['blood'],
    name: {
      de: 'Balbín-Quelle (Balbínův pramen)',
      en: 'Balbín Spring (Balbínův pramen)',
      cs: 'Balbínův pramen',
      ru: 'Источник Бальбина (Бальбинув прамен)',
    },
    character: {
      de: 'Sanfter eisenhaltiger Säuerling',
      en: 'Gentle iron-rich acidulous water',
      cs: 'Jemná železnatá kyselka',
      ru: 'Мягкая железистая вода',
    },
    description: {
      de: 'Ein stiller Waldaustritt am Rand des Balbín-Moors im Norden der Stadt, benannt nach dem Gelehrten Bohuslav Balbín. Wer die Quellen abseits der Kolonnade sucht, findet hier Wald, Vogelstimmen — und einen Säuerling, den nur wenige Kurgäste kennen.',
      en: 'A quiet forest outlet at the edge of the Balbín bog north of the town, named after the scholar Bohuslav Balbín. If you seek the springs away from the colonnade, here you find woodland, birdsong — and a spring few spa guests know.',
      cs: 'Tichý lesní vývěr na okraji Balbínova rašeliniště v severní části města, pojmenovaný po učenci Bohuslavu Balbínovi. Kdo hledá prameny stranou kolonády, najde tu les, ptačí zpěv — a kyselku, kterou zná jen málokterý lázeňský host.',
      ru: 'Тихий лесной выход у края Бальбинова торфяника в северной части города, названный в честь учёного Богуслава Бальбина. Кто ищет источники вдали от колоннады, найдёт здесь лес, пение птиц — и воду, которую знает редкий гость курорта.',
    },
  },
  {
    id: 'antoninuv',
    detail: {
      de: "Die Quelle in Úšovice versorgte die umliegenden Gehöfte lange vor der Gründung des Kurorts; der heutige kleine Pavillon stammt von 1997, als der Austritt neu gefasst wurde. Zusammen mit dem Ferdinandsbrunnen bildet sie das natürliche Ziel eines Spaziergangs durch die Unterstadt — und die Einheimischen halten sie für den besten „Tafelsäuerling“.",
      en: "The spring in Úšovice served the surrounding farmsteads long before the spa was founded; today's small pavilion dates from 1997, when the outlet was newly captured. Together with the Ferdinand Spring it makes a natural goal for a walk through the lower town — and locals consider it the best \"table\" acidulous water.",
      cs: "Pramen v Úšovicích sloužil okolním usedlostem dávno před vznikem lázní; dnešní pavilonek pochází z roku 1997, kdy byl vývěr nově zachycen. Spolu s Ferdinandovým pramenem tvoří přirozený cíl procházky dolní částí města — a místní ho považují za nejlepší „stolní“ kyselku.",
      ru: "Источник в Ушовицах служил окрестным усадьбам задолго до основания курорта; нынешний павильончик относится к 1997 году, когда выход был заново каптирован. Вместе с источником Фердинанда он образует естественную цель прогулки по нижней части города — а местные считают его лучшей «столовой» кислой водой.",
    },
    location: 'town',
    type: 'drinking',
    indications: ['digestion'],
    name: {
      de: 'Antoniusquelle (Antonínův pramen)',
      en: 'Anthony Spring (Antonínův pramen)',
      cs: 'Antonínův pramen',
      ru: 'Источник Антонина (Антонинув прамен)',
    },
    character: {
      de: 'Erfrischender Säuerling',
      en: 'Refreshing acidulous water',
      cs: 'Osvěžující kyselka',
      ru: 'Освежающая кислая вода',
    },
    description: {
      de: 'Die Quelle des unteren Stadtteils: Ihr Pavillon in Úšovice ist bei Einheimischen beliebt, die hier ihre Flaschen füllen. Ein erfrischender, gut trinkbarer Säuerling — ideale Station auf dem Spaziergang zum Ferdinandsbrunnen.',
      en: 'The spring of the lower town: its pavilion in Úšovice is popular with locals, who come to fill their bottles. A refreshing, very drinkable acidulous water — an ideal stop on the walk to the Ferdinand Spring.',
      cs: 'Pramen dolní části města: jeho pavilon v Úšovicích je oblíbený u místních, kteří si sem chodí plnit lahve. Osvěžující, dobře pitelná kyselka — ideální zastávka na procházce k Ferdinandovu prameni.',
      ru: 'Источник нижней части города: его павильон в Ушовицах любим местными жителями, которые приходят сюда наполнять бутылки. Освежающая, легко пьющаяся вода — идеальная остановка по пути к источнику Фердинанда.',
    },
  },
]

export const springIndicationOrder: SpringIndication[] = [
  'digestion',
  'metabolism',
  'kidneys',
  'respiratory',
  'blood',
  'bones',
  'heart',
]
export const springLocationOrder: SpringLocation[] = ['colonnade', 'town', 'forest']
