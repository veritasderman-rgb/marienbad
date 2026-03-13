/**
 * Marienbad.com — CMS Seed Data
 *
 * Run with: npx tsx src/seed/index.ts
 * Requires DATABASE_URL and PAYLOAD_SECRET env vars.
 *
 * Seeds: Categories, Authors, Pages (pillar), Articles (cluster),
 * PeopleStories, Events, Navigation, Footer, SiteSettings
 */
import type { Payload } from 'payload'

// ─── Categories ──────────────────────────────────────────────
export const seedCategories = [
  { name: { de: 'Mineralquellen', en: 'Mineral Springs' }, slug: 'mineral-springs', description: { de: 'Heilquellen und Spa-Behandlungen', en: 'Healing springs and spa treatments' } },
  { name: { de: 'Aktivitäten', en: 'Things to Do' }, slug: 'things-to-do', description: { de: 'Freizeitaktivitäten in Marienbad', en: 'Activities and sightseeing in Marienbad' } },
  { name: { de: 'Unterkunft', en: 'Accommodation' }, slug: 'accommodation', description: { de: 'Hotels und Unterkünfte', en: 'Hotels and places to stay' } },
  { name: { de: 'Geschichte', en: 'History' }, slug: 'history', description: { de: 'Geschichte von Marienbad', en: 'History of Marienbad' } },
  { name: { de: 'Wellness', en: 'Wellness' }, slug: 'wellness', description: { de: 'Wellness und Gesundheit', en: 'Wellness and health' } },
  { name: { de: 'Kultur', en: 'Culture' }, slug: 'culture', description: { de: 'Kultur und Veranstaltungen', en: 'Culture and events' } },
]

// ─── Authors ─────────────────────────────────────────────────
export const seedAuthors = [
  { name: 'Dr. Helena Procházková', email: 'helena@marienbad.com', bio: 'Balneologist and spa medicine specialist with 20+ years of experience in Mariánské Lázně.', expertType: 'doctor' as const },
  { name: 'Jan Novotný', email: 'jan@marienbad.com', bio: 'Local journalist and historian, author of several books about Mariánské Lázně.', expertType: 'journalist' as const },
  { name: 'Petra Králová', email: 'petra@marienbad.com', bio: 'Licensed tour guide specializing in the spa triangle of western Bohemia.', expertType: 'local-guide' as const },
]

