import type { Localized } from "@/lib/i18n/config";
import { media } from "@/content/data/media";
import type { MediaAsset } from "@/content/data/media";

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

export type PostType = "apertura" | "evento" | "alianza" | "comunicado" | "noticia";

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
  | { kind: "parrafo"; text: Localized }
  | { kind: "subtitulo"; text: Localized }
  | { kind: "lista"; items: Localized[] }
  /** Atribución obligatoria: una cita sin autor no es una cita. */
  | { kind: "cita"; text: Localized; author: string; role: Localized }
  /**
   * `caption` es el pie VISIBLE. Si falta, se usa el `alt` del asset.
   *
   * No son lo mismo y por eso se separan: el `alt` describe la imagen para
   * quien no la ve, y el pie la comenta para quien sí. Usar el alt como pie
   * obliga a que un solo texto haga dos trabajos, y acaba haciendo mal los dos.
   */
  | { kind: "media"; asset: MediaAsset; caption?: Localized };

export type Post = {
  slug: string;
  type: PostType;
  /** ISO `YYYY-MM-DD`. Ordena el registro y alimenta `lastModified` del sitemap. */
  date: string;
  title: Localized;
  /** Resumen del índice y descripción para buscadores. Una sola frase. */
  summary: Localized;
  /** Vacío = la entrada vive solo en el índice. Ver cabecera del archivo. */
  body: PostBlock[];
  cover?: MediaAsset;
  /** Pie de la portada en el índice. Ver `caption` en el bloque `media`. */
  coverCaption?: Localized;
  /**
   * Referencias, nunca texto libre. Es lo que hace que una apertura aparezca
   * sola en la ficha de su estación y en la página de su ciudad, sin que nadie
   * la coloque a mano en tres sitios.
   */
  stationSlug?: string;
  citySlug?: string;
  featured?: boolean;
  /** `borrador` no se publica ni se construye. */
  status: "borrador" | "publicado";
  /** Trazabilidad del dato, igual que en estaciones. */
  dataStatus: "placeholder" | "verified";
};

