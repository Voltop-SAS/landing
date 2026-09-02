# Entregables pendientes · especificación técnica

> Reescrito el 2026-08-31, después de la auditoría y de las fases 0–3.
> La versión anterior era de antes de implementar: pedía cosas que ya no existen
> (el "visual de energía del hero" se eliminó, los placeholders `XX` también) y
> no llevaba una sola especificación técnica.
>
> Este documento es **el brief que se pasa al proveedor**. Cada fila dice qué
> archivo, con qué medidas y con qué presupuesto de peso. Las medidas no son
> preferencias: están calculadas sobre los contenedores reales del sitio.

---

## Cómo se calcularon las medidas

| Contexto en el sitio | Ancho CSS máximo | Master a entregar |
|---|---|---|
| A sangre (`sizes="100vw"`) | viewport completo | **2560 px** de ancho |
| Franja ancha (`--container-wide` 1600 − 2×56 de gutter) | 1488 px | **2560 px** de ancho |
| Ancho de contenido (`--container-content` 1240 − 2×56) | 1128 px | **2400 px** de ancho |

`next.config.ts` genera AVIF y WebP en ocho tamaños automáticamente, y **nunca
escala hacia arriba**: el master marca el techo de calidad. Entregar el master
sin comprimir (o JPEG calidad 95, o TIFF). La compresión la hace el pipeline.

Los presupuestos de peso de más abajo son del **archivo que sirve el sitio**, no
del master. Existen porque §29 fija Lighthouse ≥ 90 y LCP < 2,5 s, y eso se mide.

---

## 1 · Decisiones que hay que tomar antes de producir

Cinco preguntas. Sin respuesta, el material puede llegar y no encajar.

### D1 · El hero necesita su propio encuadre (o dos encuadres)

`infraestructuraAmplia` se usa hoy en dos sitios con recortes **incompatibles**:

- **Hero de la Home:** a sangre, `min-h-[88dvh]`, `object-cover`.
- **Franja de /nosotros:** 21/9.

El problema es el hero en móvil. A 390 × 844 px el hueco pide una proporción de
**0,52:1 — vertical**. Recortar eso de un master 21/9 (2,33:1) deja **el 22 % del
ancho**: se pierden cuatro quintas partes de la foto. A 1440 × 900 conserva el
78 %. Ninguna foto sobrevive bien a ese rango.

**Recomendación:** partir en dos assets.
- `heroInfraestructura` — master **3/2**, compuesto con el sujeto centrado y una
  zona segura vertical generosa, para que aguante el recorte vertical.
- `infraestructuraAmplia` — master **21/9**, para la franja de /nosotros.

### D2 · Los videos de fondo necesitan un bucle corto, no el corte completo

Los tres videos se renderizan con `autoPlay muted loop playsInline` a sangre. Las
duraciones registradas son **1:20 y 2:05**. Eso está mal por dos motivos: el peso
en la primera carga, y que un clip de dos minutos que salta al fotograma 0 se ve
como un corte, no como un bucle.

**Recomendación:** entregar dos versiones de cada uno.
- **Bucle de fondo:** 8–14 s, **con el primer y el último fotograma compatibles**
  para que el salto no se note. Es lo que consume el sitio hoy.
- **Corte completo:** se conserva para cuando exista un reproductor con
  controles. Ese componente **no existe todavía** — no hay dónde ponerlo.

### D3 · ¿Fotografía por estación o una foto genérica?

El modelo de datos tiene `station.media.photos[]` y `station.media.video` por
estación… y **ningún componente los lee**. La ficha muestra hoy un único hueco
genérico.

Además hay un fallo latente: la ficha usa `MediaPending` directamente en lugar de
`Media`, así que **aunque llegue el archivo seguiría mostrando el placeholder
para siempre**. Hay que corregirlo, y la corrección depende de esta decisión.

- **Opción A · por estación** (lo que el modelo pide y lo que el SEO local
  necesita): 1–3 fotos por estación. Con cuatro estaciones son 4–12 archivos, y
  crece con la red.
- **Opción B · una genérica** de detalle de carga, repetida en las cuatro fichas.
  Más barato hoy, pero cuatro fichas con la misma foto se leen como plantilla y
  el activo de búsqueda local pierde valor.

### D4 · ¿La tarifa es pública, y por estación o por red?

El modelo es por estación (`pricing: { perKwh, currency }`). Hoy las cuatro dicen
"pendiente de confirmación comercial". Es la decisión abierta O5.

