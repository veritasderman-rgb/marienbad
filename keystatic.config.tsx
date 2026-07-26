import { config, fields, singleton, collection } from '@keystatic/core'
import { block, wrapper } from '@keystatic/core/content-components'

const markdocComponents = {
  figure: block({
    label: 'Figure',
    schema: {
      src: fields.text({ label: 'Image path (src)', validation: { isRequired: true } }),
      alt: fields.text({ label: 'Alt text', validation: { isRequired: true } }),
      caption: fields.text({ label: 'Caption' }),
      width: fields.select({
        label: 'Width',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Wide', value: 'wide' },
          { label: 'Full', value: 'full' },
        ],
        defaultValue: 'default',
      }),
    },
  }),
  gallery: wrapper({
    label: 'Gallery',
    schema: {
      columns: fields.integer({ label: 'Columns (2 or 3)', defaultValue: 2 }),
      caption: fields.text({ label: 'Caption' }),
    },
  }),
  'gallery-image': block({
    label: 'Gallery Image',
    schema: {
      src: fields.text({ label: 'Image path (src)', validation: { isRequired: true } }),
      alt: fields.text({ label: 'Alt text', validation: { isRequired: true } }),
    },
  }),
  pullquote: block({
    label: 'Pull Quote',
    schema: {
      text: fields.text({ label: 'Quote text', validation: { isRequired: true } }),
      cite: fields.text({ label: 'Citation' }),
    },
  }),
  'treatment-box': block({
    label: 'Treatment Box',
    schema: {
      title: fields.text({ label: 'Title', validation: { isRequired: true } }),
      description: fields.text({ label: 'Description', validation: { isRequired: true }, multiline: true }),
      icon: fields.select({
        label: 'Icon',
        options: [
          { label: 'Water', value: 'water' },
          { label: 'Earth', value: 'earth' },
          { label: 'Gas', value: 'gas' },
          { label: 'Climate', value: 'climate' },
        ],
        defaultValue: 'water',
      }),
    },
  }),
  'hotel-box': block({
    label: 'Hotel Box',
    schema: {
      name: fields.text({ label: 'Hotel name', validation: { isRequired: true } }),
      stars: fields.integer({ label: 'Stars (1-5)', validation: { isRequired: true } }),
      badge: fields.text({ label: 'Badge (optional)' }),
      description: fields.text({ label: 'Description', validation: { isRequired: true }, multiline: true }),
      bookingUrl: fields.text({ label: 'Booking URL', validation: { isRequired: true } }),
      bookingLabel: fields.text({ label: 'Booking button text', validation: { isRequired: true } }),
    },
  }),
  'stat-counter': wrapper({
    label: 'Stat Counter',
    schema: {
      caption: fields.text({ label: 'Caption' }),
      columns: fields.integer({ label: 'Columns (2, 3, or 4)', defaultValue: 3 }),
    },
  }),
  stat: block({
    label: 'Stat',
    schema: {
      value: fields.text({ label: 'Value', validation: { isRequired: true } }),
      prefix: fields.text({ label: 'Prefix (optional)' }),
      suffix: fields.text({ label: 'Suffix (optional)' }),
      label: fields.text({ label: 'Label', validation: { isRequired: true } }),
    },
  }),
}

