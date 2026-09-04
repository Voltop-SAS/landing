/**
 * i18n · Configuración base
 * Ver docs/MASTER-PROJECT-DEFINITION.md §28.
 *
 * Modelo: rutas estáticas con prefijo de idioma. No hay estado de cliente: el
 * idioma es la URL. Esto garantiza que (a) el idioma sobrevive a la
 * navegación, (b) el `lang` servido es correcto, y (c) todas las versiones
 * son indexables.
 *
 * AÑADIR UN IDIOMA = AÑADIR UNA ENTRADA A `locales` Y UNA A `localeMeta`.
 * Nada más debe cambiar. Todo lo que dependa del conjunto de idiomas —el
 * selector, los `hreflang`, el sitemap, el recorte del prefijo en las rutas—
 * se deriva de aquí y nunca se escribe a mano.
 */

export const locales = ['es', 'en', 'pt'] as const
export type Locale = (typeof locales)[number]

/**
 * Idioma base. Tipado como el LITERAL `"es"` y no como `Locale`: es lo que
 * permite a TypeScript demostrar que el respaldo de `t()` siempre existe —
 * `Localized` declara `es` como la única clave obligatoria— y lo que hace que
 * `Exclude<Locale, typeof defaultLocale>` resuelva de verdad a los idiomas
 * traducibles. Anotado como `Locale`, ambas cosas se pierden.
 */
export const defaultLocale = 'es' as const satisfies Locale

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/* ---------------------------------------------------------------- */
/* Estado de publicación por idioma                                  */
/* ---------------------------------------------------------------- */

/**
 * Un idioma EXISTE mucho antes de estar listo. Sin este estado, la única forma
 * de trabajar un idioma nuevo era tenerlo todo traducido antes del primer
 * commit —o publicarlo a medias, que es peor.
 *
 * - `publicado` — entra en el selector, en el sitemap y en los `hreflang`.
 * - `borrador`  — navegable por URL para poder revisarlo, pero fuera del
 *                 selector, fuera del sitemap, sin `hreflang` y con `noindex`.
 *                 Lo que falte cae al idioma por defecto.
 */
export type LocaleStatus = 'publicado' | 'borrador'

export const localeStatus: Record<Locale, LocaleStatus> = {
  es: 'publicado',
  en: 'publicado',
  /* Portugués de Brasil. Decisión estratégica orientada a audiencia de
     inversión. Publicado el 2026-09-01 con cobertura completa verificada por
     la auditoría de build. */
  pt: 'publicado',
}

/** Idiomas que el sitio ofrece de cara al público. */
export const publishedLocales = locales.filter((l) => localeStatus[l] === 'publicado')

export function isPublished(lang: Locale): boolean {
  return localeStatus[lang] === 'publicado'
}

/* ---------------------------------------------------------------- */
/* Texto multiidioma                                                 */
/* ---------------------------------------------------------------- */

/**
 * Texto en varios idiomas.
 *
 * El idioma BASE (español) es obligatorio; los demás son opcionales. Es un
 * cambio deliberado respecto al modelo anterior, que los exigía todos.
 *
 * ── POR QUÉ SE RELAJÓ ─────────────────────────────────────────────────────
 * Exigirlos todos tenía una virtud real —ningún idioma caía al español sin que
 * alguien se enterara— y dos costes que solo aparecen a partir del tercero:
 *
 * 1. Un idioma nuevo no compila hasta estar traducido al 100%, así que no hay
 *    forma de avanzar por partes ni de revisar nada a medio camino.
 * 2. No admite contenido que legítimamente no existe en todos los idiomas.
 *    Un comunicado sobre una alianza en Bogotá no siempre se traduce al
 *    portugués, y un tipo que lo exige no consigue una traducción: consigue
 *    que alguien pegue el español dentro del campo portugués. Eso es una
 *    caída silenciosa igual, pero además indetectable.
 *
 * ── QUÉ SUSTITUYE A LA GARANTÍA ───────────────────────────────────────────
 * La ausencia deja de ser un error de tipos y pasa a ser un dato medido:
 * `lib/i18n/audit.ts` recorre todo el contenido en cada build, reporta la
 * cobertura de cada idioma y **rompe el build si un idioma PUBLICADO tiene
 * huecos**. La garantía es la misma donde importa —nada se publica a medias—
 * y además ahora se puede trabajar.
 *
 * Lo que no se traduce (nombres propios, unidades) se modela como string plano.
 */
export type Localized<T = string> = { es: T } & {
  [K in Exclude<Locale, typeof defaultLocale>]?: T
}

/**
 * Resuelve un texto al idioma activo.
 *
 * Sin traducción, cae al idioma por defecto. NO avisa por consola a propósito:
 * un idioma en borrador dispararía cientos de avisos por página y enterraría
 * cualquier otro mensaje. Quien lleva la cuenta es la auditoría de build.
 */
export function t<T>(value: Localized<T>, lang: Locale): T {
  return value[lang] ?? value[defaultLocale]
}

/**
 * Metadatos de idioma.
 *
 * - `label`   — rótulo corto del selector (ES · EN).
 * - `name`    — nombre del idioma EN SU PROPIO IDIOMA. Un hablante de
 *               portugués busca "Português", no "Portugués": traducir el
 *               nombre del idioma al idioma que el usuario no entiende es
 *               precisamente lo que rompe un selector.
 * - `htmlLang`— valor del atributo `lang` del documento.
 * - `hreflang`— código que ven los buscadores. Se mantiene SEPARADO de
 *               `htmlLang` porque no siempre coinciden: el español se declara
 *               genérico (`es`) para alcanzar a todo hispanohablante, mientras
 *               el documento se marca `es-CO` por pronunciación y formato.
 */
export const localeMeta: Record<
  Locale,
  { label: string; name: string; htmlLang: string; hreflang: string }
> = {
  es: { label: 'ES', name: 'Español', htmlLang: 'es-CO', hreflang: 'es' },
  en: { label: 'EN', name: 'English', htmlLang: 'en', hreflang: 'en' },
  /* URL corta `/pt`, pero `pt-BR` de cara al buscador: no hay versión europea
     con la que competir, y declarar el genérico `pt` para un texto escrito en
     brasileño describe mal lo que hay. */
  pt: { label: 'PT', name: 'Português', htmlLang: 'pt-BR', hreflang: 'pt-BR' },
}
