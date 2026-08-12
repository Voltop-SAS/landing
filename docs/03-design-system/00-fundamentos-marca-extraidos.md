# Fase 4 · Design System — Fundamentos de marca extraídos (de guidelines actuales)

> Fuente: `Buttons.png` (guideline actual de Voltop). El usuario invita a repensar/reconstruir si conviene. Fecha: 2026-07-23.
> Valores de color = **aproximados, a confirmar hex exactos** desde Figma/brand.

## 1. Lo que confirma la referencia
- **Voltop es dark-first.** Lienzo navy muy oscuro (~`#0A0F1C`).
- **Acento de marca = gradiente eléctrico verde→cian.** Default: mint/verde (~`#45E0A8`) → cian (~`#28C6E6`). Press: vira a cian/azul saturado (~`#00B5E2`). → Esto **es la "Corriente"** de la dirección elegida.
- **Texto sobre primario = oscuro** (navy) → alto contraste sobre el gradiente brillante (bien para accesibilidad).
- **Jerarquía de botón:** Primary (gradiente) · Secondary (relleno oscuro + borde sutil) · Secondary neutral (más discreto) · Tertiary (solo texto + icono).
- **Escala:** Large / Medium / Small / Extra small.
- **Estados:** Default / Press / Disabled (baja opacidad). *(Faltan Hover, Focus-visible, Loading → los añadimos, ver §4.)*
- **Forma:** pill (radio completo). **Icono:** flechas a ambos lados (`← Button →`).

## 2. Tokens semilla (base del Design System)
| Token | Valor aprox. (confirmar) | Nota |
|---|---|---|
| `color.canvas` | `#0A0F1C` | Fondo dark-first |
| `color.brand.gradient` | `#45E0A8 → #28C6E6` | Corriente (verde→cian) |
| `color.brand.press` | `#00B5E2` | Estado activo/press |
| `color.on-brand` | navy oscuro | Texto sobre primario |
| `color.surface.*` | grafitos/acero | Secondary / secondary-neutral |
| `color.text.*` | blanco / gris | Sobre canvas |
| `radius.pill` | full | Botones actuales (ver crítica §3) |
| `size.button` | L / M / S / XS | 4 escalas |

## 3. Crítica constructiva (lente art direction / anti-genérico)
El sistema actual es sólido y está bien pensado. Tres puntos a **repensar** para subir a nivel internacional y reforzar "infraestructura que cobra vida":

1. **Gradiente = sí, pero con disciplina.** El verde→cian es un activo (energía/marca). Riesgo: si **todo** primario es gradiente en todos los tamaños, el wow se diluye y puede leerse genérico. → Recomendación: reservar el **primary-gradient** para la acción más importante de cada vista; usar tratamientos más planos/estructurales para acciones menores. La energía brilla porque es escasa (principio de ritmo).
2. **Pill total vs precisión estructural.** El radio pill es amable pero "suave"; contrasta con el registro *Infraestructura* (grid, precisión). → Opciones: (a) mantener pill como firma; (b) evolucionar a un radio **más contenido/preciso** (más "ingeniería"); (c) **dual**: pill en contextos energéticos/CTA, radio ajustado en contextos estructurales/datos. Decisión tuya.
3. **Flechas dobles `← →`.** Poner flecha a ambos lados en todos los botones puede sentirse decorativo y ambiguo (¿avanza o retrocede?). → Recomendación: **una** flecha direccional solo cuando comunique dirección (p. ej. `→` en "continuar"), no ambas por defecto.

Además, **faltan estados** clave para web premium: **Hover**, **Focus-visible** (accesibilidad/teclado) y **Loading**. Los añadimos al componente.

## 4. Cómo evoluciona en el Design System (propuesta)
- Adoptar el **gradiente verde→cian** como color de energía del registro *Impacto* y del CTA primario (con disciplina §3.1).
- Completar estados: Default · Hover · Focus-visible · Press · Loading · Disabled.
- Mantener 4 tamaños; mapear a la tipografía fluida del sistema.
- Resolver radio según decisión §3.2.
- Revisar patrón de icono según §3.3.
- Todo como **tokens** (color/gradiente/radio/espaciado/tipografía/motion) reutilizables y exportables a los 3 caminos de producción.

## 5. Impacto en la dirección "Silencio ↔ Impacto"
Como Voltop es **dark-first**, ajusto los dos registros (ver `02-art-direction/05-direccion-elegida.md`):
- **Silencio (base):** dark estructural y calmado (canvas navy + superficies grafito/acero, sin gradiente) para contenido, datos y utilidad. Legible, sobrio, "infraestructura".
- **Impacto:** el mismo dark + **corriente verde→cian** que emite. Reservado a signature moments y CTA primario.
- **Pendiente decidir:** si la **utilidad Red/mapa** necesita un **modo claro** por legibilidad diurna a la intemperie, o si se resuelve con un dark de alto contraste.
