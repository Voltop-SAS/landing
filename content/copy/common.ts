import type { Localized } from "@/lib/i18n/config";
import { routes } from "@/lib/i18n/routes";

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

export const brand = {
  name: "Voltop",
  tagline: {
    es: "Infraestructura de carga para la movilidad eléctrica de Colombia.",
    en: "Charging infrastructure for Colombia's electric mobility.",
    pt: "Infraestrutura de carregamento para a mobilidade elétrica da Colômbia.",
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
  { label: { es: "Nosotros", en: "Company", pt: "Companhia", }, href: routes.nosotros },
];

/**
 * CTA global CONTEXTUAL. Un solo slot que cambia por ruta.
 * En /red no hay CTA: el usuario ya está en la herramienta (§15).
 */
export const headerCta: Record<string, { label: Localized; href: string } | null> = {
  home: { label: { es: "Encontrar cargador", en: "Find a charger", pt: "Encontrar carregador", }, href: routes.red },
  nosotros: { label: { es: "Encontrar cargador", en: "Find a charger", pt: "Encontrar carregador", }, href: routes.red },
  /* El registro es una superficie de LECTURA, no una herramienta, así que el
     CTA global sigue aplicando —a diferencia de /red, donde el usuario ya está
     dentro de la herramienta y el CTA sería redundante (§15). */
  novedades: { label: { es: "Encontrar cargador", en: "Find a charger", pt: "Encontrar carregador", }, href: routes.red },
  red: null,
  empresas: { label: { es: "Hablar con el equipo", en: "Talk to the team", pt: "Falar com o time", }, href: `${routes.empresas}#contacto` },
};

export const actions = {
  findCharger: { es: "Encontrar cargador", en: "Find a charger", pt: "Encontrar carregador", } satisfies Localized,
  seeNetwork: { es: "Ver la red completa", en: "See the full network", pt: "Ver a rede completa", } satisfies Localized,
  businessSolutions: { es: "Soluciones para empresas", en: "Business solutions", pt: "Soluções para empresas", } satisfies Localized,
  talkToTeam: { es: "Hablar con el equipo", en: "Talk to the team", pt: "Falar com o time", } satisfies Localized,
  seeStation: { es: "Ver esta estación", en: "See this station", pt: "Ver esta estação", } satisfies Localized,
  getDirections: { es: "Cómo llegar", en: "Get directions", pt: "Como chegar", } satisfies Localized,
  knowVoltop: { es: "Conoce a Voltop", en: "About Voltop", pt: "Conheça a Voltop", } satisfies Localized,
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
    es: "Un especialista revisa tu caso y te responde con una propuesta concreta.",
    en: "A specialist reviews your case and replies with a concrete proposal.",
    pt: "Um especialista analisa o seu caso e responde com uma proposta concreta.",
  } satisfies Localized,
  caseLabel: { es: "Tu caso", en: "Your case", pt: "Seu caso", } satisfies Localized,

  fields: {
    name: {
      label: { es: "Nombre y apellido", en: "Full name", pt: "Nome e sobrenome", } satisfies Localized,
      error: { es: "Escribe tu nombre para saber cómo dirigirnos a ti.", en: "Enter your name so we know how to address you.", pt: "Escreva seu nome para sabermos como falar com você.", } satisfies Localized,
    },
    email: {
      label: { es: "Correo corporativo", en: "Work email", pt: "E-mail corporativo", } satisfies Localized,
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

  submit: { es: "Enviar solicitud", en: "Send request", pt: "Enviar solicitação", } satisfies Localized,
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
      es: "Un especialista revisará tu caso y te escribirá al correo que nos dejaste. Respondemos normalmente en uno o dos días hábiles.",
      en: "A specialist will review your case and write to the email you provided. We usually reply within one or two business days.",
      pt: "Um especialista vai analisar o seu caso e escrever para o e-mail que você informou. Normalmente respondemos em um ou dois dias úteis.",
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
  successPending: {
    tag: { es: "Sin enviar", en: "Not sent", pt: "Não enviado", } satisfies Localized,
    title: { es: "Este formulario aún no envía", en: "This form doesn't send yet", pt: "Este formulário ainda não envia", } satisfies Localized,
    body: {
      es: "La integración con el CRM está pendiente de definir: tu solicitud no se ha enviado y no se ha guardado ningún dato. Cuando la integración esté lista, este mismo formulario llegará al equipo comercial.",
      en: "The CRM integration is yet to be defined: your request has not been sent and no data has been stored. Once the integration is live, this same form will reach the sales team.",
      pt: "A integração com o CRM ainda está pendente de definição: sua solicitação não foi enviada e nenhum dado foi armazenado. Quando a integração estiver pronta, este mesmo formulário chegará ao time comercial.",
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
      es: "Prueba con menos filtros o revisa otra ciudad. La red crece cada mes.",
      en: "Try fewer filters or check another city. The network grows every month.",
      pt: "Tente menos filtros ou veja outra cidade. A rede cresce todo mês.",
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
    es: "La disponibilidad en tiempo real llegará con la integración de datos de operación.",
    en: "Real-time availability will arrive with the operations data integration.",
    pt: "A disponibilidade em tempo real chegará com a integração dos dados de operação.",
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
   * Enlaces sin destino real NO se publican (§15). La app y los términos y
   * condiciones se añadirán aquí cuando existan las URLs y el texto legal.
   */
  privacy: { es: "Tratamiento de datos", en: "Data processing", pt: "Tratamento de dados", } satisfies Localized,
  legalNotice: {
    es: "Prototipo · contenido provisional",
    en: "Prototype · provisional content",
    pt: "Protótipo · conteúdo provisório",
  } satisfies Localized,
  rights: { es: "Todos los derechos reservados.", en: "All rights reserved.", pt: "Todos os direitos reservados.", } satisfies Localized,
};
