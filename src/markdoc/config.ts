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
