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

---

## Bloque 9 · i18n preparado para un tercer idioma — 2026-08-31

**Encargo:** el sitio debe estar en español, inglés y **portugués de Brasil**. Decisión estratégica del CEO, orientada a audiencia de inversión. Se suma un espacio de comunicación (novedades) que se ejecuta en un bloque posterior.

**Por qué este bloque va primero y SIN añadir el idioma todavía:** la infraestructura de i18n enumeraba los idiomas a mano en nueve sitios distintos. Añadir `pt` antes de corregirlos habría producido fallos silenciosos —contenido servido en el idioma equivocado— mezclados con los fallos normales de una traducción nueva, sin forma de distinguir la causa. Este bloque se valida entero con ES/EN: si algo se rompe, no fue el idioma nuevo.

### Idiomas escritos a mano → derivados de `locales`

| Cambio | Razón |
|---|---|
| `lib/i18n/routes.ts`: nuevo `stripLocale()`, con el prefijo construido desde `locales` | La expresión `^\/(es\|en)` estaba duplicada en dos archivos y **las dos copias no eran iguales**: la de `Header.tsx` no llevaba el lookahead `(?=\/\|$)`, así que recortaba también el comienzo de cualquier ruta que empezara por "es" o "en" (`/estaciones` → `taciones`). Hoy ninguna ruta empieza así, pero el fallo estaba armado. |
| `lib/i18n/routes.ts`: nuevo `alternatesFor(lang, path)` | El bloque `canonical` + `languages` estaba copiado **siete veces** —layout de idioma, home, red, ciudad, estación, empresas, privacidad— con `es` y `en` escritos a mano en cada copia. Ninguna se habría enterado de un idioma nuevo: el portugués habría quedado publicado y huérfano de `hreflang`, que es la señal con la que Google decide qué versión sirve a quién. |
| `app/sitemap.ts`: la clave `hreflang` sale de `localeMeta`, no del segmento de URL | Coincidían en ES/EN, así que la diferencia era invisible. Con un idioma regional dejan de coincidir —URL `/pt`, buscador `pt-BR`— y el sitemap habría declarado sobre la misma URL un idioma distinto del que declara su HTML. Se añade además `x-default`, que el sitemap omitía y el HTML sí emitía. |
| `localeMeta` separa `htmlLang` de `hreflang` | No siempre coinciden: el español se declara genérico (`es`) para alcanzar a todo hispanohablante, mientras el documento se marca `es-CO`. Sin la separación, `pt-BR` habría forzado a elegir mal en uno de los dos sitios. |

### Ternarios de idioma → capa de copy

Un ternario `lang === "es" ? … : …` no tiene tercera rama: con un idioma más sirve la rama inglesa **en silencio**. Quedaban tres, y los tres en superficies que se propagan solas.

| Cambio | Razón |
|---|---|
| `opengraph-image.tsx` → `og.eyebrow` / `og.headline` en `content/copy/common.ts` | Es la imagen que se ve al compartir el enlace en WhatsApp, LinkedIn o Slack. Un idioma sin rama propia se anuncia en inglés justo donde el error se replica sin intervención. |
| Descripción SEO de la ficha de estación → `stationMeta.description` en `content/copy/red.ts` | Afectaba a **todas** las estaciones del sitio a la vez. Se modela como par `Localized` de **funciones**, no de cadenas con huecos: cada idioma ordena la frase a su manera y la traducción no se reduce a rellenar espacios. |
| Se corrige de paso `${city?.name}` sin guarda | Una estación sin ciudad resuelta imprimía literalmente `undefined` en la descripción que lee el buscador. |

Con esto se cumple §36.15 (todo el copy fuera del JSX) en los últimos tres sitios donde no se cumplía.

### Selector de idioma: control segmentado → desplegable

**Por qué:** cada opción necesita 44px de alto y ancho mínimos (§23), así que el control segmentado crecía ~44px por idioma —de 88px a 132px— en la zona más disputada del header, que **ya había expulsado el selector del header móvil por falta de sitio**. Un patrón que se ensancha con cada idioma no es escalable. El desplegable ocupa lo mismo con dos idiomas que con seis, y libera el espacio que necesita la cuarta entrada de navegación del bloque siguiente.

**Lo que se conserva:** siguen siendo enlaces, no botones de estado. El idioma vive en la URL, y por eso sobrevive a la navegación y todas las versiones son indexables. Un `<select>` con JavaScript habría roto ambas cosas.

**Decisiones de detalle:**
- Cada idioma se nombra **en su propio idioma** (Español · English · Português), con su atributo `lang`. Traducir "Português" a "Portugués" se lo muestra en un idioma que quien busca portugués puede no leer — es decir, precisamente a quien sirve el control.
- Patrón *disclosure*, no `role="menu"`: el panel contiene enlaces y el Tab natural ya los recorre. Declarar un menú obligaría a navegación por flechas que aquí no aporta nada.
- Cierre por Escape con retorno del foco, al pulsar fuera y al navegar. Se reutiliza el patrón `openedFor === pathname` del menú móvil: cierra por derivación, sin efecto de limpieza.
- `placement="up"` en el menú móvil, donde el selector vive al fondo del panel y hacia abajo quedaría fuera de la pantalla.
- Fondo **opaco** (`bg-canvas`): el header es translúcido con `backdrop-blur` y un panel translúcido encima deja el texto ilegible sobre el contenido de la página.
- Panel `absolute`, no `fixed` — evita la trampa documentada en `Header.tsx`, donde `backdrop-filter` convierte al header en bloque contenedor de sus descendientes `fixed`.

### Estado

`locales` sigue siendo `["es", "en"]`. **Añadir portugués es ahora añadir una entrada a `locales` y otra a `localeMeta`**, que es lo que §30 prometía y todavía no era cierto.

### Evidencia

`npm run lint` limpio · `npm run build` correcto, **29 páginas estáticas, las mismas que antes** · `hreflang` recíproco + `x-default` verificados en el HTML servido de `/es/nosotros` y `/es/red/estacion/universidad-ean` · descripción SEO verificada en ambos idiomas sobre el HTML generado (`Estación de carga Voltop en Bogotá: 60 kW…` / `Voltop charging station in Bogotá: 60 kW…`) · `x-default` verificado en `sitemap.xml` · cero `languages: {` escritos a mano en `app/`.

### Pendiente de este frente

- `sitemap.ts` sigue emitiendo `lastModified: new Date()` en todas las URLs, así que declara que el sitio entero cambió hoy, en cada build. Se corrige en el bloque de novedades, que es donde por primera vez hay fechas reales por registro.

---

## Bloque 10 · Portugués de Brasil en borrador — 2026-08-31

**Por qué en borrador y no publicado:** un idioma existe mucho antes de estar listo. Sin un estado intermedio, la única opción era tenerlo traducido al 100% antes del primer commit, o publicarlo a medias.

| Cambio | Razón |
|---|---|
| `localeStatus` con `publicado` \| `borrador` | Un idioma en borrador es navegable por URL —hay que poder revisarlo— pero queda fuera del selector, fuera del sitemap, sin `hreflang` y con `noindex`. |
| `Localized`: el idioma base pasa a ser el único obligatorio | Exigirlos todos impedía avanzar por partes y, sobre todo, no admite contenido que legítimamente no existe en todos los idiomas. Un comunicado sobre una alianza en Bogotá no siempre se traduce al portugués: un tipo que lo exige no consigue una traducción, consigue que alguien pegue el español dentro del campo portugués. Eso es una caída silenciosa igual, pero indetectable. |
| Nuevo `lib/i18n/audit.ts` | Sustituye la garantía perdida por una **medida**: recorre todo el contenido en cada build, reporta cobertura por idioma y **rompe el build si un idioma PUBLICADO tiene huecos**, con la ruta exacta de cada uno. Sin dependencias nuevas y sin comando que haya que acordarse de lanzar (§38). |
| La auditoría se invoca desde `app/sitemap.ts` | No es arbitrario: el sitemap es la pieza que DECLARA qué idiomas existen de cara al público. Verificar que un idioma está completo antes de anunciarlo es su propio trabajo. |
| `defaultLocale` tipado como el literal `"es"` | Anotado como `Locale` (lo que estaba), TypeScript no podía demostrar que el respaldo de `t()` siempre existe, ni resolver `Exclude<Locale, typeof defaultLocale>`. Lo detectó el build, no una revisión. |
| El selector lista borradores **solo en desarrollo**, rotulados | Sin eso habría que escribir la URL a mano para revisar el idioma, y lo que cuesta revisar no se revisa. Sin el rótulo, un idioma incompleto parecería terminado y sus huecos, erratas. |

### Evidencia

`lint` limpio · `tsc` limpio · build correcto, **41 páginas estáticas** (antes 29; +12 de `/pt`) · auditoría en la salida del build: `ES 329/329 (publicado) · EN 329/329 (publicado) · PT 0/329 (BORRADOR)` · `/pt` sirve `noindex, follow` y cae al español · `/es` conserva `index, follow` · los `hreflang` de `/es` anuncian **solo** `es`, `en` y `x-default` · `grep "voltop.co/pt" sitemap.xml` → **0 coincidencias**.

**El volumen real de traducción es 329 textos**, no una estimación.

---

## Bloque 11 · Novedades — el registro de la red — 2026-08-31

**Encargo:** un espacio para comunicar aperturas, eventos, alianzas y comunicados. §2 lo tenía explícitamente **fuera de alcance** ("blog/editorial") y §14 fijaba **tres puertas de navegación**. Ambas decisiones se reabren aquí, con su razón.

### No es un blog: es un registro

| Decisión | Razón |
|---|---|
| Bitácora cronológica, no revista | Un blog exige contenido que hay que inventar y sin cadencia se ve muerto: tres artículos con fecha vieja comunican que la compañía está parada, justo lo contrario del objetivo §4.1. Un registro se alimenta de lo que la operación ya produce —cada estación que abre es una entrada— y con entradas cada pocas semanas se ve vivo. |
| **Sin rejilla de tarjetas** | §12 prohíbe el exceso de tarjetas y los layouts previsibles. Una rejilla con foto, titular y "Leer más" no pasa el test del anonimato. Voltop es infraestructura, y la forma nativa de comunicar infraestructura es la bitácora de lo construido: filas de índice con la fecha en mono, separadas por hairlines — el mismo lenguaje de "ficha técnica" que ya usan las specs de estación. |
| `body` vacío = la entrada NO tiene página propia | Una apertura son dos líneas: obligar a hacer clic para leer un párrafo es fricción sin contrapartida, y multiplica páginas delgadas que compiten entre sí en búsqueda. Solo lo que tiene cuerpo genera ruta. De cuatro entradas de arranque, **una** tiene página. |
| Cuerpo por **bloques tipados**, no Markdown | Es la forma exacta en que un CMS headless entrega texto enriquecido (Portable Text, rich text), así que migrar será conectar y no reescribir — y no cierra ninguno de los tres caminos de producción de §2. Markdown suelto habría metido formato dentro del dato. |
| **Sin filtro por tipo** | Con el volumen actual filtraría a una o dos entradas por categoría, y un control que no reduce nada útil es decorativo (§12). Se gana su sitio a partir de ~15 entradas; hasta entonces el tipo se lee en cada fila. |

### Cuarta puerta de navegación: `Red · Empresas · Novedades · Nosotros`

§6 lista "Inversionista / prensa" y los manda a Nosotros, pero esos públicos no preguntan "quiénes son" —eso es estático— sino "qué han hecho últimamente". Son preguntas distintas y meter la segunda dentro de la primera esconde el activo que mejor responde a ambas. §14 ya admitió esta misma excepción con el nivel de ciudad cuando había razón real de contenido, intención y SEO.

El desplegable de idioma del Bloque 9 liberó exactamente el espacio que necesitaba la entrada nueva.

### Re-superficie contextual — lo que impide que sea un cajón aparte

Cada entrada referencia estación y/o ciudad, así que **aparece sola donde el usuario la busca**: la apertura de la EAN se pinta en la ficha de esa estación y en la página de Bogotá sin que nadie la coloque a mano en tres sitios. Reutiliza el sistema de referencias que ya conectaba estación → ciudad. Sin entradas, el bloque no renderiza nada —ni titular vacío ni "próximamente"—, igual que la franja de partners.

### Beat 6 de la Home

La entrada del menú sirve a quien ya viene buscando, que es un público pequeño. El beat de la Home se lo pone delante a quien no venía buscando: tres hechos fechados y recientes responden la pregunta institucional sin un solo clic. **De los dos puntos de entrada, este hace el trabajo pesado.**

La Home pasa de 7 a 8 beats. El nuevo es deliberadamente el más BAJO de la curva de intensidad —tres filas, sin resumen ni media— y funciona como respiro antes del cierre. Su estructura no coincide con la de ninguno de sus dos vecinos, y el índice denso del beat 3 no le es consecutivo.

### Correcciones que salieron de la revisión visual

| Hallazgo | Corrección |
|---|---|
| **"FECHA PROVISIONAL" repetida en cada fila** | Cuatro etiquetas ámbar eran lo más llamativo de la página después del titular y llevaban el ojo al dato menos importante: dejaba de ser advertencia y pasaba a ser textura. Ahora se declara **una vez** para todo el registro y **antes** de leer —el precedente es `demoNotice`, que avisa antes de pedir los datos, no en letra pequeña al final—. En la página de una entrada sí va por entrada: ahí hay una sola y califica lo que se lee. |
| **Separador de año con un solo año** | Un rótulo "2026" que no separa nada. Ahora aparece solo si hay más de un año, activado por los datos, como el orden por distancia de `/red`. |
| **Fecha con conectores** | `Intl` en español da "18 de jun de 2026", que en mono y mayúsculas se lee "18 DE JUN DE 2026": tres palabras de ruido alrededor del dato. Se eliminan los literales alfabéticos por categoría —no por lista de palabras, que habría que ampliar con cada idioma—. Resultado: `18 jun 2026` · `Jun 18, 2026` · `18 jun. 2026`. |
| **`timeZone: "UTC"` obligatorio** | Sin él, `"2026-06-18"` se formatea como día 17 en cualquier huso al oeste de Greenwich, Colombia incluida: el registro cambiaría de fecha según dónde se renderice. |

### La auditoría de idiomas mentía

Al crear `copy/novedades` y `data/posts` **se olvidaron en la lista de módulos de `lib/i18n/audit.ts`**, y la auditoría siguió reportando "332/332 completo" sobre un contenido que ya no cubría. Una auditoría que miente es peor que no tenerla, porque autoriza a publicar.

Se añadió `assertAllContentRegistered()`: contrasta la lista contra el disco y **rompe el build** si hay un archivo de contenido sin registrar. Al arreglarlo, el conteo real pasó de 332 a **374**: había 42 textos invisibles.

### SEO y medición

- JSON-LD `NewsArticle` por entrada. `image` se emite **solo si el archivo existe**: declarar una imagen no entregada sería prometerle al buscador algo que la página no sirve.
- `sitemap.ts` reescrito. Antes **todas** las URLs declaraban `lastModified: new Date()`, así que en cada build el sitio entero afirmaba haber cambiado ese día — un sitemap que dice "todo cambió hoy" siempre acaba ignorado. Ahora cada entrada declara su fecha, el índice la de su entrada más reciente, y solo las páginas sin fecha propia usan la del build.
- Eventos nuevos: `novedades_vista`, `novedad_vista` (slug, tipo) y **`idioma_cambiado`** (de, a). Este último no existía y con tres idiomas es el único dato que dirá si el portugués se usa.
- `novedad_vista` es un evento de VISTA y no de clic: cuenta también a quien llega desde búsqueda o desde prensa, que es precisamente el público del registro.

### Contenido de arranque

Cuatro entradas fundamentadas en el dataset y en el registro de media (el video de la apertura de la EAN está confirmado como existente). **Las fechas no están verificadas** y se declaran como tales. No se inventaron citas ni cifras: el bloque `cita` existe en el modelo y no se usa, porque atribuir unas palabras a una persona real sin tenerlas sería la peor versión de inventar un dato.

### Evidencia

