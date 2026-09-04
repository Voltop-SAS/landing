import type { Localized } from '~/core/common/domain/i18n/config'

export type FaqItem = {
  id: string
  question: Localized
  answer: Localized
  /**
   * Salidas de la respuesta. Es una LISTA porque una pregunta puede tener más
   * de un camino legítimo —"necesito ayuda" se resuelve por WhatsApp o por
   * correo, y elegir por el usuario sería peor— pero se mantienen pocas: una
   * respuesta con cuatro salidas no responde, reparte.
   *
   * `external` cambia dos cosas: el href se usa tal cual (sin prefijo de
   * idioma) y el enlace se abre en pestaña nueva anunciándolo (WCAG 3.2.5).
   */
  links?: { label: Localized; href: string; external?: boolean }[]
}
