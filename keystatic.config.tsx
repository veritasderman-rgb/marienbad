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
            }),
            {
              label: 'Stories',
              itemLabel: (props) => props.fields.name.value || 'Story',
            }
          ),
        },
        { label: 'People of Colonnade' }
      ),
      seasonal: fields.object(
        {
          badge: fields.text({ label: 'Badge Text' }),
          season: fields.text({ label: 'Season Label' }),
          title: fields.text({ label: 'Title' }),
          description: fields.text({ label: 'Description', multiline: true }),
          ctaText: fields.text({ label: 'CTA Button Text' }),
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

function settingsSingleton(locale: string, label: string) {
  return singleton({
    label,
    path: `src/content/settings/${locale}`,
    format: { data: 'json' },
    schema: {
      meta: fields.object(
        {
          siteName: fields.text({ label: 'Site Name' }),
          tagline: fields.text({ label: 'Tagline' }),
          description: fields.text({
            label: 'Meta Description',
            multiline: true,
          }),
        },
        { label: 'Meta / SEO' }
      ),
      nav: fields.object(
        {
          home: fields.text({ label: 'Home' }),
          mineralSprings: fields.text({ label: 'Mineral Springs' }),
          thingsToDo: fields.text({ label: 'Things to Do' }),
          accommodation: fields.text({ label: 'Accommodation' }),
          history: fields.text({ label: 'History' }),
          practicalInfo: fields.text({ label: 'Practical Info' }),
          people: fields.text({ label: 'People' }),
          magazine: fields.text({ label: 'Magazine' }),
          menu: fields.text({ label: 'Menu' }),
          close: fields.text({ label: 'Close' }),
        },
        { label: 'Navigation Labels' }
      ),
      home: fields.object(
        {
          springs: fields.text({ label: 'Springs Card Title' }),
          springsDesc: fields.text({
            label: 'Springs Card Description',
            multiline: true,
          }),
          thingsToDo: fields.text({ label: 'Things to Do Card Title' }),
          thingsToDoDesc: fields.text({
            label: 'Things to Do Card Description',
            multiline: true,
          }),
          accommodation: fields.text({ label: 'Accommodation Card Title' }),
          accommodationDesc: fields.text({
            label: 'Accommodation Card Description',
            multiline: true,
          }),
          history: fields.text({ label: 'History Card Title' }),
          historyDesc: fields.text({
            label: 'History Card Description',
            multiline: true,
          }),
          people: fields.text({ label: 'People Card Title' }),
          peopleDesc: fields.text({
            label: 'People Card Description',
            multiline: true,
          }),
        },
        { label: 'Homepage Card Labels' }
      ),
      footer: fields.object(
        {
          about: fields.text({ label: 'About Heading' }),
          aboutText: fields.text({
            label: 'About Text',
            multiline: true,
          }),
          quickLinks: fields.text({ label: 'Quick Links Heading' }),
          privacy: fields.text({ label: 'Privacy Link' }),
          imprint: fields.text({ label: 'Imprint Link' }),
        },
        { label: 'Footer' }
      ),
      common: fields.object(
        {
          readMore: fields.text({ label: 'Read More' }),
          backTo: fields.text({ label: 'Back' }),
          notFound: fields.text({ label: 'Not Found' }),
          tableOfContents: fields.text({ label: 'Table of Contents' }),
        },
        { label: 'Common Strings' }
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
    'settings-de': settingsSingleton('de', 'Settings (Deutsch)'),
    'settings-en': settingsSingleton('en', 'Settings (English)'),
    'settings-cs': settingsSingleton('cs', 'Settings (Čeština)'),
    'settings-ru': settingsSingleton('ru', 'Settings (Русский)'),
  },
  collections: {
    stories: collection({
      label: 'Stories',
      path: 'src/content/stories/*/',
      slugField: 'title',
      format: { contentField: 'body' },
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
        name: fields.text({ label: 'Person Name' }),
        location: fields.text({ label: 'Location (City + Country)' }),
        visitLabel: fields.text({ label: 'Visit Label (e.g. "12th visit")' }),
        quote: fields.text({ label: 'Pull Quote', multiline: true }),
        lang: fields.text({ label: 'Language Code for Quote' }),
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
          },
        }),
      },
    }),
    articles: collection({
      label: 'Articles',
      path: 'src/content/articles/*/',
      slugField: 'title',
      format: { contentField: 'body' },
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
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Health', value: 'health' },
            { label: 'Culture', value: 'culture' },
            { label: 'Tip', value: 'tip' },
            { label: 'Nature', value: 'nature' },
            { label: 'History', value: 'history' },
            { label: 'Food', value: 'food' },
          ],
          defaultValue: 'health',
        }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        date: fields.text({ label: 'Date (ISO)', description: 'e.g. 2025-06-15' }),
        readingTime: fields.text({ label: 'Reading Time', description: 'e.g. 5 min' }),
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
          },
        }),
      },
    }),
    pages: collection({
      label: 'Pages',
      path: 'src/content/pages/*/',
      slugField: 'title',
      format: { contentField: 'body' },
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
          },
        }),
      },
    }),
  },
})
