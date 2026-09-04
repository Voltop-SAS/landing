import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locales, isLocale, t, type Locale } from '@/lib/i18n/config'
import { href, routes, alternatesFor } from '@/lib/i18n/routes'
import { novedades } from '@/content/copy/novedades'
import { getPosts, getFeaturedPost, hasPage } from '@/lib/data'
import { Section, Container, Eyebrow, SectionHeading, Rule } from '@/components/ui/layout'
import { Media } from '@/components/ui/Media'
import { Button } from '@/components/ui/Button'
import { PendingTag } from '@/components/ui/data'
import { PostLog } from '@/components/novedades/PostLog'
import { TrackView } from '@/components/analytics/TrackView'
import { formatDate } from '@/lib/dates'

type Props = { params: Promise<{ lang: string }> }

/**
 * /NOVEDADES · el registro de la red.
 *
 * ── RITMO DE LA PÁGINA (§36.11) ───────────────────────────────────────────
 * Tres bloques con estructura deliberadamente distinta:
 *
 * 1. APERTURA + PULSO — texto sobre el riel y una línea de datos. Responde en
 *    cinco segundos la única pregunta que trae aquí a un inversionista o a un
 *    periodista: ¿esta compañía se mueve?
 * 2. PORTADA — una entrada a ancho de contenedor con su material. Es el único
 *    elemento con peso editorial de la página.
 * 3. EL REGISTRO — bitácora densa y tipográfica, separada por años.
 *
 * Ninguna rejilla de tarjetas: ver la cabecera de `LogEntry`.
 *
 * ── EL PULSO NO ES UNA MÉTRICA INVENTADA ──────────────────────────────────
 * Se calcula del propio dataset —cuántas entradas hay y cuándo fue la última—
 * así que no entra en el cupo de placeholders de §33 ni promete nada que no
 * sea verificable en la misma página.
 */

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}

  return {
    title: t(novedades.meta.title, lang),
    description: t(novedades.meta.description, lang),
    alternates: alternatesFor(lang, routes.novedades),
  }
}

