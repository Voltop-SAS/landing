import type { Localized } from "@/lib/i18n/config";

/**
 * COPY · Empresas
 *
 * Orden obligatorio de la página (§10, §14):
 *   propuesta → selector de caso → capacidades → EVIDENCIA → formulario
 * La evidencia SIEMPRE precede a la petición del dato. No al revés.
 */

export const empresas = {
  meta: {
    title: { es: "Soluciones para empresas · Voltop", en: "Business solutions · Voltop" } satisfies Localized,
    description: {
      es: "Infraestructura de carga para empresas, flotas, espacios comerciales y partners. Instalamos, operamos y mantenemos de principio a fin.",
      en: "Charging infrastructure for companies, fleets, commercial spaces and partners. We install, operate and maintain end to end.",
    } satisfies Localized,
  },

  hero: {
    eyebrow: { es: "Empresas y espacios", en: "Business and spaces" } satisfies Localized,
    title: {
      es: "Carga eléctrica para tu negocio, operada por nosotros",
      en: "EV charging for your business, operated by us",
    } satisfies Localized,
    lead: {
      es: "Diseñamos, instalamos, operamos y mantenemos la infraestructura. Tú defines el objetivo; nosotros nos encargamos de que funcione todos los días.",
      en: "We design, install, operate and maintain the infrastructure. You set the goal; we make sure it works every single day.",
    } satisfies Localized,
  },

  selector: {
    eyebrow: { es: "Tu caso", en: "Your case" } satisfies Localized,
    title: { es: "¿Qué describe mejor tu situación?", en: "What best describes your situation?" } satisfies Localized,
    lead: {
      es: "Elige tu caso y verás la propuesta concreta para esa situación.",
      en: "Pick your case and you'll see the specific proposal for it.",
    } satisfies Localized,
    benefitsTitle: { es: "Qué incluye", en: "What's included" } satisfies Localized,
  },

  capabilities: {
    eyebrow: { es: "Cómo trabajamos", en: "How we work" } satisfies Localized,
    title: { es: "De principio a fin", en: "End to end" } satisfies Localized,
    lead: {
      es: "El mismo equipo que evalúa el sitio es el que responde cuando algo necesita atención.",
      en: "The same team that assesses the site is the one that responds when something needs attention.",
    } satisfies Localized,
    steps: [
      {
        step: "01",
        title: { es: "Evaluamos", en: "We assess" } satisfies Localized,
        body: {
          es: "Visitamos el sitio, revisamos capacidad eléctrica y dimensionamos según uso real esperado.",
          en: "We visit the site, review electrical capacity and size the solution around real expected usage.",
        } satisfies Localized,
      },
      {
        step: "02",
        title: { es: "Instalamos", en: "We install" } satisfies Localized,
        body: {
          es: "Obra civil, conexión, equipos y puesta en marcha, con la señalización y la seguridad del sitio resueltas.",
          en: "Civil works, connection, hardware and commissioning, with site signage and safety resolved.",
        } satisfies Localized,
      },
      {
        step: "03",
        title: { es: "Operamos", en: "We operate" } satisfies Localized,
        body: {
          es: "Monitoreo, atención a usuarios, mantenimiento preventivo y correctivo. La estación es responsabilidad nuestra.",
          en: "Monitoring, user support, preventive and corrective maintenance. The station is our responsibility.",
        } satisfies Localized,
      },
      {
        step: "04",
        title: { es: "Reportamos", en: "We report" } satisfies Localized,
        body: {
          es: "Energía entregada, sesiones, disponibilidad y uso por perfil, en un reporte que puedes llevar a tu comité.",
          en: "Energy delivered, sessions, availability and usage by profile, in a report you can take to your committee.",
        } satisfies Localized,
      },
    ],
  },

  /** EVIDENCIA — precede al formulario. Sin esto, la página no se publica. */
  proof: {
    eyebrow: { es: "Evidencia", en: "Evidence" } satisfies Localized,
    title: { es: "Ya está funcionando", en: "It's already working" } satisfies Localized,
    challengeLabel: { es: "El reto", en: "The challenge" } satisfies Localized,
    solutionLabel: { es: "Lo que hicimos", en: "What we did" } satisfies Localized,
    seeStation: { es: "Ver la estación", en: "See the station" } satisfies Localized,
  },

  contact: {
    eyebrow: { es: "Hablemos", en: "Let's talk" } satisfies Localized,
    title: { es: "Cuéntanos tu caso", en: "Tell us your case" } satisfies Localized,
    /**
     * QUÉ PASA DESPUÉS. La columna izquierda del bloque de contacto tenía un
     * antetítulo, un titular y ~600px de vacío al lado de un formulario alto.
     * Ese es exactamente el espacio donde va lo que reduce la fricción del lead.
     *
     * Deliberadamente SIN compromiso de plazo: mientras no exista integración de
     * CRM, prometer un tiempo de respuesta es la misma falta que el estado de
     * éxito que se corrigió en el Bloque 7.
     */
    nextTitle: { es: "Qué pasa después", en: "What happens next" } satisfies Localized,
    next: [
      {
        step: "01",
        title: { es: "Revisamos tu caso", en: "We review your case" } satisfies Localized,
        body: {
          es: "Un especialista lee lo que nos cuentas y mira si tu sitio encaja con lo que sabemos operar bien.",
          en: "A specialist reads what you send and checks whether your site fits what we know how to run well.",
        } satisfies Localized,
      },
      {
        step: "02",
        title: { es: "Hablamos del sitio", en: "We talk about the site" } satisfies Localized,
        body: {
          es: "Una conversación corta para entender el parqueadero, la capacidad eléctrica y quién va a cargar.",
          en: "A short conversation to understand the parking, the electrical capacity and who will charge.",
        } satisfies Localized,
      },
      {
        step: "03",
        title: { es: "Recibes una propuesta", en: "You get a proposal" } satisfies Localized,
        body: {
          es: "Con potencia, número de puntos y modelo comercial concretos para tu caso. Sin compromiso.",
          en: "With specific power, number of points and commercial model for your case. No commitment.",
        } satisfies Localized,
      },
    ],
    privacyNote: {
      es: "Usamos tus datos solo para responder a esta solicitud.",
      en: "We use your data only to respond to this request.",
    } satisfies Localized,
  },
};