function homepageSingleton(locale: string, label: string) {
  return singleton({
    label,
    path: `src/content/homepage/${locale}`,
    format: { data: 'json' },
    schema: {
      hero: fields.object(
        {
          title: fields.text({ label: 'Title' }),
          subtitle: fields.text({ label: 'Subtitle', multiline: true }),
          ctaText: fields.text({ label: 'CTA Button Text' }),
          ctaHref: fields.text({ label: 'CTA Link' }),
          ctaText2: fields.text({ label: 'Secondary CTA Text (optional)' }),
          ctaHref2: fields.text({ label: 'Secondary CTA Link (optional)' }),
          badges: fields.array(fields.text({ label: 'Badge' }), {
            label: 'Badges',
            itemLabel: (props) => props.value || 'Badge',
          }),
          image: fields.image({
            label: 'Hero Background Image',
            directory: 'public/images/content/hero',
            publicPath: '/images/content/hero/',
            description: 'Recommended: 1920x1080px, JPG/WebP. Landscape orientation.',
          }),
        },
        { label: 'Hero Section' }
      ),
      emotionalBlock: fields.object(
        {
          headline: fields.text({ label: 'Headline' }),
          text: fields.text({ label: 'Text', multiline: true }),
          proof: fields.text({ label: 'Proof Strip (optional)', description: 'E.g. UNESCO · 40+ springs · 4.8 Google' }),
        },
        { label: 'Emotional Block (below hero)' }
      ),
      quickFacts: fields.array(
        fields.object({
          value: fields.text({ label: 'Value' }),
          label: fields.text({ label: 'Label' }),
          href: fields.text({ label: 'Link (optional)', description: 'e.g. /cs/mineralni-prameny' }),
        }),
        {
          label: 'Quick Facts',
          itemLabel: (props) => props.fields.label.value || 'Fact',
        }
      ),
      healingElements: fields.object(
        {
          sectionLabel: fields.text({ label: 'Section Label' }),
          title: fields.text({ label: 'Title' }),
          description: fields.text({ label: 'Description', multiline: true }),
          items: fields.array(
            fields.object({
              name: fields.text({ label: 'Element Name' }),
              description: fields.text({
                label: 'Description',
                multiline: true,
              }),
              href: fields.text({ label: 'Link (optional)', description: 'e.g. /cs/co2-terapie' }),
            }),
            {
              label: 'Elements',
              itemLabel: (props) => props.fields.name.value || 'Element',
            }
          ),
        },
        { label: 'Four Healing Elements' }
      ),
      discover: fields.object(
        {
          sectionLabel: fields.text({ label: 'Section Label' }),
          title: fields.text({ label: 'Title' }),
          description: fields.text({ label: 'Description', multiline: true }),
        },
        { label: 'Discover Section' }
      ),
      hotels: fields.object(
        {
          sectionLabel: fields.text({ label: 'Section Label' }),
          title: fields.text({ label: 'Title' }),
          description: fields.text({ label: 'Description', multiline: true }),
          allHotelsLabel: fields.text({ label: 'All Hotels Link Text' }),
          items: fields.array(
            fields.object({
              name: fields.text({ label: 'Hotel Name' }),
              stars: fields.integer({ label: 'Stars (1-5)' }),
              badge: fields.text({ label: 'Badge (optional)' }),
              description: fields.text({
                label: 'Description',
                multiline: true,
              }),
              image: fields.image({
                label: 'Hotel Photo',
                directory: 'public/images/content/hotels',
                publicPath: '/images/content/hotels/',
                description: 'Recommended: 800x500px, JPG/WebP.',
              }),
              tags: fields.array(fields.text({ label: 'Tag' }), {
                label: 'Tags',
                itemLabel: (props) => props.value || 'Tag',
              }),
              bookingUrl: fields.url({ label: 'Booking URL' }),
              bookingLabel: fields.text({ label: 'Booking Button Text' }),
              anniversaryUrl: fields.text({ label: 'Anniversary Page URL (optional)', description: 'e.g. /cs/nove-lazne-130-let' }),
              anniversaryLabel: fields.text({ label: 'Anniversary Link Text (optional)' }),
            }),
            {
              label: 'Hotels',
              itemLabel: (props) => props.fields.name.value || 'Hotel',
            }
          ),
        },
        { label: 'Where to Stay' }
      ),
      people: fields.object(
        {
          sectionLabel: fields.text({ label: 'Section Label' }),
          title: fields.text({ label: 'Title' }),
          description: fields.text({ label: 'Description', multiline: true }),
          allStoriesLabel: fields.text({ label: 'All Stories Link Text' }),
          stories: fields.array(
            fields.object({
              quote: fields.text({ label: 'Quote', multiline: true }),
              name: fields.text({ label: 'Name' }),
              location: fields.text({ label: 'Location' }),
              visitLabel: fields.text({ label: 'Visit Label' }),
              lang: fields.text({ label: 'Language Code (optional)' }),
              portrait: fields.image({
                label: 'Portrait Photo',
                directory: 'public/images/content/stories',
                publicPath: '/images/content/stories/',
                description: 'Recommended: 400x400px or 3:4 ratio, JPG/WebP.',
              }),
            }),
            {
              label: 'Stories',
              itemLabel: (props) => props.fields.name.value || 'Story',
            }
          ),
        },
        { label: 'People of the Colonnade' }
      ),
      seasonal: fields.object(
        {
          badge: fields.text({ label: 'Badge Text' }),
          season: fields.text({ label: 'Season Label' }),
          title: fields.text({ label: 'Title' }),
          description: fields.text({ label: 'Description', multiline: true }),
          ctaText: fields.text({ label: 'CTA Button Text' }),
          image: fields.image({
            label: 'Seasonal Photo',
            directory: 'public/images/content/seasonal',
            publicPath: '/images/content/seasonal/',
            description: 'Recommended: 800x600px, JPG/WebP.',
          }),
        },
        { label: 'Seasonal Highlight' }
      ),
      magazine: fields.object(
        {
          sectionLabel: fields.text({ label: 'Section Label' }),
          title: fields.text({ label: 'Title' }),
        },
        { label: 'Magazine Preview' }
      ),
      newsletter: fields.object(
        {
          title: fields.text({ label: 'Title' }),
          description: fields.text({ label: 'Description', multiline: true }),
          placeholder: fields.text({ label: 'Email Placeholder' }),
          buttonText: fields.text({ label: 'Button Text' }),
          successMessage: fields.text({ label: 'Success Message' }),
          disclaimer: fields.text({ label: 'Disclaimer' }),
        },
        { label: 'Newsletter Section' }
      ),
    },
  })
}

