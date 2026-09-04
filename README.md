# Voltop Web

Sitio público de **Voltop**, red de carga para vehículos eléctricos en Colombia.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion.

> **Antes de cambiar algo visual, lee `docs/HANDOFF.md`.** Este sitio tiene
> decisiones de UI, responsive y movimiento que están medidas y documentadas.
> Lo que parece un descuido casi siempre es una decisión con un número detrás.

---

## Requisitos

| | |
|---|---|
| **Node** | ≥ 20.9 (declarado en `package.json`). Desarrollado con Node 26 |
| **npm** | El que traiga tu Node. Hay `package-lock.json`, así que usa `npm ci` |
| **Sistema** | Nada específico. No hay dependencias nativas propias ni servicios locales |

No hace falta base de datos, ni backend, ni cuenta de ningún servicio para
levantar el proyecto.

## Instalación y ejecución

```bash
npm ci                 # instalación exacta desde el lockfile
npm run dev            # → http://localhost:3000  · desarrollo con recarga
```

La raíz `/` redirige a `/es`. El idioma vive en la URL: `/es`, `/en`, `/pt`.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo. Refleja cada guardado |
| `npm run build` | Build de producción. Genera 50 páginas estáticas |
| `npm start` | Sirve el último build. **No refleja cambios sin volver a compilar** |
| `npm run lint` | ESLint (configuración de Next + TypeScript) |
| `npm run typecheck` | `tsc --noEmit` |

**Los cuatro deben pasar en limpio antes de dar por terminado cualquier cambio.**

> `next build` y `next dev` comparten la carpeta `.next`. Si alternas entre
> ellos y las rutas de idioma empiezan a devolver 404, borra `.next` y vuelve a
> arrancar. Es un caché en estado inconsistente, no un fallo del código.

## Variables de entorno

**Ninguna es obligatoria.** Las dos que existen tienen como defecto el valor de
producción, así que el proyecto arranca y compila sin configurar nada.

```bash
cp .env.example .env.local     # y ajusta si hace falta
```

| Variable | Defecto | Cuándo importa |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://voltop.co` | **En staging y previsualizaciones.** Sin ella, el sitemap y los `canonical` de una preview le dicen a Google que el contenido canónico vive en producción |
| `NEXT_PUBLIC_GTM_ID` | `GTM-WJ5S2LBF` | **En staging.** Sin ella, el tráfico de pruebas entra en la analítica real y eso no se deshace |

**No hay secretos en este proyecto.** No hay API con clave, ni base de datos, ni
backend propio: el formulario B2B se envía por `mailto:` y la analítica se carga
desde el cliente tras el consentimiento. Si algún día entra un secreto, va en
`.env.local` — que está en `.gitignore` — y nunca en el repositorio.

## Dónde está documentado cada cosa

| Documento | Para qué |
|---|---|
| **`docs/HANDOFF.md`** | **Empieza aquí si acabas de recibir el proyecto.** Integración, qué no tocar, cómo comprobar que no hay regresiones |
| `docs/ARQUITECTURA-Y-ESPECIFICACIONES.md` | Estructura, rutas, componentes, sistema visual, responsive por viewport, accesibilidad, SEO, i18n |
| `docs/MOTION.md` | Lenguaje de movimiento: primitivas, intensidades, microinteracciones, reduced-motion |
| `docs/ENTORNO-Y-SKILLS.md` | Herramientas, skills, reglas de trabajo y cómo reproducir el entorno |
| `docs/MASTER-PROJECT-DEFINITION.md` | **Fuente normativa.** Las reglas numeradas (§) que el resto de los documentos citan |
| `docs/04-ejecucion/00-registro-de-cambios.md` | Bitácora: qué cambió, por qué y con qué evidencia se validó |
| `docs/04-ejecucion/01-punto-de-retomada.md` | Estado actual y pendientes clasificados por lo que los bloquea |
| `docs/05-assets-todo/01-registro-assets.md` | Inventario de material audiovisual |
| `docs/00-discovery/` · `01-ia/` · `02-art-direction/` · `03-design-system/` · `06-cms/` | El razonamiento previo: investigación, arquitectura de información, dirección de arte, tokens, brief de CMS |

## Estructura

```
app/                    rutas (App Router). Todo bajo app/[lang]/
components/
  ui/                   primitivas del sistema, agnósticas de contenido
  layout/               chrome del sitio (header, footer, flotantes)
  <destino>/            composición por página (home, red, empresas…)
content/
  copy/                 TODO el texto, en es/en/pt
  data/                 colecciones (estaciones, ciudades, entradas, media)
lib/
  data/                 acceso a datos — los componentes no van más allá
  i18n/                 idioma, rutas localizadas y auditoría de traducciones
  analytics/            capa de medición desacoplada
  motion.ts             el lenguaje de movimiento en valores de JS
docs/                   documentación (ver la tabla de arriba)
public/                 assets servidos
```

Reglas de arquitectura que el proyecto sostiene y conviene no romper:

1. **Server Components por defecto.** Las islas de cliente se limitan a lo que
   tiene interacción real.
2. **Cero copy literal en el JSX.** Todo el texto vive en `content/copy`.
3. **Los componentes nunca importan `content/data/*`**: siempre vía `lib/data`.
4. **Las cifras no se escriben a mano.** Puntos de carga, potencias, ciudades y
   conectores se calculan desde el dataset. Añadir una estación actualiza la
   Home sola.
5. **Todo valor visual sale de un token.** Cero literales de color o espaciado.
