# VOLTOP WEB — MASTER PROJECT DEFINITION

> **Single Source of Truth.** Este documento reemplaza y consolida toda la documentación previa del proyecto.
> Está escrito para ser consumido por cualquier persona o sistema —diseño, UX, desarrollo, contenido, stakeholders u otro asistente de IA— **sin acceso a historial de conversaciones**.
> Ante cualquier contradicción con otro documento de `/docs`, **prevalece este archivo**.
>
> Versión 1.0 · 2026-08-11 · Idioma de trabajo: español (producto bilingüe ES/EN)

**Cómo leer este documento.** Los bloques están marcados como:
`FACT` hecho verificable · `DECISION` decisión tomada y cerrada · `PRINCIPLE` regla de criterio · `OPEN` pregunta abierta · `SUPERSEDED` decisión anterior anulada.

---

## ÍNDICE

1. Qué es Voltop · 2. Qué se está construyendo · 3. Contexto y problema · 4. Objetivos de negocio · 5. Objetivos de experiencia · 6. Públicos · 7. JTBD · 8. Posicionamiento · 9. Principios de producto · 10. Principios UX · 11. Filosofía de simplicidad · 12. Principios visuales · 13. Definición de "premium" · 14. Arquitectura de información · 15. Navegación · 16. Journeys · 17. Conversión · 18. Estrategia de contenido · 19. UX Writing · 20. Fotografía y video · 21. Motion · 22. Responsive · 23. Accesibilidad · 24. Design System · 25. Stack · 26. Arquitectura técnica · 27. Modelo de datos · 28. i18n · 29. SEO y performance · 30. Escalabilidad · 31. Integraciones · 32. Assets · 33. Placeholders · 34. Estado de implementación · 35. Pendientes · 36. Decisiones confirmadas · 37. Decisiones abiertas · 38. Restricciones · 39. Riesgos y deuda · 40. Definition of Done
— Anexo A: Conserva / Modifica / Elimina · Anexo B: Decisiones superseded

---

## 1. QUÉ ES VOLTOP

`FACT` Voltop es una red de infraestructura de carga para vehículos eléctricos en Colombia. Opera estaciones propias y en alianza (universidades, hoteles, centros comerciales, espacios corporativos), y ofrece una capa de tecnología (app, gestión, datos de operación) sobre esa infraestructura.

`FACT` Sitio actual de referencia: `voltop.co`. Se usa como **fuente de contexto, no como restricción de diseño**.

`FACT` Voltop no es una app de carga. Es una **compañía de infraestructura energética con tecnología propia**. Toda la comunicación se subordina a esta distinción.

---

## 2. QUÉ SE ESTÁ CONSTRUYENDO

`FACT` El rediseño completo de la experiencia digital pública de Voltop: sitio web bilingüe ES/EN, construido como prototipo de alta fidelidad en Next.js, con calidad de producción.

`DECISION` El prototipo se construye **como si fuera producción**, no como maqueta. Componentes tipados, contenido como datos, accesibilidad y SEO desde el inicio.

`DECISION` El **camino de producción final está deliberadamente diferido**. Se evaluarán tres opciones (Elementor híbrido / headless con CMS / CMS ligero) comparando fidelidad, performance, mantenimiento, costo y autonomía del equipo. La arquitectura no debe cerrar ninguna de las tres.

`DECISION` **La decisión de producción no se toma hasta que el copy esté fuera del código** (ver §27). Evaluarla antes produce estimaciones de costo falsas.

**Fuera de alcance en esta etapa:** la app móvil, el backoffice, el sistema de pagos, la API de disponibilidad en tiempo real, blog/editorial, página de precios.

---

## 3. CONTEXTO Y PROBLEMA

`FACT` Problemas identificados en la experiencia digital previa:

| Problema | Consecuencia |
|---|---|
| El sitio comunica "una app de carga" | Subvalora la compañía frente a inversionistas, aliados institucionales y clientes corporativos |
| No hay un journey B2B definido | Los leads comerciales (empresas, flotas, propietarios de espacios, partners) no tienen camino ni captura |
| La red no se percibe como infraestructura a escala | Debilita la confianza del conductor y la credibilidad institucional |
| Sin medición | No hay datos para optimizar conversión |
| Contenido no escalable | Abrir una estación nueva implica trabajo manual de diseño |

---

## 4. OBJETIVOS DE NEGOCIO

Prioridad declarada, en orden:

1. **Posicionamiento de marca** — que Voltop se perciba como compañía de infraestructura + tecnología de nivel internacional.
2. **Crecimiento de la red y del negocio** — generar leads B2B calificados y segmentados.
3. **Adquisición y retención B2C** — que los conductores encuentren dónde cargar y adopten la app.
4. **Credibilidad institucional** — servir a inversionistas, prensa y aliados sin una sección corporativa pesada.

`PRINCIPLE` Ninguna pantalla se diseña sin un objetivo primario y una métrica asociada.

---

## 5. OBJETIVOS DE EXPERIENCIA

Que cualquier visitante entienda en segundos:

1. Qué es Voltop · 2. Qué puede hacer · 3. Dónde cargar · 4. Qué ofrece a empresas y espacios · 5. Por qué confiar · 6. Qué acción tomar.

`PRINCIPLE` Estas seis preguntas son el criterio de suficiencia de contenido. Una página puede fallar por sobrecargada **o** por no responder a las que le corresponden.

---

## 6. PÚBLICOS

| Público | Tipo | Necesidad dominante | Destino principal |
|---|---|---|---|
| Conductor de VE | B2C | Encontrar dónde cargar, ahora | Red |
| Conductor potencial | B2C | Entender si la infraestructura es suficiente para cambiarse a eléctrico | Home → Red |
| Empresa | B2B | Carga para sedes y colaboradores, gestionada | Empresas |
| Flota | B2B | Infraestructura confiable + datos de operación | Empresas |
| Propietario de espacio (hotel, retail, parking, universidad) | B2B | Modernizar y rentabilizar su espacio sin operar la carga | Empresas |
| Partner / integrador | B2B | Aliarse o integrarse con la red líder | Empresas |
| Inversionista / prensa | Institucional | Escala, tracción, liderazgo, propósito | Nosotros |

