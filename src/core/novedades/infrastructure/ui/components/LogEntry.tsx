import { t, type Locale } from '~/core/common/domain/i18n/config'
import { formatDate } from '@ui/common/lib/dates'
import { novedades } from '~/core/novedades/domain/consts/copy'
import { PostLink } from '@ui/common/components/ui/PostLink'
import type { Post } from '~/core/common/infrastructure/data-access'
import { hasPage } from '~/core/common/infrastructure/data-access'
import { cn } from '@ui/common/lib/cn'

/**
 * ONE ROW OF THE LOG.
 *
 * ── WHY IT IS NOT A CARD ──────────────────────────────────────────────────
 * §12 forbids an excess of cards and predictable layouts, and a grid of cards
 * with a photo, a headline and "Read more" is the most generic pattern there
 * is: it would not pass the anonymity test. Voltop is infrastructure, and the
 * native form for communicating infrastructure is the LOGBOOK of what has
 * been built.
 *
 * So it is an index row: date in mono on the left, content on the right,
 * separated from the next one by a hairline. The same "spec sheet" language
 * the station specs already use.
 *
 * ── THE ROW IS A LINK ONLY IF THERE IS SOMEWHERE TO GO ────────────────────
 * An opening is two lines: they are read here and there is no page to open.
 * That decision is made by `PostLink`, shared with the other two lists; here
 * we only consult `hasPage` to decide what gets RENDERED —the title hover and
 * the "read entry" affordance— which is a different thing.
 */
export function LogEntry({ post, locale }: { post: Post; locale: Locale }) {
  const linked = hasPage(post)

  const content = (
    <>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 md:flex-col md:gap-1">
        <time
          dateTime={post.date}
          className="font-mono text-mono uppercase tracking-wider text-ink-2"
        >
          {formatDate(post.date, locale)}
        </time>
        <span className="font-mono text-mono uppercase tracking-wider text-ink-3">
          {t(novedades.types[post.type], locale)}
        </span>
      </div>

      <div>
        <h3
          className={cn(
            'font-display text-display-s font-semibold text-balance text-ink',
            /* The hover response lives here and not on the whole row: the
               title is what you are choosing to read (§36.12, energy is a
               response, not ambience). */
            linked && 'transition-colors group-hover:text-brand',
          )}
        >
          {t(post.title, locale)}
        </h3>

        <p className="mt-2 measure text-body-s text-ink-2">{t(post.summary, locale)}</p>

        {/* The provisional marker does NOT go here: it is declared once for
            the whole log (see `provisionalTag` in the copy). Repeated per row
            it was amber texture, not a warning. */}
        {linked && (
          <span className="mt-4 inline-flex font-mono text-mono uppercase tracking-wider text-ink-3 transition-colors group-hover:text-ink">
            {t(novedades.readEntry, locale)} →
          </span>
        )}
      </div>
    </>
  )

  return (
    <li className="border-t border-line">
      <PostLink
        post={post}
        locale={locale}
        className="grid gap-x-10 gap-y-3 py-8 md:grid-cols-[9rem_1fr] md:py-10"
      >
        {content}
      </PostLink>
    </li>
  )
}
