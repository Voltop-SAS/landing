/**
 * EL LENGUAJE DE MOVIMIENTO DE VOLTOP
 * Ver docs/MASTER-PROJECT-DEFINITION.md §21 y el Experience Direction Map.
 *
 * ── POR QUÉ EXISTE ────────────────────────────────────────────────────────
 * Había DOS sistemas de movimiento en paralelo y desincronizados. En CSS,
 * `@theme` declaraba las curvas y las duraciones; los componentes escribían a
 * mano `[0.22, 1, 0.36, 1]` y `0.6` / `0.7` / `0.32` en tres archivos. Ahora
 * los componentes consumen de aquí y no hay números sueltos en la presentación.
 *
 * ── LAS CUATRO PRIMITIVAS ─────────────────────────────────────────────────
 * Todo el movimiento del sitio se construye combinando cuatro gestos. No hay
 * un quinto: un vocabulario que crece deja de reconocerse, y lo que hace que
 * un sitio se sienta construido con criterio no es la variedad de sus efectos
 * sino que se repitan siempre los mismos con precisión.
 *
 * · DEPTH — el contenido llega desde el fondo: escala + opacidad.
 *   CUÁNDO: cualquier entrada en viewport. Es el gesto base.
 *   CUÁNDO NO: sobre cifras, specs o datos de estación. Lo que prueba algo no
 *   se anima; un dato que aparece con gracia se lee como publicidad.
 *
 * · FLOW — el material se desplaza dentro de un marco que no se mueve.
 *   CUÁNDO: solo fotografía y vídeo grandes. De aquí sale la profundidad.
 *   CUÁNDO NO: jamás sobre texto. Un titular con parallax se lee como
 *   plantilla, que es exactamente lo contrario de lo que buscamos.
 *
 * · FRAME — el encuadre se abre y descubre lo que ya estaba ahí.
 *   CUÁNDO: momentos signature. Dos en toda la Home, no más.
 *   CUÁNDO NO: en contenido secundario. Repetido deja de ser un descubrimiento
 *   y pasa a ser una transición cara.
 *
 * · CONTINUITY — algo persiste entre dos estados o dos páginas.
 *   CUÁNDO: hay una relación real entre lo que se deja y lo que se abre.
 *   CUÁNDO NO: entre vistas sin relación. Fingir continuidad desorienta.
 *
 * ── POR QUÉ TRES INTENSIDADES Y NO CUATRO ─────────────────────────────────
 * Se descartó un nivel SUBTLE. No es una versión pequeña de DEPTH: las
 * microinteracciones se expresan en color, opacidad y dos o tres píxeles, no
 * en escala. Meterlas en la misma escala habría creado un nivel que nadie
 * percibe y que hay que mantener igual.
 *
 * Y SIGNATURE no es un valor más alto de DEPTH: es una composición de varias
 * primitivas ligada al scroll. Por eso no está en esta tabla — se construye en
 * el componente que lo necesita, y por eso son dos y no ocho.
 *
 * ── LA LIMITACIÓN, DICHA ──────────────────────────────────────────────────
 * Esto es un ESPEJO de los tokens de `app/globals.css`, no una fuente
 * compartida: Tailwind lee el CSS y Motion necesita valores de JS. Están
 * duplicados a propósito y en dos sitios que se referencian mutuamente.
 * Si cambias uno, cambia el otro.
 * ──────────────────────────────────────────────────────────────────────────
 */

/** Curvas. Espejo de `--ease-*` en globals.css. */
export const ease = {
  /** Entradas y transiciones generales. Sale rápido, asienta despacio. */
  standard: [0.22, 1, 0.36, 1],
  /** "Corriente": simétrica, para recorridos ligados al scroll. */
  current: [0.65, 0, 0.35, 1],
  /** Salidas. Arranca lento, acelera al desaparecer. */
  exit: [0.4, 0, 1, 1],
} as const

/** Duraciones EN SEGUNDOS, que es lo que espera Motion. Espejo de `--duration-*`. */
export const duration = {
  fast: 0.2,
  base: 0.32,
  reveal: 0.7,
} as const

/**
 * Duración del CONTEO de cifras. No tiene espejo en CSS a propósito: no es una
 * transición de interfaz sino una lectura, y por eso no comparte escala con
 * las demás. Antes se escribía como `duration.slow * 2.2`, que es una forma de
 * decir "1.32 segundos" sin decirlo y ataba una lectura a un token de UI.
 */
export const COUNT_DURATION = 1.3

/**
 * DEPTH · los dos niveles del gesto base.
 *
 * Los valores están calibrados para que se PERCIBAN. Un `scale` de 0.99 es
 * indistinguible de no animar nada, y entonces el trabajo de movimiento no
 * existe para quien mira. `expressive` es deliberadamente visible.
 *
 * El desplazamiento vertical acompaña a la escala en lugar de sustituirla:
 * solo escala se lee como un zoom de presentación; solo desplazamiento es el
 * `fade + translateY` genérico del que venimos. Juntos leen como profundidad.
 */
export const depth = {
  standard: { scale: 0.965, y: 10, duration: 0.55 },
  expressive: { scale: 0.9, y: 24, duration: 0.85 },
} as const

export type DepthLevel = keyof typeof depth

/**
 * Retardo entre hermanos de una misma lista. UN valor para todo el sitio.
 *
 * Antes había cuatro —0.05, 0.06, 0.07 y 0.08— repartidos por cuatro archivos.
 * Cuatro valores que nadie distingue no son cuatro decisiones: son la ausencia
 * de una.
 */
export const STAGGER = 0.07

/**
 * Tope del escalonado. Sin él, una lista de doce elementos hace esperar casi un
 * segundo al último y la página se siente lenta en lugar de coreografiada.
 */
const STAGGER_MAX = 5

/**
 * DEPTH aplicado. Devuelve las props de Motion completas, incluido el enganche
 * `data-reveal` de la red de seguridad en CSS (ver globals.css): Motion escribe
 * el estado inicial como estilo en línea, así que sin esa red el contenido
 * viajaría invisible en el HTML servido.
 *
 * `reduce` lo ANULA por completo en vez de acortarlo: media duración sigue
 * siendo movimiento (§21).
 */
export function depthMotion(level: DepthLevel, reduce: boolean, index = 0) {
  const d = depth[level]
  const delay = Math.min(index, STAGGER_MAX) * STAGGER

  return {
    'data-reveal': '',
    initial: { opacity: 0, scale: d.scale, y: d.y },
    whileInView: { opacity: 1, scale: 1, y: 0 },
    /* `once`: el contenido se revela una vez y permanece. Nunca ligamos la
       opacidad del contenido al progreso de scroll — volvería a 0 al subir. */
    viewport: { once: true, margin: '-80px' },
    transition: {
      duration: reduce ? 0 : d.duration,
      ease: ease.standard,
      delay: reduce ? 0 : delay,
    },
  } as const
}