`DECISION` Los cuatro perfiles B2B **no tienen páginas separadas**. Conviven en Empresas mediante un selector con progressive disclosure. Solo se "gradúa" un perfil a página propia si aparece una razón real de contenido, intención o conversión.

---

## 7. JOBS TO BE DONE PRINCIPALES

**B2C**
- "Necesito cargar y quiero saber dónde, si está disponible y si mi conector sirve."
- "Estoy evaluando comprar un carro eléctrico y necesito saber si podré cargarlo."
- "Voy a viajar y necesito saber si hay cobertura en la ruta."

**B2B**
- "Mis colaboradores/mi flota necesitan cargar y no quiero operar esa infraestructura."
- "Tengo un espacio y quiero que genere valor sin volverme un operador energético."
- "Necesito un aliado confiable de infraestructura, no un proveedor de equipos."

**Institucional**
- "Necesito entender la escala real y la seriedad de esta compañía."

---

## 8. POSICIONAMIENTO

> **Voltop es la infraestructura que mueve la movilidad eléctrica de Colombia — construida para crecer con el país.**

`PRINCIPLE` Tres atributos que toda decisión debe reforzar: **infraestructura real** (se construye, existe, opera) · **tecnología propia** (datos, gestión, app) · **escala nacional en crecimiento**.

`PRINCIPLE` Registro de marca: tecnológico, energético, humano, preciso, memorable. Nunca: startup ligera, marketplace, app.

---

## 9. PRINCIPIOS DE PRODUCTO

1. Complejidad detrás, simplicidad delante, **riqueza en la experiencia**.
2. Pocas decisiones visibles, todas relevantes.
3. Cada elemento justifica su existencia.
4. Progressive disclosure: lo esencial primero, la profundidad bajo demanda.
5. **La Home presenta · las páginas internas profundizan.** Corolario obligatorio: **ninguna página interna puede tener menos contenido o valor que la preview de la Home que apunta a ella.**
6. Accesibilidad, performance y SEO son requisitos del producto, no fases posteriores.
7. Nunca inventar datos. Todo dato no validado se marca como provisional o no se muestra.
8. Referencia conceptual: la filosofía de producto de Apple (complejidad interna sofisticada, experiencia externa extremadamente clara). **No su estética.**

---

## 10. PRINCIPIOS UX

1. El usuario nunca elige su "carril" antes de entender la propuesta: segmentación suave, no bifurcación forzada.
2. B2C: de la intención al mapa en un clic; el detalle bajo demanda.
3. B2B: **confianza antes de pedir el dato.** Evidencia, casos y prueba preceden siempre al formulario.
4. Sin callejones sin salida: toda página ofrece la siguiente acción correcta.
5. Feedback en todos los estados: hover, focus, active, loading, error, éxito, vacío.
6. Errores accionables (qué pasó + cómo resolverlo). Empty states que orientan.
7. No prometer lo que el producto no hace. Un titular es un contrato.

---

## 11. FILOSOFÍA DE SIMPLICIDAD

**"Menos, pero mejor."** Analogía operativa: un control remoto de 20 botones donde se usan 4, frente a un control de 5 controles con función clara y frecuente.

`PRINCIPLE` **Matiz crítico:** simplicidad ≠ web básica, vacía o excesivamente minimalista. No es "mucho espacio en blanco + un titular gigante + un botón". El objetivo no es la web más simple posible, sino **la experiencia más clara posible con el nivel de sofisticación, emoción y detalle necesarios para causar efecto.**

**Lema:** *Complejidad detrás. Simplicidad delante. Riqueza en la experiencia.*

`PRINCIPLE` **La doble pregunta (obligatoria en toda revisión de UX y UI).** No basta con restar:
- **Restar:** ¿podemos quitar, combinar o hacer contextual algo?
- **Sumar:** ¿hay suficiente riqueza, carácter y diferenciación para que esto se sienta como Voltop —premium, tecnológico— y no vacío ni genérico?

Un componente falla la revisión tanto por sobrecargado como por vacío.

---

## 12. PRINCIPIOS VISUALES / ART DIRECTION

`DECISION` **Dirección de arte: "Infraestructura que cobra vida".**
- **Infraestructura (70%)** — el mundo real: fotografía y video propios, estaciones, personas, operación. Base editorial-ingenieril: retícula precisa, tipografía con intención, tratamiento técnico de los datos.
- **Corriente (30%)** — el comportamiento: energía, flujo y conexión expresados **sobre el material real**, nunca como gráfico abstracto suelto.

`DECISION` **Dark-first**, alto contraste, sin modo claro por ahora (incluido el mapa).

`DECISION` **Registro dual obligatorio por sección:**
- **Silencio** — estructural, plano, editorial, funcional. Deja respirar la información.
- **Impacto** — energía, gradiente, sangrado, escala. Reservado a los puntos narrativos clave.

`PRINCIPLE` **Ritmo visual por página.** Cada página tiene una jerarquía deliberada de intensidad:
`impacto → respiración → información → interacción → respiración → impacto/conversión`
Si todas las secciones compiten, el diseño falla. Se evalúa el ritmo de la página completa, no solo cada sección.

`PRINCIPLE` **Contraste compositivo, no solo temático.** Dos secciones consecutivas no pueden compartir la misma estructura. El ritmo se construye variando: ancho de contenedor, número de columnas, sangrado, densidad tipográfica, relación texto/imagen y color de fondo — no añadiendo efectos.

`DECISION` **Disciplina del gradiente:** el gradiente de marca es **señal, no textura**. Máximo **una acción primaria con gradiente por vista**. Prohibido en: puntos decorativos, bullets, comillas, bordes y elementos repetidos.

`DECISION` **Radio dual por contexto:** `pill` para acciones y energía; `structural` para datos y estructura.

`DECISION` **Una sola flecha, contextual** (`→`), solo cuando comunica dirección o continuidad. Nunca flechas dobles.

### Prohibiciones (requieren justificación explícita documentada para usarse)

