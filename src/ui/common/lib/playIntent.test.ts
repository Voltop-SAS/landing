import { describe, expect, it } from 'vitest'
import { requestPlayOnArrival, consumePlayOnArrival } from './playIntent'

/**
 * This module is four lines long and it decides whether a video starts TALKING
 * on its own. Everything worth testing is in what it refuses to do: audio that
 * plays unasked is both a WCAG 1.4.2 problem and the kind of thing that makes
 * someone close the tab.
 */
describe('playIntent', () => {
  it('hands the intent to the piece that was clicked', () => {
    requestPlayOnArrival('/apertura-ean.mp4')
    expect(consumePlayOnArrival('/apertura-ean.mp4')).toBe(true)
  })

  /**
   * Keyed by `src` and not by route on purpose: the intent belongs to the
   * PIECE. Without this, clicking the home page's silent background would arm
   * whatever video the destination happened to hold.
   */
  it('does not hand it to a different piece', () => {
    requestPlayOnArrival('/apertura-ean.mp4')
    expect(consumePlayOnArrival('/vision-ceo.mp4')).toBe(false)
  })

  /**
   * Consumed on read, so it fires ONCE. React mounts every effect twice in
   * development, and a second true would be a video restarting itself.
   */
  it('is consumed once and never twice', () => {
    requestPlayOnArrival('/vision-ceo.mp4')
    expect(consumePlayOnArrival('/vision-ceo.mp4')).toBe(true)
    expect(consumePlayOnArrival('/vision-ceo.mp4')).toBe(false)
  })

  it('reports no intent when nobody clicked anything', () => {
    expect(consumePlayOnArrival('/never-requested.mp4')).toBe(false)
  })
})
