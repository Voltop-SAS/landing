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
 * SELECTOR DE IDIOMA
 * Ver docs/MASTER-PROJECT-DEFINITION.md §28.
 *
 * ── POR QUÉ DEJÓ DE SER UN CONTROL SEGMENTADO ─────────────────────────────
 * Era una fila de botones `ES | EN`: legible con dos idiomas, insostenible con
 * tres. Cada opción necesita 44px de alto y de ancho mínimos (§23), así que el
 * control crecía ~44px por idioma —de 88px a 132px— en la zona más disputada
 * del header, que ya había expulsado el selector del header móvil por falta de
 * sitio. Un patrón que se ensancha con cada idioma no es escalable: es una
 * cuenta atrás.
 *
 * El desplegable ocupa lo mismo con dos idiomas que con seis.
 *
 * ── LO QUE NO CAMBIA ──────────────────────────────────────────────────────
 * Siguen siendo ENLACES, no botones de estado. El idioma vive en la URL, así
 * que cambiar de idioma es navegar: es lo que hace que el idioma sobreviva a
 * la navegación y que todas las versiones sean indexables. Un `<select>` con
 * JavaScript habría roto ambas cosas.
 *
 * Cada idioma se nombra EN SU PROPIO IDIOMA (Español · English · Português).
 * Traducir "Português" a "Portugués" se lo muestra en un idioma que quien
 * busca portugués puede no leer, que es exactamente a quien sirve el control.
 *
 * ── PATRÓN DE ACCESIBILIDAD ───────────────────────────────────────────────
 * Disclosure, no `role="menu"`. El panel contiene enlaces de navegación y el
 * Tab natural ya los recorre en orden; declarar un menú obligaría a implementar
 * navegación por flechas que aquí no aporta nada y suele quedar a medias.
 * Cierre por Escape con retorno del foco, cierre al pulsar fuera y cierre al
 * navegar (§23).
 */
export function LangSwitch({
  locale,
  placement = 'down',
}: {
  locale: Locale
  /**
   * En el menú móvil el selector vive al fondo del panel: abrir hacia abajo
   * lo dejaría fuera de la pantalla.
   */
  placement?: 'down' | 'up'
}) {
  const pathname = usePathname()

  /**
   * Se abre "para una ruta": al navegar cambia `pathname` y el panel se cierra
   * por derivación. Mismo patrón que el menú móvil del header — sin efecto de
   * limpieza ni renders en cascada.
   */
  const [openedFor, setOpenedFor] = useState<string | null>(null)
  const open = openedFor === pathname

  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  /**
   * En producción solo se ofrecen los idiomas PUBLICADOS: uno en borrador está
   * a medias y ofrecerlo sería peor que no tenerlo.
   *
   * En desarrollo se listan todos, marcados, porque si no hubiera forma de
   * llegar a un idioma en borrador desde la interfaz habría que escribir la
   * URL a mano para revisarlo — y lo que cuesta revisar no se revisa.
   */
  const options = process.env.NODE_ENV === 'development' ? locales : publishedLocales

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpenedFor(null)
      buttonRef.current?.focus()
    }

    /* `pointerdown` y no `click`: cierra al empezar el gesto, sin esperar a que
       se suelte, y no se traga el clic que el usuario dirigía a otro control. */
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
        aria-controls="selector-idioma"
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
          id="selector-idioma"
          /* `bg-canvas` OPACO a propósito: el header es translúcido con
             `backdrop-blur`, y un panel translúcido sobre un fondo translúcido
             deja el texto ilegible sobre el contenido de la página. */
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
                  /* Con tres idiomas, este es el único dato que dirá si el
                     portugués se usa. Sin él, la decisión de mantenerlo se
                     tomaría a ciegas. */
                  onClick={() => {
                    if (!active) track('idioma_cambiado', { de: locale, a: code })
                  }}
                  className={cn(
                    'flex min-h-11 items-center justify-between gap-4 px-4 text-body-s transition-colors',
                    active ? 'text-ink' : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
                  )}
                >
                  {/* El nombre del idioma NO se traduce: es un nombre propio. */}
                  <span lang={localeMeta[code].htmlLang}>
                    {localeMeta[code].name}
                    {/* Solo visible en desarrollo, donde `options` incluye
                        borradores. Sin rótulo, un idioma incompleto parecería
                        terminado y sus huecos, erratas. */}
                    {localeStatus[code] === 'borrador' && (
                      <span className="ml-2 font-mono text-mono uppercase text-warn">borrador</span>
                    )}
                  </span>
                  {/* Ancho reservado siempre: sin esto, la marca de activo
                      desplazaría el texto de las demás filas. */}
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