- Layouts SaaS predecibles (hero centrado + 3 cards + logos + CTA).
- Exceso de cards; "todo es una card".
- Pills y chips decorativos **sin función**.
- Border-radius por defecto en todo.
- Glows y sombras difusas gratuitas.
- Gradientes de relleno.
- Iconografía genérica de librería como decoración.
- **Constelaciones de nodos conectados / grafos abstractos** como recurso de fondo. `SUPERSEDED` — ver Anexo B.
- Simetrías predecibles sin tensión.
- Placeholders que gritan "plantilla".
- Repetir la misma composición en secciones consecutivas.

`PRINCIPLE` **Test del anonimato:** si al cambiar el logo y el color esto podría ser cualquier startup, no está listo.

---

## 13. DEFINICIÓN DE "PREMIUM"

Premium **no es**: minimalismo vacío, mucho aire, tipografía gigante, animaciones abundantes, dark mode.

Premium **es**, en este proyecto:

| Dimensión | Criterio |
|---|---|
| Jerarquía | El ojo sabe siempre dónde mirar primero |
| Composición | Cada bloque tiene una decisión estructural propia |
| Contenido | Suficiente para explicar, demostrar, generar confianza y convertir |
| Material | Fotografía y video propios de calidad, dirigidos |
| Detalle | Alineación óptica, ritmo tipográfico, densidad revisados |
| Interacción | Respuesta inmediata y significativa a cada acción |
| Silencio | Momentos deliberadamente tranquilos que hacen contrastar los momentos fuertes |
| Ejecución | Accesible, rápido, sin errores, sin promesas falsas |

`PRINCIPLE` **Signature moments:** pocos, memorables, contrastados. Cada uno debe reforzar la marca **o** ayudar a entender algo. No todo se mueve.

---

## 14. ARQUITECTURA DE INFORMACIÓN

`DECISION` **Cuatro destinos. Tres puertas de navegación + Home por el logo.**

```
/                       HOME        — presenta Voltop y reparte a cada journey
/red                    RED         — puerta B2C · herramienta de búsqueda de estaciones
/red/[ciudad]           CIUDAD      — cobertura por ciudad (SEO local)          [NUEVO]
/red/estacion/[slug]    ESTACIÓN    — ficha completa, generada desde datos
/empresas               EMPRESAS    — hub B2B · selector + evidencia + captura de lead
/nosotros               NOSOTROS    — marca, historia, escala, liderazgo, impacto
```

`DECISION` No existen páginas separadas para Flotas, Propietarios, Partners, App, Precios, Contacto, Casos ni Inversionistas. Viven dentro de un destino o en el footer.

`DECISION` **La estación es una página propia**, no un panel ni un drawer. Es deep-linkable, indexable y compartible. `SUPERSEDED` — ver Anexo B.

`DECISION` **Se añade el nivel ciudad** (`/red/[ciudad]`). Justificación: la búsqueda real del usuario es geográfica ("cargador eléctrico Medellín"); sin entidad ciudad no hay filtros reales, ni cobertura navegable, ni SEO local. Es el canal de adquisición B2C más barato disponible.

`DECISION` **`/red` es una superficie de producto, no un relato.** Su trabajo es *encontrar una estación*. El relato de escala de la red vive en Home y Nosotros. Un titular en `/red` no puede prometer capacidades que la página no tiene.

### Modelo de contenido por destino

| Destino | Objetivo primario | Debe contener | No debe contener |
|---|---|---|---|
| **Home** | Entender Voltop + repartir a los journeys | Narrativa de 7 beats, previews que enlazan | Mapa completo, formularios, listados |
| **Red** | Encontrar una estación | Buscador funcional, filtros operativos, listado, cobertura por ciudad, cómo cargar, handoff "hospedar" | Historia de la compañía, formulario B2B completo |
| **Ciudad** | Cobertura local | Estaciones de la ciudad, contexto local, próximas aperturas | Contenido duplicado de /red |
| **Estación** | Decidir ir a cargar | Specs, servicios, media propia, cómo llegar, disponibilidad | Contenido de marca |
| **Empresas** | Generar lead segmentado | Propuesta por caso, capacidades, **evidencia antes del formulario**, formulario segmentado con consentimiento | Contenido B2C |
| **Nosotros** | Credibilidad | Historia, escala, infraestructura, liderazgo, impacto, partners | Conversión dura |

---

## 15. NAVEGACIÓN

**Desktop:** `[logo] · Red · Empresas · Nosotros · · · [CTA contextual] [ES/EN]`

**Móvil:** logo + hamburguesa + selector de idioma; overlay a pantalla completa con los tres destinos, el CTA contextual y el idioma. Tipografía grande. Cierre por botón, por Escape y por clic fuera. Bloqueo de scroll y foco atrapado mientras está abierto.

`DECISION` **Un solo CTA global, contextual por ruta:**

| Contexto | CTA del header | Destino |
|---|---|---|
| Home, Nosotros | Encontrar cargador | /red |
| Red, Ciudad, Estación | **Ninguno** (el usuario ya está en la herramienta) | — |
| Empresas | Hablar con el equipo | Ancla al formulario |

`DECISION` Nunca dos CTAs globales permanentes compitiendo. "Descargar app" es **contextual** dentro del journey del conductor y del footer — nunca global.

`DECISION` **Footer reducido a tres columnas** con destinos reales. Prohibido: enlaces que apuntan al mismo destino con etiquetas distintas, y enlaces `#` sin destino. Un enlace sin destino real no se publica.

`DECISION` Se elimina el bloque de métricas del footer (duplicaba las de la página).

`DECISION` Skip link ("Saltar al contenido") obligatorio en todas las páginas.

---

## 16. JOURNEYS

**B2C — Conductor**
```
Home → [Encontrar cargador] → Red (buscar/filtrar) → Estación → Cómo llegar / Descargar app
                                    ↘ Ciudad → Estación
```
Micro-momentos: entrada directa a Red desde el CTA global; filtros que responden de inmediato; empty state que sugiere ciudad cercana o próximas aperturas (momentum de red); deep link a estación compartible.

