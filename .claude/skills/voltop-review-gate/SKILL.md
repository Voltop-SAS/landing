---
name: voltop-review-gate
description: Gate de calidad de Voltop. Orquesta la revisión UX → UI → Responsive → Accessibility → Motion → Performance → QA antes de considerar terminado cualquier componente o página. Úsala siempre antes de marcar algo como "listo".
---

# Voltop — Review Gate

**Los principios del proyecto viven en `docs/MASTER-PROJECT-DEFINITION.md` (MPD). Este gate NO los repite: los verifica.**

## Regla de oro

> Un checkpoint no se aprueba por criterio subjetivo cuando existe un umbral medible. **Si hay un número, se mide.**

La versión anterior de este gate estaba compuesta solo de preguntas cualitativas. Resultado: se aprobaron pantallas con un token de texto que fallaba WCAG AA, con patrones ARIA incompletos, con filtros decorativos y con diez placeholders visibles. Por eso ahora cada checkpoint tiene aserciones verificables.

## Secuencia obligatoria — no se avanza con un checkpoint abierto

| # | Checkpoint | Skill responsable |
|---|---|---|
| 1 | UX | `voltop-ux-strategy` |
| 2 | UI / Art direction | `voltop-art-direction-ui` |
| 3 | Responsive | `voltop-design-system` |
| 4 | Accesibilidad | `voltop-quality-compliance` |
| 5 | Motion | `voltop-frontend-motion` |
| 6 | Performance / SEO | `voltop-quality-compliance` |
| 7 | QA final | este documento |

Cada checkpoint usa la checklist de su skill. Si falla, se devuelve antes de continuar. Registrar veredicto: **LISTO** / **DEVUELTO** (checkpoint + motivo).

## Verificación automatizable (ejecutar, no asumir)

```
npm run build          # debe pasar sin errores de tipos
npx eslint .           # cero errores y cero avisos
```

En navegador, sobre el build de producción y en los cuatro contextos (≥1440 / 1024–1439 / 640–1023 / <640):

| Aserción | Umbral |
|---|---|
| Contraste de todo texto renderizado | ≥4.5:1 (≥3:1 si ≥24px o ≥18.66px bold) |
| Objetivos táctiles interactivos | ≥44×44 px |
| Overflow horizontal | 0 px |
| Enlaces con `href="#"` o vacío | 0 |
| `<a>` planos a rutas internas | 0 — toda navegación con `next/link` |
| Recargas completas de documento al navegar | 0 |
| Idioma conservado entre páginas | sí |
| Saltos de nivel en encabezados | 0 · un solo `h1` por página |
| Skip link | presente |
| Patrones ARIA | completos o ausentes; nunca parciales |
| Elementos invisibles con `prefers-reduced-motion` | 0 |
| Placeholders de métrica visibles | ≤2 por página |
| Acciones primarias con gradiente | 1 por vista |
| Secciones consecutivas con la misma estructura | 0 |

## QA final (checkpoint 7)

- [ ] Build y lint limpios.
- [ ] Todas las aserciones anteriores medidas, no asumidas.
- [ ] Analytics: los eventos de esta pantalla existen en `lib/analytics` y se disparan.
- [ ] Contenido provisional marcado y registrado; ningún dato inventado.
- [ ] Ningún componente contiene copy literal: todo desde `content/copy`.
- [ ] Ningún componente importa `content/data` directamente: todo vía `lib/data`.
- [ ] Ningún valor visual literal suelto: todo desde tokens.
- [ ] `docs/04-ejecucion/00-registro-de-cambios.md` actualizado con qué cambió y por qué.
- [ ] Sin regresiones en las páginas que no eran objetivo del cambio.

## Cuándo el gate se detiene y pregunta

Solo ante una decisión de estrategia, producto, marca o contenido con varias alternativas razonables donde elegir cambie materialmente el resultado. Todo lo demás se resuelve con criterio y se documenta.
