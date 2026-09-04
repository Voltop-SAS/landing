import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locales, isLocale, localeMeta, t, type Locale } from '~/core/common/domain/i18n/config'
import {
  href,
  routes,
  absoluteUrl,
  alternatesFor,
  SITE_URL,
} from '~/core/common/domain/i18n/routes'
import { novedades } from '~/core/novedades/domain/consts/copy'
import { a11y, brand } from '~/core/common/domain/consts/copy'
import {
  getPostsWithPage,
  getPost,
  getStation,
  getCity,
} from '~/core/common/infrastructure/data-access'
import { Section, Container, Rule } from '@ui/common/components/ui/layout'
import { Media } from '@ui/common/components/ui/Media'
import { Button } from '@ui/common/components/ui/Button'
import { PendingTag } from '@ui/common/components/ui/data'
import { PostBody } from '~/core/novedades/infrastructure/ui/components/PostBody'
import { TrackView } from '@ui/common/components/analytics/TrackView'
import { formatDate } from '@ui/common/lib/dates'

type Props = { params: Promise<{ lang: string; slug: string }> }

/**
 * /NOVEDADES/[SLUG] · una entrada del registro.
 *
 * SOLO EXISTE PARA ENTRADAS CON CUERPO. `getPostsWithPage()` filtra las que
 * tienen `body` vacío, así que una apertura de dos líneas no genera una página
 * delgada que repita el texto del índice — ni compite con él en búsqueda.
 * Ver la cabecera de `content/data/posts.ts`.
 *
 * El pie devuelve al producto: la estación o la ciudad de las que habla la
 * entrada. Es donde paga la referencia del modelo y donde un lector que llegó
 * desde prensa o desde una búsqueda entra a la red en lugar de salirse.
 */

export const dynamicParams = false

export async function generateStaticParams() {
  const withPage = await getPostsWithPage()
  return locales.flatMap((lang) => withPage.map((p) => ({ lang, slug: p.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLocale(lang)) return {}
  const post = await getPost(slug)
  if (!post) return {}

  return {
    title: t(post.title, lang),
    description: t(post.summary, lang),
    alternates: alternatesFor(lang, routes.post(post.slug)),
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      title: t(post.title, lang),
      description: t(post.summary, lang),
      url: absoluteUrl(lang, routes.post(post.slug)),
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { lang: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const lang = raw as Locale

  const post = await getPost(slug)
  if (!post) notFound()

  const station = post.stationSlug ? getStation(post.stationSlug) : undefined
  const city = post.citySlug ? getCity(post.citySlug) : undefined

  /**
   * Datos estructurados de artículo (§29).
   *
   * `image` se emite SOLO si el archivo existe de verdad. Declarar una imagen
   * que no se ha entregado sería prometerle al buscador algo que la página no
   * sirve — la misma falta que inventar una métrica.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: t(post.title, lang),
    description: t(post.summary, lang),
    datePublished: post.date,
    inLanguage: localeMeta[lang].hreflang,
    url: absoluteUrl(lang, routes.post(post.slug)),
    author: { '@type': 'Organization', name: brand.name, url: SITE_URL },
    publisher: { '@type': 'Organization', name: brand.name, url: SITE_URL },
    ...(post.cover?.src ? { image: `${SITE_URL}${post.cover.src}` } : {}),
  }

  return (
    <TrackView
      event="novedad_vista"
      props={{ slug: post.slug, tipo: post.type }}
      threshold={0}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section
        space="none"
        className="pb-8 pt-32 md:pt-40"
      >
        <Container width="narrow">
          <nav
            aria-label={t(a11y.breadcrumb, lang)}
            className="font-mono text-mono text-ink-3"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href={href(lang, routes.novedades)}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
                >
                  {t(novedades.eyebrow, lang)}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              {/* Plural: aquí el tipo nombra la CATEGORÍA, no esta entrada.
                  Ver la nota de `typesPlural` en el copy. */}
              <li className="text-ink-2">{t(novedades.typesPlural[post.type], lang)}</li>
            </ol>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <time
              dateTime={post.date}
              className="font-mono text-mono uppercase tracking-wider text-ink-2"
            >
              {formatDate(post.date, lang)}
            </time>
            {post.dataStatus === 'placeholder' && (
              <PendingTag>{t(novedades.provisionalTag, lang)}</PendingTag>
            )}
          </div>

          <h1 className="mt-5 font-display text-display-xl font-semibold text-balance text-ink">
            {t(post.title, lang)}
          </h1>
          <p className="mt-6 measure text-body-l text-ink-2">{t(post.summary, lang)}</p>

          {post.dataStatus === 'placeholder' && (
            <p className="mt-4 measure text-body-s text-ink-3">
              {t(novedades.provisionalNote, lang)}
            </p>
          )}
        </Container>
      </Section>

      <Section
        space="none"
        className="pb-24 md:pb-32"
      >
        <Container width="narrow">
          {post.cover && (
            /* `controls` cuando la portada es un VÍDEO. Sin él, `VideoMedia` lo
               trata como material de fondo: silenciado, en bucle y sin barra
               —así que la pieza de Wake se veía sin audio y sin forma de
               ponerlo—. Un vídeo que es el sujeto de la entrada se decide ver,
               y para eso hace falta poder darle play, buscar y oírlo.
               Una fotografía de portada no cambia: la prop no le aplica. */
            <Media
              asset={post.cover}
              lang={lang}
              aspect="16/9"
              corner
              controls={post.cover.kind === 'video'}
              sizes="(min-width: 768px) 46rem, 100vw"
              priority
            />
          )}

          <PostBody
            blocks={post.body}
            lang={lang}
          />

          {/* Vuelta al producto: la entrada termina en la red, no en un final ciego. */}
          {(station || city) && (
            <>
              <Rule className="mt-16" />
              <div className="mt-8 flex flex-col gap-6">
                {station && (
                  <div>
                    <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
                      {t(novedades.related.station, lang)}
                    </p>
                    <div className="mt-3">
                      <Button
                        variant="secondary"
                        size="s"
                        arrow
                        href={href(lang, routes.station(station.slug))}
                      >
                        {t(novedades.related.stationCta, lang)}
                      </Button>
                    </div>
                  </div>
                )}
                {city && (
                  <Link
                    href={href(lang, routes.city(city.slug))}
                    className="inline-flex min-h-11 items-center self-start text-body-s text-ink-2 transition-colors hover:text-ink"
                  >
                    {t(novedades.related.city, lang)} {city.name} →
                  </Link>
                )}
              </div>
            </>
          )}

          <div className="mt-14">
            <Link
              href={href(lang, routes.novedades)}
              className="inline-flex min-h-11 items-center font-mono text-mono uppercase tracking-wider text-ink-3 transition-colors hover:text-ink"
            >
              ← {t(novedades.backToIndex, lang)}
            </Link>
          </div>
        </Container>
      </Section>
    </TrackView>
  )
}
