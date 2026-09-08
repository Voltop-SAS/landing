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
   * Cada página nueva empieza arriba. La razón entera está en `scrollToTop`.
   *
   * Depende de `pathname` y no de la URL completa a propósito: un enlace a
   * `#ciudades` cambia el hash pero no la ruta, así que este efecto no se
   * dispara y el salto al ancla sigue funcionando. Y la primera carga ya está
   * arriba, de modo que llamarlo entonces no hace nada visible.
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
