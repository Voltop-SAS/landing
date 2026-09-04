/** The news log. */

import { type Post } from '~/core/novedades/domain/entities/Post'
import { fetchPosts } from './postsSource'

/**
 * ── WHY THESE ACCESSORS ARE `async` AND THE REST ARE NOT ──────────────────
 * The log is the CMS pilot (see `postsSource.ts`). Its origin is going to be
 * remote; the one for stations and cities, for now, is not. Making ONLY the log
 * asynchronous is the correct asymmetry: it mirrors what is actually going to
 * change.
 *
 * It is done NOW and not on migration day because it is the one change that
 * would force touching every page that consumes the log. Done today,
 * connecting the CMS is changing the body of one function.
 */

/**
 * The log, always in reverse chronological order and published entries only.
 * No view sorts on its own: if the order were decided in each component, two
 * surfaces would end up showing the same log differently.
 */
export async function getPosts(): Promise<Post[]> {
  const all = await fetchPosts()
  return all.filter((p) => p.status === 'publicado').sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug)
}

/**
 * Entries that have their own page. See the header of the news content file: an
 * empty `body` means the entry lives only in the index, so it generates no
 * route, stays out of the sitemap and is linked from nowhere.
 *
 * It is a PURE PREDICATE over an already-loaded entry, so it stays synchronous:
 * it does not query the origin and components use it during render.
 */
export function hasPage(post: Post): boolean {
  return post.body.length > 0
}

export async function getPostsWithPage(): Promise<Post[]> {
  return (await getPosts()).filter(hasPage)
}

/**
 * The log's lead entry.
 *
 * It prefers the most recent one that HAS A COVER with delivered material. That
 * is not a whim of ordering: the cover is a 21/9 band at the very top of the
 * page, and with no real file it becomes the largest grey rectangle on the
 * site. `featured: true` used to be enough, and that put the EAN entry there,
 * whose photo has not been delivered yet.
 *
 * If none has material, it falls back to the flagged one and then to the most
 * recent: the log still works, just without an image.
 */
export async function getFeaturedPost(): Promise<Post | undefined> {
  const list = await getPosts()
  return (
    list.find((p) => p.featured && p.cover?.src) ??
    list.find((p) => p.cover?.src) ??
    list.find((p) => p.featured) ??
    list[0]
  )
}

export async function getLatestPosts(limit: number): Promise<Post[]> {
  return (await getPosts()).slice(0, limit)
}

/**
 * Contextual re-surfacing. This is what keeps the log from being a drawer off
 * to one side: an opening shows up on its own station's page and on its city's
 * page, without anyone placing it by hand in three places.
 */
export async function getPostsForStation(stationSlug: string): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.stationSlug === stationSlug)
}

export async function getPostsForCity(citySlug: string): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.citySlug === citySlug)
}

/** Date of the most recent entry. Feeds the index's `lastModified`. */
export async function getLatestPostDate(): Promise<string | undefined> {
  return (await getPosts())[0]?.date
}
