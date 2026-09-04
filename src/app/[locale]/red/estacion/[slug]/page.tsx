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
import { red, station as stationCopy, stationMeta } from '~/core/red/domain/consts/copy'
import { actions, a11y, units } from '~/core/common/domain/consts/copy'
import {
  getStations,
  getStation,
  getCity,
  getStationsByCity,
  getPostsForStation,
} from '~/core/common/infrastructure/data-access'
import { novedadesInline } from '~/core/novedades/domain/consts/copy'
import { PostsInline } from '~/core/novedades/infrastructure/ui/components/PostsInline'
import { TrackView } from '@ui/common/components/analytics/TrackView'
import {
  Section,
  Container,
  Eyebrow,
  SectionHeading,
} from '@ui/common/components/ui/LayoutPrimitives'
import { StatusBadge, SpecList, PendingTag } from '@ui/common/components/ui/DataPrimitives'
import { Media } from '@ui/common/components/ui/Media'
import { Button } from '@ui/common/components/ui/Button'
import { DirectionsButton } from '~/core/red/infrastructure/ui/components/DirectionsButton'
import { media } from '~/core/common/infrastructure/content/media'
import { formatPowerKw } from '~/core/red/domain/entities/Station'

type Props = { params: Promise<{ locale: string; slug: string }> }

/**
 * /RED/ESTACION/[SLUG] · ficha de estación.
 *
 * Generada íntegramente desde datos: añadir una estación al dataset crea la
 * página, su metadata y sus datos estructurados. Cero trabajo manual (§30).
 */
/**
 * PARAMS CERRADOS. `notFound()` lanzado desde una página no resuelve ningún
 * boundary en Next 16 con este árbol de rutas: sirve un documento de error con
 * el body VACÍO y el 404 con marca solo aparece tras hidratar, así que un
 * crawler ve una página en blanco.
 *
 * Con `dynamicParams = false` el rechazo lo hace el ROUTER: un slug que no está
 * en `generateStaticParams` devuelve 404 antes de renderizar nada, y ese 404 sí
 * usa `app/not-found.tsx`. Es además lo correcto para rutas generadas desde
 * datos: un slug inexistente no debe renderizarse bajo demanda.
 *
 * No cuesta flexibilidad: el sitio ya es estático por completo y cualquier
 * cambio en el dataset exige un build.
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
      /* Sin ciudad resuelta se omite el topónimo en lugar de imprimir
         "undefined" en la descripción que ve el buscador. */
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
  /* Re-superficie del registro: la apertura de ESTA estación aparece aquí sola,
     por referencia. Sin entradas, `PostsInline` no renderiza nada. */
  const news = await getPostsForStation(s.slug)

  /* Sin coordenadas confirmadas, "cómo llegar" abre una búsqueda por dirección.
     Es honesto y funciona; cuando lleguen las coordenadas, el enlace mejora solo. */
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

  /* Datos estructurados: cada estación es un activo de búsqueda local (§29). */
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
    openingHours: t(s.hours, locale),
    provider: { '@type': 'Organization', name: 'Voltop', url: SITE_URL },
    amenityFeature: s.services.map((sv) => ({
      '@type': 'LocationFeatureSpecification',
      name: t(sv, locale),
      value: true,
    })),
  }

  /* §29 pide `BreadcrumbList` en rutas profundas y era el único de los tres
     tipos de datos estructurados sin cumplir. Las migas VISUALES ya existían
     justo debajo; esto es la misma jerarquía dicha para el buscador, y va en
     el mismo orden para que no puedan divergir. */
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t(red.hero.eyebrow, locale),
        item: absoluteUrl(locale, routes.red),
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

      {/* `estacion_vista` era la ÚNICA vista del plan de medición (§31) sin
          emisor, y es el final del embudo B2C: sin ella el paso más importante
          quedaba ciego. `threshold={0}` porque aquí lo que se mide es la
          PÁGINA, no que un bloque cruce el viewport. */}
      <TrackView
        event="estacion_vista"
        threshold={0}
        props={{
          estacion: s.slug,
          ciudad: s.citySlug,
          potencia_kw: s.powerKw.max,
          conectores: s.connectors.join(','),
          estado: s.status,
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
                  href={href(locale, routes.red)}
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

      {/* Media propia de la estación. El dataset aún no trae archivos (§32).
          Va en `content`, no en `wide`: sobresalía 100px a la izquierda del
          titular. El sangrado se reserva a media que lo justifique. */}
      <Section
        space="none"
        className="pb-(--spacing-section-tight)"
      >
        <Container>
          {/* `Media`, NO `MediaPending`.
              Usaba el componente de hueco directamente, así que el día que
              lleguen las fotos esta ficha seguiría mostrando el rectángulo gris
              y nadie se enteraría. `Media` cae al hueco por sí solo cuando no
              hay archivo, y muestra la foto en cuanto exista.

              Y mira PRIMERO la foto propia de la estación: `station.media.photos`
              existía en el modelo desde el principio y no lo leía nadie. Solo
              si no hay, recurre al asset genérico de detalle de carga. */}
          <Media
            asset={
              s.media.photos[0]
                ? {
                    ...media.detalleCarga,
                    src: s.media.photos[0].src,
                    alt: s.media.photos[0].alt,
                  }
                : {
                    ...media.detalleCarga,
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
              {/* 2×2, no 4×1. Cuatro columnas dentro de la columna de contenido
                  dejaban 128px útiles por celda: el horario envolvía en tres
                  líneas a CUALQUIER ancho, incluido 1440. */}
              <SpecList
                items={specs}
                className="mt-6"
              />

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
                    {t(stationCopy.specs.pricing, locale)}
                  </p>
                  {s.pricing ? (
                    <p className="font-display text-display-s text-ink">
                      {s.pricing.perKwh} {s.pricing.currency}/kWh
                    </p>
                  ) : (
                    <PendingTag>{t(stationCopy.pendingPricingTag, locale)}</PendingTag>
                  )}
                </div>
                {!s.pricing && (
                  <p className="mt-2 text-caption text-ink-3">
                    {t(stationCopy.pendingPricing, locale)}
                  </p>
                )}
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
                {/* `lang` no es decorativo: habilita el aviso de "se abre en
                    una pestaña nueva". Y `estacion_como_llegar` es la conversión
                    final del journey B2C y no se estaba midiendo (§31). */}
                <DirectionsButton
                  locale={locale}
                  href={directions}
                  slug={s.slug}
                />
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
                href={href(locale, routes.red)}
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
