import type { Localized } from '~/core/common/domain/i18n/config'

export type Case = {
  slug: string
  client: string
  segment: string
  /** Client logo. Empty until we receive the file cleared for use. */
  logo: string | null
  challenge: Localized
  solution: Localized
  /** Quantitative results. Empty while there are no validated figures. */
  results: { value: string; label: Localized }[]
  quote: Localized
  author: string
  role: Localized
  /** Associated station, where applicable. */
  stationSlug?: string
  featured?: boolean
}
