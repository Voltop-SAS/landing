import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LeadForm } from './LeadForm'

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
      segmentLabel="Flotas"
    />,
  )

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
