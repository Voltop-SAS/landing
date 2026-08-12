"use client";

import { cn } from "@/lib/cn";

/**
 * Botón Voltop — evolucionado desde la guideline actual.
 * Decisiones: radio DUAL (energetic/pill vs structural), UNA flecha contextual,
 * gradiente con DISCIPLINA (usar variant="primary" solo en la acción clave de cada vista),
 * estados Default/Hover/Focus-visible/Press/Loading/Disabled.
 */

type Variant = "primary" | "secondary" | "secondaryNeutral" | "tertiary";
type Size = "l" | "m" | "s" | "xs";
type Shape = "energetic" | "structural";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  /** Muestra flecha → solo cuando la acción implica dirección/continuidad. */
  arrow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 font-medium tracking-tight " +
  "transition-[transform,background-color,border-color,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 select-none";

const sizes: Record<Size, string> = {
  l: "h-13 px-7 text-base",
  m: "h-11 px-6 text-[0.95rem]",
  s: "h-9 px-4 text-sm",
  xs: "h-8 px-3 text-xs",
};

const variants: Record<Variant, string> = {
  primary:
    "brand-gradient text-on-brand font-semibold hover:brightness-105 hover:energy-glow active:bg-brand-press",
  secondary:
    "bg-surface-2 text-ink border border-line-strong hover:bg-surface-3 hover:border-line-strong",
  secondaryNeutral:
    "bg-surface-1 text-ink-2 border border-line hover:text-ink hover:bg-surface-2",
  tertiary: "text-ink-2 hover:text-ink px-1",
};

export function Button({
  children,
  variant = "secondary",
  size = "m",
  shape = "energetic",
  arrow = false,
  loading = false,
  disabled = false,
  href,
  type = "button",
  onClick,
  className,
  ...rest
}: Props) {
  const radius =
    shape === "energetic" ? "rounded-[var(--radius-pill)]" : "rounded-[var(--radius-structural)]";

  const content = (
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
            className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
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

  const classes = cn(base, sizes[size], variants[variant], radius, className);

  if (href && !disabled && !loading) {
    return (
      <a href={href} className={classes} onClick={onClick} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
}
