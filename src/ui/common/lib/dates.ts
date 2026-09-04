import { localeMeta, type Locale } from '~/core/common/domain/i18n/config'

/**
 * FORMATO DE FECHAS
 *
 * `timeZone: "UTC"` NO es opcional. Una fecha del registro es `"2026-06-18"`,
 * que `new Date()` interpreta como medianoche UTC; formateada en la zona local
 * del servidor —o del navegador— se muestra como el día 17 en cualquier huso
 * al oeste de Greenwich, Colombia incluida. El registro cambiaría de fecha
 * según dónde se renderice.
 *
 * Se formatea con `Intl`, así que cada idioma recibe su convención sin tabla
 * de meses escrita a mano.
 */
export function formatDate(iso: string, locale: Locale): string {
  const parts = new Intl.DateTimeFormat(localeMeta[locale].htmlLang, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(new Date(iso))

  /**
   * Se eliminan los conectores ("de" en español y portugués), no los signos.
   *
   * El registro imprime la fecha en mono y mayúsculas, donde el formato
   * completo se lee "18 DE JUN DE 2026": tres palabras de ruido alrededor del
   * dato. La forma abreviada sin conector —"18 JUN 2026"— es además la
   * habitual en español escrito. En inglés no hay conector que quitar y la
   * coma se conserva, porque ahí sí es puntuación y no relleno.
   *
   * Se descartan por CATEGORÍA (`literal` alfabético), no por una lista de
   * palabras: una lista habría que ampliarla con cada idioma nuevo.
   */
  return parts
    .map((part) => (part.type === 'literal' && /\p{L}/u.test(part.value) ? ' ' : part.value))
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Año de una fecha ISO, para los separadores del registro. */
export function yearOf(iso: string): string {
  return iso.slice(0, 4)
}
