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
 * Ver docs/MASTER-PROJECT-DEFINITION.md §15.
 *
 * - UN solo CTA global, CONTEXTUAL por ruta. En /red no hay CTA: el usuario ya
 *   está en la herramienta. En /empresas muta a conversión comercial.
 * - Menú móvil a pantalla completa con cierre por Escape, foco atrapado,
 *   bloqueo de scroll y objetivos táctiles ≥44px (§23).
 *
 * EL PANEL MÓVIL VIVE FUERA DEL <header>, NO DENTRO. No es una preferencia de
 * estilo: `backdrop-filter` (el `backdrop-blur` que el header aplica al hacer
 * scroll o al abrirse) convierte al header en BLOQUE CONTENEDOR de sus
 * descendientes `position: fixed`. Con el panel dentro, `top-16 bottom-0` se
 * resolvía contra los 65px del header en lugar del viewport y el panel
 * colapsaba a 1px de alto: el menú abría, bloqueaba el scroll y movía el foco
 * a enlaces invisibles. Como hermano del header, `fixed` vuelve a medirse
 * contra el viewport.
 *
 * El apilado se declara con los tokens `--z-header` / `--z-overlay` en lugar de
 * `z-50` a mano en los dos sitios, que es lo que impedía razonar sobre el
 * orden de pintado.
 */

