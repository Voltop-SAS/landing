"use client";

import { motion, useReducedMotion } from "motion/react";
import { revealTransition } from "@/lib/motion";

/**
 * Aparición al entrar en viewport.
 *
 * Solo se animan `opacity` y `transform` (§21, regla dura de performance).
 *
 * `data-reveal` no es decorativo: es el enganche de la red de seguridad en CSS
 * (ver globals.css). Motion escribe el estado inicial como estilo en línea, así
 * que el HTML servido lleva `opacity: 0`. Las reglas `scripting: none` y
 * `prefers-reduced-motion` de globals.css lo anulan sin depender del JS, de modo
 * que el contenido NUNCA queda invisible ni inaccesible (§21) — y quien pide
 * menos movimiento lo ve ya en el HTML servido, sin esperar a la hidratación.
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
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={revealTransition(Boolean(reduce), delay)}
    >
      {children}
    </Motion>
  );
}
