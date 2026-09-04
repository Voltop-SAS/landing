import type { Localized } from '~/core/common/domain/i18n/config'
import type { MediaAsset } from '~/core/common/domain/entities/Media'

export type PostType = 'apertura' | 'evento' | 'alianza' | 'comunicado' | 'noticia'

/**
 * Body as BLOCKS, not Markdown or HTML.
 *
 * It is the exact shape in which a headless CMS delivers rich text (Sanity's
 * Portable Text, Contentful's rich text), so migrating will be a matter of
 * connecting rather than rewriting — and it closes none of the three
 * production paths §2 keeps open. Loose Markdown would have put formatting
 * inside the data and taken away control over composition and accessibility.
 */
export type PostBlock =
  | { kind: 'parrafo'; text: Localized }
  | { kind: 'subtitulo'; text: Localized }
  | { kind: 'lista'; items: Localized[] }
  /** Attribution is mandatory: a quote with no author is not a quote. */
  | { kind: 'cita'; text: Localized; author: string; role: Localized }
  /**
   * `caption` is the VISIBLE caption. If it is missing, the asset's `alt` is
   * used instead.
   *
   * They are not the same thing, which is why they are separate: `alt`
   * describes the image for whoever cannot see it, and the caption comments on
   * it for whoever can. Using the alt as the caption forces one piece of text
   * to do two jobs, and it ends up doing both badly.
   */
  | { kind: 'media'; asset: MediaAsset; caption?: Localized }

export type Post = {
  slug: string
  type: PostType
  /** ISO `YYYY-MM-DD`. Orders the log and feeds the sitemap's `lastModified`. */
  date: string
  title: Localized
  /** Index summary and description for search engines. A single sentence. */
  summary: Localized
  /** Empty = the entry lives only in the index. See the dataset's header. */
  body: PostBlock[]
  cover?: MediaAsset
  /** Cover caption in the index. See `caption` on the `media` block. */
  coverCaption?: Localized
  /**
   * References, never free text. This is what makes an opening show up on its
   * own on its station's page and on its city's page, without anyone placing
   * it by hand in three places.
   */
  stationSlug?: string
  citySlug?: string
  featured?: boolean
  /** `borrador` is neither published nor built. */
  status: 'borrador' | 'publicado'
  /** Data provenance, the same as on stations. */
  dataStatus: 'placeholder' | 'verified'
}
