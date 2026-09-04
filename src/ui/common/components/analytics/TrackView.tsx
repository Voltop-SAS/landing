'use client'

import { useEffect, useRef } from 'react'
import { track, type EventName, type EventProps } from '~/core/common/infrastructure/analytics'

/**
 * Emits an event when its content COMES INTO VIEW, exactly once.
 *
 * It exists because the measurement plan (§31) declared seventeen events and
 * six of them never fired: `ciudad_vista`, `caso_visto`, `impacto_visto` and
 * company. All of them are VIEW events on pages that are Server Components, so
 * minimal client islands were needed.
 *
 * It renders nothing of its own: it wraps. Genuinely `once` — a counter that
 * fires every time the block crosses the viewport does not measure interest,
 * it measures scrolling.
 */
export function TrackView({
  event,
  props,
  children,
  /** `0.5` = half the block visible. For whole pages, `0`. */
  threshold = 0.5,
}: {
  event: EventName
  props?: EventProps
  children?: React.ReactNode
  threshold?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const sent = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || sent.current) return

    /* Without IntersectionObserver the event is emitted anyway: losing the
       measurement is worse than measuring it with no threshold. */
    if (typeof IntersectionObserver === 'undefined') {
      sent.current = true
      track(event, props)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !sent.current) {
          sent.current = true
          track(event, props)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, threshold])

  return <div ref={ref}>{children}</div>
}
