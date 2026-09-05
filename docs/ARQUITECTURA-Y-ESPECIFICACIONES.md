# Arquitectura y especificaciones

Estado a **2026-09-04**. Documento de preservación: describe lo que el proyecto
ES, no lo que podría ser. Las reglas normativas numeradas (§) viven en
`MASTER-PROJECT-DEFINITION.md`; aquí se recoge la implementación.

---

## 1 · Rutas

50 páginas estáticas, tres idiomas. Todo cuelga de `app/[lang]/`.

| Ruta | Genera | Notas |
|---|---|---|
| `/[lang]` | Home, 9 beats | La secuencia narrativa del sitio |
| `/[lang]/red` | Índice de la red | Buscador con filtros sincronizados a la URL |
| `/[lang]/red/[ciudad]` | Bogotá · Medellín | Se genera desde la colección de ciudades |
| `/[lang]/red/estacion/[slug]` | 3 estaciones | Se genera desde la colección de estaciones |
| `/[lang]/empresas` | B2B | Selector de segmento + formulario |
| `/[lang]/novedades` | Registro | Bitácora cronológica |
| `/[lang]/novedades/[slug]` | Entradas con cuerpo | Solo las que tienen `body` |
| `/[lang]/nosotros` | Compañía | |
| `/[lang]/legal/terminos` · `/legal/privacidad` | Legales | |
| `/robots.txt` · `/sitemap.xml` | | Generados |
| `/[lang]/opengraph-image` | Imagen OG por idioma | Generada desde los tokens |

`/` redirige a `/es` con **307 temporal**. Al publicar hay que pasarlo a
`permanent: true` en `next.config.ts`.

Añadir una estación o una ciudad **no requiere tocar código**: se añade el
registro en `content/data/` y la ruta, el sitemap y los agregados de la Home se
generan solos.

## 2 · Los 9 beats de la Home

La Home es una secuencia con una curva de intensidad deliberada. **Dos beats
consecutivos nunca comparten estructura** (§12): el ritmo se construye variando
ancho de contenedor, número de columnas, densidad y relación texto/imagen — no
añadiendo efectos.

| # | Beat | Estructura | Intensidad |
|---|---|---|---|
| 1 | Hero | Full-bleed, contenido anclado abajo | Anticipación · quieto a propósito |
| 2 | Infraestructura | Panel **fijado** de 170vh con apertura de encuadre ligada al scroll | **SIGNATURE** |
| 3 | Nuestra red | Dos columnas 65/35: contenido y render del cargador | Expressive |
| 4 | Empresas | Columna estrecha **centrada** (excepción declarada) | Respiración |
| 5 | Caso real | Full-bleed con la cita encima del material | Expressive |
| 6 | Novedades | Registro cronológico de tres filas | Calma — el punto más bajo |
| 7 | Visión | Dos columnas: retrato del fundador y su cita | Media-alta |
| 8 | Cómo cargar | Cuatro pasos + QR | Standard |
| 9 | Cierre | Dos audiencias, asimétrico | Resolución |

**Aviso:** la Home tiene **un** momento signature (el beat 2). Tenía dos hasta
que la película salió del beat 7 el 2026-09-04. Si la segunda mitad se percibe
plana, ese es el motivo y está en el registro de cambios (bloque 58).

## 3 · Sistema visual

Dark-first, sin modo claro. **77 tokens** en `app/globals.css` bajo `@theme`.

### Color

| Token | Valor | Contraste sobre `canvas` |
|---|---|---|
| `--color-canvas` | `#0a0f1a` | fondo primario de marca |
| `--color-surface-1/2/3` | | `surface-2` = `#111827` es de marca; 1 y 3 se interpolan |
| `--color-ink` | `#e6e9ee` | **15.74:1** |
| `--color-ink-2` | `#a3b2c3` | **8.86:1** |
| `--color-ink-3` | `#8b95a8` | ≥ 4.9:1 sobre las cuatro superficies |
| `--color-brand` | `#51d9b2` | **10.87:1** |
| `--color-brand-2` | `#0fc7e1` | **9.38:1** |
| `--color-live` | `#38d398` | 9.98:1 |
| `--color-line` | `rgba(255,255,255,.09)` | hairline estructural |
| `--color-line-control` | `rgba(255,255,255,.36)` | borde de control — WCAG 1.4.11 pide ≥3:1 |

**El gradiente de marca es señal, no textura**: una acción con gradiente por
vista (§12). Prohibido en puntos decorativos, bullets, comillas y bordes.

### Tipografía

Poppins (titulares, pesos 500 y 600) + Manrope (interfaz, variable) +
JetBrains Mono (ficha técnica). Se sirven con `next/font` desde el propio
dominio, subconjuntadas a latino.