// ─── Pages (Pillar) ──────────────────────────────────────────
export const seedPages = [
  {
    title: { de: 'Mineralquellen & Spa in Marienbad', en: 'Mineral Springs & Spa in Marienbad' },
    slug: { de: 'mineralquellen', en: 'mineral-springs' },
    type: 'pillar' as const,
    hero: {
      headline: { de: 'Heilende Quellen seit Jahrhunderten', en: 'Healing Springs for Centuries' },
      subheadline: { de: 'Über 40 Mineralquellen, eine Jahrhunderte alte Heiltradition und moderne Spa-Behandlungen', en: 'Over 40 mineral springs, centuries of healing tradition, and modern spa treatments' },
      ctaText: { de: 'Quellen entdecken', en: 'Discover the springs' },
      ctaUrl: '#healing-waters',
    },
    faq: [
      { question: { de: 'Wie viele Mineralquellen gibt es in Marienbad?', en: 'How many mineral springs are there in Marienbad?' }, answer: { de: 'Marienbad hat über 40 Mineralquellen, jede mit einzigartiger Mineralzusammensetzung und Heileigenschaften. Die bekanntesten sind die Kreuzquelle, Ferdinandsquelle und Waldquelle.', en: 'Marienbad has over 40 mineral springs, each with unique mineral composition and healing properties. The most famous include the Cross Spring (Kreuzquelle), Ferdinand Spring, and Forest Spring.' } },
      { question: { de: 'Welche Gesundheitszustände können behandelt werden?', en: 'What health conditions can be treated?' }, answer: { de: 'Marienbader Kurbehandlungen werden traditionell bei Verdauungsstörungen, Stoffwechselerkrankungen, Atemwegserkrankungen, Nieren- und Harnwegserkrankungen sowie Erkrankungen des Bewegungsapparats eingesetzt.', en: 'Marienbad spa treatments are traditionally used for digestive disorders, metabolic diseases, respiratory conditions, kidney and urinary tract issues, and musculoskeletal problems.' } },
      { question: { de: 'Brauche ich ein Rezept für Spa-Behandlungen?', en: 'Do I need a prescription for spa treatments?' }, answer: { de: 'Während einige therapeutische Spa-Behandlungen eine ärztliche Empfehlung erfordern, stehen viele Wellness-Behandlungen, Mineralbäder und Trinkkuren allen Besuchern zur Verfügung.', en: 'While some therapeutic spa treatments require a doctor\'s recommendation, many wellness treatments, mineral baths, and spring drinking cures are available to all visitors.' } },
      { question: { de: 'Was sind CO2-Bäder?', en: 'What are CO2 baths?' }, answer: { de: 'CO2-Bäder (Kohlensäurebäder) sind eine typische Marienbader Behandlung. Natürliches CO2-Gas wird im Mineralwasser gelöst und verbessert die Durchblutung, senkt den Blutdruck und fördert die Entspannung.', en: 'CO2 (carbon dioxide) baths are a signature Marienbad treatment. Natural CO2 gas is dissolved in mineral water, improving blood circulation, reducing blood pressure, and promoting relaxation.' } },
    ],
    ensanaCTA: {
      enabled: true,
      headline: { de: 'Erleben Sie die heilenden Quellen', en: 'Experience the healing springs' },
      text: { de: 'Ensana Nové Lázně bietet das einzige Königliche Römische Bad, das Hotelgästen offensteht. Direkt buchen für den besten Preis.', en: 'Ensana Nové Lázně features the only Royal Roman Bath open to hotel guests. Book directly for the best rate.' },
      url: 'https://www.ensanahotels.com/nove-lazne',
      position: 'sidebar' as const,
    },
    targetKeywords: [
      { keyword: 'Marienbad mineral springs' },
      { keyword: 'Mariánské Lázně spa' },
      { keyword: 'CO2 baths Marienbad' },
      { keyword: 'healing waters Czech Republic' },
    ],
    status: 'published' as const,
    publishedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    title: { de: 'Aktivitäten in Marienbad', en: 'Things to Do in Marienbad' },
    slug: { de: 'aktivitaeten', en: 'things-to-do' },
    type: 'pillar' as const,
    hero: {
      headline: { de: 'Marienbad erleben', en: 'Experience Marienbad' },
      subheadline: { de: 'Singende Fontäne, Kolonnade, Golfplätze und mehr — entdecken Sie alles, was Marienbad zu bieten hat', en: 'Singing Fountain, Colonnade, golf courses and more — discover everything Marienbad has to offer' },
      ctaText: { de: 'Aktivitäten entdecken', en: 'Explore activities' },
      ctaUrl: '#activities',
    },
    faq: [
      { question: { de: 'Was kann man in Marienbad unternehmen?', en: 'What can you do in Marienbad?' }, answer: { de: 'Marienbad bietet die Singende Fontäne, historische Kolonnaden, Golfplätze, Wanderwege, Museen, und das ganze Jahr über kulturelle Veranstaltungen.', en: 'Marienbad offers the Singing Fountain, historic colonnades, golf courses, hiking trails, museums, and year-round cultural events.' } },
      { question: { de: 'Wann spielt die Singende Fontäne?', en: 'When does the Singing Fountain play?' }, answer: { de: 'Die Singende Fontäne spielt von Mai bis Oktober zu jeder ungeraden Stunde von 7 bis 21 Uhr. Abendvorstellungen mit Beleuchtung sind besonders beliebt.', en: 'The Singing Fountain plays from May to October at every odd hour from 7 AM to 9 PM. Evening performances with illumination are particularly popular.' } },
    ],
    ensanaCTA: {
      enabled: true,
      headline: { de: 'Perfekte Unterkunft für Ihren Aufenthalt', en: 'Perfect base for your stay' },
      text: { de: 'Ensana Hotels liegen direkt an der Kolonnade — ideal für alle Aktivitäten.', en: 'Ensana Hotels are located right by the Colonnade — perfect for all activities.' },
      url: 'https://www.ensanahotels.com/marienbad',
      position: 'bottom' as const,
    },
    targetKeywords: [
      { keyword: 'things to do Marienbad' },
      { keyword: 'Singing Fountain Marienbad' },
      { keyword: 'Marienbad activities' },
    ],
    status: 'published' as const,
    publishedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    title: { de: 'Unterkunft in Marienbad', en: 'Accommodation in Marienbad' },
    slug: { de: 'unterkunft', en: 'accommodation' },
    type: 'pillar' as const,
    hero: {
      headline: { de: 'Übernachten in Marienbad', en: 'Where to Stay in Marienbad' },
      subheadline: { de: 'Von historischen Grandhotels bis zu gemütlichen Pensionen — die besten Unterkünfte im Kurort', en: 'From historic grand hotels to cozy guesthouses — the best places to stay in the spa town' },
      ctaText: { de: 'Hotels ansehen', en: 'View hotels' },
      ctaUrl: '#hotels',
    },
    faq: [
      { question: { de: 'Wann ist die beste Reisezeit für Marienbad?', en: 'When is the best time to visit Marienbad?' }, answer: { de: 'Die Hauptsaison ist von Mai bis September, aber Marienbad ist das ganze Jahr über ein attraktives Reiseziel. Die Spa-Saison dauert von Januar bis Dezember.', en: 'The main season is from May to September, but Marienbad is an attractive year-round destination. The spa season runs from January to December.' } },
    ],
    ensanaCTA: {
      enabled: true,
      headline: { de: 'Direkt bei Ensana buchen', en: 'Book directly with Ensana' },
      text: { de: 'Ensana betreibt 5 historische Hotels in Marienbad. Bestpreisgarantie bei Direktbuchung.', en: 'Ensana operates 5 historic hotels in Marienbad. Best price guarantee when booking directly.' },
      url: 'https://www.ensanahotels.com/marienbad',
      position: 'sidebar' as const,
    },
    targetKeywords: [
      { keyword: 'Marienbad hotels' },
      { keyword: 'accommodation Mariánské Lázně' },
      { keyword: 'spa hotels Marienbad' },
    ],
    status: 'published' as const,
    publishedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    title: { de: 'Geschichte von Marienbad', en: 'History of Marienbad' },
    slug: { de: 'geschichte', en: 'history' },
    type: 'pillar' as const,
    hero: {
      headline: { de: 'Eine Stadt der Könige und Dichter', en: 'A Town of Kings and Poets' },
      subheadline: { de: 'Von der Entdeckung der Heilquellen bis zum UNESCO-Welterbe — die Geschichte von Marienbad', en: 'From the discovery of healing springs to UNESCO World Heritage — the history of Marienbad' },
      ctaText: { de: 'Geschichte entdecken', en: 'Explore history' },
      ctaUrl: '#timeline',
    },
    faq: [
      { question: { de: 'Wann wurde Marienbad gegründet?', en: 'When was Marienbad founded?' }, answer: { de: 'Marienbad wurde 1808 offiziell als Kurort gegründet, obwohl die heilenden Quellen seit dem Mittelalter bekannt waren. Die Stadt erlebte ihre Blütezeit im 19. Jahrhundert.', en: 'Marienbad was officially founded as a spa town in 1808, although the healing springs had been known since the Middle Ages. The town experienced its golden age in the 19th century.' } },
      { question: { de: 'Ist Marienbad UNESCO-Welterbe?', en: 'Is Marienbad a UNESCO World Heritage Site?' }, answer: { de: 'Ja, Marienbad ist seit 2021 Teil des UNESCO-Welterbes "Bedeutende Kurstädte Europas" zusammen mit 10 anderen europäischen Kurstädten.', en: 'Yes, Marienbad has been a UNESCO World Heritage Site since 2021 as part of "The Great Spa Towns of Europe" along with 10 other European spa towns.' } },
    ],
    targetKeywords: [
      { keyword: 'Marienbad history' },
      { keyword: 'UNESCO spa towns' },
      { keyword: 'Goethe Marienbad' },
    ],
    status: 'published' as const,
    publishedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    title: { de: 'Praktische Informationen', en: 'Practical Information' },
    slug: { de: 'praktische-informationen', en: 'practical-info' },
    type: 'info-hub' as const,
    hero: {
      headline: { de: 'Ihr Besuch in Marienbad', en: 'Your Visit to Marienbad' },
      subheadline: { de: 'Anreise, Wetter, Geld, Notfallnummern — alles was Sie für Ihren Aufenthalt wissen müssen', en: 'Getting there, weather, currency, emergency numbers — everything you need for your stay' },
      ctaText: { de: 'Informationen lesen', en: 'Read info' },
      ctaUrl: '#getting-there',
    },
    targetKeywords: [
      { keyword: 'Marienbad travel info' },
      { keyword: 'how to get to Mariánské Lázně' },
    ],
    status: 'published' as const,
    publishedAt: '2026-03-01T00:00:00.000Z',
  },
]

