import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'
import { locales, isLocale, defaultLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { brand, og } from '~/core/common/domain/consts/copy'

/** One image is prerendered per language rather than generated per request. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/**
 * Open Graph image built from the brand palette.
 * It depends on no external assets, so it works right now, and it will be
 * replaced by a composition with real photography once the files arrive (§32).
 *
 * ── WHY THE COLOURS ARE LITERALS AND NOT TOKENS ──────────────────────────
 * `ImageResponse` renders through Satori, which does not resolve CSS custom
 * properties: a `var(--color-canvas)` here comes out as nothing. The values
 * have to be written out, so THEY HAVE TO BE KEPT IN STEP BY HAND with
 * `globals.css`.
 *
 * That is exactly what had drifted. When the official palette arrived on
 * 2026-09-02 this file was missed, and four of its five colours were still the
 * provisional ones — background `#0a0f1c`, gradient `#45e0a8 → #28c6e6`, title
 * `#f2f5fa`, lead `#a9b3c4`. Every one is now the token's real value, and the
 * gradient runs in the official direction: cyan `brand-2` to green `brand`.
 *
 * This is the site's face when a link is shared, so a drift here is visible
 * outside the site before it is visible inside it.
 */
/**
 * The official logo, embedded as a data URI.
 *
 * `/Logo_voltop.svg` cannot be referenced by path here: the image is generated
 * at build time, when there is no server yet to serve `public/`. It is read
 * from disk and inlined, which is also what makes the piece self-contained — it
 * does not depend on the network resolving anything when the link is shared.
 */
const LOGO = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), 'public', 'Logo_voltop.svg'),
).toString('base64')}`

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export const alt = 'Voltop — infraestructura de carga para vehículos eléctricos en Colombia'

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : defaultLocale

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0a0f1a', // --color-canvas
        padding: 72,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Current accent: a single line, at the top */}
      <div
        style={{
          height: 6,
          width: 240,
          // The official gradient: --color-brand-2 (cyan) to --color-brand (green).
          background: 'linear-gradient(100deg, #0fc7e1, #51d9b2)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          // --color-ink-3
          style={{ fontSize: 26, color: '#8b95a8', letterSpacing: 4, textTransform: 'uppercase' }}
        >
          {t(og.eyebrow, locale)}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 84,
            lineHeight: 1.02,
            letterSpacing: -2,
            color: '#e6e9ee', // --color-ink
            fontWeight: 600,
            maxWidth: 940,
          }}
        >
          {t(og.headline, locale)}
        </div>
        {/* --color-ink-2 */}
        <div style={{ marginTop: 28, fontSize: 30, color: '#a3b2c3', maxWidth: 820 }}>
          {t(brand.tagline, locale)}
        </div>
      </div>

      {/* This used to be a gradient square plus the word "Voltop" set in text:
            a brand drawn by hand. It is now the official file. The symbol keeps
            its 44px height — it occupies 123.107 of the file's 124 — and the
            logotype lands where the text used to be. */}
      <img
        src={LOGO}
        width={188}
        height={44}
        alt=""
      />
    </div>,
    size,
  )
}
