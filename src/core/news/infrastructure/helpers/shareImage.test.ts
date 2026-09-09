import { describe, expect, it } from 'vitest'
import { shareImage } from './shareImage'
import type { Post } from '~/core/news/domain/entities/Post'
import type { MediaAsset } from '~/core/common/domain/entities/Media'

/**
 * This is the picture an entry travels with when somebody shares its link, and
 * the `image` of its `NewsArticle` data. Both defects it fixes were invisible
 * from inside the site — you only saw them in WhatsApp, in LinkedIn or in a
 * search engine — which is exactly why they lasted.
 */
const asset = (over: Partial<MediaAsset>): MediaAsset => ({
  id: 'a',
  kind: 'photo',
  src: '/foto.jpg',
  poster: null,
  alt: { es: '' },
  role: { es: '' },
  aspect: '16/9',
  availability: 'entregado',
  ...over,
})

const post = (cover?: MediaAsset): Post => ({
  slug: 'apertura',
  type: 'apertura',
  date: '2025-02-01',
  title: { es: '' },
  summary: { es: '' },
  body: [],
  cover,
  status: 'publicado',
  dataStatus: 'verified',
})

describe('shareImage', () => {
  /**
   * A VIDEO COVER IS NOT AN IMAGE. Both published entries have a video as
   * their cover, so `cover.src` is an `.mp4`, and it was going straight into
   * `NewsArticle.image` — a search engine looking for a photograph found a
   * video file. The poster is the right frame.
   */
  it('uses the poster, never the file, when the cover is a video', () => {
    const url = shareImage(post(asset({ kind: 'video', src: '/x.mp4', poster: '/x.jpg' })), 'es')
    expect(url).toContain('/x.jpg')
    expect(url).not.toContain('.mp4')
  })

  it('uses the photograph itself when the cover is a photo', () => {
    expect(shareImage(post(asset({ src: '/foto.jpg' })), 'es')).toContain('/foto.jpg')
  })

  /**
   * AN ENTRY NEVER TRAVELS WITHOUT A PICTURE. Declaring an `openGraph` object
   * on this route REPLACES the parent's whole one — Next merges metadata
   * shallowly — including the images `[locale]/opengraph-image` injects. With
   * no cover and no fallback, the entry arrived with no preview at all.
   */
  it('falls back to the locale Open Graph image when there is no cover', () => {
    expect(shareImage(post(undefined), 'pt')).toContain('/pt/opengraph-image')
  })

  /** Absolute in every case: a share card cannot resolve a relative path. */
  it('always returns an absolute URL', () => {
    for (const p of [post(asset({})), post(undefined)]) {
      expect(shareImage(p, 'es')).toMatch(/^https?:\/\//)
    }
  })
})
