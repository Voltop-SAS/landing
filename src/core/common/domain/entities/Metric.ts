/**
 * Una cifra publicable.
 *
 * Vive en `common` y no en `nosotros` porque quien la renderiza es `MetricRow`,
 * un primitivo compartido: si el tipo viviera en un módulo de negocio,
 * `src/ui/common` tendría que importar el dominio de ese módulo para pintar
 * una fila.
 *
 * `validated: false` significa que NO hay cifra real detrás. La UI decide cómo
 * representarlo; nunca la inventa (§33).
 */

import type { Localized } from '~/core/common/domain/i18n/config'

export type Metric = {
  key: string
  /** Valor real. `null` mientras no esté validado: no se inventa. */
  value: string | null
  unit: string | null
  label: Localized
  /** Fuente del dato, para trazabilidad cuando se valide. */
  source: string | null
  validated: boolean
  /** Curaduría: cuáles se destacan cuando solo caben dos. */
  featured?: boolean
}
