import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { routes, alternatesFor, SITE_URL } from '~/core/common/domain/i18n/routes'
import { nosotros } from '~/core/about/domain/consts/copy'
import { brand } from '~/core/common/domain/consts/copy'
import { media } from '~/core/common/infrastructure/content/media'
import {
  getMetrics,
  getFounder,
  getTestimonials,
  getPartners,
} from '~/core/common/infrastructure/data-access'
import {
  Section,
  Container,
  Eyebrow,
  SectionHeading,
} from '@ui/common/components/ui/LayoutPrimitives'
import { MetricRow, PendingTag } from '@ui/common/components/ui/DataPrimitives'
import { Media } from '@ui/common/components/ui/Media'
import { Reveal } from '@ui/common/components/ui/Reveal'
import { TrackView } from '@ui/common/components/analytics/TrackView'

/**
 * El bloque "Cifras en validación" no se publica por ahora (petición de Camilo,
 * 2026-09-08): mostrar indicadores sin valores restaba más de lo que sumaba.
 *
 * La estructura NO se borra —la sección vuelve entera el día que haya datos
 * verificados—, solo deja de renderizarse. Con `hasValidated` en true el bloque
 * ni siquiera entra en juego: se pintan las métricas reales, que es el destino.
 */
const MOSTRAR_CIFRAS_PENDIENTES = false

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return {
    title: t(nosotros.meta.title, locale),
    description: t(nosotros.meta.description, locale),
    alternates: alternatesFor(locale, routes.about),
  }
}

/**
 * /NOSOTROS · credibility.
 *
 * It used to be three blocks (metrics + logos + two testimonials) with no
 * story, no stated criteria for how we build and no leadership. It now has the
 * depth the architecture demands of it: story → how we build → impact →
 * leadership → trust.
 *
 * The impact block does NOT invent figures: while there is no validated data it
 * honestly declares that validation is pending (§33).
 */
