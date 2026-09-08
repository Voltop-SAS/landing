/**
 * Shared scroll control.
 *
 * Lenis takes over the page scroll, so locking it with CSS is not enough: the
 * engine has to be stopped too. This module keeps a single reference and
 * exposes lock/unlock for overlays (mobile menu, dialogs).
 */

type LenisLike = {
  stop: () => void
  start: () => void
  destroy: () => void
  raf: (t: number) => void
  scrollTo: (target: number, opts?: { immediate?: boolean; force?: boolean }) => void
}

let instance: LenisLike | null = null
let locks = 0

export function registerScrollEngine(engine: LenisLike | null) {
  instance = engine
}

export function lockScroll() {
  locks += 1
  if (locks > 1) return
  instance?.stop()
  document.body.style.overflow = 'hidden'
  // Compensates for the scrollbar so the layout does not jump when locking.
  const gap = window.innerWidth - document.documentElement.clientWidth
  if (gap > 0) document.body.style.paddingRight = `${gap}px`
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return
  instance?.start()
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

/**
 * Lleva el scroll arriba del todo, al instante y sin animación.
 *
 * ── POR QUÉ HACE FALTA ────────────────────────────────────────────────────
 * El App Router de Next sube al principio en cada navegación de cliente, pero
 * Lenis se ha quedado con el control del scroll y conserva su posición interna,
 * así que la restaura sobre la página nueva. Medido el 2026-09-08 sobre el
 * build de producción: pulsando «Explora la red completa» desde 2.698px, la
 * página de Red abría en 2.700px de 3.700 — **al 73% de su altura**. Con
 * «Conoce esta estación», al 69%.
 *
 * Es un fallo de TODA la navegación, no de esos dos botones.
 *
 * `immediate` y `force`: sin animación, porque no es un desplazamiento que el
 * usuario haya pedido —es el punto de partida de otra página— y animarlo se
 * vería como un salto; y `force` para que funcione aunque el motor esté parado
 * por un overlay abierto.
 */
export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}
