import type { Localized } from '~/core/common/domain/i18n/config'
import { routes } from '~/core/common/domain/i18n/routes'
import { externalLinks } from '~/core/common/domain/consts/links'

/**
 * SHARED COPY · navigation, actions, forms, states and accessibility.
 * See docs/MASTER-PROJECT-DEFINITION.md §18 and §19.
 *
 * No component contains literal copy strings. Without this layer there is no
 * translation workflow, no editorial review and no path to a CMS.
 *
 * Tone: clear and human · technical and precise · premium and restrained.
 * Rule: a headline is a contract. We do not promise what the product does not
 * do.
 */

/**
 * The company's registry details. They come from the Data Processing Policy and
 * the Terms, where they appear as public information about VOLTOP S.A.S. — they
 * are not internal data we are choosing to expose.
 *
 * `Organization` uses them in the structured data: a search engine that can
 * verify legal identity, address and contact treats the brand as a real entity
 * rather than as one more website.
 */
export const empresa = {
  razonSocial: 'VOLTOP S.A.S.',
  nit: '901.723.964-6',
  direccion: 'Cra. 15 # 80-90',
  ciudad: 'Bogotá',
  pais: 'CO',
} as const

export const brand = {
  name: 'Voltop',
  tagline: {
    /* INTENT: someone who does not know Voltop has to understand in one line
       what it is and what they can do with it. This is the `<title>`, the
       global meta description and the subtitle of the Open Graph image: the
       sentence that repeats the most.

       It first read "Infraestructura de carga para la movilidad eléctrica de
       Colombia" — an asset class, not a product. Corrected to "LA red de carga
       eléctrica de Colombia", that definite article made the same mistake as
       "la red líder de Colombia", which had just been retired: with three
       stations, saying "THE network of Colombia" is a leadership claim dressed
       up as a description.

       It now says what it is, where, and the three things the user does. */
    es: 'Red de carga para carros eléctricos en Colombia. La encuentras, la usas y la pagas desde la app.',
    en: 'Charging network for electric cars in Colombia. Find it, use it and pay for it from the app.',
    pt: 'Rede de carregamento para carros elétricos na Colômbia. Você encontra, usa e paga pelo aplicativo.',
  } satisfies Localized,
}

/**
 * PRIMARY NAVIGATION.
 *
 * Four doors, not three. §14 fixed three, and adding one is the most expensive
 * decision in the architecture, so here is the reasoning:
 *
 * "Novedades" serves an audience that until now had no destination. §6 lists
 * "investor / press" and sends them to About, but those two audiences are not
 * asking "who are you" — that is static — they are asking "what have you done
 * lately". Those are different questions, and folding the second into the first
 * hides the asset that answers both best.
 *
 * §14 already allowed this same exception once before, for the city level, when
 * there was a real reason of content, intent and SEO. There is one here too.
 *
 * The order puts the two journey doors first and keeps the institutional pair
 * — news and about — adjacent at the end, where anyone looking for credibility
 * finds both things together.
 */
export const nav: { label: Localized; href: string }[] = [
  { label: { es: 'Red', en: 'Network', pt: 'Rede' }, href: routes.red },
  { label: { es: 'Empresas', en: 'Business', pt: 'Empresas' }, href: routes.empresas },
  { label: { es: 'Novedades', en: 'Newsroom', pt: 'Novidades' }, href: routes.novedades },
  /* The same destination was called "Company" in the navbar and "About us" in
     the footer, and "Companhia" in Portuguese — which is also the label of the
     B2B segment "Empresa". A navigation entry with two names is two entries to
     whoever reads it. */
  { label: { es: 'Nosotros', en: 'About us', pt: 'Sobre nós' }, href: routes.nosotros },
]

/**
 * CONTEXTUAL global CTA. A single slot that changes per route.
 * On /red there is no CTA: the user is already inside the tool (§15).
 */
/** The single app CTA label: used by the header and the mobile menu. */
export const appCta: Localized = { es: 'Descarga la app', en: 'Get the app', pt: 'Baixe o app' }

/** Entry point to the FAQ from the navbar. */
export const helpLink: { label: Localized; href: string } = {
  label: { es: '¿Necesitas ayuda?', en: 'Need help?', pt: 'Precisa de ajuda?' },
  href: `${routes.red}#preguntas`,
}

