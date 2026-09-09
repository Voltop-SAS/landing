import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { formatDate } from '@ui/common/lib/dates'
import { novedades, novedadesInline } from '~/core/news/domain/consts/copy'
import { PostLink } from '@ui/common/components/ui/PostLink'
import { getLatestPosts } from '~/core/common/infrastructure/data-access'
import { Section, Container, SectionHeading } from '@ui/common/components/ui/LayoutPrimitives'
import { Button } from '@ui/common/components/ui/Button'
import { Reveal } from '@ui/common/components/ui/Reveal'

/**
 * BEAT 6 · NEWS — Intensity: Low · Register: Index
 * BEAT · LATEST FROM THE NETWORK
 *
 * ── WHY IT EXISTS ON THE HOME PAGE ────────────────────────────────────────
 * The menu entry serves whoever is ALREADY looking for news, which is a small
 * audience. This block puts it in front of whoever was not looking for it and
 * ought to see it: an investor who lands here and sees three recent, dated
 * facts has already answered their question —is this company moving?— without
 * a single click. Of the two entry points, this one does the heavy lifting.
 *
 * ── POSITION AND RHYTHM ───────────────────────────────────────────────────
 * It sits between the case study (a high-intensity beat, full-bleed with text
 * over it) and the vision quote. It is deliberately the LOWEST beat on the
 * curve: three dense rows and nothing else. It works as a breather before the
 * close, and its structure —a chronological log— matches neither of its two
 * neighbours.
 *
 * It does not repeat beat 3's dense index by being consecutive to it: it is
 * not.
 *
 * ── WHAT IT DOES NOT DO ───────────────────────────────────────────────────
 * It does not resolve here what the destination resolves. Three entries, with
 * no summary and no media: the home page presents, the inner pages go deep.
 * And with no entries it does not render, rather than leaving a headline over
 * a gap.
 */
export async function NetworkNews({ locale }: { locale: Locale }) {
  const posts = await getLatestPosts(3)
  if (posts.length === 0) return null

  return (
    <Section
      id="novedades"
      space="tight"
      className="border-t border-line"
      ariaLabelledby="novedades-home"
    >
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="novedades-home"
            size="m"
            kicker={t(novedadesInline.home.eyebrow, locale)}
            kickerTone="brand"
          >
            {t(novedadesInline.home.title, locale)}
          </SectionHeading>
          <div className="md:pb-1">
            <Button
              variant="link"
              arrow
              href={href(locale, routes.news)}
            >
              {t(novedadesInline.home.action, locale)}
            </Button>
          </div>
        </div>

        <ul className="mt-10 border-t border-line">
          {posts.map((post, i) => (
            <Reveal
              as="li"
              key={post.slug}
              index={i}
              className="border-b border-line"
            >
              <PostLink
                post={post}
                locale={locale}
                className="grid items-baseline gap-x-8 gap-y-2 py-6 md:grid-cols-[9rem_1fr_auto]"
              >
                <time
                  dateTime={post.date}
                  className="shrink-0 font-mono text-mono uppercase tracking-wider text-ink-3"
                >
                  {formatDate(post.date, locale)}
                </time>
                <span className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                  {t(post.title, locale)}
                </span>
                <span className="font-mono text-mono uppercase tracking-wider text-ink-3 md:justify-self-end">
                  {t(novedades.types[post.type], locale)}
                </span>
              </PostLink>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
