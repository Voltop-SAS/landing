---
name: voltop-frontend-motion
description: Arquitectura front-end, interaction design y motion para Voltop. Úsala al construir componentes, implementar scroll interactions/microinteracciones, instrumentar analytics o adaptar motion por dispositivo. El movimiento es parte del design system, no decoración.
---

# Voltop — Front-end & Motion

## Responsabilidad
Convertir el diseño en una experiencia viva a 60fps, con motion e interacciones que refuerzan conceptos y tareas, código componentizado listo para producción/headless, e instrumentación de analytics.

## Arquitectura front-end
- Componentes limpios, tipados y reutilizables; el prototipo se construye como si fuera producción.
- Contenido separado del diseño (colecciones como datos).
- Estructura que no cierra ninguno de los 3 caminos de producción.

## Motion como sistema (no decorativo)
- Refuerza: energía, flujo, conexión, infraestructura, velocidad, precisión, movilidad.
- Usa los tokens de motion (duraciones/easings) del Design System.
- Momentos-firma acotados (hero, mapa vivo, transiciones clave); base sobria y rápida.
- Cada animación justifica su costo (rendimiento y atención). Si no aporta, no va.

## Interacción y microinteracciones
- Feedback claro en todos los estados (hover, focus, active, loading, error, success).
- Gestos y touch en móvil diseñados para móvil, no portados del desktop.

## Responsive (implementación)
- Composiciones por dispositivo; motion adaptado o simplificado en gama baja.
- `prefers-reduced-motion` respetado con alternativas equivalentes.
- Imágenes y video responsivos; orientación cuando aplique.

## Analytics (instrumentación)
- Implementar el measurement plan de UX Strategy: eventos de CTAs, formularios, descargas, interacción con ubicaciones y funnels.
- Capa de tracking desacoplada y estable (nombres de eventos consistentes).

## Performance (regla dura)
- Animar solo `transform`/`opacity`; evitar layout thrashing.
- Lazy-load de 3D/video/pesados; imágenes AVIF/WebP.
- Cumplir el performance budget (ver Quality & Compliance).

## Checklist (Definition of Done)
- [ ] Componente reutilizable, tipado y basado en tokens.
- [ ] Motion justificado, con tokens y momentos-firma acotados.
- [ ] Todos los estados interactivos implementados.
- [ ] Responsive por dispositivo; motion adaptado a gama baja.
- [ ] `prefers-reduced-motion` con alternativa equivalente.
- [ ] Analytics instrumentado según measurement plan.
- [ ] Solo se animan propiedades baratas; sin jank perceptible.
- [ ] Contenido desde colecciones de datos, no hardcodeado.
