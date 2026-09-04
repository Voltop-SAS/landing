import { cn } from '@ui/common/lib/cn'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { stationStatus } from '~/core/common/domain/consts/copy'
import type { StationStatus } from '~/core/red/domain/entities/Station'
import type { Metric } from '~/core/common/domain/entities/Metric'

/**
 * DATA PRIMITIVES
 * The technical treatment of data (mono + hairlines + precision) is Voltop's
 * most distinctive visual language. It is systematised here instead of being
 * scattered loose across the components.
 */

/* ------------------------------------------------------------------ */
/* Station status — colours from semantic tokens, no literals          */
/* The keys stay in Spanish: they are stored data values (see AGENTS.md) */
/* ------------------------------------------------------------------ */

const statusTone: Record<StationStatus, string> = {
  operativa: 'text-live',
  proxima: 'text-idle',
  mantenimiento: 'text-warn',
}

export function StatusBadge({
  status,
  locale,
  className,
}: {
  status: StationStatus
  locale: Locale
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-mono',
        statusTone[status],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-current"
      />
      {t(stationStatus[status], locale)}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Technical specification                                             */
/* ------------------------------------------------------------------ */

/**
 * `tone` distinguishes FIGURE from TEXT, and it is not cosmetic.
 *
 * Every value used to be painted at `display-s` (24px). With four columns that
 * made "Lunes a domingo, 6:00–22:00" wrap onto three lines, stretched the row
 * to 150px and left the other three values floating vertically: the grid lost
 * the spec-sheet feel that justifies the component.
 *
 * A power rating and a number of points ARE the data and deserve display
 * scale. Opening hours or a list of connectors are text and read better at
 * body size.
 */
type SpecTone = 'number' | 'text'

const specTone: Record<SpecTone, string> = {
  number: 'font-display text-display-s text-ink',
  text: 'text-body text-ink',
}

export function SpecList({
  items,
  className,
}: {
  items: { label: string; value: string; note?: string; tone?: SpecTone }[]
  className?: string
}) {
  return (
    <dl
      className={cn(
        'grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2',
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-canvas p-5"
        >
          <dt className="font-mono text-mono uppercase text-ink-3">{item.label}</dt>
          <dd className={cn('mt-2', specTone[item.tone ?? 'number'])}>{item.value}</dd>
          {item.note && <p className="mt-1 text-caption text-ink-3">{item.note}</p>}
        </div>
      ))}
    </dl>
  )
}

/* ------------------------------------------------------------------ */
/* Metrics                                                             */
/* ------------------------------------------------------------------ */

/**
 * Shows metrics ONLY if they are validated. It never invents a number and
 * never paints a placeholder that looks like a figure (§33: placeholder
 * economy is part of credibility).
 *
 * If none are validated it returns `null`, and the page shows whichever honest
 * state belongs there instead.
 */
export function MetricRow({
  metrics,
  locale,
  className,
}: {
  metrics: Metric[]
  locale: Locale
  className?: string
}) {
  const valid = metrics.filter((m) => m.validated && m.value)
  if (valid.length === 0) return null

  return (
    <dl className={cn('flex flex-wrap gap-x-12 gap-y-8', className)}>
      {valid.map((m) => (
        <div key={m.key}>
          <dt className="sr-only">{t(m.label, locale)}</dt>
          <dd className="font-display text-display-l text-ink">
            {m.value}
            {m.unit && (
              <span className="ml-1 align-top font-mono text-mono text-brand">{m.unit}</span>
            )}
          </dd>
          <p className="mt-1 text-body-s text-ink-3">{t(m.label, locale)}</p>
        </div>
      ))}
    </dl>
  )
}

/**
 * Provisional data tag. The text meets AA (10.15:1) and the border moves to
 * `warn/50` to meet 1.4.11: at `warn/40` it gave 2.52:1, below 3:1.
 */
export function PendingTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-warn/50 px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wider text-warn">
      {children}
    </span>
  )
}
