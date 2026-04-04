import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ url }) => {
  // Sanitize + limit input length to prevent abuse
  const raw = (key: string, fallback: string, max = 200) => {
    const v = url.searchParams.get(key)
    return v ? v.slice(0, max) : fallback
  }
  const title = raw('title', 'Marienbad.com')
  const subtitle = raw('subtitle', 'UNESCO World Heritage Spa Town')
  const locale = raw('locale', 'de', 5)

  // Escape XML/SVG special characters (prevents injection into tspan elements)
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

  // Wrap long text into multiple tspan lines (~40 chars per line)
  function wrapText(text: string, x: number, startY: number, lineHeight: number, maxChars: number): string {
    const words = text.split(' ')
    const lines: string[] = []
    let current = ''
    for (const word of words) {
      if (current && (current + ' ' + word).length > maxChars) {
        lines.push(current)
        current = word
      } else {
        current = current ? current + ' ' + word : word
      }
    }
    if (current) lines.push(current)
    // Limit to 3 lines max
    const visibleLines = lines.slice(0, 3)
    return visibleLines
      .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`)
      .join('')
  }

  const localeLabelMap: Record<string, string> = {
    de: 'Deutsch',
    en: 'English',
    cs: 'Česky',
    ru: 'Русский',
  }
  const localeLabel = localeLabelMap[locale] || locale.toUpperCase()

  const titleLines = wrapText(title, 60, 260, 52, 32)
  const subtitleLines = wrapText(subtitle, 60, 0, 30, 50)

  // Count title lines to position subtitle below
  const titleLineCount = (titleLines.match(/<tspan/g) || []).length
  const subtitleY = 260 + (titleLineCount - 1) * 52 + 64

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#004F71" />
      <stop offset="100%" stop-color="#266782" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <!-- Subtle decorative circles -->
  <circle cx="1050" cy="120" r="200" fill="white" opacity="0.04" />
  <circle cx="1100" cy="500" r="150" fill="white" opacity="0.03" />
  <!-- Branding -->
  <text x="60" y="80" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="white" opacity="0.9">Marienbad.com</text>
  <text x="60" y="110" font-family="Arial, sans-serif" font-size="14" fill="white" opacity="0.5" letter-spacing="3">${esc(localeLabel.toUpperCase())}</text>
  <!-- Divider line -->
  <rect x="60" y="130" width="80" height="3" rx="1.5" fill="#8AD8ED" opacity="0.8" />
  <!-- Title -->
  <text x="60" y="260" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="white">${titleLines}</text>
  <!-- Subtitle -->
  <text x="60" y="${subtitleY}" font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.7">${subtitleLines}</text>
  <!-- Bottom bar -->
  <rect x="0" y="600" width="1200" height="30" fill="black" opacity="0.2" />
  <text x="60" y="622" font-family="Arial, sans-serif" font-size="14" fill="white" opacity="0.5">marienbad.com — UNESCO World Heritage Spa Town</text>
</svg>`

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
