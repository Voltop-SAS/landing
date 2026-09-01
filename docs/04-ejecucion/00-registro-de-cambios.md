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
