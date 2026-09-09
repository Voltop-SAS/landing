'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { cookies as copy } from '~/core/common/domain/consts/copy'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { TextSlot } from '@ui/common/components/ui/TextSlot'

/**
 * COOKIE NOTICE
 * See docs/MASTER-PROJECT-DEFINITION.md §38.
 *
 * ── CONSENT COMES BEFORE, NOT AFTER ──────────────────────────────────────
 * This component is NOT an informational banner: it is the switch. Google Tag
 * Manager is mounted from HERE and only when a stored "yes" exists. A notice
 * that appears while analytics is already running informs nobody of anything —
 * it reports what just happened without permission.
 *
 * Law 1581 requires **prior, express and informed** authorisation, and "prior"
 * is the word that decides where this `<Script>` goes.
 *
 * ── BOTH WAYS OUT CARRY THE SAME WEIGHT ──────────────────────────────────
 * "Reject" has the same size, the same touch target and the same contrast as
 * "Accept". A reject button in light grey, or hidden behind "configure", turns
 * the choice into a formality, and at that point consent stops being informed.
 *
 * ── IT IS A BAND, NOT A CARD ─────────────────────────────────────────────
 * It spans the full width at the bottom, the shape anyone recognises as a
 * cookie notice without reading it. It used to be a card in the right-hand
 * corner: more discreet, but indistinguishable from the OTHER TWO pieces that
 * live in that same corner — the QR floater and its bar version — and
 * mistaking a legal question for a promotion is the one thing this notice
 * cannot do.
 *
 * The material changes too: `bg-canvas/85 + backdrop-blur-xl` instead of
 * `.glass`, same as the Header. It is not a preference, there are two reasons:
 *
 * · In the system, `.glass` with a radius is the register of panels that
 *   FLOAT; a full-bleed band edge to edge does not float, and the
 *   `.glass::before` ring would draw it a light line hugging the edges of the
 *   screen, which reads as a rendering glitch and not as an outline.
 *
 * · It is MORE opaque than the glass (85% of `canvas` against 68% of
 *   `surface-2`), and here that matters more than visual charm: anything at
 *   all can pass underneath the text, and illegible legal text informs nobody.
 *
 * ── IT IS NOT A MODAL DIALOG ─────────────────────────────────────────────
 * It does not trap focus or block scrolling: the site and the policy can be
 * read before deciding, which is exactly what makes the decision informed. It
 * is an announced `region`, and focus moves into it on appearance so keyboard
 * users do not have to hunt for it.
 *
 * ── WHY THERE IS NO `<noscript>` ─────────────────────────────────────────
 * The container used to carry a fallback iframe for browsers without
 * JavaScript. It was removed: without JavaScript there is also no way to give
 * or withdraw consent, so that iframe would track precisely those who cannot
 * say no.
 */

const STORAGE_KEY = 'voltop:cookies'

