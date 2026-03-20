export interface Hotel {
  slug: string
  name: string
  stars: number
  yearBuilt: number
  style: string
  bookingUrl: string
  bookingUrls: {
    de: string
    en: string
    cs: string
    ru: string
  }
  address: string
  tagline: {
    de: string
    en: string
    cs: string
    ru: string
  }
  features: {
    de: string[]
    en: string[]
    cs?: string[]
    ru?: string[]
  }
  description: {
    de: string
    en: string
    cs?: string
    ru?: string
  }
  treatments: {
    de: string[]
    en: string[]
    cs?: string[]
    ru?: string[]
  }
}

export const hotels: Hotel[] = [
  {
    slug: 'nove-lazne',
    name: 'Nové Lázně Ensana Health Spa Hotel',
    stars: 5,
    yearBuilt: 1896,
    style: 'Neorenaissance',
    bookingUrl: 'https://www.ensanahotels.com/nove-lazne',
    bookingUrls: {
      de: 'https://ensanahotels.com/de/hotels/nove-lazne',
      en: 'https://ensanahotels.com/en/hotels/nove-lazne',
      cs: 'https://ensanahotels.com/cs/hotely/nove-lazne',
      ru: 'https://ensanahotels.com/ru/oteli/nove-lazne',
    },
    address: 'Reitenbergerova 53, 353 01 Mariánské Lázně, Czech Republic',
    tagline: {
      de: 'Das legendäre 5-Sterne-Kurhotel mit dem einzigen Römischen Bad Mitteleuropas',
      en: 'The legendary 5-star spa hotel with Central Europe\'s only Roman Bath',
      cs: 'Legendární 5hvězdičkový lázeňský hotel s jedinými Římskými lázněmi ve střední Evropě',
      ru: 'Легендарный 5-звёздочный курортный отель с единственными Римскими банями в Центральной Европе',
    },
    features: {
      de: [
        'Einzigartiges Römisches Bad im Originalzustand von 1896',
        'Königliches Kabinenbad im historischen Ambiente',
        'Direkter Zugang zur Kolonnade und zum Křížový pramen',
        'Umfangreiches Balneologie-Zentrum mit über 60 Behandlungen',
        'Eleganter Speisesaal mit Halbpension und Diätküche',
        'Beheizter Innenpool mit Panoramablick auf den Kurpark',
        'Exklusiver Spa-Bereich mit finnischer Sauna und Dampfbad',
        'Historische Bibliothek und Musiksalon',
      ],
      en: [
        'Unique Roman Bath preserved in its original 1896 condition',
        'Royal Cabin Bath in a historic setting',
        'Direct access to the Colonnade and Křížový pramen spring',
        'Extensive balneology center with over 60 treatments',
        'Elegant dining hall with half-board and dietary cuisine',
        'Heated indoor pool with panoramic views of the spa park',
        'Exclusive spa area with Finnish sauna and steam bath',
        'Historic library and music salon',
      ],
    },
    description: {
      de: `Das Nové Lázně ist das Flaggschiff unter den Ensana Hotels in Marienbad und eines der bedeutendsten Kurhotels Europas. Das im Jahr 1896 im neorenaissance Stil erbaute Haus verbindet auf einzigartige Weise historische Pracht mit modernem medizinischem Know-how. Herzstück des Hotels ist das legendäre Römische Bad, das als einziges seiner Art in Mitteleuropa im Originalzustand erhalten geblieben ist. Unter kunstvoll verzierten Gewölbedecken und umgeben von handbemalten Fliesen erleben Gäste hier Baderituale, die einst dem europäischen Adel vorbehalten waren.

Das Hotel liegt direkt an der Kolonnade, nur wenige Schritte vom berühmten Křížový pramen entfernt. Diese zentrale Lage ermöglicht es Gästen, die heilenden Mineralquellen Marienbads bequem in ihren Alltag zu integrieren. Das hauseigene Balneologie-Zentrum bietet über 60 verschiedene Behandlungen an, darunter CO2-Bäder, Mineralbäder, Moorpackungen, Paraffinwickel und Unterwassermassagen — alle unter ärztlicher Aufsicht und individuell auf die Bedürfnisse jedes Gastes abgestimmt.

Die 97 großzügig geschnittenen Zimmer und Suiten verbinden historischen Charme mit zeitgemäßem Komfort. Viele bieten einen herrlichen Blick auf den Kurpark oder die Kolonnade. Der elegante Speisesaal serviert eine ausgewogene Küche, die traditionelle böhmische Rezepte mit modernen Ernährungskonzepten vereint. Ob zur klassischen Trinkkur, zur medizinischen Rehabilitation oder als luxuriöser Wellness-Aufenthalt — das Nové Lázně bietet ein Kurerlebnis auf höchstem Niveau, das in Europa seinesgleichen sucht.`,
      en: `Nové Lázně is the flagship of Ensana's hotels in Marienbad and one of the most distinguished spa hotels in Europe. Built in 1896 in the Neo-Renaissance style, this remarkable property uniquely combines historical grandeur with modern medical expertise. At the heart of the hotel lies the legendary Roman Bath, the only one of its kind in Central Europe to have been preserved in its original condition. Beneath ornately decorated vaulted ceilings and surrounded by hand-painted tiles, guests experience bathing rituals that were once reserved for European royalty.

The hotel is situated directly on the Colonnade, just steps from the famous Křížový pramen spring. This central location allows guests to seamlessly integrate the healing mineral springs of Marienbad into their daily routine. The in-house balneology center offers over 60 different treatments, including CO2 baths, mineral baths, peat wraps, paraffin wraps, and underwater massages — all supervised by physicians and individually tailored to each guest's needs.

The 97 spacious rooms and suites blend historic charm with contemporary comfort. Many offer stunning views of the spa park or the Colonnade. The elegant dining hall serves a balanced cuisine that combines traditional Bohemian recipes with modern nutritional concepts. Whether you are visiting for a classic drinking cure, medical rehabilitation, or a luxurious wellness retreat, Nové Lázně delivers a spa experience of the highest caliber, unmatched anywhere in Europe.`,
    },
    treatments: {
      de: [
        'CO2-Bäder (Kohlensäurebäder)',
        'Mineralbäder mit natürlichem Quellwasser',
        'Moorpackungen und Moorumschläge',
        'Paraffinwickel für Gelenke',
        'Unterwassermassagen',
        'Klassische Massagen und Lymphdrainage',
        'Inhalationstherapie',
        'Trinkkur mit ärztlicher Beratung',
        'Elektrotherapie und Magnetfeldtherapie',
        'Römisches Bad — historisches Baderitual',
      ],
      en: [
        'CO2 baths (carbon dioxide baths)',
        'Mineral baths with natural spring water',
        'Peat wraps and peat compresses',
        'Paraffin wraps for joints',
        'Underwater massages',
        'Classic massages and lymphatic drainage',
        'Inhalation therapy',
        'Drinking cure with medical consultation',
        'Electrotherapy and magnetic field therapy',
        'Roman Bath — historic bathing ritual',
      ],
    },
  },
  {
    slug: 'centralni-lazne',
    name: 'Centrální Lázně Ensana Health Spa Hotel',
    stars: 4,
    yearBuilt: 1812,
    style: 'Klassizismus',
    bookingUrl: 'https://www.ensanahotels.com/centralni-lazne',
    bookingUrls: {
      de: 'https://ensanahotels.com/de/hotels/centralni-lazne',
      en: 'https://ensanahotels.com/en/hotels/centralni-lazne',
      cs: 'https://ensanahotels.com/cs/hotely/centralni-lazne',
      ru: 'https://ensanahotels.com/ru/oteli/centralni-lazne',
    },
    address: 'Goethovo náměstí 1, 353 01 Mariánské Lázně, Czech Republic',
    tagline: {
      de: 'Das traditionsreichste Kurhaus direkt am Goetheplatz seit 1812',
      en: 'The most historically significant spa house on Goethe Square since 1812',
      cs: 'Nejtradičnější lázeňský dům přímo na Goethově náměstí od roku 1812',
      ru: 'Самый исторический курортный дом на площади Гёте с 1812 года',
    },
    features: {
      de: [
        'Zentrale Lage direkt am Goetheplatz',
        'Modernes Wellness- und Balneologie-Zentrum',
        'Großzügiger Innenpool mit Whirlpool-Bereich',
        'Direkter Zugang zu den Mineralquellen der Kolonnade',
        'Umfassendes medizinisches Diagnosezentrum',
        'Elegantes Restaurant mit Kurküche',
        'Fitnessraum und Yogaraum',
        'Historische Fassade mit modernem Interieur',
      ],
      en: [
        'Central location directly on Goethe Square',
        'Modern wellness and balneology center',
        'Spacious indoor pool with whirlpool area',
        'Direct access to the Colonnade mineral springs',
        'Comprehensive medical diagnostic center',
        'Elegant restaurant with spa cuisine',
        'Fitness room and yoga studio',
        'Historic facade with modern interior',
      ],
    },
    description: {
      de: `Das Centrální Lázně ist das traditionsreichste Kurhaus Marienbads und blickt auf eine Geschichte zurück, die bis ins Jahr 1812 reicht. Direkt am Goetheplatz gelegen — dort, wo Johann Wolfgang von Goethe einst selbst die Heilquellen aufsuchte — verbindet dieses Vier-Sterne-Hotel klassizistische Eleganz mit einem der modernsten Wellness-Zentren der Region. Die zentrale Lage macht es zum idealen Ausgangspunkt, um die Kolonnade, die Singenden Fontänen und die historische Altstadt zu Fuß zu erkunden.

Das Herzstück des Hotels ist sein großzügiges Balneologie- und Wellness-Zentrum, das auf über 2.000 Quadratmetern modernste Behandlungsräume, einen Innenpool mit Whirlpool und einen vollständig ausgestatteten Fitnessbereich bietet. Das medizinische Team unter ärztlicher Leitung erstellt für jeden Gast einen individuellen Behandlungsplan, der auf einer gründlichen Eingangsuntersuchung basiert. Von klassischen Kuranwendungen wie Mineralbädern und Moorpackungen bis hin zu modernen physiotherapeutischen Verfahren deckt das Angebot das gesamte Spektrum der Kurmedizin ab.

Die 130 komfortablen Zimmer wurden in den letzten Jahren behutsam renoviert und verbinden zeitgenössisches Design mit dem historischen Charakter des Gebäudes. Das hoteleigene Restaurant serviert eine ausgewogene Kurküche, die schmackhaft und gesundheitsbewusst zugleich ist. Für Gäste, die einen medizinisch betreuten Kuraufenthalt mit dem Komfort eines modernen Hotels verbinden möchten, ist das Centrální Lázně eine ausgezeichnete Wahl — es vereint die Tradition der böhmischen Bäderkultur mit den Ansprüchen des 21. Jahrhunderts.`,
      en: `Centrální Lázně is the most historically significant spa house in Marienbad, with a heritage stretching back to 1812. Located directly on Goethe Square — where Johann Wolfgang von Goethe himself once sought the healing springs — this four-star hotel combines classical elegance with one of the most modern wellness centers in the region. Its central location makes it the ideal starting point for exploring the Colonnade, the Singing Fountains, and the historic old town on foot.

At the heart of the hotel is its expansive balneology and wellness center, which spans over 2,000 square meters and features state-of-the-art treatment rooms, an indoor pool with whirlpool, and a fully equipped fitness area. The medical team, led by qualified physicians, creates an individual treatment plan for each guest based on a thorough initial examination. From classic spa treatments such as mineral baths and peat wraps to modern physiotherapy procedures, the offerings cover the full spectrum of spa medicine.

The 130 comfortable rooms have been carefully renovated in recent years, blending contemporary design with the historic character of the building. The hotel's restaurant serves a balanced spa cuisine that is both flavorful and health-conscious. For guests who wish to combine a medically supervised spa stay with the comfort of a modern hotel, Centrální Lázně is an excellent choice — it unites the tradition of Bohemian spa culture with the standards of the 21st century.`,
    },
    treatments: {
      de: [
        'CO2-Bäder (Kohlensäurebäder)',
        'Mineralbäder und Perlbäder',
        'Moorpackungen',
        'Klassische und Reflexzonenmassage',
        'Unterwassermassage',
        'Sauerstofftherapie',
        'Inhalationstherapie',
        'Trinkkur unter ärztlicher Aufsicht',
        'Elektrotherapie',
        'Physiotherapie und Bewegungstherapie',
      ],
      en: [
        'CO2 baths (carbon dioxide baths)',
        'Mineral baths and pearl baths',
        'Peat wraps',
        'Classic and reflexology massage',
        'Underwater massage',
        'Oxygen therapy',
        'Inhalation therapy',
        'Drinking cure under medical supervision',
        'Electrotherapy',
        'Physiotherapy and exercise therapy',
      ],
    },
  },
  {
    slug: 'hvezda',
    name: 'Hvězda Ensana Health Spa Hotel',
    stars: 4,
    yearBuilt: 1905,
    style: 'Jugendstil (Art Nouveau)',
    bookingUrl: 'https://www.ensanahotels.com/hvezda',
    bookingUrls: {
      de: 'https://ensanahotels.com/de/hotels/hvezda',
      en: 'https://ensanahotels.com/en/hotels/hvezda',
      cs: 'https://ensanahotels.com/cs/hotely/hvezda',
      ru: 'https://ensanahotels.com/ru/oteli/hvezda',
    },
    address: 'Goethovo náměstí 7, 353 01 Mariánské Lázně, Czech Republic',
    tagline: {
      de: 'Jugendstil-Juwel am Goetheplatz mit Zugang zum Spa des Imperial',
      en: 'Art Nouveau gem on Goethe Square with access to the Imperial spa',
      cs: 'Secesní klenot na Goethově náměstí s přístupem do spa hotelu Imperial',
      ru: 'Жемчужина модерна на площади Гёте с доступом в спа-центр отеля Imperial',
    },
    features: {
      de: [
        'Prachtvolle Jugendstil-Architektur von 1905',
        'Verbindungsgang zum Schwesterhotel Imperial',
        'Gemeinsamer Spa- und Wellnessbereich mit dem Imperial',
        'Lage am Goetheplatz mit Blick auf die Kolonnade',
        'Gemütliche Lobby-Bar im historischen Ambiente',
        'Restaurant mit böhmischer und internationaler Küche',
        'Aufzug und barrierefreie Zimmer verfügbar',
        'Concierge-Service für Ausflüge und Transfers',
      ],
      en: [
        'Magnificent Art Nouveau architecture from 1905',
        'Connecting passage to sister hotel Imperial',
        'Shared spa and wellness area with Hotel Imperial',
        'Location on Goethe Square overlooking the Colonnade',
        'Cozy lobby bar in a historic setting',
        'Restaurant with Bohemian and international cuisine',
        'Elevator and accessible rooms available',
        'Concierge service for excursions and transfers',
      ],
    },
    description: {
      de: `Das Hotel Hvězda ist ein Juwel des Jugendstils und zählt zu den architektonisch beeindruckendsten Hotels Marienbads. Seit seiner Eröffnung im Jahr 1905 empfängt es Gäste in einem Ambiente, das die Eleganz der Belle Époque in jedem Detail spürbar macht — von den geschwungenen Fassadenelementen über die kunstvollen Stuckdecken bis hin zu den großzügigen Fensterfronten, die das Gebäude in natürliches Licht tauchen.

Eine Besonderheit des Hvězda ist die direkte Verbindung zum benachbarten Hotel Imperial über einen eleganten Innengang. Gäste des Hvězda haben dadurch uneingeschränkten Zugang zum gemeinsamen Spa- und Wellnessbereich, der zu den größten der Stadt zählt. Dieser umfasst einen Innenpool, verschiedene Saunen, Dampfbäder und ein vollständiges Balneologie-Zentrum mit einem breiten Spektrum an Kuranwendungen. Die Zusammenarbeit beider Häuser ermöglicht ein besonders vielfältiges Angebot, ohne dass Gäste auf die persönliche Atmosphäre eines mittelgroßen Hotels verzichten müssen.

Die 120 Zimmer des Hvězda sind geschmackvoll eingerichtet und verbinden Jugendstil-Charme mit modernem Komfort. Viele Zimmer bieten Blick auf den Goetheplatz oder den Kurpark. Das hauseigene Restaurant serviert sowohl traditionelle böhmische Spezialitäten als auch internationale Gerichte, stets mit einem Fokus auf frische, regionale Zutaten. Die Lage am Goetheplatz, nur einen kurzen Spaziergang von der Kolonnade und den wichtigsten Mineralquellen entfernt, macht das Hvězda zu einer hervorragenden Wahl für alle, die Jugendstil-Flair, medizinische Kur und Stadtnähe vereinen möchten.`,
      en: `Hotel Hvězda is an Art Nouveau gem and one of the most architecturally striking hotels in Marienbad. Since its opening in 1905, it has welcomed guests in an ambiance that makes the elegance of the Belle Époque palpable in every detail — from the sweeping facade elements and ornate stucco ceilings to the generous window fronts that bathe the building in natural light.

A distinctive feature of the Hvězda is its direct connection to the neighboring Hotel Imperial through an elegant indoor passage. Guests of the Hvězda thus enjoy unrestricted access to the shared spa and wellness area, which is among the largest in the city. This includes an indoor pool, various saunas, steam baths, and a complete balneology center offering a wide range of spa treatments. The collaboration between the two properties provides an exceptionally diverse range of services while preserving the intimate atmosphere of a mid-sized hotel.

The 120 rooms of the Hvězda are tastefully furnished, blending Art Nouveau charm with modern comfort. Many rooms offer views of Goethe Square or the spa park. The in-house restaurant serves both traditional Bohemian specialties and international dishes, always with a focus on fresh, regional ingredients. Its location on Goethe Square, just a short walk from the Colonnade and the most important mineral springs, makes the Hvězda an outstanding choice for those who want to combine Art Nouveau flair, medical spa treatments, and proximity to the town center.`,
    },
    treatments: {
      de: [
        'CO2-Bäder (Kohlensäurebäder)',
        'Mineralbäder',
        'Moorpackungen und Naturmoorumschläge',
        'Klassische Massage und Aromamassage',
        'Unterwassermassage',
        'Inhalationstherapie',
        'Trinkkur',
        'Pneumopunktur',
        'Magnetfeldtherapie',
        'Physiotherapie und Gruppengymnastik',
      ],
      en: [
        'CO2 baths (carbon dioxide baths)',
        'Mineral baths',
        'Peat wraps and natural peat compresses',
        'Classic massage and aroma massage',
        'Underwater massage',
        'Inhalation therapy',
        'Drinking cure',
        'Pneumopuncture',
        'Magnetic field therapy',
        'Physiotherapy and group gymnastics',
      ],
    },
  },
  {
    slug: 'butterfly',
    name: 'Butterfly Ensana Health Spa Hotel',
    stars: 4,
    yearBuilt: 2003,
    style: 'Moderne',
    bookingUrl: 'https://www.ensanahotels.com/butterfly',
    bookingUrls: {
      de: 'https://ensanahotels.com/de/hotels/butterfly',
      en: 'https://ensanahotels.com/en/hotels/butterfly',
      cs: 'https://ensanahotels.com/cs/hotely/butterfly',
      ru: 'https://ensanahotels.com/ru/oteli/butterfly',
    },
    address: 'Hlavní třída 655, 353 01 Mariánské Lázně, Czech Republic',
    tagline: {
      de: 'Modernes 4-Sterne-Hotel — familienfreundlich mit Kinderbetreuung',
      en: 'Modern 4-star hotel — family-friendly with childcare',
      cs: 'Moderní 4hvězdičkový hotel — přátelský k rodinám s hlídáním dětí',
      ru: 'Современный 4-звёздочный отель — для семей с присмотром за детьми',
    },
    features: {
      de: [
        'Modernes Design mit lichtdurchflutetem Atrium',
        'Familienfreundlich mit Kinderbetreuung und Spielbereich',
        'Großzügiger Wellnessbereich mit Innenpool und Saunawelt',
        'Lage an der Hauptpromenade nahe der Kolonnade',
        'Barrierefreie Zimmer und Einrichtungen',
        'Restaurant mit Buffet und Live-Cooking-Station',
        'Fahrradverleih und organisierte Wanderungen',
        'Moderne Behandlungsräume mit neuester Technik',
      ],
      en: [
        'Modern design with light-filled atrium',
        'Family-friendly with childcare and play area',
        'Spacious wellness area with indoor pool and sauna world',
        'Located on the main promenade near the Colonnade',
        'Accessible rooms and facilities',
        'Restaurant with buffet and live cooking station',
        'Bicycle rental and organized hiking tours',
        'Modern treatment rooms with latest equipment',
      ],
    },
    description: {
      de: `Das Butterfly ist das modernste der Ensana Hotels in Marienbad und wurde im Jahr 2003 erbaut, um eine neue Generation von Kurgästen anzusprechen. Mit seinem markanten, zeitgenössischen Design — geprägt von einem lichtdurchfluteten Atrium, klaren Linien und großzügigen Glasfronten — setzt es einen bewussten Kontrast zu den historischen Häusern der Stadt, ohne dabei auf den Kern der Marienbader Kurtradition zu verzichten.

Besonders hervorzuheben ist die Familienfreundlichkeit des Hotels. Als einziges Ensana-Haus in Marienbad bietet das Butterfly eine professionelle Kinderbetreuung und einen Spielbereich, sodass Eltern ihre Kuranwendungen in Ruhe genießen können, während die Kinder bestens versorgt sind. Der großzügige Wellnessbereich erstreckt sich über zwei Etagen und umfasst einen Innenpool, eine Saunawelt mit verschiedenen Aufgüssen, Dampfbäder und Ruhebereiche mit Blick auf den Kurpark.

Die 120 Zimmer des Butterfly sind hell, geräumig und funktional gestaltet — ideal für Familien und Gäste, die Wert auf zeitgemäßen Komfort legen. Viele Zimmer sind barrierefrei zugänglich. Das Restaurant überrascht mit einem abwechslungsreichen Buffet und einer Live-Cooking-Station, an der Köche frische Gerichte vor den Augen der Gäste zubereiten. Die Lage an der Hauptpromenade ermöglicht kurze Wege zur Kolonnade und zu den Mineralquellen. Für alle, die einen medizinisch fundierten Kuraufenthalt in modernem Ambiente suchen und vielleicht mit der ganzen Familie anreisen, ist das Butterfly die perfekte Wahl.`,
      en: `The Butterfly is the most modern of Ensana's hotels in Marienbad, built in 2003 to appeal to a new generation of spa guests. With its distinctive contemporary design — characterized by a light-filled atrium, clean lines, and generous glass facades — it provides a deliberate contrast to the city's historic properties while staying true to the core of Marienbad's spa tradition.

Particularly noteworthy is the hotel's family-friendliness. As the only Ensana property in Marienbad offering professional childcare and a dedicated play area, the Butterfly allows parents to enjoy their spa treatments in peace while children are well looked after. The spacious wellness area spans two floors and includes an indoor pool, a sauna world with various infusions, steam baths, and relaxation areas with views of the spa park.

The 120 rooms of the Butterfly are bright, spacious, and functionally designed — ideal for families and guests who value contemporary comfort. Many rooms are fully accessible. The restaurant impresses with a varied buffet and a live cooking station where chefs prepare fresh dishes in front of guests. Its location on the main promenade allows for short walks to the Colonnade and the mineral springs. For anyone seeking a medically grounded spa stay in a modern setting, perhaps traveling with the whole family, the Butterfly is the perfect choice.`,
    },
    treatments: {
      de: [
        'CO2-Bäder (Kohlensäurebäder)',
        'Mineralbäder',
        'Moorpackungen',
        'Klassische Massage und Hot-Stone-Massage',
        'Unterwassermassage',
        'Inhalationstherapie',
        'Trinkkur',
        'Kryotherapie',
        'Elektrotherapie und Ultraschalltherapie',
        'Physiotherapie und Aquagymnastik',
      ],
      en: [
        'CO2 baths (carbon dioxide baths)',
        'Mineral baths',
        'Peat wraps',
        'Classic massage and hot stone massage',
        'Underwater massage',
        'Inhalation therapy',
        'Drinking cure',
        'Cryotherapy',
        'Electrotherapy and ultrasound therapy',
        'Physiotherapy and aqua gymnastics',
      ],
    },
  },
  {
    slug: 'splendid',
    name: 'Splendid Ensana Health Spa Hotel',
    stars: 3,
    yearBuilt: 1888,
    style: 'Neoklassizismus',
    bookingUrl: 'https://www.ensanahotels.com/splendid',
    bookingUrls: {
      de: 'https://ensanahotels.com/de/hotels/splendid',
      en: 'https://ensanahotels.com/en/hotels/splendid',
      cs: 'https://ensanahotels.com/cs/hotely/splendid',
      ru: 'https://ensanahotels.com/ru/oteli/splendid',
    },
    address: 'Hlavní třída 630, 353 01 Mariánské Lázně, Czech Republic',
    tagline: {
      de: 'Gemütliches 3-Sterne-Haus mit Zugang zum Spa des Centrální Lázně',
      en: 'Cozy 3-star hotel with access to Centrální Lázně spa facilities',
      cs: 'Útulný 3hvězdičkový hotel s přístupem do spa Centrálních Lázní',
      ru: 'Уютный 3-звёздочный отель с доступом в спа-центр Центральных Лазней',
    },
    features: {
      de: [
        'Hervorragendes Preis-Leistungs-Verhältnis',
        'Zugang zum Spa-Bereich des Centrální Lázně',
        'Ruhige Lage mit Blick auf den Kurpark',
        'Gemütliches Restaurant mit Halb- oder Vollpension',
        'Kurze Wege zur Kolonnade und den Mineralquellen',
        'Ideal für längere Kuraufenthalte',
        'Freundliches, persönliches Service-Team',
        'Aufenthaltsraum mit Bibliothek und Gesellschaftsspielen',
      ],
      en: [
        'Excellent value for money',
        'Access to the spa facilities at Centrální Lázně',
        'Quiet location with views of the spa park',
        'Cozy restaurant with half-board or full-board options',
        'Short walks to the Colonnade and mineral springs',
        'Ideal for extended spa stays',
        'Friendly, personalized service team',
        'Lounge with library and board games',
      ],
    },
    description: {
      de: `Das Splendid ist das gastfreundliche Drei-Sterne-Haus unter den Ensana Hotels in Marienbad und bietet ein hervorragendes Preis-Leistungs-Verhältnis für Gäste, die die heilenden Quellen der Stadt genießen möchten, ohne auf professionelle medizinische Betreuung zu verzichten. Das im Jahr 1888 im neoklassizistischen Stil erbaute Hotel besticht durch seinen charmanten, ungezwungenen Charakter und eine ruhige Lage mit Blick auf den Kurpark.

Ein besonderer Vorteil des Splendid ist der vollständige Zugang zum Spa- und Balneologie-Zentrum des nahegelegenen Centrální Lázně. Gäste genießen somit das gesamte Behandlungsspektrum eines Vier-Sterne-Hauses — von CO2-Bädern und Moorpackungen bis hin zu Unterwassermassagen und Physiotherapie — zu einem deutlich günstigeren Zimmerpreis. Dieser einzigartige Vorteil macht das Splendid besonders attraktiv für Gäste, die einen längeren Kuraufenthalt planen und dabei ihr Budget im Blick behalten möchten.

Die 71 Zimmer sind komfortabel und zweckmäßig eingerichtet. Sie bieten alles, was man für einen erholsamen Aufenthalt benötigt, darunter kostenfreies WLAN, Sat-TV und ein eigenes Badezimmer. Das gemütliche Restaurant serviert eine schmackhafte Kurküche mit Halb- oder Vollpensionsoption. Die Atmosphäre im Splendid ist familiär und persönlich — viele Stammgäste schätzen gerade diese herzliche Art, die in größeren Hotels oft verloren geht. Für preisbewusste Kurgäste, die Wert auf echte Marienbader Kurtradition, medizinische Qualität und eine persönliche Atmosphäre legen, ist das Splendid die ideale Adresse.`,
      en: `The Splendid is the welcoming three-star property among Ensana's hotels in Marienbad, offering excellent value for money for guests who wish to enjoy the city's healing springs without forgoing professional medical care. Built in 1888 in the Neoclassical style, the hotel charms with its relaxed character and quiet location overlooking the spa park.

A distinctive advantage of the Splendid is full access to the spa and balneology center at the nearby Centrální Lázně. Guests thus enjoy the complete treatment spectrum of a four-star hotel — from CO2 baths and peat wraps to underwater massages and physiotherapy — at a significantly lower room rate. This unique benefit makes the Splendid especially attractive for guests planning an extended spa stay while keeping an eye on their budget.

The 71 rooms are comfortable and practically furnished, providing everything needed for a restful stay, including complimentary Wi-Fi, satellite TV, and an en-suite bathroom. The cozy restaurant serves a flavorful spa cuisine with half-board or full-board options. The atmosphere at the Splendid is familiar and personal — many returning guests particularly appreciate this warmth, which is often lost in larger hotels. For budget-conscious spa guests who value authentic Marienbad spa tradition, medical quality, and a personal atmosphere, the Splendid is the ideal address.`,
    },
    treatments: {
      de: [
        'CO2-Bäder (im Centrální Lázně)',
        'Mineralbäder (im Centrální Lázně)',
        'Moorpackungen',
        'Klassische Massage',
        'Unterwassermassage',
        'Inhalationstherapie',
        'Trinkkur',
        'Elektrotherapie',
        'Magnetfeldtherapie',
        'Physiotherapie und Gehtraining',
      ],
      en: [
        'CO2 baths (at Centrální Lázně)',
        'Mineral baths (at Centrální Lázně)',
        'Peat wraps',
        'Classic massage',
        'Underwater massage',
        'Inhalation therapy',
        'Drinking cure',
        'Electrotherapy',
        'Magnetic field therapy',
        'Physiotherapy and walking training',
      ],
      cs: [
        'CO2 koupele (v Centrálních Lázních)',
        'Minerální koupele (v Centrálních Lázních)',
        'Rašelinové zábaly',
        'Klasická masáž',
        'Podvodní masáž',
        'Inhalační terapie',
        'Pitná kúra',
        'Elektroterapie',
        'Magnetoterapie',
        'Fyzioterapie a nácvik chůze',
      ],
      ru: [
        'CO2-ванны (в Центральных Лазнях)',
        'Минеральные ванны (в Центральных Лазнях)',
        'Торфяные обёртывания',
        'Классический массаж',
        'Подводный массаж',
        'Ингаляционная терапия',
        'Питьевой курс',
        'Электротерапия',
        'Магнитотерапия',
        'Физиотерапия и тренировка ходьбы',
      ],
    },
  },
  {
    slug: 'pacifik',
    name: 'Pacifik Ensana Health Spa Hotel',
    stars: 4,
    yearBuilt: 1906,
    style: 'Neobarock',
    bookingUrl: 'https://www.ensanahotels.com/pacifik',
    bookingUrls: {
      de: 'https://ensanahotels.com/de/hotels/pacifik',
      en: 'https://ensanahotels.com/en/hotels/pacifik',
      cs: 'https://ensanahotels.com/cs/hotely/pacifik',
      ru: 'https://ensanahotels.com/ru/oteli/pacifik',
    },
    address: 'Mírové náměstí 84, 353 01 Mariánské Lázně, Czech Republic',
    tagline: {
      de: 'Elegantes 4-Sterne-Kurhotel im neobarocken Stil am Mírové náměstí',
      en: 'Elegant 4-star spa hotel in Neo-Baroque style on Mírové Square',
      cs: 'Elegantní 4hvězdičkový lázeňský hotel v neobarokním stylu na Mírovém náměstí',
      ru: 'Элегантный 4-звёздочный курортный отель в необарочном стиле на площади Мира',
    },
    features: {
      de: [
        'Neobarocke Architektur von 1906',
        'Eigenes Balneologie-Zentrum mit modernen Behandlungsräumen',
        'Innenpool und Saunabereich',
        'Zentrale Lage am Mírové náměstí',
        'Restaurant mit Kurküche und Diätoptionen',
        'Blick auf den Kurpark und die umliegenden Wälder',
        'Fitnessraum und Aufenthaltsräume',
        'Idealer Ausgangspunkt für Wanderungen im Slavkovský les',
      ],
      en: [
        'Neo-Baroque architecture from 1906',
        'In-house balneology center with modern treatment rooms',
        'Indoor pool and sauna area',
        'Central location on Mírové Square',
        'Restaurant with spa cuisine and dietary options',
        'Views of the spa park and surrounding forests',
        'Fitness room and lounges',
        'Ideal starting point for hikes in the Slavkov Forest',
      ],
      cs: [
        'Neobarokní architektura z roku 1906',
        'Vlastní balneologické centrum s moderními procedurálními místnostmi',
        'Vnitřní bazén a saunový svět',
        'Centrální poloha na Mírovém náměstí',
        'Restaurace s lázeňskou kuchyní a dietními možnostmi',
        'Výhled na lázeňský park a okolní lesy',
        'Posilovna a společenské místnosti',
        'Ideální výchozí bod pro túry ve Slavkovském lese',
      ],
      ru: [
        'Необарочная архитектура 1906 года',
        'Собственный бальнеологический центр с современными процедурными кабинетами',
        'Крытый бассейн и сауна',
        'Центральное расположение на площади Мира',
        'Ресторан с курортной кухней и диетическими блюдами',
        'Вид на курортный парк и окрестные леса',
        'Фитнес-зал и гостиные',
        'Отличная отправная точка для прогулок по Славковскому лесу',
      ],
    },
    description: {
      de: `Das Pacifik ist ein elegantes Vier-Sterne-Kurhotel im neobarocken Stil, das seit 1906 Gäste in Marienbad empfängt. Direkt am Mírové náměstí gelegen, verbindet es historische Architektur mit einem modernen Balneologie-Zentrum, das ein breites Spektrum an Kuranwendungen bietet — von CO2-Bädern und Moorpackungen bis hin zu Massagen und Elektrotherapie. Das hauseigene medizinische Team erstellt für jeden Gast einen individuellen Behandlungsplan. Mit seinem Innenpool, dem Saunabereich und dem Restaurant mit ausgewogener Kurküche bietet das Pacifik alles für einen erholsamen Kuraufenthalt in komfortablem Ambiente.`,
      en: `The Pacifik is an elegant four-star spa hotel in Neo-Baroque style that has been welcoming guests to Marienbad since 1906. Located directly on Mírové Square, it combines historic architecture with a modern balneology center offering a wide range of spa treatments — from CO2 baths and peat wraps to massages and electrotherapy. The in-house medical team creates an individual treatment plan for each guest. With its indoor pool, sauna area, and restaurant serving balanced spa cuisine, the Pacifik provides everything for a restorative spa stay in a comfortable setting.`,
      cs: `Pacifik je elegantní čtyřhvězdičkový lázeňský hotel v neobarokním stylu, který hostí návštěvníky Mariánských Lázní od roku 1906. Přímo na Mírovém náměstí spojuje historickou architekturu s moderním balneologickým centrem nabízejícím široké spektrum lázeňských procedur — od CO2 koupelí a rašelinových zábalů po masáže a elektroterapii. Lékařský tým sestaví každému hostovi individuální léčebný plán. S vnitřním bazénem, saunovým světem a restaurací s vyváženou lázeňskou kuchyní nabízí Pacifik vše pro ozdravný pobyt v komfortním prostředí.`,
      ru: `Пацифик — элегантный четырёхзвёздочный курортный отель в необарочном стиле, принимающий гостей в Марианских Лазнях с 1906 года. Расположенный на площади Мира, он сочетает историческую архитектуру с современным бальнеологическим центром, предлагающим широкий спектр процедур — от CO2-ванн и торфяных обёртываний до массажей и электротерапии. Медицинская команда составляет индивидуальный план лечения для каждого гостя.`,
    },
    treatments: {
      de: [
        'CO2-Bäder (Kohlensäurebäder)',
        'Mineralbäder',
        'Moorpackungen',
        'Klassische Massage und Reflexzonenmassage',
        'Unterwassermassage',
        'Inhalationstherapie',
        'Trinkkur',
        'Elektrotherapie',
        'Magnetfeldtherapie',
        'Physiotherapie',
      ],
      en: [
        'CO2 baths (carbon dioxide baths)',
        'Mineral baths',
        'Peat wraps',
        'Classic massage and reflexology',
        'Underwater massage',
        'Inhalation therapy',
        'Drinking cure',
        'Electrotherapy',
        'Magnetic field therapy',
        'Physiotherapy',
      ],
      cs: [
        'CO2 koupele',
        'Minerální koupele',
        'Rašelinové zábaly',
        'Klasická masáž a reflexní masáž',
        'Podvodní masáž',
        'Inhalační terapie',
        'Pitná kúra',
        'Elektroterapie',
        'Magnetoterapie',
        'Fyzioterapie',
      ],
      ru: [
        'CO2-ванны',
        'Минеральные ванны',
        'Торфяные обёртывания',
        'Классический и рефлексологический массаж',
        'Подводный массаж',
        'Ингаляционная терапия',
        'Питьевой курс',
        'Электротерапия',
        'Магнитотерапия',
        'Физиотерапия',
      ],
    },
  },
  {
    slug: 'vltava',
    name: 'Vltava Ensana Health Spa Hotel',
    stars: 3,
    yearBuilt: 1900,
    style: 'Secese',
    bookingUrl: 'https://www.ensanahotels.com/vltava-berounka',
    bookingUrls: {
      de: 'https://ensanahotels.com/de/hotels/vltava-berounka',
      en: 'https://ensanahotels.com/en/hotels/vltava-berounka',
      cs: 'https://ensanahotels.com/cs/hotely/vltava-berounka',
      ru: 'https://ensanahotels.com/ru/oteli/vltava-berounka',
    },
    address: 'Hlavní třída 438, 353 01 Mariánské Lázně, Czech Republic',
    tagline: {
      de: 'Preisgünstiges 3-Sterne-Haus mit eigenem Kurzentrum und Verbindung zum Pacifik',
      en: 'Affordable 3-star hotel with its own spa center and connection to the Pacifik',
      cs: 'Cenově dostupný 3hvězdičkový hotel s vlastním léčebným centrem a propojením s Pacifikem',
      ru: 'Доступный 3-звёздочный отель с собственным лечебным центром и соединением с Пацификом',
    },
    features: {
      de: [
        'Verbindungsgang zum Schwesterhotel Pacifik',
        'Eigenes Kurzentrum mit Behandlungsräumen',
        'Innenpool im verbundenen Pacifik nutzbar',
        'Ruhige Lage an der Hauptpromenade',
        'Restaurant mit Halb- und Vollpension',
        'Attraktives Preis-Leistungs-Verhältnis',
        'Ideal für längere Kuraufenthalte',
        'Parkplatz am Hotel verfügbar',
      ],
      en: [
        'Connecting passage to sister hotel Pacifik',
        'In-house treatment center with spa rooms',
        'Access to indoor pool at connected Pacifik hotel',
        'Quiet location on the main promenade',
        'Restaurant with half-board and full-board',
        'Attractive value for money',
        'Ideal for extended spa stays',
        'Parking available at the hotel',
      ],
      cs: [
        'Propojení se sesterským hotelem Pacifik',
        'Vlastní léčebné centrum s procedurálními místnostmi',
        'Přístup k vnitřnímu bazénu v propojeném hotelu Pacifik',
        'Klidná poloha na hlavní promenádě',
        'Restaurace s polopenzí a plnou penzí',
        'Atraktivní poměr cena/výkon',
        'Ideální pro delší lázeňské pobyty',
        'Parkování u hotelu k dispozici',
      ],
      ru: [
        'Соединение с отелем-партнёром Пацифик',
        'Собственный лечебный центр с процедурными кабинетами',
        'Доступ к крытому бассейну в Пацифике',
        'Тихое расположение на главной променаде',
        'Ресторан с полупансионом и полным пансионом',
        'Привлекательное соотношение цены и качества',
        'Идеально для длительных курортных пребываний',
        'Парковка при отеле',
      ],
    },
    description: {
      de: `Das Vltava ist ein gastfreundliches Drei-Sterne-Kurhotel an der Hauptpromenade von Marienbad, das sich durch ein ausgezeichnetes Preis-Leistungs-Verhältnis auszeichnet. Über einen eleganten Verbindungsgang mit dem benachbarten Hotel Pacifik verbunden, profitieren Gäste von einem erweiterten Angebot an Kuranwendungen und Einrichtungen. Das eigene Kurzentrum bietet ein breites Spektrum an Behandlungen unter ärztlicher Aufsicht. Die komfortablen Zimmer und das Restaurant mit ausgewogener Kurküche machen das Vltava zur idealen Wahl für preisbewusste Kurgäste, die Wert auf medizinische Qualität legen.`,
      en: `The Vltava is a welcoming three-star spa hotel on the main promenade of Marienbad, distinguished by its excellent value for money. Connected to the neighboring Hotel Pacifik through an elegant passage, guests benefit from an extended range of spa treatments and facilities. The in-house treatment center offers a broad spectrum of therapies under medical supervision. Comfortable rooms and a restaurant serving balanced spa cuisine make the Vltava the ideal choice for budget-conscious spa guests who value medical quality.`,
      cs: `Vltava je pohostinný tříhvězdičkový lázeňský hotel na hlavní promenádě Mariánských Lázní, který se vyznačuje vynikajícím poměrem cena/výkon. Propojen elegantní chodbou se sousedním hotelem Pacifik, hosté mají přístup k rozšířenému spektru lázeňských procedur a vybavení. Vlastní léčebné centrum nabízí širokou škálu procedur pod lékařským dohledem. Komfortní pokoje a restaurace s vyváženou lázeňskou kuchyní dělají z Vltavy ideální volbu pro hosty, kteří hledají kvalitní léčbu za rozumnou cenu.`,
      ru: `Влтава — гостеприимный трёхзвёздочный курортный отель на главной променаде Марианских Лазней, отличающийся превосходным соотношением цены и качества. Соединённый с соседним отелем Пацифик элегантным переходом, гости получают доступ к расширенному спектру процедур и инфраструктуре. Собственный лечебный центр предлагает широкий выбор процедур под медицинским наблюдением.`,
    },
    treatments: {
      de: [
        'CO2-Bäder',
        'Mineralbäder',
        'Moorpackungen',
        'Klassische Massage',
        'Unterwassermassage',
        'Inhalationstherapie',
        'Trinkkur',
        'Elektrotherapie',
        'Magnetfeldtherapie',
        'Physiotherapie',
      ],
      en: [
        'CO2 baths',
        'Mineral baths',
        'Peat wraps',
        'Classic massage',
        'Underwater massage',
        'Inhalation therapy',
        'Drinking cure',
        'Electrotherapy',
        'Magnetic field therapy',
        'Physiotherapy',
      ],
      cs: [
        'CO2 koupele',
        'Minerální koupele',
        'Rašelinové zábaly',
        'Klasická masáž',
        'Podvodní masáž',
        'Inhalační terapie',
        'Pitná kúra',
        'Elektroterapie',
        'Magnetoterapie',
        'Fyzioterapie',
      ],
      ru: [
        'CO2-ванны',
        'Минеральные ванны',
        'Торфяные обёртывания',
        'Классический массаж',
        'Подводный массаж',
        'Ингаляционная терапия',
        'Питьевой курс',
        'Электротерапия',
        'Магнитотерапия',
        'Физиотерапия',
      ],
    },
  },
  {
    slug: 'svoboda',
    name: 'Svoboda Ensana Health Spa Hotel',
    stars: 3,
    yearBuilt: 1890,
    style: 'Neorenaissance',
    bookingUrl: 'https://www.ensanahotels.com/svoboda',
    bookingUrls: {
      de: 'https://ensanahotels.com/de/hotels/svoboda',
      en: 'https://ensanahotels.com/en/hotels/svoboda',
      cs: 'https://ensanahotels.com/cs/hotely/svoboda',
      ru: 'https://ensanahotels.com/ru/oteli/svoboda',
    },
    address: 'Chebská 543, 353 01 Mariánské Lázně, Czech Republic',
    tagline: {
      de: 'Ruhiges 3-Sterne-Superior-Hotel mit persönlicher Atmosphäre und Waldnähe',
      en: 'Peaceful 3-star Superior hotel with personal atmosphere near the forest',
      cs: 'Klidný 3hvězdičkový Superior hotel s osobní atmosférou poblíž lesa',
      ru: 'Спокойный 3-звёздочный Superior отель с домашней атмосферой у леса',
    },
    features: {
      de: [
        'Ruhige Lage nahe dem Slavkovský les',
        'Eigenes Kurzentrum mit Behandlungsräumen',
        'Persönliche, familiäre Atmosphäre',
        'Restaurant mit Kurküche und Diätoptionen',
        'Sonnenterrasse mit Blick auf den Park',
        'Kurze Wege zum Kurpark und zur Kolonnade',
        'Ideal für Ruhe suchende Kurgäste',
        'Kostenfreier Parkplatz',
      ],
      en: [
        'Quiet location near the Slavkov Forest',
        'In-house treatment center with spa rooms',
        'Personal, familiar atmosphere',
        'Restaurant with spa cuisine and dietary options',
        'Sun terrace with park views',
        'Short walks to the spa park and Colonnade',
        'Ideal for guests seeking tranquility',
        'Complimentary parking',
      ],
      cs: [
        'Klidná poloha poblíž Slavkovského lesa',
        'Vlastní léčebné centrum s procedurálními místnostmi',
        'Osobní, rodinná atmosféra',
        'Restaurace s lázeňskou kuchyní a dietními možnostmi',
        'Sluneční terasa s výhledem na park',
        'Krátká vzdálenost do lázeňského parku a ke Kolonádě',
        'Ideální pro hosty hledající klid',
        'Bezplatné parkování',
      ],
      ru: [
        'Тихое расположение рядом со Славковским лесом',
        'Собственный лечебный центр с процедурными кабинетами',
        'Домашняя, семейная атмосфера',
        'Ресторан с курортной кухней и диетическими блюдами',
        'Солнечная терраса с видом на парк',
        'Недалеко от курортного парка и Колоннады',
        'Идеально для гостей, ищущих спокойствие',
        'Бесплатная парковка',
      ],
    },
    description: {
      de: `Das Svoboda ist ein charmantes Drei-Sterne-Superior-Kurhotel in ruhiger Lage nahe dem Slavkovský les, das sich durch seine besonders persönliche und familiäre Atmosphäre auszeichnet. Das im Jahr 1890 erbaute Haus verbindet Neorenaissance-Architektur mit einem eigenen Kurzentrum, das ein breites Spektrum an Behandlungen unter ärztlicher Aufsicht bietet. Die Sonnenterrasse mit Parkblick und das Restaurant mit ausgewogener Kurküche schaffen ein Ambiente, das zum Verweilen einlädt. Für Kurgäste, die Ruhe, Natur und medizinische Qualität in einem unkomplizierten Rahmen suchen, ist das Svoboda die perfekte Adresse.`,
      en: `The Svoboda is a charming three-star Superior spa hotel in a quiet location near the Slavkov Forest, distinguished by its particularly personal and familiar atmosphere. Built in 1890, the Neo-Renaissance property combines period architecture with an in-house treatment center offering a broad range of therapies under medical supervision. The sun terrace with park views and the restaurant serving balanced spa cuisine create an inviting ambiance. For spa guests seeking tranquility, nature, and medical quality in an uncomplicated setting, the Svoboda is the perfect address.`,
      cs: `Svoboda je okouzlující tříhvězdičkový Superior lázeňský hotel v klidné poloze poblíž Slavkovského lesa, který se vyznačuje obzvláště osobní a rodinnou atmosférou. Hotel z roku 1890 spojuje neorenesanční architekturu s vlastním léčebným centrem nabízejícím široké spektrum procedur pod lékařským dohledem. Sluneční terasa s výhledem na park a restaurace s vyváženou lázeňskou kuchyní vytvářejí příjemné prostředí. Pro hosty hledající klid, přírodu a kvalitní léčbu je Svoboda ideální volbou.`,
      ru: `Свобода — очаровательный трёхзвёздочный Superior курортный отель в тихом месте рядом со Славковским лесом, отличающийся особенно домашней и уютной атмосферой. Построенный в 1890 году, он сочетает неоренессансную архитектуру с собственным лечебным центром, предлагающим широкий спектр процедур под медицинским наблюдением. Солнечная терраса с видом на парк и ресторан со сбалансированной курортной кухней создают уютную обстановку.`,
    },
    treatments: {
      de: [
        'CO2-Bäder',
        'Mineralbäder',
        'Moorpackungen',
        'Klassische Massage',
        'Unterwassermassage',
        'Inhalationstherapie',
        'Trinkkur',
        'Elektrotherapie',
        'Magnetfeldtherapie',
        'Physiotherapie',
      ],
      en: [
        'CO2 baths',
        'Mineral baths',
        'Peat wraps',
        'Classic massage',
        'Underwater massage',
        'Inhalation therapy',
        'Drinking cure',
        'Electrotherapy',
        'Magnetic field therapy',
        'Physiotherapy',
      ],
      cs: [
        'CO2 koupele',
        'Minerální koupele',
        'Rašelinové zábaly',
        'Klasická masáž',
        'Podvodní masáž',
        'Inhalační terapie',
        'Pitná kúra',
        'Elektroterapie',
        'Magnetoterapie',
        'Fyzioterapie',
      ],
      ru: [
        'CO2-ванны',
        'Минеральные ванны',
        'Торфяные обёртывания',
        'Классический массаж',
        'Подводный массаж',
        'Ингаляционная терапия',
        'Питьевой курс',
        'Электротерапия',
        'Магнитотерапия',
        'Физиотерапия',
      ],
    },
  },
]

export function getHotelBySlug(slug: string): Hotel | undefined {
  return hotels.find((h) => h.slug === slug)
}
