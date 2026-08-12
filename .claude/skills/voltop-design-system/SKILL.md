---
name: voltop-design-system
description: Design System de Voltop — tokens, componentes, reglas responsive y formularios escalables listos para CRM. Úsala al definir o modificar tokens, crear componentes reutilizables o establecer reglas de consistencia y escalabilidad.
---

# Voltop — Design System

## Responsabilidad
Mantener el sistema que hace todo consistente y escalable: design tokens, componentes reutilizables, reglas responsive y el modelo de formularios. El sistema EMERGE de resolver la Home real; no se define en abstracto.

## Design tokens (fuente única de verdad)
- Color, tipografía, escala tipográfica fluida, spacing, radios, sombras, z-index, breakpoints, duraciones y easings de motion.
- Exportables como specs para Elementor y reutilizables en headless/CMS ligero (no cerrar caminos de producción).

## Componentes
- Cada componente: propósito, variantes, estados (default, hover, focus, active, loading, disabled, error, empty), reglas responsive y specs de motion.
- Construidos sobre primitivas accesibles; vestidos con tokens de marca.
- Sin "excepciones sueltas": si algo se repite, es un componente o un token.

## Responsive (reglas del sistema)
- Mobile-first; composiciones pensadas por dispositivo (desktop / laptop / tablet / mobile), no escaladas.
- Tipografía fluida (clamp), spacing responsivo, touch targets accesibles.
- Reglas claras de reorganización de contenido por breakpoint.

## Formularios (escalables y listos para CRM)
- Componentes reutilizables y componibles (campo, grupo, validación, estados, éxito/error).
- Segmentables por audiencia (B2C / B2B / partner).
- Preparados para integraciones futuras con CRM/automatizaciones: nombres de campo estables, mapeo de datos, capa de envío desacoplada.
- Instrumentados para el measurement plan (inicio, error, envío, éxito).
- Accesibles: labels, descripciones, errores asociados, foco gestionado.

## Contenido escalable
- Estaciones, soluciones, flotas, partners, casos: modelados como colecciones de datos, separados del diseño. Añadir un registro no debe requerir rediseño.

## Checklist (Definition of Done)
- [ ] Todo valor visual proviene de un token; sin literales sueltos.
- [ ] Componente con todas sus variantes y estados definidos.
- [ ] Reglas responsive explícitas por breakpoint (no solo "se encoge").
- [ ] Formularios reutilizables, segmentables y listos para CRM.
- [ ] Formularios e interacciones clave instrumentados para analytics.
- [ ] Colecciones de contenido modeladas como datos, escalables.
- [ ] Tokens exportables a los 3 caminos de producción.
