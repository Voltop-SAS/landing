import type { Metadata } from 'next'
import { Poppins, Manrope, JetBrains_Mono } from 'next/font/google'
import './globals.css'

import { defaultLocale, localeMeta, t } from '~/core/common/domain/i18n/config'
import { SITE_URL } from '~/core/common/domain/i18n/routes'
import { brand } from '~/core/common/domain/consts/copy'

/**
 * ROOT LAYOUT · emits the document
 *
 * ── WHY IT EXISTS ─────────────────────────────────────────────────────────
 * The document used to be emitted by `src/app/[locale]/layout.tsx`, with no
 * root layout at all. Next allows that pattern, but it breaks the resolution of
 * `not-found` boundaries: ANY `notFound()` thrown inside `[locale]` — a station
 * that does not exist, a city that does not exist, an invalid language — served
 * Next's internal error document (`<html id="__next_error__">`, no `lang`, no
 * styles, no brand) and only recovered on the client after hydration.
 * `src/app/[locale]/not-found.tsx` never rendered at all. A crawler saw an empty
 * page.
 *
 * ── THE TRADE-OFF, STATED ─────────────────────────────────────────────────
 * A root layout receives no `params`, so `<html lang>` here cannot be dynamic
 * and stays fixed at the default language. §28 (confirmed decision nº14) asked
 * for the correct `lang` in the SERVED HTML, and this relaxes that.
 *
 * It is compensated where it matters: `[locale]/layout.tsx` marks the real
 * language on a `<div lang>` that wraps all the content. Screen readers honour
 * the nearest `lang` to the node, so pronunciation is still correct, and for
 * search engines the language is declared by each route's `hreflang` and
 * `alternates`, which were already right.
 *
 * The alternative with no trade-off — two real roots, `(es)/` and `(en)/` —
 * required duplicating the entire route tree and would have killed the
 * "add a language = add one entry" scalability.
 * ──────────────────────────────────────────────────────────────────────────
 *
 * The typefaces load here and not in `[locale]`: the variables have to exist on
 * `<html>` for the pages that live outside the language segment too, such as
 * the root 404.
 *
 * BRAND TYPEFACES (delivered 2026-09-02). There are no placeholders left: Space
 * Grotesk and Inter are out of the project.
 * - Poppins → headlines. The logotype's family.
 * - Manrope → interface and body text. Variable.
 * - JetBrains Mono → technical-spec register (labels, figures, metadata). The
 *   brand does not define it; it is kept because the system uses a third,
 *   monospaced register that neither of the other two covers.
 */

/**
 * POPPINS · headlines.
 *
 * It is the logotype's family, so headlines and brand speak with the same
 * voice. Poppins is NOT variable on Google Fonts: each weight is its own file,
 * which is why ONLY the two the site actually uses are requested, 500 and 600,
 * counted in the code. Without declaring them the browser synthesises the
 * semibold by fattening the stroke, and at an 80px headline that looks dirty.
 *
 * The 900 (`Poppins-Black`, the weight in the brand file) WAS REMOVED: it was
 * loaded "just in case" and no component used it, so it was a font file nobody
 * ever saw. The logotype does not need it — it is an SVG. If more emphatic
 * headlines are ever wanted, it comes back here.
 */
const display = Poppins({
  variable: '--font-display-raw',
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
})
/**
 * MANROPE · interface and body text.
 *
 * It is VARIABLE, so a single file covers the whole weight range: it weighs
 * less than the three separate files a static family would need, and it allows
 * any intermediate weight without requesting anything more.
 *
 * It loads from Google Fonts rather than from the system `.ttf`: `next/font`
 * serves it from our own domain, already subset to Latin and in woff2 — a
 * fraction of the TrueType's weight — and with no request to a third party.
 */
const sans = Manrope({
  variable: '--font-sans-raw',
  subsets: ['latin'],
  display: 'swap',
})
const mono = JetBrains_Mono({ variable: '--font-mono-raw', subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${brand.name} — ${t(brand.tagline, defaultLocale)}`,
  description: t(brand.tagline, defaultLocale),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={localeMeta[defaultLocale].htmlLang}
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-canvas text-ink antialiased">{children}</body>
    </html>
  )
}
