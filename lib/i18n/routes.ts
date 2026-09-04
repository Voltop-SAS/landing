/**
 * i18n · Rutas localizadas
 *
 * Los segmentos de URL se mantienen en español en todos los idiomas
 * (/en/red, no /en/network). Decisión abierta O2 del Master Project
 * Definition: localizarlos es deseable pero no bloqueante, y hacerlo
 * más tarde solo requiere cambiar este archivo.
 *
 * NADA EN ESTE ARCHIVO ENUMERA LOS IDIOMAS A MANO. Todo se deriva de
 * `locales`, para que añadir un idioma no obligue a buscar por el proyecto
 * dónde estaba escrito el conjunto anterior.
 */

import { locales, publishedLocales, defaultLocale, localeMeta, type Locale } from "./config";

/** Rutas canónicas del sitio, sin prefijo de idioma. */
export const routes = {
  home: "",
  red: "/red",
  empresas: "/empresas",
  nosotros: "/nosotros",
  novedades: "/novedades",
  privacy: "/legal/privacidad",
  terms: "/legal/terminos",
  post: (slug: string) => `/novedades/${slug}`,
  city: (slug: string) => `/red/${slug}`,
  station: (slug: string) => `/red/estacion/${slug}`,
} as const;

/** Antepone el idioma a una ruta canónica. `path` debe empezar por "/" o ser "". */
export function href(lang: Locale, path: string): string {
  return `/${lang}${path}`;
}

/**
 * Prefijo de idioma al inicio de una ruta, DERIVADO de `locales`.
 *
 * El `(?=\/|$)` no es cosmético: sin él, `^\/(es|en)` casa también con el
 * comienzo de `/estaciones` y lo recorta a `taciones`. Hoy ninguna ruta del
 * sitio empieza así, pero la expresión estaba escrita a mano en dos archivos
 * distintos y una de las dos copias sí carecía del lookahead.
 */
const LOCALE_PREFIX = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

/** Quita el prefijo de idioma. Devuelve "" para la home. */
export function stripLocale(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX, "");
}

/**
 * Cambia el idioma conservando la ruta actual.
 * `pathname` es la ruta completa incluyendo el prefijo de idioma.
 */
export function switchLocalePath(pathname: string, next: Locale): string {
  return `/${next}${stripLocale(pathname)}`;
}

/**
 * Rutas absolutas para sitemap, canonical y hreflang.
 *
 * ── CONFIGURABLE, CON EL VALOR DE PRODUCCIÓN COMO DEFECTO ─────────────────
 * Se lee de `NEXT_PUBLIC_SITE_URL` para que un despliegue de staging o de
 * previsualización pueda anunciar SU propio dominio: si no se define, el
 * sitemap, los `canonical` y los `hreflang` de una preview apuntarían a
 * producción y le dirían a un buscador que el contenido canónico vive en otro
 * sitio.
 *
 * El defecto es el dominio real, así que NO definir la variable deja el
 * comportamiento exactamente como estaba. Ver `.env.example`.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voltop.co";

export function absoluteUrl(lang: Locale, path: string): string {
  return `${SITE_URL}${href(lang, path)}`;
}

/**
 * Canonical + hreflang recíproco de UNA ruta, en TODOS los idiomas (§29).
 *
 * Antes cada página escribía `{ es: …, en: … }` a mano en su `generateMetadata`.
 * Eran cuatro copias del mismo objeto y ninguna se enteraría de un idioma
 * nuevo: el tercer idioma habría quedado publicado pero huérfano de hreflang,
 * que es la señal con la que Google decide qué versión sirve a quién.
 *
 * `x-default` apunta al idioma por defecto: es la versión que se sirve a quien
 * no encaja en ninguna de las declaradas.
 */
export function alternatesFor(lang: Locale, path: string) {
  return {
    canonical: absoluteUrl(lang, path),
    /* Solo idiomas PUBLICADOS. Un `hreflang` es una invitación a indexar:
       anunciar un idioma en borrador lo metería en resultados de búsqueda
       precisamente mientras está a medias. */
    languages: {
      ...Object.fromEntries(
        publishedLocales.map((l) => [localeMeta[l].hreflang, absoluteUrl(l, path)])
      ),
      "x-default": absoluteUrl(defaultLocale, path),
    },
  };
}
