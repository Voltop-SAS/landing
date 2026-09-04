import type { Localized } from '~/core/common/domain/i18n/config'

/**
 * COPY · Home
 *
 * A 7-beat narrative. See docs/MASTER-PROJECT-DEFINITION.md §14 and §12.
 *
 * COMPOSITION RULE: two consecutive beats do NOT share a structure.
 * The structural sequence is deliberate and annotated on each beat:
 *   1 full-bleed · 2 sticky scrub · 3 wide index · 4 narrow column
 *   5 full-bleed with text over it · 6 narrow editorial column · 7 asymmetric
 *
 * The home page PRESENTS. No section here resolves what an inner page
 * resolves.
 */

export const home = {
  meta: {
    title: {
      es: 'Voltop · La red de carga que mueve a Colombia',
      en: 'Voltop · The charging network that moves Colombia',
      pt: 'Voltop · A rede de carregamento que move a Colômbia',
    } satisfies Localized,
    description: {
      /* This is the search result. It used to open with "Infraestructura",
         which nobody types, and it named neither the cities people do search
         for nor the app. */
      es: 'Carga rápida para carros eléctricos en Bogotá y Medellín. Encuentra estación, actívala con la app y sigue tu día. También soluciones para empresas y flotas.',
      en: 'Fast charging for electric cars in Bogotá and Medellín. Find a station, start it from the app and get on with your day. Plus solutions for companies and fleets.',
      pt: 'Carregamento rápido para carros elétricos em Bogotá e Medellín. Encontre uma estação, ative pelo app e siga o seu dia. E também soluções para empresas e frotas.',
    } satisfies Localized,
  },

  /* BEAT 1 · HERO — full-bleed over real infrastructure. Intensity: High */
  hero: {
    eyebrow: {
      es: 'Red de carga eléctrica · Colombia',
      en: 'EV charging network · Colombia',
      pt: 'Rede de carregamento elétrico · Colômbia',
    } satisfies Localized,
    title: {
      es: 'La red que mueve a Colombia',
      en: 'The network that moves Colombia',
      pt: 'A rede que move a Colômbia',
    } satisfies Localized,
    lead: {
      /* The most-read paragraph on the site. It stopped explaining WHO builds
         the network and now says WHAT the person arriving does: charge, find,
         plug in, start. The subject is the driver from beginning to end, and
         the three verbs foreshadow in one line the sequence beat 8 spells out.
         It names the app because that is where charging begins; it promises
         nothing the Terms do not recognise. */
      es: 'Carga tu vehículo eléctrico de forma rápida y sencilla. Encuentra una estación, conecta y empieza a cargar desde la app Voltop.',
      en: 'Charge your electric vehicle quickly and easily. Find a station, plug in and start charging from the Voltop app.',
      pt: 'Carregue seu veículo elétrico de forma rápida e simples. Encontre uma estação, conecte e comece a carregar pelo app Voltop.',
    } satisfies Localized,
    scrollHint: { es: 'Desplázate', en: 'Scroll', pt: 'Deslize' } satisfies Localized,
  },

  /* BEAT 2 · MEDELLÍN — sticky with scroll-scrub. Intensity: VERY HIGH */
  infrastructure: {
    eyebrow: {
      es: 'Estaciones Voltop',
      en: 'Voltop stations',
      pt: 'Estações Voltop',
    } satisfies Localized,
    /* INTENT: resolve the driver's underlying objection —"charging is going
       to steal my time and leave me stranded somewhere uncomfortable"— by
       explaining WHY we choose where to build.

       It used to say "No instalamos cargadores. Construimos lugares." It
       sounds good and says nothing: it communicates no benefit, resolves no
       objection and indicates nothing to do next. "We build places" could
       have been signed by a construction firm, a hotel chain or a real-estate
       company.

       The new version does real work: it names the actual benefit of our
       siting strategy —charging happens inside time you were going to spend
       anyway— without promising speed, which at 22–80 kW we cannot promise. */
    /* Two sentences and not one: the first says what the car does, the second
       what the person does. The full stop in the middle is what loads the
       message — what matters is not the charging, it is that your day does not
       stop.

       CAREFUL, THE SPACE AFTER THE PRONOUN IS NON-BREAKING (U+00A0). Without
       it the headline broke as "Tu carro carga. Tú / sigues con tu día." at
       1440, 1280, 1024, 768 and 390px: the pronoun was left orphaned at the
       end of the first line, separated from its verb and right after a full
       stop, which is the one place the eye expects to pause.

       `text-balance` does NOT fix this, and that is worth writing down: it
       balances the LENGTH of the lines, and "Tu carro carga. Tú" against
       "sigues con tu día." is already perfectly balanced —18 characters
       each—. The problem is not metric but semantic, and a distribution
       algorithm does not know where a sentence ends. The non-breaking space
       does: it ties the pronoun to its verb and pushes the break to the full
       stop.

       It is applied in all three languages because all three run the same
       risk with their pronoun. */
    title: {
      es: 'Tu carro carga. Tú sigues con tu día.',
      en: 'Your car charges. You get on with your day.',
      pt: 'Seu carro carrega. Você segue com o seu dia.',
    } satisfies Localized,
    lead: {
      /* It never promises charging time: with 22 kW points that does not
         hold up, and §19 does not allow headlines the product cannot meet.
         What is true and does differentiate is WHERE the stations are. */
      es: 'Ubicamos nuestras estaciones de carga en universidades, hoteles y centros comerciales para que puedas cargar tu vehículo eléctrico mientras continúas con tu día.',
      en: 'We put our charging stations in universities, hotels and shopping centres so you can charge your electric vehicle while you get on with your day.',
      pt: 'Instalamos nossas estações de carregamento em universidades, hotéis e shoppings para que você possa carregar seu veículo elétrico enquanto segue com o seu dia.',
    } satisfies Localized,
    /** The video arrives under the `estacionMedellin` key of the media registry. */
    caption: {
      es: 'Nueva estación · Medellín',
      en: 'New station · Medellín',
      pt: 'Nova estação · Medellín',
    } satisfies Localized,
  },

  /* BEAT 3 · NETWORK — wide index, spec-sheet language. Intensity: Medium */
  network: {
    eyebrow: { es: 'Nuestra red', en: 'Our network', pt: 'Nossa rede' } satisfies Localized,
    title: {
      es: 'Encuentra dónde cargar tu carro eléctrico',
      en: 'Find where to charge your electric car',
      pt: 'Encontre onde carregar seu carro elétrico',
    } satisfies Localized,
    lead: {
      /* It names the two cities by hand, and that is worth knowing: it is the
         ONLY sentence on the site that goes stale when a third one opens. The
         rest of this section is computed from the dataset. When the third city
         arrives, this is the line to touch. */
      es: 'Consulta las estaciones de carga Voltop disponibles en Bogotá y Medellín.',
      en: 'See the Voltop charging stations available in Bogotá and Medellín.',
      pt: 'Veja as estações de carregamento Voltop disponíveis em Bogotá e Medellín.',
    } satisfies Localized,
    /* Labels for the aggregates. The FIGURES are not here: they are computed
       from the dataset in `getNetworkSummary`, because a hand-written figure
       stops being true the moment a station is added (§33). */
    stats: {
      points: {
        es: 'Puntos de carga',
        en: 'Charge points',
        pt: 'Pontos de carga',
      } satisfies Localized,
      power: { es: 'Potencia', en: 'Power', pt: 'Potência' } satisfies Localized,
      connectors: { es: 'Conectores', en: 'Connectors', pt: 'Conectores' } satisfies Localized,
    },
    live: { es: 'en operación', en: 'live', pt: 'em operação' } satisfies Localized,
    /* Microcopy beside the CTA. It is not a dated promise —§19 does not allow
       headlines the product cannot meet— but the state of a growing network:
       it says this is not finished without committing to a deadline. */
    moreCities: {
      es: 'Más ciudades en camino',
      en: 'More cities on the way',
      pt: 'Mais cidades em breve',
    } satisfies Localized,
  },

  /* BEAT 4 · BUSINESS — narrow column, breathing room. Intensity: Medium-low */
  business: {
    eyebrow: {
      es: 'Soluciones para empresas',
      en: 'Business solutions',
      pt: 'Soluções para empresas',
    } satisfies Localized,
    title: {
      es: 'Llevamos la carga eléctrica a tu negocio',
      en: 'We bring EV charging to your business',
      pt: 'Levamos o carregamento elétrico ao seu negócio',
    } satisfies Localized,
    lead: {
      es: 'Diseñamos, instalamos y operamos infraestructura de carga para empresas, flotas y espacios comerciales. Voltop se encarga de la operación para que tú te enfoques en tu negocio.',
      en: 'We design, install and operate charging infrastructure for companies, fleets and commercial spaces. Voltop runs the operation so you can focus on your business.',
      pt: 'Projetamos, instalamos e operamos infraestrutura de carregamento para empresas, frotas e espaços comerciais. A Voltop cuida da operação para que você foque no seu negócio.',
    } satisfies Localized,
  },

  /* BEAT 5 · REAL CASE — full-bleed with the quote over it. Intensity: High */
  proof: {
    eyebrow: { es: 'Caso real', en: 'Real case', pt: 'Caso real' } satisfies Localized,
    title: {
      es: 'Universidad EAN',
      en: 'EAN University',
      pt: 'Universidade EAN',
    } satisfies Localized,
  },

  /* BEAT 6 · VISION — narrow editorial column. Intensity: Medium-high */
  vision: {
    eyebrow: { es: 'Visión', en: 'Vision', pt: 'Visão' } satisfies Localized,
  },

  /* BEAT 7 · CLOSE — asymmetric, two audiences. Intensity: High */
  close: {
    /* The headline stops describing the action —"Conecta con la red"— and
       starts ASKING. In a close with two paths, a question is what makes the
       user recognise themselves in one of them; a statement leaves the choice
       implicit and it has to be inferred from the labels. */
    title: {
      es: '¿Cómo quieres conectarte con Voltop?',
      en: 'How do you want to connect with Voltop?',
      pt: 'Como você quer se conectar com a Voltop?',
    } satisfies Localized,
    b2c: {
      /* Both labels move to the first person and to the same length: "I
         drive an electric car" / "I represent a company". One used to have two
         words and the other six, and in two symmetric columns that reads as
         one option carrying more weight than the other. */
      label: {
        es: 'Conduzco un carro eléctrico',
        en: 'I drive an electric car',
        pt: 'Eu dirijo um carro elétrico',
      } satisfies Localized,
      /* It names the two cities, like beat 3's lead: it is the second and
         last sentence on the site that goes stale when a third one opens. */
      body: {
        es: 'Encuentra estaciones de carga Voltop en Bogotá y Medellín.',
        en: 'Find Voltop charging stations in Bogotá and Medellín.',
        pt: 'Encontre estações de carregamento Voltop em Bogotá e Medellín.',
      } satisfies Localized,
    },
    b2b: {
      label: {
        es: 'Represento una empresa',
        en: 'I represent a company',
        pt: 'Represento uma empresa',
      } satisfies Localized,
      body: {
        es: 'Conoce nuestras soluciones de carga para empresas, flotas y espacios comerciales.',
        en: 'See our charging solutions for companies, fleets and commercial spaces.',
        pt: 'Conheça nossas soluções de carregamento para empresas, frotas e espaços comerciais.',
      } satisfies Localized,
    },
  },

  /**
   * HOW CHARGING WORKS · the driver's beat.
   *
   * What it promises is taken from what the Terms and Conditions declare as
   * the Platform's services (§4 of the legal document): looking up location
   * and availability, activating by QR, managing sessions and history. Nothing
   * is promised that the legal document does not recognise — which is the
   * cheapest way to comply with §19 ("a headline is a contract").
   *
   * ── WHY IT STOPPED BEING "THE APP" ───────────────────────────────────────
   * The site's largest audience arrives asking "how do I charge?", and that
   * question had ONE SENTENCE on the whole site, hidden inside a section
   * labelled "La app". Labelling by the product instead of by the task leaves
   * the beat invisible to precisely the people who need it.
   *
   * The three loose features become FOUR STEPS in order. A feature answers
   * "what does it have"; a step answers "what is going to happen to me", which
   * is the real question for someone who has never charged an electric car.
   *
   * ── THE FOURTH STEP IS PAYING ────────────────────────────────────────────
   * Confirmed by product on 2026-09-03: payment happens from the app with
   * whatever method the user has on file. The step says exactly that and stops
   * there.
   *
   * The mechanics are deliberately NOT explained —stored payment method,
   * gateway, pre-authorisation, exactly when the charge is taken—. Whoever
   * reads this is deciding whether charging is easy, not auditing the billing
   * flow; every extra sentence there turns a reassuring answer into a contract
   * that has to be read.
   *
   * The RATE still carries no figure: the only confirmed fact is that you see
   * it in the app before starting the charge, which is what step 3 says and
   * what the station page already said. No figures, no ranges.
   */
  app: {
    eyebrow: { es: 'Cómo cargar', en: 'How to charge', pt: 'Como carregar' } satisfies Localized,
    title: {
      es: 'Cargar tu carro eléctrico es así de fácil',
      en: 'Charging your electric car is this easy',
      pt: 'Carregar seu carro elétrico é assim tão fácil',
    } satisfies Localized,
    lead: {
      es: 'Encuentra una estación Voltop, escanea el código QR y empieza a cargar desde la app.',
      en: 'Find a Voltop station, scan the QR code and start charging from the app.',
      pt: 'Encontre uma estação Voltop, escaneie o código QR e comece a carregar pelo app.',
    } satisfies Localized,
    /**
     * Four steps, in the order they happen. The label is a verb: what the
     * driver does, not what the app does.
     */
    steps: [
      {
        label: { es: 'Encuentra', en: 'Find', pt: 'Encontre' } satisfies Localized,
        body: {
          es: 'Consulta nuestra red y encuentra una estación disponible.',
          en: 'Browse our network and find an available station.',
          pt: 'Consulte nossa rede e encontre uma estação disponível.',
        } satisfies Localized,
      },
      {
        label: { es: 'Escanea', en: 'Scan', pt: 'Escaneie' } satisfies Localized,
        body: {
          es: 'Escanea el código QR del cargador desde la app Voltop para iniciar.',
          en: "Scan the charger's QR code from the Voltop app to get started.",
          pt: 'Escaneie o código QR do carregador pelo app Voltop para iniciar.',
        } satisfies Localized,
      },
      {
        label: { es: 'Carga', en: 'Charge', pt: 'Carregue' } satisfies Localized,
        body: {
          es: 'Inicia la carga y sigue tu sesión desde el celular.',
          en: 'Start charging and follow your session from your phone.',
          pt: 'Inicie o carregamento e acompanhe sua sessão pelo celular.',
        } satisfies Localized,
      },
      {
        label: { es: 'Paga', en: 'Pay', pt: 'Pague' } satisfies Localized,
        body: {
          es: 'Al finalizar, paga desde la app con tu método de pago registrado.',
          en: "When you're done, pay in the app with your registered payment method.",
          pt: 'Ao finalizar, pague pelo app com seu método de pagamento cadastrado.',
        } satisfies Localized,
      },
    ],
    qrLabel: {
      es: 'Escanea para descargar',
      en: 'Scan to download',
      pt: 'Escaneie para baixar',
    } satisfies Localized,
    qrAlt: {
      es: 'Código QR que abre la descarga de la app de Voltop',
      en: 'QR code that opens the Voltop app download',
      pt: 'Código QR que abre o download do aplicativo da Voltop',
    } satisfies Localized,
  },

  /** Floating download component. */
  appFloating: {
    title: { es: 'Descarga la app Voltop', en: 'Get the Voltop app', pt: 'Baixe o app Voltop' },
    body: {
      es: 'Encuentra estaciones e inicia tu carga desde la app.',
      en: 'Find stations and start your charge from the app.',
      pt: 'Encontre estações e inicie seu carregamento pelo app.',
    },
    /* The mobile bar says the same thing SHORTER instead of truncating the
       desktop text with an ellipsis.

       The title has its own version too: in the bar the icon, two lines of
       text, the button and the close control all compete, and the gap left for
       text is around 180px. "Descarga la app Voltop" was being cut off there —
       and with the icon beside it the word "Voltop" is already redundant: the
       logo says it. It is the same reason the header lockup does not repeat
       the brand name. */
    titleMobile: { es: 'Descarga la app', en: 'Get the app', pt: 'Baixe o app' },
    bodyMobile: {
      es: 'Encuentra estaciones e inicia tu carga',
      en: 'Find stations and start charging',
      pt: 'Encontre estações e inicie seu carregamento',
    },
    open: { es: 'Abrir', en: 'Open', pt: 'Abrir' },
  },
}
