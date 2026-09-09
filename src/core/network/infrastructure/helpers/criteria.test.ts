import { describe, expect, it } from 'vitest'
import { readCriteria, criteriaToQuery, EMPTY_CRITERIA, type Criteria } from './criteria'

/**
 * The query string of /red is a CONTRACT: those keys travel in links people
 * share and in URLs search engines index. That is why they are tested here and
 * not through the component — a contract only exercisable by mounting a client
 * island is a contract nobody exercises.
 */
const known = {
  steps: [0, 22, 80],
  citySlugs: ['bogota', 'medellin'],
  connectors: ['CCS2', 'Type2'],
}

describe('readCriteria', () => {
  it('restores every criterion a link can carry', () => {
    expect(
      readCriteria('?q=hyatt&ciudad=bogota&conector=CCS2&kw=80&live=1&orden=power', known),
    ).toEqual({
      query: 'hyatt',
      city: 'bogota',
      connector: 'CCS2',
      minPower: 80,
      onlyLive: true,
      sort: 'power',
    })
  })

  it('reads an empty query string as no criteria at all', () => {
    expect(readCriteria('', known)).toEqual(EMPTY_CRITERIA)
  })

  /**
   * THE DEFECT THIS PROTECTS. A slug that no longer exists — a city renamed, a
   * link saved a year ago — used to be applied as-is: zero results AND no chip
   * selected, so whoever opened the link saw an empty list with nothing marked
   * and no explanation. Ignoring it is what the controls can actually show:
   * "Todas".
   */
  it('ignores a city that is not in the dataset instead of filtering by it', () => {
    expect(readCriteria('?ciudad=cali', known).city).toBe('')
  })

  it('ignores a connector that is not in the dataset', () => {
    expect(readCriteria('?conector=CHAdeMO', known).connector).toBe('')
  })

  /**
   * The power steps are derived from the dataset, so a link carrying a value
   * that no longer exists as a step has no control to show it in.
   */
  it('ignores a power that is not one of the steps', () => {
    expect(readCriteria('?kw=150', known).minPower).toBe(0)
    expect(readCriteria('?kw=abc', known).minPower).toBe(0)
  })

  it('falls back to relevance for an unknown sort order', () => {
    expect(readCriteria('?orden=nope', known).sort).toBe('relevance')
  })

  /**
   * `distance` is deliberately not restorable: it needs location permission,
   * and a link cannot grant one. Accepting it from the URL would leave the
   * control showing an order the results are not actually in.
   */
  it('does not restore the distance order from a link', () => {
    expect(readCriteria('?orden=distance', known).sort).toBe('relevance')
  })
})

describe('criteriaToQuery', () => {
  it('writes nothing when nothing is filtered', () => {
    expect(criteriaToQuery(EMPTY_CRITERIA)).toBe('')
  })

  it('omits defaults so the shared link carries only what was chosen', () => {
    expect(criteriaToQuery({ ...EMPTY_CRITERIA, city: 'bogota' })).toBe('?ciudad=bogota')
  })

  it('does not write the distance order, which a link cannot restore', () => {
    expect(criteriaToQuery({ ...EMPTY_CRITERIA, sort: 'distance' })).toBe('')
  })

  /**
   * The round trip is the actual promise of a shareable link: what you send is
   * what the other person opens.
   */
  it('round-trips every criterion a link can carry', () => {
    const criteria: Criteria = {
      query: 'hyatt',
      city: 'medellin',
      connector: 'Type2',
      minPower: 22,
      onlyLive: true,
      sort: 'status',
    }
    expect(readCriteria(criteriaToQuery(criteria), known)).toEqual(criteria)
  })
})