export const posts: Post[] = [
  {
    slug: "apertura-universidad-ean",
    type: "apertura",
    date: "2026-06-18",
    title: {
      es: "Nueva estación en la Universidad EAN",
      en: "New station at Universidad EAN",
      pt: "Nova estação na Universidade EAN",
    },
    summary: {
      /* Cifras corregidas con los datos reales (2026-09-02): 18 puntos y
         22–80 kW, no diez de 60. */
      es: "Dieciocho puntos de carga en el campus, abiertos al público y en operación permanente.",
      en: "Eighteen charging points on campus, open to the public and operating around the clock.",
      pt: "Dezoito pontos de carregamento no campus, abertos ao público e em operação permanente.",
    },
    cover: media.aperturaEan,
    stationSlug: "universidad-ean",
    citySlug: "bogota",
    featured: true,
    /* Única entrada con cuerpo: es la que tiene material propio registrado. */
    body: [
      {
        kind: "parrafo",
        text: {
          es: "La estación de la Universidad EAN entra en operación con dieciocho puntos de carga de 22 a 80 kW, disponibles las 24 horas y abiertos tanto a la comunidad universitaria como a cualquier conductor.",
          en: "The Universidad EAN station enters service with eighteen charging points from 22 to 80 kW, available 24 hours a day and open both to the university community and to any driver.",
          pt: "A estação da Universidade EAN entra em operação com dezoito pontos de carregamento de 22 a 80 kW, disponíveis 24 horas por dia e abertos tanto à comunidade universitária quanto a qualquer motorista.",
        },
      },
      {
        kind: "subtitulo",
        text: { es: "Por qué un campus", en: "Why a campus", pt: "Por que um campus", },
      },
      {
        kind: "parrafo",
        text: {
          es: "Un campus concentra permanencia: quien llega se queda varias horas. Es el lugar donde cargar deja de ser una parada y pasa a ocurrir mientras se hace otra cosa, que es el criterio con el que Voltop elige dónde construir.",
          en: "A campus concentrates dwell time: people who arrive stay for hours. It is where charging stops being a stop and starts happening while you do something else — the criterion Voltop uses to decide where to build.",
          pt: "Um campus concentra permanência: quem chega fica por várias horas. É onde carregar deixa de ser uma parada e passa a acontecer enquanto você faz outra coisa — o critério que a Voltop usa para decidir onde construir.",
        },
      },
      { kind: "media", asset: media.aperturaEan },
    ],
    status: "publicado",
    dataStatus: "placeholder",
  },
  {
    slug: "apertura-wake-medellin",
    type: "apertura",
    date: "2026-04-21",
    title: {
      es: "Más potencia para Medellín: nueva estación de carga rápida en Wake",
      en: "More power for Medellín: a new fast-charging station at Wake",
      pt: "Mais potência para Medellín: nova estação de carregamento rápido no Wake",
    },
    summary: {
      es: "Hasta 80 kW de potencia para cargar más rápido y pasar más tiempo en movimiento.",
      en: "Up to 80 kW so you charge faster and spend more time moving.",
      pt: "Até 80 kW para carregar mais rápido e passar mais tempo em movimento.",
    },
    cover: media.aperturaWake,
    coverCaption: {
      es: "Así inauguramos Wake: una nueva estación Voltop con carga rápida de hasta 80 kW en Medellín.",
      en: "This is how we opened Wake: a new Voltop station with fast charging of up to 80 kW in Medellín.",
      pt: "Assim inauguramos o Wake: uma nova estação Voltop com carregamento rápido de até 80 kW em Medellín.",
    },
    stationSlug: "wake",
    citySlug: "medellin",
    featured: true,
    body: [
      {
        kind: "media",
        asset: media.aperturaWake,
        caption: {
          es: "Así vivimos la apertura de Wake, nuestra nueva estación de carga rápida en Medellín.",
          en: "How we experienced the opening of Wake, our new fast-charging station in Medellín.",
          pt: "Como vivemos a abertura do Wake, nossa nova estação de carregamento rápido em Medellín.",
        },
      },
      {
        kind: "subtitulo",
        text: { es: "80 kW para cargar más rápido", en: "80 kW to charge faster", pt: "80 kW para carregar mais rápido", },
      },
      {
        kind: "parrafo",
        text: {
          es: "Wake llega a la red Voltop con carga rápida de hasta 80 kW. Más potencia significa menos tiempo conectado y una experiencia de carga mucho más ágil.",
          en: "Wake joins the Voltop network with fast charging of up to 80 kW. More power means less time plugged in and a much quicker charging experience.",
          pt: "O Wake chega à rede Voltop com carregamento rápido de até 80 kW. Mais potência significa menos tempo conectado e uma experiência de carregamento muito mais ágil.",
        },
      },
      {
        kind: "parrafo",
        text: {
          es: "Una nueva estación en Medellín que nos acerca a lo que queremos construir: una ciudad donde moverse en eléctrico sea cada vez más fácil.",
          en: "A new station in Medellín that brings us closer to what we want to build: a city where moving electric keeps getting easier.",
          pt: "Uma nova estação em Medellín que nos aproxima do que queremos construir: uma cidade onde se mover de elétrico seja cada vez mais fácil.",
        },
      },
    ],
    status: "publicado",
    dataStatus: "verified",
  },
  /* AQUÍ HABÍA DOS ENTRADAS MÁS: "San Fernando Plaza" y "Corredor Norte".
     Se retiraron el 2026-09-02 junto con sus estaciones: anunciaban aperturas
     de puntos que no existen. Una apertura publicada de una estación
     inexistente no es un dato desactualizado, es un dato falso, y el registro
     pierde su única función —ser el sitio donde consta lo que de verdad
     pasó— en cuanto admite una. */
  {
    slug: "grand-hyatt-bogota",
    type: "alianza",
    date: "2026-03-11",
    title: {
      es: "Voltop llega al Grand Hyatt Bogotá",
      en: "Voltop arrives at Grand Hyatt Bogotá",
      pt: "A Voltop chega ao Grand Hyatt Bogotá",
    },
    summary: {
      es: "Once puntos de carga en uno de los hoteles con mayor tránsito corporativo de la ciudad.",
      en: "Eleven charging points at one of the city's busiest corporate hotels.",
      pt: "Onze pontos de carregamento em um dos hotéis com maior trânsito corporativo da cidade.",
    },
    stationSlug: "grand-hyatt",
    citySlug: "bogota",
    body: [],
    status: "publicado",
    dataStatus: "placeholder",
  },
];