// ─── Articles (Cluster) ──────────────────────────────────────
export const seedArticles = [
  {
    title: { de: 'Römische Bäder: Ein vollständiger Leitfaden', en: 'Roman Baths: A Complete Guide' },
    slug: { de: 'roemische-baeder-leitfaden', en: 'roman-baths-guide' },
    type: 'cluster' as const,
    parentPillarSlug: 'mineral-springs',
    categorySlug: 'mineral-springs',
    authorEmail: 'helena@marienbad.com',
    excerpt: { de: 'Die historischen Römischen Bäder im Nové Lázně gehören zu den beeindruckendsten Spa-Einrichtungen Mitteleuropas.', en: 'The historic Roman Baths in Nové Lázně are among the most magnificent spa facilities in Central Europe.' },
    tags: [{ tag: 'roman-baths' }, { tag: 'spa' }, { tag: 'nove-lazne' }],
    ensanaCTA: {
      enabled: true,
      headline: { de: 'Römische Bäder erleben', en: 'Experience the Roman Baths' },
      text: { de: 'Nur Gäste des Ensana Nové Lázně haben Zugang zum Königlichen Römischen Bad.', en: 'Only guests of Ensana Nové Lázně have access to the Royal Roman Bath.' },
      url: 'https://www.ensanahotels.com/nove-lazne/treatments/roman-baths',
      position: 'sidebar' as const,
    },
    status: 'published' as const,
    publishedAt: '2026-03-05T00:00:00.000Z',
  },
  {
    title: { de: 'CO2-Bäder: Wissenschaft & Vorteile', en: 'CO2 Baths: Science & Benefits' },
    slug: { de: 'co2-baeder-wissenschaft', en: 'co2-baths-science' },
    type: 'cluster' as const,
    parentPillarSlug: 'mineral-springs',
    categorySlug: 'mineral-springs',
    authorEmail: 'helena@marienbad.com',
    excerpt: { de: 'Kohlensäurebäder sind eine einzigartige Marienbader Behandlung mit wissenschaftlich belegten Vorteilen für Herz-Kreislauf-Gesundheit.', en: 'Carbon dioxide baths are a unique Marienbad treatment with scientifically proven cardiovascular health benefits.' },
    tags: [{ tag: 'co2-baths' }, { tag: 'science' }, { tag: 'cardiovascular' }],
    status: 'published' as const,
    publishedAt: '2026-03-06T00:00:00.000Z',
  },
  {
    title: { de: 'Wellness vs. Medizinisches Spa: Was ist richtig für Sie?', en: 'Wellness vs. Medical Spa: What\'s Right for You?' },
    slug: { de: 'wellness-vs-medizinisches-spa', en: 'wellness-vs-medical-spa' },
    type: 'expert' as const,
    parentPillarSlug: 'mineral-springs',
    categorySlug: 'wellness',
    authorEmail: 'helena@marienbad.com',
    excerpt: { de: 'Verstehen Sie den Unterschied zwischen Wellness-Aufenthalten und medizinischen Kurbehandlungen in Marienbad.', en: 'Understand the difference between wellness stays and medical spa treatments in Marienbad.' },
    tags: [{ tag: 'wellness' }, { tag: 'medical-spa' }, { tag: 'comparison' }],
    status: 'published' as const,
    publishedAt: '2026-03-07T00:00:00.000Z',
  },
  {
    title: { de: 'Die Singende Fontäne: Geschichte & Spielzeiten', en: 'The Singing Fountain: History & Showtimes' },
    slug: { de: 'singende-fontaene', en: 'singing-fountain' },
    type: 'cluster' as const,
    parentPillarSlug: 'things-to-do',
    categorySlug: 'things-to-do',
    authorEmail: 'petra@marienbad.com',
    excerpt: { de: 'Alles über Marienbads berühmte Singende Fontäne — Geschichte, Spielzeiten und die beste Sitzposition.', en: 'Everything about Marienbad\'s famous Singing Fountain — history, showtimes, and the best viewing spots.' },
    tags: [{ tag: 'singing-fountain' }, { tag: 'landmark' }, { tag: 'must-see' }],
    status: 'published' as const,
    publishedAt: '2026-03-05T00:00:00.000Z',
  },
  {
    title: { de: 'Top 10 Wanderwege rund um Marienbad', en: 'Top 10 Hiking Trails Around Marienbad' },
    slug: { de: 'top-10-wanderwege', en: 'top-10-hiking-trails' },
    type: 'listicle' as const,
    parentPillarSlug: 'things-to-do',
    categorySlug: 'things-to-do',
    authorEmail: 'petra@marienbad.com',
    excerpt: { de: 'Die schönsten Wanderwege in und um Marienbad — von leichten Spaziergängen bis zu anspruchsvollen Touren.', en: 'The most beautiful hiking trails in and around Marienbad — from easy walks to challenging tours.' },
    tags: [{ tag: 'hiking' }, { tag: 'nature' }, { tag: 'outdoor' }],
    status: 'published' as const,
    publishedAt: '2026-03-08T00:00:00.000Z',
  },
  {
    title: { de: 'Goethe in Marienbad: Eine Liebesgeschichte', en: 'Goethe in Marienbad: A Love Story' },
    slug: { de: 'goethe-in-marienbad', en: 'goethe-in-marienbad' },
    type: 'cluster' as const,
    parentPillarSlug: 'history',
    categorySlug: 'history',
    authorEmail: 'jan@marienbad.com',
    excerpt: { de: 'Die Geschichte von Goethes Besuchen in Marienbad und seiner unsterblichen „Marienbader Elegie".', en: 'The story of Goethe\'s visits to Marienbad and his immortal "Marienbad Elegy".' },
    tags: [{ tag: 'goethe' }, { tag: 'literature' }, { tag: 'elegy' }],
    status: 'published' as const,
    publishedAt: '2026-03-04T00:00:00.000Z',
  },
  {
    title: { de: 'UNESCO Welterbe: Große Kurstädte Europas', en: 'UNESCO World Heritage: Great Spa Towns of Europe' },
    slug: { de: 'unesco-welterbe-kurstadte', en: 'unesco-world-heritage-spa-towns' },
    type: 'cluster' as const,
    parentPillarSlug: 'history',
    categorySlug: 'history',
    authorEmail: 'jan@marienbad.com',
    excerpt: { de: 'Marienbad als Teil des UNESCO-Welterbes — was die Auszeichnung bedeutet und warum sie verdient ist.', en: 'Marienbad as a UNESCO World Heritage Site — what the designation means and why it\'s deserved.' },
    tags: [{ tag: 'unesco' }, { tag: 'world-heritage' }, { tag: 'preservation' }],
    status: 'published' as const,
    publishedAt: '2026-03-03T00:00:00.000Z',
  },
  {
    title: { de: 'Die 5 besten Hotels in Marienbad', en: 'The 5 Best Hotels in Marienbad' },
    slug: { de: 'die-5-besten-hotels', en: '5-best-hotels' },
    type: 'listicle' as const,
    parentPillarSlug: 'accommodation',
    categorySlug: 'accommodation',
    authorEmail: 'petra@marienbad.com',
    excerpt: { de: 'Von Grandhotels der Belle Époque bis zu modernen Spa-Resorts — unsere Top-5-Empfehlungen für jeden Geschmack.', en: 'From Belle Époque grand hotels to modern spa resorts — our top 5 picks for every taste.' },
    tags: [{ tag: 'hotels' }, { tag: 'review' }, { tag: 'best-of' }],
    ensanaCTA: {
      enabled: true,
      headline: { de: 'Ensana Hotels in Marienbad', en: 'Ensana Hotels in Marienbad' },
      text: { de: '5 historische Hotels, alle mit Spa-Behandlungen. Bestpreisgarantie bei Direktbuchung.', en: '5 historic hotels, all with spa treatments. Best price guarantee when booking directly.' },
      url: 'https://www.ensanahotels.com/marienbad',
      position: 'bottom' as const,
    },
    status: 'published' as const,
    publishedAt: '2026-03-09T00:00:00.000Z',
  },
]

