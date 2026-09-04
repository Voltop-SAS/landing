import type { Localized } from "@/lib/i18n/config";
import { routes } from "@/lib/i18n/routes";
import { externalLinks } from "@/content/data/links";

/**
 * COPY COMPARTIDO · navegación, acciones, formularios, estados y accesibilidad.
 * Ver docs/MASTER-PROJECT-DEFINITION.md §18 y §19.
 *
 * Ningún componente contiene cadenas literales de copy. Sin esta capa no hay
 * flujo de traducción, ni revisión editorial, ni ruta a un CMS.
 *
 * Tono: claro y humano · tecnológico y preciso · premium y sobrio.
 * Regla: un titular es un contrato. No se promete lo que el producto no hace.
 */

/**
 * Datos registrales de la compañía. Salen de la Política de Tratamiento de
 * Datos y de los Términos, donde constan como información pública de VOLTOP
 * S.A.S. — no son un dato interno que estemos exponiendo por decisión propia.
 *
 * Los usa `Organization` en los datos estructurados: un buscador que puede
 * verificar identidad legal, dirección y contacto trata a la marca como una
 * entidad real, no como un sitio más.
 */
export const empresa = {
  razonSocial: "VOLTOP S.A.S.",
  nit: "901.723.964-6",
  direccion: "Cra. 15 # 80-90",
  ciudad: "Bogotá",
  pais: "CO",
} as const;

export const brand = {
  name: "Voltop",
  tagline: {
    /* INTENCIÓN: alguien que no conoce Voltop tiene que entender en una línea
       qué es y qué puede hacer. Es el `<title>`, la meta description global y
       el subtítulo de la imagen Open Graph: la frase que más se repite.
       
       Iba primero como "Infraestructura de carga para la movilidad eléctrica
       de Colombia" —una clase de activo, no un producto—. La corregí a "LA red
       de carga eléctrica de Colombia" y ese artículo determinado cometía el
       mismo error que "la red líder de Colombia" que acabábamos de retirar:
       con tres estaciones, decir "la red de Colombia" es un claim de liderazgo
       disfrazado de descripción.
       
       Ahora dice qué es, dónde, y las tres cosas que el usuario hace. */
    es: "Red de carga para carros eléctricos en Colombia. La encuentras, la usas y la pagas desde la app.",
    en: "Charging network for electric cars in Colombia. Find it, use it and pay for it from the app.",
    pt: "Rede de carregamento para carros elétricos na Colômbia. Você encontra, usa e paga pelo aplicativo.",
  } satisfies Localized,
};

/**
 * NAVEGACIÓN PRINCIPAL.
 *
 * Cuatro puertas, no tres. §14 fijó tres y añadir una es la decisión más cara
 * de la arquitectura, así que va razonada:
 *
 * "Novedades" sirve a un público que hasta ahora no tenía destino. §6 lista
 * "Inversionista / prensa" y los manda a Nosotros, pero esos dos públicos no
 * preguntan "quiénes son" —eso es estático— sino "qué han hecho últimamente".
 * Son preguntas distintas, y meter la segunda dentro de la primera esconde el
 * activo que mejor responde a ambas.
 *
 * §14 ya admitió esta misma excepción antes con el nivel de ciudad, cuando
 * había razón real de contenido, intención y SEO. Aquí la hay igual.
 *
 * El orden deja las dos puertas de journey primero y el par institucional
 * —Novedades y Nosotros— adyacente al final, donde quien busca credibilidad
 * encuentra las dos cosas juntas.
 */
export const nav: { label: Localized; href: string }[] = [
  { label: { es: "Red", en: "Network", pt: "Rede", }, href: routes.red },
  { label: { es: "Empresas", en: "Business", pt: "Empresas", }, href: routes.empresas },
  { label: { es: "Novedades", en: "Newsroom", pt: "Novidades", }, href: routes.novedades },
  /* El mismo destino se llamaba "Company" en el navbar y "About us" en el
     footer, y en portugués "Companhia" — que además es la etiqueta del
     segmento B2B "Empresa". Una entrada de navegación con dos nombres es dos
     entradas para quien la lee. */
  { label: { es: "Nosotros", en: "About us", pt: "Sobre nós", }, href: routes.nosotros },
];

/**
 * CTA global CONTEXTUAL. Un solo slot que cambia por ruta.
 * En /red no hay CTA: el usuario ya está en la herramienta (§15).
 */
