import type { Localized } from '~/core/common/domain/i18n/config'

export type City = {
  slug: string
  /** Nombre propio: no se traduce. */
  name: string
  region: string
  /** Contexto local. Nunca incluye cifras sin validar. */
  intro: Localized
  featured?: boolean
}
