import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'parentPillar', 'status', 'updatedAt'],
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
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Cluster Article', value: 'cluster' },
        { label: 'Seasonal', value: 'seasonal' },
        { label: 'Expert / Health', value: 'expert' },
        { label: 'Listicle / Guide', value: 'listicle' },
      ],
      admin: {
        description: 'Article type determines layout template and expected length',
      },
    },
    {
      name: 'parentPillar',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        description: 'Parent pillar page (for cluster articles)',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short excerpt shown in listings (120-160 characters)',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
    // Ensana CTA (max 1 per article — enforced by having a single group)
    {
      name: 'ensanaCTA',
      type: 'group',
      admin: {
        description: 'Max 1 Ensana CTA per article. More = loss of credibility.',
      },
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'headline', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
        { name: 'url', type: 'text' },
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
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Review', value: 'review' },
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