/** Etiqueta única del CTA de app: se usa en el header y en el menú móvil. */
export const appCta: Localized = { es: "Descarga la app", en: "Get the app", pt: "Baixe o app" };

/** Acceso a las preguntas frecuentes desde el navbar. */
export const helpLink: { label: Localized; href: string } = {
  label: { es: "¿Necesitas ayuda?", en: "Need help?", pt: "Precisa de ajuda?" },
  href: `${routes.red}#preguntas`,
};

/**
 * CTA GLOBAL DEL HEADER · uno solo, contextual por ruta (§15).
 *
 * Pasó de "Encontrar cargador" a "Descargar la app". El motivo no es estético:
 * "Encontrar cargador" llevaba a /red, que YA está en el menú dos centímetros
 * a la izquierda. El CTA duplicaba una entrada de navegación en lugar de
 * ofrecer algo que la navegación no da. La app sí lo es —es donde de verdad
 * se carga y se paga—, así que ahora el botón lleva ahí.
 *
 * /empresas conserva el suyo: en B2B la conversión es la conversación con el
 * equipo, y sustituirla por una descarga de app rompería el journey.
 *
 * /red deja de ser `null`. Antes no tenía CTA porque "encontrar cargador"
 * dentro del buscador era redundante; descargar la app no lo es: es
 * exactamente el paso siguiente de quien acaba de encontrar dónde cargar.
 */
export const headerCta: Record<
  string,
  { label: Localized; href: string; external?: boolean } | null
> = {
  home: { label: appCta, href: externalLinks.app, external: true },
  nosotros: { label: appCta, href: externalLinks.app, external: true },
  novedades: { label: appCta, href: externalLinks.app, external: true },
  red: { label: appCta, href: externalLinks.app, external: true },
  empresas: { label: { es: "Hablar con el equipo", en: "Talk to the team", pt: "Falar com o time", }, href: `${routes.empresas}#contacto` },
};

export const actions = {
  /* REGLA DE REGISTRO (§13): conversión y marca en IMPERATIVO de segunda
     persona; solo las acciones de sistema y los filtros van en infinitivo
     ("Quitar filtros", "Ocultar filtros"). En español el infinitivo es el
     registro del formulario administrativo, y aquí se estaban mezclando los
     dos sin criterio: "Descargar la app" convivía con "Descarga la app" para
     la misma acción. */
  /* Un solo rótulo para una sola acción: lo usan el hero y el cierre, y los
     dos llevan a `/red` y emiten el mismo evento. En el cierre, además, deja
     de repetir palabra por palabra el texto que tiene justo encima. */
  findCharger: { es: "Encuentra una estación", en: "Find a station", pt: "Encontre uma estação", } satisfies Localized,
  seeNetwork: { es: "Explora la red completa", en: "Explore the full network", pt: "Explore a rede completa", } satisfies Localized,
  /* Dejó de ser "Soluciones para empresas": ese texto pasó a ser el
     ANTETÍTULO del beat 4, y un botón que repite el rótulo de su propia
     sección no dice a dónde lleva. */
  businessSolutions: { es: "Conoce nuestras soluciones", en: "See our solutions", pt: "Conheça nossas soluções", } satisfies Localized,
  talkToTeam: { es: "Habla con nuestro equipo", en: "Talk to our team", pt: "Fale com nosso time", } satisfies Localized,
  /* "Conoce" y no "Ver": invita a entrar en la ficha, no a mirar una foto. En
     inglés se queda en "See this station" a propósito — "get to know" suena
     forzado en un botón y "discover" es lenguaje de folleto. Se traduce la
     intención, no la palabra. Lo usan el beat 2 y el caso, y los dos abren una
     ficha de estación: una acción, un rótulo. */
  seeStation: { es: "Conoce esta estación", en: "See this station", pt: "Conheça esta estação", } satisfies Localized,
  getDirections: { es: "Cómo llegar", en: "Get directions", pt: "Como chegar", } satisfies Localized,
  knowVoltop: { es: "Conoce Voltop", en: "About Voltop", pt: "Conheça a Voltop", } satisfies Localized,
  backToNetwork: { es: "Volver a la red", en: "Back to the network", pt: "Voltar para a rede", } satisfies Localized,
  hostStation: { es: "Lleva Voltop a tu espacio", en: "Bring Voltop to your space", pt: "Leve a Voltop para o seu espaço", } satisfies Localized,
};

