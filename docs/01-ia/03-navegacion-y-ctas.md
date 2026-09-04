# Fase 2 · IA — Navegación (desktop + móvil), jerarquía de CTAs y evaluación de labels

> Header extremadamente limpio y premium. Un solo CTA global, contextual. Bilingüe ES/EN. Fecha: 2026-07-23.

## 1. Navegación desktop

```
┌──────────────────────────────────────────────────────────────────────┐
│  [logo Voltop]            Red   Empresas   Nosotros        [CTA]  ES/EN │
└──────────────────────────────────────────────────────────────────────┘
```
- **Logo** → Home (Home no ocupa un ítem de nav).
- **3 ítems:** Red · Empresas · Nosotros. Sin megamenús; la profundidad se revela dentro de cada destino.
- **1 CTA contextual** (ver §3), no dos compitiendo.
- **Selector ES/EN** discreto.
- Comportamiento: header se condensa al hacer scroll (más aire, se mantiene el CTA). Sin dropdowns pesados.

## 2. Navegación móvil

```
┌───────────────────────────────┐        Menú (overlay):
│ [logo]              [☰]  ES/EN │   →    · Red
└───────────────────────────────┘        · Empresas
   (CTA contextual accesible)             · Nosotros
                                          · [CTA contextual]
                                          · ES / EN
```
- Header mínimo: logo + menú + selector idioma.
- Overlay a pantalla completa con los 3 destinos + CTA + idioma; tipografía grande, jerarquía clara.
- **Touch targets ≥ 44px**, alcanzables con el pulgar.
- **Acción B2C accesible:** en Red (mapa), el "Encontrar cargador" / buscar puede vivir en una barra/bottom-sheet inferior para uso a una mano. Fuera de Red, el CTA vive en el header/menú.
- Sin duplicar navegación; el footer sigue siendo la capa de profundidad.

## 3. Jerarquía de CTAs (un CTA global, contextual)

**Regla:** nunca dos CTAs globales permanentes compitiendo. El slot de CTA del header es **uno** y cambia según contexto, manteniendo consistencia visual.

| Nivel | Acción | Dónde aparece |
|---|---|---|
| **Global B2C (default)** | **Encontrar cargador** → Red/mapa | Header en Home, Red, Nosotros (contexto B2C/marca) |
| **Global B2B (contextual)** | **Conversión comercial** (p. ej. "Hablar con el equipo" / "Solicitar propuesta") | Header al entrar a Empresas; reemplaza al CTA B2C en ese contexto |
| **Secundario B2C** | **Descargar app** | Contextual dentro del journey del conductor (Red, "cómo cargar") y footer — **no** en el header global |
| **Terciario** | Enlaces de footer, ES/EN | Global, sin peso visual |

**Hipótesis validada (tuya):** "Encontrar cargador" = acción B2C global; "Descargar app" = contextual en el journey del conductor. ✅ Adoptada. En B2B el CTA muta a conversión comercial sin romper la consistencia (mismo slot, misma jerarquía visual).

Pendiente de A/B a futuro: si en Home conviene que el CTA global sea "Encontrar cargador" o un CTA de marca más neutro. Lo dejamos como hipótesis medible en el measurement plan.

## 4. Evaluación de labels (UX Writing) — validación pedida

Los nombres son **v1**; recomendación con criterio de claridad + posicionamiento, para cerrar en Creative/UX Writing.

| Label v1 | Claridad | Riesgo | Recomendación | EN |
|---|---|---|---|---|
| **Red** | Media-alta | Puede leerse ambiguo fuera de contexto; algo redundante con el CTA "Encontrar cargador" | **Mantener "Red"**: refuerza el posicionamiento de *infraestructura/escala* (no "app"). La acción concreta la lleva el CTA. Alternativas si priorizamos claridad pura: "Estaciones" o "Cargar". | **Network** (alt: Charging) |
| **Empresas** | Alta | Puede sentirse excluyente para un *propietario de espacio* (hotel/retail) que no se ve como "empresa" | **Mantener "Empresas"** como v1 (concreto, premium). Validar contra "Para empresas" / "Negocios". Evitar "Soluciones" (genérico/SaaS). El selector interno resuelve la inclusión de flotas/propietarios/partners. | **Business** |
| **Nosotros** | Alta | Neutro | **Mantener "Nosotros"** (humano) o "Compañía" si buscamos más gravitas institucional. | **Company** (alt: About) |

Decisión: se usan Red · Empresas · Nosotros como v1 operativos; validación final de wording en Creative Direction / UX Writing antes de considerarlos definitivos.

## 5. Consistencia bilingüe (ES/EN)
- Nav, CTAs y labels se modelan como **claves de contenido** con valor ES y EN desde el inicio.
- El diseño reserva espacio para longitudes distintas (EN suele ser más corto; algunos términos más largos) → tipografía y layout tolerantes a variación.
- Se diseña y escribe primero en ES; EN soportado por arquitectura, componentes, responsive y modelo de contenido desde el día 1.