// ─── People Stories ──────────────────────────────────────────
export const seedPeopleStories = [
  {
    name: 'Helga',
    country: { de: 'Österreich', en: 'Austria' },
    visitNumber: '23',
    headline: 'Helga, Österreich. Zum 23. Mal.',
    pullQuote: 'Diese Stadt hat mich geheilt, als Ärzte aufgegeben hatten.',
    originalLanguage: 'de' as const,
    archetype: 'loyal' as const,
    status: 'published' as const,
    publishedAt: '2026-02-15T00:00:00.000Z',
  },
  {
    name: 'James',
    country: { de: 'Großbritannien', en: 'United Kingdom' },
    visitNumber: 'First time',
    headline: 'James, United Kingdom. First time.',
    pullQuote: 'I came for the spa, but the Singing Fountain made me book a second week.',
    originalLanguage: 'en' as const,
    archetype: 'first-visit' as const,
    status: 'published' as const,
    publishedAt: '2026-02-20T00:00:00.000Z',
  },
  {
    name: 'Наталья',
    country: { de: 'Russland', en: 'Russia' },
    visitNumber: '7',
    headline: 'Наталья, Россия. В 7-й раз.',
    pullQuote: 'Когда я приезжаю сюда, мой артрит отступает на полгода.',
    originalLanguage: 'ru' as const,
    archetype: 'healing' as const,
    status: 'published' as const,
    publishedAt: '2026-02-25T00:00:00.000Z',
  },
  {
    name: 'Karl & Ingrid',
    country: { de: 'Deutschland', en: 'Germany' },
    visitNumber: '35',
    headline: 'Karl & Ingrid, Deutschland. Zum 35. Mal.',
    pullQuote: 'Wir haben uns 1991 an der Kreuzquelle kennengelernt. Jetzt kommen wir jeden Frühling.',
    originalLanguage: 'de' as const,
    archetype: 'love' as const,
    status: 'published' as const,
    publishedAt: '2026-03-01T00:00:00.000Z',
    ensanaMention: { mentioned: true, context: 'Karl mentioned staying at Nové Lázně for the Roman Baths.' },
  },
  {
    name: 'Tomáš',
    country: { de: 'Tschechien', en: 'Czech Republic' },
    visitNumber: 'Whole life',
    headline: 'Tomáš, Mariánské Lázně. Celý život.',
    pullQuote: 'Vyrostl jsem tady. Každý den chodím na kolonádu a nikdy se mi to neomrzí.',
    originalLanguage: 'cs' as const,
    archetype: 'local' as const,
    status: 'published' as const,
    publishedAt: '2026-03-05T00:00:00.000Z',
  },
  {
    name: 'Yuki',
    country: { de: 'Japan', en: 'Japan' },
    visitNumber: '2',
    headline: 'Yuki, Japan. Second visit.',
    pullQuote: 'The architecture reminded me of Ghibli films. I had to come back.',
    originalLanguage: 'en' as const,
    archetype: 'faraway' as const,
    status: 'published' as const,
    publishedAt: '2026-03-07T00:00:00.000Z',
  },
]

