import type { Localized } from '~/core/common/domain/i18n/config'

/**
 * COPY · Business
 *
 * Mandatory page order (§10, §14):
 *   proposition → case selector → capabilities → EVIDENCE → form
 * Evidence ALWAYS precedes asking for the user's data. Never the other way
 * round.
 */

export const empresas = {
  meta: {
    title: {
      es: 'Soluciones para empresas',
      en: 'Business solutions',
      pt: 'Soluções para empresas',
    } satisfies Localized,
    description: {
      es: 'Infraestructura de carga para empresas, flotas, espacios comerciales y partners. Instalamos, operamos y mantenemos de principio a fin.',
      en: 'Charging infrastructure for companies, fleets, commercial spaces and partners. We install, operate and maintain end to end.',
      pt: 'Infraestrutura de carregamento para empresas, frotas, espaços comerciais e parceiros. Instalamos, operamos e mantemos de ponta a ponta.',
    } satisfies Localized,
  },

  hero: {
    /* ── THIS HERO NOW ECHOES HOME BEAT 4, AND THAT IS THE DECISION ────────
       Editorial decision of 2026-09-08. The Home's beat 4 carries the same
       eyebrow, an almost identical headline and a lead that differs by two
       words. Someone clicking "Ver soluciones" from the Home lands on a page
       that repeats what they just read.

       It is deliberate: the beat previews the page and the echo confirms you
       arrived where you meant to. The one difference carries the shift of
       register — the Home DESCRIBES ("Llevamos la carga eléctrica a tu
       negocio") and this page INVITES ("Lleva la carga eléctrica a tu
       negocio") — and the lead adds "y mantenemos", which is what this page
       goes on to prove and the beat only summarises.

       Written down because it reads like an oversight and is not one. **If the
       Home beat's copy changes, this one has to be looked at in the same
       pass**, or the echo turns into a contradiction. */
    eyebrow: {
      es: 'Soluciones para empresas',
      en: 'Business solutions',
      pt: 'Soluções para empresas',
    } satisfies Localized,
    title: {
      es: 'Lleva la carga eléctrica a tu negocio',
      en: 'Bring EV charging to your business',
      pt: 'Leve o carregamento elétrico ao seu negócio',
    } satisfies Localized,
    lead: {
      es: 'Diseñamos, instalamos, operamos y mantenemos infraestructura de carga para empresas, flotas y espacios comerciales. Voltop se encarga de la operación para que tú te enfoques en tu negocio.',
      en: 'We design, install, operate and maintain charging infrastructure for companies, fleets and commercial spaces. Voltop runs the operation so you can focus on your business.',
      pt: 'Projetamos, instalamos, operamos e mantemos infraestrutura de carregamento para empresas, frotas e espaços comerciais. A Voltop cuida da operação para que você foque no seu negócio.',
    } satisfies Localized,
  },

  selector: {
    /* It used to ask "¿Qué describe mejor tu situación?" and explain the
       mechanism ("elige tu caso y verás la propuesta"). Two things were wrong
       with that: the question made the reader classify themselves before being
       offered anything, and the lead described the interface they are already
       looking at instead of saying what the four cases have in common.

       The eyebrow also stopped being "Tu caso" — a label about the CONTROL —
       and now names what the section holds. */
    eyebrow: {
      es: 'Soluciones para cada necesidad',
      en: 'A solution for every need',
      pt: 'Soluções para cada necessidade',
    } satisfies Localized,
    title: {
      es: 'Donde necesites cargar, hacemos que pase.',
      en: 'Wherever you need to charge, we make it happen.',
      pt: 'Onde você precisar carregar, a gente faz acontecer.',
    } satisfies Localized,
    lead: {
      es: 'Para tu empresa, tu flota o tu espacio. Voltop diseña, instala y opera la infraestructura para hacerlo posible.',
      en: 'For your company, your fleet or your space. Voltop designs, installs and operates the infrastructure that makes it possible.',
      pt: 'Para sua empresa, sua frota ou seu espaço. A Voltop projeta, instala e opera a infraestrutura para tornar isso possível.',
    } satisfies Localized,
    benefitsTitle: {
      es: 'Qué incluye',
      en: "What's included",
      pt: 'O que está incluído',
    } satisfies Localized,
  },

  capabilities: {
    eyebrow: {
      es: 'Cómo trabajamos',
      en: 'How we work',
      pt: 'Como trabalhamos',
    } satisfies Localized,
    title: {
      es: 'De principio a fin',
      en: 'End to end',
      pt: 'De ponta a ponta',
    } satisfies Localized,
    lead: {
      /* It said "el mismo equipo que evalúa el sitio es el que responde" — a
         claim about our internal organisation, made before the four steps have
         explained what the process even is. It now names the arc the steps go
         on to detail, so the lead introduces and the steps deliver. */
      es: 'Nos encargamos de todo el proceso: desde evaluar el espacio hasta operar y mantener la infraestructura de carga.',
      en: 'We handle the whole process: from assessing the space to operating and maintaining the charging infrastructure.',
      pt: 'Cuidamos de todo o processo: desde avaliar o espaço até operar e manter a infraestrutura de carregamento.',
    } satisfies Localized,
    steps: [
      {
        step: '01',
        title: { es: 'Evaluamos', en: 'We assess', pt: 'Avaliamos' } satisfies Localized,
        body: {
          es: 'Analizamos tu espacio, la capacidad eléctrica y las necesidades de operación para definir la solución adecuada.',
          en: 'We analyse your space, its electrical capacity and your operating needs to define the right solution.',
          pt: 'Analisamos seu espaço, a capacidade elétrica e as necessidades de operação para definir a solução adequada.',
        } satisfies Localized,
      },
      {
        step: '02',
        title: { es: 'Instalamos', en: 'We install', pt: 'Instalamos' } satisfies Localized,
        body: {
          /* It dropped "obra civil": that is our vocabulary for the work, not
             the reader's for the outcome, and it opened the sentence with the
             heaviest word in it. */
          es: 'Nos encargamos de la instalación, conexión, equipos, señalización y puesta en marcha de la infraestructura.',
          en: 'We take care of installation, connection, hardware, signage and commissioning of the infrastructure.',
          pt: 'Cuidamos da instalação, conexão, equipamentos, sinalização e comissionamento da infraestrutura.',
        } satisfies Localized,
      },
      {
        step: '03',
        title: { es: 'Operamos', en: 'We operate', pt: 'Operamos' } satisfies Localized,
        body: {
          es: 'Monitoreamos la estación, atendemos a los usuarios y gestionamos el mantenimiento para mantenerla en operación.',
          en: 'We monitor the station, support its users and manage maintenance to keep it running.',
          pt: 'Monitoramos a estação, atendemos os usuários e gerenciamos a manutenção para mantê-la em operação.',
        } satisfies Localized,
      },
      {
        step: '04',
        title: { es: 'Reportamos', en: 'We report', pt: 'Reportamos' } satisfies Localized,
        body: {
          /* No metric names invented and none promised as a figure: it says
             WHAT you get visibility over —use, sessions, energy— and stops
             there. The previous version added "disponibilidad y uso por perfil"
             and "un reporte que puedes llevar a tu comité": the first is a
             breakdown nobody has confirmed exists, the second a use case put in
             the reader's mouth. */
          es: 'Te damos visibilidad sobre el uso de la infraestructura, las sesiones de carga y la energía entregada.',
          en: 'We give you visibility over how the infrastructure is used, the charging sessions and the energy delivered.',
          pt: 'Damos visibilidade sobre o uso da infraestrutura, as sessões de carga e a energia entregue.',
        } satisfies Localized,
      },
    ],
  },

  /** EVIDENCE — precedes the form. Without this, the page does not ship. */
  proof: {
    /* "Caso real" and not "Evidencia": the second names the FUNCTION this beat
       has in the page's argument —§10 puts evidence before the form— and the
       reader does not need to be told they are looking at evidence. It is the
       same eyebrow the Home's beat 5 uses for the same client, which is
       deliberate: one case, one label. */
    eyebrow: { es: 'Caso real', en: 'Real case', pt: 'Caso real' } satisfies Localized,
    title: {
      es: 'Una solución que ya está en movimiento.',
      en: "A solution that's already in motion.",
      pt: 'Uma solução que já está em movimento.',
    } satisfies Localized,
    challengeLabel: { es: 'El reto', en: 'The challenge', pt: 'O desafio' } satisfies Localized,
    /* "La solución" pairs with "El reto": two nouns, the same shape. It said
       "Lo que hicimos", which answered a different question —what we did— next
       to a label that stated a problem. */
    solutionLabel: {
      es: 'La solución',
      en: 'The solution',
      pt: 'A solução',
    } satisfies Localized,
    /* The quote had no label. With "El reto" and "La solución" above it in the
       same size, the third block was the only one arriving unannounced, and on
       a two-column layout it read as a pull quote rather than as the third part
       of one argument. */
    testimonialLabel: {
      es: 'Testimonio',
      en: 'Testimonial',
      pt: 'Depoimento',
    } satisfies Localized,
    /* "Conoce la estación", not `actions.seeStation`'s "Conoce esta estación":
       the demonstrative works when the station is the subject on screen, and
       here the subject is the case. Same distinction already recorded for the
       foot of a news entry. */
    seeStation: {
      es: 'Conoce la estación',
      en: 'See the station',
      pt: 'Conheça a estação',
    } satisfies Localized,
  },

  contact: {
    eyebrow: { es: 'Hablemos', en: "Let's talk", pt: 'Vamos conversar' } satisfies Localized,
    title: {
      es: 'Cuéntanos qué tienes en mente',
      en: 'Tell us what you have in mind',
      pt: 'Conte o que você tem em mente',
    } satisfies Localized,
    /**
     * WHAT HAPPENS NEXT. The left column of the contact block had an eyebrow,
     * a headline and ~600px of emptiness beside a tall form. That is exactly
     * the space where whatever reduces the lead's friction belongs.
     *
     * Deliberately WITHOUT a turnaround commitment: while there is no CRM
     * integration, promising a response time is the same offence as the
     * success state that was corrected in Block 7.
     */
    /* Con signos de interrogación: es la pregunta que se hace quien está a
       punto de dejar sus datos, y formulada como pregunta se reconoce antes que
       como enunciado. */
    nextTitle: {
      es: '¿Qué pasa después?',
      en: 'What happens next?',
      pt: 'O que acontece depois?',
    } satisfies Localized,
    next: [
      {
        step: '01',
        title: {
          es: 'Revisamos tu solicitud',
          en: 'We review your request',
          pt: 'Analisamos sua solicitação',
        } satisfies Localized,
        body: {
          /* Ya no dice "mira si tu sitio encaja con lo que sabemos operar
             bien": eso introducía un filtro —puede que no encajes— en el paso
             que existe para reducir la fricción de dejar los datos. */
          es: 'Nuestro equipo revisa la información y se pone en contacto contigo.',
          en: 'Our team reviews the information and gets in touch with you.',
          pt: 'Nossa equipe analisa as informações e entra em contato com você.',
        } satisfies Localized,
      },
      {
        step: '02',
        title: {
          es: 'Entendemos tu operación',
          en: 'We understand your operation',
          pt: 'Entendemos sua operação',
        } satisfies Localized,
        body: {
          es: 'Conversamos sobre el espacio, la capacidad eléctrica y cómo necesitas usar la infraestructura.',
          en: 'We talk about the space, the electrical capacity and how you need to use the infrastructure.',
          pt: 'Conversamos sobre o espaço, a capacidade elétrica e como você precisa usar a infraestrutura.',
        } satisfies Localized,
      },
      {
        step: '03',
        title: {
          es: 'Preparamos una propuesta',
          en: 'We prepare a proposal',
          pt: 'Preparamos uma proposta',
        } satisfies Localized,
        body: {
          /* Sale "modelo comercial" y sale "Sin compromiso": el primero
             prometía una cifra comercial en un paso que solo describe el
             proceso, y el segundo es una condición que esta página no publica.
             Queda lo que sí se define: infraestructura y modelo de operación. */
          es: 'Definimos la infraestructura y el modelo de operación que mejor se ajustan a tu proyecto.',
          en: 'We define the infrastructure and the operating model that best fit your project.',
          pt: 'Definimos a infraestrutura e o modelo de operação que melhor se ajustam ao seu projeto.',
        } satisfies Localized,
      },
    ],
  },
}
