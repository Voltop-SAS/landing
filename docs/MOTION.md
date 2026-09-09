# El lenguaje de movimiento de Voltop

Estado a **2026-09-04**. La implementación vive en `src/ui/common/lib/motion.ts` (valores de
JS), `src/app/globals.css` (tokens y microinteracciones) y los componentes que los
consumen. Referencia normativa: §21.

> **El movimiento forma parte de la experiencia aprobada.** No se sustituye una
> animación porque exista una forma técnicamente distinta de hacerla.

---

## El principio

**La energía es respuesta, no ambiente.** El movimiento ocurre cuando el usuario
hace algo. **No hay animaciones ambientales en bucle**: no aportan información,
consumen atención y compiten con el contenido.

Y el WOW no viene de tener muchos gestos distintos, sino de **repetir pocos con
precisión**. Se estudió una referencia externa midiendo 447 mutaciones de estilo
durante el scroll y su vocabulario eran tres técnicas aplicadas sin una sola
excepción. Un vocabulario que crece deja de reconocerse.

## Las cuatro primitivas

Todo el movimiento del sitio se construye combinando estos cuatro gestos. **No
hay un quinto.**

### DEPTH · el contenido llega desde el fondo

Escala + opacidad. Es el gesto base, implementado en `src/ui/common/components/ui/Reveal.tsx`.

- **Cuándo:** cualquier entrada en viewport.
- **Cuándo NO:** sobre cifras, specs o datos de estación. Lo que prueba algo no
  se anima — un dato que aparece con gracia se lee como publicidad.
- Sustituyó al `fade + translateY`, que es el reveal por defecto de cualquier
  plantilla: se percibía como "la página cargó", no como una decisión.

### FLOW · el material se desplaza dentro de un marco que no se mueve

`src/ui/common/components/ui/Flow.tsx`. De aquí sale la percepción de profundidad.

- **Cuándo:** solo fotografía y vídeo grandes servidos en `cover`.
- **Cuándo NO:** jamás sobre texto — un titular con parallax se lee como
  plantilla. Y **nunca sobre un objeto servido en `contain`**: esta primitiva
  recorta por diseño (su marco clipa un interior un 24% más alto), y se
  comprobó comiéndose 135px del render del cargador.
- **Hoy no tiene consumidores**, y no es un olvido: la fotografía de fondo que
  la llevaba salió con el rediseño del beat 3 y el render que la sustituyó no
  puede llevarla. Se conserva porque la decisión sigue vigente. El día que entre
  una fotografía a sangre, es la pieza que le da profundidad.

### FRAME · el encuadre se abre y descubre lo que ya estaba

Implementado en el beat 2 (`InfrastructureSignature`) con `clip-path` ligado al
progreso de scroll.

- **Cuándo:** momentos signature. **Dos en toda la Home como máximo.**
- **Cuándo NO:** en contenido secundario. Repetido deja de ser un
  descubrimiento y pasa a ser una transición cara.

### CONTINUITY · algo persiste entre dos estados o dos páginas

- **Cuándo:** hay una relación real entre lo que se deja y lo que se abre.
- **Cuándo NO:** entre vistas sin relación — fingir continuidad desorienta.
- Hoy se limita a la transición de página de `src/app/[locale]/template.tsx`.

## Intensidades: tres, no cuatro

```
depth = {
  standard:   { scale: 0.965, y: 10, duration: 0.55 },
  expressive: { scale: 0.90,  y: 24, duration: 0.85 },
}
```

| Nivel | Dónde | Qué se percibe |
|---|---|---|
| **STANDARD** | Entrada normal de contenido | Se nota que la página responde, no se piensa en ello |
| **EXPRESSIVE** | Beats narrativos | Se percibe claramente como una decisión |
| **SIGNATURE** | Dos momentos como máximo | Se recuerda |

**Se descartó un nivel `subtle`** y el motivo importa: no es una versión pequeña
de DEPTH sino **otra familia**. Las microinteracciones se expresan en color,
opacidad y dos o tres píxeles, no en escala. Meterlas en la misma escala habría
creado un nivel que nadie percibe.

**Y SIGNATURE no es un valor más alto de STANDARD**: es una composición de
varias primitivas ligada al scroll. Por eso son dos y no ocho.

Los valores están calibrados **para que se perciban**. Un `scale` de 0.99 es
indistinguible de no animar, y entonces el trabajo de movimiento no existe para
quien mira.

## Curvas y duraciones