**B2B — Empresa / Flota / Espacio / Partner**
```
Home → [Soluciones para empresas] → Empresas → Selector de caso → Evidencia → Formulario segmentado → Lead
Red → "¿Tienes un espacio?" ──────────────────↗
```
Micro-momentos: dos entradas (explícita desde Home, handoff desde Red); el selector prellena el segmento del formulario; **la evidencia siempre precede al formulario**; estado de éxito con expectativa de respuesta.

**Institucional**
```
Home → Nosotros → Historia / Escala / Infraestructura / Liderazgo / Impacto → (app o lead, contextual)
```

---

## 17. ESTRATEGIA DE CONVERSIÓN

| Journey | Conversión primaria | Micro-conversiones |
|---|---|---|
| B2C | Descargar app · Iniciar carga | Encontrar cargador · buscar/filtrar · ver estación · cómo llegar |
| B2B | Enviar lead segmentado | Elegir caso · ver evidencia · abrir formulario |
| Institucional | — (credibilidad) | Ver impacto · ver liderazgo · logos de partners |

`PRINCIPLE` El formulario es un punto de conversión, no un trámite: mínima fricción, campos mínimos por segmento, segmento prellenado, consentimiento explícito, expectativa de respuesta clara.

---

## 18. ESTRATEGIA DE CONTENIDO

`DECISION` **Todo el texto visible vive en la capa de contenido, no en el JSX.** Ningún componente contiene cadenas literales de copy. Justificación: sin esto no hay flujo de traducción, ni revisión editorial, ni migración a CMS posible.

`DECISION` Todo texto se modela como par bilingüe `{ es, en }`. Se escribe primero en español.

`DECISION` Todo lo que crece vive como **colección de datos**: estaciones, ciudades, casos, partners, testimonios, segmentos B2B. Añadir un registro nunca requiere rediseñar ni programar.

`DECISION` **Nunca inventar cifras.** Toda métrica lleva un flag `validated`. Si es `false` se muestra como placeholder explícito o no se muestra.

`DECISION` **Economía de placeholders.** Un placeholder es honesto; diez seguidos destruyen la credibilidad. Regla: **máximo dos métricas provisionales visibles por página**. Es preferible mostrar menos métricas bien elegidas que rellenar huecos.

---

## 19. UX WRITING

**Tono:** claro y humano · tecnológico y preciso · premium y sobrio · sin jerga vacía ni exageración de marketing.

**Reglas:**
- Nunca Lorem Ipsum. Copy realista y contextual, marcado si es provisional.
- CTAs: verbo + valor, diferenciados por audiencia.
- **Un titular es un contrato.** No prometer capacidades que el producto no tiene.
- Errores accionables; empty states que orientan; loading y éxito con personalidad contenida.
- SEO copy que sirve a personas y buscadores, sin keyword stuffing.

---

## 20. ROL DE FOTOGRAFÍA Y VIDEO

`PRINCIPLE` El material audiovisual es **material narrativo**, no galería ni reproductores convencionales.

| Asset | Función narrativa | Tratamiento |
|---|---|---|
| Video nueva estación Medellín | **Prueba de capacidad de construcción.** Pico absoluto de la Home | Full-bleed, sticky con scroll-scrub, autoplay silencioso con poster |
| Video apertura Universidad EAN | **Prueba de partnership y de personas.** Sirve a B2B y a marca | Composición editorial, cita sobre el material, reproducción al interactuar |
| Video CEO en estación | **Prueba de propósito y liderazgo** | Íntimo, menos UI, palabras como tipografía protagonista |
| Fotografía real | **Respiración y contraste.** Comunica escala sin cifras | Sangrado, recortes editoriales, imagen como fondo de sección — no dentro de una caja con borde |

**Requisitos técnicos por asset:** función narrativa, ubicación, versión desktop y móvil, autoplay vs interacción, loop vs completo, poster/frame, recorte, compresión, lazy-load, fallback, impacto en performance, permisos de las personas que aparecen.

`PRINCIPLE` Si un asset no sirve técnicamente para un uso, se propone la versión o edición a producir. No se toman decisiones irreversibles sobre el formato original.

---

## 21. MOTION

`PRINCIPLE` El movimiento es parte del design system, no decoración. Refuerza: energía, flujo, conexión, infraestructura, precisión, movilidad.

`DECISION` **La energía se expresa como respuesta, no como ambiente.** El movimiento ocurre cuando el usuario hace algo (seleccionar una estación, aplicar un filtro, enviar el formulario, navegar entre páginas), no en bucles de fondo. Se eliminan las animaciones infinitas ambientales.

**Jerarquía:**
1. **Signature moments** (2–3 por sitio, no más): revelación de infraestructura con scroll-scrub, transición entre páginas, momento de datos.
2. **Motion funcional:** reveals al entrar en viewport, transición de estados, feedback de formulario.
3. **Microinteracciones:** hover, focus, press, loading.

**Reglas duras:**
- Solo se animan `transform` y `opacity`.
- Duraciones y easings salen de tokens.
- `prefers-reduced-motion` respetado con **alternativa equivalente** — el contenido nunca queda invisible ni inaccesible.
- Cada animación justifica su costo en rendimiento y atención. Si no aporta, no va.
- Objetivo 60fps, verificado también en gama baja.

---

## 22. RESPONSIVE

`PRINCIPLE` Cuatro contextos **diseñados**, no escalados: desktop, laptop, tablet, móvil.

| Contexto | Rango | Criterio de diseño |
|---|---|---|
| Desktop | ≥1440px | Composición completa; el contenedor no debe pegarse a los bordes |
| Laptop | 1024–1439px | Composición completa con densidad ajustada |
| Tablet | 640–1023px | **Composición propia.** Ni desktop encogido ni móvil estirado. Medida de línea controlada (45–75 caracteres) |
| Móvil | <640px | Mobile-first real; una mano; jerarquía vertical explícita |

**Reglas:**
- Tipografía fluida con `clamp()`. Prohibidos los saltos duros de escala entre breakpoints.
- Touch targets ≥44×44px en todos los contextos táctiles.
- `dvh` en lugar de `vh` para alturas de viewport.
- Los gráficos de fondo se adaptan o se ocultan por contexto; nunca se superponen al contenido.
- Motion adaptado o simplificado en gama baja.

