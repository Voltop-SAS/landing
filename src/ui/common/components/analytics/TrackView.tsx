'use client'

import { useEffect, useRef } from 'react'
import { track, type EventName, type EventProps } from '~/core/common/infrastructure/analytics'

/**
 * Emite un evento cuando su contenido ENTRA EN VISTA, una sola vez.
 *
 * Existe porque el plan de medición (§31) declaraba diecisiete eventos y seis no
 * se emitían nunca: `ciudad_vista`, `caso_visto`, `impacto_visto` y compañía.
 * Todos son eventos de VISTA sobre páginas que son Server Components, así que
 * hacían falta islas de cliente mínimas.
 *
 * No renderiza nada propio: envuelve. `once` de verdad — un contador que se
 * dispara cada vez que el bloque cruza el viewport no mide interés, mide scroll.
 */
export function TrackView({
  event,
  props,
  children,
  /** `0.5` = medio bloque visible. Para páginas completas, `0`. */
  threshold = 0.5,
}: {
  event: EventName
  props?: EventProps
  children?: React.ReactNode
  threshold?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const sent = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || sent.current) return

    /* Sin IntersectionObserver el evento se emite igual: perder la medición es
       peor que medirla sin umbral. */
    if (typeof IntersectionObserver === 'undefined') {
      sent.current = true
      track(event, props)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !sent.current) {
          sent.current = true
          track(event, props)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, threshold])

  return <div ref={ref}>{children}</div>
}