/**
 * THE HEADER'S GLOBAL CTA · one only, contextual per route (§15).
 *
 * It went from "find a charger" to "download the app". The reason is not
 * aesthetic: "find a charger" led to /red, which is ALREADY in the menu two
 * centimetres to the left. The CTA was duplicating a navigation entry instead
 * of offering something navigation does not give. The app is such a thing — it
 * is where charging and paying actually happen — so the button now goes there.
 *
 * /empresas keeps its own: in B2B the conversion is the conversation with the
 * team, and replacing it with an app download would break the journey.
 *
 * /red stops being `null`. It had no CTA before because "find a charger" inside
 * the finder was redundant; downloading the app is not: it is exactly the next
 * step for someone who has just found where to charge.
 */
export const headerCta: Record<
  string,
  { label: Localized; href: string; external?: boolean } | null
> = {
  home: { label: appCta, href: externalLinks.app, external: true },
  nosotros: { label: appCta, href: externalLinks.app, external: true },
  novedades: { label: appCta, href: externalLinks.app, external: true },
  red: { label: appCta, href: externalLinks.app, external: true },
  empresas: {
    label: { es: 'Hablar con el equipo', en: 'Talk to the team', pt: 'Falar com o time' },
    href: `${routes.empresas}#contacto`,
  },
}

export const actions = {
  /* REGISTER RULE (§13): conversion and brand copy use the second-person
     imperative; only system actions and filters use the infinitive ("Quitar
     filtros", "Ocultar filtros"). In Spanish the infinitive is the register of
     an administrative form, and the two were being mixed here with no
     criterion: "Descargar la app" coexisted with "Descarga la app" for the very
     same action. */
  /* One label for one action: the hero and the closing block both use it, both
     lead to `/red` and both emit the same event. In the closing block it also
     stops repeating, word for word, the text sitting right above it. */
  findCharger: {
    es: 'Encuentra una estación',
    en: 'Find a station',
    pt: 'Encontre uma estação',
  } satisfies Localized,
  seeNetwork: {
    es: 'Explora la red completa',
    en: 'Explore the full network',
    pt: 'Explore a rede completa',
  } satisfies Localized,
  /* No longer "Soluciones para empresas": that text became beat 4's EYEBROW,
     and a button that repeats the label of its own
     sección no dice a dónde lleva. */
  businessSolutions: {
    es: 'Conoce nuestras soluciones',
    en: 'See our solutions',
    pt: 'Conheça nossas soluções',
  } satisfies Localized,
  talkToTeam: {
    es: 'Habla con nuestro equipo',
    en: 'Talk to our team',
    pt: 'Fale com nosso time',
  } satisfies Localized,
  /* "Conoce" rather than "Ver": it invites you into the page, not to look at a
     photo. The English stays "See this station" on purpose — "get to know"
     sounds forced on a button and "discover" is brochure language. The intent
     is translated, not the word. Beat 2 and the case study both use it, and
     both open a station page: one action, one label. */
  seeStation: {
    es: 'Conoce esta estación',
    en: 'See this station',
    pt: 'Conheça esta estação',
  } satisfies Localized,
  getDirections: { es: 'Cómo llegar', en: 'Get directions', pt: 'Como chegar' } satisfies Localized,
  knowVoltop: {
    es: 'Conoce Voltop',
    en: 'About Voltop',
    pt: 'Conheça a Voltop',
  } satisfies Localized,
  backToNetwork: {
    es: 'Volver a la red',
    en: 'Back to the network',
    pt: 'Voltar para a rede',
  } satisfies Localized,
  hostStation: {
    es: 'Lleva Voltop a tu espacio',
    en: 'Bring Voltop to your space',
    pt: 'Leve a Voltop para o seu espaço',
  } satisfies Localized,
}

/** Station statuses — one single source for the whole UI. */
export const stationStatus = {
  operativa: { es: 'En operación', en: 'Live', pt: 'Em operação' } satisfies Localized,
  proxima: { es: 'Próximamente', en: 'Coming soon', pt: 'Em breve' } satisfies Localized,
  mantenimiento: {
    es: 'En mantenimiento',
    en: 'Under maintenance',
    pt: 'Em manutenção',
  } satisfies Localized,
}

