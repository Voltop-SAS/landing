'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { home } from '~/core/home/domain/consts/copy'
import { a11y } from '~/core/common/domain/consts/copy'
import { externalLinks } from '~/core/common/domain/consts/links'
import { stripLocale, routes } from '~/core/common/domain/i18n/routes'
import { track } from '~/core/common/infrastructure/analytics'
import { cn } from '@ui/common/lib/cn'

/**
 * FLOATING COMPONENT · app download
 * See docs/MASTER-PROJECT-DEFINITION.md §12 (subtract before adding) and §23.
 *
 * A fixed element competes with ALL the content for the whole journey, so
 * looking good is not enough: it has to justify every second it occupies the
 * screen. The rules are constraints, not decoration:
 *
 * 1. IT APPEARS ONCE THE FIRST SECTION IS PAST, AND IT STAYS. The page's first
 *    section is observed: while it is in view the floating element does not
 *    exist — there is already a large CTA there; as soon as it leaves, the
 *    element appears and does NOT hide again until you come back to it.
 *
 *    The threshold used to be "90% of the viewport height", which is an
 *    approximation of the first section and not the first section: on a page
 *    whose header is shorter than the screen it appeared late, and on one that
 *    is taller, early. Observing the real element works the same across the
 *    site's six templates without a per-page number.
 *
 *    And it used to DISAPPEAR in three zones of the journey
 *    (`#infraestructura`, `#vision`, the download section). That was removed
 *    as a product decision: an element that leaves and comes back three times
 *    as you scroll down is perceived as a bug, not as tact. The two REAL
 *    collisions those zones were covering up were fixed where they belonged
 *    — see rules 2 and 3 — instead of by hiding the component.
 *
 * 2. IT DOES NOT STEAL A PLAYER'S CONTROLS. The desktop card overlapped the
 *    playback bar of the beat 7 film, and a click on mute or fullscreen OPENED
 *    THE APP STORE. A floating element that hijacks someone else's control is
 *    not intrusive: it is a bug.
 *
 *    The film left the Home page on 2026-09-04, so there is no collision today
 *    — and the mechanism that solved it, `FilmStage`, went with it. This stays
 *    written down because the bug will come back the day a video with controls
 *    is placed in any beat: what fixed it was raising the player above this
 *    card while the pointer is over it or while it is playing, not hiding the
 *    floating element.
 *
 * 3. IT DOES NOT COVER THE BEAT 2 CTA. That beat anchors its content to the
 *    bottom of a panel PINNED to the full screen, so the mobile bar landed on
 *    top of it and there was no scroll position that would free it. The beat
 *    itself solves this by reserving the bar's space below `lg`.
 *
 * 4. IT CANNOT BE DISMISSED, and that has to be stated along with its price.
 *    Product decision of 2026-09-04: the app download is the primary B2C
 *    conversion and the component already stays quiet where it gets in the way
 *    — the first section, /empresas, the legal pages — so the way out is the
 *    journey itself rather than a button.
 *
 *    The price: anyone who does not want the app has it in front of them for
 *    the whole journey, and on mobile that is 126px of screen they do not get
 *    back. What makes it acceptable is that the space is RESERVED where it
 *    matters — the footer and the beat 2 CTA reserve it — and that the bar
 *    never covers anything permanently. If dismissal is ever brought back, it
 *    used to live as a 44px X in the top row of each piece.
 *
 * 5. IT WAITS FOR THE COOKIE DECISION. Both are fixed elements at the bottom,
 *    so they would cover each other. And the order is not negotiable: first
 *    you answer a legal question, then you are offered a download.
 *
 * 6. IT STAYS QUIET ON /empresas AND ON THE LEGAL PAGES. In B2B the conversion
 *    is the form and §15 forbids CTAs competing with each other; in a legal
 *    text, covering content during a long read gets in the way.
 *
 * ── TWO PIECES, NOT ONE SHRUNK DOWN ──────────────────────────────────────
 * On desktop it shows a QR code: store badges are useless there because they
 * lead to a listing that cannot be installed on the device in front of you,
 * and the code bridges that gap.
 *
 * On mobile the QR is absurd — a phone does not scan itself — so the piece is
 * a DIFFERENT one: a low, compact bar with the direct action.
 *
 * ── THE APP ICON ─────────────────────────────────────────────────────────
 * It is built into both pieces because it answers a question the text cannot:
 * *which* app. Someone seeing a floating QR does not know what they are about
 * to install until they scan it; with the icon they recognise it before taking
 * out their phone.
 *
 * It sits in the top row, filling the side the close button used to leave
 * empty: it adds no row and pushes nothing. And it does NOT compete with the
 * CTA because it is not interactive — it is identity, not action — and because
 * the gradient it carries is the brand file's own, not a second gradient added
 * to the view (§12: one gradient action per view, and here that is still the
 * button).
 *
 * On mobile it goes to the left of the text, which is the order it is read in:
 * what it is → what it does → what I do. The icon sits outside the button's
 * touch target so nobody taps it trying to open the app.
 *
 * ── GLASS MORE OPAQUE THAN THE SYSTEM'S ──────────────────────────────────
 * It uses `.glass-strong` rather than `.glass`. Measured on the composited
 * pixel at the 99th percentile, the secondary text contrast already cleared AA
 * comfortably — 7.79:1 on desktop, 8.45:1 on mobile — so the problem was not
 * contrast: it was that the TEXT BEHIND was still legible through the panel,
 * and two legible texts in the same place compete even when both have
 * contrast. See the `.glass-strong` note in globals.css.
 *
 * ── ACCESSIBILITY ────────────────────────────────────────────────────────
 * It does not trap focus or block scrolling: it is NOT a modal dialog, it is
 * complementary content. It does respond to Escape, and while hidden it is
 * `inert` so no links stay reachable with Tab inside an invisible card. Only
 * `opacity` and `transform` are animated (§29).
 */

