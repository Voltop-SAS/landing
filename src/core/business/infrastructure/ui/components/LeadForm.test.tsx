import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { track } from '~/core/common/infrastructure/analytics'
import { LeadForm } from './LeadForm'

/* The analytics layer is replaced whole: what is asserted below is WHICH event
   the form emits and WHEN, not whether `dataLayer` receives it. */
vi.mock('~/core/common/infrastructure/analytics', () => ({ track: vi.fn() }))
const trackMock = vi.mocked(track)

/**
 * These tests exist because the form was moved to React Hook Form + Zod, and
 * the thing worth protecting in that move is not the validation — it is the
 * accessibility around it. Every assertion here maps to a guarantee stated in
 * the component's own header: errors wired with `aria-describedby`, fields
 * marked `aria-invalid`, an announced summary, and required-ness declared in
 * the DOM rather than in a decorative asterisk.
 */

const render_ = () =>
  render(
    <LeadForm
      locale="es"
      segmentKey="flotas"
    />,
  )

/**
 * Fills every required field and submits.
 *
 * Fields are reached by role and position rather than by label, for the reason
 * the file already gives: the labels are Spanish product copy and matching them
 * would tie these tests to the wording. The honeypot is `aria-hidden`, so it is
 * not in the accessibility tree and `getAllByRole` never returns it — which is
 * itself part of what these tests assert, since a honeypot a screen reader
 * offers to a person is a honeypot that discards real leads.
 */
const fillAndSubmit = async (user: ReturnType<typeof userEvent.setup>) => {
  const [name, email, company] = screen.getAllByRole('textbox')
  await user.type(name, 'Ana Torres')
  await user.type(email, 'ana@empresa.co')
  await user.type(company, 'Transportes del Norte SAS')
  await user.click(screen.getByRole('checkbox'))
  await user.click(screen.getByRole('button', { name: /enviar|solicitar|contact/i }))
}

describe('LeadForm', () => {
  it('blocks an empty submit and reports every required field', async () => {
    const user = userEvent.setup()
    render_()

    await user.click(screen.getByRole('button', { name: /enviar|solicitar|contact/i }))

    /* The summary is what a screen reader announces first. */
    expect(screen.getByRole('alert')).toBeInTheDocument()

    /* Three required text fields flagged, plus consent. Fields are matched by
       role and state rather than by label: the labels are product copy in
       Spanish and would tie this test to the wording. */
    expect(
      screen.getAllByRole('textbox').filter((i) => i.getAttribute('aria-invalid')),
    ).toHaveLength(3)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('wires each error to its field with aria-describedby', async () => {
    const user = userEvent.setup()
    render_()

    await user.click(screen.getByRole('button', { name: /enviar|solicitar|contact/i }))

    const invalid = screen.getAllByRole('textbox').filter((i) => i.getAttribute('aria-invalid'))
    expect(invalid.length).toBeGreaterThan(0)

    for (const input of invalid) {
      const describedBy = input.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()
      /* The id it points at must exist AND carry the message: a dangling
         aria-describedby is worse than none, it announces nothing. */
      const target = document.getElementById(describedBy!.split(' ')[0])
      expect(target).not.toBeNull()
      expect(target!.textContent?.trim().length).toBeGreaterThan(0)
    }
  })

  it('rejects a malformed email and clears the error once it is valid', async () => {
    const user = userEvent.setup()
    render_()

    const email = screen.getByRole('textbox', { name: /correo|email/i })
    await user.type(email, 'no-es-un-correo')
    await user.click(screen.getByRole('button', { name: /enviar|solicitar|contact/i }))

    expect(email).toHaveAttribute('aria-invalid', 'true')

    await user.clear(email)
    await user.type(email, 'persona@empresa.co')
    await user.click(screen.getByRole('button', { name: /enviar|solicitar|contact/i }))

    expect(email).not.toHaveAttribute('aria-invalid')
  })

  it('declares required-ness in the DOM, not only with the asterisk', () => {
    render_()

    const required = screen.getAllByRole('textbox').filter((i) => i.hasAttribute('required'))
    expect(required).toHaveLength(3)
    for (const input of required) {
      expect(input).toHaveAttribute('aria-required', 'true')
    }
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required', 'true')
  })
})

/**
 * DELIVERY. These are the tests the form did not have and most needed: it used
 * to declare success unconditionally because a `mailto:` cannot report an
 * outcome, so "it sent" and "it failed" were the same code path. They are two
 * now, and nothing but a test keeps them apart.
 */
describe('LeadForm · delivery', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    /* The component logs the failure on purpose; the test does not need it. */
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('posts the lead to the endpoint and confirms only then', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue({ ok: true })
    render_()

    await fillAndSubmit(user)

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/leads')
    expect(init.method).toBe('POST')

    const payload = JSON.parse(init.body)
    expect(payload).toMatchObject({
      name: 'Ana Torres',
      email: 'ana@empresa.co',
      company: 'Transportes del Norte SAS',
      consent: true,
      /* The segment travels with the lead even though the form stopped
         displaying it. */
      segment: 'flotas',
      /* The language it was filled in, so the reply comes back in it. */
      locale: 'es',
      /* Untouched by a person, which is the whole point. */
      website: '',
    })

    expect(await screen.findByRole('status')).toBeInTheDocument()
  })

  it('reports a failed send and keeps what was typed', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue({ ok: false, status: 502 })
    render_()

    await fillAndSubmit(user)

    /* The confirmation must NOT appear: nothing reached anyone. */
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    /* The form is still mounted and still filled in, so retrying is one click
       and not the whole form again. */
    const [name] = screen.getAllByRole('textbox')
    expect(name).toHaveValue('Ana Torres')

    /* And the button now offers the retry rather than repeating "send". */
    expect(screen.getByRole('button', { name: /intentar/i })).toBeInTheDocument()
  })

  it('does not post at all while the form is invalid', async () => {
    const user = userEvent.setup()
    render_()

    await user.click(screen.getByRole('button', { name: /enviar|solicitar|contact/i }))

    expect(fetchMock).not.toHaveBeenCalled()
  })
})

