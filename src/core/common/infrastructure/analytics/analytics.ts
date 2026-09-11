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
import { analyticsAllowed } from './consent'

type QueuedEvent = { event: EventName; props: EventProps }

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

/**
 * The SINGLE way out. Replace the body with the real provider call once open
 * decision O4 is resolved.
 *
 * ── NOTHING IS COLLECTED WITHOUT CONSENT, AND NOTHING IS KEPT FOR LATER ───
 * This used to push to `dataLayer` unconditionally. No request left the
 * browser — GTM is not loaded until the visitor accepts — but the events piled
 * up in the array, and GTM reads that array FROM THE BEGINNING when it loads.
 *
 * Measured on 2026-09-08: someone who browsed four pages without deciding and
 * then accepted sent three events describing what they did BEFORE saying yes.
 * The notice says «Tú decides si quieres aceptarlas», and whoever accepts is
 * not expecting the previous five minutes to travel with them.
 *
 * There is deliberately NO BUFFER. An event that happens without consent is
 * dropped, not queued: keeping it to send later is the same collection with a
 * delay. The decision is read on every call, not cached, because someone can
 * accept halfway through the session and from that moment on it counts.
 */
function dispatch({ event, props }: QueuedEvent): void {
  if (typeof window === 'undefined') return
  if (!analyticsAllowed()) return

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
