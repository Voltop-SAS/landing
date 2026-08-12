"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * TRANSICIÓN ENTRE PÁGINAS.
 *
 * `template.tsx` se remonta en cada navegación, a diferencia de `layout.tsx`.
 * Ahora que la navegación es de cliente (antes cada clic recargaba el
 * documento), la continuidad entre páginas es posible: una entrada breve y
 * sobria que evita el corte seco.
 *
 * Deliberadamente mínima — solo `opacity` y `transform`, y anulada con
 * `prefers-reduced-motion` (§21). No es un efecto: es continuidad espacial.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
