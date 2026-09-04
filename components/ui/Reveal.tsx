'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { depthMotion, type DepthLevel } from '@ui/common/lib/motion'
import { useScrolledPast } from '@ui/common/hooks/useScrolledPast'

/**
 * DEPTH · el contenido llega desde el fondo.
 *
 * Es el gesto base del sistema (ver `lib/motion.ts`). Sustituye al
 * `fade + translateY` anterior, que es el reveal por defecto de cualquier
 * plantilla: se percibía como "la página se ha cargado", no como una decisión.
 * Escala más desplazamiento leen como PROFUNDIDAD, que es el concepto que sí
 * pertenece a Voltop —recorrer una instalación— sin representar literalmente
 * nada eléctrico.
 *
 * Solo se animan `opacity` y `transform` (§21, regla dura de performance).
 *
 * ── EL ESCALONADO SE PIDE POR ÍNDICE, NO POR RETARDO ──────────────────────
 * Antes cada lista pasaba su propio `delay={i * 0.0x}` y había cuatro ritmos
 * distintos en el sitio. Ahora se pasa la POSICIÓN y el sistema decide el
 * tiempo: un solo ritmo, y ninguna lista puede desviarse sin que se note.
 *
 * ── LA INTENSIDAD BAJA SOLA EN MÓVIL ──────────────────────────────────────
 * `expressive` mueve 24px y escala desde 0.9. En una tarjeta con `.glass` eso
 * significa recomponer un `backdrop-filter` en cada fotograma, y en un teléfono
 * de gama media eso es lo que convierte una animación en un tirón. Por debajo
 * de 768px el nivel cae a `standard` por sí solo: la coreografía se mantiene,
 * el coste no. Es la degradación elegante que pide el mapa, decidida aquí y no
 * en cada componente.
 *
 * ── DOS REDES DE SEGURIDAD, NO UNA ────────────────────────────────────────
 * 1. `data-reveal` engancha las reglas de `globals.css`: Motion escribe el
 *    estado inicial como estilo en línea, así que el HTML servido lleva
 *    `opacity: 0`. Con `scripting: none` o `prefers-reduced-motion` el CSS lo
 *    anula sin depender del JS.
 * 2. `useScrolledPast` cubre el caso que el CSS no puede ver: recargar a media
 *    página dejaba once bloques invisibles PARA SIEMPRE, porque un observador
 *    de intersección no informa de lo que ya quedó arriba. Ver su cabecera.
 */
export function Reveal({
  children,
  level = 'standard',
  index = 0,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  /** `expressive` se reserva a los beats narrativos. Ver el mapa de intensidad. */
  level?: DepthLevel
  /** Posición en la lista. El sistema la convierte en retardo. */
  index?: number
  className?: string
  as?: 'div' | 'li' | 'span'
}) {
  const reduce = useReducedMotion()
  /* `HTMLElement` y no `HTMLDivElement`: `as` puede ser div, li o span, y un
     ref tipado al más específico no encaja en los tres. */
  const ref = useRef<HTMLElement>(null)
  const yaPasado = useScrolledPast(ref)
  const [compacto, setCompacto] = useState(false)
  const Motion = motion[as]

  /* Se resuelve DESPUÉS de montar: en servidor no hay `matchMedia`, y leerlo
     durante el render rompería la hidratación. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const leer = () => setCompacto(mq.matches)
    leer()
    mq.addEventListener('change', leer)
    return () => mq.removeEventListener('change', leer)
  }, [])

  /* Ya lo dejó atrás: se muestra y punto. Animar la entrada de algo que está
     fuera de pantalla no lo ve nadie, y esperar a que intersecte —cosa que no
     va a pasar— es lo que lo dejaba invisible. */
  if (yaPasado) {
    return (
      <Motion
        ref={ref as React.Ref<HTMLDivElement & HTMLLIElement & HTMLSpanElement>}
        className={className}
      >
        {children}
      </Motion>
    )
  }

  const efectivo: DepthLevel = compacto && level === 'expressive' ? 'standard' : level

  return (
    <Motion
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement & HTMLSpanElement>}
      className={className}
      {...depthMotion(efectivo, Boolean(reduce), index)}
    >
      {children}
    </Motion>
  )
}
