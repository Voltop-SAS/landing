"use client";

import { useRef, useState } from "react";
import { t, type Locale } from "@/lib/i18n/config";
import { empresas } from "@/content/copy/empresas";
import type { BusinessSegment } from "@/content/data/company";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

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
  lang: Locale;
  segments: BusinessSegment[];
  activeKey: string;
  onChange: (key: string) => void;
}) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState(0);

  const activeIndex = Math.max(0, segments.findIndex((s) => s.key === activeKey));
  const active = segments[activeIndex];

  const select = (index: number) => {
    const seg = segments[index];
    if (!seg) return;
    onChange(seg.key);
    setFocusIndex(index);
    tabsRef.current[index]?.focus();
    track("empresas_selector_caso", { segmento: seg.key });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = segments.length - 1;
    const map: Record<string, number> = {
      ArrowRight: focusIndex === last ? 0 : focusIndex + 1,
      ArrowLeft: focusIndex === 0 ? last : focusIndex - 1,
      Home: 0,
      End: last,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={t(empresas.selector.title, lang)}
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2"
      >
        {segments.map((s, i) => {
          const isActive = s.key === activeKey;
          return (
            <button
              key={s.key}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              id={`tab-${s.key}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`panel-${s.key}`}
              tabIndex={i === focusIndex ? 0 : -1}
              onClick={() => select(i)}
              className={cn(
                "inline-flex min-h-11 items-center rounded-(--radius-pill) border px-5 text-body-s transition-colors",
                isActive
                  ? "border-brand/60 bg-brand/12 text-ink"
                  : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
              )}
            >
              {t(s.label, lang)}
            </button>
          );
        })}
      </div>

      {active && (
        <div
          id={`panel-${active.key}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.key}`}
          tabIndex={0}
          className="mt-10 border-t border-line pt-10"
        >
          <h3 className="max-w-[22ch] font-display text-display-m font-semibold text-ink">
            {t(active.headline, lang)}
          </h3>
          <p className="mt-5 measure text-body-l text-ink-2">{t(active.proposition, lang)}</p>

          <h4 className="mt-10 font-mono text-mono uppercase tracking-wider text-ink-3">
            {t(empresas.selector.benefitsTitle, lang)}
          </h4>
          <ul className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {active.benefits.map((b, i) => (
              <li key={i} className="flex gap-3 border-t border-line pt-4 text-body-s text-ink-2">
                <span aria-hidden="true" className="font-mono text-mono text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(b, lang)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
