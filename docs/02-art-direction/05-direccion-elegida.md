# Fase 3 · Dirección elegida — "Infraestructura que cobra vida" (Infra + Corriente)

> Híbrido: base editorial-ingenieril + signature moments energéticos. Foto/video parcial → base con foto real donde exista, render/gráficos para el wow, placeholders marcados donde falte. Color a alinear con assets de marca. Fecha: 2026-07-23.

## Concepto rector
**Voltop es infraestructura precisa que cobra vida con energía.** El rigor (grid, datos, fotografía real, legibilidad) transmite confianza y escala; la energía (luz, corriente, motion kinético) aparece en pocos momentos narrativos para emocionar y decir "tecnología viva". La tensión entre lo **estructural** (quieto, editorial) y lo **energético** (luminoso, en flujo) es el alma y también el **ritmo** de cada página.

## Principios visuales
1. **Estructura visible, energía puntual.** El grid y la precisión son el default; la energía es el acento reservado.
2. **Dos registros, un sistema.** *Silencio* (editorial, claro, informativo) ↔ *Impacto* (energético, oscuro, luminoso). El ritmo alterna ambos.
3. **El dato es protagonista.** Números tratados con cuidado quirúrgico = prueba de infraestructura.
4. **Luz como energía, no como decoración.** Nada de glows/gradientes gratuitos; la luz *emite* con intención.
5. **Realidad + abstracción.** Fotografía honesta de la red (arquitectura real) + gráficos propios de corriente/nodos.
6. **Premium por detalle, no por cantidad.** Riqueza en tipografía, composición, grano, timing — no en más elementos.

## Moodboard descrito (alineado a marca — Voltop es dark-first)
> Actualizado con la guideline real (`Buttons.png`): Voltop es **dark-first** y su acento es un **gradiente eléctrico verde→cian** (la "Corriente"). Ver `03-design-system/00-fundamentos-marca-extraidos.md`.
- **Color — sistema de dos registros (ambos en dark):**
  - *Silencio (base):* dark estructural y calmado — canvas navy muy oscuro (~`#0A0F1C`) + superficies grafito/acero, **sin gradiente**. Para contenido, datos y utilidad. Legible y sobrio ("infraestructura").
  - *Impacto (energía):* el mismo dark donde la **corriente verde→cian** (~`#45E0A8 → #28C6E6`) emite. Reservado a signature moments y al CTA primario, con disciplina (la energía brilla porque es escasa).
  - El **gradiente de marca** es el puente entre ambos registros = literalmente la corriente.
  - *Pendiente:* si la utilidad Red/mapa requiere un **modo claro** por legibilidad diurna, o se resuelve con dark de alto contraste.
- **Tipografía:** pareja funcional — una **sans editorial/técnica** para titulares y cuerpo (carácter contemporáneo, buena en ES y EN) + tratamiento **tabular/monospace-técnico** para datos y specs de estación (kW, conectores, cifras). Contrastes de escala fuertes; espacio para motion tipográfico en el hero.
- **Retícula/composición:** grid preciso (12 col) con **líneas de estructura** como motivo; márgenes generosos; densidad informativa controlada. Ritmo editorial: titular → cuerpo → dato → respiración.
- **Imagen:** fotografía diurna y precisa de estaciones como **arquitectura** (base); render/gráficos energéticos para hero/red/impacto; personas/lugar en contexto (calidez medida, sin "lifestyle"). Donde falte, placeholder marcado + registro en assets-todo.
- **Gráficos propios (motif system):** **corriente** (líneas de flujo), **nodos de red** (estaciones), **grid estructural** y **data-viz** de cobertura/impacto — todo derivado de la marca, cero iconografía de librería como decoración.
- **Luz/textura:** luz natural en base; luz emisiva en energía; grano fino para evitar el look plano/"generado por IA".

## Sistema de motion
- **Dos registros de movimiento:**
  - *Silencio:* micro-motion preciso, reveals estructurados (líneas/planos que se dibujan), hovers y estados nítidos. Duraciones cortas, easing ease-out.
  - *Impacto (energía):* corriente en flujo, campos/partículas, secuencias coreografiadas. Duraciones más largas y easing "de corriente". **Solo en signature moments.**
- **Principios:** el motion refuerza energía · flujo · conexión · precisión · velocidad · movilidad. Explica o emociona con propósito; nunca decorativo.
- **Tokens conceptuales (valores finales en Design System, Fase 4):** duraciones xfast ~120ms · fast ~200ms · base ~300ms · slow ~500ms · cinematic ~800ms+. Easing UI estándar (ease-out) + un easing "current" propio para energía.
- **Reglas duras:** solo `transform`/`opacity`; `prefers-reduced-motion` → reemplazar flujo por estado final estático/fade; móvil y gama baja → simplificar (menos partículas, secuencias más cortas, loops ambientales apagados); performance-budget siempre.

## Cómo expresa el ritmo visual
El sistema **es** el ritmo: secciones en registro *Silencio* (información, editorial, funcional) enmarcan los pocos momentos en registro *Impacto* (hero, visualización de la red, impacto). Así el wow contrasta y no compite.

## Signature moments del sitio (3, priorizados)
1. **Hero** — definido en detalle en `06-signature-moment-hero.md`.
2. **La red que cobra vida** — mapa de Colombia con corriente fluyendo entre estaciones (a definir en Fase 4/5).
3. **Impacto que se "carga"** — métricas (placeholders XX) que se energizan (a definir).

## Cómo sirve el objetivo
- **B2B/inversionistas:** el registro *Silencio* (rigor, datos, foto real) da credibilidad y escala.
- **B2C:** los momentos *Impacto* dan emoción y modernidad; el conductor siente una red viva y confiable.
- **Marca:** "infraestructura que cobra vida" posiciona Voltop como infra + tecnología, no como app.
