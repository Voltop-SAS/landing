# Fase 1 · Discovery — Auditoría del sitio actual (voltop.co)

> Fuente de contexto del negocio, **no** restricción de diseño. Fecha: 2026-07-23.
> Método: revisión de home + páginas internas (Ubicaciones, Nosotros, Contacto).

## 1. Arquitectura y navegación actual

**Navegación (header):** Ubicaciones · Nosotros · Contacto · Descargar la aplicación (link roto → `#`).
**Footer:** Inicio · Sobre nosotros · Ubicaciones · Términos · Política de privacidad · email de ayuda.
**Idiomas:** ES / EN (selector al pie).

**Sitemap real (muy plano):**
```
Home
├── Ubicaciones
├── Nosotros (Sobre Voltop)
├── Contacto
├── Términos y condiciones
└── Política de privacidad
```

**Diagnóstico de IA:** estructura mínima de "folleto". No hay rutas diferenciadas por público (conductor vs empresa/flota/propietario/partner/inversionista). Todo converge en una sola home y un único formulario. No hay sección de Soluciones, Casos, Partners, ni contenido de confianza para B2B.

## 2. Auditoría por página

### Home
Secuencia: Hero → propuesta de valor → logos "Empresas que confían en Voltop" → testimonios (3) → sección app → "Crezcamos juntos" (Aliados / Inversionistas) → cita del fundador (Bruno Ocampo, CEO).

- **Headline hero:** "La red de carga para vehículos eléctricos líder en Colombia".
- **Propuesta:** "Puntos de carga modernos y seguros, disponibles para personas y empresas en todo el país".
- **CTAs:** "Nuestras estaciones", "Ver ubicaciones", "Explorar la app", "Descarga la aplicación ahora", "Más información".
- **Cita fundador:** "Colombia está lista para un futuro eléctrico. En Voltop conectamos al país con infraestructura confiable, diseñada para crecer y transformar la movilidad."

**Observaciones:** la home intenta hablar a todos los públicos a la vez, sin jerarquía clara por journey. Los mensajes B2B (Aliados/Inversionistas) están comprimidos al final. El botón de descarga del header no funciona.

### Ubicaciones
Muestra **3 estaciones** en tarjetas estáticas:
1. **Universidad EAN** (Bogotá) — 10 puntos de carga rápida, conectores CCS1/CCS2/GB-T.
2. **Hotel Grand Hyatt** (Bogotá) — 11 puntos, GB-T.
3. **Hotel San Fernando Plaza** (Medellín, El Poblado).

Info por estación: nombre, dirección, tipo de conector (parcial), nº de puntos, link "Ver ubicación" (Google Maps).

**Gaps críticos para el conductor:**
- Sin mapa interactivo, ni buscador, ni filtros.
- Sin disponibilidad en tiempo real / estado.
- Sin potencia (kW), precio, horarios ni reserva.
- Cobertura limitada (2 ciudades) presentada como lista fija → **no escala**.

### Nosotros (Sobre Voltop)
Página de marca mínima. Mensaje: "Somos Voltop, la red de carga eléctrica que impulsa la movilidad eléctrica en Colombia" y la filosofía "hacer que cargar un vehículo eléctrico sea tan fácil como usar una app".

**Gaps de credibilidad (críticos para B2B/inversionistas):**
- Sin equipo/liderazgo, sin historia/hitos.
- Sin métricas de impacto (estaciones, energía entregada, usuarios, CO₂ evitado).
- Sin partnerships, tracción, ni respaldo. No construye confianza institucional.

### Contacto
Un único formulario "Hablemos" con 3 campos (Nombre, Email, Mensaje) + "Enviar". Email de soporte por mailto.

**Gaps:**
- **Sin segmentación por audiencia** (conductor / empresa / flota / propietario / partner / inversionista).
- Sin enrutamiento de lead, sin teléfono, sin expectativa de respuesta.
- Formulario no preparado para CRM ni para medir funnels B2B.

## 3. Hallazgos transversales

| # | Hallazgo | Impacto | Público afectado |
|---|---|---|---|
| H1 | IA plana, sin rutas por público | Alto | Todos |
| H2 | Ubicaciones estáticas, sin mapa/búsqueda/tiempo real | Alto | Conductores |
| H3 | Contenido no escalable (estaciones, casos, partners hardcodeados) | Alto | Operación/negocio |
| H4 | Cero pruebas de escala/impacto/confianza | Alto | B2B, inversionistas |
| H5 | Formulario único sin segmentación ni CRM | Alto | B2B (leads) |
| H6 | B2B comprimido al final de la home | Medio-Alto | Empresas/flotas/partners |
| H7 | CTA de descarga rota; funnels no medibles | Medio | B2C / analytics |
| H8 | Posicionamiento "app" > "infraestructura + tecnología" | Medio | Marca |

## 4. Lo que sí conservar (equity actual)

- Posicionamiento "red líder de carga EV en Colombia".
- Voz del fundador (Bruno Ocampo) como activo de confianza.
- Testimonios reales (EAN, conductor, hotelería) → base de prueba social.
- Bilingüe ES/EN.
- Datos concretos existentes (nº de puntos, conectores) → semilla del modelo de datos de estaciones.

## 5. Implicaciones para las fases siguientes

- **IA (Fase 2):** rediseñar el sitemap con rutas por público y una sección de Soluciones B2B + Red/Estaciones como producto central.
- **Estaciones como dato:** modelar colección escalable (mapa + búsqueda + filtros + estado) desde el día 1.
- **Confianza B2B:** crear capa de métricas de impacto, casos y partners.
- **Leads:** formularios segmentados, medibles y listos para CRM.
- **Medición:** definir funnels B2C y B2B (H7) en el measurement plan.
