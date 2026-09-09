---
name: voltop-ux-writing
description: UX Writing y SEO copy para Voltop — headlines, navegación, CTAs, formularios, labels, estados, errores, empty states y copy placeholder realista (nunca Lorem Ipsum). Úsala al escribir o revisar cualquier texto del producto.
---

# Voltop — UX Writing & Content

**Referencia normativa: `docs/MASTER-PROJECT-DEFINITION.md` §19 (writing), §18 (contenido), §33 (placeholders).**

## Dónde vive el texto

**Ningún componente contiene copy literal.** Todo el texto vive en `content/copy/*` como `Localized = { es, en }` con ambos idiomas obligatorios. Sin esta capa no hay flujo de traducción, ni revisión editorial, ni ruta a un CMS.

Se escribe primero en español. Lo que no se traduce (nombres propios, unidades) se modela como string plano.

## Tono

Claro y humano · tecnológico y preciso · premium y sobrio. Explica sin jerga vacía. Refuerza el posicionamiento: infraestructura + tecnología, **no "una app"**.

Sin lenguaje corporativo hueco, sin superlativos de marketing, sin promesas infladas.

## Reglas duras

1. **Un titular es un contrato.** No prometer capacidades que el producto no tiene. Si no hay integración de disponibilidad, ningún texto dice "en tiempo real".
2. **Nunca Lorem Ipsum.** Copy realista y contextual de Voltop, marcado si es provisional.
3. **Nunca inventar cifras ni datos de negocio.** Lo que falta se declara: "en validación" es mejor copy que un número falso.
4. **Máximo dos placeholders de métrica visibles por página.** Un placeholder es honesto; diez seguidos destruyen la credibilidad.
5. **CTAs:** verbo + valor, diferenciados por audiencia. Nunca dos CTAs compitiendo por la misma acción.
6. Un hueco de media declara **qué falta y qué función cumple**, no solo que falta.

## Estados

- **Errores accionables:** qué pasó + cómo resolverlo. "Revisa el correo: parece que falta algo (ejemplo: nombre@empresa.com)", no "Campo inválido".
- **Empty states** que orientan hacia la siguiente acción y, cuando aplica, comunican momentum ("la red crece cada mes").
- **Loading y éxito** con personalidad contenida: informar la expectativa real de respuesta, no celebrar.
- **Consentimiento de datos:** declarar la finalidad del tratamiento y enlazar la política. Redacción informada, no legalismo decorativo.

## SEO copy

Titles y descriptions por página, encabezados semánticos, texto alternativo real y descriptivo. Lenguaje que sirve a personas y buscadores, sin keyword stuffing.

Para estaciones y ciudades, escribir pensando en la búsqueda real del usuario, que es geográfica y concreta.

## Definition of Done

- [ ] Cero copy literal en componentes; todo en `content/copy`.
- [ ] Ambos idiomas presentes; nada cae silenciosamente al español.
- [ ] Tono consistente: claro, humano, tecnológico, premium.
- [ ] Cero Lorem Ipsum; provisionales marcados y registrados.
- [ ] Ningún titular promete lo que el producto no hace.
- [ ] Cero cifras inventadas; ≤2 placeholders de métrica por página.
- [ ] CTAs con verbo + valor, diferenciados y sin competir.
- [ ] Errores accionables; empty states orientadores.
- [ ] Titles, descriptions, encabezados y alt presentes y con sentido.
