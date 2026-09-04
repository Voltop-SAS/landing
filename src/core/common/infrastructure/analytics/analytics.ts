/**
 * CAPA DE ANALYTICS · desacoplada
 * Ver docs/MASTER-PROJECT-DEFINITION.md §31 (plan de medición).
 *
 * El producto emite eventos con nombres estables. La plataforma de destino
 * (GA4, Segment, Plausible, PostHog…) está SIN DEFINIR — decisión abierta O4.
 * Cuando se decida, solo se implementa `dispatch`: ni un componente cambia.
 *
 * Mientras tanto los eventos se encolan en `window.dataLayer` (compatible con
 * GTM y con cualquier consumidor posterior) y, en desarrollo, se registran en
 * consola para poder verificar la instrumentación sin plataforma.
 */

import type { EventName, EventProps } from '~/core/common/domain/entities/AnalyticsEvent'

type QueuedEvent = { event: EventName; props: EventProps }

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

/**
 * Punto ÚNICO de salida. Sustituir el cuerpo por la llamada real al proveedor
 * cuando se resuelva la decisión abierta O4.
 */
function dispatch({ event, props }: QueuedEvent): void {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...props })

  if (process.env.NODE_ENV === 'development') {
    // Permite verificar la instrumentación en el Review Gate sin plataforma.
    console.debug(`[analytics] ${event}`, props)
  }
}

/** Emite un evento del plan de medición. */
export function track(event: EventName, props: EventProps = {}): void {
  dispatch({ event, props })
}
