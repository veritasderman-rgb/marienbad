import sanitizeHtml from 'sanitize-html'

/**
 * Sanitizace HTML newsletteru PŘED uložením (audit N-02). HTML píše Claude
 * a upravuje člověk — je to nedůvěryhodný vstup jako každý jiný. Skripty
 * v e-mailech stejně nefungují, takže whitelist e-mailových tagů nic neubírá.
 *
 * Náhled se navíc vykresluje výhradně v <iframe sandbox srcdoc> bez
 * allow-scripts a allow-same-origin — sanitizace je první vrstva, sandbox druhá.
 */

const EMAIL_TAGS = [
  'a', 'abbr', 'b', 'blockquote', 'body', 'br', 'center', 'div', 'em', 'font',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'html', 'i', 'img', 'li',
  'meta', 'ol', 'p', 'pre', 'small', 'span', 'strong', 'style', 'sub', 'sup',
  'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul',
]

export function sanitizeNewsletterHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: EMAIL_TAGS,
    allowedAttributes: {
      '*': ['style', 'class', 'align', 'valign', 'width', 'height', 'bgcolor', 'color', 'dir', 'lang', 'border', 'cellpadding', 'cellspacing', 'role', 'aria-label'],
      a: ['href', 'target', 'rel', 'style', 'class'],
      img: ['src', 'alt', 'width', 'height', 'style', 'class', 'border'],
      meta: ['charset', 'name', 'content', 'http-equiv'],
      font: ['face', 'size', 'color'],
    },
    // https jen — žádné javascript:, data: u odkazů; obrázky https i cid
    allowedSchemes: ['https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['https', 'cid', 'data'] },
    allowProtocolRelative: false,
    // e-maily potřebují <html>/<head>/<body> a <style>
    allowVulnerableTags: true,
    parseStyleAttributes: false,
    disallowedTagsMode: 'discard',
  })
}

/** Hrubý plain-text fallback z HTML (pro plain_body, když nepřijde zvlášť). */
export function htmlToPlainText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
