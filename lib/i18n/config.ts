/**
 * i18n · Configuración base
 * Ver docs/MASTER-PROJECT-DEFINITION.md §28.
 *
 * Modelo: rutas estáticas con prefijo de idioma en AMBOS idiomas (/es, /en).
 * No hay estado de cliente: el idioma es la URL. Esto garantiza que
 * (a) el idioma sobrevive a la navegación, (b) el <html lang> servido es
 * correcto, y (c) ambas versiones son indexables.
 */

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Par bilingüe. Ambos idiomas son OBLIGATORIOS: si `en` fuese opcional, el
 * inglés caería silenciosamente al español sin dejar rastro.
 * Lo que no se traduce (nombres propios, unidades) se modela como string plano.
 */
export type Localized<T = string> = { es: T; en: T };

/** Resuelve un par bilingüe al idioma activo. */
export function t<T>(value: Localized<T>, lang: Locale): T {
  return value[lang];
}

/** Metadatos de idioma para el selector y para hreflang. */
export const localeMeta: Record<Locale, { label: string; htmlLang: string; name: string }> = {
  es: { label: "ES", htmlLang: "es-CO", name: "Español" },
  en: { label: "EN", htmlLang: "en", name: "English" },
};
