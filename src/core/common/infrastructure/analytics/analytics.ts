/**
 * ANALYTICS LAYER · decoupled
 * See docs/MASTER-PROJECT-DEFINITION.md §31 (the measurement plan).
 *
 * The product emits events with stable names. The destination platform (GA4,
 * Segment, Plausible, PostHog…) is UNDECIDED — open decision O4. Once it is
 * chosen, only `dispatch` gets implemented: not a single component changes.
 *
 * Meanwhile events are queued on `window.dataLayer` (compatible with GTM and
 * with any later consumer) and, in development, logged to the console so the
 * instrumentation can be verified without a platform.
 */

import type { EventName, EventProps } from '~/core/common/domain/entities/AnalyticsEvent'

type QueuedEvent = { event: EventName; props: EventProps }

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

/**
 * The SINGLE way out. Replace the body with the real provider call once open
 * decision O4 is resolved.
 */
function dispatch({ event, props }: QueuedEvent): void {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...props })

  if (process.env.NODE_ENV === 'development') {
    // Lets the Review Gate verify instrumentation without a platform.
    console.debug(`[analytics] ${event}`, props)
  }
}

/** Emits an event from the measurement plan. */
export function track(event: EventName, props: EventProps = {}): void {
  dispatch({ event, props })
}
