# Registro de ejecución

> Bitácora viva de la transformación. Qué cambió, por qué, y con qué evidencia se validó.
> La definición normativa vive en `docs/MASTER-PROJECT-DEFINITION.md`.

---

## Bloque 0 · Blindaje — 2026-08-12

**Por qué:** el proyecto no estaba bajo control de versiones. Cualquier cambio posterior era irreversible.

| Cambio | Detalle |
|---|---|
| Repositorio Git inicializado | Commit `f4ecc8f` captura el prototipo tal como quedó el 2026-07-24, antes de tocar nada. Punto de retorno seguro. |

---

## Bloque 1 · Tokens y fundamentos visuales — 2026-08-12

**Por qué:** los tokens condicionan todo lo demás. Cambiarlos después habría obligado a rehacer cada composición.

| Cambio | Razón |
|---|---|
| `--color-ink-3`: `#6d7789` → `#8b95a8` | El anterior daba 4.06–4.24:1 sobre las superficies del sistema y fallaba WCAG AA. Se usaba en casi todo el texto secundario del sitio: un solo token causaba entre 28 y 65 violaciones por página. El nuevo cumple ≥4.9:1 sobre canvas, surface-1, surface-2 y surface-3. |
| Tokens semánticos `--color-live`, `--color-warn`, `--color-idle` | Eliminan el único literal suelto que quedaba (`text-amber-400`) y dan un color legible a los marcadores de contenido provisional, que antes tenían 1.10:1. |
| Escala tipográfica fluida con `clamp()` | No existía escala: cada componente inventaba su tamaño (`md:text-7xl`, `md:text-6xl`, `md:text-5xl`…). Ahora hay nueve pasos con interlineado y tracking asociados, de 360px a 1440px, sin saltos duros entre breakpoints. |
| Escala de espaciado de sección (`tight` / `base` / `loose`) | Todas las secciones usaban `py-24 md:py-32`: el ritmo de página era plano por construcción. Ahora la intensidad se compone alternando tres valores. |
| Tokens de contenedor, z-index y duración | Elimina números mágicos y da una escala explícita. |
| Variables de tipografía renombradas a `*-raw` | `--font-display: var(--font-display)` era una autorreferencia: valor inválido en tiempo de cómputo. Funcionaba solo por orden de cascada. |
| `overflow-x: clip` en lugar de `hidden` | `hidden` crea un contenedor de scroll y habría roto el `position: sticky` del signature moment. |
| Se elimina `scroll-behavior: smooth` | Competía con Lenis: dos motores de scroll simultáneos. |

---

## Bloque 2 · Arquitectura — 2026-08-12

**Por qué:** tres fallos de fundamento (idioma, navegación, contenido acoplado) multiplicaban su coste con cada página nueva.

### i18n por ruta

Antes el idioma era estado de React. Cambiar a inglés y navegar devolvía al español, y el inglés no existía para los buscadores: toda la inversión bilingüe rendía cero en SEO.

Ahora: rutas estáticas con prefijo (`/es`, `/en`), `<html lang>` correcto en el HTML servido, `hreflang` recíproco con `x-default`, y un selector que conserva la ruta actual. `/` redirige a `/es`.

`Localized` pasa a exigir ambos idiomas: si `en` fuese opcional, el inglés caería al español sin dejar rastro.

### Navegación

Toda navegación interna migrada a `next/link`. Antes eran 30 `<a>` planos solo en la Home y cada clic recargaba el documento completo.

### Capa de contenido

Todo el copy sale del JSX a `content/copy/*`. Antes la mayoría de los textos visibles estaban escritos dentro de los componentes: sin flujo de traducción, sin revisión editorial posible y sin ruta a un CMS. Era el mayor defecto de escalabilidad y no se veía en ninguna captura.

### Capa de datos

`lib/data` se interpone entre las colecciones y los componentes. Ningún componente importa `content/data/*` directamente. Es lo que permitirá cambiar a CMS o API sin tocar la presentación.

### Modelo de datos v2

