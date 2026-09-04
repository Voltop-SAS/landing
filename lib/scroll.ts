/**
 * Control de scroll compartido.
 *
 * Lenis toma el control del scroll de la página, así que bloquearlo con CSS no
 * basta: hay que detener también el motor. Este módulo mantiene una referencia
 * única y expone bloqueo/desbloqueo para overlays (menú móvil, diálogos).
 */

type LenisLike = {
  stop: () => void
  start: () => void
  destroy: () => void
  raf: (t: number) => void
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
  // Compensa la barra de scroll para que el layout no salte al bloquear.
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
