import type { Localized } from '~/core/common/domain/i18n/config'

/**
 * COPY · Network, City and Station
 *
 * /red is a PRODUCT SURFACE, not a narrative (§14).
 * Its job is to find a station. The headline does not promise capabilities the
 * page does not have: "in real time" was removed because there is no
 * availability integration (§19: a headline is a contract).
 */

export const red = {
  meta: {
    title: {
      es: 'Red de carga',
      en: 'Charging network',
      pt: 'Rede de carregamento',
    } satisfies Localized,
    description: {
      es: 'Encuentra estaciones de carga Voltop en Colombia: ubicación, conectores, potencia y servicios de cada estación.',
      en: 'Find Voltop charging stations across Colombia: location, connectors, power and amenities for each station.',
      pt: 'Encontre as estações de carregamento Voltop em toda a Colômbia: localização, conectores, potência e comodidades de cada estação.',
    } satisfies Localized,
  },

  hero: {
    eyebrow: { es: 'La red', en: 'The network', pt: 'A rede' } satisfies Localized,
    title: {
      es: 'Encuentra dónde cargar',
      en: 'Find where to charge',
      pt: 'Encontre onde carregar',
    } satisfies Localized,
    lead: {
      /* It used to describe the interface the user is already looking at. It
         now keeps the usage hint and adds a concrete fact: precision is what
         sounds like a technical company. The figures are the same ones
         `getNetworkSummary` computes; if they diverge, the dataset wins. */
      /* No hand-written figures. The power range changes with every station
         that comes in, and this text already went stale once: it said "from
         60 to 150 kW" when the real network goes from 22 to 80. The exact
         figures live on each station's page, generated from the dataset. */
      es: 'Filtra por ciudad, conector y potencia. Cada ficha indica cuántos puntos tiene y a qué potencia cargan.',
      en: 'Filter by city, connector and power. Each station shows how many points it has and at what power they charge.',
      pt: 'Filtre por cidade, conector e potência. Cada ficha indica quantos pontos tem e em que potência carregam.',
    } satisfies Localized,
  },

  search: {
    label: {
      es: 'Buscar estación o ciudad',
      en: 'Search station or city',
      pt: 'Buscar estação ou cidade',
    } satisfies Localized,
    placeholder: {
      es: 'Ej.: Medellín, Grand Hyatt…',
      en: 'E.g.: Medellín, Grand Hyatt…',
      pt: 'Ex.: Medellín, Grand Hyatt…',
    } satisfies Localized,
    clear: { es: 'Limpiar búsqueda', en: 'Clear search', pt: 'Limpar busca' } satisfies Localized,
  },

  filters: {
    /** Group label. The chip inside says what it does; the group, what it is about. */
    /* This used to be called "Disponibilidad", which is exactly the capability
       this same page declares as not integrated two sections further up. The
       chip inside says "Solo en operación", which is a STATUS. */
    availabilityGroup: { es: 'Estado', en: 'Status', pt: 'Status' } satisfies Localized,
    city: { es: 'Ciudad', en: 'City', pt: 'Cidade' } satisfies Localized,
    connector: { es: 'Conector', en: 'Connector', pt: 'Conector' } satisfies Localized,
    power: {
      es: 'Potencia mínima',
      en: 'Minimum power',
      pt: 'Potência mínima',
    } satisfies Localized,
    availability: {
      es: 'Solo en operación',
      en: 'Live stations only',
      pt: 'Somente estações em operação',
    } satisfies Localized,
    all: { es: 'Todas', en: 'All', pt: 'Tudo' } satisfies Localized,
    allM: { es: 'Todos', en: 'All', pt: 'Tudo' } satisfies Localized,
    clear: { es: 'Quitar filtros', en: 'Clear filters', pt: 'Limpar filtros' } satisfies Localized,
    resultsOne: { es: 'estación', en: 'station', pt: 'estação' } satisfies Localized,
    resultsMany: { es: 'estaciones', en: 'stations', pt: 'estações' } satisfies Localized,
    /** Button that expands the filters on mobile. */
    toggle: { es: 'Filtros', en: 'Filters', pt: 'Filtros' } satisfies Localized,
    toggleHide: {
      es: 'Ocultar filtros',
      en: 'Hide filters',
      pt: 'Ocultar filtros',
    } satisfies Localized,
    activeCount: { es: 'activos', en: 'active', pt: 'ativas' } satisfies Localized,
  },

  /**
   * SORTING. It makes up for the missing "by distance" with criteria the
   * dataset CAN answer today. `distance` is only offered if there are
   * coordinates.
   */
  sort: {
    label: { es: 'Ordenar por', en: 'Sort by', pt: 'Ordenar por' } satisfies Localized,
    /* "Recomendadas" implies personalisation or a recommendation engine that
       does not exist: the data-access layer documents this as the dataset's
       curated order (§19). */
    relevance: { es: 'Destacadas', en: 'Featured', pt: 'Destaques' } satisfies Localized,
    power: { es: 'Más potencia', en: 'Highest power', pt: 'Maior potência' } satisfies Localized,
    status: {
      es: 'En operación primero',
      en: 'Live first',
      pt: 'Em operação primeiro',
    } satisfies Localized,
    city: { es: 'Ciudad', en: 'City', pt: 'Cidade' } satisfies Localized,
    distance: {
      es: 'Más cerca de mí',
      en: 'Closest to me',
      pt: 'Mais perto de mim',
    } satisfies Localized,
  },

  /**
   * PROXIMITY. This whole branch is conditional on the dataset carrying `geo`:
   * if no station has coordinates, nothing is offered — the same way
   * `MetricRow` does not render unvalidated metrics (§33). It is not dead
   * code: it switches itself on when the coordinates arrive.
   */
  nearby: {
    action: {
      es: 'Usar mi ubicación',
      en: 'Use my location',
      pt: 'Usar minha localização',
    } satisfies Localized,
    locating: {
      es: 'Buscando tu ubicación…',
      en: 'Finding your location…',
      pt: 'Localizando você…',
    } satisfies Localized,
    denied: {
      es: 'No pudimos acceder a tu ubicación. Puedes seguir buscando por nombre o ciudad.',
      en: "We couldn't access your location. You can still search by name or city.",
      pt: 'Não conseguimos acessar sua localização. Você ainda pode buscar por nome ou cidade.',
    } satisfies Localized,
    unit: { es: 'km', en: 'km', pt: 'km' } satisfies Localized,
  },

  cities: {
    title: {
      es: 'Cobertura por ciudad',
      en: 'Coverage by city',
      pt: 'Cobertura por cidade',
    } satisfies Localized,
    lead: {
      es: 'La red crece por corredores y ciudades. Explora dónde estamos hoy.',
      en: 'The network grows by corridors and cities. Explore where we are today.',
      pt: 'A rede cresce por corredores e cidades. Veja onde estamos hoje.',
    } satisfies Localized,
  },

  howToCharge: {
    eyebrow: { es: 'Cómo cargar', en: 'How to charge', pt: 'Como carregar' } satisfies Localized,
    /* The Portuguese promised something different ("and you're already
       charging") from the Spanish and the English ("and you get on with your
       day"). The promise is now the same in all three. */
    title: {
      es: 'Tres pasos y sigues tu día',
      en: "Three steps and you're on your way",
      pt: 'Três passos e você segue o seu dia',
    } satisfies Localized,
    steps: [
      {
        step: '01',
        title: { es: 'Encuentra', en: 'Find', pt: 'Buscar' } satisfies Localized,
        body: {
          es: 'Ubica una estación con el conector y la potencia que necesita tu vehículo.',
          en: 'Locate a station with the connector and power your vehicle needs.',
          pt: 'Localize uma estação com o conector e a potência que o seu veículo precisa.',
        } satisfies Localized,
      },
      {
        step: '02',
        title: { es: 'Conecta', en: 'Connect', pt: 'Conectar' } satisfies Localized,
        body: {
          es: 'Enchufa e inicia la carga desde la app. No necesitas tarjeta ni membresía.',
          en: 'Plug in and start charging from the app. No card or membership needed.',
          pt: 'Conecte e comece a carregar pelo aplicativo. Sem cartão nem assinatura.',
        } satisfies Localized,
      },
      {
        step: '03',
        /* "Sigue" on its own is ambiguous in Spanish (follow what?), and the
           three languages were saying different things. The body copy already
           says exactly this. */
        title: {
          es: 'Sigue tu día',
          en: 'Get on with your day',
          pt: 'Siga o seu dia',
        } satisfies Localized,
        body: {
          es: 'Consulta el progreso desde el teléfono mientras haces lo que ibas a hacer.',
          en: 'Track progress from your phone while you get on with your day.',
          pt: 'Acompanhe o progresso pelo celular enquanto segue com o seu dia.',
        } satisfies Localized,
      },
    ],
  },

  faq: {
    eyebrow: {
      es: 'Preguntas frecuentes',
      en: 'FAQ',
      pt: 'Perguntas frequentes',
    } satisfies Localized,
    /* The headline follows the content: the last question is about help
       DURING a charge, so "before you charge" left out part of what sits
       below it. The wording covers the whole arc and borrows the cadence of
       answer 5 itself. */
    title: {
      es: 'Antes, durante y después de cargar',
      en: 'Before, during and after a charge',
      pt: 'Antes, durante e depois de carregar',
    } satisfies Localized,
  },

  hostHandoff: {
    title: {
      es: '¿Tienes un espacio con parqueadero?',
      en: 'Do you have a space with parking?',
      pt: 'Você tem um espaço com estacionamento?',
    } satisfies Localized,
    body: {
      es: 'Hoteles, centros comerciales, campus y edificios corporativos: instalamos y operamos la carga sin inversión inicial de tu parte.',
      en: 'Hotels, malls, campuses and corporate buildings: we install and operate the charging with no upfront investment on your side.',
      pt: 'Hotéis, shoppings, campi e prédios corporativos: instalamos e operamos o carregamento sem investimento inicial da sua parte.',
    } satisfies Localized,
  },
}

