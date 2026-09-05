/** Frequently asked questions for /red. */

import { faq } from '~/core/network/infrastructure/content/faq'
import type { FaqItem } from '~/core/network/domain/entities/FaqItem'

/** Frequently asked questions for /red (§19). */
export function getFaq(): FaqItem[] {
  return faq
}
