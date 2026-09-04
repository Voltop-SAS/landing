import type { Localized } from '~/core/common/domain/i18n/config'
import { media } from '~/core/common/infrastructure/content/media'
import type { MediaAsset } from '~/core/common/domain/entities/Media'

/**
 * COLECCIÓN · Novedades
 * Ver docs/MASTER-PROJECT-DEFINITION.md §14 (arquitectura) y §27 (datos).
 *
 * ── QUÉ ES Y QUÉ NO ES ────────────────────────────────────────────────────
 * No es un blog. Es el REGISTRO de lo que Voltop construye: aperturas,
 * eventos, alianzas y comunicados. La distinción no es de nombre:
 *
 * - Un blog exige contenido que hay que inventar, y sin cadencia se ve muerto.
 *   Tres artículos con fecha vieja comunican que la compañía está parada.
 * - Un registro se alimenta de lo que la operación ya produce. Cada estación
 *   que abre es una entrada. Con entradas cada pocas semanas se ve vivo.
 *
 * La forma sigue a esa decisión: es una bitácora cronológica, no una revista.
 *
 * ── LA REGLA QUE GOBIERNA EL MODELO ───────────────────────────────────────
 * `body` VACÍO significa que la entrada vive solo en el índice, sin página
 * propia. Una apertura son dos líneas y una foto: obligar a hacer clic para
 * leer un párrafo es fricción sin contrapartida, y multiplica páginas
 * delgadas que además compiten entre sí en búsqueda.
 *
 * Solo las entradas con cuerpo —un comunicado, una alianza con contexto—
 * se abren a página propia, indexable y compartible. La página se genera si
 * hay material, no porque exista el registro.
 *
 * ⚠️ CONTENIDO DE ARRANQUE. Las entradas describen hechos reales y
 * verificables del dataset y del registro de media, pero **las fechas no están
 * confirmadas** y se marcan `dataStatus: "placeholder"`. Regla del proyecto
 * (§33): no se inventan datos, y lo que no está verificado se declara. La UI
 * rotula toda entrada provisional. Ver `docs/05-assets-todo`.
 */

export type PostType = 'apertura' | 'evento' | 'alianza' | 'comunicado' | 'noticia'

/**
 * Cuerpo por BLOQUES, no Markdown ni HTML.
 *
 * Es la forma exacta en que un CMS headless entrega texto enriquecido
 * (Portable Text de Sanity, rich text de Contentful), así que migrar será
 * conectar y no reescribir — y no cierra ninguno de los tres caminos de
 * producción que §2 mantiene abiertos. Markdown suelto habría metido formato
 * dentro del dato y quitado control sobre composición y accesibilidad.
 */
export type PostBlock =
  | { kind: 'parrafo'; text: Localized }
  | { kind: 'subtitulo'; text: Localized }
  | { kind: 'lista'; items: Localized[] }
  /** Atribución obligatoria: una cita sin autor no es una cita. */
  | { kind: 'cita'; text: Localized; author: string; role: Localized }
  /**
   * `caption` es el pie VISIBLE. Si falta, se usa el `alt` del asset.
   *
   * No son lo mismo y por eso se separan: el `alt` describe la imagen para
   * quien no la ve, y el pie la comenta para quien sí. Usar el alt como pie
   * obliga a que un solo texto haga dos trabajos, y acaba haciendo mal los dos.
   */
  | { kind: 'media'; asset: MediaAsset; caption?: Localized }

export type Post = {
  slug: string
  type: PostType
  /** ISO `YYYY-MM-DD`. Ordena el registro y alimenta `lastModified` del sitemap. */
  date: string
  title: Localized
  /** Resumen del índice y descripción para buscadores. Una sola frase. */
  summary: Localized
  /** Vacío = la entrada vive solo en el índice. Ver cabecera del archivo. */
  body: PostBlock[]
  cover?: MediaAsset
  /** Pie de la portada en el índice. Ver `caption` en el bloque `media`. */
  coverCaption?: Localized
  /**
   * Referencias, nunca texto libre. Es lo que hace que una apertura aparezca
   * sola en la ficha de su estación y en la página de su ciudad, sin que nadie
   * la coloque a mano en tres sitios.
   */
  stationSlug?: string
  citySlug?: string
  featured?: boolean
  /** `borrador` no se publica ni se construye. */
  status: 'borrador' | 'publicado'
  /** Trazabilidad del dato, igual que en estaciones. */
  dataStatus: 'placeholder' | 'verified'
}