export const city = {
  eyebrow: { es: 'Cobertura', en: 'Coverage', pt: 'Cobertura' } satisfies Localized,
  titlePrefix: { es: 'Cargar en', en: 'Charging in', pt: 'Carregar em' } satisfies Localized,
  metaTitlePattern: {
    es: 'Estaciones de carga en',
    en: 'Charging stations in',
    pt: 'Estações de carregamento em',
  } satisfies Localized,
  stationsHere: {
    es: 'Estaciones en esta ciudad',
    en: 'Stations in this city',
    pt: 'Estações nesta cidade',
  } satisfies Localized,
  otherCities: {
    es: 'Otras ciudades',
    en: 'Other cities',
    pt: 'Outras cidades',
  } satisfies Localized,
}

export const station = {
  eyebrow: { es: 'Estación', en: 'Station', pt: 'Estação' } satisfies Localized,
  specs: {
    title: { es: 'Ficha técnica', en: 'Specifications', pt: 'Ficha técnica' } satisfies Localized,
    power: {
      es: 'Potencia máxima',
      en: 'Maximum power',
      pt: 'Potência máxima',
    } satisfies Localized,
    points: {
      es: 'Puntos de carga',
      en: 'Charging points',
      pt: 'Pontos de carregamento',
    } satisfies Localized,
    connectors: { es: 'Conectores', en: 'Connectors', pt: 'Conectores' } satisfies Localized,
    hours: { es: 'Horario', en: 'Hours', pt: 'Horário' } satisfies Localized,
    pricing: { es: 'Tarifa', en: 'Pricing', pt: 'Tarifa' } satisfies Localized,
  },
  services: {
    es: 'Servicios del lugar',
    en: 'On-site amenities',
    pt: 'Comodidades do local',
  } satisfies Localized,
  location: { es: 'Ubicación', en: 'Location', pt: 'Localização' } satisfies Localized,
  nearby: {
    es: 'Otras estaciones cerca',
    en: 'Other stations nearby',
    pt: 'Outras estações por perto',
  } satisfies Localized,
  /** Data honesty: what is missing and why is stated outright (§33). */
  pendingGeo: {
    es: 'Coordenadas pendientes de confirmación: el enlace abre una búsqueda por dirección.',
    en: 'Coordinates pending confirmation: the link opens a search by address.',
    pt: 'Coordenadas pendentes de confirmação: o link abre uma busca por endereço.',
  } satisfies Localized,
  /**
   * SHORT label. This entire string used to live inside a `PendingTag`: a
   * sentence with a full stop, uppercased and in mono, inside an 11px box. A
   * tag carries a label; the sentence goes below it as a note.
   */
  pendingPricingTag: { es: 'Pendiente', en: 'Pending', pt: 'Pendente' } satisfies Localized,
  pendingPricing: {
    /* "Commercial confirmation" is our backlog's vocabulary put in front of
       someone who just wants to know what it costs. The "Pendiente" label
       stays; the text now gives the next step, the same way FAQ answer 3
       does. */
    es: 'Todavía no publicamos la tarifa de esta estación. La ves en la app antes de iniciar la carga.',
    en: "We haven't published this station's rate yet. You'll see it in the app before you start charging.",
    pt: 'Ainda não publicamos a tarifa desta estação. Você a vê no app antes de iniciar o carregamento.',
  } satisfies Localized,
}

