import type { Localized } from "@/lib/i18n/config";

/**
 * COPY · Nosotros
 *
 * Objetivo: credibilidad. Historia, escala, infraestructura, liderazgo, impacto.
 * Es la página donde vive el detalle que la Home solo insinúa (§14).
 *
 * Nota de contenido: los hitos de la historia describen la naturaleza del
 * recorrido sin fechas ni cifras inventadas. Se completan cuando el negocio
 * entregue los datos (decisión abierta O6).
 */

export const nosotros = {
  meta: {
    title: { es: "Nosotros · Voltop", en: "About us · Voltop" } satisfies Localized,
    description: {
      es: "Voltop construye y opera la infraestructura de carga para vehículos eléctricos de Colombia. Nuestra historia, nuestra red y el equipo detrás.",
      en: "Voltop builds and operates Colombia's EV charging infrastructure. Our story, our network and the team behind it.",
    } satisfies Localized,
  },

  hero: {
    eyebrow: { es: "Nosotros", en: "About us" } satisfies Localized,
    title: {
      es: "Infraestructura para un país que se está electrificando",
      en: "Infrastructure for a country going electric",
    } satisfies Localized,
    lead: {
      es: "Voltop existe porque la transición eléctrica de Colombia no depende de los vehículos, sino de dónde se cargan. Construimos esa parte.",
      en: "Voltop exists because Colombia's electric transition doesn't depend on the vehicles, but on where they charge. We build that part.",
    } satisfies Localized,
  },

  story: {
    eyebrow: { es: "Historia", en: "Story" } satisfies Localized,
    title: { es: "Empezamos por lo difícil", en: "We started with the hard part" } satisfies Localized,
    body: [
      {
        es: "Instalar un cargador es sencillo. Sostener una red que funcione todos los días —con potencia real, disponible, mantenida y en sitios donde la gente ya se detiene— es otra cosa.",
        en: "Installing a charger is simple. Sustaining a network that works every day — with real power, available, maintained, and in places where people already stop — is another matter.",
      },
      {
        es: "Voltop se construyó alrededor de esa diferencia: operar, no solo instalar. Por eso cada estación es un compromiso de largo plazo con el lugar que la aloja y con quien la usa.",
        en: "Voltop was built around that difference: to operate, not just install. That's why every station is a long-term commitment to the place that hosts it and to the people who use it.",
      },
    ] satisfies Localized[],
  },

  infrastructure: {
    eyebrow: { es: "Cómo construimos", en: "How we build" } satisfies Localized,
    title: { es: "Criterios que no negociamos", en: "Criteria we don't negotiate" } satisfies Localized,
    pillars: [
      {
        title: { es: "El lugar antes que el equipo", en: "The place before the hardware" } satisfies Localized,
        body: {
          es: "Elegimos ubicaciones donde detenerse ya tiene sentido. Un cargador en un sitio equivocado no se usa, por bueno que sea.",
          en: "We choose locations where stopping already makes sense. A charger in the wrong place goes unused, however good it is.",
        } satisfies Localized,
      },
      {
        title: { es: "Potencia que corresponde al uso", en: "Power matched to usage" } satisfies Localized,
        body: {
          es: "La velocidad se dimensiona según cuánto tiempo va a estar allí el vehículo, no según lo que suene mejor en una ficha.",
          en: "Speed is sized around how long the vehicle will actually be there, not around what sounds best on a spec sheet.",
        } satisfies Localized,
      },
      {
        title: { es: "Operación propia", en: "In-house operation" } satisfies Localized,
        body: {
          es: "Monitoreamos, mantenemos y respondemos nosotros. La disponibilidad es la promesa central del negocio.",
          en: "We monitor, maintain and respond ourselves. Availability is the core promise of the business.",
        } satisfies Localized,
      },
      {
        title: { es: "Diseñada para crecer", en: "Built to grow" } satisfies Localized,
        body: {
          es: "Cada sitio se proyecta con capacidad para ampliarse cuando la demanda lo pida, sin rehacer la instalación.",
          en: "Every site is planned with room to expand when demand calls for it, without redoing the installation.",
        } satisfies Localized,
      },
    ],
  },

  impact: {
    eyebrow: { es: "Impacto", en: "Impact" } satisfies Localized,
    title: { es: "Una red que crece con el país", en: "A network growing with the country" } satisfies Localized,
    lead: {
      es: "Estas son las cifras con las que medimos nuestro avance.",
      en: "These are the figures by which we measure our progress.",
    } satisfies Localized,
    /** Estado honesto mientras las cifras no estén validadas (§33). */
    pendingTitle: { es: "Cifras en validación", en: "Figures under validation" } satisfies Localized,
    pendingBody: {
      es: "Estamos consolidando y verificando los datos de operación antes de publicarlos. Preferimos no publicar una cifra a publicar una imprecisa.",
      en: "We're consolidating and verifying operational data before publishing it. We'd rather publish no figure than an inaccurate one.",
    } satisfies Localized,
  },

  leadership: {
    eyebrow: { es: "Liderazgo", en: "Leadership" } satisfies Localized,
    title: { es: "Quién está detrás", en: "Who's behind it" } satisfies Localized,
  },

  trust: {
    eyebrow: { es: "Confianza", en: "Trust" } satisfies Localized,
    title: { es: "Lo que dicen quienes ya trabajan con nosotros", en: "What those already working with us say" } satisfies Localized,
    partnersTitle: { es: "Espacios y organizaciones aliadas", en: "Partner spaces and organizations" } satisfies Localized,
  },
};
