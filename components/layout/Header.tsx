"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { nav, headerCta, a11y, brand } from "@/content/copy/common";
import { Button } from "@/components/ui/Button";
import { LangSwitch } from "@/components/layout/LangSwitch";
import { Logo } from "@/components/layout/Logo";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * HEADER
 * Ver docs/MASTER-PROJECT-DEFINITION.md §15.
 *
 * - UN solo CTA global, CONTEXTUAL por ruta. En /red no hay CTA: el usuario ya
 *   está en la herramienta. En /empresas muta a conversión comercial.
 * - Menú móvil a pantalla completa con cierre por Escape, foco atrapado,
 *   bloqueo de scroll y objetivos táctiles ≥44px (§23).
 */

export function Header({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  /**
   * El menú se abre "para una ruta". Al navegar cambia `pathname` y el menú se
   * cierra por derivación, sin efecto ni renders en cascada.
   */
  const [openedFor, setOpenedFor] = useState<string | null>(null);
  const open = openedFor === pathname;
  const setOpen = (next: boolean) => setOpenedFor(next ? pathname : null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Contexto de ruta → CTA contextual */
  const path = pathname.replace(/^\/(es|en)/, "") || "/";
  const context = path.startsWith(routes.red)
    ? "red"
    : path.startsWith(routes.empresas)
      ? "empresas"
      : path.startsWith(routes.nosotros)
        ? "nosotros"
        : "home";
  const cta = headerCta[context];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Bloqueo de scroll, Escape y foco atrapado mientras el menú está abierto */
  useEffect(() => {
    if (!open) return;
    lockScroll();

    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusables?.[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenedFor(null);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlockScroll();
    };
  }, [open]);

  const isActive = (target: string) => path === target || (target !== "/" && path.startsWith(target));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-(--duration-base)",
        scrolled || open ? "border-b border-line bg-canvas/85 backdrop-blur-xl" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-(--container-content) items-center justify-between px-(--spacing-gutter) md:h-20">
        <Link
          href={href(lang, routes.home)}
          className="flex items-center gap-2.5 py-2"
          aria-label={t(a11y.goHome, lang)}
        >
          <Logo />
          <span className="font-display text-display-s font-semibold tracking-tight">{brand.name}</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label={t(a11y.mainNav, lang)}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={href(lang, item.href)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center text-body-s transition-colors",
                isActive(item.href) ? "text-ink" : "text-ink-2 hover:text-ink"
              )}
            >
              {t(item.label, lang)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <LangSwitch lang={lang} />

          {cta && (
            <div className="hidden md:block">
              <Button
                variant="primary"
                size="s"
                arrow
                href={href(lang, cta.href)}
                onClick={() => trackCta(context)}
              >
                {t(cta.label, lang)}
              </Button>
            </div>
          )}

          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-(--radius-structural) border border-line text-ink md:hidden"
            aria-label={open ? t(a11y.closeMenu, lang) : t(a11y.openMenu, lang)}
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen(!open)}
          >
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span className={cn("absolute left-0 top-0 h-0.5 w-4 bg-current transition-transform", open && "translate-y-[5px] rotate-45")} />
              <span className={cn("absolute left-0 top-[5px] h-0.5 w-4 bg-current transition-opacity", open && "opacity-0")} />
              <span className={cn("absolute bottom-0 left-0 h-0.5 w-4 bg-current transition-transform", open && "-translate-y-[5px] -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      {/* Menú móvil — overlay a pantalla completa */}
      {open && (
        <div
          id="menu-movil"
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col overflow-y-auto border-t border-line bg-canvas md:hidden"
        >
          <nav className="flex flex-col px-(--spacing-gutter) py-4" aria-label={t(a11y.mainNav, lang)}>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={href(lang, item.href)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="border-b border-line py-5 font-display text-display-m text-ink"
              >
                {t(item.label, lang)}
              </Link>
            ))}
          </nav>

          {cta && (
            <div className="mt-auto px-(--spacing-gutter) pb-10 pt-6">
              <Button
                variant="primary"
                size="l"
                arrow
                href={href(lang, cta.href)}
                className="w-full"
                onClick={() => trackCta(context)}
              >
                {t(cta.label, lang)}
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

/** Evento del plan de medición para el CTA global (§31). */
function trackCta(context: string) {
  track(context === "empresas" ? "cta_b2b_click" : "cta_encontrar_cargador_click", {
    ubicacion: "header",
    contexto: context,
  });
}
