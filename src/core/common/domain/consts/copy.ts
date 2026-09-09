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

  /* The line under the logo in the footer. It is NOT `tagline`, and the split
     is the whole point: `tagline` feeds the `<title>`, the meta descriptions of
     the Home and /nosotros, and the subtitle of the Open Graph image. A title
     is cut at around 60 characters in a results page, so the sentence that
     lives there has to stay short.

     This one is 123 characters and names the app —"la app Voltop"—, which reads
     right at the foot of a page and repeats itself inside a title that already
     opens with "Voltop —". Same message, two lengths, two jobs. */
  footerBlurb: {
    es: 'Red de carga para carros eléctricos en Colombia. Encuentra estaciones, inicia tu carga y gestiona todo desde la app Voltop.',
    en: 'Charging network for electric cars in Colombia. Find stations, start your charge and manage everything from the Voltop app.',
    pt: 'Rede de carregamento para carros elétricos na Colômbia. Encontre estações, inicie sua carga e gerencie tudo pelo aplicativo Voltop.',
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
  { label: { es: 'Red', en: 'Network', pt: 'Rede' }, href: routes.network },
  { label: { es: 'Empresas', en: 'Business', pt: 'Empresas' }, href: routes.business },
  { label: { es: 'Novedades', en: 'Newsroom', pt: 'Novidades' }, href: routes.news },
  /* The same destination was called "Company" in the navbar and "About us" in
     the footer, and "Companhia" in Portuguese — which is also the label of the
     B2B segment "Empresa". A navigation entry with two names is two entries to
     whoever reads it. */
  { label: { es: 'Nosotros', en: 'About us', pt: 'Sobre nós' }, href: routes.about },
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
  href: `${routes.network}#preguntas`,
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
    href: `${routes.business}#contacto`,
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
     section does not say where it leads. */
  businessSolutions: {
    es: 'Ver soluciones',
    en: 'See solutions',
    pt: 'Ver soluções',
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
  /* The /red banner CTA only. It was "Lleva Voltop a tu espacio" — the same
     label as an /empresas#casos link further down this file. They no longer
     match, and that is fine because they lead to different places: this one to
     /empresas, that one to a section inside it. §15 asks one action to carry
     one label, not that two different destinations share one.

     "Quiero ser parte" speaks in the first person, like the two labels in the
     Home's closing beat ("Conduzco un carro eléctrico" / "Represento una
     empresa"): the reader recognises themselves instead of being instructed. */
  hostStation: {
    es: 'Quiero ser parte',
    en: 'I want to join',
    pt: 'Quero fazer parte',
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
    es: 'Empecemos por aquí',
    en: "Let's start here",
    pt: 'Vamos começar por aqui',
  } satisfies Localized,
  intro: {
    es: 'Déjanos tus datos y algunos detalles para entender lo que necesitas.',
    en: 'Leave us your details and a few specifics so we can understand what you need.',
    pt: 'Deixe seus dados e alguns detalhes para entendermos o que você precisa.',
  } satisfies Localized,

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
      label: {
        es: 'Correo electrónico',
        en: 'Email address',
        pt: 'E-mail',
      } satisfies Localized,
      hint: {
        es: 'Aquí recibirás nuestra respuesta.',
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
        /* It no longer invents a figure. The previous one said "tenemos 40
           colaboradores": an example with a concrete number reads as a typical
           case, and that number comes from nowhere. */
        es: 'Ej.: queremos instalar puntos de carga para los vehículos eléctricos de nuestra empresa.',
        en: 'E.g.: we want to install charge points for our company vehicles.',
        pt: 'Ex.: queremos instalar pontos de carga para os veículos elétricos da nossa empresa.',
      } satisfies Localized,
    },
    consent: {
      /** Legal requirement: Ley 1581 de 2012 (habeas data, Colombia). §38. */
      /* `{policy}` is the link, inside the sentence, just as in the cookie
         notice. The authorisation used to end in "conforme a su política de
         tratamiento de datos" with the link AFTER it, carrying its own label
         ("Ver política…"): the checkbox said one thing and next to it another
         control repeated it. Now the sentence being authorised contains the
         document being accepted, under its full name. */
      label: {
        es: 'Autorizo a Voltop a tratar mis datos personales para responder a esta solicitud, de acuerdo con su {policy}.',
        en: 'I authorize Voltop to process my personal data in order to respond to this request, in accordance with its {policy}.',
        pt: 'Autorizo a Voltop a tratar meus dados pessoais para responder a esta solicitação, de acordo com sua {policy}.',
      } satisfies Localized,
      error: {
        es: 'Necesitamos tu autorización para poder contactarte.',
        en: 'We need your authorization in order to contact you.',
        pt: 'Precisamos da sua autorização para entrar em contato.',
      } satisfies Localized,
      /* The document's full name, word for word the same as the `h1` of
         `/legal/privacidad` and as the cookie notice's link. */
      policyLink: {
        es: 'Política de Tratamiento de Datos Personales',
        en: 'Personal Data Processing Policy',
        pt: 'Política de Tratamento de Dados Pessoais',
      } satisfies Localized,
    },
  },

  /* Back to "solicitud". An earlier change made it "mi caso" to rhyme with
     "Tu caso" and "Cuéntanos tu caso", and neither of those labels exists any
     more: the form is titled "Empecemos por aquí", and the error notice and the
     success state both talk about a SOLICITUD. The button says the same thing as
     the rest of the flow again. */
  submit: {
    es: 'Enviar solicitud',
    en: 'Send request',
    pt: 'Enviar solicitação',
  } satisfies Localized,
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
   * Shared by every length cap in `createLeadSchema`.
   *
   * One message for all five fields, and deliberately so: hitting a 4.000
   * character limit is not an ordinary mistake a person makes while filling in
   * a form, it is a paste that went wrong. The caps exist so the endpoint
   * cannot be fed a megabyte, and this sentence exists so that the rare human
   * who trips one is not left with a field that silently refuses to submit.
   */
  tooLong: {
    es: 'Ese texto es demasiado largo. Recórtalo un poco y lo intentamos de nuevo.',
    en: "That text is too long. Trim it a little and we'll try again.",
    pt: 'Esse texto é longo demais. Encurte um pouco e tentamos de novo.',
  } satisfies Localized,

  /**
   * THE SEND FAILED.
   *
   * This state did not exist while the form opened a `mailto:`, because there
   * was nothing that could report a failure — assigning `location.href` tells
   * you neither that it worked nor that it did not, which is why the form
   * declared success unconditionally. Now the request either reaches SES or it
   * does not, and when it does not the person has to be told, at the exact
   * moment they believe they are done.
   *
   * It offers the two channels that are verified and staffed, because a dead
   * end here is a lost lead at the point of maximum intent. Their data is NOT
   * lost from the form: the fields stay filled in behind this panel so that
   * retrying costs one click and not the whole form again.
   */
  failure: {
    title: {
      es: 'No pudimos enviar tu solicitud',
      en: "We couldn't send your request",
      pt: 'Não conseguimos enviar sua solicitação',
    } satisfies Localized,
    body: {
      es: 'Algo falló de nuestro lado y tu solicitud no llegó. Vuelve a intentarlo en un momento; si sigue sin funcionar, escríbenos por WhatsApp o a soporte@voltop.co.',
      en: "Something failed on our side and your request didn't get through. Try again in a moment; if it keeps failing, message us on WhatsApp or write to soporte@voltop.co.",
      pt: 'Algo falhou do nosso lado e sua solicitação não chegou. Tente de novo em um instante; se continuar falhando, fale com a gente no WhatsApp ou escreva para soporte@voltop.co.',
    } satisfies Localized,
    retry: {
      es: 'Volver a intentar',
      en: 'Try again',
      pt: 'Tentar de novo',
    } satisfies Localized,
  },

  /**
   * The success state, and now the only one.
   *
   * It used to be reachable only in theory: the form drafted a `mailto:` and
   * showed `successEmail` ("we opened your email"), or showed `successPending`
   * ("this form isn't connected yet"). Both of those, and the `demoNotice` that
   * warned before asking for the data, were removed on 2026-09-09 along with
   * the states they described — the form posts to `/api/leads` and this panel
   * appears only once Amazon SES has accepted the message. The promise of a
   * reply in one or two business days is therefore a promise someone can keep.
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
  /* Was `pendingRealtime`, and the name was the point: it warned that live
     status was NOT integrated. Renamed because there is nothing pending.

     ── WHY THE WORDS "TIEMPO REAL" ARE ALLOWED HERE ──────────────────────
     §19 forbids promising a capability the product does not have, and names
     this exact case: if there is no availability integration, no text says "in
     real time". The Terms back consulting availability —the User may "Consultar
     la ubicación y disponibilidad de las Estaciones de Carga"— but they never
     say *real time*, and article 156 warns the opposite: that the Platform can
     be affected by connectivity and maintenance.

     CAMILO CONFIRMED IT ON 2026-09-08: the app does show the live status of
     each point. Written down because the claim is not verifiable from the code
     or from the legal text, and the next reader is going to doubt it — the
     previous copy existed precisely to avoid saying this.

     **If live status ever stops being live, this string is the first that has
     to change**, and with it FAQ answers 1 and 2, which make the same promise. */
  realtimeInApp: {
    es: 'Consulta la disponibilidad de las estaciones en tiempo real desde la app Voltop antes de salir.',
    en: 'Check station availability in real time from the Voltop app before you leave.',
    pt: 'Consulte a disponibilidade das estações em tempo real no aplicativo Voltop antes de sair.',
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
          href: routes.network,
        },
        {
          label: {
            es: 'Cómo cargar',
            en: 'How to charge',
            pt: 'Como carregar',
          } satisfies Localized,
          href: `${routes.network}#como-cargar`,
        },
        {
          label: {
            es: 'Cobertura por ciudad',
            en: 'Coverage by city',
            pt: 'Cobertura por cidade',
          } satisfies Localized,
          href: `${routes.network}#ciudades`,
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
          href: routes.business,
        },
        {
          label: {
            es: 'Lleva Voltop a tu espacio',
            en: 'Bring Voltop to your space',
            pt: 'Leve a Voltop para o seu espaço',
          } satisfies Localized,
          href: `${routes.business}#casos`,
        },
        {
          label: {
            es: 'Hablar con el equipo',
            en: 'Talk to the team',
            pt: 'Falar com o time',
          } satisfies Localized,
          href: `${routes.business}#contacto`,
        },
      ],
    },
    {
      title: { es: 'Compañía', en: 'Company', pt: 'Companhia' } satisfies Localized,
      links: [
        {
          label: { es: 'Nosotros', en: 'About us', pt: 'Sobre nós' } satisfies Localized,
          href: routes.about,
        },
        {
          label: { es: 'Novedades', en: 'Newsroom', pt: 'Novidades' } satisfies Localized,
          href: routes.news,
        },
        {
          label: { es: 'Impacto', en: 'Impact', pt: 'Impacto' } satisfies Localized,
          href: `${routes.about}#impacto`,
        },
        {
          /* The section stopped being called LIDERAZGO and is now VISIÓN (copy
             from 2026-09-08). The `#liderazgo` anchor does NOT change: it is an
             address that may already be linked from outside, and renaming it
             breaks links without fixing anything visible. */
          label: { es: 'Visión', en: 'Vision', pt: 'Visão' } satisfies Localized,
          href: `${routes.about}#liderazgo`,
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
    es: 'Tratamiento de datos personales',
    en: 'Personal data processing',
    pt: 'Tratamento de dados pessoais',
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
    es: 'Usamos cookies para mejorar tu experiencia',
    en: 'We use cookies to improve your experience',
    pt: 'Usamos cookies para melhorar sua experiência',
  } satisfies Localized,
  /**
   * `{policy}` IS THE LINK, and it lives inside the sentence.
   *
   * It used to be a separate "Leer la política" sitting next to the two
   * buttons — a third control in a row where the only two that matter are
   * Accept and Reject. §15 does not allow a link competing with the action of
   * its own view, and a legal reference is not an action: it is part of what
   * you are being told before you decide.
   *
   * The component splits on the token and renders a `<Link>` in its place. The
   * label is the FULL name of the document —"Política de Tratamiento de Datos
   * Personales"— and not "la política": Ley 1581 asks for informed
   * authorisation, and a link that does not name what it opens informs of
   * nothing. It matches the `h1` of `/legal/privacidad` word for word.
   */
  body: {
    es: 'Utilizamos cookies de analítica para entender cómo se usa nuestro sitio y seguir mejorándolo. Tú decides si quieres aceptarlas. Conoce más en nuestra {policy}.',
    en: 'We use analytics cookies to understand how our site is used and to keep improving it. You decide whether to accept them. Learn more in our {policy}.',
    pt: 'Utilizamos cookies de análise para entender como nosso site é usado e continuar melhorando. Você decide se quer aceitá-los. Saiba mais na nossa {policy}.',
  } satisfies Localized,
  accept: { es: 'Aceptar', en: 'Accept', pt: 'Aceitar' } satisfies Localized,
  reject: { es: 'Rechazar', en: 'Reject', pt: 'Recusar' } satisfies Localized,
  policy: {
    es: 'Política de Tratamiento de Datos Personales',
    en: 'Personal Data Processing Policy',
    pt: 'Política de Tratamento de Dados Pessoais',
  } satisfies Localized,
}
