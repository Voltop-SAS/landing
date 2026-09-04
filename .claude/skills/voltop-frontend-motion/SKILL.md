---
name: voltop-frontend-motion
description: Arquitectura front-end, interaction design y motion para Voltop. Úsala al construir componentes, implementar scroll interactions/microinteracciones o instrumentar analytics. El movimiento es parte del design system, no decoración.
---

# Voltop — Front-end & Motion

**Referencia normativa: `docs/MASTER-PROJECT-DEFINITION.md` §21 (motion), §26 (arquitectura técnica), §31 (medición).**

## Arquitectura front-end

```
components/ui/        primitivas del sistema, agnósticas de contenido
components/layout/    chrome del sitio
components/<destino>/ composición por destino
content/copy/         todo el texto
content/data/         todas las colecciones
lib/data/             acceso a datos (los componentes no van más allá)
lib/analytics/        capa de tracking desacoplada
lib/i18n/             idioma y rutas localizadas
```

Reglas no negociables:
1. **Server Components por defecto.** Las islas de cliente se limitan a lo que tiene interacción real.
2. **Los componentes nunca importan `content/data/*`**: siempre vía `lib/data`.
3. **Cero copy literal en el JSX.**
4. **Navegación interna con `next/link`**; imágenes con `next/image`.
5. Nada debe cerrar ninguno de los tres caminos de producción.

## Motion — la energía es respuesta, no ambiente

El movimiento ocurre **cuando el usuario hace algo**: seleccionar una estación, aplicar un filtro, enviar el formulario, navegar entre páginas. **Se eliminan las animaciones ambientales en bucle** — no aportan información, consumen atención y compiten con el contenido.

Jerarquía:
1. **Signature moments** — 2–3 en todo el sitio, no más.
2. **Motion funcional** — reveals al entrar en viewport, transición de estados, feedback de formulario, transición entre páginas.
3. **Microinteracciones** — hover, focus, press, loading.

Reglas duras:
- Solo `transform` y `opacity`.
- Duraciones y easings desde tokens.
- **Nunca ligar la opacidad de contenido a `scrollYProgress`.** Una interpolación de scroll puede devolver el valor a 0 al salir del rango y dejar el contenido invisible. El material puede scrubbearse; el texto se revela una vez y permanece.
- `prefers-reduced-motion` con **alternativa equivalente**, verificada: cero elementos invisibles en ambos modos.
- Un motor de scroll a la vez: Lenis o el nativo, nunca los dos.
- Cada animación justifica su coste en rendimiento y atención. Si no aporta, no va.

## Interacción

- Feedback en todos los estados: hover, focus, active, loading, error, éxito, vacío.
- Los controles interactivos **funcionan**: un chip que parece filtro filtra. Nada decorativo que simule interacción.
- Overlays: Escape, foco atrapado, scroll bloqueado (Lenis incluido).
- Gestos y touch diseñados para móvil, no portados del desktop.

## Analytics

Implementar el plan de medición de `lib/analytics` con nombres de evento **tipados y estables**. Cubrir: CTAs (con contexto y ubicación), búsqueda y filtros, vista de estación, cómo llegar, descargas de app, selector B2B, y el ciclo completo del formulario (inicio, error, envío, éxito) con el segmento como propiedad.

La plataforma de destino está sin definir: solo se implementa `dispatch`. Ningún componente conoce el proveedor.

## Definition of Done

- [ ] Componente tipado, reutilizable y basado en tokens.
- [ ] Server Component salvo justificación.
- [ ] Todos los estados interactivos implementados y con feedback.
- [ ] Ningún control decorativo que simule interacción.
- [ ] Motion justificado, desde tokens, solo `transform`/`opacity`.
- [ ] Ninguna opacidad de contenido ligada al progreso de scroll.
- [ ] `prefers-reduced-motion` verificado en ambos modos.
- [ ] Eventos del plan de medición emitidos.
- [ ] Contenido desde colecciones y copy desde `content/copy`.
