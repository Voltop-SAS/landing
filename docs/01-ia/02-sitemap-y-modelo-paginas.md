# Fase 2 · IA — Sitemap definitivo v1 y modelo de páginas

> Arquitectura contenida, experiencia rica. Principio: complejidad detrás, simplicidad delante, riqueza en la experiencia. Fecha: 2026-07-23.
> Sin UI ni código: esto define **qué** contiene cada destino y **cómo** se revela, no cómo se ve.

## 1. Sitemap definitivo v1

**4 destinos. 3 puertas de navegación + Home (logo).**

```
HOME  (acceso por logo)
│
├── RED           ← puerta B2C (encontrar/cargar) · doble intención: hospedar estación
├── EMPRESAS      ← hub B2B (empresas · flotas · propietarios · partners) vía progressive disclosure
└── NOSOTROS      ← capa transversal de marca, confianza y credibilidad

GLOBAL (no son destinos de nav):
· Header: logo + Red/Empresas/Nosotros + 1 CTA contextual + selector ES/EN
· Footer (capa de profundidad): resumen de impacto · app (iOS/Android) · partners ·
  inversionistas/prensa · ayuda · legal (términos, privacidad) · ES/EN · social
· Vistas data-driven deep-linkables: /red/estacion/[slug] (renderizada como panel, no página aparte)
```

**Regla de disciplina:** no se crean destinos para Flotas, Propietarios, Partners, App o Inversionistas. Viven **dentro** de un destino (progressive disclosure) o en el footer. Solo se "gradúa" algo a página propia si aparece una razón fuerte de UX o conversión durante el diseño — nunca por defecto.

## 2. Modelo de páginas (arquitectura de contenido por destino)

> El orden refleja **ritmo visual** (impacto → respiración → información → interacción → respiración → conversión), no diseño. "Impacto" marca posibles signature moments.

### HOME — entender Voltop en segundos + repartir a cada journey
1. **Hero** *(impacto / signature)* — qué es Voltop (infraestructura + tecnología) + acción B2C global (Encontrar cargador).
2. **Dos caminos** *(respiración)* — Cargar (B2C) / Para empresas (B2B), segmentación suave, no forzada.
3. **La Red** *(información / interacción)* — teaser de mapa + escala (métricas placeholder) → Red.
4. **Cómo funciona** *(información)* — 3 pasos B2C, breve.
5. **Para empresas** *(información)* — teaser de valor B2B → Empresas.
6. **Confianza** *(impacto suave)* — impacto (placeholders XX) + logos de partners + testimonios.
7. **Marca / visión** *(respiración editorial)* — voz del fundador → Nosotros.
8. **Cierre / conversión** — CTA contextual.

Cubre las 6 preguntas clave: qué es · qué hacer · dónde cargar · oferta a empresas · por qué confiar · qué acción.

### RED — "el mapa es el producto" (puerta B2C + doble intención)
1. **Intro de la red** *(impacto)* — escala y cobertura (placeholders XX).
2. **Mapa** *(interacción, núcleo)* — buscar + filtros mínimos por defecto (ciudad, conector, disponibilidad, potencia); filtros avanzados por progressive disclosure.
3. **Estación [detalle]** — panel/drawer al seleccionar pin (deep-linkable `/red/estacion/[slug]`); **colección escalable**, no página hecha a mano.
4. **Cómo cargar** *(información)* — onboarding conductor, 3 pasos, contextual.
5. **¿Tienes un espacio?** *(handoff)* — entrada "hospedar estación" que deriva al contexto B2B (propietarios) sin duplicar contenido.
6. **App** — CTA contextual de descarga dentro del journey del conductor.

### EMPRESAS — hub B2B en una sola página (progressive disclosure)
1. **Hero B2B** *(impacto)* — valor para negocio: infraestructura confiable, tecnología, end-to-end.
2. **Selector de caso** *(interacción)* — "¿Qué describe mejor tu caso?": Empresa · Flota · Espacio comercial · Partner. Elegir **revela** contenido a medida (beneficios, cómo funciona, prueba) sin navegar a otra página.
3. **Capacidades / cómo funciona** *(información)* — compartido entre segmentos.
4. **Prueba** *(impacto suave)* — casos de éxito + logos + impacto (placeholders XX).
5. **Conversión** *(acción primaria)* — formulario segmentado (prellenado por el selector), CRM-ready. CTA contextual pasa a conversión comercial.

### NOSOTROS — marca, confianza, credibilidad (transversal)
1. **Visión / posicionamiento** *(impacto)* — infraestructura + tecnología para la movilidad eléctrica de Colombia.
2. **Historia / misión** *(editorial)*.
3. **Impacto / escala** *(impacto / signature de datos)* — métricas placeholder XX (nunca inventadas).
4. **Infraestructura** *(información)* — demostrar la red física y su calidad.
5. **Fundador / equipo** *(confianza)*.
6. **Partners / respaldo** *(confianza)*.
7. **Visión futura / cierre** — CTA contextual (según intención: app o lead).

## 3. Lógica de progressive disclosure (resumen)

| Dónde | Qué se muestra primero | Qué se revela y cuándo |
|---|---|---|
| Navegación | 3 puertas + 1 CTA | Profundidad al entrar a cada destino; sin megamenús |
| Empresas | Selector de caso | Contenido a medida por segmento al elegir; 1 form segmentado |
| Red | Mapa + filtros mínimos | Filtros avanzados y detalle de estación (panel) bajo demanda |
| Footer | Enlaces de profundidad | App, inversionistas/prensa, legal, ayuda (fuera del nav) |
| Impacto | Resumen en Home | Detalle en Nosotros |

**Principio:** pocas puertas de entrada, mucha capacidad detrás. El usuario toma el menor número de decisiones; la riqueza vive en la ejecución de cada destino, no en más destinos.

## 4. Qué NO existe (decisiones de simplicidad)
- Sin páginas separadas de Flotas / Propietarios / Partners / Inversionistas / App / Precios / Contacto / Casos.
- Sin blog/editorial por ahora (se añade por datos, sin rediseño, si el negocio lo pide).
- Sin megamenús ni doble CTA global permanente.
