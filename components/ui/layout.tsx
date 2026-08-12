import { cn } from "@/lib/cn";

/**
 * PRIMITIVAS DE ESTRUCTURA · Server Components
 * Ver docs/MASTER-PROJECT-DEFINITION.md §12 y §24.
 *
 * El ritmo de página se construye combinando `width` y `space`.
 * REGLA: dos secciones consecutivas no pueden compartir la misma combinación.
 */

type Width = "content" | "narrow" | "wide" | "full";

const widths: Record<Width, string> = {
  narrow: "max-w-(--container-narrow)",
  content: "max-w-(--container-content)",
  wide: "max-w-(--container-wide)",
  full: "max-w-none",
};

export function Container({
  children,
  width = "content",
  className,
}: {
  children: React.ReactNode;
  width?: Width;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full px-(--spacing-gutter)", widths[width], className)}>
      {children}
    </div>
  );
}

type Space = "tight" | "base" | "loose" | "none";
type Register = "silencio" | "impacto";

const spaces: Record<Space, string> = {
  none: "",
  tight: "py-(--spacing-section-tight)",
  base: "py-(--spacing-section)",
  loose: "py-(--spacing-section-loose)",
};

/**
 * Sección con registro visual e intensidad de ritmo explícitos.
 * - `silencio`: estructural, plano, editorial. Deja respirar la información.
 * - `impacto`: energía y textura. Reservado a los puntos narrativos clave.
 */
export function Section({
  id,
  children,
  register = "silencio",
  space = "base",
  className,
  as: Tag = "section",
  ariaLabelledby,
}: {
  id?: string;
  children: React.ReactNode;
  register?: Register;
  space?: Space;
  className?: string;
  as?: "section" | "div" | "article";
  ariaLabelledby?: string;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(
        "relative scroll-mt-24",
        spaces[space],
        register === "impacto" && "grain overflow-hidden",
        className
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Antetítulo. Sin punto de gradiente: el gradiente es señal, no decoración
 * repetida en cada sección (§12, disciplina del gradiente).
 */
export function Eyebrow({
  children,
  className,
  tone = "muted",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "muted" | "brand";
}) {
  return (
    <p
      className={cn(
        "font-mono text-eyebrow uppercase",
        tone === "brand" ? "text-brand" : "text-ink-3",
        className
      )}
    >
      {children}
    </p>
  );
}

/** Línea divisoria estructural — el lenguaje de "ficha técnica" de Voltop. */
export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}