/**
 * Google Tag Manager container.
 *
 * Configurable with the production value as the default, for the same reason
 * as `SITE_URL`: a staging deployment firing the production container dirties
 * the real analytics with test traffic, and that cannot be undone once sent.
 *
 * It is not a secret — a container ID travels in the HTML of any site that
 * uses it — so it is versioned. See `.env.example`.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-WJ5S2LBF'
type Decision = 'aceptado' | 'rechazado' | null

export function CookieConsent({ locale }: { locale: Locale }) {
  const [decision, setDecision] = useState<Decision>(null)
  /* `null` until storage has been read. Without this third state the notice
     would flash on every load for anyone who already decided. */
  const [read, setRead] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const v = localStorage.getItem(STORAGE_KEY)
        if (v === 'aceptado' || v === 'rechazado') setDecision(v)
      } catch {
        /* With no storage the decision is not remembered, but nothing is
           loaded either: the default state is "no". */
      }
      setRead(true)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const decide = (v: Exclude<Decision, null>) => {
    setDecision(v)
    try {
      localStorage.setItem(STORAGE_KEY, v)
    } catch {
      /* same as above */
    }
  }

  const visible = read && decision === null

  /**
   * FOCUS LANDS ON THE REGION, NOT ON A BUTTON.
   *
   * "Aceptar" had `autoFocus`, and on a clean load — with nobody touching the
   * keyboard — Chrome gave it `:focus-visible`: measured, a 2px brand ring on
   * "Aceptar" and nothing on "Rechazar".
   *
   * Two things broke with that. This file's header requires both exits to carry
   * the same weight, and a ring on one of them is a visual difference none of
   * the other equalities makes up for. And worse: it reads as PRESELECTED —
   * pressing Enter accepted — which is a nudge towards yes in the one place on
   * the site where the decision has to be free.
   *
   * Focusing the container keeps what `autoFocus` solved: a keyboard user lands
   * inside the notice and their next Tab is "Aceptar", without having to hunt
   * for it. `tabIndex={-1}` makes it focusable from code without adding it to
   * the tab order.
   */
  const region = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (visible) region.current?.focus()
  }, [visible])

  return (
    <>
      {decision === 'aceptado' && (
        <Script
          id="gtm"
          strategy="afterInteractive"
        >
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}

      {visible && (
        <div
          ref={region}
          tabIndex={-1}
          role="region"
          aria-label={t(copy.title, locale)}
          /* `z-(--z-overlay)`: above the app floater, which also lives at the
             bottom. The decision comes first. */
          /* Silences the focus ring of THIS container. The full reason lives in
             `globals.css`, next to the rule: a Tailwind utility does not work
             here because the global rule lives outside `@layer`. */
          data-focus-silent=""
          className="fixed inset-x-0 bottom-0 z-(--z-overlay) border-t border-line bg-canvas/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
        >
          {/* Same rail as the Header: `content` container and the system
              gutter. A full-bleed band whose text does not start where the
              site's text starts gives itself away as a bolted-on piece. */}
          <div className="mx-auto flex w-full max-w-(--container-content) flex-col gap-4 px-(--spacing-gutter) py-4 md:flex-row md:items-center md:justify-between md:gap-10 md:py-5">
            <div className="min-w-0">
              {/* `text-body` rather than `display-s`: in a single-row band, a
                  display-sized headline fattens it up and shouts louder than
                  the question it is asking. The weight comes from the bold. */}
              <p className="font-display text-body font-semibold text-ink">
                {t(copy.title, locale)}
              </p>
              {/* The policy link lives INSIDE the sentence. See the note on
                  `cookies.body` for why, and `TextSlot` for how — including
                  what happens if a locale ever loses the placeholder. */}
              <p className="measure mt-1 text-body-s text-ink-2">
                <TextSlot
                  text={t(copy.body, locale)}
                  name="policy"
                >
                  <Link
                    href={href(locale, routes.privacy)}
                    /* Underline ALWAYS visible, not only on hover: inside a
                       paragraph, colour alone does not mark a link — someone who
                       cannot tell the green apart will not find it — and this is
                       the link that makes the consent informed. The focus ring
                       comes from the global rule in `globals.css`. */
                    className="text-ink underline decoration-line-strong decoration-1 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                  >
                    {t(copy.policy, locale)}
                  </Link>
                </TextSlot>
              </p>
            </div>

            <div className="flex flex-col gap-3 md:shrink-0 md:flex-row md:items-center md:gap-4">
              {/* Same size, same area, same contrast. See the file header.
                  On mobile they take EXACT halves, and that is why it is a
                  grid and not a `flex-1`: with `flex-1` each button grows from
                  its own content width and "Reject" ended up 2px larger than
                  "Accept" — measured: 165 against 163. Two `1fr` columns are
                  equal by construction, not by approximation, and here the
                  equality of the two ways out is a requirement, not a pretty
                  symmetry. */}
              <div className="grid grid-cols-2 gap-3 md:flex md:items-center">
                <button
                  type="button"
                  onClick={() => decide('aceptado')}
                  className="brand-gradient press inline-flex h-11 items-center justify-center rounded-(--radius-pill) px-5 text-body-s font-semibold text-on-brand transition-[filter] duration-(--duration-fast) hover:brightness-105"
                >
                  {t(copy.accept, locale)}
                </button>
                <button
                  type="button"
                  onClick={() => decide('rechazado')}
                  className="press inline-flex h-11 flex-1 items-center justify-center rounded-(--radius-pill) border border-line-control px-5 text-body-s font-semibold text-ink transition-colors duration-(--duration-fast) hover:border-line-strong hover:bg-surface-2"
                >
                  {t(copy.reject, locale)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
