import type { Localized } from "@/lib/i18n/config";

/**
 * REGISTRO DE MEDIA NARRATIVA
 * Ver docs/MASTER-PROJECT-DEFINITION.md §20, §32 y §33.
 *
 * Punto ÚNICO de conexión entre la narrativa y los archivos reales.
 * Cuando lleguen los assets, solo cambia este archivo: se rellenan `src` y
 * `poster` y todo el sitio deja de mostrar placeholders automáticamente.
 * Ningún componente referencia una ruta de archivo directamente.
 *
 * `src: null` = asset confirmado como existente pero AÚN NO ENTREGADO.
 */

export type MediaKind = "video" | "photo";

export type MediaAsset = {
  id: string;
  kind: MediaKind;
  /** Ruta del archivo final. `null` mientras no se haya recibido. */
  src: string | null;
  /** Frame de portada — crítico para LCP y para el estado sin reproducir. */
  poster: string | null;
  /** Texto alternativo / descripción accesible. Obligatorio siempre. */
  alt: Localized;
  /** Qué hace esta pieza en la narrativa. Guía el diseño y la edición. */
  role: Localized;
  /** Duración conocida o estimada del material original. */
  duration?: string;
  /** Relación de aspecto para reservar espacio y evitar CLS. */
  aspect: "16/9" | "4/3" | "3/2" | "1/1" | "21/9" | "9/16";
  /** Disponibilidad declarada del material original. */
  availability: "confirmado-no-entregado" | "a-producir" | "entregado";
};

