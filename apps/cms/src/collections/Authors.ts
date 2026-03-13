import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Professional title (e.g., "Spa Doctor at Ensana Nové Lázně") — important for E-E-A-T',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'isEnsanaExpert',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Is this author an Ensana doctor/expert? (for E-E-A-T authority)',
      },
    },
  ],
}
