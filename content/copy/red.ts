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
    title: { es: "Red de carga · Voltop", en: "Charging network · Voltop", pt: "Rede de carregamento · Voltop", } satisfies Localized,
    description: {
      es: "Encuentra estaciones de carga Voltop en Colombia: ubicación, conectores, potencia y servicios de cada estación.",
      en: "Find Voltop charging stations across Colombia: location, connectors, power and amenities for each station.",
      pt: "Encontre as estações de carregamento Voltop em toda a Colômbia: localização, conectores, potência e comodidades de cada estação.",
    } satisfies Localized,
  },

  hero: {
    eyebrow: { es: "La red", en: "The network", pt: "A rede", } satisfies Localized,
    title: { es: "Encuentra dónde cargar", en: "Find where to charge", pt: "Encontre onde carregar", } satisfies Localized,
    lead: {
      es: "Busca por nombre o ciudad y filtra por conector, potencia y estado.",
      en: "Search by name or city and filter by connector, power and status.",
      pt: "Busque por nome ou cidade e filtre por conector, potência e status.",
    } satisfies Localized,
  },

  search: {
    label: { es: "Buscar estación o ciudad", en: "Search station or city", pt: "Buscar estação ou cidade", } satisfies Localized,
    placeholder: { es: "Ej.: Medellín, Grand Hyatt…", en: "E.g.: Medellín, Grand Hyatt…", pt: "Ex.: Medellín, Grand Hyatt…", } satisfies Localized,
    clear: { es: "Limpiar búsqueda", en: "Clear search", pt: "Limpar busca", } satisfies Localized,
  },

  filters: {
    /** Etiqueta del grupo. El chip de dentro dice qué hace; el grupo, de qué es. */
    availabilityGroup: { es: "Disponibilidad", en: "Availability", pt: "Disponibilidade", } satisfies Localized,
    city: { es: "Ciudad", en: "City", pt: "Cidade", } satisfies Localized,
    connector: { es: "Conector", en: "Connector", pt: "Conector", } satisfies Localized,
    power: { es: "Potencia mínima", en: "Minimum power", pt: "Potência mínima", } satisfies Localized,
    availability: { es: "Solo en operación", en: "Live stations only", pt: "Somente estações em operação", } satisfies Localized,
    all: { es: "Todas", en: "All", pt: "Tudo", } satisfies Localized,
    allM: { es: "Todos", en: "All", pt: "Tudo", } satisfies Localized,
    clear: { es: "Quitar filtros", en: "Clear filters", pt: "Limpar filtros", } satisfies Localized,
    resultsOne: { es: "estación", en: "station", pt: "estação", } satisfies Localized,
    resultsMany: { es: "estaciones", en: "stations", pt: "estações", } satisfies Localized,
    /** Botón que despliega los filtros en móvil. */
    toggle: { es: "Filtros", en: "Filters", pt: "Filtros", } satisfies Localized,
    toggleHide: { es: "Ocultar filtros", en: "Hide filters", pt: "Ocultar filtros", } satisfies Localized,
    activeCount: { es: "activos", en: "active", pt: "ativas", } satisfies Localized,
  },

  /**
   * ORDEN. Sustituye a la falta de "por distancia" con criterios que el dataset
   * SÍ puede responder hoy. `distance` solo se ofrece si hay coordenadas.
   */
  sort: {
    label: { es: "Ordenar por", en: "Sort by", pt: "Ordenar por", } satisfies Localized,
    relevance: { es: "Recomendadas", en: "Recommended", pt: "Recomendado", } satisfies Localized,
    power: { es: "Más potencia", en: "Highest power", pt: "Maior potência", } satisfies Localized,
    status: { es: "En operación primero", en: "Live first", pt: "Em operação primeiro", } satisfies Localized,
    city: { es: "Ciudad", en: "City", pt: "Cidade", } satisfies Localized,
    distance: { es: "Más cerca de mí", en: "Closest to me", pt: "Mais perto de mim", } satisfies Localized,
  },

  /**
   * CERCANÍA. Toda esta rama está condicionada a que el dataset traiga `geo`:
   * si ninguna estación tiene coordenadas, no se ofrece nada — igual que
   * `MetricRow` no pinta métricas sin validar (§33). No es código muerto: se
   * enciende sola cuando lleguen las coordenadas.
   */
  nearby: {
    action: { es: "Usar mi ubicación", en: "Use my location", pt: "Usar minha localização", } satisfies Localized,
    locating: { es: "Buscando tu ubicación…", en: "Finding your location…", pt: "Localizando você…", } satisfies Localized,
    denied: {
      es: "No pudimos acceder a tu ubicación. Puedes seguir buscando por nombre o ciudad.",
      en: "We couldn't access your location. You can still search by name or city.",
      pt: "Não conseguimos acessar sua localização. Você ainda pode buscar por nome ou cidade.",
    } satisfies Localized,
    unit: { es: "km", en: "km", pt: "km", } satisfies Localized,
  },

  cities: {
    title: { es: "Cobertura por ciudad", en: "Coverage by city", pt: "Cobertura por cidade", } satisfies Localized,
    lead: {
      es: "La red crece por corredores y ciudades. Explora dónde estamos hoy.",
      en: "The network grows by corridors and cities. Explore where we are today.",
      pt: "A rede cresce por corredores e cidades. Veja onde estamos hoje.",
    } satisfies Localized,
  },

  howToCharge: {
    eyebrow: { es: "Cómo cargar", en: "How to charge", pt: "Como carregar", } satisfies Localized,
    title: { es: "Tres pasos y sigues tu día", en: "Three steps and you're on your way", pt: "Três passos e você já está carregando", } satisfies Localized,
    steps: [
      {
        step: "01",
        title: { es: "Encuentra", en: "Find", pt: "Buscar", } satisfies Localized,
        body: {
          es: "Ubica una estación con el conector y la potencia que necesita tu vehículo.",
          en: "Locate a station with the connector and power your vehicle needs.",
          pt: "Localize uma estação com o conector e a potência que o seu veículo precisa.",
        } satisfies Localized,
      },
      {
        step: "02",
        title: { es: "Conecta", en: "Connect", pt: "Conectar", } satisfies Localized,
        body: {
          es: "Enchufa e inicia la carga desde la app. No necesitas tarjeta ni membresía.",
          en: "Plug in and start charging from the app. No card or membership needed.",
          pt: "Conecte e comece a carregar pelo aplicativo. Sem cartão nem assinatura.",
        } satisfies Localized,
      },
      {
        step: "03",
        title: { es: "Sigue", en: "Go", pt: "Ir", } satisfies Localized,
        body: {
          es: "Consulta el progreso desde el teléfono mientras haces lo que ibas a hacer.",
          en: "Track progress from your phone while you get on with your day.",
          pt: "Acompanhe o progresso pelo celular enquanto segue com o seu dia.",
        } satisfies Localized,
      },
    ],
  },

  faq: {
    eyebrow: { es: "Preguntas frecuentes", en: "FAQ", pt: "Perguntas frequentes", } satisfies Localized,
    /* El titular sigue al contenido: la última pregunta es sobre ayuda
       DURANTE una carga, así que "antes de cargar" dejaba fuera parte de lo
       que hay debajo. La fórmula recoge el arco entero y toma prestada la
       cadencia de la propia respuesta 5. */
    title: {
      es: "Antes, durante y después de cargar",
      en: "Before, during and after a charge",
      pt: "Antes, durante e depois de carregar",
    } satisfies Localized,
  },

  hostHandoff: {
    title: { es: "¿Tienes un espacio con parqueadero?", en: "Do you have a space with parking?", pt: "Você tem um espaço com estacionamento?", } satisfies Localized,
    body: {
      es: "Hoteles, centros comerciales, campus y edificios corporativos: instalamos y operamos la carga sin inversión inicial de tu parte.",
      en: "Hotels, malls, campuses and corporate buildings: we install and operate the charging with no upfront investment on your side.",
      pt: "Hotéis, shoppings, campi e prédios corporativos: instalamos e operamos o carregamento sem investimento inicial da sua parte.",
    } satisfies Localized,
  },
};

