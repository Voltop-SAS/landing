import type { StationSort } from '~/core/common/infrastructure/data-access'

/**
 * THE SEARCH CRITERIA OF /red, AND THEIR URL.
 *
 * They live in their own module and not inside `StationFinder` because they
 * are not the component's internals: the query string is a CONTRACT. Those
 * keys travel in links people share and in URLs search engines index, and
 * their Spanish spelling is deliberate for that reason (see AGENTS.md). A
 * contract that can only be exercised by mounting a 700-line client island is
 * a contract nobody tests.
 *
 * Reading and writing are kept together, and both are pure: `readCriteria`
 * takes the query string rather than reaching for `window`, and the writer
 * returns the new query string rather than pushing it. The component is what
 * touches the address bar.
 */

/**
 * Short, stable URL keys: they are part of the link people share. The Spanish
 * values are a contract, not a leftover — they appear in indexable URLs.
 */
export const PARAM = {
  q: 'q',
  city: 'ciudad',
  connector: 'conector',
  power: 'kw',
  live: 'live',
  sort: 'orden',
}

/**
 * The entire search criteria in ONE object.
 *
 * These used to be six separate `useState` calls, which forced six `setState`
 * calls to hydrate from the URL and six dependencies listed in every
 * `useMemo`. With a single object, reading the URL is one assignment and the
 * synchronising effect has a single dependency.
 */
export type Criteria = {
  query: string
  city: string
  connector: string
  minPower: number
  onlyLive: boolean
  sort: StationSort
}

export const EMPTY_CRITERIA: Criteria = {
  query: '',
  city: '',
  connector: '',
  minPower: 0,
  onlyLive: false,
  sort: 'relevance',
}

/** The sort orders a link may carry. `distance` is not one of them. */
const LINKABLE_SORTS = ['power', 'status', 'city'] as const

/**
 * URL → criteria.
 *
 * EVERY value is validated against what the dataset can actually represent,
 * and the four of them for the same reason: these keys are a documented
 * contract, so whatever arrives in them comes from outside — a link saved a
 * year ago, a city that was renamed, someone editing the address bar. An
 * unknown value is IGNORED rather than applied, which is what the controls can
 * actually show: "Todas".
 *
 * `?ciudad=` with a slug that no longer exists used to produce zero results
 * AND no chip selected, so whoever opened the link saw an empty list with
 * nothing marked and no explanation.
 *
 * The component applies this AFTER mounting, not in the `useState`
 * initialiser: the route is static, so the HTML is generated with no query
 * string and reading the URL on the first render would be a hydration
 * mismatch. The price is one frame showing the full list before the shared
 * link is applied; the benefit is not turning the route dynamic.
 *
 * ACCEPTED LIMITATION: a filtered link is SHAREABLE but not indexable — the
 * served HTML always carries the full list. Indexable coverage by city is
 * already provided by the `/red/[city]` routes, which was the original SEO
 * reason.
 */
export function readCriteria(
  search: string,
  known: { steps: number[]; citySlugs: string[]; connectors: string[] },
): Criteria {
  const p = new URLSearchParams(search)
  const kw = Number(p.get(PARAM.power))
  const sort = p.get(PARAM.sort)
  const city = p.get(PARAM.city) ?? ''
  const connector = p.get(PARAM.connector) ?? ''
  return {
    query: p.get(PARAM.q) ?? '',
    city: known.citySlugs.includes(city) ? city : '',
    connector: known.connectors.includes(connector) ? connector : '',
    minPower: known.steps.includes(kw) ? kw : 0,
    onlyLive: p.get(PARAM.live) === '1',
    /* `distance` is not restored from the URL: it requires location
       permission, and a link cannot grant that. */
    sort: LINKABLE_SORTS.includes(sort as never) ? (sort as StationSort) : 'relevance',
  }
}

/**
 * Criteria → query string, `?`-prefixed, or empty when nothing is filtered.
 *
 * A default is never written out: the shared link carries what was chosen and
 * nothing else, so it stays readable and does not pin down values the site may
 * change later.
 */
export function criteriaToQuery(c: Criteria): string {
  const p = new URLSearchParams()
  if (c.query) p.set(PARAM.q, c.query)
  if (c.city) p.set(PARAM.city, c.city)
  if (c.connector) p.set(PARAM.connector, c.connector)
  if (c.minPower) p.set(PARAM.power, String(c.minPower))
  if (c.onlyLive) p.set(PARAM.live, '1')
  /* `distance` is not written: it depends on a permission a link cannot grant. */
  if (c.sort !== 'relevance' && c.sort !== 'distance') p.set(PARAM.sort, c.sort)
  const qs = p.toString()
  return qs ? `?${qs}` : ''
}
