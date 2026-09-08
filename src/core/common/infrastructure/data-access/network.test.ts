import { describe, expect, it } from 'vitest'
import { getNetworkSummary } from './network'
import type { Station } from '~/core/network/domain/entities/Station'

/**
 * These figures are published on the home page, and §33 forbids writing any of
 * them by hand — precisely so that adding a station updates the site on its
 * own. That makes this function the single place where a wrong number becomes
 * a public claim.
 *
 * It is tested against a FIXTURE and never against the real dataset: a test
 * that asserts "3 stations" breaks the day somebody opens a fourth, and a test
 * that cries wolf on legitimate content changes teaches people to ignore it.
 */
const station = (over: Partial<Station>): Station => ({
  slug: 's',
  name: 'S',
  citySlug: 'bogota',
  address: { es: '' },
  geo: null,
  connectors: ['CCS2'],
  powerKw: { min: 50, max: 50 },
  points: 2,
  status: 'operativa',
  hours: { es: '' },
  openingHours: null,
  pricing: null,
  services: [],
  media: { photos: [] },
  dataStatus: 'verified',
  ...over,
})

describe('getNetworkSummary', () => {
  /**
   * The decision this protects is written in the function's own comment: the
   * network minimum is the minimum of the minimums and the maximum is the
   * maximum of the maximums. Publishing "80 kW" while there are 22 kW points
   * would promise more than the network delivers.
   */
  it('spans from the lowest minimum to the highest maximum', () => {
    const summary = getNetworkSummary([
      station({ slug: 'a', powerKw: { min: 22, max: 80 } }),
      station({ slug: 'b', powerKw: { min: 50, max: 60 } }),
    ])
    expect(summary.minPowerKw).toBe(22)
    expect(summary.maxPowerKw).toBe(80)
  })

  /**
   * Everything is counted over OPERATIONAL stations only. A station announced
   * as upcoming is not capacity the network has today, and counting it would
   * inflate every figure on the home page at once.
   */
  it('counts only operational stations, in every figure', () => {
    const summary = getNetworkSummary([
      station({ slug: 'a', status: 'operativa', points: 4, citySlug: 'bogota' }),
      station({ slug: 'b', status: 'proxima', points: 10, citySlug: 'cali' }),
      station({ slug: 'c', status: 'mantenimiento', points: 10, citySlug: 'cali' }),
    ])
    expect(summary.stations).toBe(1)
    expect(summary.points).toBe(4)
    expect(summary.cities).toBe(1)
  })

  it('counts each city once however many stations it has', () => {
    const summary = getNetworkSummary([
      station({ slug: 'a', citySlug: 'bogota' }),
      station({ slug: 'b', citySlug: 'bogota' }),
      station({ slug: 'c', citySlug: 'medellin' }),
    ])
    expect(summary.cities).toBe(2)
  })

  it('lists each connector type once', () => {
    const summary = getNetworkSummary([
      station({ slug: 'a', connectors: ['CCS2', 'Type2'] }),
      station({ slug: 'b', connectors: ['CCS2'] }),
    ])
    expect([...summary.connectors].sort()).toEqual(['CCS2', 'Type2'])
  })

  /**
   * The empty case is not hypothetical: it is what the page renders before the
   * first station is published, and what it would render if the dataset ever
   * failed to load. `null` is what lets the UI omit the range instead of
   * printing "Infinity–-Infinity", which is what `Math.min()` of an empty list
   * returns.
   */
  it('reports null power instead of Infinity when nothing is operational', () => {
    const summary = getNetworkSummary([station({ status: 'proxima' })])
    expect(summary.minPowerKw).toBeNull()
    expect(summary.maxPowerKw).toBeNull()
    expect(summary.stations).toBe(0)
  })

  it('tolerates a station with no declared points', () => {
    const summary = getNetworkSummary([
      station({ slug: 'a', points: undefined as unknown as number }),
      station({ slug: 'b', points: 3 }),
    ])
    expect(summary.points).toBe(3)
  })
})
