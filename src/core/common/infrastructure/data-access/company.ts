/** Métricas, segmentos, casos, aliados, testimonios y fundador. */

import {
  metrics,
  businessSegments,
  cases,
  partners,
  testimonials,
  founder,
  type Metric,
  type Case,
} from '@/content/data/company'

/**
 * Métricas para mostrar. `validated: false` significa que NO hay cifra real.
 * La UI decide cómo representarlo; nunca inventa un número.
 * Regla de economía: máximo dos provisionales por página (§33).
 */
export function getMetrics(opts: { onlyValidated?: boolean; limit?: number } = {}): Metric[] {
  let list = metrics
  if (opts.onlyValidated) list = list.filter((m) => m.validated)
  if (opts.limit) list = list.slice(0, opts.limit)
  return list
}

export function getBusinessSegments() {
  return businessSegments
}

export function getFeaturedCase(): Case | undefined {
  return cases.find((c) => c.featured)
}

/** Vacío mientras no haya logos con permiso de uso: la UI omite la franja. */
export function getPartners() {
  return partners
}

export function getTestimonials(segment?: 'b2c' | 'b2b') {
  return segment ? testimonials.filter((t) => t.segment === segment) : testimonials
}

export function getFounder() {
  return founder
}
