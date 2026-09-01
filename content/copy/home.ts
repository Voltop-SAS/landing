import type { Localized } from "@/lib/i18n/config";

/**
 * COPY · Home
 *
 * Narrativa de 7 beats. Ver docs/MASTER-PROJECT-DEFINITION.md §14 y §12.
 *
 * REGLA COMPOSITIVA: dos beats consecutivos NO comparten estructura.
 * La secuencia estructural es deliberada y está anotada en cada beat:
 *   1 full-bleed · 2 sticky scrub · 3 índice ancho · 4 columna estrecha
 *   5 full-bleed con texto encima · 6 columna estrecha editorial · 7 asimétrico
 *
 * La Home PRESENTA. Ninguna sección resuelve aquí lo que resuelve una interna.
 */

export const home = {
  meta: {
    title: {
      es: "Voltop · La red de carga que mueve a Colombia",
      en: "Voltop · The charging network that moves Colombia",
      pt: "Voltop · A rede de carregamento que move a Colômbia",
    } satisfies Localized,
    description: {
      es: "Infraestructura de carga para vehículos eléctricos en Colombia. Encuentra dónde cargar y descubre soluciones para empresas, flotas y espacios comerciales.",
      en: "EV charging infrastructure in Colombia. Find where to charge and explore solutions for companies, fleets and commercial spaces.",
      pt: "Infraestrutura de carregamento elétrico na Colômbia. Encontre onde carregar e conheça as soluções para empresas, frotas e espaços comerciais.",
    } satisfies Localized,
  },

  /* BEAT 1 · HERO — full-bleed sobre infraestructura real. Intensidad: Alta */
  hero: {
    eyebrow: { es: "Red de carga eléctrica · Colombia", en: "EV charging network · Colombia", pt: "Rede de carregamento elétrico · Colômbia", } satisfies Localized,
    title: { es: "La red que mueve a Colombia", en: "The network that moves Colombia", pt: "A rede que move a Colômbia", } satisfies Localized,
    lead: {
      es: "Construimos y operamos la infraestructura de carga que hace posible el cambio a eléctrico: para quien conduce hoy y para quien todavía lo está pensando.",
      en: "We build and operate the charging infrastructure that makes going electric possible — for those already driving, and for those still deciding.",
      pt: "Construímos e operamos a infraestrutura de carregamento que torna possível ir de elétrico — para quem já dirige e para quem ainda está decidindo.",
    } satisfies Localized,
    scrollHint: { es: "Desplázate", en: "Scroll", pt: "Deslize", } satisfies Localized,
  },

  /* BEAT 2 · MEDELLÍN — sticky con scroll-scrub. Intensidad: MUY ALTA */
  infrastructure: {
    eyebrow: { es: "Infraestructura real", en: "Real infrastructure", pt: "Infraestrutura real", } satisfies Localized,
    title: { es: "No instalamos cargadores. Construimos lugares.", en: "We don't install chargers. We build places.", pt: "Não instalamos carregadores. Construímos lugares.", } satisfies Localized,
    lead: {
      es: "Cada estación se diseña como un lugar donde detenerse tiene sentido: acceso, cubierta, iluminación, servicios y potencia suficiente para que la parada sea corta.",
      en: "Every station is designed as a place where stopping makes sense: access, shelter, lighting, amenities and enough power to keep the stop short.",
      pt: "Cada estação é projetada como um lugar onde parar faz sentido: acesso, cobertura, iluminação, comodidades e potência suficiente para encurtar a parada.",
    } satisfies Localized,
    /** El video llega en la clave `estacionMedellin` del registro de media. */
    caption: { es: "Nueva estación · Medellín", en: "New station · Medellín", pt: "Nova estação · Medellín", } satisfies Localized,
  },

  /* BEAT 3 · RED — índice ancho, lenguaje de ficha técnica. Intensidad: Media */
  network: {
    eyebrow: { es: "La red", en: "The network", pt: "A rede", } satisfies Localized,
    title: { es: "Ya está en la calle", en: "Already on the road", pt: "Já nas ruas", } satisfies Localized,
    lead: {
      es: "Estaciones en operación en puntos donde la gente ya se detiene: universidades, hoteles, centros comerciales y corredores de salida.",
      en: "Stations live in places where people already stop: universities, hotels, shopping centers and exit corridors.",
      pt: "Estações em operação em lugares onde as pessoas já param: universidades, hotéis, shoppings e corredores de saída.",
    } satisfies Localized,
    columns: {
      station: { es: "Estación", en: "Station", pt: "Estação", } satisfies Localized,
      city: { es: "Ciudad", en: "City", pt: "Cidade", } satisfies Localized,
      power: { es: "Potencia", en: "Power", pt: "Potência", } satisfies Localized,
      status: { es: "Estado", en: "Status", pt: "Status", } satisfies Localized,
    },
  },

  /* BEAT 4 · EMPRESAS — columna estrecha, respiración. Intensidad: Media-baja */
  business: {
    eyebrow: { es: "Empresas y espacios", en: "Business and spaces", pt: "Empresas e espaços", } satisfies Localized,
    title: {
      es: "La misma infraestructura, dentro de tu negocio",
      en: "The same infrastructure, inside your business",
      pt: "A mesma infraestrutura, dentro do seu negócio",
    } satisfies Localized,
    lead: {
      es: "Instalamos, operamos y mantenemos. Tu empresa, tu flota o tu espacio suma carga eléctrica sin convertirse en operador de energía.",
      en: "We install, operate and maintain. Your company, fleet or property gains EV charging without becoming an energy operator.",
      pt: "Instalamos, operamos e mantemos. Sua empresa, frota ou espaço ganha carregamento elétrico sem virar uma operadora de energia.",
    } satisfies Localized,
  },

  /* BEAT 5 · CASO REAL — full-bleed con la cita encima. Intensidad: Alta */
  proof: {
    eyebrow: { es: "Caso real", en: "Real case", pt: "Caso real", } satisfies Localized,
    title: { es: "Universidad EAN", en: "EAN University", pt: "Universidade EAN", } satisfies Localized,
  },

  /* BEAT 6 · VISIÓN — columna estrecha editorial. Intensidad: Media-alta */
  vision: {
    eyebrow: { es: "Visión", en: "Vision", pt: "Visão", } satisfies Localized,
  },

  /* BEAT 7 · CIERRE — asimétrico, dos audiencias. Intensidad: Alta */
  close: {
    title: { es: "Conecta con la red", en: "Connect to the network", pt: "Conecte-se à rede", } satisfies Localized,
    b2c: {
      label: { es: "Conduzco eléctrico", en: "I drive electric", pt: "Dirijo um elétrico", } satisfies Localized,
      body: { es: "Encuentra dónde cargar en la red Voltop.", en: "Find where to charge across the Voltop network.", pt: "Encontre onde carregar em toda a rede Voltop.", } satisfies Localized,
    },
    b2b: {
      label: { es: "Represento una empresa o un espacio", en: "I represent a company or a space", pt: "Represento uma empresa ou um espaço", } satisfies Localized,
      body: { es: "Cuéntanos tu caso y te proponemos una solución.", en: "Tell us your case and we'll propose a solution.", pt: "Conte o seu caso e propomos uma solução.", } satisfies Localized,
    },
  },
};
