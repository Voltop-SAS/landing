import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { href, routes, absoluteUrl } from "@/lib/i18n/routes";
import { red } from "@/content/copy/red";
import { actions, states, units } from "@/content/copy/common";
import { getStations, getCities, getCitiesWithStations } from "@/lib/data";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { StationFinder } from "@/components/red/StationFinder";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: t(red.meta.title, lang),
    description: t(red.meta.description, lang),
    alternates: {
      canonical: absoluteUrl(lang, routes.red),
      languages: {
        es: absoluteUrl("es", routes.red),
        en: absoluteUrl("en", routes.red),
        "x-default": absoluteUrl("es", routes.red),
      },
    },
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

  return (
    <>
      <Section space="none" className="pb-6 pt-32 md:pt-40">
        <Container>
          <Eyebrow>{t(red.hero.eyebrow, lang)}</Eyebrow>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h1 className="font-display text-display-xl font-semibold text-ink">{t(red.hero.title, lang)}</h1>
            <p className="measure-narrow text-body text-ink-2">{t(red.hero.lead, lang)}</p>
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
            <h2 id="ciudades-title" className="font-display text-display-l font-semibold text-ink">
              {t(red.cities.title, lang)}
            </h2>
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
          <Eyebrow>{t(red.howToCharge.eyebrow, lang)}</Eyebrow>
          <h2 id="como-title" className="mt-4 max-w-[20ch] font-display text-display-l font-semibold text-ink">
            {t(red.howToCharge.title, lang)}
          </h2>

          <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {red.howToCharge.steps.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 0.08}>
                <div className="border-t border-line pt-6">
                  <span className="font-mono text-mono text-brand">{s.step}</span>
                  <h3 className="mt-4 font-display text-display-s font-semibold text-ink">{t(s.title, lang)}</h3>
                  <p className="mt-2 text-body-s text-ink-2">{t(s.body, lang)}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Handoff a B2B — doble intención del journey */}
      <Section space="tight" className="border-t border-line">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-display-s font-semibold text-ink">{t(red.hostHandoff.title, lang)}</h2>
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