export const posts: Post[] = [
  {
    slug: 'apertura-universidad-ean',
    type: 'apertura',
    date: '2026-06-18',
    title: {
      es: 'Nueva estación en la Universidad EAN',
      en: 'New station at Universidad EAN',
      pt: 'Nova estação na Universidade EAN',
    },
    summary: {
      /* Cifras corregidas con los datos reales (2026-09-02): 18 puntos y
         22–80 kW, no diez de 60. */
      es: 'Dieciocho puntos de carga en el campus, abiertos al público y en operación permanente.',
      en: 'Eighteen charging points on campus, open to the public and operating around the clock.',
      pt: 'Dezoito pontos de carregamento no campus, abertos ao público e em operação permanente.',
    },
    cover: media.aperturaEan,
    stationSlug: 'universidad-ean',
    citySlug: 'bogota',
    featured: true,
    /* Única entrada con cuerpo: es la que tiene material propio registrado. */
    body: [
      {
        kind: 'parrafo',
        text: {
          es: 'La estación de la Universidad EAN entra en operación con dieciocho puntos de carga de 22 a 80 kW, disponibles las 24 horas y abiertos tanto a la comunidad universitaria como a cualquier conductor.',
          en: 'The Universidad EAN station enters service with eighteen charging points from 22 to 80 kW, available 24 hours a day and open both to the university community and to any driver.',
          pt: 'A estação da Universidade EAN entra em operação com dezoito pontos de carregamento de 22 a 80 kW, disponíveis 24 horas por dia e abertos tanto à comunidade universitária quanto a qualquer motorista.',
        },
      },
      {
        kind: 'subtitulo',
        text: { es: 'Por qué un campus', en: 'Why a campus', pt: 'Por que um campus' },
      },
      {
        kind: 'parrafo',
        text: {
          es: 'Un campus concentra permanencia: quien llega se queda varias horas. Es el lugar donde cargar deja de ser una parada y pasa a ocurrir mientras se hace otra cosa, que es el criterio con el que Voltop elige dónde construir.',
          en: 'A campus concentrates dwell time: people who arrive stay for hours. It is where charging stops being a stop and starts happening while you do something else — the criterion Voltop uses to decide where to build.',
          pt: 'Um campus concentra permanência: quem chega fica por várias horas. É onde carregar deixa de ser uma parada e passa a acontecer enquanto você faz outra coisa — o critério que a Voltop usa para decidir onde construir.',
        },
      },
      { kind: 'media', asset: media.aperturaEan },
    ],
    status: 'publicado',
    dataStatus: 'placeholder',
  },
  {
    slug: 'apertura-wake-medellin',
    type: 'apertura',
    date: '2026-04-21',
    title: {
      es: 'Nueva estación de carga rápida Voltop en Wake Medellín',
      en: 'New Voltop fast-charging station at Wake Medellín',
      pt: 'Nova estação de carregamento rápido Voltop no Wake Medellín',
    },
    summary: {
      es: 'Voltop amplía su red en Medellín con una nueva estación de carga rápida en Wake, equipada con cargadores de hasta 80 kW de potencia para ofrecer una experiencia de carga más ágil a los conductores de vehículos eléctricos.',
      en: 'Voltop expands its network in Medellín with a new fast-charging station at Wake, fitted with chargers of up to 80 kW to give electric vehicle drivers a quicker charging experience.',
      pt: 'A Voltop amplia sua rede em Medellín com uma nova estação de carregamento rápido no Wake, equipada com carregadores de até 80 kW para oferecer uma experiência de carregamento mais ágil aos motoristas de veículos elétricos.',
    },
    cover: media.aperturaWake,
    coverCaption: {
      es: 'Así inauguramos Wake: una nueva estación Voltop con carga rápida de hasta 80 kW en Medellín.',
      en: 'This is how we opened Wake: a new Voltop station with fast charging of up to 80 kW in Medellín.',
      pt: 'Assim inauguramos o Wake: uma nova estação Voltop com carregamento rápido de até 80 kW em Medellín.',
    },
    stationSlug: 'wake',
    citySlug: 'medellin',
    featured: true,
    /* El cuerpo abría con un bloque `media` que era EL MISMO asset que la
       portada, así que la entrada mostraba el vídeo dos veces seguidas. Se
       retiró el bloque y no la portada: la portada es además la imagen de los
       metadatos y la del índice del registro.
       
       Con él se fue su pie de foto, "Así vivimos la apertura de Wake, nuestra
       nueva estación de carga rápida en Medellín", y no se echa de menos:
       repetía el titular de la propia entrada dos centímetros más abajo. */
    body: [
      {
        kind: 'subtitulo',
        text: {
          es: 'Hasta 80 kW para cargar más rápido',
          en: 'Up to 80 kW to charge faster',
          pt: 'Até 80 kW para carregar mais rápido',
        },
      },
      {
        kind: 'parrafo',
        text: {
          es: 'La nueva estación de Voltop en Wake se suma a nuestra red de carga en Medellín con una potencia de hasta 80 kW, ofreciendo una nueva alternativa para cargar vehículos eléctricos en la ciudad.',
          en: "Voltop's new station at Wake joins our charging network in Medellín with power of up to 80 kW, adding another option for charging electric vehicles in the city.",
          pt: 'A nova estação da Voltop no Wake se soma à nossa rede de carregamento em Medellín com potência de até 80 kW, oferecendo mais uma alternativa para carregar veículos elétricos na cidade.',
        },
      },
      {
        kind: 'parrafo',
        text: {
          es: 'La carga rápida permite aprovechar mejor el tiempo de cada parada y continuar el recorrido con mayor facilidad. Desde Wake, seguimos ampliando una red pensada para integrar la carga a los lugares y momentos que ya hacen parte del día a día.',
          en: 'Fast charging makes better use of every stop and makes getting back on the road easier. From Wake, we keep expanding a network designed to fit charging into the places and moments that are already part of the day.',
          pt: 'O carregamento rápido permite aproveitar melhor o tempo de cada parada e seguir viagem com mais facilidade. A partir do Wake, seguimos ampliando uma rede pensada para integrar o carregamento aos lugares e momentos que já fazem parte do dia a dia.',
        },
      },
      {
        kind: 'subtitulo',
        text: {
          es: 'Una red que sigue creciendo en Medellín',
          en: 'A network that keeps growing in Medellín',
          pt: 'Uma rede que segue crescendo em Medellín',
        },
      },
      {
        kind: 'parrafo',
        text: {
          es: 'Esta apertura representa un nuevo paso en la expansión de Voltop en la ciudad. Seguimos desarrollando infraestructura de carga confiable y estratégicamente ubicada para acompañar el crecimiento de la movilidad eléctrica en Colombia.',
          en: "This opening marks another step in Voltop's expansion across the city. We keep developing reliable, strategically located charging infrastructure to support the growth of electric mobility in Colombia.",
          pt: 'Esta abertura representa mais um passo na expansão da Voltop na cidade. Seguimos desenvolvendo infraestrutura de carregamento confiável e estrategicamente localizada para acompanhar o crescimento da mobilidade elétrica na Colômbia.',
        },
      },
      {
        kind: 'parrafo',
        text: {
          es: 'Con Wake sumamos una nueva ubicación a una red que continúa creciendo y acercando la carga eléctrica a más conductores.',
          en: 'With Wake we add another location to a network that keeps growing and bringing EV charging closer to more drivers.',
          pt: 'Com o Wake somamos mais uma localização a uma rede que continua crescendo e aproximando o carregamento elétrico de mais motoristas.',
        },
      },
    ],
    status: 'publicado',
    dataStatus: 'verified',
  },
  /* AQUÍ HABÍA DOS ENTRADAS MÁS: "San Fernando Plaza" y "Corredor Norte".
     Se retiraron el 2026-09-02 junto con sus estaciones: anunciaban aperturas
     de puntos que no existen. Una apertura publicada de una estación
     inexistente no es un dato desactualizado, es un dato falso, y el registro
     pierde su única función —ser el sitio donde consta lo que de verdad
     pasó— en cuanto admite una. */
  {
    slug: 'grand-hyatt-bogota',
    type: 'alianza',
    date: '2026-03-11',
    title: {
      es: 'Voltop llega al Grand Hyatt Bogotá',
      en: 'Voltop arrives at Grand Hyatt Bogotá',
      pt: 'A Voltop chega ao Grand Hyatt Bogotá',
    },
    summary: {
      es: 'Once puntos de carga en uno de los hoteles con mayor tránsito corporativo de la ciudad.',
      en: "Eleven charging points at one of the city's busiest corporate hotels.",
      pt: 'Onze pontos de carregamento em um dos hotéis com maior trânsito corporativo da cidade.',
    },
    stationSlug: 'grand-hyatt',
    citySlug: 'bogota',
    body: [],
    status: 'publicado',
    dataStatus: 'placeholder',
  },
]
