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

---

## Bloque 6 · Skills — 2026-08-12

**Por qué:** las Skills eran ensayos, no reglas. Prohibían explícitamente los chips decorativos, el exceso de cards y los placeholders de plantilla, y el sitio implementado tenía las tres cosas: no impidieron nada porque no contenían un solo criterio verificable.

| Cambio | Detalle |
|---|---|
| Los principios salen de las Skills | Viven una sola vez en el Master Project Definition. Las Skills lo referencian en lugar de repetirlo. Se elimina la triple copia de "complejidad detrás / simplicidad delante", de la doble pregunta y del ritmo visual. |
| Cada checklist pasa a ser verificable | Umbrales numéricos donde antes había adjetivos: contraste, objetivos táctiles, gradientes por vista, placeholders por página, estructuras repetidas, medida de línea, overflow, enlaces muertos, recargas de documento. |
| `voltop-review-gate` pasa de duplicar a orquestar | Deja de reescribir el contenido de las otras seis. Incorpora los comandos a ejecutar y la tabla de aserciones a medir. |
| Cuatro huecos sin dueño, cubiertos | Modelo de contenido/datos e i18n → `voltop-design-system`. Cumplimiento legal de datos (Ley 1581) → `voltop-quality-compliance`. Pipeline y función narrativa de assets → `voltop-art-direction-ui`. |
| Contradicciones skill↔código resueltas | La skill exigía mobile-first y tipografía fluida mientras el código era desktop-first sin `clamp()`. Ahora el código cumple la regla. |
| Reglas nuevas derivadas de fallos reales | "Ningún control decorativo que simule interacción" · "Nunca ligar la opacidad de contenido a `scrollYProgress`" · "Ninguna interna puede aportar menos que su preview" · "Un titular es un contrato" · "ARIA completa o ninguna" · "Un enlace sin destino no se publica". |

De 341 a 480 líneas: la redundancia desapareció, pero la cobertura creció porque cuatro dominios no tenían dueño y ninguna checklist era medible. No era un problema de tamaño, era de eficacia.

---

## Bloque 7 · Auditoría y Fase 0 — 2026-08-28

**Por qué:** una auditoría sobre el build de producción (navegador real a 1440/1024/768/390, contraste calculado, scan de overflow en 11 anchos, inspección de DOM) encontró que el andamiaje estaba bien y el producto no. Ocho fallos impedían publicar, y ninguno era opinable. Este bloque cierra esos ocho; el resto del plan (jerarquía, `/red` como producto, ritmo) queda en la cola.

### Lo que estaba roto

