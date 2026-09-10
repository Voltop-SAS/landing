import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locales, isLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import {
  href,
  routes,
  absoluteUrl,
  alternatesFor,
  SITE_URL,
} from '~/core/common/domain/i18n/routes'
import { red, station as stationCopy, stationMeta } from '~/core/network/domain/consts/copy'
import { actions, a11y, units } from '~/core/common/domain/consts/copy'
import {
  getStations,
  getStation,
  getCity,
  getStationsByCity,
  getPostsForStation,
} from '~/core/common/infrastructure/data-access'
import { novedadesInline } from '~/core/news/domain/consts/copy'
import { PostsInline } from '~/core/news/infrastructure/ui/components/PostsInline'
import { TrackView } from '@ui/common/components/analytics/TrackView'
import {
  Section,
  Container,
  Eyebrow,
  SectionHeading,
} from '@ui/common/components/ui/LayoutPrimitives'
import { StatusBadge, SpecList } from '@ui/common/components/ui/DataPrimitives'
import { Media } from '@ui/common/components/ui/Media'
import { Button } from '@ui/common/components/ui/Button'
import { media } from '~/core/common/infrastructure/content/media'
import { formatPowerKw } from '~/core/network/domain/entities/Station'

type Props = { params: Promise<{ locale: string; slug: string }> }

/**
 * /RED/ESTACION/[SLUG] · station page.
 *
 * Generated entirely from data: adding a station to the dataset creates the
 * page, its metadata and its structured data. Zero manual work (§30).
 */
/**
 * CLOSED PARAMS. A `notFound()` thrown from a page resolves no boundary at all
 * in Next 16 with this route tree: it serves an error document with an EMPTY
 * body, and the branded 404 only appears after hydration, so a crawler sees a
 * blank page.
 *
 * With `dynamicParams = false` the rejection happens in the ROUTER: a slug that
 * is not in `generateStaticParams` returns 404 before rendering anything, and
 * that 404 does use `src/app/not-found.tsx`. It is also the right thing for
 * routes generated from data: a slug that does not exist should not render on
 * demand.
 *
 * It costs no flexibility: the site is already fully static and any change to
 * the dataset requires a build.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) => getStations().map((s) => ({ locale, slug: s.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const s = getStation(slug)
  if (!s) return {}
  const city = getCity(s.citySlug)
  const path = routes.station(s.slug)

  return {
    title: `${s.name}${city ? ` · ${city.name}` : ''}`,
    description: t(
      stationMeta.description,
      locale,
    )({
      /* With no resolved city the place name is omitted rather than printing
         "undefined" in the description a search engine reads. */
      city: city?.name ?? 'Colombia',
      powerKw: formatPowerKw(s.powerKw),
      points: s.points,
      connectors: s.connectors.join(', '),
    }),
    alternates: alternatesFor(locale, path),
  }
}