| Añadido | Para qué |
|---|---|
| `geo` | Mapa, "cómo llegar" y SEO local. `null` mientras no se reciban las coordenadas: no se inventan. |
| `media` | Fotografía y video por ubicación. |
| `pricing` | `null` mientras no esté confirmado comercialmente. |
| `citySlug` como referencia | La ciudad pasa a ser entidad; antes era texto libre (incluía `"Próximamente"` como si fuera una ciudad). |
| `dataStatus` | Trazabilidad por registro: nada se presenta como verificado si no lo está. |
| Colección **Ciudades** | Nueva ruta `/red/[ciudad]`: la búsqueda real del usuario es geográfica. |
| Registro de **media narrativa** | Punto único donde conectar los archivos cuando lleguen. Rellenar `src` desactiva todos los placeholders del sitio automáticamente. |

### Analytics

`lib/analytics` implementa el plan de medición completo con nombres de evento tipados. Antes había cero eventos y un comentario. La plataforma de destino sigue sin definir (decisión abierta O4): solo hay que implementar `dispatch`.

### Server Components

Todo era cliente. Ahora los componentes son de servidor por defecto y las islas de cliente se limitan a lo que tiene interacción real: cabecera, selector de idioma, buscador de estaciones, selector B2B, formulario y los dos componentes con motion.

---

## Bloque 3 · Composición y páginas — 2026-08-12

### Home

El hallazgo central de la auditoría era que cuatro beats consecutivos compartían la misma estructura (split a dos columnas alternando el lado de la imagen) y que el sistema de registro dual estaba programado pero nunca usado: el 100% de las secciones eran `silencio`.

Secuencia estructural nueva, sin dos beats consecutivos iguales:

| Beat | Estructura | Intensidad |
|---|---|---|
| 1 · Hero | Full-bleed, contenido anclado abajo, columna única | Alta |
| 2 · Infraestructura | Sticky con scroll-scrub | MUY ALTA |
| 3 · La red | Índice ancho, denso, sin media | Media |
| 4 · Empresas | Columna estrecha centrada, aireada | Media-baja |
| 5 · Caso real | Full-bleed con la cita encima del material | Alta |
| 6 · Visión | Columna estrecha + franja ancha debajo | Media-alta |
| 7 · Cierre | Asimétrico, dos audiencias | Alta |

Otros cambios:
- **Constelación de nodos eliminada.** Era el cliché visual del sector, contradecía el reencuadre 70% mundo real / 30% comportamiento, y en tablet vertical se superponía al titular.
- **Cero placeholders "XX".** Había diez en la Home. Con ninguna métrica validada, mostrarlas destruía la credibilidad. La estructura para mostrarlas sigue lista y se activa sola cuando `validated` pase a `true`.
- **Franja de cobertura real en el hero.** Sustituye a las cifras inventadas con datos que sí existen (ciudades) y abre una segunda entrada al journey B2C.
- **Gradiente de 17 apariciones a 6.** Deja de ser textura y vuelve a ser señal.

### /red

Era la página núcleo del journey B2C y no funcionaba: los filtros eran `<span>` decorativos, el "mapa" un SVG estático con puntos que no correspondían a ninguna estación, y el titular prometía tiempo real.

Ahora es una herramienta: búsqueda por nombre o ciudad tolerante a acentos, cuatro filtros operativos, recuento anunciado a lectores de pantalla, estado vacío accionable y cobertura por ciudad enlazada. El titular ya no promete lo que el producto no hace, y la ausencia de datos en tiempo real se declara explícitamente.

### /red/[ciudad] · nueva

Cobertura local con sus estaciones, metadata propia y enlaces cruzados.

### /red/estacion/[slug]

Migrada de `/red/[estacion]`. Añade migas de pan, ficha técnica, servicios, "cómo llegar" (búsqueda por dirección mientras no haya coordenadas, con la limitación declarada), estaciones cercanas y datos estructurados `EVChargingStation`.

### /empresas

El orden estaba invertido: el formulario aparecía junto al selector, pidiendo el lead sin haber probado nada, contra el principio explícito de "confianza antes de pedir el dato".

Orden nuevo: propuesta → capacidades → selector de caso → **evidencia** → formulario. El segmento elegido prellena el formulario.

### /nosotros

Eran tres bloques (métricas, logos, dos testimonios) sin historia, sin criterios y sin liderazgo. Ahora: historia, cómo construimos (cuatro criterios), impacto, liderazgo y confianza.

El bloque de impacto **no inventa cifras**: mientras no haya datos validados declara que están en validación y lista qué se está midiendo. Cuando lleguen, el mismo componente muestra los números.

### Footer