/* ---------------------------------------------------------------- */
/* Metadata generated from data                                      */
/* ---------------------------------------------------------------- */

export type StationMetaVars = {
  city: string
  /** Already formatted: "22–80 kW" or "30 kW". */
  powerKw: string
  points: number
  connectors: string
}

/**
 * SEO DESCRIPTION FOR EACH STATION.
 *
 * This used to be a `locale === "es" ? … : …` ternary INSIDE the page. A
 * ternary has no third branch: with one more language it would have served the
 * ENGLISH description to everything that was not Spanish —silently, and on
 * every station of the site— which is exactly the failure the copy layer
 * exists to prevent (§36.15). As a `Localized` set of templates, a missing
 * language is a type error, not the wrong text in production.
 *
 * It is a FUNCTION and not a string with placeholders because each language
 * orders the sentence its own way: translation cannot be reduced to filling
 * in blanks.
 */
export const stationMeta = {
  description: {
    es: (v: StationMetaVars) =>
      `Estación de carga Voltop en ${v.city}: ${v.powerKw}, ${v.points} puntos y conectores ${v.connectors}.`,
    en: (v: StationMetaVars) =>
      `Voltop charging station in ${v.city}: ${v.powerKw}, ${v.points} points and ${v.connectors} connectors.`,
    pt: (v: StationMetaVars) =>
      `Estação de carregamento Voltop em ${v.city}: ${v.powerKw}, ${v.points} pontos e conectores ${v.connectors}.`,
  } satisfies Localized<(v: StationMetaVars) => string>,
}
