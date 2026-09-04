import type { Localized } from '~/core/common/domain/i18n/config'

/**
 * COPY · Empresas
 *
 * Orden obligatorio de la página (§10, §14):
 *   propuesta → selector de caso → capacidades → EVIDENCIA → formulario
 * La evidencia SIEMPRE precede a la petición del dato. No al revés.
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
    eyebrow: {
      es: 'Empresas y espacios',
      en: 'Business and spaces',
      pt: 'Empresas e espaços',
    } satisfies Localized,
    title: {
      /* El diferencial —que lo operamos nosotros— iba enterrado en una cola
         pasiva. El lead de abajo ya detalla diseñar, instalar, operar y
         mantener, así que el titular puede quedarse con el trato. */
      es: 'Tú pones el espacio. Nosotros ponemos la red.',
      en: 'You bring the space. We bring the network.',
      pt: 'Você entra com o espaço. A gente entra com a rede.',
    } satisfies Localized,
    lead: {
      es: 'Diseñamos, instalamos, operamos y mantenemos la infraestructura. Tú defines el objetivo; nosotros nos encargamos de que funcione todos los días.',
      en: 'We design, install, operate and maintain the infrastructure. You set the goal; we make sure it works every single day.',
      pt: 'Projetamos, instalamos, operamos e mantemos a infraestrutura. Você define o objetivo; nós garantimos que funcione todos os dias.',
    } satisfies Localized,
  },

  selector: {
    eyebrow: { es: 'Tu caso', en: 'Your case', pt: 'Seu caso' } satisfies Localized,
    title: {
      es: '¿Qué describe mejor tu situación?',
      en: 'What best describes your situation?',
      pt: 'O que descreve melhor a sua situação?',
    } satisfies Localized,
    lead: {
      es: 'Elige tu caso y verás la propuesta concreta para esa situación.',
      en: "Pick your case and you'll see the specific proposal for it.",
      pt: 'Escolha o seu caso e você verá a proposta específica para ele.',
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
      es: 'El mismo equipo que evalúa el sitio es el que responde cuando algo necesita atención.',
      en: 'The same team that assesses the site is the one that responds when something needs attention.',
      pt: 'O mesmo time que avalia o local é o que responde quando algo precisa de atenção.',
    } satisfies Localized,
    steps: [
      {
        step: '01',
        title: { es: 'Evaluamos', en: 'We assess', pt: 'Avaliamos' } satisfies Localized,
        body: {
          es: 'Visitamos el sitio, revisamos capacidad eléctrica y dimensionamos según uso real esperado.',
          en: 'We visit the site, review electrical capacity and size the solution around real expected usage.',
          pt: 'Visitamos o local, avaliamos a capacidade elétrica e dimensionamos a solução pelo uso real esperado.',
        } satisfies Localized,
      },
      {
        step: '02',
        title: { es: 'Instalamos', en: 'We install', pt: 'Instalamos' } satisfies Localized,
        body: {
          es: 'Obra civil, conexión, equipos y puesta en marcha, con la señalización y la seguridad del sitio resueltas.',
          en: 'Civil works, connection, hardware and commissioning, with site signage and safety resolved.',
          pt: 'Obra civil, conexão, equipamentos e comissionamento, com sinalização e segurança do local resolvidas.',
        } satisfies Localized,
      },
      {
        step: '03',
        title: { es: 'Operamos', en: 'We operate', pt: 'Operamos' } satisfies Localized,
        body: {
          es: 'Monitoreo, atención a usuarios, mantenimiento preventivo y correctivo. La estación es responsabilidad nuestra.',
          en: 'Monitoring, user support, preventive and corrective maintenance. The station is our responsibility.',
          pt: 'Monitoramento, suporte ao usuário, manutenção preventiva e corretiva. A estação é responsabilidade nossa.',
        } satisfies Localized,
      },
      {
        step: '04',
        title: { es: 'Reportamos', en: 'We report', pt: 'Reportamos' } satisfies Localized,
        body: {
          es: 'Energía entregada, sesiones, disponibilidad y uso por perfil, en un reporte que puedes llevar a tu comité.',
          en: 'Energy delivered, sessions, availability and usage by profile, in a report you can take to your committee.',
          pt: 'Energia entregue, sessões, disponibilidade e uso por perfil, em um relatório que você leva para o seu comitê.',
        } satisfies Localized,
      },
    ],
  },

  /** EVIDENCIA — precede al formulario. Sin esto, la página no se publica. */
  proof: {
    eyebrow: { es: 'Evidencia', en: 'Evidence', pt: 'Evidência' } satisfies Localized,
    title: {
      es: 'Ya está funcionando',
      en: "It's already working",
      pt: 'Já está funcionando',
    } satisfies Localized,
    challengeLabel: { es: 'El reto', en: 'The challenge', pt: 'O desafio' } satisfies Localized,
    solutionLabel: {
      es: 'Lo que hicimos',
      en: 'What we did',
      pt: 'O que fizemos',
    } satisfies Localized,
    seeStation: {
      es: 'Ver la estación',
      en: 'See the station',
      pt: 'Ver a estação',
    } satisfies Localized,
  },

  contact: {
    eyebrow: { es: 'Hablemos', en: "Let's talk", pt: 'Vamos conversar' } satisfies Localized,
    title: {
      es: 'Cuéntanos tu caso',
      en: 'Tell us your case',
      pt: 'Conte o seu caso',
    } satisfies Localized,
    /**
     * QUÉ PASA DESPUÉS. La columna izquierda del bloque de contacto tenía un
     * antetítulo, un titular y ~600px de vacío al lado de un formulario alto.
     * Ese es exactamente el espacio donde va lo que reduce la fricción del lead.
     *
     * Deliberadamente SIN compromiso de plazo: mientras no exista integración de
     * CRM, prometer un tiempo de respuesta es la misma falta que el estado de
     * éxito que se corrigió en el Bloque 7.
     */
    nextTitle: {
      es: 'Qué pasa después',
      en: 'What happens next',
      pt: 'O que acontece depois',
    } satisfies Localized,
    next: [
      {
        step: '01',
        title: {
          es: 'Revisamos tu caso',
          en: 'We review your case',
          pt: 'Analisamos o seu caso',
        } satisfies Localized,
        body: {
          es: 'Un especialista lee lo que nos cuentas y mira si tu sitio encaja con lo que sabemos operar bien.',
          en: 'A specialist reads what you send and checks whether your site fits what we know how to run well.',
          pt: 'Um especialista lê o que você enviar e avalia se o seu espaço se encaixa no que sabemos operar bem.',
        } satisfies Localized,
      },
      {
        step: '02',
        title: {
          es: 'Hablamos del sitio',
          en: 'We talk about the site',
          pt: 'Conversamos sobre o local',
        } satisfies Localized,
        body: {
          es: 'Una conversación corta para entender el parqueadero, la capacidad eléctrica y quién va a cargar.',
          en: 'A short conversation to understand the parking, the electrical capacity and who will charge.',
          pt: 'Uma conversa rápida para entender o estacionamento, a capacidade elétrica e quem vai carregar.',
        } satisfies Localized,
      },
      {
        step: '03',
        title: {
          es: 'Recibes una propuesta',
          en: 'You get a proposal',
          pt: 'Você recebe uma proposta',
        } satisfies Localized,
        body: {
          es: 'Con potencia, número de puntos y modelo comercial concretos para tu caso. Sin compromiso.',
          en: 'With specific power, number of points and commercial model for your case. No commitment.',
          pt: 'Com potência, número de pontos e modelo comercial específicos para o seu caso. Sem compromisso.',
        } satisfies Localized,
      },
    ],
    privacyNote: {
      es: 'Usamos tus datos solo para responder a esta solicitud.',
      en: 'We use your data only to respond to this request.',
      pt: 'Usamos seus dados apenas para responder a esta solicitação.',
    } satisfies Localized,
  },
}
