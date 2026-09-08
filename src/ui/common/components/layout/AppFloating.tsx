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
 * 1. ESTÁ VISIBLE SIEMPRE, hasta que se cierra a mano. Decisión de producto
 *    del 2026-09-08, y sustituye a DOS reglas anteriores del mismo día: la que
 *    lo escondía sobre la primera sección y la que lo retiraba al llegar a la
 *    sección de descarga.
 *
 *    ── POR QUÉ SE FUERON ─────────────────────────────────────────────────
 *    Toda condición ligada al scroll produce transiciones, y las transiciones
 *    en una capa fija se perciben como parpadeo. Medido en un recorrido de la
 *    Home: con tres zonas mudas eran **5 cambios de estado** (`··███···██·····█`);
 *    reducidas a una, 2. Cero condiciones, cero cambios.
 *
 *    Se intentó primero acotar dónde tapaba texto. No hay dónde: midiendo los
 *    glifos reales —no las cajas— la tarjeta se posa sobre texto en casi todas
 *    las secciones y en todos los anchos (a 1024px, 46.946 px² sobre la cita
 *    del fundador; 8.768 en empresas; 7.273 en novedades). Una capa fija sobre
 *    una página larga siempre cae encima de algo, y perseguirlo sección a
 *    sección exige esconderla casi siempre — que es el parpadeo otra vez.
 *
 *    La respuesta a que una capa tape contenido no es esconderla a ratos: es
 *    que se pueda cerrar. Ver la regla 3.
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
 * 4. IT CAN BE DISMISSED AT ANY TIME, AND COMES BACK ON RELOAD.
 *    Product decision of 2026-09-08, reversing the one of 2026-09-04 which
 *    removed the control. The reason it comes back: on mobile the bar takes
 *    126px of screen that someone who does not want the app never gets back,
 *    and the previous way out was "keep scrolling", which is not a way out.
 *
 *    ── THE DISMISSAL IS NOT PERSISTED, AND THAT IS THE WHOLE POINT ────────
 *    `dismissed` is React state and nothing else. It is NOT written to
 *    `localStorage`, and that is not an omission:
 *
 *    The first version of this component saved `voltop:app-flotante-cerrado`,
 *    and the bug it caused is the one that opened this whole line of work — the
 *    floating element had VANISHED from every page and looked like a code
 *    fault. It was not: one click months earlier had persisted, and no amount of
 *    reading the component could show it, because the state lived in the
 *    browser. Whoever adds persistence here brings that back.
 *
 *    So: closing it silences it for the rest of the page view, and a reload
 *    brings it back. Client navigation does NOT bring it back — the component
 *    lives in the layout and does not remount — which is the correct reading of
 *    "for the rest of the visit".
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
 * complementary content. While hidden it is `inert`, so no link stays reachable
 * with Tab inside an invisible card. Only `opacity` and `transform` are
 * animated (§29).
 *
 * **Escape closes it, and until 2026-09-08 this comment said so while no
 * handler existed.** It was written when the piece was dismissible, survived
 * the removal of the control, and stayed here describing a mechanism that had
 * been deleted. Now the listener exists — and it only listens while the piece
 * is on screen, so it never eats an Escape meant for something else.
 *
 * On dismissing, if focus is INSIDE the component it is blurred first, so it
 * does not stay inside a subtree that is about to become `inert` — a state
 * where the browser stops reporting focus and assistive technology disagrees
 * about where it is.
 *
 * Measured limit, stated rather than hidden: after the blur, focus sits on
 * `body` and **the next Tab does start again from the beginning of the
 * document** — verified, it lands on the header logo. It is not fixed by
 * guessing a return target: this notice appears on its own, there is no
 * trigger element to go back to, and inventing one would move focus somewhere
 * the user never was. It is the accepted behaviour for a self-appearing
 * notice, not an oversight.
 */

/** The same key `CookieConsent` uses. See rule 5. */
const COOKIES_KEY = 'voltop:cookies'


export function AppFloating({ locale }: { locale: Locale }) {
  const c = home.appFloating
  /* Ya no hay estado ligado al scroll: ver la regla 1. Lo único que decide la
     visibilidad son tres cosas, y ninguna depende de dónde estés en la página:
     la ruta, la decisión de cookies y si se cerró a mano. */
  const [cookiesDecided, setCookiesDecided] = useState(false)
  /* Regla 3 — en memoria y SOLO en memoria. Lee esa regla antes de añadir aquí
     cualquier tipo de almacenamiento. */
  const [dismissed, setDismissed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const path = stripLocale(usePathname()) || '/'

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

  const pathAllows = !path.startsWith(routes.business) && !path.startsWith('/legal')
  const show = pathAllows && cookiesDecided && !dismissed

  /**
   * Dismissing. Moves focus out first if it is inside — see the accessibility
   * note in the header: focus left in an `inert` subtree makes the next Tab
   * restart from the top of the document.
   */
  const dismiss = () => {
    const active = document.activeElement
    if (active instanceof HTMLElement && ref.current?.contains(active)) active.blur()
    setDismissed(true)
  }

  /* Escape, and only while the piece is on screen: a listener that is always
     mounted would swallow an Escape meant for the language menu or a future
     overlay. */
  useEffect(() => {
    if (!show) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [show])

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
  /**
   * The dismiss control, one for both pieces.
   *
   * ABSOLUTELY POSITIONED, and that is a measurement and not a preference. In
   * the mobile bar the icon, two lines of text and the CTA already share the
   * row: the note further down records that at 320px the text had 88px left and
   * even the title was cut off back when this button was in the flow. Out of
   * the flow it costs the row nothing, and the text block gets `pr-11` so no
   * line ever runs underneath it.
   *
   * `size-11` is 44px, the minimum touch target, on a glyph that draws much
   * smaller. `-top-*`/`-right-*` are NOT used: the button stays inside the
   * panel so the target never falls outside the glass.
   */
  const closeButton = (
    <button
      type="button"
      onClick={dismiss}
      aria-label={t(c.close, locale)}
      className="press absolute right-1 top-1 z-10 inline-flex size-11 items-center justify-center rounded-(--radius-pill) text-ink-3 transition-colors duration-(--duration-fast) hover:bg-surface-2 hover:text-ink"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  )

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
        {/* Out of the flow, so the four centred elements keep the single axis
            the note below explains. */}
        {closeButton}
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
        {closeButton}
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
        {/* `pr-14` reserves the dismiss control's column for the WHOLE row and
            not just for the text, and that was measured: with the padding on
            the text block alone, from 480px up the bar collapses to a single
            row, the CTA moves to the right edge and landed UNDER the button —
            a tap on the corner of "Abrir" closed the bar instead of opening the
            app. Reserving it on the container clears every child at once. */}
        <div className="flex flex-wrap items-center gap-3 p-3 pr-14">
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
