# Brief de CMS — el registro de novedades como piloto

> Escrito el 2026-09-01. Documento para **evaluar y contratar** un CMS, y para
> pasárselo al proveedor que se elija.
>
> Referencia normativa: `docs/MASTER-PROJECT-DEFINITION.md` §2 (camino de
> producción diferido), §26 (arquitectura), §27 (datos), §38 (restricciones).

---

## 1 · Por qué existe esto y por qué ahora

`FACT` Hoy, publicar una novedad exige editar un archivo de código, hacer commit y desplegar.

`FACT` §38 fija la restricción dura: **el equipo propietario no es un equipo de desarrollo.**

Para estaciones —que cambian pocas veces al año— la fricción se aguanta. Para un registro con cadencia semanal no: la sección moriría por fricción operativa, no por falta de contenido. Y una sala de novedades abandonada en el menú principal comunica que la compañía está parada, que es lo contrario de por qué se construyó.

`DECISION` **El registro es el piloto.** Se conecta UNA colección al CMS y el resto sigue como datos locales. Bajo riesgo, reversible, y produce la evaluación real de coste, fidelidad y autonomía que §2 pedía — con datos en vez de estimaciones. Si funciona, migra el resto. Si no, se descarta habiendo perdido una colección, no el proyecto.

`FACT` **El gate de §2 ya se cumplió.** La decisión de producción esperaba "hasta que el copy esté fuera del código", y todo el copy vive en `content/copy/*` desde el bloque 7.

---

## 2 · Qué está ya preparado en el código

| Pieza | Estado |
|---|---|
| `lib/data/posts-source.ts` → `fetchPosts()` | **Único punto que cambia.** Hoy devuelve el array local; mañana hace la llamada al CMS |
| Accesores del registro en `lib/data/index.ts` | Ya son `async`. Orden, filtro de publicados, referencias y "qué entradas tienen página" **no dependen del origen** |
| Presentación | **No cambia nada.** Ningún componente importa `content/data/*` |

Conectar el CMS = sustituir el cuerpo de **una función**. Esa es toda la superficie de integración.

---

## 3 · El modelo de contenido a reproducir en el CMS

Colección **`post`**. Un registro = una novedad.

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `slug` | texto, único | sí | Es la URL. No debe poder cambiarse una vez publicado sin redirección |
| `type` | lista cerrada | sí | `apertura` · `evento` · `alianza` · `comunicado` · `noticia` |
| `date` | fecha (solo día) | sí | Ordena el registro y alimenta `lastModified` del sitemap |
| `title` | texto multiidioma | sí (ES) | |
| `summary` | texto multiidioma | sí (ES) | Una frase. Alimenta el índice **y** la descripción para buscadores |
| `body` | bloques multiidioma | no | **Vacío = la entrada vive solo en el índice, sin página propia** |
| `cover` | referencia a media | no | |
| `stationSlug` | referencia a estación | no | Hace que la entrada aparezca sola en la ficha de esa estación |
| `citySlug` | referencia a ciudad | no | Ídem para la página de la ciudad |
| `featured` | booleano | no | Portada del registro |
| `status` | `borrador` \| `publicado` | sí | |
| `dataStatus` | `placeholder` \| `verified` | sí | Trazabilidad. `placeholder` pinta la marca de dato provisional |

### Bloques admitidos en `body`

`parrafo` · `subtitulo` · `lista` · `cita` (texto + autor + rol) · `media`

Cualquier CMS con texto enriquecido por bloques sirve: **Portable Text** de Sanity y el **rich text** de Contentful mapean 1:1. Lo que **no** sirve es un campo de Markdown o HTML libre: metería formato dentro del dato y quitaría el control sobre composición, jerarquía de encabezados y accesibilidad que hoy tiene `PostBody.tsx`.

---

## 4 · Requisitos que deciden la elección

1. **Un solo editor.** Confirmado con el usuario. **No hacen falta roles, permisos ni flujos de aprobación** — eso descarta pagar por planes de equipo.
2. **El editor no es desarrollador.** La interfaz de edición tiene que ser usable sin vocabulario técnico.
3. **Tres idiomas con el español obligatorio y los otros dos opcionales.** Es el modelo exacto del sitio (`Localized`). El CMS debe permitir publicar una entrada solo en español sin bloquear nada, y debe hacer visible qué falta.
4. **Texto enriquecido por bloques**, no Markdown libre (ver arriba).
5. **Referencias a estación y ciudad**, elegidas de una lista — nunca texto libre.
6. **Webhook al publicar**, para disparar el rebuild. Sin esto seguimos dependiendo de un desarrollador.
7. **Gestión de imágenes** con recorte y formatos modernos, o al menos originales limpios que consuma el pipeline de Next.
8. **Salida sin bloqueo de proveedor.** §2 exige no cerrar caminos: el contenido debe poder exportarse entero.