/** Estados de estación — un único origen para toda la UI. */
export const stationStatus = {
  operativa: { es: "En operación", en: "Live", pt: "Em operação", } satisfies Localized,
  proxima: { es: "Próximamente", en: "Coming soon", pt: "Em breve", } satisfies Localized,
  mantenimiento: { es: "En mantenimiento", en: "Under maintenance", pt: "Em manutenção", } satisfies Localized,
};

export const units = {
  pointsShort: { es: "puntos", en: "points", pt: "pontos", } satisfies Localized,
  stations: { es: "estaciones", en: "stations", pt: "estações", } satisfies Localized,
  station: { es: "estación", en: "station", pt: "estação", } satisfies Localized,
};

/* ---------------------------------------------------------------- */
/* Formulario de leads                                               */
/* ---------------------------------------------------------------- */

export const leadForm = {
  title: { es: "Cuéntanos qué necesitas", en: "Tell us what you need", pt: "Conte o que você precisa", } satisfies Localized,
  intro: {
    es: "Alguien del equipo lee tu caso y te responde con una propuesta concreta.",
    en: "Someone on the team reads your case and replies with a concrete proposal.",
    pt: "Alguém do time lê o seu caso e responde com uma proposta concreta.",
  } satisfies Localized,
  caseLabel: { es: "Tu caso", en: "Your case", pt: "Seu caso", } satisfies Localized,

  fields: {
    name: {
      label: { es: "Nombre y apellido", en: "Full name", pt: "Nome e sobrenome", } satisfies Localized,
      error: { es: "Escribe tu nombre para saber cómo dirigirnos a ti.", en: "Enter your name so we know how to address you.", pt: "Escreva seu nome para sabermos como falar com você.", } satisfies Localized,
    },
    email: {
      /* "Corporativo" imponía un requisito que la validación NO exige
         (`LeadForm` solo comprueba la forma del correo), y justo al perfil que
         más escribe desde Gmail: el dueño de un parqueadero o de una flota
         pequeña. */
      label: { es: "Correo", en: "Email", pt: "E-mail", } satisfies Localized,
      hint: { es: "Te respondemos a este correo.", en: "We'll reply to this address.", pt: "Respondemos para este e-mail.", } satisfies Localized,
      error: { es: "Revisa el correo: parece que falta algo (ejemplo: nombre@empresa.com).", en: "Check the email — something looks off (example: name@company.com).", pt: "Confira o e-mail: parece que falta algo (exemplo: nome@empresa.com).", } satisfies Localized,
    },
    company: {
      label: { es: "Empresa u organización", en: "Company or organization", pt: "Empresa ou organização", } satisfies Localized,
      error: { es: "Indícanos el nombre de tu empresa u organización.", en: "Let us know your company or organization name.", pt: "Informe o nome da sua empresa ou organização.", } satisfies Localized,
    },
    phone: {
      label: { es: "Teléfono", en: "Phone", pt: "Telefone", } satisfies Localized,
      optional: { es: "Opcional", en: "Optional", pt: "Opcional", } satisfies Localized,
    },
    message: {
      label: { es: "¿Qué necesitas?", en: "What do you need?", pt: "O que você precisa?", } satisfies Localized,
      placeholder: {
        es: "Ej.: tenemos 40 colaboradores con vehículo eléctrico y una sede en Bogotá.",
        en: "E.g.: we have 40 employees with EVs and one office in Bogotá.",
        pt: "Ex.: temos 40 colaboradores com veículo elétrico e uma sede em Bogotá.",
      } satisfies Localized,
    },
    consent: {
      /** Requisito legal: Ley 1581 de 2012 (habeas data, Colombia). §38. */
      label: {
        es: "Autorizo a Voltop a tratar mis datos personales para responder a esta solicitud, conforme a su política de tratamiento de datos.",
        en: "I authorize Voltop to process my personal data in order to respond to this request, in accordance with its data processing policy.",
        pt: "Autorizo a Voltop a tratar meus dados pessoais para responder a esta solicitação, conforme sua política de tratamento de dados.",
      } satisfies Localized,
      error: {
        es: "Necesitamos tu autorización para poder contactarte.",
        en: "We need your authorization in order to contact you.",
        pt: "Precisamos da sua autorização para entrar em contato.",
      } satisfies Localized,
      policyLink: { es: "Ver política de tratamiento de datos", en: "View data processing policy", pt: "Ver política de tratamento de dados", } satisfies Localized,
    },
  },

  /* El resto de la página ya dice "Tu caso" y "Cuéntanos tu caso"; el botón
     decía "solicitud", que es vocabulario de ventanilla. */
  submit: { es: "Enviar mi caso", en: "Send my case", pt: "Enviar meu caso", } satisfies Localized,
  submitting: { es: "Enviando…", en: "Sending…", pt: "Enviando…", } satisfies Localized,

  /** El asterisco por sí solo no comunica nada: necesita leyenda (WCAG 3.3.2). */
  requiredLegend: {
    es: "Los campos marcados con * son obligatorios.",
    en: "Fields marked with * are required.",
    pt: "Os campos marcados com * são obrigatórios.",
  } satisfies Localized,

  errorSummary: {
    es: "Revisa los campos marcados para poder enviar tu solicitud.",
    en: "Please review the highlighted fields to send your request.",
    pt: "Revise os campos destacados para enviar sua solicitação.",
  } satisfies Localized,

  /**
   * Estado de éxito REAL. Se usa solo cuando existe destino de envío.
   * Ver `CRM_ENABLED` en components/empresas/LeadForm.tsx.
   */
  success: {
    title: { es: "Solicitud enviada", en: "Request sent", pt: "Solicitação enviada", } satisfies Localized,
    body: {
      es: "Alguien del equipo leerá tu caso y te escribirá al correo que nos dejaste. Respondemos normalmente en uno o dos días hábiles.",
      en: "Someone on the team will read your case and write to the email you provided. We usually reply within one or two business days.",
      pt: "Alguém do time vai ler o seu caso e escrever para o e-mail que você informou. Normalmente respondemos em um ou dois dias úteis.",
    } satisfies Localized,
  },

  /**
   * Estado de éxito MIENTRAS NO HAY CRM (decisión abierta O3).
   *
   * El copy de `success` prometía revisión y respuesta en uno o dos días
   * hábiles sobre un envío que no existe: `submitLead` descarta el payload.
   * Un titular es un contrato (§19) y este era el punto donde romperlo tenía
   * consecuencia comercial directa. Mientras el destino no exista, se dice lo
   * que de verdad pasó. No se ofrece un canal alternativo porque no hay
   * correo ni teléfono confirmados en el dataset: no se inventan datos (§33).
   */
  /**
   * Confirmación cuando el formulario redacta un correo.
   *
   * Dice EXACTAMENTE lo que pasó. "Solicitud enviada" sería mentira: el
   * mensaje está redactado, no enviado, y quien no lo mande no llega a
   * nosotros. Que la persona sepa que le falta un clic es la diferencia entre
   * un lead y un lead perdido.
   */
  successEmail: {
    tag: { es: "Casi listo", en: "Almost there", pt: "Quase lá", } satisfies Localized,
    title: { es: "Te abrimos el correo", en: "We opened your email", pt: "Abrimos o seu e-mail", } satisfies Localized,
    body: {
      es: "Tu mensaje ya está redactado con todo lo que nos contaste. Solo tienes que enviarlo y te respondemos en uno o dos días hábiles. Si no se abrió, escríbenos a soporte@voltop.co.",
      en: "Your message is already written with everything you told us. Just send it and we'll reply within one or two business days. If it didn't open, write to soporte@voltop.co.",
      pt: "Sua mensagem já está escrita com tudo o que você nos contou. Basta enviá-la e respondemos em um ou dois dias úteis. Se não abriu, escreva para soporte@voltop.co.",
    } satisfies Localized,
  },

  successPending: {
    tag: { es: "Sin enviar", en: "Not sent", pt: "Não enviado", } satisfies Localized,
    title: { es: "Todavía no podemos recibirlo aquí", en: "We can't receive it here yet", pt: "Ainda não conseguimos receber por aqui", } satisfies Localized,
    /* Antes esto era un callejón sin salida en el instante de MÁXIMA intención
       B2B: te decía que no se había enviado y ahí terminaba. El comentario
       original justificaba no ofrecer alternativa "porque no hay correo ni
       teléfono confirmados" — eso dejó de ser cierto: `content/data/links.ts`
       publica WhatsApp y soporte@voltop.co, ambos verificados. Y "CRM" sale de
       la cara del cliente: es vocabulario nuestro. */
    body: {
      es: "Este formulario aún no está conectado, así que tu solicitud no se envió ni se guardó. Escríbenos por WhatsApp o a soporte@voltop.co y seguimos por ahí.",
      en: "This form isn't connected yet, so your request wasn't sent or stored. Message us on WhatsApp or write to soporte@voltop.co and we'll take it from there.",
      pt: "Este formulário ainda não está conectado, então sua solicitação não foi enviada nem armazenada. Fale com a gente no WhatsApp ou escreva para soporte@voltop.co que seguimos por lá.",
    } satisfies Localized,
  },

  /** Aviso ANTES de pedir los datos, no en letra pequeña después del botón. */
  demoNotice: {
    es: "Formulario de demostración: todavía no envía solicitudes. La integración con el CRM está pendiente de definir.",
    en: "Demo form: it doesn't send requests yet. The CRM integration is yet to be defined.",
    pt: "Formulário de demonstração: ainda não envia solicitações. A integração com o CRM está pendente de definição.",
  } satisfies Localized,
};