`lint` limpio · `tsc` limpio · build correcto, **47 páginas estáticas** (antes 41) · auditoría `ES 374/374 · EN 374/374 · PT 0/374 (BORRADOR)` · una sola entrada genera página, las otras tres viven en el índice · JSON-LD `NewsArticle` verificado en el HTML servido, **sin `image`** · `sitemap.xml` con `lastmod` real por entrada (`2026-06-18`) · re-superficie verificada en la ficha de la EAN y en `/es/red/bogota` · `shot.mjs` ampliado a `/novedades`, `/novedades/[slug]` y `/pt/novedades`.

### Pendiente

- **Fechas reales de las cuatro entradas de arranque** (bloqueado por el usuario).
- **Traducción al portugués** de las novedades, junto con el resto en el bloque siguiente.
- **CMS.** Publicar hoy exige editar código y desplegar. Para estaciones se aguanta; para novedades no, y la sección moriría por fricción y no por falta de contenido. Con **un solo editor** confirmado, un CMS ligero de un editor es suficiente: no hacen falta roles, permisos ni flujos de aprobación.

---

## Bloque 12 · Portugués de Brasil publicado — 2026-09-01

**Qué se hizo:** traducir los **374 textos** del sitio a portugués de Brasil y pasar el idioma de `borrador` a `publicado`. `pt` entra al selector, al sitemap y a los `hreflang`, y sus 16 páginas pasan a `index, follow`.

### Método

La traducción **no se hizo reescribiendo archivos**. Se extrajeron los 374 valores `en:` por posición en el código (373 cadenas + 1 plantilla de función), se dedujeron **336 cadenas únicas**, y se insertaron las traducciones en su sitio exacto. Los comentarios, la sangría y el formato de los doce módulos de contenido quedan intactos: el diff es solo líneas añadidas.

`Localized` mantiene el español como único idioma obligatorio; la garantía de que no falta nada la da la auditoría de build, no el tipo.

### Decisiones de traducción

| Decisión | Razón |
|---|---|
| Registro **você**, no *tu* | Es el estándar de Brasil. `pt-PT` habría exigido reescribir el tratamiento entero. |
| Direcciones colombianas **sin traducir** | `Calle 79 #11-45, Bogotá` es un dato, no copy. Traducir "Calle" a "Rua" produciría una dirección que no existe. |
| Nueve cadenas idénticas al inglés, verificadas una a una | `Status`, `Legal`, `km`, `Café`, `Wi-Fi` se escriben igual en portugués; las otras cuatro son las direcciones. Ninguna es un olvido. |
| `hreflang` **`pt-BR`**, URL `/pt` | No hay versión europea con la que competir, y declarar el genérico `pt` describiría mal un texto escrito en brasileño. La separación `htmlLang`/`hreflang` del Bloque 9 es lo que permite tener las dos cosas. |

### Corregido en la revisión visual

**"Scroll" se había traducido como "Role"** (imperativo de *rolar*, correcto en aislamiento). Pero el indicador se pinta en mono y MAYÚSCULAS, así que la primera pantalla del sitio en portugués decía **"ROLE ↓"** — que se lee como la palabra inglesa *role* y parece un error de programación. Sustituido por **"Deslize"**, inequívoco en mayúsculas.

Es un fallo que ninguna comprobación automática detecta: la cadena era correcta, el problema era cómo se renderiza. Solo aparece mirando la página.

### QA ampliado a portugués

`shot.mjs` incorpora **seis rutas `/pt`**, y no por completismo: el portugués es sistemáticamente más largo que el español —"Infraestrutura de carregamento" frente a "Infraestructura de carga"— así que es el idioma con más probabilidad de desbordar un titular, un botón o una celda. Si una composición se rompe por longitud de texto, se rompe ahí primero.

### Evidencia

`lint` limpio · `tsc` limpio · build correcto, **47 páginas estáticas** · auditoría `ES 374/374 · EN 374/374 · PT 374/374 (publicado)` · `/pt` sirve `index, follow` y `<div lang="pt-BR">` · `hreflang` recíproco `es` / `en` / `pt-BR` / `x-default` verificado en el HTML servido · **48 URLs `/pt` en el sitemap** · descripción SEO de estación en portugués verificada en el HTML generado · `inLanguage: "pt-BR"` en el JSON-LD de la entrada · selector verificado con los tres idiomas, cada uno en su propio idioma, `aria-expanded` correcto y `hreflang` por opción · **sin overflow en 11 anchos × 18 rutas**.

### Hallazgo NO corregido (preexistente, fuera de este bloque)

La insignia de media pendiente del hero (`FOTO · PENDENTE`) se ancla a 24px del borde superior en **los tres idiomas**, es decir dentro de la banda del header, junto al CTA. No lo introdujo este bloque —se comporta igual en `/es` y `/en`, medido— y desaparece cuando llegue el video real. Queda registrado para decidir si el anclaje del rótulo con `fill` debe bajar por debajo de la altura del header.

---

## Bloque 13 · Logo oficial — 2026-09-01

**Entrega:** `public/Logo_voltop.svg`. Cierra la parte de logo de la decisión abierta O1 (§37); los hex y las tipografías siguen pendientes.

| Instancia | Antes | Ahora |
|---|---|---|
| Header | Isotipo provisional + `<span>Voltop</span>` | El archivo oficial, 137×32 |
| Footer | Ídem | El archivo oficial, 137×32 |
| Imagen Open Graph | Cuadrado con gradiente dibujado a mano + la palabra en texto | El archivo oficial, embebido como data URI |

### La consecuencia inevitable

El archivo oficial es el **lockup completo**: trae símbolo *y* logotipo. El placeholder era solo el símbolo y la palabra la ponía un `<span>` al lado. Con el asset oficial ese `<span>` pasaba a duplicar la marca —"Voltop Voltop"—, así que se retiró de header y footer. No es un cambio de contenido: es la misma palabra, que ahora aporta el propio logo. Era la única forma de usar el archivo oficial.

**El tamaño se conserva:** el símbolo ocupa 123.107 de los 124 de alto del archivo, así que a `h-8` mide 31.8px — exactamente lo que medía el placeholder (`size-8`).

En la imagen Open Graph el logo se lee del disco y se incrusta: se genera en el build, cuando aún no hay servidor que sirva `public/`, y así la pieza no depende de que la red resuelva nada al compartir el enlace.

### Corregido

El logo **se estiraba entre ~770 y ~810px** de viewport: proporción 3.96 en lugar de 4.27. Causa: el reset de Tailwind aplica `max-width: 100%` a toda imagen, y con la altura fijada en `h-8` el ancho quedaba topado por un contenedor comprimido. Resuelto con `object-contain` dentro de `Logo.tsx`.

### Hallazgo NO corregido (requiere tocar el header)

En esa misma franja de ~40px el logo queda a **0px del menú** y se reduce un ~7% para caber. La causa es física: el lockup oficial mide 137px y lo que reemplazó medía ~104px. Ahí el header ya iba justo. **No se corrigió porque exige tocar el layout del header**, fuera del encargo. Se resuelve con una clase en el `<Link>`.

### Evidencia

`lint`, `tsc` y build limpios · cero rastros del isotipo provisional y del cuadrado del OG en todo el código · las 2 instancias del HTML servido apuntan a `/Logo_voltop.svg` · el nombre accesible del enlace se conserva en los tres idiomas · proporción verificada en 4.23–4.29 en la franja crítica · **sin overflow en 13 anchos × 14 rutas**, incluidos 780 y 800px · imagen Open Graph regenerada y revisada.

---

## Bloque 14 · Fase 5 — el registro, listo para CMS — 2026-09-01

**Por qué:** §38 fija que el equipo propietario no es un equipo de desarrollo, y hoy publicar una novedad exige editar código, hacer commit y desplegar. Para estaciones se aguanta; para un registro semanal no, y la sección moriría por fricción operativa y no por falta de contenido.

**El gate de §2 ya se cumplió:** la decisión de producción esperaba a que el copy saliera del código, y eso pasó en el bloque 7.

### Lo que se hizo

| Cambio | Razón |
|---|---|
| Nuevo `lib/data/posts-source.ts` con `fetchPosts()` | **Único punto que cambia al conectar un CMS.** Todo lo que hay por encima —orden, filtro de publicados, referencias a estación y ciudad, qué entradas tienen página— no depende del origen. |
| Los accesores del registro pasan a `async` | Es lo ÚNICO que obligaría a tocar cada página que consume el registro. Hecho ahora, conectar el CMS es cambiar el cuerpo de una función; hecho el día de la migración, es un refactor bajo presión. |
| `hasPage()` se queda síncrono | Es un predicado puro sobre una entrada ya cargada. No consulta el origen. |
| Estaciones y ciudades **siguen síncronas** | Asimetría deliberada: refleja lo que de verdad va a cambiar. El registro es el piloto, no la migración entera. |
| Nuevo `docs/06-cms/01-brief-cms.md` | El modelo de contenido exacto, los requisitos que deciden la elección y la comparativa de proveedores. Es el documento que se le pasa a quien se contrate. |

### Recomendación de proveedor

**Sanity.** Portable Text es literalmente el modelo de bloques ya construido, la edición es la mejor de las tres opciones para alguien no técnico, el plan gratuito cubre un editor y trae pipeline de imágenes. **Alternativa a coste cero: Keystatic** — el contenido se queda en el repositorio y no hay proveedor que pueda subir precios. Los precios **no se verificaron** y hay que confirmarlos antes de decidir.

### Lo que NO se hizo, y por qué

**El webhook de publicación.** Sin proveedor elegido y sin destino de despliegue decidido, sería un endpoint que nadie llama — un enlace sin destino real, que §15 prohíbe. Son horas de trabajo en cuanto esas dos decisiones estén cerradas.

### Evidencia

`lint` limpio · `tsc` limpio · build correcto · **47 páginas estáticas, las mismas que antes**: pasar la frontera a asíncrona no sacrificó nada de la generación estática · auditoría `ES 374/374 · EN 374/374 · PT 374/374`.

### Aviso para el día de la migración

Cuando el registro viva en el CMS, `content/data/posts.ts` desaparece del repositorio y con él **la auditoría de idiomas deja de cubrirlo**. Esa cobertura hay que reponerla en el CMS —campo obligatorio, aviso al editor o comprobación en el webhook—. Si no, vuelve exactamente el fallo que la auditoría existe para impedir: contenido publicado a medias en un idioma, en silencio.

---

## Bloque 15 · Primera fotografía real — hero de la Home — 2026-09-01

**Entrega:** `public/Hero_Banner.png`, 7008 × 4672 px. Proporción **3/2 exacta**, la que `docs/05-assets-todo` pedía precisamente para que aguante el recorte vertical del hero en móvil. Es el primer asset real del proyecto.

### El bloqueo que hubo que resolver primero

El archivo entregado pesa **50.331.395 bytes**. El optimizador de imágenes de Next rechaza cualquier origen por encima de **50.000.000** — `ERR_MAX_BODY_SIZE_EXCEEDED` — así que se pasaba por **331 KB** y **la imagen no se renderizaba en absoluto**. No es un límite configurable, y servirla sin optimizar habría significado mandar 50 MB al navegador justo en el elemento que mide el LCP.

Se derivó `public/hero-banner.jpg` — 2560 × 1706, la anchura que el brief de assets fija para composiciones a sangre — conservando el 3/2. El original queda intacto.

⚠️ **El original de 50 MB NO se ha commiteado.** Un binario de ese tamaño en el árbol de git es permanente y no se puede quitar después sin reescribir la historia. Debe archivarse fuera del repositorio.

### Qué se cambió

| Cambio | Razón |
|---|---|
| Nueva entrada `heroInfraestructura` en el registro de media | **No se rellenó `infraestructuraAmplia`**: se usa también en la franja 21/9 de `/nosotros`, así que habría cambiado dos superficies cuando el encargo era el hero y nada más. Es además la separación que ya recomendaba la decisión D1 del brief de assets. `infraestructuraAmplia` sigue con su hueco declarado. |
| `Media` acepta `position` (opcional) | El componente fijaba `object-cover` sin control del anclaje. Prop aditiva: sin ella el comportamiento es el de siempre, centrado, que es el correcto para el resto del sitio. |
| Hero con `object-[24%_50%]` | Ver abajo. |

### Por qué el anclaje en 24% y no centrado

`object-cover` recorta por el eje que sobra, y ese eje **cambia con el dispositivo**:

| Contexto | Hueco | Qué recorta |
|---|---|---|
| Escritorio 1440×800 | 1.80 | Más ancho que la foto (1.50) → conserva todo el ancho, recorta arriba y abajo |
| Tablet 768×901 | 0.85 | Recorta a los lados, moderado |
| Móvil 390×829 | 0.47 | Mucho más estrecho → conserva todo el alto, recorta a los lados y **se queda con el 31% del ancho** |

Por eso los dos valores no compiten: cada uno solo actúa donde su eje es el recortado. Centrado, en móvil el encuadre se quedaba con la pared de fondo y **perdía el cargador con la marca**, que está a la izquierda. Se probaron 18%, 24% y 30% sobre el navegador: 18% deja el equipo como sujeto pero apoya el titular sobre el panel claro; 30% conserva el muro oscuro pero el pilar de concreto domina la composición. **24% mantiene el equipo en cuadro sin perder el fondo oscuro que sostiene la legibilidad.**

### Peso servido

| Ancho | Peso | Formato |
|---|---|---|
| 640 (móvil) | **29,1 KB** | AVIF |
| 1080 | 52,3 KB | AVIF |
| 1920 (escritorio) | **99,8 KB** | AVIF |
| 2048 | 108,2 KB | AVIF |

Presupuesto del brief para el hero: ≤ 250 KB. **Se cumple con holgura en todos los anchos.**

### Contraste sobre fotografía — la verificación que el brief exigía

`docs/05-assets-todo` avisaba: *"las capas de legibilidad están calibradas contra `surface-1` plano, no contra fotografía. En cuanto entre la primera imagen hay que volver a medir el contraste de todo el texto sobre media."* Medido sobre los píxeles realmente renderizados, ocultando solo el contenido y fotografiando el fondo compuesto:

| | Titular (umbral 3:1, texto grande) | Párrafo (umbral 4,5:1) |
|---|---|---|
| Escritorio | p90 6,31 · p99 4,22 · peor 3,47 → **cumple** | p90 5,55 · p99 4,90 · **peor 3,87** |
| Tablet | p90 9,05 · p99 7,50 · peor 5,67 → **cumple** | p90 6,33 · p99 5,63 · peor 4,83 → **cumple** |
| Móvil | p90 4,88 · p99 3,72 · peor 3,24 → **cumple** | p90 4,53 · **p99 3,81** · **peor 2,97** |

**El titular cumple AA en los tres contextos.** El párrafo cumple en tablet, pero en escritorio y móvil **cae por debajo de 4,5:1 en zonas**: en móvil el 10% más claro del fondo bajo el texto da 3,81:1 y el peor punto 2,97:1.

**No se corrigió.** La corrección es reforzar el degradado de legibilidad (`via-canvas/75` → un valor más opaco), y eso oscurece la fotografía: es una decisión de dirección de arte, no un ajuste técnico, y el encargo prohibía tocar el diseño. Queda documentado con cifras para decidirlo.

### Evidencia

`lint`, `tsc` y build limpios · 47 páginas · auditoría `ES 376/376 · EN 376/376 · PT 376/376` (el alt y el role del asset nuevo, en los tres idiomas) · `object-fit: cover` verificado en 320/390/768/1024/1440/1920 — **nunca deforma** · `srcSet` con 8 anchos (640→3840) · sin overflow en ninguna resolución · `/nosotros` conserva su hueco declarado, intacto.

---

## Bloque 16 · Auditoría del Hero con la fotografía real — 2026-09-01

**Encargo:** dejar el Hero impecable en UI, UX, responsive y accesibilidad, sin rediseñarlo. Auditoría medida, no estimada.

### Lo que encontró la auditoría

Se midió el contraste de **los seis textos superpuestos** —antetítulo, titular, párrafo, indicador de scroll, etiqueta de cobertura y enlaces de ciudad— sobre los píxeles **realmente renderizados**, en **14 viewports** de 320 a 1920 px.

