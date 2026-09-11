'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { cn } from '@ui/common/lib/cn'

export type AccordionItem = {
  id: string
  question: string
  answer: string
  links?: { label: string; href: string; external?: boolean }[]
}

/**
 * ACCORDION · `disclosure` pattern, not `tabs`.
 *
 * §23 demands "complete ARIA or none". The disclosure pattern is a button with
 * `aria-expanded` controlling a region — nothing more. It carries no
 * `role="tab"`, no arrow-key navigation and no `aria-multiselectable`: that is
 * the TABS pattern, and building it halfway degrades things more than adding
 * no ARIA at all. A native `<button>` already brings focus, Enter and Space
 * without a single line of keyboard code.
 *
 * ── Several open at once ──────────────────────────────────────────────────
 * Deliberate. In a FAQ, closing the previous one when opening the next moves
 * the text the person is reading. Comparing two answers is a real case (power
 * and compatibility are read together); an exclusive accordion prevents it in
 * exchange for nothing.
 *
 * ── Why the panel does not use `hidden` ───────────────────────────────────
 * The height is animated with `grid-rows: 0fr → 1fr`, which is the only way to
 * transition to automatic height without measuring in JS. That forces the
 * content to stay in the DOM, so when closed it is marked `inert`: it leaves
 * the accessibility tree AND the tab order. Without it, a screen reader would
 * read the five answers one after another and Tab would land on invisible
 * links.
 */
/** A single place for the outgoing link: internal and external differ only in
    the arrow and in the new-tab warning. */
/* `min-h-11`: without it these links measured 16.8px tall, below WCAG 2.5.8's
   24px, and they are not inline links inside a sentence, so the exception does
   not cover them. `Footer` and `PostsInline` were already doing this. */
const link =
  'group inline-flex min-h-11 items-center gap-2 font-mono text-mono text-brand transition-colors hover:text-ink'

const arrow = 'transition-transform duration-(--duration-fast) ease-(--ease-overshoot)'

export function Accordion({
  items,
  className,
  /** "Opens in a new tab" text. It arrives as a prop: this component is
      generic UI and §24 forbids it from holding literal copy. */
  newTabLabel,
}: {
  items: AccordionItem[]
  className?: string
  newTabLabel: string
}) {
  const uid = useId()
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })

  return (
    <ul className={cn('border-t border-line', className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id)
        const buttonId = `${uid}-${item.id}-button`
        const panelId = `${uid}-${item.id}-panel`

        return (
          <li
            key={item.id}
            className="border-b border-line"
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                /**
                 * A STABLE HOOK FOR GTM, and the dimension along with it.
                 *
                 * `faq_open` is one of the three events GTM reads from the
                 * click instead of receiving from `track()`, and the Tagging
                 * Plan forbids triggers built on visible text or CSS classes —
                 * both break the day somebody rewrites a question or renames a
                 * utility.
                 *
                 * The only other identifiers here were `id`, which comes from
                 * React's `useId()` and changes between builds, and
                 * `aria-expanded`, which says the state but not WHICH question.
                 * This carries the question's own id, so the same attribute is
                 * the trigger and the dimension.
                 *
                 * `aria-expanded` still answers open-or-close: GTM reads the
                 * DOM at click time, when it still holds the previous value.
                 */
                data-faq={item.id}
                onClick={() => toggle(item.id)}
                className="press group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-(--duration-fast) hover:text-brand"
              >
                <span className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                  {item.question}
                </span>
                {/* A cross that becomes a dash: the vertical bar rotates 90°.
                    Only `transform`, which is what §29 allows animating. */}
                <span
                  aria-hidden="true"
                  className="relative mt-1.5 grid size-6 shrink-0 place-items-center text-ink-3 transition-colors group-hover:text-brand"
                >
                  <span className="absolute h-px w-4 bg-current" />
                  <span
                    className={cn(
                      'absolute h-px w-4 bg-current transition-transform duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none',
                      isOpen ? 'rotate-0' : 'rotate-90',
                    )}
                  />
                </span>
              </button>
            </h3>

            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!isOpen}
                  /* The right margin only exists to clear the +/− column, and
                     that column only competes with the text on screens where
                     they fit on the same line. On mobile the answer goes below
                     the button: there the padding cleared nothing and stole
                     40px from a line measure that was already tight. */
                  className="pb-7 md:pr-10"
                >
                  <p className="measure-narrow text-body text-ink-2">{item.answer}</p>
                  {item.links?.length ? (
                    <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                      {item.links.map((l) =>
                        l.external ? (
                          /* External: new tab announced (WCAG 3.2.5) and the
                             SAME arrow as the internal link, moved diagonally
                             on hover. It is what `Button` does, so "this takes
                             you off the site" is said one single way across
                             the whole site.

                             The ↗ glyph was tried first and did not work: in
                             this mono it comes out smaller and thinner than
                             the →, mismatched right next to it. */
                          <li key={l.href}>
                            <a
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={link}
                            >
                              {l.label}
                              <span className="sr-only"> · {newTabLabel}</span>
                              <span
                                aria-hidden="true"
                                className={
                                  arrow + ' group-hover:-translate-y-1 group-hover:translate-x-1'
                                }
                              >
                                →
                              </span>
                            </a>
                          </li>
                        ) : (
                          <li key={l.href}>
                            <Link
                              href={l.href}
                              className={link}
                            >
                              {l.label}
                              <span
                                aria-hidden="true"
                                className={arrow + ' group-hover:translate-x-1'}
                              >
                                →
                              </span>
                            </Link>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