export const city = {
  eyebrow: { es: "Cobertura", en: "Coverage", pt: "Cobertura", } satisfies Localized,
  titlePrefix: { es: "Cargar en", en: "Charging in", pt: "Carregar em", } satisfies Localized,
  metaTitlePattern: { es: "Estaciones de carga en", en: "Charging stations in", pt: "Estações de carregamento em", } satisfies Localized,
  stationsHere: { es: "Estaciones en esta ciudad", en: "Stations in this city", pt: "Estações nesta cidade", } satisfies Localized,
  otherCities: { es: "Otras ciudades", en: "Other cities", pt: "Outras cidades", } satisfies Localized,
};

export const station = {
  eyebrow: { es: "Estación", en: "Station", pt: "Estação", } satisfies Localized,
  specs: {
    title: { es: "Ficha técnica", en: "Specifications", pt: "Ficha técnica", } satisfies Localized,
    power: { es: "Potencia máxima", en: "Maximum power", pt: "Potência máxima", } satisfies Localized,
    points: { es: "Puntos de carga", en: "Charging points", pt: "Pontos de carregamento", } satisfies Localized,
    connectors: { es: "Conectores", en: "Connectors", pt: "Conectores", } satisfies Localized,
    hours: { es: "Horario", en: "Hours", pt: "Horário", } satisfies Localized,
    pricing: { es: "Tarifa", en: "Pricing", pt: "Tarifa", } satisfies Localized,
  },
  services: { es: "Servicios del lugar", en: "On-site amenities", pt: "Comodidades do local", } satisfies Localized,
  location: { es: "Ubicación", en: "Location", pt: "Localização", } satisfies Localized,
  nearby: { es: "Otras estaciones cerca", en: "Other stations nearby", pt: "Outras estações por perto", } satisfies Localized,
  /** Honestidad de datos: se declara qué falta y por qué (§33). */
  pendingGeo: {
    es: "Coordenadas pendientes de confirmación: el enlace abre una búsqueda por dirección.",
    en: "Coordinates pending confirmation: the link opens a search by address.",
    pt: "Coordenadas pendentes de confirmação: o link abre uma busca por endereço.",
  } satisfies Localized,
  /**
   * Etiqueta CORTA. Antes esta cadena entera vivía dentro de un `PendingTag`:
   * una frase con punto final, en mayúsculas y en mono, dentro de un recuadro
   * de 11px. Un tag lleva una etiqueta; la frase va debajo como nota.
   */
  pendingPricingTag: { es: "Pendiente", en: "Pending", pt: "Pendente", } satisfies Localized,
  pendingPricing: {
    es: "Tarifa pendiente de confirmación comercial.",
    en: "Pricing pending commercial confirmation.",
    pt: "Tarifa pendente de confirmação comercial.",
  } satisfies Localized,
};

