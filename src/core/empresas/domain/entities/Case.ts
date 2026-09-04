import type { Localized } from '~/core/common/domain/i18n/config'

export type Case = {
  slug: string
  client: string
  segment: string
  /** Logo del cliente. Vacío hasta recibir el archivo con permiso de uso. */
  logo: string | null
  challenge: Localized
  solution: Localized
  /** Resultados cuantitativos. Vacío mientras no haya cifras validadas. */
  results: { value: string; label: Localized }[]
  quote: Localized
  author: string
  role: Localized
  /** Estación asociada, si aplica. */
  stationSlug?: string
  featured?: boolean
}