// ─── Events ──────────────────────────────────────────────────
export const seedEvents = [
  {
    title: { de: 'Chopin-Festival 2026', en: 'Chopin Festival 2026' },
    slug: 'chopin-festival-2026',
    startDate: '2026-08-14T18:00:00.000Z',
    endDate: '2026-08-22T22:00:00.000Z',
    location: { de: 'Gesellschaftshaus Casino', en: 'Casino Social House' },
    category: 'culture' as const,
    status: 'upcoming' as const,
  },
  {
    title: { de: 'Saisoneröffnung der Singenden Fontäne', en: 'Singing Fountain Season Opening' },
    slug: 'singing-fountain-opening-2026',
    startDate: '2026-05-01T17:00:00.000Z',
    endDate: '2026-05-01T21:00:00.000Z',
    location: { de: 'Hlavní kolonáda', en: 'Main Colonnade' },
    category: 'festival' as const,
    status: 'upcoming' as const,
  },
  {
    title: { de: 'Marienbad Golf Masters', en: 'Marienbad Golf Masters' },
    slug: 'marienbad-golf-masters-2026',
    startDate: '2026-06-20T08:00:00.000Z',
    endDate: '2026-06-22T18:00:00.000Z',
    location: { de: 'Royal Golf Club Marienbad', en: 'Royal Golf Club Marienbad' },
    category: 'sport' as const,
    status: 'upcoming' as const,
  },
  {
    title: { de: 'Wellness-Woche', en: 'Wellness Week' },
    slug: 'wellness-week-2026',
    startDate: '2026-09-07T09:00:00.000Z',
    endDate: '2026-09-13T17:00:00.000Z',
    location: { de: 'Verschiedene Hotels', en: 'Various Hotels' },
    category: 'wellness' as const,
    isEnsanaEvent: true,
    ensanaLink: 'https://www.ensanahotels.com/marienbad/wellness-week',
    status: 'upcoming' as const,
  },
  {
    title: { de: 'Weihnachtsmarkt Marienbad', en: 'Marienbad Christmas Market' },
    slug: 'christmas-market-2026',
    startDate: '2026-12-01T10:00:00.000Z',
    endDate: '2026-12-23T20:00:00.000Z',
    location: { de: 'Goethe-Platz', en: 'Goethe Square' },
    category: 'festival' as const,
    status: 'upcoming' as const,
  },
]

