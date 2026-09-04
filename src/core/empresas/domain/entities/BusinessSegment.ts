import type { Localized } from '~/core/common/domain/i18n/config'

export type BusinessSegment = {
  key: string
  label: Localized
  headline: Localized
  proposition: Localized
  /** Capacidades CONFIRMADAS. Es lo único que se pinta. */
  benefits: Localized[]
  /**
   * Capacidades REDACTADAS PERO NO CONFIRMADAS. No se renderizan.
   *
   * §33 y §19 prohíben publicar como capacidad actual algo que el producto no
   * pueda respaldar hoy. Estas estaban en `benefits` —es decir, publicadas
   * bajo un rótulo que dice "Qué incluye"— y no constan en la única
   * documentación de producto que existe: los Términos y Condiciones, cuyo §4
   * enumera los servicios de la Plataforma (consultar ubicación y
   * disponibilidad, activar por QR, gestionar sesiones e historial, soporte).
   *
   * Se conservan aquí, no se borran: la redacción es buena y el día que
   * producto confirme que existen, se mueven a `benefits` y aparecen. Lo que
   * no puede seguir es presentarlas como un hecho.
   */
  benefitsPorConfirmar?: Localized[]
  /** Referencia a un caso de éxito que sirve de prueba para este segmento. */
  proofRef?: string
}
