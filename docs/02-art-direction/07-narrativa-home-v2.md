# Fase 3/5 · Narrativa de la Home v2 — Mundo real como material narrativo

> Cambio de dirección: menos dependencia de dark UI + grid + líneas/nodos + cards; foto/video reales como parte de composición, storytelling, scroll y signature moments. Fecha: 2026-07-23. Sin código: propuesta para revisión.

## Reencuadre del concepto
**Infraestructura (70%) = mundo real** (estaciones, vehículos, espacios, personas, partners, eventos). **Corriente (30%) = comportamiento/movimiento que le da vida** — NO líneas verdes/nodos/glows sueltos. La corriente pasa a ser un **acento sobre el mundo real** (luz que recorre un cable/estación real, pulso sincronizado con una carga, transiciones entre escenas físicas), no un gráfico abstracto autónomo. Lo digital enmarca; lo físico protagoniza.

Arco narrativo objetivo:
`Sistema digital → Mundo físico → Información → Interacción → Personas → Infraestructura → Impacto`
Foto y video funcionan como **respiración y contraste** frente a las secciones de UI/datos → refuerzan el ritmo.

---

## 1) Revisión de la Home actual bajo esta perspectiva
- **Demasiado digital:** hero abstracto (grid+corriente), y casi todo son contenedores oscuros. El "mundo real" está **ausente**.
- **Corriente reducida** a líneas/nodos/glow → riesgo genérico, justo lo que queremos evitar.
- **Exceso de cards/contenedores** (ver §7).
- **Falta contraste físico:** no hay respiración de imagen; todo pesa lo mismo visualmente.
- Lo bueno a conservar: tokens dark-first, el gradiente de marca, la utilidad de Red, el formulario B2B, el sistema de ritmo Silencio↔Impacto (ahora se enriquece con físico↔digital).

## 2) Redistribución de fotografía y video en la narrativa
Principio: **1 pieza audiovisual fuerte por beat**, full-bleed o editorial, nunca "galería". Alternar físico (respiración) con UI/datos.

| Beat | Registro | Media real |
|---|---|---|
| Hero | digital→físico | Video Medellín (o foto estación) |
| Qué es / Cómo funciona | información (UI ligera) | Foto de apoyo (estación/uso) |
| La Red | interacción (UI) | Foto real de estación junto al mapa |
| Personas / Partnership | personas (físico) | Contenido EAN (evento, directivos, CEO) |
| Infraestructura | infraestructura (físico, signature) | Video/foto Medellín full-bleed |
| Empresas | interacción/conversión | Foto de espacio comercial real |
| Visión / CEO | personas/marca (físico) | Video CEO desde estación |
| Impacto / cierre | impacto | Números sobre imagen real (red/vehículos) |

## 3) Qué mantener / modificar / combinar / eliminar
- **Hero** → **MODIFICAR**: de abstracto a "sistema digital que revela el mundo físico" (§4).
- **Dos caminos (Paths)** → **COMBINAR** con "Cómo funciona" en un único beat de **Información** más editorial + una foto de apoyo (menos cards).
- **La Red (Network)** → **MANTENER** (utilidad) pero **aligerar**: menos peso de card, y contrastar el mapa con **foto real** de estación.
- **Cómo funciona** → **COMBINAR** en el beat de Información (arriba).
- **Empresas (Business)** → **MANTENER** (conversión) pero **aligerar** contenedores y anclar con **foto real** de espacio comercial.
- **Confianza (Trust)** → **DIVIDIR/MODIFICAR** en dos beats: **Personas** (EAN + testimonios como retratos) e **Impacto** (números sobre imagen).
- **Visión del fundador (cita)** → **MODIFICAR** a beat cinematográfico con **video del CEO** (§6).
- **Cierre (FinalCta)** → **MANTENER** sobre imagen real de infraestructura.
- **NUEVO** → beat **Infraestructura** (Medellín) y beat **Personas/Partnership** (EAN).

> Resultado: número de beats similar (menos, pero mejor), pero ahora **físico-forward**. No se agregan "secciones de video"; el video vive dentro de la narrativa.

## 4) Video de Medellín como signature moment — 2 alternativas

**Alternativa A — "Hero cinematográfico"**
El video de Medellín es el fondo full-bleed del Hero (autoplay silencioso, en loop, con poster), con la **corriente como acento sutil** sobre la imagen y el titular + "Encontrar cargador" encima. El arco *digital→físico* ocurre de inmediato.
- ✅ Wow inmediato + mundo real desde el primer segundo; máxima potencia de marca.
- ⚠️ Riesgo de LCP/performance (video pesado arriba); requiere poster + carga diferida cuidada; legibilidad del texto sobre video (scrim).

