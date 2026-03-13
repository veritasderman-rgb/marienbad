import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Site',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Marienbad.com',
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ga4MeasurementId',
      type: 'text',
      admin: { description: 'Google Analytics 4 Measurement ID (e.g., G-XXXXXXXXXX)' },
    },
    {
      name: 'gscVerification',
      type: 'text',
      admin: { description: 'Google Search Console verification code' },
    },
    {
      name: 'mailerLiteApiKey',
      type: 'text',
      admin: { description: 'MailerLite API key for newsletter' },
    },
    {
      name: 'ensanaDefaults',
      type: 'group',
      fields: [
        {
          name: 'baseUrl',
          type: 'text',
          defaultValue: 'https://www.ensanahotels.com',
        },
        {
          name: 'utmSource',
          type: 'text',
          defaultValue: 'marienbad.com',
        },
        {
          name: 'utmMedium',
          type: 'text',
          defaultValue: 'referral',
        },
      ],
    },
  ],
}
