# Fase 2 · IA — Journeys B2C / B2B y puntos de conversión

> El menor número de decisiones para el usuario; la complejidad se resuelve detrás. Fecha: 2026-07-23.

## 1. Journey B2C — Conductor

```
Home ──► Red ──► Estación (panel) ──► Cargar / Descargar app
 │        │           │
 │        │           └─ deep-link a estación (SEO, compartir, "enviar a Maps")
 │        └─ buscar / filtrar (mínimo) · cómo cargar (contextual)
 └─ entender qué es Voltop + acción global "Encontrar cargador"
```

**Estados y micro-momentos:**
- Entrada directa a Red desde el CTA global (atajo).
- Detalle de estación: conector, potencia, disponibilidad, precio, horarios, amenities, "enviar a Google/Apple/Waze".
- Empty/edge: sin resultados en filtro → sugerir ciudad cercana o "próximamente" (mostrar momentum de la red).
- Conversión: descargar app (contextual) o iniciar carga.

## 2. Journey B2B — Empresa / Flota / Propietario / Partner

```
Home ──► Empresas ──► Selector de caso ──► Contenido a medida ──► Lead (form segmentado)
 │           │              │                      │
 │           │              │                      └─ prueba (casos, logos, impacto) refuerza confianza
 │           │              └─ Empresa · Flota · Espacio · Partner (progressive disclosure)
 │           └─ valor B2B: infraestructura + tecnología + end-to-end
 └─ camino "Para empresas" desde Home  (o handoff desde Red "¿Tienes un espacio?")
```

**Estados y micro-momentos:**
- Dos entradas a Empresas: camino explícito en Home y handoff desde Red (propietarios).
- Selector prellena el segmento del formulario → menos fricción.
- Confianza antes de pedir el dato: casos/logos/impacto preceden al form.
- Conversión: envío de lead segmentado (CRM-ready). Estado de éxito con expectativa de respuesta.

## 3. Journey Marca / Confianza (transversal)

```
Home ──► Nosotros ──► Escala / Infraestructura / Impacto / Visión ──► (app o lead, contextual)
```
Sirve a inversionistas/prensa y refuerza la decisión de conductores y negocios. No es un journey de conversión directa, sino de credibilidad que alimenta a los otros dos.

## 4. Puntos de conversión y micro-conversiones

| Journey | Conversión primaria | Micro-conversiones |
|---|---|---|
| B2C | Descargar app · Iniciar carga | Encontrar cargador (mapa) · buscar/filtrar · ver estación · enviar a Maps |
| B2B | Enviar lead segmentado | Elegir caso (selector) · ver caso de éxito · abrir formulario |
| Marca | — (credibilidad) | Ver impacto · leer visión · logos partners |

## 5. Mapeo a measurement plan (analytics desde el diseño)

Cada punto anterior es un **evento** (nombre · disparador · propiedades · funnel). Resumen:

- **CTA global:** `cta_encontrar_cargador_click`, `cta_b2b_conversion_click` (props: contexto/página/variante).
- **Red/mapa:** `red_buscar`, `red_filtro_aplicado`, `estacion_vista` (props: ciudad, conector, potencia, estado), `estacion_enviar_maps`.
- **App:** `app_store_click` (props: ios/android, contexto).
- **B2B:** `empresas_selector_caso` (props: segmento), `lead_form_inicio`, `lead_form_campo`, `lead_form_error`, `lead_form_envio`, `lead_form_exito` (props: segmento).
- **Marca:** `impacto_visto`, `caso_exito_visto`.

**Funnels definidos:**
- **B2C:** Home → `cta_encontrar_cargador_click` → `estacion_vista` → `app_store_click` / iniciar carga.
- **B2B:** Empresas → `empresas_selector_caso` → `lead_form_inicio` → `lead_form_exito` (segmentado por caso).

> Nota: los eventos se implementan en Fase de front-end (skill `voltop-frontend-motion`) y se verifican en el Review Gate. Aquí solo se define el plan.

## 6. Reglas de fricción mínima
- El usuario nunca elige su "carril" antes de entender la propuesta (segmentación suave).
- B2B: confianza antes del formulario; el form pide lo mínimo por segmento.
- B2C: de la intención al mapa en 1 clic; detalle bajo demanda.
- Toda cifra de impacto es placeholder XX hasta validación (nunca inventada).
