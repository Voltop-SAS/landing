/** El registro de novedades. */

import { type Post } from '@/content/data/posts'
import { fetchPosts } from './postsSource'

/**
 * ── POR QUÉ ESTOS ACCESORES SON `async` Y LOS DEMÁS NO ────────────────────
 * El registro es el piloto de CMS (ver `posts-source.ts`). Su origen va a ser
 * remoto; el de estaciones y ciudades, por ahora no. Pasar SOLO el registro a
 * asíncrono es la asimetría correcta: refleja lo que de verdad va a cambiar.
 *
 * Se hace AHORA y no el día de la migración porque es lo único que obligaría a
 * tocar cada página que consume el registro. Hecho hoy, conectar el CMS es
 * cambiar el cuerpo de una función.
 */

/**
 * El registro, siempre en orden cronológico inverso y solo con lo publicado.
 * Ninguna vista ordena por su cuenta: si el orden se decidiera en cada
 * componente, dos superficies acabarían mostrando el mismo registro distinto.
 */
export async function getPosts(): Promise<Post[]> {
  const all = await fetchPosts()
  return all.filter((p) => p.status === 'publicado').sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug)
}

/**
 * Entradas con página propia. Ver la cabecera de `content/data/posts.ts`:
 * `body` vacío significa que la entrada vive solo en el índice, así que no
 * genera ruta, no entra en el sitemap y no se enlaza desde ningún sitio.
 *
 * Es un PREDICADO PURO sobre una entrada ya cargada, así que sigue siendo
 * síncrono: no consulta el origen y los componentes lo usan durante el render.
 */
export function hasPage(post: Post): boolean {
  return post.body.length > 0
}

export async function getPostsWithPage(): Promise<Post[]> {
  return (await getPosts()).filter(hasPage)
}

/** Portada del registro: la marcada como destacada o, si no hay, la más reciente. */
/**
 * Entrada de portada del registro.
 *
 * Prefiere la más reciente que TENGA PORTADA con material entregado. No es un
 * capricho de orden: la portada es una franja 21/9 en lo más alto de la
 * página, y sin archivo real se convierte en el rectángulo gris más grande del
 * sitio. Antes bastaba con `featured: true`, y eso ponía en ese sitio a la
 * entrada de la EAN, cuya foto todavía no se ha entregado.
 *
 * Si ninguna tiene material, cae a la marcada y luego a la más reciente: el
 * registro sigue funcionando, solo que sin imagen.
 */
export async function getFeaturedPost(): Promise<Post | undefined> {
  const list = await getPosts()
  return (
    list.find((p) => p.featured && p.cover?.src) ??
    list.find((p) => p.cover?.src) ??
    list.find((p) => p.featured) ??
    list[0]
  )
}

export async function getLatestPosts(limit: number): Promise<Post[]> {
  return (await getPosts()).slice(0, limit)
}

/**
 * Re-superficie contextual. Es lo que hace que el registro no sea un cajón
 * aparte: una apertura aparece sola en la ficha de su estación y en la página
 * de su ciudad, sin que nadie la coloque a mano en tres sitios.
 */
export async function getPostsForStation(stationSlug: string): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.stationSlug === stationSlug)
}

export async function getPostsForCity(citySlug: string): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.citySlug === citySlug)
}

/** Fecha de la entrada más reciente. Alimenta `lastModified` del índice. */
export async function getLatestPostDate(): Promise<string | undefined> {
  return (await getPosts())[0]?.date
}
