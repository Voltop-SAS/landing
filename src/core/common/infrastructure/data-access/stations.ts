/**
 * Stations: reading, filtering and ordering.
 *
 * Filtering and ordering live here and not in the view on purpose: if every
 * surface sorted on its own, two views of the same dataset would end up showing
 * different things.
 */

import { stations } from '~/core/network/infrastructure/content/stations'
import type { Station } from '~/core/network/domain/entities/Station'

export function getStations(): Station[] {
  return stations
}

export function getStation(slug: string): Station | undefined {
  return stations.find((s) => s.slug === slug)
}

export function getStationsByCity(citySlug: string): Station[] {
  return stations.filter((s) => s.citySlug === citySlug)
}

/** Filters for /red. Every comparison ignores accents and case. */
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
    /* Compared against the MAXIMUM: a station with both 22 kW and 80 kW points
        passes the "80+" filter, because you genuinely can charge at 80 there. */
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

/* --------------------------------- Ordering ------------------------------- */

/**
 * The finder's sort criteria.
 *
 * `distance` exists but is ONLY offered in the UI if some station carries
 * coordinates (see `hasCoordinates`). It is not dead code: it is a branch
 * switched on by data, the same pattern `MetricRow` uses for unvalidated
 * metrics (§33).
 */
export type StationSort = 'relevance' | 'power' | 'status' | 'city' | 'distance'

/** `relevance` = the dataset's curated order. Curation is a decision. */
const statusRank: Record<Station['status'], number> = { operativa: 0, mantenimiento: 1, proxima: 2 }

export function hasCoordinates(list: Station[]): boolean {
  return list.some((s) => s.geo !== null)
}

/**
 * Straight-line distance (haversine). It is not routing distance and does not
 * pretend to be: it exists to ORDER, not to promise a travel time.
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
      /* With no coordinates there is nothing to compare: those stations go last
         instead of appearing arbitrarily close. */
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
