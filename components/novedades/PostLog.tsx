import { Fragment } from 'react'
import { type Locale } from '~/core/common/domain/i18n/config'
import { yearOf } from '@ui/common/lib/dates'
import { LogEntry } from '@/components/novedades/LogEntry'
import type { Post } from '~/core/common/infrastructure/data-access'

/**
 * EL REGISTRO · lista cronológica con separadores de año.
 *
 * El año no es decoración: es lo que convierte una lista en una bitácora y lo
 * que deja ver de un vistazo el ritmo real de la compañía —cuántas cosas
 * pasaron y cuándo—, que es justo la pregunta que trae aquí a un inversionista.
 *
 * Server Component. No hay filtro por tipo, y es una decisión, no una omisión:
 * con el volumen actual filtrar dejaría una o dos entradas por categoría, y un
 * control que no reduce nada útil es un control decorativo (§12). Cuando el
 * registro pase de ~15 entradas el filtro se gana su sitio; hasta entonces el
 * tipo se lee en cada fila y basta.
 *
 * El año se agrupa ANTES de renderizar, no acumulando una variable dentro del
 * `map`: así el marcado no depende del orden de evaluación y el separador
 * puede ser hermano de las filas en lugar de anidarse dentro de una.
 */
export function PostLog({ posts, lang }: { posts: Post[]; lang: Locale }) {
  const groups = posts.reduce<{ year: string; entries: Post[] }[]>((acc, post) => {
    const year = yearOf(post.date)
    const last = acc[acc.length - 1]
    if (last?.year === year) last.entries.push(post)
    else acc.push({ year, entries: [post] })
    return acc
  }, [])

  /**
   * Con un solo año, el separador no separa nada: es un rótulo que no informa,
   * y §12 no admite controles ni marcas decorativas. Aparece cuando hay más de
   * un año que distinguir — activado por los datos, como el orden por
   * distancia de `/red`, que solo se ofrece si alguna estación trae
   * coordenadas.
   */
  const showYears = groups.length > 1

  return (
    <ul className="border-b border-line">
      {groups.map((group) => (
        <Fragment key={group.year}>
          {/* Oculto a lectores de pantalla: cada entrada ya anuncia su fecha
              completa, así que el separador es redundancia VISUAL. Repetirlo
              en audio solo añade ruido entre entrada y entrada. */}
          {showYears && (
            <li
              aria-hidden="true"
              className="border-t border-line-strong pb-1 pt-7"
            >
              <span className="font-mono text-mono uppercase tracking-wider text-ink-3">
                {group.year}
              </span>
            </li>
          )}
          {group.entries.map((post) => (
            <LogEntry
              key={post.slug}
              post={post}
              lang={lang}
            />
          ))}
        </Fragment>
      ))}
    </ul>
  )
}