### D5 · ¿El wordmark es texto o es lettering?

El header pinta hoy la palabra "Voltop" como **texto vivo** en la tipografía
display. Si la marca tiene lettering propio, hace falta el SVG y el header cambia.

---

## 2 · Marca · bloquea todo lo demás (O1)

Es la entrega de mayor impacto: mientras no llegue, el sitio no tiene marca.
Hoy usa Space Grotesk + Inter + JetBrains Mono, que es el trío por defecto de
cualquier producto técnico. El test del anonimato de §12 falla por definición.

| Entregable | Formato | Especificación | Peso servido |
|---|---|---|---|
| Isotipo | **SVG** optimizado, sin `<image>` ni fuentes embebidas | Se usa a 32×32 px en header y footer, y a 44×44 en la imagen Open Graph. Debe leerse a 24 px. Un solo trazo/relleno en `currentColor` para poder ir dentro de la pastilla de gradiente | ≤ 4 KB |
| Wordmark (si es lettering) | **SVG** con trazos convertidos a contornos | Ver D5 | ≤ 8 KB |
| Versión monocroma | SVG | Para fondos de marca y para el chip de gradiente | ≤ 4 KB |
| Favicon | **SVG** + ICO 32×32 | Hoy hay el favicon por defecto de Next (25,9 KB) | ≤ 15 KB |
| Apple touch icon | PNG **180×180** | Fondo opaco, sin transparencia | ≤ 12 KB |
| Icono maskable | PNG **512×512** | Zona segura del 80 % centrada | ≤ 30 KB |

### Tipografías

El sitio usa **solo dos pesos** en todo el código: 600 (`font-semibold`, 28 usos)
y 500 (`font-medium`, 7 usos), más el 400 del cuerpo. No hay que licenciar la
familia completa.

| Familia | Pesos necesarios | Formato | Peso servido |
|---|---|---|---|
| Display (titulares) | **500 + 600** | `woff2`, subconjunto **latin + latin-ext** | ≤ 50 KB total |
| Sans (cuerpo e interfaz) | **400 + 500** | `woff2`, mismo subconjunto | ≤ 50 KB total |
| Mono (datos, antetítulos, estados) | **400** | `woff2` | ≤ 25 KB |

**Latin-ext es obligatorio:** el copy lleva `á é í ó ú ñ ¿ ¡` y nombres como
Medellín y Bogotá. Una fuente sin ese rango los pinta con sustitución y se nota.

Si hay variable font, mejor: una sola por familia cubre el rango y baja el peso.
**Presupuesto total de tipografía: ≤ 120 KB.**

Falta también: **hex exactos confirmados**. Los actuales se extrajeron de un PNG:
`#0A0F1C` de fondo y el gradiente `#45E0A8 → #28C6E6`. Si cambian, cambia el
contraste y hay que volver a verificar los umbrales de §23 — los tonos de texto
están calculados sobre esos valores.

---

## 3 · Fotografía

| Asset | Proporción | Master | Dónde vive | Peso servido |
|---|---|---|---|---|
| `heroInfraestructura` **(nuevo, ver D1)** | **3/2** con zona segura vertical | 2560 × 1707 | Hero de la Home, a sangre. **Es el elemento LCP** | **≤ 250 KB** |
| `infraestructuraAmplia` | **21/9** | 2560 × 1097 | Franja de /nosotros | ≤ 180 KB |
| `espacioComercial` | **21/9** (hoy declarada 4/3 y renderizada 21/9 — entregar 21/9, o 3/2 con zona segura) | 2560 × 1097 | Apertura de /empresas | ≤ 180 KB |
| `detalleCarga` o fotos por estación **(ver D3)** | **3/2** | 2400 × 1600 | Ficha de estación | ≤ 120 KB cada una |
| Fundador / equipo | **3/2** o **4/5** | 2400 px lado largo | /nosotros, bloque de liderazgo | ≤ 120 KB |

**Requisitos comunes:**
- **Espacio de color sRGB.** AdobeRGB se desatura en navegador.
- **Sin texto quemado en la imagen.** No se puede traducir ni leer por asistencia.
- **Registro tonal oscuro.** El sitio es dark-first y las capas de legibilidad
  están calibradas sobre fondo plano. Una foto muy clara en las zonas donde va el
  texto **romperá el contraste**: en el hero el titular ocupa el tercio inferior
  izquierdo, y en `/es` beat 5 la cita ocupa el centro. Esas zonas deben quedar
  oscuras o uniformes.
