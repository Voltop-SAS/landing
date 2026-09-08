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
 * Sends the scroll to the very top, instantly and with no animation.
 *
 * ── WHY IT IS NEEDED ─────────────────────────────────────────────────────
 * Next's App Router goes to the top on every client navigation, but Lenis has
 * taken over the scroll and keeps its own internal position, so it restores it
 * over the new page. Measured on 2026-09-08 against the production build:
 * pressing "Explora la red completa" from 2,698px opened the network page at
 * 2,700px out of 3,700 — **73% down**. With "Conoce esta estación", 69%.
 *
 * It is a fault of the WHOLE navigation, not of those two buttons.
 *
 * `immediate` and `force`: no animation, because this is not a scroll the user
 * asked for — it is the starting point of another page — and animating it would
 * read as a jump; and `force` so it works even when the engine is stopped by an
 * open overlay.
 */
export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}
