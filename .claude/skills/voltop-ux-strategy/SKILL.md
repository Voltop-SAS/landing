---
name: voltop-ux-strategy
description: UX Strategy, Information Architecture, Navigation y CRO para Voltop. Define journeys B2C/B2B, jerarquía, CTAs, funnels medibles y el plan de analytics. Úsala siempre que una decisión afecte conversión o estructura del sitio.
---

# Voltop — UX Strategy & IA

**Referencia normativa: `docs/MASTER-PROJECT-DEFINITION.md` §4–10 (objetivos, públicos, journeys), §14–17 (IA, navegación, conversión).** Aquí solo el criterio operativo.

## Regla de arquitectura

Buscar la arquitectura **mínima** que resuelva bien los journeys — pero **simplicidad ≠ vacío**. Toda propuesta de IA incluye evaluación de complejidad y recomienda la de menor complejidad que resuelva los journeys.

No fragmentar públicos en páginas salvo razón real de contenido, intención o conversión. Una página puede atender varias necesidades vía progressive disclosure.

## Los principios que más veces se han incumplido

1. **La Home presenta · las internas profundizan.** Corolario verificable: **ninguna página interna puede tener menos contenido o valor que la preview de la Home que apunta a ella.** Medirlo: si al hacer clic el usuario recibe menos de lo prometido, la interna está incompleta.
2. **Confianza antes de pedir el dato.** En B2B la evidencia (capacidades, caso real, prueba) precede **siempre** al formulario. Nunca al lado, nunca antes.
3. **Un titular es un contrato.** No prometer capacidades que el producto no tiene. Si no hay disponibilidad en tiempo real, ningún titular dice "en tiempo real".
4. **Un solo CTA global, contextual por ruta** — y **ausente** donde sería redundante (no hay CTA "Encontrar cargador" dentro de la herramienta de búsqueda).
5. **Ningún control decorativo.** Si parece un filtro, filtra.
6. **Ningún enlace sin destino real.** Un `href="#"` no se publica.
7. **Nunca inventar cifras.** Máximo dos placeholders de métrica visibles por página; es preferible mostrar menos métricas bien elegidas que rellenar huecos.

## Journeys

- **B2C:** entender → explorar la red → estación → cargar / descargar app. De la intención a la herramienta en un clic; detalle bajo demanda.
- **B2B:** entender → elegir caso → ver evidencia → lead segmentado. Dos entradas: explícita desde Home y handoff desde Red ("¿tienes un espacio?").
- **Institucional:** credibilidad que alimenta a los otros dos, sin conversión dura.

El usuario nunca elige su carril antes de entender la propuesta: segmentación suave, no bifurcación forzada. Al final del recorrido, elegir sí es lo que toca.

## CRO

Cada plantilla define: objetivo primario, objetivo secundario, CTA principal, fricciones esperadas. Funnels medibles y separados por audiencia. Prueba social y datos de impacto ubicados con intención, no como relleno. Formularios con mínima fricción y segmento prellenado.

## Measurement plan

Se define **antes** de construir. Cada evento: nombre · disparador · propiedades · funnel. Implementación en `lib/analytics`.

Funnels principales:
- **B2C:** Home → CTA → búsqueda/filtro → estación → cómo llegar / app.
- **B2B:** Empresas → selector de caso → inicio de formulario → éxito (segmentado).

## Definition of Done

- [ ] Cada página tiene público, objetivo primario y métrica.
- [ ] Journeys trazados end-to-end sin callejones sin salida.
- [ ] Ninguna interna aporta menos que su preview.
- [ ] Evidencia antes del formulario en B2B.
- [ ] Ningún titular promete lo que el producto no hace.
- [ ] CTAs coherentes por audiencia; no compiten; ausentes donde son redundantes.
- [ ] Cero enlaces sin destino y cero controles decorativos.
- [ ] Funnels y eventos definidos e implementados.
- [ ] Evaluación de complejidad hecha; arquitectura mínima que resuelve los journeys.
- [ ] Decisiones registradas con su **por qué**, no solo el qué.
