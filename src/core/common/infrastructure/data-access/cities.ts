/** Cities. */

import { cities } from '~/core/network/infrastructure/content/cities'
import type { City } from '~/core/network/domain/entities/City'

export function getCities(): City[] {
  return cities
}

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}
