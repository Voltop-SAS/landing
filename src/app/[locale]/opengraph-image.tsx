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
 * Open Graph image generated from the brand tokens.
 * It depends on no external assets, so it works right now, and it will be
 * replaced by a composition with real photography once the files arrive (§32).
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
        background: '#0a0f1c',
        padding: 72,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Acento de corriente: una sola línea, arriba */}
      <div
        style={{
          height: 6,
          width: 240,
          background: 'linear-gradient(100deg, #45e0a8, #28c6e6)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
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
            color: '#f2f5fa',
            fontWeight: 600,
            maxWidth: 940,
          }}
        >
          {t(og.headline, locale)}
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: '#a9b3c4', maxWidth: 820 }}>
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