---

## 23. ACCESIBILIDAD

`DECISION` **Objetivo: WCAG 2.1 AA. Es un requisito de aceptación, no una mejora.**

**Reglas verificables (umbrales, no intenciones):**

| Criterio | Umbral |
|---|---|
| Contraste texto normal | ≥ 4.5:1 |
| Contraste texto grande (≥24px, o ≥18.66px bold) | ≥ 3:1 |
| Contraste de bordes e iconos significativos | ≥ 3:1 |
| Touch target | ≥ 44×44 px |
| Foco visible | Outline de 2px, nunca eliminado |
| Encabezados | Un solo `h1` por página, sin saltos de nivel |
| Landmarks | `header`, `nav`, `main` (uno), `footer` |
| Skip link | Presente en todas las páginas |
| Formularios | Label asociado, `autocomplete`, error asociado por `aria-describedby`, foco gestionado |
| Mensajes de estado | Anunciados con `role="status"` o `aria-live` |
| ARIA | Solo patrones completos. **Un patrón ARIA incompleto es peor que ninguno** |
| Menú móvil | Cierre con Escape, foco atrapado, scroll bloqueado |
| `lang` | Correcto en el HTML servido, no corregido en cliente |
| Reduced motion | Contenido siempre perceptible |

---

## 24. DESIGN SYSTEM

`PRINCIPLE` El sistema **emerge de resolver pantallas reales**; no se define en abstracto. Pero una vez definido, **ningún valor visual puede ser literal suelto**: todo sale de un token.

### Tokens obligatorios

| Grupo | Estado |
|---|---|
| Color (canvas, superficies, tinta, marca, líneas, foco, estados semánticos) | Definido — **corregido por accesibilidad** |
| **Escala tipográfica fluida** (`clamp`) | **NUEVO — requisito** |
| **Escala de espaciado** | **NUEVO — requisito** |
| Radios (dual: `pill` / `structural`) | Definido |
| Duraciones y easings de motion | Definido |
| Breakpoints | A formalizar (incluir tablet) |
| z-index | A formalizar |

### Color de marca

| Token | Valor | Nota |
|---|---|---|
| `canvas` | `#0A0F1C` | Dark-first |
| `brand` → `brand-2` | `#45E0A8` → `#28C6E6` | Gradiente "corriente" |
| `brand-press` | `#00B5E2` | |
| `on-brand` | `#04121C` | Texto sobre gradiente (11.3:1 ✓) |

`OPEN` Los hex son aproximaciones extraídas del guideline de botones. **Pendiente confirmación oficial.**

`DECISION` Los tonos de tinta se ajustan para cumplir contraste AA. Ningún token de texto puede quedar por debajo de 4.5:1 sobre las superficies donde se usa.

### Componentes

Cada componente documenta: propósito, variantes, estados (default, hover, focus, active, loading, disabled, error, empty), reglas responsive y specs de motion.

`PRINCIPLE` Si algo se repite, es un componente o un token. Sin excepciones sueltas.

---

## 25. STACK TECNOLÓGICO

| Capa | Elección | Razón |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | SSG, rutas por datos, metadata, i18n por ruta |
| UI | React 19 + TypeScript estricto | |
| Estilos | Tailwind v4 con `@theme` | Tokens como fuente única; exportables a los 3 caminos de producción |
| Motion | `motion` (Framer Motion) | Scroll-driven, `prefers-reduced-motion` nativo |
| Scroll | Lenis | Solo si no hay `prefers-reduced-motion` |
| Fuentes | `next/font` | Autoalojadas, sin FOUT |
| Control de versiones | **Git — obligatorio** | |

`DECISION` Sin librería de i18n externa. La solución por rutas estáticas es suficiente y no añade dependencia ni middleware.

`OPEN` Mapa geográfico real (Mapbox/MapLibre): **no se integra todavía**. Coste y peso no justificados antes de confirmar marca y assets.

---

## 26. ARQUITECTURA TÉCNICA

```
app/
  [lang]/                    # es | en — rutas estáticas por idioma
    layout.tsx               # <html lang> correcto en el HTML servido
    page.tsx                 # Home
    red/page.tsx
    red/[ciudad]/page.tsx
    red/estacion/[slug]/page.tsx
    empresas/page.tsx
    nosotros/page.tsx
    not-found.tsx
  sitemap.ts · robots.ts     # SEO
components/
  ui/                        # primitivas del sistema (agnósticas de contenido)
  layout/                    # Header, Footer, PageShell
  sections/                  # bloques compositivos reutilizables
  home/ red/ empresas/ nosotros/   # composición por destino
content/                     # TODO el copy y los datos, bilingüe
  copy/                      # textos por página
  data/                      # colecciones: estaciones, ciudades, casos, partners
lib/
  i18n/                      # diccionario, resolución de idioma, rutas localizadas
  data/                      # capa de acceso a datos (aísla componentes del origen)
  analytics/                 # capa de tracking desacoplada
```

**Reglas de arquitectura:**

1. `PRINCIPLE` **Server Components por defecto.** `"use client"` solo donde hay estado, evento o API de navegador. El estado actual (todo cliente) es deuda a revertir.
2. `PRINCIPLE` **Los componentes nunca importan datos directamente.** Siempre a través de `lib/data`. Es lo que permite cambiar a CMS o API sin tocar la presentación.
3. `DECISION` **Toda navegación interna usa `next/link`.** Los `<a href>` planos están prohibidos para rutas internas.
4. `DECISION` **Toda imagen usa `next/image`.** Todo video lleva poster, `preload="none"` y lazy-load.
5. `PRINCIPLE` Contenido separado de presentación, siempre.

---

## 27. MODELO DE CONTENIDO Y DATOS

### Estación (colección central)

| Campo | Tipo | Notas |
|---|---|---|
| `slug` | string | Deep link |
| `name` | string | |
| `city` | ref → Ciudad | **Referencia, no string libre** |
| `address` | `{es,en}` | |
| `geo` | `{lat,lng}` | **NUEVO** — mapa, "cómo llegar", SEO local |
| `connectors` | enum[] | CCS1, CCS2, GB-T, Type2 |
| `powerKw` · `points` | number | |
| `status` | enum | `operativa` · `proxima` · `mantenimiento` |
| `hours` | `{es,en}` | |
| `pricing` | struct \| null | **NUEVO** — null si no confirmado |
| `services` | `{es,en}[]` | |
| `media` | `{ photos[], video? }` | **NUEVO** — foto y video por ubicación |
| `featured` | bool | Curaduría |

