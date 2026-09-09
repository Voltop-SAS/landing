import type { Localized } from '~/core/common/domain/i18n/config'

/**
 * COPY · About
 *
 * Goal: credibility. The page is one continuous narrative, in this order:
 * why Voltop exists → what we learned → how we build → what we're achieving →
 * where we're going. Copy delivered by Camilo on 2026-09-08; the Spanish is
 * verbatim, English and Portuguese are translations of it.
 *
 * The narrative order is why `leadership` now reads VISIÓN and closes looking
 * forward instead of introducing a person: the founder's quote is the ending of
 * the story, not a bio.
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
      es: 'La movilidad eléctrica necesita una red que crezca con ella.',
      en: 'Electric mobility needs a network that grows with it.',
      pt: 'A mobilidade elétrica precisa de uma rede que cresça com ela.',
    } satisfies Localized,
    lead: {
      es: 'Colombia avanza hacia una nueva forma de moverse. Para que ese cambio sea posible, necesitamos infraestructura de carga confiable, fácil de usar y cada vez más presente.',
      en: 'Colombia is moving toward a new way of getting around. For that shift to be possible, we need charging infrastructure that is reliable, easy to use and increasingly present.',
      pt: 'A Colômbia avança rumo a uma nova forma de se locomover. Para que essa mudança seja possível, precisamos de infraestrutura de carregamento confiável, fácil de usar e cada vez mais presente.',
    } satisfies Localized,
    /* The delivered copy marks this line as a highlight, so it is its own
       string: it renders in `text-ink` while the two paragraphs around it stay
       in `text-ink-2`. Same component, same tokens — the emphasis is the copy's,
       not a new design. */
    highlight: {
      es: 'Ahí entra Voltop.',
      en: "That's where Voltop comes in.",
      pt: 'É aí que entra a Voltop.',
    } satisfies Localized,
    leadEnd: {
      es: 'Construimos y operamos la red que acompaña ese cambio.',
      en: 'We build and operate the network that supports that shift.',
      pt: 'Construímos e operamos a rede que acompanha essa mudança.',
    } satisfies Localized,
  },

  story: {
    eyebrow: { es: 'Historia', en: 'Story', pt: 'História' } satisfies Localized,
    title: {
      es: 'Empezamos por hacer que funcione.',
      en: 'We started by making it work.',
      pt: 'Começamos por fazer que funcione.',
    } satisfies Localized,
    body: [
      {
        es: 'Entendimos que instalar cargadores era solo una parte del reto. Lo importante era construir una red que las personas pudieran encontrar, usar y en la que pudieran confiar todos los días.',
        en: 'We learned that installing chargers was only part of the challenge. What mattered was building a network people could find, use and rely on every day.',
        pt: 'Entendemos que instalar carregadores era apenas parte do desafio. O importante era construir uma rede que as pessoas pudessem encontrar, usar e na qual pudessem confiar todos os dias.',
      },
      {
        es: 'Por eso Voltop nació para hacer algo más que instalar infraestructura: operarla, mantenerla y hacerla crecer.',
        en: 'That is why Voltop was born to do more than install infrastructure: to operate it, maintain it and make it grow.',
        pt: 'Por isso a Voltop nasceu para fazer algo mais do que instalar infraestrutura: operá-la, mantê-la e fazê-la crescer.',
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
      es: 'Una red pensada para funcionar.',
      en: 'A network designed to work.',
      pt: 'Uma rede pensada para funcionar.',
    } satisfies Localized,
    pillars: [
      {
        title: {
          es: 'El lugar importa',
          en: 'The place matters',
          pt: 'O lugar importa',
        } satisfies Localized,
        body: {
          es: 'Elegimos ubicaciones donde la carga se integra naturalmente al tiempo y al recorrido de las personas.',
          en: "We choose locations where charging fits naturally into people's time and route.",
          pt: 'Escolhemos locais onde o carregamento se integra naturalmente ao tempo e ao trajeto das pessoas.',
        } satisfies Localized,
      },
      {
        title: {
          es: 'La potencia tiene un propósito',
          en: 'Power has a purpose',
          pt: 'A potência tem um propósito',
        } satisfies Localized,
        body: {
          es: 'Dimensionamos cada estación según el uso esperado, el tiempo de permanencia y las necesidades de cada ubicación.',
          en: 'We size each station around expected usage, dwell time and the needs of each location.',
          pt: 'Dimensionamos cada estação conforme o uso esperado, o tempo de permanência e as necessidades de cada local.',
        } satisfies Localized,
      },
      {
        title: {
          es: 'Operamos lo que construimos',
          en: 'We operate what we build',
          pt: 'Operamos o que construímos',
        } satisfies Localized,
        body: {
          es: 'Monitoreamos, mantenemos y atendemos nuestra infraestructura para mantenerla disponible.',
          en: 'We monitor, maintain and service our infrastructure to keep it available.',
          pt: 'Monitoramos, mantemos e atendemos nossa infraestrutura para mantê-la disponível.',
        } satisfies Localized,
      },
      {
        title: {
          es: 'Pensamos en lo que sigue',
          en: 'We plan for what comes next',
          pt: 'Pensamos no que vem a seguir',
        } satisfies Localized,
        body: {
          es: 'Diseñamos cada ubicación con capacidad de crecer a medida que aumenta la demanda.',
          en: 'We design every location with the capacity to grow as demand increases.',
          pt: 'Projetamos cada local com capacidade de crescer à medida que a demanda aumenta.',
        } satisfies Localized,
      },
    ],
  },

  impact: {
    eyebrow: { es: 'Impacto', en: 'Impact', pt: 'Impacto' } satisfies Localized,
    title: {
      es: 'Una red que crece con el país.',
      en: 'A network growing with the country.',
      pt: 'Uma rede que cresce junto com o país.',
    } satisfies Localized,
    lead: {
      es: 'Nuestra red ya está en operación en Bogotá y Medellín, y seguimos trabajando para llevar la carga eléctrica a más lugares de Colombia.',
      en: 'Our network is already operating in Bogotá and Medellín, and we keep working to bring electric charging to more places across Colombia.',
      pt: 'Nossa rede já está em operação em Bogotá e Medellín, e seguimos trabalhando para levar o carregamento elétrico a mais lugares da Colômbia.',
    } satisfies Localized,
    /* Honest state while the figures are not validated (§33). NOT rendered
       right now — see SHOW_PENDING_FIGURES in the page. Kept because the
       block comes back the day the figures are verified. */
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
    eyebrow: { es: 'Visión', en: 'Vision', pt: 'Visão' } satisfies Localized,
    title: {
      es: 'Estamos construyendo para lo que viene.',
      en: "We're building for what's coming.",
      pt: 'Estamos construindo para o que vem.',
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
