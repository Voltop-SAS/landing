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
      /* Still NO hand-written figures: the power range changes with every
         station that comes in, and this text already went stale once — it said
         "from 60 to 150 kW" when the real network goes from 22 to 80.

         ⚠️ BUT THE CITIES ARE NOW HAND-WRITTEN. "Bogotá y Medellín" is the same
         class of risk as those figures: the day a third city opens, this
         sentence says the network has two and nobody gets an error. The city
         list DOES exist computed, in `getNetworkSummary()`, and the Home reads
         it from there.

         It stays literal by an editorial decision of 2026-09-08: naming the two
         cities is what tells a visitor whether the network reaches them, and a
         generated list reads like a system message. **Whoever opens the third
         city has to come back to this string.** */
      es: 'Explora las estaciones de carga Voltop en Bogotá y Medellín. Filtra por ciudad, tipo de conector y potencia para encontrar la opción que necesitas.',
      en: 'Explore Voltop charging stations in Bogotá and Medellín. Filter by city, connector type and power to find the option you need.',
      pt: 'Explore as estações de carregamento Voltop em Bogotá e Medellín. Filtre por cidade, tipo de conector e potência para encontrar a opção que precisa.',
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
      /* ⚠️ The cities are hand-written here, same as in `hero.lead`. The day a
         third one opens, this sentence says there are two and nothing breaks.
         `getCitiesWithStations()` returns the real list; the editorial decision
         of 2026-09-08 is to name them because that is what tells a visitor
         whether the network reaches them. Whoever opens the third city comes
         back to BOTH strings. */
      es: 'Nuestra red de carga está presente en Bogotá y Medellín. Conoce las estaciones disponibles en cada ciudad.',
      en: 'Our charging network covers Bogotá and Medellín. See the stations available in each city.',
      pt: 'Nossa rede de carregamento está em Bogotá e Medellín. Conheça as estações disponíveis em cada cidade.',
    } satisfies Localized,

    /* THE BLURB ON EACH CARD IS A TEMPLATE, NOT A SENTENCE.
       It used to be `city.intro`, written by hand per city, and Medellín's read
       "con 80 kW y seis puntos de carga" — three figures typed into prose. The
       moment a station comes in, the card lies and nobody gets an error. Now the
       three numbers come from `getCitiesWithStations()`.

       Two variants because Spanish and Portuguese change more than the noun: with
       one station it is "una potencia", with several "potencias". Rebuilding that
       with a generic pluraliser would produce "1 estaciones de carga", which is
       exactly the kind of seam that makes a site read as generated. */
    blurb: {
      one: {
        es: '{stations} estación de carga con {points} puntos y una potencia de hasta {kw} kW.',
        en: '{stations} charging station with {points} points and power of up to {kw} kW.',
        pt: '{stations} estação de carregamento com {points} pontos e uma potência de até {kw} kW.',
      } satisfies Localized,
      many: {
        es: '{stations} estaciones de carga con {points} puntos y potencias de hasta {kw} kW.',
        en: '{stations} charging stations with {points} points and power of up to {kw} kW.',
        pt: '{stations} estações de carregamento com {points} pontos e potências de até {kw} kW.',
      } satisfies Localized,
    },
  },

  howToCharge: {
    eyebrow: { es: 'Cómo cargar', en: 'How to charge', pt: 'Como carregar' } satisfies Localized,
    /* The headline used to count the steps —"Tres pasos y sigues tu día"— which
       is what the numbered list next to it already says. It now names the three
       verbs, so the title and the list stop repeating each other.

       The three languages once promised different things here (the Portuguese
       said "and you're already charging"); they say the same now, and that has
       to hold on every edit. */
    title: {
      es: 'Encuentra, carga y sigue tu camino',
      en: 'Find, charge and get on your way',
      pt: 'Encontre, carregue e siga seu caminho',
    } satisfies Localized,
    steps: [
      {
        step: '01',
        title: { es: 'Encuentra', en: 'Find', pt: 'Encontre' } satisfies Localized,
        body: {
          es: 'Explora la red y elige dónde cargar según la ubicación, el conector y la potencia que necesitas.',
          en: 'Explore the network and choose where to charge by location, connector and the power you need.',
          pt: 'Explore a rede e escolha onde carregar pela localização, pelo conector e pela potência que você precisa.',
        } satisfies Localized,
      },
      {
        step: '02',
        title: { es: 'Inicia tu carga', en: 'Start charging', pt: 'Inicie sua carga' } satisfies Localized,
        body: {
          /* Names the QR, which is the actual gesture at the station and the
             same one the Home describes. It dropped "No necesitas tarjeta ni
             membresía": that was a commercial claim inside an instruction, and
             an instruction that also sells stops being followable. */
          es: 'Al llegar, conecta tu carro y escanea el código QR desde la app Voltop.',
          en: 'When you arrive, plug in your car and scan the QR code from the Voltop app.',
          pt: 'Ao chegar, conecte seu carro e escaneie o código QR pelo aplicativo Voltop.',
        } satisfies Localized,
      },
      {
        step: '03',
        /* "Sigue tu carga", not "Sigue tu día": on its own "Sigue" is ambiguous
           in Spanish —follow what?— and the object is the charge, which is what
           the body then explains. The three languages said different things
           here once; they no longer do. */
        title: {
          es: 'Sigue tu carga',
          en: 'Track your charge',
          pt: 'Acompanhe sua carga',
        } satisfies Localized,
        body: {
          es: 'Consulta el progreso desde tu celular y continúa cuando estés listo.',
          en: 'Check the progress from your phone and get going when you are ready.',
          pt: 'Acompanhe o progresso pelo celular e siga quando estiver pronto.',
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
    /* It read "Antes, durante y después de cargar", which described the ARC of
       the five questions. It now says what the block is for. The previous
       wording borrowed the cadence of answer 5 —"antes, durante o después de
       una carga"— and that answer no longer says it, so the echo was gone. */
    title: {
      es: 'Todo lo que necesitas saber para cargar',
      en: 'Everything you need to know about charging',
      pt: 'Tudo o que você precisa saber para carregar',
    } satisfies Localized,
  },

  hostHandoff: {
    /* It used to ASK —"¿Tienes un espacio con parqueadero?"— which qualifies
       the reader before offering anything. It now states what that space can
       become, which is the same handoff without the checkpoint. */
    title: {
      es: 'Tu espacio puede ser parte de la red Voltop',
      en: 'Your space can be part of the Voltop network',
      pt: 'Seu espaço pode fazer parte da rede Voltop',
    } satisfies Localized,
    body: {
      /* It DROPPED "sin inversión inicial de tu parte". That was a commercial
         condition stated on a page that does not negotiate, and §19 does not
         allow a headline promising terms the product has not confirmed. What
         replaces it —"nosotros nos encargamos de hacerlo posible"— says who
         carries the work without naming who pays for it, which is what
         /empresas is for. */
      es: 'Hoteles, centros comerciales, universidades y edificios corporativos pueden convertirse en nuevos puntos de carga y ofrecer más valor a quienes los visitan. Nosotros nos encargamos de hacerlo posible.',
      en: 'Hotels, malls, universities and corporate buildings can become new charge points and offer more value to the people who visit them. We take care of making it happen.',
      pt: 'Hotéis, shoppings, universidades e prédios corporativos podem se tornar novos pontos de carga e oferecer mais valor a quem os visita. Nós cuidamos de tornar isso possível.',
    } satisfies Localized,
  },
}

export const city = {
  eyebrow: { es: 'Cobertura', en: 'Coverage', pt: 'Cobertura' } satisfies Localized,
  titlePrefix: { es: 'Cargar en', en: 'Charging in', pt: 'Carregar em' } satisfies Localized,
  /**
   * ── LA DESCRIPCIÓN DE CADA CIUDAD ES UNA PLANTILLA ───────────────────────
   * Antes cada ciudad traía su propio texto escrito a mano en el dataset.
   * Bogotá decía «Carga en el norte, el centro financiero y los corredores de
   * salida de la ciudad, en espacios donde ya ibas a estar» — evocador y sin un
   * solo dato— y Medellín «con 80 kW y seis puntos de carga», que son TRES
   * cifras a mano en la prosa: exactamente lo que este archivo prohíbe y lo que
   * ya dejó obsoleto un texto de esta misma página, cuando decía «de 60 a 150
   * kW» y la red real iba de 22 a 80.
   *
   * Ahora las tres cifras salen de `getCitiesWithStations()`. Se ven idénticas
   * hoy y el día que entre una estación se actualizan solas.
   *
   * Dos variantes por el mismo motivo que en el beat 3 de la Home: con una sola
   * estación es «una potencia» y con varias «potencias». Un pluralizador
   * genérico produciría «1 estaciones», que es la costura que delata a un sitio
   * generado.
   */
  lead: {
    one: {
      es: 'Encuentra estaciones de carga Voltop en {city}, con {points} puntos de carga y una potencia de hasta {kw} kW.',
      en: 'Find Voltop charging stations in {city}, with {points} charge points and power of up to {kw} kW.',
      pt: 'Encontre estações de carregamento Voltop em {city}, com {points} pontos de carga e uma potência de até {kw} kW.',
    } satisfies Localized,
    many: {
      es: 'Encuentra estaciones de carga Voltop en {city}, con {points} puntos de carga y potencias de hasta {kw} kW.',
      en: 'Find Voltop charging stations in {city}, with {points} charge points and power of up to {kw} kW.',
      pt: 'Encontre estações de carregamento Voltop em {city}, com {points} pontos de carga e potências de até {kw} kW.',
    } satisfies Localized,
  },
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
   * ── DE «PENDIENTE» A «IVA INCLUIDO» (2026-09-08) ─────────────────────────
   * Este hueco lo ocupaba un `PendingTag` naranja que decía «Pendiente», con
   * una nota debajo explicando que la tarifa aún no se publicaba. Producto lo
   * sustituye por una cualificación del precio.
   *
   * ⚠️ Y HAY QUE SABERLO: la tarifa SIGUE sin publicarse. Ninguna estación
   * tiene `pricing` en el dataset, así que la ficha dice «Tarifa · IVA
   * incluido» sin ninguna cifra al lado — un matiz sobre un precio que no está.
   * Es lo pedido, no un descuido. El día que haya cifras, la rama de `pricing`
   * del componente las pinta y este texto pasa a acompañarlas, que es donde
   * cobra pleno sentido.
   */
  pricingTaxNote: { es: 'IVA incluido', en: 'VAT included', pt: 'IVA incluído' } satisfies Localized,
  pricingVaries: {
    es: 'La tarifa puede variar según la estación, el horario y el cargador.',
    en: 'The rate may vary by station, time of day and charger.',
    pt: 'A tarifa pode variar conforme a estação, o horário e o carregador.',
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
