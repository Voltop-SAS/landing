/**
 * "I clicked this preview because I want to watch it."
 *
 * ── WHY THIS CAN WORK AT ALL ──────────────────────────────────────────────
 * Browsers refuse to start a video with sound unless the document has been
 * activated by a real user gesture, and that activation is NOT carried across a
 * page load. Normally, then, arriving somewhere and playing audio is impossible.
 *
 * `next/link` is the exception, and not by a trick: an internal navigation in
 * the App Router is a CLIENT transition. The document never unloads. The click
 * on the preview and the video on the destination page live in the same
 * document, so the activation that the click granted is still there when the
 * entry mounts.
 *
 * ── WHY A MODULE VARIABLE AND NOT `sessionStorage` ────────────────────────
 * Because its lifetime has to be exactly the lifetime of that activation, and a
 * module variable already is: it survives client navigation and dies on reload,
 * which is precisely when the activation dies too. Stored in `sessionStorage`
 * the intent would outlive the click — you would close the tab, come back, and
 * a video would start talking to you on its own.
 *
 * It is keyed by `src`, not by route: the intent belongs to the PIECE. It is
 * consumed on read, so it fires once and never twice.
 */

let pendiente: string | null = null

/** Called by the preview when someone clicks it. */
export function requestPlayOnArrival(src: string) {
  pendiente = src
}

/** Called by the destination. Returns true ONCE, and only for the same piece. */
export function consumePlayOnArrival(src: string) {
  if (pendiente !== src) return false
  pendiente = null
  return true
}
