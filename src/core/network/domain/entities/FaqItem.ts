import type { Localized } from '~/core/common/domain/i18n/config'

export type FaqItem = {
  id: string
  question: Localized
  answer: Localized
  /**
   * Ways out of the answer. It is a LIST because one question can have more
   * than one legitimate path —"I need help" is resolved over WhatsApp or over
   * email, and choosing on the user's behalf would be worse— but they are kept
   * few: an answer with four ways out does not answer, it redistributes.
   *
   * `external` changes two things: the href is used as-is (no locale prefix)
   * and the link opens in a new tab, announcing that it does (WCAG 3.2.5).
   */
  links?: { label: Localized; href: string; external?: boolean }[]
}
