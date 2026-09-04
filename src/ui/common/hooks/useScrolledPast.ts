'use client'

import { useEffect, useState } from 'react'

/**
 * ¿ESTE ELEMENTO YA QUEDÓ POR ENCIMA DE LA PANTALLA?
 *
 * `whileInView` se apoya en `IntersectionObserver`, y un observador solo
 * informa de lo que intersecta AHORA. Si la página arranca con el scroll a
 * media altura —recargar restaura la posición, y un enlace con ancla aterriza
 * directamente abajo— todo lo que queda por encima no intersecta nunca, así
 * que no se revela nunca.
 *
 * Medido antes de arreglarlo: recargando a 5400px quedaban ONCE bloques a
 * opacidad 0 —el índice de ciudades, los cuatro segmentos de empresas y las
 * tres novedades— y seguían invisibles al volver a subir. No es un detalle de
 * animación: es contenido que desaparece, que es justo lo que §21 prohíbe.
 *
 * La comprobación se hace una vez al montar. Si el elemento ya pasó, se
 * renderiza sin animación: no hay nada que revelar de algo que el usuario ya
 * dejó atrás, y como está fuera de pantalla tampoco hay parpadeo que ver.
 */
export function useScrolledPast(ref: React.RefObject<HTMLElement | null>) {
  const [pasado, setPasado] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    /* `bottom < 0`: el elemento entero quedó por encima del borde superior.
       Lo que está parcialmente visible SÍ lo ve el observador, así que no
       necesita este atajo. */
    if (el.getBoundingClientRect().bottom < 0) setPasado(true)
  }, [ref])

  return pasado
}
