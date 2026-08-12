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
  } satisfies Localized,
};

export const nav: { label: Localized; href: string }[] = [
  { label: { es: "Red", en: "Network" }, href: routes.red },
  { label: { es: "Empresas", en: "Business" }, href: routes.empresas },
  { label: { es: "Nosotros", en: "Company" }, href: routes.nosotros },
];

/**
 * CTA global CONTEXTUAL. Un solo slot que cambia por ruta.
 * En /red no hay CTA: el usuario ya está en la herramienta (§15).
 */
export const headerCta: Record<string, { label: Localized; href: string } | null> = {
  home: { label: { es: "Encontrar cargador", en: "Find a charger" }, href: routes.red },
  nosotros: { label: { es: "Encontrar cargador", en: "Find a charger" }, href: routes.red },
  red: null,
  empresas: { label: { es: "Hablar con el equipo", en: "Talk to the team" }, href: `${routes.empresas}#contacto` },
};

export const actions = {
  findCharger: { es: "Encontrar cargador", en: "Find a charger" } satisfies Localized,
  seeNetwork: { es: "Ver la red completa", en: "See the full network" } satisfies Localized,
  businessSolutions: { es: "Soluciones para empresas", en: "Business solutions" } satisfies Localized,
  talkToTeam: { es: "Hablar con el equipo", en: "Talk to the team" } satisfies Localized,
  seeStation: { es: "Ver esta estación", en: "See this station" } satisfies Localized,
  seeAllStations: { es: "Ver todas las estaciones", en: "See all stations" } satisfies Localized,
  getDirections: { es: "Cómo llegar", en: "Get directions" } satisfies Localized,
  openInApp: { es: "Abrir en la app", en: "Open in the app" } satisfies Localized,
  downloadApp: { es: "Descargar la app", en: "Download the app" } satisfies Localized,
  knowVoltop: { es: "Conoce a Voltop", en: "About Voltop" } satisfies Localized,
  seeImpact: { es: "Ver nuestro impacto", en: "See our impact" } satisfies Localized,
  backToNetwork: { es: "Volver a la red", en: "Back to the network" } satisfies Localized,
  hostStation: { es: "Lleva Voltop a tu espacio", en: "Bring Voltop to your space" } satisfies Localized,
  playVideo: { es: "Reproducir video", en: "Play video" } satisfies Localized,
};

/** Estados de estación — un único origen para toda la UI. */
export const stationStatus = {
  operativa: { es: "En operación", en: "Live" } satisfies Localized,
  proxima: { es: "Próximamente", en: "Coming soon" } satisfies Localized,
  mantenimiento: { es: "En mantenimiento", en: "Under maintenance" } satisfies Localized,
};

export const units = {
  kw: { es: "kW", en: "kW" } satisfies Localized,
  points: { es: "puntos de carga", en: "charging points" } satisfies Localized,
  pointsShort: { es: "puntos", en: "points" } satisfies Localized,
  stations: { es: "estaciones", en: "stations" } satisfies Localized,
  station: { es: "estación", en: "station" } satisfies Localized,
};

/* ---------------------------------------------------------------- */
/* Formulario de leads                                               */
/* ---------------------------------------------------------------- */

export const leadForm = {
  title: { es: "Cuéntanos qué necesitas", en: "Tell us what you need" } satisfies Localized,
  intro: {
    es: "Un especialista revisa tu caso y te responde con una propuesta concreta.",
    en: "A specialist reviews your case and replies with a concrete proposal.",
  } satisfies Localized,
  caseLabel: { es: "Tu caso", en: "Your case" } satisfies Localized,

  fields: {
    name: {
      label: { es: "Nombre y apellido", en: "Full name" } satisfies Localized,
      error: { es: "Escribe tu nombre para saber cómo dirigirnos a ti.", en: "Enter your name so we know how to address you." } satisfies Localized,
    },
    email: {
      label: { es: "Correo corporativo", en: "Work email" } satisfies Localized,
      hint: { es: "Te respondemos a este correo.", en: "We'll reply to this address." } satisfies Localized,
      error: { es: "Revisa el correo: parece que falta algo (ejemplo: nombre@empresa.com).", en: "Check the email — something looks off (example: name@company.com)." } satisfies Localized,
    },
    company: {
      label: { es: "Empresa u organización", en: "Company or organization" } satisfies Localized,
      error: { es: "Indícanos el nombre de tu empresa u organización.", en: "Let us know your company or organization name." } satisfies Localized,
    },
    phone: {
      label: { es: "Teléfono", en: "Phone" } satisfies Localized,
      optional: { es: "Opcional", en: "Optional" } satisfies Localized,
    },
    message: {
      label: { es: "¿Qué necesitas?", en: "What do you need?" } satisfies Localized,
      placeholder: {
        es: "Ej.: tenemos 40 colaboradores con vehículo eléctrico y una sede en Bogotá.",
        en: "E.g.: we have 40 employees with EVs and one office in Bogotá.",
      } satisfies Localized,
    },
    consent: {
      /** Requisito legal: Ley 1581 de 2012 (habeas data, Colombia). §38. */
      label: {
        es: "Autorizo a Voltop a tratar mis datos personales para responder a esta solicitud, conforme a su política de tratamiento de datos.",
        en: "I authorize Voltop to process my personal data in order to respond to this request, in accordance with its data processing policy.",
      } satisfies Localized,
      error: {
        es: "Necesitamos tu autorización para poder contactarte.",
        en: "We need your authorization in order to contact you.",
      } satisfies Localized,
      policyLink: { es: "Ver política de tratamiento de datos", en: "View data processing policy" } satisfies Localized,
    },
  },

  submit: { es: "Enviar solicitud", en: "Send request" } satisfies Localized,
  submitting: { es: "Enviando…", en: "Sending…" } satisfies Localized,

  errorSummary: {
    es: "Revisa los campos marcados para poder enviar tu solicitud.",
    en: "Please review the highlighted fields to send your request.",
  } satisfies Localized,

  success: {
    title: { es: "Solicitud enviada", en: "Request sent" } satisfies Localized,
    body: {
      es: "Un especialista revisará tu caso y te escribirá al correo que nos dejaste. Respondemos normalmente en uno o dos días hábiles.",
      en: "A specialist will review your case and write to the email you provided. We usually reply within one or two business days.",
    } satisfies Localized,
  },

  demoNotice: {
    es: "Formulario de demostración · la integración con CRM está pendiente de definir",
    en: "Demo form · CRM integration is yet to be defined",
  } satisfies Localized,
};

