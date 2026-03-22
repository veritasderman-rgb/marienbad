import { config, fields, singleton, collection } from '@keystatic/core'

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
      quickFacts: fields.array(
        fields.object({
          value: fields.text({ label: 'Value' }),
          label: fields.text({ label: 'Label' }),
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
          articles: fields.array(
            fields.object({
              category: fields.text({ label: 'Category' }),
              title: fields.text({ label: 'Title' }),
              excerpt: fields.text({ label: 'Excerpt', multiline: true }),
              date: fields.text({ label: 'Date' }),
              readTime: fields.text({ label: 'Read Time' }),
              image: fields.image({
                label: 'Article Thumbnail',
                directory: 'public/images/content/articles',
                publicPath: '/images/content/articles/',
                description: 'Recommended: 800x500px, JPG/WebP.',
              }),
            }),
            {
              label: 'Articles',
              itemLabel: (props) => props.fields.title.value || 'Article',
            }
          ),
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
  },
})