function campaignSingleton(locale: string, label: string) {
  return singleton({
    label,
    path: `src/content/campaigns/${locale}`,
    format: { data: 'json' },
    schema: {
      popupEnabled: fields.checkbox({
        label: 'Popup enabled (master switch)',
        defaultValue: true,
        description: 'When off, no campaign popup is shown for this locale.',
      }),
      jubilee: fields.object(
        {
          teaserStart: fields.text({ label: 'Teaser start (YYYY-MM-DD)', description: 'e.g. 2026-05-25' }),
          saleStart: fields.text({ label: 'Sale start (YYYY-MM-DD)', description: 'e.g. 2026-06-01' }),
          saleEnd: fields.text({ label: 'Sale end (YYYY-MM-DD inclusive)', description: 'e.g. 2026-06-06' }),
          eyebrow: fields.text({ label: 'Eyebrow / small label' }),
          headline: fields.text({ label: 'Headline (use \\n for line break)' }),
          teaserText: fields.text({ label: 'Teaser body text', multiline: true }),
          saleText: fields.text({ label: 'Sale body text', multiline: true }),
          discountLabel: fields.text({ label: 'Discount label', description: 'e.g. −25 %' }),
          ctaLabel: fields.text({ label: 'CTA button label' }),
          ctaUrl: fields.text({ label: 'CTA URL (Ensana landing)', description: 'Full URL incl. UTM params' }),
          footnote: fields.text({ label: 'Footnote / small print' }),
          image: fields.image({
            label: 'Campaign image (optional)',
            directory: 'public/images/content/campaigns',
            publicPath: '/images/content/campaigns/',
            description: 'Banner image shown at the top of the popup card. Recommended ~1200×270 px, JPG/PNG/WebP. Leave empty for solid gradient header.',
          }),
          imageAlt: fields.text({ label: 'Image alt text (for accessibility)' }),
        },
        { label: 'Jubilee Sale (130 years Nové Lázně)' }
      ),
      summerSale: fields.object(
        {
          teaserStart: fields.text({ label: 'Teaser start (YYYY-MM-DD)', description: 'e.g. 2026-06-04' }),
          saleStart: fields.text({ label: 'Sale start (YYYY-MM-DD)', description: 'e.g. 2026-06-09' }),
          saleEnd: fields.text({ label: 'Sale end (YYYY-MM-DD inclusive)', description: 'e.g. 2026-06-17' }),
          stayPeriod: fields.text({ label: 'Stay period (display text)', description: 'e.g. 10. 6. 2026 – 16. 3. 2027' }),
          eyebrow: fields.text({ label: 'Eyebrow / small label' }),
          headline: fields.text({ label: 'Headline (use \\n for line break)' }),
          teaserText: fields.text({ label: 'Teaser body text', multiline: true }),
          saleText: fields.text({ label: 'Sale body text', multiline: true }),
          discountLabel: fields.text({ label: 'Discount label', description: 'e.g. −25 %' }),
          ctaLabel: fields.text({ label: 'CTA button label' }),
          ctaUrl: fields.text({ label: 'CTA URL (Ensana offer page — placeholder until final from HQ)' }),
          conditions: fields.array(fields.text({ label: 'Condition' }), {
            label: 'Booking conditions (50% prepayment, etc.)',
            itemLabel: (props) => props.value || 'Condition',
          }),
          footnote: fields.text({ label: 'Footnote / small print' }),
          landingPageTitle: fields.text({ label: 'Landing page <title> tag' }),
          landingPageDescription: fields.text({ label: 'Landing page meta description', multiline: true }),
          landingHeroEyebrow: fields.text({ label: 'Landing page hero eyebrow' }),
          landingKeyInfoTitle: fields.text({ label: 'Landing page "Key info" section title' }),
          landingConditionsTitle: fields.text({ label: 'Landing page "Conditions" section title' }),
          landingSalePeriodLabel: fields.text({ label: 'Label for sale window', description: 'e.g. Sale period' }),
          landingStayPeriodLabel: fields.text({ label: 'Label for stay period' }),
          landingDiscountLabel: fields.text({ label: 'Label for discount' }),
          image: fields.image({
            label: 'Campaign image (optional)',
            directory: 'public/images/content/campaigns',
            publicPath: '/images/content/campaigns/',
            description: 'Hero image for the landing page. Recommended ~1920×800 px. Leave empty for solid gradient.',
          }),
          imageAlt: fields.text({ label: 'Image alt text (for accessibility)' }),
          popupImage: fields.image({
            label: 'Popup creative (optional, per-locale square banner)',
            directory: 'public/images/content/campaigns/summer-sale',
            publicPath: '/images/content/campaigns/summer-sale/',
            description: 'Square social creative (1080×1080) shown as the full popup visual. All headline/discount text is baked into the image. Leave empty to fall back to the gradient + text card.',
          }),
          popupImageAlt: fields.text({ label: 'Popup creative alt text (for accessibility)' }),
        },
        { label: 'Summer Sale' }
      ),
    },
  })
}