/** The same key `CookieConsent` uses. See rule 5. */
const COOKIES_KEY = 'voltop:cookies'

export function AppFloating({ locale }: { locale: Locale }) {
  const c = home.appFloating
  /* `true` to begin with: on load, the first section is in view. */
  const [firstInView, setFirstInView] = useState(true)
  /* `false` to begin with: until it is known, the floating element stays away. */
  const [cookiesDecided, setCookiesDecided] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const path = stripLocale(usePathname()) || '/'

  /* Rule 1 — the FIRST SECTION is observed, not a fraction of the viewport.
     It is re-observed on route changes: the component lives in the layout and
     client navigation does not remount it, so without the dependency it would
     keep watching the previous page's section, already unmounted. */
  useEffect(() => {
    const first = document.querySelector('main section')
    if (!first) {
      /* With no reference section there is nothing to wait for: it shows.
         Deferred by one frame because a synchronous `setState` inside an effect
         chains renders and React flags it. There is no hurry here: this is the
         branch that does not happen in any of the site's templates. */
      const id = requestAnimationFrame(() => setFirstInView(false))
      return () => cancelAnimationFrame(id)
    }
    const io = new IntersectionObserver(([entry]) => setFirstInView(entry.isIntersecting), {
      threshold: 0,
    })
    io.observe(first)
    return () => io.disconnect()
  }, [path])

  /* Rule 5 — it is read on mount and read again, because the decision can be
     made with this very page open and `localStorage` emits no events within
     the tab itself. */
  useEffect(() => {
    const read = () => {
      try {
        setCookiesDecided(localStorage.getItem(COOKIES_KEY) !== null)
      } catch {
        /* With no storage there is no notice to wait for. */
        setCookiesDecided(true)
      }
    }
    const id = requestAnimationFrame(read)
    const interval = window.setInterval(read, 1000)
    return () => {
      cancelAnimationFrame(id)
      window.clearInterval(interval)
    }
  }, [])

  const pathAllows = !path.startsWith(routes.empresas) && !path.startsWith('/legal')
  const show = !firstInView && pathAllows && cookiesDecided

  const transition =
    'transition-[opacity,transform] duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none'

  /**
   * App icon. `aria-hidden` and empty `alt`: it adds no information the title
   * does not already give — "Download the Voltop app" — and announcing it
   * twice only lengthens a screen reader's journey.
   *
   * `rounded-[22.37%]` is the squircle ratio of the file itself, not a system
   * radius: the PNG already comes with its corners rounded and transparent,
   * and the glass border is clipped to follow them without bending them.
   */
  const icon = (size: string) => (
    <span
      aria-hidden="true"
      className={cn(
        'relative shrink-0 overflow-hidden rounded-[22.37%] ring-1 ring-white/10',
        size,
      )}
    >
      <Image
        src="/logo-app.png"
        alt=""
        fill
        sizes="56px"
        className="object-cover"
      />
    </span>
  )

  return (
    <div
      ref={ref}
      aria-hidden={!show}
      inert={!show}
    >
      {/* DESKTOP — card with QR code */}
      <div
        className={cn(
          'glass glass-strong fixed bottom-6 right-6 z-(--z-header) hidden w-[17.5rem] rounded-(--radius-structural) p-5 lg:block',
          transition,
          show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        {/* CENTRED, not left-aligned.
            With the close button gone, the top row was left with the icon
            alone in one corner and the QR centred below: two different axes in
            a 280px card, which is what made it feel off. Now all four elements
            share the same axis — icon, title, text and code — and the piece
            reads as one unit.

            Centring is the declared exception the system already allows
            (§ the `align="center"` of the layout primitives): here the QR
            justifies it, being a symmetric object and the card's visual
            anchor. Without it, this piece would align to the rail like the
            rest. */}
        <div className="flex flex-col items-center text-center">
          {icon('size-12')}

          <p className="mt-4 font-display text-display-s font-semibold text-balance text-ink">
            {t(c.title, locale)}
          </p>
          <p className="mt-2 text-body-s text-ink-2">{t(c.body, locale)}</p>
        </div>

        <a
          href={externalLinks.app}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track('app_store_click', { tienda: 'dinamico', ubicacion: 'flotante_escritorio' })
          }
          /* The code stays ON WHITE even though the frame is glass: a scanner
             expects dark modules on a light background, and tinting it so it
             "matches" makes many phones fail. The glass is the frame; the code
             is an instrument and is not decorated. */
          className="press mx-auto mt-5 block w-fit rounded-[1.125rem] bg-white p-3 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.7)]"
        >
          <Image
            src="/qr-descargar-app.svg"
            alt=""
            aria-hidden="true"
            width={112}
            height={112}
            unoptimized
            className="block size-28"
          />
          <span className="sr-only">
            {t(home.app.qrLabel, locale)} · {t(a11y.opensInNewTab, locale)}
          </span>
        </a>
      </div>

      {/* MOBILE — low bar with the direct action */}
      <div
        className={cn(
          'glass glass-strong fixed inset-x-3 bottom-3 z-(--z-header) rounded-(--radius-structural) lg:hidden',
          'pb-[env(safe-area-inset-bottom)]',
          transition,
          show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        {/* The icon goes FIRST: what it is → what it does → what I do. And it
            sits outside the button's touch target so nobody taps it trying to
            open the app.

            ── TWO ROWS BELOW 480px ──────────────────────────────────────────
            In a single row the icon, two lines of text and the button all
            compete. Measured back when the close button still existed: at
            390px the text had 158px left and the second line needs 227; at
            320px it had 88 and even the title was cut off. Without the close
            button there are 56px to spare, but the two-row split is kept: it
            gives the text the 234px the sentence needs and the CTA a
            full-width touch target. This is not a copy problem — shortening it
            to fit in 88px would leave it with no message — it is a structural
            one.

            Below `xs` the button takes its own full-width row: the text then
            has ~246px, fits whole, and the CTA gains a much larger touch
            target, which on a phone is better and not worse. The bar goes from
            70 to ~118px tall, and that is the price accepted in exchange for
            the message being readable.

            One single `<a>` for both layouts, not two hiding each other: it is
            reordered with `order` and wraps with `flex-wrap`. Duplicating the
            link would also duplicate the emitter of the measurement event. */}
        <div className="flex flex-wrap items-center gap-3 p-3">
          {icon('size-10')}
          <div className="order-1 min-w-0 flex-1">
            <p className="truncate font-display text-body font-semibold text-ink">
              {t(c.titleMobile, locale)}
            </p>
            {/* `line-clamp-2` rather than `truncate`: at 320px the text has
                164px left and this line needs 227, so cutting it would leave
                "Encuentra estaciones e ini…". Wrapping to two lines keeps the
                whole message and only costs height at the narrowest width — at
                390px and above it is still one line. The cap of two stops a
                longer language from stretching the bar without limit. */}
            <p className="line-clamp-2 text-caption text-ink-2">{t(c.bodyMobile, locale)}</p>
          </div>
          <a
            href={externalLinks.app}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track('app_store_click', { tienda: 'dinamico', ubicacion: 'flotante_movil' })
            }
            className="brand-gradient press order-3 inline-flex h-11 w-full shrink-0 items-center justify-center rounded-(--radius-pill) px-4 text-body-s font-semibold text-on-brand transition-[filter] duration-(--duration-fast) hover:brightness-105 xs:order-2 xs:w-auto"
          >
            {t(c.open, locale)}
            <span className="sr-only"> · {t(a11y.opensInNewTab, locale)}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
