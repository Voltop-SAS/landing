---
name: voltop-design-system
description: Design System de Voltop — tokens, componentes, responsive, modelo de contenido/datos, i18n y formularios listos para CRM. Úsala al definir o modificar tokens, crear componentes reutilizables o modelar contenido escalable.
---

# Voltop — Design System

**Referencia normativa: `docs/MASTER-PROJECT-DEFINITION.md` §24 (sistema), §27 (datos), §28 (i18n).**

## Regla base

El sistema **emerge** de resolver pantallas reales. Pero una vez definido: **ningún valor visual puede ser literal suelto.** Si algo se repite, es un componente o un token.

## Tokens — fuente única en `app/globals.css` (`@theme`)

| Grupo | Estado |
|---|---|
| Color: canvas, superficies, tinta, marca, líneas, foco, semánticos (`live`/`warn`/`idle`) | Definido |
| Escala tipográfica **fluida con `clamp()`** — 9 pasos con interlineado y tracking | Definido |
| Escala de espaciado de sección: `tight` / `base` / `loose` | Definido |
| Contenedores: `narrow` / `content` / `wide` | Definido |
| Radios duales: `pill` (acción, energía) / `structural` (dato, estructura) | Definido |
| Duraciones y easings de motion · z-index | Definido |

**Prohibido:** tamaños tipográficos ad-hoc por componente, paddings de sección escritos a mano, colores hex en el JSX.

**Todo token de texto debe cumplir ≥4.5:1** sobre canvas, surface-1, surface-2 y surface-3. Verificar al cambiar cualquier color, no asumir.

Los tokens deben ser exportables como specs a los tres caminos de producción; no cerrar ninguno.

## Componentes

Cada componente documenta: propósito · variantes · estados (default, hover, focus, active, loading, disabled, error, empty) · reglas responsive · specs de motion.

- **Server Component por defecto.** `"use client"` solo con estado, evento o API de navegador.
- Altura mínima de cualquier control interactivo: **44px**.
- Navegación interna: **siempre `next/link`**. Imágenes: **siempre `next/image`**.

## Responsive — cuatro contextos diseñados, no escalados

| Contexto | Rango | Criterio |
|---|---|---|
| Desktop | ≥1440px | Composición completa; el contenedor no se pega a los bordes |
| Laptop | 1024–1439px | Composición completa, densidad ajustada |
| Tablet | 640–1023px | **Composición propia.** Ni desktop encogido ni móvil estirado. Línea de 45–75 caracteres |
| Móvil | <640px | Mobile-first real; uso a una mano |

Tipografía fluida obligatoria. `dvh` en lugar de `vh`. Los gráficos de fondo se adaptan o se ocultan por contexto: **nunca se superponen al contenido**.

## Contenido y datos

- Todo lo que crece es **colección**: estaciones, ciudades, casos, partners, testimonios, segmentos. Añadir un registro = un registro, cero rediseño.
- Los componentes **no importan `content/data/*`**: acceden vía `lib/data`. Es lo que permite cambiar a CMS o API sin tocar la presentación.
- Todo dato no confirmado se modela como `null` con un flag de trazabilidad (`validated`, `dataStatus`). **Nunca se inventa un valor.**
- Los assets de media viven en `content/data/media.ts`; `src: null` significa confirmado pero no entregado.

## i18n

- Todo texto es `Localized = { es, en }` con **ambos idiomas obligatorios**: si `en` fuese opcional, el inglés caería al español sin dejar rastro.
- Lo que no se traduce (nombres propios, unidades) se modela como string plano.
- **Ningún componente contiene copy literal.** Todo desde `content/copy/*`.
- El idioma vive en la URL, no en estado de cliente.
- El layout tolera longitudes distintas entre idiomas.

## Formularios

- Componibles: campo, grupo, validación, estados, éxito, error.
- Segmentables por audiencia; el segmento se prellena desde el contexto.
- **Capa de envío desacoplada** con nombres de campo estables para mapeo a CRM.
- Instrumentados: inicio, error, envío, éxito.
- Accesibles: label asociado, `autocomplete`, error por `aria-describedby`, foco al primer campo inválido, estado anunciado.
- **Consentimiento explícito obligatorio** en cualquier captura de datos personales (Ley 1581 de 2012). Sin él, el formulario no se publica.

## Definition of Done

- [ ] Todo valor visual desde un token; cero literales.
- [ ] Componente con todas sus variantes y estados.
- [ ] Reglas responsive explícitas por contexto, no solo "se encoge".
- [ ] Tipografía fluida; touch targets ≥44px.
- [ ] Server Component salvo justificación.
- [ ] Copy en `content/copy`; datos vía `lib/data`.
- [ ] Colecciones modeladas como datos, con trazabilidad de lo no validado.
- [ ] Formularios accesibles, instrumentados, CRM-ready y con consentimiento.
- [ ] Tokens exportables a los tres caminos de producción.
