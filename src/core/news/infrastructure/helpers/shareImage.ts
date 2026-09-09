import { SITE_URL } from '~/core/common/domain/i18n/routes'
import type { Locale } from '~/core/common/domain/i18n/config'
import type { Post } from '~/core/news/domain/entities/Post'

/**
 * The image that represents an entry when its link is shared, and in its
 * structured data.
 *
 * ── A VIDEO COVER IS NOT AN IMAGE ────────────────────────────────────────
 * Both published entries have a VIDEO as their cover, so `cover.src` is an
 * `.mp4`. It was going straight into `NewsArticle.image`, which asks for an
 * image: a search engine reading that finds a video file where a photograph
 * should be. The poster is the right frame, and both covers have one.
 *
 * ── AND THE ENTRY WAS LOSING ITS `og:image` ALTOGETHER ───────────────────
 * Measured on 2026-09-08: the 36 other pages emit `og:image` and these two did
 * not. The reason is in Next's own docs — metadata from several segments is
 * merged SHALLOWLY and duplicate keys are REPLACED — so declaring an
 * `openGraph` object in the entry replaced the parent's whole one, including
 * the `images` that `[locale]/opengraph-image.tsx` injects. Shared on WhatsApp
 * or LinkedIn the entry arrived with no preview.
 *
 * With no cover it falls back to the locale's own OG image, so an entry always
 * travels with a picture.
 */
export function shareImage(post: Post, locale: Locale): string {
  const own = post.cover?.kind === 'video' ? post.cover.poster : post.cover?.src
  return own ? `${SITE_URL}${own}` : `${SITE_URL}/${locale}/opengraph-image`
}