export const units = {
  pointsShort: { es: 'puntos', en: 'points', pt: 'pontos' } satisfies Localized,
  stations: { es: 'estaciones', en: 'stations', pt: 'estações' } satisfies Localized,
  station: { es: 'estación', en: 'station', pt: 'estação' } satisfies Localized,
}

/* ---------------------------------------------------------------- */
/* Lead form                                                         */
/* ---------------------------------------------------------------- */

export const leadForm = {
  title: {
    es: 'Cuéntanos qué necesitas',
    en: 'Tell us what you need',
    pt: 'Conte o que você precisa',
  } satisfies Localized,
  intro: {
    es: 'Alguien del equipo lee tu caso y te responde con una propuesta concreta.',
    en: 'Someone on the team reads your case and replies with a concrete proposal.',
    pt: 'Alguém do time lê o seu caso e responde com uma proposta concreta.',
  } satisfies Localized,
  caseLabel: { es: 'Tu caso', en: 'Your case', pt: 'Seu caso' } satisfies Localized,

  fields: {
    name: {
      label: {
        es: 'Nombre y apellido',
        en: 'Full name',
        pt: 'Nome e sobrenome',
      } satisfies Localized,
      error: {
        es: 'Escribe tu nombre para saber cómo dirigirnos a ti.',
        en: 'Enter your name so we know how to address you.',
        pt: 'Escreva seu nome para sabermos como falar com você.',
      } satisfies Localized,
    },
    email: {
      /* "Corporativo" implied a requirement the validation does NOT enforce
         (`LeadForm` only checks the shape of the address), and it did so to
         exactly the profile most likely to write from Gmail: the owner of a car
         park or of a small fleet. */
      label: { es: 'Correo', en: 'Email', pt: 'E-mail' } satisfies Localized,
      hint: {
        es: 'Te respondemos a este correo.',
        en: "We'll reply to this address.",
        pt: 'Respondemos para este e-mail.',
      } satisfies Localized,
      error: {
        es: 'Revisa el correo: parece que falta algo (ejemplo: nombre@empresa.com).',
        en: 'Check the email — something looks off (example: name@company.com).',
        pt: 'Confira o e-mail: parece que falta algo (exemplo: nome@empresa.com).',
      } satisfies Localized,
    },
    company: {
      label: {
        es: 'Empresa u organización',
        en: 'Company or organization',
        pt: 'Empresa ou organização',
      } satisfies Localized,
      error: {
        es: 'Indícanos el nombre de tu empresa u organización.',
        en: 'Let us know your company or organization name.',
        pt: 'Informe o nome da sua empresa ou organização.',
      } satisfies Localized,
    },
    phone: {
      label: { es: 'Teléfono', en: 'Phone', pt: 'Telefone' } satisfies Localized,
      optional: { es: 'Opcional', en: 'Optional', pt: 'Opcional' } satisfies Localized,
    },
    message: {
      label: {
        es: '¿Qué necesitas?',
        en: 'What do you need?',
        pt: 'O que você precisa?',
      } satisfies Localized,
      placeholder: {
        es: 'Ej.: tenemos 40 colaboradores con vehículo eléctrico y una sede en Bogotá.',
        en: 'E.g.: we have 40 employees with EVs and one office in Bogotá.',
        pt: 'Ex.: temos 40 colaboradores com veículo elétrico e uma sede em Bogotá.',
      } satisfies Localized,
    },
    consent: {
      /** Legal requirement: Ley 1581 de 2012 (habeas data, Colombia). §38. */
      label: {
        es: 'Autorizo a Voltop a tratar mis datos personales para responder a esta solicitud, conforme a su política de tratamiento de datos.',
        en: 'I authorize Voltop to process my personal data in order to respond to this request, in accordance with its data processing policy.',
        pt: 'Autorizo a Voltop a tratar meus dados pessoais para responder a esta solicitação, conforme sua política de tratamento de dados.',
      } satisfies Localized,
      error: {
        es: 'Necesitamos tu autorización para poder contactarte.',
        en: 'We need your authorization in order to contact you.',
        pt: 'Precisamos da sua autorização para entrar em contato.',
      } satisfies Localized,
      policyLink: {
        es: 'Ver política de tratamiento de datos',
        en: 'View data processing policy',
        pt: 'Ver política de tratamento de dados',
      } satisfies Localized,
    },
  },

  /* The rest of the page already says "Tu caso" and "Cuéntanos tu caso"; the
     button said "solicitud", which is service-counter vocabulary. */
  submit: { es: 'Enviar mi caso', en: 'Send my case', pt: 'Enviar meu caso' } satisfies Localized,
  submitting: { es: 'Enviando…', en: 'Sending…', pt: 'Enviando…' } satisfies Localized,

  /** The asterisk alone communicates nothing: it needs a legend (WCAG 3.3.2). */
  requiredLegend: {
    es: 'Los campos marcados con * son obligatorios.',
    en: 'Fields marked with * are required.',
    pt: 'Os campos marcados com * são obrigatórios.',
  } satisfies Localized,

  errorSummary: {
    es: 'Revisa los campos marcados para poder enviar tu solicitud.',
    en: 'Please review the highlighted fields to send your request.',
    pt: 'Revise os campos destacados para enviar sua solicitação.',
  } satisfies Localized,

  /**
   * The REAL success state. Used only when a delivery destination exists.
   * See `DESTINATION` in
   * `~/core/empresas/infrastructure/ui/components/LeadForm`.
   */
  success: {
    title: {
      es: 'Solicitud enviada',
      en: 'Request sent',
      pt: 'Solicitação enviada',
    } satisfies Localized,
    body: {
      es: 'Alguien del equipo leerá tu caso y te escribirá al correo que nos dejaste. Respondemos normalmente en uno o dos días hábiles.',
      en: 'Someone on the team will read your case and write to the email you provided. We usually reply within one or two business days.',
      pt: 'Alguém do time vai ler o seu caso e escrever para o e-mail que você informou. Normalmente respondemos em um ou dois dias úteis.',
    } satisfies Localized,
  },

  /**
   * The success state WHILE THERE IS NO CRM (open decision O3).
   *
   * The `success` copy promised review and a reply within one or two business
   * days for a submission that does not exist: `submitLead` discards the
   * payload. A headline is a contract (§19), and this was the point where
   * breaking it had a direct commercial consequence. While there is no
   * destination, it says what actually happened. No alternative channel is
   * offered because there is no confirmed email or phone in the dataset: we do
   * not invent data (§33).
   */
  /**
   * The confirmation shown when the form drafts an email.
   *
   * It says EXACTLY what happened. "Request sent" would be a lie: the message
   * is drafted, not sent, and whoever does not send it never reaches us.
   * Letting the person know they are one click short is the difference between
   * a lead and a lost lead.
   */
  successEmail: {
    tag: { es: 'Casi listo', en: 'Almost there', pt: 'Quase lá' } satisfies Localized,
    title: {
      es: 'Te abrimos el correo',
      en: 'We opened your email',
      pt: 'Abrimos o seu e-mail',
    } satisfies Localized,
    body: {
      es: 'Tu mensaje ya está redactado con todo lo que nos contaste. Solo tienes que enviarlo y te respondemos en uno o dos días hábiles. Si no se abrió, escríbenos a soporte@voltop.co.',
      en: "Your message is already written with everything you told us. Just send it and we'll reply within one or two business days. If it didn't open, write to soporte@voltop.co.",
      pt: 'Sua mensagem já está escrita com tudo o que você nos contou. Basta enviá-la e respondemos em um ou dois dias úteis. Se não abriu, escreva para soporte@voltop.co.',
    } satisfies Localized,
  },

  successPending: {
    tag: { es: 'Sin enviar', en: 'Not sent', pt: 'Não enviado' } satisfies Localized,
    title: {
      es: 'Todavía no podemos recibirlo aquí',
      en: "We can't receive it here yet",
      pt: 'Ainda não conseguimos receber por aqui',
    } satisfies Localized,
    /* This used to be a dead end at the moment of MAXIMUM intent
       B2B: te decía que no se había enviado y ahí terminaba. El comentario
       original justificaba no ofrecer alternativa "porque no hay correo ni
       teléfono confirmados" — eso dejó de ser cierto: `content/data/links.ts`
       publica WhatsApp y soporte@voltop.co, ambos verificados. Y "CRM" sale de
       la cara del cliente: es vocabulario nuestro. */
    body: {
      es: 'Este formulario aún no está conectado, así que tu solicitud no se envió ni se guardó. Escríbenos por WhatsApp o a soporte@voltop.co y seguimos por ahí.',
      en: "This form isn't connected yet, so your request wasn't sent or stored. Message us on WhatsApp or write to soporte@voltop.co and we'll take it from there.",
      pt: 'Este formulário ainda não está conectado, então sua solicitação não foi enviada nem armazenada. Fale com a gente no WhatsApp ou escreva para soporte@voltop.co que seguimos por lá.',
    } satisfies Localized,
  },

  /** The notice BEFORE asking for the data, not in small print after the button. */
  demoNotice: {
    es: 'Formulario de demostración: todavía no envía solicitudes. La integración con el CRM está pendiente de definir.',
    en: "Demo form: it doesn't send requests yet. The CRM integration is yet to be defined.",
    pt: 'Formulário de demonstração: ainda não envia solicitações. A integração com o CRM está pendente de definição.',
  } satisfies Localized,
}

