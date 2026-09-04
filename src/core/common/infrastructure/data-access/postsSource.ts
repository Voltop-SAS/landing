import { posts } from '~/core/novedades/infrastructure/content/posts'
import type { Post } from '~/core/novedades/domain/entities/Post'

/**
 * THE LOG'S ORIGIN · the only point that changes when a CMS is connected.
 *
 * ── WHY THIS FILE EXISTS ──────────────────────────────────────────────────
 * §38 states the project's hard constraint: the owning team is NOT a
 * development team. Today, publishing a news entry means editing a code file,
 * committing and deploying. For stations — which change a handful of times a
 * year — that is bearable. For a log with a weekly cadence it is not, and the
 * section would die of operational friction rather than of a lack of content.
 *
 * ── WHY THE LOG AND NOT EVERYTHING ────────────────────────────────────────
 * This is the deliberate pilot from §2: connect ONE collection to a CMS and
 * leave the rest as local data. Low risk, reversible, and it produces the real
 * assessment of cost, fidelity and autonomy that §2 asked for — with data
 * instead of estimates. If it works, the rest migrates; if it does not, it is
 * dropped having lost one collection and not the project.
 *
 * ── WHAT TO REPLACE AND WHAT NOT TO ───────────────────────────────────────
 * Replace the BODY of `fetchPosts`. Nothing else.
 *
 * Everything layered above it — chronological order, the published filter,
 * resolving station and city references, which entries have a page — lives in
 * `~/core/common/infrastructure/data-access` and does NOT depend on the origin.
 * A CMS returning records shaped like `Post` slots in without touching a line
 * of presentation.
 *
 * The signature is already `async` even though it does no I/O today: that is
 * what stops connecting the CMS from forcing a rewrite of every page that
 * consumes the log.
 */
export async function fetchPosts(): Promise<Post[]> {
  return posts
}
