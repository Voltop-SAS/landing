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
   * HERO DE LA HOME · primer asset real del proyecto (entregado 2026-09-01).
   *
   * ── POR QUÉ ES UNA ENTRADA NUEVA Y NO SE RELLENÓ `infraestructuraAmplia` ──
   * `infraestructuraAmplia` se usa en DOS sitios con recortes incompatibles:
   * el hero a sangre y la franja 21/9 de /nosotros. Rellenar su `src` habría
   * cambiado las dos superficies a la vez, y el encargo era sustituir la
   * imagen del hero y nada más. La separación es además la que ya recomendaba
   * `docs/05-assets-todo` (decisión D1), por el mismo motivo: ninguna foto
   * sobrevive bien a los dos recortes.
   *
   * `infraestructuraAmplia` sigue con `src: null` y su hueco declarado.
   *
   * ── EL ARCHIVO ───────────────────────────────────────────────────────────
   * 7008 × 4672 px, proporción 3/2 exacta — la que pedía el brief de assets
   * precisamente para que aguante el recorte vertical del hero en móvil.
   *
   * ── POR QUÉ NO SE APUNTA AL ARCHIVO ENTREGADO ───────────────────────────
   * El original entregado, `Hero_Banner.png`, mide 7008 × 4672 y pesa
   * 50.331.395 bytes. El optimizador de imágenes de Next rechaza cualquier
   * origen por encima de **50.000.000 bytes** —`ERR_MAX_BODY_SIZE_EXCEEDED`—,
   * así que se pasa por 331 KB y la imagen NO SE RENDERIZA. No es un límite
   * configurable, y servirla sin optimizar significaría mandar 50 MB al
   * navegador justo en el elemento que mide el LCP.
   *
   * `hero-banner.jpg` es el máster web derivado de ese original: 2560 × 1706,
   * la anchura que `docs/05-assets-todo` fija para composiciones a sangre.
   * Conserva el 3/2 exacto. El original queda intacto en `public/` y debería
   * salir del repositorio: 50 MB de binario no pertenecen a un árbol de git.
   */
  heroInfraestructura: {
    id: "hero-infraestructura",
    kind: "photo",
    src: "/hero-banner.jpg",
    poster: null,
    alt: {
      es: "Estaciones de carga Voltop en operación en un parqueadero cubierto, con vehículos conectados",
      en: "Voltop charging stations in service in a covered parking facility, with vehicles plugged in",
      pt: "Estações de carregamento Voltop em operação em um estacionamento coberto, com veículos conectados",
    },
    role: {
      es: "Fondo del beat 1. Infraestructura real, en operación y con la marca visible en el equipo: la prueba de que Voltop construye, no solo instala.",
      en: "Beat 1 background. Real infrastructure, in service and with the brand visible on the hardware: proof that Voltop builds rather than merely installs.",
      pt: "Fundo do beat 1. Infraestrutura real, em operação e com a marca visível no equipamento: a prova de que a Voltop constrói, não apenas instala.",
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