### Ciudad (nueva colección)

`slug · name · region · description{es,en} · heroMedia? · featured`

### Otras colecciones

- **Métricas de impacto:** `key · value · unit · label{es,en} · source · validated`
- **Casos de éxito:** `slug · client · segment · logo · challenge · solution · results · quote · author`
- **Partners:** `name · type · logo · url · featured`
- **Segmentos B2B:** `key · label · headline · proposition · benefits[] · howItWorks[] · proofRef · cta`
- **Testimonios:** `author · role · organization · quote{es,en} · photo · segment`
- **Leads:** `segment · campos por segmento · consentimiento · mapeo CRM`

`PRINCIPLE` Añadir una estación, ciudad, caso o partner = **un registro, cero rediseño**.

---

## 28. INTERNACIONALIZACIÓN

`DECISION` **i18n por ruta estática, con prefijo de idioma en ambas lenguas.**

```
/es · /es/red · /es/empresas · /es/nosotros · /es/red/estacion/[slug]
/en · /en/red · /en/empresas · /en/nosotros · /en/red/station/[slug]
/  → redirige a /es
```

**Justificación:** el modelo anterior (estado de React) perdía el idioma en cada navegación y hacía el inglés invisible para buscadores — toda la inversión bilingüe rendía cero en SEO. Los prefijos simétricos evitan la duplicación de archivos de ruta y la deriva entre idiomas.

**Reglas:**
- `<html lang>` correcto en el **HTML servido**, no corregido en cliente.
- `hreflang` recíproco entre versiones + `x-default`.
- El selector de idioma **conserva la ruta actual**.
- El idioma se escribe primero en español; el inglés nunca cae silenciosamente al español sin registro.

`OPEN` Localizar los segmentos de URL en inglés (`/en/network` vs `/en/red`) es deseable pero no bloqueante. Decisión aplazada.

---

## 29. SEO Y PERFORMANCE

### SEO técnico (requisitos)

- `metadataBase`, title y description por página, canonical.
- `sitemap.ts` y `robots.ts` generados desde los datos.
- Imagen Open Graph.
- **Datos estructurados:** `Organization` en el sitio; `EVChargingStation` / `LocalBusiness` en cada estación; `BreadcrumbList` en rutas profundas.
- `hreflang` recíproco.
- HTML semántico, un `h1` por página, jerarquía sin saltos.

`PRINCIPLE` **Cada estación y cada ciudad es una landing de búsqueda local.** Es el canal de adquisición B2C más barato del proyecto y debe tratarse como activo, no como subproducto.

### Performance (budget)

| Métrica | Objetivo |
|---|---|
| Lighthouse | ≥ 90 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | saludable |
| Animaciones | 60fps, también en gama baja |
| JS de la ruta principal | **presupuesto explícito; medir antes y después de integrar medios** |

**Reglas:** imágenes AVIF/WebP responsivas · video con poster y lazy-load · solo animar `transform`/`opacity` · Server Components por defecto para reducir el bundle.

---

## 30. ESCALABILIDAD

El sistema debe absorber, sin rediseño de arquitectura:

nuevas estaciones · nuevas ciudades · fotos y video por ubicación · datos de estación · leads B2B · integración CRM · métricas reales · nuevos casos de negocio · ES/EN · APIs futuras (disponibilidad en tiempo real) · crecimiento de la red · actualización de contenido · migración a CMS/headless.

**Habilitadores obligatorios:** contenido como colecciones · capa de datos que aísla la presentación del origen · copy fuera del código · tokens como fuente única · rutas generadas desde datos · formularios con capa de envío desacoplada.

---

## 31. INTEGRACIONES PREVISTAS

| Integración | Estado | Preparación |
|---|---|---|
| CRM (leads) | Sin definir | Capa de envío desacoplada, nombres de campo estables, mapeo explícito |
| Analytics | Sin definir | Capa de tracking desacoplada con nombres de evento estables |
| API de disponibilidad en tiempo real | Futuro | El modelo de estación contempla `status`; la UI no promete tiempo real hasta que exista |
| Mapa geográfico | Diferido | `geo` en el modelo desde ahora |
| App Store / Google Play | Enlaces pendientes | No se publica un enlace sin destino real |
| CMS / headless | Diferido | Contenido y datos ya separados |

### Plan de medición (eventos)

| Evento | Disparador | Propiedades | Funnel |
|---|---|---|---|
| `cta_encontrar_cargador_click` | CTA B2C | contexto, ubicación | B2C |
| `cta_b2b_click` | CTA comercial | contexto | B2B |
| `red_buscar` | Búsqueda en /red | término | B2C |
| `red_filtro_aplicado` | Filtro | tipo, valor | B2C |
| `estacion_vista` | Ficha de estación | slug, ciudad, conector, potencia, estado | B2C |
| `estacion_como_llegar` | "Cómo llegar" | slug | B2C |
| `app_store_click` | Descarga | plataforma, contexto | B2C |
| `empresas_selector_caso` | Selector B2B | segmento | B2B |
| `lead_form_inicio` / `_error` / `_envio` / `_exito` | Formulario | segmento | B2B |
| `caso_visto` · `impacto_visto` | Evidencia | id | Marca |

---

## 32. ASSETS DISPONIBLES

| Asset | Estado | Uso |
|---|---|---|
| Video apertura Universidad EAN (infraestructura, evento, directivos, CEO) | ✅ Confirmado disponible — **archivo no entregado** | Beat de personas y partnership |
| Video CEO explicando la visión desde una estación | ✅ Confirmado disponible — **archivo no entregado** | Beat de visión |
| Video nueva estación Medellín (alta calidad) | ✅ Confirmado disponible — **archivo no entregado** | Signature moment |
| Fotografía real (estaciones, infraestructura, personas, marca) | ✅ Confirmado disponible — **archivo no entregado** | Material transversal |
| Logo Voltop (SVG) | ⏳ Pendiente | |
| Hex de marca exactos | 🟡 Aproximados desde guideline de botones | |
| Tipografías con licencia web | ⏳ Pendiente | |
| Logos de partners con permiso | ⏳ Pendiente | |
| Métricas de impacto validadas | ⏳ Pendiente | |
| Enlaces App Store / Google Play | ⏳ Pendiente | |

