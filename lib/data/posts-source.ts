import { posts, type Post } from "@/content/data/posts";

/**
 * ORIGEN DEL REGISTRO · el único punto que cambia al conectar un CMS.
 *
 * ── POR QUÉ EXISTE ESTE ARCHIVO ───────────────────────────────────────────
 * §38 fija la restricción dura del proyecto: el equipo propietario NO es un
 * equipo de desarrollo. Hoy publicar una novedad significa editar un archivo
 * de código, hacer commit y desplegar. Para estaciones —que cambian pocas
 * veces al año— se aguanta. Para un registro con cadencia semanal no, y la
 * sección moriría por fricción operativa, no por falta de contenido.
 *
 * ── POR QUÉ EL REGISTRO Y NO TODO ─────────────────────────────────────────
 * Es el piloto deliberado de §2: se conecta UNA colección a un CMS y se deja
 * el resto como datos locales. Bajo riesgo, reversible, y produce la
 * evaluación real de coste, fidelidad y autonomía que §2 pedía —con datos en
 * vez de estimaciones—. Si funciona, migra el resto; si no, se descarta
 * habiendo perdido una colección y no el proyecto.
 *
 * ── QUÉ SUSTITUIR Y QUÉ NO ────────────────────────────────────────────────
 * Se sustituye el CUERPO de `fetchPosts`. Nada más.
 *
 * Todo lo que hay por encima —orden cronológico, filtro de publicados,
 * resolución de referencias a estación y ciudad, qué entradas tienen página—
 * vive en `lib/data/index.ts` y NO depende del origen. Un CMS que devuelva
 * registros con la forma de `Post` entra sin tocar una línea de presentación.
 *
 * La firma ya es `async` aunque hoy no haga E/S: es lo que evita que conectar
 * el CMS obligue a reescribir cada página que consume el registro.
 */
export async function fetchPosts(): Promise<Post[]> {
  return posts;
}
