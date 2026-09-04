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
npm run dev                       # → http://localhost:3000 · para TRABAJAR
npm run build && npm start        # → http://localhost:3000 · para VERIFICAR
```

`dev` refleja cada guardado al instante; `start` sirve el último build, así que
un cambio no aparece hasta rehacerlo. Revisa en `dev` y verifica en `start`: el
build es el único que enseña lo que se publica.

**Los dos no se turnan sin limpiar.** Comparten `.next`, y correr `build` con un
servidor `dev` de por medio deja ese directorio en un estado que `dev` no
digiere: **404 en `/es`, `/en` y `/pt`** —todas las rutas de idioma a la vez,
que es la pista de que no es un fallo del código—. Se arregla con `rm -rf .next`
y a levantar de nuevo.

Al entrar sale el **aviso de cookies**, una franja abajo: es correcto, la
analítica no carga hasta que se responde.

El **flotante del QR** aparece pasado el Hero y vuelve en cada recarga. Si no
aparece: o el aviso de cookies sigue sin responder —el flotante espera a que se
decida—, o estás sobre una de sus zonas mudas (`#infraestructura`, `#vision`,
la sección de descarga) o en `/empresas` o un legal, donde se calla a propósito.

Recargar con **Cmd+Shift+R** (el caché del navegador engaña más que el build).

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
| ~~1~~ | ~~`app.voltop.co` devuelve 503~~ **RESUELTO 2026-09-03** | Comprobado: responde 307 → `/download` y sirve una página real de descarga. El CTA del header siempre apuntó bien; ya no hay nada que decidir |
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
| ~~10~~ | ~~Poppins Black (900) cargada y sin usar~~ **CERRADO 2026-09-03** | Se retiró en la limpieza: se cargaba sin que ningún componente la usara. Si algún día se quieren titulares más rotundos, se vuelve a añadir en `app/layout.tsx` |
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

## Después de la limpieza del 2026-09-03

El código quedó auditado entero (ver Bloque 46 del registro). Lo que conviene
saber al volver:

- **El pie ya no dice "Prototipo · contenido provisional".** Se retiró: era
  falso y salía en todas las páginas.
- **Quedan 17 skills, no 47.** Las genéricas de diseño se retiraron porque
  competían con las siete `voltop-*`, que son el criterio de este proyecto.
- **`PostLink` es nuevo** y centraliza la regla §15 —enlazar solo si hay
  destino— que estaba copiada en las tres listas de novedades. Las listas
  siguen siendo visualmente distintas a propósito.
- **`Media` y `VideoMedia` no se funden nunca**: uno es servidor, el otro
  cliente porque lee `prefers-reduced-motion`.

## Lo siguiente, si hubiera que elegir

1. **Conseguir los cinco assets.** Es lo único que deja dos páginas abriendo
   con un hueco gris, y es la primera pantalla que ve quien entra.
2. **Arreglar `app.voltop.co`** o aceptar que el CTA del header apunte a la
   sección de descarga de la Home, donde las insignias sí funcionan.
3. **La consulta legal del aviso de cookies**, que es lo único con riesgo
   jurídico real.