**Alternativa B — "Revelación al scroll" (recomendada)**
Hero ligero y rápido: arranca con la **corriente digital** que, al hacer scroll, **se disuelve y revela** el video de Medellín en un beat **Infraestructura** dedicado (video que escala a full-bleed con scroll-scrub; la corriente traza la estación real). Literalmente *sistema digital → mundo físico*.
- ✅ Mejor performance (hero liviano, video diferido); un signature moment mid-page con respiración; narrativa explícita del arco.
- ⚠️ Coreografía de scroll más compleja; hay que dosificar para no marear.

**Recomendación:** **B** (o híbrido: hero con foto/still + un breve destello de corriente, y Medellín como revelación full-bleed a mitad). Mantiene el hero rápido y da un momento físico memorable.

## 5) Dónde tiene mayor valor el contenido de EAN
Beat **Personas / Partnership** (mundo físico + humano):
- Cuenta la historia de **crecer con partners** reales (universidad): evento, directivos, CEO, contexto de alianza.
- Doble función: **prueba humana B2C** (confianza) + **prueba B2B** (un propietario/empresa ve un partnership exitoso real).
- Formato: editorial + foto/clip del evento; **cita real** de un directivo como tipografía protagonista; NO galería. Ubicarlo **antes o junto a Empresas** para alimentar la conversión B2B.

## 6) Integrar el video/visión del CEO sin caer en "web corporativa"
Evitar: talking-head centrado + botón play + bloque de bio.
Proponer: beat **cinematográfico y breve** —
- Still/loop del CEO **en una estación real** (mundo físico), a gran escala.
- Sus palabras como **tipografía editorial protagonista** (pull-quote), no como subtítulo de un reproductor.
- Reproducción **ambiental o al interactuar**, clip corto (p. ej. 0:30–0:45), con affordance discreta ("Ver la visión · 0:45").
- Integrado al lugar y a la marca (no un módulo "About"). Humano, con contexto físico, sin corporativismo.

## 7) ¿Demasiadas cards/contenedores? — auditoría
Sí. Uso actual de contenedores con borde/superficie:
- Paths (2 cards) · tarjetas de estación (4) · testimonios (2 cards) · impacto (4 cards) · panel de valor B2B · contenedor del formulario · franja de logos.
**Plan de reducción:**
- Paths → split editorial (sin cards) con foto.
- Testimonios → **citas sobre retratos** (personas), sin card.
- Impacto → números **sobre imagen full-bleed** o banda editorial limpia (sin 4 cajas).
- Panel de valor B2B → inline (sin caja).
- Estaciones → **mantener** card (es dato funcional legítimo), pero borde más sutil.
- Formulario → mantener contenedor (es un formulario), aligerado.
Regla: card solo cuando agrupa datos accionables; para narrativa, usar composición/imagen/tipografía.

## 8) Oportunidades de composición editorial (en lugar de más componentes)
- **Full-bleed foto/video** como secciones que respiran (una imagen potente = una sección).
- **Tipografía sobre imagen** (titulares grandes sobre estación real, con scrim de legibilidad).
- **Splits editoriales** imagen/texto asimétricos (no columnas iguales).
- **Scroll storytelling**: la corriente traza elementos reales; transiciones entre escenas físicas.
- **Espacio y ritmo**: dejar que el mundo real cargue el peso visual; la UI se vuelve ligera y precisa.
- **Corriente como acento sobre lo real** (luz en un cable/estación), no gráfico aparte.

---

## Propuesta de flujo Home v2 (para revisar)
1. **Hero** — digital→físico (Medellín, según §4).
2. **Información** — qué es + cómo funciona (editorial + foto de apoyo). [Paths+HowItWorks combinados]
3. **La Red** — interacción: mapa + estaciones (dato) contrastado con foto real.
4. **Personas / Partnership** — EAN (evento, directivos, CEO, alianza) + testimonios como retratos.
5. **Infraestructura** — Medellín full-bleed (signature si se eligió B).
6. **Empresas** — selector B2B + formulario, anclado con foto de espacio comercial.
7. **Visión / CEO** — cinematográfico, palabras como tipografía (§6).
8. **Impacto + Cierre** — números sobre imagen + CTA final.

> Ritmo físico↔digital: 1(mix) → 2(UI+foto) → 3(UI+foto) → 4(físico) → 5(físico full-bleed) → 6(UI+foto) → 7(físico) → 8(mix). Alterna respiración real y precisión digital.

## Decisiones para cerrar antes de implementar 🔶
1. ¿Medellín como **Hero cinematográfico (A)** o **revelación al scroll (B, recomendada)**?
2. ¿Ubicar **EAN/Personas antes de Empresas** (para alimentar B2B) — de acuerdo?
3. ¿Combinamos **Paths + Cómo funciona** en un solo beat de Información?
4. ¿Confirmas la **reducción de cards** propuesta (testimonios→retratos, impacto→sobre imagen)?
5. ¿Puedes compartir los archivos (video/foto) y sus duraciones/versiones para dimensionar performance?
