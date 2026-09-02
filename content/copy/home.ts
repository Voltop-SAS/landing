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
      /* Es el resultado de búsqueda. Abría con "Infraestructura", que nadie
         teclea, y no nombraba ni las ciudades que sí se buscan ni la app. */
      es: "Carga rápida para carros eléctricos en Bogotá y Medellín. Encuentra estación, actívala con la app y sigue tu día. También soluciones para empresas y flotas.",
      en: "Fast charging for electric cars in Bogotá and Medellín. Find a station, start it from the app and get on with your day. Plus solutions for companies and fleets.",
      pt: "Carregamento rápido para carros elétricos em Bogotá e Medellín. Encontre uma estação, ative pelo app e siga o seu dia. E também soluções para empresas e frotas.",
    } satisfies Localized,
  },

  /* BEAT 1 · HERO — full-bleed sobre infraestructura real. Intensidad: Alta */
  hero: {
    eyebrow: { es: "Red de carga eléctrica · Colombia", en: "EV charging network · Colombia", pt: "Rede de carregamento elétrico · Colômbia", } satisfies Localized,
    title: { es: "La red que mueve a Colombia", en: "The network that moves Colombia", pt: "A rede que move a Colômbia", } satisfies Localized,
    lead: {
      /* El párrafo más leído del sitio era 100% sujeto-Voltop: no nombraba la
         app ni decía qué hace el usuario. Conserva la credibilidad de
         infraestructura, pero cierra en la persona que va a cargar. */
      es: "Carga rápida donde ya te mueves y una app que la abre con un escaneo. Nosotros construimos y operamos la red; tú solo conectas.",
      en: "Fast charging where you already go, and an app that starts it with a scan. We build and run the network; you just plug in.",
      pt: "Carregamento rápido onde você já circula e um app que inicia tudo com um escaneio. Nós construímos e operamos a rede; você só conecta.",
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
    /* Etiquetas de los agregados. Las CIFRAS no están aquí: se calculan desde
       el dataset en `getNetworkSummary`, porque una cifra escrita a mano deja
       de ser verdad en cuanto se añade una estación (§33). */
    stats: {
      points: { es: "Puntos de carga", en: "Charge points", pt: "Pontos de carga" } satisfies Localized,
      power: { es: "Potencia", en: "Power", pt: "Potência" } satisfies Localized,
      connectors: { es: "Conectores", en: "Connectors", pt: "Conectores" } satisfies Localized,
    },
    live: { es: "en operación", en: "live", pt: "em operação" } satisfies Localized,
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

  /**
   * SECCIÓN DE DESCARGA DE LA APP.
   *
   * Lo que promete está tomado de lo que los Términos y Condiciones declaran
   * como servicios de la Plataforma (§4 del documento legal): consultar
   * ubicación y disponibilidad, activar por QR, gestionar sesiones e historial.
   * No se promete nada que el documento legal no reconozca — que es la forma
   * más barata de cumplir §19 ("un titular es un contrato").
   */
  app: {
    eyebrow: { es: "La app", en: "The app", pt: "O aplicativo", } satisfies Localized,
    title: {
      es: "Cargar empieza en tu teléfono",
      en: "Charging starts on your phone",
      pt: "Carregar começa no seu celular",
    } satisfies Localized,
    lead: {
      es: "Encuentra una estación, mira si está libre y activa el cargador escaneando un QR. La sesión y sus cobros quedan ahí, sin papeles y sin llamar a nadie.",
      en: "Find a station, see whether it's free and start the charger by scanning a QR code. The session and its charges stay there — no paperwork, no phone calls.",
      pt: "Encontre uma estação, veja se está livre e ative o carregador escaneando um QR. A sessão e as cobranças ficam ali, sem papelada e sem ligar para ninguém.",
    } satisfies Localized,
    features: [
      {
        es: "Ubicación y disponibilidad de cada estación",
        en: "Location and availability of every station",
        pt: "Localização e disponibilidade de cada estação",
      },
      {
        es: "Activación por QR, sin tarjeta ni membresía",
        en: "Start by QR, no card or membership",
        pt: "Ativação por QR, sem cartão nem assinatura",
      },
      {
        es: "Historial de sesiones y cobros en un sitio",
        en: "Session history and charges in one place",
        pt: "Histórico de sessões e cobranças em um só lugar",
      },
    ] satisfies Localized[],
    qrLabel: {
      es: "Escanea para descargar",
      en: "Scan to download",
      pt: "Escaneie para baixar",
    } satisfies Localized,
    qrAlt: {
      es: "Código QR que abre la descarga de la app de Voltop",
      en: "QR code that opens the Voltop app download",
      pt: "Código QR que abre o download do aplicativo da Voltop",
    } satisfies Localized,
  },

  /** Componente flotante de descarga. */
  appFloating: {
    title: { es: "Descarga la app", en: "Get the app", pt: "Baixe o aplicativo" },
    body: {
      es: "Escanea el código y carga desde tu teléfono.",
      en: "Scan the code and charge from your phone.",
      pt: "Escaneie o código e carregue pelo seu celular.",
    },
    /* La barra móvil tiene una línea, no dos: el mensaje se dice más corto en
       lugar de recortar el de escritorio con puntos suspensivos. */
    bodyMobile: {
      es: "Carga desde tu teléfono",
      en: "Charge from your phone",
      pt: "Carregue pelo seu celular",
    },
    open: { es: "Abrir", en: "Open", pt: "Abrir" },
    dismiss: { es: "Cerrar", en: "Dismiss", pt: "Fechar" },
  },
};