- **Descripción de una línea por foto**, en español, para el texto alternativo.
  Hoy están redactadas como placeholder y habrá que revisarlas contra la foto real.
- **Permisos de las personas identificables** que aparezcan.

> **Aviso de verificación:** las capas de legibilidad (`scrim`) están calibradas
> contra `surface-1` plano, no contra fotografía. En cuanto entre la primera
> imagen hay que volver a medir el contraste de todo el texto sobre media.
> `ProofCase` es el caso más expuesto: la cita va encima del video a `canvas/78`.

---

## 4 · Video

| Asset | Proporción | Resolución | Duración del bucle | Peso servido |
|---|---|---|---|---|
| `estacionMedellin` · signature moment | **21/9** | **2560 × 1097** | 8–14 s, bucle limpio | **≤ 2,0 MB** |
| `aperturaEan` · caso EAN | **16/9** | **1920 × 1080** | 8–14 s, bucle limpio | ≤ 1,5 MB |
| `visionCeo` · fundador | **16/9** | **1920 × 1080** | 8–14 s, bucle limpio | ≤ 1,5 MB |

**Formato:** MP4 / **H.264 High profile**, `yuv420p`, `faststart`.
El componente `Media` solo declara `<source type="video/mp4">` hoy — un solo
formato. Si se quiere WebM/AV1 hay que ampliar el componente primero.

**Sin pista de audio.** Se reproducen en silencio y el audio solo suma peso.
(Y si el corte completo lleva voz, ese sí necesitará subtítulos cuando exista el
reproductor.)

**Póster: obligatorio y hoy ausente.** Los tres tienen `poster: null`. Sin póster
hay un rectángulo negro hasta que el video arranca, y se pierde el fotograma que
el navegador usa como referencia de carga.

| Póster | Proporción | Master | Peso servido |
|---|---|---|---|
| Uno por video | La del video | Igual que el video | ≤ 120 KB |

Debe ser **un fotograma real del bucle**, no una foto distinta: si no coinciden,
se ve un salto al empezar.

---

## 5 · Datos

| Entregable | Formato | Detalle |
|---|---|---|
| **Coordenadas de las 4 estaciones** | WGS84 decimal, **5 decimales** (≈ 1 m) | `geo: null` en las cuatro. Es lo que **desbloquea el mapa y el orden por cercanía**, que ya están cableados y apagados esperándolas. Indicar si el punto es **el cargador** o **la entrada del parqueadero**: el enlace "Cómo llegar" lleva ahí |
| Tarifa por estación | número + moneda | Ver D4 |
| Especificaciones verificadas | potencia, puntos, conectores, horario | Las cuatro estaciones están marcadas `dataStatus: "placeholder"`. Las ubicaciones son reales; las especificaciones **no están verificadas** |
| **Métricas de impacto** | valor + unidad + **fuente** + fecha de corte | Seis claves: estaciones en operación · ciudades · MWh entregados · sesiones · conductores conectados · t de CO₂ evitado. Hoy /nosotros declara honestamente que están en validación. Hacen falta **dos** para poder destacar (O6) |
| Logos de partners | **SVG monocromo** | Van sobre fondo oscuro, así que un logo a todo color se ve mal. **Con permiso de uso por escrito** — la franja se omite sola si no hay registros |
| Hitos de la historia | fechas + hechos | La sección describe el recorrido sin fechas para no inventarlas (O6) |

---

## 6 · Operativo

| Entregable | Detalle |
|---|---|
| **CRM objetivo** (O3) | El formulario está listo y **no envía**. Un único punto a cambiar: `submitLead` en `LeadForm.tsx`, más poner `CRM_ENABLED = true`. El copy de éxito real ya está escrito y traducido. Campos estables: `name, email, company, phone, message, segment, consent` |
| **Plataforma de analytics** (O4) | Los eventos se emiten a `window.dataLayer`. Un único punto a cambiar: `dispatch` en `lib/analytics/index.ts` |
| **Enlaces de App Store y Google Play** (O8) | `app_store_click` está declarado y no se puede emitir porque no hay enlaces. No hay ningún botón de app publicado — no se publica un enlace sin destino |
| **Texto legal de la política de datos** (§38) | La página existe con la estructura y el índice de contenidos, marcada `noindex` mientras no haya texto. Lo emite el área legal conforme a la Ley 1581 de 2012. El consentimiento del formulario enlaza ahí, así que **bloquea la publicación del formulario** |
| Proveedor de mapa (O7) | Diferido. Aunque llegue, sin coordenadas no hay nada que pintar |

