import { describe, expect, it } from 'vitest'
import { filterStations, sortStations } from './stations'
import type { Station, StationStatus } from '~/core/network/domain/entities/Station'

/**
 * FILTERING AND ORDERING OF STATIONS.
 *
 * What is pinned here are the DECISIONS, not the mechanics. Every one of these
 * assertions has a plausible production change that turns it red — comparing
 * power against `min` instead of `max`, dropping the accent stripping,
 * reordering `statusRank`, sorting the caller's array in place. An assertion no
 * realistic change can break is not protecting anything, so it is not here.
 *
 * The fixtures are built in this file and the real dataset is deliberately not
 * used: a test that asserts against `stations.ts` goes red every time someone
 * opens a station, and a suite that cries wolf teaches the team to ignore it.
 */

/** A valid station, with only what each test cares about overridden. */
function station(overrides: Partial<Station> & { slug: string }): Station {
  const text = { es: '—', en: '—', pt: '—' }
  return {
    name: overrides.slug,
    citySlug: 'bogota',
    address: text,
    geo: null,
    connectors: ['CCS2'],
    powerKw: { min: 50, max: 50 },
    points: 2,
    status: 'operativa',
    hours: text,
    pricing: null,
    services: [],
    media: { photos: [] },
    dataStatus: 'verified',
    ...overrides,
  }
}

const cityNames: Record<string, string> = { bogota: 'Bogotá', medellin: 'Medellín' }
const cityNameOf = (slug: string) => cityNames[slug] ?? ''
const slugs = (list: Station[]) => list.map((s) => s.slug)

describe('filterStations · power is compared against the MAXIMUM', () => {
  /**
   * The station's own comment states it: a station with 22 kW and 80 kW points
   * passes the "80+" filter, because you genuinely can charge at 80 there. It
   * is exactly the kind of decision someone "corrects" to `min` later on.
   */
  const mixed = station({ slug: 'ean', powerKw: { min: 22, max: 80 } })
  const slow = station({ slug: 'slow', powerKw: { min: 22, max: 22 } })

  it('keeps a station whose range reaches the threshold, even if its floor is below', () => {
    expect(slugs(filterStations([mixed, slow], { minPowerKw: 80 }, cityNameOf))).toEqual(['ean'])
  })

  it('drops a station whose whole range is below the threshold', () => {
    expect(filterStations([slow], { minPowerKw: 80 }, cityNameOf)).toEqual([])
  })
})

describe('filterStations · the search is what people actually type', () => {
  const wake = station({ slug: 'wake', name: 'Wake', citySlug: 'medellin' })
  const ean = station({ slug: 'ean', name: 'Universidad EAN', citySlug: 'bogota' })

  it('finds an accented name typed without accents', () => {
    expect(slugs(filterStations([wake, ean], { query: 'medellin' }, cityNameOf))).toEqual(['wake'])
  })

  it('ignores case', () => {
    expect(slugs(filterStations([wake, ean], { query: 'WAKE' }, cityNameOf))).toEqual(['wake'])
  })

  /**
   * The haystack is the station name PLUS its city name. Searching for a city
   * has to surface stations whose own name never mentions it — "Wake" is in
   * Medellín and says so nowhere.
   */
  it('matches on the city name, not only on the station name', () => {
    expect(slugs(filterStations([wake, ean], { query: 'Medellín' }, cityNameOf))).toEqual(['wake'])
  })

  it('returns nothing when nothing matches, rather than everything', () => {
    expect(filterStations([wake, ean], { query: 'cali' }, cityNameOf)).toEqual([])
  })
})

describe('filterStations · availability means operativa and nothing else', () => {
  const list = [
    station({ slug: 'live', status: 'operativa' }),
    station({ slug: 'fixing', status: 'mantenimiento' }),
    station({ slug: 'soon', status: 'proxima' }),
  ]

  /**
   * `mantenimiento` is the tempting one to let through — the station exists and
   * is built. It still cannot charge a car today, which is the only thing the
   * filter is being asked.
   */
  it('excludes both mantenimiento and proxima', () => {
    expect(slugs(filterStations(list, { onlyAvailable: true }, cityNameOf))).toEqual(['live'])
  })
})

describe('filterStations · several filters narrow together', () => {
  const list = [
    station({
      slug: 'match',
      citySlug: 'medellin',
      connectors: ['CCS1'],
      powerKw: { min: 80, max: 80 },
    }),
    station({
      slug: 'wrong-city',
      citySlug: 'bogota',
      connectors: ['CCS1'],
      powerKw: { min: 80, max: 80 },
    }),
    station({
      slug: 'wrong-plug',
      citySlug: 'medellin',
      connectors: ['Type2'],
      powerKw: { min: 80, max: 80 },
    }),
    station({
      slug: 'too-slow',
      citySlug: 'medellin',
      connectors: ['CCS1'],
      powerKw: { min: 22, max: 22 },
    }),
  ]

  it('applies every filter, not just the last one', () => {
    const result = filterStations(
      list,
      { citySlug: 'medellin', connector: 'CCS1', minPowerKw: 80 },
      cityNameOf,
    )
    expect(slugs(result)).toEqual(['match'])
  })
})

