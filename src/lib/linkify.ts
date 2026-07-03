export interface LinkSegment {
  text: string
  href?: string
}

/**
 * Split plain text into text/link segments, turning http(s):// and bare
 * www. URLs into clickable links. Trailing sentence punctuation (. , ; : ) ])
 * is kept out of the link so URLs at the end of a sentence resolve correctly.
 */
export function linkify(text: string): LinkSegment[] {
  const re = /(https?:\/\/[^\s]+|www\.[^\s]+)/g
  const out: LinkSegment[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) })
    let url = m[0]
    let trail = ''
    while (/[.,;:)\]]$/.test(url)) {
      trail = url.slice(-1) + trail
      url = url.slice(0, -1)
    }
    out.push({ text: url, href: url.startsWith('http') ? url : `https://${url}` })
    if (trail) out.push({ text: trail })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ text: text.slice(last) })
  return out
}