| Cambio | Razón |
|---|---|
| El panel del menú móvil sale del `<header>` | `backdrop-filter` convierte al header en bloque contenedor de sus descendientes `position: fixed`. Con el panel dentro, `top-16 bottom-0` se resolvía contra los 65px del header: el panel medía **1px de alto**. El menú abría, bloqueaba el scroll y movía el foco a enlaces invisibles. **En móvil no se podía navegar el sitio.** Verificado tras el arreglo: 780px de alto, 4 enlaces visibles, Escape devuelve el foco al botón. |
| `z-(--z-header)` y `z-(--z-overlay)` en lugar de `z-50` a mano | Los tokens de z-index existían desde el Bloque 1 y no se usaban en ningún componente. Header y panel declaraban ambos `z-50`, que es lo que impedía razonar sobre el orden de pintado y ocultó el fallo anterior. |
| `template.tsx` anima solo `transform`, sin `opacity` | Motion serializa el estado inicial como estilo EN LÍNEA, así que el HTML servido llevaba `opacity: 0` en el `<div>` que envuelve **todas** las páginas. Si el JS fallaba, el sitio entero era invisible; y el elemento LCP arrancaba a opacidad 0. `useReducedMotion()` devuelve `null` en servidor, así que incluso quien pedía menos movimiento recibía la página invisible hasta la hidratación. |
| Red de seguridad en CSS para los `Reveal` (`[data-reveal]`) | Mismo mecanismo, 5–12 bloques por página. Dos reglas —`@media (scripting: none)` y `@media (prefers-reduced-motion: reduce)`— garantizan el contenido visible **sin depender de JavaScript**, y quien pide menos movimiento lo ve ya en el HTML servido, sin parpadeo. Verificado: 0 de 5 reveals invisibles con reduced-motion. |
| Token nuevo `--color-line-control` (blanco 36%) | `--color-line` daba **1.25:1** y `--color-line-strong` **1.68:1**, y eran el límite visual de los 5 inputs, el textarea, el buscador de `/red`, los chips, los tabs y los botones con borde. En un control, el borde ES lo que lo hace reconocible: WCAG 1.4.11 exige ≥3:1. El token nuevo da 3.20–3.32:1 sobre las cuatro superficies. Se creó aparte en lugar de subir `line`: las hairlines estructurales (reglas de tabla, divisorias) no identifican controles y subirlas habría cambiado la textura de todo el sitio para cumplir un umbral que no les aplica. |
| `PendingTag`: borde `warn/40` → `warn/50` | 2.52:1 → 3.29:1. |
| `required` y `aria-required` en el formulario de leads | El componente `Field` recibía `required` y **nunca lo pasaba al `<input>`**. El asterisco era decoración pura, sin leyenda que lo explicara, y ningún lector de pantalla anunciaba el campo como obligatorio (WCAG 3.3.2). Se añade leyenda `requiredLegend` y el asterisco pasa a `aria-hidden`: la obligatoriedad la comunica el atributo, no el símbolo. |
| Foco gestionado al confirmar el envío | El formulario se desmontaba y el foco se quedaba en un botón que ya no existía. |
| `CRM_ENABLED` y copy de éxito honesto | `submitLead` descarta el payload, y el estado de éxito afirmaba *"un especialista revisará tu caso y te escribirá… respondemos en uno o dos días hábiles"*. Era falso, en el punto de mayor consecuencia comercial, y el aviso de demo estaba en mono de 12px debajo del botón. Ahora el aviso va **antes** de pedir el dato y la confirmación dice lo que de verdad pasó. El copy real ya está escrito y traducido en `leadForm.success`: al conectar el CRM se pone el interruptor en `true`. No se ofrece canal alternativo porque no hay correo ni teléfono confirmados en el dataset (§33). |
| `aria-pressed` en los cuatro grupos de filtros de `/red` | Se emitía solo en el grupo de disponibilidad: ciudad, conector y potencia comunicaban su selección **únicamente con color** y eran invisibles para un lector de pantalla (WCAG 4.1.2). Verificado: los 12 chips declaran estado. |
| El rótulo del hueco de media se replantea en composiciones a sangre | A 390px se pintaba centrado arriba, con la descripción en dos líneas, **encima del eyebrow y del titular del hero** — texto sobre texto en la primera pantalla del sitio, que es justo lo que §22 prohíbe. Ahora con `fill` se reduce a la insignia, se ancla a una esquina y desaparece bajo `sm`; el hueco se sigue anunciando por `aria-label`. Sin `fill` conserva insignia y descripción, donde nada compite. |
| `Media` acepta `aspect` como prop | Pasar el recorte por `className` no sustituía la clase nativa, la acompañaba: `/empresas` servía `aspect-[4/3] aspect-[21/9]` en el mismo elemento y cuál ganaba dependía del orden de emisión del CSS. |
| `mediaPlaceholder` en la capa de copy | `"Foto"`, `"Video"` y `" · pendiente"` estaban escritos en línea en `Media.tsx`: la versión inglesa mostraba **"FOTO · PENDIENTE"**. Es exactamente el fallo que §36.15 existe para impedir, y era visible en producción. |
| 404 con marca para rutas sin idioma (`app/not-found.tsx`) | `/es/ruta-inexistente` servía el documento de error interno de Next: sin `<html lang>`, sin estilos, sin header ni footer y sin una sola señal de que el sitio fuese de Voltop. Lo recibía justo quien llega desde un enlace roto de terceros. |
| `[lang]/layout.tsx` deja de llamar a `notFound()` | Lanzar en el layout significaba lanzar **antes** de emitir el documento, así que Next no tenía dónde montar el 404. Ahora el documento se emite siempre con un idioma seguro, el rechazo lo hace la página (todas conservan su guarda `isLocale`) y la metadata marca `noindex` para el idioma inválido. |

