import Link from 'next/link'
import { type Locale } from '@/lib/i18n/config'
import { href, routes } from '@/lib/i18n/routes'
import { hasPage } from '@/lib/data'
import type { Post } from '@/lib/data'
import { cn } from '@ui/common/lib/cn'

/**
 * ENVOLTORIO DE UNA ENTRADA · enlaza solo si hay dónde ir.
 *
 * §15: un enlace sin destino real no se publica. Una apertura son dos líneas
 * que se leen en la propia fila; enlazarla a una página con el mismo texto
 * sería un enlace que no lleva a nada nuevo.
 *
 * La regla se aplicaba en TRES sitios —el registro, la lista compacta de las
 * fichas y el beat de la Home—, cada uno con su propia copia del ternario y de
 * la clase `group`. Tres copias de una regla son tres sitios donde puede
 * divergir: basta que alguien añada una condición en una y no en las otras
 * para que la misma entrada enlace en una superficie y no en la vecina.
 *
 * Lo que NO unifica es el aspecto. Las tres listas son deliberadamente
 * distintas —§36.11: dos superficies vecinas no repiten estructura— y por eso
 * cada una sigue trayendo su propia rejilla en `className`. Aquí solo vive la
 * decisión de si esto es un enlace o no lo es.
 *
 * `group` se añade únicamente en la rama enlazada: los `group-hover` de los
 * hijos no deben responder cuando no hay nada que abrir. Lo mismo vale para
 * `press`: una fila que no lleva a ninguna parte no debe acusar el toque.
 */
export function PostLink({
  post,
  lang,
  className,
  children,
}: {
  post: Post
  lang: Locale
  className?: string
  children: React.ReactNode
}) {
  if (!hasPage(post)) return <div className={className}>{children}</div>

  return (
    <Link
      href={href(lang, routes.post(post.slug))}
      className={cn('group press', className)}
    >
      {children}
    </Link>
  )
}
