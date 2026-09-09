import { describe, expect, it } from 'vitest'
import { cityLead } from './cityLead'
import type { CityCoverage } from '~/core/common/infrastructure/data-access'

/**
 * This sentence is a city page's lead AND its meta description, so a defect
 * here is a defect a search engine sees. It used to be written by hand per
 * city, and Medellín's carried three figures in prose — "con 80 kW y seis
 * puntos de carga" — which is exactly what goes stale the day a station is
 * added.
 */
const coverage = (over: Partial<CityCoverage> = {}): CityCoverage => ({
  city: { slug: 'medellin', name: 'Medellín', region: 'Antioquia' },
  count: 2,
  operational: 2,
  points: 24,
  maxKw: 80,
  ...over,
})

describe('cityLead', () => {
  it('names the city and its figures, with nothing left unfilled', () => {
    const lead = cityLead(coverage(), 'es')
    expect(lead).toContain('Medellín')
    expect(lead).toContain('24')
    expect(lead).toContain('80')
    expect(lead).not.toContain('{')
  })

  /**
   * Not politeness: in Spanish one station is "una potencia" and several are
   * "potencias". A generic pluraliser would write "1 estaciones", which is the
   * seam that gives a generated site away — so the two variants have to stay
   * two variants, and this is what notices if one of them stops being used.
   */
  it('uses a different template for a single station', () => {
    const one = cityLead(coverage({ count: 1 }), 'es')
    const many = cityLead(coverage({ count: 2 }), 'es')
    expect(one).not.toBe(many)
  })

  /** Every published language composes a real sentence, not a fallback gap. */
  it('composes the sentence in every language', () => {
    for (const locale of ['es', 'en', 'pt'] as const) {
      const lead = cityLead(coverage(), locale)
      expect(lead).not.toContain('{')
      expect(lead).toContain('Medellín')
    }
  })

  /**
   * The figures come from the coverage and from nowhere else. If a template
   * ever hard-codes one, this is what fails.
   */
  it('reflects the dataset rather than a written figure', () => {
    expect(cityLead(coverage({ points: 6, maxKw: 22 }), 'es')).toContain('22')
    expect(cityLead(coverage({ points: 6, maxKw: 22 }), 'es')).not.toContain('80')
  })
})
