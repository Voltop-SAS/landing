'use client'

import { useEffect, useRef } from 'react'

/**
 * WRITES THE ADDRESS BAR ONCE THE PERSON STOPS, NOT ON EVERY CHANGE.
 *
 * `history.replaceState` is what GA4's enhanced measurement watches to count a
 * `page_view` on a single-page navigation, so a component that rewrites the URL
 * on every click hands Analytics one visit per click. This hook collapses a
 * burst of writes into the last one: each call restarts the timer, and only
 * the value that is still standing when it runs out is written.
 *
 * The caller keeps updating its own state immediately. Only the URL waits.
 *
 * A write still pending when the component unmounts is cancelled, so it cannot
 * land on another page after the visitor has navigated away.
 */
export function useSettledUrl(settleMs: number) {
  const timer = useRef<number | null>(null)

  const cancel = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  useEffect(() => cancel, [])

  return (url: string) => {
    cancel()
    timer.current = window.setTimeout(() => {
      timer.current = null
      window.history.replaceState(null, '', url)
    }, settleMs)
  }
}
