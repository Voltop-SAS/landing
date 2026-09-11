'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  locales,
  publishedLocales,
  localeStatus,
  localeMeta,
  t,
  type Locale,
} from '~/core/common/domain/i18n/config'
import { switchLocalePath } from '~/core/common/domain/i18n/routes'
import { a11y } from '~/core/common/domain/consts/copy'
import { track } from '~/core/common/infrastructure/analytics'
import { cn } from '@ui/common/lib/cn'

/**
 * LANGUAGE SWITCH
 * See docs/MASTER-PROJECT-DEFINITION.md §28.
 *
 * ── WHY IT STOPPED BEING A SEGMENTED CONTROL ──────────────────────────────
 * It was a row of `ES | EN` buttons: readable with two languages, untenable
 * with three. Each option needs a minimum of 44px in height and width (§23),
 * so the control grew ~44px per language — from 88px to 132px — in the most
 * contested area of the header, which had already pushed the switch out of the
 * mobile header for lack of room. A pattern that widens with every language is
 * not scalable: it is a countdown.
 *
 * The dropdown takes up the same room with two languages as with six.
 *
 * ── WHAT DOES NOT CHANGE ──────────────────────────────────────────────────
 * They are still LINKS, not state buttons. The language lives in the URL, so
 * changing language is navigating: that is what makes the language survive
 * navigation and every version indexable. A `<select>` driven by JavaScript
 * would have broken both.
 *
 * Each language is named IN ITS OWN LANGUAGE (Español · English · Português).
 * Translating "Português" into "Portuguese" shows it in a language that
 * someone looking for Portuguese may not read, which is exactly who the
 * control serves.
 *
 * ── ACCESSIBILITY PATTERN ─────────────────────────────────────────────────
 * Disclosure, not `role="menu"`. The panel holds navigation links and natural
 * Tab already walks them in order; declaring a menu would force arrow-key
 * navigation that adds nothing here and usually ends up half-implemented.
 * Escape closes and returns focus, pressing outside closes, and navigating
 * closes (§23).
 */
export function LangSwitch({
  locale,
  placement = 'down',
}: {
  locale: Locale
  /**
   * In the mobile menu the switch lives at the bottom of the panel: opening
   * downwards would put it off screen.
   */
  placement?: 'down' | 'up'
}) {
  const pathname = usePathname()

  /**
   * It opens "for a route": navigating changes `pathname` and the panel closes
   * by derivation. Same pattern as the header's mobile menu — no cleanup
   * effect and no cascading renders.
   */
  const [openedFor, setOpenedFor] = useState<string | null>(null)
  const open = openedFor === pathname

  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  /**
   * In production only PUBLISHED languages are offered: a draft one is half
   * done, and offering it would be worse than not having it.
   *
   * In development all of them are listed, flagged, because with no way to
   * reach a draft language from the interface you would have to type the URL
   * by hand to review it — and whatever is costly to review does not get
   * reviewed.
   */
  const options = process.env.NODE_ENV === 'development' ? locales : publishedLocales

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpenedFor(null)
      buttonRef.current?.focus()
    }

    /* `pointerdown` rather than `click`: it closes as the gesture starts,
       without waiting for release, and does not swallow the click the user was
       aiming at another control. */
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpenedFor(null)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className="relative"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${t(a11y.languageSelector, locale)}: ${localeMeta[locale].name}`}
        aria-expanded={open}
        aria-controls="language-switch"
        onClick={() => setOpenedFor(open ? null : pathname)}
        className={cn(
          'press inline-flex min-h-11 items-center gap-1.5 rounded-(--radius-pill) border border-line-control px-3.5',
          'font-mono text-mono uppercase transition-colors',
          open ? 'text-ink' : 'text-ink-2 hover:text-ink',
        )}
      >
        {localeMeta[locale].label}
        <svg
          aria-hidden="true"
          viewBox="0 0 10 6"
          className={cn(
            'h-1.5 w-2.5 transition-transform duration-(--duration-fast)',
            open && 'rotate-180',
          )}
        >
          <path
            d="M1 1l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          id="language-switch"
          /* `bg-canvas` deliberately OPAQUE: the header is translucent with
             `backdrop-blur`, and a translucent panel over a translucent
             background leaves the text illegible against the page content. */
          className={cn(
            'absolute right-0 z-10 min-w-44 overflow-hidden rounded-(--radius-structural)',
            'border border-line-control bg-canvas py-1',
            placement === 'up' ? 'bottom-full mb-2' : 'top-full mt-2',
          )}
        >
          {options.map((code) => {
            const active = code === locale
            return (
              <li key={code}>
                <Link
                  href={switchLocalePath(pathname, code)}
                  hrefLang={localeMeta[code].hreflang}
                  aria-current={active ? 'true' : undefined}
                  /* With three languages, this is the only data that will say
                     whether Portuguese gets used. Without it, the decision to
                     keep it would be made blind. */
                  onClick={() => {
                    if (!active) track('language_switch', { from: locale, to: code })
                  }}
                  className={cn(
                    'flex min-h-11 items-center justify-between gap-4 px-4 text-body-s transition-colors',
                    active ? 'text-ink' : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
                  )}
                >
                  {/* The language name is NOT translated: it is a proper noun. */}
                  <span lang={localeMeta[code].htmlLang}>
                    {localeMeta[code].name}
                    {/* Only visible in development, where `options` includes
                        drafts. With no label, an incomplete language would look
                        finished and its gaps would look like typos. */}
                    {localeStatus[code] === 'borrador' && (
                      <span className="ml-2 font-mono text-mono uppercase text-warn">borrador</span>
                    )}
                  </span>
                  {/* Width always reserved: without this, the active tick
                      would shift the text of the other rows. */}
                  <span
                    aria-hidden="true"
                    className="w-3 shrink-0 text-brand"
                  >
                    {active && (
                      <svg
                        viewBox="0 0 12 12"
                        className="h-3 w-3"
                      >
                        <path
                          d="M1.5 6.5l3 3 6-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
