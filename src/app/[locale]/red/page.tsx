import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes, alternatesFor } from '~/core/common/domain/i18n/routes'
import { red } from '~/core/network/domain/consts/copy'
import { actions, states, units, a11y } from '~/core/common/domain/consts/copy'
import {
  getStations,
  getCities,
  getCitiesWithStations,
  getFaq,
} from '~/core/common/infrastructure/data-access'
import {
  Section,
  Container,
  Eyebrow,
  SectionHeading,
  ProcessList,
} from '@ui/common/components/ui/LayoutPrimitives'
import { Button } from '@ui/common/components/ui/Button'
import { Reveal } from '@ui/common/components/ui/Reveal'
import { StationFinder } from '~/core/network/infrastructure/ui/components/StationFinder'
import { Accordion } from '@ui/common/components/ui/Accordion'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return {
    title: t(red.meta.title, locale),
    description: t(red.meta.description, locale),
    alternates: alternatesFor(locale, routes.network),
  }
}

/**
 * /RED · a product surface (§14).
 *
 * A FUNCTIONAL opening, not an editorial one: a compact intro and then the tool
 * straight away. Every inner page has its own opening — the three of them used
 * to share the same `PageHero` and felt templated.
 *
 * The headline no longer promises "real time": there is no availability
 * integration, and a headline is a contract (§19).
 */
