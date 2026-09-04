import type { Localized } from '~/core/common/domain/i18n/config'
import type { PostType } from '~/core/novedades/domain/entities/Post'

/**
 * COPY · News
 * See docs/MASTER-PROJECT-DEFINITION.md §14, §18 and §19.
 *
 * The destination is called "Novedades" in navigation —deliberately
 * recognisable, because a menu label is not the place to be clever— while the
 * page's headline does carry the brand idea. Whoever is looking for the press
 * room finds it; whoever arrives reads something that sounds like Voltop.
 */

export const novedades = {
  /**
   * Cover CTA when the entry is a station opening.
   *
   * On an opening, the useful destination is not the article but the place
   * where you can charge: the headline already tells the news and the video
   * shows it. The detail is still one click away — the title links to it.
   */
  knowStation: {
    es: 'Conoce la estación',
    en: 'See the station',
    pt: 'Conheça a estação',
  } satisfies Localized,

  /** Media type label. The duration comes from the asset itself. */
  mediaLabel: {
    video: { es: 'Video', en: 'Video', pt: 'Vídeo' } satisfies Localized,
  },
  meta: {
    title: { es: 'Novedades', en: 'Newsroom', pt: 'Novidades' } satisfies Localized,
    description: {
      es: 'Aperturas de estaciones, alianzas, eventos y comunicados de Voltop. El registro de lo que la red construye.',
      en: 'Station openings, partnerships, events and announcements from Voltop. The record of what the network builds.',
      pt: 'Aberturas de estações, parcerias, eventos e comunicados da Voltop. O registro do que a rede constrói.',
    } satisfies Localized,
  },

  eyebrow: { es: 'Novedades', en: 'Newsroom', pt: 'Novidades' } satisfies Localized,

  title: {
    es: 'La red en movimiento',
    en: 'The network in motion',
    pt: 'A rede em movimento',
  } satisfies Localized,

  intro: {
    es: 'Cada estación que abre, cada alianza que se firma. El registro de lo que Voltop construye.',
    en: 'Every station that opens, every partnership signed. The record of what Voltop builds.',
    pt: 'Cada estação que abre, cada parceria firmada. O registro do que a Voltop constrói.',
  } satisfies Localized,

  /**
   * THE LOG'S PULSE. It is computed from the dataset itself —it is not an
   * invented business metric (§33)— and it answers at a glance the only
   * question that brings an investor or a journalist here: is this company
   * moving?
   */
  pulse: {
    entries: { es: 'entradas', en: 'entries', pt: 'entradas' } satisfies Localized,
    entriesOne: { es: 'entrada', en: 'entry', pt: 'entrada' } satisfies Localized,
    latest: { es: 'Última', en: 'Latest', pt: 'Última' } satisfies Localized,
  },

  filter: {
    label: {
      es: 'Filtrar por tipo',
      en: 'Filter by type',
      pt: 'Filtrar por tipo',
    } satisfies Localized,
    all: { es: 'Todo', en: 'All', pt: 'Tudo' } satisfies Localized,
  },

  /** Label for each entry type. A new type is added here and in the model. */
  types: {
    apertura: { es: 'Apertura', en: 'Opening', pt: 'Abertura' },
    evento: { es: 'Evento', en: 'Event', pt: 'Evento' },
    alianza: { es: 'Alianza', en: 'Partnership', pt: 'Parceria' },
    comunicado: { es: 'Comunicado', en: 'Statement', pt: 'Comunicado' },
    noticia: { es: 'Noticia', en: 'News', pt: 'Notícia' },
  } satisfies Record<PostType, Localized>,

  /**
   * The same types IN THE PLURAL, for the breadcrumb only.
   *
   * `types` is singular because its main job is labelling ONE entry:
   * "Apertura" next to a date, in the log and on the home page. In the
   * breadcrumb, by contrast, the type does not describe the entry but the
   * CATEGORY it belongs to —"Novedades / Aperturas"— and there the singular
   * reads as if the category had a single item.
   *
   * They are two different jobs done by the same word, so they are two keys.
   */
  typesPlural: {
    apertura: { es: 'Aperturas', en: 'Openings', pt: 'Aberturas' },
    evento: { es: 'Eventos', en: 'Events', pt: 'Eventos' },
    alianza: { es: 'Alianzas', en: 'Partnerships', pt: 'Parcerias' },
    comunicado: { es: 'Comunicados', en: 'Statements', pt: 'Comunicados' },
    noticia: { es: 'Noticias', en: 'News', pt: 'Notícias' },
  } satisfies Record<PostType, Localized>,

  readEntry: {
    es: 'Leer la entrada',
    en: 'Read the entry',
    pt: 'Ler a entrada',
  } satisfies Localized,
  backToIndex: {
    es: 'Volver a novedades',
    en: 'Back to the newsroom',
    pt: 'Voltar para novidades',
  } satisfies Localized,

  /**
   * Provisional-data marker (§33).
   *
   * In the INDEX it is declared once for the whole log, not per row. Repeated
   * on every entry it stopped being a warning and became texture: four amber
   * labels were the most eye-catching thing on the page after the headline,
   * and they drew the eye to the least important fact. It is the same economy
   * §33 imposes on metric placeholders.
   *
   * On a SINGLE entry's page it does go per entry: there is only one there and
   * it qualifies exactly what is being read.
   */
  provisionalTag: {
    es: 'Fecha provisional',
    en: 'Provisional date',
    pt: 'Data provisória',
  } satisfies Localized,
  provisionalTagAll: {
    es: 'Fechas provisionales',
    en: 'Provisional dates',
    pt: 'Datas provisórias',
  } satisfies Localized,
  provisionalNoteAll: {
    es: 'Los hechos de este registro están verificados; las fechas exactas están pendientes de confirmación.',
    en: 'The events in this record are verified; exact dates are pending confirmation.',
    pt: 'Os fatos deste registro estão verificados; as datas exatas estão pendentes de confirmação.',
  } satisfies Localized,
  provisionalNote: {
    es: 'Entrada de arranque: el hecho está verificado, la fecha exacta está pendiente de confirmación.',
    en: 'Seed entry: the event is verified, the exact date is pending confirmation.',
    pt: 'Entrada inicial: o fato está verificado, a data exata está pendente de confirmação.',
  } satisfies Localized,

  /**
   * A log with no entries. It should not happen with the section in the menu
   * —an empty news room communicates the opposite of what it intends— but it
   * is declared rather than serving a blank page if it ever does.
   */
  empty: {
    title: {
      es: 'Todavía no hay entradas publicadas',
      en: 'No entries published yet',
      pt: 'Ainda não há entradas publicadas',
    } satisfies Localized,
    body: {
      es: 'Aquí se publican las aperturas, alianzas y comunicados de Voltop. Mientras tanto, la red ya se puede recorrer.',
      en: "This is where Voltop's openings, partnerships and announcements are published. In the meantime, the network is already there to explore.",
      pt: 'É aqui que publicamos as aberturas, parcerias e comunicados da Voltop. Enquanto isso, a rede já pode ser percorrida.',
    } satisfies Localized,
    action: {
      es: 'Ir a la red',
      en: 'Go to the network',
      pt: 'Ir para a rede',
    } satisfies Localized,
  },

  /** Link back to the product from an entry. This is where the reference pays off. */
  related: {
    station: {
      es: 'Estación relacionada',
      en: 'Related station',
      pt: 'Estação relacionada',
    } satisfies Localized,
    /* The button used to carry the station's NAME as its label ("Wake"),
       which said where you would go but not that you could go. It is now a
       verb.

       It does not reuse `actions.seeStation` —"Conoce ESTA estación"— because
       the demonstrative works there: in beat 2 and in the case study, the
       station is the subject being looked at. Here it is a reference at the
       foot of an entry, and the definite article is the one that fits. It is
       the only pair of near-identical labels kept on purpose. */
    stationCta: {
      es: 'Conoce la estación',
      en: 'See the station',
      pt: 'Conheça a estação',
    } satisfies Localized,
    /* Completed with the city's name. It used to be concatenated as "Ver la
       cobertura de la ciudad — Medellín", which named it twice. */
    city: {
      es: 'Ver la cobertura en',
      en: 'See coverage in',
      pt: 'Ver a cobertura em',
    } satisfies Localized,
  },
}

/* ---------------------------------------------------------------- */
/* Re-surfacing on other destinations                                */
/* ---------------------------------------------------------------- */

/**
 * The log is not a separate drawer: every entry shows up where the user looks
 * for it. These are the labels for those appearances.
 */
export const novedadesInline = {
  station: {
    title: {
      es: 'Novedades de esta estación',
      en: 'News about this station',
      pt: 'Novidades desta estação',
    } satisfies Localized,
  },
  city: {
    title: {
      es: 'Novedades de la ciudad',
      en: 'News from this city',
      pt: 'Novidades da cidade',
    } satisfies Localized,
  },
  home: {
    eyebrow: { es: 'Novedades', en: 'Newsroom', pt: 'Novidades' } satisfies Localized,
    title: {
      es: 'Lo último de la red',
      en: 'Latest from the network',
      pt: 'O mais recente da rede',
    } satisfies Localized,
    action: {
      es: 'Ver todas las novedades',
      en: 'See all news',
      pt: 'Ver todas as novidades',
    } satisfies Localized,
  },
}