describe('sortStations · status decides what someone looking to charge now sees first', () => {
  /**
   * The order is operativa → mantenimiento → proxima, and it is not
   * alphabetical in any language: it is usefulness right now. A station under
   * maintenance is still a real one; a `proxima` cannot charge anything yet.
   */
  it('ranks operativa, then mantenimiento, then proxima', () => {
    const list: Station[] = (['proxima', 'operativa', 'mantenimiento'] as StationStatus[]).map(
      (s) => station({ slug: s, status: s }),
    )
    expect(slugs(sortStations(list, 'status', { cityNameOf }))).toEqual([
      'operativa',
      'mantenimiento',
      'proxima',
    ])
  })

  it('breaks a tie within the same status by power, highest first', () => {
    const list = [
      station({ slug: 'weak', status: 'operativa', powerKw: { min: 22, max: 22 } }),
      station({ slug: 'strong', status: 'operativa', powerKw: { min: 22, max: 80 } }),
    ]
    expect(slugs(sortStations(list, 'status', { cityNameOf }))).toEqual(['strong', 'weak'])
  })
})

describe('sortStations · distance', () => {
  /**
   * The origin is deliberately NOT on top of any station: every distance is
   * distinct and non-zero. An earlier version put it exactly on `near`, whose
   * distance was therefore 0 — the same value a broken implementation gives a
   * station with no coordinates. The assertion passed by coincidence, because
   * the tie hid the bug instead of exposing it.
   */
  const origin = { lat: 4.7, lng: -74.1 }
  const near = station({ slug: 'near', geo: { lat: 4.66, lng: -74.06 } })
  const far = station({ slug: 'far', geo: { lat: 6.24, lng: -75.58 } })
  const unknown = station({ slug: 'unknown', geo: null })

  /**
   * A station with no coordinates must go LAST, not appear arbitrarily close.
   * Scoring an unknown distance as 0 would put the least informative result at
   * the top of a list whose whole promise is proximity.
   */
  /**
   * Asserted from several starting orders on purpose. The result must not
   * depend on the order the list arrived in, and checking a single one hides
   * a whole class of bug: a comparator that scores a missing distance
   * inconsistently is only exposed by some inputs, so one arrangement can pass
   * while another returns something else entirely.
   */
  it.each([[[unknown, far, near]], [[far, near, unknown]], [[near, unknown, far]]])(
    'sends stations without coordinates to the end, whatever the input order',
    (list) => {
      const sorted = sortStations(list, 'distance', { cityNameOf, origin })
      expect(slugs(sorted)).toEqual(['near', 'far', 'unknown'])
    },
  )

  it('orders the ones it can measure from closest to furthest', () => {
    const sorted = sortStations([far, near], 'distance', { cityNameOf, origin })
    expect(slugs(sorted)).toEqual(['near', 'far'])
  })

  it('leaves the order untouched when there is no origin to measure from', () => {
    const list = [far, near, unknown]
    expect(slugs(sortStations(list, 'distance', { cityNameOf, origin: null }))).toEqual(slugs(list))
  })
})

describe('sortStations · the contract with its caller', () => {
  /**
   * `relevance` is the dataset's curated order, and curation is a decision: it
   * must not be quietly re-sorted into something else.
   */
  it('leaves relevance in the order it received', () => {
    const list = [
      station({ slug: 'third', powerKw: { min: 22, max: 22 } }),
      station({ slug: 'first', powerKw: { min: 80, max: 80 } }),
      station({ slug: 'second', status: 'proxima' }),
    ]
    expect(slugs(sortStations(list, 'relevance', { cityNameOf }))).toEqual([
      'third',
      'first',
      'second',
    ])
  })

  /**
   * `Array.prototype.sort` mutates. The function copies first, and it has to:
   * the finder derives its results from the `stations` prop, so sorting in
   * place would reorder the caller's own list as a side effect of reading it.
   */
  it('does not reorder the array it was given', () => {
    const list = [
      station({ slug: 'b', powerKw: { min: 22, max: 22 } }),
      station({ slug: 'a', powerKw: { min: 80, max: 80 } }),
    ]
    sortStations(list, 'power', { cityNameOf })
    expect(slugs(list)).toEqual(['b', 'a'])
  })
})
