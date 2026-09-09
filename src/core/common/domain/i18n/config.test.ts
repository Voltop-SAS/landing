import { describe, expect, it } from 'vitest'
import { fill } from './config'

/**
 * `fill` exists so that no figure is ever typed into a sentence (§33). What is
 * worth protecting is not the substitution itself but the two decisions around
 * it, because both are what a future edit would quietly undo.
 */
describe('fill', () => {
  it('replaces every placeholder it is given a value for', () => {
    expect(
      fill('{stations} estaciones con {points} puntos y hasta {kw} kW.', {
        stations: 2,
        points: 24,
        kw: 80,
      }),
    ).toBe('2 estaciones con 24 puntos y hasta 80 kW.')
  })

  /**
   * A name that appears twice is filled twice. The city templates name the
   * city once today, but a translator is free to repeat it — Portuguese and
   * Spanish reorder sentences — and a one-shot replace would leave the second
   * one showing braces.
   */
  it('replaces a placeholder that appears more than once', () => {
    expect(fill('{city}: cargar en {city}.', { city: 'Medellín' })).toBe(
      'Medellín: cargar en Medellín.',
    )
  })

  /**
   * THE DECISION THIS PROTECTS, from the function's own comment: an unknown
   * placeholder is LEFT VISIBLE rather than blanked. Copy and code are edited
   * by different people on different days, and a `{kw}` on screen is a bug
   * somebody reports, while an empty gap is one nobody sees.
   */
  it('leaves a placeholder it has no value for visible', () => {
    expect(fill('hasta {kw} kW', {})).toBe('hasta {kw} kW')
  })

  it('accepts numbers without the caller stringifying them', () => {
    expect(fill('{n}', { n: 0 })).toBe('0')
  })
})
