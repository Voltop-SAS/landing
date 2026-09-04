import { cn } from '@ui/common/lib/cn'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { stationStatus } from '~/core/common/domain/consts/copy'
import type { StationStatus } from '@/content/data/stations'
import type { Metric } from '@/content/data/company'

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
  operativa: 'text-live',
  proxima: 'text-idle',
  mantenimiento: 'text-warn',
}

export function StatusBadge({
  status,
  lang,
  className,
}: {
  status: StationStatus
  lang: Locale
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
      {t(stationStatus[status], lang)}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Especificación técnica                                              */
/* ------------------------------------------------------------------ */

/**
 * `tone` distingue CIFRA de TEXTO, y no es cosmético.
 *
 * Todos los valores se pintaban a `display-s` (24px). Con cuatro columnas eso
 * hacía que "Lunes a domingo, 6:00–22:00" envolviera en tres líneas, estirara
 * la fila a 150px y dejara los otros tres valores flotando en vertical: la
 * cuadrícula perdía el aire de ficha técnica que justifica el componente.
 *
 * Una potencia y un número de puntos SON el dato y merecen escala de display.
 * Un horario o una lista de conectores son texto y se leen mejor en cuerpo.
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
  metrics: Metric[]
  lang: Locale
  className?: string
}) {
  const valid = metrics.filter((m) => m.validated && m.value)
  if (valid.length === 0) return null

  return (
    <dl className={cn('flex flex-wrap gap-x-12 gap-y-8', className)}>
      {valid.map((m) => (
        <div key={m.key}>
          <dt className="sr-only">{t(m.label, lang)}</dt>
          <dd className="font-display text-display-l text-ink">
            {m.value}
            {m.unit && (
              <span className="ml-1 align-top font-mono text-mono text-brand">{m.unit}</span>
            )}
          </dd>
          <p className="mt-1 text-body-s text-ink-3">{t(m.label, lang)}</p>
        </div>
      ))}
    </dl>
  )
}

/**
 * Etiqueta de dato provisional. El texto cumple AA (10.15:1) y el borde pasa a
 * `warn/50` para cumplir 1.4.11: a `warn/40` daba 2.52:1, por debajo de 3:1.
 */
export function PendingTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-warn/50 px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wider text-warn">
      {children}
    </span>
  )
}
