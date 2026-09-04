/** Cities. */

import { cities } from '~/core/red/infrastructure/content/cities'
import type { City } from '~/core/red/domain/entities/City'

export function getCities(): City[] {
  return cities
}

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}