### El 404, completo

Cerrar el 404 obligó a una decisión de arquitectura, tomada explícitamente: **layout raíz con `<html lang>` fijo y el idioma real en un `<div lang>`**.

| Cambio | Razón |
|---|---|
| `app/layout.tsx` emite el documento; `[lang]/layout.tsx` deja de emitirlo | Sin layout raíz Next no resuelve los boundaries de `not-found`. El precio es que `<html lang>` no puede ser dinámico —un layout raíz no recibe `params`— y queda en el idioma por defecto. §28 (decisión confirmada nº14) pedía el `lang` correcto en el HTML servido, y esto lo relaja. |
| El idioma real se declara en un `<div lang>` que envuelve el contenido | Los lectores de pantalla honran el `lang` más cercano al nodo, así que la pronunciación sigue siendo correcta; para buscadores el idioma lo declaran los `hreflang` y las `alternates` de cada ruta, que ya estaban bien. Verificado en `/en`: `<html lang="es-CO">` + `<div lang="en">`. |
| `dynamicParams = false` en `[lang]`, `red/[ciudad]` y `red/estacion/[slug]` | El layout raíz **no bastó**: en Next 16 un `notFound()` lanzado desde una página no resuelve ningún boundary en este árbol de rutas, ni el anidado ni el de raíz. Servía un documento con el `<body>` VACÍO y el 404 solo aparecía tras hidratar: un crawler veía una página en blanco. Con los params cerrados el rechazo lo hace el ROUTER, antes de renderizar nada, y ese 404 sí aterriza en `app/not-found.tsx`. Es además lo correcto para rutas generadas desde datos: un slug inexistente no debe renderizarse bajo demanda. No cuesta flexibilidad — el sitio ya es estático por completo. |
| Se elimina `app/[lang]/not-found.tsx` | **Nunca se renderizó.** Con los params cerrados es además inalcanzable. Se borra en lugar de dejarlo como archivo decorativo. |
| El 404 único monta Header y Footer | En un callejón sin salida no hay `Locale` fiable que deducir —el idioma inválido es a menudo la causa del 404— y tener navegación completa vale más que acertar el idioma: quien escribió mal una URL de estación quiere seguir navegando, no solo dos botones (§10). |

Cinco casos verificados server-side con HTTP 404, contenido real en el HTML, header, footer y `<html lang>` correcto: `/xyz` · `/fr` · `/es/ruta-inexistente` · `/es/red/estacion/no-existe` · `/es/red/no-existe`.

Descubierto de paso: la alternativa sin compromiso —dos raíces reales, `(es)/` y `(en)/`— exigía duplicar el árbol de rutas completo y habría matado la escalabilidad de "añadir un idioma = añadir una entrada". Se descartó por eso, no por coste de implementación.

### Evidencia

`tsc --noEmit` sin errores · `eslint app components lib content` sin problemas · build con 29 páginas estáticas · cero overflow horizontal en 11 anchos × 5 rutas (y revalidado en 6 anchos × 6 rutas tras el layout raíz) · menú móvil verificado en navegador a 390px · contraste de bordes de control medido a 3.20–3.32:1 · `required`/`aria-required` y `aria-pressed` comprobados en el DOM renderizado · 0 reveals invisibles con `prefers-reduced-motion`.

---

## Bloque 8 · Fase 1 — conectar el design system que ya estaba escrito — 2026-08-28

**Por qué:** la auditoría encontró que los tokens y las APIs estaban bien pensados y **no se usaban**. El registro dual Silencio↔Impacto —decisión visual confirmada nº8— se aplicaba a mano en un solo componente; los tokens de z-index y de motion existían y ningún componente los consumía; y `Container` centraba cada ancho por separado, así que el borde izquierdo del contenido saltaba entre secciones. Nada de este bloque es rediseño: es cablear lo que ya existía.

### El riel

