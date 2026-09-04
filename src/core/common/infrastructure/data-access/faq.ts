/** Preguntas frecuentes de /red. */

import { faq } from '~/core/red/infrastructure/content/faq'
import type { FaqItem } from '~/core/red/domain/entities/FaqItem'

/** Preguntas frecuentes de /red (§19). */
export function getFaq(): FaqItem[] {
  return faq
}
