/**
 * Agregados de la red, calculados siempre desde el dataset.
 *
 * Ninguna de estas cifras se escribe a mano: §33 lo prohíbe, y una cifra
 * escrita a mano deja de ser verdad en cuanto se añade una estación.
 */

import { stations } from '~/core/red/infrastructure/content/stations'
import { cities } from '~/core/red/infrastructure/content/cities'
import type { City } from '~/core/red/domain/entities/City'
import { getStationsByCity } from './stations'

/**
 * AGREGADOS DE LA RED, calculados desde el dataset.
 *
 * Ninguna de estas cifras se escribe a mano en ningún sitio: §33 prohíbe
 * inventar cifras, y una cifra escrita a mano es una cifra que deja de ser
 * verdad en cuanto se añade una estación. Añadir un registro actualiza la
 * Home sola.
 */
export function getNetworkSummary() {
  const operational = stations.filter((s) => s.status === 'operativa')
  /* El mínimo de la red es el mínimo de los mínimos y el máximo el de los
     máximos: publicar "80 kW" cuando hay puntos de 22 sería prometer de más. */
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

/** Ciudades que efectivamente tienen estaciones, con su conteo. */
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
