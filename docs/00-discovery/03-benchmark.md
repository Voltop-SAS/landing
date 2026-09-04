# Fase 1 · Discovery — Benchmark de referencia

> Referencias para **estructura, IA e interacción**, NO para copiar estética. Fecha: 2026-07-23.

## Redes de carga EV

| Sitio | Referencia clave para Voltop | Evitar |
|---|---|---|
| **Fastned** | **Nav por público** (For drivers / For business / For investors) — el mejor modelo de separación B2C/B2B/IR. Locations con doble intención (conductor + "host a station"). Trust: B Corp, 100% renovable, portal de inversionistas. | Storytelling de marca puede retrasar a quien solo quiere cargar; mapa apoyado en Google Maps, sin UI de estado propia. |
| **ChargePoint** | **Soluciones por segmento** (Business / Fleet / Home) con la mayor profundidad B2B: ROI, software, financiación, casos. | Muy denso/enterprise; abruma al conductor B2C. Referencia de estructura, no de estética. |
| **Tesla** | **Minimalismo premium** + **configurador B2B** que estima modelo de sitio, costo eléctrico, utilización y payback → autocalificación de propietarios/hosts. | Ecosistema cerrado; nav asume familiaridad de marca (esconde profundidad). |
| **IONITY** | **Route planner** como herramienta hero (origen/destino/waypoints → ruta con paradas) — muy relevante para corredores nacionales de Colombia. Mapa distingue "live" vs "en construcción". Logos de OEM como confianza. | Se apoya en equity de marcas OEM que Voltop no tiene; contenido delgado fuera del mapa. |
| **Electrify America** | **"Locate a charger"** persistente en nav; **disponibilidad en tiempo real** (conector, velocidad, estado) sindicada a Google Maps. Onboarding "cómo funciona". | Visualmente cargado/promocional; flujos app-first entierran utilidad web. |
| **EVgo** | **Mapa filtrable** en vivo; **"Plan Finder"** para emparejar conductor con plan/precio; stats de escala en About. | Estructura de precios compleja (señal de problema de IA a evitar). |
| **GRIDSERVE** | Mapa con estado real + "enviar coordenadas a Google/Apple/Waze" (hand-off excelente). Estación-como-destino (arquitectura, forecourts). | App y web compiten en propuesta; mensajes redundantes. |
| **Wallbox** | **Split Home vs Business** explícito; **design system público** (modelo para la librería de componentes de Voltop). | Estructura de catálogo/e-commerce, poco relevante para IA de red/mapa. |
| **Ather Energy** | **Microinteracciones y scroll storytelling** narrando un ecosistema (vehículo + carga + app) a escala de mercado emergente. | Animación pesada daña performance en gama baja/redes lentas → **cautela crítica para móvil en Colombia**. |

## Infraestructura energética y clean-tech

| Sitio | Referencia clave | Evitar |
|---|---|---|
| **Octopus Energy** | **Accesibilidad de primera clase** (skip-to-content, orden de tabulación, contenido adaptable) como señal de calidad premium. Tono humano en una utility técnica. | Voz demasiado casual para la gravitas B2B; calibrar tono por audiencia. |
| **Arcadia** | **Doble mandato**: historia emocional para B2C + precisión factual para B2B (el reto exacto de Voltop). **Loops 3D de marca** (símbolo "node") como motion con propósito, reutilizable. | Mensaje abstracto; no animar sin metáfora explicativa clara. |
| **Redwood Materials** | Gravitas de infraestructura: tipografía sobria, narrativa de misión, escala/permanencia sin trucos. | Muy corporativo/investor; sin utilidad interactiva. Referencia de tono. |
| **Northvolt / Form Energy** | Estética técnica minimalista, whitespace con confianza, narrativa "el futuro de la energía". | Sitios corporativos/reclutamiento; Northvolt (insolvencia) = advertencia sobre sobre-indexar en narrativa vs operación. |

