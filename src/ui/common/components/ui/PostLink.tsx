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
 */
export function PostLink({
  post,
  locale,
  className,
  children,
}: {
  post: Post
  locale: Locale
  className?: string
  children: React.ReactNode
}) {
  if (!hasPage(post)) return <div className={className}>{children}</div>

  return (
    <Link
      href={href(locale, routes.post(post.slug))}
      className={cn('group press', className)}
    >
      {children}
    </Link>
  )
}
