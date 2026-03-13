import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Site',
  },
  fields: [
    {
      name: 'aboutText',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'quickLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
  ],
}