Escala fluida con `clamp()` — valores a 1440px:

| Token | A 1440px | Uso |
|---|---|---|
| `display-2xl` | 80px | Solo el titular del Hero |
| `display-xl` | 72px | Titular del beat 2 |
| `display-l` | 52px | Titulares de sección · la cita del beat 5 |
| `display-m` | 36px | Titular del beat 3 · la cita del beat 7 |
| `display-s` | 24px | Subtítulos, nombres de ciudad, valores de métrica |
| `body-l` · `body` · `body-s` · `caption` | 20 · 16 · 15 · 13px | |
| `mono` | 12px | Etiquetas, datos, antetítulos |

**Medida de línea:** `.measure` = 48ch y `.measure-narrow` = 36ch. Los valores
NO son el número de caracteres: la unidad `ch` mide el glifo "0", más ancho que
el carácter medio. Calibrado sobre el render en Manrope: **46–66 caracteres
reales**, dentro del rango 45–75 de §22. **Si se cambia la tipografía, hay que
volver a medirlo**: la proporción es propiedad de la fuente.

**Antetítulos:** en la Home van en `brand`; en las páginas internas en `muted`.
Es una regla, no un defecto — está escrita en `SectionHeading`.

### Espaciado y retícula

- **Gutter:** `clamp(1.5rem, 1rem + 2.222vw, 3.5rem)` → 24px a 320px, 56px desde 1130px.
- **Contenedores:** `content` 1240px · `narrow` 780px · `wide` 1600px.
- **UN SOLO RIEL.** Todos los anchos se alinean al borde izquierdo de `content`.
  `narrow` cuelga del mismo riel con medida más corta. `wide` es el único que lo
  rompe, y lo hace **simétricamente**: es un sangrado deliberado reservado a
  media. Un bloque de texto en `wide` es un bug, no una decisión.
- **Espaciado entre secciones:** cada sección aporta la MITAD de la distancia
  declarada, así que el hueco entre dos ES el token y no su suma.
  `tight` 48–88px · `base` 72–144px · `loose` 96–200px.

### Superficies

- **`.glass`** — `surface-2` al 68% + `blur(32px) saturate(190%) brightness(0.32)`.
  El `brightness` es lo que lo hace legible: sin atenuar el fondo, un titular
  claro se lee A TRAVÉS del panel. **`.glass` no declara `position`** — tiene la
  misma especificidad que `.fixed` de Tailwind y declararla rompía el anclaje de
  los elementos fijos. Quien la use sin `fixed`/`absolute` añade `relative`.
- **`.glass-strong`** — el mismo vidrio al 92%, para paneles que flotan SOBRE
  TEXTO. Lo usa el flotante de la app. El problema que resuelve no era de
  contraste (medía 7.8:1) sino de que el texto de detrás seguía siendo legible.
- **Barras a sangre** (header, aviso de cookies) NO usan `.glass`: usan
  `bg-canvas/85 + backdrop-blur-xl`. `.glass` con radio es el registro de lo que
  flota; una franja de borde a borde no flota.

## 4 · Responsive

### Breakpoints

| Nombre | Valor | Origen |
|---|---|---|
| `xs` | 480px | Declarado. **Solo** lo usa la barra móvil del flotante |
| `sm` | 640px | Tailwind |
| `md` | 768px | Tailwind |
| `nav` | 832px (52rem) | Declarado. Ancho al que el header completo cabe sin apretarse |
| `lg` | 1024px | Tailwind |
| `xl` | 1280px | Tailwind — apenas se usa |

**Estrategia: mobile-first con escala fluida.** La mayor parte de la adaptación
NO la hacen los breakpoints sino los 12 `clamp()` del sistema: tipografía,
gutter, espaciado entre secciones y el radio de firma escalan de forma continua.
Los breakpoints se reservan para cambios de ESTRUCTURA.

### Comportamiento por componente

Lo que cambia entre viewports, y **por qué**. Esto es lo que no se debe
reinterpretar como error:

