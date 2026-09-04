import { t, type Locale } from '@/lib/i18n/config'
import { Media } from '@/components/ui/Media'
import type { PostBlock } from '@/content/data/posts'
import { novedades } from '@/content/copy/novedades'

/**
 * CUERPO DE UNA ENTRADA · render de bloques tipados.
 *
 * Punto ÚNICO donde el modelo de contenido se convierte en marcado. El dato no
 * lleva formato dentro (nada de Markdown ni HTML en el campo), así que la
 * composición, la jerarquía de encabezados y la accesibilidad se deciden aquí
 * y no en el texto que escribe quien publica.
 *
 * Un bloque nuevo se añade al tipo `PostBlock` y a este `switch`: TypeScript
 * señala el caso que falte en lugar de renderizar nada en silencio.
 */
export function PostBody({ blocks, lang }: { blocks: PostBlock[]; lang: Locale }) {
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
                {t(block.text, lang)}
              </p>
            )

          case 'subtitulo':
            return (
              /* `h2` porque el título de la entrada es el `h1` de la página:
                 la jerarquía no salta niveles (§29). */
              <h2
                key={i}
                className="mt-6 font-display text-display-s font-semibold text-balance text-ink"
              >
                {t(block.text, lang)}
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
                    <span>{t(item, lang)}</span>
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
                  {t(block.text, lang)}
                </blockquote>
                <figcaption className="mt-4 font-mono text-mono uppercase tracking-wider text-ink-3">
                  {block.author} · {t(block.role, lang)}
                </figcaption>
              </figure>
            )

          case 'media':
            return (
              <figure
                key={i}
                className="my-4"
              >
                {/* Mismo criterio que la portada: un vídeo dentro del cuerpo de una
                    entrada es una pieza que se ve, no un fondo. */}
                <Media
                  asset={block.asset}
                  lang={lang}
                  corner
                  controls={block.asset.kind === 'video'}
                  sizes="(min-width: 768px) 46rem, 100vw"
                />
                {/* El rótulo se DERIVA del asset —tipo y duración— en lugar de
                    escribirse. Un "VIDEO · 1:05" a mano se queda desfasado el
                    día que se recorte la pieza y nadie lo nota. */}
                <figcaption className="mt-3 text-body-s text-ink-3">
                  {block.asset.kind === 'video' && block.asset.duration && (
                    <span className="mr-3 font-mono text-mono uppercase tracking-wider text-ink-2">
                      {t(novedades.mediaLabel.video, lang)} · {block.asset.duration}
                    </span>
                  )}
                  {t(block.caption ?? block.asset.alt, lang)}
                </figcaption>
              </figure>
            )
        }
      })}
    </div>
  )
}