| Cambio | Razón |
|---|---|
| `Container` gana `align`; `narrow` cuelga del riel de `content` | Cada ancho se centraba de forma independiente. Medido a 1440px: header y `content` en 148px, `wide` en 48px, `narrow` en 380px. En `/nosotros` el riel iba 380 → 148 → 380 → 148 al bajar, y en la ficha de estación el bloque de foto sobresalía 100px a la izquierda del titular. Ahora hay UN riel y `narrow` es una columna de lectura colgada de él, no un bloque flotando en el centro. Verificado: las siete rutas alinean su contenido en 148px, igual que el logo. |
| `align="center"` como excepción declarada | `BusinessIntro` y `VisionQuote` SÍ están centradas a propósito (§12, contraste compositivo). Al declararlo, se distingue de un descuadre accidental. |
| `wide` se reserva a MEDIA | Es el único ancho que rompe el riel, y lo hace a los dos lados por igual: un sangrado deliberado. `NetworkIndex` —una tabla de DATOS— estaba en `wide`: era el peor descuadre del sitio y además repartía cuatro columnas en 1500px, dispersando la información. Pasa a `content`. La media de la ficha de estación también baja a `content`. |

### El registro medio

| Cambio | Razón |
|---|---|
| Nuevo `SectionHeading` con tres tamaños (`l` 52 / `m` 36 / `s` 24) | Las internas saltaban de un `h1` de 72px a `h2` de **12px**: el encabezado de sección era más pequeño que el párrafo que introducía. Sin registro intermedio no hay jerarquía, solo un título gigante y una lista plana. Verificado tras el cambio: la ficha de estación pasa de `72·12·12·12` a `72·36·24·24`. |
| Cero encabezados en mono de 12px | Eran doce: `/red/[ciudad]` ×2, `/red/estacion` ×4, `/legal` ×1, `/empresas` ×3, `/nosotros` ×1, footer ×3. |
| Los títulos de columna del footer pasan de `<h2>` a `<p>` | El mono de 12px es correcto ahí: es una etiqueta, no un encabezado. Como `<h2>` entraba en el outline del documento al mismo nivel que los `h2` de contenido y los enanizaba. La navegación del pie ya se anuncia por el `aria-label` del `<nav>`. |
| Once `<Eyebrow>` + `<h2 className="mt-4 font-display text-display-l …">` escritos a mano se consolidan | Se repetía con clases ligeramente distintas en cada página. |

El efecto colateral es el que se buscaba: el mono de 12px deja de hacer nueve trabajos y vuelve a ser lo que era, `kicker` y etiqueta de dato.

### Registro dual, motion y apilado

| Cambio | Razón |
|---|---|
| `register="impacto"` en los cuatro beats de impacto | La decisión visual nº8 se aplicaba a mano en `CloseCta` y en ningún otro sitio: el concepto vivía en la documentación, no en el código. Ahora `Hero`, `InfrastructureSignature`, `ProofCase` y `CloseCta` pasan por la API. |
| `impacto` NO aplica `overflow-hidden` | Al cablearlo se detectó que habría roto el `position: sticky` del signature moment: un `overflow` distinto de `visible` crea un contenedor de scroll. Es el mismo motivo por el que `body` usa `overflow-x: clip` y no `hidden`. Cada sección declara su recorte. Verificado con Lenis desactivado: `overflow: visible` y el panel clavado en 0 en todo el recorrido. |
| `Section` acepta `ref` | El signature moment necesita medir su propio scroll y por eso era el único beat que no podía usar la primitiva. |
| Nuevo `lib/motion.ts`; cero curvas a mano en componentes | Había dos sistemas de movimiento en paralelo: `@theme` declaraba tres curvas y cinco duraciones —tres sin usar en ningún sitio— mientras los componentes escribían `[0.22, 1, 0.36, 1]` y `0.6/0.7/0.32` a mano en tres archivos. Cambiar el tempo del sitio exigía editar CSS y JS por separado sin garantía de que coincidieran. **Limitación dicha en el propio archivo:** es un espejo, no una fuente compartida — Tailwind lee CSS y Motion necesita valores de JS. |
| `z-(--z-raised)` en lugar de `z-10` | Completa el trabajo del Bloque 7: cero `z-index` a mano en el proyecto. |

