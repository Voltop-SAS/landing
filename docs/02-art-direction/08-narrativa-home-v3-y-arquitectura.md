# Fase 3/5 · Narrativa Home v3 + Arquitectura multipágina

> Definitivo (supersede `07-narrativa-home-v2.md`). Dos premisas: (1) **La Home presenta, las páginas internas profundizan**; (2) **mundo real (foto/video) como material narrativo**. Reencuadre 70% Infraestructura (mundo real) / 30% Corriente (comportamiento/energía que le da vida). Fecha: 2026-07-23. Sin código.

## Principio rector
**LA HOME PRESENTA · LAS PÁGINAS INTERNAS PROFUNDIZAN.**
La Home conecta los journeys y genera interés; no sustituye a Red, Empresas ni Nosotros. Cada bloque justifica su existencia; ni Home larga ni colección de secciones.

---

## 1) Auditoría de la Home actual bajo las nuevas premisas
La Home actual **resuelve demasiado** (contenido que pertenece a páginas internas) y es **demasiado digital**:
- **Red**: mapa + 4 filtros + 4 tarjetas de estación + handoff → esto es la **página Red**, no la Home.
- **Empresas**: selector completo de 4 casos + **formulario de leads** → esto es la **página Empresas**.
- **Confianza**: grid de 4 impactos + logos + 2 testimonios (cards) → profundidad de **Nosotros**.
- **Cómo funciona**: onboarding B2C → pertenece a Red/driver.
- **Estética**: dark UI + grid + líneas/nodos + cards; **sin mundo real**; Corriente reducida a gráfico abstracto.

## 2) Qué eliminar / reducir / combinar / mover a páginas internas
| Bloque actual | Acción | Destino |
|---|---|---|
| Red (mapa+filtros+lista+handoff) | **Reducir a preview** (2–3 estaciones destacadas + "Encontrar cargador") | Full → **/red** |
| Empresas (selector + formulario) | **Reducir a propuesta + CTA** | Selector+form → **/empresas** |
| Cómo funciona (3 pasos) | **Mover** | **/red** (driver) |
| Dos caminos (Paths) | **Eliminar/fusionar** (el nav ya enruta; el hero + previews cumplen) | — |
| Confianza (impacto+logos+testimonios) | **Reducir**: teaser de impacto + franja de partners; 1 testimonio fuerte | Full → **/nosotros** |
| Cita fundador | **Transformar** en teaser de Visión/CEO (pieza breve) | Full → **/nosotros** |
| — | **Añadir** beat **Infraestructura real (Medellín)** | Home |
| — | **Añadir** beat **Caso real (EAN)** | Home (y refuerza /empresas y /nosotros) |

Resultado: Home más corta, física y narrativa; la utilidad y la profundidad viven en las internas.

## 3) Nueva narrativa de la Home (recomendada)
Evalué tu hipótesis y propongo una versión **más ajustada** (7 beats), fusionando escala+caso para no alargar:

1. **Hero — Propuesta Voltop** *(digital → físico)*
2. **Infraestructura real — Medellín** *(mundo físico, signature)*
3. **Red — preview + "Encontrar cargador"** *(interacción, enlaza a /red)*
4. **Empresas — propuesta + acceso** *(enlaza a /empresas)*
5. **Caso real + escala — EAN** *(personas + impacto como prueba, enlaza a /nosotros)*
6. **Visión — CEO** *(pieza breve, enlaza a /nosotros)*
7. **Cierre — CTA**

> Variante si prefieres separar escala: 8 beats con "Escala e impacto" propio entre 5 y 6 (tu hipótesis). Recomiendo fusionar (menos, pero mejor). Ritmo físico↔digital: 1(mix) → 2(físico full-bleed) → 3(UI+foto) → 4(UI+foto) → 5(físico/humano) → 6(físico) → 7(mix).

## 4) Función de cada sección (por qué existe)
1. **Hero**: qué es Voltop en segundos + acción B2C. Establece tono digital→físico.
2. **Infraestructura (Medellín)**: prueba de mundo real, escala e ingeniería. Rompe lo genérico.
3. **Red preview**: muestra que hay dónde cargar y **enruta a /red** (no resuelve el mapa aquí).
4. **Empresas preview**: planta la propuesta B2B y **enruta a /empresas** (sin formulario aquí).
5. **Caso EAN**: confianza por evidencia humana + partnership; alimenta B2C y B2B.
6. **Visión/CEO**: propósito y liderazgo, breve; **enruta a /nosotros**.
7. **Cierre**: conversión (B2C encontrar cargador / B2B hablar con el equipo).

## 5) Dónde integrar fotografía y video
- **Hero**: still/loop físico o corriente que revela lo físico (ver §6).
- **Infraestructura**: **video Medellín full-bleed** (signature).
- **Red preview**: **foto real** de estación junto a un mapa-teaser ligero.
- **Empresas preview**: **foto real** de un espacio comercial/flota.
- **EAN**: **clip/foto del evento** (infra, directivos, CEO) en composición editorial (no galería).
- **Visión/CEO**: **video del CEO** en estación, breve, palabras como tipografía.
- **Cierre**: fondo de infraestructura real.
Foto/video = **respiración y contraste** frente a la UI/datos.