export const media = {
  /** SIGNATURE MOMENT — prueba de capacidad de construcción. */
  estacionMedellin: {
    id: "estacion-medellin",
    kind: "video",
    src: null,
    poster: null,
    alt: {
      es: "Nueva estación de carga Voltop en Medellín, vista general de la infraestructura",
      en: "New Voltop charging station in Medellín, wide view of the infrastructure",
      pt: "Nova estação de carregamento Voltop em Medellín, vista geral da infraestrutura",
    },
    role: {
      es: "Signature moment. Demuestra que Voltop construye infraestructura real, no puntos de carga.",
      en: "Signature moment. Proves Voltop builds real infrastructure, not charging points.",
      pt: "Signature moment. Prova que a Voltop constrói infraestrutura real, não pontos de carregamento.",
    },
    duration: "1:20",
    aspect: "21/9",
    availability: "confirmado-no-entregado",
  },

  /** Prueba de partnership institucional y de personas. */
  aperturaEan: {
    id: "apertura-ean",
    kind: "video",
    src: null,
    poster: null,
    alt: {
      es: "Apertura de la estación Voltop en la Universidad EAN, con directivos de la universidad y el CEO de Voltop",
      en: "Opening of the Voltop station at EAN University, with university leadership and Voltop's CEO",
      pt: "Abertura da estação Voltop na Universidade EAN, com diretores da universidade e o CEO da Voltop",
    },
    role: {
      es: "Prueba humana e institucional. Sirve simultáneamente a confianza B2B y a marca.",
      en: "Human and institutional proof. Serves both B2B trust and brand.",
      pt: "Prova humana e institucional. Serve à confiança B2B e à marca.",
    },
    duration: "2:05",
    aspect: "16/9",
    availability: "confirmado-no-entregado",
  },

  /** Prueba de propósito y liderazgo. */
  visionCeo: {
    id: "vision-ceo",
    kind: "video",
    src: null,
    poster: null,
    alt: {
      es: "Bruno Ocampo, fundador y CEO de Voltop, hablando desde una estación de carga",
      en: "Bruno Ocampo, founder and CEO of Voltop, speaking from a charging station",
      pt: "Bruno Ocampo, fundador e CEO da Voltop, falando de uma estação de carregamento",
    },
    role: {
      es: "Propósito y liderazgo. Íntimo y breve, no corporativo.",
      en: "Purpose and leadership. Intimate and brief, not corporate.",
      pt: "Propósito e liderança. Íntimo e breve, não corporativo.",
    },
    duration: "0:45",
    aspect: "16/9",
    availability: "confirmado-no-entregado",
  },

  /** Material de respiración: comunica escala sin una sola cifra. */
  infraestructuraAmplia: {
    id: "infraestructura-amplia",
    kind: "photo",
    src: null,
    poster: null,
    alt: {
      es: "Estación de carga Voltop en operación, con vehículos conectados",
      en: "Voltop charging station in operation, with vehicles plugged in",
      pt: "Estação de carregamento Voltop em operação, com veículos conectados",
    },
    role: {
      es: "Respiración y contraste. Escala física sin datos.",
      en: "Breathing room and contrast. Physical scale without data.",
      pt: "Respiro e contraste. Escala física sem dados.",
    },
    aspect: "21/9",
    availability: "confirmado-no-entregado",
  },

  espacioComercial: {
    id: "espacio-comercial",
    kind: "photo",
    src: null,
    poster: null,
    alt: {
      es: "Puntos de carga Voltop integrados en el parqueadero de un espacio comercial",
      en: "Voltop charging points integrated into a commercial space's parking area",
      pt: "Pontos de carregamento Voltop integrados ao estacionamento de um espaço comercial",
    },
    role: {
      es: "Evidencia B2B: la infraestructura dentro de un negocio real.",
      en: "B2B evidence: infrastructure inside a real business.",
      pt: "Evidência B2B: infraestrutura dentro de um negócio real.",
    },
    aspect: "4/3",
    availability: "confirmado-no-entregado",
  },

  detalleCarga: {
    id: "detalle-carga",
    kind: "photo",
    src: null,
    poster: null,
    alt: {
      es: "Detalle de un conector de carga Voltop acoplado a un vehículo eléctrico",
      en: "Close-up of a Voltop connector plugged into an electric vehicle",
      pt: "Detalhe de um conector Voltop plugado em um veículo elétrico",
    },
    role: {
      es: "Textura y precisión: el detalle físico que hace tangible la tecnología.",
      en: "Texture and precision: the physical detail that makes the technology tangible.",
      pt: "Textura e precisão: o detalhe físico que torna a tecnologia tangível.",
    },
    aspect: "3/2",
    availability: "confirmado-no-entregado",
  },

  /**
   * FOTOGRAFÍA REAL · dos assets entregados el 2026-09-01.
   *
   * ── POR QUÉ NINGUNO APUNTA AL ARCHIVO ENTREGADO ──────────────────────────
   * Los originales —`Hero.png` (60.9 MB) y `Hero_Banner.png` (50.3 MB)— superan
   * el límite del optimizador de imágenes de Next, que rechaza cualquier origen
   * por encima de **50.000.000 bytes** (`ERR_MAX_BODY_SIZE_EXCEEDED`). Por
   * encima de esa cifra la imagen NO SE RENDERIZA, y no es configurable.
   * Servirlas sin optimizar significaría mandar decenas de MB al navegador.
   *
   * Cada uno tiene su máster web derivado a 2560 px de ancho, la medida que
   * `docs/05-assets-todo` fija para composiciones a sangre, conservando el 3/2
   * exacto del original. Los originales quedan en `public/` y **deben salir del
   * repositorio**: 111 MB de binario no pertenecen a un árbol de git.
   */

  /** BEAT 1 · HERO. Vehículo conectado: la carga ocurriendo, no el equipo vacío. */
  heroVehiculoCargando: {
    id: "hero-vehiculo-cargando",
    kind: "photo",
    src: "/hero-vehiculo-cargando.jpg",
    poster: null,
    alt: {
      es: "Vehículo eléctrico conectado a un cargador Voltop en un parqueadero cubierto",
      en: "Electric vehicle plugged into a Voltop charger in a covered parking facility",
      pt: "Veículo elétrico conectado a um carregador Voltop em um estacionamento coberto",
    },
    role: {
      es: "Fondo del beat 1. Muestra el servicio en uso —el cable conectado, el equipo con marca— en lugar de infraestructura vacía. Es el elemento LCP de la Home.",
      en: "Beat 1 background. Shows the service in use — cable connected, branded hardware — rather than empty infrastructure. It is the Home's LCP element.",
      pt: "Fundo do beat 1. Mostra o serviço em uso — cabo conectado, equipamento com marca — em vez de infraestrutura vazia. É o elemento LCP da Home.",
    },
    aspect: "3/2",
    availability: "entregado",
  },

  /**
   * BEAT 2 · SIGNATURE MOMENT. Sustituye al hueco que ocupaba el video
   * `estacionMedellin`, que sigue pendiente de entrega y se conserva en este
   * registro: cuando llegue, la sección puede volver a él cambiando una línea.
   *
   * Encaja con el titular del beat —"No instalamos cargadores, construimos
   * lugares"— porque muestra varias estaciones en un espacio real, no un
   * equipo aislado.
   */
  estacionInfraestructura: {
    id: "estacion-infraestructura",
    kind: "photo",
    src: "/estacion-infraestructura.jpg",
    poster: null,
    alt: {
      es: "Estaciones de carga Voltop en operación en un parqueadero cubierto, con vehículos conectados",
      en: "Voltop charging stations in service in a covered parking facility, with vehicles plugged in",
      pt: "Estações de carregamento Voltop em operação em um estacionamento coberto, com veículos conectados",
    },
    role: {
      es: "Fondo del beat 2. Varias estaciones en un mismo espacio: la prueba de que Voltop construye lugares y no puntos sueltos.",
      en: "Beat 2 background. Several stations in one space: proof that Voltop builds places, not isolated points.",
      pt: "Fundo do beat 2. Várias estações em um mesmo espaço: a prova de que a Voltop constrói lugares e não pontos isolados.",
    },
    aspect: "3/2",
    availability: "entregado",
  },
} satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof media;

/** Un asset está listo cuando tiene archivo. Mientras tanto, la UI muestra su hueco declarado. */
export function isReady(asset: MediaAsset): boolean {
  return asset.src !== null;
}