/* ---------------------------------------------------------------- */
/* Empty states and errors                                           */
/* ---------------------------------------------------------------- */

export const states = {
  noResults: {
    title: {
      es: 'No hay estaciones con esos criterios',
      en: 'No stations match those criteria',
      pt: 'Nenhuma estação atende a esses critérios',
    } satisfies Localized,
    body: {
      /* "Cada mes" was a cadence promise nobody validated (§33). */
      es: 'Prueba con menos filtros o mira otra ciudad. Hoy cargamos en Bogotá y Medellín, y seguimos abriendo.',
      en: 'Try fewer filters or check another city. Today we charge in Bogotá and Medellín, and we keep opening.',
      pt: 'Tente menos filtros ou veja outra cidade. Hoje carregamos em Bogotá e Medellín, e seguimos abrindo.',
    } satisfies Localized,
    action: { es: 'Quitar filtros', en: 'Clear filters', pt: 'Limpar filtros' } satisfies Localized,
  },
  notFound: {
    title: {
      es: 'No encontramos esta página',
      en: "We couldn't find this page",
      pt: 'Não encontramos esta página',
    } satisfies Localized,
    body: {
      es: 'Puede que el enlace haya cambiado o que la estación ya no esté publicada.',
      en: 'The link may have changed, or the station may no longer be published.',
      pt: 'O link pode ter mudado, ou a estação pode não estar mais publicada.',
    } satisfies Localized,
    action: {
      es: 'Ir a la red',
      en: 'Go to the network',
      pt: 'Ir para a rede',
    } satisfies Localized,
    home: { es: 'Ir al inicio', en: 'Go to homepage', pt: 'Ir para o início' } satisfies Localized,
  },
  pendingRealtime: {
    /* It used to say "la integración de datos de operación", which is our
       backlog's vocabulary put in front of someone who just wants to charge.
       And it closed the door instead of opening the next one: the app DOES show
       availability, and the Terms say so. */
    es: 'Aquí todavía no mostramos el estado en vivo de cada punto. En la app sí puedes ver la disponibilidad antes de salir.',
    en: "We don't show live status for each point here yet. In the app you can check availability before you leave.",
    pt: 'Aqui ainda não mostramos o status ao vivo de cada ponto. No app você já consulta a disponibilidade antes de sair.',
  } satisfies Localized,
}

