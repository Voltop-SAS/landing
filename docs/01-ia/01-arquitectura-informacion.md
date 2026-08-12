# Fase 2 · Arquitectura de Información — Alternativas y evaluación de complejidad

> Principio rector: **menos, pero mejor** (ver `voltop-simplicidad-intencional`). Buscamos la arquitectura MÍNIMA que resuelva bien los journeys, no la más completa. Fecha: 2026-07-23.
>
> **Aclaración clave (simplicidad ≠ vacío):** "menos" aplica a **número de destinos, navegación y decisiones que carga el usuario** — NO a la riqueza de cada página. Cada destino es **denso en contenido y experiencia** (art direction, storytelling, foto/video, motion, profundidad), en la filosofía Apple: *complejidad detrás, simplicidad delante, riqueza en la experiencia*. Pocos destinos, cada uno excepcional y con contenido suficiente para explicar, generar confianza, demostrar infraestructura, mostrar la red, presentar soluciones y convertir. Reservamos **signature moments** (wow) para donde ayuden a contar la historia.

## Criterio de éxito (lo que el usuario debe entender en segundos)
1. Qué es Voltop · 2. Qué puede hacer aquí · 3. Dónde cargar · 4. Qué ofrece a empresas/espacios · 5. Por qué confiar · 6. Qué acción tomar.

Y resolver dos journeys: **B2C** (conductor → entender → explorar red → app/cargar) y **B2B** (empresa/flota/propietario/partner → entender → confiar → lead).

## Cómo mido la complejidad
Escala 1 (muy simple) – 5 (muy complejo), menor = mejor. Dimensiones: nº de destinos, ítems de navegación, plantillas/componentes, modelos de contenido, carga de mantenimiento, y **carga cognitiva del usuario**.

---

## Alternativa A — "Home + Mapa" (ultra-mínima)

**Destinos (2–3):** Home (narrativa completa con todo inline) · Red/Mapa · (Contacto contextual).
Todo —conductores, empresas, confianza— vive en la Home como secciones ancladas; el mapa es la única página-utilidad; los leads se capturan contextualmente. App = links externos.

| Dimensión | Score |
|---|---|
| Nº de destinos | 1 |
| Ítems de navegación | 1 |
| Plantillas/componentes | 2 |
| Modelos de contenido | 2 |
| Mantenimiento | 1 |
| Carga cognitiva usuario | 3 |
| **Total (menor = mejor)** | **10** |

- ✅ Máxima simplicidad; foco absoluto.
- ⚠️ **Riesgo real:** el B2B necesita profundidad para *convertir* (ROI, cómo funciona para un host, prueba). Comprimirlo en una sección de la Home puede subconvertir y diluir el objetivo de negocio (leads). La Home carga demasiado peso.

---

## Alternativa B — "Home + 3 pilares" (recomendada)

**Destinos (4):** **Home · Red · Voltop para empresas · Nosotros.**
Leads capturados **contextualmente** (formulario segmentado dentro de "Empresas" + CTA global en footer) → sin página "Contacto" separada. App = links externos. "Encontrar cargador" persistente.

**Cómo resuelve sin fragmentar:**
- **Home:** responde las 6 preguntas de un vistazo; dos caminos claros (Cargar / Para empresas); preview del mapa; franja de confianza; un CTA primario por audiencia.
- **Red:** el mapa **es el producto**. Detalle de estación por *progressive disclosure* (clic en pin → panel), NO páginas por estación. Doble intención: conductor (encontrar) + propietario (hospedar estación) en la misma página.
- **Voltop para empresas:** **una sola página B2B**. Empresas / flotas / propietarios / partners se resuelven con *progressive disclosure* (selector o secciones apiladas) compartiendo confianza y **un** formulario segmentado. Justificada por conversión (objetivo de negocio).
- **Nosotros:** quién es y por qué confiar — historia, fundador, **métricas de impacto**, casos como prueba inline (no páginas sueltas). Justificada por el objetivo #5 (confianza) y el posicionamiento de marca.