export default async function StationPage({ params }: Props) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const s = getStation(slug)
  if (!s) notFound()
  const city = getCity(s.citySlug)
  const nearby = getStationsByCity(s.citySlug).filter((n) => n.slug !== s.slug)
  /* Log re-surfacing: THIS station's opening shows up here on its own, by
     reference. With no entries, `PostsInline` renders nothing. */
  const news = await getPostsForStation(s.slug)

  /* Without confirmed coordinates, "get directions" opens a search by address.
     That is honest and it works; once the coordinates arrive, the link improves
     on its own. */
  const directions = s.geo
    ? `https://www.google.com/maps/dir/?api=1&destination=${s.geo.lat},${s.geo.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name}, ${t(s.address, locale)}`)}`

  const specs = [
    {
      label: t(stationCopy.specs.power, locale),
      value: formatPowerKw(s.powerKw),
      tone: 'number' as const,
    },
    { label: t(stationCopy.specs.points, locale), value: `${s.points}`, tone: 'number' as const },
    {
      label: t(stationCopy.specs.connectors, locale),
      value: s.connectors.join(' · '),
      tone: 'text' as const,
    },
    { label: t(stationCopy.specs.hours, locale), value: t(s.hours, locale), tone: 'text' as const },
  ]

  /* Structured data: every station is a local-search asset (§29). */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EVChargingStation',
    name: `${s.name} — Voltop`,
    url: absoluteUrl(locale, routes.station(s.slug)),
    address: {
      '@type': 'PostalAddress',
      streetAddress: t(s.address, locale),
      addressLocality: city?.name,
      addressCountry: 'CO',
    },
    ...(s.geo
      ? { geo: { '@type': 'GeoCoordinates', latitude: s.geo.lat, longitude: s.geo.lng } }
      : {}),
    /* Only when there is a machine-readable value. It used to emit
       `t(s.hours, locale)` — "Abierto 24/7", "Consultar en la app" — into a
       property that expects `Mo-Su 00:00-23:59`, so a search engine read free
       Spanish text where it looks for a schedule and discarded it. */
    ...(s.openingHours ? { openingHours: s.openingHours } : {}),
    provider: { '@type': 'Organization', name: 'Voltop', url: SITE_URL },
    amenityFeature: s.services.map((sv) => ({
      '@type': 'LocationFeatureSpecification',
      name: t(sv, locale),
      value: true,
    })),
  }

  /* §29 asks for `BreadcrumbList` on deep routes, and it was the only one of
     the three structured-data types not yet satisfied. The VISUAL breadcrumbs
     already existed just below; this is the same hierarchy stated for the
     search engine, and it goes in the same order so the two cannot diverge. */
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t(red.hero.eyebrow, locale),
        item: absoluteUrl(locale, routes.network),
      },
      ...(city
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: city.name,
              item: absoluteUrl(locale, routes.city(city.slug)),
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: city ? 3 : 2,
        name: s.name,
        item: absoluteUrl(locale, routes.station(s.slug)),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* The end of the B2C funnel. `threshold={0}` because what is measured
          here is the PAGE, not a block crossing the viewport.

          `status` carries a STORED value — `operativa`, `proxima`,
          `mantenimiento` — and those stay in Spanish: they are data, and
          renaming them is a migration (see AGENTS.md). */}
      <TrackView
        event="view_station"
        threshold={0}
        props={{
          slug: s.slug,
          city: s.citySlug,
          power_kw: s.powerKw.max,
          connectors: s.connectors.join(','),
          status: s.status,
        }}
      />

      <Section
        space="none"
        className="pb-8 pt-32 md:pt-40"
      >
        <Container>
          <nav
            aria-label={t(a11y.breadcrumb, locale)}
            className="font-mono text-mono text-ink-3"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href={href(locale, routes.network)}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
                >
                  {t(red.hero.eyebrow, locale)}
                </Link>
              </li>
              {city && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={href(locale, routes.city(city.slug))}
                      className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
                    >
                      {city.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li
                aria-current="page"
                className="text-ink-2"
              >
                {s.name}
              </li>
            </ol>
          </nav>

          <Eyebrow className="mt-8">{t(stationCopy.eyebrow, locale)}</Eyebrow>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-3">
            <h1 className="font-display text-display-xl font-semibold text-ink">{s.name}</h1>
            <StatusBadge
              status={s.status}
              locale={locale}
            />
          </div>
          <p className="mt-4 text-body-l text-ink-2">{t(s.address, locale)}</p>
        </Container>
      </Section>

      {/* The station's own media. The dataset does not carry files yet (§32).
          It goes in `content`, not `wide`: it stuck out 100px to the left of the
          headline. Full bleed is reserved for media that earns it. */}
      <Section
        space="none"
        className="pb-(--spacing-section-tight)"
      >
        <Container>
          {/* `Media`, NOT `MediaPending`.
              This used the placeholder component directly, so the day the
              photos arrive this page would still be showing the grey rectangle
              and nobody would notice. `Media` falls back to the placeholder on
              its own when there is no file, and shows the photo as soon as one
              exists.

              And it looks FIRST at the station's own photo:
              `station.media.photos` had been in the model from the start and
              nobody read it. Only if there is none does it fall back to the
              generic charging-detail asset. */}
          <Media
            asset={
              s.media.photos[0]
                ? {
                    ...media.chargingDetail,
                    src: s.media.photos[0].src,
                    alt: s.media.photos[0].alt,
                  }
                : {
                    ...media.chargingDetail,
                    alt: {
                      es: `Fotografía de la estación ${s.name}`,
                      en: `Photo of the ${s.name} station`,
                      pt: `Fotografia da estação ${s.name}`,
                    },
                  }
            }
            locale={locale}
            aspect="21/9"
            sizes="(min-width: 1280px) 1240px, 100vw"
            className="w-full"
          />
        </Container>
      </Section>

      <Section space="tight">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.7fr_1fr]">
            <div>
              <SectionHeading size="m">{t(stationCopy.specs.title, locale)}</SectionHeading>
              {/* 2x2, not 4x1. Four columns inside the content column left 128
                  usable pixels per cell: the opening hours wrapped onto three
                  lines at EVERY width, 1440 included. */}
              <SpecList
                items={specs}
                className="mt-6"
              />

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
                    {t(stationCopy.specs.pricing, locale)}
                  </p>
                  {/* The figure and, beside it, the qualification. "IVA incluido"
                      does not stand alone: it qualifies a price, so it lives
                      right next to it and at a lighter weight — the number is
                      the fact, the tax is the small print.

                      The thousands separator is the dot, which is Colombia's:
                      `1.780`, not `1,780`. It is formatted with `es-CO` rather
                      than typed by hand so it does not depend on where the site
                      is built. */}
                  <p className="font-display text-display-s text-ink">
                    {s.pricing ? (
                      <>
                        ${new Intl.NumberFormat('es-CO').format(s.pricing.perKwh)}{' '}
                        {s.pricing.currency}/kWh{' '}
                        <span className="text-body-s text-ink-3">
                          {t(stationCopy.pricingTaxNote, locale)}
                        </span>
                      </>
                    ) : (
                      t(stationCopy.pricingTaxNote, locale)
                    )}
                  </p>
                </div>
                <p className="mt-2 text-caption text-ink-3">
                  {t(stationCopy.pricingVaries, locale)}
                </p>
              </div>

              {s.services.length > 0 && (
                <div className="mt-14">
                  <SectionHeading size="s">{t(stationCopy.services, locale)}</SectionHeading>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.services.map((sv, i) => (
                      <li
                        key={i}
                        className="rounded-(--radius-pill) border border-line px-4 py-2 text-body-s text-ink-2"
                      >
                        {t(sv, locale)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside>
              <SectionHeading size="s">{t(stationCopy.location, locale)}</SectionHeading>
              <p className="mt-5 text-body-s text-ink-2">{t(s.address, locale)}</p>
              <div className="mt-6 flex flex-col gap-3">
                {/* `locale` + `external` are not decorative: together they add
                    the "opens in a new tab" notice and the exit icon, so every
                    link leaving the site behaves the same way (WCAG 3.2.5).

                    This was a `DirectionsButton` client island whose ONLY job was
                    emitting `estacion_como_llegar`. Tagging Plan v1.1 moved that
                    to `get_directions_click`, read by GTM from the outbound URL,
                    so the island shipped JavaScript for nothing and was deleted. */}
                <Button
                  variant="primary"
                  arrow
                  external
                  locale={locale}
                  href={directions}
                  className="w-full"
                >
                  {t(actions.getDirections, locale)}
                </Button>
              </div>
              {!s.geo && (
                <p className="mt-4 text-caption text-ink-3">{t(stationCopy.pendingGeo, locale)}</p>
              )}
            </aside>
          </div>
        </Container>
      </Section>

      {news.length > 0 && (
        <div className="border-t border-line">
          <PostsInline
            posts={news}
            locale={locale}
            title={novedadesInline.station.title}
          />
        </div>
      )}

      {nearby.length > 0 && (
        <Section
          space="tight"
          className="border-t border-line"
        >
          <Container>
            <SectionHeading size="m">{t(stationCopy.nearby, locale)}</SectionHeading>
            <ul className="mt-8">
              {nearby.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={href(locale, routes.station(n.slug))}
                    className="group flex flex-wrap items-baseline justify-between gap-4 border-b border-line py-5 transition-colors hover:bg-surface-1"
                  >
                    <span className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                      {n.name}
                    </span>
                    <span className="font-mono text-mono text-ink-2">
                      {formatPowerKw(n.powerKw)} · {n.points} {t(units.pointsShort, locale)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                variant="link"
                arrow
                href={href(locale, routes.network)}
              >
                {t(actions.backToNetwork, locale)}
              </Button>
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
