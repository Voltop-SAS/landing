import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { alternatesFor, SITE_URL } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { brand, footer, empresa } from '~/core/common/domain/consts/copy'
import { supportEmail } from '~/core/common/domain/consts/links'
import { getPostsForCity, hasPage } from '~/core/common/infrastructure/data-access'

import { Hero } from '~/core/home/infrastructure/ui/components/Hero'
import { InfrastructureSignature } from '~/core/home/infrastructure/ui/components/InfrastructureSignature'
import { NetworkIndex } from '~/core/home/infrastructure/ui/components/NetworkIndex'
import { BusinessIntro } from '~/core/home/infrastructure/ui/components/BusinessIntro'
import { ProofCase } from '~/core/home/infrastructure/ui/components/ProofCase'
import { NetworkNews } from '~/core/home/infrastructure/ui/components/NetworkNews'
import { VisionQuote } from '~/core/home/infrastructure/ui/components/VisionQuote'
import { AppDownload } from '~/core/home/infrastructure/ui/components/AppDownload'
import { CloseCta } from '~/core/home/infrastructure/ui/components/CloseCta'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return {
    title: t(home.meta.title, locale),
    description: t(home.meta.description, locale),
    alternates: alternatesFor(locale, ''),
  }
}

/**
 * HOME · 8 beats.
 *
 * STRUCTURAL SEQUENCE (§12: two consecutive beats never share a structure):
 *   1 full-bleed  →  2 sticky scrub  →  3 dense wide index  →
 *   4 airy narrow column  →  5 full-bleed with text over it  →
 *   6 compact chronological log  →  7 narrow column + wide band  →
 *   8 asymmetric
 *
 * INTENSITY CURVE:
 *   High → VERY HIGH → Medium → Medium-low → High → LOW → Medium-high → High
 *
 * Beat 6 is new and is the lowest point of the curve on purpose: three dated
 * rows, no summary and no media. It exists so that whoever lands here sees the
 * company is moving — the institutional audience's question — and it works as a
 * breath before the close. Its structure matches neither of its two neighbours,
 * and beat 3's dense index is not adjacent to it.
 *
 * The Home PRESENTS: no section here resolves what an inner page resolves.
 */
export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  /* `Organization` used to live only on /nosotros. §29 asks for it "on the
     site", and the Home is the page a search engine takes as the entity's
     representative: it is the one that receives brand links and the one that
     shows up in the knowledge panel. It is declared here too, with the same
     data. */
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: SITE_URL,
    description: t(brand.tagline, locale),
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
      email: supportEmail,
      availableLanguage: ['es', 'en', 'pt'],
    },
    sameAs: footer.social.map((r) => r.url),
  }

  /**
   * Beat 2's CTA leads to the entry that tells the story of that station's
   * opening, not to the station page: what needs telling there is the fact — it
   * opened, when, with what — and that lives in the log.
   *
   * It is DERIVED from the dataset instead of being written by hand. The
   * previous link had the slug baked into the component and pointed at
   * `san-fernando-plaza`, a station that had been removed from the dataset: it
   * was a 404 and nobody had noticed. Now, if the entry is renamed or loses its
   * body, the button disappears instead of breaking.
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
      <Hero locale={locale} />
      <InfrastructureSignature
        locale={locale}
        postSlug={aperturaMedellin?.slug}
      />
      <NetworkIndex locale={locale} />
      <BusinessIntro locale={locale} />
      <ProofCase locale={locale} />
      <NetworkNews locale={locale} />
      <VisionQuote locale={locale} />
      <AppDownload locale={locale} />
      <CloseCta locale={locale} />
    </>
  )
}
