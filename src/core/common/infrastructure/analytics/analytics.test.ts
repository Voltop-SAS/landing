import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { CONSENT_KEY } from './consent'
import { track } from './analytics'

/**
 * Consent is read on every emission and nothing is buffered. Both halves are
 * asserted here: an event before acceptance leaves no trace, and acceptance
 * does not make it appear retroactively.
 */
describe('track', () => {
  beforeEach(() => {
    localStorage.clear()
    delete window.dataLayer
  })

  afterEach(() => {
    localStorage.clear()
    delete window.dataLayer
  })

  it('drops the event, without queueing it, while there is no consent', () => {
    track('language_switch', { from: 'es', to: 'en' })
    expect(window.dataLayer).toBeUndefined()

    /* Accepting afterwards must not surface what happened before. */
    localStorage.setItem(CONSENT_KEY, 'aceptado')
    track('view_station', { slug: 'hyatt-bogota' })
    expect(window.dataLayer).toEqual([{ event: 'view_station', slug: 'hyatt-bogota' }])
  })

  it('drops the event after an explicit refusal', () => {
    localStorage.setItem(CONSENT_KEY, 'rechazado')
    track('generate_lead', { form_id: 'lead_empresas', segment: 'flotas' })
    expect(window.dataLayer).toBeUndefined()
  })

  it('pushes the event and its props flat onto dataLayer once accepted', () => {
    localStorage.setItem(CONSENT_KEY, 'aceptado')
    track('app_download_click', { store: 'auto', placement: 'header' })
    expect(window.dataLayer).toEqual([
      { event: 'app_download_click', store: 'auto', placement: 'header' },
    ])
  })
})