export default async function RedPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const stations = getStations()
  const cities = getCities()
  const coverage = getCitiesWithStations()
  const questions = getFaq()

  /* §29 treats every landing page as a search asset, and this was the cheapest
     one left untapped: five written questions, in three languages, with the
     exact answers people type. Without `FAQPage` they cannot appear as a rich
     result.

     It is generated from the SAME collection that paints the accordion, so the
     two cannot diverge: structured data that does not match what is visible is
     grounds for a penalty, not an improvement. */
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((p) => ({
      '@type': 'Question',
      name: t(p.question, locale),
      acceptedAnswer: { '@type': 'Answer', text: t(p.answer, locale) },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Apertura FUNCIONAL: en una superficie de producto el marco editorial
          paga alquiler. `pt-24` en móvil deja 32px de aire bajo el header de
          64px en lugar de 64px, y el lead se alinea a la baseline del titular
          en desktop en vez de flotar a la derecha creando un hueco en L. */}
      <Section
        space="none"
        className="pb-5 pt-24 md:pb-6 md:pt-32"
      >
        <Container>
          <Eyebrow>{t(red.hero.eyebrow, locale)}</Eyebrow>
          <div className="mt-3 flex flex-col gap-3 md:mt-4 md:flex-row md:items-baseline md:justify-between md:gap-8">
            <h1 className="font-display text-display-xl font-semibold text-ink">
              {t(red.hero.title, locale)}
            </h1>
            <p className="measure-narrow text-body text-ink-2 md:shrink-0 md:pt-2">
              {t(red.hero.lead, locale)}
            </p>
          </div>
        </Container>
      </Section>

      <Section
        space="none"
        className="pb-(--spacing-section)"
      >
        <Container>
          <StationFinder
            locale={locale}
            stations={stations}
            cities={cities}
          />
          <p className="mt-6 font-mono text-mono text-ink-3">{t(states.realtimeInApp, locale)}</p>
        </Container>
      </Section>

      {/* Cobertura por ciudad — entrada a las rutas locales */}
      <Section
        id="ciudades"
        space="tight"
        className="border-t border-line"
        ariaLabelledby="ciudades-title"
      >
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="ciudades-title">{t(red.cities.title, locale)}</SectionHeading>
            <p className="measure-narrow text-body text-ink-2">{t(red.cities.lead, locale)}</p>
          </div>

          <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2">
            {coverage.map(({ city, count, operational, points, maxKw }, i) => (
              <Reveal
                as="li"
                key={city.slug}
                index={i}
                className="bg-canvas"
              >
                <Link
                  href={href(locale, routes.city(city.slug))}
                  className="group flex h-full flex-col p-7 transition-colors hover:bg-surface-1"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-display-m font-semibold text-ink transition-colors group-hover:text-brand">
                      {city.name}
                    </h3>
                    <span className="font-mono text-mono text-ink-3">{city.region}</span>
                  </div>
                  {/* La frase se compone con las cifras del dataset. Ver el
                      comentario de `red.cities.blurb`: antes era `city.intro`,
                      escrita a mano por ciudad, y una de las dos ya llevaba
                      tres números metidos en la prosa. */}
                  <p className="mt-3 measure text-body-s text-ink-2">
                    {t(count === 1 ? red.cities.blurb.one : red.cities.blurb.many, locale)
                      .replace('{stations}', String(count))
                      .replace('{points}', String(points))
                      .replace('{kw}', String(maxKw))}
                  </p>
                  {/* `2/2 estaciones` sobraba: la fracción solo informa cuando
                      los dos números difieren. Se conserva para ese caso —una
                      estación anunciada y todavía no operativa es justo lo que
                      no se puede esconder— y se calla cuando todas operan. */}
                  <p className="mt-6 font-mono text-mono text-ink-3">
                    {operational === count ? count : `${operational}/${count}`}{' '}
                    {t(count === 1 ? units.station : units.stations, locale)}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Cómo cargar — información, respiración */}
      <Section
        id="como-cargar"
        space="loose"
        ariaLabelledby="como-title"
      >
        <Container>
          <SectionHeading
            id="como-title"
            kicker={t(red.howToCharge.eyebrow, locale)}
            measure="max-w-[20ch]"
          >
            {t(red.howToCharge.title, locale)}
          </SectionHeading>

          {/* SÍ es una secuencia: el número informa y es el ancla visual. */}
          <ProcessList
            className="mt-12 md:grid-cols-3"
            items={red.howToCharge.steps.map((s) => ({
              step: s.step,
              title: t(s.title, locale),
              body: t(s.body, locale),
            }))}
          />
        </Container>
      </Section>

      {/* FAQ — narrow lane.

          It goes AFTER "how to charge" and before the B2B handoff, following
          the order in which doubts appear: first how it works, then what is
          left unresolved, and the last question ("can I have a station?") hands
          the thread to the B2B section that follows.

          A narrow lane over content width: no neighbouring section repeats a
          structure (city grid → 3 process columns → lane → single row), which
          is how §12 asks for the rhythm to be built. */}
      <Section
        id="preguntas"
        space="base"
        className="border-t border-line"
        ariaLabelledby="faq-title"
      >
        <Container
          width="narrow"
          align="rail"
        >
          <SectionHeading
            id="faq-title"
            kicker={t(red.faq.eyebrow, locale)}
          >
            {t(red.faq.title, locale)}
          </SectionHeading>
          <Accordion
            className="mt-10"
            newTabLabel={t(a11y.opensInNewTab, locale)}
            items={questions.map((p) => ({
              id: p.id,
              question: t(p.question, locale),
              answer: t(p.answer, locale),
              links: p.links?.map((l) => ({
                label: t(l.label, locale),
                // An external href is already complete: prefixing it with the
                // language would turn it into `/es/https://…`.
                href: l.external ? l.href : href(locale, l.href),
                external: l.external,
              })),
            }))}
          />
        </Container>
      </Section>

      {/* Handoff a B2B — doble intención del journey */}
      <Section
        space="tight"
        className="border-t border-line"
      >
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <SectionHeading size="m">{t(red.hostHandoff.title, locale)}</SectionHeading>
              <p className="mt-2 measure text-body-s text-ink-2">
                {t(red.hostHandoff.body, locale)}
              </p>
            </div>
            <Button
              variant="ghost"
              arrow
              href={href(locale, routes.business)}
              className="shrink-0"
            >
              {t(actions.hostStation, locale)}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
