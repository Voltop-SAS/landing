/**
 * ANALYTICS CONSENT · the single source of truth for «may we measure?»
 *
 * The stored value and the two literals used to live inside `CookieConsent`,
 * which is where the user decides. `analytics.ts` now has to ask the same
 * question before emitting anything, and the alternative was to repeat the key
 * string in a second file — two places to change, one of them silently wrong
 * the first time somebody edits the other.
 *
 * The values are STORED DATA, so they stay in Spanish: `aceptado` and
 * `rechazado` are already written in the browsers of everyone who has visited
 * the site. Renaming them is a migration, not a rename.
 */

export const CONSENT_KEY = 'voltop:cookies'

export type ConsentDecision = 'aceptado' | 'rechazado'

/** The stored decision, or `null` if nobody has decided yet. */
export function readConsent(): ConsentDecision | null {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'aceptado' || v === 'rechazado' ? v : null
  } catch {
    /* Private mode, or storage blocked. With no way to read a decision the
       answer is the safe one: no. */
    return null
  }
}

/** Whether analytics may collect anything at all right now. */
export function analyticsAllowed(): boolean {
  return readConsent() === 'aceptado'
}
