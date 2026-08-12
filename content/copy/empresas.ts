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
  },
};
