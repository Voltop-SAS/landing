# Entorno de trabajo, skills y reglas

Estado a **2026-09-04**. Este documento existe para que el proyecto pueda
retomarse desde el repositorio corporativo **sin reconstruir su contexto a
mano**. Clasifica cada pieza según si viaja con el código, si hay que
instalarla, o si depende de algo externo.

---

## A · Viaja con el proyecto

Está dentro del repositorio y llega con el ZIP. No hay que hacer nada. Desde el
2026-09-04 esto **incluye las skills de terceros**, que antes había que
reinstalar (ver la sección B).

| Pieza | Dónde | Qué es |
|---|---|---|
| **Las 7 skills propias de Voltop** | `.claude/skills/voltop-*/` | El criterio del proyecto, escrito. Ver la tabla de abajo |
| Documentación | `docs/` | 30 documentos. `MASTER-PROJECT-DEFINITION.md` es la norma |
| Configuración de herramientas | `eslint.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `next.config.ts` | |
| Template de entorno | `.env.example` | Las dos variables opcionales |
| Lockfiles | `package-lock.json`, `skills-lock.json` | Instalación exacta y restauración de skills |

### Las 7 skills propias

Son el criterio del proyecto convertido en instrucciones. **Se cargan cuando se
trabaja con un asistente de IA en este repositorio** y son la razón de que las
decisiones sean consistentes entre sesiones.

| Skill | Cubre |
|---|---|
| `voltop-art-direction-ui` | Dirección de arte, reglas con umbral numérico, prohibiciones, Visual QA y la doble pregunta |
| `voltop-design-system` | Tokens, componentes, responsive, modelo de contenido, i18n, formularios |
| `voltop-frontend-motion` | Arquitectura front-end, interaction design, motion y analytics |
| `voltop-ux-strategy` | Journeys B2C/B2B, jerarquía, CTAs, funnels y plan de medición |
| `voltop-ux-writing` | Tono, reglas duras de copy, estados, errores, SEO copy |
| `voltop-quality-compliance` | WCAG 2.1 AA, Core Web Vitals, SEO técnico y cumplimiento de datos |
| `voltop-review-gate` | El gate de calidad: UX → UI → Responsive → A11y → Motion → Performance → QA |

## B · Las 10 skills de terceros — también viajan

**Cambió el 2026-09-04.** Antes se ignoraban y se restauraban con
`npx skills experimental_install`. Ahora van dentro del repositorio.

El motivo no es técnico: quien clonaba se encontraba el proyecto **sin el
criterio con el que se construyó**, y tenía que saber que existía un paso extra
para recuperarlo. Las skills son parte de cómo se trabaja aquí. Pesan 644 KB
entre las dos carpetas; el argumento del tamaño no aplicaba.

Instaladas (10): `accessibility-auditor`, `animate`, `emil-design-eng`,
`apple-design`, `review-animations`, `improve-animations`, `skill-creator`,
`humanizer`, `systematic-debugging`, `brainstorming`.

**Están en dos sitios, y siete son enlaces simbólicos.** El CLI de skills cambió
de destino a mitad del proyecto: las de terceros viven de verdad en
`.agents/skills/`, y `.claude/skills/` tiene siete enlaces relativos que apuntan
allí. Los enlaces se versionan y resuelven bien porque su destino también viaja.

> **En Windows** los enlaces simbólicos de git necesitan `core.symlinks=true` y
> modo desarrollador activado. Si aparecen como ficheros de texto con una ruta
> dentro, es eso. En macOS y Linux no hay que configurar nada.

`skills-lock.json` sigue versionado: ya no hace falta para instalar, pero dice
de qué versión viene cada una y permite actualizarlas con `npx skills update`.

Dos traen licencia de terceros y viaja con su código, que es lo que ambas
exigen: `skill-creator` (Apache 2.0) y `humanizer` (MIT).

> Se retiraron 30 skills el 2026-09-03. El motivo no era el disco: **quince
> skills genéricas de diseño competían con las siete `voltop-*`**, que son el
> criterio de este proyecto. Una recomendación genérica que contradice el design
> system propio lo diluye. Si vuelves a instalar skills, revisa esa tensión.

### Herramientas de desarrollo

| Herramienta | Instalación | Para qué |
|---|---|---|
| Node ≥ 20.9 | gestor de versiones del equipo | Declarado en `package.json` |
| `puppeteer-core` | ya está en `devDependencies` | **Es la herramienta de verificación visual del proyecto.** No es un framework de tests: se usa para medir en el navegador real |
| Google Chrome | instalación normal | `puppeteer-core` no trae navegador: usa el Chrome del sistema |

**Cómo se valida en este proyecto.** No hay suite de tests unitarios, y es una
decisión: lo que hay que verificar es geometría, contraste y comportamiento en
el navegador. El método es un script de Node que abre Chrome, recorre rutas y
viewports y **mide**. Los checks que se han estado ejecutando en cada cambio:

1. **27 combinaciones** de ruta × viewport (9 rutas × 3 viewports): estado HTTP,
   elementos invisibles, desbordes, `h1` por página, `img` sin `alt`, enlaces
   sin nombre accesible, objetivos táctiles < 44px, errores de JS.
2. **`prefers-reduced-motion`**: cero invisibles, cero `transform`, cero
   `clip-path`, sección signature colapsada.
3. **Barrido de anchos**: 22 anchos de 320 a 1920px buscando desbordes y texto
   cortado.
4. **Contraste sobre el píxel compuesto** a percentil 99 cuando hay texto sobre
   fotografía o vidrio.
5. **FPS durante el scroll** con la CPU frenada ×4 y ×6.

Los scripts eran de un solo uso y `.gitignore` excluye `/*.mjs` de la raíz a
propósito. **Reproducirlos es directo** con `puppeteer-core` + el Chrome del
sistema; lo que importa es la lista de comprobaciones de arriba, no el script.

## C · Depende de algo externo

| Dependencia | Estado | Qué hay que hacer |
|---|---|---|
| **`app.voltop.co`** | Funcionando (307 → `/download`) | Es el destino del CTA principal del header. Si cambia el dominio, se edita `src/core/common/domain/consts/links.ts` |
| **Tiendas de apps** | App Store `id6759729784` · Google Play `co.voltop.charging` | Enlaces en `src/core/common/domain/consts/links.ts` |
| **Google Tag Manager** | Contenedor `GTM-WJ5S2LBF` | No es un secreto. Configurable con `NEXT_PUBLIC_GTM_ID`. **La plataforma de destino de los eventos sigue sin definir**: `src/core/common/infrastructure/analytics` solo hace `dispatch` a `dataLayer` |
| **Formulario B2B** | `mailto:` a tres direcciones de `@voltop.co` | En `src/core/common/domain/consts/links.ts`. Funciona sin servidor pero pierde a quien no tenga cliente de correo y expone las direcciones. Un servicio de formularios lo resuelve cambiando una función |
| **Másteres de media** | `~/Voltop-masters-originales/` en la máquina de origen, ~609 MB | **NO están en el repositorio.** Pendiente subirlos a un almacenamiento compartido: hoy existen en una sola máquina |
| **Consulta legal del aviso de cookies** | Pendiente | El mecanismo funciona y bloquea la analítica hasta el consentimiento. Falta que un abogado confirme redacción y suficiencia |

---

## Las reglas de trabajo del proyecto

Esto vivía **solo en la memoria local del asistente** y se habría perdido en el
handoff. Queda aquí porque es el criterio con el que se tomaron las decisiones.

### 1 · Simplicidad intencional

**Complejidad detrás, simplicidad delante, riqueza en la experiencia.**

**Matiz crítico:** "menos, pero mejor" **NO** significa web básica ni vacía. No
es "mucho espacio en blanco + titular gigante + botón". El objetivo no es la web
más simple posible, sino la experiencia más **clara** posible con el nivel de
sofisticación y detalle necesarios para causar efecto.

Este proyecto se corrigió en las **dos** direcciones: primero por resolver
demasiado en la Home, después por vaciar pantallas. Los dos errores cuestan lo
mismo.

**La doble pregunta, obligatoria en toda revisión de UX y UI:**
1. **Restar:** ¿podemos quitar, combinar o hacer contextual algo? ¿Cada elemento
   justifica su existencia?
2. **Sumar:** ¿hay suficiente riqueza, carácter y diferenciación para que esto se
   sienta como Voltop y no vacío ni genérico?

Un componente falla por sobrecargado **o** por vacío. Nunca evaluar solo una
dirección. **Test del anonimato:** si al cambiar logo y color esto podría ser
cualquier startup, no está listo.

### 2 · Verificar, no asumir

**No se afirma nada verificable sin medirlo.** No es celo: el hábito encontró
errores que a simple vista se veían bien. Casos reales de este proyecto:

- Un filtro de potencia con dos escalones que **no devolvían ninguna estación**.
- `.measure` declaraba "45–75 caracteres" y rendía **83**.
- Un flotante que tapaba un CTA **al 100%** sin ninguna posición de scroll que
  lo liberara.
- El CTA principal apuntando a un dominio que devolvía **503**.
- Un QR que había que **decodificar** para saber que llevaba a la URL correcta:
  uno mal generado se ve idéntico a uno bueno.
- El vídeo de una entrada **duplicado y sin audio**, porque se renderizaba sin
  `controls` y el componente lo trataba como material de fondo.

**Cómo aplicarlo:** medir sobre el render y no sobre el token. Preferir que el
dato **se calcule desde el dataset** antes que escribirse: la forma más segura de
no inventar una cifra es no poder escribirla. Y **cuando una comprobación dé un
resultado sospechoso, dudar primero del método de medición** — en este proyecto
pasó tres veces: un `clip` de captura en coordenadas de página, un glob sin
comillas y un `sizes` que prometía menos ancho del necesario.

### 3 · Un titular es un contrato

No se promete lo que el producto no hace. Si no hay integración de
disponibilidad en vivo, ningún texto dice "en tiempo real". Cero cifras
inventadas: lo que falta se declara. Máximo dos placeholders de métrica visibles
por página.

### 4 · Cómo se comunica el trabajo

Regla permanente del proyecto: **análisis profundo, comunicación simple.** El
responsable es Product Designer / UX Lead, **no desarrollador**: cuando una
decisión técnica tiene consecuencias de producto, se explica la consecuencia y
no la implementación.

Al terminar cada bloque significativo, **registrar qué cambió y por qué** en
`docs/04-ejecucion/00-registro-de-cambios.md` con la evidencia que lo validó.
Ese registro es la razón de que este handoff sea posible.

### 5 · Los comentarios del código son documentación

Este proyecto tiene comentarios largos, y son deliberados: explican **por qué**
una decisión es como es, con el número que la respalda. Varias veces evitaron
que se "arreglara" algo que estaba bien.

**No los borres por concisión.** Si cambias el comportamiento que describen,
actualízalos: un comentario que miente es peor que ninguno.
