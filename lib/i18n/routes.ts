/**
 * i18n · Rutas localizadas
 *
 * Los segmentos de URL se mantienen en español en ambos idiomas
 * (/en/red, no /en/network). Decisión abierta O2 del Master Project
 * Definition: localizarlos es deseable pero no bloqueante, y hacerlo
 * más tarde solo requiere cambiar este archivo.
 */

import type { Locale } from "./config";

/** Rutas canónicas del sitio, sin prefijo de idioma. */
export const routes = {
  home: "",
  red: "/red",
  empresas: "/empresas",
  nosotros: "/nosotros",
  city: (slug: string) => `/red/${slug}`,
  station: (slug: string) => `/red/estacion/${slug}`,
} as const;

/** Antepone el idioma a una ruta canónica. `path` debe empezar por "/" o ser "". */
export function href(lang: Locale, path: string): string {
  return `/${lang}${path}`;
}

/**
 * Cambia el idioma conservando la ruta actual.
 * `pathname` es la ruta completa incluyendo el prefijo de idioma.
 */
export function switchLocalePath(pathname: string, next: Locale): string {
  const rest = pathname.replace(/^\/(es|en)(?=\/|$)/, "");
  return `/${next}${rest}`;
}

/** Rutas absolutas para sitemap, canonical y hreflang. */
export const SITE_URL = "https://voltop.co";

export function absoluteUrl(lang: Locale, path: string): string {
  return `${SITE_URL}${href(lang, path)}`;
}
