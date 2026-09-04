import Link from 'next/link'
import { t, type Locale, type Localized } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { formatDate } from '@ui/common/lib/dates'
import { novedades } from '~/core/novedades/domain/consts/copy'
import { Section, Container, SectionHeading } from '@ui/common/components/ui/LayoutPrimitives'
import { PostLink } from '@ui/common/components/ui/PostLink'
import type { Post } from '~/core/common/infrastructure/data-access'

/**
 * RE-SUPERFICIE DEL REGISTRO EN OTRO DESTINO.
 *
 * Es la pieza que impide que las novedades sean un cajón aparte: una apertura
 * con `stationSlug` aparece sola en la ficha de esa estación y en la página de
 * su ciudad, sin que nadie la coloque a mano en tres sitios. Reutiliza el
 * sistema de referencias que ya conecta estación → ciudad.
 *
 * Sin entradas NO RENDERIZA NADA —ni titular vacío ni "próximamente"—, igual
 * que la franja de partners se omite mientras no haya logos con permiso (§33).
 * Un bloque vacío no informa: ocupa.
 *
 * Estructura deliberadamente distinta de la del registro principal: aquí es
 * una lista compacta de dos líneas, no la bitácora con separadores de año.
 * Dos superficies vecinas no repiten estructura (§36.11).
 */
export function PostsInline({
  posts,
  lang,
  title,
}: {
  posts: Post[]
  lang: Locale
  title: Localized
}) {
  if (posts.length === 0) return null

  return (
    <Section space="tight">
      <Container>
        <SectionHeading
          size="s"
          as="h2"
        >
          {t(title, lang)}
        </SectionHeading>

        <ul className="mt-8 border-t border-line">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="border-b border-line"
            >
              <PostLink
                post={post}
                lang={lang}
                className="flex min-h-14 flex-col justify-center gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <time
                  dateTime={post.date}
                  className="shrink-0 font-mono text-mono uppercase tracking-wider text-ink-3"
                >
                  {formatDate(post.date, lang)}
                </time>
                <span className="text-body-s text-ink-2 transition-colors group-hover:text-ink">
                  {t(post.title, lang)}
                </span>
              </PostLink>
            </li>
          ))}
        </ul>

        <Link
          href={href(lang, routes.novedades)}
          className="mt-6 inline-flex min-h-11 items-center font-mono text-mono uppercase tracking-wider text-ink-3 transition-colors hover:text-ink"
        >
          {t(novedades.eyebrow, lang)} →
        </Link>
      </Container>
    </Section>
  )
}
