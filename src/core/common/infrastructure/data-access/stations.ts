/**
 * Estaciones: lectura, filtrado y orden.
 *
 * El filtrado y el orden viven aquí y no en la vista a propósito: si cada
 * superficie ordenara por su cuenta, dos vistas del mismo dataset acabarían
 * mostrando cosas distintas.
 */

import { stations } from '~/core/red/infrastructure/content/stations'
import type { Station } from '~/core/red/domain/entities/Station'

export function getStations(): Station[] {
  return stations
}

export function getStation(slug: string): Station | undefined {
  return stations.find((s) => s.slug === slug)
}

export function getStationsByCity(citySlug: string): Station[] {
  return stations.filter((s) => s.citySlug === citySlug)
}

/** Filtros de /red. Toda comparación es tolerante a acentos y mayúsculas. */
export type StationFilters = {
  query?: string
  citySlug?: string
  connector?: string
  minPowerKw?: number
  onlyAvailable?: boolean
}

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export function filterStations(
  list: Station[],
  f: StationFilters,
  cityNameOf: (slug: string) => string,
): Station[] {
  return list.filter((s) => {
    if (f.citySlug && s.citySlug !== f.citySlug) return false
    if (f.connector && !s.connectors.includes(f.connector as Station['connectors'][number]))
      return false
    /* Se compara contra el MÁXIMO: una estación con puntos de 22 y de 80
        entra en el filtro "80+", porque efectivamente puedes cargar a 80 ahí. */
    if (f.minPowerKw && s.powerKw.max < f.minPowerKw) return false
    if (f.onlyAvailable && s.status !== 'operativa') return false
    if (f.query) {
      const q = normalize(f.query)
      const haystack = normalize(`${s.name} ${cityNameOf(s.citySlug)}`)
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

/* ---------------------------------- Orden -------------------------------- */

/**
 * Criterios de orden del buscador.
 *
 * `distance` existe pero SOLO se ofrece en la UI si alguna estación trae
 * coordenadas (ver `hasCoordinates`). No es código muerto: es una rama activada
 * por datos, el mismo patrón que `MetricRow` con las métricas sin validar (§33).
 */
export type StationSort = 'relevance' | 'power' | 'status' | 'city' | 'distance'

/** `relevance` = el orden curado del dataset. La curaduría es una decisión. */
const statusRank: Record<Station['status'], number> = { operativa: 0, mantenimiento: 1, proxima: 2 }

export function hasCoordinates(list: Station[]): boolean {
  return list.some((s) => s.geo !== null)
}

/**
 * Distancia en línea recta (haversine). No es distancia de ruta y no pretende
 * serlo: sirve para ORDENAR, no para prometer un tiempo de viaje.
 */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function sortStations(
  list: Station[],
  sort: StationSort,
  ctx: { cityNameOf: (slug: string) => string; origin?: { lat: number; lng: number } | null },
): Station[] {
  const out = [...list]
  switch (sort) {
    case 'power':
      return out.sort((a, b) => b.powerKw.max - a.powerKw.max || a.name.localeCompare(b.name))
    case 'status':
      return out.sort(
        (a, b) => statusRank[a.status] - statusRank[b.status] || b.powerKw.max - a.powerKw.max,
      )
    case 'city':
      return out.sort(
        (a, b) =>
          ctx.cityNameOf(a.citySlug).localeCompare(ctx.cityNameOf(b.citySlug)) ||
          a.name.localeCompare(b.name),
      )
    case 'distance': {
      if (!ctx.origin) return out
      const o = ctx.origin
      /* Sin coordenadas no se puede comparar: esas estaciones van al final en
         lugar de aparecer arbitrariamente cerca. */
      return out.sort((a, b) => {
        const da = a.geo ? distanceKm(o, a.geo) : Infinity
        const db = b.geo ? distanceKm(o, b.geo) : Infinity
        return da - db
      })
    }
    default:
      return out
  }
}
