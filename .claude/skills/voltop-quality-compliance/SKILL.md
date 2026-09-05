---
name: voltop-quality-compliance
description: Accessibility (WCAG 2.1 AA), Performance (Core Web Vitals), Technical SEO y cumplimiento legal de datos para Voltop. Úsala para auditar cualquier componente o página antes de darlo por terminado.
---

# Voltop — Quality & Compliance

**Referencia normativa: `docs/MASTER-PROJECT-DEFINITION.md` §23 (a11y), §29 (SEO/perf), §38 (legal).**

Accesibilidad, rendimiento, visibilidad y cumplimiento son **requisitos de aceptación**, no una fase final.

## Accesibilidad — WCAG 2.1 AA, umbrales medibles

| Criterio | Umbral | Se verifica |
|---|---|---|
| Contraste texto normal | ≥4.5:1 | Calculando sobre el color renderizado, no sobre el token teórico |
| Contraste texto grande (≥24px o ≥18.66px bold) | ≥3:1 | Igual |
| Contraste de bordes e iconos significativos | ≥3:1 | |
| Objetivo táctil | ≥44×44 px | En viewport móvil real |
| Foco visible | Outline 2px, nunca eliminado | Recorriendo con Tab |
| Encabezados | Un `h1` por página, cero saltos de nivel | Listando el outline completo |
| Landmarks | `header`, `nav`, un solo `main`, `footer` | |
| Skip link | Presente en todas las páginas | |
| Formularios | Label asociado, `autocomplete`, error por `aria-describedby`, foco gestionado | |
| Mensajes de estado | `role="status"` o `aria-live` | |
| Overlays | Escape, foco atrapado, scroll bloqueado | |
| `lang` | Correcto en el HTML **servido** | `curl` del HTML, no el DOM |
| Reduced motion | 0 elementos invisibles | Recorriendo la página en ambos modos |

**ARIA: patrones completos o ninguno.** Un `role="tab"` sin `tabpanel`, `aria-controls` y navegación por flechas degrada más que no poner ARIA.

## Performance — budget

| Métrica | Objetivo |
|---|---|
| Lighthouse | ≥90 |
| LCP | <2.5s |
| CLS | <0.1 |
| INP | saludable |
| Animaciones | 60fps, también en gama baja |

Reglas duras: solo animar `transform` y `opacity` · imágenes AVIF/WebP responsivas vía `next/image` · video con poster, `preload="none"` y lazy-load · Server Components por defecto para no engordar el bundle · reservar espacio con relación de aspecto para evitar CLS.

**Medir con red y CPU limitadas.** Los tiempos en local no son indicativos. Volver a medir cuando entren los medios reales: el payload cambia por completo.

## SEO técnico

- `metadataBase`, title y description por página, canonical.
- `sitemap.ts` y `robots.ts` **generados desde los datos**, nunca a mano.
- Imagen Open Graph por idioma.
- `hreflang` recíproco + `x-default`.
- Datos estructurados: `Organization` en el sitio, `EVChargingStation` por estación, `BreadcrumbList` en rutas profundas.
- HTML semántico e indexable en ambos idiomas.
- **Cada estación y cada ciudad es una landing de búsqueda local**: es el canal de adquisición B2C más barato del proyecto y se trata como activo.
- Una página sin contenido definitivo se marca `noindex` hasta tenerlo.

## Cumplimiento legal de datos

**Ley 1581 de 2012 y decretos reglamentarios (Colombia).** Toda captura de datos personales exige:
- Autorización **previa, expresa e informada** mediante casilla no premarcada.
- Enlace accesible a la política de tratamiento de datos.
- Finalidad del tratamiento declarada.

Ningún formulario se publica sin esto. **El texto legal lo emite el área legal de Voltop: no se redacta ni se aproxima.**

## Definition of Done

- [ ] Todos los umbrales de accesibilidad **medidos**, no asumidos.
- [ ] ARIA completa o ausente.
- [ ] Performance budget verificado con limitación de red y CPU.
- [ ] Metadata, canonical, hreflang, sitemap, robots y datos estructurados correctos.
- [ ] Contenido sin versión definitiva marcado `noindex`.
- [ ] Captura de datos con consentimiento y política enlazada.