| Componente | Cambio | Motivo medido |
|---|---|---|
| **Header** | Menú completo desde `nav` (832px); hamburguesa por debajo | En la franja 768–820px el reparto dejaba 4px de holgura y el flex comprimía el enlace del logo |
| **Hero** | Velo de legibilidad **vertical** en móvil, **lateral + vertical + banda superior** en escritorio | La forma del velo sigue a la del texto. En móvil un velo lateral oscurece el lado donde está el cargador —el sujeto— y deja claro el derecho, donde también hay texto |
| **Hero · foto** | `object-position: 62% 50%` | `object-cover` recorta por el eje que sobra, y ese eje cambia: en escritorio conserva el ancho y recorta arriba/abajo (el valor horizontal no interviene); en móvil conserva el alto y recorta a los lados, donde el 62% es lo que deja el cargador con marca en cuadro |
| **Beat 2** | Panel fijado de 170vh; con `prefers-reduced-motion` **colapsa a altura normal** | Sin colapsar, quien pide menos movimiento recibía 2160px de scroll muerto sin el efecto que los justificaba |
| **Beat 2 · contenido** | `pb-28` por debajo de `lg` | Ancla su contenido al fondo de un panel fijado: la barra móvil del flotante le caía encima al CTA y **no había ninguna posición de scroll que lo liberara** |
| **Beat 3** | Dos columnas 65/35 desde `lg`; apiladas por debajo | El 35% está calculado para que el render, servido en `contain`, llene su columna exacta sin dejar sobrante |
| **Beat 3 · tarjetas** | Dos columnas desde `sm`; apiladas por debajo | A 390px en dos columnas cada tarjeta queda en 164px: el contador parte en dos líneas y el botón circular se come un tercio del ancho |
| **Beat 3 · métricas** | Fila desde `sm`; apiladas por debajo. Los **valores nunca se parten** | "22–80 / kW" y "GB/T · CCS1 · / CCS2" son las dos formas de que un dato deje de leerse como dato. La etiqueta sí puede caer a dos líneas |
| **Beat 3 · render** | Visible desde `lg`; por debajo pasa **debajo** del contenido con altura propia | `Media fill` necesita un padre con medida; en absoluto taparía la sección |
| **Beat 7 · retrato** | 2/3 a media columna desde `lg`; `max-w-sm` centrado por debajo | Sin tope, a 768px la columna única lo convertía en **1053px de alto** y la sección crecía a 2060 |
| **Flotante de la app** | Tarjeta con QR desde `lg`; barra baja por debajo. La barra pasa a **dos filas** por debajo de `xs` | El QR es absurdo en móvil —un teléfono no se escanea a sí mismo—. Y en una fila, a 390px al texto le quedan 158px cuando necesita 227; a 320px, 88px |
| **Flotante · safe area** | `pb-[env(safe-area-inset-bottom)]` | Sin ella, en un iPhone la barra queda bajo el indicador de inicio |
| **Footer** | `pb` extra de 11rem por debajo de `lg` | Al llegar al fondo no queda scroll para apartar la barra flotante. Con el valor anterior los enlaces legales quedaban **a un píxel** de ella |
| **Aviso de cookies** | Franja a ancho completo; botones a **mitades exactas** por debajo de `sm` | Con `flex-1` "Rechazar" quedaba 2px más ancho que "Aceptar" (165 vs 163). La igualdad de las dos salidas es un requisito de §38, no una simetría |
| **Vídeo de fondo** | `<source media="(max-width: 767px)">` con una variante ligera | El orden importa: el navegador se queda con la PRIMERA fuente cuyo `media` case |

### Validación ejecutada

**5 rutas × 22 anchos = 110 combinaciones**, de 320 a 1920px:
**cero desbordes horizontales y cero texto cortado.** Los únicos elementos que
un detector marca como recortados son los `.sr-only`, clipados por diseño.

Anchos barridos: 320, 360, 390, 414, 430, 480, 540, 600, 640, 700, 768, 820,
900, 1024, 1100, 1200, 1280, 1366, 1440, 1600, 1680, 1920.

## 5 · Media

Todo asset se registra en **`content/data/media.ts`** con su función narrativa,
nunca como ruta suelta en un componente. Un hueco declara qué falta y para qué,
de modo que la composición se puede evaluar sin el material.

- **`Media`** decide la rama: fotografía (Server Component puro), vídeo
  (`VideoMedia`, cliente, porque necesita leer `prefers-reduced-motion`) o hueco
  declarado. **`Media` y `VideoMedia` no se pueden fundir nunca**: unirlos
  mandaría al cliente también la fotografía.
- **`fit="contain"`** para objetos aislados (el render del cargador). Con
  `contain` no se pinta el fondo de carga: con un PNG transparente ese relleno
  se convierte en una caja visible. Y `object-position` **sí** actúa con
  `contain`, sobre el eje que sobra.
- **Aspectos disponibles:** `16/9`, `4/3`, `3/2`, `2/3`, `1/1`, `21/9`, `9/16`.
- **Los másteres viven fuera del repositorio**, en `~/Voltop-masters-originales/`
  en la máquina de origen. Lo que se versiona son las derivadas optimizadas.
  Las fotografías van en JPEG; PNG solo cuando hace falta transparencia.

## 6 · Accesibilidad