// ─── Navigation Global ──────────────────────────────────────
export const seedNavigation = {
  mainMenu: [
    { label: { de: 'Mineralquellen', en: 'Mineral Springs' }, url: '/mineral-springs', children: [
      { label: { de: 'Römische Bäder', en: 'Roman Baths' }, url: '/mineral-springs/roman-baths-guide' },
      { label: { de: 'CO2-Bäder', en: 'CO2 Baths' }, url: '/mineral-springs/co2-baths-science' },
    ]},
    { label: { de: 'Aktivitäten', en: 'Things to Do' }, url: '/things-to-do', children: [
      { label: { de: 'Singende Fontäne', en: 'Singing Fountain' }, url: '/things-to-do/singing-fountain' },
      { label: { de: 'Wandern', en: 'Hiking' }, url: '/things-to-do/top-10-hiking-trails' },
    ]},
    { label: { de: 'Unterkunft', en: 'Accommodation' }, url: '/accommodation' },
    { label: { de: 'Geschichte', en: 'History' }, url: '/history', children: [
      { label: { de: 'Goethe in Marienbad', en: 'Goethe in Marienbad' }, url: '/history/goethe-in-marienbad' },
      { label: { de: 'UNESCO Welterbe', en: 'UNESCO Heritage' }, url: '/history/unesco-world-heritage-spa-towns' },
    ]},
    { label: { de: 'Menschen', en: 'People' }, url: '/people' },
    { label: { de: 'Magazin', en: 'Magazine' }, url: '/magazine' },
  ],
}

