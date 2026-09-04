import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locales, isLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes, alternatesFor } from '~/core/common/domain/i18n/routes'
import { red, city as cityCopy } from '~/core/red/domain/consts/copy'
import { units, a11y } from '~/core/common/domain/consts/copy'
import {
  getCities,
  getCity,
  getStationsByCity,
  getPostsForCity,
} from '~/core/common/infrastructure/data-access'
import { novedadesInline } from '~/core/novedades/domain/consts/copy'
import { PostsInline } from '~/core/novedades/infrastructure/ui/components/PostsInline'
import {
  Section,
  Container,
  Eyebrow,
  SectionHeading,
} from '@ui/common/components/ui/LayoutPrimitives'
import { StatusBadge } from '@ui/common/components/ui/DataPrimitives'
import { Reveal } from '@ui/common/components/ui/Reveal'
import { TrackView } from '@ui/common/components/analytics/TrackView'
import { formatPowerKw } from '~/core/red/domain/entities/Station'

type Props = { params: Promise<{ locale: string; city: string }> }

/**
 * /RED/[CIUDAD] · cobertura local.
 *
 * Cada ciudad es una landing de búsqueda local ("cargador eléctrico Medellín"):
 * el canal de adquisición B2C más barato del proyecto (§29).
 * Añadir una ciudad al dataset genera esta ruta automáticamente.
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
  return locales.flatMap((locale) => getCities().map((c) => ({ locale, city: c.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city: citySlug } = await params
  if (!isLocale(locale)) return {}
  const city = getCity(citySlug)
  if (!city) return {}

  const path = routes.city(city.slug)
  return {
    title: `${t(cityCopy.metaTitlePattern, locale)} ${city.name}`,
    description: t(city.intro, locale),
    alternates: alternatesFor(locale, path),
  }
}

export default async function CityPage({ params }: Props) {
  const { locale: raw, city: citySlug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const city = getCity(citySlug)
  if (!city) notFound()

  const stations = getStationsByCity(city.slug)
  const others = getCities().filter((c) => c.slug !== city.slug)
  const news = await getPostsForCity(city.slug)

  return (
    <>
      <Section
        space="none"
        className="pb-6 pt-32 md:pt-40"
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
              <li aria-hidden="true">/</li>
              <li
                aria-current="page"
                className="text-ink-2"
              >
                {city.name}
              </li>
            </ol>
          </nav>

          {/* `ciudad_vista` estaba en el plan de medición sin emitirse (§31).
              Umbral 0 porque el evento es "vio la página", no "leyó el bloque". */}
          <TrackView
            event="ciudad_vista"
            props={{ citySlug: city.slug }}
            threshold={0}
          />
          <Eyebrow className="mt-8">{t(cityCopy.eyebrow, locale)}</Eyebrow>
          <h1 className="mt-4 font-display text-display-xl font-semibold text-ink">
            {t(cityCopy.titlePrefix, locale)} {city.name}
          </h1>
          <p className="mt-6 measure text-body-l text-ink-2">{t(city.intro, locale)}</p>
        </Container>
      </Section>

      <Section
        space="base"
        ariaLabelledby="estaciones-ciudad"
      >
        <Container>
          <SectionHeading
            id="estaciones-ciudad"
            size="m"
          >
            {t(cityCopy.stationsHere, locale)}
          </SectionHeading>

          <ul className="mt-8">
            {stations.map((s, i) => (
              <Reveal
                as="li"
                key={s.slug}
                index={i}
              >
                <Link
                  href={href(locale, routes.station(s.slug))}
                  className="group grid gap-x-6 gap-y-2 border-b border-line py-6 transition-colors hover:bg-surface-1 lg:grid-cols-[1.6fr_1fr_1fr_auto] lg:items-center"
                >
                  <div>
                    <h3 className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                      {s.name}
                    </h3>
                    <p className="mt-0.5 text-body-s text-ink-3">{t(s.address, locale)}</p>
                  </div>
                  <p className="font-mono text-mono text-ink-2">
                    {formatPowerKw(s.powerKw)} · {s.points} {t(units.pointsShort, locale)}
                  </p>
                  <p className="font-mono text-mono text-ink-3">{s.connectors.join(' / ')}</p>
                  <StatusBadge
                    status={s.status}
                    locale={locale}
                    className="justify-self-start md:justify-self-end"
                  />
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {news.length > 0 && (
        <div className="border-t border-line">
          <PostsInline
            posts={news}
            locale={locale}
            title={novedadesInline.city.title}
          />
        </div>
      )}

      {others.length > 0 && (
        <Section
          space="tight"
          className="border-t border-line"
        >
          <Container>
            <SectionHeading size="s">{t(cityCopy.otherCities, locale)}</SectionHeading>
            <ul className="mt-6 flex flex-wrap gap-3">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={href(locale, routes.city(c.slug))}
                    className="inline-flex min-h-11 items-center rounded-(--radius-pill) border border-line-control px-5 text-body-s text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  )
}
