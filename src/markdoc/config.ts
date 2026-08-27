import type { Config, Schema } from '@markdoc/markdoc'

/**
 * CONTENT GOVERNANCE — Markdoc Render Rules
 *
 * Allowed standard elements (rendered by Markdoc's built-in parser):
 *   p, h2, h3, h4, strong, em, s, a, ul, ol, li, table, thead, tbody,
 *   tr, th, td, blockquote, hr, img, br, code, pre
 *
 * Allowed custom tags (defined below):
 *   figure      — responsive image with optional caption (src, alt, caption, width)
 *   gallery     — grid of images (columns: 2|3, caption)
 *   gallery-image — single image inside a gallery (src, alt)
 *   pullquote   — styled editorial blockquote (text, cite)
 *   stat-counter — grid of animated key figures (columns: 2|3|4, caption)
 *   stat        — a single figure inside stat-counter (value, prefix, suffix, label)
 *
 * Raw HTML is NOT allowed — Markdoc strips it by default.
 * All custom tag attributes are escaped (escapeHtml/escapeAttr) in MarkdocRenderer.
 * CMS editors can only use the formatting options enabled in keystatic.config.tsx:
 *   headings (h2-h4), bold, italic, strikethrough, links, lists, tables,
 *   blockquotes, dividers, images.
 */

const figure: Schema = {
  render: 'figure',
  selfClosing: true,
  attributes: {
    src: { type: String, required: true, errorLevel: 'critical' },
    alt: { type: String, required: true },
    caption: { type: String },
    /**
     * Uvedení autora a licence. Povinné u cizích snímků pod CC — fotky
     * v /images/trips/ jsou převzaté z Wikimedia Commons a bez atribuce
     * bychom porušili jejich licenci.
     */
    credit: { type: String },
    /** Odkaz na zdroj snímku (stránka na Commons), pokud je. */
    creditHref: { type: String },
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
    layout: { type: String, default: 'grid', matches: ['grid', 'scroll'] },
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

const treatmentBox: Schema = {
  render: 'treatment-box',
  selfClosing: true,
  attributes: {
    title: { type: String, required: true, errorLevel: 'critical' },
    description: { type: String, required: true },
    icon: {
      type: String,
      default: 'water',
      matches: ['water', 'earth', 'gas', 'climate'],
    },
  },
}

const statCounter: Schema = {
  render: 'stat-counter',
  attributes: {
    caption: { type: String },
    columns: { type: Number, default: 3, matches: [2, 3, 4] },
  },
}

const stat: Schema = {
  render: 'stat',
  selfClosing: true,
  attributes: {
    value: { type: String, required: true, errorLevel: 'critical' },
    prefix: { type: String },
    suffix: { type: String },
    label: { type: String, required: true, errorLevel: 'critical' },
  },
}

const youtube: Schema = {
  render: 'youtube',
  selfClosing: true,
  attributes: {
    videoId: { type: String, required: true, errorLevel: 'critical' },
    title: { type: String },
  },
}

const hotelBox: Schema = {
  render: 'hotel-box',
  selfClosing: true,
  attributes: {
    name: { type: String, required: true, errorLevel: 'critical' },
    stars: { type: Number, required: true },
    badge: { type: String },
    description: { type: String, required: true },
    bookingUrl: { type: String, required: true },
    bookingLabel: { type: String, required: true },
  },
}

const bookCta: Schema = {
  render: 'book-cta',
  selfClosing: true,
  attributes: {
    hotel: { type: String, required: true, errorLevel: 'critical' },
    locale: { type: String, required: true, errorLevel: 'critical' },
    label: { type: String, required: true, errorLevel: 'critical' },
  },
}

export const markdocConfig: Config = {
  tags: {
    figure,
    gallery,
    'gallery-image': galleryImage,
    pullquote,
    'treatment-box': treatmentBox,
    'stat-counter': statCounter,
    stat,
    'hotel-box': hotelBox,
    'book-cta': bookCta,
    youtube,
  },
}