// ─── Footer Global ──────────────────────────────────────────
export const seedFooter = {
  aboutText: {
    de: 'Marienbad.com ist der offizielle Reiseführer für Mariánské Lázně (Marienbad), Tschechien. Entdecken Sie heilende Mineralquellen, UNESCO-Welterbe und über 200 Jahre Spa-Tradition.',
    en: 'Marienbad.com is the official travel guide for Mariánské Lázně (Marienbad), Czech Republic. Discover healing mineral springs, UNESCO World Heritage, and over 200 years of spa tradition.',
  },
  quickLinks: [
    { label: { de: 'Mineralquellen', en: 'Mineral Springs' }, url: '/mineral-springs' },
    { label: { de: 'Aktivitäten', en: 'Things to Do' }, url: '/things-to-do' },
    { label: { de: 'Unterkunft', en: 'Accommodation' }, url: '/accommodation' },
    { label: { de: 'Praktische Infos', en: 'Practical Info' }, url: '/practical-info' },
    { label: { de: 'Menschen der Kolonnade', en: 'People of the Colonnade' }, url: '/people' },
    { label: { de: 'Impressum', en: 'Legal Notice' }, url: '/legal' },
    { label: { de: 'Datenschutz', en: 'Privacy Policy' }, url: '/privacy' },
  ],
  socialLinks: {
    instagram: 'https://instagram.com/marienbad.com',
    facebook: 'https://facebook.com/marienbad.official',
    youtube: 'https://youtube.com/@marienbad',
  },
}

// ─── SiteSettings Global ────────────────────────────────────
export const seedSiteSettings = {
  siteTitle: { de: 'Marienbad.com', en: 'Marienbad.com' },
  siteDescription: {
    de: 'Offizieller Reiseführer für Mariánské Lázně (Marienbad) — Heilquellen, Spa, UNESCO-Welterbe',
    en: 'Official travel guide to Mariánské Lázně (Marienbad) — healing springs, spa, UNESCO World Heritage',
  },
}

