import type { Localized } from "@/lib/i18n/config";

/**
 * COPY · Red, Ciudad y Estación
 *
 * /red es una SUPERFICIE DE PRODUCTO, no un relato (§14).
 * Su trabajo es encontrar una estación. El titular no promete capacidades
 * que la página no tiene: se eliminó "en tiempo real" porque no hay
 * integración de disponibilidad (§19: un titular es un contrato).
 */

export const red = {
  meta: {
    title: { es: "Red de carga · Voltop", en: "Charging network · Voltop" } satisfies Localized,
    description: {
      es: "Encuentra estaciones de carga Voltop en Colombia: ubicación, conectores, potencia y servicios de cada estación.",
      en: "Find Voltop charging stations across Colombia: location, connectors, power and amenities for each station.",
    } satisfies Localized,
  },

  hero: {
    eyebrow: { es: "La red", en: "The network" } satisfies Localized,
    title: { es: "Encuentra dónde cargar", en: "Find where to charge" } satisfies Localized,
    lead: {
      es: "Busca por nombre o ciudad y filtra por conector, potencia y estado.",
      en: "Search by name or city and filter by connector, power and status.",
    } satisfies Localized,
  },

  search: {
    label: { es: "Buscar estación o ciudad", en: "Search station or city" } satisfies Localized,
    placeholder: { es: "Ej.: Medellín, Grand Hyatt…", en: "E.g.: Medellín, Grand Hyatt…" } satisfies Localized,
    clear: { es: "Limpiar búsqueda", en: "Clear search" } satisfies Localized,
  },

  filters: {
    title: { es: "Filtros", en: "Filters" } satisfies Localized,
    city: { es: "Ciudad", en: "City" } satisfies Localized,
    connector: { es: "Conector", en: "Connector" } satisfies Localized,
    power: { es: "Potencia mínima", en: "Minimum power" } satisfies Localized,
    availability: { es: "Solo en operación", en: "Live stations only" } satisfies Localized,
    all: { es: "Todas", en: "All" } satisfies Localized,
    allM: { es: "Todos", en: "All" } satisfies Localized,
    clear: { es: "Quitar filtros", en: "Clear filters" } satisfies Localized,
    resultsOne: { es: "estación encontrada", en: "station found" } satisfies Localized,
    resultsMany: { es: "estaciones encontradas", en: "stations found" } satisfies Localized,
  },

  cities: {
    title: { es: "Cobertura por ciudad", en: "Coverage by city" } satisfies Localized,
    lead: {
      es: "La red crece por corredores y ciudades. Explora dónde estamos hoy.",
      en: "The network grows by corridors and cities. Explore where we are today.",
    } satisfies Localized,
    seeCity: { es: "Ver estaciones", en: "See stations" } satisfies Localized,
  },

  howToCharge: {
    eyebrow: { es: "Cómo cargar", en: "How to charge" } satisfies Localized,
    title: { es: "Tres pasos y sigues tu día", en: "Three steps and you're on your way" } satisfies Localized,
    steps: [
      {
        step: "01",
        title: { es: "Encuentra", en: "Find" } satisfies Localized,
        body: {
          es: "Ubica una estación con el conector y la potencia que necesita tu vehículo.",
          en: "Locate a station with the connector and power your vehicle needs.",
        } satisfies Localized,
      },
      {
        step: "02",
        title: { es: "Conecta", en: "Connect" } satisfies Localized,
        body: {
          es: "Enchufa e inicia la carga desde la app. No necesitas tarjeta ni membresía.",
          en: "Plug in and start charging from the app. No card or membership needed.",
        } satisfies Localized,
      },
      {
        step: "03",
        title: { es: "Sigue", en: "Go" } satisfies Localized,
        body: {
          es: "Consulta el progreso desde el teléfono mientras haces lo que ibas a hacer.",
          en: "Track progress from your phone while you get on with your day.",
        } satisfies Localized,
      },
    ],
  },

  hostHandoff: {
    title: { es: "¿Tienes un espacio con parqueadero?", en: "Do you have a space with parking?" } satisfies Localized,
    body: {
      es: "Hoteles, centros comerciales, campus y edificios corporativos: instalamos y operamos la carga sin inversión inicial de tu parte.",
      en: "Hotels, malls, campuses and corporate buildings: we install and operate the charging with no upfront investment on your side.",
    } satisfies Localized,
  },
};

export const city = {
  eyebrow: { es: "Cobertura", en: "Coverage" } satisfies Localized,
  titlePrefix: { es: "Cargar en", en: "Charging in" } satisfies Localized,
  metaTitlePattern: { es: "Estaciones de carga en", en: "Charging stations in" } satisfies Localized,
  stationsHere: { es: "Estaciones en esta ciudad", en: "Stations in this city" } satisfies Localized,
  otherCities: { es: "Otras ciudades", en: "Other cities" } satisfies Localized,
};

export const station = {
  eyebrow: { es: "Estación", en: "Station" } satisfies Localized,
  specs: {
    title: { es: "Ficha técnica", en: "Specifications" } satisfies Localized,
    power: { es: "Potencia máxima", en: "Maximum power" } satisfies Localized,
    points: { es: "Puntos de carga", en: "Charging points" } satisfies Localized,
    connectors: { es: "Conectores", en: "Connectors" } satisfies Localized,
    hours: { es: "Horario", en: "Hours" } satisfies Localized,
    pricing: { es: "Tarifa", en: "Pricing" } satisfies Localized,
  },
  services: { es: "Servicios del lugar", en: "On-site amenities" } satisfies Localized,
  location: { es: "Ubicación", en: "Location" } satisfies Localized,
  nearby: { es: "Otras estaciones cerca", en: "Other stations nearby" } satisfies Localized,
  /** Honestidad de datos: se declara qué falta y por qué (§33). */
  pendingGeo: {
    es: "Coordenadas pendientes de confirmación: el enlace abre una búsqueda por dirección.",
    en: "Coordinates pending confirmation: the link opens a search by address.",
  } satisfies Localized,
  pendingPricing: {
    es: "Tarifa pendiente de confirmación comercial.",
    en: "Pricing pending commercial confirmation.",
  } satisfies Localized,
};
