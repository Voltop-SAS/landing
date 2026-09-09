'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { registerScrollEngine, scrollToTop } from '@ui/common/lib/scroll'

/**
 * Smoothed scrolling. Fully disabled under `prefers-reduced-motion`, and it
 * does not compete with `scroll-behavior: smooth` (removed from the base CSS).
 */
export function SmoothScroll() {
  const pathname = usePathname()

  /**
   * Every new page starts at the top. The full reason lives in `scrollToTop`.
   *
   * It depends on `pathname` and not on the full URL on purpose: a link to
   * `#ciudades` changes the hash but not the route, so this effect does not
   * fire and the jump to the anchor keeps working. And the first load is
   * already at the top, so calling it then does nothing visible.
   */
  useEffect(() => {
    if (window.location.hash) return
    scrollToTop()
  }, [pathname])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    registerScrollEngine(lenis)

    let rafId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    })

    return () => {
      cancelAnimationFrame(rafId)
      registerScrollEngine(null)
      lenis.destroy()
    }
  }, [])

  return null
}
