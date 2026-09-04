"use client";

import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "@/lib/motion";

/**
 * TRANSICIÓN ENTRE PÁGINAS.
 *
 * `template.tsx` se remonta en cada navegación, a diferencia de `layout.tsx`.
 * Ahora que la navegación es de cliente (antes cada clic recargaba el
 * documento), la continuidad entre páginas es posible: una entrada breve y
 * sobria que evita el corte seco.
 *
 * Deliberadamente mínima — solo `transform`, y anulada con
 * `prefers-reduced-motion` (§21). No es un efecto: es continuidad espacial.
 *
 * SIN `opacity` A PROPÓSITO. Motion serializa el estado inicial como estilo en
 * línea, así que un `initial={{ opacity: 0 }}` aquí significaba servir la
 * PÁGINA COMPLETA invisible: si el JS fallaba no había sitio, y el elemento
 * LCP (el titular del hero) arrancaba a opacidad 0 y castigaba la métrica.
 * Animar solo el desplazamiento conserva la continuidad sin ese riesgo.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ y: reduce ? 0 : 8 }}
      animate={{ y: 0 }}
      transition={{ duration: reduce ? 0 : duration.base, ease: ease.standard }}
    >
      {children}
    </motion.div>
  );
}