### Disciplina de CTA

| Cambio | Razón |
|---|---|
| El CTA del header pasa a `secondary` | El hero mostraba DOS gradientes primarios con el mismo texto y el mismo destino ("Encontrar cargador"), a 400px de distancia. §12 y §36.9 son explícitos: máximo una acción primaria con gradiente por vista. El header es siempre secundario respecto a la acción de la página, así que no hace falta lógica condicional. Verificado a 1440, 480 y 390px: una sola acción con gradiente en cada vista. |
| El selector de idioma sale del header móvil y baja al menú | Ocupaba 88px del espacio más valioso de la pantalla para un control de baja frecuencia, y ese espacio lo necesitaba el CTA. |
| El CTA aparece en el header desde `xs` (480px) | Antes era `hidden md:block`: no había CTA persistente en móvil. Por debajo de 480px no caben logo + CTA + hamburguesa sin apretar, así que ahí vive en el menú —que ahora funciona—. Primer uso real del token `--breakpoint-xs`, que estaba definido y sin usar. |
| Dentro del menú el CTA sí es primario | No compite con ninguna acción de la página, así que es la única con gradiente en la vista. |

### Remate

`SpecList` gana `tone` para distinguir cifra de texto, y la ficha técnica pasa de 4×1 a 2×2. Cuatro columnas dentro de la columna de contenido dejaban 128px útiles por celda: "Lunes a domingo, 6:00–22:00" envolvía en tres líneas a cualquier ancho, incluido 1440, estiraba la fila a 150px y dejaba los otros tres valores flotando en vertical. Una potencia es un dato y merece escala de display; un horario es texto y se lee mejor en cuerpo.

### Evidencia

`tsc --noEmit` sin errores · `eslint app components lib content` sin problemas · build correcto · riel verificado en 7 rutas a 1440px · jerarquía verificada en el DOM renderizado · `sticky` verificado con Lenis desactivado · gradientes por vista contados a 1440/480/390px · menú móvil verificado a 390px (780px de alto, 6 enlaces, foco correcto) · cero overflow horizontal en **9 anchos × 8 rutas**.

---

## Bloque 9 · Fase 2 — /red como producto — 2026-08-28

**Por qué:** `/red` es la superficie del journey B2C principal y ofrecía un campo de texto y cuatro grupos de chips. En móvil el primer resultado quedaba a **695px de scroll**: casi el viewport entero de andamiaje antes del contenido. No había orden, el estado no se podía compartir, y el filtrado estaba duplicado.

### Lo que NO se hizo, y por qué

**El mapa sigue sin construirse.** Está bloqueado por dos frentes a la vez: las cuatro estaciones tienen `geo: null` y O7 (proveedor de mapa) sigue abierta. Geocodificar las direcciones sería inventar datos con una fuente no verificada, contra la regla inviolable del proyecto; y dibujar un esquema sin coordenadas reales es volver al "SVG estático que prometía tiempo real" que el Bloque 3 eliminó. Se prefiere no tenerlo a tenerlo falso.

Lo que sí se hizo es dejar la arquitectura lista: `distanceKm`, `sortStations` con criterio `distance` y `hasCoordinates` viven en la capa de datos, y la UI de cercanía está **condicionada por datos**. Hoy no se renderiza —verificado: ni la opción de orden ni el botón de ubicación existen en el DOM—. Se enciende sola cuando el dataset traiga coordenadas. Es el patrón que el proyecto ya usa: `MetricRow` no pinta métricas sin validar y la franja de partners se omite sin logos (§33).

### La herramienta

