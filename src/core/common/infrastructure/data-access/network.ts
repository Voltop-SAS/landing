/**
 * NETWORK AGGREGATES, always computed from the dataset.
 *
 * None of these figures is ever written by hand: §33 forbids inventing
 * figures, and a hand-written figure stops being true the moment a station is
 * added. Adding one record updates the home page on its own.
 */

import { stations } from '~/core/red/infrastructure/content/stations'
import { cities } from '~/core/red/infrastructure/content/cities'
import type { City } from '~/core/red/domain/entities/City'
import { getStationsByCity } from './stations'

export function getNetworkSummary() {
  const operational = stations.filter((s) => s.status === 'operativa')
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
export function getCitiesWithStations(): { city: City; count: number; operational: number }[] {
  return cities
    .map((city) => {
      const list = getStationsByCity(city.slug)
      return {
        city,
        count: list.length,
        operational: list.filter((s) => s.status === 'operativa').length,
      }
    })
    .filter((c) => c.count > 0)
}
