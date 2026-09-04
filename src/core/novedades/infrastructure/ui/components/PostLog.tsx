import { Fragment } from 'react'
import { type Locale } from '~/core/common/domain/i18n/config'
import { yearOf } from '@ui/common/lib/dates'
import { LogEntry } from '~/core/novedades/infrastructure/ui/components/LogEntry'
import type { Post } from '~/core/common/infrastructure/data-access'

/**
 * THE LOG · chronological list with year separators.
 *
 * The year is not decoration: it is what turns a list into a logbook and what
 * makes the company's real rhythm visible at a glance —how many things
 * happened and when— which is exactly the question that brings an investor
 * here.
 *
 * Server Component. There is no filter by type, and that is a decision, not an
 * omission: at the current volume, filtering would leave one or two entries
 * per category, and a control that narrows nothing useful is a decorative
 * control (§12). Once the log passes ~15 entries the filter earns its place;
 * until then the type is readable on every row and that is enough.
 *
 * The year is grouped BEFORE rendering, rather than accumulating a variable
 * inside the `map`: that way the markup does not depend on evaluation order
 * and the separator can be a sibling of the rows instead of nesting inside
 * one.
 */
export function PostLog({ posts, locale }: { posts: Post[]; locale: Locale }) {
  const groups = posts.reduce<{ year: string; entries: Post[] }[]>((acc, post) => {
    const year = yearOf(post.date)
    const last = acc[acc.length - 1]
    if (last?.year === year) last.entries.push(post)
    else acc.push({ year, entries: [post] })
    return acc
  }, [])

  /**
   * With a single year, the separator separates nothing: it is a label that
   * does not inform, and §12 does not allow decorative controls or markers. It
   * appears when there is more than one year to tell apart — activated by the
   * data, like the sort-by-distance option on /red, which is only offered if
   * some station carries coordinates.
   */
  const showYears = groups.length > 1

  return (
    <ul className="border-b border-line">
      {groups.map((group) => (
        <Fragment key={group.year}>
          {/* Hidden from screen readers: every entry already announces its
              full date, so the separator is VISUAL redundancy. Repeating it in
              audio only adds noise between one entry and the next. */}
          {showYears && (
            <li
              aria-hidden="true"
              className="border-t border-line-strong pb-1 pt-7"
            >
              <span className="font-mono text-mono uppercase tracking-wider text-ink-3">
                {group.year}
              </span>
            </li>
          )}
          {group.entries.map((post) => (
            <LogEntry
              key={post.slug}
              post={post}
              locale={locale}
            />
          ))}
        </Fragment>
      ))}
    </ul>
  )
}