/* ---------------------------------------------------------------- */
/* Estados vacíos y errores                                          */
/* ---------------------------------------------------------------- */

export const states = {
  noResults: {
    title: { es: "No hay estaciones con esos criterios", en: "No stations match those criteria", pt: "Nenhuma estação atende a esses critérios", } satisfies Localized,
    body: {
      /* "Cada mes" era una promesa de cadencia que nadie validó (§33). */
      es: "Prueba con menos filtros o mira otra ciudad. Hoy cargamos en Bogotá y Medellín, y seguimos abriendo.",
      en: "Try fewer filters or check another city. Today we charge in Bogotá and Medellín, and we keep opening.",
      pt: "Tente menos filtros ou veja outra cidade. Hoje carregamos em Bogotá e Medellín, e seguimos abrindo.",
    } satisfies Localized,
    action: { es: "Quitar filtros", en: "Clear filters", pt: "Limpar filtros", } satisfies Localized,
  },
  notFound: {
    title: { es: "No encontramos esta página", en: "We couldn't find this page", pt: "Não encontramos esta página", } satisfies Localized,
    body: {
      es: "Puede que el enlace haya cambiado o que la estación ya no esté publicada.",
      en: "The link may have changed, or the station may no longer be published.",
      pt: "O link pode ter mudado, ou a estação pode não estar mais publicada.",
    } satisfies Localized,
    action: { es: "Ir a la red", en: "Go to the network", pt: "Ir para a rede", } satisfies Localized,
    home: { es: "Ir al inicio", en: "Go to homepage", pt: "Ir para o início", } satisfies Localized,
  },
  pendingRealtime: {
    /* Antes decía "la integración de datos de operación", que es vocabulario
       de nuestro backlog puesto delante de alguien que solo quiere cargar. Y
       cerraba la puerta en vez de abrir la siguiente: la app SÍ muestra
       disponibilidad, y así lo declaran los Términos. */
    es: "Aquí todavía no mostramos el estado en vivo de cada punto. En la app sí puedes ver la disponibilidad antes de salir.",
    en: "We don't show live status for each point here yet. In the app you can check availability before you leave.",
    pt: "Aqui ainda não mostramos o status ao vivo de cada ponto. No app você já consulta a disponibilidade antes de sair.",
  } satisfies Localized,
};

