import type { Localized } from '~/core/common/domain/i18n/config'
import type { PostType } from '@/content/data/posts'

/**
 * COPY · Novedades
 * Ver docs/MASTER-PROJECT-DEFINITION.md §14, §18 y §19.
 *
 * El destino se llama "Novedades" en navegación —deliberadamente reconocible,
 * porque una etiqueta de menú no es el sitio donde ser ingenioso— mientras que
 * el titular de la página sí lleva la idea de marca. Quien busca la sala de
 * prensa la encuentra; quien llega, lee algo que suena a Voltop.
 */

export const novedades = {
  /**
   * CTA de la portada cuando la entrada es la apertura de una estación.
   *
   * En una apertura, el destino útil no es el artículo sino el sitio donde se
   * puede cargar: el titular ya cuenta la noticia y el vídeo la muestra. El
   * detalle sigue a un clic — el título enlaza a él.
   */
  knowStation: {
    es: 'Conoce la estación',
    en: 'See the station',
    pt: 'Conheça a estação',
  } satisfies Localized,

  /** Rótulo del tipo de medio. La duración la aporta el propio asset. */
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
   * PULSO DEL REGISTRO. Se calcula del propio dataset —no es una métrica de
   * negocio inventada (§33)— y responde en un vistazo la única pregunta que
   * trae aquí a un inversionista o a un periodista: ¿esta compañía se mueve?
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

  /** Etiqueta de cada tipo de entrada. Un tipo nuevo se añade aquí y en el modelo. */
  types: {
    apertura: { es: 'Apertura', en: 'Opening', pt: 'Abertura' },
    evento: { es: 'Evento', en: 'Event', pt: 'Evento' },
    alianza: { es: 'Alianza', en: 'Partnership', pt: 'Parceria' },
    comunicado: { es: 'Comunicado', en: 'Statement', pt: 'Comunicado' },
    noticia: { es: 'Noticia', en: 'News', pt: 'Notícia' },
  } satisfies Record<PostType, Localized>,

  /**
   * Los mismos tipos EN PLURAL, solo para la miga de pan.
   *
   * `types` está en singular porque su trabajo principal es rotular UNA
   * entrada: "Apertura" al lado de una fecha, en el registro y en la Home. En
   * la miga de pan, en cambio, el tipo no describe la entrada sino la
   * CATEGORÍA a la que pertenece —"Novedades / Aperturas"—, y ahí el singular
   * se lee como si la categoría tuviera un solo elemento.
   *
   * Son dos trabajos distintos con la misma palabra, así que son dos claves.
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
   * Marca de dato provisional (§33).
   *
   * En el ÍNDICE se declara una sola vez para todo el registro, no por fila.
   * Repetida en cada entrada dejaba de ser una advertencia y pasaba a ser
   * textura: cuatro etiquetas ámbar eran lo más llamativo de la página
   * después del titular, y llevaban el ojo al dato menos importante.
   * Es la misma economía que §33 impone a los placeholders de métrica.
   *
   * En la página de UNA entrada sí va por entrada: ahí hay una sola y
   * califica exactamente lo que se está leyendo.
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
   * Registro sin entradas. No debería ocurrir con la sección en el menú —una
   * sala de novedades vacía comunica lo contrario de lo que pretende— pero se
   * declara en lugar de servir una página en blanco si alguna vez pasa.
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

  /** Enlace de vuelta al producto desde una entrada. Aquí paga la referencia. */
  related: {
    station: {
      es: 'Estación relacionada',
      en: 'Related station',
      pt: 'Estação relacionada',
    } satisfies Localized,
    /* El botón llevaba el NOMBRE de la estación como rótulo ("Wake"), lo cual
       decía a dónde se va pero no que se pueda ir. Ahora es un verbo.
       
       No reutiliza `actions.seeStation` —"Conoce ESTA estación"— porque ahí el
       demostrativo funciona: en el beat 2 y en el caso, la estación es el
       sujeto que se está mirando. Aquí es una referencia al pie de una
       entrada, y "la" es el artículo que corresponde. Es la única pareja de
       rótulos casi idénticos que se conserva a propósito. */
    stationCta: {
      es: 'Conoce la estación',
      en: 'See the station',
      pt: 'Conheça a estação',
    } satisfies Localized,
    /* Se completa con el nombre de la ciudad. Antes se concatenaba
       "Ver la cobertura de la ciudad — Medellín", que la nombraba dos veces. */
    city: {
      es: 'Ver la cobertura en',
      en: 'See coverage in',
      pt: 'Ver a cobertura em',
    } satisfies Localized,
  },
}

/* ---------------------------------------------------------------- */
/* Re-superficie en otros destinos                                   */
/* ---------------------------------------------------------------- */

/**
 * El registro no es un cajón aparte: cada entrada aparece donde el usuario la
 * busca. Estos son los rótulos de esas apariciones.
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
