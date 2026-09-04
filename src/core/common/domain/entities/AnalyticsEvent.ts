/**
 * EL PLAN DE MEDICIÓN, COMO TIPO
 * Ver docs/MASTER-PROJECT-DEFINITION.md §31.
 *
 * `EventName` no es un detalle de implementación de la herramienta de
 * analítica: es el catálogo cerrado de lo que el producto declara medir, y
 * sobrevive intacto a cambiar de GA4 a Segment o a PostHog. Por eso vive en
 * dominio y no junto al `dispatch` que lo envía. Añadir un evento al plan es
 * añadir una variante aquí, y el compilador se encarga de que nadie emita uno
 * que no esté en la lista.
 */

export type EventName =
  // B2C
  | 'cta_encontrar_cargador_click'
  /* El CTA global del header pasó a ser la descarga de la app. Se conserva
     `cta_encontrar_cargador_click` porque sigue usándose en los CTA de página
     que llevan a /red; el del header ahora emite este. */
  | 'cta_descargar_app_click'
  | 'red_buscar'
  | 'red_filtro_aplicado'
  | 'red_filtros_limpiados'
  | 'ciudad_vista'
  | 'estacion_vista'
  | 'estacion_como_llegar'
  | 'app_store_click'
  // B2B
  | 'cta_b2b_click'
  | 'empresas_selector_caso'
  | 'lead_form_inicio'
  | 'lead_form_error'
  | 'lead_form_envio'
  | 'lead_form_exito'
  // Novedades
  | 'novedades_vista'
  | 'novedad_vista'
  // Idioma
  | 'idioma_cambiado'
  // Marca
  | 'caso_visto'
  | 'impacto_visto'
  | 'media_reproducida'

export type EventProps = Record<string, string | number | boolean | null | undefined>