/** Event quiz collection, one per locale — entries share a folder (Quiz ID) across languages */
function quizCollection(locale: string, label: string) {
  return collection({
    label,
    path: `src/content/quizzes/*/${locale}` as `src/content/quizzes/*/de`,
    slugField: 'title',
    format: { data: 'json' },
    schema: {
      title: fields.slug({
        name: { label: 'Title' },
        slug: {
          label: 'Quiz ID (folder)',
          description: 'Canonical quiz id — must be identical in all four language versions, e.g. "ensana-leto".',
        },
      }),
      slug: fields.text({
        label: 'URL slug (localized)',
        description: 'Slug used in the page URL for this language, e.g. "ensana-leto" → /cs/kviz/ensana-leto',
        validation: { isRequired: true },
      }),
      metaDescription: fields.text({ label: 'Meta Description', multiline: true }),
      active: fields.checkbox({
        label: 'Active',
        defaultValue: true,
        description: 'Inactive quizzes return 404 in production (switch off after the event ends).',
      }),
      intro: fields.object(
        {
          badge: fields.text({ label: 'Badge (e.g. "Letní soutěž")' }),
          text: fields.text({ label: 'Intro text', multiline: true }),
          prize: fields.text({ label: 'Prize highlight', multiline: true }),
          drawNote: fields.text({ label: 'Draw note (e.g. date of the draw)' }),
          startLabel: fields.text({ label: 'Start button label' }),
        },
        { label: 'Intro screen' },
      ),
      questions: fields.array(
        fields.object({
          id: fields.text({
            label: 'Question ID',
            description: 'Stable id, identical across languages (used to pair answers).',
            validation: { isRequired: true },
          }),
          type: fields.select({
            label: 'Type',
            options: [
              { label: 'Single choice', value: 'single' },
              { label: 'Open (free text)', value: 'open' },
            ],
            defaultValue: 'single',
          }),
          text: fields.text({ label: 'Question', multiline: true, validation: { isRequired: true } }),
          options: fields.array(
            fields.object({
              id: fields.text({ label: 'Option ID (a, b, c…)' }),
              text: fields.text({ label: 'Answer text' }),
              correct: fields.checkbox({ label: 'Correct answer' }),
            }),
            {
              label: 'Options (single choice only)',
              itemLabel: (props) => props.fields.text.value || props.fields.id.value || 'Option',
            },
          ),
          explanation: fields.text({ label: 'Explanation (shown after answering)', multiline: true }),
          placeholder: fields.text({ label: 'Placeholder (open question only)' }),
          maxLength: fields.integer({ label: 'Max answer length (open question)', defaultValue: 500 }),
        }),
        {
          label: 'Questions (5–30)',
          itemLabel: (props) => props.fields.text.value || props.fields.id.value || 'Question',
        },
      ),
      results: fields.array(
        fields.object({
          minPercent: fields.integer({ label: 'From score (%)', description: 'Band applies from this percentage of correct answers up.' }),
          title: fields.text({ label: 'Result title' }),
          message: fields.text({ label: 'Result message', multiline: true }),
        }),
        {
          label: 'Result bands',
          itemLabel: (props) => props.fields.title.value || 'Band',
        },
      ),
      terms: fields.object(
        {
          heading: fields.text({ label: 'Terms page heading' }),
          body: fields.text({
            label: 'Terms text',
            multiline: true,
            description: 'Numbered paragraphs separated by blank lines. Leave empty to disable the terms page.',
          }),
        },
        { label: 'Competition terms (legal page)' },
      ),
      emailGate: fields.object(
        {
          heading: fields.text({ label: 'Heading' }),
          text: fields.text({ label: 'Text', multiline: true }),
          consentCompetitionLabel: fields.text({
            label: 'Consent 1 — competition (required checkbox)',
            multiline: true,
            description: 'Required to enter the draw. Do not bundle the newsletter consent here.',
          }),
          consentNewsletterLabel: fields.text({
            label: 'Consent 2 — newsletter (optional checkbox)',
            multiline: true,
            description: 'Separate, opt-in marketing consent. Never pre-ticked.',
          }),
          successTitle: fields.text({ label: 'Success title' }),
          successText: fields.text({ label: 'Success text', multiline: true }),
        },
        { label: 'Email form (prize draw entry)' },
      ),
    },
  })
}

