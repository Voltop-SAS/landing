import type { Localized } from "@/lib/i18n/config";
import { routes } from "@/lib/i18n/routes";
import { externalLinks } from "./links";

/**
 * COLECCIÓN · Preguntas frecuentes
 * Ver docs/MASTER-PROJECT-DEFINITION.md §19 (un titular es un contrato) y §33.
 *
 * El copy en español lo escribió Camilo; aquí se conserva literal. Inglés y
 * portugués son traducción de ese original, no versiones nuevas: si el español
 * cambia, los otros dos cambian con él.
 *
 * ── LA DISPONIBILIDAD SE DEJA COMO ESTÁ ─────────────────────────────────
 * La respuesta 2 ofrece "disponibilidad" y la respuesta 1 habla de la sesión
 * "en tiempo real", mientras `states.pendingRealtime` avisa dos secciones más
 * arriba de que la disponibilidad en tiempo real todavía no está integrada.
 * DECISIÓN DE CAMILO (2026-09-02): en este alcance no se conecta nada; el
 * texto se queda en el front y se edita aquí cuando la disponibilidad cambie.
 * Se registra para que quien lo lea mañana sepa que es deliberado.
 *
 * ── DOS ENLACES QUE AHORA SÍ EXISTEN ────────────────────────────────────
 * Soporte: WhatsApp +57 315 986 4931, operado vía Freshchat. Se publica como
 * `wa.me`, NO como `tel:`. Un `tel:` lanza una LLAMADA telefónica; el canal
 * de soporte es la conversación de WhatsApp, y `wa.me` es lo que la abre.
 *
 * Descarga de la app: https://app.voltop.co/ — al implementarlo devolvía 503
 * en tres intentos seguidos, con user-agent de navegador y por HTTP y HTTPS
 * (`voltop.co` sí respondía 200, así que era el subdominio). Se publica igual
 * porque es el dominio oficial y el sitio no está en producción, pero QUEDA
 * PENDIENTE DE VERIFICAR ANTES DEL LANZAMIENTO: §15 no admite un enlace que
 * no lleva a ninguna parte.
 */

export type FaqItem = {
  id: string;
  question: Localized;
  answer: Localized;
  /**
   * Salidas de la respuesta. Es una LISTA porque una pregunta puede tener más
   * de un camino legítimo —"necesito ayuda" se resuelve por WhatsApp o por
   * correo, y elegir por el usuario sería peor— pero se mantienen pocas: una
   * respuesta con cuatro salidas no responde, reparte.
   *
   * `external` cambia dos cosas: el href se usa tal cual (sin prefijo de
   * idioma) y el enlace se abre en pestaña nueva anunciándolo (WCAG 3.2.5).
   */
  links?: { label: Localized; href: string; external?: boolean }[];
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
    links: [
      {
        label: {
          es: "Descargar la app",
          en: "Get the app",
          pt: "Baixar o aplicativo",
        },
        href: externalLinks.app,
        external: true,
      },
    ],
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
    links: [
      {
        label: {
          es: "Ver cobertura por ciudad",
          en: "See coverage by city",
          pt: "Ver cobertura por cidade",
        },
        href: `${routes.red}#ciudades`,
      },
    ],
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
    links: [
      {
        label: {
          es: "Escríbenos por WhatsApp",
          en: "Message us on WhatsApp",
          pt: "Fale com a gente no WhatsApp",
        },
        href: externalLinks.whatsapp,
        external: true,
      },
      {
        /* Dos caminos y no uno: WhatsApp resuelve lo urgente —alguien varado
           en una estación— y el correo sirve para lo que necesita adjuntar o
           dejar por escrito. Elegir por el usuario habría sido peor. */
        label: { es: "Escribir a soporte", en: "Email support", pt: "Escrever para o suporte" },
        href: externalLinks.soporte,
        external: true,
      },
    ],
  },
];
