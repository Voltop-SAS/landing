import type { Localized } from '~/core/common/domain/i18n/config'

export type Testimonial = {
  quote: Localized
  author: string
  role: Localized
  organization: string | null
  photo: string | null
  segment: 'b2c' | 'b2b'
}
