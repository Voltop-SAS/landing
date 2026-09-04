import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'
import { locales, isLocale, defaultLocale, t, type Locale } from '@/lib/i18n/config'
import { brand, og } from '@/content/copy/common'

/** Se prerenderiza una imagen por idioma en lugar de generarla por petición. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

/**
 * Imagen Open Graph generada desde los tokens de marca.
 * No depende de assets externos, así que funciona desde ya y se sustituirá por
 * una composición con fotografía real cuando lleguen los archivos (§32).
 */
/**
 * El logo oficial, embebido como data URI.
 *
 * Aquí no se puede referenciar `/Logo_voltop.svg` por ruta: la imagen se
 * genera en el build, cuando todavía no hay servidor que sirva `public/`.
 * Se lee del disco y se incrusta, que es además lo que hace la pieza
 * autocontenida —no depende de que la red resuelva nada al compartir el enlace.
 */
const LOGO = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), 'public', 'Logo_voltop.svg'),
).toString('base64')}`

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export const alt = 'Voltop — infraestructura de carga para vehículos eléctricos en Colombia'

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params
  const lang: Locale = isLocale(raw) ? raw : defaultLocale

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
          {t(og.eyebrow, lang)}
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
          {t(og.headline, lang)}
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: '#a9b3c4', maxWidth: 820 }}>
          {t(brand.tagline, lang)}
        </div>
      </div>

      {/* Antes eran un cuadrado con gradiente y la palabra "Voltop" en
            texto: una marca dibujada a mano. Ahora es el archivo oficial. El
            símbolo conserva sus 44px de alto —ocupa 123.107 de los 124 del
            archivo— y el logotipo cae donde estaba el texto. */}
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