| Cambio | Razón |
|---|---|
| Filtros colapsados en móvil, siempre abiertos desde `lg` | Los cuatro grupos envuelven a dos filas cada uno. El recuento de activos va en el disparador: colapsar no puede esconder estado. |
| Reorganización del encabezado de la herramienta | Las etiquetas visibles y el selector de orden en su propia fila costaban 105px en móvil. Ahora: fila 1 el buscador, fila 2 `[Filtros] [Orden]` juntos, con las etiquetas en `sr-only` bajo `lg` —el campo tiene icono y placeholder, el selector muestra su valor— sin perder nada para lectores de pantalla. En desktop las etiquetas vuelven y el orden recupera su sitio junto al buscador vía `lg:contents`, sin duplicar el `<select>`. |
| `pt-32` → `pt-24` en la apertura de `/red` | 64px de aire muerto bajo un header de 64px en una superficie de producto. El lead pasa a alinearse a la baseline del titular en lugar de flotar a la derecha creando un hueco en L. |
| **Resultado: el primer resultado pasa de 695px a 502px en móvil** | Se ven dos estaciones completas sobre el fold en lugar de ninguna. |
| Hay ORDEN: recomendadas / más potencia / en operación primero / ciudad | No existía. Nadie busca "Grand Hyatt": se busca la más potente o la que está operativa. `<select>` nativo a propósito — teclado, lector de pantalla y la rueda de iOS/Android salen gratis. Verificado: los tres criterios reordenan la lista. |
| El buscador PARECE un buscador | Icono, borde de control a 3:1 y botón de limpiar (que usa `red.search.clear`, un token de copy que llevaba sin usarse). Antes era una hairline de 1.25:1 con un placeholder de 24px en gris: se leía como contenido, no como control. |
| El recuento sube de 12px mono a `display-s` | Es el feedback central de la herramienta y era el texto más discreto de la sección. |
| La etiqueta del grupo de disponibilidad deja de duplicar su chip | El `legend` decía "SOLO EN OPERACIÓN" y el único chip dentro decía lo mismo. Ahora el grupo dice de qué es ("Disponibilidad") y el chip qué hace. |
| Cuatro columnas de resultados desde `lg`, no desde `md` | A 768px metía cuatro celdas en el ancho de tablet y "En operación" quedaba tocando el borde del contenedor (§22). Igual en `/red/[ciudad]`. |

### El estado vive en la URL

Un resultado filtrado se puede compartir: `?ciudad=medellin&kw=100&orden=power` llega aplicado, con los chips marcados y el orden puesto. Verificado.

Dos decisiones de implementación que costaron dos intentos y conviene dejar escritas:

- **`history.replaceState`, no `useSearchParams`.** Esta ruta es estática y `useSearchParams` la volvería dinámica.
- **La URL se escribe desde la ACCIÓN, no desde un efecto que observe el estado.** Con dos efectos reactivos —uno que lee de la URL al montar y otro que escribe— ambos corrían en el mismo commit y el segundo borraba la query string, con el criterio todavía vacío, antes de que el primero cuajara.
- Y el criterio se consolidó en **un** objeto: seis `useState` sueltos obligaban a seis asignaciones para hidratar y a seis dependencias en cada `useMemo`.

**Limitación asumida:** un enlace filtrado es compartible pero **no indexable** — el HTML servido siempre trae la lista completa. La cobertura indexable por ciudad ya la dan las rutas `/red/[ciudad]`, que era el motivo SEO original.

### Tab ≠ chip

El selector de `/empresas` y los filtros de `/red` eran visualmente **idénticos** —pastilla, borde de marca, relleno tenue— para dos semánticas opuestas: filtrar una lista frente a cambiar de vista. Y nada indicaba que hubiera un panel debajo que cambia.

Ahora el tab es una lengüeta: se apoya en la misma línea que separa el panel y la activa la interrumpe con una barra de marca. La conexión entre control y contenido es visual, no solo declarada en ARIA. El patrón ARIA completo se conserva — verificado: `ArrowRight` mueve selección, foco y panel.

### La conversión final, por fin medida

