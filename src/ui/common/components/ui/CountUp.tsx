'use client'

import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { COUNT_DURATION, ease } from '@ui/common/lib/motion'

/**
 * FIGURE THAT COUNTS UP WHEN IT ENTERS THE SCREEN
 * See docs/MASTER-PROJECT-DEFINITION.md §21 and §29.
 *
 * ── THE FINAL VALUE IS ALREADY IN THE SERVED HTML ────────────────────────
 * The server paints the final figure. If the JS never arrives, if it fails, or
 * if a search engine reads the page, the number is right there — not a zero
 * and not a gap. The count-up is an addition on top of content that already
 * works, which is the only honest way to animate a piece of data.
 *
 * The start at zero is written in `useLayoutEffect` (via `useEffect` writing
 * straight to the node before the first observable paint): that way there is
 * no flash of the final value followed by a jump back to zero.
 *
 * ── NO `useState` ────────────────────────────────────────────────────────
 * Counting with state causes one render per frame: at 60fps that is 60 React
 * renders to move a piece of text. Here it is written straight to the node
 * through a ref, which is what keeps it smooth on low-end devices too (§29).
 *
 * ── REDUCED MOTION ───────────────────────────────────────────────────────
 * The animation is not degraded: it is SKIPPED. The figure is already in
 * place, so there is nothing to do and nothing that could end up invisible.
 */
export function CountUp({
  value,
  className,
  /** Suffix that is not animated (a unit, for example). */
  suffix = '',
}: {
  value: number
  className?: string
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduce = useReducedMotion()
  const hasRun = useRef(false)

  useEffect(() => {
    if (reduce || !inView || hasRun.current) return
    const node = ref.current
    if (!node) return
    hasRun.current = true

    const controls = animate(0, value, {
      duration: COUNT_DURATION,
      ease: ease.standard,
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`
      },
      /* Whatever happens, the node ends on the exact value: the last frame's
         rounding must not leave the figure one off. */
      onComplete: () => {
        node.textContent = `${value}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, reduce, value, suffix])

  return (
    <span
      ref={ref}
      className={className}
    >
      {value}
      {suffix}
    </span>
  )
}