/* ---------------------------------------------------------------- */
/* Accesibilidad y chrome                                            */
/* ---------------------------------------------------------------- */

export const a11y = {
  skipToContent: { es: "Saltar al contenido", en: "Skip to content", pt: "Pular para o conteúdo", } satisfies Localized,
  mainNav: { es: "Navegación principal", en: "Main navigation", pt: "Navegação principal", } satisfies Localized,
  footerNav: { es: "Navegación del pie de página", en: "Footer navigation", pt: "Navegação do rodapé", } satisfies Localized,
  openMenu: { es: "Abrir menú", en: "Open menu", pt: "Abrir menu", } satisfies Localized,
  closeMenu: { es: "Cerrar menú", en: "Close menu", pt: "Fechar menu", } satisfies Localized,
  languageSelector: { es: "Seleccionar idioma", en: "Select language", pt: "Selecionar idioma", } satisfies Localized,
  goHome: { es: "Voltop · Ir al inicio", en: "Voltop · Go to homepage", pt: "Voltop · Ir para o início", } satisfies Localized,
  breadcrumb: { es: "Ruta de navegación", en: "Breadcrumb", pt: "Trilha de navegação", } satisfies Localized,
  /** Se anuncia en todo enlace con `target="_blank"` (WCAG 3.2.5). */
  opensInNewTab: { es: "Se abre en una pestaña nueva", en: "Opens in a new tab", pt: "Abre em uma nova aba", } satisfies Localized,
  placeholderMedia: {
    es: "Contenido provisional: material pendiente de entrega",
    en: "Provisional content: material pending delivery",
    pt: "Conteúdo provisório: material pendente de entrega",
  } satisfies Localized,
};

