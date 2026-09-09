/**
 * NETWORK AGGREGATES, always computed from the dataset.
 *
 * None of these figures is ever written by hand: §33 forbids inventing
 * figures, and a hand-written figure stops being true the moment a station is
 * added. Adding one record updates the home page on its own.
 */

import { stations } from '~/core/network/infrastructure/content/stations'
import type { Station } from '~/core/network/domain/entities/Station'
import { cities } from '~/core/network/infrastructure/content/cities'
import type { City } from '~/core/network/domain/entities/City'

export function getNetworkSummary(list: Station[] = stations) {
  const operational = list.filter((s) => s.status === 'operativa')
  /* The network minimum is the minimum of the minimums and the maximum the
     maximum of the maximums: publishing "80 kW" while there are 22 kW points
     would be promising more than the network delivers. */
  const minPowers = operational.map((s) => s.powerKw.min)
  const maxPowers = operational.map((s) => s.powerKw.max)
  const connectors = [...new Set(operational.flatMap((s) => s.connectors))]
  return {
    stations: operational.length,
    points: operational.reduce((n, s) => n + (s.points ?? 0), 0),
    cities: new Set(operational.map((s) => s.citySlug)).size,
    minPowerKw: minPowers.length ? Math.min(...minPowers) : null,
    maxPowerKw: maxPowers.length ? Math.max(...maxPowers) : null,
    connectors,
  }
}

/**
 * What one city amounts to in the network. Everything a city page and a city
 * card need to describe themselves, and none of it written by hand.
 */
export type CityCoverage = {
  city: City
  count: number
  operational: number
  points: number
  maxKw: number
}

/**
 * Cities that actually have stations.
 *
 * `points` and `maxKw` are computed, NOT written by hand, and that is the whole
 * reason they are here: the blurb on each city card names those figures, and the
 * copy of this very page already went stale once — it said "from 60 to 150 kW"
 * when the real network goes from 22 to 80. A figure typed into a sentence has
 * no way of noticing that a station came in.
 *
 * `maxKw` is the maximum of the maximums: what the fastest point in that city
 * delivers, which is what "up to N kW" promises.
 *
 * Both datasets are injectable for the same reason `getNetworkSummary` takes
 * its list: these figures become public claims, so they get tested against a
 * fixture rather than against content that legitimately changes.
 */
export function getCitiesWithStations(
  cityList: City[] = cities,
  stationList: Station[] = stations,
): CityCoverage[] {
  return cityList
    .map((city) => {
      const list = stationList.filter((s) => s.citySlug === city.slug)
      return {
        city,
        count: list.length,
        operational: list.filter((s) => s.status === 'operativa').length,
        points: list.reduce((total, s) => total + s.points, 0),
        maxKw: list.reduce((top, s) => Math.max(top, s.powerKw.max), 0),
      }
    })
    .filter((c) => c.count > 0)
}

/**
 * One city's coverage, or `undefined` if it has no stations.
 *
 * `undefined` and not an empty record, and the whole `/red/[city]` route hangs
 * off that distinction: a city with no stations HAS NO PAGE. The route exists
 * to be a local-search landing for stations, so with none there is nothing to
 * land on — and the page's text is composed from these very figures, so the
 * alternative was a page whose lead and whose meta description came out empty.
 *
 * `generateStaticParams` and the sitemap read from `getCitiesWithStations` for
 * that reason, which is what the coverage grid, the hero and the home index
 * already did.
 */
export function getCityCoverage(
  slug: string,
  cityList: City[] = cities,
  stationList: Station[] = stations,
): CityCoverage | undefined {
  return getCitiesWithStations(cityList, stationList).find((c) => c.city.slug === slug)
}