/* ---------------------------------------------------------------- */
/* Accessibility and chrome                                          */
/* ---------------------------------------------------------------- */

export const a11y = {
  skipToContent: {
    es: 'Saltar al contenido',
    en: 'Skip to content',
    pt: 'Pular para o conteúdo',
  } satisfies Localized,
  mainNav: {
    es: 'Navegación principal',
    en: 'Main navigation',
    pt: 'Navegação principal',
  } satisfies Localized,
  footerNav: {
    es: 'Navegación del pie de página',
    en: 'Footer navigation',
    pt: 'Navegação do rodapé',
  } satisfies Localized,
  openMenu: { es: 'Abrir menú', en: 'Open menu', pt: 'Abrir menu' } satisfies Localized,
  closeMenu: { es: 'Cerrar menú', en: 'Close menu', pt: 'Fechar menu' } satisfies Localized,
  languageSelector: {
    es: 'Seleccionar idioma',
    en: 'Select language',
    pt: 'Selecionar idioma',
  } satisfies Localized,
  goHome: {
    es: 'Voltop · Ir al inicio',
    en: 'Voltop · Go to homepage',
    pt: 'Voltop · Ir para o início',
  } satisfies Localized,
  breadcrumb: {
    es: 'Ruta de navegación',
    en: 'Breadcrumb',
    pt: 'Trilha de navegação',
  } satisfies Localized,
  /** Announced on every link with `target="_blank"` (WCAG 3.2.5). */
  opensInNewTab: {
    es: 'Se abre en una pestaña nueva',
    en: 'Opens in a new tab',
    pt: 'Abre em uma nova aba',
  } satisfies Localized,
  placeholderMedia: {
    es: 'Contenido provisional: material pendiente de entrega',
    en: 'Provisional content: material pending delivery',
    pt: 'Conteúdo provisório: material pendente de entrega',
  } satisfies Localized,
}

