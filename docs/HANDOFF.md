# Handoff · integración en el repositorio corporativo

**Para la persona que recibe el ZIP.** Léelo antes de tocar nada; son cinco
minutos y evitan el problema más probable de esta integración.

---

## 1 · Qué estás recibiendo

El sitio público de Voltop, **terminado y funcionando**: Next.js 16 (App
Router), React 19, TypeScript, Tailwind 4, Motion. 50 páginas estáticas en tres
idiomas (es/en/pt).

No es un prototipo ni un punto de partida. Es una versión con decisiones de UI,
responsive, accesibilidad y movimiento **medidas y documentadas**.

### La regla que importa

> **Integrar el proyecto en el repositorio no autoriza a reinterpretar su
> UI/UX.** La primera integración busca **fidelidad 1:1** con lo entregado.

Esto no es celo de nadie: el sitio está lleno de decisiones que parecen
descuidos y no lo son. Ejemplos reales que un desarrollador con buen criterio
"arreglaría" y no debe:

- **El Hero no anima nada al cargar.** La quietud es la decisión, y además
  protege el LCP.
- **La sección 2 mide 170vh y se queda fijada.** Con `prefers-reduced-motion`
  colapsa a altura normal — eso también es intencional.
- **El pie tiene 11rem de padding extra en móvil.** Reserva el hueco de la barra
  flotante; sin él los enlaces legales quedan inalcanzables al final de la
  página.
- **`.glass` no declara `position`.** Declararla rompe el anclaje de los
  elementos fijos, porque tiene la misma especificidad que `.fixed` de Tailwind.
- **Las tarjetas del caso EAN y algunos huecos muestran "FOTO · PENDIENTE".**
  Es el patrón declarado del proyecto para material no entregado, no un bug.
- **Los comentarios largos del código son documentación.** Explican por qué,
  con el número que lo respalda.

Si algo parece un error, **búscalo primero en
`docs/04-ejecucion/00-registro-de-cambios.md`**: 58 bloques con el porqué de
cada decisión y la evidencia que la validó.

## 2 · Qué necesitas instalar

| | |
|---|---|
| **Node** | ≥ 20.9 (declarado en `package.json`). Desarrollado con Node 26 |
| **npm** | El de tu Node. Usa `npm ci`, hay lockfile |
| **Nada más** | Sin base de datos, sin backend, sin cuentas, sin servicios locales |

## 3 · Cómo levantarlo

```bash
npm ci
npm run dev          # → http://localhost:3000  (la raíz redirige a /es)
```

## 4 · Variables de entorno

**Ninguna es obligatoria.** Las dos que existen tienen como defecto el valor de
producción, así que arranca y compila sin configurar nada.

```bash
cp .env.example .env.local
```

| Variable | Defecto | **Configúrala en staging** |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://voltop.co` | Sin ella, el sitemap y los `canonical` de una preview le dicen a Google que el contenido canónico vive en producción |
| `NEXT_PUBLIC_GTM_ID` | `GTM-WJ5S2LBF` | Sin ella, el tráfico de pruebas entra en la analítica real y **eso no se deshace** |

**No hay secretos en el proyecto.** Sin API con clave, sin base de datos, sin
backend: el formulario B2B se envía por `mailto:` y la analítica se carga desde
el cliente **solo tras el consentimiento**.

## 5 · Build

```bash
npm run build        # 50 páginas estáticas
npm start            # sirve el último build
```

El build **falla a propósito** si un idioma publicado tiene traducciones
incompletas: `lib/i18n/audit.ts` se ejecuta desde `app/sitemap.ts` en cada
compilación. Si ves ese error, no es el build: falta copy.

> `next build` y `next dev` comparten `.next`. Si alternas y las rutas de idioma
> empiezan a dar 404, borra `.next`. Es caché inconsistente, no el código.

## 6 · Integración en el repositorio

1. Crea la rama de integración desde la base que uses (`main`, `develop`…).
2. Copia el contenido del ZIP **tal cual**. Ya viene sin `node_modules`, sin
   `.next` y sin `.env`. **Sí trae las skills y los ficheros de agente**: son
   parte del proyecto, no configuración personal (ver el punto 4).
3. **Conserva `.gitignore` como está.** Cada regla que no es obvia está
   comentada en el propio archivo. Las que se pierden si lo sustituyes por la
   plantilla corporativa:

   | Regla | Por qué |
   |---|---|
   | `.env*` **salvo** `!.env.example` | El ejemplo es el único que debe viajar, y `.env*` se lo traga |
   | `/.claude/settings.local.json` | Permisos de una máquina concreta: rutas absolutas de un `$HOME` y de un Chrome instalado en un sitio concreto. Lo único de `.claude/` que NO viaja |
   | `/*.mjs` en la raíz | Scripts de verificación de un solo uso |

   Aviso al verificar negaciones: **`git check-ignore` devuelve 0 también cuando
   la regla que casa es una negación**, así que un fichero rescatado "parece"
   ignorado. Lo que da la respuesta buena es `git add --dry-run`.
4. **Conserva `.agents/`, `.claude/skills/` entera y `skills-lock.json`.** Son
   el criterio con el que se construyó el proyecto, no configuración personal.
   Siete entradas de `.claude/skills/` son **enlaces simbólicos** a
   `.agents/skills/`: si los conviertes en copias o borras `.agents/`, se
   rompen. En Windows hacen falta `core.symlinks=true` y modo desarrollador.
   Ver `docs/ENTORNO-Y-SKILLS.md`.
5. Ejecuta los checks del punto 8 **antes** de abrir el PR.
6. En el PR, indica que es una integración de fidelidad 1:1 y que los cambios de
   UI/UX quedan fuera de alcance.

