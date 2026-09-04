/**
 * THE MEASUREMENT PLAN, AS A TYPE
 * See docs/MASTER-PROJECT-DEFINITION.md §31.
 *
 * `EventName` is not an implementation detail of the analytics tool: it is the
 * closed catalogue of what the product declares it measures, and it survives
 * intact through a move from GA4 to Segment or PostHog. That is why it lives in
 * the domain and not next to the `dispatch` that sends it. Adding an event to
 * the plan means adding a variant here, and the compiler makes sure nobody
 * emits one that is not on the list.
 *
 * The event names themselves stay in Spanish: they are the plan, and renaming
 * one silently splits a metric in two. See the contract list in AGENTS.md.
 */

export type EventName =
  // B2C
  | 'cta_encontrar_cargador_click'
  /* The header's global CTA became the app download. The older
     `cta_encontrar_cargador_click` is kept because the in-page CTAs that lead
     to /red still use it; the header one now emits this instead. */
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
