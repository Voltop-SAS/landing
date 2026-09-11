import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locales, isLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes, alternatesFor } from '~/core/common/domain/i18n/routes'
import { novedades } from '~/core/news/domain/consts/copy'
import { getPosts, getFeaturedPost, hasPage } from '~/core/common/infrastructure/data-access'
import {
  Section,
  Container,
  Eyebrow,
  SectionHeading,
  Rule,
} from '@ui/common/components/ui/LayoutPrimitives'
import { Media } from '@ui/common/components/ui/Media'
import { Button } from '@ui/common/components/ui/Button'
import { PendingTag } from '@ui/common/components/ui/DataPrimitives'
import { PostLog } from '~/core/news/infrastructure/ui/components/PostLog'
import { PostLink } from '@ui/common/components/ui/PostLink'
import { formatDate } from '@ui/common/lib/dates'

type Props = { params: Promise<{ locale: string }> }

/**
 * /NOVEDADES · the network's log.
 *
 * ── THE PAGE'S RHYTHM (§36.11) ────────────────────────────────────────────
 * Three blocks with deliberately different structures:
 *
 * 1. OPENING + PULSE — text on the rail and one line of figures. In five
 *    seconds it answers the only question that brings an investor or a
 *    journalist here: is this company moving?
 * 2. LEAD ENTRY — one entry at container width with its material. It is the
 *    only element on the page with editorial weight.
 * 3. THE LOG — a dense, typographic logbook, separated by year.
 *
 * No card grid anywhere: see the header of `LogEntry`.
 *
 * ── THE PULSE IS NOT AN INVENTED METRIC ───────────────────────────────────
 * It is computed from the dataset itself — how many entries there are and when
 * the last one was — so it does not count against §33's placeholder budget and
 * promises nothing that cannot be verified on the same page.
 */

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  return {
    title: t(novedades.meta.title, locale),
    description: t(novedades.meta.description, locale),
    alternates: alternatesFor(locale, routes.news),
  }
}

export default async function NovedadesPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const posts = await getPosts()
  const featured = await getFeaturedPost()
  /* The lead entry is not repeated below: the same entry twice on one page
     adds nothing and breaks the log's chronological reading. */
  const rest = posts.filter((p) => p.slug !== featured?.slug)

  const pulseUnit = posts.length === 1 ? novedades.pulse.entriesOne : novedades.pulse.entries
  const hasProvisional = posts.some((p) => p.dataStatus === 'placeholder')

  return (
    <>
      {/* 1 · APERTURA + PULSO */}
      <Section
        space="tight"
        className="pt-32 md:pt-40"
      >
        <Container width="narrow">
          <Eyebrow>{t(novedades.eyebrow, locale)}</Eyebrow>
          <h1 className="mt-4 font-display text-display-xl font-semibold text-balance text-ink">
            {t(novedades.title, locale)}
          </h1>
          <p className="mt-6 measure text-body-l text-ink-2">{t(novedades.intro, locale)}</p>
        </Container>

        {posts.length > 0 && (
          <Container className="mt-12">
            <Rule />
            <dl className="flex flex-wrap items-baseline gap-x-10 gap-y-3 pt-5 font-mono text-mono uppercase tracking-wider">
              <div className="flex items-baseline gap-2">
                <dt className="sr-only">{t(pulseUnit, locale)}</dt>
                <dd className="text-ink">
                  {posts.length} {t(pulseUnit, locale)}
                </dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="text-ink-3">{t(novedades.pulse.latest, locale)}</dt>
                <dd className="text-ink">{formatDate(posts[0].date, locale)}</dd>
              </div>
            </dl>

            {/* Declared BEFORE reading, not in a footnote. The precedent used
              to be the lead form's `demoNotice`, which warned before asking
              for the data rather than in small print under the button; that
              notice went away with the form's demo state, but the rule it
              established is the one applied here. */}
            {hasProvisional && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <PendingTag>{t(novedades.provisionalTagAll, locale)}</PendingTag>
                <p className="measure text-body-s text-ink-3">
                  {t(novedades.provisionalNoteAll, locale)}
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
              {t(novedades.empty.title, locale)}
            </SectionHeading>
            <p className="mt-5 measure text-body-l text-ink-2">{t(novedades.empty.body, locale)}</p>
            <div className="mt-10">
              <Button
                variant="primary"
                arrow
                href={href(locale, routes.network)}
              >
                {t(novedades.empty.action, locale)}
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
                    {/* The cover OPENS the entry. It is what anyone seeing a
                      piece this size expects, and in the video's case it is
                      also the only way to reach playback with sound: here it
                      runs silent on purpose — the browser blocks autoplay with
                      audio, and without controls it would break WCAG 1.4.2 —
                      while inside the entry it has controls.

                      `decorative` because the headline below already links to
                      the same place: the mouse gains the large target, the
                      keyboard and the screen reader do not gain a duplicate. */}
                    <PostLink
                      post={featured}
                      locale={locale}
                      decorative
                      className="block"
                    >
                      <Media
                        asset={featured.cover}
                        locale={locale}
                        aspect="21/9"
                        corner
                        sizes="(min-width: 1280px) 76rem, 100vw"
                        priority
                      />
                    </PostLink>
                    {/* A label derived from the asset and a caption of the lead
                      entry's own: the index comments on the piece differently
                      than the detail page, because whoever reads here has not
                      gone in yet. */}
                    <figcaption className="mt-3 text-body-s text-ink-3">
                      {featured.cover.kind === 'video' && featured.cover.duration && (
                        <span className="mr-3 font-mono text-mono uppercase tracking-wider text-ink-2">
                          {t(novedades.mediaLabel.video, locale)} · {featured.cover.duration}
                        </span>
                      )}
                      {t(featured.coverCaption ?? featured.cover.alt, locale)}
                    </figcaption>
                  </figure>
                )}

                <div className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-[9rem_1fr]">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 md:flex-col md:gap-1">
                    <time
                      dateTime={featured.date}
                      className="font-mono text-mono uppercase tracking-wider text-ink-2"
                    >
                      {formatDate(featured.date, locale)}
                    </time>
                    <span className="font-mono text-mono uppercase tracking-wider text-ink-3">
                      {t(novedades.types[featured.type], locale)}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-display-m font-semibold text-balance text-ink">
                      {hasPage(featured) ? (
                        <Link
                          href={href(locale, routes.post(featured.slug))}
                          className="transition-colors hover:text-brand"
                        >
                          {t(featured.title, locale)}
                        </Link>
                      ) : (
                        t(featured.title, locale)
                      )}
                    </h2>
                    <p className="mt-4 measure text-body-l text-ink-2">
                      {t(featured.summary, locale)}
                    </p>
                    {/* If the entry is a station's opening, the CTA goes TO THE
                      STATION: that is the destination that is good for
                      something. Otherwise it goes to the entry. The title
                      always links to the detail page, so neither route is
                      lost. */}
                    {featured.stationSlug ? (
                      <div className="mt-6">
                        <Button
                          variant="secondary"
                          size="s"
                          arrow
                          href={href(locale, routes.station(featured.stationSlug))}
                        >
                          {t(novedades.knowStation, locale)}
                        </Button>
                      </div>
                    ) : hasPage(featured) ? (
                      <div className="mt-6">
                        <Button
                          variant="secondary"
                          size="s"
                          arrow
                          href={href(locale, routes.post(featured.slug))}
                        >
                          {t(novedades.readEntry, locale)}
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
                  locale={locale}
                />
              </Container>
            </Section>
          )}
        </>
      )}
    </>
  )
}
