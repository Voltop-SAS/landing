import Link from 'next/link'
import { t, type Locale, type Localized } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { formatDate } from '@ui/common/lib/dates'
import { novedades } from '~/core/news/domain/consts/copy'
import { Section, Container, SectionHeading } from '@ui/common/components/ui/LayoutPrimitives'
import { PostLink } from '@ui/common/components/ui/PostLink'
import type { Post } from '~/core/common/infrastructure/data-access'

/**
 * RE-SURFACING THE LOG ON ANOTHER DESTINATION.
 *
 * This is the piece that stops the news section from being a separate drawer:
 * an opening with a `stationSlug` shows up on its own on that station's page
 * and on its city's page, without anyone placing it by hand in three places.
 * It reuses the reference system that already connects station → city.
 *
 * With no entries it RENDERS NOTHING —no empty headline, no "coming soon"—
 * the same way the partner strip is omitted while there are no logos cleared
 * for use (§33). An empty block does not inform: it takes up room.
 *
 * Deliberately different in structure from the main log: here it is a compact
 * two-line list, not the logbook with year separators. Two neighbouring
 * surfaces do not repeat structure (§36.11).
 */
export function PostsInline({
  posts,
  locale,
  title,
}: {
  posts: Post[]
  locale: Locale
  title: Localized
}) {
  if (posts.length === 0) return null

  return (
    <Section space="tight">
      <Container>
        <SectionHeading
          size="s"
          as="h2"
        >
          {t(title, locale)}
        </SectionHeading>

        <ul className="mt-8 border-t border-line">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="border-b border-line"
            >
              <PostLink
                post={post}
                locale={locale}
                className="flex min-h-14 flex-col justify-center gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <time
                  dateTime={post.date}
                  className="shrink-0 font-mono text-mono uppercase tracking-wider text-ink-3"
                >
                  {formatDate(post.date, locale)}
                </time>
                <span className="text-body-s text-ink-2 transition-colors group-hover:text-ink">
                  {t(post.title, locale)}
                </span>
              </PostLink>
            </li>
          ))}
        </ul>

        <Link
          href={href(locale, routes.news)}
          className="mt-6 inline-flex min-h-11 items-center font-mono text-mono uppercase tracking-wider text-ink-3 transition-colors hover:text-ink"
        >
          {t(novedades.eyebrow, locale)} →
        </Link>
      </Container>
    </Section>
  )
}
