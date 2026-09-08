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
 * ── AVAILABILITY: THE CONTRADICTION IS CLOSED ────────────────────────────
 * Answer 2 offers "availability" and answer 1 talks about the session "in real
 * time". Until 2026-09-08 that clashed with `states.pendingRealtime`, which
 * warned two sections up that live status was not integrated: the same page
 * promised and denied the same thing.
 * Camilo confirmed the app does show live status, so that warning became
 * `states.realtimeInApp` and now says the same as these two answers. The three
 * strings make ONE promise, and if it stops being true all three change.
 * Nothing is wired to the operation: the text lives in the front end and is
 * edited here.
 *
 * ── TWO LINKS THAT NOW DO EXIST ──────────────────────────────────────────
 * Support: WhatsApp +57 315 986 4931, operated through Freshchat. It is
 * published as `wa.me`, NOT as `tel:`. A `tel:` starts a phone CALL; the
 * support channel is the WhatsApp conversation, and `wa.me` is what opens it.
 *
 * App download: https://app.voltop.co/ — RESOLVED. While first implementing
 * this it returned 503 on three consecutive attempts, and the comment left it
 * as pending verification before launch. Checked on 2026-09-03 and again on
 * 2026-09-08: it answers 307 to `/download` and serves a real download page.
 * Kept written down because the note said the opposite for days, and a stale
 * warning sends whoever reads it chasing a problem that no longer exists.
 */

import type { FaqItem } from '~/core/network/domain/entities/FaqItem'

export const faq: FaqItem[] = [
  {
    id: 'como-cargar',
    question: {
      /* "carro eléctrico" and not "vehículo": the second is fleet vocabulary,
         and this page answers someone who drives one car. */
      es: '¿Cómo cargo mi carro eléctrico con Voltop?',
      en: 'How do I charge my electric car with Voltop?',
      pt: 'Como carrego meu carro elétrico com a Voltop?',
    },
    answer: {
      /* Names the QR, which is the actual gesture at the station and what
         step 02 of "cómo cargar" says two sections up. Same act, same words. */
      es: 'Encuentra una estación, conecta tu carro y escanea el código QR del cargador desde la app Voltop. Desde ahí puedes iniciar y seguir tu sesión de carga.',
      en: "Find a station, plug in your car and scan the charger's QR code from the Voltop app. From there you can start and track your charging session.",
      pt: 'Encontre uma estação, conecte seu carro e escaneie o código QR do carregador pelo aplicativo Voltop. De lá você inicia e acompanha sua sessão de carga.',
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
      es: '¿Dónde encuentro las estaciones de carga Voltop?',
      en: 'Where can I find Voltop charging stations?',
      pt: 'Onde encontro as estações de carregamento Voltop?',
    },
    answer: {
      /* ⚠️ THIRD PLACE where the cities are hand-written, with `hero.lead` and
         `cities.lead`. The day a third one opens, the three say there are two.
         `getCitiesWithStations()` has the real list. Editorial decision of
         2026-09-08; whoever opens that city comes back to the three strings. */
      es: 'Puedes consultar nuestra red de estaciones en Bogotá y Medellín desde la sección Red. En la app Voltop también puedes consultar la disponibilidad antes de dirigirte a una estación.',
      en: 'You can browse our network of stations in Bogotá and Medellín in the Network section. In the Voltop app you can also check availability before heading to a station.',
      pt: 'Você pode consultar nossa rede de estações em Bogotá e Medellín na seção Rede. No aplicativo Voltop também pode consultar a disponibilidade antes de ir a uma estação.',
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
      /* NO FIGURE, and that is not a gap: the tariff is not published (see the
         pending list in the punto de retomada). It describes where to look it
         up, which is the only thing that is true today. */
      es: 'El costo de la carga puede variar según la estación. Puedes consultar la información correspondiente desde la app Voltop.',
      en: 'The cost of a charge can vary by station. You can check the details in the Voltop app.',
      pt: 'O custo da carga pode variar conforme a estação. Você pode consultar a informação no aplicativo Voltop.',
    },
  },
  {
    id: 'pago',
    question: {
      es: '¿Cómo pago una carga?',
      en: 'How do I pay for a charge?',
      pt: 'Como pago uma carga?',
    },
    answer: {
      /* It used to close with "simple, digital y sin procesos innecesarios" —
         three adjectives about ourselves inside an answer about a mechanism.
         Someone asking how they pay wants the mechanism. Now that is all it
         gives, and it matches §19: the registered payment method, confirmed by
         product. */
      es: 'El pago se realiza desde la app Voltop con el método de pago que tengas registrado.',
      en: 'Payment is made in the Voltop app with the payment method you have on file.',
      pt: 'O pagamento é feito no aplicativo Voltop com o método de pagamento que você tiver cadastrado.',
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
      /* "los canales disponibles en Voltop" named nothing: the two links below
         ARE the channels, and the sentence was describing them instead of
         letting them work. §19 asks that help be actionable. */
      es: 'Si tienes algún inconveniente durante tu sesión, puedes comunicarte con nuestro equipo de soporte para recibir ayuda.',
      en: 'If you run into any trouble during your session, you can contact our support team for help.',
      pt: 'Se tiver algum problema durante sua sessão, você pode falar com nosso time de suporte para receber ajuda.',
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
