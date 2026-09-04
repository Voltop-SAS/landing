import type { Localized } from '~/core/common/domain/i18n/config'

export type BusinessSegment = {
  key: string
  label: Localized
  headline: Localized
  proposition: Localized
  /** CONFIRMED capabilities. These are the only ones rendered. */
  benefits: Localized[]
  /**
   * Capabilities that are WRITTEN BUT NOT CONFIRMED. They are not rendered.
   *
   * §33 and §19 forbid publishing as a current capability anything the product
   * cannot back up today. These used to sit in `benefits` —that is, published
   * under a heading that says "What's included"— and they do not appear in the
   * only product documentation that exists: the Terms and Conditions, whose §4
   * enumerates the Platform's services (look up location and availability,
   * activate by QR, manage sessions and history, support).
   *
   * They are kept here rather than deleted: the wording is good, and the day
   * product confirms they exist they move to `benefits` and show up. What
   * cannot continue is presenting them as fact.
   */
  benefitsUnconfirmed?: Localized[]
  /** Reference to a case study that serves as proof for this segment. */
  proofRef?: string
}
