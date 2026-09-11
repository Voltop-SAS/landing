import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'
import sharp from 'sharp'
import { locales, isLocale, defaultLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { og } from '~/core/common/domain/consts/copy'
import { home } from '~/core/home/domain/consts/copy'

/** One image is prerendered per language rather than generated per request. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/**
 * OPEN GRAPH IMAGE · an adaptation of the home page's hero to 1200×630.
 *
 * ── IT IS NOT A SCREENSHOT ───────────────────────────────────────────────
 * It is composed here, with the same assets, typefaces and layers the hero
 * uses, because 1200×630 is a different frame from a browser window: a capture
 * would drag in the navigation bar, the language switch and the download
 * floater — chrome that means nothing outside the site — and would put the
 * headline wherever the viewport happened to leave it.
 *
 * What it keeps, and only this: the photograph, the charger inside it, the
 * headline, part of the lead and the logo.
 *
 * ── THE FILES IN `_og/` ──────────────────────────────────────────────────
 * They are build-time assets, never served. See `_og/README.md`.
 *
 * · `hero-og.jpg` is the hero photograph cropped to 1200×630 with the SAME
 *   framing the desktop home uses: `object-cover` focused at 62% / 50%.
 * · The typefaces are TTF because **Satori does not read woff2**, which is what
 *   `next/font` serves. They are subset to the 57 glyphs this card uses in the
 *   three languages: 5 KB and 6 KB instead of 139 KB and 163 KB.
 *
 * Everything is inlined as a data URI: the image is generated at build time,
 * when there is no server yet to fetch anything from.
 *
 * ── `inset: 0` DOES NOT WORK HERE, AND FAILS SILENTLY ────────────────────
 * Satori does not support the `inset` shorthand. Written that way the veils
 * came out with zero size and were never painted — and nothing warned, because
 * the photograph is dark at the bottom on its own, so the card looked
 * plausible. It was caught by putting a 60% red over the layer and watching the
 * output not change by a single byte. Always `top`/`left`/`width`/`height`.
 *
 * ── THE VEILS ARE THE HERO'S OWN ─────────────────────────────────────────
 * Two layers, the same pair and the same stops the desktop hero uses — a
 * vertical one that anchors the composition and a lateral one that protects the
 * text without darkening the half of the frame where the equipment is. The
 * values are the hero's, converted from `color-mix` over the token to the
 * literal `canvas` because Satori resolves no CSS variables.
 */
/**
 * The first sentence of the hero's OWN subtitle — not a copy of it.
 *
 * The brief asked for «part of the subtitle if the composition allows it», and
 * deriving it means the card can never drift from the page: change the hero's
 * lead and this follows. The three locales split cleanly on the full stop.
 */
const firstSentence = (text: string) => `${text.split('. ')[0]}.`

const dir = (f: string) => join(process.cwd(), 'src', 'app', '[locale]', '_og', f)

const HERO = `data:image/jpeg;base64,${readFileSync(dir('hero-og.jpg')).toString('base64')}`
const POPPINS = readFileSync(dir('poppins-semibold.ttf'))
const MANROPE = readFileSync(dir('manrope.ttf'))

/**
 * The official logo, embedded as a data URI.
 *
 * `/Logo_voltop.svg` cannot be referenced by path here: the image is generated
 * at build time, when there is no server yet to serve `public/`.
 */
const LOGO = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), 'public', 'Logo_voltop.svg'),
).toString('base64')}`

/** `--color-canvas`. Written out because Satori resolves no CSS variables. */
const CANVAS = '10, 15, 26'
const canvas = (pct: number) => `rgba(${CANVAS}, ${pct / 100})`

export const size = { width: 1200, height: 630 }

/**
 * JPEG, NOT PNG — AND THAT IS THE WHOLE REASON FOR THE RE-ENCODE BELOW.
 *
 * `ImageResponse` only emits PNG, and a PNG of a PHOTOGRAPH at 1200×630 came
 * out at **1.62 MB**. WhatsApp drops previews over roughly 600 KB, so the card
 * would simply not appear — the very problem this is meant to fix.
 *
 * The card is re-encoded to JPEG with `sharp`, which the project already has
 * for `next/image`. It happens at BUILD time: the route is prerendered per
 * language, so nothing is re-encoded at request time.
 */
export const contentType = 'image/jpeg'

export const alt = 'Voltop — infraestructura de carga para vehículos eléctricos en Colombia'

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : defaultLocale

  const png = new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative' }}>
      {/* The photograph, already framed. */}
      <img
        src={HERO}
        width={1200}
        height={630}
        style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630 }}
        alt=""
      />

      {/* Vertical veil — the hero's own stops. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          backgroundImage: `linear-gradient(to top, ${canvas(80)} 0%, ${canvas(46)} 52%, ${canvas(14)} 100%)`,
        }}
      />
      {/* Lateral veil — protects the text and leaves the charger visible. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          backgroundImage: `linear-gradient(to right, ${canvas(86)} 0%, ${canvas(56)} 44%, ${canvas(0)} 70%)`,
        }}
      />

      {/* The text column, on the left as on the desktop home. */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 72px 64px',
          width: 790,
        }}
      >
        <div
          style={{
            fontFamily: 'Poppins',
            fontSize: 76,
            lineHeight: 1.04,
            letterSpacing: -2,
            color: '#e6e9ee', // --color-ink
            maxWidth: 470,
          }}
        >
          {t(og.headline, locale)}
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: 'Manrope',
            fontSize: 25,
            lineHeight: 1.5,
            color: '#a3b2c3', // --color-ink-2
            maxWidth: 470,
          }}
        >
          {firstSentence(t(home.hero.lead, locale))}
        </div>
        <img
          src={LOGO}
          width={172}
          height={40}
          alt=""
          style={{ marginTop: 40 }}
        />
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Poppins', data: POPPINS, weight: 600, style: 'normal' },
        { name: 'Manrope', data: MANROPE, weight: 400, style: 'normal' },
      ],
    },
  )

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 84, mozjpeg: true, progressive: true })
    .toBuffer()

  return new Response(new Uint8Array(jpeg), {
    headers: { 'Content-Type': contentType },
  })
}