export function Header({ lang }: { lang: Locale }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  /**
   * El menú se abre "para una ruta". Al navegar cambia `pathname` y el menú se
   * cierra por derivación, sin efecto ni renders en cascada.
   */
  const [openedFor, setOpenedFor] = useState<string | null>(null)
  const open = openedFor === pathname
  const setOpen = (next: boolean) => setOpenedFor(next ? pathname : null)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  /* Contexto de ruta → CTA contextual */
  const path = stripLocale(pathname) || '/'
  const context = path.startsWith(routes.red)
    ? 'red'
    : path.startsWith(routes.empresas)
      ? 'empresas'
      : path.startsWith(routes.novedades)
        ? 'novedades'
        : path.startsWith(routes.nosotros)
          ? 'nosotros'
          : 'home'
  const cta = headerCta[context]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Bloqueo de scroll, Escape y foco atrapado mientras el menú está abierto */
  useEffect(() => {
    if (!open) return
    lockScroll()

    /* El botón de cerrar vive FUERA del panel —está en la barra, y ahí debe
       seguir— pero es el control de cierre visible. Recorriendo solo el panel,
       Tab daba vueltas entre los 7 enlaces y nunca llegaba a él: visible e
       inoperable con teclado. Se añade al final del recorrido. */
    const panel = panelRef.current
    const delPanel = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      : []
    const focusables = toggleRef.current ? [...delPanel, toggleRef.current] : delPanel
    focusables[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenedFor(null)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || focusables.length === 0) return

      /* Recorrido POR ÍNDICE, no por extremos.
         El botón de cerrar está en la barra, o sea ANTES del panel en el DOM,
         y el orden de tabulación sigue el DOM: al llegar al último enlace del
         panel, Tab saltaba fuera y nunca lo alcanzaba. Con extremos no bastaba
         —solo cerraba el ciclo del último al primero—; hay que mover el foco
         explícitamente en cada paso para que el orden LÓGICO mande sobre el
         orden del documento. */
      const i = focusables.indexOf(document.activeElement as HTMLElement)
      if (i === -1) return
      e.preventDefault()
      const siguiente = e.shiftKey
        ? (i - 1 + focusables.length) % focusables.length
        : (i + 1) % focusables.length
      focusables[siguiente].focus()
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
            href={href(lang, routes.home)}
            /* `shrink-0`: el logo es un lockup de proporción fija, y dejarlo
               encoger lo deformaba o lo pegaba al menú. Que ceda el espacio
               otro elemento, no la marca. El `gap` anterior sobraba desde que
               el archivo oficial trae símbolo y logotipo en una sola pieza. */
            className="flex shrink-0 items-center py-2"
            aria-label={t(a11y.goHome, lang)}
          >
            <Logo />
          </Link>

          <nav
            /* `gap-6` entre `md` y `lg`, `gap-9` a partir de ahí. En la franja
               de ~768–820px el reparto quedaba en unos 4px de holgura: logo,
               cuatro entradas, selector e CTA no caben con 36px de separación,
               y el flex comprimía el ENLACE DEL LOGO hasta pegarlo al menú.
               Recuperar 36px de separación resuelve el aprieto sin tocar
               tamaños de texto ni ocultar nada. */
            className="hidden items-center gap-6 nav:flex lg:gap-9"
            aria-label={t(a11y.mainNav, lang)}
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={href(lang, item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-11 items-center text-body-s transition-colors',
                  isActive(item.href) ? 'text-ink' : 'text-ink-2 hover:text-ink',
                )}
              >
                {t(item.label, lang)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {/* El selector de idioma sale del header móvil y baja al menú. Es un
                control de baja frecuencia que ocupaba 88px del espacio más
                valioso de la pantalla, y ese espacio lo necesita el CTA. */}
            {/* "¿Necesitas ayuda?" antes del selector: es un enlace de
                RESCATE, no una acción, así que se dice en texto y sin borde
                para que no compita con el CTA que tiene al lado. Lleva al FAQ,
                que es donde están las respuestas. */}
            <Link
              href={href(lang, helpLink.href)}
              className="hidden min-h-11 items-center text-body-s text-ink-2 transition-colors hover:text-ink nav:inline-flex"
            >
              {t(helpLink.label, lang)}
            </Link>

            <div className="hidden nav:block">
              <LangSwitch lang={lang} />
            </div>

            {cta && (
              /* Visible desde `xs` (480px). Por debajo no caben logo + CTA +
                 hamburguesa sin apretar, así que ahí el CTA vive en el menú
                 —que ahora funciona—. Primer uso real del token
                 `--breakpoint-xs`, que estaba definido y sin usar. */
              <div className="hidden xs:block">
                <Button
                  variant="secondary"
                  size="s"
                  arrow
                  href={cta.external ? cta.href : href(lang, cta.href)}
                  external={cta.external}
                  lang={lang}
                  onClick={() => trackCta(context)}
                >
                  {t(cta.label, lang)}
                </Button>
              </div>
            )}

            <button
              ref={toggleRef}
              type="button"
              className="press grid size-11 place-items-center rounded-(--radius-structural) border border-line-control text-ink nav:hidden"
              aria-label={open ? t(a11y.closeMenu, lang) : t(a11y.openMenu, lang)}
              aria-expanded={open}
              aria-controls="menu-movil"
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

      {/* Menú móvil — overlay a pantalla completa, HERMANO del header (ver
          cabecera del archivo: dentro del header, el backdrop-filter lo
          colapsaba a 1px de alto). */}
      {open && (
        <div
          id="menu-movil"
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 top-16 z-(--z-overlay) flex flex-col overflow-y-auto border-t border-line bg-canvas nav:hidden"
        >
          <nav
            className="flex flex-col px-(--spacing-gutter) py-4"
            aria-label={t(a11y.mainNav, lang)}
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={href(lang, item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className="border-b border-line py-5 font-display text-display-m text-ink"
              >
                {t(item.label, lang)}
              </Link>
            ))}
            {/* En móvil la ayuda entra en la lista: no hay sitio en la barra y
                esconderla en un menú que no la lista sería peor que no tenerla. */}
            <Link
              href={href(lang, helpLink.href)}
              className="border-b border-line py-5 font-display text-display-m text-ink-2"
            >
              {t(helpLink.label, lang)}
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-8 px-(--spacing-gutter) pb-10 pt-8">
            {cta && (
              /* Aquí SÍ es primario: dentro del menú no compite con ninguna
                 acción de la página, así que es la única con gradiente en la
                 vista (§12, disciplina del gradiente). */
              <Button
                variant="primary"
                size="l"
                arrow
                href={cta.external ? cta.href : href(lang, cta.href)}
                external={cta.external}
                lang={lang}
                className="w-full"
                onClick={() => trackCta(context)}
              >
                {t(cta.label, lang)}
              </Button>
            )}
            <div className="self-start">
              {/* Abre hacia ARRIBA: en el menú móvil el selector está al fondo
                  del panel y hacia abajo quedaría fuera de la pantalla. */}
              <LangSwitch
                lang={lang}
                placement="up"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Evento del plan de medición para el CTA global (§31). */
function trackCta(context: string) {
  track(context === 'empresas' ? 'cta_b2b_click' : 'cta_descargar_app_click', {
    ubicacion: 'header',
    contexto: context,
  })
}
