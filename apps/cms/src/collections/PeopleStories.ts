import type { CollectionConfig } from 'payload'

export const PeopleStories: CollectionConfig = {
  slug: 'people-stories',
  admin: {
    useAsTitle: 'headline',
    defaultColumns: ['headline', 'archetype', 'originalLanguage', 'status', 'updatedAt'],
    group: 'People of Colonnade',
  },
  access: {
    read: () => true,
    create: ({ req }) => ['admin', 'editor', 'poc-photographer'].includes(req.user?.role || ''),
    update: ({ req }) => ['admin', 'editor', 'poc-photographer'].includes(req.user?.role || ''),
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'First name only (e.g., "Helga")' },
    },
    {
      name: 'country',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Country in the guest\'s language (e.g., "Österreich")' },
    },
    {
      name: 'visitNumber',
      type: 'text',
      admin: { description: 'Which visit? (e.g., "23" or "First time")' },
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      admin: {
        description: 'Name + country + visit count. E.g., "Helga, Österreich. Zum 23. Mal."',
      },
    },
    {
      name: 'pullQuote',
      type: 'text',
      required: true,
      admin: {
        description: 'One sentence hook — what makes the reader want to continue',
      },
    },
    {
      name: 'story',
      type: 'richText',
      required: true,
      admin: {
        description: '200-400 words, first person, original language. No translations.',
      },
    },
    {
      name: 'originalLanguage',
      type: 'select',
      required: true,
      options: [
        { label: 'Deutsch', value: 'de' },
        { label: 'English', value: 'en' },
        { label: 'Русский', value: 'ru' },
        { label: 'Česky', value: 'cs' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'archetype',
      type: 'select',
      required: true,
      options: [
        { label: 'Loyal Guest (10+ years)', value: 'loyal' },
        { label: 'First Visit', value: 'first-visit' },
        { label: 'Healing', value: 'healing' },
        { label: 'Love', value: 'love' },
        { label: 'Generations', value: 'generation' },
        { label: 'Cultural', value: 'cultural' },
        { label: 'Local', value: 'local' },
        { label: 'From Afar', value: 'faraway' },
      ],
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Portrait photo — natural light, authentic setting. Smartphone is fine.',
      },
    },
    // Ensana mention — ONLY if guest voluntarily mentioned it
    {
      name: 'ensanaMention',
      type: 'group',
      admin: {
        description: 'ONLY if the guest spontaneously mentioned an Ensana hotel/treatment. Never ask.',
      },
      fields: [
        {
          name: 'mentioned',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Did the guest voluntarily mention Ensana?' },
        },
        {
          name: 'context',
          type: 'textarea',
          admin: {
            description: 'What exactly did they mention? (for reference only)',
            condition: (data: any, siblingData: any) => siblingData?.mentioned,
          },
        },
      ],
    },
    // Consent
    {
      name: 'consent',
      type: 'group',
      fields: [
        {
          name: 'signed',
          type: 'checkbox',
          required: true,
          admin: { description: 'Release form signed?' },
        },
        {
          name: 'document',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Scan of signed release form' },
        },
      ],
    },
    // Social media tracking
    {
      name: 'socialMedia',
      type: 'group',
      fields: [
        {
          name: 'instagramPosted',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'instagramUrl',
          type: 'text',
        },
        {
          name: 'facebookPosted',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'facebookUrl',
          type: 'text',
        },
      ],
    },
    {
      name: 'featuredInNewsletter',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
