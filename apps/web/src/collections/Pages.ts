import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      localized: true,
      unique: true,
      admin: {
        description: 'URL slug (e.g., "mineral-springs" for EN, "mineralquellen" for DE)',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Pillar Page', value: 'pillar' },
        { label: 'Info Hub', value: 'info-hub' },
        { label: 'Landing Page', value: 'landing' },
      ],
    },
    // Hero section
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'headline',
          type: 'text',
          localized: true,
        },
        {
          name: 'subheadline',
          type: 'text',
          localized: true,
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'ctaText',
          type: 'text',
          localized: true,
        },
        {
          name: 'ctaUrl',
          type: 'text',
        },
      ],
    },
    // Main content
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    // Table of Contents (auto-generated from H2s, or manual)
    {
      name: 'tableOfContents',
      type: 'array',
      admin: {
        description: 'Manual table of contents entries (leave empty to auto-generate from H2 headings)',
      },
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'anchor', type: 'text' },
      ],
    },
    // FAQ Schema
    {
      name: 'faq',
      type: 'array',
      admin: {
        description: 'FAQ items — generates FAQ schema markup for Google',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          localized: true,
        },
      ],
    },
    // Ensana CTA (max 1 per page)
    {
      name: 'ensanaCTA',
      type: 'group',
      admin: {
        description: 'Ensana soft-sell CTA box (max 1 per page)',
      },
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'headline', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
        {
          name: 'url',
          type: 'text',
          admin: { description: 'URL to ensanahotels.com (UTM params added automatically)' },
        },
        {
          name: 'position',
          type: 'select',
          defaultValue: 'sidebar',
          options: [
            { label: 'Sidebar', value: 'sidebar' },
            { label: 'Inline', value: 'inline' },
            { label: 'Bottom', value: 'bottom' },
          ],
        },
      ],
    },
    // SEO target keywords (internal tracking)
    {
      name: 'targetKeywords',
      type: 'array',
      admin: { description: 'Target SEO keywords (internal tracking only)' },
      fields: [
        { name: 'keyword', type: 'text' },
      ],
    },
    // Related articles
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: { description: 'Cluster articles linked to this pillar page' },
    },
    // Publication status
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
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
