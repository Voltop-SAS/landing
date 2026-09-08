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
 * ── AQUÍ YA NO HAY DESCRIPCIÓN POR CIUDAD (2026-09-08) ────────────────────
 * Cada ciudad traía un campo `intro` escrito a mano. Se retiró entero, no solo
 * su contenido: mientras el campo existiera, cualquiera podía volver a llenarlo
 * y el texto reaparecería sin que nadie lo pidiera.
 *
 * La descripción se compone ahora en `cityCopy.lead` con las cifras que
 * devuelve `getCitiesWithStations()`. Lee esa nota antes de traerlo de vuelta.
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