/* ---------------------------------------------------------------- */
/* Rótulo del hueco de media                                         */
/* ---------------------------------------------------------------- */

/**
 * Estas tres cadenas estaban escritas EN LÍNEA dentro de `Media.tsx`, así que
 * la versión inglesa del sitio mostraba "FOTO · PENDIENTE". Es exactamente el
 * fallo que la capa de copy existe para impedir (§36.15: todo el copy fuera
 * del JSX), y era visible en producción.
 */
export const mediaPlaceholder = {
  photo: { es: "Foto", en: "Photo", pt: "Foto", } satisfies Localized,
  video: { es: "Video", en: "Video", pt: "Vídeo", } satisfies Localized,
  pending: { es: "pendiente", en: "pending", pt: "pendente", } satisfies Localized,
};

/* ---------------------------------------------------------------- */
/* Imagen Open Graph                                                 */
/* ---------------------------------------------------------------- */

/**
 * Estos dos textos estaban EN LÍNEA dentro de `opengraph-image.tsx`, como
 * ternarios de dos ramas. Es la misma clase de fallo que ya se corrigió en
 * `Media.tsx`, pero más caro: la imagen Open Graph es lo que se ve al
 * compartir el enlace en WhatsApp, LinkedIn o Slack, así que un idioma sin
 * rama propia se anuncia en inglés en el único sitio donde el error se
 * propaga por sí solo.
 */
export const og = {
  eyebrow: {
    es: "Red de carga eléctrica · Colombia",
    en: "EV charging network · Colombia",
    pt: "Rede de carregamento elétrico · Colômbia",
  } satisfies Localized,
  headline: {
    es: "La red que mueve a Colombia",
    en: "The network that moves Colombia",
    pt: "A rede que move a Colômbia",
  } satisfies Localized,
};

/* ---------------------------------------------------------------- */
/* Footer — tres columnas con destinos reales (§15)                  */
/* ---------------------------------------------------------------- */

