'use client'

import { track, type EventName, type EventProps } from '~/core/common/infrastructure/analytics'

/**
 * Emits an event when whatever it wraps is clicked.
 *
 * It exists for the same reason as `TrackView`: the measurement plan (§31)
 * declares events that can only fire on the client, but almost every page is a
 * Server Component and so is `Button` — passing it an `onClick` from the
 * server is not possible.
 *
 * Wrapping instead of converting keeps `Button` on the server: the client
 * island is this `<span>`, not the button and not the page. The click on the
 * link inside bubbles up to here, so there is no need to touch the wrapped
 * component or duplicate its markup.
 *
 * `display: contents` — the wrapper does NOT exist as far as layout is
 * concerned. Without it, putting a `<span>` around a button would break any
 * `flex` or `grid` on the parent, which is an absurd price to pay for a
 * metric.
 */
export function TrackClick({
  event,
  props,
  children,
}: {
  event: EventName
  props?: EventProps
  children: React.ReactNode
}) {
  return (
    <span
      className="contents"
      onClick={() => track(event, props)}
    >
      {children}
    </span>
  )
}