## Marcas tech/infra (solo motion e interacción)

- **Stripe** — cómo estructurar una home larga y densa que se siente premium y calmada; base monocroma + un color firma; demos con artefactos reales. *Evitar:* el craft de gradiente/animación exige ingeniería seria; no hacerlo a medias.
- **Linear** — rápido, minimal, tipografía precisa, reveals al scroll que muestran features en contexto; "el sitio se siente tan rápido como el producto". *Evitar:* dark-only no sirve para contexto exterior/mapa a plena luz — adaptar.
- **Vercel** — high-contrast blanco/negro/gris + acento raro; velocidad y sofisticación por restricción. *Evitar:* minimalismo de audiencia dev puede sentirse frío para B2C.

## Síntesis de patrones

**(a) IA/navegación en redes EV:**
1. **"Encontrar cargador / Mapa" persistente** y prominente en nav.
2. **Nav segmentada por público** (mejor práctica: toggles explícitos Conductores / Empresas / Inversores — Fastned).
3. **Onboarding "cómo funciona"** para nuevos conductores EV.
4. **Precios/membresía** como destino propio, a veces con **plan-finder**.
5. **Hub de Recursos/Casos** (SEO + nurture B2B).
6. **App download** como CTA recurrente; web para descubrir/decidir, app para el acto de cargar.
7. **Footer como capa de confianza** (certificaciones, IR, careers, legal, partners).

**(b) Separación B2C vs B2B:**
- Split explícito en el nivel superior (Fastned = más limpio; ChargePoint = más profundo).
- Lenguaje distinto por audiencia: B2C = conveniencia/velocidad/confiabilidad/"carga en 3 pasos"; B2B = ROI/uptime/software/financiación/escalabilidad/casos.
- **Activos compartidos, doble intención:** el mapa sirve a conductores (encontrar) y a propietarios (hospedar estación) — una página, dos CTAs.
- **Herramientas de autocalificación B2B** (configurador Tesla, plan-finder EVgo) convierten mejor que "Contactar ventas".
- Norte: dar a cada audiencia su propia experiencia de aterrizaje, no una página de compromiso.

**(c) Descubrimiento de estaciones:**
- Mapa interactivo con **filtros** (conector, potencia, disponibilidad, amenities).
- **Disponibilidad en tiempo real** = estándar mínimo.
- **Sindicación a Google/Apple/Waze** (hand-off "enviar coordenadas").
- **Route planner** para intención inter-ciudad/carretera — muy relevante en Colombia.
- **Mostrar momentum:** estaciones "live" vs "próximamente".
- **Estación-como-destino:** amenities, fotos, arquitectura.

**(d) Señales de confianza y escala:**
- Números duros (nº estaciones/puntos, ciudades, uptime %, kW).
- Storytelling de alcance geográfico ("de costa a costa").
- Certificaciones y sostenibilidad (B Corp, 100% renovable).
- Logos de partners/hosts/clientes flota.
- Portal de inversionistas / prensa.
- Premios y casos de éxito (prueba B2B).
- Transparencia de confiabilidad (uptime en tiempo real).
- Accesibilidad como marcador sutil de calidad premium.

## Implicaciones directas para Voltop
1. **Nav por público** (Conductores / Empresas / Inversores) + "Encontrar cargador / Mapa" persistente.
2. **El mapa es el producto:** estado real + filtros + route planner para corredores de Colombia + hand-off a Google/Apple/Waze.
3. **Herramienta de autocalificación B2B** (tipo configurador) para propietarios/hosts: ROI/cobertura/modelo de alianza > formulario simple.
4. **Doble mandato Arcadia:** emocional/simple para conductores, factual/preciso para negocio; **motion con propósito** y **budget de performance para redes móviles colombianas** (cautela Ather).
5. **Capa de confianza:** números de escala + alcance geográfico + logos de hosts/flota + certificaciones + IR/prensa, consolidada en un footer rico.