/**
 * MEASUREMENT. The events are the B2B funnel — began, failed, converted — and
 * the one that matters most, `generate_lead`, must fire only when the server
 * has confirmed. These tests pin the catalogue names (Tagging Plan v1.1) and
 * the moment each one fires.
 */
describe('LeadForm · events', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    trackMock.mockReset()
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  const eventsNamed = (name: string) => trackMock.mock.calls.filter(([event]) => event === name)

  it('emits form_start once, on the first interaction', async () => {
    const user = userEvent.setup()
    render_()

    const [name, email] = screen.getAllByRole('textbox')
    await user.type(name, 'Ana')
    await user.type(email, 'ana@empresa.co')

    expect(eventsNamed('form_start')).toHaveLength(1)
    expect(trackMock).toHaveBeenCalledWith('form_start', {
      form_id: 'lead_empresas',
      segment: 'flotas',
    })
  })

  it('emits form_error with the invalid field NAMES on a blocked submit', async () => {
    const user = userEvent.setup()
    render_()

    await user.click(screen.getByRole('button', { name: /enviar|solicitar|contact/i }))

    const [call] = eventsNamed('form_error')
    expect(call[1]).toMatchObject({
      form_id: 'lead_empresas',
      segment: 'flotas',
      reason: 'validation',
    })
    /* Names, never values: nothing typed by a person may travel. */
    expect(String(call[1]?.fields).split(',')).toEqual(
      expect.arrayContaining(['name', 'email', 'company']),
    )
    expect(eventsNamed('generate_lead')).toHaveLength(0)
  })

  it('emits generate_lead only after the server confirms', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue({ ok: true })
    render_()

    await fillAndSubmit(user)
    await waitFor(() => expect(eventsNamed('generate_lead')).toHaveLength(1))

    expect(trackMock).toHaveBeenCalledWith('generate_lead', {
      form_id: 'lead_empresas',
      segment: 'flotas',
    })
    expect(eventsNamed('form_error')).toHaveLength(0)
  })

  it('emits form_error with reason `send`, and no conversion, when the send fails', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue({ ok: false, status: 502 })
    render_()

    await fillAndSubmit(user)
    await waitFor(() => expect(eventsNamed('form_error')).toHaveLength(1))

    expect(trackMock).toHaveBeenCalledWith('form_error', {
      form_id: 'lead_empresas',
      segment: 'flotas',
      reason: 'send',
    })
    expect(eventsNamed('generate_lead')).toHaveLength(0)
  })

  it('never carries what the person typed', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue({ ok: true })
    render_()

    await fillAndSubmit(user)
    await waitFor(() => expect(eventsNamed('generate_lead')).toHaveLength(1))

    const everything = JSON.stringify(trackMock.mock.calls)
    expect(everything).not.toContain('Ana Torres')
    expect(everything).not.toContain('ana@empresa.co')
    expect(everything).not.toContain('Transportes del Norte')
  })
})
