import Link from 'next/link'
import { type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { hasPage } from '~/core/common/infrastructure/data-access'
import type { Post } from '~/core/common/infrastructure/data-access'
import { cn } from '@ui/common/lib/cn'

/**
 * POST WRAPPER · links only if there is somewhere to go.
 *
 * §15: a link without a real destination is not published. An opening is two
 * lines that are read in the row itself; linking it to a page with the same
 * text would be a link that leads to nothing new.
 *
 * The rule was applied in THREE places — the log, the compact list on station
 * pages and the Home page beat — each with its own copy of the ternary and of
 * the `group` class. Three copies of a rule are three places where it can
 * diverge: it only takes someone adding a condition in one and not the others
 * for the same post to link on one surface and not on its neighbour.
 *
 * What it does NOT unify is the appearance. The three lists are deliberately
 * different — §36.11: two neighbouring surfaces do not repeat structure — and
 * that is why each still brings its own grid in `className`. All that lives
 * here is the decision of whether this is a link or not.
 *
 * `group` is added only on the linked branch: the children's `group-hover`
 * should not respond when there is nothing to open. The same goes for `press`:
 * a row that leads nowhere should not acknowledge the tap.
 *
 * ── `decorative` ─────────────────────────────────────────────────────────
 * For a SECOND link to the same entry sitting next to the real one — the cover
 * of the lead entry, whose headline already links to the same place.
 *
 * The mouse expects a large piece of media to be clickable, so it is. But for a
 * keyboard and for a screen reader it would be a duplicate: the same
 * destination announced twice, and one extra tab stop with no name of its own.
 * `decorative` removes it from both — `tabIndex={-1}` and `aria-hidden` — and
 * leaves the headline as the one accessible link.
 *
 * It does NOT stop being a link: it is still an `<a>` with a real `href`, so
 * middle click, "open in a new tab" and the crawler keep working.
 */
export function PostLink({
  post,
  locale,
  className,
  decorative,
  children,
}: {
  post: Post
  locale: Locale
  className?: string
  /** A duplicate of a link that already exists next to it. See above. */
  decorative?: boolean
  children: React.ReactNode
}) {
  if (!hasPage(post)) return <div className={className}>{children}</div>

  return (
    <Link
      href={href(locale, routes.post(post.slug))}
      className={cn('group press', className)}
      {...(decorative ? { tabIndex: -1, 'aria-hidden': true } : {})}
    >
      {children}
    </Link>
  )
}
