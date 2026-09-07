# Flujo de trabajo

Estado a **2026-09-07**. Cómo entran los ajustes en el sitio publicado sin
tocar staging por accidente.

---

## Las ramas, y qué hace cada una

| Rama | Qué es |
|---|---|
| `production` | Lo que ven los usuarios |
| `staging` | **El ambiente publicado de revisión.** Un push aquí despliega |
| `ajustes/post-handoff` | Donde se trabaja. Salió de `staging` el 2026-09-07 |

**Nada más despliega.** Los tres workflows de `.github/workflows/` se disparan
solo con `push` a `staging` o `production`. Trabajar en una rama propia no
levanta nada, no gasta build y no puede romper lo publicado.

`staging` **no está protegida**: técnicamente se le puede empujar directo. No se
hace. Las cinco veces que ha cambiado ha sido por PR, y esa revisión es lo único
que hay entre un cambio y el ambiente publicado.

---

## El ciclo

```bash
# 1 · antes de empezar el día, traer lo que hayan movido otros
git checkout ajustes/post-handoff
git fetch origin
git rebase origin/staging          # ver la nota de abajo

# 2 · trabajar y verificar en local
npm run dev                        # → http://localhost:3000

# 3 · antes de commitear, la cadena completa
npm run lint && npm run typecheck && npm test && npm run build

# 4 · commit y push
git add -A
git commit -m "…"
git push

# 5 · abrir el PR contra staging (o dejarlo abierto desde el primer commit)
gh pr create --base staging --head ajustes/post-handoff
```

Al mergear el PR, el push a `staging` dispara el despliegue solo.

### Por qué `rebase` y no `merge`

Si alguien mueve `staging` mientras trabajas, `rebase` vuelve a apoyar tus
commits encima de lo nuevo y el PR sigue enseñando **solo tus cambios**. Con
`merge` el PR arrastra commits ajenos y quien revisa deja de distinguir qué
propusiste tú.

Con una condición: **rebase solo mientras nadie más trabaje en esa rama**.
Reescribe los commits, así que si otra persona la tiene descargada, le rompe la
suya. Si sois dos en la rama, `merge`.

---

## Dos cosas que muerden

### El hook reformatea lo que toques

`.husky/pre-commit` corre `lint-staged`, que aplica `prettier --write` a todo
`.js/.ts/.tsx/.html/.css` que entre en el commit. Es la convención del equipo y
está bien que exista.

Lo que hay que saber: **reformatea el fichero entero, no solo tus líneas**. Si
tocas un fichero que no cumple el formato, el commit trae tu cambio *y* el
reformateo de todo lo demás, y el `git blame` deja de llevar al bloque del
registro que explica cada decisión.

Para saltártelo en un commit concreto: `git commit --no-verify`. Y si hay que
homogeneizar, que sea **un commit propio y solo de formato**.

### `dev` y `build` comparten `.next`

Alternarlos sin limpiar deja ese directorio en un estado que `dev` no digiere:
**404 en `/es`, `/en` y `/pt` a la vez** —todas las rutas de idioma, que es la
pista de que no es el código—. Se arregla con `rm -rf .next`.

---

## Dónde está cada cosa después de la reestructuración

El desarrollador movió el proyecto a `src/` con arquitectura por dominios. Los
documentos de `docs/` **todavía citan las rutas viejas**. La equivalencia:

| Antes | Ahora |
|---|---|
| `app/` | `src/app/` — las rutas cuelgan de `[locale]`, no de `[lang]` |
| `components/ui/` | `src/ui/common/components/ui/` |
| `components/layout/` | `src/ui/common/components/layout/` |
| `components/home/`, `red/`… | `src/core/<dominio>/infrastructure/ui/components/` |
| `lib/motion.ts`, `cn.ts`… | `src/ui/common/lib/` |
| `content/copy/*` | `src/core/<dominio>/domain/consts/copy.ts` |
| `content/data/*` | `src/core/common/infrastructure/data-access/` |
| — | `src/test/` — 58 tests en 7 ficheros, con `npm test` |

Los dominios son `home`, `network`, `business`, `news`, `about`, `legal` y
`common`.

**Esta tabla es un puente, no una actualización.** Los documentos siguen
diciendo `components/ui/Reveal.tsx` donde hoy hay otra ruta. Actualizarlos es un
trabajo pendiente y está anotado en el punto de retomada.