/* ---------------------------------------------------------------- */
/* Media placeholder label                                           */
/* ---------------------------------------------------------------- */

/**
 * These three strings were written INLINE inside `Media.tsx`, so the English
 * version of the site displayed "FOTO · PENDIENTE". That is exactly the failure
 * this copy layer exists to prevent (§36.15: all copy outside the JSX), and it
 * was visible in production.
 */
export const mediaPlaceholder = {
  photo: { es: 'Foto', en: 'Photo', pt: 'Foto' } satisfies Localized,
  video: { es: 'Video', en: 'Video', pt: 'Vídeo' } satisfies Localized,
  pending: { es: 'pendiente', en: 'pending', pt: 'pendente' } satisfies Localized,
}

/* ---------------------------------------------------------------- */
/* Open Graph image                                                  */
/* ---------------------------------------------------------------- */

/**
 * These two texts were INLINE inside `opengraph-image.tsx`, as two-branch
 * ternaries. It is the same class of failure already fixed in `Media.tsx`, but
 * more expensive: the Open Graph image is what people see when the link is
 * shared on WhatsApp, LinkedIn or Slack, so a language without its own branch
 * announces itself in English in the one place where the mistake propagates on
 * its own.
 */
export const og = {
  eyebrow: {
    es: 'Red de carga eléctrica · Colombia',
    en: 'EV charging network · Colombia',
    pt: 'Rede de carregamento elétrico · Colômbia',
  } satisfies Localized,
  headline: {
    es: 'La red que mueve a Colombia',
    en: 'The network that moves Colombia',
    pt: 'A rede que move a Colômbia',
  } satisfies Localized,
}

/* ---------------------------------------------------------------- */
/* Footer — three columns with real destinations (§15)               */
/* ---------------------------------------------------------------- */

