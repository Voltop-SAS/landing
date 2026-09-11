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
import { novedades } from '~/core/news/domain/consts/copy'
import { a11y, brand } from '~/core/common/domain/consts/copy'
import {
  getPostsWithPage,
  getPost,
  getStation,
  getCity,
} from '~/core/common/infrastructure/data-access'
import { shareImage } from '~/core/news/infrastructure/helpers/shareImage'
import { Section, Container, Rule } from '@ui/common/components/ui/LayoutPrimitives'
import { Media } from '@ui/common/components/ui/Media'
import { Button } from '@ui/common/components/ui/Button'
import { PendingTag } from '@ui/common/components/ui/DataPrimitives'
import { PostBody } from '~/core/news/infrastructure/ui/components/PostBody'
import { formatDate } from '@ui/common/lib/dates'

type Props = { params: Promise<{ locale: string; slug: string }> }

/**
 * /NOVEDADES/[SLUG] · one entry from the log.
 *
 * IT ONLY EXISTS FOR ENTRIES WITH A BODY. `getPostsWithPage()` filters out
 * those with an empty `body`, so a two-line opening does not generate a thin
 * page repeating the index's text — nor compete with it in search. See the
 * header of the news content file.
 *
 * The footer returns to the product: the station or the city the entry talks
 * about. That is where the model's reference pays off, and where a reader who
 * arrived from the press or from a search enters the network instead of
 * leaving.
 */

export const dynamicParams = false

export async function generateStaticParams() {
  const withPage = await getPostsWithPage()
  return locales.flatMap((locale) => withPage.map((p) => ({ locale, slug: p.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const post = await getPost(slug)
  if (!post) return {}

  return {
    title: t(post.title, locale),
    description: t(post.summary, locale),
    alternates: alternatesFor(locale, routes.post(post.slug)),
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      title: t(post.title, locale),
      description: t(post.summary, locale),
      url: absoluteUrl(locale, routes.post(post.slug)),
      images: [shareImage(post, locale)],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const post = await getPost(slug)
  if (!post) notFound()

  const station = post.stationSlug ? getStation(post.stationSlug) : undefined
  const city = post.citySlug ? getCity(post.citySlug) : undefined

  /**
   * Article structured data (§29).
   *
   * `image` goes through `shareImage`: it is always a real image — never the
   * `.mp4` of a video cover — and it always exists, so the promise made to the
   * search engine is one the page keeps.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: t(post.title, locale),
    description: t(post.summary, locale),
    datePublished: post.date,
    inLanguage: localeMeta[locale].hreflang,
    url: absoluteUrl(locale, routes.post(post.slug)),
    author: { '@type': 'Organization', name: brand.name, url: SITE_URL },
    publisher: { '@type': 'Organization', name: brand.name, url: SITE_URL },
    image: shareImage(post, locale),
  }

  /* The same `BreadcrumbList` the station pages already carry (§29). The
     VISUAL breadcrumb was right below and the hierarchy was not stated for the
     search engine, so the two deep route types were saying different things
     about themselves. Same order as the markup so they cannot diverge. */
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t(novedades.eyebrow, locale),
        item: absoluteUrl(locale, routes.news),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t(post.title, locale),
        item: absoluteUrl(locale, routes.post(post.slug)),
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

      {/* `<article>`: this page is one self-contained piece — headline, date,
        body and author — which is exactly what the element is for, and the
        `NewsArticle` above says as much to a search engine while the markup
        did not. It wraps both sections so the opening and the body are one
        document and not two loose blocks. */}
      <article>
        <Section
          space="none"
          className="pb-8 pt-32 md:pt-40"
        >
          <Container width="narrow">
            <nav
              aria-label={t(a11y.breadcrumb, locale)}
              className="font-mono text-mono text-ink-3"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href={href(locale, routes.news)}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
                  >
                    {t(novedades.eyebrow, locale)}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                {/* Plural: here the type names the CATEGORY, not this entry. See
                the `typesPlural` note in the copy. */}
                <li className="text-ink-2">{t(novedades.typesPlural[post.type], locale)}</li>
              </ol>
            </nav>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <time
                dateTime={post.date}
                className="font-mono text-mono uppercase tracking-wider text-ink-2"
              >
                {formatDate(post.date, locale)}
              </time>
              {post.dataStatus === 'placeholder' && (
                <PendingTag>{t(novedades.provisionalTag, locale)}</PendingTag>
              )}
            </div>

            <h1 className="mt-5 font-display text-display-xl font-semibold text-balance text-ink">
              {t(post.title, locale)}
            </h1>
            <p className="mt-6 measure text-body-l text-ink-2">{t(post.summary, locale)}</p>

            {post.dataStatus === 'placeholder' && (
              <p className="mt-4 measure text-body-s text-ink-3">
                {t(novedades.provisionalNote, locale)}
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
              /* `controls` when the cover is a VIDEO. Without it, `VideoMedia`
             treats it as background material: muted, looping and with no
             bar — so the Wake piece played with no audio and no way to turn
             it on. A video that is the subject of the entry is something you
             decide to watch, and for that you need to be able to play it,
             seek and hear it.
             A photographic cover is unaffected: the prop does not apply to it. */
              <Media
                asset={post.cover}
                locale={locale}
                aspect="16/9"
                corner
                controls={post.cover.kind === 'video'}
                sizes="(min-width: 768px) 46rem, 100vw"
                priority
              />
            )}

            <PostBody
              blocks={post.body}
              locale={locale}
            />

            {/* Back to the product: the entry ends in the network, not in a dead end. */}
            {(station || city) && (
              <>
                <Rule className="mt-16" />
                <div className="mt-8 flex flex-col gap-6">
                  {station && (
                    <div>
                      <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
                        {t(novedades.related.station, locale)}
                      </p>
                      <div className="mt-3">
                        <Button
                          variant="secondary"
                          size="s"
                          arrow
                          href={href(locale, routes.station(station.slug))}
                        >
                          {t(novedades.related.stationCta, locale)}
                        </Button>
                      </div>
                    </div>
                  )}
                  {city && (
                    <Link
                      href={href(locale, routes.city(city.slug))}
                      className="inline-flex min-h-11 items-center self-start text-body-s text-ink-2 transition-colors hover:text-ink"
                    >
                      {t(novedades.related.city, locale)} {city.name} →
                    </Link>
                  )}
                </div>
              </>
            )}

            <div className="mt-14">
              <Link
                href={href(locale, routes.news)}
                className="inline-flex min-h-11 items-center font-mono text-mono uppercase tracking-wider text-ink-3 transition-colors hover:text-ink"
              >
                ← {t(novedades.backToIndex, locale)}
              </Link>
            </div>
          </Container>
        </Section>
      </article>
    </>
  )
}