De cinco columnas con quince enlaces (seis apuntaban al mismo destino con etiquetas distintas y cuatro eran `#`) a tres columnas con destinos reales. Se elimina el bloque de métricas duplicado y los iconos de redes sociales no interactivos. **Un enlace sin destino real no se publica.**

---

## Bloque 4 · Accesibilidad — 2026-08-12

| Corrección | Antes |
|---|---|
| Contraste AA en todo el texto | 28–65 violaciones por página |
| Skip link | No existía |
| Objetivos táctiles ≥44px | Enlaces de 17px en el footer, controles de 24–38px |
| Menú móvil: Escape, foco atrapado, bloqueo de scroll | Nada de lo anterior; `aria-expanded` se quedaba en `true` |
| Patrón de pestañas ARIA completo | `role="tab"` sin `tabpanel` ni `aria-controls`: peor que no poner ARIA |
| Formulario: errores asociados, `autocomplete`, resumen anunciado, foco al primer campo inválido | Solo validación nativa |
| **Consentimiento de datos (Ley 1581 de 2012)** | Se capturaban datos personales sin autorización. Bloqueante legal para publicar. |
| Jerarquía de encabezados sin saltos | `/red` pasaba de `h1` a `h3` |
| `lang` correcto en el HTML servido | Se corregía en cliente |

---

## Bloque 5 · SEO — 2026-08-12

`sitemap.ts` y `robots.ts` generados desde los datos (20 URLs, ambos idiomas), `metadataBase`, canonical y `hreflang` por página, y datos estructurados `EVChargingStation` por estación y `Organization` en la compañía.

Cada estación y cada ciudad es una landing de búsqueda local: el canal de adquisición B2C más barato del proyecto, que antes estaba sin explotar.

---

## Verificación

Ejecutada sobre el build de producción, 5 páginas × 5 viewports (1920 / 1440 / 1194 / 834 / 390).

| Comprobación | Resultado |
|---|---|
| `npm run build` | ✅ 25 páginas estáticas |
| `npx eslint .` | ✅ sin errores ni avisos |
| Contraste WCAG AA | ✅ 0 fallos reales |
| Objetivos táctiles ≥44px | ✅ |
| Skip link, landmarks, jerarquía de encabezados | ✅ |
| Overflow horizontal | ✅ 0 en los 5 viewports |
| Enlaces sin destino | ✅ 0 |
| Placeholders "XX" visibles | ✅ 0 |
| Idioma conservado al navegar | ✅ EN se mantiene entre páginas |
| Recargas completas de documento | ✅ 0 (navegación de cliente) |
| CTA contextual por ruta | ✅ presente en Home/Nosotros, ausente en Red, comercial en Empresas |
| Filtros de /red | ✅ filtran de verdad (4 → 1 al elegir Medellín) |
| Pestañas ARIA | ✅ completas, con navegación por flechas |
| Formulario | ✅ valida, anuncia y exige consentimiento |
| Menú móvil | ✅ foco atrapado, scroll bloqueado, cierra con Escape |
| `prefers-reduced-motion` | ✅ 0 elementos invisibles en ambos modos |
| Signature moment | ✅ recorte 12% → 0% con el scroll; el texto aparece y permanece |

### Bug encontrado y corregido durante la verificación

La opacidad del texto del signature moment estaba ligada al progreso de scroll y **volvía a 0** al salir del rango: el contenido desaparecía tras pasar la sección. Se separó el tratamiento — el material conserva el scroll-scrub, el texto se revela una vez y permanece. Un momento narrativo no puede depender de una interpolación que pueda devolverlo a cero.

---

## Pendiente

**Bloqueado por entrega externa:** archivos de video y fotografía · logo SVG · hex de marca confirmados · tipografías con licencia · métricas validadas · logos de partners con permiso · enlaces de las tiendas · definición del CRM y de la plataforma de analytics.

**No bloqueado, siguiente en la cola:**
- Sincronizar el estado del filtro de `/red` con la URL (compartible e indexable).
- Transiciones entre páginas ahora que la navegación es de cliente.
- Página de política de tratamiento de datos, requerida por el enlace del consentimiento.
- Imagen Open Graph.
- Medición de Core Web Vitals con red y CPU limitadas, y con medios reales integrados.
- Revisión del inglés como texto, no solo como mecanismo.