## 6) Video de Medellín como signature moment — 2 alternativas
**Alternativa A — Hero cinematográfico.** Medellín como fondo full-bleed del Hero (loop silencioso + poster), corriente como acento sobre la imagen, titular + CTA encima.
- ✅ Wow inmediato + mundo real desde el segundo 1.
- ⚠️ Cuidar LCP/performance y legibilidad (scrim); hero pesado.

**Alternativa B — Revelación al scroll (recomendada).** Hero ligero con corriente digital que, al scrollear, **se disuelve y revela** Medellín en un beat Infraestructura full-bleed (escala/scrub; la corriente traza la estación real).
- ✅ Arco digital→físico explícito; hero rápido; wow a mitad de página; mejor performance.
- ⚠️ Coreografía de scroll más compleja (dosificar).

## 7) Papel del contenido EAN
Beat **Caso real** (personas + partnership): evento, infraestructura, directivos de la universidad y CEO. Función:
- **Confianza B2C** (proyecto real, en operación) y **prueba B2B** (partnership exitoso → convence a empresas/propietarios).
- En Home: **una** pieza editorial fuerte (cita de un directivo como tipografía + foto/clip). La versión ampliada (caso completo) vive en **/nosotros** o como caso en **/empresas**.

## 8) Visión del CEO sin volver la Home corporativa
- **No**: talking-head centrado + play + bio.
- **Sí**: pieza **cinematográfica breve** — CEO en una estación real, sus **palabras como tipografía protagonista** (pull-quote), video ambiental/al interactuar (0:30–0:45), integrado al lugar. Enlace "Conoce a Voltop → /nosotros" para la historia completa. Emoción y propósito, no institucionalidad.

## 9) ¿Demasiadas cards / grids / recursos "tech"?
Sí. Además de mover profundidad a internas (§2), reducir en Home:
- Testimonios → **cita sobre retrato** (persona), sin card.
- Impacto → números **sobre imagen** (no 4 cajas).
- Paths → eliminado/fusionado.
- Grid/líneas/nodos → como **acento sobre foto/video**, no gráfico autónomo.
- Conservar card solo para **datos accionables** (estaciones en /red, formulario en /empresas).
Objetivo: composición editorial, full-bleed, tipografía y espacio > más componentes.

## 10) Relación Home → páginas internas
```
Home (presenta)
├── Red (profundiza)            /red
│   └── Estación (detalle)      /red/[estacion]   ← colección escalable
├── Empresas (profundiza)       /empresas
└── Nosotros (profundiza)       /nosotros
```
- **Home → /red**: el preview + "Encontrar cargador" llevan al **mapa completo + buscador + filtros + lista** en `/red`.
- **/red → /red/[estacion]**: cada estación es **página propia** (no solo panel), con contenido propio: nombre, ciudad, dirección, **fotos/video si existe**, potencia, conectores, servicios, horarios, estado, cómo llegar (enviar a Maps), etc. **Abrir una estación nueva = un registro nuevo; la Home NO cambia.** (Refina la IA previa: estación pasa de panel a página + deep-link.)
- **Home → /empresas**: la propuesta B2B en Home lleva a `/empresas`, donde vive el **selector de casos (progressive disclosure), evidencia, partnerships y el formulario de leads segmentado (CRM-ready)**.
- **Home → /nosotros**: teaser de visión/impacto/CEO lleva a `/nosotros`, con **historia, escala, liderazgo, impacto completo y casos**.

> Modelo de datos de estación ya definido en `docs/01-ia/05-modelo-contenido-escalable.md` (se amplía con `fotos[]`, `video?`, `servicios[]`, `comoLlegar`).

## 11) Estructura del footer (ordenado, no megafooter)
Header intacto: `Red · Empresas · Nosotros + CTA contextual + ES/EN`.
Footer con navegación secundaria/utilitaria agrupada:

- **Producto/Red:** Encontrar cargador · Cómo cargar · Descargar app · Hospedar una estación
- **Empresas:** Empresas · Flotas · Espacios · Partners
- **Compañía:** Nosotros · Impacto · Inversionistas/prensa
- **Soporte:** Contacto · Ayuda/Soporte · Estado del servicio (si aplica)
- **Legal:** Términos · Privacidad / tratamiento de datos
- **Base:** logo + tagline · redes sociales · **ES/EN** · © + info corporativa necesaria

Filosofía: agrupado y escaneable; solo lo necesario. Nada de columnas infladas ni enlaces duplicados sin propósito.

---

## Implicación para el código (cuando aprobemos)
- **Refactor de la Home** a previews (Red/Empresas/Nosotros dejan de resolverse en Home).
- **Crear rutas**: `/red`, `/red/[estacion]`, `/empresas`, `/nosotros` (mover ahí el mapa/lista, selector+form, impacto/testimonios/CEO completos).
- **Integrar media real** (Medellín, EAN, CEO, fotos) como material narrativo.
- Ampliar footer.

## Decisiones para cerrar antes de implementar 🔶
1. ¿Narrativa Home de **7 beats (recomendada)** o **8** (con "Escala e impacto" separado)?
2. Medellín: **A (hero cine)** o **B (revelación al scroll, recomendada)**.
3. ¿Confirmas mover **mapa/filtros → /red**, **selector+formulario → /empresas**, **impacto/testimonios/CEO completo → /nosotros**?
4. ¿Estación como **página propia** `/red/[estacion]` (recomendado) confirmado?
5. Compartir archivos de video/foto (orientación, duración, versiones, permisos) para dimensionar performance.
