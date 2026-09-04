/**
 * CAPA DE ACCESO A DATOS
 * Ver docs/MASTER-PROJECT-DEFINITION.md §26.
 *
 * Los componentes NUNCA importan el contenido directamente: siempre pasan por
 * aquí. Es lo que permite cambiar el origen (CMS, API, base de datos) sin
 * tocar una sola línea de presentación.
 *
 * Hoy el origen son módulos locales y las funciones son síncronas —salvo el
 * registro de novedades, que ya es asíncrono porque su origen va a ser remoto—.
 *
 * ── POR QUÉ UNA SOLA FRONTERA Y NO UNA POR MÓDULO ─────────────────────────
 * El estándar pide `data-access` dentro de cada módulo. Aquí no funciona: de
 * los 27 accesores, ocho los consume `home`, que no es dueña de ninguno de
 * esos datos —el resumen de red y las ciudades son de `red`, los segmentos y
 * el caso destacado de `empresas`, el fundador de `nosotros`, las últimas
 * novedades de `novedades`—. Partir por módulo pondría a `home` importando la
 * infraestructura de otros cuatro, que es el code smell que el propio estándar
 * lista. La salida que ofrece —"usar tipos de dominio"— no sirve, porque lo
 * que `home` necesita son las funciones, no los tipos.
 *
 * Así que la frontera es una y está en `common`, partida por tema para que
 * ningún archivo sea un cajón.
 */

export { getFaq } from './faq'
export {
  getStations,
  getStation,
  getStationsByCity,
  filterStations,
  hasCoordinates,
  distanceKm,
  sortStations,
  type StationFilters,
  type StationSort,
} from './stations'
export { getCities, getCity } from './cities'
export { getNetworkSummary, getCitiesWithStations } from './network'
export {
  getMetrics,
  getBusinessSegments,
  getFeaturedCase,
  getPartners,
  getTestimonials,
  getFounder,
} from './company'
export {
  getPosts,
  getPost,
  hasPage,
  getPostsWithPage,
  getFeaturedPost,
  getLatestPosts,
  getPostsForStation,
  getPostsForCity,
  getLatestPostDate,
} from './posts'

export type { Station } from '~/core/red/domain/entities/Station'
export type { City } from '~/core/red/domain/entities/City'
export type { Metric, Case } from '@/content/data/company'
export type { Post, PostType } from '~/core/novedades/domain/entities/Post'
