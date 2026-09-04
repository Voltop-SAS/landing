/** Ciudades. */

import { cities, type City } from '@/content/data/cities'

export function getCities(): City[] {
  return cities
}

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}
