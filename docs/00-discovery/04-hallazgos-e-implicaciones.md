# Fase 1 · Discovery — Síntesis de hallazgos e implicaciones

> Cierre de Discovery. Conecta auditoría + públicos/JTBD + benchmark → entrada para Fase 2 (Arquitectura de Información). Fecha: 2026-07-23.

## 1. Diagnóstico en una frase
Voltop tiene un posicionamiento fuerte ("red líder de carga EV en Colombia") atrapado en un sitio tipo folleto: **IA plana, estaciones estáticas, cero prueba de escala/confianza y leads sin segmentar** — muy por debajo del estándar del sector (Fastned, ChargePoint, Tesla) y del nivel premium que buscamos.

## 2. Brechas prioritarias (auditoría × benchmark)

| # | Brecha actual | Estándar del sector | Prioridad |
|---|---|---|---|
| B1 | Nav plana, sin rutas por público | Nav segmentada Conductores/Empresas/Inversores (Fastned) | Crítica |
| B2 | Ubicaciones estáticas (3 tarjetas) | Mapa con estado real + filtros + route planner + hand-off | Crítica |
| B3 | Contenido hardcodeado, no escala | Estaciones/casos/partners como colecciones de datos | Crítica |
| B4 | Sin prueba de escala/impacto/confianza | Números duros + logos + certificaciones + IR | Crítica |
| B5 | Formulario único sin CRM | Leads segmentados + autocalificación B2B (configurador) | Alta |
| B6 | B2B comprimido al final de home | Soluciones por segmento como destino propio | Alta |
| B7 | Posicionamiento "app" | "Infraestructura + tecnología" (Redwood/Arcadia gravitas) | Alta |
| B8 | Funnels no medibles, CTA rota | Measurement plan + CTAs consistentes | Alta |

## 3. Principios de diseño para Voltop (derivados)

1. **Público primero.** Cada persona encuentra su ruta en 1 clic. Doble mandato: emocional para conductores, factual para negocio.
2. **El mapa es el producto.** Descubrimiento de estaciones = experiencia central, escalable y en tiempo real.
3. **Confianza por evidencia.** Números, casos, partners y certificaciones sustituyen las afirmaciones vacías.
4. **Escala sin rediseño.** Todo lo que crece (estaciones, casos, partners, soluciones) vive como dato.
5. **Motion con propósito y presupuesto.** Energía/flujo/precisión, nunca decorativo; performance-budget para móvil colombiano.
6. **Medible por diseño.** Ningún CTA/formulario sin evento; funnels B2C y B2B definidos.
7. **Lenguaje visual propio.** Anti-genérico: gravitas de infraestructura + precisión tecnológica, identidad Voltop.

## 4. Sitemap-hipótesis v1 (a resolver en Fase 2)

```
Home (narrativa marca + accesos por público + mapa destacado)
│
├── Conductores (B2C)
│   ├── Cómo funciona (onboarding EV)
│   ├── La app (descarga)
│   └── Precios / planes
│
├── Red / Estaciones  ← "el mapa es el producto"
│   ├── Mapa (estado real, filtros)
│   ├── Route planner (corredores Colombia)
│   └── Estación [detalle]  ← colección escalable
│
├── Soluciones (B2B)
│   ├── Empresas
│   ├── Flotas
│   ├── Espacios comerciales (propietarios/hosts) + autocalificación/ROI
│   └── Partners / aliados
│
├── Nosotros (marca + impacto)
│   ├── Historia / visión / equipo (fundador)
│   ├── Impacto (métricas de escala)  ← dato escalable
│   └── Casos de éxito  ← colección escalable
│
├── Contacto / Leads (formularios segmentados por audiencia)
│
└── Footer (capa de confianza: IR/prensa, certificaciones, legal, partners)

Transversal: selector ES/EN · CTA app recurrente · "Encontrar cargador" persistente
```

> Cambios vs actual: de 4 secciones planas → arquitectura por público con Red/Estaciones y Soluciones B2B como pilares; Nosotros pasa de folleto a capa de confianza con impacto y casos.

## 5. Modelo de contenido escalable (semilla para Fase 4)

Colecciones (datos, separadas del diseño):
- **Estaciones:** nombre, ciudad, dirección, geo, conectores, potencia (kW), nº puntos, estado, horarios, precio, amenities, fotos.
- **Casos de éxito:** cliente, segmento, reto, solución, resultado/métrica, cita, logo.
- **Partners/hosts:** nombre, tipo, logo, link.
- **Soluciones:** segmento, propuesta, beneficios, prueba, CTA.
- **Leads:** audiencia, campos por segmento, mapeo a CRM.

## 6. Assets y datos a producir/confirmar (registro inicial → `docs/05-assets-todo`)

- Métricas reales de impacto (nº estaciones/puntos, ciudades, energía entregada, usuarios, CO₂). *(Placeholder marcado si no hay.)*
- Datos de estaciones (¿API/tiempo real o dataset de ejemplo?).
- Logos de partners/hosts/clientes flota con permiso de uso.
- Fotografía/render de estaciones y app; material 3D si existe.
- Equipo/fundador (bio, foto) para capa de confianza.
- CRM objetivo y mapeo de formularios.
- Confirmar alcance bilingüe ES/EN en el rediseño.

## 7. Preguntas de decisión para cerrar Discovery 🔶

1. ¿Validas el **sitemap-hipótesis v1** como base para la Fase 2, o quieres ajustar pilares/nombres?
2. ¿Priorización de públicos confirmada (Conductores + Empresas/Flotas/Propietarios = Alta)?
3. **Route planner** y **configurador B2B (ROI)**: ¿los incluimos como piezas estrella o los dejamos como fase 2 del roadmap?
4. Datos de estaciones: ¿**API/tiempo real** o **dataset de ejemplo** para el prototipo?
5. ¿Tienes métricas reales de impacto y CRM objetivo?

## 8. Estado y siguiente fase
Discovery **completo** (auditoría + públicos/JTBD + benchmark + síntesis). Con tu validación de las preguntas §7, avanzamos a **Fase 2 — Arquitectura de Información** (sitemap definitivo, modelo de navegación y flujos por público). Seguimos en documentos; sin código.
