# Signature moment #1 — Hero de Home

> Dirección detallada (no UI, no código). Registro *Impacto* que abre el sitio y fija el tono "infraestructura que cobra vida". Fecha: 2026-07-23.

## Propósito narrativo
En pocos segundos comunicar: **qué es Voltop** (infraestructura + tecnología), que es una **red viva y a escala**, y ofrecer la **acción B2C global** (Encontrar cargador). Es la primera prueba de nivel internacional y establece el ritmo dual (energía ↔ silencio) del resto de la página.

## Idea del momento
Una composición **estructural y precisa** (grid + imagen real/render de estación) por la que, al cargar, **fluye corriente** que recorre la estructura y **enciende los nodos de la red**, resolviendo en el titular + CTA. Estructura → energía → afirmación.

## Composición (arquitectura de contenido, sin diseño visual)
- **Titular** (placeholder ES, realista — nunca lorem): p. ej. *"La red que mueve a Colombia."* [PLACEHOLDER a validar en UX Writing]
- **Línea de apoyo:** propuesta breve (infraestructura confiable + tecnología). [PLACEHOLDER]
- **CTA primario:** **Encontrar cargador** (acción B2C global). Secundario contextual mínimo si aporta.
- **Visual de fondo/figura:** corriente-a-través-de-estructura (render/gráfico) + foto real donde exista.
- **Indicador de escala discreto:** `XX estaciones · XX ciudades` (placeholders explícitos; nunca inventar).

## Coreografía de motion (registro Impacto)
1. **Estructura (0–400ms):** el grid / líneas estructurales se dibujan con precisión (ease-out).
2. **Corriente (400–1200ms):** la energía fluye por las líneas y alcanza los nodos (estaciones), que se "encienden" (easing "current").
3. **Afirmación (en sync):** titular y CTA se revelan al ritmo de la corriente (motion tipográfico sutil).
4. **Idle:** loop ambiental **muy** sutil de corriente (respiración), bajo consumo.
5. **Scroll-out:** la corriente hace *handoff* hacia la siguiente sección (transición hacia "la red"), conectando el relato.

## Estados y adaptación (responsive + a11y + performance)
- **Reduced-motion (`prefers-reduced-motion`):** sin flujo; se muestra directamente el **estado final "encendido"** (estático) + fade del titular. Experiencia equivalente, sin movimiento.
- **Móvil / gama baja:** corriente simplificada (menos partículas, secuencia más corta), **loop ambiental apagado** (batería/perf), asset más ligero.
- **Conexión lenta:** **poster estático** primero (asegura LCP y legibilidad), la animación mejora progresivamente solo si el dispositivo puede.
- **Orientación:** composición recompuesta en vertical/horizontal (no reescalada).

## Accesibilidad
- Titular y CTA son **texto real del DOM** (no incrustados en imagen) → legibles, traducibles ES/EN, indexables.
- Contraste garantizado del texto sobre el fondo energético (capa/tratamiento de legibilidad).
- Foco visible y orden lógico; CTA alcanzable por teclado; `prefers-reduced-motion` respetado.
- Touch target del CTA ≥ 44px en móvil.

## Performance (budget)
- **LCP:** poster/estado estático como primer render; animación después.
- **60fps:** solo `transform`/`opacity`; si se usa canvas/WebGL, dentro de budget; si no, fallback CSS/SVG de corriente.
- Assets optimizados (AVIF/WebP para poster; asset de energía diferido).
- Verificar en dispositivo de gama baja (skill `voltop-quality-compliance`).

## Contenido y placeholders
- Copy de titular/apoyo = **placeholder realista de Voltop**, marcado como provisional (validar en UX Writing).
- Cifras de escala = **XX** hasta validación; nunca presentar como reales.
- Visual de energía y foto de estación = producir/seleccionar (foto parcial disponible) → registrar en assets-todo.

## Medición
- `cta_encontrar_cargador_click` con prop `context = hero`.
- (Opcional) engagement del hero solo si informa una decisión de diseño.

## Definition of Done (gate)
Pasa por UX → UI (doble criterio + ritmo) → Responsive → Accessibility → Motion (con reduced-motion) → Performance (LCP/60fps/gama baja) → QA. No se considera listo hasta cumplir los 7.