Objetivo **WCAG 2.1 AA**. Lo implementado:

- **Foco visible global**, nunca eliminado: `:focus-visible` con outline de 2px
  y offset 2px sobre todos los interactivos. Sin transición en `outline-color`
  a propósito.
- **Skip link** al contenido principal.
- **Objetivos táctiles ≥44px** — verificado: cero elementos interactivos por
  debajo en todas las rutas y viewports.
- **Un solo `h1` por página**, verificado en las 27 combinaciones.
- **`alt` en todas las imágenes**; vacío + `aria-hidden` en las decorativas.
- **`prefers-reduced-motion`**: red de seguridad en CSS sobre `[data-reveal]`
  que anula `opacity`, `transform` y `clip-path` **sin depender del JS**, más
  una regla equivalente para `scripting: none`. Verificado: **cero elementos
  invisibles** en ambos modos, y la sección signature colapsa a altura normal.
- **Contraste medido sobre el píxel compuesto a percentil 99**, no sobre el
  token: bajo fondo irregular el promedio esconde el punto donde el trazo de una
  letra desaparece. El texto de las tarjetas de ciudad sobre fotografía da
  8.4–11:1 (peor píxel 4.99:1).
- **Formulario B2B**: errores accionables asociados por `aria-describedby`,
  resumen anunciado, foco al primer campo inválido y estado de éxito con
  `role="status"` y foco movido.
- **Overlays**: el aviso de cookies y el flotante **no son diálogos modales** a
  propósito — no atrapan foco ni bloquean scroll, porque hay que poder leer la
  política antes de decidir. Sí son `region` anunciada.
- **Único incumplimiento AA vivo:** la película de marca no tiene subtítulos.
  Está registrado como pendiente de entrega.

## 7 · SEO

- `title` y `description` por página e idioma, desde `content/copy`.
- **`canonical` + `hreflang`** vía `alternatesFor()`. Solo se anuncian **idiomas
  publicados**: un `hreflang` es una invitación a indexar, y anunciar un idioma
  en borrador lo mete en resultados mientras está a medias. Incluye `x-default`.
- `sitemap.xml` y `robots.txt` generados. El sitemap **ejecuta la auditoría de
  traducciones en cada build** (ver §8) y falla si un idioma publicado está
  incompleto.
- **JSON-LD**: `Organization` en la Home y en `/nosotros`, con NIT, razón social
  y dirección reales.
- Imagen Open Graph por idioma, generada desde los tokens de marca.
- Encabezados semánticos y `alt` descriptivo, escritos pensando en la búsqueda
  real del usuario, que para estaciones y ciudades es geográfica y concreta.
- **`NEXT_PUBLIC_SITE_URL` es lo único que hay que configurar** en un despliegue
  que no sea producción. Ver el README.

## 8 · Internacionalización

- **Tres idiomas:** `es` (principal), `en`, `pt`. El idioma vive en la URL.
- Todo el texto es `Localized = { es, en, pt }` en `content/copy/*`. **Se escribe
  primero en español**; lo que no se traduce (nombres propios, unidades) se
  modela como string plano.
- **`lib/i18n/audit.ts` recorre todo el contenido en cada build** y falla si un
  idioma publicado tiene huecos. No es un test opcional: se ejecuta desde
  `app/sitemap.ts`, así que **no se puede compilar con traducciones incompletas**.
- **El texto legal NO es `Localized`**: es español plano a propósito. Traducir un
  instrumento jurídico lo convierte en otro instrumento. Inglés y portugués
  muestran el original con un aviso.
- Añadir un idioma = añadir una entrada a `locales` y otra a `localeMeta`.

## 9 · Performance

- **Presupuesto**: el elemento LCP (la foto del hero) se sirve a `quality={70}`
  porque a la calidad por defecto pesaba 332 KB en pantallas Retina, por encima
  del presupuesto de 250 KB de §29, con el LCP a 2.44s contra un límite de 2.5s.
  Bajar el máster no servía: manda el codificador AVIF, no el origen.
- `next/image` sirve AVIF/WebP. Ejemplos medidos: el icono de la app llega como
  **1 KB**, los retratos 25–43 KB, las fotos de estación 15–98 KB.
- `next/font` sirve las tipografías desde el propio dominio, ya subconjuntadas.
- Los vídeos van con `preload="none"`: solo viaja el póster hasta que alguien
  pide la pieza.
- **60 fps sostenidos y cero fotogramas largos** durante el scroll, medidos en
  escritorio y en móvil con la CPU frenada ×4 y ×6.
- **`voltop-film.mp4` pesa 28 MB y está versionado.** Funciona; compensa moverlo
  a almacenamiento externo cuando crezca el catálogo de vídeo.
