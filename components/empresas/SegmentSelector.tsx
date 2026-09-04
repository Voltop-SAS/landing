'use client'

import { useRef, useState } from 'react'
import { t, type Locale } from '@/lib/i18n/config'
import { empresas } from '@/content/copy/empresas'
import type { BusinessSegment } from '@/content/data/company'
import { track } from '@/lib/analytics'
import { SectionHeading } from '@/components/ui/layout'
import { cn } from '@ui/common/lib/cn'

/**
 * SELECTOR DE CASO B2B · patrón de pestañas COMPLETO
 * Ver docs/MASTER-PROJECT-DEFINITION.md §23.
 *
 * La versión anterior declaraba `role="tab"` sin `tabpanel`, sin `aria-controls`
 * y sin navegación por flechas: un patrón ARIA incompleto degrada más que no
 * poner ARIA. Aquí está completo — roving tabindex, flechas, Inicio/Fin,
 * panel asociado y objetivos táctiles ≥44px.
 *
 * El segmento elegido se comunica hacia arriba para prellenar el formulario.
 */
export function SegmentSelector({
  lang,
  segments,
  onChange,
  activeKey,
}: {
  lang: Locale
  segments: BusinessSegment[]
  activeKey: string
  onChange: (key: string) => void
}) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const [focusIndex, setFocusIndex] = useState(0)

  const activeIndex = Math.max(
    0,
    segments.findIndex((s) => s.key === activeKey),
  )
  const active = segments[activeIndex]

  const select = (index: number) => {
    const seg = segments[index]
    if (!seg) return
    onChange(seg.key)
    setFocusIndex(index)
    tabsRef.current[index]?.focus()
    track('empresas_selector_caso', { segmento: seg.key })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = segments.length - 1
    const map: Record<string, number> = {
      ArrowRight: focusIndex === last ? 0 : focusIndex + 1,
      ArrowLeft: focusIndex === 0 ? last : focusIndex - 1,
      Home: 0,
      End: last,
    }
    const next = map[e.key]
    if (next === undefined) return
    e.preventDefault()
    select(next)
  }

  return (
    <div>
      {/* ── TAB, NO CHIP ───────────────────────────────────────────────────
          Antes esto y los filtros de /red eran visualmente IDÉNTICOS —pastilla,
          borde de marca, relleno tenue— para dos semánticas opuestas: filtrar
          una lista frente a cambiar de vista. Y nada indicaba que hubiera un
          panel debajo que cambia.

          Ahora el tab es una lengüeta: se apoya en la misma línea que separa el
          panel y el activo la interrumpe con una barra de marca. La conexión
          entre el control y su contenido es visual, no solo declarada en ARIA. */}
      <div
        role="tablist"
        aria-label={t(empresas.selector.title, lang)}
        onKeyDown={onKeyDown}
        className="-mb-px flex flex-wrap border-b border-line"
      >
        {segments.map((s, i) => {
          const isActive = s.key === activeKey
          return (
            <button
              key={s.key}
              ref={(el) => {
                tabsRef.current[i] = el
              }}
              id={`tab-${s.key}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`panel-${s.key}`}
              tabIndex={i === focusIndex ? 0 : -1}
              onClick={() => select(i)}
              className={cn(
                'press relative inline-flex min-h-12 items-center px-5 text-body-s transition-colors',
                isActive ? 'text-ink' : 'text-ink-2 hover:text-ink',
              )}
            >
              {t(s.label, lang)}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute inset-x-0 bottom-0 h-0.5 transition-opacity',
                  isActive ? 'brand-gradient opacity-100' : 'opacity-0',
                )}
              />
            </button>
          )
        })}
      </div>

      {active && (
        <div
          id={`panel-${active.key}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.key}`}
          tabIndex={0}
          className="border-t border-line pt-10"
        >
          <SectionHeading
            as="h3"
            size="m"
            measure="max-w-[22ch]"
          >
            {t(active.headline, lang)}
          </SectionHeading>
          <p className="mt-5 measure text-body-l text-ink-2">{t(active.proposition, lang)}</p>

          <SectionHeading
            as="h3"
            size="s"
            className="mt-12"
          >
            {t(empresas.selector.benefitsTitle, lang)}
          </SectionHeading>
          {/* "Qué incluye" es una lista de INCLUSIÓN, no una secuencia: el
              número prometía un orden inexistente. La marca de verificación dice
              lo que la lista significa de verdad. */}
          <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {active.benefits.map((b, i) => (
              <li
                key={i}
                className="flex gap-3 border-t border-line pt-4 text-body-s text-ink-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-brand"
                >
                  <path
                    d="m5 13 4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t(b, lang)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
