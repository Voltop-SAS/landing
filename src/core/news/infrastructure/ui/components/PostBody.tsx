import { t, type Locale } from '~/core/common/domain/i18n/config'
import { Media } from '@ui/common/components/ui/Media'
import type { PostBlock } from '~/core/news/domain/entities/Post'
import { novedades } from '~/core/news/domain/consts/copy'

/**
 * BODY OF AN ENTRY · rendering of typed blocks.
 *
 * The SINGLE point where the content model becomes markup. The data carries no
 * formatting inside it (no Markdown or HTML in the field), so composition,
 * heading hierarchy and accessibility are decided here and not in the text
 * whoever publishes writes.
 *
 * A new block is added to the `PostBlock` type and to this `switch`:
 * TypeScript points at the missing case instead of silently rendering
 * nothing.
 */
export function PostBody({ blocks, locale }: { blocks: PostBlock[]; locale: Locale }) {
  return (
    <div className="mt-12 flex flex-col gap-7">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'parrafo':
            return (
              <p
                key={i}
                className="measure text-body-l text-ink-2"
              >
                {t(block.text, locale)}
              </p>
            )

          case 'subtitulo':
            return (
              /* `h2` because the entry's title is the page's `h1`: the
                 hierarchy does not skip levels (§29). */
              <h2
                key={i}
                className="mt-6 font-display text-display-s font-semibold text-balance text-ink"
              >
                {t(block.text, locale)}
              </h2>
            )

          case 'lista':
            return (
              <ul
                key={i}
                className="measure flex flex-col gap-3"
              >
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-3 text-body-l text-ink-2"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-3 h-px w-4 shrink-0 bg-line-strong"
                    />
                    <span>{t(item, locale)}</span>
                  </li>
                ))}
              </ul>
            )

          case 'cita':
            return (
              <figure
                key={i}
                className="my-4 border-l border-line-strong pl-6"
              >
                <blockquote className="measure font-display text-display-s font-medium text-balance text-ink">
                  {t(block.text, locale)}
                </blockquote>
                <figcaption className="mt-4 font-mono text-mono uppercase tracking-wider text-ink-3">
                  {block.author} · {t(block.role, locale)}
                </figcaption>
              </figure>
            )

          case 'media':
            return (
              <figure
                key={i}
                className="my-4"
              >
                {/* Same criterion as the cover: a video inside an entry's
                    body is a piece you watch, not a background. */}
                <Media
                  asset={block.asset}
                  locale={locale}
                  corner
                  controls={block.asset.kind === 'video'}
                  sizes="(min-width: 768px) 46rem, 100vw"
                />
                {/* The label is DERIVED from the asset —type and duration—
                    rather than written. A hand-written "VIDEO · 1:05" goes
                    stale the day the piece is re-cut and nobody notices. */}
                <figcaption className="mt-3 text-body-s text-ink-3">
                  {block.asset.kind === 'video' && block.asset.duration && (
                    <span className="mr-3 font-mono text-mono uppercase tracking-wider text-ink-2">
                      {t(novedades.mediaLabel.video, locale)} · {block.asset.duration}
                    </span>
                  )}
                  {t(block.caption ?? block.asset.alt, locale)}
                </figcaption>
              </figure>
            )
        }
      })}
    </div>
  )
}