export default async function NovedadesPage({ params }: Props) {
  const { lang: raw } = await params
  if (!isLocale(raw)) notFound()
  const lang = raw as Locale

  const posts = await getPosts()
  const featured = await getFeaturedPost()
  /* La portada no se repite abajo: la misma entrada dos veces en una página
     no aporta y rompe la lectura cronológica del registro. */
  const rest = posts.filter((p) => p.slug !== featured?.slug)

  const pulseUnit = posts.length === 1 ? novedades.pulse.entriesOne : novedades.pulse.entries
  const hasProvisional = posts.some((p) => p.dataStatus === 'placeholder')

  return (
    <TrackView
      event="novedades_vista"
      threshold={0}
    >
      {/* 1 · APERTURA + PULSO */}
      <Section
        space="tight"
        className="pt-32 md:pt-40"
      >
        <Container width="narrow">
          <Eyebrow>{t(novedades.eyebrow, lang)}</Eyebrow>
          <h1 className="mt-4 font-display text-display-xl font-semibold text-balance text-ink">
            {t(novedades.title, lang)}
          </h1>
          <p className="mt-6 measure text-body-l text-ink-2">{t(novedades.intro, lang)}</p>
        </Container>

        {posts.length > 0 && (
          <Container className="mt-12">
            <Rule />
            <dl className="flex flex-wrap items-baseline gap-x-10 gap-y-3 pt-5 font-mono text-mono uppercase tracking-wider">
              <div className="flex items-baseline gap-2">
                <dt className="sr-only">{t(pulseUnit, lang)}</dt>
                <dd className="text-ink">
                  {posts.length} {t(pulseUnit, lang)}
                </dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="text-ink-3">{t(novedades.pulse.latest, lang)}</dt>
                <dd className="text-ink">{formatDate(posts[0].date, lang)}</dd>
              </div>
            </dl>

            {/* Se declara ANTES de leer, no al pie: el precedente del proyecto
                es `demoNotice`, que avisa antes de pedir los datos y no en
                letra pequeña después del botón. */}
            {hasProvisional && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <PendingTag>{t(novedades.provisionalTagAll, lang)}</PendingTag>
                <p className="measure text-body-s text-ink-3">
                  {t(novedades.provisionalNoteAll, lang)}
                </p>
              </div>
            )}
          </Container>
        )}
      </Section>

      {posts.length === 0 ? (
        <Section>
          <Container width="narrow">
            <SectionHeading
              as="h2"
              size="m"
            >
              {t(novedades.empty.title, lang)}
            </SectionHeading>
            <p className="mt-5 measure text-body-l text-ink-2">{t(novedades.empty.body, lang)}</p>
            <div className="mt-10">
              <Button
                variant="primary"
                arrow
                href={href(lang, routes.red)}
              >
                {t(novedades.empty.action, lang)}
              </Button>
            </div>
          </Container>
        </Section>
      ) : (
        <>
          {/* 2 · PORTADA */}
          {featured && (
            <Section space="tight">
              <Container>
                {featured.cover && (
                  <figure>
                    <Media
                      asset={featured.cover}
                      lang={lang}
                      aspect="21/9"
                      corner
                      sizes="(min-width: 1280px) 76rem, 100vw"
                      priority
                    />
                    {/* Rótulo derivado del asset y pie propio de la portada: el
                        índice comenta la pieza de otra forma que el detalle,
                        porque quien lee aquí todavía no ha entrado. */}
                    <figcaption className="mt-3 text-body-s text-ink-3">
                      {featured.cover.kind === 'video' && featured.cover.duration && (
                        <span className="mr-3 font-mono text-mono uppercase tracking-wider text-ink-2">
                          {t(novedades.mediaLabel.video, lang)} · {featured.cover.duration}
                        </span>
                      )}
                      {t(featured.coverCaption ?? featured.cover.alt, lang)}
                    </figcaption>
                  </figure>
                )}

                <div className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-[9rem_1fr]">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 md:flex-col md:gap-1">
                    <time
                      dateTime={featured.date}
                      className="font-mono text-mono uppercase tracking-wider text-ink-2"
                    >
                      {formatDate(featured.date, lang)}
                    </time>
                    <span className="font-mono text-mono uppercase tracking-wider text-ink-3">
                      {t(novedades.types[featured.type], lang)}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-display-m font-semibold text-balance text-ink">
                      {hasPage(featured) ? (
                        <Link
                          href={href(lang, routes.post(featured.slug))}
                          className="transition-colors hover:text-brand"
                        >
                          {t(featured.title, lang)}
                        </Link>
                      ) : (
                        t(featured.title, lang)
                      )}
                    </h2>
                    <p className="mt-4 measure text-body-l text-ink-2">
                      {t(featured.summary, lang)}
                    </p>
                    {/* Si la entrada es la apertura de una estación, el CTA
                        lleva A LA ESTACIÓN: es el destino que sirve para algo.
                        Si no, lleva a la entrada. El título enlaza siempre al
                        detalle, así que ninguna de las dos rutas se pierde. */}
                    {featured.stationSlug ? (
                      <div className="mt-6">
                        <Button
                          variant="secondary"
                          size="s"
                          arrow
                          href={href(lang, routes.station(featured.stationSlug))}
                        >
                          {t(novedades.knowStation, lang)}
                        </Button>
                      </div>
                    ) : hasPage(featured) ? (
                      <div className="mt-6">
                        <Button
                          variant="secondary"
                          size="s"
                          arrow
                          href={href(lang, routes.post(featured.slug))}
                        >
                          {t(novedades.readEntry, lang)}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Container>
            </Section>
          )}

          {/* 3 · EL REGISTRO */}
          {rest.length > 0 && (
            <Section
              space="tight"
              className="pb-24 md:pb-32"
            >
              <Container>
                <PostLog
                  posts={rest}
                  lang={lang}
                />
              </Container>
            </Section>
          )}
        </>
      )}
    </TrackView>
  )
}