/* ---------------------------------------------------------------- */
/* Metadatos generados desde datos                                   */
/* ---------------------------------------------------------------- */

export type StationMetaVars = {
  city: string;
  powerKw: number;
  points: number;
  connectors: string;
};

/**
 * DESCRIPCIÓN SEO DE CADA ESTACIÓN.
 *
 * Vivía como ternario `lang === "es" ? … : …` DENTRO de la página. Un ternario
 * no tiene tercera rama: con un idioma más habría servido la descripción en
 * INGLÉS a todo lo que no fuera español —en silencio y en cada estación del
 * sitio—, que es justo el fallo que la capa de copy existe para impedir
 * (§36.15). Como par `Localized` de plantillas, el idioma que falte es un
 * error de tipos, no un texto equivocado en producción.
 *
 * Es una FUNCIÓN y no una cadena con huecos porque cada idioma ordena la
 * frase a su manera: la traducción no puede reducirse a rellenar espacios.
 */
export const stationMeta = {
  description: {
    es: (v: StationMetaVars) =>
      `Estación de carga Voltop en ${v.city}: ${v.powerKw} kW, ${v.points} puntos y conectores ${v.connectors}.`,
    en: (v: StationMetaVars) =>
      `Voltop charging station in ${v.city}: ${v.powerKw} kW, ${v.points} points and ${v.connectors} connectors.`,
    pt: (v: StationMetaVars) =>
      `Estação de carregamento Voltop em ${v.city}: ${v.powerKw} kW, ${v.points} pontos e conectores ${v.connectors}.`,
  } satisfies Localized<(v: StationMetaVars) => string>,
};
