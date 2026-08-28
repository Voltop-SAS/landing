/**
 * MOTION · valores para JavaScript
 * Ver docs/MASTER-PROJECT-DEFINITION.md §21.
 *
 * ── POR QUÉ EXISTE ────────────────────────────────────────────────────────
 * Había DOS sistemas de movimiento en paralelo y desincronizados. En CSS,
 * `@theme` declaraba `--ease-standard`, `--ease-current`, `--ease-exit` y cinco
 * duraciones; en la práctica los componentes con Motion escribían a mano
 * `[0.22, 1, 0.36, 1]` y `0.6` / `0.7` / `0.32` en tres archivos distintos, y
 * tres de esos tokens no se usaban en ningún sitio.
 *
 * El resultado era que cambiar el tempo del sitio exigía editar CSS y JS por
 * separado, sin garantía de que coincidieran. Ahora los componentes consumen
 * de aquí y no hay números sueltos en la capa de presentación.
 *
 * ── LA LIMITACIÓN, DICHA ──────────────────────────────────────────────────
 * Esto es un ESPEJO de los tokens de `app/globals.css`, no una fuente
 * compartida: Tailwind lee el CSS y Motion necesita valores de JS, y unirlos de
 * verdad exigiría generar uno desde el otro en tiempo de build. Los valores
 * están duplicados a propósito y en dos sitios que se referencian mutuamente.
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
} as const;

/** Duraciones EN SEGUNDOS, que es lo que espera Motion. Espejo de `--duration-*`. */
export const duration = {
  instant: 0.12,
  fast: 0.2,
  base: 0.32,
  slow: 0.6,
  reveal: 0.7,
} as const;

/**
 * Transición de aparición al entrar en viewport.
 * `reduce` la anula por completo en lugar de acortarla: media duración sigue
 * siendo movimiento (§21).
 */
export function revealTransition(reduce: boolean, delay = 0) {
  return {
    duration: reduce ? 0 : duration.slow,
    ease: ease.standard,
    delay: reduce ? 0 : delay,
  };
}
