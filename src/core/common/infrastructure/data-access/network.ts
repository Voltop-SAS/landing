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
import { getStationsByCity } from './stations'

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

/** Cities that actually have stations, with their counts. */
/**
 * `points` and `maxKw` are computed, NOT written by hand, and that is the whole
 * reason they are here: the blurb on each city card names those figures, and the
 * copy of this very page already went stale once — it said "from 60 to 150 kW"
 * when the real network goes from 22 to 80. A figure typed into a sentence has
 * no way of noticing that a station came in.
 *
 * `maxKw` is the maximum of the maximums: what the fastest point in that city
 * delivers, which is what "up to N kW" promises.
 */
export function getCitiesWithStations(): {
  city: City
  count: number
  operational: number
  points: number
  maxKw: number
}[] {
  return cities
    .map((city) => {
      const list = getStationsByCity(city.slug)
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
