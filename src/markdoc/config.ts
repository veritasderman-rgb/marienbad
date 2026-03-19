import type { Config, Schema } from '@markdoc/markdoc'

const figure: Schema = {
  render: 'figure',
  selfClosing: true,
  attributes: {
    src: { type: String, required: true, errorLevel: 'critical' },
    alt: { type: String, required: true },
    caption: { type: String },
    width: {
      type: String,
      default: 'default',
      matches: ['default', 'wide', 'full'],
    },
  },
}

const gallery: Schema = {
  render: 'gallery',
  attributes: {
    columns: { type: Number, default: 2, matches: [2, 3] },
    caption: { type: String },
  },
}

const galleryImage: Schema = {
  render: 'gallery-image',
  selfClosing: true,
  attributes: {
    src: { type: String, required: true, errorLevel: 'critical' },
    alt: { type: String, required: true },
  },
}

const pullquote: Schema = {
  render: 'pullquote',
  selfClosing: true,
  attributes: {
    text: { type: String, required: true, errorLevel: 'critical' },
    cite: { type: String },
  },
}

export const markdocConfig: Config = {
  tags: {
    figure,
    gallery,
    'gallery-image': galleryImage,
    pullquote,
  },
}
