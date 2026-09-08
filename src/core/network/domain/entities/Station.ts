/**
 * The station as an entity: what it is, which states it can be in and how its
 * power output is expressed. `formatPowerKw` lives here and not next to the
 * dataset because it is a pure function over the entity —no dependencies— and
 * three presentation files consume it, which keeps them touching only domain.
 */

import type { Localized } from '~/core/common/domain/i18n/config'

export type Connector = 'CCS1' | 'CCS2' | 'GB/T' | 'Type2'
export type StationStatus = 'operativa' | 'proxima' | 'mantenimiento'

export type StationMedia = {
  /** Station photographs. Empty = not delivered yet. */
  photos: { src: string; alt: Localized }[]
  /** The station's own video, if there is one. */
  video?: { src: string; poster: string; duration: string; caption: Localized }
}

export type Station = {
  slug: string
  /** Proper noun: not translated. */
  name: string
  /** Reference to a city slug. Never free text. */
  citySlug: string
  address: Localized
  /** Coordinates. `null` until we receive them: they are not made up. */
  geo: { lat: number; lng: number } | null
  connectors: Connector[]
  /**
   * Power output in kW. It is a RANGE because a station can have chargers of
   * differing power —the EAN one goes from 22 to 80— and publishing only the
   * maximum would claim that every point charges at 80, which is exactly the
   * kind of promise §19 does not allow. When every point is the same,
   * `min === max`.
   */
  powerKw: { min: number; max: number }
  points: number
  status: StationStatus
  hours: Localized
  /**
   * The same opening hours, in the format schema.org understands
   * (`Mo-Su 00:00-23:59`). `null` when they are not fixed.
   *
   * It is a SECOND field and not a derivation of `hours`, which is display
   * text: matching a Spanish string to decide what to tell a search engine
   * would break the day someone writes "24 horas" instead of "24/7". A station
   * whose hours are not fixed says nothing rather than guessing — the same rule
   * the rest of the dataset follows with its nulls.
   */
  openingHours: string | null
  /** Pricing. `null` while it is not commercially confirmed. */
  pricing: { perKwh: number; currency: string } | null
  services: Localized[]
  media: StationMedia
  /** Curation: shows up in previews and highlights. */
  featured?: boolean
  /** Data provenance. Nothing is presented as verified unless it is. */
  dataStatus: 'placeholder' | 'verified'
}

/**
 * Power output formatting. It exists so that "22–80 kW" is written ONCE: six
 * components render it and with six separate templates they would drift apart.
 * When every point is the same it shows a single figure, because "30–30 kW"
 * does not inform, it confuses.
 */
export function formatPowerKw(p: { min: number; max: number }): string {
  return p.min === p.max ? `${p.max} kW` : `${p.min}–${p.max} kW`
}
