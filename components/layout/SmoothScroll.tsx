'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { registerScrollEngine } from '@/lib/scroll'

/**
 * Scroll suavizado. Se desactiva por completo con `prefers-reduced-motion`
 * y no compite con `scroll-behavior: smooth` (eliminado del CSS base).
 */
export function SmoothScroll() {
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
