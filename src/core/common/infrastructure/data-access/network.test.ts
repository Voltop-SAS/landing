import { describe, expect, it } from 'vitest'
import { getCitiesWithStations, getCityCoverage, getNetworkSummary } from './network'
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

/**
 * These figures are the ones the city cards and the city pages put into a
 * sentence. Since the copy stopped being written by hand, a wrong number here
 * becomes a wrong number in a meta description — which is the version a search
 * engine keeps.
 */
const CITIES = [
  { slug: 'bogota', name: 'Bogotá', region: 'Cundinamarca' },
  { slug: 'medellin', name: 'Medellín', region: 'Antioquia' },
  { slug: 'cali', name: 'Cali', region: 'Valle del Cauca' },
]

describe('getCitiesWithStations', () => {
  it('adds up the points of every station in the city', () => {
    const [bogota] = getCitiesWithStations(CITIES, [
      station({ slug: 'a', citySlug: 'bogota', points: 18 }),
      station({ slug: 'b', citySlug: 'bogota', points: 11 }),
    ])
    expect(bogota.count).toBe(2)
    expect(bogota.points).toBe(29)
  })

  /**
   * `maxKw` is the maximum of the maximums: what the fastest point in that
   * city delivers, which is what "hasta N kW" promises. An average or a
   * minimum here would understate the network; a sum would invent a station.
   */
  it('reports the fastest point in the city, not a total or an average', () => {
    const [bogota] = getCitiesWithStations(CITIES, [
      station({ slug: 'a', citySlug: 'bogota', powerKw: { min: 22, max: 22 } }),
      station({ slug: 'b', citySlug: 'bogota', powerKw: { min: 50, max: 80 } }),
    ])
    expect(bogota.maxKw).toBe(80)
  })

  /**
   * A city with no stations is left out entirely, and the whole `/red/[city]`
   * route hangs off that: it is generated from this list, so a city with
   * nothing to show gets no page rather than an empty one.
   */
  it('leaves out a city that has no stations', () => {
    const result = getCitiesWithStations(CITIES, [station({ citySlug: 'bogota' })])
    expect(result.map((c) => c.city.slug)).toEqual(['bogota'])
  })

  /**
   * `count` is every station and `operational` only the ones running. The card
   * shows the fraction precisely when they differ — a station announced and
   * not yet operating is what must not be hidden.
   */
  it('counts announced stations in the total but not as operational', () => {
    const [bogota] = getCitiesWithStations(CITIES, [
      station({ slug: 'a', citySlug: 'bogota', status: 'operativa' }),
      station({ slug: 'b', citySlug: 'bogota', status: 'proxima' }),
    ])
    expect(bogota.count).toBe(2)
    expect(bogota.operational).toBe(1)
  })
})

describe('getCityCoverage', () => {
  it('finds the city by slug', () => {
    const coverage = getCityCoverage('medellin', CITIES, [
      station({ citySlug: 'medellin', points: 6 }),
    ])
    expect(coverage?.city.name).toBe('Medellín')
    expect(coverage?.points).toBe(6)
  })

  /**
   * `undefined` is what turns into a 404, and that is deliberate: the page's
   * lead and its meta description are composed from these figures, so a city
   * with none would publish an empty description rather than a page.
   */
  it('reports nothing for a city with no stations', () => {
    expect(getCityCoverage('cali', CITIES, [station({ citySlug: 'bogota' })])).toBeUndefined()
  })

  it('reports nothing for a slug that is not a city', () => {
    expect(getCityCoverage('atlantis', CITIES, [station({ citySlug: 'bogota' })])).toBeUndefined()
  })
})
