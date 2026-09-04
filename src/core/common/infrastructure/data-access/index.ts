/**
 * DATA ACCESS LAYER
 * See docs/MASTER-PROJECT-DEFINITION.md §26.
 *
 * Components NEVER import content directly: they always come through here.
 * That is what allows the origin to change (CMS, API, database) without
 * touching a single line of presentation.
 *
 * Today the origin is local modules and the functions are synchronous — except
 * the news log, which is already asynchronous because its origin is going to be
 * remote.
 *
 * ── WHY ONE BOUNDARY AND NOT ONE PER MODULE ───────────────────────────────
 * The standard asks for `data-access` inside each module. That does not work
 * here: of the 27 accessors, eight are consumed by `home`, which owns none of
 * that data — the network summary and the cities belong to the network module,
 * the segments and the featured case to business, the founder to about, the
 * latest entries to news. Splitting by module would leave `home` importing the
 * infrastructure of four others, which is the very code smell the standard
 * lists. Its suggested way out — "use domain types" — does not apply, because
 * what `home` needs are the functions, not the types.
 *
 * So there is one boundary and it lives in `common`, split by subject so that
 * no single file becomes a junk drawer.
 */

export { getFaq } from './faq'
export {
  getStations,
  getStation,
  getStationsByCity,
  filterStations,
  hasCoordinates,
  distanceKm,
  sortStations,
  type StationFilters,
  type StationSort,
} from './stations'
export { getCities, getCity } from './cities'
export { getNetworkSummary, getCitiesWithStations } from './network'
export {
  getMetrics,
  getBusinessSegments,
  getFeaturedCase,
  getPartners,
  getTestimonials,
  getFounder,
} from './company'
export {
  getPosts,
  getPost,
  hasPage,
  getPostsWithPage,
  getFeaturedPost,
  getLatestPosts,
  getPostsForStation,
  getPostsForCity,
  getLatestPostDate,
} from './posts'

export type { Station } from '~/core/network/domain/entities/Station'
export type { City } from '~/core/network/domain/entities/City'
export type { Metric } from '~/core/common/domain/entities/Metric'
export type { Case } from '~/core/business/domain/entities/Case'
export type { Post, PostType } from '~/core/news/domain/entities/Post'