/* ---------------------------------------------------------------- */
/* Estados vacíos y errores                                          */
/* ---------------------------------------------------------------- */

export const states = {
  noResults: {
    title: { es: "No hay estaciones con esos criterios", en: "No stations match those criteria" } satisfies Localized,
    body: {
      es: "Prueba con menos filtros o revisa otra ciudad. La red crece cada mes.",
      en: "Try fewer filters or check another city. The network grows every month.",
    } satisfies Localized,
    action: { es: "Quitar filtros", en: "Clear filters" } satisfies Localized,
  },
  notFound: {
    title: { es: "No encontramos esta página", en: "We couldn't find this page" } satisfies Localized,
    body: {
      es: "Puede que el enlace haya cambiado o que la estación ya no esté publicada.",
      en: "The link may have changed, or the station may no longer be published.",
    } satisfies Localized,
    action: { es: "Ir a la red", en: "Go to the network" } satisfies Localized,
  },
  pendingData: {
    es: "Dato pendiente de confirmación",
    en: "Data pending confirmation",
  } satisfies Localized,
  pendingRealtime: {
    es: "La disponibilidad en tiempo real llegará con la integración de datos de operación.",
    en: "Real-time availability will arrive with the operations data integration.",
  } satisfies Localized,
};

/* ---------------------------------------------------------------- */
/* Accesibilidad y chrome                                            */
/* ---------------------------------------------------------------- */

export const a11y = {
  skipToContent: { es: "Saltar al contenido", en: "Skip to content" } satisfies Localized,
  mainNav: { es: "Navegación principal", en: "Main navigation" } satisfies Localized,
  footerNav: { es: "Navegación del pie de página", en: "Footer navigation" } satisfies Localized,
  openMenu: { es: "Abrir menú", en: "Open menu" } satisfies Localized,
  closeMenu: { es: "Cerrar menú", en: "Close menu" } satisfies Localized,
  languageSelector: { es: "Seleccionar idioma", en: "Select language" } satisfies Localized,
  goHome: { es: "Voltop · Ir al inicio", en: "Voltop · Go to homepage" } satisfies Localized,
  breadcrumb: { es: "Ruta de navegación", en: "Breadcrumb" } satisfies Localized,
  placeholderMedia: {
    es: "Contenido provisional: material pendiente de entrega",
    en: "Provisional content: material pending delivery",
  } satisfies Localized,
};

/* ---------------------------------------------------------------- */
/* Footer — tres columnas con destinos reales (§15)                  */
/* ---------------------------------------------------------------- */

export const footer = {
  columns: [
    {
      title: { es: "Cargar", en: "Charge" } satisfies Localized,
      links: [
        { label: { es: "Encontrar una estación", en: "Find a station" } satisfies Localized, href: routes.red },
        { label: { es: "Cómo cargar", en: "How to charge" } satisfies Localized, href: `${routes.red}#como-cargar` },
        { label: { es: "Cobertura por ciudad", en: "Coverage by city" } satisfies Localized, href: `${routes.red}#ciudades` },
      ],
    },
    {
      title: { es: "Empresas", en: "Business" } satisfies Localized,
      links: [
        { label: { es: "Soluciones por caso", en: "Solutions by case" } satisfies Localized, href: routes.empresas },
        { label: { es: "Lleva Voltop a tu espacio", en: "Bring Voltop to your space" } satisfies Localized, href: `${routes.empresas}#casos` },
        { label: { es: "Hablar con el equipo", en: "Talk to the team" } satisfies Localized, href: `${routes.empresas}#contacto` },
      ],
    },
    {
      title: { es: "Compañía", en: "Company" } satisfies Localized,
      links: [
        { label: { es: "Nosotros", en: "About us" } satisfies Localized, href: routes.nosotros },
        { label: { es: "Impacto", en: "Impact" } satisfies Localized, href: `${routes.nosotros}#impacto` },
        { label: { es: "Liderazgo", en: "Leadership" } satisfies Localized, href: `${routes.nosotros}#liderazgo` },
      ],
    },
  ],
  /**
   * Enlaces sin destino real NO se publican (§15). App, ayuda, legal y redes
   * sociales se añadirán aquí cuando existan las URLs correspondientes.
   */
  privacy: { es: "Tratamiento de datos", en: "Data processing" } satisfies Localized,
  legalNotice: {
    es: "Prototipo · contenido provisional",
    en: "Prototype · provisional content",
  } satisfies Localized,
  rights: { es: "Todos los derechos reservados.", en: "All rights reserved." } satisfies Localized,
};
