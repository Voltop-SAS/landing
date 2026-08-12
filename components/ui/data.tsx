import { cn } from "@/lib/cn";
import { t, type Locale } from "@/lib/i18n/config";
import { stationStatus } from "@/content/copy/common";
import type { StationStatus } from "@/content/data/stations";
import type { Metric } from "@/content/data/company";

/**
 * PRIMITIVAS DE DATO
 * El tratamiento técnico de los datos (mono + hairlines + precisión) es el
 * lenguaje visual más propio de Voltop. Se sistematiza aquí en lugar de
 * repetirse suelto por los componentes.
 */

/* ------------------------------------------------------------------ */
/* Estado de estación — colores desde tokens semánticos, sin literales */
/* ------------------------------------------------------------------ */

const statusTone: Record<StationStatus, string> = {
  operativa: "text-live",
  proxima: "text-idle",
  mantenimiento: "text-warn",
};

export function StatusBadge({
  status,
  lang,
  className,
}: {
  status: StationStatus;
  lang: Locale;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono text-mono", statusTone[status], className)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {t(stationStatus[status], lang)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Especificación técnica                                              */
/* ------------------------------------------------------------------ */

export function SpecList({
  items,
  className,
}: {
  items: { label: string; value: string; note?: string }[];
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2", className)}>
      {items.map((item) => (
        <div key={item.label} className="bg-canvas p-5">
          <dt className="font-mono text-mono uppercase text-ink-3">{item.label}</dt>
          <dd className="mt-2 font-display text-display-s text-ink">{item.value}</dd>
          {item.note && <p className="mt-1 text-caption text-ink-3">{item.note}</p>}
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Métricas                                                            */
/* ------------------------------------------------------------------ */

/**
 * Muestra métricas SOLO si están validadas. Nunca inventa un número ni pinta
 * un placeholder con aspecto de cifra (§33: la economía de placeholders es
 * parte de la credibilidad).
 *
 * Si ninguna está validada, devuelve `null` y la página muestra en su lugar
 * el estado honesto que le corresponda.
 */
export function MetricRow({
  metrics,
  lang,
  className,
}: {
  metrics: Metric[];
  lang: Locale;
  className?: string;
}) {
  const valid = metrics.filter((m) => m.validated && m.value);
  if (valid.length === 0) return null;

  return (
    <dl className={cn("flex flex-wrap gap-x-12 gap-y-8", className)}>
      {valid.map((m) => (
        <div key={m.key}>
          <dt className="sr-only">{t(m.label, lang)}</dt>
          <dd className="font-display text-display-l text-ink">
            {m.value}
            {m.unit && <span className="ml-1 align-top font-mono text-mono text-brand">{m.unit}</span>}
          </dd>
          <p className="mt-1 text-body-s text-ink-3">{t(m.label, lang)}</p>
        </div>
      ))}
    </dl>
  );
}

/** Etiqueta de dato provisional. Cumple contraste AA. */
export function PendingTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-warn/40 px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wider text-warn">
      {children}
    </span>
  );
}