| Dimensión | Score |
|---|---|
| Nº de destinos | 2 |
| Ítems de navegación | 2 |
| Plantillas/componentes | 3 |
| Modelos de contenido | 3 |
| Mantenimiento | 2 |
| Carga cognitiva usuario | 2 |
| **Total (menor = mejor)** | **14** |

- ✅ Resuelve **ambos journeys con profundidad** sin fragmentar en 8+ páginas.
- ✅ Cada destino justifica su existencia por contenido, intención o conversión.
- ✅ Escala por datos (estaciones, casos) sin nuevas páginas.
- ⚠️ La página "Empresas" debe estar muy bien estructurada (progressive disclosure) para no volverse un cajón de sastre.

---

## Alternativa C — "Segmentada por público" (estándar del sector)

**Destinos (8–10):** Home · Conductores · Red/Mapa · Precios · Empresas · Flotas · Espacios · Partners · Nosotros · Casos · Contacto.

| Dimensión | Score |
|---|---|
| Nº de destinos | 5 |
| Ítems de navegación | 4 |
| Plantillas/componentes | 5 |
| Modelos de contenido | 4 |
| Mantenimiento | 5 |
| Carga cognitiva usuario | 4 |
| **Total (menor = mejor)** | **27** |

- ✅ Máxima granularidad; cada público su página.
- ❌ **Contradice el principio rector.** Fragmenta públicos que comparten el 80% del mensaje (empresas/flotas/propietarios/partners), multiplica mantenimiento y obliga al usuario a elegir su "carril" antes de entender la propuesta. Es el sitio "control remoto de 20 botones".

---

## Comparativa

| | A · Ultra-mínima | **B · 3 pilares (rec.)** | C · Segmentada |
|---|---|---|---|
| Complejidad total | **10** (más simple) | 14 | 27 (más compleja) |
| Resuelve B2C | ✅ | ✅ | ✅ |
| Resuelve B2B (conversión) | ⚠️ subconvierte | ✅ | ✅ (sobredimensionada) |
| Escala por datos | ✅ | ✅ | ⚠️ por páginas |
| Fiel al principio | ✅✅ | ✅ | ❌ |

## Recomendación

**Alternativa B (4 destinos).** Es la **menor complejidad que resuelve correctamente ambos journeys**. La A es más simple pero pone en riesgo la conversión B2B, que es objetivo de negocio; la única razón para "subir" de A a B es precisamente una **razón real de conversión** — el criterio que definiste. La C se descarta por contradecir el principio.

**Regla de disciplina para B:** empezamos con estos 4 destinos y **solo** dividimos algo (p. ej. separar "Flotas" o crear "Precios") si aparece una razón real de contenido/intención/conversión durante el diseño. La arquitectura puede *crecer por evidencia*, nunca por defecto.

## Navegación propuesta para B (mínima)

- **Barra:** `Red` · `Empresas` · `Nosotros` + **CTA primario contextual** (móvil: "Encontrar cargador" / la app).
- **Persistente:** acceso a "Encontrar cargador" y a la app.
- **Footer:** capa de confianza y profundidad (impacto, casos, legal, prensa/IR, ayuda, ES/EN).
- Progressive disclosure en toda la nav: nada de megamenús.

## Cómo B cumple el criterio de éxito (chequeo)
1. Qué es Voltop → Home (hero + narrativa). 2. Qué hacer aquí → dos caminos en Home. 3. Dónde cargar → Red/Mapa. 4. Oferta a empresas → Voltop para empresas. 5. Por qué confiar → franja en Home + Nosotros (impacto/casos). 6. Qué acción → CTA por audiencia (app / lead).

## Decisión pendiente 🔶
- ¿Confirmas **Alternativa B** como arquitectura base?
- Ajustes de nombres de nav (¿"Red" vs "Estaciones" vs "Cargar"? ¿"Empresas" vs "Para tu negocio"?).
- ¿Blog/editorial? → recomendación: **NO ahora** (se puede añadir por datos sin rediseño).
- ¿Bilingüe ES/EN en el rediseño? (confirmar).
- Métricas de impacto reales para Nosotros (pendientes de tu envío).
