---
name: voltop-art-direction-ui
description: Dirección de arte digital y UI para Voltop, con Visual QA y prevención activa de patrones genéricos de diseño generado por IA. Úsala al definir la dirección visual, componer pantallas o revisar cualquier UI. Cada decisión visual debe tener intención.
---

# Voltop — Art Direction & UI

**Principios y definición de "premium": `docs/MASTER-PROJECT-DEFINITION.md` §12–13.** Aquí solo lo operativo.

## Dirección

**"Infraestructura que cobra vida"** — Infraestructura **70%** (el mundo real: fotografía y video propios, base editorial-ingenieril, tratamiento técnico de los datos) + Corriente **30%** (energía y flujo expresados **sobre** el material real).

Dark-first, alto contraste, sin modo claro.

## Reglas con número

| Regla | Umbral |
|---|---|
| Acciones primarias con gradiente | **1 por vista** |
| Secciones consecutivas con la misma estructura | **0** |
| Placeholders de métrica visibles | **≤2 por página** |
| Medida de línea de texto corrido | **45–75 caracteres** |
| Valores visuales literales fuera de tokens | **0** |

**El gradiente es señal, no textura.** Prohibido en puntos decorativos, bullets, comillas, bordes y elementos repetidos por sección.

**El ritmo se construye variando estructura, no añadiendo efectos:** ancho de contenedor, número de columnas, sangrado, densidad tipográfica, relación texto/imagen, color de fondo. Combinar `width` × `space` de las primitivas (`components/ui/layout.tsx`) para que dos secciones vecinas nunca coincidan.

## Prohibiciones — requieren justificación explícita documentada

- Layouts SaaS predecibles (hero centrado + 3 cards + logos + CTA).
- Exceso de cards; "todo es una card".
- Pills y chips decorativos **sin función**.
- Border-radius por defecto en todo.
- Glows y sombras difusas gratuitas.
- Gradientes de relleno.
- Iconografía genérica de librería como decoración.
- **Constelaciones de nodos conectados / grafos abstractos de fondo.**
- Simetrías predecibles sin tensión — incluido el split a dos columnas repetido con la imagen alternando de lado.
- Placeholders anónimos que solo comunican ausencia.
- Animaciones ambientales en bucle.

## Fotografía y video

El material audiovisual es **material narrativo**, no galería ni reproductor. Por asset debe definirse: función narrativa · ubicación · versión desktop y móvil · autoplay o interacción · loop o completo · poster · recorte · compresión · lazy-load · fallback · impacto en performance · permisos de las personas que aparecen.

Todo asset se registra en `content/data/media.ts`, nunca como ruta suelta en un componente. Un hueco de media debe declarar **qué falta y qué función cumple**, para poder evaluar la composición sin el material definitivo.

Si un asset no sirve técnicamente para un uso, se propone la versión a producir. No se toman decisiones irreversibles sobre el formato original.

## Visual QA — la doble pregunta, obligatoria

1. **Restar:** ¿podemos quitar, combinar o hacer contextual algo? ¿Cada elemento justifica su existencia?
2. **Sumar:** ¿hay suficiente riqueza, carácter y diferenciación para que esto se sienta como Voltop y no vacío ni genérico?

Falla por sobrecargado **o** por vacío. Además:
- **Test del anonimato:** si al cambiar logo y color esto podría ser cualquier startup, no está listo.
- ¿La jerarquía conduce el ojo al objetivo de la página?
- ¿El vacío es una decisión compositiva o un resultado del padding uniforme?

## Definition of Done

- [ ] Ninguna prohibición presente sin justificación documentada.
- [ ] Cada bloque tiene intención declarada (jerarquía / marca / tarea).
- [ ] Doble pregunta superada en ambas direcciones.
- [ ] Ritmo de la página completa revisado; ninguna estructura repetida en secciones vecinas.
- [ ] Un solo gradiente primario por vista.
- [ ] Test del anonimato superado.
- [ ] Todo valor visual desde tokens.
- [ ] Media registrada en `content/data/media.ts` con función narrativa declarada.
- [ ] Contraste, alineación óptica, ritmo tipográfico y densidad revisados.