| Elemento | Resultado con el velo anterior |
|---|---|
| **Antetítulo** | **FALLA en 9 de 14 viewports.** Mínimo **1.90:1** a 320–414 px, frente al 4.5:1 que exige AA para 12 px |
| Párrafo | Falla en 320 (4.39) y 360 (4.46) |
| Titular, scroll, cobertura, ciudades | Cumplen |

El antetítulo es texto verde de marca a 12 px, y en móvil el recorte lo deja sobre el panel claro del cargador — el peor caso del hero. El velo anterior (`via-canvas/75`, un solo eje) se había calibrado contra fondo plano, tal como `docs/05-assets-todo` advertía que habría que revisar en cuanto entrara material real.

### La corrección: el velo sigue a la forma del texto

No es un ajuste de opacidad, es un cambio de **forma**, y por eso cambia con el breakpoint:

| | Forma del texto | Velo | Resultado |
|---|---|---|---|
| **Escritorio** | Columna izquierda | Vertical + **lateral suave** | El lateral protege la columna y deja la mitad derecha del encuadre a la vista |
| **Móvil** | Ancho completo | **Solo vertical** | Un lateral aquí oscurece el lado donde está el cargador —el sujeto— y aclara el derecho, donde también hay texto |

Se probaron ambas formas en las dos direcciones. En móvil, con lateral **el equipo desaparecía de la foto**; sin él se lee.

Las intensidades salen de **barridos medidos**, no de criterio: en escritorio el velo calibrado para móvil llevaba el antetítulo a 8.65:1 cuando basta con ~5, y apagaba la fotografía sin necesidad — que es el 70% de la dirección visual (§12). Márgenes finales sobre el umbral: **+12% en móvil, +17% en escritorio.** Se descartaron variantes con margen del 2%: cualquier reencuadre las rompería.

Los valores se escriben con `color-mix` sobre `--color-canvas`, no como hex (§24).

### Otra corrección

**"Cobertura por ciudad" partía mal en móvil.** La etiqueta compartía fila con "Bogotá" y "Medellín" caía sola a una segunda línea, desalineada respecto a la primera ciudad. Ahora la etiqueta ocupa su propia línea por debajo de `sm` y las ciudades quedan alineadas entre sí.

### Resultado de la auditoría final

| Comprobación | Resultado |
|---|---|
| Contraste, 14 viewports × 6 elementos | **Cero fallos** |
| Objetivo táctil del CTA | 223 × 52 px en los 16 viewports (mínimo 44) |
| Recorte de contenido (el hero lleva `overflow-hidden`) | Ninguno, ni en pantallas bajas (320×568, 1024×600) |
| Overflow horizontal | Ninguno |
| Solape del header con el antetítulo | Ninguno |
| Foco del CTA | Outline 2px sólido `--color-focus`, offset 2px |
| `prefers-reduced-motion` | 0 elementos invisibles, 0 animándose |
| LCP con 4G lenta y CPU ×4 | **1.25 s móvil · 1.61 s escritorio** (presupuesto < 2.5 s) |
| Peso de la imagen | 29 KB móvil · 100 KB escritorio · 147 KB Retina (presupuesto ≤ 250 KB) |

### Nota de método

Una primera medición usó el píxel más claro de cada caja y sobreestimaba el problema; una segunda **reconstruía** el degradado en un canvas y lo subestimaba. La cifra buena sale de fotografiar el fondo compuesto real —ocultando solo el contenido— y evaluar por percentiles. Los dos métodos convergen al 4%, que es lo que da confianza en el número.

### Lo que NO se tocó

Estructura, textos, CTAs, tipografías, jerarquía, animaciones y el resto de secciones. Solo velo, un salto de línea responsive y el encuadre ya fijado en el bloque 15.

---

## Bloque 17 · Contraste de la navegación sobre el hero — 2026-09-01

**Origen:** observación del usuario — *"en la zona donde está el nav no hay suficiente contraste y se pierde un poco"*. Correcta, y era un **hueco de la auditoría del bloque 16**: se midieron los seis textos del hero, pero el header es otro componente y quedó fuera.

### Por qué el promedio lo escondía

El header es transparente hasta que hay scroll —solo entonces gana `bg-canvas/85` y desenfoque—, así que sobre el hero su texto cae directamente sobre la foto. Medido:

| | p90 (promedio alto) | **p99 (el punto malo)** |
|---|---|---|
| `Nosotros` @768px | 5.63 — pasa | **1.75:1** |
| `Novedades` @1024px | 6.42 — pasa | **2.68:1** |
| Selector de idioma @1024px | 7.52 — pasa | **2.31:1** |

No era un fallo de bloque sino de **manchas**: las luces azules y los tubos del techo quedan detrás de letras concretas. Por eso se percibe como que la navegación "se pierde" aunque el promedio cumpla.

**Lección de método:** bajo un fondo irregular, el percentil 90 es demasiado indulgente. El criterio correcto es el p99, que es donde el trazo de una letra desaparece. El bloque 16 usó p90 y por eso dio el header por bueno sin medirlo.

### Corrección

Banda superior de velo bajo el header, **solo en escritorio**: en móvil el velo vertical ya llega al 52% arriba y por eso ahí sí cumplía (hamburguesa 6.21 en p99).

Un detalle del proceso que casi cuesta un error: el barrido inicial tenía las paradas del degradado **desordenadas** (55% antes que 22%), así que el navegador las colapsaba y la variante elegida oscurecía mucho más de lo que aparentaba. Se detectó al implementar y se **volvió a medir sobre lo realmente renderizado** en vez de confiar en el barrido.

### Resultado

| | Antes | Después |
|---|---|---|
| Peor p99 del header | **1.75:1** | **4.68:1** |
| Fallos en p90 | 1 (`Empresas` @1920) | **0** |
| Fallos en p99 | varios | **0** |

Verificado en 7 viewports sobre nav, selector de idioma, CTA del header y hamburguesa. El hero conserva sus cero fallos y ninguna incidencia estructural.

---

## Bloque 18 · El header completo no cabía a 768px — 2026-09-01

**Origen:** deuda declarada en el bloque 13 y arrastrada desde entonces. Con el logo oficial —137px frente a los ~104 del placeholder— el reparto del header se quedaba sin holgura entre ~768 y ~815px: **0px de separación entre el logo y el menú a 768px**, y el flex comprimía el enlace del logo hasta deformarlo.

### Por qué no se arregla apretando

Se midió el reparto real. Con el espaciado entre entradas reducido:

| Separación entre entradas | Hueco logo→menú a 768px |
|---|---|
| 24px (`gap-6`) | 0px |
| 20px (`gap-5`) | 4px |
| 16px (`gap-4`) | 10px |

Ni al mínimo se llega a una separación aceptable, y a 16px las cuatro entradas quedan apretadas entre sí: se cambia un problema por otro. **El header simplemente no cabe**: logo, cuatro entradas, selector de idioma y CTA suman más que la fila a 768px.

### La corrección

| Cambio | Razón |
|---|---|
| Nuevo token `--breakpoint-nav: 52rem` (832px) | Ancho **medido** al que el reparto respira. El header completo aparece ahí; entre 768 y 832 se usa el menú desplegable, que es el patrón correcto para tablet en vertical y que ya estaba construido, accesible y con el selector de idioma dentro. Mismo precedente que `--breakpoint-xs`, definido en su momento para un caso idéntico. |
| `shrink-0` en el enlace del logo | El logo es un lockup de proporción fija. Dejarlo encoger lo deformaba. Que ceda el espacio otro elemento, no la marca. |
| `gap-6` entre `nav` y `lg`, `gap-9` desde `lg` | Da holgura en la franja intermedia sin apretar las entradas donde sobra espacio. |
| Se retira el `gap-2.5` del enlace del logo | Sobraba desde que el archivo oficial trae símbolo y logotipo en una sola pieza. |

**Se descartó subir el header completo a `lg` (1024px):** habría quitado la navegación entre 832 y 1023, donde cabe perfectamente. La franja afectada pasa de 256px a 64px.

### Verificación

Barrido de **360 a 1440px**: logo sin deformar en ningún ancho (proporción 4.27 constante), separación ≥16px siempre que hay navegación visible, sin overflow, y exclusión correcta entre menú y navegación —nunca ambos, nunca ninguno—. **Selector de idioma accesible en los dos modos**, verificado a 768, 800, 831 (menú) y 832 (header).

Las cuatro auditorías del Hero siguen limpias: contraste del hero, estructura, contraste del header y rendimiento (LCP 1.29s en escritorio con 4G lenta y CPU ×4).

---

## Bloque 19 · Fotografía real en los dos primeros beats — 2026-09-01

**Encargo:** la foto que estaba en el hero pasa al beat 2, y una fotografía nueva ocupa el hero.

| Archivo entregado | Máster web derivado | Dónde |
|---|---|---|
| `Hero.png` (60.9 MB) | `hero-vehiculo-cargando.jpg` · 2560 × 1706 | Beat 1 · Hero |
| `Hero_Banner.png` (50.3 MB) | `estacion-infraestructura.jpg` · 2560 × 1706 | Beat 2 · Signature moment |

**Los dos originales superan el límite de 50 MB del optimizador de Next**, así que ninguno puede servirse directamente. Ambos quedan en `public/` sin commitear: 111 MB de binario no pertenecen a un árbol de git.

El beat 2 no rellena `estacionMedellin` —es un asset de tipo VIDEO, todavía pendiente— sino que usa una entrada de foto nueva. Cuando el video llegue, la sección puede volver a él cambiando una línea.

### Encuadre del hero: de 24% a 62%

En la foto anterior el cargador estaba a la izquierda; en la nueva está a la **derecha del centro** (~55–68% del ancho). Con el anclaje heredado, el recorte vertical de móvil se quedaba con el lateral oscuro del vehículo y perdía el equipo con marca. Probado contra 24%, 40% y 52%: por debajo del 50% el cargador queda cortado en el borde. En escritorio el valor no interviene —ahí se conserva todo el ancho—.

### Contraste: recalibrado contra p99

La fotografía nueva es más clara donde va el texto. Con el velo anterior el antetítulo caía a **3.36:1**. Se recalibró **contra el percentil 99** —la lección del bloque 17— en lugar del promedio.

Un matiz que salió de mirar y no de medir: la primera calibración cumplía pero dejaba el lado izquierdo casi plano, porque el velo lateral oscurecía justo donde el vehículo ya es oscuro. Se comprobó cuánto se podía aligerar sin perder cumplimiento y el lateral bajó de 0.88/0.62 a **0.70/0.44**, conservando 1.10× de margen. La foto recupera presencia sin sacrificar AA.

### El beat 2 estaba muy por debajo

Su velo (`via-canvas/50`, opacidad animada **de 0.15 a 0.85**) se fijó contra el hueco PLANO del placeholder. Con foto real, el párrafo y el rótulo caían sobre el cargador iluminado y dejaban de leerse — visible sin necesidad de medir.

Se conserva la intención —el velo crece con el recorrido, acompañando la apertura del recorte— pero partiendo de un punto donde el texto ya es legible: **de 0.8 a 1**, sobre un degradado `via-canvas/88 to-canvas/45`. Verificado en 3 viewports × 4 posiciones de scroll.

### Peso: el nuevo asset se salía del presupuesto

La fotografía nueva tiene mucho más detalle fino (piedra, reflejos) y AVIF la comprime peor: **332 KB en Retina**, por encima de los 250 KB de §29.

Bajar la calidad del máster **no sirvió** —de 330 a 318 KB—: quien manda es el codificador AVIF, no el origen. Se añadió la calidad 70 a `next.config.ts` (Next solo sirve las declaradas) y una prop `quality` en `Media`, aplicada **solo a este asset**.

| | Antes | Después |
|---|---|---|
| Móvil | 38.7 KB | **30.3 KB** |
| Escritorio | 202.3 KB | **147.4 KB** |
| Retina | **332.1 KB** ✗ | **235.1 KB** ✓ |

### Sobre la medición del LCP

Las primeras lecturas daban 2.44–2.60 s, al borde del límite. Son la **primera petición**, cuando Next optimiza la imagen bajo demanda: un coste único por variante, no por usuario. Con la caché caliente la mediana de cuatro lecturas es **0.43 s en móvil y 0.44 s en escritorio**, con 4G lenta y CPU ×4.

### Evidencia

`lint`, `tsc` y build limpios · 47 páginas · auditoría `ES 378/378 · EN 378/378 · PT 378/378` · contraste del hero sin fallos en 14 viewports × 6 elementos · estructura sin incidencias en 16 viewports · header sin fallos en 7 viewports · beat 2 sin fallos en las posiciones reales de lectura.

**Nota sobre el beat 2 al 85% de scroll:** la medición reporta fallos ahí, y son artefacto. A esa altura el texto está saliendo por detrás del header (medido: y de viewport 29–93 con un header de 80px). No es una posición de lectura.

### Nota de método

Esta sección costó cuatro intentos de medición fallidos antes de dar un número fiable: coordenadas de página frente a viewport en una sección `sticky`, un contenedor de texto mal seleccionado que dejaba parte del texto visible, y un selector de velo que no encontraba el elemento —lo que hacía que tres variantes del barrido dieran idéntico resultado porque **ninguna se aplicaba**—. El patrón que sí funciona con `sticky`: capturar el viewport completo y recortar en el análisis con coordenadas de viewport.

---

## Bloque 20 · El signature moment recupera su video — 2026-09-01

**Entrega:** `C1972.mov` — 27 s, HEVC Main 10, 3840 × 2160, 13.6 Mbps, 46 MB.

### El material no admite bucle, y se comprobó midiendo

Es un **travelling continuo**: la cámara se mueve entre 3.5 y 14.4 por segundo y **no se detiene en ningún momento** del clip. De ahí se sigue todo lo demás.

| Intento | Resultado | Por qué |
|---|---|---|
| Buscar la ventana que cierre | **Ninguna.** Mejor coste 23.8/255, peor 36.7 | Se evaluaron todas las de 10–12 s comparando la secuencia de medio segundo alrededor de cada extremo, para que casara imagen **y** movimiento. Rango estrecho y todo alto: la firma de un plano que avanza sin volver |
| Fundido cruzado de cola sobre cabeza | **Descartado.** Se estanca en 12.6 | Un fundido disuelve entre dos imágenes distintas, no devuelve la cámara a su origen. Producía una doble exposición de un segundo |
| Ida y vuelta | **Descartado.** Cierra numéricamente (6.4) pero **se ve mal** | El desenfoque de movimiento va al revés y el ojo lo lee como rebobinado. Lo detectó el usuario mirándolo; la métrica decía que estaba bien |

**Lección:** el cierre del bucle se puede medir, pero que el movimiento se sienta natural no. Esa parte hay que verla.

### La solución

Bucle **recto** —termina y vuelve a empezar— con entrada y salida al color del fondo (`--color-canvas`). Los dos extremos llegan al mismo tono, así que no hay salto, y bajo el velo oscuro de la sección se lee como un respiro del plano y no como un efecto.

| | |
|---|---|
| Duración | 11.01 s |
| Cierre | **3.7/255** (umbral de imperceptible: 8) |
| Fundido | 0.5 s — cierra tan bien como 0.8 s (2.2) pero interrumpe la mitad de tiempo |
| Formato | H.264 High, 1920 × 1080, sin audio, `faststart` |
| Peso | **1.82 MB** |
| Póster | 90 KB, **del centro del bucle** — con la entrada fundida, el fotograma 0 es casi negro |

### Un fallo de accesibilidad que solo aparece con video

Con `prefers-reduced-motion: reduce` la sección colapsaba correctamente **pero el video seguía reproduciéndose**. Con el hueco del placeholder no se notaba, porque no había video.

Es un bucle infinito de movimiento junto al texto que se está leyendo: §21 lo prohíbe y WCAG 2.2.2 pide poder detener lo que arranca solo y dura más de cinco segundos. `Media` es Server Component y no puede leer una media query, así que la rama de video pasa a `components/ui/VideoMedia.tsx`, un cliente mínimo. **La fotografía sigue en el servidor.**

Verificado: sin preferencia reproduce; con preferencia queda el póster.

### Evidencia