`PRINCIPLE` Mientras un asset no llegue, se construye **la estructura correcta para recibirlo** y se marca el hueco. No se rediseña alrededor de su ausencia.

---

## 33. PLACEHOLDERS

**Reglas:**
1. Todo contenido provisional se marca visiblemente y se registra.
2. Las cifras no validadas se muestran como placeholder explícito o no se muestran.
3. **Máximo dos métricas provisionales visibles por página.**
4. Los marcadores de placeholder cumplen contraste AA como cualquier otro texto.
5. Nunca Lorem Ipsum.
6. Un placeholder de media comunica **qué asset falta y para qué**, no solo que falta.

---

## 34. ESTADO ACTUAL DE IMPLEMENTACIÓN

Ver `docs/04-ejecucion/00-registro-de-cambios.md` para el detalle vivo por bloque.

Resumen a 2026-08-11, antes de la transformación:

| Área | Estado |
|---|---|
| Home 7 beats | Implementada; composición y ritmo a rehacer |
| Rutas /red, /red/[estacion], /empresas, /nosotros | Existen; internas con profundidad insuficiente |
| Tokens de color y motion | Implementados; contraste a corregir |
| Botón | Completo (6 estados, radio dual, flecha contextual) |
| Estaciones como datos | Implementado; modelo incompleto (sin geo, media, pricing, ciudad) |
| i18n | Roto entre páginas; a reconstruir por ruta |
| Navegación | `<a>` planos; a migrar a `next/link` |
| Copy | Mayoritariamente inline en JSX; a extraer |
| Accesibilidad | No cumple AA (contraste, touch targets, ARIA, skip link) |
| SEO técnico | Solo metadata por página |
| Analytics | No implementado |
| Media real | Cero assets integrados |
| Control de versiones | No existía |

---

## 35. PENDIENTES

**Bloqueados por entrega externa:** archivos de video y fotografía · logo SVG · hex confirmados · tipografías · métricas reales · logos de partners · enlaces de las tiendas · definición del CRM.

**No bloqueados:** todo lo demás (ver Anexo A y el registro de ejecución).

---

## 36. DECISIONES CONFIRMADAS

1. Arquitectura de 4 destinos: Home · Red · Empresas · Nosotros.
2. Estación como página propia generada desde datos.
3. **Nivel ciudad `/red/[ciudad]`.**
4. Sin páginas separadas por perfil B2B.
5. Un solo CTA global contextual por ruta; **sin CTA en /red**.
6. Dark-first, sin modo claro.
7. Dirección "Infraestructura que cobra vida": mundo real 70% / corriente 30%.
8. Registro dual Silencio ↔ Impacto, con ritmo de intensidad por página.
9. **Gradiente = señal: máximo una acción primaria con gradiente por vista.**
10. Radio dual; una sola flecha contextual.
11. **Composiciones consecutivas no pueden repetir estructura.**
12. **La energía se expresa como respuesta, no como ambiente.**
13. **Sin constelaciones de nodos ni grafos abstractos de fondo.**
14. **i18n por ruta estática con prefijo (`/es`, `/en`).**
15. **Todo el copy fuera del JSX.**
16. **Toda navegación interna con `next/link`.**
17. **Server Components por defecto.**
18. WCAG 2.1 AA como requisito de aceptación, con umbrales numéricos.
19. **Evidencia antes del formulario en B2B; consentimiento explícito obligatorio.**
20. Nunca inventar datos; máximo dos métricas provisionales por página.
21. Analytics con capa desacoplada, implementado con el producto.
22. Camino de producción diferido hasta que el copy esté fuera del código.
23. Sin mapa geográfico real por ahora; `geo` en el modelo desde ya.
24. Git obligatorio.

---

## 37. DECISIONES ABIERTAS

| # | Pregunta | Impacto | Necesita |
|---|---|---|---|
| O1 | Hex exactos, tipografías y logo de marca | Alto — afecta toda la capa visual | Entrega del guideline |
| O2 | ¿Segmentos de URL localizados en inglés? | Bajo | Criterio de marca |
| O3 | CRM objetivo | Medio — define el mapeo de campos | Decisión de negocio |
| O4 | Plataforma de analytics | Medio | Decisión de negocio |
| O5 | ¿Precio por estación público? | Medio — afecta el modelo y la ficha | Decisión comercial |
| O6 | Métricas de impacto a destacar (cuáles dos) | Medio | Datos validados |
| O7 | Proveedor de mapa cuando se integre | Bajo hoy | Diferido |
| O8 | Enlaces reales de las tiendas | Bajo | Entrega |

---

## 38. RESTRICCIONES REALES

- El equipo propietario **no es un equipo de desarrollo**: la solución final debe ser mantenible por perfiles de diseño y contenido.
- El camino de producción no está decidido; la arquitectura no puede cerrarlo.
- Los assets de marca y media dependen de entrega externa.
- **Ley 1581 de 2012 (habeas data, Colombia):** la captura de datos personales exige autorización previa, expresa e informada. Ningún formulario se publica sin consentimiento y sin política de tratamiento.
- Las cifras de impacto no están validadas y no pueden inventarse.

---

## 39. RIESGOS Y DEUDA CONOCIDA

| Riesgo | Mitigación |
|---|---|
| La marca definitiva obliga a rehacer composiciones | Escala tipográfica tokenizada; no pulir tipografía hasta tenerla |
| Los assets no llegan y el prototipo se evalúa con cajas grises | Estructura lista para recibirlos; placeholders informativos; plan B de producción propia |
| Decidir el camino de producción con información incompleta | Bloqueado hasta que el copy salga del código |
| Deriva entre documentación e implementación | Este documento como SSOT + registro de cambios por bloque |
| Todo cliente → bundle grande cuando entren los videos | Migración progresiva a Server Components |
| Un patrón ARIA incompleto degrada más que ayuda | Solo patrones completos o ninguno |