export const footer = {
  columns: [
    {
      title: { es: 'Cargar', en: 'Charge', pt: 'Carregar' } satisfies Localized,
      links: [
        {
          label: {
            es: 'Encontrar una estación',
            en: 'Find a station',
            pt: 'Encontrar uma estação',
          } satisfies Localized,
          href: routes.red,
        },
        {
          label: {
            es: 'Cómo cargar',
            en: 'How to charge',
            pt: 'Como carregar',
          } satisfies Localized,
          href: `${routes.red}#como-cargar`,
        },
        {
          label: {
            es: 'Cobertura por ciudad',
            en: 'Coverage by city',
            pt: 'Cobertura por cidade',
          } satisfies Localized,
          href: `${routes.red}#ciudades`,
        },
      ],
    },
    {
      title: { es: 'Empresas', en: 'Business', pt: 'Empresas' } satisfies Localized,
      links: [
        {
          label: {
            es: 'Soluciones por caso',
            en: 'Solutions by case',
            pt: 'Soluções por caso',
          } satisfies Localized,
          href: routes.empresas,
        },
        {
          label: {
            es: 'Lleva Voltop a tu espacio',
            en: 'Bring Voltop to your space',
            pt: 'Leve a Voltop para o seu espaço',
          } satisfies Localized,
          href: `${routes.empresas}#casos`,
        },
        {
          label: {
            es: 'Hablar con el equipo',
            en: 'Talk to the team',
            pt: 'Falar com o time',
          } satisfies Localized,
          href: `${routes.empresas}#contacto`,
        },
      ],
    },
    {
      title: { es: 'Compañía', en: 'Company', pt: 'Companhia' } satisfies Localized,
      links: [
        {
          label: { es: 'Nosotros', en: 'About us', pt: 'Sobre nós' } satisfies Localized,
          href: routes.nosotros,
        },
        {
          label: { es: 'Novedades', en: 'Newsroom', pt: 'Novidades' } satisfies Localized,
          href: routes.novedades,
        },
        {
          label: { es: 'Impacto', en: 'Impact', pt: 'Impacto' } satisfies Localized,
          href: `${routes.nosotros}#impacto`,
        },
        {
          label: { es: 'Liderazgo', en: 'Leadership', pt: 'Liderança' } satisfies Localized,
          href: `${routes.nosotros}#liderazgo`,
        },
      ],
    },
  ],
  /**
   * SOCIAL · real profiles, verified one by one before publishing them.
   *
   * §15 forbids publishing a link with no real destination, so all three were
   * checked with a request: all three answer 200.
   *
   * The CANONICAL URLs are stored, not the ones each app's share button hands
   * you:
   * · Instagram arrived with a tracking parameter (`igsi`) that adds nothing
   *   and ties the link to one particular session.
   * · Facebook arrived as `/share/18uWjiJFsV/`, a redirector. It resolves to
   *   the profile, but a redirector can expire and adds a hop on every click.
   *
   * `name` is a proper noun: it is not translated.
   */
  social: [
    { name: 'Instagram', url: 'https://www.instagram.com/voltop.co' },
    { name: 'Facebook', url: 'https://www.facebook.com/people/Voltop/61592759125960/' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/voltop-energy/' },
  ],

  /**
   * §15: a link with no real destination is not published. These two have one —
   * the legal documents are written and published — so they go in the footer.
   *
   * `legalNotice` used to live here: "Prototipo · contenido provisional",
   * inherited from when this was a mockup. It was removed on 2026-09-03 because
   * it was no longer true and it WAS visible on every page: the brand is final,
   * the network data is verified and the legal documents are published. A site
   * that declares itself provisional in the footer invites you to disbelieve
   * the rest.
   */
  terms: {
    es: 'Términos y condiciones',
    en: 'Terms and conditions',
    pt: 'Termos e condições',
  } satisfies Localized,
  privacy: {
    es: 'Tratamiento de datos',
    en: 'Data processing',
    pt: 'Tratamento de dados',
  } satisfies Localized,
  rights: {
    es: 'Todos los derechos reservados.',
    en: 'All rights reserved.',
    pt: 'Todos os direitos reservados.',
  } satisfies Localized,
}

/**
 * The top label on each store badge.
 *
 * The wording is Apple's and Google's OFFICIAL wording in each language, not a
 * translation of our own: both publish brand guidelines that fix this line, and
 * a badge with invented text stops being the badge.
 */
export const storeBadges = {
  apple: { es: 'Descárgalo en el', en: 'Download on the', pt: 'Baixar na' } satisfies Localized,
  google: { es: 'Disponible en', en: 'Get it on', pt: 'Disponível no' } satisfies Localized,
}

/**
 * COOKIE NOTICE.
 *
 * The site loads Google Tag Manager, which in turn installs analytics cookies.
 * The Data Processing Policy declares them, but declaring them is not the same
 * as asking permission: Ley 1581 requires **prior, express and informed**
 * authorisation (§38), and "prior" means before installing them.
 *
 * That is why the text does not say "we use cookies" in the past tense and
 * assumes nothing. It says what they are, what for, and leaves both exits at
 * the same level: a reject button that is hidden or greyed out is not an
 * informed choice.
 */
export const cookies = {
  title: {
    es: 'Cookies de analítica',
    en: 'Analytics cookies',
    pt: 'Cookies de análise',
  } satisfies Localized,
  body: {
    es: 'Nos ayudan a entender qué partes del sitio se usan y cuáles no. No las activamos hasta que nos digas.',
    en: "They help us understand which parts of the site get used and which don't. We won't turn them on until you say so.",
    pt: 'Elas nos ajudam a entender quais partes do site são usadas e quais não. Só ativamos quando você permitir.',
  } satisfies Localized,
  accept: { es: 'Aceptar', en: 'Accept', pt: 'Aceitar' } satisfies Localized,
  reject: { es: 'Rechazar', en: 'Reject', pt: 'Recusar' } satisfies Localized,
  policy: {
    es: 'Leer la política',
    en: 'Read the policy',
    pt: 'Ler a política',
  } satisfies Localized,
}
