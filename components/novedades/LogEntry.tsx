import { t, type Locale } from '~/core/common/domain/i18n/config'
import { formatDate } from '@ui/common/lib/dates'
import { novedades } from '@/content/copy/novedades'
import { PostLink } from '@/components/novedades/PostLink'
import type { Post } from '~/core/common/infrastructure/data-access'
import { hasPage } from '~/core/common/infrastructure/data-access'
import { cn } from '@ui/common/lib/cn'

/**
 * UNA FILA DEL REGISTRO.
 *
 * ── POR QUÉ NO ES UNA TARJETA ─────────────────────────────────────────────
 * §12 prohíbe el exceso de tarjetas y los layouts previsibles, y una rejilla
 * de tarjetas con foto, titular y "Leer más" es el patrón más genérico que
 * existe: no pasaría el test del anonimato. Voltop es infraestructura, y la
 * forma nativa de comunicar infraestructura es la BITÁCORA de lo construido.
 *
 * Así que es una fila de índice: fecha en mono a la izquierda, contenido a la
 * derecha, separada de la siguiente por un hairline. El mismo lenguaje de
 * "ficha técnica" que ya usan las specs de estación.
 *
 * ── LA FILA ES UN ENLACE SOLO SI HAY DÓNDE IR ─────────────────────────────
 * Una apertura son dos líneas: se leen aquí y no hay página que abrir. Esa
 * decisión la toma `PostLink`, compartido con las otras dos listas; aquí solo
 * se consulta `hasPage` para decidir qué se PINTA —el hover del título y el
 * "leer entrada"—, que es otra cosa.
 */
export function LogEntry({ post, lang }: { post: Post; lang: Locale }) {
  const linked = hasPage(post)

  const content = (
    <>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 md:flex-col md:gap-1">
        <time
          dateTime={post.date}
          className="font-mono text-mono uppercase tracking-wider text-ink-2"
        >
          {formatDate(post.date, lang)}
        </time>
        <span className="font-mono text-mono uppercase tracking-wider text-ink-3">
          {t(novedades.types[post.type], lang)}
        </span>
      </div>

      <div>
        <h3
          className={cn(
            'font-display text-display-s font-semibold text-balance text-ink',
            /* La respuesta al hover vive aquí y no en toda la fila: el título
               es lo que se está eligiendo leer (§36.12, la energía es
               respuesta, no ambiente). */
            linked && 'transition-colors group-hover:text-brand',
          )}
        >
          {t(post.title, lang)}
        </h3>

        <p className="mt-2 measure text-body-s text-ink-2">{t(post.summary, lang)}</p>

        {/* La marca de provisional NO va aquí: se declara una sola vez para
            todo el registro (ver `provisionalTag` en el copy). Repetida por
            fila era textura ámbar, no una advertencia. */}
        {linked && (
          <span className="mt-4 inline-flex font-mono text-mono uppercase tracking-wider text-ink-3 transition-colors group-hover:text-ink">
            {t(novedades.readEntry, lang)} →
          </span>
        )}
      </div>
    </>
  )

  return (
    <li className="border-t border-line">
      <PostLink
        post={post}
        lang={lang}
        className="grid gap-x-10 gap-y-3 py-8 md:grid-cols-[9rem_1fr] md:py-10"
      >
        {content}
      </PostLink>
    </li>
  )
}