// ─── Seed Runner ─────────────────────────────────────────────
export async function seed(payload: Payload) {
  console.log('🌱 Seeding Marienbad CMS...')

  // 1. Categories
  console.log('  → Categories')
  const categoryMap: Record<string, string> = {}
  for (const cat of seedCategories) {
    const created = await payload.create({
      collection: 'categories',
      data: { name: cat.name.en, slug: cat.slug, description: cat.description.en },
    })
    categoryMap[cat.slug] = created.id as string
  }

  // 2. Authors
  console.log('  → Authors')
  const authorMap: Record<string, string> = {}
  for (const author of seedAuthors) {
    const created = await payload.create({
      collection: 'authors',
      data: author,
    })
    authorMap[author.email] = created.id as string
  }

  // 3. Pages
  console.log('  → Pages')
  const pageMap: Record<string, string> = {}
  for (const page of seedPages) {
    const created = await payload.create({
      collection: 'pages',
      data: {
        title: page.title.en,
        slug: page.slug.en,
        type: page.type,
        hero: {
          headline: page.hero.headline.en,
          subheadline: page.hero.subheadline.en,
          ctaText: page.hero.ctaText.en,
          ctaUrl: page.hero.ctaUrl,
        },
        faq: page.faq?.map(f => ({ question: f.question.en, answer: f.answer.en })),
        ensanaCTA: page.ensanaCTA ? {
          enabled: page.ensanaCTA.enabled,
          headline: page.ensanaCTA.headline.en,
          text: page.ensanaCTA.text.en,
          url: page.ensanaCTA.url,
          position: page.ensanaCTA.position,
        } : undefined,
        targetKeywords: page.targetKeywords,
        status: page.status,
        publishedAt: page.publishedAt,
      },
    })
    pageMap[page.slug.en] = created.id as string
  }

  // 4. Articles
  console.log('  → Articles')
  for (const article of seedArticles) {
    await payload.create({
      collection: 'articles',
      data: {
        title: article.title.en,
        slug: article.slug.en,
        type: article.type,
        parentPillar: article.parentPillarSlug ? pageMap[article.parentPillarSlug] : undefined,
        category: article.categorySlug ? categoryMap[article.categorySlug] : undefined,
        author: article.authorEmail ? authorMap[article.authorEmail] : undefined,
        excerpt: article.excerpt.en,
        content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Content to be added by editorial team.', version: 1 }], version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
        tags: article.tags,
        ensanaCTA: article.ensanaCTA ? {
          enabled: article.ensanaCTA.enabled,
          headline: article.ensanaCTA.headline.en,
          text: article.ensanaCTA.text.en,
          url: article.ensanaCTA.url,
          position: article.ensanaCTA.position,
        } : undefined,
        status: article.status,
        publishedAt: article.publishedAt,
      },
    })
  }

  // 5. People Stories (skip portrait upload — needs actual files)
  console.log('  → People Stories (metadata only — portraits need manual upload)')

  // 6. Events
  console.log('  → Events')
  for (const event of seedEvents) {
    await payload.create({
      collection: 'events',
      data: {
        title: event.title.en,
        slug: event.slug,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location.en,
        category: event.category,
        isEnsanaEvent: (event as any).isEnsanaEvent || false,
        ensanaLink: (event as any).ensanaLink,
        status: event.status,
      },
    })
  }

  // 7. Globals
  console.log('  → Navigation')
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      mainMenu: seedNavigation.mainMenu.map(item => ({
        label: item.label.en,
        url: item.url,
        children: item.children?.map(child => ({
          label: child.label.en,
          url: child.url,
        })),
      })),
    },
  })

  console.log('  → Footer')
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      aboutText: seedFooter.aboutText.en,
      quickLinks: seedFooter.quickLinks.map(link => ({
        label: link.label.en,
        url: link.url,
      })),
      socialLinks: seedFooter.socialLinks,
    },
  })

  console.log('  → Site Settings')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteTitle: seedSiteSettings.siteTitle.en,
      siteDescription: seedSiteSettings.siteDescription.en,
    },
  })

  console.log('✅ Seed complete!')
}