`lint`, `tsc` y build limpios · 47 páginas · `ES 378/378 · EN 378/378 · PT 378/378` · contraste sobre el **video en movimiento** sin fallos en 2 viewports × 2 posiciones de scroll × 5 momentos del bucle · hero y estructura sin fallos.

`C1972.mov` y `estacion-medellin.mp4` quedan fuera del repositorio.

### Consecuencia

`estacionInfraestructura` —la foto que ocupó el beat 2 mientras no había video— queda registrada y sin uso. Se conserva: el registro de media es un catálogo de lo que existe.

### Pendiente

Durante el primer ~20% del recorrido de la sección el titular **cruza el borde del video recortado**: el texto aparece completo cuando el recorte aún está al 23%, y una línea vertical parte las palabras. Medido a 5%, 10% y 15% de scroll. Se corrige retrasando la aparición del texto o reduciendo el recorte inicial; no se tocó porque cambia el ritmo del beat.

---

## Bloque 21 · La apertura del beat 2, recalibrada al material real — 2026-09-01

**Origen:** dos observaciones del usuario tras verlo — *"se ve un poco pixelado"* y *"me gusta la animación con el scroll, solo que como está se ve raro"*.

Las dos tenían la misma causa de fondo: **los valores de la animación se fijaron contra el hueco del placeholder, que era una superficie quieta.** Con material real dejan de servir.

| Síntoma | Causa medida | Corrección |
|---|---|---|
| Video blando | `scale: 1.12` obliga a estirar la fuente hasta ~3226 px en una Retina de 1440. Con la fuente a 1920, un **1.68× de ampliación** | Fuente a **2560** y `scale` a **1.05** → ampliación **1.18×** |
| La apertura se veía rara | El titular empieza al **14.2%** del ancho y el recorte llegaba al **28%**: durante el primer 20% del recorrido una línea vertical partía las palabras. Medido a 5%, 10% y 15% de scroll | Recorte inicial a **10%**, por debajo del 14.2%. El texto queda dentro del cuadro **en todo el recorrido**, verificado en 8 puntos |
| Movimiento poco fluido | Una caja creciendo mientras la cámara avanza son dos movimientos compitiendo | 10% en vez de 28% lo vuelve un asentamiento, y termina antes (45% del recorrido en vez de 70%) para no arrastrarse sobre el movimiento del plano |

**Se probó retirar la apertura por completo** —dejando que el plano fuera el único movimiento— y se descartó: el usuario quiere la animación, y el problema no era que existiera sino su calibración.

**Peso:** 1.82 → 2.92 MB por subir de 1920 a 2560 px. Por encima de los 2 MB del brief, y es una decisión consciente: el video es `preload="none"`, está bajo el pliegue y no es el elemento LCP. La nitidez en el beat que la sección llama *signature* vale ese megabyte.

### Evidencia

`lint`, `tsc` y build limpios · 47 páginas · titular dentro del cuadro en 8 puntos del recorrido (2%–60%) · contraste del hero y estructura sin fallos · `prefers-reduced-motion`: sección colapsada a 0.67× viewport, video pausado, recorte en 0%.

---

## Bloque 22 · La apertura del beat 2 solo funcionaba en tres anchos — 2026-09-01

**Origen:** pregunta del usuario, *"¿crees que funciona a la perfección en los diferentes viewports?"*. No lo estaba, y no se sabía porque **la calibración del bloque 21 se hizo solo a 1440 px**.

### El fallo

El recorte es un **porcentaje del ancho**; el texto arranca tras un **margen fijo**. Escalan distinto, así que la distancia del titular al borde cambia con el viewport:

| Viewport | El titular empieza en | Recorte máx. | ¿El borde parte las palabras? |
|---|---|---|---|
| 1024 px | **3.8%** | 9.5% | **sí** |
| 768 px | 4.3% | 9.5% | **sí** |
| 390 px | 6.3% | 9.5% | **sí** |
| 1440 px | 10.3% | 9.5% | no |
| 1920 px | 20.6% | 9.5% | no |

**Cruzaba en 9 de 12 anchos.** Ajustar el número no lo arregla: no existe un porcentaje que quede por debajo del 3.8% de 1024 y siga siendo una animación visible.

### La corrección: un orden, no un valor

El texto entraba por `whileInView` —al asomar la sección— mientras el recorte seguía a medias. Ahora entra por un **pestillo de un solo sentido** atado al recorrido: primero se asienta el cuadro (termina al 25%), después entra el texto (30%). El borde no puede coincidir con las palabras en ningún ancho, porque ya no coexisten.

Un pestillo y no una opacidad ligada al progreso: la cabecera del archivo ya advertía que eso haría desaparecer el texto al subir. Verificado: al volver arriba tras haber bajado, el texto sigue visible.

Con el orden resuelto, la apertura **recupera recorrido**: 18% en vez de 10%, porque ya no tiene que caber por debajo de un texto.

### Un fallo que la corrección reintrodujo

Atar el texto al recorrido devolvió el problema que la cabecera advertía: **al llegar por `#infraestructura` el progreso es 0, el pestillo no salta y la sección se ve sin una palabra.** Medido: opacidad 0 a 390 y a 1440 px.

Se añadió una salida: si la sección lleva 1.2 s en pantalla y el progreso sigue sin avanzar, se abre sola —cuadro **y** texto—. Abrir solo el texto habría devuelto el borde cruzando las palabras.

Ninguna ruta del sitio enlaza a esa ancla, pero la URL es pública.

### Verificación

| Caso | Resultado |
|---|---|
| Borde coincidiendo con texto visible, **14 viewports × 8 puntos de scroll** | **ninguno** |
| Texto visible al final del recorrido, 14 viewports | **todos** |
| Llegada por ancla (390 y 1440) | texto visible, recorte 0% |
| Recarga a media sección | texto visible |
| Volver arriba tras bajar | texto sigue visible |
| Recorrido normal al 3% | texto oculto, recorte 16.8% — la apertura ocurre |
| `prefers-reduced-motion` | sección 0.67× viewport, texto visible, video pausado, recorte 0% |

Contraste del hero, estructura y header: sin fallos.

### Lección

Calibrar una animación proporcional contra un solo viewport no sirve. El síntoma —"se ve raro"— aparecía en 9 de 12 anchos y en el que yo revisaba no aparecía.

---

## Bloque 23 · La película de marca, como pieza y no como fondo — 2026-09-02

**Entrega:** `Video Home.mov` — 65 s, 3840 × 2160, 46 Mbps, **377 MB**, con audio PCM.

### El material obligó a cambiar el enfoque

No es metraje de fondo: es una **pieza terminada** con narración, subtítulos quemados en inglés (~4.2 s a ~58 s) y cierre con logo. Integrarla como el resto de vídeos del sitio —autoplay, silenciada, en bucle— habría fallado en tres frentes:

- **Silenciada pierde el mensaje**, que está en la narración.
- **En bucle no es un bucle:** 65 s con logo de cierre son una película reiniciándose.
- **Subtítulos en inglés sobre `/es` y `/pt`** contradicen la regla del brief de assets.

Por eso `Media` y `VideoMedia` ganan un modo `controls`: con él no hay reproducción automática, ni bucle, ni silencio. Un fondo se mira sin querer; una pieza con narración se decide ver, y para eso hace falta poder darle play, pausar, buscar y oírla. `prefers-reduced-motion` deja de aplicar en ese modo porque nada arranca solo.

**Ubicación:** beat 7, en la franja ancha bajo la cita del fundador — que ya estaba compuesta como *material presentado*, no como fondo. `visionCeo` sigue registrado y pendiente: es otra pieza.

### El póster, elegido midiendo

Se puntuaron los 130 fotogramas (2 fps) por energía de bordes y exposición, descartando el tramo con subtítulos. Elegido **4.0 s**: unas manos conectando el cargador a un vehículo.

Los aéreos de Medellín puntuaban más alto en nitidez y se descartaron — **la métrica premia detalle, no relevancia**.

**Un error propio que costó dos intentos:** con `-ss` antes de `-i`, ffmpeg busca por fotograma clave y no por tiempo exacto. El primer póster acabó en el segundo ~5, justo sobre un subtítulo quemado, y el análisis de nitidez apuntaba a 4.4 s —ya dentro del plano siguiente— por el mismo desfase. Rehecho con `-ss` después de `-i`.

### Rendimiento

| | |
|---|---|
| Servido | 1920 × 1080, H.264 High + AAC 128k, `faststart`, **27.6 MB** |
| **Antes de darle play** | **67 KB** — solo el póster, en los 7 viewports probados |
| **CLS** | **0** en los 7 viewports |
| Proporción | 1.776–1.780 (16:9 exacto) en todos los anchos |

El `aspect-[16/9]` que aplica `Media` reserva el espacio, así que el póster entra sin desplazar nada. Los 27.6 MB no viajan hasta que alguien los pide.

### Pendiente, y no es menor

**El vídeo tiene cero pistas `<track>`** y sus subtítulos están quemados en inglés. WCAG 1.2.2 exige subtítulos reales para audio pregrabado, y los quemados no son accesibles ni traducibles. Hace falta un máster **sin texto incrustado** más `.vtt` en los tres idiomas. Registrado como decisión D3 en `docs/05-assets-todo`.

**El vídeo es utilizable, pero esta sección no cumple 1.2.2 hasta que llegue ese máster.**

### Evidencia

`lint`, `tsc` y build limpios · 47 páginas · `ES 380/380 · EN 380/380 · PT 380/380` · reproducción verificada con audio (`muted:false`, `volume:1`, 65.13 s) · `aria-label` presente y alcanzable por teclado · con `prefers-reduced-motion` sigue pausado · contraste del hero y estructura sin fallos.

`Video Home.mov` (377 MB) queda fuera del repositorio.

---

## Bloque 24 · Portada de la película, cambiada a elección del usuario — 2026-09-02

**Cambio:** el póster pasa del fotograma de 4.0 s —manos conectando el cargador, elegido por medición— al **de 2.0 s**, el vehículo entrando por la rampa del parqueadero. Preferencia del usuario.

**Verificado antes de aplicarlo:**
- El tramo está **limpio de subtítulos quemados** (los primeros aparecen a ~4.2 s).
- Nitidez **plana entre 1.9 y 2.15 s** (26.2 frente a 25.9): el coche está en movimiento, pero no hay trepidación que evitar. Se usa el 2.0 exacto que se pidió.

**Peso: 138.7 KB frente a los 120 KB del brief.** Es un plano con mucho detalle fino —follaje, ladrillo, texturas— y ni a calidad 13 baja del umbral. Se comparó contra 1600 px mejor comprimido al mismo peso y a tamaño real es indistinguible. Se acepta a conciencia: no es el elemento LCP, vive en el beat 7 y es lo único que se descarga antes de pulsar play.

**Observación de marca, no técnica:** en ese fotograma la puerta del vehículo lee **"PORSCHE EXPERIENCE"**, y a tamaño completo es el texto más legible del encuadre. En la portada de una pieza de marca de Voltop, la marca más visible acaba siendo ajena. Queda anotado para que se decida con criterio, no por descuido.

### Evidencia

Build limpio · CLS **0** y proporción 16:9 exacta a 390 y 1440 px · **138.7 KB descargados antes de play**, nada más · vídeo pausado hasta que el usuario lo pide.

---

## Bloque 25 · Portada definitiva de la película — 2026-09-02

**Segundo 3.0**, elegido por el usuario: dos vehículos cargando en el parqueadero, con los equipos Voltop y la luz azul al fondo.

Es la mejor de las tres candidatas por tres motivos, y dos son medibles:

| | 4.0 s · manos | 2.0 s · rampa | **3.0 s · parqueadero** |
|---|---|---|---|
| Peso | 67 KB ✓ | 138.7 KB ✗ | **110.8 KB ✓** |
| Limpio de subtítulos | sí | sí | **sí** |
| Marca ajena dominante | no | "PORSCHE EXPERIENCE" en la puerta | insignia trasera, menor |
| Registro visual | oscuro | claro | **oscuro, como el sitio** |
| Infraestructura Voltop visible | parcial | no | **sí, dos equipos al fondo** |

El de 2.0 s no bajaba de 138 KB ni a calidad 13 —plano con mucho detalle fino—; este es más oscuro y comprime mejor, así que **vuelve a entrar en el presupuesto de 120 KB**.

### Evidencia

Build limpio · CLS **0** y proporción 16:9 exacta a 390 y 1440 px · **110.9 KB descargados antes de pulsar play**, nada más · vídeo pausado hasta que el usuario lo pide.

---

## Bloque 26 · Fases 1–2 · Vocabulario visual y microinteracción — 2026-09-02

**Origen:** análisis de `go-electra.com` como referencia, con extracción de estilos computados —no lectura de su HTML—. Objetivo declarado: elevar el nivel visual y de interacción **sin rediseñar** ni perder identidad.

### Lo que el análisis encontró, medido

Extraídos todos los radios y transiciones del sitio de referencia:

| Radio | Usos | Qué es |
|---|---|---|
| `9999px` | 22 | Píldoras de botón |
| **`0 80px 0 0`** | **17** | **Una esquina superior derecha sobredimensionada** |
| `0 128px 0 0` | 4 | La misma, mayor |

| Movimiento | Valores |
|---|---|
| Duraciones | 0.15s ×12 · 0.2s ×35 · 0.4s ×25 |
| Easing dominante | `cubic-bezier(0.4, 0, 0.2, 1)` ×60 |
| **Sobreimpulso** | **`cubic-bezier(0.34, 1.56, 0.64, 1)` ×4** |

Dos conclusiones: la esquina asimétrica es su firma visual entera, y **el rebote aparece solo cuatro veces en todo el sitio**. La contención es el patrón, no el efecto.

### Fase 1 · Tokens

| Token | Valor | Criterio |
|---|---|---|
| `--radius-signature` | `clamp(1.75rem, 1rem + 3.2vw, 4rem)` | Fluido como la tipografía (§22): 64px sobre un bloque de 1440 es el 4.4% de su ancho, pero sobre uno de 360 sería el 18%. Con `clamp` se mantiene la proporción, no el valor |
| `--ease-overshoot` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Único easing con sobreimpulso del sistema. Reservado a microinteracciones de control |

**`Media` gana la prop `corner`**, activada por bloque y no por defecto: un fondo a sangre no tiene esquinas que redondear, y aplicarlo a todo lo convertiría en textura en lugar de firma.

Aplicada a los **7 bloques de media en línea**: película del beat 7, franja e imagen de `/nosotros`, apertura de `/empresas`, portada y cuerpo de novedades, y la entrada del registro. **No** a los fondos a sangre (hero, beat 2).

Proporción resultante: **9.0% del ancho a 360px y 4.3% a 1920px** (la referencia ronda el 11% — más contenido, acorde a nuestro registro oscuro).

### Fase 2 · Microinteracción

La flecha de `Button` pasa a `--ease-overshoot` y su recorrido de 2px a 4px: **con 2px el sobreimpulso no se percibe y solo se siente lento**, que es peor que no tenerlo.

Es el **único** uso del rebote en el sistema, con presupuesto declarado en el token: si aparece más de cinco veces en una vista, sobra.

### Corrección al análisis

La primera lectura interpretó el CTA del hero de la referencia como un **buscador**. No lo es: es un botón con microinteracción que lleva a la página de estaciones —exactamente lo que el CTA de Voltop ya hace—. La fase que proponía convertir nuestro CTA en buscador **se elimina**; lo que quedaba de valor era la microinteracción, y eso es la fase 2.

### Evidencia

`lint`, `tsc` y build limpios · 47 páginas · `ES 380/380 · EN 380/380 · PT 380/380` · contraste del hero sin fallos en 14 viewports · estructura sin incidencias en 16 · header sin fallos en 7 · **sin overflow en 7 anchos × 5 rutas** · con `prefers-reduced-motion` la transición de la flecha queda en 1e-06s (anulada por la regla global).

---

## Bloque 27 · Fase 3 · Redes sociales en el footer — 2026-09-02

**Entrega:** perfiles de Instagram, Facebook y LinkedIn.

### Los enlaces se verificaron antes de publicarlos

§15 prohíbe publicar un enlace sin destino real, así que los tres se comprobaron con una petición: **los tres responden 200**. Y se guardan las URLs **canónicas**, no las que entrega el botón de compartir:

