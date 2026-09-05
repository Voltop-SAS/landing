/** Metrics, segments, cases, partners, testimonials and founder. */

import { businessSegments, cases } from '~/core/business/infrastructure/content/company'
import {
  metrics,
  partners,
  testimonials,
  founder,
} from '~/core/about/infrastructure/content/company'
import type { Metric } from '~/core/common/domain/entities/Metric'
import type { Case } from '~/core/business/domain/entities/Case'

/**
 * Metrics to display. `validated: false` means there is NO real figure. The UI
 * decides how to represent that; it never invents a number.
 * Rule of economy: at most two provisional figures per page (§33).
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

/** Empty until there are logos cleared for use: the UI omits the strip. */
export function getPartners() {
  return partners
}

export function getTestimonials(segment?: 'b2c' | 'b2b') {
  return segment ? testimonials.filter((t) => t.segment === segment) : testimonials
}

export function getFounder() {
  return founder
}
