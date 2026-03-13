import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'category', 'isEnsanaEvent'],
    group: 'Content',
  },
  access: {
    read: () => true,
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
      unique: true,
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Culture', value: 'culture' },
        { label: 'Sport', value: 'sport' },
        { label: 'Wellness', value: 'wellness' },
        { label: 'Festival', value: 'festival' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'isEnsanaEvent',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Is this an Ensana-organized event?' },
    },
    {
      name: 'ensanaLink',
      type: 'text',
      admin: {
        description: 'Link to Ensana event page (UTM params added automatically)',
        condition: (data: any) => data?.isEnsanaEvent,
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'upcoming',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Past', value: 'past' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
