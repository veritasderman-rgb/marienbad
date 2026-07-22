# Design Brief — Your Free Marienbad Guide (PDF)

This brief tells the layout session (Affinity Publisher) how the finished PDF should look.
It mirrors the marienbad.com brand so the guide feels like a natural extension of the site.

---

## 1. The deliverable

- **A downloadable lead-magnet PDF**, ~20 pages (see page plan in `01_GUIDE-CONTENT.md`).
- Delivered by email to people who sign up on marienbad.com.
- **Two output profiles to export:**
  - `Marienbad-Guide_screen.pdf` — RGB, 150 dpi, hyperlinks live, < 15 MB (for email/download).
  - `Marienbad-Guide_print.pdf` — CMYK, 300 dpi, 3 mm bleed (optional, if it will ever be printed).
- **Format:** A4 portrait (210 × 297 mm) is the safe default. US Letter is fine if the
  audience skews North American. Keep a **12–15 mm outer margin** and a clear baseline grid.

---

## 2. Brand colours (Ensana palette)

Use these exact roles. Hex values are working values consistent with the marienbad.com
theme — confirm against `src/styles/global.css` if you have the repo, but these are safe.

| Token | Hex (working) | Role in the guide |
|-------|---------------|-------------------|
| **Indigo** | `#2B2D5B` | Primary brand colour · headlines · dark page backgrounds · deep panels |
| **Turquoise** | `#3BAFA2` | Accent · section labels · icons · rules · links · timeline dots |
| **Yellow** | `#F2C14E` | CTA buttons · badges · "book now" callouts · attention marks |
| **Aubergine** | `#5B2A45` | Secondary dark · back cover · pull-quotes · contrast panels |
| **Beige** | `#F3EBDD` | Warm section backgrounds · soft callout boxes · page tints |

> If you have access to the repository, the authoritative scales live as Tailwind 4
> `@theme` tokens in `src/styles/global.css`. Sample the real values there for pixel-exact
> brand match; otherwise the table above is a faithful stand-in.

**Colour usage rules**
- Body text: near-black or deep indigo on white/beige. Never pure black on beige.
- Section labels: turquoise, small caps, letter-spaced.
- CTAs: yellow fill, indigo text.
- Big statement pages (cover, "natural treasures", contact, back cover): indigo or
  aubergine background with white text and turquoise/yellow accents.

---

## 3. Typography

- **Primary family:** *Branding* (Latinotype) — the site font, weights 100–900 incl. italics.
  If the layout machine doesn't have it, substitute a clean humanist/geometric sans:
  **Poppins, Montserrat, or Mundial** as the closest free stand-ins. Keep ONE family
  throughout for brand consistency.
- **Headlines:** Branding SemiBold/Bold, indigo, generous size (fluid, large on feature pages).
- **Section labels/kickers:** Branding Medium, small caps, +120 tracking, turquoise.
- **Body:** Branding Regular, 10–11 pt, 140–150 % leading, comfortable measure (60–72 chars).
- **Pull quotes:** Branding Light Italic, large, aubergine or turquoise.
- **Captions:** Branding Regular 8–9 pt, turquoise or grey.
- Use a **fluid, classical type scale** — the site uses `clamp()`; in print, aim for a
  clear hierarchy (e.g. 40 / 28 / 18 / 11 pt) and stick to it.

---

## 4. Layout language

- **Airy and editorial**, not brochure-busy. Lots of white (and beige) space. The site's
  design principle is "performance first / calm / content-driven" — echo that restraint.
- **Section labels** at the top of every content page (turquoise small caps), so the guide
  reads like a well-organised magazine.
- **Consistent grid:** a 12-column grid works well on A4; most pages are 1–2 text columns
  plus an image.
- **Rules & dividers:** thin turquoise hairlines, not heavy boxes.
- **Callout boxes:** rounded corners, beige or tinted fill, turquoise or yellow left-border.
- **Icons:** simple line icons in turquoise (springs = droplet, golf = flag, climate =
  mountain, treatments = leaf, etc.). Keep them monoline and consistent.
- **Image treatment:** generous, often full-bleed on feature pages; soft indigo gradient
  overlays where text sits on a photo. Rounded 4–8 px corners on inset images for warmth.
- **Page furniture:** running footer with `marienbad.com` + page number in turquoise.

---

## 5. Page plan (summary)

| Page | Content | Feel |
|------|---------|------|
| 1 | Cover | Full-bleed photo, big title |
| 2 | Welcome | Warm intro + pull quote |
| 3 | At a Glance | Fact-box infographic |
| 4 | Short History | Body + vertical timeline |
| 5 | The Springs | Card grid, 6 springs |
| 6 | Natural Treasures | Feature panels (Maria's Gas hero) |
| 7 | What the Cure Helps | Two big tiles + chip list |
| 8 | The Spa Experience | Icon list + Roman Baths box |
| 9 | Where to Stay (intro) | Hero image |
| 10–11 | The Seven Hotels | 7-card spread |
| 12 | Things to Do | Numbered must-sees |
| 13 | Active Marienbad | Golf feature + icon list |
| 14 | Culture & Events | Calendar list |
| 15 | Day Trips | Card grid w/ distances |
| 16 | Season by Season | 4 seasonal panels |
| 17 | A Perfect Day | Vertical timeline |
| 18 | Practical Info | Two-column panel |
| 19 | Plan Your Visit | Contact panel + CTA |
| 20 | Back Cover | Minimal, dark, sign-off |

Full copy for each page is in `01_GUIDE-CONTENT.md`. Image assignments are in
`03_IMAGE-MANIFEST.md`.

---

## 6. Tone reminders (from the marienbad.com brand)

- **Warm and inviting** — not clinical.
- **Professional** — trustworthy on health/wellness.
- **Evocative** — appeal to the senses; paint the experience.
- **Respectful of tradition** — 200+ years of spa culture.
- The goal of this guide is gentle promotion: make the reader *want* to come to Marienbad
  and to book with **Ensana**. Every page should leave them a little closer to that email
  to reservations.

---

## 7. Handling images & placeholders

- The `/images/` folder contains real, usable photos pulled from the marienbad.com media
  library. They are **web-resolution (≈1200–1600 px wide)** — perfectly good for a
  screen/download PDF at A4, and acceptable for most in-page placements at print size,
  but **not** ideal for full-page 300 dpi print bleeds.
- Where a slot is marked `[PLACEHOLDER]` in the manifest, drop in a grey box at the right
  aspect ratio; the client will supply a hi-res original from the internal database.
- **Recommended workflow for the client:** for any full-bleed / cover / back-cover image,
  swap the bundled web image for a hi-res original before final export.
- Keep every image's focal point in mind when applying gradients so no faces or key detail
  are lost under text.