| Entregado | Publicado | Por qué |
|---|---|---|
| `instagram.com/voltop.co?igsi=…` | `instagram.com/voltop.co` | El parámetro es de rastreo y ata el enlace a una sesión |
| `facebook.com/share/18uWjiJFsV/?mibextid=…` | `facebook.com/people/Voltop/61592759125960/` | Era un redirector: resuelve, pero puede caducar y añade un salto en cada clic |
| `linkedin.com/company/voltop-energy/` | igual | Ya era canónica |

### Accesibilidad

El icono es `aria-hidden` y el nombre accesible lo da un `sr-only`, **no un `aria-label`**: así el texto que anuncia la asistencia y el que vería quien usa lupa son el mismo, sin dos fuentes de verdad que puedan divergir. Incluye el aviso de pestaña nueva (WCAG 3.2.5), como el resto de enlaces externos.

Objetivo táctil **44×44 px** verificado en los tres, aunque el icono mida 18: el área se declara en el enlace, no en el trazo.

### Un detalle de dibujo

La marca oficial de Facebook es una forma pensada para RELLENO. Trazada tal cual daba un contorno de "f" que desentonaba junto a Instagram y LinkedIn, que son cuadrados redondeados con glifo dentro. Se redibujó con el mismo lenguaje: **tres cuadrados, mismo grosor de trazo**.

### No se añadió

- **Términos y condiciones**: no existe el texto legal. Igual que la política de privacidad, que sigue en `noindex` por lo mismo.
- **Wordmark gigante de cierre**: se descartó. Es decoración sin función y el footer ya abre con el logo; §12 pide que cada elemento justifique su existencia. Queda disponible si se decide que aporta presencia de marca.

### Evidencia

`lint`, `tsc` y build limpios · `ES 380/380 · EN 380/380 · PT 380/380` · tres enlaces con `rel="noopener noreferrer"`, 44×44 px y nombre accesible verificado en el DOM.

---

## Bloque 28 · Fase 4 · Preguntas frecuentes — 2026-09-02

**Entrega:** cinco preguntas en `/red#preguntas`, acordeón accesible, tres idiomas.

### La pregunta que NO está, y por qué

**"¿Cuánto cuesta cargar?"** es, con diferencia, la más buscada de la categoría. No está: las tarifas no están confirmadas comercialmente —`pricing: null` en todo el dataset— y la decisión de publicarlas sigue abierta (**O5**). §33 prohíbe inventar cifras, y hacerlo en el sitio exacto donde el usuario viene a fiarse de nosotros sería el peor lugar posible para empezar.

**Es la primera que hay que añadir en cuanto exista la decisión.**

Las cinco publicadas cumplen dos condiciones a la vez: se preguntan de verdad antes de ir a cargar, y **se responden con datos que ya tenemos** (conectores y potencias reales del dataset, ciudades reales, el flujo que ya describe "Cómo cargar").

### Decisiones de patrón

**Disclosure, no tabs.** §23 exige "ARIA completa o ninguna". Un botón con `aria-expanded` que controla una región, y nada más: sin `role="tab"`, sin flechas, sin `aria-multiselectable`. El `<button>` nativo ya trae foco, Enter y Espacio.

**Varias abiertas a la vez.** Cerrar la anterior al abrir la siguiente mueve el texto que la persona está leyendo, y comparar potencia con compatibilidad es un caso real.

**El panel no usa `hidden`.** La altura se anima con `grid-rows: 0fr → 1fr`, la única forma de transicionar a altura automática sin medir en JS, y eso obliga a dejar el contenido en el DOM. Cerrado se marca **`inert`**: sale del árbol de accesibilidad y del orden de tabulación. Sin él, un lector de pantalla leería las cinco respuestas seguidas.

**Ubicación.** Después de "Cómo cargar" y antes del handoff B2B, siguiendo el orden en que aparecen las dudas: primero cómo funciona, luego lo que queda suelto, y la última pregunta entrega el hilo a la sección B2B que sigue. Carril estrecho: ninguna sección vecina repite estructura (rejilla → 3 columnas → carril → fila única), que es como §12 pide construir el ritmo.

### Un defecto corregido en móvil

El panel llevaba `pr-10` para librar la columna del `+/−`. En móvil la respuesta va **debajo** del botón: ahí no libraba nada y robaba 40px a una medida de línea ya justa. Pasó a `md:pr-10`.

### Hallazgo lateral: `.measure` no rinde lo que dice

`.measure` vale `62ch` y su comentario declara "45–75 caracteres". Medido sobre el render real da **~83**. La causa: `ch` es el ancho del glifo "0", bastante más ancho que el carácter medio de un texto con espacios. La proporción en esta tipografía es ~1.31, así que `62ch` ≈ 83 caracteres.

**Afecta a todo el sitio, no solo al FAQ.** Aquí se resolvió usando `measure-narrow` (46ch → 59–62 caracteres reales). Corregir `.measure` globalmente cambiaría secciones ya aprobadas, así que **queda levantado como decisión pendiente**, no ejecutado.

### Evidencia

`lint`, `tsc` y build limpios · `ES 396/396 · EN 396/396 · PT 396/396`

| Verificación | Resultado |
|---|---|
| Cerradas al cargar · `aria-controls` resuelve | 5/5 |
| Objetivo táctil (móvil) | 78–98px |
| Paneles `inert` cerrados | 5/5 |
| Enter y Espacio abren · varias simultáneas | Sí |
| Outline de encabezados | h1 → h2 → h3, sin saltos |
| Caracteres/línea (390/768/1440, ES·EN·PT) | 43–62 |
| Desbordamiento horizontal | 0px |
| Contraste pregunta / respuesta / enlace / icono | 17.5 · 9.05 · 11.37 · 6.34 |
| Foco visible | outline 2px sólido |
| Reduced-motion: elementos invisibles | 0 |

---

## Bloque 29 · FAQ: copy definitivo de Camilo — 2026-09-02

Las cinco preguntas y respuestas las escribió Camilo. El español va **literal**; inglés y portugués son traducción de ese original, no versiones nuevas.

El eje cambió: mis cinco preguntas eran técnicas (conectores, potencias, cobertura, B2B); estas cinco son **de experiencia** —cómo cargo, dónde, cuánto cuesta, cómo pago, qué hago si algo falla— y son las que de verdad se hacen. La tarifa dejó de estar bloqueada porque la respuesta describe **el mecanismo, no la cifra**: "antes de iniciar tu carga podrás consultar la tarifa aplicable". Eso se puede publicar hoy sin inventar nada.

El titular de sección pasó de "Lo que preguntan antes de cargar" a **"Antes, durante y después de cargar"**: la última pregunta es sobre ayuda *durante* una carga, y el titular anterior dejaba fuera parte de lo que hay debajo.

### Tres cosas quedan levantadas, no corregidas

**1 · "Disponibilidad" contra la nota de la misma página.** Dos secciones más arriba, bajo el buscador, `/red` muestra: *"La disponibilidad en tiempo real llegará con la integración de datos de operación."* La respuesta 2 ofrece "disponibilidad" entre lo que se consulta antes de llegar. Son afirmaciones que conviven en una sola página y §19 dice que un titular es un contrato. **Decisión de producto**, no de copy.

**2 · La respuesta 5 no tiene a dónde ir.** Remite a "los canales disponibles en Voltop" y hoy el sitio no nombra ninguno. El único formulario es `/empresas#contacto`, captación B2B para dueños de espacio: destino equivocado para alguien con un problema a mitad de carga. Va **sin enlace** —§15 prohíbe publicar enlaces sin destino real— hasta que exista un canal (WhatsApp, correo, chat en la app).

**3 · Cuatro de cinco respuestas mandan a la app, y el sitio no la entrega.** No hay enlaces de App Store ni Google Play (**O8**), así que el FAQ pide descargar algo que desde aquí no se puede descargar. La respuesta 2 lleva enlace a la cobertura por ciudad para que al menos esa no muera en la app.

### Evidencia

`lint` y build limpios · `ES 394/394 · EN 394/394 · PT 394/394` · 5 preguntas, 43–63 caracteres/línea en 390/768/1440 y en los tres idiomas, 0px de desbordamiento, ambos enlaces con destino real (`#como-cargar`, `#ciudades`).

---

## Bloque 30 · FAQ: los dos enlaces que faltaban — 2026-09-02

**Decisiones de Camilo (2026-09-02):**

**1 · La disponibilidad se queda como está.** La respuesta 2 ofrece "disponibilidad" y la 1 habla de sesión "en tiempo real", mientras `states.pendingRealtime` avisa dos secciones más arriba de que eso todavía no está integrado. En este alcance no se conecta nada: el texto vive en el front y se edita ahí cuando la disponibilidad cambie. Queda anotado en `content/data/faq.ts` para que quien lo lea mañana sepa que es deliberado y no un descuido.

**2 · Soporte: WhatsApp +57 315 986 4931**, operado vía Freshchat.

Se publica como **`wa.me/573159864931`, no como `tel:`**. Un `tel:` lanza una **llamada telefónica**; el canal de soporte es la conversación de WhatsApp, y `wa.me` es lo que la abre. Verificado: responde 200 y redirige a `api.whatsapp.com/send/?phone=573159864931`. *(Si además se quiere que llame por teléfono, es otro enlace y se añade aparte.)*

**3 · Descarga de la app: `https://app.voltop.co/`**

> **PENDIENTE ANTES DEL LANZAMIENTO.** Al implementarlo devolvía **503 en tres intentos seguidos**, con user-agent de navegador y por HTTP y HTTPS. `voltop.co` respondía 200, así que el problema era del subdominio, no del dominio. Se publica igual porque es el dominio oficial y el sitio no está en producción, pero **§15 no admite un enlace que no lleva a ninguna parte**: hay que verificarlo antes de publicar.

Con esto la respuesta 5 deja de ser un callejón sin salida y O8 (badges de tienda) deja de bloquear al FAQ: cuatro de cinco respuestas mandan a la app y ahora hay por dónde ir.

### La flecha de los enlaces externos

Primero usé el glifo `↗`. No funcionaba: en esta mono sale **más pequeño y fino que la `→`**, y quedaba desparejado justo al lado de ella — el mismo problema que tuvo el icono de Facebook en el footer. Se cambió por la **misma `→`, movida en diagonal al pasar el cursor**, que es exactamente lo que hace `Button`. Así "esto te saca del sitio" se dice de una sola forma en todo el sitio.

`Accordion` recibe el aviso de pestaña nueva **por prop**, no importando copy: §24 le prohíbe contener texto literal.

### Evidencia

`lint`, `tsc` y build limpios · `ES 395/395 · EN 395/395 · PT 395/395`

Los tres enlaces, en los tres idiomas: los externos con `target="_blank"`, `rel="noopener noreferrer"` y el aviso en el nombre accesible (*"Descargar la app · Se abre en una pestaña nueva"*, *"Escríbenos por WhatsApp · Se abre en una pestaña nueva"*); el interno resuelve a `/es/red#ciudades`, `/en/red#ciudades`, `/pt/red#ciudades`, sin prefijo de idioma pegado a las URLs absolutas.

---

## Bloque 31 · Fase 5 · Navbar — 2026-09-02

El navbar pasa a la estructura de Electra: **logo · menú · ¿Necesitas ayuda? · selector de idioma · CTA de app**.

### El CTA global cambia de destino

De **"Encontrar cargador"** a **"Descargar la app"**. No es un cambio estético: "Encontrar cargador" llevaba a `/red`, que ya está en el menú dos centímetros a la izquierda. El CTA duplicaba una entrada de navegación en lugar de ofrecer algo que la navegación no da. La app sí lo es — es donde de verdad se carga y se paga.

Dos excepciones razonadas:

- **`/empresas` conserva el suyo.** En B2B la conversión es la conversación con el equipo; sustituirla por una descarga de app rompería el journey.
- **`/red` deja de ser `null`.** Antes no tenía CTA porque "encontrar cargador" dentro del buscador era redundante. Descargar la app no lo es: es exactamente el paso siguiente de quien acaba de encontrar dónde cargar.

El evento de medición pasa a `cta_descargar_app_click`. Se conserva `cta_encontrar_cargador_click` porque sigue emitiéndose desde los CTA de página que llevan a `/red`.

### "¿Necesitas ayuda?"

Va **antes** del selector, en texto y sin borde. Es un enlace de RESCATE, no una acción: con borde competiría con el CTA que tiene al lado. Lleva a `/red#preguntas`, que es donde están las respuestas. En móvil entra como última entrada de la lista del menú — esconderla en un menú que no la lista sería peor que no tenerla.

### Fuente única para los enlaces externos

Nuevo `content/data/links.ts` con la URL de la app y la de WhatsApp. Antes vivían repetidas en `faq.ts` y en el header, y **una URL repetida es una URL que algún día cambia en un sitio y no en el otro**. La advertencia del 503 vive ahí, junto al valor.

### Evidencia

`lint`, `tsc` y build limpios · `ES 394/394 · EN 394/394 · PT 394/394` · CTA con nombre accesible *"Descargar la app (Se abre en una pestaña nueva)"* y ayuda resolviendo a `/es/red#preguntas`.

---

## Bloque 32 · Términos y condiciones y política de datos — 2026-09-02

El área legal entregó los dos documentos (2026-09-02, con fecha de emisión 29 de mayo de 2026). Con eso se cierra el bloqueo más antiguo del proyecto.

- **`/legal/terminos`** — nueva. 38 secciones.
- **`/legal/privacidad`** — deja de mostrar "texto legal pendiente" y pierde el `noindex`: la marca existía por no tener texto definitivo. 20 secciones.
- Ambas entran al **sitemap** con su fecha real de emisión, no la del build — justo lo que la cabecera de `sitemap.ts` reprochaba.
- El footer enlaza las dos.

### Generado, no transcrito

El contenido se extrajo de los `.docx` con un script. Transcribir 250 párrafos a mano habría metido erratas en un texto donde **una errata es un problema legal**. Resultado: 58 secciones, 109 párrafos, 12 listas.

### Por qué el texto legal NO es `Localized`

Todo el contenido del sitio lleva los tres idiomas obligatorios. Estos dos documentos no: son **español plano**.

No es una traducción pendiente. Un instrumento jurídico traducido por quien no lo emitió deja de ser el mismo instrumento — cambia obligaciones, plazos y definiciones sin que nadie las haya aprobado. §38 dice que el texto legal lo emite el área legal y "no se redacta ni se aproxima"; traducirlo **es** aproximarlo.

Las páginas en inglés y portugués muestran el original con un aviso de que la versión española es la vinculante. El cuerpo va envuelto en `lang="es"` para que un lector de pantalla no lea 38 secciones de español con fonética inglesa.

### El índice no es decoración

38 secciones sin índice significan buscar "cancelación" a rueda de ratón. Fijo a la izquierda en pantallas anchas, plegado en un `<details>` nativo en estrechas — sin JS y sin ARIA a medias. Verificado: saltar a la sección 10 deja el título a 149px del borde, por debajo del header de 80px, gracias a `scroll-mt-28`.

### Dos cosas que aparecieron leyendo los documentos

**1 · Existe un canal de soporte real: `soporte@voltop.co`**, declarado en la política de datos. Pendiente de decidir si se suma al FAQ junto al WhatsApp.

**2 · La contradicción de "disponibilidad" se resuelve sola.** Los términos declaran, entre los servicios de la Plataforma: *"Consultar la ubicación y disponibilidad de las Estaciones de Carga"*. Es decir, el producto **sí** ofrece disponibilidad en la app. La respuesta 2 del FAQ era correcta; la que sobra es la nota `states.pendingRealtime` de `/red`, que habla de la integración de datos de operación del SITIO, no de la app.

### Evidencia

`lint`, `tsc` y build limpios · 50 páginas estáticas (antes 47) · `ES 402/402 · EN 402/402 · PT 402/402` · un solo `h1`, 38 secciones ancladas, 0px de desbordamiento, aviso de idioma presente solo en EN y PT.

---

## Bloque 33 · La app: sección, insignias y componente flotante — 2026-09-02

