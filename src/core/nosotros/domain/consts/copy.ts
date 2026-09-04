import type { Localized } from '~/core/common/domain/i18n/config'

/**
 * COPY · About
 *
 * Goal: credibility. History, scale, infrastructure, leadership, impact. It is
 * the page where the detail the home page only hints at lives (§14).
 *
 * Content note: the history milestones describe the nature of the journey
 * without invented dates or figures. They get completed when the business
 * delivers the data (open decision O6).
 */

export const nosotros = {
  meta: {
    title: { es: 'Nosotros', en: 'About us', pt: 'Sobre nós' } satisfies Localized,
    description: {
      es: 'Voltop construye y opera la infraestructura de carga para vehículos eléctricos de Colombia. Nuestra historia, nuestra red y el equipo detrás.',
      en: "Voltop builds and operates Colombia's EV charging infrastructure. Our story, our network and the team behind it.",
      pt: 'A Voltop constrói e opera a infraestrutura de carregamento elétrico da Colômbia. Nossa história, nossa rede e o time por trás dela.',
    } satisfies Localized,
  },

  hero: {
    eyebrow: { es: 'Nosotros', en: 'About us', pt: 'Sobre nós' } satisfies Localized,
    title: {
      es: 'Un país no se electrifica sin dónde cargar.',
      en: 'No country goes electric without somewhere to charge.',
      pt: 'Nenhum país se eletrifica sem onde carregar.',
    } satisfies Localized,
    lead: {
      /* The idea from the old lead moved up into the headline, which is where
         things get remembered. That frees the lead to introduce the technology
         layer on the page where credibility is built. */
      es: 'Voltop construye y opera esa parte: una red de carga rápida en las ciudades del país, con la tecnología que la hace simple de usar.',
      en: "Voltop builds and runs that part: a fast-charging network across the country's cities, with the technology that makes it simple to use.",
      pt: 'A Voltop constrói e opera essa parte: uma rede de carregamento rápido nas cidades do país, com a tecnologia que a torna simples de usar.',
    } satisfies Localized,
  },

  story: {
    eyebrow: { es: 'Historia', en: 'Story', pt: 'História' } satisfies Localized,
    title: {
      es: 'Empezamos por lo difícil',
      en: 'We started with the hard part',
      pt: 'Começamos pela parte difícil',
    } satisfies Localized,
    body: [
      {
        es: 'Instalar un cargador es sencillo. Sostener una red que funcione todos los días —con potencia real, disponible, mantenida y en sitios donde la gente ya se detiene— es otra cosa.',
        en: 'Installing a charger is simple. Sustaining a network that works every day — with real power, available, maintained, and in places where people already stop — is another matter.',
        pt: 'Instalar um carregador é simples. Sustentar uma rede que funciona todos os dias — com potência real, disponível, mantida e em lugares onde as pessoas já param — é outra história.',
      },
      {
        es: 'Voltop se construyó alrededor de esa diferencia: operar, no solo instalar. Por eso cada estación es un compromiso de largo plazo con el lugar que la aloja y con quien la usa.',
        en: "Voltop was built around that difference: to operate, not just install. That's why every station is a long-term commitment to the place that hosts it and to the people who use it.",
        pt: 'A Voltop foi construída em torno dessa diferença: operar, não apenas instalar. Por isso cada estação é um compromisso de longo prazo com o lugar que a recebe e com as pessoas que a usam.',
      },
    ] satisfies Localized[],
  },

  infrastructure: {
    eyebrow: {
      es: 'Cómo construimos',
      en: 'How we build',
      pt: 'Como construímos',
    } satisfies Localized,
    title: {
      es: 'Criterios que no negociamos',
      en: "Criteria we don't negotiate",
      pt: 'Critérios que não negociamos',
    } satisfies Localized,
    pillars: [
      {
        title: {
          es: 'El lugar antes que el equipo',
          en: 'The place before the hardware',
          pt: 'O lugar antes do equipamento',
        } satisfies Localized,
        body: {
          es: 'Elegimos ubicaciones donde detenerse ya tiene sentido. Un cargador en un sitio equivocado no se usa, por bueno que sea.',
          en: 'We choose locations where stopping already makes sense. A charger in the wrong place goes unused, however good it is.',
          pt: 'Escolhemos locais onde parar já faz sentido. Um carregador no lugar errado fica sem uso, por melhor que seja.',
        } satisfies Localized,
      },
      {
        title: {
          es: 'Potencia que corresponde al uso',
          en: 'Power matched to usage',
          pt: 'Potência dimensionada para o uso',
        } satisfies Localized,
        body: {
          es: 'La velocidad se dimensiona según cuánto tiempo va a estar allí el vehículo, no según lo que suene mejor en una ficha.',
          en: 'Speed is sized around how long the vehicle will actually be there, not around what sounds best on a spec sheet.',
          pt: 'A velocidade é dimensionada pelo tempo que o veículo realmente vai ficar ali, não pelo que soa melhor em uma ficha técnica.',
        } satisfies Localized,
      },
      {
        title: {
          es: 'Operación propia',
          en: 'In-house operation',
          pt: 'Operação própria',
        } satisfies Localized,
        body: {
          es: 'Monitoreamos, mantenemos y respondemos nosotros. La disponibilidad es la promesa central del negocio.',
          en: 'We monitor, maintain and respond ourselves. Availability is the core promise of the business.',
          pt: 'Monitoramos, mantemos e respondemos nós mesmos. A disponibilidade é a promessa central do negócio.',
        } satisfies Localized,
      },
      {
        title: {
          es: 'Diseñada para crecer',
          en: 'Built to grow',
          pt: 'Feita para crescer',
        } satisfies Localized,
        body: {
          es: 'Cada sitio se proyecta con capacidad para ampliarse cuando la demanda lo pida, sin rehacer la instalación.',
          en: 'Every site is planned with room to expand when demand calls for it, without redoing the installation.',
          pt: 'Cada local é planejado com espaço para expandir quando a demanda pedir, sem refazer a instalação.',
        } satisfies Localized,
      },
    ],
  },

  impact: {
    eyebrow: { es: 'Impacto', en: 'Impact', pt: 'Impacto' } satisfies Localized,
    title: {
      es: 'Una red que crece con el país',
      en: 'A network growing with the country',
      pt: 'Uma rede que cresce junto com o país',
    } satisfies Localized,
    lead: {
      /* This used to announce figures, and right below it came "Cifras en
         validación: preferimos no publicar una imprecisa". The page
         contradicted itself on screen; now the restraint IS the message. */
      es: 'Medimos el avance de la red con datos de operación, no con estimaciones.',
      en: "We measure the network's progress with operational data, not estimates.",
      pt: 'Medimos o avanço da rede com dados de operação, não com estimativas.',
    } satisfies Localized,
    /** Honest state while the figures are not validated (§33). */
    pendingTitle: {
      es: 'Cifras en validación',
      en: 'Figures under validation',
      pt: 'Números em validação',
    } satisfies Localized,
    pendingBody: {
      es: 'Estamos consolidando y verificando los datos de operación antes de publicarlos. Preferimos no publicar una cifra a publicar una imprecisa.',
      en: "We're consolidating and verifying operational data before publishing it. We'd rather publish no figure than an inaccurate one.",
      pt: 'Estamos consolidando e verificando os dados de operação antes de publicá-los. Preferimos não publicar número algum a publicar um número impreciso.',
    } satisfies Localized,
  },

  leadership: {
    eyebrow: { es: 'Liderazgo', en: 'Leadership', pt: 'Liderança' } satisfies Localized,
    title: {
      es: 'Quién está detrás',
      en: "Who's behind it",
      pt: 'Quem está por trás',
    } satisfies Localized,
  },

  trust: {
    eyebrow: { es: 'Confianza', en: 'Trust', pt: 'Confiança' } satisfies Localized,
    /* The previous Portuguese ("O que dizem quem…") was ungrammatical. */
    title: {
      es: 'Lo dicen ellos, no nosotros.',
      en: 'Their words, not ours.',
      pt: 'As palavras são deles, não nossas.',
    } satisfies Localized,
    partnersTitle: {
      es: 'Espacios y organizaciones aliadas',
      en: 'Partner spaces and organizations',
      pt: 'Espaços e organizações parceiras',
    } satisfies Localized,
  },
}
