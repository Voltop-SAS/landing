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
 * ACORDEÓN · patrón `disclosure`, no `tabs`.
 *
 * §23 exige "ARIA completa o ninguna". El patrón disclosure es un botón con
 * `aria-expanded` que controla una región — nada más. No lleva `role="tab"`,
 * ni navegación por flechas, ni `aria-multiselectable`: eso es el patrón
 * TABS, y montarlo a medias degrada más que no poner ARIA. Un `<button>`
 * nativo ya trae foco, Enter y Espacio sin escribir una línea de teclado.
 *
 * ── Varias abiertas a la vez ──────────────────────────────────────────────
 * Deliberado. En un FAQ, cerrar la anterior al abrir la siguiente mueve el
 * texto que la persona está leyendo. Comparar dos respuestas es un caso real
 * (potencia y compatibilidad se leen juntas); el acordeón exclusivo lo impide
 * a cambio de nada.
 *
 * ── Por qué el panel no usa `hidden` ──────────────────────────────────────
 * La altura se anima con `grid-rows: 0fr → 1fr`, que es la única forma de
 * transicionar a altura automática sin medir en JS. Eso obliga a dejar el
 * contenido en el DOM, así que cerrado se marca `inert`: sale del árbol de
 * accesibilidad Y del orden de tabulación. Sin él, un lector de pantalla
 * leería las cinco respuestas seguidas y Tab caería en enlaces invisibles.
 */
/** Un solo sitio para el enlace de salida: interno y externo solo difieren
    en la flecha y en el aviso de pestaña nueva. */
/* `min-h-11`: sin ella estos enlaces medían 16.8px de alto, por debajo de los
   24px de WCAG 2.5.8, y no son enlaces en línea dentro de una frase, así que
   no les vale la excepción. `Footer` y `PostsInline` ya lo hacían. */
const enlace =
  'group inline-flex min-h-11 items-center gap-2 font-mono text-mono text-brand transition-colors hover:text-ink'

const flecha = 'transition-transform duration-(--duration-fast) ease-(--ease-overshoot)'

export function Accordion({
  items,
  className,
  /** Texto de "se abre en pestaña nueva". Llega por prop: este componente es
      UI genérica y §24 le prohíbe contener copy literal. */
  newTabLabel,
}: {
  items: AccordionItem[]
  className?: string
  newTabLabel: string
}) {
  const uid = useId()
  const [abiertas, setAbiertas] = useState<Set<string>>(new Set())

  const alternar = (id: string) =>
    setAbiertas((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })

  return (
    <ul className={cn('border-t border-line', className)}>
      {items.map((item) => {
        const abierta = abiertas.has(item.id)
        const botonId = `${uid}-${item.id}-boton`
        const panelId = `${uid}-${item.id}-panel`

        return (
          <li
            key={item.id}
            className="border-b border-line"
          >
            <h3>
              <button
                type="button"
                id={botonId}
                aria-expanded={abierta}
                aria-controls={panelId}
                onClick={() => alternar(item.id)}
                className="press group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-(--duration-fast) hover:text-brand"
              >
                <span className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                  {item.question}
                </span>
                {/* Cruz que se vuelve raya: la barra vertical rota 90°. Solo
                    `transform`, que es lo que §29 permite animar. */}
                <span
                  aria-hidden="true"
                  className="relative mt-1.5 grid size-6 shrink-0 place-items-center text-ink-3 transition-colors group-hover:text-brand"
                >
                  <span className="absolute h-px w-4 bg-current" />
                  <span
                    className={cn(
                      'absolute h-px w-4 bg-current transition-transform duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none',
                      abierta ? 'rotate-0' : 'rotate-90',
                    )}
                  />
                </span>
              </button>
            </h3>

            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none',
                abierta ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={botonId}
                  inert={!abierta}
                  /* El margen derecho solo existe para librar la columna del
                     +/−, y esa columna solo compite con el texto en pantallas
                     donde caben en la misma línea. En móvil la respuesta va
                     debajo del botón: ahí el padding no libraba nada y robaba
                     40px a una medida de línea que ya iba justa. */
                  className="pb-7 md:pr-10"
                >
                  <p className="measure-narrow text-body text-ink-2">{item.answer}</p>
                  {item.links?.length ? (
                    <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                      {item.links.map((l) =>
                        l.external ? (
                          /* Externo: pestaña nueva anunciada (WCAG 3.2.5) y la
                             MISMA flecha que el enlace interno, movida en
                             diagonal al pasar el cursor. Es lo que hace
                             `Button`, y así "esto te saca del sitio" se dice de
                             una sola forma en todo el sitio.

                             Probé antes con el glifo ↗ y no servía: en esta
                             mono sale más pequeño y fino que la →, desparejado
                             justo al lado de ella. */
                          <li key={l.href}>
                            <a
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={enlace}
                            >
                              {l.label}
                              <span className="sr-only"> · {newTabLabel}</span>
                              <span
                                aria-hidden="true"
                                className={
                                  flecha + ' group-hover:-translate-y-1 group-hover:translate-x-1'
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
                              className={enlace}
                            >
                              {l.label}
                              <span
                                aria-hidden="true"
                                className={flecha + ' group-hover:translate-x-1'}
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
