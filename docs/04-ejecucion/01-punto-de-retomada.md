# Punto de retomada

> Actualizado: 2026-09-02 · Rama `auditoria/fases-0-3` · Último commit `e021195`
> Estado: **build, lint y tipos limpios · 50 páginas · ES 428 · EN 428 · PT 428**

Este documento existe para poder cerrar la sesión y volver sin releer nada. El
*porqué* de cada decisión está en `00-registro-de-cambios.md`, bloques 1 a 44.
La norma sigue siendo `MASTER-PROJECT-DEFINITION.md`, ahora en **v1.2**.

---

## Cómo levantar el proyecto

```bash
cd /Users/siendo_kam/voltop-web-redesign
npm run build && npm start        # → http://localhost:3000
```

Al entrar sale el **aviso de cookies**: es correcto, la analítica no carga
hasta que se responde.

Recargar con **Cmd+Shift+R**. Si algo no se ve, casi siempre es que el build no
se rehízo: `npm start` sirve el último build, no el código en disco.

---

## En qué estado está

**El sitio está construido.** No queda arquitectura pendiente, ni decisión
técnica abierta, ni deuda sin documentar. Lo que falta son **entregas
externas**, listadas abajo.

Cerrado en esta sesión, de un vistazo:

| | |
|---|---|
| Marca | Paleta oficial completa · Poppins (titulares) + Manrope (interfaz). **Cero marcadores de posición** |
| Datos de la red | 3 estaciones reales · 35 puntos · 22–80 kW · coordenadas y direcciones |
| App | Insignias a su tienda · QR verificado · flotante en escritorio y móvil |
| Legal | Términos y política publicados e indexables · aviso de cookies que **bloquea** la analítica hasta el consentimiento |
| Medición | Google Tag Manager `GTM-WJ5S2LBF` · los 17 eventos del plan con emisor |
| Formulario B2B | Conectado por correo a los tres destinatarios |
| Novedades | 3 entradas · la de Wake con vídeo, cuerpo y CTA |
| Accesibilidad | 48 combinaciones sin desbordes · contraste medido sobre píxel compuesto · reduced-motion sin elementos invisibles |

---

## Lo que falta, por tipo

### Bloquea la publicación

| # | Qué | Nota |
|---|---|---|
| 1 | **`app.voltop.co` devuelve 503** | Decisión de Camilo: dejar el enlace como está y esperar al equipo técnico. **Es el CTA principal del header**, así que hoy ese botón no lleva a ninguna parte. Las insignias de tienda sí funcionan |
| 2 | **Cinco assets** (`aperturaEan`, `visionCeo`, `infraestructuraAmplia`, `espacioComercial`, `detalleCarga`) | `/empresas` y `/nosotros` **abren con un hueco declarado**. Aplazado a propósito |
| 3 | **Máster de la película sin subtítulos quemados + 3 `.vtt`** | Único incumplimiento WCAG AA vivo. Aplazado a propósito |
| 4 | **Consulta legal sobre el aviso de cookies** | El aviso está montado y funciona. Falta que un abogado confirme que la redacción y el mecanismo bastan |

### Falta información

| # | Qué | Desbloquea |
|---|---|---|
| 5 | Fechas reales de las entradas **EAN** y **Grand Hyatt** | Retira la etiqueta naranja "FECHAS PROVISIONALES" del registro |
| 6 | Archivos y nombres de los **logos de aliados** (el permiso ya existe) | `partners: []` está vacío y la franja se omite sola |
| 7 | ¿La **tarifa** se publica algún día? | Hoy el copy describe el mecanismo, no la cifra. Correcto y publicable |

### Requiere decisión

| # | Qué | Contexto |
|---|---|---|
| 8 | **El vídeo de Wake es el mismo archivo que la película de la Home** | Se ve en dos sitios: bajo "Visión" con la cita de Bruno, y en la noticia. ¿Se acepta la repetición o se separan las piezas? |
| 9 | **`voltop-film.mp4` (28 MB) versionado en git** | Funciona. Solo compensa moverlo cuando crezca el catálogo de vídeo |
| 10 | **Poppins Black (900) está cargada y sin usar** | Es el peso del logotipo. ¿Titulares más rotundos? |
| 11 | **Formulario por `mailto:`** | Funciona sin servidor, pero pierde a quien no tenga cliente de correo y expone las tres direcciones. Un servicio de formularios lo resuelve y solo cambia una función |

### Descartado conscientemente

- **View Transitions / React experimental** — verificado: el flag se acepta pero dispara **0 transiciones**; el componente no existe en React estable. No se cambia el canal por una animación.
- **Filtro de novedades** — con 3 entradas filtraría a una. Umbral: ~15.
- **Wordmark gigante en el footer** — decoración sin función.
- **Carga en horario valle** — producto confirmó que no existen tarifas por franja. Se sustituyó por *reserva*, que sí existe.
- **"Sin sorpresas de disponibilidad"** — está sujeta a ocupación; no se puede garantizar.

---

## Cosas que conviene saber antes de tocar nada

**Las cifras no se escriben a mano.** Puntos de carga, potencias, ciudades y
conectores se calculan desde el dataset en `getNetworkSummary()`. Añadir una
estación actualiza la Home sola. Lo mismo los escalones del filtro de potencia.

**El texto legal no es `Localized`.** Es español plano a propósito: traducir un
instrumento jurídico lo convierte en otro instrumento. Inglés y portugués
muestran el original con aviso.

**`.glass` no declara `position`.** Tiene la misma especificidad que `.fixed`
de Tailwind, y declararla rompía el anclaje de los elementos fijos. Quien la
use sin `fixed`/`absolute` añade `relative` en el marcado.

**`.measure` vale 48ch, no 62.** La unidad `ch` mide el glifo "0", más ancho
que el carácter medio. Si se cambia la tipografía, **hay que volver a medir**:
la proporción es propiedad de la fuente.

**Los másteres viven fuera del repositorio**, en `~/Voltop-masters-originales/`
con su propio LEEME. Están en `.gitignore`. Siguen pendientes de subir a un
almacenamiento compartido: hoy están en una sola máquina.

**Para medir cualquier cosa en el navegador:** hay trampas documentadas en el
registro —el `clip` de las capturas usa coordenadas de página, Lenis intercepta
el scroll programático, y el contraste hay que medirlo sobre el píxel
compuesto a percentil 99, no sobre el token—. Están en los bloques 12, 17 y 34.

---

## Lo siguiente, si hubiera que elegir

1. **Conseguir los cinco assets.** Es lo único que deja dos páginas abriendo
   con un hueco gris, y es la primera pantalla que ve quien entra.
2. **Arreglar `app.voltop.co`** o aceptar que el CTA del header apunte a la
   sección de descarga de la Home, donde las insignias sí funcionan.
3. **La consulta legal del aviso de cookies**, que es lo único con riesgo
   jurídico real.