### Si tu repositorio tiene convenciones que chocan

Prettier, otro ESLint, otra estructura de carpetas, hooks de commit… **habla
antes de aplicarlos**. Un reformateo masivo no cambia el comportamiento pero
destruye la trazabilidad: el `git blame` deja de llevar al bloque del registro
que explica cada decisión, y ese registro es lo que hace mantenible este
proyecto. Si hay que hacerlo, que sea **un commit propio y solo de formato**,
separado de la integración.

## 7 · Dependencias externas

| Qué | Estado |
|---|---|
| `app.voltop.co` | Funcionando. Destino del CTA principal del header |
| App Store / Google Play | Enlaces reales en `content/data/links.ts` |
| Google Tag Manager | Contenedor `GTM-WJ5S2LBF`. **La plataforma de destino de los eventos sigue sin definir**: `lib/analytics` solo empuja a `dataLayer` |
| Formulario B2B | `mailto:` a tres direcciones `@voltop.co`. Sin servidor |
| Másteres de media (~609 MB) | **NO viajan en el ZIP.** Están en la máquina de origen, pendientes de subir a almacenamiento compartido. Lo que se versiona son las derivadas optimizadas |

## 8 · Cómo comprobar que no hay regresiones

Los cuatro obligatorios:

```bash
npm ci
npm run lint         # debe salir en limpio
npm run typecheck    # debe salir en limpio
npm run build        # debe generar 50 páginas
```

**No hay suite de tests unitarios, y es una decisión**: lo que hay que verificar
es geometría, contraste y comportamiento en el navegador. El método del proyecto
está en `docs/ENTORNO-Y-SKILLS.md`. Como mínimo, comprueba a mano:

| Comprobación | Cómo |
|---|---|
| **Sin desbordes horizontales** | Recorre `/es`, `/es/red`, `/es/empresas`, una ficha de estación y una entrada, a 320, 390, 768, 1024 y 1440px |
| **Los tres idiomas** | `/es`, `/en`, `/pt` responden y traducen |
| **Rutas dinámicas** | Las 2 ciudades y las 3 estaciones cargan con sus datos |
| **reduced-motion** | Actívalo en el sistema: **ningún contenido debe quedar invisible** y la sección 2 debe colapsar |
| **Teclado** | Tabula la Home entera: anillo de foco visible en todo, y el skip link primero |
| **El flotante de la app** | Oculto sobre la primera sección, aparece al pasarla, **no se esconde a mitad de página**, y vuelve a ocultarse arriba. No tiene botón de cerrar: es deliberado |
| **Recargar a media página** | Recarga con el scroll a la mitad y **sube**: no debe haber bloques invisibles. Si los hay, se rompió `useScrolledPast` |
| **Consola** | Cero errores. En desarrollo verás `[analytics]`: es intencional y está protegido por `NODE_ENV` |
| **El vídeo de la entrada de Wake** | Un solo reproductor, con controles y con audio |

## 9 · Lo que NO debes cambiar en la integración

- Copy en cualquier idioma.
- Layouts, grids, spacing, tipografía, escalas.
- Comportamiento responsive y las excepciones por viewport.
- Animaciones, transiciones, timings, easings, comportamiento de scroll.
- Estructura de rutas y navegación.
- Los tokens de `app/globals.css` y su espejo en `lib/motion.ts`.
- El `.gitignore` y sus reglas comentadas (tabla del punto 6).
- Los comentarios del código.

## 10 · Pendientes conocidos

No son fallos de la entrega: son entregas externas o decisiones abiertas.
La lista viva está en `docs/04-ejecucion/01-punto-de-retomada.md`.

| | Qué falta | Efecto hoy |
|---|---|---|
| 1 | **Cinco assets audiovisuales** | `/empresas` y `/nosotros` abren con un hueco declarado |
| 2 | **Subtítulos de la película** | Único incumplimiento WCAG AA vivo |
| 3 | **Consulta legal del aviso de cookies** | El mecanismo funciona; falta validación jurídica |
| 4 | **Plataforma de analítica sin definir** | Los eventos llegan a `dataLayer` y ahí se quedan |
| 5 | **Foto del Grand Hyatt** | Su ficha muestra el hueco declarado |
| 6 | **Seis métricas de compañía en `null`** | La UI las oculta sola: no se ve ninguna cifra de negocio |
| 7 | **`redirect` de `/` sigue en `permanent: false`** | Pasar a `true` al publicar |
| 8 | **`voltop-film.mp4`, 28 MB versionado** | Funciona. Compensa moverlo cuando crezca el catálogo |
| 9 | **Formulario por `mailto:`** | Funciona sin servidor; pierde a quien no tenga cliente de correo |

## 11 · Cuando el proyecto vuelva a manos de diseño

Quien lo dejó va a retomarlo desde el repositorio corporativo. Para que pueda
hacerlo sin reconstruir el contexto:

- **`docs/` completo debe seguir en el repositorio.** No es documentación
  histórica: `MASTER-PROJECT-DEFINITION.md` es normativo y el registro de
  cambios es la memoria del proyecto.
- **`.agents/` y `.claude/skills/` deben seguir versionadas enteras**, con sus
  siete enlaces simbólicos intactos.
- **`skills-lock.json` debe seguir versionado**: dice de qué versión viene cada
  skill de terceros y es lo que permite actualizarlas.
- Si cambias scripts, estructura de carpetas o convenciones, **documéntalo en el
  registro de cambios** con el mismo formato: qué cambió, por qué, y con qué se
  validó.