| Cambio | Razón |
|---|---|
| Nuevo `DirectionsButton` que emite `estacion_como_llegar` | Es la conversión final del journey B2C, estaba declarada en el plan de medición y **no se emitía nunca** (§31). La ficha es un Server Component, así que el clic había que aislarlo en una isla mínima. |
| `Button` con `external` anuncia el destino y cambia la flecha | "Cómo llegar" saltaba a Google Maps sin icono, sin texto y sin aviso a lectores de pantalla (WCAG 3.2.5). Ahora la flecha de dirección se convierte en flecha de salida y un `sr-only` lo dice. Aplica a todo enlace externo del sitio, no solo a este. |
| `filterStations` de la capa de datos sustituye la copia local | `StationFinder` reimplementaba la misma lógica con su propia copia de `normalize`. Era justo la duplicación que la capa existe para evitar. |

### Evidencia

`tsc --noEmit` sin errores · `eslint app components lib content` sin problemas · build correcto · primer resultado en móvil medido a 502px (antes 695) · enlace compartido verificado con tres parámetros · tres criterios de orden verificados · cercanía verificada como ausente del DOM sin coordenadas · aviso de enlace externo verificado en el DOM · navegación por teclado de los tabs verificada · cero errores de consola · cero overflow horizontal en **11 anchos × 9 rutas**.

---

## Bloque 10 · Fase 3 — ritmo, composición y contenido — 2026-08-28

**Por qué:** con lo roto arreglado y el sistema conectado, quedaba el ritmo. Dos problemas medidos: el signature moment gastaba 2.4 viewports para no pasar nada, y cada par de secciones de cada página interna dejaba 288px de negro vacío.

### El hueco de 288px no era un descuido: era una suma

`--spacing-section` valía 144px a 1440px y cada sección lo aplicaba **arriba y abajo**, así que dos secciones consecutivas sumaban. El propio comentario de `globals.css` prohibía exactamente eso —"prohibido usar el mismo padding en secciones consecutivas"— mientras el código lo hacía en todas las páginas.

| Cambio | Razón |
|---|---|
| Los tokens de sección pasan a significar **la distancia ENTRE secciones**; cada sección aporta la mitad (`--spacing-block-*`) | Un cambio en el mapa `spaces` de `Section` corrige los ocho huecos identificados. Y la alternancia vuelve a significar algo: `tight` tras `loose` da contraste real en lugar de sumar dos veces lo mismo. |
| **Medido: todos los huecos sistemáticos pasan de 288/289px a 144/145px** | La Home baja de 9.1 a 7.6 viewports; `/nosotros` de 6.4 a 5.6; `/empresas` de 6.0 a 5.4; `/red` de 3.6 a 3.2. |
| `--text-display-2xl--line-height`: 0.98 → 1.02 | Un interlineado por debajo de 1 aprieta descendentes y acentos en titulares de tres líneas, que es lo normal en español a 390px. |

### El signature moment

| Antes | Ahora |
|---|---|
| 240vh (2160px) = 2.4 viewports | **170vh (1530px) = 1.7** |
| Recorte del 12%, completo al 45% del recorrido | **28%, completo al 70%** |
| ~693px de pantalla congelada | ~189px |
| El comentario prometía "texto por fases"; era un único `Reveal` | Dos fases reales, con desfase |
| Con `prefers-reduced-motion`: 2160px de scroll muerto sin equivalente | **La sección colapsa a 599px y el panel deja de estar pegado** |

**Un intento fallido que conviene dejar escrito:** se probó a ligar la opacidad del texto a `scrollYProgress` para que las fases ocurrieran a lo largo del recorrido. Es justo lo que el comentario original del archivo ya advertía: una opacidad ligada al progreso **vuelve a 0 al retroceder**, así que el texto desaparecería al subir y quien llegara por `#infraestructura` sin desplazarse vería una pantalla vacía. Las fases se resolvieron con desfase temporal sobre un `whileInView` de una sola vez. El scroll largo ya no necesitaba relleno: se acortó.

### Todas las listas eran la misma lista

El tratamiento hairline + número mono + título + cuerpo se repetía **seis veces**: segmentos de la Home, pasos de "cómo cargar", capacidades de /empresas, beneficios del selector, pilares de /nosotros y contenidos legales. Eso —más que la repetición de layouts— es por lo que todas las páginas se sentían iguales.

La regla que las separa: **el número solo donde el orden significa algo.**

