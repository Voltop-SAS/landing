import { afterEach, describe, expect, it, vi } from 'vitest'
import { CONSENT_KEY, analyticsAllowed, readConsent } from './consent'

/**
 * The question this module answers is «may we measure?», and the safe answer
 * to anything it does not understand is no. Every case below that is not the
 * literal `aceptado` has to come out as not allowed.
 */
describe('consent', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('reports no decision when nothing is stored', () => {
    expect(readConsent()).toBeNull()
    expect(analyticsAllowed()).toBe(false)
  })

  it('allows analytics only when the stored decision is `aceptado`', () => {
    localStorage.setItem(CONSENT_KEY, 'aceptado')
    expect(readConsent()).toBe('aceptado')
    expect(analyticsAllowed()).toBe(true)
  })

  it('reads a refusal as a decision, and as no', () => {
    localStorage.setItem(CONSENT_KEY, 'rechazado')
    expect(readConsent()).toBe('rechazado')
    expect(analyticsAllowed()).toBe(false)
  })

  it('treats anything that is not one of the two literals as undecided', () => {
    /* The stored values are a contract in Spanish; an English spelling or a
       boolean written by mistake must not be taken as consent. */
    for (const stray of ['accepted', 'true', '1', 'ACEPTADO', '']) {
      localStorage.setItem(CONSENT_KEY, stray)
      expect(readConsent()).toBeNull()
      expect(analyticsAllowed()).toBe(false)
    }
  })

  it('answers no when storage cannot be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    expect(readConsent()).toBeNull()
    expect(analyticsAllowed()).toBe(false)
  })
})
