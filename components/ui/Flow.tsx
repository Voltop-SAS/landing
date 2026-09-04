"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * FLOW · el material se desplaza dentro de un marco que no se mueve.
 *
 * Es la primitiva de la que sale la PROFUNDIDAD (ver `lib/motion.ts`). Sin
 * ella, una fotografía de fondo es un papel pintado: está detrás, pero no hay
 * nada que diga que está *más lejos*. Con ella, el marco pertenece a la página
 * y la imagen pertenece a otro plano.
 *
 * ── POR QUÉ LA IMAGEN ES MÁS ALTA QUE SU MARCO ────────────────────────────
 * El envoltorio interior mide un 124% del marco y va absoluto. Ese sobrante es
 * lo que permite desplazarlo sin que asome el fondo por arriba o por abajo: el
 * recorrido es de ±6% de su propia altura —un 7.4% del marco— contra un 12% de
 * holgura a cada lado. Sin ese margen, el efecto termina enseñando el borde,
 * que es el fallo clásico de los parallax hechos a ojo.
 *
 * ── SOLO MATERIAL, NUNCA TEXTO ────────────────────────────────────────────
 * Es una regla del sistema, no una preferencia de este componente. Un titular
 * que hace parallax se lee como plantilla; y un dato que se mueve mientras se
 * intenta leer deja de ser un dato y pasa a ser un efecto.
 *
 * ── QUÉ SE ANIMA ──────────────────────────────────────────────────────────
 * Solo `transform`. El desplazamiento se escribe en porcentaje para que el
 * recorrido sea proporcional a la pieza y no un número de píxeles que se
 * queda corto en pantallas grandes y largo en pequeñas.
 *
 * Con `prefers-reduced-motion` el recorrido es 0: el material se queda quieto
 * y la composición no cambia — el marco, el recorte y el encuadre son los
 * mismos, así que no hay ninguna versión "degradada" que mirar.
 */
export function Flow({
  children,
  className,
  /** Recorrido en porcentaje de la altura del material. Ver el cálculo arriba. */
  amount = 6,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /* `start end` → `end start`: el recorrido cubre desde que la pieza asoma por
     abajo hasta que sale por arriba. Medir contra el viewport y no contra la
     propia sección es lo que hace que el desplazamiento sea constante aunque
     la sección sea más alta o más baja que la pantalla. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : [`-${amount}%`, `${amount}%`],
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[12%]">
        {children}
      </motion.div>
    </div>
  );
}
