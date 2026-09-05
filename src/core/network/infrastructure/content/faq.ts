import { routes } from '~/core/common/domain/i18n/routes'
import { externalLinks } from '~/core/common/domain/consts/links'

/**
 * COLLECTION · Frequently asked questions
 * See docs/MASTER-PROJECT-DEFINITION.md §19 (a headline is a contract) and §33.
 *
 * The Spanish copy was written by Camilo and is kept verbatim here. English
 * and Portuguese are translations of that original, not new versions: if the
 * Spanish changes, the other two change with it.
 *
 * ── AVAILABILITY IS LEFT AS IT IS ────────────────────────────────────────
 * Answer 2 offers "availability" and answer 1 talks about the session "in real
 * time", while `states.pendingRealtime` warns two sections further up that
 * real-time availability is not integrated yet.
 * CAMILO'S DECISION (2026-09-02): nothing gets wired up in this scope; the
 * text stays in the front end and is edited here when availability changes.
 * Recorded so that whoever reads it tomorrow knows it is deliberate.
 *
 * ── TWO LINKS THAT NOW DO EXIST ──────────────────────────────────────────
 * Support: WhatsApp +57 315 986 4931, operated through Freshchat. It is
 * published as `wa.me`, NOT as `tel:`. A `tel:` starts a phone CALL; the
 * support channel is the WhatsApp conversation, and `wa.me` is what opens it.
 *
 * App download: https://app.voltop.co/ — while implementing this it returned
 * 503 on three consecutive attempts, with a browser user-agent and over both
 * HTTP and HTTPS (`voltop.co` did answer 200, so it was the subdomain). It is
 * published anyway because it is the official domain and the site is not in
 * production, but it REMAINS TO BE VERIFIED BEFORE LAUNCH: §15 does not allow
 * a link that leads nowhere.
 */

import type { FaqItem } from '~/core/network/domain/entities/FaqItem'

export const faq: FaqItem[] = [
  {
    id: 'como-cargar',
    question: {
      es: '¿Cómo cargo mi vehículo con Voltop?',
      en: 'How do I charge my vehicle with Voltop?',
      pt: 'Como carrego meu veículo com a Voltop?',
    },
    answer: {
      es: 'Descarga la app de Voltop, encuentra una estación cercana, conecta tu vehículo y sigue los pasos para iniciar la carga. Desde la app puedes gestionar y consultar tu sesión en tiempo real.',
      en: 'Download the Voltop app, find a station nearby, plug in your vehicle and follow the steps to start charging. From the app you can manage and check your session in real time.',
      pt: 'Baixe o aplicativo da Voltop, encontre uma estação por perto, conecte seu veículo e siga os passos para iniciar o carregamento. Pelo aplicativo você acompanha e gerencia sua sessão em tempo real.',
    },
    links: [
      {
        label: {
          es: 'Descargar la app',
          en: 'Get the app',
          pt: 'Baixar o aplicativo',
        },
        href: externalLinks.app,
        external: true,
      },
    ],
  },
  {
    id: 'donde',
    question: {
      es: '¿Dónde puedo encontrar estaciones Voltop?',
      en: 'Where can I find Voltop stations?',
      pt: 'Onde posso encontrar estações Voltop?',
    },
    answer: {
      es: 'Puedes consultar todas nuestras estaciones disponibles directamente en la app de Voltop, junto con su ubicación, conectores y disponibilidad para que sepas dónde cargar antes de llegar.',
      en: 'You can see all our available stations right in the Voltop app, along with their location, connectors and availability, so you know where to charge before you arrive.',
      pt: 'Você pode consultar todas as nossas estações disponíveis diretamente no aplicativo da Voltop, junto com a localização, os conectores e a disponibilidade, para saber onde carregar antes de chegar.',
    },
    /* The answer points to the app, but whoever reads this is standing on
       the web finder. The link keeps the only way out from being an app
       store whose URL we do not have yet (O8). */
    links: [
      {
        label: {
          es: 'Ver cobertura por ciudad',
          en: 'See coverage by city',
          pt: 'Ver cobertura por cidade',
        },
        href: `${routes.network}#ciudades`,
      },
    ],
  },
  {
    id: 'precio',
    question: {
      es: '¿Cuánto cuesta cargar en Voltop?',
      en: 'How much does it cost to charge with Voltop?',
      pt: 'Quanto custa carregar na Voltop?',
    },
    answer: {
      es: 'El precio puede variar según la estación. Antes de iniciar tu carga podrás consultar la tarifa aplicable para saber cuánto cuesta cargar.',
      en: "The price can vary by station. Before you start charging you'll be able to check the applicable rate, so you know what it costs.",
      pt: 'O preço pode variar conforme a estação. Antes de iniciar o carregamento você poderá consultar a tarifa aplicável para saber quanto vai custar.',
    },
  },
  {
    id: 'pago',
    question: {
      es: '¿Cómo puedo pagar una carga?',
      en: 'How do I pay for a charge?',
      pt: 'Como faço para pagar um carregamento?',
    },
    answer: {
      es: 'Puedes gestionar tus pagos directamente desde la app de Voltop. Nuestra experiencia está diseñada para que cargar y pagar sea simple, digital y sin procesos innecesarios.',
      en: 'You can manage your payments right from the Voltop app. Our experience is built so that charging and paying is simple, digital and free of unnecessary steps.',
      pt: 'Você gerencia seus pagamentos diretamente no aplicativo da Voltop. Nossa experiência é feita para que carregar e pagar seja simples, digital e sem processos desnecessários.',
    },
  },
  {
    id: 'ayuda',
    question: {
      es: '¿Qué hago si necesito ayuda durante una carga?',
      en: 'What do I do if I need help during a charge?',
      pt: 'O que faço se precisar de ajuda durante um carregamento?',
    },
    answer: {
      es: 'Estamos para ayudarte. Si tienes algún inconveniente antes, durante o después de una carga, puedes comunicarte con nuestro equipo de soporte a través de los canales disponibles en Voltop.',
      en: "We're here for you. If anything comes up before, during or after a charge, you can reach our support team through Voltop's available channels.",
      pt: 'Estamos aqui para ajudar. Se tiver algum problema antes, durante ou depois de um carregamento, você pode falar com nosso time de suporte pelos canais disponíveis da Voltop.',
    },
    links: [
      {
        label: {
          es: 'Escríbenos por WhatsApp',
          en: 'Message us on WhatsApp',
          pt: 'Fale com a gente no WhatsApp',
        },
        href: externalLinks.whatsapp,
        external: true,
      },
      {
        /* Two paths and not one: WhatsApp handles what is urgent —someone
           stranded at a station— and email serves whatever needs an
           attachment or a written record. Choosing for the user would have
           been worse. */
        label: { es: 'Escríbenos por correo', en: 'Email us', pt: 'Escreva para a gente' },
        href: externalLinks.support,
        external: true,
      },
    ],
  },
]