const isProd = import.meta.env.PROD

export default config({
  storage: isProd
    ? {
        kind: 'github',
        repo: 'veritasderman-rgb/marienbad',
      }
    : {
        kind: 'local',
      },
  ui: {
    brand: {
      name: 'Marienbad CMS',
    },
  },
  singletons: {
    'homepage-de': homepageSingleton('de', 'Homepage (Deutsch)'),
    'homepage-en': homepageSingleton('en', 'Homepage (English)'),
    'homepage-cs': homepageSingleton('cs', 'Homepage (Čeština)'),
    'homepage-ru': homepageSingleton('ru', 'Homepage (Русский)'),
    'campaigns-de': campaignSingleton('de', 'Campaigns (Deutsch)'),
    'campaigns-en': campaignSingleton('en', 'Campaigns (English)'),
    'campaigns-cs': campaignSingleton('cs', 'Campaigns (Čeština)'),
    'campaigns-ru': campaignSingleton('ru', 'Campaigns (Русский)'),
    'podcast-episodes': singleton({
      label: 'Podcast Episodes',
      path: 'src/content/podcasts/episodes',
      format: { data: 'json' },
      schema: {
        playlistUrl: fields.url({ label: 'YouTube Playlist URL' }),
        episodes: fields.array(
          fields.object({
            videoId: fields.text({ label: 'YouTube Video ID' }),
            date: fields.text({ label: 'Date (ISO)', description: 'e.g. 2025-01-15' }),
            titleCs: fields.text({ label: 'Title (CS)' }),
            titleDe: fields.text({ label: 'Title (DE)' }),
            titleEn: fields.text({ label: 'Title (EN)' }),
            titleRu: fields.text({ label: 'Title (RU)' }),
            descriptionCs: fields.text({ label: 'Description (CS)', multiline: true }),
            descriptionDe: fields.text({ label: 'Description (DE)', multiline: true }),
            descriptionEn: fields.text({ label: 'Description (EN)', multiline: true }),
            descriptionRu: fields.text({ label: 'Description (RU)', multiline: true }),
          }),
          {
            label: 'Episodes',
            itemLabel: (props) => props.fields.titleEn.value || props.fields.videoId.value || 'Episode',
          }
        ),
      },
    }),
    itineraries: singleton({
      label: 'Itineraries',
      path: 'src/content/itineraries/data',
      format: { data: 'json' },
      schema: {
        categories: fields.array(
          fields.object({
            key: fields.select({
              label: 'Category Key',
              options: [
                { label: 'Families', value: 'families' },
                { label: 'Couples', value: 'couples' },
                { label: 'Solo', value: 'solo' },
                { label: 'Wellness', value: 'wellness' },
              ],
              defaultValue: 'families',
            }),
            items: fields.array(
              fields.object({
                icon: fields.text({ label: 'SVG Icon Path (d attribute)', multiline: true }),
                image: fields.image({
                  label: 'Photo',
                  directory: 'public/images/content/itineraries',
                  publicPath: '/images/content/itineraries/',
                  description: 'Recommended: 800x500px, JPG/WebP. Optional — falls back to SVG icon if empty.',
                }),
                type: fields.select({
                  label: 'Type',
                  options: [
                    { label: 'Hotel', value: 'hotel' },
                    { label: 'Activity', value: 'activity' },
                    { label: 'Treatment', value: 'treatment' },
                  ],
                  defaultValue: 'hotel',
                }),
                titleDe: fields.text({ label: 'Title (DE)' }),
                titleEn: fields.text({ label: 'Title (EN)' }),
                titleCs: fields.text({ label: 'Title (CS)' }),
                titleRu: fields.text({ label: 'Title (RU)' }),
                descriptionDe: fields.text({ label: 'Description (DE)', multiline: true }),
                descriptionEn: fields.text({ label: 'Description (EN)', multiline: true }),
                descriptionCs: fields.text({ label: 'Description (CS)', multiline: true }),
                descriptionRu: fields.text({ label: 'Description (RU)', multiline: true }),
                hrefDe: fields.text({ label: 'Link (DE)' }),
                hrefEn: fields.text({ label: 'Link (EN)' }),
                hrefCs: fields.text({ label: 'Link (CS)' }),
                hrefRu: fields.text({ label: 'Link (RU)' }),
              }),
              {
                label: 'Items',
                itemLabel: (props) => props.fields.titleEn.value || 'Item',
              }
            ),
          }),
          {
            label: 'Categories',
            itemLabel: (props) => props.fields.key.value || 'Category',
          }
        ),
      },
    }),
    'hotel-galleries': singleton({
      label: 'Hotel Galleries',
      path: 'src/content/hotel-galleries/data',
      format: { data: 'json' },
      schema: {
        hotels: fields.array(
          fields.object({
            slug: fields.select({
              label: 'Hotel',
              options: [
                { label: 'Nové Lázně', value: 'nove-lazne' },
                { label: 'Centrální Lázně', value: 'centralni-lazne' },
                { label: 'Hvězda', value: 'hvezda' },
                { label: 'Pacifik', value: 'pacifik' },
                { label: 'Butterfly', value: 'butterfly' },
                { label: 'Vltava', value: 'vltava' },
                { label: 'Svoboda', value: 'svoboda' },
              ],
              defaultValue: 'nove-lazne',
            }),
            images: fields.array(
              fields.object({
                image: fields.image({
                  label: 'Photo',
                  directory: 'public/images/hotels',
                  publicPath: '/images/hotels/',
                  description: 'Recommended: 800x500px, JPG/WebP. Landscape orientation.',
                }),
                alt: fields.text({ label: 'Alt text' }),
              }),
              {
                label: 'Photos (up to 5)',
                itemLabel: (props) => props.fields.alt.value || 'Photo',
              }
            ),
          }),
          {
            label: 'Hotels',
            itemLabel: (props) => {
              const slugLabels: Record<string, string> = {
                'nove-lazne': 'Nové Lázně',
                'centralni-lazne': 'Centrální Lázně',
                'hvezda': 'Hvězda',
                'pacifik': 'Pacifik',
                'butterfly': 'Butterfly',
                'vltava': 'Vltava',
                'svoboda': 'Svoboda',
              }
              return slugLabels[props.fields.slug.value] || 'Hotel'
            },
          }
        ),
      },
    }),
  },
  collections: {
    stories: collection({
      label: 'Stories',
      path: 'src/content/stories/*/',
      slugField: 'title',
      format: { data: 'yaml', contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'published',
          description: 'Only published stories appear on the site.',
        }),
        locale: fields.select({
          label: 'Language',
          options: [
            { label: 'Deutsch', value: 'de' },
            { label: 'English', value: 'en' },
            { label: 'Čeština', value: 'cs' },
            { label: 'Русский', value: 'ru' },
          ],
          defaultValue: 'de',
        }),
        name: fields.text({ label: 'Person Name' }),
        location: fields.text({ label: 'Location (City + Country)' }),
        visitLabel: fields.text({ label: 'Visit Label (e.g. "12th visit")' }),
        quote: fields.text({ label: 'Pull Quote', multiline: true }),
        lang: fields.text({ label: 'Language Code for Quote' }),
        portrait: fields.image({
          label: 'Portrait Photo',
          directory: 'public/images/content/stories',
          publicPath: '/images/content/stories/',
          description: 'Recommended: 600x800px, JPG/WebP. Portrait orientation.',
        }),
        body: fields.markdoc({
          label: 'Full Story',
          components: markdocComponents,
          options: {
            heading: [2, 3, 4],
            bold: true,
            italic: true,
            strikethrough: true,
            link: true,
            orderedList: true,
            unorderedList: true,
            table: true,
            blockquote: true,
            divider: true,
            image: {
              directory: 'public/images/content/articles',
              publicPath: '/images/content/articles/',
            },
          },
        }),
      },
    }),
    articles: collection({
      label: 'Articles',
      path: 'src/content/articles/*/',
      slugField: 'title',
      format: { data: 'yaml', contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'published',
          description: 'Only published articles appear on the site.',
        }),
        locale: fields.select({
          label: 'Language',
          options: [
            { label: 'Deutsch', value: 'de' },
            { label: 'English', value: 'en' },
            { label: 'Čeština', value: 'cs' },
            { label: 'Русский', value: 'ru' },
          ],
          defaultValue: 'de',
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/images/content/articles',
          publicPath: '/images/content/articles/',
          description: 'Recommended: 1200x630px, JPG/WebP. Used as article thumbnail and OG image.',
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Healing / Léčba', value: 'healing' },
            { label: 'Springs / Prameny', value: 'springs' },
            { label: 'Activities / Aktivity', value: 'activities' },
            { label: 'Culture / Kultura', value: 'culture' },
            { label: 'Planning / Plánování', value: 'planning' },
            { label: 'Nature / Příroda', value: 'nature' },
            { label: 'Wellness', value: 'wellness' },
            { label: 'Comparison / Srovnání', value: 'comparison' },
            { label: 'Health', value: 'health' },
            { label: 'History / Historie', value: 'history' },
            { label: 'Tip', value: 'tip' },
            { label: 'Food / Gastronomie', value: 'food' },
          ],
          defaultValue: 'health',
        }),
        pullQuote: fields.text({ label: 'Pull Quote', multiline: true, description: 'Prominent quote displayed in the article hero/intro area. Optional.' }),
        articleType: fields.select({
          label: 'Article Type',
          options: [
            { label: 'Cluster article (1200-1800 words)', value: 'cluster' },
            { label: 'Pillar page (2000-3000 words)', value: 'pillar' },
            { label: 'Guide (1500-2500 words)', value: 'guide' },
            { label: 'Comparison (1500-2000 words)', value: 'comparison' },
            { label: 'FAQ (800-1200 words)', value: 'faq' },
          ],
          defaultValue: 'cluster',
        }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        date: fields.text({ label: 'Date (ISO)', description: 'e.g. 2025-06-15' }),
        readingTime: fields.text({ label: 'Reading Time', description: 'e.g. 5 min' }),
        primaryKeyword: fields.text({ label: 'Primary Keyword (SEO)', description: 'Main long-tail keyword for this article' }),
        secondaryKeywords: fields.text({ label: 'Secondary Keywords (SEO)', multiline: true, description: 'Comma-separated secondary keywords' }),
        metaDescription: fields.text({ label: 'Meta Description', description: 'Max 155 chars, includes primary keyword' }),
        relatedEnsanaLink: fields.text({ label: 'Ensana Link', description: 'Contextual link to ensanahotels.com' }),
        youtubeVideoId: fields.text({ label: 'YouTube Video ID', description: 'e.g. dQw4w9WgXcQ — shown as embedded player with podcast/video section' }),
        youtubeTitle: fields.text({ label: 'Video/Podcast Title', description: 'Title shown above the embedded video' }),
        youtubeDescription: fields.text({ label: 'Video/Podcast Description', multiline: true, description: 'Short description shown next to the video player' }),
        body: fields.markdoc({
          label: 'Article Content',
          components: markdocComponents,
          options: {
            heading: [2, 3, 4],
            bold: true,
            italic: true,
            strikethrough: true,
            link: true,
            orderedList: true,
            unorderedList: true,
            table: true,
            blockquote: true,
            divider: true,
            image: {
              directory: 'public/images/content/articles',
              publicPath: '/images/content/articles/',
            },
          },
        }),
      },
    }),
    pages: collection({
      label: 'Pages',
      path: 'src/content/pages/*/',
      slugField: 'title',
      format: { data: 'yaml', contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        locale: fields.select({
          label: 'Language',
          options: [
            { label: 'Deutsch', value: 'de' },
            { label: 'English', value: 'en' },
            { label: 'Čeština', value: 'cs' },
            { label: 'Русский', value: 'ru' },
          ],
          defaultValue: 'de',
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/content/pages',
          publicPath: '/images/content/pages/',
          description: 'Recommended: 1200x630px, JPG/WebP. Used as page hero and OG image.',
        }),
        section: fields.select({
          label: 'Section',
          options: [
            { label: 'Mineral Springs', value: 'mineral-springs' },
            { label: 'Things to Do', value: 'things-to-do' },
            { label: 'Accommodation', value: 'accommodation' },
            { label: 'History', value: 'history' },
            { label: 'Practical Info', value: 'practical-info' },
            { label: 'People', value: 'people' },
            { label: 'Magazine', value: 'magazine' },
          ],
          defaultValue: 'mineral-springs',
        }),
        pullQuote: fields.text({ label: 'Pull Quote', multiline: true, description: 'Prominent quote displayed in the page intro area. Optional.' }),
        metaTitle: fields.text({ label: 'Meta Title (for <title> tag)' }),
        metaDescription: fields.text({
          label: 'Meta Description',
          multiline: true,
        }),
        body: fields.markdoc({
          label: 'Page Content',
          components: markdocComponents,
          options: {
            heading: [2, 3, 4],
            bold: true,
            italic: true,
            strikethrough: true,
            link: true,
            orderedList: true,
            unorderedList: true,
            table: true,
            blockquote: true,
            divider: true,
            image: {
              directory: 'public/images/content/articles',
              publicPath: '/images/content/articles/',
            },
          },
        }),
      },
    }),
    'quizzes-de': quizCollection('de', 'Quizzes (Deutsch)'),
    'quizzes-en': quizCollection('en', 'Quizzes (English)'),
    'quizzes-cs': quizCollection('cs', 'Quizzes (Čeština)'),
    'quizzes-ru': quizCollection('ru', 'Quizzes (Русский)'),
  },
})
