import type { Localized } from "@/lib/i18n/config";
import { routes } from "@/lib/i18n/routes";

/**
 * COLECCIÓN · Preguntas frecuentes
 * Ver docs/MASTER-PROJECT-DEFINITION.md §19 (un titular es un contrato) y §33.
 *
 * El copy en español lo escribió Camilo; aquí se conserva literal. Inglés y
 * portugués son traducción de ese original, no versiones nuevas: si el español
 * cambia, los otros dos cambian con él.
 *
 * ── DOS AFIRMACIONES QUE ESTÁN LEVANTADAS ────────────────────────────────
 * La página que aloja este FAQ muestra, dos secciones más arriba y bajo el
 * buscador, esta nota:
 *
 *   "La disponibilidad en tiempo real llegará con la integración de datos
 *    de operación."   (`states.pendingRealtime`)
 *
 * Y aquí abajo, la respuesta 2 ofrece "disponibilidad" entre lo que se
 * consulta antes de llegar, y la 1 habla de la sesión "en tiempo real".
 * Son cosas distintas —la sesión propia no es la disponibilidad de la red—
 * pero conviven en la misma página, y §19 dice que un titular es un contrato.
 * Queda REGISTRADO para decisión de producto, no corregido por cuenta propia.
 *
 * ── EL ENLACE QUE NO ESTÁ ────────────────────────────────────────────────
 * La respuesta 5 remite a "los canales disponibles en Voltop". Hoy el sitio
 * no nombra ninguno: el único formulario es el de `/empresas#contacto`, que
 * es captación B2B para dueños de espacio y sería el destino equivocado para
 * alguien con un problema a mitad de carga. Por eso esa respuesta va SIN
 * enlace: §15 prohíbe publicar un enlace sin destino real, y prefiero una
 * respuesta sin salida a una salida que decepcione. En cuanto exista un canal
 * de soporte —WhatsApp, correo, chat en la app— se añade aquí.
 */

export type FaqItem = {
  id: string;
  question: Localized;
  answer: Localized;
  /** Enlace de salida cuando la respuesta continúa en otra parte del sitio. */
  link?: { label: Localized; href: string };
};

export const faq: FaqItem[] = [
  {
    id: "como-cargar",
    question: {
      es: "¿Cómo cargo mi vehículo con Voltop?",
      en: "How do I charge my vehicle with Voltop?",
      pt: "Como carrego meu veículo com a Voltop?",
    },
    answer: {
      es: "Descarga la app de Voltop, encuentra una estación cercana, conecta tu vehículo y sigue los pasos para iniciar la carga. Desde la app puedes gestionar y consultar tu sesión en tiempo real.",
      en: "Download the Voltop app, find a station nearby, plug in your vehicle and follow the steps to start charging. From the app you can manage and check your session in real time.",
      pt: "Baixe o aplicativo da Voltop, encontre uma estação por perto, conecte seu veículo e siga os passos para iniciar o carregamento. Pelo aplicativo você acompanha e gerencia sua sessão em tempo real.",
    },
    link: {
      label: { es: "Ver los tres pasos", en: "See the three steps", pt: "Ver os três passos" },
      href: `${routes.red}#como-cargar`,
    },
  },
  {
    id: "donde",
    question: {
      es: "¿Dónde puedo encontrar estaciones Voltop?",
      en: "Where can I find Voltop stations?",
      pt: "Onde posso encontrar estações Voltop?",
    },
    answer: {
      es: "Puedes consultar todas nuestras estaciones disponibles directamente en la app de Voltop, junto con su ubicación, conectores y disponibilidad para que sepas dónde cargar antes de llegar.",
      en: "You can see all our available stations right in the Voltop app, along with their location, connectors and availability, so you know where to charge before you arrive.",
      pt: "Você pode consultar todas as nossas estações disponíveis diretamente no aplicativo da Voltop, junto com a localização, os conectores e a disponibilidade, para saber onde carregar antes de chegar.",
    },
    /* La respuesta manda a la app, pero quien lee esto está de pie sobre el
       buscador de la web. El enlace evita que la única salida sea una tienda
       de aplicaciones cuyo enlace todavía no tenemos (O8). */
    link: {
      label: { es: "Ver cobertura por ciudad", en: "See coverage by city", pt: "Ver cobertura por cidade" },
      href: `${routes.red}#ciudades`,
    },
  },
  {
    id: "precio",
    question: {
      es: "¿Cuánto cuesta cargar en Voltop?",
      en: "How much does it cost to charge with Voltop?",
      pt: "Quanto custa carregar na Voltop?",
    },
    answer: {
      es: "El precio puede variar según la estación. Antes de iniciar tu carga podrás consultar la tarifa aplicable para saber cuánto cuesta cargar.",
      en: "The price can vary by station. Before you start charging you'll be able to check the applicable rate, so you know what it costs.",
      pt: "O preço pode variar conforme a estação. Antes de iniciar o carregamento você poderá consultar a tarifa aplicável para saber quanto vai custar.",
    },
  },
  {
    id: "pago",
    question: {
      es: "¿Cómo puedo pagar una carga?",
      en: "How do I pay for a charge?",
      pt: "Como faço para pagar um carregamento?",
    },
    answer: {
      es: "Puedes gestionar tus pagos directamente desde la app de Voltop. Nuestra experiencia está diseñada para que cargar y pagar sea simple, digital y sin procesos innecesarios.",
      en: "You can manage your payments right from the Voltop app. Our experience is built so that charging and paying is simple, digital and free of unnecessary steps.",
      pt: "Você gerencia seus pagamentos diretamente no aplicativo da Voltop. Nossa experiência é feita para que carregar e pagar seja simples, digital e sem processos desnecessários.",
    },
  },
  {
    id: "ayuda",
    question: {
      es: "¿Qué hago si necesito ayuda durante una carga?",
      en: "What do I do if I need help during a charge?",
      pt: "O que faço se precisar de ajuda durante um carregamento?",
    },
    answer: {
      es: "Estamos para ayudarte. Si tienes algún inconveniente antes, durante o después de una carga, puedes comunicarte con nuestro equipo de soporte a través de los canales disponibles en Voltop.",
      en: "We're here for you. If anything comes up before, during or after a charge, you can reach our support team through Voltop's available channels.",
      pt: "Estamos aqui para ajudar. Se tiver algum problema antes, durante ou depois de um carregamento, você pode falar com nosso time de suporte pelos canais disponíveis da Voltop.",
    },
    /* Sin enlace a propósito: hoy no existe un canal de soporte que nombrar.
       Ver la nota de cabecera. */
  },
];
