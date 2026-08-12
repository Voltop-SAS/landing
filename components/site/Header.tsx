"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { nav } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function Header() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cta = { es: "Encontrar cargador", en: "Find a charger" };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-6 md:h-18 md:px-10">
        {/* Logo (PLACEHOLDER — pendiente SVG de marca) */}
        <a href="/" className="flex items-center gap-2" aria-label="Voltop — Inicio">
          <span className="grid size-7 place-items-center rounded-[7px] brand-gradient text-on-brand">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Voltop</span>
        </a>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              {t(item.label)}
            </a>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <LangToggle lang={lang} setLang={setLang} />
          <div className="hidden md:block">
            <Button variant="primary" size="s" arrow href="/red">
              {t(cta)}
            </Button>
          </div>
          <button
            className="grid size-9 place-items-center rounded-[10px] border border-line text-ink md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-4">
              <span className={cn("absolute left-0 top-0 h-0.5 w-4 bg-current transition-transform", open && "translate-y-[5px] rotate-45")} />
              <span className={cn("absolute left-0 top-[5px] h-0.5 w-4 bg-current transition-opacity", open && "opacity-0")} />
              <span className={cn("absolute bottom-0 left-0 h-0.5 w-4 bg-current transition-transform", open && "-translate-y-[5px] -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="border-t border-line bg-canvas/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-[1240px] flex-col gap-1 px-6 py-4" aria-label="Móvil">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[10px] px-2 py-3 font-display text-2xl text-ink"
              >
                {t(item.label)}
              </a>
            ))}
            <div className="mt-3">
              <Button variant="primary" size="l" arrow href="#red" className="w-full" onClick={() => setOpen(false)}>
                {t(cta)}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function LangToggle({
  lang,
  setLang,
}: {
  lang: "es" | "en";
  setLang: (l: "es" | "en") => void;
}) {
  return (
    <div className="flex items-center rounded-full border border-line p-0.5 font-mono text-xs">
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "rounded-full px-2 py-1 uppercase transition-colors",
            lang === l ? "bg-surface-3 text-ink" : "text-ink-3 hover:text-ink-2"
          )}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
