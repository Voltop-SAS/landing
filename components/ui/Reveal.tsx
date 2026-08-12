"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Aparición al entrar en viewport.
 *
 * Con `prefers-reduced-motion` la duración es 0: el contenido aparece de
 * inmediato pero NUNCA queda invisible ni inaccesible (§21).
 * Solo se animan `opacity` y `transform` (§21, regla dura de performance).
 */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const Motion = motion[as];

  return (
    <Motion
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: reduce ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : delay,
      }}
    >
      {children}
    </Motion>
  );
}
