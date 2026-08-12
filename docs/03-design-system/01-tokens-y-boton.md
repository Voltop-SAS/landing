# Fase 4 · Design System — Arquitectura de tokens y componente Botón

> Dark-first. Refleja las 4 decisiones confirmadas. Valores aproximados = confirmar con assets de marca. Fecha: 2026-07-23.

## Decisiones confirmadas (base del sistema)
1. **Radio dual por contexto:** `radius.energetic` (pill) en CTA/contextos energéticos · `radius.structural` (contenido/preciso) en datos/estructura.
2. **Icono:** una sola flecha **contextual** (`→`) solo cuando comunica dirección; sin flechas dobles por defecto.
3. **Dark de alto contraste** en toda la experiencia, incl. utilidad Red/mapa (sin modo claro por ahora).
4. **Gradiente con disciplina:** el primary-gradient se reserva a la acción más importante de cada vista.

## 1. Arquitectura de tokens (semilla)
> Un solo tema (dark), alto contraste. Todo valor final se confirma con la marca.

**Color**
- `color.canvas` ~`#0A0F1C` · `color.surface.1/2/3` (grafito→acero, para profundidad estructural, planas)
- `color.text.primary` (blanco) · `.secondary` (gris claro) · `.muted`
- `color.brand.gradient` `#45E0A8 → #28C6E6` (energía/Corriente) · `color.brand.press` ~`#00B5E2` · `color.on-brand` (navy oscuro)
- `color.border.subtle` (bordes estructurales) · `color.focus` (anillo de foco visible, alto contraste)
- `color.feedback.success/warn/error` (a definir dentro del sistema, no ad-hoc)

**Radio (dual)**
- `radius.energetic` = full (pill) → CTA primario, chips energéticos, signature moments
- `radius.structural` ~`4–8px` → tarjetas de datos, inputs, contenedores estructurales
- Regla: energético = acción/energía; estructural = información/precisión

**Espaciado**: escala modular (p. ej. 4/8/12/16/24/32/48/64…) → spacing responsivo.

**Tipografía** (pendiente de fuentes reales)
- Rol **editorial** (titulares/cuerpo): sans contemporánea, buena en ES/EN.
- Rol **técnico/datos**: tratamiento tabular/monospace para kW, conectores, cifras (señal "infraestructura").
- **Escala fluida** (clamp) por breakpoint; jerarquía nítida.

**Motion** (valores finales aquí, no dispersos)
- Duraciones: `xfast 120 · fast 200 · base 300 · slow 500 · cinematic 800+` (ms)
- Easing: `standard` (ease-out UI) + `current` (easing propio para energía)
- Regla dura: solo `transform`/`opacity`; `prefers-reduced-motion` → sin flujo, estado final; gama baja → simplificar

**Luz/elevación**: superficies estructurales planas; **emisión (glow) reservada** a energía/Impacto, nunca decorativa.

**Iconografía**: set propio, línea coherente; flecha direccional única contextual; nada de iconos genéricos como relleno.

## 2. Componente Botón (evolucionado)

**Jerarquía** (con disciplina de gradiente)
| Nivel | Tratamiento | Uso |
|---|---|---|
| **Primary** | Gradiente verde→cian, texto navy | **1 por vista** (acción más importante). Radio energético |
| **Secondary** | Superficie oscura + borde sutil, texto claro | Acciones importantes no primarias |
| **Secondary neutral** | Superficie más discreta | Acciones terciarias con peso |
| **Tertiary** | Solo texto (+ flecha contextual) | Acciones de bajo énfasis / navegación |

**Tamaños:** L / M / S / XS → mapeados a la escala tipográfica y de espaciado. Touch target ≥44px en los tamaños táctiles.

**Estados (completos — añadimos los que faltaban):**
`Default · Hover · Focus-visible · Press · Loading · Disabled`
- **Hover:** realce sutil (brillo/energía leve en primary; borde/superficie en otros) vía `transform`/`opacity`.
- **Focus-visible:** anillo de foco de alto contraste (accesibilidad/teclado) — no eliminar el outline.
- **Press:** vira al `color.brand.press` (cian saturado) en primary; feedback inmediato.
- **Loading:** indicador coherente + `aria-busy`; bloquea doble envío (clave en formularios).
- **Disabled:** baja opacidad + sin foco; comunicar por qué cuando aplique.

**Radio:** energético (pill) en contextos de acción/energía; estructural en contextos de datos (p. ej. acciones dentro de tablas/paneles de estación).

**Icono:** una flecha `→` solo cuando la acción implica dirección/continuidad; sin flechas dobles.

**Accesibilidad:** contraste AA (texto navy sobre gradiente ya cumple), focus-visible, roles/labels correctos, 44px táctil, loading anunciado.

**Motion:** hover/press con `transform`/`opacity`; respeta `prefers-reduced-motion`.

**Medición:** el CTA primario emite su evento (p. ej. `cta_*_click`) con `context` de la vista (ver measurement plan).

## 3. Qué sigue en el Design System
- Confirmar hex/tipografías reales (assets).
- Definir: inputs y **formulario** (CRM-ready, segmentado), tarjeta de **estación**, franja de **confianza/logos**, **data-viz** de impacto, navegación/header, footer.
- Cada componente pasa por el Review Gate (UX→UI→Responsive→A11y→Motion→Performance→QA) con doble criterio y ritmo.
