export interface Hotel {
  slug: string
  name: string
  stars: number
  yearBuilt: number
  style: string
  bookingUrl: string
  address: string
  features: {
    de: string[]
    en: string[]
  }
  description: {
    de: string
    en: string
  }
  treatments: {
    de: string[]
    en: string[]
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
    address: 'Reitenbergerova 53, 353 01 Mariánské Lázně, Czech Republic',
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
    address: 'Goethovo náměstí 1, 353 01 Mariánské Lázně, Czech Republic',
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
    address: 'Goethovo náměstí 7, 353 01 Mariánské Lázně, Czech Republic',
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
    address: 'Hlavní třída 655, 353 01 Mariánské Lázně, Czech Republic',
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
    address: 'Hlavní třída 630, 353 01 Mariánské Lázně, Czech Republic',
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
    },
  },
]

export function getHotelBySlug(slug: string): Hotel | undefined {
  return hotels.find((h) => h.slug === slug)
}
