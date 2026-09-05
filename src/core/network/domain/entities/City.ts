import type { Localized } from '~/core/common/domain/i18n/config'

export type City = {
  slug: string
  /** Proper noun: not translated. */
  name: string
  region: string
  /** Local context. Never carries unvalidated figures. */
  intro: Localized
  featured?: boolean
}
