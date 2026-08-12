"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeMeta, t, type Locale } from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/routes";
import { a11y } from "@/content/copy/common";
import { cn } from "@/lib/cn";

/**
 * SELECTOR DE IDIOMA
 * Ver docs/MASTER-PROJECT-DEFINITION.md §28.
 *
 * Son ENLACES, no botones de estado: el idioma vive en la URL, así que cambiar
 * de idioma es navegar. Esto resuelve el fallo por el que el idioma se perdía
 * en cada navegación y hace ambas versiones indexables.
 * Conserva siempre la ruta actual.
 */
export function LangSwitch({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  return (
    <div
      className="flex items-center rounded-(--radius-pill) border border-line p-0.5"
      role="group"
      aria-label={t(a11y.languageSelector, lang)}
    >
      {locales.map((code) => {
        const active = code === lang;
        return (
          <Link
            key={code}
            href={switchLocalePath(pathname, code)}
            hrefLang={code}
            aria-current={active ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 min-w-11 items-center justify-center rounded-(--radius-pill) px-2 font-mono text-mono uppercase transition-colors",
              active ? "bg-surface-3 text-ink" : "text-ink-3 hover:text-ink"
            )}
          >
            <span className="sr-only">{localeMeta[code].name}</span>
            <span aria-hidden="true">{localeMeta[code].label}</span>
          </Link>
        );
      })}
    </div>
  );
}
