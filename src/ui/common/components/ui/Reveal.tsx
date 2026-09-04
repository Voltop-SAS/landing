'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { depthMotion, type DepthLevel } from '@ui/common/lib/motion'
import { useScrolledPast } from '@ui/common/hooks/useScrolledPast'

/**
 * DEPTH · content arrives from the back.
 *
 * It is the system's base gesture (see `@ui/common/lib/motion`). It replaces
 * the previous `fade + translateY`, which is any template's default reveal: it
 * was perceived as "the page has loaded", not as a decision. Scale plus offset
 * read as DEPTH, which is the concept that does belong to Voltop — moving
 * through an installation — without literally depicting anything electrical.
 *
 * Only `opacity` and `transform` are animated (§21, hard performance rule).
 *
 * ── STAGGER IS REQUESTED BY INDEX, NOT BY DELAY ───────────────────────────
 * Each list used to pass its own `delay={i * 0.0x}` and there were four
 * different rhythms across the site. Now the POSITION is passed and the system
 * decides the timing: one rhythm, and no list can drift without it showing.
 *
 * ── THE INTENSITY DROPS BY ITSELF ON MOBILE ───────────────────────────────
 * `expressive` moves 24px and scales from 0.9. On a card with `.glass` that
 * means recompositing a `backdrop-filter` on every frame, and on a mid-range
 * phone that is what turns an animation into a stutter. Below 768px the level
 * falls to `standard` on its own: the choreography is kept, the cost is not.
 * It is the graceful degradation the map asks for, decided here and not in
 * every component.
 *
 * ── TWO SAFETY NETS, NOT ONE ──────────────────────────────────────────────
 * 1. `data-reveal` hooks into the `globals.css` rules: Motion writes the
 *    initial state as an inline style, so the served HTML carries
 *    `opacity: 0`. With `scripting: none` or `prefers-reduced-motion` the CSS
 *    overrides it without depending on the JS.
 * 2. `useScrolledPast` covers the case CSS cannot see: reloading halfway down
 *    the page left eleven blocks invisible FOREVER, because an intersection
 *    observer does not report what is already above. See its file header.
 */
export function Reveal({
  children,
  level = 'standard',
  index = 0,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  /** `expressive` is reserved for the narrative beats. See the intensity map. */
  level?: DepthLevel
  /** Position in the list. The system turns it into a delay. */
  index?: number
  className?: string
  as?: 'div' | 'li' | 'span'
}) {
  const reduce = useReducedMotion()
  /* `HTMLElement` rather than `HTMLDivElement`: `as` can be div, li or span,
     and a ref typed to the most specific one does not fit all three. */
  const ref = useRef<HTMLElement>(null)
  const alreadyPassed = useScrolledPast(ref)
  const [compact, setCompact] = useState(false)
  const Motion = motion[as]

  /* Resolved AFTER mounting: there is no `matchMedia` on the server, and
     reading it during render would break hydration. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const read = () => setCompact(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])

  /* Already scrolled past: it just shows. Nobody sees the entrance animation
     of something that is off screen, and waiting for it to intersect — which
     is not going to happen — is what left it invisible. */
  if (alreadyPassed) {
    return (
      <Motion
        ref={ref as React.Ref<HTMLDivElement & HTMLLIElement & HTMLSpanElement>}
        className={className}
      >
        {children}
      </Motion>
    )
  }

  const effective: DepthLevel = compact && level === 'expressive' ? 'standard' : level

  return (
    <Motion
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement & HTMLSpanElement>}
      className={className}
      {...depthMotion(effective, Boolean(reduce), index)}
    >
      {children}
    </Motion>
  )
}
