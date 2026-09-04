'use client'

import { useRef, useState } from 'react'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { empresas } from '~/core/business/domain/consts/copy'
import type { BusinessSegment } from '~/core/business/domain/entities/BusinessSegment'
import { track } from '~/core/common/infrastructure/analytics'
import { SectionHeading } from '@ui/common/components/ui/LayoutPrimitives'
import { cn } from '@ui/common/lib/cn'

/**
 * B2B CASE SELECTOR · COMPLETE tabs pattern
 * See docs/MASTER-PROJECT-DEFINITION.md §23.
 *
 * The previous version declared `role="tab"` with no `tabpanel`, no
 * `aria-controls` and no arrow-key navigation: an incomplete ARIA pattern
 * degrades things more than adding no ARIA at all. Here it is complete —
 * roving tabindex, arrow keys, Home/End, an associated panel and touch
 * targets ≥44px.
 *
 * The chosen segment is reported upwards to pre-fill the form.
 */
export function SegmentSelector({
  locale,
  segments,
  onChange,
  activeKey,
}: {
  locale: Locale
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
      {/* ── A TAB, NOT A CHIP ──────────────────────────────────────────────
          This and the /red filters used to be visually IDENTICAL —pill, brand
          border, faint fill— for two opposite semantics: filtering a list
          versus switching a view. And nothing indicated there was a panel
          below that changes.

          The tab is now a proper tab: it sits on the same line that separates
          the panel, and the active one interrupts that line with a brand bar.
          The connection between the control and its content is visual, not
          merely declared in ARIA. */}
      <div
        role="tablist"
        aria-label={t(empresas.selector.title, locale)}
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
              {t(s.label, locale)}
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
            {t(active.headline, locale)}
          </SectionHeading>
          <p className="mt-5 measure text-body-l text-ink-2">{t(active.proposition, locale)}</p>

          <SectionHeading
            as="h3"
            size="s"
            className="mt-12"
          >
            {t(empresas.selector.benefitsTitle, locale)}
          </SectionHeading>
          {/* "What's included" is a list of INCLUSION, not a sequence: the
              number promised an order that does not exist. The check mark says
              what the list actually means. */}
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
                {t(b, locale)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
