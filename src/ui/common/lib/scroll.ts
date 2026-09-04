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
