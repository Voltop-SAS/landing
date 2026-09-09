'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes, stripLocale } from '~/core/common/domain/i18n/routes'
import { nav, headerCta, helpLink, a11y } from '~/core/common/domain/consts/copy'
import { Button } from '@ui/common/components/ui/Button'
import { LangSwitch } from '@ui/common/components/layout/LangSwitch'
import { Logo } from '@ui/common/components/layout/Logo'
import { lockScroll, unlockScroll } from '@ui/common/lib/scroll'
import { track } from '~/core/common/infrastructure/analytics'
import { cn } from '@ui/common/lib/cn'

/**
 * HEADER
 * See docs/MASTER-PROJECT-DEFINITION.md §15.
 *
 * - ONE single global CTA, CONTEXTUAL per route. On /red there is no CTA: the
 *   user is already in the tool. On /empresas it turns into a commercial
 *   conversion.
 * - Full-screen mobile menu with Escape to close, trapped focus, scroll lock
 *   and touch targets ≥44px (§23).
 *
 * THE MOBILE PANEL LIVES OUTSIDE THE <header>, NOT INSIDE IT. This is not a
 * style preference: `backdrop-filter` (the `backdrop-blur` the header applies
 * on scroll or when open) turns the header into the CONTAINING BLOCK for its
 * `position: fixed` descendants. With the panel inside, `top-16 bottom-0`
 * resolved against the header's 65px instead of the viewport and the panel
 * collapsed to 1px tall: the menu opened, locked scrolling and moved focus to
 * invisible links. As a sibling of the header, `fixed` measures against the
 * viewport again.
 *
 * Stacking is declared with the `--z-header` / `--z-overlay` tokens instead of
 * a hand-written `z-50` in both places, which is what made the paint order
 * impossible to reason about.
 */

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  /**
   * The menu opens "for a route". Navigating changes `pathname` and the menu
   * closes by derivation, with no effect and no cascading renders.
   */
  const [openedFor, setOpenedFor] = useState<string | null>(null)
  const open = openedFor === pathname
  const setOpen = (next: boolean) => setOpenedFor(next ? pathname : null)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  /* Route context → contextual CTA */
  const path = stripLocale(pathname) || '/'
  const context = path.startsWith(routes.network)
    ? 'red'
    : path.startsWith(routes.business)
      ? 'empresas'
      : path.startsWith(routes.news)
        ? 'novedades'
        : path.startsWith(routes.about)
          ? 'nosotros'
          : 'home'
  const cta = headerCta[context]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Scroll lock, Escape and trapped focus while the menu is open */
  useEffect(() => {
    if (!open) return
    lockScroll()

    /* The close button lives OUTSIDE the panel — it is in the bar, and that is
       where it belongs — but it is the visible closing control. Cycling
       through the panel alone, Tab went round the 7 links and never reached
       it: visible and inoperable by keyboard. It is appended to the end of the
       cycle. */
    const panel = panelRef.current
    const fromPanel = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      : []
    const focusables = toggleRef.current ? [...fromPanel, toggleRef.current] : fromPanel
    focusables[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenedFor(null)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || focusables.length === 0) return

      /* Cycling BY INDEX, not by endpoints.
         The close button is in the bar, that is, BEFORE the panel in the DOM,
         and tab order follows the DOM: on reaching the panel's last link, Tab
         jumped outside and never got to it. Handling the endpoints was not
         enough — that only closes the loop from last to first; focus has to be
         moved explicitly at every step so the LOGICAL order wins over the
         document order. */
      const i = focusables.indexOf(document.activeElement as HTMLElement)
      if (i === -1) return
      e.preventDefault()
      const next = e.shiftKey
        ? (i - 1 + focusables.length) % focusables.length
        : (i + 1) % focusables.length
      focusables[next].focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      unlockScroll()
    }
  }, [open])

  const isActive = (target: string) =>
    path === target || (target !== '/' && path.startsWith(target))

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-(--z-header) transition-colors duration-(--duration-base)',
          scrolled || open
            ? 'border-b border-line bg-canvas/85 backdrop-blur-xl'
            : 'border-b border-transparent',
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-(--container-content) items-center justify-between px-(--spacing-gutter) md:h-20">
          <Link
            href={href(locale, routes.home)}
            /* `shrink-0`: the logo is a fixed-ratio lockup, and letting it
               shrink either deformed it or pushed it against the menu. Let
               some other element give up the space, not the brand. The
               previous `gap` became redundant once the official file started
               carrying symbol and wordmark as a single piece. */
            className="flex shrink-0 items-center py-2"
            aria-label={t(a11y.goHome, locale)}
          >
            <Logo />
          </Link>

          <nav
            /* `gap-6` between `md` and `lg`, `gap-9` from there on. In the
               ~768–820px band the layout was left with about 4px of slack:
               logo, four entries, language switch and CTA do not fit with 36px
               of separation, and flex compressed THE LOGO LINK until it
               touched the menu. Reclaiming 36px of separation resolves the
               squeeze without touching text sizes or hiding anything. */
            className="hidden items-center gap-6 nav:flex lg:gap-9"
            aria-label={t(a11y.mainNav, locale)}
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={href(locale, item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-11 items-center text-body-s transition-colors',
                  isActive(item.href) ? 'text-ink' : 'text-ink-2 hover:text-ink',
                )}
              >
                {t(item.label, locale)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {/* The language switch leaves the mobile header and moves down
                into the menu. It is a low-frequency control that took up 88px
                of the most valuable space on screen, and the CTA needs that
                space. */}
            {/* "Need help?" before the switch: it is a RESCUE link, not an
                action, so it is set as plain text with no border to keep it
                from competing with the CTA next to it. It leads to the FAQ,
                which is where the answers are. */}
            <Link
              href={href(locale, helpLink.href)}
              className="hidden min-h-11 items-center text-body-s text-ink-2 transition-colors hover:text-ink nav:inline-flex"
            >
              {t(helpLink.label, locale)}
            </Link>

            <div className="hidden nav:block">
              <LangSwitch locale={locale} />
            </div>

            {cta && (
              /* Visible from `xs` (480px). Below that, logo + CTA + hamburger
                 do not fit without cramping, so down there the CTA lives in
                 the menu — which now works. First real use of the
                 `--breakpoint-xs` token, which was defined and unused. */
              <div className="hidden xs:block">
                <Button
                  variant="secondary"
                  size="s"
                  arrow
                  href={cta.external ? cta.href : href(locale, cta.href)}
                  external={cta.external}
                  locale={locale}
                  onClick={() => trackCta(context)}
                >
                  {t(cta.label, locale)}
                </Button>
              </div>
            )}

            <button
              ref={toggleRef}
              type="button"
              className="press grid size-11 place-items-center rounded-(--radius-structural) border border-line-control text-ink nav:hidden"
              aria-label={open ? t(a11y.closeMenu, locale) : t(a11y.openMenu, locale)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(!open)}
            >
              <span
                aria-hidden="true"
                className="relative block h-3 w-4"
              >
                <span
                  className={cn(
                    'absolute left-0 top-0 h-0.5 w-4 bg-current transition-transform',
                    open && 'translate-y-[5px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[5px] h-0.5 w-4 bg-current transition-opacity',
                    open && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute bottom-0 left-0 h-0.5 w-4 bg-current transition-transform',
                    open && '-translate-y-[5px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — full-screen overlay, SIBLING of the header (see the
          file header: inside the header, backdrop-filter collapsed it to 1px
          tall). */}
      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 top-16 z-(--z-overlay) flex flex-col overflow-y-auto border-t border-line bg-canvas nav:hidden"
        >
          {/* `display-s`, not `display-m`. At 390px that is 20px against 24px,
              and those 4px were what made five menu entries outweigh the
              wordmark itself, which is 20. One step down the system scale, not a
              loose value: the row still measures 66px, well above the 44 a touch
              target asks for. */}
          <nav
            className="flex flex-col px-(--spacing-gutter) py-4"
            aria-label={t(a11y.mainNav, locale)}
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={href(locale, item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className="border-b border-line py-5 font-display text-display-s text-ink"
              >
                {t(item.label, locale)}
              </Link>
            ))}
            {/* On mobile, help joins the list: there is no room in the bar,
                and hiding it in a menu that does not list it would be worse
                than not having it at all. */}
            <Link
              href={href(locale, helpLink.href)}
              className="border-b border-line py-5 font-display text-display-s text-ink-2"
            >
              {t(helpLink.label, locale)}
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-8 px-(--spacing-gutter) pb-10 pt-8">
            {cta && (
              /* Here it IS primary: inside the menu it competes with no other
                 action on the page, so it is the only gradient in the view
                 (§12, gradient discipline). */
              <Button
                variant="primary"
                size="l"
                arrow
                href={cta.external ? cta.href : href(locale, cta.href)}
                external={cta.external}
                locale={locale}
                className="w-full"
                onClick={() => trackCta(context)}
              >
                {t(cta.label, locale)}
              </Button>
            )}
            <div className="self-start">
              {/* Opens UPWARDS: in the mobile menu the switch sits at the
                  bottom of the panel and downwards would fall off screen. */}
              <LangSwitch
                locale={locale}
                placement="up"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Measurement plan event for the global CTA (§31). */
function trackCta(context: string) {
  track(context === 'empresas' ? 'cta_b2b_click' : 'cta_descargar_app_click', {
    ubicacion: 'header',
    contexto: context,
  })
}
