import { localeMeta, type Locale } from '~/core/common/domain/i18n/config'

/**
 * DATE FORMATTING
 *
 * `timeZone: "UTC"` is NOT optional. A log date is `"2026-06-18"`, which
 * `new Date()` reads as midnight UTC; formatted in the server's local time
 * zone — or the browser's — it shows as the 17th in any zone west of
 * Greenwich, Colombia included. The log entry would change date depending on
 * where it is rendered.
 *
 * Formatting goes through `Intl`, so every language gets its own convention
 * without a hand-written month table.
 */
export function formatDate(iso: string, locale: Locale): string {
  const parts = new Intl.DateTimeFormat(localeMeta[locale].htmlLang, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(new Date(iso))

  /**
   * Connectors are dropped ("de" in Spanish and Portuguese), punctuation is not.
   *
   * The log prints the date in mono and uppercase, where the full form reads
   * "18 DE JUN DE 2026": three words of noise around the data. The shortened
   * form without connectors — "18 JUN 2026" — is also the usual one in written
   * Spanish. English has no connector to drop and the comma stays, because
   * there it is punctuation and not filler.
   *
   * They are discarded by CATEGORY (alphabetic `literal`), not by a word list:
   * a list would have to grow with every new language.
   */
  return parts
    .map((part) => (part.type === 'literal' && /\p{L}/u.test(part.value) ? ' ' : part.value))
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Year of an ISO date, for the log separators. */
export function yearOf(iso: string): string {
  return iso.slice(0, 4)
}
