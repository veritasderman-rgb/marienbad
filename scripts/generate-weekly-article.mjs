#!/usr/bin/env node
/**
 * Weekly article generator for marienbad.com
 *
 * NOTE: this script is NO LONGER run by CI. The GitHub Action that used to
 * invoke it (.github/workflows/weekly-article.yml) never once fired on its
 * schedule — every registered run failed at startup without executing a single
 * job — so it was removed. The weekly article is now produced by a scheduled
 * Claude routine instead, which does the same job with better verification
 * (it can check facts against live external sources, which this script cannot).
 *
 * The file is kept as the editorial source of truth for that routine:
 *   - TOPIC_BACKLOG    — remaining topics, with per-topic fact guardrails
 *   - TONE             — tone, SEO and word-count spec
 *   - GRAPHIC_COMPONENTS — the graphic patterns available in this codebase
 * Update TOPIC_BACKLOG here when adding new topics.
 *
 * It can still be run by hand (requires ANTHROPIC_API_KEY):
 *   node scripts/generate-weekly-article.mjs
 * Flow when run manually:
 *   1. Pick next uncovered topic from backlog
 *   2. Generate CS article via Claude
 *   3. Verify Phase A — cross-check facts against knowledge base JSON
 *   4. Verify Phase B — Claude's own knowledge flags medical/historical errors
 *   5. Apply corrections if needed
 *   6. Localize CS → DE / EN / RU (cultural adaptation, not translation)
 *   7. Write 4 draft files to src/content/articles/
 *   8. Write PR metadata to /tmp/
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'src/content/articles');
const KB_PATH = path.join(ROOT, 'data/ensana_knowledge_base.json');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const DRY_RUN = process.env.DRY_RUN === 'true';
const TOPIC_OVERRIDE = process.env.TOPIC_ID?.trim() || '';

// ─── Topic backlog ─────────────────────────────────────────────────────────────
// Topics not yet covered in any locale. Add new ones at the top so they're
// picked up before older entries after the backlog grows.

const TOPIC_BACKLOG = [
  {
    id: 'chopin-music-festival',
    category: 'culture',
    articleType: 'cluster',
    graphicType: 'timeline',
    graphicNote:
      'Horizontal CSS timeline (no JS required): September 1835, Dresden — Chopin gives Maria Wodzińska the autograph "Pour Mlle Marie" of the "Farewell" Waltz in A♭, Op. 69 No. 1 ("L\'Adieu") → 28 July 1836 — Chopin arrives in Mariánské Lázně to join the Wodziński family (there since 9 July), lodging at the "White Swan" inn until 24 August → August 1836 — a month together: music-making and walks by the springs and spa promenade (the cast-iron Main Colonnade did not yet exist — it was built 1888–89) → 9 September 1836, Dresden — Chopin proposes; Maria accepts on the condition he safeguard his fragile health (a secret engagement) → 1837 — the Wodziński family quietly lets the engagement lapse → 6 June 1959 — Fryderyk Chopin Society founded in Mariánské Lázně, first festival held → International Chopin Festival held annually since, in the third week of August. NOTE for the writer: the "Farewell" Waltz Op. 69 No. 1 was gifted in 1835, NOT at the 1836 proposal; Waltz Op. 34 No. 1 was composed at Děčín (Tetschen) in 1835 — neither belongs to the August 1836 Marienbad stay; and do NOT call the 1836 promenade "the colonnade" (that structure dates to 1888–89).',
    titles: {
      cs: 'Chopin a Mariánské Lázně — hudební dědictví velkého romantika',
      de: 'Chopin und Marienbad — das musikalische Erbe des großen Romantikers',
      en: 'Chopin and Mariánské Lázně — the Musical Heritage of the Great Romantic',
      ru: 'Шопен и Марианские Лазни — музыкальное наследие великого романтика',
    },
    primaryKeyword: {
      cs: 'Chopin Mariánské Lázně festival',
      de: 'Chopin Marienbad Musikfestival',
      en: 'Chopin festival Mariánské Lázně',
      ru: 'фестиваль Шопена Марианские Лазни',
    },
  },
  {
    id: 'digital-detox-spa',
    category: 'wellness',
    articleType: 'cluster',
    graphicType: 'counter',
    graphicNote:
      'Animated stat counter (IntersectionObserver, reuses existing .reveal pattern): "7 dní bez notifikací" / "42 km procházek" / "21 sklenek od pramene" (3 servings of 200-300 ml per day — matches the published drinking-cure guidance; do NOT quote litres of mineral water per day) — fade-up numbers triggered on scroll.',
    titles: {
      cs: 'Digitální detox v lázních — jak se skutečně odpojit od světa',
      de: 'Digitaler Detox im Kurort — wie man wirklich abschaltet',
      en: 'Digital Detox at the Spa — how to truly disconnect',
      ru: 'Цифровой детокс на курорте — как по-настоящему отключиться',
    },
    primaryKeyword: {
      cs: 'digitální detox lázně Mariánské Lázně',
      de: 'digitaler Detox Kurbad Marienbad',
      en: 'digital detox spa retreat Czech Republic',
      ru: 'цифровой детокс курорт Марианские Лазни',
    },
  },
  {
    id: 'new-year-spa',
    category: 'activities',
    articleType: 'guide',
    graphicType: 'timeline',
    graphicNote:
      'Mini event timeline (CSS flex, no JS): Dec 26 colonnade lights → Dec 31 New Year concert at the colonnade → Jan 1 New Year walking cure → low-season spa package window.',
    titles: {
      cs: 'Silvestr a Nový rok v Mariánských Lázních — tiché i slavnostní oslavy',
      de: 'Silvester und Neujahr in Marienbad — stille und festliche Feiern',
      en: 'New Year\'s Eve in Mariánské Lázně — quiet and festive celebrations',
      ru: 'Новый год и Рождество в Марианских Лазнях — тихий и праздничный отдых',
    },
    primaryKeyword: {
      cs: 'Silvestr Mariánské Lázně lázně',
      de: 'Silvester Marienbad Kurort',
      en: 'New Year\'s Eve Mariánské Lázně spa',
      ru: 'новый год Марианские Лазни курорт',
    },
  },
  {
    id: 'weight-management-spa',
    category: 'healing',
    articleType: 'guide',
    graphicType: 'counter',
    graphicNote:
      'Animated stat block with 3 key numbers: "21 dní" (recommended cure length — the classic three-week Czech spa cure) / "8 000 kroků/den" (a realistic daily walking-cure target on the colonnade promenades — a general wellness goal, not a medical prescription) / "¾ litru denně" (typical prescribed volume of the mineral-water drinking cure from the Glauber-salt springs, e.g. Křížový / Ferdinandův pramen). Simple, factual, reassuring. NOTE for the writer: the mineral-water drinking cure (pitná kúra) is ALWAYS individualised and prescribed by a spa physician — do NOT state a fixed high volume such as "3 litry denně". The sulphate (Glauberova sůl) springs already act as a laxative at about ¾ litre per day, so a multi-litre daily intake would be medically wrong and potentially harmful. The standard Mariánské Lázně recommendation is a modest volume — roughly ½–¾ litre per day for these sulphate springs — always adjusted to the patient\'s diagnosis and taken in small doses before meals rather than as a fixed daily quota. Weight/metabolic indications are served above all by the Cross Spring (Křížový pramen) and Ferdinand Spring (Ferdinandův pramen) — obesity, metabolic disorders, diabetes, gout.',
    titles: {
      cs: 'Hubnutí a metabolická léčba v lázních — jak funguje lázeňská kúra na váhu',
      de: 'Gewichtsmanagement im Kurort — wie die Kur den Stoffwechsel reguliert',
      en: 'Weight Management at the Spa — how the cure regulates your metabolism',
      ru: 'Лечение веса на курорте — как курс лечения регулирует обмен веществ',
    },
    primaryKeyword: {
      cs: 'hubnutí lázně metabolická léčba',
      de: 'Gewichtsreduktion Kurbad Marienbad',
      en: 'weight management spa treatment Marienbad',
      ru: 'снижение веса санаторий Марианские Лазни',
    },
  },
  {
    id: 'autumn-spa-season',
    category: 'planning',
    articleType: 'cluster',
    graphicType: 'season-wheel',
    graphicNote:
      'SVG or CSS season wheel (4 quadrants: spring / summer / autumn / winter) with autumn highlighted and annotated — lower crowds, mushroom season in Slavkovský forest, harvest festivals, best spa availability.',
    titles: {
      cs: 'Podzim v Mariánských Lázních — zlatá sezóna pro lázeňský pobyt',
      de: 'Herbst in Marienbad — goldene Saison für den Kuraufenthalt',
      en: 'Autumn in Mariánské Lázně — the Golden Season for a Spa Stay',
      ru: 'Осень в Марианских Лазнях — золотой сезон для курортного отдыха',
    },
    primaryKeyword: {
      cs: 'podzim Mariánské Lázně lázně',
      de: 'Herbst Marienbad Kurort',
      en: 'autumn spa Mariánské Lázně',
      ru: 'осень Марианские Лазни',
    },
  },
  {
    id: 'spa-for-young-adults',
    category: 'wellness',
    articleType: 'cluster',
    graphicType: 'counter',
    graphicNote:
      'Counter infographic targeting younger visitor misconceptions: "průměrný věk nových pacientů klesá", "30 % návštěvníků pod 45 let", "burnout = nejrychleji rostoucí indikace 2024".',
    titles: {
      cs: 'Lázně nejsou jen pro seniory — proč mladí lidé objevují Mariánské Lázně',
      de: 'Kurorte sind nicht nur für Senioren — warum junge Menschen Marienbad entdecken',
      en: 'Spas Are Not Just for Seniors — why younger people are discovering Mariánské Lázně',
      ru: 'Курорты не только для пожилых — почему молодёжь открывает Марианские Лазни',
    },
    primaryKeyword: {
      cs: 'lázně pro mladé Mariánské Lázně wellness',
      de: 'Kurbad für Junge Marienbad Wellness',
      en: 'spa for young adults Mariánské Lázně',
      ru: 'курорт для молодых Марианские Лазни',
    },
  },
  {
    id: 'spring-blooms-colonnade',
    category: 'nature',
    articleType: 'cluster',
    graphicType: 'map',
    graphicNote:
      'Lightweight Leaflet map (reuses DestinationMap component) with "spring bloom" markers: colonnade park flower beds, Lesní pramen forest path, botanical garden paths — plus bloom calendar pop-ups.',
    titles: {
      cs: 'Jaro v Mariánských Lázních — kvetoucí parky a procházky u kolonády',
      de: 'Frühling in Marienbad — blühende Parks und Spaziergänge an der Kolonnade',
      en: 'Spring in Mariánské Lázně — Blooming Parks and Walks Along the Colonnade',
      ru: 'Весна в Марианских Лазнях — цветущие парки и прогулки у колоннады',
    },
    primaryKeyword: {
      cs: 'jaro Mariánské Lázně parky procházky',
      de: 'Frühling Marienbad Parks Kolonnade',
      en: 'spring Mariánské Lázně park colonnade',
      ru: 'весна Марианские Лазни парки',
    },
  },
  {
    id: 'spa-pregnancy-postnatal',
    category: 'healing',
    articleType: 'guide',
    graphicType: 'counter',
    graphicNote:
      'Informational stat block: safe treatment types for each trimester / post-natal phase — simple icon grid, no animation required. Static but visually clear.',
    titles: {
      cs: 'Lázně v těhotenství a po porodu — co je bezpečné a co si odpočinutá máma může dopřát',
      de: 'Kur in der Schwangerschaft und nach der Geburt — was sicher ist und was eine erholte Mutter genießen kann',
      en: 'Spa During Pregnancy and After Birth — what is safe and what a rested mother can enjoy',
      ru: 'Курорт во время беременности и после родов — что безопасно и что можно себе позволить',
    },
    primaryKeyword: {
      cs: 'lázně v těhotenství bezpečné procedury',
      de: 'Kurbad Schwangerschaft sichere Behandlungen',
      en: 'spa during pregnancy safe treatments',
      ru: 'санаторий при беременности безопасные процедуры',
    },
  },
];

// ─── Graphic component code snippets ──────────────────────────────────────────

const GRAPHIC_COMPONENTS = {
  map: {
    name: 'Interactive Map (Leaflet / DestinationMap)',
    snippet: `\`\`\`astro
<!-- Reuse existing DestinationMap.astro with a new marker category -->
<DestinationMap
  category="springs"   <!-- or: "architecture", "nature", "blooms" -->
  locale={locale}
  height="420px"
  client:visible
/>
\`\`\`
Add new marker entries in \`src/data/mapMarkers.ts\`.`,
  },
  timeline: {
    name: 'CSS Horizontal Timeline (no JS)',
    snippet: `\`\`\`astro
<!-- TimelineBlock.astro — pure CSS, keyboard navigable, accessible -->
<div class="timeline-rail" role="list" aria-label={label}>
  {events.map(e => (
    <div class="timeline-item" role="listitem">
      <time class="timeline-year font-heading text-turquoise-600">{e.year}</time>
      <p class="timeline-text text-sm">{e.label}</p>
    </div>
  ))}
</div>

<style>
  .timeline-rail { display: flex; gap: 2.5rem; overflow-x: auto;
                   padding-block: 1rem; scroll-snap-type: x mandatory; }
  .timeline-item { scroll-snap-align: start; min-width: 10rem;
                   border-left: 3px solid var(--color-turquoise); padding-left: .75rem; }
</style>
\`\`\``,
  },
  counter: {
    name: 'Animated Stat Counter (Markdoc {% stat-counter %} tag)',
    snippet: `Drop this straight into the Markdoc body — the \`stat-counter\` / \`stat\` tags
are wired into \`src/markdoc/config.ts\` + \`MarkdocRenderer.astro\` and count up on
scroll (IntersectionObserver, \`prefers-reduced-motion\` aware). Whole numbers
animate; non-numeric values such as \`¾\` or \`30 %\` render statically.

\`\`\`markdoc
{% stat-counter caption="Lázeňská kúra v číslech" columns=3 %}
{% stat value="21" suffix=" dní" label="klasická délka lázeňské kúry" /%}
{% stat value="8 000" suffix=" kroků/den" label="reálný cíl chůze na kolonádě (obecné wellness doporučení, ne lékařský předpis)" /%}
{% stat value="¾" suffix=" litru denně" label="orientační objem pitné kúry ze sirných pramenů — vždy individuálně dle lékaře" /%}
{% /stat-counter %}
\`\`\``,
  },
  'season-wheel': {
    name: 'Season Calendar / Wheel (CSS)',
    snippet: `\`\`\`astro
<!-- SeasonCalendar.astro — 12-cell CSS grid, highlighted season, accessible -->
<div class="season-grid grid grid-cols-4 sm:grid-cols-6 gap-1"
     role="table" aria-label={label}>
  {months.map(m => (
    <div class={["month-cell p-2 rounded text-center text-xs",
                 m.highlighted ? "bg-yellow-400 font-bold" : "bg-beige-100"].join(' ')}
         role="cell">
      <span class="block text-lg" aria-hidden="true">{m.icon}</span>
      {m.name}
    </div>
  ))}
</div>
\`\`\``,
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function slugify(str) {
  const diacritics = [
    [/[áàâ]/g, 'a'], [/ä/g, 'ae'], [/[čć]/g, 'c'], [/[ďd̂]/g, 'd'],
    [/[éèêě]/g, 'e'], [/í/g, 'i'], [/ň/g, 'n'], [/[óôö]/g, 'o'],
    [/ö/g, 'oe'], [/[řŕ]/g, 'r'], [/[šś]/g, 's'], [/[ťt̂]/g, 't'],
    [/[úùûůü]/g, 'u'], [/ü/g, 'ue'], [/[ýỳ]/g, 'y'], [/[žź]/g, 'z'],
    [/ß/g, 'ss'],
    // Cyrillic → Latin
    [/а/g,'a'],[/б/g,'b'],[/в/g,'v'],[/г/g,'g'],[/д/g,'d'],[/е/g,'e'],
    [/ё/g,'yo'],[/ж/g,'zh'],[/з/g,'z'],[/и/g,'i'],[/й/g,'j'],[/к/g,'k'],
    [/л/g,'l'],[/м/g,'m'],[/н/g,'n'],[/о/g,'o'],[/п/g,'p'],[/р/g,'r'],
    [/с/g,'s'],[/т/g,'t'],[/у/g,'u'],[/ф/g,'f'],[/х/g,'kh'],[/ц/g,'ts'],
    [/ч/g,'ch'],[/ш/g,'sh'],[/щ/g,'shch'],[/ы/g,'y'],[/[ьъ]/g,''],
    [/э/g,'e'],[/ю/g,'yu'],[/я/g,'ya'],
  ];
  let s = str.toLowerCase();
  for (const [pattern, replacement] of diacritics) s = s.replace(pattern, replacement);
  return s.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function existingSlugs() {
  if (!fs.existsSync(ARTICLES_DIR)) return new Set();
  return new Set(fs.readdirSync(ARTICLES_DIR));
}

function articleDirName(locale, title) {
  return `${locale}-${slugify(title)}`;
}

function estimateReadingTime(body) {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(Math.round(words / 200), 3)} min`;
}

// First non-heading line with >60 chars — used as excerpt / meta description seed
function firstSubstantiveLine(body, maxLen = 160) {
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (t.length > 60 && !t.startsWith('#') && !t.startsWith('-') && !t.startsWith('*')) {
      return t.slice(0, maxLen);
    }
  }
  return '';
}

// ─── Prompts ───────────────────────────────────────────────────────────────────

const TONE = `
TONE & STYLE:
- Warm, professional, evocative — like a knowledgeable local guide, not a brochure
- Respectful of 200+ years of spa tradition; use precise historical facts
- Primary audience: health-conscious visitors planning a spa stay
- Never use urgency marketing ("Jetzt buchen!", "Rezervujte nyní!")
- Ensana mentions: max 2, contextual ("Pitná kúra z Lesního pramene je dostupná přímo v lobby Centrálních Lázní")
- Suggest 2–3 internal links using [anchor text](/path) placeholders
SEO:
- Primary keyword in H1, first paragraph, at least one H2, meta description
- Secondary keywords distributed naturally, never stuffed
WORD COUNT by type: cluster 1200–1800 | guide 1500–2500 | pillar 2000–3000 | faq 800–1200
FORMAT: Markdoc body only — ## for H2, ### for H3, **bold** sparingly, - for lists, no tables, no frontmatter
`.trim();

// The topic's graphicNote carries the verified chronology / key facts and any
// "NOTE" guard-rails (e.g. dates that must NOT be misattributed). Feed it into
// the writing prompts so the prose is built on the same vetted facts as the
// accompanying graphic — not just the KB and the model's own recall.
function graphicFacts(topic) {
  if (!topic.graphicNote) return '';
  return `
VERIFIED FACTS & FACT GUARDRAILS (authoritative — the article will carry a "${topic.graphicType}" graphic built from these):
Keep every factual claim in the prose consistent with the following, and strictly obey any guard-note marked "NOTE" about what must NOT be claimed. The bracketed rendering hints (e.g. "Horizontal CSS timeline") describe the graphic, not the prose — ignore them as instructions but honour the facts they carry.
${topic.graphicNote}
`;
}

function promptGenerate(topic, locale, kb) {
  const names = { cs: 'Czech', de: 'German', en: 'English', ru: 'Russian' };
  return `You are a travel writer for marienbad.com, the official tourism portal for Mariánské Lázně (Marienbad), Czech Republic. Write in ${names[locale]}.

${TONE}

KNOWLEDGE BASE (single source of truth for all factual claims):
${JSON.stringify(kb, null, 2)}
${graphicFacts(topic)}
TASK: Write a ${topic.articleType} article in ${names[locale]}.
TITLE: ${topic.titles[locale]}
PRIMARY KEYWORD: ${topic.primaryKeyword[locale]}
CATEGORY: ${topic.category}

Return ONLY the Markdoc article body. No frontmatter, no code fences.`;
}

function promptVerifyKB(body, locale, kb) {
  return `You are a fact-checker for marienbad.com. Review the article below against the knowledge base.

KNOWLEDGE BASE:
${JSON.stringify(kb, null, 2)}

ARTICLE (locale: ${locale}):
${body}

Return a JSON object — no other text:
{
  "verdict": "PASS" | "WARN" | "FAIL",
  "claims": [
    { "claim": "<quoted text from article>", "status": "VERIFIED" | "UNVERIFIED" | "INCORRECT", "note": "<brief explanation>" }
  ],
  "corrections": ["<specific correction instruction if any>"],
  "summary": "<1–2 sentences>"
}

verdict: PASS = no errors; WARN = unverified but plausible claims; FAIL = at least one claim contradicts the KB.`;
}

function promptVerifyGeneral(body) {
  return `Review the following article about Mariánské Lázně spa for:
1. Historically inaccurate statements (dates, names, events)
2. Medically misleading claims (treatment efficacy, contraindications)
3. Factual errors about Czech health-spa regulations or geography

ARTICLE:
${body}

Return JSON only — no other text:
{
  "verdict": "PASS" | "WARN",
  "issues": [{ "text": "<quote>", "concern": "<what's wrong or uncertain>" }],
  "summary": "<1 sentence>"
}`;
}

function promptLocalize(csBody, targetLocale, topic, kb) {
  const names = { de: 'German', en: 'English', ru: 'Russian' };
  const context = {
    de: 'Adapt for German-speaking readers (DE/AT/CH). Where relevant, mention driving distances from German cities (Munich 280 km, Frankfurt 410 km, Nuremberg 170 km, Berlin 420 km). Reference Krankenkasse/Kur regulations if they fit naturally.',
    en: 'Adapt for international English-speaking readers. Provide brief cultural context where Czech specifics might be unfamiliar. Use British English spelling.',
    ru: 'Adapt for Russian-speaking readers. Use formal register (вы). Mention that Czech Republic is Schengen if visa context is relevant. Transliterate Czech place names with Cyrillic equivalents on first use.',
  };
  return `You are a localizer for marienbad.com. Your task is NOT word-for-word translation but cultural localization — adapting content for ${names[targetLocale]}-speaking readers.

LOCALIZATION CONTEXT: ${context[targetLocale]}

TITLE in ${names[targetLocale]}: ${topic.titles[targetLocale]}
PRIMARY KEYWORD: ${topic.primaryKeyword[targetLocale]}

KNOWLEDGE BASE: ${JSON.stringify(kb, null, 2)}
${graphicFacts(topic)}

ORIGINAL CZECH ARTICLE:
${csBody}

Return ONLY the localized Markdoc body in ${names[targetLocale]}. Same structure as original. No frontmatter, no code fences.`;
}

function promptCorrect(body, corrections) {
  return `Apply the following corrections to the article:

CORRECTIONS:
${corrections.map((c, i) => `${i + 1}. ${c}`).join('\n')}

ARTICLE:
${body}

Return ONLY the corrected article body. No frontmatter, no code fences.`;
}

// ─── Claude helper ─────────────────────────────────────────────────────────────

async function ask(userPrompt, maxTokens = 4096) {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: userPrompt }],
  });
  return msg.content[0].text;
}

async function askJSON(userPrompt) {
  const raw = await ask(userPrompt, 2048);
  const match = raw.match(/\{[\s\S]*\}/);
  try {
    return JSON.parse(match ? match[0] : raw);
  } catch {
    return { verdict: 'WARN', claims: [], issues: [], corrections: [], summary: 'JSON parse error in verification response.' };
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🗞  marienbad.com — Weekly Article Generator\n');

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('✗  ANTHROPIC_API_KEY not set');
    process.exit(1);
  }

  const kb = JSON.parse(fs.readFileSync(KB_PATH, 'utf-8'));
  console.log('✓  Knowledge base loaded\n');

  // Pick topic
  const covered = existingSlugs();
  let topic;
  if (TOPIC_OVERRIDE) {
    topic = TOPIC_BACKLOG.find(t => t.id === TOPIC_OVERRIDE);
    if (!topic) { console.error(`✗  Topic '${TOPIC_OVERRIDE}' not found`); process.exit(1); }
  } else {
    topic = TOPIC_BACKLOG.find(t => {
      const csDir = articleDirName('cs', t.titles.cs);
      const deDir = articleDirName('de', t.titles.de);
      return !covered.has(csDir) && !covered.has(deDir);
    });
  }

  if (!topic) {
    console.log('✓  All backlog topics covered — nothing to generate.');
    fs.writeFileSync('/tmp/article-topic.txt', 'Backlog exhausted — no new topic');
    process.exit(0);
  }

  console.log(`📝  Topic    : ${topic.id}`);
  console.log(`    CS title : ${topic.titles.cs}`);
  console.log(`    Graphic  : ${topic.graphicType}\n`);

  // ── Phase 1: Generate CS ────────────────────────────────────────────────────
  console.log('⏳  Generating CS article...');
  let csBody = await ask(promptGenerate(topic, 'cs', kb));
  console.log(`✓  CS article (${csBody.split(/\s+/).length} words)\n`);

  // ── Phase 2A: Verify against knowledge base ─────────────────────────────────
  console.log('⏳  Verification A — knowledge base fact-check...');
  const verifyKB = await askJSON(promptVerifyKB(csBody, 'cs', kb));
  console.log(`✓  KB check: ${verifyKB.verdict} — ${verifyKB.claims?.length ?? 0} claims reviewed`);
  if (verifyKB.summary) console.log(`   ${verifyKB.summary}`);

  // ── Phase 2B: Verify via general knowledge ──────────────────────────────────
  console.log('\n⏳  Verification B — general knowledge audit...');
  const verifyGeneral = await askJSON(promptVerifyGeneral(csBody));
  console.log(`✓  General check: ${verifyGeneral.verdict} — ${verifyGeneral.issues?.length ?? 0} issues`);
  if (verifyGeneral.summary) console.log(`   ${verifyGeneral.summary}`);

  // ── Phase 3: Apply corrections if any ──────────────────────────────────────
  const corrections = [
    ...(verifyKB.corrections ?? []),
    ...(verifyGeneral.issues?.filter(i => i.concern).map(i => `Fix: "${i.text}" — ${i.concern}`) ?? []),
  ].filter(Boolean);

  if (corrections.length > 0) {
    console.log(`\n⏳  Applying ${corrections.length} correction(s)...`);
    csBody = await ask(promptCorrect(csBody, corrections));
    console.log('✓  Corrections applied');
  }

  // ── Phase 4: Localize to DE / EN / RU ──────────────────────────────────────
  const articles = { cs: csBody };
  for (const locale of ['de', 'en', 'ru']) {
    console.log(`\n⏳  Localizing → ${locale.toUpperCase()}...`);
    articles[locale] = await ask(promptLocalize(csBody, locale, topic, kb));
    console.log(`✓  ${locale.toUpperCase()} (${articles[locale].split(/\s+/).length} words)`);
  }

  // ── Phase 5: Write draft files ──────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  const graphic = GRAPHIC_COMPONENTS[topic.graphicType];
  const results = [];

  console.log();
  for (const [locale, body] of Object.entries(articles)) {
    const dirName = articleDirName(locale, topic.titles[locale]);
    const readingTime = estimateReadingTime(body);
    const excerpt = firstSubstantiveLine(body, 160);
    const metaDesc = firstSubstantiveLine(body, 155);

    const frontmatter = [
      '---',
      `title: ${topic.titles[locale]}`,
      'status: draft',
      `locale: ${locale}`,
      `category: ${topic.category}`,
      `articleType: ${topic.articleType}`,
      'excerpt: >-',
      `  ${excerpt || topic.titles[locale]}`,
      `date: '${today}'`,
      `readingTime: ${readingTime}`,
      `primaryKeyword: ${topic.primaryKeyword[locale]}`,
      'metaDescription: >-',
      `  ${metaDesc || topic.titles[locale]}`,
      '---',
    ].join('\n');

    const fullContent = `${frontmatter}\n${body}\n`;
    const articleDir = path.join(ARTICLES_DIR, dirName);

    results.push({ locale, dirName, words: body.split(/\s+/).length, readingTime });

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would write: src/content/articles/${dirName}/index.mdoc`);
    } else {
      fs.mkdirSync(articleDir, { recursive: true });
      fs.writeFileSync(path.join(articleDir, 'index.mdoc'), fullContent, 'utf-8');
      console.log(`✓  Written: src/content/articles/${dirName}/index.mdoc`);
    }
  }

  // ── Phase 6: Write PR metadata ──────────────────────────────────────────────
  const kbIssues = (verifyKB.claims ?? []).filter(c => c.status !== 'VERIFIED');
  const genIssues = verifyGeneral.issues ?? [];
  const overallVerdict = verifyKB.verdict === 'FAIL' ? 'FAIL'
    : (kbIssues.length > 0 || genIssues.length > 0) ? 'WARN' : 'PASS';

  const prTitle = `content: weekly article draft — ${topic.titles.de}`;
  const topicLine = `${topic.id} — ${topic.titles.cs}`;

  const fileTable = results
    .map(r => `| \`${r.locale}\` | \`${r.dirName}\` | ~${r.words} slov | ${r.readingTime} |`)
    .join('\n');

  const kbIssueRows = kbIssues
    .map(c => `| ${c.status === 'INCORRECT' ? '❌' : '⚠️'} | ${c.claim?.slice(0, 80) ?? ''} | ${c.note ?? ''} |`)
    .join('\n');

  const genIssueRows = genIssues
    .map(i => `| ⚠️ | ${i.text?.slice(0, 80) ?? ''} | ${i.concern ?? ''} |`)
    .join('\n');

  const prBody = `## Weekly Article Draft

**Topic ID:** \`${topic.id}\`
**Date:** ${today}
**Verification result:** ${overallVerdict === 'PASS' ? '✅ PASS' : overallVerdict === 'WARN' ? '⚠️ WARN' : '❌ FAIL'}

### Generated files (status: \`draft\`)

| Locale | Slug | Délka | Čas čtení |
|--------|------|-------|-----------|
${fileTable}

---

### Fact-check A — Knowledge Base (${verifyKB.verdict})

${verifyKB.summary ?? ''}

${kbIssueRows ? `| Status | Claim | Note |\n|--------|-------|------|\n${kbIssueRows}` : '✅ Všechny ověřitelné tvrzení souhlasí se znalostní bází.'}

### Fact-check B — General Knowledge Audit (${verifyGeneral.verdict})

${verifyGeneral.summary ?? ''}

${genIssueRows ? `| Status | Text | Problém |\n|--------|------|---------|\n${genIssueRows}` : '✅ Žádné historické ani medicínské problémy.'}

${corrections.length > 0 ? `### Opravy aplikované skriptem\n\n${corrections.map((c, i) => `${i + 1}. ${c}`).join('\n')}` : ''}

---

### Navrhovaná grafická komponenta — ${graphic.name}

> ${topic.graphicNote}

${graphic.snippet}

---

*Vygenerováno workflow \`.github/workflows/weekly-article.yml\`*
*Před publikací zkontrolovat obsah, přidat cover image a změnit \`status: draft\` → \`status: published\`.*
`;

  fs.writeFileSync('/tmp/article-topic.txt', topicLine);
  fs.writeFileSync('/tmp/article-pr-title.txt', prTitle);
  fs.writeFileSync('/tmp/article-pr-body.txt', prBody);

  console.log('\n─────────────────────────────────────────');
  console.log(`✅  Done — PR title: "${prTitle}"`);
  console.log(`   Verification: ${overallVerdict}`);
  console.log(`   Graphic: ${graphic.name}`);
  console.log(`   DRY RUN: ${DRY_RUN}`);
}

main().catch(err => {
  console.error('✗  Fatal:', err.message);
  process.exit(1);
});
