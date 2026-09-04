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

import type { City } from '~/core/red/domain/entities/City'

export const cities: City[] = [
  {
    slug: 'bogota',
    name: 'Bogotá',
    region: 'Cundinamarca',
    intro: {
      es: 'Carga en el norte, el centro financiero y los corredores de salida de la ciudad, en espacios donde ya ibas a estar.',
      en: "Charge in the north, the financial district and the city's main exit corridors — in places you were already going.",
      pt: 'Carregue na zona norte, no centro financeiro e nos principais corredores de saída da cidade — em lugares onde você já ia estar.',
    },
    featured: true,
  },
  {
    slug: 'medellin',
    name: 'Medellín',
    region: 'Antioquia',
    intro: {
      /* "Puntos estratégicos" was filler. Bogotá's intro, in this same
         collection, is concrete and far better; this brings it up to par. */
      /* Corrected against the real data: the Medellín station is Wake, at
         80 kW, not San Fernando Plaza at 120. The reference to El Poblado
         goes as well: there is no address on record. */
      es: 'Nuestra primera estación en Medellín, con 80 kW y seis puntos de carga.',
      en: 'Our first station in Medellín, with 80 kW and six charge points.',
      pt: 'Nossa primeira estação em Medellín, com 80 kW e seis pontos de carga.',
    },
    featured: true,
  },
]
