---
name: voltop-review-gate
description: Gate de calidad de Voltop. Orquesta la revisión secuencial UX → UI → Responsive → Accessibility → Motion → Performance → QA antes de considerar terminado cualquier componente o página. Úsala siempre antes de marcar algo como "listo".
---

# Voltop — Review Gate (Definition of Done)

## Responsabilidad
Ningún componente o página se considera terminado hasta pasar, en orden, los 7 checkpoints. Coordina Design QA, Responsive QA y Code Review. Si un checkpoint falla, se devuelve a la skill responsable antes de continuar.

## Secuencia obligatoria
1. **UX** → `voltop-ux-strategy`: objetivo claro, journey sin fricción, CTA correcto, medible, arquitectura mínima pero con contenido suficiente (no vacío).
2. **UI** → `voltop-art-direction-ui`: intención en cada decisión, sin patrones genéricos, doble criterio (nada sobra Y hay riqueza/carácter), signature moments justificados, **ritmo de página deliberado** (secciones no compiten), Visual QA superado.
3. **Responsive** → `voltop-design-system` + `voltop-frontend-motion`: composición por dispositivo, no escalado; touch OK.
4. **Accessibility** → `voltop-quality-compliance`: WCAG 2.1 AA.
5. **Motion** → `voltop-frontend-motion`: motion con propósito, tokens, `prefers-reduced-motion`.
6. **Performance** → `voltop-quality-compliance`: performance budget, incl. gama baja.
7. **QA (final)** → integración, contenido/placeholder marcado, analytics instrumentado, code review.

## Doble criterio en UX y UI (obligatorio)
En los checkpoints de UX y UI no basta preguntar "¿podemos quitar algo?". Preguntar SIEMPRE también: "¿hay suficiente riqueza, carácter y diferenciación para que esto se sienta como Voltop —premium, tecnológico— y no vacío?". Un componente puede fallar el gate por sobrecargado O por vacío/genérico. Lema: complejidad detrás, simplicidad delante, riqueza en la experiencia.

## Ritmo visual a nivel de página (obligatorio en UI)
Además de revisar cada sección, revisar el **ritmo de la página completa**: jerarquía deliberada de intensidad (impacto → respiración → información → interacción → respiración → impacto/conversión). No todo puede ser signature moment. Falla el gate si todas las secciones compiten visualmente o si los momentos wow no contrastan con secciones más silenciosas/editoriales/funcionales.

## Reglas
- Orden estricto: no se avanza con un checkpoint abierto.
- Cada checkpoint usa la checklist de su skill.
- Registrar resultado (pass/fail + notas) por componente.
- QA final confirma: analytics presente, placeholders marcados, assets-todo actualizado, sin regresiones.

## Salida
Veredicto por componente: LISTO / DEVUELTO (con checkpoint y motivo).

## Checklist maestra
- [ ] UX aprobado
- [ ] UI / Visual QA aprobado (sin patrones genéricos, ni vacío)
- [ ] Ritmo de página aprobado (intensidad deliberada, secciones no compiten)
- [ ] Responsive por dispositivo aprobado
- [ ] Accessibility (WCAG 2.1 AA) aprobado
- [ ] Motion con propósito aprobado
- [ ] Performance budget aprobado (incl. gama baja)
- [ ] QA final aprobado (analytics, placeholders, code review)
