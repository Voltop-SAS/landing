"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1240px] px-6 md:px-10", className)}>
      {children}
    </div>
  );
}

/**
 * Sección con registro visual: "silencio" (base, plana) o "impacto" (energía).
 * El ritmo de la página alterna ambos.
 */
export function Section({
  id,
  children,
  register = "silencio",
  className,
}: {
  id?: string;
  children: React.ReactNode;
  register?: "silencio" | "impacto";
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-24 md:py-32",
        register === "impacto" && "grain overflow-hidden",
        className
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-3">
      <span className="size-1.5 rounded-full brand-gradient" aria-hidden="true" />
      {children}
    </span>
  );
}

/** Reveal al hacer scroll (respeta prefers-reduced-motion). */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  // initial constante en SSR/cliente (evita hydration mismatch). reduced-motion → aparece instantáneo (nunca invisible).
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

/** Marca de contenido PROVISIONAL (requisito: identificar placeholders). */
export function PlaceholderTag({ label = "Placeholder" }: { label?: string }) {
  return (
    <span
      className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-dashed border-brand/50 bg-canvas/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand backdrop-blur"
      title="Contenido provisional — a reemplazar con asset final"
    >
      {label}
    </span>
  );
}

/** Placeholder de VIDEO (poster + affordance de play), marcado provisional. Full-bleed capable. */
export function VideoPlaceholder({
  label,
  duration,
  className,
}: {
  label: string;
  duration?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-surface-1",
        className
      )}
    >
      <span
        className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-dashed border-brand/50 bg-canvas/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand backdrop-blur"
        title="Video pendiente — a reemplazar con asset final"
      >
        Video · placeholder
      </span>
      {/* patrón sutil de fondo */}
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.10]"
        style={{ backgroundImage: "repeating-linear-gradient(115deg, var(--color-ink-3) 0 1px, transparent 1px 22px)" }}
      />
      <div className="relative flex flex-col items-center gap-3 text-center">
        <span className="grid size-16 place-items-center rounded-full border border-line-strong bg-canvas/50 backdrop-blur">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 5v14l11-7z" fill="var(--color-brand)" />
          </svg>
        </span>
        <span className="max-w-md px-6 font-mono text-xs text-ink-3">
          {label}
          {duration && <span className="text-ink-3/70"> · {duration}</span>}
        </span>
      </div>
    </div>
  );
}

/** Placeholder de imagen/video con marca de provisional. */
export function PlaceholderMedia({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-[var(--radius-structural)] border border-line bg-surface-1",
        className
      )}
    >
      <PlaceholderTag label="Asset pendiente" />
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-ink-3) 0 1px, transparent 1px 16px)",
        }}
      />
      <span className="relative px-6 text-center font-mono text-xs text-ink-3">
        {label}
      </span>
      {children}
    </div>
  );
}