Con la URL de descarga entregada, se desbloquean tres puntos de la lista de Electra a la vez.

### El QR se generó y se VERIFICÓ

No hay librería de QR en el proyecto y no se añadió ninguna: un código de una URL fija no necesita código en tiempo de ejecución. Se generó una vez y se guardó como `public/qr-descargar-app.svg` — **1.2 KB**, 33×33 módulos.

Lo importante es que **se decodificó después de generarlo** y devuelve exactamente `https://app.voltop.co/`. Un QR mal generado es indistinguible de uno bueno a simple vista, y publicarlo sin comprobarlo habría sido publicar un enlace roto que nadie detecta hasta que un usuario lo escanea.

Lleva la **zona tranquila de 4 módulos** que exige la especificación, y va sobre blanco: invertirlo para que "combine" con el lienzo oscuro hace que muchos teléfonos fallen.

### Insignias de tienda

Dibujadas como SVG, no incrustadas como PNG: las oficiales vienen con fondo negro fijo, que sobre un lienzo casi negro desaparece, y ampliadas se ven borrosas.

**Las dos apuntan a `app.voltop.co` a propósito**: es un enlace dinámico que resuelve a la tienda correcta según el dispositivo. **INCOMPLETO** — cuando existan las URLs directas de cada ficha se añaden a `externalLinks` y cada insignia apunta a la suya.

El rótulo superior usa la **redacción oficial de Apple y Google en cada idioma**, no una traducción propia: ambas fijan esa línea en sus guías de marca, y una insignia con texto inventado deja de ser la insignia.

### Sección de descarga en la Home

Va entre la película y el cierre. Lo que promete está tomado de lo que **los Términos y Condiciones declaran como servicios de la Plataforma** (§4 del documento legal): ubicación y disponibilidad, activación por QR, historial de sesiones y cobros. No se promete nada que el documento legal no reconozca, que es la forma más barata de cumplir §19.

El QR se **oculta por debajo de `md`** en vez de encogerse: en un teléfono el código sobra, porque las insignias ya funcionan ahí. En escritorio es al revés — las insignias llevan a una ficha que no se puede instalar en el aparato que tienes delante, y el QR salta ese hueco.

### Componente flotante: cuatro reglas, y las cuatro son restricciones

Un elemento fijo compite con todo el contenido durante todo el recorrido, así que tiene que justificar cada segundo que ocupa la pantalla.

| Regla | Por qué | Verificado |
|---|---|---|
| No aparece sobre el Hero | Ahí ya hay un CTA grande a la vista | opacidad 0 |
| Se aparta cuando la sección de descarga entra en pantalla | Flotar "descarga la app" sobre la sección que ya lo ofrece es ruido | opacidad 0 |
| Aparece en la zona intermedia | Es donde no compite con nada | opacidad 1 |
| Se cierra y no vuelve | Un flotante que reaparece tras cerrarlo es una trampa | — |

Además se calla en `/empresas` —donde la conversión es el formulario y §15 prohíbe que los CTA compitan— y en los legales, donde tapar contenido durante una lectura larga estorba. Y solo existe en escritorio: en un teléfono el QR no puede escanearse a sí mismo.

No atrapa el foco ni bloquea el scroll, porque **no es un diálogo modal**: es contenido complementario. Sí responde a Escape y usa `inert` mientras está oculto, para que no queden enlaces alcanzables con Tab en una tarjeta invisible.

### Corregido sobre la marcha

La tarjeta blanca del QR flotante se estiraba a lo ancho del panel, dejando medio panel en blanco: el texto que acompaña al código es `sr-only` y no ocupa espacio, así que `flex` repartía a un solo hijo visible. Pasó a `w-fit` centrado.

### Evidencia

`lint`, `tsc` y build limpios · `ES 415/415 · EN 415/415 · PT 415/415` · QR decodificado y coincidente · las tres reglas de visibilidad del flotante medidas en el render real.

---

## Bloque 34 · Vidrio, soporte y el flotante en móvil — 2026-09-02

### `.glass` — una superficie, no un div translúcido

Tres capas con trabajos distintos: el **medio** (`backdrop-filter` con desenfoque *y* saturación), el **canto especular** (borde de 1px con gradiente, dibujado con dos máscaras en XOR porque CSS no admite `border-image` con radios) y la **profundidad** (sombra amplia + realce interior).

La parte que casi siempre se olvida es **`brightness`**. Sin atenuar el fondo, un titular claro que pase por detrás se lee A TRAVÉS del panel y compite con el texto de encima. Con ella, lo de atrás sigue insinuándose —que es la gracia— pero ya no disputa la lectura.

Los valores salen de un **barrido medido sobre el peor caso**: la barra móvil, que cruza titulares de tamaño display a lo ancho de la pantalla, en 18 posiciones de scroll. En estado estable nada se lee a través ni al 52%; se dejó en **68%** por margen frente a un artefacto de composición —durante el scroll animado el navegador puede pintar el `backdrop-filter` con un fotograma atrasado—.

Contraste sobre el píxel **compuesto**: panel entre `rgb(15,22,38)` y `rgb(26,32,46)` en todo el recorrido, texto principal a **16.5:1** y secundario a **10.6:1**.

Sin `backdrop-filter` el panel pasa a fondo sólido. Es la única salida honesta: translúcido sin desenfoque deja el texto sobre lo que haya detrás.

### Un fallo que costó encontrar

`.glass` declaraba `position: relative`. `.glass` y `.fixed` de Tailwind tienen **la misma especificidad** —una clase—, así que ganaba la que apareciera después en la hoja: la tarjeta flotante dejaba de estar fija y aparecía **a 3013px del viewport** en lugar de anclada abajo a la derecha. Ahora `.glass` no declara `position` y quien la use sin `fixed`/`absolute` añade `relative` en el marcado.

### El flotante ya existe en móvil

Antes se ocultaba por debajo de `lg`, que es tanto como decir que la mitad del tráfico no lo veía nunca. Ahora son **dos piezas, no una encogida**: en escritorio la tarjeta con QR; en móvil una barra baja con la acción directa, porque un teléfono no puede escanearse a sí mismo.

La barra respeta `env(safe-area-inset-bottom)`: sin eso, en un iPhone queda bajo el indicador de inicio y el botón de cerrar se vuelve intocable. Verificado: 366×70 px, anclada a 12px del borde, objetivos táctiles de 66×44 y 44×44.

### Correo de soporte

`soporte@voltop.co` sale de la Política de Tratamiento de Datos, donde VOLTOP S.A.S. lo declara como dato de contacto — no de una suposición. Aparece en el **footer**, completo y en texto (un correo que se puede copiar de un vistazo ahorra un clic y un formulario), y como **segunda salida de la pregunta de ayuda** del FAQ.

Para eso el acordeón pasó de admitir un enlace a admitir varios: WhatsApp resuelve lo urgente —alguien varado en una estación— y el correo sirve para lo que necesita adjuntarse o quedar por escrito. Elegir por el usuario habría sido peor.

---

## Bloque 35 · Fase 6 · La sección de la red en la Home — 2026-09-02

### Qué había y por qué se fue

Un índice tipográfico: tabla de estaciones con ciudad, potencia y estado. Estaba bien resuelto, pero **repetía en la Home lo que `/red` hace mejor y con filtros**. §14 dice que la Home PRESENTA y las internas PROFUNDIZAN; listar el inventario aquí invertía esa relación y obligaba a mantener la misma tabla en dos sitios.

Ahora la Home responde a otra pregunta —**"¿esto ya existe y llega donde yo estoy?"**— y deja el inventario a `/red`.

### Las cifras no están escritas en ninguna parte

Puntos, potencias, ciudades y conectores se **calculan desde el dataset** en `getNetworkSummary()`. Una cifra escrita a mano deja de ser verdad en cuanto se añade una estación, y §33 prohíbe inventar cifras: la forma más segura de no inventarlas es **no poder escribirlas**. Añadir un registro actualiza la Home sola.

Hoy rinde: **27 puntos de carga · 60–120 kW · CCS1 · CCS2 · GB-T**, y dos tarjetas de ciudad con sus conteos reales de estaciones operativas frente a totales.

### El asset que llevaba meses parado

`estacionInfraestructura` estaba registrada desde el principio y **sin usar en ningún sitio**: material real de Voltop desaprovechado. Va como **suelo muy atenuado, no como sujeto** — el sujeto son los datos. Así la sección no repite la estructura del beat anterior (vídeo revelado por scroll en un marco contenido) ni la del Hero (fotografía a sangre con el titular encima).

El vidrio es el mismo material de la tarjeta de descarga. Si el sitio va a tener un lenguaje de superficie, tiene que repetirse o no es un lenguaje.

### Corregido en el camino

El título del flotante partía en dos líneas: el botón de cerrar compartía fila y le robaba 44px de ancho. Ahora va posicionado fuera del flujo.

### Evidencia

`lint`, `tsc` y build limpios · `ES 418/418 · EN 418/418 · PT 418/418` · 0px de desbordamiento en 1440, 768 y 390 · cifras verificadas contra el dataset.

---

## Bloque 36 · Pasada de tono, medición y datos estructurados — 2026-09-02

Tres auditorías especializadas en paralelo (copy, plan vs implementación, QA). Esto es lo que se ejecutó de las dos primeras.

### El diagnóstico de fondo del copy

El sitio estaba bien escrito y era honesto, pero **hablaba como constructora de infraestructura, no como compañía de producto**: "infraestructura" 21 veces, "instalamos/operamos/mantenemos" 36 veces, y fuera del bloque de descarga y del FAQ **la app aparecía en una sola línea de copy narrativo**. El brief pide exactamente lo contrario.

La corrección **no borra la narrativa de infraestructura** —es real, diferencial frente a Electra y honesta— sino que **rebalancea**: mete la capa digital donde no estaba.

| Dónde | Antes | Ahora |
|---|---|---|
| Tagline (aparece en `title`, meta y OG) | "Infraestructura de carga para la movilidad eléctrica de Colombia" | "La red de carga eléctrica de Colombia, simple y en tu teléfono" |
| Lead del Hero — el párrafo más leído | 100% sujeto-Voltop, sin mencionar la app ni al usuario | "Carga rápida donde ya te mueves y una app que la abre con un escaneo. Nosotros construimos y operamos la red; tú solo conectas." |
| Meta description de la Home | Abría con "Infraestructura", palabra que nadie teclea | Nombra Bogotá, Medellín y la app |
| Titular de `/nosotros` | "Infraestructura para un país que se está electrificando" | "Un país no se electrifica sin dónde cargar." |
| Titular de `/empresas` | "Carga eléctrica para tu negocio, operada por nosotros" | "Tú pones el espacio. Nosotros ponemos la red." |

### Seis promesas que el producto no cumplía (§19 · §33)

1. **"la red líder de Colombia"** — reclamo de liderazgo de mercado sin fuente, en la página que un inversionista lee con más lupa. Pasó a una invitación: *"…que quieren construir la red de carga de Colombia con nosotros"*.
2. **"Recomendadas"** — implicaba un motor de recomendación; `lib/data` documenta que es el orden curado del dataset. Ahora **"Destacadas"**.
3. **Filtro "Disponibilidad"** — rotulaba como activa la capacidad que la misma página declara no integrada dos secciones más arriba. Ahora **"Estado"**, que es lo que el chip de dentro dice.
4. **"La red crece cada mes"** — cadencia que nadie validó.
5. **"dobla la potencia de la red en Bogotá"** — cierto hoy, **falso el día que abra Corredor Norte** (150 kW, Bogotá), anunciado en la entrada de al lado. Un registro cuyas entradas caducan es peor que uno que solo declara el hecho.
6. **"puntos estratégicos del Valle de Aburrá"** — relleno; ahora dato real.

### Vocabulario interno que salía a la interfaz

"Integración de datos de operación", "CRM", "confirmación comercial". Es honesto en un prototipo, pero el usuario lo lee como *"esta gente me habla de sus procesos"*. Dos capas: **honestidad en el mensaje, lenguaje de producto en la superficie**.

El peor caso era el **callejón sin salida del formulario B2B**, en el instante de máxima intención: decía que no se había enviado y ahí terminaba. El comentario del archivo justificaba no dar alternativa *"porque no hay correo ni teléfono confirmados"* — **eso dejó de ser cierto**. Ahora ofrece WhatsApp y `soporte@voltop.co`, los dos verificados.

Y **"Correo corporativo"** pasó a **"Correo"**: imponía un requisito que la validación no exige, en el campo de mayor abandono y justo al perfil que más escribe desde Gmail.

### Registro de los CTA, unificado

Conversión y marca en **imperativo de segunda persona**; solo las acciones de sistema y los filtros en infinitivo. Estaban mezclados sin criterio: *"Descargar la app"* convivía con *"Descarga la app"* para la misma acción.

### Tres inconsistencias entre idiomas