export const footer = {
  columns: [
    {
      title: { es: "Cargar", en: "Charge", pt: "Carregar", } satisfies Localized,
      links: [
        { label: { es: "Encontrar una estación", en: "Find a station", pt: "Encontrar uma estação", } satisfies Localized, href: routes.red },
        { label: { es: "Cómo cargar", en: "How to charge", pt: "Como carregar", } satisfies Localized, href: `${routes.red}#como-cargar` },
        { label: { es: "Cobertura por ciudad", en: "Coverage by city", pt: "Cobertura por cidade", } satisfies Localized, href: `${routes.red}#ciudades` },
      ],
    },
    {
      title: { es: "Empresas", en: "Business", pt: "Empresas", } satisfies Localized,
      links: [
        { label: { es: "Soluciones por caso", en: "Solutions by case", pt: "Soluções por caso", } satisfies Localized, href: routes.empresas },
        { label: { es: "Lleva Voltop a tu espacio", en: "Bring Voltop to your space", pt: "Leve a Voltop para o seu espaço", } satisfies Localized, href: `${routes.empresas}#casos` },
        { label: { es: "Hablar con el equipo", en: "Talk to the team", pt: "Falar com o time", } satisfies Localized, href: `${routes.empresas}#contacto` },
      ],
    },
    {
      title: { es: "Compañía", en: "Company", pt: "Companhia", } satisfies Localized,
      links: [
        { label: { es: "Nosotros", en: "About us", pt: "Sobre nós", } satisfies Localized, href: routes.nosotros },
        { label: { es: "Novedades", en: "Newsroom", pt: "Novidades", } satisfies Localized, href: routes.novedades },
        { label: { es: "Impacto", en: "Impact", pt: "Impacto", } satisfies Localized, href: `${routes.nosotros}#impacto` },
        { label: { es: "Liderazgo", en: "Leadership", pt: "Liderança", } satisfies Localized, href: `${routes.nosotros}#liderazgo` },
      ],
    },
  ],
  /**
   * REDES · perfiles reales, verificados uno a uno antes de publicarlos.
   *
   * §15 prohíbe publicar un enlace sin destino real, así que los tres se
   * comprobaron con una petición: los tres responden 200.
   *
   * Se guardan las URLs CANÓNICAS, no las que entrega el botón de compartir
   * de cada app:
   * · Instagram llegaba con un parámetro de rastreo (`igsi`) que no aporta
   *   nada y ata el enlace a una sesión concreta.
   * · Facebook llegaba como `/share/18uWjiJFsV/`, un redirector. Resuelve al
   *   perfil, pero un redirector puede caducar y añade un salto en cada clic.
   *
   * `name` es nombre propio: no se traduce.
   */
  social: [
    { name: "Instagram", url: "https://www.instagram.com/voltop.co" },
    { name: "Facebook", url: "https://www.facebook.com/people/Voltop/61592759125960/" },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/voltop-energy/" },
  ],

  /**
   * §15: un enlace sin destino real no se publica. Estos dos lo tienen —los
   * documentos legales están escritos y publicados—, así que van en el pie.
   *
   * Aquí vivía `legalNotice`: "Prototipo · contenido provisional", heredado de
   * cuando esto era una maqueta. Se retiró el 2026-09-03 porque ya no era
   * cierto y sí era visible en TODAS las páginas: la marca es la definitiva,
   * los datos de la red están verificados y los legales están publicados.
   * Un sitio que se declara provisional en el pie invita a no creerse el resto.
   */
  terms: { es: "Términos y condiciones", en: "Terms and conditions", pt: "Termos e condições", } satisfies Localized,
  privacy: { es: "Tratamiento de datos", en: "Data processing", pt: "Tratamento de dados", } satisfies Localized,
  rights: { es: "Todos los derechos reservados.", en: "All rights reserved.", pt: "Todos os direitos reservados.", } satisfies Localized,
};

/**
 * Rótulo superior de cada insignia de tienda.
 *
 * La redacción es la OFICIAL de Apple y Google en cada idioma, no una
 * traducción propia: ambas publican guías de marca que fijan esta línea, y una
 * insignia con texto inventado deja de ser la insignia.
 */
export const storeBadges = {
  apple: { es: "Descárgalo en el", en: "Download on the", pt: "Baixar na", } satisfies Localized,
  google: { es: "Disponible en", en: "Get it on", pt: "Disponível no", } satisfies Localized,
};

/**
 * AVISO DE COOKIES.
 *
 * El sitio carga Google Tag Manager, que a su vez instala cookies de
 * analítica. La Política de Tratamiento de Datos las declara, pero declararlas
 * no es lo mismo que pedir permiso: la Ley 1581 exige autorización **previa,
 * expresa e informada** (§38), y "previa" significa antes de instalarlas.
 *
 * Por eso el texto no dice "usamos cookies" en pasado ni da por hecho nada.
 * Dice qué son, para qué, y deja las dos salidas al mismo nivel: un botón de
 * rechazo escondido o en gris no es una elección informada.
 */
export const cookies = {
  title: { es: "Cookies de analítica", en: "Analytics cookies", pt: "Cookies de análise", } satisfies Localized,
  body: {
    es: "Nos ayudan a entender qué partes del sitio se usan y cuáles no. No las activamos hasta que nos digas.",
    en: "They help us understand which parts of the site get used and which don't. We won't turn them on until you say so.",
    pt: "Elas nos ajudam a entender quais partes do site são usadas e quais não. Só ativamos quando você permitir.",
  } satisfies Localized,
  accept: { es: "Aceptar", en: "Accept", pt: "Aceitar" } satisfies Localized,
  reject: { es: "Rechazar", en: "Reject", pt: "Recusar" } satisfies Localized,
  policy: { es: "Leer la política", en: "Read the policy", pt: "Ler a política" } satisfies Localized,
};
