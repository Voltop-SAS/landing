"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { COUNT_DURATION, ease } from "@/lib/motion";

/**
 * CIFRA QUE CUENTA AL ENTRAR EN PANTALLA
 * Ver docs/MASTER-PROJECT-DEFINITION.md §21 y §29.
 *
 * ── EL VALOR FINAL YA ESTÁ EN EL HTML SERVIDO ────────────────────────────
 * El servidor pinta la cifra definitiva. Si el JS no llega, si falla, o si un
 * buscador lee la página, ahí está el número — no un cero ni un hueco. El
 * conteo es un añadido sobre contenido que ya funciona, que es la única forma
 * honesta de animar un dato.
 *
 * El arranque en cero se escribe en `useLayoutEffect` (vía `useEffect` con
 * escritura directa al nodo antes del primer pintado observable): así no se ve
 * el destello del valor final seguido de un salto a cero.
 *
 * ── SIN `useState` ───────────────────────────────────────────────────────
 * Contar con estado provoca un render por fotograma: a 60fps son 60 renders de
 * React para mover un texto. Aquí se escribe directamente en el nodo con una
 * referencia, que es lo que hace que sea fluido también en gama baja (§29).
 *
 * ── REDUCED MOTION ───────────────────────────────────────────────────────
 * No se degrada la animación: se OMITE. La cifra ya está puesta, así que no
 * hay nada que hacer y nada que pueda quedar invisible.
 */
export function CountUp({
  value,
  className,
  /** Sufijo que no se anima (por ejemplo una unidad). */
  suffix = "",
}: {
  value: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const enVista = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();
  const yaCorrio = useRef(false);

  useEffect(() => {
    if (reduce || !enVista || yaCorrio.current) return;
    const nodo = ref.current;
    if (!nodo) return;
    yaCorrio.current = true;

    const controles = animate(0, value, {
      duration: COUNT_DURATION,
      ease: ease.standard,
      onUpdate: (v) => {
        nodo.textContent = `${Math.round(v)}${suffix}`;
      },
      /* Pase lo que pase, el nodo termina con el valor exacto: el redondeo del
         último fotograma no puede dejar la cifra a uno de distancia. */
      onComplete: () => {
        nodo.textContent = `${value}${suffix}`;
      },
    });
    return () => controles.stop();
  }, [enVista, reduce, value, suffix]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
