import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locales, isLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes, alternatesFor } from '~/core/common/domain/i18n/routes'
import { red, city as cityCopy } from '@/content/copy/red'
import { units, a11y } from '~/core/common/domain/consts/copy'
import { getCities, getCity, getStationsByCity, getPostsForCity } from '@/lib/data'
import { novedadesInline } from '@/content/copy/novedades'
import { PostsInline } from '@/components/novedades/PostsInline'
import { Section, Container, Eyebrow, SectionHeading } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data'
import { Reveal } from '@/components/ui/Reveal'
import { TrackView } from '@/components/analytics/TrackView'
import { formatPowerKw } from '@/content/data/stations'

type Props = { params: Promise<{ lang: string; ciudad: string }> }

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
  return locales.flatMap((lang) => getCities().map((c) => ({ lang, ciudad: c.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, ciudad } = await params
  if (!isLocale(lang)) return {}
  const city = getCity(ciudad)
  if (!city) return {}

  const path = routes.city(city.slug)
  return {
    title: `${t(cityCopy.metaTitlePattern, lang)} ${city.name}`,
    description: t(city.intro, lang),
    alternates: alternatesFor(lang, path),
  }
}

export default async function CityPage({ params }: Props) {
  const { lang: raw, ciudad } = await params
  if (!isLocale(raw)) notFound()
  const lang = raw as Locale

  const city = getCity(ciudad)
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
            aria-label={t(a11y.breadcrumb, lang)}
            className="font-mono text-mono text-ink-3"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href={href(lang, routes.red)}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
                >
                  {t(red.hero.eyebrow, lang)}
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
            props={{ ciudad: city.slug }}
            threshold={0}
          />
          <Eyebrow className="mt-8">{t(cityCopy.eyebrow, lang)}</Eyebrow>
          <h1 className="mt-4 font-display text-display-xl font-semibold text-ink">
            {t(cityCopy.titlePrefix, lang)} {city.name}
          </h1>
          <p className="mt-6 measure text-body-l text-ink-2">{t(city.intro, lang)}</p>
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
            {t(cityCopy.stationsHere, lang)}
          </SectionHeading>

          <ul className="mt-8">
            {stations.map((s, i) => (
              <Reveal
                as="li"
                key={s.slug}
                index={i}
              >
                <Link
                  href={href(lang, routes.station(s.slug))}
                  className="group grid gap-x-6 gap-y-2 border-b border-line py-6 transition-colors hover:bg-surface-1 lg:grid-cols-[1.6fr_1fr_1fr_auto] lg:items-center"
                >
                  <div>
                    <h3 className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                      {s.name}
                    </h3>
                    <p className="mt-0.5 text-body-s text-ink-3">{t(s.address, lang)}</p>
                  </div>
                  <p className="font-mono text-mono text-ink-2">
                    {formatPowerKw(s.powerKw)} · {s.points} {t(units.pointsShort, lang)}
                  </p>
                  <p className="font-mono text-mono text-ink-3">{s.connectors.join(' / ')}</p>
                  <StatusBadge
                    status={s.status}
                    lang={lang}
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
            lang={lang}
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
            <SectionHeading size="s">{t(cityCopy.otherCities, lang)}</SectionHeading>
            <ul className="mt-6 flex flex-wrap gap-3">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={href(lang, routes.city(c.slug))}
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
