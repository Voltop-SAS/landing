import type { Localized } from '~/core/common/domain/i18n/config'
import type { MediaAsset } from '~/core/common/domain/entities/Media'

export type PostType = 'apertura' | 'evento' | 'alianza' | 'comunicado' | 'noticia'

/**
 * Cuerpo por BLOQUES, no Markdown ni HTML.
 *
 * Es la forma exacta en que un CMS headless entrega texto enriquecido
 * (Portable Text de Sanity, rich text de Contentful), así que migrar será
 * conectar y no reescribir — y no cierra ninguno de los tres caminos de
 * producción que §2 mantiene abiertos. Markdown suelto habría metido formato
 * dentro del dato y quitado control sobre composición y accesibilidad.
 */
export type PostBlock =
  | { kind: 'parrafo'; text: Localized }
  | { kind: 'subtitulo'; text: Localized }
  | { kind: 'lista'; items: Localized[] }
  /** Atribución obligatoria: una cita sin autor no es una cita. */
  | { kind: 'cita'; text: Localized; author: string; role: Localized }
  /**
   * `caption` es el pie VISIBLE. Si falta, se usa el `alt` del asset.
   *
   * No son lo mismo y por eso se separan: el `alt` describe la imagen para
   * quien no la ve, y el pie la comenta para quien sí. Usar el alt como pie
   * obliga a que un solo texto haga dos trabajos, y acaba haciendo mal los dos.
   */
  | { kind: 'media'; asset: MediaAsset; caption?: Localized }

export type Post = {
  slug: string
  type: PostType
  /** ISO `YYYY-MM-DD`. Ordena el registro y alimenta `lastModified` del sitemap. */
  date: string
  title: Localized
  /** Resumen del índice y descripción para buscadores. Una sola frase. */
  summary: Localized
  /** Vacío = la entrada vive solo en el índice. Ver cabecera del archivo. */
  body: PostBlock[]
  cover?: MediaAsset
  /** Pie de la portada en el índice. Ver `caption` en el bloque `media`. */
  coverCaption?: Localized
  /**
   * Referencias, nunca texto libre. Es lo que hace que una apertura aparezca
   * sola en la ficha de su estación y en la página de su ciudad, sin que nadie
   * la coloque a mano en tres sitios.
   */
  stationSlug?: string
  citySlug?: string
  featured?: boolean
  /** `borrador` no se publica ni se construye. */
  status: 'borrador' | 'publicado'
  /** Trazabilidad del dato, igual que en estaciones. */
  dataStatus: 'placeholder' | 'verified'
}
