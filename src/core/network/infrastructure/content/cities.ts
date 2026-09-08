/**
 * COLLECTION · Cities
 * See docs/MASTER-PROJECT-DEFINITION.md §14 and §27.
 *
 * A city is an entity, not free text inside a station.
 * It enables: real filters, browsable coverage and local SEO
 * ("cargador eléctrico Medellín" is the search the user actually types).
 *
 * Adding a city = adding a record. The /red/[city] route generates itself.
 */

import type { City } from '~/core/network/domain/entities/City'

/**
 * ── THERE IS NO PER-CITY DESCRIPTION HERE ANY MORE (2026-09-08) ───────────
 * Every city carried a hand-written `intro` field. It was removed whole, not
 * just its content: as long as the field existed, anyone could fill it again
 * and the text would come back with nobody asking for it.
 *
 * The description is now composed in `cityCopy.lead` from the figures
 * `getCitiesWithStations()` returns. Read that note before bringing it back.
 */
export const cities: City[] = [
  {
    slug: 'bogota',
    name: 'Bogotá',
    region: 'Cundinamarca',
    featured: true,
  },
  {
    slug: 'medellin',
    name: 'Medellín',
    region: 'Antioquia',
    featured: true,
  },
]