---

## 5 · Candidatos

> ⚠️ **Los precios cambian y no los verifico aquí.** Hay que confirmarlos en la web de cada proveedor antes de decidir. Lo que sigue compara **encaje técnico y operativo**, no coste exacto.

| | **Sanity** | **Keystatic** | **Contentful** |
|---|---|---|---|
| Modelo de texto enriquecido | Portable Text — **encaje 1:1** | Bloques configurables | Rich text — encaje 1:1 |
| Multiidioma con idiomas opcionales | Por convención de campo; funciona bien | Por convención | **Nativo**, con fallback entre idiomas: el modelo más parecido al del sitio |
| Editor no técnico | Muy bueno | Correcto, más austero | Muy bueno |
| Dónde vive el contenido | Servicio alojado | **En el propio repositorio (git)** | Servicio alojado |
| Coste para **un** editor | Plan gratuito generoso | **Sin coste de proveedor** | El gratuito es el más limitado de los tres |
| Configuración | En código, la hace un dev una vez | En código, la hace un dev una vez | En interfaz |
| Riesgo de bloqueo | Bajo (exportable) | **Ninguno: es tu repo** | Medio |

### Recomendación

**Sanity**, por tres razones concretas de este proyecto:

1. Portable Text es literalmente el modelo de bloques que ya construí. La migración es mapeo, no rediseño.
2. La experiencia de edición es la mejor de las tres para alguien que no es desarrollador, y el plan gratuito cubre un editor.
3. Trae pipeline de imágenes propio, que es justo lo que hoy no existe.

**Alternativa si el criterio dominante es coste cero y no depender de nadie: Keystatic.** El contenido se queda en el repositorio, publicar es un commit —que es lo que ya pasa— y no hay proveedor que pueda subir precios ni cerrar. A cambio, el editor necesita cuenta de GitHub y la gestión de imágenes es más pobre.

**Contentful** solo si el multiidioma resulta ser el punto de dolor: su modelo de idiomas con fallback es el más parecido al del sitio. Pero es el más caro de los tres para lo que necesitamos.

---

## 6 · Lo que falta decidir (no es trabajo de código)

| # | Decisión | Impacto |
|---|---|---|
| C1 | **Qué proveedor** | Es una decisión de compra: coste, contrato, cuenta. Bloquea todo lo demás |
| C2 | **Dónde se aloja el sitio** | El webhook de publicación necesita un destino que sepa reconstruir. Hoy no está decidido |
| C3 | **¿Las rutas del registro siguen siendo 100% estáticas?** | Hoy sí (`dynamicParams = false`), y eso garantiza el 404 correcto. Con CMS, una entrada nueva no existe hasta el rebuild. Con rebuild por webhook basta; si se quiere publicación instantánea hay que revisar esa garantía |

**No he montado el webhook de publicación a propósito:** sin proveedor elegido (C1) y sin destino de despliegue (C2), sería un endpoint que nadie llama. Se construye en cuanto C1 y C2 estén cerradas, y es trabajo de horas, no de días.

---

## 7 · Qué pasa el día que se conecte

1. Crear la colección `post` en el CMS con el modelo de §3.
2. Cargar las entradas de arranque (hoy en `content/data/posts.ts`) y **confirmar sus fechas reales**, que siguen marcadas como provisionales.
3. Sustituir el cuerpo de `fetchPosts()` en `lib/data/posts-source.ts`.
4. Conectar el webhook de publicación al despliegue.
5. Borrar `content/data/posts.ts` y quitarlo de `SOURCES` en `lib/i18n/audit.ts`.

El paso 5 importa: la auditoría de idiomas dejará de cubrir el registro cuando el contenido viva fuera del repositorio. **Esa cobertura hay que reponerla en el CMS** — como campo obligatorio, como aviso al editor o como comprobación en el webhook. Si no, vuelve el fallo que la auditoría existe para impedir: contenido publicado a medias en un idioma, en silencio.
