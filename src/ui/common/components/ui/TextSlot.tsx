import type { ReactNode } from 'react'

/**
 * A sentence with a `{name}` placeholder that becomes an ELEMENT, not text.
 *
 * The string counterpart is `fill()` in `~/core/common/domain/i18n/config`;
 * both read the same brace syntax, so a translator sees one convention and not
 * two. Use `fill` when what goes in the gap is a value, and this when it is a
 * link.
 *
 * ── WHY THE LINK GOES INSIDE THE SENTENCE ─────────────────────────────────
 * Both current uses are legal texts — the cookie notice and the lead form's
 * authorisation — and in both, Ley 1581 asks for INFORMED consent. The
 * document being accepted has to be named, under its full name, inside the
 * sentence that accepts it. Hung outside as a separate "Ver política" control,
 * it reads as a third action competing with Accept and Reject.
 *
 * ── THE FALLBACK IS THE POINT ─────────────────────────────────────────────
 * If a locale ever loses the placeholder, the sentence renders WHOLE and
 * without a link, rather than truncated at the missing token. An authorisation
 * that cannot be read is the one failure that is not acceptable here — worse
 * than one that is read without its link.
 */
export function TextSlot({
  text,
  name,
  children,
}: {
  /** The sentence, already resolved to the active language. */
  text: string
  /** The placeholder to replace, without braces. */
  name: string
  children: ReactNode
}) {
  const [before, after] = text.split(`{${name}}`)
  if (after === undefined) return <>{text}</>
  return (
    <>
      {before}
      {children}
      {after}
    </>
  )
}
