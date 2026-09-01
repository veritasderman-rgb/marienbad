import type { Locale } from '@/i18n/config'

/**
 * Obsah stránky věrnostního programu Ensana Life ve všech čtyřech jazycích.
 * Zdroj pravdy pro fakta: data/ensana_life_benefits.md (výtah z oficiálních
 * stránek Ensana). Externí odkazy vedou na lokalizované podstránky
 * ensanahotels.com — slugy ověřeny proti živému webu.
 */

export interface EnsanaLifeTier {
  key: string
  name: string
  nights: string
  nightsNote: string
  discount: string
  discountLabel: string
  perks: string[]
  featured?: boolean
}

export interface EnsanaLifeContent {
  metaTitle: string
  metaDescription: string
  urls: { register: string; login: string; terms: string; faq: string; levels: string }
  hero: {
    eyebrow: string
    subtitle: string
    /** Odstavec pod titulkem; **tučné** se vykreslí přes <strong>. */
    lead: string
    register: string
    viewTiers: string
    memberPrompt: string
    memberLink: string
  }
  highlights: { value: string; label: string; note: string }[]
  about: {
    heading: string
    p1: string
    p2: string
    boxTitle: string
    boxItems: string[]
    badgeValue: string
    badgeNote: string
    imageAlt: string
    bathAlt: string
  }
  tiers: {
    heading: string
    lead: string
    items: EnsanaLifeTier[]
    featuredLabel: string
    note: string
    tableBenefit: string
    comparison: { label: string; values: string[] }[]
    yes: string
    levelsCta: string
  }
  benefits: {
    heading: string
    lead: string
    cards: { title: string; text: string }[]
  }
  steps: {
    heading: string
    lead: string
    items: { title: string; text: string }[]
    join: string
    faq: string
  }
  conditions: {
    heading: string
    lead: string
    items: { title: string; text: string }[]
    /** Právní odstavec; {terms} nahradí odkaz na obchodní podmínky. */
    legal: string
    termsLabel: string
    contactLead: string
  }
  closing: {
    heading: string
    text: string
    register: string
    browseHotels: string
    bookingHref: string
  }
}

export const CONTACT_MAIL = 'ensana.life@ensanahotels.com'

const EN_URLS = {
  register: 'https://ensanahotels.com/en/ensana-life/registration',
  login: 'https://ensanahotels.com/en/ensana-life/login',
  terms: 'https://ensanahotels.com/en/ensana-life/terms-and-conditions',
  faq: 'https://ensanahotels.com/en/ensana-life/questions-and-answers',
  levels: 'https://ensanahotels.com/en/ensana-life/membership-levels',
}

