'use client'

import { useEffect, useState } from 'react'

/**
 * HAS THIS ELEMENT ALREADY SCROLLED PAST THE TOP OF THE SCREEN?
 *
 * `whileInView` builds on `IntersectionObserver`, and an observer only reports
 * what intersects RIGHT NOW. If the page starts with the scroll partway down
 * — a reload restores the position, and an anchor link lands straight at the
 * bottom — everything above it never intersects, so it is never revealed.
 *
 * Measured before the fix: reloading at 5400px left ELEVEN blocks at opacity 0
 * — the city index, the four business segments and the three news items — and
 * they stayed invisible on the way back up. This is not an animation detail:
 * it is content that disappears, which is exactly what §21 forbids.
 *
 * The check runs once on mount. If the element is already past, it renders
 * without animation: there is nothing to reveal about something the user has
 * already left behind, and since it is off screen there is no flash to see
 * either.
 */
export function useScrolledPast(ref: React.RefObject<HTMLElement | null>) {
  const [passed, setPassed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    /* `bottom < 0`: the whole element ended up above the top edge. Anything
       partially visible IS seen by the observer, so it does not need this
       shortcut. */
    if (el.getBoundingClientRect().bottom < 0) setPassed(true)
  }, [ref])

  return passed
}
