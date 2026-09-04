/**
 * A publishable figure.
 *
 * It lives in `common` rather than in the "about" module because what renders
 * it is `MetricRow`, a shared primitive: if the type lived in a business
 * module, `src/ui/common` would have to import that module's domain just to
 * draw a row.
 *
 * `validated: false` means there is NO real figure behind it. The UI decides
 * how to represent that; it never invents one (§33).
 */

import type { Localized } from '~/core/common/domain/i18n/config'

export type Metric = {
  key: string
  /** The real value. `null` until validated: it is never made up. */
  value: string | null
  unit: string | null
  label: Localized
  /** Where the figure comes from, for traceability once validated. */
  source: string | null
  validated: boolean
  /** Curation: which ones lead when only two fit. */
  featured?: boolean
}
