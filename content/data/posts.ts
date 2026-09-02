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
  | { kind: "media"; asset: MediaAsset };

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
      es: "Diez puntos de carga de 60 kW en el campus, abiertos al público y en operación permanente.",
      en: "Ten 60 kW charging points on campus, open to the public and operating around the clock.",
      pt: "Dez pontos de carregamento de 60 kW no campus, abertos ao público e em operação permanente.",
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
          es: "La estación de la Universidad EAN entra en operación con diez puntos de carga de 60 kW, disponibles las 24 horas y abiertos tanto a la comunidad universitaria como a cualquier conductor.",
          en: "The Universidad EAN station enters service with ten 60 kW charging points, available 24 hours a day and open both to the university community and to any driver.",
          pt: "A estação da Universidade EAN entra em operação com dez pontos de carregamento de 60 kW, disponíveis 24 horas por dia e abertos tanto à comunidade universitária quanto a qualquer motorista.",
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
    slug: "san-fernando-plaza-medellin",
    type: "apertura",
    date: "2026-05-07",
    title: {
      es: "Carga de 120 kW en San Fernando Plaza",
      en: "120 kW charging at San Fernando Plaza",
      pt: "Carregamento de 120 kW no San Fernando Plaza",
    },
    summary: {
      /* "Dobla la potencia de la red en Bogotá" deja de ser cierto el día que
         abra Corredor Norte —150 kW, Bogotá— anunciado en la entrada de al
         lado. Un registro cuyas entradas caducan es peor que uno que solo
         declara el hecho. */
      es: "Seis puntos de 120 kW en El Poblado: la primera estación de Voltop en el Valle de Aburrá.",
      en: "Six 120 kW points in El Poblado: Voltop's first station in the Aburrá Valley.",
      pt: "Seis pontos de 120 kW em El Poblado: a primeira estação da Voltop no Vale de Aburrá.",
    },
    stationSlug: "san-fernando-plaza",
    citySlug: "medellin",
    body: [],
    status: "publicado",
    dataStatus: "placeholder",
  },
  {
    slug: "corredor-norte-proxima-apertura",
    type: "noticia",
    date: "2026-04-22",
    title: {
      es: "Corredor Norte: 150 kW en construcción",
      en: "Corredor Norte: 150 kW under construction",
      pt: "Corredor Norte: 150 kW em construção",
    },
    summary: {
      es: "Ocho puntos de 150 kW en el corredor de salida norte de Bogotá.",
      en: "Eight 150 kW points on Bogotá's northern exit corridor.",
      pt: "Oito pontos de 150 kW no corredor de saída norte de Bogotá.",
    },
    stationSlug: "corredor-norte",
    citySlug: "bogota",
    body: [],
    status: "publicado",
    dataStatus: "placeholder",
  },
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
