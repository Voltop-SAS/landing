import type { Localized } from '../i18n/config'

/**
 * NARRATIVE MEDIA · the shape of an asset
 * See docs/MASTER-PROJECT-DEFINITION.md §20, §32 and §33.
 *
 * These are the types; the catalogue itself lives in
 * `~/core/common/infrastructure/content/media`. Together they are the SINGLE
 * point of connection between the narrative and the real files: when the assets
 * arrive, only the catalogue changes — `src` and `poster` get filled in and the
 * whole site stops showing placeholders on its own. No component ever
 * references a file path directly.
 *
 * `src: null` = an asset confirmed to exist but NOT YET DELIVERED.
 */

export type MediaKind = 'video' | 'photo'

export type MediaAsset = {
  id: string
  kind: MediaKind
  /** Path to the final file. `null` until it has been delivered. */
  src: string | null
  /**
   * A lighter variant for small screens.
   *
   * Not a cosmetic optimisation: the Medellín loop is encoded at 2560×1440 and
   * a 390px phone cannot display even a sixth of those pixels. Serving it as-is
   * spends 2.9 MB of mobile data on invisible resolution.
   *
   * `null` = there is no variant and everyone gets the only one that exists.
   */
  srcMobile?: string | null
  /** Cover frame — critical for LCP and for the not-yet-playing state. */
  poster: string | null
  /** Alternative text / accessible description. Always required. */
  alt: Localized
  /** What this piece does in the narrative. It guides design and editing. */
  role: Localized
  /** Known or estimated duration of the source material. */
  duration?: string
  /** Aspect ratio, used to reserve space and avoid CLS. */
  /* `2/3` arrived with the charger render: it is the moderate portrait that was
     missing between landscape `3/2` and `9/16`, which is story format. */
  aspect: '16/9' | '4/3' | '3/2' | '2/3' | '1/1' | '21/9' | '9/16'
  /** Declared availability of the source material. Stored values, kept as they
   * are: renaming them would be a data migration, not a rename. */
  availability: 'confirmado-no-entregado' | 'a-producir' | 'entregado'
}
