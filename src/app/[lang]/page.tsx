import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '@/lib/i18n/config'
import { alternatesFor, SITE_URL } from '@/lib/i18n/routes'
import { home } from '@/content/copy/home'
import { brand, footer, empresa } from '@/content/copy/common'
import { soporteEmail } from '@/content/data/links'
import { getPostsForCity, hasPage } from '@/lib/data'

import { Hero } from '@/components/home/Hero'
import { InfrastructureSignature } from '@/components/home/InfrastructureSignature'
import { NetworkIndex } from '@/components/home/NetworkIndex'
import { BusinessIntro } from '@/components/home/BusinessIntro'
import { ProofCase } from '@/components/home/ProofCase'
import { NetworkNews } from '@/components/home/NetworkNews'
import { VisionQuote } from '@/components/home/VisionQuote'
import { AppDownload } from '@/components/home/AppDownload'
import { CloseCta } from '@/components/home/CloseCta'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return {
    title: t(home.meta.title, lang),
    description: t(home.meta.description, lang),
    alternates: alternatesFor(lang, ''),
  }
}

/**
 * HOME · 8 beats.
 *
 * SECUENCIA ESTRUCTURAL (§12: dos beats consecutivos no comparten estructura):
 *   1 full-bleed  →  2 sticky scrub  →  3 índice ancho denso  →
 *   4 columna estrecha aireada  →  5 full-bleed con texto encima  →
 *   6 registro cronológico compacto  →  7 columna estrecha + franja ancha  →
 *   8 asimétrico
 *
 * CURVA DE INTENSIDAD:
 *   Alta → MUY ALTA → Media → Media-baja → Alta → BAJA → Media-alta → Alta
 *
 * El beat 6 es nuevo y es el más bajo de la curva a propósito: tres filas
 * fechadas, sin resumen ni media. Sirve para que quien aterriza aquí vea que
 * la compañía se mueve —la pregunta del público institucional— y funciona
 * como respiro antes del cierre. Su estructura no coincide con la de ninguno
 * de sus dos vecinos, y el índice denso del beat 3 no le es consecutivo.
 *
 * La Home PRESENTA: ninguna sección resuelve aquí lo que resuelve una interna.
 */
export default async function HomePage({ params }: Props) {
  const { lang: raw } = await params
  if (!isLocale(raw)) notFound()
  const lang = raw as Locale

  /* `Organization` vivía solo en /nosotros. §29 lo pide "en el sitio", y la
     Home es la página que un buscador toma como representante de la entidad:
     es la que recibe los enlaces de marca y la que aparece en el panel de
     conocimiento. Se declara aquí también, con los mismos datos. */
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: SITE_URL,
    description: t(brand.tagline, lang),
    legalName: empresa.razonSocial,
    taxID: empresa.nit,
    address: {
      '@type': 'PostalAddress',
      streetAddress: empresa.direccion,
      addressLocality: empresa.ciudad,
      addressCountry: empresa.pais,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: soporteEmail,
      availableLanguage: ['es', 'en', 'pt'],
    },
    sameAs: footer.social.map((r) => r.url),
  }

  /**
   * El CTA del beat 2 lleva a la entrada que cuenta la apertura de esa
   * estación, no a su ficha: lo que hay que contar ahí es el hecho —abrió,
   * cuándo, con qué— y eso vive en el registro.
   *
   * Se DERIVA del dataset en lugar de escribirse a mano. El enlace anterior
   * llevaba el slug incrustado en el componente y apuntaba a
   * `san-fernando-plaza`, una estación retirada del dataset: era un 404 y
   * nadie se había enterado. Ahora, si la entrada se renombra o pierde su
   * cuerpo, el botón desaparece en lugar de romperse.
   */
  const aperturaMedellin = (await getPostsForCity('medellin')).find(
    (p) => p.type === 'apertura' && hasPage(p),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Hero lang={lang} />
      <InfrastructureSignature
        lang={lang}
        entradaSlug={aperturaMedellin?.slug}
      />
      <NetworkIndex lang={lang} />
      <BusinessIntro lang={lang} />
      <ProofCase lang={lang} />
      <NetworkNews lang={lang} />
      <VisionQuote lang={lang} />
      <AppDownload lang={lang} />
      <CloseCta lang={lang} />
    </>
  )
}
