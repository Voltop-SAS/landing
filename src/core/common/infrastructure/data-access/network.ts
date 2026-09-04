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
  const operativas = stations.filter((s) => s.status === 'operativa')
  /* El mínimo de la red es el mínimo de los mínimos y el máximo el de los
     máximos: publicar "80 kW" cuando hay puntos de 22 sería prometer de más. */
  const minimos = operativas.map((s) => s.powerKw.min)
  const maximos = operativas.map((s) => s.powerKw.max)
  const conectores = [...new Set(operativas.flatMap((s) => s.connectors))]
  return {
    estaciones: operativas.length,
    puntos: operativas.reduce((n, s) => n + (s.points ?? 0), 0),
    ciudades: new Set(operativas.map((s) => s.citySlug)).size,
    potenciaMin: minimos.length ? Math.min(...minimos) : null,
    potenciaMax: maximos.length ? Math.max(...maximos) : null,
    conectores,
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
