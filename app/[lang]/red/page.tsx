import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { href, routes, alternatesFor } from "@/lib/i18n/routes";
import { red } from "@/content/copy/red";
import { actions, states, units, a11y } from "@/content/copy/common";
import { getStations, getCities, getCitiesWithStations, getFaq } from "@/lib/data";
import { Section, Container, Eyebrow, SectionHeading, ProcessList } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { StationFinder } from "@/components/red/StationFinder";
import { Accordion } from "@/components/ui/Accordion";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: t(red.meta.title, lang),
    description: t(red.meta.description, lang),
    alternates: alternatesFor(lang, routes.red),
  };
}

/**
 * /RED · superficie de producto (§14).
 *
 * Apertura FUNCIONAL, no editorial: intro compacta y la herramienta de
 * inmediato. Cada página interna tiene su propia apertura — antes las tres
 * compartían el mismo `PageHero` y se sentían plantilladas.
 *
 * El titular ya no promete "tiempo real": no hay integración de disponibilidad
 * y un titular es un contrato (§19).
 */
export default async function RedPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const stations = getStations();
  const cities = getCities();
  const coverage = getCitiesWithStations();
  const preguntas = getFaq();

  return (
    <>
      {/* Apertura FUNCIONAL: en una superficie de producto el marco editorial
          paga alquiler. `pt-24` en móvil deja 32px de aire bajo el header de
          64px en lugar de 64px, y el lead se alinea a la baseline del titular
          en desktop en vez de flotar a la derecha creando un hueco en L. */}
      <Section space="none" className="pb-5 pt-24 md:pb-6 md:pt-32">
        <Container>
          <Eyebrow>{t(red.hero.eyebrow, lang)}</Eyebrow>
          <div className="mt-3 flex flex-col gap-3 md:mt-4 md:flex-row md:items-baseline md:justify-between md:gap-8">
            <h1 className="font-display text-display-xl font-semibold text-ink">{t(red.hero.title, lang)}</h1>
            <p className="measure-narrow text-body text-ink-2 md:shrink-0 md:pt-2">
              {t(red.hero.lead, lang)}
            </p>
          </div>
        </Container>
      </Section>

      <Section space="none" className="pb-(--spacing-section)">
        <Container>
          <StationFinder lang={lang} stations={stations} cities={cities} />
          <p className="mt-6 font-mono text-mono text-ink-3">{t(states.pendingRealtime, lang)}</p>
        </Container>
      </Section>

      {/* Cobertura por ciudad — entrada a las rutas locales */}
      <Section id="ciudades" space="tight" className="border-t border-line" ariaLabelledby="ciudades-title">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="ciudades-title">{t(red.cities.title, lang)}</SectionHeading>
            <p className="measure-narrow text-body text-ink-2">{t(red.cities.lead, lang)}</p>
          </div>

          <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2">
            {coverage.map(({ city, count, operational }, i) => (
              <Reveal as="li" key={city.slug} delay={i * 0.06} y={12} className="bg-canvas">
                <Link href={href(lang, routes.city(city.slug))} className="group flex h-full flex-col p-7 transition-colors hover:bg-surface-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-display-m font-semibold text-ink transition-colors group-hover:text-brand">
                      {city.name}
                    </h3>
                    <span className="font-mono text-mono text-ink-3">{city.region}</span>
                  </div>
                  <p className="mt-3 measure text-body-s text-ink-2">{t(city.intro, lang)}</p>
                  <p className="mt-6 font-mono text-mono text-ink-3">
                    {operational}/{count} {t(units.stations, lang)}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Cómo cargar — información, respiración */}
      <Section id="como-cargar" space="loose" ariaLabelledby="como-title">
        <Container>
          <SectionHeading id="como-title" kicker={t(red.howToCharge.eyebrow, lang)} measure="max-w-[20ch]">
            {t(red.howToCharge.title, lang)}
          </SectionHeading>

          {/* SÍ es una secuencia: el número informa y es el ancla visual. */}
          <ProcessList
            className="mt-12 md:grid-cols-3"
            items={red.howToCharge.steps.map((s) => ({
              step: s.step,
              title: t(s.title, lang),
              body: t(s.body, lang),
            }))}
          />
        </Container>
      </Section>

      {/* Preguntas frecuentes — carril estrecho.

          Va DESPUÉS de "cómo cargar" y antes del handoff a B2B por el orden en
          que aparecen las dudas: primero cómo funciona, luego lo que queda sin
          resolver, y la última pregunta ("¿puedo tener una estación?") entrega
          el hilo a la sección B2B que sigue.

          Carril estrecho sobre ancho de contenido: ninguna sección vecina
          repite estructura (rejilla de ciudades → 3 columnas de proceso →
          carril → fila única), que es como §12 pide construir el ritmo. */}
      <Section id="preguntas" space="base" className="border-t border-line" ariaLabelledby="faq-title">
        <Container width="narrow" align="rail">
          <SectionHeading id="faq-title" kicker={t(red.faq.eyebrow, lang)}>
            {t(red.faq.title, lang)}
          </SectionHeading>
          <Accordion
            className="mt-10"
            newTabLabel={t(a11y.opensInNewTab, lang)}
            items={preguntas.map((p) => ({
              id: p.id,
              question: t(p.question, lang),
              answer: t(p.answer, lang),
              links: p.links?.map((l) => ({
                label: t(l.label, lang),
                // Un href externo ya está completo: prefijarlo con el idioma
                // lo convertiría en `/es/https://…`.
                href: l.external ? l.href : href(lang, l.href),
                external: l.external,
              })),
            }))}
          />
        </Container>
      </Section>

      {/* Handoff a B2B — doble intención del journey */}
      <Section space="tight" className="border-t border-line">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <SectionHeading size="m">{t(red.hostHandoff.title, lang)}</SectionHeading>
              <p className="mt-2 measure text-body-s text-ink-2">{t(red.hostHandoff.body, lang)}</p>
            </div>
            <Button variant="ghost" arrow href={href(lang, routes.empresas)} className="shrink-0">
              {t(actions.hostStation, lang)}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
