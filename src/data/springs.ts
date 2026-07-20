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
}

export const springs: Spring[] = [
  {
    id: 'krizovy',
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
      de: 'Die Quelle, die der Stadt den Namen gab — getrunken wird sie nicht: Sie liefert das „Mariengas“, fast reines vulkanisches Kohlendioxid. In Trockenbädern und Gasinjektionen fördert es die Durchblutung und entlastet Herz und Kreislauf; die Anwendung gibt es exklusiv in den Kurhäusern.',
      en: 'The spring that gave the town its name — and one you do not drink: it yields “Maria’s gas”, almost pure volcanic carbon dioxide. Used in dry baths and gas injections, it boosts circulation and eases the heart; the treatment is exclusive to the spa houses.',
      cs: 'Pramen, který dal městu jméno — a který se nepije: dodává „Mariin plyn“, téměř čistý sopečný oxid uhličitý. V suchých koupelích a plynových injekcích podporuje prokrvení a odlehčuje srdci a cévám; procedura je výsadou zdejších lázeňských domů.',
      ru: 'Источник, давший городу имя, — и его не пьют: он даёт «газ Марии», почти чистый вулканический углекислый газ. В сухих ваннах и газовых инъекциях он улучшает кровообращение и разгружает сердце; процедура — привилегия местных курортных домов.',
    },
  },
  {
    id: 'farska',
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