---

## 7 · Limpieza pendiente en el repo (no depende de nadie)

| Item | Detalle |
|---|---|
| `public/*.svg` | `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — sobras del scaffold de Next, sin una sola referencia en el código |
| `app/favicon.ico` | Es el favicon por defecto de Next, 25,9 KB |
| Tamaño de los huecos | Ningún hueco pendiente debería ser el elemento más grande de su página. El de 21/9 de la ficha de estación mide 575 px de alto y domina por encima de los datos reales |
| `robots.txt` | Dice `Allow: /` y el sitemap apunta a `voltop.co` mientras el pie dice "Prototipo · contenido provisional". **Si esto se despliega, Google indexa placeholders** |
| Redirección de raíz | `permanent: false` a propósito mientras no se publica. Pasar a `true` al lanzar |

---

## 8 · Presupuesto de la primera vista

Lo único que la primera pantalla descarga de todo lo anterior:

| | Peso |
|---|---|
| Tipografías (3 familias, 5 pesos, subconjunto latin+latin-ext) | ≤ 120 KB |
| Foto del hero, AVIF (elemento LCP) | ≤ 250 KB |
| **Total añadido a la primera vista** | **≤ 370 KB** |

Compatible con LCP < 2,5 s en 4G, que es el umbral de §29. Los videos van
después del primer viewport y no compiten con el LCP.

**Verificar con el material puesto, no antes.** El presupuesto de §29 hoy se
cumple por ausencia de contenido, no por mérito: el sitio sirve **cero imágenes**
en las cinco rutas.

---

## 9 · Orden de entrega recomendado

1. **Marca** — hex, tipografías, logo. Desbloquea la capa visual completa y es lo
   único que separa el proyecto de su techo real.
2. **Coordenadas** — cuatro pares de números. Enciende el mapa y la cercanía, que
   ya están construidos.
3. **Foto del hero** — un solo archivo que cambia por completo la primera
   impresión. Ver D1 antes de disparar.
4. **Póster + bucle del signature moment** — el segundo beat de la Home.
5. **Texto legal** — bloquea la publicación del formulario.
6. **CRM** — convierte el formulario en un formulario.
7. El resto del material, métricas y logos de partners.


---

## 5 · Película de marca — entregada, con un pendiente de accesibilidad

**Entregada el 2026-09-02:** `Video Home.mov`, 65 s, 3840 × 2160, 46 Mbps, 377 MB, con audio PCM.
**Servida como** `voltop-film.mp4` — 1920 × 1080, H.264 + AAC 128k, `faststart`, **27.6 MB**.
Vive en el beat 7 de la Home, en la franja ancha bajo la cita.

**Va con controles, no como fondo.** Tiene narración y subtítulos quemados: silenciada en bucle perdería el mensaje. Con `preload="none"` solo viaja el póster —67 KB— hasta que alguien le da play.

### D3 · Hace falta un máster sin texto quemado

Los subtítulos están **incrustados en la imagen, en inglés, de los ~4.2 s a los ~58 s**. Dos problemas:

1. **Se ven igual en `/es` y en `/pt`.** Contradice la regla común de este documento: *sin texto quemado en la imagen, no se puede traducir ni leer por asistencia*.
2. **No son accesibles.** Un lector de pantalla no los alcanza y no se pueden desactivar. WCAG 1.2.2 exige subtítulos reales para audio pregrabado, y el vídeo hoy tiene **cero pistas `<track>`**.

**Lo que hay que pedir:**

| | |
|---|---|
| Máster | El mismo corte **sin subtítulos quemados** |
| Subtítulos | Tres archivos `.vtt` — español, inglés y portugués |
| Transcripción | Del audio, para poder generar los `.vtt` sin transcribir de oído |

Con eso, el reproductor gana `<track kind="captions">` por idioma y el problema se cierra. Hasta entonces el vídeo es utilizable pero **no cumple 1.2.2**.

### El póster se eligió midiendo

Se puntuaron 130 fotogramas (2 fps) por energía de bordes y exposición, descartando el tramo con subtítulos, y se afinó el instante con búsqueda exacta a 8 fps. Elegido: **4.0 s**, unas manos conectando el cargador a un vehículo — muestra el servicio en uso, es humano, no lleva texto ni marca ajena dominando, y funciona a cualquier tamaño. 67 KB.

Los aéreos de Medellín (58–63 s) puntuaban más alto en nitidez y se descartaron: la métrica premia detalle, no relevancia.