export const ensanaLifeContent: Record<Locale, EnsanaLifeContent> = {
  cs: {
    metaTitle: 'Ensana Life — věrnostní program | Marienbad.com',
    metaDescription:
      'Ensana Life je věrnostní program hotelů Ensana. Zdarma, bez expirace a se slevou až 20 % na ubytování i na wellness, lázně a restauraci. Přehled úrovní a podmínek.',
    urls: {
      register: 'https://ensanahotels.com/cs/ensana-life/registrace',
      login: 'https://ensanahotels.com/cs/ensana-life/login',
      terms: 'https://ensanahotels.com/cs/ensana-life/obchodni-podminky',
      faq: 'https://ensanahotels.com/cs/ensana-life/otazky-a-odpovedi',
      levels: 'https://ensanahotels.com/cs/ensana-life/urovne-clenstvi',
    },
    hero: {
      eyebrow: 'Věrnostní program',
      subtitle: 'Čím déle u nás zůstanete, tím víc vám zůstane.',
      lead: 'Členství je zdarma, bez expirace a začíná okamžitě. Sleva roste s počtem odbydlených nocí až na **20 %** — a neplatí jen na pokoj, vztahuje se i na lázně, wellness, restauraci a kavárnu.',
      register: 'Zaregistrovat se zdarma',
      viewTiers: 'Prohlédnout úrovně',
      memberPrompt: 'Už jste členem?',
      memberLink: 'Přihlaste se do členské sekce',
    },
    highlights: [
      { value: 'až 20 %', label: 'sleva na ubytování', note: 'při rezervaci a platbě přímo v hotelu' },
      { value: 'až 20 %', label: 'sleva na wellness, lázně a restauraci', note: 'platí i na kavárnu a další hotelové služby' },
      { value: '0 Kč', label: 'vstupní poplatek', note: 'členství je zdarma a bez expirace' },
      { value: '7', label: 'hotelů Ensana v Mariánských Lázních', note: 'noci se sčítají napříč pobyty' },
    ],
    about: {
      heading: 'Věrnostní program, který lázeňskému hostu opravdu sedí',
      p1: 'Ensana Life odměňuje opakované pobyty slevami a dalšími výhodami. Čím víc nocí u nás odbydlíte, tím vyšší úroveň členství získáte — a tím větší sleva vám zůstane.',
      p2: 'Pro Mariánské Lázně to má jeden zásadní rozměr. **Sedm ze zdejších lázeňských hotelů patří skupině Ensana** a klasická lázeňská kúra trvá dva až tři týdny. Rozhodující počet nocí se tak nesbírá roky — často stačí jeden delší pobyt.',
      boxTitle: 'Jak rychle se postupuje výš',
      boxItems: [
        'Týdenní pobyt vás dostane na **bronzovou** úroveň.',
        'Jedna třítýdenní kúra znamená **stříbrnou** úroveň.',
        'Dvě takové kúry během dvou let už jsou **zlatá** karta.',
      ],
      badgeValue: 'bez expirace',
      badgeNote: 'Základní členství platí neomezeně.',
      imageAlt: 'Lázeňská hostka s pohárkem na kolonádě v ranním světle',
      bathAlt: 'Historická lázeňská hala s tyrkysovou minerální vodou a mramorovými sloupy',
    },
    tiers: {
      heading: 'Čtyři úrovně členství',
      lead: 'O zařazení rozhoduje součet nocí odbydlených za poslední dva roky. Úroveň se přiděluje nebo obnovuje po pobytu.',
      items: [
        {
          key: 'blue', name: 'Modrá', nights: '0', nightsNote: 'stačí se zaregistrovat', discount: '—', discountLabel: 'bez slevy',
          perks: ['Přístup k největším slevovým akcím', 'Newsletter Ensana Life'],
        },
        {
          key: 'bronze', name: 'Bronzová', nights: '5+', nightsNote: 'nocí za poslední 2 roky', discount: '10 %', discountLabel: 'na ubytování i služby',
          perks: ['Dřívější check-in dle dostupnosti', 'Přístup k největším slevovým akcím', 'Newsletter Ensana Life'],
        },
        {
          key: 'silver', name: 'Stříbrná', nights: '20+', nightsNote: 'nocí za poslední 2 roky', discount: '15 %', discountLabel: 'na ubytování i služby',
          perks: ['Dřívější check-in i pozdější check-out dle dostupnosti', 'Přístup k největším slevovým akcím', 'Newsletter Ensana Life'],
          featured: true,
        },
        {
          key: 'gold', name: 'Zlatá', nights: '40+', nightsNote: 'nocí za poslední 2 roky', discount: '20 %', discountLabel: 'na ubytování i služby',
          perks: ['Vyšší kategorie pokoje zdarma dle dostupnosti', 'Dřívější check-in i pozdější check-out dle dostupnosti', 'Přístup k největším slevovým akcím', 'Newsletter Ensana Life'],
        },
      ],
      featuredLabel: 'Nejčastější',
      note: 'Modrá karta samotnou slevu na ubytování ani na služby nenese — ta se otevírá až s bronzovou úrovní, tedy po prvních pěti odbydlených nocích. Nový člen tak první pobyt rezervuje ještě bez procentuální slevy, ale už s přístupem ke slevovým akcím. Pokud se člen na základě pobytů v aktuálním a předchozím roce nekvalifikuje pro udržení své úrovně, je zařazen zpět na modrou kartu. Slevy platí při rezervaci a platbě přímo v hotelu a vztahují se na veřejné sazby.',
      tableBenefit: 'Výhoda',
      comparison: [
        { label: 'Sleva na ubytování', values: ['—', '10 %', '15 %', '20 %'] },
        { label: 'Sleva na lázně, wellness a restauraci', values: ['—', '10 %', '15 %', '20 %'] },
        { label: 'Největší slevové akce', values: ['ano', 'ano', 'ano', 'ano'] },
        { label: 'Newsletter Ensana Life', values: ['ano', 'ano', 'ano', 'ano'] },
        { label: 'Dřívější check-in', values: ['—', 'ano', 'ano', 'ano'] },
        { label: 'Pozdější check-out', values: ['—', '—', 'ano', 'ano'] },
        { label: 'Vyšší kategorie pokoje zdarma', values: ['—', '—', '—', 'ano'] },
      ],
      yes: 'ano',
      levelsCta: 'Detail úrovní na ensanahotels.com',
    },
    benefits: {
      heading: 'Co z toho host reálně má',
      lead: 'Program není o sbírání bodů, které jednou propadnou. Je postavený na jednoduché slevě — a na několika drobnostech, které pobyt zpříjemní.',
      cards: [
        { title: 'Sleva neplatí jen na pokoj', text: 'Stejné procento se vztahuje i na lázeňské a wellness služby, restauraci a kavárnu. U dvoutýdenní kúry, kde procedury tvoří podstatnou část účtu, je to znát mnohem víc než sleva na samotné ubytování.' },
        { title: 'Členství nemá datum expirace', text: 'Základní úroveň platí neomezeně. Nemusíte hlídat, jestli vám body nepropadly — jen počet nocí za poslední dva roky rozhoduje o tom, na jaké úrovni jste.' },
        { title: 'Žádná plastová kartička', text: 'Karta je virtuální. Uložíte si ji do telefonu a když ji smažete, znovu si ji stáhnete v členské sekci. Tam si také kdykoli ověříte svůj aktuální stav.' },
        { title: 'Program platí v celé skupině', text: 'Noci sbíráte nejen v Mariánských Lázních, ale i v hotelech Ensana v Maďarsku, na Slovensku, v Rumunsku, Bulharsku a Německu. A naopak — nasbírané noci uplatníte tady.' },
        { title: 'Přístup ke slevovým akcím', text: 'Členové mají přístup k největším slevovým akcím a čtvrtletním prodejům se zvláštními podmínkami — tedy k nabídkám, které se veřejně needitují.' },
        { title: 'Komfort navíc při příjezdu', text: 'Od bronzové úrovně dřívější check-in, od stříbrné i pozdější check-out a na zlaté úrovni upgrade pokoje zdarma — vždy podle aktuální dostupnosti.' },
      ],
    },
    steps: {
      heading: 'Jak se stát členem',
      lead: 'Celé to zabere pár minut a nic to nestojí.',
      items: [
        { title: 'Zaregistrujete se online', text: 'Krátký formulář na stránkách Ensana. Bez poplatku, bez závazku.' },
        { title: 'Aktivujete členství z e-mailu', text: 'Přijde aktivační e-mail. Členství vzniká odsouhlasením podmínek a kliknutím na odkaz.' },
        { title: 'Dostanete virtuální kartu a promo kód', text: 'Kartu si uložíte jako obrázek nebo rovnou do Apple / Google peněženky. Promo kód najdete v členské sekci.' },
        { title: 'Rezervujete přímo v hotelu', text: 'Při rezervaci uvedete jméno, číslo karty a promo kód. Sleva se uplatňuje hned — zpětně to nejde.' },
        { title: 'Při check-inu se vše ověří', text: 'Hotel zkontroluje údaje a stav členství. Po pobytu se noci připočtou k vaší úrovni.' },
      ],
      join: 'Založit členství',
      faq: 'Otázky a odpovědi',
    },
    conditions: {
      heading: 'Co je dobré vědět předem',
      lead: 'Aby nevznikla falešná očekávání — tohle jsou podmínky, na které se nejčastěji naráží.',
      items: [
        { title: 'Jen při rezervaci přímo v hotelu', text: 'Sleva na ubytování platí pouze tehdy, když rezervujete a platíte přímo v hotelu — bez zprostředkovatele, agenta třetí strany nebo rezervační platformy typu Booking.com.' },
        { title: 'Rezervace přes CK nebo pojišťovnu', text: 'Kdo si pobyt koupí přes cestovní kancelář nebo zdravotní pojišťovnu, nemá nárok na slevu na ubytování. Slevu na ostatní hotelové služby — restauraci, lázně, wellness, kavárnu — uplatnit může.' },
        { title: 'Platí na veřejné sazby', text: 'Sleva se nevztahuje na bleskové výprodeje, doplatky přes zdravotní pojišťovny ani na firemní a jiné smluvní ceny. Vztahuje se na 1 pokoj a potvrzení závisí na aktuální dostupnosti.' },
        { title: 'Uplatnit hned při rezervaci', text: 'Zpětně slevu doplnit nelze. Rozhodující je stav členství v okamžiku rezervace, proto je dobré mít kartu i promo kód po ruce už při objednávání.' },
        { title: 'All-inclusive pobyty', text: 'Dřívější check-in a pozdější check-out u nich nelze čerpat zdarma. Člen ale může uplatnit slevu své úrovně na poplatek za tuto službu.' },
        { title: 'Kdo se členem stát nemůže', text: 'Program je pro fyzické osoby od 18 let. Nevztahuje se na právnické osoby ani na zaměstnance Ensany a přidružených společností. Jeden člen má jednu kartu a výhody nelze sdílet ani převádět.' },
      ],
      legal: 'Členství můžete kdykoli zrušit e-mailem. Ensana si vyhrazuje právo podmínky programu měnit a program jednostranně ukončit s 90denní výpovědní lhůtou — po jejím uplynutí už nebudou možné nové registrace a členové využijí jen výhody, které jim už byly potvrzeny. Závazné znění najdete ve {terms}.',
      termsLabel: 'všeobecných obchodních podmínkách Ensana Life',
      contactLead: 'S dotazy k programu se obraťte na',
    },
    closing: {
      heading: 'Příští pobyt může být levnější než ten minulý',
      text: 'Registrace trvá pár minut, nic nestojí a členství začíná okamžitě. Přístup ke slevovým akcím máte hned; sleva na ubytování a služby se otevírá s bronzovou úrovní, tedy po prvních pěti odbydlených nocích.',
      register: 'Zaregistrovat se zdarma',
      browseHotels: 'Prohlédnout hotely v Mariánských Lázních',
      bookingHref: '/cs/ubytovani',
    },
  },

  de: {
    metaTitle: 'Ensana Life — Treueprogramm | Marienbad.com',
    metaDescription:
      'Ensana Life ist das Treueprogramm der Ensana-Hotels. Kostenlos, ohne Verfall und mit bis zu 20 % Rabatt auf Übernachtung, Kur, Wellness und Restaurant. Stufen und Bedingungen im Überblick.',
    urls: {
      register: 'https://ensanahotels.com/de/ensana-life/registrierung',
      login: 'https://ensanahotels.com/de/ensana-life/login',
      terms: 'https://ensanahotels.com/de/ensana-life/geschaftsbedingungen',
      faq: 'https://ensanahotels.com/de/ensana-life/fragen-und-antworten',
      levels: 'https://ensanahotels.com/de/ensana-life/mitgliedslevel',
    },
    hero: {
      eyebrow: 'Treueprogramm',
      subtitle: 'Je länger Sie bei uns bleiben, desto mehr bleibt Ihnen.',
      lead: 'Die Mitgliedschaft ist kostenlos, verfällt nicht und beginnt sofort. Der Rabatt wächst mit den verbrachten Nächten auf bis zu **20 %** — und gilt nicht nur fürs Zimmer, sondern auch für Kur, Wellness, Restaurant und Café.',
      register: 'Kostenlos registrieren',
      viewTiers: 'Stufen ansehen',
      memberPrompt: 'Schon Mitglied?',
      memberLink: 'Zum Mitgliederbereich anmelden',
    },
    highlights: [
      { value: 'bis 20 %', label: 'Rabatt auf die Übernachtung', note: 'bei Buchung und Zahlung direkt im Hotel' },
      { value: 'bis 20 %', label: 'Rabatt auf Kur, Wellness und Restaurant', note: 'gilt auch für Café und weitere Hotelleistungen' },
      { value: '0 €', label: 'Aufnahmegebühr', note: 'Mitgliedschaft kostenlos und ohne Verfall' },
      { value: '7', label: 'Ensana-Hotels in Marienbad', note: 'Nächte zählen über alle Aufenthalte hinweg' },
    ],
    about: {
      heading: 'Ein Treueprogramm, das zum Kurgast wirklich passt',
      p1: 'Ensana Life belohnt wiederholte Aufenthalte mit Rabatten und weiteren Vorteilen. Je mehr Nächte Sie bei uns verbringen, desto höher Ihre Mitgliedschaftsstufe — und desto größer der Rabatt.',
      p2: 'Für Marienbad hat das eine besondere Dimension. **Sieben der hiesigen Kurhotels gehören zur Ensana-Gruppe**, und eine klassische Kur dauert zwei bis drei Wochen. Die entscheidende Nächtezahl sammelt sich also nicht über Jahre — oft genügt ein längerer Aufenthalt.',
      boxTitle: 'Wie schnell man aufsteigt',
      boxItems: [
        'Ein einwöchiger Aufenthalt bringt Sie auf die **Bronze**-Stufe.',
        'Eine dreiwöchige Kur bedeutet die **Silber**-Stufe.',
        'Zwei solche Kuren binnen zwei Jahren sind bereits die **Gold**-Karte.',
      ],
      badgeValue: 'ohne Verfall',
      badgeNote: 'Die Basis-Mitgliedschaft gilt unbegrenzt.',
      imageAlt: 'Kurgästin mit Trinkbecher auf der Kolonnade im Morgenlicht',
      bathAlt: 'Historische Badehalle mit türkisfarbenem Mineralwasser und Marmorsäulen',
    },
    tiers: {
      heading: 'Vier Mitgliedschaftsstufen',
      lead: 'Über die Einstufung entscheidet die Summe der Nächte der letzten zwei Jahre. Die Stufe wird nach dem Aufenthalt vergeben oder erneuert.',
      items: [
        {
          key: 'blue', name: 'Blaue Karte', nights: '0', nightsNote: 'Registrierung genügt', discount: '—', discountLabel: 'ohne Rabatt',
          perks: ['Zugang zu den größten Rabattaktionen', 'Ensana-Life-Newsletter'],
        },
        {
          key: 'bronze', name: 'Bronzekarte', nights: '5+', nightsNote: 'Nächte in den letzten 2 Jahren', discount: '10 %', discountLabel: 'auf Übernachtung und Leistungen',
          perks: ['Früherer Check-in nach Verfügbarkeit', 'Zugang zu den größten Rabattaktionen', 'Ensana-Life-Newsletter'],
        },
        {
          key: 'silver', name: 'Silberkarte', nights: '20+', nightsNote: 'Nächte in den letzten 2 Jahren', discount: '15 %', discountLabel: 'auf Übernachtung und Leistungen',
          perks: ['Früherer Check-in und späterer Check-out nach Verfügbarkeit', 'Zugang zu den größten Rabattaktionen', 'Ensana-Life-Newsletter'],
          featured: true,
        },
        {
          key: 'gold', name: 'Goldkarte', nights: '40+', nightsNote: 'Nächte in den letzten 2 Jahren', discount: '20 %', discountLabel: 'auf Übernachtung und Leistungen',
          perks: ['Kostenloses Zimmer-Upgrade nach Verfügbarkeit', 'Früherer Check-in und späterer Check-out nach Verfügbarkeit', 'Zugang zu den größten Rabattaktionen', 'Ensana-Life-Newsletter'],
        },
      ],
      featuredLabel: 'Am häufigsten',
      note: 'Die Blaue Karte selbst trägt noch keinen Rabatt auf Übernachtung oder Leistungen — dieser beginnt erst mit der Bronze-Stufe, also nach den ersten fünf verbrachten Nächten. Ein neues Mitglied bucht den ersten Aufenthalt noch ohne Prozentrabatt, aber bereits mit Zugang zu den Rabattaktionen. Qualifiziert sich ein Mitglied auf Basis der Aufenthalte im aktuellen und im Vorjahr nicht für den Erhalt seiner Stufe, wird es auf die Blaue Karte zurückgestuft. Rabatte gelten bei Buchung und Zahlung direkt im Hotel und beziehen sich auf öffentliche Preise.',
      tableBenefit: 'Vorteil',
      comparison: [
        { label: 'Rabatt auf die Übernachtung', values: ['—', '10 %', '15 %', '20 %'] },
        { label: 'Rabatt auf Kur, Wellness und Restaurant', values: ['—', '10 %', '15 %', '20 %'] },
        { label: 'Größte Rabattaktionen', values: ['ja', 'ja', 'ja', 'ja'] },
        { label: 'Ensana-Life-Newsletter', values: ['ja', 'ja', 'ja', 'ja'] },
        { label: 'Früherer Check-in', values: ['—', 'ja', 'ja', 'ja'] },
        { label: 'Späterer Check-out', values: ['—', '—', 'ja', 'ja'] },
        { label: 'Kostenloses Zimmer-Upgrade', values: ['—', '—', '—', 'ja'] },
      ],
      yes: 'ja',
      levelsCta: 'Stufen im Detail auf ensanahotels.com',
    },
    benefits: {
      heading: 'Was der Gast wirklich davon hat',
      lead: 'Das Programm dreht sich nicht um Punkte, die irgendwann verfallen. Es beruht auf einem einfachen Rabatt — und auf einigen Kleinigkeiten, die den Aufenthalt angenehmer machen.',
      cards: [
        { title: 'Der Rabatt gilt nicht nur fürs Zimmer', text: 'Derselbe Prozentsatz gilt auch für Kur- und Wellnessleistungen, Restaurant und Café. Bei einer zweiwöchigen Kur, in der die Anwendungen einen wesentlichen Teil der Rechnung ausmachen, ist das deutlich mehr wert als der Rabatt auf die Übernachtung allein.' },
        { title: 'Die Mitgliedschaft verfällt nicht', text: 'Die Basisstufe gilt unbegrenzt. Sie müssen nicht aufpassen, ob Punkte verfallen — allein die Nächtezahl der letzten zwei Jahre bestimmt Ihre Stufe.' },
        { title: 'Keine Plastikkarte', text: 'Die Karte ist virtuell. Sie speichern sie im Telefon, und falls Sie sie löschen, laden Sie sie im Mitgliederbereich einfach erneut herunter. Dort prüfen Sie jederzeit auch Ihren aktuellen Status.' },
        { title: 'Das Programm gilt in der ganzen Gruppe', text: 'Nächte sammeln Sie nicht nur in Marienbad, sondern auch in den Ensana-Hotels in Ungarn, der Slowakei, Rumänien, Bulgarien und Deutschland. Und umgekehrt — gesammelte Nächte lösen Sie hier ein.' },
        { title: 'Zugang zu Rabattaktionen', text: 'Mitglieder haben Zugang zu den größten Rabattaktionen und Quartalsverkäufen mit Sonderkonditionen — also zu Angeboten, die öffentlich nicht beworben werden.' },
        { title: 'Mehr Komfort bei der Anreise', text: 'Ab Bronze früherer Check-in, ab Silber auch späterer Check-out und auf der Goldstufe ein kostenloses Zimmer-Upgrade — stets nach aktueller Verfügbarkeit.' },
      ],
    },
    steps: {
      heading: 'So werden Sie Mitglied',
      lead: 'Das Ganze dauert ein paar Minuten und kostet nichts.',
      items: [
        { title: 'Online registrieren', text: 'Ein kurzes Formular auf den Ensana-Seiten. Ohne Gebühr, ohne Verpflichtung.' },
        { title: 'Mitgliedschaft per E-Mail aktivieren', text: 'Sie erhalten eine Aktivierungs-E-Mail. Die Mitgliedschaft entsteht mit der Zustimmung zu den Bedingungen und dem Klick auf den Link.' },
        { title: 'Virtuelle Karte und Promo-Code erhalten', text: 'Die Karte speichern Sie als Bild oder direkt in der Apple- / Google-Wallet. Den Promo-Code finden Sie im Mitgliederbereich.' },
        { title: 'Direkt im Hotel buchen', text: 'Bei der Buchung geben Sie Name, Kartennummer und Promo-Code an. Der Rabatt wird sofort angewendet — rückwirkend geht es nicht.' },
        { title: 'Beim Check-in wird alles geprüft', text: 'Das Hotel prüft Ihre Daten und den Mitgliedsstatus. Nach dem Aufenthalt werden die Nächte Ihrer Stufe gutgeschrieben.' },
      ],
      join: 'Mitglied werden',
      faq: 'Fragen und Antworten',
    },
    conditions: {
      heading: 'Was Sie vorher wissen sollten',
      lead: 'Damit keine falschen Erwartungen entstehen — das sind die Bedingungen, auf die man am häufigsten stößt.',
      items: [
        { title: 'Nur bei Buchung direkt im Hotel', text: 'Der Übernachtungsrabatt gilt nur, wenn Sie direkt im Hotel buchen und zahlen — ohne Vermittler, Drittagenten oder Buchungsplattformen wie Booking.com.' },
        { title: 'Buchung über Reisebüro oder Krankenkasse', text: 'Wer den Aufenthalt über ein Reisebüro oder eine Krankenkasse bucht, hat keinen Anspruch auf den Übernachtungsrabatt. Den Rabatt auf die übrigen Hotelleistungen — Restaurant, Kur, Wellness, Café — kann er dennoch nutzen.' },
        { title: 'Gilt für öffentliche Preise', text: 'Der Rabatt gilt nicht für Flash-Sales, Zuzahlungen über Krankenkassen sowie Firmen- und andere Vertragspreise. Er bezieht sich auf 1 Zimmer; die Bestätigung hängt von der aktuellen Verfügbarkeit ab.' },
        { title: 'Sofort bei der Buchung einlösen', text: 'Nachträglich lässt sich der Rabatt nicht anrechnen. Maßgeblich ist der Mitgliedsstatus zum Buchungszeitpunkt — halten Sie Karte und Promo-Code also schon bei der Bestellung bereit.' },
        { title: 'All-inclusive-Aufenthalte', text: 'Früherer Check-in und späterer Check-out sind hier nicht kostenfrei nutzbar. Das Mitglied kann aber den Rabatt seiner Stufe auf die Gebühr für diese Leistung anwenden.' },
        { title: 'Wer nicht Mitglied werden kann', text: 'Das Programm gilt für natürliche Personen ab 18 Jahren. Es gilt nicht für juristische Personen und nicht für Mitarbeiter von Ensana und verbundenen Unternehmen. Ein Mitglied hat eine Karte; Vorteile sind nicht übertragbar.' },
      ],
      legal: 'Die Mitgliedschaft können Sie jederzeit per E-Mail kündigen. Ensana behält sich vor, die Programmbedingungen zu ändern und das Programm mit einer Frist von 90 Tagen einseitig zu beenden — nach Ablauf der Frist sind keine neuen Registrierungen mehr möglich, und Mitglieder nutzen nur noch bereits bestätigte Vorteile. Die verbindliche Fassung finden Sie in den {terms}.',
      termsLabel: 'Allgemeinen Geschäftsbedingungen von Ensana Life',
      contactLead: 'Fragen zum Programm richten Sie an',
    },
    closing: {
      heading: 'Der nächste Aufenthalt kann günstiger sein als der letzte',
      text: 'Die Registrierung dauert ein paar Minuten, kostet nichts, und die Mitgliedschaft beginnt sofort. Zugang zu den Rabattaktionen haben Sie gleich; der Rabatt auf Übernachtung und Leistungen beginnt mit der Bronze-Stufe, also nach den ersten fünf Nächten.',
      register: 'Kostenlos registrieren',
      browseHotels: 'Hotels in Marienbad ansehen',
      bookingHref: '/de/unterkunft',
    },
  },

  en: {
    metaTitle: 'Ensana Life — loyalty programme | Marienbad.com',
    metaDescription:
      'Ensana Life is the loyalty programme of the Ensana hotels. Free, non-expiring, with up to 20% off accommodation as well as spa, wellness and dining. Tiers and conditions at a glance.',
    urls: EN_URLS,
    hero: {
      eyebrow: 'Loyalty programme',
      subtitle: 'The longer you stay with us, the more stays with you.',
      lead: 'Membership is free, never expires and starts immediately. The discount grows with the nights you stay, up to **20%** — and it applies not just to the room but to the spa, wellness, restaurant and café too.',
      register: 'Register for free',
      viewTiers: 'View the tiers',
      memberPrompt: 'Already a member?',
      memberLink: 'Sign in to the members area',
    },
    highlights: [
      { value: 'up to 20%', label: 'off accommodation', note: 'when booking and paying directly with the hotel' },
      { value: 'up to 20%', label: 'off spa, wellness and dining', note: 'also applies to the café and other hotel services' },
      { value: '€0', label: 'joining fee', note: 'membership is free and never expires' },
      { value: '7', label: 'Ensana hotels in Mariánské Lázně', note: 'nights add up across stays' },
    ],
    about: {
      heading: 'A loyalty programme that truly fits the spa guest',
      p1: 'Ensana Life rewards repeated stays with discounts and further benefits. The more nights you stay with us, the higher your membership tier — and the bigger the discount that stays with you.',
      p2: 'For Mariánské Lázně this has one crucial dimension. **Seven of the local spa hotels belong to the Ensana group**, and a classic spa cure lasts two to three weeks. The decisive number of nights is not collected over years — one longer stay is often enough.',
      boxTitle: 'How quickly you move up',
      boxItems: [
        'A one-week stay takes you to the **Bronze** tier.',
        'A single three-week cure means the **Silver** tier.',
        'Two such cures within two years already make the **Gold** card.',
      ],
      badgeValue: 'never expires',
      badgeNote: 'Basic membership is valid indefinitely.',
      imageAlt: 'Spa guest with a drinking cup on the colonnade in morning light',
      bathAlt: 'Historic bath hall with turquoise mineral water and marble columns',
    },
    tiers: {
      heading: 'Four membership tiers',
      lead: 'Your tier is decided by the sum of nights stayed over the past two years. Tiers are granted or renewed after a stay.',
      items: [
        {
          key: 'blue', name: 'Blue', nights: '0', nightsNote: 'just register', discount: '—', discountLabel: 'no discount',
          perks: ['Access to the biggest discount sales', 'Ensana Life newsletter'],
        },
        {
          key: 'bronze', name: 'Bronze', nights: '5+', nightsNote: 'nights in the past 2 years', discount: '10%', discountLabel: 'on accommodation and services',
          perks: ['Early check-in subject to availability', 'Access to the biggest discount sales', 'Ensana Life newsletter'],
        },
        {
          key: 'silver', name: 'Silver', nights: '20+', nightsNote: 'nights in the past 2 years', discount: '15%', discountLabel: 'on accommodation and services',
          perks: ['Early check-in and late check-out subject to availability', 'Access to the biggest discount sales', 'Ensana Life newsletter'],
          featured: true,
        },
        {
          key: 'gold', name: 'Gold', nights: '40+', nightsNote: 'nights in the past 2 years', discount: '20%', discountLabel: 'on accommodation and services',
          perks: ['Free room upgrade subject to availability', 'Early check-in and late check-out subject to availability', 'Access to the biggest discount sales', 'Ensana Life newsletter'],
        },
      ],
      featuredLabel: 'Most common',
      note: 'The Blue card itself carries no discount on accommodation or services — that opens with the Bronze tier, after the first five nights stayed. A new member therefore books their first stay without the percentage discount, but already with access to the discount sales. If a member does not qualify to keep their tier based on stays in the current and previous year, they return to the Blue card. Discounts apply when booking and paying directly with the hotel and relate to public rates.',
      tableBenefit: 'Benefit',
      comparison: [
        { label: 'Discount on accommodation', values: ['—', '10%', '15%', '20%'] },
        { label: 'Discount on spa, wellness and dining', values: ['—', '10%', '15%', '20%'] },
        { label: 'Biggest discount sales', values: ['yes', 'yes', 'yes', 'yes'] },
        { label: 'Ensana Life newsletter', values: ['yes', 'yes', 'yes', 'yes'] },
        { label: 'Early check-in', values: ['—', 'yes', 'yes', 'yes'] },
        { label: 'Late check-out', values: ['—', '—', 'yes', 'yes'] },
        { label: 'Free room upgrade', values: ['—', '—', '—', 'yes'] },
      ],
      yes: 'yes',
      levelsCta: 'Tier details on ensanahotels.com',
    },
    benefits: {
      heading: 'What the guest really gets',
      lead: 'The programme is not about collecting points that one day expire. It is built on a simple discount — and a few small things that make the stay more pleasant.',
      cards: [
        { title: 'The discount is not just for the room', text: 'The same percentage applies to spa and wellness services, the restaurant and the café. On a two-week cure, where treatments make up a substantial part of the bill, that counts for far more than a room discount alone.' },
        { title: 'Membership has no expiry date', text: 'The basic tier is valid indefinitely. There are no points to watch expire — only the number of nights over the past two years decides which tier you are on.' },
        { title: 'No plastic card', text: 'The card is virtual. Save it to your phone, and if you delete it, download it again in the members area — where you can also check your current status at any time.' },
        { title: 'The programme works across the whole group', text: 'You collect nights not only in Mariánské Lázně but also at Ensana hotels in Hungary, Slovakia, Romania, Bulgaria and Germany. And vice versa — nights collected elsewhere count here.' },
        { title: 'Access to discount sales', text: 'Members get access to the biggest discount sales and quarterly sales with special conditions — offers that are not advertised publicly.' },
        { title: 'Extra comfort on arrival', text: 'Early check-in from Bronze, late check-out from Silver, and a free room upgrade at Gold — always subject to current availability.' },
      ],
    },
    steps: {
      heading: 'How to become a member',
      lead: 'The whole thing takes a few minutes and costs nothing.',
      items: [
        { title: 'Register online', text: 'A short form on the Ensana website. No fee, no commitment.' },
        { title: 'Activate membership from the e-mail', text: 'An activation e-mail arrives. Membership begins when you accept the terms and click the link.' },
        { title: 'Receive a virtual card and promo code', text: 'Save the card as an image or straight to your Apple / Google wallet. You will find the promo code in the members area.' },
        { title: 'Book directly with the hotel', text: 'When booking, give your name, card number and promo code. The discount applies immediately — it cannot be added retroactively.' },
        { title: 'Everything is verified at check-in', text: 'The hotel checks your details and membership status. After the stay, the nights are added towards your tier.' },
      ],
      join: 'Join the programme',
      faq: 'Questions and answers',
    },
    conditions: {
      heading: 'Worth knowing beforehand',
      lead: 'To avoid false expectations — these are the conditions people run into most often.',
      items: [
        { title: 'Only when booking directly with the hotel', text: 'The accommodation discount applies only when you book and pay directly with the hotel — without an intermediary, third-party agent or booking platform such as Booking.com.' },
        { title: 'Bookings via travel agencies or insurers', text: 'Guests who buy their stay through a travel agency or health insurer are not entitled to the accommodation discount. They can still use the discount on other hotel services — restaurant, spa, wellness, café.' },
        { title: 'Applies to public rates', text: 'The discount does not apply to flash sales, health-insurer co-payments, or corporate and other contractual rates. It covers 1 room and confirmation depends on current availability.' },
        { title: 'Claim it at the time of booking', text: 'The discount cannot be added later. What counts is your membership status at the moment of booking — so have your card and promo code ready when ordering.' },
        { title: 'All-inclusive stays', text: 'Early check-in and late check-out cannot be used free of charge on these. A member can, however, apply their tier discount to the fee for this service.' },
        { title: 'Who cannot join', text: 'The programme is for natural persons aged 18 and over. It does not apply to legal entities or to employees of Ensana and affiliated companies. One member holds one card, and benefits cannot be shared or transferred.' },
      ],
      legal: 'You can cancel membership at any time by e-mail. Ensana reserves the right to change the programme conditions and to end the programme unilaterally with 90 days’ notice — after that period no new registrations are possible and members use only benefits already confirmed. The binding wording is in the {terms}.',
      termsLabel: 'Ensana Life general terms and conditions',
      contactLead: 'For questions about the programme, contact',
    },
    closing: {
      heading: 'Your next stay can cost less than the last one',
      text: 'Registration takes a few minutes, costs nothing, and membership starts immediately. Access to the discount sales is instant; the discount on accommodation and services opens with the Bronze tier, after the first five nights stayed.',
      register: 'Register for free',
      browseHotels: 'Browse the hotels in Mariánské Lázně',
      bookingHref: '/en/accommodation',
    },
  },

  ru: {
    metaTitle: 'Ensana Life — программа лояльности | Marienbad.com',
    metaDescription:
      'Ensana Life — программа лояльности отелей Ensana. Бесплатно, бессрочно и со скидкой до 20 % на проживание, а также на лечение, велнес и ресторан. Уровни и условия.',
    urls: {
      register: 'https://ensanahotels.com/ru/ensana-life/registratsiya',
      login: 'https://ensanahotels.com/ru/ensana-life/login',
      terms: 'https://ensanahotels.com/ru/ensana-life/pravila-i-usloviya',
      faq: 'https://ensanahotels.com/ru/ensana-life/voprosy-i-otvety',
      levels: 'https://ensanahotels.com/ru/ensana-life/urovni-chlenstva',
    },
    hero: {
      eyebrow: 'Программа лояльности',
      subtitle: 'Чем дольше вы у нас остаётесь, тем больше остаётся вам.',
      lead: 'Членство бесплатное, бессрочное и начинается сразу. Скидка растёт с количеством проведённых ночей до **20 %** — и действует не только на номер, но и на лечение, велнес, ресторан и кафе.',
      register: 'Зарегистрироваться бесплатно',
      viewTiers: 'Посмотреть уровни',
      memberPrompt: 'Уже участник?',
      memberLink: 'Войти в личный кабинет',
    },
    highlights: [
      { value: 'до 20 %', label: 'скидка на проживание', note: 'при бронировании и оплате напрямую в отеле' },
      { value: 'до 20 %', label: 'скидка на лечение, велнес и ресторан', note: 'действует и на кафе, и на другие услуги отеля' },
      { value: '0 €', label: 'вступительный взнос', note: 'членство бесплатное и бессрочное' },
      { value: '7', label: 'отелей Ensana в Марианских Лазнях', note: 'ночи суммируются между пребываниями' },
    ],
    about: {
      heading: 'Программа лояльности, которая действительно подходит курортному гостю',
      p1: 'Ensana Life вознаграждает повторные пребывания скидками и другими преимуществами. Чем больше ночей вы у нас проводите, тем выше уровень членства — и тем больше скидка.',
      p2: 'Для Марианских Лазней это имеет особое значение. **Семь здешних курортных отелей принадлежат группе Ensana**, а классический курс лечения длится две-три недели. Решающее число ночей набирается не годами — часто хватает одного длительного пребывания.',
      boxTitle: 'Как быстро подняться выше',
      boxItems: [
        'Недельное пребывание выводит вас на **бронзовый** уровень.',
        'Один трёхнедельный курс — это **серебряный** уровень.',
        'Два таких курса за два года — уже **золотая** карта.',
      ],
      badgeValue: 'бессрочно',
      badgeNote: 'Базовое членство действует без ограничений.',
      imageAlt: 'Гостья курорта с питьевой кружечкой на колоннаде в утреннем свете',
      bathAlt: 'Историческая купальная зала с бирюзовой минеральной водой и мраморными колоннами',
    },
    tiers: {
      heading: 'Четыре уровня членства',
      lead: 'Уровень определяется суммой ночей за последние два года. Он присваивается или продлевается после пребывания.',
      items: [
        {
          key: 'blue', name: 'Синяя', nights: '0', nightsNote: 'достаточно зарегистрироваться', discount: '—', discountLabel: 'без скидки',
          perks: ['Доступ к крупнейшим распродажам', 'Рассылка Ensana Life'],
        },
        {
          key: 'bronze', name: 'Бронзовая', nights: '5+', nightsNote: 'ночей за последние 2 года', discount: '10 %', discountLabel: 'на проживание и услуги',
          perks: ['Ранний заезд при наличии возможности', 'Доступ к крупнейшим распродажам', 'Рассылка Ensana Life'],
        },
        {
          key: 'silver', name: 'Серебряная', nights: '20+', nightsNote: 'ночей за последние 2 года', discount: '15 %', discountLabel: 'на проживание и услуги',
          perks: ['Ранний заезд и поздний выезд при наличии возможности', 'Доступ к крупнейшим распродажам', 'Рассылка Ensana Life'],
          featured: true,
        },
        {
          key: 'gold', name: 'Золотая', nights: '40+', nightsNote: 'ночей за последние 2 года', discount: '20 %', discountLabel: 'на проживание и услуги',
          perks: ['Бесплатное повышение категории номера при наличии возможности', 'Ранний заезд и поздний выезд при наличии возможности', 'Доступ к крупнейшим распродажам', 'Рассылка Ensana Life'],
        },
      ],
      featuredLabel: 'Самая частая',
      note: 'Синяя карта сама по себе не даёт скидку на проживание и услуги — она открывается с бронзового уровня, то есть после первых пяти проведённых ночей. Новый участник бронирует первое пребывание ещё без процентной скидки, но уже с доступом к распродажам. Если по пребываниям текущего и прошлого года участник не подтверждает свой уровень, он возвращается на синюю карту. Скидки действуют при бронировании и оплате напрямую в отеле и относятся к публичным тарифам.',
      tableBenefit: 'Преимущество',
      comparison: [
        { label: 'Скидка на проживание', values: ['—', '10 %', '15 %', '20 %'] },
        { label: 'Скидка на лечение, велнес и ресторан', values: ['—', '10 %', '15 %', '20 %'] },
        { label: 'Крупнейшие распродажи', values: ['да', 'да', 'да', 'да'] },
        { label: 'Рассылка Ensana Life', values: ['да', 'да', 'да', 'да'] },
        { label: 'Ранний заезд', values: ['—', 'да', 'да', 'да'] },
        { label: 'Поздний выезд', values: ['—', '—', 'да', 'да'] },
        { label: 'Бесплатное повышение категории номера', values: ['—', '—', '—', 'да'] },
      ],
      yes: 'да',
      levelsCta: 'Подробно об уровнях на ensanahotels.com',
    },
    benefits: {
      heading: 'Что гость получает на деле',
      lead: 'Программа не про накопление баллов, которые однажды сгорят. Она построена на простой скидке — и нескольких мелочах, которые делают пребывание приятнее.',
      cards: [
        { title: 'Скидка не только на номер', text: 'Тот же процент действует на лечебные и велнес-услуги, ресторан и кафе. При двухнедельном курсе, где процедуры составляют существенную часть счёта, это ощутимо больше, чем скидка на одно проживание.' },
        { title: 'Членство без срока действия', text: 'Базовый уровень действует бессрочно. Не нужно следить, не сгорели ли баллы — только число ночей за последние два года определяет ваш уровень.' },
        { title: 'Никакой пластиковой карты', text: 'Карта виртуальная. Сохраните её в телефон, а если удалите — снова скачаете в личном кабинете. Там же в любой момент проверите свой текущий статус.' },
        { title: 'Программа действует по всей группе', text: 'Ночи вы копите не только в Марианских Лазнях, но и в отелях Ensana в Венгрии, Словакии, Румынии, Болгарии и Германии. И наоборот — накопленные ночи учитываются здесь.' },
        { title: 'Доступ к распродажам', text: 'Участники получают доступ к крупнейшим распродажам и ежеквартальным акциям с особыми условиями — то есть к предложениям, которые публично не рекламируются.' },
        { title: 'Дополнительный комфорт по приезде', text: 'С бронзового уровня ранний заезд, с серебряного — и поздний выезд, на золотом — бесплатное повышение категории номера. Всегда при наличии возможности.' },
      ],
    },
    steps: {
      heading: 'Как стать участником',
      lead: 'Всё занимает несколько минут и ничего не стоит.',
      items: [
        { title: 'Зарегистрируйтесь онлайн', text: 'Короткая форма на сайте Ensana. Без взносов и обязательств.' },
        { title: 'Активируйте членство из письма', text: 'Придёт активационное письмо. Членство возникает после согласия с условиями и перехода по ссылке.' },
        { title: 'Получите виртуальную карту и промокод', text: 'Карту сохраните как изображение или сразу в кошелёк Apple / Google. Промокод найдёте в личном кабинете.' },
        { title: 'Бронируйте напрямую в отеле', text: 'При бронировании укажите имя, номер карты и промокод. Скидка применяется сразу — задним числом это невозможно.' },
        { title: 'При заезде всё проверят', text: 'Отель сверит данные и статус членства. После пребывания ночи зачтутся к вашему уровню.' },
      ],
      join: 'Оформить членство',
      faq: 'Вопросы и ответы',
    },
    conditions: {
      heading: 'Что стоит знать заранее',
      lead: 'Чтобы не возникло ложных ожиданий — вот условия, с которыми сталкиваются чаще всего.',
      items: [
        { title: 'Только при бронировании напрямую в отеле', text: 'Скидка на проживание действует лишь тогда, когда вы бронируете и платите напрямую в отеле — без посредника, стороннего агента или платформы типа Booking.com.' },
        { title: 'Бронирование через турагентство или страховую', text: 'Кто покупает пребывание через турагентство или медицинскую страховую компанию, не имеет права на скидку на проживание. Скидкой на остальные услуги отеля — ресторан, лечение, велнес, кафе — воспользоваться может.' },
        { title: 'Действует на публичные тарифы', text: 'Скидка не распространяется на флеш-распродажи, доплаты через страховые компании, корпоративные и иные договорные цены. Она относится к 1 номеру, подтверждение зависит от наличия мест.' },
        { title: 'Применить сразу при бронировании', text: 'Задним числом скидку добавить нельзя. Решающим является статус членства в момент бронирования — держите карту и промокод под рукой уже при заказе.' },
        { title: 'Пребывания all-inclusive', text: 'Ранний заезд и поздний выезд здесь нельзя использовать бесплатно. Но участник может применить скидку своего уровня к плате за эту услугу.' },
        { title: 'Кто не может стать участником', text: 'Программа предназначена для физических лиц от 18 лет. Она не распространяется на юридических лиц и сотрудников Ensana и аффилированных компаний. У одного участника одна карта; преимущества нельзя передавать.' },
      ],
      legal: 'Членство можно отменить в любой момент по электронной почте. Ensana оставляет за собой право менять условия программы и прекратить её в одностороннем порядке с уведомлением за 90 дней — после этого срока новые регистрации станут невозможны, а участники используют только уже подтверждённые преимущества. Обязательная редакция — в {terms}.',
      termsLabel: 'общих правилах и условиях Ensana Life',
      contactLead: 'С вопросами о программе обращайтесь на',
    },
    closing: {
      heading: 'Следующее пребывание может обойтись дешевле прошлого',
      text: 'Регистрация занимает несколько минут, ничего не стоит, а членство начинается сразу. Доступ к распродажам — сразу; скидка на проживание и услуги открывается с бронзового уровня, после первых пяти проведённых ночей.',
      register: 'Зарегистрироваться бесплатно',
      browseHotels: 'Посмотреть отели в Марианских Лазнях',
      bookingHref: '/ru/prozhivanie',
    },
  },
}
