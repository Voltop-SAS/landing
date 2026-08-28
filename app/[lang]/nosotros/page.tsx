import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { routes, absoluteUrl, SITE_URL } from "@/lib/i18n/routes";
import { nosotros } from "@/content/copy/nosotros";
import { brand } from "@/content/copy/common";
import { media } from "@/content/data/media";
import { getMetrics, getFounder, getTestimonials, getPartners } from "@/lib/data";
import { Section, Container, Eyebrow, SectionHeading } from "@/components/ui/layout";
import { MetricRow, PendingTag } from "@/components/ui/data";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { TrackView } from "@/components/analytics/TrackView";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: t(nosotros.meta.title, lang),
    description: t(nosotros.meta.description, lang),
    alternates: {
      canonical: absoluteUrl(lang, routes.nosotros),
      languages: {
        es: absoluteUrl("es", routes.nosotros),
        en: absoluteUrl("en", routes.nosotros),
        "x-default": absoluteUrl("es", routes.nosotros),
      },
    },
  };
}

/**
 * /NOSOTROS · credibilidad.
 *
 * Antes eran tres bloques (métricas + logos + dos testimonios) sin historia,
 * sin criterio de construcción y sin liderazgo. Ahora tiene la profundidad que
 * la arquitectura le exige: historia → cómo construimos → impacto → liderazgo
 * → confianza.
 *
 * El bloque de impacto NO inventa cifras: mientras no haya datos validados
 * declara honestamente que están en validación (§33).
 */
export default async function NosotrosPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const metrics = getMetrics();
  const hasValidated = metrics.some((m) => m.validated && m.value);
  const founder = getFounder();
  const testimonials = getTestimonials();
  const partners = getPartners();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: SITE_URL,
    description: t(brand.tagline, lang),
    areaServed: { "@type": "Country", name: "Colombia" },
    founder: { "@type": "Person", name: founder.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      {/* Apertura narrativa — registro distinto al de /red y /empresas */}
      <Section space="none" className="pt-32 md:pt-40">
        <Container width="narrow">
          <Eyebrow>{t(nosotros.hero.eyebrow, lang)}</Eyebrow>
          <h1 className="mt-5 font-display text-display-xl font-semibold text-balance text-ink">
            {t(nosotros.hero.title, lang)}
          </h1>
          <p className="mt-7 text-body-l text-ink-2">{t(nosotros.hero.lead, lang)}</p>
        </Container>
      </Section>

      {/* Historia — columna estrecha, editorial */}
      <Section space="base" ariaLabelledby="historia-title">
        <Container width="narrow">
          <SectionHeading id="historia-title" kicker={t(nosotros.story.eyebrow, lang)}>
            {t(nosotros.story.title, lang)}
          </SectionHeading>
          <div className="mt-8 space-y-6">
            {nosotros.story.body.map((p, i) => (
              <p key={i} className="text-body-l text-ink-2">
                {t(p, lang)}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      {/* Material real, a sangre — respiración entre bloques de texto */}
      <Container width="wide">
        <Media asset={media.infraestructuraAmplia} lang={lang} sizes="(min-width: 1600px) 1600px, 100vw" aspect="21/9" />
      </Container>

      {/* Cómo construimos — cuadrícula estructural */}
      <Section space="base" ariaLabelledby="criterios-title">
        <Container>
          <SectionHeading id="criterios-title" kicker={t(nosotros.infrastructure.eyebrow, lang)}>
            {t(nosotros.infrastructure.title, lang)}
          </SectionHeading>

          {/* SIN número: cuatro criterios que no negociamos no son una
              secuencia, y numerarlos sugería un orden que no existe. El ancla
              es el título, no la cifra. */}
          <ul className="mt-12 grid gap-x-14 gap-y-12 md:grid-cols-2">
            {nosotros.infrastructure.pillars.map((p, i) => (
              <Reveal as="li" key={i} delay={i * 0.06}>
                <div className="border-t border-line-strong pt-6">
                  <h3 className="font-display text-display-m font-semibold text-balance text-ink">
                    {t(p.title, lang)}
                  </h3>
                  <p className="mt-3 measure text-body-s text-ink-2">{t(p.body, lang)}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Impacto — honesto mientras no haya cifras validadas */}
      <Section id="impacto" space="base" className="border-t border-line" ariaLabelledby="impacto-title">
        <Container>
          <TrackView event="impacto_visto" props={{ validadas: hasValidated }}>
            <SectionHeading id="impacto-title" kicker={t(nosotros.impact.eyebrow, lang)}>
              {t(nosotros.impact.title, lang)}
            </SectionHeading>
          </TrackView>

          {hasValidated ? (
            <>
              <p className="mt-5 measure text-body-l text-ink-2">{t(nosotros.impact.lead, lang)}</p>
              <MetricRow metrics={metrics} lang={lang} className="mt-14" />
            </>
          ) : (
            <div className="mt-10 max-w-2xl border-l-2 border-warn/50 pl-6">
              <PendingTag>{t(nosotros.impact.pendingTitle, lang)}</PendingTag>
              <p className="mt-4 text-body-l text-ink-2">{t(nosotros.impact.pendingBody, lang)}</p>
              <ul className="mt-8 grid gap-x-10 gap-y-3 font-mono text-mono text-ink-3 sm:grid-cols-2">
                {metrics.map((m) => (
                  <li key={m.key} className="border-t border-line pt-3">
                    {t(m.label, lang)}
                    {m.unit ? ` · ${m.unit}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </Section>

      {/* Liderazgo — la voz del fundador, con su material */}
      <Section id="liderazgo" space="base" ariaLabelledby="liderazgo-title">
        <Container>
          <SectionHeading id="liderazgo-title" kicker={t(nosotros.leadership.eyebrow, lang)}>
            {t(nosotros.leadership.title, lang)}
          </SectionHeading>
        </Container>

        <Container width="narrow" className="mt-14">
          {founder.quote && (
            <blockquote className="font-display text-display-m font-medium text-balance text-ink">
              {t(founder.quote, lang)}
            </blockquote>
          )}
          <p className="mt-6 border-t border-line pt-6 text-body-s">
            <span className="text-ink">{founder.name}</span>
            <span className="text-ink-3"> · {t(founder.role, lang)}</span>
          </p>
        </Container>

        <Container width="wide" className="mt-14">
          <Media asset={media.visionCeo} lang={lang} sizes="(min-width: 1600px) 1600px, 100vw" />
        </Container>
      </Section>

      {/* Confianza — testimonios sin tarjetas */}
      <Section space="base" className="border-t border-line" ariaLabelledby="confianza-title">
        <Container>
          <SectionHeading id="confianza-title" kicker={t(nosotros.trust.eyebrow, lang)} measure="max-w-[24ch]">
            {t(nosotros.trust.title, lang)}
          </SectionHeading>

          <ul className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-2">
            {testimonials.map((tm, i) => (
              <Reveal as="li" key={tm.author} delay={i * 0.08}>
                <figure className="border-t border-line pt-6">
                  <blockquote className="font-display text-display-s text-ink">{t(tm.quote, lang)}</blockquote>
                  <figcaption className="mt-5 text-body-s">
                    <span className="text-ink">{tm.author}</span>
                    <span className="text-ink-3"> · {t(tm.role, lang)}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>

          {/* La franja de partners se omite mientras no haya logos con permiso (§32) */}
          {partners.length > 0 && (
            <div className="mt-16">
              <SectionHeading as="h3" size="s">
                {t(nosotros.trust.partnersTitle, lang)}
              </SectionHeading>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
