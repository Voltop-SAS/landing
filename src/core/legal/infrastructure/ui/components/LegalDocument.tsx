import { t, defaultLocale, type Locale } from '~/core/common/domain/i18n/config'
import { legalDoc } from '~/core/legal/domain/consts/copy'
import type { LegalDoc } from '~/core/legal/domain/entities/LegalDoc'
import { formatDate } from '@ui/common/lib/dates'
import { Section, Container } from '@ui/common/components/ui/LayoutPrimitives'

/**
 * LEGAL DOCUMENT
 * See docs/MASTER-PROJECT-DEFINITION.md §38.
 *
 * A single component for both the terms and the policy: the difference
 * between the two is content, not form, and keeping two near-identical
 * templates guarantees they diverge one day.
 *
 * ── THE TABLE OF CONTENTS IS NOT DECORATION ──────────────────────────────
 * The terms have 38 sections. Without a table of contents, finding
 * "cancelación" means scrolling the whole document with the mouse wheel; §16
 * says no control is decorative, and the corollary is that a document like
 * this DOES need one. On wide screens it stays pinned on the left while you
 * read; on narrow ones it goes on top, folded inside a native `<details>`
 * —no JavaScript, no half-finished ARIA— so it does not push the text half a
 * screen down.
 *
 * ── MEASURE WINS OVER WIDTH ──────────────────────────────────────────────
 * The body is constrained by line measure, not by the container's width. It
 * uses `measure` (~62 characters) and not `measure-narrow` (~48): in a
 * 38-section document the narrow column multiplies the height and forces an
 * endless scroll. 62 is still within §22's range and is the comfortable
 * choice for a read that lasts minutes.
 */
export function LegalDocument({
  doc,
  titulo,
  locale,
}: {
  doc: LegalDoc
  titulo: string
  locale: Locale
}) {
  /* The notice only applies where the document is NOT in the page's language. */
  const languageNotice = locale === defaultLocale ? null : t(legalDoc.spanishOnly, locale)

  const indice = (
    <ol className="space-y-0">
      {doc.secciones.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex gap-3 border-t border-line py-2.5 text-body-s text-ink-2 transition-colors hover:text-brand"
          >
            <span
              aria-hidden="true"
              className="shrink-0 font-mono text-mono text-ink-3"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            {/* The heading already carries its number ("1. Quiénes somos");
                it is stripped so it does not read "01 1. Quiénes somos". */}
            <span>{s.heading.replace(/^\d+\.\s*/, '')}</span>
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <Section
      space="none"
      className="pb-(--spacing-section) pt-32 md:pt-40"
    >
      {/* `content` and not `wide`: the body is constrained by line measure,
          so in a wide container the text does not grow — all that appears is a
          third of a screen of emptiness to the right of the contents. */}
      <Container>
        <header className="border-b border-line pb-10">
          <p className="font-mono text-mono uppercase tracking-[0.14em] text-ink-3">
            {t(legalDoc.eyebrow, locale)}
          </p>
          <h1 className="mt-5 max-w-[18ch] font-display text-display-xl font-semibold text-balance text-ink">
            {titulo}
          </h1>
          {/* The date is FORMATTED per language, like the rest of the site.
              It used to render the document's literal string and read "Last
              updated: 29 de mayo de 2026" in English. The legal text stays in
              Spanish on purpose; its metadata does not. */}
          <p className="mt-6 font-mono text-mono text-ink-3">
            {t(legalDoc.updatedLabel, locale)}:{' '}
            <time dateTime={doc.actualizadoISO}>{formatDate(doc.actualizadoISO, locale)}</time>
          </p>

          {languageNotice ? (
            /* `lang` on the notice and `lang="es"` on the body: without that
               a screen reader would read the whole document with the wrong
               language's phonetics (§23). */
            <p
              lang={locale}
              className="measure mt-6 border-l-2 border-warn/50 py-1 pl-5 text-body-s text-ink-2"
            >
              {languageNotice}
            </p>
          ) : null}
        </header>

        <div className="lg:flex lg:items-start lg:gap-16">
          {/* Table of contents — folded on narrow screens */}
          <details className="group mt-8 border-b border-line pb-6 lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-display text-display-s font-semibold text-ink">
              {t(legalDoc.tocTitle, locale)}
              <span
                aria-hidden="true"
                className="relative grid size-6 place-items-center text-ink-3"
              >
                <span className="absolute h-px w-4 bg-current" />
                <span className="absolute h-px w-4 rotate-90 bg-current transition-transform duration-(--duration-base) group-open:rotate-0 motion-reduce:transition-none" />
              </span>
            </summary>
            <nav
              className="mt-5"
              aria-label={t(legalDoc.tocTitle, locale)}
            >
              {indice}
            </nav>
          </details>

          {/* Table of contents — pinned on wide screens */}
          <nav
            aria-label={t(legalDoc.tocTitle, locale)}
            className="hidden lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-9rem)] lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:pt-12"
          >
            <p className="font-mono text-mono uppercase tracking-[0.14em] text-ink-3">
              {t(legalDoc.tocTitle, locale)}
            </p>
            <div className="mt-4">{indice}</div>
          </nav>

          <div
            lang={defaultLocale}
            className="min-w-0 flex-1 pt-10 lg:pt-12"
          >
            {doc.secciones.map((s) => (
              <section
                key={s.id}
                id={s.id}
                /* `scroll-mt`: without this the fixed header covers the very
                   heading you just jumped to from the contents. */
                className="scroll-mt-28 border-t border-line py-9 first:border-t-0 first:pt-0"
              >
                <h2 className="font-display text-display-m font-semibold text-ink">{s.heading}</h2>
                <div className="mt-5 space-y-4">
                  {s.body.map((b, i) =>
                    b.tipo === 'parrafo' ? (
                      <p
                        key={i}
                        className="measure text-body text-ink-2"
                      >
                        {b.texto}
                      </p>
                    ) : (
                      <ul
                        key={i}
                        className="measure space-y-2.5"
                      >
                        {b.items.map((item, j) => (
                          <li
                            key={j}
                            className="flex gap-3 text-body text-ink-2"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-3"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