export default async function NosotrosPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const metrics = getMetrics()
  const hasValidated = metrics.some((m) => m.validated && m.value)
  const founder = getFounder()
  const testimonials = getTestimonials()
  const partners = getPartners()

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: SITE_URL,
    description: t(brand.tagline, locale),
    areaServed: { '@type': 'Country', name: 'Colombia' },
    founder: { '@type': 'Person', name: founder.name },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* Narrative opening — a different register from /red and /empresas */}
      <Section
        space="none"
        className="pt-32 md:pt-40"
      >
        <Container width="narrow">
          <Eyebrow>{t(nosotros.hero.eyebrow, locale)}</Eyebrow>
          <h1 className="mt-5 font-display text-display-xl font-semibold text-balance text-ink">
            {t(nosotros.hero.title, locale)}
          </h1>
          {/* Tres bloques, no uno: el copy entregado marca "Ahí entra Voltop."
              como destacado. Se distingue subiendo de `text-ink-2` a `text-ink`
              dentro del mismo tamaño y la misma pila — es énfasis del texto, no
              un elemento nuevo. */}
          <div className="mt-7 space-y-5 text-body-l">
            <p className="text-ink-2">{t(nosotros.hero.lead, locale)}</p>
            <p className="text-ink">{t(nosotros.hero.highlight, locale)}</p>
            <p className="text-ink-2">{t(nosotros.hero.leadEnd, locale)}</p>
          </div>
        </Container>
      </Section>

      {/* Story — narrow column, editorial */}
      <Section
        space="base"
        ariaLabelledby="historia-title"
      >
        <Container width="narrow">
          <SectionHeading
            id="historia-title"
            kicker={t(nosotros.story.eyebrow, locale)}
          >
            {t(nosotros.story.title, locale)}
          </SectionHeading>
          <div className="mt-8 space-y-6">
            {nosotros.story.body.map((p, i) => (
              <p
                key={i}
                className="text-body-l text-ink-2"
              >
                {t(p, locale)}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      {/* Real material, full bleed — a breath between blocks of text */}
      <Container width="wide">
        <Media
          asset={media.allianceWake}
          locale={locale}
          corner
          sizes="(min-width: 1600px) 1600px, 100vw"
          aspect="21/9"
        />
      </Container>

      {/* How we build — structural grid */}
      <Section
        space="base"
        ariaLabelledby="criterios-title"
      >
        <Container>
          <SectionHeading
            id="criterios-title"
            kicker={t(nosotros.infrastructure.eyebrow, locale)}
          >
            {t(nosotros.infrastructure.title, locale)}
          </SectionHeading>

          {/* NO numbering: four criteria we do not negotiate are not a
              secuencia, y numerarlos sugería un orden que no existe. El ancla
              es el título, no la cifra. */}
          <ul className="mt-12 grid gap-x-14 gap-y-12 md:grid-cols-2">
            {nosotros.infrastructure.pillars.map((p, i) => (
              <Reveal
                as="li"
                key={i}
                index={i}
              >
                <div className="border-t border-line-strong pt-6">
                  <h3 className="font-display text-display-m font-semibold text-balance text-ink">
                    {t(p.title, locale)}
                  </h3>
                  <p className="mt-3 measure text-body-s text-ink-2">{t(p.body, locale)}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Impact — honest while there are no validated figures */}
      <Section
        id="impacto"
        space="base"
        className="border-t border-line"
        ariaLabelledby="impacto-title"
      >
        <Container>
          <TrackView
            event="impacto_visto"
            props={{ validadas: hasValidated }}
          >
            <SectionHeading
              id="impacto-title"
              kicker={t(nosotros.impact.eyebrow, locale)}
            >
              {t(nosotros.impact.title, locale)}
            </SectionHeading>
          </TrackView>

          <p className="mt-5 measure text-body-l text-ink-2">{t(nosotros.impact.lead, locale)}</p>

          {hasValidated ? (
            <MetricRow
              metrics={metrics}
              locale={locale}
              className="mt-14"
            />
          ) : (
            MOSTRAR_CIFRAS_PENDIENTES && (
              <div className="mt-10 max-w-2xl border-l-2 border-warn/50 pl-6">
                <PendingTag>{t(nosotros.impact.pendingTitle, locale)}</PendingTag>
                <p className="mt-4 text-body-l text-ink-2">
                  {t(nosotros.impact.pendingBody, locale)}
                </p>
                <ul className="mt-8 grid gap-x-10 gap-y-3 font-mono text-mono text-ink-3 sm:grid-cols-2">
                  {metrics.map((m) => (
                    <li
                      key={m.key}
                      className="border-t border-line pt-3"
                    >
                      {t(m.label, locale)}
                      {m.unit ? ` · ${m.unit}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </Container>
      </Section>

      {/* Leadership — the founder's voice, with his material */}
      <Section
        id="liderazgo"
        space="base"
        ariaLabelledby="liderazgo-title"
      >
        <Container>
          <SectionHeading
            id="liderazgo-title"
            kicker={t(nosotros.leadership.eyebrow, locale)}
          >
            {t(nosotros.leadership.title, locale)}
          </SectionHeading>
        </Container>

        <Container
          width="narrow"
          className="mt-14"
        >
          {founder.quote && (
            <blockquote className="font-display text-display-m font-medium text-balance text-ink">
              {t(founder.quote, locale)}
            </blockquote>
          )}
          <p className="mt-6 border-t border-line pt-6 text-body-s">
            <span className="text-ink">{founder.name}</span>
            <span className="text-ink-3"> · {t(founder.role, locale)}</span>
          </p>
        </Container>

        <Container
          width="wide"
          className="mt-14"
        >
          <Media
            asset={media.ceoVision}
            locale={locale}
            corner
            sizes="(min-width: 1600px) 1600px, 100vw"
          />
        </Container>
      </Section>

      {/* Trust — testimonials without cards */}
      <Section
        space="base"
        className="border-t border-line"
        ariaLabelledby="confianza-title"
      >
        <Container>
          <SectionHeading
            id="confianza-title"
            kicker={t(nosotros.trust.eyebrow, locale)}
            measure="max-w-[24ch]"
          >
            {t(nosotros.trust.title, locale)}
          </SectionHeading>

          <ul className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-2">
            {testimonials.map((tm, i) => (
              <Reveal
                as="li"
                key={tm.author}
                index={i}
              >
                <figure className="border-t border-line pt-6">
                  <blockquote className="font-display text-display-s text-ink">
                    {t(tm.quote, locale)}
                  </blockquote>
                  <figcaption className="mt-5 text-body-s">
                    <span className="text-ink">{tm.author}</span>
                    <span className="text-ink-3"> · {t(tm.role, locale)}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>

          {/* The partner strip is omitted while there are no cleared logos (§32) */}
          {partners.length > 0 && (
            <div className="mt-16">
              <SectionHeading
                as="h3"
                size="s"
              >
                {t(nosotros.trust.partnersTitle, locale)}
              </SectionHeading>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
