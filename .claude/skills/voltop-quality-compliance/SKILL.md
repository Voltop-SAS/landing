---
name: voltop-quality-compliance
description: Accessibility (WCAG 2.1 AA), Performance (Core Web Vitals) y Technical SEO para Voltop. Úsala para auditar accesibilidad, rendimiento y SEO técnico de cualquier componente o página antes de darlo por terminado.
---

# Voltop — Quality & Compliance

## Responsabilidad
Garantizar que la experiencia premium no sacrifique accesibilidad, rendimiento ni visibilidad. Es requisito de diseño, no una fase final.

## Accesibilidad (objetivo WCAG 2.1 AA)
- Contraste suficiente en texto e íconos significativos.
- Navegación completa por teclado; foco visible y lógico.
- Semántica correcta (encabezados, landmarks, roles).
- Texto alternativo y etiquetas; formularios con labels y errores asociados.
- `prefers-reduced-motion` respetado; touch targets accesibles.
- Sin trampas de foco; contenido dinámico anunciado cuando corresponde.

## Performance (Core Web Vitals — performance budget)
- Lighthouse ≥ 90; LCP < 2.5s; CLS bajo; INP saludable; 60fps en animaciones.
- Imágenes AVIF/WebP y responsivas; lazy-load de pesados.
- Solo animar `transform`/`opacity`; evitar bloqueos de render.
- Performance verificada también en dispositivos de gama baja.

## Technical SEO
- Metadatos (title, description) y Open Graph.
- HTML semántico y estructura de encabezados correcta.
- Datos estructurados (Organization, LocalBusiness para estaciones cuando aplique).
- Sitemap, URLs limpias, canonical, contenido indexable.
- Rendimiento como factor SEO.

## Checklist (Definition of Done)
- [ ] Contraste, teclado y foco verificados.
- [ ] Semántica, landmarks y alt correctos.
- [ ] Formularios accesibles (labels, errores, foco).
- [ ] `prefers-reduced-motion` y touch targets OK.
- [ ] Performance budget cumplido (Lighthouse, LCP, CLS, INP, 60fps).
- [ ] Verificado en gama baja.
- [ ] Metadatos, semántica, datos estructurados y sitemap correctos.