---

## 40. DEFINITION OF DONE

Ningún componente o página se considera terminado hasta pasar, **en orden**, los siete checkpoints. Si uno falla, se devuelve antes de continuar.

**1 · UX** — Objetivo primario claro y métrica asociada. Journey sin fricción ni callejones. CTA correcto y no competido. Contenido suficiente para explicar, confiar y convertir. **Doble pregunta superada.**

**2 · UI / Art direction** — Cada bloque con intención. Ninguna prohibición presente sin justificación documentada. **Ritmo de página deliberado: secciones consecutivas con estructura distinta.** Máximo un gradiente primario por vista. Test del anonimato superado. Todo valor visual desde tokens.

**3 · Responsive** — Composición propia en desktop, laptop, tablet y móvil. Tipografía fluida. Touch targets ≥44px. Cero overflow. Medida de línea controlada.

**4 · Accesibilidad** — Todos los umbrales de §23 verificados, no asumidos.

**5 · Motion** — Movimiento con propósito, desde tokens, solo `transform`/`opacity`. Signature moments acotados. `prefers-reduced-motion` con alternativa equivalente verificada.

**6 · Performance** — Budget de §29 cumplido y medido, incluida gama baja.

**7 · QA final** — Build y lint limpios. Navegación verificada (sin recargas completas, idioma conservado). Analytics instrumentado. Placeholders marcados y registrados. Enlaces sin destinos muertos. Registro de cambios actualizado.

`PRINCIPLE` **Un checkpoint no se aprueba por criterio subjetivo cuando existe un umbral medible.** Si hay un número, se mide.

---

## ANEXO A — CONSERVA / MODIFICA / ELIMINA

### CONSERVA (validado, no tocar sin razón)

Arquitectura de 4 destinos · estación como página desde datos · componente `Button` (6 estados, radio dual, flecha contextual) · disciplina de placeholders y flag `validated` · `prefers-reduced-motion` con Lenis desactivado · foco visible global · paleta dark-first y gradiente de marca · tratamiento mono + hairlines para datos técnicos · el beat de visión del CEO como referencia de registro editorial · tipado estricto y `cn()` sin dependencias · SSG con `generateStaticParams`.

### MODIFICA

| Qué | A qué |
|---|---|
| Tokens de tinta | Valores que cumplan AA |
| Navegación `<a>` | `next/link` |
| i18n por estado | i18n por ruta con prefijo |
| Copy inline | Capa de contenido |
| Modelo de estación | + geo, media, pricing, referencia a ciudad |
| Tamaños ad-hoc | Escala tipográfica y de espaciado tokenizadas |
| `/red` decorativa | Herramienta funcional (buscador y filtros reales) |
| `/empresas` y `/nosotros` | Profundidad real; evidencia antes del formulario |
| CTA del header | Contextual por ruta |
| Composición de la Home | Estructura distinta por beat; ritmo real |
| Beat de Medellín | Sticky con scroll-scrub |
| Footer | 3 columnas, destinos reales |
| Selector B2B | Patrón accesible completo |
| Formulario | Consentimiento, `autocomplete`, errores, anuncios |
| Componentes en `components/home/` que sirven a otras rutas | Reubicados por dominio |

### ELIMINA

`components/home/Paths.tsx` (huérfano) · constelación de nodos del hero · pills no funcionales de `/red` · segundo CTA redundante del preview de Red · métricas del footer · puntos de gradiente decorativos de los eyebrows · spans de redes sociales no interactivos · enlaces `#` sin destino · `text-amber-400` fuera de tokens · animaciones ambientales infinitas · `scroll-behavior: smooth` duplicado con Lenis.

---

## ANEXO B — DECISIONES SUPERSEDED

| Decisión anterior | Documento origen | Reemplazada por | Razón |
|---|---|---|---|
| Estación como **panel/drawer** deep-linkable | `01-ia/02` §1 | Página propia `/red/estacion/[slug]` | SEO local, compartibilidad, media por ubicación |
| Home de **8 secciones** (Paths, Cómo funciona, Confianza, Marca) | `01-ia/02` §2 | Home de 7 beats narrativos | "La Home presenta, las internas profundizan" |
| Narrativa Home **v2** | `02-art-direction/07` | Narrativa v3 / 7 beats | Reencuadre hacia el mundo real |
| **Corriente como gráfico abstracto** protagonista (constelación de nodos) | `02-art-direction/05`, `06` | Corriente como comportamiento **sobre material real** | Reencuadre 70/30 y prohibición de grafos genéricos |
| Bilingüe por **estado de cliente** | Implementación previa | i18n por ruta estática | El idioma se perdía al navegar; inglés no indexable |
| Copy bilingüe **inline en componentes** | Implementación previa | Capa de contenido | Sin traducción, revisión editorial ni ruta a CMS |
| Métricas de impacto en **múltiples bloques por página** | Implementación previa | Máximo dos provisionales por página | Diez placeholders destruyen la credibilidad |
| **CTA global permanente** en todas las rutas | `01-ia/03` (parcial) | CTA contextual, ausente en `/red` | Redundante donde el usuario ya está |
| Ciudad como **string libre** en la estación | `01-ia/05` | Entidad Ciudad con ruta propia | Filtros reales y SEO local |
| Nivel objetivo alcanzable **añadiendo assets** | Supuesto implícito | Requiere rehacer la capa compositiva | Cuatro beats consecutivos comparten estructura |

---

## ANEXO C — DOCUMENTOS HISTÓRICOS

Los documentos en `docs/00-discovery/`, `docs/01-ia/`, `docs/02-art-direction/`, `docs/03-design-system/` y `docs/05-assets-todo/` se conservan como **registro de investigación y razonamiento**. Contienen el *porqué* de muchas decisiones y siguen siendo útiles.

`PRINCIPLE` **No son normativos.** Ante cualquier contradicción, prevalece este Master Project Definition y su Anexo B.
