/** Frequently asked questions for /red. */

import { faq } from '~/core/red/infrastructure/content/faq'
import type { FaqItem } from '~/core/red/domain/entities/FaqItem'

/** Frequently asked questions for /red (§19). */
export function getFaq(): FaqItem[] {
  return faq
}
