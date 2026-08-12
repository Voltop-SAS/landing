import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * BOTÓN VOLTOP · Server Component
 * Ver docs/MASTER-PROJECT-DEFINITION.md §12 y §24.
 *
 * Decisiones del sistema:
 * - Radio DUAL: `pill` para acciones/energía, `structural` para datos.
 * - UNA flecha contextual (→), solo si la acción implica dirección.
 * - Gradiente con DISCIPLINA: `variant="primary"` es la ÚNICA acción
 *   destacada de cada vista. Si hay dos primarios en una pantalla, uno sobra.
 * - Altura mínima 44px en todos los tamaños salvo `xs` (uso no táctil).
 * - Navegación interna SIEMPRE con next/link (§26).
 */

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "l" | "m" | "s";
type Shape = "pill" | "structural";

type Common = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  arrow?: boolean;
  className?: string;
  "aria-label"?: string;
};

type AsLink = Common & {
  href: string;
  external?: boolean;
  /** Solo para instrumentación del plan de medición. */
  onClick?: () => void;
  type?: never;
  loading?: never;
  disabled?: never;
};
type AsButton = Common & {
  href?: never;
  external?: never;
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 font-medium tracking-tight text-center " +
  "transition-[transform,background-color,border-color,box-shadow,color,opacity] " +
  "duration-(--duration-fast) ease-(--ease-standard) " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 select-none";

/* Altura mínima 44px = touch target accesible (§23). */
const sizes: Record<Size, string> = {
  l: "min-h-13 px-7 text-body",
  m: "min-h-11 px-6 text-body-s",
  s: "min-h-11 px-5 text-body-s",
};

const variants: Record<Variant, string> = {
  primary: "brand-gradient text-on-brand font-semibold hover:brightness-105 hover:energy-glow",
  secondary: "bg-surface-2 text-ink border border-line-strong hover:bg-surface-3",
  ghost: "text-ink border border-line hover:border-line-strong hover:bg-surface-1",
  link: "text-ink-2 hover:text-ink px-0 min-h-11",
};

function Inner({ children, arrow, loading }: { children: React.ReactNode; arrow?: boolean; loading?: boolean }) {
  return (
    <>
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
        {children}
        {arrow && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0 transition-transform duration-(--duration-fast) ease-out group-hover:translate-x-0.5"
          >
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </span>
      )}
    </>
  );
}

export function Button(props: AsLink | AsButton) {
  const {
    children,
    variant = "secondary",
    size = "m",
    shape = "pill",
    arrow = false,
    className,
    ...rest
  } = props;

  const classes = cn(
    base,
    sizes[size],
    variants[variant],
    shape === "pill" ? "rounded-(--radius-pill)" : "rounded-(--radius-structural)",
    className
  );

  if ("href" in rest && rest.href) {
    const { href, external, ...anchorRest } = rest as AsLink;
    if (external) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer" target="_blank" {...anchorRest}>
          <Inner arrow={arrow}>{children}</Inner>
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        <Inner arrow={arrow}>{children}</Inner>
      </Link>
    );
  }

  const { type = "button", loading, disabled, onClick, ...buttonRest } = rest as AsButton;
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonRest}
    >
      <Inner arrow={arrow} loading={loading}>
        {children}
      </Inner>
    </button>
  );
}
