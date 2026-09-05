# Fase 2 · IA — Modelo de contenido escalable (estaciones y colecciones)

> Contenido separado del diseño, bilingüe ES/EN desde el inicio. Agregar un registro nunca debe requerir rediseñar ni programar de nuevo. Fecha: 2026-07-23.

## Principio
Todo lo que crece vive como **colección de datos**, no como páginas hechas a mano. En el prototipo son datos locales (dataset de ejemplo, marcado placeholder); en producción se conectan al CMS/headless sin rediseño. Campos de texto = pares `{es, en}`.

## 1. Estaciones (colección central)
Para prototipo: **dataset de ejemplo realista de Voltop, marcado como placeholder** (no API, no cifras reales presentadas como reales).

| Campo | Tipo | Notas |
|---|---|---|
| id / slug | string | slug para deep-link `/red/estacion/[slug]` |
| nombre | `{es,en}` | p. ej. "Universidad EAN" |
| ciudad | ref | filtro |
| direccion | `{es,en}` | |
| geo | {lat, lng} | pin en mapa |
| conectores | enum[] | CCS1, CCS2, GB-T, Type2… (filtro) |
| potencia_kW | number | filtro (velocidad) |
| num_puntos | number | |
| estado | enum | operativa · próximamente · mantenimiento (momentum de red) |
| horarios | struct | |
| precio | struct | placeholder si no confirmado |
| amenities | enum[] | café, baño, techo… (estación-como-destino) |
| fotos | media[] | placeholder de imagen si faltan |
| destacada | bool | curaduría en Home/Red |

Filtros mínimos por defecto: **ciudad · conector · disponibilidad · potencia**. Avanzados bajo demanda (progressive disclosure).

## 2. Métricas de impacto
| Campo | Tipo | Notas |
|---|---|---|
| clave | string | estaciones, ciudades, sesiones, energia_mwh, usuarios, co2_t |
| valor | string/number | **placeholder "XX" hasta validación** |
| unidad | string | MWh, t, — |
| etiqueta | `{es,en}` | |
| fuente | string | trazabilidad |
| validado | bool | **si false → se muestra como XX**, nunca como cifra real |

Placeholders explícitos acordados (nunca inventar):
`XX estaciones · XX ciudades · XX sesiones de carga · XX MWh entregados · XX usuarios · XX t CO₂ evitadas`.

## 3. Casos de éxito
`id/slug · cliente · segmento(empresa/flota/espacio/partner) · logo · reto{es,en} · solución{es,en} · resultado (métricas) · cita{es,en} · autor(nombre, rol)`. Se muestran como prueba inline (Home, Empresas, Nosotros); escalables sin páginas nuevas.

## 4. Partners / hosts / clientes
`nombre · tipo(partner/host/flota/aliado) · logo · url · destacado(bool)`. Alimenta franjas de confianza.

## 5. Soluciones / segmentos B2B
`segmento · titular{es,en} · propuesta{es,en} · beneficios[]{es,en} · cómo_funciona[] · prueba(ref casos) · CTA{es,en}`. Alimenta el selector de "Empresas" (progressive disclosure), sin crear páginas por segmento.

## 6. Testimonios
`autor · rol · organización · cita{es,en} · foto · segmento`.

## 7. Leads (formularios)
`audiencia/segmento · campos por segmento · consentimiento · mapeo_CRM`. Formularios reutilizables, segmentables y **CRM-ready** (capa de envío desacoplada; nombres de campo estables). Instrumentados para el measurement plan. CRM objetivo aún sin definir → se diseña para integrar después sin bloquear.

## 8. Navegación y UI copy
Labels, CTAs y microcopy como **claves de contenido** `{es,en}` (soporte bilingüe desde el inicio; longitudes tolerantes).

## Reglas transversales
- Añadir estación / caso / partner = **un registro**, cero rediseño.
- Todo texto bilingüe `{es,en}`; se escribe primero ES.
- Toda cifra no validada = placeholder explícito; **nunca inventar ni presentar como real**.
- Imágenes/videos faltantes = placeholder apropiado + registro en `docs/05-assets-todo`.
