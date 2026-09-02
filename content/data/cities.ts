import type { Localized } from "@/lib/i18n/config";

/**
 * COLECCIÓN · Ciudades
 * Ver docs/MASTER-PROJECT-DEFINITION.md §14 y §27.
 *
 * La ciudad es una entidad, no un texto libre dentro de la estación.
 * Habilita: filtros reales, cobertura navegable y SEO local
 * ("cargador eléctrico Medellín" es la búsqueda que hace el usuario).
 *
 * Añadir una ciudad = añadir un registro. La ruta /red/[ciudad] se genera sola.
 */

export type City = {
  slug: string;
  /** Nombre propio: no se traduce. */
  name: string;
  region: string;
  /** Contexto local. Nunca incluye cifras sin validar. */
  intro: Localized;
  featured?: boolean;
};

export const cities: City[] = [
  {
    slug: "bogota",
    name: "Bogotá",
    region: "Cundinamarca",
    intro: {
      es: "Carga en el norte, el centro financiero y los corredores de salida de la ciudad, en espacios donde ya ibas a estar.",
      en: "Charge in the north, the financial district and the city's main exit corridors — in places you were already going.",
      pt: "Carregue na zona norte, no centro financeiro e nos principais corredores de saída da cidade — em lugares onde você já ia estar.",
    },
    featured: true,
  },
  {
    slug: "medellin",
    name: "Medellín",
    region: "Antioquia",
    intro: {
      /* "Puntos estratégicos" era relleno. El intro de Bogotá, en esta misma
         colección, es concreto y muy superior; esto lo pone a la par. */
      es: "Carga rápida en El Poblado: 120 kW dentro de San Fernando Plaza, con más estaciones en camino por el Valle de Aburrá.",
      en: "Fast charging in El Poblado: 120 kW inside San Fernando Plaza, with more stations on the way across the Aburrá Valley.",
      pt: "Carregamento rápido em El Poblado: 120 kW dentro do San Fernando Plaza, com mais estações a caminho no Vale de Aburrá.",
    },
    featured: true,
  },
];