| Lista | Tratamiento | Por qué |
|---|---|---|
| Cómo cargar · Capacidades | Nuevo `ProcessList`: numeral de 52px en contorno como ancla visual | SÍ son secuencias: evaluar precede a instalar. |
| Pilares de /nosotros | Sin número, título a `display-m` | Cuatro criterios que no se negocian no tienen orden. Numerarlos era una señal falsa. |
| Beneficios del selector | Sin número, marca de verificación | "Qué incluye" es una lista de inclusión, no una secuencia. |
| Segmentos de la Home | Columnas separadas por hairlines verticales, sin caja y sin número | El comentario decía "no como tarjetas" y el código pintaba cuatro celdas con borde a los cuatro lados: exactamente las cards que §12 prohíbe. |
| Contenidos legales | `<ol>` real y más denso | Aquí el número SÍ informa: es un índice que el área legal irá cubriendo. Antes era un `<ul>` con números pintados a mano. |

### Contenido donde había vacío

La columna izquierda del bloque de contacto tenía un antetítulo, un titular y ~600px de nada al lado de un formulario alto. Ahora lleva **"Qué pasa después"** en tres pasos y la nota de privacidad — deliberadamente **sin compromiso de plazo**: mientras no exista integración de CRM, prometer un tiempo de respuesta es la misma falta que el estado de éxito corregido en el Bloque 7.

### El plan de medición, cerrado

| Cambio | Razón |
|---|---|
| Nuevo `TrackView`: emite un evento de vista una sola vez | `ciudad_vista`, `caso_visto` e `impacto_visto` estaban declarados y no se emitían. Son eventos de vista sobre Server Components, así que hacían falta islas mínimas. Verificado en `dataLayer`. |
| `red_buscar` deja de duplicarse | Se emitía en CADA blur con valor: enfocar y desenfocar tres veces contaba tres búsquedas. Ahora solo si el término cambió. |

Siguen sin emitirse `app_store_click` y `media_reproducida`, y no pueden: no hay enlaces de tienda (O8) ni archivos de video (§32). Quedan declarados para cuando existan.

### Remates y limpieza

- **Señal de scroll en el hero.** `home.hero.scrollHint` estaba escrito y sin usar, y el hero mide 88dvh con un beat de 170vh debajo: no había nada que indicara que la página continúa.
- **`PendingTag` deja de contener una frase.** "TARIFA PENDIENTE DE CONFIRMACIÓN COMERCIAL." era una oración con punto final, en mayúsculas y en mono, dentro de un recuadro de 11px. Ahora el tag dice "Pendiente" y la frase va debajo como nota.
- **Copy y funciones muertas fuera:** `seeAllStations`, `openInApp`, `downloadApp`, `seeImpact`, `playVideo`, `pendingData`, `filters.title`, `cities.seeCity`, `proof.lead`, `units.kw`, `units.points`, `getFeaturedStations`, `getOperationalStations`, `getFeaturedMetrics`, `getBusinessSegment`, `getCaseForSegment`.
- **`eslint.config.mjs` ignora `.claude/`.** `npx eslint .` devolvía 147 warnings de las skills instaladas y enterraba los del proyecto. Ahora sale limpio.
- **`shot.mjs` reescrito.** Estaba obsoleto y por tanto no verificaba nada: apuntaba a `#infra-medellin`, `#red-preview`, `#empresas-preview` y `#caso-ean` —anclas que ya no existen—, a `/red/san-fernando-plaza` cuando la ruta es `/red/estacion/<slug>`, y a URLs sin prefijo de idioma. Ahora recorre las rutas y anclas reales, cubre los cuatro contextos de §22 y falla con código de salida si detecta overflow.

### Evidencia

`tsc --noEmit` sin errores · `npx eslint .` sin problemas (antes 147 warnings) · build correcto · huecos verticales remedidos en cuatro rutas · sección del signature moment medida con y sin `prefers-reduced-motion` · recorte del clip-path muestreado en cuatro puntos del recorrido · `ciudad_vista` e `impacto_visto` verificados en `dataLayer` · cero errores de consola en 10 rutas · cero overflow horizontal en **11 anchos × 10 rutas**.