Espejo entre `src/ui/common/lib/motion.ts` (JS) y `src/app/globals.css` (CSS). **Son dos archivos
duplicados a propósito** —Tailwind lee el CSS y Motion necesita valores de JS—
y se referencian mutuamente. **Si cambias uno, cambia el otro.**

| | Valor | Uso |
|---|---|---|
| `ease.standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entradas y transiciones generales |
| `ease.current` | `cubic-bezier(0.65, 0, 0.35, 1)` | Recorridos ligados al scroll |
| `ease.exit` | `cubic-bezier(0.4, 0, 1, 1)` | Salidas |
| `ease-overshoot` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Solo microinteracciones de flecha |
| `duration.fast` | 200ms | Hover, press, cambios de color |
| `duration.base` | 320ms | Transición de página, aparición de flotantes |
| `duration.reveal` | 700ms | Fases del momento signature |
| `COUNT_DURATION` | 1.3s | El conteo de cifras. **No tiene espejo en CSS**: no es una transición de interfaz sino una lectura |

## Escalonado

**Un solo valor para todo el sitio: `STAGGER = 0.07`**, con tope en 5 posiciones.

Antes había cuatro valores —0.05, 0.06, 0.07 y 0.08— repartidos por cuatro
archivos. Cuatro valores que nadie distingue no son cuatro decisiones: son la
ausencia de una.

Se pide **por índice, no por retardo**: las listas pasan su posición y el sistema
decide el tiempo. El tope evita que una lista de doce elementos haga esperar casi
un segundo al último.

## Microinteracciones

Otra familia, y por eso viven en CSS y no en el vocabulario de Motion.

- **Hover:** color o desplazamiento de 1–4px. `duration-fast`.
- **Press:** clase **`.press`** — `scale(0.98)`, un solo valor para todo el
  sitio. Existe porque el sitio tenía hover en 19 componentes y respuesta al
  clic en 2: en una pantalla táctil **no hay hover**, así que tocar una tarjeta
  no producía ninguna señal entre el toque y la carga de la página siguiente.
  Aquí el movimiento no es expresivo, es **acuse de recibo**.
- **Focus:** anillo global de 2px, nunca eliminado.
- **Loading / éxito:** solo el formulario B2B, con estados `idle | loading |
  success` y foco gestionado.

## Reglas duras

1. **Solo `transform` y `opacity`.** La única excepción es el `clip-path` de
   FRAME, y está documentada donde ocurre.
2. **Duraciones y easings desde tokens.** Cero números sueltos en la
   presentación.
3. **Nunca ligar la opacidad de contenido a `scrollYProgress`.** Una
   interpolación de scroll devuelve el valor a 0 al salir del rango: el texto
   desaparecería al subir. El material puede scrubbearse; **el texto se revela
   una vez y permanece**.
4. **Un motor de scroll a la vez**: Lenis o el nativo, nunca los dos.
5. `prefers-reduced-motion` con **alternativa equivalente verificada**.

## reduced-motion

No es un apagado: es una alternativa equivalente.

- `revealTransition` y `depthMotion` ponen la duración a **0**, no a la mitad:
  media duración sigue siendo movimiento.
- **Red de seguridad en CSS** sobre `[data-reveal]` que anula `opacity`,
  `transform` y `clip-path` **sin depender del JS**, más una regla gemela para
  `scripting: none`. Motion escribe el estado inicial como estilo en línea, así
  que sin esa red el HTML servido llevaría `opacity: 0` y el contenido viajaría
  invisible.
- **El beat 2 colapsa a altura normal.** Sin eso, quien pide menos movimiento
  recibía 2160px de scroll muerto sin el efecto que los justificaba.
- **`.press` conserva el acuse de recibo sin movimiento**: la señal pasa al
  color. Quien pide menos animación sigue necesitando saber que su toque llegó.
- Lenis se desactiva por completo.

**Verificado en cada validación:** cero elementos invisibles, cero `transform`,
cero `clip-path` en `[data-reveal]`, y la sección signature a 557px.

## Dos trampas documentadas

1. **`whileInView` no revela lo que ya quedó arriba.** Un `IntersectionObserver`
   solo informa de lo que intersecta AHORA. Recargando la Home a media altura
   quedaban **once bloques a opacidad 0 para siempre** —y seguían invisibles al
   volver a subir—. Lo cubre `useScrolledPast` en `src/ui/common/lib/motion.ts`: lo que ya pasó
   se renderiza sin animación. **No borrar ese hook.**
2. **Lenis intercepta el scroll programático.** `window.scrollTo` no dispara las
   animaciones ligadas al scroll. Para medir o automatizar hay que enviar
   eventos de rueda reales.