- **"Nosotros"** era `Company` en el navbar y `About us` en el footer. Una entrada con dos nombres es dos entradas para quien la lee.
- El paso 03 de "Cómo cargar" se llamaba **"Sigue" / "Go" / "Ir"**: tres palabras vagas y distintas.
- El portugués de "Tres pasos y sigues tu día" prometía otra cosa: *"y ya estás cargando"*.
- Y el portugués de la sección de confianza era **agramatical** (*"O que dizem quem…"`).

### Medición: cuatro eventos declarados y sin un solo emisor

§31 declaraba eventos que nunca se disparaban.

| Evento | Estado | Ahora |
|---|---|---|
| `estacion_vista` | **La única vista del plan sin emisor**, y es el final del embudo B2C | `TrackView` en la ficha, con estación, ciudad, potencia, conectores y estado |
| `app_store_click` | Conversión primaria B2C, sin medir en **tres** superficies | 4 emisores: dos insignias, flotante escritorio, barra móvil |
| `cta_encontrar_cargador_click` | El registro afirmaba que se emitía; **cero call sites** | Hero y cierre de la Home, distinguidos por ubicación |

Para poder medir sin convertir páginas enteras a cliente se creó **`TrackClick`**: una isla que envuelve con `display: contents`, de modo que `Button` sigue siendo Server Component y el envoltorio **no existe para el layout** — meter un `<span>` alrededor de un botón habría roto el `flex` del padre.

### Datos estructurados que faltaban (§29)

- **`FAQPage`** en `/red` — el activo SEO más barato que quedaba sin explotar: cinco preguntas en tres idiomas con las respuestas exactas que la gente teclea. Se genera **desde la misma colección que pinta el acordeón**, así que no pueden divergir: un dato estructurado que no coincide con lo visible penaliza en vez de ayudar.
- **`BreadcrumbList`** en la ficha de estación — era el único de los tres tipos que §29 exige sin cumplir. Las migas visuales ya existían; esto es la misma jerarquía dicha para el buscador.

### Riesgo irreversible neutralizado

**481 MB** de másteres (`Hero.png`, `Hero_Banner.png`, `Video Home.mov`, `estacion-medellin.mp4`) estaban en `public/` **sin trackear Y sin ignorar** — la peor combinación posible: un `git add .` distraído los mete en la historia, y un binario de ese tamaño en el árbol de git es **permanente**. Ahora están en `.gitignore`. Sigue pendiente archivarlos fuera del repositorio.

También se retiraron los 5 SVG del andamiaje de Next, sin una sola referencia en el código.

### Otras correcciones

- **El flotante ahora sí "se cierra y no vuelve"**: la decisión se guarda en `localStorage` con `try/catch`, porque en navegación privada el simple ACCESO lanza. Antes era estado en memoria y reaparecía al recargar — justo la trampa que la regla decía evitar.
- **Las cifras de la red cuentan al entrar en pantalla** (`CountUp`). El valor final **ya está en el HTML servido**: si el JS no llega, ahí está el número. Y se escribe directo en el nodo con una referencia, sin `useState` — contar con estado son 60 renders de React por segundo para mover un texto.

### Evidencia

`lint`, `tsc` y build limpios · `ES 418/418 · EN 418/418 · PT 418/418` · **27 combinaciones** (9 rutas × 3 viewports) con 0px de desbordamiento y un solo `h1` · `FAQPage` en `/red`, `EVChargingStation` + `BreadcrumbList` en la ficha · los 6 eventos con emisor verificado.

---

## Bloque 37 · Fase 7 · View Transitions — intentada y revertida — 2026-09-02

**No se implementó, y conviene dejar escrito por qué para que nadie lo intente otra vez sin saberlo.**

`next.config.ts` acepta `experimental: { viewTransition: true }` y el build llega a imprimir **`✓ viewTransition`**. Eso induce a error: solo significa que el flag pasa el esquema de configuración de Next, no que haya transiciones.

Lo que hace ese flag es habilitar el componente **`<ViewTransition>` de React**, y ese componente **no existe en React 19.2.4 estable**: `unstable_ViewTransition` es `undefined`. Vive solo en el canal experimental.

**Verificado empíricamente, no deducido.** Con el flag activo, instrumentando `document.startViewTransition` antes de navegar de la Home a `/red`:

```
el navegador soporta la API: true
transiciones disparadas:     0
reglas ::view-transition:    3
```

Las reglas CSS estaban puestas y el navegador soporta la API — pero nadie la llama. Era **código muerto con aspecto de función**, que es peor que no tener nada: el siguiente que lo lea creerá que las transiciones existen.

Se revirtió todo: el flag, el CSS de `::view-transition-old/new` y la retirada del `template.tsx`. La transición de Motion que había vuelve a ser la que opera.

**Para hacerlo de verdad hay que mover React al canal experimental.** Esa es una decisión de riesgo en un sitio que va a producción, y no es mía: queda en la lista de pendientes para decidir.

---

## Bloque 38 · QA: ocho defectos corregidos — 2026-09-02

Barrido independiente sobre el build de producción: 14 rutas × 7 viewports, contraste medido sobre **píxel compuesto** (con el texto blanqueado para leer el fondo real, percentiles p01/p50/p99), foco recorrido con Tab, `prefers-reduced-motion` con y sin JavaScript.

### BLOQUEANTE · el flotante tapaba el momento firma, y no había forma de librarlo

En `#infraestructura` el contenido va **anclado al borde inferior de un panel fijado a pantalla completa**. La barra móvil se le superponía encima: CTA tapado hasta el **84% a 375px y el 100% a 768px**, pie al **100%** en todos. Y como el contenido está pinneado durante todo el pin, **no existía ninguna posición de scroll que lo liberara**. Presente en 11 de 11 posiciones.

### ALTA · la tarjeta secuestraba los controles del vídeo

La tarjeta de escritorio se solapaba con la barra de reproducción de la película. Medido con `elementFromPoint`: al 85% y al 95% del ancho el impacto era la tarjeta en 1024, 1280 y 1440. **Un clic en silenciar o en pantalla completa abría la tienda de apps.** Un flotante que secuestra un control ajeno no es intrusivo: es un fallo.

**Causa común de los dos:** la regla 2 vigilaba **una sola sección**. Ahora vigila una lista (`app-title`, `infraestructura`, `vision`) contando zonas visibles en un `Set` — con un booleano único, salir de una zona mientras se entra en otra se pisaba a sí mismo.

| | Antes | Ahora |
|---|---|---|
| Solape con el CTA del panel fijado | 11/11 posiciones | **0/11** en 375, 390, 768 y 1023 |
| Controles del vídeo | tarjeta al 85% y 95% del ancho | **vídeo** en 1024, 1280, 1440 y 1920 |

### ALTA · el pie quedaba tapado para siempre en móvil

Al llegar al fondo del documento no queda scroll para apartar la barra, así que los enlaces legales quedaban cubiertos de forma **permanente**: 29–32% cada uno y el aviso de prototipo al 100%. El `<footer>` reserva ahora `5.5rem + safe-area` por debajo de `lg`. Verificado: **0 elementos tapados**.

### MEDIA

| Defecto | Medida | Corrección |
|---|---|---|
| Marca duplicada en el `<title>` | "Red de carga · Voltop · Voltop" en 3 páginas × 3 idiomas | El `template` ya añade el sufijo; se quitó del copy |
| El `<video>` sin anillo de foco | Recibía el azul por defecto de Chrome, invisible sobre el vídeo | `video, audio, iframe, details` añadidos a la lista de `:focus-visible` |
| Fecha legal sin localizar | "Last updated: 29 de mayo de 2026" en inglés | `formatDate` por idioma. El texto legal sigue en español a propósito; su metadato, no |
| Enlaces del acordeón a **16.8px** | Por debajo de los 24px de WCAG 2.5.8, y no son enlaces en línea | `min-h-11` |
| "Cerrar menú" inalcanzable con Tab | 14 pulsaciones daban vueltas por los 7 enlaces del panel | Ver abajo |

**El caso del botón de cerrar merece explicación.** Vive en la barra, o sea **antes del panel en el DOM**, y el orden de tabulación sigue el DOM: al llegar al último enlace, Tab saltaba fuera. Añadirlo al final de la lista no bastaba —el trampeo por extremos solo cierra el ciclo del último al primero—. Se pasó a **recorrido por índice**, moviendo el foco explícitamente en cada paso, para que el orden lógico mande sobre el del documento. Verificado: el ciclo pasa por CERRAR y Escape sigue cerrando.

### BAJA

El anillo de foco **entraba con un fundido de 450ms** partiendo del color del texto: `outline-color` está en la lista de `transition-colors` de Tailwind v4. Un indicador de foco que tarda en llegar no cumple su función, que es decirte dónde estás **ahora**. Corregido con `transition-property: none`.

Y se retiraron del repositorio nueve scripts de verificación que se habían colado en un commit anterior; `/*.mjs` entra al `.gitignore` para que no vuelva a pasar.

### Lo que el barrido confirmó que está bien

**98 combinaciones** sin desbordamiento horizontal · un solo `h1` y cero saltos de nivel en 14 rutas · **CLS = 0** en 14 combinaciones, LCP 44–208ms · ~1400 nodos de texto sin un solo fallo de contraste sobre el compuesto, en los tres idiomas · cero `href="#"` · todos los `target="_blank"` con `rel` y aviso · todas las imágenes con `alt` · reduced-motion sin un solo elemento invisible **incluso con JavaScript desactivado** · menú móvil con foco atrapado, Escape y scroll bloqueado · 404 real con salidas.

---

## Bloque 39 · Los datos reales de la red — 2026-09-02

**El sitio estaba afirmando una red mayor y más potente de la que existe.** Camilo entregó el dataset real: tres estaciones, no cuatro.

| | Antes (publicado) | Real |
|---|---|---|
| Universidad EAN | 10 puntos · 60 kW · CCS1, CCS2, GB-T | **18 puntos · 22–80 kW** · GB/T, CCS1, CCS2 |
| Grand Hyatt | 11 puntos · 60 kW | 11 puntos · **30 kW** · GB/T |
| Wake (Medellín) | — | **6 puntos · 80 kW** · GB/T, CCS2 |
| San Fernando Plaza | 6 puntos · 120 kW | **NO EXISTE** |
| Corredor Norte | 8 puntos · 150 kW | **NO EXISTE** |
| Total de la red | 4 estaciones · 27 puntos · 60–150 kW | **3 estaciones · 35 puntos · 22–80 kW** |

### La potencia pasa a ser un rango

`powerKw: number` → `powerKw: { min, max }`. La EAN tiene cargadores de 22 a 80 kW, y publicar solo el máximo diría que **todos** sus puntos cargan a 80 — exactamente el tipo de promesa que §19 no admite. Cuando todos los puntos son iguales, `min === max` y se muestra una sola cifra: "30–30 kW" no informa, confunde.

El cambio de tipo hizo de guardia: **el compilador señaló los 11 sitios** que pintaban o comparaban potencias, incluidos dos criterios de orden y el agregado de la Home. Ninguno se quedó atrás por descuido.

### Los filtros de potencia se derivan del dataset

Estaban fijos en `[0, 50, 100, 150]`. Con las potencias reales, **100+ y 150+ no devolvían ninguna estación**: dos de los cuatro controles garantizados a dar cero resultados, cuando §16 dice que si algo parece un filtro, filtra.

Ahora se calculan desde los máximos distintos de las estaciones: hoy salen **`Todas · 30+ · 80+`**. Añadir una estación de 150 kW hace aparecer ese escalón sola; retirarla lo quita. Y si todas las estaciones tuvieran la misma potencia, **el grupo entero desaparece** en lugar de quedarse como un control que no reduce nada.

### Lo que arrastraban esas dos estaciones fantasma

- **Dos entradas de novedades** anunciaban sus aperturas. Retiradas: una apertura publicada de una estación inexistente no es un dato desactualizado, es un dato **falso**, y el registro pierde su única función —ser el sitio donde consta lo que de verdad pasó— en cuanto admite una.
- **El intro de Medellín** describía "120 kW dentro de San Fernando Plaza". Ahora describe Wake, sin inventar barrio: la dirección no se ha entregado.
- **El lead de `/red`** decía "de 60 a 150 kW". Se quitó la cifra en lugar de actualizarla: ya se quedó obsoleta una vez, y el dato exacto vive en cada ficha, generado desde el dataset.
- **La novedad de la EAN** hablaba de "diez puntos de 60 kW". Corregida a dieciocho, de 22 a 80.

Las tres estaciones pasan a `dataStatus: "verified"`. La dirección de Wake y las coordenadas de las tres siguen sin entregarse y **no se inventan**.

### Evidencia

`lint`, `tsc` y build limpios · `ES 409/409 · EN 409/409 · PT 409/409` · Home rindiendo **35 puntos · 22–80 kW · GB-T · CCS1 · CCS2** · `/red` con 3 estaciones y chips `Todas · 30+ kW · 80+ kW`.

---

## Bloque 43 · Marca completa y medición conectada — 2026-09-02

### Las tipografías definitivas

**"Marope" era Manrope**, y eso cambia todo para bien: está en Google Fonts y es **variable**, así que un solo archivo cubre el rango entero de pesos.

| Rol | Familia | Por qué |
|---|---|---|
| Titulares | **Poppins** | Es la familia del logotipo: titulares y marca hablan con la misma voz |
| Interfaz y texto | **Manrope** | Variable: un archivo, todos los pesos, menos peso que tres estáticos |
| Ficha técnica | JetBrains Mono | No la define la marca; cubre un tercer registro que las otras dos no dan |

**Se cargan desde Google Fonts, no desde los `.ttf` del sistema.** `next/font` las sirve desde nuestro propio dominio, ya subconjuntadas a latino y en woff2 —una fracción del peso del TrueType— y sin petición a un tercero. De Poppins se piden **solo los pesos que el código usa** (500 y 600, contados) más el 900 del archivo de marca: sin declararlos, el navegador sintetiza el semibold engordando el trazo, y en un titular de 80px eso se ve sucio.

Space Grotesk e Inter salen del proyecto. **No queda ningún marcador de posición tipográfico.**

**Verificado después del cambio**: cambiar de familia cambia la medida de línea, así que se volvió a medir. Manrope da **46–66 caracteres** en escritorio, dentro del rango de §22 sin recalibrar. Y 42 combinaciones de ruta y viewport sin desbordamiento.

De paso, los legales pasaron de `measure-narrow` a `measure`: 48 caracteres en un documento de 38 secciones multiplica el alto y obliga a un scroll interminable.

### `warning` completa la paleta

`#F6B756` — **10.79:1** sobre canvas. Con esto **no queda ni un color provisional**.

### Google Tag Manager

Contenedor `GTM-WJ5S2LBF`, cargado con `afterInteractive`: la medición no compite con el primer pintado.

**No hizo falta cablear nada más.** `lib/analytics` ya empujaba los eventos del plan a `window.dataLayer`, que es exactamente de donde GTM lee — así que los eventos definidos en §31 empiezan a llegar solos. Verificado: la petición a `gtm.js` sale y el `dataLayer` recibe.

El `<noscript>` lleva `title`: aunque el iframe esté oculto, existe, y sin título un lector de pantalla anuncia "marco" sin poder decir de qué.

> **PENDIENTE DE DECISIÓN:** GTM carga GA4, que instala cookies. La Política de Tratamiento de Datos ya declara el uso de cookies, pero **no hay mecanismo de consentimiento** en el sitio. Conviene decidir si hace falta un banner antes de publicar.

### Evidencia

`lint`, `tsc` y build limpios · `ES 412/412 · EN 412/412 · PT 412/412` · titular en Poppins y cuerpo en Manrope verificados en el render · 42 combinaciones sin desbordamiento · medida de línea 46–66.

---

## Bloque 44 · Aviso de cookies y la apertura de Wake — 2026-09-02

Este bloque se ejecutó y se commiteó (`e021195`) pero **nunca llegó a este
registro**: montó el aviso de cookies como interruptor real de Google Tag
Manager —consentimiento previo, Ley 1581— y publicó la apertura de Wake. El
detalle vive en el mensaje de ese commit. Se anota aquí para que la numeración
no mienta: un registro con un número que no existe es peor que uno incompleto,
porque no se nota.

---

## Bloque 45 · El aviso de cookies pasa a franja y el flotante vuelve al recargar — 2026-09-03

**Por qué:** el flotante del QR "había desaparecido" del sitio. No estaba roto —medido página por página, aparecía en la Home, `/red` y `/novedades`, en escritorio y en móvil—: estaba cerrado. La regla que el Bloque 36 celebraba como un arreglo ("se cierra y no vuelve — de verdad", con la decisión en `localStorage`) resultó ser la trampa contraria. Una sola X, a menudo un gesto reflejo para despejar la pantalla, apagaba **para siempre** la conversión primaria del negocio B2C, y sin ninguna forma de recuperarla que no fuera abrir la consola del navegador.

| Cambio | Razón |
|---|---|
| El cierre del flotante deja de persistirse | Vuelve en la siguiente carga. Ver el precio abajo |
| El aviso de cookies pasa de tarjeta en la esquina a franja de ancho completo | La forma con la que un aviso de cookies se reconoce sin leerlo |

### El cierre dura la lectura, no la vida del navegador

Estado en memoria y nada más. El precio hay que decirlo: **a quien lo cerró a propósito se le vuelve a ofrecer al recargar**, que es literalmente lo que la versión anterior de la regla trataba de evitar. Lo que lo compensa es que el cierre sí dura mientras se está leyendo: el componente vive en el layout, que la navegación interna no remonta, así que cerrarlo en la Home lo mantiene oculto al pasar a `/red` o a `/novedades`. **Vuelve con una recarga, no con un clic en el menú** — verificado en el render, no supuesto.

### El aviso de cookies no puede parecer una promoción

Era una tarjeta de vidrio abajo a la derecha: más discreta, pero **indistinguible de las otras dos piezas que viven en esa misma esquina** —el flotante del QR y su versión en barra—. Confundir una pregunta legal con una oferta de descarga es lo único que este aviso no puede hacer, y el parecido era exactamente el que producía la confusión.

Ahora es una franja a sangre anclada abajo, con el material del Header (`bg-canvas/85` + `backdrop-blur-xl`) y no `.glass`. No es preferencia:

- En el sistema, `.glass` **con radio** es el registro de los paneles que flotan. Una franja de borde a borde no flota, y el anillo de `.glass::before` le dibujaría una línea clara pegada a los bordes de la pantalla: se lee como fallo de render, no como contorno.
- Es **más opaco** que el vidrio (85% de `canvas` frente al 68% de `surface-2`). Debajo del texto puede pasar cualquier cosa, y un texto legal ilegible no informa.

El contenido cuelga del **mismo riel que el Header** (contenedor `content` + gutter del sistema): una franja a sangre cuyo texto no arranca donde arranca el del sitio se delata como pieza pegada. El titular baja de `display-s` a `text-body` con negrita — en una franja de una fila, un titular de tamaño display la engorda y grita más que la pregunta que hace.

### La igualdad de las dos salidas, medida en lugar de supuesta

En móvil los botones van en **rejilla de dos columnas, no en `flex-1`**. Con `flex-1` cada botón crece desde su propio ancho de contenido y "Rechazar" se quedaba **2px más grande** que "Aceptar" (165 contra 163, medido). Dos columnas de `1fr` son iguales por construcción. Aquí la igualdad de las dos opciones es un requisito de §38, no una simetría bonita, así que no se deja en "casi".

### Evidencia

`lint`, `tsc` y build limpios · sin copy nuevo (ninguna cadena añadida ni retirada) · franja `fixed` de ancho completo verificada a 1440 / 768 / 390 / 320px (alto 118 / 138 / 223 / 244), radio 0, foco entrando en la región al aparecer, sin desbordamiento de texto en ninguno · botones **164 = 164** a 390px y **130 = 130** a 320px, altura 44 en los cuatro anchos · flotante: visible tras aceptar cookies → oculto al pulsar la X → **sigue oculto** navegando a `/red` sin recargar → **visible tras recargar** · `localStorage` final: solo `voltop:cookies`, la clave `voltop:app-flotante-cerrado` ya no existe en el código.

---

## Bloque 46 · Auditoría integral y limpieza — 2026-09-03

**Por qué:** el proyecto llevaba muchas iteraciones y convenía sanearlo antes de seguir construyendo. La auditoría buscó lo de siempre —archivos sin uso, componentes muertos, duplicados, assets huérfanos, tokens obsoletos, dependencias sin usar, deuda evidente— y el resultado fue el contrario del esperado: **el código estaba limpio**. Los 38 componentes se usan, los 9 assets de `public/` se referencian, las 5 dependencias se importan, no hay archivos duplicados y no queda ni un `TODO`. Las 30 combinaciones de ruta × viewport pasadas por navegador salieron sin desbordes, sin `img` sin `alt`, sin enlaces sin nombre accesible, sin objetivos táctiles menores de 44px y con un `h1` por página.

Lo que sí sobraba estaba en tres sitios: las skills instaladas, cuatro funciones muertas y un sello heredado.

### Lo retirado

| Qué | Por qué |
|---|---|
| `trackClick`, `getCases`, `getPostTypes`, `isReady` | Cero consumidores, verificado símbolo por símbolo. `getPostTypes` alimentaba el filtro de novedades, descartado a conciencia hasta las ~15 entradas |
| `--color-brand-press`, `--duration-instant`, `--duration-slow` | Tres tokens declarados que no usa nadie |
| **Poppins 900** | Se cargaba "por si acaso" y ningún componente la usaba: un archivo de fuente que nadie llegaba a ver. El logotipo no la necesita, es un SVG |
| 4 reglas de `.gitignore` | Protegían másteres que ya viven fuera del repositorio. Una regla que no protege nada hace creer que protege algo |
| **30 de 47 skills** | Detalle abajo |

### El sello de prototipo

`legalNotice: "Prototipo · contenido provisional"` salía en el pie de **todas** las páginas. Se retiró porque ya no era cierto: la marca es la definitiva, los datos de la red están verificados y los legales están publicados. Un sitio que se declara provisional en el pie invita a no creerse el resto.

### `app.voltop.co` ya funciona

Estaba registrado como bloqueante nº 1 con un 503, y el CTA principal del header apuntando a nada. **Hoy responde**: 307 a `/download` y 200 con una página real de descarga. No hay nada que cambiar en el código —el enlace siempre fue correcto—, pero deja de ser un bloqueante.

### Las skills: de 47 a 17

El riesgo no era el disco: **quince skills genéricas de diseño competían con las siete `voltop-*`**, que son el criterio escrito de este proyecto. Una recomendación genérica que contradice el design system propio lo diluye.

Se conservan las 7 `voltop-*`, las de motion de Emil Kowalski (`emil-design-eng`, `animate`, `review-animations`, `improve-animations`, `apple-design`), `accessibility-auditor`, `skill-creator`, y tres opcionales (`humanizer`, `systematic-debugging`, `brainstorming`).

Se retiraron las redundantes (`ui-ux-pro-max`, `impeccable`, `design-taste-frontend`, `design-critique`, `content-copy-designer`, `information-architect`, el `code-review` de terceros que tapaba al nativo) y las que no aportaban aquí (`token-optimizer` —14 MB y lectura de transcripciones—, `caveman`, `napkin`, `context-mode` —espera un hook inexistente—, `gsd`, `feature-dev` y once de las catorce de superpowers).

De paso: `npx eslint .` fallaba con 21 problemas **del código de las skills**, no del proyecto. `.agents/**` se añadió a los ignores, junto a `.claude/**` que ya estaba.

### Lo que NO se tocó, y por qué

La auditoría propuso dos consolidaciones. **Al leer el código, las dos eran errores:**

- **`Media` / `VideoMedia`** no se pueden fundir: `Media` es Server Component y `VideoMedia` es cliente porque necesita leer `prefers-reduced-motion`. Unirlos mandaría al cliente también la fotografía.
- **Los cuatro componentes de novedades son cuatro a propósito.** El registro con separadores de año, la lista compacta de las fichas y el beat de la Home tienen estructuras deliberadamente distintas: §36.11 pide que dos superficies vecinas no repitan estructura.

Lo que sí estaba triplicado era **la regla**, no la forma: los tres sitios repetían el ternario `hasPage(post) ? <Link className="group…"> : <div>`. Tres copias de una regla son tres sitios donde puede divergir. Ahora vive en `PostLink` y cada lista sigue trayendo su propia rejilla.

De camino apareció una clase muerta: el enlace del registro llevaba `block` y `grid` a la vez. Ganaba `grid`; `block` no hacía nada.

### Evidencia

`lint`, `tsc` y build limpios · 50 páginas generadas · el refactor verificado **antes y después en el navegador**: alto, número de enlaces y texto **idénticos** en las tres listas y en el pie · geometría de fila confirmada (`display:grid`, `144px 960px` en el registro; `144px 874px 62px` en la Home) · `app.voltop.co` comprobado con `curl` siguiendo la redirección.

---

## Bloque 47 · El lenguaje de movimiento de Voltop — 2026-09-03

**Por qué:** el sitio tenía UN gesto —`fade + translateY`— repetido en todas partes, con cuatro escalonados distintos (0.05, 0.06, 0.07, 0.08) y tres desplazamientos (12, 14, 20px) repartidos por cuatro archivos. Cuatro valores que nadie distingue no son cuatro decisiones: son la ausencia de una. Y el gesto en sí es el reveal por defecto de cualquier plantilla: se percibe como "la página cargó", no como una intención.

El estudio de Electra —medido en el navegador, 447 mutaciones de estilo durante el scroll— dio la conclusión que ordena todo esto: **su vocabulario son tres técnicas aplicadas sin una sola excepción.** El wow no viene de la variedad, viene de la convicción.

### Las cuatro primitivas

| | Qué hace | Cuándo NO |
|---|---|---|
| **DEPTH** | El contenido llega desde el fondo: escala + opacidad | Nunca sobre cifras ni specs. Lo que prueba algo no se anima |
| **FLOW** | El material se desplaza dentro de un marco que no se mueve | Jamás sobre texto: un titular con parallax se lee como plantilla |
| **FRAME** | El encuadre se abre y descubre lo que ya estaba | Dos veces en toda la Home. Repetido deja de ser un descubrimiento |
| **CONTINUITY** | Algo persiste entre dos estados | Entre vistas sin relación real: fingirla desorienta |

Tres intensidades, no cuatro. Se descartó un nivel `subtle`: las microinteracciones no son una versión pequeña de DEPTH sino **otra familia** —se expresan en color, opacidad y dos o tres píxeles, no en escala—, así que viven en CSS (`.press`) y no en el vocabulario de Motion. Y `signature` no es un valor más alto de nada: es una composición ligada al scroll, y por eso son dos y no ocho.

El escalonado pasa a pedirse **por índice, no por retardo**: las listas dicen su posición y el sistema decide el tiempo. Ninguna puede desviarse sin que se note.

### Hero → Infraestructura: el corte

Medido a 1440×900: entre el final del hero y el borde del material había una **banda muerta de 143px**, y el vídeo se leía como un rectángulo pegado —cuatro bordes duros flotando en el vacío—. El recorte era simétrico, `inset(18%)` por los cuatro lados.

Ahora el borde superior vale **siempre 0**: el material toca el final del hero desde el primer fotograma y se abre por los lados y por abajo. Un puente de fondo lo cose. **No se intentó fingir que las dos piezas son una**: el hero es una fotografía y esto un vídeo, y la continuidad la da la composición, no el material.

### Red y película

La **red** pasa a EXPRESSIVE: las ciudades entran escalonadas con escala y la fotografía de fondo hace FLOW dentro de su marco —verificado, `translateY` de −1.9% a 5% a lo largo de la sección—. Las cifras y las specs no se mueven: son la prueba.

La **película** es el segundo signature. FRAME al entrar y, al pulsar play, la página se atenúa y la pieza crece un 4.5%. Es el único sitio donde una expansión es **funcional además de expresiva**: se ve mejor. No es un modal —no atrapa foco, no bloquea scroll— porque el vídeo ya se pausa con sus propios controles.

### El beat del conductor

El público mayoritario llega preguntando "¿cómo cargo?" y esa pregunta tenía **una frase** en todo el sitio, escondida bajo un rótulo que decía "La app". Rotular por el producto en vez de por la tarea deja el beat invisible justo para quien lo necesita.

Ahora son cuatro pasos en orden —encuentra, escanea, carga, listo— más una salida a `/red`. Todo sale de los Términos y Condiciones (§4) y del copy que ya existía en la ficha de estación. **No se nombra el método de pago porque no está confirmado en ninguna parte**: el paso 4 dice dónde queda el cobro, no cómo se paga.

### BLOQUEANTE encontrado y corregido: once bloques invisibles

`whileInView` se apoya en `IntersectionObserver`, que solo informa de lo que intersecta AHORA. Recargando la Home a 5400px —el navegador restaura el scroll— quedaban **once bloques a opacidad 0 para siempre**: el índice de ciudades, los cuatro segmentos de empresas y las tres novedades. Seguían invisibles al volver a subir.

No era un fallo nuevo: el mecanismo venía de antes. Pero es contenido que desaparece, que es exactamente lo que §21 prohíbe, y se detectó porque la validación probó el escenario real —recargar a media página— y no solo el scroll de arriba abajo. `useScrolledPast` lo cubre: lo que ya quedó por encima se renderiza sin animación. De once a cero.

### Evidencia

`lint`, `tsc` y build limpios · 50 páginas · **27 combinaciones de ruta × viewport sin un solo problema**: cero invisibles, cero desbordes, un `h1` por página, cero `img` sin `alt`, cero errores de JS · `prefers-reduced-motion`: 0 invisibles, 0 `clip-path`, 0 `transform`, sección signature colapsada a 557px · **60 fps sostenidos y cero fotogramas largos** en escritorio, en móvil con CPU ×4 y en móvil con CPU ×6 · FLOW y la expansión de la película verificados por sus valores reales en el DOM.

---

## Bloque 48 · El cuarto paso es pagar — 2026-09-03

Producto confirmó lo que faltaba: el pago se hace desde la app con el método
que el usuario tenga registrado. El paso 4 pasa de "Listo" a **"Paga"** y lo
dice en una línea.

Deliberadamente **no** se explica la mecánica —medio guardado, pasarela,
preautorización, cuándo se cobra—. Quien lee ese bloque está decidiendo si
cargar es fácil, no auditando el flujo de cobro: cada frase de más convierte
una respuesta tranquilizadora en un contrato que hay que leer.

La tarifa sigue sin cifra. Lo único confirmado es que se ve en la app antes de
iniciar la carga, que es lo que ya dice el paso 3.

**Evidencia:** `lint`, `tsc` y build limpios · los cuatro pasos verificados a
1440, 768, 390 y 320px sin desbordes de texto ni de página · 27 combinaciones
de ruta × viewport sin problemas · `prefers-reduced-motion` intacto.

---

## Bloque 49 · El flotante de la app: se queda, se reconoce y se lee — 2026-09-04

Tres peticiones sobre el mismo componente y una consecuencia que hubo que resolver.

### Aparece tras la primera sección y no vuelve a esconderse

Antes el umbral era "el 90% de la altura del viewport" —una aproximación a la primera sección, no la primera sección— y **desaparecía en tres zonas del recorrido**. Un elemento que se va y vuelve tres veces mientras bajas se percibe como un fallo, no como delicadeza.

Ahora se observa la primera sección real de cada página: mientras esté a la vista no existe; en cuanto sale, aparece y se queda hasta que se vuelve a ella. Funciona igual en las seis plantillas sin un número por página, y se reobserva al cambiar de ruta —el componente vive en el layout y la navegación de cliente no lo remonta—.

### Las dos colisiones que las zonas mudas tapaban, resueltas donde tocaba

Esas zonas existían por dos fallos reales, no por gusto. Se arreglan en su sitio:

- **Los controles de la película.** La tarjeta se solapa con la barra de reproducción, y un clic en pantalla completa **abría la tienda de apps**. Ahora `FilmStage` se eleva por encima del flotante mientras el puntero está sobre la pieza o mientras se reproduce. Verificado: sin puntero, ese punto pertenece al flotante; con el puntero encima, al `<video>`.
- **El CTA del beat 2.** Ancla su contenido al fondo de un panel fijado a pantalla completa, así que no había ninguna posición de scroll que liberara la barra. Ahora el beat reserva el hueco por debajo de `lg`. Verificado: el clic llega al CTA a 320, 390 y 768px.

### Copy nuevo e icono de la app

"Descarga la app Voltop" · "Encuentra estaciones e inicia tu carga desde la app." El icono responde una pregunta que el texto no puede: **cuál** app. Va en la fila superior, ocupando el lado que el botón de cerrar dejaba vacío, así que no añade ni una fila ni un píxel de alto. No compite con el CTA porque no es interactivo, y su gradiente es el del propio archivo de marca, no un segundo gradiente en la vista.

El origen pesa 657 KB y **llega al navegador como 1 KB en AVIF a 64px**, comprobado en red.

### La transparencia: el problema no era el contraste

Medido sobre el píxel compuesto a percentil 99, el texto secundario daba **7.79:1 en escritorio y 8.45:1 en móvil** — muy por encima del 4.5:1 de AA. El contraste no era el problema: era que **el texto de detrás seguía siendo legible a través del vidrio**, y dos textos legibles en el mismo sitio compiten aunque los dos tengan contraste.

Por eso el arreglo no toca la luminancia sino la opacidad: `.glass-strong` sube el fondo del 68% al 92% (verificado en el color computado, alfa 0.68 → 0.92) sin renunciar al desenfoque, que es lo que lo mantiene dentro del sistema.

### La barra móvil pasa a dos filas por debajo de 480px

Con el icono dentro, en una sola fila compiten icono, dos líneas, botón y cerrar. Medido: **a 390px al texto le quedan 158px y la segunda línea necesita 227; a 320px le quedan 88 y hasta el título se corta.** No es un problema de copy —acortarlo hasta caber en 88px lo dejaría sin mensaje— sino de estructura.

Por debajo de `xs` el botón se lleva su propia fila a ancho completo: el texto pasa a 234px, cabe entero, y el CTA gana un objetivo táctil mayor, que en un teléfono es mejor y no peor. Un solo `<a>` reordenado con `order`, no dos ocultándose: duplicarlo duplicaría el emisor del evento de medición.

A 320px la segunda línea envuelve en lugar de cortarse (`line-clamp-2`): conserva el mensaje y solo cuesta alto en el ancho más estrecho.

### CONSECUENCIA CORREGIDA: los enlaces legales del pie

El pie ya reservaba 5.5rem para la barra de una fila. Con la barra a dos filas —126px a 390 y 145px a 320— **los enlaces legales acababan a 707px y la barra empezaba a 706: quedaban a un píxel**, y cualquier idioma más largo los metía debajo. Al llegar al fondo del documento no queda scroll para apartarla, así que habrían sido inalcanzables. Ahora son 11rem, que cubre el peor caso con 87px de margen.

### Evidencia

`lint`, `tsc` y build limpios · comportamiento verificado en `/es` y `/es/red` en escritorio y en `/es`, `/es/novedades` en móvil y a 320px: oculto al cargar, aparece tras la primera sección, **nunca se esconde a mitad**, oculto de vuelta arriba · sin texto cortado en ningún ancho · icono presente en las dos piezas · 27 combinaciones de ruta × viewport sin problemas · `prefers-reduced-motion` intacto.
